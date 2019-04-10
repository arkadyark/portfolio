import axios from 'axios';
import config from '@/config/index';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import router from '@/app_ca/router';

const refreshingToken = false;

const instance = axios.create({
  // baseURL: 'https://api.liscena.com/api/',
  baseURL: config.api,
  withCredentials: true,
  // headers: {'X-Custom-Header': 'foobar'},
});

// Function that will be called to refresh authorization
const refreshAuthLogic = () =>
  instance
    .get(`auth/refresh-token`)
    .then((tokenRefreshResponse) => {
      console.warn('Session token renewed');
      return Promise.resolve();
    })
    .catch((err) => {
      localStorage.removeItem('profile');
      console.warn('Session token expired');
      router.push({ name: 'login' });
      return Promise.reject(err);
    });

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
