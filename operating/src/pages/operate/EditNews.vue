<template>
  <div class="edit_news">
      <el-form :model="submitForm" ref="submitForm" :rules="rules" label-width="100px">
        <el-form-item label="新闻标题：" prop="newsTitle">
         <el-col :span="12">
           <el-input v-model.trim="submitForm.newsTitle"></el-input>
         </el-col> 
        </el-form-item>
        <el-form-item label="新闻类型：" prop="newsType">
         <el-select v-model="submitForm.newsType" placeholder="请选择新闻类型"> 
           <el-option label="协农新闻" :value="0"></el-option>
           <el-option label="行业动态" :value="1"></el-option>
           <el-option label="政策法规" :value="2"></el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="封面图片：" prop="newsImagePath">
            <img class="upload_img" v-if="submitForm.newsImagePathUrl"  :src="submitForm.newsImagePathUrl" alt="">
            <el-upload
                :action="news_upload_url"
                :show-file-list="false"
                :before-upload="(file)=>{$commonFun.beforeImgUpload(file,2,['jpg','png'])}"
                :headers="{Authorization:$commonFun.getSessionStorage('user_token').token_type+' '+$commonFun.getSessionStorage('user_token').access_token}"
                :on-success="uploadSuccess"
                >
                <el-button size="small" type="primary">上 传</el-button>
                <div slot="tip" class="upload_tips" style="">点击上传广告图片，支持jpg，png格式的图片，建议分辨率：140px * 140px；不要超过2M</div>
            </el-upload>          
        </el-form-item>
        <el-form-item label="新闻详情：" prop="newsDetails">
          <el-col :span="12">
            <myEditor ref="newsEditor" :action="news_upload_url" @change="(content)=>{submitForm.newsDetails=content}"></myEditor>
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
      news_detail_url:'/operation/news/info',
      news_upload_url:this.$config.baseUrl+'/attachments/news',
      news_update_url:'/operation/news/update',
      news_add_url:'/operation/news/create',
      submitForm:{
        newsDetails:'',
        newsId:'',
        newsImagePath:'',
        newsImagePathUrl:'',
        newsTitle:'',
        newsType:''
      },
      rules:{
          newsTitle:[
            {required:true,message:'请输入新闻标题',trigger:'blur'},
            {min:1,max:60,message:'新闻标题字数不能超过60',trigger:'change'},
            ],
          newsType:[{type:'number',required:true,message:'请选择新闻类型',trigger:'change'}],
          newsImagePath:[{required:true,message:'请上传封面图片',trigger:'change'}],
          newsDetails:[{required:true,message:'新闻详情不能为空',trigger:'change'}]
      }
    }
  },
  created(){
    if(this.$route.query.newsId){
        this.getDetail();       
    }
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    getDetail(){
      this.$axios.get(this.news_detail_url,{params:{newsId:this.$route.query.newsId}})
      .then(res=>{
        this.submitForm=res.data.data;
        this.$refs.newsEditor.setContent(this.submitForm.newsDetails);
      })
    },
    uploadSuccess(res,file,filelist){
        this.submitForm.newsImagePath=res.data[0].path;
        this.submitForm.newsImagePathUrl=res.data[0].pathUrl;
        console.log(this.submitForm)
    },
    submit(){
      this.$refs.submitForm.validate(valid=>{
        if(valid){
            this.$axios.post(this.$route.query.newsId?this.news_update_url:this.news_add_url,this.submitForm)
            .then(res=>{
              this.$message.success(this.$route.query.newsId?'编辑成功':'添加成功');
              this.$router.push({name:'资讯新闻'});
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit_news{
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