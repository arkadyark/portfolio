import Vue from 'vue';
import AppPh from './AppPh.vue';
import router from './router';
import VueTextareaAutosize from 'vue-textarea-autosize';
import config from '@/config/index.ts';

Vue.config.productionTip = false;

import axios from 'axios';
Vue.prototype.$axios = axios;

Vue.use(VueTextareaAutosize);

new Vue({
  router,
  render: (h) => h(AppPh),
}).$mount('#app');
