<template>
  <div class="page-orderProtect">
    <van-cell-group class="cell_group">
      <van-cell>
        <template slot="title">
          <p class="gray fontsize-26">您维权的订单号： <span class="date_span">{{formData.orderNumber}}</span></p>
        </template>
      </van-cell>
      <van-field
        v-model="formData.rightInfo"
        label="问题描述："
        type="textarea"
        placeholder="请输入你要维权的问题描述"
        rows="3"
        autosize
        :error-message="errorMessage.rightInfo"
        @blur="checkExit('rightInfo')"
      />
      <van-cell>
        <template slot="title">
          <div>
            <span class="title_P">凭证：</span> 
            <MyUploader :apiUpload="apiUpload" :maxLength="2" :limit='4' :type="fileType" @changeFile="changeFileList"/>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <div class="bottom_box" @click="protectCommit">提交</div>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Uploader } from 'vant';
import MyUploader from '../../components/my-uploader';
import name from '../../assets/images/mineRz/wdrz-tp1@2x.png';
export default {
  data() {
    return {
      apiComfirm: '/order/orderRights/create',
      apiUpload: '/attachments/vindicate',
      fileType: ['jpeg','JPG', 'png',],
      formData: {
        rightInfo: ''
      },
      errorMessage: {
        rightInfo: '',
      },
      rules: {
        rightInfo: [
          { required: true, message: '请输入问题描述' },
          { maxlength: 100, message: '信息名称不能超过100个字' },
        ]
      },
      fileList: []
    }
  },
  computed: {

  },
  components: {
   'van-cell': Cell,
   'van-cell-group': CellGroup,
   'van-field': Field,
   'van-uploader': Uploader,
   MyUploader
  },
  created() {
    this.formData.orderId = this.$route.query.orderData || '';
    this.formData.orderNumber = this.$route.query.orderNumber || '';
  },
  methods: {
    /**
     * 提交
     */
    protectCommit() {
      if(this.checkExit('rightInfo')) {
        this.formData.attachPath1 = this.fileList[0]?this.fileList[0].path || '':'';
        this.formData.attachPath2 = this.fileList[1]?this.fileList[1].path || '':'';
        this.$axios.post(this.apiComfirm, this.formData).then(res => {
          this.$router.push({name: '提交成功', query: {type: 'protect'}})
        })
      }
    },
    
    /**
     * 表单校验
     */
    checkExit(name) {
      let rules = this.rules[name];
      for(let i = 0; i < rules.length; i++) {
        typeof this.formData[name] == 'string' ? this.formData[name] = this.trimStr(this.formData[name]): ''
        if(rules[i].required) {
          if(!this.formData[name]) {
            this.errorMessage[name] = rules[i].message;
            return false
          }
          else this.errorMessage[name] = '';
        }
        if(rules[i].maxlength) {
          if(this.formData[name].length > rules[i].maxlength) {
            this.errorMessage[name] = rules[i].message;
            return false
          }
          else this.errorMessage[name] = '';
        }
      }
      return true
    },
    /**
     * 去前后空格
     */
    trimStr(str) {
      return str?str.replace(/(^\s*)|(\s*$)/g,""):'';
    },
    changeFileList(data) {
      this.fileList = data;
    }
  }
}
</script>

<style lang="scss" scoped>
.cell_group {
  margin-top: 0.3rem;
}
.title_P {
  display: inline-block;
  width: 70px;
  margin-right: 20px;
  text-align: right;
}
.upload-img {
  width: 1.25rem;
  border: 1px solid;
}
.bottom_box {
  position: fixed;
  bottom:0;
  left:0;
  right:0;
  height:1rem;
  line-height: 1rem;
  text-align: center;
  color: #fff;
  background: rgba(52,201,117,1);
}
</style>
