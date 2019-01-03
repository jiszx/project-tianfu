// components/goods-sku/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gooodsSkuShow: {
      type: "Boolean"
    },
    goodsData: {
      type: "Object"
    },
    showBuyBtn: {
      type: "Boolean"
    },
    showAddCart: {
      type: "Boolean"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    selectedNum: 1,
    totalPrice: 0.00
  },
  ready() {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 打开弹窗
     */
    openSku() {
      this.setData({
        show: true
      })
      this.onChangePrice()
    },
    // 关闭弹窗
    closeSku() {
      this.setData({
        show: false
      })
    },
    // 计算价格
    onChangePrice() {
      let totalPrice = parseFloat(this.data.goodsData.commoPrice * this.data.selectedNum).toFixed(2);
      this.setData({
        totalPrice: totalPrice
      })
    },
    // 计算选中数量
    onChangeNum(event) {
      this.setData({
        selectedNum: event.detail
      });
      this.onChangePrice();
    },
    buyNow() {
      // detail对象，提供给事件监听函数
      var myEventDetail = {
        selectedNum: this.data.selectedNum
      }
      this.triggerEvent('buy-clicked', myEventDetail)
    },
  }
})
