<template>
  <div class="componnet-filtrate-popup" :class="[filtrateShow?'filtrate-show':'filtrate-hide']">
    <div class="filtrate-popup-inner">
      <div class="filtrate-min">
        <div class="filtrate-min-inner" ref="filtrateMinInner">
          <!--类型筛选-->
          <div class="category-wrapper light-black">
            <div class="category-name text-center">
              <ul>
                <li
                  v-for="(item, index) in categoryList"
                  :key="index"
                  :class="{active: currentCategory==item.commoTyId}"
                  @click="change(item)"
                >
                  <p class="fontsize-26">{{item.commoTyName}}</p>
                </li>
              </ul>
            </div>
            <div class="category-main">
              <div class="category-item-wrapper">
                <div
                  class="category-item text-center"
                  v-for="(item, index) in categoryDetailData"
                  :key="index"
                  @click="categoryClick(item)"
                >
                  <div class="category-image">
                    <img :src="item.commoTyIconPath" alt="">
                  </div>
                  <p class="ellipsis paddingT20 fontsize-26">{{item.commoTyName}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mask-wrapper" @click="closeFiltratePopup"></div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    filtrateShow:{
      type:Boolean,
      default:false
    },
    commoTyPathSelect:String
  },
  data() {
    return {
      api_get_category:'/commodityTypes/list',//3.3. 商品分类分级
      categoryList:[],
      currentCategory: 1,
      categoryDetailData: [],
      isFirstOpen:true,
      commoTyParentId: -1,
      isChangeClick: false,
      arr: []
    }
  },
  watch:{
    filtrateShow(val) {
      if (val) {
        if (this.isFirstOpen) {
          // this.getCategoryData(-1);
          this.isFirstOpen = false;
        }
      }
    },
  },
  components: {
   
  },
  created() {
    if(this.commoTyPathSelect) {
      let arr = this.commoTyPathSelect.split('_');
      let i = 0
      arr.map(item => {
        if(item == '-'||item == '') {
          arr.splice(i,1)
        }
        i++;
      })
      this.arr = arr;
      this.getCategoryData(arr[0])
    } else this.getCategoryData(-1);
  },
  methods:{
    /**
     * 获取分类数据
     */
    getCategoryData(commoTyParentId) {
      this.$axios.get(this.api_get_category, {
        commoTyParentId: (commoTyParentId ? commoTyParentId : -1)
      })
        .then(res => {
          let index = this.categoryList.findIndex(v => {
            return v.commoTyId == commoTyParentId
          })
          if (index > -1) {
            this.categoryDetailData = res.list;
            // if(commoTyParentId == '0') {
            //   this.categoryDetailData = [{
            //     commoTyId:0,
            //     commoTyLevel:1,
            //     commoTyName:'全部',
            //     commoTyPath:'',
            //     commoTyPathName:'全部',
            //     leaf:true
            //   },...this.categoryDetailData];
            // }
            /** 
             * 获取默认的选中path的name 
             * 3级
             * */
            let data = this.categoryDetailData.find(v => {
              return v.commoTyId == this.arr[2]
            })
            if(data) this.$emit('init-data',{commoTyName:data.commoTyName});
          } else {
            this.categoryList = res.list;
            // this.categoryList = [{
            //   commoTyId:0,
            //   commoTyLevel:1,
            //   commoTyName:'全部品类',
            //   commoTyPath:'',
            //   commoTyPathName:'全部品类',
            //   leaf:false
            // },...this.categoryList];
            // console.log(this.categoryList,222)
            if (this.categoryList.length) {
              /**
               * 如果存在默认选中值，且未点击修改选中，则获取渲染选中值
               * 且标记选中状态
               */
              this.currentCategory = this.categoryList[0].commoTyId;
              if(this.commoTyPathSelect && !this.isChangeClick) {
                this.getCategoryData(this.arr[1])
                this.currentCategory = this.arr[1];
                /** 获取默认的选中path的name 2级 */
                let data = this.categoryList.find(v => {
                  return v.commoTyId == this.arr[1]
                })
                this.$emit('init-data',{commoTyName:data.commoTyName});
              } else this.getCategoryData(this.categoryList[0].commoTyId)
            }
            this.$forceUpdate()
          }
        })
    },
    /**
     * 点击左侧导航
     * @param item
     */
    change (item) {
      this.isChangeClick = true;
      if(item.commoTyLevel<3) {
        this.currentCategory = item.commoTyId;
        this.getCategoryData(item.commoTyId);
      }
    },
    /**
     * 点击跳转到商品列表
     * @param item
     */
    categoryClick (item) {
      this.$emit('close');
      this.$emit('category-click',{commoTyPathSelect:item.commoTyPath,commoTyPathName:item.commoTyPathName, commoTyName: item.commoTyName});
    },
    closeFiltratePopup() {
      this.$emit('close');
    }
  }
}
</script>

<style lang="scss" scoped>
  .componnet-filtrate-popup{
    position: fixed;
    /* top: 44px; */
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 40;
  }
  /* 采购大厅 */
  .page-purchase-list .componnet-filtrate-popup{
    top: 44px;
  }
  .page-purchase-list .filtrate-popup-inner{
    padding-top: 44px;
  }
  /* 供应大厅 */
  .page-supply-list .componnet-filtrate-popup{
    top: 62px;
  }
  .page-supply-list .filtrate-popup-inner{
    padding-top: 122px; /* 含搜索高度 */
  }
  .filtrate-popup-inner{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .filtrate-min{
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding:0 0 0.88rem;
    background-color: #fff;
    overflow-x: auto;
    position: relative;
    z-index: 2;
    transition: all 0.28s;
  }
  .confirm-btn-wrapper{
    flex: 0 0 0.76rem;
    box-sizing: border-box;
    height: 0.76rem;
    width: 100%;
    line-height: 0.76rem;
    z-index: 10;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .filtrate-min-inner{
    height: 100%;
    overflow-y: scroll;
  }


  .mask-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0,0,0,0);
  }

  /*采购大厅运动*/
  .page-purchase-list .componnet-filtrate-popup.filtrate-show{
    transform: translatey(-44px);
    opacity: 1;
  }
   /*供应大厅运动*/
  .page-supply-list .componnet-filtrate-popup.filtrate-show{
    transform: translatey(-62px);
    opacity: 1;
  }
  .componnet-filtrate-popup.filtrate-hide{
    transform: translatey(100%);
    opacity: 0;
  }

  .componnet-filtrate-popup.filtrate-show .filtrate-min{
    //transform: translatey(0);
    transform: translate3d(0%, 0, 0);
    opacity: 1;
    transition: .3s ease-out;
  }
  .componnet-filtrate-popup.filtrate-hide .filtrate-min{
    //transform: translatey(-100%);
    transform: translate3d(0%, -100%, 0);
    opacity: 0.5;
    transition: .3s ease-out;
  }

  /*内容区域*/

  .confirm-btn-wrapper-inner{
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .confirm-btn{
    float: left;
    width: 50%;
  }
  .category-item{
    display: flex;
    flex-wrap: wrap;
    li{
      flex: 0 0 50%;
      padding: 0.2rem 0 0;
      text-align: center;
      span{
        display: inline-block;
        padding: 0.1rem 0;
        width: 90%;
      }
      &.active{
        span{
          background: #34C975;
          color:#fff;
        }
      }
    }
  }

  .brand-drag-inner{
    display: flex;
    flex-flow: wrap;
    padding-bottom: 0.2rem;
    .brand-item{
      flex: 0 0 50%;
      padding: 0.2rem 0 0;
      text-align: center;
      span{
        display: inline-block;
        padding: 0.1rem 0;
        width: 90%;
      }
      &.active{
        span{
          background: #34C975;
          color:#fff;
        }
      }
    }
  }
  /* 商品分类弹层列表 */
  
  .category-wrapper{
    display: flex;
    /* padding: 0.3rem; */
    height: 100%;
    .category-name{
      flex: 0 0 1.8rem;
      height: 100%;
      overflow-y: scroll;
      ul{
        li{
          height: 1.2rem;
          line-height: 1.2rem;
          &.active{
            color: #34C975;
            border-left: 4px solid #34C975;
            /* background: #F2F6F9; */
          }
        }
      }
    }
    .category-main{
      flex: auto;
      height: 100%;
      overflow-y: scroll;
     /*  background: #F2F6F9; */
      padding: 0.3rem;
      .category-item-wrapper{
        display: flex;
        flex-wrap: wrap;
        .category-item{
          flex: 0 0 100%;
          margin-bottom: 0.3rem;
          padding-left: 0.1rem;
        }
      }
    }
  }
</style>
<style lang="scss">
  .category-wrapper,{
    .collapse-item__content{
      padding: 10px 0 10px 15px !important;
    }
    .item-category-wrapper{
      .collapse-item__content{
        padding: 10px 0 10px 0 !important;
      }
    }
  }
</style>
