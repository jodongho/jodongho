/**
 * 배포일자 : 2020.01.30
 * 오픈일자 : 2020.02.01
 * 이벤트명 : 2월 출석체크 초콜릿 속 행운 찾기
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    baseImgPath : _cdnImgUrl + "contents/202002/01attend/",
    currentDay : null,
    layerPolice : false,
    appIng : false,
    attendCall : false,
    evtTodayLuckyPop : false,
    evtPoint : '',
    init : function(){
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

        if(common.isLogin()){
            /* 로그인한 회원 출석 현황 조회 */
            monthEvent.detail.getAttendList();
        }

        //초콜릿 박스 닫기X
        $("#popGameChoco .eventHideLayer").click(function(){
            clearTimeout(monthEvent.detail.evtTodayLuckyPop);
            $('.itemBox .itemCon').removeClass('active');
        });
        //초콜릿 박스 내 하나 클릭.
        $(".itemCon img").click(function(){
            monthEvent.detail.evtTodayLucky();
        });
        
        // 출석처리
        $("div.gameStart").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("APP 에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else if(!$(this).hasClass('on')){
                    return;
                }else{
                    //앱 푸시 수신동의 여부 확인
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                    };
                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/getAppPushYnCntJson.do"
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
                javascript:monthEvent.detail.checkApply('30');
            }
        });

        //15일 경품응모하기
        $(".gift2").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('31');
            }
        });

        //25일 경품응모하기
        $(".gift3").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('32');
            }
        });
    },

    /* 로그인한 회원 출석 현황 조회 */
    getAttendList : function(){
        var notInFvrSeqArr = [ "30", "31", "32"];
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val(),
            startDate : monthEvent.detail.currentDay,
            notInFvrSeqArr : notInFvrSeqArr.toString()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200201/getAttendList.do"
              , param
              , monthEvent.detail._callback_getAttendList
        );
    },

    _callback_getAttendList : function(json){
        monthEvent.detail.attendCall = true;
        if(json.ret == "0"){
            var attendList = json.attendList;
            $("div.evtCon03 td:not(:has(span.blank))").each(function(i){
                if(attendList != undefined && attendList != null && attendList.length > 0){
                    var htmlStr = '';
                    if(attendList[i].strtDtime == 1 ){
                        if(monthEvent.detail.currentDay == attendList[i].nowDate){
                            $('.evtCon02 .gameStart').removeClass('on');
                        }
                        htmlStr =  "<img src='"+monthEvent.detail.baseImgPath+"bg_attend.png' alt='출석'>";
                    }
                    $(this).html(htmlStr);
                }
            });
            $("div.evtCon03").find('.totalCount span').text($("div.evtCon03 td:has(img)").length);

            $(".gift1, .gift2, .gift3").removeClass("on end");
            $(".gift1").addClass(json.apply1);
            $(".gift2").addClass(json.apply2);
            $(".gift3").addClass(json.apply3);
        }else{
            alert(json.message);
        }
    },

    _callback_getAppPushYnCntJson : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 이벤트 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭하세요.");
        }else{
            mevent.detail.eventShowLayer('popGameChoco');
        }
    },

    /* 회원 출석 등록 */
    addMyStmp : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("APP 에서만 참여 가능합니다.")){
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
                if(monthEvent.detail.appIng){
                    return;
                }
                monthEvent.detail.appIng = true;
                monthEvent.detail.evtPoint = '';

                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val(),
                        startDate : monthEvent.detail.currentDay
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/attend/addMyStmpJson.do"
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
                monthEvent.detail.evtPoint = 'evtPoint1';
            }else{
                monthEvent.detail.evtPoint = 'evtPointFail';
            }

            monthEvent.detail.evtTodayLuckyResult();
            monthEvent.detail.getAttendList();
        }else if(json.ret == "024"){
            monthEvent.detail.appIng = false;
            $('#eventDimLayer').hide();
            $('.gameStart').removeClass('on');
            alert('오늘은 이미 참여하셨습니다.');
        }else {
            monthEvent.detail.appIng = false;
            $('#eventDimLayer').hide();
            alert(json.message);
        }
    },

    checkApply : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP 에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }
            var notInFvrSeqArr = ["30", "31", "32"];
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : fvrSeq
                    , notInFvrSeqArr : notInFvrSeqArr.toString()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20200201/checkApply.do"
                  , param
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                        if(json.ret == "042"){
                            alert('APP PUSH 수신 동의 고객만 이벤트 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭하세요.');
                        }else if(json.ret == "0"){
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
        }
    },

    apply : function(fvrSeq,myTotalCnt){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP 에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
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
            var notInFvrSeqArr = ["30", "31", "32"];
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : fvrSeq
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                  , notInFvrSeqArr : notInFvrSeqArr.toString()
                  , startDate : monthEvent.detail.currentDay
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200201/apply.do"
                  , param
                  , monthEvent.detail._callback_apply
            );
        }
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            if(json.winYn=="Y"){
                // 성공
                if(json.fvrSeq == "30"){ // 10일
                    mevent.detail.eventShowLayer('evtGift1');
                    $(".win_number").text('('+json.tgtrSeq+')');
                }else  if(json.fvrSeq == "31"){ // 15일
                    mevent.detail.eventShowLayer('evtGift2');
                    $(".win_number").text('('+json.tgtrSeq+')');
                }else  if(json.fvrSeq == "32"){ // 25일
                    mevent.detail.eventShowLayer('evtGift3');
                    $(".win_number").text('('+json.tgtrSeq+')');
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
            $("#evtPopWinDetail tbody").html(myWinListHtml);

            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else{
            alert(json.message);
        }
    },

    /* 앱 푸시 설정 바로가기 */
    goSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP에서 설정 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    },

  eventShowLayerPoint : function(obj){       
      var layObj = document.getElementById(obj);
      var layDim = document.getElementById('eventDimLayer');
      layDim.style.display = 'block';
      layObj.style.display = 'block';
      layObj.classList.add('bounce');
      var layObjHeight = layObj.clientHeight  / 2;
      layObj.style.marginTop = "-" + layObjHeight +"px";
  },
  evtPopItem : function(){
      popItem1 = setTimeout(function(){ $('.layerGameResult .resultChoco2').show().delay(500).fadeOut();}, 2500);
      popItem2 = setTimeout(function(){ 
                              monthEvent.detail.appIng = false;
                              monthEvent.detail.eventShowLayerPoint(monthEvent.detail.evtPoint); 
                          }, 3200);
  },
  evtTodayLuckyResult : function(){ 
      $('.resultChoco2').hide();
      $('#eventDimLayer').addClass('luckyResult')
      mevent.detail.eventShowLayer('popGameResult'); 
      $('.layerGameResult .resultChoco1').delay(2000).fadeOut();
      monthEvent.detail.evtPopItem();
  },
  evtTodayLucky : function(){
      $('.itemBox .itemCon').addClass('active');
      $('#popGameChoco').delay(3500).fadeOut();

      monthEvent.detail.evtTodayLuckyPop = setTimeout(function(){
          monthEvent.detail.addMyStmp();
      },3800);
  }
}