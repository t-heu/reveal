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

import {useAuth} from '../../../../hooks/auth';
import {ToastErrors, ToastSuccess} from '../../../../utils/tryToasts';
import {stylesEditsPages} from '../../styles';
import getValidationErrors from '../../../../utils/getValidationErrors';
import api from '../../../../services/api';
import {colors} from '../../../../styles';
import Button from '../../../../components/Button';

interface IEditPassword {
  newPassword: string;
  confirmPassword: string;
  oldPassword: string;
}

export default function EditPassword() {
  const {signout} = useAuth();
  const navigation = useNavigation();

  async function handleSubmitPassword({
    newPassword,
    confirmPassword,
    oldPassword,
  }: IEditPassword) {
    try {
      const schema = Yup.object().shape({
        oldPassword: Yup.string().required('Old Password required').min(6),
        newPassword: Yup.string().required('Password required').min(6),
        confirmPassword: Yup.string()
          .min(6)
          .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match'),
      });

      await schema.validate(
        {newPassword, confirmPassword, oldPassword},
        {abortEarly: false},
      );

      await api.put('/user/password', {newPassword, oldPassword});
      ToastSuccess('Changed');
      await signout();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        ToastErrors(
          errors.newPassword || errors.oldPassword || errors.confirmPassword,
        );
        return;
      }

      ToastErrors('Something went wrong');
    }
  }

  return (
    <Formik
      initialValues={{newPassword: '', oldPassword: '', confirmPassword: ''}}
      onSubmit={(values) => handleSubmitPassword(values)}>
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
                <Text style={stylesEditsPages.headerText}>PASSWORD</Text>
                <View style={{width: 50}} />
              </View>

              <View style={{padding: 15}}>
                <View style={stylesEditsPages.div}>
                  <TextInput
                    style={stylesEditsPages.input}
                    autoCompleteType="password"
                    placeholder="Current password"
                    secureTextEntry={true}
                    value={values.oldPassword}
                    onChangeText={handleChange('oldPassword')}
                    placeholderTextColor="#888"
                    autoCorrect
                  />
                  <TextInput
                    style={stylesEditsPages.input}
                    autoCompleteType="password"
                    placeholder="New password"
                    secureTextEntry={true}
                    value={values.newPassword}
                    onChangeText={handleChange('newPassword')}
                    placeholderTextColor="#888"
                    autoCorrect
                  />
                  <TextInput
                    style={stylesEditsPages.input}
                    autoCompleteType="password"
                    placeholder="Confirm new password"
                    secureTextEntry={true}
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    placeholderTextColor="#888"
                    autoCorrect
                  />
                </View>

                <Button
                  handleSubmit={handleSubmit}
                  loading={true}
                  cond={
                    values.oldPassword &&
                    values.newPassword &&
                    values.confirmPassword
                  }
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
