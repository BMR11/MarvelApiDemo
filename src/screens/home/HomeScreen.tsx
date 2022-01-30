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
import {organizationStore} from '../../../App';
import {OrganizationRawView} from './OrganizationRawView';

export const HomeScreen = observer(() => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [startId, setStartId] = useState(0);
  const [hasMore, setHasMore] = useState(false);

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
    loadOrganizations(0);
    return () => {};
  }, []);

  const loadOrganizations = async (_startId = 0) => {
    // setIsLoading(true);
    await organizationStore.getAll(_startId);
    // setIsLoading(false);
  };

  const onEndReached = () => {
    setHasMore(true);
    const _nextStartId =
      organizationStore.organizations.length > 0
        ? organizationStore.organizations[
            organizationStore.organizations.length - 1
          ].id
        : 0;
    loadOrganizations(_nextStartId);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <>
          <ActivityIndicator />
          <Text style={styles.text}> {'Loading...'}</Text>
        </>
      ) : (
        <>
          {organizationStore.error ? (
            <>
              <Text style={styles.text}>
                {'Oops... Something went wrong!\n' + organizationStore.error}
              </Text>
              <Button
                style={styles.retryButton}
                title={'Retry'}
                onPress={() => loadOrganizations(0)}
              />
            </>
          ) : (
            <>
              <Text style={styles.text}>{`Organizations(${organizationStore.organizations.length})`}</Text>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      loadOrganizations(0);
                    }}
                  />
                }
                data={organizationStore.organizations}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    key={'kk' + index}
                    onPress={() => {
                      organizationStore.markRead(item.id);
                    }}>
                    <OrganizationRawView organization={item} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item, i) => i + ''}
                onEndReached={onEndReached}
                onEndReachedThreshold={2}
                ListFooterComponent={() => {
                  return hasMore ? (
                    <View
                      style={{
                        height:50,
                        position: 'relative',
                        paddingVertical: 20,
                        borderTopWidth: 1,
                        marginTop: 10,
                        marginBottom: 10,
                        borderColor: 'pink',
                      }}>
                      <ActivityIndicator animating size="large" />
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
  container: {backgroundColor: '#F5EEDC', flex: 1, justifyContent: 'center'},
  text: {fontSize: 25, textAlign: 'center', margin: 5},
  retryButton: {width: 100, alignSelf: 'center'},
});
