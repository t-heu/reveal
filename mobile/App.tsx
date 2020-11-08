import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {View, Platform, StatusBar as StatusBarConfig} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import * as Sentry from 'sentry-expo';
import {useFonts} from 'expo-font';
import * as Notifications from 'expo-notifications';

import Env from './environment';
import Routes from './src/routes';
import AppProvider from './src/hooks';
import ErrorBoundary from './src/ErrorBoundary';
import ErrorWithoutInternet from './src/ErrorWithoutInternet';
import ModalBottomSheetPost from './src/components/ModalBottomSheetPost';

Sentry.init({
  dsn: Env.DSN_SENTRY_URI,
  enableInExpoDevelopment: true,
  debug: true,
});

const linking = {
  prefixes: ['exp://192.168.1.5:19000/--/', 'exp://', 'reveal://'],
  config: {
    screens: {
      ResetPassword: {
        path: 'resetpassword/:token',
      },
    },
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  let [fontsLoaded] = useFonts({
    'SulSans-SemiBold': require('./src/assets/fonts/SulSans/SulSans-Medium.ttf'),
    'SulSans-Bold': require('./src/assets/fonts/SulSans/SulSans-Bold.ttf'),
    'SulSans-Regular': require('./src/assets/fonts/SulSans/SulSans-Regular.ttf'),
    'SulSans-Light': require('./src/assets/fonts/SulSans/SulSans-Light.ttf'),
  });
  //const [notification, setNotification] = useState(false);
  //const notificationListener = useRef();
  //const responseListener = useRef();

  // useEffect(() => {
  //   (async () => {
  //     Linking.addEventListener('url', ({url}) => {
  //       console.log(url);
  //     });
  //   })();
  //}, []);

  //useEffect(() => {
  /*notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
  }, []);*/

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer linking={linking} /*fallback={<Loading />}*/>
      <StatusBar style="light" backgroundColor="#111" />
      <View
        style={{
          height: Platform.OS === 'ios' ? 20 : StatusBarConfig.currentHeight,
        }}
      />
      <AppProvider>
        <ErrorWithoutInternet>
          <ErrorBoundary>
            <View style={{flex: 1, backgroundColor: '#121212'}}>
              <Routes />
              <ModalBottomSheetPost />
            </View>
            <Toast ref={(ref: any) => Toast.setRef(ref)} />
          </ErrorBoundary>
        </ErrorWithoutInternet>
      </AppProvider>
    </NavigationContainer>
  );
}
