$.namespace("monthEvent.detail");
monthEvent.detail = {

    init : function(){
       
        if(common.isLogin()){
            /* 로그인한 회원 출석 현황 조회 */
            monthEvent.detail.getMyStmpEvent();
            
            /* 경품 응모 했는지 조회 */ 
            monthEvent.detail.getApplyEvent();
        };
        
         // 출석처리
        $("div#eAttend").click(function(){
            monthEvent.detail.addMyStmp();
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
                      , _baseUrl + "event/20180501/addMyStmpJson.do"
                      , param
                      , monthEvent.detail._callback_addMyStmpJson
                );
            }
        }
    },
    _callback_addMyStmpJson : function(json){
        if(json.ret == "0"){
            if(json.winYn=="Y"){
                if(json.whatDay=="0") { // 평일 
                    // 평일
                    mevent.detail.eventShowLayer('evtGift2_1'); 
                }else {
                    //빨간날 
                    mevent.detail.eventShowLayer('evtGift3_1'); 
                }
            }else{
                if(json.whatDay=="0") { // 평일 
                    // 평일
                    mevent.detail.eventShowLayer('evtFail2');
                }else {
                    //빨간날 
                    mevent.detail.eventShowLayer('evtFail3'); 
                }
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
              , _baseUrl + "event/20180501/getApplyEventJson.do"
              , param
              , monthEvent.detail._callback_getApplyEventJson
        );
    },
    
    _callback_getApplyEventJson : function(json){
        if(json.ret == "0"){
            /* 신청되었으면 비활성화 */
            if(json.applyOne == 1){
                $("div#chul2_1").css("display", "none");
                $("div#chul2_1_1").css("display", "block");
            }else {
                $("div#chul2_1").css("display", "block");
                $("div#chul2_1_1").css("display", "none");
            }
            if(json.applyTwo == 1){
                $("div#chul2_2").css("display", "none");
                $("div#chul2_2_1").css("display", "block");
            }else {
                $("div#chul2_2").css("display", "block");
                $("div#chul2_2_1").css("display", "none");
            }
            if(json.applyThree == 1){
                $("div#chul2_3").css("display", "none");
                $("div#chul2_3_1").css("display", "block");
            }else {
                $("div#chul2_3").css("display", "block");
                $("div#chul2_3_1").css("display", "none");
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
              , _baseUrl + "event/20180501/getMyStmpEventJson.do"
              , param
              , monthEvent.detail._callback_getMyStmpEventJson
        );
    },
    _callback_getMyStmpEventJson : function(json){
        if(json.ret == "0"){
                if(json != undefined && json != null){
                    var newCheckList = json.newCheckList;
                     $("div#eDay1").find("td#eDay2").each(function(index){ 
                           if(newCheckList != undefined && newCheckList != null && newCheckList.length > 0){
                               for(var i=0; i<newCheckList.length; i++){
                                   if(index ==   i){
                                          if(newCheckList[i].strtDtime == 1 ){
                                              var htmlStr = "";
                                              htmlStr =  "<img src='"+_cdnImgUrl + "contents/201805/01chulcheck/chulcheck_stamp.png' alt='출석'>";
                                              $("td#eDay2").find("span#check"+i+"").html(htmlStr);
                                          }else {
                                              var htmlStr = "";
                                              htmlStr =  "";
                                              $("td#eDay2").find("span#check"+i+"").html(htmlStr);
                                          }
                                    }
                               }
                           }
                     });
                }
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
    
    
    
    /* 7일 연속 출첵시 
     * 14일 연속 출첵시 
     * 21일 연속 출첵시  */
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
                  , _baseUrl + "event/20180501/checkAttendCheckDayJson.do" // ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : fvrSeq
                    }
                  , function(json){ 
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                        if(json.ret == "0"){
                            if( json.myTotalCnt  == "0" ) {  // 7일연속, 14일연속, 21일연속  세개중 한번도 신청하지 않은경우 위수탁 받기 
                              //  $("div#Confirmlayer1").attr("onClick", "monthEvent.detail.applyAttendCheckDayInfo(' " + fvrSeq + "');");
                                $("div#Confirmlayer1").attr("onClick", "   monthEvent.detail.applyAttendCheckDayInfo(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); "         );
                                monthEvent.detail.eventShowLayer1('eventLayerPolice2');
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
        //alert("myTotalCnt===> " + myTotalCnt);
       // alert("fvrSeq===> " + fvrSeq);
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
           
           /* 수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
           var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
           var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();
           
           if(myTotalCnt == 0 ){ 
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
                  , _baseUrl + "event/20180501/applyAttendCheckDayInfo.do"  
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
                    if(json.fvrSeq == "32"){ // 7일 
                        mevent.detail.eventShowLayer('evtGift1_1'); 
                    }else  if(json.fvrSeq == "33"){ // 14일 
                        mevent.detail.eventShowLayer('evtGift1_2'); 
                    }else  if(json.fvrSeq == "34"){ // 21일 
                        mevent.detail.eventShowLayer('evtGift1_3'); 
                    }
                }else {
                    // 실패
                    mevent.detail.eventShowLayer('evtFail1'); 
                }      
        }else{
            alert(json.message);
        }
         /* 경품 응모 했는지 조회 */ 
         monthEvent.detail.getApplyEvent();
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
       // alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){ 
        alert($("input[name='closeMsgTxt']:hidden").val());
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