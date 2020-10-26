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
      url = _baseUrl + 'E.do?evtNo=' + $("#evtNo1").val();
      common.sns.init( $("#bnrImgUrlAddr1").val(),$("#evtNm1").val(), url);
      
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
	checkBeautyStoreEventJson1 : function(){
		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
/*		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}
		*/
		//3. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		//4. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}
		//5. 매장선택 체크
		if(!BeautyEvent.detail.checkStore1()){
			return;
		}
		

		var param = {
		      evtNo : $("input[id='evtNo1']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
			  , strNo : $("input[id='storeID1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyNCultureStoreEventJson.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkBeautyNCultureStoreEventJson1
		);
	},
	_callback_checkBeautyNCultureStoreEventJson1 : function(json){
		if(json.ret == "0" && json.strNo !='' &&json.strNo !=null){
			var strName = '';
			if(json.strNo == "DAEA"){
				strName = '강남본점';
			}else if(json.strNo == "DB47"){
				  strName = '대구본점';
			}
			alert("이벤트에 정상적으로 참여하셨습니다.\n *신청매장: 올리브영 "+ strName );
		}else if(json.ret == "1"){
			alert(json.message);
		}else{
			alert(json.message);
		}
	},
	checkStore1 : function() {
		var selectItem = $("#beauty_store1").val();
		var storeID ='';
		if(selectItem == "강남본점"){
			  $("#storeID1").val("DAEA");
		}else if(selectItem == "대구본점"){
			  $("#storeID1").val("DB47");
		}else if(selectItem == "매장선택"){
			$("#storeID1").val("");
		} 
		
		storeID = $.trim($("input[id='storeID1']:hidden").val());
        
        if(storeID == ''){
            alert("매장 선택 후 이벤트 참여 가능합니다.");
            return false;
        }
       
        return true;
    },
	checkBeautyJson1 : function(){

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
	checkMbrGradeBeautyJson : function(){

		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}

		//3. 응모기간 체크
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

		//2. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		
		//3. 개인정보 수집동의 체크
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
	checkMbrGradeCultureJson : function(){

		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}

		//3. 응모기간 체크
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
        if(mbrGradeCD != '50' && mbrGradeCD != '55'){
            alert("본 이벤트는 올리브영 GOLD, BLACK 회원 등급에 한해 참여 가능합니다.");
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

    },
    checkBeautySelectEventJson1 : function(){
		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
/*		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}
		*/
		//3. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		//4. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}
		//5. 매장선택 체크
		if(!BeautyEvent.detail.checkEvent()){
			return;
		}
		
		var param = {
		      evtNo : $("input[id='selectEvtNo']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyNCultureEventJson.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkBeautySelectEventJson1
		);
	},
	_callback_checkBeautySelectEventJson1 : function(json){
		if(json.ret == "0"){
			alert("이벤트에 정상적으로 참여하셨습니다.");
		}else{
			alert(json.message);
		}
	},
	checkEvent : function() {
		var evtNo1 = $("input[id='evtNo1']:hidden").val();
		var evtNo2 = $("input[id='evtNo2']:hidden").val();
		var evtNo3 = $("input[id='evtNo3']:hidden").val();
		
		
		var selectItem = $.trim($("#beauty_store").val());
		var selectEvtNo ='';
		
		if(selectItem == "아로마티카"){
			  $("#selectEvtNo").val(evtNo1);
		}else if(selectItem == "라로슈포제"){
			  $("#selectEvtNo").val(evtNo2);
		}else if(selectItem == "눅스"){
			  $("#selectEvtNo").val(evtNo3);
		}else if(selectItem == "클래스 선택"){
			$("#selectEvtNo").val("");
		} 
		
		selectEvtNo = $.trim($("input[id='selectEvtNo']:hidden").val());
        
        if(selectEvtNo == ''){
            alert("클래스 선택 후 이벤트 참여 가능합니다.");
            return false;
        }
       
        return true;
    },
    checkBeautySelectEventJson5 : function(){
		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
/*		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}
		*/
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
		      evtNo : $("input[id='selectEvtNo']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regBeautyNCultureEventJson.do"
			  ,  param
			  , BeautyEvent.detail._callback_checkBeautySelectEventJson5
		);
	},
	_callback_checkBeautySelectEventJson5 : function(json){
		if(json.ret == "0"){
			alert("이벤트에 정상적으로 참여하셨습니다.");
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
		
		
		var selectItem = $.trim($("#beauty_store").val());
		var selectEvtNo ='';
		
		if(selectItem == "리얼테크닉스"){
			  $("#selectEvtNo").val(evtNo1);
		}else if(selectItem == "닥터지"){
			  $("#selectEvtNo").val(evtNo2);
		}else if(selectItem == "롬앤"){
			  $("#selectEvtNo").val(evtNo3);
		}else if(selectItem == "미쟝센"){
			  $("#selectEvtNo").val(evtNo4);
		}else if(selectItem == "닥터브로너스"){
			  $("#selectEvtNo").val(evtNo5);
		}else if(selectItem == "클래스 선택"){
			$("#selectEvtNo").val("");
		} 
		selectEvtNo = $.trim($("input[id='selectEvtNo']:hidden").val());
        
        if(selectEvtNo == ''){
            alert("클래스 선택 후 이벤트 참여 가능합니다.");
            return false;
        }
       
        return true;
    },
	checkCulturePlaceEventJson1 : function(){
		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
/*		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}
		*/
		//3. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		//4. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}
		//5. 전시관선택 체크
		if(!BeautyEvent.detail.checkCulturePlace1()){
			return;
		}
		
	
		


		var param = {
		      evtNo : $("input[id='evtNo1']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
			  , place : $("input[id='place']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regCulturePlaceEventJson.do"
			  ,  param
			  , BeautyEvent.detail._callback_regCulturePlaceEventJson1
		);
	},
	_callback_regCulturePlaceEventJson1 : function(json){
		if(json.ret == "0" && json.place !='' &&json.place !=null){
			var placeName = json.place;
			alert("이벤트에 정상적으로 참여하셨습니다.\n *신청전시관 : "+ placeName );
		}else if(json.ret == "1"){
			alert(json.message);
		}else{
			alert(json.message);
		}
	},
	checkCulturePlace1 : function() {
		var selectItem = $.trim($("#sel_store").val());
		var place ='';
		
		if(selectItem == "전시관 선택"){
			$("#place").val("");
		}else{
			$("#place").val(selectItem);
		}
		
		place = $.trim($("input[id='place']:hidden").val());
        
        if(place == ''){
            alert("전시관 선택 후 이벤트 참여 가능합니다.");
            return false;
        }
       
        return true;
    },
    checkCultureDateEventJson : function(){
		//1. 로그인여부 체크
		if(!BeautyEvent.detail.checkLogin()){
			return;
		}

		//2. 회원등급체크
/*		if(!BeautyEvent.detail.checkMbrGradeCD()){
			return;
		}
		*/
		//3. 응모기간 체크
		if(!BeautyEvent.detail.checkRegAvailable1()){
			return;
		}
		//4. 개인정보 수집동의 체크
		if(!BeautyEvent.detail.checkAgrmInfo1()){
			return;
		}
		//5. 초대일정선택 체크
		if(!BeautyEvent.detail.checkCultureDate()){
			return;
		}
		
		var param = {
		      evtNo : $("input[id='evtNo1']:hidden").val()
			  , fvrSeq : "2"
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn1']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn1']:hidden").val()
			  , date : $("input[id='date']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regCultureDateEventJson.do"
			  ,  param
			  , BeautyEvent.detail._callback_regCultureDateEventJson
		);
	},
	_callback_regCultureDateEventJson : function(json){
		if(json.ret == "0" && json.date !='' &&json.date !=null){
			var date = json.date;
			alert("이벤트에 정상적으로 참여하셨습니다.\n *신청 일자 : "+ date );
		}else if(json.ret == "1"){
			alert(json.message);
		}else{
			alert(json.message);
		}
	},
	checkCultureDate : function() {
		var selectItem = $.trim($("#sel_store").val());
		var date ='';
		
		if(selectItem == "초대 일자 선택"){
			$("#date").val("");
		}else{
			$("#date").val(selectItem);
		}
		
		date = $.trim($("input[id='date']:hidden").val());
        
        if(date == ''){
            alert("초대 일자 선택 후 이벤트 참여 가능합니다.");
            return false;
        }
       
        return true;
    }
};