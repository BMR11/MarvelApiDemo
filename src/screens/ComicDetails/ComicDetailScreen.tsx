import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import {Card, Image, Text} from 'react-native-elements';
import {FontFamily, MyColors} from '../../constants/constants';
import {ComicViewModel} from '../../entities/entityTypes';

export const ComicDetailScreen = () => {
  const route = useRoute();
  const comic: ComicViewModel = route?.params?.comic!;
  const imageUrl = comic.thumbnail;
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={{uri: imageUrl}}
        resizeMode="contain"
      />
      <ScrollView>
        <Text style={styles.title}>{comic.title}</Text>
        <View style={styles.imageWrapper}>
          <Image
            containerStyle={styles.imageContainer}
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode={'stretch'}
          />
        </View>

        <View style={styles.mainDetailsContainer}>
          <View style={{height: 100}} />

          <View style={styles.pricesContainer}>
            {
              <Text style={styles.text}>{`Print\n${
                typeof comic.printPrice === 'number'
                  ? '$' + comic.printPrice.toFixed(2)
                  : '-'
              }`}</Text>
            }
            {
              <Text style={styles.text}>{`Number of pages\n${
                typeof comic.pageCount === 'number' ? comic.pageCount : '-'
              }`}</Text>
            }
            {
              <Text style={styles.text}>{`Digital\n${
                typeof comic.digitalPurchasePrice === 'number'
                  ? '$' + comic.digitalPurchasePrice.toFixed(2)
                  : '-'
              }`}</Text>
            }
          </View>

          <View style={styles.datesContainer}>
            {!!comic.onsaleDate && moment(comic.onsaleDate).isValid() && (
              <Text style={styles.text}>{`OnSale: ${moment(
                comic.onsaleDate,
              ).format('ll')}`}</Text>
            )}
            {!!comic.focDate && moment(comic.focDate).isValid() && (
              <Text style={styles.text}>{`FOC: ${moment(comic.focDate).format(
                'll',
              )}`}</Text>
            )}
          </View>

          {!!comic.description && (
            <MyCard title="Description">
              <Text style={styles.text}>{comic.description}</Text>
            </MyCard>
          )}
        </View>

        {comic.stories.length > 0 && (
          <MyCard title="Stories">
            {comic.stories?.map((s, i) => {
              return (
                <Text style={styles.text} key={'p' + i}>
                  {s}
                </Text>
              );
            })}
          </MyCard>
        )}

        {comic.characters.length > 0 && (
          <MyCard title="Characters">
            {comic.characters?.map((s, i) => {
              return (
                <Text style={styles.text} key={'p' + i}>
                  {s}
                </Text>
              );
            })}
          </MyCard>
        )}

        {comic.creators.length > 0 && (
          <MyCard title="Creators">
            {comic.creators?.map((s, i) => {
              return (
                <Text style={styles.text} key={'p' + i}>
                  {s}
                </Text>
              );
            })}
          </MyCard>
        )}
      </ScrollView>
    </View>
  );
};

const MyCard = ({title, children}: {title: string; children: any}) => {
  return (
    <Card containerStyle={styles.cardContainer}>
      <Text style={styles.cardHeaderText}>{title}</Text>
      <Card.Divider />
      <View style={styles.cardChildContainer}>{children}</View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: MyColors.offWhite, padding: 8},
  imageBackground: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
    position: 'absolute',
    opacity: 0.5,
  },
  mainDetailsContainer: {
    backgroundColor: '#33333388',
    marginTop: -100,
    borderColor: '#333333',
    borderRadius: 5,
    borderWidth: 2,
    padding: 5,
  },
  pricesContainer: {
    marginTop: 5,
    padding: 5,
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: '#33333333',
    borderColor: '#333333dd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
  },
  datesContainer: {
    marginTop: 5,
    padding: 3,
    borderRadius: 4,
    backgroundColor: '#333333dd',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  image: {height: 200},
  imageContainer: {borderRadius: 3},
  imageWrapper: {
    zIndex: 10,
    borderColor: '#333333',
    width: 150,
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: MyColors.white,
    padding: 3,
  },
  headerText: {
    color: MyColors.offWhite,
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  text: {
    color: MyColors.offWhite,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'center',
    margin: 5,
    color: MyColors.black,
  },
  name: {fontSize: 14, color: MyColors.white, fontFamily: FontFamily.bold},
  desc: {color: MyColors.offWhite, fontFamily: FontFamily.bold},

  cardContainer: {
    backgroundColor: MyColors.transGray,
    borderWidth: 0,
    borderRadius: 5,
  },
  cardChildContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  cardHeaderText: {
    color: MyColors.offWhite,
    fontFamily: FontFamily.bold,
    fontSize: 16,
    alignSelf: 'center',
  },
});
