import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosInstance} from 'axios';
import React from 'react';

type IAuthInfo = {
  id: number;
  nik: string;
  email: string;
  jabatan: string;
  username: string;
  nama_lengkap: string;
  foto_profil: string | null;
};

type IAppContext = {
  authInfo: IAuthInfo | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  setAuthInfo: (authInfo: IAuthInfo | null) => void;
  setIsAuthenticated: (status: boolean) => void;
  setIsAuthenticating: (status: boolean) => void;
  signIn: (identity: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  request: AxiosInstance;
};

const AppContext = React.createContext<IAppContext>({
  authInfo: null,
  isAuthenticated: false,
  isAuthenticating: false,
  setAuthInfo: () => {},
  setIsAuthenticated: () => {},
  setIsAuthenticating: () => {},
  signIn: () => Promise.resolve(false),
  signOut: () => Promise.resolve(false),
  request: axios.create(),
});

const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [authInfo, setAuthInfo] = React.useState<IAuthInfo | null>(null);
  const [authToken, setAuthToken] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);
  let request = axios.create({
    baseURL: 'http://192.168.43.76:3000',
    headers: {
      Authorization: authToken !== null ? `Bearer ${authToken}` : undefined,
    },
  });

  const loadToken = async () => {
    const token = await AsyncStorage.getItem('AUTH-TOKEN');
    setAuthToken(token);
  };

  React.useEffect(() => {
    loadToken();
  }, [authToken]);

  const signIn = React.useCallback(
    async (identity: string, password: string) => {
      setIsAuthenticating(true);
      return request.post('auth/sign-in', {identity, password}).then(
        async ({data}) => {
          setAuthInfo(data.pengguna);
          setAuthToken(data.token);
          setIsAuthenticated(true);
          setIsAuthenticating(false);
          await AsyncStorage.setItem('AUTH-TOKEN', data.token);
          return true;
        },
        error => {
          console.log(error);
          setIsAuthenticating(false);
          return false;
        },
      );
    },
    [request],
  );

  const signOut = React.useCallback(async () => {
    setIsAuthenticating(true);
    await AsyncStorage.removeItem('AUTH-TOKEN');
    setAuthToken(null);
    setIsAuthenticated(false);
    setIsAuthenticating(false);
    return true;
  }, []);

  return (
    <AppContext.Provider
      value={{
        authInfo,
        isAuthenticated,
        isAuthenticating,
        setAuthInfo,
        setIsAuthenticated,
        setIsAuthenticating,
        signIn,
        signOut,
        request,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => React.useContext(AppContext);

export default AppProvider;
