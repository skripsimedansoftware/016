import React from 'react';
import {FlatList} from 'react-native';
import {Box, HStack, Text, VStack} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';
import {IAssetOmzet} from '@/interfaces/App';
import LottieLoader from '@/components/LottieLoader';

type Props = NativeStackScreenProps<
  AppStackNavigatorParams,
  'MonitoringDetail'
>;

const ItemList: React.FC<{tahun: string; asset: string; omzet: string}> = ({
  tahun,
  asset,
  omzet,
}) => {
  return (
    <HStack borderWidth={0.4} py={2}>
      <VStack w={'$1/3'} justifyContent="center" px={2} py={10}>
        <Text>{tahun}</Text>
      </VStack>
      <VStack w={'$1/3'} justifyContent="center" px={2} py={10}>
        <Text>{asset}</Text>
      </VStack>
      <VStack w={'$1/3'} justifyContent="center" px={2} py={10}>
        <Text>{omzet}</Text>
      </VStack>
    </HStack>
  );
};

const MonitoringDetailScreen: React.FC<Props> = ({route}) => {
  const {request} = useApp();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dataAssetOmzet, setDataAssetOmzet] = React.useState<IAssetOmzet[]>([]);

  const loadData = React.useCallback(() => {
    request
      .get<IAssetOmzet[]>(`/daftar-usaha/${route.params.data.id}/asset-omzet`)
      .then(
        response => {
          setIsLoading(false);
          setDataAssetOmzet(response.data);
        },
        () => {
          setIsLoading(false);
        },
      );
  }, [request, route.params.data.id]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <LottieLoader message="Mengambil data" />;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={dataAssetOmzet}
        renderItem={({item}) => {
          return (
            <Box>
              <ItemList
                key={item.id}
                tahun={item.tahun}
                asset={item.asset}
                omzet={item.omzet}
              />
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default MonitoringDetailScreen;
