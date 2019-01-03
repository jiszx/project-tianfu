<template>
  <div class="page-find">
    <van-cell-group>
      <van-cell is-link :to="{name: '采购大厅'}">
        <template slot="title">
          <span><img src="../../assets/images/find/fx-icon-cgdt@2x.png" alt=""></span>
          <span class="van-cell-text">采购大厅</span>
        </template>
      </van-cell>
      <van-cell is-link :to="{name: '专家问答'}">
        <template slot="title">
          <span><img src="../../assets/images/find/fx-icon-zjwd@2x.png" alt=""></span>
          <span class="van-cell-text">专家问答</span>
        </template>
      </van-cell>
      <van-cell is-link :to="{name: '培训课堂'}">
        <template slot="title">
          <span><img src="../../assets/images/find/fx-icon-pxkt@2x.png" alt=""></span>
          <span class="van-cell-text">培训课堂</span>
        </template>
      </van-cell>
      <van-cell value="400-189-1288" class="van-cell-tel fontsize-24" is-link @click="phoneCall('400-189-1288')">
        <template slot="title">
          <span><img src="../../assets/images/find/fx-icon-kfrx@2x.png" alt=""></span>
          <span class="van-cell-text">客服热线</span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { CellGroup, Cell, Icon, Dialog } from 'vant'
export default {
  data() {
    return {
     
    }
  },
  computed: {
   
  },
  components: {
   'van-cell-group': CellGroup,
   'van-cell': Cell,
   'van-icon': Icon,
    Dialog
  },
  created() {
   
  },
  methods: {
    /**
     * 获取列表数据
     */
    phoneCall(data) {
      Dialog.confirm({
        title: '客服热线',
        message: '是否拨打客服热线？'
      }).then(() => {
        // on confirm
        window.location.href = 'tel://' + data
      }).catch(() => {
        // on cancel
      });
    }
  }
}
</script>

<style scoped>
  .van-cell-group {
    background: #F2F6F9;
  }
  .van-cell{
    line-height: 0.98rem;
    margin-bottom: 0.3rem;
  }
  .van-cell-tel{
    color: #999;
  }
  .van-cell img{
    max-width: 0.98rem;
  }
  .van-cell .van-cell-text{
    padding-left: 0.1rem;
    color: #313131;
    font-size: 14px;
  }
  .van-cell:not(:last-child)::after {
    content: ' ';
    position: absolute;
    pointer-events: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    left: 15px;
    right: 0;
    bottom: 0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    border-bottom: none;
  }
</style>
