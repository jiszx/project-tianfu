<template>
  <div class="application_certification">
    <!-- 资金管理统计 -->
    <div class="search-wrapper statistics-head">
      <el-row :gutter="24" class="row-public">
        <el-col :span="4"><div class="grid-content bg-purple">资金总余额</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">待结算订单</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">待结算金额</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">已结算订单</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">已结算金额</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">VIP</div></el-col>
      </el-row>
      <el-row :gutter="24" class="row-other">
        <el-col :span="4"><div class="grid-content bg-purple">¥{{arAmCountList.amountTotal || '0.00'}}</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">{{arAmCountList.unSettledOrderNum || '0'}}笔</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">¥{{arAmCountList.unSettledAmount || '0.00'}}</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">{{arAmCountList.settledOrderNum || '0'}}笔</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">¥{{arAmCountList.settledAmount || '0.00'}}</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">¥{{arAmCountList.vipAmount || '0.00'}}</div></el-col>
      </el-row>
      <el-row :gutter="24" class="row-public">
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple VIP-detail" @click="VIP_toDetail">VIP资金明细></div></el-col>
      </el-row>
    </div>
    <!-- 搜索区域 -->
    <div class="search-wrapper search-bottom">
      <div class="search-input-wrapper clearfix">
        <el-form label-position="right" label-width="130px">
          <el-form-item label="订单编号：">
            <el-input v-model="searchFormData.orderNumber"></el-input>
          </el-form-item>
          <el-form-item label="卖方：">
            <el-input v-model="searchFormData.merchantName"></el-input>
          </el-form-item>
          <el-form-item label="买方：">
            <el-input v-model="searchFormData.custName"></el-input>
          </el-form-item>
          <el-form-item label="支付方式：">
            <el-select v-model="searchFormData.orderPayMode" placeholder="请选择">
              <el-option
                v-for="item in orderPayModeOptions"
                :key="item.orderPayMode"
                :label="item.orderPayModeName"
                :value="item.orderPayMode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="searchFormData.orderStatus" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.orderStatus"
                :label="item.orderStatusName"
                :value="item.orderStatus">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="list-operation-btn-wrapper">
        <div class="operation-btn-wrapper">
          <el-button type="success" @click="search">查询</el-button>
          <el-button type="success" @click="exportTable">导出当前列表信息</el-button>
        </div>
      </div>
    </div>
    <!-- <div class="look_button">
      <el-button  type="success" size="mini" @click="exportTable">导出当前列表信息</el-button>
    </div> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="countList.allNum" name="0"></el-tab-pane>
      <el-tab-pane :label="countList.unSettleNum" name="1"></el-tab-pane>
      <el-tab-pane :label="countList.settleNum" name="2"></el-tab-pane>
      <el-tab-pane :label="countList.rightNum" name="3"></el-tab-pane>
    </el-tabs>
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <el-table
        ref="multipleSelection"
        stripe
        :data="tableData"
        style="width: 100%"
        @selection-change="userSelection">
        <el-table-column prop="orderNumber" label="订单编号"></el-table-column>
        <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
        <el-table-column prop="orderPayModeName" label="支付方式"></el-table-column>
        <el-table-column prop="merchantName" label="卖方"></el-table-column>
        <el-table-column prop="custName" label="买方"></el-table-column>
        <el-table-column prop="orderStatusName" label="订单状态"></el-table-column>
        <el-table-column prop="settleStatusName" label="结算状态"></el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
           <el-button  type="success" size="mini" @click="toDetail(scope.row)">详情</el-button>
           <el-button v-if="scope.row.orderStatus == 3 && !scope.row.settleStatus" type="danger" size="mini" @click="settlement(scope.row)">结算</el-button>
         </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 订单列表分页 -->
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
    <!-- 订单结算弹出框 -->
    <el-dialog
      title="结算"
      :visible.sync="settlementVisible"
      width="40%">
      <div>
        <el-form ref="form" label-position="right" label-width="130px" :model="formData" :rules="formDataRule">
          <el-form-item label="结算金额：">
            <template slot-scope="scope">
              <span>¥{{formData.orderAmount}}</span>
            </template>
          </el-form-item>
          <el-form-item label="结算用户：">
            <template slot-scope="scope">
              <span>{{formData.custName}}</span>
            </template>
          </el-form-item>
          <el-form-item label="收款账号：" prop="settleAccount">
            <el-select v-model="formData.settleAccount" placeholder="请选择">
              <el-option
                v-for="item in amountsData"
                :key="item.paymentMethod"
                :label="item.paymentMethodName"
                :value="item.paymentMethod">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: -80px; color:red;">
            <template slot-scope="scope">
              <span>请务必确认你已通过线下把钱转至目标收款账号</span>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog_settlement">确认结算</el-button>
      </span>
    </el-dialog>
    <!-- VIP资金明细弹出框 -->
    <el-dialog
      title="VIP资金明细"
      :visible.sync="visible"
      width="40%">
      <div>
        <!-- VIP资金明细表格区域 -->
        <div>认证vip公司总计：{{vipTotle}}家</div>
        <div class="table-wrapper">
          <el-table
            ref="multipleSelection"
            stripe
            :data="tableAuthsData"
            style="width: 100%"
            @selection-change="userSelection">
            <el-table-column prop="custName" label="公司名称"></el-table-column>
            <el-table-column prop="authFee" label="支付金额"></el-table-column>
            <el-table-column prop="authPayModeName" label="支付方式">
              <template slot-scope="scope">
                {{scope.row.authPayMode?'支付宝':'微信'}}
              </template>
            </el-table-column>
            <el-table-column prop="authPayTime" label="支付时间">
              <template slot-scope="scope">
                {{$commonFun.formatDate(scope.row.authPayTime)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- VIP资金明细列表分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            background
            prev-text="上一页"
            next-text="下一页"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="VIP_handleSizeChange"
            @current-change="authsListData"
            :page-size="formData.size"
            :page-sizes="$config.pageSize"
            :current-page.sync="formData.page"
            :total="VIP_PageTotal">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
      apiOrAmCount:'/order/orders/orAmCount', // 7.1. 资金统计
      apiList: '/order/orders/list', // 7.3. 订单列表
      apiUpdate: '/order/orders/update', // 7.5. 订单结算 
      apiAmounts: '/order/orders/amounts', // 7.6. 获取收款账户
      apiVipAuthsList:'/user/vipAuths/list', // 7.2VIP认证列表(vip资金明细)
      apiListCount: '/order/orders/listCount', // 7.8. 列表统计
      apiVerifyListExport: this.$config.baseUrl+'/order/orders/listExport', // 7.7. 订单列表导出
      date: [],
      searchFormData: {
        page: 1,
        size: 10,
        custName: '',
        merchantName: '',
        orderNumber:'',
        orderPayMode: '',//订单支付方式(0：微信，1：支付宝)
        orderStatus:'',//订单状态(0：待支付，1：待发货，2：已发货，3：已完成，4：已取消)
        //payStatus:0,//支付状态(0：未付款，1：已付款)
        rightStatus:'',//维权状态(0：未维权，1：已维权，2：已处理)
        settleStatus:'',//结算状态(0：待结算，1：已结算)
      },
      pageTotal: 0,
      orderPayModeOptions: [
        {
          orderPayMode: '',
          orderPayModeName: '所有支付方式'
        },
        {
          orderPayMode: 0,
          orderPayModeName: '微信'
        },
        {
          orderPayMode: 1,
          orderPayModeName: '支付宝'
        }
      ],
      statusOptions: [
        {
          orderStatus: '',
          orderStatusName: '所有状态'
        },
        {
          orderStatus: 0,
          orderStatusName: '待支付'
        },
        {
          orderStatus: 1,
          orderStatusName: '待发货'
        },
        {
          orderStatus: 3,
          orderStatusName: '已完成'
        },
        {
          orderStatus: 4,
          orderStatusName: '已取消'
        }
      ],
      formData:{
        page: 1,
        size: 10,
        orderId:'', //主键ID
        orderAmount:'',
        custName:'',
        settleAccount:''//结算账号
      },
      formDataRule: {
        settleAccount: [{ required: true, message: '请选择收款账号', trigger: 'blur' },]
      },
      amountsData:[],
      tableData: [],
      vipTotle:0, //认证vip公司总计
      tableAuthsData:[],//认证vip列表
      VIP_PageTotal:0,
      arAmCountList:{},//资金统计列表
      countList: {},
      activeName: '0',
      tabName: '2',
      settlementVisible: false,
      visible: false,
    };
  },
  created(){
    this.getArAmCountList();//资金统计
    this.searchTableData(); //订单列表
  },
  mounted(){},
  watch:{
    settlementVisible(val){
        if(!val){
            // this.dialogForm={
            //     roleId:'',
            //     userPlatName:'',
            //     userPlatPassword:'',
            //     userPlatUser:''
            // }
            this.$refs.form.resetFields();
        }
    }      
  },
  computed:{
  },
  methods: {
    /**
     * 获取表格数据
     */
    searchTableData () {
      this.$axios.get(this.apiList, {params:this.searchFormData})
        .then(res => {
          this.tableData = res.data.data.list;
          this.pageTotal = res.data.data.total;
        });
      this.getOrderStatistics();
    },
    /**
     * 资金统计
     */
    getArAmCountList () {
      this.$axios.get(this.apiOrAmCount).then(res => {
        this.arAmCountList = res.data.data;
      })
    },
    /**
     * 获取订单统计
     */
    getOrderStatistics () {
      this.$axios.get(this.apiListCount).then(res => {
        this.countList = res.data.data;
        this.countList.allNum = "所有订单（" + this.countList.allNum + " )";
        this.countList.unSettleNum = "待结算订单（" + this.countList.unSettleNum + " )";
        this.countList.settleNum = "已结算订单（" + this.countList.settleNum + " )";
        this.countList.rightNum = "维权订单（" + this.countList.rightNum + " )";
      })
    },
    /**
     * 获取收款账户
     */
    getAmountsData(rowData){
      this.$axios.get(this.apiAmounts, {params:{custId:rowData.merchantId}})
        .then(res => {
          let dataArr = res.data.data;
          let amountsData = [];
          dataArr.forEach((item,index) => {
            for (let key in dataArr[index]) {
              let obj={paymentMethod:key, paymentMethodName:dataArr[index][key]};
              amountsData.push(obj);
            }
          });
          this.amountsData = amountsData;
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
    },
    /**
     * table标签选择事件
     */
    handleClick(tab, event) {
      if (this.tabName !== tab.name) {
        this.tabName = tab.name;
        /* this.searchFormData.orderStatus = this.tabName;
        this.searchFormData.page = 1;
        this.searchTableData(); */
      }
      if(this.tabName == 0){
          this.searchFormData.settleStatus = ''; // 所有
          this.searchFormData.rightStatus = '';
          this.searchFormData.page = 1;
          this.searchTableData();
        }else if(this.tabName == 1){
          this.searchFormData.settleStatus = 0; // 待结算
          this.searchFormData.rightStatus = '';
          this.searchFormData.page = 1;
          this.searchTableData();
        }else if(this.tabName == 2){
          this.searchFormData.settleStatus = 1; // 已结算
          this.searchFormData.rightStatus = '';
          this.searchFormData.page = 1;
          this.searchTableData();
        }else if(this.tabName == 3){
          this.searchFormData.rightStatus = 1; // 已维权
          this.searchFormData.settleStatus = '';
          this.searchFormData.page = 1;
          this.searchTableData();
        }
    },
    /**
     * 订单详情事件
     */
    toDetail(rowData){
      this.$router.push({name: '订单详情', query: {orderId: rowData.orderId}});
    },
    /**
     * 订单结算弹框
     */
    settlement(rowData){
      this.settlementVisible = true;
      this.formData.orderId = rowData.orderId;
      this.formData.orderAmount = rowData.orderAmount;
      this.formData.custName = rowData.custName;
      this.getAmountsData(rowData); //获取收款账户
    },
    /**
     * 订单结算事件
     */
    dialog_settlement(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let data = [];
          data.orderId = this.formData.orderId;
          data.settleAccount = this.formData.settleAccount;
          this.$axios.post(this.apiUpdate,data)
            .then( res => {
              this.$message({
                type: 'success',
                message: '结算成功！'
              });
              this.searchTableData()
              this.getArAmCountList()
          }).catch(err => {
            // todo 异常处理
            console.log(err);
          });
          this.settlementVisible = false;
        } else {
          this.$message.error('请完善表单！')
        }
      })
    },
    /**
     * 查看审核历史事件
     */
    exportTable() {
      /* let params = {};
      for(let key in this.searchFormData){
        if(this.searchFormData[key]){
          params[key] = this.searchFormData[key]
        }
      } */
      this.$commonFun.getFile(this.apiVerifyListExport, this.searchFormData);
    },
    /**
     * VIP资金明细
     */
    VIP_toDetail(){
      this.visible = true;
      this.authsListData();
    },
    authsListData() {
      this.$axios.get(this.apiVipAuthsList, {params:this.formData})
        .then(res => {
          this.vipTotle = res.data.data.total;//认证vip公司总计
          this.tableAuthsData = res.data.data.list;
          this.VIP_PageTotal = res.data.data.total;
        });
    },
    /**
     * handleSizeChange 当分页pageSize发生改变
     * @val 当前pageSize值
     */
    VIP_handleSizeChange (val) {
      // console.log(val,123)
      this.formData.size = val;
      this.formData.page = 1;
      this.authsListData();
    },
  }
}
</script>
<style lang="scss" scoped>
    .application_certification{
      /* 资金管理统计 */
    .statistics-head{
      background: #F8F8F8;
      padding: 25px;
      margin-bottom: 40px;
    }
    .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .row-public{
      color:#999999;
    }
    .row-other{
      color:#67c23a;
      font-size: 18px;
    }
    .grid-content {
      min-height: 18px;
    }
    .VIP-detail{
      cursor: pointer;
    }
    /* 导出列表信息按钮 */
    .search-bottom{
      margin-bottom: 40px;
    }
    .look_button{
      display: flex;
      justify-content: flex-end;
      margin-bottom: -32px;
      margin-right: 60px;
      margin-top: 50px;
    }
  }
</style>