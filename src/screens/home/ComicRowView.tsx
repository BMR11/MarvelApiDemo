import {observer} from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import {Character, Comic, Organization} from '../../entities/entityTypes';

interface IProp {
  index: number;
  comic: Comic;
}
export const ComicRowView = observer(({index, comic}: IProp) => {
  // const repoUrl = `https://github.com/${organization.login}`;
  // const _opacity = organization.isRead ? 0.3 : 1;
  const imageUrl = comic?.thumbnail
    ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
    : '';
  return (
    <View style={styles.container}>
      <Avatar size={64} rounded source={imageUrl ? {uri: imageUrl} : {}} />
      <View style={[styles.subContainer]}>
        <Text style={styles.name}>{`#${index} ` + comic.title}</Text>
        {/* <TouchableOpacity
          onPress={() => {
            Linking.openURL(repoUrl);
          }}>
          <Text style={styles.repoUrl}>{repoUrl}</Text>
        </TouchableOpacity> */}
        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            backgroundColor: '#333333aa',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {comic.prices?.map((p, i) => {
            let type = 'print';
            if (p.type == 'printPrice') type = 'print';
            else if (p.type == 'digitalPurchasePrice') type = 'digital';
            else return null;
            return (
              <Text
                key={'p' + i}
                style={styles.desc}>{`${type}: $${p.price}`}</Text>
            );
          })}
        </View>
        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            backgroundColor: '#333333aa',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {comic.dates?.map((d, i) => {
            let type = 'OnSale';
            if(moment(d.date).isValid()){
              if (d.type == 'onsaleDate') type = 'OnSale';
              else if (d.type == 'focDate') type = 'FOC';
              else return null;
            }
            else return null
           
            return (
              <Text key={'d' + i} style={styles.desc}>{`${type}: ${moment(
                d.date,
              ).format('ll')}`}</Text>
            );
          })}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    backgroundColor: '#D05454',
    borderRadius: 8,
    flexDirection: 'row',
  },
  subContainer: {
    height: '100%',
    flex: 1,
    marginLeft: 5,
    marginRight: 25,
  },
  name: {fontSize: 12, color: 'white'},
  repoUrl: {color: 'blue', textDecorationLine: 'underline'},
  desc: {color: '#F5EEDC'},
  readIndicatorContainer: {position: 'absolute', right: 0, top: 0, zIndex: 999},
});
