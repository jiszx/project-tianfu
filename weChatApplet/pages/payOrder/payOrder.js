// pages/payOrder/payOrder.js
import Toast from '../../common/vant-weapp/toast/toast.js';
import { request, getData } from '../../utils/api.js';
import { appId } from '../../common/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api_get_data: '/user/mine/orderInfo',
    apiGetPaySignature: '/order/orders/pay', //10.7. 去支付
    payType: '3', // 支付类型(0：JSAPI支付，1：APP支付，2：扫码支付，3：小程序支付)
    orderPayMode: '0',
    orderId: '',
    currentOrderData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId || 160
    })
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
    this.getData()
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
   * 支付
   */
  submitOrder() {
    // if (!this.orderId && this.$route.query.type == 'vip')
    //   this.doPayVip(() => {
    //     this.$store.dispatch('showMsgTips', '已支付成功！')
    //     this.$router.replace({ name: '支付成功', query: { type: 'vip' } })
    //   })
    // else
    let that = this;
    request(that.data.apiGetPaySignature, {
      orderId: that.data.orderId,
      orderPayMode: 0, // 订单支付方式(0：微信，1：支付宝)
      payType: 3, // 支付类型(0：JSAPI支付，1：APP支付，2：扫码支付，3：小程序支付)
      // appId: appId
    }, res => {
      wx.redirectTo({
        url: '../paySuccess/paySuccess?orderId=' + that.data.orderId,
      })
      that.payWechat( res.data, 
        () => {
          // Toast('已支付成功！')
          wx.redirectTo({
            url: '../paySuccess/paySuccess?orderId=' + that.data.orderId,
          })
        }, 
        (errpay) => {
          Toast('支付失败！')
          console.log(errpay, 'pay-err')
      })
    }, err => {
      Toast(err.message)
      // console.log(err)
    })
  },
  /**
   *  获取订单计算数据
   */
  getData() {
    let that = this;
    if (that.data.orderId)
      getData(that.data.api_get_data, { orderId: that.data.orderId }, res=>{
          that.setData({
            currentOrderData: res.data.order
          })
      }, err=>{
        Toast(err.message)
      })
    // else if (this.$route.query.type == 'vip') {
    //   that.data.currentOrderData.orderAmount = this.setting.authFee
    //   that.setData({
    //     currentOrderData: that.data.currentOrderData
    //   }) 
    // }
  },
  /**
   * 支付
   */
  payWechat(params, successFn, errorFn) {
    // console.log(params)
    wx.requestPayment({
      timeStamp: params.timeStamp, // new Date().getTime()
      nonceStr: params.nonceStr, // 随机字符串，长度为32个字符以下
      package: params.package, // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***	
      signType: params.signType, // 微信签名方式
      paySign: params.paySign, // 微信签名
      success(res) {
        successFn(res)
      },
      fail(res) {
        errorFn(res)
      }
    })
  }
})