<template>
  <div class="shop-list-page">
    <div v-if="!$route.query.type || $route.query.type != 'focus'">
      <div class="shop-search">
        <van-field
          class="search-input"
          left-icon="search"
          v-model="formData.keyword"
          @keyup.enter.native='getList'
          placeholder="请输入商家名称"
        />
      </div>
      <div v-for="(item, index) in listData" :key="index" class="shop-list van-hairline--top-bottom">
        <ShopRow :company="item" :type="$route.query.type||''" @changeFocus="changeFocus"/>
      </div>
    </div>
    
    <div v-else>
      <!-- 无订单 -->
      <div class="no_order" v-if="$route.query.type && $route.query.type == 'focus' && listData.length == 0">
        <img src="../../assets/images/order/wddd-kong.png" alt="">
      </div>
      <div v-else>
        <van-swipe-cell :ref="'swipe'+index" :right-width="105" :on-close="onClose" v-for="(item, index) in listData" :key="index" class="shop-list van-hairline--top">
          <van-cell-group>
            <van-cell>
              <template>
                <ShopRow :company="item" :type="$route.query.type||''"/>
              </template>
            </van-cell>
          </van-cell-group>
          <span slot="right" @click="checkItem(item, index)">取消关注</span>
        </van-swipe-cell>
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
import { Tab, Tabs, Field, CellGroup, Cell, SwipeCell } from 'vant';
import LoadingMore from '@/components/base/loading-more'
import ShopRow from '@/components/shop-row'
export default {
  data() {
    return {
      apiList: 'user/customers/merchants',
      apiFocus: '/user/custFollows/list',
      apiCancel: '/user/custFollows/attention',
      apiUrl: '',
      hasMore:true,
      loading:false,
      formData: {
        page: 1,
        size: 10
      },
      focusItem: '',
      listData: []
    }
  },
  components: {
    'van-tabs': Tabs,
    'van-tab': Tab,
    'van-field': Field,
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-swipe-cell': SwipeCell,
    LoadingMore,
    ShopRow
  },
  created() {
    if(this.$route.query.type && this.$route.query.type == 'focus') {
      this.apiUrl = this.apiFocus;
    } else this.apiUrl = this.apiList;
    this.getList();
    // console.log($route.query.type && $route.query.type == 'focus' && listData.length == 0)
  },
  methods: {
    getList(isMore) {
      this.loading = true;
      this.$axios.get(this.apiUrl, this.formData).then(res => {
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
    /**
     * 取消/加关注
     */
    changeFocus(data) {
      if(data == true) {
        this.getList();
      }
    },
    /**
     * 滑动取消关注
     */
    checkItem(data, index) {
      this.focusItem = index;
    },
    onClose(clickPosition, instance) {
      this.$axios.post(this.apiCancel, {flag: 0, merchantId: this.listData[this.focusItem].custId})
        .then(res => {
          this.listData.splice(this.focusItem, 1);
          this.$toast('取消关注成功！');
          instance.close();
        })
    },
    /**
     * 取消操作
     */
    focusCompany(obj, fn){
      this.$axios.post(this.focus_cus_url,{
        merchantId: obj.custId,
        flag: 0
      })
      .then(res=>{
        if(fn) fn();
        this.getList();
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .shop-search {
    // background: #fff;
    padding: 10px .3rem;
    .search-input {
      border-radius: 5px;
      height: 33px;
      padding: 5.4px 15px;
      border-radius: 28px;
      background: #fff;
    }
  }
  .shop-list {
    background: #fff;
  }
  .no_order{
    text-align: center;
    margin-top:36%;
    img{
      width:2.74rem;
      height:2.64rem;
      transform: translateX(.3rem)
    }
  }
</style>
