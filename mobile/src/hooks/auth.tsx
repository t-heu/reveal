import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as Location from 'expo-localization';

import {registerForPushNotificationsAsync} from '../utils/getTokenNotification';
import api from '../services/api';

interface User {
  id: string;
  profilePicture: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  access_token?: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

interface OauthCredentials {
  accessTokenGoogle: string;
}

interface AuthContextData {
  user: User;
  loading: boolean;
  signin(credentials: SignInCredentials): Promise<void>;
  signup(credentials: SignUpCredentials): Promise<void>;
  loginWithGoogle(credentials: OauthCredentials): Promise<void>;
  signout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({children}) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [refresh_token, user, accesstoken] = await AsyncStorage.multiGet([
        '@auth:refreshToken',
        '@auth:user',
        '@auth:accessToken',
      ]);

      if (user[1] && refresh_token[1] && accesstoken[1]) {
        const {access_token, token_type} = JSON.parse(accesstoken[1]);

        const userInfo = JSON.parse(user[1]);
        userInfo.avatar_url = `${userInfo.avatar_url}?${Date.now()}`;

        api.defaults.headers.authorization = `${token_type} ${access_token}`;
        setData({user: userInfo});
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signout = useCallback(async () => {
    await AsyncStorage.multiRemove([
      '@auth:accessToken',
      '@auth:refreshToken',
      '@auth:user',
    ]);
    setData({} as AuthState);
  }, []);

  const signup = useCallback(async ({email, password, name}) => {
    await api.post('/user', {
      email,
      password,
      name,
    });
  }, []);

  const signin = useCallback(async ({email, password}) => {
    const token = await registerForPushNotificationsAsync();
    const response = await api.post('/user/session', {
      email,
      password,
      locale: Location.locale,
      notification_key: token,
    });

    const {
      access_token,
      refresh_token,
      token_type,
      expires,
      user,
    } = response.data;

    await AsyncStorage.multiSet([
      [
        '@auth:accessToken',
        JSON.stringify({access_token, expires, token_type}),
      ],
      ['@auth:refreshToken', refresh_token],
      ['@auth:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `${token_type} ${access_token}`;
    setData({user});
  }, []);

  const loginWithGoogle = useCallback(async ({accessTokenGoogle}) => {
    const reseponse = await api.post('/user/account/google', {
      accessTokenGoogle,
    });

    const {access_token, expires, user, token_type} = reseponse.data;

    await AsyncStorage.multiSet([
      [
        '@auth:accessToken',
        JSON.stringify({access_token, expires, token_type}),
      ],
      ['@auth:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `${token_type} ${access_token}`;
    setData({user});
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        loading,
        signin,
        signup,
        signout,
        loginWithGoogle,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {AuthProvider, useAuth};
