$.namespace("conrEvent.detail");
conrEvent.detail = {
	 init : function(){
		var stampFvrSeq = $("#stampFvrSeq").val();
		
		$(".allRightLayer").addClass("allEvt"+stampFvrSeq);
		
		$(".allEvtClick").click(function(){
			conrEvent.detail.getEventConrStamp(stampFvrSeq);
		});
		
	    // 오늘의 뷰티템 CLICK
//		$(".allRightLayer .allEvtClick").click(function(){
//			$('.allRightDim').show();
//			$('.allRightResult').show();
//			$('.allRightLayer').hide();
//		});
	    // 오늘의 뷰티템 닫기
		$(".allEvtClose").click(function(){
			$('.allRightLayer').hide();
		});
	    // 결과화면 닫기
		$(".allEvtClose2").click(function(){
			$('.allRightDim').hide();
			$('.allRightResult').hide();
		});
		
	}
	
	, checkLogin : function(){
	    if(common.isLogin() == false){
	        if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
	            return false;
	        }else{
	            common.link.moveLoginPage();
	            return false;
	        }
	    }
	    return true;
	}
	  /**
     * 이벤트 팝업 레이어 열기 (공통)
     */
    ,eventShowLayer : function(obj) {
    	$('.allRightDim').show();
		$('.allRightResult').show();
		$('.allRightLayer').hide();
    }
    
	, getEventConrStamp :function(fvrSeq){
		if(!conrEvent.detail.checkLogin()){
			return;
		}
		
		var param = { 
				evtNo : $("#evtNo").val(),
				fvrSeq : fvrSeq };
		common.Ajax.sendRequest(
				"GET"
			  , _baseUrl + "event/20180301/getEventConrStampJson.do"
			  , param
			  , this._callback_getEventConrStamp
		);
	}
	,_callback_getEventConrStamp : function(json){
		if(json.ret=="0"){
			//오늘의 뷰티템을 찾으셨네요!
			$("#beautyItemImg").attr("src",_cdnImgUrl+"contents/201803/01allright/allright_pop_02.png");
			$('.allRightDim').show();
			$('.allRightResult').show();
			$('.allRightLayer').hide();
		}else if(json.ret=="013"){
			$("#beautyItemImg").attr("src",_cdnImgUrl+"contents/201803/01allright/allright_pop_01.png");
			$('.allRightDim').show();
			$('.allRightResult').show();
			$('.allRightLayer').hide();
		}else{
			alert(json.message);
		}
	}
};