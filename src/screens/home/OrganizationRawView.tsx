import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import {organizationStore} from '../../../App';
import {Organization} from '../../entities/entityTypes';

interface IProp {
  organization: Organization;
}
export const OrganizationRawView = ({organization}: IProp) => {
  const repoUrl = `https://github.com/${organization.login}`;
  return (
    <View style={styles.container}>
      <Avatar
        containerStyle={{opacity: organization.isRead ? 0.5 : 1}}
        size={64}
        rounded
        source={organization.avatar_url ? {uri: organization.avatar_url} : {}}
      />
      <View
        style={{
          height: '100%',
          opacity: organization.isRead ? 0.3 : 1,
          flex: 1,
          //   borderColor: 'black',
          //   borderWidth: 1,
          marginLeft: 5,
          marginRight: 25,
        }}>
        <Text style={{fontSize: 20, color: 'white'}}>{organization.login}</Text>
        <Text style={{color: '#F5EEDC'}}>{organization.description}</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(repoUrl);
          }}>
          <Text style={{color: 'blue'}}>{repoUrl}</Text>
        </TouchableOpacity>
      </View>
      {organization.isRead && (
        <View style={{position: 'absolute', right: 0, top: 0, zIndex: 999}}>
          <Icon
            color="#ffffff"
            containerStyle={{}}
            disabledStyle={{}}
            iconProps={{}}
            iconStyle={{}}
            name="check-circle"
            onLongPress={() => console.log('onLongPress()')}
            onPress={() => console.log('onPress()')}
            size={20}
            type="fontAwesome"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    borderColor: '#00A19D',
    backgroundColor: '#00A19D',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
  },
});
