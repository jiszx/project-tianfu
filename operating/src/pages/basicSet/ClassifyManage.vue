<template>
  <div class="classify_manage">
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="openDialog(false)">+ 添加一级分类</el-button>
      </el-form-item>
    </el-form>
    <el-tabs class="header_tabs"  v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane :name="item.commoTyId" 
       v-for="(item,index) in classifyData"
        :key="index"
      >
         <span slot="label">{{item.commoTyName}}
            <span v-if="activeTab==item.commoTyId">
              <i class="el-icon-plus tab_icon" @click.stop="openDialog(false,item)"></i>
              <i class="el-icon-edit tab_icon" @click.stop="openDialog(true,item)"></i>
            <i class="el-icon-delete tab_icon" @click.stop="removeNode(false,item)"></i>
            </span>
         </span>
      </el-tab-pane>
    </el-tabs>
    <!-- 树形 -->
    <el-tree 
    :data="treeData"
    node-key="commoTyId" 
    :props="defaultProps" 
    lazy
    :expand-on-click-node="false"
    :default-expanded-keys="defaultExpand"
    :load="loadTree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span class="tree_span">
          <el-button
            type="text"
            @click="() => openDialog(false,data)">
            <i class="el-icon-plus"></i>
          </el-button>
          <el-button
            type="text"
            @click="() => openDialog(true,data)">
            <i class="el-icon-edit"></i>
          </el-button>          
          <el-button
            type="text"
            @click="() => removeNode(true,data)">
            <i class="el-icon-delete"></i>
          </el-button>
        </span>
      </span>      
    </el-tree>
    <!-- 对话框 -->
    <el-dialog 
     :title="isEdit?'编辑分类':'新增分类'"
     :visible.sync="dialogVisible"
     width="500px"
    >
    <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="100px">
        <el-form-item label="分类名称：" prop="commoTyName">
          <el-input placeholder="请输入分类名称" v-model.trim="dialogForm.commoTyName"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐：" v-if="dialogForm.commoTyLevel === 2">
            <el-radio-group v-model="dialogForm.isRecommend">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>          
        </el-form-item>
        <el-form-item label="分类图片：" prop="commoTyAttachPath">
            <img class="upload_img" v-if="dialogForm.commoTyAttachPath" :src="dialogForm.commoTyAttachPathUrl" alt=""/>
            <el-upload
                :action="classify_upload_url"
                :show-file-list="false"
                :on-success="classifyUploadSuccess"
                :before-upload="(file)=>{$commonFun.beforeImgUpload(file,2,['jpg','png'])}"
                :headers="{Authorization:$commonFun.getSessionStorage('user_token').token_type+' '+$commonFun.getSessionStorage('user_token').access_token}"
                >
                <el-button size="small" type="primary">更换图标</el-button>
                <div slot="tip" class="upload_tips" style="">点击上传分类图片，支持jpg，png格式的图片，不要超过2M</div>
            </el-upload>            
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="submit">保存</el-button>
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
      api_classify_list_url:'/commodityTypes/list',
      api_classify_delete_url:'/commodity/commodityTypes/delete',
      api_classify_add_url:'/commodity/commodityTypes/create',
      api_classify_update_url:'/commodity/commodityTypes/update',
      classify_upload_url:this.$config.baseUrl+'/attachments/commodityType',
      activeTab:'1',
      isEdit:false,
      classifyData:[],
      defaultProps:{
        label:'commoTyName',
        isLeaf:'leaf'
      },
      treeData:[],
      dialogForm:{
        commoTyName:'',
        isRecommend:'',
        commoTyAttachPath:'',
        commoTyPathName:'',
        commoTyPath:-1,
        commoTyLevel:1,
        commoTyParentId:-1
      },
      dialogVisible:false,
      currentNode:'',
      defaultExpand:[],
      rules:{
        commoTyName:[{required:true,message:'分类名称不能为空',trigger:'blur'}]
      }
    }
  },
  created(){
   this.getList();
  },
  mounted(){},
  watch:{
    dialogVisible(val){
      if(!val){
        this.dialogForm={
        commoTyName:'',
        isRecommend:'',
        commoTyAttachPath:'',
        commoTyPathName:'',
        commoTyPath:-1,
        commoTyLevel:1,
        commoTyParentId:-1
      }
      this.$refs.dialogForm.resetFields();
      }
    },
    activeTab(){
      this.defaultExpand=[];
    }
  },
  computed:{},
  methods:{
    /* 获取tab数据 */
    getList(active){
      this.$axios.get(this.api_classify_list_url,{
        params:{commoTyParentId:-1}
      }).then(res=>{
        this.classifyData=JSON.parse(JSON.stringify(res.data.data.list));
        this.classifyData.map(item=>{
          item.commoTyId=item.commoTyId+'';
          return item
        })
        if(!active){
          this.activeTab=this.classifyData[0].commoTyId;
        }
        this.getTreeData(active?active:this.activeTab);
      })
    },
    /* 获取分类树数据 */
    getTreeData(id){
      this.$axios.get(this.api_classify_list_url,{
        params:{commoTyParentId:id}
      }).then(res=>{
          this.treeData=res.data.data.list;
      })
    },
    /* 加载树 */
    loadTree(node, resolve){
      this.defaultExpand.push(node.key);
      if(node.key&&node.level >=1){
        this.$axios.get(this.api_classify_list_url,{params:{commoTyParentId:node.key}})
        .then(res=>{
          resolve(res.data.data.list)
        })
      }
    },
    tabClick(tab, event){
      this.getTreeData(tab.name);
    },
    openDialog(bool,obj){
      this.currentNode='';
     this.isEdit=bool;
     if(this.isEdit){
       console.log(obj);
       this.dialogForm=JSON.parse(JSON.stringify(obj));
     }else{
       if(obj){  //子树添加
         console.log(obj);
         this.currentNode=obj;
         this.dialogForm.commoTyLevel=obj.commoTyLevel+1;
         this.dialogForm.commoTyParentId=obj.commoTyId;
         this.dialogForm.commoTyPath=obj.commoTyPath;
       }
     }
     this.dialogVisible=true;
    },
    classifyUploadSuccess(res,file,filelist){
      this.dialogForm.commoTyAttachPath=res.data[0].path;
      this.dialogForm.commoTyAttachPathUrl=res.data[0].pathUrl;
    },
    submit(){
      this.$refs.dialogForm.validate(valid=>{
        if(valid){
            if(!this.isEdit){
               this.dialogForm.commoTyPathName=this.currentNode?(this.currentNode.commoTyPathName+'>'+this.dialogForm.commoTyName):this.dialogForm.commoTyName;
            }
            if(this.dialogForm.commoTyLevel != 2) this.dialogForm.isRecommend = 0;
            let saveData = {};
            if(this.isEdit) {
              saveData.commoTyAttachPath = this.dialogForm.commoTyAttachPath;
              saveData.commoTyId = this.dialogForm.commoTyId;
              saveData.commoTyName = this.dialogForm.commoTyName;
              saveData.isRecommend = this.dialogForm.isRecommend;
            }
          this.$axios.post(this.isEdit?this.api_classify_update_url:this.api_classify_add_url,this.isEdit?saveData:this.dialogForm)
          .then(res=>{
            this.$message.success(this.isEdit?'编辑成功':'添加成功');
            if(res.data.data.commoTyParentId==-1){
              this.activeTab=res.data.data.commoTyId+'';
            }
            this.getList(this.activeTab);
            this.dialogVisible=false;
          })
        }
      })
    },
    removeNode(bool,data){
        this.$confirm('确定删除该节点?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
           this.$axios.post(this.api_classify_delete_url,{commoTyId:data.commoTyId,commoTyPathName:data.commoTyPathName})
           .then(res=>{
             this.$message.success('删除成功');
             if(bool){
               this.getTreeData(this.activeTab);
             }else{
               this.getList();
             }
           })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });      
    }
  }
}
</script>
<style lang="scss" scoped>
.classify_manage{
 .header_tabs{
   .tab_icon{
     margin-left: 5px;
   }
 }
 .custom-tree-node{
   .tree_span{
     margin-left:10px;
   }
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