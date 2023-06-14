import router from './router'
import NProgress from 'nprogress' // 引入上方进度条组件
import 'nprogress/nprogress.css' // 引入进度条样式
import store from './store'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  // 进度条开启
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      // 在导航前置守卫中让所有页面都可以获取到个人信息
      // 直接判断仓库中有没有userID,若没有，则发送请求
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      // 进度条关闭,在next中定义了跳转地址，就不会走路由后置守卫了
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 进度条关闭
  NProgress.done()
})
