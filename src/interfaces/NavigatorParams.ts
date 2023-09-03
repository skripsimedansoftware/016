import type {ImageSourcePropType} from 'react-native';
// import {NavigatorScreenParams} from '@react-navigation/native';

export type AuthStackParams = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

export type AppStackNavigatorParams = {
  Tab: TabNavigatorParams;
  Users: undefined;
  UserProfile: {id: number | string};
  Report: undefined;
  Activity: undefined;
  Settings:
    | {
        part?: 'jenis-usaha' | 'sektor-usaha';
      }
    | undefined;
  Monitoring: undefined;
  Registration: {step: 1 | 2 | 3 | 4} | undefined;
  ImagePreview: {image: ImageSourcePropType};
  OpenStreetMap: {version: 1 | 2};
};

export type TabNavigatorParams = {
  Info: undefined;
  Home: undefined;
  Account: {edit: boolean} | undefined;
};
