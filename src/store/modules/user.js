import { editPassword, getUserInfo, login } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state() {
    return {
      token: getToken() || '',
      userForm: {}
    }
  },
  mutations: {
    setToken(state, value) {
      state.token = value
      setToken(value)
    },
    removeToken(state) {
      state.token = ''
      removeToken()
    },
    setUserForm(state, value) {
      state.userForm = value
    }

  },
  actions: {
    async login({ commit }, data) {
      const token = await login(data)
      commit('setToken', token)
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      // console.log(res)
      commit('setUserForm', res)
    },
    // 退出登录
    async logout({ commit }) {
      commit('removeToken')
    },
    async editPassword({ commit }, data) {
      await editPassword(data)
    }

  }
}

