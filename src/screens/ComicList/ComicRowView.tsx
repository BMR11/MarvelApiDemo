import {observer} from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import {FontFamily, MyColors} from '../../constants/constants';
import {ComicViewModel} from '../../entities/entityTypes';
import {ITEM_HEIGHT} from './ComicListScreen';

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
          {comic.title}
        </Text>
        <View style={styles.pricesContainer}>
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
        <View style={styles.datesContainer}>
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
    padding: 10,
    margin: 5,
    backgroundColor: MyColors.rowBg,
    borderRadius: 8,
    flexDirection: 'row',
    height: ITEM_HEIGHT - 5,
  },
  pricesContainer: {
    marginTop: 5,
    padding: 3,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datesContainer: {
    marginTop: 5,
    padding: 3,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subContainer: {
    height: '100%',
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center',
  },
  name: {fontSize: 14, color: MyColors.white, fontFamily: FontFamily.bold},
  desc: {color: MyColors.offWhite, fontFamily: FontFamily.regular},
});
