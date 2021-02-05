<template>
  <div class="person-center">
    <el-card class="box-card">
      <div slot="header" class="clearfix person-head">
        <span class="fl tit">{{$t('perconCenter.tit')}}</span>
        <!--操作按钮-->
        <div class="head-btn fr">
          <el-button type="primary" @click="">{{$t('perconCenter.changePwd')}}</el-button>
        </div>
      </div>
      <div class="user-info">
        <p class="info-main" v-for="(item,index) in info" :key="index">
          <span class="info-name">{{item.name}}：</span>
          <b class="infor-val" v-if="item.id === '3'">
            <span v-if="item.value ===1">{{$t('perconCenter.enable')}}</span>
            <span v-else>{{$t('perconCenter.disable')}}</span>
          </b>
          <b class="infor-val" v-else>{{item.value}}</b>
        </p>
      </div>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "perconCenter",
    data() {
      return {
        info:[
          {
            id:'1',
            name: this.$t('perconCenter.name'),
            value: this.$store.state.login.name
          },
          {
            id:'2',
            name: this.$t('perconCenter.time'),
            value: this.$store.state.login.time
          },
          {
            id:'3',
            name: this.$t('perconCenter.state'),
            value: this.$store.state.login.tate
          }
        ]
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style lang="less" scoped>
.person-center{
  padding: 20px;
  .person-head{
    // padding-bottom: 20px;
    .tit{
      font-size: 16px;
      font-weight: bold;
      line-height: 40px;
    }
  }
  .info-main{
    display: flex;
    padding: 20px 0;
    font-size: 14px;
    .info-name{
      width: 120px;
      text-align: right;
      padding-right: 20px;
    }
  }
}
</style>
