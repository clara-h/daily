import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import modules from "./modules";
//引入vuex-persistedstate
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules,
  //配置vuex-persistedstate
  plugins: [createPersistedState(
    //配置将vuex的状态储存到sessionStorage中（默认储存到localStorage中）
    { storage: window.sessionStorage }
  )]
});
