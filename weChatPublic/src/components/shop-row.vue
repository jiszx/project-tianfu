<template>
  <div class="goods-shop">
    <div class="business_box" @click="toHomepage(company)">
      <div class="info_box">
        <div class="left_img">
          <img v-if="company && company.custAvatarUrl" :src="company.custAvatarUrl" alt="">
          <img v-else src="../assets/images/mine/wd-tx@2x.png" alt="">
        </div>
        <div class="right_box">
          <h5>
            {{company.custName}}
            <span class="icon_box">
              <img v-if="company.realNameAuth" src="../assets/images/index/sy-icon-ren.png" alt="">
              <img v-if="company.aptitudeAuth"  src="../assets/images/index/sy-icon-z.png" alt="">
              <img v-if="company.enterpriseAuth"  src="../assets/images/index/sy-icon-qi.png" alt="">
            </span>
          </h5>
          <p style="color:RGBA(147, 147, 147, 1)">{{company.areaPath?company.areaPath.replace(/\>/g, ''):''}}</p>
          <p class="bottom_p">{{company.followerNum}}人关注了他 <span v-if="!type" @click.stop="focusCompany(company)">{{company.isFollowCustomer?'已关注':'加关注'}}</span></p> 
        </div>
      </div>
      <div class="goods-shop-arrow gray">
        <van-icon name="arrow" ></van-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
export default {
  props: {
    company: Object,
    type: String
  },
  data() {
    return {
      focus_cus_url:'/user/custFollows/attention',
    }
  },
  components: {
    'van-icon': Icon
  },
  methods: {
    /**
     * 关注商家
     */
    focusCompany(obj){
      this.$axios.post(this.focus_cus_url,{
        merchantId:obj.custId,
        flag: obj.isFollowCustomer?0:1
      })
      .then(res=>{
        this.$toast.success(obj.isFollowCustomer?'已取消关注':'关注成功');
        this.$emit('changeFocus', true);
      })
    },
    /**
     * 跳转店铺首页
     */
    toHomepage(data) {
      this.$router.push({name:'店铺主页',query:{merchantId:data.custId}})
    },
  }
}
</script>

<style lang="scss" scoped>
// 商家信息
.goods-shop {
  width:100%;
  padding: 0.3rem;
  position: relative;
  background: #fff;
  .info_box{
    width:100%;
    height:100%;
    display: flex;
    .left_img{
      flex:0 0 1.28rem;
      height: 1.28rem;
      border-radius: .64rem;
      overflow: hidden;
      img {
        height: 100%;
      }
    }
    .right_box{
      flex:1;
      position: relative;
      padding-left:.24rem;
      h5{
        margin-bottom: 0.04rem;
        font-size: .32rem;
        font-weight: normal;
      }
      p{
        width:100%;
        font-size: .26rem;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        line-height: .34rem;
        // padding-left: 0.08rem;
      }
      .bottom_p{
        font-size: .24rem;
        color:RGBA(147, 147, 147, 1);
        margin-top:5px;
        span{
          color:#fff;
          background-color: RGBA(255, 192, 70, 1);
          padding:0 4px 1px;
          border-radius: 3px;
          margin-left: .3rem;
        }
      }
      .icon_box{
        margin-left: 10px;
        img{
          width:16px;
          height:22px;
        }
      }
    }
  }
  .goods-shop-arrow {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0.3rem;
    height: 14px;
    margin: auto;
  }
}
</style>
