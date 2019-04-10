import { GetterTree } from 'vuex';
import { DashboardState } from './types';
import { RootState } from '../types';

export const getters: GetterTree<DashboardState, RootState> = {
  // fullName(state): string {
  //   const { user } = state;
  //   const firstName = (user && user.firstName) || '';
  //   const lastName = (user && user.lastName) || '';
  //   return `${firstName} ${lastName}`;
  // },
};
