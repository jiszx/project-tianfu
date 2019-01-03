<template>
  <div class="page-public-success">
    <div class="public-bj">
      <img src="../../../assets/images/purchasing/fbcg-bj@2x.png" alt="">
    </div>
    <div class="public-row page-content text-center protect">
      <div class="pulic-status marginB30">
        <img v-if="type" src="../../../assets/images/order/wqcg-img.png" alt="">
        <img v-else src="../../../assets/images/purchasing/fbcg-img@2x.png" alt="">
        <p class="fontsize-36">{{type ? '维权提交成功！':'信息发布成功！'}}</p>
      </div>
      <p class="gray">发布时间：{{$mUtils.formatDate(+new Date())}}</p>
    </div>
    <router-link v-if="procurementId" tag="div" :to="{name:'采购详情', query: {data: this.procurementId}}" class="checkDetail fontsize-30 text-center">查看详情</router-link>
    <router-link tag="div" :to="{name:'首页'}" class="returnHome fontsize-30 text-center">返回首页</router-link>
  </div>
</template>

<script>
import { Button } from 'vant';
export default {
  data() {
    return {
      apiInfo: '/found/procurements/info',
      procurementId: '',
      type: ''
    }
  },
  computed: {
   
  },
  components: {
    'van-button': Button,
  },
  created() {
    this.procurementId = this.$route.query.data || '';
    this.type = this.$route.query.type || '';
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.page-public-success {
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
    img {
      width: 1.77rem;
      height: 1.09rem;
      flex: 0 0 1.77rem;
      margin-right: 10px;
    }
  }
}
.protect {
  margin: 0.8rem 0 2rem;
  .pulic-status img{
    width: 1.40rem;
    height: 1.20rem;
    flex: 0 0 1.40rem;
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
