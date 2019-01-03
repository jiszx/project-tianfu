<template>
  <div class="page-orderDetails">
    <div class="status_info">
      <img src="../../assets/images/order/ddxq-bj.png" alt="">
      <div class="info_box">
        <img class="left_img"  src="../../assets/images/order/ddxq-img.png" alt="">
        <div class="order_box">
          <h3>{{formData.orderStatusName}}</h3>
          <span>订单号 {{formData.orderNumber}}</span>
          <p>下单时间：{{$mUtils.formatDate(formData.createdDate) || ''}}</p>
           <!-- v-if="!formData.rightStatus" -->
        <!-- 0：待付款，1：待发货，2：已发货，3：已完成，4：已取消 -->
          <img v-if="formData.orderStatus == 1 || formData.orderStatus == 2 || formData.orderStatus == 3" src="../../assets/images/order/ddxq-btn-wq.png" @click="protectOrder(formData)" alt="">
        </div>
      </div>
    </div>

    <van-cell-group class="cell_group">
      <van-cell class="address_box">
        <template slot="title">
          <p>收货人：{{formData.addrLinkman}} <span class="pull-right">{{formData.addrPhone}}</span></p>
          <span class="address_tips">
            <img src="../../assets/images/order/ddxq-dz.png" alt="">
            <span>收货地址：{{formData.areaPath+formData.addrAddress}}</span>
          </span>
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <p class="title_P">支付方式 <span class="date_span">{{$mUtils.formatDate(formData.orderPayTime)}}</span> <span  class="pull-right right_span">{{formData.orderPayModeName}}支付</span></p>
        </template>
      </van-cell>
      <van-cell title="订单备注" :value="formData.orderRemark"></van-cell>
    </van-cell-group>
    <van-cell-group class="cell_group">
      <van-cell>
        <template slot="title">
          <p style="color:RGBA(147, 147, 147, 1)">订单明细</p>
        </template>
      </van-cell>
      <van-cell class="order_cell" v-for="(item, index) in orderItem" :key="index" @click="getGoods(item)">
        <template slot="title">
          <div class="order_box">
            <img :src="item.commoAttachPathUrl" alt="">
            <div class="text_box">
              <h5>{{item.commoName}} <span class="pull-right">¥ {{item.totalAmount}}</span></h5>
              <p>{{item.lineUnitPrice}}元/{{item.commoUnit}} <span class="pull-right">{{item.commoNum+item.commoUnit}}</span></p>
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell>
        <template slot="title">
          <p class="title_P"><span class="sendP_span fontsize-24">配送费</span> <span class="date_span">运杂费</span> <span  class="pull-right right_span">免费</span></p>
        </template>
      </van-cell>
      <van-cell title=" " :value="'合计：￥'+formData.orderAmount">
      </van-cell>
    </van-cell-group>   
    <van-cell v-if="formData.orderStatus==2 || formData.orderStatus==3" :value="formData.orderStatusName">
      <template slot="title">
        <p >发货信息</p>
        <span class="log_tips">物流公司：{{formData.logiCompName}}</span>
        <span class="log_tips">物流单号：{{formData.logiNumber}}</span>
        <span class="log_tips">备注：{{formData.logiRemark}}</span>
      </template>
    </van-cell>
    <div class="bottom_box">
        <div class="left_box">
          <p>实付款&nbsp;<span style="font-size:.24rem;">￥</span><span>{{formData.orderAmount}}</span></p>
        </div>
        <!-- 0：待付款，1：待发货，2：已发货，3：已完成，4：已取消 -->
        <div v-if="formData.orderStatus==0" class="right_box" @click="goToPay(formData)">去支付</div>
        <div v-if="formData.orderStatus==2" class="right_box" @click="resiveGoods(formData)">确认收货</div>
        <div v-if="formData.orderStatus==3 && formData.commentStatus==0" class="right_box evaluate">
          <div @click="evaluate(formData)">评价</div>
        </div>
        <div v-if="formData.orderStatus==1 || formData.orderStatus==4 || (formData.orderStatus==3 && formData.commentStatus==1)" class="right_box" @click="buyAgain(formData)">再次购买</div>
    </div>     
  </div>
</template>

<script>
import { Cell, CellGroup, SubmitBar, Dialog } from 'vant';
export default {
  data() {
    return {
      apiDetails: '/user/mine/orderInfo',
      apiReseive: '/user/mine/affirmCargo',
      orderId: '',
      formData: {},
      orderItem: []
    }
  },
  computed: {

  },
  components: {
   'van-cell':Cell,
   'van-cell-group':CellGroup,
   'van-submit-bar':SubmitBar
  },
  created() {
    this.orderId = this.$route.query.orderData || '';
    this.getDetails();
  },
  methods: {
    /**
     * 获取列表数据
     */
    getDetails() {
      this.$axios.get(this.apiDetails, {orderId: this.orderId}).then(res => {
        this.formData = res.order;
        this.orderItem = res.items;
      })
    },
    /**
     * 商品详情
     */
    getGoods(item) {
      this.$router.push({
        name:'商品详情',
        query: {
          id: item.commoId
        }
      })
    },
    /**
     * 评价
     */
    evaluate(item) {
      let data = {...item};
      data.orderItems = this.orderItem;
      this.$router.push({ name: '发表评价', params: { order: data }});   
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
          this.getDetails()
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
    protectOrder(item) {
      if(item.orderRightId) this.$router.push({name: '维权详情', query: {orderRightId: item.orderRightId}})
      else
      this.$router.push({name: '维权售后', query: {orderData: item.orderId, orderNumber: item.orderNumber}})
    }
  }
}
</script>

<style lang="scss" scoped>
.page-orderDetails{
  padding-bottom:70px;
  .status_info{
    width:100%;
    position: relative;
    margin-bottom:10px;
    .info_box{
      width:100%;
      height:100%;
      position: absolute;
      left:0;
      top:0;
      padding:.28rem .28rem .28rem .20rem;
      display: flex;
      .left_img{
        height:1.12rem;
        flex:0 0 1.28rem;
      }
      .order_box{
        flex:1;
        padding-left:.36rem;
        position: relative;
        h3{
          color:#fff;
          font-size: .38rem;
          line-height: .64rem;
        }
        span{
          color:#fff;
          font-size: .26rem;
          display: inline-block;
          line-height: .40rem;
        }
        p{
          color:#fff;
          font-size: .26rem;
        }
        img{
          position: absolute;
          right:0;
          top:0;
          width:1.48rem;
        }
      }
    }
  }
  .cell_group{
    margin-bottom:10px;
    .address_box{
      .address_tips{
        color:RGBA(147, 147, 147, 1);
        font-size: .24rem;
        line-height: .36rem;
        display: flex;
        img{
          display: inline-block;
          flex:0 0 .2rem;
          height:.24rem;
          margin-top:.06rem;
        }
        span{
          display: inline-block;
          flex:1;
          padding-left:.140rem;
        }
      }
    }
    .title_P{
       .date_span{
         color:RGBA(147, 147, 147, 1);
         font-size: .24rem;
         margin-left:.20rem;
       }
      .right_span{
        color:RGBA(147, 147, 147, 1);
      }      
    }
    .order_cell{
      .order_box{
        display: flex;
        img{
          flex:0 0 1.20rem;
          height:1.20rem;
        }
        .text_box{
          flex:1;
          padding-left:.24rem;
          h5{
            font-size: 16px;
            font-weight: normal;
            span{
              font-size: .28rem;
            }
          }
          p{
            color:RGBA(153, 153, 153, 1);
            font-size: .24rem; 
            margin-top:.16rem;
          }
        }
      }
      .price_p{
        .tag_tips{
          background-color: RGBA(231, 255, 241, 1);
          font-size: .24rem;
          color:RGBA(52, 201, 117, 1);
          padding:.08rem .14rem;
          border:1px solid RGBA(52, 201, 117, 1);
          border-radius: 4px;
        }
        .s_tips{
          color:RGBA(153, 153, 153, 1);
          font-size: .24rem;
          margin-left:.2rem;
        }

      }
    }
  }
  .log_tips{
      color:RGBA(196, 196, 196, 1);
      font-size: .24rem; 
      width:100%;
      float:left;
      display: inline-block;
      line-height: .4rem;
  }
  .bottom_box{
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    display: flex;
    height:1rem;
    .left_box{
      flex:1;
      background-color: #fff;
      border-top:1px solid RGBA(212, 212, 212, 1);
      line-height: 1rem;
      text-align: center;
      font-size:15px;
      span{
        color:RGBA(255, 168, 0, 1);
      }
    }
    .right_box{
      flex:0 0 2.3rem;
      line-height: 1rem;
      text-align: center;
      font-size:15px;
      background-color: RGBA(52, 201, 117, 1);
      color:#fff;
      position: relative;
    }
    .evaluate {
      background-color: #fff;
      border-top:1px solid RGBA(212, 212, 212, 1);
      div{
        background-color: #fff;
        position: absolute;
        text-align: center;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 0.2rem;
        height: .60rem;
        width: 1.54rem;
        border-radius: .40rem;
        font-size: 14px;
        line-height: .60rem;
        color: RGBA(52, 201, 117, 1);
        border: 1px solid RGBA(52, 201, 117, 1);
      }
    }
  }
}
.sendP_span {
  color: #34C975;
  padding: 0.1rem 0.16rem;
  background: #E7FFF1;
  border:1px solid rgba(52, 201, 117, 1);
  border-radius:4px;
}
</style>
