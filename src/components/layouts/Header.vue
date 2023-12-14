<template>
  <div>
    <div class="flex_between align-center">
      <div class="flex flex-center">
        <h2 class="mr-6">后台</h2> 
        <!-- <el-tag v-if="role === 'admin'" :type="env === '测试环境' ? 'success' : 'danger'">{{ env }}</el-tag> -->
      </div>
      <div class="user-info">
        <span class="text mr-12">欢迎 {{ users }}</span>
        <!-- <a-button v-if="role === 'admin'" class="mr-6" status="warning" @click="switchCurrentEnv">切换环境</a-button> -->
        <a-button type="primary" status="danger" @click="logout">退出</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { logout as logoutService } from "@/api/login";
import { useStore } from "vuex";
import { ref } from 'vue';
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const store = useStore();
    // console.log('store.state.env :>> ', store.state.env);
    const users = window.sessionStorage.getItem('usernames');
    const env = ref(window.sessionStorage.getItem('env') !== 'prod' ? "测试环境" : "生产环境");

    function logout() {
      logoutService()
        .then(() => {
          sessionStorage.clear();
          // location.href = "/login"; // 跳转到登录界面
          router.push('/login');
        })
        .catch((error) => {
          console.error(error);
        });
    }
    const role = window.sessionStorage.getItem('userRole')

    return {
      users,
      logout,
      env,
      role,
    };
  },
};
</script>

<style scoped>
h2 {
  color: white;
}
</style>
