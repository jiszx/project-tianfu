// pages/paySuccess/paySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    type: '',
    time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId || options.type) {
      let d = new Date();
      let transDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '';
      this.setData({
        orderId: options.orderId || '',
        type: options.type || '',
        time: transDate
      })
    }
    else
    console.log('fanhusi')
      // wx.navigateBack({
      //   delta: 1
      // })
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
   * 返回首页
   */
  returnIndex() {
    wx.redirectTo({
      url: '../index/index',
    })
  }
})