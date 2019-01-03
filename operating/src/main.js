// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';
import * as config from './common/config' 
import './common/css/common.scss'
import {axios} from './axios'
import {commonFun} from './common/js/commonFun'
import {formCheckedRules} from './common/js/formCheckedRules'
// 图片旋转放大组件
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
//Vue.use(Viewer) 默认配置写法
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    "title": false, // 不显示当前图片的标题
  },
});
Viewer.setDefaults({
  Options: {
    "inline": true, // 启用 inline 模式
    "button": true, // 显示右上角关闭按钮
    "navbar": true, // 显示缩略图导航
    // "title": true, // 显示当前图片的标题
    "toolbar": true, // 显示工具栏
    "tooltip": true, // 显示缩放百分比
    "movable": true, // 图片是否可移动
    "zoomable": true, // 显图片是否可缩放
    "rotatable": true, // 图片是否可旋转
    "scalable": true, // 图片是否可翻转
    "transition": true, // 使用 CSS3 过度
    "fullscreen": true, // 播放时是否全屏
    "keyboard": true, // 是否支持键盘
    "url": "data-source" // 设置大图片的 url
  }
});
Vue.config.productionTip = false

/* 全局挂载 */
Vue.prototype.$axios = axios;
Vue.prototype.$commonFun = commonFun;
Vue.prototype.$formRules = formCheckedRules;
/* 配置信息 */
Vue.prototype.$config = config;

Vue.use(ElementUI);

//开发环境
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/';
} else {  //生产环境
  // build
  axios.defaults.baseURL = config.baseURL;
}


router.beforeEach((to, from, next) => {
   store.state.activeIndex=to.fullPath;
   var userInfo=commonFun.getSessionStorage('user_info')||'';
   if(to.name=='登录'||to.name=='404'){
     next()
   }else if(!commonFun.getSessionStorage('user_token')){
     ElementUI.Message.error('请先登录');
      next({name:'登录'})
   }else if(commonFun.authorComparise(to.name,userInfo.roles[0].rolePerm.split(','))||commonFun.authorComparise(to.meta.replaceAuthor,userInfo.roles[0].rolePerm.split(','))){
     next()
   }else{
    ElementUI.Message.error('您暂无该模块权限，请联系管理员开通')
     next(from.path)
   }
})
router.afterEach((to, from) => {
  document.title = to.meta.title || '田夫网';
});

/* 偶发错误捕获 待观察 */
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
