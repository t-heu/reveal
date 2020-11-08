import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

import {colors} from '../../styles';

export default function Loading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primaryColor} />
    </View>
  );
}

export const styles = StyleSheet.create({
  loading: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
