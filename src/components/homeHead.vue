<template>
  <div class="costHead">
    <div class="cost-logo">LOGO</div>
    <!--nav-->
    <div class="head-nav">
      <a v-for="item in navList"
         :key="item.id "
         class="nav"
         :class="{'active': (item.id === activeIndex )}"
          @click="navClick(item.id,item)">
        <glSvgIcon class="head-icon" :iconClass="item.icon" />
        {{item.name}}
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "homeHead",
    data(){
      return {
        activeIndex:this.$store.state.headActive,
        navList: [
          {
            id: '1',
            name: '类型',
            icon: 'type',
            path: 'type'
          },
          {
            id: '2',
            name: '分类',
            icon: 'class',
            path: 'class'
          },
          {
            id: '3',
            name: '个人中心',
            icon: 'person',
            path: 'personCenter'
          },
          {
            id: '4',
            name: '退出',
            icon: 'exit',
            path: 'login'
          },
        ]
      }
    },
    methods: {
      navClick(id,item) {
        this.$store.commit("editHead",id)
        this.activeIndex = this.$store.state.headActive;
        this.$router.push({name:item.path})
        if(id==='4') {
          this.$store.commit("edit",'')
          window.sessionStorage.clear()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.costHead{
  display: flex;
  height: 90px;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: #fff;
  .cost-logo{
    padding:0 20px;
    font-size: 30px;
  }
  .head-nav{
    display: flex;
    align-items: center;
    .nav{
      padding: 0 20px;
      font-size: 18px;
      color: #fff;
      opacity: 0.7;
      .head-icon{
        margin-right: 8px;
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
    .nav:hover{
      opacity: 1;
    }
    .active{
      opacity: 1;
    }
  }
}
</style>
