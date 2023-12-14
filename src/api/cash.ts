import { request } from '@/utils/request'

export function getSharoRatioService() {
  return request({
    url: '/api/cash/shareratio',
    method: 'GET',
  });
}

export function updateSharoRatioService(id: string, value: number) {
  return request({
    url: '/api/cash/shareratio/update',
    method: 'POST',
    data: { id, value }
  });
}

export function getUsersShareRatioService(page: number, pageSize: number = 50) {
  return request({
    url: '/api/cash/shareratio/users',
    method: 'GET',
    params: { page, pageSize }
  });
}

export function searchUsersShareRatioService(values: string) {
  return request({
    url: '/api/cash/shareratio/users/search',
    method: 'GET',
    params: { values }
  });
}
