<template>
  <div class="page-expertsAsk">
    <!-- 专家列表 -->
    <div class="expert-swipe">
      <van-swipe class="expert-swipe-module" :show-indicators="false" :width="276" :loop="false">
        <van-swipe-item class="expert-swipe-item" v-for="(item,index) in experts" :key="index">
          <div class="expert-image">
            <img :src="item.professorAvatarUrl" alt="">
          </div>
          <div class="expert_box">
            <p class="expert-name">{{item.professorName}}</p>
            <p class="fontsize-24 expert-intro">{{item.professorIntroduce}}</p>
            <span class="expert-pup">
              <img src="../../assets/images/expert/zjwd0dz@2x.png" alt="">
              <span class="fontsize-24" :class="!item.likeNum?'like':''">{{item.likeNum?item.likeNum:'0'}}</span>
            </span>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <p class="gray fontsize-28 expert-leave-msg">留言</p>
    <div class="expert-message">
      <div class="expert-message-dec" v-for="(item, index) in messageTable" :key="index">
        <div class="message-photo">
          <img :src="item.custAvatarUrl" alt="">
        </div>
        <div class="message-info">
          <p class="fontsize-28 color-blue fontBold">{{item.custName}}</p>
          <p>{{item.qaQuestion}}</p>
          <img v-if="item.qattachPath1" :src="item.qattachPath1Url" alt="">
          <img v-if="item.qattachPath2" :src="item.qattachPath2Url" alt="">
          <div v-if="item.answerProfessorId && item.qaAnswer" class="message-leave">
            <p class="color-blue">{{item.answerProfessorName}}：</p>
            <p>{{item.qaAnswer}}</p>
          </div>
          <span class="expert-pup" v-if="item.answerProfessorId" @click="likeLeaveMessage(item)">
            <img v-if="item.isLiked" src="../../assets/images/expert/zjwd0dz@2x.png" alt="">
            <img v-else src="../../assets/images/expert/zjwd-wdz@2x.png" alt="">
            <span v-if="item.isLiked" class="fontsize-24">{{item.answerLikeNum}}</span>
            <span v-else class="fontsize-24">点赞</span>
          </span>
        </div>
      </div>
    </div>
    <!--加载更多-->
    <div class="loading-more-box">
      <p class="loading-more" v-if="!hasMore">没有更多</p>
      <LoadingMore v-else :loading-fn="loadingMore" :loading="loading"/>
    </div>
    <!-- <div class="paddingB50"></div> -->
    <div class="send-leave-msg">
      <van-field class="send-msg-input" v-model="formData.qaQuestion" placeholder="请输入你的留言" maxLength="100"/>
      <van-uploader class="send-upload" :after-read="onRead" accept="image/gif, image/jpeg">
        <img :src="formData.qAttachPath1?formData.qAttachPath1Url:imgUp" alt="">
      </van-uploader>
      <div class="send-btn" @click="createQues">我要提问</div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Field, Uploader } from 'vant';
import addImg from '../../assets/images/expert/zjwd-add@2x.png';
import LoadingMore from '@/components/base/loading-more'
export default {
  data() {
    return {
      apiUpload: '/attachments/professorQa',
      apiCreate: '/found/professorQas/create',
      apiExperts: '/found/professors/list', // 专家列表
      apiMessage: '/found/professorQas/list', // 问答列表
      apiExpertLike: '/found/professors/updateLikeNum', // 给专家点赞
      apiMessageLike: '/found/professorQas/updateLikeNum', // 给回复点赞
      imgUp: addImg,
      hasMore:true,
      loading:false,
      formData: {
        qaQuestion: ''
      },
      experts: [],
      messageTable: [],
      searchForm: {
        page: 1,
        size: 5
      }
    }
  },
  computed: {
   
  },
  components: {
   'van-swipe': Swipe,
   'van-swipe-item': SwipeItem,
   'van-field': Field,
   'van-uploader': Uploader,
    LoadingMore,
  },
  created() {
   this.getExpert();
   this.getMessage();
  },
  methods: {
    /**
     * 获取专家列表
     */
    getExpert() {
      this.$axios.get(this.apiExperts, { isNeedToken: true }).then(res => {
        this.experts = res;
      })
    },
    /**
     * 获取问答列表
     */
    getMessage(isMore) {
      this.loading = true;
      this.searchForm.isNeedToken = true;
      this.$axios.get(this.apiMessage, this.searchForm).then(res => {
        if (isMore && isMore == 'more') {
            this.messageTable = [...this.messageTable, ...res.list];
          } else {
            this.messageTable = res.list;
          }
          this.hasMore = res.pages > res.page;
          this.loading = false;
      }).catch((err) => {
        // console.log(err)
          this.loading = false;
      })
    },
    /**
     * 加载更多方法
     */
    loadingMore () {
      this.searchForm.page++;
      this.getMessage('more');
    },
    // 上传
    onRead(file) {
      let fileList = [];
      let checkResult = '';
      if(file.length) {
        fileList = file;
      } else {
        fileList = [file];
      }
      for(let i = 0; i < fileList.length; i++) {
        checkResult = this.beforeRead(fileList[i].file);
        if(!checkResult) {
          return
        }
      }
      if(checkResult) {
        this.$toast({
          message:'上传中...',
          forbidClick:true,
          duration:30000,
        })
        let formdata = new FormData();
        fileList.map(file => {
          formdata.append('file', file.file);
        })
        this.$axios.uploadFile(this.apiUpload, formdata).then(res => {
          this.formData.qAttachPath1 = res[0].path;
          this.formData.qAttachPath1Url = res[0].pathUrl;
          this.$toast.clear()
          this.$set(this.formData);
          delete this.formData.undefined;
        })
      }
    },
    /**
     * 上传前
     */
    beforeRead(file) {
      // console.log(file.type === 'image/JPG' || 'image/jpeg' || 'image/png' || 'image/PNG')
      const isJPGPNG = file.type === 'image/JPG' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/PNG' 
      // const isJPGPNG = file.type === 'image/JPG'
      const isLt3M = file.size / 1024 / 1024 < 4;
      const maxlength = true;
      if (!isJPGPNG) {
        this.$toast.fail('上传图片只能是 JPG, jpeg, png 格式!')
      }
      if (!isLt3M) {
        this.$toast.fail('上传图片大小不能超过 4 MB!')
      }
      if (!maxlength) {
        this.$toast.fail('上传图片最多 1 张')
      }
      return isJPGPNG && isLt3M && maxlength
    },
    /**
     * 给留言点赞
     */
    likeLeaveMessage(data) {
      if(data.isLiked) this.$toast('你已经点过赞了');
      else
      this.$axios.post(this.apiMessageLike, {professorQsId: data.professorQsId}).then(res => {
        this.$toast.success('点赞成功！');
        data.isLiked = true;
        data.answerLikeNum+=1;
        this.getExpert();
      })
    },
    /**
     * 新增提问
     */
    createQues() {
      this.loading = true;
      this.$axios.post(this.apiCreate, this.formData).then(res => {
        this.formData = {};
        this.searchForm.page = 1;
        this.getMessage();
      }).catch((err) => {
        // console.log(err)
          this.loading = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-expertsAsk {
    padding-bottom: 60px;
    // position: fixed;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    // overflow: auto;
  }
  .color-blue {
    color: #576B95;
  }
  .expert-swipe {
    height: 3.3rem;
    background: #fff;
    display: flex;
    align-items: center;
    .expert-swipe-module {
      height: 2.6rem;
    }
    .expert-swipe-item {
      width: 254px!important;
      border-radius: 5px;
      margin-left: 20px;
      padding: 0.26rem;
      background:linear-gradient(237deg,rgba(208,255,228,1),rgba(227,255,239,1));
      box-shadow:0px 1px 10px 0px rgba(238,238,238,1);
      display: flex;
      align-items: center;
      // justify-content: space-around;
      &>div {
        height: 1.8rem;
      }
      .expert-image {
        width: 1.6rem;
        flex: 0 0 1.6rem;
        margin-right: 0.3rem;
        overflow: hidden;
        img {
          height: 100%;
        }
      }
      p,span {
        color: #333;
        // line-height: 17px;
      }
      .like {
        color: gray;
      }
      .expert_box {
        flex: 1;
        width: 0;
      }
      .expert-name {
        color: #0EC35D;
        font-size: 15px;
        margin: 0 0 8px 0;
      }
      .expert-intro {
        line-height: 0.4rem;
        height: 0.8rem;
        overflow: hidden;
        width: 100%;
        word-wrap: break-word;
      }
      .expert-pup {
        border: 1px solid rgba(52, 201, 117, 1);
        margin-top: 0.15rem;
      }
    }
  }
  .expert-leave-msg {
    margin-top: 24px;
    padding: 0 0.3rem 10px;
    background: #f1f5f8;
  }
  .expert-message {
    padding-left: 0.3rem;
    background-color: #fff;
    .expert-message-dec {
      padding: 0.3rem 0.3rem 0.3rem 0;
      display: flex;
      &:not(:last-child) {
        border-bottom: 1px solid #eee;
      }
      .message-photo {
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 0.45rem;
        flex-shrink: 0;
        margin-right: 0.24rem;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .message-info {
        width: 100%;
        p {
          margin-bottom: 6px;
        }
        img {
          width: 1.8rem;
        }
        .message-leave {
          margin: 13px 0;
          padding: 0.12rem 0.3rem;
          border-radius: 5px;
          background: #ECECEC;
        }
      }
      .expert-pup {
        color: #BFBFBF;
        border: 1px solid #BFBFBF;
        height: 18px;
        img {
          width: 11px;
        }
      }
    }
  }
  .expert-pup {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 19px;
    line-height: 16px;
    margin-top: 20px;
    border-radius: 9px;
    text-align: center;
    background: #fff;
    img {
      width: 11px;
      margin-right: 4px;
    }
    span {
      font-size: 12px;
    }
  }
  .send-leave-msg {
    position: fixed;
    bottom: 0;
    // bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 1.5rem;
    padding-bottom: 0.5rem;
    // padding: 8px 12px;
    background: #fff;
    box-shadow: 0px 3px 1px 3px rgba(212,212,212,1);
    .send-msg-input {
      padding: 0 10px;
      border-radius: 5px;
      width: 60%;
      height: 36px;
      line-height: 36px;
      background: #F5F5F5;
    }
    .send-upload {
      height: 31px;
      // margin: 0 8px;
    }
    .send-btn {
      height: 36px;
      line-height: 36px;
      border-radius: 6px;
      width: 20%;
      text-align: center;
      color: white;
      background: #34C975;
    }
  }
</style>
<style lang="scss">
.send-msg-input {
  padding: 0;
  .van-field__body {
    height: 100%;
  }
}
</style>

