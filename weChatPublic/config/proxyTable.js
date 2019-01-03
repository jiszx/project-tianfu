module.exports = {
  '/': {
    // target: 'http://10.13.3.204:9011', // 设置你调用的接口域名和端口号 别忘了加http
    target: 'http://testjsapi.cdwintech.com', // 设置你调用的接口域名和端口号 别忘了加http
    changeOrigin: true, // needed for virtual hosted sites
    pathRewrite: {

    }
  }
};
