<template>
  <div class="claim">
    <div v-if="isClaimLoading" class="claim__loading">
      <lis-loader color="#434B65"/>
    </div>
    <div v-else-if="selectedClaim">
      <claim-header :claim="selectedClaim"/>

      <div class="claim__tabs">
        <router-link
          v-for="item in tabs"
          :to="{name: item.routeName}"
          :key="item.routeName"
          class="claim__tabs__item"
          :active-class="'claim__tabs__item--active'"
        >
          <span>{{ item.name }}</span>
        </router-link>
      </div>

      <div class="claim__view">
        <transition name="horizontal-transition" mode="out-in">
          <router-view :claim="selectedClaim" @reloadClaim="fetchClaim"/>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ClaimHeader from './ClaimHeader.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisIcon from '@/components/LisIcon.vue';
import LisButton from '@/components/LisButton.vue';
import LisDropdown from '@/components/LisDropdown.vue';
import ApiService from '@/app_ca/services/ApiService.ts';

@Component({
  components: {
    ClaimHeader,
    LisLoader,
    LisIcon,
    LisButton,
    LisDropdown,
  },
})
export default class Claim extends Vue {

  get isClaimLoading() {
    return this.$store.state.dashboard.loading;
  }

  get selectedClaim() {
    return this.$store.state.dashboard.claimDetail;
  }

  public tabs: any[] = [
    {
      name: 'Claimants',
      routeName: 'dashboard.claimDetail.claimants',
    },
    {
      name: 'Activity',
      routeName: 'dashboard.claimDetail.activity',
    },
    // {
    //   name: "Triage",
    //   routeName: "dashboard.claimDetail.triage"
    // },
    {
      name: 'Download',
      routeName: 'dashboard.claimDetail.downloadPDF',
    },
  ];
  @Prop({ type: String }) private claimRef!: string;

  public created() {
    this.fetchClaim();
  }

  public beforeDestroy() {
    this.unselectClaim();
  }

  public unselectClaim() {
    this.$store.dispatch('dashboard/unselectClaim');
  }

  public fetchClaim() {
    const claimRef = this.claimRef;
    if (claimRef) {
      this.$store.dispatch('dashboard/getClaimByRef', claimRef);
    }
  }

  public setModalWindow(type: string | null) {
    this.$store.dispatch('dashboard/setModalWindow', type);
  }
}
</script>

<style lang="scss" scoped>
.claim {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: var(--font-size-3);
  // background: var(--color-blue-5);
  & > div {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  &__loading {
    padding: 40px 0;
  }

  &__actions {
    padding: 40px 40px 0 40px;
    position: absolute;
    right: 0;
    top: 110px;
    .lis-button {
      margin-right: 20px;
    }
  }

  &__tabs {
    display: flex;
    flex-direction: row;
    padding: 6px 40px 0;
    &__item {
      padding: 16px 16px;
      display: inline-block;
      box-sizing: border-box;
      text-decoration: none;
      color: var(--color-blue-4);
      font-size: var(--font-size-3);
      font-weight: 500;
      border-bottom: 3px solid transparent;
      &--active {
        color: var(--color-blue-1);
        border-bottom: 3px solid var(--color-green-1);
      }
      &:hover:not(&--active) {
        color: var(--color-blue-2);
      }
    }
  }

  &__view {
    background: var(--color-white-1);
    flex: 1;
    padding: 40px;
    position: relative;
  }
}
</style>

