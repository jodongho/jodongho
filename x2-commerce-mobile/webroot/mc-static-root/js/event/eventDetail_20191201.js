/**
 * 배포일자 : 2019.11.25
 * 오픈일자 : 2019.12.01
 * 이벤트명 : 12월 출석체크
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    baseImgPath : _cdnImgUrl + "contents/201912/01attend/",
    selTarotList : ',',
    currentDay : null,
    layerPolice : false,
    firstYn : "N",
    attendCall : false,
    init : function(){
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

        //카드 결과 초기화
        $('#todayTarotResult .cardImg img').attr('src', monthEvent.detail.baseImgPath + '/tarot_card_off.png');
        $('#todayTarotResult .txt_des').text('');

        if(common.isLogin()){
            /* 로그인한 회원 출석 현황 조회 */
            monthEvent.detail.getAttendList();
            monthEvent.detail.setShuffleCard();
        }

        // 타로카드 토글
        $('.card_list .card').click(function() {
            monthEvent.detail.selectCardList(this);
        });
        //타로카드 닫기
        $('#todayTarot .close').click(function() {
            if(confirm('지금 닫으면 오늘의 타로 재참여 불가합니다.')){
                mevent.detail.eventCloseLayer();
            }
        });
        //결과보기
        $('#getTarotResult').click(function() {
            monthEvent.detail.getTarotResult();
        });

        //출석 당첨
        $('#evtPoint1 .close').click(function() {
            mevent.detail.eventCloseLayer();
            mevent.detail.eventShowLayer('todayTarot');
        });

        // 출석처리
        $("div#eAttend").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("APP 에서만 참여 가능합니다.")){
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
                javascript:monthEvent.detail.checkApply('32');
            }
        });

        //20일 경품응모하기
        $(".gift2").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('33');
            }
        });

        //30일 경품응모하기
        $(".gift3").click(function(){
            if($(this).hasClass("on")){
                javascript:monthEvent.detail.checkApply('34');
            }
        });
    },

    setShuffleCard : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var _arrayCard = [];
            
            for(var i=0;i<21;i++){
                _arrayCard.push(i);
            }
            _arrayCard.sort(function(){return Math.random()-0.5});
            for(var i=0;i<_arrayCard.length;i++){
                var tmp = $('.card_list .card:eq(0) .back img').attr('src');
                $('.card_list .card:eq(0) .back img').attr('src', monthEvent.detail.baseImgPath + 'tarot_card_' + _arrayCard[i] + '.png');
                $('.card_list .card:eq('+_arrayCard[i]+') .back img').attr('src', tmp);
            }
        }
    },

    /* 선택한 카드 */
    selectCardList : function(obj){
        var cardList = monthEvent.detail.selTarotList;
        var selectIdx = $(obj).find('.back img').attr('src').split('tarot_card_')[1].split('.')[0];

        if(cardList.split(',').length > 6){
            alert('이미 5개를 선택하셨습니다. 결과를 확인해주세요.');
            return;
        }
        if(cardList.indexOf(','+selectIdx+',') != -1){
            alert('이미 선택한 카드입니다.');
            return;
        }
        cardList += selectIdx + ',';

        monthEvent.detail.selTarotList = cardList;
        $( obj ).children().toggleClass( "flip" );
    },

    /* 카드 결과 보기 */
    getTarotResult : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP 에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                if(monthEvent.detail.selTarotList.split(',').length != 7){
                    alert('카드 5장을 선택해주셔야 결과 확인이 가능합니다.');
                    return;
                }

                var param = {
                    evtNo : $("input[id='evtNo']:hidden").val(),
                    selTarotList : monthEvent.detail.selTarotList
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20191201/getTarotResult.do"
                      , param
                      , monthEvent.detail._callback_getTarotResult
                );
            }
        }
    },

    _callback_getTarotResult : function(json){
        if(json.ret == "0"){
            var tarot = json.tarotMap;

            //1-총운
            $('#todayTarotResult .result1 .sub img').attr({'src': monthEvent.detail.baseImgPath + '/pop_sub_tit01.png', 'alt':'총운'});
            $('#todayTarotResult .result1 .cardImg img').attr({'src': monthEvent.detail.baseImgPath + '/tarot_card_'+monthEvent.detail.selTarotList.split(',')[1]+'.png', 'alt':tarot.reult_total_card});
            $('#todayTarotResult .result1 .txt_des').append( $('<p/>').text(tarot.reult_total_card.split(' ')[tarot.reult_total_card.split(' ').length-1] + '_' + tarot.reult_total_data) );
            //2-애정운
            $('#todayTarotResult .result2 .sub img').attr({'src': monthEvent.detail.baseImgPath + '/pop_sub_tit02.png', 'alt':'애정운'});
            $('#todayTarotResult .result2 .cardImg img').attr({'src': monthEvent.detail.baseImgPath + '/tarot_card_'+monthEvent.detail.selTarotList.split(',')[2]+'.png', 'alt':tarot.reult_love_card});
            $('#todayTarotResult .result2 .txt_des').append( $('<p/>').text(tarot.reult_love_card.split(' ')[tarot.reult_love_card.split(' ').length-1] + '_' + tarot.reult_love_data) );
            //3-건강운
            $('#todayTarotResult .result3 .sub img').attr({'src': monthEvent.detail.baseImgPath + '/pop_sub_tit03.png', 'alt':'재물운'});
            $('#todayTarotResult .result3 .cardImg img').attr({'src': monthEvent.detail.baseImgPath + '/tarot_card_'+monthEvent.detail.selTarotList.split(',')[3]+'.png', 'alt':tarot.reult_money_card});
            $('#todayTarotResult .result3 .txt_des').append( $('<p/>').text(tarot.reult_money_card.split(' ')[tarot.reult_money_card.split(' ').length-1] + '_' + tarot.reult_money_data) );
            //4-인간관계
            $('#todayTarotResult .result4 .sub img').attr({'src': monthEvent.detail.baseImgPath + '/pop_sub_tit04.png', 'alt':'건강운'});
            $('#todayTarotResult .result4 .cardImg img').attr({'src': monthEvent.detail.baseImgPath + '/tarot_card_'+monthEvent.detail.selTarotList.split(',')[4]+'.png', 'alt':tarot.reult_health_card});
            $('#todayTarotResult .result4 .txt_des').append( $('<p/>').text(tarot.reult_health_card.split(' ')[tarot.reult_health_card.split(' ').length-1] + '_' + tarot.reult_health_data) );
            //5-재물운
            $('#todayTarotResult .result5 .sub img').attr({'src': monthEvent.detail.baseImgPath + '/pop_sub_tit05.png', 'alt':'인간관계'});
            $('#todayTarotResult .result5 .cardImg img').attr({'src': monthEvent.detail.baseImgPath + '/tarot_card_'+monthEvent.detail.selTarotList.split(',')[5]+'.png', 'alt':tarot.reult_relation_card});
            $('#todayTarotResult .result5 .txt_des').append( $('<p/>').text(tarot.reult_relation_card.split(' ')[tarot.reult_relation_card.split(' ').length-1] + '_' + tarot.reult_relation_data) );

            mevent.detail.eventCloseLayer();
            mevent.detail.eventShowLayScroll('todayTarotResult');

        }else{
            alert(json.message);
        }
    },

    /* 로그인한 회원 출석 현황 조회 */
    getAttendList : function(){
        var notInFvrSeqArr = ["32", "33", "34"];
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val(),
            startDate : monthEvent.detail.currentDay,
            notInFvrSeqArr : notInFvrSeqArr.toString()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/attend/getAttendList.do"
              , param
              , monthEvent.detail._callback_getAttendList
        );
    },

    _callback_getAttendList : function(json){
        monthEvent.detail.attendCall = true;
        if(json.ret == "0"){
            var attendList = json.attendList;
            $("div.evtCon02").find("td").each(function(index){
                if(attendList != undefined && attendList != null && attendList.length > 0){
                    for(var i=0; i< attendList.length; i++){
                        if(!$(this).children('span').hasClass('blank')){
                               if(attendList[i].strtDtime == 1 ){
                                   var htmlStr = "";
                                   htmlStr =  "<img src='"+monthEvent.detail.baseImgPath+"/bg_attend.png' alt='출석'>";
                                   $("div.evtCon02 td:eq("+(i)+")").html(htmlStr);
                               }else {
                                   var htmlStr = "";
                                   htmlStr =  "";
                                   $("div.evtCon02 td:eq("+(i)+")").html(htmlStr);
                               }
                         }
                    }
                }
          });

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
            monthEvent.detail.addMyStmp();
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
                mevent.detail.eventShowLayer('evtPoint1');
            }else{
                mevent.detail.eventShowLayer('todayTarot');
            }

            var attendTimer = setInterval(function(){
                if(monthEvent.detail.attendCall){
                    clearInterval(attendTimer);
                }
                monthEvent.detail.getAttendList();
            }, 1500);
        }else if(json.ret == "024"){
            alert('오늘은 이미 참여하셨습니다.');
        }else {
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
            var notInFvrSeqArr = ["32", "33", "34"];
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : fvrSeq
                    , notInFvrSeqArr : notInFvrSeqArr.toString()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/attend/checkApply.do"
                  , param
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                        if(json.ret == "042"){
                            alert('APP PUSH 수신 동의 고객만 이벤트 참여 가능합니다. 상단 <설정 바로가기> 버튼을 클릭하세요.');
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
            var notInFvrSeqArr = ["32", "33", "34"];
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
                  , _baseUrl + "event/attend/apply.do"
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
                if(json.fvrSeq == "32"){ // 10일
                    mevent.detail.eventShowLayer('evtGift1');
                    $(".win_number").text('('+json.tgtrSeq+')');
                }else  if(json.fvrSeq == "33"){ // 20일
                    mevent.detail.eventShowLayer('evtGift2');
                    $(".win_number").text('('+json.tgtrSeq+')');
                }else  if(json.fvrSeq == "34"){ // 30일
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
            $("tbody#myWinListHtml").html(myWinListHtml);

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
    }
}