import { request } from '@/utils/request'

export function getTeacherInfo(page: number = 1, status: string = '1,2') {
  return request({
    url: '/api/teacher_info',
    method: 'get',
    params: { page, status }
  })
}

export function searchTeacher(words: string = '') {
  return request({
    url: '/api/teacher_info/search',
    method: 'get',
    params: { values: words }
  })
}

export function updateTeacher(data: any) {
  return request({
    url: '/api/teacher_info/update',
    method: 'POST',
    data: { data, }
  })
}

// 更新任意数据字段
export function updateTeachers(data: any) {
  return request({
    url: '/api/teacher_info/updates',
    method: 'POST',
    data: { data, }
  })
}

export function addTeacher(data: any) {
  return request({
    url: '/api/teacher_info/add',
    method: 'POST',
    data: { data:{
      teacher_name: data.teacher_name,
      teacher_introduce: data.teacher_introduce,
      teacher_tag: data.teacher_tag,
      teacher_status: data.teacher_status,
      teacher_sort: data.teacher_sort,
      avatar_url: data.avatar_url,
      wx_url: data.wx_url,
    } }
  })
}
