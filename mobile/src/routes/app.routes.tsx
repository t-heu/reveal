import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Feather} from '@expo/vector-icons';

import {colors} from '../styles';

import Home from '../screens/Home';
import CreatePost from '../screens/CreatePost';
import Search from '../screens/Search';
import Profile from '../screens/Profile';

import Post from '../screens/Post';
import PostsLiked from '../screens/PostsLiked';
import PostsHide from '../screens/PostsHide';
import Settings from '../screens/Settings';
import EditPassword from '../screens/Settings/screens/EditPassword';
import EditName from '../screens/Settings/screens/EditName';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppBottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color}) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === 'CreatePost') {
            iconName = focused ? 'plus' : 'plus';
          }

          // You can return any component that you like here!
          return <Feather name={iconName} size={30} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#fff',
        inactiveTintColor: '#888',
        showLabel: false,
        labelStyle: {
          paddingBottom: 8,
          fontSize: 13,
        },
        style: {
          height: 55,
          backgroundColor: '#282828',
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="CreatePost"
        component={CreatePost}
        options={() => ({
          tabBarVisible: false,
          tabBarIcon: () => (
            <View
              style={{
                height: 90,
                width: 90,
                borderWidth: 7,
                borderColor: '#282828',
                backgroundColor: colors.primaryColor,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Feather name="plus" size={45} color="#fff" />
            </View>
          ),
        })}
      />
      <Tab.Screen name="Search" component={Search} />
    </Tab.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="AppBottomTab" component={AppBottomTab} />
      <Stack.Screen name="Post" component={Post} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="PostsLiked" component={PostsLiked} />
      <Stack.Screen name="PostsHide" component={PostsHide} />
      <Stack.Screen name="EditName" component={EditName} />
      <Stack.Screen name="EditPassword" component={EditPassword} />
    </Stack.Navigator>
  );
}
