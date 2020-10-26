$.namespace("monthEvent.detail");
monthEvent.detail = {
	/* 참여 전체 포인트 */
	allMyPoint : 0,
	/* 사용가능 포인트 */
	addMyPoint : 0,
	/* 사용 포인트 */
	useMyPoint : 0,
	/* 랜덤 기프트 당첨 여부 */
	myGiftWinFlag : "N",
	giftLayerAgrFlag : "N",
	/* 보너스 당첨 여부 */
	myPlusWinFlag : "N",
	plusLayerAgrFlag : "N",

	init : function(){
		if($("input[id='targetNum']:hidden").val() == "2"){
			$("img#changeImg01").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/oneTree_mc2_tab.gif");
			$("img#changeImg02").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/oneTree_mc2_02.png");
		}
		if(common.isLogin()){
			/* 트리 이벤트 참여 이력 */
			monthEvent.detail.getMyEventPartList();
			/* 당첨내역 확인 */
			monthEvent.detail.getMyWinList();
		}else{
			$("div#treeBtn6_1").attr("onClick", "javascript:monthEvent.detail.addStmpClick();");
		};
		/* 닫기 */
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
			$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/space.png");
		});
	},
	/* 당첨이력 팝업 */
	getMyWinPopup : function(num){
		if(!mevent.detail.checkLogin()){
			return;
		}

		mevent.detail.eventShowLayer('eventLayerWinDetail' + num);
	},
	/* 트리 이벤트 참여 이력 */
	getMyEventPartList : function(){
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
			  , _baseUrl + "event/20171203/getMyEventPartListJson.do"
			  , param
			  , monthEvent.detail._callback_getMyEventPartList
		);
	},
	_callback_getMyEventPartList : function(json){
		if(json.ret == "0"){
			monthEvent.detail.allMyPoint = 0;
			monthEvent.detail.useMyPoint = json.useMyPoint;

			var stmpNum = 1;
			var tmpNum = 1;

			for(i=0 ; i<json.myEvtPartList.length ; i++){
				if(json.myEvtPartList[i].fvrSeq == 4){
					$("div#treeBtn" + json.myEvtPartList[i].fvrSeq + "_" + tmpNum).addClass("on");
					tmpNum += 1;
				}else if(json.myEvtPartList[i].fvrSeq == 6){
					$("div#treeBtn" + json.myEvtPartList[i].fvrSeq + "_" + stmpNum).addClass("on");
					stmpNum += 1;
				}else{
					$("div#treeBtn" + json.myEvtPartList[i].fvrSeq).addClass("on");
				}

				monthEvent.detail.allMyPoint += 1;
			}

			if(stmpNum <= 3){
				$("div#treeBtn6_" + stmpNum).attr("onClick", "javascript:monthEvent.detail.addStmpClick();");
			}

			monthEvent.detail.addMyPoint = monthEvent.detail.allMyPoint - monthEvent.detail.useMyPoint;

			$("img#allMyPoint").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/no1_" + monthEvent.detail.allMyPoint + ".png");
			$("img#addMyPoint").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/no1_" + monthEvent.detail.addMyPoint + ".png");
			$("img#useMyPoint").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/no1_" + monthEvent.detail.useMyPoint + ".png");
		}else{
			alert(json.message);
		}
	},
	/* 뮤지컬 응모 */
	addMusicalClick : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("모바일 앱에서만 응모 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}
			common.link.commonMoveUrl('main/getEventList.do');
		}
	},
	/* 신상품 보기 */
	addNewProductViewClick : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("모바일 앱에서만 응모 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
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
				  , _baseUrl + "event/20171203/addNewProductClickJson.do"
				  , param
				  , monthEvent.detail._callback_addLinkClickJson
			);
		}
	},
	/* 오특 보기 */
	addHotdealViewClick : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("모바일 앱에서만 응모 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
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
				  , _baseUrl + "event/20171203/addHotdealViewClickJson.do"
				  , param
				  , monthEvent.detail._callback_addLinkClickJson
			);
		}
	},
	_callback_addLinkClickJson : function(json){
		if(json.ret == "0"){
			if(json.fvrSeq == "2"){
				common.link.commonMoveUrl('planshop/getPlanShopDetail.do?dispCatNo=500000100270004');
			}else if(json.fvrSeq == "3"){
				common.link.commonMoveUrl('open/getOpenBrandSale.do');
			}
		}else{
			alert(json.message);
		}
	},
	/* 출석 */
	addStmpClick : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("모바일 앱에서만 응모 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
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
				  , _baseUrl + "event/20171203/addStmpClickJson.do"
				  , param
				  , monthEvent.detail._callback_addStmpClickJson
			);
		}
	},
	/* +Day 출석 */
	addPlusDayStmpClick : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("모바일 앱에서만 응모 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
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
				  , _baseUrl + "event/20171203/addPlusDayStmpClickJson.do"
				  , param
				  , monthEvent.detail._callback_addStmpClickJson
			);
		}
	},
	_callback_addStmpClickJson : function(json){
		if(json.ret == "0"){
			monthEvent.detail.getMyEventPartList();
		}else{
			alert(json.message);
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
			  , _baseUrl + "event/20171203/getMyWinListJson.do"
			  , param
			  , monthEvent.detail._callback_getMyWinListJson
		);
	},
	_callback_getMyWinListJson : function(json){
		if(json.ret == "0"){
			if(json.myEvtWinList.length > 0){
				var myWinListHtmlGift = "";
				var myWinListHtmlPlus = "";

				for(var i=0 ; i<json.myEvtWinList.length ; i++){
					if(json.myEvtWinList[i].fvrSeq > 13){
						myWinListHtmlPlus += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
						monthEvent.detail.myPlusWinFlag = "Y";

						if(json.myEvtWinList[i].mbrInfoUseAgrYn == "Y"){
							monthEvent.detail.plusLayerAgrFlag = "Y";
						}
					}else{
						myWinListHtmlGift += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
						monthEvent.detail.myGiftWinFlag = "Y";

						if(json.myEvtWinList[i].mbrInfoUseAgrYn == "Y"){
							monthEvent.detail.giftLayerAgrFlag = "Y";
						}
					}
				}

				if(myWinListHtmlGift != ""){
					$("tbody#myWinListHtmlGift").html(myWinListHtmlGift);
				}
				if(myWinListHtmlPlus != ""){
					$("tbody#myWinListHtmlPlus").html(myWinListHtmlPlus);
				}
			}
		}else{
			alert(json.message);
		}
	},
	/* 랜덤 기프트 응모 */
	addRandomGift : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("모바일 앱에서만 응모 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}
			if(monthEvent.detail.addMyPoint <= 0){
				$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/tree_fail_01.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
	
				return;
			}
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
			};
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20171203/addRandomGiftJson.do"
				  , param
				  , monthEvent.detail._callback_addRandomGiftJson
			);
		}
	},
	_callback_addRandomGiftJson : function(json){
		if(json.ret == "0"){
			monthEvent.detail.getMyWinList();
			monthEvent.detail.addMyPoint = monthEvent.detail.addMyPoint - 1;
			monthEvent.detail.useMyPoint = monthEvent.detail.useMyPoint + 1;

			$("img#addMyPoint").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/no1_" + monthEvent.detail.addMyPoint + ".png");
			$("img#useMyPoint").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/no1_" + monthEvent.detail.useMyPoint + ".png");

			$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/tree_winner_" + json.fvrSeq + ".png");
			mevent.detail.eventShowLayer('eventLayerWinner');
		}else{
			if(json.ret == "033"){
				$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/tree_fail_01.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else{
				alert(json.message);
			}
		}
	},
	/* 100% 당첨 */
	addAllGift : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("모바일 앱에서만 응모 가능합니다.")){
				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
			}else{
				return;
			}
		}else{
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}
			if(monthEvent.detail.allMyPoint != 10){
				$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/tree_fail_01.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
	
				return;
			}
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
			};
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20171203/addAllGiftJson.do"
				  , param
				  , monthEvent.detail._callback_addAllGiftJson
			);
		}
	},
	_callback_addAllGiftJson : function(json){
		if(json.ret == "0"){
			monthEvent.detail.getMyWinList();

			$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/tree_winner_" + json.fvrSeq + ".png");
			mevent.detail.eventShowLayer('eventLayerWinner');
		}else{
			if(json.ret == "033"){
				$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/tree_fail_01.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else if(json.ret == "013"){
				$("img#resultImg").attr("src", "//image.oliveyoung.co.kr/uploads/contents/201712/15tree/tree_fail_02.png");
				mevent.detail.eventShowLayer('eventLayerWinner');
			}else{
				alert(json.message);
			}
		}
	},
	/* 랜덤 기프트 개인정보 위탁동의 팝업 */
	popLayerGiftAgrInfo : function(typeNum){
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
		if("Y" != monthEvent.detail.myGiftWinFlag){
			alert("개인정보 위수탁 동의 대상이 아닙니다.");
			return;
		}
		if("N" != monthEvent.detail.giftLayerAgrFlag){
			alert("이미 동의하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : typeNum
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateMyGiftEventAgrYn();"
		};
		monthEvent.detail.getLayerPopAgrInfoAjax(param);
	},
	/* 랜덤 기프트 개인정보 위탁동의 저장 */
	updateMyGiftEventAgrYn : function(){
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , setFlag : "N"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20171203/updateMyGiftEventAgrYn.do"
				  , param
				  , monthEvent.detail._callback_updateMyGiftEventAgrYn
			);
		}
	},
	_callback_updateMyGiftEventAgrYn : function(json){
		mevent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.giftLayerAgrFlag = "Y";
		}else{
			alert(json.message);
		}
	},
	/* 보너스 개인정보 위탁동의 팝업 */
	popLayerPlusAgrInfo : function(typeNum){
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
		if("Y" != monthEvent.detail.myPlusWinFlag){
			alert("개인정보 위수탁 동의 대상이 아닙니다.");
			return;
		}
		if("N" != monthEvent.detail.plusLayerAgrFlag){
			alert("이미 동의하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isType : typeNum
			  , agrPopupFunction : "mevent.detail.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mevent.detail.eventCloseLayer();"
			  , confirmFunction : "monthEvent.detail.updateMyPlusEventAgrYn();"
		};
		monthEvent.detail.getLayerPopAgrInfoAjax(param);
	},
	/* 보너스 개인정보 위탁동의 저장 */
	updateMyPlusEventAgrYn : function(){
		if(mevent.detail.checkAgrmTwoInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , setFlag : "N"
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20171203/updateMyPlusEventAgrYnJosn.do"
				  , param
				  , monthEvent.detail._callback_updateMyPlusEventAgrYnJosn
			);
		}
	},
	_callback_updateMyPlusEventAgrYnJosn : function(json){
		mevent.detail.eventCloseLayer();

		if(json.ret == "0"){
			alert("개인정보 위/수탁 동의가 완료되었습니다.");
			monthEvent.detail.plusLayerAgrFlag = "Y";
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
}