<template>
  <div class="goods-comment">
    <div class="goods-comment-type comments-dec">
      <span :class="searchParams.commentType===''&&searchParams.hasPic!=1?'active':''" @click="chooseComments('all')">全部({{commentCount.commentTotal}})</span>
      <span :class="searchParams.commentType===0?'active':''" @click="chooseComments(0)">好评({{commentCount.goodCommentNum}})</span>
      <span :class="searchParams.commentType==1?'active':''" @click="chooseComments(1)">中评({{commentCount.mediumCommentNum}})</span>
      <span :class="searchParams.commentType==2?'active':''" @click="chooseComments(2)">差评({{commentCount.badCommentNum}})</span>
      <span :class="searchParams.hasPic==1?'active':''" @click="chooseComments('hasPic')">带图({{commentCount.hasPicCommentNum}})</span>
    </div>
    <div>
      <div class="comments-dec" v-for="(item, index) in list" :key="index">
        <commentsRow 
          :customer="item.customer"
          :commentType="item.commentType"
          :commentDetails="item.commentDetails"
          :attachPath1Url="item.attachPath1Url||''"
          :attachPath2Url="item.attachPath2Url||''"
          :attachPath3Url="item.attachPath3Url||''"
          :createdDate="item.createdDate"
          :commoNum="item.commentNum" />
          
      </div>
    </div>
    <!--加载更多-->
    <div class="loading-more-box">
      <p class="loading-more" v-if="!hasMore">没有更多</p>
      <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
    </div>
  </div>
</template>

<script>
import CommentsRow from 'components/comments-row'
import LoadingMore from '@/components/base/loading-more'
export default {
  data() {
    return {
      apiGetList: '/commodity/commoComments/list',
      hasMore:false,
      loading:false,
      searchParams: {
        commoId: '',
        commentType: '', // 评价类型(0：好评，1：中评，2：差评)
        hasPic: '', // 是否带图(0：不带图，1：带图)
        page: 1,
        size: 5,
      },
      list: [],
      commentCount: {}
    }
  },
  created() {
    this.searchParams.commoId = this.$route.query.commoId;
    this.getList()
  },
  components: {
    CommentsRow,
    LoadingMore
  },
  methods: {
    getList(isMore) {
      this.loading = true;
      this.$axios.get(this.apiGetList, this.searchParams).then(res => {
        if (isMore && isMore == 'more') {
          this.list = [...this.list, ...res.list];
        } else {
          this.list = res.list;
        }
        this.commentCount = res.commentNum;
        this.hasMore = res.total > this.searchForm.page * this.searchForm.size;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    chooseComments(data) {
      if(typeof data == 'number') {
        this.searchParams.commentType = data;
        this.searchParams.hasPic = '';
      } else if(data === 'hasPic') {
        this.searchParams.commentType = '';
        this.searchParams.hasPic = 1;
      } else {
        this.searchParams.commentType = '';
        this.searchParams.hasPic = '';
      }
      this.searchParams.page = 1;
      this.getList();
    }
  }
}
</script>

<style lang="scss" scoped>
  .comments-dec {
    background: #fff;
    padding: 0 .3rem;
    &:not(:last-child) {
      margin-bottom: .3rem;
    }
  }
  .goods-comment-type {
    padding-top: .3rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    span {
      display: inline-block;
      text-align: center;
      background: #F3F3F3;
      color: #393939;
      width: 1.4rem;
      height: .66rem;
      line-height: .66rem;
      border-radius: .33rem;
      margin-bottom: .3rem;
    }
    .active {
      color: #fff;
      background: #34C975;
    }
  }
</style>
