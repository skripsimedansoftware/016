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
import {AppRole} from '@/interfaces/App';
import {useApp} from '@/contexts/AppContext';

const ActivityDetailScreen: React.FC<
  NativeStackScreenProps<AppStackNavigatorParams, 'ActivityDetail'>
> = ({route}) => {
  const [note, setNote] = React.useState<string>('');
  const {request} = useApp();
  const [status, setStatus] = React.useState<'perbaikan' | 'aktif' | null>(
    null,
  );
  const [showModal, setShowModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (status === 'perbaikan') {
      setShowModal(true);
    }
  }, [status]);

  if (route.params.viewAs === AppRole.pengusaha) {
    return (
      <Box>
        <Text>(Pengusaha) Activity Detail</Text>
      </Box>
    );
  }

  return (
    <Box h={'$full'}>
      <VStack borderWidth={1} h={'$full'}>
        <HStack borderWidth={0.4} py={2}>
          <VStack w={'$1/2'} borderWidth={0} px={10}>
            <Text>Nama Usaha</Text>
          </VStack>
          <VStack w={'$1/2'} justifyContent="center" px={2}>
            <Text>{route.params.usaha?.nama}</Text>
          </VStack>
        </HStack>
        <HStack borderWidth={0.4} py={2}>
          <VStack w={'$1/2'} borderWidth={0} px={10}>
            <Text>Jenis Usaha</Text>
          </VStack>
          <VStack w={'$1/2'} justifyContent="center" px={2}>
            <Text>{route.params.usaha?.jenis_usaha}</Text>
          </VStack>
        </HStack>
        <HStack borderWidth={0.4} py={2}>
          <VStack w={'$1/2'} borderWidth={0} px={10}>
            <Text>Sektor Usaha</Text>
          </VStack>
          <VStack w={'$1/2'} justifyContent="center" px={2}>
            <Text>{route.params.usaha?.sektor_usaha}</Text>
          </VStack>
        </HStack>
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
              <ModalCloseButton>
                <Text>CLOSE</Text>
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text px={4}>Masukkan catatan</Text>
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
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                action="positive"
                borderWidth="$0"
                onPress={() => {
                  request
                    .get(
                      `/daftar-usaha/${route.params.id}/set-status/non-aktif`,
                    )
                    .then(
                      () => {
                        setShowModal(false);
                        setStatus(null);
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
