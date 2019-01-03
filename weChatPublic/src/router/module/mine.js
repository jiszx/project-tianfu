/**
 *  个人中心相关路由
 * */
const Mine = () => import('pages/mine/Mine');
const MineAuthentication = () => import('pages/mine/MineAuthentication');
const MineReal = () => import('pages/mine/MineRealName');
const UserInfo = () => import('pages/mine/user-info/UserInfo');
const ObjectiveSelection = () => import('pages/mine/user-info/ObjectiveSelection');
const PerfectInfo = () => import('pages/mine/user-info/PerfectInfo');
const AddressList = () => import('pages/mine/address/AddressList.vue');
const AddressEdit = () => import('pages/mine/address/AddressEdit');
const MyRightList = () => import('pages/mine/myRight/MyRightList');
const RightDetails = () => import('pages/mine/myRight/RightDetails');
const ShopList = () => import('pages/shop/ShopList');
const Setting = () => import('pages/mine/Setting');
export default [{
  path: '/mine',
  name: '个人中心',
  component: Mine,
  meta: {
    showTabbar: true,
    title: '个人中心'
  }, 
}, {
    path: '/myFoucas',
    name: '我的关注',
    component: ShopList,
    meta: {
      showTabbar: false,
      title: '我的关注'
    },
  }, {
    path: '/mineAuthentication',
    name: '我的认证',
    component: MineAuthentication,
    meta: {
      showTabbar: false,
      title: '我的认证'
    },
  }, {
    path: '/minerealname',
    name: '实名认证',
    component: MineReal,
    meta: {
      showTabbar: false,
      title: '实名认证'
    },
  }, {
    path: '/minecompany',
    name: '企业认证',
    component: MineReal,
    meta: {
      showTabbar: false,
      title: '企业认证'
    },
  }, {
    path: '/aptitude',
    name: '资质认证',
    component: MineReal,
    meta: {
      showTabbar: false,
      title: '资质认证'
    },
  }, {
    path: '/vip',
    name: 'VIP身份',
    component: MineReal,
    meta: {
      showTabbar: false,
      title: 'VIP身份'
    },
  },{
    path: '/userInfo',
    name: '用户信息',
    component: UserInfo,
    meta:{
      showTabbar: false,
      title: '用户信息'
    }
  },{
    path: '/objectiveSelection',
    name: '目的选择',
    component: ObjectiveSelection,
    meta: {
      showTabbar: false,
      title: '目的选择'
    }
  }, {
    path: '/perfectInfo',
    name: '完善信息',
    component: PerfectInfo,
    meta: {
      showTabbar: false,
      title: '完善信息'
    }
  }, {
    path: '/address',
    name: '收货信息',
    component: AddressList,
    meta: {
      showTabbar: false,
      title: '收货信息'
    }
  }, {
    path: '/addressEdit',
    name: '编辑收货地址',
    component: AddressEdit,
    meta: {
      showTabbar: false,
      title: '编辑收货地址'
    }
  }, {
    path: '/myRight',
    name: '我的维权',
    component: MyRightList,
    meta: {
      showTabbar: false,
      title: '我的维权'
    }
  }, {
    path: '/rightDetails',
    name: '维权详情',
    component: RightDetails,
    meta: {
      showTabbar: false,
      title: '维权详情'
    }
  }, {
    path: '/setting',
    name: '设置',
    component: Setting,
    meta: {
      showTabbar: false,
      title: '设置'
    }
  },
]
