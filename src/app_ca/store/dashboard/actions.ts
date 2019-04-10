import { ActionTree } from 'vuex';
import { DashboardState } from './types';
import { RootState } from '../types';
import ApiService from '@/app_ca/services/ApiService';

export const actions: ActionTree<DashboardState, RootState> = {
  getSettings({ commit }): any {
    commit('SETTINGS_LOADING', true);
    return new Promise((resolve, reject) => {
      ApiService.get(`settings`)
        .then((response) => {
          const settings = response.data;
          commit('UPDATE_SETTINGS', {
            claimStatuses: settings.case_statuses || [],
          });
          resolve(settings);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          commit('SETTINGS_LOADING', false);
        });
    });
  },
  updateSettingsClaimStatuses({ commit }, claimStatuses): any {
    commit('SETTINGS_LOADING', true);
    return new Promise((resolve, reject) => {
      ApiService.put(`settings/claim-statuses`, {
        claim_statuses: claimStatuses,
      })
        .then((response) => {
          commit('UPDATE_SETTINGS', {
            claimStatuses: response.data,
          });
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          commit('SETTINGS_LOADING', false);
        });
    });
  },
  addSettingsClaimStatus({ commit }, { name }): any {
    commit('SETTINGS_LOADING', true);
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/claim-statuses`, {
        name,
      })
        .then((response) => {
          commit('UPDATE_SETTINGS', {
            claimStatuses: response.data,
          });
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          commit('SETTINGS_LOADING', false);
        });
    });
  },
  deleteSettingsClaimStatus({ commit }, claimStatusId): any {
    commit('SETTINGS_LOADING', true);
    return new Promise((resolve, reject) => {
      ApiService.delete(`settings/claim-statuses/${claimStatusId}`)
        .then((response) => {
          commit('UPDATE_SETTINGS', {
            claimStatuses: response.data,
          });
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          commit('SETTINGS_LOADING', false);
        });
    });
  },
  getClaimByRef({ commit }, claimRef): any {
    commit('SET_CLAIM', undefined);
    commit('CLAIMS_LOADING', true);
    return new Promise((resolve, reject) => {
      ApiService.get(`case/${claimRef}/cases`)
        .then((response) => {
          const claim = response.data;
          commit('SET_CLAIM', claim);
          commit('SET_CASE_MESSAGES', claim.messages);
          resolve(claim);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          commit('CLAIMS_LOADING', false);
        });
    });
  },
  getAllClaims({ commit }): any {
    commit('CLAIMS_LOADING', true);
    return new Promise((resolve, reject) => {
      ApiService.get(`case`)
        .then((response) => {
          const claims: any = {};
          response.data.items.forEach((claim: any) => {
            claims[claim.ref] = claim;
          });
          commit('UPDATE_CLAIMS', claims);
          resolve(claims);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          commit('CLAIMS_LOADING', false);
        });
    });
  },
  setModalWindow({ commit }, modalName: string) {
    commit('SET_MODAL', modalName);
  },
  selectCase({ commit, state, dispatch }, caseId: string) {
    const claim = state.claimDetail;
    if (claim) {
      const caseDetail = claim.cases.find((claimCase: any) => {
        return claimCase.id === Number(caseId);
      });
      if (caseDetail) {
        commit('SET_CASE', caseDetail);
      } else {
        console.error(`Case with id ${caseId} could not be found`);
      }
    }
  },
  unselectClaim({ commit }) {
    commit('SET_CLAIM', undefined);
    commit('SET_CASE', undefined);
    commit('SET_CASE_MESSAGES', []);
  },
  createClaim({ commit }, { ref, claimants, agent_id, claim_type_id }) {
    commit('CLAIMS_LOADING', true);
    return new Promise((resolve, reject) => {
      ApiService.post(`case/create-claim`, {
        ref,
        claimants,
        agent_id,
        claim_type_id,
      })
        .then((response) => {
          const claim = response.data;
          resolve(claim);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          commit('CLAIMS_LOADING', false);
        });
    });
  },
  updateClaim({ commit }, { claimId, claimData }) {
    commit('CLAIMS_LOADING', true);
    return new Promise((resolve, reject) => {
      ApiService.put(`claim/${claimId}`, claimData)
        .then((response) => {
          const claim = response.data;
          claim.cases.forEach((claimCase: any) => {
            commit('UPDATE_CASE', claimCase);
          });
          resolve(claim);
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          commit('CLAIMS_LOADING', false);
        });
    });
  },
  updateClaimStatus({ commit }, { claimRef, claimStatusName }) {
    return new Promise((resolve, reject) => {
      ApiService.put(`case/${claimRef}/cases`, {
        name: claimStatusName,
      })
        .then((response) => {
          const claim = response.data;
          claim.cases.forEach((claimCase: any) => {
            commit('UPDATE_CASE', claimCase);
          });
          resolve(claim);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sendInformationRequest(
    { commit },
    { claimRef, claimId, reqTypes, customMessage },
  ) {
    return new Promise((resolve, reject) => {
      ApiService.post(`case/${claimRef}/${claimId}/request-info`, {
        info_types: reqTypes,
        custom_message: customMessage,
      })
        .then((response) => {
          const claimCase = response.data;
          commit('UPDATE_CASE', claimCase);
          resolve(claimCase);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  processClaimImages({ commit }, { claimId, type }) {
    return new Promise((resolve, reject) => {
      ApiService.post(`claim/${claimId}/process-images/${type}`)
        .then((response) => {
          const claim = response.data;
          resolve(claim);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sendAdjusterMessage({ commit }, { claimId, message }) {
    return new Promise((resolve, reject) => {
      ApiService.post(`message/chatBot`, {
        claim_id: claimId,
        message,
      })
        .then((response) => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  openModalImage({ commit }, imageSrc) {
    commit('SET_MODAL_IMAGE', imageSrc);
    commit('SET_MODAL', 'image');
  },
  generateClaimPDF({ commit }, { claimRef, claimId }) {
    return new Promise((resolve, reject) => {
      ApiService.get(`case/${claimRef}/${claimId}/download/pdf`)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addCaseMessage({ commit, state }, message) {
    if (state.caseDetail && message.case_id === state.caseDetail.id) {
      commit('ADD_CASE_MESSAGE', message);
    }
  },
  setChatHistory({ commit }, data) {
    commit('SET_CASE_MESSAGES', data.messages);
  },
};
