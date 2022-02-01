import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MyColors} from '../constants/constants';
import {ComicDetailScreen} from './ComicDetails/ComicDetailScreen';
import {ComicListScreen} from './ComicList/ComicListScreen';
import React from 'react';
const RootStack = createNativeStackNavigator();

export enum NavScreenKeys {
    ComicListScreen = 'ComicListScreen',
    ComicDetailScreen = 'ComicDetailScreen',
}

export const AppNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName={NavScreenKeys.ComicListScreen}
      screenOptions={{
        headerStyle: {
          backgroundColor: MyColors.bgColor,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <RootStack.Screen
        name={NavScreenKeys.ComicListScreen}
        component={ComicListScreen}
        // options={{headerTitleAlign: 'center'}}
        options={({route}) => ({
          title: 'Comics',
          headerTitleAlign: 'center'
        })}
      />
      <RootStack.Screen
        name={NavScreenKeys.ComicDetailScreen}
        component={ComicDetailScreen}
        options={({route}) => ({
          title: route.params.comic.title,
        })}
      />
    </RootStack.Navigator>
  );
};
