<template>
  <div class="page-choose-pay">
    <div class="van-hairline--bottom page-content paddingT40 paddingB40">
      <span class="gray">支付金额：</span>
      <span class="warning pull-right"><span style="font-size:.24rem;">￥</span>{{currentOrderData.orderAmount}}</span>
    </div>
    <div class="van-hairline--bottom paddingT20 paddingB30">
      <div class="paddingT20">
        <van-radio-group v-model="payType">
          <van-cell clickable @click="payType = '1'" class="pay-cell">
            <div slot="title" class="">
              <img src="../../assets/images/order/zxzf-weixin.png" alt="" class="inline-block paddingR10" />
              微信支付
            </div>
            <van-radio class="inline-block" name="1" />
          </van-cell>
        </van-radio-group>
      </div>
    </div>

    <div class="bottom_box">
      <div class="left_box">
        <p>实付款&nbsp;<span style="font-size:.24rem;">￥</span><span>{{currentOrderData.orderAmount}}</span></p>
      </div>
      <div class="right_box" @click="submitOrder">确认支付</div>
    </div>
  </div>
</template>

<script>
import {RadioGroup, Radio, Cell} from 'vant'
import weixin from 'mixins/weixin.js'
import { mapState } from 'vuex'
export default {
  name: "choosePay",
  mixins:[weixin],
  data() {
    return {
      api_get_data:'/user/mine/orderInfo',
      payType:'1',
      orderId: this.$route.query.orderId,
      currentOrderData:{}
    }
  },
  components: {
    'van-radio-group': RadioGroup,
    'van-radio': Radio,
    'van-cell': Cell
  },
  computed: {
    ...mapState({
      setting: state=>state.mine.setting
    })
  },
  created() {
    this.getData();
  },
  methods:{
    submitOrder(){
      // todo 完成支付
      if(!this.orderId && this.$route.query.type == 'vip')
      this.doPayVip(() => {
        this.$store.dispatch('showMsgTips', '已支付成功！')
        this.$router.replace({name:'支付成功', query: {type: 'vip'}})
      })
      else
      this.doPay(this.orderId, () => {
        this.$store.dispatch('showMsgTips', '已支付成功！')
        this.$router.replace({name:'支付成功', query: {orderId: this.orderId}})
      })
    },
    /**
     *  获取订单计算数据
     */
    getData(){
      if(this.orderId)
      this.$axios.get(this.api_get_data, {orderId: this.orderId})
        .then(res => {
          this.currentOrderData = res.order;
        })
      else if(this.$route.query.type == 'vip') this.currentOrderData.orderAmount = this.setting.authFee
    }
  }
}
</script>

<style lang="scss" scoped>
.page-choose-pay{
  position: relative;
  padding-bottom: 1rem;
  .page-content {
    background: #fff;
  }
  .pay-cell {
    align-items: center;
  }
  .warning {
    color: #ffa800;
  }
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
}
</style>
