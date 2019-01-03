<template>
<div class="page-goods-detail">
  <div class="product-swipe-wrapper">
    <div class="product-swipe-wrapper-inner">
      <!--轮播-->
      <div class="swiper-box">
        <!-- <div class="swiper-box-inner">
          <img :src="goodsData.commoAttachPathUrl" />
        </div> -->
        <van-swipe :autoplay="3000" :show-indicators="false" @change="swiperChange">
          <van-swipe-item v-for="(item, index) in swiperData" :key="index">
            <div class="swiper-box-inner">
              <img :src="item" />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <span class="swiper-index paddingL30 paddingR30 bg-gray white fontsize-24" v-if="swiperData.length>1">
        {{currentSwiperIndex}}/{{swiperData.length}}
      </span>
    </div>
  </div>
  <!--商品信息-->
  <div class="goods-info-wrapper goods-item">
    <div class="goods-info">
      <div class="goods-title fontsize-36">
        <p>{{goodsData.commoName}}</p>
      </div>
      <span class="gray fontsize-24" v-if="salesShow">{{goodsData.commoSales}}人购买</span>
      <div class="goods-des">
        <p class="inline-block warning marginT20">{{goodsData.commoPrice}} <span class="fontsize-28">元/{{goodsData.commoUnit}}</span></p>
        <p class="gray fontsize-24">采收日期：{{$mUtils.formatDate(goodsData.harvestDate, 'yyyy-MM-dd')}}</p>
        <div class="goods-trace" v-if="goodsData.canTrace" @click="goTrace(goodsData)">
          <img v-if="goodsData.greenTrace" src="../../assets/images/goods/spxq-zsxx.png" alt="">
          <img v-else src="../../assets/images/goods/spxq-zsxx-2.png" alt="">
        </div>
      </div>
    </div>
  </div>
  <!-- 商家信息 -->
  <div class="marginT20">
    <ShopRow :company="company" @changeFocus="changeFocus"/>
  </div>
  <!-- 评价 -->
  <div class="goods-comments marginT20">
    <div class="goods-comments-title" @click="goComments">
      <span class="title marginR10">评价</span>
      <span class="gray marginR10">好评({{commentNum.goodCommentNum}})</span>
      <span class="gray marginR10">中评({{commentNum.mediumCommentNum}})</span>
      <span class="gray marginR10">差评({{commentNum.badCommentNum}})</span>
      <div class="right_box gray fontsize-24">
        查看全部评论
        <van-icon name="arrow" ></van-icon>
      </div>
    </div>
    <div v-for="(item, index) in comments" :key="index">
      <commentsRow 
        :customer="item.customer"
        :commentType="item.commentType"
        :commentDetails="item.commentDetails"
        :attachPath1Url="item.attachPath1Url||''"
        :attachPath2Url="item.attachPath2Url||''"
        :attachPath3Url="item.attachPath3Url||''"
        :commoNum="item.commoNum" />
    </div>
  </div>
  <!--商品图片详情图-->
  <div class="goods-des-image-list marginT20">
    <div class="goods-des-text page-content fontsize-30 text-indent paddingT30 paddingB30" v-html="goodsData.commoDetails">
      <!-- {{goodsData.commoDetails}} -->
    </div>
    <!-- <img v-for="(item,index) in goodsData.commoAttachPaths" :src="item" alt="" :key="index" > -->
  </div>
  <!--立即购买与加入购物车弹窗-->
  <div class="buy-now-btn-wrapper">
    <van-goods-action>
      <van-goods-action-mini-btn icon="cart" text="购物车" :info="cartTotalNum" @click="onClickGoodsCartBtn" v-if="cartTotalNum" />
      <van-goods-action-mini-btn icon="cart" text="购物车" @click="onClickGoodsCartBtn" v-else />
      <van-goods-action-big-btn class="goods-add-cart" text="加入购物车" @click="onClickAddCartBtn" />
      <van-goods-action-big-btn class="goods-buy-now" text="立即购买" @click="onClickBuyBtn" primary />
    </van-goods-action>
  </div>
  <!-- 商品Sku-->
  <!-- <van-popup v-model="gooodsSkuShow" position="bottom"> -->
    <!--内容-->
  <!-- </van-popup> -->
  <gooodsSku
    v-model="gooodsSkuShow"
    :goodsData="goodsData"
    :showBuyBtn="showBuyBtn"
    :showAddCart="showAddCart"
    @buy-clicked="buyNow"
    @add-cart="addCart"
  />
</div>
</template>

<script>
import {
  Swipe,
  SwipeItem,
  GoodsAction,
  GoodsActionBigBtn,
  GoodsActionMiniBtn,
  Popup,
  Icon 
} from 'vant';
import commentsRow from 'components/comments-row'
import gooodsSku from 'components/goods-sku'
import ShopRow from '@/components/shop-row'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      api_get_goods:'/commodity/commodities/info',
      searchForm:{
        commoId:''
      },
      gooodsSkuShow:false,
      currentSwiperIndex:1,
      swiperData: [],
      goodsData: {
        id:'',
        standard:{},
        detailUrls:[],
        stock:600,
        salesPromotions: [],//商品促销信息
        commoProperties: []
      },
      company: {},
      commentNum: {},
      comments: [],
      showBuyBtn:true,
      showAddCart:false
    }
  },
  computed: {
    ...mapState({
      cartTotalNum: state => state.cart.totalNum,
      // baseSubmitingObj: state => state.order.baseSubmitingObj
      salesShow: state => state.mine.setting.salesShow, // 显示销量设置
    })
  },
  components: {
    gooodsSku,
    'van-popup': Popup,
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'van-goods-action': GoodsAction,
    'van-goods-action-mini-btn': GoodsActionMiniBtn,
    'van-goods-action-big-btn': GoodsActionBigBtn,
    'van-icon': Icon,
    commentsRow,
    ShopRow
  },
  created() {
    console.log(this.cartTotalNum)
    this.searchForm.commoId = this.$route.query.id;
    this.getData()
    this.$store.dispatch('cartGetList')
  },
  watch:{
  },
  methods: {
    /**
     * 获取轮播数据
     */
    getData() {
      this.$axios.get(this.api_get_goods, this.searchForm)
        .then(res => {
          this.swiperData = res.commoAttachPaths;
          this.goodsData = res;
          this.company = res.merchant;
          this.commentNum = res.commentNum;
          this.comments = res.comments;
        })
    },
    /**
     * 取消/加关注
     */
    changeFocus(data) {
      if(data == true) {
        this.getData();
      }
    },
    /**
     * 轮播事件
     * @param index
     */
    swiperChange (index) {
      this.currentSwiperIndex = index + 1;
    },
    /**
     * 查看追溯信息
     */
    goTrace(goods) {
      this.$router.push({name: '商品追溯信息', query: {commoId: goods.commoId}});
    },
    /**
     * 查看商品评价
     */
    goComments() {
      this.$router.push({name: '评价', query: {commoId: this.goodsData.commoId}});
    },
    /**
     * 点击购物车按钮
     */
    onClickGoodsCartBtn () {
      this.$router.push({name: '购物车'})
    },
    onClickAddCartBtn () {
      this.showAddCart = true;
      this.showBuyBtn = false;
      this.gooodsSkuShow = !this.gooodsSkuShow;
    },
    onClickBuyBtn () {
      this.showAddCart = false;
      this.showBuyBtn = true;
      this.gooodsSkuShow = !this.gooodsSkuShow;
    },
    buyNow(data) {
      let uuid = 'submit-order-' + (+new Date())
      // let orderObj = {
      //   ...this.baseSubmitingObj
      // }
      let goods = {
        commoId: data.goodsData.commoId,
        commoName: data.goodsData.commoName,
        commoAttachPathUrl: data.goodsData.commoAttachPathUrl,
        commoNum: data.selectedNum,
        commoPrice: data.goodsData.commoPrice,
        commoStatus: data.goodsData.commoStatus,
        commoUnit: data.goodsData.commoUnit
      };
      let orderObj = {
        uuid:uuid,
        goodsData: [goods],//商品数据
        address:{}, //用户地址
        // jifen: 0, //积分
        // coupon:{}, //优惠券
        // activity:{}, //活动
        shop: this.company, //商家
        promoList:[],
      }
      console.log(orderObj)
      this.$store.commit('addSubmitingOrder', orderObj);
      this.$router.push({
        name:'待提交订单',
        query:{
          uuid:uuid
        }
      })
    },
    addCart(data) {
      console.log(data)
      this.$store.dispatch('cartAdd', {
        type: 'defaultSelect',
        data:[{
          commoId: data.goodsData.commoId,
          addOrSubtract: '+'+data.selectedNum,
          // commoPropertyValId:data.typeGoodsInfo.commoPropertyValId
        }]
      });
      this.gooodsSkuShow = !this.gooodsSkuShow;
    }
  }
}
</script>

<style lang="scss" scoped>
.page-goods-detail{
  padding-bottom: 60px;
}
.goods-item {
  background: #fff;
  padding: 0.3rem 0.3rem 0;
  position: relative;
  .goods-trace {
    position: absolute;
    right: 0.3rem;
    top: 1.16rem;
  }
}
// 商品信息
.goods-info-wrapper{
  // padding: 0.3rem $page-side-padding;
  .goods-title{
    overflow: hidden;
    text-overflow: ellipsis;
    padding-bottom: 0.1rem;
  }
  .goods-des{
    padding:0.2rem 0;
    line-height: 0.44rem;
  }
  .promotion-name{
    line-height: 1;
    padding: 0.08rem 0.16rem 0.08rem;
    &::after{
      // border-color: $red;
      border-radius: 0.1rem;
    }
  }
}
// 轮播 \ 商品主图
.product-swipe-wrapper{
  box-sizing: border-box;
  width: 100%;
  position: relative;
}
.product-swipe-wrapper-inner{
  position: relative;
}
.swiper-box-inner{
  position: relative;
  width: 100%;
  padding-top: 100%;
}
.swiper-box-inner img{
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
}
.swiper-index{
  background: #ccc;
  padding-top: 0.06rem;
  padding-bottom: 0.06rem;
  border-radius: 0.2rem;
  position: absolute;
  right: 0.2rem;
  bottom: 0.4rem;
}

// 评价
.goods-comments {
  padding: .3rem .3rem 0;
  background: #fff;
  .goods-comments-title {
    padding-bottom: .3rem;
    &:not(:last-child) {
      border-bottom: 1px solid #D4D4D4;
      padding-bottom: .2rem;
    }
    .title {
      font-size: 15px;
    }
    .right_box {
      line-height: 18px;
      float: right;
    }
  }
}
// 详情
.goods-des-image-list{
  background: #fff;
  .img{
    display: block;
  }
}
  .warning {
    color: #FBA500;
    font-size: 0.40rem;
  }
  .goods-des-text{
    color: #333;
  }
  .goods-add-cart {
    background: #34C975;
    font-size: 15px;
    border: none;
  }
  .goods-buy-now {
    background: #FFC046;
    font-size: 15px;
    border: none;
  }
</style>
<style>
  .van-goods-action-mini-btn{
    min-width: 24%;
  }
  .van-button--bottom-action{
    background: #FF9500;
  }
  /* .van-button--bottom-action.van-button--primary{
    background-color: #FF2D55;
  }
  .promotion-name .van-hairline--surround::after{
    border-color: #ff314f;
  } */
</style>
