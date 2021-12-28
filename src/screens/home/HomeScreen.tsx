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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await organizationStore.getAll();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadOrganizations();
    return () => {};
  }, []);

  const loadOrganizations = async () => {
    setIsLoading(true);
    await organizationStore.getAll();
    setIsLoading(false);
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
                onPress={loadOrganizations}
              />
            </>
          ) : (
            <>
              <Text style={styles.text}>{'Organizations'}</Text>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
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
                keyExtractor={(item, i) => i}
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
