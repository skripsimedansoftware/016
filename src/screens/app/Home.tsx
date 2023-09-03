import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Box} from '@gluestack-ui/themed';
import {TabNavigatorParams} from '@/interfaces/NavigatorParams';
import BoxMenu from '@/components/BoxMenu';
import {useApp} from '@/contexts/AppContext';

type Props = NativeStackScreenProps<TabNavigatorParams, 'Home'>;

const HomeScreen: React.FC<Props> = () => {
  const {authInfo} = useApp();
  return (
    <Box borderWidth={0}>
      <BoxMenu role={authInfo?.jabatan} />
    </Box>
  );
};

export default HomeScreen;
