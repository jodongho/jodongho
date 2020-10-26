$.namespace("eventPreview.detail");
eventPreview.detail = {

	_ajax : common.Ajax,
	billtype : '영수증이벤트',
	commenttype : '댓글',
	url : "",
	evtNo : "",
	mbrInfoUseAgrYn : "N",
	mbrInfoThprSupAgrYn : "N",
	initSns : function(){
//        eventPreview.detail.url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?evtNo="+$("#evtNo").val();
        eventPreview.detail.url = _baseUrl + 'E.do?evtNo=' + $("#evtNo").val();
        if($("#evtNo").val() == "00000000005220" || $("#evtNo").val() == "00000000005397" || $("#evtNo").val() == "00000000005788"){
            common.sns.init( $("#bnrImgUrlAddr").val(), "올리브영 온라인몰 생일 초대장 도착! 응모권 받고, 100% 혜택 기대해♥", eventPreview.detail.url);
        }else{
            common.sns.init( $("#bnrImgUrlAddr").val(),$("#evtNm").val(), eventPreview.detail.url);
        }
    },
    initEvNo : function(){
        eventPreview.detail.evtNo = $("#evtNo").val();
    },
    init : function(){
    	
        $('.event_agree .tit > a').click(function(e){
            e.preventDefault();
            if($(this).parents('li').hasClass('on')){
                $(this).parents('li').removeClass('on');
            }else{
                $(this).parents('li').addClass('on').siblings().removeClass('on');
            }
        });


        $('#inpTxBox').on({
            'keydown' : function(){
                $('#inTxCnt').text($(this).val().length);
            }
        });

        $(".btn_modify").click(function(){

            if(!eventPreview.detail.checkLogin()){
                return;
            }

            common.link.moveMyDeliveryInfoPage();
        });

        $("#commmentHeader > .more").click(function(){
            PagingCaller.destroy();
            eventPreview.detail.getEventMyCommentListAjax();

        });

        $("#commmentHeader > .tit").click(function(){
            $('#commentList').empty();
            eventPreview.detail.getEventCommentListAjax();
        });


        $("#myCommmentHeader > .more").click(function(){
            $('#commentList').empty();
            eventPreview.detail.getEventCommentListAjax();
        });

        $('.btnShare').click(function(){
            eventPreview.detail.dispSnsPopup();
            common.popLayerOpen("SNSLAYER");
            $.fn.enableSelection();
        });

        $('.btnGreen').click(function(){
            if(!eventPreview.detail.checkLogin()){
                return;
            }

            var regType = $(this).parent().find("input[name*='regYn']" ).val();
            if(regType == 'regWrite'){
                if(!eventPreview.detail.checkRepl()){
                    return;
                }

                eventPreview.detail.regEventCommentAjax();
            }else{

                if(!eventPreview.detail.checkRegAvailable()){
                    return;
                }
                if(!eventPreview.detail.checkAgrmInfo()){
                    return;
                }

                eventPreview.detail.regEventAjax();
            }

        });

		$('.btnGreen2').click(function(){
			if(!eventPreview.detail.checkLogin()){
				return;
			}

			var regType = $(this).parent().find("input[name*='regYn']" ).val();
			if(regType == 'regWrite'){
				if(!eventPreview.detail.checkRepl()){
					return;
				}

				eventPreview.detail.regEventCommentAjax();
			}else{
				if(!eventPreview.detail.checkRegAvailable()){
					return;
				}
				if(!eventPreview.detail.checkAgrmInfo()){
					return;
				}
				eventPreview.detail.regReceiptEventAjax();
			}
		});

        $(document).on('click', '.dim', function() {
            common.popLayerClose("LAYERPOP01");
        });

		eventPreview.detail.initEvNo();
		eventPreview.detail.initCommentList();

		if((location.href).indexOf("event/getEventDetail.do") > 0){
			/* 이벤트 기본 디테일에서만 활성화 */
			eventPreview.detail.initSns();
		}else if((location.href).indexOf("/getEventDetail.do") > 0){ // 20180604 추가
            /* 이벤트 기본 디테일에서만 활성화 */
            eventPreview.detail.initSns();
        }

		/* 닫기  */
        $(".eventHideLayer").click(function(){
            eventPreview.detail.eventCloseLayer();
        });

        common.header.appDownBannerInit();

    },

    initCommentList : function(){

        var rplYn = $.trim($("#rplYn").val());
        var evtType = $("#evtType").val();

        if(evtType == eventPreview.detail.commenttype || rplYn ==  "Y"){
            eventPreview.detail.getEventCommentListAjax();
        }

    },

    commentModifyMain : function(appenArea,bbcSeq,commentInfo){
        $("#regComment").hide();
        eventPreview.detail.makeCommentModify(commentInfo,appenArea,bbcSeq)
    },

    cancelModifyMain : function(showArea){
        showArea.show();
        eventPreview.detail.removeCommentModify(showArea);
        $("#regComment").show();
    },

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
            eventPreview.detail.uptEventCommentAjax(bbcSeq,cont);
        });

        var $buttonCancel = $("<button>").addClass("btnGrayH28").text("취소");
        $divBtn.append($buttonCancel);
        $buttonCancel.click(function(){
            if(!confirm("댓글 수정을 취소하시겠습니까?")){
                return;
            }

            $(this).parent().parent().empty();
            eventPreview.detail.cancelModifyMain(showArea);
        });

    },

    removeCommentModify : function(showArea){
        var $showAreaLiIdx = showArea.parents("li").index();
        $("#commentList .re_modify:eq("+($showAreaLiIdx+1)+")").remove();
    },

    getEventCommentListAjax : function(){

        PagingCaller.destroy(); // 기존 페이징 해지

        //연속키 방식
          PagingCaller.init({
              callback : function(){
                  var param = {
                          evtNo : eventPreview.detail.evtNo,
                          pageIdx    : PagingCaller.getNextPageIdx() // 페이징 인덱스
                  };
                  common.Ajax.sendRequest(
                          "GET"
                          , _baseUrl + "event/getEventCommentListJson.do"
                          , param
                          , eventPreview.detail._callback_getEventCommentListAjax);
              }
          ,startPageIdx : 0
          ,subBottomScroll : 700
          ,initCall : true
          });
    },

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

                if(rplYn == 'Y' && type != eventPreview.detail.commenttype && $.trim(element.myCommentFlag) == 'Y'){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                        eventPreview.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                        eventPreview.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }

            });
        }

    },

    getEventMyCommentListAjax : function(){

        // 로그인 체크
        if(!eventPreview.detail.checkLogin()){
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

                if(type != eventPreview.detail.commenttype){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                        eventPreview.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                        eventPreview.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }

            });
        }

    },

    regEventAjax : function(){
        var type = $("#evtType").val();
        var typeCd = $("#evtTypeCd").val();
        var evtNo = $("#evtNo").val();
        var startDate = $("#startDate").val();

        var param = {};
        if(type == eventPreview.detail.billtype){

            var billNum = $("#buyNumber").val();

            if(!eventPreview.detail.checkBillNumber(billNum)){
                return;
            }

            param = {
                recptNo : billNum,
                evtNo : evtNo,
                evtClssCd : typeCd,
                mbrInfoUseAgrYn : eventPreview.detail.mbrInfoUseAgrYn,
                mbrInfoThprSupAgrYn : eventPreview.detail.mbrInfoThprSupAgrYn,
                previewYn : "Y",
                startDate : startDate,
                chkPushYn : $("#mbrAppPushAplyYn").val()    //APP PUSH 동의(온라인 이벤트 유형 추가)
            };

        }else if(type == eventPreview.detail.commenttype){

            var bbcFcont = $("#inpTxBox").val();

            if(!eventPreview.detail.checkCommentInfo(bbcFcont)){
                return;
            }


            param = {
                bbcTitNm : bbcFcont,
                bbcFcont : bbcFcont,
                evtNo : evtNo,
                evtClssCd : typeCd,
                mbrInfoUseAgrYn : eventPreview.detail.mbrInfoUseAgrYn,
                mbrInfoThprSupAgrYn : eventPreview.detail.mbrInfoThprSupAgrYn,
                previewYn : "Y",
                startDate : startDate,
                chkPushYn : $("#mbrAppPushAplyYn").val() //APP PUSH 동의(온라인 이벤트 유형 추가)
            };

        }else {

            param = {
                evtNo : evtNo,
                evtClssCd : typeCd,
                mbrInfoUseAgrYn : eventPreview.detail.mbrInfoUseAgrYn,
                mbrInfoThprSupAgrYn : eventPreview.detail.mbrInfoThprSupAgrYn,
                previewYn : "Y",
                startDate : startDate,
                chkPushYn : $("#mbrAppPushAplyYn").val() //APP PUSH 동의(온라인 이벤트 유형 추가)
            };
        }

        this._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/regEventJson.do"
                , param
                , this._callback_regEventAjax);

    },

    _callback_regEventAjax : function(strData) {

        if(strData.ret == "0"){
            alert(strData.message);
            location.reload();
        }else{
            common.loginChk();
        }
    },

	regReceiptEventAjax : function(){
		var billNum = $("#buyNumber").val();

		if(!eventPreview.detail.checkBillNumber(billNum)){
			return;
		}

		var param = {
				recptNo : billNum
			  , evtNo : $("#evtNo").val()
			  , evtClssCd : $("#evtTypeCd").val()
			  , mbrInfoUseAgrYn : eventPreview.detail.mbrInfoUseAgrYn
			  , mbrInfoThprSupAgrYn : eventPreview.detail.mbrInfoThprSupAgrYn
		};

		this._ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/regReceiptEventJson.do"
			  , param
			  , this._callback_regReceiptEventAjax
		);
	},
	_callback_regReceiptEventAjax : function(strData) {
		if(strData.ret == "0"){
			alert(strData.message);
			location.reload();
		}else{
			common.loginChk();
		}
	},

    regEventCommentAjax: function(){

        var bbcFcont = $("#inpTxBox").val();
        var evtNo = $("#evtNo").val();

        if(!eventPreview.detail.checkCommentInfo(bbcFcont)){
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

_callback_regEventCommentAjax : function(strData) {
        if(strData.ret == "0"){
            alert(strData.message);
            location.reload();
        }else{
            common.loginChk();
        }
    },

    uptEventCommentAjax: function(bbcSeq,bbcFcont){


        if(!eventPreview.detail.checkCommentInfo(bbcFcont)){
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

    _callback_uptEventCommentAjax : function(strData) {

        if(strData.ret == "0"){
            alert(strData.message);
            location.reload();
        }else{
            common.loginChk();
        }
    },


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

    _callback_delEventCommentAjax: function(strData){

        if(strData.ret == "0"){
            alert(strData.message);
            location.reload();
        }else{
            common.loginChk();
        }
    },

    checkLogin : function(){

        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    },

    checkRegAvailable : function() {
      /*
      var regYn = $.trim($("#regYn").val());
      if(regYn == 'N'){
          alert("현재 이벤트 응모 기간이 아닙니다.");
          return false;
      }
	  */
      return true;
    },

    checkRepl : function(){
    	/*
        var replYn = $.trim($("#replYn").val());
        if(replYn == 'N'){
            alert("현재 댓글 등록 가능한 기간이 아닙니다.");
            return false;
        }
		*/
        return true;
    },

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

    checkAgrmInfo : function(){
        var regYn = $.trim($("#regYn").val());
        var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn").val());
        var mbrInfoThprSupAgrYn = $.trim($("#mbrInfoThprSupAgrYn").val());

        if(regYn == 'Y' && mbrInfoUseAgrYn == 'Y'){

            if(!$("#chk01").is(":checked")){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
                eventPreview.detail.mbrInfoUseAgrYn = 'Y';
            }
        }else{
            eventPreview.detail.mbrInfoUseAgrYn = 'N';
        }


        if(regYn == 'Y' && mbrInfoThprSupAgrYn == 'Y'){
            if(!$("#chk02").is(":checked")){
                alert("개인정보 취급 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
                eventPreview.detail.mbrInfoThprSupAgrYn = 'Y';
            }
        }else{
            eventPreview.detail.mbrInfoThprSupAgrYn = 'N';
        }


        return true;
    },

    checkBillNumber : function(billNum){
        var sbillNum = $.trim(billNum);

        if(common.isEmpty(sbillNum)){
            alert("발급 받으신 번호를 입력해 주세요.");
            return false;
        }else if( /^[a-zA-Z0-9]+$/.test(sbillNum) == false){
            alert("유효하지 않은 번호입니다. 번호를 다시 확인 후 입력해 주세요.");
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
        $inputUrl.html(eventPreview.detail.url);
        $divUrl.append($inputUrl);


        var $aClose = $("<a>").addClass("btnClose").text("닫기");
        $aClose.click(function(){
            //  드래그 방지 막기
            $.fn.disableSelection();
            common.popLayerClose("SNSLAYER");
        });
        $dimLayer.append($aClose);

    },
    /**
     * APP 쿠폰 다운로드 전용(공통)
     */
    downAppCouponEventJson : function(cpnNo){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            eventPreview.detail.downCouponJson(cpnNo);
        }
    },
    downCouponJson : function(cpnNo) {
        if(!eventPreview.detail.checkLogin()){
            return;
        }else{
            if(typeof cpnNo == "undefined" || cpnNo == ""){
                alert("쿠폰 번호가 없습니다.");
                return;
            }
            var param = {cpnNo : cpnNo};
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/downCouponOfEvtJson.do"
                    , param
                    , this._callback_downCouponJson);
        }
    },
    _callback_downCouponJson : function(strData) {
            alert(strData.message);
    },
    /* 개인정보 수신동의 레이어 */
    getLayerPopAgrInfoAjax : function(param){
    	if(param.evtNo == ""){
    		alert("이벤트 번호를 확인해주세요.");			return;
    	}
    	if(param.agrPopupFunction == ""){
    		alert("약관 오픈 평션명을 확인해주세요.");		return;
    	}
    	if(param.closeFunction == ""){
    		alert("닫기 평션명을 확인해주세요.");			return;
    	}
    	if(param.confirmFunction == ""){
    		alert("확인 평션명을 확인해주세요.");			return;
    	}

    	$.ajax({
            type : "POST"
          , dataType : "html"
          , url : _baseUrl + "event/getLayerPopAgrInfoAjax.do"
          , data : param
          , success : this._callback_getLayerPopAgrInfoAjax
    	});
    },
    _callback_getLayerPopAgrInfoAjax : function(html){
    	$("#eventLayerPolice").html(html);
    },
	// 약관 동의 업데이트
	updateTermsAgrInfoAjax : function(param){
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "open/updateTermsAgrInfoJson.do"
			  , param
			  , eventPreview.detail._callback_updateTermsAgrInfoAjax
		);
	},
	_callback_updateTermsAgrInfoAjax : function(strData){
		if(strData.ret == "0"){
			location.reload();
		}else{
			common.loginChk();
		}
	},
	// 레이어 노출
	eventShowLayer : function(obj) {
		var layObj = document.getElementById(obj);
		var layDim = document.getElementById('eventDimLayer');
		layDim.style.display = 'block';
		layObj.style.display = 'block';
		var layObjHeight = layObj.clientHeight  / 2;
		layObj.style.marginTop = "-" + layObjHeight +"px";
	},
	// 레이어 숨김
	eventCloseLayer : function(){
		$(".eventLayer").hide();
		$("#eventDimLayer").hide();
	},
	/* 개인정보 수집 필수값 체크 */
	checkAgrmOnInfo : function(){
		var agreeVal1 = $(':radio[name="argee1"]:checked').val();

		if("Y" != agreeVal1){
			alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
			return false;
		} else {
			$("#mbrInfoUseAgrYn").val("Y");
		}

		return true;
	},
	/* 개인정보 수집/위수탁 필수값 체크 */
	checkAgrmTwoInfo : function(){
		var agreeVal1 = $(':radio[name="argee1"]:checked').val();
		var agreeVal2 = $(':radio[name="argee2"]:checked').val();

		if("Y" != agreeVal1){
			alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
			return false;
		} else {
			$("#mbrInfoUseAgrYn").val("Y");
		}

		if("Y" != agreeVal2){
			alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
			return false;
		} else {
			$("#mbrInfoThprSupAgrYn").val("Y");
		}

		return true;
	},

	/**
     * 2017-10-12 닐슨 설문조사 모바일 팝업 (10.16 ~ 10.22)
     */
	callOpenPage : function(title, url, closeYn, isGet, isBack) {
    	if(common.app.appInfo.isapp){
    		common.app.callOpenPage(title, url, closeYn, isGet, isBack);
		}else{
			var SCH_WIN = window.open(url);
			if(SCH_WIN == null){
				alert("브라우저 팝업이 차단 설정되어 있습니다. 설정 메뉴에서 팝업을 허용해 주세요.");
			}
		}
	},

	/**
	 * 공지사항 레이어 길 경우 사용
	 */
	eventShowLayScroll : function(obj) {
	    var _winHeight = $(window).height(),
	        _layObj = $('#'+obj),
	        _layObjHeight = _layObj.height(),
	        _layObjTop = _layObj.height()/2,
	        _layDim = $('#eventDimLayer');
	    if(_layObjHeight >= _winHeight){
	        var _layObjInner = _layObj.find('.conts_inner');
	        var _layObjInHeight = _winHeight-112;
	        _layObjInner.css({'max-height': _layObjInHeight});
	        _layObjTop = $('#'+obj).height()/2;
	    }
	    _layDim.show();
	    _layObj.css({'margin-top': -_layObjTop}).show();
	},

	/**
     * 기능 : 링크 클릭 정보 저장후 랜딩
     */
    saveLinkInfo : function(fvrSeq,noteCont,link){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : fvrSeq
                ,noteCont : noteCont
        };
        common.Ajax.sendJSONRequest(
            "GET"
            ,_baseUrl + "event/saveLinkInfo.do"
            ,param
            ,function(json){
                if(json.ret == "0"){
                    common.link.commonMoveUrl(link);
                }else{
                    alert(json.message);
                }
            }
        )
    },

    /* 앱 푸시 설정 바로가기 */
    goSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 설정해 주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    },

    toCurrency : function(amount){
        amount = String(amount);
        var data = amount.split('.');
        var sign = "";
        var firstChar = data[0].substr(0,1);

        if(firstChar == "-"){
            sign = firstChar;
            data[0] = data[0].substring(1, data[0].length);
        }

        data[0] = data[0].replace(/\D/g,"");
        if(data.length > 1){
            data[1] = data[1].replace(/\D/g,"");
        }

        firstChar = data[0].substr(0,1);

        //0으로 시작하는 숫자들 처리
        if(firstChar == "0"){
            if(data.length == 1){
                return sign + parseFloat(data[0]);
            }
        }

        var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');

        data[0] += '.';
        do {
            data[0] = data[0].replace(comma, '$1,$2');
        } while (comma.test(data[0]));

        if (data.length > 1) {
            return sign + data.join('');
        } else {
            return sign + data[0].split('.')[0];
        }
    },

    eventShowLayerMov : function(obj){
        //youtube popup (오늘드림. 2020.02)
        if($("input[id='eventShowLayerMov']:hidden").val() == 'Y'){
            var layObj = document.getElementById(obj);
            var layDim = document.getElementById('eventDimLayer');
            layDim.style.display = 'block';
            layObj.style.display = 'block'; 
            var layObjHeight = layObj.clientHeight  / 2;
            layObj.style.marginTop = "-" + layObjHeight +"px";
            
            var $playerMov = $(layObj).find('.playMov'); 
            var embed_layer = $playerMov.html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + $playerMov.attr("id")+ '?rel=0&playsinline=1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');

            $('.popUpMov .eventHideLayer').click(function(){
                $('.playMov iframe').attr('src',''); //오늘드림 유투브 종료
            });
        }
    }
};