import Vue from 'vue'
import Router from 'vue-router'
const Login = () => import('../pages/Login.vue');
const View = () => import('../pages/view.vue');
const NotFind = () => import('../pages/404.vue');
const Index = () => import('../pages/Index/index.vue');
import user from './modules/user'
import author from './modules/author'
import basicSet from './modules/basicSet'
import purchase from './modules/purchase'
import operate from './modules/operate'
import train from './modules/train'
import finance from './modules/finance'
import goods from './modules/goods'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'APP',
      component: View,
      redirect:{
        name:'首页'
      },
      children:[  //路由排列影响角色权限设置列表排列
          {
            path:'index',
            name:'首页',
            component:Index
          },
          user,
          operate,
          train,
          finance,
          author,          
          basicSet,
          purchase,
          goods       
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/*',
      name: '404',
      component: NotFind      
    }
  ]
})
