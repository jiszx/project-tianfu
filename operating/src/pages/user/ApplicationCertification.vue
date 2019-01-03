<template>
  <div class="application_certification">
    <div class="look_button">
      <el-button  type="success" size="mini" @click="lookHistory" v-if="!history">查看审核历史</el-button>
      <el-button  type="success" size="mini" @click="returnTo" v-if="history">返回</el-button>
    </div>
    <el-tabs v-model="searchFormData.type" @tab-click="handleClick">
      <el-tab-pane :label="countList.realNameAuthNum" name="0"></el-tab-pane>
      <el-tab-pane :label="countList.enterpriseAuthNum" name="1"></el-tab-pane>
      <el-tab-pane :label="countList.aptitudeAuthNum" name="2"></el-tab-pane>
    </el-tabs>
    <!-- 表格区域 -->
    <div class="table-wrapper" v-if="this.tabName == '0'"><!-- 实名认证 -->
      <el-table
        ref="multipleSelection"
        stripe
        :data="tableData"
        style="width: 100%"
        @selection-change="userSelection">
        <el-table-column prop="name" label="姓名" key="el-name"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" key="el-idCard"></el-table-column>
        <el-table-column prop="idFrontUrl" label="身份证正面" key="el-idFrontUrl">
          <template slot-scope="scope">
            <viewer :images="[scope.row.idFrontUrl]">
              <img class="img-table" :src="scope.row.idFrontUrl">
            </viewer>
          </template>>
        </el-table-column>
        <el-table-column prop="idBackUrl" label="身份证反面" key="el-idBackUrl">
          <template slot-scope="scope">
            <viewer :images="[scope.row.idBackUrl]">
              <img class="img-table" :src="scope.row.idBackUrl">
            </viewer>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" label="状态" key="el-auditStatus"></el-table-column>
        <el-table-column label="操作" width="260" v-if="!history">
          <template slot-scope="scope">
           <el-button  type="success" size="mini" @click="verifyCust(scope.row, true)" v-if="!history">通过</el-button>
           <el-button  type="danger" size="mini" @click="verifyCust(scope.row, false)" v-if="!history">不通过</el-button>
         </template>
        </el-table-column>
        <el-table-column label="审核时间"  prop="businessLicenseUrl" v-if="history">
          <template slot-scope="scope">
            {{$commonFun.formatDate(scope.row.lastModifiedDate)}}
         </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-wrapper" v-if="this.tabName == '1'"><!-- 企业认证 -->
      <el-table
        ref="multipleSelection"
        stripe
        :data="tableData"
        style="width: 100%"
        @selection-change="userSelection">
        <el-table-column prop="enterpriseName" label="企业名称" key="el-enterpriseName"></el-table-column>
        <el-table-column prop="legalName" label="法人代表" key="el-legalName"></el-table-column>
        <el-table-column prop="creditCode" label="信用代码" key="el-creditCode"></el-table-column>
        <el-table-column prop="businessLicenseUrl" label="营业执照" key="el-businessLicenseUrl">
          <template slot-scope="scope">
            <viewer :images="[scope.row.businessLicenseUrl]">
              <img class="img-table" :src="scope.row.businessLicenseUrl">
            </viewer>
          </template>>
        </el-table-column>
        <el-table-column prop="idCardOrLicenseUrl" label="身份证或授权证明" key="el-idCardOrLicenseUrl">
          <template slot-scope="scope">
            <viewer :images="[scope.row.idCardOrLicenseUrl]">
              <img class="img-table" :src="scope.row.idCardOrLicenseUrl">
            </viewer>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatusName" label="状态" key="el-auditStatusName"></el-table-column>
        <el-table-column label="操作" width="260" v-if="!history">
          <template slot-scope="scope">
           <el-button  type="success" size="mini" @click="verifyCust(scope.row, true)">通过</el-button>
           <el-button  type="danger" size="mini" @click="verifyCust(scope.row, false)">不通过</el-button>
         </template>
        </el-table-column>
        <el-table-column label="审核时间"  prop="businessLicenseUrl" v-if="history">
          <template slot-scope="scope">
             {{$commonFun.formatDate(scope.row.lastModifiedDate)}}
         </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-wrapper" v-if="this.tabName == '2'"><!-- 资质认证 -->
      <el-table
        ref="multipleSelection"
        stripe
        :data="tableData"
        style="width: 100%"
        @selection-change="userSelection">
        <el-table-column prop="operator" label="经营者" key="el-operator"></el-table-column>
        <el-table-column prop="legalName" label="法人代表" key="el-legalName"></el-table-column>
        <el-table-column prop="creditCode" label="信用代码" key="el-creditCode"></el-table-column>
        <el-table-column prop="aptitudeLicenseUrl" label="资质证" key="el-aptitudeLicenseUrl">
          <template slot-scope="scope">
            <viewer :images="scope.row.aptitudeLicenseUrls">
              <img v-for="item in scope.row.aptitudeLicenseUrls" class="img-table more-img" :src="item" :key="item">
            </viewer>
          </template>
        </el-table-column>
        <el-table-column prop="idCardOrLicenseUrl" label="身份证或授权证明" key="el-idCardOrLicenseUrl">
          <template slot-scope="scope">
            <viewer :images="images">
              <img v-if="scope.row.idCardOrLicenseUrl" class="img-table" :src="scope.row.idCardOrLicenseUrl">
            </viewer>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatusName" label="状态" key="el-auditStatusName"></el-table-column>
        <el-table-column label="操作" width="260" v-if="!history">
          <template slot-scope="scope">
           <el-button  type="success" size="mini" @click="verifyCust(scope.row, true)">通过</el-button>
           <el-button  type="danger" size="mini" @click="verifyCust(scope.row, false)">不通过</el-button>
         </template>
        </el-table-column>
        <el-table-column label="审核时间"  prop="businessLicenseUrl" v-if="history">
          <template slot-scope="scope">
             {{$commonFun.formatDate(scope.row.lastModifiedDate)}}
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
export default {
  props:{},
  data(){
    return {
      date: [],
      apiAuthList: '/user/customers/authList', // 4.1. 认证申请列表
      apiVerifyCust: '/user/customers/verifyCust', // 4.4. 客户认证
      apiCount: '/user/customers/count', //4.8. 统计
      searchFormData: {
        page: 1, // 0：认证申请 1：审核历史
        size: 10,
        flag: 0,
        type: '0' // 0：实名认证 1：企业认证 2：资质认证
      },
      isId:0,
      history: false,
      pageTotal: 0,
      tableData: [],
      countList: {},
      tabName: '0',
      images:[],
    };
  },
  created(){
    this.searchTableData(); // 认证申请列表
    //this.getCountList(); // 认证申请统计
  },
  mounted(){},
  watch:{},
  computed:{
  },
  methods: {
    /**
     * 获取表格数据
     */
    searchTableData () {
      this.$axios.get(this.apiAuthList, {params:this.searchFormData})
        .then(res => {
          this.tableData = res.data.data.list;
          this.pageTotal = res.data.data.total;
          this.tableData.map(item =>{
            if(item.auditStatus == 0){
              item.auditStatus = '未通过';
            }else if(item.auditStatus == 1){
              item.auditStatus = '已通过';
            }else if(item.auditStatus == 2){
              item.auditStatus = '待审核';
            }
          })
        });
      this.getCountList();
    },
    /**
     * 获取认证申请统计
     */
    getCountList () {
      this.$axios.get(this.apiCount,{params:{flag:this.searchFormData.flag}}).then(res => {
        this.countList = res.data.data;
        this.countList.realNameAuthNum = "实名认证（" + this.countList.realNameAuthNum + " )";
        this.countList.enterpriseAuthNum = "企业认证（" + this.countList.enterpriseAuthNum + " )";
        this.countList.aptitudeAuthNum = "资质认证（" + this.countList.aptitudeAuthNum + " )";
      })
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
      console.log(val)
    },
    /**
     * table标签选择事件
     */
    handleClick(tab, event) {
      if (this.tabName !== tab.name) {
        this.tabName = tab.name;
        console.log(this.tabName)
        this.searchFormData.type = this.tabName;
        this.searchFormData.page = 1;
        this.searchTableData();
      }
    },
    /**
     * 客户认证事件
     */
    verifyCust(rowData, isType) {
      rowData.auditStatus = isType ? 1 : 0;
      /* if(rowData.auditStatus == '未通过'){
        rowData.auditStatus = 0;
      }else if(rowData.auditStatus == '已通过'){
        rowData.auditStatus = 1;
      }else if(rowData.auditStatus == '待审核'){
        rowData.auditStatus = 2;
      } */
      if(this.searchFormData.type == '0'){// 0：实名认证 1：企业认证 2：资质认证
        this.isId = rowData.realNameAuthId;
      }else if(this.searchFormData.type == '1'){
        this.isId = rowData.enterpriseAuthId;
      }else if(this.searchFormData.type == '2'){
        this.isId = rowData.aptitudeAuthId;
      }
      this.$axios.post(this.apiVerifyCust, {id: this.isId, auditStatus: rowData.auditStatus, type: this.searchFormData.type}).then(res => {
        this.$message({
          type: 'success',
          //message: rowData.auditStatus == 1 ? '审核通过！' || '审核不通过！'
          message: '操作成功！'
        });
        this.searchTableData();
      })
    },
    /**
     * 查看审核历史事件
     */
    lookHistory() {
      this.history = true;
      this.$router.push({name: '查看商家审核历史',query:{lookHistory:this.lookHistory}});
      this.searchFormData.flag = 1;
      this.searchTableData();
    },
    returnTo() {
      this.history = false;
      this.$router.go(-1);
      this.searchFormData.flag = 0;
      this.searchTableData();
    }
  }
}
</script>
<style lang="scss" scoped>
.application_certification{
  .look_button{
    display: flex;
    justify-content: flex-end;
    margin-bottom: -10px;
    margin-right: 60px;
  }
  .img-table{
    width: 68px;
    height: 68px;
    cursor: pointer;
  }
  .more-img {
    width: 60px;
    height: 60px;
    margin: 3px;
  }
}
</style>