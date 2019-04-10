<template>
  <div class="chats">
    <div class="chats__column">
      <div class="chats__column__claim" v-for="(claim) in claims" :key="claim.ref">
        <p class="chats__column__claim__ref">{{ claim.ref }}</p>
        <router-link
          :to="{name: 'chats', params: {claimRef: claim.ref, caseId: claimCase.id}}"
          class="chats__column__claim__case"
          :active-class="'chats__column__claim__case--active'"
          v-for="claimCase in claim.cases"
          :key="claimCase.id"
        >{{ `${claimCase.claimants.first_name} ${claimCase.claimants.last_name}` }}</router-link>
      </div>
    </div>

    <div class="chats__chat-container" v-if="selectedCase">
      <div class="chats__chat-container__header">
        <div class="chats__chat-container__header__left">
          <label class="label">Claim</label>
          <br>
          <a>{{ selectedCase.ref }}</a>
        </div>
        <div class="chats__chat-container__header__right">
          <label for="label">Insured</label>
          <p>{{ `${selectedCase.claimants.first_name} ${selectedCase.claimants.last_name}` }}</p>
        </div>
      </div>
      <div class="chats__chat-container__content">
        <transition name="fade">
          <div
            class="chats__chat-container__content__control"
            v-if="selectedCase.chatbot_enabled == 0"
          >
            <lis-button
              type="outline"
              icon="close-circle"
              text="Disconnect from chat"
              @click="enableChatbot"
            />
          </div>
        </transition>
        <lis-chat-wrapper
          v-if="selectedCase"
          :messages="caseMessages"
          :class="{'chatbot-disabled': selectedCase.chatbot_enabled == 0}"
        />
        <div class="chats__chat-container__content__input">
          <textarea-autosize
            rows="1"
            @keydown.native.enter.exact.prevent
            @keyup.native.enter.exact="sendAdjusterMessage"
            @keydown.native.enter.shift.exact="() => {}"
            :max-height="120"
            placeholder="Type here"
            v-model="textMessage"
            class="chats__chat-container__content__input__textarea"
          ></textarea-autosize>
          <button
            class="chats__chat-container__content__input__send-button"
            :class="buttonClass"
            @click="sendAdjusterMessage"
          >
            <lis-icon name="send" size="small"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import LisLoader from '@/components/LisLoader.vue';
import LisIcon from '@/components/LisIcon.vue';
import LisButton from '@/components/LisButton.vue';
import LisDropdown from '@/components/LisDropdown.vue';
import ApiService from '@/app_ca/services/ApiService.ts';
import LisChatWrapper from '@/components/LisChatWrapper.vue';
import SocketService from '@/app_ca/services/SocketService';
// import socketVue from '@/app_ca/socket-io.ts';

@Component({
  components: {
    LisLoader,
    LisIcon,
    LisButton,
    LisDropdown,
    LisChatWrapper,
  },
})
export default class Chats extends Vue {
  public textMessage: string = '';
  // selectedCase: any = {
  //   claim_id: 1,
  //   ref: "AG4253S1",
  //   claimant: {
  //     id: 4,
  //     first_name: "Joseph",
  //     last_name: "Smith",
  //     insured: 0,
  //     policy_number: undefined,
  //     phone_number: "4046066621",
  //     email: "jospeh.smith@gmail.com",
  //     address: "2 Bloor St, Toronto"
  //   },
  //   messages: [],
  //   chatbot_enabled: 0
  // };

  // chats: any[] = [
  //   {
  //     claim_id: 1,
  //     ref: "AG4253S1",
  //     claimant: {
  //       id: 4,
  //       first_name: "Joseph",
  //       last_name: "Smith",
  //       insured: 0,
  //       policy_number: undefined,
  //       phone_number: "4046066621",
  //       email: "jospeh.smith@gmail.com",
  //       address: "2 Bloor St, Toronto"
  //     }
  //   },
  //   {
  //     claim_id: 2,
  //     ref: "885EE124",
  //     claimant: {
  //       id: 4,
  //       first_name: "Calvin",
  //       last_name: "Chang",
  //       insured: 0,
  //       policy_number: undefined,
  //       phone_number: "4046066621",
  //       email: "jospeh.smith@gmail.com",
  //       address: "2 Bloor St, Toronto"
  //     }
  //   }
  // ];

  @Prop({ type: String }) private claimRef!: string;
  @Prop({ type: [String, Number] }) private caseId!: string | number;

  @Watch('claimRef', { immediate: true })
  public claimRefUpdated(val: string) {
    if (val) {
      this.fetchClaim();
    }
  }

  @Watch('caseId', { immediate: true })
  public caseIdUpdated(val: string) {
    if (this.selectedClaim) {
      this.selectCase(val);
    }
  }

  @Watch('selectedCase', { immediate: true })
  public caseChanged(newVal: any, oldVal: any) {
    if (newVal && oldVal && newVal.id === oldVal.id) {
      // Case didn't change, do nothing
      return;
    }
    if (oldVal) {
      SocketService.leaveRoom(oldVal.id);
      this.$store.commit('dashboard/SET_CASE_MESSAGES', []);
    }
    if (newVal) {
      SocketService.joinRoom(newVal.id);
    }
  }

  get isClaimLoading() {
    return this.$store.state.dashboard.loading;
  }

  get claims() {
    return this.$store.state.dashboard.claims;
  }

  get selectedClaim() {
    return this.$store.state.dashboard.claimDetail;
  }

  get selectedCase() {
    return this.$store.state.dashboard.caseDetail;
  }

  get caseMessages() {
    return this.$store.state.dashboard.caseMessages;
  }

  get buttonClass() {
    let btnClass = 'disabled';
    if (this.textMessage.length > 0) {
      btnClass = 'has-text';
    } else {
      btnClass = 'empty';
    }
    return btnClass;
  }

  public created() {
    this.$root.$on('joinRoom', () => {
      if (this.selectedCase.id) {
        SocketService.joinRoom(this.selectedCase.id);
      }
    });

    this.$store.dispatch('dashboard/getAllClaims');
  }

  public beforeDestroy() {
    if (this.selectedCase) {
      SocketService.leaveRoom(this.selectedCase.id);
    }
    this.unselectClaim();
    this.$root.$off('joinRoom');
  }

  public selectCase(caseId: string | number) {
    this.$store.dispatch('dashboard/selectCase', caseId);
  }

  public unselectClaim() {
    this.$store.dispatch('dashboard/unselectClaim');
  }

  public fetchClaim() {
    const claimRef = this.claimRef;
    if (claimRef) {
      this.$store.dispatch('dashboard/getClaimByRef', claimRef).then(() => {
        this.selectCase(this.caseId);
      });
    }
  }

  public enableChatbot() {
    SocketService.emit('enable_chatbot', { room: this.selectedCase.id });
  }

  public sendAdjusterMessage() {
    this.$store.dispatch('dashboard/addCaseMessage', {
      case_id: this.selectedCase.id,
      id: this.caseMessages.length + 1,
      author: 'agent',
      type: 'text',
      message: this.textMessage,
      time: new Date(),
    });

    SocketService.emit('client_message', {
      case_id: this.selectedCase.id,
      author: 'agent',
      type: 'text',
      message: this.textMessage,
      room: this.selectedCase.id,
    });

    this.textMessage = '';
  }

  public setModalWindow(type: string | null) {
    this.$store.dispatch('dashboard/setModalWindow', type);
  }
}
</script>

<style lang="scss" scoped>
.chats {
  min-height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-size: var(--font-size-3);
  &__column {
    width: 200px;
    background: var(--color-white-1);
    height: 100%;
    box-sizing: border-box;
    box-shadow: 0 2px 6px var(--color-light-1);
    padding: 20px 0;
    overflow-y: auto;
    &__claim {
      cursor: pointer;
      $root: &;
      border-top: 1px solid var(--color-light-1);
      padding-top: 10px;
      padding-bottom: 10px;
      &__ref {
        font-size: var(--font-size-4);
        padding: 0 20px;
        line-height: 34px;
        height: 34px;
      }
      &__case {
        box-sizing: border-box;
        text-decoration: none;
        display: block;
        padding: 0 20px;
        color: var(--color-blue-4);
        font-size: var(--font-size-4);
        line-height: 34px;
        height: 34px;
        font-weight: 500;
        &:hover {
          color: var(--color-blue-2);
        }
        &--active {
          color: var(--color-blue-2);
          background: var(--color-blue-5);
          border-right: 2px solid var(--color-green-1);
        }
      }
    }
  }
  &__chat-container {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 600px;
      margin-bottom: 20px;
      label {
        margin-bottom: 5px;
        display: inline-block;
      }
      &__left {
        text-align: left;
        a {
          font-size: var(--font-size-1);
          font-weight: 500;
          color: var(--color-blue-3);
          &:hover {
            color: var(--color-blue-3-hover);
          }
        }
      }
      &__right {
        text-align: right;
        p {
          font-size: var(--font-size-1);
          font-weight: 500;
        }
      }
    }
    &__content {
      width: 100%;
      max-width: 600px;
      border-radius: 5px;
      overflow: hidden;
      max-height: 600px;
      height: 70%;
      border: 1px solid var(--color-light-1);
      box-shadow: 0 2px 20px var(--color-light-1);
      display: flex;
      flex-direction: column;
      position: relative;
      .lis-chat-wrapper {
        // Hack to fill the height of box
        height: 600px;
        background: var(--color-white-1);
        &.chatbot-disabled {
          // To push the content down
          // so it's not covered by "Disconnect button"
          padding-top: 60px;
        }
      }
      &__control {
        position: absolute;
        z-index: 10;
        left: 0;
        top: 0;
        height: 50px;
        box-shadow: 0 2px 5px var(--color-light-1);
        width: 100%;
        padding: 10px 15px;
        pointer-events: none;
        text-align: right;
        box-sizing: border-box;
        background: var(--color-white-1);
        align-items: center;
        .lis-button {
          pointer-events: all;
          height: 30px;
        }
      }
      &__input {
        background: var(--color-white-1);
        min-height: 60px;
        position: relative;
        display: flex;
        flex-direction: row;
        box-shadow: 0 -2px 4px var(--color-light-1);
        &__textarea {
          flex: 1;
          padding: 20px;
          border: none;
          box-sizing: border-box;
          resize: none;
          font-size: var(--font-size-3);
          color: var(--color-blue-2);
        }
        &__send-button {
          position: absolute;
          top: 10px;
          right: 10px;
          color: var(--color-white-1);
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          transition: all 0.15s;
          &:active {
            transform: scale(0.6);
          }
          &.disabled {
            .lis-icon {
              background: var(--color-light-1);
            }
          }
          &.has-text {
            .lis-icon {
              background: var(--color-blue-3);
            }
          }
          &.empty {
            .lis-icon {
              background: var(--color-blue-4);
            }
          }
          .lis-icon {
            width: 12px;
            height: 12px;
            font-size: 12px;
            border-radius: 50%;
            padding: 7px;
          }
        }
      }
    }
  }
}
</style>

