<template>
  <div class="lis-switch" :class="'lis-switch--' + switchClass" @click="switchValue">
    <div class="lis-switch__handle"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class SuiSwitch extends Vue {
  @Prop({ type: Boolean, default: false }) private value!: boolean;

  get switchClass() {
    return this.value ? 'on' : 'off';
  }

  public switchValue() {
    this.$emit('input', !this.value);
  }
}
</script>

<style lang="scss" scoped>
.lis-switch {
  width: 40px;
  height: 20px;
  position: relative;
  margin: 10px 0;
  cursor: pointer;
  $root: &;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 5px;
    bottom: 5px;
    background: var(--color-blue-4);
    border-radius: 10px;
    transition: background 0.2s linear;
  }
  &__handle {
    width: 20px;
    height: 20px;
    position: relative;
    z-index: 1;
    border-radius: 50%;
    background: var(--color-white-1);
    box-shadow: 0 2px 1px var(--color-blue-4);
    transition: all 0.2s ease-out;
  }
  &--on {
    #{$root}__handle {
      transform: translateX(100%);
    }
    &:after {
      background: var(--color-green-1);
    }
  }
}
</style>

