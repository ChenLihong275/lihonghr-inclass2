import request from '@/utils/request'

export function login(data) {
  return request.post('/sys/login', data)
}

export function getUserInfo() {
  return request('/sys/profile')
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
// 修改密码
export const editPassword = (data) => {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data: data
  })
}
