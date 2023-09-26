import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {
  Box,
  Button,
  ButtonText,
  Center,
  HStack,
  Heading,
  Input,
  InputInput,
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
import Ionicons from '@expo/vector-icons/Ionicons';
import {useApp} from '@/contexts/AppContext';
import {AppRole} from '@/interfaces/App';

const ItemList: React.FC<{label: string; val: unknown}> = ({label, val}) => {
  return (
    <HStack borderWidth={0.4} py={2}>
      <VStack w={'$1/2'} borderWidth={0} px={10}>
        <Text>{label}</Text>
      </VStack>
      <VStack w={'$1/2'} justifyContent="center" px={2}>
        <Text>{val}</Text>
      </VStack>
    </HStack>
  );
};

const ActivityDetailScreen: React.FC<
  NativeStackScreenProps<AppStackNavigatorParams, 'ActivityDetail'>
> = ({route, navigation}) => {
  const [note, setNote] = React.useState<string>('');
  const {request} = useApp();
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<'perbaikan' | 'aktif' | null>(
    null,
  );

  React.useEffect(() => {
    if (status === 'perbaikan') {
      setShowModal(true);
    }
  }, [status]);

  if (route.params.viewAs === AppRole.pengusaha) {
    return (
      <Box minHeight={'$full'}>
        <Text>(Pengusaha) Activity Detail</Text>
      </Box>
    );
  }

  return (
    <Box h={'$full'}>
      <VStack borderWidth={1} h={'$full'}>
        <ItemList label="Nama Usaha" val={route.params.usaha?.nama} />
        <ItemList label="Jenis Usaha" val={route.params.usaha?.jenis_usaha} />
        <ItemList label="Sektor Usaha" val={route.params.usaha?.sektor_usaha} />
        <HStack borderWidth={0.4} py={2}>
          <VStack w={'$1/2'} borderWidth={0} px={10}>
            <Text>Produk</Text>
          </VStack>
          <VStack w={'$1/2'} justifyContent="center" px={2}>
            <Text>{route.params.usaha?.produk}</Text>
          </VStack>
        </HStack>
        <HStack borderWidth={0.4} py={2}>
          <VStack w={'$1/2'} borderWidth={0} px={10}>
            <Text>Provinsi</Text>
          </VStack>
          <VStack w={'$1/2'} justifyContent="center" px={2}>
            <Text>{route.params.usaha?.provinsi}</Text>
          </VStack>
        </HStack>
        <HStack borderWidth={0.4} py={2}>
          <VStack w={'$1/2'} borderWidth={0} px={10}>
            <Text>Kabupaten / Kota</Text>
          </VStack>
          <VStack w={'$1/2'} justifyContent="center" px={2}>
            <Text>{route.params.usaha?.kabupaten_atau_kota}</Text>
          </VStack>
        </HStack>
        <HStack borderWidth={0.4} py={2}>
          <VStack w={'$1/2'} borderWidth={0} px={10}>
            <Text>Kecamatan</Text>
          </VStack>
          <VStack w={'$1/2'} justifyContent="center" px={2}>
            <Text>{route.params.usaha?.kecamatan}</Text>
          </VStack>
        </HStack>
        <HStack borderWidth={0.4} py={2}>
          <VStack w={'$1/2'} borderWidth={0} px={10}>
            <Text>Desa atau Kelurahan</Text>
          </VStack>
          <VStack w={'$1/2'} justifyContent="center" px={2}>
            <Text>{route.params.usaha?.desa_atau_kelurahan}</Text>
          </VStack>
        </HStack>
        <HStack borderWidth={0.4} py={2}>
          <VStack w={'$1/2'} borderWidth={0} px={10}>
            <Text>Alamat</Text>
          </VStack>
          <VStack w={'$1/2'} justifyContent="center" px={2}>
            <Text>{route.params.usaha?.alamat}</Text>
          </VStack>
        </HStack>
        <HStack
          w={'$full'}
          borderWidth={0}
          justifyContent="center"
          space="md"
          alignItems="center"
          py={10}>
          <Button
            bg="$red600"
            onPress={() => {
              setStatus('perbaikan');
            }}>
            <ButtonText>Minta Perbaikan</ButtonText>
          </Button>
          <Button
            bg="$green600"
            onPress={() => {
              setStatus('aktif');
              request
                .get(`/daftar-usaha/${route.params.usaha?.id}/set-status/aktif`)
                .then(
                  () => {
                    setStatus(null);
                    navigation.goBack();
                  },
                  () => {
                    setStatus(null);
                  },
                );
            }}>
            <ButtonText>Terima</ButtonText>
          </Button>
        </HStack>
      </VStack>
      <Center h={300}>
        <Button onPress={() => setShowModal(true)}>
          <ButtonText>Show Modal</ButtonText>
        </Button>
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size="lg">Catatan</Heading>
              <ModalCloseButton
                onPress={() => {
                  setShowModal(false);
                  setStatus(null);
                }}>
                <Ionicons size={22} name="close-circle" />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text py={4}>Masukkan catatan</Text>
              <Input>
                <InputInput
                  type="text"
                  placeholder="Catatan"
                  placeholderTextColor="gray"
                  onChangeText={setNote}
                  value={note}
                />
              </Input>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$3"
                onPress={() => {
                  setShowModal(false);
                  setStatus(null);
                }}>
                <ButtonText>Batal</ButtonText>
              </Button>
              <Button
                size="sm"
                action="positive"
                borderWidth="$0"
                onPress={() => {
                  request
                    .get(
                      `/daftar-usaha/${route.params.usaha?.id}/set-status/non-aktif?catatan=${note}`,
                    )
                    .then(
                      () => {
                        setShowModal(false);
                        setStatus(null);
                        setNote('');
                        navigation.goBack();
                      },
                      () => {
                        setShowModal(false);
                        setStatus(null);
                      },
                    );
                }}>
                <ButtonText>Simpan</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Center>
    </Box>
  );
};

export default ActivityDetailScreen;
