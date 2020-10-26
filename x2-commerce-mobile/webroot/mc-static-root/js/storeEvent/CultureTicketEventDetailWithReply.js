$.namespace("CultureTicketEvent.detail");
CultureTicketEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "Y",
	commenttype : '댓글', /* 2017.12.12  */
    mbrInfoUseAgrYn1 : "N",
    mbrInfoThprSupAgrYn1 : "N",
    url : "",
    
    initSns : function(){
      url = _baseUrl + 'E.do?evtNo=' + $("#evtNo1").val();
      common.sns.init( $("#bnrImgUrlAddr1").val(),$("#evtNm1").val(), url);
      
    },
    initEvNo : function(){
    	CultureTicketEvent.detail.evtNo = $("#evtNo1").val();
    },

	init : function(){
		if($("input[id='reCommend']:hidden").val() != ""){
			if(!CultureTicketEvent.detail.checkLogin()){
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
		
		$('.event_btn2').click(function(e){
			e.preventDefault();
			if(!CultureTicketEvent.detail.checkTargetAvailable()){
				return;
			}else{
				$('.event_modal_pop').show();
			}
		});

		$('.event_btn5').click(function(e){
			e.preventDefault();
			$('.event_modal_pop').hide();
		});
		
		$('.event_btn6').click(function(e){
			e.preventDefault();
			$('.event_modal_pop').hide();
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
            CultureTicketEvent.detail.getEventMyCommentListAjax();

        });

        /* 2017.12.12 */
        $("#commmentHeader > .tit").click(function(){
            $('#commentList').empty();
            CultureTicketEvent.detail.getEventCommentListAjax();
        });

        /* 2017.12.12 */
        $("#myCommmentHeader > .more").click(function(){
            $('#commentList').empty();
            CultureTicketEvent.detail.getEventCommentListAjax();
        });
		
        $('.btnShare').click(function(){
        	CultureTicketEvent.detail.dispSnsPopup();
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
            if(!CultureTicketEvent.detail.checkLogin()){
                return;
            }

            var regType = $(this).parent().find("input[name*='regYn']" ).val();

            if(regType == 'regWrite'){
                if(!CultureTicketEvent.detail.checkRepl()){
                    return;
                }
                
                CultureTicketEvent.detail.regEventCommentAjax();
            }else{

                if(!CultureTicketEvent.detail.checkRegAvailable()){
                    return;
                }
                if(!CultureTicketEvent.detail.checkAgrmInfo()){
                    return;
                }
                CultureTicketEvent.detail.regEventAjax();
            }

        });

        CultureTicketEvent.detail.initEvNo(); /* 2017.12.12 */
        CultureTicketEvent.detail.initCommentList(); /* 2017.12.12 */
        CultureTicketEvent.detail.initSns();/* 2017.12.12 */

	},
	
	/* 2017.12.12 */
	initCommentList : function(){

        var rplYn = $.trim($("#rplYn1").val());
        var evtType = $("#evtType1").val();

        if(evtType == CultureTicketEvent.detail.commenttype || rplYn ==  "Y"){
        	CultureTicketEvent.detail.getEventCommentListAjax();
        }

    },
    
    /* 2017.12.12 */
    commentModifyMain : function(appenArea,bbcSeq,commentInfo){
        $("#regComment").hide();
        CultureTicketEvent.detail.makeCommentModify(commentInfo,appenArea,bbcSeq)
    },

    /* 2017.12.12 */
    cancelModifyMain : function(showArea){
        showArea.show();
        CultureTicketEvent.detail.removeCommentModify(showArea);
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
            CultureTicketEvent.detail.uptEventCommentAjax(bbcSeq,cont);
        });

        var $buttonCancel = $("<button>").addClass("btnGrayH28").text("취소");
        $divBtn.append($buttonCancel);
        $buttonCancel.click(function(){
            if(!confirm("댓글 수정을 취소하시겠습니까?")){
                return;
            }

            $(this).parent().parent().empty();
            CultureTicketEvent.detail.cancelModifyMain(showArea);
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
                          evtNo : CultureTicketEvent.detail.evtNo,
                          pageIdx    : PagingCaller.getNextPageIdx() // 페이징 인덱스
                  };
                  common.Ajax.sendRequest(
                          "GET"
                          , _baseUrl + "event/getEventCommentListJson.do"
                          , param
                          , CultureTicketEvent.detail._callback_getEventCommentListAjax);
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

                if(rplYn == 'Y' && type != CultureTicketEvent.detail.commenttype && $.trim(element.myCommentFlag) == 'Y'){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	CultureTicketEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	CultureTicketEvent.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }

            });
        }

    },

    /* 2017.12.12 */
    getEventMyCommentListAjax : function(){

        // 로그인 체크
        if(!CultureTicketEvent.detail.checkLogin()){
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

                if(type != CultureTicketEvent.detail.commenttype){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	CultureTicketEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	CultureTicketEvent.detail.delEventCommentAjax(element.bbcSeq);
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

        if(!CultureTicketEvent.detail.checkCommentInfo(bbcFcont)){
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

        if(!CultureTicketEvent.detail.checkCommentInfo(bbcFcont)){
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
	checkCultureJson1 : function(){

		//1. 로그인여부 체크
		if(!CultureTicketEvent.detail.checkLogin()){
			return;
		}
		//2. 티켓 사용 여부 확인
		if(!CultureTicketEvent.detail.checkTicketAvailable()){
			return;
		}
		//3. 회원등급체크
		if(!CultureTicketEvent.detail.checkMbrGradeCD()){
			return;
		}
		
		//4. 응모기간 체크
		if(!CultureTicketEvent.detail.checkRegAvailable1()){
			return;
		}
		
		if(confirm("직원 확인 후 입장권 재사용 불가합니다.")){
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
					, CultureTicketEvent.detail._callback_checkCultureJson1
			);
		}
	},
	_callback_checkCultureJson1 : function(json){
		if(json.ret == "0"){
			$("#useTicket").val("Y");
			alert("입장권 사용 완료.");
		}else{
			alert("이미 사용 처리 된 입장권 입니다.");
		}
	},
	checkTargetAvailable : function(){
		//1. 로그인여부 체크
		if(!CultureTicketEvent.detail.checkLogin()){
			return false;
		}
		//2. 회원등급체크
		if(!CultureTicketEvent.detail.checkMbrGradeCD()){
			return false;
		}
		
		return true;
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
    checkTicketAvailable : function() {
        var useTicket = $.trim($("#useTicket").val());
        if(useTicket == 'Y'){
        	alert("이미 사용 처리 된 입장권 입니다.");
            return false;
        }
        return true;
    },
    checkMbrGradeCD : function() {
        var mbrGradeCD = $.trim($("#mbrGradeCD").val());
        if(mbrGradeCD != '50' && mbrGradeCD != '55' && mbrGradeCD != '60'){
            alert("본 이벤트는 올리브영 GOLD·BLACK·GREEN OLIVE에 한하여 참여 가능합니다. ");
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
            	CultureTicketEvent.detail.mbrInfoUseAgrYn1 = 'Y';
            }
        }else{
        	CultureTicketEvent.detail.mbrInfoUseAgrYn1 = 'N';
        }

        if(regYn == 'Y' && mbrInfoThprSupAgrYn == 'Y'){
            if(!$("#inpChkAgree2").is(":checked")){
                alert("개인정보 취급 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	CultureTicketEvent.detail.mbrInfoThprSupAgrYn1 = 'Y';
            }
        }else{
        	CultureTicketEvent.detail.mbrInfoThprSupAgrYn1 = 'N';
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