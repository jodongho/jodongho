/**
 * 배포일자 : 2019.12.26
 * 오픈일자 : 2020.01.01
 * 이벤트명 : 1월 출석체크 복주머니
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    baseImgPath : _cdnImgUrl + "contents/202001/01attend/",
    currentDay : null,
    layerPolice : false,
    tgtrSeq : '',
    appIng : false,
    attendCall : false,
    init : function(){
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

        if(common.isLogin()){
            /* 로그인한 회원 출석 현황 조회 */
            monthEvent.detail.getAttendList();
        }

        //오늘의 운세 닫기 클릭
        $('#evtTodayResult .close').click(function(){
            if(confirm('지금 닫으면 오늘의 운세 재확인 불가합니다.')){
                mevent.detail.eventCloseLayer();
            }
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

    // 팝업 모션 (2019.12.10 추가)
    eventShowLayer_motion : function(obj) {
      var layObj = document.getElementById(obj);
      var layDim = document.getElementById('eventDimLayer');

      if($('.eventLayer:visible').length) $('.eventLayer:visible').css('display','none');

      layDim.style.display = 'block';
      layObj.style.display = 'block';

      layObj.classList.add('bounce');
      var layObjHeight = layObj.clientHeight / 2;
      layObj.style.marginTop = "-" + layObjHeight + "px";
    },

    //오늘의 운세 start
    eventToday : function(obj){
      var $this = $('.evtCon02 .evtBtn');
      if($this.hasClass('complete')) return false;

      $this.fadeOut('fast',function(){
        $('.evtCon02 .imgBox .itemBox').addClass('on');
        setTimeout(function(){
            $this.fadeIn('fast').addClass('complete');
            $('.evtCon02 .imgBox .itemBox').removeClass('on');

            monthEvent.detail.appIng = false;
            if(!common.isEmpty(monthEvent.detail.tgtrSeq)){
                monthEvent.detail.eventShowLayer_motion('evtPoint');
                monthEvent.detail.tgtrSeq = '';
            }else{
                monthEvent.detail.getFortuneCookie();
            }
          },2000);
      });
    },

    /* 오늘의 운세 결과 보기 */
    getFortuneCookie : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP 에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else if(monthEvent.detail.appIng){
                return;
            }else{
                monthEvent.detail.appIng = true;
                var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20200101/getFortuneCookie.do"
                      , param
                      , monthEvent.detail._callback_getFortuneCookie
                );
            }
        }
    },

    _callback_getFortuneCookie : function(json){
        monthEvent.detail.appIng = false;
        if(json.ret == "0"){
            $('#evtTodayResult .txt_area').text(json.reult_fdata);
            mevent.detail.eventCloseLayer();
            monthEvent.detail.eventShowLayer_motion('evtTodayResult');
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
            $("div.evtCon03 td:not(:has(span.blank))").each(function(i){
                if(attendList != undefined && attendList != null && attendList.length > 0){
                    var htmlStr = '';
                    if(attendList[i].strtDtime == 1 ){
                        if(monthEvent.detail.currentDay == attendList[i].nowDate){
                            $('.evtCon02 .evtBtn').addClass('complete');
                        }
                        htmlStr =  "<img src='"+monthEvent.detail.baseImgPath+"bg_attend.png' alt='출석'>";
                    }
                    $(this).html(htmlStr);
                }
            });
            $("div.evtCon03").find('.check_count span').text($("div.evtCon03 td:has(img)").length);
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
                if(monthEvent.detail.appIng){
                    return;
                }
                if($('.evtCon02 .evtBtn').hasClass('complete')){
                    return;
                }
                monthEvent.detail.appIng = true;
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
                monthEvent.detail.tgtrSeq = json.tgtrSeq;
            }
            monthEvent.detail.eventToday();

            var attendTimer = setInterval(function(){
                if(monthEvent.detail.attendCall){
                    monthEvent.detail.attendCall = false;
                    monthEvent.detail.appIng = false;
                    clearInterval(attendTimer);
                }
                monthEvent.detail.getAttendList();
            }, 1500);
        }else if(json.ret == "024"){
            $('.evtCon02 .evtBtn').addClass('complete');
            setTimeout(function(){
                alert('오늘은 이미 참여했습니다. 내일 참여해주세요.');
              },200);
            monthEvent.detail.appIng = false;
        }else {
            alert(json.message);
            monthEvent.detail.appIng = false;
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
                    monthEvent.detail.eventShowLayer_motion('evtGift1');
                    $(".win_number").text('('+json.tgtrSeq+')');
                }else  if(json.fvrSeq == "33"){ // 20일
                    monthEvent.detail.eventShowLayer_motion('evtGift2');
                    $(".win_number").text('('+json.tgtrSeq+')');
                }else  if(json.fvrSeq == "34"){ // 30일
                    monthEvent.detail.eventShowLayer_motion('evtGift3');
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
    }
}