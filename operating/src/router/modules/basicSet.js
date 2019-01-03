const basicSet = () => import('../../pages/PageRouter.vue');
const ClassifyManage = () => import('../../pages/basicSet/ClassifyManage.vue');
const ParamsConfig = () => import('../../pages/basicSet/ParamsConfig.vue');
export default {
   path:'basicset',
   name:'基础配置',
   component:basicSet,
   redirect:{
     name:'分类管理'
   },
   children:[
       {
           path:'classifymanage',
           name:'分类管理',
           component:ClassifyManage
       },
       {
        path:'paramsconfig',
        name:'参数配置',
        component:ParamsConfig
    }
   ]
}