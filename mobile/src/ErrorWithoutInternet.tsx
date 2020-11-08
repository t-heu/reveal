import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

import {colors} from './styles';

function ErrorWithoutInternet({children}: any) {
  const netInfo = useNetInfo();

  if (!netInfo.isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>you are without internet.</Text>
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryColor,
  },
  text: {
    color: colors.primaryColor,
    textAlign: 'center',
    fontFamily: 'SulSans-SemiBold',
    fontSize: 20,
  },
});

export default ErrorWithoutInternet;
