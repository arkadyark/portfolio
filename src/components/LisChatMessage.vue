<template>
  <div
    class="lis-chat-message"
    :class="{
    [`lis-chat-message--${align}`]: true,
    ['lis-chat-message--has-datetime']: datetime,
  }"
  >
    <div class="lis-chat-message__icon" v-if="icon" :style="{ backgroundImage: `url(${icon})` }"></div>
    <div class="lis-chat-message__wrapper">
      <transition name="horizontal-transition" appear>
        <span v-if="datetime" class="lis-chat-message__wrapper__datetime">{{ datetime }}</span>
      </transition>
      <div
        class="lis-chat-message__wrapper__bubble"
        v-if="message.type === 'text' || message.type === 'number' || message.type === 'multiple_choice' || message.type === 'file_upload_single'"
        :style="{ backgroundColor: color }" v-html="message.message"></div>
      <div class="lis-chat-message__wrapper__image" v-else-if="message.type === 'image'">
        <img :src="imageUrl">
      </div>
      <div class="lis-chat-message__wrapper__loading" v-else-if="message.type === 'loading'">
        <lis-loader color="#434B65"/>
      </div>
      <div
        class="lis-chat-message__wrapper__bubble"
        :style="{ backgroundColor: color }"
        v-else-if="message.type === 'typing'"
      >
        <div class="lis-chat-message__wrapper__bubble__typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';
import LisLoader from '@/components/LisLoader.vue';
import config from '@/config/index.ts';

@Component({
  components: {
    LisIcon,
    LisLoader,
  },
})
export default class LisChatMessage extends Vue {
  @Prop({ type: Object, default: '' }) private message!: any;
  @Prop({ type: String, default: 'left' }) private align!: string;
  @Prop({ type: String }) private icon!: string;
  @Prop({ type: String, default: '#aa87FF' }) private color!: string;
  @Prop({ type: String }) private datetime!: string;

  get imageUrl() {
    if (this.message && this.message.image) {
      return this.message.image.image_url;
    }
    return null;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

@keyframes typing-dot {
  0% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-5px);
  }
  40% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}

.lis-chat-message {
  $root: &;
  display: flex;
  &__wrapper {
    max-width: 100%;
    flex: 1;
    text-align: left;
    position: relative;
    &__datetime {
      position: absolute;
      font-size: var(--font-size-4);
      color: var(--color-blue-4);
    }
    &__bubble {
      color: var(--color-white-1);
      font-size: var(--font-size-3);
      line-height: var(--font-size-2);
      display: inline-block;
      padding: 12px 18px;
      margin: 0 10px 10px;
      max-width: 75%;
      transition: all 0.5s;
      width: auto;
      &__typing {
        display: flex;
        align-items: center;
        line-height: 42px;
        display: inline-flex;
        box-sizing: border-box;
        vertical-align: middle;
        span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-white-1);
          display: block;
          &:nth-child(1) {
            animation: typing-dot 2s infinite 0s;
          }
          &:nth-child(2) {
            animation: typing-dot 2s infinite 0.2s;
          }
          &:nth-child(3) {
            animation: typing-dot 2s infinite 0.4s;
          }
        }
        span + span {
          margin-left: 5px;
        }
      }
    }
    &__image {
      max-width: 200px;
      position: relative;
      display: inline-block;
      margin: 0 10px 10px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 2px 3px var(--color-light-1);
      img {
        width: 100%;
        display: block;
      }
    }
  }
  &__icon {
    width: 24px;
    height: 24px;
    background-size: cover;
  }
  &--has-datetime {
    &#{$root}--left + &#{$root}--left {
      padding-top: 20px;
    }
    &#{$root}--right + &#{$root}--right {
      padding-top: 20px;
    }
  }
  &--left {
    #{$root}__wrapper__datetime {
      left: 10px;
      top: -20px;
    }
    #{$root}__wrapper__bubble {
      border-top-left-radius: 0;
      border-top-right-radius: 35px;
      border-bottom-left-radius: 25px;
      border-bottom-right-radius: 25px;
      text-align: left;
    }
    #{$root}__wrapper__image {
      border-top-left-radius: 0;
    }
  }
  &--right {
    flex-direction: row-reverse;
    justify-content: flex-end;
    #{$root}__wrapper__datetime {
      right: 10px;
      top: -20px;
    }
    #{$root}__wrapper {
      text-align: right;
    }
    #{$root}__wrapper__bubble {
      border-top-left-radius: 25px;
      border-top-right-radius: 0;
      border-bottom-left-radius: 25px;
      border-bottom-right-radius: 25px;
      text-align: left;
    }
    #{$root}__wrapper__image {
      border-top-right-radius: 0;
    }
  }
  &--right + &--left {
    margin-top: 20px;
  }
  &--left + &--right {
    margin-top: 20px;
  }
}
</style>

