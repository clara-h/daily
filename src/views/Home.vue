<template>
  <div class="home">
    <!--头部-->
    <home-head></home-head>

    <div class="homeMain">
      <!--侧边菜单-->
      <home-menu class="fl-menu"></home-menu>
      <div class="home-center">
        <router-view />
      </div>
    </div>


  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import homeHead from "../components/homeHead";
import homeMenu from "../components/homeMenu";

export default {
  name: "Home",
  components: {
    HelloWorld,
    homeHead,
    homeMenu
  }
};
</script>

<style lang="less">
  .homeMain{
    display: flex;
    .fl-menu{
      width: 210px;
    }
    .home-center{
      width: calc(100% - 210px);
    }
  }
</style>
