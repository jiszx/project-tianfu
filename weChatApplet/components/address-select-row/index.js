// components/address-select-row/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isDefault: {
      type: [Boolean, String, Number]
    },
    name: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    editClick() {
      this.triggerEvent('edit-click')
    },
    addressClick() {
      this.triggerEvent('address-click')
    }
  }
})
