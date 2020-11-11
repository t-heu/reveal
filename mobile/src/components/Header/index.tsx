import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import io from 'socket.io-client';

import Env from '../../../environment';
import {styles, colors} from './styles';
import {useAuth} from '../../hooks/auth';
import {useShareStateComponent} from '../../hooks/shareStateComponent';
import NotificationModal from '../NotificationModal';

interface Props {
  back?: boolean;
}

export default function Header({back}: Props) {
  const {user} = useAuth();
  const [count, setCount] = useState(0);
  const {
    setVisibleModalNotification,
    visibleModalNotification,
  } = useShareStateComponent();
  const navigation = useNavigation();

  useEffect(() => {
    const socket = io(`${Env.API_URI}`, {
      query: {
        user: user.id,
      },
    });

    if (visibleModalNotification && count > 0) {
      socket.emit('count_notification_not_read', {
        clear: true,
        user: user.id,
      });
    }

    socket.on(
      'count_notification_not_read',
      (noti: {count_notification_not_read: string}) => {
        setCount(Number(noti.count_notification_not_read));
      },
    );
  }, [visibleModalNotification, count, user]);

  return (
    <View style={styles.container}>
      <View style={styles.subHeaderLeft}>
        {back && (
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}>
            <Feather name="x" size={25} color={colors.primaryColor} />
          </TouchableOpacity>
        )}

        <View>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() =>
              setVisibleModalNotification(!visibleModalNotification)
            }>
            {count > 0 && (
              <>
                {count >= 99 ? (
                  <View style={styles.dotNotification}>
                    <Text style={styles.count_notification}>99+</Text>
                  </View>
                ) : (
                  <View style={[styles.dotNotification, {right: 6}]}>
                    <Text style={styles.count_notification}>{count}</Text>
                  </View>
                )}
              </>
            )}
            <Feather name="bell" size={25} color={colors.primaryColor} />
          </TouchableOpacity>

          <NotificationModal reload={!!count} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            style={styles.photo}
            source={{
              uri: user.avatar_url,
            }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.navigate('Settings')}>
        <Feather name="settings" size={25} color={'#fff'} />
      </TouchableOpacity>
    </View>
  );
}
