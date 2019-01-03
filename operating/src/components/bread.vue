<template>
  <div class="bread">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item 
        v-for="(item,index) in $route.matched" 
        :key="index" 
        :to="{path:item.path}" 
        v-if="item.path"
        >{{$route.query.replaceName&&index==($route.matched.length-1)?$route.query.replaceName:item.name}}</el-breadcrumb-item>
    </el-breadcrumb>    
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
    }
  },
  created(){
  },
  mounted(){},
  watch:{},
  computed:{},
  methods:{}
}
</script>
<style lang="scss" >
.bread{
 .el-breadcrumb__item:not(:last-child){
       .el-breadcrumb__inner:hover{
        color:rgb(52, 201, 117) !important;
        }
 }
}
</style>