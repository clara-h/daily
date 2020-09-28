import "@babel/polyfill";
import Vue from "vue";
import xss from "xss";
import App from "./App.vue";
import router from "./router";

// vuex
import Vuex from "vuex";
import store from "./store";
Vue.use(Vuex);

// element样式框架
import ElementUI from "element-ui";
//import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import "@/assets/scss/element-variables.scss";
import "@/assets/less/base.less";
import "@/assets/less/app.less";
import "@/assets/less/common.less";

Vue.config.productionTip = false;

Object.defineProperty(Vue.prototype, "$xss", {
  value: xss
});

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount("#app");
