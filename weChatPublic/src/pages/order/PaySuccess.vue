<template>
  <div class="success_pay">
    <div class="public-bj">
      <img src="../../assets/images/purchasing/fbcg-bj@2x.png" alt="">
    </div>
    <div class="public-row page-content text-center protect">
      <div class="pulic-status marginB30">
        <img src="../../assets/images/order/zfcg-img.png" alt="">
        <p class="fontsize-36">您已付款成功！</p>
      </div>
      <p class="gray">发布时间：{{$mUtils.formatDate(+new Date())}}</p>
    </div>
    <router-link tag="div" v-if="!type && orderId" :to="{name: '订单详情', query: { orderData: orderId }}" class="checkDetail fontsize-30 text-center">查看订单</router-link>
    <router-link tag="div" :to="{name:'首页'}" class="returnHome fontsize-30 text-center">返回首页</router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderId: this.$route.query.orderId||'',
      type: this.$route.query.type||'',
    }
  }
}
</script>
<style lang="scss" scoped>
.success_pay{
position: relative;
  background: #fff;
  padding: 0.5rem 0.2rem;
  height: 100%;
  .public-bj{
    position: absolute;
    z-index: 1;
    top: 0.5rem;
    left: 0.2rem;
    right: 0.2rem;
    width: auto;
  }
}
.public-row{
  position: relative;
  z-index: 2;
  margin: 1rem 0 2rem;
  .pulic-status {
    display: flex;
    color: #34C975;
    justify-content: center;
    align-items: center;
  }
}
.protect {
  margin: 0.8rem 0 2rem;
  .pulic-status img{
    width: 1.40rem;
    flex: 0 0 1.40rem;
    margin-right: 10px;
  }
}
.checkDetail {
  color: #fff;
  background: #34C975;
  padding: 0.3rem;
  border-radius: 6px;
  margin: 0 0.1rem 0.3rem;
}
.returnHome {
  color: #34C975;
  background: #fff;
  border: 1px solid #34C975;
  padding: 0.3rem;
  border-radius: 6px;
  margin: 0 0.1rem;
}
</style>
