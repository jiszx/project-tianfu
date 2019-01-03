<template>
  <div class="page-message-center">
    <!--业务消息-->
    <!-- <router-link tag="div" :to="{name:'消息列表',query:{msgType:0}}" class="message-row page-content van-hairline--bottom">
      <div class="message-image">
        <img src="../../assets/images/message/xx-xtxx@2x.png" alt=""><div class="div-radius"></div>
      </div>
      <div class="message-main">
        <div class="message-title">
          <span class="fontsize-30">系统消息</span>
          <span class="gray pull-right fontsize-24">5分钟前</span>
        </div>
        <div class="message-item gray fontsize-26">
          <p class="ellipsis">{{messageYW.lastMessage ? ('订单：' + messageYW.lastMessage)  : '暂无内容'}}</p>
        </div>
      </div>
    </router-link> -->

    <router-link tag="div" :to="{name:'消息列表',query:{msgType:0}}" class="message-row page-content van-hairline--bottom">
      <div class="message-image">
        <img src="../../assets/images/message/xx-xtxx@2x.png" alt=""><div class="div-radius" v-if="isUnreadMsg"></div>
      </div>
      <div class="message-main">
        <div class="message-title">
          <span class="fontsize-30">系统消息</span>
          <span class="gray pull-right fontsize-24">{{messageList.length&&messageList[0].createdDate?$mUtils.formatDate(messageList[0].createdDate):''}}</span>
        </div>
        <div class="message-item gray fontsize-26">
          <p class="ellipsis">{{messageList.length&&messageList[0].notifyContent?messageList[0].notifyContent : '暂无内容'}}</p>
        </div>
      </div>
    </router-link>

    <!--促销通知-->
    <!-- <router-link tag="div" :to="{name:'消息中心',query:{msgType:1}}" class="message-row page-content van-hairline--bottom">
      <div class="message-image">
        <img src="../../assets/images/message/xx-tp1@2x.png" alt="">
      </div>
      <div class="message-main">
        <div class="message-title">
          <span>久森农业</span>
          <span class="gray pull-right fontsize-24">一天前</span>
        </div>
        <div class="message-item gray fontsize-24">
          <p class="ellipsis">{{messageCX.lastMessage || '暂无内容'}}</p>
        </div>
      </div>
    </router-link> -->

    <!--系统公告-->
    <!-- <router-link tag="div" :to="{name:'消息中心',query:{msgType:2}}" class="message-row page-content van-hairline--bottom">
      <div class="message-image">
        <img src="../../assets/images/message/xx-tp1@2x.png" alt="">
      </div>
      <div class="message-main">
        <div class="message-title">
          <span>张二娃</span>
          <span class="gray pull-right fontsize-24">一天前</span>
        </div>
        <div class="message-item gray fontsize-24">
          <p class="ellipsis">{{messageXT.lastMessage || '暂无内容'}}</p>
        </div>
      </div>
    </router-link> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "message-center",
  data() {
    return {
      isUnreadMsg: true
    }
  },
  computed: {
    ...mapState({
      messageList: state => state.message.messageList,
      unreadMsg: state => state.message.unreadMsg
    }),
    messageYW() {
      let msg = this.messageList.find(v => {
        return v.msgType === 0;
      })
      return msg || {}
    },
    messageCX() {
      let msg = this.messageList.find(v => {
        return v.msgType === 1;
      })
      return msg || {}
    },
    messageXT() {
      let msg = this.messageList.find(v => {
        return v.msgType === 2;
      })
      return msg || {}
    }
  },
  created(){
    this.$store.dispatch('messageGetList');
    this.$store.dispatch('unreadMessage');
    console.log(this.unreadMsg,525)
    this.isUnreadMsg = this.unreadMsg > 0 ? true : false;
  },
  methods: {
    /**
     * 获取APP消息列表数据
     */
    getData() {
      this.$axios.get(this.api_get_data)
        .then(res => {
          this.messageList = res.list;
          this.msgList = this.messageList[0];
        }).catch(() => {
          //
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.message-row{
  display: flex;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  background: #fff;
  .message-image{
    flex:0 0 1.08rem;
    height: 1.08rem;
    width: 1.08rem;
    position: relative;
    .div-radius{
      width: 8px;
      height: 8px;
      border-radius: 8px;
      background: red;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .message-main{
    flex: auto;
    padding-left: 0.3rem;
    .message-title{
      padding-bottom: 0.1rem;
      .gray{
        color: #C1C1C1;
        padding-top: 0.04rem;
      }
    }
  }
}
</style>
