// pages/goods/goods.js
let WxParse = require('../../wxParse/wxParse.js');
import { getData } from '../../utils/api.js';
import Toast from '../../common/vant-weapp/toast/toast.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播相关数据
    api_get_goods: '/commodity/commodities/info',
    swiperData: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    currentSwiperIndex: 1,
    // 立即购买及弹框相关
    gooodsSkuShow: false,
    showBuyBtn: true,
    showAddCart: false,
    // 评价列表
    comments: [],
    commentNum: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      commoId: options.commoId || ''
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.goodsSku = this.selectComponent("#goods_sku");
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
    this.goodsSku.closeSku()
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
  getData(commoId) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    getData(that.data.api_get_goods, {commoId: that.data.commoId}, (res)=>{
      let data = res.data;
      data.merchant.areaPath = data.merchant.areaPath ? data.merchant.areaPath.replace(/\>/g, '') : '';
      let d = new Date(data.harvestDate);
      data.harvestDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '';
      let article = data.commoDetails;
      WxParse.wxParse('article', 'html', article, that, 5);
      that.setData({
        swiperData: data.commoAttachPaths,
        goodsData: data,
        company: data.merchant,
        comments: data.comments,
        commentNum: data.commentNum
      })
      wx.hideLoading()
    }, (err) => {
      wx.hideLoading()
      Toast(err.message)
    })
  },
  swiperChange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current+1
    })
  },
  /**
   * 查看追溯信息
   */
  goTrace() {
    wx.navigateTo({
      url: '../goodsTrace/goodsTrace?commoId=' + this.data.commoId + '&commoAttachPathUrl=' + this.data.goodsData.commoAttachPathUrl + '&commoName=' + this.data.goodsData.commoName
    })
  },
  /**
   * 取消/加关注
   */
  changeFocus() {
    this.getData();
  },
  /**
   * 查看评价列表
   */
  goComments() {
    wx.navigateTo({
      url: '../comments/comments?commoId=' + this.data.commoId,
    })
  },
  /**
   * 立即购买按钮
   */
  onClickBuyBtn() {
    this.setData({
      showAddCart: false,
      showBuyBtn: true,
      gooodsSkuShow: !this.data.gooodsSkuShow
    })
    this.goodsSku.openSku();
  },
  /**
   * 加入购物车按钮
   */
  onClickAddCartBtn() {
    this.setData({
      showAddCart: true,
      showBuyBtn: false,
      gooodsSkuShow: !this.data.gooodsSkuShow
    })
  },
  /**
   * 立即购买弹窗 - 点击购买
   */
  buyNow(data) {
    let that = this;
    wx.navigateTo({
      url: '../submitOrder/submitOrder?goodsData=' + that.data.goodsData.commoId + '&commoNum=' + data.detail.selectedNum
    })
  },
  /**
   * 加入购物车弹窗 - 无此功能
   */
  addCart(data) {
    console.log(data)
    // this.$store.dispatch('cartAdd', {
    //   type: 'defaultSelect',
    //   data: [{
    //     commoId: data.goodsData.commoId,
    //     addOrSubtract: '+' + data.selectedNum,
    //     // commoPropertyValId:data.typeGoodsInfo.commoPropertyValId
    //   }]
    // });
    // this.gooodsSkuShow = !this.gooodsSkuShow;
  }
})