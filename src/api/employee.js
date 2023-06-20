import request from '@/utils/request'
// 获取部门列表
export const getEmployeeList = (data) => {
  return request({
    method: 'get',
    url: '/sys/user',
    params: data
  })
}
// 导出excel文件
export const getExcelData = () => {
  return request({
    method: 'get',
    url: '/sys/user/export',
    responseType: 'blob'
  })
}
// 下载导入模板
export const getExcelTemplat = () => {
  return request({
    method: 'get',
    url: '/sys/user/import/template',
    responseType: 'blob'
  })
}
// 上传excel文件
export const uploadExcel = (data) => {
  return request({
    method: 'post',
    url: '/sys/user/import',
    data
  })
}
// 删除员工
export const delEmployeeItem = (data) => {
  return request({
    method: 'delete',
    url: `/sys/user/${data}`
  })
}
// 新增员工
export const addEmployeeItem = (data) => {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
// 获取员工详情
export const getEmployeeItem = (data) => {
  return request({
    method: 'get',
    url: `/sys/user/${data}`
  })
}
// 修改员工
export const editEmployeeItem = (data) => {
  return request({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}
// 员工分配角色
export const assignRoles = (data) => {
  return request({
    method: 'put',
    url: '/sys/user/assignRoles',
    data
  })
}
// 获取角色列表
// export const getRoleList = (data) => {
//   return request({
//     method: 'get',
//     url: '/sys/user',
//     params: data
//   })
// }

