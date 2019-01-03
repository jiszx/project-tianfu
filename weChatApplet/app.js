//app.js
import { request } from './utils/api.js';
App({
  onLaunch: function () { // 小程序启动之后 触发
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        request(
          '/wechat/miniOauth',
          {
            code: res.code,
            needToken: true
          },
          res=>{
            // console.log(res)
            if (!res.data.hasBound) wx.redirectTo({
              url: '../loginRegister/loginRegister',
            })
            let params = {
              grant_type: 'refresh_token',
              refresh_token: res.data.access_token,
              scope: 'trust',
              useDefaultAuthorization: true
            }
            request('/oauth/token', //2.1. 获取accessToken
              params,
              (res) => {
                wx.setStorage({
                  key: "oauth",
                  data: res.data
                })
              }
            )
            this.globalData.openId = res.data.openId;
          },
          err => {
          }
        )
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // 授权-暂时没有需要授权的模块
          // wx.authorize({
          //   scope: 'scope.userInfo',
          //   success() {
          //     // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          //     wx.getUserInfo()
          //   }
          // })
        }
      }
    })
    // 调用微信扫一扫
    // wx.scanCode({
    //   success: (res) => {
    //     console.log(res)
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    openId: ''
  }
})