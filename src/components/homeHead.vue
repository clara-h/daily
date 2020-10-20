<template>
  <div class="costHead">
    <div class="cost-logo">LOGO</div>
    <!--nav-->
    <div class="head-nav">
      <a v-for="item in navList" :key="item.id " class="nav">
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
        navList: [
          {
            id: '1',
            name: '类型',
            icon: 'type'
          },
          {
            id: '2',
            name: '分类',
            icon: 'class'
          },
          {
            id: '3',
            name: '个人中心',
            icon: 'person'
          },
          {
            id: '4',
            name: '退出',
            icon: 'exit'
          },
        ]
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
  }
}
</style>
