
export default {
  //修改用户信息
  edit(state,data){
    state.login=data;
  },
  //修改头部菜单
  editHead(state,data){
    state.headActive=data;
  }
}
