$.namespace("stampConr201806.detail");
stampConr201806.detail = {
	 init : function(){
		var stampFvrSeq = $("#stampFvrSeq").val();
		
		$(".stampLayer").addClass("todayEvt"+stampFvrSeq);
		
		$(".stampClick").click(function(){
			stampConr201806.detail.getEventConrStamp(stampFvrSeq);
		});
		
	    // 오늘의 뷰티템 닫기
		$(".stampClose").click(function(){
			$('.stampLayer').hide();
		});		
	},
	
	checkLogin : function(){
	    if(common.isLogin() == false){
	        if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
	            return false;
	        }else{
	            common.link.moveLoginPage();
	            return false;
	        }
	    }
	    return true;
	},
	  /**
     * 이벤트 팝업 레이어 열기 (공통)
     */
    eventShowLayer : function(obj) {
    	$('.allRightDim').show();
		$('.allRightResult').show();
		$('.allRightLayer').hide();
    },
    
    getEventConrStamp :function(fvrSeq){
        if(!stampConr201806.detail.checkLogin()){
            return;
		}
        
		var param = { 
				evtNo : $("#stempEvtNo").val(),
				fvrSeq : fvrSeq
		};
		common.Ajax.sendRequest(
				"GET"
			  , _baseUrl + "event/20180530_2/getEventConrStampJson.do"
			  , param
			  , this._callback_getEventConrStamp
		);
	},
	_callback_getEventConrStamp : function(json){
		if(json.ret=="0"){
			//스탬프 참여 시 이벤트 페이지로 이동
		    common.link.commonMoveUrl("event/getEventDetail.do?evtNo="+$("#stempEvtNo").val());
		}else if(json.ret=="013"){
		    alert("오늘은 이미 참여 하셨습니다.");
		}else{
			alert(json.message);
		}
	}
};