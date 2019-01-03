<template>
  <div class="edit_expert">
      <el-form :model="submitForm" ref="submitForm" :rules="rules" label-width="100px">
        <el-form-item label="专家姓名：" prop="professorName">
         <el-col :span="12">
           <el-input v-model.trim="submitForm.professorName"></el-input>
         </el-col> 
        </el-form-item>
        <el-form-item label="性别：" prop="professorGender">
          <el-radio :label="1" v-model="submitForm.professorGender">男</el-radio>
          <el-radio :label="0" v-model="submitForm.professorGender">女</el-radio>
        </el-form-item>
        <el-form-item label="专家头像：" prop="professorAvatar">
            <img class="upload_img" v-if="submitForm.professorAvatarUrl" :src="submitForm.professorAvatarUrl" alt="">
            <el-upload
                :action="banner_upload_url"
                :show-file-list="false"
                :before-upload="(file)=>{$commonFun.beforeImgUpload(file,2,['jpg','png'])}"
                :headers="{Authorization:$commonFun.getSessionStorage('user_token').token_type+' '+$commonFun.getSessionStorage('user_token').access_token}"
                :on-success="bannerUploadSuccess">
                <el-button size="small" type="primary">上 传</el-button>
                <div slot="tip" class="upload_tips" style="">点击上传专家头像，支持jpg，png格式的图片，建议分辨率：182px * 182px；不要超过2M</div>
            </el-upload>          
        </el-form-item>
        <el-form-item label="专家介绍：" prop="professorIntroduce">
          <el-col :span="12">
            <!-- <myEditor ref="bannerEditor" :action="banner_upload_url" @change="(content)=>{submitForm.professorIntroduce=content}"></myEditor> -->
             <el-input v-model="submitForm.professorIntroduce" type="textarea" rows="8" maxlength="300"/>
             <span class="font-limit">{{submitForm.professorIntroduce.length}}/300</span>
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
      apiCreate: '/found/professors/create', // 6.8. 专家新增
      apiUpdate: '/found/professors/update', // 6.9. 专家编辑
      apiInfo: '/found/professors/info', // 6.7. 专家详情
      banner_upload_url:this.$config.baseUrl+'/attachments/banner', 
      submitForm:{
        professorName: '',//专家姓名
        professorGender:'',//性别(0：女，1：男)
        professorGenderName:'',//性别
        professorAvatar: '',//专家头像
        professorAvatarUrl:'',//专家头像
        professorId:'',//主键ID
        professorIntroduce:''//专家介绍
      },
      rules:{
        professorName:[{required:true,message:'专家姓名不能为空',trigger:'blur'}],
        professorGender:[{required:true,message:'性别不能为空',trigger:'blur'}],
        professorAvatar:[{required:true,message:'请上传专家头像',trigger:'blur'}],
        professorIntroduce:[{required:true,message:'专家介绍不能为空',trigger:'blur'}],
      }
    }
  },
  created(){
    this.getInfoData();
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    /**
    *获取专家详情 
    */
    getInfoData(){
      if(this.$route.query.professorId){
        this.$axios.get(this.apiInfo,{params:{professorId:this.$route.query.professorId}})
          .then(res => {
            this.submitForm = res.data.data;
            // this.$refs.bannerEditor.setContent(this.submitForm.professorIntroduce);
          })
      }
    },
    /* 上传成功 */
    bannerUploadSuccess(res,flie,filelist){
        this.submitForm.professorAvatar=res.data[0].path;
        this.submitForm.professorAvatarUrl=res.data[0].pathUrl;
    },
    /* 提交 */
    submit(){
     this.$refs.submitForm.validate(valid=>{
       if(valid){
          this.$axios.post(this.$route.query.professorId?this.apiUpdate:this.apiCreate,this.submitForm)
          .then(res=>{
              this.$message.success(this.$route.query.professorId?'编辑成功':'添加成功')
              this.$router.push({name:'专家库'});
          })
       }
     }) 
    }
  }
}
</script>
<style lang="scss" scoped>
.edit_expert{
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