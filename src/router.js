import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import Layout from '@/views/Layout.vue'
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      meta: {
        title: '用户登录'
      },
      component: () => import("@/views/auth/Login.vue")
    },
    {
      path: "/register",
      name: "register",
      meta: {
        title: '用户注册'
      },
      component: () => import("@/views/auth/Register.vue")
    },
    {
      path: "/changepassword",
      name: "changepassword",
      meta: {
        title: '修改密码'
      },
      component: () => import("@/views/auth/ChangePassword.vue")
    },
    {
      path: "/resetpassword",
      name: "resetpassword",
      meta: {
        title: '重置密码'
      },
      component: () => import("@/views/auth/ResetPassword.vue")
    },
    {
      path: '/',
      component: Layout,
      redirect: '/account/transfer',
      children: [
        {
          path: '/account/transfer',
          component: () => import('@/components/transferTable.vue'),
          name: 'Transfer',
          meta: {
            title: '转账记录',
            requireAuth: true,
            breadcrumb: ['WWWCion管理', '转账记录']
          }
        }
      ]
    },
    {
      path: '/',
      component: Layout,
      redirect: '/admin/role',
      children: [
        {
          path: '/admin/role',
          component: () => import('@/components/userTable.vue'),
          name: 'Role',
          meta: {
            title: '角色设置',
            requireAuth: true,
            breadcrumb: ['用户管理', '角色设置']
          }
        }
      ]
    },
  ]
});

router.beforeEach((to, form, next) => {
  if (to.meta.title) {
    document.title=to.meta.title
  }
  if (to.matched.some(record => record.meta.requireAuth)){  // 判断该路由是否需要登录权限
    if (localStorage.getItem('token')) {  // 判断当前的token是否存在
      next();
    }
    else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
})

export default router
