<template>
  <div class="components-message-row">
    <van-cell @click="readMsgClick" class="message-info van-hairline--bottom paddingB20 paddingT20">
      <span class="van-cell-text gray fontsize-20">{{time}}</span>
      <p class="fontsize-28 paddingB10">{{message}}</p>
    </van-cell>
  </div>
</template>

<script>
import { Cell } from 'vant'
export default {
  name: "message-row",
  props: {
    message: String,
    time: String
  },
  data() {
    return {

    }
  },
  components: {
    'van-cell': Cell
  },
  methods: {
    readMsgClick() {
      this.$emit('read-Msg');
    }
  }
}
</script>

<style scoped>
</style>
<style lang="scss">
  .components-message-row{
    .van-cell{
      padding: 0.28rem 0.3rem;
      border-bottom: 0.02rem solid #eee;
      .van-cell__right-icon{
        line-height: 53px;
      }
    }
  }
</style>
