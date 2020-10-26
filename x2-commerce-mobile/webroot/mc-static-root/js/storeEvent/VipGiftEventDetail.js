$.namespace("giftEvt.detail");
giftEvt.detail = {
	_ajax : common.Ajax,
	snsInitYn : "Y",
	commenttype : '댓글', /* 2017.12.12  */
    mbrInfoUseAgrYn : "N",
    mbrInfoThprSupAgrYn : "N",
    regEvtStrNm : "",
    url : "",

     initSns : function(){
        url = _baseUrl + 'E.do?evtNo=' + $("#evtNo").val();
        common.sns.init( $("#bnrImgUrlAddr").val(),$("#evtNm").val(), url);
        
      },
      initEvNo : function(){
      	giftEvt.detail.evtNo = $("#evtNo").val();
      },
      
	init : function(){
		if($("input[id='reCommend']:hidden").val() != ""){
			if(!giftEvt.detail.checkLogin()){
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
            giftEvt.detail.getEventMyCommentListAjax();

        });

        /* 2017.12.12 */
        $("#commmentHeader > .tit").click(function(){
            $('#commentList').empty();
            giftEvt.detail.getEventCommentListAjax();
        });

        /* 2017.12.12 */
        $("#myCommmentHeader > .more").click(function(){
            $('#commentList').empty();
            giftEvt.detail.getEventCommentListAjax();
        });
		
        $('.btnShare').click(function(){
        	giftEvt.detail.dispSnsPopup();
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
            if(!giftEvt.detail.checkLogin()){
                return;
            }

            var regType = $(this).parent().find("input[name*='regYn']" ).val();

            if(regType == 'regWrite'){
                if(!giftEvt.detail.checkRepl()){
                    return;
                }
                
                giftEvt.detail.regEventCommentAjax();
            }else{

                if(!giftEvt.detail.checkRegAvailable()){
                    return;
                }
                if(!giftEvt.detail.checkAgrmInfo()){
                    return;
                }
                giftEvt.detail.regEventAjax();
            }

        });
        
        //매장 검색 > 직접검색 검색버튼 클릭
        $("#searchWordDiv .btn_sch").click(function(){
            // TODO 검색어에 부합하는 매장목록 AJAX를 가져와야 함.
        	giftEvt.detail.searchStoreMain();
        });
        
       //검색어 삭제 버튼 이벤트
        $('.sch_field4').find('.btn_sch_del').on({
            'click' : function(e){
                e.preventDefault();
                $(this).removeClass('on').parent().find('input[type="text"]').val('').focus();
                var _input = $(this).parent().find('input[type="text"]');
                giftEvt.detail.fnSearchSet(_input);
            }
        });
        
        // 직접검색, 판매매장 찾기 검색바 이벤트
        $('.sch_field4').find('input[type="text"]').on({
            'keyup' : function(){
            	giftEvt.detail.fnSearchSet($(this));
            },
            'focusin' : function(){
            	giftEvt.detail.fnSearchSet($(this));
            }
        });
        
        $('.layer-wrap .lay-close').on('click', function () {
    		$("#tab_lay_01").hide();
    		$("#tab_lay_01").removeClass("show");;
    	});

        giftEvt.detail.initEvNo(); /* 2017.12.12 */
        giftEvt.detail.initCommentList(); /* 2017.12.12 */
        giftEvt.detail.initSns();/* 2017.12.12 */
	},
	/* 2017.12.12 */
	initCommentList : function(){

        var rplYn = $.trim($("#rplYn1").val());
        var evtType = $("#evtType1").val();

        if(evtType == giftEvt.detail.commenttype || rplYn ==  "Y"){
        	giftEvt.detail.getEventCommentListAjax();
        }

    },
    
    /* 2017.12.12 */
    commentModifyMain : function(appenArea,bbcSeq,commentInfo){
        $("#regComment").hide();
        giftEvt.detail.makeCommentModify(commentInfo,appenArea,bbcSeq)
    },

    /* 2017.12.12 */
    cancelModifyMain : function(showArea){
        showArea.show();
        giftEvt.detail.removeCommentModify(showArea);
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
            giftEvt.detail.uptEventCommentAjax(bbcSeq,cont);
        });

        var $buttonCancel = $("<button>").addClass("btnGrayH28").text("취소");
        $divBtn.append($buttonCancel);
        $buttonCancel.click(function(){
            if(!confirm("댓글 수정을 취소하시겠습니까?")){
                return;
            }

            $(this).parent().parent().empty();
            giftEvt.detail.cancelModifyMain(showArea);
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
                          evtNo : giftEvt.detail.evtNo,
                          pageIdx    : PagingCaller.getNextPageIdx() // 페이징 인덱스
                  };
                  common.Ajax.sendRequest(
                          "GET"
                          , _baseUrl + "event/getEventCommentListJson.do"
                          , param
                          , giftEvt.detail._callback_getEventCommentListAjax);
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

                if(rplYn == 'Y' && type != giftEvt.detail.commenttype && $.trim(element.myCommentFlag) == 'Y'){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	giftEvt.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	giftEvt.detail.delEventCommentAjax(element.bbcSeq);
                    });
                    $divBox.append($buttonCancel);
                }

            });
        }

    },

    /* 2017.12.12 */
    getEventMyCommentListAjax : function(){

        // 로그인 체크
        if(!giftEvt.detail.checkLogin()){
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

                if(type != giftEvt.detail.commenttype){
                    var $divBox = $("<div>").addClass("btn_box");
                    $li.append($divBox);

                    var $buttonModify = $("<button>").addClass("btnGrayH28").text("수정");
                    $buttonModify.click(function(){
                    	giftEvt.detail.commentModifyMain($(this).parent().parent(),element.bbcSeq,fcont);
                    });
                    $divBox.append($buttonModify);

                    var $buttonCancel = $("<button>").addClass("btnGrayH28").text("삭제");
                    $buttonCancel.click(function(){
                    	giftEvt.detail.delEventCommentAjax(element.bbcSeq);
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

        if(!giftEvt.detail.checkCommentInfo(bbcFcont)){
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

        if(!giftEvt.detail.checkCommentInfo(bbcFcont)){
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
	/* 개인정보 필수값 체크(제 3자 동의 제외) */
    checkAgrmInfo : function(){
        var regYn = $.trim($("#regYn").val());
        var mbrInfoUseAgrYn = $.trim($("#mbrInfoUseAgrYn").val());

        if(regYn == 'Y' && mbrInfoUseAgrYn == 'Y'){

            if(!$("#chk01").is(":checked")){
                alert("개인정보 수집 이용 동의를 하셔야 본 이벤트 참여가 가능합니다.");
                return false;
            }else{
            	giftEvt.detail.mbrInfoUseAgrYn = 'Y';
            }
        }else{
        	giftEvt.detail.mbrInfoUseAgrYn = 'N';
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
    checkMbrGradeCD : function() {
        var mbrGradeCD = $.trim($("#mbrGradeCD").val());
        var moveKitEvtUrl = $.trim($("#moveKitEvtUrl").val())
        if(mbrGradeCD == '65'){
            alert("본 이벤트는 GOLD · BLACK · GREEN OLIVE 대상의 이벤트로 BABY OLIVE 등급의 고객님은 참여하실 수 없습니다.");
            return false;
        }
        return true;
    },
	checkRegEvtStrNm : function(){
        var regEvtStrNm = $.trim($("#regEvtStrNm").val());
        var mbrGradeCD = $.trim($("#mbrGradeCD").val());
		//gold
		if(mbrGradeCD == '50'){
			$("#mbrBG").css("display","none");
		}else if(mbrGradeCD == '55' || mbrGradeCD == '60'){
			$("#mbrGold").css("display","none");
		}
        
        if(regEvtStrNm != ''){
			$('#applyTxt').html('본 이벤트에 이미 참여 하셨습니다.<br><em>응모 점포 : 올리브영 '+regEvtStrNm+'</em><br>9/10(목) 당첨자 발표 기다려주세요!<br>');
    		$("#tab_lay_01").show();
    		$("#tab_lay_01").addClass("show");

            return false;
		}
        return true;
    },
    checkVIPGiftJson : function(){

    		//1. 로그인여부 체크
    		if(!giftEvt.detail.checkLogin()){
    			return;
    		}
    		
    		//2. 회원등급체크
    		if(!giftEvt.detail.checkMbrGradeCD()){
    			return;
    		}

			//2-1. 응모 여부 체크 
    		if(!giftEvt.detail.checkRegEvtStrNm()){
    			return;
    		}

    		//3. 응모기간 체크
    		if(!giftEvt.detail.checkRegAvailable()){
    			return;
    		}
    		
    		//4. 개인정보 수집동의 체크
    		if(!giftEvt.detail.checkAgrmInfo()){
    			return;
    		}
    		
    		//5. 매장선택 체크
    		if(!giftEvt.detail.checkStore()){
    			return;
    		}
    		
    		var param = {
    				evtNo : $("input[id='evtNo']:hidden").val()
    			  , fvrSeq : "2"
    			  , strNo : $("input[id='storeID']:hidden").val()
    			  , strNm : $("input[id='storeNm']:hidden").val()
    		      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
    			  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
    		};

    		common.Ajax.sendJSONRequest(
    				"GET"
    			  , _baseUrl + "storeEvent/regVipGiftEventJson.do"
    			  ,  param
    			  , giftEvt.detail._callback_VIPGiftJson
    		);
    	},
    	_callback_VIPGiftJson : function(json){
    		var mbrGradeCD = $.trim($("#mbrGradeCD").val());
    		var strNm = $("#storeNm").val();
    		//gold
    		if(mbrGradeCD == '50'){
    			$("#mbrBG").css("display","none");
    		}else if(mbrGradeCD == '55' || mbrGradeCD == '60'){
    			$("#mbrGold").css("display","none");
    		}
    		
    		//0 : 정상 참여 , 1: 재참여
    		if(json.ret == "0"){
    			$('#applyTxt').html('<em>올리브영 '+strNm+'</em>으로 응모되었습니다.<br>9/10(목) 당첨자 발표 기다려주세요!<br>');
    			$("#tab_lay_01").show();
    			$("#tab_lay_01").addClass("show");
    			giftEvt.detail.regEvtStrNm = 'Y';
    			$("#regEvtStrNm").val(strNm);
    		}else if(json.ret == "1"){
    			$('#applyTxt').html('본 이벤트에 이미 참여 하셨습니다.<br><em>응모 점포 : 올리브영 '+json.message+'</em><br>9/10(목) 당첨자 발표 기다려주세요!<br>');
    			$("#tab_lay_01").show();
    			$("#tab_lay_01").addClass("show");
    		}else{
    			alert(json.message);
    		}
    	},
    	selectStore : function(strNm, strNo) {
        	var message = strNm + "으로 선택하시겠습니까?"
        	 if(!confirm(message)){
                 return;
             }
        	$("#storeNm").val(strNm);
        	$("#storeID").val(strNo);
        	$("#searchWord").val($("#storeNm").val());
            $("#searchWordDiv .reShop_result").remove();
            $(".box_scroll").css("display","none");

        },
    	// 매장 검색 검색바 엔터 이벤트
        searchStoreList :  function(e){
            if (e.keyCode != 13) {
                return;
            }
            e.preventDefault();

            $("#searchWord").blur();
            
            $("#searchType").val("word");
            
            giftEvt.detail.searchStoreMain();
        },
        // 검색 이벤트 발생 시 type에 따라 분기하여 리스트 불러오기
        searchStoreMain : function(){
            giftEvt.detail.getSearchWordStoreHref();
        },
        getSearchWordStoreHref : function() {
        	//1. 로그인여부 체크
    		if(!giftEvt.detail.checkLogin()){
    			return;
    		}
    		
    		//2. 회원등급체크
    		if(!giftEvt.detail.checkMbrGradeCD()){
    			return;
    		}
    		
    		//3. 매장명/주소 미입력 확인
    		var searchStr = $.trim($("#searchWord").val());
    		
    		if(common.isEmpty(searchStr)){
    			alert("매장명/주소를 입력하신 후, 검색을 진행해주세요.");
    			return;
    		}
    		
            var searchWord = $("#searchWord").val();
            
            var param = {
                	evtNo : $("input[id='evtNo']:hidden").val(),
                	searchWord : searchWord
                }
            common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "storeEvent/getStoreListJson.do"
                        , param
                        , giftEvt.detail._callback_getSearchWordStoreListAjax);
        },
        // 직접검색 매장목록 불러오기 Callback
        _callback_getSearchWordStoreListAjax : function(strData) {
        	
        	$(".noticeMsg").hide();
        	
            $("#searchWordDiv .reShop_result").remove();
           
            var $dlResult = $("<dl>").addClass("reShop_result");
            var $dtResult = $("<dt>");
            $spanCount = $("<span>").text(strData.totalCount);
            $dtResult.append($spanCount);
            $dtResult.append("개의 매장이 검색되었습니다.");
            
            $dlResult.append($dtResult);
            $("#searchWordDiv").append($dlResult);
            $("#storeListByWord").find(".mlist-reShop").empty();
                
            
            $("#noStoreList").hide();
            
            var lengh = giftEvt.detail.getLength(strData.storeList);
            if(lengh > 0){
            	giftEvt.detail.makeStoreList($("#storeListByWord").find(".mlist-reShop"),strData.storeList,"storeListByWord");
            	$(".box_scroll").css("display","block");
            	 
            	$(".box_scroll").scrollTop(0);

            }else{
            	
            	$(".box_scroll").css("display","none");
            	$("#searchWordDiv").find(".reShop_result > dt").remove();
                $("#searchWordDiv").find(".reShop_result > dd").remove();
                
                $("#noStoreList").css("display","block");    
            }
        },
     // Ajax로 가져온 매장목록을 그려줌. (직접검색, 지역검색, 관심매장)
        makeStoreList :  function(area, list,viewMode){
            var dispArea = area;
            var dispList = list;

            $.each(dispList, function(index, element){

                var $li = $("<li>");
                
                // 201912
                var idNmTxt = [element.strNo]
                idNmTxt.push("li");
                $li.attr("id",idNmTxt.join(""));
                var $divReInner = $("<div>").addClass("li_reInner");
                
                var $h4Tit = $("<h4>").addClass("tit");
                var $a = $("<a>").attr("href","javascript:giftEvt.detail.selectStore('"+element.strNm+"','"+element.strNo+"');").text(element.strNm);

                
                $h4Tit.append($a);

                $divReInner.append($h4Tit);

                var $pAddr = $("<p>").addClass("addr");
                if(!common.isEmpty(element.addr)){
                    $pAddr.text(element.addr);
                }
                $divReInner.append($pAddr);

                // 201912

                var $divArea = $("<div>").addClass("area");
                $divReInner.append($divArea);

                if(!common.isEmpty(element.phon)){
                    var $buttonCall = $("<button>").addClass("call").text(element.phon);
                    $buttonCall.click(function(){giftEvt.detail.setCallEvent($(this));});
                    $divArea.append($buttonCall);
                }

                var $inputStrNo = $("<input>").attr("type","hidden").attr("name","storeNo").val(element.strNo);

                $li.append($divReInner);
                $li.append($inputStrNo);

                dispArea.append($li);
            });
        },
        // 매장 갯수 반환
        getLength : function(list){
            var length = 0;
            if(!common.isEmpty(list)){
                length = list.length;
            }
            return length;
        },
        checkStore : function() {
        	var storeID = $("#storeID").val();
        	var strNm = $("#storeNm").val();
        	
            if(storeID == '' || strNm==''){
                alert("신청 매장을 선택 한 후, 이벤트에 응모해주세요!");
                return false;
            }else{
            	var message = "선택하신 매장은 올리브영 "+strNm +"입니다. 해당 매장으로 응모하시겠습니까?";
           	 	if(!confirm(message)){
           	 		return false;
                }
                return true;
            }
        },
        fnSearchSet : function (obj){
            if(obj.val() != '' && obj.val() != null){
                obj.parent().find('.btn_sch_del').addClass('on');
            }
            else{
                obj.parent().find('.btn_sch_del').removeClass('on');
            }
        },
        // 전화 아이콘 클릭 이벤트
        setCallEvent :  function(obj){
            var phoneNum = obj.text();
            $(location).attr('href', "tel:"+ phoneNum);
        },
};