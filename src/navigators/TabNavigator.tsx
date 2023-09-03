import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import InfoScreen from '@/screens/app/Info';
import {TabNavigatorParams} from '@/interfaces/NavigatorParams';
import AccountScreen from '@/screens/user/Account';
import Header from '@/components/Header';
import HomeScreen from '@/screens/app/Home';

const Tab = createBottomTabNavigator<TabNavigatorParams>();

const Icon = (
  {
    size,
    color,
  }: {
    size: number;
    color: string;
    focused: boolean;
  },
  name: any,
) => <Ionicons name={name} size={size} color={color} />;

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      sceneContainerStyle={styles.sceneContainer}
      screenOptions={{
        tabBarStyle: {
          height: 60,
          bottom: 16,
          left: 16,
          right: 16,
          paddingTop: 10,
          paddingBottom: 8,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderRightWidth: 0,
          borderLeftWidth: 0,
          borderColor: 'black',
          borderRadius: 20,
          elevation: 0,
          position: 'absolute',
          // backgroundColor: '#FDD835',
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
          elevation: 2,
        },
        header: Header,
        headerShown: true,
        tabBarActiveTintColor: '#212121',
        tabBarInactiveTintColor: '#757575',
      }}>
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          tabBarIcon: ({color, size, focused}) =>
            Icon({color, size, focused}, 'information-circle'),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size, focused}) =>
            Icon({color, size, focused}, 'home'),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        initialParams={{
          edit: false,
        }}
        options={{
          tabBarIcon: ({color, size, focused}) =>
            Icon({color, size, focused}, 'person-circle'),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  sceneContainer: {
    backgroundColor: 'white',
  },
});

export default TabNavigator;
