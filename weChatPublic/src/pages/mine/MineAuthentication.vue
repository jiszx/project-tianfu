<template>
  <div class="page-authentication-index">
    <!-- :to="{name: item.title, query:{name: key, type: item.auditStatus == 0?'new':'info'}}"  -->
    <div class="auth-row page-content" v-for="(item, key, index) in authData" :key="index">
      <div class="auth-image">
        <img :src="item.image" alt="">
      </div>
      <div class="auth-main">
        <p>{{item.title}}</p>
        <span class="gray fontsize-24">{{item.descrip}}</span>
      </div>
      <div class="auth-btn" @click="goSeeDetail(item, key)">
        <img v-if="item.auditStatus === 1" src="../../assets/images/mineRz/wdrz-yrz@2x.png" alt="">
        <img v-if="item.auditStatus === 2" src="../../assets/images/mineRz/wdrz-dsh@2x.png" alt="">
        <span v-if="item.auditStatus === 0">立即认证</span>
      </div>
    </div>
    <div class="text-center">
      <p class="white marginB10">认证通过后可通过商家后台发布供应信息</p>
      <p class="white marginB10">登录地址：https://s.tianfu.com/login</p>
    </div>
  </div>
</template>

<script>
import name from '../../assets/images/mineRz/wdrz-tp1@2x.png'
import company from '../../assets/images/mineRz/wdrz-tp2@2x.png'
import aptitude from '../../assets/images/mineRz/wdrz-zzrz@2x.png'
import vip from '../../assets/images/mineRz/wdrz-vip@2x.png'
export default {
  data() {
    return {
      apiInfo: '/user/mine',
      // auditStatus 审核状态(0：未通过，1：已通过，2：待审核)
      authData: {
        name: {
          image: name,
          title: '实名认证',
          descrip: '人像信息审核',
          auditStatus: 2,
        },
        company: {
          image: company,
          title: '企业认证',
          descrip: '企业资质审核',
          auditStatus: 1,
        },
        aptitude: {
          image: aptitude,
          title: '资质认证',
          descrip: '其它资质审核',
          auditStatus: 0,
        },
        vip: {
          image: vip,
          title: 'VIP身份',
          descrip: '可直接联系拨号',
          auditStatus: 1,
        }
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getInfo() {
      this.$axios.get(this.apiInfo).then(res => {
        this.authData.name.auditStatus = res.customer.realNameAuth;
        this.authData.company.auditStatus = res.customer.enterpriseAuth;
        this.authData.aptitude.auditStatus = res.customer.aptitudeAuth;
        this.authData.vip.auditStatus = res.customer.vipAuth;
      })
    },
    goSeeDetail(item, key) {
      if(this.authData.name.auditStatus !== 1 && key !== 'vip' && key !== 'name') {
        this.$toast('请先进行实名认证！');
        return
      }
      this.$router.push({name: item.title, query:{name: key, type: item.auditStatus == 0?'new':'info'}})
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-authentication-index {
    padding: 0.6rem 0 0.3rem;
    background: linear-gradient(to bottom left,#63e59c,#34c975);
    // height: 100%;
    .auth-row {
      background: #fff;
      margin: 0.3rem;
      padding: 0.54rem 0.3rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      img {
        width: 1.24rem;
      }
      .auth-image {
        // flex-grow: 1;
        margin-right: 0.3rem;
      }
      .auth-main {
        flex-grow: 4;
        font-size: 17px;
      }
      .auth-btn {
        flex-grow: 1;
        span {
          display: inline-block;
          width: 1.9rem;
          height: 0.64rem;
          line-height: 0.6rem;
          border-radius: 0.32rem;
          color: #34c975;
          border: 1px solid #34c975;
          text-align: center;
        }
      }
    }
  }
</style>
