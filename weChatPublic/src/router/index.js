import Vue from 'vue'
import Router from 'vue-router'
// 导入模块
import goods from './module/goods'
import find from './module/find'
import mine from './module/mine'
import message from './module/message'
import order from './module/order'
import loginRegister from './module/loginRegister'
import cart from './module/cart'
import news from './module/news'
import shop from './module/shop'

import Index from 'pages/home/Index.vue'
import Author from 'pages/author'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Index,
      meta: {
        showTabbar: true,
        // keepAlive: true,
        title: '田夫网'
      }
    }, {
      path: '/author',
      name: '认证',
      component: Author,
      meta: {
        trust: true,
        title: '田夫网'
      }
    },
    // 商品分类
    ...goods,
    // 发现相关
    ...find,
    // 消息相关
    ...message,
    // 我的相关
    ...mine,
    // 订单相关
    ...order,
    //登录注册相关
    ...loginRegister,
    // 购物车相关
    ...cart,
    // 新闻相关
    ...news,
    // 新闻相关
    ...shop
  ]
})
