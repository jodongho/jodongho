$.namespace("MarketingEvent.detail");
MarketingEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "Y",
    agrYn : "N",
    smsRcvAgrYn : "N",
    emailRcvYn : "N",
    url : "",
	mbrAgreementYn  : "N",
	mbrSubmitEventYn  : "N",
    
	 initSns : function(){
	      url = _baseUrl + 'E.do?evtNo=' + $("#evtNo1").val();
	      common.sns.init( $("#bnrImgUrlAddr1").val(),$("#evtNm1").val(), url);
	      
	    },
	initEvNo : function(){
	    MarketingEvent.detail.evtNo = $("#evtNo1").val();
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
        
        $('.btnGreen').click(function(){
            if(!MarketingEvent.detail.checkLogin()){
                return;
            }

            var regType = $(this).parent().find("input[name*='regYn']" ).val();

            if(regType == 'regWrite'){
                if(!MarketingEvent.detail.checkRepl()){
                    return;
                }
                
                MarketingEvent.detail.regEventCommentAjax();
            }else{

                if(!MarketingEvent.detail.checkRegAvailable()){
                    return;
                }
                if(!MarketingEvent.detail.checkAgrmInfo()){
                    return;
                }
                MarketingEvent.detail.regEventAjax();
            }

        });
        
        /*2018.04.10 신규마케팅 동의 이벤트*/
        $("#agree1_1").click(function(){
        	$("[type='checkbox'][id='agree2_1']").prop("checked",true);
        });
        $("#agree1_2").click(function(){
        	alert("SMS / 이메일 수신에 동의하시려면 반드시 마케팅 활용동의에 동의하셔야 합니다.");
        	$("[type='checkbox'][id='agree2_1']").prop("checked",false);
        	$("[type='checkbox'][id='agree2_2']").prop("checked",false);
        });
        $("#agree2_1").click(function(){
        	if($("#agree1_2").is(":checked")){
        		alert("SMS / 이메일 수신에 동의하시려면 반드시 마케팅 활용동의에 동의하셔야 합니다.");
        		$("[type='checkbox'][id='agree2_1']").prop("checked",false);
        		return;
            }
        });
        $("#agree2_2").click(function(){
        	if($("#agree1_2").is(":checked")){
        		alert("SMS / 이메일 수신에 동의하시려면 반드시 마케팅 활용동의에 동의하셔야 합니다.");
        		$("[type='checkbox'][id='agree2_2']").prop("checked",false);
        		return;
            }
        });
        MarketingEvent.detail.initEvNo();
        MarketingEvent.detail.initSns();
		/* 2018.05 마케팅 활용동의 이벤트 : ViewCase체크 */
		MarketingEvent.detail.checkViewCase();
	},
	checkViewCase : function(){
		if($("input[id='ViewCase']:hidden").val() == "ViewCase1"){
			$(".evtCase1").show();
			$(".evtCase2").hide();
			$(".evtCase3").hide();
		}else if($("input[id='ViewCase']:hidden").val() == "ViewCase2"){
			$(".evtCase1").hide();
			$(".evtCase2").show();
			$(".evtCase3").hide();
		}else{
			$(".evtCase1").hide();
			$(".evtCase2").hide();
			$(".evtCase3").show();
		}
	},
	checkMarketingJson1 : function(){
		//ViewCase1 : (대상)마이페이지에서 마케팅 동의 활용 여부를 이벤트 기간 내 변경한 회원 및 로그인하지 않은 회원
		//1. 로그인여부 체크
		if(!MarketingEvent.detail.checkLogin()){
			return;
		}
		//2. 응모기간 체크
		if(!MarketingEvent.detail.checkRegAvailable1()){
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo1']:hidden").val()
			  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regMarketingAgreementEventJson.do"
			  ,  param
			  , MarketingEvent.detail._callback_MarketingAgreementJson
		);
	},
	_callback_MarketingAgreementJson : function(json){
		var url = location.href;
		if(json.ret == "0"){
			MarketingEvent.detail.mbrAgreementYn = 'Y';
			alert("이벤트에 정상적으로 참여되었습니다. 포인트는 5/31에 지급됩니다.");
			location.href = url;
		}else{
			alert(json.message);
		}
	},
	checkMarketingJson2 : function(){

		//1. 로그인여부 체크
		if(!MarketingEvent.detail.checkLogin()){
			return;
		}
		//2. 응모기간 체크
		if(!MarketingEvent.detail.checkRegAvailable1()){
			return;
		}
		//3. 마케팅 활용동의 "동의" 체크
		if(!MarketingEvent.detail.checkMarketingInfo()){
			return;
		}
		//4. SMS/Email 동의 체크(둘중하나 체크)
		if(!MarketingEvent.detail.checkSmsEmailInfo()){
			return;
		}
		
		var param = {
				agrYn : MarketingEvent.detail.agrYn
		      , smsRcvAgrYn  : MarketingEvent.detail.smsRcvAgrYn 
			  , emailRcvYn  : MarketingEvent.detail.emailRcvYn 
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/MarketingAgreementJson.do"
			  ,  param
			  , MarketingEvent.detail._callback_checkMarketingJson2
		);
	},
	_callback_checkMarketingJson2 : function(json){
		if(json.ret == "0"){
			var param = {
					evtNo : $("input[id='evtNo1']:hidden").val()
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "storeEvent/regMarketingAgreementEventJson.do"
				  ,  param
				  , MarketingEvent.detail._callback_MarketingAgreementJson
			);
		}else{
			alert(json.message);
		}
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
            alert('본 이벤트는 마케팅 활용동의를 "동의" 해주셔야 참여 가능합니다.');
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
        if(!$("#agree2_2").is(":checked")){
        	MarketingEvent.detail.emailRcvYn   = 'N';
         }else{
        	 MarketingEvent.detail.emailRcvYn  = 'Y';
         }

        if(MarketingEvent.detail.smsRcvAgrYn == 'N' && MarketingEvent.detail.emailRcvYn == 'N'){
        	 alert("SMS / 이메일 수신 설정 선택 후, 참여하기를 눌러주세요.");
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