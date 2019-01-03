<template>
  <div class="course_management">
      <el-form inline>
          <el-form-item>
              <el-button type="primary" @click="addCourse">添加课程</el-button>
          </el-form-item>
      </el-form>
      <el-table :data="tableData">
          <el-table-column label="课程标题" prop="courseTitle"></el-table-column>
          <el-table-column label="封面图" prop="courseAttachPathUrl">
            <template slot-scope="scope">
            <img class="table_img" :src="scope.row.courseAttachPathUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column label="课程分类" prop="courseType"></el-table-column>
          <el-table-column label="发布时间" prop="createdDate">
                <template slot-scope="scope">
                    {{$commonFun.formatDate(scope.row.createdDate,'yyyy-MM-dd')}}
                </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editCourse(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteCourse(scope.row)">删除</el-button>
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
        apiList: '/found/courses/list', // 6.1. 课程列表
        apiDelete: '/found/courses/delete', // 6.5. 课程删除
        searchFormData:{
            page: 1,
            size: 10,
            courseTitle: '',
            courseAttachPath: '',
            courseAttachPathUrl: '',
            courseId:'',
            courseType:'',
            courseTypeName:'',
            createdDate:''
        },
        pageTotal: 0,
        tableData:[],
    }
  },
  created(){
    this.getData();
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{
      getData() {
        this.$axios.get(this.apiList,{params:this.searchFormData})
            .then(res => {
                this.tableData = res.data.data.list;
                this.pageTotal = res.data.data.total;
            })
      },
      handleCurrentChange(val){
        this.searchFormData.page = val;
        this.getData();
      },
      handleSizeChange(val){
        this.searchFormData.size = val;
        this.searchFormData.page = 1;
        this.getData();
      },
      addCourse(){
        this.$router.push({name:'编辑课程'})
    },
    editCourse(rowData){
        this.$router.push({name:'编辑课程',query:{courseId:rowData.courseId}})
    },
    deleteCourse(rowData){
        this.$confirm('确定删除这条课程信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            }).then(() => {
                this.$axios.post(this.apiDelete, {courseId:rowData.courseId})
                    .then(res => {
                        this.$message({
                        type: 'success',
                        message: res.message || '删除成功'
                        });
                        this.getData();
                    })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消操作'
            });          
        });
    }
  }
}
</script>
<style lang="scss" scoped>
.course_management{
 .table_img{
    height:80px;
 }
}
</style>