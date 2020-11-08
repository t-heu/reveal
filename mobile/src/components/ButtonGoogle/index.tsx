import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import * as Google from 'expo-google-app-auth';

import {ToastErrors} from '../../utils/tryToasts';
import LogoGoogle from '../../assets/google-icon-4.png';
import {useAuth} from '../../hooks/auth';
import Env from '../../../environment';

export default function ButtonGoogle() {
  const {loginWithGoogle} = useAuth();

  async function login() {
    try {
      //@ts-ignore
      const {type, accessToken} = await Google.logInAsync({
        androidClientId: Env?.GOOGLE_ID,
        scopes: ['profile', 'email'],
      });

      if (type === 'success') {
        await loginWithGoogle({
          accessTokenGoogle: accessToken,
        });

        return;
      } else {
        return {cancelled: true};
      }
    } catch (e) {
      console.log(e);
      ToastErrors('Something went wrong');
      return {error: true};
    }
  }

  return (
    <TouchableOpacity style={styles.btn} onPress={() => login()}>
      <Image source={LogoGoogle} style={styles.logo} />
      <Text style={styles.btnText}>Continue with Google</Text>
      <View />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'SulSans-SemiBold',
  },
  logo: {
    width: 24,
    height: 24,
  },
  btn: {
    marginTop: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    width: '100%',
    backgroundColor: '#fff', //'#4285f4',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
