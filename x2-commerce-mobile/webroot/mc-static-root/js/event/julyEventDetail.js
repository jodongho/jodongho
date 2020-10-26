$.namespace("monthEvent.detail");
monthEvent.detail = {
	_ajax : common.Ajax,
	snsInitYn : "N",
	/* 당일출석여부 */
	addStmpFlag : "Y",
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "D",

	init : function(){
		if(common.isLogin()){
			/* 로그인한 회원 푸시 설정 조회 */
			monthEvent.detail.getMyPushFlag();
			/* 로그인한 회원 출석 현황 조회 */
			monthEvent.detail.getMyStmpEvent();
		}
		// 출석처리
		$("div#eAttend").click(function(){
			if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
				monthEvent.detail.addMyStmp();
			}else{
				alert("APP 에서만 참여 가능합니다.");
			}
		});
		// 닫기
		$(".eventHideLayer").click(function(){
			monthEvent.detail.eventCloseLayer();
		});
		// 나의 당첨내역
		$("div#eMylist").click(function(){
			monthEvent.detail.getStmpMyWinList();
		});
		// 개인정보위수탁동의
		$("div#ePolice").click(function(){
			monthEvent.detail.popLayerAgrInfo();
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
	/* 로그인한 회원 푸시 설정 조회 */
	getMyPushFlag : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getMyPushFlagJson.do"
			  , param
			  , monthEvent.detail._callback_getMyPushFlagJson
		);
	},
	_callback_getMyPushFlagJson : function(json){
		if(json.ret == "0"){
			if(json.MblEventAgrYn == "Y"){
				$("div#eNum2").removeClass("no_0").addClass("no_1");
				$("div#eNum2").find("em").text("1");
				$("div#eApp").addClass("on");
			}
		}else{
			alert(json.message);
		}
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
			$("div#eNum1").removeClass("no_0").addClass("no_" + json[1]);
			$("div#eNum1").find("em").text(json[1]);

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
				if(json.myTgtrSeq != ""){
					$("input[id='tgtrSeq']:hidden").val(json.myTgtrSeq);
					if(json.layerAgrFlag != undefined){
						monthEvent.detail.layerAgrFlag = json.layerAgrFlag;
					}
				}
			}
		}else{
			alert(json.message);
		}
	},
	/* 회원 출석 등록 */
	addMyStmp : function(){
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
			  , _baseUrl + "event/addMyStmpJson.do"
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
	addEvtProd : function(fvrSeq){
		if(fvrSeq == undefined || fvrSeq == "" || fvrSeq == "0"){
			alert("응모 사은품 정보가 없습니다.");
		}else{
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , fvrSeq : fvrSeq
			}
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/addEvtProdJson.do"
				  , param
				  , monthEvent.detail._callback_addEvtProdJson
			);
		}
	},
	_callback_addEvtProdJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}else{
			if(json.winYn != "Y"){
				$("div#eStamp" + (json.fvrSeq - 1)).addClass("end");
				monthEvent.detail.eventShowLayer("eventLayerWinner4");
			}else{
				if(json.fvrSeq == "2"){
					monthEvent.detail.eventShowLayer("eventLayerWinner1");
					$("div#eStamp1").addClass("end");
				}else if(json.fvrSeq == "3"){
					monthEvent.detail.eventShowLayer("eventLayerWinner2");
					$("div#eStamp2").addClass("end");
				}else if(json.fvrSeq == "4"){
					monthEvent.detail.eventShowLayer("eventLayerWinner3");
					$("div#eStamp3").addClass("end");
					$("input[id='tgtrSeq']:hidden").val(json.tgtrSeq);
					monthEvent.detail.layerAgrFlag = "Y";
				}
			}
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
			}
			$("tbody#myWinListHtml").html(myWinListHtml);
			monthEvent.detail.eventShowLayer("eventLayerWinDetail");
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
		if("" == $("input[id='tgtrSeq']:hidden").val() || "D" == monthEvent.detail.layerAgrFlag){
			alert("뚜레쥬르 상품권 당첨자만 개인정보 수집동의 필요합니다.");
			return;
		}
		if("N" == monthEvent.detail.layerAgrFlag){
			alert("이미 개인 정보 수신동의 하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isTermsPopupYn : "N"
			  , isType : "20"
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
	/* 개인정보 위탁 동의 정보 저장 */
	updateLayerAgrInfoAjax : function(){
		if(monthEvent.detail.checkAgrmInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
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
};