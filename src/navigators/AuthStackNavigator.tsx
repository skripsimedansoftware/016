import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParams} from '@/interfaces/NavigatorParams';
import SignInScreen from '@/screens/auth/SignIn';
import SignUpScreen from '@/screens/auth/SignUp';
import ForgotPasswordScreen from '@/screens/auth/ForgotPassword';
import ResetPasswordScreen from '@/screens/auth/ResetPassword';

const AuthStack = createNativeStackNavigator<AuthStackParams>();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        contentStyle: {
          backgroundColor: 'white',
        },
      }}
      initialRouteName="SignIn">
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
