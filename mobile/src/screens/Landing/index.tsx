import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';

import {colors} from '../../styles';
import ButtonGoogle from '../../components/ButtonGoogle';

export default function Landing() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View />
      <Text style={styles.title}>share what you're thinking</Text>
      <View>
        <Text
          style={{
            fontFamily: 'SulSans-Regular',
            textAlign: 'center',
            color: '#eee',
          }}>
          How do you want to login?
        </Text>
        <ButtonGoogle />

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.btnModal}>
          <Feather name="user" size={24} color={'#eee'} />
          <Text style={styles.btnModalText}>Create e-mail account</Text>
          <View />
        </TouchableOpacity>

        <View style={styles.btnLogin}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'SulSans-Regular',
              color: '#eee',
            }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
            <Text style={styles.textLogin}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    justifyContent: 'space-between',
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontFamily: 'SulSans-SemiBold',
    fontSize: 48,
    width: 300,
    marginTop: 12,
    marginBottom: 30,
    color: '#eee',
  },
  btn: {
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  btnLogin: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 25,
  },
  textLogin: {
    color: colors.primaryColor,
    fontSize: 18,
    fontFamily: 'SulSans-Regular',
    marginLeft: 5,
  },
  btnModalText: {
    color: '#eee',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'SulSans-SemiBold',
  },
  btnModal: {
    marginTop: 10,
    padding: 12,
    width: '100%',
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
