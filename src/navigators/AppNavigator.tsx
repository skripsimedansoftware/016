import React from 'react';
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Heading,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import {useApp} from '@/contexts/AppContext';
import AuthStackNavigator from './AuthStackNavigator';
import AppStackNavigator from './AppStackNavigator';

const {height, width} = Dimensions.get('window');

const AppNavigator = () => {
  const {
    isAuthenticated,
    isAuthenticating,
    setAuthInfo,
    setIsAuthenticated,
    setIsAuthenticating,
    request,
  } = useApp();

  const toast = useToast();

  React.useEffect(() => {
    const loadSession = async () => {
      setIsAuthenticating(true);
      const authToken = await AsyncStorage.getItem('AUTH-TOKEN');
      if (authToken !== null && isAuthenticated === false) {
        request
          .get('/auth/validate-token', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then(
            ({data}) => {
              console.log({data});
              setAuthInfo(data.pengguna);
              setIsAuthenticated(true);
              setIsAuthenticating(false);
            },
            error => {
              setIsAuthenticating(false);
              if (!error.response) {
                toast.show({
                  placement: 'bottom',
                  render: () => {
                    return (
                      <Toast w={width - 40} bgColor="red">
                        <VStack space="xs">
                          <ToastTitle fontWeight="bold" color="white">
                            Authentication Failure
                          </ToastTitle>
                          <ToastDescription color="white">
                            Please check your network
                          </ToastDescription>
                        </VStack>
                      </Toast>
                    );
                  },
                });
              }
            },
          );
      } else {
        setIsAuthenticating(false);
      }
    };

    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (isAuthenticating) {
    const rotateXValue = new Animated.Value(0);
    const rotateYValue = new Animated.Value(0);

    const startXRotation = () => {
      rotateXValue.setValue(0);
      rotateYValue.setValue(0);

      Animated.timing(rotateXValue, {
        toValue: 2,
        duration: 3400,
        useNativeDriver: true,
      }).start(() => {
        startXRotation();
      });
    };

    const startYRotation = () => {
      rotateYValue.setValue(0);
      Animated.timing(rotateYValue, {
        toValue: 3,
        duration: 3400,
        useNativeDriver: true,
      }).start(() => {
        startYRotation();
      });
    };

    const rotateX = rotateXValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const rotateY = rotateYValue.interpolate({
      inputRange: [0, 1, 2, 3],
      outputRange: ['0deg', '180deg', '140deg', '360deg'],
    });

    startXRotation();
    startYRotation();

    const styles = StyleSheet.create({
      animatedImage: {
        alignSelf: 'center',
        transform: [
          {
            rotateX,
          },
          {
            rotateY,
          },
        ],
      },
    });

    return (
      <Box
        // justifyContent="center"
        mt={height / 4}
        alignItems="center"
        h={height}
        w={width}
        borderWidth={0}>
        <Animated.Image
          style={styles.animatedImage}
          source={require('../../assets/logo.png')}
        />
        <Heading>Authenticating...</Heading>
        <ActivityIndicator />
      </Box>
    );
  }

  return isAuthenticated ? <AppStackNavigator /> : <AuthStackNavigator />;
};

export default AppNavigator;
