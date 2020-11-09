import React, {memo, useState} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {AntDesign, Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import {useShareStateComponent} from '../../hooks/shareStateComponent';
import {styles} from './styles';
import api from '../../services/api';
import timeSince from '../../utils/timeSince';

function Post(data: any) {
  const {openModalBottomSheetPost} = useShareStateComponent();
  const navigation = useNavigation();
  const [likes, setLike] = useState({
    viewer_has_liked: data.data.viewer_has_liked,
    viewer_count_likes: data.data.viewer_count_likes,
  });

  async function handleSubmitLike(id: string) {
    await api.post(`/feed/post/like/${id}`);

    if (likes.viewer_has_liked) {
      setLike({
        viewer_has_liked: !likes.viewer_has_liked,
        viewer_count_likes: Number(likes.viewer_count_likes) - 1,
      });
    } else {
      setLike({
        viewer_has_liked: !likes.viewer_has_liked,
        viewer_count_likes: Number(likes.viewer_count_likes) + 1,
      });
    }
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Post', {
          id: data.data.id,
        })
      }
      style={styles.container}>
      <View style={styles.container_profile}>
        <Image
          style={styles.photo}
          source={{
            uri: data.data.user.avatar_url,
          }}
        />

        <TouchableOpacity onPress={() => handleSubmitLike(data.data.id)}>
          {likes.viewer_has_liked ? (
            <AntDesign name="heart" size={25} color={'#E74C3C'} />
          ) : (
            <AntDesign name="hearto" size={25} color={'#ddd'} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.container_box}>
        <View style={styles.headerPost}>
          <Text style={styles.dateText}>
            {timeSince(data.data.dateTimePosted)}
          </Text>

          <TouchableOpacity
            style={{padding: 2}}
            onPress={() =>
              openModalBottomSheetPost({
                id: data.data.id,
                viewer_has_hidePost: data.data.viewer_has_hidePost,
              })
            }>
            <Feather name="more-horizontal" size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{data.data.text}</Text>
        <View style={styles.footer}>
          <Text style={styles.textLiked}>{likes.viewer_count_likes} liked</Text>
          <Text style={styles.textComment}>
            {data.data.viewer_count_comments} comments
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(Post);
