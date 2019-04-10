import { MutationTree } from 'vuex';
import { DashboardState } from './types';
import Vue from 'vue';

export const mutations: MutationTree<DashboardState> = {
  SETTINGS_LOADING(state: DashboardState, payload: boolean) {
    state.loading = payload;
  },
  UPDATE_SETTINGS(state: DashboardState, payload: any) {
    state.settings = Object.assign({}, state.settings, payload);
  },
  CLAIMS_LOADING(state: DashboardState, payload: boolean) {
    state.loading = payload;
  },
  UPDATE_CLAIMS(state: DashboardState, payload: any) {
    state.claims = Object.assign({}, state.claims, payload);
  },
  SET_CLAIM(state: DashboardState, payload: any) {
    state.claimDetail = payload;
  },
  SET_CASE(state: DashboardState, payload: any) {
    state.caseDetail = payload;
  },
  SET_MODAL(state: DashboardState, payload: string) {
    state.modalWindow = payload;
  },
  SET_MODAL_IMAGE(state: DashboardState, payload: string) {
    state.modalImageSrc = payload;
  },
  UPDATE_CASE(state: DashboardState, payload: any) {
    // Update case in claimDetail
    if (state.claimDetail != null && state.claimDetail.cases.length) {
      state.claimDetail.cases = state.claimDetail.cases.map((claimCase: any) => {
        if (claimCase.id === payload.id) {
          return payload;
        } else {
          return claimCase;
        }
      });
    }

    // Update caseDetail
    if (state.caseDetail.id === payload.id) {
      state.caseDetail = payload;
    }

    // Update claims list
    const isSameClaim = state.claimDetail.ref === payload.ref;
    if (isSameClaim && state.claims[payload.ref]) {
      Vue.set(state.claims, payload.ref, state.claimDetail);
      state.claims[payload.ref] = state.claimDetail;
    }
  },
  SET_CASE_MESSAGES(state: DashboardState, payload: any[]) {
    state.caseMessages = (payload || []).slice();
  },
  ADD_CASE_MESSAGE(state: DashboardState, payload: any) {
    state.caseMessages.push(payload);
  },
};
