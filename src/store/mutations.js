
export default {
  //修改用户信息
  edit(state,data){
    state.login=data;
  },
  //修改头部菜单
  editHead(state,data){
    state.headActive=data;
  },
  //修改导航
  editNav(state,data){
    state.navChange=data;
  },
  //修改菜单
  editMenu(state,data){
    state.menuId=data;
  },
  //修改语言
  editLanges(state,data){
    state.langeType=data;
  },
}
