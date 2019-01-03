/**
 *  购物车相关
 * */

const cartList = () => import('pages/cart/cartList');

export default [
  {
    path: '/cart-list',
    name: '购物车',
    component: cartList,
    meta: {
      showTabbar: true,
      title: '购物车'
    }
  }
]
