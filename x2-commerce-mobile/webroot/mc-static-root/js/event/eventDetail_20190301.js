/**
 * 배포일자 : 2019.02.21
 * 오픈일자 : 2019.03.01
 * 이벤트명 : 사탕을 잡아라
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {

    // 캔디 잡은 횟수
    candyCount : 0, //캔디개수
    firstCnt : 0, //도전 횟수
    selectGoodsSeq : null, //누적사탕응모상품번호

    init : function() {
        mevent.detail.eventShowLayer('loadingBar');

        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);

        $('.gameStart').click(function(){
            monthEvent.detail.getDayFirstChk();
        });

        $(".eventHideLayer1").click(function(){
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();

            // loadingBar On
            mevent.detail.eventShowLayer('loadingBar');
            location.reload(true); //캐쉬삭제
            monthEvent.detail.eventCloseLayer();
        });

        $(".eventHideLayer2").click(function(){
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();

          //누적사탕에 따른 응모 가능 여부 체크
            monthEvent.detail.getGoodsApplyChk();
        });

        if(common.isLogin()){
            //누적사탕에 따른 응모 가능 여부 체크
            monthEvent.detail.getGoodsApplyChk();
        };

        // 남은시간 없애기
        $('.game_time').css("display","none");
    },

    // game function
    gameStart : function(){

        // 클릭 수 0 초기화
        monthEvent.detail.candyCount = 0;

        // 도전 횟수
        monthEvent.detail.firstCnt++;

        // 시작 버튼 숨기기
        $('.gameStart').hide();

        // 남은시간 보여주기
        $('.game_time').css("display","block");
        $('.game_time>p>#gameTimer').text(5);

        // 게임 시작
        monthEvent.detail.gameTable();
    },

    gameTable : function(){
        var _gameTable = $('.gameTable');
        var _item = _gameTable.find('li');
        var _ea = 0;
        var _itemCandy=new Object();
        var _int=0;
        var setTime = 5; //남은시간 5초
        var _tempArr = new Array(); //중복 숫자 체크

        // 라인 볼려고 처리한거
        _gameTable.addClass('on');

        // 지정한 시간동안 기다린 뒤 다시 실행한다.
        playTable = setInterval(function() {
            var _array1 = [];
            var _array2 = [];
            var _array3 = [];
            var _num1 = 3; // 사탕개수
            var _num2 = Math.floor(Math.random() * 9) + 1; // 9칸

            // 초기화
            _itemCandy='';

            $('.gameTable > ul').children().removeClass('on');
            $('.gameTable > ul').children().removeAttr('id');

            // 5초
            if(_ea<5){
                _ea++;

                // 1. array2 insert 1 to 9
                for(var i=1;i<10;i++){
                    _array2.push(i);
                }
//                console.log("####### START #######");
//                console.log("_array2 #org: "+_array2);

                // 2. tempArr 값 확인
//                console.log("_tempArr.length : "+_tempArr.length);

                // 3. tempArr 에 있는 값을 array2 에서 필터링함
                for(var k=0; k<_tempArr.length; k++){
                    _array2 = jQuery.grep(_array2, function(value) {
                        return value != _tempArr[k];
                    });
//                    console.log("array2 #grep: "+_array2);
                }

                // 4. 필터링 후 array2 sort 하기
                _array2.sort(function(){return Math.random()-0.5});
//                console.log("array2 #sort: "+_array2);

                // 5. array2 에서 앞에서 3개 가져오기
                _array3 = _array2.slice(0, _num1);
//                console.log("array3 #slice : "+_array3);

                // 6. tempArr 초기화
                _tempArr = new Array();

                // 7. tempArr 에 3개 숫자 넣기
                _tempArr = _array2.slice(0, _num1); // 이전 단계 사탕 번호 넣어줌
//                console.log("tempArr #chk: "+_tempArr);

                // 3개 사탕 자리 잡아줘야함
                for(j=0;j<_num1;j++){
                    var _aryc = _array3[j] - 1;
                    // 이미지 들어가야함.
                    _item.eq(_aryc).addClass('on');
                    _item.eq(_aryc).attr('id', 'getCandy');
                }

                _itemCandy = $('.gameTable li#getCandy');

                _itemCandy.on('click',function(){

                    if($(this).hasClass('on')){
                        monthEvent.detail.candyCount++;
                        console.log('CandiCount : '+monthEvent.detail.candyCount);
                    }else{
                        console.log("This click is not candy!!");
                    }
                    $(this).removeClass('on');
                });

                $('.game_time>p>#gameTimer').text(setTime);
                setTime--;

            }else{
                clearInterval(playTable);
                $('.gameTable > ul').children().removeAttr('id', 'getCandy');
                _gameTable.removeClass('on');
                console.log('End');
                $('.game_time').css("display","none");
                monthEvent.detail.getCandyResult();
            }
        }, 1000);
    },

    // 사탕 개수 및 결과 확인
    getCandyResult : function(){

        //1. 사탕개수 1개 이상인 경우
        if(monthEvent.detail.candyCount > 0){
            console.log("사탕 : "+monthEvent.detail.candyCount +" 획득!!");

            //CJ ONE 50 포인트 즉석당첨 기능
            monthEvent.detail.addMyStmp();

        }else{
            //2. 사탕개수 1개 미만인 경우
            console.log("사탕 : "+monthEvent.detail.candyCount +" 획득!! 사탕이 부족해요~ 다시 한 번 더!");
            mevent.detail.eventShowLayer('gameEnd_regame');

            //1. 사탕개수 초기화
            monthEvent.detail.candyCount=0;

            // 2. 시작 버튼 노출
            $('.gameStart').show();
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
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20190301/setConfirmJson.do"
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

        if(result == 0){

            // 시작버튼 제거
            //$('.gameStart').hide();

            // 사탕 잡기 시작
            monthEvent.detail.gameStart();

        }else{
            alert(json.message);
        }
    },

    /* 매일 사탕 잡기 응모 기능 (회원 출석 등록 기능을 사용하므로 function 이름 그대로 사용함) */
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
                        , candyCnt : monthEvent.detail.candyCount
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20190301/addMyStmpJson.do"
                      , param
                      , monthEvent.detail._callback_addMyStmpJson
                );
            }
        }
    },
    _callback_addMyStmpJson : function(json){

        var getCandyCount = json.getCandyCnt;

        if(json.ret == "0"){
            if(json.winYn=="Y"){
                $('.win_number').text(json.getCandyCnt);
                mevent.detail.eventShowLayer('gameEnd_win');
            }else{
                $('.win_number').text(json.getCandyCnt);
                mevent.detail.eventShowLayer('gameEnd_lose');
            }
        }else {
            alert(json.message);
        }
    },

    /* 당첨내역 확인 */
    getMyCandyList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        //혹시나 다른 fvrseq 가 들어올수있어서 not in 처리 안하고 날짜 fvrseq in 처리
//        var inFvrSeqArr = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

        //다른 fvrseq 입력되면 오류나므로 not in 처리 안하고 날짜 fvrseq in 처리 (수작업은 오류가 있으니 for문)
        var inFvrSeqArr = new Array;

        for(var i =1; i<=31; i++){
            inFvrSeqArr.push(i);
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , inFvrSeqArr : inFvrSeqArr.toString()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190301/getMyCandyApplyListJson.do"
              , param
              , monthEvent.detail._callback_getMyCandyListJson
        );
    },

    _callback_getMyCandyListJson : function(json){
        if(json.ret == "0"){
            var myApplyListHtml = "";
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

            mevent.detail.eventShowLayer('evtPopApplyDetail');
        }else{
            alert(json.message);
        }
    },

    /** Game function End **/


    // 기능 : 누적 상품  응모여부 체크 (사탕150개, 사탕300개, 사탕400개)
    getGoodsApplyChk : function() {

//        var inFvrSeqArr = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

        var inFvrSeqArr = new Array;

        for(var i =1; i<=31; i++){
            inFvrSeqArr.push(i);
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , inFvrSeqArr : inFvrSeqArr.toString()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190301/getGoodsApplyChk.do"
              , param
              , monthEvent.detail._callback_getApplyEventJson
        );
    },
    _callback_getApplyEventJson : function(json){
        if(json.ret == "0"){
            console.log("==>"+json.applyOne+"//==>"+json.applyTwo+"//==>"+json.applyThree);

            /* 신청되었으면 비활성화 */
            if(json.applyOne == 'Y'){
                $(".buttonBox>ul>.stamp1").addClass("on");
                $(".buttonBox>ul>.stamp1").attr("onClick", "javascript:monthEvent.detail.applyBtn('32')");
            }else if(json.applyOne == 'N'){
                $(".buttonBox>ul>.stamp1").addClass("end");
                $(".buttonBox>ul>.stamp1").removeClass("on");
                $(".buttonBox>ul>.stamp1").removeAttr("onClick");
            }else{
                $(".buttonBox>ul>.stamp1").removeClass("on end");
            }

            if(json.applyTwo == 'Y'){
                $(".buttonBox>ul>.stamp2").addClass("on");
                $(".buttonBox>ul>.stamp2").attr("onClick", "javascript:monthEvent.detail.applyBtn('33')");
            }else if(json.applyTwo == 'N'){
                $(".buttonBox>ul>.stamp2").addClass("end");
                $(".buttonBox>ul>.stamp2").removeClass("on");
                $(".buttonBox>ul>.stamp2").removeAttr("onClick");
            }else{
                $(".buttonBox>ul>.stamp2").removeClass("on end");
            }

            if(json.applyThree == 'Y'){
                $(".buttonBox>ul>.stamp3").addClass("on");
                $(".buttonBox>ul>.stamp3").attr("onClick", "javascript:monthEvent.detail.applyBtn('34')");
            }else if(json.applyThree == 'N'){
                $(".buttonBox>ul>.stamp3").addClass("end");
                $(".buttonBox>ul>.stamp3").removeClass("on");
                $(".buttonBox>ul>.stamp3").removeAttr("onClick");
            }else{
                $(".buttonBox>ul>.stamp3").removeClass("on end");
            }

        } else {
            alert(json.message);
        }
    },



    /** 누적사탕 응모 기능 Start **/

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
                  , _baseUrl + "event/20190301/getAppPushYnCntJson.do"
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
                var inFvrSeqArr = ["32","33","34"]; //누적사탕 FVRSEQ번호

                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : monthEvent.detail.selectGoodsSeq //선택상품
                        , inFvrSeqArr : inFvrSeqArr.toString()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20190301/getFirstChkJson.do"
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
                  , _baseUrl + "event/20190301/setApplyJson.do"
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
        if(!mevent.detail.checkLogin()){
            return;
        }

        var inFvrSeqArr = ["32","33","34"];
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
            if(json.myEvtWinList.length > 0){
                var myWinListHtml = "";

                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                     myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }

                if(myWinListHtml != ""){
                    $("tbody#myWinListHtml").html(myWinListHtml);
                }
            }
            mevent.detail.eventShowLayer('evtPopWinDetail');

        }else{
            alert(json.message);
        }
    },

    /** 누적사탕 응모 기능 End **/

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

// 스타트 버튼이 먼저 나오는 경우 방지 함
$(window).on('load', function(){
    monthEvent.detail.eventCloseLayer(); //loadingbar close
});
