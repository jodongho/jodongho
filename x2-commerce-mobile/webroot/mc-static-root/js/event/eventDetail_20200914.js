/**
 * 배포일자 : 2020-09-10
 * 오픈일자 : 2020-09-14
 * 이벤트명 : 9월 리뷰의 품격
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	layerPolice : false,
	noteCont : null,
	showPopForm1 : false,
	init : function(){

		setTimeout(function() {
			$("#video").attr('src',$('#youtubeURL').val());
		}, 3000);

		monthEvent.detail.setApplyBtn();

		//팝업 닫기
		$('.close').click(function() {
			monthEvent.detail.eventCloseLayer();
		});

		//지원서 닫기
		$('.surveyFormClosed').click(function() {
			if(monthEvent.detail.showPopForm1){
				alert('아직 지원서를 제출하지 않으셨어요. 작성 후, 아래에 있는 제출하기 버튼을 꼭 눌러주세요!');
			}
			$('#userSurveyForm').slideUp();
		});
		
		//지원하기
		$(".btnSurveyForm").click(function(){
			if($(this).hasClass('on')){
				monthEvent.detail.checkTopReviewerApply();
			}
		});

		//제출하기
		$(".userSubmit").click(function(){
			monthEvent.detail.confirmCheck();
		});

		$(".eventLayer.popUser input").each(function(){
			$(this).bind("focus", function(){
			//	$(".header").css("position", "absolute");		
		 	//	$('html,body').scrollTop('0'); 
			 	// $('html, body').animate({scrollTop: '0'}, 0);
			 	$('html, body').scrollTop({scrollTop: '0'});
				$(".eventLayer.popUser").css("position", "absolute");
			//	$(".eventLayer.popUser").css({'position':'absolute', 'top':'50%'});

			});

			$(this).bind("blur",function(){
				$(".eventLayer.popUser").css("position", "fixed");
			});
		});

		$('#userSurveyForm input:text').keyup(function(){
		    $(this).val($(this).val().replace(/[\|]/gi, ''))
		})

		$('#userSurveyForm .formBox').each(function(pIdx){
		    $(this).find('input').each(function(cIdx, obj){
		        if($(obj).is(':text')){
		        	$(obj).attr('id', 'evtServey_'+(pIdx+1)+'_txt').attr('maxlength', '100');
		        }else if($(obj).is(':radio')){
		        	$(obj).attr('name', 'evtServey_'+(pIdx+1));
		        	//$(obj).attr('id', 'evtServey_'+(pIdx+1)+(cIdx+1));
		        	$(obj).val(common.isEmpty($(obj).parent().text()) ? 'checkTxt' : $(obj).parent().text());
		        }
		    });
		});

		$("#userSurveyForm input").click(function(){
			monthEvent.detail.showPopForm1 = true;
			if('evtServey_2_txt' == $(this).attr('id')){
				$(':radio[name="evtServey_2"]:first').attr("checked", true);
			}else if('evtServey_3_txt' == $(this).attr('id')){
				$(':radio[name="evtServey_3"]:first').attr("checked", true);
			}else if('evtServey_4_txt' == $(this).attr('id')){
				$(':radio[name="evtServey_4"]:last').attr("checked", true);
			}
		});

		//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .close').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                //위수탁동의 새로고침
                location.reload();
            }
        });
	},

	setApplyBtn : function(){
		if(!common.isLoginForEvt()){
			return;
		}
        var param = {
        	evtNo : $("input[id='evtNo']:hidden").val()
        	,fvrSeq : "1"
        	, strtDtime : $("input[id='strtDtime']:hidden").val()
		    , endDtime : $("input[id='endDtime']:hidden").val()
        	,noteCont : 'Y'
        };
        common.Ajax.sendJSONRequest(
       		 "GET"
       	   , _baseUrl + "event/20200914/checkTopReviewerApply.do"
       	   , param
       	   , function(json){
       		   if(json.ret == '013'){
       			   //기참여
       			   $(".btnSurveyForm").removeClass('on');
       			   $('#userSurveyForm').remove();
       		   }
       	   }
        );
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
       	   , _baseUrl + "event/20200914/checkTopReviewerApply.do"
       	   , param
       	   , monthEvent.detail._callback_checkTopReviewerApply
        );
    },

    _callback_checkTopReviewerApply : function(json){
        if(json.ret == "0"){
        	$('#userSurveyForm').slideDown();	//지원서 팝업
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
		var question1_txt = $.trim($("#evtServey_1_txt").val()).replace(/\|/gi, "");
		var question2	  = $(':radio[name="evtServey_2"]:checked').val();
		var question2_txt = $.trim($("#evtServey_2_txt").val()).replace(/\|/gi, "");
		var question3	  = $(':radio[name="evtServey_3"]:checked').val();
		var question3_txt = $.trim($("#evtServey_3_txt").val()).replace(/\|/gi, "");
		var question4	  = $(':radio[name="evtServey_4"]:checked').val();
		var question4_txt = $.trim($("#evtServey_4_txt").val()).replace(/\|/gi, "");
		var question5_txt = $.trim($("#evtServey_5_txt").val()).replace(/\|/gi, "");
		var question6	  = $(':radio[name="evtServey_6"]:checked').val();
		var question7	  = $(':radio[name="evtServey_7"]:checked').val();

		if($(':radio[name="evtServey_2"]:first').is(':checked')){
			question2 = question2_txt
		}
		if($(':radio[name="evtServey_3"]:first').is(':checked')){
			question3 = question3_txt
		}
		if($(':radio[name="evtServey_4"]:last').is(':checked')){
			question4 = question4_txt;
		}

		if(common.isEmpty(question1_txt) || common.isEmpty(question2) || common.isEmpty(question3) || common.isEmpty(question4)
				|| common.isEmpty(question5_txt) || common.isEmpty(question6) || common.isEmpty(question7)){
			alert("모든 항목을 작성해주세요");
			return;
		}

		monthEvent.detail.noteCont = question1_txt
							+ "|" + question2 + "|" + question3 + "|" + question4 + "|" + question5_txt
							+ "|" + question6 + "|" + question7;

		if(confirm("제출하시면 수정 및 재 확인이 어렵습니다. 최종 제출하시겠어요?")){
			monthEvent.detail.showPopForm1 = false;
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
       	   , _baseUrl + "event/20200914/checkTopReviewerApply.do"
       	   , param
       	   , monthEvent.detail._callback_recheck
        );
    },

    _callback_recheck : function(json){
        if(json.ret == "0"){
        	//위수탁동의 팝업
			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
        	$(".agreeBtn").attr("onclick", "monthEvent.detail.topReviewerApply();");
        	monthEvent.detail.eventShowLayScroll('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
        	monthEvent.detail.layerPolice = true;
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
              , _baseUrl + "event/20200914/topReviewerApply.do"
              , param
              , monthEvent.detail._callback_topReviewerApply
        );
    },

    _callback_topReviewerApply : function(json){
    	$('#userSurveyForm').slideUp();
        if(json.ret == "0"){
        	$(".btnSurveyForm").removeClass('on');
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

	eventCloseLayer : function(){
		$(".eventLayer").hide();
		$("#eventDimLayer").hide();

		//유투브 셋팅
		$('.playMov').show();
		$("#video").attr('src',$('#youtubeURL').val());
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