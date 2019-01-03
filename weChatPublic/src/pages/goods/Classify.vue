<template>
  <div class="page-classify">
    <div class="classify-wrapper light-black">
      <div class="classify-main">
        <div class="classify-item-wrapper">
          <div
            class="classify-item text-center"
            v-for="(item, index) in classifyDetailData"
            :key="index"
            @click="classifyClick(item)"
          >
          <p class="ellipsis fontsize-24">{{item.commoTyName}}</p>
          </div>
        </div>
        <p v-if="!classifyDetailData.length" class="text-center">暂无分类</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      api_get_classify:'/commodityTypes/list',//3.3. 商品分类分级
      classifyList:[],
      currentclassify: 1,
      classifyDetailData: [],
      commoTyParentId: -1,
    }
  },
  components: {},
  created () {
    this.commoTyParentId = this.$route.query.commoTyId;
    this.getclassifyData();
  },
  methods: {
    /**
     * 获取分类数据
     */
    getclassifyData() {
      this.$axios.get(this.api_get_classify, {commoTyParentId: this.commoTyParentId})
        .then(res => {
          this.classifyDetailData = res.list;
        })
    },
    /**
     * 点击跳转到供应大厅
     * @param item
     */
    classifyClick (item) {
      this.$router.push({
        name: '供应大厅',
        query: {
          commoTyPathSelect:item.commoTyPath,
          commoTyParentId:item.commoTyId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-classify{
  height: 100%;
}
.classify-wrapper{
  display: flex;
  height: 100%;
  .classify-main{
    flex: auto;
    height: 100%;
    overflow-y: scroll;
    padding: 0.8rem 0 0 0.4rem;
    .classify-item-wrapper{
      display: flex;
      flex-wrap: wrap;
      .classify-item{
        flex: 0 0 20%;
        background: #fff;
        max-width: 1.54rem;
        height: 0.68rem;
        border-radius: 0.1rem;
        margin: 0 0.34rem 0.4rem 0;
        &.active{
          color: #34C975;
          background: #F2FDF7;
          border: 0.02rem solid #34C975;
        }
        p.ellipsis{
          line-height: 0.67rem;
        }
      }
    }
  }
}
</style>
