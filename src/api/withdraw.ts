import { request } from '@/utils/request'

export function getWithdrawQuery(page: number = 1) {
  return request({
    url: '/api/withdraw',
    method: 'get',
    params: { page }
  })
}

export function updateWithdraw(id: string, status: number, userId: string, amount: string) {
  return request({
    url: '/api/withdraw/update',
    method: 'post',
    data: { id, status, userId, amount }
  })
}
