<template>
  <div class="header-panel">
    <div class="header-panel__logo">
      <img src="/img/liscena_logo_white.png" height="33">
      <span>Liscena</span>
    </div>
    <div class="header-panel__icons">
      <div class="header-panel__icons__item">
        <lis-icon name="content-copy"/>
      </div>
      <div class="header-panel__icons__item">
        <lis-icon name="forum"/>
      </div>
      <div class="header-panel__icons__item">
        <lis-icon name="bell"/>
      </div>
    </div>
    <div class="header-panel__account">
      <p>{{ name }}</p>
      <lis-icon @click.native="logout" name="power-standby"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';

@Component({
  components: {
    LisIcon,
  },
})
export default class HeaderPanel extends Vue {
  @Prop() private msg!: string;

  get name() {
    const profile = this.$store.state.user.profile;
    if (profile) {
      return profile.first_name;
    }
    return null;
  }

  public logout() {
    this.$store.dispatch('user/logout')
    .then(() => {
      this.$router.push({ name: 'login' });
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header-panel {
  height: 60px;
  width: 100%;
  background: var(--color-blue-1);
  position: relative;
  padding: 0 30px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  &__logo {
    display: flex;
    height: 100%;
    align-items: center;
    img {
      margin-right: 20px;
    }
    span {
      display: none;
      font-size: 1.4rem;
      color: var(--color-white-1);
    }
  }
  &__icons {
    margin-left: auto;
    display: flex;
    align-items: center;
    margin-right: 15px;
    &__item {
      padding: 0 15px;
      .lis-icon {
        color: var(--color-blue-4);
        opacity: 0.3;
      }
    }
  }
  &__account {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 18px;
    &:before {
      content: "";
      position: absolute;
      top: 10px;
      bottom: 10px;
      right: 0;
      left: 0;
      background: var(--color-blue-3);
      opacity: 0.1;
      border-radius: 25px;
    }
    p {
      z-index: 1;
      color: var(--color-white-1);
      padding-right: 20px;
      padding-left: 5px;
    }
    .lis-icon {
      z-index: 1;
      cursor: pointer;
      color: var(--color-blue-4);
      &:hover {
        color: var(--color-blue-3);
      }
    }
  }
}
</style>
