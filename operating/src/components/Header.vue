<template>
  <div class="header">
     <div :style="{'width':isCollapse?'64px':'201px'}" class="logo_box">
       <img src="../assets/logo-1.png" v-if="!isCollapse" alt="">
       <img src="../assets/logo-2.png" v-else alt="">
     </div>
     <i class="iconfont icon-nav collapse"  @click="changeCollapse"></i>
      <el-dropdown @command="handleCommand" class="drop_down_command">
        <span class="el-dropdown-link">
          {{userName}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>     
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      isCollapse:false,
      userName:'',
    }
  },
  created(){
    this.userName=this.$commonFun.getSessionStorage('user_info').userPlatUser;
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    changeCollapse(){
      this.isCollapse=!this.isCollapse;
      this.$emit('changeCollapse',this.isCollapse)
    },
    logout(){
      this.$commonFun.removeSessionStorage('user_info');
      this.$commonFun.removeSessionStorage('user_token');
      this.$message.success('已退出登录');
      this.$router.push({name:'登录'})
    },
    handleCommand(com){
      if(com=='a'){
        this.logout();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.header{
    width:100%;
    height:50px;
    background-color: #fff;
    overflow: hidden;
    .logo_box{
      height:50px;
      float: left;
      background-color: rgb(62, 62, 62);
      border-right: solid 1px #e6e6e6;
      transition: all .300s ease-in-out;
      img{
        display: block;
        line-height: 50px;
        text-align: center;
        margin:0 auto;
        margin-top:10px;
      }
    }
    .collapse{
        font-size: 20px;
        line-height: 50px;
        color:#333;
        margin-left:15px;
    }
    .drop_down_command{
      float:right;
      line-height: 50px;
      margin-right:20px;
    }
}
</style>