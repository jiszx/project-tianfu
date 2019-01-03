Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    commoAttachPathUrl: {
      type: String,
      value: '',
    },
    commoId: {
      type: [String, Number],
    },
    commoName: {
      type: String,
    },
    commoPrice: {
      type: String,
    },
    commoUnit: {
      type: String,
    },
    commoSales: {
      type: [String, Number],
    },
    customer: {
      type: Object,
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  ready() {
    this.onLoad()
  },
  methods: {
    onLoad: function () {
      // console.log(this.data)
    },
    // 这里是一个自定义方法
    linkToDetail: function (data) {
      let that = this;
      wx.navigateTo({
        url: '../goods/goods?commoId='+that.data.commoId,
      })
    }
  }
})