$.namespace("monthEvent.detail");
monthEvent.detail = {

    currentDay : null,
    newCheckListChk : 0,
    
    init : function(){
        
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);
        
        if(common.isLogin()){
            /* 로그인한 회원 출석 현황 조회 */
            monthEvent.detail.getMyStmpEvent();
            
            /* 경품 응모 했는지 조회 */ 
            monthEvent.detail.getApplyEvent();
            
            /* 10, 20, 30일 연속 출석 이미지 변경용(개발시간 촉박해서 기존에 있던거 사용해서 클래스만 변경) */
            monthEvent.detail.checkAttendCheckDayFirst("32");
            monthEvent.detail.checkAttendCheckDayFirst("33");
            monthEvent.detail.checkAttendCheckDayFirst("34");
        };
        
         // 출석처리
        $("div#eAttend").click(function(){
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
                    };
                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/20180831_3/getAppPushYnCntJson.do"
                          , param
                          , monthEvent.detail._callback_getAppPushYnCntJson
                    );
                }            
            }
        });
        
     // 나의 당첨내역
        $("div#eMylist").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
            /* 당첨이력조회 */
            monthEvent.detail.getStmpMyWinList();
            mevent.detail.eventShowLayer("evtPopWinDetail");
        });
        
        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });
        
        /* 유의사항 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
    },
    _callback_getAppPushYnCntJson : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
        }else{
            monthEvent.detail.addMyStmp();
        }
    },
   
    /* 회원 출석 등록 */
    addMyStmp : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("모바일 앱에서만 신청 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{     
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val(),
                        startDate : $("input[id='targetNum']:hidden").val()
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20181001/addMyStmpJson.do"
                      , param
                      , monthEvent.detail._callback_addMyStmpJson
                );
            }
        }
    },
    _callback_addMyStmpJson : function(json){
        if(json.ret == "0"){
            if(json.winYn=="Y"){
                
                if(monthEvent.detail.currentDay == '20181003' || monthEvent.detail.currentDay == '20181007' || monthEvent.detail.currentDay == '20181009' || monthEvent.detail.currentDay == '20181014' || monthEvent.detail.currentDay == '20181021' || monthEvent.detail.currentDay == '20181028'){
                    mevent.detail.eventShowLayer('evtPoint2');
                }else{
                    mevent.detail.eventShowLayer('evtPoint1');
                }
            }else{
                mevent.detail.eventShowLayer('evtPointFail');
            }
        }else {
            alert(json.message);
        }
        monthEvent.detail.getMyStmpEvent();
    },
    
    getApplyEvent : function() { 
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181001/getApplyEventJson.do"
              , param
              , monthEvent.detail._callback_getApplyEventJson
        );
    },
    _callback_getApplyEventJson : function(json){
        if(json.ret == "0"){
//            alert("//==>"+json.applyOne+"//==>"+json.applyTwo+"//==>"+json.applyThree);
            /* 신청되었으면 비활성화 */
            if(json.applyOne == 1){
                $("div#chul3_1").addClass("after");
            }
            if(json.applyTwo == 1){
                $("div#chul3_2").addClass("after");
            }
            if(json.applyThree == 1){
                $("div#chul3_3").addClass("after");
            }
        } else {
            alert(json.message);
        }
    },
    
    /* 로그인한 회원 출석 현황 조회 */
    getMyStmpEvent : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val(),
                startDate : $("input[id='targetNum']:hidden").val()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181001/getMyStmpEventJson.do"
              , param
              , monthEvent.detail._callback_getMyStmpEventJson
        );
    },
    _callback_getMyStmpEventJson : function(json){
        if(json.ret == "0"){
            if(json != undefined && json != null){
                var newCheckList = json.newCheckList;
                 $("div#eDay1").find("td.eDay2").each(function(index){ 
                       if(newCheckList != undefined && newCheckList != null && newCheckList.length > 0){
                           for(var i=0; i<newCheckList.length; i++){
                               if(index == i){
                                      if(newCheckList[i].strtDtime == 1 ){
                                          var htmlStr = "";
                                          htmlStr =  "<img src='"+_cdnImgUrl + "contents/201810/01attend/attend_stamp.png' alt='출석'>";   
                                          $("td.eDay2").find("span#check"+i+"").html(htmlStr);
//                                          monthEvent.detail.newCheckListChk = i;
                                      }else {
                                          var htmlStr = "";
                                          htmlStr =  "";
                                          $("td.eDay2").find("span#check"+i+"").html(htmlStr);
                                      }
                                }
                           }
                       }
                 });
            }
            monthEvent.detail.checkAttendCheckDayFirst("32");
            monthEvent.detail.checkAttendCheckDayFirst("33");
            monthEvent.detail.checkAttendCheckDayFirst("34");
        }else{
            alert(json.message);
        }
    },
    
    
    /* 당첨내역 확인 */
    getStmpMyWinList : function(){
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
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },
    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2'>당첨이력이 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("tbody#myWinListHtml").html(myWinListHtml);
        }else{
            alert(json.message);
        }
    },
    
    checkAttendCheckDayFirst:function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181001/checkAttendCheckDayJson.do" // ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
              , {
                      evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : fvrSeq
                    , noteContFlag : "Y"
                }
              , function(json){ 
                  $(':radio[name="argee1"]:checked').attr("checked", false);
                  $(':radio[name="argee2"]:checked').attr("checked", false);
                  
                    if(json.ret == "0"){
                        if(fvrSeq == "32"){
                            $("div#chul3_1").removeClass("after");
                            $("div#chul3_1").removeClass("before");
                        }
                        if(fvrSeq == "33"){
                            $("div#chul3_2").removeClass("after");
                            $("div#chul3_2").removeClass("before");
                        }
                        if(fvrSeq == "34"){
                            $("div#chul3_3").removeClass("after");
                            $("div#chul3_3").removeClass("before");
                        }
                    }else{
                        if(fvrSeq == "32"){
                            $("div#chul3_1").removeClass("after");
                            $("div#chul3_1").removeClass("before");
                            if(json.ret == "054"){
                                $("div#chul3_1").addClass("after");
                            }else if(json.ret == "014"){
                                $("div#chul3_1").addClass("before");
                            }
                        }
                        if(fvrSeq == "33"){
                            $("div#chul3_2").removeClass("after");
                            $("div#chul3_2").removeClass("before");
                            if(json.ret == "054"){
                                $("div#chul3_2").addClass("after");
                            }else if(json.ret == "014"){
                                $("div#chul3_2").addClass("before");
                            }
                        }
                        if(fvrSeq == "34"){
                            $("div#chul3_3").removeClass("after");
                            $("div#chul3_3").removeClass("before");
                            if(json.ret == "054"){
                                $("div#chul3_3").addClass("after");
                            }else if(json.ret == "014"){
                                $("div#chul3_3").addClass("before");
                            }
                        }
                    }
                }
        );
    },
    
    /* 10일 연속 출첵시 
     * 20일 연속 출첵시 
     * 30일 연속 출첵시  */
    checkAttendCheckDay:function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 신청 가능합니다.")){
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
                  , _baseUrl + "event/20181001/checkAttendCheckDayJson.do" // ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : fvrSeq
                    }
                  , function(json){ 
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                        if(json.ret == "0"){
                            if( json.myTotalCnt  == "0" ) {  // 10일연속, 20일연속, 30일연속  세개중 한번도 신청하지 않은경우 위수탁 받기 
                              //  $("div#Confirmlayer1").attr("onClick", "monthEvent.detail.applyAttendCheckDayInfo(' " + fvrSeq + "');");
                                $("div#Confirmlayer1").attr("onclick", "   monthEvent.detail.applyAttendCheckDayInfo(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); "         );
                                monthEvent.detail.eventShowLayer1('eventLayerPolice');
                            }else {
                                monthEvent.detail.applyAttendCheckDayInfo(fvrSeq, json.myTotalCnt);
                            }
                        }else{
                            alert(json.message);
                        }
                    }
            );
            
        }
    },
    
    applyAttendCheckDayInfo : function(fvrSeq,myTotalCnt){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 신청 가능합니다.")){
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
            
            if(myTotalCnt == 0 ){
                /* 수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
                var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
                var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();
                
                if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                    alert("2가지 모두 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee1"]:checked').val()){
                    alert("2가지 모두 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee2"]:checked').val()){
                    alert("2가지 모두 동의 후 참여 가능합니다.");
                    return;
                }
                
                if("Y" != mbrInfoUseAgrYn){
                    monthEvent.detail.eventCloseLayer1();
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    monthEvent.detail.eventCloseLayer1();
                    return;
                }
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }
            
            monthEvent.detail.eventCloseLayer2();
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : fvrSeq
                  , startDate : $("input[id='targetNum']:hidden").val()
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181001/applyAttendCheckDayInfo.do"  
                  , param
                  , monthEvent.detail._callback_applyAttendCheckDayInfoJson
            ); 
        }
    },
    
    _callback_applyAttendCheckDayInfoJson : function(json){
         if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
                if(json.winYn=="Y"){
                    // 성공
                    if(json.fvrSeq == "32"){ // 10일 
                        mevent.detail.eventShowLayer('evtGift1'); 
                    }else  if(json.fvrSeq == "33"){ // 20일 
                        mevent.detail.eventShowLayer('evtGift2'); 
                    }else  if(json.fvrSeq == "34"){ // 30일 
                        mevent.detail.eventShowLayer('evtGift3'); 
                    }
                }else {
                    // 실패
                    mevent.detail.eventShowLayer('evtGiftFail'); 
                }      
        }else{
            alert(json.message);
        }
         /* 경품 응모 했는지 조회 */ 
         monthEvent.detail.getApplyEvent();
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
    },
    
    // 레이어 노출
    eventShowLayer1 : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer1');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
    
    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
//        location.reload();
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){
        alert("동의 후 참여 가능합니다.");
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer").hide(); 
        location.reload();      //위수탁 동의 x일 때 스크롤 맨위로 가게하기 위해 페이지 새로고침
    },
    
    // 레이어 숨김
    eventCloseLayer2 : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer").hide();  
    },
    
}