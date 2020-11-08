import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Ionicons, AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import {Formik} from 'formik';

import {ToastErrors} from '../../utils/tryToasts';
import getValidationErrors from '../../utils/getValidationErrors';
import {styles} from './styles';
import {colors} from '../../styles';
import {useAuth} from '../../hooks/auth';
import ButtonGoogle from '../../components/ButtonGoogle';
import Button from '../../components/Button';

interface ISignIn {
  email: string;
  password: string;
}

export default function SignIn() {
  const navigation = useNavigation();
  const focusNext = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(true);
  const {signin} = useAuth();

  async function handleSubmitSignIn({email, password}: ISignIn) {
    try {
      setLoading(false);
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail required')
          .email('Enter a valid e-mail address'),
        password: Yup.string().required('Password required').min(6),
      });

      await schema.validate({email, password}, {abortEarly: false});
      await signin({email, password});
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        ToastErrors(errors.email || errors.password);
        return;
      }

      ToastErrors(
        err.response ? err.response.data.message : 'Something went wrong',
      );
    } finally {
      setLoading(true);
    }
  }

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      onSubmit={(values) => handleSubmitSignIn(values)}>
      {({handleChange, handleSubmit, values}) => (
        <>
          <KeyboardAvoidingView
            style={{backgroundColor: colors.backgroundColor, flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled>
            <ScrollView keyboardShouldPersistTaps="handled">
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

                  <Text style={styles.title}>LogIn</Text>
                  <View style={styles.loginSocial}>
                    <ButtonGoogle />
                    <Text style={{color: '#fff', marginTop: 10}}>Or</Text>
                  </View>

                  <TextInput
                    style={[styles.input, styles.inputEmail]}
                    autoCompleteType="email"
                    placeholder="e-mail"
                    keyboardType="email-address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    placeholderTextColor="#888"
                    autoCorrect
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext.current?.focus()}
                  />

                  <View style={styles.fieldPassword}>
                    <TextInput
                      style={[styles.input, styles.inputPassword]}
                      ref={focusNext}
                      autoCompleteType="password"
                      placeholder="password"
                      secureTextEntry={showPassword}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      placeholderTextColor="#888"
                      autoCorrect
                    />

                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <Ionicons
                          name="md-eye"
                          size={18}
                          color={'#ccc'}
                          style={{marginRight: 12}}
                        />
                      ) : (
                        <Ionicons
                          name="md-eye-off"
                          size={18}
                          color={'#ccc'}
                          style={{marginRight: 12}}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.textForgotPassword}>
                      Forgot password
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <Button
            handleSubmit={handleSubmit}
            loading={loading}
            cond={values.email && values.password}
            text="LOGIN"
            style={{height: 55}}
          />
        </>
      )}
    </Formik>
  );
}
