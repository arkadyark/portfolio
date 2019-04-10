<template>
  <div class="lis-dropdown" v-click-outside="hide" @click="show">
    <span
      class="lis-dropdown__text"
      @click.stop="toggle"
    >{{searchable && optionsVisible ? '' : label(value)}}</span>
    <div class="lis-dropdown__input-wrapper">
      <input
        v-if="searchable && optionsVisible"
        type="text"
        ref="input"
        class="lis-dropdown__input-wrapper__input"
        v-model="searchedValue"
        :placeholder="label(value)"
      >
    </div>
    <div class="lis-dropdown__icon-circle">
      <lis-icon name="chevron-down"/>
    </div>
    <transition name="vertical-transition" mode="out-in">
      <div class="lis-dropdown__options" v-if="optionsVisible">
        <span
          @click.stop="select(option)"
          class="lis-dropdown__options__item"
          v-for="option in filteredOptions"
          :key="option"
        >{{label(option)}}</span>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ClickOutside from 'vue-click-outside';
import LisIcon from '@/components/LisIcon.vue';
import Fuse from 'fuse.js';

@Component({
  components: {
    LisIcon,
  },
  directives: {
    ClickOutside,
  },
})
export default class LisDropdown extends Vue {
  public optionsVisible: boolean = false;
  public searchedValue: string = '';

  @Prop({ type: [String, Number], default: {} }) private value!:
    | string
    | number;
  @Prop({ type: Function, default: (item: any) => item }) private label!: any;
  @Prop({ type: Array }) private options!: any[];
  @Prop({ type: Boolean, default: false }) private searchable!: boolean;

  public toggle() {
    if (this.optionsVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  get filteredOptions() {
    if (this.searchedValue === '') {
      return this.options;
    }

    const optionsObjects = this.options.map((id: number) => {
      return {
        id,
        label: this.label(id),
      };
    });
    const fuse = new Fuse(optionsObjects, {
      keys: ['label'],
      id: 'id',
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
    });

    const result = fuse.search(this.searchedValue);
    return result;
  }

  public hide() {
    this.optionsVisible = false;
  }

  public show() {
    this.optionsVisible = true;
    if (this.searchable) {
      this.focusInput();
    }
  }

  public focusInput() {
    this.$nextTick(() => {
      const input = this.$refs.input as HTMLElement;
      input.focus();
    });
  }

  public select(option: string | number) {
    this.$emit('select', option);
    this.optionsVisible = false;
  }
}
</script>

<style lang="scss" scoped>
.lis-dropdown {
  height: 40px;
  font-size: var(--font-size-3);
  border: none;
  border-radius: 30px;
  box-sizing: border-box;
  border: 1px solid var(--color-light-1);
  box-shadow: 0 2px 4px var(--color-light-1);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  transition: all 0.1s;
  padding: 0 12px 0 20px;
  cursor: pointer;
  &:hover {
    .lis-dropdown__text {
      color: var(--color-blue-3);
    }
  }
  &__text {
    display: block;
    font-size: var(--font-size-3);
    line-height: var(--font-size-2);
    font-weight: 400;
    color: var(--color-blue-2);
    width: 100%;
    position: relative;
    z-index: 1;
  }
  &__input-wrapper {
    position: absolute;
    left: 20px;
    right: 32px;
    z-index: 2;
    &__input {
      font-weight: 400;
      font-size: var(--font-size-3);
      line-height: var(--font-size-2);
      padding: 0;
      display: block;
      color: var(--color-blue-2);
      background: none transparent !important;
      border: none !important;
      -webkit-box-shadow: none !important;
      box-shadow: none !important;
      cursor: text;
      outline: 0;
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    }
  }
  &__fluid {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    line-height: var(--font-size-2);
  }
  &__icon-circle {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 20px;
    margin-left: 10px;
    // box-shadow: 0 1px 4px var(--color-light-2);
    display: flex;
    align-items: center;
    justify-content: center;
    .lis-icon {
      color: var(--color-blue-3);
      width: 18px;
      height: 18px;
    }
  }
  &__options {
    position: absolute;
    top: 40px;
    left: 0;
    background: var(--color-white-1);
    box-shadow: 0 2px 20px var(--color-light-1);
    border-radius: 4px;
    padding: 0;
    z-index: 100;
    min-width: 100%;
    &__item {
      display: block;
      padding: 10px 20px;
      font-size: var(--font-size-3);
      white-space: nowrap;
      &:hover {
        color: var(--color-blue-3);
        background: var(--color-blue-5);
      }
    }
    &__item + &__item {
      border-top: 1px solid var(--color-light-1);
    }
  }
}
</style>
