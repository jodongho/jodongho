$.namespace("monthEvent.detail");
monthEvent.detail = {
	snsInitYn : "N",
	baseImgPath : _cdnImgUrl + "contents/201711/13exam/",
	/* 수험 당첨 여부 */
	myExamineesWinFlag : "N",
	/* 수험 개인정보 수신동의 여부 */
	examineesLayerAgrFlag : "N",
	/* 주문 당첨 여부 */
	myOrdWinFlag : "N",
	/* 주문 개인정보 수신동의 여부 */
	ordLayerAgrFlag : "N",

	init : function(){
		if(common.isLogin()){
			/* 당첨내역 확인 */
			monthEvent.detail.getMyWinList();
		};
		/* 1번 문제 */
		$("div#eExam01").click(function(){
			var chkVal = $("input[name='ex01']:radio:checked").val();
			if(chkVal != undefined){
				monthEvent.detail.goQuizSubmit("1", chkVal);
			}else{
				alert("선택 답이 없습니다.");
			}
		});
		/* 2번 문제 */
		$("div#eExam02").click(function(){
			var chkVal = $("input[name='ex02']:radio:checked").val();
			if(chkVal != undefined){
				monthEvent.detail.goQuizSubmit("2", chkVal);
			}else{
				alert("선택 답이 없습니다.");
			}
		});
		/* 3번 문제 */
		$("div#eExam03").click(function(){
			var chkVal = $("input[name='ex03']:radio:checked").val();
			if(chkVal != undefined){
				monthEvent.detail.goQuizSubmit("3", chkVal);
			}else{
				alert("선택 답이 없습니다.");
			}
		});
		/* 4번 문제 */
		$("div#eExam04").click(function(){
			var chkVal = $("input[name='ex04']:radio:checked").val();
			if(chkVal != undefined){
				monthEvent.detail.goQuizSubmit("4", chkVal);
			}else{
				alert("선택 답이 없습니다.");
			}
		});
		/* 5교시 당첨내역 */
		$("div#eBonus02").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			mevent.detail.eventShowLayer('eventBonusWin');
		});
		/* 수험생 당첨내역 */
		$("div#eTrip02").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			mevent.detail.eventShowLayer('eventTripWin');
		});
		/* URL 복사 */
		$("div#eURL").click(function(){
			var viewUrl = _baseUrl + "E.do?evtNo=" + $("#evtNo").val();
			$("textarea#CopyUrl").val(viewUrl);

			mevent.detail.eventShowLayer('eventLayerURL');
		});
		// 닫기
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
	},
	/* 퀴즈 참여 */
	goQuizSubmit : function(questionNum, answer){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(questionNum == ""){
			alert("질문 번호가 없습니다.");
			return;
		}
		if(answer == ""){
			alert("선택 답이 없습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , questionNum : questionNum
			  , answer : answer
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/20171103/goQuizSubmitJosn.do"
			  , param
			  , monthEvent.detail._callback_goQuizSubmitJosn
		);
	},
	_callback_goQuizSubmitJosn : function(json){
		if(json.ret == "0"){
			$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_coupon_0" + json.fvrSeq + ".png");
			mevent.detail.eventShowLayer('eventLayerWinner');
		}else{
			if(json.ret == "004"){
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_fail_02.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else if(json.ret == "036"){
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_fail_01.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else{
				alert(json.message);
			}
		}
	},
	/* 구매자 응모 */
	setOrderEvent : function(){
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
			  , _baseUrl + "event/20171103/setOrderEventJosn.do"
			  , param
			  , monthEvent.detail._callback_setOrderEventJosn
		);
	},
	_callback_setOrderEventJosn : function(json){
		if(json.ret == "0"){
			if(json.winYn == "Y"){
				monthEvent.detail.myOrdWinFlag = json.winYn;
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_coupon_0" + json.fvrSeq + ".png");

				monthEvent.detail.getMyWinList();
			}else{
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_fail_03.png");
			}
			mevent.detail.eventShowLayer('eventLayerWinner');
		}else{
			if(json.ret == "004"){
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_fail_07.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else if(json.ret == "046"){
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_fail_04.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else{
				alert(json.message);
			}
		}
	},
	/* 수험생 응모 */
	setExamineesEvent : function(){
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
			  , _baseUrl + "event/20171103/setExamineesEventJosn.do"
			  , param
			  , monthEvent.detail._callback_setExamineesEventJosn
		);
	},
	_callback_setExamineesEventJosn : function(json){
		if(json.ret == "0"){
			if(json.winYn == "Y"){
				monthEvent.detail.myExamineesWinFlag = json.winYn;
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_coupon_0" + json.fvrSeq + ".png");

				monthEvent.detail.getMyWinList();
			}else{
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_fail_05.png");
			}
			mevent.detail.eventShowLayer('eventLayerWinner');
		}else{
			if(json.ret == "004"){
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_fail_07.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else if(json.ret == "019"){
				$("img#resultImg").attr("src", monthEvent.detail.baseImgPath + "exam_fail_06.png");
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
			  , _baseUrl + "event/20171103/getMyWinListJson.do"
			  , param
			  , monthEvent.detail._callback_getMyWinListJson
		);
	},
	_callback_getMyWinListJson : function(json){
		if(json.ret == "0"){
			if(json.myEvtWinList.length > 0){
				var myWinListHtml05 = "";
				var myWinListHtmlEtc = "";

				for(var i=0 ; i<json.myEvtWinList.length ; i++){
					if(json.myEvtWinList[i].fvrSeq > 7){
						myWinListHtmlEtc += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
						monthEvent.detail.myExamineesWinFlag = "Y";

						if(json.myEvtWinList[i].mbrInfoUseAgrYn == "Y"){
							monthEvent.detail.examineesLayerAgrFlag = "Y";
						}
					}else{
						myWinListHtml05 += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
						monthEvent.detail.myOrdWinFlag = "Y";

						if(json.myEvtWinList[i].mbrInfoUseAgrYn == "Y"){
							monthEvent.detail.ordLayerAgrFlag = "Y";
						}
					}
				}

				if(myWinListHtml05 != ""){
					$("tbody#myWinListHtml05").html(myWinListHtml05);
				}
				if(myWinListHtmlEtc != ""){
					$("tbody#myWinListHtmlEtc").html(myWinListHtmlEtc);
				}
			}
		}else{
			alert(json.message);
		}
	},
	/* 주문 개인정보 위탁동의 팝업 */
	popOrdLayerAgrInfo : function(){
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
		if("Y" != monthEvent.detail.myOrdWinFlag){
			alert("개인정보 위수탁 동의 대상이 아닙니다.");
			return;
		}
		if("N" != monthEvent.detail.ordLayerAgrFlag){
			alert("이미 동의하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : "273"
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateMyOrdEventAgrYn();"
		};
		monthEvent.detail.getLayerPopAgrInfoAjax(param);
	},
	/* 수험생 개인정보 위탁동의 팝업 */
	popExamineesLayerAgrInfo : function(){
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
		if("Y" != monthEvent.detail.myExamineesWinFlag){
			alert("개인정보 위수탁 동의 대상이 아닙니다.");
			return;
		}
		if("N" != monthEvent.detail.examineesLayerAgrFlag){
			alert("이미 동의하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : "271"
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateMyExamineesEventAgrYn();"
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
	updateMyOrdEventAgrYn : function(){
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , setFlag : "N"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20171103/updateMyOrdEventAgrYnJosn.do"
				  , param
				  , monthEvent.detail._callback_updateMyOrdEventAgrYnJosn
			);
		}
	},
	_callback_updateMyOrdEventAgrYnJosn : function(json){
		mevent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.ordLayerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	updateMyExamineesEventAgrYn : function(){
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , setFlag : "N"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20171103/updateMyExamineesEventAgrYnJosn.do"
				  , param
				  , monthEvent.detail._callback_updateMyExamineesEventAgrYnJosn
			);
		}
	},
	_callback_updateMyExamineesEventAgrYnJosn : function(json){
		mevent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.examineesLayerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	/**
	 * sns 공유하기
	 * type 값 kakaotalk
	 */
	shareSns : function(title){
		var imgUrl;
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