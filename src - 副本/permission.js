import router from '@/router'
import NProgress from 'nprogress' // 引入上方进度条组件
import 'nprogress/nprogress.css' // 引入进度条样式
import store from './store'
import { asyncRoutes } from '@/router'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404']

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
        const res = await store.dispatch('user/getUserInfo')
        // 在此处设置路由权限，动态添加
        // 1、获取到用户信息中的权限列表
        const routeList = res.roles.menus
        // console.log(routeList)
        // 想要获取路由信息，按需导入，需要在路由出导出
        // console.log(JSON.parse(JSON.stringify(asyncRoutes)))
        // 2、与动态路由信息进行比对筛选,筛选出用户信息中包含的数组
        const filterRoutes = asyncRoutes.filter(item => {
          return routeList.find(ele => ele === item.children[0].name)
        })
        // console.log(JSON.parse(JSON.stringify(filterRoutes)))
        // 3、将筛选出的路由动态添加到路由身上
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // children[0].name
        // 此时路由权限已经完成，然后进行侧边栏一级路由的显示；
        // 将动态路由存放进入vuex，以便侧边栏使用进行渲染(存进vuex仓库中时，需要注意将静态路由也一起存进本地)
        store.commit('user/setRoutes', filterRoutes)
        // console.log(store.getters.routes)
        // 对路由进行再次跳转，因为在addRoutes之前是没有要跳转的这个路径的，
        // 因为addRoutes是动态添加路由的，需要再转发一下；
        next(to.path)
      } else {
        next()
      }
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
