import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { DashboardState } from './types';
import { RootState } from '../types';

export const state: DashboardState = {
  claims: {},
  claimDetail: undefined,
  caseMessages: [],
  caseDetail: undefined,
  loading: false,
  modalWindow: null,
  modalImageSrc: null,
  settings: {
    claimStatuses: [],
  },
};

const namespaced: boolean = true;

export const dashboard: Module<DashboardState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
