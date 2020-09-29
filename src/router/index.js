import Vue from "vue";
import Router from "vue-router";
import routes from "./list";

// 路由重复点击异常处理
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to,from,next) => {
  //如果用户访问的登录页面或注册页面，直接放行
  if (to.path === "/login" || to.path === "/register") return next();
  //从 sessionStorage 中获取到保存的信息
  console.log(window.sessionStorage);
  console.log(window.sessionStorage.getItem("vuex"));
  const userId = window.sessionStorage.getItem("vuex");
  //没有则强制跳转到登录页面
  if (!userId) return next("/login");
  next();
});

export default router;

