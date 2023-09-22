import React from 'react';
import {Dimensions} from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  HStack,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import {useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import WebView from 'react-native-webview';
import {useApp} from '@/contexts/AppContext';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import LottieLoader from '@/components/LottieLoader';

/**
 * * Step 5
 * * Data pendaftaran :
 * * - latitude
 * * - longitude
 */
interface IForm {
  latitude: number;
  longitude: number;
}

type NavigationProps = NativeStackNavigationProp<
  AppStackNavigatorParams,
  'Registration'
>;

const RegistrationStep5 = () => {
  const {handleSubmit, setValue} = useForm<IForm>();
  const {request} = useApp();
  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();
  const {width} = Dimensions.get('window');
  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);

  React.useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
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
        return;
      }

      let position = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.BestForNavigation,
      });

      setLocation(position);
      setValue('latitude', position.coords.latitude);
      setValue('longitude', position.coords.longitude);
    })();
  }, [setValue, toast, width]);

  const onSubmit = async (data: IForm) => {
    // Send request
    request.post('/pendaftaran/step-5', data).then(
      () => {
        navigation.setParams({step: undefined});
        navigation.navigate('Report');
      },
      error => {
        if (typeof error.response !== 'undefined') {
          toast.show({
            placement: 'bottom',
            render: () => {
              return (
                <Toast w={width - 40} bgColor="red">
                  <VStack space="xs">
                    <ToastTitle fontWeight="bold" color="white">
                      Error
                    </ToastTitle>
                    <ToastDescription color="white">
                      Terjadi kesalahan
                    </ToastDescription>
                  </VStack>
                </Toast>
              );
            },
          });
        } else {
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
  };

  if (location === null) {
    return <LottieLoader />;
  }

  return (
    <Box borderWidth={0} padding={20} borderTopWidth={1} flex={1}>
      <HStack borderWidth={0} borderColor="red" flex={1}>
        <VStack w={'$full'} space="lg" flex={1}>
          <WebView
            source={{
              uri: `${request.getUri()}/open-street-map-2?lat=${location?.coords
                .latitude}&lon=${location?.coords.longitude}`,
            }}
          />
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Kirim</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default RegistrationStep5;
