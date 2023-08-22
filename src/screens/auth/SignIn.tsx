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

type Props = NativeStackScreenProps<AuthStackParams, 'SignIn'>;

type IForm = {
  identity: string;
  password: string;
};

const SignInScreen: React.FC<Props> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IForm>({
    defaultValues: {
      identity: '',
      password: '',
    },
  });

  const {signIn} = useApp();

  const onSubmit = (data: {identity: string; password: string}) => {
    signIn(data.identity, data.password);
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
          isInvalid={typeof errors?.identity?.message !== 'undefined'}
          isRequired={true}
          shadowRadius={20}>
          <FormControlLabel>
            <FormControlLabelText fontWeight="bold">
              Email / Username
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            name="identity"
            rules={{
              required: 'Please enter your email or username',
            }}
            control={control}
            render={({field: {onBlur, onChange, value}}) => {
              return (
                <Input>
                  <InputInput
                    type="text"
                    placeholder="Email / Username"
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
              Enter your email or username
            </FormControlHelperText>
          </FormControlHelper>
          {errors?.identity && (
            <FormControlError>
              <FormControlErrorIcon
                as={() => <Ionicons name="alert-circle-outline" size={20} />}
              />
              <FormControlErrorText>
                {errors.identity.message}
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
            <ButtonText>Sign In</ButtonText>
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
          <Link onPress={() => navigation.navigate('SignUp')}>
            <LinkText fontWeight="$bold">Sign Up</LinkText>
          </Link>
          <Link onPress={() => navigation.navigate('ForgotPassword')}>
            <LinkText fontWeight="$bold">Forgot Password</LinkText>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SignInScreen;
