<template>
  <div class="costHead">
    <div class="cost-logo">LOGO</div>
    <!--nav-->
    <div class="head-nav">
      <a class="nav" @click="navClick(1,'type')" :class="{'active': (activeIndex === 1 )}">
        <glSvgIcon class="head-icon" iconClass="type" />
        {{$t('topNav.type')}}
      <!--<a v-for="item in navList"
         :key="item.id "
         class="nav"
         :class="{'active': (item.id === activeIndex )}"
          @click="navClick(item.id,item)">
        <glSvgIcon class="head-icon" :iconClass="item.icon" />
        {{item.name}}-->
      </a>
      <a class="nav" @click="navClick(2,'class')" :class="{'active': (activeIndex === 2 )}">
        <glSvgIcon class="head-icon" iconClass="class" />
        {{$t('topNav.class')}}
      </a>
      <a class="nav" @click="navClick(3,'personCenter')" :class="{'active': (activeIndex === 3 )}">
        <glSvgIcon class="head-icon" iconClass="person" />
        {{$t('topNav.center')}}
      </a>
      <a class="nav" @click="navClick(4,'login')" :class="{'active': (activeIndex === 4 )}">
        <glSvgIcon class="head-icon" iconClass="exit" />
        {{$t('topNav.signOut')}}
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
            name: this.$t('topNav.type'),
            icon: 'type',
            path: 'type'
          },
          {
            id: '2',
            name: this.$t('topNav.class'),
            icon: 'class',
            path: 'class'
          },
          {
            id: '3',
            name: this.$t('topNav.center'),
            icon: 'person',
            path: 'personCenter'
          },
          {
            id: '4',
            name: this.$t('topNav.signOut'),
            icon: 'exit',
            path: 'login'
          },
        ]
      }
    },
    created() {
      this.$i18n.locale = this.$store.state.langeType;
    },
    methods: {
      navClick(id,path) {
        this.$store.commit("editHead",id)
        this.activeIndex = this.$store.state.headActive;
        this.$store.commit("editMenu",null);
        this.$router.push({name:path})
        console.log(window.sessionStorage)
        if(id===4) {
          this.$store.commit("edit",'')
          window.sessionStorage.clear()
          console.log(window.sessionStorage)
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
