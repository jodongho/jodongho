/**
 * 배포일자 : 2020-06-11
 * 오픈일자 : 2020-06-22
 * 이벤트명 : 6월 리뷰의 품격
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	layerPolice : false,
	noteCont : null,
	showPopForm1 : false,
	init : function(){

		monthEvent.detail.setYoutube();

		//유투브 플레이어
		$('.eventHideLayer').click(function() {
			monthEvent.detail.setYoutube();
		});

		//지원서 닫기
		$("#popForm1 .close").click(function(){
			if(monthEvent.detail.showPopForm1){
				alert('아직 지원서를 제출하지 않으셨어요. 작성 후, 아래에 있는 제출하기 버튼을 꼭 눌러주세요!');
			}
			monthEvent.detail.eventCloseLayer();
		});

		//지원하기
		$(".popForm1").click(function(){
			monthEvent.detail.checkTopReviewerApply();
		});

		//제출하기
		$(".userSubmit").click(function(){
			monthEvent.detail.confirmCheck();
		}); 

		$("input").bind("click", function(){
		//	$(".header").css("position", "absolute");		
	 	//	$('html,body').scrollTop('0'); 
		 	$('html, body').animate({scrollTop: '0'}, 0);
			$(".eventLayer.popUser").css("position", "absolute");
		//	$(".eventLayer.popUser").css({'position':'absolute', 'top':'50%'});

			monthEvent.detail.showPopForm1 = true;
			if('question1_txt' == $(this).attr('id')){
				$('[name=question1]:first').attr("checked", true);
			}else if('question2_txt' == $(this).attr('id')){
				$('[name=question2]:first').attr("checked", true);
			}else if('question3_txt' == $(this).attr('id')){
				$('[name=question3]:last').attr("checked", true);
			}
		});

		$("input").bind("blur",function(){
			$(".eventLayer.popUser").css("position", "fixed");
		});

		//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                monthEvent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });
	},

	//응모여부조회
	checkTopReviewerApply : function(){
		if(!common.isLoginForEvt()){
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
       	   , _baseUrl + "event/20200622/checkTopReviewerApply.do"
       	   , param
       	   , monthEvent.detail._callback_checkTopReviewerApply
        );
    },

    _callback_checkTopReviewerApply : function(json){
        if(json.ret == "0"){
        	monthEvent.detail.eventShowLayScroll('popForm1');	//지원서 팝업
        }else if(json.ret == "99"){	//대상 아닐때
        	monthEvent.detail.eventShowLayScroll('popEvt1');	//탑리뷰어 도전
        }else if(json.ret == "-1"){
        	common.link.moveLoginPage();
    	}else{
        	alert(json.message);
        }
    },

    //제출서 체크
	confirmCheck : function(){
		if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
		var question1	  = $(':radio[name="question1"]:checked').val();
		var question1_txt = $.trim($("#question1_txt").val()).replace(/\|/gi, "");
		var question2	  = $(':radio[name="question2"]:checked').val();
		var question2_txt = $.trim($("#question2_txt").val()).replace(/\|/gi, "");
		var question3	  = $(':radio[name="question3"]:checked').val();
		var question3_txt = $.trim($("#question3_txt").val()).replace(/\|/gi, "");
		var question4_txt = $.trim($("#question4_txt").val()).replace(/\|/gi, "");
		var question5	  = $(':radio[name="question5"]:checked').val();
		var question6	  = $(':radio[name="question6"]:checked').val();

		if(common.isEmpty(question1) || common.isEmpty(question2) || common.isEmpty(question3) || common.isEmpty(question4_txt) || common.isEmpty(question5) || common.isEmpty(question6)){
			alert("모든 항목을 작성해주세요");
			return;
		}

		if((question1 == "1" && common.isEmpty(question1_txt)) || (question2 == "3" && common.isEmpty(question2_txt)) || (question3 == "8" && common.isEmpty(question3_txt))){
			alert("모든 항목을 작성해주세요");
			return;
		}
		if(question1 != "1"){
			question1_txt = "선택";
		}
		if(question2 != "3"){
			question2_txt = "선택";
		}
		if(question3 != "8"){
			question3_txt = "선택";
		}

		monthEvent.detail.noteCont = question1 + "|" + question1_txt + "|" + question2 + "|" + question2_txt + "|" + question3 + "|" + question3_txt + "|" + question4_txt + "|" + question5 + "|" + question6;

		if(confirm("제출하시면 수정 및 재 확인이 어렵습니다. 최종 제출하시겠어요?")){
			monthEvent.detail.eventCloseLayer();
			monthEvent.detail.recheck();
		}
    },

    //응모여부조회
	recheck : function(){
		if(!monthEvent.detail.checkLoginEvt()){
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
       	   , _baseUrl + "event/20200622/checkTopReviewerApply.do"
       	   , param
       	   , monthEvent.detail._callback_recheck
        );
    },

    _callback_recheck : function(json){
        if(json.ret == "0"){
        	$(".agreeBtn").attr("onclick", "monthEvent.detail.topReviewerApply();");
        	monthEvent.detail.eventShowLayScroll('eventLayerPolice');	//위수탁동의 팝업
        	monthEvent.detail.layerPolice = true;
            $(".agreeCont")[0].scrollTop = 0;
        }else if(json.ret == "99"){	//대상 아닐때
        	monthEvent.detail.eventShowLayScroll('popEvt1');	//탑리뷰어 도전
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
        if(!monthEvent.detail.checkLoginEvt()){
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
            monthEvent.detail.eventCloseLayer();
            return;
        }
        if("Y" != mbrInfoThprSupAgrYn){
            monthEvent.detail.layerPolice = false;
            monthEvent.detail.eventCloseLayer();
            return;
        }

        monthEvent.detail.layerPolice = false;
        monthEvent.detail.eventCloseLayer();
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
              , _baseUrl + "event/20200622/topReviewerApply.do"
              , param
              , monthEvent.detail._callback_topReviewerApply
        );
    },

    _callback_topReviewerApply : function(json){
        if(json.ret == "0"){
        	monthEvent.detail.eventShowLayScroll("popGift1");
        }else if(json.ret == "99"){	//대상 아닐때
        	monthEvent.detail.eventShowLayScroll('popEvt1');	//탑리뷰어 도전
        }else if(json.ret == "-1"){
    		if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
    	}else{
        	alert(json.message);
        }

    },

    checkLoginEvt : function(){
        if(!common.isLoginForEvt()){
            if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    },

    setYoutube : function(){
		$('.playMov').show();
		$("#video").attr('src',$('#youtubeURL').val());
    },

	eventCloseLayer : function(){
		$(".eventLayer").hide();
		$("#eventDimLayer").hide();

		$(".eventLayer.popUser").css("position", "fixed");

		monthEvent.detail.setYoutube();
	},

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

		//유투브 정지
		$('.playMov').hide();
		$("#video").attr('src','');
	}
}