/**
 * 公共配置文件
 */
export let is_development = (window.location.href.split("#")[0]).match('http://testjshwx.cdwintech.com') || (window.location.href.split("#")[0]).match('localhost'); // 是否是测试环境，根据地址来判断
export const baseURL = is_development ? 'http://testjsapi.cdwintech.com' : 'http://api.tfchn.com'; // base_URL 用于配置axios
export const clientId = 'F13B4uCV5dQaTScicOy1fG4XFPzliqt5'; // 签名算法clientId
export const clientSecret = 'DYCmO5zUCBWWB7mjUugA3t0eRcf8YWRi'; // 签名算法clientSecret
// defaultAuthorization当没有Access_token时用这个默认值代替，仅限于获取Access_token接口
export const defaultAuthorization = 'RjEzQjR1Q1Y1ZFFhVFNjaWNPeTFmRzRYRlB6bGlxdDU6WldyM0RzSDV3ZjV6MkdUY3FHR1RUN0FCUkszYlZNd2tNZU0zTEM1dVgwYUFSa2dnOTN3czZxZnJIMTROamlPMg==';
// 认证页面
export const wx_authorization_url = is_development
 ? 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8f94d221430cbde0&redirect_uri=http%3A%2F%2Ftestjsapi.cdwintech.com%2Fwechat%2Foauth&response_type=code&scope=snsapi_userinfo#wechat_redirect'
 : 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8f94d221430cbde0&redirect_uri=http%3A%2F%2Fapi.tfchn.com%2Fwechat%2Foauth&response_type=code&scope=snsapi_userinfo#wechat_redirect';