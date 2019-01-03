<template>
  <div class="page-purchasDetail">
    <div class="message-row page-content van-hairline--bottom">
      <div class="message-image">
        <img v-if="customer && customer.custAvatarUrl" :src="customer.custAvatarUrl" alt="">
        <img v-else src="../../../assets/images/mine/wd-tx@2x.png" alt="">
      </div>
      <div class="message-main">
        <div class="message-title">
          <span class="fontsize-34">{{customer.custName}}</span>
          <span class="gray pull-right fontsize-26">
            <img v-if="customer.realNameAuth === 1" src="../../../assets/images/mine/wd-rz-r@2x.png" alt="">
            <img v-if="customer.aptitudeAuth === 1" src="../../../assets/images/mine/wd-rz-z@2x.png" alt="">
            <img v-if="customer.enterpriseAuth === 1" src="../../../assets/images/mine/wd-rz-q@2x.png" alt="">
            <img v-if="customer.vipAuth === 1" src="../../../assets/images/mine/wd-rz-v@2x.png" alt="">
          </span>
        </div>
        <div class="message-item gray fontsize-26">
          <p class="ellipsis">{{customer.areaPath?customer.areaPath.replace(/\>/g, ''):''}}</p>
        </div>
      </div>
    </div>
    <van-cell-group class="marginT30">
      <van-cell title="要货品种：" :value="formData.commoTyName" />
      <van-cell title="要货数量：" :value="formData.commoNum+formData.commoUnit"/>
      <van-cell title="指定产地：" :value="formData.areaPath?formData.areaPath.replace(/\>/g, ''):'全国'" />
      <van-cell title="品质要求：" :value="formData.qualityRequirement"/>
      <van-cell title="要货时间：" :value="$mUtils.formatDate(formData.toStartDate, 'yyyy-MM-dd')+'~'+$mUtils.formatDate(formData.toEndDate, 'yyyy-MM-dd')"/>
      <van-cell title="是否可追溯：" :value="formData.canTrace?'可追溯':'不可追溯'"/>
    </van-cell-group>
    <div class="purchasing-pubilc-btn" @click="phoneCall">
      <img src="../../../assets/images/purchasing/cgxq-dh.png" alt=""> 电话联系
    </div>
  </div>
</template>

<script>
import { CellGroup, Cell, Icon, Dialog } from 'vant';
export default {
  data() {
    return {
      apiInfo: '/found/procurements/info',
      apiUserInfo: '/user/mine',
      formData: {},
      customer: {},
      user: {
        vipAuth: 0
      }
    }
  },
  computed: {
   
  },
  components: {
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-icon': Icon,
    Dialog
  },
  created() {
    this.getDetail();
    this.getUserInfo();
  },
  methods: {
    /**
     * 获取列表数据
     */
    getDetail() {
      this.$axios.get(this.apiInfo, {procurementId: this.$route.query.data}).then(res => {
        this.formData = res;
        this.customer = res.customer;
      })
    },
    /**
     * 获取当前登录用户的信息
     */
    getUserInfo() {
      // this.$mUtils.getSessionStorage('accessToken') ?
      this.$axios.get(this.apiUserInfo).then(res => {
        this.user.vipAuth = res.customer.vipAuth;
      }) 
      // : this.user.vipAuth = 0;
    },
    phoneCall() {
     if(!this.user.vipAuth)
      Dialog.confirm({
        title: 'VIP身份',
        message: '只有VIP特权才可以直接电话联系，请认证VIP后方可使用'
      }).then(() => {
        // on confirm
        this.$router.push({name: 'VIP身份', query: {type: 'new', name: 'vip'}})
      }).catch(() => {
        // on cancel
      });
      else window.location.href = 'tel://' + this.customer.custPhone
    }
  }
}
</script>

<style lang="scss" scoped>
.message-row{
  display: flex;
  padding-top: 0.36rem;
  padding-bottom: 0.36rem;
  background: #fff;
  .message-image{
    flex:0 0 1.24rem;
    height: 1.24rem;
    width: 1.24rem;
    border-radius: 0.62rem;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .message-main{
    flex: auto;
    padding-left: 0.2rem;
    .message-title{
      padding-top: 0.1rem;
      padding-bottom: 0.2rem;
      .gray{
        color: #C1C1C1;
        padding-top: 0.04rem;
      }
      img {
        width: 0.32rem;
      }
    }
  }
}
.purchasing-pubilc-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.3rem;
  color: #fff;
  background: #34C975;
  text-align: center;
  font-size: 15px;
}
</style>
