import React, {useRef} from 'react';
import {
  Text,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';
import {ToastErrors, ToastSuccess} from '../../utils/tryToasts';
import {styles, colors} from './styles';
import api from '../../services/api';
import Button from '../../components/Button';

type StackParamsList = {
  P: {
    token: string;
  };
};

interface IResetPassword {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const focusNext = useRef<TextInput>(null);
  const routes = useRoute<RouteProp<StackParamsList, 'P'>>();
  const {token} = routes.params;

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={{color: colors.primaryColor}}>
          SORRY, Something wrong, try again
        </Text>
      </View>
    );
  }

  async function handleSubmitResetPassword({
    password,
    confirmPassword,
  }: IResetPassword) {
    try {
      const schema = Yup.object().shape({
        password: Yup.string().required('Password required').min(6),
        confirmPassword: Yup.string()
          .min(6)
          .oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
      });

      await schema.validate({password, confirmPassword}, {abortEarly: false});
      await api.post(
        '/user/password/reset',
        {password},
        {
          params: {
            token,
          },
        },
      );

      ToastSuccess('passwords changed');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        ToastErrors(errors.confirmPassword || errors.password);
        return;
      }

      ToastErrors(
        err.response ? err.response.data.message : 'Something went wrong',
      );
    }
  }

  return (
    <Formik
      initialValues={{password: '', confirmPassword: ''}}
      onSubmit={(values) => handleSubmitResetPassword(values)}>
      {({handleChange, handleSubmit, values}) => (
        <KeyboardAvoidingView
          style={{flex: 1, backgroundColor: '#121212'}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled>
          <ScrollView
            contentContainerStyle={{flex: 1, backgroundColor: '#121212'}}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View>
                <Text style={styles.title}>
                  pay attention to your passwords
                </Text>
                <TextInput
                  style={[styles.input, styles.inputNewPassword]}
                  autoCompleteType="password"
                  placeholder="new password"
                  secureTextEntry={true}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  placeholderTextColor="#888"
                  autoCorrect
                  returnKeyType="next"
                  onSubmitEditing={() => focusNext.current?.focus()}
                />
                <TextInput
                  style={[styles.input, styles.inputConfirmPassword]}
                  ref={focusNext}
                  autoCompleteType="password"
                  placeholder="confirm new password"
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
                cond={values.password && values.confirmPassword}
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
