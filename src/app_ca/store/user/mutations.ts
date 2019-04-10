import { MutationTree } from 'vuex';
import { UserState, Profile } from './types';

export const mutations: MutationTree<UserState> = {
  PROFILE_LOADING(state: UserState, payload: boolean) {
    state.loading = payload;
  },
  PROFILE_LOADED(state: UserState, payload: Profile) {
    state.profile = payload;
  },
  PROFILE_ERROR(state: UserState) {
    state.profile = undefined;
  },
  LOGOUT(state: UserState) {
    state.profile = undefined;
  },
};
