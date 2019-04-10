<template>
  <div class="log">
    <div class="log__data">
      <h1>Claim {{ claimCase.ref }}</h1>
    </div>
    <div class="log__history">
      <label class="label">Activity log</label>
      <div class="log__history__item" v-for="(item, i) in log" :key="i">
        <p class="date">{{ item.date }}</p>
        <p class="log__history__item__title">{{ item.text }}</p>
        <div class="log__history__item__icon">
          <lis-icon :name="item.icon"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import LisLoader from '@/components/LisLoader.vue';
import LisIcon from '@/components/LisIcon.vue';
import config from '@/config/index.ts';

@Component({
  components: {
    LisLoader,
    LisIcon,
  },
})
export default class Log extends Vue {

  public log: any[] = [
    {
      date: '12th February, 2019',
      text: 'Adjuster assigned',
      icon: 'account',
    },
    {
      date: '11th February, 2019',
      text: 'Claim registered',
      icon: 'content-copy',
    },
  ];
  @Prop({ type: Object }) private claimCase!: any;
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

.log {
  background: var(--color-blue-5);
  padding: 30px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  .label {
    margin-bottom: 20px;
    display: block;
  }
  &__data {
    text-align: left;
    width: 100%;
    max-width: 600px;
    margin-bottom: 20px;
    h1 {
      font-size: var(--font-size-1);
    }
  }
  &__history {
    width: 100%;
    max-width: 600px;
    &__item {
      border-radius: 6px;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px var(--color-light-1);
      background: var(--color-white-1);
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      position: relative;
      padding: 15px 20px 15px 30px;
      .date {
        color: var(--color-blue-4);
        margin-bottom: 4px;
        font-size: var(--font-size-3);
      }
      &__title {
        font-size: var(--font-size-2);
      }
      &__icon {
        position: absolute;
        width: 40px;
        height: 40px;
        top: calc(50% - 20px);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        box-shadow: 0 2px 4px var(--color-light-1);
        left: -20px;
        z-index: 1;
        background: var(--color-white-1);
        .lis-icon {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>

