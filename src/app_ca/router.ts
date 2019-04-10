import Vue from 'vue';
import Router from 'vue-router';
import store from './store/store';
import Platform from './views/Platform/Platform.vue';
import Dashboard from './views/Platform/Dashboard/Dashboard.vue';
import Analytics from './views/Platform/Analytics/Analytics.vue';
import Settings from './views/Platform/Settings/Settings.vue';
import DamageSegmentation from './views/Platform/Analytics/DamageSegmentation.vue';
import TotalLoss from './views/Platform/Analytics/TotalLoss.vue';
import Claim from './views/Platform/Claim/Claim.vue';
import ClaimNew from './views/Platform/Claim/ClaimNew.vue';
import Chats from './views/Platform/Chats/Chats.vue';
import ClaimEdit from './views/Platform/Claim/ClaimEdit.vue';
import ClaimDetails from './views/Platform/Claim/ClaimDetails.vue';
import ClaimAnalysis from './views/Platform/Claim/ClaimAnalysis.vue';
import ClaimClaimants from './views/Platform/Claim/ClaimClaimants.vue';
import ClaimActivity from './views/Platform/Claim/ClaimActivity.vue';
import ClaimDownloadPDF from './views/Platform/Claim/ClaimDownloadPDF.vue';
import ClaimList from './views/Platform/Claim/ClaimList.vue';
import OcrTest from './views/Platform/OcrTest.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Platform,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
          children: [
            {
              path: 'list',
              name: 'dashboard.claimList',
              component: ClaimList,
              props: true,
            },
            {
              path: 'new-claim',
              name: 'dashboard.claimNew',
              component: ClaimNew,
              props: true,
            },
            {
              path: 'claim/:claimRef/edit',
              name: 'dashboard.claimEdit',
              component: ClaimEdit,
              props: true,
            },
            {
              path: 'claim/:claimRef',
              name: 'dashboard.claimDetail',
              component: Claim,
              props: true,
              children: [
                {
                  path: 'claimants',
                  name: 'dashboard.claimDetail.claimants',
                  component: ClaimClaimants,
                  props: true,
                },
                {
                  path: 'activity',
                  name: 'dashboard.claimDetail.activity',
                  component: ClaimActivity,
                  props: true,
                },
                // {
                //   path: 'details',
                //   name: 'dashboard.claimDetail.details',
                //   component: ClaimDetails,
                //   props: true,
                // },
                // {
                //   path: 'analysis',
                //   name: 'dashboard.claimDetail.analysis',
                //   component: ClaimAnalysis,
                //   props: true,
                //   children: [
                //     {
                //       path: 'total-loss',
                //       name: 'dashboard.claimDetail.analysis.totalLoss',
                //       component: TotalLoss,
                //     },
                //     {
                //       path: 'damage-segmentation',
                //       name: 'dashboard.claimDetail.analysis.damageSegmentation',
                //       component: DamageSegmentation,
                //     },
                //     {
                //       path: 'audio-analysis',
                //       name: 'dashboard.claimDetail.analysis.audioAnalysis',
                //     },
                //     {
                //       path: 'triage',
                //       name: 'dashboard.claimDetail.analysis.triage',
                //     },
                //     {
                //       path: 'fraud-analysis',
                //       name: 'dashboard.claimDetail.analysis.fraudAnalysis',
                //     },
                //     {
                //       path: 'price-prediction',
                //       name: 'dashboard.claimDetail.analysis.pricePrediction',
                //     },
                //   ],
                // },
                // {
                //   path: 'triage',
                //   name: 'dashboard.claimDetail.triage',
                //   component: ClaimDetails,
                //   props: true,
                // },
                {
                  path: 'download-pdf',
                  name: 'dashboard.claimDetail.downloadPDF',
                  component: ClaimDownloadPDF,
                  props: true,
                },
              ],
            },
          ],
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: Analytics,
        },
        {
          path: 'chats/:claimRef?/:caseId?',
          name: 'chats',
          component: Chats,
          props: true,
        },
        {
          path: 'claimants',
          name: 'claimants',
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings,
        },
        {
          path: 'ocr-test',
          name: 'ocrTest',
          component: OcrTest,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      meta: { requiresAnon: true },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/Login/Login.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLogged = localStorage.getItem('profile');
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAnon = to.matched.some((record) => record.meta.requiresAnon);

  if (!isLogged && requiresAuth) {
    next({
      name: 'login',
    });
  } else if (isLogged && requiresAnon) {
    next({
      name: 'dashboard.claimList',
    });
  } else {
    next();
  }
});

export default router;
