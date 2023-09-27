import React from 'react';
import {Dimensions} from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  Image,
  Input,
  InputInput,
  Link,
  LinkText,
  VStack,
} from '@gluestack-ui/themed';
import * as VectorIcons from '@expo/vector-icons';
import {Controller, useForm} from 'react-hook-form';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';

const {height, width} = Dimensions.get('window');

const Icon = (name: any, size: number) => (
  <VectorIcons.Ionicons name={name} size={size} />
);

type Props = NativeStackScreenProps<AuthStackParams, 'SignUp'>;

type IForm = {
  email: string;
  nama_lengkap: string;
  password: string;
};

const SignUpScreen: React.FC<Props> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IForm>({
    defaultValues: {
      email: '',
      nama_lengkap: '',
      password: '',
    },
  });

  const {
    request,
    setIsAuthenticating,
    setIsAuthenticated,
    setAuthInfo,
    setAuthToken,
  } = useApp();

  const onSubmit = (data: IForm) => {
    setIsAuthenticating(true);
    request.post('auth/sign-up', data).then(
      response => {
        setAuthInfo(response.data.pengguna);
        setAuthToken(response.data.token);
        setIsAuthenticated(true);
        setIsAuthenticating(false);
      },
      error => {
        setIsAuthenticating(false);
        if (!error.response) {
          //
        }
      },
    );
  };

  return (
    <Box
      h={height}
      w={width}
      mb={200}
      justifyContent="center"
      alignItems="center"
      borderWidth={0}>
      <VStack width={'$96'} p={2} pb={'$6'} space={'2xl'}>
        <Center>
          <Image
            alt="Logo"
            size="xl"
            borderRadius={20}
            source={require('../../../assets/logo.png')}
          />
        </Center>
        <FormControl
          size="lg"
          isInvalid={typeof errors?.nama_lengkap?.message !== 'undefined'}
          isRequired={true}
          shadowRadius={20}>
          <FormControlLabel>
            <FormControlLabelText fontWeight="bold">
              Nama Lengkap
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="nama_lengkap"
            rules={{
              required: 'Masukkan nama lengkap Anda',
            }}
            control={control}
            render={({field: {onBlur, onChange, value}}) => {
              return (
                <Input>
                  <InputInput
                    type="text"
                    placeholder="Nama Lengkap"
                    placeholderTextColor={'gray'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              );
            }}
          />
          <FormControlHelper>
            <FormControlHelperText>Nama Lengkap Anda</FormControlHelperText>
          </FormControlHelper>
          {errors?.nama_lengkap && (
            <FormControlError>
              <FormControlErrorIcon
                as={() => Icon('alert-circle-outline', 20)}
              />
              <FormControlErrorText>
                {errors.nama_lengkap.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <FormControl
          size="lg"
          isInvalid={typeof errors?.email?.message !== 'undefined'}
          isRequired={true}
          shadowRadius={20}>
          <FormControlLabel>
            <FormControlLabelText fontWeight="bold">Email</FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="email"
            rules={{
              required: 'Silahkan masukkan alamat email',
            }}
            control={control}
            render={({field: {onBlur, onChange, value}}) => {
              return (
                <Input>
                  <InputInput
                    type="text"
                    placeholder="Email"
                    placeholderTextColor={'gray'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              );
            }}
          />
          <FormControlHelper>
            <FormControlHelperText>Alamat Email Anda</FormControlHelperText>
          </FormControlHelper>
          {errors?.email && (
            <FormControlError>
              <FormControlErrorIcon
                as={() => Icon('alert-circle-outline', 20)}
              />
              <FormControlErrorText>
                {errors.email.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <FormControl
          size="lg"
          isInvalid={typeof errors?.password?.message !== 'undefined'}
          isRequired={true}>
          <FormControlLabel mb="$1">
            <FormControlLabelText fontWeight="bold">
              Kata sandi
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Masukkan kata sandi anda',
            }}
            render={({field: {onBlur, onChange, value}}) => {
              return (
                <Input>
                  <InputInput
                    type="password"
                    placeholder="Kata sandi"
                    placeholderTextColor={'gray'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              );
            }}
          />
          <FormControlHelper>
            <FormControlHelperText>
              Kata sandi untuk akun baru
            </FormControlHelperText>
          </FormControlHelper>
          {errors?.password && (
            <FormControlError>
              <FormControlErrorIcon
                as={() => Icon('alert-circle-outline', 20)}
              />
              <FormControlErrorText>
                {errors.password.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </VStack>
      <VStack w={'$96'} p={10} borderBottomWidth={1} paddingBottom={24}>
        <Box>
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Mendaftar</ButtonText>
          </Button>
        </Box>
      </VStack>
      <VStack
        borderWidth={0}
        mt={10}
        width={'$96'}
        justifyContent="center"
        alignItems="center">
        <HStack
          justifyContent="space-between"
          alignContent="space-between"
          w={'100%'}
          borderWidth={0}>
          <Link onPress={() => navigation.navigate('SignIn')}>
            <LinkText fontWeight="$bold">Sign In</LinkText>
          </Link>
          <Link onPress={() => navigation.navigate('ForgotPassword')}>
            <LinkText fontWeight="$bold">Forgot Password</LinkText>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SignUpScreen;
