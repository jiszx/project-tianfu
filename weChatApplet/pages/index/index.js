//index.js
//获取应用实例
const app = getApp()
import { getData } from '../../utils/api.js'
import Toast from '../../common/vant-weapp/toast/toast.js';

Page({
  data: { // 参与页面渲染的数据
    api_get_commodities: '/commodity/commodities/list', //7.2. 商品列表
    api_get_commoditiesTypes: '/commodityTypes/list', //3.3. 商品分类分级
    value: '',
    scrollHeight: '', // 滑动区域高度
    showBrandDrag: false, //地区 
    showCategory: false, //品类
    showVarietiesDrag: false, //品种
    showVarietiesName: '', // 品种名称
    showAuthenticationDrag: false, //筛选认证
    commoTyParentId: -1,
    varietiesList: [],
    isChoseAuthent: false,
    authenticationList: [{
      authenticationStauts: false,
      authenticationName: '实名认证'
    }, {
      authenticationStauts: true,
      authenticationName: '企业认证'
    }, {
      authenticationStauts: false,
      authenticationName: '资质认证'
    }, {
      authenticationStauts: false,
      authenticationName: '是否可追溯'
    }],
    searchForm: {
      page: 1,
      size: 10,
      areaCode: '', //行政区代码
      commoTyPath: '', //商品分类路径，""分隔，示例：_1_2,默认为空，一级展示
      keyword: '', //品种关键字
      realNameAuth: '', //通过实名认证(0：未通过，1：已通过，2：待审核)
      enterpriseAuth: '', //通过企业认证(0：未通过，1：已通过，2：待审核)
      aptitudeAuth: '', //通过资质认证(0：未通过，1：已通过，2：待审核)
      canTrace: '', //是否可追溯(0：不可追溯，1：可追溯)
    },
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    formData: {
      addrProvinceName: '',
      addrCityName: '',
      addrCountyName: ''
    },
    formNess: {
      commoTyName: ''
    },
    goodsList: [],
  },
  onLoad() { // 页面渲染后 执行
    // console.log('初始化的数据...');
    this.getHeight()
    let arr = this.data.searchForm.commoTyPath.split('_');
    let i = 0
    arr.map(item => {
      if (item == '-' || item == '') {
        arr.splice(i, 1)
      }
      i++;
    })
    if (arr[2]) { // 品类选择到三级才执行
      this.data.commoTyParentId = arr[2];
      this.getvarietiesList(arr[3]); //品种数据列表获取
    }
    this.getGoodsData(); //获取商品列表数据
  },
  /**
   * 获取页面高度
   */
  getHeight() {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight-104
        });
      }
    });
  },
  getGoodsData() {
    let that = this;
    getData(that.data.api_get_commodities, that.data.searchForm, (res)=>{
      //判断是否有数据，有则取数据 
      if (res.data.pages >= that.data.searchForm.page) {
        let searchList = [];
        // 如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = res.data.list : searchList = that.data.goodsList.concat(res.data.list)
        if (res.data.pages == that.data.searchForm.page) {
          that.setData({
            goodsList: searchList, //获取数据数组
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
          });
        } else {
          that.setData({
            goodsList: searchList, //获取数据数组
            searchLoading: true,   //把"上拉加载"的变量设为false，显示  
            searchLoadingComplete: false
          });
        }//没有数据了，把“没有数据”显示，把“上拉加载”隐藏
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false,  //把"上拉加载"的变量设为false，隐藏 
          goodsList: []
        });
      }  
    }, (err)=>{
      Toast(err.message)
      console.log(err, 'err')
    })
  },
  search(e) {
    let searchForm = this.data.searchForm;
    searchForm.keyword = e.detail;
    this.setData({
      goodsList: [],
      searchForm: searchForm
    });
    this.getCommoditiesData(); //获取商品列表数据
  },
  //滚动到底部触发事件
  searchScrollLower: function() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      let searchForm = this.data.searchForm;
      searchForm.page++;  //每次触发上拉事件，把searchPageNum+1  
      that.setData({
        searchForm: searchForm, 
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.getGoodsData();
    }
  },
  /**
   * 获取商品列表数据
   */
  getCommoditiesData() {
    let params = this.data.searchForm, _this = this;
    getData(this.data.api_get_commodities, params,
      function (res) {
        _this.setData({
          goodsList: res.data.list
        });
      },
      function (err) {
        Toast(err.message)
        console.log(err)
      }
    )
  },
  /**
   * 行政区域弹层控制
   */
  showAreaDrag() {
    this.setData({
      showBrandDrag: true
    });
    // 调用子组件中methods的onshow方法
    this.selectComponent('#area-popup').onshow()
  },
  /**
   * 行政数据获取
   */
  // 当自定义组件触发 confirm 事件时，调用 areaConfirm 方法
  areaConfirm(rowData) {
    // console.log(rowData,123)
    let val = rowData.detail;
    this.data.searchForm.areaCode = val ? val.code : '';
    this.data.formData.addrProvinceName = val ? val.province : '';
    this.data.formData.addrCityName = val ? val.city : '';
    this.data.formData.addrCountyName = val ? val.county : '';
    this.setData({
      searchForm: this.data.searchForm,
      formData: this.data.formData
    });
    this.getGoodsData(); //获取商品列表数据
  }, 
  /*  品类 */
  showCategory() { //打开筛选弹层
    this.data.showCategory = !this.data.showCategory;
    let flag = this.data.showCategory;
    this.setData({
      showCategory: flag
    });
    if (flag == true) {
      // 调用子组件中methods的showCategory方法
      this.selectComponent('#category-popup').openCategory();
    } else {
      // 调用子组件中methods的closeCategory方法
      this.selectComponent('#category-popup').closeCategory();
    }
  },
  closeCategory() { //关闭筛选弹层
    this.setData({
      showCategory: false
    });
    // 调用子组件中methods的closeCategory方法
    this.selectComponent('#category-popup').closeCategory();
  },
  /**
  品种数据列表获取
  */
  getvarietiesList(key) {
    let params = {
      commoTyParentId: this.data.commoTyParentId
    };
    var _this = this;
    if (this.data.commoTyParentId)
    getData(this.data.api_get_commoditiesTypes, params,
      function (res) {
        console.log(res.data.list, '四级数据')
        _this.data.varietiesList = res.data.list;
        if (key) {
          let data = _this.data.varietiesList.find(v => {
            return v.commoTyId == key                                                                                                                                                                                                                                                                                            
          })
          _this.data.showVarietiesName = data.commoTyName;
        }
      },
      function (err) {
        Toast(err.message)
        console.log(err)
      }
    )
  },
  showFilterVarieties() {
    this.data.showVarietiesDrag = !this.data.showVarietiesDrag;
    let flag = this.data.showVarietiesDrag;
    this.setData({
      showVarietiesDrag: flag
    });
  },
  chooseVarieties(rowData) {
    this.data.searchForm.commoTyPath = rowData.commoTyPath;
    this.setData({
      showVarietiesDrag: false
    });
    this.showVarietiesName = rowData.commoTyName; //commoTyName
    this.data.searchForm.page = 1;
    this.getGoodsData(); //获取商品列表数据
  },
  /* 筛选认证 */
  showFilterAuthentication() {
    this.data.showAuthenticationDrag = !this.data.showAuthenticationDrag;
    let flag = this.data.showAuthenticationDrag;
    this.setData({
      showAuthenticationDrag: flag
    });
  },
  onChange(detail) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail
    });
  },
  chooseAuthentication(event) {
    let rowData = event.currentTarget.dataset.item;
    // console.log(rowData)
    let index = event.currentTarget.dataset.key;
    rowData.authenticationStauts = !rowData.authenticationStauts;
    let authenticationList = this.data.authenticationList;
    authenticationList[index] = rowData;
    if (rowData.authenticationName == "实名认证") {
      this.data.searchForm.realNameAuth = rowData.authenticationStauts == true ? 1 : 0;
    } else if (rowData.authenticationName == "企业认证") {
      this.data.searchForm.enterpriseAuth = rowData.authenticationStauts == true ? 1 : 0;
    } else if (rowData.authenticationName == "资质认证") {
      this.data.searchForm.aptitudeAuth = rowData.authenticationStauts == true ? 1 : 0;
    } else if (rowData.authenticationName == "是否可追溯") {
      this.data.searchForm.canTrace = rowData.authenticationStauts == true ? 1 : 0;
    }
    this.setData({
      searchForm: this.data.searchForm,
      authenticationList: authenticationList
    });
  },
  confirmAuthentication() {
    this.setData({
      isChoseAuthent: true
    });
    this.setData({
      showAuthenticationDrag: false
    });
    this.data.searchForm.page = 1;
    this.getGoodsData(); //获取商品列表数据
  },
  /* 品类筛选 */
  categoryConfirm(e) {
    // 获取子组件信息
    // console.log(e.detail.commoTyPathName, '获取子组件信息')
    let searchForm = this.data.searchForm;
    searchForm.commoTyPath = e.detail.commoTyPathSelect;
    let formNess = this.data.formNess;
    formNess.commoTyName = e.detail.commoTyName;
    // console.log(searchForm.commoTyPath, 'searchForm.commoTyPath')
    this.setData({
      searchForm: searchForm,
      formNess: formNess,
      // commoTyPathName: e.detail.commoTyPathName.split('>')[e.commoTyPathName.split('>').length - 1],
      page: 1,
    });
    // console.log(this.data.searchForm.commoTyPath, 'commoTyPath')
    let arr = this.data.searchForm.commoTyPath.split('_');
    let i = 0
    arr.map(item => {
      if (item == '-' || item == '') {
        arr.splice(i, 1)
      }
      i++;
    })
    this.setData({
      commoTyParentId: arr[2] ? arr[2] : ''
    });
    this.getGoodsData(); //获取商品列表数据
    this.getvarietiesList(); //品种数据列表获取
  },
  getInitData(data) {
    this.setData({
      commoTyName: data.commoTyName
    });
    // this.formNess.commoTyName = data.commoTyName;
    // console.log(data.commoTyName, 'data.commoTyName')
    this.$set(this.formNess);
    delete this.formNess.undefined
  }
})
