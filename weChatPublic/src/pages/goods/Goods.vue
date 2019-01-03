<template>
  <div class="page-category">
    <div class="category-wrapper light-black">
      <div class="category-name text-center">
        <ul>
          <li
            v-for="(item, index) in categoryList"
            :key="index"
            :class="{active: currentCategory===item.commoTyId}"
            @click="change(item)"
          >
            <p>{{item.commoTyName}}</p>
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
              <img :src="item.commoTyAttachPathUrl" alt="">
            </div>
            <p class="ellipsis paddingT20 fontsize-24">{{item.commoTyName}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      api_get_category:'/commodity/commodityTypes/list',//7.1. APP商品分类列表
      categoryList:[],
      currentCategory: 1,
      categoryDetailData: [],
      commoTyParentId: -1,
    }
  },
  components: {},
  created () {
    this.getCategoryData(-1);
  },
  methods: {
    /**
     * 获取分类数据
     */
    getCategoryData(commoTyParentId) {
      this.$axios.get(this.api_get_category)
        .then(res => {
            this.categoryList = res.list;
            if (this.categoryList.length) {
              this.currentCategory = this.categoryList[0].commoTyId;
              this.categoryDetailData = this.categoryList[0].children;
            }
            this.$forceUpdate()
        })
    },
    /**
     * 点击左侧导航
     * @param item
     */
    change (item) {
      this.currentCategory = item.commoTyId;
      this.categoryDetailData = item.children;
    },
    /**
     * 点击跳转到商品列表
     * @param item
     */
    categoryClick (item) {
      this.$router.push({
        name: '三级分类',
        query: {
          commoTyId:item.commoTyId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-category{
  height: 100%;
}
.category-wrapper{
  display: flex;
  height: 100%;
  .category-name{
    flex: 0 0 2.8rem;
    height: 100%;
    overflow-y: scroll;
    background: #FFF;
    ul{
      li{
        height: 1.2rem;
        line-height: 1.2rem;
        &.active{
          color: #34C975;
          background: #F2F6F9;
          border-left: 0.08rem solid #34C975;
        }
      }
    }
  }
  .category-main{
    flex: auto;
    height: 100%;
    overflow-y: scroll;
    padding: 0.4rem 0 0 0.4rem;
    .category-item-wrapper{
      display: flex;
      flex-wrap: wrap;
      .category-item{
        flex: 0 0 50%;
        background: #fff;
        max-width: 1.74rem;
        height: 1.74rem;
        margin: 0 0.4rem 0.4rem 0;
      }
      .category-image{
        padding-top: 0.26rem;
        img{
          width: 0.66rem;
          height: 0.66rem;
        }
      } 
    }
  }
}
</style>
