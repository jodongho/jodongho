$.namespace("MarketingEvent.detail");
MarketingEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "Y",
	commenttype : '댓글', /* 2017.12.12 */
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
		/* 2017.12.12  */
        $('#inpTxBox').on({
            'keydown' : function(){
                $('#inTxCnt').text($(this).val().length);
            }
        });
        
        /* 2017.12.12 */
        $("#commmentHeader > .more").click(function(){
            PagingCaller.destroy();
            MarketingEvent.detail.getEventMyCommentListAjax();

        });

        /* 2017.12.12 */
        $("#commmentHeader > .tit").click(function(){
            $('#commentList').empty();
            MarketingEvent.detail.getEventCommentListAjax();
        });

        /* 2017.12.12 */
        $("#myCommmentHeader > .more").click(function(){
            $('#commentList').empty();
            MarketingEvent.detail.getEventCommentListAjax();
        });
		
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

        MarketingEvent.detail.initEvNo(); /* 2017.12.12 */
        MarketingEvent.detail.initCommentList(); /* 2017.12.12 */
        MarketingEvent.detail.initSns();/* 2017.12.12 */
        
        /*2018.04.10 신규마케팅 동의 이벤트*/
        $("#agree1_1").click(function(){
        	$("[type='checkbox'][id='agree2_1']").prop("checked",true);
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
		
		/*2018.04.10 신규마케팅 동의 이벤트*/
		MarketingEvent.detail.checkUserMarketingYN();
	},
	/*2018.04.10 신규마케팅 동의 이벤트*/
	checkUserMarketingYN : function(){
		//로그인 했을 때, 마케팅 활용동의 및 SMS/이메일 수신설정 사용자 설정값으로 로드
		if(common.isLogin() == true){
			var MarketingAgrYN = $("input[id='MarketingAgrYN']:hidden").val();
			var EmailAgrmAgrYN = $("input[id='EmailAgrmAgrYN']:hidden").val();
			var SMSAgrmAgrYN = $("input[id='SMSAgrmAgrYN']:hidden").val();
			
			//마케팅 활용동의 여부 
			if(MarketingAgrYN == "Y"){
				$("[type='radio'][id='agree1_1']").prop("checked",true);
			    //SMS 수신설정 여부
				if(EmailAgrmAgrYN == "Y"){
					$("[type='checkbox'][id='agree2_1']").prop("checked",true);
				}
			    //이메일 수신설정 여부
				if(SMSAgrmAgrYN == "Y"){
					$("[type='checkbox'][id='agree2_2']").prop("checked",true);
				}
			
			}else if(MarketingAgrYN == "N"){
				$("[type='radio'][id='agree1_2']").prop("checked",true);
			}
		}
	},
	checkMarketingJson1 : function(){

		//1. 로그인여부 체크
		if(!MarketingEvent.detail.checkLogin()){
			return;
		}
		//2. 응모기간 체크
		if(!MarketingEvent.detail.checkRegAvailable1()){
			return;
		}
		//3. 마케팅 활용 동의 체크
		if(!MarketingEvent.detail.checkMarketingInfo()){
			return;
		}
		//4. SMS/Email 동의 체크(둘중하나 체크)
		if(!MarketingEvent.detail.checkSmsEmailInfo()){
			return;
		}
		if(MarketingEvent.detail.mbrAgreementYn == "Y"){
			alert("이미 마케팅 수신동의를 완료하셨습니다. 이벤트 응모 버튼으로 포인트를 신청하세요. 수신동의 재변경을 원하시면 마이페이지를 확인하세요.");
			return;
		}
		if(MarketingEvent.detail.mbrSubmitEventYn == "Y"){
			alert("이벤트에 이미 참여하셨습니다. 추가적인 수신동의 설정 변경은 마이페이지에서 확인해주세요.");
			return;
		}
		var param = {
				agrYn : MarketingEvent.detail.agrYn
		      , smsRcvAgrYn  : MarketingEvent.detail.smsRcvAgrYn 
			  , emailRcvYn  : MarketingEvent.detail.emailRcvYn 
		};
		//
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/MarketingAgreementJson.do"
			  ,  param
			  , MarketingEvent.detail._callback_MarketingAgreementJson
		);
	},
	_callback_MarketingAgreementJson : function(json){
		if(json.ret == "0"){
			MarketingEvent.detail.mbrAgreementYn = 'Y';
			alert("정상적으로 마케팅 수신동의를 완료했습니다.이벤트 응모 버튼으로 포인트를 신청하세요.");
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
		//3. 기동의 회원 여부 확인
		if(!MarketingEvent.detail.checkMarketingMbr()){
			return;
		}
		//4. 개인정보 수집동의 체크
		if(!MarketingEvent.detail.checkAgreeUser()){
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
			  , MarketingEvent.detail._callback_checkMarketingJson2
		);
	},
	_callback_checkMarketingJson2 : function(json){
		if(json.ret == "0"){
			MarketingEvent.detail.mbrSubmitEventYn = 'Y';
			alert("이벤트에 정상적으로 응모되었습니다. 포인트는 4/30(월) 일괄지급 됩니다.");
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
    /*기동의 회원여부 확인*/
    checkMarketingMbr : function(){
    	var MarketingAgrYN = $("input[id='MarketingAgrYN']:hidden").val();
    	if(MarketingAgrYN == 'Y'){
            alert('아쉽지만  회원님께서는 행사기간 이전 이미 개인정보 수집 및 활용 동의하셨으므로, 본 이벤트 대상자가 아니십니다. 다음 기회에 새로운 이벤트로 찾아뵙겠습니다. ^^ ');
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
        	 alert("SMS / 이메일 수신 설정 선택 후, 동의하기를 눌러주세요");
             return false;
        }
        
        return true;
    },
	/* 동의하기 변경진행 여부 확인 */
    checkAgreeUser : function(){
        if(MarketingEvent.detail.mbrAgreementYn == 'N'){
        	 alert('본 이벤트는 마케팅 활용동의를 "동의" 해주셔야 참여 가능합니다.');
             return false;
        }
        
        return true;
    },
	/* 2017.12.12 */
	initCommentList : function(){

        var rplYn = $.trim($("#rplYn1").val());
        var evtType = $("#evtType1").val();

        if(evtType == MarketingEvent.detail.commenttype || rplYn ==  "Y"){
        	MarketingEvent.detail.getEventCommentListAjax();
        }

    },
    
    /* 2017.12.12 */
    commentModifyMain : function(appenArea,bbcSeq,commentInfo){
        $("#regComment").hide();
        MarketingEvent.detail.makeCommentModify(commentInfo,appenArea,bbcSeq)
    },

    /* 2017.12.12 */
    cancelModifyMain : function(showArea){
        showArea.show();
        MarketingEvent.detail.removeCommentModify(showArea);
        $("#regComment").show();
    },
    
    /* 2017.12.12 */
    makeCommentModify : function(commentInfo,showArea, bbcSeq){

        showArea.hide();

        var $liModify = $("<li>").addClass("re_modify");
        showArea.after($liModify);

        var $h4 = $("<h4>").text("댓글수정하기");
        $liModify.append($h4);

        var $divInbox = $("<div>").addClass("evt_inbox");
        $liModify.append($divInbox);

        var $textAreaModify = $("<textarea>").attr("name","inpTxBoxModify")
                                             .attr("cols","10")
                                             .attr("rows","5")
                                             .attr("title","댓글 응모 입력창")
                                             .attr("maxlength","100")
                                             .val(commentInfo);
        $divInbox.append($textAreaModify);

        var $spanCount = $("<span>").attr("name","inTxCntModify").text(commentInfo.length);
        var $p = $("<p>").append($spanCount)
                     .append("/100자");
        $divInbox.append($p);
        $textAreaModify.keydown(function(){
            $(this).next().find("[name*=inTxCntModify]").text($(this).val().length);
        });


        var $divBtn = $("<div>").addClass("btn_box");
        $liModify.append($divBtn);

        var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
        $divBtn.append($buttonModify);
        $buttonModify.click(function(){
            var cont = $(this).parent().parent().find("[name*=inpTxBoxModify]").val();
            MarketingEvent.detail.uptEventCommentAjax(bbcSeq,cont);
        });

        var $buttonCancel = $("<button>").addClass("btnGrayH28").text("취소");
        $divBtn.append($buttonCancel);
        $buttonCancel.click(function(){
            if(!confirm("댓글 수정을 취소하시겠습니까?")){
                return;
            }

            $(this).parent().parent().empty();
            MarketingEvent.detail.cancelModifyMain(showArea);
        });

    },
    
    /* 2017.12.12 */
    removeCommentModify : function(showArea){
        var $showAreaLiIdx = showArea.parents("li").index();
        $("#commentList .re_modify:eq("+($showAreaLiIdx+1)+")").remove();
    },
    
    /* 2017.12.12 */
    getEventCommentListAjax : function(){

        PagingCaller.destroy(); // 기존 페이징 해지

        //연속키 방식
          PagingCaller.init({
              callback : function(){
                  var param = {
                          evtNo : MarketingEvent.detail.evtNo,
                          pageIdx    : PagingCaller.getNextPageIdx() // 페이징 인덱스
                  };
                  common.Ajax.sendRequest(
                          "GET"
                          , _baseUrl + "event/getEventCommentListJson.do"
                          , param
                          , MarketingEvent.detail._callback_getEventCommentListAjax);
              }
          ,startPageIdx : 0
          ,subBottomScroll : 700
          ,initCall : true
          });
    },
    
    /* 2017.12.12 */
    _callback_getEventCommentListAjax : function(strData) {

        var listCount = strData.totalCount;
        var list = strData.eventCommList;
        var pageIdx = strData.pageIdx;
        var dispArea = $('#commentList');
        var rplYn = $.trim($("#rplYn1").val());
        var type = $("#evtType1").val();

        $("#myCommentList").hide();
        dispArea.show();

        if(pageIdx == 1){
            dispArea.empty();
            $("#commmentHeader").show();

            var textCount = [];
            textCount.push("(");
            textCount.push(listCount);
            textCount.push(")");
            $("#commmentHeader > .tit > span").text(textCount.join(""));
            $("#myCommmentHeader").hide();
        }

        if(listCount == 0){
            if(pageIdx == 1){
                $("#commmentHeader > .more").hide();
                var $liEmpty = $("<li>").addClass("no_txt_data").text("등록된 댓글이 없습니다.");
                dispArea.append($liEmpty);
            }else{
                PagingCaller.destroy(); // 기존 페이징 해지 
            }
        }else{
            if(pageIdx == 1){
                $("#commmentHeader > .more").show();
            }
            $.each(list, function(index, element){
                var $li = $("<li>");
                dispArea.append($li);

                var fcont = element.bbcFcont;
                var $p = $("<p>");
                if(!common.isEmpty(fcont)){
                    $p.html(fcont.replaceAll('\n','<br/>' ));
                }else{
                    $p.html(fcont);
                }
                $li.append($p);

                var $spanId = $("<span>").text(element.sysRegrId);
                $li.append($spanId);

                var $spanTime = $("<span>").text(element.sDtime);
                $li.append($spanTime);

                if(rplYn == 'Y' && type != MarketingEvent.detail.commenttype && $.trim(element.myCommentFlag) == 'Y'){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	MarketingEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	MarketingEvent.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }

            });
        }

    },

    /* 2017.12.12 */
    getEventMyCommentListAjax : function(){

        // 로그인 체크
        if(!MarketingEvent.detail.checkLogin()){
            return;
        }

        var evtNo = $("#evtNo1").val();
        var param = {
                evtNo : evtNo
            };

        this._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/getEventMyCommentListJson.do"
                , param
                , this._callback_getEventMyCommentListAjax);

    },
    
    _callback_getEventMyCommentListAjax : function(strData) {

        var listCount = strData.totalCount;
        var list = strData.eventCommList;
        var dispArea = $('#myCommentList');
        var type = $("#evtType1").val();
        var rplYn = $.trim($("#rplYn1").val());


        if(listCount == 0){
            alert("등록한 댓글이 없습니다.");
        }else{

            $("#commmentHeader").hide();
            $("#myCommmentHeader").show();

            $("#commentList").hide();
            dispArea.show();
            dispArea.empty();
            $.each(list, function(index, element){
                var $li = $("<li>");

                var fcont = element.bbcFcont;
                var $p = $("<p>");
                if(!common.isEmpty(fcont)){
                    $p.html(fcont.replaceAll('\n','<br/>' ));
                }else{
                    $p.html(fcont);
                }
                $li.append($p);
                dispArea.append($li);

                var $spanId = $("<span>").text(element.sysRegrId);
                $li.append($spanId);

                var $spanTime = $("<span>").text(element.sDtime);
                $li.append($spanTime);

                if(type != MarketingEvent.detail.commenttype){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	MarketingEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	MarketingEvent.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }
            });
        }

    },
    
    /* 2017.12.12 */
    regEventCommentAjax: function(){

        var bbcFcont = $("#inpTxBox").val();
        var evtNo = $("#evtNo1").val();

        if(!MarketingEvent.detail.checkCommentInfo(bbcFcont)){
            return;
        }

        var param = {
            bbcTitNm : bbcFcont,
            bbcFcont : bbcFcont,
            evtNo : evtNo
        };

        this._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/regEventMyCommentJson.do"
                , param
                , this._callback_regEventCommentAjax);

    },

    /* 2017.12.12 */
    _callback_regEventCommentAjax : function(strData) {
        if(strData.ret == "0"){
            alert(strData.message);
            location.reload();
        }else{
            common.loginChk();
        }
    },
    
    /* 2017.12.12 */
    uptEventCommentAjax: function(bbcSeq,bbcFcont){

        if(!MarketingEvent.detail.checkCommentInfo(bbcFcont)){
            return;
        }

        var evtNo = $("#evtNo1").val();
        var param = {
                bbcSeq : bbcSeq,
                bbcFcont : bbcFcont,
                evtNo : evtNo
            };


        this._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/uptEventMyCommentJson.do"
                , param
                , this._callback_uptEventCommentAjax);

    },

    /* 2017.12.12 */
    _callback_uptEventCommentAjax : function(strData) {

        if(strData.ret == "0"){
            alert(strData.message);
            location.reload();
        }else{
            common.loginChk();
        }
    },

    /* 2017.12.12 */
    delEventCommentAjax: function(bbcSeq){

        if(!confirm("댓글을 삭제하시겠습니까?")){
            return;
        }

        var evtNo = $("#evtNo1").val();
        var param = {
                bbcSeq : bbcSeq,
                evtNo : evtNo
            };

        this._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/delEventMyCommentJson.do"
                , param
                , this._callback_delEventCommentAjax);

    },

    /* 2017.12.12 */
    _callback_delEventCommentAjax: function(strData){

        if(strData.ret == "0"){
            alert(strData.message);
            location.reload();
        }else{
            common.loginChk();
        }
    },
    
    /* 2017.12.12 */
    checkRepl : function(){
        var replYn = $.trim($("#replYn1").val());
        if(replYn == 'N'){
            alert("현재 댓글 등록 가능한 기간이 아닙니다.");
            return false;
        }

        return true;
    },

    /* 2017.12.12 */
    checkCommentInfo : function(str){

        var sStr = $.trim(str);

        if(common.isEmpty(sStr)){
            alert("내용을 입력해주세요.");
            return false;
        }else if(sStr.length < 5){
            alert("내용을 5자 이상 입력해주세요");
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