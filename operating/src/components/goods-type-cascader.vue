/**
封装商品分类级联下拉框，提供两个功能，选中commoTyPath和commoTyId，渲染级联数据，检测commoTyPaths初始化编辑时的初始数据。
*/
<template>
  <div class="inline-block components-goods-type-cascader">
    <el-cascader
      placeholder="全部"
      :props="commodityprops"
      :options="CommodityType"
      v-model="commoTyChose"
      change-on-select
      @change="handleChange"
      :disabled="disabled">
      <!-- :show-all-levels="false" -->
      <!-- @active-item-change="handleChange" -->
    </el-cascader>
  </div>
</template>

<script>
import {
  Cascader
} from 'element-ui'
export default {
  name: "goods-type-cascader",
  props: {
    commoTyPaths: {
      type: Array
    },
    type: {
      type: String
    },
    disabled: {
      type: [Boolean],
    },
  },
  data () {
    return{
      apiCommodityType: '/commodityTypes/list',
      commodityprops: {
        value: 'commoTyId',
        label: 'commoTyName',
        children: 'children'
      },
      CommodityType: [],
      commoTyPath: '',
      commoTyId: '',
      commoTyChose: [],
      flag: 0,
      modelArr: []
    }
  },
  watch: {
    'commoTyPaths' (val, oldval) {
      this.commoTyChose = [...this.commoTyPaths]
      // console.log(this.commoTyChose)
      if(this.commoTyChose.length > 1) {
        this.handleChange([this.commoTyChose[0]], this.nextData)
      }
    }
  },
  components: {
    'el-cascader': Cascader
  },
  created () {
    this.handleChange(null);
  },
  methods: {
    /**
     * 商品分类选择
     */
    handleChange (obj, callback) {
      let value = -1;
      let modelArr = this.CommodityType;
      if (obj) {
        let name = this.$commonFun.getAddressName(this.CommodityType, obj, 'commoTyId', 'commoTyPathName');
        name = name.pop();
        value = [...obj].pop();
        for(let i = 0; i < obj.length-1; i++) {
          for (let j = 0; j < modelArr.length; j++) {
            if(obj[i] === modelArr[j].commoTyId) {
              modelArr = modelArr[j].children;
              break;
            }
          }
        }
        this.commoTyPath = '_' + obj.join('_') + '_';
        if(!callback) {
          this.$emit('getTyId', value)
          this.$emit('getTyPath', {commoTyPath: this.commoTyPath, name: name})
        }
        // console.log(modelArr[0])
        if(modelArr[0] && modelArr[0].leaf) {
          return
        }
      }
      // if (obj || this.type === undefined) {
      //   this.commoTyPath = obj.join('_') + '_';
      //   this.$emit('getTyPath', this.commoTyPath)
      // }
      if(callback)
      this.getData(value, modelArr, callback);
      else this.getData(value, modelArr);
    },
    /**
     * 获取下拉数据
     */
    getData (value, arr, callback) {
      if(value)
      this.$axios.get(this.apiCommodityType, {params: {'commoTyParentId': value}})
        .then(res => {
          // console.log(res)
          let data = res.data.data.list;
          // console.log(res)
          if (value < 0) {
            if(this.type && this.type === 'list') {
              this.CommodityType.push({
                commoTyId: '',
                commoTyName: '全部'
              })
            }
            for (let i = 0; i < data.length; i++) {
              if(data[i].leaf) {
                delete data[i].children;
              }
              this.CommodityType.push(data[i]);
            }
          } else {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].commoTyId === value) {
                for (let i = 0; i < data.length; i++) {
                  if(data[i].leaf) {
                    delete data[i].children;
                  }
                }
                arr[i].children = data
              }
            }
          }
          if(callback) {
            callback()
          }
        })
    },
    /**
     * 初始化选中数据
     */
    nextData () {
      this.flag++;
      if(this.flag < this.commoTyChose.length) {
        let arr = []
        for(let i = 0; i < this.flag; i++) {
          arr.push(this.commoTyChose[i])
        }
        this.handleChange(arr, this.nextData)
      }
    },
    /**
     * 选择商品
     */
    clickChange (obj) {
      
    }
  }
}
</script>

<style scoped>

</style>
