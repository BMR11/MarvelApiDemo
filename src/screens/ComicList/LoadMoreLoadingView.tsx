import React from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet, View} from 'react-native';

export const LoadMoreLoadingView = () => {
  return (
    <View style={styles.container}>
      <LottieView
        style={styles.lottieAnim}
        source={require('../../resources/lottie/45560-ironman-loader.json')}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    position: 'relative',
    marginTop: 10,
    marginBottom: 10,
    borderColor: 'pink',
  },
  lottieAnim: {width: 50, alignSelf: 'center'},
});
