
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
app.listen(8000, () => {
  console.log("——————————服务已启动——————————");
});

app.get("/", (req, res) => {
  res.send('<p style="color:red">服务已启动</p>');
});

//登录
app.post("/login", bodyParser.json(),(req, res) => {
  //var param = req.query || req.params|| req.body ;
  var name = req.body.name;
  var pwd = req.body.pwd;
  var sql = "select * from user where name = '" + name + "'";
  conn.query(sql, function (err, result) {
    var data = {};
    if (err) {
      data.msg = err.message;
      console.log("err:", err.message);
      //res.end(data);
    } else {
      var isTrue = false;
      data.code = 202;
      data.msg = "用户名不存在!";
      if (result) {//获取用户列表，循环遍历判断当前用户是否存在
        for (var i = 0; i < result.length; i++) {
          if (result[i].name == name && result[i].pwd == pwd ) {
            isTrue = true;
          } else {
            data.msg = "密码错误！";
          }
        }
      }

      if (isTrue) {
        data.code = 200;
        data.msg = "登录成功！";
        data.result = result;
      }
    }
    res.json(data);
  });
});

//注册
app.post("/register", bodyParser.json(),(req, res) => {
  //var param = req.body || req.query || req.params  ;
  var name = req.body.name;
  var pwd = req.body.pwd;
  var time = req.body.time;
  var sql = "insert into user ( name, pwd, time) select '" + name + "' , '" + pwd +"', '" + time + "' from dual where not exists ( select * from user where name = '"+name+"')";
  conn.query(sql, function (err, result) {
    var data = {};
    //data.sql = sql;
    if (err) {
      data.msg = err.message;
      data.code = 202;
      console.log("err:", err.message);
    } else {
      data.id=result.insertId;
      if (result.insertId !==0){
        data.code = 200;
        data.msg="注册成功！"
      }else{
        data.code = 202;
        data.msg="用户名已存在！"
      }
      data.result = result;
    }
    res.json(data);
  });


});

//分类列表查询
app.post("/typeList", bodyParser.json(),(req, res) => {
  //var param = req.body || req.query || req.params  ;
  var id = req.body.userId;
  var key = req.body.key;
  var sql = "select * from type where user_id = '" + id + "'";
  if (key) {
    console.log("123");
    sql += " and (type_name like '%"+key+"%' or type_info like '%"+key+"%' or type_time like '%"+key+"%') ";
  }
  conn.query(sql, function (err, result) {
    var data = {};
    // data.sql = sql;
    if (err) {
      data.msg = err.message;
      data.code = 202;
      console.log("err:", err.message);
    } else {
      data.code = 200;
      data.msg = '查询成功！'
      data.data = result;
    }
    res.json(data);
  });
});

//添加&编辑分类
app.post("/editType", bodyParser.json(),(req, res) => {
  //var param = req.body || req.query || req.params  ;
  var userId = req.body.userId;
  var id = req.body.id;
  var name = req.body.name;
  var info = req.body.info;
  var time = req.body.time;
  var sql;
  if (id){
    console.log("编辑");
    sql = "UPDATE type SET type_name = '"+name+"',type_info='"+info+"' where type_id = '"+id+"'";
  }else{
    console.log("添加");
    sql = "INSERT INTO type (type_name,type_time,type_info,user_id) VALUES ('"+name+"','"+time+"','"+info+"','"+userId+"')";
  }
  conn.query(sql, function (err, result) {
    var data = {};
    data.sql = sql;
    if (err) {
      data.msg = err.message;
      data.code = 202;
      console.log("err:", err.message);
    } else {
      data.code = 200;
      data.msg = '成功！'
      data.data = result;
    }
    res.json(data);
  });
});

//删除类型
app.post("/deleteType", bodyParser.json(),(req, res) => {
  //var param = req.body || req.query || req.params  ;
  var id = req.body.ids;
  var sql = "DELETE FROM type WHERE type_id IN ("+id+");DELETE FROM cost WHERE type_id in ("+id+")";
  conn.query(sql, function (err, result) {
    var data = {};
    data.sql = sql;
    if (err) {
      data.msg = err.message;
      data.code = 202;
      console.log("err:", err.message);
    } else {
      data.code = 200;
      data.msg = '删除成功！'
      data.data = result;
    }
    res.json(data);
  });
});

//类型列表查询
app.post("/classList", bodyParser.json(),(req, res) => {
  //var param = req.body || req.query || req.params  ;
  var id = req.body.userId;
  var key = req.body.key;
  var sql = "select * from class where user_id = '" + id + "'";
  if (key) {
    console.log("123");
    sql += " and (class_name like '%"+key+"%' or class_info like '%"+key+"%' or class_time like '%"+key+"%') ";
  }
  conn.query(sql, function (err, result) {
    var data = {};
    // data.sql = sql;
    if (err) {
      data.msg = err.message;
      data.code = 202;
      console.log("err:", err.message);
    } else {
      data.code = 200;
      data.msg = '查询成功！'
      data.data = result;
    }
    res.json(data);
  });
});

//添加&编辑类型
app.post("/editClass", bodyParser.json(),(req, res) => {
  //var param = req.body || req.query || req.params  ;
  var userId = req.body.userId;
  var id = req.body.id;
  var name = req.body.name;
  var info = req.body.info;
  var time = req.body.time;
  var sql;
  if (id){
    console.log("编辑");
    sql = "UPDATE class SET class_name = '"+name+"',class_info='"+info+"' where class_id = '"+id+"'";
  }else{
    console.log("添加");
    sql = "INSERT INTO class (class_name,class_time,class_info,user_id) VALUES ('"+name+"','"+time+"','"+info+"','"+userId+"')";
  }
  conn.query(sql, function (err, result) {
    var data = {};
    data.sql = sql;
    if (err) {
      data.msg = err.message;
      data.code = 202;
      console.log("err:", err.message);
    } else {
      data.code = 200;
      data.msg = '成功！'
      data.data = result;
    }
    res.json(data);
  });
});

//删除类型
app.post("/deleteClass", bodyParser.json(),(req, res) => {
  //var param = req.body || req.query || req.params  ;
  var id = req.body.ids;
  var sql = "DELETE FROM class WHERE class_id IN ("+id+")";
  conn.query(sql, function (err, result) {
    var data = {};
    data.sql = sql;
    if (err) {
      data.msg = err.message;
      data.code = 202;
      console.log("err:", err.message);
    } else {
      data.code = 200;
      data.msg = '删除成功！'
      data.data = result;
    }
    res.json(data);
  });
});
