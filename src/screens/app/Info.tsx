import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TabNavigatorParams} from '@/interfaces/NavigatorParams';
import {Box, Text} from '@gluestack-ui/themed';
import {useApp} from '@/contexts/AppContext';

type Props = NativeStackScreenProps<TabNavigatorParams, 'Info'>;

const InfoScreen: React.FC<Props> = () => {
  const [info, setInfo] = React.useState<string>('');
  const {request} = useApp();

  React.useEffect(() => {
    request
      .head('/meta-data/info', {
        headers: {
          'Content-Type': 'text/html',
        },
      })
      .then(
        response => {
          setInfo(response.data);
        },
        error => {
          if (!error.response) {
            // no response
          }
        },
      );
  }, [request]);

  return (
    <Box>
      <Text>{info}</Text>
    </Box>
  );
};

export default InfoScreen;
