$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,

    init : function(){

        if(common.isLogin()){
            monthEvent.detail.getApplyYn();
        }else{
            $(".btn_gift").addClass("on");
            $(".popWin1").removeClass("on");
        }

        $(".btn_gift").click(function(){
            if($(this).hasClass("on")){
                monthEvent.detail.checkApply();
            }
        });
        
        // 나의 당첨내역
        $(".popWin1").click(function(){
            if($(this).hasClass("on")){
                if(!mevent.detail.checkLogin()){
                    return;
                }
                /* 당첨이력조회 */
                monthEvent.detail.getMyWinList();
            }
        });

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

    getApplyYn : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : "1"
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20191101_1/getApplyYn.do"
              , param
              , monthEvent.detail._callback_getApplyYn
        );
    },

    _callback_getApplyYn : function(json){
        if(json.ret == "0"){
            if(json.appCnt == 0){
                $(".btn_gift").addClass("on");
                $(".popWin1").removeClass("on");
            }else{
                $(".btn_gift").removeClass("on");
                $(".btn_gift").addClass("end");
                $(".popWin1").addClass("on");
            }
        }
    },

    checkApply : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , fvrSeq : "1"
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20191101_1/checkApply.do"
              , param
              , function(json){
                  $(':radio[name="argee1"]:checked').attr("checked", false);
                  $(':radio[name="argee2"]:checked').attr("checked", false);

                    if(json.ret == "0"){
                        if( json.myTotalCnt  == "0" ) {
                            $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.apply(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); "  );
                            mevent.detail.eventShowLayer('eventLayerPolice');
                            monthEvent.detail.layerPolice = true;
                            $(".agreeCont")[0].scrollTop = 0;
                        }else {
                            monthEvent.detail.apply(fvrSeq, json.myTotalCnt);
                        }
                    }else{
                        alert(json.message);
                    }
                }
        );
    },

    apply : function(fvrSeq,myTotalCnt){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
        var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

        if(myTotalCnt == 0 ){
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
        }else {
            mbrInfoUseAgrYn = "Y";
            mbrInfoThprSupAgrYn = "Y";
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "1"
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191101_1/apply.do"
              , param
              , monthEvent.detail._callback_todayApply
        );
    },

    _callback_todayApply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            monthEvent.detail.getApplyYn();
            
            setTimeout(function(){
                alert("100% 당첨 이벤트에 응모 완료되셨습니다!");
            }, 200);
        }else{
            alert(json.message);
        }
    },
    
    /* 당첨내역 확인 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getStmpMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getMyWinList
        );
    },
    _callback_getMyWinList : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>당첨이력이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("tbody#myWinListHtml").html(myWinListHtml);

            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else{
            alert(json.message);
        }
    }
}