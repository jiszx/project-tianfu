/* 登录注册相关路由 */
const LoginRegister = () => import('pages/loginRegister/LoginRegister');
const ModifyPassword = () => import('pages/loginRegister/ModifyPassword');
const ForgetPassword = () => import('pages/loginRegister/ForgetPassword');
const Service = () => import('pages/loginRegister/Service');

export default[
  {
    path:'/loginRegister',
    name:'登录',
    component:LoginRegister,
    meta:{
      title: '登录',
      isLogin: true, // 是否禁止登录之后仍可以访问
      trust: true // 无需登录
    }
  },{
    path: '/modifyPassword',
    name: '修改密码',
    component: ModifyPassword,
    meta: {
      title: '修改密码',
      isLogin: true,
      trust: true
    }
  }, {
    path: '/forgetPassword',
    name: '忘记密码',
    component: ForgetPassword,
    meta: {
      title: '忘记密码',
      isLogin: true,
      trust: true
    }
  }, {
    path:'/userService',
    name:'用户协议',
    component: Service,
    meta:{
        title: '用户协议',
        isLogin: true, // 是否禁止登录之后仍可以访问
        trust: true // 无需登录
    }
  }
]