$(function(){
	
	var bt = baidu.template;
	bt.ESCAPE = false;
	
	var newsType = getQueryString("type")<0 || getQueryString("type")==''?0:getQueryString("type");
	$('.left-content ul>li[data-content='+newsType+']').addClass('options');
	newsListRequest(newsType,1);
	
	/* 新闻、法规等切换 */
	$('.left-content ul>li').click(function(){
		$('.left-content ul>li').removeClass();
		$(this).addClass('options');
		newsType = $(this).attr('data-content');
		newsListRequest(newsType,1);
	});
	
	/*
	 * 资讯新闻列表
	 * newsListNo: 类型
	 * pageNum: 页码
	*/
	function newsListRequest(newsListNo, pageNum){
		newsListNo = newsListNo || 0;
		pageNum = pageNum || 1;
		JQrequest('/operation/news/list',{'data':{'newsType':newsListNo, 'page':pageNum, 'size': 6}},function(data){
			var expert_html = bt('newsList',data);
			$('.aboutModel').html(expert_html);
			
			var module = $(".aboutContent .aboutBox>p").get();
			for(var i in module){
				$clamp(module[i], {clamp: 2});
			}
			
			//分页
			paging('pageBox', data.total, function(obj, first){
				if(!first) newsListRequest(newsType,obj.curr);
			}, data.size);
		});
	}
	
});