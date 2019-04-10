<template>
  <div class="claim-assign-adjuster">
    <label class="label label--margin">Adjuster</label>
    <div class="claim-assign-adjuster__box">
      <lis-dropdown
        :value="newAdjuster"
        :label="mapAdjusterToName"
        :options="possibleAdjusters"
        @select="selectNewAdjuster"
        :searchable="true"
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
export default class ClaimAssignAdjuster extends Vue {
  public loading: boolean = false;
  public newAdjuster: number = 1;
  public adjusters: any = {
    1: {
      first_name: 'Alex',
      last_name: 'Gittin',
    },
    2: {
      first_name: 'Peter',
      last_name: 'Jackson',
    },
    3: {
      first_name: 'Ivan',
      last_name: 'Petrovich',
    },
  };

  get claim() {
    return this.$store.state.dashboard.claimDetail;
  }

  get possibleAdjusters() {
    return [1, 2, 3];
  }

  public mapAdjusterToName(adjusterId: number) {
    const adjuster = this.adjusters[adjusterId];
    return `${adjuster.first_name} ${adjuster.last_name}`;
  }

  public selectNewAdjuster(adjusterId: number) {
    console.log(adjusterId);
    this.newAdjuster = adjusterId;
  }

  public save() {
    this.loading = true;
    // const claimId = this.claim.id;
    // const claimStatusId = this.newStatus;
    // this.$store
    //   .dispatch("dashboard/updateClaimStatus", { claimId, claimStatusId })
    //   .then(() => {
    //     this.$store.dispatch("dashboard/setModalWindow", null);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   })
    //   .finally(() => {
    //     this.loading = false;
    //   });
  }
}
</script>

<style lang="scss" scoped>
.claim-assign-adjuster {
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

