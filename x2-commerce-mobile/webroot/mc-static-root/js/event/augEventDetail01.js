$.namespace("monthEvent.detail");
monthEvent.detail = {
	snsInitYn : "N",
	/* 출석완료여부 */
	addStmpFlag : "Y",
	/* 휴일출석완료여부 */
	addRedStmpFlag : "Y",
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "N",
	/* 당첨 여부 */
	myWinFlag : "N",

	init : function(){
		if(common.isLogin()){
			// 당첨이력 조회
			monthEvent.detail.getStmpMyWinList();
			/* 로그인한 회원 출석 현황 조회 */
			monthEvent.detail.getMyStmpEvent();
			/* 앱 구매이력 */
			monthEvent.detail.getAppOrderCnt();
		};
		/* 응모 */
		$("a#add").click(function(){
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
			monthEvent.detail.addSuperRace();
		});
		// 개인정보위수탁동의
		$("div#ePolice").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			if(!mevent.detail.checkRegAvailable()){
				return;
			}
			monthEvent.detail.popLayerAgrInfo("10");
		});
		// 나의 당첨내역
		$("div#eMylist").click(function(){
			if(!mevent.detail.checkLogin()){
				return;
			}
			monthEvent.detail.eventShowLayer("eventLayerWinDetail");
		});
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
    // 레이어 노출 - 로그인 체크
    loginChkLayer : function(obj) {
        if (mevent.detail.checkLogin()){
            var _callback_chkWelcomeNewFaceAjax = function(json){
                if(json.ret != "0"){
                    alert(json.message);
                }else{
                    monthEvent.detail.eventShowLayer(obj);
                }
            };
                
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            };

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/chkWelcomeNewFace.do"
                  , param
                  , _callback_chkWelcomeNewFaceAjax
            );
        }
    },
	// 레이어 숨김
	eventCloseLayer : function(){
		$(".eventLayer").hide();
		$("#eventDimLayer").hide();
	},
	/* 슈퍼레이스 참여처리 */
	addSuperRace : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};
		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addSuperRaceJson.do"
			  , param
			  , monthEvent.detail._callback_addSuperRaceJson
		);
	},
	_callback_addSuperRaceJson : function(json){
		if(json.ret == "0"){
			monthEvent.detail.eventShowLayer("eventLayerWinner1");
			monthEvent.detail.getStmpMyWinList();
		}else if(json.ret == "030"){
			monthEvent.detail.eventShowLayer("eventLayerWinner2");
		}else if(json.ret == "029"){
			monthEvent.detail.eventShowLayer("eventLayerWinner3");
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
					if("Y" == json.myEvtWinList[i].state){
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
		if("N" == monthEvent.detail.myWinFlag){
			if(type == "10"){
				alert("기프티콘 당첨자만 개인정보 수집동의가 필요합니다.");
				return;
			}else if(type = "40"){
				alert("당첨 이력이 없습니다.");
				return;
			}
		}
		if("N" != monthEvent.detail.layerAgrFlag){
			alert("이미 동의하셨습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , isTermsPopupYn : "N"
			  , isType : type
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
			if(json[1] > 0){
				$("div[id='eRed']").addClass("on");
			}
			$("div#eDay1").find("li").each(function(index){
				if(index < json[2]){
					$(this).addClass("on");
				}
			});
			/* 빨간날 */
			$("div[id='eNum3']").removeClass("no_0").addClass("no_" + json[1]);
			$("div[id='eNum3']").find("em").text(json[2]);
			if(json[1] > 0){
				monthEvent.detail.addRedStmpFlag = "N";
			}
			/* 출석일수 표시 */
			$("div[id='eNum1']").removeClass("no_0").addClass("no_" + json[2]);
			$("div[id='eNum1']").find("em").text(json[2]);

			if(json[2] >= 3){
				if(json[3] == 0){
					$("div#eStamp1").addClass("on");
					if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
						$("div#eStamp1").attr("onclick", "monthEvent.detail.addEvtProd('3');");
					}else{
						$("div#eStamp1").attr("onclick", "alert('APP 에서만 참여 가능합니다.');");
					}
				}else{
					$("div#eStamp1").addClass("end");
				}
			}
			if(json[2] >= 6){
				if(json[4] == 0){
					$("div#eStamp2").addClass("on");
					if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
						$("div#eStamp2").attr("onclick", "monthEvent.detail.addEvtProd('4');");
					}else{
						$("div#eStamp2").attr("onclick", "alert('APP 에서만 참여 가능합니다.');");
					}
				}else{
					$("div#eStamp2").addClass("end");
				}
			}
			if(json[2] >= 9){
				if(json[5] == 0){
					$("div#eStamp3").addClass("on");
					if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
						$("div#eStamp3").attr("onclick", "monthEvent.detail.addEvtProd('5');");
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

		if(monthEvent.detail.addStmpFlag == "N" && monthEvent.detail.addRedStmpFlag == "N"){
			alert("출석도장을 모두 채우셨습니다.");
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "2"
		}

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "event/addAugMyStmpJson.do"
			  , param
			  , monthEvent.detail._callback_addAugMyStmpJson
		);
	},
	_callback_addAugMyStmpJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}
		monthEvent.detail.getMyStmpEvent();
	},
	addEvtProd : function(fvrSeq){
		if(fvrSeq != "3" && fvrSeq != "4" && fvrSeq != "5"){
			alert("응모 사은품 정보가 없습니다.");
		}else{
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , fvrSeq : fvrSeq
			}

			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/addAugEvtProdJson.do"
				  , param
				  , monthEvent.detail._callback_aaddAugEvtProdJson
			);
		}
	},
	_callback_aaddAugEvtProdJson : function(json){
		if(json.ret != "0"){
			alert(json.message);
		}else{
			if(json.winYn != "Y"){
				$("div#eStamp" + (json.fvrSeq - 2)).removeClass("on").addClass("end");
				monthEvent.detail.eventShowLayer("eventLayerWinner4");
			}else{
				if(json.fvrSeq == "3"){
					monthEvent.detail.eventShowLayer("eventLayerWinner1");
					$("div#eStamp1").removeClass("on").addClass("end");
				}else{
					if(json.fvrSeq == "4"){
						monthEvent.detail.eventShowLayer("eventLayerWinner2");
						$("div#eStamp2").removeClass("on").addClass("end");
					}else if(json.fvrSeq == "5"){
						monthEvent.detail.eventShowLayer("eventLayerWinner3");
						$("div#eStamp3").removeClass("on").addClass("end");
					}
					monthEvent.detail.myWinFlag = "Y";
				}
				// 당첨이력 조회
				monthEvent.detail.getStmpMyWinList();
			}
		}
	},
	// 슈퍼레이스 나의 당첨내역
	ractMyWinList : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		monthEvent.detail.eventShowLayer("eventLayerWinDetail");
	},
	// 슈퍼레이스 개인정보위수탁동의
	raceEPolice : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		monthEvent.detail.popLayerAgrInfo("40");
	},
	/**
	 * sns 공유하기
	 * type 값 kakaotalk / facebook
	 */
	shareSns : function(imgUrl, title, type){
		if(type == "kakaotalk" || type == "facebook"){
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
		}
	},
	// 쿠폰 다운로드
    downFirstBuyCouponJson : function(cpnNo) {
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            if(typeof cpnNo == "undefined" || cpnNo == ""){
                alert("쿠폰 번호가 없습니다.");
                return;
            }
    
            var param = {
                    cpnNo : cpnNo,
                    evtNo : $("input[id='evtNo']:hidden").val()
            };
    
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/downFirstBuyCouponJson.do"
                    , param
                    , this._callback_downCouponJson);
        }
    },
    _callback_downCouponJson : function(strData) {

        if(strData.ret == '0'){
            alert(strData.message);
        }
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
                  , _baseUrl + "event/regWelcomeNewFace.do"
                  , param
                  , monthEvent.detail._callback_regWelcomeNewFaceAjax
            );
        }
    },
    _callback_regWelcomeNewFaceAjax : function(json){
        monthEvent.detail.eventCloseLayer();

        if(json.ret == "0"){
            alert("응모되었습니다.");
            monthEvent.detail.layerAgrFlag = "N";
        }else{
            alert(json.message);
        }
    },
}