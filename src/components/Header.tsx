import React from 'react';
import {Dimensions} from 'react-native';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import Carousel from './Carousel';
import {Box, Center} from '@gluestack-ui/themed';
import Banner from './Banner';

const {height} = Dimensions.get('window');

const Header: React.FC<NativeStackHeaderProps | BottomTabHeaderProps> = ({
  route,
}) => {
  return route.name !== 'Account' ? (
    <Box>
      <Banner />
      {route.name === 'Home' && (
        <Box
          borderWidth={0}
          justifyContent="center"
          alignItems="center"
          h={height / 3}>
          <Center
            borderWidth={0}
            height={'auto'}
            padding={16}
            justifyContent="center"
            alignContent="center"
            alignItems="center">
            <Carousel />
          </Center>
        </Box>
      )}
    </Box>
  ) : (
    <></>
  );
};

export default Header;
