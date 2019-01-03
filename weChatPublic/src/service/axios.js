import axios from 'axios';
import md5 from 'js-md5';
import store from '../store/index'
import router from '../router/index'
import { Toast } from 'vant'
import { baseURL, clientSecret, defaultAuthorization } from 'common/config.js'
/**
 * 签名
 */
let getSign = (params) => {
  let formData = {
    ...params
  };
  let sign = [];
  for (let key in formData) {
    if (formData[key] !== '') {
      sign.push(key.toString() + '=' + formData[key])
    }
  }
  sign.sort(); // 排序
  if (sign.length) {
    sign.push(clientSecret)
  }
  sign = sign.join('&'); // 有参数才进行md5加密
  return (sign && !formData._without_MD5) ? md5(sign) : ''
}

// 线上环境配置axios.defaults.baseURL，生产环境则用proxy代理
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = baseURL;
}

axios.defaults.timeout = 30000; // 超时时间

// 请求
axios.interceptors.request.use(config => {
  // 处理MD5加密
  let sign = '';
  let formData = {};
  let tempParams = {}; // 临时对象，用于筛选formData中值不为空字符串的键值对，（注：签名算法需要将值为空的数据过滤掉）
  let access_token = store.state.mine.oauth.access_token;
  let openId = store.state.mine.openId; // openId(开放式认证系统)
  let token_type = store.state.mine.oauth.token_type;
  if ((config.method.toLowerCase() === 'get') || (config.method.toLowerCase() === 'delete')) {
    // config.params.access_token = access_token; // 每个接口都带上access_token
    config.params.openId = openId;
    formData = config.params;
  } else {
    // config.data.access_token = access_token; // 每个接口都带上access_token
    config.data.openId = openId;
    formData = config.data;
  }
  // 过滤键值为空的数据
 /*  for (let key in formData) {
    if (formData[key] !== '') {
      tempParams[key] = formData[key];
    }
  } */
  for (let key in formData) {
    tempParams[key] = formData[key];
  }

  if ((config.method.toLowerCase() === 'get') || (config.method.toLowerCase() === 'delete')) {
    config.params = tempParams; // 重新赋值
  } else {
    if(config.data.isUpload) config.data = config.data.data
    else
    config.data = tempParams; // 重新赋值
  }
  sign = getSign(tempParams);
  config.headers.sign = sign;
  // 发送请求前，配置请求参数 判断逻辑：formData.useDefaultAuthorization如果接口请求时带上useDefaultAuthorization则使用默认Authorization
  config.headers.Authorization = (!formData.useDefaultAuthorization && access_token) ? token_type + ' ' + access_token : 'Basic ' + defaultAuthorization;
  // 发送请求前，配置请求参数
  //config.headers.Authorization = "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDM0MTEwNzIsInVzZXJfbmFtZSI6IiMhMSIsImF1dGhvcml0aWVzIjpbImF1dGhlbnRpY2F0ZWQiXSwianRpIjoiYWM3MWJhNGQtN2JiZS00NGI0LTg0OTYtZTcxZmE5OTYwNjM0IiwiY2xpZW50X2lkIjoiRjEzQjR1Q1Y1ZFFhVFNjaWNPeTFmRzRYRlB6bGlxdDUiLCJzY29wZSI6WyJ0cnVzdCJdfQ.ffLDY3HTThxjjEgOV77GKlP7LOA-uQLs0pLLkqp9_ZAx1arTFG-HmwSS6Ui0r6ncenb_x9WOr78_Jua_3IStgcSQiww_SIT_33FC9YWViG8PtnDX_ZYoqr-RKHoWWkWR_-RA8oh3QC2CaAFI6617ywXAlsho4jTG5iyrmUGqrYc"
  return config;
}, err => {
  Toast.clear();
  store.dispatch('showMsgTips', '请求超时!')
  return Promise.reject(err);
})

// 响应
axios.interceptors.response.use(data => {
  Toast.clear();
  //处理成功状态码
  if (data.data.status && (data.data.status >= 200 && data.data.status <= 300)) {
    return Promise.resolve(data.data.data);
  } else if (data.data.status && data.data.status == 401) {
    // console.log(router.currentRoute.fullPath, 'router.currentRoute.fullPath')
    router.replace({
      name: '登录',
      query: {
        redirect: router.currentRoute.fullPath
      }
    })
    store.dispatch('showMsgTips', '登陆过期！');
    return Promise.reject(data.data);
  } else {
    // console.log(data.data)
    store.dispatch('showMsgTips', data.data.message);
    return Promise.reject(data.data);
  }
}, err => {
  // 处理请求错误
  return Promise.reject(err);
})

export default {
  post(url, params) {
    if (params._showLoading) {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true // 禁用背景点击
      });
    }
    return axios({
      method: 'post',
      url: `${url}`,
      data: params || {},
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  uploadFile(url, params) {
    // 上传文件接口参数加上一个标识位，来标识是否需要md5加密
    return axios({
      method: 'post',
      url: `${url}`,
      data: { isUpload: true, data: params || {} },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  put(url, params) {
    return axios({
      method: 'put',
      url: `${url}`,
      data: params || {},
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  delete(url, params) {
    return axios({
      method: 'delete',
      params: params || {},
      url: `${url}`
    });
  },
  get(url, params) {
    let tempParams = {
      ...(params || {}),
      _timer: +(new Date()) // 解决IE缓存添加一个随机时间戳
    }
    return axios({
      method: 'get',
      params: tempParams,
      url: `${url}`
    });
  },
  // 此方法非promise
  getFile(url, params) {
    let tempParams = {
      ...(params || {}),
      access_token: store.state.mine.oauth.access_token
    }
    tempParams.sign = getSign(tempParams);

    // 拼接下载地址
    let list = [];
    for (let key in tempParams) {
      list.push(key.toString() + '=' + tempParams[key]);
    }
    url = baseURL + url + '?' + list.join('&')
    downloadFile(url);
  }
}
