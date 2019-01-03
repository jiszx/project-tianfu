
$(function(){
	
	var contCla;// 存储专家列表信息
	$('.left-content ul').on('click','li',function(){
		$('.left-content ul>li').removeClass();
		$(this).addClass('options');
		var contNum = $(this).attr('data-content');
		expertRequest(contCla[contNum]);
	});
	
	var bt = baidu.template;
	bt.ESCAPE = false;
	/* 
	 * 专家列表 
	 */
	JQrequest('/found/professors/list',{},function(data){
		contCla = data;
		var expert_list = bt('experList', {"data": data});
		$('.left-content ul').html(expert_list);
		var proNum = getQueryString('proId');
		if(proNum<0||proNum>$('.left-content ul>li').length||proNum=='') proNum = 0
		$($('.left-content ul>li')[proNum]).addClass('options');
		expertRequest(data[proNum]);
	});
	
	/* 
	 * 问答
	 * pageNum: 当前页数
	 */
	function expertRequest(expert,pageNum){
		pageNum = pageNum || 1;
		/* 专家信息 */
		var expert_content = bt('experContent', expert);
		$('.expertIntroduce').html(expert_content);
		/* 问答列表 */
		JQrequest('/found/professors/officialQaList',{'data':{'professorId': expert.professorId,'page':pageNum, 'size': 3}},function(data){
			data.expertImage = expert.professorAvatarUrl
			var expert_html = bt('expertRightBox',data);
			if (data.list.length < 1){
				var expert_html = `<div class="not-message"><img src="./image/Kong-pic.png"/></div>`;
			}
			$('.expertInterlocution').html(expert_html);
			
			// var module = $(".expertContent .expertModel>.expertIntroduce>.professorIntroduce").get();
			// for(var i in module){
			// 	$clamp(module[i], {clamp: 2});
			// }
			
			paging('pageBox', data.total, function(obj, first){
				if(!first) expertRequest(contCla,obj.curr);
			}, data.size);
		}); 
	}
	
});
