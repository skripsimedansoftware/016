import React from 'react';
import {Box, HStack, Text, VStack} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';

type Props = NativeStackScreenProps<
  AppStackNavigatorParams,
  'MonitoringDetail'
>;

const ItemList: React.FC<{label: string; val: unknown}> = ({label, val}) => {
  return (
    <HStack borderWidth={0.4} py={2}>
      <VStack w={'$1/2'} borderWidth={0} px={10}>
        <Text>{label}</Text>
      </VStack>
      <VStack w={'$1/2'} justifyContent="center" px={2}>
        <Text>{val as string}</Text>
      </VStack>
    </HStack>
  );
};

const MonitoringDetailScreen: React.FC<Props> = ({route}) => {
  return (
    <Box flex={1}>
      <ItemList label="Nama" val={route.params.data.nama} />
      <ItemList label="Produk" val={route.params.data.produk} />
      <ItemList label="Jenis Usaha" val={route.params.data.jenis_usaha} />
      <ItemList label="Sektor Usaha" val={route.params.data.sektor_usaha} />
      <ItemList label="Provinsi" val={route.params.data.provinsi} />
      <ItemList
        label="Kabupaten/Kota"
        val={route.params.data.kabupaten_atau_kota}
      />
      <ItemList label="Kecamatan" val={route.params.data.kecamatan} />
      <ItemList
        label="Desa/Kelurahan"
        val={route.params.data.desa_atau_kelurahan}
      />
      <ItemList label="Alamat" val={route.params.data.alamat} />
      <ItemList label="Status" val={route.params.data.status} />
    </Box>
  );
};

export default MonitoringDetailScreen;
