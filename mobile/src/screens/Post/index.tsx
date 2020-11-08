import React, {useEffect, useState, useCallback} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';

import {styles, colors} from './styles';
import {ToastErrors} from '../../utils/tryToasts';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import Loading from '../../components/Loading';
import Comment from '../../components/Comment';

export default function Post({route}: any) {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([] as any);
  const [answer, setAnswer] = useState('');
  const [loadingScreen, setLoadingScreen] = useState(true);

  const {id} = route.params;

  const loadCall = useCallback(() => {
    api.get(`/feed/post/${id}`).then((res) => {
      setPosts(res.data);
      setLoadingScreen(false);
    });
  }, [id]);

  useEffect(() => {
    loadCall();
  }, [loadCall, id]);

  async function handleSubmitComment() {
    try {
      const schema = Yup.object().shape({
        answer: Yup.string().required('Answer required').min(3).max(100),
      });

      await schema.validate({answer}, {abortEarly: false});

      await api.post(`/comment/post/${id}`, {
        answer,
      });
      loadCall();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        ToastErrors(errors.answer);
        return;
      }

      ToastErrors('Something went wrong');
    } finally {
      setAnswer('');
    }
  }

  function handleSubmitLike() {
    api.post(`/feed/post/like/${id}`).then(() => loadCall());
  }

  if (loadingScreen) {
    return <Loading />;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={25} color={colors.primaryColor} />
          </TouchableOpacity>

          <Text style={styles.title}>
            comments ({posts.viewer_count_comments})
          </Text>
          <View style={styles.like}>
            <TouchableOpacity onPress={() => handleSubmitLike()}>
              {posts.viewer_has_liked ? (
                <AntDesign name="heart" size={20} color={'#e74c3c'} />
              ) : (
                <AntDesign name="hearto" size={20} color={'#ccc'} />
              )}
            </TouchableOpacity>
            <Text style={styles.likeText}>{posts.viewer_count_likes}</Text>
          </View>
        </View>

        <Comment id={id} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.inputCmt}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment"
              keyboardType="default"
              value={answer}
              onChangeText={setAnswer}
              placeholderTextColor="#777"
              autoCorrect
              returnKeyType="next"
            />

            <TouchableOpacity
              onPress={() => handleSubmitComment()}
              style={styles.btn}>
              <AntDesign name="enter" size={22} color={'#eee'} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
