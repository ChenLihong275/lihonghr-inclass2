import { editPassword, getUserInfo, login } from '@/api/user'
import { constantRoutes, resetRouter } from '@/router'
import { getToken, removeToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state() {
    return {
      token: getToken() || '',
      userForm: {},
      routes: constantRoutes
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
    },
    setRoutes(state, value) {
      state.routes = [...constantRoutes, ...value]
    },
    clearRoutes(state) {
      state.routes = constantRoutes
    }

  },
  actions: {
    async login({ commit }, data) {
      const token = await login(data)
      commit('setToken', token)
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      commit('setUserForm', res)
      console.log(JSON.parse(JSON.stringify(res)))
      return res
    },
    // 退出登录
    async logout({ commit }) {
      commit('removeToken')
      commit('setUserForm', {})
      // commit('clearRoutes')
      resetRouter()
    },
    async editPassword({ commit }, data) {
      await editPassword(data)
    }

  }
}

