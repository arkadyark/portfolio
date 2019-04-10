<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import '@/assets/styles/css-reset.scss';
import '@/assets/styles/lis-styles.scss';
import SocketService from '@/app_ca/services/SocketService';
import config from '@/config';

export default Vue.extend({
  data() {
    return {
      loading: false,
    };
  },

  created() {
    this.$store.dispatch('dashboard/getSettings');
    SocketService.init(config.ws)
    .then((socket: any) => {
      socket.on('server_message', (data: any) => {
        this.$store.dispatch('dashboard/addCaseMessage', data);
      });

      socket.on('chat_history', (data: any) => {
        this.$store.dispatch('dashboard/setChatHistory', data);
      });

      socket.on('case_update', (data: any) => {
        this.$store.commit('dashboard/UPDATE_CASE', data);
      });

      socket.on('reconnect', (data: any) => {
        console.log('Socket reconnected');
        this.$root.$emit('joinRoom');
      });
    });
  },
});
</script>


<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  * {
    font-family: "Roboto", Helvetica, Arial, sans-serif;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.35s;
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
