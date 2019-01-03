<template>
  <div class="page-user-objectSelecttion">
    <div class="section">
      <div class="select-one">
        <p class="title fontsize-32">请选择当前您进入田夫网的目的</p>
        <p class="remark fontsize-26">方便为您提供精准的服务</p>
        <div><img src="../../../assets/images/mine/userInfo/mdxz-pt1@2x.png" alt=""></div>
        <div><button @click="findGoods()">我来找货</button></div>
      </div>
      <div class="select-two">
        <div>
          <p class="fontsize-26">
            <span class="border-left"></span>
            <span class="border-text">或</span>
            <span class="border-right"></span>
          </p>
        </div>
        <div><img src="../../../assets/images/mine/userInfo/mdxz-pt1@2x.png" alt=""></div>
        <div><button @click="saveGoods()">我来卖货</button></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button} from 'vant';
import { mapState } from 'vuex'
export default {
  data() {
    return {
      api_get_data: '/user/customers/create',//9.2. 保存
      plowMuNumber: 0,
      formData:{
      },
    }
  },
  computed: {
  },
  components:{
    'van-button':Button
  },
  created() {
  },
  methods:{
    findGoods() {
      this.$router.push({name:'完善信息',query:{plowMuNumber:0,custName:this.$route.query.custName,custIdentity:this.$route.query.custIdentity,realNameAuth:this.$route.query.realNameAuth,phoneNumber:this.$route.query.phoneNumber,isRegister:this.$route.query.isRegister}});
    },
    saveGoods() {
      this.$router.push({name:'完善信息',query:{plowMuNumber:1,custName:this.$route.query.custName,custIdentity:this.$route.query.custIdentity,realNameAuth:this.$route.query.realNameAuth,phoneNumber:this.$route.query.phoneNumber,isRegister:this.$route.query.isRegister}});
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-user-objectSelecttion{
    padding: 0.3rem;
    height: 100%;
    .section{
      background: #fff;
      height: 100%;
    }
    .select-one{
      height: 50%;
      padding: 6% 20% 0;
      text-align:center;
      .title{
        color: #313131;
      }
      .remark{
        color: #939393;
        padding: 0.2rem 0;
      }
      div img{
        max-width: 2.6rem;
        max-width: 2.6rem;
        padding: 0.24rem 0;
      }
      div button{
        width: 3.36rem;
        height: 0.94rem;
        background: #FFC046;
        border: none;
        border-radius: 0.94rem;
        color: #FFFFFF;
      }
    }
    .select-two{
      height: 50%;
      padding: 6% 20% 0;
      text-align:center;
      div p{
        padding-bottom: 0.5rem;
        color: #939393;
        .border-text{
          padding: 0 0.2rem;
        }
        .border-left{
          display: inline-block;
          width:38%;
          border-top: 0.02rem solid #D4D4D4;
          padding: 0.04rem 0;
        }
        .border-right{
          display: inline-block;
          width: 38%;
          border-top: 0.02rem solid #D4D4D4;
          padding: 0.04rem 0;
        }
      }
      div img{
        max-width: 2.6rem;
        max-width: 2.6rem;
        padding: 0.24rem 0;
      }
      div button{
        width: 3.36rem;
        height: 0.94rem;
        background: #34C975;
        border: none;
        border-radius: 47px;
        color: #FFFFFF;
      }

    }
  }
</style>
