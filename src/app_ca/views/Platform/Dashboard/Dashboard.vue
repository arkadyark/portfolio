<template>
  <div class="dashboard">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ApiService from '@/app_ca/services/ApiService.ts';

@Component({
  components: {},
})
export default class Dashboard extends Vue {}
</script>

<style lang="scss" scoped>
</style>

