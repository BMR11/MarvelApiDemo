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

export const ITEM_HEIGHT = 88;

export const HomeScreenMarvel = observer(() => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [hasMore, setHasMore] = useState(false);

  const [listData, setlListData] = useState<ComicViewModel[]>([]);

  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
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
    loadOrganizations('mnt');
    return () => {};
  }, []);

  const writeTodb = async (newComics: ComicViewModel[]) => {
    const realm = await getRealm();
    console.warn('start', realm.objects(ComicSchemaName).length);
    let updatedComics: any[] = [];
    realm.write(() => {
      newComics.forEach(c => {
        updatedComics.push(
          realm.create(
            ComicSchemaName,
            {
              _id: c.id,
              name: c.title,
              status: c.description,
            },
            'modified',
          ),
        );
      });
      // updatedComics.push(
      //   realm.create(
      //     ComicSchemaName,
      //     {
      //       _id: parseInt(newComics[0].id),
      //           name: 'go grocery shopping',
      //           status: 'Open',
      //     },
      //     'modified',
      //   ),
      // );
      // realm.create('Task', {
      //   _id: 2,
      //   name: 'go exercise',
      //   status: 'Open',
      // });
      // console.log(`created two tasks: ${task1.name} & ${task2.name}`);
    });

    console.warn('end', updatedComics.length);
  };

  const loadOrganizations = async caller => {
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

      // writeTodb(comicViewModels);

      setlListData([...listData, ...comicViewModels]);
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
                  <TouchableOpacity style={{height:ITEM_HEIGHT}}
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
