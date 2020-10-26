$.namespace("vote.display");
vote.display = {
        
    tgtrSaveChk : true,
    voteOldDbChk : true,
    init : function(){
        
        //history.pushState({status:"MCategoryMain"},null,null);
        
        /*if (history.state == null) {
            //history state 추가
            history.replaceState({status:"entry"}, null, null);
            history.pushState({status:"MCategoryMain"},null,null);
        }*/
    	//기프트관 2차 이벤트 이벤트 기간에만 스탬프 표시
    	var currentDtime = $("#currentDtime").val();
        var startDtime = "";
        var endDtime = "";
        if($("#profile").val()  == "prod"){	//운영기간 설정
        	startDtime = $("#evtStartDate").val();
        	evtEndDate = $("#evtEndDate").val();
        }else{	//그외 기간
        	startDtime = $("#evtStartDateQa").val();
        	evtEndDate = $("#evtEndDateQa").val();
        }
        //이벤트 기간에만 스탬프 표시
        if(currentDtime >= startDtime && currentDtime <= evtEndDate){
        	$(".fix_flow").show();
        }
        
        vote.display.bindEvent();
        
        vote.display.bindWebLog();
        
        // 이미투표한 투표는 라디오 버튼 선택하지 못하게 제어함
        $(".vote_list").each(function(){
            if($(this).hasClass("check")){
                $("input:radio", $(this)).prop("disabled", true);
            }
            
        });
        
        vote.display.tagScroll();
        
        $(".btnCont").click(function(){
        	if(common.isLogin()){
        		vote.display.addStamp('2');
        	}else{
        		vote.display.popLayerOpen('lay_giftEvt01');
        	}
        });
        
        $(".btn_gclose").click(function(){
        	$(".fix_flow").hide();
        });
    }
    , giftVoteInit : function(){
        
        vote.display.bindEvent();
        
        vote.display.bindWebLog();
        
    }
    , bindEvent : function() {
        
        $(".voteClick").click(function(){
            if(vote.display.doubleClickCheck()){
                vote.display.tgtrSaveChk = false;
                
                var voteNo = $(this).parents("div").attr("vote-no");
                
                var voteWrap = $(".vote_list_"+voteNo);
                var rdName = $("input:radio", voteWrap).attr("name");
                
                var chkRadioVal = $("input:radio[name=gift_vote_0]:checked").val();  // 선택한 상품 키코드
                var rdValWrap = $("input:radio[name=gift_vote_0]:checked").closest(".rd"); // 선택한 영역의 상품 데이터
                var rdVoteSortSeq = $("input[name=rdVoteSortSeq]", rdValWrap).val();    // 상품순번 
                var rdVoteRound   = $("input[name=rdVoteRound]").val();      // 투표회차
                var rdGoodsNo     = $("input[name=rdGoodsNo]", rdValWrap).val();        // 상품번호
                var rdLgcGoodsNo  = $("input[name=rdLgcGoodsNo]", rdValWrap).val();     // 상품마스터번호
                var rdVoteSeq  = $("input[name=rdVoteSeq]", rdValWrap).val();     // 상품마스터번호
                
                // 이미 투표한경우 투표 중복 투표 못하게 제어
                
                if(voteWrap.hasClass("check")){
                    alert("이미 투표에 참여하셨습니다. 다음에 새로운 투표를 기대해주세요!");
                    vote.display.tgtrSaveChk = true;
                    vote.display.getVoteHistList("voteSave");
                    return false;
                }
                // 로그인체크
                if(common.isLogin()){
                    
                    // 선택한 항목이 없는경우
                    if(!$("input:radio[name="+rdName+"]").is(":checked")){
                        alert("투표하실 상품을 선택해주세요");
                        vote.display.tgtrSaveChk = true;
                        return false;
                    }
                    
                    var url = _baseUrl+"vote/saveVoteTgtrInfoAjax.do"
                    var data = {
                            voteNo : voteNo
                            , voteSeq : chkRadioVal
                            , voteSortSeq : rdVoteSortSeq
                            , voteRound : rdVoteRound
                            , goodsNo : rdGoodsNo
                            , lgcGoodsNo : rdLgcGoodsNo
                    };
                    
                    common.showLoadingLayer(false);
                    common.Ajax.sendRequest("POST", url, data, vote.display.tgtrSaveCallback);
                } else {
                    alert("로그인 후 투표에 참여해주세요");
                    vote.display.tgtrSaveChk = true;
                    common.link.moveLoginPage();
                }
            }
            
            
        });
        
        $(".voteResultBack").click(function(){
        	//vote.display.goVoteHist($(this).parents('div').attr("vote-no"));
            
            vote.display.getVoteHistList("voteResultBack");
            
        });
        
        $(".voteResult").click(function(){
            //vote.display.goVoteHist($(this).parents('div').attr("vote-no"));
            
            vote.display.getVoteHistList("voteResult");
            
        });
        
        $(".giftVoteClick").click(function(){
            if(vote.display.doubleClickCheck()){
                vote.display.tgtrSaveChk = false;
                
                var voteNo = $(this).parents("div").attr("vote-no");
                
                var voteWrap = $(".vote_list_"+voteNo);
                var rdName = $("input:radio", voteWrap).attr("name");
                
                var chkRadioVal = $("input:radio[name="+rdName+"]:checked").val();  // 선택한 상품 키코드
                var rdValWrap = $("input:radio[name="+rdName+"]:checked").closest(".rd"); // 선택한 영역의 상품 데이터
                var rdVoteSortSeq = $("input[name=rdVoteSortSeq]", rdValWrap).val();    // 상품순번 
                var rdVoteRound   = $("input[name=rdVoteRound]", rdValWrap).val();      // 투표회차
                var rdGoodsNo     = $("input[name=rdGoodsNo]", rdValWrap).val();        // 상품번호
                var rdLgcGoodsNo  = $("input[name=rdLgcGoodsNo]", rdValWrap).val();     // 상품마스터번호
                var rdVoteSeq  = $("input[name=rdVoteSeq]", rdValWrap).val();     // 상품마스터번호
                
                // 이미 투표한경우 투표 중복 투표 못하게 제어
                if(voteWrap.hasClass("check")){
                    alert("이미 투표에 참여하셨습니다. 다음에 새로운 투표를 기대해주세요!");
                    vote.display.tgtrSaveChk = true;
                    
                    vote.display.getGiftVoteTgtrList(voteNo);
                    
                    return false;
                }
                
                // 로그인체크
                if(common.isLogin()){
                    
                    // 선택한 항목이 없는경우
                    if(!$("input:radio[name="+rdName+"]").is(":checked")){
                        alert("투표하실 상품을 선택해주세요");
                        vote.display.tgtrSaveChk = true;
                        return false;
                    }
                    
                    //20200904 미니투표바에서 투표하기 누를 시 CBLIM
                	if(this.value == "giftMainVote"){
                		sessionStorage.setItem("giftMainVoteCheck", "giftMainVoteCheck");
                	}
                    //20200904 미니투표바에서 투표하기 누를 시 CBLIM
                    
                    var url = _baseUrl+"vote/saveVoteTgtrInfoAjax.do"
                    var data = {
                            voteNo : voteNo
                            , voteSeq : chkRadioVal
                            , voteSortSeq : rdVoteSortSeq
                            , voteRound : rdVoteRound
                            , goodsNo : rdGoodsNo
                            , lgcGoodsNo : rdLgcGoodsNo
                    };
                    
                    common.showLoadingLayer(false);
                    common.Ajax.sendRequest("POST", url, data, vote.display.giftTgtrSaveCallback);
                } else {
                    alert("로그인 후 투표에 참여해주세요");
                    vote.display.tgtrSaveChk = true;
                    
                    var param = "";

                    
                    sessionStorage.setItem("sessionVoteLoginChk", true);
                    
                    if(location.href.indexOf("getGiftMainList") > 0){
                        param = "?voteLoginChk=true";
                        common.link.moveLoginPage('', location.href.substring(0, location.href.indexOf("#"))+param);
                        
                    } else {
                        param = "&voteLoginChk=true";
                        common.link.moveLoginPage('', location.href+param);
                    }
                }
            }
            
            
        });
        
    }
    , bindWebLog : function() {
        
        $(".goGiftMain").bind("click", function() {
            common.wlog("vote_go_gift");
        });
        
        $(".voteClick").bind("click", function() {
            common.wlog("vote_goods_choice");
        });
        
        $(".voteResult").bind("click", function() {
            common.wlog("vote_history_result");
        });
        
        $(".voteResultBack").bind("click", function() {
            common.wlog("vote_history_back");
        });
        
        $(".goVoteGoods0").bind("click", function() {
            common.wlog("vote_goods_view_1");
        });
        $(".goVoteGoods1").bind("click", function() {
            common.wlog("vote_goods_view_2");
        });
        $(".goVoteGoods2").bind("click", function() {
            common.wlog("vote_goods_view_3");
        });
        $(".goVoteGoods3").bind("click", function() {
            common.wlog("vote_goods_view_4");
        });
        $(".goVoteGoods4").bind("click", function() {
            common.wlog("vote_goods_view_5");
        });
        // 투표테마 클릭
        $("#vote_theme_list li:eq(0) > a").bind("click", function() {
            common.wlog("gift_vote_theme_all");
        });
        $("#vote_theme_list li:eq(1) > a").bind("click", function() {
            common.wlog("gift_vote_theme1");
        });
        $("#vote_theme_list li:eq(2) > a").bind("click", function() {
            common.wlog("gift_vote_theme2");
        });
        $("#vote_theme_list li:eq(3) > a").bind("click", function() {
            common.wlog("gift_vote_theme3");
        });
        $("#vote_theme_list li:eq(4) > a").bind("click", function() {
            common.wlog("gift_vote_theme4");
        });
        $("#vote_theme_list li:eq(5) > a").bind("click", function() {
            common.wlog("gift_vote_theme5");
        });
        $("#vote_theme_list li:eq(6) > a").bind("click", function() {
            common.wlog("gift_vote_theme6");
        });
        $("#vote_theme_list li:eq(7) > a").bind("click", function() {
            common.wlog("gift_vote_theme7");
        });
        $("#vote_theme_list li:eq(8) > a").bind("click", function() {
            common.wlog("gift_vote_theme8");
        });
        $("#vote_theme_list li:eq(9) > a").bind("click", function() {
            common.wlog("gift_vote_theme9");
        });
        $("#vote_theme_list li:eq(10) > a").bind("click", function() {
            common.wlog("gift_vote_theme10");
        });
        $("#vote_theme_list li:eq(11) > a").bind("click", function() {
            common.wlog("gift_vote_theme11");
        });
        $("#vote_theme_list li:eq(12) > a").bind("click", function() {
            common.wlog("gift_vote_theme12");
        });
        $("#vote_theme_list li:eq(13) > a").bind("click", function() {
            common.wlog("gift_vote_theme13");
        });
        $("#vote_theme_list li:eq(14) > a").bind("click", function() {
            common.wlog("gift_vote_theme14");
        });
        $("#vote_theme_list li:eq(15) > a").bind("click", function() {
            common.wlog("gift_vote_theme15");
        });
    }
    , tgtrSaveCallback : function(res){
        var voteNo = res.voteNo;
        var voteWrap = $(".vote_list_"+voteNo);
        
        if(res.result == "success"){
            // 투표완료후 후처리 필요
            //alert("투표가 완료되었습니다"); 191218 윤재화님 요청으로 alert 삭제 투표 완료후 히스토리 페이지로 이동
            vote.display.tgtrSaveChk = true;
            //vote.display.goVoteHist(voteNo);
            vote.display.getVoteHistList("voteSave");
            
        } else if(res.result == "fail"){    // fail인경우는 exception 발생했을경우...
            // res.result가 fail 인경우 투표를 막는 제어
            alert("이미 투표에 참여하셨습니다. 다음에 새로운 투표를 기대해주세요!");
            vote.display.tgtrSaveChk = true;
            // 이미 투표가 완료되었기 때문에 투표완료 데이터 가져옴
            vote.display.getVoteHistList("voteSave");
            
        } else if(res.result == "login"){   // 비로그인경우 
            alert(res.message);
            vote.display.tgtrSaveChk = true;
            common.link.moveLoginPage();
            
        } else {
            alert(res.message);
            vote.display.tgtrSaveChk = true;
            
        }
        
        voteWrap.removeClass("nonChk");
        voteWrap.addClass("check");
        $("input:radio", voteWrap).prop("disabled", true);
        // 투표완료후 로딩바 하이드
        common.hideLoadingLayer();
    }
    
    , giftTgtrSaveCallback : function(res){
        var voteNo = res.voteNo;
        var voteWrap = $(".vote_list_"+voteNo);
        
        if(res.result == "success"){
            // 투표완료후 후처리 필요
            //alert("투표가 완료되었습니다"); 191218 윤재화님 요청으로 alert 삭제 투표 완료후 히스토리 페이지로 이동
            vote.display.tgtrSaveChk = true;
            
            //20200904 투표 순위 업데이트를 위한 기프트관 메인 추가 호출 CBLIM
        	if(sessionStorage.getItem("giftMainVoteCheck") == "giftMainVoteCheck"){
        		$("#giftSticky").empty();
                display.gift.getVoteInfo("Y");
                $('.score_wrap').attr('class','score_wrap on');
        		sessionStorage.removeItem("giftMainVoteCheck");
        	}
            //20200904 투표 순위 업데이트를 위한 기프트관 메인 추가 호출 CBLIM
            
            // 투표후에는 버튼삭제 기획서 내용에 있음
            $(".giftVoteClick").remove();
            
        } else if(res.result == "fail"){    // fail인경우는 exception 발생했을경우...
            // res.result가 fail 인경우 투표를 막는 제어
            alert("이미 투표에 참여하셨습니다. 다음에 새로운 투표를 기대해주세요!");
            vote.display.tgtrSaveChk = true;
            
        } else if(res.result == "login"){   // 비로그인경우 
            alert(res.message);
            vote.display.tgtrSaveChk = true;
            common.link.moveLoginPage();
            
        } else {
            alert(res.message);
            vote.display.tgtrSaveChk = true;
            
        }
        
        voteWrap.removeClass("nonChk");
        voteWrap.addClass("check");
        $("input:radio", voteWrap).prop("disabled", true);
        
        vote.display.getGiftVoteTgtrList(voteNo);
        
    }
   , getGiftVoteTgtrList : function(voteNo){
       var param = {
               voteNo : voteNo
       };
       
       common.Ajax.sendRequest(
               "GET"
               , _baseUrl + "vote/getDispVoteTgtrListAjax.do"
               , param
               , function(tgtrRes){
                   
                   var resultList = tgtrRes.dispVoteTgtrlist;
                   var maxCnt = tgtrRes.maxVoteMbrCnt;
                   var checkVoteSeq = tgtrRes.checkVoteSeq;
                   
                   // 다음주에 오픈해야지~
                   for (var i = 0; i < resultList.length; i++) {
                       var tgtrHtml = "";
                       tgtrHtml += "<div class='bar'><span style='width:"+resultList[i].voteRate+"%'>&nbsp;</span></div><p class='score'>"+resultList[i].voteRate+"%</p>";
                       
                       $(".lb_"+resultList[i].voteSeq).append(tgtrHtml);
                       
                       // 가장 높은 투표에 빨강색표시
                       if(resultList[i].voteMbrCnt == maxCnt){
                           $(".lb_"+resultList[i].voteSeq).addClass("voteChkOn");
                       }
                       
                   }
                   
                   var rdId = $(".giftChecked").attr("id");
                   
                   //$("input:radio[id='"+rdId+"']").prop("checked", true);
                   
                   var voteWrap = $(".vote_list_"+voteNo);
                   var rdName = $("input:radio", voteWrap).attr("name");
                   
                   $('input:radio[name='+rdName+']:input[value=' + checkVoteSeq + ']').attr("checked", true);
                   
                   $(".vote_list").each(function(){
                       $("input:radio", $(this)).prop("disabled", true);
                   });
                   
                   // 가장 높은 투표에 빨강색표시
                   $(".voteChkOn").closest("li").addClass("on");
                   
                   $(".giftVoteClick").remove();
                   
                   
                   // 투표완료후 로딩바 하이드
                   common.hideLoadingLayer();
               }
       );
   } 
   , doubleClickCheck : function(){
        if(vote.display.tgtrSaveChk){
            return vote.display.tgtrSaveChk;
        }else{
            vote.display.tgtrSaveChk = false;
            return false;
        }
    }
   ,goVoteHist(voteNo){
	   var dispCatNo = $('#dispCatNo').val();
	   if(dispCatNo != null && dispCatNo.length > 0 ){
		   location.href = _plainUrl + "vote/getVoteHistList.do?voteNo="+voteNo+"&dispCatNo="+dispCatNo+"&themeType=GIFTONE";
	   }else{
		   location.href = _plainUrl + "vote/getVoteHistList.do?voteNo="+voteNo+"&themeType=searchAll";
	   }
   }
   ,voteHistBack(){
	   //history.back();
       location.href = _plainUrl + "vote/getVoteMainList.do";
   }
   , goGiftListMove : function(){
       var dispCatNo = $('#dispCatNo').val();
	   if(dispCatNo != null && dispCatNo.length > 0 ){
		   location.href = _plainUrl + "main/getGiftMainSearchList.do?dispCatNo="+dispCatNo+"&themeType=GIFTONE";
	   }else{
		   location.href = _plainUrl + "main/getGiftMainSearchList.do?themeType=searchAll";
	   }
	},

//   , goGiftSearchListMove : function(dispCatNo, dispContType){ // dispContType 타입은 전체를 선택했는지 하나를 선택했는지 판단할 예정
//	    
//	    var param = "?dispCatNo=" + dispCatNo;
//      
//      location.href = _plainUrl + "main/getGiftMainSearchList.do" + param;
//	    
//	}

	tagScroll : function() {
		setTimeout(function(){
			var _tagScroll = $('#tagScroll'), _ulH = $('#tagScroll').find('ul').height();
			vote.display.checkWidth(_ulH);
		}, 200);
	},
	
	checkWidth : function(h){
		var _h = h, _tagScroll = $('#tagScroll'), _list = _tagScroll.find('li');
		
		_list.each(function(index){
			var _tw = $(this).width();
			var _tagScroll = $('#tagScroll');
			var _tagScrollH = $('#tagScroll').height();
			var _ul = $('#tagScroll').find('ul');
			var _ulw = _ul.width();
		
			if(_tagScrollH > _h){
				_ul.css('width', _ulw + _tw);
			}
		});
	},
	getDispVoteOldList : function (currentPage) {
	    
	    // 더보기 클릭시 DS추가
	    common.wlog("gift_vote_hist_more");
	    
	    // 투표 더보기 버튼이 순간 활성화된것으로 보인다는 결함으로 
	    // 투표 더보기 엑션전 무조건 더보기는 숨김
	    $("#vote_more_list_btn").hide();
	    
		if (currentPage === undefined || currentPage == "") {
			var currentPage = parseInt($("input:hidden[id='currentpage']","#pageForm").val()) + 1;
		}

		var voteCdData = [];
		$("#vote_theme_list li a").each(function(idx) {
			if ($(this).hasClass("on") && $(this).data("vote-cd") != "0") {
				voteCdData.push($(this).data("vote-cd"));
			}
		});
		
		var yearData = [];
		$('#allYear .list a').each(function(idx) {
			if ($(this).hasClass("on")) {
				yearData.push($(this).data("year"));
			}
		});
		
		var sortData = "";
		$('#sortSelect li a').each(function(idx) {
			if ($(this).hasClass("on")) {
				sortData = $(this).data("sort-sel");
			}
		});

		var param = {
			voteThemeCd   : voteCdData.toString(),
			currentPage   : currentPage,
			voteStrtDtime : yearData.toString(),
			sortSel       : sortData
		};
		
		$.ajax({
			type  : 'POST',
			url	  : '/m/vote/getDispVoteOldListAjax.do',
			data  : param,
			cache : false,
			async : true,
			dataType: "html",
			beforeSend : function(xhr) {
				//$("#vote_more_list_btn").show();
				/*$(".past_survey_box #box_loop").each(function(idx) {
					if($(this).hasClass('open')){
						$(this).removeClass("open");
					}
				});*/
			},
			
			success : function(data, textStatus, jqXHR) {
				try {
					var obj = $.parseJSON(data);
					if (obj.succeeded == false) {
						alert("조회 중 오류가 발생 하였습니다.\n잠시후 다시 시도해 주세요.");
					}
				} catch (e) {
					if (currentPage == 1) {
						$(".past_survey_box").html(data);
					} else {
						$(".past_survey_box").append(data);
					}
					vote.display.voteOldDbChk = true;
					
					// 기프트관에서 투표로 오는경우 키워드영역으로 이동
			        if(sessionStorage.getItem("goGiftVote") == "goGiftVote"){
			            setTimeout(function() {
			            	
			            	//20200903 선물 투표하러 가볼까요? 에서 접근 시 로직 추가 CBLIM
			            	if(sessionStorage.getItem("goGiftVoteCheck") == "goGiftVoteCheck"){
			            		sessionStorage.removeItem("goGiftVoteCheck");
			            	}
			            	else{
	    		                var kyArea = ($('div.keywordArea').offset().top)+10; //20200908 투표페이지 진입 시 위치 수정 
	    		                $('html,body').scrollTop(kyArea);
			            	}
			            	//20200903 선물 투표하러 가볼까요? 에서 접근 시 로직 추가 CBLIM
    		                // 한번사용하면 다시 해당페이지를 로딩해도 이동하지 않기를 바라는 
    		                // 대다한 QC이달문님의 의도로 추가함
    		                sessionStorage.removeItem("goGiftVote");
			            }, 400);
			        }
				}
			},
			
			complete : function (xhr, status) {
				setTimeout(function() {
					
					$("input:hidden[id='currentpage']","#pageForm").val(currentPage);
					
					var totalCount  = 1;
					var rowsPerPage = 1;
					
					if($("#box_loop").last().data("totalcount") != null && $("#box_loop").last().data("totalcount") != ""){
					    totalCount  = parseInt($("#box_loop").last().data("totalcount"));
					}
					
					if($("#box_loop").last().data("rowsperpage") != null && $("#box_loop").last().data("rowsperpage") != ""){
					    rowsPerPage = parseInt($("#box_loop").last().data("rowsperpage"));
					}
					
					var totalPage   = Math.ceil(totalCount / rowsPerPage);
					
					/* 기본적으로 버튼이 show되어 있는 상태에서 더보기 체크
					 if (currentPage >= totalPage) {
						$("#vote_more_list_btn").hide();
					}*/
					
					// 1개일경우 클래스추가
					if(totalCount == 1){
					    $(".past_survey_box").addClass("one");
					} else {
					    $(".past_survey_box").removeClass("one");
					}
					
					if (totalPage > currentPage ) {
					    $("#vote_more_list_btn").show();
					} else if (totalPage == currentPage ) {
                        $("#vote_more_list_btn").hide();
                    }
					
					//운영 반영시 반드시 삭제
					/*console.log("--------------------------------------");
					console.log("Paging      : " + currentPage + " / " + totalPage);
					console.log("currentPage : " + currentPage);
					console.log("totalPage   : " + totalPage);
					console.log("voteThemeCd : " + voteCdData.toString());
					console.log("totalCount  : " + totalCount);
					console.log("rowsPerPage : " + rowsPerPage);
					console.log("voteStrtDtime : " + yearData.toString());
					console.log("sortSel : " + sortData);*/
					
				}, 200);
				
			},
			error : function (jqXHR, textStatus, errorThrown) {
			}
		});
	},
	voteThemeHistClick : function(obj){
	    
	    if(vote.display.voteOldDbChk){
	        vote.display.voteOldDbChk = false;
	        
	        var offCount = 0;
	        
	        if ($(obj).data("vote-cd") == "0") {
	            $(obj).addClass("on");
	            $("#vote_theme_list li a").each(function(idx) {
	                if (idx > 0) {
	                    $(this).removeClass("on");
	                }
	            });
	        } else {
	            $("#vote_theme_list li a").first().removeClass("on");
	            if ($(obj).hasClass("on")) {
	                $(obj).removeClass("on");
	            } else {
	                $(obj).addClass("on");
	            }
	        }
	        
	        $("#vote_theme_list li a").each(function(idx) {
	            if (!$(this).hasClass("on")) {
	                offCount++;
	            }
	        });
	        
	        if (offCount == $("#vote_theme_list li a").length) {
	            $("#vote_theme_list li a").first().addClass("on");
	        }
	        
	        vote.display.getDispVoteOldList(1);
	    }
	    
	    
	}
	
	, voteHistClick : function (obj){
	    
	    // DS에서 사용함
	    var oldVoteSeq = $(obj).attr("old_vote_seq");
	    common.wlog("gift_vote_hist"+oldVoteSeq);
	    
	    if($(obj).parent().hasClass('open')){
            $(obj).parent().removeClass('open');
        }else{
            $(obj).parent().addClass('open');
        }
	},
	
	getVoteHistList : function (voteType) {
		var param = {
			voteNo : $("#VOTE_LIST").data("vote-no")
		};
		$.ajax({
			type  : 'POST',
			url	  : '/m/vote/getVoteHistListAjax.do',
			data  : param,
			cache : false,
			async : true,
			dataType: "html",
			beforeSend : function(xhr) {
			},
			success : function(data, textStatus, jqXHR) {
				try {
					var obj = $.parseJSON(data);
					if (obj.succeeded == false) {
						alert("조회 중 오류가 발생 하였습니다.\n잠시후 다시 시도해 주세요.");
					}
				} catch (e) {
				    
				    // 투표 테마 영역 복사
				    var voteThemeInfo =  $("#VOTE_LIST .vote_list ul li:last").html();
				    
					$("#VOTE_LIST .vote_list ul").html("");
					$("#VOTE_LIST .vote_list ul").html(data);
					
					if(voteType == "voteResult"){
					    $(".vote_list_"+$("#VOTE_LIST").data("vote-no")).removeClass("voting");
					    $(".btnBigArea:eq(0)").removeClass("aniUp5");
					    $("input:radio[name=gift_vote_0]").closest(".rd").remove();
					    $(".voteTwoSet").hide();
					    $(".voteCompl").hide();
					    $(".voteComplBack").show();
					} else if(voteType == "voteSave") {
					    $(".voteCompl").show();
					    $(".voteTwoSet").hide();
					    $(".voteComplBack").hide();
					} else if(voteType == "voteResultBack"){
					    $(".voteTwoSet").show();
                        $(".voteCompl").hide();
                        $(".voteComplBack").hide();
					    $(".voteResultBar").remove();
	                    $(".voteResultRate").remove();
	                    $("input:radio[name=gift_vote_0]").prop("disabled", false);
					}else {
					    $(".voteTwoSet").hide();
	                    $(".voteCompl").show();
	                    $(".voteComplBack").hide();
					}
					
					// 투표 테마영역 다시 넣어줌
					$(".voteThemeInfo").append(voteThemeInfo);
					
				}
			},
			complete : function (xhr, status) {
			},
			error : function (jqXHR, textStatus, errorThrown) {
			}
		});
	}, goHistoryBack : function(){
         //history.go(-1);
    }, moveGoodsDetail : function(goodsNo, prgsStatCd, trackingCd){ //tracking을 위한 수정
    	var dispCatNo = $('#dispCatNo').val();
	    if(prgsStatCd == "30" || prgsStatCd == "40"){
	        alert("판매종료된 상품입니다.");
	        return false;
	    } else {
	 	   	if(dispCatNo != null && dispCatNo.length > 11 ){
	 	   		if('90000080001' == dispCatNo.substr(0,11)){
	 	   			common.link.moveGoodsDetail(goodsNo, dispCatNo.substr(0,11), 'Gift_Vote_PROD2');
	 	   		}else{
	 	   			common.link.moveGoodsDetail(goodsNo);
	 	   		}
	  	   	}else{
	  	   		common.link.moveGoodsDetail(goodsNo, dispCatNo, trackingCd); //tracking을 위한 수정
	  	   	}
	    }
	}
    //기프트관 2차 이벤트 이벤트
    , addStamp : function(fvrSeq){
		$(".fix_flow").hide();
    	var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
            ,fvrSeq : fvrSeq
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200311/addStamp.do"
              , param
              , vote.display._callback_addStamp
        );
    }, _callback_addStamp : function(json){
        if(json.ret == "0"){
        	vote.display.popLayerOpen('lay_giftEvt02');
        }else{
            alert(json.message);
        }
    }, popLayerOpen : function(IdName){    
        var winH = $(window).height()-50; //수정함
        var popLayer = ('#'+IdName);
        $(popLayer).find('.popCont').css({'max-height': winH});

        var popPos = $(popLayer).height()/2;
        var popWid = $(popLayer).width()/2;
        $('.footerTab').hide();//추가 인큐베이팅
        //$(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)}).show().parents('body').css({'overflow' : 'hidden'});
        $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)}).show();
        $('.dim').show();
        $('.dim').bind('click', function(){
            vote.display.popLayerClose(IdName);
        });

        $(window).resize(function(){
            var winH = $(window).height()-50; //수정함
            
            $(popLayer).find('.popCont').css({'max-height': winH});
            popPos =$(popLayer).height()/2;
            popWid = $(popLayer).width()/2;
            $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)})
        });
        //sns 별도처리
        if(IdName =='SNSLAYER'){
            $(popLayer).css({'left':'0' , 'margin-left': '0'});
        };        
    }, popLayerClose : function(){
        var popLayer = $(".popLayerWrap");
        $(popLayer).hide().parents('body').css({'overflow' : 'visible'});
        $('.footerTab').show();//추가 인큐베이팅
        $('.dim').hide();
    }
};