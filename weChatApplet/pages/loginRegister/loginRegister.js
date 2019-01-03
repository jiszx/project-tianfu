let md5 = require("../../utils/md5.js")
let app = getApp();
import { request } from '../../utils/api.js'
import Toast from '../../common/vant-weapp/toast/toast.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    api_login: '/oauth/token', //2.1. 获取accessToken
    api_get_user_info: '/user/mine', //8.1. 我的
    phoneNumber: '',
    password: '',
    phoneNumberError: '',
    passwordError: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /**
   * checkPhone
   */
  checkPhone(event) {
    console.log('chufa', event.detail.value);
    let err = ''
    if (event.detail.value) {
      let str = event.detail.value.toString();
      /^1[3|4|5|7|8|9][0-9]{9}$/.test(str) ? err = '' : err = '请输入正确的手机号码！'
    } else {
      err = '请输入手机号码！'
    }
    this.setData({
      phoneNumber: event.detail.value,
      phoneNumberError: err
    })
  },
  /**
   * checkPass
   */
  checkPass(event) {
    console.log('chufa', event.detail.value);
    let err = ''
    if (event.detail.value) {
      let str = event.detail.value;
      str.length > 5 && str.length<=16 ? err = '' : err = '密码为6到16位！'
    } else {
      err = '请输入密码！'
    }
    this.setData({
      password: event.detail.value,
      passwordError: err
    })
  },
  /**
   * 登录
   */
  doLogin() {
    let that = this;
    if (!that.data.phoneNumber || !that.data.password) {
      Toast(!that.data.phoneNumber ? '手机号不能为空' : '密码不能为空');
      return;
    }
    let getAppInfo = app.globalData.openId;
    console.log(getAppInfo)
    let params = {
      grant_type: 'password',
      scope: 'trust',
      username: that.data.phoneNumber,
      password: md5(that.data.password),
      openId: getAppInfo||'',
      useDefaultAuthorization: true // 此字段用于表示是否使用默认的Authorization，解决获取授权接口使用默认Authorization问题
    };
    // 发起一个post请求
    request(that.data.api_login, 
      params,
      (res) => {
        console.log(res.data)
        wx.setStorage({
          key: "oauth",
          data: res.data
        })
        wx.navigateBack({
          delta: 1
        })
      },
      (err)=>{
        Toast(err.message)
      }
    )
    
  }
})