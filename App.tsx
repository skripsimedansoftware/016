import React from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AppProvider from '@/contexts/AppContext';
import AppNavigator from '@/navigators/AppNavigator';
import {GluestackUIProvider, config} from '@gluestack-ui/themed';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <GluestackUIProvider config={config.theme}>
            <AppProvider>
              <AppNavigator />
            </AppProvider>
          </GluestackUIProvider>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
