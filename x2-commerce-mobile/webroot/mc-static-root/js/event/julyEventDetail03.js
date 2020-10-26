$.namespace("monthEvent.detail");
monthEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "N",
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "N",
	/* 파우치 당첨 여부 */
	myWinFlag : "N",

	init : function(){
		if(common.isLogin()){
			// 카테고리 등록 내역 조회
			monthEvent.detail.getMyEventOrderCategoryJson();
			// 당첨이력 조회
			monthEvent.detail.getStmpMyWinList();
		};
		/* 파우치 채우기 */
		$("div#eOrder").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}
			monthEvent.detail.addMyEventOrderCategoryJson();
		});
		/* 응모 */
		$("div#eApply").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}
			monthEvent.detail.addEventJson();
		});
		// 닫기
		$(".eventHideLayer").click(function(){
			monthEvent.detail.eventCloseLayer();
		});
		// 나의 당첨내역
		$("div#eWinner").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			monthEvent.detail.eventShowLayer("eventLayerWinDetail");
		});
		// 개인정보위수탁동의
		$("div#ePolice").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}
			monthEvent.detail.popLayerAgrInfo();
		});
		// 쿠폰 참여
		$("a#randomCoupon").click(function(){
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
			monthEvent.detail.getRandomCouponJson();
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
	/* 카테고리 등록 내역 조회 */
	getMyEventOrderCategoryJson : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getMyEventOrderCategoryJson.do"
			  , param
			  , monthEvent.detail._callback_getMyEventOrderCategory
		);
	},
	_callback_getMyEventOrderCategory : function(json){
		if(json.ret == "0" && json.evtTgtrList.length > 0){
			for(i=0 ; i<json.evtTgtrList.length ; i++){
				$("div#mission0" + json.evtTgtrList[i].noteCont).addClass("on");
			}
		}
	},
	/* 주문상품 카테고리 조회 */
	addMyEventOrderCategoryJson : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addMyEventOrderCategoryJson.do"
			  , param
			  , monthEvent.detail._callback_addMyEventOrderCategory
		);
	},
	_callback_addMyEventOrderCategory : function(json){
		if(json.ret == "0"){
			if(json.categoryList.length > 0){
				for(i=0 ; i<json.categoryList.length ; i++){
					$("div#mission0" + json.categoryList[i]).addClass("on");
				}
			}
		}else{
			alert(json.message);
		}
	},
	/* 당첨내역 확인 */
	getStmpMyWinList : function(){
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
				}

				monthEvent.detail.layerAgrFlag = json.myEvtWinList[0].mbrInfoUseAgrYn;
				monthEvent.detail.myWinFlag = "Y";
			}

			$("tbody#myWinListHtml").html(myWinListHtml);
		}else{
			alert(json.message);
		}
	},
	/* 경품응모 */
	addEventJson : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getOrderCategoryEvtAddCntJson.do"
			  , param
			  , monthEvent.detail._callback_getOrderCategoryEvtAddCntJson
		);
	},
	_callback_getOrderCategoryEvtAddCntJson : function(json){
		if(json.ret == "0"){
			if(json.myJoinCnt > 0){
				alert("이미 참여 하셨습니다.");
			}else if(json.evtAddCnt >= 3){
				var param = {
						evtNo : $("input[id='evtNo']:hidden").val()
				};

				common.Ajax.sendJSONRequest(
						"GET"
					  , _baseUrl + "event/addPouchEventJson.do"
					  , param
					  , monthEvent.detail._callback_addPouchEventJson
				);
			}else{
				alert("이벤트 참여 대상자가 아님니다.");
			}
		}else{
			alert(json.message);
		}
	},
	_callback_addPouchEventJson : function(json){
		if(json.ret == "0"){
			monthEvent.detail.eventShowLayer("eventLayerWinner" + json.myEvtItem);
			if(json.myEvtItem != "1"){
				monthEvent.detail.getStmpMyWinList();
			}
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
		if("N" == monthEvent.detail.myWinFlag){
			alert("당첨 이력이 없습니다.");
			return;
		}
		if("N" != monthEvent.detail.layerAgrFlag){
			alert("이미 개인 정보 수신동의 하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isTermsPopupYn : "N"
			  , isType : "30"
			  , agrPopupFunction : "monthEvent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "monthEvent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateLayerAgrInfoAjax();"
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
	getRandomCouponJson : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getRandomCouponJson.do"
			  , param
			  , monthEvent.detail._callback_getRandomCouponJson
		);
	},
	_callback_getRandomCouponJson : function(json){
		if(json.ret == "0"){
			monthEvent.detail.eventShowLayer("eventLayerWinner" + json.couponInfo);
		}else if(json.ret == "013"){
			monthEvent.detail.eventShowLayer("eventLayerWinner4");
		}else{
			alert(json.message);
		}
	},
	/* 개인정보 위탁 동의 정보 저장 */
	updateLayerAgrInfoAjax : function(){
		if(monthEvent.detail.checkAgrmInfo()){
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
				  , monthEvent.detail._callback_updateLayerAgrInfoAjax
			);
		}
	},
	_callback_updateLayerAgrInfoAjax : function(json){
		monthEvent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("응모되었습니다.");
			monthEvent.detail.layerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	/* 개인정보 필수값 체크 */
	checkAgrmInfo : function(){
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
}