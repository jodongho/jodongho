/**
 * 오늘드림 첫구매
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    init : function(){
        if(common.isLogin()){
            monthEvent.detail.getFirstByStatus();
        }

        $(".btn_point").click(function(){
            if($(this).hasClass("on")){
                monthEvent.detail.apply();
            }
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
              , _baseUrl + "event/20200101_1/getFirstByStatus.do"
              , param
              , monthEvent.detail._callback_getFirstByStatus
        );
    },

    _callback_getFirstByStatus : function(json){
        if(json.ret == "0"){
            if(json.applyCnt > 0){
                $(".btn_point").removeClass("on");
            }
        }
    },

    //응모
    apply : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "1"
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200101_1/apply.do"
              , param
              , monthEvent.detail._callback_apply
        );
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            alert("신청 완료 되었습니다.");
            monthEvent.detail.getFirstByStatus();
        }else{
            alert(json.message);
        }
    },

    /** 나의 당첨내역 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getMyEvtWinList.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );

    },

    _callback_getMyWinListJson : function(json){
        if(json.ret == "0"){
            //당첨 내역 확인
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                mevent.detail.eventShowLayer('evtPop2');
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                     $(".win_number").html(json.myEvtWinList[i].strSbscSgtDtime);
                }
                mevent.detail.eventShowLayer('evtPop1');
            }
        }else{
            alert(json.message);
        }
    }
}