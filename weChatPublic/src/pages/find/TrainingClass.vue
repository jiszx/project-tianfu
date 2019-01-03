<template>
  <div class="page-trainingClass">
    <van-cell-group class="training-search">
      <div class="selection" @click="openSelect = !openSelect">
        {{activeName}}
        <img src="../../assets/images/trainning/pxkt-xl@2x.png" alt="">
      </div>
      <van-field
        class="search-input"
        left-icon="search"
        v-model="formData.keyword"
        @keyup.enter.native='getList'
        placeholder="请输入你要找的课程名称"
      />
    </van-cell-group>
    <div v-if="openSelect" class="search-item text-center">
      <div v-for="(item, index) in searchType" :key="index">
        <span :class="activeName === item?'active':''" @click="chooseSelect(item)">{{item}}</span>
      </div>
    </div>
    <div v-if="listData.length" class="trainning-class" v-for="(item, index) in listData" :key="index" @click="goDetail(item)">
      <p>{{item.courseTitle}}</p>
      <img :src="item.courseAttachPathUrl" alt="">
    </div>
    <!--加载更多-->
    <div class="loading-more-box">
      <p class="loading-more" v-if="!hasMore">没有更多</p>
      <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
    </div>
  </div>
</template>

<script>
import { CellGroup, Field, Icon } from 'vant';
import LoadingMore from '@/components/base/loading-more'
export default {
  data() {
    return {
      apiList: '/found/courses/list',
      hasMore: true,
      loading: false,
      formData: {
        page: 1,
        size: 5,
        keyword: '',
        courseType: ''
      },
      openSelect: false,
      activeName: '全部',
      searchType: ['全部','科研','劳保','植保','仓储','加工','农机'],
      listData: []
    }
  },
  computed: {
   
  },
  components: {
    'van-cell-group': CellGroup,
    'van-field': Field,
    'van-icon': Icon,
    LoadingMore,
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getList(isMore) {
      this.$axios.get(this.apiList, this.formData).then(res => {
        if (isMore && isMore == 'more') {
          this.listData = [...this.listData, ...res.list];
        } else {
          this.listData = res.list;
        }
        this.hasMore = res.pages > res.page;
        this.loading = false;
      }).catch((err) => {
        this.loading = false;
      })
    },
    chooseSelect(name) {
      this.activeName = name;
      this.formData.courseType = name==='全部'?'':name;
      this.formData.page = 1;
      this.openSelect = false;
      this.getList();
    },
    goDetail(data) {
      this.$router.push({name: '课程详情', query: {tranning: data.courseId}})
    },
    /**
     * 加载更多方法
     */
    loadingMore () {
      this.formData.page++;
      this.getList('more');
    }
  }
}
</script>

<style lang="scss" scoped>
.page-trainingClass {
  position: relative;
  padding-bottom: 0;
  min-height: 100%;
}
.training-search {
  display: flex;
  align-items: center;
  padding: 0 0.14rem;
  .selection {
    width: 55px;
    flex-shrink: 0;
    font-size: 13px;
    text-align: center;
    img {
      width: 0.18rem;
    }
  }
  .search-input {
    margin: 8px;
    border-radius: 5px;
    height: 36px;
    padding: 7px 15px;
    border-radius: 28px;
    background: #F5F5F5;
  }
}
.search-item {
  position: absolute;
  background: #fff;
  padding: 0.3rem 0.2rem;
  left: 0;
  right: 0;
  bottom: 0;
  top: 52px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  div {
    width: 25%;
    margin-top: 20px;
  }
  span {
    padding: 4px 20px 5px;
    border: 1px solid rgb(212, 212, 212);
    border-radius: 7px;
    display: inline-block;
  }
  .active {
    padding: 5px 20px 6px;
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
</style>
