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
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AppForm from '@/components/Form';
import {useApp} from '@/contexts/AppContext';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';

interface IForm {
  fotocopy_keterangan_usaha: string;
  fotocopy_izin_usaha: string;
  foto_produksi: string;
}

type NavigationProps = NativeStackNavigationProp<
  AppStackNavigatorParams,
  'Registration'
>;

const RegistrationStep4: React.FC<{savedForm?: IForm}> = ({savedForm}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<IForm>({
    defaultValues: savedForm || {
      fotocopy_keterangan_usaha: '',
      fotocopy_izin_usaha: '',
      foto_produksi: '',
    },
  });
  const {request} = useApp();
  const toast = useToast();
  const router = useRoute<RouteProp<AppStackNavigatorParams, 'Registration'>>();
  const navigation = useNavigation<NavigationProps>();
  const {width} = Dimensions.get('window');

  const onSubmit = async (data: IForm) => {
    const formData = new FormData();
    const fotocopyKeteranganUsaha = await FileSystem.getInfoAsync(
      data?.fotocopy_keterangan_usaha,
    );
    const fotocopyIzinUsaha = await FileSystem.getInfoAsync(
      data?.fotocopy_izin_usaha,
    );
    const listFotoProduksi: string[] =
      data?.foto_produksi as unknown as string[];
    const fotoProduksi: FileSystem.FileInfo[] = await Promise.all(
      listFotoProduksi.map((item: string) => {
        return FileSystem.getInfoAsync(item);
      }),
    );

    // Fotocopy keterangan usaha
    if (fotocopyKeteranganUsaha.exists) {
      formData.append('fotocopy_keterangan_usaha', {
        uri: data.fotocopy_keterangan_usaha,
        name: `fotocopy_kk.${mime.getExtension(
          data.fotocopy_keterangan_usaha,
        )}`,
        type: mime.getType(data.fotocopy_keterangan_usaha) as string,
      });
    }

    // Fotocopy izin usaha
    if (fotocopyIzinUsaha.exists) {
      formData.append('fotocopy_izin_usaha', {
        uri: data.fotocopy_izin_usaha,
        name: `fotocopy_izin_usaha.${mime.getExtension(
          data.fotocopy_izin_usaha,
        )}`,
        type: mime.getType(data.fotocopy_izin_usaha) as string,
      });
    }

    // Foto produksi
    fotoProduksi.map(item => {
      if (item.exists) {
        formData.append('foto_produksi', {
          uri: item.uri,
          name: `foto_produksi.${mime.getExtension(item.uri)}`,
          type: mime.getType(item.uri) as string,
        });
      }
    });

    // Send request
    request
      .post('/pendaftaran/step-4', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(
        () => {
          navigation.setParams({
            ...router.params,
            step: 5,
            submitStep: {step: 4, data},
          });
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

  return (
    <Box borderWidth={0} padding={20} borderTopWidth={1}>
      <HStack borderWidth={0} borderColor="red">
        <VStack w={'$full'} space="lg">
          <HStack alignContent="center" justifyContent="space-evenly">
            <AppForm
              control={control}
              name="fotocopy_keterangan_usaha"
              label="Scan keterangan usaha"
              helperText="Scan keterangan usaha"
              rules={{
                required: 'Silahkan pilih file Scan keterangan usaha Anda',
              }}
              invalid={
                typeof errors.fotocopy_keterangan_usaha?.type !== 'undefined'
              }
              required
              error={errors.fotocopy_keterangan_usaha}
              isFile
              isImage
            />
            {watch('fotocopy_keterangan_usaha') !== '' && (
              <Image
                alt="Image"
                source={{uri: watch('fotocopy_keterangan_usaha') as string}}
                size="md"
              />
            )}
          </HStack>
          <HStack alignContent="center" justifyContent="space-evenly">
            <AppForm
              control={control}
              name="fotocopy_izin_usaha"
              label="Scan Izin Usaha"
              helperText="Scan Izin Usaha"
              rules={{required: 'Silahkan pilih file scan Izin Usaha Anda'}}
              invalid={typeof errors.fotocopy_izin_usaha?.type !== 'undefined'}
              required
              error={errors.fotocopy_izin_usaha}
              isFile
              isImage
            />
            {watch('fotocopy_izin_usaha') !== '' && (
              <Image
                alt="Image"
                source={{uri: watch('fotocopy_izin_usaha') as string}}
                size="md"
              />
            )}
          </HStack>
          <HStack alignContent="center" justifyContent="space-evenly">
            <AppForm
              control={control}
              name="foto_produksi"
              label="Foto Produksi"
              helperText="Foto Produksi"
              rules={{required: 'Silahkan pilih file Foto Produksi Anda'}}
              invalid={typeof errors.foto_produksi?.type !== 'undefined'}
              required
              error={errors.foto_produksi}
              isFile
              isMultiple={true}
              isImage
            />
          </HStack>
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Kirim</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default RegistrationStep4;
