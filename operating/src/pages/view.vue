<template>
  <div class="views">
      <div class="header_box">
        <Header @changeCollapse="val=>isCollapse=val"></Header>
      </div>
      <div class="content">
        <div class="nav_box" :class="{'closed':isCollapse}">
          <sideBar :collapse="isCollapse"></sideBar>
        </div>
        <div class="main">
            <Bread></Bread>
              <div class="substance">
                <transition name="fade" mode="out-in">
                  <router-view ></router-view>
                </transition>
              </div> 
        </div>
      </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import SideBar from '../components/sideBar'
import Bread from '../components/bread'
export default {
  components:{Header,SideBar,Bread},
  props:{},
  data(){
    return {
      isCollapse:false
    }
  },
  created(){

  },
  mounted(){},
  watch:{},
  computed:{
    
  },
  methods:{}
}
</script>
<style lang="scss" scoped>
.views{
  .header_box{
   box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
   position: relative;
   z-index: 9;
  }
  .content{
    width:100%;
    display: flex;
    position: absolute;
    top: 50px;
    bottom: 0;
    overflow: hidden;    
    float: left;
    background-color: rgba(244, 244, 244, 1);
    .nav_box{
      flex:0 0 200px;
      position: relative;
      z-index: 10;
    }
    .closed{
      flex:0 0 64px;
    }
    .main{
    flex: 1;
    overflow: auto;
    padding: 20px;    
    transition: all .3s; 
    background-color: rgba(244, 244, 244, 1);
    .substance{
      background-color: #fff;
      margin-top:15px;
      box-sizing: border-box;
      padding:20px;
      min-height: 680px;
    }
    }
  }
}
</style>