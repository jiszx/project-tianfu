<template>
  <div class="page-user-perfectInfo">
    <div class="section">
      <div class="section-div">
        <div class="title fontsize-34" v-if="plowMuNumber == 0">您来田夫网的目的是 来找货</div>
        <div class="title fontsize-34" v-if="plowMuNumber == 1">您来田夫网的目的是 来卖货</div>
        <div class="name fontsize-28">您的姓名是</div>
        <div class="input">
          <van-cell-group>
            <van-field v-model="formData.custName" :disabled="isDisabled" placeholder="点击输入你的姓名" />
          </van-cell-group>
        </div>
        <div class="choose fontsize-30">请选择您的身份，方便为您提供精准服务</div>
        <div class="types">
          <button class="fontsize-26" 
          v-bind:class="{ active: isActive == item.value }" 
          value="formData.custIdentity"
          @click="selectBtn(item)" v-for="(item,index) in getDataList" 
          :key="index">
            {{item.value}}
          </button>
        </div>
      </div>
      <div class="section-button">
        <button class="fonsize-34" @click="userInfo">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, CellGroup, Field } from 'vant';
import { mapState } from 'vuex'
export default {
  data() {
    return {
      api_get_data: '/custIdentity',//3.6. 客户身份
      plowMuNumber:this.$route.query.plowMuNumber,
      isActive:'',
      isDisabled: this.$route.query.realNameAuth == 1, // 已实名认证
      defaultCustName: 'user',
      formData:{
        custName: this.$route.query.custName || '',
        custIdentity: this.$route.query.custIdentity || ''
      },
      getDataList:[

      ],
      isRegister: this.$route.query.isRegister
    }
  },
  computed: {
  },
  components:{
    'van-button':Button,
    'van-cell-group':CellGroup,
    'van-field':Field
  },
  created() {
    this.getData();
    this.isActive = this.$route.query.custIdentity;
    if(!this.formData.custName){
      let PhoneNumber = this.$route.query.phoneNumber;
      PhoneNumber = PhoneNumber.substring(8,11);
      this.defaultCustName += PhoneNumber;
      this.formData.custName = this.defaultCustName;
    }
  },
  methods:{
    selectBtn(rowData) {
      this.isActive = rowData.value;
      this.formData.custIdentity = rowData.value;
    },
    /**
     *  获取客户身份 
     */
    getData(){
      this.$axios.get(this.api_get_data)
        .then(res => {
          this.getDataList = res;
        })
    },
    /**
     *  跳转用户信息 
     */
    userInfo() {
      if(this.isRegister){
        this.$router.push({name:'个人中心'})
      }else{
        if(this.formData.custName){
          this.$router.push({name: '用户信息',query:{plowMuNumber:this.plowMuNumber,custName:this.formData.custName,custIdentity:this.formData.custIdentity}}); 
        }else{
          this.$toast('用户姓名不能为空！')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-user-perfectInfo{
    padding: 0.3rem;
    height: 100%;
    .section{
      height: 100%;
      .section-div{
        background: #fff;
        height: 83%;
        border-radius: 10px;
        text-align: center;
        padding: 0.3rem;
        .title{
          color: #34C975;
        }
        .name{
          color: #313131;
          padding: 0.2rem 0;
        }
        .choose{
          color: #313131;
          padding: 0.8rem 0 0.4rem;
        }
        .types{
          button{
            background: #FFF;
            color: #313131;
            width: 1.8rem;
            height: 0.6rem;
            line-height: 0.48rem;
            border: 0.02rem solid #D4D4D4;
            border-radius: 5px;
            margin-bottom: 0.3rem;
            margin-right: 0.2rem;
          }
          .active{
            background: #34C975;
            color: #FFF;
            border: none;
            border-radius: 5px;
          }
        }
      }
      .section-button{
        padding-top: 20px;
        button{
          background: #34C975;
          color: #FFF;
          width: 100%;
          height: 0.98rem;
          border: none;
          border-radius: 5px;
        }
      }
    }
  }
</style>
