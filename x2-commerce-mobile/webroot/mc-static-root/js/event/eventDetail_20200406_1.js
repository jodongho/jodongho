/**
 * 배포일자 : 2020-04-02
 * 오픈일자 : 2020-04-06
 * 이벤트명 : 4월 APP페스티벌 - tab1 쿠폰
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

			//띠배너
			$('.usemapDiv:last .imgBox:eq(0)').addClass('off');
			$('.usemapDiv:last .imgBox:eq(1)').removeClass('off');
		}

		monthEvent.detail.getMyRndmCoupon();

		$('.posRel:eq(0)').on('click', function(){
			monthEvent.detail.todayDownRndmCoupon();
		});
	},

   /* 나의 랜덤 쿠폰 조회 */
	getMyRndmCoupon : function(){
	    if(common.isLogin()){
	       var param = {
	               evtNo : $("input[id='evtNo']:hidden").val()
	       }
	       common.Ajax.sendJSONRequest(
	               "GET"
	             , _baseUrl + "event/20200406_1/getMyRndmCoupon.do"
	             , param
	             , function(json){
	                 if(json.ret == '0'){
	                     //매장 쿠폰
	                     monthEvent.detail.setPushBtn(json.myCpnRate);
	                 }
	             }
	       );
	    }
   },

   /* APP 랜덤 쿠폰 발급 */
   todayDownRndmCoupon : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else if(!mevent.detail.checkLogin()){
           return;
       }else{
           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
           };
           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/20200406_1/todayDownRndmCoupon.do"
                 , param
                 , function(json){
                     monthEvent.detail.setPushBtn(json.myCpnRate);
                     if(json.ret != '0'){
                         alert(json.message);
                     }
                 }
           );
       }
   },

   setPushBtn : function(myCpnRate){
       if(!common.isEmpty(myCpnRate)){
	       $('.posRel:eq(0)').removeClass('on');
	       $('.posRel:eq(1)').addClass('on');
	       $('.btn_mycoupon').attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');');
	
	       $('.paper_box img').removeClass('on');
	       if(myCpnRate == '10'){
	           $('.paper_box img:eq(1)').addClass('on'); 
	       }else if(myCpnRate == '20'){
	           $('.paper_box img:eq(2)').addClass('on');
	       }else if(myCpnRate == '30'){
	           $('.paper_box img:eq(3)').addClass('on');
	       }else if(myCpnRate == '40'){
	           $('.paper_box img:eq(4)').addClass('on');
	       }
       }
   }
}