import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Landing from '../screens/Landing';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';
import ResetPassword from '../screens/ResetPassword';
import ConfirmEmail from '../screens/ConfirmEmail';

const Stack = createStackNavigator();

export default function AuthRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Signin" component={SignIn} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />
    </Stack.Navigator>
  );
}
