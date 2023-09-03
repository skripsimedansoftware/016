import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AppProvider from '@/contexts/AppContext';
import AppNavigator from '@/navigators/AppNavigator';
import {GluestackUIProvider, config} from '@gluestack-ui/themed';
import {StatusBar} from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <SafeAreaView style={styles.safeAreaView}>
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

const styles = StyleSheet.create({
  safeAreaView: {flex: 1},
});
