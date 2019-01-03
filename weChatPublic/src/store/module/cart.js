/**
 * 购物车相关
 * */
//引入router用于路由跳转
import router from 'router/index';
import {
  CART_GET_LIST,
  CART_GET_MORE_LIST,
  UPDATE_CART_SELECTED,
  CART_ADD,
  CART_ADD_AGAIN
} from '../types'
import axios from 'service/axios'
const state = {
  cartList: [],
  selected: {
    shop: '',
    commoId: [],
    item: []
  },
  totalNum:0,
  params: {
    page:1,
    size:10
  },
  hasMore:true,
  loading:false
}

const actions = {
  [CART_GET_LIST] ({commit, state, dispatch}) {
    // state.params.page = 1;
    state.loading = true;
    // console.log('112321', state.params)
    axios.get('/order/shoppingCarts/list', state.params || {})
      .then(res => {
        state.loading = false;
        res.list.map(v => {
          v.items.map(item => {
            item.custId = v.merchant.custId
          })
        })
        state.cartList = [...res.list];
        state.totalNum = res.total
        state.hasMore = false
      })
      .catch(err => {
        state.loading = false;
        dispatch('showMsgTips', err)
      })
  },
  [CART_GET_MORE_LIST]({commit, state, dispatch}) {
    state.params.page++;
    state.loading = true;
    axios.get('/order/shoppingCarts/list', state.params || {})
      .then(res => {
        state.loading = false;
        res.list.map(v => {
          v.items.map(item => {
            item.custId = v.merchant.custId
          })
        })
        state.cartList = [...state.cartList, ...res.list];
        state.hasMore = res.pages > res.page
        state.totalNum = res.total
      })
      .catch(err => {
        state.loading = false;
        dispatch('showMsgTips', err.message)
      })
  },
  [CART_ADD]({state, dispatch, commit}, params) {
    let type = params.type;
    // console.log(type)
    let cartStr = JSON.stringify(params.data)
    axios.post('/order/shoppingCarts/addTo', {
      items: cartStr
    })
      .then(res => {
        if(type === 'new'){
          dispatch('showMsgTips', '已加入购物车！')
        } else if (type === 'reBuy' || type === 'defaultSelect') {
          // res.list.forEach(item => {
          //   commit(UPDATE_CART_SELECTED, item.carId);
          // })
          dispatch('showMsgTips', '加入购物车成功！')
          if(type === 'reBuy') {
            router.push({name: '购物车'})
            // commit(UPDATE_CART_SELECTED, {selected: params.data})
          }
        }
        dispatch(CART_GET_LIST)
      })
      .catch(() => {
        state.loading = false;
        if(params.error){
          params.error()
        }
      })
  },
  [CART_ADD_AGAIN]({state, dispatch, commit}, params) {
    axios.get('/user/mine/orderInfo', {
      orderId: params.orderId
    }).then(res => {
      let data = [];
      res.items.map(good => {
        let obj = {
          commoId: good.commoId,
          // commoNum: good.commoNum,
          addOrSubtract: +good.commoNum
        }
        data.push(obj);
        dispatch(CART_ADD, {
          type: 'reBuy',
          data: data
        })
      })
    })
  }
  
}

const getters = {}

const mutations = {
  [UPDATE_CART_SELECTED](state, data) {
    // console.log(data, 'form')
    // state.selected.shopId = data.shopId || '';
    if(Array.isArray(data.selected)){
      let arr = []
      data.selected.forEach(item => {
        arr.push(item.commoId)
      })
      state.selected.commoId = arr;
      state.selected.item = data.selected;
      state.selected.shop = data.shop;
    }
    // console.log(state.selected, 'over')
  }
}
export default {
  state,
  actions,
  getters,
  mutations
}
