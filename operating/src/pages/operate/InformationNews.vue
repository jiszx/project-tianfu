<template>
  <div class="infomation_news">
    <el-form inline> 
      <el-form-item>
        <el-button type="primary" @click="addNew">添加新闻</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" >
      <el-table-column label="新闻标题" prop="newsTitle"></el-table-column>
      <el-table-column label="封面图">
        <template slot-scope="scope">
          <img class="table_img" :src="scope.row.newsImagePathUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column label="新闻类型" prop="newsTypeName"></el-table-column>
      <el-table-column label="发布时间" >
        <template slot-scope="scope">
          {{$commonFun.formatDate(scope.row.createdDate,'yyyy-MM-dd hh-mm')}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editNew(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteNew(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
export default {
  components:{},
  props:{},
  data(){
    return {
      news_list_url:'/operation/news/list',
      news_delete_url:'/operation/news/delete',
      delete_news_url:'',
      searchParams:{
        page:1,
        size:10
      },
      pageTotal:1,
      tableData:[{img:require('../../assets/u1677.png')}],
      currentPage4:1
    }
  },
  created(){
    this.getList();
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    getList(){
      this.$axios.get(this.news_list_url,{params:this.searchParams})
      .then(res=>{
        console.log(res);
        this.tableData=res.data.data.list;
        this.pageTotal=res.data.data.total;
      })
    },
    addNew(){
     this.$router.push({name:'编辑新闻',query:{replaceName:'添加新闻'}})
    },
    editNew(obj){
     this.$router.push({name:'编辑新闻',query:{newsId:obj.newsId}})
    },
    deleteNew(obj){
        this.$confirm('确定删除这条新闻?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axios.post(this.news_delete_url,{newsId:obj.newsId})
          .then(res=>{
             this.$message.success('删除成功');
             this.getList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
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
.infomation_news{
  .table_img{
    height:80px;
  }
}
</style>