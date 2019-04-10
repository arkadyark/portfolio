<template>
  <div class="claim-edit">
    <div v-if="isClaimLoading" class="claim__loading">
      <lis-loader color="#434B65"/>
    </div>
    <div v-else-if="selectedClaim">
      <claim-header :claim="selectedClaim">
        <div slot="actions">
          <lis-button
            icon="close-circle"
            type="dark"
            text="Cancel"
            @click="$router.push({name: 'dashboard.claimDetail.details', params: $route.params})"
          />
          <lis-button type="green" text="Save" @click="saveClaim"/>
        </div>
      </claim-header>

      <div class="claim-edit__view">
        <h1>Edit claim information</h1>

        <div class="claim-edit__view__cols">
          <div class="claim-edit__view__cols__col">
            <fieldset class="claim-edit__view__cols__col__fieldset">
              <lis-input v-model="claimCopy.policy_holder.first_name" placeholder="First name"/>
            </fieldset>
            <fieldset class="claim-edit__view__cols__col__fieldset">
              <lis-input v-model="claimCopy.policy_holder.last_name" placeholder="Last name"/>
            </fieldset>
            <fieldset class="claim-edit__view__cols__col__fieldset">
              <lis-input
                v-model="claimCopy.policy_holder.policy_number"
                placeholder="Policy number"
              />
            </fieldset>
            <fieldset class="claim-edit__view__cols__col__fieldset">
              <lis-input v-model="claimCopy.policy_holder.phone_number" placeholder="Phone number"/>
            </fieldset>
            <fieldset class="claim-edit__view__cols__col__fieldset">
              <lis-input v-model="claimCopy.policy_holder.email" placeholder="Email"/>
            </fieldset>
          </div>

          <div class="claim-edit__view__cols__col">
            <label class="label label--margin">Accident date and time</label>
            <br>
            <lis-button
              icon="calendar"
              type="white"
              :text="claimCopy.accident_date || 'Not specified'"
            />
            <br>
            <br>
            <br>
            <label class="label label--margin">Accident location</label>
            <fieldset class="claim-edit__view__cols__col__fieldset">
              <lis-input
                v-model="claimCopy.accident_location"
                placeholder="Street or intersection"
              />
            </fieldset>
            <br>
            <label class="label label--margin">Accident description</label>
            <textarea class="lis-textarea" rows="6" v-model="claimCopy.accident_description"></textarea>
          </div>

          <div class="claim-edit__view__cols__col">
            <label class="label label--margin">Are there any fluids leaking?</label>
            <div class="claim-edit__view__cols__col__radio-set">
              <label>
                <input type="radio" v-model="claimCopy.fluids" :value="1">
                <span>Yes</span>
              </label>
              <label class="claim-edit__view__cols__col__radio-label">
                <input type="radio" v-model="claimCopy.fluids" :value="0">
                <span>No</span>
              </label>
            </div>

            <label class="label label--margin">Is the vehicle still drivable?</label>
            <div class="claim-edit__view__cols__col__radio-set">
              <label>
                <input type="radio" v-model="claimCopy.drivable" :value="1">
                <span>Yes</span>
              </label>
              <label class="claim-edit__view__cols__col__radio-label">
                <input type="radio" v-model="claimCopy.drivable" :value="0">
                <span>No</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import ClaimHeader from './ClaimHeader.vue';
import LisInput from '@/components/LisInput.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisIcon from '@/components/LisIcon.vue';
import LisButton from '@/components/LisButton.vue';
import LisDropdown from '@/components/LisDropdown.vue';
import ApiService from '@/app_ca/services/ApiService.ts';
// import socketVue from '@/app_ca/socket-io.ts';

@Component({
  components: {
    ClaimHeader,
    LisInput,
    LisLoader,
    LisIcon,
    LisButton,
    LisDropdown,
  },
})
export default class Claim extends Vue {

  get possibleClaimStatuses() {
    const { claimStatuses } = this.$store.state.dashboard.settings;
    return claimStatuses.map((cs: any) => cs.id);
  }

  get isClaimLoading() {
    return this.$store.state.dashboard.loading;
  }

  get selectedClaim() {
    return this.$store.state.dashboard.claimDetail;
  }
  public claimCopy: any = {
    policy_holder: {
      first_name: '',
      last_name: '',
    },
    accident_location: '',
    fluids: null,
  };

  @Prop({ type: String }) private claimRef!: string;

  @Watch('selectedClaim', { immediate: true })
  public updateClaimCopy(val: any) {
    this.claimCopy = val;
  }

  public created() {
    this.fetchClaim();
  }

  public mapStatusToString(statusId: any) {
    const { claimStatuses } = this.$store.state.dashboard.settings;
    const status = claimStatuses.find((cs: any) => cs.id === statusId);
    return status ? status.name : '-';
  }

  public fetchClaim() {
    const claimRef = this.claimRef;
    if (claimRef) {
      this.$store.dispatch('dashboard/getClaimByRef', claimRef);
    }
  }

  public saveClaim() {
    this.$store
      .dispatch('dashboard/updateClaim', {
        claimId: this.selectedClaim.id,
        claimData: this.claimCopy,
      })
      .catch((err) => {
        console.error(err);
      });
  }

  public setModalWindow(type: string | null) {
    this.$store.dispatch('dashboard/setModalWindow', type);
  }
}
</script>

<style lang="scss" scoped>
.claim-edit {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: var(--font-size-3);
  h1 {
    font-size: var(--font-size-1);
    margin-bottom: 60px;
  }
  .label {
    font-weight: 500;
    display: inline-block;
    &--margin {
      margin-bottom: 10px;
    }
  }
  & > div {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  &__loading {
    padding: 40px 0;
  }
  &__view {
    background: var(--color-white-1);
    flex: 1;
    padding: 40px;
    &__cols {
      display: flex;
      max-width: 1200px;
      width: 100%;
      &__col {
        flex: 1;
        margin-right: 60px;
        &:first-of-type {
          max-width: 250px;
        }
        &__fieldset {
          margin-bottom: 20px;
        }
        &__radio-set {
          margin-bottom: 20px;
          label {
            margin-right: 10px;
            font-weight: 500;
            color: var(--color-blue-4);
            cursor: pointer;
            &:hover {
              color: var(--color-blue-3);
            }
          }
          input {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>

