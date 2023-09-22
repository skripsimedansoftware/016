import React from 'react';
import {WebView} from 'react-native-webview';
import {useApp} from '@/contexts/AppContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'OpenStreetMap'>;

const OpenStreetMap: React.FC<Props> = ({route}) => {
  const {request} = useApp();
  return (
    <WebView
      source={{
        uri: `${request.getUri()}/open-street-map-${route.params.version}${
          route.params.query
            ? `?lat=${route.params.query.lat}&lon=${route.params.query.lon}`
            : undefined
        }`,
      }}
    />
  );
};

export default OpenStreetMap;
