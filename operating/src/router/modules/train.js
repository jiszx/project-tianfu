const train = () => import('../../pages/PageRouter.vue');
const CourseManagement = () => import('../../pages/train/CourseManagement.vue');
const ExpertLibrary = () => import('../../pages/train/ExpertLibrary.vue');
const MessageManagement = () => import('../../pages/train/MessageManagement.vue');
const EditCourse = () => import('../../pages/train/EditCourse.vue');
const EditExpert = () => import('../../pages/train/EditExpert.vue');
export default {
  path: 'train',
  name: '培训',
  component: train,
  redirect: {
    name: '课程管理'
  },
  children: [{
    path: 'courseManagement',
    name: '课程管理',
    component: CourseManagement
  }, 
  {
    path:'editcourse',
    name:'编辑课程',
    component:EditCourse,
    meta:{replaceAuthor:'课程管理'}
  },
  {
    path: 'expertLibrary',
    name: '专家库',
    component: ExpertLibrary
  }, 
  {
   path:'editexpert',
   name:'编辑专家',
   component:EditExpert,
   meta:{replaceAuthor:'专家库'}
  },
  {
    path: 'messageManagement',
    name: '留言管理/回复',
    component: MessageManagement
  }]
}