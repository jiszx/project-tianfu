<template>
<div class="page-supply-list">
  <!--搜索-->
  <div class="search-wrapper" ref="searchWrapper">
    <searchBar @search="search" @scan="search" :placeholder="searchForm.keyword" />
  </div>
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
        <li @click="showAreaDrag">
          <div class="div-block div-block-padding">
            <span class="select-name">地区</span>
            <span class="filter-bar-icon">
              <van-icon name="arrow" class="icon-item icon-item-brand" :class="{active:showBrandDrag}" />
            </span>
          </div>
         <div class="div-block">
           <span>{{formData.addrCountyName||'全国'}}</span>
           <!-- <span v-if="!searchForm.areaCode">全国</span>
           <span v-else>
             {{formData.addrProvinceName}}
             {{formData.addrCityName}}
             {{formData.addrCountyName}}
           </span> -->
         </div>
        </li>
        <li @click="filterClick">
          <div class="div-block div-block-padding">
            <span class="select-name">品类</span>
            <span class="filter-bar-icon">
              <van-icon name="arrow" class="icon-item icon-item-brand" :class="{active:filtrateShow}" />
            </span>
          </div>
          <div class="div-block">
            <span>{{formNess.commoTyName||'全部'}}</span>
            <!-- <span v-if="!formNess.commoTyPathName">全部</span>
            <span v-else>
              {{formNess.commoTyPathName}}
            </span> -->
          </div>
        </li>
        <li @click="showFilterVarieties">
          <div class="div-block div-block-padding">
            <span class="select-name">品种</span>
            <span class="filter-bar-icon">
              <van-icon name="arrow" class="icon-item icon-item-brand" :class="{active:showVarietiesDrag}"/>
            </span>
          </div>
          <div class="div-block">
            <span class="name-span">{{showVarietiesName||'全部'}}</span>
            <!-- <span v-if="!formNess.commoTyPathName">全部</span>
            <span v-else>
              {{formNess.commoTyPathName}}
            </span> -->
          </div>
        </li>
        <li @click="showFilterAuthentication">
          <div class="div-block div-block-padding">
            <span class="select-name">筛选</span>
            <span class="filter-bar-icon">
              <img src="../../assets/images/goods/icon_saixuan.png" alt="">
            </span>
          </div>
          <div class="div-block">
            <span>{{isChoseAuthent?'已选':'不限'}}</span>
            <!-- <span v-if="!formNess.commoTyPathName">不限</span>
            <span v-else>
              {{formNess.commoTyPathName}}
            </span> -->
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!-- 供应大厅商品列表 -->
  <div class="supply-list-wrapper">
    <goodsListRow
      class="van-cell"
      v-for="(item, index) in goodsList"
      :key="index"
      :commoAttachPathUrl="item.commoAttachPathUrl"
      :commoId="item.commoId"
      :commoName="item.commoName"
      :commoPrice="item.commoPrice"
      :commoUnit="item.commoUnit"
      :commoSales="item.commoSales"
      :customer="item.customer"
    />
  </div>
  <!--加载更多-->
  <div class="loading-more-box">
    <p class="loading-more" v-if="!hasMore">没有更多</p>
    <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
  </div>
  <!--行政区域组件-->
  <areaPopup v-model="showBrandDrag" @confirm="areaConfirm"></areaPopup>
  <!--品类筛选弹层-->
  <filtratePopup :filtrateShow="filtrateShow" @close="closeFiltrate" @init-data="getInitData" @category-click="filtrateConfirm" :commoTyPathSelect="searchForm.commoTyPath"></filtratePopup>
  <!-- 品种筛选弹层 -->
  <div class="brand-drag-wrapper" :class="{showVarietiesDrag:showVarietiesDrag}">
    <div class="brand-drag-inner page-content">
      <div
        class="brand-item ellipsis"
        v-for="(item, index) in varietiesList"
        :key="index"
        @click="chooseVarieties(item)"
      >
        <div class="varieties fontsize-26">{{item.commoTyName}}</div>
      </div>
    </div>
  </div>
  <!-- 认证筛选弹层 -->
  <div class="brand-drag-wrapper" :class="{showAuthenticationDrag:showAuthenticationDrag}">
    <div class="brand-drag-inner page-content">
      <div
        class="brand-item ellipsis"
        v-for="(item, index) in authenticationList"
        :key="index"
        @click="chooseAuthentication(item)"
      >
        <div class="authentication fontsize-26">
          <span class="authentication-child first-span">{{item.authenticationName}}</span>
          <span class="authentication-child second-span">
            <van-switch v-model="item.authenticationStauts" />
          </span>
        </div>
      </div>
    </div>
    <div class="brand-drag-inner-btn van-hairline--top">
      <div class="brand-drag-inner-btn-item fontsize-26" @click="confirmAuthentication">确定</div>
    </div>
  </div>
  
  <div class="brand-mask" :class="{show:showAuthenticationDrag}" @touchmove.prevent @click="showAuthenticationDrag=false"></div>
  
</div>
</template>

<script>
import searchBar from 'components/search-bar'
import areaPopup from 'components/area-popup'
import filtratePopup from 'components/FiltratePopup'
import goodsListRow from 'components/goodsList-row'
import LoadingMore from '@/components/base/loading-more'
import { Icon, Switch  } from 'vant';
export default {
  data () {
    return {
      api_get_commodities:'/commodity/commodities/list', //7.2. 商品信息列表
      api_get_commoditiesTypes:'/commodityTypes/list', //3.3. 商品分类分级
      searchForm: {
        page:1,
        size:10,
        areaCode: '',//行政区代码
        commoTyPath:this.$route.query.commoTyPathSelect,//商品分类路径，""分隔，示例：_1_2
        keyword:'',//品种关键字
        realNameAuth:'',//通过实名认证(0：未通过，1：已通过，2：待审核)
        enterpriseAuth:'',//通过企业认证(0：未通过，1：已通过，2：待审核)
        aptitudeAuth:'',//通过资质认证(0：未通过，1：已通过，2：待审核)
        canTrace:'',//是否可追溯(0：不可追溯，1：可追溯)
      },
      formData: {
        addrProvinceName:'',
        addrCityName:'',
        addrCountyName:''
      },
      formNess:{
        commoTyPathName:''
      },
      hasMore:false,
      loading:false,
      showBrandDrag:false, //地区
      filtrateShow:false, //品类
      showVarietiesDrag:false, //品种
      showVarietiesName: '', // 品种名称
      showAuthenticationDrag:false, //筛选认证
      goodsList: [],
      commoTyParentId: this.$route.query.commoTyParentId,
      varietiesList:[

      ],
      isChoseAuthent: false,
      authenticationList:[{
        authenticationStauts:false,
        authenticationName:'实名认证'
      },{
        authenticationStauts:true,
        authenticationName:'企业认证'
      },{
        authenticationStauts:false,
        authenticationName:'资质认证'
      },{
        authenticationStauts:false,
        authenticationName:'是否可追溯'
      }]
    }
  },
  components: {
    searchBar,
    areaPopup,
    filtratePopup,
    LoadingMore,
    goodsListRow,
    'van-icon': Icon,
    'van-switch': Switch
  },
  created() {
    if(this.$route.query.commoTyPathSelect) {
      this.searchForm.commoTyPath = this.$route.query.commoTyPathSelect;
      let arr = this.$route.query.commoTyPathSelect.split('_');
      let i=0
      arr.map(item => {
        if(item == '-'||item == '') {
          arr.splice(i,1)
        }
        i++;
      })
      if(arr[2]) {
        this.commoTyParentId = arr[2];
        this.getvarietiesList(arr[3]); //品种数据列表获取
      }
    }
    this.getData();//获取商品列表数据
  },
  methods: {
    /**
     *  搜索方法
     */
    search(keywords) {
      this.searchForm.keyword = keywords;
      this.goodsList = [];
      this.searchForm.page = 1;
      this.getData();
    },
    /**
     * 获取商品列表数据
     */
    getData(isMore) {
      this.loading = true;
      this.$axios.get(this.api_get_commodities, this.searchForm)
        .then(res => {
          if (isMore && isMore == 'more') {
            this.goodsList = [...this.goodsList, ...res.list];
          } else {
            this.goodsList = res.list
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
    品种数据列表获取
    */
   getvarietiesList(key){
     if(this.commoTyParentId)
     this.$axios.get(this.api_get_commoditiesTypes,{commoTyParentId:this.commoTyParentId})
      .then(res => {
        this.varietiesList = res.list;
        if(key) {
          let data = this.varietiesList.find(v => {
            return v.commoTyId == key
          })
          this.showVarietiesName = data.commoTyName; //commoTyName
        }
      })
   },
    /**
     * 筛选相关
     */
    /*  品类 */
    filterClick() { //打开筛选弹层
      this.filtrateShow = true;
    },
    closeFiltrate() {//关闭筛选弹层
      this.filtrateShow = false;
    },
    /*  品种 */
    showFilterVarieties() {
      this.showVarietiesDrag = !this.showVarietiesDrag;
    },
    chooseVarieties(rowData) {
      this.searchForm.commoTyPath = rowData.commoTyPath;
      this.showVarietiesDrag = false;
      this.showVarietiesName = rowData.commoTyName; //commoTyName
      this.searchForm.page = 1;
      this.getData();
    },
    /* 筛选认证 */
    showFilterAuthentication() {
      this.showAuthenticationDrag = !this.showAuthenticationDrag;
    },
    chooseAuthentication(rowData){
      if(rowData.authenticationName == "实名认证"){
        this.searchForm.realNameAuth = rowData.authenticationStauts == true ? 1 : 0;
      }else if(rowData.authenticationName == "企业认证"){
        this.searchForm.enterpriseAuth = rowData.authenticationStauts == true ? 1 : 0;
      }else if(rowData.authenticationName == "资质认证"){
        this.searchForm.aptitudeAuth = rowData.authenticationStauts == true ? 1 : 0;
      }else if(rowData.authenticationName == "是否可追溯"){
        this.searchForm.canTrace = rowData.authenticationStauts == true ? 1 : 0;
      }
    },
    confirmAuthentication() {
      this.isChoseAuthent = true;
      this.showAuthenticationDrag = false;
      this.searchForm.page = 1;
      this.getData();
    },
    filtrateConfirm(data) {
      this.searchForm.commoTyPath = data.commoTyPathSelect;
      this.formNess.commoTyPathName = data.commoTyPathName;
      this.formNess.commoTyName = data.commoTyPathName.split('>')[data.commoTyPathName.split('>').length-1];
      this.searchForm.page = 1;
      let arr = this.searchForm.commoTyPath.split('_');
      let i=0
      arr.map(item => {
        if(item == '-'||item == '') {
          arr.splice(i,1)
        }
        i++;
      })
      this.commoTyParentId = arr[2]?arr[2]:'';
      this.getData();//获取采购大厅数据
      this.getvarietiesList(); //品种数据列表获取
    },
    getInitData(data) {
      this.formNess.commoTyName = data.commoTyName;
      this.$set(this.formNess);
      delete this.formNess.undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.name-span{
  display: block;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
  .page-supply-list{
    /* padding-top: 1.24rem; */
    padding-bottom: 50px;
  }
  /* 搜索 */
  .search-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.2rem;
    background: white;
    z-index: 30;
  }
  .filter-bar-wrapper-wrapper{
    position: fixed;
    left: 0;
    top: 1.2rem;
    width: 100%;
    height: 1.24rem;
    z-index: 20;
    background: #f1f5f8;
  }
  .filter-bar-wrapper{
    height: 1.24rem;
    ul{
      display:flex;
      line-height: 1.24rem;
      li{
        flex: 0 0 25%;
        width: 0;
        .div-block-padding{
          margin-top: 8px;
        }
        .div-block{
          max-height: 22px;
          line-height: 22px;
          .select-name{
            color: #939393;
            padding-right: 0.1rem;;
          }
        }
        .filter-bar-icon{
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-top: -0.06rem;
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
  /* 供应大厅列表 */
  .supply-list-wrapper{
    background: #fff;
    margin-top: 125px;
  }
  
  .brand-drag-wrapper{
    position: absolute;
    left: 0;
    top: 2.44rem;
    background: white;
    z-index: 20;
    width: 100%;
    display: none;
    &.showVarietiesDrag,&.showAuthenticationDrag{
      display: block;
    }
    ul{
      position: relative;
      z-index: 20;
    }
    .brand-drag-inner{
      display: flex;
      flex-flow: wrap;
      min-height: 2rem;
      /* padding-bottom: 0.2rem; */
      max-height: 8rem;
      overflow-y: scroll;
      .brand-item{
        flex: 0 0 100%;
        /* padding: 0.2rem 0 0; */
        text-align: center;
       /*  span{
          display: inline-block;
          padding: 0.1rem 0;
          width: 80%;
        } */
        .varieties{
          height: 0.98rem;
          line-height: 0.98rem;
          border-bottom: 0.02rem solid #D4D4D4;
        }
        .authentication{
          height: 0.98rem;
          line-height: 0.98rem;
          border-bottom: 0.02rem solid #D4D4D4;
          display: flex;
          .authentication-child{
            flex: 0 0 50%;
          }
          .first-span{
            text-align: left;
            padding-left: 0.2rem;
          }
          .second-span{
            text-align: right;
            padding: 0.16rem 0.2rem 0 0;
          }
        }
        &.active{
          span{
            background: red;
            color:#fff;
          }
        }
      }
    }
    .brand-drag-inner-btn{
      /* display: flex;
      padding: 0.2rem;
      .brand-drag-inner-btn-item{
        flex: 0 0 100%;
      } */
      color: #fff;
      background: #34C975;
      height: 0.98rem;
      line-height: 0.98rem;
      text-align: center;
      margin-top: -0.02rem;
    }
  }
</style>
