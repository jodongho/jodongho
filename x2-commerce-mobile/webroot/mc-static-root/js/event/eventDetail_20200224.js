/**
 * 배포일자 : 2020-02-20
 * 오픈일자 : 2020-02-24
 * 이벤트명 : 2월 마케팅 수신 동의 - 미션! 올리브영
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	currEmailRcvYn : '',	//현재 email수신동의
	befAgrYn : '',			//이전 마케팅활용동의
	befSmsRcvAgrYn : '',	//이전 sms
	befAppPushYn : '',		//이전 app push
	possibleApply : false,	//참여가능여부
	applyFvrSeq : '',		//참여완료
	applyIng : false,
	agrType : '',
	layerPolice : false,
	init : function(){
		var currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
		if(currentDay.indexOf('202003') != -1){
			$('.layer_attend .btn_attend').remove();
			$('.evtBan:eq(0)').remove();
		}

		/* 수신동의 현황 조회 */
		if(common.isLogin()){
			monthEvent.detail.getMyMarketingStatus();
		}

		//마케팅활용동의
		$('#radioCheck1, #radioCheck2').on('change', function(){
			if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
				if(confirm("APP에서만 참여 가능합니다.")){
					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
				}else{
					return;
				}
			}else if(!mevent.detail.checkLogin()){
				$('[name=userAgree]').attr('checked', false);
			}else{
				if(common.isEmpty(monthEvent.detail.agrType)){
					monthEvent.detail.agrType = 'marketing';
					if($(this).attr('id') == 'radioCheck1'){
						//마케팅활용동의 동의
						if(!$('.toggle_area').hasClass('on')){
							//하단 영역 노출
							$('.toggle_btn').trigger('click');
						}
					}else if($(this).attr('id') == 'radioCheck2'){
						//마케팅활용동의 비동의
						if(!common.isEmpty(monthEvent.detail.applyFvrSeq)){
							//기참여자
							if(!confirm('수신동의 해제 시 이벤트 참여가 불가합니다. 해제하시겠습니까?')){
								$('#radioCheck1').attr('checked', true);
								monthEvent.detail.agrType = '';
								return;
							}
						}
						$('.toggle01').removeClass('on');
						monthEvent.detail.currEmailRcvYn = 'N';
					}
					monthEvent.detail.mktRcvSend();
				}
			}
		});
		//sms
		$('.toggle01').on('click', function(){
			if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
				if(confirm("APP에서만 참여 가능합니다.")){
					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
				}else{
					return;
				}
			}else if(!mevent.detail.checkLogin()){
				$('[name=userAgree]').attr('checked', false);
			}else{
				if(common.isEmpty(monthEvent.detail.agrType)){
					monthEvent.detail.agrType = 'sms';
					if(!$(this).hasClass('on')){
						//동의 처리
						if($('#radioCheck2').is(':checked')){
							alert('마케팅 활용 동의 동의 후 SMS 수신설정 가능합니다.');
							monthEvent.detail.agrType = '';
							return;
						}else{
							$(this).addClass('on');
						}
					}else{
						//비동의 처리
						if(!confirm('수신동의 해제 시 이벤트 참여가 불가합니다. 해제하시겠습니까?')){
							monthEvent.detail.agrType = '';
							return;
						}
						$(this).removeClass('on');
					}
				}
				monthEvent.detail.mktRcvSend();
			}
		});

		// app push 체크
		$('.toggle02').on('click', function(){
			if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
				if(confirm("APP에서만 참여 가능합니다.")){
					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
				}else{
					return;
				}
			}else if(mevent.detail.checkLogin()){
				if(!monthEvent.detail.isAppPushVer()){
					if(confirm("APP PUSH설정을 위해 APP 최신버전 업데이트가 필요합니다. 업데이트를 하시겠습니까?")){
						common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20200224/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val()+"&chkYn=Y");
					}
				}else{
					if(common.isEmpty(monthEvent.detail.agrType)){
						monthEvent.detail.agrType = 'app'+($('.toggle02').hasClass('on') ? 'Y' : 'N');
						if(!common.isEmpty(monthEvent.detail.applyFvrSeq) && monthEvent.detail.agrType == 'appY'){
							//기참여자
							if(!confirm('수신동의 해제 시 이벤트 참여가 불가합니다. 해제하시겠습니까?')){
								monthEvent.detail.agrType = '';
								return;
							}
						}
						monthEvent.detail.setTmsPushConfig($('.toggle02').hasClass('on') ? 'N' : 'Y');
						var appCheckTimer = setInterval(function(){
							if('N' == common.app.pushConfigResult){
								//수신동의 처리 실패
								clearInterval(appCheckTimer);
								monthEvent.detail.agrType = '';
							}else if(!common.isEmpty(common.app.pushConfigResult)){
								if(monthEvent.detail.agrType == 'appY'){
									$('.toggle02').removeClass('on');
								}else{
									$('.toggle02').addClass('on');
								}
								clearInterval(appCheckTimer);
								monthEvent.detail.agrType = '';
							}
						}, 200);
					}
				}
			}
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

	      // 마케팅 활용 약관
	      $('.toggle_btn').on('click', function() {
	        var $container = $(this).parents('.toggle_area');
	        var $txt_area = $container.find('.toggle_txt');
	        $txt_area.slideToggle('fast');
	        $container.toggleClass('on');
	      });
	},

	/* 수신동의 현황 조회 */
	getMyMarketingStatus : function(){
		var param = {
			evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20200224/getMyMarketingStatus.do"
			  , param
			  , monthEvent.detail._callback_getMyMarketingStatus
		);
	},

	_callback_getMyMarketingStatus : function(json){
		if(json.ret == "0"){
			monthEvent.detail.befAgrYn = json.befAgrYn;
			monthEvent.detail.befSmsRcvAgrYn = json.befSmsRcvAgrYn;
			monthEvent.detail.befAppPushYn = json.befAppPushYn;
			monthEvent.detail.currEmailRcvYn = json.currEmailRcvYn;
			
			if('N' == json.possibleApply){
				$('.layer_attend').show();
			}

			if('Y' == json.applyYn){
				monthEvent.detail.applyFvrSeq = 'evtGift'+json.fvrSeq;
				$('#evtGift'+json.fvrSeq+' .win_number').text(json.tgtrSeq);
				$('.mission_area').addClass('complete');
			}
			if('Y' == json.currAgrYn){
				$('#radioCheck1').attr('checked', true);
			}else{
				$('#radioCheck2').attr('checked', true);
			}
			if('Y' == json.currSmsRcvAgrYn){
				$('.toggle01').addClass('on');
			}
			if('Y' == json.currAppPushYn){
				$('.toggle02').addClass('on');
			}
		}
	},

	/* 앱 최신버전 체크 */
	isAppPushVer : function(){
		var tempCompareVersion = "";
		if (common.app.appInfo.ostype == "10") { // ios
			tempCompareVersion = '2.2.1';
		}else if(common.app.appInfo.ostype == "20"){ // android
			tempCompareVersion = '2.1.8';
		}
		if(common.app.appInfo.isapp && common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion) !=  "<"){
			return true;
		}
		return false;
	},

	//TMS 푸시 동의값 설정
	setTmsPushConfig : function(mktFlag) {
		common.app.pushConfigResult = "";
		if (common.app.appInfo.isapp && common.isLogin()) {
			location.href = "oliveyoungapp://setTmsPushConfig?mktFlag="+mktFlag;
		}
	},

	mktRcvSend : function(){
		var url = _baseUrl+"mypage/setMktReceiptInfoJson.do"
		var data = {
				  agrYn : $('#radioCheck1').is(':checked') ? 'Y' : 'N'
				, smsRcvAgrYn : $('.toggle01').hasClass('on') ? 'Y' : 'N'
				, emailRcvYn : monthEvent.detail.currEmailRcvYn
		};

		common.Ajax.sendRequest("POST", url, data, monthEvent.detail._callBack_mktRcvSend);
	},

	_callBack_mktRcvSend : function (data){
		if(data.result){
			if(data.CODE == "S0000000A"){
				alert("[올리브영]"+data.today +" 요청하신 SMS 및 이메일 수신정보가 변경되었습니다.\nSMS :"
                        +data.smsYn +"\n이메일 :" +data.emailYn);
			}else{
				alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");
			}
		}else{
			alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");
		}
		monthEvent.detail.agrType = '';
	},

	/* 참여 */
	marketingApply : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("APP에서만 참여 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else if(!mevent.detail.checkLogin()){
			return;
		}else if(monthEvent.detail.possibleApply == 'N'){
			alert('기간 내 신규 수신동의 고객이 아닙니다.');
		}else if(!common.isEmpty(monthEvent.detail.applyFvrSeq) && $('.mission_area').hasClass('complete')){
			//기참여자
			mevent.detail.eventShowLayer(monthEvent.detail.applyFvrSeq);
		}else{
			var mktAgrYn = $('#radioCheck1').is(':checked') ? 'Y' : 'N';
			var smsRcvAgrYn = $('.toggle01').hasClass('on') ? 'Y' : 'N';
			var appPushAgrYn = $('.toggle02').hasClass('on') ? 'Y' : 'N';

			if($('[name=userAgree]:checked').length != 1
				|| (mktAgrYn == 'N' && smsRcvAgrYn == 'Y')){
				alert('마케팅 활용 동의 동의 후 SMS 수신설정 가능합니다.');
				return;
			}else if(("Y" == monthEvent.detail.befSmsRcvAgrYn && "Y" == monthEvent.detail.befAppPushYn)){
				alert('기간 내 신규 수신동의 고객이 아닙니다.');
				return;
			}else if(("N" == smsRcvAgrYn && "N" == appPushAgrYn)
				|| (monthEvent.detail.befSmsRcvAgrYn == smsRcvAgrYn && monthEvent.detail.befAppPushYn == appPushAgrYn)){
				alert('기간 내 신규 수신동의 회원만 참여 가능합니다.');
				return;
			}else if(!monthEvent.detail.applyIng){
				monthEvent.detail.applyIng = true;

				var param = {
						evtNo : $("input[id='evtNo']:hidden").val()
					   ,MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
					   ,MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
				}
				common.Ajax.sendJSONRequest(
						"GET"
					  , _baseUrl + "event/20200224/marketingApply.do"
					  , param
					  , monthEvent.detail._callback_marketingApply
				);
			}
		}
	},

	_callback_marketingApply : function(json){
		if(json.ret == '016' || json.ret == '017'){
			//위수탁동의 팝업
			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
			mevent.detail.eventShowLayer('eventLayerPolice');
			$(".agreeCont")[0].scrollTop = 0;
			monthEvent.detail.layerPolice = true;
		}else if(json.ret == '0'){
			monthEvent.detail.applyFvrSeq = 'evtGift'+json.fvrSeq;
            $('#evtGift'+json.fvrSeq+' .win_number').text(json.tgtrSeq);
            mevent.detail.eventShowLayer('evtGift'+json.fvrSeq);
            $('.mission_area').addClass('complete');
		}else{
			alert(json.message);
		}
		monthEvent.detail.applyIng = false;
	},

	/* 위수탁 동의 팝업 */
	popLayerConfirm : function(){
		if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
			if(confirm("APP에서만 참여 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
			if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
				alert("2가지 모두 동의 후 참여 가능합니다.");
				return;
			}

			if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
				monthEvent.detail.layerPolice = false;
				mevent.detail.eventCloseLayer();

				monthEvent.detail.marketingApply();
			}
		}
	}

}