/**
  封装一个采购列表展示组件
*/
<template>
<div class="components-purchase-row">
  <div class="purchase-main">
    <div class="purchase-title fontsize-28">
      <p>{{procurementName}}</p>
    </div>
    <div class="purchase-des clearfix">
      <p class="des-common fontsize-24">
        <span class="inline-block paddingR20 purchase-des-price">指定产地：{{areaPath}}</span>
      </p>
      <p class="des-common fontsize-24">
        <span class="inline-block paddingR20 purchase-des-price">品质要求：{{qualityRequirement}}</span>
      </p>
      <p class="des-unit fontsize-30">
        <span class="inline-block paddingR20 purchase-des-price">{{commoNum + commoUnit}}</span>
      </p>
    </div>
    <div class="pull-right" @click="linkToDetail">
      <span class="promo-button inline-block">
        <van-button plain type="primary" class="fontsize-26">查看详情</van-button>
      </span>
    </div>
  </div>
</div>
</template>

<script>
import { Button } from 'vant';
export default {
  props: {
    procurementId: [String, Number],
    procurementName: String,
    areaPath: String,
    qualityRequirement: String,
    commoNum: [String, Number],
    commoUnit: String
  },
  data () {
    return {
      
    }
  },
  components: {
    'van-button': Button
  },
  methods: {
    /**
     * 跳转到采购详情
     */
    linkToDetail () {
      this.$router.push({
        name:'采购详情',
        query: {
          data: this.procurementId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .components-purchase-row{
    display: flex;
    height: 2.5rem;
    padding: 0.2rem 0.3rem 0.35rem;
    .purchase-main{
      width: 100%;
      .purchase-title{
        text-overflow: ellipsis;
        color: #313131;
        padding-bottom: 5px;
      }
      .purchase-des{
        height: 0.5rem;
        padding-top: 0.06rem;
        line-height: 0.44rem;
        .des-common{
          text-overflow: ellipsis;
          color: #C9C9C9;
        }
        .des-unit{
          padding-top: 5px;
        }
      }
      .promo-button{
        // width: 80px;
        .van-button{
          height: 30px;
          line-height: 30px;
          color: #34C975;
          border: 1px solid #34C975;
          padding: 0 13px;
          border-radius: 4px;
        }
      }
    }
  }
</style>
