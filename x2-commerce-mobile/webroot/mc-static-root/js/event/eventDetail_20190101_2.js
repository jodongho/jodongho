$.namespace("monthEvent.detail");
monthEvent.detail = {

    currentDay : null,
    mbrInfoUseAgrYn : "N",
    mbrInfoThprSupAgrYn : "N",
    firstYn : "",
    gameYn : "",
    _imgCount : '//qa.oliveyoung.co.kr/uploads/contents/201901/01yourdream/mc_game_step_02.gif',
    _num : "",
    init : function(){
        monthEvent.detail._num = "";
        var tabH = $(".scrollTab img").height();
        $("#eventTabFixed2").css("height",tabH + "px");

        var mHeader = $('#mHeader').outerHeight();
        var titBox = $('.eventView > .titBox').outerHeight() + 10;
        var titConts = $('#titConts').outerHeight();
        var conHeight = mHeader + titBox + titConts;

        var tabHeight =$("#eventTabImg").height()  + conHeight;
        var eTab01 = tabHeight + $("#evtConT01").height() - 5;
        var eTab02 = eTab01 + $("#evtConT02").height() - 5;
        var eTab03 = eTab02 + $("#evtConT03").height();

        var scrollTab  = $(document).scrollTop();

        if (scrollTab > tabHeight) {
            $("#eventTabFixed2")
            .css("position","fixed")
            .css("top","0px");
        }
       if (scrollTab < eTab01) {
            $("#eventTabFixed2").attr('class','tab03');
        };

        $(window).scroll(function(){
            var scrollTab  = $(document).scrollTop();
             if (scrollTab < eTab01) {
                $("#eventTabFixed2").attr('class','tab03');
            }
            if (scrollTab > tabHeight) {
                $("#eventTabFixed2")
                .css("position","fixed")
                .css("top","0px");
            } else {
                $("#eventTabFixed2")
                .css("position","absolute")
                .css("top","");
            }
        });

        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);

        // 정답확인
        $("#eCheck").click(function(){
            monthEvent.detail.eventCheck();
        });

        // 재도전 정답확인
        $("#reCheck").click(function(){
            $('.gameEnd').removeClass('on');
            $('.gameStart').show();
            $('.gameStep').removeClass('start');
            monthEvent.detail.eventCloseLayer();
            monthEvent.detail.gameStart();
        });

        // 나의 당첨내역
        $("div#eMylist").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
            /* 당첨이력조회 */
            monthEvent.detail.getMyWinList();
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

    checkAregg : function(myTotalCnt){

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

            if(myTotalCnt == 0){
                /*수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y*/
                monthEvent.detail.mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
                monthEvent.detail.mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

                if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("N"==$(':radio[name="argee1"]:checked').val() &&  "N"==$(':radio[name="argee2"]:checked').val()){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee1"]:checked').val()){
                    alert("개인정보 수집 이용 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee2"]:checked').val()){
                    alert("개인정보 처리 위탁 동의 후 참여 가능합니다.");
                    return;
                }

                if("Y" != monthEvent.detail.mbrInfoUseAgrYn){
                    monthEvent.detail.eventCloseLayer();
                    return;
                }
                if("Y" != monthEvent.detail.mbrInfoThprSupAgrYn){
                    monthEvent.detail.eventCloseLayer();
                    return;
                }
            }else {
                monthEvent.detail.mbrInfoUseAgrYn = "Y";
                monthEvent.detail.mbrInfoThprSupAgrYn = "Y";
            }
            monthEvent.detail.gameApply();
        }
    }

    ,gameApply : function(){
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190101_2/gameApplyJson.do" // ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
              , {
                  evtNo : $("input[id='evtNo']:hidden").val()
                }
              , function(json){
                  if(json.ret == "0"){
                      monthEvent.detail.eventCloseLayer();
                      monthEvent.detail.gameStart();
                  }else{
                        alert(json.message);
                  }
              }
        );
    }

    ,gameStart : function(){
        $("#intx").val("");
        var _gamearea = $('.gamearea');
        var _gameStep = _gamearea.find('.gameStep');
        var _gameStart = _gamearea.find('.gameStart');

            _gameStart.hide();
            _gameStep.removeClass('start');
            _gameStep.css({
                'background-image': 'url("' + monthEvent.detail._imgCount + '?x=' + Date.now() + '")',
                'background-size':100+'%'
            });
            setTimeout(function() {monthEvent.detail.gameTable()}, 4000);
    },

    gameTable : function(){
        var _gamearea = $('.gamearea');
        var _gameStep = _gamearea.find('.gameStep');
        var _gameStart = _gamearea.find('.gameStart');
        _gameStep.removeAttr('style');
        if(monthEvent.detail._num == ""){   //재도전시 같은 그림
            monthEvent.detail._num = Math.floor(Math.random() * 21) + 1;
        }

        var _tableNum = 'gameTable'+monthEvent.detail._num;
        _gameStep.removeClass('step2').addClass(_tableNum);
        setTimeout(function() {
            monthEvent.detail.gameEnd(_tableNum);
        }, 2000);
    },

    gameEnd : function(_tableNum){
        var _gamearea = $('.gamearea');
        var _gameStep = _gamearea.find('.gameStep');
        var _gameStart = _gamearea.find('.gameStart');
        var _gameEnd = _gamearea.find('.gameEnd');

        _gameStep.removeClass(_tableNum).addClass('start');
        _gameStep.removeClass(_tableNum);
        _gameEnd.addClass('on');
    },

    appPushCheck : function(){
        if(mevent.detail.gameYn == "Y"){
            alert("이미 참여하셨습니다.");
            return;
        }

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
                      , _baseUrl + "event/20190101_2/getAppPushYnCntJson.do"
                      , param
                      , monthEvent.detail._callback_getAppPushYnCntJson
                );
            }
        }
    },

    eventCheck : function(){
        if($("#intx").val() == ""){
            alert("정답을 입력하세요.");
            return;
        }

        if(monthEvent.detail._num == ""){
            alert("게임하기를 시작하세요.");
            return;
        }
        //앱 푸시 수신동의 여부 확인
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val(),
                fvrSeq : monthEvent.detail._num,
                intx : $("#intx").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190101_2/checkAnswerJson.do"
              , param
              , monthEvent.detail._callback_checkAnswerJson
        );
    },

    checkDreamJson : function(){
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

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190101_2/checkDreamJson.do" // ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , startDate : $("input[id='targetNum']:hidden").val()
                    }
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                      if(json.ret == "0"){
                          if( json.myTotalCnt  == "0" ) {  //한번도 신청하지 않은경우 위수탁 받기
                              $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.checkAregg('"+json.myTotalCnt+"');");
                              mevent.detail.eventShowLayer('eventLayerPolice');
                              monthEvent.detail.firstYn = "Y";
                          }else {
                              monthEvent.detail.gameApply();
                              monthEvent.detail.firstYn = "N";
                          }
                      }else{
                            alert(json.message);
                      }
                  }
            );

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
              , _baseUrl + "event/20190101_2/getMyFvrWinListJson.do"
              , param
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },

    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='3' class='no'>당첨이력이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtTgtrSctCd + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("tbody#myWinListHtml").html(myWinListHtml);

            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else{
            alert(json.message);
        }
    },

    _callback_getAppPushYnCntJson : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다.");
        }else{
            monthEvent.detail.checkDreamJson();
        }
    },

    _callback_checkAnswerJson : function(json){
        if(json.ret == "0"){
            if(json.result == "E"){
                alert("정답을 입력하세요.");
                return;
            }
            if(json.result == "F"){
                mevent.detail.eventShowLayer('evtGiftRe');
            }
            if(json.result == "S"){
                monthEvent.detail.giftEntry();
            }
        }else{
            alert(json.message);
            $('.gameEnd').removeClass('on');
            $('.gameStart').show();
            $('.gameStep').removeClass('start');
        }

    },

    giftEntry : function(){
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
                      , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
                      , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
                      , firstYn : monthEvent.detail.firstYn     //최초참여여부
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20190101_2/giftEntryJson.do"
                      , param
                      , monthEvent.detail._callback_giftEntryJson
                );
            }
        }
    },

    _callback_giftEntryJson : function(json){
        if(json.ret == "0"){
            console.log("json.fvrSeq===="+json.fvrSeq);
            if(json.fvrSeq != "1"){
                $(".win_number").text("("+json.tgtrSeq+")");
            }
            $('.gameEnd').removeClass('on');
            $('.gameStart').show();
            $('.gameStep').removeClass('start');
            monthEvent.detail._num = "";
            $("#intx").val("");
            mevent.detail.eventShowLayer("evtGift"+json.fvrSeq);
            mevent.detail.gameYn = "Y ";
        }else{
            alert(json.message);
        }

    },

    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },

    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        location.reload();//새로고침
    },
}