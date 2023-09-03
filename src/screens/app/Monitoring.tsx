import React from 'react';
import {Box, Button, ButtonText} from '@gluestack-ui/themed';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'Monitoring'>;

const MonitoringScreen: React.FC<Props> = ({navigation}) => {
  return (
    <Box flex={1}>
      <Button
        onPress={() => navigation.navigate('OpenStreetMap', {version: 1})}>
        <ButtonText>Lihat Peta</ButtonText>
      </Button>
    </Box>
  );
};

export default MonitoringScreen;
