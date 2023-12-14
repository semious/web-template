<template>
  <!-- 登录 -->
  <a-form :model="loginUser" :rules="rules" ref="formRef" label-width="100px" class="login-form sign-in-form">
    <a-form-item label="用户" field="name" :validate-trigger="['blur']">
      <a-input v-model="loginUser.name" placeholder="Enter Username..." />
    </a-form-item>
    <a-form-item label="密码" field="password" :validate-trigger="['blur']">
      <a-input v-model="loginUser.password" type="password" placeholder="Enter Password..." />
    </a-form-item>

    <a-form-item>
      <a-button @click="handlelogin()" type="primary" class="submit-btn">提交</a-button>
    </a-form-item>
    <!-- 找回密码 -->
    <a-form-item>
      <!--    <p class="tiparea">忘记密码<a>立即找回</a></p>  -->
    </a-form-item>
  </a-form>
</template>
  
<script lang="ts">
import { ref } from 'vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router'
import { loginUser, rules } from '@/components/loginValidators'
import { FormInstance, Message } from '@arco-design/web-vue';
import { login } from '@/api/login'
const formRef = ref()
export default {
  name: 'LoginForm',
  props: {
    loginUser: {
      type: Object,
      required: true
    },
    rules: {
      type: Object,
      required: true
    }
  },
  setup(_props: any) {
    // 触发登录方法
    const router = useRouter()

    const handlelogin = () => {
      if (!formRef) return;
      formRef.value.validate((error: boolean) => {
        console.log('error :>> ', error);
        if (!error) {
          login(loginUser)
            .then((res: any) => {
              console.log('login', res);
              if (res.code === 0) {
                window.sessionStorage.setItem('userInfo', 'True')
                window.sessionStorage.setItem('userRole', res.data.role)
                window.sessionStorage.setItem('usernames', loginUser.name)
                window.sessionStorage.setItem('token', res.data.token)

                setTimeout(() => {
                  sessionStorage.clear();
                }, 60 * 60 * 1000);
                // 登录成功
                router.push('/home')
              }
              else {
                Message.error({
                  content: '用户名或密码错误',
                })
                loginUser.name = '';
                loginUser.password = '';
              }
            })
            .catch((error) => {
              // 登录失败
              console.error(error)
              Message.error({
                content: '接口异常,请稍后再试！',
              })
              // router.push('/404')
            })
          // console.log('submit!')
        } else {
          // console.log('error submit!')
          return false
        }
      })
    }
    return { handlelogin,formRef }
  }
}
</script>
<style scoped>

.submit-btn {
  width: 100%;
}
</style>
