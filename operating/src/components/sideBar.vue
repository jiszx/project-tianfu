<template>
  <div class="side_bar">
    <el-menu  class="el-menu-vertical-demo"  
    :collapse="collapse"
    :default-active="activeIndex"
    background-color="#3E3E3E"
    text-color="#fff"
    active-text-color="#34C975"
    unique-opened
    router
    >
        <el-menu-item index="/index" v-if="isShow('首页')">
            <i class="iconfont  icon-shouye"></i>
            <span slot="title">首页</span>
        </el-menu-item>    
        <el-submenu index="/user" v-if="isShow('用户管理')||isShow('认证申请')||isShow('认证用户管理')">
            <template slot="title">
            <i class="iconfont icon-yonghu"></i>
            <span slot="title">用户</span>
            </template>
            <el-menu-item-group>
            <el-menu-item index="/user/usermanage" v-if="isShow('用户管理')">用户管理</el-menu-item>
            <el-menu-item index="/user/applicationCertification" v-if="isShow('认证申请')">认证申请</el-menu-item>
            <el-menu-item index="/user/authenticatedUser" v-if="isShow('认证用户管理')">认证用户管理</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/operate" v-if="isShow('首页管理')||isShow('资讯新闻')">
            <template slot="title">
            <i class="iconfont icon-yunyingtuiguang"></i>
            <span slot="title">运营推广</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/operate/homepageManage" v-if="isShow('首页管理')">首页管理</el-menu-item>
              <el-menu-item index="/operate/informationNews" v-if="isShow('资讯新闻')">资讯新闻</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/train" v-if="isShow('课程管理')||isShow('专家库')||isShow('留言管理/回复')">
            <template slot="title">
            <i class="iconfont icon-peixun"></i>
            <span slot="title">培训</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/train/courseManagement" v-if="isShow('课程管理')">课程管理</el-menu-item>
              <el-menu-item index="/train/expertLibrary" v-if="isShow('专家库')">专家库</el-menu-item>
              <el-menu-item index="/train/messageManagement" v-if="isShow('留言管理/回复')">留言管理/回复</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/finance" v-if="isShow('资金订单管理')">
            <template slot="title">
            <i class="iconfont icon-caiwuguanli"></i>
            <span slot="title">财务管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/finance/capitalOrderManagement" v-if="isShow('资金订单管理')">资金订单管理</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/author" v-if="isShow('后台账号管理')||isShow('角色权限管理')">
            <template slot="title">
            <i class="iconfont icon-quanxianguanli"></i>
            <span slot="title">权限管理</span>
            </template>
            <el-menu-item-group>
            <el-menu-item index="/author/accountmanage"  v-if="isShow('后台账号管理')">后台账号管理</el-menu-item>
            <el-menu-item index="/author/rolemanage" v-if="isShow('角色权限管理')">角色权限管理</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/basicset" v-if="isShow('分类管理')||isShow('参数配置')">
            <template slot="title">
            <i class="iconfont icon-weibiaoti-"></i>
            <span slot="title">基础配置</span>
            </template>
            <el-menu-item-group>
            <el-menu-item index="/basicset/classifymanage" v-if="isShow('分类管理')">分类管理</el-menu-item>
            <el-menu-item index="/basicset/paramsconfig" v-if="isShow('参数配置')">参数配置</el-menu-item>
            </el-menu-item-group>
        </el-submenu> 
        <el-submenu index="/purchase" v-if="isShow('采购信息审核')||isShow('采购信息管理')">
            <template slot="title">
            <i class="iconfont icon-quanzi"></i>
            <span slot="title">采购大厅</span>
            </template>
            <el-menu-item-group>
            <el-menu-item index="/purchase/InformationAudi" v-if="isShow('采购信息审核')">采购信息审核</el-menu-item>
            <el-menu-item index="/purchase/InformationManagement" v-if="isShow('采购信息管理')">采购信息管理</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <!-- <el-menu-item index="/purchasehall" v-if="isShow('采购大厅')">
            <i class="iconfont  icon-quanzi"></i>
            <span slot="title">采购大厅</span>
        </el-menu-item>   --> 
        <el-menu-item index="/goods" v-if="isShow('商品管理')">
            <i class="iconfont icon-shangpinguanli"></i>
            <span slot="title">商品管理</span>
        </el-menu-item>          
    </el-menu>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  components:{},
  props:['collapse'],
  data(){
    return {
      rolePerm:[]
    }
  },
  created(){
    this.rolePerm=this.$commonFun.getSessionStorage('user_info').roles[0].rolePerm.split(',');
  },
  mounted(){},
  watch:{},
  computed:{
    ...mapState({
      activeIndex:state=>state.activeIndex
    })
  },
  methods:{
    isShow(str){
     var show=false;
      for(var i=0;i<this.rolePerm.length;i++){
        if(this.rolePerm[i]==str){
          show=true;
          break;
        }
      }
      return show;
    }
  }
}
</script>
<style lang="scss" >
.side_bar{
  height:100%;
  width:100%;
  .el-menu-vertical-demo {
     height:100%; 
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 201px;
    height:100%;
  }
}
</style>