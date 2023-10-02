import React from 'react';
import {
  Box,
  Button,
  ButtonText,
  Center,
  Divider,
  Fab,
  FabLabel,
  HStack,
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';
import {useNavigation} from '@react-navigation/native';
import {AppRole, IAssetOmzet, IDaftarUsaha} from '@/interfaces/App';
import {FlatList} from 'react-native';
import LottieLoader from '@/components/LottieLoader';
import ListEmptyItem from '@/components/ListEmptyItem';
import Icon from '@expo/vector-icons/Ionicons';
import {useForm} from 'react-hook-form';
import AppForm from '@/components/Form';
import TahunPicker from '@/components/Picker/Tahun';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'Monitoring'>;

interface IFormAssetOmzet {
  tahun: string;
  omzet: string;
  asset: string;
}

const Item: React.FC<{data: IDaftarUsaha}> = ({data}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AppStackNavigatorParams, 'Monitoring'>
    >();
  return (
    <HStack borderWidth={1} alignItems="center" p={8}>
      <VStack w={'$1/3'} p={2}>
        <Text>{data.pengusaha?.nama_lengkap}</Text>
      </VStack>
      <VStack w={'$1/3'} p={2}>
        <Text>{data.nama}</Text>
      </VStack>
      <VStack w={'$1/3'} p={2} space="md" justifyContent="center">
        <Button
          size="xs"
          onPress={() => {
            navigation.navigate('OpenStreetMap', {
              version: 2,
              query: {lat: data.latitude, lon: data.longitude},
            });
          }}>
          <ButtonText>Lokasi</ButtonText>
        </Button>
        <Button
          size="xs"
          onPress={() => {
            navigation.navigate('MonitoringDetail', {data});
          }}>
          <ButtonText>Detail</ButtonText>
        </Button>
      </VStack>
    </HStack>
  );
};

const RenderItemAsPengusaha: React.FC<{
  item: Partial<IAssetOmzet>;
  bold?: boolean;
}> = ({item, bold}) => {
  // const navigation =
  //   useNavigation<
  //     NativeStackNavigationProp<AppStackNavigatorParams, 'Activity'>
  //   >();
  return (
    <Box borderWidth={0} borderBottomWidth={1} borderColor="$fuchsia600" p={10}>
      <HStack space="md" p={'$1'}>
        <Box maxWidth={'$1/3'} minWidth={'$1/3'} justifyContent="center">
          <Text bold={bold}>{item.asset}</Text>
        </Box>
        <Box maxWidth={'$1/3'} minWidth={'$1/3'} justifyContent="center">
          <Text bold={bold}>{item.omzet}</Text>
        </Box>
        <Box maxWidth={'$1/3'} minWidth={'$1/3'} justifyContent="center">
          <Text bold={bold}>{item.tahun}</Text>
        </Box>
      </HStack>
    </Box>
  );
};

const ItemSeparatorComponent = () => <Divider />;

const MonitoringScreen: React.FC<Props> = () => {
  const {request, authInfo} = useApp();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [daftarUsaha, setDaftarUsaha] = React.useState<IDaftarUsaha[]>([]);
  const [dataAssetOmzet, setDataAssetOmzet] = React.useState<IAssetOmzet[]>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [usahaID, setUsahaID] = React.useState<number | null>(null);
  const {
    control,
    handleSubmit,
    // watch,
    formState: {errors},
  } = useForm<IFormAssetOmzet>({
    defaultValues: {
      tahun: '',
      asset: '',
      omzet: '',
    },
  });

  const getData = React.useCallback(async () => {
    setLoading(true);
    if (authInfo?.jabatan === AppRole.pengusaha) {
      request.get<{id: number; owner: number}>('/daftar-usaha/mine').then(
        response => {
          if (response.data.id) {
            setUsahaID(response.data.id);
            request
              .get<IAssetOmzet[]>(
                `/daftar-usaha/${response.data.id}/asset-omzet`,
              )
              .then(
                assetOmzet => {
                  setLoading(false);
                  setDataAssetOmzet(assetOmzet.data);
                },
                () => {
                  setLoading(false);
                },
              );
          }
        },
        () => {
          setLoading(false);
        },
      );
    } else {
      request.get('/daftar-usaha').then(
        response => {
          setLoading(false);
          setDaftarUsaha(response.data.rows);
        },
        () => {
          setLoading(false);
        },
      );
    }
  }, [authInfo?.jabatan, request]);

  React.useEffect(() => {
    getData();
  }, [getData]);

  if (loading) {
    return <LottieLoader message="Mengambil data" />;
  }

  const onSubmit = (form: IFormAssetOmzet) => {
    request
      .post<IAssetOmzet>(`/daftar-usaha/${usahaID}/asset-omzet`, form)
      .then(response => {
        setShowModal(false);
        dataAssetOmzet.push(response.data);
      }, console.log);
  };

  return (
    <Box flex={1}>
      {authInfo?.jabatan === AppRole.pengusaha ? (
        <Box flex={1} borderTopWidth={1}>
          {usahaID !== null ? (
            <>
              <RenderItemAsPengusaha
                item={{asset: 'Asset', omzet: 'Omzet', tahun: 'Tahun'}}
                bold
              />
              <FlatList
                data={dataAssetOmzet}
                renderItem={props => (
                  <RenderItemAsPengusaha key={props.index} item={props.item} />
                )}
                ListEmptyComponent={
                  <ListEmptyItem message="Tidak ada aktivitas" />
                }
              />
              <Fab
                size="lg"
                placement="bottom right"
                isHovered={false}
                isDisabled={false}
                isPressed={false}
                onPress={() => {
                  setShowModal(true);
                }}>
                <Icon name="add" size={20} color={'white'} />
                <FabLabel ml={4}>Asset & Omzet</FabLabel>
              </Fab>
            </>
          ) : (
            <Center flex={1} justifyContent="center" alignItems="center">
              <Text>Belum Mendaftarkan Usaha</Text>
            </Center>
          )}
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
            }}
            // finalFocusRef={ref}
          >
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <Heading size="lg">Aset & Omzet</Heading>
                <ModalCloseButton onPress={() => setShowModal(false)}>
                  <Icon name="close" size={32} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <Text my={'$0.5'}>
                  Silahkan masukkan nilai aset dan omzet Anda untuk memantau
                  statistik data tahunan
                </Text>
                <AppForm<IFormAssetOmzet>
                  control={control}
                  name="asset"
                  label="Aset"
                  placeholder="Asset"
                  helperText="Jelaskan asset anda"
                  rules={{required: 'Silahkan masukkan aset Anda'}}
                  invalid={typeof errors.asset?.message !== 'undefined'}
                  required
                  error={errors.asset}
                />
                <AppForm<IFormAssetOmzet>
                  control={control}
                  name="omzet"
                  label="Omzet"
                  placeholder="Omzet"
                  helperText="Masukkan omzet usaha Anda"
                  rules={{required: 'Silahkan masukkan omzet usaha Anda'}}
                  invalid={typeof errors.omzet?.message !== 'undefined'}
                  required
                  error={errors.omzet}
                />
                <TahunPicker<IFormAssetOmzet>
                  control={control}
                  label="Tahun"
                  name="tahun"
                  rules={{
                    required: 'Silahkan pilih tahun',
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="outline"
                  size="sm"
                  action="secondary"
                  mr="$3"
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  <ButtonText>Batal</ButtonText>
                </Button>
                <Button
                  size="sm"
                  action="positive"
                  borderWidth="$0"
                  onPress={handleSubmit(onSubmit)}>
                  <ButtonText>Simpan</ButtonText>
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      ) : (
        <FlatList
          data={daftarUsaha}
          renderItem={props => <Item data={props.item} />}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={<ListEmptyItem message="Data masih kosong" />}
        />
      )}
    </Box>
  );
};

export default MonitoringScreen;
