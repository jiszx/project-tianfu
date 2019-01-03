<template>
  <div class="page-address-list">
    <div class="no_order" v-if="address.length == 0">
      <img src="../../../assets/images/order/wddd-kong.png" alt="">
    </div>
    <div v-else class="address-list-box">
      <div class="address-item paddingT20" v-for="(item, index) in address" :key="index">
        <addressRow
          v-if="type==='normal'"
          :isDefault="item.addrDefault"
          :name="item.addrLinkman"
          :phone="item.addrPhone"
          :address="item.areaPath.replace(/\>/g,'')+item.addrAddress"
          @default-click="defaultClick(item.addrId)"
          @edit-click="editClick(item)"
          @delete-click="deleteFn(item.addrId)"
        />
        <addressRowSelect
          v-if="type==='order'"
          :isDefault="item.addrDefault"
          :name="item.addrLinkman"
          :phone="item.addrPhone"
          :address="item.areaPath.replace(/\>/g,'')+item.addrAddress"
          @edit-click="editClick(item)"
          @address-click="addressClick(item)"
        />
      </div>
    </div>
    <div class="btn-wrapper text-center" @click="editClick({})">
      新增收货地址
    </div>
  </div>
</template>

<script>
import addressRow from 'components/address-row'
import addressRowSelect from 'components/address-row-select'
export default {
  name: "addressList",
  data() {
    return {
      api_get_data: '/user/address/list',
      api_update:'/user/address/update',//8.6. 修改收货地址
      api_delete: '/user/address/delete',
      uuid:'',
      type:'normal',
      address:[]
    }
  },
  components: {
    addressRowSelect,
    addressRow
  },
  created() {
    this.uuid = this.$route.query.uuid;
    this.type = this.$route.query.type || 'normal';
    this.getData();
  },
  methods: {
    /**
     * 获取数据
     */
    getData() {
      this.$axios.get(this.api_get_data)
        .then(res => {
          this.address = res || [];
        })
    },
    defaultClick(id) {
      this.$axios.get(this.api_update, {addrId: id,addrDefault:1})
        .then(res => {
          this.$store.dispatch('showMsgTips', '修改默认地址成功！')
          this.getData();
        })
    },
    deleteFn(id) {
      this.$axios.get(this.api_delete, {addrId: id})
        .then(res => {
          this.$store.dispatch('showMsgTips', '删除成功！')
          this.getData();
        })
    },
    editClick(item) {
      this.$router.push({
        name: '编辑收货地址',
        query:{
          uuid: this.$route.query.uuid,
          addrId: item.addrId
        },
        params:{
          addressData: item
        }
      })
    },
    addressClick(item){
      this.$store.commit('updateSubmitingAddress', { //获取待提交订单
        uuid: this.uuid,
        data: item
      })
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.page-address-list{
  height: 100%;
  padding-bottom: 1rem;
  position: relative;
}
.address-list-box {
  height: 100%;
  overflow: auto;
}
.btn-wrapper{
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.88rem;
  width: 100%;
  line-height: 0.88rem;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, .3);
  background: #34C975;
  color: #FFF;
}
</style>
