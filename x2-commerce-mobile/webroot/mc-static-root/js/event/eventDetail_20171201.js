$.namespace("monthEvent.detail");
/**
 * 2017.12.01 블랙올리브데이(2017.12.01 ~ 2017.12.10)
 */
monthEvent.detail = {
	snsInitYn : "N",
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "N",
	/* 당첨 여부 */
	myWinFlag : "N",
	//주문금액 확인여부
	checkOrderAmt : "N",
	
	init : function(){
		
		monthEvent.detail.getCardEvtInfo();
		
		var tabId = $("#targetNum").val();
		if(tabId!=""){
			monthEvent.detail.goTab(tabId);
		}
		
		if(common.isLogin()){
			// 당첨이력 조회
			monthEvent.detail.getMyProdWinList();
		};
		//3단계 쿠폰영역
		$("div#goldenB01").click(function(){
			monthEvent.detail.checkIssueGoldenCoupon("1");
		});
		$("div#goldenB02").click(function(){
			monthEvent.detail.checkIssueGoldenCoupon("2");
		});
		$("div#goldenB03").click(function(){
			monthEvent.detail.checkIssueGoldenCoupon("3");
		});
		//앱 최초고객 응모 영역
		$("div#goldenD01").click(function(){
			monthEvent.detail.checkFirstAppLog();
		});
		//나의 구매금액 확인하기 
		$("div#orderBtn01").click(function(){
			monthEvent.detail.getMbrOrderAmt();
		});
		
		$("div[id^='giftBtn']").click(function(){
			if(common.app.appInfo.isapp){
				if(monthEvent.detail.checkOrderAmt!="Y"){
					alert("구매금액을 먼저 확인 해 주세요");
					return;
				}
				if($(this).hasClass("giftOn")){
					var fvrSeq = $(this).attr("id").split("giftBtn0")[1];
					monthEvent.detail.addSbscGoldenProd(fvrSeq);
				}else{
					var srcBaseUrl = "//image.oliveyoung.co.kr/uploads/contents/201712/01golden/";
					var imgFileNm = "golden_fail_03.png";
					
					$("#resultImg").attr("src",srcBaseUrl+imgFileNm);
					mevent.detail.eventShowLayer('eventLayerWinner');
				}
			}else{
				alert("앱에서 응모 가능합니다");
				return;
			}
			
		});
		
		//나의 당첨내역 
		$("div#giftNotice03").click(function(){
			monthEvent.detail.getMyProdWinListJson();
		});
		//개인정보 위수탁동의 팝업
		$("div#giftNotice02").click(function(){
			monthEvent.detail.popLayerAgrInfo();
		});
		/* URL 복사 */
		$("div#goldenA02").click(function(){
			$("div#linkUrlStr").html("<textarea readonly=''>https://m.oliveyoung.co.kr/m/E.do?evtNo=" + $("#evtNo").val() + "</textarea>");
			mevent.detail.eventShowLayer('eventLayerURL');
		});
		// 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
		
	},
	getCardEvtInfo : function(){
		var changeDate = "20171208";
	 
	    var now = new Date();
	    year = now.getFullYear();
	    month = now.getMonth() + 1; 
	    date = now.getDate();
	    if ((month + "").length < 2) {
            month = "0" + month; 
	    }
	    if ((date + "").length < 2) {
	            date = "0" + date; 
	    }
	 
	    today = year + "" + month + "" + date; //오늘날짜
	 
	    if ((eval(today) >= eval(changeDate)) ) {
	    	$("#goldenAfter").show();  
	    	$("#goldenBefore").hide(); 
	    }else{
	    	$("#goldenBefore").show();
	    	$("#goldenAfter").hide();  
	    }
	},
	
	evtChkLogin : function(tabId){
		
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage(null,'event/20171201/getEventDetail.do?evtNo='+$("#evtNo").val()+'&tabId='+tabId);
                return false;
            }
        }

        return true;
    },
	addComma :function (n) {
		var reg = /(^[+-]?\d+)(\d{3})/;
		
		while (reg.test(n)) {
			
			n = n.replace(reg, '$1' + ',' + '$2');
		}
		return n;
	},
	goTab :function(tabId){
		$("[id^=tabArea]").each(function(){
			$(this).hide();
		});
		$("[id^=tabImg]").each(function(){
			$(this).hide();
		});
		
		$("#tabArea"+tabId).show();
		$("#tabImg"+tabId).show();
		
		monthEvent.detail.checkOrderAmt = "N";
		
		$("#mbrOrdAmt").html("");
		$("#orderBtn01").show();
		$("#orderBtn02").hide();
		
		$("[id^='giftBtn']").each(function(){
			$(this).removeClass("giftOn").addClass("giftOff");
		});
		
		$("#eventTabImg").attr("tabIndex",-1).focus();
	},
	/* init 당첨내역 확인 */
	getMyProdWinList : function(){
		if(!monthEvent.detail.evtChkLogin("01")){
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
				monthEvent.detail.layerAgrFlag = json.myEvtWinList[0].mbrInfoUseAgrYn;
			}
		}
	},
	
	/* 당첨내역 확인 */
	getMyProdWinListJson : function(){
		if(!monthEvent.detail.evtChkLogin("02")){
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
			mevent.detail.eventShowLayer('eventGoldenList');
		}else{
			alert(json.message);
		}
	},
	 
	/*
	 * 앱 최초 고객 확인
	 */
	checkFirstAppLog : function(){
		if(common.app.appInfo.isapp){
			if(!monthEvent.detail.evtChkLogin("01")){
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
				  , _baseUrl + "event/20171201/checkFirstAppLog.do"
				  , param
				  , this._callback_checkFirstAppLog
			);
		}else{
			
			common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20171201/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			
		}
	}, 
	_callback_checkFirstAppLog : function(json){
		if(json.ret=="0"){
			alert("응모가 완료되었습니다.");
		}else{
			alert(json.message);
		}
	},
	
	/* 개인정보 위탁동의 팝업 - Golden 경품응모 */
	popLayerAgrInfo : function(){
		if(!monthEvent.detail.evtChkLogin("02")){
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
			  , isType : "273"
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateGoldenEvtAgrInfoJson();"
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
	updateGoldenEvtAgrInfoJson : function(){
		if(!monthEvent.detail.evtChkLogin("02")){
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
				  , _baseUrl + "event/20171201/updateGoldenEvtAgrInfoJson.do"
				  , param
				  , monthEvent.detail._callback_updateGoldenEvtAgrInfoJson
			);
		}
		
	},
	_callback_updateGoldenEvtAgrInfoJson : function(json) {
		mevent.detail.eventCloseLayer();
		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.layerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	/**
	 * 나의 구매금액 확인
	 */
	getMbrOrderAmt : function(){
		if(!monthEvent.detail.evtChkLogin("02")){
			return;
		}
		$("[id^='giftBtn']").each(function(){
			$(this).removeAttr("onClick");
			$(this).removeClass("giftOn");
			$(this).addClass("giftOff");
		});
		
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20171201/getMbrOrderAmt.do"
			  , param
			  , monthEvent.detail._callback_getMbrOrderAmt
		);
	},
	
	_callback_getMbrOrderAmt : function(json){
		monthEvent.detail.checkOrderAmt ="Y";
		
		$("#mbrOrdAmt").html(monthEvent.detail.addComma(json.payAmt));
		$("#orderBtn01").hide();
		$("#orderBtn02").show();
		
		var orderAmt = Number(json.payAmt);
		
		if(orderAmt >= 2000000){
			$("#giftBtn04").addClass("giftOn");
		}
		if(orderAmt >= 1000000){
			$("#giftBtn05").addClass("giftOn");;
		}
		if(orderAmt >= 500000){
			$("#giftBtn06").addClass("giftOn");;
		}
		if(orderAmt >= 100000){
			$("#giftBtn07").addClass("giftOn");;
		}
	},
	
	/**
	 * 경품 응모
	 */
	addSbscGoldenProd : function(fvrSeq){
		if(!monthEvent.detail.evtChkLogin("02")){
			return;
		}
		
		var param = {
				fvrSeq : fvrSeq
			  , evtNo : $("input[id='evtNo']:hidden").val()
		};
		
		$.ajax({
	       	 type 	:"GET"
	       	, dataType : "json"
	       	,url 	:_baseUrl + "event/20171201/addSbscGoldenProd.do"
	       	,data 	: param
	       	,success: this._callback_addSbscGoldenProd
		});
		
	},
	_callback_addSbscGoldenProd : function(json) {
		var srcBaseUrl = "//image.oliveyoung.co.kr/uploads/contents/201712/01golden/";
		var imgFileNm = "golden_fail_01.png";
		
		if(json.ret !="0"){
			if(json.ret =="013"){
				imgFileNm = "golden_fail_02.png"; //이미 응모하셨습니다.
				$("#resultImg").attr("src",srcBaseUrl+imgFileNm);
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else{
				alert(json.message);
			}
		}else {
			if(json.winYn=="Y"){
				switch (json.fvrSeq) {
				case "4":
					imgFileNm = "golden_winner_01.png"; //다이슨 헤어드라이기 슈퍼소닉
					break;
				case "5":
					imgFileNm = "golden_winner_02.png"; //마샬 스피커
					break;
				case "6":
					imgFileNm = "golden_winner_03.png"; //페라가모 세뇨리나 오드퍼륨
					break;
				case "7":
					imgFileNm = "golden_winner_04.png"; //투썸 플레이스 아메리카노
					break;
				default:
					break;
				}
				
				monthEvent.detail.myWinFlag = "Y";
			}else{
				imgFileNm = "golden_fail_01.png"; //아쉽지만 다음에 또 도전해주세요
			}
			$("#resultImg").attr("src",srcBaseUrl+imgFileNm);
			mevent.detail.eventShowLayer('eventLayerWinner');
		}
		
	},
	/**
	 * 쿠폰 다운로드
	 */
	checkIssueGoldenCoupon : function(fvrSeq) {
		if(!monthEvent.detail.evtChkLogin("01")){
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
			  , _baseUrl + "event/20171201/checkIssueGoldenCoupon.do"
			  , param
			  , this._callback_checkIssueGoldenCoupon
		);
	},
	_callback_checkIssueGoldenCoupon : function(json) {
		alert(json.message);
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
}