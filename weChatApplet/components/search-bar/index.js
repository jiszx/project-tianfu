// components/search-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: "String"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchText: '',
    historyShow: false,
    history: []
  },
  ready() {
    let history = wx.getStorageSync('history') || [];
    this.setData({
      history: history
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 输入input 
     */
    onChange(e) {
      this.setData({
        searchText: e.detail
      });
      // console.log(this.data.searchText)
    },
    /**
     * 搜索
     */
    onSearch() {
      let history = this.data.history;
      let that = this;
      that.triggerEvent('search', that.data.searchText) //search自定义名称事件，父组件中使用
      let index = history.findIndex(v=>{
        return v === that.data.searchText
      }); // 判断输入值有没有在历史记录值里面
      // console.log(index, history, that.data.searchText)
      if(index > -1) history.splice(index, 1); // 如果重复则删除该重复值，默认在第一个位置，index为0
      history.unshift(that.data.searchText); // unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
      this.trimSpace(history); //去掉数组为空的元素
      wx.setStorage({
        key: "history",
        data: history,
        success(res) {
          let newHistory = wx.getStorageSync('history');
          that.setData({
            history: newHistory
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    },
    inputFocus() {
      this.setData({
        historyShow: true
      });
    },
    inputBlur() {
      this.setData({
        historyShow: false
      });
    },
    historySearch(e) {
      // console.log(e, '历史记录搜索');
      this.setData({
        searchText: e.target.dataset.item
      });
      this.onSearch();
    },
    emptyHistory() {
      this.setData({
        historyShow: false,
        history: []
      });
      wx.removeStorageSync('history')
    }, 
    //去除数组中的空值
    trimSpace(array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == "" || typeof (array[i]) == "undefined") {
          array.splice(i, 1);
          i = i - 1;
        }
      }
      return array;
    }
  }
})
