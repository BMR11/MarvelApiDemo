import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {organizationStore} from '../../../App';
import {OrganizationRawView} from './OrganizationRawView';

export const HomeScreen = observer(() => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await organizationStore.getAll();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    organizationStore.getAll();
    return () => {};
  }, []);
  return (
    <View style={{backgroundColor: '#F5EEDC'}}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={organizationStore.organizations}
        renderItem={({item, index}) => (
          <TouchableOpacity key={'kk' + index} onPress={() => {
            organizationStore.markRead(item.id);
          }}>
            <OrganizationRawView organization={item} />
          </TouchableOpacity>
        )}
        //Setting the number of column
        keyExtractor={(item, i) => i}
      />
    </View>
  );
});
