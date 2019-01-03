<template>
  <div class="login">
    <div class="login-header fontsize-34">田夫网</div>
    <div class="login_box">
     <!--  <van-tabs v-model="active">
        <van-tab title="登录"></van-tab>
        <van-tab title="注册"></van-tab>
      </van-tabs> -->
      <p class="slide_p">
        <span :class="{'active': isActive}" @click="loginClick">登录</span> 
        <span :class="{'active': !isActive}" @click="registerClick">注册</span>
      </p>
      <!-- 登录 -->
      <div class="login_tab" v-if="type == 'login'">
        <van-cell-group>
          <van-field v-model="formData.phoneNumber" placeholder="请输入手机号码" />
          <van-field v-model="formData.password" type="password" placeholder="请输入登录密码" />
        </van-cell-group>
        <!-- <div>
          <img :src="$commonConfig.baseURL+api_virify_code" alt="">
        </div> -->
        <div class="fontsize-26 forget-psd">
          <span class="pull-right" @click="forget_psd">忘记密码？</span>
        </div>
        <div class="login-div">
          <van-button size="large" :disabled="isDisabled" @click="doLogin">登录</van-button>
        </div>
      </div>
      <!-- 注册第一步 -->
      <div class="register_tab" v-if="type == 'register' && isStep == 'first'">
        <van-cell-group>
          <van-field v-model="formData.phoneNumber" placeholder="请输入手机号码" />
          <van-field
            v-model="formData.verifyCode"
            center
            clearable
            placeholder="请输入短信验证码"
          >
           <!--  <van-button slot="button">发送验证码</van-button> -->
            <div slot="button">
              <div class="msg-button" @click="getCodeBtnClick" :disabled="!show">
                {{!show ? (count + 's后重新获取') : '发送验证码'}}
              </div>
            </div>
          </van-field>
        </van-cell-group>
        <div class="fontsize-26 forget-psd">
          <van-checkbox v-model="checked" checked-color="#4b0"><span class="is-read">我已阅读并同意</span><span @click="agreement">《用户注册协议》</span></van-checkbox>
        </div>
        <div class="login-div">
          <van-button size="large" @click="nextStep">下一步</van-button>
        </div>
      </div>
      <!-- 注册第二步 -->
      <div class="register_tab" v-if="type == 'register' && isStep == 'second'">
        <van-cell-group>
          <van-field v-model="formData.password" type="password" placeholder="请设置一个登录密码" />
        </van-cell-group>
        <div class="login-div">
          <van-button size="large" @click="register">完成</van-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {Tabs, Tab, Cell, CellGroup, Field, Button, Checkbox } from 'vant';
import md5 from 'js-md5';
const TIME_COUNT = 60;
export default {
  data(){
    return {
      api_login:'/oauth/token', //2.1. 获取accessToken
      api_get_user_info:'/user/mine', //8.1. 我的
      api_get_code_setting: '/verifyCodes/send', //12.1. 发送验证码
      api_validVerificationCode: '/verifyCodes/validated', //12.2. 检测验证码是否有效
      api_signup: '/oauth/signup', //12.3. 注册
      api_virify_code: '/captcha.jpg', // 验证码
      // active: 1
      isActive: true,
      type: 'login',
      isStep:'first',
      isDisabled: true,
      checked: false,
      formData:{
        grant_type:'password',
        password: '',
        scope:'trust',
        username: '',
        phoneNumber:'',
        verifyCode:'',
      },
      fromUrl:'',
      show:true,
      count:60,
      timer: null,
    }
  },
  props:{},
  created(){
    this.fromUrl = this.$route.query.redirect;
  },
  mounted(){},
  watch:{
    newValue(val, oldVal){//普通的watch监听
      if(this.formData.phoneNumber){
        this.isDisabled = false;
      }else{
        this.isDisabled = true;
      }
    },
  },
  computed:{
    newValue() {
　　　return this.formData.phoneNumber
　　}
  },
  components:{
    'van-tabs': Tabs,
    'van-tab': Tab,
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-field': Field,
    'van-button': Button,
    'van-checkbox': Checkbox
  },
  methods:{
    /* 登录切换注册事件 */
    loginClick() {
      this.isActive = true;
      this.type = 'login';
    },
    /**
     * 登录完跳转
     */
    redirectFn() {
      // console.log('登录完成')
      if (this.fromUrl) {
        this.$router.push(this.fromUrl)
      } else {
        this.$router.push({name:'首页'})
      }
    },
    /**
     获取个人信息
     */
    getUserInfo(access_token) {
      this.$axios.get(this.api_get_user_info)
        .then(res => {
          res.phoneNumber = this.formData.phoneNumber;
          this.$store.commit('updataUserData', res);
        })
    },
    /* 登录 */
    doLogin() {
      if (!this.formData.phoneNumber || !this.formData.password) {
        this.$store.dispatch('showMsgTips', !this.formData.phoneNumber ? '手机号不能为空' : '密码不能为空')
        return;
      }
      let params = {
        ...this.formData,
        useDefaultAuthorization:true // 此字段用于表示是否使用默认的Authorization，解决获取授权接口使用默认Authorization问题
      };
      params.username = params.phoneNumber;
      params.password = md5(params.password)
      // 验证成功
      this.$axios.post(this.api_login, params)
        .then(res => {
          this.$store.commit('updataOauth', res);
          this.$store.dispatch('settingGetInfo');// 获取基础设置信息
          this.redirectFn();
          this.getUserInfo(res.access_token)
        }).catch(err => {

        })
    },
    /* 注册切换登录事件 */
    registerClick() {
      this.isActive = !this.isActive;
      this.type = 'register';
    },
    /* 验证手机验证码是否有效 */
    getCodeBtnClick(){
      this.getCode(this.formData.phoneNumber);
    },
    /* 发送短信验证码 */
    getCode(){
      let params = {
        phoneNumber: this.formData.phoneNumber,
        type: 0
      }
      if(this.$mUtils.checkType(params.phoneNumber, 'phone')){
        this.$axios.post(this.api_get_code_setting, params)
          .then(res => {
            this.$store.commit('showMsgTips', '已发送验证码');
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.show = false;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  this.show = true;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000)
            }
          }).catch(err => {

          })
      }else{
        this.$store.commit('showMsgTips', '请输入正确的手机号');
      }
    },
    /* 校验验证码 注册下一步 */
    nextStep() {
      if(this.checked){
        let params = {
          phoneNumber: this.formData.phoneNumber,
          verifyCode: this.formData.verifyCode
        }
        this.$axios.post(this.api_validVerificationCode, params)
          .then(res => {
            console.log(res,222)
            // todo 路由跳转
            this.isStep = 'second';
          }).catch(err => {

          })
      }else{
        this.$store.commit('showMsgTips', '请勾选确认用户协议！');
      }
    },
    /* 注册成功 */
    register() {
      if(this.$mUtils.getBLen(this.formData.password)<6){
        this.$store.dispatch('showMsgTips', '密码长度不能小于6位')
      }else if(this.$mUtils.getBLen(this.formData.password)>16){
        this.$store.dispatch('showMsgTips', '密码长度不能大于16位')
      }else{
        let params = {
          phoneNumber:this.formData.phoneNumber,
          verifyCode:this.formData.verifyCode,
          password:this.formData.password,
        };
        params.password = md5(params.password);
        // 验证成功
        this.$axios.post(this.api_signup, params)
          .then(res => {
            this.$store.commit('updataOauth', res);
            let obj ={
              phoneNumber: params.phoneNumber
            }
            this.$store.commit('updataUserData', obj);
            this.$router.push({name:'目的选择',query:{phoneNumber:obj.phoneNumber,isRegister:true}});
          })
      }
    },
    /* 协议跳转 */
    agreement() {
      this.$router.push({name:'用户协议'});
    },
    /** 忘记密码*/
    forget_psd() {
      let phone = this.formData.phoneNumber;
      // phone = phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2"); //处理手机号中间四位变成*星号
      this.$router.push({name:'忘记密码'});
    },
  }
}
</script>
<style lang="scss" scoped>
.login{
  height:100%;
  width:100%;
  background: linear-gradient(to bottom,#61e395,#39c46e);
  position: relative;
  .login-header{
    text-align: center;
    color: #fff;
    padding-top: 0.34rem;
  }
  .login_box{
    width:100%;
    position: absolute;
    left:0;
    right:0;
    top:45%;
    transform: translateY(-50%);
    padding:0 0.30rem;
    .slide_p{
      font-size: 0.36rem;
      padding-left: 0.20rem;
      color:RGBA(193, 255, 220, 1);
      margin-bottom: 0.3rem;
      span{
        margin-right: 0.28rem;
        color: #C1FFDC;
      }
      .active{
        color: #fff;
      }
    }
    .login_tab,.register_tab{
      background-color: #fff;
      border-radius: 5px;
      width:100%;
      padding:.6rem 0.4rem;
      .forget-psd{
        color: #34C975;
        height: 0.3rem;
        .is-read{
          color:#939393;
        }
      }
    }
    .login_tab:before{
      content: '';
      width: 0;
      height: 0;
      border: 10px solid transparent; /*调整小三角形的大小*/
      border-bottom-color: #fff;/*改变小三角的颜色（最好就是和父级div的背景颜色相同）;bottom是用于调整小三角的方向*/
      position: absolute;
      left: 33px;/*调整小三角形的位置*/
      bottom: 100%;/*调整小三角形的位置*/
      top: 20px;/*调整小三角形的位置 */
    }
    .register_tab:before{
      content: '';
      width: 0;
      height: 0;
      border: 10px solid transparent; /*调整小三角形的大小*/
      border-bottom-color: #fff;/*改变小三角的颜色（最好就是和父级div的背景颜色相同）;bottom是用于调整小三角的方向*/
      position: absolute;
      left: 88px;/*调整小三角形的位置*/
      bottom: 100%;/*调整小三角形的位置*/
      top: 20px;/*调整小三角形的位置 */
    }
    @media (max-width: 320px) {
       .login_tab:before{
        left: 26px;/*调整小三角形的位置*/
        top: 15px;/*调整小三角形的位置 */
      }
      .register_tab:before{
        left: 75px;/*调整小三角形的位置*/
        top: 15px;/*调整小三角形的位置 */
      }
    }
    @media (min-width: 321px) and (max-width: 375px){
      .login_tab:before{
        left: 33px;/*调整小三角形的位置*/
        top: 20px;/*调整小三角形的位置 */
      }
      .register_tab:before{
        left: 88px;/*调整小三角形的位置*/
        top: 20px;/*调整小三角形的位置 */
      }
    }
    @media (min-width: 414px){
       .login_tab:before{
        left: 37px;/*调整小三角形的位置*/
        top: 25px;/*调整小三角形的位置 */
      }
      .register_tab:before{
        left: 99px;/*调整小三角形的位置*/
        top: 25px;/*调整小三角形的位置 */
      }
    }
  }
}
</style>
<style lang="scss">
  .login{
    .login_box{
      .login_tab,.register_tab{
        .van-cell-group{
          .van-cell{
            padding: 0.28rem 0.3rem;
            background-color: #F2F6F9;
            margin-bottom: 0.3rem;
            border-radius: 5px;
            .van-cell__value{
              .van-field__body{
               /*  Chrome浏览器表单自动填充默认样式 --通过纯色的阴影覆盖底(huang)色 */
                input:-webkit-autofill {
                  -webkit-box-shadow: 0 0 0px 1000px #F2F6F9 inset;
                  -webkit-text-fill-color: #333;
                }
                .van-field__button{                                    
                  .msg-button {
                    color: #34C975;
                  }
                  .van-button,.van-button--default{
                    border:none;
                    background-color: #F2F6F9;
                    height: 0rem;
                    line-height: 0rem;
                    span{
                      color:#34C975;
                    }
                  }
                }
              }
            }
          }
        }
        .forget-psd{
          .van-checkbox{
            .van-checkbox__icon, .van-checkbox__label{
              line-height: 14px; 
            }
            .van-checkbox__icon .van-icon{
              width: 14px;
              height: 14px;
            }
          }
        }
        .login-div{
          .van-button--default{
            color: #fff;
            background-color: #FFC046;
            border: none;
            border-radius: 5px;
            margin-top: 0.5rem;
          }
        }
      }
    }
  }
</style>
