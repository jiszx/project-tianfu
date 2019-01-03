
/**
 * 追溯相关类型
 */

const state = {
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
  // 订单状态(0：待付款，1：待发货，2：已发货，3：已完成，4：已取消)
  orderStatus: [
    {
      value: "",
      label: '全部'
    },
    {
      value: 0,
      label: '待支付'
    }, {
      value: 1,
      label: '待发货'
    }, {
      value: 2,
      label: '已发货'
    }, {
      value: 3,
      label: '已完成'
    }, {
      value: 4,
      label: '已取消'
    }
  ],
  countStatus: [
    {
      value: '',
      label: '全部'
    },
    {
      value: 0,
      label: '待结算'
    }, {
      value: 1,
      label: '已结算'
    }
  ],
}

const actions = {}

const getters = {}

const mutations = {}

export default {
  state,
  actions,
  getters,
  mutations
}
