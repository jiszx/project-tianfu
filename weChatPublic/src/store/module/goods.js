/**
 * 商品分类相关
 * */
/**
 * 消息相关
 * */
import {
  SEARCH_ADD_HISTORY,
  SEARCH_EMPTY_HISTORY
} from '../types'

const state = {
  searchHistory: []
}

const actions = {

}

const getters = {}

const mutations = {
  [SEARCH_ADD_HISTORY](state, keyword) {
    if (!keyword) {
      return;
    }
    let index = state.searchHistory.findIndex(v => {
      return v === keyword
    })
    if (index > -1) {
      state.searchHistory.splice(index, 1);
    }
    state.searchHistory.unshift(keyword)
    state.searchHistory = [...state.searchHistory.slice(0, 10)];
  },
  [SEARCH_EMPTY_HISTORY](state) {
    state.searchHistory = [];
  }
}
export default {
  state,
  actions,
  getters,
  mutations
}
