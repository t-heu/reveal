import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  RefreshControl,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import api from '../../services/api';
import Loading from '../Loading';
import timeSince from '../../utils/timeSince';
import {useShareStateComponent} from '../../hooks/shareStateComponent';

export default function NotificationModal({reload}: any) {
  const navigation = useNavigation();
  const {visibleModalNotification} = useShareStateComponent();
  const [data, setData] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [mount, setMount] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const feedLoad = useCallback(async () => {
    if (!reload && data.length > 0) {
      return;
    }
    try {
      const response = await api.get('/notification');

      setData(response.data.notifications);
      setLoading(false);
    } catch (error) {
      setLoading(true);
      return;
    }
  }, [reload, data]);

  useEffect(() => {
    if (!mount) {
      feedLoad();
      setMount(!mount);
    }
  }, [feedLoad, mount]);

  async function handleLoadMore() {
    setRefreshing(true);
    await feedLoad();
    setRefreshing(false);
  }

  return (
    <>
      {visibleModalNotification && (
        <View style={styles.modalNoti}>
          <View style={styles.triangle} />

          <FlatList
            onEndReached={() => feedLoad()}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleLoadMore}
              />
            }
            keyExtractor={(item) => String(item.id)}
            data={data}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Post', {
                    id: item.link,
                  })
                }
                style={styles.items_noti}>
                <Text style={{color: '#eee', fontSize: 16, width: '50%'}}>
                  {item.description}
                </Text>
                <Text style={{color: '#888', fontSize: 12}}>
                  {timeSince(item.dateTimePosted)}
                </Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {loading ? (
                  <Loading />
                ) : (
                  <Text
                    style={{
                      color: '#888',
                      fontSize: 12,
                      padding: 10,
                    }}>
                    .
                  </Text>
                )}
              </View>
            }
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalNoti: {
    position: 'absolute',
    width: 300,
    backgroundColor: '#282828',
    top: 50,
    zIndex: 20,
    height: 300,
    borderRadius: 6,
    elevation: 9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  items_noti: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    position: 'absolute',
    left: 6,
    top: -10,
    zIndex: -20,
    borderTopWidth: 0,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftWidth: 15,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#282828',
    borderLeftColor: 'transparent',
  },
});
