import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Box, HStack, Heading, VStack} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {AppRole} from '@/interfaces/App';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import materialColors2014 from '@/config/MaterialColors2014';

type NavigationProps = NativeStackNavigationProp<
  AppStackNavigatorParams,
  'Tab'
>;

const {height} = Dimensions.get('window');

const MenuPendaftaran = () => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity
      style={[
        styles.boxButton,
        {backgroundColor: materialColors2014.blue[200]},
      ]}
      onPress={() => navigation.navigate('Registration')}>
      <Ionicons name="apps" size={46} color={'white'} />
      <Heading fontSize={18}>Pendaftaran</Heading>
    </TouchableOpacity>
  );
};

const MenuAktivitas = () => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity
      style={[
        styles.boxButton,
        {backgroundColor: materialColors2014.blue[200]},
      ]}
      onPress={() => navigation.navigate('Activity')}>
      <Ionicons name="apps" size={46} color={'white'} />
      <Heading fontSize={18}>Aktivitas</Heading>
    </TouchableOpacity>
  );
};

const MenuMonitoring = () => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity
      style={[
        styles.boxButton,
        {backgroundColor: materialColors2014.blue[200]},
      ]}
      onPress={() => navigation.navigate('Monitoring')}>
      <Ionicons name="apps" size={46} color={'white'} />
      <Heading fontSize={18}>Monitoring</Heading>
    </TouchableOpacity>
  );
};

const MenuLaporan = () => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity
      style={[
        styles.boxButton,
        {backgroundColor: materialColors2014.blue[200]},
      ]}
      onPress={() => {
        navigation.navigate('Report');
      }}>
      <Ionicons name="apps" size={46} color={'white'} />
      <Heading fontSize={18}>Laporan</Heading>
    </TouchableOpacity>
  );
};

const MenuPengaturan = () => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity
      style={[
        styles.boxButton,
        {backgroundColor: materialColors2014.blue[200]},
      ]}
      onPress={() => navigation.navigate('Settings')}>
      <Ionicons name="apps" size={46} color={'white'} />
      <Heading fontSize={18}>Pengaturan</Heading>
    </TouchableOpacity>
  );
};

const MenuPengguna = () => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <TouchableOpacity
      style={[
        styles.boxButton,
        {backgroundColor: materialColors2014.blue[200]},
      ]}
      onPress={() => navigation.navigate('Users')}>
      <Ionicons name="apps" size={46} color={'white'} />
      <Heading fontSize={18}>Pengguna</Heading>
    </TouchableOpacity>
  );
};

const BoxMenu: React.FC<{role: AppRole | string | undefined}> = ({role}) => {
  const menu: React.ReactElement[] = [];
  switch (role) {
    case AppRole.admin:
      // * Menu 1
      menu.push(
        <HStack
          borderWidth={0}
          mt={10}
          padding={4}
          justifyContent="space-around">
          <MenuMonitoring />
          <MenuAktivitas />
        </HStack>,
      );
      // * Menu 2
      menu.push(
        <HStack
          borderWidth={0}
          mt={10}
          padding={4}
          justifyContent="space-around">
          <MenuPengaturan />
          <MenuPengguna />
        </HStack>,
      );
      break;
    case AppRole.kepala:
      menu.push(
        <HStack
          borderWidth={0}
          mt={10}
          padding={4}
          justifyContent="space-around">
          <MenuPengguna />
          <MenuLaporan />
        </HStack>,
      );
      menu.push(
        <HStack
          borderWidth={0}
          mt={10}
          padding={4}
          justifyContent="space-around">
          <MenuMonitoring />
        </HStack>,
      );
      break;
    case AppRole.pengusaha:
      menu.push(
        <HStack
          borderWidth={0}
          mt={10}
          padding={4}
          justifyContent="space-around">
          <MenuPendaftaran />
          <MenuAktivitas />
        </HStack>,
      );
      menu.push(
        <HStack
          borderWidth={0}
          mt={10}
          padding={4}
          justifyContent="space-around">
          <MenuMonitoring />
          <MenuLaporan />
        </HStack>,
      );
      break;
  }
  return (
    <Box padding={20}>
      <VStack>
        {menu[0]}
        {menu[1]}
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  boxButton: {
    width: '48%',
    height: height / 6,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
export default BoxMenu;
