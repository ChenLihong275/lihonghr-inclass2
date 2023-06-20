import request from '@/utils/request'
// 获取权限列表
export const getPermissionList = () => {
  return request({
    method: 'get',
    url: '/sys/permission'
  })
}
// 获取权限点详情

export const getPermissionItem = (data) => {
  return request({
    method: 'get',
    url: `/sys/permission/${data}`
  })
}
// 添加权限
export const addPermissionItem = (data) => {
  return request({
    method: 'post',
    url: '/sys/permission',
    data
  })
}
// 修改权限
export const editPermissionItem = (data) => {
  return request({
    method: 'put',
    url: `/sys/permission/${data.id}`,
    data
  })
}
// 删除权限点
export const delPermissionItem = (data) => {
  return request({
    method: 'delete',
    url: `/sys/permission/${data}`
  })
}
