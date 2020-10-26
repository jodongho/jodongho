$.namespace("BeautyEvent.detail");
BeautyEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "Y",
	url : "",
    mbrInfoUseAgrYn1 : "N",
    mbrInfoThprSupAgrYn1 : "N",
    mbrInfoUseAgrYn2 : "N",
    mbrInfoThprSupAgrYn2 : "N",
    
    initSns : function(){
      url = _baseUrl + 'E.do?evtNo=' + $("#evtNo1").val();
      common.sns.init( $("#bnrImgUrlAddr1").val(),$("#evtNm1").val(), url);
      
  },

	init : function(){
		if($("input[id='reCommend']:hidden").val() != ""){
			if(!BeautyEvent.detail.checkLogin()){
				return;
			}

		}
		$('.event_agree .tit > a').click(function(e){
			e.preventDefault();
			if($(this).parents('li').hasClass('on')){
				$(this).parents('li').removeClass('on');
			} else {
				$(this).parents('li').addClass('on').siblings().removeClass('on');
			}
		});
		
        $('.btnShare').click(function(){
        	BeautyEvent.detail.dispSnsPopup();
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
        
	    if((location.href).indexOf("getBeautyNCultureEventDetail.do") > 0){
			/* 이벤트 호출시 활성화 */
	    	BeautyEvent.detail.initSns();
		}else if((location.href).indexOf("getBeautyNCultureEventDetail2.do") > 0){
			/* 이벤트 호출시 활성화 */
	    	BeautyEvent.detail.initSns();
		}
	},

	checkBeautyJson1 : function(){

		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}
		/*
		//2. 회원등급체크
		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}
		*/
		//2. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		//4. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo1']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyNCultureEventJson.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkBeautyJson1
		);
	},
	_callback_checkBeautyJson1 : function(json){
		if(json.ret == "0"){
			alert("이벤트에 정상적으로 참여하셨습니다.");
		}else{
			alert(json.message);
		}
	},
	checkBeautyJson2 : function(){

		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}

		//2. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable2()){
			return;
		}
		//4. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo2()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo2']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn2']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn2']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyNCultureEventJson.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkBeautyJson2
		);
	},
	_callback_checkBeautyJson2 : function(json){
		if(json.ret == "0"){
			alert("이벤트에 정상적으로 참여하셨습니다.");
		}else{
			alert(json.message);
		}
	},
	checkCultureJson1 : function(){

		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}
		/*
		//2. 회원등급체크
		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}
		*/

		//2. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		
		//4. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo1']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyNCultureEventJson.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkCultureJson1
		);
	},
	_callback_checkCultureJson1 : function(json){
		if(json.ret == "0"){
			alert("이벤트에 정상적으로 참여하셨습니다.");
		}else{
			alert(json.message);
		}
	},
	checkCultureJson2 : function(){

		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}

		//2. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable2()){
			return;
		}
		
		//4. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo2()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo2']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn2']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn2']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyNCultureEventJson.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkCultureJson2
		);
	},
	_callback_checkCultureJson2 : function(json){
		if(json.ret == "0"){
			alert("이벤트에 정상적으로 참여하셨습니다.");
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

    checkMbrGradeCD : function() {
        var mbrGradeCD = $.trim($("#mbrGradeCD").val());
        if(mbrGradeCD != '5' && mbrGradeCD != '10'){
            alert("본 이벤트는 올리브영 VVIP, VIP 회원 등급에 한해 참여 가능합니다.");
            return false;
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
    checkRegAvailable2 : function() {
        var regYn2 = $.trim($("#regYn2").val());
        if(regYn2 == 'N'){
            alert("현재 이벤트 응모 기간이 아닙니다.");
            return false;
        }
        return true;
    },
	/* 개인정보 필수값 체크 */
    checkAgrmInfo1 : function(){
        var regYn = $.trim($("#regYn1").val());
        var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn1").val());
        var mbrInfoThprSupAgrYn = $.trim($("#mbrInfoThprSupAgrYn1").val());

        if(regYn == 'Y' && mbrInfoUseAgrYn == 'Y'){

            if(!$("#inpChkAgree1").is(":checked")){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	BeautyEvent.detail.mbrInfoUseAgrYn1 = 'Y';
            }
        }else{
        	BeautyEvent.detail.mbrInfoUseAgrYn1 = 'N';
        }

        if(regYn == 'Y' && mbrInfoThprSupAgrYn == 'Y'){
            if(!$("#inpChkAgree2").is(":checked")){
                alert("개인정보 취급 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	BeautyEvent.detail.mbrInfoThprSupAgrYn1 = 'Y';
            }
        }else{
        	BeautyEvent.detail.mbrInfoThprSupAgrYn1 = 'N';
        }

        return true;
    },
    checkAgrmInfo2 : function(){
        var regYn = $.trim($("#regYn2").val());
        var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn2").val());
        var mbrInfoThprSupAgrYn = $.trim($("#mbrInfoThprSupAgrYn2").val());

        if(regYn == 'Y' && mbrInfoUseAgrYn == 'Y'){

            if(!$("#inpChkAgree3").is(":checked")){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	BeautyEvent.detail.mbrInfoUseAgrYn2 = 'Y';
            }
        }else{
        	BeautyEvent.detail.mbrInfoUseAgrYn2 = 'N';
        }

        if(regYn == 'Y' && mbrInfoThprSupAgrYn == 'Y'){
            if(!$("#inpChkAgree4").is(":checked")){
                alert("개인정보 취급 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	BeautyEvent.detail.mbrInfoThprSupAgrYn2 = 'Y';
            }
        }else{
        	BeautyEvent.detail.mbrInfoThprSupAgrYn2 = 'N';
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