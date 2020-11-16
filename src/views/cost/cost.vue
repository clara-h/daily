<template>
  <div class="cost-main">
    <el-card class="box-card">
      <div slot="header" class="clearfix table-head">
        <!--搜索-->
        <div class="common-search fl">
          <el-form :inline='true' :model="searchForm" ref="searchForm">
            <el-form-item prop="key" :label="$t('costSearch.keyWord')">
              <el-input type="key" v-model.trim="searchForm.key" autocomplete="off" :placeholder="$t('costSearch.keyWord')" >
              </el-input>
            </el-form-item>
            <el-form-item prop="class" :label="$t('costSearch.type')">
              <el-select v-model="searchForm.class" :placeholder="$t('costSearch.typeTip')">
                <el-option v-for="item in classData" :label="item.class_name" :value="item.class_id" :key="item.class_id"></el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="submitForm('searchForm')" icon="el-icon-search">{{$t('costSearch.secrchBtn')}}</el-button>
            <el-button type="primary" @click="linkChart($route.query.searchId)">{{$t('costSearch.chartBtn')}}</el-button>
          </el-form>
        </div>
        <!--操作按钮-->
        <div class="head-btn fr">
          <el-button type="primary" @click="addDialog">{{$t('costSearch.addBtn')}}</el-button>
          <el-button type="danger" @click="handleDelete(ids)">{{$t('costSearch.deleteBtn')}}</el-button>
        </div>
      </div>
      <div class="common-table">
        <el-table
          :data="tableData"
          border
          size="small"
          style="width: 100%"
          height="400px"
          show-summary
          @selection-change="handleSelectionChange"
          :span-method="objectSpanMethod"
          :header-cell-style="tableHeaderColor"
          :summary-method="getSummaries">
          <el-table-column
            :label="$t('tableTxt.day')"
            width="70">
            <template slot-scope="scope">
              <span>{{rowIndex[scope.$index]+1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cost_date"
            :label="$t('tableTxt.date')">
          </el-table-column>
          <el-table-column
            type="selection"
            width="55">
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
          <el-table-column :label="$t('tableTxt.operate')" width="160">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)">{{$t('tableTxt.editBtn')}}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)">{{$t('tableTxt.deleteBtn')}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            :label="$t('tableTxt.allPrice')">
            <template slot-scope="scope">
              <span>{{(allPrice[rowIndex[scope.$index]]).toFixed(2)}} {{$t('indexTxt.money')}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--编辑&添加弹窗-->
    <el-dialog :title="titleType+' '+$t('dialogTxt.tit')" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" class="textLeft" ref="dialogForm" :rules="rules">
        <el-form-item :label="$t('tableTxt.name')" label-width="80px" prop="name">
          <el-input v-model.trim="dialogForm.name" autocomplete="off" class="widthName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tableTxt.date')" label-width="80px" prop="time">
          <el-date-picker
            v-model="dialogForm.time"
            type="datetime"
            :placeholder="$t('dialogTxt.dateTip')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('tableTxt.type')" label-width="80px" prop="class">
          <el-select v-model="dialogForm.class" :placeholder="$t('dialogTxt.typeTip')">
            <el-option v-for="item in classData" :label="item.class_name" :value="item.class_id" :key="item.class_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tableTxt.price')" label-width="80px" prop="price">
          <el-input v-model.trim="dialogForm.price" autocomplete="off" class="widthName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tableTxt.info')" label-width="80px" prop="loginName">
          <el-input
            type="textarea"
            :placeholder="$t('dialogTxt.infoTip')"
            v-model.trim="dialogForm.info"
            maxlength="30"
            show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('dialogTxt.cancel')}}</el-button>
        <el-button type="primary" @click="subdialog('dialogForm')">{{$t('dialogTxt.define')}}</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "cost",
    data(){
      return {
        searchForm: {
          userId: this.$store.state.login.id,
          key: '',
          class: '',
          typeId:this.$route.query.searchId,
          //time: '',
        },
        classData: [],
        tableData: [],
        titleType:'',//弹窗标题
        dialogFormVisible: false,//添加弹窗
        dialogForm: {
          userId: this.$store.state.login.id,
          typeId:this.$route.query.searchId,
          id: '',
          name:'',
          time:'',
          class:'',
          price:'',
          className: '',
          info:''
        },
        ids:[],//要删除的id
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          class: [
            { required: true, message: '请选择活类型', trigger: 'change' }
          ],
          time: [
            { required: true, message: '请选择时间', trigger: 'change' }
          ],
          price: [
            { required: true, message: '请输入价格', trigger: 'blur' },
            { pattern: /^\d+$|^\d*\.\d+$/g, message: '格式不正确', trigger: 'blur' }
          ],
        },
        spanArr: [],
        rowIndex: [],
        pos:0,
        allPrice:[]
      }
    },
    watch: {
      $route: {
        handler: function (val, oldVal) {
          this.$router.go(0);
          //this.classList();
          //this.submitForm("searchForm");
        }
      }
    },
    created() {
    },
    mounted(){
      this.classList();
      this.submitForm("searchForm");
    },
    methods: {
      //获取相同日期的行数
      getrowIndex(data) {
        console.log(data)
        if(data==null){
          return;
        }
        var sum =0,n=0;
        for(var i=0;i<data.length;i++){
          if(i===0) {
            this.spanArr.push(1)
            this.pos = 0
            this.rowIndex.push(n);
            this.allPrice[i]=data[i].price;
          }else{
            if(data[i].cost_date===data[i-1].cost_date){
              // 如果useName相等就累加，并且push 0
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
              console.log(data[i].cost_date);
              console.log(data[i-1].cost_date);
              this.rowIndex.push(n);
              this.allPrice[n] += data[i].price;
            }else{
              // 不相等push 1
              this.spanArr.push(1)
              this.pos = i
              n++;
              this.rowIndex.push(n);
              this.allPrice[n]=this.tableData[i].price;
            }
          }
        }
        console.log(this.rowIndex);
        console.log(this.allPrice);
      },
      // 修改table header的背景色
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: lightblue;color: #fff;font-weight: 700; font-size:14px;'
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
        this.ids=[];
        for (var i=0;i<val.length;i++){
          this.ids.push( val[i].id)
        }
        console.log(this.ids)
        return this.ids;
      },
      // 分类列表
      classList(){
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
              th.classData = res.data;
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      },
      submitForm(formName) {//查询提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let th = this;
            let url = '/costList';
            let params = {
              userId: this.searchForm.userId,
              key: this.searchForm.key,
              classId: this.searchForm.class,
              typeId: this.searchForm.typeId,
            };
            //->调用第一个接口的请求服务
            this.reqM1Service(url, params).then(
              res => {
                if(res.code === 200){
                  console.log(res.data);
                  th.tableData = res.data;
                  for(var i =0; i<res.data.length; i++){
                    th.tableData[i].time = th.$moment(res.data[i].cost_time).format('YYYY-MM-DD HH:mm:ss');
                    th.tableData[i].cost_date = th.$moment(res.data[i].cost_time).format('YYYY-MM-DD');
                    th.tableData[i].cost_time = th.$moment(res.data[i].cost_time).format('HH:mm:ss');
                  }
                  th.getrowIndex(th.tableData);
                } else {
                  th.$message.error(res.msg);
                }
              })
              .catch(failResponse => {})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 添加类型
      addDialog() {
        this.titleType=this.$t('costSearch.addBtn');
        this.dialogFormVisible = true;
        this.dialogForm.id='';
        this.dialogForm.info= '';
        this.dialogForm.time= '';
        this.dialogForm.class= '';
        this.dialogForm.name='';
        this.dialogForm.price='';
        this.dialogForm.className='';
        this.$nextTick(() => {//清除element残留表单校 验
          this.$refs.dialogForm.clearValidate()
        });
      },
      // 编辑类型
      handleEdit(value) {
        console.log(value.cost_time)
        this.titleType=this.$t('tableTxt.editBtn');
        this.dialogFormVisible = true;
        this.dialogForm.name = value.cost_name;
        this.dialogForm.time= value.time
        this.dialogForm.class= value.class_id;
        this.dialogForm.price=value.price;
        this.dialogForm.info = value.cost_info;
        this.dialogForm.id = value.id;
        this.$nextTick(() => {//清除element残留表单校 验
          this.$refs.dialogForm.clearValidate()
        });
      },
      // 弹窗提交
      subdialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let th = this;
            let url = '/editCost';
            console.log(this.classData)
            var arr = this.classData
            for(var i=0; i<arr.length; i++) {
              if (this.dialogForm.class==arr[i].class_id) {
                this.dialogForm.className = arr[i].class_name;
              }
            }
            let params = {
              id: this.dialogForm.id,
              userId: this.dialogForm.userId,
              typeId: this.dialogForm.typeId,
              name: this.dialogForm.name,
              price:this.dialogForm.price,
              classId:this.dialogForm.class,
              className:this.dialogForm.className,
              info: this.dialogForm.info,
              time: this.$moment(this.dialogForm.time).format('YYYY-MM-DD HH:mm:ss'),
            };
            console.log(params)
            //->调用第一个接口的请求服务
            this.reqM1Service(url, params).then(
              res => {
                if(res.code === 200){
                  this.dialogFormVisible = false;
                  this.submitForm("searchForm");
                  this.$router.go(0);
                } else {
                  th.$message.error(res.msg);
                }
              })
              .catch(failResponse => {})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 删除类行
      handleDelete(id) {
        if (id==''){
          this.$message.error("请先选择要删除的数据！");
          return false;
        }
        if(id instanceof Array) {
          id = id.join(',')
        }
        var th = this;
        let url = '/deleteCost';
        let params = {
          ids:id,
        };
        //->调用第一个接口的请求服务
        this.reqM1Service(url, params).then(
          res => {
            if(res.code === 200){
              th.$message.success("删除成功！");
              this.submitForm("searchForm");
              this.$router.go(0);
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      },
      // 合并相同日期的
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 9) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      // 统计
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = this.$t('tableTxt.statisticTxt');
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (column.label === '总费用' || column.property === 'price') {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index]= (sums[index]).toFixed(2) + this.$t('indexTxt.money');
          } else {
            sums[index] = '--';
          }
        });

        return sums;
      },
      // 跳转统计图表
      linkChart(key) {
        console.log(key);
        this.$router.push({ name:'dailyEchart', query: { searchId: key} })
      }
    }
  }
</script>

<style lang="less" scoped>
.cost-main{
  padding: 20px;
}
  .tab-height{
    height: calc(100vh - 90px);
  }
</style>
<style lang="less">
  .common-search{
    .el-card__header{
      padding-bottom: 0;
      border-bottom: 1px solid #ccc;
    }
    .el-form-item__content{
      width: 180px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 180px;
    }
  }

</style>
