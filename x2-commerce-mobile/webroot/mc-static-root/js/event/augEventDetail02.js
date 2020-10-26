$.namespace("monthEvent.detail");
monthEvent.detail = {
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "N",
	/* 당첨 여부 */
	myWinFlag : "N",

	init : function(){
		if(common.isLogin()){
			/* 단골 응모 정보 조회 */
			monthEvent.detail.getFrequenterMyEntryInfo();
			/* 당첨내역 확인 */
			monthEvent.detail.getStmpMyWinList();
		}
		/* 주문2회 쿠폰 */
		$("div#evtCoupon01").click(function(){
			monthEvent.detail.getHiddenCpnDown();
		});
		// 나의 당첨내역
		$("div#evtMylist").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			monthEvent.detail.eventShowLayer("eventLayerWinDetail");
		});
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
	/* 단골 응모 정보 조회 */
	getFrequenterMyEntryInfo : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getFrequenterMyEntryInfoJson.do"
			  , param
			  , monthEvent.detail._callback_getFrequenterMyEntryInfoJson
		);
	},
	_callback_getFrequenterMyEntryInfoJson : function(json){
		if(json.ordInfoCnt > 0){
			var varStr = json.ordInfoCnt.toString();
			var htmlStr = "";
			for(i=0 ; i<varStr.length ; i++){
				htmlStr += '<em class="no' + varStr.substr(i, i+1) + '"><img src="//image.oliveyoung.co.kr/uploads/contents/201708/event02/custom_no_' + varStr.substr(i, i+1) + '.png" alt="' + varStr.substr(i, i+1) + '" /></em>';
			}
			$("div.evtNo1").find("span").html(htmlStr);
		}
		if(json.leftEntryCnt > 0){
			var varStr = json.leftEntryCnt.toString();
			var htmlStr = "";
			for(i=0 ; i<varStr.length ; i++){
				htmlStr += '<em class="no' + varStr.substr(i, i+1) + '"><img src="//image.oliveyoung.co.kr/uploads/contents/201708/event02/custom_no_' + varStr.substr(i, i+1) + '.png" alt="' + varStr.substr(i, i+1) + '" /></em>';
			}
			$("div.evtNo2").find("span").html(htmlStr);
		}else{
			$("div.evtNo2").find("span").html('<em class="no0"><img src="//image.oliveyoung.co.kr/uploads/contents/201708/event02/custom_no_0.png" alt="0" /></em>');
		}
		if(json.useEntryCnt > 0){
			var varStr = json.useEntryCnt.toString();
			var htmlStr = "";
			for(i=0 ; i<varStr.length ; i++){
				htmlStr += '<em class="no' + varStr.substr(i, i+1) + '"><img src="//image.oliveyoung.co.kr/uploads/contents/201708/event02/custom_no_' + varStr.substr(i, i+1) + '.png" alt="' + varStr.substr(i, i+1) + '" /></em>';
			}
			$("div.evtNo3").find("span").html(htmlStr);
		}else{
			$("div.evtNo3").find("span").html('<em class="no0"><img src="//image.oliveyoung.co.kr/uploads/contents/201708/event02/custom_no_0.png" alt="0" /></em>');
		}
	},
	/* 단골 고객 경품 응모 */
	addFrequenter : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		// 응모기회 횟수 체크
		
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addFrequenterJson.do"
			  , param
			  , monthEvent.detail._callback_addFrequenterJson
		);
	},
	_callback_addFrequenterJson : function(json){
		if(json.ret == "013"){
			// 이미 응모하셨습니다
			monthEvent.detail.eventShowLayer("eventLayerWinner8");
		}else if(json.ret == "0"){
			if(json.fvrSeq != undefined && json.fvrSeq != ""){
				// 당첨
				monthEvent.detail.eventShowLayer("eventLayerWinner" + json.fvrSeq);
			}else{
				// 다음 기회
				monthEvent.detail.eventShowLayer("eventLayerWinner7");
			}
			/* 단골 응모 정보 조회 */
			monthEvent.detail.getFrequenterMyEntryInfo();
			/* 당첨내역 확인 */
			monthEvent.detail.getStmpMyWinList();
		}else{
			alert(json.message);
		}
	},
	/* 주문2회 쿠폰 */
	getHiddenCpnDown : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getHiddenCpnDownJson.do"
			  , param
			  , monthEvent.detail._callback_getHiddenCpnDownJson
		);
	},
	_callback_getHiddenCpnDownJson : function(json){
		if(json.ret == "0"){
			alert(json.message);
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
					if(json.myEvtWinList[i].fvrSeq <= 4){
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
		if("N" == monthEvent.detail.myWinFlag){
			alert("1등-4등 당첨자만 개인정보 수집동의가 필요합니다.");
			return;
		}
		if("N" != monthEvent.detail.layerAgrFlag){
			alert("이미 동의하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isTermsPopupYn : "N"
			  , isType : "73"
			  , agrPopupFunction : "monthEvent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "monthEvent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateLayerAgrInfoReacAjax();"
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
	updateLayerAgrInfoReacAjax : function(){
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
				  , monthEvent.detail._callback_updateLayerAgrInfoReacAjax
			);
		}
	},
	_callback_updateLayerAgrInfoReacAjax : function(json){
		monthEvent.detail.eventCloseLayer();

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