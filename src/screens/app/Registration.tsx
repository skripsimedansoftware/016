import React from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {
  Box,
  Button,
  ButtonText,
  HStack,
  Heading,
  VStack,
} from '@gluestack-ui/themed';
import RegistrationStep1 from '../registration/Step-1';
import RegistrationStep2 from '../registration/Step-2';
import RegistrationStep3 from '../registration/Step-3';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'Registration'>;

const RegistrationScreen: React.FC<Props> = ({route, navigation}) => {
  const {height, width} = useWindowDimensions();
  const savedState = useAsyncStorage('registration');
  React.useEffect(() => {
    savedState.getItem().then(lastState => {
      if (lastState !== null && !route.params?.step) {
        navigation.setParams({step: parseFloat(lastState)});
      }
    });
  }, [savedState, route, navigation]);

  if (route.params?.step) {
    savedState.setItem(route.params.step.toString());
  }

  switch (route.params?.step) {
    case 1:
      return <RegistrationStep1 />;
    case 2:
      return <RegistrationStep2 />;
    case 3:
      return <RegistrationStep3 />;
    case 4:
      return (
        <View>
          <Text>RegistrationScreen {route.params.step}</Text>
        </View>
      );
    default:
      return (
        <Box
          justifyContent="center"
          alignItems="center"
          borderWidth={0}
          h={height}
          w={width}>
          <HStack mb={height / 6}>
            <VStack space="md">
              <Heading>Registrasi Usaha</Heading>
              <Text>Silahkan registrasi</Text>
              <Button onPress={() => navigation.setParams({step: 1})}>
                <ButtonText>Lanjutkan</ButtonText>
              </Button>
            </VStack>
          </HStack>
        </Box>
      );
  }
};

export default RegistrationScreen;
