import React from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  FlatList,
} from 'react-native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  Box,
  Button,
  ButtonText,
  Divider,
  Fab,
  FabLabel,
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
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import {Controller, useForm} from 'react-hook-form';
import Icon from '@expo/vector-icons/Ionicons';
import materialColors2014 from '@/config/MaterialColors2014';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';
import ListEmptyItem from '@/components/ListEmptyItem';
import {useNavigation} from '@react-navigation/native';
import LottieLoader from '@/components/LottieLoader';

type MetaDataType = {
  id?: number | string;
  name: string;
};

type ScreenProps = NativeStackScreenProps<AppStackNavigatorParams, 'Settings'>;

type NavigationProps = NativeStackNavigationProp<
  AppStackNavigatorParams,
  'Settings'
>;

const {width} = Dimensions.get('window');

const ErrorIcon = (name: any, size: number) => <Icon name={name} size={size} />;

const Menu: React.FC<{text: string; onPress?: () => void}> = ({
  text,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.menu} onPress={onPress}>
      <Text fontSize={18} fontWeight="bold" color="black">
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const ItemData: React.FC<{item: MetaDataType}> = ({item}) => {
  return (
    <HStack
      borderWidth={0}
      padding={10}
      alignContent="space-around"
      alignItems="center">
      <VStack w={'80%'}>
        <Text>{item.name}</Text>
      </VStack>
      <VStack w={'20%'}>
        <Button size="sm" variant="outline" borderColor="$red600">
          <ButtonText color="$red600">Hapus</ButtonText>
        </Button>
      </VStack>
    </HStack>
  );
};

const ItemSeparatorComponent = () => <Divider />;

const JenisUsaha = () => {
  const toast = useToast();
  const {request} = useApp();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isForm, setIsForm] = React.useState<boolean>(false);
  const [data, setData] = React.useState<MetaDataType[] | MetaDataType>([]);
  const navigation = useNavigation<NavigationProps>();
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<MetaDataType>({
    defaultValues: {
      name: '',
    },
  });

  const backActionHandler = React.useCallback(() => {
    if (isForm) {
      setIsForm(false);
    }

    if (!isForm) {
      navigation.setParams({part: undefined});
    }

    return true;
  }, [isForm, navigation]);

  const onSubmit = (form: {name: string}) => {
    request.post('/meta-data/jenis-usaha', form).then(
      () => {
        toast.show({
          render: () => {
            reset();
            return (
              <Toast w={width - 40} bgColor="green">
                <VStack space="xs">
                  <ToastTitle fontWeight="bold" color="white">
                    Jenis usaha telah ditambahkan!
                  </ToastTitle>
                </VStack>
              </Toast>
            );
          },
          placement: 'bottom',
        });
      },
      () => {
        toast.show({
          render: () => {
            reset();
            return (
              <Toast w={width - 40} bgColor="red">
                <VStack space="xs">
                  <ToastTitle fontWeight="bold" color="white">
                    Error!
                  </ToastTitle>
                  <ToastDescription>Gagal menyimpan data</ToastDescription>
                </VStack>
              </Toast>
            );
          },
          placement: 'bottom',
        });
      },
    );
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backActionHandler);
    if (!isForm) {
      setIsLoading(true);
      request
        .get('/meta-data/jenis-usaha')
        .then(response => {
          setIsLoading(false);
          setData(response.data.rows);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backActionHandler);
    };
  }, [request, isForm, backActionHandler]);

  if (isLoading) {
    return <LottieLoader message="Please Wait..." />;
  }

  if (isForm) {
    return (
      <Box borderWidth={0} borderTopWidth={1} p={20} bgColor="white" flex={1}>
        <VStack space="lg">
          <FormControl
            size="lg"
            isInvalid={typeof errors?.name?.message !== 'undefined'}
            isRequired={true}
            shadowRadius={20}>
            <FormControlLabel>
              <FormControlLabelText fontWeight="bold">
                Jenis Usaha
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="name"
              rules={{
                required: 'Silahkan masukkan jenis usaha',
              }}
              control={control}
              render={({field: {onBlur, onChange, value}}) => {
                return (
                  <Input>
                    <InputInput
                      type="text"
                      placeholder="Jenis Usaha"
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
                Kategori jenis usaha
              </FormControlHelperText>
            </FormControlHelper>
            {errors?.name && (
              <FormControlError>
                <FormControlErrorIcon
                  as={() => ErrorIcon('alert-circle-outline', 20)}
                />
                <FormControlErrorText>
                  {errors.name.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Simpan</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      borderWidth={0}
      backgroundColor="white"
      // h={height - height / 4}
      borderTopWidth={1}>
      <FlatList
        data={data as MetaDataType[]}
        renderItem={props => <ItemData item={props.item} />}
        ListEmptyComponent={ListEmptyItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      <Fab
        size="lg"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => setIsForm(true)}>
        <Icon name="add" size={20} color={'white'} />
        <FabLabel ml={4}>Tambah</FabLabel>
      </Fab>
    </Box>
  );
};

const SektorUsaha = () => {
  const toast = useToast();
  const {request} = useApp();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isForm, setIsForm] = React.useState<boolean>(false);
  const [data, setData] = React.useState<MetaDataType[] | MetaDataType>([]);
  const navigation = useNavigation<NavigationProps>();
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<MetaDataType>({
    defaultValues: {
      name: '',
    },
  });

  const backActionHandler = React.useCallback(() => {
    if (isForm) {
      setIsForm(false);
    }

    if (!isForm) {
      navigation.setParams({part: undefined});
    }
    return true;
  }, [isForm, navigation]);

  const onSubmit = (form: {name: string}) => {
    request.post('/meta-data/sektor-usaha', form).then(
      () => {
        toast.show({
          render: () => {
            reset();
            return (
              <Toast w={width - 40} bgColor="green">
                <VStack space="xs">
                  <ToastTitle fontWeight="bold" color="white">
                    Sektor usaha telah ditambahkan!
                  </ToastTitle>
                </VStack>
              </Toast>
            );
          },
          placement: 'bottom',
        });
      },
      () => {
        toast.show({
          render: () => {
            reset();
            return (
              <Toast w={width - 40} bgColor="red">
                <VStack space="xs">
                  <ToastTitle fontWeight="bold" color="white">
                    Error!
                  </ToastTitle>
                  <ToastDescription>Gagal menyimpan data</ToastDescription>
                </VStack>
              </Toast>
            );
          },
          placement: 'bottom',
        });
      },
    );
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backActionHandler);
    if (!isForm) {
      setIsLoading(true);
      request
        .get('/meta-data/sektor-usaha')
        .then(response => {
          setIsLoading(false);
          setData(response.data.rows);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backActionHandler);
    };
  }, [request, isForm, backActionHandler]);

  if (isLoading) {
    return <LottieLoader message="Please Wait..." />;
  }

  if (isForm) {
    return (
      <Box borderWidth={0} borderTopWidth={1} p={20} bgColor="white" flex={1}>
        <VStack space="lg">
          <FormControl
            size="lg"
            isInvalid={typeof errors?.name?.message !== 'undefined'}
            isRequired={true}
            shadowRadius={20}>
            <FormControlLabel>
              <FormControlLabelText fontWeight="bold">
                Sektor Usaha
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="name"
              rules={{
                required: 'Silahkan masukkan sektor usaha',
              }}
              control={control}
              render={({field: {onBlur, onChange, value}}) => {
                return (
                  <Input>
                    <InputInput
                      type="text"
                      placeholder="Sektor Usaha"
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
                Kategori sektor usaha
              </FormControlHelperText>
            </FormControlHelper>
            {errors?.name && (
              <FormControlError>
                <FormControlErrorIcon
                  as={() => ErrorIcon('alert-circle-outline', 20)}
                />
                <FormControlErrorText>
                  {errors.name.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Simpan</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box borderWidth={0} backgroundColor="white" flex={1} borderTopWidth={1}>
      <FlatList
        data={data as MetaDataType[]}
        renderItem={props => <ItemData item={props.item} />}
        ListEmptyComponent={ListEmptyItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      <Fab
        size="lg"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => setIsForm(true)}>
        <Icon name="add" size={20} color={'white'} />
        <FabLabel ml={4}>Tambah</FabLabel>
      </Fab>
    </Box>
  );
};

const SettingsScreeen: React.FC<ScreenProps> = ({route, navigation}) => {
  if (route.params?.part === 'jenis-usaha') {
    return <JenisUsaha />;
  }

  if (route.params?.part === 'sektor-usaha') {
    return <SektorUsaha />;
  }

  return (
    <Box borderWidth={1} flex={1}>
      <HStack space="lg" padding={4}>
        <Menu
          text="Jenis Usaha"
          onPress={() => {
            navigation.setParams({part: 'jenis-usaha'});
          }}
        />
      </HStack>
      <HStack space="lg" padding={4}>
        <Menu
          text="Sektor Usaha"
          onPress={() => {
            navigation.setParams({part: 'sektor-usaha'});
          }}
        />
      </HStack>
      <HStack space="lg" padding={4}>
        <Menu
          text="Informasi"
          onPress={() => {
            navigation.setParams({part: 'sektor-usaha'});
          }}
        />
      </HStack>
      <HStack space="lg" padding={4}>
        <Menu
          text="Banner"
          onPress={() => {
            navigation.setParams({part: 'sektor-usaha'});
          }}
        />
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: materialColors2014.lightBlue[400],
  },
});

export default SettingsScreeen;
