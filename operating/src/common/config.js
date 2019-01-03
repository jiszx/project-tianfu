/**
 * 公共配置文件
 */
export let is_development = (window.location.href.split("#")[0]).match('testjsfront.cdwintech.com') || (window.location.href.split("#")[0]).match('http://localhost'); // 是否是测试环境，根据地质判断
export const baseURL = is_development ? 'http://testjsadmin.cdwintech.com' : 'http://admin.tfchn.com'; // baseURL用于配置axios
export const baseUrl = is_development ? 'http://testjsadmin.cdwintech.com' : 'http://admin.tfchn.com'; // baseUrl用于配置图片上传url
export const pageSize = [10, 20, 30, 50, 100];