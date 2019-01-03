<template>
  <div class="edit_advertisement">
      <el-form :model="submitForm"  ref="submitForm" :rules="rules" label-width="100px">
        <el-form-item label="广告标题：" prop="bannerTitle">
         <el-col :span="12">
           <el-input v-model.trim="submitForm.bannerTitle"></el-input>
         </el-col> 
        </el-form-item>
        <el-form-item label="广告图片：" prop="bannerImagePath" >
            <img class="upload_img" v-if="submitForm.bannerImagePathUrl" :src="submitForm.bannerImagePathUrl" alt="">
            <el-upload
                :action="banner_upload_url"
                :show-file-list="false"
                :before-upload="(file)=>{$commonFun.beforeImgUpload(file,2,['jpg','png'])}"
                :headers="{Authorization:$commonFun.getSessionStorage('user_token').token_type+' '+$commonFun.getSessionStorage('user_token').access_token}"
                :on-success="bannerUploadSuccess"
                >
                <el-button size="small" type="primary">上 传</el-button>
                <div slot="tip" class="upload_tips" style="">点击上传广告图片，支持jpg，png格式的图片，建议分辨率：750px*238px；不要超过2M</div>
            </el-upload>          
        </el-form-item>
        <el-form-item label="广告详情：" prop="bannerDetails">
          <el-col :span="12">
            <myEditor ref="bannerEditor" :action="banner_upload_url" @change="(content)=>{submitForm.bannerDetails=content}"></myEditor>
          </el-col>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="submit">提 交</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import myEditor from '../../components/my-editor'
export default {
  components:{myEditor},
  props:{},
  data(){
    return {
      api_banner_detail_url:'/operation/banners/info', //banner详情
      banner_upload_url:this.$config.baseUrl+'/attachments/banner', 
      banner_update_url:'/operation/banners/update',
      banner_add_url:'/operation/banners/create',
      submitForm:{
        bannerId:'',
        bannerTitle:'',
        bannerImagePath:'',
        bannerImagePathUrl:'',
        bannerDetails:'',
        bannerSeq:''
      },
      rules:{
        bannerTitle:[{required:true,message:'广告标题不能为空',trigger:'blur'}],
        bannerImagePath:[{required:true,message:'请上传广告图片',trigger:'blur'}],
        bannerDetails:[{required:true,message:'广告详情不能为空',trigger:'blur'}],
      }
    }
  },
  created(){
    if(this.$route.query.bannerSeq!=0){
      if(!this.$route.query.bannerSeq){
        this.$router.push({name:'首页管理'});
      }
    }
  },
  mounted(){
     if(this.$route.query.bannerId){
        this.getDetail();
     }else{
       this.submitForm.bannerSeq=this.$route.query.bannerSeq;
     }    
  },
  watch:{},
  computed:{},
  methods:{
    /* 获取详情 */
    getDetail(){
      this.$axios.get(this.api_banner_detail_url,{params:{bannerId:this.$route.query.bannerId}})
      .then(res=>{
        this.submitForm={
            ...res.data.data,
            bannerSeq:this.$route.query.bannerSeq
        }
        this.$refs.bannerEditor.setContent(this.submitForm.bannerDetails);
      })
    },
    /* 上传成功 */
    bannerUploadSuccess(res,flie,filelist){
        this.submitForm.bannerImagePath=res.data[0].path;
        this.submitForm.bannerImagePathUrl=res.data[0].pathUrl;
    },
    /* 提交 */
    submit(){
     this.$refs.submitForm.validate(valid=>{
       if(valid){
          this.$axios.post(this.$route.query.bannerId?this.banner_update_url:this.banner_add_url,this.submitForm)
          .then(res=>{
              this.$message.success(this.$route.query.bannerId?'编辑成功':'添加成功')
              this.$router.push({name:'首页管理'});
          })
       }
     }) 
    }
  }
}
</script>
<style lang="scss" scoped>
.edit_advertisement{
  .upload_img{
      max-height:100px;    
  }
  .upload_tips{
      color:#909399;
      font-size: 12px;
      line-height: 20px;
  }  
}
</style>