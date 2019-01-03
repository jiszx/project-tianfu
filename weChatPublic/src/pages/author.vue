<template>
  <div class="page-author"></div>
</template>

<script>
export default {
  data () {
    return {
      api_login:'/oauth/token',//2.1. 获取accessToken
      api_get_user_info:'/user/mine',//8.1. 我的
      formData: {
        grant_type:'refresh_token',  //授权方式，值域：password，refresh_token
        scope:'trust',  //权限范围，可定死为：trust
        openId: '',  //微信open_id
        refresh_token: '', //刷新令牌
      },
      fromUrl:'',
    }
  },
  created(){
    this.fromUrl = this.$route.query.redirect
  },
  mounted() {
    this.authorFn();
  },
  methods: {
    authorFn() {
      this.formData.openId = this.$route.query.openId || '';
      this.formData.refresh_token = this.$route.query.access_token || '';
      // console.log('openId:'+this.$route.query.openId);
      // console.log('access_token:'+this.$route.query.access_token);
      if(this.formData.openId){
        this.$store.commit('updateopenId', this.formData.openId);// 更新微信openId
      }
      if(this.formData.refresh_token){
        this.$store.commit('updateRefreshToken', this.formData.refresh_token);// 更新微信access_token
      }
      this.formData.refresh_token = this.$store.state.mine.oauth.refresh_token;
      this.formData.openId = this.$store.state.mine.openId;
      // console.log('openId后续值:'+this.formData.openId); //这里都没执行
      if(this.$store.state.mine.openId){ // 如果有token则跳转到首页
        if(this.$store.state.mine.oauth.refresh_token) {
          this.doLogin();
        } else {
          this.$router.replace({name:'登录'});
        }
      }else{
        // 跳转到认证页面
        window.location.href = this.$commonConfig.wx_authorization_url;
      }
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
    doLogin(){
      let params = {
        ...this.formData,
        useDefaultAuthorization:true // 此字段用于表示是否使用默认的Authorization，解决获取授权接口使用默认Authorization问题
      };
      this.$axios.post(this.api_login, params)
        .then(res => {
          this.$store.commit('updataOauth', res);// 更新认证相关数据
          this.redirectFn();
          this.getUserInfo(res.access_token);
        })
    },
    /**
     获取个人信息
     */
    getUserInfo(access_token) {
      this.$axios.get(this.api_get_user_info)
        .then(res => {
          this.$store.commit('updataUserData', res); // 更新用户个人信息
        })
    }
  }
}
</script>

<style scoped>

</style>
