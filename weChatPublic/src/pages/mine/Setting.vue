<template>
<div class="page-setting">
  <!--cell列表-->
  <van-cell-group class="cell-tab-wrapper">
    <van-cell title="修改密码" is-link :to="{name:'修改密码',query:{phoneNumber:phoneNumber}}"></van-cell>
    <van-cell title="版本号" value="1.0.1"></van-cell>
  </van-cell-group>
  <div class="page-setting-content text-center fontsize-32 marginT25 van-hairline--top-bottom">
    <div class="logout-btn" @click="logout">退出登录</div>
  </div>
</div>
</template>

<script>
import {
  Cell,
  CellGroup
} from 'vant';
import { mapState } from 'vuex';
export default {
  name: "setting",
  data() {
    return {
      api_get_data: '/oauth/revokeToken'
    }
  },
  components: {
    'van-cell-group': CellGroup,
    'van-cell': Cell
  },
  computed: {
    ...mapState({
      phoneNumber: state=>state.mine.userData.phoneNumber
    })
  },
  created() {
    
  },
  methods: {
    /**
     退出登录
     */
    logout() {
      this.$axios.post(this.api_get_data, {_showLoading: true})
        .then(res => {
          this.$router.push({name:'登录'});
          let storage = window.localStorage;
          storage.clear(); //localStorage数据清空
          console.log(storage)
          this.$store.commit('updataOauth', {})
        }).catch( err => {
          
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-setting{
    margin-top: 0.3rem;
    .page-setting-content{
      background: #fff;
      .logout-btn{
        color: #34C975;
        height: 1rem;
        line-height: 1rem;
      }
    }
  }
  .marginT25{
    margin-top: 0.5rem;
  }
</style>
