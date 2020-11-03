<template>
  <div class="index-main">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="(item,index) in titList">
        <el-card class="box-card statis-card">
          <div slot="header" class="clearfix">
            <span class="fl">{{item.type_name}}</span>
          </div>
          <div class="sum">
            总计消费：<b>{{allPrice[index]}}</b>元
            <div class="link-btn">
              <el-button size="mini" @click="linkDetail(item.type_id)">详情</el-button>
              <el-button size="mini" @click="linkChart(item.type_id)">图表</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        titList: [],
        allPrice: [],
      }
    },
    created() {
      this.typeList();
    },
    mounted(){
    },
    methods: {
      //获取对应的数据
      getPrice(id){
        let th = this;
        let url = '/costList';
        let params = {
          userId: this.$store.state.login.id,
          typeId: id,
        };
        console.log(params)
        //->调用第一个接口的请求服务
        this.reqM1Service(url, params).then(
          res => {
            if(res.code === 200){
              console.log(res.data);
              let sum = 0;
              for(var i =0; i<res.data.length; i++){
                sum += res.data[i].price;
              }
              this.allPrice.push((sum).toFixed(2));
              //console.log(id);
              console.log(this.allPrice);
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      },
      // 总计
      getSum(data) {
        console.log(data)
        for (var i=0; i<data.length; i++){
          this.getPrice(data[i].type_id);
        }
      },
      typeList() {
        let th = this;
        let url = '/typeList';
        let params = {
          userId: this.$store.state.login.id,
        };
        //->调用第一个接口的请求服务
        this.reqM1Service(url, params).then(
          res => {
            if (res.code === 200) {
              console.log(res.data);
              th.titList = res.data;
              console.log(th.titList);
              th.getSum(this.titList)
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {
          })
      },
      // 跳转详情
      linkDetail(key){
        this.$router.push({ name: 'cost', query: { searchId: key } })
      },
      // 跳转图表
      linkChart(key) {
        this.$router.push({ name:'dailyEchart', query: { searchId: key } })
      }
    }
  }
</script>

<style lang="less" scoped>
.index-main{
  padding: 20px;
  .statis-card{
    font-size: 14px;
    margin-bottom: 20px;
    .sum{
      b{
        font-size: 18px;
      }
      .link-btn{
        margin-top: 15px;
      }
    }
  }
}
</style>
