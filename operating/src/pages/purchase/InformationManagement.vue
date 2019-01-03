<template>
  <div class="purchase_hall">
    <ul class="info_list">
      <li v-for="(item,index) in listData" :key="index">
        <p class="top_p">
           <img :src="item.custAvatarUrl || defaultAvatar" alt="">
           <span class="company_name">{{item.custName}}</span>
           <span style="margin-left:15px;">{{item.areaPath}}</span>
           <span class="pull_right">联系电话：{{item.custPhone}}</span>
        </p>
        <el-row class="content_p">
          <el-col :span="6">
            <span>要货品种：{{item.commoTyName}}</span>
          </el-col>
          <el-col :span="6">
            <span>要货数量：{{item.commoNum+item.commoUnit}}</span>
          </el-col>   
          <el-col :span="6">
            <span>指定产地：{{item.custAreaPath}}</span>
          </el-col> 
          <el-col :span="6">
            <span>要货时间：{{$commonFun.formatDate(item.toStartDate,('yyyy-MM-dd hh-mm-ss'))}} 至 {{$commonFun.formatDate(item.toEndDate,('yyyy-MM-dd hh-mm-ss'))}}</span>
          </el-col>   
          <el-col :span="6">
            <span>品质要求：{{item.qualityRequirement = item.qualityRequirement == '' ? '没要求' : item.qualityRequirement}}</span>
          </el-col>                       
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="time_tip">{{$commonFun.formatDate(item.createdDate,('yyyy-MM-dd hh-mm-ss'))}}</span>
            <el-button type="text" @click="deleteData(item)">删除</el-button>
          </el-col>
        </el-row>
      </li>
    </ul>
      <!-- 分页 -->
    <div class="page_wrapper">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="searchTableData"
            :current-page.sync="searchFormData.page"
            :page-sizes="$config.pageSize"
            :page-size="searchFormData.size"
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
      apiList: '/found/procurements/list', // 11.1. 采购需求列表
      apiDelete: '/found/procurements/delete', // 11.2. 采购需求删除
      defaultAvatar: require("../../assets/header_img.jpg"),
      searchFormData:{
        page:1,
        size:10,
        checkStatus:1
      },
      pageTotal:0,
      listData:[]
    }
  },
  created(){
    this.searchTableData();
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    /**
     * 获取表格数据
     */
    searchTableData(){
      this.$axios.get(this.apiList,{params:this.searchFormData})
        .then(res => {
          this.listData = res.data.data.list;
          this.pageTotal = res.data.data.total;
        }).catch(err =>{
          console.log(err)
        })
    },
    handleSizeChange(val){
      this.searchFormData.page = 1;
      this.searchFormData.size = val;
      this.searchTableData();
    },
    deleteData(rowData) {
      this.$confirm('确认删除此采购需求?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(this.apiDelete,{procurementId:rowData.procurementId})
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.searchTableData();
          })
      }).catch(() => {
        // todo 异常处理
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.purchase_hall{
  .info_list{
    li{
      padding:20px 15px;
      border-bottom:1px solid #ebeef5;
      .top_p{
        overflow: hidden;
        line-height: 40px;
        img{
          border-radius: 50%;
          width:40px;
          height:40px;
        }
        span{
          display: inline-block;
          color:#909399;
        }
        .company_name{
          font-size: 18px;
          color:#333;
          margin-left:10px;
        }
      }
      .content_p{
        line-height: 30px;
        margin-top:15px;
      }
      .time_tip{
        color:#909399;
        display: inline-block;
        margin-right:15px;
      }
    }
  }
}
</style>