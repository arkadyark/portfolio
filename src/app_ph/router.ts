import Vue from 'vue';
import Router from 'vue-router';
import ChatForm from './views/Assistant/ChatForm.vue';
import ChatFnol from './views/Assistant/ChatFnol.vue';
import ClaimFiles from './views/Files/ClaimFiles.vue';
import Claim from './views/Claim.vue';
import Login from './views/Login.vue';
import Log from './views/Log/Log.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'portfolio',
      path: '/',
      component: ChatFnol,
      props: true,
    },
  ],
});
