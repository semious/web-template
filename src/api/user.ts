import { request } from '@/utils/request'
import { API_BASE_URL } from './constants'

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

export function getUpRelateUser(id: string) {
  return request({
    url: '/api/user_info/upRelateUser',
    method: 'GET',
    params: { id }
  })
}

export function getDownRelateUser(id: string) {
  return request({
    url: '/api/user_info/downRelateUser',
    method: 'GET',
    params: { id }
  })
}

export function getDownRelateLevelUser(id: string, level: number) {
  return request({
    url: '/api/user_info/downlevel',
    method: 'GET',
    params: { id, level }
  })
}
