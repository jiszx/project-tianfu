$(function(){
	var bt = baidu.template;
	bt.ESCAPE = false;
	JQrequest('/operation/news/info',{'data':{'newsId':getQueryString('newsId')}},function(data){
		var newsInfo_html = bt('newsInfo',data);
		$('.particularsBox .boxContent').html(newsInfo_html);
	});
	
});