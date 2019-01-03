<template>
  <div class="page-trainingClass-detail">
      <p class="public-title fontsize-38">{{formData.courseTitle || formData.newsTitle || formData.bannerTitle }}</p>
      <p class="pubilc-date">
        <span class="fontsize-26">发布：{{$mUtils.formatDate(formData.createdDate||formData.lastModifiedDate, 'yyyy-MM-dd')}}</span>
      </p>
      <div class="pubilc-contant" v-html="formData.courseDetails||formData.newsDetails||formData.bannerDetails"></div>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Uploader, Icon } from 'vant';
export default {
  data() {
    return {
      apiList: '/found/courses/info',
      apiNews: '/operation/news/info',
      apiAd: '/operation/banners/info',
      formData: {},
    }
  },
  computed: {
   
  },
  components: {
  },
  created() {
    if(this.$route.query.type) {
      if (this.$route.query.type == 'news') {
        this.getNews()
      } else if (this.$route.query.type == 'ad') {
        this.getAd()
      }
    } else this.getList();
  },
  methods: {
    /**
     * 获取列表数据
     */
    getList() {
      this.$axios.get(this.apiList, {courseId: this.$route.query.tranning}).then(res => {
        this.formData = res;
      })
    },
    getNews() {
      this.$axios.get(this.apiNews, {newsId: this.$route.query.tranning}).then(res => {
        this.formData = res;
      })
    },
    getAd() {
      this.$axios.get(this.apiAd, {bannerId: this.$route.query.tranning}).then(res => {
        this.formData = res;
      })
    },
    chooseSelect(name) {
      this.activeName = name;
      this.formData.courseType = name==='全部'?'':name;
      this.openSelect = false;
      this.getList();
    },
  }
}
</script>

<style lang="scss" scoped>
.page-trainingClass-detail {
  background: #fff;
  padding: 0.5rem 0.34rem;
  .public-title {
    color: #313131;
  }
  .pubilc-date {
    margin: 10px 0;
    span{
      color: #939393;
    }
  }
}
</style>
<style lang="scss">
.page-trainingClass-detail {
  .pubilc-contant{
    p{
      line-height: 22px;
      color: #393939;
      font-size: 0.26rem;
      img{
        margin-bottom:15px;
      }
    }
  }
}
</style>

