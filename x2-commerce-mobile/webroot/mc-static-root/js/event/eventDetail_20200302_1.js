/**
 * 오픈일자 : 2020.03.02
 * 이벤트명 : 온라인인덱스
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
	baseImgPath : _cdnImgUrl + "contents/202003/02brandSale/",
	toDt : '',
	appIng : false,
	init : function(){
		monthEvent.detail.toDt = $('#imgUrlConnectDay').val();
		
        //이벤트 기간 오늘의 특가 표시
        if($("input[id='strtDtime']:hidden").val() <= monthEvent.detail.toDt.substring(0,8) && $("input[id='endDtime']:hidden").val() >= monthEvent.detail.toDt.substring(0,8)){
        	$('.evtCon03 .imgBox img').attr("src", monthEvent.detail.baseImgPath + 'mc_cnt03_'+monthEvent.detail.toDt.substring(4,8)+'.jpg');
        	$('#popStoreCoupon .conts_inner img').attr("src", monthEvent.detail.baseImgPath + 'pop_storeCoupon_cnt_'+monthEvent.detail.toDt.substring(4,8)+'.jpg');
        }
        //마지막날 상단 타이틀
        if($("input[id='endDtime']:hidden").val() == monthEvent.detail.toDt.substring(0,8)){
            $('.evtConTop .imgBox img').attr("src", monthEvent.detail.baseImgPath + 'mc_tit_last.gif');
            $('.storeCoupon').addClass("evtLastDay");
            //$('.randomCoupon').addClass("evtLastDay");
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
        
        monthEvent.detail.setting();
	},
	
	//랜덤 쿠폰 소진 체크
    setting : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,toDt : monthEvent.detail.toDt
                ,strtDtime : $("input[id='strtDtime']:hidden").val()
                ,endDtime : $("input[id='endDtime']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20200302_1/getLimitDownPsbCpn.do"
              , param
              , function(json){
                  if(json.ret == "0"){
                      $('.time0'+json.cTab).addClass('on');
                      $('.randomTitle').addClass(json.cOpenDt);
                                            
                      //온라인 소진 완료
                      if(json.onPsbCpn == 'Y'){
                          $('.appCouponArea').addClass('soldOut ' + json.psbCpnSoldOutTm);
                          $('.randomCoupon').removeAttr('onclick');
                      }
                      
                      $('#randomLastDt').text('('+json.cEndDt+')');
                      var lastTxt = "";
                      if($("input[id='endDtime']:hidden").val() == monthEvent.detail.toDt.substring(0,8)){
                    	  lastTxt = "lastAll"
                      }
                      
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
                        	  if($("input[id='endDtime']:hidden").val() == monthEvent.detail.toDt.substring(0,8)){
                        		  $('.storeCouponArea').addClass('soldOut lastAll');  
                        		  $('.randomCoupon').addClass("evtLastDay");
                        	  }else{
                        		  $('.storeCouponArea').addClass('soldOut pm12');
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
            if(!mevent.detail.checkLogin()){
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
	                  , _baseUrl + "event/20200302_1/downRndmCoupon.do"
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
            $('.randomDiscount').addClass('random'+json.myCpnRate);
            $('.randomTxt').addClass('random'+json.myCpnRate+'_txt');

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
    
    downAppCoupon : function(cpnNo){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
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
                        cpnNo : cpnNo
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/downCouponOfEvtJson.do"
                        , param
                        , monthEvent.detail._callback_downAppCoupon
                );
            }
        }
    },

    _callback_downAppCoupon : function(json) {
        if(json.ret == '0' || json.ret == '009' || json.ret == '010' || json.ret == '011' || json.ret == '012'){
            //쿠폰함으로 이동
            $('.couponDown2').attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');').addClass('on');
        }
        
        if(json.ret == '009' || json.ret == '010'){
        	alert("이미 발급된 쿠폰입니다.");
        }else{
        	if(!json.ret == '0'){
                alert(json.message);
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
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                var param = {
                		evtNo : $("input[id='evtNo']:hidden").val()
                        ,toDt : monthEvent.detail.toDt
                        ,strtDtime : $("input[id='strtDtime']:hidden").val()
                        ,endDtime : $("input[id='endDtime']:hidden").val()
                        ,inCpnNoArr : $("input[id='inCpnNoArr']:hidden").val().split(",").toString()
                        ,inFvrSeqArr : $("input[id='inFvrSeqArr']:hidden").val().split(",").toString()
                };
                
                //넷퍼넬 선착순 쿠폰 다운로드 act_08
                NetFunnel_Action({action_id:"act_08"},function(ev,ret){
	                
                	common.Ajax.sendRequest(
	                        "GET"
	                        , _baseUrl + "event/20200302_1/downStoreCoupon.do"
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
        	$(".storeBarCode").barcode(json.rndmVal, "code128",{barWidth:2, barHeight:40});
     	   mevent.detail.eventShowLayer('popStoreCoupon');
        }else{
        	/*if(json.ret == "051"){	//소진쿠폰
        		$('.storeCouponArea').addClass('soldOut ' + json.psbCpnSoldOutTm);
                $('.storeCoupon').removeAttr('onclick');
        	}*/
        	alert(json.message);
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
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                var param = {
                		 evtNo : $("input[id='evtNo']:hidden").val()
                         ,toDt : monthEvent.detail.toDt
                         ,strtDtime : $("input[id='strtDtime']:hidden").val()
                         ,endDtime : $("input[id='endDtime']:hidden").val()
                         ,inCpnNoArr : $("input[id='inCpnNoArr']:hidden").val().split(",").toString()
                         ,inFvrSeqArr : $("input[id='inFvrSeqArr']:hidden").val().split(",").toString()
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20200302_1/getStoreCoupon.do"
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
        		   $(".storeBarCode").barcode(json.rndmVal, "code128",{barWidth:2, barHeight:40});
            	   mevent.detail.eventShowLayer('popStoreCoupon');
        	   }else{
        		   if(confirm("단 하루만 사용 가능한 쿠폰입니다. 지금 사용하시겠습니까?")){
        			   $(".storeBarCode").barcode(json.rndmVal, "code128",{barWidth:2, barHeight:40});
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
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                var param = {
                		evtNo : $("input[id='evtNo']:hidden").val()
                        ,toDt : monthEvent.detail.toDt
                        ,strtDtime : $("input[id='strtDtime']:hidden").val()
                        ,endDtime : $("input[id='endDtime']:hidden").val()
                        ,inCpnNoArr : $("input[id='inCpnNoArr']:hidden").val().split(",").toString()
                        ,inFvrSeqArr : $("input[id='inFvrSeqArr']:hidden").val().split(",").toString()
                    }

                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/20200302_1/couponUseConfirm.do"
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
    }
}