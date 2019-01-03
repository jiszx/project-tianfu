/**
封装一个商品展示组件
*/
<template>
  <div class="components-goods-row-cart paddingT20">
    <div class="components-goods-row">
      <div class="goods-img" @click="linkToDetail">
        <img :src="image" alt="">
      </div>
      <div class="goods-main">
        <div class="goods-title"  @click="linkToDetail">
          <p class="fontsize-32">{{title}}</p>
        </div>
        <div class="goods-des clearfix">
          <p class="font-yellow fontsize-30 inline-block">
            <span class="inline-block">{{price}}<span class="fontsize-26">￥</span>/{{unit}}</span>
          </p>
          <div class="pull-right" @click.prevent="nofunction">
            <van-stepper
              :key="carId"
              v-model="num"
              integer
              :min="0"
              :max="stockNum"
              @blur="cartChange()"
              @plus="cartChange('+')"
              @minus="cartChange('-')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="promotion-name-wrapper fontsize-20 paddingB20 paddingT10" v-if="salesPromotions&&salesPromotions.length">
      <p>优惠</p>
      <div>
        <span class="red inline-block marginR10 marginl10" v-for="(item,index) in salesPromotions" :key="index">{{item.salesName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Stepper
} from 'vant'
export default {
  props: {
    id: [String, Number],
    carId: [String, Number],
    title: [String, Number],
    image: String,
    price: [String, Number],
    unit: [String, Number],
    salesPromotions: [String, Array],
    commoPropertyValId:[String, Number],
    stockNum:{
      type:Number,
      default:9999
    },
    selectedNum: {
      type: Number,
      default: 1
    },
    timer: null
  },
  data () {
    return {
      num:1
    }
  },
  components: {
    'van-stepper': Stepper
  },
  created() {
    this.num = this.selectedNum;
  },
  methods: {
    nofunction() {},
    linkToDetail() {
      this.$router.push({
        name:'商品详情',
        query: {
          id: this.id
        }
      })
    },
    cartChange(type){
      let num = this.num;
      if(type === '+'){
        num++
      } else if(type === '-'){
        num--
      }
      this.$emit('change', {
        // carId: this.carId,
        commoId: this.id,
        // commoAddSubtractNum: num,
        commoNum: num
        // commoPropertyValId:this.commoPropertyValId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.font-yellow {
  color: #FFA800;
}
  .components-goods-row{
    display: flex;
    height: 1.8rem;
    .goods-img{
      width: 1.6rem;
      height: 1.6rem;
      flex: 0 0 1.6rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .goods-main{
      width: 100%;
      height: 1.8rem;
      padding-left: 0.2rem;
      padding-bottom: 0.2rem;
      .goods-title{
        height: 1rem;
        padding-top: .1rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .goods-des{
        height: 0.5rem;
        padding-top: 0.06rem;
        line-height: 0.44rem;
      }
    }
  }
  .promotion-name-wrapper{
    display: flex;
    &>p{
      flex: 0 0 1rem;
    }
    &>div{
      flex: auto;
    }
  }
</style>
<style lang="scss">
  .components-goods-row{
    .van-stepper__minus, .van-stepper__plus{
      width: 30px;
      height: 20px;
    }
    .van-stepper__input{
      height: 17px;
    }
  }
</style>
