/**
 * 배포일자 : 2018.12.13
 * 오픈일자 : 2018.12.17
 * 이벤트명 : 황금돼지 잡고 순금 돼지 받기
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {
    
    //var setting
        
    firstCnt : 0, //첫 응모 여부
        
    init : function() {
        
        // scroll class 변경
        var tabH = $(".scrollTab img").height();
        $("#eventTabFixed2").css("height", tabH + "px");

        var tabHeight = $("#eventTabImg").height() + 203;
        var eTab01 = tabHeight + $("#evtConT01").height() - 5;
        var eTab02 = eTab01 + $("#evtConT02").height() - 5;
        var eTab03 = eTab02 + $("#evtConT03").height() - 5;
        var eTab04 = eTab03 + $("#evtConT04").height();

        var scrollTab = $(document).scrollTop();

        if (scrollTab > tabHeight) {
            $("#eventTabFixed2").css("position", "fixed").css("top", "0px");
        }
        if (scrollTab < eTab01) {
            $("#eventTabFixed2").attr('class', 'tab03');
        }

        $(window).scroll(function() {
            var scrollTab = $(document).scrollTop();
            if (scrollTab < eTab01) {
                $("#eventTabFixed2").attr('class', 'tab03');
            }
            if (scrollTab > tabHeight) {
                $("#eventTabFixed2").css("position", "fixed").css("top", "0px");
            } else {
                $("#eventTabFixed2").css("position", "absolute").css("top", "");
            }
        });
        
        
        // 게임 시작 버튼
        $('.btn_start').on('click', function() {
            //게임 시작
            monthEvent.detail.appPushJson();
        });
        
        $(".eventHideLayerX").click(function(){
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();
        });
        
        $(".eventHideLayer1").click(function(){
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();
            location.reload(); //새로고침
        });
        
        //재도전 닫기 버튼 누른 경우
        $(".eventHideLayer4").click(function(){
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();
            
            $('#game_area').children('.item').remove(); //돼지 다 없어짐
            $('.start_area').show();
        });
    },
    

    // 레이어 숨김
    eventCloseLayer : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
        
    
    gameSetting : function(){
        
        monthEvent.detail.firstCnt++; //첫응모처리 count 1증가
        
        var _game_area = $('#game_area');
        var _item = '<span class="item"><img src="//qa.oliveyoung.co.kr/uploads/contents/201812/17endgame/pig.gif" /></span>';
        var int = 7;
        for (var i = 0; i <= int; i++) {
            _game_area.append(_item);
         }
        
        monthEvent.detail.gameMove();
    },
    
    gameMove : function() {
        var _item = $('#game_area').find('.item');

        _item.each(function(i) {
            var i = i + 1;
            var _class = 'start' + i;
            $(this).addClass(_class);
            i++;
        });
        
        //PIG CATCH!!
        _item.on("click", function() {
            
            $(this).parents('.game_area').addClass('end');
            _item.remove(); // 돼지 없애기
            
            //응모기능 가즈아
            monthEvent.detail.confirmJson();
            
        });
        
        setTimeout(function() {
            var _game_area = $('#game_area');
            if (_game_area.hasClass('end') == false) {
                
//                if(monthEvent.detail.firstCnt > 1){
                    mevent.detail.eventShowLayer('winCheck4'); //클립없으면 무한 응모 (김혜진 2018.12.11)
//                }
//                else{
//                    //두번째참여
//                    monthEvent.detail.confirmJson(); //응모기능 태워야지
//                }
            }
        }, 9000); //게임시간
    },
    
    
    /**
     * 1. APP PUSH AGREE CHKECK
     */
    appPushJson : function(){
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
                  , _baseUrl + "event/20181217_2/getAppPushYnCntJson.do"
                  , param
                  , monthEvent.detail._callback_getAppPushYnCntJson
            );
        }
    },
    _callback_getAppPushYnCntJson : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
            return;
            
        }else{
            // 참여 여부 한번 더 확인 해야함.
            monthEvent.detail.getFirstChk();
        }
    },
    
    
    /**
     * 기능 : 2 오늘 참여여부 확인
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
                var fvrSeqTemp = "1"; //황금돼지 시퀀스1
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        ,  fvrSeq : fvrSeqTemp.toString()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20181217_2/setConfirmJson.do"
                      , param
                      , monthEvent.detail._callback_getFirstChkJson
                );
            }
        }
    },
    _callback_getFirstChkJson : function(json){
        
        //variable 
        var result = json.ret; // 응답 성공유무
        var totalCount = parseInt(json.myTotalCnt); // 위수탁 - 이벤트참여여부 확인 

        if(result == 0){

            //재도전인지 체크
            if(monthEvent.detail.firstCnt >0){
                
                //위수탁 동의했던 사람으로 체크 패쓰.
                $(':radio[name="argee1"]:input[value="Y"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="Y"]').attr("checked", true);
                
                //참여가능
                $('.start_area').hide();
//            
                // 돼지 잡기 시작
                monthEvent.detail.gameSetting();
                
            }else{
                
                if(totalCount > 0){
                    //위수탁 동의했던 사람으로 체크
                    $(':radio[name="argee1"]:input[value="Y"]').attr("checked", true);
                    $(':radio[name="argee2"]:input[value="Y"]').attr("checked", true);
                    
                    //참여가능
                    $('.start_area').hide();
//                
                    // 돼지 잡기 시작
                    monthEvent.detail.gameSetting();
                    
                }else{
                    //위수탁처리
                    $("div#Confirmlayer").attr("onClick", "javascript:monthEvent.detail.popLayerConfirm()");
                    mevent.detail.eventShowLayer('eventLayerPolice'); //위수탁 팝업 호출
                }
            }
            
        }else{
            alert(json.message);
            
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
                
                $('.start_area').hide(); // START 버튼 숨기기!
                // 돼지 잡기 시작
                monthEvent.detail.gameSetting();
            }
        }
    },
    
    
    /** 3. 응모 step2. 응모하기 */
    confirmJson : function(){
        
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
            
            var fvrSeqTemp1 = "1";
            
            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                      , fvrSeq : fvrSeqTemp1.toString()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181217_2/setApplyJson.do"
                  , param
                  , monthEvent.detail._callback_setApplyJson
            );
        }
    },
    /** 응모 step3. 응모결과 보여주기 */
    _callback_setApplyJson : function(json){
        
            if(json.ret == "0"){
                if(json.winYn=="Y"){
                    
                    $(".win_number").text(json.tgtrSeq);
                    mevent.detail.eventShowLayer('winCheck1'); //골드돼지
                    
                }else{ //꽝
                    mevent.detail.eventShowLayer('winCheck3'); //아쉽지만 : 꽝
                }
            }else{
                if(json.ret == "013"){ // 이미응모한사람 
                    alert(json.message);
                    location.reload();//새로고침
                }else{
                    alert(json.message);
                    location.reload();//새로고침
                }
            }
    },
    
    
    /** 나의 당첨내역 */
    getMyWinList : function(){
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
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181217_2/getMyWinListJson.do"
                  , param
                  , monthEvent.detail._callback_getMyWinListJson
            );
        }
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
    },
    
    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        location.reload();//새로고침
    },
    
}