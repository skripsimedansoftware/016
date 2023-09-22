import type {ImageSourcePropType} from 'react-native';
import {AppRole, IDaftarUsaha} from './App';

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
  ActivityDetail: {viewAs: AppRole; usaha?: IDaftarUsaha};
  Settings:
    | {
        part?: 'jenis-usaha' | 'sektor-usaha' | 'informasi' | 'banner';
      }
    | undefined;
  Monitoring: undefined;
  MonitoringDetail: {data: IDaftarUsaha};
  Registration: {step: 1 | 2 | 3 | 4 | string | number} | undefined;
  ImagePreview: {image: ImageSourcePropType};
  OpenStreetMap: {version: 1 | 2; query?: {lat: number; lon: number}};
};

export type TabNavigatorParams = {
  Info: undefined;
  Home: undefined;
  Account: {edit: boolean} | undefined;
};
