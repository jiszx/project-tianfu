/*
 * apiUpload 上传接口 必传
width 图片宽度
height 图片高度
maxLength 最多上传图片数量 - 不传代表无限制
limit 上传图片大小限制 - 不传代表无限制
type 上传格式限制 - 不传代表无限制
@changeFile 获取上传的图片列表
 */
<template>
  <div class="upload-box">
    <div class="upload-inside">
      <div class="file-list" v-for="(item, index) in fileList" :key="index">
        <img src="../assets/images/order/fbdt-gb@2x.png" alt="" class="del-file" @click="deleteFile(item)">
        <img class="upload-img" :style="style" :src="item.pathUrl" alt="">
      </div>
      <van-uploader :after-read="onRead" accept="image/gif, image/jpeg, image/png" multiple v-if="fileList.length < maxLength && maxLength">
        <img class="upload-img" :style="style" src="../assets/images/mineRz/smrz-zxj@2x.png" alt="">
      </van-uploader>
      <!-- <input type="file" accept="image/*" v-on:change="onRead"/> -->
    </div>
  </div>
</template>

<script>
import { Uploader } from 'vant';
import name from '../assets/images/mineRz/wdrz-tp1@2x.png';
export default {
  props: {
    apiUpload: [String],
    maxLength: [String, Number],
    width: {
      type:[String],
      default: ''
    },
    height: {
      type:[String],
      default: ''
    },
    limit: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: [Array, String],
      default: ''
    },
    attachs: [Array]
  },
  data() {
    return {
      fileList: [
        // { pathUrl: name, path: '' }
      ],
      style: '',
      fileNum: 0,
    }
  },
  watch: {
    attachs(val) {
      this.fileList = val;
    }
  },
  components: {
   'van-uploader': Uploader
  },
  created() {
    if(this.attachs) {
      this.fileList = this.attachs;
    }
    this.style = {
      width:this.width ?this.width:'',
      height:this.height ?this.height:''
    };
  },
  methods: {
    /**
     * 上传前
     */
    beforeRead(file) {
      let typelist = false, typeToast = this.type;
      if(this.type) {
        if(typeof this.type == 'object') {
          this.type.map(item => {
            if(file.type ==='image/'+item) typelist = true;
          })
        } else {
          typelist = file.type ==='image/'+this.type
        }
      }
      const isJPGPNG = this.type ? typelist : true;
      // const isJPGPNG = file.type === 'image/JPG'
      const isLt3M = this.limit ? file.size / 1024 / 1024 < this.limit : true;
      const maxlength = this.maxLength ? this.fileNum <= this.maxLength : true;
      if (!isJPGPNG) {
        this.$toast.fail('上传图片只能是 '+ typeToast +' 格式!')
      }
      if (!isLt3M) {
        this.$toast.fail('上传图片大小不能超过'+this.limit+'MB!')
      }
      if (!maxlength) {
        this.$toast.fail('上传图片最多'+this.maxLength+'张')
      }
      return isJPGPNG && isLt3M && maxlength
    },
    // 上传
    onRead(file) {
      let checkResult = '', fileList = [];
      if(file.length) {
        fileList = file;
      } else {
        fileList = [file];
      }
      this.fileNum += fileList.length;
      for(let i = 0; i < fileList.length; i++) {
        checkResult = this.checkOutUpload(fileList[i].file);
        if(!checkResult) {
          this.fileNum -= fileList.length;
          return
        }
      }
      if(checkResult) {
        this.$toast({
          message:'上传中...',
          forbidClick:true,
          duration:30000,
        })
        let formdata = new FormData();
        fileList.map(file => {
          formdata.append('file', file.file);
        })
        this.$axios.uploadFile(this.apiUpload, formdata).then(res => {
          res.map(item => {
            this.$toast.clear();
            this.fileList.unshift(item);
          })
          this.fileNum = this.fileList.length;
          this.$emit('changeFile', this.fileList);
        })
      }
    },
    checkOutUpload(file) {
      return this.beforeRead(file)
    },
    deleteFile(item) {
      this.fileList.splice(this.fileList.findIndex(v=> {return item.pathUrl == v.pathUrl}), 1);
      this.fileNum = this.fileList.length;
      this.$emit('changeFile', this.fileList);
    }
  }
}
</script>


<style lang="scss" scoped>

.upload-box {
  display: inline-block;
  .upload-inside {
    display: flex;
    flex-wrap: wrap;
    .file-list {
      position: relative;
      margin-right: 0.3rem;
      .del-file {
        width: 0.345rem;
        right: -0.172rem;
        top: -0.172rem;
        position: absolute;
      }
    }
    .upload-img {
      width: 1.25rem;
      height: 1.25rem;
      margin-bottom: 10px;
    }
  }
}
</style>

