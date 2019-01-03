<template>
  <div class="page-address-edit">
    <van-cell-group class="address-edit">
      <van-field v-model="formData.addrLinkman" label="收货人：" placeholder="填写收货人姓名" />
      <van-field v-model="formData.addrPhone" label="联系方式：" placeholder="请输入电话号码" />
      <van-cell title="所在地区" is-link @click="areaShow=true" class="cell-address">
        <div v-if="!formData.areaName">请选择所在区域 </div>
        <div v-else>
          {{formData.areaPath}}
        </div>
      </van-cell>
      <van-field v-model="formData.addrAddress" label="详细地址：" placeholder="具体街道门牌号等" />
      <van-cell title="设为默认地址" label="注：每次下单会使用该地址">
        <van-switch v-model="formData.isDefault" />
      </van-cell>
    </van-cell-group>
    <areaPopup v-model="areaShow" @confirm="areaConfirm"></areaPopup>
    <div class="bottom-btn-wrapper" @click="submitFn">保存</div>
  </div>
</template>

<script>
import { Cell, CellGroup, Field, Switch } from 'vant';
import areaPopup from 'components/area-popup'
export default {
  name: "addressEdit",
  data() {
    return {
      api_create:'/user/address/create',//8.5. 新增收货地址
      api_update:'/user/address/update',//8.6. 修改收货地址
      formData:{
        addrAddress : '',
        addrDefault : 0,
        addrLinkman : '',
        addrPhone : '',
        areaCode:'',
        areaName:'',
        areaPath:'',
        addrId : '',//主键
        isDefault:false
      },
      areaShow:false
    }
  },
  components: {
    areaPopup,
    'van-cell': Cell,
    'van-cell-group':CellGroup,
    'van-field':Field,
    'van-switch':Switch
  },
  watch: {
    'formData.isDefault'(val){
      this.formData.addrDefault = val ? 1 : 0;
    }
  },
  created() {
    if(this.$route.params.addressData && this.$route.params.addressData.addrId){
      this.formData = {
        ...this.$route.params.addressData,
        isDefault: !!this.$route.params.addressData.addrDefault
      };
    }
  },
  methods: {
    submitFn(){
      // 判断表单是否完整
      if(!this.formData.addrAddress || !this.formData.addrLinkman || !this.formData.addrPhone) {
        this.$store.dispatch('showMsgTips', '请完善表单！');
        return false;
      } else if (!this.$mUtils.checkType(this.formData.addrPhone, 'phone')) {
        this.$store.dispatch('showMsgTips', '请填写正确的手机号！');
        return false;
      }
      let api_url = this.formData.addrId ? this.api_update : this.api_create;
      this.$axios.post(api_url, {_showLoading: true, ...this.formData})
        .then(res => {
          this.$store.dispatch('showMsgTips', (this.formData.addrId ? '修改成功！' : '新增成功！'))
          this.$router.go(-1);
        })
    },
    areaConfirm(val){
      this.formData.areaCode = val[2] ? val[2].code : '';
      this.formData.areaName = val[2] ? val[2].name : '';
      this.formData.areaPath = (val[0].name) + '>' + (val[1].name) + '>' + (val[2].name);
    }
  }
}
</script>

<style lang="scss" scoped>
.page-address-edit{
  position: relative;
  padding-bottom: 1rem;
  height: 100%;
  padding-top: 0.2rem;
  .address-edit{
    flex: auto;
  }
  .bottom-btn-wrapper{
   position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1rem;
    background: #34C975;
    text-align: center;
    line-height: 1rem;
    color: #fff;
    font-size: 0.32rem;
  }
}
</style>
<style lang="scss">
  .page-address-edit .van-switch--on{
    background-color: #34C975;
  }
</style>
