<template>
  <div class="claim-list">
    <div class="claim-list__view">
      <div class="claim-list__view__filters">
        <div class="claim-list__view__filters__search">
          <input type="text" placeholder="Search by keywords (i.e. Toronto)">
          <lis-icon name="magnify"/>
        </div>
        <div class="claim-list__view__filters__status">
          <lis-dropdown
            :value="filter.status"
            :label="mapFilterStatusToString"
            :options="filterStatuses"
            @select="updateFilter"
          />
        </div>
        <lis-button
          class="claim-list__view__filters__new-claim"
          type="white"
          @click="$router.push({name: 'dashboard.claimNew'})"
          text="Create claim"
        />
      </div>
      <template v-if="areClaimsLoading">
        <lis-loader color="#434B65"/>
      </template>
      <template v-else>
        <table>
          <thead>
            <tr>
              <td>Claim ID</td>
              <td>Type</td>
              <td>Status</td>
              <td>Policy Number</td>
              <td>Insured Name</td>
              <td>Files</td>
            </tr>
          </thead>
          <tbody v-if="filteredClaims.length">
            <tr
              class="claim-list__view__item"
              v-for="claim in claimsWithInsured"
              :key="claim.ref"
              @click="openClaim(claim.ref)"
            >
              <td>{{ claim.ref }}</td>
              <td>
                <span
                  class="claim-list__view__item__claim-type"
                  :class="`claim-list__view__item__claim-type--${claim.claim_type_id}`"
                >
                  <b>{{ getClaimType(claim.claim_type_id) }}</b>
                  <lis-icon
                    name="alert-circle-outline"
                    size="small"
                    v-if="claim.injuries"
                    :title="'This claim has injuries'"
                    v-tippy
                  />
                </span>
              </td>
              <td>
                <span
                  class="claim-list__view__item__status"
                >{{ getClaimLastStatus(claim) }}</span>
              </td>
              <td>{{ claim.insuredCase && claim.insuredCase.claimants.policy_number }}</td>
              <td>
                <span
                  v-if="claim.insuredCase"
                >{{ claim.insuredCase.claimants.first_name }} {{ claim.insuredCase.claimants.last_name }}</span>
              </td>
              <td class="claim-list__view__item__images" @click.stop="() => {}">
                <span
                  v-if="claim.insuredCase && claim.insuredCase.images.length === 0"
                  class="claim-list__view__item__images__none"
                >0</span>
                <template v-else>
                  <lis-file-thumbnail
                    @openImage="openImage"
                    :clickable="true"
                    v-for="(file, i) in transformImages(claim.images)"
                    :key="i"
                    :file="file"
                  />
                </template>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          class="claim-list__view__no-results"
          v-if="filter.applied && !filteredClaims.length"
        >0 results matching your criteria</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';
import config from '@/config/index.ts';
import LisLoader from '@/components/LisLoader.vue';
import LisIcon from '@/components/LisIcon.vue';
import LisDropdown from '@/components/LisDropdown.vue';
import LisButton from '@/components/LisButton.vue';
import LisFileThumbnail from '@/components/LisFileThumbnail.vue';

const claimTypes: any = {
  1: 'Auto',
  2: 'Property',
};

@Component({
  components: {
    LisLoader,
    LisFileThumbnail,
    LisDropdown,
    LisIcon,
    LisButton,
  },
})
export default class ClaimList extends Vue {
  public filter: any = {
    applied: false,
    status: 'all',
  };

  get filteredClaims() {
    let claims = Object.values(this.$store.state.dashboard.claims);
    if (this.filter.status !== 'all') {
      claims = claims.filter(
        (claim: any) => claim.cases.some((claimCase: any) => {
          return claimCase.case_status_id === this.filter.status;
        }),
      );
    }

    return claims;
  }

  get claimsWithInsured() {
    return this.filteredClaims.map((claim: any) => {
      claim.insuredCase = claim.cases.find((claimCase: any) => {
        return claimCase.insuredCase === true;
      });
      return claim;
    });
  }

  get areClaimsLoading() {
    return this.$store.state.dashboard.loading;
  }

  get possibleClaimStatuses() {
    const { claimStatuses } = this.$store.state.dashboard.settings;
    return claimStatuses.map((cs: any) => cs.id);
  }

  get filterStatuses() {
    return [...['all'], ...this.possibleClaimStatuses];
  }

  public created() {
    this.$store.dispatch('dashboard/getAllClaims');
  }

  public updateFilter(status: number | string) {
    this.filter.applied = true;
    this.filter.status = status;
  }

  public mapFilterStatusToString(statusId: any) {
    const { claimStatuses } = this.$store.state.dashboard.settings;
    const status = claimStatuses.find((cs: any) => cs.id === statusId);
    return status ? status.name : 'All';
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

  public transformImages(images: any[]) {
    if (!images) {
      return [];
    }
    return images.map((img: any) => {
      return {
        url: img.image_url,
      };
    });
  }

  public openImage(imageSrc: string) {
    this.$store.dispatch('dashboard/openModalImage', imageSrc);
  }

  public openClaim(claimRef: string) {
    this.$router.push({
      name: 'dashboard.claimDetail.claimants',
      params: { claimRef },
    });
  }

  public getClaimType(typeId: number) {
    return claimTypes[typeId];
  }
}
</script>

<style lang="scss" scoped>
.claim-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  // background: var(--color-blue-5);
  &__view {
    background: var(--color-white-1);
    flex: 1;
    padding: 40px;
    font-size: var(--font-size-3);
    table {
      width: 100%;
      cursor: pointer;
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
          &:hover {
            color: var(--color-blue-3);
            cursor: pointer;
          }
        }
        td {
          border-bottom: 1px solid var(--color-light-1);
          position: relative;
        }
      }
    }
    &__no-results {
      font-size: var(--font-size-2);
      padding-top: 20px;
    }
    &__filters {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 40px;
      &__search {
        display: flex;
        background: var(--color-blue-5);
        height: 40px;
        padding: 0 15px;
        border-radius: 20px;
        width: 300px;
        justify-content: space-between;
        margin-right: 40px;
        .lis-icon {
          color: var(--color-blue-4);
        }
        input {
          background: none;
          border: none;
          width: 100%;
          font-size: var(--font-size-3);
          color: var(--color-blue-2);
          &::-webkit-input-placeholder {
            /* Chrome/Opera/Safari */
            color: var(--color-blue-4);
          }
          &::-moz-placeholder {
            /* Firefox 19+ */
            color: var(--color-blue-4);
          }
          &:-ms-input-placeholder {
            /* IE 10+ */
            color: var(--color-blue-4);
          }
          &:-moz-placeholder {
            /* Firefox 18- */
            color: var(--color-blue-4);
          }
        }
      }
      &__status {
        &__label {
          font-size: var(--font-size-4);
          line-height: var(--font-size-3);
          margin-bottom: 3px;
        }
      }
      &__new-claim {
        margin-left: auto;
      }
    }
    &__item {
      $item: &;
      &:hover {
        color: var(--color-blue-3);
      }
      &__claim-type {
        display: flex;
        align-items: center;
        &--1 {
          b {
            background: var(--color-claim-type-1);
          }
        }
        &--2 {
          b {
            background: var(--color-claim-type-2);
          }
        }
        b {
          padding: 5px 10px;
          border-radius: 30px;
          color: var(--color-white-1);
          margin-right: 10px;
        }
        .lis-icon {
          color: red;
        }
      }
      &__status {
        display: flex;
        align-items: center;
        .lis-icon {
          margin-right: 10px;
        }
      }
      &__images {
        max-width: 300px;
        overflow: hidden;
        white-space: nowrap;
        .lis-file-thumbnail {
          height: 30px;
          width: 30px;
          margin: 0 5px 0 0;
          display: inline-block;
        }
        &__none {
          width: 30px;
          height: 30px;
          background: var(--color-blue-5);
          display: inline-block;
          line-height: 30px;
          text-align: center;
          color: var(--color-blue-4);
          border-radius: 4px;
        }
      }
    }
  }
}
</style>

