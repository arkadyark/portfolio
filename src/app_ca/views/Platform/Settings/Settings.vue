<template>
  <div class="settings">
    <div v-if="areSettingsLoading" class="settings__loading">
      <lis-loader color="#434B65"/>
    </div>
    <template v-else>
      <h1>Settings</h1>
      <hr class="lis-hr">
      <label class="label label--margin">Claim statuses</label>
      <div class="settings__claim-statuses">
        <div
          class="settings__claim-statuses__item"
          v-for="(status, index) in claimStatuses"
          :key="status.id"
        >
          <span class="settings__claim-statuses__item__index">{{index}}</span>
          <input type="text" v-model="status.name">
          <lis-icon name="close-circle" size="small" @click.native="deleteSettingsClaimStatus(status.id)"/>
        </div>
      </div>
      <div class="lis-buttons-horizontal">
        <lis-button type="primary" text="Save" @click="updateSettingsClaimStatuses"/>
        <lis-button type="dark" text="Add" @click="addSettingsClaimStatus"/>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisIcon from '@/components/LisIcon.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisButton from '@/components/LisButton.vue';

@Component({
  components: {
    LisIcon,
    LisButton,
    LisLoader,
  },
})
export default class Settings extends Vue {
  public claimStatuses: any[] = [];

  get settings() {
    return this.$store.state.dashboard.settings;
  }

  get areSettingsLoading() {
    return this.$store.state.dashboard.loading;
  }

  @Watch('settings', { immediate: true, deep: true })
  public updateSettings() {
    const { settings } = this.$store.state.dashboard;
    this.claimStatuses = settings.claimStatuses;
  }

  public updateSettingsClaimStatuses() {
    this.$store
      .dispatch('dashboard/updateSettingsClaimStatuses', this.claimStatuses)
      .then((response) => {
        console.log(response);
      });
  }

  public addSettingsClaimStatus() {
    this.$store
      .dispatch('dashboard/addSettingsClaimStatus', {
        name: 'Status name',
      })
      .then((response) => {
        console.log(response);
      });
  }

  public deleteSettingsClaimStatus(claimStatusId: number) {
    this.$store
      .dispatch('dashboard/deleteSettingsClaimStatus', claimStatusId)
      .then((response) => {
        console.log(response);
      });
  }
}
</script>

<style lang="scss" scoped>
.settings {
  min-height: 100%;
  background: var(--color-blue-5);
  padding: 40px;
  box-sizing: border-box;
  .label {
    display: block;
    font-weight: 500;
    &--margin {
      margin-bottom: 15px;
    }
  }
  h1 {
    font-size: var(--font-size-1);
    margin-bottom: 20px;
  }
  &__claim-statuses {
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    width: 300px;
    margin-bottom: 20px;
    &__item {
      box-shadow: 0 2px 4px var(--color-light-1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 4px;
      margin-bottom: 4px;
      overflow: hidden;
      &:last-child {
        margin-bottom: 0;
      }
      &__index {
        width: 50px;
        text-align: center;
        color: var(--color-blue-4);
      }
      input {
        width: 100%;
        font-size: var(--font-size-3);
        color: var(--color-blue-2);
        background: none;
        border: none;
        padding: 10px 15px;
        border-left: 1px solid var(--color-light-1);
        border-right: 1px solid var(--color-light-1);
        background: var(--color-white-1);
        &:hover, &:focus {
          color: var(--color-blue-3);
        }
      }
      .lis-icon {
        padding: 0 10px;
        cursor: pointer;
        color: var(--color-blue-3);
        &:hover {
          color: var(--color-blue-3-hover);
        }
      }
    }
  }
}
</style>

