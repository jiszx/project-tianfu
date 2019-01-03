<template>
  <div class="page-pay-type">
    <div class="pay-type">
      <div class="van-hairline--bottom paddingT40 paddingB40 page-content">
        <p class="paddingB40">支付方式</p>
        <div>
          <span class="item-btn inline-block paddingB10 paddingL30 paddingT10 paddingR30 marginR20" :class="{active: !payType}" @click="payType=0">在线支付</span>
          <!-- <span :class="{active:!payType}" @click="payType=0">在线支付</span> -->
        </div>
      </div>
      <div class="van-hairline--bottom paddingT40 paddingB40 page-content delivery">
        <p class="paddingB40">配送方式</p>
        <div>
          <span class="item-btn inline-block paddingB10 paddingL30 paddingT10 paddingR30 marginR20" :class="{active: transType}" @click="transType=1">商家配送</span>
        </div>
      </div>
      <div>
        <!-- <van-cell v-if="transType===1" title="运费：" :border="false" :value="'￥'+(freight||0)" /> -->
        <van-cell title="送货时间：" :border="false" is-link :value="transDate||'请选择送货时间'" @click="showDate=true" />
      </div>
    </div>
    <van-popup v-model="showDate" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @confirm="dateConfirm"
        @cancel="dateCancel"
      />
    </van-popup>
    <div class="bottom-btn-wrapper" @click="confirmFn">确认</div>
  </div>
</template>

<script>
import { Cell, DatetimePicker, Popup } from 'vant'
import { mapGetters } from 'vuex';
export default {
  name: "payType",
  data() {
    return {
      uuid:'',
      payType: 0,
      transType: 1,
      currentDate:'',
      showDate:false,
      transDate:'',
      minDate: new Date(+new Date() + 1000 * 3600 * 24)

    }
  },
  computed: {
    ...mapGetters([
      'getSubmitingOrder'
    ]),
    submitingOrderData(){
      return this.getSubmitingOrder(this.uuid)
    }
  },
  components:{
    'van-cell':Cell,
    'van-datetime-picker':DatetimePicker,
    'van-popup':Popup
  },
  created() {
    this.uuid = this.$route.query.uuid;
    this.freight = this.$route.query.freight
    this.currentDate = this.submitingOrderData.transTime;
    this.payType = this.submitingOrderData.orderPaytype;
    // this.transType = this.submitingOrderData.conveyType;
    // if(this.currentDate){
      this.dateConfirm(+new Date())
    // }
  },
  methods:{
    dateConfirm(val){
      this.showDate = false;
      let d = new Date(val);
      this.transDate = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
      this.currentDate = val;
    },
    dateCancel(){
      this.showDate = false;
    },
    confirmFn(){
      this.$store.commit('updateSubmitingPaytype', {
        uuid: this.uuid,
        data: this.payType
      })
      this.$store.commit('updateSubmitingConvey', {
        uuid: this.uuid,
        data: this.transType
      })
      this.$store.commit('updateSubmitingTransTime', {
        uuid: this.uuid,
        data: this.currentDate
      })
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-pay-type{
  position: relative;
  padding-bottom: 1rem;
  height: 100%;
  .pay-type{
    color: #939393;
    .page-content{
      background: #ffffff;
    }
    .delivery{
      margin-top: 0.3rem;
    }
  }
  .bottom-btn-wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1rem;
    background: #34C975;
    color: #ffffff;
    text-align: center;
    line-height: 1rem;
    font-size: 0.30rem;
    box-shadow: 0 -2px 10px rgba(136, 136, 136, 0.1);
  }
}
.item-btn{
  border: 1px solid #BFBFBF;
  border-radius: 2px;
  color: #939393;
  &.active{
    color: #ffffff;
    background: #34C975;
    border: 1px solid #34C975;
  }
}
</style>

<style lang="scss">
  .page-pay-type{
    .van-cell{
      border-top: 1px solid #D4D4D4;
      .van-cell__title, .van-cell__value{
        color: #939393;
      }
    }
  }
</style>
