<template>
  <div class="page-purchasing-pubic">
    <van-cell-group class="purchasing-search" :class="isSearch?'search-state':''">
      <p class="p-color-green text-center fontsize-36">选择你想要的货</p>
      <van-field
        class="search-input"
        left-icon="search"
        v-model="searchForm.keyword"
        type="search"
        placeholder="请输入你要找的课程名称"
        @input='getSearchKeyword'
      />
    </van-cell-group>
    <div v-if="isSearch" class="search-page">
      <van-cell
        v-for="item in searchType"
        :key="item.commoTyId"
        :title="item.commoTyPathName"
        @click="editPurchasInfo(item)"
      />
      <!--加载更多-->
      <div class="loading-more-box">
        <p class="loading-more" v-if="!hasMore">没有更多</p>
        <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
      </div>
    </div>
    <div class="out_box">
      <div v-for="(item, index) in listData" class="purchasing-item" :key="index">
        <p class="p-color-green">{{item.commoTyName}}</p>
        <div class="purchasing-class">
          <div v-for="(child, index) in item.children" :key="index">
            <span :class="activeName === child.commoTyName?'active':'gray'" @click="chooseSelect(child)">{{child.commoTyName}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CellGroup, Field, Icon, Cell } from 'vant';
import LoadingMore from '@/components/base/loading-more'
export default {
  data() {
    return {
      apiList: '/commodityTypes/all',
      apiTypeInput: '/commodity/commodityTypes/search', // 搜索框搜索
      hasMore: true,
      loading: false,
      formData: {
        page: 1,
        size: 5,
        courseType: ''
      },
      searchForm: {
        keyword: '',
        page: 1,
      },
      isSearch: false,
      activeName: '',
      searchType: [],
      listData: [],
    }
  },
  computed: {
   
  },
  components: {
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-field': Field,
    'van-icon': Icon,
    LoadingMore
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getList() {
      this.$axios.get(this.apiList).then(res => {
        this.listData = res.list;
      })
    },
    chooseSelect(data) {
      this.activeName = data.commoTyName;
      this.$router.push({name: '采购发布', query: {commoData: data, type: 'new'}})
    },
    editPurchasInfo(data) {
      this.$router.push({name: '采购发布', query: {commoData: data, type: 'edit'}})
    },
    getSearchKeyword(isMore) {
      if(this.searchForm.keyword) {
        this.isSearch = true;
        this.loading = true;
        this.$axios.get(this.apiTypeInput, this.searchForm).then(res => {
          if (isMore && isMore == 'more') {
            this.searchType = [...this.searchType, ...res.list];
          } else {
            this.searchType = res.list;
          }
          this.hasMore = res.pages > res.page;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      } else {
        this.isSearch = false;
        this.searchType = [];
      }
    },
    /**
     * 加载更多方法
     */
    loadingMore () {
      this.searchForm.page++;
      this.getSearchKeyword('more');
    }
  }
}
</script>

<style lang="scss" scoped>
.page-purchasing-pubic {
  position: relative;
}
.p-color-green {
  color: #34C975;
}
.purchasing-search {
  background: #fff;
  padding: 0.5rem 0.46rem 0.36rem;
  .search-input {
    margin-top: 0.4rem;
    border-radius: 5px;
    // height: 40px;
    border-radius: 8px;
    background: rgba(250,250,250,1);
  }
}
.search-page {
  background: #fff;
  position: fixed;
  overflow: auto;
  left: 0;
  right: 0;
  bottom: 0;
  top: 2.6rem;
  border-top: 1px solid rgba(250,250,250,1);
}
.purchasing-item {
  padding: 0.5rem 0 0.3rem 0.3rem;
  .purchasing-class{
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    div {
      text-align: left;
      width: 25%;
      margin-top: 14px;
    }
  }
  span {
    padding: 5px 0 6px;
    width: 88%;
    text-align: center;
    border: 1px solid rgba(212, 212, 212, 1);
    background: #fff;
    border-radius: 7px;
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .active {
    background: #34C975;
    color: #fff;
    border: none;
  }
}
.trainning-class {
  margin-top: 10px;
  padding: 0.32rem;
  background: #fff;
  p {
    font-size: 0.3rem;
    margin-bottom: 0.3rem;
  }
  img {
    width: 100%;
    max-height: 340px;
  }
}
.out_box {
  padding-bottom: .6rem;
}
.search-state {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2.62rem;
}
</style>
