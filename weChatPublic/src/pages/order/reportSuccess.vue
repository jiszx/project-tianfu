<template>
    <div class="evaluate_success">
        <div class="public-bj">
        <img src="../../assets/images/purchasing/fbcg-bj@2x.png" alt="">
        </div>
        <div class="public-row page-content text-center">
        <div class="pulic-status marginB20">
            <img src="../../assets/images/order/pjcg-bj.png" alt="">
            <div class="info_box">
                <p class="fontsize-36">评价成功！</p>
                <p class="tips">感谢您的评价</p>
            </div>        
        </div>
        </div>
        <router-link tag="div" :to="{name:'首页'}" class="returnHome fontsize-30 text-center">返回首页</router-link>
    </div>
</template>
<script>
    export default{
        data(){
            return {

            }
        }
    }
</script>
<style lang="scss" scoped>
.evaluate_success{
  position: relative;
  background: #fff;
  padding: 0.5rem 0.2rem;
  height: 100%;
  .public-bj{
    position: absolute;
    z-index: 1;
    top: 0.5rem;
    left: 0.2rem;
    right: 0.2rem;
    width: auto;
  }
}
.public-row{
  position: relative;
  z-index: 2;
  margin: 1rem 0 2rem;
  .pulic-status {
    display: flex;
    color: #34C975;
    padding-left:19%;
    img {
      width: 1.77rem;
      height: 1.09rem;
      flex: 0 0 1.77rem;
      margin-right: 10px;
    }
    .info_box{
        flex:1;
        p{
            text-align: left;
        }
        .tips{
            color:RGBA(147, 147, 147, 1);
            font-size: .24rem;
            line-height: .52rem;
        }
    }
  }
}
.checkDetail {
  color: #fff;
  background: #34C975;
  padding: 0.3rem;
  border-radius: 6px;
  margin: 0 0.1rem 0.3rem;
}
.returnHome {
  color: #34C975;
  background: #fff;
  border: 1px solid #34C975;
  padding: 0.3rem;
  border-radius: 6px;
  margin: 0 0.1rem;
}
</style>

