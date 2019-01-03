<template>
  <div class="component-address-row">
    <div class="paddingB20 van-hairline--bottom address-cell">
      <p class="address-name paddingB20">
        <span class="inline-block paddingR10 fontsize-32">{{name}}</span>
        <span class="inline-block fontsize-26 pull-right">{{phone}}</span>
      </p>
      <p class="address-detail fontsize-24">{{address}}</p>
    </div>
    <div class="paddingT20 van-hairline--top address-btn-wrapper">
      <div class="inline-block width100 is-default-btn" @click="emitEvent('default-click')">
        <van-checkbox v-model="isDefault" :name="1">默认地址</van-checkbox>
      </div>
      <div class="pull-right">
        <span class="inline-block paddingR30" @click="emitEvent('edit-click')">
          <van-icon class="inline-block paddingR10" name="edit" /> 编辑
        </span>
        <span @click="emitEvent('delete-click')">
          <van-icon class="inline-block paddingR10" name="delete" /> 删除
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, Icon, Checkbox } from 'vant'
export default {
  name: "address-row",
  props: {
    isDefault:[Boolean, String, Number],
    name:String,
    phone:String,
    address:String
  },
  data () {
    return {}
  },
  components: {
    'van-cell': Cell,
    'van-icon': Icon,
    'van-checkbox': Checkbox
  },
  methods: {
    emitEvent(type) {
      this.$emit(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.component-address-row{
  box-shadow: 0 0 10px rgba(150, 148, 148, 0.11);
  padding: 0.3rem;
  background: #FFF;
}
.is-default-btn{
  position: relative;
  &::after{
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
}
.address-detail{
  color: #999999;
}
.address-btn-wrapper,.pull-right span{
  color: #666666;
}
</style>
