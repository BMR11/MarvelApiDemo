import React from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet, Text, View} from 'react-native';
import {FontFamily, MyColors} from '../../constants/constants';

export const LoadingView = ({label = 'Loading...'}: {label?: string}) => {
  return (
    <View>
      <LottieView
        style={styles.lottieAnim}
        source={require('../../resources/lottie/45560-ironman-loader.json')}
        autoPlay
        loop
      />
      <Text style={styles.text}> {label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  lottieAnim: {width: 100, alignSelf: 'center'},
  text: {
    fontSize: 25,
    textAlign: 'center',
    margin: 15,
    color: MyColors.black,
    fontFamily: FontFamily.bold,
  },
});
