/**
封装一个搜索区域组件
事件：
search: 搜索事件
*/
<template>
  <div class="components-search-bar">
    <div class="components-search-bar-inner" :class="{historyShow:historyShow}">
      <div class="selection" v-if="page&&page == 'index'" @click="()=> showBrandDrag=true">
        {{addrCountyName||'全国'}}
        <img src="../assets/images/trainning/pxkt-xl@2x.png" alt="">
      </div>
      <div class="search-input">
        <van-search
          v-model="searchText"
          :placeholder="searchText || '搜索'"
          background="#fff"
          @search="onSearch"
          @focus="inputFocus"
          @blur="inputBlur"
          class="search-input-inner van-hairline--surround"
        />
      </div>
      <div class="scan-bar" @click="onClickGoodsCartBtn" v-if="page != 'searchGoods'">
        <div class="info-num" v-if="cartTotalNum">{{cartTotalNum}}</div>
        <div class="info-num" v-else></div>
      </div>
      <div class="to-index" v-if="page&&page == 'searchGoods'" @click="toIdex">取消</div>
    </div>
    <div class="search-history page-content" :class="{historyShow:historyShow}">
      <ul>
        <li>
          <span class="inline-block paddingR10">
            <img src="../assets/images/goods/icon-shizhong.png" alt="">
          </span>
          搜索历史
        </li>
        <li v-for="(item, index) in history" :key="index" class="page-content">
          <div class="history-item" @click="historySearch(item)">{{item}}</div>
        </li>
        <li class="page-content" v-if="!history.length">
          <span class="gray">暂无历史记录</span>
        </li>
        <li class="text-center" @click="emptyHistory">
          <div class="del-history-btn red">清除搜索记录</div>
        </li>
      </ul>
    </div>
    <div class="search-mask" :class="{historyShow:historyShow}"></div>
    <!--行政区域组件-->
    <areaPopup v-model="showBrandDrag" @confirm="areaConfirm"></areaPopup>
  </div>
</template>

<script>
import { Search, Icon, Field } from 'vant';
import { mapState } from 'vuex'
import areaPopup from 'components/area-popup'
export default {
  props:{
    placeholder: String,
    page: String
  },
  data () {
    return {
      searchText:'',
      historyShow:false,
      showBrandDrag: false,
      addrCountyName: '',
      areaCode: ''
    }
  },
  computed: {
    ...mapState({
      history: state => state.goods.searchHistory,
      cartTotalNum: state => state.cart.totalNum,
    })
  },
  components: {
    'van-search': Search,
    'van-icon': Icon,
    'van-field': Field,
    areaPopup
  },
  created(){
    this.$store.dispatch('cartGetList');
  },
  created(){
    this.$store.dispatch('cartGetList');
  },
  mounted() {
    this.searchText = this.placeholder;
  },
  methods: {
    /**
     * 跳转购物车
     */
    onClickGoodsCartBtn () {
      this.$router.push({name:'购物车'});
    },
    /**
     * 搜索
     */
    onSearch () {
      if(this.page && this.page == 'index') this.$emit('search', {
        searchText: this.searchText || '',
        areaCode: this.areaCode
      })
      else this.$emit('search', this.searchText || '')
      this.$store.commit('searchAddHistory', this.searchText || '');
    },
    /* 单击输入框获取到焦点 */
    inputFocus() {
      if(this.page && this.page == 'index')
      this.historyShow = false,
      this.$router.push({name:'商品搜索'});
      else this.historyShow = true;
    },
    inputBlur() {
      this.historyShow = false;
    },
    historySearch(item) {
      this.searchText = item;
      this.onSearch()
    },
    emptyHistory() {
      this.historyShow = false;
      this.$store.commit('searchEmptyHistory');
    },
    areaConfirm(val) {
      this.areaCode = val[2] ? val[2].code : '';
      this.addrCountyName = val[2] ? val[2].name : '';
      this.$emit('search', {
        searchText: this.searchText || '',
        areaCode: this.areaCode
      })
    },
    /* 商品搜索取消返回首页 */
    toIdex() {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
.components-search-bar-inner{
  position: relative;
  display: flex;
  padding: 0.2rem 0.3rem 0.2rem;
  height: 1rem;
  z-index: 30;
  &.historyShow{
    background: #fff;
  }
  .selection {
    width: auto;
    flex-shrink: 0;
    font-size: 13px;
    line-height: 30px;
    padding-right: 10px;
    text-align: left;
    color: #6a6a6a;
    img {
      width: 0.18rem;
    }
  }
  .search-input{
    flex:1;
    padding-right: 0.2rem;
    .search-input-inner{
      border-radius: 0.64rem;
      overflow: hidden;
    }
    .search-input-inner::after{
      border-radius: 0.64rem;
      background: rgba(255, 255, 255, .15) !important;
    }
  }
  .to-index{
    line-height: 30px;
  }
  .scan-bar{
    flex: 0 0 0.5rem;
    position: relative;
    .info-num{
      position: absolute;
      right: 0;
      top: -8px;
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      font-family: PingFang SC,Helvetica Neue,Arial,sans-serif;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 0 3px;
      min-width: 16px;
      line-height: 14px;
      border: 1px solid #fff;
      border-radius: 16px;
      background-color: #f44;
      -webkit-transform: translateX(50%);
      transform: translateX(50%);
      -webkit-transform-origin: 100%;
      transform-origin: 100%;
    }
  }
}
.scan-bar{
  width: 0.5rem;
  height: 0.42rem;
  background: url(../assets/images/goods/icon-gwc@2x.png);
  background-repeat:no-repeat;
  background-size:100% 100%;
  margin-top: 0.1rem;
}
.search-history{
  display: none;
  position: absolute;
  left: 0;
  top: 1rem;
  width: 100%;
  line-height: 0.8rem;
  background: #fff;
  z-index: 30;
  transition: all 0.28s;
  // border-top: 1px solid lightgrey;
  &.historyShow{
    display: block;
  }
  li{
    span{
      img{
        max-width: 18px;
        max-height: 18px;
        vertical-align: sub;
      }
    }
  }
}
  .search-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0, .4);
    z-index: 29;
    display: none;
    transition: all 0.28s;
    &.historyShow{
      display: block;
    }
  }
</style>
<style>
  .search-input .van-cell{
    line-height: 19px;
    background: #f2f6f9;
  }
  .components-search-bar .search-input-inner, .components-search-bar .search-input-inner{
    background: rgba(255, 255, 255, .15) !important;
  }
  .search-input .van-search{
    padding: 0;
  }
  .page-index .search-input ::-webkit-input-placeholder{
    color: #000;
  }
  .page-index .search-input .van-icon-search{
    color: #000;
  }
  .search-input .van-cell__value .van-field__control{
    height: 24px;
    line-height: 24px;
  }
  .page-index .search-input .van-search .van-cell__left-icon{
    color: #000;
  }
</style>
