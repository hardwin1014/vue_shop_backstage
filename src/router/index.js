import Vue from "vue";
import VueRouter from "vue-router"; 
// 路由懒加载
Vue.use(VueRouter);
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name:'login',component: () => import("@/components/Login.vue") },
  { path: "/home", 
    name:'home',
    component: () => import("@/components/Home.vue"),
    redirect:'/welcome',
    children:[
      {
      path:'/welcome',
      name:'welcome',
      component: () => import("@/components/Welcome.vue")},
      {
        path:'/users',
        name:'users',
        component: () => import("@/components/user/Users.vue")
      },
      {
        path:'/rights',
        name:'rights',
        component: () => import("@/components/power/Rights.vue")
      },
      {
        path:'/roles',
        name:'roles',
        component: () => import("@/components/power/Roles.vue")
      },
      {
        path:'/categories',
        name:'categories',
        component: () => import("@/components/goods/Cate.vue")
      },
      {
        path:'/params',
        name:'params',
        component: () => import("@/components/goods/Params.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数，代表方行
  // next()方行 next('/login')强制跳转
  if (to.path === "/login") return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
