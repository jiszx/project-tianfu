/**
props: codePath
methods: getAddress

*/
<template>
  <div>
    <el-cascader
      placeholder="省/市/区"
      id="cascader"
      :options="province"
      change-on-select
      @change="handleAddressChange"
      v-model="selectedOptions"
      clearable
      :disabled="disabled"
    ></el-cascader>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    codePath: {
      type: [Array, String],
    },
    disabled: Boolean
  },
  data() {
    return {
      selectedOptions: [],
      address: {}
    }
  },
  computed: {
    ...mapState({
      province: state => state.address.addressOptions
    })
  },
  watch: {
    codePath(val) {
      this.selectedOptions = this.codePath;
      this.$store.dispatch('getnextaddress', {val: this.codePath, arr: this.$store.state.address.addressOptions, isEdit: false}); 
    }
  },
  created() {
    this.$store.dispatch('getaddress', {areaCode: {areaCode: -1}});
    if(this.codePath && this.codePath.length) {
      this.selectedOptions = this.codePath;
      this.$store.dispatch('getnextaddress', {val: this.codePath, arr: this.$store.state.address.addressOptions, isEdit: false}); 
    }
  },
  methods: {
    /**
     * 选择地址项实时查询下一级
     */
    handleAddressChange (val) {
      this.$store.dispatch('getnextaddress', {val: val, arr: this.$store.state.address.addressOptions, isEdit: false, isEnd: val.length > 1 ? 1 : 0});
      let name = this.$commonFun.getAddressName(this.$store.state.address.addressOptions, val);
      this.address.code = val;
      this.address.name = name;
      this.$emit('getAddress', this.address)
    }
  }
}
</script>

