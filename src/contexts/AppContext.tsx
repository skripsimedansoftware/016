import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError, AxiosInstance} from 'axios';

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
  setAuthToken: (token: string) => void;
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
  setAuthToken: () => {},
  setIsAuthenticated: () => {},
  setIsAuthenticating: () => {},
  signIn: () => Promise.resolve(false),
  signOut: () => Promise.resolve(false),
  request: axios.create(),
});

const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [authInfo, setAuthInfo] = React.useState<IAuthInfo | null>(null);
  const [authToken, setAuthToken] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] =
    React.useState<boolean>(false);
  let request = axios.create({
    baseURL: 'http://192.168.43.245:3000',
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : undefined,
    },
  });

  request.interceptors.response.use(
    config => config,
    (error: AxiosError<{error: string}>) => {
      if (error.response && error.response.data) {
        const JSON = error.response.data;
        if (JSON.error === 'expired-token') {
          return request.get('/auth/validate-token').then(({data}) => {
            setAuthToken(data.token);
            return request({
              ...error.config,
              headers: {
                ...error.config?.headers,
                Authorization: `Bearer ${data.token}`,
              },
            });
          }, Promise.reject);
        }
      }

      return Promise.reject(error);
    },
  );

  const loadToken = async () => {
    const token = await AsyncStorage.getItem('AUTH-TOKEN');
    setAuthToken(token);
  };

  React.useEffect(() => {
    loadToken();
  }, []);

  const signIn = async (identity: string, password: string) => {
    setIsAuthenticating(true);
    return request
      .post('auth/sign-in', {identity, password})
      .then(async ({data}) => {
        setAuthInfo(data.pengguna);
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setIsAuthenticating(false);
        await AsyncStorage.setItem('AUTH-TOKEN', data.token);
        return true;
      })
      .catch(() => {
        setIsAuthenticated(false);
        setIsAuthenticating(false);
        return false;
      });
  };

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
        setAuthToken,
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
