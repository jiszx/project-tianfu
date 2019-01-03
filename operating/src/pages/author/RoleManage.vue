<template>
  <div class="role_manage">
      <el-form inline>
          <el-form-item>
              <el-button type="primary" @click="openDialog(false)">新建角色</el-button>
          </el-form-item>
      </el-form>
      <el-table :data="tableData">
        <el-table-column label="角色名称" align="center" prop="roleName"></el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                 <el-button type="primary" size="mini" @click="openDialog(true,scope.row)">编辑</el-button>
                 <el-button type="danger" size="mini" @click="deleteRole(scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 弹框 -->
      <el-dialog 
       :title="isEdit?'编辑角色':'新建角色'"
       :visible.sync="dialogVisible"
       width="550px"
      >
       <el-form :model="dialogForm" ref="dialogForm"  :rules="rules" label-width="100px">
           <el-form-item label="角色名称：" prop="roleName">
               <el-input placeholder="请输入角色名称" v-model.trim="dialogForm.roleName"></el-input>
           </el-form-item>
           <el-form-item label="角色权限：" prop="rolePerm">
                <el-tree
                    :data="treeData"
                    v-if="dialogVisible"
                    ref="roleTree"
                    show-checkbox
                    node-key="name"
                    @check-change="handleCheckChange"
                    :props="defaultProps"
                    >
                </el-tree>               
           </el-form-item>
           <el-form-item label="">
              <el-button type="primary" @click="dialogSubmit">提 交</el-button>
           </el-form-item>
       </el-form>
      </el-dialog>
      <!-- 分页 -->
    <div class="page_wrapper">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.searchParams.page"
            :page-sizes="$config.pageSize"
            :page-size="this.searchParams.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage">
            </el-pagination>     
        </div>      
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
        roles_list_url:'/setting/roles/list',
        roles_detail_url:'/setting/roles/info',
        roles_add_url:'/setting/roles/create',
        roles_update_url:'/setting/roles/update',
        roles_delete_url:'/setting/roles/delete',
        searchParams:{
            page:1,
            size:10
        },
        totalPage:1,
        isEdit:false,
        tableData:[],
        treeData:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },     
        dialogVisible:false,
        dialogForm:{
            roleName:'',
            rolePerm:''
        },
        rules:{
            roleName:[{required:true,message:'角色名称不能为空',trigger:'blur'}],
            rolePerm:[{type:'array',required:true,message:'请至少选择一个角色权限',trigger:'change'}]
        }
    }
  },
  created(){
      this.getList();
    this.getTreeData();
  },
  mounted(){},
  watch:{
      dialogVisible(val){
       if(!val){   //清空对话框表单
          this.dialogForm={
            roleName:'',
            rolePerm:''
           }
           this.$refs.dialogForm.resetFields();
       }
      }
  },
  computed:{},
  methods:{
      /* 获取列表数据 */
      getList(){
          this.$axios.get(this.roles_list_url,{params:this.searchParams})
          .then(res=>{
              this.tableData=res.data.data.list;
              this.totalPage=res.data.data.total;
          })
      },
      /* 获取树结构数据 */
      getTreeData(){
        var arr =JSON.parse(JSON.stringify(this.$router.options)).routes;
         arr.forEach(item => {
           if(item.name=='APP'){
               this.treeData=item.children;
           }    
         });
         this.initUnAuthor(this.treeData);
      },
      /* 去除非权限控制模块 */
      initUnAuthor(arr){
          for(var i=0;i<arr.length;i++){
                if(arr[i].meta&&arr[i].meta.replaceAuthor){
                        arr.splice(i,1)  
                        i--;     // 如果不减，将漏掉一个元素    
                }
                if(arr[i].children){
                    this.initUnAuthor(arr[i].children);
                }                
          }
      },
      /* 打开对话框 */
      openDialog(bool,obj){
        this.isEdit=bool;
        if(this.isEdit){
            this.$axios.get(this.roles_detail_url,{params:{roleId:obj.roleId}})
            .then(res=>{
                res.data.data.rolePerm.split(',');
                this.dialogForm=res.data.data;
                    this.$refs.roleTree.setCheckedKeys(this.dialogForm.rolePerm.split(','));
                
            })
        }
             this.dialogVisible=true;   
        
      },
      handleCheckChange(){
          this.dialogForm.rolePerm=this.$refs.roleTree.getCheckedKeys();
      },
      /* 对话框提交 */
      dialogSubmit(){
          this.$refs.dialogForm.validate(valid=>{
              if(valid){
                  var obj= JSON.parse(JSON.stringify(this.dialogForm))
                     obj.rolePerm=obj.rolePerm.join(',');
                this.$axios.post(this.isEdit?this.roles_update_url:this.roles_add_url,obj)
                .then(res=>{
                    this.$message.success(this.isEdit?'编辑成功':'新建成功');
                    this.getList();
                    this.dialogVisible=false;
                })                    
              }
          })
      },
      deleteRole(obj){
        this.$confirm('确定删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
            this.$axios.post(this.roles_delete_url,{roleId:obj.roleId})
            .then(res=>{
                this.$message.success('删除成功');
                this.getList();
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      handleSizeChange(val){
          this.searchParams.page=1;
          this.searchParams.size=val;
          this.getList();
      },
      handleCurrentChange(val){
          this.searchParams.page=val;
          this.getList();
      }
  }
}
</script>
<style lang="scss" scoped>
.role_manage{}
</style>