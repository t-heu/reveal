import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from 'react-native';
import {Ionicons, AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';
import {Formik} from 'formik';

import {ToastSuccess, ToastErrors} from '../../utils/tryToasts';
import getValidationErrors from '../../utils/getValidationErrors';
import {styles} from './styles';
import {colors} from '../../styles';
import {useAuth} from '../../hooks/auth';
import ButtonGoogle from '../../components/ButtonGoogle';
import Button from '../../components/Button';

interface ISignUp {
  email: string;
  password: string;
  name: string;
}

export default function SignUp() {
  const {signup} = useAuth();
  const navigation = useNavigation();
  const nameInputRef = useRef<TextInput | any>(null);
  const passwordInputRef = useRef<TextInput | any>(null);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(true);

  async function handleSubmitSignUp({email, password, name}: ISignUp) {
    try {
      setLoading(false);
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail required')
          .email('Enter a valid e-mail address'),
        password: Yup.string().required('Password required').min(6),
        name: Yup.string().required('Name required').min(3),
      });

      await schema.validate({email, password, name}, {abortEarly: false});
      await signup({email, password, name});
      ToastSuccess('Your account confirmation has been sent to your email.');
      navigation.navigate('Signin');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        ToastErrors(errors.email || errors.name || errors.password);
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
      initialValues={{email: '', password: '', name: ''}}
      onSubmit={(values) => handleSubmitSignUp(values)}>
      {({handleChange, handleSubmit, values}) => (
        <>
          <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.backgroundColor}}
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

                  <Text style={styles.title}>Create Account</Text>
                  <View style={styles.loginSocial}>
                    <ButtonGoogle />
                    <Text style={{color: '#fff', marginTop: 10}}>Or</Text>
                  </View>

                  <TextInput
                    style={[styles.input, styles.inputEmail]}
                    autoCompleteType="email"
                    placeholder="e-mail"
                    keyboardType="email-address"
                    returnKeyType="next"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    placeholderTextColor="#888"
                    autoCorrect
                    onSubmitEditing={() => nameInputRef.current?.focus()}
                  />

                  <TextInput
                    style={[styles.input, styles.inputName]}
                    ref={nameInputRef}
                    autoCapitalize="none"
                    autoCompleteType="name"
                    placeholder="name"
                    keyboardType="default"
                    returnKeyType="next"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    placeholderTextColor="#888"
                    autoCorrect={false}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                  />

                  <View style={styles.inputPassword}>
                    <TextInput
                      style={[styles.input, styles.fieldPassword]}
                      ref={passwordInputRef}
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
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <Button
            handleSubmit={handleSubmit}
            loading={loading}
            cond={values.email && values.password && values.name}
            text="SUBMIT"
            style={{height: 55}}
          />
        </>
      )}
    </Formik>
  );
}
