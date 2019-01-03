<template>
  <div class="application_certification">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-input-wrapper clearfix">
        <el-form label-position="right" label-width="130px">
          <el-form-item label="状态：">
            <el-select v-model="searchFormData.answerStatus" placeholder="请选择">
              <el-option
                v-for="item in answerStatusOptions"
                :key="item.answerStatus"
                :label="item.answerStatusName"
                :value="item.answerStatus">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="list-operation-btn-wrapper">
        <div class="operation-btn-wrapper">
          <el-button type="success" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <!-- 留言回复区域 -->
    <div class="message-reply" v-for="(item,index) in tableData" :key="index">
      <div class="item-title">
        <el-row :gutter="24">
          <el-col :span="3"><div class="grid-content bg-purple el-col-header"><img :src="item.custAvatarUrl" alt=""></div></el-col>
          <el-col :span="5"><div class="grid-content bg-purple el-col-company">{{item.custName}}</div></el-col>
          <el-col :span="2"><div class="grid-content bg-purple el-col-at">的留言</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple">{{$commonFun.formatDate(item.answerDate,'yyyy-MM-dd hh-mm-ss')}}</div></el-col>
          <el-col :span="3"><div class="grid-content bg-purple el-rerpaly" @click="repaly(item)">回复</div></el-col>
          <el-col :span="3"><div class="grid-content bg-purple delete-msg" @click="deleteMsg(item)">删除留言</div></el-col>
        </el-row>
      </div>
      <div class="item-message">
        <div class="div-images" v-if="item.qattachPath1Url">
          <img :src="item.qattachPath1Url" alt="">
          <!-- <img :src="item.qattachPath2Url" alt=""> -->
        </div>
        <div class="div-content">
          <p>{{item.qaQuestion}}</p>
        </div>
      </div>
      <div class="item-replay" v-if="item.answerProfessorId">
        <div>
          <span>
            {{item.answerProfessorName}}  回复：{{item.qaAnswer}}
          </span>
        </div>
        <div class="repaly-action">
          <span class="time-text">{{$commonFun.formatDate(item.answerDate,'yyyy-MM-dd hh-mm-ss')}}</span>
          <span class="icon-text"><i class="iconfont icon-z-like"></i>{{item.answerLikeNum}}</span>
          <span class="delete-replay" @click="deleteRepaly(item)">删除回复</span>
        </div>
      </div>
    </div>
    <!-- 留言回复弹出框 -->
    <el-dialog
      title="留言回复"
      :visible.sync="replayVisible"
      width="40%">
      <div>
        <el-form  :model="formData" ref="formData" :rules="rules" label-position="right" label-width="130px">
          <el-form-item label="回复人：">
            <template slot-scope="scope">
              <span >{{formData.custName}}</span>
            </template>
          </el-form-item>
          <el-form-item label="ta的留言内容：">
            <template slot-scope="scope">
              <span>{{formData.qaQuestion}}</span>
            </template>
          </el-form-item>
          <el-form-item label="选择回复专家：" prop="answerProfessorId">
            <el-select v-model="formData.answerProfessorId" placeholder="请选择回复留言的专家">
              <el-option
                v-for="item in answerProfessorIdOptions"
                :key="item.answerProfessorId"
                :label="item.answerProfessorName"
                :value="item.answerProfessorId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="回复内容：" prop="qaAnswer">
            <template slot-scope="scope">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model.trim="formData.qaAnswer">
              </el-input>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="replaySubmit">提交</el-button>
      </span>
    </el-dialog>
    
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        background
        prev-text="上一页"
        next-text="下一页"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="searchListData"
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
      apiList: '/found/professorQas/list', // 6.11. 专家问答列表
      apiUpdate: '/found/professorQas/update', // 6.12. 专家问答编辑
      apiDelete: '/found/professorQas/delete', // 6.13. 专家问答删除
      api_select_list:'/found/professors/list',  //专家选择列表
      date: [],
      searchFormData: {
        page: 1,
        size: 10,
        answerStatus: '', //回复状态(0：尚未回复，1：已回复)
      },
      pageTotal: 0,
      formData: {
        answerDate: new Date().getTime(),//回复时间
        answerProfessorId: '',//回复专家ID
        answerProfessorName: '',//回复专家姓名
        answerStatus: 0, //回复状态(0：尚未回复，1：已回复)
        professorQsId: '', //主键ID
        qaAnswer: '' //回复
      },
      answerProfessorIdOptions:[
      ],
      answerStatusOptions: [
        {
          answerStatus: '',
          answerStatusName: '所有状态'
        },
        {
          answerStatus: 1,
          answerStatusName: '已回复'
        },
        {
          answerStatus: 0,
          answerStatusName: '尚未回复'
        }
      ],
      multipleSelection: [],
      tableData: [],
      replayVisible: false,
      rules:{
        answerProfessorId:[
          {required:true,type:'number',message:'请选择回复专家',trigger:'change'}
        ],
        qaAnswer:[
          {required:true,message:'请填写回复内容',trigger:['blur','change']}
          ]
      }
    };
  },
  computed: {
    /* ...mapState({
      Authorization: state => state.user.oauth.Authorization,
      accessToken: state => state.user.oauth.access_token
    }) */
  },
  created () {
    this.searchListData();
    this.getExpertList();
  },
  watch:{
    replayVisible(val){
      if(!val){
        this.formData.answerProfessorId='',
        this.formData.qaAnswer='';
       this.$refs.formData.resetFields();
      }
    }
  },
  methods: {
    /* 获取专家列表 */
    getExpertList(){
      this.$axios.get(this.api_select_list,{page:1,size:1000})
      .then(res=>{
        this.answerProfessorIdOptions=[];
        res.data.data.list.map(item=>{
          this.answerProfessorIdOptions.push({answerProfessorId:item.professorId,answerProfessorName:item.professorName})
        })
      })
    },
    /**
     * 获取列表数据
     */
    searchListData () {
      this.$axios.get(this.apiList, {params:this.searchFormData})
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.list;
          this.pageTotal = res.data.data.total;
          /* for (let index = 0; index < this.tableData.length; index++) {
            this.formData.custName = this.tableData[index].custName;
            this.formData.qaQuestion = this.tableData[index].qaQuestion;
            this.formData.professorQsId = this.tableData[index].professorQsId;
            if(this.tableData[index].qaAnswer){
              this.formData.answerStatus = 1;
            }else{
              this.formData.answerStatus = 0;
            }
          } */
        });
    },
    /**
     * 点击搜索查询按钮(搜索始终从第一页开始展示)
     */
    search () {
      this.searchFormData.page = 1;
      this.searchListData();
    },
    /**
     * handleSizeChange 当分页pageSize发生改变
     * @val 当前pageSize值
     */
    handleSizeChange (val) {
      this.searchFormData.size = val;
      this.searchFormData.page = 1;
      this.searchListData();
    },
    /**
     * 表格选择框选择事件
     */
    userSelection (val) {
      this.multipleSelection = val;
      console.log(val)
    },
    /**
     * 回复留言
     */
    repaly(item) {
      // console.log(item);
      this.formData={
        custName:item.custName,
        qaQuestion:item.qaQuestion,
        answerDate: new Date().getTime(),//回复时间
        answerProfessorId: item.answerProfessorId?item.answerProfessorId:'',//回复专家ID
        answerProfessorName: '',//回复专家姓名
        answerStatus: item.qaAnswer?1:0, //回复状态(0：尚未回复，1：已回复)
        professorQsId: item.professorQsId, //主键ID
        qaAnswer: item.qaAnswer?item.qaAnswer:'' //回复
      }
      this.replayVisible = true;
    },
    /**
     * 弹层留言提交
     */
    replaySubmit(){
      let index = this.answerProfessorIdOptions.findIndex(v => { // 用于数组变换位置
        return v.answerProfessorId === this.formData.answerProfessorId
      });
      this.formData.answerProfessorName = this.answerProfessorIdOptions[index].answerProfessorName
      this.$refs.formData.validate(valid=>{
        if(valid){
            this.$axios.post(this.apiUpdate,this.formData)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '留言成功'
                });
                this.searchListData();
              }).catch(() => {
                // todo 异常处理
              })
            this.replayVisible = false;
        }
      })
    },
    /**
     * 删除留言
     */
    deleteMsg (rowData) {
      this.$confirm('你确定要删除该条留言?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(this.apiDelete, {professorQsId:rowData.professorQsId})
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            this.searchListData();
          })
      }).catch(() => {
        // todo 异常处理
      });
    },
    /**
     * 删除回复
     */
    deleteRepaly (rowData) {
      this.$confirm('你确定要删除该条回复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          answerDate: '',//回复时间
          answerProfessorId: '',//回复专家ID
          answerProfessorName: '',//回复专家姓名
          answerStatus: 0,//回复状态(0：尚未回复，1：已回复)
          professorQsId: rowData.professorQsId, //主键ID
          qaAnswer: '' //回复
        }
        this.$axios.post(this.apiUpdate, data)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.searchListData();
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
  .search-wrapper{
    max-width: 1200px;
    padding-bottom: 30px;
    border-bottom: 1px solid #dcdfe6;
  }
  .list-operation-btn-wrapper{
    padding-top: 0px;
    .operation-btn-wrapper{
      float:left;
      padding-left:30px;
    }
  }
  .message-reply{
    max-width: 1200px;
    padding: 30px;
    /* border-top: 1px solid #dcdfe6; */
    border-bottom: 1px solid #dcdfe6;
    /* 留言区域公共样式 */
    .item-title{
      .el-row {
        margin-bottom: 20px;
        text-align: center;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .grid-content {
        min-height: 48px;
        line-height: 48px;
      }
      .row-bg {
        padding: 10px 0;
      }
    }
    /* 留言头部 */
    .item-title{
      .el-row {
        .el-col-header{
          margin-left: 25px;
          img{
            height: 48px;
            width: 48px;
            border-radius: 48px;
          }
        }
        .el-rerpaly,.delete-msg{
          cursor: pointer;
          color: #409EFF;
        }
      }
    }
    
    /* 留言内容 */
    .item-message{
      margin: 20px 0 20px 25px;
      position: relative;
      display: flex;
      .div-images{
        // flex: 120;
        img{
          height: 120px;
          width: 120px;
          padding-right: 15px;
        }
      }
    }
    /* 留言回复 */
    .item-replay{
      background: #f4f4f4;
      padding: 10px;
      margin-left: 25px;
      .repaly-action{
        padding-top: 10px;
        span{
          padding-right: 30px;
        }
        .time-text,.icon-text{
          color: #8f8a8a;
          font-size: 13px;
        }
        .delete-replay{
          cursor: pointer;
          color: #409EFF;
        }
      }
    }
  }
}
</style>