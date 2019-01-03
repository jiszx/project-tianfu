/**
 * 订单相关
 * */
import {
  ADD_SUBMITING_ORDER,
  GET_SUBMITING_ORDER,
  UPDATE_SUBMITING_ADDRESS,
  UPDATE_SUBMITING_REMARK,
  UPDATE_SUBMITING_PAYTYPE,
  UPDATE_SUBMITING_CONVEY,
  UPDATE_SUBMITING_TRANSTIME
} from '../types'
import axios from 'service/axios'
import { Toast } from 'vant'
const state = {
  submitingOrder: [],
}

const actions = {
  
}

const getters = {
  [GET_SUBMITING_ORDER](state) {
    return uuid => {
      let index = state.submitingOrder.findIndex(v => {
        return v.uuid === uuid;
      })
      return index > -1 ? state.submitingOrder[index] : {}
    }
  }
}

const mutations = {
  [ADD_SUBMITING_ORDER](state, data) {
    state.submitingOrder.push(data)
  },
  [UPDATE_SUBMITING_ADDRESS](state, {
    data,
    uuid
  }) {
    let index = state.submitingOrder.findIndex(v => {
      return v.uuid === uuid;
    })
    if (index > -1) {
      // console.log(data, '地址信息')
      state.submitingOrder[index].address = {
        ...data
      }
    }
  },
  [UPDATE_SUBMITING_REMARK](state, {
    data,
    uuid
  }) {
    let index = state.submitingOrder.findIndex(v => {
      return v.uuid === uuid;
    })
    if (index > -1) {
      state.submitingOrder[index].remark = data;
    }
  },
  [UPDATE_SUBMITING_PAYTYPE](state, {
    data,
    uuid
  }) {
    let index = state.submitingOrder.findIndex(v => {
      return v.uuid === uuid;
    })
    if (index > -1) {
      state.submitingOrder[index].orderPaytype = data;
    }
  },
  [UPDATE_SUBMITING_CONVEY](state, {
    data,
    uuid
  }) {
    let index = state.submitingOrder.findIndex(v => {
      return v.uuid === uuid;
    })
    if (index > -1) {
      state.submitingOrder[index].conveyType = data;
    }
  },
  [UPDATE_SUBMITING_TRANSTIME](state, {
    data,
    uuid
  }) {
    let index = state.submitingOrder.findIndex(v => {
      return v.uuid === uuid;
    })
    if (index > -1) {
      state.submitingOrder[index].transTime = data;
    }
  },

}
export default {
  state,
  actions,
  getters,
  mutations
}
