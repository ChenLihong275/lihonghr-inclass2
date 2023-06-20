import request from '@/utils/request'
// 获取部门列表
export function getDeptList() {
  return request('/company/department')
}
// 获取部门负责人列表
export const getDeptManager = () => {
  return request('/sys/user/simple')
}
// 添加子部门
export const addDepartmentItem = (data) => {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
// 修改部门
export const editDepartmentItem = (data) => {
  return request({
    method: 'put',
    url: `/company/department/${data.id}`,
    data
  })
}
// 获取部门详情
export const getDepartmentDetail = (data) => {
  return request(`/company/department/${data}`)
}
// 删除部门
export const delDepartmentDetail = (data) => {
  return request.delete(`/company/department/${data}`)
}
