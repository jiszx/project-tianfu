// pages/submitOrder/submitOrder.js
import { request, getData } from '../../utils/api.js'; 
import Toast from '../../common/vant-weapp/toast/toast.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api_get_details: '/commodity/commodities/info',
    api_get_addr: '/user/address/list', // 8.4 查询收货地址
    api_submit_order: '/order/orders/create',// 10.6. 提交订单
    selectedNum: 1,
    commoId: '',
    addrId: '',
    shop: {},
    goodsData: {},
    remark: '', // 备注
    address: {},
    addressList: [],
    payTypeText: '在线支付',
    payAmount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectedNum: this.options.commoNum,
      commoId: this.options.goodsData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getGoodsData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddress()
    if (this.data.addressList.length)
      this.chooseAddr()
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
   * 获取商品数据
   */
  getGoodsData() {
    let that = this;
    getData(
      that.data.api_get_details, 
      { commoId: that.data.commoId }, 
      (res) => {
        let data = res.data;
        data.merchant.areaPath = data.merchant.areaPath ? data.merchant.areaPath.replace(/\>/g, '') : '';
        let goodsData = [{
          commoId: data.commoId,
          commoName: data.commoName,
          commoAttachPathUrl: data.commoAttachPathUrl,
          commoNum: that.data.selectedNum,
          commoPrice: data.commoPrice,
          commoStatus: data.commoStatus,
          commoUnit: data.commoUnit
        }]
        let amount = 0;
        goodsData.map(item => {
          amount += item.commoPrice * item.commoNum
        });
        amount = parseFloat(amount).toFixed(2);
        that.setData({
          goodsData: goodsData,
          shop: data.merchant,
          payAmount: amount
      },
      (err) => {
        console.log(err, 'err-submitorder-api')
        // Toast(err.message);
      })
    })
  },
  /**
   * 获取地址
   */
  getAddress() {
    let that = this;
    request(that.data.api_get_addr, {}, 
    res=>{
      that.setData({ addressList: res.data })
      that.chooseAddr()
    },
    err => {
      Toast(err.message);
      // console.log(err, 'err-submitorder-api-addr')
    })
  },
  /**
   * 找到并设置选中的地址
   */
  chooseAddr() {
    let address = {}
    if(this.data.addrId) {
      address = this.data.addressList.find(v => {
        return v.addrId == this.data.addrId
      })
    } else {
      address = this.data.addressList.find(v => {
        return v.addrDefault == 1
      })
    }
    address.areaPath = address.areaPath ? address.areaPath.replace(/\>/g, '') : '';
    this.setData({ address: address })
  },
  /**
   * 填写地址
   */
  addAddress() {
    wx.navigateTo({
      url: '../addres/address',
    })
  },
  /**
   * 
   */
  choosePayType() {
    wx.navigateTo({
      url: '../payType/payType',
    })
  },
  /**
   * 改变备注
   */
  onChangeRemark(event) {
    this.setData({
      remark: event.detail
    })
  },
  /**
     * 提交订单
     */
  submitOrder() {
    let orderData = {
      addrId: this.data.address.addrId,
      conveyTime: this.data.currentDate ? (+new Date(this.data.currentDate)) : '', // 送货时间
      conveyType: this.data.transType || '', // 配送方式
      items: [], // 商品
      orderRemark: this.data.remark || '' // 订单备注
    }
    if (!orderData.addrId) {
      Toast('请选择收货地址！');
      return;
    }
    if (!orderData.conveyType || !orderData.conveyTime) {
      Toast('请选择配送方式和送货时间！');
      return;
    }
    // 商品列表
    let goodsList = [];
    this.data.goodsData.forEach(item => {
      goodsList.push({
        commoId: item.commoId,
        commoNum: item.commoNum,
        // commoPropertyValId:item.commoPropertyValId
      })
    })
    orderData.items = JSON.stringify(goodsList);
    request(this.data.api_submit_order, orderData, res=>{
      wx.redirectTo({
        url: '../payOrder/payOrder?orderId=' + res.data.orderId,
      })
    }, err=>{
      Toast(err.message);
    })
  }
})