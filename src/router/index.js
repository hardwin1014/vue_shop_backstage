import Vue from "vue";
import VueRouter from "vue-router"; 
// 路由懒加载
Vue.use(VueRouter);
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: () => import("@/components/Login.vue") },
  { path: "/home", component: () => import("@/components/Home.vue") }
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
