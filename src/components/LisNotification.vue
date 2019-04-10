<template functional>
  <div class="lis-notification" :class="props.type">
    <p>{{ props.text }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class LisLoader extends Vue {
  @Prop({type: String}) private type!: string;
  @Prop({type: String}) private text!: string;
}
</script>

<style lang="scss" scoped>
.lis-notification {
  border-radius: 6px;
  margin-bottom: 20px;
  p {
    padding: 20px;
  }
  &.red {
    border: 2px solid var(--color-red-1);
    color: var(--color-red-1);
  }
}
</style>
