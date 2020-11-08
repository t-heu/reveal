import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AntDesign} from '@expo/vector-icons';
import {Formik} from 'formik';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';
import {ToastErrors, ToastSuccess} from '../../utils/tryToasts';
import {styles, colors} from './styles';
import api from '../../services/api';
import Button from '../../components/Button';

interface IForgotPassword {
  email: string;
}

export default function ForgotPassword() {
  const navigation = useNavigation();

  async function handleSubmitForgotPassword({email}: IForgotPassword) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail required')
          .email('Enter a valid e-mail address'),
      });

      await schema.validate({email}, {abortEarly: false});
      await api.post('/user/password/forgot', {email});
      ToastSuccess('check your e-mail');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        ToastErrors(errors.email);
        return;
      }

      ToastErrors(
        err.response ? err.response.data.message : 'Something went wrong',
      );
    }
  }

  return (
    <Formik
      initialValues={{email: ''}}
      onSubmit={(values) => handleSubmitForgotPassword(values)}>
      {({handleChange, handleSubmit, values}) => (
        <KeyboardAvoidingView
          style={{flex: 1, backgroundColor: colors.backgroundColor}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              backgroundColor: colors.backgroundColor,
            }}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign
                      name="arrowleft"
                      size={24}
                      color={colors.primaryColor}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.title}>
                  Enter the email address you used when you joined and we’ll
                  send you instructions to reset your password. For security
                  reasons, we do NOT store your password. So rest assured that
                  we will never send your password via email.
                </Text>
                <TextInput
                  style={styles.input}
                  autoCompleteType="email"
                  placeholder="e-mail"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  placeholderTextColor="#888"
                  autoCorrect
                />
              </View>

              <Button
                handleSubmit={handleSubmit}
                loading={true}
                cond={values.email}
                text="SEND"
                style={{height: 55}}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}
