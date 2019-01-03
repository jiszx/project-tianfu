<template>
  <div class="login-page">
    <img class="login-bg" src="../assets/loading-bj.png" alt="">
    <div class="login">
      <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="0">
        <p class="titile">田夫网运营管理后台</p>
        <el-form-item label="" prop="username">
          <el-input placeholder="请输入登录账号" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password"> 
          <el-input type="password" placeholder="请输入密码" @keyup.native.enter="doLogin"  v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
           <el-button type="primary" class="submit_button" @click="doLogin">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  components:{},
  props:{},
  data(){
    return {
      api_login_url:'/oauth/token',
      user_author_url:'/setting/userPlatforms/info',
      api_virify_code: '/captcha.jpg',
      loginForm:{
        username:'',
        password:''
      },
      rules:{
        username:[{required:true,message:'请输入登录账号',trigger:'blur'}],
        password:[{required:true,message:'请输入登录密码',trigger:'blur'}]
      }
    }
  },
  created(){},
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    /* 登录 */
    doLogin(){
      this.$refs.loginForm.validate(valid=>{
        if(valid){
           var data={
             ...this.loginForm,
             grant_type:'password',
             scope:'trust',
             useDefaultAuthorization:true
           }
           data.password=md5(data.password);
           this.$axios.post(this.api_login_url,data)
           .then(res=>{
             this.$commonFun.setSessionStorage('user_token',res.data.data);
             this.getUserInfo();
           })
        }
      })
    },
    getUserInfo(){
      this.$axios.get(this.user_author_url)
      .then(res=>{
        this.$commonFun.setSessionStorage('user_info',res.data.data);
        if(res.data.data.roles[0].rolePerm){
            this.$message.success('登录成功');
            this.$router.push({name:res.data.data.roles[0].rolePerm.split(',')[0]})
        }else{
            this.$message.error('无权限，请先联系管理员添加角色权限');
            this.$router.push({name:'登录'})
        }            
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login-page {
  position: relative;
  height: 100%;
  .login-bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
}
.login{
  width:400px;
  position: absolute;
  left:50%;
  padding: 60px 58px 30px;
  transform: translateX(-50%);
  top:20%;
  background: rgba(255,255,255,1);
  .submit_button{
    margin-top: 10px;
    width:100%;
  }
  .titile{
    color: #34C975;
    font-size: 20px;
    text-align: center;
    padding: 20px;
  }
}
</style>