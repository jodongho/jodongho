$.namespace("bestSale");
bestSale = {
	init : function(){
		bestSale.bindEvent();
		
		// lazyload 처리
		common.setLazyLoad();
		
		// 찜 처리 초기화
		common.wish.init();
		
		// 인기검색어 목록 조회
		bestSale.getHotSearchList();
	},
	
	bindEvent : function(){
		setTimeout(function() {
            // 링크 처리
            common.bindGoodsListLink();
        }, 100);
	},
	
	/**
	 * 인기검색어 목록 조회(api)
	 */
	getHotSearchList : function(){
		$.ajax({
			type: "POST",
			url: _baseUrl + "search/getPopwordAjax.do?target=suddenkeyword",
			dataType: "json",
			data: {"datatype" : "json"},
			success: function(data) {
				var str = "<ul>";
				var num = 0;
				
				if(data.Data.Word.length != undefined && data.Data.Word.length !=''){
					$.each(data.Data.Word, function(i, item){
						if(num < 20){
							if(num < 3){
								str += "<li><a href=\"javascript:bestSale.popwordSearchdo('" + item.content + "');\"><span>" + item.id +"</span><strong>"+ item.content +"</strong></a></li>";
							}else{
								str += "<li><a href=\"javascript:bestSale.popwordSearchdo('" + item.content + "');\"><span>" + item.id +"</span>"+ item.content +"</a></li>";
							}
						}
						num++
					});
				}else{
					str += "<li><a href=\"javascript:bestSale.popwordSearchdo('" + data.Data.Word.content + "');\"><span>" + data.Data.Word.id +"</span><strong>"+ data.Data.Word.content +"</strong></a></li>";
				}
				str += "</ul>";
				
				$("#hotSearchList").html(str);
			}
		});
	},

	/**
	 * 인기급상승 검색
	 */
	popwordSearchdo : function(query) {
		
		var giftYn = common._giftCardCheck(query);
		
		location.href = _baseUrl + "search/getSearchMain.do?query=" + encodeURIComponent(query)+"&giftYn=" + giftYn;
	},
};    
