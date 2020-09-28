
/* 引入express框架 */
const express = require("express");
const app = express();

/* 引入cors */
const cors = require("cors");
app.use(cors());

/* 引入body-parser */
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* 引入mysql */
const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "daily",
  multipleStatements: true
});
conn.connect();

//设置跨域访问
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By"," 3.2.1")
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});



/* 监听端口 */
app.listen(8080, () => {
  console.log('——————————服务已启动——————————');
});

app.get('/', (req, res) => {
  res.send('<p style="color:red">服务已启动</p>');
});

app.get("/api/getUserList", (req, res,next) => {
  // 获取前台页面传过来的参数
  var param = req.query || req.params;
  var name = param.name;
  var _res = res;
  const sqlStr = "SELECT * FROM user";
  conn.query(sqlStr, (err, res, result) => {
    var isTrue = false;
    if(res){ //获取用户列表，循环遍历判断当前用户是否存在
      for (var i=0;i<res.length;i++) {
        if(res[i].uid == UserName && res[i].userName == Password) {
          isTrue = true;
        }
      }
    }
    var data = {};
    data.isLogin = isTrue; //如果isTrue布尔值为true则登陆成功 有false则失败
    if(isTrue) {
      data.userInfo = {};
      data.userInfo.id = id;
      data.userInfo.name = name;
    } //登录成功返回用户信息
    if(result) {
      result = {
        code: 200,
        msg: "succeed"
      };
      data.result = result;
    }
    if(err) data.err = err;
    // 以json形式，把操作结果返回给前台页面
    responseJSON(_res, data);

    // 释放链接
    conn.release();
  });
})