/**
 * 2017.10.12 올블리의 BEAUTY SHOW! (10.16~10.22)
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	// 조명 사은품 응모 가능
	lightItemFlag : "N",
	// 주문 조명 응모 가능
	orderLigthFlag : "N",
	// 조명 당첨 여부
	myWinFlag : "N",
	// 조명 개인정보 수신 동의여부
	layerAgrFlag : "N",
	// 최초 주문자 당첨 여부
	startOrderWinFlag : "N",
	// 최초 주문자 개인 정보 수신 동의여부
	startOrderFlag : "N",
	// 더블 클릭 방지
	clickFlag : "N",

	init : function(){
		if(common.isLogin()){
			monthEvent.detail.getMyAppOrderCnt();
			monthEvent.detail.getMyLigthCnt();
			monthEvent.detail.getMyWinList();

			monthEvent.detail.startOrderMyWinList();
		}
		// 당첨 내역
		$("div#beauty16B3").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}
			mevent.detail.eventShowLayer('eventLayerWinDetail');
		});
		// 조명 개인 정보 수신동의
		$("div#beauty16B4").click(function(){
			monthEvent.detail.checkLightAgrm();
		});
		// 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
	},
	// 이벤트 기간 내 APP 정상 주문건주
	getMyAppOrderCnt : function(){
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
			  , _baseUrl + "event/201710/getMyAppOrderCntJson.do"
			  , param
			  , monthEvent.detail._callback_getMyAppOrderCntJson
		);
	},
	_callback_getMyAppOrderCntJson : function(json){
		if(json.ordInfo.ordCnt > 0){
			monthEvent.detail.orderLigthFlag = "Y";

			$("span#myOrdStr").removeClass("no0").addClass("no1");
			$("span#myOrdStr").text("O");

			$("div#beauty16app").addClass("on");
			$("div#beauty16app").click(function(){
				monthEvent.detail.addOrderLigth();
			});
		}else{
			$("div#beauty16app").click(function(){
				alert("구매후 응모 가능하십니다.");
			});
		}
	},
	// 조명 켜기
	addLight : function(){
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
			  , _baseUrl + "event/201710/addLightJson.do"
			  , param
			  , monthEvent.detail._callback_addLightJson
		);
	},
	_callback_addLightJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}else{
			alert("조명이 켜졌습니다.");
		}

		monthEvent.detail.getMyLigthCnt();
	},
	// 조명 갯수
	getMyLigthCnt : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/201710/getMyLigthCntJson.do"
			  , param
			  , monthEvent.detail._callback_getMyLigthCntJson
		);
	},
	_callback_getMyLigthCntJson : function(json){
		if(json.ligthCnt > 0){
			$("span#myDayStr").text(json.ligthCnt);
			$("span#myDayStr").removeClass("no").addClass("no" + json.ligthCnt);

			for(var i=1 ; i<=json.ligthCnt ; i++){
				$("div[id='beauty16day" + i + "']").addClass("on");
				if(i == 6){
					$("div#beauty16day6").click(function(){
						if(monthEvent.detail.clickFlag == "N"){
							monthEvent.detail.addLigthItem();
							monthEvent.detail.clickFlag = "Y";
						}
					});

					monthEvent.detail.lightItemFlag = "Y";
				}
			}
		}
	},
	// 조명 사은품
	addLigthItem : function(){
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
		if(monthEvent.detail.lightItemFlag != "Y"){
			alert("조명을 6개 밝히셔야 응모 가능 합니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/201710/addLigthItemJson.do"
			  , param
			  , monthEvent.detail._callback_addLigthItemJson
		);
	},
	_callback_addLigthItemJson : function(json){
		if(json.ret == "0"){
			if(json.winYn == "Y"){
				mevent.detail.eventShowLayer("eventLayerWinner3");
				monthEvent.detail.getMyWinList();
			}else{
				mevent.detail.eventShowLayer("eventLayerWinner5");
			}
		}else{
			alert(json.message);
		}
		monthEvent.detail.clickFlag = "N";
	},
	// 주문 사은품
	addOrderLigth : function(){
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
		if(monthEvent.detail.orderLigthFlag != "Y"){
			alert("구매후 응모 가능하십니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/201710/addOrderLigthJson.do"
			  , param
			  , monthEvent.detail._callback_addOrderLigthJson
		);
	},
	_callback_addOrderLigthJson : function(json){
		if(json.ret == "0"){
			if(json.winYn == "Y"){
				mevent.detail.eventShowLayer("eventLayerWinner" + (json.fvrSeq - 2));

				monthEvent.detail.getMyWinList();
			}else{
				mevent.detail.eventShowLayer("eventLayerWinner5");
			}
		}else{
			alert(json.message);
		}
	},
	/* 조명 당첨내역 */
	getMyWinList : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/201710/getLigthMyWinListJson.do"
			  , param
			  , monthEvent.detail._callback_getLigthMyWinListJson
		);
	},
	_callback_getLigthMyWinListJson : function(json){
		var num = 0;
		if(json.ret == "0"){
			var myWinListHtml = "";
			if(json.myEvtWinList.length > 0){
				for(var i=0 ; i<json.myEvtWinList.length ; i++){
					if(json.myEvtWinList[i].fvrSeq > 1 && json.myEvtWinList[i].fvrSeq < 5){
						myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";

						monthEvent.detail.myWinFlag = "Y";
						monthEvent.detail.layerAgrFlag = json.myEvtWinList[i].mbrInfoUseAgrYn;

						num += 1;
					}
				}
			}

			if(num <= 0){
				myWinListHtml = "<tr><td colspan='2'>당첨이력이 없습니다.</td></tr>";
			}

			$("tbody#myWinListHtml").html(myWinListHtml);
		}else{
			alert(json.message);
		}
	},
	/* 조명 개인정보 수신 팝업 */
	checkLightAgrm : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(monthEvent.detail.myWinFlag != "Y"){
			alert("당첨자만 개인정보 수집동의가 필요합니다.");
			return;
		}
		if(monthEvent.detail.layerAgrFlag == "Y"){
			alert("이미 개인정보 수집동의 하였습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : "273"
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateLightAgrmAjax();"
		};
		monthEvent.detail.getLayerPopAgrInfoAjax(param);
	},
	/* 개인정보 위탁 동의 정보 저장 */
	updateLightAgrmAjax : function(){
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/201710/updateLightAgrmJosn.do"
				  , param
				  , monthEvent.detail._callback_updateLightAgrmAjax
			);
		}
	},
	_callback_updateLightAgrmAjax : function(json){
		mevent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.layerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	/* 최초 구매자 이벤트 참여 현황 */
	startOrderMyWinList : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/201710/getStartOrderMyWinListJson.do"
			  , param
			  , monthEvent.detail._callback_getStartOrderMyWinListJson
		);
	},
	_callback_getStartOrderMyWinListJson : function(json){
		if(json.ret == "0"){
			if(json.myEvtWinList.length > 0 && json.myEvtWinList[0].fvrSeq != undefined){
				monthEvent.detail.startOrderWinFlag = "Y";
				if(json.myEvtWinList[0].mbrInfoUseAgrYn == "Y"){
					monthEvent.detail.startOrderFlag = "Y";
				}
			}
		}
	},
	/* 최초 구매자 이벤트 참여 */
	startOrderAddEvt : function(){
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
		if(monthEvent.detail.startOrderWinFlag != "N"){
			alert("이미 참여 하셨습니다.");
			return;
		}
		if(monthEvent.detail.startOrderFlag == "Y"){
			alert("이미 개인정보 수집동의 하였습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/201710/startOrderAddEvtJson.do"
			  , param
			  , monthEvent.detail._callback_startOrderAddEvtJson
		);
	},
	_callback_startOrderAddEvtJson : function(json){
		if(json.ret == "0"){
			if(json.winYn == "Y"){
				mevent.detail.eventShowLayer("eventLayerWinner4");
				monthEvent.detail.startOrderWinFlag = "Y";
			}else{
				mevent.detail.eventShowLayer("eventLayerWinner5");
			}
		}else{
			alert(json.message);
		}
	},
	/* 최초 구매자 개인정보 위수탁 동의 */
	checkStartOrderAgrm : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(monthEvent.detail.startOrderWinFlag != "Y"){
			alert("당첨자만 개인정보 수집동의가 필요합니다.");
			return;
		}
		if(monthEvent.detail.startOrderFlag == "Y"){
			alert("이미 개인정보 수집동의 하였습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : "273"
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateStartOrderAgrmAjax();"
		};
		monthEvent.detail.getLayerPopAgrInfoAjax(param);
	},
	/* 개인정보 위탁 동의 정보 저장 */
	updateStartOrderAgrmAjax : function(){
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/201710/updateStartOrderAgrmJosn.do"
				  , param
				  , monthEvent.detail._callback_updateStartOrderAgrmAjax
			);
		}
	},
	_callback_updateStartOrderAgrmAjax : function(json){
		mevent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.startOrderFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	/* 개인정보 수신동의 레이어 */
	getLayerPopAgrInfoAjax : function(param){
		if(param.evtNo == ""){
			alert("이벤트 번호를 확인해주세요.");			return;
		}
		if(param.agrPopupFunction == ""){
			alert("약관 오픈 평션명을 확인해주세요.");		return;
		}
		if(param.closeFunction == ""){
			alert("닫기 평션명을 확인해주세요.");			return;
		}
		if(param.confirmFunction == ""){
			alert("확인 평션명을 확인해주세요.");			return;
		}

		$.ajax({
			type : "POST"
		  , dataType : "html"
		  , url : _baseUrl + "event/201710/getLayerPopAgrInfoAjax.do"
		  , data : param
		  , success : this._callback_getLayerPopAgrInfoAjax
		});
	},
	_callback_getLayerPopAgrInfoAjax : function(html){
		$("#eventLayerPolice").html(html);
	},
}