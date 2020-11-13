import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import {Feather} from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

import {colors, stylesContainerPosts} from '../../styles';
import {useAuth} from '../../hooks/auth';
import {ToastSuccess, ToastErrors, ToastInfo} from '../../utils/tryToasts';
import Header from '../../components/Header';
import api from '../../services/api';
import Loading from '../../components/Loading';
import Post from '../../components/Post';
import {styles} from './styles';

export default function Profile() {
  const {user} = useAuth();
  const [data, setData] = useState<any>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(false);
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

        const response = await api.get('/feed/post/me', {
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

  async function handleSubmit() {
    try {
      const obj = {} as any;

      if (!photo) {
        return;
      }

      let filename = photo.split('/');
      obj.name = filename[filename.length - 1];
      obj.type = 'image/png';
      obj.uri = photo;

      const dataForm = new FormData();
      dataForm.append('photo', obj);

      setProgressVisible(true);
      await api.patch('/user/avatar', dataForm, {
        params: {
          filename: user.profilePicture,
        },
        headers: {
          'content-type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          let progressValue =
            Math.round((progressEvent.loaded * 100) / progressEvent.total) /
            100;
          setProgress(progressValue);
        },
      });

      ToastSuccess('photo updated');
      setProgressVisible(false);
    } catch (err) {
      setProgressVisible(false);
      ToastErrors(
        err.response ? err.response.data.message : 'Something went wrong',
      );
    }
  }

  async function handleCamera() {
    if (Constants.platform?.android) {
      const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        ToastInfo('we need camera roll permissions to make this work!');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      });

      if (!result.cancelled) {
        setPhoto(String(result.uri));
      }
    }
  }

  return (
    <View style={stylesContainerPosts.container}>
      <Header back={true} />

      <View style={styles.upload}>
        <TouchableOpacity onPress={() => handleCamera()}>
          <View style={styles.iconSendImage}>
            <Feather
              name="camera"
              color="#rgba(255, 255, 255, 0.9)"
              size={24}
            />
          </View>

          <Image
            style={styles.photo}
            source={{
              uri: !photo ? user.avatar_url : photo,
            }}
          />
        </TouchableOpacity>

        {photo && (
          <TouchableOpacity
            style={{padding: 10}}
            disabled={progressVisible}
            onPress={() => handleSubmit()}>
            <Feather name="send" color="#fff" size={20} />
          </TouchableOpacity>
        )}
      </View>

      {progressVisible && (
        <View style={styles.progress}>
          <Progress.Bar
            width={200}
            progress={progress}
            color={colors.primaryColor}
          />
        </View>
      )}

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
