import React from 'react';
import {BackHandler, TouchableOpacity, useWindowDimensions} from 'react-native';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonText,
  Center,
  Divider,
  HStack,
  Heading,
  Image,
  VStack,
} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import {useForm} from 'react-hook-form';
import {TabNavigatorParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';
import LabelItem from '@/components/LabelItem';
import AppForm from '@/components/Form';
import LottieLoader from '@/components/LottieLoader';
import {AppRole, UsahaStatus} from '@/interfaces/App';

type IForm = {
  email: string;
  username: string;
  nama_lengkap: string;
  foto_profil: string | null;
};

type Props = NativeStackScreenProps<TabNavigatorParams, 'Account'>;

const AccountScreen: React.FC<Props> = ({route, navigation}) => {
  const {height, width} = useWindowDimensions();
  const {request, authInfo, setAuthInfo, signOut} = useApp();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [previewImage, setPreviewImage] = React.useState<string | boolean>(
    false,
  );
  const [usahaStatus, setUsahaStatus] =
    React.useState<UsahaStatus>('melengkapi');

  const [usahaID, setUsahaID] = React.useState<number>(0);

  const loadInfoUsaha = React.useCallback(() => {
    request
      .get<{id: number; owner: number; status: UsahaStatus}>(
        '/daftar-usaha/mine',
      )
      .then(response => {
        setUsahaID(response.data.id);
        setUsahaStatus(response.data.status);
      }, console.log);
  }, [request]);
  const backActionHandler = React.useCallback(() => {
    loadInfoUsaha();
    if (previewImage) {
      setPreviewImage(false);
      return true;
    }

    if (route.params?.edit) {
      navigation.setParams({edit: false});
      return true;
    }

    return false;
  }, [navigation, route.params, previewImage, loadInfoUsaha]);

  const onBlurAction = React.useCallback(() => {
    setPreviewImage(false);
    navigation.setParams({edit: false});
  }, [navigation]);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: {errors},
  } = useForm<IForm>({
    defaultValues: {
      email: authInfo?.email,
      username: authInfo?.username,
      nama_lengkap: authInfo?.nama_lengkap,
      foto_profil: authInfo?.foto_profil,
    },
  });

  const onSubmit = (form: IForm) => {
    setLoading(true);
    request.put(`/pengguna/profile/${authInfo?.id}`, form).then(
      ({data}) => {
        setAuthInfo(data);
        setLoading(false);
        navigation.setParams({edit: false});
      },
      error => {
        setLoading(false);
        if (error.response?.status === 400) {
          const errorFields = error.response.data.error;
          if (errorFields?.email) {
            setError('email', {
              type: 'required',
              message: errorFields.email.msg,
            });
          }

          if (errorFields?.username) {
            setError('username', {
              type: 'required',
              message: errorFields.username.msg,
            });
          }
        }
      },
    );
  };

  React.useEffect(() => {
    const backAction = BackHandler.addEventListener(
      'hardwareBackPress',
      backActionHandler,
    );
    navigation.addListener('blur', onBlurAction);

    return () => {
      backAction.remove();
      navigation.removeListener('blur', onBlurAction);
    };
  }, [navigation, backActionHandler, onBlurAction]);

  if (previewImage) {
    return (
      <Image alt="Image" source={{uri: previewImage as string}} flex={1} />
    );
  }

  if (loading) {
    return <LottieLoader message="Memperbaharui profil" />;
  }

  if (route.params?.edit) {
    return (
      <Box flex={1} p={20}>
        <Center>
          <TouchableOpacity
            onLongPress={async () => {
              const {assets, canceled} =
                await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 1,
                });

              if (!canceled) {
                setValue('foto_profil', assets[0].uri);
              }
            }}>
            <Avatar bgColor="$indigo600" size="2xl">
              <AvatarFallbackText>{authInfo?.nama_lengkap}</AvatarFallbackText>
              {watch('foto_profil') !== null && (
                <AvatarImage
                  source={{
                    uri: watch('foto_profil') as string,
                  }}
                  backgroundColor="black"
                />
              )}
            </Avatar>
          </TouchableOpacity>
        </Center>
        <VStack space="md">
          <AppForm
            control={control}
            name="email"
            label="Email"
            helperText="Nama Pengguna"
            rules={{required: 'Silahkan Email Anda'}}
            invalid={typeof errors.email?.type !== 'undefined'}
            required
            error={errors.email}
          />
          <AppForm
            control={control}
            name="username"
            label="Username"
            helperText="Nama Pengguna"
            rules={{required: 'Silahkan Username Anda'}}
            invalid={typeof errors.username?.type !== 'undefined'}
            required
            error={errors.username}
          />
          <AppForm
            control={control}
            name="nama_lengkap"
            label="Nama Lengkap"
            helperText="Nama Lengkap"
            rules={{required: 'Silahkan Nama Lengkap Anda'}}
            invalid={typeof errors.nama_lengkap?.type !== 'undefined'}
            required
            error={errors.nama_lengkap}
          />
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Simpan</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box borderWidth={0} mt={16} pt={20} height={height}>
      <Center>
        <TouchableOpacity
          onPress={() =>
            setPreviewImage(
              authInfo?.foto_profil || 'https://i.pravatar.cc/600',
            )
          }>
          <Avatar bgColor="$indigo600" size="2xl">
            <AvatarFallbackText>{authInfo?.nama_lengkap}</AvatarFallbackText>
            {authInfo?.foto_profil !== null && (
              <AvatarImage
                source={{
                  uri: authInfo?.foto_profil,
                }}
              />
            )}
          </Avatar>
        </TouchableOpacity>
      </Center>
      <Center borderWidth={0} marginTop={4}>
        <Heading fontSize={24}>{authInfo?.nama_lengkap}</Heading>
        <Divider width={width - width / 4} height={1} />
        <Heading>{authInfo?.jabatan}</Heading>
      </Center>
      <Box flexDirection="column">
        <Box flexDirection="column" paddingHorizontal={20} paddingTop={10}>
          <LabelItem label="NIK" value={authInfo?.nik} />
          <LabelItem label="Email" value={authInfo?.email} />
          <LabelItem label="Nama Lengkap" value={authInfo?.nama_lengkap} />
          {authInfo?.jabatan === AppRole.pengusaha && (
            <LabelItem label="Status Usaha" value={usahaStatus} />
          )}
        </Box>
        {['aktif', 'non-aktif'].indexOf(usahaStatus) !== -1 && (
          <Center py={'$8'}>
            {usahaStatus === 'non-aktif' ? (
              <Button
                action="positive"
                onPress={() => {
                  setLoading(true);
                  request.get(`/${usahaID}/set-status/aktif`).then(
                    () => {
                      setLoading(false);
                    },
                    () => {
                      setLoading(false);
                    },
                  );
                }}>
                <ButtonText>Aktifkan Usaha</ButtonText>
              </Button>
            ) : (
              <Button
                action="negative"
                onPress={() => {
                  setLoading(true);
                  request.get(`/${usahaID}/set-status/non-aktif`).then(
                    () => {
                      setLoading(false);
                    },
                    () => {
                      setLoading(false);
                    },
                  );
                }}>
                <ButtonText>Non Aktifkan Usaha</ButtonText>
              </Button>
            )}
          </Center>
        )}
        <HStack
          space={'2xl'}
          borderWidth={0}
          justifyContent="center"
          paddingTop={20}>
          <Button onPress={() => navigation.setParams({edit: true})}>
            <ButtonText>Sunting Profil</ButtonText>
          </Button>
          <Button bg="red" onPress={signOut}>
            <ButtonText>Keluar</ButtonText>
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default AccountScreen;
