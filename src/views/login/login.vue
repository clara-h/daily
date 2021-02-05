<template>
  <div class="login-container">
    <div class="login-main">
      <h2 class="login-tit">Logo</h2>
      <div class="login-form">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px">
          <el-form-item :label="$t('userName')" prop="name">
            <el-input v-model.trim="loginForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('pwd')" prop="pass">
            <el-input type="password" v-model.trim="loginForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="role">
            <el-radio-group v-model="loginForm.role">
              <el-radio :label="$t('role.user')" value="1"></el-radio>
              <el-radio :label="$t('role.admin')" value="2"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="sub-tips">
            <el-button type="primary" @click="submitForm('loginForm')">{{$t('login')}}</el-button>
            <span class="regist">{{$t('loginTip.txt')}}<router-link to="/register">{{$t('loginTip.link')}}</router-link></span>
          </el-form-item>
        </el-form>
        <div class="language-select">
          <el-dropdown @command="changeType">
            <span class="el-dropdown-link">
              <span v-if="$store.state.langeType==='zh'">中文</span>
              <span v-else-if="$store.state.langeType==='en'">English</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh">{{$t('langsName.chinese')}}</el-dropdown-item>
              <el-dropdown-item command="en">{{$t('langsName.english')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";

export default {
  name: "login",
  data() {
    return {
      loginForm:{
        name:"",
        pass:"",
        role:"1",
      },
      langType: this.$store.state.langeType,
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { max: 15, message: "不能超过 15 个字符", trigger: "blur" }
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
    this.changeType(this.$store.state.langeType)
  },
  methods: {
    changeType(type){
      console.log(type)
      this.$store.commit('editLanges',type)
      this.$i18n.locale = this.$store.state.langeType;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let th = this;
          let url = "/login";
          let params = {
            name:this.loginForm.name,
            pwd: md5(md5(this.loginForm.pass).toLocaleLowerCase()).toLocaleLowerCase()
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
<style lang="less">
  .sub-tips{
    .el-form-item__content{
      width: 400px;
    }
  }
</style>
