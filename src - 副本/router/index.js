import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// ├── attendance          # 考勤管理
// ├── approval            # 审批管理
// ├── department          # 组织架构
// ├── employee            # 员工管理
// ├── permission          # 权限管理
// ├── role                # 角色管理
// ├── salary              # 工资管理
// ├── social              # 社保管理

import Layout from '@/layout'
// 导入组件
import attendanceRouter from '@/router/modules/attendance'
import approvalRouter from '@/router/modules/approval'
import departmentRouter from '@/router/modules/department'
import employeeRouter from '@/router/modules/employee'
import permissionRouter from '@/router/modules/permission'
import roleRouter from '@/router/modules/role'
import salaryRouter from '@/router/modules/salary'
import socialRouter from '@/router/modules/social'

// 静态路由
// 分为静态路由规则和动态路由规则，方便后期权限分配
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]
// 动态路由，方便设置权限
export const asyncRoutes = [
  departmentRouter,
  roleRouter,
  employeeRouter,
  permissionRouter,
  attendanceRouter,
  approvalRouter,
  salaryRouter,
  socialRouter
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 动态路由根据员工权限进行动态添加，后期配置权限后只保留静态路由
  // routes: [...constantRoutes, ...asyncRoutes, { path: '*', redirect: '/404', hidden: true }]
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
