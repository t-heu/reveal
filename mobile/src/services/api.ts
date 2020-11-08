import axios, {
  //AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import Env from '../../environment';

const api = axios.create({
  baseURL: `${Env.API_URI}/api/v1`,
});

async function refreshToken(): Promise<any> {
  return api
    .post('/user/token/refresh', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: await AsyncStorage.getItem('@auth:refreshToken'),
      },
    })
    .then(async (res) => {
      const {access_token, refresh_token, expires, token_type} = res.data;

      AsyncStorage.setItem(
        '@auth:accessToken',
        JSON.stringify({access_token, expires, token_type}),
      );
      AsyncStorage.setItem('@auth:refreshToken', refresh_token);

      return Promise.resolve({access_token, token_type});
    })
    .catch(async () => {
      await AsyncStorage.multiRemove([
        '@auth:accessToken',
        '@auth:refreshToken',
        '@auth:user',
      ]);
      return Promise.reject();
    });
}

api.interceptors.response.use(
  async (config: AxiosResponse): Promise<AxiosResponse> => {
    return config;
  },
  async function (error) {
    if (error.response.status === 401) {
      console.log(error.response.status);

      const {token_type, access_token} = await refreshToken();

      // Retry request
      error.config.headers.authorization = `${token_type} ${access_token}`;
      return await api.request(error.config);
    }
    console.log(error.response.status);

    return Promise.reject(error);
  },
);

// api.interceptors.request.use(
//   async (config: AxiosRequestConfig): Promise<AxiosRequestConfig | any> => {
//     const accessToken = await AsyncStorage.getItem('@auth:accessToken');

//     if (accessToken) {
//       const {token_type, access_token} = JSON.parse(accessToken);
//       config.headers.authorization = `${token_type} ${access_token}`;
//     }

//     return config;
//   },
// );

export default api;
