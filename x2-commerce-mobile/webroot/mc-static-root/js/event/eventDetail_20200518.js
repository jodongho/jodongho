/**
 * 배포일자 : 2020-05-14
 * 오픈일자 : 2020-05-18
 * 이벤트명 : 5월 유튜브 신청 이벤트
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	layerPolice : false,
	noteCont : null,
	init : function(){
		//지원하기
		$(".popForm1").click(function(){
			monthEvent.detail.checkTopReviewerApply();
		});

		//제출하기
		$(".userSubmit").click(function(){
			monthEvent.detail.confirmCheck();
		});

		$("input").each(function(){
			$(this).bind("focus", function(){
			//	$(".header").css("position", "absolute");		
				$('html, body').animate({scrollTop: '0'}, 1);
				$(".eventLayer.popUser").css("position", "absolute");
			});

			$(this).bind("blur",function(){
				$(".eventLayer.popUser").css("position", "fixed");
			});
		});

		//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });
	},

	//응모여부조회
	checkTopReviewerApply : function(){
		if(!common.isLogin()){
			common.link.moveLoginPage();
			return;
		}
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
        	,fvrSeq : "1"
        	, strtDtime : $("input[id='strtDtime']:hidden").val()
		    , endDtime : $("input[id='endDtime']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20200518/checkTopReviewerApply.do"
       	   , param
       	   , monthEvent.detail._callback_checkTopReviewerApply
        );
    },

    _callback_checkTopReviewerApply : function(json){
        if(json.ret == "0"){
        	mevent.detail.eventShowLayScroll('popForm1');	//지원서 팝업
        }else if(json.ret == "99"){	//대상 아닐때
        	mevent.detail.eventShowLayScroll('popEvt1');	//탑리뷰어 도전
        }else if(json.ret == "-1"){
        	common.link.moveLoginPage();
    	}else{
        	alert(json.message);
        }
    },

    //제출서 체크
	confirmCheck : function(){
		if(!mevent.detail.checkLogin()){
            return;
        }
		var question1 = $.trim($("#question1").val()).replace(/\|/gi, "");
		var question2 = $.trim($("#question2").val()).replace(/\|/gi, "");
		var question3 = $(':radio[name="question3"]:checked').val();
		var question4 = $.trim($("#question4").val()).replace(/\|/gi, "");
		var question5 = $.trim($("#question5").val()).replace(/\|/gi, "");
		var question6 = $(':radio[name="question6"]:checked').val();
		var question7 = $(':radio[name="question7"]:checked').val();

		if(question1 == "" || question2 == "" || question3 == undefined || (question3 == "4" && question4 == "") || question5 == "" || question6 == undefined || question7 == undefined){
			alert("모든 항목을 작성해주세요");
			return;
		}
		if(question3 != "4"){
			question4 = "선택";
		}

		monthEvent.detail.noteCont = question1 + "|" + question2 + "|" + question3 + "|" + question4 + "|" + question5 + "|" + question6 + "|" + question7;

		if(confirm("제출하시면 수정 및 재 확인이 어렵습니다. 최종 제출하시겠어요?")){
			mevent.detail.eventCloseLayer();
			monthEvent.detail.recheck();
		}
    },

    //응모여부조회
	recheck : function(){
		if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
        	,fvrSeq : "1"
        	, strtDtime : $("input[id='strtDtime']:hidden").val()
    		, endDtime : $("input[id='endDtime']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20200518/checkTopReviewerApply.do"
       	   , param
       	   , monthEvent.detail._callback_recheck
        );
    },

    _callback_recheck : function(json){
        if(json.ret == "0"){
        	$(".agreeBtn").attr("onclick", "monthEvent.detail.topReviewerApply();");
        	mevent.detail.eventShowLayScroll('eventLayerPolice');	//위수탁동의 팝업
        	monthEvent.detail.layerPolice = true;
            $(".agreeCont")[0].scrollTop = 0;
        }else if(json.ret == "99"){	//대상 아닐때
        	mevent.detail.eventShowLayScroll('popEvt1');	//탑리뷰어 도전
        }else if(json.ret == "-1"){
    		if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
    	}else{
        	alert(json.message);
        }
    },

    topReviewerApply : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
        var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

        if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
            alert("2가지 모두 동의 후 참여 가능합니다.");
            return;
        }

        if("Y" != mbrInfoUseAgrYn){
            monthEvent.detail.layerPolice = false;
            mevent.detail.eventCloseLayer();
            return;
        }
        if("Y" != mbrInfoThprSupAgrYn){
            monthEvent.detail.layerPolice = false;
            mevent.detail.eventCloseLayer();
            return;
        }

        monthEvent.detail.layerPolice = false;
        mevent.detail.eventCloseLayer();
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "1"
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
              , noteCont : monthEvent.detail.noteCont
              , strtDtime : $("input[id='strtDtime']:hidden").val()
      		  , endDtime : $("input[id='endDtime']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "POST"
              , _baseUrl + "event/20200518/topReviewerApply.do"
              , param
              , monthEvent.detail._callback_topReviewerApply
        );
    },

    _callback_topReviewerApply : function(json){
        if(json.ret == "0"){
        	mevent.detail.eventShowLayScroll("popGift1");
        }else if(json.ret == "99"){	//대상 아닐때
        	mevent.detail.eventShowLayScroll('popEvt1');	//탑리뷰어 도전
        }else if(json.ret == "-1"){
    		if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
    	}else{
        	alert(json.message);
        }

    }
}