import React from 'react';
import {BackHandler} from 'react-native';
import {Image} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'ImagePreview'>;

const ImagePreview: React.FC<Props> = ({route, navigation}) => {
  const backActionHandler = React.useCallback(() => {
    navigation.getParent()?.navigate('Account');
    return true;
  }, [navigation]);

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backActionHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backActionHandler);
    };
  }, [backActionHandler]);

  return <Image source={route.params.image} flex={1} />;
};

export default ImagePreview;
