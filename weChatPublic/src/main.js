// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import * as commonConfig from 'common/config'
import * as mUtils from 'common/js/mUtils'
import axios from 'service/axios'
import 'common/css/common.scss'

import {
  Toast,
  Lazyload
} from 'vant';
/**
 * 引入公共方法mUtils
 */
Vue.prototype.$mUtils = mUtils

/**
 * 公共配置信息
 */
Vue.prototype.$commonConfig = commonConfig
/**
 * 挂载axios
 */
Vue.prototype.$axios = axios

/**
 * 全局注册组件
 */
Vue.use(Toast);
Vue.prototype.$toast = Toast;
Vue.use(Lazyload, {
  error: ''
});
/**
 * 路由拦截
 */
router.beforeEach((to, from, next) => {
  // todo 路由拦截待完善
  let userData = mUtils.getLocalStorage('user') || {
    oauth: {}
  };
  if (!userData.openId && to.name !== '认证') {
    // 第一次进入项目
    mUtils.Cookie.set('beforeLoginUrl', encodeURIComponent(to.fullPath)) // 保存用户进入的url encodeURIComponent() 函数可把字符串作为 URI 组件进行编码
    next({
      name: '认证'
    })
    return false
  }
  if (!userData.oauth.access_token && !to.meta.trust) {
    // 用户使用后退返回到授权页，则默认回到首页
    mUtils.Cookie.set('beforeLoginUrl', encodeURIComponent(to.fullPath)) // 保存用户进入的url
    next({
      name: '登陆',
      query: {
        redirect: to.fullPath
      }
    });
    return false
  }
  next();
});
router.afterEach((to, from, next) => {
  document.title = to.meta.title || '田夫网';
  window.scrollTo(0, 0);
});

Vue.prototype.goBeforeLoginUrl = () => {
  let url = mUtils.Cookie.get('beforeLoginUrl')
  url = decodeURIComponent(url)
  if (!url || url.indexOf('/author') !== -1) {
    router.push({
      name: '首页'
    })
  } else {
    router.push(decodeURIComponent(url));
    mUtils.Cookie.set('beforeLoginUrl', '')
  }
};

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
