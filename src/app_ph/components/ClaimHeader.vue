<template>
  <div class="claim-header">
    <div class="lis-container">
      <div class="claim-header__logo">
        <img src="/img/liscena_logo_white.png" height="26">
      </div>
      <div class="claim-header__nav">
        <router-link :to="{name: 'claim.log', params: $route.params}" class="claim-header__nav__item">
          <lis-icon name="bell"/>
        </router-link>
        <router-link :to="{name: 'claim.files', params: $route.params}" class="claim-header__nav__item">
          <lis-icon name="file-outline"/>
        </router-link>
        <router-link :to="{name: 'claim.assistant', params: $route.params}" class="claim-header__nav__item">
          <lis-icon name="message-text"/>
        </router-link>
      </div>
      <!-- <div class="claim-header__account">
        <button class="claim-header__account__button" @click="logout">
          <span>John Smith</span>
          <lis-icon name="power" size="small"/>
        </button>
      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';
import ApiService from '@/app_ca/services/ApiService.ts';

@Component({
  components: {
    LisIcon,
  },
})
export default class ClaimHeader extends Vue {
  public logout() {
    this.$router.push({
      name: 'claimLogin',
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/lis-resources.scss";

// @media screen and (min-width: $breakpoint-mobile) {
//   .claim-header {
//     height: 215px;
//     position: relative;
//     z-index: 2;
//     display: flex;
//     align-items: center;
//     box-shadow: 0 2px 4px 0 var(--color-light-1);
//     .lis-container {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//     }
//     // &__claim-info {
//     //   flex: 1;
//     //   text-align: left;
//     //   p {
//     //     font-size: 1.4rem;
//     //     line-height: 1.7rem;
//     //   }
//     // }
//     &__logo {
//       flex: 1;
//       text-align: center;
//     }
//     // &__account {
//     //   flex: 1;
//     //   text-align: right;
//     //   &__button {
//     //     font-size: 1rem;
//     //     color: var(--color-blue-4);
//     //     font-weight: 500;
//     //     border: 2px solid var(--color-blue-4);
//     //     border-radius: 25px;
//     //     display: inline-flex;
//     //     align-items: center;
//     //     cursor: pointer;
//     //     padding: 0 20px;
//     //     line-height: 40px;
//     //     .lis-icon {
//     //       margin-left: 10px;
//     //     }
//     //   }
//     // }
//   }
// }

.claim-header {
  height: 60px;
  background: var(--color-blue-1);
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  .lis-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  &__nav {
    display: flex;
    flex-direction: row;
    position: absolute;
    right: 0;
    height: 100%;
    &__item {
      display: block;
      width: 60px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-blue-4);
      &.router-link-exact-active {
        background: var(--color-blue-3);
        color: var(--color-white-1);
      }
      &:hover {
        color: var(--color-white-1);
      }
    }
  }
}
</style>

