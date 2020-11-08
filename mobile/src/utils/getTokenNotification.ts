import {Platform} from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import {ToastInfo} from '../utils/tryToasts';

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      ToastInfo('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    ToastInfo('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        // lightColor: '#2ae',
      });
    } catch (err) {
      console.log(err);
    }
  }

  return token;
}
