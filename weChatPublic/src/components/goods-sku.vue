/**
封装一个Sku 商品购买组件
  v-model 是否显示sku，Boolean，默认false
  goodsData: 商品数据
*/
<template>
  <van-popup v-model="show" position="bottom" class="goods-sku-container">
    <div class="goods-sku">
      <div class="goods-sku-close text-right paddingR30">
        <img src="../common/images/ljgm-tc-gb.png" @click="closeSku" alt="">
      </div>
      <div class="goods-sku-goods-info-wrapper page-content">
        <div class="goods-sku-goods-image">
          <img :src="goodsData.commoAttachPathUrl" alt="">
        </div>
        <div class="goods-sku-goods-info">
          <div class="goods-title">
            <p>{{goodsData.commoName}}</p>
          </div>
          <div class="goods-des clearfix">
            <p class="inline-block font-yellow">
              <span class="goods-price inline-block">{{goodsData.commoPrice}}</span><span class="fontsize-26"> 元 / {{goodsData.commoUnit}}</span>
            </p>
            <div class="pull-right gray fontsize-24">
              <!--<span>库存：{{goodsData.stockNum}}</span>-->
            </div>
          </div>
        </div>
      </div>
      <div class="goods-sku-step page-content paddingT60 paddingB30" style="margin-bottom:1.4rem;">
        <p class="gray" >数量：</p>
        <van-stepper
          class="paddingT30"
          style="margin-bottom:.3rem;"
          v-model="selectedNum"
          integer
          :min="1"
          :max="goodsData.stockNum"
          @change="changeChooseNum"
        />
        <!-- <div v-for="(item,index) in goodsData.commoProperties" :key="index">
            <p class="gray ">{{item.propertyName}}：</p>
          <div class="radio">
            <div class="radio_item" v-for="(iteam,index) in item.vals" :class="{'active':item.active==iteam.valId}" :key="index" @click="radioChange(item,iteam.valId)">
                {{iteam.propertyVal}}
            </div>
          </div>
        </div> -->
      </div>   
      <div class="sku-bottom-wrapper">
        <div class="select-price page-content">
          <div class="van-hairline-top text-right gray">
            数量 <span class="font-black paddingR50">{{selectedNum}}</span> 合计：<span class="font-yellow">{{parseFloat(selectedNum*goodsData.commoPrice).toFixed(2)}}元</span>
          </div>
        </div>
        <div class="goods-sku-btn-wrapper text-center fontsize-32">
          <div class="goods-sku-btn bg-yellow" v-if="showBuyBtn" @click="buyNow">确定</div>
          <div class="goods-sku-btn bg-yellow" v-if="showAddCart" @click="addCart">确定</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import {
  Popup,
  Stepper
} from 'vant';
export default {
  name: "goods-sku",
  props: {
    value: Boolean,
    goodsData: Object,
    showBuyBtn:Boolean,
    showAddCart:Boolean
  },
  data () {
    return {
      selectedSku: {},
      selectedNum: 1,
      show: this.value,
      goods_price_url:'/classify/commodity/price',
      typeGoodsInfo:{}   //多属性商品信息
    }
  },
  watch: {
    show (val) {
      this.$emit('input', val);
      if (!val) {
        // 把数量初始化成1
        this.selectedNum = 1;
      }
    },
    value (val) {
      this.show = val;
    // if(!val){
    //   if(this.goodsData.commoProperties.length!=0){
    //     this.goodsData.commoProperties.map(item=>{
    //       var obj=JSON.parse(JSON.stringify(item));
    //       item.active='';
    //       this.$set(item)
    //       delete item[undefined];
    //       return item;
    //     })
    //   }
    // }      
    }
  },
  components: {
    'van-popup': Popup,
    'van-stepper': Stepper,
  },
  methods: {
    /**
     * 获取数据
     * @returns {{goodsId: *, selectedNum: number, selectedSkuComb: *, messages: *, cartMessages: *}}
     */
    getSkuData() {
      return {
        goodsData: this.goodsData,
        typeGoodsInfo:this.typeGoodsInfo,
        selectedNum: this.selectedNum
      };
    },
    /**
     * 关闭选项框
     */
    closeSku() {
      this.show = false;
    },
    /* 多属性验证必选 */
    checkValidate(){
      var validate=true;
      // if(this.goodsData.commoProperties.length!=0){
      //    this.goodsData.commoProperties.forEach(item => {
      //       if(!item.active){
      //          validate=false;
      //       }
      //    }); 
      // }
      return validate;
    },
    /* 属性选择 */
    radioChange(obj,id){
     if(obj.active==id){
         obj.active='';
     }else{
         obj.active=id;
     }
     this.$set(obj);
     delete obj.undefined;
      this.priceChange();
    },
    /* 不同属性改价 */
    priceChange(){
     if(this.checkValidate()){
       var arr=[];
      //  if(this.goodsData.commoProperties.length!=0){
      //   this.goodsData.commoProperties.forEach(item=>{
      //     arr.push(item.active);
      //   })
      //  }
      //  this.$axios.get(this.goods_price_url,{commoId:this.goodsData.commoId,valIds:arr.join(',')})
      //  .then(res=>{
      //    this.typeGoodsInfo=res;
      //    console.log(this.typeGoodsInfo);
      //    console.log(this.goodsData.commoTradePrice);
      //    this.goodsData.commoTradePrice = this.typeGoodsInfo.price;
      //  })
     }
    },
    /**
     * 修改数量
     */
    changeChooseNum(data) {
      if(data <= 0) this.selectedNum = 1;
    },
    buyNow(data) {
      // if(!this.goodsData.stockNum){
      //   // 库存不足
      //   this.$store.dispatch('showMsgTips', '库存不足！')
      //   return;
      // }
      // if(!this.checkValidate()){
      //   this.$toast('请选择商品属性')
      //   return;
      // }
      this.$emit('buy-clicked', this.getSkuData())
    },
    addCart(data) {
      // if(!this.goodsData.stockNum){
      //   // 库存不足
      //   this.$store.dispatch('showMsgTips', '库存不足！')
      //   return;
      // }
      // if(!this.checkValidate()){
      //   this.$toast('请选择商品属性')
      //   return;
      // }
      this.$emit('add-cart', this.getSkuData())
    }
  }
}
</script>

<style lang="scss" scoped>
.font-yellow{
  color: #FBA500;
}
.font-black{
  color: #393939;
}
.goods-sku{
  min-height: 44vh;
  .goods-sku-close {
    margin-top: .26rem;
    margin-bottom: .16rem;
  }
  .goods-sku-goods-info-wrapper{
    display: flex;
    .goods-sku-goods-image{
      flex: 0 0 1.74rem;
      height: 1.74rem;
      // margin-top: -0.4rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .goods-sku-goods-info{
      flex: auto;
      padding-left: 0.2rem;
      padding-top: 0.1rem;
      .goods-title{
        height: 0.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .goods-des{
        height: 0.5rem;
        padding-top: 0.06rem;
        line-height: 0.44rem;
        .goods-price {
          font-size: .42rem;
        }
      }
    }
  }
  .radio{
    width:100%;
    overflow: hidden;
    .radio_item{
     padding:5px 10px;
     border:1px solid #999;
     line-height: 18px;
     border-radius: 4px;
     box-sizing: border-box;
     float: left;
     color:#333;
     margin:.2rem .3rem .3rem 0;
    }
    .active{
        background-color: #67C23A;
        color:#fff;
        border-color: #fff;
    }
}
}
.goods-sku-container{
  background: #fff;
  overflow-y: visible;
}
  .sku-bottom-wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2rem;
    line-height: 1rem;
    .select-price{
      height: 1rem;
      .van-hairline-top {
        border-top: 1px solid #d4d4d4;
      }
    }
    .goods-sku-btn-wrapper{
      color: #fff;
      height: 1rem;
    }
    .bg-yellow{
      background: #34C975;
    }
    .bg-error{
      background-color: #FF2D55;
    }
  }
</style>
