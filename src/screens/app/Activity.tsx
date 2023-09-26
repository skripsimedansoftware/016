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
import {AppRole, IAssetOmzet, IDaftarUsaha} from '@/interfaces/App';

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
      {item.asset}
    </Box>
  );
};

const ActivityScreen: React.FC<
  NativeStackScreenProps<AppStackNavigatorParams, 'Activity'>
> = ({}) => {
  const [data, setData] = React.useState<IDaftarUsaha[] | IAssetOmzet[]>([]);
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
    } else if (authInfo?.jabatan === 'pengusaha') {
      request
        .get<{id: number; owner: number}>('/daftar-usaha/mime')
        .then(daftarUsaha => {
          if (daftarUsaha.data.id) {
            request
              .get<IAssetOmzet[]>(
                `/daftar-usaha/${daftarUsaha.data.id}/asset-omzet`,
              )
              .then(assetOmzet => {
                setData(assetOmzet.data as IAssetOmzet[]);
              });
          }
        }, console.log);
    }
  }, [request, authInfo]);

  return (
    <Box flex={1} borderWidth={0} borderTopColor="black" borderTopWidth={1}>
      {authInfo?.jabatan === 'pengusaha' ? (
        <FlatList
          data={data as IAssetOmzet[]}
          renderItem={props => (
            <RenderItemAsPengusaha key={props.index} item={props.item} />
          )}
          ListEmptyComponent={ListEmptyItem}
        />
      ) : (
        <FlatList
          data={data as IDaftarUsaha[]}
          renderItem={props => (
            <RenderItem
              key={props.index}
              item={props.item}
              jabatan={authInfo?.jabatan as AppRole}
            />
          )}
          ListEmptyComponent={ListEmptyItem}
        />
      )}
    </Box>
  );
};

export default ActivityScreen;
