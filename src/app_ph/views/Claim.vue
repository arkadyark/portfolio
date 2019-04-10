<template>
  <div class="claim">
    <div class="claim__no-id" v-if="!claimRef">
      <p class="claim__no-id__title">Claim not found</p>
      <p class="claim__no-id__text">Access this page with the link that was sent to you by text message</p>
    </div>
    <div class="claim__loading" v-else-if="loading">
      <lis-loader color="#434B65"/>
    </div>
    <template v-else-if="claimCase">
      <claim-header/>
      <transition name="fade" mode="out-in">
        <router-view class="claim-view" :claimCase="claimCase"/>
      </transition>
    </template>
  </div>
</template>

<script lang="ts">
import ClaimHeader from '../components/ClaimHeader.vue';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisLoader from '@/components/LisLoader.vue';
import SocketService from '@/app_ca/services/SocketService';
import config from '@/config';

@Component({
  components: {
    ClaimHeader,
    LisLoader,
  },
})
export default class Claim extends Vue {
  public claimCase: any = {};
  public loading: boolean = true;

  @Prop({ type: String }) private claimRef!: string;
  @Prop({ type: String }) private caseId!: string;

  @Watch('caseId', { immediate: true })
  public onCaseIdChanged(val: string) {
    if (val == null) {
      return false;
    }

    if (this.claimRef) {
      this.getCase();
    }
  }

  public created() {
    SocketService.init(config.ws)
    .then((socket: any) => {
      socket.on('server_message', (data: any) => {
        this.$root.$emit('addMessage', data);
      });

      socket.on('chat_history', (data: any) => {
        this.$root.$emit('setChatHistory', data);
      });

      socket.on('reconnect', (data: any) => {
        console.log('Socket reconnected');
        this.$root.$emit('joinRoom');
      });
    });
  }

  public getCase() {
    ApiService.get(`case/${this.claimRef}/${this.caseId}`)
      .then((response) => {
        console.log(response);
        this.claimCase = response.data;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.claim {
  display: flex;
  height: 100%;
  width: 100%;
  &__no-id {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 40px;
    background: var(--color-blue-5);
    &__title {
      font-size: var(--font-size-1);
      margin-bottom: 40px;
    }
  }
  &__loading {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
}
.claim-view {
  width: 100%;
  margin-top: 60px;
}
</style>
