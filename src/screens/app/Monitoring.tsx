import React from 'react';
import {
  Box,
  Button,
  ButtonText,
  Divider,
  HStack,
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
import {IDaftarUsaha} from '@/interfaces/App';
import {FlatList} from 'react-native';
import LottieLoader from '@/components/LottieLoader';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'Monitoring'>;

const Item: React.FC<{data: IDaftarUsaha}> = ({data}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AppStackNavigatorParams, 'Monitoring'>
    >();
  return (
    <HStack borderWidth={1} space="md" alignItems="center" padding={10}>
      <VStack>
        <Text>{data.nama}</Text>
      </VStack>
      <VStack>
        <Text>{data.produk}</Text>
      </VStack>
      <VStack>
        <Text>Omzetx</Text>
      </VStack>
      <VStack space="md">
        <HStack space="md" justifyContent="center">
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
        </HStack>
      </VStack>
    </HStack>
  );
};

const ItemSeparatorComponent = () => <Divider />;

const MonitoringScreen: React.FC<Props> = () => {
  const {request} = useApp();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<IDaftarUsaha[]>([]);

  React.useEffect(() => {
    setLoading(true);
    request.get('/daftar-usaha').then(
      response => {
        setLoading(false);
        setData(response.data);
      },
      () => {
        setLoading(false);
      },
    );
  }, [request]);

  if (loading) {
    return <LottieLoader message="Mengambil data" />;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={data}
        renderItem={props => <Item data={props.item} />}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </Box>
  );
};

export default MonitoringScreen;
