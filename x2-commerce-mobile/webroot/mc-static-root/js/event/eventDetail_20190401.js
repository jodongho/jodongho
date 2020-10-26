/**
 * 배포일자 : 2019.03.28
 * 오픈일자 : 2019.04.01
 * 이벤트명 : 생일 케이크
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {

    // 획득 조각 개수
    cakeCount : 0, //조각개수
    cakeTouch : 0,
    firstCnt : 0, //도전 횟수
    selectGoodsSeq : null, //누적조각응모상품번호
    cakeHistYn : false, //내 케이크 확인여부
    setTime : 5, //남은시간 5초
    
    init : function() {

        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);
        
        $('.gameStart').click(function(){
            monthEvent.detail.getDayFirstChk();
        });

        $(".eventHideLayer1").click(function(){
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();

            // loadingBar On
            location.reload(true); //캐쉬삭제
        });

        $(".eventHideLayer2").click(function(){
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();

          //누적조각에 따른 응모 가능 여부 체크
            monthEvent.detail.getGoodsApplyChk();
        });
        
        $(".buttonBox>ul [class^=gift]").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else if(!mevent.detail.checkLogin()){
                return;
            }else if(!monthEvent.detail.cakeHistYn){
                alert('케이크 수를 확인해주세요.');
            }
        });

        $('.gameTable').on('touchend',function(){
            
            //두번 클릭시 조각 획득 처리.
            monthEvent.detail.cakeTouch++;
            
            //console.log(monthEvent.detail.setTime+ ', touch:'+monthEvent.detail.cakeTouch+', cakeCount:'+monthEvent.detail.cakeCount +', rest:'+monthEvent.detail.cakeCount % 2);
            if(monthEvent.detail.cakeTouch % 2 == 0 && monthEvent.detail.cakeCount < 10){
               monthEvent.detail.cakeCount++;
               console.log(monthEvent.detail.setTime+ ', rest:'+(monthEvent.detail.cakeTouch % 2)+ ',cakeTouch:'+monthEvent.detail.cakeTouch+', getCakeCount : '+monthEvent.detail.cakeCount);
               //조각 제거
               $(this).find('li:visible:last').hide()
            }
        });
        
        // 남은시간 없애기
        $('.game_time').css("display", "none");

    },

    // game function
    gameStart : function(){

        // 클릭 수 0 초기화
        monthEvent.detail.cakeTouch = 0;
        
        // 획득 조각 수 0 초기화
        monthEvent.detail.cakeCount = 0;
        
        //남은시간 5초 초기화
        monthEvent.detail.setTime = 5;

        // 도전 횟수
        monthEvent.detail.firstCnt++;

        var _gamearea = $('.game_area');
        var _gameReady = _gamearea.find('.gameReady');
        var _gameStart = _gamearea.find('.gameStart');
        var _imgCount = '//qa.oliveyoung.co.kr/uploads/contents/201904/01cake/ready.gif';
        
        _gameStart.hide();  
        _gameReady.css({
            'background-image': 'url("' + _imgCount + '?x=' + Date.now() + '")',
            'background-size':100+'%' 
        });
        setTimeout(function(){
            // 시작 버튼 숨기기
            $('.gameReady').hide();

            // 게임 시작
            monthEvent.detail.gameTable(); 
        }, 3600);
        
    },

    gameTable : function(){
        var _gameTable = $('.gameTable');
        
        // 라인 볼려고 처리한거
        _gameTable.addClass('on');

        // 남은시간 보여주기
        $('.game_time').css("display","block");
        $('.game_time>p>#gameTimer').text(monthEvent.detail.setTime);
        
            
        // 지정한 시간동안 기다린 뒤 다시 실행한다.
        playTable = setInterval(function() {

            // 5초
            if(monthEvent.detail.setTime > 0 && monthEvent.detail.cakeCount < 10){
                monthEvent.detail.setTime--;
                $('.game_time>p>#gameTimer').text(monthEvent.detail.setTime);

            }else{
                clearInterval(playTable);
                $('.game_time').css("display","none");
                monthEvent.detail.getCakeResult();
            }
        }, 900);
    },

    // 조각 개수 및 결과 확인
    getCakeResult : function(){

        //1. 조각개수 1개 이상인 경우
        if(monthEvent.detail.cakeCount > 0){
            console.log("조각 : "+monthEvent.detail.cakeCount +" 획득!!");

            //CJ ONE 100 포인트 즉석당첨 기능
            monthEvent.detail.addMyStmp();

        }else{
            //2. 조각개수 1개 미만인 경우
            console.log("조각 : "+monthEvent.detail.cakeCount +" 획득!! 조각이 부족해요~ 다시 한 번 더!");
            mevent.detail.eventShowLayer('gameEnd_regame');

            // 클릭 수 0 초기화
            monthEvent.detail.cakeTouch = 0;
            
            //1. 조각개수 초기화
            monthEvent.detail.cakeCount=0;

            // 2. 시작 버튼 노출
            $('.gameTable').removeClass('on');
            $('.gameReady').css({
                'background-image': '',
                'background-size': '' 
            });
            $('.gameStart, .gameReady').show();
            
        }

    },

    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },

    /** Game function Start **/

    /* 기능 : 1. 오늘 참여 여부 확인  */
    getDayFirstChk : function(){
        console.log('getDayFirstChk');
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
                mevent.detail.eventShowLayer('loadingBar');
                $('.gameStart').hide();
                
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20190401/setConfirmJson.do"
                      , param
                      , monthEvent.detail._callback_getDayFirstChk
                );
            }
        }
    },
    _callback_getDayFirstChk : function(json){
        console.log('_callback_getDayFirstChk');

        //variable
        var result = json.ret; // 응답 성공유무
        monthEvent.detail.eventCloseLayer();
        

        //내 누적 케이크 초기화.
        $('#getCnt').text('0');
        $('.btn_myWin').removeClass('on');
        //내 케이크 확인 여부 초기화.
        monthEvent.detail.cakeHistYn = false;
        $(".buttonBox>ul>[class^=gift]").removeClass("on end").removeAttr('onclick');
        
        if(result == 0){
            
            // 시작버튼 제거
            $('.gameStart').hide();

            // 조각 잡기 시작
            monthEvent.detail.gameStart();

        }else{
            $('.gameStart').show();
            alert(json.message);
        }
    },

    /* 매일 조각 잡기 응모 기능 (회원 출석 등록 기능을 사용하므로 function 이름 그대로 사용함) */
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
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
                        , cakeCnt : monthEvent.detail.cakeCount
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20190401/addMyStmpJson.do"
                      , param
                      , monthEvent.detail._callback_addMyStmpJson
                );
            }
        }
    },
    _callback_addMyStmpJson : function(json){

        var getCakeCount = json.getCakeCnt;

        if(json.ret == "0"){
            
            //다른 팝업은 닫기
            monthEvent.detail.eventCloseLayer();
            
            if(json.winYn=="Y"){
                $('.win_number').text(json.getCakeCnt);
                mevent.detail.eventShowLayer('gameEnd_win');
            }else{
                $('.win_number').text(json.getCakeCnt);
                mevent.detail.eventShowLayer('gameEnd_lose');
            }
        }else {
            alert(json.message);
            
            location.reload(true); //캐쉬삭제
        }
    },

    /* 당첨내역 확인 */
    getMyCakeList : function(type){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                return;
            }else{
                return;
            }
        }else if(!mevent.detail.checkLogin()){
            return;
        }
        
        //클릭 버튼.
        $('[name=mylistType]').val(type);
        
        //혹시나 다른 fvrseq 가 들어올수있어서 not in 처리 안하고 날짜 fvrseq in 처리
//        var inFvrSeqArr = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

        //다른 fvrseq 입력되면 오류나므로 not in 처리 안하고 날짜 fvrseq in 처리 (수작업은 오류가 있으니 for문)
        var inFvrSeqArr = new Array;

        for(var i =1; i<=30; i++){
            inFvrSeqArr.push(i);
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , inFvrSeqArr : inFvrSeqArr.toString()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190401/getMyCakeApplyListJson.do"
              , param
              , monthEvent.detail._callback_getMyCakeListJson
        );
    },

    _callback_getMyCakeListJson : function(json){
        if(json.ret == "0"){
            var myApplyListHtml = "";
            var type = $('[name=mylistType]').val();
            if(type == 'cnt'){
                if(json.totalNoteCont > 0){
                    //내 케이크 확인 여부.
                    monthEvent.detail.cakeHistYn = true;
                    
                    //내 케이크 확인
                    $('#getCnt').text(json.totalNoteCont);
                    $('.btn_myWin').addClass('on');
                    
                    //누적조각에 따른 응모 가능 여부 체크
                    monthEvent.detail.getGoodsApplyChk();
                }else{
                    myApplyListHtml = "<tr><td colspan='3' class='no'>참여이력이<br/> 없습니다.</td></tr>";
                    $("tbody#myApplyListHtml").html(myApplyListHtml);

                    mevent.detail.eventShowLayer('myCake');
                    
                }
            }else if(type == 'lst'){
                //일자별 케이크 확인
                if(json.myEvtApplyList.length <= 0){
                    myApplyListHtml = "<tr><td colspan='3' class='no'>참여이력이<br/> 없습니다.</td></tr>";
                }else{
                    for(var i=0 ; i<json.myEvtApplyList.length ; i++){
                        myApplyListHtml += "<tr><td>" + json.myEvtApplyList[i].strSbscSgtDtime + "</td><td>" + json.myEvtApplyList[i].noteCont + "개</td><td>" + json.myEvtApplyList[i].payPnt + "P</td></tr>";
                    }
                    //합계 처리
                    myApplyListHtml += "<tr><td>합계</td><td colspan='2'>" + json.totalNoteCont+"개</td></tr>";
                    
                    
                }
                $("tbody#myApplyListHtml").html(myApplyListHtml);

                mevent.detail.eventShowLayer('myCake');
                
            }
        }else{
            alert(json.message);
        }
    },

    /** Game function End **/


    // 기능 : 누적 상품  응모여부 체크 (조각100개, 200개, 250개)
    getGoodsApplyChk : function() {

//        var inFvrSeqArr = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

        var inFvrSeqArr = new Array;

        for(var i =1; i<=30; i++){
            inFvrSeqArr.push(i);
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , inFvrSeqArr : inFvrSeqArr.toString()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190401/getGoodsApplyChk.do"
              , param
              , monthEvent.detail._callback_getApplyEventJson
        );
    },
    _callback_getApplyEventJson : function(json){
        if(json.ret == "0"){
            console.log("==>"+json.applyOne+"//==>"+json.applyTwo+"//==>"+json.applyThree);

            /* 신청되었으면 비활성화 */
            if(json.applyOne == 'Y'){
                $(".buttonBox>ul>.gift1").addClass("on");
                $(".buttonBox>ul>.gift1").attr("onClick", "javascript:monthEvent.detail.applyBtn('31')");
            }else if(json.applyOne == 'N'){
                $(".buttonBox>ul>.gift1").addClass("end");
                $(".buttonBox>ul>.gift1").removeClass("on");
                $(".buttonBox>ul>.gift1").removeAttr("onClick");
            }else{
                $(".buttonBox>ul>.gift1").removeClass("on end");
            }

            if(json.applyTwo == 'Y'){
                $(".buttonBox>ul>.gift2").addClass("on");
                $(".buttonBox>ul>.gift2").attr("onClick", "javascript:monthEvent.detail.applyBtn('32')");
            }else if(json.applyTwo == 'N'){
                $(".buttonBox>ul>.gift2").addClass("end");
                $(".buttonBox>ul>.gift2").removeClass("on");
                $(".buttonBox>ul>.gift2").removeAttr("onClick");
            }else{
                $(".buttonBox>ul>.gift2").removeClass("on end");
            }

            if(json.applyThree == 'Y'){
                $(".buttonBox>ul>.gift3").addClass("on");
                $(".buttonBox>ul>.gift3").attr("onClick", "javascript:monthEvent.detail.applyBtn('33')");
            }else if(json.applyThree == 'N'){
                $(".buttonBox>ul>.gift3").addClass("end");
                $(".buttonBox>ul>.gift3").removeClass("on");
                $(".buttonBox>ul>.gift3").removeAttr("onClick");
            }else{
                $(".buttonBox>ul>.gift3").removeClass("on end");
            }

        } else {
            alert(json.message);
        }
    },



    /** 누적조각 응모 기능 Start **/

    /**
     * 1. 응모하기 버튼 누르는 경우
     */
    applyBtn : function(fvrSeq){

        //1. 선택한 상품 정보 없는 경우
        if(null == fvrSeq || "" == fvrSeq){
            alert("응모 상품 번호가 없습니다.");
            return;
        }
        //1. 선택한 상품 저장
        monthEvent.detail.selectGoodsSeq = fvrSeq;

        //2. 앱 푸시 체크로 넘어감
        monthEvent.detail.appPushJsonApplyChk();
    },


    /**
     * 2. APP PUSH AGREE CHKECK (응모하기 누른 경우)
     */
    appPushJsonApplyChk : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
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

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190401/getAppPushYnCntJson.do"
                  , param
                  , monthEvent.detail._callback_getAppPushYnCntJson
            );
        }
    },
    _callback_getAppPushYnCntJson : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
        }else{
            //참여여부 확인 / 이미 참여여부 확인
            monthEvent.detail.getFirstChk();
        }
    },


    /**
     * 3. 참여여부 확인 이미 응모했는지 확인
     */
    getFirstChk : function(){
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
                var inFvrSeqArr = ["31","32","33"]; //누적조각 FVRSEQ번호

                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : monthEvent.detail.selectGoodsSeq //선택상품
                        , inFvrSeqArr : inFvrSeqArr.toString()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20190401/getFirstChkJson.do"
                      , param
                      , monthEvent.detail._callback_getFirstChkJson
                );
            }
        }
    },
    _callback_getFirstChkJson : function(json){

        var result = json.ret; // 응답 성공유무
        var totalCount = json.myTotalCnt; // 위수탁 - 이벤트참여여부 확인

        if(result == 0){
            if(totalCount > 0){
                //한번이라도 해당 이벤트에 응모를 했던 (위수탁 동의했던) 사람으로 체크
                $(':radio[name="argee1"]:input[value="Y"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="Y"]').attr("checked", true);

                //바로 기능으로 넘어감.
                monthEvent.detail.instantWin(); // 원하는 기능으로 입력해야함 : 즉석당첨

            }else{
                //위수탁처리
                $("div#Confirmlayer").attr("onClick", "javascript:monthEvent.detail.popLayerConfirm()");
                mevent.detail.eventShowLayer('eventLayerPolice'); //위수탁 팝업 호출
            }

        }else{
            alert(json.message);
        }
    },


    /**
     * 4. 위수탁 동의 처리
     */
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
                monthEvent.detail.instantWin(); // 원하는 기능으로 입력해야함 : 매일 즉석당첨
            }
        }
    },






    /**
     * 1. 즉석응모 기능
     */
    instantWin : function(){

        // 위수탁 여부 체크
        var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
        var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
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

            // loadingBar On
            mevent.detail.eventShowLayer('loadingBar');

            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                      , fvrSeq : monthEvent.detail.selectGoodsSeq //응모상품FvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190401/setApplyJson.do"
                  , param
                  , monthEvent.detail._callback_setApplyJson
            );
        }
    },
    /** 즉석응모 결과 보여주기 */
    _callback_setApplyJson : function(json){

        // loadingBar Off
        monthEvent.detail.eventCloseLayer('loadingBar');

        if(json.ret == "0"){
            if(json.winYn=="Y"){
                $('.win_tgtr').text(json.tgtrSeq);
                mevent.detail.eventShowLayer('evtGift'+monthEvent.detail.selectGoodsSeq);
            }else{
                mevent.detail.eventShowLayer('evtGift1');//아쉽지만 : 꽝
            }
        }else{
            if(json.ret == "013"){ // 이미응모한사람
                alert(json.message);
            }else{
                alert(json.message);
            }
        }
    },



    /** 나의 당첨내역 */
    getMyWinList : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                return;
            }else{
                return;
            }
        }else if(!mevent.detail.checkLogin()){
            return;
        }

        var inFvrSeqArr = ["31","32","33"];
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , inFvrSeqArr : inFvrSeqArr.toString()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getStmpMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );

    },
    _callback_getMyWinListJson : function(json){
        if(json.ret == "0"){
            //당첨 내역 확인
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>참여이력이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                     myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }

            }
            $("tbody#myWinListHtml").html(myWinListHtml);
            
            mevent.detail.eventShowLayer('winCheck');

        }else{
            alert(json.message);
        }
    },

    /** 누적조각 응모 기능 End **/

    /* 앱 푸시 설정 바로가기 */
    goSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 설정 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    },
};
