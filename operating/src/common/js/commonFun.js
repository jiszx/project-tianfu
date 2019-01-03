import { Message } from 'element-ui';
import { prototype } from 'node-notifier/notifiers/growl';
let commonFun={
    /* 存储localStorage */
    setLocalStorage(name, content){
        if (!name) return
        if (typeof content !== 'string') {
          content = JSON.stringify(content)
        }
        window.localStorage.setItem(name, content)
    },
    /* 获取localStorage */
    getLocalStorage(name){
        if (!name) return
        let data = window.localStorage.getItem(name)
      
        return data ? JSON.parse(data) : undefined
    },
    /* 删除localStorage */
    removeLocalStorage(name){
        if (!name) return
        window.localStorage.removeItem(name)
    },
    /* 存储sessionStorage */
    setSessionStorage(name, content){
      if (!name) return
      if (typeof content !== 'string') {
        content = JSON.stringify(content)
      }
      window.sessionStorage.setItem(name, content)
  },
  /* 获取sessionStorage */
  getSessionStorage(name){
      if (!name) return
      let data = window.sessionStorage.getItem(name)
    
      return data ? JSON.parse(data) : undefined
  },
  /* 删除sessionStorage */
  removeSessionStorage(name){
      if (!name) return
      window.sessionStorage.removeItem(name)
  },
  authorComparise(str,arr){
    var isAuthor=false;
    for(var i=0;i<arr.length;i++){
      if(arr[i]==str){
        isAuthor=true;
        break;
      }
    }
    return isAuthor;
  },
    Cookie:{
        /**
         * getCookie
         * @param name
         * @returns {*}
         */
        get (name) {
          var strCookie = document.cookie
          var arrCookie = strCookie.split('; ')
          for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split('=')
            if (arr[0] === name) return arr[1]
          }
          return ''
        },
      
        /**
         * 添加cookie
         * @param name
         * @param value
         * @param expiresHours
         * @param domain
         */
        set (name, value, expiresDays, domain) {
          var cookieString = name + '=' + (!value ? value : '')
          var date = new Date()
          if (domain !== undefined) {
            domain = ';domain=' + domain
          } else {
            domain = ''
          }
          date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000)
          cookieString = cookieString + domain + '; path=/; expires=' + date.toGMTString()
          document.cookie = cookieString
        },
      
        /**
         * 删除cookie
         * @param name
         */
        remove (name) {
          this.set(name, '', -1)
        }
      },
    /**
     * 转换标准时间为时间戳：例如将2016/1/20 19:59:30转换成时间戳形式1484913570000
     * @param dateStr
     * @returns {number}
     */
    getDateTimeStamp(dateStr){
        return Date.parse(dateStr.replace(/-/gi, '/'))
    },    
    /**
     * 时间格式方法
     *
     * @param {any} timeStamp  时间戳，秒级/毫秒级
     * @param {any} type 格式化时间类型，默认  Y-M-D H:I:S
     * @returns {string} formatTime 格式化后的时间 例如： 2017-05-05 12:09:22
     */   
    formatDate (nS, str) {
        if (!nS) {
          return ''
        }
        if (isNaN(parseInt(nS))) {
          return nS
        }
        var date = new Date(nS)
        var year = date.getFullYear()
        var mon = date.getMonth() + 1
        var day = date.getDate()
        var hours = date.getHours()
        var minu = date.getMinutes()
        var sec = date.getSeconds()
      
        if (str === 'yyyy-MM-dd') {
          return year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day)
        } else if (str === 'hh-mm-ss') {
          return (hours < 10 ? '0' + hours : hours) + ':' + (minu < 10 ? '0' + minu : minu) + ':' + (sec < 10 ? '0' + sec : sec)
        } else if (str === 'yyyy/MM/dd') {
          return year + '/' + (mon < 10 ? '0' + mon : mon) + '/' + (day < 10 ? '0' + day : day)
        } else if(str==='yyyy-MM-dd hh-mm'){
          return year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day) + ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minu < 10 ? '0' + minu : minu) ;
        }else
        {
          return year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day) + ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minu < 10 ? '0' + minu : minu) + ':' + (sec < 10 ? '0' + sec : sec)
        }
      }, 
    /**
     * 获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
     * @returns {string}
     */      
    getNowFormatTime () {
    var date = new Date()
    var seperator1 = '-'
    var seperator2 = ':'
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        ' ' + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds()
    return currentdate
    }, 
    /**
     * 将时间戳转化为几天前,几小时前，几分钟前形式
     * @param dateTimeStamp 时间戳
     * @returns {*|string}
     */
    getDateDiff(dateTimeStamp) {
        if(!dateTimeStamp){
        return '';
        }
        var result;
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        if (diffValue < 0) { return ''; }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        if (monthC >= 1) {
        result = "" + parseInt(monthC) + "月前";
        } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
        } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
        } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "小时前";
        } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
        } else {
        result = "刚刚";
        }
        return result;
    },         
    downloadFile(url){
        window.open(url)
    },
    /* 全局图片上传验证 */
    beforeImgUpload(file,size,types){
      console.log(file);
          const isLt = file.size / 1024 / 1024 < size;
          let type = file.name.split('.').pop();
          let isType=false;
           types.forEach(item=>{
            if(type.toLowerCase()==item||type.toUpperCase()==item){
               isType=true;
            }
           })
          if (!isType) {
            Message.error(`上传图片只能是 ${types.join('、')} 格式!`);
          }
          if (!isLt) {
            Message.error(`上传图片大小不能超过 ${size}MB!`);
          }
          return isType && isLt;     
    },
    getFile(url, params) {
      let tempParams = {}
      if (params) {
        for (let key in params) {
          if (params[key] !== '') {
            tempParams[key] = params[key]
          }
        }
      }
      tempParams.access_token = this.getSessionStorage('user_token').access_token;
      // 拼接下载地址
      let list = [];
      for (let key in tempParams) {
        list.push(key.toString() + '=' + tempParams[key]);
      }
      url = url + '?' + list.join('&')
      this.downloadFile(url);
    },
    // getAddressName(address, addrId) {
    //   let arr = [];
    //   let forItem = address;
    //   addrId.map((item, index) => {
    //     arr.push(funMap(index));
    //   })
    //   return arr

    //   function funMap(j) {
    //     for (let i = 0; i < forItem.length; i++) {
    //       if (forItem[i].areaCode === addrId[j]) {
    //         let name = forItem[i].areaName;
    //         forItem = forItem[i].children;
    //         return name;
    //       }
    //     }
    //   }
    // },
  /**
   * 获取地址名称
   * @param {*} address 
   * @param {*} addrId 
   * @param {*} id 
   * @param {*} rename 
   */
  getAddressName(address, addrId, id, rename) {
    let arr = [];
    let forItem = address;
    addrId.map((item, index) => {
      arr.push(funMap(index));
    })
    return arr
    function funMap(j) {
      for(let i = 0; i < forItem.length; i++) {
        if(forItem[i][id] === addrId[j]) {
          let name = forItem[i][rename];
          forItem = forItem[i].children;
          return name;
        }
      }
    }
  },
}
export{
    commonFun
}