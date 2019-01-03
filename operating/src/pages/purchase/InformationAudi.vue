<template>
  <div class="purchase_hall">
    <el-tabs v-model="searchFormData.checkStatus" @tab-click="handleClick">
      <el-tab-pane :label="countData.notPassCount" name="0"></el-tab-pane>
      <el-tab-pane :label="countData.passCount" name="1"></el-tab-pane>
    </el-tabs>
    <ul class="info_list">
      <li v-for="(item,index) in listData" :key="index">
        <p class="top_p">
           <img :src="defaultAvatar || item.custAvatarUrl" alt="">
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
            <el-button type="text" v-if="searchFormData.checkStatus == 0" @click="pass(item)">通过</el-button>
            <el-button type="text" v-if="searchFormData.checkStatus == 0" @click="noPass(item)">不通过</el-button>
            <el-button class="is-passed" type="text" v-if="searchFormData.checkStatus == 1 && item.passStatus == 1">已通过</el-button>
            <el-button class="no-passed" type="text" v-if="searchFormData.checkStatus == 1 && item.passStatus == 0">未通过审核</el-button>
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
      apiUpdateStatus: '/found/procurements/updateStatus', // 11.2. 修改状态
      apiCount: '/found/procurements/count', // 11.3. 查询采购需求数量
      defaultAvatar: require("../../assets/header_img.jpg"),
      searchFormData:{
        page:1,
        size:10,
        checkStatus: 0 //审核状态(0：未审核，1：已审核)
      },
      pageTotal:0,
      listData:[],
      tabName: '0',
      formData:{
        passStatus: 0, // 通过状态(0：未通过，1：已通过)
        procurementId: 0, // 采购需求主键ID
      },
      countData:{}
    }
  },
  created(){
    this.searchTableData();
    //this.count();
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
      this.count();
    },
    handleSizeChange(val){
      this.searchFormData.page = 1;
      this.searchFormData.size = val;
      this.searchTableData();
    },
    count() {
      this.$axios.get(this.apiCount, {params:{}})
        .then(res => {
          this.countData = res.data.data;
          this.countData.notPassCount = "待审核（" + this.countData.notPassCount + " )";
          this.countData.passCount = "已审核（" + this.countData.passCount + " )";
        }).catch(err => {
          console.log(err)
          // todo 异常处理
        });
    },
    pass(rowData) {
      this.$confirm('你确定要通过该审核?', '提示', {
        confirmButtonText: '确认通过',
        cancelButtonText: '再看看',
        type: 'warning'
      }).then(() => {
        this.formData.passStatus = 1;
        this.formData.procurementId = rowData.procurementId;
        this.$axios.post(this.apiUpdateStatus,this.formData)
          .then(res => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            });
            this.searchTableData();
          })
      }).catch(() => {
        // todo 异常处理
      });
    },
    noPass(rowData) {
      this.$confirm('你确定不通过该审核?', '提示', {
        confirmButtonText: '确认不通过',
        cancelButtonText: '再看看',
        type: 'warning'
      }).then(() => {
        this.formData.passStatus = 0;
        this.formData.procurementId = rowData.procurementId;
        this.$axios.post(this.apiUpdateStatus,this.formData)
          .then(res => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            });
            this.searchTableData();
          })
      }).catch(() => {
        // todo 异常处理
      });
    },
    handleClick(tab, event) {
      if (this.tabName !== tab.name) {
        this.tabName = tab.name;
        this.searchFormData.checkStatus = this.tabName;
        this.searchFormData.page = 1;
        this.searchTableData();
      }
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
      .is-passed{
        color:#909399;
      }
      .no-passed{
        color: red;
      }
    }
  }
}
</style>