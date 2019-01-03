// components/order-goods-row/index.js
// 提交订单商品组件
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id: {
      type: [String, Number]
    },
    title: {
      type: String
    },
    image: {
      type: String
    },
    commoPrice: {
      type: String
    },
    promotionName: {
      type: String
    },
    num: {
      type: [String, Number]
    },
    commoUnit: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    payAmount: ''
  },
  ready(){
    this.dealPayamount()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    dealPayamount() {
      let commoPrice = parseFloat(this.data.commoPrice).toFixed(2);
      let payAmount = (this.data.commoPrice) * (this.data.num);
      this.setData({
        commoPrice: commoPrice,
        payAmount: payAmount
      })
    }
  }
})
