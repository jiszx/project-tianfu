<template>
  <div class="page-orderList">
    <van-tabs v-model="active" color="rgba(52, 201, 117, 1)" @change="changeTab">
      <van-tab v-for="(item, index) in status" :title="item.label" :key="index"></van-tab>
    </van-tabs>
    <!-- 列表 -->
    <ul class="order_list" v-if="orderData.length">
      <li v-for="(item, index) in orderData" :key="index">
        <p class="header_p">
          <img src="../../assets/images/order/wddd-dp.png" alt="">
          {{item.merchantName}}
          <!-- 0：待付款，1：待发货，2：已发货，3：已完成，4：已取消 -->
          <span v-if="item.orderStatus==0" class="error">等待付款</span>
          <span v-if="item.orderStatus==1" class="warning">等待发货</span>
          <span v-if="item.orderStatus==2" class="warning">等待收货</span>
          <span v-if="item.orderStatus==3" class="warning">交易完成</span>
          <span v-if="item.orderStatus==4">交易取消</span>
        </p>
        <div @click="getDetail(item)">
          <div class="good_info" v-for="(goods, i) in item.orderItems" :key="i">
            <img :src="goods.commoAttachPathUrl" alt="">
            <!-- +' '+goods.commoNum+goods.commoUnit+' '+goods.lineUnitPrice+'元/'+goods.commoUnit -->
            <p>{{goods.commoName}}</p>
            <p class="price_p">
              {{goods.lineUnitPrice}}<i style="font-size:.26rem;font-style:normal;">￥/{{goods.commoUnit}}</i> 
              <span >{{goods.commoNum+goods.commoUnit}}</span>
            </p>
          </div>
          <p class="order_info">
            订单号{{item.orderNumber}}
            <span class="pull-right">
              {{$mUtils.formatDate(item.createdDate)||'2018-10-06 15:03:52'}}
            </span>
          </p>
        </div>
        <div class="button_box">
          <span class="price"><i>￥</i>{{item.orderAmount}}</span>
          <span v-if="item.orderStatus==0" class="button warning pay" @click="goToPay(item)">去支付</span>
          <span v-if="item.orderStatus==0" class="button " @click="cancelOrder(item)">取消</span>
          <span v-if="item.orderStatus==2" class="button warning" @click="resiveGoods(item)">确认收货</span>
          <span v-if="item.orderStatus==1 || item.orderStatus==4 || (item.orderStatus==3 && item.commentStatus==1)" class="button success" @click="buyAgain(item)">再次购买</span>
          <!-- commentStatus 订单评论状态(0：未评论，1：已评论) -->
          <span v-if="item.orderStatus==3 && item.commentStatus==0" class="button warning" @click="evaluate(item)">评价</span>
          <span v-if="item.orderStatus==4" class="button" @click="deleteOrder(item)">删除订单</span>
        </div>       
      </li>    
      <!--加载更多-->
      <div class="loading-more-box">
        <p class="loading-more" v-if="!hasMore">没有更多</p>
        <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
      </div>
    </ul>
    <!-- 无订单 -->
    <div class="no_order" v-else>
      <img src="../../assets/images/order/wddd-kong.png" alt="">
      <span class="no_tips">您还没有相关的订单哟</span>
      <span class="button" @click="goShopGoods">随便逛逛</span>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs ,Button,Dialog } from 'vant';
import LoadingMore from '@/components/base/loading-more'
export default {
  data() {
    return {
      apiList: '/user/mine/myOrders',
      apiCancel: '/user/mine/cancelOrder',
      apiDelete: '/user/mine/deleteOrder',
      apiReseive: '/user/mine/affirmCargo',
      active: 0, // 订单状态(0：待付款，1：待发货，2：已发货，3：已完成，4：已取消)
      status: [
        { id: '', label: '全部' },
        { id: 0, label: '待付款' },
        { id: 1, label: '待发货' },
        { id: 2, label: '待收货' },
        { id: 4, label: '已取消' }
      ],
      searchForm: {
        page: 1,
        size: 3,
        orderStatus: ''
      },
      hasMore:false,
      loading:false,
      orderData: []
    }
  },
  computed: {
   
  },
  components: {
    'van-tab':Tab,
    'van-tabs':Tabs,
    'van-button':Button,
    LoadingMore
  },
  created() {
    if(this.$route.query.orderStatus) {
      this.searchForm.orderStatus = this.$route.query.orderStatus;
      this.status.map((item, index) => {
        this.searchForm.orderStatus == item.id? this.active = index : false;
      })
    } else this.searchForm.orderStatus = '';
    this.getList()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getList(isMore){
      this.loading = true;
      this.$axios.get(this.apiList, this.searchForm).then(res => {
        if (isMore && isMore == 'more') {
          this.orderData = [...this.orderData, ...res.list];
        } else {
          this.orderData = res.list
        }
        this.hasMore = res.total > this.searchForm.page * this.searchForm.size;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    /**
     * 切换标签
     */
    changeTab(index, title) {
      this.searchForm.orderStatus = this.status[this.active].id;
      this.getList()
    },
    /**
     * 取消订单
     */
    cancelOrder(item){
      Dialog.confirm({
        title: '提示',
        message: '确定取消该订单吗？'
      }).then(() => {
        this.$axios.post(this.apiCancel, {orderId: item.orderId}).then(res => {
          this.$toast('已取消该订单');
          // this.getList()
          item.orderStatus = 4;
        })
      }).catch(() => {
        // on cancel
      });
    },
    /**
     * 删除订单
     */
    deleteOrder(item){
      Dialog.confirm({
        title: '提示',
        message: '确定删除该订单吗？'
      }).then(() => {
        this.$axios.post(this.apiDelete, {orderId: item.orderId}).then(res => {
          this.$toast('已删除该订单');
          this.orderData.splice(this.orderData.findIndex(order => {
            return order.orderId === item.orderId
          }),1)
        })
      }).catch(() => {
        // on cancel
      });
    },
    /**
     * 评价
     */
    evaluate(item) {
      this.$router.push({name:'发表评价',params:{order:item}})
    },
    /**
     * 确认收货
     */
    resiveGoods(item) {
      Dialog.confirm({
        title: '提示',
        message: '是否确认收货？'
      }).then(() => {
        this.$axios.post(this.apiReseive, {orderId: item.orderId}).then(res => {
          this.$toast.success('收货成功！');
          // this.getList()
          item.orderStatus = 3;
        })
      }).catch(() => {
        // on cancel
      });
    },
    /**
     * 去支付
     */
    goToPay(item) {
      this.$router.push({
        name:'在线支付',
        query:{orderId: item.orderId}
      })
    },
    /**
     * 再次购买
     */
    buyAgain(item) {
      this.$store.dispatch('cartAddAgain', {orderId: item.orderId})
    },
    /**
     * 查看订单详情
     */
    getDetail(item) {
      this.$router.push({name: '订单详情', query: { orderData: item.orderId }})
    },
    /**
     * 加载更多方法
     */
    loadingMore () {
      this.searchForm.page++;
      this.getList('more');
    },
    /**
     * 随便逛逛
     */
    goShopGoods() {
      this.$router.push({name: '供应大厅'})
    }
  }
}
</script>

<style lang="scss" scoped>
.page-orderList{
  .no_order{
    text-align: center;
    margin-top:20%;
    img{
      width:2.74rem;
      height:2.64rem;
      transform: translateX(.3rem)
    }
    .no_tips{
      margin-top:0.44rem;
      display: inline-block;
      color:RGBA(147, 147, 147, 1);
      width:100%;
    }
    .button{
         display: inline-block;
         text-align: center;
         box-sizing: border-box;
         width:2.04rem;
         line-height: .76rem;
         color:RGBA(52, 201, 117, 1);
         border:1px solid RGBA(52, 201, 117, 1);
         margin-top:1rem;
         border-radius: .40rem;      
    }
  }
 .order_list{
   margin-top:10px;
   li{
     margin-bottom:10px;
     background-color: #fff;
     padding:0 0 0 .32rem;
     box-sizing: border-box;
     .header_p{
       color:rgba(49, 49, 49, 1);
       overflow: hidden;
       line-height: .36rem;
       padding:.24rem .32rem .24rem 0;
       box-sizing: border-box;
       border-bottom:1px solid #fafafa;
       img{
         width:.38rem;
         height:.36rem;
       }
       span{
         float:right;
         color:rgba(147, 147, 147, 1);
       }
       .warning{
         color:RGBA(255, 192, 70, 1);
       }
       .error{
         color:RGBA(255, 71, 71, 1);
       }
     }
     .good_info{
       box-sizing: border-box;
       padding:.24rem .32rem .24rem 0;
       border-bottom:1px solid #fafafa;
       overflow: hidden;
       img{
         width:1.62rem;
         height:1.62rem;
         float: left;
         margin-right:.36rem;
       }
       p{
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
         width:calc(100% - 1.98rem);
         font-size: .30rem;
         line-height: .8rem;
       }
       .price_p{
         font-size: .28rem;
         color: RGBA(255, 168, 0, 1);
         span{
           float:right;
           color:RGBA(147, 147, 147, 1);
         }
       }
     }
     .order_info{
       line-height: .80rem;
       padding-right:.32rem;
       color:RGBA(147, 147, 147, 1);
       font-size: .24rem;
       border-bottom:1px solid #fafafa;
     }
     .button_box{
       line-height: 1.28rem;
       padding-right:.12rem;
       overflow: hidden;
       .price{
         font-weight: bold;
         font-size: .32rem;
         color:RGBA(255, 178, 39, 1);
         i{
           font-style: normal;
           font-size: .24rem;
         }
       }
       .button{
         float:right;
         display: inline-block;
         text-align: center;
         box-sizing: border-box;
         width:2.04rem;
         line-height: .70rem;
         color:RGBA(191, 191, 191, 1);
         border:1px solid RGBA(191, 191, 191, 1);
         margin-top:.26rem;
         margin-right:.2rem;
         border-radius: .40rem;
       }
       .success{
         color: RGBA(52, 201, 117, 1);
         border-color: RGBA(52, 201, 117, 1);
       }
       .warning{
         color:RGBA(255, 192, 70, 1);
         border-color: RGBA(255, 192, 70, 1);
       }
       .pay {
          background:RGBA(255, 192, 70, 1);
          color: #fff;
       }
     }
   }
 }
}
</style>
