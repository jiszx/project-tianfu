/**
 *  发现相关路由
 * */
const Find = () => import('pages/find/Find');
const PurchasingHall = () => import('pages/find/purchasing/PurchasingHall');
const PurchasDetail = () => import('pages/find/purchasing/PurchasDetail');
const PurchasPublic = () => import('pages/find/purchasing/PurchasingPublic');
const PublicPurchas = () => import('pages/find/purchasing/PublicPurchasing');
const PublicSuccess = () => import('pages/find/purchasing/PublicSuccess');
const ExpertsAsk = () => import('pages/find/ExpertsAsk');
const TrainingClass = () => import('pages/find/TrainingClass');
const TrainingDetail = () => import('pages/find/ClassDetail');
export default [
  {
    path: '/find',
    name: '发现',
    component: Find,
    meta: {
      showTabbar: true,
      title: '发现'
    }
  },
  {
    path: '/purchasingHall',
    name: '采购大厅',
    component: PurchasingHall,
    meta: {
      title: '采购大厅'
    }
  }, {
    path: '/purchasDetail',
    name: '采购详情',
    component: PurchasDetail,
    meta: {
      title: '采购详情'
    }
  }, {
    path: '/purchasPublic',
    name: '发布采购',
    component: PurchasPublic,
    meta: {
      title: '发布采购'
    }
  }, {
    path: '/publicPurchas',
    name: '采购发布',
    component: PublicPurchas,
    meta: {
      title: '采购发布'
    }
  }, {
    path: '/publicSuccess',
    name: '发布成功',
    component: PublicSuccess,
    meta: {
      title: '发布成功'
    }
  },
  {
    path: '/expertsAsk',
    name: '专家问答',
    component: ExpertsAsk,
    meta: {
      title: '专家问答'
    }
  },
  {
    path: '/trainingClass',
    name: '培训课堂',
    component: TrainingClass,
    meta: {
      title: '培训课堂'
    }
  },
  {
    path: '/trainingDetail',
    name: '课程详情',
    component: TrainingDetail,
    meta: {
      title: '课程详情'
    }
  },
]
