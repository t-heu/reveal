import axios from 'axios'; // AxiosResponse, //AxiosRequestConfig,
import AsyncStorage from '@react-native-community/async-storage';

import Env from '../../environment';

let isRefreshing = false;
let refreshSubscribers = [] as any;

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

      return Promise.resolve(access_token);
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

function subscribeTokenRefresh(cb: any) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb: any) => cb(token));
}

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const {
      config,
      response: {status},
    } = error;
    const originalRequest = config;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshToken().then((newToken) => {
          isRefreshing = false;
          onRefreshed(newToken);
        });
      }

      const retryOrigReq = new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          // replace the expired token and retry request
          originalRequest.headers.Authorization = 'Bearer ' + token;
          resolve(axios(originalRequest));
          refreshSubscribers = [];
        });
      });
      return retryOrigReq;
    } else {
      return Promise.reject(error);
    }
  },
);

// api.interceptors.response.use(
//   async (config: AxiosResponse): Promise<AxiosResponse> => {
//     return config;
//   },
//   async function (error) {
//     if (error.response.status === 401) {
//       console.log(error.response.status);

//       const {token_type, access_token} = await refreshToken();

//       // Retry request
//       error.config.headers.authorization = `${token_type} ${access_token}`;
//       return await api.request(error.config);
//     }
//     console.log(error.response.status);

//     return Promise.reject(error);
//   },
// );

export default api;
