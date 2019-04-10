import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { UserState } from './types';
import { RootState } from '../types';

const savedProfile = localStorage.getItem('profile');

export const state: UserState = {
  profile: savedProfile ? JSON.parse(savedProfile) : undefined,
  loading: false,
};

const namespaced: boolean = true;

export const user: Module<UserState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
