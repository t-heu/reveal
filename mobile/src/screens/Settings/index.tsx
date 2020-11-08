import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../../hooks/auth';
import {stylesSettings, colors} from './styles';

export default function Settings() {
  const navigation = useNavigation();
  const {signout, user} = useAuth();

  return (
    <ScrollView style={stylesSettings.container}>
      <View style={stylesSettings.container}>
        <View style={stylesSettings.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="x" color={colors.primaryColor} size={24} />
          </TouchableOpacity>
          <Text style={stylesSettings.headerText}>SETTINGS</Text>
          <View />
        </View>

        <View style={stylesSettings.field}>
          <View>
            <Text style={stylesSettings.text}>E-mail</Text>
            <Text style={stylesSettings.textInfo}>{user.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={stylesSettings.field}
          onPress={() => navigation.navigate('EditName')}>
          <View>
            <Text style={stylesSettings.text}>Name</Text>
            <Text style={stylesSettings.textInfo}>{user.name}</Text>
          </View>

          <TouchableOpacity>
            <Feather name="chevron-right" color="#999" size={16} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={stylesSettings.field}
          onPress={() => navigation.navigate('EditPassword')}>
          <Text style={stylesSettings.text}>Password</Text>

          <TouchableOpacity>
            <Feather name="chevron-right" color="#999" size={16} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={stylesSettings.field}
          onPress={() => navigation.navigate('PostsLiked')}>
          <Text style={stylesSettings.text}>Posts you liked</Text>

          <TouchableOpacity>
            <Feather name="chevron-right" color="#999" size={16} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={stylesSettings.field}
          onPress={() => navigation.navigate('PostsHide')}>
          <Text style={stylesSettings.text}>Posts you hid</Text>

          <TouchableOpacity>
            <Feather name="chevron-right" color="#999" size={16} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signout()}
          style={stylesSettings.field}>
          <Text style={stylesSettings.text}>Exit</Text>
          <View />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
