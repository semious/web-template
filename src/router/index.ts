import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/LoginRegister.vue'
import Not from '../views/404.vue'
import Users from '../views/UserInfo.vue'
import PayOrder from '../views/PayOrder.vue'
import TeacherInfo from '../views/TeacherInfo.vue'
import ProductInfo from '../views/ProductInfo.vue'
import AdminQuery from '../views/AdminQuery.vue'
import Withdraw from '../views/Withdraw.vue'
import Consult from '../views/Consult.vue'
import Course from '../views/Course.vue'
import Video from '../views/Video.vue'
import ShareRatio from '../views/ShareRatio.vue'
import UserShareRatio from '../views/UserShareRatio.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '404',
    component: Login,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/users',
    name: '用户状态',
    component: Users,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 用户状态'
    },
  },
  {
    path: '/users/payorder',
    name: '用户订单',
    component: PayOrder,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 用户订单'
    },
  },
  {
    path: '/users/shareratio',
    name: '用户分成',
    component:  UserShareRatio,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 用户分成'
    },
  },
  {
    path: '/teacherinfo',
    name: '咨询老师',
    component: TeacherInfo,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 咨询老师'
    },
  },
  {
    path: '/productinfo',
    name: '产品信息',
    component: ProductInfo,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 产品信息'
    },
  },
  {
    path: '/product/consult',
    name: '咨询套餐',
    component: Consult,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 咨询套餐'
    },
  },
  {
    path: '/product/course',
    name: '课程信息',
    component: Course,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 课程信息'
    },
  },
  {
    path: '/product/video',
    name: '视频管理',
    component: Video,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 视频管理'
    },
  },
  {
    path: '/cash/shareratio',
    name: '分成管理',
    component: ShareRatio,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 分成管理'
    },
  },
  {
    path: '/admin/query',
    name: '咨询查询',
    component: AdminQuery,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 咨询查询'
    },
  },
  {
    path: '/withdraw',
    name: '提现审核',
    component: Withdraw,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 提现审核'
    },
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {
    path: '/home',
    name: '首页',
    component: Home,
    meta: {
      requiresAuth: true,
      title: '客服后台 - 首页'
    },
  },
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to, from, next) => {
  // console.log(to.meta.requiresAuth, isAuthenticated())
  window.document.title = to.meta.title === undefined ? '客服后台' : to.meta.title as string
  if (to.meta.requiresAuth && !isAuthenticated()) { // 如果需要验证登录，并且没有登录，则跳转到登录页
    next("/login");
  } else {
    next();
  }
});

// 判断用户是否已经登录
function isAuthenticated() {
  // setTimeout(() => {window.sessionStorage.getItem('userInfo')}, 3 * 60 * 1000)
  const userInfo = window.sessionStorage.getItem('userInfo')
  // console.log(userInfo);
  if (userInfo === 'True') {
    // 用户信息存在，直接跳转到目标路由
    return true;
  }
  // // 在这里添加您的验证逻辑，例如检查是否有登录凭据等
  return false; // 这里返回false，表示用户没有登录
}

export default router
