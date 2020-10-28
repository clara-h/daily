
const about = () => import(/* webpackChunkName: "about" */ "../views/About.vue")
const index = () => import(/* webpackChunkName: "index" */ "../views/index/index.vue")
const costType = () => import(/* webpackChunkName: "costType" */ "../views/type/type.vue")
const costClass = () => import(/* webpackChunkName: "costClass" */ "../views/class/class.vue")
const personCenter = () => import(/* webpackChunkName: "personCenter" */ "../views/personCenter/personCenter.vue")
const costDetail = () => import(/* webpackChunkName: "costDetail" */ "../views/cost/cost.vue")

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
    path:"/home/index",
    name:"index",
    meta: {
      title: "主页",
      keepAlive: true
    },
    component: index
  },
  {
    path: "/home",
    redirect: {
      path: "/home/index"
    }
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
  {
    path:"/home/cost",
    name:"cost",
    meta: {
      title: "消费详情",
      keepAlive: true
    },
    component: costDetail
  },
]
