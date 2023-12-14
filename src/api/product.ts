import { request } from '@/utils/request'

export function getProductInfo(page: number = 1) {
  return request({
    url: '/api/product_info',
    method: 'get',
    params: { page }
  })
}

export function getConsultProductInfo(page: number = 1, status: string = '1,2') {
  return request({
    url: '/api/product_info/consult',
    method: 'GET',
    params: { page, status }
  })
}

export function getCourseProductInfo(page: number = 1, status: string = '1,2') {
  return request({
    url: '/api/product_info/course',
    method: 'GET',
    params: { page, status }
  })
}

export function getCourseVideoInfo(page: number = 1, status: string = '1,2', productId: string) {
  return request({
    url: '/api/product_info/video',
    method: 'GET',
    params: { page, status, productId }
  })
}

export function updatesProductInfo(data: any) {
  return request({
    url: '/api/product_info/updates',
    method: 'POST',
    data: { data }
  })
}

export function addProductInfo(data: any) {
  return request({
    url: '/api/product_info/add',
    method: 'POST',
    data: { data }
  })
}

export function searchProduct(words: string = '') {
  return request({
    url: '/api/product_info/search',
    method: 'get',
    params: { values: words }
  })
}
