import React from 'react';
import {useApp} from '@/contexts/AppContext';
import LoadingScreen from '@/screens/app/Loading';
import TabNavigator from './TabNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppNavigator = () => {
  const {
    isAuthenticated,
    isAuthenticating,
    setIsAuthenticated,
    setIsAuthenticating,
  } = useApp();

  React.useEffect(() => {
    const loadSession = async () => {
      setIsAuthenticating(true);
      const authToken = await AsyncStorage.getItem('AUTH-TOKEN');
      if (authToken !== null) {
        setIsAuthenticated(true);
      }

      setIsAuthenticating(false);
    };

    loadSession();
  }, [isAuthenticated]);

  if (isAuthenticating) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <TabNavigator /> : <AuthStackNavigator />;
};

export default AppNavigator;
