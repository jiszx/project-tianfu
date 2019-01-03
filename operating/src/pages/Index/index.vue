<template>
  <div class="index">
    <div class="home-gauge">
      <router-link tag="div" v-for="(item,index) in acountData" class="gauge-module shadow-item" :class="item.class" :key="index" :to="{path:item.path}">
        <div class="gauge-item">
          <div>
            <p class="gauge-data">{{item.data}}</p>
          </div>
        </div>
        <div class="gauge-handle">
          <span>{{item.name}}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      apiCountData: '/index/count', // 4个板块统计
      acountData: [
        {
          img: 'icon-tixing',
          data: '',
          class: 'gauge-message',
          name: '认证申请',
          path: "user/applicationCertification"
        },
        {
          img: 'icon-tubiao',
          data: '',
          class: 'gauge-rating',
          name: '认证用户总数量',
          path: "user/authenticatedUser"
        },
        {
          img: 'icon-pingguo',
          data: '',
          class: 'gauge-apple',
          name: '今日新增用户',
          path: "user/usermanage?type=today"
        },
        {
          img: 'icon-anzhuo',
          data: '',
          class: 'gauge-android',
          name: '用户总数量',
          path: "user/usermanage"
        }
      ],
    }
  },
  created(){
    this.getStatisData();
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    /**
     * 获取4板块统计数据
     */
    getStatisData() {
      this.$axios.get(this.apiCountData)
        .then(res => {
          let objAcount = res.data.data;
          this.acountData[0].data = objAcount.applyAuthNum; // 认证申请
          this.acountData[1].data = objAcount.authNum; // 认证用户总数量
          this.acountData[2].data = objAcount.addUserNum; // 今日新增用户
          this.acountData[3].data = objAcount.userNum; // 用户总数量
        })
    },
  }
}
</script>
<style lang="scss" scoped>
  .index{}
  
    .home-gauge{
      margin: 60px 0 80px 0;
      display: flex;
      justify-content: space-around;
      .gauge-module {
        width: 340px;
        min-width: 260px;
        height: 170px;
        border-radius: 5px;
        margin: 0 10px;
        display: inline-block;
        color: white;
        overflow: hidden;
        cursor: pointer;
        .gauge-item{
          height: 100px;
          position: relative;
          padding: 5px 15px;
          p{
            text-align: center;
          }
          .gauge-data{
            font-size: 32px;
          }
          >div{
            padding-top: 26px;
          }
          .gauge-item-logo{
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            text-align: center;
            padding: 0;
          }
        }
      }
      .gauge-message{
        background-color: #32C5D2;
      }
      .gauge-rating{
        background-color: #32C5D2;
      }
      .gauge-apple{
        background-color: #34C975;
      }
      .gauge-android{
        background-color: #34C975;
      }
      .gauge-handle{
        /* display: flex;
        justify-content: space-between; */
        text-align: center;
        padding: 26px 20px;
        font-size: 14px;
      }
    }
</style>