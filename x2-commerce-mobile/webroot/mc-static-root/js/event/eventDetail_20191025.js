$.namespace("monthEvent.detail");
monthEvent.detail = {
    init : function(){
        $("#btnApply").removeClass("on gift_apply gift_end");
        monthEvent.detail.getGiftStatus();

        $("#btnApply").click(function(){
            if(!$(this).hasClass("gift_end")){                
                if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                    if(confirm("모바일 앱에서만 참여 가능합니다.")){
                        common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                    }else{
                        return;
                    }
                }else{
                    if(!mevent.detail.checkLogin()){
                        return;
                    }else{                    
                        if($(this).hasClass("on")){
                            monthEvent.detail.applyGiftCard();
                        }else if($(this).hasClass("gift_apply")){
                            if(common.isLogin()){
                                mevent.detail.eventShowLayer('popGiftCard');
                            }
                        }
                    }
                }
            }
        });

        //유의사항 토글
        $('.caution_btn').click(function() {
            $(this).toggleClass('on').next('.caution_con').slideToggle();
        });
    },

    /* 현황조회 */
    getGiftStatus : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
            ,cpnNo : $("input[id='cpnNo']:hidden").val()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191025/getGiftStatus.do"
              , param
              , monthEvent.detail._callback_getGiftStatus
        );
    },

    _callback_getGiftStatus : function(json){
        if(json.ret == "0"){
            var cpnMap = json.cpnMap;
            if(cpnMap == null){
                if(json.endYn == "Y"){  //소진완료
                    $("#btnApply").removeClass("on gift_end");
                    $("#btnApply").addClass("gift_end");
                }else{
                    $("#btnApply").removeClass("gift_apply gift_end");
                    $("#btnApply").addClass("on");
                }
            }else{
                var rndmVal = cpnMap.rndmVal;
                $("#btnApply").removeClass("on gift_end");
                $("#btnApply").addClass("gift_apply");

                $(".win_number").html(rndmVal.substr(rndmVal.length-6, rndmVal.length));
                $(".voucher").html(rndmVal);
            }
        }
    },

    applyGiftCard : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
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
                        ,cpnNo : $("input[id='cpnNo']:hidden").val()
                    }

                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/20191025/applyGiftCard.do"
                          , param
                          , monthEvent.detail._callback_applyGiftCard
                    );
            }
        }
    },

    _callback_applyGiftCard : function(json){
        if(json.ret == "0"){
            monthEvent.detail.getGiftStatus();
            mevent.detail.eventShowLayer('popGiftCard');
        }else{
            alert(json.message);
        }
    },

    /* 앱 푸시 설정 바로가기 */
    goSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 설정해 주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    }
}