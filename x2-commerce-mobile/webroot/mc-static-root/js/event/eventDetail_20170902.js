$.namespace("monthEvent.detail");
monthEvent.detail = {
	init : function(){
		// 20%쿠폰 다운로드
		$("div#eWelcome01").click(function(){
			monthEvent.detail.downFirstBuyCouponJson("1");
		});
		// 배송비 쿠폰 다운로드
		$("div#eWelcome02").click(function(){
			monthEvent.detail.downFirstBuyCouponJson("2");
		});
		// 공연응모
		$("div#eWelcome04").click(function(){
			monthEvent.detail.checkFirstBuyShowJson();
		});
		// CGV
		$("div#eWelcome06").click(function(){
			monthEvent.detail.checkTowBuyCgvJson();
		});
		// 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
	},
	/**
	 * 2017.09.11 웰컴 라운지 쿠폰 다운로드 처리(09.12~09.30)
	 */
	downFirstBuyCouponJson : function(fvrSeq) {
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(typeof fvrSeq == "undefined" || fvrSeq == ""){
			alert("쿠폰 정보가 없습니다.");
			return;
		}

		var param = {
				fvrSeq : fvrSeq
			  , evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendRequest(
				"GET"
			  , _baseUrl + "event/201709/downFirstBuyCouponJson.do"
			  , param
			  , this._callback_downFirstBuyCouponJson
		);
	},
	_callback_downFirstBuyCouponJson : function(json) {
		alert(json.message);
	},
	/**
	 * 2017.09.11 웰컴 라운지 공연 응모 가능 확인(09.12~09.30)
	 */
	checkFirstBuyShowJson : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendRequest(
				"GET"
			  , _baseUrl + "event/201709/checkFirstBuyShowJson.do"
			  , param
			  , this._callback_checkFirstBuyShowJson
		);
	},
	_callback_checkFirstBuyShowJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}else{
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , isTermsPopupYn : "N"
				  , isType : "231"
				  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
				  , closeFunction : "mevent.detail.eventCloseLayer();"
				  , confirmFunction : "monthEvent.detail.addFirstBuyShowJson();"
			};

			monthEvent.detail.getLayerPopAgrInfoAjax(param);
		}
	},
	/**
	 * 2017.09.11 웰컴 라운지 CGV 응모 가능 확인(09.12~09.30)
	 */
	checkTowBuyCgvJson : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendRequest(
				"GET"
			  , _baseUrl + "event/201709/checkTowBuyCgvJson.do"
			  , param
			  , this._callback_checkTowBuyCgvJson
		);
	},
	_callback_checkTowBuyCgvJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}else{
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , isTermsPopupYn : "N"
				  , isType : "232"
				  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
				  , closeFunction : "mevent.detail.eventCloseLayer();"
				  , confirmFunction : "monthEvent.detail.addTowBuyCgvJson();"
			};

			monthEvent.detail.getLayerPopAgrInfoAjax(param);
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
	/**
	 * 2017.09.11 웰컴 라운지 공연 응모(09.12~09.30)
	 */
	addFirstBuyShowJson : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}

		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};
			common.Ajax.sendRequest(
					"GET"
				  , _baseUrl + "event/201709/addFirstBuyShowJson.do"
				  , param
				  , this._callback_addFirstBuyShowJson
			);
		}
	},
	_callback_addFirstBuyShowJson : function(json){
		mevent.detail.eventCloseLayer();
		if(json.ret == "0"){
			alert("응모되셨습니다");
		}else{
			alert(json.message);
		}
	},
	/**
	 * 2017.09.11 웰컴 라운지 CGV 응모(09.12~09.30)
	 */
	addTowBuyCgvJson : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}

		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};
			common.Ajax.sendRequest(
					"GET"
				  , _baseUrl + "event/201709/addTowBuyCgvJson.do"
				  , param
				  , this._callback_addTowBuyCgvJson
			);
		}
	},
	_callback_addTowBuyCgvJson : function(json){
		mevent.detail.eventCloseLayer();
		if(json.ret == "0"){
			alert("응모되셨습니다");
		}else{
			alert(json.message);
		}
	},
}