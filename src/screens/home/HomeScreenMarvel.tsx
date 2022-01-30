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
import {Comic} from '../../entities/entityTypes';
import {ComicView} from '../ComicView';
import {ComicRowView} from './ComicRowView';
// import {organizationStore} from '../../../App';
// import {OrganizationRawView} from './OrganizationRawView';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {MyColors} from '../../constants/constants';

export const HomeScreenMarvel = observer(() => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [hasMore, setHasMore] = useState(false);

  const [listData, setlListData] = useState<Comic[]>([]);

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

  const loadOrganizations = async (caller = '') => {
    // setIsLoading(true);
    // console.warn(listData.length)
    // console.warn(caller)
    const resp = await getComics(listData.length);
    if (resp.data) {
      setlListData([...listData, ...resp.data.data.results]);
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
                  <TouchableOpacity
                    key={'kk' + index}
                    onPress={() => {
                      // organizationStore.markRead(item.id);
                      setSelectedComic(item);
                      navigation.navigate('ComicDetails', {comic: item});
                    }}>
                    <ComicRowView index={index} comic={item} />
                  </TouchableOpacity>
                )}
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
