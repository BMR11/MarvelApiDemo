/* eslint-disable react-hooks/exhaustive-deps */
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {getComics} from '../../api/marvelApi';
import {Comic, ComicViewModel} from '../../entities/entityTypes';
import {ComicView} from '../ComicView';
import {ComicRowView} from './ComicRowView';
// import {organizationStore} from '../../../App';
// import {OrganizationRawView} from './OrganizationRawView';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {MyColors} from '../../constants/constants';
import {ComicSchemaName, getRealm} from '../../database/realm';
import {useNetInfo} from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

export const ITEM_HEIGHT = 88;

export const HomeScreenMarvel = observer(() => {
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [hasMore, setHasMore] = useState(false);

  const [listData, setlListData] = useState<ComicViewModel[]>([]);

  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);

  const isOffline = !(netInfo.isConnected && netInfo.isInternetReachable);
  // const onRefresh = React.useCallback(async () => {
  //   await loadOrganizations();
  // }, []);

  // useEffect(() => {
  //   loadOrganizations();
  // }, [startId]);

  // useEffect(() => {
  //   if (organizationStore.organizations.length > 0) {
  //     setStartId(
  //       organizationStore.organizations[
  //         organizationStore.organizations.length - 1
  //       ].id,
  //     );
  //   }
  // }, [organizationStore.organizations]);

  useEffect(() => {
    if (isOffline) loadFromDb();
    else loadOrganizations('mnt');

    return () => {};
  }, []);

  const loadFromDb = async () => {
    const realm = await getRealm();
    const dbdata = await realm.objects(ComicSchemaName);
    setlListData(dbdata);
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

    // console.warn('end', updatedComics);
    console.warn('ComicSchemaName', realm.objects(ComicSchemaName).length);

  };

  const loadOrganizations = async (caller) => {
    if (isOffline) {
      Toast.show({
        type: 'error',
        text1: 'Network not reachanle',
        text2: 'Please check your internet connection',
      });
      setIsLoading(false);
      setHasMore(false);
      return;
    }

    // setIsLoading(true);
    // console.warn(listData.length)
    // console.warn('loadOrganizations1',caller)
    const resp = await getComics(listData.length);
    // console.warn('loadOrganizations2',caller)

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
      if(caller == 'end')
      setlListData([...listData, ...comicViewModels]);
      else
      setlListData(comicViewModels)

    }
    setIsLoading(false);
  };

  useEffect(() => {
    navigation.setOptions({title: `Comics(${listData.length})`});
  }, [listData]);

  const onEndReached = () => {
    setHasMore(true);
    loadOrganizations('end');
  };

  // if (selectedComic) {
  //   return (
  //     <ComicView
  //       comic={selectedComic}
  //       onClose={() => {
  //         setSelectedComic(null);
  //       }}
  //     />
  //   );
  // }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{justifyContent: 'flex-end'}}>
          <LottieView
            style={{width: 100, alignSelf: 'center'}}
            source={require('../../resources/lottie/45560-ironman-loader.json')}
            autoPlay
            loop
          />
          <Text style={styles.text}> {'Loading...'}</Text>
        </View>
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
                onPress={() => loadOrganizations('ret')}
              />
            </>
          ) : (
            <>
            <Text style={styles.text}>{isOffline ? 'OFFLINE' : 'ONLINE'}</Text>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      loadOrganizations('ref');
                    }}
                  />
                }
                data={listData}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    // style={{height: ITEM_HEIGHT}}
                    key={'kk' + index}
                    onPress={() => {
                      // organizationStore.markRead(item.id);
                      setSelectedComic(item);
                      navigation.navigate('ComicDetails', {comic: item});
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
                  return hasMore ? (
                    <View
                      style={{
                        height: 50,
                        position: 'relative',
                        marginTop:10,
                        marginBottom: 10,
                        borderColor: 'pink',
                      }}>
                      <LottieView
                        style={{width: 50, alignSelf: 'center'}}
                        source={require('../../resources/lottie/45560-ironman-loader.json')}
                        autoPlay
                        loop
                      />
                    </View>
                  ) : null;
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
