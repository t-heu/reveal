import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';

import {ToastErrors} from '../../utils/tryToasts';
import Header from '../../components/Header';
import api from '../../services/api';
import Post from '../../components/Post';
import Loading from '../../components/Loading';
import {stylesContainerPosts} from '../../styles';

export default function Home() {
  const [data, setData] = useState([] as any);
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const feedLoad = useCallback(
    async (pageNumber = page, shouldRefresh = false) => {
      try {
        if (Number(total) && pageNumber > Number(total)) {
          return;
        }

        setLoading(true);

        const response = await api.get('/feed/post', {
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
        return;
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
      <Header />

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
