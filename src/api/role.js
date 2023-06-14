import request from '@/utils/request'
// 获取部门列表
export function getRoleList(data) {
  console.log(JSON.parse(JSON.stringify(data)))
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
