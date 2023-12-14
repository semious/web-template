import { request } from '@/utils/request'

export function getPayOrder(page: number = 1, productType: number, payStatus: number) {
  return request({
    url: '/api/user_order',
    method: 'GET',
    params: { page, productType, payStatus }
  })
}

export function searchPayOrder(words: string = '') {
  return request({
    url: '/api/user_order/search',
    method: 'GET',
    params: { values: (words) }
  })
}

export function searchPayOrderByPhone(phone: string, page: number = 1, productType: string) {
  return request({
    url: '/api/user_order/search/phone',
    method: 'GET',
    params: { phone, page, productType }
  })
}
