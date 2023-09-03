import React from 'react';
import {TouchableOpacity, FlatList, StyleSheet, Dimensions} from 'react-native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Divider,
  Fab,
  FabLabel,
  HStack,
  Heading,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import Icon from '@expo/vector-icons/Ionicons';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {useApp} from '@/contexts/AppContext';
import {UserObject} from '@/interfaces/App';
import LottieLoader from '@/components/LottieLoader';

type ScreenProps = NativeStackScreenProps<AppStackNavigatorParams, 'Users'>;

type NavigationProps = NativeStackNavigationProp<
  AppStackNavigatorParams,
  'Users'
>;

type ItemProps = {
  user: UserObject;
  navigation: NavigationProps;
};

const {height} = Dimensions.get('window');

const Item: React.FC<ItemProps> = ({user, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('UserProfile', {id: user.id})}>
      <Box borderWidth={0} padding={6}>
        <VStack space="2xl">
          <HStack space="md">
            <Avatar bgColor="$indigo600">
              <AvatarFallbackText>{user.nama_lengkap}</AvatarFallbackText>
              {user.foto_profil !== null && (
                <AvatarImage
                  source={{
                    uri: user.foto_profil,
                  }}
                />
              )}
            </Avatar>
            <VStack>
              <Heading size="sm">{user.nama_lengkap}</Heading>
              <Text size="sm">{user.jabatan}</Text>
            </VStack>
          </HStack>
        </VStack>
      </Box>
    </TouchableOpacity>
  );
};

const ItemSeparatorComponent = () => <Divider />;

const UsersScreen: React.FC<ScreenProps> = () => {
  const {request} = useApp();
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const navigation = useNavigation<NavigationProps>();

  React.useEffect(() => {
    setIsLoading(true);
    request.get('/pengguna').then(
      response => {
        setIsLoading(false);
        setData(response.data.data);
      },
      error => {
        if (typeof error.response === 'undefined') {
          // toast
        }

        setIsLoading(false);
      },
    );
  }, [request]);

  if (isLoading) {
    return <LottieLoader />;
  }

  return (
    <Box borderTopWidth={1}>
      <FlatList
        data={data}
        renderItem={props => <Item user={props.item} navigation={navigation} />}
        ItemSeparatorComponent={ItemSeparatorComponent}
        style={styles.flatList}
      />
      <Fab
        size="lg"
        placement="bottom right"
        onPress={() => navigation.navigate('Report')}>
        <Icon name="print" size={20} color={'white'} />
        <FabLabel ml={4}>Cetak</FabLabel>
      </Fab>
    </Box>
  );
};

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: 'white',
    height: height - height / 6.8,
    borderWidth: 0,
  },
});

export default UsersScreen;
