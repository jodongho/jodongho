$.namespace("monthEvent.detail");
monthEvent.detail = {
	snsInitYn : "N",
	/* 당첨 여부 */
	myWinFlag : "N",
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "N",

	init : function(){
		if(common.isLogin()){
			/* 당첨내역 */
			monthEvent.detail.getMyWinList();
		};
		// 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
	},
	/**
	 * 2017.09.30 송편 속 행운을 찾아라! (09.30~10.09)
	 */
	addSongpyeonLucky : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			alert("모바일 APP 에서만 참여 가능합니다.");
			return;
		}
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
			  , _baseUrl + "event/201709/addSongpyeonLuckyJson.do"
			  , param
			  , monthEvent.detail._callback_addSongpyeonLuckyJson
		);
	},
	_callback_addSongpyeonLuckyJson : function(json){
		if(json.ret == "0"){
			if(json.myEvtItem == 1){
				mevent.detail.eventShowLayer("eventLayerWinner1");
			}else{
				mevent.detail.eventShowLayer("eventLayerWinner" + json.myEvtItem);
			}
			monthEvent.detail.getMyWinList();
		}else if(json.ret == "013"){
			mevent.detail.eventShowLayer("eventLayerWinner5");
		}else{
			alert(json.message);
		}
	},
	/* 당첨내역 */
	getMyWinList : function(){
		if(!mevent.detail.checkLogin()){
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
				myWinListHtml = "<tr><td colspan='2'>당첨이력이 없습니다.</td></tr>";
			}else{
				for(var i=0 ; i<json.myEvtWinList.length ; i++){
					myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
					if(json.myEvtWinList[i].fvrSeq > 1){
						monthEvent.detail.myWinFlag = "Y";
					}
				}

				monthEvent.detail.layerAgrFlag = json.myEvtWinList[0].mbrInfoUseAgrYn;
			}

			$("tbody#myWinListHtml").html(myWinListHtml);
		}else{
			alert(json.message);
		}
	},
	/* 개인정보 위탁동의 팝업 */
	popLayerAgrInfo : function(){
		if("" == $("input[id='evtNo']:hidden").val()){
			alert("이벤트 번호가 존재하지 않습니다.");
			return;
		}
		if(monthEvent.detail.myWinFlag == "N"){
			alert("당첨자만 개인정보 수집동의가 필요합니다.");
			return;
		}
		if(monthEvent.detail.layerAgrFlag != "N"){
			alert("이미 동의하셨습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : "273"
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateLayerAgrInfoReacAjax();"
		};
		mevent.detail.getLayerPopAgrInfoAjax(param);
	},
	/* 개인정보 위탁 동의 정보 저장 */
	updateLayerAgrInfoReacAjax : function(){
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , setFlag : "N"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/updateMyStmpEventJosn.do"
				  , param
				  , monthEvent.detail._callback_updateLayerAgrInfoReacAjax
			);
		}
	},
	_callback_updateLayerAgrInfoReacAjax : function(json){
		mevent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.layerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	/* 당첨내역 확인 */
	myWinListView : function(){
		mevent.detail.eventShowLayer("eventLayerWinDetail");
	},
	/**
	 * sns 공유하기
	 * type 값 kakaotalk / facebook
	 */
	shareSns : function(imgUrl, title, type){
		if(type == "kakaotalk" || type == "facebook"){
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
		}
	},
}