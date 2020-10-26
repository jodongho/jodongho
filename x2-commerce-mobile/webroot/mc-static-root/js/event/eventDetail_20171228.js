$.namespace("monthEvent.detail");
/**
 * 2017.12.28 12월 타로점 프로모션 (2017.12.23 ~ 2018.01.22)
 */

var selTarotList = [];

monthEvent.detail = {
	snsInitYn : "N",
	
	init : function(){
		// Frequently Asked Question
		var article = $('.faqBody .box');
		article.addClass('off');
		article.find('.detail').hide();
		article.eq(0).removeClass('off');
		article.eq(0).find('.detail').show();
		
		$('.tarotResult .box .sub').click(function(){
			var myArticle = $(this).parents('.box:first');
			if(myArticle.hasClass('off')){
				article.addClass('off').removeClass('show');
				article.find('.detail').slideUp(100);
				myArticle.removeClass('off').addClass('show');
				myArticle.find('.detail').slideDown(100);
			} else {
				myArticle.removeClass('show').addClass('off');
				myArticle.find('.detail').slideUp(100);
			}
			return false;
		});
		
		monthEvent.detail.initCardArrange();
		
		// 쿠폰영역
		$("div#downCoupon30").click(function(){
			monthEvent.detail.checkIssueYearCoupon();
		}); 
		// 타로카드 클릭 이벤트 
		$("div[id^='tarotCard']").click(function(){
			monthEvent.detail.selectTarotCard($(this));
		});
		// 신년운세보기
		$("div#tarotE01").click(function(){
			monthEvent.detail.getTarotResult();
		});
		// 나의 운세 다시보기 
		$("div#tarotE02").click(function(){
			monthEvent.detail.reviewTarotResult();
		});
		
		$("div#tarotS01").click(function(){
			monthEvent.detail.shareSns('','2018년 새해 신년 타로 운세');
		});
		
		// 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
		
	},
	//카드이미지변경
	getCardEvtInfo : function(){
		var changeDate = "20180117";
	 
	    var now = new Date();
	    year = now.getFullYear();
	    month = now.getMonth() + 1; 
	    date = now.getDate();
	    if ((month + "").length < 2) {
            month = "0" + month; 
	    }
	    if ((date + "").length < 2) {
	            date = "0" + date; 
	    }
	 
	    today = year + "" + month + "" + date; //오늘날짜
	 
	    if ((eval(today) >= eval(changeDate)) ) {
	    	$("#luckyAfter").show();  
	    	$("#luckyBefore").hide(); 
	    }else{
	    	$("#luckyBefore").show();
	    	$("#luckyAfter").hide();  
	    }
	},
	/**
	 * 카드 배열 초기화(shuffle)
	 */
	initCardArrange : function(){
		var cardList = $("#targetNum").val().split("|");
		
		for(var i=0;cardList.length >= i; i++ ){
			var idStr ="";
			var baseId ="";
			if(i < 10){
				baseId +="0";
			}
			if(cardList[i] < 10){
				idStr +="0";
			}
			
			baseId += i;
			idStr+=cardList[i];
			
			var obj = $("div[id^='tarotCard']").eq(i);
			
			obj.attr("id","tarotCard_"+idStr);
			obj.find(".back>img").attr("src","//image.oliveyoung.co.kr/uploads/contents/201712/28tarot/tarotCard"+idStr+".png");
			
		}
	},
	/**
	 * 나의 운세 다시보기
	 */
	reviewTarotResult : function(){
		if(common.app.appInfo.isapp){
			if(!mevent.detail.checkLogin()){
				return;
			}
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
			};
			common.Ajax.sendRequest(
					"GET"
				  , _baseUrl + "event/20171228/reviewTarotResult.do"
				  , param
				  , this._callback_getTarotResult
			);
		}else{
			alert("모바일 앱에서만 참여 가능합니다.");
		}
		
	},
	_callback_reviewTarotResult : function(json){
		if(json.ret=="0"){
			taroResultView(json);
		}else{
			alert(json.message);
		}
		
	},
	
	/**
	 * 카드선택
	 */
	selectTarotCard : function(obj){
		if(common.app.appInfo.isapp){
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(obj.hasClass("flipped")){
				//배열 삭제 
				var delIdx = selTarotList.indexOf(obj.attr("id").split("_")[1]);
				
				if(delIdx >-1){
					selTarotList.splice(delIdx,1);
				}
				obj.removeClass('flipped');
			}else{
				//배열 추가 
				if(selTarotList.length >=5){
					alert("카드는 5장만 선택 가능합니다.");
					return; 
				}
				selTarotList.push(obj.attr("id").split("_")[1]);
				
				obj.addClass("flipped");
			}
		}else{
			alert("모바일 앱에서만 참여 가능합니다.");
		}
	},
	/**
	 * 신년운세 결과보기 
	 */
	getTarotResult : function(){
//		if(common.app.appInfo.isapp){
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(selTarotList.length <5){
				alert("카드 5장 선택 후 참여 가능합니다.");
				return; 
			}
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
					, selTarotList : selTarotList.toString()
			};
			common.Ajax.sendRequest(
					"GET"
				  , _baseUrl + "event/20171228/getTarotResult.do"
				  , param
				  , this._callback_getTarotResult
			);
//		}else{
//			alert("모바일 앱에서만 참여 가능합니다.");
//		}
		
	},
	_callback_getTarotResult : function(json){
		if(json.ret == "0"){
			
			var jsonTarotList = json.selTarotList.split(",");
			
			var url ="//image.oliveyoung.co.kr/uploads/contents/201712/28tarot/";
			//첫번째 카드 
			$("#reult1_name").html(json.reult1_name);
			$("#reult1_card > img").attr("src",url+"tarotCard"+jsonTarotList[0]+".png");
			$("#reult1_mean").html(json.reult1_mean);
			
			//직업운/학업운
			$("#reult1_data1").html(json.reult1_data1);
			//애정운
			$("#reult1_data2").html(json.reult1_data2);
			//금전운
			$("#reult1_data3").html(json.reult1_data3);
			//인간관게운
			$("#reult1_data4").html(json.reult1_data4);
			//건강운
			$("#reult1_data5").html(json.reult1_data5);
			
			//두번째카드 - 일년의 행운
			$("#reult2_name").html(json.reult2_name);
			$("#reult2_card > img").attr("src",url+"tarotCard"+jsonTarotList[1]+".png");
			$("#reult2_mean").html(json.reult2_mean);
			//내용
			$("#reult2_data").html(json.reult2_data);
			
			//세번째카드 - 일년의 심리
			$("#reult3_name").html(json.reult3_name);
			$("#reult3_card > img").attr("src",url+"tarotCard"+jsonTarotList[2]+".png");
			$("#reult3_mean").html(json.reult3_mean);
			//내용
			$("#reult3_data").html(json.reult3_data);
			
			//네번째 카드
			$("#reult4_name").html(json.reult4_name);
			$("#reult4_card > img").attr("src",url+"tarotCard"+jsonTarotList[3]+".png");
			$("#reult4_mean").html(json.reult4_mean);
			//내용
			$("#reult4_data").html(json.reult4_data);
			
			//다섯번째 카드 
			$("#reult5_name").html(json.reult5_name);
			$("#reult5_card > img").attr("src",url+"tarotCard"+jsonTarotList[4]+".png");
			$("#reult5_mean").html(json.reult5_mean);
			//내용
			$("#reult5_data").html(json.reult5_data);
			
			mevent.detail.eventShowLayer('eventLayerTarot');
		}else{
			alert(json.message);
		}
	},
	
	/**
	 * 쿠폰 다운로드
	 */
	checkIssueYearCoupon : function(fvrSeq) {
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}

		var param = {
			  evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendRequest(
				"GET"
			  , _baseUrl + "event/20171228/checkIssueYearCoupon.do"
			  , param
			  , this._callback_checkIssueYearCoupon
		);
	},
	_callback_checkIssueYearCoupon : function(json) {
		alert(json.message);
	},
	
	/**
	 * sns 공유하기
	 * type 값 kakaotalk
	 */
	shareSns : function(imgUrl, title){
		var type = "kakaotalk";

		// 배너 이미지 체크
		var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
		if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
			bnrImgUrlAddr = "";
		} else {
			bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
		}

		// 이미지가 없을 경우만 배너로 교체
		if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
			imgUrl = bnrImgUrlAddr;
		}

		var snsShareUrl = _baseUrl + "T.do?evtNo="+$("#evtNo").val();

		if(monthEvent.detail.snsInitYn == "N"){
			common.sns.init(imgUrl, title, snsShareUrl);
			monthEvent.detail.snsInitYn = "Y";
		}

		common.sns.doShare(type);
	},
}