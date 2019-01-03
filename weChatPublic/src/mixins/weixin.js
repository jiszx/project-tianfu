/**
 * 封装一个mixins用于微信接口相关操作
 */

import wx from 'weixin-js-sdk'
export default {
  data () {
    return {
      apiGetWeixinSignature: '/wechat/jsSign', // 13.1. js签名
      apiGetPaySignature: '/order/orders/pay', //10.7. 去支付
      apiGetPayVip: '/user/vipAuths/pay'
    }
  },
  methods: {
    /**
     * 检测是否是微信
     */
    isweixin () {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) === 'micromessenger') {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 微信初始化
     */
    initWeixin (callback) {
      let url = window.location.href.split("#")[0];
      // 通过后台接口拉去微信签名所需数据
      this.$axios.get(this.apiGetWeixinSignature, {
        url: url
      })
        .then(response => {
          let config = {
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.appId, // 必填，公众号的唯一标识
            timestamp: response.timestamp, // 必填，生成签名的时间戳
            nonceStr: response.nonce, // 必填，生成签名的随机串
            signature: response.signature, // 必填，签名，见附录1
            jsApiList: ['scanQRCode', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          };
          wx.config(config);
          if (callback) {
            callback();
          }
        })
        .catch(() => {

        })
    },
    /**
     * 支付
     */
    wxPay (params, successFn, cancelFn, errorFn) {
      function initPay () {
        if (typeof WeixinJSBridge === "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          onBridgeReady();
        }
      }
      function onBridgeReady () {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            appId : params.appId, // 公众号名称，由商户传入
            timeStamp: params.timeStamp, // 时间戳，自1970年以来的秒数
            nonceStr : params.nonceStr, // 随机串
            package :  params.package,
            signType :  params.signType, // 微信签名方式:
            paySign :  params.paySign // 微信签名
          }, function (res) {
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              console.log("微信支付成功!");
              if (successFn) {
                successFn(res);
              }
            } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
              console.log("用户取消支付!");
              if (cancelFn) {
                cancelFn(res)
              }
            } else {
              console.log("支付失败!");
              if (errorFn) {
                errorFn(res)
              }
            }
          });
      }
      initPay();
    },
    doPay(orderId, successFn, cancelFn, errorFn){
      this.$axios.post(this.apiGetPaySignature, {
        orderId: orderId,
        orderPayMode: 0, // 订单支付方式(0：微信，1：支付宝)
        payType: 0 // 支付类型(0：JSAPI支付，1：APP支付，2：扫码支付)
      })
        .then(res => {
          this.wxPay(res, successFn, cancelFn, errorFn)
        })
    },
    doPayVip(successFn, cancelFn, errorFn){
      this.$axios.post(this.apiGetPayVip, {
        orderPayMode: 0, // 订单支付方式(0：微信，1：支付宝)
        payType: 0 // 支付类型(0：JSAPI支付，1：APP支付，2：扫码支付)
      })
        .then(res => {
          this.wxPay(res, successFn, cancelFn, errorFn)
        })
    },
  }
}
