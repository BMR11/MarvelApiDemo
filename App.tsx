/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { MyColors } from './src/constants/constants';
import {ComicView} from './src/screens/ComicView';
import {HomeScreen} from './src/screens/home/HomeScreen';
import {HomeScreenMarvel} from './src/screens/home/HomeScreenMarvel';
import {RootStore} from './src/store/RootStore';
const rootStore = new RootStore();
export const organizationStore = rootStore.organizationStore;
const Stack = createNativeStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1, backgroundColor: MyColors.bgColor
  };

  return (
    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator initialRouteName="Comics" screenOptions={{
        headerStyle: {
          backgroundColor: MyColors.bgColor,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
          <Stack.Screen name="Comics" component={HomeScreenMarvel} options={{headerTitleAlign:'center'}}/>
          <Stack.Screen
            name="ComicDetails"
            component={ComicView}
            options={({route}) => ({
              title: route.params.comic.title,
              
            })}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
