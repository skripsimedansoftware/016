import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {Box, Text} from '@gluestack-ui/themed';
import {AppRole} from '@/interfaces/App';

const ActivityDetail: React.FC<
  NativeStackScreenProps<AppStackNavigatorParams, 'ActivityDetail'>
> = ({route}) => {
  if (route.params.viewAs === AppRole.pengusaha) {
    <Box>
      <Text>(Pengusaha) Activity Detail</Text>
    </Box>;
  }

  return (
    <Box>
      <Text>(Admin | Kepdin) Activity Detail</Text>
      <Text>{route.params.usaha?.nama}</Text>
    </Box>
  );
};

export default ActivityDetail;
