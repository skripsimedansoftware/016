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
    formState: {errors},
  } = useForm<IForm>({
    defaultValues: {
      sektor_usaha: '',
    },
  });
  const {request} = useApp();
  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();
  // const [dataJenisUsaha, setDataJenisUsaha] = React.useState<PickerItem[]>([]);
  // const [dataSektorUsaha, setDataSektorUsaha] = React.useState<PickerItem[]>(
  //   [],
  // );
  // const [dataPrivinsi, setDataPrivinsi] = React.useState<PickerItem[]>([]);
  // const [dataKabupatenKota, setDataKabupatenKota] = React.useState<
  //   PickerItem[]
  // >([]);
  // const [dataKecamatan, setDataKecamatan] = React.useState<PickerItem[]>([]);
  // const [dataDesaKelurahan, setDataDesaKelurahan] = React.useState<
  //   PickerItem[]
  // >([]);
  const {width} = Dimensions.get('window');

  // const loadItems = React.useCallback(async () => {
  //   const jenisUsaha = await request.get('/meta-data/jenis-usaha');
  //   // const sektorUsaha = await request.get('/meta-data/sektor-usaha');
  //   // const provinces = await request.get('/meta-data/provinces');
  //   // const districts = await request.get('/meta-data/districts');
  //   // const villages = await request.get('/meta-data/villages');
  //   setDataJenisUsaha(jenisUsaha.data.rows);
  //   // setDataSektorUsaha(sektorUsaha.data.rows);
  //   // setDataPrivinsi(provinces.data.rows);

  //   // setDataKabupatenKota(provinces.data);
  //   // setDataKecamatan(districts.data);
  //   // setDataDesaKelurahan(villages.data);
  // }, [request]);

  // const loadRegencies = React.useCallback(
  //   async (provinceId: string) => {
  //     const regencies = await request.get(`/meta-data/regencies/${provinceId}`);
  //     setDataPrivinsi(regencies.data);
  //   },
  //   [request],
  // );

  React.useEffect(() => {}, []);

  const onSubmit = async (data: IForm) => {
    const formData = new FormData();

    formData.append('nik', data?.sektor_usaha);

    // Send request
    request.post('/pendaftaran/step-2', formData).then(
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
          <JenisUsahaPicker<IForm>
            size="sm"
            control={control}
            label="Jenis Usaha"
            name="jenis_usaha"
          />
          {/* <AppForm<IForm>
            control={control}
            name="jenis_usaha"
            label="Jenis Usaha"
            helperText="Jenis Usaha"
            rules={{required: 'Silahkan pilih jenis usaha'}}
            invalid={typeof errors.jenis_usaha?.message !== 'undefined'}
            required
            error={errors.jenis_usaha}
            isPicker
            pickerData={[]}
          /> */}
          {/* <AppForm<IForm>
            control={control}
            name="sektor_usaha"
            label="Sektor Usaha"
            helperText="Sektor Usaha"
            rules={{required: 'Silahkan pilih sektor usaha'}}
            invalid={typeof errors.sektor_usaha?.message !== 'undefined'}
            required
            error={errors.sektor_usaha}
            isPicker
            pickerData={dataSektorUsaha}
          /> */}
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Kirim</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default RegistrationStep2;
