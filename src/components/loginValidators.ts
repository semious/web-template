import { ref, reactive } from 'vue'

export interface User {
  name: string;
  password: string;
}

// 登录表单
export const loginUser = reactive<User>({
  name: '',
  password: '',
})

interface Rules {
  name: {
    required: boolean;
    //  type: string;
    message: string;
  }[];
  password: ({
    required: boolean;
    message: string;
    minLength: number;
    maxLength: number;
  })[];
}

// 校验规则
export const rules = reactive<Rules>({
  name: [
    {
      required: true,
      message: '用户不得为空',
    }
  ],
  password: [
    // { required: true, message: '密码不得为空', },
    { required: true, minLength: 6, maxLength: 15, message: '密码长度必须在6到15之间', }
  ]
});
