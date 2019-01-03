<template>
  <div class="news-page">
    <div class="news-header">
      <van-tabs @click="onClick">
        <van-tab title="协农新闻"></van-tab>
        <van-tab title="行业动态"></van-tab>
        <van-tab title="政策法规"></van-tab>
      </van-tabs>
      <div class="news-search">
        <van-field
          class="search-input"
          left-icon="search"
          v-model="formData.keyword"
          @keyup.enter.native='getList'
          placeholder="请输入你要找的文章名称"
        />
      </div>
    </div>
    <div class="news-list">
      <van-cell-group>
        <van-cell @click="goNewsDetails(item)" v-for="(item, index) in listData" :key="index">
          <template slot="title">
            <div class="trade_box">
              <img :src="item.newsImagePathUrl" alt="">
              <div class="info_box">
                <p style="-webkit-box-orient: vertical;">{{item.newsTitle}}</p>
                <span style="-webkit-box-orient: vertical;" v-html="item.newsIntro"></span>
              </div>
            </div>              
          </template>
        </van-cell>       
      </van-cell-group> 
      <!--加载更多-->
      <div class="loading-more-box">
        <p class="loading-more" v-if="!hasMore">没有更多</p>
        <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs, Field, CellGroup, Cell } from 'vant';
import LoadingMore from '@/components/base/loading-more'
export default {
  data() {
    return {
      apiList: '/operation/news/list',
      hasMore:true,
      loading:false,
      formData: {
        keyword: '',
        newsType: '0', // 新闻类型(0：协农新闻，1：行业动态，2：政策法规)
        page: 1,
        size: 10,
      },
      listData: []
    }
  },
  components: {
    'van-tabs': Tabs,
    'van-tab': Tab,
    'van-field': Field,
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    LoadingMore
  },
  created() {
    this.getList();
  },
  methods: {
    onClick(index, title) {
      if(this.formData.newsType != index) {
        this.formData.newsType = index;
        this.formData.keyword = '';
        this.getList();
      }
    },
    getList(isMore) {
      this.loading = true;
      this.$axios.get(this.apiList, this.formData).then(res => {
        if (isMore && isMore == 'more') {
          this.listData = [...this.listData, ...res.list];
        } else {
          this.listData = res.list;
        }
        this.hasMore = res.pages > res.page;
        this.loading = false;
      })
    },
    /**
     * 加载更多方法
     */
    loadingMore () {
      this.formData.page++;
      this.getList('more');
    },
    goNewsDetails(data) {
      this.$router.push({ name: '动态详情', query: { tranning: data.newsId, type: 'news' }})
    }
  }
}
</script>

<style lang="scss" scoped>
.news-header {
  position: fixed;
  width: 100%;
  z-index: 999;
}
.news-list {
  margin-top: 97px;
}
.news-search {
  background: #fff;
  padding: 10px .3rem;
}
  .search-input {
    border-radius: 5px;
    height: 33px;
    padding: 5.4px 15px;
    border-radius: 28px;
    background: #F2F6F9;
  }
  .trade_box{
    display: flex;
    width:100%;
    img{
      flex:0 0 1.6rem;
      width:1.64rem;
      height:1.6rem;
    }
    .info_box{
      flex:1;
      padding: .1rem 0 .1rem .40rem;
      width: 0;
      p{
        margin-bottom: .10rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span{
        color:RGBA(147, 147, 147, 1);
        line-height: .38rem;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;       
        font-size: 0.26rem;   
      }
    }
   }
</style>
