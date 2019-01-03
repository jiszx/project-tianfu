<template>
  <div class="page-mine-index">
    <!-- 用户信息 -->
    <div class="mine-cust">
      <img src="../../assets/images/mine/wd-bj@2x.png" alt="" class="mine-background">
      <div class="mine-info page-content">
        <div class="mine-info-item">
          <div>
            <div class="mine-info-image inline-block">
              <img v-if="customer && customer.custAvatarUrl" :src="customer.custAvatarUrl"  alt="">
              <img v-else src="../../assets/images/mine/wd-tx@2x.png" alt="">
            </div>
            <div class="mine-info-identity inline-block">
              <div class="mine-info-name" style="-webkit-box-orient: vertical;">
                <span v-if="customer.custId">{{customer.custName}}</span>
                <span v-else @click="goLogin">登录 / 注册</span>
                <span v-if="customer && customer.vipAuth && customer.vipAuth === 1" >
                  <img src="../../assets/images/mine/vip@2x.png" alt="">
                </span>
              </div>
              <div v-if="customer.custIdentity" class="mine-cust-identity">
                <span class="fontsize-24 gray">{{customer.custIdentity}}</span>
                <img src="../../assets/images/mine/wd-biaoqian@2x.png" alt="">
              </div>
            </div>
          </div>
          <div v-if="customer" class="mine-cust-btn fontsize-24" @click="userInfo">
            {{customer.custStar}}%用户信息
            <img src="../../assets/images/mine/wd-icon-jr@2x.png" alt="">
          </div>
        </div>
        <!-- 订单状态 -->
        <div class="mine-info-item mine-order">
          <div class="text-center" @click="checkOrder('0')">
            <img src="../../assets/images/mine/wd-dfk@2x.png" alt="">
            <span class="block gray fontsize-24">待付款</span>  
          </div>
          <div class="text-center" @click="checkOrder(1)">
            <img src="../../assets/images/mine/wd-dfk@2x.png" alt="">
            <span class="block gray fontsize-24">待发货</span>  
          </div>
          <div class="text-center" @click="checkOrder(2)">
            <img src="../../assets/images/mine/wd-dsh@2x.png" alt="">
            <span class="block gray fontsize-24">待收货</span>  
          </div>
          <div class="text-center" @click="checkOrder(3)">
            <img src="../../assets/images/mine/wd-dfk1@2x.png" alt="">
            <span class="block gray fontsize-24">已完成</span>  
          </div>
          <div class="text-center" @click="checkOrder(0)">
            <img src="../../assets/images/mine/wd-dfk2@2x.png" alt="">
            <span class="block gray fontsize-24">全部订单</span>  
          </div>
        </div>
      </div>
    </div>
    <!--认证信息-->
    <router-link tag="div" :to="{name:'我的认证'}" class="mine-row page-content">
      <div class="mine-image">
        <img src="../../assets/images/mine/wd-icon-wdrz@2x.png" alt="">
      </div>
      <div class="mine-main van-hairline--bottom">
        <span>我的认证</span>
        <span class="pull-right fontsize-24 text-right">
          <img v-if="customer.realNameAuth === 1" src="../../assets/images/mine/wd-rz-r@2x.png" alt="">
          <img v-if="customer.aptitudeAuth === 1" src="../../assets/images/mine/wd-rz-z@2x.png" alt="">
          <img v-if="customer.enterpriseAuth === 1" src="../../assets/images/mine/wd-rz-q@2x.png" alt="">
          <img v-if="customer.vipAuth === 1" src="../../assets/images/mine/wd-rz-v@2x.png" alt="">
          <img src="../../assets/images/mine/wd-icon-jr2@2x.png" alt="" class="mine-arrow">
        </span>
      </div>
    </router-link>
    <!--我的关注-->
    <router-link tag="div" :to="{name:'我的关注', query: {type: 'focus'}}" class="mine-row page-content">
      <div class="mine-image">
        <img src="../../assets/images/mine/wd-icon-gz@2x.png" alt="">
      </div>
      <div class="mine-main van-hairline--bottom">
        <span>我的关注</span>
        <span class="pull-right fontsize-24 text-right">
          <img src="../../assets/images/mine/wd-icon-jr2@2x.png" alt="" class="mine-arrow">
        </span>
      </div>
    </router-link>
    <!--收货信息-->
    <router-link tag="div" :to="{name:'收货信息'}" class="mine-row page-content">
      <div class="mine-image">
        <img src="../../assets/images/mine/wd-icon-shxx@2x.png" alt="">
      </div>
      <div class="mine-main van-hairline--bottom">
        <span>收货信息</span>
        <span class="pull-right fontsize-24 text-right">
          <img src="../../assets/images/mine/wd-icon-jr2@2x.png" alt="" class="mine-arrow">
        </span>
      </div>
    </router-link>
    <!--联系客服-->
    <div class="mine-row page-content">
      <div class="mine-image">
        <img src="../../assets/images/mine/wd-icon-lxkf@2x.png" alt="">
      </div>
      <div class="mine-main van-hairline--bottom">
        <span>联系客服</span>
        <span class="pull-right fontsize-24 text-right phone-number">
          <span class="gray"><a href="javascript:void(0);" @click="phoneCall('400-189-1288')">{{'400-189-1288'}}</a></span>
          <img src="../../assets/images/mine/wd-icon-jr2@2x.png" alt="" class="mine-arrow">
        </span>
      </div>
    </div>
    <!-- 我的维权 -->
    <router-link tag="div" :to="{name:'我的维权'}" class="mine-row page-content">
      <div class="mine-image">
        <img src="../../assets/images/mine/wd-icon-wdwq@2x.png" alt="">
      </div>
      <div class="mine-main van-hairline--bottom">
        <span>我的维权</span>
        <span class="pull-right fontsize-24 text-right">
          <img src="../../assets/images/mine/wd-icon-jr2@2x.png" alt="" class="mine-arrow">
        </span>
      </div>
    </router-link>
    <!-- 设置 -->
    <router-link tag="div" :to="{name:'设置'}" class="mine-row page-content page-content-setting">
      <div class="mine-image">
        <img src="../../assets/images/mine/wd-icon-sz@2x.png" alt="">
      </div>
      <div class="mine-main van-hairline--bottom">
        <span>设置</span>
        <span class="pull-right fontsize-24 text-right">
          <img src="../../assets/images/mine/wd-icon-jr2@2x.png" alt="" class="mine-arrow">
        </span>
      </div>
    </router-link>
  </div>
</template>

<script>
import { Dialog } from 'vant';
export default {
  data() {
    return {
      apiDetail: '/user/mine',
      customer: {}
    }
  },
  computed: {
   
  },
  components: {
    Dialog
  },
  created() {
    this.getInfo();
  },
  methods: {
    /**
     * 获取列表数据
     */
    getInfo() {
      this.$axios.get(this.apiDetail).then(res => {
        this.customer = res.customer;
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 查看订单
     */
    checkOrder(data) {
      console.log(data)
      this.$router.push({name: '我的订单', query: {orderStatus: data||''}})
    },
    /**
     * 前往登录页
     */
    goLogin() {},
    /**
     *  跳转用户信息 
     */
    userInfo() {
      this.$router.push({name: '用户信息'});
    },
    phoneCall(data) {
      Dialog.confirm({
        title: '客服热线',
        message: '是否拨打客服热线？'
      }).then(() => {
        // on confirm
        window.location.href = 'tel://' + data
      }).catch(() => {
        // on cancel
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.mine-cust {
  background: #f2f6f9;
  position: relative;
  overflow: hidden;
  height: 100%;
  .mine-background {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
  .mine-info {
    position: relative;
    z-index: 2;
    margin: 2.4rem 0.3rem 0.3rem;
    padding: 0.3rem;
    border-radius: 8px;
    background: #fff;
  }
  .mine-info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .mine-info-image {
      width: 1rem;
      height: 1rem;
      border-radius: 0.5rem;
      margin-right: 0.24rem;
      overflow: hidden;
      img {
        height: 100%;
      }
    }
    .mine-info-identity {
      height: 1rem;
      vertical-align: text-bottom;
      .mine-info-name {
        margin-bottom: 0.19rem;
        max-width: 2.2rem;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      .mine-cust-identity {
        width: 1.9rem;
        position: relative;
        span {
          line-height: 0.422rem;
          left: 0.42rem;
          width: 1.41rem;
          text-align: center;
          position: absolute;
          display: inline-block;
        }
      }
      div img {
        width: 1.9rem;
      }
      span {
        margin-right: 5px;
        img {
          width: 0.34rem;
        }
      }
    }
    .mine-cust-btn {
      width: 2.14rem;
      height: 0.68rem;
      border-radius: 0.34rem;
      line-height: 0.68rem;
      // font-size: 0.26rem;
      text-align: center;
      line-height: 0.68rem;
      color: #fff;
      background:linear-gradient(0deg,rgba(255,192,70,1),rgba(252,204,111,1));
      img {
        width: 0.12rem;
        margin-left: 0.06rem;
        margin-bottom: 3px;
      }
    }
  }
  .mine-order {
    margin-top: 0.44rem;
    img {
      width: 0.54rem;
      margin-bottom: 6px;
    }
  }
}
.mine-row{
  display: flex;
  align-items: center;
  height: 1.02rem;
  border: none;
  padding-right: 0;
  background: #fff;
  .mine-image{
    width: 0.44rem;
    height: 0.44rem;
    margin-right: 0.3rem;
  }
  .mine-main {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 0.3rem;
    img {
      width: 0.32rem;
      line-height: 0.4rem;
    }
    .mine-arrow {
      width: 0.16rem;
      margin-left: 0.16rem;
    }
  }
}
.page-content-setting{
  margin-top: 0.2rem;
}
.phone-number {
  display: flex;
  align-items: center;
}
</style>
