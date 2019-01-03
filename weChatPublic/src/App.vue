<template>
  <div id="app" :class="{showTabbar: $route.meta.showTabbar}">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view class="app-sub-page" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view class="app-sub-page" v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <div class="page-tabbar" v-if="$route.meta.showTabbar" :class="{'page_bottom':$route.meta.showTabbar}" >
      <app-tabbar></app-tabbar>
    </div>
  </div>
</template>

<script>
import appTabbar from 'components/app-tabbar'
import { Toast } from 'vant';
import { mapState } from 'vuex';
export default {
  name: 'App',
  data () {
    return {}
  },
  computed:{
    ...mapState([
      'messageTips'
    ]),
    showMessageTips() {
      return this.messageTips.isShow;
    }
  },
  components: {
    'app-tabbar': appTabbar
  },
  watch:{
    showMessageTips(current, old) {
      if (current) {
        Toast({
          type:this.messageTips.type,
          message:this.messageTips.text,
          forbidClick:true,
          duration:1500
        });
        this.$store.dispatch('hideMsgTips')
      }
    }
  },
  created() {
    let memberData = this.$mUtils.getLocalStorage('user');
    if (memberData) {
      this.$store.commit('updateUserFromLocal');
    }
  }
}
</script>

<style lang="scss">
  #app{
    position: relative;
    height: 100%;
    overflow: auto;
    background: #F2F6F9;
    /* &.showTabbar{
      
    } */
    .page-tabbar{
      .van-tabbar-item--active{
        color: #34C975;
      }
    }
    .page_bottom{
      padding-bottom: 70px;
    }
  }
  .app-sub-page{
    background: #f1f5f8;
    overflow: hidden;
  }
</style>
