
const about = () => import(/* webpackChunkName: "about" */ "../views/About.vue")
const costType = () => import(/* webpackChunkName: "about" */ "../views/type/type.vue")
const costClass = () => import(/* webpackChunkName: "about" */ "../views/class/class.vue")
const personCenter = () => import(/* webpackChunkName: "about" */ "../views/personCenter/personCenter.vue")

export default [
  {
    path:"/home/about",
    name:"about",
    meta: {
      title: "关于",
      keepAlive: true
    },
    component: about
  },
  {
    path:"/home/type",
    name:"type",
    meta: {
      title: "类型",
      keepAlive: true
    },
    component: costType
  },
  {
    path:"/home/class",
    name:"class",
    meta: {
      title: "分类",
      keepAlive: true
    },
    component: costClass
  },
  {
    path:"/home/personCenter",
    name:"personCenter",
    meta: {
      title: "个人中心",
      keepAlive: true
    },
    component: personCenter
  },
]
