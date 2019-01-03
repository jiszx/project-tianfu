const operate = () => import('../../pages/PageRouter.vue');
const HomepageManage = () => import('../../pages/operate/HomepageManage.vue');
const InformationNews = () => import('../../pages/operate/InformationNews.vue');
const EditAdvertisement = () => import('../../pages/operate/EditAdvertisement.vue');
const EditNews = () => import('../../pages/operate/EditNews.vue');

export default {
  path: 'operate',
  name: '运营推广',
  component: operate,
  redirect: {
    name: '首页管理'
  },
  children: [{
    path: 'homepageManage',
    name: '首页管理',
    component: HomepageManage
  }, {
    path: 'informationNews',
    name: '资讯新闻',
    component: InformationNews
  },
  {
    path:'editnews',
    name:'编辑新闻',
    component:EditNews,
    meta:{replaceAuthor:'资讯新闻'}
  },
  {
    path:'editAdvertisement',
    name:'编辑广告',
    component:EditAdvertisement,
    meta:{replaceAuthor:'首页管理'}
  }
]
}