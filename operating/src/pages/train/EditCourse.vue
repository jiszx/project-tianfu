<template>
  <div class="edit_course">
      <el-form :model="submitForm" ref="submitForm" :rules="rules" label-width="100px">
        <el-form-item label="课程标题：" prop="courseTitle">
         <el-col :span="12">
           <el-input v-model.trim="submitForm.courseTitle"></el-input>
         </el-col> 
        </el-form-item>
        <el-form-item label="课程分类：" prop="courseType">
         <el-select v-model="submitForm.courseType" placeholder="请选择课程分类">
            <el-option
              v-for="item in courseOptions"
              :key="item.courseType"
              :label="item.courseTypeName"
              :value="item.courseType">
            </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="封面图片：" prop="courseAttachPath">
            <img class="upload_img" v-if="submitForm.courseAttachPathUrl"  :src="submitForm.courseAttachPathUrl" alt="">
            <el-upload
                :action="banner_upload_url"
                :show-file-list="false"
                :before-upload="(file)=>{$commonFun.beforeImgUpload(file,2,['jpg','png'])}"
                :headers="{Authorization:$commonFun.getSessionStorage('user_token').token_type+' '+$commonFun.getSessionStorage('user_token').access_token}"
                :on-success="bannerUploadSuccess">
                <el-button size="small" type="primary">上 传</el-button>
                <div slot="tip" class="upload_tips" style="">点击上传广告图片，支持jpg，png格式的图片，建议分辨率：378px * 210px；不要超过2M</div>
            </el-upload>          
        </el-form-item>
        <el-form-item label="课程详情：" prop="courseDetails">
          <el-col :span="12">
            <myEditor ref="bannerEditor" :action="banner_upload_url" @change="(content)=>{submitForm.courseDetails=content}"></myEditor>
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
      apiCreate: '/found/courses/create', // 6.3. 课程新增
      apiUpdate: '/found/courses/update', // 6.4. 课程编辑
      apiInfo: '/found/courses/info', // 6.2. 课程详情
      banner_upload_url:this.$config.baseUrl+'/attachments/banner', 
      submitForm:{
        courseTitle: '',//课程标题
        courseType:'',//课程分类（课程分类，科研、劳保、植保、仓储、加工、农机）
        courseTypeName:'',//课程分类
        courseAttachPath: '',//课程封面图
        courseAttachPathUrl:'',//课程封面图
        courseId:'',//主键ID
        courseDetails:''//课程详情
      },
      rules:{
        courseTitle:[
          {required:true,message:'课程标题不能为空',trigger:'blur'},
          {min:1,max:60,message:'课程标题字数不能超过60',trigger:'change'},
          ],
        courseType:[{required:true,message:'课程分类不能为空',trigger:'blur'}],
        courseAttachPath:[{required:true,message:'请上传封面图',trigger:'blur'}],
        courseDetails:[{required:true,message:'课程详情不能为空',trigger:'blur'}],
      },
      courseOptions:[
        {
          courseType: '科研',
          courseTypeName: '科研'
        },
        {
          courseType: '劳保',
          courseTypeName: '劳保'
        },
        {
          courseType: '植保',
          courseTypeName: '植保'
        },
        {
          courseType: '仓储',
          courseTypeName: '仓储'
        },
        {
          courseType: '加工',
          courseTypeName: '加工'
        },
        {
          courseType: '农机',
          courseTypeName: '农机'
        }
      ]
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
    *获取课程详情 
    */
    getInfoData(){
      if(this.$route.query.courseId){
        this.$axios.get(this.apiInfo,{params:{courseId:this.$route.query.courseId}})
        .then(res => {
          this.submitForm = res.data.data;
          this.$refs.bannerEditor.setContent(this.submitForm.courseDetails);
        })
      }
    },
    /* 上传成功 */
    bannerUploadSuccess(res,flie,filelist){
        this.submitForm.courseAttachPath=res.data[0].path;
        this.submitForm.courseAttachPathUrl=res.data[0].pathUrl;
    },
    /* 提交 */
    submit(){
     this.$refs.submitForm.validate(valid=>{
       if(valid){
          this.$axios.post(this.$route.query.courseId?this.apiUpdate:this.apiCreate,this.submitForm)
          .then(res=>{
              this.$message.success(this.$route.query.courseId?'编辑成功':'添加成功')
              this.$router.push({name:'课程管理'});
          })
       }
     }) 
    }
  }
}
</script>
<style lang="scss" scoped>
.edit_course{
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