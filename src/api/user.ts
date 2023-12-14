import { request } from '@/utils/request'

export function getUserInfo(page: number = 1) {
  return request({
    url: '/api/user_info',
    method: 'get',
    params: { page }
  })
}

export function searchUser(words: string = '') {
  return request({
    url: '/api/user_info/search',
    method: 'GET',
    params: { values: words }
  })
}

