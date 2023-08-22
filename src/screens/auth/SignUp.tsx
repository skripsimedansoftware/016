import {Dimensions} from 'react-native';
import React from 'react';
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  Input,
  InputInput,
  Link,
  LinkText,
  VStack,
} from '@gluestack-ui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Controller, useForm} from 'react-hook-form';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';

const {height, width} = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParams, 'SignUp'>;

type IForm = {
  email: string;
  full_name: string;
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
      full_name: '',
      password: '',
    },
  });

  const {signIn} = useApp();

  const onSubmit = (data: {email: string; password: string}) => {
    signIn(data.email, data.password);
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
        <FormControl
          size="lg"
          isInvalid={typeof errors?.full_name?.message !== 'undefined'}
          isRequired={true}
          shadowRadius={20}>
          <FormControlLabel>
            <FormControlLabelText fontWeight="bold">
              Full Name
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="full_name"
            rules={{
              required: 'Please enter your full name',
            }}
            control={control}
            render={({field: {onBlur, onChange, value}}) => {
              return (
                <Input>
                  <InputInput
                    type="text"
                    placeholder="Full Name"
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
            <FormControlHelperText>Enter your full name</FormControlHelperText>
          </FormControlHelper>
          {errors?.full_name && (
            <FormControlError>
              <FormControlErrorIcon
                as={() => <Ionicons name="alert-circle-outline" size={20} />}
              />
              <FormControlErrorText>
                {errors.full_name.message}
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
              required: 'Please enter your email address',
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
            <FormControlHelperText>Enter your email</FormControlHelperText>
          </FormControlHelper>
          {errors?.email && (
            <FormControlError>
              <FormControlErrorIcon
                as={() => <Ionicons name="alert-circle-outline" size={20} />}
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
              Password
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Please enter your password',
            }}
            render={({field: {onBlur, onChange, value}}) => {
              return (
                <Input>
                  <InputInput
                    type="password"
                    placeholder="Password"
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
            <FormControlHelperText>Enter your password</FormControlHelperText>
          </FormControlHelper>
          {errors?.password && (
            <FormControlError>
              <FormControlErrorIcon
                as={() => <Ionicons name="alert-circle-outline" size={20} />}
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
            <ButtonText>Sign Up</ButtonText>
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
