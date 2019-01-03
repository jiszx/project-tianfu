<template>
<div class="page-cart-list">
  <van-checkbox-group class="cart-goods" v-model="selectedShop" @change="changeShop">
    <div class="cart-shop-list marginT30"
        v-for="(shop, index) in cartList"
        :key="shop.custId">
      <div class="cart-shop-checkbox cart-list-item paddingB20 van-hairline--bottom">
        <div class="cart-item-checkbox" @click="choseShop(shop)">
          <van-checkbox :name="shop.merchant.custId"></van-checkbox>
        </div>
        <div class="goods-row gray">
          <img src="../../assets/images/order/wddd-dp.png" class="shop-icon" alt="">
          {{shop.merchant.custName}}
        </div>
        <van-icon name="arrow" class="icon-item icon-shop pull-right"/>
      </div>
      <van-checkbox-group v-model="selectedItems" class="cart-list">
        <div
          class="cart-list-item van-hairline--bottom"
          v-for="item in shop.items"
          :key="item.carId"
        >
          <div class="cart-item-checkbox" @click="checkboxChange(item)">
            <van-checkbox :name="item.commoId"></van-checkbox>
          </div>
          <div class="goods-row">
            <goodsRowCart
              :id="item.commoId"
              :carId="item.carId"
              :title="item.commoName"
              :image="item.commoAttachPathUrl"
              :price="item.commoPrice"
              :unit="item.commoUnit"
              :salesPromotions="item.salesPromotions"
              :commoPropertyValId='item.commoPropertyValId'
              :selectedNum="item.commoNum"
              @change="cartChange"
            />
          </div>
        </div>
      
        <!--加载更多-->
        <!-- <div class="loading-more-box">
          <p class="loading-more" v-if="!hasMore">没有更多</p>
          <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
        </div> -->
      </van-checkbox-group>
    </div>
  </van-checkbox-group>
  <!--按钮区域-->
  <div class="cart-btn-wrapper">
    <div class="total-price paddingL30 fontsize-30 text-center">
      总计：<span class="font-yellow fontsize-34"><span class="fontsize-24">￥</span>{{totalPrice}}</span>
    </div>
    <div class="go-buy-btn text-center white" @click="buyNow">
      去结算
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import {
  Checkbox,
  CheckboxGroup,
  Icon,
  RadioGroup,
  Radio
} from 'vant'
import goodsRowCart from 'components/goods-row-cart'
import LoadingMore from '@/components/base/loading-more'
export default {
  data () {
    return {
      selectedShop: [],
      shopId: '',
      selected: [],
      selectedItems: []
    }
  },
  computed: {
    ...mapState({
      cartList: state => state.cart.cartList,
      hasMore: state => state.cart.hasMore,
      loading: state => state.cart.loading,
      cartSelected: state => state.cart.selected,
      baseSubmitingObj: state => state.order.baseSubmitingObj
    }),
    totalPrice() {
      let price = 0;
      this.cartList.forEach(items => {
        items.items.forEach(item => {
          if (this.selectedItems.indexOf(item.commoId)>=0) {
            price += item.commoNum * item.commoPrice
          }
        })
      })
      return parseFloat(price).toFixed(2);
    }
  },
  components: {
    LoadingMore,
    goodsRowCart,
    'van-checkbox': Checkbox,
    'van-checkbox-group': CheckboxGroup,
    'van-radio': Radio,
    'van-radio-group': RadioGroup,
    'van-icon': Icon
  },
  watch: {
    cartSelected(val) {
      // console.log(val)
    }
  },
  created() {
    this.getData();
    this.selected = this.cartSelected.item;
    this.selectedItems = this.cartSelected.commoId;
    this.shopId = this.cartSelected.shop;
    this.selectedshopItem = this.shopId;
    this.selectedShop = this.shopId?[this.shopId.merchant.custId]:[];
  },
  methods: {
    /**
     * 加载更多
     */
    loadingMore() {
      this.$store.dispatch('cartGetMoreList');
    },
    getData() {
      this.$store.dispatch('cartGetList')
    },
    /**
     * 单选框组件选择商家
     */
    changeShop(name, event) {
      // console.log(name, event)
      // if(typeof name === 'object') {
      //   let arr = [];
      //   if(name.items)
      //   name.items.map(item => {
      //     arr.push(item)
      //   })
      //   this.selected = arr;
      //   this.shopId = name.merchant ? name.merchant.custId : '';
      // }
    },
    /**
     * 点击单选框选择商家
     */
    choseShop(shop) {
      if(this.selectedShop.length > 1 || this.selectedShop.length == 0) {
        this.selectedShop = [];
        this.shopId = '';
        this.selected = [];
      } else {
        let arr = [];
        if(shop.items)
        shop.items.map(item => {
          arr.push(item)
        })
        this.selected = arr;
        this.shopId = shop;
        this.selectedShop = [shop.merchant.custId]
      }
      this.selectedChange()
    },
    /**
     * 选择商品
     */
    checkboxChange(item){
      let index = this.selected.findIndex(v => {
        return v.commoId === item.commoId
      })
      // console.log(index)
      if(index>=0) this.selected.splice(index, 1)
      else this.selected.push(item);
      if(this.selected.length > 0) {
        if(this.selected.length > 1) {
          if(this.selected[this.selected.length-1].merchantId !== this.selected[this.selected.length-2].merchantId) {
            this.selected = [this.selected[this.selected.length-1]];
            this.selectedShop = [];
            this.checkGoodsLength();
          } else {
            this.checkGoodsLength();
          }
        } else {
          this.checkGoodsLength();
        }
      } else {
        this.shopId = '';
        this.selectedShop = []
      }
      this.selectedChange()
    },
    /**
     * 选择的商品是否为该商家下的所有商品
     */
    checkGoodsLength() {
      let shop = this.cartList.find(v => {
        return v.items.find(m => {
          return m.merchantId === this.selected[0].merchantId
        })
      })
      if(shop.items.length === this.selected.length) {
        this.selectedShop = [shop.merchant.custId];
        this.shopId = shop;
      } else {
        this.selectedShop = [];
        this.shopId = '';
      }
    },
    /**
     * 单击选择商品后修改商品id数组
     */
    selectedChange() {
      let commoIds = []
      this.selected.forEach(item => {
        commoIds.push(item.commoId)
      })
      this.selectedItems = commoIds;
      this.$store.commit('updateCartSelected', { selected: this.selected, shop: this.shopId });
    },
    buyNow() {
      // 没有选择商品不进行下一步
      if(!this.selected.length){
        this.$store.dispatch('showMsgTips', '请选择商品！');
        return;
      }
			// 将选中物品加入到待提交订单vuex中
      let uuid = 'jiusen-order'+(new Date).getTime();
      let shop = this.cartList.find(v => {
        return v.items.find(m => {
          return m.merchantId === this.selected[0].merchantId
        })
      })
      let submitingObj = {
        uuid:uuid,
        goodsData: this.selected,//商品数据
        address:{}, //用户地址
        // jifen: 0, //积分
        // coupon:{}, //优惠券
        // activity:{}, //活动
        shop: shop.merchant, //商家
        promoList:[],
      }
      this.$store.commit('addSubmitingOrder', submitingObj);
      this.$router.push({
        name:'待提交订单',
        query:{
          uuid:uuid
        }
      })
    },
    cartChange(cartData) {
      this.$store.dispatch('cartAdd', {
        type:'change',
        data:[cartData]
      })
      let index = this.selected.findIndex(v => {
        return v.commoId === cartData.commoId
      })
      if(index>=0) {
        this.selected[index].commoNum = cartData.commoNum;
        this.$store.commit('updateCartSelected', { selected: this.selected, shop: this.shopId });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.font-yellow {
  color: #FFA800;
}
.cart-goods{
  padding-bottom: 50px;
}
.cart-shop-list {
  background: #fff;
  padding: 0.2rem 0.2rem 0;
  .cart-shop-checkbox {
    .cart-item-checkbox {
      padding-top: 0;
    }
    .goods-row{
      padding: 0;
    }
    .shop-icon {
      width:.38rem;
      height:.36rem;
    }
    .icon-shop {
      align-self: center;
      color: gray;
    }
  }
}
  .page-cart-list{
    padding: 1px 0;
  }
  .cart-btn-wrapper{
    width: 100%;
    height: 50px;
    line-height: 50px;
    display: flex;
    background-color: #fff;
    left: 0;
    bottom: 50px;
    position: fixed;
    .go-buy-btn{
      flex: 0 0 2.7rem;
      color: #fff;
      background: #34C975;
    }
    .total-price{
      border-top:1px solid rgba(212,212,212,1);
      flex:auto;
    }
  }
  .cart-list-item{
    display: flex;
    .cart-item-checkbox{
      flex: 0 0 32px;
      align-self: center;
    }
   .goods-row{
     flex: auto;
     padding: 0.04rem 0.08rem;
   }
  }
</style>
