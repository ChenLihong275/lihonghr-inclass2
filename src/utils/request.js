import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
// import { removeToken } from './auth'

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // console.log(response.data)
  // 在此处拦截错误返回,因为后端给的返回数据均为200，无法正常报错来阻碍代码执行
  // 所以在此处手动进行判断是否报错，并终止promise，返回一个reject错误
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function(error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response.status === 401 && error.response.data.code === 10002) {
    Message.warning('token失效，请重新登录')
    store.commit('user/removeToken')
    router.push('/login')
  }
  return Promise.reject(error)
})

export default instance
