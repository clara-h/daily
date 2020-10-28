<template>
  <div class="login-container">
    <div class="login-main">
      <h2 class="login-tit">LOGO</h2>
      <div class="login-form">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px">
          <el-form-item label="用户名" prop="name">
            <el-input v-model.trim="loginForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model.trim="loginForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="role">
            <el-radio-group v-model="loginForm.role">
              <el-radio label="用户" value="1"></el-radio>
              <el-radio label="管理员" value="2"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <span class="regist">还没用户账号？<router-link to="/register">立即注册</router-link></span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm:{
        name:"",
        pass:"",
        role:"1",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" }
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        role:[
          { required: true, message: '请选择登录角色', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    //console.log(this.$store.state.login);
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let th = this;
          let url = "/login";
          let params = {
            name:this.loginForm.name,
            pwd:this.loginForm.pass,
          };
          //->调用第一个接口的请求服务
          //debugger;
          this.reqM1Service(url,params).then(
            res => {
              if(res.code === 200){
                res.result[0].time = th.$moment(res.result[0].time).format('YYYY-MM-DD HH:mm:ss');
                th.$store.commit("edit",res.result[0])
                //console.log(res.result[0]);
                //console.log(th.$store.state.login);
                th.$message.success(res.msg);
                th.$router.push({ name:"index" });
              } else {
                th.$message.error(res.msg);
              };

            })
            .catch(failResponse => {});
        } else {
          this.$message.error("提交错误");
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style lang="less" scoped>
  @import "./less/login.less";
</style>
