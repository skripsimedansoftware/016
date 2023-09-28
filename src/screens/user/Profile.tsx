import React from 'react';
import {useWindowDimensions, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackNavigatorParams} from '@/interfaces/NavigatorParams';
import {AppRole, IDaftarUsaha, IUser, UsahaStatus} from '@/interfaces/App';
import LoadingScreen from '@/screens/app/Loading';
import {useApp} from '@/contexts/AppContext';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Center,
  Divider,
  Heading,
  Image,
} from '@gluestack-ui/themed';
import LabelItem from '@/components/LabelItem';
import LottieLoader from '@/components/LottieLoader';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'UserProfile'>;

const InfoUsaha = ({profile}: {profile: IUser}) => {
  const {request} = useApp();
  const [infoUsaha, setInfoUsaha] = React.useState<IDaftarUsaha | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  if (profile === null) {
    return <></>;
  }

  if (profile.jabatan === AppRole.pengusaha) {
    setIsLoading(true);
    request
      .get<{id: number; owner: number; status: UsahaStatus}>(
        '/daftar-usaha/mine',
      )
      .then(
        mine => {
          request.get<IDaftarUsaha>(`/daftar-usaha/${mine.data.id}`).then(
            response => {
              setInfoUsaha(response.data);
            },
            () => {
              setIsLoading(false);
            },
          );
        },
        () => {
          setIsLoading(false);
        },
      );
  }

  if (isLoading) {
    return <LottieLoader message="Mengambil Info Usaha" />;
  }

  if (profile.jabatan !== AppRole.pengusaha) {
    return;
  }

  return (
    <Box>
      <LabelItem label="Nama Usaha" value={infoUsaha?.nama} />
      <LabelItem label="Produk" value={infoUsaha?.produk} />
    </Box>
  );
};

const UserProfileScreen: React.FC<Props> = ({route}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [previewImage, setPreviewImage] = React.useState<string | boolean>(
    false,
  );
  const [profile, setProfile] = React.useState<IUser | null>(null);
  const {height, width} = useWindowDimensions();
  const {request} = useApp();

  React.useEffect(() => {
    if (route.params.id !== profile?.id) {
      setLoading(true);
      request.get<IUser>(`/pengguna/profile/${route.params.id}`).then(
        ({data}) => {
          setProfile(data);
          setLoading(false);
        },
        error => {
          if (typeof error.response === 'undefined') {
            // server offline
          }
          setLoading(false);
        },
      );
    }
  }, [profile?.id, route.params.id, request]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (previewImage) {
    return (
      <Image alt="Image" source={{uri: previewImage as string}} flex={1} />
    );
  }

  return (
    <Box borderWidth={0} mt={4} pt={0} height={height}>
      <Center>
        <TouchableOpacity
          onPress={() =>
            setPreviewImage(profile?.foto_profil || 'https://i.pravatar.cc/600')
          }>
          <Avatar bgColor="$indigo600" size="2xl">
            <AvatarFallbackText>{profile?.nama_lengkap}</AvatarFallbackText>
            {profile?.foto_profil !== null && (
              <AvatarImage
                source={{
                  uri: profile?.foto_profil,
                }}
              />
            )}
          </Avatar>
        </TouchableOpacity>
      </Center>
      <Center borderWidth={0} marginTop={10}>
        <Heading fontSize={24}>{profile?.nama_lengkap}</Heading>
        <Divider width={width - width / 4} height={1} />
        <Heading>{profile?.jabatan}</Heading>
      </Center>
      <Box flexDirection="column">
        <Box flexDirection="column" paddingHorizontal={20} paddingTop={10}>
          <LabelItem label="NIK" value={profile?.nik} />
          <LabelItem label="Email" value={profile?.email} />
          <LabelItem label="Nama Lengkap" value={profile?.nama_lengkap} />
          <InfoUsaha profile={profile as IUser} />
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfileScreen;
