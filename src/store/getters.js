const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userForm.userId,
  avatar: state => state.user.userForm.staffPhoto,
  username: state => state.user.userForm.username,
  name: state => state.user.name
}
export default getters
