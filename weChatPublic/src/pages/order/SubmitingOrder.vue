<template>
  <div class="page-submiting-order">
    <div class="page-submiting-top">
      <div class="address-wrapper alignCen">
        <van-cell is-link :to="{name:'收货信息',query:{uuid:uuid,type:'order'}}" v-if="submitingOrderData.address&&submitingOrderData.address.addrId">
          <template slot="title">
            <div class="address-info">
              <div class="address-title">
                <span class="inline-block marginR20">收货人：{{submitingOrderData.address.addrLinkman}} </span>
                <span class="inline-block marginR20 pull-right">{{submitingOrderData.address.addrPhone}}</span>
                <!-- <span class="inline-block address-default-taps red van-hairline--surround border-red" v-if="submitingOrderData.addrDefault">默认</span> -->
              </div>
              <div class="address-detail">
                收货地址：{{submitingOrderData.address.areaPath.replace(/\>/g, '')||''}}
              </div>
              <van-icon name="location" class="address-icon"></van-icon>
            </div>
          </template>
        </van-cell>
        <router-link tag="div" v-else :to="{name:'收货信息',query:{uuid:uuid,type:'order'}}" class="comfirmAddr">填写收货地址</router-link>
      </div>
      <!-- 支付方式 -->
      <div class="pay-type-wrapper">
        <van-cell-group>
          <van-cell title="支付配送" is-link :to="{name:'选择支付配送方式', query:{uuid:uuid}}" class="alignCen">
          <template slot="title">
            <div class="pay-type">
              <div class="inline-block">
                支付配送
              </div>
              <div class="inline-block address-info pull-right">
                <p class="gray">在线支付</p>
                <p class="gray">商家配送</p>
              </div>
            </div>
          </template>
        </van-cell>
          <!-- freight:currentOrderData.freight -->
        </van-cell-group>
      </div>
      <!-- 商户认证 -->
      <div class="page-content merchant-CA">
        <div class="components-merchant-row">
          <div class="merchant-img">
            <img :src="submitingOrderData.shop.custAvatarUrl" alt="">
          </div>
          <div class="merchant-main">
            <div class="merchant-title fontsize-30">
              <span>{{submitingOrderData.shop.custName}}</span>
              <div class="pull-right">
                <span v-if="submitingOrderData.shop.realNameAuth === 1" >
                  <img src="../../assets/images/index/sy-icon-ren.png" alt="" />
                </span>
                <span v-if="submitingOrderData.shop.aptitudeAuth === 1">
                  <img src="../../assets/images/index/sy-icon-z.png" alt="" />
                </span>
                <span v-if="submitingOrderData.shop.enterpriseAuth === 1">
                  <img src="../../assets/images/index/sy-icon-qi.png" alt="" />
                </span>
              </div>
            </div>
            <div class="merchant-des clearfix">
              <p class="fontsize-24 inline-block">
                <span class="price-unit">{{submitingOrderData.shop.areaPath.replace(/\>/g, '')||''}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="order-detail-wrapper">
        <div class="page-title">订单明细</div>
        <div class="order--detail-row" v-for="(item, index) in submitingOrderData.goodsData" :key="index">
          <goodsRowOrder
            :title="item.commoName"
            :image="item.commoAttachPathUrl"
            :commoPrice="item.commoPrice"
            :num="item.commoNum"
            :commoUnit="item.commoUnit"
          ></goodsRowOrder>
        </div>
      </div>
      <div class="order-promo-wrapper">
        <div class="page-content clearfix paddingT20 paddingB20">
          <span class="pull-right">
            合计：￥{{payAmount}}
          </span>
        </div>
      </div>
      <van-cell-group class="lineheight-1 marginT20">
        <van-field v-model="remark" label="订单备注：" placeholder="请输入订单备注（100字以内）" />
      </van-cell-group>
    </div>
    <div class="page-submiting-bottom bg-white van-hairline--top">
      <span>
        实付款：
        <span class="pay-amount">￥{{payAmount}}</span>
      </span>
      <div class="submiting-btn pull-right" @click="submitOrder">提交订单</div>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Icon, Field, Popup, RadioGroup, Radio } from 'vant';
import goodsRowOrder from 'components/goods-row-order'
import { mapGetters } from 'vuex';
import weixin from 'mixins/weixin.js'
export default {
  name: "submiting-order",
  mixins:[weixin],
  data() {
    return {
      api_get_addr: '/user/address/list', // 8.4 查询收货地址
      api_submit_order: '/order/orders/create',// 10.6. 提交订单
      uuid:'',
      value:'',
      remark: '',
      // currentOrderData:{
      //   orderRemark:'', // 订单备注
      // },
      address: {}
    }
  },
  computed:{
    ...mapGetters([
      'getSubmitingOrder'
    ]),
    submitingOrderData(){
      return this.getSubmitingOrder(this.uuid)
    },
    payTypeText(){
      return (this.submitingOrderData.orderPaytype = '在线支付') 
      // + (this.submitingOrderData.conveyType = '商家配送');
    },
    payAmount() {
      let amount = 0;
      this.submitingOrderData.goodsData.map(item => {
        amount+=item.commoPrice*item.commoNum
      });
      return parseFloat(amount).toFixed(2);
    }
  },
  watch:{
    // remark(val){
    //   console.log(val)
    //   if(val.length > 100){
    //     this.currentOrderData.orderRemark = val.substring(0, 100);
    //   }
    //   this.$store.commit('updateSubmitingRemark', {
    //     uuid: this.uuid,
    //     data: this.currentOrderData.orderRemark
    //   })
    // }
  },
  components: {
    'van-cell': Cell,
    'van-cell-group':CellGroup,
    'van-icon': Icon,
    'van-field':Field,
    'van-popup': Popup,
    'van-radio-group':RadioGroup,
    'van-radio':Radio,
    goodsRowOrder
  },
  created(){
    this.uuid = this.$route.query.uuid;
    if(!this.submitingOrderData.uuid){
      this.$router.go(-1);
      return;
    }
    // this.currentOrderData.orderRemark = this.submitingOrderData.orderRemark || '';
    this.getAddress();
  },
  methods:{
    /**
     *  获取地址数据
     */
    getAddress(){
      this.$axios.post(this.api_get_addr, {_showLoading: true})
        .then(res => {
          this.address = res.find(v => {
            return v.addrDefault == 1
          })
          // 如果submitingOrderData.addrAddress为空的话则赋值一个默认地址
          if(!this.submitingOrderData.address.addrAddress){
            this.$store.commit('updateSubmitingAddress', {
              uuid:this.uuid,
              data:this.address
            })
          }
        })
    },
    /**
     * 提交订单
     */
    submitOrder() {
      let orderData = {
        addrId: this.submitingOrderData.address.addrId,
        conveyTime: this.submitingOrderData.transTime ? (+new Date(this.submitingOrderData.transTime)) : '', // 送货时间
        conveyType:this.submitingOrderData.conveyType, // 配送方式
        items:[], // 商品
        orderRemark: this.remark || '' // 订单备注
      }
      console.log(orderData.addrId,252)
      if(!orderData.addrId){
        this.$store.dispatch('showMsgTips', '请选择收货地址！');
        return;
      }
      if(!orderData.conveyType || !orderData.conveyTime){
        this.$store.dispatch('showMsgTips', '请选择配送方式和送货时间！');
        return;
      }
      // 商品列表
      let goodsList = [];
      this.submitingOrderData.goodsData.forEach(item => {
        goodsList.push({
          commoId: item.commoId,
          commoNum: item.commoNum,
          // commoPropertyValId:item.commoPropertyValId
        })
      })
      orderData.items = JSON.stringify(goodsList);
      this.$axios.post(this.api_submit_order, orderData)
        .then(res => {
          this.$router.replace({
            name:'在线支付',
            query:{orderId: res.orderId}
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-submiting-order{
  padding-bottom: 1.2rem;
  position: relative;
  .page-submiting-top{
    .order-promo-wrapper{
      .page-content{
        .pull-right{
          color: #939393;
        }
      }
    }
  }
  /* 商户认证 */
  .merchant-CA{
    .components-merchant-row{
      display: flex;
      height: 1.5rem;
      padding: 0.25rem 0;
      .merchant-img{
        width: 0.96rem;
        height: 0.96rem;
        flex: 0 0 0.96rem;
        border: 0.02rem solid #B2DA88;
        border-radius: 48px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      .merchant-main{
        width: 100%;
        height: 1rem;
        padding-left: 0.2rem;
        .merchant-title{
          height: 0.6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          img{
            max-height: 0.36rem;
            max-width: 0.28rem;
          }
        }
        .merchant-des{
          .price-unit{
            color: #999999;
          }
          .pull-right{
            margin-top: -5px;
            color: #999999;
          }
        }
      }
    }
  }
  .page-submiting-bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    padding-left: 0.3rem;
    .pay-amount{
      color:#FFA800;
    }
    .submiting-btn{
      height: 1rem;
      background: #34C975;
      color: white;
      width: 2.4rem;
      text-align: center;
    }
  }
}
.address-wrapper{
  line-height: 0.6rem;
  background: #ffffff;
  padding: 1px 0;
  margin-top: .2rem;
  .comfirmAddr {
    margin: 0.3rem;
    // width: 100%;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #34C975;
    border:1px solid rgba(52, 201, 117, 1);
    border-radius:5px;
  }
  .address-info{
    position: relative;
    line-height: 0.6rem;
    padding-left: 0.6rem;
    margin-right: .3rem;
    .address-detail{
      color: #939393;
      line-height: 1.3;
      min-height: 0.2rem;
    }
    .address-default-taps{
      height: 20px;
      line-height: 22px;
      padding: 0 10px;
      border:1px solid #34C975;
      border-radius: 0.04rem;
      font-size: 0.2rem;
    }
    .address-icon{
      position: absolute;
      left: 0.1rem;
      top: 0.66rem;
      color: #939393;
    }
  }
}
.pay-type-wrapper .pay-type{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.order-detail-wrapper {
  background: #fff;
  .page-title {
    border-bottom: 1px solid #e5e5e5;
    padding: .3rem;
  }
  .order--detail-row {
    padding-left: .3rem;
  }
}
</style>
<style lang="scss">
.page-submiting-order{
  .page-content{
    background: #fff;
  }
  .merchant-CA{
    margin: 0.2rem 0 0.3rem 0;
  }
}
  .alignCen{
    .van-cell{
      background: transparent;
    }
    .van-cell__right-icon{
      color: #939393;
      margin-top: 0.3rem;
    }
  }
  .order-promo-wrapper{
    .van-cell__value{
      flex: 0 0 70px;
    }
  }
</style>
