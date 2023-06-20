import request from '@/utils/request'
// 获取首页数据
export const getHomeData = () => {
  return request('/home/data')
}
// 获取首页消息通知
export const getHomeNotice = () => {
  return request('/home/notice')
}
