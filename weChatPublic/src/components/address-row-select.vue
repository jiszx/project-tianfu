<template>
  <div class="component-address-row">
    <div class="address-row" @click="addressClick">
      <p class="address-name paddingB20">
        <span class="inline-block paddingR10">{{name}}</span>
        <span class="inline-block">{{phone}}</span>
        <span class="inline-block address-default-taps" v-if="isDefault">默认</span>
      </p>
      <p class="address-detail fontsize-24 gray">{{address}}</p>
    </div>
    <div class="address-icon">
      <div class="address-icon-inner text-right van-hairline--left" @click="editClick">
        <van-icon name="edit" class="fontsize-84" />
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant'
export default {
  name: "addrss-row-select",
  props: {
    isDefault:[Boolean, String, Number],
    name:String,
    phone:String,
    address:String
  },
  data() {
    return {}
  },
  components: {
    'van-icon': Icon
  },
  methods: {
    editClick() {
      this.$emit('edit-click')
    },
    addressClick(){
      this.$emit('address-click')
    }
  }
}
</script>

<style lang="scss" scoped>
.component-address-row{
  display: flex;
  padding: 0.3rem;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(150, 148, 148, 0.11);
  .address-row{
    flex: auto;
    padding-right: 0.2rem;
    .address-default-taps{
      color: #FFC046;
    }
  }
  .address-icon{
    flex: 0 0 0.8rem;
    padding: 0.2rem 0;
  }
}
.address-icon-inner{
  font-size: 0.48rem;
}
.address-default-taps{
  height: 20px;
  line-height: 19px;
  padding: 0 10px;
  border:1px solid #34C975;
  border-radius: 0.04rem;
  font-size: 0.2rem;
}
</style>
