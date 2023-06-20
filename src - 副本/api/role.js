import request from '@/utils/request'
// 获取角色列表
export function getRoleList(data) {
  // console.log(JSON.parse(JSON.stringify(data)))
  return request({
    method: 'get',
    url: '/sys/role',
    params: data
  })
}
// 添加角色
export const addRole = (data) => {
  return request({
    method: 'post',
    url: '/sys/role',
    data: {
      name: data.name,
      description: data.description,
      state: data.state
    }
  })
}
// 获取角色详情
export function getRoleItem(data) {
  return request({
    method: 'get',
    url: `/sys/role/${data}`
  })
}
// 修改角色
export const editRoleItem = (data) => {
  return request({
    method: 'put',
    url: `/sys/role/${data.id}`,
    data
  })
}
// 删除角色
export const delRoleItem = (data) => {
  return request({
    method: 'delete',
    url: `/sys/role/${data}`
  })
}
// 获取已启用的角色列表
export function getEnableRoleList() {
  return request({
    method: 'get',
    url: '/sys/role/list/enabled'
  })
}
// 获取权限点列表

export function getPermissionList() {
  return request({
    method: 'get',
    url: '/sys/permission'
  })
}
// 分配权限
export const assignPermission = (data) => {
  return request({
    method: 'put',
    url: '/sys/role/assignPrem',
    data
  })
}

