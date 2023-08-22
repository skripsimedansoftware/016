import {View, Text} from 'react-native';
import React from 'react';
import {useApp} from '@/contexts/AppContext';
import {Button, ButtonText} from '@gluestack-ui/themed';

const AccountScreen = () => {
  const {signOut} = useApp();
  return (
    <View
      style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      <Text>Account Screen</Text>
      <Button onPress={signOut}>
        <ButtonText>Sign Out</ButtonText>
      </Button>
    </View>
  );
};

export default AccountScreen;
