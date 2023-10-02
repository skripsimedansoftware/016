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
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';
import ListEmptyItem from '@/components/ListEmptyItem';
import {AppRole, IDaftarUsaha, UsahaStatus} from '@/interfaces/App';
import LottieLoader from '@/components/LottieLoader';

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
        <HStack space="sm" flex={1} px={10}>
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

const LabelValue: React.FC<{
  label: string;
  value: undefined | null | string | number;
}> = ({label, value}) => {
  return (
    <HStack
      borderWidth={0}
      borderBottomWidth={1}
      borderBottomColor="gray"
      p={10}>
      <Box w={'$1/2'}>
        <Text>{label}</Text>
      </Box>
      <Box w={'$1/2'}>
        <Text>{value}</Text>
      </Box>
    </HStack>
  );
};

const UsahaInfoComponent: React.FC<{id: number}> = ({id}) => {
  const [usahaDetail, setUsahaDetail] = React.useState<IDaftarUsaha | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {request} = useApp();
  const loadUsahaDetail = React.useCallback(() => {
    setIsLoading(true);
    request.get<IDaftarUsaha>(`/daftar-usaha/${id}`).then(
      response => {
        setIsLoading(false);
        setUsahaDetail(response.data);
      },
      () => {
        setIsLoading(false);
      },
    );
  }, [request, id]);

  React.useEffect(() => {
    loadUsahaDetail();
  }, [loadUsahaDetail]);

  if (isLoading) {
    return <LottieLoader message="Mengunduh Informasi" />;
  }

  return (
    <Box flex={1} borderTopWidth={1}>
      <VStack>
        <LabelValue label="Nama" value={usahaDetail?.nama} />
        <LabelValue label="Produk" value={usahaDetail?.produk} />
        <LabelValue label="Jenis Usaha" value={usahaDetail?.jenis_usaha} />
        <LabelValue label="Sektor Usaha" value={usahaDetail?.sektor_usaha} />
        <LabelValue label="Detail Usaha" value={usahaDetail?.detail_usaha} />
        <LabelValue label="Provinsi" value={usahaDetail?.provinsi} />
        <LabelValue
          label="Kabupaten / kota"
          value={usahaDetail?.detail_usaha}
        />
        <LabelValue label="Kecamatan" value={usahaDetail?.kecamatan} />
        <LabelValue
          label="Desa / Kelurahan"
          value={usahaDetail?.desa_atau_kelurahan}
        />
        <LabelValue label="Alamat" value={usahaDetail?.alamat} />
        <LabelValue label="Status" value={usahaDetail?.status} />
      </VStack>
    </Box>
  );
};

const ActivityScreen: React.FC<
  NativeStackScreenProps<AppStackNavigatorParams, 'Activity'>
> = ({navigation}) => {
  const [dataDaftarUsaha, setDataDaftarUsaha] = React.useState<IDaftarUsaha[]>(
    [],
  );
  const [usahaInfo, setUsahaInfo] = React.useState<{
    id: number;
    owner: number;
    status: UsahaStatus;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {request, authInfo} = useApp();

  const loadData = React.useCallback(() => {
    setIsLoading(true);
    if (authInfo?.jabatan === 'pengusaha') {
      request
        .get<{id: number; owner: number; status: UsahaStatus}>(
          '/daftar-usaha/mine',
        )
        .then(
          response => {
            setUsahaInfo(response.data);
            setIsLoading(false);
          },
          () => {
            setIsLoading(false);
          },
        );
    } else {
      request
        .get<{count: number; rows: IDaftarUsaha[]}>(
          '/daftar-usaha/status/pengajuan',
        )
        .then(
          response => {
            setIsLoading(false);
            if (response.data.rows) {
              setDataDaftarUsaha(response.data.rows);
            }
          },
          () => {
            setIsLoading(false);
          },
        );
    }
  }, [request, authInfo]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <LottieLoader message="Mengambil data" />;
  }

  return (
    <Box flex={1} borderWidth={0} borderTopColor="black" borderTopWidth={1}>
      {authInfo?.jabatan === 'pengusaha' ? (
        <Box flex={1}>
          {usahaInfo !== null ? (
            <UsahaInfoComponent id={usahaInfo.id} />
          ) : (
            <Box justifyContent="center" alignItems="center" flex={1}>
              <Text bold>Belum Mendaftar</Text>
              <Text>Anda belum mendaftarkan usaha milik Anda</Text>
              <Button
                onPress={() => {
                  navigation.navigate('Registration');
                }}
                my="$1">
                <ButtonText>Daftarkan Sekarang</ButtonText>
              </Button>
            </Box>
          )}
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
