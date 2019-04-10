<template>
  <div class="analytics">
    <img src="@/assets/images/analysis_screenshot.png"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';

@Component({
  components: {},
})
export default class Analytics extends Vue {}
</script>

<style lang="scss" scoped>
.analytics {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: var(--color-white-1);
  padding: 40px;
  box-sizing: border-box;
  img {
    width: 1073px;
  }
}
</style>

