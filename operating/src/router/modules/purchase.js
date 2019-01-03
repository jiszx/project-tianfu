
const purchase = () => import('../../pages/PageRouter.vue');
const InformationAudi = () => import('../../pages/purchase/InformationAudi.vue');
const InformationManagement = () => import('../../pages/purchase/InformationManagement.vue');
export default {
  path: 'purchase',
  name: '采购大厅',
  component: purchase,
  redirect: {
    name: '采购信息审核'
  },
  children: [{
      path: 'informationAudi',
      name: '采购信息审核',
      component: InformationAudi
    },
    {
      path: 'informationManagement',
      name: '采购信息管理',
      component: InformationManagement
    }
  ]
}