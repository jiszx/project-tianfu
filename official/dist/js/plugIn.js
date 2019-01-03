document.write("<script src='js/baiduTemplate.js'></script>");
document.write("<script src='layui/layui.js'></script>");

/* 
 * 刷新返回页面顶部
 */
window.onload = function(){
	setTimeout(function(){
		$(window).scrollTop(0)
	},0);
}

// var baseUrl = 'http://10.13.3.204:9011'
// var baseUrl = 'http://testjsapi.cdwintech.com'; // 测试api地址
var baseUrl = 'http://api.tfchn.com'; // 正式api地址

/* 
 * Rurl: 请求地址
 * data: 请求参数
 * methods: 请求方式
 * headers: 请求头
 * asyncType: 异步同步控制
 * calback: 回调函数
 */
/* function JQrequest(Rurl, {data={}, methods='GET', header={}, asyncType=true}, calback){ */
function JQrequest(Rurl, argsObj, calback){
	var data = argsObj.data || {},
		methods = argsObj.methods || 'GET',
		header = argsObj.header || {},
		asyncType = argsObj.asyncType || true;
	
	header = {
		'Accept': 'application/json;charset=UTF-8',
		'Content-Type': 'application/x-www-form-urlencoded'
	}
	layui.use('layer', function(){
		var index = layui.layer.load(1)
		$(".layui-layer-loading").hide();
		$(".layui-layer-shade").hide();
		setTimeout(function(){
			$(".layui-layer-loading").show();
			$(".layui-layer-shade").show();
		}, 500);
		$.ajax({
			url: baseUrl+""+Rurl,
			type: methods,
			headers: header,
			async: asyncType,
			data: data,
			// dataType: 'jsonp',
			success: function(data, textStatus, jqXHR){
				layui.layer.close(index);
				if(data.status==400) {
					layui.layer.alert('请求不存在', {icon: 2});
				} else if(data.status==200) {
					calback(data.data)
				}
			},
			error: function(){
				layui.layer.close(index);
				// layui.layer.alert('请求失败', {icon: 2});
			}
		});
	});
}

/* 分页
 * pageId: 存放分页div的ID
 * countNum: 数据总数
 * jumpFun: 回调函数
 * limitNum: 每页显示的条数,默认10
 */
function paging(pageId,countNum,jumpFun,limitNum){
	limitNum = limitNum || 10;
	layui.use('laypage', function(){
		var laypage = layui.laypage;
		
		//执行一个laypage实例
		laypage.render({
			elem: pageId
			,count: countNum
			,limit: limitNum
			,jump: jumpFun
			,curr: location.hash.replace('#!1=', '') //获取起始页
			,hash: '1' //自定义hash值
			,prev: '<'
			,next: '>'
			,theme: '#34C975'
		});
	});
}

/* 
 * 获取url参数
 * name: 参数名
 * targetUrl: 分解的url
 */
function getQueryString(name, targetUrl) {
	targetUrl = targetUrl || window.location.href;
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var targetSearch = targetUrl.split('?')[1];
	if(targetSearch == undefined){
		return -1
	}
    var r = targetSearch.match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

/* 
 * 时间戳转换时间
 * timestamp: 13位时间戳
 */
function timestampToTime(timestamp) {
	var date = new Date(timestamp);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate() + ' ';
	var h = date.getHours() + ':';
	var m = date.getMinutes() + ':';
	var s = date.getSeconds();
	return Y+M+D+h+m+s;
}

/* 
 * 导航切换效果
 */
$(function(){
	$(".box_head .nav").after('<span class="jsMoveEl"></span>');
	$(".jsMoveEl")[0].style.left = $(".options")[0].offsetLeft+"px";
	$(".box_head .nav>li").hover(function(){
		$(".jsMoveEl")[0].style.left = $(this)[0].offsetLeft+"px"
	});
	$(".box_head .nav>li").mouseleave(function(){
		$(".jsMoveEl")[0].style.left = $(".options")[0].offsetLeft+"px"
	});
});
