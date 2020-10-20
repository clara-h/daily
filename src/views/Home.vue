<template>
  <div class="home">
    <!--头部-->
    <home-head></home-head>



    <div id="nav">
      <router-link to="/home">Home</router-link> |
      <router-link to="/home/about">About</router-link>
    </div>
    <router-view />
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import homeHead from "../components/homeHead";


export default {
  name: "Home",
  components: {
    HelloWorld,
    homeHead
  }
};
</script>
