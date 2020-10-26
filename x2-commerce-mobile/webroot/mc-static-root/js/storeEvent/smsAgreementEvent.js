$.namespace("MarketingEvent.detail");
MarketingEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "Y",
    agrYn : "N",
    smsRcvAgrYn : "N",
    emailRcvYn : "N",
    url : "",
    
	 initSns : function(){
	      url = _baseUrl + 'E.do?evtNo=' + $("#evtNo1").val();
	      common.sns.init( $("#bnrImgUrlAddr1").val(),$("#evtNm1").val(), url);
	      
	    },
	init : function(){
		
        $('.btnShare').click(function(){
        	MarketingEvent.detail.dispSnsPopup();
            common.popLayerOpen("SNSLAYER");
            $.fn.enableSelection();
        });
        
        $(".kakao").click(function(){
            common.sns.doShare("kakaostory");
        });

        $(".facebook").click(function(){
            common.sns.doShare("facebook");
        });

        $(".url").click(function(){
            common.sns.doShare("url");
        });

        $("#winner").click(function(){
            common.link.moveNtcList('03');
        });
        
        
        $("#agree1_2").click(function(){
        	alert("SMS 수신에 동의하시려면 반드시 마케팅 활용동의에 동의하셔야 합니다.");
        	$("[type='checkbox'][id='agree2_1']").prop("checked",false);
        	$("[type='checkbox'][id='agree2_2']").prop("checked",false);
        });
        $("#agree2_1").click(function(){
        	if($("#agree1_2").is(":checked")){
        		alert("SMS 수신에 동의하시려면 반드시 마케팅 활용동의에 동의하셔야 합니다.");
        		$("[type='checkbox'][id='agree2_1']").prop("checked",false);
        		return;
            }else if(!$("#agree1_1").is(":checked")){
        		alert("SMS 수신에 동의하시려면 반드시 마케팅 활용동의에 동의하셔야 합니다.");
        		$("[type='checkbox'][id='agree2_1']").prop("checked",false);
        		return;
            }
        });
        /* SNS 활성화 */
        MarketingEvent.detail.initSns();
	},
	//이벤트 참여하는 JSON
	checkTargetCaseJson : function(){
		 $(".evtCase1 a").bind('click', false);
		//1. 로그인여부 체크
		if(!MarketingEvent.detail.checkLogin()){
			$(".evtCase1 a").unbind('click', false);
			return;
		}
		//2. 응모기간 체크
		if(!MarketingEvent.detail.checkRegAvailable1()){
			$(".evtCase1 a").unbind('click', false);
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo1']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"POST"
			  , _baseUrl + "storeEvent/checkTargetCaseJson.do"
			  ,  param
			  , MarketingEvent.detail._callback_checkTargetCaseJson
		);
	},
	_callback_checkTargetCaseJson : function(json){
		if(json.ret == "0"){
			//viewcase 분리
			if(json.viewCase == "view1"){
				$(".evtCase1").hide();
				$(".evtCase2").show();
			}else{
				MarketingEvent.detail.emailRcvYn = json.emailYn;
				$(".evtCase1").hide();
				$(".evtCase3").show();
			}	
		}else if(json.ret == "1"){
			//비대상 회원
			alert("수신동의 이력 확인결과, 기 수신 하신 것으로 확인되어 이벤트 참여가 어려운 점 양해부탁드립니다!\n*기 수신동의 일시 : " + json.smsHistoryDtime);
			$(".evtCase1 a").unbind('click', false);
		}else{
			alert(json.message);
			$(".evtCase1 a").unbind('click', false);
		}
	},
	//이벤트 참여하는 JSON
	regSmsEvtJson1 : function(){
		//ViewCase1 : (대상)마이페이지에서 마케팅 동의 활용 여부를 이벤트 기간 내 변경한 회원 및 로그인하지 않은 회원
		$(".evtCase2 a").bind('click', false);
		//1. 로그인여부 체크
		if(!MarketingEvent.detail.checkLogin()){
			$(".evtCase2 a").unbind('click', false);
			return;
		}
		//2. 응모기간 체크
		if(!MarketingEvent.detail.checkRegAvailable1()){
			$(".evtCase2 a").unbind('click', false);
			return;
		}
		
		var param = {
				evtNo : $("input[id='evtNo1']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"POST"
			  , _baseUrl + "storeEvent/regSmsAgreementEventJson1.do"
			  ,  param
			  , MarketingEvent.detail._callback_smsAgreementJson1
		);
	},
	_callback_smsAgreementJson1 : function(json){
		var url = location.href;
		if(json.ret == "0"){
			alert("참여해주셔서 감사합니다! 고객님께 8/19(월)까지 CJ ONE 포인트 "+ json.point +" Point 지급예정입니다!");
		}else if(json.ret == "-1"){
			//비대상 회원
			alert("수신동의 이력 확인결과, 기 수신 하신 것으로 확인되어 이벤트 참여가 어려운 점 양해부탁드립니다!\n*기 수신동의 일시 : " + json.smsHistoryDtime);
		}else{
			alert(json.message);
		}
		location.href = url;
	},
	
	//마케팅 활용동의 정보 변경 및 참여 
	regSmsEvtJson2 : function(){
		$(".evtCase3 a").bind('click', false);
		//1. 로그인여부 체크
		if(!MarketingEvent.detail.checkLogin()){
			$(".evtCase3 a").unbind('click', false);
			return;
		}
		//2. 응모기간 체크
		if(!MarketingEvent.detail.checkRegAvailable1()){
			$(".evtCase3 a").unbind('click', false);
			return;
		}
		//3. 마케팅 활용동의 "동의" 체크
		if(!MarketingEvent.detail.checkMarketingInfo()){
			$(".evtCase3 a").unbind('click', false);
			return;
		}
		//4. SMS 수신동의 체크
		if(!MarketingEvent.detail.checkSmsEmailInfo()){
			$(".evtCase3 a").unbind('click', false);
			return;
		}

		var param = {
				agrYn : MarketingEvent.detail.agrYn
		      , smsRcvAgrYn  : MarketingEvent.detail.smsRcvAgrYn 
			  , emailRcvYn  : MarketingEvent.detail.emailRcvYn
			  , evtNo : $("input[id='evtNo1']:hidden").val()
		};
		
		
		common.Ajax.sendJSONRequest(
				"POST"
			  , _baseUrl + "storeEvent/regSmsAgreementEventJson2.do"
			  ,  param
			  , MarketingEvent.detail._callback_smsAgreementJson2
		);
	},
	_callback_smsAgreementJson2 : function(json){
		var url = location.href;
		if(json.ret == "0"){
			alert("참여해주셔서 감사합니다! 고객님께 8/19(월)까지 CJ ONE 포인트 "+ json.point +" Point 지급예정입니다!");
		}else if(json.ret == "-1"){
			//비대상 회원
			alert("수신동의 이력 확인결과, 기 수신 하신 것으로 확인되어 이벤트 참여가 어려운 점 양해부탁드립니다!\n*기 수신동의 일시 : " + json.smsHistoryDtime);
		}else{
			alert(json.message);
		}
		location.href = url;
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
    checkRegAvailable1 : function() {
        var regYn1 = $.trim($("#regYn1").val());
        if(regYn1 == 'N'){
            alert("현재 이벤트 응모 기간이 아닙니다.");
            return false;
        }
        return true;
    },
    /* 마케팅 활용동의 여부 확인 */
    checkMarketingInfo : function(){
        if(!$("#agree1_1").is(":checked")){
            alert('마케팅 활용 동의를 "동의" 하신 후, SMS 수신동의를 진행해주세요.');
            MarketingEvent.detail.agrYn = 'N';
            return false;
         }else{
            MarketingEvent.detail.agrYn = 'Y';
         }

        return true;
    },
    /* SMS Email 체크 여부 확인 */
    checkSmsEmailInfo : function(){
        if(!$("#agree2_1").is(":checked")){
        	MarketingEvent.detail.smsRcvAgrYn  = 'N';
         }else{
        	 MarketingEvent.detail.smsRcvAgrYn  = 'Y';
         }

        if(MarketingEvent.detail.smsRcvAgrYn == 'N'){
        	 alert("SMS 수신동의를 진행해주세요.");
             return false;
        }
        
        return true;
    },
    dispSnsPopup : function(){

        var $popLayer = $("<div>").addClass("popLayerArea");
        $("#SNSLAYER").html($popLayer);

        var $dimLayer = $("<div>").addClass("dimLayer");
        $popLayer.append($dimLayer);

        var $ul = $("<ul>").addClass("shareSNS");
        $dimLayer.append($ul);

        var $liKaka = $("<li>").addClass("kaka");
        $ul.append($liKaka);

        var $aKaka = $("<a>").addClass("snsShareDo").text("카카오톡");
        $aKaka.click(function(){common.sns.doShare("kakaotalk");});
        $liKaka.append($aKaka);


        var $liKakaS = $("<li>").addClass("kakaoS");
        $ul.append($liKakaS);

        var $aKakaS = $("<a>").addClass("snsShareDo").text("카카오스토리");
        $aKakaS.click(function(){common.sns.doShare("kakaostory");});
        $liKakaS.append($aKakaS);


        var $liFb = $("<li>").addClass("fb");
        $ul.append($liFb);

        var $aFb = $("<a>").addClass("snsShareDo").text("페이스북");
        $aFb.click(function(){common.sns.doShare("facebook");});
        $liFb.append($aFb);


        var $liUrl = $("<li>").addClass("url");
        $ul.append($liUrl);
        var $aUrl = $("<a>").addClass("snsShareDo").text("URL");
        $aUrl.click(function(){common.sns.doShare("url");});
        $liUrl.append($aUrl);
        var $divUrl = $("<div>").addClass("urlCopy").attr("id","urlInfo");
        $liUrl.append($divUrl);
        var $pUrl = $("<p>").text("아래의 URL을 복사해주세요.");
        $divUrl.append($pUrl);
//        var $inputUrl = $("<input>").attr("type","text")
//                                     .attr("title","url")
//                                     .attr("id","shareUrlTxt")
//                                     .attr("name","shareUrlTxt")
//                                     .attr("style","width:100%")
//                                     .attr("value",location.href)
//                                     .attr("readonly",true);
//        
        var $inputUrl = $("<div>").attr("class","input-url")
                                    .attr("id","shareUrlTxt")
                                    .attr("style","word-break:break-all;word-wrap:break-word;min-height:26px;max-height:51px;height:auto;");
        $inputUrl.html(url);
        $divUrl.append($inputUrl);


        var $aClose = $("<a>").addClass("btnClose").text("닫기");
        $aClose.click(function(){
            //  드래그 방지 막기
            $.fn.disableSelection();
            common.popLayerClose("SNSLAYER");
        });
        $dimLayer.append($aClose);

    }
};