$.namespace("monthEvent.detail");
/**
 * 2017.11.16 블랙올리브데이(2017.11.20 ~ 2017.11.24)
 
 * 최초로딩 : 당일 이벤트상품/쿠폰정보 가져오기 : getTodayEventPrdCoupon
              당첨이력 조회 : getMyProdWinList
             
 * 전고객 30% 할인쿠폰 영역 (fvrSeq : 1) 
   - checkIssuableBlackCoupon
 * 신규고객 상품 1000원 쿠폰영역(5개 상품 fvrSeq : 2,3,4,5,6) 
   - checkIssuableBlackCoupon
 * BLACK 경품응모 영역 (2개 상품 fvrSeq : 7,8) 
   - addBlackEvtProdJson
 * 앱 최초 로그인회원 경품응모 영역 (3개 상품 응모만 fvrSeq : 9)
   - checkAppFirstLoginJson
 * 개인정보 위수탁동의 업데이트 
   - updateBlackEvtAgrInfoJson
 */
monthEvent.detail = {
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "N",
	/* 당첨 여부 */
	myWinFlag : "N",
	/* 금일1000원쿠폰 fvrSeq */
	todayFvrSeq : "2",
	//당첨된 이벤트번호
	winFvrSeq : "0",
	//잔여쿠폰
	restCpnYn : "Y",
	
	init : function(){
		if(common.isLogin()){
			// 당첨이력 조회
			monthEvent.detail.getMyProdWinList();
		};
		monthEvent.detail.getTodayEventPrdCoupon();
		
		// 전고객 30% 할인쿠폰(fvrSeq : 1) 
		$("div#evtBtnA01").click(function(){
			monthEvent.detail.checkIssuableBlackCoupon("1");
		});
		// 신규고객 상품 1000원 쿠폰영역(5개 상품 fvrSeq : 2,3,4,5,6) 
		$("div#evtBtnB01").click(function(){
			if("N"== monthEvent.detail.restCpnYn){
				return;
			}
			monthEvent.detail.checkIssuableBlackCoupon(monthEvent.detail.todayFvrSeq);
		});
		// BLACK 경품응모 영역 (2개 상품 fvrSeq : 7,8) 
		$("div#evtBtnD03").click(function(){
			monthEvent.detail.addBlackEvtProdJson();
		});
		//앱 최초 로그인회원 경품응모 영역 (fvrSeq : 9)
		$("div#evtBtnE01").click(function(){
			monthEvent.detail.checkAppFirstLoginJson();
		});
		//나의 당첨내역 
		$("div#evtBtnD04").click(function(){
			monthEvent.detail.getMyProdWinListJson();
		});
		//개인정보 위수탁동의 팝업 - 블랙 경품응모
		$("div#evtBtnD05").click(function(){
			monthEvent.detail.popLayerAgrInfo();
		});
		//개인정보 위수탁동의 팝업 - 앱 첫 로그인
		$("div#evtBtnE02").click(function(){
			monthEvent.detail.getAppFirstSbscYn();
		});
		
		
		// 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
	},
	
	/* init 당첨내역 확인 */
	getMyProdWinList : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		var inFvrSeqArr = ["7","8"];
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			 ,  inFvrSeqArr : inFvrSeqArr.toString()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/getStmpMyWinListJson.do"
			  , param
			  , monthEvent.detail._callback_getMyProdWinList
		);
	},
	_callback_getMyProdWinList : function(json){
		if(json.ret == "0"){
			if(json.myEvtWinList.length > 0){
				monthEvent.detail.myWinFlag = "Y";
				monthEvent.detail.winFvrSeq = json.myEvtWinList[0].fvrSeq;
				monthEvent.detail.layerAgrFlag = json.myEvtWinList[0].mbrInfoUseAgrYn;
			}
		}
	},
	
	/* init 당일 이벤트 상품/쿠폰정보 가져오기  */
	getTodayEventPrdCoupon : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		}
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20171120/getTodayEventPrdCoupon.do"
			  , param
			  , monthEvent.detail._callback_getTodayEventPrdCoupon
		);
	},
	_callback_getTodayEventPrdCoupon : function(json){
		
		//쿠폰다운가능
		if(json.ret == "0"){
			monthEvent.detail.todayFvrSeq = json.fvrSeq;
			$("#goGoodsDetail").attr("onclick","javascript:common.link.commonMoveUrl('/goods/getGoodsDetail.do?goodsNo="+json.goodsNo+"')");
			$("#goGoodsImgUrl").attr("src", "http://image.oliveyoung.co.kr/uploads/contents/201711/20blackday/blackday_mc_prod_0"+json.fvrSeq+".jpg");
			$("#evtBtnB01_ing").show(); 
			$("#evtBtnB01_end").hide(); 
		//쿠폰소진 : 
		}else if(json.ret == "-1"){
			monthEvent.detail.todayFvrSeq = json.fvrSeq;
			monthEvent.detail.restCpnYn = "N";
			$("#goGoodsDetail").attr("onclick","javascript:common.link.commonMoveUrl('/goods/getGoodsDetail.do?goodsNo="+json.goodsNo+"')");
			$("#goGoodsImgUrl").attr("src", "http://image.oliveyoung.co.kr/uploads/contents/201711/20blackday/blackday_mc_prod_0"+json.fvrSeq+".jpg");
			$("#evtBtnB01_ing").hide(); 
			$("#evtBtnB01_end").show(); 
		//매칭 상품없음 
		}else if(json.ret == "-99"){
			monthEvent.detail.todayFvrSeq = json.fvrSeq;
			monthEvent.detail.restCpnYn = "N";
			$("#goGoodsImgUrl").attr("src", "http://image.oliveyoung.co.kr/uploads/contents/201711/20blackday/blackday_mc_prod_0"+json.fvrSeq+".jpg");
			$("#evtBtnB01_ing").hide(); 
			$("#evtBtnB01_end").show(); 
		}else{
			alert(json.message);
		}
	},
	
	/* 당첨내역 확인 */
	getMyProdWinListJson : function(){
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
			  , monthEvent.detail._callback_getMyProdWinListJson
		);
	},
	_callback_getMyProdWinListJson : function(json){
		if(json.ret == "0"){
			var myWinListHtml = "";
			if(json.myEvtWinList.length <= 0){
				myWinListHtml = "<tr><td colspan='2'>당첨이력이 없습니다.</td></tr>";
			}else{
				for(var i=0 ; i<json.myEvtWinList.length ; i++){
					myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
					if(json.myEvtWinList[i].fvrSeq < 4){
						monthEvent.detail.myWinFlag = "Y";
					}
				}
			}

			$("tbody#myWinListHtml").html(myWinListHtml);
			mevent.detail.eventShowLayer('eventBlackList');
		}else{
			alert(json.message);
		}
	},
	/* 개인정보 위탁동의 팝업 - Black 경품응모 */
	popLayerAgrInfo : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if("" == $("input[id='evtNo']:hidden").val()){
			alert("이벤트 번호가 존재하지 않습니다.");
			return;
		}
		if("Y" != monthEvent.detail.myWinFlag){
			alert("경품 당첨자만 개인정보 위수탁 동의 가능합니다");
			return;
		}
		if("N" != monthEvent.detail.layerAgrFlag){
			alert("이미 동의하셨습니다.");
			return;
		}
		
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : monthEvent.detail.winFvrSeq
			  , isTermsPopupYn : "N"
			  , isType : "273"
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateBlackEvtAgrInfoJson();"
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
	
	/**
	 * 개인정보 위수탁동의 저장
	 */
	updateBlackEvtAgrInfoJson : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , fvrSeq : monthEvent.detail.winFvrSeq
				  , setFlag : "N"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20171120/updateBlackEvtAgrInfoJson.do"
				  , param
				  , monthEvent.detail._callback_updateBlackEvtAgrInfoJson
			);
		}
		
	},
	_callback_updateBlackEvtAgrInfoJson : function(json) {
		mevent.detail.eventCloseLayer();
		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.layerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	
	/**
	 * 경품 응모
	 */
	addBlackEvtProdJson : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		var fvrSeq = $("[name='fvrSeq']:checked").val();
		if(fvrSeq=='undefined' || fvrSeq == null){
			alert("응모할 상품을 선택해주세요");
			return;
		}
		
		var param = {
				fvrSeq : fvrSeq
			  , evtNo : $("input[id='evtNo']:hidden").val()
		};
		
		$.ajax({
	       	 type 	:"GET"
	       	, dataType : "json"
	       	,url 	:_baseUrl + "event/20171120/addBlackEvtProdJson.do"
	       	,data 	: param
	       	,success: this._callback_addBlackEvtProdJson
	       	,error	: function (jqXHR,error, errorThrown){
				mevent.detail.eventShowLayer('eventLayerNone');  //오늘은 이미 참여하셨습니다.
	       	 }
		});
		
	},
	_callback_addBlackEvtProdJson : function(json) {
		if(json.ret !="0"){
			if(json.ret =="029"){
				mevent.detail.eventShowLayer('eventLayerNone'); //오늘은 이미 참여하셨습니다.
			}else{
				alert(json.message);
			}
		}else {
			if(json.winYn=="Y"){
				mevent.detail.eventShowLayer('eventLayerWinner'+json.fvrSeq);
				monthEvent.detail.myWinFlag = "Y";
				monthEvent.detail.winFvrSeq = json.fvrSeq;
			}else{
				mevent.detail.eventShowLayer('eventLayerNoneWinner');//아쉽지만 : 꽝
			}
		}
		
	},
	/**
	 * 쿠폰 다운로드
	 */
	checkIssuableBlackCoupon : function(fvrSeq) {
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
			  , _baseUrl + "event/20171120/checkIssuableBlackCoupon.do"
			  , param
			  , this._callback_checkIssuableBlackCoupon
		);
	},
	_callback_checkIssuableBlackCoupon : function(json) {
		alert(json.message);
	},

	/**
	 * 앱 최초 로그인 회원 응모화면 
	 */
	checkAppFirstLoginJson : function(){
		if(common.app.appInfo.isapp){
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}

			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				   ,fvrSeq : "9"
			};
			common.Ajax.sendRequest(
					"GET"
				  , _baseUrl + "event/20171120/checkAppFirstLoginJson.do"
				  , param
				  , this._callback_checkAppFirstLoginJson
			);
		}else{
			
			common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20171120/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			
		}
		
	},
	_callback_checkAppFirstLoginJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}else{
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , fvrSeq : "9"
				  , isTermsPopupYn : "N"
				  , isType : "232"
				  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
				  , closeFunction : "mevent.detail.eventCloseLayer();"
				  , confirmFunction : "monthEvent.detail.addAppFirstLoginJson();"
			};

			monthEvent.detail.getLayerPopAgrInfoAjax(param);
		}
	},
	
	addAppFirstLoginJson : function(){
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					  evtNo : $("input[id='evtNo']:hidden").val()
					, mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
					, mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};
			
			common.Ajax.sendRequest(
					"GET"
				  , _baseUrl + "event/20171120/addAppFirstLoginJson.do"
				  , param
				  , this._callback_addAppFirstLoginJsonn
			);
		}
		
	},
	_callback_addAppFirstLoginJsonn : function(json){
		mevent.detail.eventCloseLayer();
		alert(json.message);
	},
	
	//앱 첫 로그인 응모여부확인 
	getAppFirstSbscYn : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		var param = {
				  evtNo : $("input[id='evtNo']:hidden").val()
		};
		
		common.Ajax.sendRequest(
				"GET"
			  , _baseUrl + "event/20171120/getAppFirstSbscYn.do"
			  , param
			  , this._callback_getAppFirstSbscYn
		);
	},
	_callback_getAppFirstSbscYn : function(json){
		if(json.ret != "0"){
			alert("이벤트 응모자만 개인정보 위수탁 동의 가능합니다");
		}else{
			alert("이미 동의하셨습니다.");
		}
	},
	
	
}