$.namespace("monthEvent.detail");
monthEvent.detail = {
	snsInitYn : "N",
	/* 코인 */
	pointWinYn : "N",
	/* 코인 개인정보 수신동의 여부 */
	pointLayerAgrFlag : "N",
	/* 뚜레쥬르 */
	tljWinYn : "N",
	tljTgtrSeq : "",
	/* 뚜레쥬르 개인정보 수신동의 여부 */
	tljLayerAgrFlag : "N",
	/* 출석완료여부 */
	addStmpFlag : "Y",
	/* 보유 코인 */
	allPoint : 0,
	/* 사용 코인 */
	usePoint : 0,

	init : function(){
		if($("input[id='reCommend']:hidden").val() != ""){
			if(!mevent.detail.checkLogin()){
				return;
			}

			monthEvent.detail.addKaKaoTalkFriend();
		};
		if(common.isLogin()){
			/* 로그인한 회원 참여 현황 조회 */
			monthEvent.detail.getMyJoinEvent();
			/* 이벤트 아이템별 개인정보 수신 동의 여부 목록 조회 */
			monthEvent.detail.getFvrInfoUseAgrYn();
		};
		// 닫기
		$(".eventHideLayer").click(function(){
			monthEvent.detail.eventCloseLayer();
		});
	},
	// 레이어 노출
	eventShowLayer : function(obj) {
		var layObj = document.getElementById(obj);
		var layDim = document.getElementById('eventDimLayer');
		layDim.style.display = 'block';
		layObj.style.display = 'block';
		var layObjHeight = layObj.clientHeight  / 2;
		layObj.style.marginTop = "-" + layObjHeight +"px";
	},
	// 레이어 숨김
	eventCloseLayer : function(){
		$(".eventLayer").hide();
		$("#eventDimLayer").hide();
	},
	/* 회원 출석 등록 */
	addMyStmp : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			alert("APP 에서만 참여 가능합니다.");
			return;
		}
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(monthEvent.detail.addStmpFlag == "N"){
			alert("출석도장을 모두 채우셨습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "1"
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addSeptMyStmpJson.do"
			  , param
			  , monthEvent.detail._callback_addAugMyStmpJson
		);
	},
	_callback_addAugMyStmpJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}
		monthEvent.detail.getMyJoinEvent();
	},
	/* 로그인한 회원 참여 현황 조회 */
	getMyJoinEvent : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getSeptMyJoinEventJson.do"
			  , param
			  , monthEvent.detail._callback_getSeptMyJoinEventJson
		);
	},
	_callback_getSeptMyJoinEventJson : function(json){
		// 출석
		if(json[1] != undefined && json[1] > 0){
			for(i=0 ; i<json[1] ; i++){
				$("div#coin0301").find("li").eq(i).addClass("on");
			}
		}

		// 친구추천
		$("div#coin0601").find("img").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201709/brandsale/no_" + json[4] + ".png");
		// 전체 코인
		monthEvent.detail.allPoint = json[1] + json[2] + json[3] + json[4];
		$("div#coin0201").find("img").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201709/brandsale/no_" + monthEvent.detail.allPoint + ".png");

		/* 사용 코인 조회 */
		monthEvent.detail.getUsePoint();
	},
	/* 카카오 친구 초대하기 */
	kakaoFriendAddUrl : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			alert("APP 에서만 참여 가능합니다.");
			return;
		}
		if(!mevent.detail.checkLogin()){
			return;
		}

		var evtNo = $("input[id='evtNo']:hidden").val();
		var reCommend = encodeURIComponent($("input[id='targetNum']:hidden").val());
		var imgUrl = "http:" + _cdnImgUrl + "contents/201709/brandsale/sns_benefit.jpg";
		var title = "온라인 역대급 단독 혜택! 지금 방문하고 맥북 및 다이슨 헤어드라이 겟겟!! ";

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

		var snsShareUrl = _baseUrl + "KE.do?evtNo=" + evtNo + "&reCommend=" + reCommend;

		/* sns common init 시키기 위해서 한번만 실행 */
		if(monthEvent.detail.snsInitYn == "N"){
			common.sns.init(imgUrl, title, snsShareUrl);
			monthEvent.detail.snsInitYn = "Y";
		}
		common.sns.doShare("kakaotalk");
	},
	/* 카카오친구 접속 */
	addKaKaoTalkFriend : function(){
		var param = {
				reCommend : decodeURIComponent($("input[id='reCommend']:hidden").val())
			  , evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "4"
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addKaKaoTalkFriendJosn.do"
			  , param
			  , monthEvent.detail._callback_addKaKaoTalkFriendJosn
		);
	},
	_callback_addKaKaoTalkFriendJosn : function(json){
//		console.log(json);
	},
	/* 이벤트 기간내 주문이력이 있는 고객 */
	orderSearch : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "2"
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addMyOrderCntJson.do"
			  , param
			  , monthEvent.detail._callback_addMyOrderCntJson
		);
	},
	_callback_addMyOrderCntJson : function(json){
		if(json.ret == "0"){
			// 참여 완료
			monthEvent.detail.eventShowLayer("eventLayerWinner1");
		}else if(json.ret == "046"){
			// 주문 내역이 없습니다.
			monthEvent.detail.eventShowLayer("eventLayerWinner2");
		}else if(json.ret == "004"){
			// 이미 참여
			monthEvent.detail.eventShowLayer("eventLayerWinner5");
		}else{
			alert(json.message);
		}
		/* 로그인한 회원 참여 현황 조회 */
		monthEvent.detail.getMyJoinEvent();
	},
	/* 앱 푸쉬 설정여부 */
	appPushFlag : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "3"
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addPushFlagItemJson.do"
			  , param
			  , monthEvent.detail._callback_addPushFlagItemJson
		);
	},
	_callback_addPushFlagItemJson : function(json){
		if(json.ret == "0"){
			// 완료
			monthEvent.detail.eventShowLayer("eventLayerWinner3");
		}else if(json.ret == "034"){
			// 앱푸쉬 수신자가 아닙니다.
			monthEvent.detail.eventShowLayer("eventLayerWinner4");
		}else if(json.ret == "004"){
			// 이미 참여
			monthEvent.detail.eventShowLayer("eventLayerWinner5");
		}else{
			alert(json.message);
		}
		/* 로그인한 회원 참여 현황 조회 */
		monthEvent.detail.getMyJoinEvent();
	},
	/* 캐시백 신청 */
	addCashBack : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(monthEvent.detail.allPoint < 40){
			alert("코인을 40개 모으셔야 응모 가능 합니다.");
			return;
		}
		if(monthEvent.detail.tljLayerAgrFlag == "Y"){
			alert("이미 참여 하셨습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "5"
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addCashBackChcekJson.do"
			  , param
			  , monthEvent.detail._callback_addCashBackChcekJson
		);
	},
	_callback_addCashBackChcekJson : function(json){
		if(json.ret == "0"){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , isTermsPopupYn : "N"
				  , isType : "170"
				  , agrPopupFunction : "monthEvent.detail.eventShowLayer('eventLayerPolice');"
				  , closeFunction : "monthEvent.detail.eventCloseLayer();"
				  , confirmFunction : "monthEvent.detail.updateLayerAgrInfoReacAjax();"
			};

			monthEvent.detail.getLayerPopAgrInfoAjax(param);
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
			  , url : _baseUrl + "event/openLayerPopAgrInfoAjax.do"
			  , data : param
			  , success : this._callback_openLayerPopAgrInfoAjax
		});
	},
	_callback_openLayerPopAgrInfoAjax : function(html){
		$("#eventLayerPolice").html(html);
	},
	/* 개인정보 위탁 동의 정보 저장 */
	updateLayerAgrInfoReacAjax : function(){
		if(monthEvent.detail.checkAgrmInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , setFlag : "N"
				  , fvrSeq : "5"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/addCashBackJson.do"
				  , param
				  , monthEvent.detail._callback_updateLayerAgrInfoReacAjax
			);
		}
	},
	_callback_updateLayerAgrInfoReacAjax : function(json){
		monthEvent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.tljLayerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	/* 개인정보 필수값 체크 */
	checkAgrmInfo : function(){
		var agreeVal1 = $(':radio[name="argee1"]:checked').val();

		if("Y" != agreeVal1){
			alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
			return false;
		} else {
			$("#mbrInfoUseAgrYn").val("Y");
		}

		return true;
	},
	/* 이벤트 응모 확인 */
	checkEvtPrd : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if((monthEvent.detail.allPoint - monthEvent.detail.usePoint) <= 0){
			monthEvent.detail.eventShowLayer("eventLayerWinner6");
			return;
		}
		if($("input[name='CoinSelector']:radio:checked").val() == undefined){
			alert("사은품을 선택 하세요.");
			return;
		}

		if($("input[name='CoinSelector']:radio:checked").val() == "1"){
			if((monthEvent.detail.allPoint - monthEvent.detail.usePoint) < 3){
				alert("포인트가 부족 합니다.");
				return;
			}
			$("span#subCoin").text("3");
		}else if($("input[name='CoinSelector']:radio:checked").val() == "2"){
			if((monthEvent.detail.allPoint - monthEvent.detail.usePoint) < 2){
				alert("포인트가 부족 합니다.");
				return;
			}
			$("span#subCoin").text("2");
		}else{
			if((monthEvent.detail.allPoint - monthEvent.detail.usePoint) < 1){
				alert("포인트가 부족 합니다.");
				return;
			}
			$("span#subCoin").text("1");
		}
		monthEvent.detail.eventShowLayer("eventLayerWinDetail");
	},
	/* 이벤트 사은품 응모 */
	addEvtPrd : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(monthEvent.detail.allPoint <= 0){
			monthEvent.detail.eventShowLayer("eventLayerWinner6");
			return;
		}
		if($("input[name='CoinSelector']:radio:checked").val() == undefined){
			alert("사은품을 선택 하세요.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : $("input[name='CoinSelector']:radio:checked").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addEvtPrdJson.do"
			  , param
			  , monthEvent.detail._callback_addEvtPrdJson
		);
	},
	_callback_addEvtPrdJson : function(json){
		if(json.winYn == "Y"){
			monthEvent.detail.pointWinYn = json.winYn;
			monthEvent.detail.eventShowLayer("eventLayerWinner" + json.fvrSeq);
			monthEvent.detail.pointLayerAgrFlag = json.pointLayerAgrFlag;
		}else{
			monthEvent.detail.eventShowLayer("eventLayerWinner5");
		}

		monthEvent.detail.usePoint = monthEvent.detail.allPoint - json.lastPoint;

		$("div#coin0201").find("img").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201709/brandsale/no_" + json.lastPoint + ".png");
	},
	/* 사용 코인 조회 */
	getUsePoint : function (){
		if(!mevent.detail.checkLogin()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getUsePointJson.do"
			  , param
			  , monthEvent.detail._callback_getUsePointJson
		);
	},
	_callback_getUsePointJson : function (json){
		if(json.usePoint != undefined){
			monthEvent.detail.usePoint = json.usePoint;

			var lastPoint = monthEvent.detail.allPoint - monthEvent.detail.usePoint;
			$("div#coin0201").find("img").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201709/brandsale/no_" + lastPoint + ".png");
		}
	},
	/* 뚜레주르 상품권 응모 */
	addBStljCoupon : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			alert("APP 에서만 참여 가능합니다.");
			return;
		}
		if(!mevent.detail.checkLogin()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addBStljCouponJson.do"
			  , param
			  , monthEvent.detail._callback_addBStljCouponJson
		);
	},
	_callback_addBStljCouponJson : function(json){
		if(json.ret == "0"){
			if(json.winYn == "Y"){
				monthEvent.detail.tljWinYn = json.winYn;

				alert("당첨되셨습니다. 개인정보 위/수탁 동의를 해주세요.");
			}else{
				alert("아쉽지만 당첨 되지 않으셨습니다.");
			}
		}else{
			alert(json.message);
		}
	},
	/* 푸쉬 수신자 뚜레쥬르 응모 개인정보 수신 동의 팝업 */
	tljAddAgrInfoPopup : function(){
		if(monthEvent.detail.tljWinYn != "Y"){
			alert("당첨자만 위/수탁 동의가 가능 합니다.");
			return;
		}
		if(monthEvent.detail.tljLayerAgrFlag == "Y"){
			alert("이미 동의 하셨습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : "73"
			  , agrPopupFunction : "monthEvent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "monthEvent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateBstljAgrInfoAjax();"
		};

		monthEvent.detail.getLayerPopAgrInfoAjax(param);
	},
	/* 개인정보 위탁 동의 정보 저장 */
	updateBstljAgrInfoAjax : function(){
		if(monthEvent.detail.checkAllAgrmInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/updatePushTljAgrInfoJson.do"
				  , param
				  , monthEvent.detail._callback_updatePushTljAgrInfoJson
			);
		}
	},
	_callback_updatePushTljAgrInfoJson : function(json){
		monthEvent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.tljWinYn = "Y";
			monthEvent.detail.tljLayerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	/* 이벤트 아이템별 개인정보 수신 동의 여부 목록 조회 */
	getFvrInfoUseAgrYn : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getFvrInfoUseAgrYnJson.do"
			  , param
			  , monthEvent.detail._callback_getFvrInfoUseAgrYnJson
		);
	},
	/* 개인정보 필수값 체크 */
	checkAllAgrmInfo : function(){
		var agreeVal1 = $(':radio[name="argee1"]:checked').val();
		var agreeVal2 = $(':radio[name="argee2"]:checked').val();

		if("Y" != agreeVal1){
			alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
			return false;
		} else {
			$("#mbrInfoUseAgrYn").val("Y");
		}

		if("Y" != agreeVal2){
			alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
			return false;
		} else {
			$("#mbrInfoThprSupAgrYn").val("Y");
		}

		return true;
	},
	_callback_getFvrInfoUseAgrYnJson : function(json){
		if((json[1] != undefined && json[1] == "N") || (json[2] != undefined && json[2] == "N") || (json[3] != undefined && json[3] == "N") || (json[4] != undefined && json[4] == "N")){
			monthEvent.detail.pointWinYn = "Y";
			monthEvent.detail.pointLayerAgrFlag = "N";
		}
		if((json[1] != undefined && json[1] == "Y") || (json[2] != undefined && json[2] == "Y") || (json[3] != undefined && json[3] == "Y") || (json[4] != undefined && json[4] == "Y")){
			monthEvent.detail.pointWinYn = "Y";
			monthEvent.detail.pointLayerAgrFlag = "Y";
		}
		if(json[5] != undefined && json[5] == "N"){
			monthEvent.detail.tljWinYn = "Y";
		}
		if(json[5] != undefined && json[5] == "Y"){
			monthEvent.detail.tljLayerAgrFlag = json[5];
			monthEvent.detail.tljWinYn = "Y";
		}
	},
	/* 포인트 당첨자 개인정보 위/수탁 동의 팝업 */
	pointAgrInfoPopup : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(monthEvent.detail.pointWinYn != "Y"){
			alert("당첨자만 위/수탁 동의가 가능 합니다.");
			return;
		}
		if(monthEvent.detail.pointLayerAgrFlag == "Y"){
			alert("이미 동의 하셨습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : "73"
			  , agrPopupFunction : "monthEvent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "monthEvent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updatePointAgrInfoAjax();"
		};

		monthEvent.detail.getLayerPopAgrInfoAjax(param);
	},
	/* 포인트 개인정보 위/수탁 동의 저장 */
	updatePointAgrInfoAjax : function(){
		if(monthEvent.detail.checkAllAgrmInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/updatePointAgrInfoJson.do"
				  , param
				  , monthEvent.detail._callback_updatePointAgrInfoAjax
			);
		}
	},
	_callback_updatePointAgrInfoAjax : function(json){
		monthEvent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.pointLayerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	}
}