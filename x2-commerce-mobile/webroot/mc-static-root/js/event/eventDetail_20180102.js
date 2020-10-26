$.namespace("monthEvent.detail");
monthEvent.detail = {
	snsInitYn : "N",

	init : function(){
		if(common.isLogin()){
			/* 당첨내역 확인 */
			monthEvent.detail.getMyWinList();
		};
		/* URL 복사 */
		$("div#rouletteA04").click(function(){
			$("div#linkUrlStr").html("<textarea readonly=''>https://m.oliveyoung.co.kr/m/E.do?evtNo=" + $("#evtNo").val() + "</textarea>");
			mevent.detail.eventShowLayer('eventLayerURL');
		});
		/* 닫기 */
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
			$("img#resultImg").attr("src", _cdnImgUrl + "contents/201801/01attend/space.png");
		});
	},
	/* 개인정보 수집 동의 여부 확인 */
	checkAgrInfoJson : function(){
		if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
			if(confirm("올리브영 앱에서 참여 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
			};
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20180102/checkAgrInfoJson.do"
				  , param
				  , monthEvent.detail._callback_checkAgrInfoJson
			);
		}
	},
	_callback_checkAgrInfoJson : function(json){
		if(json.ret = "0"){
			if(json.message == "Y"){
				$("input[id='mbrInfoUseAgrYn']:hidden").val(json.message);
				$("input[id='mbrInfoThprSupAgrYn']:hidden").val(json.message);

				monthEvent.detail.setRotate();
			}else{
				monthEvent.detail.popLayerAgrInfo();
			}
		}else{
			alert(json.message);
		}
	},
	/* 개인정보 수신 동의 팝업 */
	popLayerAgrInfo : function(){
		if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
			if(confirm("올리브영 앱에서 참여 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}

			mevent.detail.eventShowLayer('eventLayerPolice');
		}
	},
	/* 룰렛 돌리기 */
	setRotate : function(){
		if(($("input[id='mbrInfoUseAgrYn']:hidden").val() == "Y" && $("input[id='mbrInfoThprSupAgrYn']:hidden").val() == "Y") || mevent.detail.checkAgrmTwoInfo()){
			mevent.detail.eventCloseLayer();

			if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
				if(confirm("올리브영 앱에서 참여 가능합니다.")){
					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
				}else{
					return;
				}
			}else{
				if(!mevent.detail.checkLogin()){
					return;
				}
				if(!mevent.detail.checkRegAvailable()){
					return;
				}
				var param = {
						evtNo : $("input[id='evtNo']:hidden").val()
					  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
					  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
				};

				common.Ajax.sendJSONRequest(
						"GET"
					  , _baseUrl + "event/20180102/setRotateJson.do"
					  , param
					  , monthEvent.detail._callback_setRotateJson
				);
			}
		}
	},
	_callback_setRotateJson : function(json){
		if(json.ret == "0"){
			var resultItem = json.fvrSeq;
			var resultItemCount = json.itemCount;
			var revision = 360/resultItemCount;

			var duration = 2500;
			var pieAngle = 360*3;
			var angle = 0;

			angle = (pieAngle - ((resultItem*revision)-(revision/2)));

			$("img#roulette_base").rotate({
				duration: duration,
				animateTo: angle,
				callback: function(){
					monthEvent.detail.getMyWinList();

					$("img#resultImg").attr("src", _cdnImgUrl + "contents/201801/01attend/winner_" + resultItem + ".png");
					mevent.detail.eventShowLayer('eventLayerWinner');
				}
			});
		}else{
			if(json.ret == "013"){
				$("img#resultImg").attr("src", _cdnImgUrl + "contents/201801/01attend/fail_1.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else{
				alert(json.message);
			}
		}
	},
	/* 당첨내역 확인 */
	getMyWinList : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20180102/getMyWinListJson.do"
			  , param
			  , monthEvent.detail._callback_getMyWinListJson
		);
	},
	_callback_getMyWinListJson : function(json){
		if(json.ret == "0"){
			var myWinListHtml = "";

			if(json.myEvtWinList.length > 0){
				for(var i=0 ; i<json.myEvtWinList.length ; i++){
					myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
					monthEvent.detail.myWinFlag = "Y";

					if(json.myEvtWinList[i].mbrInfoUseAgrYn == "Y"){
						monthEvent.detail.layerAgrFlag = "Y";
					}
				}

				$("tbody#myWinListHtml").html(myWinListHtml);
			}
		}else{
			alert(json.message);
		}
	},
	/**
	 * sns 공유하기
	 * type 값 kakaotalk
	 */
	shareSns : function(imgUrl, title){
		var type = "kakaotalk";

		// 배너 이미지 체크
		var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
		if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
			bnrImgUrlAddr = "";
		} else {
			bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
		}

		// 이미지가 없을 경우만 배너로 교체
		if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
			imgUrl = bnrImgUrlAddr;
		}

		var snsShareUrl = _baseUrl + "T.do?evtNo="+$("#evtNo").val();

		if(monthEvent.detail.snsInitYn == "N"){
			common.sns.init(imgUrl, title, snsShareUrl);
			monthEvent.detail.snsInitYn = "Y";
		}

		common.sns.doShare(type);
	},
	/* 당첨이력 팝업 */
	getMyWinPopup : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}

		mevent.detail.eventShowLayer('eventLayerWinDetail');
	},
}