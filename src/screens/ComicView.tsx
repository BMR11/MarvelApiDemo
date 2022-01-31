import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Button, Image, Text} from 'react-native-elements';
import {Card} from 'react-native-elements';
import {FontFamily, MyColors} from '../constants/constants';
import {Comic, ComicViewModel} from '../entities/entityTypes';

export const ComicView = () => {
  const route = useRoute();
  const comic: ComicViewModel = route?.params?.comic!;
  const imageUrl = comic.thumbnail;
  return (
    <View style={{flex: 1, backgroundColor: MyColors.bgColor, padding: 8}}>
      <ImageBackground
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          flex: 1,
          position: 'absolute',
          opacity: 0.5,
        }}
        source={{uri: imageUrl}}
        resizeMode="contain"
      />
      <ScrollView>
        <Text style={[styles.text, {alignSelf: 'center', margin: 5,color:'black'}]}>
          {comic.title}
        </Text>
        <View
          style={{
            zIndex: 10,
            borderColor: '#333333',
            width: 150,
            alignSelf: 'center',
            borderRadius: 5,
            borderWidth: 3,
          }}>
          <Image
            source={{uri: imageUrl}}
            style={{height: 200}}
            resizeMode={'stretch'}
          />
        </View>

        <View
          style={{
            backgroundColor: '#33333388',
            marginTop: -100,
            borderColor: '#333333',
            borderRadius: 5,
            borderWidth: 3,
            padding: 5,
          }}>
          <View style={{height: 100}} />

          <View
            style={{
              marginTop: 5,
              padding: 5,
              borderRadius: 50,
              borderWidth:2,
              backgroundColor: '#33333333',
              borderColor: '#333333dd',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft:15,paddingRight:15
            }}>
            {(
              <Text style={styles.text}>{`Print\n${typeof comic.printPrice === 'number'?'$'+comic.printPrice.toFixed(
                2,
              ) : '-'}`}</Text>
            )}
            { (
              <Text
                style={
                  styles.text
                }>{`Number of pages\n${typeof comic.pageCount === 'number' ? comic.pageCount : '-'}`}</Text>
            )}
            {  (
              <Text
                style={
                  styles.text
                }>{`Digital\n${typeof comic.digitalPurchasePrice === 'number'? '$'+comic.digitalPurchasePrice.toFixed(2):'-'}`}</Text>
            )}
          </View>

          <View
            style={{
              marginTop: 5,
              padding: 3,
              borderRadius: 4,
              backgroundColor: '#333333dd',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
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
    <Card
      containerStyle={{
        backgroundColor: '#333333dd',
        borderWidth: 0,
        borderRadius: 5,
      }}
      wrapperStyle={{}}>
      <Text style={[styles.headerText, {alignSelf: 'center'}]}>{title}</Text>
      <Card.Divider />
      <View
        style={{
          position: 'relative',
          alignItems: 'center',
        }}>
        {children}
      </View>
    </Card>
  );
};

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
    // marginRight: 5,
  },
  headerText: {
    color: MyColors.bgColor,
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  text: {color: MyColors.bgColor, fontFamily: FontFamily.regular, fontSize: 14,textAlign:'center'},
  name: {fontSize: 14, color: 'white', fontFamily: FontFamily.bold},
  repoUrl: {color: 'blue', textDecorationLine: 'underline'},
  desc: {color: '#F5EEDC', fontFamily: FontFamily.bold},
  readIndicatorContainer: {position: 'absolute', right: 0, top: 0, zIndex: 999},
});
