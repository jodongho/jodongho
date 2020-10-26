/**
 * 오픈일자 : 2020.09.03
 * 이벤트명 : 온라인인덱스
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	baseImgPath : _cdnImgUrl + "contents/202009/03brandSale/",
	pushGiftObj : {		"14" : {pushImg :  "pop_winGift01.jpg", pushTxt : "pop_winGift_txt01.jpg" }
	,"15" : {pushImg :  "pop_winGift02.jpg", pushTxt : "pop_winGift_txt02.jpg" }
	,"16" : {pushImg :  "pop_winGift03.jpg", pushTxt : "pop_winGift_txt03.jpg" }
	,"17" : {pushImg :  "pop_winGift04.jpg", pushTxt : "pop_winGift_txt04.jpg" }
	,"18" : {pushImg :  "pop_winGift05.jpg", pushTxt : "pop_winGift_txt05.jpg" }
	,"19" : {pushImg :  "pop_winGift03.jpg", pushTxt : "pop_winGift_txt03.jpg" }
	,"20" : {pushImg :  "pop_winGift04.jpg", pushTxt : "pop_winGift_txt04.jpg" }
	,"21" : {pushImg :  "pop_winGift05.jpg", pushTxt : "pop_winGift_txt05.jpg" }
	},
	toDt : '',
	appIng : false,
	notInFvrSeqArr : [],
	init : function(){
		monthEvent.detail.notInFvrSeqArr = $("#notInFvrSeqArr").val().split(",");
		monthEvent.detail.toDt = $('#imgUrlConnectDay').val();

        /* app push 수신동의 현황 조회 */
        common.app.getTmsPushConfig();
        // app push 체크
        $('.popAppPush').on('click', function(){
        	monthEvent.detail.setTmsPushConfig();
        });

        var toDay = monthEvent.detail.toDt.substring(0,8);
        var toMd = monthEvent.detail.toDt.substring(4,8);
        var toHH24 = monthEvent.detail.toDt.substring(8,10);
        //이벤트 기간 오늘의 특가 표시
        if($("input[id='strtDtime']:hidden").val() <= toDay && $("input[id='endDtime']:hidden").val() >= toDay){
        	$("#oneday img").attr("src", monthEvent.detail.baseImgPath+"mc_cnt03_brand"+toMd+".jpg" );
        }
        
        if(toHH24 >= "00" &&  toHH24 < "12"){
        	$(".time01").addClass("on");
        }else if(toHH24 >= "12" &&  toHH24 < "18"){
        	$(".time02").addClass("on");
        }else{
        	$(".time03").addClass("on");
        }
        
        //마지막날 상단 타이틀	
        if($("input[id='endDtime']:hidden").val() == toDay){
        	if(toHH24 >= '12'){
        		$('.storeCoupon').addClass("evtLastDay");
        	}
            $('.oyEvent_wrap').addClass("evt_lastDay");
        }
        
        
        //직원확인
        $(".btn_confirm").click(function(){
            if(!$("#popStoreCoupon .eventNotice2").hasClass("complete")){
            	if(confirm("직원 확인 처리 후에는 쿠폰 재사용 불가합니다. 사용하시겠습니까?")){
            		monthEvent.detail.couponUseConfirm();
            	}
            }
        });

        $(".btn_StoreCoupon").click(function(){
        	if($(this).hasClass("on")){
        		monthEvent.detail.getStoreCoupon();
        	}
        });

        //응모하기
        $(".popGift1").click(function(){        	
        	monthEvent.detail.checkApply();
        });
   
        monthEvent.detail.setting();

        //직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });
	},

	//랜덤 쿠폰 소진 체크
    setting : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,toDt : monthEvent.detail.toDt
                ,notInFvrSeqArr : monthEvent.detail.notInFvrSeqArr.toString()
                ,strtDtime : $("input[id='strtDtime']:hidden").val()
                ,endDtime : $("input[id='endDtime']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/olsale/getLimitDownPsbCpn.do"
              , param
              , function(json){
                  if(json.ret == "0"){
                      $('.time0'+json.cTab).addClass('on');
                      $('.randomCoupon .randomTitle').addClass(json.cOpenDt);
                      if(json.pushApplyYn == 'Y'){ 
                    	  $(".popGift1").removeClass("on");
                      }
                      //온라인 소진 완료
                      if(json.onPsbCpn == 'Y'){
                          $('.appCouponArea').addClass('soldOut ' + json.psbCpnSoldOutTm);
                          $('.randomCoupon').removeAttr('onclick');
                      }
                      $('#randomLastDt').text('('+json.cEndDt+')');

                      //12시에만 매장쿠폰 활성화
                      if(json.cTab == "2"){	//12시
                    	  $(".btn_StoreCoupon").addClass("on");
                    	  //오프라인 소진 완료
                          if(json.offPsbCpn == 'Y'){
                        	  if($("input[id='endDtime']:hidden").val() == monthEvent.detail.toDt.substring(0,8)){
                        		  $('.storeCouponArea').addClass('soldOut lastAll');
                        	  }else{
                        		  $('.storeCouponArea').addClass('soldOut pm12');
                        	  }
                              $('.storeCoupon').removeAttr('onclick');
                          }
                      }else{	//나머지
                    	  if(json.cTab == "1"){
                    		  $('.storeCouponArea').addClass('am0 soldOut');
                    		  $('.storeCoupon').removeAttr('onclick');
                          }else if(json.cTab == "3"){
                              $(".btn_StoreCoupon").addClass("on");
                        	  if($("input[id='endDtime']:hidden").val() == monthEvent.detail.toDt.substring(0,8)){
                        		  $('.storeCouponArea').addClass('soldOut lastAll'); //기존은 18시까지만이였음 now 24시까지
                        		  $('.randomCoupon').addClass("evtLastDay");
                        	  }else{
                        		  $('.storeCouponArea').addClass('soldOut pm12'); //기존은 18시까지만이였음 now 24시까지
                        	  }
                    		  $('.storeCoupon').removeAttr('onclick');
                          }
                      }
                  }
              }
        );
    },

    downRndmCoupon : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }
            if(monthEvent.detail.appIng){
                return;
            }
            monthEvent.detail.appIng = true;

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,toDt : monthEvent.detail.toDt
                    ,strtDtime : $("input[id='strtDtime']:hidden").val()
                    ,endDtime : $("input[id='endDtime']:hidden").val()
            }
        	
            //넷퍼넬 선착순 쿠폰 다운로드 act_08
            NetFunnel_Action({action_id:"act_08"},function(ev,ret){
	            common.Ajax.sendRequest(
	                    "GET"
	                  , _baseUrl + "event/olsale/downRndmCoupon.do"
	                  , param
	                  , monthEvent.detail._callback_downRndmCoupon
	            );
            });
        }
    },

    _callback_downRndmCoupon : function(json){
    	
    	//넷퍼넬 키 반환 호출(전역)
		NetFunnel_Complete();
    	
    	if(json.ret == '0' || json.ret == '009' || json.ret == '010' || json.ret == '011' || json.ret == '012'){
            $('.randomCoupon .randomDiscount').addClass('random'+json.myCpnRate);
            $('.randomCoupon .randomTxt').removeClass('random30_txt'); 
            $('.randomCoupon .randomTxt').addClass('random'+json.myCpnRate+'_txt');

            //쿠폰함으로 이동
            $('.randomCoupon').attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');').addClass('on');

            setTimeout(function(){
                if(json.ret == '0'){
                    alert("쿠폰이 발급되었습니다. 발급된 쿠폰은 '마이페이지 > 쿠폰'에서 확인 가능합니다.");
                }else{
                    //기발급
                    alert("이미 발급된 쿠폰입니다.");
                }
            }, 1000);
        }else{
            alert(json.message);
        }
        monthEvent.detail.appIng = false;
    },

    downAppCoupon : function(cpnNo, obj){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }else{
                var param = {
                        cpnNo : cpnNo
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/downCouponOfEvtJson.do"
                        , param
                        , function(json){
                        	 if(json.ret == '0' || json.ret == '009' || json.ret == '010' || json.ret == '011' || json.ret == '012'){
                                 //쿠폰함으로 이동
                                 $(obj).attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');').addClass('on');
                             }

                             if(json.ret == '009' || json.ret == '010'){
                             	alert("이미 발급된 쿠폰입니다.");
                             	$(obj).attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');').addClass('on');
                             }else{
                             	if(!json.ret == '0'){
                                     alert(json.message);
                                 }
                             }
                        }
                );
            }
        }
    },

    downStoreCoupon : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }else{
                var param = {
                		evtNo : $("input[id='evtNo']:hidden").val()
                        ,toDt : monthEvent.detail.toDt
                        ,strtDtime : $("input[id='strtDtime']:hidden").val()
                        ,endDtime : $("input[id='endDtime']:hidden").val()
                        ,fvrSeq : "13"
                };
                
                //넷퍼넬 선착순 쿠폰 다운로드 act_08
                NetFunnel_Action({action_id:"act_08"},function(ev,ret){
	            	common.Ajax.sendRequest(
	                        "GET"
	                        , _baseUrl + "event/olsale/downStoreCoupon.do"
	                        , param
	                        , monthEvent.detail._callback_downStoreCoupon
	                );
                }); 
            }
        }
    },

    _callback_downStoreCoupon : function(json) {
    	
    	//넷퍼넬 키 반환 호출(전역)
		NetFunnel_Complete();
    	
    	if(json.ret == '0'){
        	$(".storeBarCode").barcode(json.rndmVal, "code128",{barWidth:1, barHeight:25});
        	var toMd = monthEvent.detail.toDt.substring(4,8);
        	$(".commonBarCode img").attr("src", monthEvent.detail.baseImgPath + 'pop_code_'+toMd+'_'+json.cpnAmt+'.jpg');
        	$(".storeRandomTxt").addClass("popTxt_"+json.cpnAmt);
        	$(".storeCoupon .randomDiscount").addClass("random"+json.cpnAmt);

     	   	mevent.detail.eventShowLayer('popStoreCoupon');
        }else{
        	if(json.ret == "012"){
        		$(".storeCoupon .randomDiscount").addClass("random"+json.cpnAmt);
        	}
        	setTimeout(function(){
        		alert(json.message);
            }, 1000);

        }
    },

    getStoreCoupon : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 사용 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }else{
                var param = {
                		 evtNo : $("input[id='evtNo']:hidden").val()
                         ,toDt : monthEvent.detail.toDt
                         ,strtDtime : $("input[id='strtDtime']:hidden").val()
                         ,endDtime : $("input[id='endDtime']:hidden").val()
                         ,fvrSeq : "13"
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/olsale/getStoreCoupon.do"
                        , param
                        , monthEvent.detail._callback_getStoreCoupon
                );
            }
        }
    },

    _callback_getStoreCoupon : function(json) {
        if(json.ret == '0'){
           if(json.rndmVal.length == 0){
        	   alert("발급 된 오프라인 쿠폰이 없습니다");
        	   return;
           }else{
        	   if(json.useCnt > 0){
        		   $("#popStoreCoupon .eventNotice2").addClass("complete");
        		   var toMd = monthEvent.detail.toDt.substring(4,8);
               	   $(".commonBarCode img").attr("src", monthEvent.detail.baseImgPath + 'pop_code_'+toMd+'_'+json.cpnAmt+'.jpg');
        		   $(".storeBarCode").barcode(json.rndmVal, "code128",{barWidth:1, barHeight:25});
        		   $(".storeRandomTxt").addClass("popTxt_"+json.cpnAmt);
        		   $(".storeCoupon .randomDiscount").addClass("random"+json.cpnAmt);
            	   mevent.detail.eventShowLayer('popStoreCoupon');
        	   }else{
        		   if(confirm("발급된 쿠폰은 오늘 23시 59분까지만 사용 가능합니다. 지금 사용하시겠습니까?")){
        			   var toMd = monthEvent.detail.toDt.substring(4,8);
        			   $(".commonBarCode img").attr("src", monthEvent.detail.baseImgPath + 'pop_code_'+toMd+'_'+json.cpnAmt+'.jpg');
        			   $(".storeBarCode").barcode(json.rndmVal, "code128",{barWidth:1, barHeight:25});
        			   $(".storeRandomTxt").addClass("popTxt_"+json.cpnAmt);
        			   $(".storeCoupon .randomDiscount").addClass("random"+json.cpnAmt);
                	   mevent.detail.eventShowLayer('popStoreCoupon');
        		   }
        	   }
           }
        }else{
        	alert(json.message);
        }
    },

    couponUseConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP 에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }else{
                var param = {
                		evtNo : $("input[id='evtNo']:hidden").val()
                        ,toDt : monthEvent.detail.toDt
                        ,strtDtime : $("input[id='strtDtime']:hidden").val()
                        ,endDtime : $("input[id='endDtime']:hidden").val()
                        ,fvrSeq : "13"
                    }

                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/olsale/couponUseConfirm.do"
                          , param
                          , monthEvent.detail._callback_couponUseConfirm
                    );
            }
        }
    },

    _callback_couponUseConfirm : function(json){
        if(json.ret == "0"){
        	$("#popStoreCoupon .eventNotice2").addClass("complete");
        }else{
        	alert(json.message);
        }
    },

    checkApply : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,strtDtime : $("input[id='strtDtime']:hidden").val()
                    ,notInFvrSeqArr : monthEvent.detail.notInFvrSeqArr.toString()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/olsale/checkApply.do"
                  , param
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                        if(json.ret == "0"){
                        	$(".agreeBtn").attr("onclick", "monthEvent.detail.apply();");
                            mevent.detail.eventShowLayer('eventLayerPolice');
                            monthEvent.detail.layerPolice = true;
                            $(".agreeCont")[0].scrollTop = 0;
                        }else if(json.ret == '054'){                        	
                        	$(".popGift1").removeClass("on");
                        	$("#push_img").attr("src", monthEvent.detail.baseImgPath + monthEvent.detail.pushGiftObj[json.winFvrSeq].pushImg);
                            $("#push_txt").attr("src", monthEvent.detail.baseImgPath + monthEvent.detail.pushGiftObj[json.winFvrSeq].pushTxt);
                            $("#push_number").text('(' + json.tgtrSeq + ')');
                            setTimeout(function() { mevent.detail.eventShowLayer('popAppPush1'); }, 500);
                        	return;
                        }else if(json.ret == "99"){
                        	alert("신규 APP PUSH 수신 동의자만 응모 가능합니다.");
                        	return;
                        }else if(json.ret == "98"){
                        	alert("APP PUSH 수신 동의 후 응모해주세요!");
                        	return;
//                        	if(confirm(json.message)){
//                                monthEvent.detail.setTmsPushConfig();
//                            }
                        }else if(json.ret == "-1"){
                			if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
                        		common.link.moveLoginPage();
                        		return false;
                            }
                		}else{
                        	alert(json.message);
                        }
                    }
            );
        }
    },

    apply : function(fvrSeq,myTotalCnt){
    	if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
	    	if(!monthEvent.detail.checkLoginEvt()){
	            return;
	        }

	        var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
	        var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

	        if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
	            alert("2가지 모두 동의 후 참여 가능합니다.");
	            return;
	        }

	        if("Y" != mbrInfoUseAgrYn){
	            monthEvent.detail.layerPolice = false;
	            mevent.detail.eventCloseLayer();
	            return;
	        }
	        if("Y" != mbrInfoThprSupAgrYn){
	            monthEvent.detail.layerPolice = false;
	            mevent.detail.eventCloseLayer();
	            return;
	        }

	        monthEvent.detail.layerPolice = false;
	        mevent.detail.eventCloseLayer();
	        var param = {
	        	  evtNo : $("input[id='evtNo']:hidden").val()
	              ,strtDtime : $("input[id='strtDtime']:hidden").val()
	              ,notInFvrSeqArr : monthEvent.detail.notInFvrSeqArr.toString()
	              ,mbrInfoUseAgrYn : mbrInfoUseAgrYn
	              ,mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
	        };
	        common.Ajax.sendJSONRequest(
	                "GET"
	              , _baseUrl + "event/olsale/apply.do"
	              , param
	              , monthEvent.detail._callback_apply
	        );
        }
    },

    _callback_apply : function(json){
        if(json.ret == "0"){//정상 응모 완료
        	mevent.detail.eventCloseLayer();
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false); 
            $("#push_img").attr("src", monthEvent.detail.baseImgPath + monthEvent.detail.pushGiftObj[json.winFvrSeq].pushImg);
            $("#push_txt").attr("src", monthEvent.detail.baseImgPath + monthEvent.detail.pushGiftObj[json.winFvrSeq].pushTxt);
            $("#push_number").text('(' + json.tgtrSeq + ')');   
            setTimeout(function() { mevent.detail.eventShowLayer('popAppPush1'); }, 500);
            $(".popGift1").removeClass("on");
            
        }else if(json.ret == "99" || json.ret == "98"){
        	alert(json.message);
        	return;
        }        
        else if(json.ret == "-1"){
			if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
        		common.link.moveLoginPage();
        		return false;
            }
		}else{
        	alert(json.message);
        }
    },

    setTmsPushConfig : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp) {
        	if(confirm("APP에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!monthEvent.detail.checkLoginEvt()){
                return;
            }else if(monthEvent.detail.appPushVer()){
                common.app.getTmsPushConfig();
                setTimeout(function(){
                        if(!monthEvent.detail.appPushIng){
                            monthEvent.detail.appPushIng = true;
                            common.app.setTmsPushConfig('Y');
                            var appCheckTimer = setInterval(function(){
                                if('N' == common.app.pushConfigResult){
                                    //수신동의 처리 실패
                                    clearInterval(appCheckTimer);
                                    monthEvent.detail.appPushIng = false;
                                }else if(!common.isEmpty(common.app.pushConfigResult) || !monthEvent.detail.appPushIng){
                                    //처리 성공
                                    clearInterval(appCheckTimer);
                                    monthEvent.detail.appPushIng = false;
                                }
                            }, 300);
                        }
                    },1000);
            }else{
                common.app.callSettings();
            }
        }
    },

    /* 앱 최신버전 체크 */
    appPushVer : function(){
        if(common.isLoginForEvt()){
            var tempCompareVersion = "";
            if (common.app.appInfo.ostype == "10") { // ios
                tempCompareVersion = '2.2.1';
            }else if(common.app.appInfo.ostype == "20"){ // android
                tempCompareVersion = '2.1.8';
            }
            if(common.app.appInfo.isapp && common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion) !=  "<"){
                return true;
            }
        }
        return false;
    },

    checkLoginEvt : function(){
        if(!common.isLoginForEvt()){
            if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }

        return true;
    }
}