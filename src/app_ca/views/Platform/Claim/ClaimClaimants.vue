<template>
  <div class="claim-claimants">
    <div class="claim-claimants__columns">
      <div class="claim-claimants__columns__claimants-menu">
        <a
          href="#"
          class="claim-claimants__columns__claimants-menu__item"
          :class="{'claim-claimants__columns__claimants-menu__item--active': c.id === selectedCase.id}"
          v-for="c in selectedClaim.cases"
          @click="selectCase(c.id)"
          :key="c.id"
        >
          <p>
            <b>{{ `${c.claimants.first_name} ${c.claimants.last_name}` }}</b>
          </p>
          <p v-if="c.claimants.insured">Insured</p>
        </a>
      </div>

      <div class="claim-claimants__columns__claimant-detail" v-if="selectedCase">
        <div class="claim-claimants__columns__claimant-detail__header">
          <span>{{ `${selectedCase.claimants.first_name} ${selectedCase.claimants.last_name}` }}</span>
          <lis-button type="primary" @click="redirectToChat()" text="Chat"/>          
        </div>
        <table class="claim-claimants__columns__claimant-detail__info-table">
          <tr v-if="selectedCase.claimants.insured">
            <td>
              <b>Policy Number</b>
            </td>
            <td>{{ selectedCase.claimants.policy_number }}</td>
          </tr>
          <tr>
            <td>
              <b>Phone Number</b>
            </td>
            <td>{{ selectedCase.claimants.phone_number }}</td>
          </tr>
          <tr>
            <td>
              <b>Email</b>
            </td>
            <td>{{ selectedCase.claimants.email }}</td>
          </tr>
          <tr>
            <td>
              <b>Address</b>
            </td>
            <td>{{ selectedCase.claimants.address }}</td>
          </tr>
        </table>

        <label class="label label--margin">Uploaded files</label>
        <div class="claim-claimants__columns__claimant-detail__files">
          <div
            class="claim-claimants__columns__claimant-detail__files__item"
            v-for="(file, index) in selectedCase.images"
            :key="file.id"
          >
            <lis-file-thumbnail
              @openImage="openImage"
              :clickable="true"
              :key="file.id"
              url-field="image_url"
              :file="file"
            />
            <div>
              <p>{{ file.name || `${index + 1}.jpg` }}</p>
              <p class="claim-claimants__columns__claimant-detail__files__item__time">{{ file.time_created || 'Feb 12, 2019' }}</p>
            </div>
          </div>
          <div v-if="!selectedCase.images.length">
            <p>-</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import { mapGetters } from "vuex";
import ApiService from '@/app_ca/services/ApiService.ts';
import LisIcon from '@/components/LisIcon.vue';
import LisLoader from '@/components/LisLoader.vue';
import LisButton from '@/components/LisButton.vue';
import LisFileThumbnail from '@/components/LisFileThumbnail.vue';
import LisChatMessage from '@/components/LisChatMessage.vue';
import LisChatWrapper from '@/components/LisChatWrapper.vue';
import config from '@/config/index.ts';

@Component({
  components: {
    LisLoader,
    LisButton,
    LisIcon,
    LisFileThumbnail,
    LisChatMessage,
    LisChatWrapper,
  },
})
export default class ClaimClaimants extends Vue {
  get selectedClaim() {
    return this.$store.state.dashboard.claimDetail;
  }

  get selectedCase() {
    return this.$store.state.dashboard.caseDetail;
  }

  public created() {
    if (this.selectedClaim) {
      const firstCase = this.selectedClaim.cases[0];
      if (firstCase) {
        this.selectCase(firstCase.id);
      }
    }
  }

  public openImage(imageSrc: string) {
    this.$store.dispatch('dashboard/openModalImage', imageSrc);
  }

  public selectCase(caseId: string|number) {
    this.$store.dispatch('dashboard/selectCase', caseId);
  }

  public redirectToChat() {
    if (this.selectedCase) {
      this.$router.push({
        name: 'chats',
        params: {
          claimRef: this.selectedCase.ref,
          caseId: this.selectedCase.id,
        },
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.claim-claimants {
  max-width: 1200px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: inherit;
  &__columns {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    height: 100%;
    .label {
      display: block;
      font-weight: 500;
      &--margin {
        margin-bottom: 10px;
      }
    }    
    &__claimants-menu {
      box-shadow: 0 2px 4px var(--color-light-1);
      border-radius: 6px;
      overflow: hidden;
      background: var(--color-white-1);
      flex: 1;
      max-width: 250px;
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

    &__claimant-detail {
      margin-left: 50px;
      max-width: 500px;
      flex: 1;
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: var(--font-size-1);
          font-weight: 500;
        }
      }
      &__info-table {
        width: 100%;
        margin-top: 40px;
        margin-bottom: 40px;
        border-collapse: separate;
        tr:first-child td:first-child {
          border-top-left-radius: 6px;
        }
        tr:first-child td:last-child {
          border-top-right-radius: 6px;
        }
        tr:last-child td:first-child {
          border-bottom-left-radius: 6px;
        }
        tr:last-child td:last-child {
          border-bottom-right-radius: 6px;
        }
        td {
          border: 2px solid var(--color-blue-5);
          padding: 15px;
        }
        td + td {
          border-left: none;
        }
        tr + tr {
          td {
            border-top: none;
          }
        }
      }
      &__files {
        width: 100%;
        box-sizing: border-box;
        border-radius: 6px;
        border: 2px solid var(--color-blue-5);
        padding: 15px;
        &__item {
          display: flex;
          align-items: center;
          .lis-file-thumbnail {
            margin-right: 20px;
            height: 40px;
            width: 40px;
          }
          &__time {
            color: var(--color-blue-4);
            margin-top: 4px;
          }
        }
        &__item + &__item {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid var(--color-light-1);
        }
      }
    }
  }
}
</style>

