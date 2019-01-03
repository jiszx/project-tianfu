/**
 *  商品相关路由
 * */
const Goods = () => import('pages/goods/Goods');
const Classify = () => import('pages/goods/Classify');
const GoodsDetails = () => import('pages/goods/GoodsDetails');
const GoodsTrace = () => import('pages/goods/GoodsTrace');
const SupplyHall = () => import('pages/goods/SupplyHall');
const GoodsComments = () => import('pages/goods/GoodsComments');
const StoreHomepage = () => import('pages/goods/StoreHomepage');
const SearchGoods = () => import('pages/goods/SearchGoods');
export default [{
    path: '/goods',
    name: '商品分类',
    component: Goods,
    meta: {
      showTabbar: true,
      title: '商品分类'
    }
  }, {
    path: '/Classify',
    name: '三级分类',
    component: Classify,
    meta: {
      title: '三级分类'
    }
  }, {
    path: '/goodsDetails',
    name: '商品详情',
    component: GoodsDetails,
    meta: {
      title: '商品详情'
    }
  }, {
    path: '/goodsTrace',
    name: '商品追溯信息',
    component: GoodsTrace,
    meta: {
      title: '商品追溯信息'
    }
  }, {
    path: '/supplyHall',
    name: '供应大厅',
    component: SupplyHall,
    meta: {
      title: '供应大厅'
    }
  }, {
    path: '/goodsComments',
    name: '评价',
    component: GoodsComments,
    meta: {
      title: '评价'
    }
  }, {
    path: '/storeHomepage',
    name: '店铺主页',
    component: StoreHomepage,
    meta: {
      title: '店铺主页'
    }
  }, {
    path: '/searchGoods',
    name: '商品搜索',
    component: SearchGoods,
    meta: {
      title: '商品搜索'
    }
  },
]
