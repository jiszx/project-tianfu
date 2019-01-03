// components/category-popup/index.js
import { getData } from '../../utils/api.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showCategory: {
      type: Boolean,
      default: false
    },
    commoTyPathSelect: {
      type: String
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    api_get_category: '/commodityTypes/list', //3.3. 商品分类分级
    categoryList: [], // 一级分类
    currentCategory: 0, 
    currentDetailCategory: 1,
    categoryDetailData: [], // 二级分类
    categoryThirdData: [], // 三级分类
    isFirstOpen: false,
    commoTyParentId: -1,
    isChangeClick: false,
    arr: []
  },
  ready() {
    this.onLoad()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoad() {
      this.getCategoryData(-1);
    },
    /**
    * 获取分类数据
    */
    getCategoryData(commoTyParentId) {
      var _this = this;
      let params = {
        commoTyParentId: (commoTyParentId ? commoTyParentId : -1)
      };
      getData(this.data.api_get_category, params,
        function(res) {
          // 查询当前commoTyParentId是否存在于第一级分类
          let index = _this.data.categoryList.findIndex(v => {
            return v.commoTyId == commoTyParentId
          })
          let second = _this.data.categoryDetailData.findIndex(v => {
            return v.commoTyId == commoTyParentId
          })
          //console.log(index, second)
          if (index > -1 || second > -1) {
            // 查询当前commoTyParentId是否存在于第二级分类
            if (second > -1) {
              _this.setData({
                categoryThirdData: res.data.list
              });
            } else {
              _this.setData({
                categoryDetailData: res.data.list
              });

              if (_this.data.categoryDetailData.length && !_this.data.commoTyPathSelect){
                _this.getCategoryData(_this.data.categoryDetailData[0].commoTyId)
                _this.setData({
                  currentDetailCategory: _this.data.categoryDetailData[0].commoTyId
                })
              } 
            }
          } else {
            _this.setData({
              categoryList: res.data.list
            });
            if (_this.data.categoryList.length) {
              _this.getCategoryData(_this.data.categoryList[0].commoTyId)
              _this.setData({
                currentCategory: _this.data.categoryList[0].commoTyId
              })
            }
          }
        }, 
        function(err){
          console.log(err)
        }
      )
    },
    /**
    * 点击左侧导航
    * @param
    */
    change(event) {
      let item = event.currentTarget.dataset.item;
      this.setData({
        isChangeClick: true
      });
      if (item.commoTyLevel < 4) {
        this.setData({
          currentCategory: item.commoTyId,
        });
        // console.log(item.commoTyId, '一级的commoTyId')
        this.getCategoryData(item.commoTyId);
      }
    },
    /**
    * 二级点击查询三级
    */
    categorySecondClick(event) {
      this.getCategoryData(event.currentTarget.dataset.item.commoTyId)
      this.setData({
        currentDetailCategory: event.currentTarget.dataset.item.commoTyId,
      });
      // console.log(event.currentTarget.dataset.item.commoTyId, '二级的commoTyId')
    },
    /**
     * 三级点击跳转到商品列表
     */
    categoryThirdClick(event){
      let item = event.currentTarget.dataset.item;
      this.setData({
        isFirstOpen: false
      });
      this.setData({
        commoTyPathSelect: item.commoTyPath,
        commoTyPathName: item.commoTyPathName,
        commoTyName: item.commoTyName
      })
      //传递给父组件
      // console.log(item.commoTyName, '三级的commoTyName')
      var myEventDetail = {
        commoTyPathSelect: item.commoTyPath,
        commoTyPathName: item.commoTyPathName,
        commoTyName: item.commoTyName
      } // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', myEventDetail) //myevent自定义名称事件，父组件中使用
    },
    /**
     * 打开弹框
     */
    openCategory() {
      this.setData({
        isFirstOpen: true
      })
    },
    /**
     * 关闭弹框
     */
    closeCategory() {
      this.setData({
        isFirstOpen: false
      })
    }
  }
})
