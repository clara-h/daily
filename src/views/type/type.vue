<template>
  <div class="type-main">
    <el-card class="box-card">
      <div slot="header" class="clearfix table-head">
        <!--搜索-->
        <div class="common-search fl">
          <el-form :inline='true' :model="searchForm" ref="searchForm">
            <el-form-item prop="key" label="关键字">
              <el-input type="key" v-model.trim="searchForm.key" autocomplete="off" placeholder="关键字" >
              </el-input>
            </el-form-item>
            <el-button type="primary" @click="submitForm('searchForm')" icon="el-icon-search">查询</el-button>
          </el-form>
        </div>
        <!--操作按钮-->
        <div class="head-btn fr">
          <el-button type="primary" @click="addDialog">添加</el-button>
          <el-button type="danger" @click="handleDelete(ids)">删除</el-button>
        </div>
      </div>
      <div class="common-table">
        <el-table
          :data="tableData"
          border
          size="small"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="tableHeaderColor">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="type_name"
            label="名称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="type_time"
            label="创建时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="type_info"
            label="说明"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.type_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--编辑&添加弹窗-->
    <el-dialog :title="titleType+'分类'" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" class="textLeft" ref="dialogForm" :rules="rules">
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model.trim="dialogForm.name" autocomplete="off" class="widthName"></el-input>
        </el-form-item>
        <el-form-item label="说明" label-width="80px" prop="loginName">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model.trim="dialogForm.info"
            maxlength="30"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subdialog('dialogForm')">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "type",
    data(){
      return {
        searchForm: {
          userId: this.$store.state.login.id,
          key: '',
        },
        tableData: [],
        titleType:'',//弹窗标题
        dialogFormVisible: false,//添加弹窗
        dialogForm: {
          userId: this.$store.state.login.id,
          id: '',
          name:'',
          info:''
        },
        ids:[],//要删除的id
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    created() {
    },
    mounted(){
      this.submitForm("searchForm");
      // this.changeDate(this.time);
    },
    methods: {
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
          this.ids.push( val[i].type_id)
        }
        console.log(this.ids)
        return this.ids;
      },
      submitForm(formName) {//查询提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let th = this;
            let url = '/typeList';
            let params = {
              userId: this.searchForm.userId,
              key: this.searchForm.key,
            };
            //->调用第一个接口的请求服务
            this.reqM1Service(url, params).then(
              res => {
                if(res.code === 200){
                  console.log(res.data);
                  th.tableData = res.data;
                  for(var i =0; i<res.data.length+1; i++){
                    th.tableData[i].type_time = th.$moment(th.tableData[i].type_time).format('YYYY-MM-DD HH:mm:ss');
                    //console.log(th.tableData[i].type_time);
                  }
                  th.tableData = res.data;
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
      formatDateTime(date) { // 修改时间格式
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h=h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second=date.getSeconds();
        second=second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d;
      },
      // 添加类型
      addDialog() {
        this.titleType="添加";
        this.dialogFormVisible = true;
        this.dialogForm.id='';
        this.dialogForm.info= '';
        this.dialogForm.name='';
        this.$nextTick(() => {//清除element残留表单校 验
          this.$refs.dialogForm.clearValidate()
        });
      },
      // 编辑类型
      handleEdit(value) {
        this.titleType="添加";
        this.dialogFormVisible = true;
        this.dialogForm.name = value.type_name;
        this.dialogForm.info = value.type_info;
        this.dialogForm.id = value.type_id;
        this.$nextTick(() => {//清除element残留表单校 验
          this.$refs.dialogForm.clearValidate()
        });
      },
      // 弹窗提交
      subdialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let th = this;
            let url = '/editType';
            let params = {
              id: this.dialogForm.id,
              userId: this.dialogForm.userId,
              name: this.dialogForm.name,
              info: this.dialogForm.info,
              time: this.formatDateTime(new Date())
            };
            console.log(params)
            console.log(this.formatDateTime(new Date()))
            //->调用第一个接口的请求服务
            this.reqM1Service(url, params).then(
              res => {
                if(res.code === 200){
                  this.dialogFormVisible = false;
                  this.submitForm("searchForm");
                  th.$store.commit("editNav",res.data);
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
        let url = '/deleteType';
        let params = {
          ids:id,
        };
        //->调用第一个接口的请求服务
        this.reqM1Service(url, params).then(
          res => {
            if(res.code === 200){
              th.$message.success("删除成功！");
              th.$store.commit("editNav",res.data);
              this.submitForm("searchForm");
            } else {
              th.$message.error(res.msg);
            }
          })
          .catch(failResponse => {})
      }
    }
  }
</script>

<style lang="less" scoped>
.type-main{
  padding: 20px;
}
.table-head{
  // display: flex;
}
.common-search{

}
.common-table{
  width: 100%
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
  }
</style>
