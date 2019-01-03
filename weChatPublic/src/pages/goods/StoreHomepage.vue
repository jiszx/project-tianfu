<template>
  <div class="page-store-homepage">
    <div class="business_box van-hairline--top-bottom">
      <div class="info_box">
        <img class="left_img" v-if="goodsDetailData && goodsDetailData.custAvatarUrl" :src="goodsDetailData.custAvatarUrl" alt="">
        <img class="left_img" v-else src="../../assets/images/mine/wd-tx@2x.png" alt="">
        <div class="right_box">
          <div>
            <h5 class="marginB10 paddingR50">{{goodsDetailData.custName}}</h5>
            <div class="icon_box">
              <img v-if="goodsDetailData.realNameAuth" src="../../assets/images/index/sy-icon-ren.png" alt="">
              <img v-if="goodsDetailData.aptitudeAuth"  src="../../assets/images/index/sy-icon-z.png" alt="">
              <img v-if="goodsDetailData.enterpriseAuth"  src="../../assets/images/index/sy-icon-qi.png" alt="">
            </div>
          </div>
          <p class="gray fontsize-26">{{goodsDetailData.areaPath?goodsDetailData.areaPath.replace(/\>/g, ''):''}}</p>
          <p class="bottom_p">{{goodsDetailData.followerNum}}人关注了他 <span @click="focusCompany(goodsDetailData)">{{goodsDetailData.isFollowCustomer?'已关注':'加关注'}}</span></p>
        </div>
      </div>
    </div>
    <van-tabs v-model="active">
      <van-tab title="商品"></van-tab>
      <van-tab title="介绍"></van-tab>
    </van-tabs>
    <!-- 商品列表 -->
    <van-cell-group class="goods-list-section" v-if="active == 0">
      <van-cell>
        <template slot="title">
          <van-list @load="loadGoods"  v-model="loading" :finished="finished">
            <ul class="goods_list">
              <li v-for="(item,index) in goodsList" :key="index" @click="goodsDetail(item)">
                <img :src="item.commoAttachPathUrl" alt="">
                <p class="goods_name">
                  {{item.commoName}}  
                </p>
                <span class="address">{{item.areaPath?item.areaPath.replace(/\>/g, ''):''}}</span>
                <p class="price_p">
                  <span>{{item.commoPrice}}</span>元/{{item.commoUnit}}
                  <span class="num" v-if="salesShow">
                    {{item.commoSales||0}}人购买
                  </span>
                </p>
              </li>     
            </ul>
            <p class="loading_p" v-if="finished">已无更多数据</p>
          </van-list>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 商品介绍 -->
    <div class="goods-details" v-if="active == 1">
      <div class="details-content">
        <!-- <span><img src="../../assets/images/goods/dpzy-js@2x.png" alt=""></span> -->
        <p class="details-text fontsize-28" v-html="goodsDetailData.introduction"></p>
      </div>
    </div>
  </div>
</template>
<script>
import { Tabs, Tab, CellGroup, Cell, List } from 'vant';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      goods_list_api:'/user/custFollows/commoditys',// 9.7. 商铺的商品
      goods_details_api:'/user/custFollows/info', // 9.4. 店铺详情
      focus_cus_url:'/user/custFollows/attention',
      active: 0,
      merchantId:this.$route.query.merchantId,
      goodsList:[],
      currnerPage:1,
      loading:false,
      finished:false,
      goodsDetailData:{}
    }
  },
  computed: {
    ...mapState({
      salesShow: state => state.mine.setting.salesShow, // 显示销量设置
    })
  },
  components: {
   'van-tabs':Tabs,
   'van-tab':Tab,
   'van-cell-group':CellGroup ,
   'van-cell':Cell,
   'van-list':List
  },
  created() {
    this.loadGoodsDetails();
  },
  methods: {
    /* 加载商品列表 */
    loadGoods(){
      this.loading=true;
      this.$axios.get(this.goods_list_api,{page:this.currnerPage,size:10,merchantId:this.merchantId})
        .then(res=>{
          this.currnerPage++;
          this.loading=false;
          res.list.forEach(item=>{
            this.goodsList.push(item);
          })
          if(res.list.length<10){
            this.finished=true;
          }
      })
    },
    /**
     * 查看商品详情
     */
    goodsDetail(data) {
      this.$router.push({name: '商品详情', query: { id: data.commoId }})
    },
    /* 加载商品介绍 */
    loadGoodsDetails(){
      this.$axios.get(this.goods_details_api,{merchantId:this.merchantId})
        .then(res=>{
          this.goodsDetailData = res;
          this.goodsDetailData.introduction = this.goodsDetailData.introduction == '' ? '该商家太懒了' : this.goodsDetailData.introduction
      })
    },
    focusCompany(obj){
      this.$axios.post(this.focus_cus_url,{
        merchantId:obj.custId,
        flag: obj.isFollowCustomer?0:1
      })
      .then(res=>{
        this.$toast.success(obj.isFollowCustomer?'已取消关注':'关注成功');
        obj.isFollowCustomer=!obj.isFollowCustomer;
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .page-store-homepage{
    background: #ffffff;
    height: 100%;
    overflow: auto;
    // 商家头
   .business_box{
     width:100%;
     border-bottom: 1px solid #D4D4D4;
     .info_box{
       width:100%;
       height:100%;
       padding: .3rem; 
       display: flex;
       .left_img{
         flex:0 0 1.28rem;
         width:1.28rem;
         height:1.28rem;
         border-radius: .64rem;
         margin-right: .2rem;
         overflow: hidden;
       }
       .right_box{
         flex:1;
         position: relative;
         padding-left:.10rem;
          h5{
            font-size: .32rem;
            font-weight: normal;
            padding-right: 50px;
          }
          p{
            width:100%;
            font-size: .26rem;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-height: .36rem;
          }
          .bottom_p{
            font-size: .24rem;
            color:RGBA(147, 147, 147, 1);
            margin-top:5px;
            span{
              color:#fff;
              display: block;
              background-color: RGBA(255, 192, 70, 1);
              padding:0 4px;
              border-radius: 3px;
              float:right;
            }
          }
          .icon_box{
            position: absolute;
            right:0;
            top:0;
            img{
              width:16px;
              height:22px;
              float:left;
              margin-right:2px;
            }
          }
       }
     }
   }
    .goods-list-section{
      padding-top: 0.26rem;
      .goods_list{
        width:100%;
        overflow: hidden;
        li{
          width:50%;
          float:left;
          padding-right:.14rem;
          margin-bottom:10px;
          img{
            width:100%;
            height:3.28rem;
          }
          .goods_name{
            line-height: .40rem;
            height:.80rem;
            margin-top:8px;
            font-size: .30rem;
            width:100%;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;         
          }
          .address{
            color:RGBA(147, 147, 147, 1);
            display: block;
            font-size: .24rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width:100%;    
          }
          .price_p{
            color:RGBA(255, 168, 0, 1);
            font-size: .24rem;
            height:30px;
            overflow: hidden;
            span{
              font-size: .40rem;
            }
            .num{
              float:right;
              font-size: .24rem;
              color:RGBA(147, 147, 147, 1);
              font-weight: normal;
              line-height: 30px;
            }
          }
        }
        li:nth-child(2n){
          padding-right:0;
          padding-left:.14rem;
        }
      }
      .loading_p{
        text-align: center;
        margin-top:5px;
        color:RGBA(216, 216, 216, 1);
      } 
    }
    .goods-details{
      padding: 0.3rem;
      .details-content{
        .details-text{
          padding: 0.5rem 0;
          line-height: 24px;
          color: #939393;
        }
      }
    }
  }
</style>
<style lang="scss">
  #app{
    .van-tabs--line {
      padding-top: 50px;
      .van-tabs__wrap {
        height: 50px;
        border-bottom: 1px solid #D4D4D4;
      }
      .van-tabs__nav,.van-tab{
        background-color: #ffffff;
      }
      .van-tab{
        color: #393939;
      }
      .van-tab--active {
        color: #84CFA5;
      }
    }
  }
</style>
