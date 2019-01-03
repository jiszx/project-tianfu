<template>
  <div class="application_certification-details">
    <header>
      <div class="headImg">
        <img :src="infoData.custAvatar || this.defaultCustAvatar" alt="">
      </div>
      <div class="headText">
        <p class="title">{{infoData.custName}}</p>
        <p class="images">
          <img src="../../assets/logo.png" alt="" width="20">
          <img src="../../assets/logo.png" alt="" width="20">
          <img src="../../assets/logo.png" alt="" width="20">
          <img src="../../assets/logo.png" alt="" width="20">
        </p>
        <p class="text">所在地：<span>{{infoData.addrAddress}}</span></p>
        <p class="text">手机号码：<span>{{infoData.custPhone}}</span></p>
        <p class="text">主营：<span>土豆，番茄</span></p>
      </div>
    </header>
    <section>
      <p>店铺介绍</p>
      <div class="contant">
        <p>{{infoData.introduction}}</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      apiInfo: '/user/customers/info', // 4.6. 认证用户详情
      formData:{
        custId : this.$route.query.custId || 1
      },
      infoData: {},
      defaultCustAvatar: require('../../assets/u1677.png')
    }
  },
  created(){
    this.getInfoData();
  },
  mounted(){},
  watch:{},
  computed:{
  },
  methods:{
    getInfoData(){
      this.$axios.get(this.apiInfo, {params:this.formData})
        .then( res => {
          this.infoData = res.data.data;
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.application_certification-details header{
  display: flex;
}
.application_certification-details header .headImg{
  padding-right: 50px;
}
.application_certification-details header .headImg img{
  width: 249px;
  height: 166px;
}
.application_certification-details header .headText{
  p{
    padding-bottom: 12px;
  }
  .title{
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 20px;
  }
  .images{
    padding-bottom: 20px;
  }
  .text{
    
  }
}
.application_certification-details section{
  margin-top: 80px;
  .contant{
    padding: 15px;
    background: #f4f4f4;
    margin-top: 20px;
  }
}
</style>