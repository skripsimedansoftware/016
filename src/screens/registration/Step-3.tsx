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
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AppForm from '@/components/Form';
import {useApp} from '@/contexts/AppContext';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';

/**
 * * Step 3
 * * Data pendaftaran :
 * * - Brand / nama usaha
 * * - Deskripsi produk
 * * - Detail usaha
 * * - Alamat
 */
interface IForm {
  nama: string;
  produk: string;
  detail_usaha: string;
  alamat: string;
}

type NavigationProps = NativeStackNavigationProp<
  AppStackNavigatorParams,
  'Registration'
>;

const RegistrationStep3: React.FC<{savedForm?: IForm}> = ({savedForm}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IForm>({
    defaultValues: savedForm || {
      nama: '',
      produk: '',
      detail_usaha: '',
      alamat: '',
    },
  });
  const {request} = useApp();
  const toast = useToast();
  const router = useRoute<RouteProp<AppStackNavigatorParams, 'Registration'>>();
  const navigation = useNavigation<NavigationProps>();
  const {width} = Dimensions.get('window');

  const onSubmit = async (data: IForm) => {
    // Send request
    request.post('/pendaftaran/step-3', data).then(
      () => {
        navigation.setParams({
          ...router.params,
          submitStep: {step: 3, data},
          step: 4,
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
          <AppForm<IForm>
            control={control}
            name="nama"
            label="Nama"
            placeholder="Nama Usaha"
            helperText="Brand / Nama Usaha"
            rules={{required: 'Silahkan masukkan brand / nama usaha anda'}}
            invalid={typeof errors.nama?.message !== 'undefined'}
            required
            error={errors.nama}
          />
          <AppForm<IForm>
            control={control}
            name="produk"
            label="Produk"
            placeholder="Produk Usaha"
            helperText="Produk yang dihasilkan"
            rules={{required: 'Sikahkan masukkan produk anda'}}
            invalid={typeof errors.produk?.message !== 'undefined'}
            required
            error={errors.produk}
          />
          <AppForm<IForm>
            control={control}
            name="detail_usaha"
            label="Detail usaha"
            placeholder="Jelaskan secara detail tentang usaha anda"
            helperText="Jelaskan detail usaha anda"
            rules={{required: 'Sikahkan masukkan penjelasan usaha anda'}}
            invalid={typeof errors.detail_usaha?.message !== 'undefined'}
            required
            error={errors.detail_usaha}
          />
          <AppForm<IForm>
            control={control}
            name="alamat"
            label="Alamat"
            placeholder="Alamat Usaha"
            rules={{required: 'Sikahkan masukkan alamat usaha anda'}}
            invalid={typeof errors.produk?.message !== 'undefined'}
            required
            error={errors.produk}
          />
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Kirim</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default RegistrationStep3;
