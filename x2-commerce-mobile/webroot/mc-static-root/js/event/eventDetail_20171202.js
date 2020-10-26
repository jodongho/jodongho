$.namespace("monthEvent.detail");
monthEvent.detail = {
	snsInitYn : "N",
	// 당첨여부
	myWinFlag : "N",
	// 개인정보 위수탁 동의
	layerAgrFlag : "N",

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
		// 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
	},
	/* 룰렛 돌리기 */
	setRotate : function(){
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
			  , _baseUrl + "event/20171202/setRotateJson.do"
			  , param
			  , monthEvent.detail._callback_setRotateJosn
		);
	},
	_callback_setRotateJosn : function(json){
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

					$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/01rotate/01roultte_winner_" + resultItem + ".png");
					mevent.detail.eventShowLayer('eventLayerWinner');
				}
			});
		}else{
			if(json.ret == "013"){
				$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/01rotate/01roultte_fail_01.png");
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
			  , _baseUrl + "event/20171202/getMyWinListJson.do"
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
	/* 주문 개인정보 위탁동의 팝업 */
	popLayerAgrInfo : function(typeNum){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if("" == $("input[id='evtNo']:hidden").val()){
			alert("이벤트 번호가 존재하지 않습니다.");
			return;
		}
		if("Y" != monthEvent.detail.myWinFlag){
			alert("개인정보 위수탁 동의 대상이 아닙니다.");
			return;
		}
		if("N" != monthEvent.detail.layerAgrFlag){
			alert("이미 동의하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : typeNum
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateMyEventAgrYn();"
		};
		monthEvent.detail.getLayerPopAgrInfoAjax(param);
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
			  , url : _baseUrl + "event/openLayerPopAgrInfoAjax.do"
			  , data : param
			  , success : this._callback_openLayerPopAgrInfoAjax
		});
	},
	_callback_openLayerPopAgrInfoAjax : function(html){
		$("#eventLayerPolice").html(html);
	},
	updateMyEventAgrYn : function(){
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , setFlag : "N"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20171202/updateMyEventAgrYnJosn.do"
				  , param
				  , monthEvent.detail._callback_updateMyEventAgrYnJosn
			);
		}
	},
	_callback_updateMyEventAgrYnJosn : function(json){
		mevent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.layerAgrFlag = "Y";
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