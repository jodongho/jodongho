$.namespace("monthEvent.detail");
monthEvent.detail = {
	_ajax : common.Ajax,
	/* 개인정보 수신동의 여부 */
	layerAgrFlag : "D",

	init : function(){
		// 닫기
		$(".eventHideLayer").click(function(){
			monthEvent.detail.eventCloseLayer();
		});
		// 개인정보위수탁동의
        $(".agreeBtn a").eq(0).click(function(){
            if (mevent.detail.checkLogin()){
                monthEvent.detail.updateLayerAgrInfoAjax();
            }
        });
	},

	// 레이어 노출
	eventShowLayer : function(obj) {
	    if (mevent.detail.checkLogin()){
	        var _callback_chkWelcomeNewFaceAjax = function(json){
                if(json.ret != "0"){
                    alert(json.message);
                }else{
            		var layObj = document.getElementById(obj);
            		var layDim = document.getElementById('eventDimLayer');
            		layDim.style.display = 'block';
            		layObj.style.display = 'block';
            		var layObjHeight = layObj.clientHeight  / 2;
            		layObj.style.marginTop = "-" + layObjHeight +"px";
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
	}
};