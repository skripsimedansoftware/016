import React from 'react';
import {FlatList} from 'react-native';
import {
  Box,
  Button,
  ButtonText,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {useApp} from '@/contexts/AppContext';
import ListEmptyItem from '@/components/ListEmptyItem';
import {IDaftarUsaha} from '@/interfaces/App';

type RenderItemProp = {
  item: IDaftarUsaha;
  jabatan: string;
  statusChange: (status: string) => void;
};
const RenderItem: React.FC<RenderItemProp> = ({
  item,
  jabatan,
  statusChange,
}) => {
  const {request} = useApp();
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <Box borderWidth={1} borderColor="$red400" p={10}>
      {jabatan === 'admin' && (
        <HStack space="sm">
          <Box justifyContent="center" w={'$1/3'}>
            <Text>{item.jenis_usaha}</Text>
          </Box>
          <Box justifyContent="center" w={'$1/3'}>
            <Text overflow="scroll">{item.jenis_usaha}</Text>
          </Box>
          <VStack
            justifyContent="center"
            alignContent="center"
            mt={'auto'}
            mb={'auto'}
            mr={'auto'}
            w={'$1/4'}
            // borderWidth={1}
            space="sm">
            <Button
              size="xs"
              bgColor="$red600"
              isDisabled={loading}
              onPress={() => {
                setLoading(true);
                request
                  .get(`/daftar-usaha/${item.id}/set-status/perbaikan`)
                  .then(
                    () => {
                      setLoading(false);
                      statusChange('perbaikan');
                    },
                    () => {
                      setLoading(false);
                      statusChange('perbaikan');
                    },
                  );
              }}>
              <ButtonText>Reject</ButtonText>
            </Button>
            <Button
              size="xs"
              bgColor="$green600"
              isDisabled={loading}
              onPress={() => {
                setLoading(true);
                request.get(`/daftar-usaha/${item.id}/set-status/aktif`).then(
                  () => {
                    setLoading(false);
                    statusChange('aktif');
                  },
                  () => {
                    setLoading(false);
                    statusChange('aktif');
                  },
                );
              }}>
              <ButtonText>Accept</ButtonText>
            </Button>
          </VStack>
        </HStack>
      )}
    </Box>
  );
};

const ActivityScreen = () => {
  const [data, setData] = React.useState<IDaftarUsaha[]>([]);
  const {request, authInfo} = useApp();

  React.useEffect(() => {
    if (authInfo?.jabatan === 'admin') {
      request
        .get<{count: number; rows: IDaftarUsaha[]}>(
          '/daftar-usaha/status/pengajuan',
        )
        .then(response => {
          if (response.data.rows) {
            setData(response.data.rows);
          }
        }, console.log);
    }
  }, [request, authInfo]);

  return (
    <Box flex={1} borderWidth={0} borderTopColor="black" borderTopWidth={1}>
      <FlatList
        data={data}
        renderItem={props => (
          <RenderItem
            key={props.index}
            item={props.item}
            jabatan={authInfo?.jabatan as string}
            statusChange={status => 
              if (status === 'perbaikan') {
                // masukkan pesan info perbaikan
              }

              delete data[props.index];
            }}
          />
        )}
        ListEmptyComponent={ListEmptyItem}
      />
    </Box>
  );
};

export default ActivityScreen;
