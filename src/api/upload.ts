import { request } from '@/utils/request'

export function postCad(params: any) {
  return request({
    url: '/clothes/demo/scale',
    method: 'post',
    data: params
  })
}
