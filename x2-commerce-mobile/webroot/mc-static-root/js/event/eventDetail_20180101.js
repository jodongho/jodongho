$.namespace("monthEvent.detail");
monthEvent.detail = {
	/* 응모 횟수 */
	ordListCnt : 0,
	checkButFlag : true,

	init : function(){
		if(common.isLogin()){
			/* 구매 이력 조회 */
//			monthEvent.detail.regStmeEvent();
		}
		/* 닫기 */
		$(".eventHideLayer").click(function(){
			mevent.detail.eventCloseLayer();
		});
	},
	/* 구매 이력 조회 */
	regStmeEvent : function(){
		if(!mevent.detail.checkLogin()){
			return;
		}
		if(!mevent.detail.checkRegAvailable()){
			return;
		}
		if(monthEvent.detail.checkButFlag){
			monthEvent.detail.checkButFlag = false;

			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
			};
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20180101/regStmeEventJson.do"
				  , param
				  , monthEvent.detail._callback_regStmeEvent
			);
		}
	},
	_callback_regStmeEvent : function(json){
		if(json.ret == "0"){
			var sixCouponUse = true;
			var TwelveCouponUse = true;

			monthEvent.detail.ordListCnt = json.ordListCnt;

			if(json.myCouponList != undefined && json.myCouponList != "" && json.myCouponList.length > 0){
				for(i=0 ; i<json.myCouponList.length ; i++){
					if(json.myCouponList[i].fvrSeq == "2"){
						sixCouponUse = false;
					}
					if(json.myCouponList[i].fvrSeq == "3"){
						TwelveCouponUse = false;
					}
				}
			}
			for(i=0 ; i<json.ordListCnt ; i++){
				var ordDate = json.ordList[i].noteCont.split(";")[0].substr(5);
				if(i == 5){
					if(sixCouponUse){
						$("div#eDay1").find("li").eq(i).find("span").removeClass().addClass("use");
						$("div#eDay1").find("li").eq(i).find("span").html("<a href='#counp1'>6 스탬프</a>");
					}else{
						$("div#eDay1").find("li").eq(i).find("span").removeClass().addClass("on" + ordDate);
						$("div#eDay1").find("li").eq(i).find("span").html("6 스탬프");
					}
				}else if(i == 11){
					if(TwelveCouponUse){
						$("div#eDay1").find("li").eq(i).find("span").removeClass().addClass("use");
						$("div#eDay1").find("li").eq(i).find("span").html("<a href='#counp2'>12 스탬프</a>");
					}else{
						$("div#eDay1").find("li").eq(i).find("span").removeClass().addClass("on" + ordDate);
						$("div#eDay1").find("li").eq(i).find("span").html("12 스탬프");
					}
				}else{
					$("div#eDay1").find("li").eq(i).find("span").removeClass().addClass("on" + ordDate);
				}
			}
		}else{
			if(json.message != undefined){
				alert(json.message);
			}
		}

		monthEvent.detail.checkButFlag = true;
	},
	/* 6회 쿠폰 */
	getSixCoupon : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("올리브영 앱에서 발급해주세요.")){
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
				  , fvrSeq : "2"
			};
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20180101/getStmpCouponJson.do"
				  , param
				  , monthEvent.detail._callback_getStmpCouponJson
			);
		}
	},
	/* 12회 쿠폰 */
	getTwelveCoupon : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("올리브영 앱에서 발급해주세요.")){
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
				  , fvrSeq : "3"
			};
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20180101/getStmpCouponJson.do"
				  , param
				  , monthEvent.detail._callback_getStmpCouponJson
			);
		}
	},
	_callback_getStmpCouponJson : function(json){
		if(json.ret == "0"){
			monthEvent.detail.regStmeEvent();

			if(json.fvrSeq == "3"){
				alert("2만원 결제쿠폰이 발급되었습니다. [마이페이지 - 쿠폰]에서 확인해주세요.");
			}else{
				alert("1만원 결제쿠폰이 발급되었습니다. [마이페이지 - 쿠폰]에서 확인해주세요.");
			}
		}else{
			alert(json.message);
		}
	},
	/* 포인트 적립 신청 */
	addStmpCjOnePoint : function(){
		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
			if(confirm("올리브영 앱에서 신청 가능합니다.")){
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
			if(monthEvent.detail.ordListCnt < 6){
				alert("스탬프 6개 이상 고객만 신청 가능합니다.");
				return;
			}
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
			};
			common.Ajax.sendJSONRequest(
					"GET"
				  , _baseUrl + "event/20180101/addStmpCjOnePointJson.do"
				  , param
				  , monthEvent.detail._callback_addStmpCjOnePointJson
			);
		}
	},
	_callback_addStmpCjOnePointJson : function(json){
		if(json.ret == "0"){
			alert("CJ ONE 포인트 적립 신청되었습니다. 7월 16일(월) 적립 예정입니다.");
		}else{
			alert(json.message);
		}
	},
	/* 나의 구매 내역보기 */
	goOrderList : function(){
		if(!common.isLogin()){
			if(confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
				common.link.commonMoveUrl('mypage/getOrderList.do');
			}
		}else{
			common.link.commonMoveUrl('mypage/getOrderList.do');
		}
	},
}