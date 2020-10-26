$.namespace("monthEvent.detail"); 
monthEvent.detail = {
        
        //psm
        mbrNm : null,
        luckyNum : null,
        luckyNum1 : null,
        luckyNum2 : null,
        fvrSeq : null,
        
        //hjh
        evtStrtDt : "",  //구매금액 적립 시작일자
        evtEndDt : "",  //구매금액 적립 종료일자
        firstChk : "",
        currentDay : null,
        changeDate1 : "201810150000", 
        changeDate2 : "201810160000",      
        changeDate3 : "201810170000",
        changeDate4 : "201810180000",
        changeDate5 : "201810190000",
        changeDate6 : "201810200000",
        changeDate7 : "201810210000",
        changeDate8 : "201810220000",
        
        //yts
        
    init : function(){
        
        /* psm start */
        
        monthEvent.detail.mbrNm = $("input[id='mbrNm']:hidden").val();
        
        if(!common.isLogin()){ // 로그인 안했을 경우 너에게
            $("#txtNm").text("너");
            $(".signal_name").append("에게");
        }else{
            if(monthEvent.detail.mbrNm.length > 4){
                $("#txtNm").text("너");
                $(".signal_name").append("에게");
            }else{
                $("#txtNm").text(monthEvent.detail.mbrNm);
                $(".signal_name").append("님에게");
            }
        };
        
        /* psm end */
        
        /* hjh start */
        
        /* hjh end */
        
        /* yts start */
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        if ( eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate1) && eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate2)  ) {
            $("#zodiacAccordion15").css('display','block');
            $("#starAccordion15").css('display','block');
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate2) && eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate3)  ) {
            $("#zodiacAccordion16").css('display','block');
            $("#starAccordion16").css('display','block');
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3) && eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate4)  ) {
            $("#zodiacAccordion17").css('display','block');
            $("#starAccordion17").css('display','block');
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate4) && eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate5)  ) {
            $("#zodiacAccordion18").css('display','block');
            $("#starAccordion19").css('display','block');
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate5) && eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate6)  ) {
            $("#zodiacAccordion19").css('display','block');
            $("#starAccordion19").css('display','block');
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate6) && eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate7)  ) {
            $("#zodiacAccordion20").css('display','block');
            $("#starAccordion20").css('display','block');
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate7) && eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate8)  ) {
            $("#zodiacAccordion21").css('display','block');
            $("#starAccordion21").css('display','block');
        }else{
            $("#zodiacAccordion15").css('display','block');
            $("#starAccordion15").css('display','block');
        }
        //accordion
        $('.accordion .tit').click(function(e){
            e.preventDefault();
            if($(this).parents('.accordion_item').hasClass('active')){
                $(this).parents('.accordion_item').removeClass('active');
            }else{
                $(this).parents('.accordion_item').addClass('active').siblings().removeClass('active');
            }
        });
        /* yts end */
        
        /* 닫기  */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();            
        });
        
        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            alert("개인정보 위수탁 약관 동의 후 응모 가능합니다.");
            monthEvent.detail.eventCloseLayer1();
        });
    },

    /* psm start */
    
    /* 오늘의 럭키넘버 : 룰렛 START 버튼 클릭 : 참여여부 확인 */
    rotation : function(){
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
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181011/downCouponChkJson.do"
                  , param
                  , monthEvent.detail._callback_downOrdCouponChkJson
            );
        }
    },
    _callback_downOrdCouponChkJson : function(json){
        if(json.ret != null || json.ret != "" || json.ret != undefined){
            if(json.ret == "0"){
                monthEvent.detail.randomLuckyNumJson();
            }else{
                if(json.fvrSeq != null || json.fvrSeq != "" || json.fvrSeq != undefined){
                    if(json.fvrSeq == "2"){
                        $("#reNum1").text("2");
                        $("#reNum2").text("0");
                        $("#rePer").text("20%");
                        $("#reLimitPrice").text("(최대 2,500원)");
                    }else if(json.fvrSeq == "3"){
                        $("#reNum1").text("2");
                        $("#reNum2").text("2");
                        $("#rePer").text("22%");
                        $("#reLimitPrice").text("(최대 2,500원)");
                    }else if(json.fvrSeq == "4"){
                        $("#reNum1").text("2");
                        $("#reNum2").text("5");
                        $("#rePer").text("25%");
                        $("#reLimitPrice").text("(최대 3,000원)");
                    }else if(json.fvrSeq == "5"){
                        $("#reNum1").text("2");
                        $("#reNum2").text("7");
                        $("#rePer").text("27%");
                        $("#reLimitPrice").text("(최대 3,000원)");
                    }else if(json.fvrSeq == "6"){
                        $("#reNum1").text("3");
                        $("#reNum2").text("0");
                        $("#rePer").text("30%");
                        $("#reLimitPrice").text("(최대 3,500원)");
                    }else if(json.fvrSeq == "7"){
                        $("#reNum1").text("3");
                        $("#reNum2").text("2");
                        $("#rePer").text("32%");
                        $("#reLimitPrice").text("(최대 3,500원)");
                    }else if(json.fvrSeq == "8"){
                        $("#reNum1").text("3");
                        $("#reNum2").text("5");
                        $("#rePer").text("35%");
                        $("#reLimitPrice").text("(최대 4,000원)");
                    }
                    mevent.detail.eventShowLayer('evtCoupon_re');
//                    alert(json.message);
                }
            }
        }
    },
    
    /* 오늘의 럭키넘버 : 룰렛 START 버튼 클릭 : 랜덤 숫자 가져오기 */
    randomLuckyNumJson : function(){
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
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181011/getRandomLuckyNumJson.do"
                  , param
                  , monthEvent.detail._callback_randomLuckyNumJson
            );
        }
    },
    _callback_randomLuckyNumJson : function(json) {
        
        if(json.ret != null || json.ret != "" || json.ret != undefined){
            if(json.ret == '0'){
                
                monthEvent.detail.luckyNum1 = json.randomNum1;
                monthEvent.detail.luckyNum2 = json.randomNum2;
                
                var randomNum1 = json.randomNum1;
                var randomNum2 = json.randomNum2;
                
                var msgcode = "";
                var message = "";
                var msgurl = "";

                // var duration = 3500;
                var pieAngle = 360*10;
                var angle = 0;
                var angle1 = 0;
                var angle2 = 0;
                
                var seq1 = 0;
                var seq2 = 0;
                
                /* 룰렛 위치값
                var seq1_1 = 3546; // 2
                var seq1_2 = 3510; // 3
                var seq2_1 = 3618; // 0
                var seq2_2 = 3546; // 2
                var seq2_3 = 3438; // 5
                var seq2_4 = 3366; // 7
                */

                // 룰렛1번 아이템 순번
                if(randomNum1 == "2"){
                    seq1 = 3546; // 2
                }else if(randomNum1 == "3"){
                    seq1 = 3510; // 3
                }
                
                // 룰렛2번 아이템 순번
                if(randomNum2 == "0"){
                    seq2 = 3618; // 0
                }else if(randomNum2 == "2"){
                    seq2 = 3546; // 2
                }else if(randomNum2 == "5"){
                    seq2 = 3438; // 5
                }else if(randomNum2 == "7"){
                    if(json.randomNum1 == "2"){
                        seq2 = 3366; // 7
                    }else if(json.randomNum1 == "3"){ // 앞자리가 3일 경우엔 뒷자리 0으로 셋팅
                        seq2 = 3618; // 0
                    }
                }
                
//                angle1 = (pieAngle - ((seq1*72)-18));
//                angle2 = (pieAngle - ((seq2*72)-90));
                angle1 = seq1;
                angle2 = seq2;
                
                console.log(angle1);
                $("#roulette_base1").rotate({
                    duration: 3500,
                    animateTo: angle1,
                    callback: function () {}
                });
                console.log(angle2);
                $("#roulette_base2").rotate({
                    duration: 3500,
                    animateTo: angle2,
                    callback: function () {}
                });
                
                setTimeout(function() { // 3.5초 후 쿠폰 다운로드
                    monthEvent.detail.downCouponJson();
                }, 3500);
            }
        }
    },

    /* 
     * 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    downCouponJson : function() {
        monthEvent.detail.luckyNum = monthEvent.detail.luckyNum1 + monthEvent.detail.luckyNum2;
        var angle = monthEvent.detail.luckyNum;
        
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
                
                if($("#profile").val() == "dev"){
                    if(angle == '20'){
                        cpnNo = "g0CzCBI3VCaBDkwKGlypeQ==";
                    }else if(angle == '22'){
                        cpnNo = "g0CzCBI3VCb0yrnvimmpKQ==";
                    }else if(angle == '25'){
                        cpnNo = "g0CzCBI3VCbHIEwBoyHl0A==";
                    }else if(angle == '27'){
                        cpnNo = "g0CzCBI3VCb2lAAdDuyvnw==";
                    }else if(angle == '30' || angle == '37'){
                        cpnNo = "g0CzCBI3VCYdX616Olmipg==";
                    }else if(angle == '32'){
                        cpnNo = "g0CzCBI3VCaGf7jAEwnCsQ==";
                    }else if(angle == '35'){
                        cpnNo = "g0CzCBI3VCaEzMbn9SHV/A==";
                    }
                }else if($("#profile").val() == "qa"){
                    if(angle == '20'){
                        cpnNo = "g0CzCBI3VCYYxxoZDvycrA==";
                    }else if(angle == '22'){
                        cpnNo = "g0CzCBI3VCY18AODUhvtEg==";
                    }else if(angle == '25'){
                        cpnNo = "g0CzCBI3VCa1iXFCkNwjnQ==";
                    }else if(angle == '27'){
                        cpnNo = "g0CzCBI3VCYSV8LaGcbmEw==";
                    }else if(angle == '30' || angle == '37'){
                        cpnNo = "g0CzCBI3VCY6ru9M542qBA==";
                    }else if(angle == '32'){
                        cpnNo = "g0CzCBI3VCaaqyZUKBrKWg==";
                    }else if(angle == '35'){
                        cpnNo = "g0CzCBI3VCb3e+jGXPOUQw==";
                    }
                }else if($("#profile").val() == "prod"){
                    if(angle == '20'){
                        cpnNo = "g0CzCBI3VCZz4BR7uBWrCQ==";
                    }else if(angle == '22'){
                        cpnNo = "g0CzCBI3VCbPoIpbeWYoHg==";
                    }else if(angle == '25'){
                        cpnNo = "g0CzCBI3VCbHuGtKVkCCnw==";
                    }else if(angle == '27'){
                        cpnNo = "g0CzCBI3VCYt6siU1saT6Q==";
                    }else if(angle == '30' || angle == '37'){
                        cpnNo = "g0CzCBI3VCZnDbGoEAluFA==";
                    }else if(angle == '32'){
                        cpnNo = "g0CzCBI3VCZ1lUuUTcCLQw==";
                    }else if(angle == '35'){
                        cpnNo = "g0CzCBI3VCYpguK6GVm58Q==";
                    }
                }
                
                if(typeof cpnNo == "undefined" || cpnNo == ""){
                    alert("쿠폰 번호가 없습니다.");
                    return;
                }
                
                if(angle == "20"){
                    monthEvent.detail.fvrSeq = "2"; 
                }else if(angle == "22"){
                    monthEvent.detail.fvrSeq = "3";
                }else if(angle == "25"){
                    monthEvent.detail.fvrSeq = "4";
                }else if(angle == "27"){
                    monthEvent.detail.fvrSeq = "5";
                }else if(angle == "30" || angle == '37'){
                    monthEvent.detail.fvrSeq = "6";
                }else if(angle == "32"){
                    monthEvent.detail.fvrSeq = "7";
                }else if(angle == "35"){
                    monthEvent.detail.fvrSeq = "8";
                }
                
                var param = {
                        cpnNo : cpnNo,
                        evtNo : $("input[id='evtNo']:hidden").val(),
                        fvrSeq : monthEvent.detail.fvrSeq
                        };
                
                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "event/20181011/setRndmCpnDownJson.do"
                        , param
                        , this._callback_setRndmCpnDownJson
                 );
            }
        }
    },
    _callback_setRndmCpnDownJson : function(json) {
        monthEvent.detail.luckyNum = monthEvent.detail.luckyNum1 + monthEvent.detail.luckyNum2;
        var angle = monthEvent.detail.luckyNum;
        
        if(json.ret != null || json.ret != "" || json.ret != undefined){
            if(json.ret == '0'){
                if(angle == "20"){
                    $("#num1").text("2");
                    $("#num2").text("0");
                    $("#per").text("20%");
                    $("#limitPrice").text("(최대 2,500원)");
                }else if(angle == "22"){
                    $("#num1").text("2");
                    $("#num2").text("2");
                    $("#per").text("22%");
                    $("#limitPrice").text("(최대 2,500원)");
                }else if(angle == "25"){
                    $("#num1").text("2");
                    $("#num2").text("5");
                    $("#per").text("25%");
                    $("#limitPrice").text("(최대 3,000원)");
                }else if(angle == "27"){
                    $("#num1").text("2");
                    $("#num2").text("7");
                    $("#per").text("27%");
                    $("#limitPrice").text("(최대 3,000원)");
                }else if(angle == "30" || angle == "37"){
                    $("#num1").text("3");
                    $("#num2").text("0");
                    $("#per").text("30%");
                    $("#limitPrice").text("(최대 3,500원)");
                }else if(angle == "32"){
                    $("#num1").text("3");
                    $("#num2").text("2");
                    $("#per").text("32%");
                    $("#limitPrice").text("(최대 3,500원)");
                }else if(angle == "35"){
                    $("#num1").text("3");
                    $("#num2").text("5");
                    $("#per").text("35%");
                    $("#limitPrice").text("(최대 4,000원)");
                }
                mevent.detail.eventShowLayer('evtCoupon');
            }else{
                if(json.fvrSeq != null || json.fvrSeq != "" || json.fvrSeq != undefined){
                    if(json.fvrSeq == "2"){
                        $("#reNum1").text("2");
                        $("#reNum2").text("0");
                        $("#rePer").text("20%");
                        $("#reLimitPrice").text("(최대 2,500원)");
                    }else if(json.fvrSeq == "3"){
                        $("#reNum1").text("2");
                        $("#reNum2").text("2");
                        $("#rePer").text("22%");
                        $("#reLimitPrice").text("(최대 2,500원)");
                    }else if(json.fvrSeq == "4"){
                        $("#reNum1").text("2");
                        $("#reNum2").text("5");
                        $("#rePer").text("25%");
                        $("#reLimitPrice").text("(최대 3,000원)");
                    }else if(json.fvrSeq == "5"){
                        $("#reNum1").text("2");
                        $("#reNum2").text("7");
                        $("#rePer").text("27%");
                        $("#reLimitPrice").text("(최대 3,000원)");
                    }else if(json.fvrSeq == "6"){
                        $("#reNum1").text("3");
                        $("#reNum2").text("0");
                        $("#rePer").text("30%");
                        $("#reLimitPrice").text("(최대 3,500원)");
                    }else if(json.fvrSeq == "7"){
                        $("#reNum1").text("3");
                        $("#reNum2").text("2");
                        $("#rePer").text("32%");
                        $("#reLimitPrice").text("(최대 3,500원)");
                    }else if(json.fvrSeq == "8"){
                        $("#reNum1").text("3");
                        $("#reNum2").text("5");
                        $("#rePer").text("35%");
                        $("#reLimitPrice").text("(최대 4,000원)");
                    }
                    mevent.detail.eventShowLayer('evtCoupon_re');
                }
            }
        }
    },
    
    /* psm end */
    
    /* hjh start */

    /**
     * 중복서브밋 방지 - 사용안함.
     * 
     * @returns {Boolean}
     */
    doubleSubmitCheck : function(){
        if(monthEvent.detail.doubleSubmitFlag){
            return monthEvent.detail.doubleSubmitFlag;
        }else{
            monthEvent.detail.doubleSubmitFlag = true;
            return false;
        }
    },
    

    
    /**
     * 배포일자 : 2018-10-11
     * 이벤트명 : 10월 3차 럭키기프트 이벤트
     * 설명       : 참여여부 확인
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
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : "1"
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20181011/getFirstChkJson.do"
                      , param
                      , monthEvent.detail._callback_getFirstChkJson
                );
            }
        }
    },
    _callback_getFirstChkJson : function(json){
        
        //variable 
        var result = json.ret;

        if(result == 0){
            //참여가능
            monthEvent.detail.firstChk = result;
            monthEvent.detail.applyForLuckyBox();
        }else{
//            alert("10월 29일 럭키를 확인하세요.");
            mevent.detail.eventShowLayer('evtCm');
        }
    },
    
    //1. LuckBox Btn Click
    applyForLuckyBox : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){ // 로그인 체크
                return;
            }
            //FIXME 필요여부 확인
            if(!mevent.detail.checkRegAvailable()){ // 이벤트 응모 기간 체크
                return;
            }
            
            //DEV,QA,PROD event date set
            if($("#profile").val() == "dev"){
                monthEvent.detail.evtStrtDt = "20180101";
                monthEvent.detail.evtEndDt = "20180930";
            }else if($("#profile").val() == "qa"){
                monthEvent.detail.evtStrtDt = "20180101";
                monthEvent.detail.evtEndDt = "20181230";
            }else if($("#profile").val() == "prod"){
                monthEvent.detail.evtStrtDt = "20181015";
                monthEvent.detail.evtEndDt = "20181021";
            }
            
            // 10/15~10/21 누적 4만원 이상 구매고객 응모가능
            var param = {
                      evtNo : $("input[id='evtNo']:hidden").val(),
                      
                      // 이벤트 진행 날짜 지정
                      evtStrtDt : monthEvent.detail.evtStrtDt,
                      evtEndDt : monthEvent.detail.evtEndDt
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181011/checkMyEventBuyAmtJson.do"
                  , param
                  , monthEvent.detail._callback_checkMyEventBuyAmtJson
            );
        }
    },
    
    _callback_checkMyEventBuyAmtJson : function(json){
        if(json.ret == "0"){
            
            //1. variable 
            var myTotalAmt = json.myTotalAmt.numberFormat();
            var chkTotalAmt = parseInt(json.myTotalAmt); 
            var limitAmount = 40000; //4만원 제한
            
            //2. 4만원 미만
            if(chkTotalAmt < limitAmount){
                alert("기간 내 4만원 이상 구매 고객만 응모 가능합니다.");
                
            //3. 4만원 이상
            }else if(chkTotalAmt >= limitAmount){
//                alert("기간 내 4만원이상 구매 완료");
                monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
                
            }else{
                //unknown error
            }
//            monthEvent.detail.eventApplyYnCheckJson();
        }else{
            alert(json.message);
            
        }
    },
    
    /* common Start */
    
    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                alert("개인정보 위수탁 약관 동의 후 응모 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("'개인정보 수집동의'에 동의해주셔야 응모 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("'개인정보 처리 위탁'에 동의해주셔야 응모 가능합니다.");
                return;
            }
            
            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.eventCloseLayer();
                monthEvent.detail.eventApplyJson();
            }
        }
    },
    
    /* common End*/
    
    /**
     * 배포일자 : 2018-10-11
     * 이벤트명 : 10월 3차 럭키기프트 이벤트
     * 설명      : 이벤트 참여 처리
     */
    eventApplyJson : function(){
        //1. variable chk
        var fvrSeq = "1"; //lucky box seq 
        
        //2. 위수탁 동의 체크
        if(monthEvent.detail.firstChk == 0){
            mbrInfoUseAgrYnChk = $("input[name='argee1']:radio:checked").val();
            mbrInfoThprSupAgrYnChk = $("input[name='argee2']:radio:checked").val();
            monthEvent.detail.firstYn="Y";
        }else{
            mbrInfoUseAgrYnChk = "Y";
            mbrInfoThprSupAgrYnChk = "Y";
            monthEvent.detail.firstYn="N";
        }
        
        
        //3. param set
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : fvrSeq
              , mbrInfoUseAgrYn : mbrInfoUseAgrYnChk                //개인정보 이용 동의 여부
              , mbrInfoThprSupAgrYn : mbrInfoThprSupAgrYnChk    //개인정보 위탁동의 여부
              , firstYn : monthEvent.detail.firstYn                        //참여여부
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181011/eventApplyJson.do"
              , param
              , monthEvent.detail._callback_eventApplyJson
        );
    },

    _callback_eventApplyJson : function(json){
        if(json.ret == "0"){
            // 중복 클릭 방지
            monthEvent.detail.doubleSubmitFlag = false;
            
            //alert("럭키를 확인하세요.");
            mevent.detail.eventShowLayer('evtCm');
            
            // 라디오 버튼 체크 초기화
            $(':radio[name="ChckName"]:checked').attr("checked", false);
            
        }else{
            alert(json.message);
        }
    },
    
    /* hjh end */
    
    /* yts start */
    /* 공유하기 */
    shareSns : function(){

//      로그인 여부 상관없이 카톡 공유하기 가능  
//      if(!mevent.detail.checkLogin()){
//          return;
//      }

        var evtNo = $("input[id='evtNo']:hidden").val();
        var reCommend = encodeURIComponent($("input[id='targetNum']:hidden").val());
        var imgUrl = "http:" + _cdnImgUrl + "contents/201805/14big5/big5_kakao_img.jpg";
//        var imgUrl = "";
        var title = "오늘 나의 운세 시그널은?";

        // 배너 이미지 체크
        var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
        if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
            bnrImgUrlAddr = "";
        } else {
            bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
        }

        // 이미지가 없을 경우만 배너로 교체
        if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
            imgUrl = bnrImgUrlAddr;
        }

        var snsShareUrl = _baseUrl + "KE.do?evtNo=" + evtNo + "&reCommend=" + reCommend;

        /* sns common init 시키기 위해서 한번만 실행 */
        if(monthEvent.detail.snsInitYn == "N"){
            common.sns.init(imgUrl, title, snsShareUrl);
            monthEvent.detail.snsInitYn = "Y";
        }

        common.sns.doShare("kakaotalk");
    },
 // 앱푸시 수신동의 확인 
    appPushJson1 : function(){
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
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : "9"
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181011/getAppPushYnCntJson.do"
                  , param
                  , monthEvent.detail._callback_getAppPushYnCntJson1
            );
        }
    },
    _callback_getAppPushYnCntJson1 : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
        }else{
            // 별자리 클릭한 사람 저장
            monthEvent.detail.insertUnseClickSignal(9);
            // 별자리 운세
//            mevent.detail.eventShowLayer('my_signal1');
            
        }
    },
    
    // 앱푸시 수신동의 확인 
    appPushJson2 : function(){
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
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : "10"
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181011/getAppPushYnCntJson.do"
                  , param
                  , monthEvent.detail._callback_getAppPushYnCntJson2
            );
        }
    },
    _callback_getAppPushYnCntJson2 : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
        }else{
            // 띠별 클릭 저장
            monthEvent.detail.insertUnseClickSignal(10);
            // 띠별 운세
//            mevent.detail.eventShowLayer('my_signal2');
        }
    },
    
    //이벤트 운세 클릭 저장
    insertUnseClickSignal : function(number){
        var fvrSeq = number;
        
        //3. param set
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : fvrSeq
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181011/eventUnseClickSignalJson.do"
              , param
              , monthEvent.detail._callback_unseClickSignal
        );
    },
    
    _callback_unseClickSignal : function(json){
        if(json.ret == "0"){
            if(json.fvrSeq == "9"){
                // 별자리 운세
                mevent.detail.eventShowLayer('my_signal1');
            }else if(json.fvrSeq == "10"){
                // 띠자리 운세
                mevent.detail.eventShowLayer('my_signal2');
            }
            
        }else{
            // 별자리 운세
            if(json.fvrSeq == "9"){
                // 별자리 운세
                mevent.detail.eventShowLayer('my_signal1');
            }else if(json.fvrSeq == "10"){
                // 띠자리 운세
                mevent.detail.eventShowLayer('my_signal2');
            }
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
    /* yts end */
    
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

    // 레이어 노출 위수탁 레이어
    eventShowLayer1 : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer1');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
    
};

//Tab Menu
$(document).ready(function(){

    // scroll class 변경
    var tabH = $(".treeTab img").height();
    $("#eventTabFixed2").css("height",tabH + "px");

    var tabHeight =$("#eventTabImg").height() + 203;
    var eTab01 = tabHeight + $("#evtConT01").height() - 5;
    var eTab02 = eTab01 + $("#evtConT02").height() - 5;
    var eTab03 = eTab02 + $("#evtConT03").height() - 5;
    var eTab04 = eTab03 + $("#evtConT04").height();

    var scrollTab  = $(document).scrollTop();

    if (scrollTab > tabHeight) {
        $("#eventTabFixed2")
        .css("position","fixed")
        .css("top","0px");
    }
   if (scrollTab < eTab01) {
        $("#eventTabFixed2").attr('class','tab01');
    } else if (scrollTab < eTab02) {
        $("#eventTabFixed2").attr('class','tab02');
    } else if (scrollTab < eTab03) {
        $("#eventTabFixed2").attr('class','tab03');
    };
    
    $(window).scroll(function(){
        var scrollTab  = $(document).scrollTop();
         if (scrollTab < eTab01) {
            $("#eventTabFixed2").attr('class','tab01');
        } else if (scrollTab < eTab02) {
            $("#eventTabFixed2").attr('class','tab02');
        } else if (scrollTab < eTab03) {
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
    
});