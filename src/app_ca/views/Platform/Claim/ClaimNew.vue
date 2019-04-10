<template>
  <div class="claim-new">
    <div v-if="isClaimLoading" class="claim__loading">
      <lis-loader color="#434B65"/>
    </div>
    <div v-else>
      <div class="claim-new__view">
        <h1>Create new claim</h1>
        <fieldset class="claim-new__view__fieldset">
          <lis-input v-model="newClaim.ref" placeholder="Claim ID"/>
        </fieldset>
        <h2>Party information</h2>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Type</td>
              <td>Phone Number</td>
              <td>Email</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(claimant, i) in newClaim.claimants" :key="i">
              <td>{{ `${claimant.first_name} ${claimant.last_name}` }}</td>
              <td>{{ claimant.insured ? 'Insured' : 'Claimant' }}</td>
              <td>{{ claimant.phone_number }}</td>
              <td>{{ claimant.email }}</td>
              <td>
                <div class="claim-new__view__actions">
                  <lis-icon name="pencil" size="small"/>
                  <lis-icon name="close-circle" size="small" @click.native="removeClaimant(i)"/>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <lis-button type="white" text="Add party" @click="setModalWindow('claim-new-person')"/>
        <fieldset class="claim-new__view__fieldset">
          <lis-button type="primary" text="Create" @click="createClaim"/>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LisLoader from '@/components/LisLoader.vue';
import LisInput from '@/components/LisInput.vue';
import LisIcon from '@/components/LisIcon.vue';
import LisButton from '@/components/LisButton.vue';
import LisDropdown from '@/components/LisDropdown.vue';
import ApiService from '@/app_ca/services/ApiService.ts';
// import socketVue from '@/app_ca/socket-io.ts';

@Component({
  components: {
    LisLoader,
    LisInput,
    LisIcon,
    LisButton,
    LisDropdown,
  },
})
export default class ClaimNew extends Vue {
  public newClaim: any = {
    ref: '',
    claimants: [],
    agent_id: this.agentId,
    claim_type_id: 1,
  };

  public created() {
    this.$root.$on('addClaimant', (person: any) => {
      this.newClaim.claimants.push(person);
    });
  }

  public beforeDestroy() {
    this.$root.$off('addClaimant');
  }

  get agentId() {
    return this.$store.state.user.profile.id;
  }

  get isClaimLoading() {
    return false;
  }

  public setModalWindow(type: string | null) {
    this.$store.dispatch('dashboard/setModalWindow', type);
  }

  public removeClaimant(index: number) {
    // this.$store.dispatch("dashboard/newClaimRemoveClaimant", index);
    this.newClaim.claimants.splice(index, 1);
  }

  public createClaim() {
    this.$store
      .dispatch('dashboard/createClaim', this.newClaim)
      .then((claim) => {
        const claimRef = claim.ref;
        console.log(claimRef);
        this.$router.push({
          name: 'dashboard.claimDetail.claimants',
          params: { claimRef },
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
</script>

<style lang="scss" scoped>
.claim-new {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: var(--font-size-3);
  h1 {
    font-size: var(--font-size-1);
  }
  h2 {
    font-size: var(--font-size-1);
    margin-top: 60px;
    margin-bottom: 20px;
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
    &__fieldset {
      margin: 40px 0;
    }
    &__actions {
      display: flex;
      .lis-icon {
        color: var(--color-blue-4);
        margin-right: 20px;
        cursor: pointer;
        &:hover {
          color: var(--color-blue-3);
        }
      }
    }
    table {
      width: 100%;
      margin-bottom: 20px;
      tr {
        align-items: center;
      }
      td {
        vertical-align: middle;
        padding: 0 15px;
      }
      thead {
        tr {
          height: 40px;
        }
        td {
          background: var(--color-blue-1);
          color: var(--color-white-1);
          font-weight: 500;
          &:first-child {
            width: 100px;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          &:nth-child(2) {
            width: 100px;
          }
          &:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
      }
      tbody {
        tr {
          height: 60px;
        }
        td {
          border-bottom: 1px solid var(--color-light-1);
          position: relative;
        }
      }
    }
  }
}
</style>

