import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Avatar, Button, Image, Text} from 'react-native-elements';
import { Card } from "react-native-elements";
import {MyColors} from '../constants/constants';
import {Comic} from '../entities/entityTypes';

interface IProps {
  comic: Comic;
  onClose: () => void;
}
export const ComicView = ({}: IProps) => {
  const route = useRoute();
  const comic: Comic = route?.params?.comic!;
  const imageUrl = comic?.thumbnail
    ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
    : '';
  return (
    <View style={{flex: 1, backgroundColor: MyColors.bgColor, padding: 8}}>
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
            backgroundColor: '#333333aa',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {comic.prices?.map((p, i) => {
            let type = 'print';
            if (p.type == 'printPrice') type = 'print';
            else if (p.type == 'digitalPurchasePrice') type = 'digital';
            else return null;
            return <Text key={'p' + i}>{`${type}: $${p.price}`}</Text>;
          })}
        </View>

        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            backgroundColor: '#333333aa',
            justifyContent: 'space-between',
          }}>
          {comic.dates?.map((d, i) => {
            if (moment(d.date).isValid()) {
              
            } else return null;

            return (
              <Text key={'d' + i}>{`${d.type}: ${moment(d.date).format(
                'll',
              )}`}</Text>
            );
          })}
        </View>

        <Text style={{alignSelf: 'center', margin: 5}}>Stories</Text>
        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            backgroundColor: '#333333aa',
            justifyContent: 'space-between',
          }}>
          {comic.stories?.items.map((s, i) => {
            return <Text key={'p' + i}>{s.name}</Text>;
          })}
        </View>

        <Text style={{alignSelf: 'center', margin: 5}}>Characters</Text>
        <Card
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            backgroundColor: '#333333aa',
            justifyContent: 'space-between',
          }}>
          {comic.characters?.items.map((s, i) => {
            return <Text key={'p' + i}>{s.name}</Text>;
          })}
        </Card>

        <Card.Title>CARD WITH DIVIDER</Card.Title>
        <Card.Divider/>
        <View style={{position:"relative",alignItems:"center"}}>
          <Image
              style={{width:"100%",height:100}}
              resizeMode="contain"
              source={{ uri: "https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4" }}
            />
          <Text >Pranshu Chittora</Text>
         </View>
         

        <Text style={{alignSelf: 'center', margin: 5}}>Creators</Text>
        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            backgroundColor: '#333333aa',
            justifyContent: 'space-between',
          }}>
          {comic.creators?.items.map((s, i) => {
            return <Text key={'p' + i}>{s.name}</Text>;
          })}
        </View>

      </ScrollView>
    </View>
  );
};
