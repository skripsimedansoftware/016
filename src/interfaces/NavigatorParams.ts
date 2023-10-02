import type {ImageSourcePropType} from 'react-native';
import {AppRole, IDaftarUsaha, UsahaStatus} from './App';

export type AuthStackParams = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

export type RegistrationStep = 1 | 2 | 3 | 4 | 5 | string | number | undefined;

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
  Registration:
    | {
        step: RegistrationStep;
        skipCheck?: boolean;
        usahaStatus?: UsahaStatus;
        submitStep?: {step: RegistrationStep; data: any};
      }
    | undefined;
  ImagePreview: {image: ImageSourcePropType};
  OpenStreetMap: {version: 1 | 2; query?: {lat: number; lon: number}};
};

export type TabNavigatorParams = {
  Info: undefined;
  Home: undefined;
  Account: {edit: boolean} | undefined;
};
