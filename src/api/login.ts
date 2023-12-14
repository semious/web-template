import { User } from '@/components/loginValidators'
import { request } from '@/utils/request'

export function login(data: User) {
  return request({
    url: '/login',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
