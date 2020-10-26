$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    firstYn : "",
    clickCnt : "0",
    myGiftboxCnt : "",
    myEntryGiftboxCnt : "",
    tgtrSeq : "",
        
    init : function(){
        if($("#eventTabFixed").length == 1) {
            $(window).scroll(function(){
                var scrollTop = $(document).scrollTop();
                //var tabHeight =$("#eventTabImg").height() + 203;
                var tabHeight = 202;
                if (scrollTop > tabHeight) {
                    $("#eventTabFixed")
                    .css("position","fixed")
                    .css("top","0px");
                } else {
                    $("#eventTabFixed")
                    .css("position","absolute")
                    .css("top","");
                }
            });
        };
        
        if(common.isLogin()){
            // 선물상자 확인
            monthEvent.detail.myGiftboxChkJson();
        };
                
        /* 닫기  */
        $(".eventHideLayer1").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });
        
        /* 위수탁 레이어 닫기 */
        $(".eventHideLayer2").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
        /* 선물상자 받기 클릭 */
        $("#giftboxStep").one("click", function () {        //응모하기 광클을 막고 한번만 실행되어야 하기에 .one 사용
//        $("#giftboxStep").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    location.reload();      //선물상자 받기 클릭 원상복구를 위해 페이지 새로고침(알럿 이후 클릭 자체가 막히기 때문에)
                    return;
                }  
            }else{
                if(common.isLogin() == false){
                    if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                        location.reload();      //선물상자 받기 클릭 원상복구를 위해 페이지 새로고침(알럿 이후 클릭 자체가 막히기 때문에)
                        return false;
                    }else{
                        common.link.moveLoginPage();
                        return false;
                    }
                }else{
                    common.Ajax.sendJSONRequest(
                            "GET"
                            , _baseUrl + "event/20181129_3/getEvtDayCntChkJson.do" // ID 당 1일 1회 참여 가능
                            , {
                                    evtNo : $("input[id='evtNo']:hidden").val()
                                    , fvrSeq : "1"
                            }
                            , function(json){
                                if(json.ret == "0"){
                                    $("#giftboxStep").removeClass("step1").addClass("step2");
                                    
                                    var reChallYn = json.reChall;
                                    monthEvent.detail.tgtrSeq = json.tgtrSeq;
                                    
                                    setTimeout(function() {     //4초 후 class변경
                                        $("#giftboxStep").css("display", "none");
                                        $(".BS_giftbox_click").css("display", "block");
                                        
                                        //제한시간 5초 카운트
                                        var seconds = 5;                                    
                                        var interval = setInterval(function(){
                                            seconds--;                                        
                                            $(".gb_time").html("<span>"+seconds+"</span> 초");
                                            
                                            if (seconds <= 3) {     //3초 이후부터는 타이머에 위험표시 추가
                                                $(".gb_time").addClass("danger");
                                            }
                                            
                                            if (seconds <= 0) {
                                                seconds = 0;
                                                clearInterval(interval);
                                                
                                                var cnt =  monthEvent.detail.clickCnt.numberFormat();
                                                if(cnt < 10){       //10회 미만
                                                    if(reChallYn == "Y"){       //재도전 기회에서 10회 미만일 경우
                                                        alert("안타깝지만 도전 실패! 재도전 기회는 1번뿐!");
                                                        location.reload();      //선물상자 받기 클릭 원상복구를 위해 페이지 새로고침(알럿 이후 클릭 자체가 막히기 때문에)
                                                    }else{
                                                        $("#evtGift_failCnt").html(cnt);
                                                        $(".re_chall").attr("onclick", "monthEvent.detail.eventCloseLayer1();");
                                                        mevent.detail.eventShowLayer("evtGift_fail");
                                                    }
                                                }else if(cnt >= 10 && cnt <= 30){     //10~30회
                                                    $("#evtGift1Cnt").html(cnt);
                                                    mevent.detail.eventShowLayer("evtGift1");
                                                }else{      //31회 이상
                                                    $("#evtGift2Cnt").html(cnt);
                                                    mevent.detail.eventShowLayer("evtGift2");
                                                }
                                                //선물상자 클릭 참여
                                                monthEvent.detail.giftboxClickEntry();
                                            }
                                        }, 1000);
                                    }, 4000);
                                }else{
                                    alert(json.message);
                                    location.reload();      //선물상자 받기 클릭 원상복구를 위해 페이지 새로고침(알럿 이후 클릭 자체가 막히기 때문에)
                                }
                            }
                     );
                }
                
            }
        });
        
        /* 선물상자 오픈 클릭 */
        $("#giftboxOpen").one("click", function () {        //선물상자 오픈 광클을 막고 한번만 실행되어야 하기에 .one 사용
            monthEvent.detail.myGiftboxOpen();
        });
        
        $(".gb_click").click(function(){            
            var cnt =  monthEvent.detail.clickCnt.numberFormat();
            cnt++
            monthEvent.detail.clickCnt = cnt;
        });

    },
    
    /* 선물상자 클릭 참여 */
    giftboxClickEntry : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                location.reload();      //선물상자 클릭 원상복구를 위해 페이지 새로고침(알럿 이후 클릭 자체가 막히기 때문에)
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else{                
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : "N"           //개인정보 이용 동의 여부(등록시 공통로직에서 해당 값 체크하는 부분때문에 N으로 고정)
                      , mbrInfoThprSupAgrYn : "N"    //개인정보 위탁동의 여부(등록시 공통로직에서 해당 값 체크하는 부분때문에 N으로 고정)
                      , noteCont : monthEvent.detail.clickCnt     //클릭 카운트
                      , fvrSeq : "1"
                      , tgtrSeq : monthEvent.detail.tgtrSeq     //업데이트 할 tgtrSeq
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20181129_3/giftboxClickEntryJson.do"
                      , param
                      , monthEvent.detail._callback_giftboxClickEntryJson
                );
            }
        }
    },
    _callback_giftboxClickEntryJson : function(json){
        
    },
    
    /** 나의 참여 이력 */
    getMyClickList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181129_3/getMyClickListJson.do"
              , param
              , monthEvent.detail._callback_getMyClickListJson
        );
    },
    _callback_getMyClickListJson : function(json){
        if(json.ret == "0"){
            if(json.myEvtClickList.length > 0){
                var myClickListHtmlGift = "";

                for(var i=0 ; i<json.myEvtClickList.length ; i++){
                    myClickListHtmlGift += "<tr><td>" + json.myEvtClickList[i].strSbscSgtDtime + "</td><td>" + json.myEvtClickList[i].noteCont + "회</td></tr>";
                }

                if(myClickListHtmlGift != ""){
                    $("tbody#myClickListHtmlGift").html(myClickListHtmlGift);
                }
            }
            mevent.detail.eventShowLayer('evtPopWinDetail2');
        }else{
            alert(json.message);
        }
    },
    
    /*나의 선물상자, 남은 선물상자 확인 */
    myGiftboxChkJson : function(){
        if(common.isLogin()){
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181129_3/myGiftboxChkJson.do"
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : "1"
                    }
                  , monthEvent.detail._callback_myGiftboxChkJson
            );
        }else{
            //나의선물상자
            $("#myGiftboxCnt").text("0");
            
            //남은선물상자
            $("#myEntryGiftboxCnt").text("0");
        }
    },
    _callback_myGiftboxChkJson : function(json){
        if(json.ret == "0"){
            //나의선물상자
            monthEvent.detail.myGiftboxCnt = json.giftboxCnt.toString();
            $("#myGiftboxCnt").text(json.giftboxCnt);
            
            //남은선물상자
            var myEntryGiftboxCnt = json.giftboxCnt.numberFormat() - json.entryCnt.numberFormat();
            monthEvent.detail.myEntryGiftboxCnt = myEntryGiftboxCnt.toString();
            $("#myEntryGiftboxCnt").text(myEntryGiftboxCnt);
            
        }else{
            alert(json.message);
        }
    },
    
    /* 나의 선물상자 오픈 */
    myGiftboxOpen : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                location.reload();      //선물상자 클릭 원상복구를 위해 페이지 새로고침(알럿 이후 클릭 자체가 막히기 때문에)
                return;
            }
        }else{
            if(common.isLogin() == false){
                if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                    location.reload();      //선물상자 받기 클릭 원상복구를 위해 페이지 새로고침(알럿 이후 클릭 자체가 막히기 때문에)
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(monthEvent.detail.myEntryGiftboxCnt == "0"){
                    alert("선물 상자가 없습니다.");
                    location.reload();      //선물상자 클릭 원상복구를 위해 페이지 새로고침(알럿 이후 클릭 자체가 막히기 때문에)
                    return;
                }else{
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                    }
                    
                    $(':radio[name="argee1"]:checked').attr("checked", false);
                    $(':radio[name="argee2"]:checked').attr("checked", false);
                    
                    common.Ajax.sendRequest(
                            "GET"
                          , _baseUrl + "event/20181129_3/getFirstChkJson.do"
                          , param
                          , this._callback_getGiftFirstChkJson
                    );
                }
            }
        }
    },    
    _callback_getGiftFirstChkJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.firstYn = "Y";        //최초 참여 여부 변수값
            mevent.detail.eventShowLayer('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
        }else{
            monthEvent.detail.firstYn = "N";        //최초 참여 여부 변수값
            monthEvent.detail.giftEntry();        //즉석당첨 경품응모
        }
    },
    
    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                return;
            }
            if("N" == $(':radio[name="argee1"]:checked').val() && "N" == $(':radio[name="argee2"]:checked').val() ){
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
            
            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.eventCloseLayer();
                monthEvent.detail.giftEntry();        //즉석당첨 경품응모
            }
        }
    },
    
    /* 즉석당첨 경품응모 */
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
                var param = null;
                if(monthEvent.detail.firstYn == "Y"){
                    param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                          , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
                          , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
                          , firstYn : monthEvent.detail.firstYn     //최초참여여부
                    };
                }else{
                    param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                          , mbrInfoUseAgrYn : "Y"       //개인정보 이용 동의 여부
                          , mbrInfoThprSupAgrYn : "Y"    //개인정보 위탁동의 여부
                          , firstYn : monthEvent.detail.firstYn     //최초참여여부
                    };
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20181129_3/giftEntryJson.do"
                      , param
                      , monthEvent.detail._callback_giftEntryJson
                );
            }
        }
    },
    _callback_giftEntryJson : function(json){
        if(json.ret == "0"){
            var giftPkNum = "";
            if(json.fvrSeq == "2"){
                giftPkNum = "8";
            }else if(json.fvrSeq == "3"){
                giftPkNum = "7";
            }else if(json.fvrSeq == "4"){
                giftPkNum = "6";
            }else if(json.fvrSeq == "5"){
                giftPkNum = "5";
            }else if(json.fvrSeq == "6"){
                giftPkNum = "4";
            }else if(json.fvrSeq == "7"){
                giftPkNum = "3";
            }else if(json.fvrSeq == "8"){
                giftPkNum = "2";
            }else if(json.fvrSeq == "9"){
                mevent.detail.eventShowLayer("evtGF_fail");
                return;
            }
            $("#pk"+giftPkNum).text("("+json.itemPk+")");
            mevent.detail.eventShowLayer("evtGF"+giftPkNum);
        }else{
            alert(json.message);
            location.reload();//새로고침
        }
        
    },
    
    /* 나의 당첨내역 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181129_3/getMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );
    },
    _callback_getMyWinListJson : function(json){
        if(json.ret == "0"){
            if(json.myEvtWinList.length > 0){
                var myWinListHtmlGift = "";

                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                     myWinListHtmlGift += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }

                if(myWinListHtmlGift != ""){
                    $("tbody#myWinListHtmlGift").html(myWinListHtmlGift);
                }                
            }
            mevent.detail.eventShowLayer('evtPopWinDetail');
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