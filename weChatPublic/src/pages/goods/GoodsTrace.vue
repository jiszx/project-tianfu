<template>
  <div class="goods-trace">
    <div class="goods">
      <img :src="goodsData.commoAttachPathUrl" alt="">
      <span>{{goodsData.commoName}}</span>
    </div>
    <div class="my-step-line" v-if="stepData.length">
      <div class="my-step-info">
        <div v-for="(item, index) in stepData" :key="index">
          <div>
            <div class="my-step-title">
              <div class="step-title-item my-step-circle">
                <img src="../../assets/images/goods/spzz-yuan.png" alt="">
              </div>
              <span class="step-title-item">
                {{ $mUtils.formatDate(item.time, 'yyyy-MM-dd') }}
              </span>
            </div>
            <div class="my-step-item">
              <div class="item-info">
                <!-- 生产计划 -->
                <div v-if="item.tracePlanId">
                  <div>生产计划</div>
                  <p>种植面积：{{item.plantingArea}}</p>
                  <p>预估产量：{{item.forecastProduction}}</p>
                  <p>品质要求：{{item.typeName}}</p>
                  <p>种植时间：{{$mUtils.formatDate(item.plantDate, 'yyyy-MM-dd')}}</p>
                  <p>采收时间：{{$mUtils.formatDate(item.harvestDate, 'yyyy-MM-dd')}}</p>
                </div>
                <!-- 土壤检测 -->
                <div v-if="item.traceSoilId">
                  <div>土壤检测</div>
                  <p>土壤类型：{{item.typeName}}</p>
                  <p class="soilsImage">土壤检测：<img v-if="item.soilTestUrl" :src="item.soilTestUrl" alt=""></p>
                  <p>检测时间：{{$mUtils.formatDate(item.testDate, 'yyyy-MM-dd')}}</p>
                </div>
                <!-- 种子、种苗 -->
                <div v-if="item.traceSeedId">
                  <div>种子、种苗</div>
                  <p>品种：{{item.commoTyName}}</p>
                  <p>数量：{{item.seedAmount}}</p>
                  <p>来源：{{item.seedSource}}</p>
                  <p>育苗方式：{{item.typeName}}</p>
                  <p>种苗时间：{{$mUtils.formatDate(item.seedDate, 'yyyy-MM-dd')}}</p>
                </div>
                <!-- 播种-->
                <div v-if="item.traceSowId">
                  <div>播种</div>
                  <p>面积：{{item.sowArea}}</p>
                  <p>土壤处理：{{item.soilTreatment}}</p>
                  <p>种子种苗处理方式：{{item.seedTreatment}}</p>
                  <p>播种方式：{{item.sowMethod}}</p>
                  <p>种植时间：{{$mUtils.formatDate(item.sowDate, 'yyyy-MM-dd')}}</p>
                </div>
                <!-- 施肥 -->
                <div v-if="item.traceFertilizeId">
                  <div>施肥</div>
                  <p>肥料类型：{{item.typeName}}</p>
                  <p>类型配比：{{item.fertilizeCategory}}</p>
                  <p>用量：{{item.fertilizeDosage}}</p>
                  <p>施肥时间：{{$mUtils.formatDate(item.fertilizeDate, 'yyyy-MM-dd')}}</p>
                </div>
                <!-- 病虫害防治 -->
                <div v-if="item.tracePestId">
                  <div>病虫害防治</div>
                  <p>类型：{{item.typeName}}</p>
                  <p>成分含量：{{item.pestContent}}</p>
                  <p>打药时间：{{$mUtils.formatDate(item.pestDate, 'yyyy-MM-dd')}}</p>
                  <p>安全期：{{item.safeDate}}</p>
                </div>
                <!-- 中耕除草 -->
                <div v-if="item.traceHoeId">
                  <div>中耕除草</div>
                  <p>工作类别：{{item.workType}}</p>
                  <p>工作方式：{{item.workWay}}</p>
                  <p>其它：{{item.hoeOther}}</p>
                  <p>农耕除草时间：{{$mUtils.formatDate(item.hoeDate, 'yyyy-MM-dd')}}</p>
                </div>
                <!-- 采收 -->
                <div v-if="item.traceHarvestId">
                  <div>采收</div>
                  <p>采收方式：{{item.harvestWay}}</p>
                  <p>产量：{{item.production}}</p>
                  <p>包装方式：{{item.packingWay}}</p>
                  <p>储藏方式：{{item.storageWay}}</p>
                  <p>采收时间：{{$mUtils.formatDate(item.harvestDate, 'yyyy-MM-dd')}}</p>
                </div>
                <p>关联订单：<span class="marginR20" v-for="(item,index) in item.orders" :key="index">{{item.orderNumber+ ' ' +item.orderItemName}}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">该商品暂无追溯信息</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      apiGetList: '/commodity/commoTraces/list',
      apiGetInfo: '/commodity/commodities/info',
      stepData: [],
      goodsData: {
        commoAttachPathUrl: '',
        commoName: ''
      }
    }
  },
  computed:{
    ...mapState({
      product: state=>state.traceData.quality,
      Soils: state=>state.traceData.soilType,
      seed: state=>state.traceData.growType,
      fertilizer: state=>state.traceData.fertilizeType,
      pest: state=>state.traceData.pestType,
    })
  },
  created() {
    this.getList();
    this.getInfo();
  },
  methods: {
    getList() {
      this.$axios.get(this.apiGetList, {commoId: this.$route.query.commoId}).then(res => {
        res.list.map(item => {
          item.time = item.plantDate || item.testDate || item.seedDate || item.sowDate || item.fertilizeDate || item.pestDate || item.hoeDate || item.harvestDate;
          if(item.tracePlanId) item.typeName = this.$mUtils.getTraceTypeName(item.qualityRequire, this.product);
          if(item.traceSoilId) item.typeName = this.$mUtils.getTraceTypeName(item.soilType, this.Soils);
          if(item.traceSeedId) item.typeName = this.$mUtils.getTraceTypeName(item.seedlingWay, this.seed);
          if(item.traceFertilizeId) item.typeName = this.$mUtils.getTraceTypeName(item.fertilizeType, this.fertilizer);
          if(item.tracePestId) item.typeName = this.$mUtils.getTraceTypeName(item.pestType, this.pest);
        })
        this.stepData = res.list.sort(this.sortTime);
      })
    },
    getInfo() {
      this.$axios.get(this.apiGetInfo, {commoId: this.$route.query.commoId}).then(res => {
        this.goodsData.commoAttachPathUrl = res.commoAttachPathUrl;
        this.goodsData.commoName = res.commoName;
      })
    },
    sortTime(a,b){  
       return b.time-a.time  
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-trace {
  background: #fff;
  padding: .36rem .4rem;
  .goods {
    margin-bottom: .68rem;
    img {
      width: 1.2rem;
      height: 1.2rem;
      margin-right: .26rem;
    }
  }
}
.my-step-line {
    border-left: 1px solid #C1F8D9;
    position: relative;
    // height: 1000px;
    .my-step-info {
      position: relative;
      left: -0.174rem;
      top: -8px;
    }
    .my-step-item {
      margin-bottom: 10px;
    }
    .my-step-title {
      display: flex;
      align-items: center;
      .step-title-item {
        margin-right: 20px;
      }
      .my-step-circle {
        width: .34rem;
        height: .34rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .my-step-item {
      margin: .1rem .1rem .2rem .69rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        margin: .14rem 0;
        color: #999999;
        font-size: 12px;
      }
      .soilsImage {
        display: flex;
        align-items: flex-start;
      }
      img {
        max-width: 100px;
        max-height: 100px;
        // margin-left: 5px;
      }
      .item-info>p {
        // width: 94%;
        line-height: 0.4rem;
      }
      .item-btn {
        width: 70px;
        div {
          margin-right: 5px;
          display: inline;
        }
      }
    }
  }
</style>

