// pages/addAddress/addAddress.js
import Toast from '../../common/vant-weapp/toast/toast.js';
import { request } from '../../utils/api.js';
import { checkType } from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    api_create: '/user/address/create',//8.5. 新增收货地址
    api_update: '/user/address/update',//8.6. 修改收货地址
    formData: {},
    areaShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let formData = {
      addrAddress: options.addrAddress || '',
      addrDefault: options.addrDefault || 0,
      addrLinkman: options.addrLinkman || '',
      addrPhone: options.addrPhone || '',
      areaCode: options.areaCode || '',
      areaName: options.areaName || '',
      areaPath: options.areaPath || '',
      addrId: options.addrId || '',//主键
      isDefault: options.addrDefault == 1 ? true : false
    }
    this.setData({
      formData: formData
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
   * 打开地址弹窗
   */
  showPop() {
    this.setData({
      areaShow: true
    })
    this.selectComponent('#area-popup').onshow()
  },
  /**
   * 修改是否默认
   */
  onChange() {
    this.data.formData.isDefault = !this.data.formData.isDefault;
    this.data.formData.addrDefault = this.data.formData.isDefault? 1 : 0;
    this.setData({
      formData: this.data.formData
    })
  },
  /**
   * 地址弹窗确定
   */
  areaConfirm(data) {
    let val = data.detail;
    let formData = this.data.formData;
    formData.areaCode = val ? val.code : '';
    formData.areaName = val && val.county ? val.county : val.province;
    formData.areaPath = (val.province) + '>' + (val.city) + '>' + (val.county);
    this.setData({
      formData: formData
    })
  },
  /**
   * 修改表单数据
   */
  changeForm(event) {
    let name = event.currentTarget.dataset.name;
    let formData = this.data.formData;
    formData[name] = event.detail;
    this.setData({
      formData: formData
    })
  },
  /**
   * 提交
   */
  submitFn() {
    let formData = this.data.formData;
    let that = this;
    // console.log(formData);
    // 判断表单是否完整
    if (!formData.addrAddress || !formData.addrLinkman || !formData.addrPhone) {
      Toast('请完善表单！');
      return false;
    } else if (!checkType(formData.addrPhone, 'phone')) {
      Toast('请填写正确的手机号！');
      return false;
    }
    let api_url = that.data.formData.addrId ? that.data.api_update : that.data.api_create;
    request(api_url, formData, res => {
      wx.showToast({
        title: formData.addrId ? '修改成功！' : '新增成功！',
        icon: 'success',
        duration: 2000
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }, err => {
      Toast(err.message)
    })
  },
})