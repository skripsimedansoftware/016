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
import {TabNavigatorParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';
import LabelItem from '@/components/LabelItem';
import AppForm from '@/components/Form';
import {useForm} from 'react-hook-form';
import LottieLoader from '@/components/LottieLoader';

type IForm = {
  email: string;
  username: string;
  nama_lengkap: string;
};

type Props = NativeStackScreenProps<TabNavigatorParams, 'Account'>;

const AccountScreen: React.FC<Props> = ({route, navigation}) => {
  const {height, width} = useWindowDimensions();
  const {request, authInfo, setAuthInfo, signOut} = useApp();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [previewImage, setPreviewImage] = React.useState<string | boolean>(
    false,
  );

  const backActionHandler = React.useCallback(() => {
    if (previewImage) {
      setPreviewImage(false);
      return true;
    }

    if (route.params?.edit) {
      navigation.setParams({edit: false});
      return true;
    }

    return false;
  }, [navigation, route.params, previewImage]);

  const onBlurAction = React.useCallback(() => {
    setPreviewImage(false);
    navigation.setParams({edit: false});
  }, [navigation]);

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<IForm>({
    defaultValues: {
      email: authInfo?.email,
      username: authInfo?.username,
      nama_lengkap: authInfo?.nama_lengkap,
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
    };
  }, [navigation, backActionHandler, onBlurAction]);

  if (previewImage) {
    return <Image source={{uri: previewImage as string}} flex={1} />;
  }

  if (loading) {
    return <LottieLoader message="Memperbaharui profil" />;
  }

  if (route.params?.edit) {
    return (
      <Box flex={1} p={20}>
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
            <ButtonText>Kirim</ButtonText>
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
        </Box>
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
