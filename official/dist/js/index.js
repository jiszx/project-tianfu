$(function(){
	
	let bt = baidu.template;
	bt.ESCAPE = false;//以html形式解析
	
	/* 首页新闻资讯等切换加载 */
	newsListRequest();
	$('.indexBox_news ul>li').click(function(){
		$('.indexBox_news ul>li').removeClass();
		$(this).addClass('options');
		const contCla = $(this).attr('data-content');
		$('.indexBox_news ul+a').attr({href:"about.html?type="+contCla})
		newsListRequest(contCla);
	});
	
	/* banner轮播 */
	JQrequest('/operation/banners/list',{data:{'bannerType':1}},function(data){
		const banners_html = bt('banners', {"list": data.list});
		$('.swiper-wrapper').html(banners_html);
		new Swiper ('.swiper-container', {
			effect : 'fade',
			height: 500,
			width: window.innerWidth,
			loop: true, // 循环模式
			speed:300,// 切换时间
			autoplay: {
				delay: 4000,
				stopOnLastSlide: false,
				disableOnInteraction: false,
			},
			// 分页器
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				type: 'custom',//这里分页器类型必须设置为custom,即采用用户自定义配置
				//下面方法可以生成自定义的分页器到页面上
				renderCustom: function(swiper, current, total) {
					var customPaginationHtml = "";
					for(var i = 0; i < total; i++) {
						//判断哪个分页器此刻应该被激活
						if(i == (current - 1)) {
							customPaginationHtml += '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
						} else {
							customPaginationHtml += '<span class="swiper-pagination-customs"></span>';
						}
					}
					return customPaginationHtml;
				},
			},
			// 前进后退按钮
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			}
		});
	});
	
	/* 课程列表 */
	JQrequest('/found/courses/list',{'data': {'size': 6}},function(data){
		const expert_html = bt('trainingClass', data);
		$('.indexBox_training .trainingBox').html(expert_html);
			let module = $(".indexBox_training .trainingModel>p").get();
			for(let i in module){
				$clamp(module[i], {clamp: 2});
			}
	});
	
	/* 点击课程培训跳转到对应详情页 */
	$('.indexBox_training .trainingBox').on("click",".trainingModel",function(event){
		const couId = $(this).attr('data-courseId');
		window.location.href = "cultivateParticulars.html?courseId="+couId;
	});
	
	/* 专家库 */
	JQrequest('/found/professors/officialList',{},function(data){
		const expert_html = bt('expertModel',{"data": data});
		$('.swiper-loop').html(expert_html);
		/* 首页专家库切换 */
		new Swiper ('.ExpertBox', {
			loop: true, // 循环模式选项
			wrapperClass: 'swiper-loop',
			slideClass : 'ExpertModel',
			navigation: {
				nextEl: '.leftArrow',
				prevEl: '.rightArrow',
			}
		});
			let module = $('.indexBox_expert .expert>p').get();
			for(let i in module){
				$clamp(module[i], {clamp: 3});
			}
			let expmod = $('.indexBox_expert .leave p').get();
			for(let i in expmod){
				$clamp(expmod[i], {clamp: 2});
			}
	});
	
	/* more按钮切换效果 */
	$('.boxContent>.more').hover(function(){
		$(this).html("<img src='image/moer-arrow-hover.png'/>")
	},function(){
		$(this).html('MORE')
	});
	
	/* 资讯新闻列表 */
	function newsListRequest(newsList){
		newsList = newsList || 0;
		let newsListSize = 3;
		if(newsList==0){newsListSize=1}
		JQrequest('/operation/news/list',{'data':{'newsType':newsList, 'page':1, 'size': newsListSize}},function(data){
			let expert_html;
			if(data.list.length<=0){
				expert_html = "暂无数据"
			}else if(newsList==0){
				expert_html = bt('newsList_1',data);
			} else {
				for(var i = 0; i<data.length; i++) {
					data.newsInfo = $.parseHTML(data.newsInfo)
				}
				expert_html = bt('newsList_2',data);
			}
			$('.content').html(expert_html);
		});
	}
	
});
