/**
 *  商家相关路由
 * */
const ShopList = () => import('pages/shop/ShopList');
export default [
  {
    path: '/shopList',
    name: '商家列表',
    component: ShopList,
    meta: {
      showTabbar: false,
      title: '商家列表'
    }
  },
]
