$.namespace("mopenEvent.detail4");
mopenEvent.detail4 = {
	_ajax : common.Ajax,
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

			$('.eventLayer').hide();
			$('#eventDimLayer').hide();

			// 응모완료의 경우 reload 필요
			if(reloadYn){
				reloadYn = false;
				location.reload();
			}
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
	// 레이어 숨김
	eventCloseLayer : function(){
		$(".eventLayer").hide();
		$("#eventDimLayer").hide();
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
			this._ajax.sendRequest(
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
	// sns 공유하기
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

			if(mopenEvent.detail4.snsInitYn == "N"){
				common.sns.init(imgUrl, title, snsShareUrl);
				mopenEvent.detail4.snsInitYn = "Y";
			}

			common.sns.doShare(type);
		}
	},
	/* 쇼핑왕 */
	shopPingKing : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "1"
		}
		mopenEvent.detail4.checkKingEvent(param);
	},
	/* 출석왕 */
	attendanceKing : function(){
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : "2"
		}
		mopenEvent.detail4.checkKingEvent(param);
	},
	/* 킹 이벤트 참여 가능 확인 */
	checkKingEvent : function(obj){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(obj.evtNo == "" || obj.evtNo == "undefined" || obj.fvrSeq == "" || obj.fvrSeq == "undefined"){
			alert("이벤트 정보가 없습니다.");
			return;
		}

		this._ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "open/checkKingEventJson.do"
			  , obj
			  , this._callback_checkKingEventJson
		);
	},
	_callback_checkKingEventJson : function(json){
		if(json.ret == '1'){
			$("input[name='fvrSeq']:hidden").val(json.fvrSeq);
			mopenEvent.detail4.eventShowLayer("eventLayerPolice");
		}else if(json.ret == '15'){
			// 배송지 등록시 생기는 환경변수 제거
			sessionStorage.removeItem("regDeliveryYn");
			
            alert(json.message);
            common.link.commonMoveUrl('mypage/getDeliveryInfo.do');
        }else{
			alert(json.message);
		}
	},
	/* 킹 이벤트 응모 */
	addKingEvent : function(fvrSeq){
	    mopenEvent.detail4.eventCloseLayer();
	    
		var param = {
				evtNo : $("input[id='evtNo']:hidden").val()
			  , fvrSeq : fvrSeq
			  , mbrInfoUseAgrYn : $(":radio[name='mbrInfoUseAgrYn']:checked").val()
		};
		this._ajax.sendJSONRequest(
				"GET"
			  , _baseUrl + "open/addKingEventJson.do"
			  , param
			  , this._callback_addKingEventJson
		);
	},
	_callback_addKingEventJson : function(json){
		if(json.ret == '1'){
		    mopenEvent.detail4.eventShowLayer("eventLayerKing0"+$("input[name='fvrSeq']:hidden").val());
//			alert(json.message);
		}else{
			alert(json.message);
		}
	},
	okSubmit : function(){
		if($(":radio[name='mbrInfoUseAgrYn']:checked").val() != "Y"){
			alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
			return;
		}
		if($("input[name='fvrSeq']:hidden").val() == ""){
			alert("잘못된 정보입니다.");
			return;
		}
		mopenEvent.detail4.addKingEvent($("input[name='fvrSeq']:hidden").val());
	}
};