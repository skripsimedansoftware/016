import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import UsersScreen from '@/screens/user/List';
import SettingsScreeen from '@/screens/app/Settings';
import RegistrationScreen from '@/screens/app/Registration';
import ActivityScreen from '@/screens/app/Activity';
import MonitoringScreen from '@/screens/app/Monitoring';
import ReportScreen from '@/screens/app/Report';
import ImagePreview from '@/screens/app/ImagePreview';
import OpenStreetMap from '@/screens/app/OpenStreetMap';
import Header from '@/components/Header';
import UserProfileScreen from '@/screens/user/Profile';
import MonitoringDetailScreen from '@/screens/app/MonitoringDetail';
import TabNavigator from './TabNavigator';
import ActivityDetailScreen from '@/screens/app/ActivityDetail';

const AppStack = createNativeStackNavigator<AppStackNavigatorParams>();

const AppStackNavigator = () => {
  return (
    <AppStack.Navigator
      initialRouteName="Tab"
      screenOptions={{
        header: Header,
        headerShown: true,
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <AppStack.Screen
        name="Tab"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <AppStack.Screen name="Users" component={UsersScreen} />
      <AppStack.Screen name="UserProfile" component={UserProfileScreen} />
      <AppStack.Screen name="Report" component={ReportScreen} />
      <AppStack.Screen name="Activity" component={ActivityScreen} />
      <AppStack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
      <AppStack.Screen name="Settings" component={SettingsScreeen} />
      <AppStack.Screen name="Monitoring" component={MonitoringScreen} />
      <AppStack.Screen
        name="MonitoringDetail"
        component={MonitoringDetailScreen}
      />
      <AppStack.Screen name="Registration" component={RegistrationScreen} />
      <AppStack.Screen name="OpenStreetMap" component={OpenStreetMap} />
      <AppStack.Screen
        name="ImagePreview"
        component={ImagePreview}
        options={{
          headerShown: false,
        }}
      />
    </AppStack.Navigator>
  );
};

export default AppStackNavigator;
