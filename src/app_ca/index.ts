import Vue from 'vue';
import AppCa from './AppCa.vue';
import router from './router';
import store from './store/store';
import VueTextareaAutosize from 'vue-textarea-autosize';
import VueTippy from 'vue-tippy';

Vue.config.productionTip = false;

Vue.use(VueTippy, {
  arrow: true,
});
Vue.use(VueTextareaAutosize);

new Vue({
  router,
  store,
  render: (h) => h(AppCa),
}).$mount('#app');
