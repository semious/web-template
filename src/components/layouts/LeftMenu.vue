<template>
  <a-menu :selected-keys="[active]">
    <router-link v-for="(i, key) in menuList" :to="i.path" class="nav_btn" :key="key">
      <a-menu-item :key="key.toString()">
        {{ i.name }}
      </a-menu-item>
    </router-link>
  </a-menu>
</template>

<script lang="ts">
import router from '@/router';

export default {
  name: "left-menu",
  props: {
    // active: String
  },
  data() {
    const route = router.currentRoute;
    console.log('route.currentRoute :>> ', route.value);
    const currentPath = route.value.path;
    const routes = router.getRoutes();
    const menuList = [{
      name: '用户状态',
      path: '/users',
      role: 'admin'
    }
    ];
    const active = (menuList.findIndex(i => i.path === currentPath)) + "";
    console.log('active :>> ', active);
    return {
      active,
      role: window.sessionStorage.getItem('userRole'),
      menuList,
    };
  }
};
</script>

<style scoped>
</style>
