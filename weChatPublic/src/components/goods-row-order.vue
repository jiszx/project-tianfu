/**
封装一个商品展示组件
*/
<template>
  <div class="components-goods-row van-hairline--bottom">
    <div class="goods-img">
      <img :src="image" alt="">
    </div>
    <div class="goods-main">
      <div class="goods-title fontsize-30">
        <span>{{title}}</span>
        <div class="pull-right">
          <span class="inline-block fontsize-26">¥ {{commoPrice}}</span>
        </div>
      </div>
      <div class="goods-des clearfix">
        <p class="fontsize-24 inline-block">
          <span class="price-unit">{{commoPrice}}元/{{commoUnit}}</span>
        </p>
        <div class="pull-right">
          <span class="inline-block fontsize-24">{{num + commoUnit}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: [String, Number],
    title: String,
    image: String,
    commoPrice: String,
    promotionName: String,
    num: [String, Number], // 商品数量
    commoUnit: String,
  },
  data () {
    return {
      payAmount: 0
    }
  },
  created() {
    this.commoPrice = parseFloat(this.commoPrice).toFixed(2);
    this.payAmount = (this.commoPrice)*(this.num);
  },
  components: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
  .components-goods-row{
    display: flex;
    height: 1.6rem;
    padding-top: .2rem;
    padding-bottom: .2rem;
    padding-right: .3rem;
    .goods-img{
      width: 1.2rem;
      height: 1.2rem;
      flex: 0 0 1.2rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .goods-main{
      width: 100%;
      height: 1.5rem;
      padding-left: 0.2rem;
      padding-bottom: 0.2rem;
      .goods-title{
        height: 0.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .goods-des{
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
</style>
