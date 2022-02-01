/* eslint-disable react-hooks/exhaustive-deps */
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import {getComics} from '../../api/marvelApi';
import {MyColors} from '../../constants/constants';
import {ComicSchemaName, getRealm} from '../../database/realm';
import {Comic, ComicViewModel} from '../../entities/entityTypes';
import {NavScreenKeys} from '../AppNavigator';
import {ComicRowView} from './ComicRowView';
import {LoadingView} from './LoadingView';
import {LoadMoreLoadingView} from './LoadMoreLoadingView';

export const ITEM_HEIGHT = 88;

export const ComicListScreen = observer(() => {
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const [refreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [hasMore, setHasMore] = useState(false);

  const [listData, setlListData] = useState<ComicViewModel[]>([]);

  // const isOffline = !(netInfo.isConnected && netInfo.isInternetReachable);

  const isOfflineRef = useRef(
    !(netInfo.isConnected && netInfo.isInternetReachable),
  );

  useEffect(() => {
    isOfflineRef.current = !(
      netInfo.isConnected && netInfo.isInternetReachable
    );
  }, [netInfo.isInternetReachable, netInfo.isConnected]);

  useEffect(() => {
    setTimeout(() => {
      if (isOfflineRef.current) {
        loadFromDb();
      } else {
        fetchListData(0, 25);
      }
    }, 500);

    return () => {};
  }, []);

  const loadFromDb = async () => {
    const realm = await getRealm();
    const dbData: ComicViewModel[] = await realm.objects(ComicSchemaName);
    console.warn('end', dbData.length);

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
    } catch (error) {
      console.error(error);
    }

    console.warn('ComicSchemaName', realm.objects(ComicSchemaName).length);
  };

  const fetchListData = async (_offset: number, _length: number, shouldAppend = false) => {
    if (isOfflineRef.current) {
      Toast.show({
        type: 'error',
        text1: 'Network not reachanle',
        text2: 'Please check your internet connection',
      });
      setIsLoading(false);
      setHasMore(false);
      return;
    }

    const resp = await getComics(_offset, _length);

    if (resp.data) {
      const data: Comic[] = resp.data.data.results;
      console.warn('fetchListData', _offset, _length,data.length);

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
    setIsLoading(false);
  };

  useEffect(() => {
    navigation.setOptions({title: `Comics(${listData.length})`});
  }, [listData]);

  const onEndReached = () => {
    setHasMore(true);
    fetchListData(listData.length, 25, true);
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
                style={styles.retryButton}
                title={'Retry'}
                onPress={() => fetchListData(0, listData.length)}
              />
            </>
          ) : (
            <>
              <Text style={styles.text}>
                {isOfflineRef.current ? 'OFFLINE' : 'ONLINE'}
              </Text>
              <FlatList
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
                keyExtractor={(item, i) => i + ''}
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
    backgroundColor: MyColors.bgColor,
    flex: 1,
    justifyContent: 'center',
  },
  text: {fontSize: 25, textAlign: 'center', margin: 5},
  retryButton: {width: 100, alignSelf: 'center'},
});
