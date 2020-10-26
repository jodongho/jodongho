/**
 * 배포일자 : 2020-10-08
 * 오픈일자 : 2020-10-16
 * 이벤트명 : app 활성화 프로모션
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	layerPolice : false,
	applyFvrSeq : '',
	smsYn : '',
	staffChkfvrSeq : '8',
	currentDay : '',
	timeType : "10",
	popId : "",
	applyYn : "N",
	init : function(){
		
		$('.btnTab1').on('click',function(){
			$('.evtCon01').removeClass('none');
			$('.evtCon02, .evtCon03').addClass('none');
		});
		$('.btnTab2').on('click',function(){
			$('.evtCon01').addClass('none');
			$('.evtCon02, .evtCon03').removeClass('none');
		});

		
		monthEvent.detail.storeCd = $("#strNo").val();
		monthEvent.detail.getCheckApply();
		monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
		monthEvent.detail.popId = "popStoreCoupon_ver1";
        if(monthEvent.detail.currentDay.substring(0,8) >= $("#chgEvtDate").val()){	//pc 7월출석체크
        	monthEvent.detail.popId = "popStoreCoupon_ver2";
        	$(".oyEvent_wrap").addClass("ver2")
        	monthEvent.detail.staffChkfvrSeq = "9";
        	monthEvent.detail.timeType = "11";
        }
        
        
        $(".couponDown2").click(function(){
        	var encCpnNo;
        	if(monthEvent.detail.currentDay.substring(0,8) < $("#chgEvtDate").val()){	//pc 7월출석체크    	        
        		encCpnNo = $("#cpnNo1").val(); //1차
            }else{
            	encCpnNo = $("#cpnNo2").val();//2차
            }
        	mevent.detail.downAppCouponEventJson(encCpnNo);
        });
        
        $(".btn_confirm").click(function(){
	        if(!$("#"+monthEvent.detail.popId+" .top").hasClass("complete")){
	        	if(confirm("직원 확인 처리 후에는 쿠폰 재사용 불가합니다. 사용하시겠습니까?")){
	        		monthEvent.detail.couponUseConfirm();
	        	}
	        }
        });
        
		//위수탁 동의
		$('.agreeBtn').click(function(){
    		if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
                alert("두 가지 모두 동의 후 참여 가능합니다.");
                mevent.detail.eventCloseLayer();
                return;
            }

			monthEvent.detail.apply(monthEvent.detail.applyFvrSeq);
		});

		//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .close').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });
        
        $(".toggle").click(function(){
        	if(!monthEvent.detail.checkLoginEvt()){
                return;
            }
        	monthEvent.detail.setAppPushToggle();
        });
        
	},
	
	setAppPushToggle : function(){
		if(!$(".toggle").hasClass("on")){ // appPush 미동의 자의 경우
			mevent.detail.mktRcvSend(monthEvent.detail.smsYn);
			$(".toggle").addClass("on");
			return;
		}else{
			alert("앱 설정 메뉴에서 변경 가능합니다.");
			return;
		}
	},

	//참여 정보 조회
	getCheckApply : function(){
		if(!common.isLoginForEvt()){
			$('.btnApply01').attr('onclick', "monthEvent.detail.beforeApply('1');");
    		$(".btnApply02").attr('onclick', "monthEvent.detail.beforeApply('2');");
            return;
        }
		
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
        	,inFvrSeqArr : "1,2,3,4,5,6,7"        	
        };
        
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20201002/getCheckApply.do"
       	   , param
       	   , monthEvent.detail._callback_getCheckApply
        );
    },

    _callback_getCheckApply : function(json){
        if(json.ret == "0"){
        	if(json.moAplyYn == 'Y'){ // 모바일에서
        		$(".btnApply01").addClass("on");
        		$('.btnApply01').attr('onclick', "monthEvent.detail.getMyApply('1');");     
        		monthEvent.detail.applyYn = "Y";
        	}else{
        		$('.btnApply01').attr('onclick', "monthEvent.detail.beforeApply('1');");        	
        	}        	
        	
        	if(json.strAplyYn == 'Y'){ //qr로
        		$(".btnApply02").addClass("on");
        		$('.btnApply02').attr('onclick', "monthEvent.detail.getMyApply('2');");
        		monthEvent.detail.applyYn = "Y";
        	}else{
        		$('.btnApply02').attr('onclick', "monthEvent.detail.beforeApply('2');");        	
        	}
        	
        	if(monthEvent.detail.storeCd != "" && monthEvent.detail.storeCd != null){
        		$(".btnApply02").addClass("qr");
        	}
        	
        	monthEvent.detail.smsYn = json.smsRcvAgrYn;
        	
        	if(json.appPushYn == 'Y'){
        		$(".toggle").addClass("on");
        	}
        }
    },
    
    getMyApply : function(type){
    	if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
    	
    	var param = {
	        	evtNo : $("input[id='evtNo']:hidden").val()
	        	,submitType : type // 1: 일반응모 / 2: qr응모
	        	,inFvrSeqArr : "1,2,3,4,5,6,7"
	    };
    	
	   common.Ajax.sendJSONRequest(
	       		 "GET"
	       	   , _baseUrl + "event/20201002/getMyApply.do"
	       	   , param
	       	   , monthEvent.detail._callback_getMyApply
	   );
    },
    
    _callback_getMyApply : function(json){
    	if(json.ret == "0"){
    		$(".popGift").attr("id", "popGift0"+json.fvrSeq);
    		var id = $(".popGift").attr("id");
    		$("#win_tgtrSeq").val("("+json.tgtrSeq+")");
    		mevent.detail.eventShowLayScroll(id);
    	}else if(json.ret == "099"){
    		alert("응모 이력이 없습니다.");
    	}else{
        	alert(json.message);        
        }
    },

    beforeApply : function(type, strNo){
    	if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
		if(common.app.appInfo == undefined || !common.app.appInfo.isapp) {
        	if(confirm("APP에서 참여 가능합니다.")){
        		var url = "common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val();
        		if(typeof strNo != 'undefined' && strNo != ""){
        			url = url + "&strNo=" + strNo;
        		} 
                common.link.commonMoveUrl(url);
                return;
            }else{
                return;
            }
        }else{
        	if(type == '2' && !$(".btnApply02").hasClass("qr")){ //일반
        		mevent.detail.eventShowLayScroll('eventNotice3');
        		return;
        	}
        	monthEvent.detail.applyFvrSeq = type;
        	monthEvent.detail.layerPolice = true;
            $(".agreeCont")[0].scrollTop = 0;
            if(monthEvent.detail.applyYn == 'N'){
            	mevent.detail.eventShowLayScroll('eventLayerPolice');
            }else{
            	monthEvent.detail.apply(monthEvent.detail.applyFvrSeq);
            }
        }
    },
    
    apply : function(type){
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
        	,submitType : type // 1: 일반응모 / 2: qr응모 
        	,inFvrSeqArr : "1,2,3,4,5,6,7"
        };
        
        if(monthEvent.detail.storeCd){
        	param.strNo = monthEvent.detail.storeCd; 
        }
        
        monthEvent.detail.layerPolice = false;
        mevent.detail.eventCloseLayer();
        
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20201002/apply.do"
       	   , param
       	   , monthEvent.detail._callback_apply
        );
    },
    
    _callback_apply : function(json){
    	if(json.ret == "0" || json.ret == "054"){
    		if(json.ret == "054"){
    			alert(json.message);
    		}
    		$(".popGift").attr("id", "popGift0"+json.fvrSeq);
    		var id = $(".popGift").attr("id");
    		$("#win_tgtrSeq").val("("+json.tgtrSeq+")");
    		mevent.detail.eventShowLayScroll(id);
    		$(".btnApply0"+monthEvent.detail.applyFvrSeq).addClass("on");    		
    		$('.btnApply0'+monthEvent.detail.applyFvrSeq).attr('onclick', "monthEvent.detail.getMyApply('"+monthEvent.detail.applyFvrSeq+"');");
    		monthEvent.detail.applyYn = "Y";
    	}else{
        	alert(json.message);        
        }
    },
    
    downStoreCoupon : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }else{
                var param = {
                		evtNo : $("input[id='evtNo']:hidden").val()
                		,fvrSeq : monthEvent.detail.staffChkfvrSeq
                		,timeType : monthEvent.detail.timeType
                };
            	common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20201002/downStoreCoupon.do"
                        , param
                        , monthEvent.detail._callback_downStoreCoupon
                );
            }
        }
    },

    _callback_downStoreCoupon : function(json) {    	
    	console.log(json.ret);
    	if(json.ret == '0' || json.ret == '012'){    		
			if(json.useCnt > 0){
				$("#"+monthEvent.detail.popId+" .top").addClass("complete");
			}    		
			$(".storeBarCode").barcode(json.rndmVal, "code128",{barWidth:1, barHeight:25});
        //	$(".storeRandomTxt").addClass("popTxt_"+json.cpnAmt);
     	   	mevent.detail.eventShowLayScroll(monthEvent.detail.popId);
     	   	return;
        }else{
        	setTimeout(function(){
        		alert(json.message);
            }, 1000);
        }
    },

    couponUseConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP 에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }else{            
                var param = {
                		evtNo : $("input[id='evtNo']:hidden").val()
                        ,fvrSeq : monthEvent.detail.staffChkfvrSeq
                    }

                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/20201002/couponUseConfirm.do"
                          , param
                          , monthEvent.detail._callback_couponUseConfirm
                    );
            }
        }
    },

    _callback_couponUseConfirm : function(json){
        if(json.ret == "0"){
        	if(monthEvent.detail.currentDay.substring(0,8) < $("#chgEvtDate").val()){	//pc 7월출석체크    	        
    				$("#popStoreCoupon_ver1 .top").addClass("complete");
            }else{
    				$("#popStoreCoupon_ver2 .top").addClass("complete");
            }
        }else{
        	alert(json.message);
        }
    },
    
    checkLoginEvt : function(){
        if(!common.isLoginForEvt()){
            if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    }

};