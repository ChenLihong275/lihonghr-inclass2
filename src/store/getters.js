const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userForm.userId, // 用户id
  avatar: state => state.user.userForm.staffPhoto, // 用户头像
  username: state => state.user.userForm.username,
  userForm: state => state.user.userForm, // 用户信息表单
  routes: state => state.user.routes,
  name: state => state.user.userForm.username, // 用户名称
  company: state => state.user.userForm.company, // 公司名称
  departmentName: state => state.user.userForm.departmentName // 部门名称
}
export default getters
