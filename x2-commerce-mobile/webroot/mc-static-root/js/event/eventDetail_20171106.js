$.namespace("monthEvent.detail");
/**
 * 2017.11.02 프로득템러를 위한 1+1 이벤트(2017.11.06 ~ 2017.11.12)
 * downFirstBuyCouponJson : 내꺼 쿠폰 다운로드
 * snsGiftCouponJson : 친구에게 쿠폰 선물하기(난수쿠폰 발급)
 * addDblProdJson : 경품 1+1 응모
 * getMyWinerInfoJson : 나의 당첨내역 
 * 
 */
monthEvent.detail = {
	snsInitYn : "N",
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "N",
	/* 당첨 여부 */
	myWinFlag : "N",
		
	init : function(){
		if(common.isLogin()){
			// 당첨이력 조회
			monthEvent.detail.getMyProdWinList();
		};
		
		// 내꺼 득템 할인쿠폰 25% 다운로드
		$("div#ePro03").click(function(){
			monthEvent.detail.checkIssuableDoubleCoupon("4");
		});
		// 경품 1+1 응모하기
		$("div#ePro06").click(function(){
			monthEvent.detail.addDoubleEvtProdJson();
		});
		//나의 당첨내역 
		$("div#ePro07").click(function(){
			monthEvent.detail.getMyProdWinListJson();
		});
		//개인정보 위수탁동의 팝업
		$("div#ePro08").click(function(){
			monthEvent.detail.popLayerAgrInfo();
		});
		//쿠폰 선물하기
		$("div#ePro11").click(function(){
			monthEvent.detail.getGiftCpnRndmValJson();
		});
		//개인정보 위수탁동의 저장
		$("div#ePro12").click(function(){
			monthEvent.detail.updateDoublePrdEvtAgrInfoJson();
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
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
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
			}
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

				monthEvent.detail.layerAgrFlag = json.myEvtWinList[0].mbrInfoUseAgrYn;
			}

			$("tbody#myWinListHtml").html(myWinListHtml);
			mevent.detail.eventShowLayer('eventLayerWinDetail');
		}else{
			alert(json.message);
		}
	},
	
	/* 개인정보 위탁동의 팝업 */
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
			  , isTermsPopupYn : "N"
			  , isType : "232"
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateDoublePrdEvtAgrInfoJson();"
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
	updateDoublePrdEvtAgrInfoJson : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , setFlag : "N"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20171106/updateDoublePrdEvtAgrInfoJson.do"
				  , param
				  , monthEvent.detail._callback_updateDoublePrdEvtAgrInfoJson
			);
		}
		
	},
	_callback_updateDoublePrdEvtAgrInfoJson : function(json) {
		mevent.detail.eventCloseLayer();
		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.layerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	
	/**
	 * 경품 1+1 응모
	 */
	addDoubleEvtProdJson : function(){
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
	       	,url 	:_baseUrl + "event/20171106/addDoubleEvtProdJson.do"
	       	,data 	: param
	       	,success: this._callback_addDoubleEvtProdJson
	       	,error	: function (jqXHR,error, errorThrown){
	       		mevent.detail.eventShowLayer('eventLayerWinner4'); //오늘은 이미 참여하셨습니다.
	       	 }
		});
		
	},
	_callback_addDoubleEvtProdJson : function(json) {
		if(json.ret !="0"){
			if(json.ret =="029"){
				mevent.detail.eventShowLayer('eventLayerWinner4'); //오늘은 이미 참여하셨습니다.
			}else{
				alert(json.message);
			}
		}else {
			if(json.winYn=="Y"){
				mevent.detail.eventShowLayer('eventLayerWinner'+json.fvrSeq);
				monthEvent.detail.myWinFlag = "Y";
			}else{
				mevent.detail.eventShowLayer('eventLayerWinner5');//아쉽지만 : 꽝
			}
		}
		
	},
	/**
	 * 내꺼 쿠폰 다운로드
	 */
	checkIssuableDoubleCoupon : function(fvrSeq) {
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
			  , _baseUrl + "event/20171106/checkIssuableDoubleCoupon.do"
			  , param
			  , this._callback_checkIssuableDoubleCoupon
		);
	},
	_callback_checkIssuableDoubleCoupon : function(json) {
		alert(json.message);
	},
	/**
	 * 쿠폰선물하기 (난수쿠폰 발급)
	 */
	getGiftCpnRndmValJson : function(){
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
				fvrSeq : "5"
			  , evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendRequest(
				"GET"
			  , _baseUrl + "event/20171106/getGiftCpnRndmValJson.do"
			  , param
			  , this._callback_getGiftCpnRndmValJson
		);
		
	},
	_callback_getGiftCpnRndmValJson : function(json) {
		
		if(json.ret!="0"){
			alert(json.message);
		}else{
			var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
			var imgUrl ="http://image.oliveyoung.co.kr/uploads/contents/201711/06plusone/pro_sns_kakao.jpg";
			var targetNum = json.rndmVal; //난수쿠폰번호
			var title=json.mbrNm+"님의 쿠폰선물 도착\n";
			title+="올리브영 모바일 25% 할인쿠폰\n";
			title+="1만원이상 최대 3,000원/~11/12 까지 \n";
			title+="\n★ 쿠폰번호 : "+targetNum;
			title+="\n★ 하단 링크 클릭 후 쿠폰번호를 등록하세요!";
			
			if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
				bnrImgUrlAddr = "";
			} else {
				bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
			}

			// 이미지가 없을 경우만 배너로 교체
			if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
				imgUrl = bnrImgUrlAddr;
			}

			var snsShareUrl = _baseUrl + "mypage/getCouponList.do";

			if(monthEvent.detail.snsInitYn == "N"){
				common.sns.init(imgUrl, title, snsShareUrl);
				monthEvent.detail.snsInitYn = "Y";
			}
			
			common.sns.doShare('kakaotalk');
		}
	},
}