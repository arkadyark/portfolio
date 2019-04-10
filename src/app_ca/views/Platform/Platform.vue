<template>
  <div class="platform">
    <transition name="fade" mode="out-in">
      <!-- <claim-send-message @closeModal="toggleModal(null)" v-if="modalVisible === 'send-message'"/> -->
      <modal-image v-if="modalWindow === 'image'"/>
      <lis-modal-window v-else-if="modalWindow != null" :window-name="modalNames[modalWindow]" @closeModal="closeModal" :key="modalWindow">
        <claim-request-information v-if="modalWindow === 'request-information'" slot="content"/>
        <claim-change-status v-else-if="modalWindow === 'change-status'" slot="content"/>
        <claim-assign-adjuster v-else-if="modalWindow === 'assign-adjuster'" slot="content"/>
        <claim-new-person v-else-if="modalWindow === 'claim-new-person'" slot="content"/>
      </lis-modal-window>
    </transition>
    <header-panel/>
    <div class="platform__wrapper">
      <sidebar/>
      <transition name="fade" mode="out-in">
        <router-view class="platform__content"/>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HeaderPanel from './HeaderPanel.vue';
import Sidebar from './Sidebar.vue';
import ApiService from '@/app_ca/services/ApiService.ts';
import ClaimRequestInformation from './Claim/ClaimRequestInformation.vue';
import ClaimChangeStatus from './Claim/ClaimChangeStatus.vue';
import ClaimAssignAdjuster from './Claim/ClaimAssignAdjuster.vue';
import ClaimNewPerson from './Claim/ClaimNewPerson.vue';
import ModalImage from './ModalImage.vue';
import LisModalWindow from '@/components/LisModalWindow.vue';

@Component({
  components: {
    HeaderPanel,
    Sidebar,
    ClaimRequestInformation,
    ClaimChangeStatus,
    ClaimAssignAdjuster,
    ClaimNewPerson,
    ModalImage,
    LisModalWindow,
  },
})
export default class Platform extends Vue {
  public modalNames: any = {
    'request-information': 'Request information',
    'change-status': 'Change status',
    'assign-adjuster': 'Assign adjuster',
    'claim-new-person': 'Add party',
  };

  get modalWindow() {
    return this.$store.state.dashboard.modalWindow;
  }

  public closeModal() {
    this.$store.dispatch('dashboard/setModalWindow', null);
  }
}
</script>

<style lang="scss" scoped>
.platform {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-blue-5);
  &__wrapper {
    flex: 1;
    display: flex;
  }
  &__content {
    position: relative;
    z-index: 0;
    flex: 1;
    text-align: left;
    overflow-y: auto;
  }
}
</style>

