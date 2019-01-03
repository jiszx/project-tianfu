// pages/payType/payType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payType: 0,
    transType: 1,
    // currentDate: '',
    showDate: false,
    transDate: '',
    // minDate: new Date(+new Date() + 1000 * 3600 * 24),
    currentDate: new Date().getTime(),
    minDate: new Date().getTime()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dateConfirm()
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
  showDatePop() {
    this.setData({
      showDate: true
    })
  },
  dateConfirm(val) {
    val = val ? val.detail : new Date()
    let d = new Date(val);
    let transDate = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    let currentDate = val;
    this.setData({
      showDate: false,
      transDate: transDate,
      currentDate: currentDate
    })
  },
  dateCancel() {
    this.setData({
      showDate: false
    })
  },
  confirmFn() {
    let that = this;
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      payType: that.data.payType,
      transType: that.data.transType,
      currentDate: that.data.currentDate
    }) //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。

    //最后就是返回上一个页面。
    wx.navigateBack({
      delta: 1
    })
    //此时页面数据已经改变为我们传递过来的数据。如果想要返回之后处理这些数据，那么要在onShow函数里执行，因为我们执行的是返回，所以不会触发onLoad函数，所以我们要在onShow里执行我们想要使用的函数。
  }
})