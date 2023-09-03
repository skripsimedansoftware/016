import {Box, Text} from '@gluestack-ui/themed';
import React from 'react';
import {Animated, StyleSheet, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');
const rotateXValue = new Animated.Value(0);
const rotateYValue = new Animated.Value(0);

type Props = {message?: string};

const LoadingScreen: React.FC<Props> = ({message}) => {
  const startXRotation = React.useCallback(() => {
    rotateXValue.setValue(0);
    rotateYValue.setValue(0);

    Animated.timing(rotateXValue, {
      toValue: 2,
      duration: 3400,
      useNativeDriver: true,
    }).start(() => {
      startXRotation();
    });
  }, []);

  const startYRotation = React.useCallback(() => {
    rotateYValue.setValue(0);
    Animated.timing(rotateYValue, {
      toValue: 3,
      duration: 3400,
      useNativeDriver: true,
    }).start(() => {
      startYRotation();
    });
  }, []);

  const rotateX = rotateXValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateY = rotateYValue.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['0deg', '180deg', '140deg', '360deg'],
  });

  React.useEffect(() => {
    startXRotation();
    startYRotation();
  }, [startXRotation, startYRotation]);

  const styles = StyleSheet.create({
    animatedImage: {
      alignSelf: 'center',
      transform: [
        {
          rotateX,
        },
        {
          rotateY,
        },
      ],
    },
    message: {textAlign: 'center'},
  });

  return (
    <Box h={height} w={width} mt={height / 4} alignItems="center">
      <Animated.Image
        style={styles.animatedImage}
        source={require('../../../assets/logo.png')}
      />
      <Text style={styles.message}>{message || 'Loading...'}</Text>
    </Box>
  );
};

export default LoadingScreen;
