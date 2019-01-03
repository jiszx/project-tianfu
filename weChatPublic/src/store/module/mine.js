/**
 * 我的相关
 * */
import {
  MESSAGE_GET_LIST,
  UPADTE_OAUTH,
  SAVE_USER_TO_LOCAL,
  UPDATE_USER_FROM_LOCAL,
  UPDATE_USERDATA,
  UPDATE_OPENID,
  UPDATE_REFRESH_TOKEN,
  SETTING_GET_INFO
} from '../types'

import {setLocalStorage, getLocalStorage} from 'common/js/mUtils'
import axios from 'service/axios'
const state = {
  openId: '',
  oauth: {
    access_token: '',
    token_type: '',
    refresh_token: '',
    expires_in: '',
    Authorization: ''
  },
  userData: {},
  defaultAddress: {},
  setting: {}
}

const actions = {
  [SETTING_GET_INFO]({
    state,
    dispatch
  }) {
    axios.get('/setting/configs/info')
      .then(res => {
        state.setting = res;
        // commit(SAVE_USER_TO_LOCAL);
        mutations[SAVE_USER_TO_LOCAL](state)
        // console.log(res,state.setting)
      })
      .catch(err => {
        dispatch('showMsgTips', err.message)
      })
  }
}

const getters = {}

const mutations = {
    /**
     * 更新oauth相关
     */
    [UPDATE_USERDATA](state, data) {
      state.userData = {
        ...data
      }
      // 存储状态
      mutations[SAVE_USER_TO_LOCAL](state)
    },
    /**
     * 登录时更新oauth相关
     */
    [UPADTE_OAUTH](state, data) {
      state.oauth = {
        access_token: data.access_token,
        token_type: data.token_type,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        Authorization: `Basic ${data.access_token}`
      }
      // 存储状态
      mutations[SAVE_USER_TO_LOCAL](state)
    },
    /**
     * 将user state 数据存储在localstore里面
     */
    [SAVE_USER_TO_LOCAL](state) {
      setLocalStorage('user', state)
    },
    /**
     * 从localstorage里取出数据更新user state
     */
    [UPDATE_USER_FROM_LOCAL](state) {
      let user = getLocalStorage('user')
      if (user) {
        for (let key in state) {
          state[key] = user[key]
        }
      }
    },
    [UPDATE_OPENID](state, openId) {
      state.openId = openId || '';
      // 存储状态
      mutations[SAVE_USER_TO_LOCAL](state)
    },
    [UPDATE_REFRESH_TOKEN](state, refresh_token) {
      state.oauth.refresh_token = refresh_token || '';
      // 存储状态
      mutations[SAVE_USER_TO_LOCAL](state)
    }
}
export default {
  state,
  actions,
  getters,
  mutations
}
