// pages/comments/comments.js
import { getData } from '../../utils/api.js'
import Toast from '../../common/vant-weapp/toast/toast.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiGetList: '/commodity/commoComments/list',
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    searchParams: {
      commoId: '',
      commentType: '', // 评价类型(0：好评，1：中评，2：差评)
      hasPic: '', // 是否带图(0：不带图，1：带图)
      page: 1,
      size: 5,
    },
    list: [],
    commentCount: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.commoId) {
      let searchParams = this.data.searchParams;
      searchParams.commoId = options.commoId;
      this.setData({
        searchParams: searchParams
      })
    }
    this.getDataList()
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
  getDataList() {
    let that = this;
    getData(that.data.apiGetList, that.data.searchParams, 
    res => {
      //判断是否有数据，有则取数据 
      if (res.data.pages >= that.data.searchParams.page) {
        let list = [];
        // 如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        list =  that.data.isFromSearch ? res.data.list : that.data.list.concat(res.data.list)
        if (res.data.pages == that.data.searchParams.page) {
          that.setData({
            list: list, //获取数据数组
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
          });
        } else {
          that.setData({
            list: list, //获取数据数组
            searchLoading: true,   //把"上拉加载"的变量设为false，显示  
            searchLoadingComplete: false
          });
        }//没有数据了，把“没有数据”显示，把“上拉加载”隐藏
      } else {
        that.setData({
          list: [],
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
        });
      }
      let commentCount = res.data.commentNum;
      that.setData({
        commentCount: commentCount
      });
    },
    err => {
      Toast(err.message)
      console.log(err, 'err-comments')
    })
  },
  //滚动到底部触发事件
  searchScrollLower() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      let searchParams = this.data.searchParams;
      searchParams.page++;  //每次触发上拉事件，把searchPageNum+1  
      that.setData({
        searchParams: searchParams,
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.getGoodsData();
    }
  },
  /**
   * 点击切换评价类型
   */
  chooseComments(event) {
    let data = event.currentTarget.dataset.id;
    let searchParams = this.data.searchParams;
    if (data === 'all') {
      searchParams.commentType = '';
      searchParams.hasPic = '';
    } else if (data === 'hasPic') {
      searchParams.commentType = '';
      searchParams.hasPic = 1;
    } else {
      searchParams.commentType = data;
      searchParams.hasPic = '';
    }
    searchParams.page = 1;
    this.setData({
      searchParams: searchParams
    })
    this.getDataList();
  }
})