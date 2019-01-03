<template>
  <div class="good_manage">
    <el-form inline label-width="120px">
      <el-form-item label="商品类型：">
        <GoodsCascader
          type="list"
          v-on:getTyPath="getCascTyPath"
          v-on:commoTyPath="searchParams.commoTyPath"
          :commoTyId="searchParams.commoTyId"></GoodsCascader>
      </el-form-item>
      <el-form-item label="商品名称：">
        <el-input v-model.trim="searchParams.commoName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品状态：">
        <el-select v-model="searchParams.commoStatus" placeholder="请选择商品状态">
          <el-option v-for="(item, index) in goodsStatus" :value="item.value" :label="item.label" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="tableData">
      <el-table-column label="封面图片" prop="commoAttachPathUrl" width="90px">
        <template slot-scope="scope">
          <div class="ellipsis block height60 goods-image">
            <img class="goods-img" :src="scope.row.commoAttachPathUrl" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品编号" prop="commoCode"></el-table-column>
      <el-table-column label="商品名称" prop="commoName"></el-table-column>
      <el-table-column label="商品单位" prop="commoUnit" width="80px"></el-table-column>
      <el-table-column label="商品单价" prop="commoPrice" width="80px"></el-table-column>
      <el-table-column label="商品类型" prop="commoTyName"></el-table-column>
      <el-table-column label="商品地区" prop="areaPath"></el-table-column>
      <el-table-column label="采收日期" prop="harvestDate" width="100px">
        <template slot-scope="scope">{{$commonFun.formatDate(scope.row.harvestDate, 'yyyy-MM-dd')}}</template>
      </el-table-column>
      <el-table-column label="出售方" prop="custName"></el-table-column>
      <el-table-column label="商品状态" prop="commoStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.commoStatus == 1">上架中</span>
          <span v-if="scope.row.commoStatus == 0"  class="red">已下架</span>
        </template></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.commoStatus == 0" @click="changeGoodsStatus(scope.row)">上架</el-button>
          <el-button type="text" v-else @click="changeGoodsStatus(scope.row)">下架</el-button>
          <el-button type="text" @click="editGoods(scope.row)">详情</el-button>
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
       :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import GoodsCascader from '../../components/goods-type-cascader'
  export default {
    components: {
      GoodsCascader
    },
    props: {},
    data() {
      return {
        apiList: '/commodity/commodities/list',
        apiChangeStatus: '/commodity/commodities/update',
        searchParams: {
          commoTyPath: '',
          commoTyId: '',
          size: 20,
          page: 1
        },
        total: 1,
        goodsStatus: [
          {
            value: "",
            label: '全部'
          }, {
            value: 1,
            label: '已上架'
          }, {
            value: 0,
            label: '已下架'
          }
        ],
        tableData: [
        ],
        commoTyPath: [],
      }
    },
    created() {
      this.getData();
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
      getData() {
        this.$axios.get(this.apiList, {params: this.searchParams})
          .then(res => {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          })
      },
      /**
       * handleSizeChange 当分页pageSize发生改变
       * @val 当前pageSize值
       */
      handleSizeChange (val) {
        this.searchParams.size = val;
        this.searchParams.page = 1;
        this.getData();
      },
      handleCurrentChange(val) {
        this.searchParams.page = val;
        this.getData();
      },
      // 编辑
      editGoods(data) {
        this.$router.push({name: '查看商品', query: {type: 'detail', commoData: data.commoId}});
      },
      // 获取组件中的数据
      getCascTyPath(path) {
        this.searchParams.commoTyPath = path.commoTyPath;
      },
      /**
       * 上下架商品
       */
      changeGoodsStatus(data) {
        let msg = data.commoStatus ? '商品已下架' : '商品已上架';
          // this.$message.success(msg)
        this.$axios.post(this.apiChangeStatus, {
          commoId: data.commoId,
          commoStatus: data.commoStatus?0:1
        }).then(res => {
          this.$message.success(msg)
          this.getData()
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  .red{
      color: #CC0000;
  }
  .goods-image {
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-height: 100%;
    }
  }
  .comments_count {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #f1f1f1;
    height: 50px;
    width: 300px;
    margin-bottom: 20px;
  }
  .comments_table {
    .comments_item {
      padding-top: 10px;
    }
    .comments_title, .comments_descrip, .comments_photo {
      display: flex;
      align-items: center;
    }
    .comments_title .comments_photo {
      flex-grow: 3;
      margin-bottom: 10px;
      div {
        width: 38px;
        height: 38px;
        border-radius: 29px;
        margin-right: 10px;
        overflow: hidden;
      }
      span {
        margin-right: 60px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .comments_descrip {
      border-bottom: 1px solid;
      padding-bottom: 10px;
      img{
        width: 130px;
        margin-right: 10px;
      }
    }
  }
</style>
