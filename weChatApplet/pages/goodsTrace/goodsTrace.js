// pages/goodsTrace/goodsTrace.js
import { getData } from '../../utils/api.js';
import { formatDate } from '../../utils/util.js'
import Toast from '../../common/vant-weapp/toast/toast.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    apiGetList: '/commodity/commoTraces/list',
    commoId: '',
    goodsData: {
      commoAttachPathUrl: '',
      commoName: ''
    },
    stepData: [],
    growType: [ // 育苗方式
      {
        value: 0,
        label: '穴盘'
      },
      {
        value: 1,
        label: '苗床'
      }
    ],
    quality: [ // 质量类型
      {
        value: 0,
        label: '无公害'
      },
      {
        value: 1,
        label: '绿色'
      },
      {
        value: 2,
        label: '有机'
      },
      {
        value: 3,
        label: '其它'
      }
    ],
    soilType: [ // 土壤类型
      {
        value: 0,
        label: '沙质土'
      },
      {
        value: 1,
        label: '粘质土'
      },
      {
        value: 2,
        label: '壤土'
      }
    ],
    fertilizeType: [ // 肥料类型
      {
        value: 0,
        label: '有机生物肥'
      },
      {
        value: 1,
        label: '复（混）合肥'
      },
      {
        value: 2,
        label: '大量元素水溶肥'
      },
      {
        value: 3,
        label: '功能特种肥'
      },
      {
        value: 4,
        label: '微肥'
      },
      {
        value: 5,
        label: '菌肥'
      }
    ],
    pestType: [ // 防治类型
      {
        value: 0,
        label: '生物合成'
      },
      {
        value: 1,
        label: '化学合成'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.commoId) {
      let goodsData = this.data.goodsData;
      goodsData.commoAttachPathUrl = options.commoAttachPathUrl;
      goodsData.commoName = options.commoName;
      this.setData({
        commoId: options.commoId,
        goodsData: goodsData
      })
      this.getList()
    }
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
  getList() {
    let that = this;
    getData(that.data.apiGetList, { commoId: that.data.commoId },
      res => {
        let stepData = that.data.stepData;
        res.data.list.map(item => {
          item.time = item.plantDate || item.testDate || item.seedDate || item.sowDate || item.fertilizeDate || item.pestDate || item.hoeDate || item.harvestDate;
          // 生产计划
          if (item.harvestDate) item.harvestDate = formatDate(item.harvestDate, 'yyyy-MM-dd');
          // 病虫害防治
          if (item.safeDate) item.safeDate = formatDate(item.safeDate, 'yyyy-MM-dd')
          item.date = formatDate(item.time, 'yyyy-MM-dd')
          if (item.tracePlanId) item.typeName = that.getTraceTypeName(item.qualityRequire, that.data.quality);
          if (item.traceSoilId) item.typeName = that.getTraceTypeName(item.soilType, that.data.soilType);
          if (item.traceSeedId) item.typeName = that.getTraceTypeName(item.seedlingWay, that.data.growType);
          if (item.traceFertilizeId) item.typeName = that.getTraceTypeName(item.fertilizeType, that.data.fertilizeType);
          if (item.tracePestId) item.typeName = that.getTraceTypeName(item.pestType, that.data.pestType);
        })
        stepData = res.data.list.sort(that.sortTime);
        that.setData({
          stepData: stepData
        })
      },
      err => {
        Toast(err.message)
      })
  }, 
  sortTime(a, b) {
    return b.time - a.time
  },
  /**
   * 获取类型名称
   */
  getTraceTypeName(value, opinon) {
    for (let i = 0; i < opinon.length; i++) {
      if (opinon[i].value === value) {
        return opinon[i].label;
      }
    }
  }
})