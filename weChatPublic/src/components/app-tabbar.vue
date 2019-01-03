<template>
  <van-tabbar v-model="activeTabbar">
    <van-tabbar-item :to="{name: '首页'}">
      <span>首页</span>
      <img
        slot="icon"
        slot-scope="props"
        :src="props.active ? icon.home.active : icon.home.normal"
      >
    </van-tabbar-item>
    <van-tabbar-item :to="{name: '商品分类'}">
      <span>分类</span>
      <img
        slot="icon"
        slot-scope="props"
        :src="props.active ? icon.goods.active : icon.goods.normal"
      >
    </van-tabbar-item>
    <van-tabbar-item :to="{name: '发现'}">
      <span>发现</span>
      <img
        slot="icon"
        slot-scope="props"
        :src="props.active ? icon.find.active : icon.find.normal"
      >
    </van-tabbar-item>
    <van-tabbar-item :dot="!!unReadNum" :to="{name: '消息中心'}">
      <span>消息</span>
      <img
        slot="icon"
        slot-scope="props"
        :src="props.active ? icon.chat.active : icon.chat.normal"
      >
    </van-tabbar-item>
    <van-tabbar-item :to="{name: '个人中心'}">
      <span>我的</span>
      <img
        slot="icon"
        slot-scope="props"
        :src="props.active ? icon.mine.active : icon.mine.normal"
      >
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';
import { mapState } from 'vuex'
export default {
  data () {
    return {
      activeTabbar: 0,
      routerNameList: ['首页', '商品分类', '发现', '消息中心', '个人中心'],
      icon: {
        home: {
          name: '首页',
          active: require('common/images/icon-shouye@2x.png'),
          normal: require('common/images/icon-shouye-g@2x.png')
        },
        goods: {
          name: '商品分类',
          active: require('common/images/icon-fenlei@2x.png'),
          normal: require('common/images/icon-fenlei1@2x.png')
        },
        find: {
          name: '发现',
          active: require('common/images/icon-fx@2x.png'),
          normal: require('common/images/icon-fx-g@2x.png')
        },
        chat: {
          name: '消息中心',
          active: require('common/images/icon-xx@2x.png'),
          normal: require('common/images/icon-xx-g@2x.png')
        },
        mine: {
          name: '个人中心',
          active: require('common/images/icon-wode@2x.png'),
          normal: require('common/images/icon-wode -g@2x.png')
        }
      }
    }
  },
  computed: {
    ...mapState({
      unreadMsg: state => state.message.unreadMsg
    }),
    unReadNum(){
      let num = 0;
      num = this.unreadMsg;
      return num;
    }
  },
  created () {
    this.$store.dispatch('unreadMessage') //获取未读消息
    this.change();
  },
  components: {
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem
  },
  watch:{
    $route(val) {
      this.change();
    }
  },
  methods: {
    change(){
      let routerName = this.$route.name;
      this.activeTabbar = this.routerNameList.findIndex(item => {
        return item === routerName
      });
    }
  }
}
</script>

<style scoped>

</style>
