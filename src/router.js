import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        title: '首页',
        requireAuth: true
      },
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import("./views/About.vue")
    },
    {
      path: "/login",
      name: "login",
      meta: {
        title: '用户登录'
      },
      component: () =>
        import("./views/Login.vue")
    },
    {
      path: "/register",
      name: "register",
      meta: {
        title: '用户注册'
      },
      component: () =>
        import("./views/Register.vue")
    },
    {
      path: "/changepassword",
      name: "changepassword",
      meta: {
        title: '修改密码'
      },
      component: () =>
        import("./views/ChangePassword.vue")
    },
    {
      path: "/resetpassword",
      name: "resetpassword",
      meta: {
        title: '重置密码'
      },
      component: () =>
        import("./views/ResetPassword.vue")
    },
    {
      path: "/list",
      name: "list",
      meta: {
        title: '积分列表',
        requireAuth: true
      },
      component: () =>
        import("./views/List.vue")
    }
  ]
});

router.beforeEach((to, form, next) => {
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
    if (to.meta.title) {
      document.title=to.meta.title
    }
    next();
  }
})

export default router
