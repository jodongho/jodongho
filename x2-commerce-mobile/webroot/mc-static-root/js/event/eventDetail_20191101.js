/**
 * 배포일자 : 2019.10.31
 * 오픈일자 : 2019.11.01
 * 이벤트명 : 11월 출석체크
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {

    currentDay : null,
    layerPolice : false,
    firstYn : "N",
    init : function(){
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

        if(common.isLogin()){
            /* 로그인한 회원 출석 현황 조회 */
            monthEvent.detail.getAttendList();
        }

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
                    //앱 푸시 수신동의 여부 확인
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                    };
                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/20191101/getAppPushYnCntJson.do"
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

        //10일 경품응모하기
        $(".gift1").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('31');
            }
        });

        //20일 경품응모하기
        $(".gift2").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('32');
            }
        });

        //30일 경품응모하기
        $(".gift3").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('33');
            }
        });

        //응모하기 1
        $("#applyStamp1").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('35');
            }
        });

        //응모하기 2
        $("#applyStamp2").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('36');
            }
        });

        //응모하기 3
        $("#applyStamp3").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('37');
            }
        });
    },

    /* 로그인한 회원 출석 현황 조회 */
    getAttendList : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val(),
            startDate : monthEvent.detail.currentDay
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191101/getAttendList.do"
              , param
              , monthEvent.detail._callback_getAttendList
        );
    },

    _callback_getAttendList : function(json){
        if(json.ret == "0"){
            var attendList = json.attendList;
            $("div#eDay1").find("td.eDay2").each(function(index){
                if(attendList != undefined && attendList != null && attendList.length > 0){
                    for(var i=0; i< attendList.length; i++){
                        if(index == i){
                               if(attendList[i].strtDtime == 1 ){
                                   var htmlStr = "";
                                   htmlStr =  "<img src='"+_cdnImgUrl + "contents/201909/01attend/bg_attend.png' alt='출석'>";
                                   $("td.eDay2").find("span#check"+i+"").html(htmlStr);
                               }else {
                                   var htmlStr = "";
                                   htmlStr =  "";
                                   $("td.eDay2").find("span#check"+i+"").html(htmlStr);
                               }
                         }
                    }
                }
          });

          $(".gift1, .gift2, .gift3").removeClass("on end");
          $("[id^='applyStamp']").removeClass("on end");
          $("[id^='bonus']").removeClass("on end");

          $.each(json.stampList, function(idx, obj){
              $("#bonus"+idx).addClass("on");
              $("#bonus"+idx).html("<em>"+obj.winDtime+"</em>");

          });

          $(".gift1").addClass(json.apply1);
          $(".gift2").addClass(json.apply2);
          $(".gift3").addClass(json.apply3);

          $("#applyStamp1").addClass(json.apply4);
          $("#applyStamp2").addClass(json.apply5);
          $("#applyStamp3").addClass(json.apply6);

        }else{
            alert(json.message);
        }
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
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
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
                        startDate : monthEvent.detail.currentDay
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20191101/addMyStmpJson.do"
                      , param
                      , monthEvent.detail._callback_addMyStmpJson
                );
            }
        }
    },

    _callback_addMyStmpJson : function(json){
        if(json.ret == "0"){
            if(json.winYn == "Y"){
                $(".win_number").text("("+json.tgtrSeq+")");
                mevent.detail.eventShowLayer('evtPoint1');
            }else{
                mevent.detail.eventShowLayer('evtPointFail');
            }
            monthEvent.detail.getAttendList();
        }else {
            alert(json.message);
        }
    },

    checkApply : function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , fvrSeq : fvrSeq
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20191101/checkApply.do"
              , param
              , function(json){
                  $(':radio[name="argee1"]:checked').attr("checked", false);
                  $(':radio[name="argee2"]:checked').attr("checked", false);

                    if(json.ret == "0"){
                        if( json.myTotalCnt  == "0" ) {  // 10일연속, 20일연속, 30일연속  세개중 한번도 신청하지 않은경우 위수탁 받기
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
              , fvrSeq : fvrSeq
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191101/apply.do"
              , param
              , monthEvent.detail._callback_apply
        );
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            if(json.winYn=="Y"){
                // 성공
                if(json.fvrSeq == "31"){ // 10일
                    $(".win_number").text(json.tgtrSeq);
                    mevent.detail.eventShowLayer('evtGift1');
                }else  if(json.fvrSeq == "32"){ // 20일
                    $(".win_number").text(json.tgtrSeq);
                    mevent.detail.eventShowLayer('evtGift2');
                }else  if(json.fvrSeq == "33"){ // 30일
                    $(".win_number").text(json.tgtrSeq);
                    mevent.detail.eventShowLayer('evtGift3');
                }else{  //스탬프 응모
                    $(".win_number").text(json.tgtrSeq);
                    mevent.detail.eventShowLayer('evtGift3');
                }
            }else {
                // 실패
                mevent.detail.eventShowLayer('evtGiftFail');
            }
            monthEvent.detail.getAttendList();
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

    /* 오특 출석 등록 */
    addHotdealStmp : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
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
                        evtNo : $("input[id='evtNo']:hidden").val(),
                        startDate : monthEvent.detail.currentDay,
                        fvrSeq : "34"
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20191101/addHotdealStmp.do"
                      , param
                      , monthEvent.detail._callback_addHotdealStmp
                );
            }
        }
    },

    _callback_addHotdealStmp : function(json){
        if(json.ret == "0"){
            alert("출석체크 완료");
            monthEvent.detail.getAttendList();
        }else {
            alert(json.message);
        }
    }
}