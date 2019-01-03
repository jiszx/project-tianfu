<template>
  <div class="application_certification">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-input-wrapper clearfix">
        <el-form label-position="right" label-width="130px">
          <el-form-item label="认证用户名称：">
            <el-input v-model="searchFormData.custName"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input v-model="searchFormData.custPhone"></el-input>
          </el-form-item>
          <el-form-item label="认证标志：">
            <el-select v-model="searchFormData.auditType" placeholder="请选择">
              <el-option
                v-for="item in auditTypeOptions"
                :key="item.auditType"
                :label="item.auditTypeName"
                :value="item.auditType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="searchFormData.custStatus" placeholder="请选择">
              <el-option
                v-for="item in custStatusOptions"
                :key="item.custStatus"
                :label="item.custStatusName"
                :value="item.custStatus">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份：">
            <el-select v-model="searchFormData.custIdentity" placeholder="请选择">
              <el-option
                v-for="item in identityOptions"
                :key="item.custIdentity"
                :label="item.value"
                :value="item.custIdentity">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="list-operation-btn-wrapper">
        <div class="operation-btn-wrapper">
          <el-button type="success" @click="search">查询</el-button>
          <el-button  type="success" @click="exportTable">导出当前结果</el-button>
        </div>
      </div>
    </div>
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <el-table
        ref="multipleSelection"
        stripe
        :data="tableData"
        style="width: 100%"
        @selection-change="userSelection">
        <el-table-column prop="custName" label="认证用户名称"></el-table-column>
        <el-table-column prop="custPhone" label="手机号码"></el-table-column>
        <el-table-column prop="areaPath" label="所在地"></el-table-column>
        <el-table-column prop="custIdentity" label="身份"></el-table-column>
        <el-table-column label="认证类型">
          <template slot-scope="scope">
            <img v-if="scope.row.enterpriseAuth == 1" src="../../assets/user/wd-rz-q@2x.png" alt="">
            <img v-if="scope.row.realNameAuth == 1" src="../../assets/user/wd-rz-r@2x.png" alt="">
            <img v-if="scope.row.vipAuth == 1" src="../../assets/user/wd-rz-v@2x.png" alt="">
            <img v-if="scope.row.aptitudeAuth == 1" src="../../assets/user/wd-rz-z@2x.png" alt="">
          </template>>
        </el-table-column>
        <el-table-column prop="custStatusName" label="状态"></el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
           <el-button  type="success" size="mini" @click="userDetail(scope.row)">详情</el-button>
           <el-button  type="success" size="mini" @click="manageStatus(scope.row,false)" v-if="scope.row.custStatus != 1">启用</el-button>
           <el-button  type="danger" size="mini" @click="manageStatus(scope.row,true)" v-if="scope.row.custStatus != 0">停用</el-button>
         </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        background
        prev-text="上一页"
        next-text="下一页"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="searchTableData"
        :page-size="searchFormData.size"
        :page-sizes="$config.pageSize"
        :current-page.sync="searchFormData.page"
        :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      apiVerifyList: '/user/customers/verifyList', // 4.5. 认证用户管理列表
      apiIsStop: '/user/customers/isStop', // 4.3. 启用停用
      apiCustIdentity: '/custIdentity', // 3.6. 客户身份
      apiVerifyListExport: this.$config.baseUrl+'/user/customers/verifyListExport', // 5.8. 认证用户管理列表Excel导出
      date: [],
      searchFormData: {
        page: 1,
        size: 10,
        custName: '',//客户名称
        custPhone: '',//手机号码
        auditType:'',//认证类型 0：实名认证 1：企业认证 2：资质认证 3:VIP
        custStatus: '', // 客户状态(0：停用，1：启用)
        custIdentity: '', // 客户身份
      },
      pageTotal: 0,
      auditTypeOptions: [
        {
          auditType: '',
          auditTypeName: '所有认证类型'
        },
        {
          auditType: 0,
          auditTypeName: '实名认证'
        },
        {
          auditType: 1,
          auditTypeName: '企业认证'
        },
        {
          auditType: 2,
          auditTypeName: '资质认证'
        },
        {
          auditType: 3,
          auditTypeName: 'VIP'
        }
      ],
      custStatusOptions: [
        {
          custStatus: '',
          custStatusName: '所有状态'
        },
        {
          custStatus: 0,
          custStatusName: '已停用'
        },
        {
          custStatus: 1,
          custStatusName: '使用中'
        }
      ],
      identityOptions: [],
      multipleSelection: [],
      tableData: []
    };
  },
  computed: {
    /* ...mapState({
      Authorization: state => state.user.oauth.Authorization,
      accessToken: state => state.user.oauth.access_token
    }) */
  },
  created () {
    this.searchTableData();
    this.getCustIdentity(); //客户身份列表
  },
  methods: {
    /**
     * 获取表格数据
     */
    searchTableData () {
      this.$axios.get(this.apiVerifyList, {params:this.searchFormData})
        .then(res => {
          this.tableData = res.data.data.list;
          this.pageTotal = res.data.data.total;
        });
    },
    /**
     * 点击搜索查询按钮(搜索始终从第一页开始展示)
     */
    search () {
      this.searchFormData.page = 1;
      this.searchTableData();
    },
    /**
    客户身份
     */
    getCustIdentity() {
      this.$axios.get(this.apiCustIdentity)
        .then( res => {
          this.identityOptions = res.data.data;
          let objArry = [];
          this.identityOptions.map(item => {
            let obj = {
              custIdentity: item.key,
              value: item.value
            }
            objArry.push(obj)
          })
          if(this.identityOptions.length){//满折促销信息Arr
            this.identityOptions = [{
              custIdentity: '',
              value: '所有身份'
            }, ...objArry]
          }
        })
    },
    /**
     * 导出
     */
    exportTable () {
      this.$commonFun.getFile(this.apiVerifyListExport, this.searchFormData);
    },
    /**
     * handleSizeChange 当分页pageSize发生改变
     * @val 当前pageSize值
     */
    handleSizeChange (val) {
      this.searchFormData.size = val;
      this.searchFormData.page = 1;
      this.searchTableData();
    },
    /**
     * 表格选择框选择事件
     */
    userSelection (val) {
      this.multipleSelection = val;
      console.log(val)
    },
    /**
     * 详情
     */
    userDetail (rowData) {
      this.$router.push({name: '商家详情', query: {custId: rowData.custId}});
    },
    /**
     * 停用或启用
     */
    manageStatus (rowData,type) {
      // todo 停用启用操作，接口请求完成后停用启用该数据
      this.$confirm('确认操作此客户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rowData.custStatus = type ? 0 : 1;
        //console.log(rowData.custStatus,123)
        this.$axios.post(this.apiIsStop, {custId: rowData.custId, custStatus: rowData.custStatus})
          .then(res => {
            // 根据状态码片段是停用还是启用
            this.$message({
              type: 'success',
              message: res.message = rowData.custStatus == 0 ? "停用成功" : "启用成功"
            });
            this.searchTableData();
          })
      }).catch(() => {
        // todo 异常处理
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.application_certification{
  .table-wrapper img{
    width: 20px;
  }
}
</style>