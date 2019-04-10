import Vue from 'vue';
import Vuex from 'vuex';
import { user } from './user/index';
import { dashboard } from './dashboard/index';
import { RootState } from './types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    user,
    dashboard,
  },
  mutations: {

  },
  actions: {

  },
});
