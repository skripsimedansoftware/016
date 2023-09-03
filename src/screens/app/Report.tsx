import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import WebView from 'react-native-webview';
import {useApp} from '@/contexts/AppContext';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'Report'>;

const ReportScreen: React.FC<Props> = () => {
  const {request} = useApp();

  return (
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
  );
};

export default ReportScreen;
