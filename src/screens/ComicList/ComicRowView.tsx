import {observer} from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import {FontFamily} from '../../constants/constants';
import {ComicViewModel} from '../../entities/entityTypes';

interface IProp {
  index: number;
  comic: ComicViewModel;
}
export const ComicRowView = observer(({index, comic}: IProp) => {
  const imageUrl = comic.thumbnail;
  return (
    <View style={styles.container}>
      <Avatar size={64} rounded source={imageUrl ? {uri: imageUrl} : {}} />
      <View style={[styles.subContainer]}>
        <Text numberOfLines={1} style={styles.name}>
          {`#${index} ` + comic.title}
        </Text>
        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            // backgroundColor: '#333333aa',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {typeof comic.printPrice === 'number' && (
            <Text style={styles.desc}>{`Print: $${comic.printPrice.toFixed(
              2,
            )}`}</Text>
          )}
          {typeof comic.digitalPurchasePrice === 'number' && (
            <Text
              style={
                styles.desc
              }>{`Digital: $${comic.digitalPurchasePrice.toFixed(2)}`}</Text>
          )}
        </View>
        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            // backgroundColor: '#333333aa',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {!!comic.onsaleDate && moment(comic.onsaleDate).isValid() && (
            <Text style={styles.desc}>{`OnSale: ${moment(
              comic.onsaleDate,
            ).format('ll')}`}</Text>
          )}
          {!!comic.focDate && moment(comic.focDate).isValid() && (
            <Text style={styles.desc}>{`FOC: ${moment(comic.focDate).format(
              'll',
            )}`}</Text>
          )}
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
    backgroundColor: '#154c79',
    borderRadius: 8,
    flexDirection: 'row',
  },
  subContainer: {
    height: '100%',
    flex: 1,
    marginLeft: 5,
    // marginRight: 5,
  },
  name: {fontSize: 14, color: 'white', fontFamily: FontFamily.bold},
  repoUrl: {color: 'blue', textDecorationLine: 'underline'},
  desc: {color: '#F5EEDC', fontFamily: FontFamily.regular},
  readIndicatorContainer: {position: 'absolute', right: 0, top: 0, zIndex: 999},
});
