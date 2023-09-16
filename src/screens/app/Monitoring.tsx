import React from 'react';
import {
  Box,
  Button,
  ButtonText,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'Monitoring'>;

const MonitoringScreen: React.FC<Props> = ({navigation}) => {
  return (
    <Box flex={1}>
      <HStack
        borderWidth={1}
        justifyContent="space-between"
        alignItems="center"
        padding={10}>
        <VStack>
          <Text>Nama Usaha</Text>
        </VStack>
        <VStack>
          <Text>Asset</Text>
        </VStack>
        <VStack>
          <Text>Omzet</Text>
        </VStack>
        <VStack space="md">
          <HStack>
            <Button
              size="xs"
              onPress={() =>
                navigation.navigate('OpenStreetMap', {version: 1})
              }>
              <ButtonText>Lihat Peta</ButtonText>
            </Button>
          </HStack>
          <HStack>
            <Button
              size="xs"
              onPress={() =>
                navigation.navigate('OpenStreetMap', {version: 1})
              }>
              <ButtonText>Lihat Peta</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

export default MonitoringScreen;
