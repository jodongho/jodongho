$.namespace("monthEvent.detail");
monthEvent.detail = { 

    // 현재 날짜 시간을 자바에서 가져와야함 
    // 9월 22일 ~ 26일
    currentDay : null, 
    changeDate1 : "201809220000",
    changeDate2 : "201809222359",
    changeDate3 : "201809230000",
    changeDate4 : "201809232359",
    changeDate5 : "201809240000",
    changeDate6 : "201809242359",
    changeDate7 : "201809250000",
    changeDate8 : "201809252359",
    changeDate9 : "201809260000",
    changeDate10 : "201809262359",
    show1Cnt : "0",
    totalAmt : "0",
    fvrSeq : "0",
    stempChk22 : "N",
    stempChk23 : "N",
    stempChk24 : "N",
    stempChk25 : "N",
    stempChk26 : "N",
    mbrInfoUseAgrYnChk : "N",
    mbrInfoThprSupAgrYnChk : "N",

    init : function(){
        
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.show1Cnt = $("input[id='show1Cnt']:hidden").val();
        
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate2)  ) {
            $(".day1").addClass("on");
            $("#usemapDiv01").css("display", "block");
            $("#usemapDiv02").css("display", "none");
            $("#usemapDiv03").css("display", "none");
            $("#usemapDiv04").css("display", "none");
            $("#usemapDiv05").css("display", "none");
            monthEvent.detail.fvrSeq = '6';
//            if(monthEvent.detail.show1Cnt == '0'){
//                $(".stamp1").addClass("on");
//            }else{
//                $(".stamp1").addClass("end");
//            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)  ) {
            $(".day1").addClass("end");
            $(".day2").addClass("on");
            $("#usemapDiv01").css("display", "none");
            $("#usemapDiv02").css("display", "block");
            $("#usemapDiv03").css("display", "none");
            $("#usemapDiv04").css("display", "none");
            $("#usemapDiv05").css("display", "none");
            monthEvent.detail.fvrSeq = '7';
//            $(".stamp1").addClass("end");
//            if(monthEvent.detail.show1Cnt == '0'){
//                $(".stamp2").addClass("on");
//            }else{
//                $(".stamp2").addClass("end");
//            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate5) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate6)  ) {
            $(".day1").addClass("end");
            $(".day2").addClass("end");
            $(".day3").addClass("on");
            $("#usemapDiv01").css("display", "none");
            $("#usemapDiv02").css("display", "none");
            $("#usemapDiv03").css("display", "block");
            $("#usemapDiv04").css("display", "none");
            $("#usemapDiv05").css("display", "none");
            monthEvent.detail.fvrSeq = '8';
//            $(".stamp1").addClass("end");
//            $(".stamp2").addClass("end");
//            if(monthEvent.detail.show1Cnt == '0'){
//                $(".stamp3").addClass("on");
//            }else{
//                $(".stamp3").addClass("end");
//            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate7) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate8)  ) {
            $(".day1").addClass("end");
            $(".day2").addClass("end");
            $(".day3").addClass("end");
            $(".day4").addClass("on");
            $("#usemapDiv01").css("display", "none");
            $("#usemapDiv02").css("display", "none");
            $("#usemapDiv03").css("display", "none");
            $("#usemapDiv04").css("display", "block");
            $("#usemapDiv05").css("display", "none");
            monthEvent.detail.fvrSeq = '9';
//            $(".stamp1").addClass("end");
//            $(".stamp2").addClass("end");
//            $(".stamp3").addClass("end");
//            if(monthEvent.detail.show1Cnt == '0'){
//                $(".stamp4").addClass("on");
//            }else{
//                $(".stamp4").addClass("end");
//            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate9) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate10)  ) {
            $(".day1").addClass("end");
            $(".day2").addClass("end");
            $(".day3").addClass("end");
            $(".day4").addClass("end");
            $(".day5").addClass("on");
            $("#usemapDiv01").css("display", "none");
            $("#usemapDiv02").css("display", "none");
            $("#usemapDiv03").css("display", "none");
            $("#usemapDiv04").css("display", "none");
            $("#usemapDiv05").css("display", "block");
            monthEvent.detail.fvrSeq = '10';
//            $(".stamp1").addClass("end");
//            $(".stamp2").addClass("end");
//            $(".stamp3").addClass("end");
//            $(".stamp4").addClass("end");
//            if(monthEvent.detail.show1Cnt == '0'){
//                $(".stamp5").addClass("on");
//            }else{
//                $(".stamp5").addClass("end");
//            }
        }
        
        if(common.isLogin()){
            monthEvent.detail.getStepChk();
        }else{
            if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)  ) {
                $(".stamp1").addClass("end");
            }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate5) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate6)  ) {
                $(".stamp1").addClass("end");
                $(".stamp2").addClass("end");
            }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate7) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate8)  ) {
                $(".stamp1").addClass("end");
                $(".stamp2").addClass("end");
                $(".stamp3").addClass("end");
            }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate9) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate10)  ) {
                $(".stamp1").addClass("end");
                $(".stamp2").addClass("end");
                $(".stamp3").addClass("end");
                $(".stamp4").addClass("end");
            }
        }
        
        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            alert("개인정보 위수탁 약관 동의 후 응모 가능합니다.");
            monthEvent.detail.eventCloseLayer1();
        });
        
        /* 닫기  */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();            
        });
        
    },
    
    /* 단계확인 */
    getStepChk : function(){
        
        if(!mevent.detail.checkLogin()){
            return;
        }
        
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
        };
        
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180913/getStepChk.do"
              , param
              , this._callback_getStepChkJson
        );
    },
    _callback_getStepChkJson : function(json) {
        var searchStampList = json.searchStampList;
        
        if(searchStampList != null && searchStampList !=""){
            for(var i=0; i<5; i++){
                if(searchStampList[i] == '6'){
                    monthEvent.detail.stempChk22 = "Y";
                }
                if(searchStampList[i] == '7'){
                    monthEvent.detail.stempChk23 = "Y";
                }
                if(searchStampList[i] == '8'){
                    monthEvent.detail.stempChk24 = "Y";
                }
                if(searchStampList[i] == '9'){
                    monthEvent.detail.stempChk25 = "Y";
                }
                if(searchStampList[i] == '10'){
                    monthEvent.detail.stempChk26 = "Y";
                }
            }
        }
        
        // 22일 토요일 : 첫째날
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate2)  ) {
            if(monthEvent.detail.stempChk22 == "Y"){
                $(".stamp1").addClass("on");
            }
        }
        // 23일 일요일 : 둘째날
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)  ) {
            if(monthEvent.detail.stempChk22 == "Y"){
                $(".stamp1").addClass("on");
            }else if(monthEvent.detail.stempChk22 == "N"){
                $(".stamp1").addClass("end");
            }
            if(monthEvent.detail.stempChk23 == "Y"){
                $(".stamp2").addClass("on");
            }
        }
        // 24일 월요일 : 셋째날
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate5) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate6)  ) {
            if(monthEvent.detail.stempChk22 == "Y"){
                $(".stamp1").addClass("on");
            }else if(monthEvent.detail.stempChk22 == "N"){
                $(".stamp1").addClass("end");
            }
            if(monthEvent.detail.stempChk23 == "Y"){
                $(".stamp2").addClass("on");
            }else if(monthEvent.detail.stempChk23 == "N"){
                $(".stamp2").addClass("end");
            }
            if(monthEvent.detail.stempChk24 == "Y"){
                $(".stamp3").addClass("on");
            }
        }
        // 25일 화요일 : 넷째날
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate7) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate8)  ) {
            if(monthEvent.detail.stempChk22 == "Y"){
                $(".stamp1").addClass("on");
            }else if(monthEvent.detail.stempChk22 == "N"){
                $(".stamp1").addClass("end");
            }
            if(monthEvent.detail.stempChk23 == "Y"){
                $(".stamp2").addClass("on");
            }else if(monthEvent.detail.stempChk23 == "N"){
                $(".stamp2").addClass("end");
            }
            if(monthEvent.detail.stempChk24 == "Y"){
                $(".stamp3").addClass("on");
            }else if(monthEvent.detail.stempChk24 == "N"){
                $(".stamp3").addClass("end");
            }
            if(monthEvent.detail.stempChk25 == "Y"){
                $(".stamp4").addClass("on");
            }
        }
        // 26일 수요일 : 마지막날
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate9) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate10)  ) {
            if(monthEvent.detail.stempChk22 == "Y"){
                $(".stamp1").addClass("on");
            }else if(monthEvent.detail.stempChk22 == "N"){
                $(".stamp1").addClass("end");
            }
            if(monthEvent.detail.stempChk23 == "Y"){
                $(".stamp2").addClass("on");
            }else if(monthEvent.detail.stempChk23 == "N"){
                $(".stamp2").addClass("end");
            }
            if(monthEvent.detail.stempChk24 == "Y"){
                $(".stamp3").addClass("on");
            }else if(monthEvent.detail.stempChk24 == "N"){
                $(".stamp3").addClass("end");
            }
            if(monthEvent.detail.stempChk25 == "Y"){
                $(".stamp4").addClass("on");
            }else if(monthEvent.detail.stempChk25 == "N"){
                $(".stamp4").addClass("end");
            }
            if(monthEvent.detail.stempChk26 == "Y"){
                $(".stamp5").addClass("on");
            }
        }
    },
    
    /* 올롸잇 중복할인 쿠폰 받기 */
    thanksgivingCoupon : function(chk){
        
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }
            
            var cpnNo = "";
            
            if($("#profile").val() == "dev"){
                if(chk == '1'){
                    cpnNo = "g0CzCBI3VCaDkfiWkYtX+w==";
                }else if(chk == '2'){
                    cpnNo = "g0CzCBI3VCYyqCCoxbgV/A==";
                }else if(chk == '3'){
                    cpnNo = "g0CzCBI3VCYXdCBx6Fz19w==";
                }else if(chk == '4'){
                    cpnNo = "g0CzCBI3VCZCidG6RPtQWg==";
                }else if(chk == '5'){
                    cpnNo = "g0CzCBI3VCY1Y+M1Yxq9pQ==";
                }
            }else if($("#profile").val() == "qa"){
                if(chk == '1'){
                    cpnNo = "g0CzCBI3VCb6ECvaXres9w==";
                }else if(chk == '2'){
                    cpnNo = "g0CzCBI3VCbTI4elznOxbA==";
                }else if(chk == '3'){
                    cpnNo = "g0CzCBI3VCautQGN76CyUg==";
                }else if(chk == '4'){
                    cpnNo = "g0CzCBI3VCaJfcHjxYfIGg==";
                }else if(chk == '5'){
                    cpnNo = "g0CzCBI3VCYDRUwZAgwFPg==";
                }
            }else if($("#profile").val() == "prod"){
                if(chk == '1'){
                    cpnNo = "g0CzCBI3VCZLqxJhzpf/Pg==";
                }else if(chk == '2'){
                    cpnNo = "g0CzCBI3VCYxcEbLjNIdmQ==";
                }else if(chk == '3'){
                    cpnNo = "g0CzCBI3VCanIPgmtTxbCg==";
                }else if(chk == '4'){
                    cpnNo = "g0CzCBI3VCaYu1ZrOyu3Ww==";
                }else if(chk == '5'){
                    cpnNo = "g0CzCBI3VCYIX0cflZhMzA==";
                }
            }
            monthEvent.detail.downCouponJson(cpnNo);
        }
    },
    
    /* 
     * 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    downCouponJson : function(cpnNo) {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
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
                if(typeof cpnNo == "undefined" || cpnNo == ""){
                    alert("쿠폰 번호가 없습니다.");
                    return;
                }
                var param = {cpnNo : cpnNo};
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/downCouponJson.do"
                        , param
                        , this._callback_downOrdCouponJson
                 );
            }
        }
    },
    _callback_downOrdCouponJson : function(json) {
        if(json.ret == '0'){
            alert(json.message);
        }
    },
    
    // 응모 step1. 응모하기 전 위수탁 확인 
    confirmJson : function(){
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
            
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180913/setConfirmJson.do" //  최초 1회 위수탁 팝업 호출  and 당일 응모 참여 했는지 조회 
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val() 
//                          , fvrSeq : monthEvent.detail.fvrSeq
                    }
                  , function(json){ 
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                        if(json.ret == "0"){
                            if( json.myTotalCnt  == "0" ) {  //  한번도 응모를 하지 않은경우 
                                  $("div#Confirmlayer1").attr("onClick", "   monthEvent.detail.setApply(' " + json.myTotalCnt + " '  ); ");
                                  monthEvent.detail.eventShowLayer1('eventLayerPolice');
                              }else {
                                  monthEvent.detail.setApply(json.myTotalCnt);
                              }
                        }else{
                            alert(json.message);
                        }
                    }
            );           
        }
    },
    /* 응모 step2. 응모하기 */
    setApply : function(myTotalCnt){
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

            monthEvent.detail.eventCloseLayer1();
            
            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                      , fvrSeq : monthEvent.detail.fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180913/setApplyJson.do"
                  , param
                  , monthEvent.detail._callback_setApplyJson
            );
        }
    },
    //응모 step3. 응모결과 보여주기
    _callback_setApplyJson : function(json){
        if(json.ret == "0"){
            $(".mem_id").html(json.custId);
            if(json.winYn=="Y"){
                monthEvent.detail.getStepChk();
                
                if(monthEvent.detail.fvrSeq == "6"){
                    mevent.detail.eventShowLayer('evtGift1');
                }else if(monthEvent.detail.fvrSeq == "7"){
                    mevent.detail.eventShowLayer('evtGift2');
                }else if(monthEvent.detail.fvrSeq == "8"){
                    mevent.detail.eventShowLayer('evtGift3');
                }else if(monthEvent.detail.fvrSeq == "9"){
                    mevent.detail.eventShowLayer('evtGift4');
                }else if(monthEvent.detail.fvrSeq == "10"){
                    mevent.detail.eventShowLayer('evtGift5');
                }
            }else{
                monthEvent.detail.getStepChk();
                mevent.detail.eventShowLayer('evtGift_fail');//아쉽지만 : 꽝
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
                  , _baseUrl + "event/20180913/getMyWinListJson.do"
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
        // 중복 클릭 방지
        monthEvent.detail.doubleSubmitFlag = false;
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){
        $(':radio[name="argee1"]:checked').attr("checked", false);
        $(':radio[name="argee2"]:checked').attr("checked", false);
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();        
        $("#eventDimLayer1").hide();
        // 중복 클릭 방지
        monthEvent.detail.doubleSubmitFlag = false;
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
  