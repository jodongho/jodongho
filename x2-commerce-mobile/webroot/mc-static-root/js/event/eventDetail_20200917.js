/**
 * 오픈일자 : 2020.09.17
 * 이벤트명 : 9월 출석체크 (하반기)
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
     baseImgPath : _cdnImgUrl + "contents/202009/17attend/",
     notInFvrSeqArr : [],
     currentDay : null,
     layerPolice : false,
     appPushIng : false,
     appPushYn : false,
     agrYn : false,
     fstEvtNo : "",
     init : function(){
        monthEvent.detail.notInFvrSeqArr = $("#notInFvrSeqArr").val().split(",");
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.fstEvtNo = $("input[id='fstEvtNo']:hidden").val();
                
        if(monthEvent.detail.currentDay.substring(0,8) >= "20200903"){
	        $(".banner03").show();
	        $(".banner02").hide();
	        if(monthEvent.detail.currentDay.substring(0,8) >= "20200917"
	        	&& monthEvent.detail.currentDay.substring(0,8) <= "20200923"){
	        	$('.evtConTop').find('.imgBox:first').hide();
	        	$('.evtConTop').find('.imgBox:last, .buttonBox').show();
	        }
        }else{
	        $(".banner03").hide();
	        $(".banner02").show();
        }

        /* app push 수신동의 현황 조회 */
        //common.app.getTmsPushConfig();

        setTimeout(function(){
	        if(common.isLoginForEvt()){
	           /* 로그인한 회원 출석 현황 조회 */
	           monthEvent.detail.getAttendList();
	        }
        }, 300);

        //10일 경품응모하기
        $(".gift1").click(function(){
        	if($(this).hasClass("on")) {
        		monthEvent.detail.checkApply(monthEvent.detail.notInFvrSeqArr[0]);
        	}
        });

        //20일 경품응모하기
        $(".gift2").click(function(){
        	if($(this).hasClass("on")) {
        		monthEvent.detail.checkApply(monthEvent.detail.notInFvrSeqArr[1]);
        	}
        });

        //30일 경품응모하기
        $(".gift3").click(function(){
        	if($(this).hasClass("on")) {
        		monthEvent.detail.checkApply(monthEvent.detail.notInFvrSeqArr[2]);
        	}
        });
        
        // 출석처리
        $("div.gameStart").click(function(){
        	if(!$(this).hasClass('on')){
                return;
            }else if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                 if(confirm("APP 에서만 참여 가능합니다.")){
                     common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo=" + $("input[id='evtNo']:hidden").val());
                 }else{
                     return;
                 }
             }else{
            	 if(!monthEvent.detail.checkLoginEvt()) {
            		 return;
            	 } else {
            	 	// MKT 동의(O)
     	   	    	if (monthEvent.detail.agrYn) {
     	   	    		// APP PUSH 미동의
     	   	    		if (!monthEvent.detail.appPushYn) {
     	   	    			mevent.detail.eventShowLayer('popSetting1');
     	   	    		} else {
     	   	    			monthEvent.detail.addMyStmp();
     	   	    		}
     	   	    	} else {
     	   	    		// 수신동의 미동의 & app Push 미동의
     	   	    		mevent.detail.eventShowLayer('popSetting2');
     	   	    	}
            	 }        	 
             }
        });
        
        $("#mktAgree").click(function() {
        	if (monthEvent.detail.agrYn) {
            	if (!monthEvent.detail.appPushYn) {
            		// 앱 푸시 동의 처리
            		monthEvent.detail.mktRcvSend();
            	}
        	}
        });
        
        $("#mktDeAgree").click(function() {
        	if (!monthEvent.detail.agrYn) {
        		// 마케팅 수신 동의
        		monthEvent.detail.mktRcvSend();
        	}
        });

        // 나의 당첨내역
        $("div#eMylist").click(function(){
             if(!monthEvent.detail.checkLoginEvt()){
                 return;
             }
             /* 당첨이력조회 */
             monthEvent.detail.getStmpMyWinList();
        });

        //직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });
        
        // 앱 푸시 버튼 클릭 이벤트
        $("#toggle").click(function() {
        	if (!monthEvent.detail.checkLoginEvt()) {
        		return;
        	} else {
        		if (!monthEvent.detail.appPushYn) {        			
        			if (confirm("알림 설정에 동의하시면 다양한 혜택 알림을 보내드려요!\nAPP PUSH수신동의 하시겠습니까?")) {
        				// 수신동의 (마케팅 Y처리)
        				monthEvent.detail.mktRcvSend();
        			}
        		} 
        	}
        });
    },

    /* 로그인한 회원 출석 현황 조회` */
    getAttendList : function(){
        var param = {
            evtNo : monthEvent.detail.fstEvtNo,
            startDate : monthEvent.detail.currentDay,
            notInFvrSeqArr : monthEvent.detail.notInFvrSeqArr.toString()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200917/getAttendList.do"
              , param
              , monthEvent.detail._callback_getAttendList
        );
    },

    _callback_getAttendList : function(json){
        if(json.ret == "0"){
            var attendList = json.attendList;
            $("div.evtCon03 td:not(:has(span.blank))").each(function(i){
            	if(attendList != undefined && attendList != null && attendList.length > 0){
                    var htmlStr = '';
                    if(attendList[i] != null){
	                    if(attendList[i].strtDtime == 1 ){
	                        if(monthEvent.detail.currentDay == attendList[i].nowDate){
	                            $('.evtCon02 .gameStart').removeClass('on');
	                        }

	                        htmlStr =  "<img src='"+monthEvent.detail.baseImgPath+"bg_attend.png' alt='출석'>";
	                    }
	                    $(this).html(htmlStr);
                    }
                }
            });
            $("div.evtCon03").find('.totalCount span').text($("div.evtCon03 td:has(img)").length);

            $(".gift1, .gift2, .gift3").removeClass("on end");
            $(".gift1").addClass(json.apply1);
            $(".gift2").addClass(json.apply2);
            $(".gift3").addClass(json.apply3);
            
            // APP PUSH 체크
            if (!monthEvent.detail.checkLoginEvt()) {
            	return;
            } else {
            	// 앱 여부 체크
        		if (json.appPushYn == "Y") {
        			// 푸쉬정보 Y 로 변경
        			$("#toggle").addClass("on");
        			$("#toggle").text("ON");
        			        			
        			// 수신정보 Y로 변경
    				if (json.agrYn == "Y") {
    					monthEvent.detail.appPushYn = true;
    				} else {
    					monthEvent.detail.appPushYn = false;
    				}
        		} else {
        			$("#toggle").addClass("gif");
        			$("#toggle").text("OFF");
        			
        			monthEvent.detail.appPushYn = false;
        		}
        		
        		if (json.agrYn == "Y") {
        			monthEvent.detail.agrYn = true;
        		} else {
        			monthEvent.detail.agrYn = false;
        		}
            }
        }
    },

    /* 회원 출석 등록 */
    addMyStmp : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("APP 에서만 참여 가능합니다.")){             
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
        	if(!monthEvent.detail.checkLoginEvt()) {
                return;
            } else {
                var param = {
                	evtNo : monthEvent.detail.fstEvtNo
                  , startDate : monthEvent.detail.currentDay
                }
                
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20200901/addMyStmpJson.do"
                      , param
                      , monthEvent.detail._callback_addMyStmpJson
                );
            }
        }
    },
    
    _callback_addMyStmpJson : function(json){
        if(json.ret == "0"){       	
            // $(':radio[name="argee1"]:checked').attr("checked", false);
            // $(':radio[name="argee2"]:checked').attr("checked", false);
        	
        	if(json.winYn == "Y"){
                $(".win_number").text("("+json.tgtrSeq+")");
                mevent.detail.eventShowLayer('evtPoint1');
            }else{
                mevent.detail.eventShowLayer('evtPointFail');
            }
        	
            monthEvent.detail.getAttendList();
        }else if(json.ret == "-1"){
			if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
		}else if(json.ret == "042"){
			monthEvent.detail.popSettingShow(json.agrYn, json.appPushYn);
        }else {
            alert(json.message);
        }
    },
    
    checkApply : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP 에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }
            
            var param = {
                    evtNo : monthEvent.detail.fstEvtNo
                    , fvrSeq : fvrSeq
                    , notInFvrSeqArr : monthEvent.detail.notInFvrSeqArr.toString()
            }
            
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20200917/checkApply.do"
                  , param
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                        if(json.ret == "042"){
                        	monthEvent.detail.popSettingShow(json.agrYn, json.appPushYn);
                        }else if(json.ret == "0"){
                            if( json.myTotalCnt  == "0" ) {  // 10일연속, 20일연속, 30일연속  세개중 한번도 신청하지 않은경우 위수탁 받기
                                $("div.agreeBtn a").attr("href", "javascript:monthEvent.detail.apply(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); "  );
                                mevent.detail.eventShowLayer('eventLayerPolice');
                                monthEvent.detail.layerPolice = true;
                                $(".agreeCont")[0].scrollTop = 0;
                            }else {
                                monthEvent.detail.apply(fvrSeq, json.myTotalCnt);
                            }
                        }else if(json.ret == "-1"){
							if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
				        		common.link.moveLoginPage();
				        		return false;
				            }
						}else{
                            alert(json.message);
                        }
                    }
            );
        }
    },

    apply : function(fvrSeq,myTotalCnt){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP 에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }

            var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
            var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

            if(myTotalCnt == 0 ){
                if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
                    alert("2가지 모두 동의 후 참여 가능합니다.");
                    return;
                }

                if("Y" != mbrInfoUseAgrYn){
                    monthEvent.detail.layerPolice = false;
                    mevent.detail.eventCloseLayer();
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    monthEvent.detail.layerPolice = false;
                    mevent.detail.eventCloseLayer();
                    return;
                }

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }
            var param = {
                    evtNo : monthEvent.detail.fstEvtNo
                  , fvrSeq : fvrSeq
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                  , notInFvrSeqArr : monthEvent.detail.notInFvrSeqArr.toString()
                  , startDate : monthEvent.detail.currentDay
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200917/apply.do"
                  , param
                  , monthEvent.detail._callback_apply
            );
        }
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            if(json.winYn=="Y"){
                $(".win_number").text('('+json.tgtrSeq+')');
                // 성공
                if(json.fvrSeq == monthEvent.detail.notInFvrSeqArr[0]){ // 10일
                    mevent.detail.eventShowLayer('evtGift1');
                }else  if(json.fvrSeq == monthEvent.detail.notInFvrSeqArr[1]){ // 20일
                    mevent.detail.eventShowLayer('evtGift2');
                }else  if(json.fvrSeq == monthEvent.detail.notInFvrSeqArr[2]){ // 30일
                    mevent.detail.eventShowLayer('evtGift3');
                }
            }else {
                // 실패
                mevent.detail.eventShowLayer('evtGiftFail');
            }
            monthEvent.detail.getAttendList();
        }else{
        	if(json.ret == "-1"){
				if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
	        		common.link.moveLoginPage();
	        		return false;
	            }
			}if(json.ret == "042"){
				monthEvent.detail.popSettingShow(json.agrYn, json.appPushYn);
        	}else{
        		alert(json.message);
        	}
        }
    },

    /* 당첨내역 확인 */
    getStmpMyWinList : function(){
        if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
        
        var param = {
        		evtNo : monthEvent.detail.fstEvtNo
        }
        
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getStmpMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },

    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>당첨내역이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("#evtPopWinDetail tbody").html(myWinListHtml);

            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else if(json.ret == "-1"){
			if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
		}else{
            alert(json.message);
        }
    },

    /* 앱 최신버전 체크 */
    appPushVer : function(){
        if(common.isLoginForEvt()){
            var tempCompareVersion = "";
            if (common.app.appInfo.ostype == "10") { // ios
                tempCompareVersion = '2.2.1';
            }else if(common.app.appInfo.ostype == "20"){ // android
                tempCompareVersion = '2.1.8';
            }
            if(common.app.appInfo.isapp && common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion) !=  "<"){
                return true;
            }
        }
        return false;
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
    },
    
    mktRcvSend : function(){
    	var url = _baseUrl + "mypage/setMktReceiptInfoJson.do"
    	
    	var data = {
    	    agrYn : 'Y',
            agr40 : 'Y',
    		pushMsgRcvYn : 'Y'
    	};
    	
        common.Ajax.sendRequest("POST", url, data, monthEvent.detail._callBack_mktRcvSend);
    },
    
    _callBack_mktRcvSend : function (data){
    	mevent.detail.eventCloseLayer();
    	if(data.result){            
        	monthEvent.detail.agrYn = true;           
        	monthEvent.detail.appPushYn = true;

        	// 푸쉬정보 Y 로 변경
    		$("#toggle").removeClass("gif");
  			$("#toggle").addClass("on");
    		$("#toggle").text("ON");

        	alert('혜택 알림\n\n요청하신 서비스·이벤트 정보 수신정보가 변경되었습니다.\n\n전송자: 올리브영\nAPP PUSH: 수신함\n일자: '
        			+ new Date().format("yyyy년 MM월 dd일")
        			+ '\n\n올리브영 설정 메뉴에서 알림 설정 변경 가능합니다.');
            
	    }else{
	        alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");
	        return false;
	    }
    },

    popSettingShow : function(agrYn, appPushYn){
    	if ('Y' != agrYn) {
			monthEvent.detail.agrYn = false;
			monthEvent.detail.appPushYn = false;
    		mevent.detail.eventShowLayer('popSetting2');
		}else if ('Y' != appPushYn) {
			monthEvent.detail.agrYn = true;
			monthEvent.detail.appPushYn = false;
			mevent.detail.eventShowLayer('popSetting1');
	    }
    }
}