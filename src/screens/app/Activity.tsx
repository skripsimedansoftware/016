import React from 'react';
import {FlatList} from 'react-native';
import {
  Box,
  Button,
  ButtonText,
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
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Icon from '@expo/vector-icons/Ionicons';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';
import ListEmptyItem from '@/components/ListEmptyItem';
import {AppRole, IAssetOmzet, IDaftarUsaha} from '@/interfaces/App';
import AppForm from '@/components/Form';
import {useForm} from 'react-hook-form';
import TahunPicker from '@/components/Picker/Tahun';

interface IFormAssetOmzet {
  tahun: string;
  omzet: string;
  asset: string;
}

const RenderItem: React.FC<{
  item: IDaftarUsaha;
  jabatan: AppRole;
}> = ({item, jabatan}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AppStackNavigatorParams, 'Activity'>
    >();
  return (
    <Box borderWidth={0} borderBottomWidth={1} borderColor="$fuchsia600" p={10}>
      {jabatan === 'admin' && (
        <HStack space="sm" flex={1}>
          <Box
            justifyContent="center"
            w={'$1/5'}
            borderWidth={0}
            borderColor="red">
            <Text>{item.nama}</Text>
          </Box>
          <Box
            justifyContent="center"
            w={'$1/5'}
            borderWidth={0}
            borderTopColor="red">
            <Text>{item.jenis_usaha}</Text>
          </Box>
          <Box
            justifyContent="center"
            w={'$1/5'}
            borderWidth={0}
            borderTopColor="red">
            <Text>{item.sektor_usaha}</Text>
          </Box>
          <Box
            justifyContent="center"
            w={'$1/5'}
            borderWidth={0}
            borderTopColor="red">
            <Text>{item.produk}</Text>
          </Box>
          <VStack
            justifyContent="center"
            alignContent="center"
            mt={'auto'}
            mb={'auto'}
            mr={'auto'}
            borderWidth={0}
            space="sm">
            <Button
              size="xs"
              bgColor="$blue600"
              onPress={() =>
                navigation.navigate('ActivityDetail', {
                  viewAs: jabatan,
                  usaha: item,
                })
              }>
              <ButtonText>Detail</ButtonText>
            </Button>
          </VStack>
        </HStack>
      )}
    </Box>
  );
};

const RenderItemAsPengusaha: React.FC<{item: IAssetOmzet}> = ({item}) => {
  // const navigation =
  //   useNavigation<
  //     NativeStackNavigationProp<AppStackNavigatorParams, 'Activity'>
  //   >();
  return (
    <Box borderWidth={0} borderBottomWidth={1} borderColor="$fuchsia600" p={10}>
      <Text>{item.asset}</Text>
    </Box>
  );
};

const ActivityScreen: React.FC<
  NativeStackScreenProps<AppStackNavigatorParams, 'Activity'>
> = ({}) => {
  const [dataDaftarUsaha, setDataDaftarUsaha] = React.useState<IDaftarUsaha[]>(
    [],
  );
  const [dataAssetOmzet, setDataAssetOmzet] = React.useState<IAssetOmzet[]>([]);

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [usahaID, setUsahaID] = React.useState<number | null>(null);
  const {request, authInfo} = useApp();
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

  const loadData = React.useCallback(() => {
    if (authInfo?.jabatan === 'admin') {
      request
        .get<{count: number; rows: IDaftarUsaha[]}>(
          '/daftar-usaha/status/pengajuan',
        )
        .then(response => {
          if (response.data.rows) {
            setDataDaftarUsaha(response.data.rows);
          }
        }, console.log);
    } else if (authInfo?.jabatan === 'pengusaha') {
      request
        .get<{id: number; owner: number}>('/daftar-usaha/mine')
        .then(daftarUsaha => {
          setUsahaID(daftarUsaha.id);
          if (daftarUsaha.data.id) {
            request
              .get<IAssetOmzet[]>(
                `/daftar-usaha/${daftarUsaha.data.id}/asset-omzet`,
              )
              .then(assetOmzet => {
                setDataAssetOmzet(assetOmzet.data);
              });
          }
        }, console.log);
    }
  }, [request, authInfo]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = (form: IFormAssetOmzet) => {
    request
      .post<IAssetOmzet>(`/daftar-usaha/${usahaID}/asset-omzet`, form)
      .then(() => {
        setShowModal(false);
      }, console.log);
  };

  return (
    <Box flex={1} borderWidth={0} borderTopColor="black" borderTopWidth={1}>
      {authInfo?.jabatan === 'pengusaha' ? (
        <Box flex={1}>
          <FlatList
            data={dataAssetOmzet}
            renderItem={props => (
              <RenderItemAsPengusaha key={props.index} item={props.item} />
            )}
            ListEmptyComponent={<ListEmptyItem message="Tidak ada aktivitas" />}
          />
          {usahaID !== null && (
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
                <ModalCloseButton>
                  <Text>X</Text>
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
          data={dataDaftarUsaha}
          renderItem={props => (
            <RenderItem
              key={props.index}
              item={props.item}
              jabatan={authInfo?.jabatan as AppRole}
            />
          )}
          ListEmptyComponent={<ListEmptyItem message="Tidak ada aktivitas" />}
        />
      )}
    </Box>
  );
};

export default ActivityScreen;
