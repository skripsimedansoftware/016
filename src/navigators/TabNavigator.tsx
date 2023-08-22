import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import InfoScreen from '@/screens/app/Info';
import HomeScreen from '@/screens/app/Home';
import AccountScreen from '@/screens/user/Account';
import Ionicons from '@expo/vector-icons/Ionicons';
import {TabNavigatorParams} from '@/interfaces/NavigatorParams';

const Tab = createBottomTabNavigator<TabNavigatorParams>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      sceneContainerStyle={{
        backgroundColor: 'whitesmoke',
      }}
      screenOptions={{
        tabBarStyle: {
          height: 60,
          bottom: 16,
          left: 16,
          right: 16,
          paddingTop: 10,
          paddingBottom: 8,
          borderTopWidth: 0,
          borderWidth: 0,
          borderRadius: 20,
          elevation: 0,
          position: 'absolute',
          backgroundColor: 'transparent',
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          backgroundColor: '#FDD835',
          borderRadius: 10,
          justifyContent: 'center',
          marginLeft: 10,
          marginRight: 10,
          borderWidth: 0,
          elevation: 4,
        },
        headerShown: false,
        tabBarActiveTintColor: '#212121',
        tabBarInactiveTintColor: '#757575',
      }}>
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          tabBarIcon: ({size, color}) => {
            return (
              <Ionicons name="information-circle" size={size} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({size, color}) => {
            return <Ionicons name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({size, color}) => {
            return <Ionicons name="person-circle" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
