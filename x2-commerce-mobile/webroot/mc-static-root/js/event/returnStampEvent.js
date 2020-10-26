$.namespace("returnStampEvent");
returnStampEvent = {
	init : function(){
		// 구매 조회 및 응모
		setTimeout(function() {
			returnStampEvent.regEventJson();
		}, 100);
		
		// 팝업 레이어 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});

		// 3구매 쿠폰 발급 클릭
		$("#orderDown30").click(function(){
			returnStampEvent.regThreeCpnDownJson();
		});
		
		// 5구매 쿠폰 발급 클릭
		$("#orderS6").click(function(){
			returnStampEvent.regFiveCpnDownJson();
		});
		
		// 내 구매내역 보기
		$("#orderS7").click(function(){
			returnStampEvent.getMyOrdListJson();
		});
	},
	
	/**
	 * 2017-10-26 돌려받는 구매 스템프 조회 및 응모
	 */
	regEventJson : function(){
		var param = {
			evtNo : $("#evtNo").val()
		}
		
		common.Ajax.sendJSONRequest(
			"POST"
			, _baseUrl + "event/201711/regEventJson.do"
			, param
			, returnStampEvent._callback_regEventJson
		);
	},
	
	/**
	 * 2017-10-26 돌려받는 구매 스템프 조회 및 응모 callback
	 */
	_callback_regEventJson : function(data){
		if(data != undefined && data != null){
			var ordList = data.ordList;
			if(ordList != undefined && ordList != null && ordList.length > 0){
				// 구매 도장 초기화
				$(".stamp").removeClass("on");
				$(".stamp").removeClass("end");
				$("#orderS6").removeClass("on");
				
				// 구매 도장 설정
				for(var i=0; i<ordList.length; i++){
					$("#orderS"+(i+1)).addClass("on");
					
					// 구매 도장 최대 5개
					if(i == 4){
						break;
					}
				}
				
				if(ordList.length >= 5){
					$("#orderS6").addClass("on");
				}
			}
			
			// 3구매 도장 설정
			var cpn3 = data.cpn3;
			if(cpn3 != undefined && cpn3 != null && cpn3 == "Y"){
				$("#orderS3").removeClass("on");
				$("#orderS3").addClass("end");
			}
			
			// 5구매 도장 설정
			var cpn5 = data.cpn5;
			if(cpn5 != undefined && cpn5 != null && cpn5 == "Y"){
				$("#orderS5").removeClass("on");
				$("#orderS5").addClass("end");
			}
		}
	},
	
	/**
	 * 2017-10-26 돌려받는 구매 스템프 3구매 쿠폰발급
	 */
	regThreeCpnDownJson : function(){
		if(!mevent.detail.checkLogin()){
            return;
        }
		
		var param = {
			evtNo : $("#evtNo").val()
		}
		
		common.Ajax.sendJSONRequest(
			"POST"
			, _baseUrl + "event/201711/regThreeCpnDownJson.do"
			, param
			, returnStampEvent._callback_regThreeCpnDownJson
		);
	},
	
	/**
	 * 2017-10-26 돌려받는 구매 스템프 3구매 쿠폰발급 callback
	 */
	_callback_regThreeCpnDownJson : function(data){
		if(data != undefined && data != null){
			alert(data.message);
			
			if(data.ret == "0"){
				setTimeout(function() {
					returnStampEvent.regEventJson();
				}, 100);
			}
		}
	},
	
	/**
	 * 2017-10-26 돌려받는 구매 스템프 5구매 쿠폰발급
	 */
	regFiveCpnDownJson : function(){
		if(!mevent.detail.checkLogin()){
            return;
        }
		
		var param = {
			evtNo : $("#evtNo").val()
		}
		
		common.Ajax.sendJSONRequest(
			"POST"
			, _baseUrl + "event/201711/regFiveCpnDownJson.do"
			, param
			, returnStampEvent._callback_regFiveCpnDownJson
		);
	},
	
	/**
	 * 2017-10-26 돌려받는 구매 스템프 5구매 쿠폰발급 callback
	 */
	_callback_regFiveCpnDownJson : function(data){
		if(data != undefined && data != null){
			if(data.ret == "0"){
				if(data.rtAmtVal == "10000"){
					$("#eventLayerWinner1").find("img").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201711/01stamp/win_03.png");
				} else if(data.rtAmtVal == "30000"){
					$("#eventLayerWinner1").find("img").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201711/01stamp/win_02.png");
				} if(data.rtAmtVal == "50000"){
					$("#eventLayerWinner1").find("img").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201711/01stamp/win_01.png");
				}
				
				mevent.detail.eventShowLayer('eventLayerWinner1');
				
				setTimeout(function() {
					returnStampEvent.regEventJson();
				}, 100);
			}else if(data.ret == "1"){
				mevent.detail.eventShowLayer('eventLayerWinner4');
			}else{
				alert(data.message);
			}
		}
	},
	
	/**
	 * 2017-10-26 돌려받는 구매 스템프 내 구매내역 보기
	 */
	getMyOrdListJson : function(){
		if(!mevent.detail.checkLogin()){
            return;
        }
		
		var param = {
			evtNo : $("#evtNo").val()
		}
		
		common.Ajax.sendJSONRequest(
			"POST"
			, _baseUrl + "event/201711/getMyOrdListJson.do"
			, param
			, returnStampEvent._callback_getMyOrdListJson
		);
	},
	
	/**
	 * 2017-10-26 돌려받는 구매 스템프 내 구매내역 보기 callback
	 */
	_callback_getMyOrdListJson : function(data){
		if(data != undefined && data != null){
			
			if(data.ret == "0"){
				$("#ordConts").removeClass("txt03");
				
				var $myOrdList = $("#myOrdList");
				$myOrdList.html("");
				
				var ordList = data.ordList;
				if(ordList != undefined && ordList != null && ordList.length > 0){
					
					var html = null;
					
					for(var i=0; i<ordList.length; i++){
						html = "<tr>";
						html += "<td>"+ordList[i].ordDtimeStr+"</td>";
						html += "<td>"+ordList[i].ordNo+"</td>";
						html += "<td><span>"+ordList[i].payAmt+"</span>원</td>";
						html += "</tr>";
						
						$myOrdList.append(html);
					}
				} else {
					$("#ordConts").html("해당 건이 없습니다.");
					$("#ordConts").addClass("txt03");
				}
				
				mevent.detail.eventShowLayer('eventLayerWinDetail');
			} else {
				alert(data.message);
			}
		}
	},
};