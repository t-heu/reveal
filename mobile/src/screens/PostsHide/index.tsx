import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import {ToastErrors} from '../../utils/tryToasts';
import {colors, stylesContainerPosts} from '../../styles';
import {styles} from './styles';
import api from '../../services/api';
import Loading from '../../components/Loading';
import Post from '../../components/Post';

export default function PostsHide() {
  const navigation = useNavigation();
  const [data, setData] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [mount, setMount] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const feedLoad = useCallback(
    async (pageNumber = page, shouldRefresh = false) => {
      try {
        if (pageNumber > Number(total)) {
          return;
        }

        setLoading(true);

        const response = await api.get('/feed/post/hide', {
          params: {
            page: pageNumber,
          },
        });

        setData(shouldRefresh ? response.data : [...data, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(pageNumber + 10);
        setLoading(false);
      } catch (error) {
        ToastErrors('Loading failed');
      }
    },
    [total, page, data],
  );

  useEffect(() => {
    if (!mount) {
      feedLoad();
      setMount(!mount);
    }

    return () => {};
  }, [feedLoad, mount]);

  async function handleLoadMore() {
    setRefreshing(true);
    await feedLoad(0, true);
    setRefreshing(false);
  }

  return (
    <View style={stylesContainerPosts.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{padding: 15}}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color={colors.primaryColor} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        are you thinking of taking a post from here?
      </Text>

      <FlatList
        style={stylesContainerPosts.posts}
        onEndReached={() => feedLoad()}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleLoadMore} />
        }
        keyExtractor={(item) => String(item.id)}
        data={data}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => <Post data={item} />}
        ListFooterComponent={loading ? <Loading /> : null}
      />
    </View>
  );
}
