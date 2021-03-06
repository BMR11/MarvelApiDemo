/* eslint-disable no-catch-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef, useState} from 'react';
import {RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import {getComics} from '../../api/marvelApi';
import {FontFamily, MyColors} from '../../constants/constants';
import {ComicSchemaName, getRealm} from '../../database/realm';
import {Comic, ComicViewModel} from '../../entities/entityTypes';
import {NavScreenKeys} from '../AppNavigator';
import {ComicRowView} from './ComicRowView';
import {LoadingView} from './LoadingView';
import {LoadMoreLoadingView} from './LoadMoreLoadingView';
import BigList from 'react-native-big-list';

export const ITEM_HEIGHT = 100;
export const RECORD_COUNT_PER_FETCH = 25;

export const ComicListScreen = observer(() => {
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const [refreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [hasMore, setHasMore] = useState(false);

  const [listData, setlListData] = useState<ComicViewModel[]>([]);

  //Need to take this as ref so it can be accessed within callback closure
  const isOfflineRef = useRef(
    !(netInfo.isConnected && netInfo.isInternetReachable),
  );

  //Update when network condition changes
  useEffect(() => {
    isOfflineRef.current = !(
      netInfo.isConnected && netInfo.isInternetReachable
    );
  }, [netInfo.isInternetReachable, netInfo.isConnected]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isOfflineRef.current) {
        // We want to show db data when offline
        loadFromDb();
      } else {
        fetchListData(0, RECORD_COUNT_PER_FETCH);
      }
    }, 500); // Needed to put delay here as netInfo lib having a bug where it wont update status immedietly

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const loadFromDb = async () => {
    const realm = await getRealm();
    const dbData: ComicViewModel[] = await realm.objects(ComicSchemaName);
    if (dbData.length == 0) {
      // This is when we even not having db data.
      setError('No Data');
    }

    setlListData(dbData);
    setIsLoading(false);
  };

  const writeTodb = async (newComics: ComicViewModel[]) => {
    const realm = await getRealm();
    let updatedComics: any[] = [];
    try {
      realm.write(() => {
        newComics.forEach(c => {
          updatedComics.push(
            realm.create(
              ComicSchemaName,
              {
                _id: c.id,
                title: c.title,
                issueNumber: c.issueNumber,
                description: c.description,
                modified: c.modified,
                pageCount: c.pageCount,
                onsaleDate: c.onsaleDate,
                focDate: c.focDate,
                printPrice: c.printPrice,
                digitalPurchasePrice: c.digitalPurchasePrice,
                thumbnail: c.thumbnail,
                creators: c.creators,
                characters: c.characters,
                stories: c.stories,
              },
              'modified',
            ),
          );
        });
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  const fetchListData = async (
    _offset: number,
    _length: number,
    shouldAppend = false,
  ) => {
    if (isOfflineRef.current) {
      Toast.show({
        type: 'error',
        text1: 'Network not reachable',
        text2: 'Please check your internet connection',
      });
      setIsLoading(false);
      setHasMore(false);
      return;
    }

    try {
      const resp = await getComics(_offset, _length);

      if (resp.data) {
        const data: Comic[] = resp.data.data.results;

        const comicViewModels: ComicViewModel[] = data.map(c => {
          let _onsaleDate =
            c.dates?.find(d => d.type === 'onsaleDate')?.date ?? '';
          let _focDate = c.dates?.find(d => d.type === 'focDate')?.date ?? '';
          let _printPrice =
            c.prices?.find(d => d.type === 'printPrice')?.price ?? undefined;
          let _digitalPurchasePrice =
            c.prices?.find(d => d.type === 'digitalPurchasePrice')?.price ??
            undefined;
          let _thumbnail = c.thumbnail?.path + '.' + c.thumbnail.extension;

          const _creators = c.creators?.items?.map(_c => _c.name) ?? [];
          const _characters = c.characters?.items?.map(_c => _c.name) ?? [];
          const _stories = c.stories?.items?.map(_c => _c.name) ?? [];

          return {
            id: c.id,
            title: c.title,
            issueNumber: c.issueNumber,
            description: c.description,
            modified: c.modified,
            pageCount: c.pageCount,
            onsaleDate: _onsaleDate,
            focDate: _focDate,
            printPrice: _printPrice,
            digitalPurchasePrice: _digitalPurchasePrice,
            thumbnail: _thumbnail,
            creators: _creators,
            characters: _characters,
            stories: _stories,
          };
        });

        writeTodb(comicViewModels);

        if (shouldAppend) {
          setlListData([...listData, ...comicViewModels]);
        } else {
          setlListData(comicViewModels);
        }
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Network error',
        text2: 'Please check your internet connection',
      });
      loadFromDb();
      setIsLoading(false);
      setHasMore(false);
    }

    setIsLoading(false);
  };

  // useEffect(() => {
  //   navigation.setOptions({title: `Comics(${listData.length})`});
  // }, [listData]);

  const onEndReached = () => {
    setHasMore(true);
    fetchListData(listData.length, RECORD_COUNT_PER_FETCH, true);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          {error ? (
            <>
              <Text style={styles.text}>
                {'Oops... Something went wrong!\n' + error}
              </Text>
              <Button
                titleStyle={styles.retryText}
                buttonStyle={styles.retryButton}
                title={'Retry'}
                onPress={() => fetchListData(0, listData.length)}
              />
            </>
          ) : (
            <>
              {/* <Text style={styles.text}>
                {isOfflineRef.current ? 'OFFLINE' : 'ONLINE'}
              </Text> */}
              <BigList
                footerHeight={80}
                itemHeight={ITEM_HEIGHT}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      fetchListData(0, listData.length);
                    }}
                  />
                }
                data={listData}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    key={'kk' + index}
                    onPress={() => {
                      navigation.navigate(NavScreenKeys.ComicDetailScreen, {
                        comic: item,
                      });
                    }}>
                    <ComicRowView index={index} comic={item} />
                  </TouchableOpacity>
                )}
                getItemLayout={(data, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                keyExtractor={(item, i) => i + 'ke'}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => {
                  return hasMore ? <LoadMoreLoadingView /> : null;
                }}
              />
            </>
          )}
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: MyColors.offWhite,
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    fontFamily: FontFamily.bold,
  },
  retryText: {fontSize: 18, textAlign: 'center', fontFamily: FontFamily.bold},
  retryButton: {width: 100, alignSelf: 'center'},
});
