import React from 'react';
import {Dimensions} from 'react-native';
import {Box, Text} from '@gluestack-ui/themed';

type Props = {
  message?: string;
};

const {height} = Dimensions.get('window');

const ListEmptyItem: React.FC<Props> = ({message}) => {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      borderWidth={0}
      h={height - height / 4}>
      <Text>{message || 'No Data'}</Text>
    </Box>
  );
};

export default ListEmptyItem;
