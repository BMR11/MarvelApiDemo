/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {HomeScreen} from './src/screens/home/HomeScreen';
import {RootStore} from './src/store/RootStore';

const rootStore = new RootStore();
export const organizationStore = rootStore.organizationStore;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: '#F5EEDC',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <HomeScreen />
    </SafeAreaView>
  );
};

export default App;
