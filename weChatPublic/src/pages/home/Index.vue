<template>
  <div class="page-index">
    <div class="search-wrapper" ref="searchWrapper">
      <searchBar @search="search" @scan="search" page="index" :placeholder="searchForm.keyword" />
    </div>
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(item,index) in bannerList" :key="index" >
         <div class="slide_box" @click="goBannerDetail(item)">
            <img :src="item.bannerImagePathUrl" alt="">
         </div>
      </van-swipe-item>
    </van-swipe>
    <div class="nav_box">
       <van-row class="top_nav">
         <van-col span="8">
           <div @click="navTopLink">
            <img class="nav_img" src="../../assets/images/index/sy-icon-cyfw.png" alt=""> 
           </div>
         </van-col>
         <van-col span="8">
           <div @click="navTopLink">
            <img class="nav_img" style="margin:0 auto;" src="../../assets/images/index/sy-icon-scffw.png" alt="">
           </div>
         </van-col>
         <van-col span="8">
           <div @click="navTopLink">
            <img class="nav_img " src="../../assets/images/index/sy-icon-jyfw.png" alt=""> 
           </div>          
         </van-col>
       </van-row>
       <van-row class="center_nav">
         <van-col span="6" v-for="(item,index) in navList" :key="index" v-if="item.navAttachPathUrl">
           <div @click="navCenterLink(item)">
             <img class="nav_img"  :src="item.navAttachPathUrl" alt="">
             <p class="nav_p">{{item.navName}}</p>
           </div>
         </van-col>   
         <van-col span="6">
           <div @click="navallLink">
             <img class="nav_img" src="../../assets/images/index/icon-all.png" alt="">
             <p class="nav_p">全部</p>
           </div>
         </van-col>                        
       </van-row>
    </div>
    <!-- 图片导航 -->
    <van-row class="img_nav_box">
      <van-col span="12">
         <img class="left_img"  v-if="picNavs[0]" :src="picNavs[0].navAttachPathUrl" @click="goImgNav(picNavs[0])" alt="">
      </van-col>
      <van-col span="12">
        <img class="right_img" v-if="picNavs[1]" :src="picNavs[1].navAttachPathUrl" @click="goImgNav(picNavs[1])" alt="">
        <img class="right_img" v-if="picNavs[2]"  :src="picNavs[2].navAttachPathUrl" @click="goImgNav(picNavs[2])" alt="">
      </van-col>
    </van-row> 
    <!-- 行业动态 -->
    <van-cell-group class="trade_group">
      <van-cell is-link class="group_title" :to="{name: '行业动态'}"> 
        <template slot="title">
          <img class="tip_icon"  src="../../assets/images/index/icon-dt.png" alt="">
          <span class="text_title">行业动态</span>
        </template>
      </van-cell>
      <van-swipe  :autoplay="3000"   vertical class="vertical_swipe" >
        <van-swipe-item v-for="(item,index) in newsList" :key="index" v-if="index%2==0">
          <van-cell-group>
              <van-cell @click="goNewsDetails(item)">
                <template slot="title">
                  <div class="trade_box">
                    <img :src="item.newsImagePathUrl" alt="">
                    <div class="info_box">
                      <p style="-webkit-box-orient: vertical;">{{item.newsTitle}}</p>
                      <span v-html="item.newsIntro" style="-webkit-box-orient: vertical;"></span>
                    </div>
                  </div>              
                </template>
              </van-cell>
              <van-cell v-if="(index+1)<newsList.length" @click="goNewsDetails(newsList[index+1])">
                <template slot="title">
                  <div class="trade_box">
                    <img :src="newsList[index+1].newsImagePathUrl" alt="">
                    <div class="info_box">
                      <p style="-webkit-box-orient: vertical;">{{newsList[index+1].newsTitle}}</p>
                      <span style="-webkit-box-orient: vertical;">{{newsList[index+1].newsIntro}}</span>
                    </div>
                  </div>              
                </template>
              </van-cell>               
          </van-cell-group> 
        </van-swipe-item>          
        <div class="custom-indicator" slot="indicator">
        </div>        
      </van-swipe>    
    </van-cell-group>

    <!-- 热推商家 -->
    <van-cell-group class="business_group" >
     <van-cell is-link class="group_title" :to="{name: '商家列表'}">
        <template slot="title">
          <img class="tip_icon"  src="../../assets/images/index/sy-resj.png" alt="">
          <span class="text_title">热推商家</span>
        </template>       
     </van-cell>
     <van-cell>
      <van-swipe :width="280" :loop="false">
        <van-swipe-item v-for="(item,index) in merchantsList" :key="index">
          <div class="business_box">
            <div class="info_box" @click="toHomepage(item)">
              <img class="left_img" v-if="item && item.custAvatarUrl" :src="item.custAvatarUrl" alt="">
              <img class="left_img" v-else src="../../assets/images/mine/wd-tx@2x.png" alt="">
              <div class="right_box">
                <h5>{{item.custName}}</h5>
                <p style="color:RGBA(147, 147, 147, 1)">{{item.areaPath.replace(/\>/g, '')}}</p>
                <p class="bottom_p">{{item.followerNum}}人关注了他 <span @click.stop="focusCompany(item)">{{item.isFollowCustomer?'已关注':'加关注'}}</span></p>
                <div class="icon_box">
                    <img v-if="item.realNameAuth" src="../../assets/images/index/sy-icon-ren.png" alt="">
                    <img v-if="item.aptitudeAuth"  src="../../assets/images/index/sy-icon-z.png" alt="">
                    <img v-if="item.enterpriseAuth"  src="../../assets/images/index/sy-icon-qi.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>    
        <div slot="indicator"></div>
      </van-swipe>       
     </van-cell>
    </van-cell-group> 
    <!-- 供求信息 -->
    <van-cell-group class="sell_offer">
     <van-cell is-link class="group_title" :to="{name: '采购大厅'}">
        <template slot="title">
          <img class="tip_icon"  src="../../assets/images/index/sy-gqxx.png" alt="">
          <span class="text_title">供求信息</span>
        </template>       
     </van-cell>
     <van-cell>
       <template slot="title">
         <van-swipe :autoplay="3000" vertical class="vertical_swipe">
           <van-swipe-item v-for="(item,index) in procurements" :key="index" v-if="index%2==0"> 
             <div class="scroll_box">
               <p class="info_box_p">{{item.procurementName}}</p>
               <div class="right_button" @click="goProDetail(item)">详情</div>
             </div>
             <div class="scroll_box" v-if="index+1<procurements.length">
               <p class="info_box_p">{{procurements[index+1].procurementName}}</p>
               <div class="right_button" @click="goProDetail(procurements[index+1])">详情</div>
             </div>
           </van-swipe-item>
           <!-- <van-swipe-item>
             <div class="scroll_box">
               <p class="info_box_p">田夫网处理超大萝卜1000斤,田夫网处理超大萝卜1000斤</p>
               <div class="right_button">详情</div>
             </div>
             <div class="scroll_box">
               <p class="info_box_p">田夫网处理超大萝卜1000斤,田夫网处理超大萝卜1000斤</p>
               <div class="right_button">详情</div>
             </div>
           </van-swipe-item>  --> 
            <div class="custom-indicator" slot="indicator">
            </div>                    
         </van-swipe>
       </template>
     </van-cell>
    </van-cell-group>
    <!-- 热销商品 -->
    <van-cell-group class="hot_goods">
      <van-cell  class="goods_title">
       <template slot="title">
         <p class="header_title">
           <img src="../../assets/images/index/icon-rx.png" alt="">
           热销商品
         </p>
       </template>
      </van-cell>  
      <van-cell>
        <template slot="title">
          <van-list @load="loadGoods"  v-model="loading" :finished="finished">
            <ul class="goods_list">
              <li v-for="(item,index) in goodsList" :key="index" @click="goodsDetail(item)">
                <img :src="item.commoAttachPathUrl" alt="">
                <p class="goods_name" style="-webkit-box-orient: vertical;">
                  {{item.commoName}}  
                </p>
                <span class="address">{{item.areaPath?item.areaPath.replace(/\>/g, ''):''}}</span>
                <p class="price_p">
                  <span>{{item.commoPrice}}</span>元/{{item.commoUnit}}
                  <span class="num" v-if="setting.salesShow == 1">
                    {{item.commoSales}}人购买
                  </span>
                </p>
              </li>
              <!-- <li>
                <img src="../../assets/images/index/sy-rx-t3.png" alt="">
                <p class="goods_name" style="-webkit-box-orient: vertical;">
                  学生定制304不锈钢保温水杯免费送刻字  
                </p>
                <span class="address">成都市新都区</span>
                <p class="price_p">
                  <span>3.00</span>元/斤
                  <span class="num">
                    672人购买
                  </span>
                </p>
              </li>         -->   
            </ul>
            <p class="loading_p" v-if="finished">已无更多数据</p>
          </van-list>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { Swipe, SwipeItem , Row, Col ,Cell, CellGroup,List } from 'vant';
import { setTimeout } from 'timers';
import { mapState } from 'vuex';
import searchBar from 'components/search-bar'
export default {
  data() {
    return {
      index_info_url:'/operation/home',
      goods_list_url:'/operation/commodities',
      focus_cus_url:'/user/custFollows/attention',
      searchForm: {
        keyword:'',
        areaCode: ''
      },
      bannerList:[],
      navList:[],
      picNavs:[],
      newsList:[],
      merchantsList:[],
      procurements:[],
      goodsList:[],
      currnerPage:1,
      loading:false,
      finished:false
    }
  },
  computed: {
    ...mapState({
      setting: state => state.mine.setting, // 显示销量设置,APP销量展示(0：关闭，1：开启)
    })
  },
  components: {
   'van-swipe':Swipe,
   'van-swipe-item':SwipeItem,
   'van-row':Row,
   'van-col':Col,
   'van-cell-group':CellGroup ,
   'van-cell':Cell,
   'van-list':List,
    searchBar,
  },
  created() {
    this.getBannerList();
    this.$store.dispatch('settingGetInfo');// 获取基础设置信息
  },
  watch:{
    loading(val){
      if(val){
        // console.log(val);
      }
    }
  },
  methods: {
    /**
     * 获取列表数据
     */
    getBannerList(){
      this.$axios.get(this.index_info_url,{bannerType:0})
      .then(res=>{
        this.bannerList=res.banners;
        this.navList=res.commoTyNavs;
        this.picNavs=res.picNavs;
        this.newsList=res.news;
        this.merchantsList=res.merchants;
        this.procurements=res.procurements;
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
    /* 加载列表 热推商品 */
    loadGoods(){
      this.loading=true;
      this.$axios.get(this.goods_list_url,{page:this.currnerPage,size:10, ...this.searchForm})
      .then(res=>{
        if(this.currnerPage == 1) {
          this.goodsList = res.list;
        } else {
          res.list.forEach(item=>{
            this.goodsList.push(item);
          })
          if(res.list.length<10){
            this.finished=true;
          }
        }
        this.currnerPage++;
        this.loading=false;
      })
    },
    /**
     * 查看固定3个板块分类
     */
    navTopLink() {
      this.$router.push({name: '商品分类'})
    },
    /**
     * 查看推荐分类
     */
    navCenterLink(data) {
      this.$router.push({name: '供应大厅', query: {
        commoTyPathSelect: data.commoTyPath
      }})
    },
    /**
     * 全部跳选择分类
     */
    navallLink(data) {
      this.$router.push({name: '商品分类'})
    },
    /**
     * 查看商品详情
     */
    goodsDetail(data) {
      this.$router.push({name: '商品详情', query: { id: data.commoId }})
    },
    /**
     * 查看供求信息
     */
    goProDetail(data) {
      this.$router.push({ name:'采购详情',
        query: {
          data: data.procurementId
        }
      })
    },
    /**
     * 查看动态详情信息
     */
    goNewsDetails(data) {
      this.$router.push({ name: '动态详情', query: { tranning: data.newsId, type: 'news' }})
    },
    /**
     * 查看banner详情信息
     */
    goBannerDetail(data) {
      this.$router.push({ name: '广告详情', query: { tranning: data.bannerId, type: 'ad' }})
    },
    /**
     * 跳转店铺首页
     */
    toHomepage(data) {
      this.$router.push({name:'店铺主页',query:{merchantId:data.custId}})
    },
    /**
     * 查看三个图片详情列表
     */
    goImgNav(data) {
      this.$router.push({path: data.navLink})
    },
    /**
     * 搜索
     */
    search(data) {
      this.currnerPage = 1;
      this.searchForm.keyword = data.searchText;
      this.searchForm.areaCode = data.areaCode;
      this.loadGoods()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-index{
  padding-top: 1rem;
  .search-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background: #fff;
  }
 .slide_box{
   height:2.4rem;
   width:100%;
   img{
     width:100%;
     height:100%;
   }
 }
 .nav_box{
   width:100%;
   background-color: #fff;
  //  padding: 0 .20rem 0 .20rem ;
   overflow: hidden;
   margin-bottom:10px;
   .top_nav{
     margin-bottom:.2rem;
     padding: .3rem .2rem .2rem;
     background-color: #f2f6f9;
     .nav_img{
       width:1.82rem;
       height:1.80rem;
       margin: 0 auto;
       display: block;
     }
   }
   .center_nav{
     /* margin-bottom:.36rem; */
     padding: 0 .2rem;
     .nav_img{
       width:1rem;
       height:1rem;
       border-radius: .5rem;
       overflow: hidden;
       margin: 0 auto;
       display: block;       
     }
     .nav_p{
       text-align: center;
       margin-top:.10rem;
       overflow: hidden;
       text-overflow: ellipsis;
       white-space: nowrap;
       color:RGBA(57, 57, 57, 1);
     }
   }
 }
 .img_nav_box{
   width:100%;
   background-color: #fff;
   margin-bottom:10px;
   .left_img{
     width:100%;
     height:3.44rem;
   }
   .right_img{
     width:100%;
     height:1.72rem;
   }
 }
 .group_title{
   .tip_icon{
     width:.32rem;
     height:.28rem;
   }
   .text_title{
     color:RGBA(147, 147, 147, 1);
     margin-left:.10rem;
   }
 } 
 .trade_group{
   margin-bottom:10px;
   .vertical_swipe{
     height:calc(2.8rem + 40px);
        .van-hairline--top-bottom::after{
          border-width:0;
        }
   }
   .trade_box{
     display: flex;
     width:100%;
      img{
        flex:0 0 1.4rem;
        width:1.4rem;
        height:1.4rem;
      }
      .info_box{
        flex:1;
        padding-left:.40rem;
        box-sizing: border-box;
        p{
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          margin-bottom:.10rem;
        }
        span{
          color:RGBA(147, 147, 147, 1);
          line-height: .38rem;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;          
        }
      }
   }
 }
 .business_group{
   margin-bottom:10px;
   .business_box{
     height:2.1rem;
     width:100%;
     padding:.10rem;
     padding-right:.40rem;
     .info_box{
       width:100%;
       height:100%;
       background-color: RGBA(250, 254, 245, 1);
       border-radius: 5px;
       box-shadow: 1px 1px 6px 0 rgba(0,0,0,.1);
       padding: .22rem 11px .30rem 11px; 
       display: flex;
       .left_img{
         flex:0 0 1.28rem;
         width:1.28rem;
         height:1.28rem;
         border-radius: .64rem;
       }
       .right_box{
         flex:1;
         position: relative;
         padding-left:.10rem;
          h5{
            font-size: 16px;
            font-weight: normal;
            width: 1.9rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          p{
            width:100%;
            font-size: .28rem;
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
            position: relative;
            span{
              color:#fff;
              display: block;
              background-color: RGBA(255, 192, 70, 1);
              padding:0 4px;
              border-radius: 3px;
              /* float:right; */
              position: absolute;
              top: 0;
              right: 0;
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
 }
 .sell_offer{
   margin-bottom:10px;
   .vertical_swipe{
     height:calc(1.06rem + 15px);
   }
   .scroll_box{
     display: flex;
     width:100%;
     margin-top:6px;
     .info_box_p{
       flex:1;
        font-size: .28rem;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right:.2rem;    
     }
     .right_button{
       flex: 0 0 50px;
        text-align: center;
        height:22px;
        line-height: 20px;
        border:1px solid RGBA(255, 192, 70, 1);
        border-radius: 4px;
        color:RGBA(255, 192, 70, 1);
     }
   }
 }
 .hot_goods{
   .goods_title{
     .header_title{
       text-align: center;
       img{
         width:.32rem;
         height:.36rem;
         display: inline-block;
       }
     }
   }
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
         margin-top: 8px;
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
}
</style>
<style lang="scss">
  .page-index{
    .nav_box{
      .center_nav{
        .van-col{
          padding-bottom: 0.4rem;
        }
      }
    }
  }
</style>
