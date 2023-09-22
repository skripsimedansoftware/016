import React from 'react';
import {Box, Text} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';

type Props = NativeStackScreenProps<
  AppStackNavigatorParams,
  'MonitoringDetail'
>;

const MonitoringDetailScreen: React.FC<Props> = ({route}) => {
  return (
    <Box flex={1}>
      <Text>{route.params.data.alamat}</Text>
    </Box>
  );
};

export default MonitoringDetailScreen;
