import React from 'react';
import {Dimensions} from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  Center,
  FormControl,
  FormControlError,
  // FormControlErrorIcon,
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
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
// import * as VectorIcons from '@expo/vector-icons';
import {Controller, useForm} from 'react-hook-form';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';

const {height, width} = Dimensions.get('window');

// const Icon = (name: any, size: number) => (
//   <VectorIcons.Ionicons name={name} size={size} />
// );

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
  const toast = useToast();

  const onSubmit = (data: IForm) => {
    signIn(data.identity, data.password).then(success => {
      if (!success) {
        toast.show({
          render: () => {
            return (
              <Toast w={width - 40} bgColor="red">
                <VStack space="xs">
                  <ToastTitle fontWeight="bold" color="white">
                    Authentication Failure
                  </ToastTitle>
                  <ToastDescription color="white">
                    Please use valid credential
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
          placement: 'bottom',
        });
      }
    });
  };

  return (
    <Box
      h={height}
      w={width}
      mb={200}
      // justifyContent="center"
      paddingTop={height / 10}
      alignItems="center"
      borderWidth={0}>
      <VStack width={'$96'} p={2} pb={'$6'} space={'2xl'}>
        <Center>
          <Image
            size="xl"
            borderRadius={20}
            source={require('../../../assets/logo.png')}
          />
        </Center>
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
              {/* <FormControlErrorIcon as={Icon('alert-circle-outline', 20)} /> */}
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
              {/* <FormControlErrorIcon as={Icon('alert-circle-outline', 20)} /> */}
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
