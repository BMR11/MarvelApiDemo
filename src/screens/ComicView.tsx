import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {ImageBackground, ScrollView, View} from 'react-native';
import {Avatar, Button, Image, Text} from 'react-native-elements';
import {Card} from 'react-native-elements';
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
      <ImageBackground
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          flex: 1,
          position: 'absolute',
          opacity:0.5
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
          {comic.prices?.map((p, i) => {
            let type = 'print';
            if (p.type == 'printPrice') type = 'print';
            else if (p.type == 'digitalPurchasePrice') type = 'digital';
            else return null;
            return <Text style={{color:MyColors.bgColor}} key={'p' + i}>{`${type}: $${p.price}`}</Text>;
          })}
        </View>

        <View
          style={{
            marginTop: 5,
            padding: 3,
            borderRadius: 4,
            backgroundColor: '#333333dd',
            justifyContent: 'space-between',
          }}>
          {comic.dates?.map((d, i) => {
            if (moment(d.date).isValid()) {
            } else return null;

            return (
              <Text style={{color:MyColors.bgColor}} key={'d' + i}>{`${d.type}: ${moment(d.date).format(
                'll',
              )}`}</Text>
            );
          })}
        </View>

        {comic.stories.available > 0 && (
          <MyCard title="Stories">
            {comic.stories?.items.map((s, i) => {
              return <Text style={{color:MyColors.bgColor}}  key={'p' + i}>{s.name}</Text>;
            })}
          </MyCard>
        )}

        {comic.characters.available > 0 && (
          <MyCard title="Characters">
            {comic.characters?.items.map((s, i) => {
              return <Text style={{color:MyColors.bgColor}} key={'p' + i}>{s.name}</Text>;
            })}
          </MyCard>
        )}

        {comic.creators.available > 0 && (
          <MyCard title="Creators">
            {comic.creators?.items.map((s, i) => {
              return <Text style={{color:MyColors.bgColor}} key={'p' + i}>{s.name}</Text>;
            })}
          </MyCard>
        )}
      </ScrollView>
    </View>
  );
};

const MyCard = ({title, children}: {title: string; children: any}) => {
  return (
    <Card containerStyle={{backgroundColor: '#333333dd',borderWidth:0,borderRadius:5}} wrapperStyle={{}}>
      <Card.Title style={{color:MyColors.bgColor}}>{title}</Card.Title>
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
