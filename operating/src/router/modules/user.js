
const user = () => import('../../pages/PageRouter.vue');
const UserManage = () => import('../../pages/user/UserManage.vue');
const ApplicationCertification = () => import('../../pages/user/ApplicationCertification.vue');
const AuthenticatedUser = () => import('../../pages/user/AuthenticatedUser.vue');
const AuthenticatedUserDetails = () => import('../../pages/user/AuthenticatedUserDetails.vue');
export default {
    path:'user',
    name:'用户',
    component:user,
    redirect:{
     name:'用户管理'
    },
    children:[
      {
        path:'usermanage',
        name:'用户管理',
        component:UserManage
      }, {
        path: 'applicationCertification',
        name: '认证申请',
        component: ApplicationCertification
      }, {
        path: 'lookBusinessHistory',
        name: '查看商家审核历史',
        component: ApplicationCertification,
        meta:{replaceAuthor:'认证申请'}
      }, {
        path: 'authenticatedUser',
        name: '认证用户管理',
        component: AuthenticatedUser
      },{
        path: 'authenticatedUserDetails',
        name: '商家详情',
        component: AuthenticatedUserDetails,
        meta:{replaceAuthor:'认证用户管理'}
      }
    ]
}