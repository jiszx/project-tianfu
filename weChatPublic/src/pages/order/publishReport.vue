<template>
    <div class="publish_report">
        <div v-for="(item,index) in goodsList" :key="index" class="publish_report_item">
            <div class="report_header">
                <img class="left_img" :src="item.commoAttachPathUrl" alt="">
                <div class="right_box">
                        <van-row style="height:100%;">
                            <van-col span="8" class="face_box" @click.native="changeActive(item,0)">
                                <img class="face"  v-if="item.commentType==0" src="../../assets/images/order/fbpj-hp-1.png" alt="">
                                <img class="face"  v-else  src="../../assets/images/order/fbpj-hp-2.png" alt="">
                                好评
                            </van-col>
                            <van-col span="8" class="face_box" @click.native="changeActive(item,1)">
                                <img class="face" v-if="item.commentType==1" src="../../assets/images/order/fbpj-zp-2.png" alt="">
                                <img class="face" v-else src="../../assets/images/order/fbpj-zp-1.png" alt="">
                                中评
                            </van-col>
                            <van-col span="8" class="face_box" @click.native="changeActive(item,2)">
                                <img class="face" v-if="item.commentType==2" src="../../assets/images/order/fbpj-cp-2.png" alt="">
                                <img class="face" v-else src="../../assets/images/order/fbpj-cp-1.png" alt="">
                                差评
                            </van-col>                                        
                        </van-row>
                </div>
            </div>
            <van-cell-group>
                <van-field  rows="5" v-model="item.commentDetails" type="textarea" placeholder="随便说点什么吧..." />
            </van-cell-group>  
            <myUpload  
            :apiUpload="img_upload_url" 
            :maxLength="3"  
            :limit='4'
            width="1.3rem" 
            height="1.3rem"  
            @changeFile="(arr)=>{changeFileList(arr,item)}"></myUpload>
      </div>
      <img class="submit_button" @click="submitReport" src="../../assets/images/order/fbpj-btn.png" alt=""> 
    </div>    
</template>
<script>
import {Row,Col,Field,CellGroup } from 'vant';
import myUpload from '../../components/my-uploader'
    export default{
        data(){
            return{
              img_upload_url:'/attachments/vindicate',
              publish_report_url:'/user/mine/submitComment',
              activeIndex:0,
              goodsList:[],
            }
        },
        components:{
            'van-row':Row,
            'van-col':Col,
            'van-field':Field,
            'van-cell-group':CellGroup,
            myUpload
        },
        created(){
            if(!this.$route.params.order){
                this.$router.push({name:'我的订单'})
            }
            this.goodsList=this.$route.params.order.orderItems;
            this.goodsList.map(item=>{
                item.orderId=this.$route.params.order.orderId;
                item.orderNumber=this.$route.params.order.orderNumber;
                item.commentType=0;
                item.commentDetails='';
                item.list='';
                return item;
            })
        },
        watch:{
        },
        methods:{
            changeActive(obj,num){
                obj.commentType=num;
                this.$set(obj);
                delete obj.undefined;
            },
            changeFileList(arr,item){
                if(arr.length) {
                    item.hasPic = 1;
                } else item.hasPic = 0;
                item.list=arr;
                for(var i=1;i<=3;i++){
                    delete item['attachPath'+i]
                }
                item.list.map((el,index)=>{
                    item['attachPath'+(index+1)]=el.pathUrl;
                })
            },
            submitReport(){
               this.$axios.post(this.publish_report_url,{list:JSON.stringify(this.goodsList)})
               .then(res=>{
                   this.$router.push({name:'评价成功'})
               })
            }
        }
    }
</script>
<style lang="scss" scoped>
.publish_report{
    width:100%;
    .publish_report_item {
       background-color: #fff;
       margin-bottom: 10px;
    }
    .report_header{
        padding:.14rem .28rem;
        display: flex;
        .left_img{
            flex:0 0 1rem;
            height:1rem;
            width:1rem;
        }
        .right_box{
            flex:1;
            height:1rem;
            .face_box{
                color:RGBA(147, 147, 147, 1);
                text-align: center;
                margin-top:.26rem;
                .face{
                    height:.48rem;
                    width:.48rem;
                    display: inline-block;
                    line-height: .48rem;
                }
            }
        }
    }
    .submit_button{
        position: fixed;
        right:.24rem;
        bottom:10px;
        width:1.20rem;
        height:1.20rem;
    }
    .upload-box{
        padding:10px;
    }
}
</style>
