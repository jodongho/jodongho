/**
 * 이벤트 당첨률 테스트 용
 */
$.namespace("monthEvent.detail");
var bProc = false;
var iCallCnt = 1;
var iCnt = 0;
monthEvent.detail = {
    init : function() {
        //TMS 푸시 동의값 설정
        $('[id=setTmsPushConfig]').on('click', function(){
            if (common.app.appInfo.isapp) {
                console.log("################################## Before Call common.app.setTmsPushConfig");
                common.app.setTmsPushConfig();
            } else {
                alert("app만 테스트 가능합니다.");
            }
        });
        
        //단일 경품 응모하기
        $('[id=appOne]').on('click', function(){
            if (bProc) {
                alert("경품 응모중입니다.");
            } else {
                if (isNaN($("#callCnt").val()))
                    iCallCnt = 1;
                else
                    iCallCnt = $("#callCnt").val();

                var iLoopCnt;
                if (isNaN($("#loopCnt").val()))
                    iLoopCnt = 1;
                else
                    iLoopCnt = $("#loopCnt").val();
                
                if (iLoopCnt > 1000) {
                    alert("자동 반복 참여 횟수는 1000 미만으로 입력하세요.");
                    return false;
                }
                if (iCallCnt > 10) {
                    alert("Url 호출횟수는 10 미만으로 입력하세요.");
                    return false;
                }
                if (iCallCnt*iLoopCnt > 5000) {
                    alert("총 참여회수가 5000건을 초과합니다. 5000이하가 되도록 설정해주세요.");
                    return false;
                }

                iCnt = 0;
                monthEvent.detail.appWinOne();
            }
        });
        
        // 그룹 경품 응모하기
        $('[id=appGroup]').on('click', function(){
            if (bProc) {
                alert("경품 응모중입니다.");
            } else {
                if (isNaN($("#callCnt").val()))
                    iCallCnt = 1;
                else
                    iCallCnt = $("#callCnt").val();

                var iLoopCnt;
                if (isNaN($("#loopCnt").val()))
                    iLoopCnt = 1;
                else
                    iLoopCnt = $("#loopCnt").val();
                
                if (iLoopCnt > 1000) {
                    alert("자동 반복 참여 횟수는 1000 미만으로 입력하세요.");
                    return false;
                }
                if (iCallCnt > 10) {
                    alert("Url 호출횟수는 10 미만으로 입력하세요.");
                    return false;
                }
                if (iCallCnt*iLoopCnt > 5000) {
                    alert("총 참여회수가 5000건을 초과합니다. 5000이하가 되도록 설정해주세요.");
                    return false;
                }

                iCnt = 0;
                monthEvent.detail.appWinGroup();
            }
        });
    },

    /* 단일 경품 즉시 응모 */
    appWinOne : function(){
        if(!mevent.detail.checkLogin()){
            bProc = false;
            return;
        }else{
            bProc = true;
            iCnt++;
            $("#s_callCnt").text(iCnt);
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , loopCnt : $("#loopCnt").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/test/appWinOne.do"
                  , param
                  , monthEvent.detail._callback_appWinOne
            );
        }
    },
    _callback_appWinOne : function(json){
        if(json.ret == "0"){
            if (iCallCnt > iCnt) {
                monthEvent.detail.appWinOne();
            } else {
                bProc = false;
                $("#s_callCnt").text(0);
            }
        }else {
            bProc = false;
            alert(json.message);
        }
    },

    /* 그룹 경품 즉시 응모 */
    appWinGroup : function(){
        if(!mevent.detail.checkLogin()){
            bProc = false;
            return;
        }else{
            bProc = true;
            iCnt++;
            $("#s_callCnt").text(iCnt);
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : $("input[id='fvrSeq']:hidden").val()
                    , loopCnt : $("#loopCnt").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/test/appWinGroup.do"
                  , param
                  , monthEvent.detail._callback_appWinGroup
            );
        }
    },
    _callback_appWinGroup : function(json){
        if(json.ret == "0"){
            if (iCallCnt > iCnt) {
                monthEvent.detail.appWinGroup();
            } else {
                bProc = false;
                $("#s_callCnt").text(0);
            }
        }else {
            bProc = false;
            alert(json.message);
        }
    }

}