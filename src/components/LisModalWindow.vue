<template>
  <div class="lis-modal-window">
    <div class="lis-modal-window__container" v-click-outside="hide">
      <div class="lis-modal-window__container__header">
        <p>{{windowName}}</p>
        <lis-icon name="close-circle" @click.native="hide"/>
      </div>
      <div class="lis-modal-window__container__content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LisIcon from '@/components/LisIcon.vue';
import ClickOutside from 'vue-click-outside';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    LisIcon,
  },
  directives: {
    ClickOutside,
  },
})
export default class LisModalWindow extends Vue {
  @Prop({ type: String }) private windowName!: string;

  public hide() {
    this.$emit('closeModal');
  }
}
</script>

<style lang="scss" scoped>
.lis-modal-window {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  padding: 50px;
  box-sizing: border-box;
  &__container {
    max-width: 800px;
    min-width: 380px;
    max-height: 600px;
    &__header {
      background: var(--color-white-1);
      height: 80px;
      font-size: var(--font-size-1);
      font-weight: 400;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-light-1);
      padding: 0 30px;
      box-sizing: border-box;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      .lis-icon {
        opacity: 0.5;
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
      }
    }
    &__content {
      background: var(--color-white-1);
      text-align: left;
      width: 100%;
      overflow-y: visible;
      padding: 30px;
      box-sizing: border-box;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
}
</style>
