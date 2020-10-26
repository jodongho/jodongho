$.namespace("FirstHalfEvent.detail");
FirstHalfEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "Y",
	commenttype : '댓글', /* 2017.12.12  */
    mbrInfoUseAgrYn : "N",
    mbrInfoThprSupAgrYn : "N",
    url : "",

     initSns : function(){
        url = _baseUrl + 'E.do?evtNo=' + $("#evtNo").val();
        common.sns.init( $("#bnrImgUrlAddr").val(),$("#evtNm").val(), url);
        
      },
      initEvNo : function(){
      	FirstHalfEvent.detail.evtNo = $("#evtNo").val();
      },
      
	init : function(){
		if($("input[id='reCommend']:hidden").val() != ""){
			if(!FirstHalfEvent.detail.checkLogin()){
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
            FirstHalfEvent.detail.getEventMyCommentListAjax();

        });

        /* 2017.12.12 */
        $("#commmentHeader > .tit").click(function(){
            $('#commentList').empty();
            FirstHalfEvent.detail.getEventCommentListAjax();
        });

        /* 2017.12.12 */
        $("#myCommmentHeader > .more").click(function(){
            $('#commentList').empty();
            FirstHalfEvent.detail.getEventCommentListAjax();
        });
		
        $('.btnShare').click(function(){
        	FirstHalfEvent.detail.dispSnsPopup();
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
            if(!FirstHalfEvent.detail.checkLogin()){
                return;
            }

            var regType = $(this).parent().find("input[name*='regYn']" ).val();

            if(regType == 'regWrite'){
                if(!FirstHalfEvent.detail.checkRepl()){
                    return;
                }
                
                FirstHalfEvent.detail.regEventCommentAjax();
            }else{

                if(!FirstHalfEvent.detail.checkRegAvailable()){
                    return;
                }
                if(!FirstHalfEvent.detail.checkAgrmInfo()){
                    return;
                }
                FirstHalfEvent.detail.regEventAjax();
            }

        });

        FirstHalfEvent.detail.initEvNo(); /* 2017.12.12 */
        FirstHalfEvent.detail.initCommentList(); /* 2017.12.12 */
        FirstHalfEvent.detail.initSns();/* 2017.12.12 */
	},
	/* 2017.12.12 */
	initCommentList : function(){

        var rplYn = $.trim($("#rplYn").val());
        var evtType = $("#evtType").val();

        if(evtType == FirstHalfEvent.detail.commenttype || rplYn ==  "Y"){
        	FirstHalfEvent.detail.getEventCommentListAjax();
        }

    },
    
    /* 2017.12.12 */
    commentModifyMain : function(appenArea,bbcSeq,commentInfo){
        $("#regComment").hide();
        FirstHalfEvent.detail.makeCommentModify(commentInfo,appenArea,bbcSeq)
    },

    /* 2017.12.12 */
    cancelModifyMain : function(showArea){
        showArea.show();
        FirstHalfEvent.detail.removeCommentModify(showArea);
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
            FirstHalfEvent.detail.uptEventCommentAjax(bbcSeq,cont);
        });

        var $buttonCancel = $("<button>").addClass("btnGrayH28").text("취소");
        $divBtn.append($buttonCancel);
        $buttonCancel.click(function(){
            if(!confirm("댓글 수정을 취소하시겠습니까?")){
                return;
            }

            $(this).parent().parent().empty();
            FirstHalfEvent.detail.cancelModifyMain(showArea);
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
                          evtNo : FirstHalfEvent.detail.evtNo,
                          pageIdx    : PagingCaller.getNextPageIdx() // 페이징 인덱스
                  };
                  common.Ajax.sendRequest(
                          "GET"
                          , _baseUrl + "event/getEventCommentListJson.do"
                          , param
                          , FirstHalfEvent.detail._callback_getEventCommentListAjax);
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
        var rplYn = $.trim($("#rplYn").val());
        var type = $("#evtType").val();

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

                if(rplYn == 'Y' && type != FirstHalfEvent.detail.commenttype && $.trim(element.myCommentFlag) == 'Y'){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	FirstHalfEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	FirstHalfEvent.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }

            });
        }

    },

    /* 2017.12.12 */
    getEventMyCommentListAjax : function(){

        // 로그인 체크
        if(!FirstHalfEvent.detail.checkLogin()){
            return;
        }

        var evtNo = $("#evtNo").val();
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
        var type = $("#evtType").val();
        var rplYn = $.trim($("#rplYn").val());


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

                if(type != FirstHalfEvent.detail.commenttype){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	FirstHalfEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	FirstHalfEvent.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }
            });
        }

    },
    
    /* 2017.12.12 */
    regEventCommentAjax: function(){

        var bbcFcont = $("#inpTxBox").val();
        var evtNo = $("#evtNo").val();

        if(!FirstHalfEvent.detail.checkCommentInfo(bbcFcont)){
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

        if(!FirstHalfEvent.detail.checkCommentInfo(bbcFcont)){
            return;
        }

        var evtNo = $("#evtNo").val();
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

        var evtNo = $("#evtNo").val();
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
        var replYn = $.trim($("#replYn").val());
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
    checkFirstHalfEventJson : function(){

		//1. 로그인여부 체크
		if(!FirstHalfEvent.detail.checkLogin()){
			return;
		}
		
		//2. 응모기간 체크
		if(!FirstHalfEvent.detail.checkRegAvailable()){
			return;
		}
		
		//3. 개인정보 수집동의 체크
		if(!FirstHalfEvent.detail.checkAgrmInfo()){
			return;
		}
		
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regFirstHalfEventJson.do"
			  ,  param
			  , FirstHalfEvent.detail._callback_checkFirstHalfEventJson
		);
	},
	_callback_checkFirstHalfEventJson : function(json){	
		if(json.ret == "0"){
			alert("이벤트에 응모 되었습니다. 당첨 시 회원님의 CJ ONE 정보로 경품이 발송될 예정이니, 핸드폰 번호를 꼭 확인해주세요");
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
    checkRegAvailable : function() {
        var regYn = $.trim($("#regYn").val());
        if(regYn == 'N'){
            alert("현재 이벤트 응모 기간이 아닙니다.");
            return false;
        }
        return true;
    },
	/* 개인정보 필수값 체크 */
    checkAgrmInfo : function(){
        var regYn = $.trim($("#regYn").val());
        var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn").val());
        var mbrInfoThprSupAgrYn = $.trim($("#mbrInfoThprSupAgrYn").val());

        if(regYn == 'Y' && mbrInfoUseAgrYn == 'Y'){

            if(!$("#inpChkAgree1").is(":checked")){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	FirstHalfEvent.detail.mbrInfoUseAgrYn = 'Y';
            }
        }else{
        	FirstHalfEvent.detail.mbrInfoUseAgrYn = 'N';
        }


        if(regYn == 'Y' && mbrInfoThprSupAgrYn == 'Y'){
            if(!$("#inpChkAgree2").is(":checked")){
                alert("개인정보 취급 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	FirstHalfEvent.detail.mbrInfoThprSupAgrYn = 'Y';
            }
        }else{
        	FirstHalfEvent.detail.mbrInfoThprSupAgrYn = 'N';
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