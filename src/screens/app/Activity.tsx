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
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';
import ListEmptyItem from '@/components/ListEmptyItem';
import {AppRole, IDaftarUsaha} from '@/interfaces/App';

type RenderItemProp = {
  item: IDaftarUsaha;
  jabatan: AppRole;
};
const RenderItem: React.FC<RenderItemProp> = ({item, jabatan}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AppStackNavigatorParams, 'Activity'>
    >();
  return (
    <Box borderWidth={1} borderTopWidth={0} borderColor="$red400" p={10}>
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
            jabatan={authInfo?.jabatan as AppRole}
          />
        )}
        ListEmptyComponent={ListEmptyItem}
      />
    </Box>
  );
};

export default ActivityScreen;
