import { observer } from 'mobx-react-lite';
import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import {Organization} from '../../entities/entityTypes';

interface IProp {
  organization: Organization;
}
export const OrganizationRawView = observer(({organization}: IProp) => {
  const repoUrl = `https://github.com/${organization.login}`;
  const _opacity = organization.isRead ? 0.3 : 1;
  return (
    <View style={styles.container}>
      <Avatar
        containerStyle={{opacity: _opacity}}
        size={64}
        rounded
        source={organization.avatar_url ? {uri: organization.avatar_url} : {}}
      />
      <View style={[styles.subContainer, {opacity: _opacity}]}>
        <Text style={styles.name}>{organization.login}</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(repoUrl);
          }}>
          <Text style={styles.repoUrl}>{repoUrl}</Text>
        </TouchableOpacity>
        <Text style={styles.desc}>{organization.description}</Text>
      </View>
      {organization.isRead && (
        <View style={styles.readIndicatorContainer}>
          <Icon
            color="#ffffff"
            name="check-circle"
            size={20}
            type="fontAwesome"
          />
        </View>
      )}
    </View>
  );
});

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
  subContainer: {
    height: '100%',
    flex: 1,
    marginLeft: 5,
    marginRight: 25,
  },
  name: {fontSize: 20, color: 'white'},
  repoUrl: {color: 'blue', textDecorationLine: 'underline'},
  desc: {color: '#F5EEDC'},
  readIndicatorContainer: {position: 'absolute', right: 0, top: 0, zIndex: 999},
});
