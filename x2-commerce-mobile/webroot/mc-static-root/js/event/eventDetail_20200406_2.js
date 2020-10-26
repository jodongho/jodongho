/**
 * 배포일자 : 2020-04-02
 * 오픈일자 : 2020-04-06
 * 이벤트명 : 4월 APP페스티벌 - tab2 KIT & 런치딜
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	currentDay : '',
	init : function(){
		monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

		//이벤트 2차
		if(monthEvent.detail.currentDay >= $("input[id='strtDtime2']:hidden").val() && monthEvent.detail.currentDay <= $("input[id='endDtime2']:hidden").val()){
			$(".mc_visual1").addClass("off");
			$(".mc_visual2").removeClass("off");
			
			$(".mc_menu1").addClass("off");
			$(".mc_menu2").removeClass("off");

			$('.usemapDiv:eq(4), .usemapDiv:eq(5), .usemapDiv:eq(6)').addClass('off');	//1차
			$('.usemapDiv:eq(7), .usemapDiv:eq(8), .usemapDiv:eq(9), .usemapDiv:eq(10)').removeClass('off');	//2차

			//매일 오후12시 런치딜
			var imgDay = monthEvent.detail.currentDay.substring(7);
			$('.usemapDiv:eq(7) .imgBox:not(:first)').addClass('off');
			$('.usemapDiv:eq(7) .imgBox:eq(' + (imgDay * 1) + ')').removeClass('off');
			$('.usemapDiv:eq(8) .imgBox').addClass('off');
			$('.usemapDiv:eq(8) .imgBox:eq(' + ((imgDay * 1 - 1) * 2) + ')').removeClass('off');

			//선착순쿠폰 소진 조회
			monthEvent.detail.getLimitDownPsbCpn( $("input[id='cpnNo_" + monthEvent.detail.currentDay + "']:hidden").val() );

			$('.item2_coupon').on('click', function(){
				if(!$(".item2_soldout").is(':visible')){
					monthEvent.detail.downAppLimitCoupon( $("input[id='cpnNo_" + monthEvent.detail.currentDay + "']:hidden").val() );
				}
			});
		}
	},

    /* 선착순쿠폰 소진 조회 */
	getLimitDownPsbCpn : function(inCpnNo){
        if(!common.isEmpty(inCpnNo)){
	        var param = {
	                evtNo : $("input[id='evtNo']:hidden").val()
	              , cpnNo : inCpnNo
	        }
	        common.Ajax.sendJSONRequest(
	               "GET"
	            , _baseUrl + "event/20200406_2/getLimitDownPsbCpn.do"
	            , param
	            , function(json){
	                if(json.cpnSoldOut == 'Y'){
	                    $('.item2_soldout').removeClass('off');
	                }
	            }
	        );
        }
    },

    /* 선착순쿠폰 발급 */
    downAppLimitCoupon : function(inCpnNo){
        if(!common.isEmpty(inCpnNo)){
			if(common.app.appInfo == undefined || !common.app.appInfo.isapp) {
	           if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
	               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
	           }else{
	               return;
	           }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
			        var param = {
			                evtNo : $("input[id='evtNo']:hidden").val()
			              , cpnNo : inCpnNo
			        }
			        common.Ajax.sendJSONRequest(
			               "GET"
			            , _baseUrl + "event/downCouponOfEvtJson.do"
			            , param
			            , function(json){
			                if(json.ret == '002'){
			                    alert('오후 12시부터 발급 가능합니다!');
			                }else if(json.ret == '022'){
			                    alert('임직원은 쿠폰 발급 불가합니다.');
			                }else if(json.ret == '013' || json.ret == '014' || json.ret == '015' || json.ret == '016' || json.ret == '017'){
			                    $('.item2_soldout').removeClass('off');
			                    alert('선착순 수량이 마감되었습니다.');
			                }else if(json.ret == '0'){
			                    alert('쿠폰이 발급되었습니다. 당일 내 사용가능하며, 쿠폰은 마이페이지 에서 확인해주세요!');
			                }else{
			                    alert(json.message);
			                }
			            }
			        );
                }
            }
        }
    }
}