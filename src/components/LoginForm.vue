<template>
  <!-- 登录 -->
  <el-form :model="loginUser" :rules="rules" ref="formRef" label-width="100px" class="login-form sign-in-form">
    <el-form-item label="用户" prop="name">
      <el-input v-model="loginUser.name" placeholder="Enter Username..." />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="loginUser.password" type="password" placeholder="Enter Password..." />
    </el-form-item>
    <!-- <el-form-item>
      <el-radio-group v-model="loginUser.env">
        <el-radio label="test">测试环境</el-radio>
        <el-radio label="prod">正式环境</el-radio>
      </el-radio-group>
    </el-form-item> -->

    <el-form-item>
      <el-button @click="handlelogin(formRef)" type="primary" class="submit-btn">提交</el-button>
    </el-form-item>
    <!-- 找回密码 -->
    <el-form-item>
      <!--    <p class="tiparea">忘记密码<a>立即找回</a></p>  -->
    </el-form-item>
  </el-form>
</template>
  
<script lang="ts">
import { getCurrentInstance } from 'vue'
import { ref } from 'vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router'
import { loginUser, rules } from '@/utils/loginValidators'
import { Message } from '@arco-design/web-vue';
import { ElMessageBox } from 'element-plus'
import { login } from '@/api/login'
import type { FormInstance } from 'element-plus'
const formRef = ref<FormInstance>()
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
    // 通过解构getCurrentInstance，获取this，这里的this就是ctx
    // @ts-ignore
    const { ctx } = getCurrentInstance()
    // 触发登录方法
    const router = useRouter()
    const signUpMode = ref(false)

    /// const now = new Date().getTime()
    /// const expireTime = now + 3 * 60 * 1000

    const handlelogin = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid: boolean) => {
        if (valid) {
          login(loginUser)
            .then((res: any) => {
              console.log('login', res);
              if (res.code === 0) {
                window.sessionStorage.setItem('userInfo', 'True')
                window.sessionStorage.setItem('userRole', res.data.role)
                window.sessionStorage.setItem('usernames', loginUser.name)
                window.sessionStorage.setItem('token', res.data.token)
                window.sessionStorage.setItem('env', loginUser.env);
                window.localStorage.setItem('env', loginUser.env);

                setTimeout(() => {
                  sessionStorage.clear();
                }, 60 * 60 * 1000);
                // 登录成功
                router.push('/admin/query')
              }
              else {
                ElMessageBox({
                  title: '提示',
                  message: '用户名或密码错误',
                  type: 'warning',
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
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
          console.log('error submit!')
          return false
        }
      })
    }
    return { handlelogin,formRef }
  }
}
</script>
<style scoped>
/* register */
.login-form,
.register-form {
  background-color: #fff;
  padding: 50px 80px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit-btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
  width: 100%;
}

.tiparea a {
  color: #409eff;
}
</style>
