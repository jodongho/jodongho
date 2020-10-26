/**
 * 배포일자 : 2020-07-09
 * 오픈일자 : 2020-07-13
 * 이벤트명 : 멤버십 올리브 퀴즈
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	applyIng : false,
	layerPolice : false,
	btnClick : '',
	noteCont : '',
	gradeQuiz : '',
	init : function(){

        /* app push 수신동의 현황 조회 */
        common.app.getTmsPushConfig();
        // app push 체크
        $('.appPush1').on('click', function(){
        	monthEvent.detail.setTmsPushConfig();
        });

		monthEvent.detail.getMbrInfo();

		$(".startQuiz1").click(function(){
			monthEvent.detail.applyQuiz('startQuiz1');
		});
		$(".quizSubmit1").click(function(){
			monthEvent.detail.applyQuiz('quizSubmit1');
		});

        $(".popMyWin1").click(function(){
            monthEvent.detail.getStmpMyWinList();
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

	getMbrInfo : function(){
		if(common.isLoginForEvt()){
	        var param = {
	        	evtNo : $("input[id='evtNo']:hidden").val()
	        };
	        common.Ajax.sendJSONRequest(
	       		 "GET"
	       	   , _baseUrl + "event/20200713/getMbrInfo.do"
	       	   , param
	       	   , function(json){
	               if(json.ret == "0"){ 
	               	$('.userInfo1:eq(0)').hide();
	               	$('.userInfo1:eq(1)').show();
	               	$('.memNick').text(json.evtMbrNickNm);
	               	$('.memGrade').addClass(json.evtMbrGradeNm);
	               }
	           }
	        );
		}
    },

    applyQuiz : function(btnClass){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else if(!monthEvent.detail.checkLoginEvt()){
            return;
        }else{
        	if(monthEvent.detail.btnClick == 'block'){
        		alert('이미 참여하셨습니다.');
        	}else if(!monthEvent.detail.applyIng){

				if(btnClass == 'quizSubmit1'){
					if(common.isEmpty($('[name=evtQuiz]:checked').val())){
						alert('O X를 골라주세요');
						return;
					}
					common.wlog('event_quiz_apply_click');	//제출하기
					monthEvent.detail.noteCont = monthEvent.detail.noteCont + '|'+ $('[name=evtQuiz]:checked').val();
				}

				monthEvent.detail.applyIng = true;
		        var param = {
		                evtNo : $("input[id='evtNo']:hidden").val()
						,MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
						,MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
						, noteCont : monthEvent.detail.noteCont
		        };
		        common.Ajax.sendJSONRequest(
		                "POST"
		              , _baseUrl + "event/20200713/applyQuiz.do"
		              , param
		              , monthEvent.detail._callback_applyQuiz
		        );
			}
        }
    },

    _callback_applyQuiz : function(json){
    	mevent.detail.eventCloseLayer();
		if(json.ret == '016' || json.ret == '017'){
			//위수탁동의 팝업
			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
			mevent.detail.eventShowLayer('eventLayerPolice');
			$(".agreeCont")[0].scrollTop = 0;
			monthEvent.detail.layerPolice = true;

			common.wlog('event_quiz_start_click');	//시작
		}else if(json.ret == '020'){
			//퀴즈 셋팅
			$('[name=evtQuiz]').attr('checked', false);
			$('.quizTxt').addClass(json.quizTxt);
			monthEvent.detail.gradeQuiz = json.quizTxt;
			monthEvent.detail.noteCont = json.quizTxt;
			$('.Quiz2').addClass('on');
			$('.Quiz1').removeClass('on');

			common.wlog('event_quiz_agree_click');	//위수탁 동의
		}else if(json.ret == '0'){
			monthEvent.detail.btnClick = 'block';
			if(!common.isEmpty(json.popClass)){
				$('#' + json.popClass + ' .conts_inner div').addClass(monthEvent.detail.gradeQuiz);
				mevent.detail.eventShowLayer(json.popClass);
			}else if(json.fvrSeq == '1'){
				mevent.detail.eventShowLayer('evtGiftFail');
			}else{
				var giftTg = '';
				if(json.fvrSeq == '2'){
					giftTg = 'evtGift2';
				}else if(json.fvrSeq == '3'){
					giftTg = 'evtGift1';
				}else if(json.fvrSeq == '4'){
					giftTg = 'evtGift3';
				}else if(json.fvrSeq == '5'){
					giftTg = 'evtGift4';
				}
				$('#' + giftTg + ' .win_number').text('('+json.tgtrSeq+')');
				mevent.detail.eventShowLayer(giftTg);
			}
		}else if(json.ret == '013'){
			monthEvent.detail.btnClick = 'block'
			alert('이미 참여하셨습니다.');
		}else{
			alert(json.message);
		}
		monthEvent.detail.applyIng = false;
	},

	/* 위수탁 동의 팝업 */
	popLayerConfirm : function(){
		if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
			alert("2가지 모두 동의 후 참여 가능합니다.");
			return;
		}

		if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
			monthEvent.detail.layerPolice = false;
			mevent.detail.eventCloseLayer();

			monthEvent.detail.applyQuiz();
		}
	},

    /* 당첨내역 확인 */
    getStmpMyWinList : function(){
        if(!monthEvent.detail.checkLoginEvt()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getStmpMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },

    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>당첨내역이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("#evtPopWinDetail tbody").html(myWinListHtml);

            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else if(json.ret == "-1"){
			if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
		}else{
            alert(json.message);
        }
    },

    setTmsPushConfig : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp) {
        	if(confirm("APP에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }else if(monthEvent.detail.appPushVer()){
                common.app.getTmsPushConfig();
                setTimeout(function(){
                        if(!monthEvent.detail.appPushIng){
                            monthEvent.detail.appPushIng = true;
                            common.app.setTmsPushConfig('Y');
                            var appCheckTimer = setInterval(function(){
                                if('N' == common.app.pushConfigResult){
                                    //수신동의 처리 실패
                                    clearInterval(appCheckTimer);
                                    monthEvent.detail.appPushIng = false;
                                }else if(!common.isEmpty(common.app.pushConfigResult) || !monthEvent.detail.appPushIng){
                                    //처리 성공
                                    clearInterval(appCheckTimer);
                                    monthEvent.detail.appPushIng = false;
                                }
                            }, 300);
                        }
                    },1000);
            }else{
                common.app.callSettings();
            }
        }
    },

    /* 앱 최신버전 체크 */
    appPushVer : function(){
        if(common.isLoginForEvt()){
            var tempCompareVersion = "";
            if (common.app.appInfo.ostype == "10") { // ios
                tempCompareVersion = '2.2.1';
            }else if(common.app.appInfo.ostype == "20"){ // android
                tempCompareVersion = '2.1.8';
            }
            if(common.app.appInfo.isapp && common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion) !=  "<"){
                return true;
            }
        }
        return false;
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

    evtHintMoveUrl : function(){
        common.wlog('event_quiz_hint_click');	//힌트보러가기
        common.link.commonMoveUrl('main/getMembershipBenefitInfo.do');
    }
}