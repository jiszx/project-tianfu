
const Goods = () => import('../../pages/PageRouter.vue');
const GoodsList = () => import('../../pages/goods/GoodsList.vue');
const GoodsEdit = () => import('../../pages/goods/EditGoods.vue');
export default {
    path:'goods',
    name:'商品管理',
    component:Goods,
    redirect:{
     name:'商品列表'
    },
    children:[
      {path:'goodslist',name:'商品列表',component:GoodsList},
      {path:'goodsedit',name:'查看商品',component:GoodsEdit},
    ]
}