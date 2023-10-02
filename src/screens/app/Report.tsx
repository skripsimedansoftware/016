import React from 'react';
import {Box, Center, Heading, Text} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import WebView from 'react-native-webview';
import {useApp} from '@/contexts/AppContext';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {AppRole} from '@/interfaces/App';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'Report'>;

const ReportScreen: React.FC<Props> = () => {
  const {request, authInfo} = useApp();
  const [usahaID, setUsahaID] = React.useState<number | null>(null);

  const loadUsaha = React.useCallback(() => {
    request
      .get<{id: number; owner: number}>('/daftar-usaha/mine')
      .then(response => {
        if (response.data) {
          setUsahaID(response.data.id);
        }
      }, console.log);
  }, [request]);

  React.useEffect(() => {
    loadUsaha();
  }, [loadUsaha]);

  if (authInfo?.jabatan === AppRole.pengusaha) {
    return (
      <Box flex={1} borderTopWidth={1}>
        {usahaID !== null ? (
          <WebView
            source={{uri: `${request.getUri()}/chart/${usahaID}`}}
            useWebView2={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        ) : (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text>Data usaha belum diregistrasikan</Text>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box flex={1} borderTopWidth={1}>
      <Center>
        <Heading>Cetak</Heading>
      </Center>
      <WebView
        source={{
          uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${request.getUri()}/pengguna/print`,
        }}
        // source={{
        //   uri: 'https://drive.google.com/viewerng/viewer?embedded=true&url=https://4bf2-116-206-31-65.ngrok-free.app/pengguna/print',
        // }}
        useWebView2={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
    </Box>
  );
};

export default ReportScreen;
