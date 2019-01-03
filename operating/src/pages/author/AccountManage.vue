<template>
  <div class="account_manage">
      <el-form inline>
          <el-form-item label="">
              <el-button type="primary" @click="openDialog(false)">新建账号</el-button>
          </el-form-item>             
      </el-form>

      <el-table :data="tableData">
          <el-table-column label="账号名称" align="center" prop="userPlatName"></el-table-column>
          <el-table-column label="使用者" align="center" prop="userPlatUser"></el-table-column>
          <el-table-column label="所属角色" align="center" prop="roleName"></el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openDialog(true,scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteAccount(scope.row)">删除</el-button>                
            </template>
          </el-table-column>
      </el-table>
      <!-- 弹框 -->
      <el-dialog 
      :title="isEdit?'编辑账号':'新建账号'"
      :visible.sync="dialogVisible"
      width="550px"
       >
      <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="100px">
        <el-form-item label="账号名称：" v-if="!isEdit" prop="userPlatName">
            <el-input placeholder="请输入登陆后台的账号名称，只能是字母或数字" v-model.trim="dialogForm.userPlatName"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="userPlatPassword" v-if="!isEdit">
            <el-input placeholder="请输入账号登陆密码"  v-model.trim="dialogForm.userPlatPassword"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="userPlatPassword" v-else :rules="{validator:this.$formRules.numberLetterCkecked('只能输入字母或数字'),trigger:'blur'}">
            <el-input placeholder="请输入账号登陆密码"  v-model.trim="dialogForm.userPlatPassword"></el-input>
        </el-form-item>             
        <el-form-item label="使用者：" prop="userPlatUser">
            <el-input placeholder="请输入使用者名称" v-model.trim="dialogForm.userPlatUser"></el-input>
        </el-form-item>
        <el-form-item label="所属角色：" prop="roleId">
            <el-select v-model="dialogForm.roleId" placeholder="请选择角色">
                <el-option v-for="(item,index) in rolesList" :key="index"  :label="item.roleName" :value="item.roleId"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="">
            <el-button type="primary" @click="submit">提 交</el-button>
        </el-form-item>           
      </el-form>
      </el-dialog>
      <!-- 分页 -->
    <div class="page_wrapper">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchParams.page"
            :page-sizes="$config.pageSize"
            :page-size="searchParams.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal">
            </el-pagination>     
        </div>    
    

  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  components:{},
  props:{},
  data(){
    return {
        account_list_url:'/setting/userPlatforms/list',
        role_list_url:'/setting/roles/list',
        account_detail_url:'/setting/userPlatforms/info',
        account_add_url:'/setting/userPlatforms/create',
        account_update_url:'/setting/userPlatforms/update',
        account_delete_url:'/setting/userPlatforms/delete',
        searchParams:{
            page:1,
            size:10
        },
        pageTotal:1,
        isEdit:false,    
        dialogVisible:false,
        dialogForm:{
            roleId:'',
            userPlatName:'',
            userPlatPassword:'',
            userPlatUser:''
        },
        rolesList:[],
        tableData:[],
        rules:{
            userPlatName:[
                {required:true,message:'请输入账号名称',trigger:'blur'},
                {validator:this.$formRules.numberLetterCkecked('只能输入字母或数字'),trigger:['blur','change']}
            ],
            userPlatPassword:[
                {required:true,message:'请输入密码',trigger:'blur'},
                {validator:this.$formRules.numberLetterCkecked('只能输入字母或数字'),trigger:['blur','change']}                
            ],
            userPlatUser:[{required:true,message:'请输入使用者名称',trigger:'blur'}],
            roleId:[{type:'number',required:true,message:'请选择所属角色',trigger:['blur']}]
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
                roleId:'',
                userPlatName:'',
                userPlatPassword:'',
                userPlatUser:''
            }
            this.$refs.dialogForm.resetFields();
        }
    }      
  },
  computed:{},
  methods:{
      /* 获取列表数据 */
      getList(){
          this.$axios.get(this.account_list_url,{params:this.searchParams})
          .then(res=>{
              console.log(res);
              this.tableData=res.data.data.list;
              this.pageTotal=res.data.data.total;
          })
      },
      /* 获取角色列表 */
      getRoleList(){
          this.$axios.get(this.role_list_url,{params:{page:1,size:100}})
          .then(res=>{
              this.rolesList=res.data.data.list;
          })
      },
      /* 打开对话框 */
      openDialog(bool,obj){
       this.isEdit=bool;
       this.getRoleList();
       if(this.isEdit){
           this.$axios.get(this.account_detail_url,{params:{userPlatId:obj.userPlatId}} )
           .then(res=>{
               console.log('detail',res);
               this.dialogForm=res.data.data;
           })
       }
       this.dialogVisible=true;
      },
      submit(){
          this.$refs.dialogForm.validate(valid=>{
              if(valid){
                  var obj=JSON.parse(JSON.stringify(this.dialogForm));
                  if(!this.isEdit){
                         obj.userPlatPassword=md5(obj.userPlatPassword);
                  }
                  this.$axios.post(this.isEdit?this.account_update_url:this.account_add_url,obj)
                  .then(res=>{
                      this.$message.success(this.isEdit?'编辑成功':'新增成功');
                      this.getList();
                      this.dialogVisible=false;
                  })
              }
          })
      },
      /* 删除账号 */
      deleteAccount(obj){
        this.$confirm('确定删除该账号?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
            this.$axios.post(this.account_delete_url,{userPlatId:obj.userPlatId,userRoleId:obj.userRoleId})
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
.account_manage{

}
</style>