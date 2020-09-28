
const about = () => import(/* webpackChunkName: "about" */ "../views/About.vue")

export default [
  {
    path:"/home/about",
    name:"about",
    meta: {
      title: "关于",
      keepAlive: true
    },
    component: about
  }
]
