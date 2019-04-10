<template>
  <div class="claim-header">
    <div class="claim-header__container">
      <div class="claim-header__container__info">
        <p class="claim-header__container__info__label">Claim ID</p>
        <p class="claim-header__container__info__value">{{ claim.ref }}</p>
      </div>

      <div class="claim-header__container__info">
        <p class="claim-header__container__info__label">Type</p>
        <p class="claim-header__container__info__value">{{ getClaimType(claim.claim_type_id) }}</p>
      </div>

      <div class="claim-header__container__info">
        <p class="claim-header__container__info__label">Status</p>
        <p
          class="claim-header__container__info__value"
        >{{ getClaimLastStatus(claim) }}</p>
      </div>

      <div class="claim-header__container__info">
        <p class="claim-header__container__info__label">Assigned to</p>
        <p class="claim-header__container__info__value" v-if="claim.cases.length && claim.cases[0].agent">
          <router-link :to="{name: 'adjusters.detail'}">{{ assignedTo }}</router-link>
        </p>
        <p class="claim-header__container__info__value" v-else>Unassigned</p>
      </div>

      <div class="claim-header__container__info__right">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';
import LisButton from '@/components/LisButton.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisDropdown from '@/components/LisDropdown.vue';

const claimTypes: any = {
  1: 'Auto',
  2: 'Property',
};

@Component({
  components: {
    LisIcon,
    LisButton,
    LisLoader,
    LisDropdown,
  },
})
export default class ClaimHeader extends Vue {
  public updatingStatus: boolean = false;

  @Prop({ type: Object }) private claim!: any;

  get possibleClaimStatuses() {
    const { claimStatuses } = this.$store.state.dashboard.settings;
    return claimStatuses.map((cs: any) => cs.id);
  }

  get assignedTo() {
    const agent = this.claim.cases[0].agent;
    if (agent) {
      return (agent.first_name || '') + ' ' + (agent.last_name || '');
    }
    return '-';
  }

  public mapStatusToString(statusId: any) {
    const { claimStatuses } = this.$store.state.dashboard.settings;
    const status = claimStatuses.find((cs: any) => cs.id === statusId);
    return status ? status.name : '-';
  }

  public getClaimLastStatus(claim: any) {
    const claimStatusId = null;
    if (claim.cases.length && claim.cases[0].case_status_id) {
      return this.mapStatusToString(claim.cases[0].case_status_id);
    }
    return '-';
  }

  public getClaimType(typeId: number) {
    return claimTypes[typeId];
  }
}
</script>

<style lang="scss" scoped>
.claim-header {
  height: 80px;
  width: 100%;
  box-shadow: 2px 0 4px 0 var(--color-light-1);
  background: var(--color-white-1);
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  z-index: 2;
  &__container {
    max-width: 1200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    &__info {
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &--status {
        width: 200px;
      }
      a {
        text-decoration: none;
        color: var(--color-blue-3);
        font-weight: 500;
        &:hover {
          color: var(--color-blue-3-hover);
        }
      }
      &__label {
        font-size: var(--font-size-4);
        line-height: var(--font-size-3);
        color: var(--color-blue-4);
      }
      &__value {
        font-size: var(--font-size-2);
        display: flex;
        align-items: center;
        .lis-icon {
          margin-right: 6px;
        }
      }
      &__right {
        margin-left: auto;
        .lis-button {
          margin-left: 20px;
        }
      }
    }
    &__info + &__info {
      padding-left: 30px;
      margin-left: 30px;
      border-left: 1px solid var(--color-light-1);
    }
  }
}
</style>
