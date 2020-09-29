//1->common.js中引入axios
import Axios from 'axios'
import qs from 'qs'

Axios.defaults.timeout = 1800;

//2->对get请求传递过来的参数处理
function paramsToUrl(url, params) {
  if (!params) return url;
  for (var key in params) {
    if (params[key] && params[key] != 'undefined') {
      if (url.indexOf('?') != -1) {
        url += '&' + '' + key + '=' + params[key] || '' + ''
      } else {
        url += '?' + '' + key + '=' + params[key] || '' + ''
      }
    }
  }
  return url;
}

//3->在common.js中封装公用方法-----封装请求的方法
function requireData(url,params,type,item){
  if(!url) return false
  switch(item){
    case 'M1':
      url=Axios.defaults.baseM1URL+url;
      break;
    case 'M2':
      url=Axios.defaults.baseM2URL+url;
      break;
    default:
      url=Axios.defaults.baseM3URL+url;
  }
  if(type==='get'){
    url=paramsToUrl(url)
    return new Promise((resolve,reject)=>{
      Axios.get(url,{
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          //token: localStorage.uesrToken
        }
      }).then(res=>{
        resolve(res.data)
      }).catch(err=>{
        reject(err)
      })
    })
  }else{
    return new Promise((resolve,reject)=>{
      Axios.post(url,params,{
      }).then(res=>{
        resolve(res.data)
      }).catch(err=>{
        reject(err)
      })
      console.log(params);
    })
  }
}

export default{
  install(Vue,options){
    //->接口1的请求数据方法
    Vue.prototype.reqM1Service=function(url,params,type){
      return requireData.call(this,url,params,type,'M1')
    }
    //->接口2的请求数据方法
    Vue.prototype.reqM2Service=function(url,params,type){
      return requireData.call(this,url,params,type,'M2')
    }
    //->接口3的请求数据方法
    Vue.prototype.reqM3Service=function(url,params,type){
      return requireData.call(this,url,params,type,'M3')
    }
  }

}
