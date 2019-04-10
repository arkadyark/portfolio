<template>
  <div class="chat-form">
    <div v-if="loading" class="chat-form__loading">
      <lis-loader color="#434B65"/>
    </div>
    <template v-else>
      <lis-chat-wrapper :messages="messages">
        <template slot="after-chat">
          <req-info-driver-license v-if="reqType && reqType.type === 'DRIVERS_LICENSE'"/>

          <!-- NO REQUEST -->
          <template v-if="reqInfo == null && messages.length === 0">
            <div class="chat-form__no-input">
              <p>No information Requested</p>
            </div>
            <p
              class="chat-form__subtext"
            >At times, the adjudicator of your claim may require more information from you in order to best access this situation. If so, you will be notified through the messages that will appear here.</p>
          </template>
        </template>
      </lis-chat-wrapper>
      <chat-input
        v-if="!uploading"
        @sendMessage="sendUserMessage"
        @sendFiles="sendUserFile"
        :reqType="reqType"
      />
      <div v-if="uploading" class="chat-form__uploading">
        <lis-loader color="#434B65"/>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import ReqInfoDriverLicense from './ReqInfoTypes/ReqInfoDriverLicense.vue';
import ChatInput from './ChatInput.vue';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisLoader from '@/components/LisLoader.vue';
import LisChatWrapper from '@/components/LisChatWrapper.vue';
import SocketService from '@/app_ca/services/SocketService';

const reqTypes: any = {
  1: {
    type: 'DRIVERS_LICENSE',
    input_type: 'file_upload_single',
  },
  2: {
    type: 'EMAIL',
    input_type: 'email',
  },
  3: {
    type: 'PHONE_NUMBER',
    input_type: 'phone_number',
  },
  4: {
    type: 'VIN',
    input_type: 'text',
  },
  5: {
    type: 'CUSTOM_MESSAGE',
    input_type: 'text',
  },
};

@Component({
  components: {
    ReqInfoDriverLicense,
    ChatInput,
    LisLoader,
    LisChatWrapper,
  },
})
export default class ChatForm extends Vue {
  public loading: boolean = true;
  public uploading: boolean = false;
  public messages: any[] = [];

  @Prop({ type: Object }) private claimCase!: any;

  @Watch('claimCase', { immediate: true, deep: true })
  public onClaimChanged(val: any, oldVal: any) {
    if (val == null || val.ref == null) {
      return false;
    }

    this.joinChat(val.id);
  }

  public created() {
    this.$root.$on('setChatHistory', (data: any) => {
      this.messages = data.messages;
      this.loading = false;
    });

    this.$root.$on('addMessage', (data: any) => {
      if (data.author === 'bot') {
        const tempMessage = data;
        const tempIndex = this.messages.length;
        this.messages.push({
          author: 'bot',
          type: 'typing',
        });
        setTimeout(() => {
          this.$set(this.messages, tempIndex, tempMessage);
        }, 2000);
      } else {
        this.messages.push(data);
      }
    });

    this.$root.$on('joinRoom', () => {
      if (this.claimCase) {
        this.joinChat(this.claimCase.id);
      }
    });
  }

  public beforeDestroy() {
    if (this.claimCase.id) {
     this.leaveChat(this.claimCase.id);
    }

    this.$root.$off('setChatHistory');

    this.$root.$off('addMessage');

    this.$root.$off('joinRoom');
  }

  get reqInfo() {
    if (this.claimCase) {
      return this.claimCase.info_request_case[this.claimCase.info_request_case.length - 1];
    }
    return null;
  }

  get reqType() {
    if (this.reqInfo && this.reqInfo.req_type) {
      return reqTypes[this.reqInfo.req_type.id];
    }
  }

  public joinChat(caseId: string) {
    SocketService.joinRoom(caseId);
  }

  public leaveChat(caseId: string) {
    SocketService.leaveRoom(caseId);
  }

  public sendUserMessage(message: any) {
    const reqInfoId = this.reqInfo && this.reqInfo.id;
    if (!reqInfoId) {
      // this.sendFaqMessage(message);
      this.sendChatMessage(message);
    } else {
      this.sendInfoMessage(message);
    }

    this.messages.push({
      id: this.messages.length + 1,
      author: 'user',
      type: 'text',
      message,
      time: new Date(),
    });
  }

  public sendChatMessage(message: any) {
    // this.$socket.emit('client_message', {
    //   author: "user",
    //   type: "text",
    //   message: message,
    //   room: this.claim.id
    // })
    SocketService.emit('client_message', {
      case_id: this.claimCase.id,
      author: 'user',
      type: 'text',
      message,
      room: this.claimCase.id,
    });
  }

  // sendFaqMessage(message: any) {
  //   ApiService.post(`message/chatBot`, {
  //     claim_id: this.claim.id,
  //     message: message
  //   })
  //     .then(response => {
  //       console.log(response);
  //     })
  //     .catch(err => {})
  //     .finally(() => {
  //       this.getRequestedInfo(this.claim.id);
  //     });
  // }

  public sendInfoMessage(message: any) {
    ApiService.post(`claim/${this.claimCase.ref}/${this.claimCase.id}/submit-info`, {
      type: 'text',
      message,
    })
      .then((response) => {
        console.log(response);
        // this.reqInfo = response.data;
      })
      .finally(() => {
        // this.getRequestedInfo(this.claim.id);
      });
  }

  public sendUserFile(files: any) {
    const reqInfoId = this.reqInfo.id;
    if (!reqInfoId) { return; }
    this.uploading = true;

    const formData = new FormData();
    formData.append('type', 'image');
    formData.append('message', '');
    formData.append('file', files[0]);

    ApiService.post(`claim/${this.claimCase.ref}/${this.claimCase.id}/submit-info`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log(response);
        // this.reqInfo = response.data;
      })
      .finally(() => {
        // this.getRequestedInfo(this.claim.id);
        this.uploading = false;
      });
  }

  // getRequestedInfo(claimId: string) {
  //   ApiService.get(`claim/${claimId}/request-info`)
  //     .then(response => {
  //       console.log(response);
  //       this.reqInfo = response.data.req_info;
  //       this.messages = response.data.messages;
  //       // const claim = response.data[0];
  //     })
  //     .catch(err => {})
  //     .finally(() => {
  //       this.loading = false;
  //     });
  // }

  // getMessages (claimId: string) {
  //   ApiService.get(`claim/${claimId}/messages`)
  //     .then(response => {
  //       console.log(response);
  //       this.messages = response.data
  //       // const claim = response.data[0];
  //     })
  //     .catch(err => {})
  //     .finally(() => {
  //       this.loading = false;
  //     })
  // }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

.chat-form {
  height: calc(100% - 60px);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  &__no-input {
    font-size: var(--font-size-1);
    padding: 20px;
    border-radius: 10px;
    background: var(--color-blue-5);
  }
  &__subtext {
    padding: 20px;
    font-size: var(--font-size-3);
    line-height: var(--font-size-2);
  }
  &__loading {
    flex: 1;
    display: flex;
    align-items: center;
  }
  &__uploading {
    padding: 30px 0;
  }
}

@media screen and (min-width: $breakpoint-mobile) {
  .chat-form {
    border-radius: 5px;
    overflow: hidden;
    height: 80%;
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid var(--color-light-1);
    box-shadow: 0 2px 20px var(--color-light-1);
  }
}
</style>

