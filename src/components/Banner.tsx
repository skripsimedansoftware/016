import React from 'react';
import {Dimensions} from 'react-native';
import {Box, HStack, Heading, Image, VStack} from '@gluestack-ui/themed';

const {height, width} = Dimensions.get('window');

const Banner = () => {
  return (
    <Box
      borderWidth={0}
      justifyContent="center"
      alignItems="center"
      // py={'$12'}
      h={height / 7}
      w={width}>
      <HStack
        borderWidth={0}
        height={'100%'}
        justifyContent="center"
        alignItems="center">
        <VStack borderWidth={0}>
          <Image
            alt="Logo"
            source={require('../../assets/logo.png')}
            size="lg"
          />
        </VStack>
        <VStack borderWidth={0}>
          <Heading fontSize={16} lineHeight={24}>
            Pemerintah Kota Medan
            {'\n'}
            Dinas Koperasi, Usaha Kecil dan Menengah,
            {'\n'}
            Perindustrian dan Perdagangan
          </Heading>
        </VStack>
      </HStack>
    </Box>
  );
};

export default Banner;
