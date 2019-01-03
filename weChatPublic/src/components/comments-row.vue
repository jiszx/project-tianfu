<template>
  <div class="goods-comments-info">
    <div class="goods-comments-cust">
      <div class="comment-box">
        <div class="cust-img">
          <img :src="customer.custAvatarUrl" alt="">
        </div>
        <span>{{customer.custName}}</span>
      </div>
      <div class="comment-box">
        <div>
          <img v-if="commentType == 0" src="../assets/images/order/fbpj-hp-1.png" alt="">
          <img v-if="commentType == 1" src="../assets/images/order/fbpj-zp-2.png" alt="">
          <img v-if="commentType == 2" src="../assets/images/order/fbpj-cp-2.png" alt="">
        </div>
        <span>{{commentType == 2 ? '差评' : commentType == 0? '好评' : '中评'}}</span>
      </div>
    </div>
    <div class="goods-comments-coment">
      <p>{{commentDetails}}</p>
      <div>
        <img v-if="attachPath1Url" :src="attachPath1Url" alt="">
        <img v-if="attachPath2Url" :src="attachPath2Url" alt="">
        <img v-if="attachPath3Url" :src="attachPath3Url" alt="">
      </div>
      <div class="comment-time">
        <span v-if="createdDate" class="gray fontsize-24">{{$mUtils.formatDate(createdDate)}}</span>
        <span class="gray fontsize-24">购买数量： X{{commoNum||0}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customer: Object,
    commentType: [String, Number],
    commentDetails: String,
    attachPath1Url: String,
    attachPath2Url: String,
    attachPath3Url: String,
    commoNum: [String, Number],
    createdDate: [String, Number],
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.goods-comments-cust {
  padding: .3rem 0 .2rem;
  display: flex;
  justify-content: space-between;
  .comment-box {
    display: flex;
    align-items: center;
    img {
      height: .50rem;
      width: .50rem;
      margin-right: 8px;
    }
    .cust-img {
      height: .64rem;
      width: .64rem;
      flex: 0 0 .64rem;
      border-radius: .32rem;
      margin-right: 8px;
      overflow: hidden;
      img {
        width: .64rem;
        height: 100%;
      }
    }
  }
}
.goods-comments-coment {
  padding: 1px 0 .3rem;
  p {
    margin: .2rem 0 .3rem;
  }
  img {
    width: 1.8rem;
  }
  .comment-time {
    margin: .3rem 0 0;
    display: flex;
    justify-content: space-between;
  }
}
</style>
