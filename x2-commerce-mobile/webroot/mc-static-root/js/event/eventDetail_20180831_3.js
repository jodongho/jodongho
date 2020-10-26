$.namespace("monthEvent.detail"); 
monthEvent.detail = {
        
    // 현재 날짜 시간을 자바에서 가져와야함 
    currentDay : null, 
    changeDate1 : "201808310000", 
    changeDate2 : "201809010000",      
    changeDate3 : "201809020000",  
    changeDate4 : "201809030000",
    changeDate5 : "201809040000",
    changeDate6 : "201809050000",
    changeDate7 : "201809060000",
    changeDate8 : "201809070000",
    markNum : "1",
        
    init : function(){
        // 숨은그림찾기 start
        $('.btn_start').click(function(){
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
        $('.zone_gg').click(function(){
            if($("#mark"+monthEvent.detail.markNum).children().attr("style") != "display: inline;"){
                if($(".game_count .gg").length<5){
                    $(this).children().find('img').show();
                    monthEvent.detail.failPitcturePuzzle(); 
                }else{
                    location.reload();//새로고침
                }
            }else{
                alert("오늘은 이미 참여하셨습니다.");
            }
        });
        $('.zone_point .mark').click(function(){
            if($("#mark"+monthEvent.detail.markNum).children().attr("style") != "display: inline;"){
                if($(".game_count .gg").length<5){
                    $(this).find('img').show();
                    monthEvent.detail.successPitcturePuzzle();
                }else{
                    location.reload();//새로고침
                }
            }else{
                alert("오늘은 이미 참여하셨습니다.");
            }
        });
        $('.T3_link1_2.sbox').click(function(){
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
                    alert("9월 6일에 응모해주세요!");
                }            
            }
        });
        var timer = setInterval(function () {
            $('.zone_gg img').fadeOut('fast');
        }, 500);
        monthEvent.detail.initPitcturePuzzle();
        // 숨은그림찾기 end
        
        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });
        
        /* 유의사항 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
        /* 위수탁  닫기 */
        $(".eventHideLayer2").click(function(){
            alert("동의 후 참여 가능합니다.");
            monthEvent.detail.eventCloseLayer1();
        });
        
    },
    _callback_getAppPushYnCntJson : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
        }else{
            // 앱푸시 설정 여부 확인 후 진행
            if($(".stamp"+monthEvent.detail.markNum).attr("class")!="undefined"){
                if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate7)  ) {
                    if($(".stamp"+monthEvent.detail.markNum).attr("class").substr(-2) == "on"){
                        alert("이미 참여하셨습니다.");
                    }else{
                        $(".game_cover.sbox").css('display','none');
                    }
                }else{
                    alert("이벤트 일정을 확인 해 주세요.");
                }
            }else{
                alert("오늘은 이미 참여하셨습니다.");
            }
        }
    },
    // 숨은그림찾기 init
    initPitcturePuzzle : function(){ 
        //틀린 수 X 리셋
        $(".game_count li").removeClass("gg");
        
        //숨은그림 찾기 스탬프 확인
        monthEvent.detail.getSuccessListJson();
        
        $(".T3_link1_2").css("display", "block");
        $(".T3_link1").css("display", "none");
        $(".T3_link2").css("display", "none");
        
        //날짜별 숨은그림찾기 이미지 설정
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate2)  ) {
            monthEvent.detail.markNum = "1";
            $("#img1").css("display", "block");
            $("#img2").css("display", "none");
            $("#img3").css("display", "none");
            $("#img4").css("display", "none");
            $("#img5").css("display", "none");
            $("#img6").css("display", "none");
            $("#mark1").css("display", "block");
            $("#mark2").css("display", "none");
            $("#mark3").css("display", "none");
            $("#mark4").css("display", "none");
            $("#mark5").css("display", "none");
            $("#mark6").css("display", "none");
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate2) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate3)  ) {
            monthEvent.detail.markNum = "2";
            $("#img1").css("display", "none");
            $("#img2").css("display", "block");
            $("#img3").css("display", "none");
            $("#img4").css("display", "none");
            $("#img5").css("display", "none");
            $("#img6").css("display", "none");
            $("#mark1").css("display", "none");
            $("#mark2").css("display", "block");
            $("#mark3").css("display", "none");
            $("#mark4").css("display", "none");
            $("#mark5").css("display", "none");
            $("#mark6").css("display", "none");
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)  ) {
            monthEvent.detail.markNum = "3";
            $("#img1").css("display", "none");
            $("#img2").css("display", "none");
            $("#img3").css("display", "block");
            $("#img4").css("display", "none");
            $("#img5").css("display", "none");
            $("#img6").css("display", "none");
            $("#mark1").css("display", "none");
            $("#mark2").css("display", "none");
            $("#mark3").css("display", "block");
            $("#mark4").css("display", "none");
            $("#mark5").css("display", "none");
            $("#mark6").css("display", "none");
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate4) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate5)  ) {
            monthEvent.detail.markNum = "4";
            $("#img1").css("display", "none");
            $("#img2").css("display", "none");
            $("#img3").css("display", "none");
            $("#img4").css("display", "block");
            $("#img5").css("display", "none");
            $("#img6").css("display", "none");
            $("#mark1").css("display", "none");
            $("#mark2").css("display", "none");
            $("#mark3").css("display", "none");
            $("#mark4").css("display", "block");
            $("#mark5").css("display", "none");
            $("#mark6").css("display", "none");
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate5) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate6)  ) {
            monthEvent.detail.markNum = "5";
            $("#img1").css("display", "none");
            $("#img2").css("display", "none");
            $("#img3").css("display", "none");
            $("#img4").css("display", "none");
            $("#img5").css("display", "block");
            $("#img6").css("display", "none");
            $("#mark1").css("display", "none");
            $("#mark2").css("display", "none");
            $("#mark3").css("display", "none");
            $("#mark4").css("display", "none");
            $("#mark5").css("display", "block");
            $("#mark6").css("display", "none");
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate6) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate7)  ) {
            monthEvent.detail.markNum = "6";
            $("#img1").css("display", "none");
            $("#img2").css("display", "none");
            $("#img3").css("display", "none");
            $("#img4").css("display", "none");
            $("#img5").css("display", "none");
            $("#img6").css("display", "block");
            $("#mark1").css("display", "none");
            $("#mark2").css("display", "none");
            $("#mark3").css("display", "none");
            $("#mark4").css("display", "none");
            $("#mark5").css("display", "none");
            $("#mark6").css("display", "block");
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate7)) {
            $(".T3_link1_2").css("display", "none");
            $(".T3_link1").css("display", "block");
            $(".T3_link2").css("display", "block");
            $("#img1").css("display", "none");
            $("#img2").css("display", "none");
            $("#img3").css("display", "none");
            $("#img4").css("display", "none");
            $("#img5").css("display", "none");
            $("#img6").css("display", "none");
            $("#mark1").css("display", "none");
            $("#mark2").css("display", "none");
            $("#mark3").css("display", "none");
            $("#mark4").css("display", "none");
            $("#mark5").css("display", "none");
            $("#mark6").css("display", "none");
            $(".btn_start").css("display", "none");
        }else{
            monthEvent.detail.markNum = "0";
            $("#img1").css("display", "block");
            $("#img2").css("display", "none");
            $("#img3").css("display", "none");
            $("#img4").css("display", "none");
            $("#img5").css("display", "none");
            $("#img6").css("display", "none");
            $("#mark1").css("display", "block");
            $("#mark2").css("display", "none");
            $("#mark3").css("display", "none");
            $("#mark4").css("display", "none");
            $("#mark5").css("display", "none");
            $("#mark6").css("display", "none");
        }
    },
    // 숨은그림찾기 틀린 경우
    failPitcturePuzzle : function(){
        if($(".mark.sbox img").attr("style") != "display: inline;"){
            if($(".game_count .gg").length==0){
                $("#gameCount1").addClass("gg");
            }else if($(".game_count .gg").length==1){
                $("#gameCount2").addClass("gg");
            }else if($(".game_count .gg").length==2){
                $("#gameCount3").addClass("gg");
            }else if($(".game_count .gg").length==3){
                $("#gameCount4").addClass("gg");
            }else if($(".game_count .gg").length==4){
                $("#gameCount5").addClass("gg");
                monthEvent.detail.eventShowLayer1("evtFnGg");
            }else if($(".game_count .gg").length==5){
                monthEvent.detail.eventShowLayer1("evtFnGg");
            }
        }
    },
    // 숨은그림찾기 성공 한 경우
    successPitcturePuzzle : function(){ 
        monthEvent.detail.puzzleSuccessApply();
    },
    /* 숨은그림찾기 응모 */    
    puzzleSuccessApply : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : monthEvent.detail.markNum
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180831_3/puzzleSuccessApplyJson.do"
              , param
              , monthEvent.detail._callback_puzzleSuccessApplyJson
        );
    },
    _callback_puzzleSuccessApplyJson : function(json){
        if(json.ret == "0"){
            monthEvent.detail.eventShowLayer1("evtFnOj"+monthEvent.detail.markNum);
            //숨은그림 찾기 스탬프 확인
            monthEvent.detail.getSuccessListJson();
        }else{
            alert(json.message);
        }
    },
    //내가 찾은 숨은그림찾기 스탬프 노출
    getSuccessListJson : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180831_3/getSuccessListJson.do"
              , param
              , this._callback_getConrStampListJson
        );
    },
    _callback_getConrStampListJson : function(json){
        if(json.ret=="0"){
            var searchSuccessList = json.searchSuccessList;
            if(searchSuccessList != null && searchSuccessList !=""){                
                for(var i=0; i<searchSuccessList.length; i++){        //숨은그림찾기 성공 리스트만큼 돌면서 스탬프 이미지 노출
                    $(".stamp"+searchSuccessList[i]).addClass("on");
                }
            }
            $("#successCnt").html(json.searchSuccessCnt);
            $("#entryCnt").html(json.entryCnt);
            $("#possibleCnt").html(parseInt(json.searchSuccessCnt) - parseInt(json.entryCnt));
        }else{
            //alert(json.message);
        }
    },
    // 응모 step1. 응모하기 전 위수탁 확인 
    applyJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여해주세요.")){
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
            // 응모가능 여부 확인
            if(parseInt($("#successCnt").text()) <= 0){
                alert("숨은그림찾기 참여 고객만 응모 가능합니다.");
            }else{
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180831_3/setApplyJson.do" //  최초 1회 위수탁 팝업 호출  and 당일 응모 참여 했는지 조회 
                      , {
                              evtNo : $("input[id='evtNo']:hidden").val() 
                        }
                      , function(json){ 
                          $(':radio[name="argee1"]:checked').attr("checked", false);
                          $(':radio[name="argee2"]:checked').attr("checked", false);
                          
                            if(json.ret == "0"){   
                                if(  json.myTotalCnt  == "0"  ) {  //  한번도 응모를 하지 않은경우 
                                      $("div#Confirmlayer1").attr("onClick", "   monthEvent.detail.setEntry(' " + json.myTotalCnt + " '  ); ");
                                      monthEvent.detail.eventShowLayer1('eventLayerPolice');
                                      //$(".agreeCont").scrollTop(0);  // 상단이동 
                                  }else {
                                      monthEvent.detail.setEntry(json.myTotalCnt);
                                  }
                              }else{
                                  alert(json.message);
                              }
                          
                        }
                );           
            }
        }
    },
    /* 응모 step2. 응모하기 */
    setEntry : function(myTotalCnt){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여해주세요.")){
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
                    alert("'개인정보 수집동의'에 동의해주셔야 응모 가능합니다.");
//                    monthEvent.detail.eventCloseLayer();
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    alert("'개인정보 처리 위탁'에 동의해주셔야 응모 가능합니다.");
//                    monthEvent.detail.eventCloseLayer();
                    return;
                }
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }

            monthEvent.detail.eventCloseLayer2();
            
            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180831_3/setRotateJson.do"
                  , param
                  , monthEvent.detail._callback_setRotateJosn
            );
        }
    },
    //응모 step3. 응모결과 보여주기
    _callback_setRotateJosn : function(json){
        if(json.ret == "0"){
            var resultItem = json.fvrSeq;
            $(".mem_id").html(json.custId);
            if(resultItem == "7") { //
                $(".addM").html("1");
                mevent.detail.eventShowLayer('evtGcG');
            }else  if(resultItem == "8") { //
                mevent.detail.eventShowLayer('evtGcF');
            }else { // 다음기회에
                mevent.detail.eventShowLayer('evtGcF');
            }
            if(parseInt($("#possibleCnt").html()) > 0){
                $("#entryCnt").html(parseInt($("#entryCnt").html()) + 1);
                $("#possibleCnt").html(parseInt($("#possibleCnt").html()) - 1);
            }
        }else{
            if(json.ret == "013"){ // 이미응모한사람 
                //mevent.detail.eventShowLayer('evtFail2');
                alert(json.message);
            }else{
                alert(json.message);
            }
        }
    },
    /* 나의 당첨내역 */
    getMyWinList : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여해주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{     
            if(!mevent.detail.checkLogin()){
                return;
            }
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180806_1/getMyWinListJson.do"
                  , param
                  , monthEvent.detail._callback_getMyWinListJson
            );
        }
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
    // 레이어 숨김
    eventCloseLayer : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
    },
    // 레이어 숨김
    eventCloseLayer2 : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer").hide();  
    },
    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
        location.reload();//새로고침
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
};