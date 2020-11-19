import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import {Formik} from 'formik';

import {ToastErrors} from '../../../../utils/tryToasts';
import {stylesEditsPages} from '../../styles';
import getValidationErrors from '../../../../utils/getValidationErrors';
import {useAuth} from '../../../../hooks/auth';
import api from '../../../../services/api';
import {colors} from '../../../../styles';
import Button from '../../../../components/Button';

interface IEditName {
  name: string;
}

export default function EditName() {
  const navigation = useNavigation();
  const {user} = useAuth();

  async function handleSubmitName({name}: IEditName) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Name required').min(3),
      });

      await schema.validate({name}, {abortEarly: false});

      await api.patch('/user/name', {name});
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        ToastErrors(errors.name);
        return;
      }

      ToastErrors('Something went wrong');
    }
  }

  return (
    <Formik
      initialValues={{name: user.name ? user.name : ''}}
      onSubmit={(values) => handleSubmitName(values)}>
      {({handleChange, handleSubmit, values}) => (
        <KeyboardAvoidingView
          style={{flex: 1, backgroundColor: colors.backgroundColor}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled>
          <ScrollView>
            <View style={stylesEditsPages.container}>
              <View style={stylesEditsPages.header}>
                <TouchableOpacity
                  style={{padding: 10}}
                  onPress={() => navigation.goBack()}>
                  <AntDesign
                    name="arrowleft"
                    size={24}
                    color={colors.primaryColor}
                  />
                </TouchableOpacity>
                <Text style={stylesEditsPages.headerText}>NAME</Text>
                <View style={{width: 50}} />
              </View>

              <View style={{padding: 15}}>
                <View style={stylesEditsPages.div}>
                  <TextInput
                    style={stylesEditsPages.input}
                    placeholder="fulano"
                    keyboardType="default"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    placeholderTextColor="#888"
                    autoCorrect
                  />
                </View>

                <Button
                  handleSubmit={handleSubmit}
                  loading={true}
                  cond={user.name ? user.name : values.name}
                  text="SAVE"
                  style={{height: 50}}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}
