<template>
  <div class="page-realName-index">
    <div class="auth-row page-content">
      <div class="auth-image">
        <img :src="authData[type].image" alt="">
      </div>
      <div class="auth-main">
        <p>{{authData[type].title}}</p>
        <p v-if="isEdit === 'info'" class="gray fontsize-24">{{authData[type].description}}</p>
        <p v-else class="gray fontsize-24" v-for="(item, index) in authData[type].descrip" :key="index">{{item}}</p>
      </div>
      <div class="auth-btn">
        <img v-if="formData.auditStatus === 1" src="../../assets/images/mineRz/wdrz-yrz@2x.png" alt="">
        <img v-if="formData.auditStatus === 2" src="../../assets/images/mineRz/wdrz-dsh@2x.png" alt="">
      </div>
    </div>
    <div class="auth-row auth-form">
      <!-- 实名认证 -->
      <van-cell-group v-if="type === 'name'" class="auth-form-item">
        <van-field
          v-if="isEdit === 'new'"
          v-model="formData.name"
          label="姓名:"
          placeholder="请输入姓名"
          @blur="checkExit('name')"
          :error-message="errorMessage.name"
        />
        <van-cell v-else title="姓名:" :value="formData.name" />
        <van-field
          v-if="isEdit === 'new'"
          v-model="formData.idCard"
          label="身份证号:"
          placeholder="请输入身份证号"
          @blur="checkExit('idCard')"
          :error-message="errorMessage.idCard"
        />
        <van-cell v-else title="身份证号:" :value="formData.idCard" />
        <div v-if="isEdit === 'new'" class="auth-upload">
          <p>请上传证件材料</p>
          <p class="gray fontsize-24">身份证正面照片、身份证反面照片</p>
          <div class="upload-dec paddingT10">
            <div class="text-center">
              <MyUploader :apiUpload="apiUpload" :maxLength="1" :limit='4' :type="fileType" @changeFile="onReadFront"/>
              <p class="gray fontsize-24">身份证正面照</p>
            </div>
            <div class="text-center">
              <MyUploader :apiUpload="apiUpload" :maxLength="1" :limit='4' :type="fileType" @changeFile="onReadBack"/>
              <p class="gray fontsize-24">身份证反面照</p>
            </div>
          </div>
          <p class="err-msg marginL20">{{ errorMessage.idFront || errorMessage.idBack }}</p>
        </div>
        <!-- 详情显示图片 -->
        <div v-else class="van-cell cell-upload-dec">
          <p>身份证照:</p>
          <div class="upload-dec">
            <div class="text-center marginR20">
              <img :src="formData.idFrontUrl" alt="">
              <p class="gray fontsize-24">身份证正面照</p>
            </div>
            <div class="text-center">
              <img :src="formData.idBackUrl" alt="">
              <p class="gray fontsize-24">身份证反面照</p>
            </div>
          </div>
        </div>
      </van-cell-group>
      <!-- 企业认证 / 资质认证 -->
      <van-cell-group v-if="type === 'company' || type === 'aptitude'" class="auth-form-item">
        <van-field
          v-if="isEdit === 'new' && type === 'company'"
          v-model="formData.enterpriseName"
          label="企业名称:"
          placeholder="请输入企业名称"
          @blur="checkExit('enterpriseName')"
          :error-message="errorMessage.enterpriseName"
          />
        <van-cell v-if="isEdit === 'info' && formData.auditStatus !== 0 && type === 'company'" title="企业名称:" :value="formData.enterpriseName" />
        <van-field
            v-if="isEdit === 'new' && type === 'aptitude'"
            v-model="formData.operator"
            label="经营者:"
            placeholder="请输入经营者名称"
            @blur="checkExit('operator')"
            :error-message="errorMessage.operator"
          />
        <van-cell v-if="isEdit === 'info' && formData.auditStatus !== 0 && type === 'aptitude'" title="经营者:" :value="formData.operator" />
        <van-field
          v-if="isEdit === 'new'"
          v-model="formData.legalName"
          label="法人代表:"
          placeholder="请输入法人代表姓名"
          @blur="type ==='company'?checkExit('legalName'):''"
          :error-message="errorMessage.legalName"
        />
        <van-cell v-else title="法人代表:" :value="formData.legalName" />
        <van-field
          v-if="isEdit === 'new'"
          v-model="formData.creditCode"
          label="信用代码:"
          placeholder="请输入企业统一信用代码/注册号"
          @blur="type==='company'?checkExit('creditCode'):''"
          :error-message="errorMessage.creditCode"
        />
        <van-cell v-else title="信用代码:" :value="formData.creditCode" />
        <!-- 新增 -->
        <div v-if="isEdit === 'new'" class="auth-upload">
          <p>请上传证件材料</p>
          <p class="gray fontsize-24">{{type === 'company'?'个人工商户不具备企业法人资格，不属于企业范畴，无法通过认证':'如：农药经营许可证、种子经营许可证等'}}</p>
          <div class="upload-dec company-upload">
            <p>{{type === 'company'?'营业执照':'资质证'}}</p>
            <div>
              <MyUploader width="1.1rem" height="1.1rem" :apiUpload="apiUpload" :maxLength="type === 'company'?1:5" :limit='4' :type="fileType" @changeFile="onRead"/>
            </div>
          </div>
          <p class="err-msg err-license">{{ errorMessage.businessLicense || errorMessage.aptitudeLicense }}</p>
          <div class="upload-dec company-upload">
            <p>身份证或授权证明</p>
            <div>
              <MyUploader width="1.1rem" height="1.1rem" :apiUpload="apiUpload" :maxLength="1" :limit='4' :type="fileType" @changeFile="onReadFun"/>
            </div>
          </div>
          <p class="err-msg err-license">{{ errorMessage.idCardOrLicense }}</p>
        </div>
        <!-- 详情 -->
        <div v-else class="cell-upload-dec auth-upload">
          <div class="upload-dec company-upload">
            <p>{{type === 'company'?'营业执照':'资质证'}}</p>
            <img v-if="type === 'company'" :src="formData.businessLicenseUrl" alt="">
            <div v-else class="aptitude-list">
              <img v-for="(item, index) in formData.aptitudeLicenseArray" :src="item" alt="">
              <img v-for="(item, index) in formData.aptitudeLicenseArray" :src="item" alt="">
            </div>
          </div>
          <div class="upload-dec company-upload">
            <p>身份证或授权证明</p>
            <img :src="formData.idCardOrLicenseUrl" alt="">
          </div>
        </div>
      </van-cell-group>
      <!-- VIP -->
      <van-cell-group v-if="type === 'vip'" class="auth-form-item">
        <van-field
          v-if="isEdit === 'new'"
          label="认证费:"
          :disabled="true"
          :placeholder="authFee+'元'"
        />
        <van-cell v-if="isEdit === 'info'" title="认证费:" :value="formData.authFee" />
        <van-cell v-if="isEdit === 'info'" title="支付方式:" :value="formData.authPayMode?'支付宝':'微信'" />
        <van-cell v-if="isEdit === 'info'" title="支付时间:" :value="$mUtils.formatDate(formData.authPayTime)" />
        <van-cell v-if="isEdit === 'info'" title="支付凭证:" :value="formData.paymentDoc" />
      </van-cell-group>
      <div></div>
    </div>
    <!-- <div v-if="type === 'vip'&&authData[type].info.length&&isEdit === 'new'" class="page-content">
      <p class="gray fontsize-24 marginB20">VIP说明：</p>
      <p class="gray fontsize-24 marginB10" v-for="(item, index) in authData[type].info" :key="index">{{item}}</p>
    </div> -->
    <div v-if="isEdit === 'new'&&type === 'vip'" class="submiting-btn text-center white" @click="payNow">立即支付</div>
    <div v-if="isEdit === 'new'&&type !== 'vip'" class="submiting-btn text-center white" @click="submitAuth">确认提交</div>
  </div>
</template>

<script>
import name from '../../assets/images/mineRz/wdrz-tp1@2x.png';
import company from '../../assets/images/mineRz/wdrz-tp2@2x.png';
import aptitude from '../../assets/images/mineRz/wdrz-zzrz@2x.png';
import vip from '../../assets/images/mineRz/wdrz-vip@2x.png';
import { Cell, CellGroup, Field, Icon } from 'vant';
import MyUploader from '../../components/my-uploader';
export default {
  data() {
    let that = this;
    var checkCrad = function(data) {
      return that.$mUtils.checkType(data, 'card')
    }
    var checkChinaName = function(data) {
      let str = data ? data.toString() : '';
      return /^[a-zA-Z\u4e00-\u9fa5]+$/.test(str)
    }
    return {
      type: '',
      isEdit: '',
      authFee: '',
      apiInfo: {
        name: '/user/realNameAuths/info',
        company: '/user/enterpriseAuths/info',
        aptitude: '/user/aptitudeAuths/info',
        vip: '/user/vipAuths/info',
      },
      apiSave: {
        name: '/user/realNameAuths/save',
        company: '/user/enterpriseAuths/save',
        aptitude: '/user/aptitudeAuths/save',
        vip: '/user/vipAuths/pay',
      },
      apiUpload: '/attachments/auth',
      apiGetVip: '/setting/configs/info',
      fileType: ['jpeg', 'JPG', 'png',],
      // auditStatus 审核状态(0：未通过，1：已通过，2：待审核)
      authData: {
        name: {
          image: name,
          title: '实名认证',
          description: '人像信息审核',
          descrip: ['1，填写姓名、身份证号码', '2，上传身份证正面照片和反面照片'],
          auditStatus: 1,
        },
        company: {
          image: company,
          title: '企业认证',
          description: '企业资质审核',
          descrip: ['1，企业营业执照', '2，法人本人身份证或授权证明'],
          auditStatus: 1,
        },
        aptitude: {
          image: aptitude,
          title: '资质认证',
          description: '其它资质审核',
          descrip: ['1，相关资质证，如：经营许可证', '2，法人本人身份证或授权证明'],
          auditStatus: 1,
        },
        vip: {
          image: vip,
          title: 'VIP身份',
          description: '专属特权',
          descrip: ['1，付费认证', '2，成为vip后可直接联系供需交流'],
          info: ['1，可以享受直接联系供需交流', '2，可以改变xxxxx'],
          auditStatus: 1,
        }
      },
      formData: {
        // 实名
        name: '',
        idCard: '',
        idFront: '',
        idBack: '',
        // 企业
        enterpriseName: '',
        legalName: '',
        creditCode: '',
        businessLicense: '',
        idCardOrLicense: '',
        // 资质
        operator: '',
        aptitudeLicense: '',
      },
      errMsg: {
        name: {
          // 实名
          name: '',
          idCard: '',
          idFront: '',
          idBack: '',
        },
        company: {
          // 企业
          enterpriseName: '',
          legalName: '',
          creditCode: '',
          businessLicense: '',
          idCardOrLicense: '',
        },
        aptitude: {
          // 资质
          operator: '',
          aptitudeLicense: '',
        },
      },
      errorMessage: {},
      rules: {
        name: [
          { required: true, message: '请输入姓名' },
          { maxlength: 10, message: '姓名不能超过10个字' },
          { fun: checkChinaName, message: '请输入正确的姓名' },
        ],
        idCard: [
          { required: true, message: '请输入身份证号码' },
          { fun: checkCrad, message: '请输入正确的身份证号码' }
        ],
        idFront: [
          { required: true, message: '请上传身份证正面照' }
        ],
        idBack: [
          { required: true, message: '请上传身份证反面照' }
        ],
        enterpriseName: [
          { required: true, message: '请输入企业名称' },
          { maxlength: 50, message: '企业名称不能超过50个字' },
        ],
        legalName: [
          { required: true, message: '请输入法人代表名称' },
          { maxlength: 20, message: '法人代表名称不能超过20个字' },
        ],
        creditCode: [
          { required: true, message: '请输入信用代码' },
          { length: 18, message: '信用代码长度为18位' },
          // { fun: checkCrad, message: '请输入正确的身份证号码' }
        ],
        operator: [
          { required: true, message: '请输入经营者名称' },
          { maxlength: 50, message: '经营者名称不能超过50个字' },
        ],
        businessLicense: [
          { required: true, message: '请上传营业执照' },
        ],
        aptitudeLicense: [{ required: true, message: '请上传资质证明' }],
        idCardOrLicense: [{ required: true, message: '请上传身份证或授权证明' }],
      },
    }
  },
  components: {
    'van-cell': Cell,
    'van-cell-group': CellGroup,
    'van-field': Field,
    'van-icon': Icon,
    MyUploader
  },
  created() {
    this.type = this.$route.query.name;
    this.isEdit = this.$route.query.type;
    this.errorMessage = this.errMsg[this.type] || '';
    if(this.isEdit === 'info') this.getInfo();
    else if(this.type === 'vip') this.getVipPrice()
  },
  methods: {
    getVipPrice() {
      this.$axios.get(this.apiGetVip).then(res => {
        this.authFee = res.authFee;
      })
    },
    // 身份证正面
    onReadFront(file) {
      // console.log(file)
      this.formData.idFront = file[0] ? file[0].path || '' : '';
      // this.formData.idFrontUrl = file.content;
      // console.log(this.formData.idFrontUrl)
    },
    // 身份证背面
    onReadBack(file) {
      this.formData.idBack = file[0] ? file[0].path || '' : '';
    },
    // 营业执照 / 资质证
    onRead(file) {
      if(this.type === 'company') this.formData.businessLicense = file[0] ? file[0].path || '' : '';
      else {
        this.formData.aptitudeLicense = '';
        if(file.length) {
          let arr = [];
          file.map(item => {
            arr.push(item.path);
          })
          this.formData.aptitudeLicense = arr.join(',');
        }
      }
    },
    // 身份证信息
    onReadFun(file) {
      this.formData.idCardOrLicense = file[0] ? file[0].path || '' : '';
    },
    /**
     * 获取详情
     */
    getInfo() {
      this.$axios.get(this.apiInfo[this.type]).then(res => {
        this.formData = res;
        // console.log(res)
      })
    },
    submitAuth() {
      let flag = true;
      for(let i in this.errorMessage) {
        if(!this.checkExit(i)) {
          flag = false;
        }
      }
      if(!flag) {
        this.$toast('请完善表单');
        return
      }
      this.$axios.post(this.apiSave[this.type], this.formData).then(res => {
        this.$toast.success('提交成功！');
        this.$router.go(-1);
      })
    },
    /**
     * 去支付
     */
    payNow() {
      this.$router.push({
        name:'在线支付',
        query:{type: 'vip'}
      })
    },
    /**
     * 表单校验
     */
    checkExit(name) {
      let rules = this.rules[name];
      for(let i = 0; i < rules.length; i++) {
        typeof this.formData[name] == 'string' ? this.formData[name] = this.$mUtils.trimStr(this.formData[name]): ''
        if(rules[i].required) {
          if(!this.formData[name]) {
            this.errorMessage[name] = rules[i].message;
            return false
          }
        }
        if(rules[i].maxlength) {
          if(this.formData[name].length > rules[i].maxlength) {
            this.errorMessage[name] = rules[i].message;
            return false
          }
        }
        if(rules[i].length) {
          // console.log(rules[i].length)
          if(this.formData[name].length !== rules[i].length) {
            this.errorMessage[name] = rules[i].message;
            return false
          }
        }
        if(rules[i].fun) {
          if(!rules[i].fun(this.formData[name])) {
            this.errorMessage[name] = rules[i].message;
            return false
          }
        }
      }
      this.errorMessage[name] = '';
      return true
    },
  }
}
</script>

<style lang="scss" scoped>
  .page-realName-index {
    background: #f2f6f9;
    position: relative;
    margin-bottom: 0.94rem;
    .auth-row {
      background: #fff;
      margin-bottom: 0.3rem;
      padding: 0.54rem 0.3rem;
      display: flex;
      align-items: flex-start;
      img {
        width: 1.24rem;
      }
      .auth-image {
        // flex-grow: 1;
        margin-right: 0.3rem;
        img {
          width: 1.1rem;
        }
      }
      .auth-main {
        flex-grow: 4;
        font-size: 17px;
        p {
          margin-bottom: 5px;
        }
      }
      .auth-btn {
        flex-grow: 1;
        span {
          display: inline-block;
          width: 1.9rem;
          height: 0.64rem;
          line-height: 0.6rem;
          border-radius: 0.32rem;
          color: #34c975;
          border: 1px solid #34c975;
          text-align: center;
        }
      }
    }
    .auth-form {
      padding-right: 0;
      padding-top: 0;
      padding-bottom: 0;
      .auth-form-item {
        width: 100%;
      }
      .auth-upload {
        padding: 10px 15px;
        line-height: 24px;
        .upload-dec {
          display: flex;
          justify-content: space-around;
          padding: 0.2rem 0.8rem 0.2rem;
          img {
            width: 1rem;
            margin-top: 8px;
          }
        }
        .company-upload {
          justify-content: flex-start;
          padding: 0.2rem 0;
          align-items: center;
          p {
            flex-grow: 1;
            width: 0;
          }
          >div {
            flex-grow: 1;
            width: 0;
          }
          .aptitude-list {
            flex-grow: 2;
            display: flex;
            flex-wrap: wrap;
            // justify-content: space-between;
            img {
              margin-right: 10px;
            }
          }
        }
      }
      .cell-upload-dec {
        justify-content: space-between;
        img {
          width: 1.9rem;
          max-height: 1.3rem;
        }
        .upload-dec {
          display: flex;
          img {
            width: 1.9rem;
            max-height: 1.3rem;
          }
        }
      }
      .company-cell {
        padding: 10px 15px;
      }
    }
    .submiting-btn {
      width: 100%;
      background: #34c975;
      height: 0.94rem;
      line-height: 0.94rem;
      position: fixed;
      bottom: 0;
    }
  }
  .err-msg {
    font-size: 12px;
    color: #f44;
  }
  .err-license {
    margin-left: 2.5rem;
  }
</style>
