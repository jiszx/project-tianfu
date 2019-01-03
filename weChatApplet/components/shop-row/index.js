// components/shop-row/index.js
import { request, getData } from '../../utils/api.js'
import Toast from '../../common/vant-weapp/toast/toast.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    company: {
      type: "Object"
    },
    type: {
      type: "String"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    focus_cus_url: '/user/custFollows/attention'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 关注商家
     */
    focusCompany() {
      let that = this;
      let company = that.data.company;
      request(that.data.focus_cus_url, {
        merchantId: that.data.company.custId,
        flag: company.isFollowCustomer ? 0 : 1
      },
      res => {
        wx.showToast({
          title: company.isFollowCustomer ? '已取消关注' : '关注成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          that.triggerEvent('changeFocus') //myevent自定义名称事件，父组件中使用
        }, 500)
      },
      err => {
        Toast.success(err.message);
      })
    }
  }
})
