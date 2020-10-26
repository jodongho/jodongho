$.namespace("mopenEvent.detail");
mopenEvent.detail = {
	_ajax : common.Ajax,
	subEvtYn : "N",
	snsInitYn : "N",

	init : function(){
		// dim 영역 및 close 영역 클릭할 경우
		$(".eventHideLayer").click(function(){
			$('.eventLayer').hide();
			$('#eventDimLayer').hide();
		});

		/* 이차 오픈 스템프 이벤트 관련 추가 */
		$(".open2Stmp").click(function(){
			if(!mopenEvent.detail.checkLogin()){
				return;
			}

			if(!mopenEvent.detail.checkRegAvailable()){
				return;
			}

			mopenEvent.detail.regStmpEventAjax();
		});

		/* 이차 오픈 구매 금액 이벤트 관련 추가 */
		$(".openEventBuyAmout").click(function(){
			if(!mopenEvent.detail.checkLogin()){
				return;
			}

			if(!mopenEvent.detail.checkRegAvailable()){
				return;
			}

			$("input[id='submitType']:hidden").val($(this).attr("id"));
			mopenEvent.detail.openEventBuyAmoutAjax();
		});
	},

	// 로그인 체크
	checkLogin : function(){
		if(common.isLogin() == false){
			if(!confirm("로그인시 참여 가능합니다. 로그인 페이지로 이동하시겠습니까?")){
				return false;
			}else{
				common.link.moveLoginPage();
				return false;
			}
		}
		return true;
	},

	// 응모기간 팝업
	checkRegAvailable : function() {
		var regYn = $.trim($("#regYn").val());
		if(regYn == 'N'){
			alert("응모기간이 지났습니다.");
			return false;
		}

		return true;
	},

    // 약관 동의 팝업 노출
    openTermsPopup : function(){
        var isTermsPopupYn = $("#isTermsPopupYn").val();
        
        var chkPushYn = $("#chkPushYn").val();
        if(chkPushYn != "Y"){
            isTermsPopupYn = "N";
        }
        
        var param = {
            evtNo : $("#evtNo").val()
            , tgtrSeq : $("#tgtrSeq").val()
            , isTermsPopupYn : isTermsPopupYn
        };
        
        // 기약관동의 여부 체크
        common.Ajax.sendJSONRequest(
            "GET"
            , _baseUrl + "open/getTermsAgrInfoJson.do"
            , param
            , mopenEvent.detail._callback_openTermsPopup
        );
    },
    
    // 약관 동의 팝업 노출 callback
    _callback_openTermsPopup : function(strData){
        if(strData.ret == "0"){
            if(strData.isTermsPopupYn){
                // 약관 동의 팝업 노출
                mopenEvent.detail.eventShowLayer('eventLayerPolice');
            }
        }else{
            alert(strData.message);
            common.loginChk();
        }
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
    
    // 약관 동의 팝업 확인 버튼
    popLayerConfirm : function(elementId){
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
        
        $("#isTermsPopupYn").val("N");
        mopenEvent.detail.eventCloseLayer();
        
        var chkPushYn = $("#chkPushYn").val();
        if(chkPushYn == "Y"){
            // 푸시의 경우 응모
            mopenEvent.detail.regEventAjax();
        } else {
            if(mopenEvent.detail.subEvtYn == "Y"){
                // 서브 이벤트 약관동의 경우 이벤트 응모
                mopenEvent.detail.regSubEvtAjax();
            } else {
                // 그 외의 경우 위탁동의 업데이트
                mopenEvent.detail.updateTermsAgrInfoAjax();
            }
        }
    },
    
    regSubEvtAjax : function(){
        var param = {
            evtNo : $("#subEvtNo").val(),
            mbrInfoUseAgrYn : $.trim($("#mbrInfoUseAgrYn").val()),
            mbrInfoThprSupAgrYn : $.trim($("#mbrInfoThprSupAgrYn").val())
        };

        this._ajax.sendJSONRequest(
            "GET"
          , _baseUrl + "open/regSubEvtJson.do"
          , param
          , this._callback_regSubEvtAjax);
    },

    _callback_regSubEvtAjax : function(strData) {
        if(strData.ret == "0"){
            alert(strData.message);
            location.reload();
        }else{
            common.loginChk();
        }
    },
    
    // 약관 동의 업데이트
    updateTermsAgrInfoAjax : function(){
        var param = {
            evtNo : $("#evtNo").val()
            , tgtrSeq : $("#tgtrSeq").val()
            , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
            , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
        };

        common.Ajax.sendJSONRequest(
            "GET"
            , _baseUrl + "open/updateTermsAgrInfoJson.do"
            , param
            , mopenEvent.detail._callback_updateTermsAgrInfoAjax
        );
    },
    
    _callback_updateTermsAgrInfoAjax : function(strData){
        if(strData.ret == "0"){
            location.reload();
        }else{
            common.loginChk();
        }
    },
    
    // 이벤트 응모하기
    regEventAjax : function(){
        var param = {
            evtNo : $("#evtNo").val(),
            evtClssCd : $("#evtTypeCd").val(),
            chkPushYn : $("#chkPushYn").val(),
            mbrInfoUseAgrYn : $("#mbrInfoUseAgrYn").val(),
            mbrInfoThprSupAgrYn : $("#mbrInfoThprSupAgrYn").val(),
        };
        
        var isTermsPopupYn = $("#isTermsPopupYn").val();
        if(isTermsPopupYn == "Y"){
            // 약관 동의 필요시 레이어 노출
            mopenEvent.detail.openTermsPopup();
        } else {
            // 그 외 응모하기
            mopenEvent.detail._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "open/regOpenEventJson.do"
                , param
                , mopenEvent.detail._callback_regEventAjax
            );
        }
    },
    
    _callback_regEventAjax : function(strData) {
        if(strData.ret == "0"){
            // 응모 완료시 완료팝업레이어 노출
            mopenEvent.detail.eventShowLayer('eventLayerAppli');
//            alert(strData.message);
//            location.reload();
        }else{
            common.loginChk();
        }
    },
	// 쿠폰 다운로드
	downCouponJson : function(cpnNo) {
		if(!mopenEvent.detail.checkLogin()){
			return;
		}else{
			if(typeof cpnNo == "undefined" || cpnNo == ""){
				alert("쿠폰 번호가 없습니다.");
				return false;
			}
			var param = {cpnNo : cpnNo};
			common.Ajax.sendRequest(
					"GET"
				  , _baseUrl + "open/downCouponJson.do"
				  , param
				  , this._callback_downCouponJson
			);
		}
	},
	_callback_downCouponJson : function(strData) {
		if(strData.ret == '0'){
			alert(strData.message);
		}
	},
	/* 오픈2차 스템프 이벤트 */
	regStmpEventAjax : function(){
		var type = $("#evtType").val();
		var typeCd = $("#evtTypeCd").val();
		var evtNo = $("#evtNo").val();
		var param = {};

		param = {
			evtNo : evtNo
		  , evtClssCd : typeCd
		  , mbrInfoUseAgrYn : $.trim($("#mbrInfoUseAgrYn").val())
		  , mbrInfoThprSupAgrYn : $.trim($("#mbrInfoThprSupAgrYn").val())
		};

		this._ajax.sendJSONRequest(
			"GET"
		  , _baseUrl + "open/regStmpEventJson.do"
		  , param
		  , this._callback_regStmpEventAjax);
	},

	_callback_regStmpEventAjax : function(strData) {
		if(strData.ret == "1"){
			javascript:mopenEvent.detail.eventShowLayer('eventLayerWinner');
		}else if(strData.ret == "2"){
			javascript:mopenEvent.detail.eventShowLayer('eventLayerFail');
		}else if(strData.ret == "0" || strData.ret == "3"){
			alert(strData.message);
			location.reload();
		}else{
			common.loginChk();
		}
	},

	/* 이차 오픈 구매 금액 이벤트 관련 추가 */
	openEventBuyAmoutAjax : function(){
		var type = $("#evtType").val();
		var typeCd = $("#evtTypeCd").val();
		var evtNo = $("#evtNo").val();
		var param = {};

		param = {
			evtNo : evtNo
		  , evtClssCd : typeCd
		  , mbrInfoUseAgrYn : $.trim($("#mbrInfoUseAgrYn").val())
		  , mbrInfoThprSupAgrYn : $.trim($("#mbrInfoThprSupAgrYn").val())
		  , submitType : $.trim($("#submitType").val())
		};

		this._ajax.sendJSONRequest(
			"GET"
		  , _baseUrl + "open/regOpenEventBuyAmoutJson.do"
		  , param
		  , this._callback_regOpenEventBuyAmoutAjax);
	},

	_callback_regOpenEventBuyAmoutAjax : function(strData) {
		if(strData.ret == "0"){
			alert(strData.message);
		} else if(strData.ret == "1"){
		    javascript:mopenEvent.detail.eventShowLayer('eventLayerWinner');
		} else if(strData.ret == "2"){
		    javascript:mopenEvent.detail.eventShowLayer('eventLayerFail');
		} else{
			common.loginChk();
		}
	},

	/* 이차 오픈 이벤트 금액 관련 당첨 내역 */
	openEventBuyAmoutResultAjax : function(){
		var evtNo = $("#evtNo").val();
		var param = {};

		param = {
			evtNo : evtNo
		};

		this._ajax.sendJSONRequest(
			"GET"
		  , _baseUrl + "open/openEventBuyAmoutResultJson.do"
		  , param
		  , this._callback_getOpenEventBuyAmoutResultAjax
		  , true
		);
	},

	_callback_getOpenEventBuyAmoutResultAjax : function(json){
		if(json.ret < 0){
			alert("로그인 후 확인 가능합니다.");
		}else{
			var htmlStr = "";
			var num = 0;
			if(json.myEventList.length > 0){
				for(i=0 ; i < json.myEventList.length ; i++){
					if(json.myEventList[i].winDtime != null){
						htmlStr += "<tr><td>" + json.myEventList[i].strSbscSgtDtime + "</td><td>" + json.myEventList[i].evtGoodsNm + "</td></tr>";
						num += 1;
					}
				}
			}
			if(num < 1){
				htmlStr += "<tr><td colspan='2'>당첨내역이 없습니다.</td></tr>";
			}

			$("table[id='resultList']").find("tbody").html(htmlStr);
			mopenEvent.detail.eventShowLayer('eventLayerWinDetail');
		}
	},
	
	/**
	 * sns 공유하기
	 */
	shareSns : function(imgUrl, title, type){
        /*
         * type 값
         * kakaotalk
         * kakaostory
         * facebook
         */
        
        if(type == "kakaostory" || type == "kakaotalk" || type == "facebook"){
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
            
            if(mopenEvent.detail.snsInitYn == "N"){
                common.sns.init(imgUrl, title, snsShareUrl);
                mopenEvent.detail.snsInitYn = "Y";
            }
            
            common.sns.doShare(type);
        }
    },
	
	// 서브 이벤트 약관 동의
    subEvtPopup : function(){
        var param = {
            evtNo : $("#subEvtNo").val()
            , tgtrSeq : $("#tgtrSeq").val()
            , isTermsPopupYn : "N"
            , popupType : "10"
        };
        
        // 기약관동의 여부 체크
        common.Ajax.sendJSONRequest(
            "GET"
            , _baseUrl + "open/getTermsAgrInfoJson.do"
            , param
            , mopenEvent.detail._callback_subEvtPopup
        );
    },
    
    // 약관 동의 팝업 노출 callback
    _callback_subEvtPopup : function(strData){
        if(strData.ret == "0"){
            if(strData.isTermsPopupYn){
                // 약관 동의 팝업 노출
                mopenEvent.detail.subEvtYn = "Y";
                mopenEvent.detail.eventShowLayer('eventLayerPolice');
            }
        }else{
            alert(strData.message);
            common.loginChk();
        }
    },
	// 브랜드 세일 뚜레주르 상품권 이벤트 참여
	addPushBSEJson : function(){
		if(!mopenEvent.detail.checkLogin()){
			return;
		}

		if(!mopenEvent.detail.checkRegAvailable()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "open/addPushBSEJson.do"
			  , param
			  , mopenEvent.detail._callback_addPushBSEJson
		);
	},
	_callback_addPushBSEJson : function(json){
		if(json.ret == "0"){
			mopenEvent.detail.eventShowLayer("eventLayerWinner");	// 당첨을 축하합니다~
		}else if(json.ret == "1"){
			mopenEvent.detail.eventShowLayer("eventLayerToday");	// 이미 응모하셨습니다
		}else if(json.ret == "2"){
			mopenEvent.detail.eventShowLayer("eventLayerFail");	// 아쉽지만 당첨되지 않았습니다!
		}else if(json.ret == '15'){
			// 배송지 등록시 생기는 환경변수 제거
			sessionStorage.removeItem("regDeliveryYn");
			
			alert(json.message);	// 사이트에 등록된 기본배송지와 연락처를 통해 배송되오니, 기본배송지 등록 후 응모해주시기 바랍니다.
			common.link.commonMoveUrl('mypage/getDeliveryInfo.do');
		}else if(json.ret == "-1"){
			if(!confirm(json.message)){
				return false;
			}else{
				common.link.moveLoginPage();
				return false;
			}
		}else{
			alert("이벤트 정보를 확인해주세요.");
		}
	},
	// 브랜드 세일 CJ 포인트 발급 이벤트 참여 가능 체크
	checkBuyAmoutBSEJoin : function(fvrSeq){
		if(!mopenEvent.detail.checkLogin()){
			return;
		}

		if(!mopenEvent.detail.checkRegAvailable()){
			return;
		}

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : fvrSeq
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "open/checkBuyAmoutBSEJoin.do"
			  , param
			  , mopenEvent.detail._callback_checkBuyAmoutBSEJoin
		);
	},
	_callback_checkBuyAmoutBSEJoin : function(json){
		if(json.ret == "0"){
			$("input[name='fvrSeq']:hidden").val(json.fvrSeq);
			mopenEvent.detail.eventShowLayer("eventLayerPolice");
		}else if(json.ret == "1" || json.ret == "3"){
			alert(json.message);	// 응모대상이 아닙니다.
		}else if(json.ret == "-1"){
			if(!confirm(json.message)){
				return false;
			}else{
				common.link.moveLoginPage();
				return false;
			}
		}else{
			alert("이벤트 정보를 확인해주세요.");
		}
	},
	//브랜드 세일 CJ 포인트 발급 이벤트 참여
	addBuyAmoutBSE : function(){
		if(!mopenEvent.detail.checkLogin()){
			return;
		}

		if(!mopenEvent.detail.checkRegAvailable()){
			return;
		}

		var mbrInfoUseAgrYn = $(':radio[name="mbrInfoUseAgrYn"]:checked').val();
		if("Y" != mbrInfoUseAgrYn){
			alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
			return;
		}

		$('.eventLayer').hide();
		$('#eventDimLayer').hide();

		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : $("input[name='fvrSeq']:hidden").val()
			  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
		};

		common.Ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "open/addBuyAmoutBSE.do"
			  , param
			  , mopenEvent.detail._callback_addBuyAmoutBSE
		);
	},
	_callback_addBuyAmoutBSE : function(json){
		alert(json.message);
	},
	// 브랜드 세일 슈퍼 쿠폰
	plusSuperDownCoupon : function(){
		if(!mopenEvent.detail.checkLogin()){
			return;
		}else{
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
			};
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "open/plusSuperDownCoupon.do"
				  , param
				  , this._callback_plusSuperDownCoupon
			);
		}
	},
	_callback_plusSuperDownCoupon : function(json){
		alert(json.message);
	},
	/* 이벤트 당첨 내역 체크 */
	popCheckParticipationEvent : function(){
		var evtNo = $("input[id='evtNo']:hidden").val();
		this._ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "open/openEventBuyAmoutResultJson.do"
			  , {
				  evtNo : evtNo
			  }
			  , this._callback_popCheckParticipationEvent
		)
	},
	_callback_popCheckParticipationEvent : function (json){
		if(json.myEventList.length > 0){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , isTermsPopupYn : "N"
				  , agrPopupFunction : "mopenEvent.detail.eventShowLayer('eventLayerPolice');"
				  , closeFunction : "mopenEvent.detail.eventCloseLayer();"
				  , confirmFunction : "mopenEvent.detail.updateLuckyRouletteAgrInfoAjax();"
			};
			mevent.detail.getLayerPopAgrInfoAjax(param);
		}else{
			alert("당첨 정보가 존재하지 않습니다.");
		}
	},
	/* 개인정보 위탕 동의 정보 저장 */
	updateLuckyRouletteAgrInfoAjax : function(){
		if(this.checkAgrmInfo()){
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
				  , tgtrSeq : $("input[id='submitType']:hidden").val()
				  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
				  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
			};

			mevent.detail.updateTermsAgrInfoAjax(param);
		}
	},
	/* 개인 정보 위탁 필수값 체크 */
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
