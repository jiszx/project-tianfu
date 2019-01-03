const author = () => import('../../pages/PageRouter.vue');
const AccountManage = () => import('../../pages/author/AccountManage.vue');
const RoleManage = () => import('../../pages/author/RoleManage.vue');

export default {
    path:'author',
    name:'权限管理',
    component:author,
    redirect:{
      name:'后台账号管理'
    },
    children:[
      {
          path:'accountmanage',
          name:'后台账号管理',
          component:AccountManage
      },
      {
        path:'rolemanage',
        name:'角色权限管理',
        component:RoleManage
    }
    ]
}