import "@babel/polyfill";
import Vue from "vue";
import xss from "xss";
import App from "./App.vue";
import router from "./router";

// vuex
import Vuex from "vuex";
import store from "./store";
Vue.use(Vuex);

// axios请求
import axios from "axios"
Vue.prototype.$axios = axios;

// element样式框架
import ElementUI from "element-ui";
//import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

//引入 common.js
import common from "./utils/common.js";
Vue.use(common);

// 引入moment.js
import moment from "moment"
Vue.prototype.$moment = moment;

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//引入 utls.js
import {domain} from './utils/utls.js'

// 国际化
import i18n from "./i18n";

import glSvgIcon from '@/components/common/glSvgIcon/glSvgIcon' // svg组件
// 注册为全局组件

// register globally
Vue.component('glSvgIcon', glSvgIcon);
const req = require.context('./assets/icon/svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);

//配置axiosicons/
//->1,模块一接口,url地址
axios.defaults.baseM1URL = domain.Base_M1_URL;
//->2,模块二接口,url地址
axios.defaults.baseM2URL = domain.Base_M2_URL;
//->3,模块三接口,url地址
axios.defaults.baseM3URL = domain.Base_M3_URL;

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
  i18n,
}).$mount("#app");
