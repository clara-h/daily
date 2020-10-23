import children from "./entry";
import Home from "../views/Home.vue";
const login = () => import(/* webpackChunkName: "login" */ '@/views/login/login')
//const entry = () => import(/* webpackChunkName: "entry" */ '@/views/entry/entry')
const register = () => import(/* webpackChunkName: "register" */ '@/views/register/register')
// const iconList = () => import(/* webpackChunkName: "iconList" */ '@/views/homePage/icons/index')



export default [
  {
    path: "/",
    redirect: {
      path: "/login"
    }
  },
  {
    path: "/register",
    name: "register",
    component: register
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    children
  },
  {
    path: "/login",
    name: "login",
    component: login
  },
]
