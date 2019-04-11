<template>
  <div class="lis-chat-wrapper" ref="chat-wrapper">
    <transition name="fade" appear>
      <slot name="before-chat"/>
    </transition>

    <transition-group name="fade" appear>
      <template v-for="(message, i) in messages">
        <lis-chat-message
          :message="message"
          :key="i"
          :type="message.type"
          :align="getAlignment(message)"
          :icon="getIcon(message)"
          :color="getColor(message)"
          :datetime="formatDate(message.time)"
        />
      </template>
    </transition-group>

    <slot name="after-chat"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import LisChatMessage from '@/components/LisChatMessage.vue';
import { format } from 'date-fns';

@Component({
  components: {
    LisChatMessage,
  },
})
export default class LisChatWrapper extends Vue {
  public textMessage: string = '';
  public isAutomaticScroll: boolean = true;
  public isUserScroll: boolean = true;
  public scrollIntervalId: number | null = null;
  @Prop({ type: Array, default: () => [] }) private messages!: any[];

  public beforeDestroy() {
    clearInterval(this.scrollIntervalId as number);
    this.scrollIntervalId = null;
  }

  public getAlignment(message: any) {
    switch (message.author) {
      case 'user':
        return 'right';
      default:
        return 'left';
    }
  }

  public getIcon(message: any) {
    switch (message.author) {
      case 'bot':
        return 'img/assistant_icon.png';
      case 'agent':
        return 'img/agent_icon.png';
      default:
        return null;
    }
  }

  public getColor(message: any) {
    switch (message.author) {
      case 'bot':
        return '#a087FF';
      case 'agent':
        return '#9CAEC4';
      default:
        return '#434B65';
    }
  }

  public scrollMessagesToBottom() {
    if (!this.isAutomaticScroll) { return; }

    /* Temporarily disable user scroll
    listener so it doesn't interfere */
    this.isUserScroll = false;
    const el = this.$refs['chat-wrapper'] as HTMLElement;
    el.scrollTop = el.scrollHeight - el.offsetHeight;
    setTimeout(() => {
      this.isUserScroll = true;
    }, 0);
  }

  public formatDate(date: string|null) {
    return date ? format(date, 'H:mm A') : null;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

.lis-chat-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  overflow: auto;
  position: relative;
}
</style>

