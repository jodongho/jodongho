/**
 * 배포일자 : 2020-05-21
 * 오픈일자 : 2020-05-22
 * 이벤트명 : 신규 약관동의 랜선 나들이
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	applyIng : false,
	layerPolice : false,
	myFvrSeq : '',
	init : function(){

		if(common.isLogin()){
			monthEvent.detail.checkNewAgrApply();
		}

		$('.pictureArea .sbox').click(function(){
			if(!common.isEmpty(monthEvent.detail.myFvrSeq)){
				//응모 완료
				mevent.detail.eventShowLayer('evtGift'+monthEvent.detail.myFvrSeq);
			}else{
				//응모
				monthEvent.detail.newAgrApply();
			}
		});

		$('.pictureArea .picCon').click(function(){
			monthEvent.detail.newAgrApply();
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

	gameStart : function(){
		$('.pictureArea').addClass('on');
		$('.pictureArea .sbox').removeClass('gameStart');
	},

	/* 응모 체크 */
	checkNewAgrApply : function(){
		var param = {
			evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20200522/checkNewAgrApply.do"
			  , param
			  , monthEvent.detail._callback_checkNewAgrApply
		);
	},

	_callback_checkNewAgrApply : function(json){
		if(json.ret == "0" && !common.isEmpty(json.tgtrSeq)){
			$('#evtGift'+json.fvrSeq+' .win_number').text(json.tgtrSeq);
			monthEvent.detail.myFvrSeq = json.fvrSeq;

			$('.pictureArea').removeClass('on').addClass('giftComplete');
			$('.pictureArea .sbox').removeClass('gameStart').addClass('gameEnd');
		}
	},

	/* 참여 */
	newAgrApply : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}else if(!common.isEmpty(monthEvent.detail.myFvrSeq)){
			alert('이미 응모하셨습니다.');
		}else{
			if(!monthEvent.detail.applyIng){
				monthEvent.detail.applyIng = true;

				var param = {
						evtNo : $("input[id='evtNo']:hidden").val()
						,MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
						,MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
				}
				common.Ajax.sendJSONRequest(
						"GET"
					  , _baseUrl + "event/20200522/newAgrApply.do"
					  , param
					  , monthEvent.detail._callback_newAgrApply
				);
			}
		}
	},

	_callback_newAgrApply : function(json){
		if(json.ret == '016' || json.ret == '017'){
			//위수탁동의 팝업
			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
			mevent.detail.eventShowLayer('eventLayerPolice');
			$(".agreeCont")[0].scrollTop = 0;
			monthEvent.detail.layerPolice = true;
		}else if(json.ret == '0'){
			$('#evtGift'+json.fvrSeq+' .win_number').text(json.tgtrSeq);
			mevent.detail.eventShowLayer('evtGift'+json.fvrSeq);
			monthEvent.detail.myFvrSeq = json.fvrSeq;

			$('.pictureArea').removeClass('on').addClass('giftComplete');
			$('.pictureArea .sbox').addClass('gameEnd');
		}else if(json.ret == '055'){
			alert('신규회원가입 고객이 아닙니다.');
		}else if(json.ret == "-1"){
			if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
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

			monthEvent.detail.gameStart();
		}
	}
}