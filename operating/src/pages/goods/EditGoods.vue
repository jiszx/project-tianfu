<template>
  <div class="add_goods edit_goods">
    <el-form ref="form" :model="formData" :rules="formDataRule" label-width="180px" class="goods_edit_form">
      <el-form-item label="商品名称：" prop="commoName">
        <el-input v-model.trim="formData.commoName" placeholder="请输入商品名称" class="goods_item" :maxLength="50" :disabled="type=='detail'">
          <template slot="append">{{formData.commoName.length}}/50</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品分类：" prop="commoTyPath">
        <GoodsCascader
          v-on:getTyPath="getCascTyPath"
          v-on:commoTyPath="formData.commoTyPath"
          v-on:getTyId="getCascTyId"
          :commoTyId="formData.commoTyId"
          :commoTyPaths="commoTyPath" 
          :disabled="type=='detail'"></GoodsCascader>
      </el-form-item>
      <el-form-item label="商品图片：" required>
        <el-upload
          :action="$config.uploadUrl+'commodity'"
          :headers="uploadHeaderConfig"
          list-type="picture-card"
          :file-list="fileList"
          :on-preview="handlePictureCardPreview"
          :on-change="handleOnchange"
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove" :disabled="type=='detail'">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <div class="remark-img">
          <span><span style="color:#f56c6c;">*</span>(最多上传5张图片)支持jpg，png格式，建议分辨率：750px * 426px；不要超过2M</span>
        </div>
      </el-form-item>
      <el-form-item label="采收日期：">
        <el-date-picker
          v-model="formData.harvestDate"
          value-format="timestamp"
          type="date"
          placeholder="选择日期" :disabled="type=='detail'">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="能否追溯：" prop="canTrace">
        <el-radio v-model="formData.canTrace" :label="1" :disabled="type=='detail'">可追溯</el-radio>
        <el-radio v-model="formData.canTrace" :label="0" :disabled="type=='detail'">不可追溯</el-radio>
      </el-form-item>
      <el-form-item label="商品所属地区：" prop="areaCode">
        <AddressSelect :codePath="type!='new'?areaCode:''" @getAddress="getAddress" :disabled="type=='detail'"></AddressSelect>
        <!-- <el-input v-model="formData.areaCode" placeholder="请输入商品名称"></el-input> -->
      </el-form-item>
      <el-form-item label="商品单位：" prop="commoUnit">
        <el-input v-model.trim="formData.commoUnit" placeholder="请输入商品单位" :maxLength="10" :disabled="type=='detail'"></el-input>
      </el-form-item>
      <el-form-item label="商品单价：" prop="commoPrice">
        <el-input v-model.trim="formData.commoPrice" placeholder="请输入商品单价" :disabled="type=='detail'">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品详情：">
        <div class="goods_item">
           <my-editor ref="editor"></my-editor>
        </div>
      </el-form-item>
      <el-form-item label="商品状态：" prop="commoStatus">
        <el-radio v-model="formData.commoStatus" :label="1" :disabled="type=='detail'">上架</el-radio>
        <el-radio v-model="formData.commoStatus" :label="0" :disabled="type=='detail'">下架</el-radio>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import myEditor from '../../components/my-editor.vue';
import AddressSelect from '../../components/AddressArea';
import GoodsCascader from '../../components/goods-type-cascader'
import { mapState } from 'vuex';
export default {
  data() {
    var checkPrice = (rule, value, callback) => {
        if (!(/^((?!0)\d+(\.\d{1,2})?)$/g).test(value)) {
          callback(new Error('请输入正确的格式'));
        } else {
          callback()
        }
      };
    return {
      apiDetail: '/commodity/commodities/info', // 详情
      type: 'new',
      commoId: '', // 商品Id
      formData: {
        commoName: '', // 名称
        commoTyName: '', // 分类名称，">"分隔，示例：蔬菜>土豆
        commoTyPath: '', // 分类路径，"_"分隔，示例：_1_2_
        harvestDate: '', // 收获日期
        canTrace: '', // 是否可追溯
        areaCode: '', // 地址Code
        areaName: '', // 地址名称
        areaPath: '', // 名称路径
        commoUnit: '', // 单位
        commoPrice: '', // 单价
        commoStatus: '', // 0 下架 1 上架
        commoDetails: '', // 详情
        commoAttachPath: '', // 主图
        // merchantId: 1,
      },
      formDataRule: {
        commoName: [ 
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        commoTyPath: [ 
          { required: true, message: '请选择商品类型', trigger: 'blur' }
        ],
        canTrace: [ 
          { required: true, message: '请选择商品是否可追溯', trigger: 'blur' }
        ],
        areaCode: [ 
          { required: true, message: '请选择商品所属地区', trigger: 'blur' }
        ],
        commoUnit: [ 
          { required: true, message: '请输入商品单位', trigger: 'blur' }
        ],
        commoPrice: [ 
          { required: true, message: '请输入商品单价', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' }
        ],
        commoStatus: [ 
          { required: true, message: '请选择商品状态', trigger: 'blur' }
        ],
      },
      fileList: [],
      deleteFile: [],
      commoTyPath: [],
      areaCode: [],
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  components: {
    myEditor,
    AddressSelect,
    GoodsCascader
  },
  computed: {
    uploadHeaderConfig () {
      return {
        'Authorization': 'Bearer ',
        // 'sign': sign
        'Accept': 'application/json; charset=UTF-8;'
      }
    }
  },
  created() {
    this.type = this.$route.query.type || 'new';
    if(this.type === 'edit' || this.type === 'detail') {
      this.commoId = this.$route.query.commoData;
      this.getGoodsData()
    }
  },
  methods: {
    /**
     * 获取产品详情
     */
    getGoodsData() {
      this.$axios.get(this.apiDetail, {params: {commoId: this.commoId}})
        .then(res => {
          let getRes = res.data.data;
          this.formData = getRes;
          this.areaCode = getRes.areaCodePath.split(',');
          this.setEditorContent(getRes.commoDetails)
          if(this.type == 'detail') this.$refs.editor.disabled()
          this.fileList = getRes.commoAttach;
          getRes.commoAttach.forEach(item => {
            item.name = item.attachName;
            item.url = item.attachPathUrl;
          })
          
          console.log(getRes.commoTyPath)
          // 后台返回数据 原来是 1_12_34_56_ 现改为 _1_12_34_56_ 导致数组第一个元素为NaN 分类无法正常展示
          let CommodityType = getRes.commoTyPath.split('_');
          // 对应删除数组第一位元素 待后台确认
          CommodityType.splice(0,1)
          if(!CommodityType[CommodityType.length - 1]){
            CommodityType.pop();
          }
          for(let i = 0, len = CommodityType.length; i < len; i++){
            CommodityType[i] = parseInt(CommodityType[i])
          }
          this.commoTyPath = CommodityType;
          console.log(this.commoTyPath)
      })
    },
    // 获取组件中的数据
    getCascTyPath(path) {
      this.formData.commoTyPath = path.commoTyPath;
      this.formData.commoTyName = path.name;
    },
    getCascTyId(value) {
      this.formData.commoTyId = value;
    },
    /**
     * 上传图片
     */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleOnchange(file, filelist){
      this.formData.commoAttach = filelist;
    },
    beforeAvatarUpload (file) {
      const isJPGPNG = file.type === 'image/jpeg' || 'image/png' || 'image/PNG'
      const isLt3M = file.size / 1024 / 1024 < 2
      const isNum5 = this.formData.commoAttach.length < 6;
      if (!isJPGPNG) {
        this.$message.error('上传图片只能是 JPG或PNG 格式!')
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 2 MB!')
      }
      if (!isNum5) {
        this.$message.error('上传图片不能超过5张!')
      }
      return isJPGPNG && isLt3M && isNum5
    },
    /**
     * 移除
     */
    handleRemove(file, fileList) {
      this.formData.commoAttach = fileList;
      file.isDelete = 1;
      this.deleteFile.push(file)
    },
    /**
     * 获取地址
     */
    getAddress(val) {
      this.formData.areaCode = val.code[val.code.length-1];
      this.formData.areaName = val.name[val.name.length-1];
      this.formData.areaPath = val.name.join('>');
    },
    /**
     * 获取页面内容
     */
    getEditorContent(){
      let content = this.$refs.editor.getContent();
      this.formData.commoDetails = content;
      // console.log(this.formData.commoDetails, content, 'editor')
    },
    /**
     * 设置编辑器内容
     */
    setEditorContent(content){
      let html = content;
      this.$refs.editor.setContent(html)
    }
  }
}
</script>

<style lang="scss">
  .add_goods {
    padding: 50px 0;
    .goods_edit_form {
      .el-input {
        width: 300px;
        min-width: 300px;
      }
      .goods_item {
        width: 60%;
        min-width: 300px;
      }
    }
    // 重置组件样式
    .el-input-group__append, .el-input-group__prepend {
      background-color: #ffffff;
      border: none;
      padding: 0 0 0 10px;
    }
    .el-input-group--append .el-input__inner, .el-input-group__prepend {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    .submit_btn {
      margin-left: 180px;
    }
  }
</style>
