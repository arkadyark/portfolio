<template>
  <div class="claim-details">
    <div class="claim-details__columns">
      <div class="claim-details__columns__info">
        <section v-if="claim.policy_holder">
          <label class="label">Policy holder</label>
          <p>{{claim.policy_holder.first_name}} {{claim.policy_holder.last_name}}</p>
          <br>
          <label class="label">Policy number</label>
          <p>{{claim.policy_holder.policy_number}}</p>
          <br>
          <label class="label">Contact info</label>
          <p>{{claim.policy_holder.phone_number}}</p>
          <p>{{claim.policy_holder.email}}</p>
          <br>
          <p v-if="claim.policy_holder.mailing_address">{{claim.policy_holder.mailing_address}}</p>
          <p
            v-if="claim.policy_holder.city"
          >{{claim.policy_holder.city}} {{claim.policy_holder.postal_code}}</p>
          <p v-if="claim.policy_holder.province">{{claim.policy_holder.province}}</p>
          <!-- <p>{{claim.policy_holder.mailing_address}}</p>
        <p>{{claim.policy_holder.city}}</p>
        <p>{{claim.policy_holder.province}}</p>
          <p>{{claim.policy_holder.postal_code}}</p>-->
          <label class="label label--margin">Driver's licence</label>
          <lis-file-thumbnail
            v-if="driversLicenseImage"
            @openImage="openImage"
            :clickable="true"
            :file="driversLicenseImage"
          />
        </section>
      </div>

      <div class="claim-details__columns__accident-details">
        <label class="label">Accident details</label>
        <div class="claim-details__columns__accident-details__meta">
          <div>
            <lis-icon name="clock-outline" size="small"/>
            <div>
              <p>{{claim.accident_date || 'Not provided'}}</p>
              <p>{{claim.accident_date ? '12:00 PM' : '-'}}</p>
            </div>
          </div>
          <div class="is-right">
            <lis-icon name="map-marker" size="small"/>
            <div>
              <p>{{claim.accident_location || 'Not provided'}}</p>
              <p v-if="claim.accident_location">
                <a href="https://goo.gl/maps/3ni37X6z1F52" target="_blank">2.7km</a> away
              </p>
              <p v-else>-</p>
            </div>
          </div>
        </div>
        <hr class="lis-hr"/>

        <label class="label label--margin">Description</label>
        <p class="text" v-if="claim.accident_description">{{claim.accident_description}}</p>
        <p v-else>Not provided</p>

        <div class="claim-details__columns__accident-details__questions">
          <div>
            <label class="label label--margin">Are there any fluids leaking?</label>
            <p v-if="claim.fluids == true" class="answer" :class="'answer--true'">
              <lis-icon name="check-circle" size="small"/>Yes
            </p>
            <p v-else-if="claim.fluids == false" class="answer" :class="'answer--false'">
              <lis-icon name="check-circle" size="small"/>No
            </p>
            <p v-else>-</p>
          </div>
          <div>
            <label class="label label--margin">Is the vehicle still drivable?</label>
            <p v-if="claim.drivable == true" class="answer" :class="'answer--true'">
              <lis-icon name="close-circle" size="small"/>Yes
            </p>
            <p v-else-if="claim.drivable == false" class="answer" :class="'answer--false'">
              <lis-icon name="close-circle" size="small"/>No
            </p>
            <p v-else>-</p>
          </div>
        </div>

        <div class="claim-details__columns__accident-details__files-list">
          <template v-if="claimFiles.length">
            <label class="label label--margin">Attached files</label>
            <lis-file-thumbnail
              @openImage="openImage"
              :clickable="true"
              v-for="(file, i) in claimFiles"
              :key="i"
              :file="file"
            />
          </template>
          <template v-else>
            <p
              class="claim-details__columns__accident-details__files-list__empty"
            >Policy holder hasn't uploaded any files</p>
          </template>
        </div>
      </div>
      

      <div class="claim-details__columns__chat">
        <label class="label label--margin">Chat with policy holder</label>
        <div class="claim-details__columns__chat__box">
          <transition name="fade">
            <div
              class="claim-details__columns__chat__box__control"
              v-if="claim.chatbot_enabled == 0"
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
            v-if="claim"
            :messages="caseMessages"
            :class="{'chatbot-disabled': claim.chatbot_enabled == 0}"
          />
          <div class="claim-details__columns__chat__box__input">
            <textarea-autosize
              rows="1"
              @keydown.native.enter.exact.prevent
              @keyup.native.enter.exact="sendAdjusterMessage"
              @keydown.native.enter.shift.exact="() => {}"
              :max-height="120"
              placeholder="Type here"
              v-model="textMessage"
              class="claim-details__columns__chat__box__input__textarea"
            ></textarea-autosize>
            <button
              class="claim-details__columns__chat__box__input__send-button"
              @click="sendAdjusterMessage"
            >
              <lis-icon name="send" size="small"/>
            </button>
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
export default class ClaimDetails extends Vue {
  public textMessage: string = '';
  public contactLog: any[] = [
    {
      icon: 'email-outline',
      date: 'Dec 12, 2018',
      channel: 'Email',
    },
    {
      icon: 'phone',
      date: 'Dec 11, 2018',
      channel: 'Text message',
    },
    {
      icon: 'email-outline',
      date: 'Dec 11, 2018',
      channel: 'Email',
    },
    {
      icon: 'facebook-messenger',
      date: 'Dec 08, 2018',
      channel: 'Messenger',
    },
  ];

  @Prop({ type: Object }) private claim!: any;

  get caseMessages() {
    return this.$store.state.dashboard.caseMessages;
  }

  get claimFiles() {
    if (this.claim && this.claim.images) {
      return this.claim.images.map((imgObject: any) => {
        return {
          name: imgObject.id + '.png',
          url: imgObject.image_url,
        };
      });
    }

    return [];
  }

  get driversLicenseImage() {
    if (this.claim.policy_holder && this.claim.policy_holder.drivers_license) {
      return {
        url: this.claim.policy_holder.drivers_license.image_url,
      };
    }
    return null;
  }

  public getAlignment(message: any) {
    return message.author === 'bot' ? 'left' : 'right';
  }

  public getIcon(message: any) {
    return message.author === 'bot'
      ? '/img/assistant_icon.png'
      : '/img/user_icon.png';
  }

  public getColor(message: any) {
    return message.author === 'bot' ? '#0057FF' : '#434B65';
  }

  public setModalWindow(type: string | null) {
    this.$store.dispatch('dashboard/setModalWindow', type);
  }

  public openImage(imageSrc: string) {
    this.$store.dispatch('dashboard/openModalImage', imageSrc);
  }

  public enableChatbot() {
    // this.$socket.emit("enable_chatbot", {
    //   room: this.claim.id
    // });
  }

  public sendAdjusterMessage() {
    this.$store.dispatch('dashboard/addCaseMessage', {
      id: this.caseMessages.length + 1,
      author: 'agent',
      type: 'text',
      message: this.textMessage,
    });

    // this.$socket.emit("client_message", {
    //   author: "agent",
    //   type: "text",
    //   message: this.textMessage,
    //   room: this.claim.id
    // });

    this.textMessage = '';
  }
}
</script>

<style lang="scss" scoped>
.claim-details {
  max-width: 1200px;
  box-sizing: border-box;
  &__columns {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    .label {
      display: block;
      font-weight: 500;
      &--margin {
        margin-bottom: 10px;
      }
    }
    &__info {
      line-height: 1.2rem;
      max-width: 350px;
      min-width: 180px;
      box-sizing: border-box;
      flex: 1;
      padding-right: 70px;
      section {
        // border-bottom: 1px solid var(--color-light-1);
        margin-bottom: 10px;
        padding-bottom: 10px;
      }
    }
    // &__uploaded-files {
    //   // flex: 2;
    //   .lis-file-thumbnail {
    //     margin-right: 15px;
    //     margin-bottom: 15px;
    //   }
    //   &__empty {
    //     border: 1px solid var(--color-blue-4);
    //     color: var(--color-white-4);
    //     padding: 10px 20px;
    //     border-radius: 8px;
    //     margin: 20px 0;
    //     max-width: 50%;
    //     p:first-child {
    //       font-size: var(--font-size-3);
    //       line-height: var(--font-size-2);
    //     }
    //   }
    // }

    &__accident-details {
      max-width: 700px;
      padding-right: 70px;
      box-sizing: border-box;
      flex: 3;

      .text {
        font-size: var(--font-size-2);
        line-height: var(--font-size-1);
        margin: 10px 0;
        background: var(--color-blue-5);
        padding: 20px;
      }

      &__meta {
        display: flex;
        margin: 25px 0 20px;
        & > div {
          width: 50%;
          display: flex;
          align-items: center;
          &.is-right {
            text-align: right;
            flex-direction: row-reverse;  
            .lis-icon {
              margin-left: 8px;
              margin-right: 0;
            }          
          }
          .lis-icon {
            color: var(--color-blue-4);
            margin-right: 8px;
            width: 36px;
            height: 36px;
          }
          p {
            margin-top: 5px;
            a {
              color: var(--color-blue-3);
            }
          }
        }
      }

      &__questions {
        margin-top: 40px;
        display: flex;
        div {
          width: 50%;
          padding-right: 20px;
        }
        .answer {
          padding: 4px 8px;
          display: inline-flex;
          align-items: center;
          border-radius: 20px;
          font-size: var(--font-size-3);
          background: var(--color-blue-5);
          .lis-icon {
            color: var(--color-blue-4);
            width: 10px;
            height: 10px;
            margin-right: 5px;
          }
          &--true {
            .lis-icon {
              color: var(--color-green-1);
            }
          }
        }
      }

      &__files-list {
        width: 100%;
        border: 2px solid var(--color-blue-5);
        padding: 25px 25px 10px;
        box-sizing: border-box;
        margin: 30px 0;
        border-radius: 5px;
        &__empty {
          padding-bottom: 15px;
        }
        .lis-file-thumbnail {
          margin-right: 15px;
          margin-bottom: 15px;
          width: 60px;
          height: 60px;
        }
      }
    }

    &__chat {
      flex: 2;
      max-width: 400px;
      min-width: 300px;
      &__last-message-exchange {
        margin: 20px 0;
      }
      &__box {
        border-radius: 5px;
        overflow: hidden;
        height: 70%;
        max-height: 500px;
        border: 1px solid var(--color-light-1);
        box-shadow: 0 2px 20px var(--color-light-1);
        display: flex;
        flex-direction: column;
        position: relative;
        .lis-chat-wrapper {
          // Hack to fill the height of box
          height: 500px;
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
            top: 17px;
            right: 17px;
            color: var(--color-white-1);
            width: 25px;
            height: 25px;
            border: none;
            border-radius: 50%;
            background: var(--color-blue-3);
            .lis-icon {
              width: 12px;
              height: 12px;
              transform: translate(1px, -1px) rotate(-15deg);
            }
          }
        }
      }
    }
  }
}
</style>

