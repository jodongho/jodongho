/**
 * 배포일자 : 2020-02-20
 * 오픈일자 : 2020-02-24
 * 이벤트명 : 2월 마케팅 수신 동의 - 미션! 올리브영
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	possibleApply : false,	//참여가능여부
	applyIng : false,
	agrType : '',
	layerPolice : false,
	befAgrYn : '',
	befAppPushYn : '',
	currAgrYn : '',
	currAppPushYn : '',
	currentDay : null,
	init : function(){
	    
		monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
	    if(monthEvent.detail.currentDay.substring(0,8) >= "20200901"){
	        $("#attendBanner a").attr("href", "https://www.oliveyoung.co.kr/store/event/getEventDetail.do?evtNo=00000000007179")    
	    }
	    
		$(".aa input[type='checkbox']").attr("disabled", true);
		$(".agree_btn input[type='checkbox']").not('.aa').attr("disabled", true);	
		
		$('.agree_lay a').click(function(e){
			$('.agree_lay').hide();	
			$('.slider').addClass('off');
		});
		
		
		/* 수신동의 현황 조회 */
		if(common.isLogin()){
			monthEvent.detail.getMyMarketingStatus();
		}
		
		$(document).ready(function() {
			if (!$('[data-popup]').length) return;

			var $btnLayer = $('[data-popup]');

			$btnLayer.on('click', function (e) {
				e.preventDefault();

				var $this = $(this),
					$layerId = $($this.data('popup')),
					$btnClose = $layerId.find('[data-popClose="closed"]'),
					fadeSpeed = 200;
				$layerId.fadeIn(fadeSpeed);

				$btnClose.on('click', function () {
					$layerId.fadeOut(fadeSpeed);
				});

			});
		});
		
		var currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
		if(currentDay.indexOf('202003') != -1){
			$('.layer_attend .btn_attend').remove();
			$('.evtBan:eq(0)').remove();
		}


		//마케팅 활용 동의
		$('.slider').eq(0).on('click', function(){
			if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
				if(confirm("APP에서만 참여 가능합니다.")){
					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
				}else{
					return;
				}
			}else if(!monthEvent.detail.checkLoginEvt()){
	            return;
	        }else{
				if(!$(this).hasClass('on')){						
					monthEvent.detail.mktRcvSend();
				}
			}
		});
	

		// app push 체크
		$('.slider').eq(1).on('click', function(){
			if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
				if(confirm("APP에서만 참여 가능합니다.")){
					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
				}else{
					return;
				}
			}else if(!monthEvent.detail.checkLoginEvt()){
				return;
			}else if(!monthEvent.detail.isAppPushVer() && !$(this).hasClass('on')){
				if(confirm("APP PUSH설정을 위해 APP 최신버전 업데이트가 필요합니다. 업데이트를 하시겠습니까?")){						
					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val()+"&chkYn=Y");
				}
				return;
			}else{
				
				if($(this).hasClass('on')){
						return;
				}
				
				if(!$('.slider').eq(0).hasClass('on')){
					//마케팅 수신 동의가 켜져 있어야 app push 변경 가능
					alert("마케팅 활용 동의 설정 후 변경 가능합니다.");
					return;
				}
				monthEvent.detail.setTmsPushConfig('Y');
				var appCheckTimer = setInterval(function(){
					if('N' == common.app.pushConfigResult){
						//수신동의 처리 실패
						clearInterval(appCheckTimer);
					}else if(!common.isEmpty(common.app.pushConfigResult)){
						monthEvent.detail.appPushSlideOn();
						clearInterval(appCheckTimer);
					}
				}, 200);
			}
		});
		
		$('.btn_01').click(function(){
			monthEvent.detail.checkCouponDown();
		});
	},

	/* 수신동의 현황 조회 */
	getMyMarketingStatus : function(){
		var param = {
			evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/pushapp/getMyMarketingStatus.do"
			  , param
			  , monthEvent.detail._callback_getMyMarketingStatus
		);
	},

	_callback_getMyMarketingStatus : function(json){
		if(json.ret == "0"){
			monthEvent.detail.befAgrYn = json.befAgrYn;
			monthEvent.detail.befAppPushYn = json.befAppPushYn;
			
			if(json.currAgrYn == 'Y'){
				monthEvent.detail.mktSlideOn();
			}
			
			if(json.currAppPushYn == 'Y'){
				monthEvent.detail.appPushSlideOn();
			}			
			
			if('Y' == json.possibleApply){
				monthEvent.detail.possibleApply = true;
			}			
		}
	},
	
	mktSlideOn : function(){
	    monthEvent.detail.currAgrYn = 'Y';
		$(".aa input[type='checkbox']").prop("checked", true);
		$(".aa input[type='checkbox']").attr("disabled", true).next().addClass("on")
	},
	
	appPushSlideOn : function(){
	    monthEvent.detail.currAppPushYn = 'Y';
		$(".agree_btn").not('.aa').find("input[type='checkbox']").prop("checked", true)
		$(".agree_btn").not('.aa').find("input[type='checkbox']").attr("disabled", true).next().addClass("on")
	},
	
	checkCouponDown : function(){
	    if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
				if(confirm("APP에서만 참여 가능합니다.")){
					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
				}else{
					return;
				}
		}else if(!monthEvent.detail.checkLoginEvt()){
            return;
        }else if(!monthEvent.detail.possibleApply){
			alert("이미 수신동의하셨네요. 하단 출석체크 이벤트에 참여해주세요");
			return;
		}else if((monthEvent.detail.befAgrYn == 'N' && monthEvent.detail.currAgrYn == 'Y')  ||  (monthEvent.detail.befAppPushYn == 'N' && monthEvent.detail.currAppPushYn == 'Y')){
			var cpnNo = $("#cpnDown").attr("cpnNo");
			mevent.detail.downAppCouponEventJson(cpnNo);
		}else{
		    alert("수신동의 설정 후 쿠폰 다운로드 가능합니다.");
			return;
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
				  agrYn : 'Y'
		};

		common.Ajax.sendRequest("POST", url, data, monthEvent.detail._callBack_mktRcvSend);
	},

	_callBack_mktRcvSend : function (data){
		if(data.result){
			if(data.CODE != "S0000000A"){
				alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");				
			}else{
				monthEvent.detail.mktSlideOn();				
				$(".agree_lay").show() ;
			}
		}else{
			alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");
		}
		monthEvent.detail.agrType = '';
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
    }
}