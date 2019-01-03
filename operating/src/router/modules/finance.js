const finance = () => import('../../pages/PageRouter.vue');
const CapitalOrderManagement = () => import('../../pages/finance/CapitalOrderManagement.vue');
const CapitalOrderDetails = () => import('../../pages/finance/CapitalOrderDetails.vue');
export default {
  path: 'finance',
  name: '财务管理',
  component: finance,
  redirect: {
    name: '资金订单管理'
  },
  children: [{
    path: 'capitalOrderManagement',
    name: '资金订单管理',
    component: CapitalOrderManagement
  }, {
    path: 'capitalOrderDetails',
    name: '订单详情',
    component: CapitalOrderDetails,
    meta:{replaceAuthor:'资金订单管理'}
  }]
}