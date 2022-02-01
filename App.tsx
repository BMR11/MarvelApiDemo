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
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {MyColors} from './src/constants/constants';
import {AppNavigator} from './src/screens/AppNavigator';
import {RootStore} from './src/store/RootStore';
import {LogBox} from 'react-native';

//Hate to add this but doing this considering timeline
LogBox.ignoreLogs([
  'Deprecation warning: value provided is not in a recognized RFC2822', //Hiding this warning for now as momentjs seems strict with formatting
  'Failed prop type: Invalid prop `data`', //Return on realm is object which ts doesn't like 
  'Non-serializable values were found in th',//Some bad data from api needs to be handled
]);

//Currently not in use
const rootStore = new RootStore();
export const comicsStore = rootStore.comicsStore;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <NavigationContainer>
        <SafeAreaView style={styles.rootContainer}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: MyColors.offWhite,
  },
});

export default App;
