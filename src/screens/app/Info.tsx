import {View, Text} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TabNavigatorParams} from '@/interfaces/NavigatorParams';

type Props = NativeStackScreenProps<TabNavigatorParams, 'Info'>;

const InfoScreen: React.FC<Props> = () => {
  return (
    <View
      style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      <Text>Info Screen</Text>
    </View>
  );
};

export default InfoScreen;
