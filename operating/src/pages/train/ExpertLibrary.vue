<template>
  <div class="dexpert_library">
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="addExpert">添加专家</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData">
      <el-table-column label="专家姓名" prop="professorName"></el-table-column>
      <el-table-column label="专家头像" prop="professorAvatarUrl">
      <template slot-scope="scope">
      <img class="table_img" :src="scope.row.professorAvatarUrl" alt="">
      </template>
      </el-table-column>
      <el-table-column label="性别" prop="professorGenderName">
        <template slot-scope="scope">
          {{scope.row.professorGenderName == 0 ? '女' : '男' }} <!-- 性别(0：女，1：男) -->
        </template>
      </el-table-column>
      <el-table-column label="专家介绍" prop="professorIntroduce">
        <template slot-scope="scope">
          <p v-html="scope.row.professorIntroduce" class="intro-export"></p>
        </template>
      </el-table-column>
      <el-table-column label="获赞数量" prop="likeNum"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editExpert(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteExpert(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

      <!-- 分页 -->
    <div class="page_wrapper">
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$config.pageSize"
        :page-size="searchFormData.size"
        :current-page.sync="searchFormData.page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
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
      apiList: '/found/professors/list', // 6.6. 专家列表
      apiDelete: '/found/professors/delete', // 6.10. 专家删除
      searchFormData:{
          page: 1,
          size: 10,
          custName: '',
          custPhone: '',
          custStatus: '',
      },
      pageTotal: 0,
      tableData:[],
    }
  },
  created(){
    this.handleCurrentChange();
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    handleCurrentChange(){
      this.$axios.get(this.apiList,{params:this.searchFormData})
        .then(res => {
          this.tableData = res.data.data.list;
          this.pageTotal = res.data.data.total;
        })
    },
    handleSizeChange(val){
      this.searchFormData.page = 1;
      this.searchFormData.size = val;
      this.handleCurrentChange();
    },
    addExpert(){
      this.$router.push({name:'编辑专家'})
    },
    editExpert(rowData){
      this.$router.push({name:'编辑专家',query:{professorId:rowData.professorId}})
    },
    deleteExpert(rowData){
      this.$confirm('确定删除这条专家信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        }).then(() => {
          this.$axios.post(this.apiDelete, {professorId:rowData.professorId})
            .then(res => {
              this.$message({
              type: 'success',
              message: res.message || '删除成功'
              });
              this.handleCurrentChange();
            })
        }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.dexpert_library{
  .table_img{
      height:80px;
  }
}
.intro-export {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>