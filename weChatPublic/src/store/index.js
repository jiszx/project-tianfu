import Vue from 'vue'
import Vuex from 'vuex'

/**
 * 各个模块
 */
import goods from './module/goods'
import find from './module/find'
import message from './module/message'
import mine from './module/mine'
import order from './module/order'
import traceData from './module/traceData'
import cart from './module/cart'

import {
  SHOW_MSG_TIPS,
  HIDE_MSG_TIPS
} from './types'
/**
 * 全局状态管理
 */
const state = {
  // 提示弹层
  messageTips: {
    isShow: false,
    text: '',
    type: 'text' // 可以配置弹出提示框类型,支持success fail default
  }
}
const actions = {
  /**
   * 显示提示弹层
   * @param msg 提示文案 String Or Object
   */
  [SHOW_MSG_TIPS]({
    commit
  }, msg) {
    commit(SHOW_MSG_TIPS, msg)
  },
  /**
   * 隐藏提示弹层
   * @param msg 提示文案 String Or Object
   */
  [HIDE_MSG_TIPS]({
    commit
  }) {
    commit(HIDE_MSG_TIPS)
  }
}
const mutations = {
  /**
   * 显示提示弹层
   * @param state
   * @param msg 提示文案 String Or Object
   */
  [SHOW_MSG_TIPS](state, msg) {
    let vantToastType = ['success', 'fail'];
    if ((typeof msg).toLocaleLowerCase() === 'string') {
      state.messageTips.text = msg;
    } else {
      state.messageTips.text = msg;
    }
    state.messageTips.isShow = true;
  },
  /**
   * 隐藏提示弹层
   * @param state
   */
  [HIDE_MSG_TIPS](state) {
    state.messageTips.isShow = false;
    state.messageTips.text = '';
  }
}
const getters = {}

Vue.use(Vuex)
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    goods,
    find,
    message,
    mine,
    order,
    traceData,
    cart,
  }
})
