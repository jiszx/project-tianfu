<template>
  <div class="page-search-goods">
    <div class="search-wrapper" ref="searchWrapper">
      <searchBar @search="search" @scan="search" page="searchGoods" :placeholder="searchForm.keyword" />
    </div>
    <!-- 供应大厅商品列表 -->
    <div class="search-list-wrapper">
      <goodsListRow
        class="van-cell"
        v-for="(item, index) in commodityList"
        :key="index"
        :commoAttachPathUrl="item.commoAttachPathUrl"
        :commoId="item.commoId"
        :commoName="item.commoName"
        :commoPrice="item.commoPrice"
        :commoUnit="item.commoUnit"
        :commoSales="item.commoSales"
        :customer="item.customer"
      />
      <!--加载更多-->
      <div class="loading-more-box">
        <p class="loading-more" v-if="!hasMore">没有更多</p>
        <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
      </div>
    </div>
    <!-- <ul>
      <li v-for="(item,index) in commodityList" :key="index" @click="linkToDetail(item)">{{item.commoName}}</li>
    </ul> -->
  </div>
</template>

<script>
import searchBar from 'components/search-bar'
import goodsListRow from 'components/goodsList-row'
import LoadingMore from '@/components/base/loading-more'
export default {
  data () {
    return {
      api_get_commodity:'/commodity/commodities/list',//7.2. 商品信息列表
      searchForm: {
        keyword:'',
        page: 1,
        size: 20
      },
      hasMore: false,
      loading: false,
      commodityList:[]
    }
  },
  components: {
    searchBar,
    goodsListRow,
    LoadingMore
  },
  created () {
    
  },
  methods: {
    /**
     *  搜索方法
     */
    search(keywords) {
      this.searchForm.keyword = keywords;
      this.commodityList = [];
      this.searchForm.page = 1;
      this.getData();
    },
    /**
     * 获取商品列表数据
     */
    getData(isMore) {
      this.loading = true;
      this.$axios.get(this.api_get_commodity, this.searchForm)
        .then(res => {
          if (isMore && isMore == 'more') {
            this.commodityList = [...this.commodityList, ...res.list];
          } else {
            this.commodityList = res.list
          }
          this.hasMore = res.total > this.searchForm.page * this.searchForm.size;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
    },
    /**
     * 加载更多方法
     */
    loadingMore () {
      this.searchForm.page++;
      this.getData('more');
    },
  }
}
</script>

<style lang="scss" scoped>
  .page-search-goods{
    // background: #fff;
    height: 100%;
    // overflow-y: auto;
    .search-wrapper {
      // position: fixed;
      // top: 0;
      // width: 100%;
      // z-index: 99;
      background: #fff;
    }
    .search-list-wrapper{
      border-top: 1px solid #d4d4d4;
      height: 100%;
      padding-bottom: 70px;
      overflow-y: auto;
    }
  }
</style>
