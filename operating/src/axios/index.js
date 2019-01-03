import axios from 'axios'
import qs from 'qs'
import {commonFun} from '../common/js/commonFun.js'
import { Message } from 'element-ui';
import router from '../router/index'
/* axios 封装处理 */
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么 
    var user_token=commonFun.getSessionStorage('user_token');
    config.headers.Authorization=config.url!='/oauth/token'?(user_token.token_type+' '+ user_token.access_token):'Basic RjEzQjR1Q1Y1ZFFhVFNjaWNPeTFmRzRYRlB6bGlxdDU6WldyM0RzSDV3ZjV6MkdUY3FHR1RUN0FCUkszYlZNd2tNZU0zTEM1dVgwYUFSa2dnOTN3czZxZnJIMTROamlPMg=='
    if(config.method!='get'&&config.data){ 
         //unStringify参数标记不转换格式
          config.data =config.unStringify?config.data:qs.stringify(config.data) 
           
    }
    return config;

  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (data) {
  // 对响应数据做点什么
   /* token过期拦截回登录页 */
   if(data.data.status==401){
    Message.error('登录已过期，请重新登录');
    router.replace({
      name: '登录',
    }) 
    return Promise.reject();    
 }  
   if(data.data.status!=200){
    Message.error(data.data.message);
    return Promise.reject();
   }

    return data;

}, function (err) {
  /* token过期拦截回登录页 */
  if (err.response ){
    Message.error(err.response.data.message);
  }
  /* if (err.response ) {
    if(err.response.status === 401){
        Message.error('登录已过期，请重新登录');
        router.replace({
          name: '登录',
          query: {redirect: router.currentRoute.fullPath}
        })
        return Promise.reject(err);
    }else{
      Message.error(err.response.data.message);
    }
  } */

  return Promise.reject(err);
});


export {
    axios
}