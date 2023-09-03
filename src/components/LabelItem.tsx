import React from 'react';
import {HStack, Text} from '@gluestack-ui/themed';

type Props = {
  label: string;
  value: string | number | undefined;
};

const LabelItem: React.FC<Props> = ({label, value}) => {
  return (
    <HStack borderWidth={0} p={10} borderBottomWidth={1}>
      <HStack width={'40%'}>
        <Text borderWidth={0} fontSize={16} fontWeight="bold">
          {label}
        </Text>
      </HStack>
      <HStack width={'60%'}>
        <Text borderWidth={0} fontSize={16}>
          {value}
        </Text>
      </HStack>
    </HStack>
  );
};

export default LabelItem;
