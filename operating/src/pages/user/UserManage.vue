<template>
  <div class="user_manage">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-input-wrapper clearfix">
        <el-form label-position="right" label-width="130px">
          <el-form-item label="昵称：">
            <el-input v-model="searchFormData.custName"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input v-model="searchFormData.custPhone"></el-input>
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
          <!-- <el-form-item label="添加时间：">
            <el-date-picker
              v-model="date"
              type="daterange"
              value-format="timestamp"
              start-placeholder="开始日期"
              end-placeholder="结束日期"></el-date-picker>
          </el-form-item> -->
          <el-form-item label="所在地：">
            <AddressSelect @getAddress="getAddress"></AddressSelect>
          </el-form-item>
        </el-form>
      </div>
      <div class="list-operation-btn-wrapper">
        <div class="operation-btn-wrapper">
          <el-button type="success" @click="search">查询</el-button>
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
        <!-- <el-table-column type="selection" width="40"></el-table-column> -->
        <!-- <el-table-column type="index" width="50" label="序号"></el-table-column> -->
        <el-table-column prop="custId" label="用户id"></el-table-column>
        <el-table-column prop="custName" label="名称"></el-table-column>
        <el-table-column prop="custPhone" label="手机号码"></el-table-column>
        <el-table-column prop="areaPath" label="所在地"></el-table-column>
        <el-table-column prop="custStatusName" label="状态"></el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
           <!-- <el-button  type="success" size="mini" @click="editCust(scope.row)">编辑</el-button> -->
           <el-button  type="primary" size="mini" @click="manageStatus(scope.row,true)" v-if="scope.row.custStatus == 0">启用</el-button>
           <el-button  type="danger" size="mini" @click="manageStatus(scope.row,false)" v-if="scope.row.custStatus == 1">停用</el-button>
           <!-- <el-button  type="danger" size="mini" @click="deleteData(scope.row)">删除</el-button> -->
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
import AddressSelect from '../../components/AddressArea';
import { mapState } from 'vuex';
export default {
  data () {
    return {
      apiCustomerList: '/user/customers/list', // 4.2. 用户管理列表
      apiIsStop: '/user/customers/isStop', // 4.3. 启用停用
      date: [],
      searchFormData: {
        page: 1,
        size: 10,
        custName: '', //客户名称
        custPhone: '', //手机号码
        custStatus: '', //客户状态(0：停用，1：启用)
        areaPath: '', // 行政区路径，">"分隔，示例：湖北省>黄冈市
        //startDate: '',
        //endDate: ''
      },
      pageTotal: 0,
      custStatusOptions: [
        {
          custStatus: '',
          custStatusName: '所有状态'
        },
        {
          custStatus: 0,
          custStatusName: '停用'
        },
        {
          custStatus: 1,
          custStatusName: '启用'
        }
      ],
      multipleSelection: [],
      tableData: []
    };
  },
  computed: {
    /* ...mapState({
      Authorization: state => state.user.oauth.Authorization,
      accessToken: state => state.user.oauth.access_token
    }) */
    //province: state => state.address.addressOptions
  },
  components: {
    AddressSelect
  },
  created () {
    if(this.$route.query.type) {
      // this.createdTime = [+new Date(new Date().setHours(0, 0, 0, 0)), +new Date(new Date().setHours(23, 59, 59, 59))]
      this.searchFormData.startDate = +new Date(new Date().setHours(0, 0, 0, 0));
      this.searchFormData.endDate = +new Date(new Date().setHours(23, 59, 59, 59));
    }
    this.searchTableData();
  },
  methods: {
    /**
     * 获取表格数据
     */
    searchTableData () {
      this.$axios.get(this.apiCustomerList, {params:this.searchFormData})
        .then(res => {
          this.tableData = res.data.data.list;
          this.pageTotal = res.data.data.total;
        });
    },
    /**
     * 点击搜索查询按钮(搜索始终从第一页开始展示)
     */
    search () {
      /* if (this.date && this.date.length > 0) {
        this.searchFormData.startDate = this.date[0];
        this.searchFormData.endDate = this.date[1];
      } else {
        this.searchFormData.startDate = '';
        this.searchFormData.endDate = '';
      } */
      this.searchFormData.page = 1;
      this.searchTableData();
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
     * 编辑
     */
    editCust (rowData) {
      this.$router.push({name: '编辑客户', query: {type: 'edit', custId: rowData.custId}});
    },
    /**
     * 点击删除按钮
     * @param rowData
     */
    /* deleteData (rowData) {
      // todo 删除操作，接口请求完成后删除该数据
      this.$confirm('确认删除此客户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(this.apiCustomerDelete, {custId: rowData.custId})
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.searchTableData();
          })
      }).catch(() => {
        // todo 异常处理
      });
    }, */
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
        rowData.custStatus = type ? 1 : 0;
        this.$axios.post(this.apiIsStop, {custId: rowData.custId, custStatus: rowData.custStatus})
          .then(res => {
            // 20180801根据状态码片段是停用还是启用，接口缺失
            this.$message({
              type: 'success',
              message: res.message = rowData.custStatus == 1 ? '启用成功' : "停用成功"
            });
            this.searchTableData();
          })
      }).catch(() => {
        // todo 异常处理
      });
    },
    /**
     * 获取地址
     */
    getAddress(val) {
      //this.searchFormData.areaCode = val.code[val.code.length-1];
      //this.searchFormData.areaName = val.name[val.name.length-1];
      this.searchFormData.areaPath = val.name.join('>');
      console.log(this.searchFormData.areaPath);
    },
  }
}
</script>
<style lang="scss" scoped>
.user_manage{}
</style>