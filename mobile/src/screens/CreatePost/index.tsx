import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import {Formik} from 'formik';

import {styles} from './styles';
import {ToastErrors} from '../../utils/tryToasts';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ICreatePost {
  description: string;
}

export default function CreatePost() {
  const navigation = useNavigation();

  async function handleSubmitCreatePost({description}: ICreatePost) {
    try {
      const schema = Yup.object().shape({
        description: Yup.string()
          .required('Description required')
          .min(3)
          .max(100),
      });

      await schema.validate({description}, {abortEarly: false});

      await api.post('/feed/post', {
        description,
      });

      navigation.goBack();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        ToastErrors(errors.description);
        return;
      }

      ToastErrors('Something went wrong');
    }
  }

  return (
    <Formik
      initialValues={{description: ''}}
      onSubmit={(values) => handleSubmitCreatePost(values)}>
      {({handleChange, handleSubmit, values}) => (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="x" color="#fff" size={20} />
            </TouchableOpacity>
            <Text style={styles.headerText}>SHARE</Text>
            <TouchableOpacity onPress={() => handleSubmit()}>
              <Feather name="send" color="#fff" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="share your idea/secret"
              keyboardType="default"
              multiline
              value={values.description}
              onChangeText={handleChange('description')}
              placeholderTextColor="#999"
              autoCorrect
              returnKeyType="next"
            />
          </ScrollView>
        </View>
      )}
    </Formik>
  );
}
