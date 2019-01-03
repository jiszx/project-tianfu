<template>
  <div>
    <div class="top_404">
      <div>404</div>
      <div>SORRY您访问的页面弄丢了</div>
    </div>
    <div class="main_content_404">
      <div class="content_left_404">
        <div class="title_404">可能原因:</div>
        <ul class="reasonBox">
          <li>1. 网络信号差</li>
          <li>2. 找不到请求的页面</li>
          <li>3. 输入的网址不正确</li>
        </ul>
      </div>
      <div class="content_right_404">
        <div class="title_404">可以尝试:</div>
        <router-link :to="{name:'首页'}" class="returnIndex_page">返回首页</router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  data () {
    return {}
  }
}
</script>

<style scoped>
  .main_content_404{
    text-align:center;
    margin-top:60px;
  }
  .top_404{
    padding:100px 0 70px;
    background-color:rgba(52, 201, 117, 1);
    color:white;
    text-align:center;
  }
  .top_404>div:first-child{
    font-size:72px;
  }
  .returnIndex_page{
    text-decoration:none;
    color:rgba(52, 201, 117, 1);
    display:inline-block;
    width:120px;
    border:2px solid rgba(52, 201, 117, 1);
    border-radius:4px;
    height:30px;
    line-height:30px;
    text-align:center;
    margin-top:20px;
    cursor: pointer;
  }
  .reasonBox{
    list-style-type:none;
    color:rgba(52, 201, 117, 1);
    line-height:30px;
    padding-left:0;
    margin-bottom:0;
  }
  .title_404{
    font-size:28px;
    color:rgba(52, 201, 117, 1);
    font-weight:500;
  }
  .content_left_404{
    display: inline-block;
    text-align: left;
  }
  .content_right_404{
    display: inline-block;
    padding-left: 100px;
    border-left: 1px solid rgba(52, 201, 117, 1);
    margin-left: 100px;
    margin-top:-6px;
  }
</style>
