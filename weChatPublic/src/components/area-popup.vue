<template>
  <van-popup v-model="show" position="bottom" :lazy-render="false">
    <van-area :area-list="areaList" @confirm="confirm" @change="change" @cancel="cancelFn" />
  </van-popup>
</template>

<script>
import { Popup, Area } from 'vant';
export default {
  name: "area-popup",
  props:{
    value:Boolean
  },
  data() {
    return {
      api_get_data: '/administrativeAreas/list',
      show:false,
      loading:false,
      alreadyExistIds:[],
      province:[],
      city:[],
      county:[]
    }
  },
  computed: {
    areaList() {
      let province = {};
      let city = {};
      let county = {};
      for (let i = 0, len = this.province.length; i < len; i++){
        province[this.province[i].areaCode] = this.province[i].areaName;
      }
      for (let i = 0, len = this.city.length; i < len; i++){
        city[this.city[i].areaCode] = this.city[i].areaName;
      }
      for (let i = 0, len = this.county.length; i < len; i++){
        county[this.county[i].areaCode] = this.county[i].areaName;
      }
      return {
        province_list: {...province},
        city_list: {...city},
        county_list: {...county}
      }
    }
  },
  components: {
    'van-popup': Popup,
    'van-area': Area
  },
  created() {
    this.show = this.value;
    this.getAreaData('-1', 'province');
  },
  watch: {
    show(val) {
      this.$emit('input', val);
    },
    value(val) {
      this.show = val;
    }
  },
  methods: {
    confirm(val) {
      this.show = false;
      this.$emit('confirm', val);
    },
    cancelFn(){
      this.show = false;
    },
    getAreaData(id, type) {
      if(this.alreadyExistIds.indexOf(id)>=0){
        return;
      } else {
        this.alreadyExistIds.push(id);
      }
      this.loading = true;
      this.$axios.get(this.api_get_data, {areaCode: id})
        .then(res => {
          res = res.list || [];
          let temp_res = [...res];
          this.loading = false;
          if(type === 'province') {
            this.province = [{
              areaCode: '0',
              areaId:0,
              areaLevel:1,
              areaParentCode:'-1',
              areaPath: '全国',
              areaName: '全国',
              children:[],
              leaf:true
            },...temp_res];
            if(this.province.length) {
              this.getAreaData(this.province[0].areaCode, 'city')
            }
          } else if (type === 'city') {
            this.city = [...this.city, ...temp_res]
            if(temp_res.length){
              this.getAreaData(temp_res[0].areaCode, 'county')
            }
          } else {
            this.county = [...this.county, ...temp_res]
          }
          //this.$forceUpdate();
        })
        .catch(() => {
          this.loading = false;
        })
    },
    change(val){
      let list = val.getValues();
      if(list[0]){
        this.getAreaData(list[0].code, 'city')
      }
      if(list[1]){
        this.getAreaData(list[1].code, 'county')
      }
    }
  }
}
</script>

<style scoped>
.page-supply-list .van-popup--bottom{
  top: 122px;
}
.page-purchase-list .van-popup--bottom{
  top: 44px;
}
.page-index .van-popup--bottom{
  top: 44px;
}
</style>
