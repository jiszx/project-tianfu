/**
 * 用户相关
 */
import {
  axios
} from '../../axios/index.js'

import {
  GET_ADDRESS,
  UPDATE_ADDRESS,
  GET_NEXT_ADDRESS
} from '../type'

/**
 * 接口地址
 */
let api_dicitems = {
  apiGetAddress: '/administrativeAreas/list' // 行政区域
}

let state = {
  addressOptions: [] // 地址数据
};

const actions = {
  /**
   * 获取社区数据字典
   */
  [GET_ADDRESS]({
    state
  }, params) {
    axios.get(api_dicitems.apiGetAddress, {
        params: params.areaCode
      })
      .then(res => {
        if (params.arr) {
          mutations[UPDATE_ADDRESS]({
            state
          }, params.arr, res.data.data.list, params.flag ? params.flag : '');
        } else if (!state.addressOptions.length) {
          mutations[UPDATE_ADDRESS]({
            state
          }, state.addressOptions, res.data.data.list);
        }
        // 编辑时需一次获得当前选择地址数据
        if (params.val && res) {
          if (params.isEnd) {
            actions[GET_NEXT_ADDRESS]({
              state
            }, {
              val: params.val,
              arr: state.addressOptions,
              isEnd: 1
            })
          } else {
            actions[GET_NEXT_ADDRESS]({
              state
            }, {
              val: params.val,
              arr: state.addressOptions
            })
          }
        }
      })
  },
  /**
   * 获取下一级
   */
  [GET_NEXT_ADDRESS]({
    state
  }, params) {
    // 获取城市地址, isEnd为1
    if (!params.isEnd) {
      for (let i = 0; i < params.arr.length; i++) {
        if (params.arr[i].value === params.val[0] && !params.arr[i].children.length) {
          actions[GET_ADDRESS]({
            state
          }, {
            areaCode: {
              areaCode: params.val[0]
            },
            arr: params.arr[i].children,
            val: params.val,
            isEnd: 1
          });
          state.codeItem = i;
          break;
        }
      }
    } else {
      // 获取区域地址
      for (let i = 0; i < params.arr[state.codeItem].children.length; i++) {
        if (params.arr[state.codeItem].children[i].value === params.val[1] && !params.arr[state.codeItem].children[i].children.length) {
          actions[GET_ADDRESS]({
            state
          }, {
            areaCode: {
              areaCode: params.val[1]
            },
            arr: params.arr[state.codeItem].children[i].children,
            flag: 1
          });
          break;
        }
      }
    }
  }
};

const getters = {


};

const mutations = {
  /**
   * 更新state
   */
  [UPDATE_ADDRESS](state, arr, data, flag) {
    data.map((item, index) => {
      if (flag || item.areaName === '澳门特别行政区' || item.areaName === '香港特别行政区' || item.areaName === '台湾省') {
        item.value = item.areaCode;
        item.label = item.areaName;
        if (item.children) delete item.children
      } else {
        item.value = item.areaCode;
        item.label = item.areaName;
        item.children = [];
      }
      arr.push(item)
    })
  }
};

export default {
  state,
  actions,
  getters,
  mutations
}
