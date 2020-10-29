<template>
  <div class="echart-main">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="echart-tit">{{titName}}消费统计图</span>
      </div>
      <div class="text item">
        <div id="myChart" :style="{width:'100%', height:'400px'}"></div>
        <div id="barChart" :style="{width:'100%', height:'400px'}"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: "dailyEchart",
    data(){
      return{
        tableData: [],
        titInfo: [],
        titName: '',
        daily: [],
        allPrice:[],
        barData: [],
        classCost:[]
      }
    },
    created() {
      this.getTit();
      this.getData();
      this.getClass();
    },
    mounted(){
      //this.dailyBar(this.barData,this.classCost);
    },
    methods: {
      //获取类型
      getClass(){
        let th = this;
        let url = '/classList';
        let params = {
          userId: this.$store.state.login.id,
        };
        //->调用第一个接口的请求服务
        this.reqM1Service(url, params).then(
          res => {
            if(res.code === 200){
              console.log(res.data);
              for(var i =0; i<res.data.length; i++){
                th.barData.push(res.data[i].class_name);
                th.getCost(res.data[i].class_id);
              }
              console.log(th.barData);
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      },
      //获取类型的总消费
      getCost(id){
        let th = this;
        let url = '/costList';
        let params = {
          userId: this.$store.state.login.id,
          typeId: this.$route.query.searchId,
          classId: id,
        };
        console.log(id);
        //->调用第一个接口的请求服务
        this.reqM1Service(url, params).then(
          res => {
            if(res.code === 200){
              console.log(res.data);
              var sum =0;
              for(var i =0; i<res.data.length; i++){
                sum += res.data[i].price
              }
              th.classCost.push(sum);
              console.log(th.classCost)
              th.dailyBar(th.barData,th.classCost);
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      },
      //获取标题
      getTit(){
        let th = this;
        let url = '/typeList';
        let params = {
          id: this.$route.query.searchId,
        };
        //->调用第一个接口的请求服务
        this.reqM1Service(url, params).then(
          res => {
            if(res.code === 200){
              console.log(res.data);
              th.titInfo = res.data;
              th.titName=res.data[0].type_name
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      },
      //把数据变成自己需要的格式
      changData(data){
        console.log(data)
        if(data==null){
          return;
        }
        var sum =0,n=0;
        for(var i=0;i<data.length;i++){
          if(i===0) {
            //this.rowIndex.push(n);
            this.daily[i]=data[i].cost_date;
            this.allPrice[i]=data[i].price;
          }else{
            if(data[i].cost_date===data[i-1].cost_date){
              // 如果useName相等就累加，并且push 0
              console.log(data[i].cost_date);
              console.log(data[i-1].cost_date);
              // this.rowIndex.push(n);
              this.allPrice[n] += data[i].price;
            }else{
              // 不相等push 1
              n++;
              this.daily.push(this.tableData[i].cost_date);
              this.allPrice[n]=this.tableData[i].price;
            }
          }
        }
        console.log(this.daily);
        console.log(this.allPrice);
        this.dailyLine(this.daily,this.allPrice);
      },
      //获取图表需要的数据
      getData(){
        let th = this;
        let url = '/costList';
        let params = {
          userId: this.$store.state.login.id,
          typeId: this.$route.query.searchId,
        };
        //->调用第一个接口的请求服务
        this.reqM1Service(url, params).then(
          res => {
            if(res.code === 200){
              console.log(res.data);
              th.tableData = res.data;
              for(var i =0; i<res.data.length; i++){
                th.tableData[i].cost_date = th.$moment(res.data[i].cost_time).format('YYYY-MM-DD');
              }
              th.changData(th.tableData);
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      },
      //图表
      dailyLine(xData,yData){
        console.log(xData)
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: this.titName
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: {},
          series: [{
            name: '总消费',
            type: 'bar',
            data: yData
          }]
        });
      },
      // 饼图
      dailyBar(data,yData){
        console.log(data);
        console.log(this.barData);

        var itemData = [];
        var obj = {};
        for(var i =0; i<data.length;i++){
          obj = {value:yData[i],name:data[i]}
          itemData.push(obj);
        }
        console.log(itemData);
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('barChart'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: this.titName,
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: data
          },
          series: [
            {
              name: '总消费',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: itemData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.echart-main{
  padding: 20px;
  .echart-tit{
    font-size: 16px;
  }
}
</style>
