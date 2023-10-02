import React from 'react';
import {
  Alert,
  AlertText,
  Box,
  Button,
  ButtonText,
  HStack,
  Heading,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {UsahaStatus} from '@/interfaces/App';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AppStackNavigatorParams,
  RegistrationStep,
} from '@/interfaces/NavigatorParams';

const RegistrationOverview: React.FC<{status: UsahaStatus}> = ({status}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AppStackNavigatorParams, 'Registration'>
    >();
  const route = useRoute<RouteProp<AppStackNavigatorParams, 'Registration'>>();

  if (status === 'pengajuan') {
    return (
      <Box flex={1} pb={'$1/6'} justifyContent="center" borderWidth={1}>
        <Box justifyContent="center" py={10}>
          <Alert mx="$2.5" action="warning" variant="solid">
            <AlertText>
              Status usaha anda masih dalam pengajuan, mohon menunggu.
            </AlertText>
          </Alert>
        </Box>
        <HStack justifyContent="center" space="lg">
          <Button action="negative" onPress={() => navigation.goBack()}>
            <ButtonText>Kembali</ButtonText>
          </Button>
          <Button
            action="positive"
            onPress={() => {
              navigation.navigate('Registration', {
                skipCheck: true,
                step: 1,
                usahaStatus: route.params?.usahaStatus,
              });
            }}>
            <ButtonText>Ubah Data</ButtonText>
          </Button>
        </HStack>
      </Box>
    );
  }

  if (status === 'perbaikan') {
    return (
      <Box flex={1}>
        <Text>Status</Text>
        <Button
          onPress={() => {
            navigation.navigate('Registration', {
              step: route.params?.step as RegistrationStep,
              skipCheck: true,
            });
          }}>
          <ButtonText>Lanjutkan</ButtonText>
        </Button>
      </Box>
    );
  }

  if (status === 'aktif') {
    return (
      <Box flex={1} pb={'$1/6'} justifyContent="center" borderWidth={1}>
        <Box justifyContent="center" py={10}>
          <Alert mx="$2.5" action="warning" variant="solid">
            <AlertText>
              Status usaha anda sudah aktif, apakah ingin memperbaharui data?
            </AlertText>
          </Alert>
        </Box>
        <HStack justifyContent="center" space="lg">
          <Button action="negative" onPress={() => navigation.goBack()}>
            <ButtonText>Tidak, Batalkan</ButtonText>
          </Button>
          <Button
            action="positive"
            onPress={() => {
              navigation.navigate('Registration', {
                skipCheck: true,
                step: 1,
                usahaStatus: route.params?.usahaStatus,
              });
            }}>
            <ButtonText>Ya, Lanjutkan</ButtonText>
          </Button>
        </HStack>
      </Box>
    );
  }

  if (status === 'non-aktif') {
    return (
      <Box flex={1}>
        <Text>OK</Text>
        <Button
          onPress={() => {
            navigation.navigate('Registration', {
              step: route.params?.step as RegistrationStep,
              skipCheck: true,
            });
          }}>
          <ButtonText>Lanjutkan</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <Box justifyContent="center" alignItems="center" borderWidth={0} flex={1}>
      <HStack>
        <VStack space="md">
          <Heading>Registrasi Usaha</Heading>
          <Text>Silahkan lakukan registrasi di lokasi usaha anda</Text>
          <Button
            onPress={() =>
              navigation.setParams({
                step: 1,
                usahaStatus: route.params?.usahaStatus,
                skipCheck: true,
              })
            }>
            <ButtonText>Lanjutkan</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default RegistrationOverview;
