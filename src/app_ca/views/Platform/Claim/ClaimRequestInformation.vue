<template>
  <div class="claim-request-information" @click.stop="() => {}">
    <div class="claim-request-information__wrapper">
      <div class="column">
        <label class="label label--margin">From</label>
        <div class="claim-request-information__wrapper__claimants-menu">
          <a
            href="#"
            class="claim-request-information__wrapper__claimants-menu__item"
            :class="{'claim-request-information__wrapper__claimants-menu__item--active': index === selectedCaseIndex}"
            v-for="(c, index) in claim.cases"
            @click="selectActiveCase(index)"
            :key="c.id"
          >
            <p>
              <b>{{ `${c.claimants.first_name} ${c.claimants.last_name}` }}</b>
            </p>
            <p v-if="c.claimants.insured">Insured</p>
          </a>
        </div>
      </div>
      <div class="column">
        <label class="label label--margin">Information type</label>
        <div class="claim-request-information__wrapper__data">
          <div
            class="claim-request-information__wrapper__data__row"
            :class="{'disabled': isRequested(data)}"
            v-for="(data, i) in requestPackage"
            :key="i"
            @click="switchValue(data)"
          >
            <lis-icon name="account-clock" size="small" v-if="isRequested(data)"/>
            <input type="checkbox" v-else v-model="data.checked">
            <span>{{ data.text }}</span>
          </div>
          <div class="claim-request-information__wrapper__data__custom-textarea" v-if="requestPackage[4].checked" >
            <textarea v-model="customMessage"></textarea>
          </div>
        </div>
      </div>
    </div>
    <lis-loader v-if="loading" color="#0057FF"/>
    <lis-button @click="save" v-else type="primary" text="Send request"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// import { mapGetters } from "vuex";
import { cloneDeep } from 'lodash';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisIcon from '@/components/LisIcon.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisButton from '@/components/LisButton.vue';
import LisSwitch from '@/components/LisSwitch.vue';

const REQUEST_PACKAGE = [
  {
    info_request_type_id: 1,
    text: 'Driver\'s licence',
    checked: false,
  },
  {
    info_request_type_id: 2,
    text: 'Email address',
    checked: false,
  },
  {
    info_request_type_id: 3,
    text: 'Phone number',
    checked: false,
  },
  {
    info_request_type_id: 4,
    text: 'VIN number',
    checked: false,
  },
  {
    info_request_type_id: 5,
    text: 'Custom message',
    checked: false,
  },
];

@Component({
  components: {
    LisIcon,
    LisLoader,
    LisButton,
    LisSwitch,
  },
})
export default class ClaimRequestInformation extends Vue {
  public selectedCaseIndex: number = 0;
  public loading: boolean = false;
  public message: string = '';
  public customMessage: string = '';
  public requestPackage: any[] = cloneDeep(REQUEST_PACKAGE);

  get claim() {
    return this.$store.state.dashboard.claimDetail;
  }

  get selectedCase() {
    return this.claim.cases[this.selectedCaseIndex];
  }

  @Watch('selectedCase')
  public updateRequestPackage(val: any) {
    // Reset request package when selected claimant changes
    this.requestPackage = cloneDeep(REQUEST_PACKAGE);
  }

  public switchValue(data: any) {
    if (this.isRequested(data)) { return; }
    data.checked = !data.checked;
  }

  public selectActiveCase(caseIndex: number) {
    this.selectedCaseIndex = caseIndex;
  }

  public save() {
    this.loading = true;
    const reqTypes = this.requestPackage
      .filter((type) => type.checked)
      .map((type) => {
        return type.info_request_type_id;
      });

    this.$store
      .dispatch('dashboard/sendInformationRequest', {
        claimRef: this.selectedCase.ref,
        claimId: this.selectedCase.id,
        reqTypes,
        customMessage: this.customMessage,
      })
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

  public isRequested(data: any) {
    if (this.selectedCase && this.selectedCase.info_request_case) {
      return this.selectedCase.info_request_case.some((rq: any) => {
        return (
          rq.info_request_type_id === data.info_request_type_id && !rq.done
        );
      });
    } else {
      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
.claim-request-information {
  .label {
    display: block;
    font-weight: 500;
    &--margin {
      margin-bottom: 10px;
    }
  }
  p {
    font-size: var(--font-size-2);
  }
  &__wrapper {
    display: flex;
    align-items: flex-start;
    .column + .column {
      margin-left: 30px;
    }
    &__claimants-menu {
      box-shadow: 0 2px 4px var(--color-light-1);
      border-radius: 6px;
      overflow: hidden;
      background: var(--color-white-1);
      flex: 1;
      min-width: 200px;
      max-width: 250px;
      width: 100%;
      height: 100%;
      &__item {
        text-decoration: none;
        padding: 16px 20px;
        display: block;
        border-bottom: 1px solid var(--color-light-1);
        p:first-child {
          font-size: var(--font-size-3);
        }
        p:nth-child(2) {
          margin-top: 3px;
          font-size: var(--font-size-4);
        }
        &:not(&--active) {
          p {
            color: var(--color-blue-3);
          }
        }
        &--active {
          background: var(--color-blue-5);
          p {
            color: var(--color-blue-2);
          }
        }
        &:hover {
          background: var(--color-blue-5);
        }
      }
    }
    &__data {
      border-radius: 10px;
      background: var(--color-blue-5);
      min-width: 300px;
      max-width: 400px;
      &__row {
        cursor: pointer;
        padding: 6px 15px;
        display: flex;
        align-items: center;
        font-size: var(--font-size-3);
        font-weight: 500;
        height: 40px;
        &.disabled {
          opacity: 0.5;
        }
        .lis-icon,
        input {
          margin: 0 10px 0 0;
          width: 20px;
        }
      }
      &__row + &__row {
        border-top: 1px solid var(--color-light-1);
      }
      &__custom-textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 15px;
        textarea {
          width: 100%;
          border: none;
          padding: 0;
          margin: 0;
          border-radius: 5px;
          min-height: 100px;
          padding: 10px;
          box-sizing: border-box;
          font-size: var(--font-size-3);
        }
      }
    }
  }
}
</style>

