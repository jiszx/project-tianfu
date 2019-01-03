<template>
  <div class="page-user-info">
    <div class="page-content bg-white">
      <van-cell-group>
        <van-cell title="名称：">
           <div class="title-div">
            <span class="cust-name" style="-webkit-box-orient: vertical;">{{formData.custName}}</span>
            <span class="title-mark" v-if="formData.realNameAuth == 1">实名</span>
           </div>
        </van-cell>
        <van-cell class="van-header" title="头像：" is-link>
          <div class="user-header">
            <van-uploader class="userImg" :after-read="onRead_custAvatar" accept="image/gif, image/jpeg, image/png">
              <img class="we-img" alt="" :src="formData.custAvatarUrl"  />
            </van-uploader>
          </div>
        </van-cell>
        <van-cell title="身份：" is-link @click="toObject">
          <div>{{formData.custIdentity}}</div>
        </van-cell>
        <van-cell class="van-area" title="所在地：" is-link @click="areaShow=true">
          <div v-if="!formData.areaCode">请选择所在地</div>
          <div v-else>
            {{formData.areaPath}}
            <!-- {{formData.addrProvinceName}}
            {{formData.addrCityName}}
            {{formData.addrCountyName}} -->
          </div>
        </van-cell>
        <van-field v-model="formData.custMain" label="主营：" placeholder="请输入主营产品" />
        <van-field v-model="formData.custScale" label="规模：" placeholder="请输入规模" />
        <van-field v-model="formData.plowMuNumber" label="耕田亩数：" placeholder="请输入耕田亩数" />
        <van-field v-model="formData.baseArea" label="耕田面积：" placeholder="请输入耕田面积" />
        <div class="intro-div">
          <div class="title-div">介绍：</div>
          <div class="details-div">
            <p class="intro-p">
              <van-field v-model="formData.introduction" /> 
            </p>
            <div class="intro-img">
               <van-row>
                  <van-col span="24">
                    <MyUploader width="1.2rem" height="1rem" :attachs="custAttaches" :apiUpload="apiUpload" :maxLength="10" :limit='10' :type="fileType" @changeFile="onReadFun"/>
                  </van-col>
                </van-row>
            </div>
            <div class="fontsize-24 remark-span">
              <img class="photo-img" src="../../../assets/images/mine/userInfo/yhzz-xj@2x.png" alt=""/>
              <span class="photo-text">上传实力证明，如证书、资质等</span>
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>
    <div class="page-button">
      <div @click="submitFn" class="btn-default">保 存</div>
    </div>
    <areaPopup v-model="areaShow" @confirm="areaConfirm"></areaPopup>
  </div>
</template>

<script>
import { CellGroup, Cell, Field, Uploader, Icon, Row, Col} from 'vant';
import { mapState } from 'vuex'
import areaPopup from 'components/area-popup'
import MyUploader from "components/my-uploader";
export default {
  name: "edit-user-info",
  data() {
    return {
      api_get_user_info:'/user/customers/info',//9.1. 用户详情
      api_get_data: '/user/customers/create',//9.2. 保存
      uploadImage:'/attachments/avatar', //1.1. 用户头像上传
      apiUpload: '/attachments/cust',//1.1. 客户介绍图片上传
      formData:{
        custName: '',
        custPurpose: '', //客户目的(0：买货，1：卖货)
        custAvatar: '', // 客户头像
        custAvatarUrl:'',
        custIdentity: '',
        areaCode:'',
        areaPath:'',
        custMain:'',
        custScale:'',
        plowMuNumber:0, // 耕田亩数，单位亩，数字可保留2位小数不可负数
        baseArea:0,
        introduction:'',
        realNameAuth: 1, // 通过实名认证(0：未通过，1：已通过，2：待审核)
        custAttaches: [], // 客户附件
      },
      areaShow:false,
      fileType: ['jpeg', 'JPG', 'png',],
      custAttaches: [], // 客户附件
    }
  },
  computed: {
    ...mapState({
      userData: state => state.mine.userData
    })
  },
  components:{
    'van-cell-group':CellGroup,
    'van-field' :Field,
    'van-cell':Cell,
    'van-uploader':Uploader,
    'van-icon':Icon,
    'van-row':Row, 
    'van-col':Col,
    areaPopup,
    MyUploader,
  },
  created() {
    this.getUserInfo();
  },
  methods:{
    /**
     获取个人信息
     */
    getUserInfo() {
      this.$axios.get(this.api_get_user_info)
        .then(res => {
          this.$store.commit('updataUserData', res);
          for(let key in this.formData) {
            this.formData[key] = this.userData[key];
          }
          /* 客户名称取值 未实名认证才可以改 */
          if(this.$route.query.custName && this.formData.realNameAuth == 0){
            this.formData.custName = this.$route.query.custName;
          }
          /* 用户介绍多图处理 */
          this.custAttaches = [...this.formData.custAttaches]
          this.custAttaches.map(item => {
            item.pathUrl = item.attachPathUrl;
            item.path = item.attachPath;
          })
          if(this.$route.query.custPurpose){
            this.formData.custPurpose = this.$route.query.custPurpose;
          }
          if(this.$route.query.custIdentity){
            this.formData.custIdentity = this.$route.query.custIdentity;
          }
          /* 面积单位处理 */
          this.formData.plowMuNumber = this.formData.plowMuNumber + '亩';
          this.formData.baseArea = this.formData.baseArea + '㎡';
        })
    },
    submitFn() {
      let params = {...this.formData};
      params.plowMuNumber = params.plowMuNumber.split("亩").join("");
      params.baseArea = params.baseArea.split("㎡").join("");
      params.custAttaches = JSON.stringify(params.custAttaches);
      this.$axios.post(this.api_get_data, params)
        .then(res => {
          // this.getUserInfo();
          this.$toast('保存成功');
          this.$router.push({name:'个人中心'});
        })
    },
    areaConfirm(val){
      this.formData.addrProvince = val[0] ? val[0].code : '';
      this.formData.addrProvinceName = val[0] ? val[0].name : '';
      this.formData.addrCity = val[1] ? val[1].code : '';
      this.formData.addrCityName = val[1] ? val[1].name : '';
      this.formData.addrCounty = val[2] ? val[2].code : '';
      this.formData.addrCountyName = val[2] ? val[2].name : '';
      this.formData.areaCode = val[2] ? val[2].code : '';
      this.formData.areaPath = this.formData.addrProvinceName +'>'+ this.formData.addrCityName +'>'+ this.formData.addrCountyName;
    },
    /* 头像上传 */
    onRead_custAvatar(fileData) {
      this.$toast({
        message:'上传中...',
        forbidClick:true,
        duration:30000,
      })
      let formdata = new FormData();
      formdata.append('file',fileData.file);
      console.log(formdata,256)
      this.$axios.uploadFile(this.uploadImage,formdata)
        .then(res=>{
          this.$toast.clear();
          this.formData.custAvatar = res[0].path;
          this.formData.custAvatarUrl = res[0].pathUrl;
          this.$store.dispatch('showMsgTips','上传成功！')
        })
        .catch(err=>{
          this.$toast.clear();
          this.$store.dispatch('showMsgTips','上传失败！')
        })
    },
    /* 附件上传 */
    onReadFun(file) {
      // console.log(file,123);
      this.formData.custAttaches = [];
      file.forEach((item,index) => {
        let fileObj = {
          custAttachId: item.custAttachId || '',
          attachName: item.name,
          attachPath: item.path,
          attachPathUrl: item.pathUrl,
          custId: this.userData.custId,
          attachSeq: index
        }
        this.formData.custAttaches.push(fileObj)
      });
    },
    toObject() {
      this.$router.push({name:'目的选择',query:{custName:this.formData.custName,custIdentity:this.formData.custIdentity,realNameAuth:this.formData.realNameAuth}});
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-user-info{
    height: 100%;
    background: #f1f5f8;
    overflow: auto;
    .page-content{
      margin: 0.24rem 0 0.2rem;
      .van-cell{
        color: #313131;
        .title-div{
          position: relative;
          .cust-name{
            max-width: 1.6rem;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          .title-mark{
            display: inline-block;
            width: 0.8rem;
            height: 0.4rem;
            background: #FEEDCD;
            border-radius: 20px;
            border: 0.02rem solid #FEB424;
            color: #FEB424;
            text-align: center;
            line-height: 0.36rem;
            position: absolute;
            top: 0.04rem;
            right: 0rem;
          }
        }
      }
      .intro-div{
        display: flex;
        padding: 0.2rem 0.3rem;
        box-sizing: border-box;
        line-height: 0.48rem;
        position: relative;
        background-color: #fff;
        color: #313131;
        font-size: 14px;
        overflow: hidden;
        .title-div{
          width: 30%;
        }
        .details-div{
          p{
            padding-bottom: 0.2rem;
          }
          .remark-span{
            height: 0.44rem;
            .photo-img{
              max-width: 0.5rem;
              max-height: 0.44rem;
              vertical-align: top;
            }
            .photo-text{
              display: inline-block;
              line-height: 0.44rem;
              color: #D8D8D8;
            }
          }
        }
      }
    }
    .page-button{
      .btn-default{
        height: 0.98rem;
        line-height: 0.98rem;
        color: #fff;
        text-align: center;
        background: #34C975;
      }
    }
  }
</style>
<style lang="scss">
  .page-user-info{
    .page-content{
      .van-cell-group{
        .intro-div{
          .details-div{
            .intro-p{
              .van-cell{
                padding:0;
                .van-field__body{
                   color: #939393;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
