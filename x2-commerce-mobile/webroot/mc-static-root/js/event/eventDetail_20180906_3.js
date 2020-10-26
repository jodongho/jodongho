$.namespace("monthEvent.detail");
monthEvent.detail = { 

    totalAmt : "0",
    firstYn : "",
    firstChk : "",
    seqChk : "",
    clickChk : "",
    itemChkYn : "N",
    returnVal : "",
    todayChk : "N",
    mbrInfoUseAgrYnChk : "N",
    mbrInfoThprSupAgrYnChk : "N",
    sigleTgtrSeq : null,
    currentDay : null,
    changeDate1 : "201809140000",
    changeDate2 : "201809192359",
    changeDate3 : "201809200000",
    
    init : function(){
        
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        
        /* 닫기  */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();
        });

        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            alert("개인정보 위수탁 약관 동의 후 응모 가능합니다.");
            monthEvent.detail.eventCloseLayer1();
        });
        
        //랜덤 숫자 가져오는 함수
        var fnRandomNum = function(max){            //랜덤 숫자 가져오는 함수(0~max사이의 값)
            return Math.floor(Math.random() * max);
        }

        var eventFull_len = $('.swiper-wrapper').children('li').length;       //FULL 배너 slide 갯수
        var eventFull_init_no = fnRandomNum(eventFull_len);                  //FULL 배너 slide  초기번호 

        //이벤트 FULL 배너 slide
        var eventSlide_set = {
            slidesPerView: 1,
            initialSlide : 0,
            /*autoplay: 4000,*/
            autoplay: false,
            pagination: '.paging',
            autoplayDisableOnInteraction: true,
            paginationClickable: true,
            freeMode: false,
            spaceBetween: 0,
            loop: true,
            nextButton: '.next',
            prevButton: '.prev'
        }, visual_swiper = Swiper('.slideType1', eventSlide_set );
        
        /* 가을 히든 아이템 찾기 : 총응모가능수, 응모한 횟수, 일일응모횟수 조회 */
        if(common.isLogin()){
            monthEvent.detail.myItemChkCntJson();
        };
        
        // 탭 클릭 시 내 단계 확인
        $(".step1").click(function(){
            monthEvent.detail.clickChk = "1";
            monthEvent.detail.getStepChk();
        });
        $(".step2").click(function(){
            monthEvent.detail.clickChk = "2";
            monthEvent.detail.getStepChk();
        });
        $(".step3").click(function(){
            monthEvent.detail.clickChk = "3";
            monthEvent.detail.getStepChk();
        });
        $(".step4").click(function(){
            monthEvent.detail.clickChk = "4";
            monthEvent.detail.getStepChk();
        });
        $(".step5").click(function(){
            monthEvent.detail.clickChk = "5";
            monthEvent.detail.getStepChk();
        });
        
        // 1번탭 상품 클릭
        $("#tem11").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("1");
        });
        $("#tem12").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("1");
        });
        $("#tem13").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("1");
        });
        $("#tem14").click(function(){
            monthEvent.detail.hiddenItemApplyJson("1"); // 정답 응모
        });
        $("#tem15").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("1");
        });
        
        // 2번탭 상품 클릭
        $("#tem21").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("2");
        });
        $("#tem22").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("2");
        });
        $("#tem23").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("2");
        });
        $("#tem24").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("2");
        });
        $("#tem25").click(function(){
            monthEvent.detail.hiddenItemApplyJson("2"); // 정답 응모
        });
        
        // 3번탭 상품 클릭
        $("#tem31").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("3");
        });
        $("#tem32").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("3");
        });
        $("#tem33").click(function(){
            monthEvent.detail.hiddenItemApplyJson("3"); // 정답 응모
        });
        $("#tem34").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("3");
        });
        $("#tem35").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("3");
        });
        
        // 4번탭 상품 클릭
        $("#tem41").click(function(){
            monthEvent.detail.hiddenItemApplyJson("4"); // 정답 응모
        });
        $("#tem42").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("4");
        });
        $("#tem43").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("4");
        });
        $("#tem44").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("4");
        });
        $("#tem45").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("4");
        });
        
        // 5번탭 상품 클릭
        $("#tem51").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("5");
        });
        $("#tem52").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("5");
        });
        $("#tem53").click(function(){
            monthEvent.detail.hiddenItemApplyJson("5"); // 정답 응모
        });
        $("#tem54").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("5");
        });
        $("#tem55").click(function(){
            monthEvent.detail.itemChkYn = "Y";
            monthEvent.detail.getStepChk("5");
        });
        
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate2)  ) {
            $("#useBtnDiv01").css("display", "block");
            $("#useBtnDiv02").css("display", "none");
            $("#useBtnDiv03").css("display", "none");
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3) ) { 
            $("#useBtnDiv01").css("display", "none");
            $("#useBtnDiv02").css("display", "block");
            $("#useBtnDiv03").css("display", "block");
        }
        
        monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);
        
        if(eval(monthEvent.detail.strDtime) == eval(monthEvent.detail.currentDay)){
            monthEvent.detail.todayChk = "Y";
            monthEvent.detail.firstChk = monthEvent.detail.firstChk - 1;
        }
        
    },
    
    /* HOT경품뽑기 : 총응모가능수, 응모한 횟수, 일일응모횟수 */
    myItemChkCntJson : function(){
        if(common.isLogin()){
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180906_3/myItemChkCntJson.do"
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                    }
                  , monthEvent.detail._callback_myHotCntChkJson
            );
        }else{
            //나의 총 응모권 수
            $("#totHotCnt").text("0");
            
            //남은 응모 횟수
            $("#possibleHotCnt").text("0");
            
            //사용한 횟수
            $("#entryHotCnt").text("0");
        }
    },
    _callback_myHotCntChkJson : function(json){
        if(json.ret == "0"){
            //나의 총 응모권
            monthEvent.detail.totalHotCnt = json.totHotCnt;
            if(json.totHotCnt.numberFormat() > 5){
                monthEvent.detail.totalHotCnt = 5;
            }
            $("#totHotCnt").text(monthEvent.detail.totalHotCnt);
            
            //응모한 횟수
            monthEvent.detail.entryHotCnt = json.entryHotCnt;
            if(json.entryHotCnt.numberFormat() > 5){
                monthEvent.detail.entryHotCnt = 5;
            }
            $("#entryHotCnt").text(json.entryHotCnt);
            
            //응모 가능 횟수
            var possibleHotCnt = monthEvent.detail.totalHotCnt.numberFormat() - monthEvent.detail.entryHotCnt.numberFormat();
            
            if(possibleHotCnt < '0'){
                possibleHotCnt = '0';
            }
            
            monthEvent.detail.possibleHotCnt = possibleHotCnt.toString();
            $("#possibleHotCnt").text(monthEvent.detail.possibleHotCnt);
            
        }else{
            alert(json.message);
        }
    },
    
    /* 단계확인 */
    getStepChk : function(seqChk){
        if(seqChk == undefined){ // 탭클릭 : 모바일 및 로그인 체크 안함
            var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , intx : seqChk
            };
            
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20180906_3/getStepChk.do"
                  , param
                  , this._callback_getStepChkJson
            );
        }else{ // 상품클릭
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
                    , intx : seqChk
                };
                
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180906_3/getStepChk.do"
                      , param
                      , this._callback_getStepChkJson
                );
            }
        }
    },
    _callback_getStepChkJson : function(json) {
        
        if(monthEvent.detail.itemChkYn == "Y"){
            if(json.ret < 0){
                monthEvent.detail.itemChkYn = "N";
                alert(json.message);
            }else{
                monthEvent.detail.itemChkYn = "N";
                alert("틀렸습니다. 다시 한번 선택해 주세요!");
            }
        }
        
        if(json.ret == "0"){ // 1번 탭
                $(".step1").addClass("on");
                $(".step2").addClass("");
                $(".step3").addClass("");
                $(".step4").addClass("");
                $(".step5").addClass("");
        }else if(json.ret == "1"){ // 2번 탭
                $(".step1").addClass("");
                $(".step2").addClass("on");
                $(".step3").addClass("");
                $(".step4").addClass("");
                $(".step5").addClass("");
        }else if(json.ret == "2"){ // 3번 탭 클릭
                $(".step1").addClass("");
                $(".step2").addClass("");
                $(".step3").addClass("on");
                $(".step4").addClass("");
                $(".step5").addClass("");
        }else if(json.ret == "3"){ // 4번 탭 클릭
                $(".step1").addClass("");
                $(".step2").addClass("");
                $(".step3").addClass("");
                $(".step4").addClass("on");
                $(".step5").addClass("");
        }else if(json.ret == "4"){ // 5번 탭 클릭
                $(".step1").addClass("");
                $(".step2").addClass("");
                $(".step3").addClass("");
                $(".step4").addClass("");
                $(".step5").addClass("on");
        }
        
/*        if(monthEvent.detail.clickChk == "1"){ // 1번 탭 클릭
            if(json.ret == "0"){
                $(".step1").addClass("on");
                $(".step2").addClass("");
                $(".step3").addClass("");
                $(".step4").addClass("");
                $(".step5").addClass("");
            }
        }else if(monthEvent.detail.clickChk == "2"){ // 2번 탭 클릭
            if(json.ret == "0"){
                alert("현재단계 참여 후 응모 가능합니다.");
                $(".step1").addClass("on");
            }else{
                $(".step1").addClass("");
                $(".step2").addClass("on");
                $(".step3").addClass("");
                $(".step4").addClass("");
                $(".step5").addClass("");
            }
        }else if(monthEvent.detail.clickChk == "3"){ // 3번 탭 클릭
            if(json.ret == "0" || json.ret == "1"){
                alert("현재단계 참여 후 응모 가능합니다.");
                $(".step2").addClass("on");
            }else{
                $(".step1").addClass("");
                $(".step2").addClass("");
                $(".step3").addClass("on");
                $(".step4").addClass("");
                $(".step5").addClass("");
            }
        }else if(monthEvent.detail.clickChk == "4"){ // 4번 탭 클릭
            if(json.ret == "0" || json.ret == "1"  || json.ret == "2"){
                alert("현재단계 참여 후 응모 가능합니다.");
                $(".step3").addClass("on");
            }else{
                $(".step1").addClass("");
                $(".step2").addClass("");
                $(".step3").addClass("");
                $(".step4").addClass("on");
                $(".step5").addClass("");
            }
        }else if(monthEvent.detail.clickChk == "5"){ // 5번 탭 클릭
            if(json.ret == "0" || json.ret == "1"  || json.ret == "2"  || json.ret == "3"){
                alert("현재단계 참여 후 응모 가능합니다.");
            }else{
                $(".step1").addClass("");
                $(".step2").addClass("");
                $(".step3").addClass("");
                $(".step4").addClass("");
                $(".step5").addClass("on");
            }
        }*/
    },
    
    /* 경품 응모 */    
    hiddenItemApplyJson : function(seqChk){
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
            
            var fvrSeq = $("[name='tem2']:checked").val();
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , intx : seqChk
//                  , fvrSeq : fvrSeq
            };
            
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180906_3/hiddenItemApplyJson.do"
                  , param
                  , monthEvent.detail._callback_hiddenItemApplyJson
            );
        }
    },
    _callback_hiddenItemApplyJson : function(json){
        if(json.ret == "0"){
            alert("정답입니다. 응모 가능 횟수를 확인해주세요!");
//            monthEvent.detail.getStepChk();
            monthEvent.detail.todayChk = "Y";
            monthEvent.detail.myItemChkCntJson();
        }else{
            monthEvent.detail.todayChk = "Y";
            alert(json.message);
        }
    },
    
    // 응모하기 : 위수탁 확인 
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
            if(parseInt($("#possibleHotCnt").text()) < 1){
                alert("응모 가능 기회가 없습니다.");
            }else{
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180906_3/setApplyJson.do" //  최초 1회 위수탁 팝업 호출  and 당일 룰렛 참여 했는지 조회 
                      , {
                              evtNo : $("input[id='evtNo']:hidden").val() 
                        }
                      , function(json){ 
                          $(':radio[name="argee1"]:checked').attr("checked", false);
                          $(':radio[name="argee2"]:checked').attr("checked", false);
                          
                            if(json.ret == "0"){   
                                if( json.myTotalCnt  == "0" ) {  //  한번도 룰렛을 돌리지 않은경우 
                                      $("div#Confirmlayer1").attr("onClick", "   monthEvent.detail.setRotate(' " + json.myTotalCnt + " '  ); "         );
                                      monthEvent.detail.eventShowLayer1('eventLayerPolice');
                                      $(".agreeCont").scrollTop(0);  // 상단이동 
                                  }else {
                                      monthEvent.detail.setRotate(json.myTotalCnt);
                                  }
                              }else{
                                  alert(json.message);
                              }
                          
                        }
                );           
            }
        }
    },
    
    /* 응모하기 */
    setRotate : function(myTotalCnt){
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
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    alert("'개인정보 처리 위탁'에 동의해주셔야 응모 가능합니다.");
                    return;
                }
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }
            

            monthEvent.detail.eventCloseLayer();
            
            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180906_3/setRotateJson.do"
                  , param
                  , monthEvent.detail._callback_setRotateJosn
            );
        }
    },
    _callback_setRotateJosn : function(json){
        var resultItem = "12";
//        mevent.detail.eventShowLayer('빈칸 이미지'); 또는 추첨중 이미지
        
        if(json.ret == "0"){
            resultItem = json.fvrSeq;
            
            if(resultItem == "6") { // 
                $(".mem_id").html("당첨자번호 : " + json.tgtrSeq);
                mevent.detail.eventShowLayer('evtGift1_cnWsS0XMrl0');
            }else if(resultItem == "7") { //
                $(".mem_id").html("당첨자번호 : " + json.tgtrSeq);
                mevent.detail.eventShowLayer('evtGift2_CFhbr5RF7o');
            }else if(resultItem == "8") { //
                $(".mem_id").html("당첨자번호 : " + json.tgtrSeq);
                mevent.detail.eventShowLayer('evtGift3_GbhyhnxRn8o');
            }else if(resultItem == "9") { //
                $(".mem_id").html("당첨자번호 : " + json.tgtrSeq);
                mevent.detail.eventShowLayer('evtGift4_U4qdbCc6eSo');
            }else  if(resultItem == "10") { //
                $(".mem_id").html("당첨자번호 : " + json.tgtrSeq);
                mevent.detail.eventShowLayer('evtGift5_lPydu01HI0Y');
            }else  if(resultItem == "11") { //
                $(".mem_id").html("당첨자번호 : " + json.tgtrSeq);
                mevent.detail.eventShowLayer('evtGift6_T52KdMmHhk');
            }else  if(resultItem == "12") { //
                mevent.detail.eventShowLayer('evtGift_fail');
            }else { // 다음기회에
                mevent.detail.eventShowLayer('evtGift_fail');
            }
            
            //남은 응모 횟수
            $("#possibleHotCnt").text(parseInt($("#possibleHotCnt").text()) - 1);
            //사용한 횟수
            $("#entryHotCnt").text(parseInt($("#entryHotCnt").text()) + 1);
            
        }else{
            if(json.ret == "013"){ // 이미응모한사람 
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
                  , _baseUrl + "event/20180906_3/getMyWinListJson.do"
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
    
    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){
        $(':radio[name="argee1"]:checked').attr("checked", false);
        $(':radio[name="argee2"]:checked').attr("checked", false);
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();        
        $("#eventDimLayer1").hide();
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

$(document).ready( function() {
    
    if(!common.isLogin()){
        $(".step1").addClass("on");
    }
    
    monthEvent.detail.firstChk = $("input[id='show1Cnt']:hidden").val();
    monthEvent.detail.strDtime = $("input[id='strDtime']:hidden").val();
    monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
    monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);
    
    if(monthEvent.detail.firstChk == "0"){
        $(".step1").addClass("on");
    }else if(monthEvent.detail.firstChk == "1"){
        if(eval(monthEvent.detail.strDtime) == eval(monthEvent.detail.currentDay)){
            $(".step1").addClass("on");
        }else{
            $(".step2").addClass("on");
        }
    }else if(monthEvent.detail.firstChk == "2"){
        if(eval(monthEvent.detail.strDtime) == eval(monthEvent.detail.currentDay)){
            $(".step2").addClass("on");
        }else{
            $(".step3").addClass("on");
        }
    }else if(monthEvent.detail.firstChk == "3"){
        if(eval(monthEvent.detail.strDtime) == eval(monthEvent.detail.currentDay)){
            $(".step3").addClass("on");
        }else{
            $(".step4").addClass("on");
        }
    }else if(monthEvent.detail.firstChk == "4"){
        if(eval(monthEvent.detail.strDtime) == eval(monthEvent.detail.currentDay)){
            $(".step4").addClass("on");
        }else{
            $(".step5").addClass("on");
        }
    }else if(monthEvent.detail.firstChk > "4"){
      $(".step5").addClass("on");
    }
    
    $('#step > li').each(function(){
        if(!$(this).hasClass('on')){
            $('.step_cont:eq('+ $(this).index() +')').addClass('hide');
        }
    });
    
    $('#step').find('a').on({
        'click' : function(e){
            
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
            }
            
            monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);
            
            // 탭 클릭 시 이벤트 : 현재 단계 미응모 후 다음단계 진입불가 처리
            if($(this).parent().index() == "1"){
/*                if(monthEvent.detail.todayChk == "Y"){
                    if(eval(monthEvent.detail.currentDay) == '20180920'){
                        alert("단계별 1일 1회 참여가능합니다.");
                        return;
                    }else{
                        alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                        return;
                    }
                }else{
                    if(monthEvent.detail.firstChk == "1"){
                    }else if(monthEvent.detail.firstChk == "0"){
                        alert("현재단계 참여 후 응모 가능합니다.");
                        return;
                    }else{
                        if(eval(monthEvent.detail.currentDay) == '20180920'){
                            if(eval(monthEvent.detail.strDtime) <= eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다.");
                                return;
                            }
                        }else{
                            if(eval(monthEvent.detail.strDtime) <= eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                                return;
                            }
                        }
                    }
                }*/
                if(monthEvent.detail.todayChk == "Y"){
                    if(monthEvent.detail.firstChk >= "1"){
                    }else{
                        if(eval(monthEvent.detail.currentDay) == '20180920'){
                            alert("단계별 1일 1회 참여가능합니다.");
                            return;
                        }else{
                            alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                            return;
                        }
                    }
                }else{
                    if(monthEvent.detail.firstChk >= "1"){
                    }else{
                        if(eval(monthEvent.detail.currentDay) == '20180920'){
                            if(eval(monthEvent.detail.strDtime) <= eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다.");
                                return;
                            }else {
                                if(monthEvent.detail.firstChk < "2"){
                                    alert("현재단계 참여 후 응모 가능합니다.");
                                    return;
                                }
                            }
                        }else{
                            if(eval(monthEvent.detail.strDtime) == eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                                return;
                            }else {
                                if(monthEvent.detail.firstChk < "2"){
                                    alert("현재단계 참여 후 응모 가능합니다.");
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            if($(this).parent().index() == "2"){
                if(monthEvent.detail.todayChk == "Y"){
                    if(monthEvent.detail.firstChk >= "2"){
                    }else{
                        if(eval(monthEvent.detail.currentDay) == '20180920'){
                            alert("단계별 1일 1회 참여가능합니다.");
                            return;
                        }else{
                            alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                            return;
                        }
                    }
                }else{
                    if(monthEvent.detail.firstChk >= "2"){
                    }else{
                        if(eval(monthEvent.detail.currentDay) == '20180920'){
                            if(eval(monthEvent.detail.strDtime) <= eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다.");
                                return;
                            }else {
                                if(monthEvent.detail.firstChk < "2"){
                                    alert("현재단계 참여 후 응모 가능합니다.");
                                    return;
                                }
                            }
                        }else{
                            if(eval(monthEvent.detail.strDtime) == eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                                return;
                            }else {
                                if(monthEvent.detail.firstChk < "2"){
                                    alert("현재단계 참여 후 응모 가능합니다.");
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            if($(this).parent().index() == "3"){
                if(monthEvent.detail.todayChk == "Y"){
                    if(monthEvent.detail.firstChk >= "3"){
                    }else{
                        if(eval(monthEvent.detail.currentDay) == '20180920'){
                            alert("단계별 1일 1회 참여가능합니다.");
                            return;
                        }else{
                            alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                            return;
                        }
                    }
                }else{
                    if(monthEvent.detail.firstChk >= "3"){
                    }else{
                        if(eval(monthEvent.detail.currentDay) == '20180920'){
                            if(eval(monthEvent.detail.strDtime) <= eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다.");
                                return;
                            }else {
                                if(monthEvent.detail.firstChk < "3"){
                                    alert("현재단계 참여 후 응모 가능합니다.");
                                    return;
                                }
                            }
                        }else{
                            if(eval(monthEvent.detail.strDtime) == eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                                return;
                            }else {
                                if(monthEvent.detail.firstChk < "3"){
                                    alert("현재단계 참여 후 응모 가능합니다.");
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            if($(this).parent().index() == "4"){
                if(monthEvent.detail.todayChk == "Y"){
                    if(monthEvent.detail.firstChk >= "4"){
                    }else{
                        if(eval(monthEvent.detail.currentDay) == '20180920'){
                            alert("단계별 1일 1회 참여가능합니다.");
                            return;
                        }else{
                            alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                            return;
                        }
                    }
                }else{
                    if(monthEvent.detail.firstChk >= "4"){
                    }else{
                        if(eval(monthEvent.detail.currentDay) == '20180920'){
                            if(eval(monthEvent.detail.strDtime) <= eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다.");
                                return;
                            }else {
                                if(monthEvent.detail.firstChk < "4"){
                                    alert("현재단계 참여 후 응모 가능합니다.");
                                    return;
                                }
                            }
                        }else{
                            if(eval(monthEvent.detail.strDtime) == eval(monthEvent.detail.currentDay)){
                                alert("단계별 1일 1회 참여가능합니다. 내일 참여해주세요.");
                                return;
                            }else {
                                if(monthEvent.detail.firstChk < "4"){
                                    alert("현재단계 참여 후 응모 가능합니다.");
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            
            e.preventDefault();
            $(this).parent().addClass('on').attr('title', '오늘의 단계').siblings().removeClass('on').removeAttr('title');
            $('.step_cont:eq('+ $(this).parent().index() +')').removeClass('hide').siblings().addClass('hide');
            
          //랜덤 숫자 가져오는 함수
            var fnRandomNum = function(max){            //랜덤 숫자 가져오는 함수(0~max사이의 값)
                return Math.floor(Math.random() * max);
            }

            var eventFull_len = $('.swiper-wrapper').children('li').length;       //FULL 배너 slide 갯수
            var eventFull_init_no = fnRandomNum(eventFull_len);                  //FULL 배너 slide  초기번호 

            //이벤트 FULL 배너 slide
            var eventSlide_set = {
                slidesPerView: 1,
                initialSlide : 0,
                /*autoplay: 4000,*/
                autoplay: false,
                pagination: '.paging',
                autoplayDisableOnInteraction: true,
                paginationClickable: true,
                freeMode: false,
                spaceBetween: 0,
                loop: true,
                nextButton: '.next',
                prevButton: '.prev'
            }, visual_swiper = Swiper('.slideType1', eventSlide_set );
        }
    });
});