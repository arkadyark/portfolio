<template>
  <div class="sidebar lis-shadow-1">
    <router-link
      v-for="item in nav"
      :to="{name: item.routeName}"
      :key="item.routeName"
      class="sidebar__nav-item"
      :active-class="'sidebar__nav-item--active'"
    >
      <lis-icon :name="item.icon" size="small"/>
      <span>{{ item.name }}</span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LisIcon from '@/components/LisIcon.vue';

@Component({
  components: {
    LisIcon,
  },
})
export default class Sidebar extends Vue {
  public nav: any[] = [
    {
      name: 'Claims',
      icon: 'content-copy',
      routeName: 'dashboard.claimList',
    },
    {
      name: 'Chats',
      icon: 'forum',
      routeName: 'chats',
    },
    {
      name: 'Claimants',
      icon: 'account-circle',
      routeName: 'claimants',
    },
    // {
    //   name: "Analytics",
    //   icon: "image-filter-center-focus",
    //   routeName: "analytics"
    // },
    {
      name: 'Settings',
      icon: 'settings',
      routeName: 'settings',
    },
  ];
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 220px;
  background: var(--color-white-1);
  padding-top: 30px;
  position: relative;
  z-index: 1;

  &__nav-item {
    width: 100%;
    padding: 14px 30px;
    display: block;
    box-sizing: border-box;
    text-decoration: none;
    color: var(--color-blue-4);
    font-size: var(--font-size-3);
    text-align: left;
    border-bottom: 1px solid var(--color-light-1);
    font-weight: 500;
    display: flex;
    align-items: center;
    .material-design-icon {
      margin-right: 10px;
    }
    &--active {
      color: var(--color-blue-1);
      .lis-icon {
        color: var(--color-green-1);
      }
    }
    &:hover:not(&--active) {
      color: var(--color-blue-2);
    }
  }
}
</style>

