$.namespace("BeautyEvent.detail");
BeautyEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "Y",
	commenttype : '댓글', /* 2017.12.12  */
    mbrInfoUseAgrYn1 : "N",
    mbrInfoThprSupAgrYn1 : "N",
    mbrInfoUseAgrYn2 : "N",
    mbrInfoThprSupAgrYn2 : "N",
    url : "",
    
    initSns : function(){
      url = _baseUrl + 'E.do?evtNo=' + $("#evtNo").val();
      common.sns.init( $("#bnrImgUrlAddr").val(),$("#evtNm").val(), url);
      
    },
    initEvNo : function(){
    	BeautyEvent.detail.evtNo = $("#evtNo1").val();
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
		
		/* 2017.12.12  */
        $('#inpTxBox').on({
            'keydown' : function(){
                $('#inTxCnt').text($(this).val().length);
            }
        });
        
        /* 2017.12.12 */
        $("#commmentHeader > .more").click(function(){
            PagingCaller.destroy();
            BeautyEvent.detail.getEventMyCommentListAjax();

        });

        /* 2017.12.12 */
        $("#commmentHeader > .tit").click(function(){
            $('#commentList').empty();
            BeautyEvent.detail.getEventCommentListAjax();
        });

        /* 2017.12.12 */
        $("#myCommmentHeader > .more").click(function(){
            $('#commentList').empty();
            BeautyEvent.detail.getEventCommentListAjax();
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
        
        $('.btnGreen').click(function(){
            if(!BeautyEvent.detail.checkLogin()){
                return;
            }

            var regType = $(this).parent().find("input[name*='regYn']" ).val();

            if(regType == 'regWrite'){
                if(!BeautyEvent.detail.checkRepl()){
                    return;
                }
                
                BeautyEvent.detail.regEventCommentAjax();
            }else{

                if(!BeautyEvent.detail.checkRegAvailable()){
                    return;
                }
                if(!BeautyEvent.detail.checkAgrmInfo()){
                    return;
                }
                BeautyEvent.detail.regEventAjax();
            }

        });

        BeautyEvent.detail.initEvNo(); /* 2017.12.12 */
        BeautyEvent.detail.initCommentList(); /* 2017.12.12 */
        BeautyEvent.detail.initSns();/* 2017.12.12 */
        /* 뷰티 이벤트 참여 목록 확인 */
		BeautyEvent.detail.checkMyEventAjax();

	},
	
	/* 2017.12.12 */
	initCommentList : function(){

        var rplYn = $.trim($("#rplYn1").val());
        var evtType = $("#evtType1").val();

        if(evtType == BeautyEvent.detail.commenttype || rplYn ==  "Y"){
        	BeautyEvent.detail.getEventCommentListAjax();
        }

    },
    
    /* 2017.12.12 */
    commentModifyMain : function(appenArea,bbcSeq,commentInfo){
        $("#regComment").hide();
        BeautyEvent.detail.makeCommentModify(commentInfo,appenArea,bbcSeq)
    },

    /* 2017.12.12 */
    cancelModifyMain : function(showArea){
        showArea.show();
        BeautyEvent.detail.removeCommentModify(showArea);
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
            BeautyEvent.detail.uptEventCommentAjax(bbcSeq,cont);
        });

        var $buttonCancel = $("<button>").addClass("btnGrayH28").text("취소");
        $divBtn.append($buttonCancel);
        $buttonCancel.click(function(){
            if(!confirm("댓글 수정을 취소하시겠습니까?")){
                return;
            }

            $(this).parent().parent().empty();
            BeautyEvent.detail.cancelModifyMain(showArea);
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
                          evtNo : BeautyEvent.detail.evtNo,
                          pageIdx    : PagingCaller.getNextPageIdx() // 페이징 인덱스
                  };
                  common.Ajax.sendRequest(
                          "GET"
                          , _baseUrl + "event/getEventCommentListJson.do"
                          , param
                          , BeautyEvent.detail._callback_getEventCommentListAjax);
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

                if(rplYn == 'Y' && type != BeautyEvent.detail.commenttype && $.trim(element.myCommentFlag) == 'Y'){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	BeautyEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	BeautyEvent.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }

            });
        }

    },

    /* 2017.12.12 */
    getEventMyCommentListAjax : function(){

        // 로그인 체크
        if(!BeautyEvent.detail.checkLogin()){
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

                if(type != BeautyEvent.detail.commenttype){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	BeautyEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	BeautyEvent.detail.delEventCommentAjax(element.bbcSeq);
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

        if(!BeautyEvent.detail.checkCommentInfo(bbcFcont)){
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

        if(!BeautyEvent.detail.checkCommentInfo(bbcFcont)){
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
    checkBeautyCheckEventJson2 : function(){
		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}
		
		//2. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		//3. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}
		//4. 이벤트선택 체크
		if(!BeautyEvent.detail.checkEvent2()){
			
			return;
		}
		
		var param = {
		      evtNo1 : $("input[id='myevtNo1']:hidden").val()
		      , evtNo2 : $("input[id='myevtNo2']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyEventJson2.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkBeautyEventJson2
		);
    	
	},
	_callback_checkBeautyEventJson2 : function(json){
		if(json.ret == "0" || json.ret == "1" ){
			var regEvtNm = "";
			var regEvtCount = 0;
			var message = json.message + "\n* 브랜드명 : ";
			if($("input[id='myevtNo1']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "콜만"
				}
				regEvtCount = regEvtCount +1;
            }
			if($("input[id='myevtNo2']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "바른생각";
				}else{
					regEvtNm = regEvtNm + ", 바른생각";
				}
				regEvtCount = regEvtCount +1;
            }
			
			if(regEvtCount == 2){
				$("input[id='allEventRegYn']:hidden").val("Y");
			}
			
			message = message + regEvtNm;
			alert(message);
		}else{
			alert(json.message);
		}
	},
	checkEvent2 : function() {
		var evtNo1 = $("input[id='evtNo1']:hidden").val();
		var evtNo2 = $("input[id='evtNo2']:hidden").val();
		
		var allEventRegYn = $("input[id='allEventRegYn']:hidden").val();
		
		var regEvtCount = 0;
		
        if(allEventRegYn == 'Y'){
            alert("이미 신청하였습니다. 당첨자 발표일을 기다려주세요!\n* 브랜드명 : 콜만, 바른생각");
            return false;
        }else{
        	if($("#class_01").is(":checked")){
        		$("input[id='myevtNo1']:hidden").val(evtNo1)
                $("#class_01").attr("disabled",true);
        		regEvtCount = regEvtCount +1;
            }if($("#class_02").is(":checked")){
            	$("input[id='myevtNo2']:hidden").val(evtNo2)
                $("#class_02").attr("disabled",true);
            	regEvtCount = regEvtCount +1;
            }
            
            if(regEvtCount == 0){
            	 alert("클래스 선택 후 이벤트 참여 가능합니다.");
            	 return false;
			}
        }
        return true;
    },
    checkBeautyCheckEventJson3 : function(){
		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}
		
		//2. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		//3. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}
		//4. 이벤트선택 체크
		if(!BeautyEvent.detail.checkEvent3()){
			
			return;
		}
		
		var param = {
		      evtNo1 : $("input[id='myevtNo1']:hidden").val()
		      , evtNo2 : $("input[id='myevtNo2']:hidden").val()
		      , evtNo3 : $("input[id='myevtNo3']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyEventJson3.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkBeautyEventJson3
		);
    	
	},
	_callback_checkBeautyEventJson3 : function(json){
		if(json.ret == "0" || json.ret == "1" ){
			var regEvtNm = "";
			var regEvtCount = 0;
			var message = json.message + "\n* 브랜드명 : ";
			if($("input[id='myevtNo1']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "에스쁘아"
				}
				regEvtCount = regEvtCount +1;
            }
			if($("input[id='myevtNo2']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "바이오더마";
				}else{
					regEvtNm = regEvtNm + ", 바이오더마";
				}
				regEvtCount = regEvtCount +1;
            }
			if($("input[id='myevtNo3']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "웨이크메이크";
				}else{
					regEvtNm = regEvtNm + ", 웨이크메이크";
				}
				regEvtCount = regEvtCount +1;
            }
			
			if(regEvtCount == 3){
				$("input[id='allEventRegYn']:hidden").val("Y");
			}
			
			message = message + regEvtNm;
			alert(message);
		}else{
			alert(json.message);
		}
	},
	checkEvent3 : function() {
		var evtNo1 = $("input[id='evtNo1']:hidden").val();
		var evtNo2 = $("input[id='evtNo2']:hidden").val();
		var evtNo3 = $("input[id='evtNo3']:hidden").val();
		
		var allEventRegYn = $("input[id='allEventRegYn']:hidden").val();
		
		var regEvtCount = 0;
		
        if(allEventRegYn == 'Y'){
            alert("이미 신청하였습니다. 당첨자 발표일을 기다려주세요!\n* 브랜드명 : 에스쁘아, 바이오더마, 웨이크메이크");
            return false;
        }else{
        	if($("#class_01").is(":checked")){
        		$("input[id='myevtNo1']:hidden").val(evtNo1)
                $("#class_01").attr("disabled",true);
        		regEvtCount = regEvtCount +1;
            }if($("#class_02").is(":checked")){
            	$("input[id='myevtNo2']:hidden").val(evtNo2)
                $("#class_02").attr("disabled",true);
            	regEvtCount = regEvtCount +1;
            }
            if($("#class_03").is(":checked")){
            	$("input[id='myevtNo3']:hidden").val(evtNo3)
                $("#class_03").attr("disabled",true);
            	regEvtCount = regEvtCount +1;
            }
            
            if(regEvtCount == 0){
            	 alert("클래스 선택 후 이벤트 참여 가능합니다.");
            	 return false;
			}
        }
        return true;
    },
    checkBeautyCheckEventJson3_2 : function(){
		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}
		
		//2. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		//3. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}
		//4. 이벤트선택 체크
		if(!BeautyEvent.detail.checkEvent3_2()){
			
			return;
		}
		
		var param = {
		      evtNo1 : $("input[id='myevtNo1']:hidden").val()
		      , evtNo2 : $("input[id='myevtNo2']:hidden").val()
		      , evtNo3 : $("input[id='myevtNo3']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyEventJson3.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkBeautyEventJson3_2
		);
    	
	},
	_callback_checkBeautyEventJson3_2 : function(json){
		if(json.ret == "0" || json.ret == "1" ){
			var regEvtNm = "";
			var regEvtCount = 0;
			var message = json.message + "\n* 브랜드명 : ";
			if($("input[id='myevtNo1']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "메이블린"
				}
				regEvtCount = regEvtCount +1;
            }
			if($("input[id='myevtNo2']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "로레알엑셀랑스";
				}else{
					regEvtNm = regEvtNm + ", 로레알엑셀랑스";
				}
				regEvtCount = regEvtCount +1;
            }
			if($("input[id='myevtNo3']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "데싱디바";
				}else{
					regEvtNm = regEvtNm + ", 데싱디바";
				}
				regEvtCount = regEvtCount +1;
            }
			
			if(regEvtCount == 3){
				$("input[id='allEventRegYn']:hidden").val("Y");
			}
			
			message = message + regEvtNm;
			alert(message);
		}else{
			alert(json.message);
		}
	},
	checkEvent3_2 : function() {
		var evtNo1 = $("input[id='evtNo1']:hidden").val();
		var evtNo2 = $("input[id='evtNo2']:hidden").val();
		var evtNo3 = $("input[id='evtNo3']:hidden").val();
		
		var allEventRegYn = $("input[id='allEventRegYn']:hidden").val();
		
		var regEvtCount = 0;
		
        if(allEventRegYn == 'Y'){
            alert("이미 신청하였습니다. 당첨자 발표일을 기다려주세요!\n* 브랜드명 : 메이블린, 로레알엑셀랑스, 데싱디바");
            return false;
        }else{
        	if($("#class_01").is(":checked")){
        		$("input[id='myevtNo1']:hidden").val(evtNo1)
                $("#class_01").attr("disabled",true);
        		regEvtCount = regEvtCount +1;
            }if($("#class_02").is(":checked")){
            	$("input[id='myevtNo2']:hidden").val(evtNo2)
                $("#class_02").attr("disabled",true);
            	regEvtCount = regEvtCount +1;
            }
            if($("#class_03").is(":checked")){
            	$("input[id='myevtNo3']:hidden").val(evtNo3)
                $("#class_03").attr("disabled",true);
            	regEvtCount = regEvtCount +1;
            }
            
            if(regEvtCount == 0){
            	 alert("클래스 선택 후 이벤트 참여 가능합니다.");
            	 return false;
			}
        }
        return true;
    },
    checkBeautyCheckEventJson5 : function(){
		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
		/*if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}*/
		
		//3. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		//4. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}
		//5. 이벤트선택 체크
		if(!BeautyEvent.detail.checkEvent5()){
			
			return;
		}
		
		var param = {
		      evtNo1 : $("input[id='myevtNo1']:hidden").val()
		      , evtNo2 : $("input[id='myevtNo2']:hidden").val()
		      , evtNo3 : $("input[id='myevtNo3']:hidden").val()
		      , evtNo4 : $("input[id='myevtNo4']:hidden").val()
		      , evtNo5 : $("input[id='myevtNo5']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyEventJson5.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkBeautyEventJson5
		);
    	
	},
	_callback_checkBeautyEventJson5 : function(json){
		if(json.ret == "0" || json.ret == "1" ){
			var regEvtNm = "";
			var regEvtCount = 0;
			var message = json.message + "\n* 브랜드명 : ";
			if($("input[id='myevtNo1']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "리얼테크닉스"
				}
				regEvtCount = regEvtCount +1;
            }
			if($("input[id='myevtNo2']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "닥터지";
				}else{
					regEvtNm = regEvtNm + ", 닥터지";
				}
				regEvtCount = regEvtCount +1;
            }
			if($("input[id='myevtNo3']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "롬앤";
				}else{
					regEvtNm = regEvtNm + ", 롬앤";
				}
				regEvtCount = regEvtCount +1;
            }
			if($("input[id='myevtNo4']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "미장센";
				}else{
					regEvtNm = regEvtNm + ", 미장센";
				}
				regEvtCount = regEvtCount +1;
            }
			if($("input[id='myevtNo5']:hidden").val() !="" ){
				if(regEvtNm == ""){
					regEvtNm = "닥터브로너스";
				}else{
					regEvtNm = regEvtNm + ", 닥터브로너스";
				}
				regEvtCount = regEvtCount +1;
            }
			
			if(regEvtCount == 5){
				$("input[id='allEventRegYn']:hidden").val("Y");
			}
			
			message = message + regEvtNm;
			alert(message);
		}else{
			alert(json.message);
		}
	},
	checkEvent5 : function() {
		var evtNo1 = $("input[id='evtNo1']:hidden").val();
		var evtNo2 = $("input[id='evtNo2']:hidden").val();
		var evtNo3 = $("input[id='evtNo3']:hidden").val();
		var evtNo4 = $("input[id='evtNo4']:hidden").val();
		var evtNo5 = $("input[id='evtNo5']:hidden").val();
		
		var allEventRegYn = $("input[id='allEventRegYn']:hidden").val();
		
		var regEvtCount = 0;
		
        if(allEventRegYn == 'Y'){
            alert("이미 신청하였습니다. 당첨자 발표일을 기다려주세요!\n* 브랜드명 : 리얼테크닉스, 닥터지, 롬앤, 미장센, 닥터브로너스");
            return false;
        }else{
        	if($("#class_01").is(":checked")){
        		$("input[id='myevtNo1']:hidden").val(evtNo1)
                $("#class_01").attr("disabled",true);
        		regEvtCount = regEvtCount +1;
            }if($("#class_02").is(":checked")){
            	$("input[id='myevtNo2']:hidden").val(evtNo2)
                $("#class_02").attr("disabled",true);
            	regEvtCount = regEvtCount +1;
            }
            if($("#class_03").is(":checked")){
            	$("input[id='myevtNo3']:hidden").val(evtNo3)
                $("#class_03").attr("disabled",true);
            	regEvtCount = regEvtCount +1;
            }
            if($("#class_04").is(":checked")){
            	$("input[id='myevtNo4']:hidden").val(evtNo4)
                $("#class_04").attr("disabled",true);
            	regEvtCount = regEvtCount +1;
            }
            if($("#class_05").is(":checked")){
            	$("input[id='myevtNo5']:hidden").val(evtNo5)
                $("#class_05").attr("disabled",true);
            	regEvtCount = regEvtCount +1;
            }
            
            if(regEvtCount == 0){
            	 alert("클래스 선택 후 이벤트 참여 가능합니다.");
            	 return false;
			}
        }
        return true;
    },
    checkMyEventAjax : function(){
		var myevtNo1 = $.trim($("#myevtNo1").val());
		var myevtNo2 = $.trim($("#myevtNo2").val());
		var myevtNo3 = $.trim($("#myevtNo3").val());
		var myevtNo4 = $.trim($("#myevtNo4").val());
		var myevtNo5 = $.trim($("#myevtNo5").val());
		
		if(myevtNo1 == $("#evtNo1").val()){
			$("#class_01").attr("checked", true);
            $("#class_01").attr("disabled",true);
		}
		if(myevtNo2 == $("#evtNo2").val()){
			$("#class_02").attr("checked", true);
            $("#class_02").attr("disabled",true);
		}
		if(myevtNo3 == $("#evtNo3").val()){
			$("#class_03").attr("checked", true);
            $("#class_03").attr("disabled",true);
		}
		/*if(myevtNo4 == $("#evtNo4").val()){
			$("#class_04").attr("checked", true);
            $("#class_04").attr("disabled",true);
		}
		if(myevtNo5 == $("#evtNo5").val()){
			$("#class_05").attr("checked", true);
            $("#class_05").attr("disabled",true);
		}*/
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
};