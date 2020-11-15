import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';

import Loading from '../../components/Loading';
import {ToastErrors, ToastSuccess} from '../../utils/tryToasts';
import {styles} from './styles';
import api from '../../services/api';

type StackParamsList = {
  P: {
    token: string;
  };
};

export default function ConfirmEmail() {
  const navigation = useNavigation();
  const routes = useRoute<RouteProp<StackParamsList, 'P'>>();
  const {token} = routes.params;

  useEffect(() => {
    api
      .post('/user/confirm/email', null, {
        params: {
          token,
        },
      })
      .then(() => {
        ToastSuccess('Full login, you can now login');
        navigation.navigate('Signin');
      })
      .catch((err: any) =>
        ToastErrors(
          err.response ? err.response.data.message : 'Something went wrong',
        ),
      );
  }, [token, navigation]);

  return (
    <View style={styles.container}>
      <Loading />
    </View>
  );
}
