import React from 'react';
import {Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {Box, Heading} from '@gluestack-ui/themed';

type Props = {
  message?: string;
};
const LottieLoader: React.FC<Props> = ({message}) => {
  const animation = React.useRef(null);
  const {height} = Dimensions.get('window');
  React.useEffect(() => {
    animation.current;
  }, []);

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <LottieView
        autoPlay
        ref={animation}
        source={require('../../assets/lotties/animation_lm2y0b6v.json')}
        style={{height: height / (height / 80)}}
      />
      <Heading>{message || 'Loading...'}</Heading>
    </Box>
  );
};

export default LottieLoader;
