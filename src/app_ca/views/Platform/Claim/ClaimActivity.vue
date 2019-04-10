<template>
  <div class="claim-activity">
    <div class="claim-activity__controls">
      <lis-button type="primary" icon="message-draw" text="Request information" @click="setModalWindow('request-information')"/>
      <lis-button type="primary" icon="pencil" text="Change status" @click="setModalWindow('change-status')"/>
      <lis-button type="primary" icon="account" text="Assign adjuster" @click="setModalWindow('assign-adjuster')"/>
    </div>
    <div class="claim-activity__log">
      <div class="claim-activity__log__item" v-for="log in claimLog" :key="log.id">
        <div class="claim-activity__log__item__meta">{{ log.time_created }}</div>
        <div
          class="claim-activity__log__item__meta"
        >{{ `${log.created_by.first_name} ${log.created_by.last_name}` }}</div>
        <div class="claim-activity__log__item__content">
          <template v-if="log.type === 'STATUS_CHANGE'">
            <p>{{ log.status.name }}</p>
          </template>

          <template v-if="log.type === 'ADJUSTER_CHANGE'">
            <p>Adjuster
              <router-link
                :to="{name: 'adjusters.detail'}"
              >{{ `${log.adjuster.first_name} ${log.adjuster.last_name}` }}</router-link> was assigned to claim
            </p>
          </template>

          <template v-if="log.type === 'INFORMATION_REQUEST'">
            <p>Information requested from
              <router-link
                :to="{name: 'claimants.detail'}"
              >{{ `${log.information_request.claimant_name}` }}</router-link>
            </p>
            <div class="claim-activity__log__item__content__info-request">
              <div
                v-for="type in log.information_request.information_request_types"
                :key="type.id"
                :class="{'request-done': type.done}"
              >
                <lis-icon :name="type.done ? 'checkbox-marked' : 'checkbox-blank-outline'"/>
                <span>{{ type.name }}</span>
              </div>
            </div>
          </template>
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
export default class ClaimDetails extends Vue {
  public claimLog: any[] = [
    {
      id: 3,
      time_created: '2019-02-21 14:05:13',
      created_by: {
        id: 7,
        first_name: 'Jonathan',
        last_name: 'Salmon',
      },
      type: 'INFORMATION_REQUEST',
      information_request: {
        id: 10,
        claimant_name: 'Michael Dillan',
        information_request_types: [
          {
            id: 1,
            name: 'Driver\'s license',
            done: 1,
          },
          {
            id: 2,
            name: 'Email address',
            done: 0,
          },
        ],
      },
    },
    {
      id: 2,
      time_created: '2019-02-20 14:05:13',
      created_by: {
        id: 7,
        first_name: 'Jonathan',
        last_name: 'Salmon',
      },
      type: 'ADJUSTER_CHANGE',
      adjuster: {
        id: 7,
        first_name: 'Jonathan',
        last_name: 'Salmon',
      },
    },
    {
      id: 1,
      time_created: '2019-02-20 14:05:13',
      created_by: {
        id: 7,
        first_name: 'Jonathan',
        last_name: 'Salmon',
      },
      type: 'STATUS_CHANGE',
      status: {
        id: 1,
        name: 'Claim opened',
      },
    },
  ];

  // @Prop({ type: Object }) private claim!: any;

  public setModalWindow(type: string | null) {
    this.$store.dispatch('dashboard/setModalWindow', type);
  }
}
</script>

<style lang="scss" scoped>
.claim-activity {
  max-width: 1200px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: inherit;
  &__controls {
    display: flex;
    align-items: center;
    margin-bottom: 35px;
    .lis-button {
      margin-right: 20px;
    }
  }
  &__log {
    width: 100%;
    border: 2px solid var(--color-blue-5);
    border-radius: 6px;
    &__item {
      display: flex;
      justify-content: space-between;
      padding: 30px;
      &__meta {
        max-width: 180px;
        flex: 1;
        font-size: var(--font-size-4);
      }
      &__content {
        flex: 1;
        font-size: var(--font-size-2);
        max-width: 400px;
        a {
          text-decoration: none;
          color: var(--color-blue-3);
          font-weight: 500;
          &:hover {
            color: var(--color-blue-3-hover);
          }
        }
        &__info-request {
          background: var(--color-blue-5);
          padding: 20px;
          font-size: var(--font-size-4);          
          border-radius: 6px;
          font-weight: 500;
          margin-top: 20px;
          & > div {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
            .lis-icon {
              width: 14px;
              height: 14px;
              margin-right: 5px;
            }
            &.request-done {
              .lis-icon {
                color: var(--color-green-1);
              }
              text-decoration: line-through;
            }
          }
        }
      }
    }
    &__item + &__item {
      border-top: 2px solid var(--color-blue-5);
    }
  }
}
</style>

