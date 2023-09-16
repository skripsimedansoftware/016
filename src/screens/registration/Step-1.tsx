import React from 'react';
import {Dimensions} from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  HStack,
  Image,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import {useForm} from 'react-hook-form';
import mime from 'mime';
import * as FileSystem from 'expo-file-system';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AppForm from '@/components/Form';
import {useApp} from '@/contexts/AppContext';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';

interface IForm {
  nik: string;
  nomor_hp: string;
  fotocopy_ktp: string;
  fotocopy_kk: string;
  fotocopy_npwp: string;
}

type NavigationProps = NativeStackNavigationProp<
  AppStackNavigatorParams,
  'Registration'
>;

const RegistrationStep1 = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<IForm>({
    defaultValues: {
      nik: '',
      nomor_hp: '',
      fotocopy_kk: '',
      fotocopy_ktp: '',
      fotocopy_npwp: '',
    },
  });
  const {request} = useApp();
  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();
  const {width} = Dimensions.get('window');

  const onSubmit = async (data: IForm) => {
    const formData = new FormData();
    const fotocopyKK = await FileSystem.getInfoAsync(data?.fotocopy_kk);
    const fotocopyKTP = await FileSystem.getInfoAsync(data?.fotocopy_ktp);
    const fotocopyNPWP = await FileSystem.getInfoAsync(data?.fotocopy_npwp);

    formData.append('nik', data?.nik);
    formData.append('nomor_hp', data?.nomor_hp);

    // KK
    if (fotocopyKK.exists) {
      formData.append('fotocopy_kk', {
        uri: data.fotocopy_kk,
        name: `fotocopy_kk.${mime.getExtension(data.fotocopy_kk)}`,
        type: mime.getType(data.fotocopy_kk) as string,
      });
    }

    // KTP
    if (fotocopyKTP.exists) {
      formData.append('fotocopy_ktp', {
        uri: data.fotocopy_ktp,
        name: `fotocopy_ktp.${mime.getExtension(data.fotocopy_ktp)}`,
        type: mime.getType(data.fotocopy_ktp) as string,
      });
    }

    // NPWP
    if (fotocopyNPWP.exists) {
      formData.append('fotocopy_npwp', {
        uri: data.fotocopy_npwp,
        name: `fotocopy_npwp.${mime.getExtension(data.fotocopy_npwp)}`,
        type: mime.getType(data.fotocopy_npwp) as string,
      });
    }

    // Send request
    request
      .post('/pendaftaran/step-1', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(
        () => {
          navigation.setParams({step: 2});
        },
        error => {
          if (typeof error.response !== 'undefined') {
            console.log(error.response.data);
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

  return (
    <Box borderWidth={0} padding={20} borderTopWidth={1}>
      <HStack borderWidth={0} borderColor="red">
        <VStack w={'$full'} space="lg">
          <AppForm<IForm>
            control={control}
            name="nik"
            label="NIK"
            placeholder="NIK"
            helperText="Nomor Induk Kependudukan"
            rules={{required: 'Silahkan masukkan NIK Anda'}}
            invalid={typeof errors.nik?.message !== 'undefined'}
            required
            error={errors.nik}
          />
          <AppForm
            control={control}
            name="nomor_hp"
            label="Nomor HP"
            placeholder="Nomor HP"
            helperText="Nomor Seluler"
            rules={{required: 'Silahkan masukkan nomor HP Anda'}}
            invalid={typeof errors.nomor_hp?.type !== 'undefined'}
            required
            error={errors.nomor_hp}
          />
          <HStack alignContent="center" justifyContent="space-evenly">
            <AppForm
              control={control}
              name="fotocopy_kk"
              label="Scan KK"
              helperText="Scan KK"
              rules={{required: 'Silahkan pilih file Scan KK Anda'}}
              invalid={typeof errors.fotocopy_kk?.type !== 'undefined'}
              required
              error={errors.fotocopy_kk}
              isFile
              isImage
            />
            {watch('fotocopy_kk') !== '' && (
              <Image source={{uri: watch('fotocopy_kk') as string}} size="md" />
            )}
          </HStack>
          <HStack alignContent="center" justifyContent="space-evenly">
            <AppForm
              control={control}
              name="fotocopy_ktp"
              label="Scan KTP"
              helperText="Scan KTP"
              rules={{required: 'Silahkan pilih file scan KTP Anda'}}
              invalid={typeof errors.fotocopy_ktp?.type !== 'undefined'}
              required
              error={errors.fotocopy_ktp}
              isFile
              isImage
            />
            {watch('fotocopy_ktp') !== '' && (
              <Image
                source={{uri: watch('fotocopy_ktp') as string}}
                size="md"
              />
            )}
          </HStack>
          <HStack alignContent="center" justifyContent="space-evenly">
            <AppForm
              control={control}
              name="fotocopy_npwp"
              label="Scan NPWP"
              helperText="Scan NPWP"
              rules={{required: 'Silahkan pilih file Scan NPWP Anda'}}
              invalid={typeof errors.fotocopy_npwp?.type !== 'undefined'}
              required
              error={errors.fotocopy_npwp}
              isFile
              isImage
            />
            {watch('fotocopy_npwp') !== '' && (
              <Image
                source={{uri: watch('fotocopy_npwp') as string}}
                size="md"
              />
            )}
          </HStack>
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Kirim</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default RegistrationStep1;
