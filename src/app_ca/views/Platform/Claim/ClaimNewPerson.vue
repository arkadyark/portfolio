<template>
  <div class="claim-new-person">
    <div class="claim-new-person__box">
      <fieldset class="claim-new-person__box__fieldset">
        <lis-input v-model="newPerson.first_name" placeholder="First name"/>
      </fieldset>
      <fieldset class="claim-new-person__box__fieldset">
        <lis-input v-model="newPerson.last_name" placeholder="Last name"/>
      </fieldset>
      <fieldset class="claim-new-person__box__fieldset">
        <lis-input v-model="newPerson.phone_number" placeholder="Phone number"/>
      </fieldset>
      <fieldset class="claim-new-person__box__fieldset">
        <lis-input v-model="newPerson.email" placeholder="Email"/>
      </fieldset>
      <fieldset class="claim-new-person__box__fieldset">
        <lis-input v-model="newPerson.address" placeholder="Address"/>
      </fieldset>
      <fieldset class="claim-new-person__box__fieldset">
        <label class="label label--checkbox">
          <input type="checkbox" v-model="newPerson.insured">
          <span>Is insured</span>
        </label>
      </fieldset>
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
import LisInput from '@/components/LisInput.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisButton from '@/components/LisButton.vue';
import LisSwitch from '@/components/LisSwitch.vue';
import LisDropdown from '@/components/LisDropdown.vue';

@Component({
  components: {
    LisIcon,
    LisLoader,
    LisInput,
    LisButton,
    LisSwitch,
    LisDropdown,
  },
})
export default class ClaimChangeStatus extends Vue {
  public loading: boolean = false;
  public newPerson: any = {
    phone_number: '',
    first_name: '',
    last_name: '',
    insured: 0,
    email: '',
    address: '',
  };

  public save() {
    this.$root.$emit('addClaimant', this.newPerson);
    this.$store.dispatch('dashboard/setModalWindow', null);
  }
}
</script>

<style lang="scss" scoped>
.claim-new-person {
  .label {
    display: block;
    font-weight: 500;
    &--checkbox {
      display: flex;
      align-items: center;
      color: var(--color-blue-2);
      margin: 10px 0 20px;
      border-radius: 10px;
      background: var(--color-blue-5);
      height: 40px;
      cursor: pointer;
      padding: 6px 15px;
      box-sizing: border-box;
    }
    &--margin {
      margin-bottom: 10px;
    }
  }
  &__box {
    margin-bottom: 10px;
    &__fieldset {
      margin-bottom: 20px;
    }
    input[type="checkbox"] {
      margin-right: 5px;
      width: 20px;
    }
  }
}
</style>

