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
import {useApp} from '@/contexts/AppContext';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import JenisUsahaPicker from '@/components/Picker/JenisUsaha';
import SektorUsahaPicker from '@/components/Picker/SektorUsaha';
import ProvinsiPicker from '@/components/Picker/Provinsi';
import KabupatenAtauKotaPicker from '@/components/Picker/KabupatenAtauKota';
import KecamatanPicker from '@/components/Picker/Kecamatan';
import DesaAtauKelurahanPicker from '@/components/Picker/DesaAtauKelurahan';

/**
 * * Step 2
 * * Data pendaftaran :
 * * - Jenis usaha
 * * - Sektor usaha
 * * - Provinsi
 * * - Kabupaten / Kota
 * * - Kecamatan
 * * - Desa / Kelurahan
 */

interface IForm {
  jenis_usaha: string;
  sektor_usaha: string;
  provinsi: string;
  kabupaten_atau_kota: string;
  kecamatan: string;
  desa_atau_kelurahan: string;
}

type NavigationProps = NativeStackNavigationProp<
  AppStackNavigatorParams,
  'Registration'
>;

const RegistrationStep2 = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: {},
  } = useForm<IForm>({
    defaultValues: {
      sektor_usaha: '',
    },
  });
  const {request} = useApp();
  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();
  const {width} = Dimensions.get('window');

  const onSubmit = async (data: IForm) => {
    // Send request
    request.post('/pendaftaran/step-2', data).then(
      () => {
        navigation.setParams({step: 3});
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
                      Failure
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
          <JenisUsahaPicker<IForm>
            size="sm"
            control={control}
            label="Jenis Usaha"
            name="jenis_usaha"
          />

          <SektorUsahaPicker<IForm>
            size="sm"
            control={control}
            label="Sektor Usaha"
            name="sektor_usaha"
          />

          <ProvinsiPicker<IForm>
            size="sm"
            control={control}
            label="Provinsi"
            name="provinsi"
          />

          <KabupatenAtauKotaPicker<IForm>
            size="sm"
            control={control}
            label="Kabupaten / Kota"
            name="kabupaten_atau_kota"
            enabled={watch('provinsi') !== undefined}
            provinsi={watch('provinsi')}
          />

          <KecamatanPicker<IForm>
            size="sm"
            control={control}
            label="Kecamatan"
            name="kecamatan"
            enabled={watch('kabupaten_atau_kota') !== undefined}
            kabupaten_atau_kota={watch('kabupaten_atau_kota')}
          />

          <DesaAtauKelurahanPicker<IForm>
            size="sm"
            control={control}
            label="Desa / Kelurahan"
            name="desa_atau_kelurahan"
            enabled={watch('kecamatan') !== undefined}
            kecamatan={watch('kecamatan')}
          />
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Kirim</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default RegistrationStep2;
