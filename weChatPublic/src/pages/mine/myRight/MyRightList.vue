<template>
  <div class="page-right-list">
    <div class="no_order" v-if="rightList.length == 0">
      <img src="../../../assets/images/order/wddd-kong.png" alt="">
    </div>
    <div v-else>
      <van-cell-group>
        <van-cell 
          v-for="(item, index) in rightList" 
          :key="index" title="订单号" 
          value="查看详情" 
          size="large" 
          is-link :label="item.orderNumber"
          @click="toDetails(item)" />
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
import { Cell, CellGroup } from 'vant';
import LoadingMore from '@/components/base/loading-more'
export default {
  data() {
    return {
      api_get_data: '/order/orderRights/myOrderRights',// 10.2. 我的维权列表
      hasMore:true,
      loading:false,
      searchForm:{
        page: 1,
        size: 10
      },
      rightList:[]
    }
  },
  components: {
    LoadingMore,
    'van-cell-group': CellGroup,
    'van-cell': Cell
  },
  created() {
    this.getData();
  },
  methods: {
    /**
     * 获取数据
     */
    getData(isMore) {
      this.loading = true;
      this.$axios.get(this.api_get_data)
        .then(res => {
          // console.log(res.list,123)
          if (isMore && isMore == 'more') {
            this.rightList = [...this.rightList, ...res.list];
          } else {
            this.rightList =  res.list || [];
          }
          this.hasMore = res.pages > res.page;
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
    /**
     *跳转维权详情 
     */
    toDetails(rowData) {
      this.$router.push({name:'维权详情',query:{orderRightId:rowData.orderRightId}});
    }
  }
}
</script>

<style lang="scss" scoped>
.page-right-list{
  height: 100%;
}
</style>
<style lang="scss">
  /* 我的维权列表 */
  .page-right-list{
    .van-cell-group{
      .van-cell{
        padding-top: 0.38rem;
        padding-bottom: 0.38rem;
        border-bottom: 0.02rem solid #D4D4D4;
        .van-cell__title{
          color: #939393;
          font-size: 0.26rem;
          .van-cell__label{
            color: #313131;
            font-size: 0.24rem;
            padding-top: 0.1rem;
          }
        }
        .van-cell__value{
          color: #939393;
          font-size: 0.24rem;
          line-height: 0.84rem;
        }
        .van-cell__right-icon{
          color: #939393;
          font-size: 0.26rem;
          line-height: 0.86rem;
        }
      }
      .van-cell:not(:last-child)::after{
        border-bottom: none;
      }
    }
  }
</style>

