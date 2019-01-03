module.exports = {
    '/': {
        // target: 'http://10.13.3.204:9012', //设置你调用的接口域名和端口号 别忘了加http
        target: 'http://testjsadmin.cdwintech.com',
        // target: 'http://api.tfchn.com',
        changeOrigin: true, // needed for virtual hosted sites
        pathRewrite: {

        }
    },
};
