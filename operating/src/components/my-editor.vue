/**
props:
methods:
getContent:获取编辑器内容
setContent：设置编辑器内容
destroy:注销编辑器

*/
<template>
  <div class="editor">
    <div ref="editor" style="text-align:left"></div>
  </div>
</template>
<script>
  import E from 'wangeditor'
  export default {
    name: 'my-editor',
    props: {
      config: {
        type: Object,
      },
      action:{
        type: String
      }
    },
    data(){
      return {
        editor: null,
        editorHasReady:false,
        editorContent: '',
      }
    },
    computed:{
      editorConfig(){
        var option = {};
        option.lang='zh-cn';
        for(let key in this.config){
          option[key] = this.config[key];
        }
        if(!this.config){
          option.initialFrameWidth=null;
          option.initialFrameHeight=500;
        }
        return option;
      },
    },
    mounted(){
      let _this = this;
      this.editor = new E(this.$refs.editor)
      // 限制一次最多上传 1 张图片
      this.editor.customConfig.uploadImgMaxLength = 1
      // 配置服务器端地址
      this.editor.customConfig.customUploadImg =  (files, insert)=> {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        var data=new FormData();
            data.append('file',files[0])
        this.$axios(
          {
            url:this.action, 
            method:'post',
            data:data,
            unStringify:true      
          })
          .then(res=>{
            console.log(res);
            insert(res.data.data[0].pathUrl);
          })
        // 上传代码返回结果之后，将图片插入到编辑器中
        insert('')
      }
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'list',  // 列表
        'justify',  // 对齐方式
        'image',  // 插入图片
        'undo',  // 撤销
        'redo'  // 重复
      ]
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.$emit('change',this.editorContent);
      }
      this.editor.create()
    },
    methods: {
      getContent() { // 获取内容方法
        return this.editor.txt.html()||'';
      },
      setContent(Msg){
        var timer;
        if(!this.editor){
          timer = setInterval(()=>{
            if(this.editor) {
              this.editor.txt.html(Msg||'')
              clearInterval(timer);
            }
          },50);
          return;
        }
        this.editor.txt.html(Msg||'')
      },
      destroy(){
        this.editor.destroy();
        this.editor=undefined;
      },
      disabled() {
        this.editor.$textElem.attr('contenteditable', false)
      },
    },
    destroyed(){
      if(this.editorHasReady&&this.editor){
        this.editor.destroy();
      }
    }
  }
</script>
<style scoped>
  .editor{
    line-height: 1.5;
  }
</style>
