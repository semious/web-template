import { request } from '@/utils/request'

export function getUserOrderQuery(userPhone: string, userWeixin: string) {
  return request({
    url: '/api/query',
    method: 'get',
    params: { userPhone, userWeixin }
  })
}

export function addUserOrderQuery(userPhone: string, userWeixin: string) {
  return request({
    url: '/api/query/add',
    method: 'post',
    data: { userPhone, userWeixin }
  })
}
