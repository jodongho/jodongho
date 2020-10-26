$.namespace("monthEvent.detail");
monthEvent.detail = {
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "N",
	/* 당첨 여부 */
	myWinFlag : "N",
	/* 출석완료여부 */
	addStmpFlag : "Y",
	/* App 주문이력 */
	appOrdYn : "N",

	init : function(){
		if(common.isLogin()){
			// 당첨이력 조회
			monthEvent.detail.getStmpMyWinList();
			/* 로그인한 회원 출석 현황 조회 */
			monthEvent.detail.getMyStmpEvent();
			/* 앱 구매이력 */
			monthEvent.detail.getAppOrderCnt();
		};
		// 출석처리
		$("div#eAttend").click(function(){
			monthEvent.detail.addMyStmp();
		});
		// 나의 당첨내역
		$("div#eMylist").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			mevent.detail.eventShowLayer("eventLayerWinDetail");
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
		// 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
	},
	/* 회원 출석 등록 */
	addMyStmp : function(){
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
		if(monthEvent.detail.addStmpFlag != "Y"){
			alert("출석도장을 모두 채우셨습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "1"
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/201709/addMyStmpJson.do"
			  , param
			  , monthEvent.detail._callback_addMyStmpJson
		);
	},
	_callback_addMyStmpJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}
		monthEvent.detail.getMyStmpEvent();
	},
	/* 로그인한 회원 출석 현황 조회 */
	getMyStmpEvent : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getMyStmpEventJson.do"
			  , param
			  , monthEvent.detail._callback_getMyStmpEventJson
		);
	},
	_callback_getMyStmpEventJson : function(json){
		if(json.ret == "0"){
			$("div#eDay1").find("li").each(function(index){
				if(index < json[1]){
					$(this).addClass("on");
				}
			});
			/* 출석일수 표시 */
			$("div[id='eNum1']").removeClass("no_0").addClass("no_" + json[1]);
			$("div[id='eNum1']").find("em").text(json[1]);

			if(json[1] >= 3){
				if(json[2] == 0){
					$("div#eStamp1").addClass("on");
					if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
						$("div#eStamp1").attr("onclick", "monthEvent.detail.addEvtProd('2');");
					}else{
						$("div#eStamp1").attr("onclick", "alert('APP 에서만 참여 가능합니다.');");
					}
				}else{
					$("div#eStamp1").addClass("end");
				}
			}
			if(json[1] >= 6){
				if(json[3] == 0){
					$("div#eStamp2").addClass("on");
					if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
						$("div#eStamp2").attr("onclick", "monthEvent.detail.addEvtProd('3');");
					}else{
						$("div#eStamp2").attr("onclick", "alert('APP 에서만 참여 가능합니다.');");
					}
				}else{
					$("div#eStamp2").addClass("end");
				}
			}
			if(json[1] >= 9){
				if(json[4] == 0){
					$("div#eStamp3").addClass("on");
					if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
						$("div#eStamp3").attr("onclick", "monthEvent.detail.addEvtProd('4');");
					}else{
						$("div#eStamp3").attr("onclick", "alert('APP 에서만 참여 가능합니다.');");
					}
				}else{
					$("div#eStamp3").addClass("end");
				}

				monthEvent.detail.addStmpFlag = "N";
			}
		}else{
			alert(json.message);
		}
	},
	/* 사은품 응모 */
	addEvtProd : function(fvrSeq){
		if(fvrSeq != "2" && fvrSeq != "3" && fvrSeq != "4"){
			alert("응모 사은품 정보가 없습니다.");
		}else{
			if(fvrSeq == "4" && monthEvent.detail.appOrdYn != "Y"){
				alert("도장이 모두 채워져야 응모 가능합니다.");
				return;
			}

			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , fvrSeq : fvrSeq
			}

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/201709/addStmpEvtProdJson.do"
				  , param
				  , monthEvent.detail._callback_addStmpEvtProdJson
			);
		}
	},
	_callback_addStmpEvtProdJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}else{
			if(json.winYn != "Y"){
				$("div#eStamp" + (json.fvrSeq - 1)).removeClass("on").addClass("end");
				mevent.detail.eventShowLayer("eventLayerWinner4");
			}else{
				if(json.fvrSeq == "2"){
					mevent.detail.eventShowLayer("eventLayerWinner1");
					$("div#eStamp1").removeClass("on").addClass("end");
				}else{
					if(json.fvrSeq == "3"){
						mevent.detail.eventShowLayer("eventLayerWinner2");
						$("div#eStamp2").removeClass("on").addClass("end");
					}else if(json.fvrSeq == "4"){
						mevent.detail.eventShowLayer("eventLayerWinner3");
						$("div#eStamp3").removeClass("on").addClass("end");
					}
					monthEvent.detail.myWinFlag = "Y";
				}
				// 당첨이력 조회
				monthEvent.detail.getStmpMyWinList();
			}
		}
	},
	/* 앱 구매 이력 */
	getAppOrderCnt : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getMyAppOrderCntJson.do"
			  , param
			  , monthEvent.detail._callback_getMyAppOrderCntJson
		);
	},
	_callback_getMyAppOrderCntJson : function(json){
		if(json.ordInfo.ordCnt > 0){
			$("div[id='eNum2']").removeClass("no_0").addClass("no_" + json.ordInfo.ordCnt);
			$("div[id='eNum2']").find("em").text(json.ordInfo.ordCnt);
			$("div[id='eApp']").addClass("on");

			monthEvent.detail.appOrdYn = "Y";
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
					if(json.myEvtWinList[i].fvrSeq > 2){
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
	popLayerAgrInfo : function(type){
		if("" == $("input[id='evtNo']:hidden").val()){
			alert("이벤트 번호가 존재하지 않습니다.");
			return;
		}
		if("Y" != monthEvent.detail.myWinFlag){
			alert("기프티콘 당첨자만 개인정보 수집동의가 필요합니다.");
			return;
		}
		if("N" != monthEvent.detail.layerAgrFlag){
			alert("이미 동의하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isTermsPopupYn : "N"
			  , isType : "232"
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateMyStmpEventAgrYn();"
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
	/* 개인정보 위탁 동의 정보 저장 */
	updateMyStmpEventAgrYn : function(){
		if(monthEvent.detail.checkAgrmInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , setFlag : "N"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/201709/updateMyStmpEventAgrYnJosn.do"
				  , param
				  , monthEvent.detail._callback_updateMyStmpEventAgrYnJosn
			);
		}
	},
	_callback_updateMyStmpEventAgrYnJosn : function(json){
		mevent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
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