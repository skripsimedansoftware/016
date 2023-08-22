import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

type IAppContext = {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  setIsAuthenticated: (status: boolean) => void;
  setIsAuthenticating: (status: boolean) => void;
  signIn: (identity: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AppContext = React.createContext<IAppContext>({
  isAuthenticated: false,
  isAuthenticating: false,
  setIsAuthenticated: (status: boolean) => {},
  setIsAuthenticating: (status: boolean) => {},
  signIn: async (username: string, password: string) => {},
  signOut: async () => {},
});

const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  const signIn = async (username: string, password: string) => {
    setIsAuthenticating(true);
    await AsyncStorage.setItem('AUTH-TOKEN', password);
    setIsAuthenticated(true);
    setIsAuthenticating(false);
  };

  const signOut = async () => {
    setIsAuthenticating(true);
    await AsyncStorage.removeItem('AUTH-TOKEN');
    setIsAuthenticated(false);
    setIsAuthenticating(false);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isAuthenticating,
        setIsAuthenticated,
        setIsAuthenticating,
        signIn,
        signOut,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => React.useContext(AppContext);

export default AppProvider;
