<template>
  <div class="forget-psd">
    <div class="forget-input">
      <van-cell-group>
        <van-field v-model="formData.phoneNumber" placeholder="请输入手机号码" />
         <van-field
          v-model="formData.verifyCode"
          center
          clearable
          placeholder="请输入短信验证码"
        >
          <div slot="button">
            <div class="msg-button" @click="getCodeBtnClick" :disabled="!show">
              {{!show ? (count + 's后重新获取') : '发送验证码'}}
            </div>
          </div>
        </van-field>
        <van-field v-model="formData.password" type="password" placeholder="请输入新的登录密码" />
      </van-cell-group>
    </div>
    <div class="forget-btn">
      <van-button size="large" @click="toLogin">确认</van-button>
    </div>
  </div>
</template>

<script>
import {Cell, CellGroup, Field, Button,} from 'vant';
import md5 from 'js-md5';
const TIME_COUNT = 60;
export default {
  data(){
    return {
      api_get_code: '/oauth/password', //12.4. 找回密码
      api_get_code_setting: '/verifyCodes/send', //12.1. 发送验证码
      api_validVerificationCode: '/verifyCodes/validated', //12.2. 检测验证码是否有效
      formData:{
        phoneNumber: '',
        verifyCode:'',
        password:'',
        type: '',//短信类型(0：注册，1：忘记密码)
      },
      show:true,
      count:60,
      timer: null,
    }
  },
  props:{},
  created(){},
  components:{
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-field': Field,
    'van-button': Button,
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    getCodeBtnClick(){
      if(this.$mUtils.checkType(this.formData.phoneNumber, 'phone')){
        if (!this.timer) {
          this.getCode(this.formData.phoneNumber);
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
      }else{
        this.$store.commit('showMsgTips', '手机号不是有效的中国内地手机号');
      }
    },
    getCode(){
      let data = {
        phoneNumber: this.formData.phoneNumber,
        type: 1
      }
      this.$axios.post(this.api_get_code_setting, data)
        .then(res => {
          this.$store.commit('showMsgTips', '已发送验证码');
        })
    },
    /**
     * 校验验证码
     */
    validVerificationCode() {
      let params = {
        phoneNumber: this.formData.phoneNumber,
        verifyCode: this.formData.verifyCode
      }
      this.$axios.post(this.api_validVerificationCode, params)
        .then(res => {
          // todo 路由跳转
          if(this.$mUtils.getBLen(this.formData.password)<6){
            this.$store.dispatch('showMsgTips', '密码长度不能小于6位')
          }else if(this.$mUtils.getBLen(this.formData.password)>16){
            this.$store.dispatch('showMsgTips', '密码长度不能大于16位')
          }else{
            let params = {
              phoneNumber: this.formData.phoneNumber,
              verifyCode: this.formData.verifyCode,
              password: this.formData.password
            }
            params.password = md5(params.password);
            this.$axios.post(this.api_get_code,params)
              .then(res => {
                this.$router.push({name:'登录'});
              }).catch(err => {
                
              })
          }
        })
    },
    toLogin() {
      this.validVerificationCode();
    }
  }
}
</script>
<style lang="scss" scoped>
.forget-psd{
  height:100%;
  width:100%;
}
</style>
<style lang="scss">
  .forget-psd{
    .forget-input{
      margin-top: 0.2rem;
      .van-cell-group{
        .van-cell{
          padding: 14px 0.3rem;
          background-color: #fff;
          .van-field__body{
            /*  Chrome浏览器表单自动填充默认样式 --通过纯色的阴影覆盖底(huang)色 */
            input:-webkit-autofill {
              -webkit-box-shadow: 0 0 0px 1000px white inset;
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
    .forget-btn{
      padding: 0.8rem 0.3rem;
      .van-button--default{
        color: #fff;
        background-color: #34C975;
        border: none;
        border-radius: 5px;
        span{
          font-size: 0.3rem;
        }
      }
    }
  }
</style>
