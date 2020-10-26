$.namespace("VipKitEvent.detail");
VipKitEvent.detail = {
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
      	VipKitEvent.detail.evtNo = $("#evtNo").val();
      },
      
	init : function(){
		if($("input[id='reCommend']:hidden").val() != ""){
			if(!VipKitEvent.detail.checkLogin()){
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
            VipKitEvent.detail.getEventMyCommentListAjax();

        });

        /* 2017.12.12 */
        $("#commmentHeader > .tit").click(function(){
            $('#commentList').empty();
            VipKitEvent.detail.getEventCommentListAjax();
        });

        /* 2017.12.12 */
        $("#myCommmentHeader > .more").click(function(){
            $('#commentList').empty();
            VipKitEvent.detail.getEventCommentListAjax();
        });
		
        $('.btnShare').click(function(){
        	VipKitEvent.detail.dispSnsPopup();
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
            if(!VipKitEvent.detail.checkLogin()){
                return;
            }

            var regType = $(this).parent().find("input[name*='regYn']" ).val();

            if(regType == 'regWrite'){
                if(!VipKitEvent.detail.checkRepl()){
                    return;
                }
                
                VipKitEvent.detail.regEventCommentAjax();
            }else{

                if(!VipKitEvent.detail.checkRegAvailable()){
                    return;
                }
                if(!VipKitEvent.detail.checkAgrmInfo()){
                    return;
                }
                VipKitEvent.detail.regEventAjax();
            }

        });

        VipKitEvent.detail.initEvNo(); /* 2017.12.12 */
        VipKitEvent.detail.initCommentList(); /* 2017.12.12 */
        VipKitEvent.detail.initSns();/* 2017.12.12 */
	},
	/* 2017.12.12 */
	initCommentList : function(){

        var rplYn = $.trim($("#rplYn1").val());
        var evtType = $("#evtType1").val();

        if(evtType == VipKitEvent.detail.commenttype || rplYn ==  "Y"){
        	VipKitEvent.detail.getEventCommentListAjax();
        }

    },
    
    /* 2017.12.12 */
    commentModifyMain : function(appenArea,bbcSeq,commentInfo){
        $("#regComment").hide();
        VipKitEvent.detail.makeCommentModify(commentInfo,appenArea,bbcSeq)
    },

    /* 2017.12.12 */
    cancelModifyMain : function(showArea){
        showArea.show();
        VipKitEvent.detail.removeCommentModify(showArea);
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
            VipKitEvent.detail.uptEventCommentAjax(bbcSeq,cont);
        });

        var $buttonCancel = $("<button>").addClass("btnGrayH28").text("취소");
        $divBtn.append($buttonCancel);
        $buttonCancel.click(function(){
            if(!confirm("댓글 수정을 취소하시겠습니까?")){
                return;
            }

            $(this).parent().parent().empty();
            VipKitEvent.detail.cancelModifyMain(showArea);
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
                          evtNo : VipKitEvent.detail.evtNo,
                          pageIdx    : PagingCaller.getNextPageIdx() // 페이징 인덱스
                  };
                  common.Ajax.sendRequest(
                          "GET"
                          , _baseUrl + "event/getEventCommentListJson.do"
                          , param
                          , VipKitEvent.detail._callback_getEventCommentListAjax);
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

                if(rplYn == 'Y' && type != VipKitEvent.detail.commenttype && $.trim(element.myCommentFlag) == 'Y'){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	VipKitEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	VipKitEvent.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }

            });
        }

    },

    /* 2017.12.12 */
    getEventMyCommentListAjax : function(){

        // 로그인 체크
        if(!VipKitEvent.detail.checkLogin()){
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

                if(type != VipKitEvent.detail.commenttype){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	VipKitEvent.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	VipKitEvent.detail.delEventCommentAjax(element.bbcSeq);
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

        if(!VipKitEvent.detail.checkCommentInfo(bbcFcont)){
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

        if(!VipKitEvent.detail.checkCommentInfo(bbcFcont)){
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
	checkVIPKitJson : function(){

		//1. 로그인여부 체크
		if(!VipKitEvent.detail.checkLogin()){
			return;
		}
		
		//2. 회원등급체크
		if(!VipKitEvent.detail.checkMbrGradeCD()){
			return;
		}
		
		//3. 응모기간 체크
		if(!VipKitEvent.detail.checkRegAvailable()){
			return;
		}
		
		//4. 개인정보 수집동의 체크
		if(!VipKitEvent.detail.checkAgrmInfo()){
			return;
		}
		
		//5. 매장선택 체크
		if(!VipKitEvent.detail.checkStore()){
			return;
		}
		
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "2"
			  , strNo : $("input[id='storeID']:hidden").val()
		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "storeEvent/regVIPKitEventJson.do"
			  ,  param
			  , VipKitEvent.detail._callback_checkVIPKitJson
		);
	},
	_callback_checkVIPKitJson : function(json){
		var mbrGradeCD = $.trim($("#mbrGradeCD").val());
		
		var url = location.href;
		
		if(json.ret == "0"){
			//VVIP :  mbrGradeCD == '5'
			alert("정상적으로 신청되었습니다. 6/5(수) 당첨자 안내를 기다려주세요!");
			location.href = url;
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
            alert("아쉽지만 고객님께서는 \"일반\"등급으로 신청 대상이 아닙니다.");
            return false;
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
    checkStore : function() {
    	var strNo = $("#storeNmList option:selected").val();
        
        if (strNo != 'none'){
    		$("#storeID").val(strNo);
        }else{
        	$("#storeID").val('');
        }

    	var storeID = $("#storeID").val();
    	
        if(storeID == ''){
            alert("항목을 빠짐없이 선택 후, 신청해 주세요. ");
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

            if(!$("#chk01").is(":checked")){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	VipKitEvent.detail.mbrInfoUseAgrYn = 'Y';
            }
        }else{
        	VipKitEvent.detail.mbrInfoUseAgrYn = 'N';
        }


        if(regYn == 'Y' && mbrInfoThprSupAgrYn == 'Y'){
            if(!$("#chk02").is(":checked")){
                alert("개인정보 취급 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	VipKitEvent.detail.mbrInfoThprSupAgrYn = 'Y';
            }
        }else{
        	VipKitEvent.detail.mbrInfoThprSupAgrYn = 'N';
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
 itemChange : function(){
    	
    	var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
    	
    	this._ajax.sendJSONRequest(
    				"POST"
					, _baseUrl + "storeEvent/getVIPEvtTgtrStrMainAreaList.do"
    				, param
    				, this._callback_getEvtTgtrStrMainAreaListAjax
        );
    },
    _callback_getEvtTgtrStrMainAreaListAjax : function(retData) {
        VipKitEvent.detail.makeSelectboxList1($("#mainAreaList"),_optionRgn1,retData);
    },
    makeSelectboxList1 :  function(area, title, list){
        var dispArea = area;
        var dispList = list;
        var rgn1Selected = area.attr("data-rgn1");
        
        var $option = $("<option>");
        $option.val("none").text(title).prop("selected",true);

        dispArea.empty().append($option);

        $.each(dispList, function(index, element){
            $option = $("<option>");
            $option.val(element).text(element);
            if(!common.isEmpty(rgn1Selected)){
                if(rgn1Selected == element){
                    $option.prop("selected", "true");
                }
            }
            dispArea.append($option);
        });
        VipKitEvent.detail.itemChange1();
    },
   itemChange1 : function(){
    	
    	var rgn1 = $("#mainAreaList option:selected").val();
    	
    	var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , rgn1 : $("#mainAreaList").val()
		};
    	
    	this._ajax.sendJSONRequest(
    				"POST"
					, _baseUrl + "storeEvent/getVIPEvtTgtrStrSubAreaList.do"
    				, param
    				, this._callback_getTgtrSubAreaListAjax
        );
    },
    _callback_getTgtrSubAreaListAjax : function(retData) {
        VipKitEvent.detail.makeSelectboxList2($("#subAreaList"),_optionRgn2,retData);
    },
    makeSelectboxList2 :  function(area, title, list){
        var dispArea = area;
        var dispList = list;
        
        var rgn1Selected = $("#mainAreaList").attr("data-rgn1");
        var rgn1 = $("#mainAreaList option:selected").val();
        
        var rgn2Selected = area.attr("data-rgn2");
        
        var $option = $("<option>");
        $option.val("none").text(title).prop("selected",true);

        dispArea.empty().append($option);

        $.each(dispList, function(index, element){
            $option = $("<option>");
            $option.val(element).text(element);
            if(!common.isEmpty(rgn2Selected)){
            	//지역이 다르지만 시/군/구가 동일한 명칭이 있는경우를 default값으로 세팅 하기 위해 비교
            	//서울특별시 - 중구 - 정동점으로 페이지 유입이 된 후 > 대전광역시를 클릭 하였을 때, 동일 시/군/구인 중구가 아니라 default로 셋팅
            	if(rgn1Selected == rgn1){
            		if(rgn2Selected == element){
            			$option.prop("selected",true);
            		}
            	}
            }
            
            dispArea.append($option);
        });
        VipKitEvent.detail.itemChange2();
    },
 itemChange2 : function(){
 		var rgn2 = $("#subAreaList option:selected").val();
 	
    	var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , rgn1 : $("#mainAreaList").val()
			  , rgn2 : $("#subAreaList").val()
		};
    	
            this._ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "storeEvent/getVIPEvtTgtrStrNmList.do"
                    , param
                    , this._callback_getTgtrStrNmListAjax
            );
    },
    _callback_getTgtrStrNmListAjax : function(retData) {
        VipKitEvent.detail.makeSelectboxList3($("#storeNmList"),_optionRgn3,retData);
    },
    makeSelectboxList3 :  function(area, title, list){
        var dispArea = area;
        var dispList = list;
        var rgn3Selected = area.attr("data-rgn3");
        
        var $option = $("<option>");
        $option.val("none").text(title).prop("selected",true);

        dispArea.empty().append($option);

        $.each(dispList, function(index, element){
            $option = $("<option>");
            $option.val(element.strNo).text(element.strNm);
            if(!common.isEmpty(rgn3Selected)){
                if(rgn3Selected == element.strNo){
                    $option.prop("selected",true);
                }
            }
            dispArea.append($option);
        });
    },
    checkGoldKitJson : function(){
        //GoldKit 증정 이벤트 
    		//1. 로그인여부 체크
    		if(!VipKitEvent.detail.checkLogin()){
    			return;
    		}
    		
    		//2. 회원등급체크
    		if(!VipKitEvent.detail.checkMbrGoldGradeCD()){
    			return;
    		}

    		//3. 응모기간 체크
    		if(!VipKitEvent.detail.checkRegAvailable()){
    			return;
    		}
    		
    		//4. 개인정보 수집동의 체크
    		if(!VipKitEvent.detail.checkAgrmInfo2()){
    			return;
    		}
    		
    		//5. 매장선택 체크
    		if(!VipKitEvent.detail.checkStore()){
    			return;
    		}
    		
    		var param = {
    				evtNo : $("input[id='evtNo']:hidden").val()
    			  , fvrSeq : "2"
    			  , strNo : $("input[id='storeID']:hidden").val()
    		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
    			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
    		};

    		common.Ajax.sendJSONRequest(
    				"GET"
    			  , _baseUrl + "storeEvent/regVIPKitEventJson.do"
    			  ,  param
    			  , VipKitEvent.detail._callback_checkGoldKitJson
    		);
    	},
    	_callback_checkGoldKitJson : function(json){
    		var mbrGradeCD = $.trim($("#mbrGradeCD").val());
    		
    		var url = location.href;
    		
    		if(json.ret == "0"){
    			alert("정상적으로 신청되었습니다. 8/14(수) 당첨자 안내를 기다려주세요!");
    			location.href = url;
    		}else{
    			alert(json.message);
    		}
    	},
    	checkMbrGoldGradeCD : function() {
    	        var mbrGradeCD = $.trim($("#mbrGradeCD").val());
    	        var moveKitEvtUrl = $.trim($("#moveKitEvtUrl").val())
    	        if(mbrGradeCD == '65'){
    	            alert("아쉽지만 고객님께서는 \"Baby Olive\"등급으로 신청 대상이 아닙니다.");
    	            return false;
    	        }else if(mbrGradeCD == '60'){
    	            if(!confirm("고객님께서는 \"Green Olive\"등급으로 Black·Green Olive 등급 기프트 신청이 가능합니다. 해당 페이지로 이동하시겠습니까?")){
    	                return false;
    	            }else{
    	            	common.link.commonMoveUrl(moveKitEvtUrl);
    	                return false;
    	            }
    	        }else if(mbrGradeCD == '55'){
    	        	if(!confirm("고객님께서는 \"Black Olive\"등급으로 Black·Green Olive 등급 기프트 신청이 가능합니다. 해당 페이지로 이동하시겠습니까?")){
    	                return false;
    	            }else{
    	            	common.link.commonMoveUrl(moveKitEvtUrl);
    	                return false;
    	            }
    	        }
    	        return true;
    	},
    	/* 개인정보 필수값 체크(제 3자 동의 제외) */
        checkAgrmInfo2 : function(){
            var regYn = $.trim($("#regYn").val());
            var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn").val());

            if(regYn == 'Y' && mbrInfoUseAgrYn == 'Y'){

                if(!$("#chk01").is(":checked")){
                    alert("개인정보 수집동의 항목에 동의해 주세요.");
                    return false;
                }else{
                	VipKitEvent.detail.mbrInfoUseAgrYn = 'Y';
                }
            }else{
            	VipKitEvent.detail.mbrInfoUseAgrYn = 'N';
            }

            return true;
        },
        checkBlackNGreenKitJson : function(){
            //Black & Green 증정 이벤트 
        		//1. 로그인여부 체크
        		if(!VipKitEvent.detail.checkLogin()){
        			return;
        		}
        		
        		//2. 회원등급체크
        		if(!VipKitEvent.detail.checkBlackNGreenGradeCD()){
        			return;
        		}

        		//3. 응모기간 체크
        		if(!VipKitEvent.detail.checkRegAvailable()){
        			return;
        		}
        		
        		//4. 개인정보 수집동의 체크
        		if(!VipKitEvent.detail.checkAgrmInfo2()){
        			return;
        		}
        		
        		//5. 매장선택 체크
        		if(!VipKitEvent.detail.checkStore()){
        			return;
        		}
        		
        		var param = {
        				evtNo : $("input[id='evtNo']:hidden").val()
        			  , fvrSeq : "2"
        			  , strNo : $("input[id='storeID']:hidden").val()
        		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
        			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
        		};

        		common.Ajax.sendJSONRequest(
        				"GET"
        			  , _baseUrl + "storeEvent/regVIPKitEventJson.do"
        			  ,  param
        			  , VipKitEvent.detail._callback_checkGoldKitJson
        		);
        	},
        	_callback_checkGoldKitJson : function(json){
        		var mbrGradeCD = $.trim($("#mbrGradeCD").val());
        		
        		var url = location.href;
        		
        		if(json.ret == "0"){
        			alert("정상적으로 신청되었습니다. 8/14(수) 당첨자 안내를 기다려주세요!");
        			location.href = url;
        		}else{
        			alert(json.message);
        		}
        	},
        	checkBlackNGreenGradeCD : function() {
        	        var mbrGradeCD = $.trim($("#mbrGradeCD").val());
        	        var moveKitEvtUrl = $.trim($("#moveKitEvtUrl").val())
        	        if(mbrGradeCD == '65'){
        	            alert("아쉽지만 고객님께서는 \"Baby Olive\"등급으로 신청 대상이 아닙니다.");
        	            return false;
        	        }else if(mbrGradeCD == '50'){
        	        	if(!confirm("고객님께서는 \"Gold Olive\"등급으로 Gold Olive 등급 기프트 신청이 가능합니다. 해당 페이지로 이동하시겠습니까?")){
        	                return false;
        	            }else{
        	            	common.link.commonMoveUrl(moveKitEvtUrl);
        	                return false;
        	            }
        	        }
        	        return true;
        	}
};