<template>
  <div class="lis-input">
    <lis-icon v-if="icon" :name="icon"/>
    <input
      :type="type"
      :value="value"
      @input="input"
      class="lis-input__input"
      :class="{'lis-input__input--filled': value && value.length > 0}"
    >
    <span class="lis-input__placeholder">{{placeholder}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';

@Component({
  components: {
    LisIcon,
  },
})
export default class LisInput extends Vue {
  @Prop({ type: String, default: '' }) private value!: string;
  @Prop({ type: String, default: 'text' }) private type!: string;
  @Prop({ type: String, default: '' }) private placeholder!: string;
  @Prop({ type: String }) private label!: string;
  @Prop({ type: String }) private icon!: string;

  public input(event: any) {
    this.$emit('input', event.target.value);
  }
}
</script>

<style lang="scss" scoped>
.lis-input {
  position: relative;
  width: 100%;
  min-width: 200px;
  max-width: 320px;
  height: 42px;
  display: flex;
  align-items: flex-end;
  &__input {
    border: none;
    border-bottom: 2px solid var(--color-blue-4);
    background: none;
    font-size: 1rem;
    width: 100%;
    height: 30px;
    box-sizing: border-box;
    color: var(--color-blue-2);
    transition: all 0.3s;
    &:focus {
      border-color: var(--color-blue-3);
    }
  }
  &__placeholder {
    position: absolute;
    font-size: 1rem;
    left: 0;
    bottom: 10px;
    transition: all 0.2s;
    color: var(--color-blue-4);
    pointer-events: none;
  }
  &__input:focus + &__placeholder,
  &__input--filled + &__placeholder {
    font-size: 0.8rem;
    bottom: 30px;
  }
}
</style>
