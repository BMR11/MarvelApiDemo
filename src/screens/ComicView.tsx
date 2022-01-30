import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {Comic} from '../entities/entityTypes';

interface IProps {
  comic: Comic;
  onClose: () => void;
}
export const ComicView = ({onClose}: IProps) => {
  const route = useRoute();
  const { comic } = route.params;

  const {goBack} = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Text>{JSON.stringify(comic)}</Text>
      <Button title={'back'} onPress={()=> goBack()} />
    </View>
  );
};
