<template>
  <div class="params_config">
      <el-form :model="paramsForm" label-width="170px">
          <el-form-item label="APP销量展示：">
            <el-radio v-model="paramsForm.salesShow" :label="true">开启</el-radio>
            <el-radio v-model="paramsForm.salesShow" :label="false">关闭</el-radio>             
          </el-form-item>
          <el-form-item label="系统默认确认收货天数：">
            <el-input  class="input_width" v-model="paramsForm.receiptDays"></el-input> <span style="margin-left:15px">天</span>
          </el-form-item>
          <el-form-item label="VIP缴费金额：">
            <el-input  class="input_width" v-model="paramsForm.authFee"></el-input> <span style="margin-left:15px">元</span>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="saveData">保 存</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
        apiInfo:'/setting/configs/info',//9.5. 系统配置详情
        apiUpdate:'/setting/configs/update',//9.6. 系统配置编辑
        paramsForm:{
            authFee: 0,//认证费(单位:元)
            configId: 0,//主键ID
            receiptDays: '',//系统默认确认收货天数
            salesShow: true, //APP销量展示(0：关闭，1：开启)
        },
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
        this.$axios.get(this.apiInfo)
        .then(res => {
            this.paramsForm = res.data.data; 
            this.paramsForm.salesShow = this.paramsForm.salesShow === 1 ? true : false;
        })
      },
      saveData() {
        let data = {...this.paramsForm};
        data.authFee = '¥' +  data.authFee;
        data.salesShow = this.paramsForm.salesShow === true ? 1 : 0;
        this.$axios.post(this.apiUpdate,data)
        .then(res => {
            this.$message({
                type: 'success',
                message: '编辑成功！'
            });
            this.getData();
        })
      }
  }
}
</script>
<style lang="scss" scoped>
.params_config{}
</style>