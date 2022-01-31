import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {ImageBackground, ScrollView, View} from 'react-native';
import {Avatar, Button, Image, Text} from 'react-native-elements';
import {Card} from 'react-native-elements';
import {MyColors} from '../constants/constants';
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
        <Text style={{alignSelf: 'center', margin: 5}}>{comic.title}</Text>
        <Image
          source={{uri: imageUrl}}
          style={{height: 200}}
          resizeMode={'contain'}
        />

        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            backgroundColor: '#333333dd',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {typeof comic.printPrice === 'number' && (
            <Text style={{color: MyColors.bgColor}}>{`Print: $${comic.printPrice}`}</Text>
          )}
          {typeof comic.digitalPurchasePrice === 'number' && (
            <Text
            style={{color: MyColors.bgColor}}>{`Digital: $${comic.digitalPurchasePrice}`}</Text>
          )}
        </View>

        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            backgroundColor: '#333333dd',
            justifyContent: 'space-between',
            flexDirection:'row'
          }}>
          {!!comic.onsaleDate && (
            <Text style={{color: MyColors.bgColor}}>{`OnSale: ${moment(
              comic.onsaleDate,
            ).format('ll')}`}</Text>
          )}
          {!!comic.focDate && (
            <Text style={{color: MyColors.bgColor}}>{`FOC: ${moment(comic.focDate).format(
              'll',
            )}`}</Text>
          )}
        </View>

        {!!comic.description && (
          <MyCard title="Description">
            <Text style={{color: MyColors.bgColor}}>{comic.description}</Text>
          </MyCard>
        )}

        {comic.stories.length > 0 && (
          <MyCard title="Stories">
            {comic.stories?.map((s, i) => {
              return (
                <Text style={{color: MyColors.bgColor}} key={'p' + i}>
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
                <Text style={{color: MyColors.bgColor}} key={'p' + i}>
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
                <Text style={{color: MyColors.bgColor}} key={'p' + i}>
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
      <Card.Title style={{color: MyColors.bgColor}}>{title}</Card.Title>
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
