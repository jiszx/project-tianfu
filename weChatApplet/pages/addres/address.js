// pages/addres/address.js
import Toast from '../../common/vant-weapp/toast/toast.js';
import { getData } from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api_get_data: '/user/address/list',
    api_delete: '/user/address/delete',
    address: [],
    // item.areaPath.replace(/\>/g,'')+item.addrAddress
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
    this.getListData()
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
   * 获取数据
   */
  getListData() {
    let that = this;
    console.log(1234)
    getData(that.data.api_get_data, {} , res=>{
      res.data.map(item => {
        item.areaPath = item.areaPath.replace(/\>/g, '');
      })
      that.setData({
        address: res.data || []
      })
    }, err=>{
      Toast(err.message)
    })
  },
  /**
   * 修改地址 / 或新增
   */
  editClick(event) {
    let url = '../addAddress/addAddress'
    if (event.currentTarget.dataset.item) {
      let addressData = event.currentTarget.dataset.item
      url += '?addrAddress=' + addressData.addrAddress + '&addrDefault=' + addressData.addrDefault + '&addrPhone=' + addressData.addrPhone + '&areaCode=' + addressData.areaCode + '&addrLinkman=' + addressData.addrLinkman + '&areaName=' + addressData.areaName + '&areaPath=' + addressData.areaPath + '&addrId=' + addressData.addrId
    }
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 选择地址
   */
  addressClick(event) {
    let that = this;
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      addrId: event.currentTarget.dataset.item.addrId
    }) //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
    wx.navigateBack({
      delta: 1
    })
  }
})