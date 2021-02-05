<template>
  <div class="echart-main">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="echart-tit">{{titName}}{{$t('echartTxt.tit')}}</span>
      </div>
      <div class="text item">
        <div id="myChart" :style="{width:'100%', height:'400px'}"></div>
        <div id="barChart" :style="{width:'100%', height:'400px'}"></div>
      </div>
    </el-card>

    <el-dialog :title="$t('echartTxt.costName')" :visible.sync="dialogTableVisible" width="80%">
      <div class="clearfix top-search">
        <span class="fl">{{$t('echartTxt.searchTxt')}}：</span>
        <el-input-number v-model="priceNum" controls-position="right" :min="1" :step="100" :max="1000"></el-input-number>
      </div>
      <el-table :data="gridData"
                :summary-method="getSummaries"
                show-summary
                :rowClassName = "fnRowClass">
        <el-table-column
          prop="cost_date"
          :label="$t('tableTxt.date')">
        </el-table-column>
        <el-table-column
          prop="cost_name"
          :label="$t('tableTxt.name')">
        </el-table-column>
        <el-table-column
          prop="class_name"
          :label="$t('tableTxt.type')">
        </el-table-column>
        <el-table-column
          prop="price"
          :label="$t('tableTxt.price')">
        </el-table-column>
        <el-table-column
          prop="cost_time"
          :label="$t('tableTxt.time')">
        </el-table-column>
        <el-table-column
          prop="cost_info"
          :label="$t('tableTxt.info')"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-dialog>
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
        classCost:[],
        dialogTableVisible: false,
        gridData: [],
        priceNum: 200
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
              //console.log(res.data);
              for(var i =0; i<res.data.length; i++){
                th.barData.push(res.data[i].class_name);
                th.getCost(res.data[i].class_id);
              }
              //console.log(th.barData);
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      },
      //获取类型的总消费
      getEchartData(num,val,th){
        let url = '/echartCostList';
        let data = {};
        if (num === 1){
          //console.log(num)
          data = {
            userId: th.$store.state.login.id,
            typeId: th.$route.query.searchId,
            className: val,
          };
        }else{
          //console.log(num)
          data = {
            userId: th.$store.state.login.id,
            typeId: th.$route.query.searchId,
            time: val,
          };
        }
        //console.log(data);
        //->调用第一个接口的请求服务
        th.reqM1Service(url, data).then(
          res => {
            if(res.code === 200){
              console.log(res.data);
              th.gridData = res.data;
              for(var i =0; i<res.data.length; i++){
                th.gridData[i].time = th.$moment(res.data[i].cost_time).format('YYYY-MM-DD HH:mm:ss');
                th.gridData[i].cost_date = th.$moment(res.data[i].cost_time).format('YYYY-MM-DD');
                th.gridData[i].cost_time = th.$moment(res.data[i].cost_time).format('HH:mm:ss');
              }
              console.log(th.gridData)
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
              th.classCost.push(sum.toFixed(2));
              console.log(th.classCost)
              th.dailyBar(th.barData,th.classCost,th);
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
        let sum =0,n=0;
        for(let i=0;i<data.length;i++){
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
        this.allPrice.forEach((value,i) => {
          this.allPrice[i] = value.toFixed(2)
        })
        this.dailyLine(this.daily,this.allPrice,this);
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
      dailyLine(xData,yData,th){
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
            },
            formatter: function (params) {
              return params[0].name + '<br>'+params[0].seriesName+":"+params[0].data+'￥';
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
          series: [
            {
              name: this.$t('echartTxt.echartTit'),
              type: 'bar',
              data: yData,
              markPoint: {
                symbol: 'pin', //标记(气泡)的图形
                symbolSize: 80, //标记(气泡)的大小
                itemStyle:{
                  color: '#4587E7', //图形的颜色。
                  borderColor: '#000',//图形的描边颜色。支持的颜色格式同 color，不支持回调函数。
                  borderWidth: 0,//描边线宽。为 0 时无描边。
                  borderType: 'solid' //柱条的描边类型，默认为实线，支持 ‘solid’, ‘dashed’, ‘dotted’。
                },
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              }
            },
            {
              name: this.$t('echartTxt.echartTit'),
              type: 'line',
              data: yData,
            },
          ]
        });
        myChart.on('click', function (params) {
          th.dialogTableVisible = true;
          // console.log(params)
          th.getEchartData(2,params.name,th)
        })
      },
      // 饼图
      dailyBar(data,yData,th){
        console.log(data);
        console.log(this.barData);
        var itemData = [];
        var obj = {};
        for(var i =0; i<data.length;i++){
          obj = {value:yData[i],name:data[i]}
          itemData.push(obj);
        }
        //console.log(itemData);
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
            formatter: '{a} <br/>{b} : {c}￥  ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: data
          },
          series: [
            {
              name: this.$t('echartTxt.echartTit'),
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
        });
        myChart.on('click', function (params) {
          th.dialogTableVisible = true;
          //console.log(params);
          th.getEchartData(1,params.name,th)
          //console.log(params);
        })
      },
      // 给大于一定金额的加样式
      fnRowClass({row,column,rowIndex,columnIndex}){
        console.log(row.price)
        return row.price > this.priceNum ? "csbsTypes" :""
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = this.$t('echartTxt.totalPrice');
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = (sums[index]).toFixed(2) + ' ' + this.$t('echartTxt.money');
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
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
  .top-search{
    display: flex;
    //justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
</style>
<style lang="less">
  .el-table .csbsTypes td{
    background-color: rgba(255, 244, 209, 0.62) !important;
  }
  .el-table__footer .has-gutter td{
    background-color: #d9d9d9;
  }
</style>
