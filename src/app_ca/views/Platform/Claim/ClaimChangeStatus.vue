<template>
  <div class="claim-change-status">
    <label class="label label--margin">Claim status</label>
    <div class="claim-change-status__box">
      <lis-dropdown
        :value="newStatus"
        :label="mapStatusToString"
        :options="possibleClaimStatuses"
        @select="selectNewStatus"
      />
    </div>
    <lis-loader v-if="loading" color="#0057FF"/>
    <lis-button v-else type="primary" text="Save" @click="save"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import { mapGetters } from "vuex";
import ApiService from '@/app_ca/services/ApiService.ts';
import LisIcon from '@/components/LisIcon.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisButton from '@/components/LisButton.vue';
import LisSwitch from '@/components/LisSwitch.vue';
import LisDropdown from '@/components/LisDropdown.vue';

@Component({
  components: {
    LisIcon,
    LisLoader,
    LisButton,
    LisSwitch,
    LisDropdown,
  },
})
export default class ClaimChangeStatus extends Vue {
  public loading: boolean = false;
  public newStatus: number = this.claim.cases[0].case_status_id;

  get claim() {
    return this.$store.state.dashboard.claimDetail;
  }

  get possibleClaimStatuses() {
    const { claimStatuses } = this.$store.state.dashboard.settings;
    return claimStatuses.map((cs: any) => cs.id);
  }

  public mapStatusToString(statusId: any) {
    const { claimStatuses } = this.$store.state.dashboard.settings;
    const status = claimStatuses.find((cs: any) => cs.id === statusId);
    return status ? status.name : '-';
  }

  public selectNewStatus(statusId: number) {
    console.log(statusId);
    this.newStatus = statusId;
  }

  public save() {
    this.loading = true;
    const claimRef = this.claim.ref;
    const claimStatusName = this.mapStatusToString(this.newStatus);
    this.$store
      .dispatch('dashboard/updateClaimStatus', { claimRef, claimStatusName })
      .then(() => {
        this.$store.dispatch('dashboard/setModalWindow', null);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.claim-change-status {
  .label {
    display: block;
    font-weight: 500;
    &--margin {
      margin-bottom: 10px;
    }
  }
  &__box {
    margin-bottom: 100px;
    .lis-dropdown {
      min-width: 200px;
    }
  }
}
</style>

