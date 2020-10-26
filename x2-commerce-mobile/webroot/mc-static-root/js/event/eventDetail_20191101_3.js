/**
 * 11월 첫 구매 혜택
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    firstYn : "N",
    init : function(){
        monthEvent.detail.getFirstByStatus();
        
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

        $(".btnGift").click(function(){
            if(!$(this).hasClass("on") && !$(this).hasClass("end")){
                monthEvent.detail.checkApply();
            }
        });

        /* 유의사항 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
    },
    
    /* 현황조회 */
    getFirstByStatus : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
            ,fvrSeq : "1"
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191101_3/getFirstByStatus.do"
              , param
              , monthEvent.detail._callback_getFirstByStatus
        );
    },

    _callback_getFirstByStatus : function(json){
        if(json.ret == "0"){
            if(json.applyCnt == 0){
                if(json.endYn == "Y"){
                    $(".btnGift").addClass("end");
                }else{
                    $(".btnGift").removeClass("end on");
                }
            }else{
                $(".btnGift").removeClass("end");
                $(".btnGift").addClass("on");
            }
        }
    },

    // 첫구매 응모 체크
    checkApply : function(){
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

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,fvrSeq : "1"
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191101_3/checkApply.do"
                  , param
                  , monthEvent.detail._callback_checkApply
            );
        }
    },

    _callback_checkApply : function(json){
        if(json.ret == "0"){
            if(json.myTotalCnt == 0){
                $("div#Confirmlayer").attr("onClick", "javascript:monthEvent.detail.apply();");
                mevent.detail.eventShowLayer('eventLayerPolice'); //위수탁 팝업 호출
                monthEvent.detail.layerPolice = true;
                $(".agreeCont")[0].scrollTop = 0;
            }
        }else{
            alert(json.message);
        }
    },

    //응모
    apply : function(){
        if(!mevent.detail.checkLogin()){
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
              , fvrSeq : "1"
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191101_3/apply.do"
              , param
              , monthEvent.detail._callback_apply
        );
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            $(".win_number").html(json.tgtrSeq);
            mevent.detail.eventShowLayer('evtGift1');
            monthEvent.detail.getFirstByStatus();            
        }else{
            alert(json.message);
        }
    }
}