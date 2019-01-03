<template>
  <div class="home_page_manage">
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="APP" name="0"></el-tab-pane>
        <el-tab-pane label="官网" name="1"></el-tab-pane>
    </el-tabs>
    <el-table :data="homeData">
        <el-table-column label="广告位编号" prop="bannerSeq">
            <template slot-scope="scope">
                {{'广告位'+(scope.$index+1)}}
            </template>
        </el-table-column>
        <el-table-column label="广告标题" prop="bannerTitle"></el-table-column>
        <el-table-column label="广告图片">
            <template slot-scope="scope">
                <img class="table_img" :src="scope.row.bannerImagePathUrl" alt="">
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" v-if="scope.row.bannerId"  size="mini" @click="editBanner(true,scope.row)">编辑</el-button>
                <el-button type="danger" v-if="scope.row.bannerId" size="mini" @click="deleteAdver(scope.row)">删除</el-button>
                <el-button type="primary" v-else size="mini" @click="addBanner(false,scope.row)">添加广告</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- APP导航 -->
    <el-tabs v-model="activeNav"  style="margin-top:40px;">
        <el-tab-pane label="APP导航" name="1"></el-tab-pane>
    </el-tabs>
    <el-table :data="appNavData">
        <el-table-column label="导航编号" >
            <template slot-scope="scope">
                {{scope.$index+1}}
            </template>
        </el-table-column>
        <el-table-column label="导航名称" prop="navName"></el-table-column>
        <el-table-column label="图标">
            <template slot-scope="scope">
                <img class="nav_img" :src="scope.row.navAttachPathUrl" alt="">
            </template>            
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="openDialog(true,scope)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 图片广告 -->
    <el-tabs v-model="activeNav"  style="margin-top:40px;" >
        <el-tab-pane label="图片广告" name="1"></el-tab-pane>
    </el-tabs>
    <el-table :data="imgTableData">
        <el-table-column label="广告位编号" >
            <template slot-scope="scope">
                {{scope.$index+1}}
            </template>
        </el-table-column>
        <el-table-column label="广告图片建议分辨率" >
            <template slot-scope="scope">
                {{scope.$index == 0 ? '376px * 343px' : '375px * 171px'}}
            </template>
        </el-table-column>
        <el-table-column label="广告标题" prop="navName"></el-table-column>
        <el-table-column label="广告图片">
            <template slot-scope="scope">
                <img class="nav_img" :src="scope.row.navAttachPathUrl" alt="">
            </template>            
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" size="mini"  @click="openDialog(false,scope)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 官网 添加/编辑弹框 -->
    <el-dialog 
    title="官网banner"
    :visible.sync="officalVisible"
    width="530px"
     >
     <el-form :model="officalForm" :rules="rules" ref="officalForm" label-width="100px">
        <el-form-item label="广告位置：">
            <span class="dialog_tips">广告位{{officalForm.bannerSeq}}</span>
        </el-form-item>
        <el-form-item label="广告标题：" prop="bannerTitle">
            <el-input v-model.trim="officalForm.bannerTitle"></el-input>
        </el-form-item> 
        <el-form-item label="广告图片：" prop="bannerImagePath">
            <img class="upload_img" v-if="officalForm.bannerImagePathUrl" :src="officalForm.bannerImagePathUrl" alt="">
            <el-upload
                :action="banner_upload_url"
                :show-file-list="false"
                :on-success="bannerUploadSuccess"
                :before-upload="(file)=>{$commonFun.beforeImgUpload(file,5,['jpg','png'])}"
                :headers="{Authorization:$commonFun.getSessionStorage('user_token').token_type+' '+$commonFun.getSessionStorage('user_token').access_token}"
                >
                <el-button size="small" type="primary">更换图标</el-button>
                <div slot="tip" class="upload_tips" style="">点击上传广告图片，支持jpg，png格式的图片，建议分辨率：1920px*750px；不要超过5M</div>
            </el-upload>            
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" @click="officalDialogSubmit">提 交</el-button>
        </el-form-item>       
     </el-form>
    </el-dialog>    
    <!-- APP导航/图片广告弹框 -->
    <el-dialog 
    :title="isAppNav?'APP导航':'图片广告'"
    :visible.sync="dialogVisible"
    width="530px"
    >
    <el-form :model="dialogForm"  ref="dialogForm"  :rules="rules" label-width="130px">
        <el-form-item v-if="isAppNav" label="导航编号：">
            <span class="dialog_tips">位置{{dialogForm.index+1}}</span>
        </el-form-item>
        <el-form-item v-else label="广告位置：">
            <span class="dialog_tips">广告位{{dialogForm.index+1}}</span>
        </el-form-item>        
        <el-form-item label="导航名称：" prop="navName">
            <el-input v-if="isAppNav" v-model.trim="dialogForm.navName"></el-input>
            <el-select v-if="!isAppNav" v-model="dialogForm.navName" @change="navNameChange">
                <el-option v-for="(item,index) in navOption" :key="index"  :value="item.label">{{item.label}}</el-option>
            </el-select>
        </el-form-item>

        <el-form-item  label="商品分类：" prop="commoTyPath" v-if="isAppNav">
                <el-cascader
                    :options="goodsOption"
                    v-model="dialogForm.commoTyPath"
                    :props="defaultProps"
                    change-on-select
                    >
                </el-cascader>            
        </el-form-item>
        <el-form-item  v-if="!isAppNav" label="链接地址：">
            <span class="dialog_tips">{{dialogForm.navLink}}</span>
        </el-form-item> 
        <el-form-item :label="isAppNav?'导航图标：':'广告图片：'" prop="navAttachPath">
            <img class="upload_img" v-if="dialogForm.navAttachPathUrl"  :src="dialogForm.navAttachPathUrl" alt="">
            <el-upload
                :action="banner_upload_url"
                :show-file-list="false"
                :on-success="appNavUploadSuccess"
                :before-upload="(file)=>{$commonFun.beforeImgUpload(file,5,['jpg','png'])}"
                :headers="{Authorization:$commonFun.getSessionStorage('user_token').token_type+' '+$commonFun.getSessionStorage('user_token').access_token}"
                >
                <el-button size="small" type="primary">更换图标</el-button>
                <div slot="tip" class="upload_tips" style="">点击上传导航图标，支持jpg，png格式的图片</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" @click="navSubmit">提 交</el-button>
        </el-form-item>
    </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
        api_banner_list_url:'/operation/banners/list',  //banner列表
        api_banner_detail_url:'/operation/banners/info', //banner详情
        banner_upload_url:this.$config.baseUrl+'/attachments/banner', 
        banner_update_url:'/operation/banners/update',
        banner_add_url:'/operation/banners/create',
        banner_delete_url:'/operation/banners/delete',
        appNav_img_list_url:'/operation/navs/list',
        appNav_img_detail_url:'/operation/navs/info',
        appNav_img_update_url:'/operation/navs/update',
        api_classify_list_url:'/commodityTypes/all',
        /* appNav_img_add_url:'/operation/navs/create',
        appNav_img_delete_url:'/operation/navs/delete', */
        activeName:'0',
        activeNav:'1',
        homeData:[],
        appNavData:[],
        imgTableData:[],
        isEdit:false,
        officalForm:{
            bannerId:'',
            bannerTitle:'',
            bannerImagePath:'',
            bannerImagePathUrl:'',
            bannerSeq:''
        },
        officalVisible:false,
        isAppNav:false,
        dialogVisible:false,
        goodsOption:[],
        navOption:[
            {label:'专家咨询栏目',url:'/expertsAsk'},
            {label:'协农新闻/爱公益',url:'/newsList'},
            {label:'采购大厅',url:'/purchasingHall'},
        ],
        defaultProps:{
          label:'commoTyName',
          value: 'commoTyPath',
          children: 'children'
        },
        dialogForm:{
            navName:'',
            navLink:'',
            navTarget:'',
            navAttachPath:'',
            navAttachPathUrl:'',
            commoTyPath:[]

        },
        rules:{
          bannerImagePath:[{required:true,message:'广告图片不能为空',trigger:'change'}],
          navName:[{required:true,message:'请输入导航名称',trigger:['blur']}],
          commoTyPath:[{type:'array',required:true,message:'请选择商品分类',trigger:'blur'}],
          navAttachPath:[{required:true,message:'请上传图片',trigger:'change'}],
        }
    }
  },
  created(){
      this.getBannerList();
      this.getNavImgList(0);
      this.getNavImgList(1);
  },
  mounted(){},
  watch:{
      officalVisible(val){
       if(!val){
           this.officalForm={
            bannerId:'',
            bannerTitle:'',
            bannerImagePath:'',
            bannerImagePathUrl:'',
            bannerSeq:''
        }
        this.$refs.officalForm.resetFields();
       }
      },
      dialogVisible(val){
          if(!val){
              this.$refs.dialogForm.resetFields();
          }
      }
  },
  computed:{},
  methods:{
      /* 获得banner列表 */
      getBannerList(){
          this.$axios.get(this.api_banner_list_url,{params:{bannerType:this.activeName}})
          .then(res=>{
              this.homeData=res.data.data.list;
              var num=this.activeName==0?5:4;
              for(var i =0;i<num;i++){
                  if(i==this.homeData.length){
                     this.homeData.push({bannerSeq:i==0?0:this.homeData[i-1].bannerSeq+1})
                  }
              }
          })
      },
      /* tab切换 */
      handleClick(tab,event){
      this.getBannerList();
      },
      editBanner(bool,obj){
       if(this.activeName=='0'){
          this.$router.push({name:'编辑广告',query:{replaceName:'编辑广告',bannerId:obj.bannerId,bannerSeq:obj.bannerSeq}})

       }else{
         this.openBannerDialog(bool,obj)
       }
      },
      addBanner(bool,obj){
        if(this.activeName=='0'){
          this.$router.push({name:'编辑广告',query:{replaceName:'添加广告',bannerSeq:obj.bannerSeq}}) 
        }else{
            this.openBannerDialog(bool,obj)
        }
      },
      /* 官网banner打开弹框 */
      openBannerDialog(bool,obj){
        this.isEdit=bool;
        if(this.isEdit){   //编辑
          this.$axios.get(this.api_banner_detail_url,{params:{bannerId:obj.bannerId}})
          .then(res=>{
              console.log(res);
              this.officalForm={
                  ...res.data.data,
                  bannerSeq:obj.bannerSeq
              }
              this.officalVisible=true;
          })
        }else{  //新增
         this.officalForm.bannerSeq=obj.bannerSeq;
         this.officalForm.bannerType=1;
         this.officalVisible=true;
        }
      },
      /* 图片上传成功 */
      bannerUploadSuccess(res,flie,filelist){
        this.officalForm.bannerImagePath=res.data[0].path;
        this.officalForm.bannerImagePathUrl=res.data[0].pathUrl;
      },
      /* 官网banner弹框提交 */
      officalDialogSubmit(){
        this.$refs.officalForm.validate(valid=>{
            if(valid){
              this.$axios.post(this.isEdit?this.banner_update_url:this.banner_add_url,this.officalForm)
                .then(res=>{
                    this.$message.success(this.isEdit?'编辑成功':'添加成功')
                    this.getBannerList();
                    this.officalVisible=false;

                })
            }
        })  
      } , 
      /* banner删除 */
      deleteAdver(obj){
        this.$confirm('确定删除这条广告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axios.post(this.banner_delete_url,{bannerId:obj.bannerId})
          .then(res=>{
              this.$message.success('删除成功');
              this.getBannerList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      },
      getNavImgList(type){   // 0:app导航   1 图片广告
        this.$axios.get(this.appNav_img_list_url,{params:{navType:type}})
        .then(res=>{
            if(type==0){
                if(res.data.data.list.length>=7){
                    this.appNavData=res.data.data.list.splice(0,7);
                }else{
                    this.appNavData=res.data.data.list;
                    for(var i=0;i<7;i++){
                        if(i==this.appNavData.length){
                            this.appNavData.push({navSeq:i==0?0:this.appNavData[i-1].navSeq+1})
                        }  
                    }
                }
            }else{
                if(res.data.data.list.length>=3){
                    this.imgTableData=res.data.data.list.splice(0,3);
                }else{
                    this.imgTableData=res.data.data.list;
                    for(var i=0;i<3;i++){
                        if(i==this.imgTableData.length){
                            this.imgTableData.push({navSeq:i==0?0:this.imgTableData[i-1].navSeq+1})
                        }  
                    }
                }                
            }
        })
      },
      getClassifyGoods(){
          this.$axios.get(this.api_classify_list_url,{params:{}})
          .then(res=>{         
                  this.goodsOption=this.eachArr(res.data.data.list) ;
          })
      },
      eachArr(arr){
          arr.forEach(item=>{
              if(!item.leaf){
                  this.eachArr(item.children)
              }else{
                  delete item.children;
              }
          })
          return arr;
      },
      navNameChange(item){
          switch (item) {
              case '专家咨询栏目':
                  this.dialogForm.navLink=this.navOption[0].url;
                  break;
              case '协农新闻/爱公益':
                  this.dialogForm.navLink=this.navOption[1].url;  
              break;
              case '采购大厅':
                  this.dialogForm.navLink=this.navOption[2].url;    
              break;

              default:
                  break;
          }  
      },
        /* 打开app导航,图片广告弹框 */
      openDialog(bool,obj){
      this.isAppNav=bool;
      if(this.isAppNav){
          this.getClassifyGoods(); 
      }
      if(obj.row.navId){
        this.$axios.get(this.appNav_img_detail_url,{params:{navId:obj.row.navId}})
        .then(res=>{
           var arr=res.data.data.commoTyPath.split('_');
            var result=[];
               arr.pop();
               arr.shift();
               var result=[];
           arr.forEach((item,index)=>{
              result.push(index==0?`_${item}_`:result[index-1]+`${item}_`)
           })
           res.data.data.commoTyPath=result;
            this.dialogForm={
                ...res.data.data,
                index:obj.$index
                }
                // console.log(this.dialogForm)
            this.dialogVisible=true;
        })
      }else{
          this.dialogForm={
              ...obj.row,
              navAttachPathUrl:'', 
              navType: this.isAppNav?0:1,
              index:obj.$index
          }
          this.dialogVisible=true;
      }
      },
      /* appNav对话框上传成功 */
      appNavUploadSuccess(res,file,filelist){
          this.dialogForm.navAttachPath=res.data[0].path;
          this.dialogForm.navAttachPathUrl=res.data[0].pathUrl;
      },
      navSubmit(){
          var obj=JSON.parse(JSON.stringify(this.dialogForm));
              if(obj.commoTyPath && this.isAppNav){
                  obj.commoTyPath=obj.commoTyPath.pop();
                  if(obj.commoTyPath.split('_').length <= 3) {
                    this.$message.error('无法设置一级分类，请选择二级以下分类')
                    return
                  }
              }
              if(!this.isAppNav) obj.commoTyPath=""
            //   obj.navTarget=this.isAppNav?1:5;
          this.$refs.dialogForm.validate(valid=>{
              if(valid){
                  this.$axios.post(this.appNav_img_update_url,obj)
                  .then(res=>{
                      this.$message.success('编辑成功');
                      this.getNavImgList(this.isAppNav?0:1);                        
                      this.dialogVisible=false;
                  })
              }
          })
      }  
  }
}
</script>
<style lang="scss" scoped>
.home_page_manage{
  .table_img{
      max-height: 60px;
  }
  .nav_img{
      max-height: 30px;
  }
  .dialog_tips{
      color:#909399;
      display: inline-block;
      width:100%;
      word-wrap: break-word;
  }
  .upload_img{
      height:80px;
  }
  .upload_tips{
      color:#909399;
      font-size: 12px;
      line-height: 20px;
  }
}
</style>