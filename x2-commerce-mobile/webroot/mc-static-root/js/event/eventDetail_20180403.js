$.namespace("monthEvent.detail");
monthEvent.detail = {
	init : function(){

	    if(common.isLogin()){
	       // 촛불 활성화 필요 (로드할때도 촛불활성화필요)
	       // monthEvent.detail.getMyLigthCnt();
        };
	    
	    /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });

	},
	
	/*  4월 생일 고객님 신청하기 4월생일인지체크 (앱에서만응모가능)  */
    applyReceiveCakeClick : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
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
                
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180403/checkApplyReceiveCake.do" // 법정생년월일로 4월 인지 체크 
                      , {
                            evtNo : $("input[id='evtNo']:hidden").val()
                        }
                      , function(json){ 
                          $(':radio[name="argee1"]:checked').attr("checked", false);
                          $(':radio[name="argee2"]:checked').attr("checked", false);
                          
                            if(json.ret == "0"){
                                $("div#Confirmlayer1").attr("onClick", "monthEvent.detail.addApplyReceiveCakeInfo();");
                                //mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
                                mevent.detail.eventShowLayer('eventLayerPolice');
                            }else{
                                alert(json.message);
                            }
                        }
                );
        }
    }, 

    
    /**
     *   4월 생일 고객님 신청하기 4월생일인지체크  후 등록처리 
     */
    addApplyReceiveCakeInfo : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        
        if("Y" != $(':radio[name="argee1"]:checked').val()){
            alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
            return;
        }
        if("Y" != $(':radio[name="argee2"]:checked').val()){
            alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
            return;
        }
        
        mevent.detail.eventCloseLayer();
        
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
              , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180403/addApplyReceiveCakeInfo.do"
              , param
              , monthEvent.detail._callback_addApplyAwardsInfoJson
        );
      
    },
    
    _callback_addApplyAwardsInfoJson : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            alert("신청되었습니다.");
        }else{
            alert(json.message);
        }
    },
    
    // 레이어 숨김
    eventCloseLayer : function(){ 
       // alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },

}