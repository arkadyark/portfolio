<template>
  <button
    v-on="$listeners"
    class="lis-button"
    :class="{
		['lis-button--' + type]: type,
		['lis-button--fullwidth']: fullwidth
	}"
  >
    <lis-icon size="small" v-if="icon" :name="icon"/>
    <span>{{text}}</span>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';

@Component({
  components: {
    LisIcon,
  },
})
export default class LisButton extends Vue {
  @Prop({ type: Boolean, default: false }) private fullwidth!: boolean;
  @Prop({ type: String, default: 'primary' }) private type!: string;
  @Prop({ type: String }) private text!: string;
  @Prop({ type: String }) private icon!: string;
}
</script>

<style lang="scss" scoped>
.lis-button {
  padding: 0 20px;
  height: 40px;
  font-size: var(--font-size-3);
  border: none;
  border-radius: 30px;
  box-sizing: border-box;
  border: 2px solid transparent;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  text-align: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.1s;
  cursor: pointer;
  &:active {
    transform: scale(0.9);
  }
  .lis-icon {
    position: relative;
    left: -5px;
  }
  &--fullwidth {
    width: 100%;
  }
  &--primary {
    background: var(--color-blue-3);
    border: 2px solid var(--color-blue-3);
    color: #fff;
    box-shadow: 0 4px 10px var(--color-blue-3-shadow);
    &:hover, &:active {
      border: 2px solid var(--color-blue-3-hover);
      background: var(--color-blue-3-hover);
    }
  }
  &--dark {
    background: var(--color-blue-1);
    border: 2px solid var(--color-blue-1);
    box-shadow: 0 4px 10px var(--color-light-1);
    color: #fff;
    &:hover, &:active {
      border: 2px solid var(--color-blue-1-hover);
      background: var(--color-blue-1-hover);
    }
  }
  &--white {
    background: var(--color-white-1);
    border: 2px solid var(--color-blue-3);
    box-shadow: 0 4px 10px var(--color-light-1);
    color: var(--color-blue-3);
    &:hover, &:active {
      border: 2px solid var(--color-blue-3);
      background: var(--color-blue-3);
      color: var(--color-white-1);
    }
  }
  &--green {
    background: var(--color-green-1);
    border: 2px solid var(--color-green-1);
    color: #fff;
    box-shadow: 0 4px 10px var(--color-green-1-shadow);
    &:hover, &:active {
      border: 2px solid var(--color-green-1-hover);
      background: var(--color-green-1-hover);
    }
  }
  &--outline {
    background: none;
    border: 2px solid var(--color-light-1);
    color: var(--color-blue-4);
    &:hover, &:active {
      border: 2px solid var(--color-blue-4);
      color: var(--color-blue-4);
    }
  }
}
</style>
