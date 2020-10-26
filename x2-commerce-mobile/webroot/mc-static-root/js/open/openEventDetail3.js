$.namespace("mopenEvent.detail3");
mopenEvent.detail3 = {
    _ajax : common.Ajax,
    subEvtYn : "N",
    snsInitYn : "N",
    
    init : function(){
        // dim 영역 및 close 영역 클릭할 경우
        $(".eventHideLayer").click(function(){
            // 응모완료의 경우 reload 필요
            var reloadYn = false;
            $(".eventLayer").each(function() {
                if(($(this).attr('id') == 'eventLayerAppli')
                    && $(this).is(":visible")){
                    reloadYn = true;
                }
            });
            
            if($(this).attr('id') == 'eventLayerPolice'){
                if($("#subEvtNo").val() != undefined
                    && $("#subEvtNo").val() != null
                    && $("#subEvtNo").val() != ""){
                    mopenEvent.detail3.subEvtYn = "N";
                }
            }
            
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();
            
            // 응모완료의 경우 reload 필요
            if(reloadYn){
                reloadYn = false;
                location.reload();
            }
        });
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
            , mopenEvent.detail3._callback_openTermsPopup
        );
    },
    
    // 약관 동의 팝업 노출 callback
    _callback_openTermsPopup : function(strData){
        if(strData.ret == "0"){
            if(strData.isTermsPopupYn){
                // 약관 동의 팝업 노출
                mopenEvent.detail3.eventShowLayer('eventLayerPolice');
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
		if(this.checkAgrmInfo()){
			$("#isTermsPopupYn").val("N");

			mopenEvent.detail3.eventCloseLayer();

			var chkPushYn = $("#chkPushYn").val();
			if(chkPushYn == "Y"){
				// 푸시의 경우 응모
				mopenEvent.detail3.regEventAjax();
			} else {
				if(mopenEvent.detail3.subEvtYn == "Y"){
					// 서브 이벤트 약관동의 경우 이벤트 응모
					mopenEvent.detail3.regSubEvtAjax();
				} else {
					// 그 외의 경우 위탁동의 업데이트
					mopenEvent.detail3.updateTermsAgrInfoAjax();
				}
			}
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
            , mopenEvent.detail3._callback_updateTermsAgrInfoAjax
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
            mopenEvent.detail3.openTermsPopup();
        } else {
            // 그 외 응모하기
            mopenEvent.detail3._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "open/regOpenEventJson.do"
                , param
                , mopenEvent.detail3._callback_regEventAjax
            );
        }
    },
    
    _callback_regEventAjax : function(strData) {
        if(strData.ret == "0"){
            // 응모 완료시 완료팝업레이어 노출
            mopenEvent.detail3.eventShowLayer('eventLayerAppli');
//            alert(strData.message);
//            location.reload();
        }else{
            common.loginChk();
        }
    },
    
    // 쿠폰 다운로드
    downCouponJson : function(cpnNo) {
        if(!mevent.detail.checkLogin()){
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
                , this._callback_downCouponJson);
        }
    },
    _callback_downCouponJson : function(strData) {
        if(strData.ret == '0'){
            alert(strData.message);
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
            
            if(mopenEvent.detail3.snsInitYn == "N"){
                common.sns.init(imgUrl, title, snsShareUrl);
                mopenEvent.detail3.snsInitYn = "Y";
            }
            
            common.sns.doShare(type);
        }
    },
	
    /* 럭키 룰렛찬스 */
	getLuckyRoulette : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		this.regLuckyRouletteAjax();
	},
	/* 럭키 룰렛찬스 참여 처리 */
	regLuckyRouletteAjax : function(){
		var param = {
				evtNo : $.trim($("#evtNo").val())
			  , evtClssCd : $.trim($("#evtTypeCd").val())
		};
		this._ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "open/regLuckyRouletteJson.do"
			  , param
			  , this._callback_regLuckyRouletteJson
		);
	},
	_callback_regLuckyRouletteJson : function(strData){
		if(strData.ret < 0){
			if(!confirm(strData.message)){
				return false;
			}else{
				common.link.moveLoginPage();
				return false;
			}
		}else if(strData.ret == 14){
		    alert(strData.message);
		}else if(strData.ret == 1){
			$("input[id='submitType']:hidden").val(strData.regTgtrSeq);
			$("img[id='winnerImg']").attr("src", strData.imgPath);
			$("img[id='winnerImg']").attr("alt", strData.goodsName);
			mopenEvent.detail3.eventShowLayer("eventLayerWinner");
		}else if(strData.ret == 15){
			// 배송지 등록시 생기는 환경변수 제거
			sessionStorage.removeItem("regDeliveryYn");
			
		    alert(strData.message);
		    common.link.commonMoveUrl('mypage/getDeliveryInfo.do');
		}else{
			mopenEvent.detail3.eventShowLayer("eventLayerFail");
		}
	},
	/* 당첨내역 조회 */
	getEventResultList : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		this.openEventBuyAmoutResultAjax();
	},
	/* 개인정보 위탁동의 팝업 */
	popLayerAgrInfo : function(){
		if("" == $("input[id='evtNo']:hidden").val()){
			alert("이벤트 번호가 존재하지 않습니다.");
			return;
		}
		if("" == $("input[id='submitType']:hidden").val()){
			alert("당첨 정보가 존재하지 않습니다.");
			return;
		}
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , tgtrSeq : $("input[id='submitType']:hidden").val()
			  , isTermsPopupYn : "N"
			  , agrPopupFunction : "mopenEvent.detail3.eventShowLayer('eventLayerPolice');"
			  , closeFunction : "mopenEvent.detail3.eventCloseLayer();"
			  , confirmFunction : "mopenEvent.detail3.updateLuckyRouletteAgrInfoAjax();"
		};
		mevent.detail.getLayerPopAgrInfoAjax(param);
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
				  , agrPopupFunction : "mopenEvent.detail3.eventShowLayer('eventLayerPolice');"
				  , closeFunction : "mopenEvent.detail3.eventCloseLayer();"
				  , confirmFunction : "mopenEvent.detail3.updateLuckyRouletteAgrInfoAjax();"
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
	/* 오픈 3차 첫 구매 100% 빵 이벤트 개인정보 위탁동의 팝업 */
	popLayerAgrInfoNo : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if("" == $("input[id='evtNo']:hidden").val()){
			alert("이벤트 번호가 존재하지 않습니다.");
			return;
		}
		this._ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "open/checkStartOrderEvent.do"
			  , {
				  evtNo : $("input[id='evtNo']:hidden").val()
			  }
			  , this._callback_popLayerAgrInfo
		);
	},
	_callback_popLayerAgrInfo : function(strData){
	    if(strData != undefined && strData != null && strData.ret == 15){
	    	// 배송지 등록시 생기는 환경변수 제거
			sessionStorage.removeItem("regDeliveryYn");
			
	        alert(strData.message);
            common.link.commonMoveUrl('mypage/getDeliveryInfo.do');
	    } else if(strData != undefined && strData != null && strData.ret == 14){
	        alert(strData.message);
	    } else {
	        var param = {
	                evtNo : $("input[id='evtNo']:hidden").val()
	              , tgtrSeq : ""
	              , isTermsPopupYn : "Y"
	              , isType : "01"
	              , agrPopupFunction : "mopenEvent.detail3.eventShowLayer('eventLayerPolice');"
	              , closeFunction : "mopenEvent.detail3.eventCloseLayer();"
	              , confirmFunction : "mopenEvent.detail3.addEventFirm();"
	        };
	        mevent.detail.getLayerPopAgrInfoAjax(param);
	    }
	},
	/* 오픈 3차 첫 구매 100% 빵 이벤트 개인정보 위탁동의 저장 */
	addEventFirm : function(){
		if(this.checkAgrmInfo()){
		    mopenEvent.detail3.eventCloseLayer();
		    
			this._ajax.sendJSONRequest(
					"POST"
				  , _baseUrl + "open/addOnlyAgrInfo.do"
				  , {
					  evtNo : $("input[id='evtNo']:hidden").val()
					, mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
					, mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
				  }
				  , this._callback_addOnlyAgrInfo
			);
		}
	},
	_callback_addOnlyAgrInfo : function(strData){
		if(strData.ret == "1"){
		    mopenEvent.detail3.eventShowLayer('eventLayerFirst');
        }else{
            common.loginChk();
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
    // 위/수탁 동의 필요없는 응모
    regEventAjax2 : function(){
        // 로그인 체크
        if(!mevent.detail.checkLogin()){
            return false;
        }
        
        var param = {
            evtNo : $("#evtNo").val(),
            evtClssCd : $("#evtTypeCd").val(),
            chkPushYn : $("#chkPushYn").val(),
            mbrInfoUseAgrYn : $("#mbrInfoUseAgrYn").val(),
            mbrInfoThprSupAgrYn : $("#mbrInfoThprSupAgrYn").val(),
        };
        
        mopenEvent.detail3._ajax.sendJSONRequest(
            "GET"
            , _baseUrl + "open/regOpenEventJson.do"
            , param
            , mopenEvent.detail3._callback_regEventAjax2
        );
    },
    _callback_regEventAjax2 : function(strData) {
        if(strData.ret == "0"){
            // 응모 완료시 완료팝업레이어 노출
            mopenEvent.detail3.eventShowLayer('eventLayerApply');
        }else{
            common.loginChk();
        }
    },
	/* 이벤트 당첨 내역 */
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
			mopenEvent.detail3.eventShowLayer('eventLayerWinDetail');
		}
	},
};