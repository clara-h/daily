<template>
  <div class="register-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="fl">注册账号</span>
        <div class="fr">已有账号？<router-link to="/login">立即登录</router-link></div>
      </div>
      <div class="register-form">
        <el-form :model="signForm" :rules="rules" ref="signForm" label-width="100px">
          <el-form-item label="用户名" prop="name">
            <el-input v-model.trim="signForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input type="password" v-model.trim="signForm.pwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="repwd">
            <el-input type="password" v-model.trim="signForm.repwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('signForm')">提交</el-button>
            <el-button @click="resetForm('signForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import md5 from 'js-md5'
export default {
  name: "register",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.signForm.repwd !== "") {
          this.$refs.signForm.validateField("repwd");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.signForm.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      signForm: {
        name: "",
        pwd: "",
        repwd: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        repwd: [
          { required: true, message: "请重复密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let nowDate = new Date()
          let date = {
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            date: nowDate.getDate()
          }
          //this.systemTime = date.year + '-' + date.month + '-' + date.date
          let th = this;
          let url = "/register";
          let pwd = md5(md5(this.signForm.pwd).toLocaleLowerCase()).toLocaleLowerCase()
          console.log(pwd)
          console.log(pwd.length)
          let params = {
            name: this.signForm.name,
            pwd: md5(md5(this.signForm.pwd).toLocaleLowerCase()).toLocaleLowerCase(),
            time: date.year + '-' + date.month + '-' + date.date,
          };
          //->调用第一个接口的请求服务
          //debugger;
          this.reqM1Service(url, params).then(
            res => {
              if(res.code === 200){
                //console.log(res);
                //th.$store.commit("edit",res.result[0])
                //console.log(res.result[0]);
                //console.log(th.$store.state.login);
                th.$message.success(res.msg);
                th.$router.push({ name:"login" });
              } else {
                th.$message.error(res.msg);
              }
            })
            .catch(failResponse => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
  @import "./less/register.less";
</style>
