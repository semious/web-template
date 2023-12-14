<template>
  <a-menu :selected-keys="[active]">
    <router-link v-for="(i, key) in menuList" :to="i.path" class="nav_btn">
      <a-menu-item v-if="i.role !== 'admin'" :key="key.toString()">
        {{ i.name }}
      </a-menu-item>
    </router-link>
    <div v-if="role === 'admin'">
      <div class="font-weight-bold">Admin</div>
      <router-link v-for="(i, key) in menuList" :to="i.path" class="nav_btn">
        <a-menu-item v-if="i.role === 'admin'" :key="key.toString()">
          {{ i.name }}
        </a-menu-item>
      </router-link>
    </div>
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
      name: '咨询查询',
      path: '/admin/query'
    }, {
      name: '提现审核',
      path: '/withdraw'
    }, {
      name: '咨询老师',
      path: '/teacherinfo'
    }, {
      name: '咨询套餐',
      path: '/product/consult'
    }, {
      name: '课程信息',
      path: '/product/course'
    }, {
      name: '分成管理',
      path: '/cash/shareratio',
      role: 'admin'
    }, {
      name: '用户状态',
      path: '/users',
      role: 'admin'
    }, {
      name: '用户订单',
      path: '/users/payorder',
      role: 'admin'
    }, {
      name: '用户分成',
      path: '/users/shareratio',
      role: 'admin'
    },
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
