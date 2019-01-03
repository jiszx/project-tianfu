<template>
  <div class="page-right-details">
    <van-cell-group>
      <van-cell title="您维权的订单号：" :value="rightDetails.orderNumber" />
      <van-cell class="describe" title="问题描述：" :value="rightDetails.rightInfo" />
      <van-cell class="voucher" v-if="rightDetails.attachPath1Url||rightDetails.attachPath2Url">
        <template slot="title">
          <span>凭证：</span>
        </template>
        <div class="img-list">
          <img @click="seeImg(rightDetails.attachPath1Url)" v-if="rightDetails.attachPath1Url" :src="rightDetails.attachPath1Url" alt="">
          <img @click="seeImg(rightDetails.attachPath2Url)" v-if="rightDetails.attachPath2Url" :src="rightDetails.attachPath2Url" alt="">
        </div>
      </van-cell>
    </van-cell-group>
    <van-popup v-model="show"><img :src="showImg" alt=""></van-popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Popup } from 'vant';
export default {
  data() {
    return {
      api_get_data: '/order/orderRights/info',// 10.3. 维权详情
      orderRightId:this.$route.query.orderRightId,
      show: false,
      showImg: '',
      rightDetails:{},
      defaultImg: require('../../../assets/images/mine/userInfo/mdxz-pt2@2x.png')
    }
  },
  components: {
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-popup': Popup
  },
  created() {
    this.getData();
  },
  methods: {
    /**
     * 获取数据
     */
    getData() {
      this.$axios.get(this.api_get_data,{orderRightId:this.orderRightId})
        .then(res => {
          this.rightDetails = res;
        })
    },
    seeImg(data) {
      console.log(data)
      this.show = true;
      this.showImg = data;
    }
  }
}
</script>

<style lang="scss" scoped>
.page-right-details{
  height: 100%;
}
</style>
<style lang="scss">
  /* 我的维权详情 */
  .page-right-details{
    .van-cell-group{
      margin-top: 0.24rem;
      .van-cell{
        color: #939393;
        font-size: 0.26rem;
        border-bottom: 0.02rem solid #D4D4D4;
        .van-cell__title{
          max-width: 2.1rem;
        }
        .van-cell__value{
          text-align: left;
        }
      }
      .describe{
        font-size: 0.28rem;
        color: #313131;
        min-height: 2.44rem;
        border-bottom:none;
        .van-cell__title {
          max-width: 1.4rem;
        }
      }
      .voucher{
        font-size: 0.28rem;
        color: #313131;
        border-bottom:none;
        .van-cell__title {
          max-width: 1.4rem;
        }
        .van-cell__value{
          border-top: 0.02rem solid #D4D4D4;
          .img-list{
            padding: 0.2rem 0;
            img{
              max-width: 1.8rem;
              max-height: 1.8rem;
              padding-right: 0.2rem;
            }
          }
        }
      }
      .van-cell:not(:last-child)::after{
        border-bottom:none;
      }
    }
  }
</style>

