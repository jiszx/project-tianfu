// var app = getApp();
import { baseUrl, defaultAuthorization } from '../common/config.js'

/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function request(url, postData, doSuccess, doFail) {
  let Authorization = postData.needToken ? "" : getAuthorization(postData);
  delete postData.needToken;
  wx.request({
    //项目的真正接口，通过字符串拼接方式实现
    url: baseUrl + url,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      "Authorization": Authorization
    },
    data: postData,
    method: 'POST',
    success: function (res) {
      //参数值为res.data,直接将返回的数据传入
      goLogin(res, doSuccess||'', doFail||'')
    },
    fail: function (err) {
      if (doFail) doFail(err);
    },
  })
}

//GET请求，不需传参，直接URL调用，
function getData(url, params, doSuccess, doFail) {
  let Authorization = params.needToken ? "" : getAuthorization(params);
  delete params.needToken;
  wx.request({
    url: baseUrl + url,
    header: {
      "content-type": "application/json;charset=UTF-8",
      "Authorization": Authorization
    },
    method: 'GET',
    data: params||{},
    success: function (res) {
      goLogin(res, doSuccess || '', doFail || '')
    },
    fail: function (err) {
      console.log(err)
      if (doFail) doFail();
    },
  })
}

/**
 * 获取accessToken
 */

let getAuthorization = function (postData) {
  // 发送请求前，配置请求参数 postData.useDefaultAuthorization如果接口请求时带上useDefaultAuthorization则使用默认Authorization
  let value = wx.getStorageSync('oauth')
  let access_token = value.access_token;
  let token_type = value.token_type || 'Bearer';
  let authorization = (!postData.useDefaultAuthorization && access_token) ? token_type + ' ' + access_token : 'Basic ' + defaultAuthorization;
  return authorization
}

/**
 * 如果未登录，跳转至登录
 */
let goLogin = function (res, doSuccess, doFail) {
  // console.log(res.data.status == 401)
  if (res.data.status && (res.data.status >= 200 && res.data.status <= 300)) {
    if (doSuccess) doSuccess(res.data);
  } else if (res.data.status && res.data.status == 401) {
    setTimeout(() => {
      wx.navigateTo({
        url: '../loginRegister/loginRegister',
      })
    }, 500) 
    if (doFail) doFail(res.data);
  } else {
    // console.log(res.data, 'else')
    if (doFail) doFail(res.data);
  }
}

/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js")  加载
 * 在引入引入文件的时候"  "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */
module.exports.request = request;
module.exports.getData = getData;