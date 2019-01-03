<template>
  <div class="order order_detial">
    <div class="order-item order-item-list">
      <p>订单状态：{{orderDetailsList.orderStatusName}}</p>
      <p>结算状态：{{orderDetailsList.settleStatusName}}</p>
      <p>订单金额：¥{{orderDetailsList.orderAmount}}</p>
      <p>订单编号：{{orderDetailsList.orderNumber}}</p>
      <p>买方：{{orderDetailsList.custName}}</p>
      <el-button v-if="orderDetailsList.orderStatus != 4" class="cancel-order" type="danger" size="mini" @click="cancelOrder()">取消订单</el-button>
    </div>
    <div class="order-item order-item-info">
      <p class="p1">维权信息</p>
      <div class="my-step-dec">
        <div class="goods_name">
          <div class="contant-img" v-if="attachPath1Url||attachPath2Url">
            <viewer :images="images">
              <img class="img-table" v-if="attachPath1Url" :src="attachPath1Url">
              <img class="img-table" v-if="attachPath2Url" :src="attachPath2Url" alt="">
            </viewer>
          </div>
          <div>
            <p>{{rightInfo}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="order-item">
      <p>收货地址</p>
      <div class="my-step-dec">
        <p class="inline-part">联系方式：{{orderDetailsList.addrPhone}}</p>
        <p>地址：{{orderDetailsList.addrAddress}}</p>
      </div>
    </div>
    <div class="order-item">
      <p>发货</p>
      <div class="my-step-dec">
        <p class="inline-part">物流/快递公司：{{orderDetailsList.logiCompName}}</p>
        <p class="inline-part">快递单号：{{orderDetailsList.logiNumber}}</p>
        <p>备注：{{orderDetailsList.logiRemark}}</p>
      </div>
    </div>
    <div class="order-item">
      <p>订单备注</p>
      <div class="my-step-dec">
        <p>{{orderDetailsList.orderRemark}}</p>
      </div>
    </div>
    <div class="order-item">
      <p>商品</p>
     <!--  <div class="my-step-dec">
        <div class="goods_name">
          <div>
            <img src="https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1806901333,819340369&fm=173&app=25&f=JPEG?w=640&h=528&s=B53AE337802352A4D6ACF0ED0300F021" alt="">
          </div>
          <div>
            <p>原生态无污染天然土豆</p>
            <p>
              <span class="marginR50">单价：{{orderDetailsList.lineUnitPrice}}</span>
              <span>数量：{{orderDetailsList.orderStatusName}}</span>
            </p>
          </div>
        </div>
      </div> -->
      <div class="my-step-dec" v-for="(item,index) in orderDetailsList.itemLists" :key="index">
        <div class="goods_name">
          <div>
            <img :src="item.commoAttachPathUrl" alt="">
          </div>
          <div>
            <p>{{item.commoName}}</p>
            <p>
              <span style="margin-right: 30px;">单价：¥{{item.lineUnitPrice}}</span>
              <span>数量：{{item.commoNum}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <p>下单时间：{{$commonFun.formatDate(orderDetailsList.createdDate)}}</p>
    <p>支付时间：{{$commonFun.formatDate(orderDetailsList.orderPayTime)}}</p>
    <p>支付方式：{{orderDetailsList.orderPayModeName}}</p>
    <p>结算收款账号：{{orderDetailsList.settleAccount}}</p>
    <p>订单结算时间：{{$commonFun.formatDate(orderDetailsList.orderSettleTime)}}</p>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        apiInfo:'/order/orders/info', // 7.4. 订单详情
        apiCustomerUpdate: '/order/orders/updateStatus', // 取消订单
        orderDetailsList: {
          
        },
        attachPath1Url:'',
        attachPath2Url:'',
        rightInfo:'',
        images:[]
      }
    },
    created() {
      this.getOrderDetails();
    },
    methods: {
      getOrderDetails(){
        this.$axios.get(this.apiInfo,{params:{orderId:this.$route.query.orderId}})
          .then(res => {
            this.orderDetailsList = res.data.data;
            this.attachPath1Url = this.orderDetailsList.orderRight.attachPath1Url;
            this.attachPath2Url = this.orderDetailsList.orderRight.attachPath2Url;
            this.rightInfo = this.orderDetailsList.orderRight.rightInfo;
          })
      },
      cancelOrder() {
        this.$confirm('确认取消订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(this.apiCustomerUpdate, {orderId: this.$route.query.orderId})
            .then(res => {
              this.$message({
                type: 'success',
                message: '订单取消成功！'
              });
            })
        }).catch(() => {
          // todo 异常处理
        });
      }
    },
  }
</script>
<style lang="scss" scoped>
  .order_detial {
    padding: 0 20px;
    .order-item-list{
      position: relative;
      max-width: 1200px;
      .cancel-order{
        position: absolute;
        right: 0;
        top: 62px;
      }
    }
    .order-item-info{
      .p1{
        color: red;
      }
      .contant-img{
        max-width: 400px;
      }
    }
    p {
      margin: 15px 0;
    }
    .my-step-dec {
      padding: 10px 20px;
      max-width: 1200px;
      background-color: rgba(242, 242, 242, 1);
      margin-bottom: 15px;
      .dec-btn {
        div {
          margin-right: 5px;
          display: inline;
        }
      }
      .inline-part {
        display: inline-block;
        margin-bottom: 0;
        &:first-child {
          margin-right: 30px;
        }
      }
      .goods_name {
        display: flex;
        align-items: center;
        position: relative;
        img {
          width: 90px; 
          height: 90px;
          min-width: 90px; 
          min-height: 90px;
          margin-right: 20px;
        }
        .add-trace-back {
          position: absolute;
          right: 0;
          color: rgb(52, 201, 117);
          cursor: pointer;
        }
      }
    }
  }
</style>
