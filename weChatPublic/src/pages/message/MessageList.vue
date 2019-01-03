<template>
  <div class="page-seevice-message">
    <messageRow
      v-for="(item, index) in messageList"
      :key="index"
      :message="item.notifyContent"
      :time="$mUtils.formatDate(item.createdDate)"
      @read-Msg="readMsg(item)"
    />
    <!--加载更多-->
    <div class="loading-more-box">
      <p class="loading-more" v-if="!hasMore">没有更多</p>
      <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import messageRow from 'components/message-row'
import LoadingMore from '@/components/base/loading-more'
export default {
  name: "service-message",
  data() {
    return {
      apiNotifyList: '/message/notifies/list', // 11.1. APP系统消息列表
      apiUpdateNotify: '/message/notifies/updateNotify', // 11.3. 修改系统消息状态
      hasMore:true,
      loading:false,
      searchForm:{
        page: 1,
        size: 10
      },
      messageList:[]
    }
  },
  computed: {},
  components: {
    LoadingMore,
    messageRow
  },
  created() {
    this.getData();//获取消息列表数据
  },
  methods: {
    /**
     * 获取消息列表数据
     */
     getData(isMore) {
      this.loading = true;
      this.$axios.get(this.apiNotifyList, this.searchForm)
        .then(res => {
          if (isMore && isMore == 'more') {
            this.messageList = [...this.messageList, ...res.list];
          } else {
            this.messageList = res.list
          }
          this.hasMore = res.total > this.searchForm.page * this.searchForm.size;
          this.loading = false;
        }).catch(() => {
          
        })
    },
    /**
     * 加载更多方法
     */
    loadingMore () {
      this.searchForm.page++;
      this.getData('more');
    },
    /**
    阅读消息
    */
   readMsg(item) {
     console.log('读取消息',item)
     this.$axios.post(this.apiUpdateNotify,{notifyId:item.notifyId})
      .then(res => {
        this.$router.push({name: '订单详情', query: {orderData: item.orderId}})
      })
   }
  }
}
</script>
<style scoped>
</style>