import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TabNavigatorParams} from '@/interfaces/NavigatorParams';
import {Box} from '@gluestack-ui/themed';
import {useApp} from '@/contexts/AppContext';
import WebView from 'react-native-webview';

type Props = NativeStackScreenProps<TabNavigatorParams, 'Info'>;

const InfoScreen: React.FC<Props> = () => {
  const [info, setInfo] = React.useState<string>('');
  const {request} = useApp();

  const loadInfo = React.useCallback(() => {
    request
      .get('/meta-data/info', {
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

  React.useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>My HTML Page</title>
      <style>
      * {
        font-size: 36px;
      }
      </style>
    </head>
    <body>
      ${info}
    </body>
    </html>
  `;

  return (
    <Box borderTopWidth={1} p={10} flex={1}>
      <WebView source={{html: htmlContent}} />
    </Box>
  );
};

export default InfoScreen;
