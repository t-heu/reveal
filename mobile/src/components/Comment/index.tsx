import React, {useEffect, useState, useCallback, memo} from 'react';
import {Text, View, Image, FlatList, RefreshControl} from 'react-native';

import {ToastErrors} from '../../utils/tryToasts';
import {styles} from './styles';
import api from '../../services/api';
import Loading from '../../components/Loading';
import timeSince from '../../utils/timeSince';

interface Props {
  id: string;
}

function Comment({id}: Props) {
  const [data, setData] = useState([] as any);
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const commentsLoad = useCallback(
    async (pageNumber = page, shouldRefresh = false) => {
      try {
        if (Number(total) && pageNumber > Number(total)) {
          return;
        }

        setLoading(true);

        const response = await api.get(`/comment/post/${id}`, {
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
    [total, page, data, id],
  );

  useEffect(() => {
    if (!mount) {
      commentsLoad();
      setMount(!mount);
    }

    return () => {};
  }, [commentsLoad, mount]);

  async function handleLoadMore() {
    setRefreshing(true);
    await commentsLoad(0, true);
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      {data && data.length > 0 ? (
        <FlatList
          style={styles.commentContainer}
          onEndReached={() => commentsLoad()}
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
          renderItem={({item: comment}) => (
            <View key={comment.id} style={styles.comments}>
              <View style={styles.commentsProfile}>
                <Image
                  style={styles.commentsImage}
                  source={{
                    uri: comment.avatar_URL,
                  }}
                />
                <Text style={styles.text}>{comment.text.trim()}</Text>
              </View>

              <Text style={styles.dateText}>
                {timeSince(comment.dateTimePosted)}
              </Text>
            </View>
          )}
          ListFooterComponent={loading ? <Loading /> : null}
        />
      ) : null}
    </View>
  );
}

export default memo(Comment);
