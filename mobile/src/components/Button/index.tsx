import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';

import {styles} from './styles';

interface IProps {
  cond: any;
  handleSubmit: any;
  loading: boolean;
  text: string;
  style: {
    height: number;
  };
}

export default function Button({
  cond,
  handleSubmit,
  loading,
  text,
  style,
}: IProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {height: style.height},
        cond ? styles.buttonActive : styles.buttonInactive,
      ]}
      disabled={cond ? false : true}
      onPress={() => handleSubmit()}>
      {loading ? (
        <Text
          style={[
            styles.buttonText,

            cond ? styles.textButtonActive : styles.textButtonInactive,
          ]}>
          {text}
        </Text>
      ) : (
        <ActivityIndicator size="large" color="#eee" />
      )}
    </TouchableOpacity>
  );
}
