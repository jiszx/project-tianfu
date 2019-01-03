/**
  封装一个采购列表展示组件
*/
<template>
<div class="components-goodlist-row" @click="linkToDetail">
  <div class="goodlist-left">
    <img :src="commoAttachPathUrl" alt="">
  </div>
  <div class="goodlist-right">
    <div class="goodlist-title fontsize-28">
      <p>{{commoName}}</p>
    </div>
    <div class="goodlist-des clearfix">
      <p class="des-unit fontsize-24">
        <span class="inline-block paddingR20e">{{customer.custName}}</span>
        <span class="authentication-img">
          <img v-if="customer.realNameAuth == 1" src="../assets/images/mine/wd-rz-r@2x.png" alt="">
          <img v-if="customer.aptitudeAuth == 1" src="../assets/images/mine/wd-rz-z@2x.png" alt="">
          <img v-if="customer.enterpriseAuth == 1" src="../assets/images/mine/wd-rz-q@2x.png" alt="">
          <img v-if="customer.vipAuth == 1" src="../assets/images/mine/wd-rz-v@2x.png" alt="">
        </span>
      </p>
      <p class="des-common">
        <span class="inline-block paddingR20 fontsize-28 commoPrice">{{commoPrice + '/' + commoUnit}}</span>
        <span class="inline-block paddingR20 fontsize-22 commoSales" v-if="salesShow">{{commoSales}}人购买</span>
        <span class="inline-block cart-img" :class="{active:isActive}" @click.stop="addCar"></span>
      </p>
    </div>
    <!-- <div class="pull-right" @click="linkToDetail">
      <span class="promo-button inline-block">
        <van-button plain type="primary" class="fontsize-26">查看详情</van-button>
      </span>
    </div> -->
  </div>
</div>
</template>

<script>
import { Button } from 'vant';
import { mapState } from 'vuex';
export default {
  props: {
    commoAttachPathUrl: String,
    commoId: [String, Number],
    commoName: String,
    commoPrice: String,
    commoUnit: String,
    commoSales:[String, Number],
    customer: Object
  },
  data () {
    return {
      isActive:false,
    }
  },
  computed: {
    ...mapState({
      salesShow: state => state.mine.setting.salesShow, // 显示销量设置
    })
  },
  components: {
    'van-button': Button
  },
  methods: {
    /**
     * 跳转到采购详情
     */
    linkToDetail () {
      this.$router.push({
        name:'商品详情',
        query: {
          id: this.commoId
        }
      })
    },
    /**
     * 加入购物车
     */
    addCar() {
      this.isActive = true;
      this.$store.dispatch('cartAdd', {
        type:'defaultSelect',
        data:[
          {
            commoId: this.commoId,
            commoNum: 1
          }
        ],
        error: () => {
          this.isActive = false;
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .components-goodlist-row{
    display: flex;
    height: 2.5rem;
    padding: 0.2rem 0.3rem 0.35rem;
    .goodlist-left{
      width: 30%;
      img{
        min-width: 2.04rem;
        min-height: 2.04rem;
      }
    }
    .goodlist-right{
      padding-left: 0.44rem;
      width: 70%;
      .goodlist-title{
        text-overflow: ellipsis;
        color: #313131;
      }
      .goodlist-des{
        .des-common{
          text-overflow: ellipsis;
          color: #C9C9C9;
          .commoPrice{
            color: #FBB42A;
          }
          .commoSales{
            color: #C9C9C9;
          }
          .cart-img{
            width: 0.5rem;
            height: 0.44rem;
            background: url(../assets/images/goods/icon-gwc@2x.png) no-repeat center center;
            background-size: cover;
            float: right;
            &.active{
              background: url(../assets/images/goods/gydt-icon-gwc@2x.png) no-repeat center center;
              background-size: cover;
              float: right;
            }
          }
        }
        .des-unit{
          padding-bottom: 0.2rem;
          color: #C9C9C9;
          .authentication-img{
            padding-left: 0.2rem;
            img{
              max-width: 0.26rem;
              max-height: 0.35rem;
            }
          }
        }
      }
      .promo-button{
        width: 80px;
        .van-button{
          height: 30px;
          line-height: 30px;
          color: #34C975;
          border: 1px solid #34C975;
          padding: 0 13px;
          border-radius: 4px;
        }
      }
    }
  }
</style>
