/**
 * 消息相关
 * */
import {
  MESSAGE_GET_LIST,
  UNREAD_MESSAGE
} from '../types'
import axios from 'service/axios'
const state = {
  messageList: [],
  unreadMsg: 0
}

const actions = {
  [MESSAGE_GET_LIST]({
    state,
    dispatch
  }, params) {
    axios.get('/message/notifies/list', params || {})
      .then(res => {
        state.messageList = res.list;
      })
      .catch(err => {
        // dispatch('showMsgTips', err.message)
      })
  },
  [UNREAD_MESSAGE]({
    state,
    dispatch
  }, params) {
    axios.get('/message/notifies', params || {})
      .then(res => {
        state.unreadMsg = res;
      })
      .catch(err => {
        // dispatch('showMsgTips', err.message)
      })
  }
}

const getters = {}

const mutations = {

}
export default {
  state,
  actions,
  getters,
  mutations
}
