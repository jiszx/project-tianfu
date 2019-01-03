<template>
<div class="page-purchase-list">
  <div class="filter-bar-wrapper-wrapper van-hairline--top-bottom text-center marginB20 fontsize-26">
    <div class="filter-bar-wrapper">
      <ul>
        <!-- <li @click="showAreaDrag">
          <span class="select-name">地区</span>
          <span>全国</span>
          <span class="filter-bar-icon paddingL10">
            <van-icon name="arrow" class="icon-item icon-item-brand" :class="{active:showBrandDrag}" />
          </span>
        </li> -->
        <li  @click="showAreaDrag">
          <span class="select-name">地区</span>
          <!-- <div style="display:inline-block;"> -->
            <span v-if="!searchForm.areaCode">全国 </span>
            <span v-else class="showChoseSpan">
              <!-- {{formData.addrProvinceName}}
              {{formData.addrCityName}} -->
              {{formData.addrCountyName}}
            </span>
          <!-- </div> -->
            <span class="filter-bar-icon paddingL10">
              <van-icon name="arrow" class="icon-item icon-item-brand" :class="{active:showBrandDrag}" />
            </span>
        </li>
        <li @click="filterClick">
          <span class="select-name">品类</span>
          <span v-if="!formNess.commoTyName">全部</span>
          <span v-else class="showChoseSpan">
            {{formNess.commoTyName}}
          </span>
         <!--  <span class="filter-bar-icon">
            <img src="" alt="">
          </span> -->
          <span class="filter-bar-icon paddingL10">
            <van-icon name="arrow" class="icon-item icon-item-brand" :class="{active:filtrateShow}" />
          </span>
        </li>
      </ul>
    </div>
  </div>
  <!-- 品类列表 -->
  <div class="purchase-list-wrapper paddingT10">
    <purchaseRow
      class="van-cell"
      v-for="(item, index) in purchaseList"
      :key="index"
      :procurementId="item.procurementId"
      :procurementName="item.procurementName"
      :areaPath="item.areaPath.replace(/\>/g, '')"
      :qualityRequirement="item.qualityRequirement"
      :commoNum="item.commoNum"
      :commoUnit="item.commoUnit"
    />
  </div>
  <!--加载更多-->
  <div class="loading-more-box">
    <p class="loading-more" v-if="!hasMore">没有更多</p>
    <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
  </div>
  <!--行政区域组件-->
  <areaPopup v-model="showBrandDrag" @confirm="areaConfirm"></areaPopup>
  <!--筛选弹层-->
  <filtratePopup :filtrateShow="filtrateShow" @close="closeFiltrate" @category-click="filtrateConfirm" :commoTyPathSelect="searchForm.commoTyPath"></filtratePopup>
  <div class="public-purcha" @click="goPublic">
    <img src="../../../assets/images/purchasing/fbpj-btn@2x.png" alt="">
  </div>
</div>
</template>

<script>
import areaPopup from 'components/area-popup'
import filtratePopup from 'components/FiltratePopup'
import purchaseRow from 'components/purchase-row'
import LoadingMore from '@/components/base/loading-more'
import { Icon } from 'vant';
export default {
  data () {
    return {
      api_get_purchase:'/found/procurements/list', //6.1. 采购需求列表
      searchForm: {
        page:1,
        size:10,
        areaCode: '',
        commoTyPath:'',
      },
      formData: {
        addrProvinceName:'',
        addrCityName:'',
        addrCountyName:''
      },
      formNess:{
        commoTyName:''
      },
      filtrateShow:false,
      hasMore:false,
      loading:false,
      showBrandDrag:false,
      purchaseList: []
    }
  },
  components: {
    areaPopup,
    filtratePopup,
    LoadingMore,
    purchaseRow,
    'van-icon': Icon
  },
  created() {
    this.getData();//获取采购大厅数据
  },
  methods: {
    /**
     * 获取采购大厅列表数据
     */
    getData(isMore) {
      this.loading = true;
      this.$axios.get(this.api_get_purchase, this.searchForm)
        .then(res => {
          if (isMore && isMore == 'more') {
            this.purchaseList = [...this.purchaseList, ...res.list];
          } else {
            this.purchaseList = res.list
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
    /**
     * 行政区域弹层控制
     */
    showAreaDrag() {
      this.showBrandDrag = true;
    },
    /**
     * 行政数据获取
     */
    areaConfirm(val){
      this.searchForm.areaCode = val[2] ? val[2].code : '';
      this.formData.addrProvinceName = val[0] ? val[0].name : '';
      this.formData.addrCityName = val[1] ? val[1].name : '';
      this.formData.addrCountyName = val[2] ? val[2].name : '';
      // console.log(this.searchForm.areaCode,123);
      this.getData();//地区筛选获取数据
    },
    /**
     * 筛选相关
     */
    filterClick() { //打开筛选弹层
      this.filtrateShow = true;
    },
    closeFiltrate() {//关闭筛选弹层
      this.filtrateShow = false;
    },
    filtrateConfirm(data) {
      this.searchForm.commoTyPath = data.commoTyPathSelect;
      this.formNess.commoTyName = data.commoTyName;
      this.searchForm.page = 1;
      this.getData();//获取采购大厅数据
    },
    /**
     * 去发布采购
     */
    goPublic() {
      this.$router.push({name: '发布采购'})
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-purchase-list{
    padding-top: 0.88rem;
    padding-bottom: 50px;
  }
  .filter-bar-wrapper-wrapper{
    position: fixed;
    left: 0;
    top: 0rem;
    width: 100%;
    height: 0.88rem;
    z-index: 20;
    background: #f1f5f8;
  }
  .filter-bar-wrapper{
    height: 0.88rem;
    ul{
      display:flex;
      // line-height: 0.88rem;
      height: 100%;
      align-items: center;
      li{
        flex: 0 0 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .select-name{
          color: #939393;
          padding-right: 0.1rem;;
        }
        .filter-bar-icon{
          display: inline-block;
          line-height: 1;
          // vertical-align: middle;
          padding-right: 0.15rem;
          .icon-item{
            font-size: 10px;
            font-weight: bold;
            &.icon-item-brand{
              transform: rotate(90deg);
              transition: all .28s;
            }
            &.icon-item-brand.active{
              transform: rotate(-90deg);
              color: #34C975;
            }
          }
        }
      }
    }
  }
  /* 采购大厅列表 */
    .purchase-list-wrapper{
      background: #fff;
    }
    .brand-mask{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0, .3);
      z-index: 19;
      display: none;
      transition: all 0.28s;
      &.show{
        display: block;
      }
    }
    // 发布按钮
    .public-purcha {
      position: fixed;
      width: 1.14rem;
      right: 0.32rem;
      bottom: 0.4rem;
    }
    .showChoseSpan {
      display: inline-block;
      max-width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
</style>
