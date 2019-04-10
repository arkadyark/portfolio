<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import '@/assets/styles/css-reset.scss';
import '@/assets/styles/lis-styles.scss';
import SocketService from '@/app_ca/services/SocketService';

export default class AppPh extends Vue {
  public created() {
    console.log(this.$route);
  }
}
</script>


<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
   -webkit-tap-highlight-color:rgba(0,0,0,0); /* prevent tap highlight color / shadow */
  * {
    font-family: "Roboto", Helvetica, Arial, sans-serif;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.15s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-blue-2);
  display: flex;
  flex-flow: column;
  height: 100%;
}
</style>
