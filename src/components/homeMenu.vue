<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="menu-height"
      @select="handleSelect">
      <el-menu-item index="0">
        <i class="el-icon-menu"></i>
        <span slot="title">主页</span>
      </el-menu-item>
      <el-menu-item :index="item.type_id.toString()" v-for="item in navData" :key="item.type_id">
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.type_name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "homeMenu",
    data(){
      return{
        activeIndex: (this.$store.state.menuId).toString(),
        navData: []
      }
    },
    mounted(){
      this.typeList();
    },
    computed: {
      changeNav() {
        return this.$store.state.navChange
      }
    },
    // 监听
    watch:{
      changeNav(val) {
        this.typeList();
      }
    },
    methods: {
      typeList() {
        let th = this;
        let url = '/typeList';
        let params = {
          userId: this.$store.state.login.id,
        };
        //->调用第一个接口的请求服务
        this.reqM1Service(url, params).then(
          res => {
            if(res.code === 200){
              console.log(res.data);
              th.navData = res.data;
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      },
      handleSelect(key, keyPath) {
        this.$store.commit("editHead",null);
        this.$store.commit("editMenu",key.toString());
        console.log(this.$store.state.headActive);
        if (key==='0') {
          this.$router.push({ name:"index" });
        }else{
          this.$router.push({ name: 'cost', query: { searchId: key } })
        }
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="less">
.menu-height{
  height: calc(100vh - 90px);
}
</style>
