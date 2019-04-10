import { ActionTree } from 'vuex';
import axios from 'axios';
import { UserState, Profile } from './types';
import { RootState } from '../types';
import ApiService from '@/app_ca/services/ApiService';

export const actions: ActionTree<UserState, RootState> = {
  login({ commit }, formData): any {
    console.log('Login with', formData);
    const bodyFormData = new FormData();
    bodyFormData.set('email', formData.email);
    bodyFormData.set('password', formData.password);
    return new Promise((resolve, reject) => {
      ApiService.post(`auth/login`, bodyFormData, {
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  logout({ commit }): any {
    return new Promise((resolve, reject) => {
      ApiService.get(`auth/logout`)
      .then((response) => {
        commit('LOGOUT');
        localStorage.removeItem('profile');
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  whoAmI({ commit }): any {
    return new Promise((resolve, reject) => {
      ApiService.get(`auth/profile`)
      .then((response) => {
        // TODO: This check shouldn't be necessary
        // once the endpoint is implemented properly
        const { email, id, first_name, last_name } = response.data;
        if (email) {
          commit('PROFILE_LOADED', {
            email,
            id,
            first_name,
            last_name,
          });
          localStorage.setItem('profile', JSON.stringify({email, id, first_name, last_name}));
          resolve(response.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
};
