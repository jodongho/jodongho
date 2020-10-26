$.namespace("monthEvent.detail");
monthEvent.detail = { 
    _ajax : common.Ajax,  
    roundNo : "0",      //뷰티 이상형 월드컵 라운드
    
    roundRndmVal1 : "",       //8강 1라운드 첫번째 상품값
    roundRndmVal2 : "",       //8강 1라운드 두번째 상품값
    roundRndmVal3 : "",       //8강 2라운드 첫번째 상품값
    roundRndmVal4 : "",       //8강 2라운드 두번째 상품값
    roundRndmVal5 : "",       //8강 3라운드 첫번째 상품값
    roundRndmVal6 : "",       //8강 3라운드 두번째 상품값
    roundRndmVal7 : "",       //8강 4라운드 첫번째 상품값
    roundRndmVal8 : "",       //8강 4라운드 두번째 상품값    
    roundRndmVal9 : "",       //4강 1라운드 첫번째 상품값
    roundRndmVal10 : "",     //4강 1라운드 두번째 상품값
    roundRndmVal11 : "",     //4강 2라운드 첫번째 상품값
    roundRndmVal12 : "",     //4강 2라운드 두번째 상품값
    roundRndmVal13 : "",     //결승 라운드 첫번째 상품값
    roundRndmVal14 : "",     //결승 라운드 두번째 상품값
    round1WinVal : "",         //8강 1라운드에서 선택한 상품값
    round2WinVal : "",         //8강 2라운드에서 선택한 상품값
    round3WinVal : "",         //8강 3라운드에서 선택한 상품값
    round4WinVal : "",         //8강 4라운드에서 선택한 상품값
    round5WinVal : "",         //4강 1라운드에서 선택한 상품값
    round6WinVal : "",         //4강 2라운드에서 선택한 상품값
    round7WinVal : "",         //결승 라운드에서 선택한 상품값
    
    checkStampYn : "N",
    checkSelectYn : "N",

    init : function(){
        
        // scroll class 변경
        var tabH = $(".treeTab img").height();
        $("#eventTabFixed2").css("height",tabH + "px");

        var tabHeight =$("#eventTabImg").height() + 203 ;
        var eTab01 = tabHeight + $("#evtConT01").height() - 10;
        var eTab02 = eTab01 + $("#evtConT02").height() - 2;
        var eTab03 = eTab02 + $("#evtConT03").height() - 2;
        var eTab04 = eTab03 + $("#evtConT04").height() - 2;
        var eTab05 = eTab04 + $("#evtConT05").height();

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
        } else if (scrollTab < eTab04) {
            $("#eventTabFixed2").attr('class','tab04');
        };
        
        $(window).scroll(function(){
            var scrollTab  = $(document).scrollTop();
            if (scrollTab < eTab01) {
                $("#eventTabFixed2").attr('class','tab01');
            } else if (scrollTab < eTab02) {
                $("#eventTabFixed2").attr('class','tab02');
            } else if (scrollTab < eTab03) {
                $("#eventTabFixed2").attr('class','tab03');
            } else if (scrollTab < eTab04) {
                $("#eventTabFixed2").attr('class','tab04');
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
        
//        if(common.isLogin()){
//            // 내가 찾은 스탬프 노출 및 응모권 확인
//            monthEvent.detail.getConrStampListJson();
//        };
//        
        $("input[name=r1]").click(function(){
             monthEvent.detail.startBeautyWorldCup();
         });
        
        /* 레이어 닫기 */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();
        });
        /* 위수탁 레이어 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
        /* 위수탁 레이어 닫기 (스탬프) */
        $(".eventHideLayer2").click(function(){
            monthEvent.detail.eventCloseLayer2();
        });
    },
    
    /* 위수탁동의 팝업 노출을 위한 응모여부 확인 */
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
                }
                
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180618/getFirstChkJson.do"
                      , param
                      , this._callback_getFirstChkJson
                );
            }
            
        }
        
    },    
    _callback_getFirstChkJson : function(json) {
        if(json.ret == "0"){
//            monthEvent.detail.firstYn = "Y";        //최초 참여 여부 변수값
            monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
        }else{
            alert("이미 응모 하셨습니다. 나의 참여 결과 보기를 확인하세요!");
        }
    },
    
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
                monthEvent.detail.eventCloseLayer1();
                return;
            }
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                monthEvent.detail.eventCloseLayer1();
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.eventCloseLayer1();
                return;
            }
            
            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.eventCloseLayer();
                monthEvent.detail.startBeautyWorldCupFirst();        //뷰티 이상형 월드컵 START
            }
        }
    },
    
    //뷰티 이상형 월드컵 8강 1라운드 실행
    startBeautyWorldCupFirst : function() {
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
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
                      , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180618/startBeautyWorldCupFirstJson.do"
                      , param
                      , monthEvent.detail._callback_startBeautyWorldCupFirstJson
                );
            }
        }
    },
    _callback_startBeautyWorldCupFirstJson : function(json) {
        monthEvent.detail.roundNo = json.roundNo;
        monthEvent.detail.roundRndmVal1 = json.roundRndmVal1;
        monthEvent.detail.roundRndmVal2 = json.roundRndmVal2;
        
        $("#goodsName1").html(json.goodsName1);
        $("#goodsName2").html(json.goodsName2);
        $("#goodsImg1").html(json.goodsImg1);
        $("#goodsImg2").html(json.goodsImg2);        
        $("#goodsName1Mid").html(json.goodsName1Mid);
        $("#goodsName2Mid").html(json.goodsName2Mid);
        $("#goodsDesc1").html(json.goodsDesc1);
        $("#goodsDesc2").html(json.goodsDesc2);
        
        $("#r11").val(json.roundRndmVal1);
        $("#r12").val(json.roundRndmVal2);
        
        $("#roundFirst").css("display", "none");
        $("#roundSecond").css("display", "block");
        
    },
    
    //뷰티 이상형 월드컵 8강 2라운드 이후 실행
    startBeautyWorldCup : function() {
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
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                
                if(monthEvent.detail.roundNo == "1"){       //8강 2라운드 넘어가기 전 8강 1라운드에서 선택한 상품번호 세팅
                    monthEvent.detail.round1WinVal = $("input[name='r1']:radio:checked").val();
                }else if(monthEvent.detail.roundNo == "2"){       //8강 3라운드 넘어가기 전 8강 2라운드에서 선택한 상품번호 세팅
                    monthEvent.detail.round2WinVal = $("input[name='r1']:radio:checked").val();
                }else if(monthEvent.detail.roundNo == "3"){       //8강 4라운드 넘어가기 전 8강 3라운드에서 선택한 상품번호 세팅
                    monthEvent.detail.round3WinVal = $("input[name='r1']:radio:checked").val();
                }else if(monthEvent.detail.roundNo == "4"){       //4강 1라운드 넘어가기 전 8강 4라운드에서 선택한 상품번호 세팅
                    monthEvent.detail.round4WinVal = $("input[name='r1']:radio:checked").val();
                }else if(monthEvent.detail.roundNo == "5"){       //4강 2라운드 넘어가기 전 4강 1라운드에서 선택한 상품번호 세팅
                    monthEvent.detail.round5WinVal = $("input[name='r1']:radio:checked").val();
                }else if(monthEvent.detail.roundNo == "6"){       //결승 라운드 넘어가기 전 4강 2라운드에서 선택한 상품번호 세팅
                    monthEvent.detail.round6WinVal = $("input[name='r1']:radio:checked").val();
                }else if(monthEvent.detail.roundNo == "7"){       //결승 라운드 에서 선택한 상품번호 세팅
                    monthEvent.detail.round7WinVal = $("input[name='r1']:radio:checked").val();
                }
                
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , roundNo : monthEvent.detail.roundNo
                      , roundRndmVal1 : monthEvent.detail.roundRndmVal1     //8강 1라운드에서 노출될 첫번째 아이템
                      , roundRndmVal2 : monthEvent.detail.roundRndmVal2     //8강 1라운드에서 노출될 두번째 아이템
                      , roundRndmVal3 : monthEvent.detail.roundRndmVal3     //8강 2라운드에서 노출될 첫번째 아이템
                      , roundRndmVal4 : monthEvent.detail.roundRndmVal4     //8강 2라운드에서 노출될 두번째 아이템
                      , roundRndmVal5 : monthEvent.detail.roundRndmVal5     //8강 3라운드에서 노출될 첫번째 아이템
                      , roundRndmVal6 : monthEvent.detail.roundRndmVal6     //8강 3라운드에서 노출될 두번째 아이템
                      , roundRndmVal7 : monthEvent.detail.roundRndmVal7     //8강 4라운드에서 노출될 첫번째 아이템
                      , roundRndmVal8 : monthEvent.detail.roundRndmVal8     //8강 4라운드에서 노출될 두번째 아이템
                      , round1WinVal : monthEvent.detail.round1WinVal       //8강 1라운드에서 선택한 아이템
                      , round2WinVal : monthEvent.detail.round2WinVal       //8강 2라운드에서 선택한 아이템
                      , round3WinVal : monthEvent.detail.round3WinVal       //8강 3라운드에서 선택한 아이템
                      , round4WinVal : monthEvent.detail.round4WinVal       //8강 4라운드에서 선택한 아이템
                      , round5WinVal : monthEvent.detail.round5WinVal       //4강 1라운드에서 선택한 아이템
                      , round6WinVal : monthEvent.detail.round6WinVal       //4강 2라운드에서 선택한 아이템
                      , round7WinVal : monthEvent.detail.round7WinVal       //결승 라운드에서 선택한 아이템
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180618/startBeautyWorldCupJson.do"
                      , param
                      , monthEvent.detail._callback_startBeautyWorldCupJson
                );
            }
        }
    },
    _callback_startBeautyWorldCupJson : function(json) {
        monthEvent.detail.roundNo = json.roundNo;
        $("#r11").val("");      //radio의 값 초기화
        $("#r12").val("");
        $(':radio[name="r1"]:checked').attr("checked", false);      //radio의 체크 초기화
        
        var goodsName1 = "";
        var goodsName2 = "";
        var goodsImg1 = "";
        var goodsImg2 = "";
        var goodsName1Mid = "";
        var goodsName2Mid = "";
        var goodsDesc1 = "";
        var goodsDesc21 = "";
        
        if(json.roundNo == "lastPick"){
            //1위로 선택한 상품 저장
            monthEvent.detail.myBeautyWorldCupWin(json.lastPickRndmVal);        //뷰티 이상형 월드컵 최종 참여
        }else{
            if(json.roundNo == "2"){
                monthEvent.detail.roundRndmVal3 = json.roundRndmVal3;
                monthEvent.detail.roundRndmVal4 = json.roundRndmVal4;
                $("#roundSecond").attr("class", "round r2");
                $("#r11").val(json.roundRndmVal3);
                $("#r12").val(json.roundRndmVal4);
            }else if(json.roundNo == "3"){
                monthEvent.detail.roundRndmVal5 = json.roundRndmVal5;
                monthEvent.detail.roundRndmVal6 = json.roundRndmVal6;
                $("#roundSecond").attr("class", "round r3");
                $("#r11").val(json.roundRndmVal5);
                $("#r12").val(json.roundRndmVal6);
            }else if(json.roundNo == "4"){
                monthEvent.detail.roundRndmVal7 = json.roundRndmVal7;
                monthEvent.detail.roundRndmVal8 = json.roundRndmVal8;
                $("#roundSecond").attr("class", "round r4");
                $("#r11").val(json.roundRndmVal7);
                $("#r12").val(json.roundRndmVal8);
            }else if(json.roundNo == "5"){
                monthEvent.detail.roundRndmVal9 = json.roundRndmVal9;
                monthEvent.detail.roundRndmVal10 = json.roundRndmVal10;
                $("#roundSecond").attr("class", "round r5");
                $("#r11").val(json.roundRndmVal9);
                $("#r12").val(json.roundRndmVal10);
            }else if(json.roundNo == "6"){
                monthEvent.detail.roundRndmVal11 = json.roundRndmVal11;
                monthEvent.detail.roundRndmVal12 = json.roundRndmVal12;
                $("#roundSecond").attr("class", "round r6");
                $("#r11").val(json.roundRndmVal11);
                $("#r12").val(json.roundRndmVal12);
            }else if(json.roundNo == "7"){
                monthEvent.detail.roundRndmVal13 = json.roundRndmVal13;
                monthEvent.detail.roundRndmVal14 = json.roundRndmVal14;
                $("#roundSecond").attr("class", "round r7");
                $("#r11").val(json.roundRndmVal13);
                $("#r12").val(json.roundRndmVal14);
            }
            
            $("#goodsName1").html(json.goodsName1);
            $("#goodsName2").html(json.goodsName2);
            $("#goodsImg1").html(json.goodsImg1);
            $("#goodsImg2").html(json.goodsImg2);        
            $("#goodsName1Mid").html(json.goodsName1Mid);
            $("#goodsName2Mid").html(json.goodsName2Mid);
            $("#goodsDesc1").html(json.goodsDesc1);
            $("#goodsDesc2").html(json.goodsDesc2);
        }
        
    },
    
    //내가 선택한 뷰티 이상형 월드컵 1위 상품 응모
    myBeautyWorldCupWin : function(lastPickRndmVal) {
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
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , fvrSeq : lastPickRndmVal       //8개 상품 중 최종적으로 선택한 1위 상품
                      , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
                      , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180618/myBeautyWorldCupWin.do"
                      , param
                      , monthEvent.detail._callback_myBeautyWorldCupWin
                );
            }
        }
    },
    _callback_myBeautyWorldCupWin : function(json) {
        $("#r11").val("");      //radio의 값 초기화
        $("#r12").val("");
        $(':radio[name="r1"]:checked').attr("checked", false);      //radio의 체크 초기화
        
        $("#roundFirst").css("display", "block");
        $("#roundSecond").css("display", "none");
        monthEvent.detail.myBeautyWorldCupResult("myBeautyWorldCupWin");     //나의 뷰티 이상형 월드컵 참여 결과보기 노출 (1위상품 응모 시 만 쿠폰 받을 구분값)
    },
    
    //나의 뷰티 이상형 월드컵 참여 결과보기
    myBeautyWorldCupResult : function(codeVal) {        
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , codeVal : codeVal
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180618/getMyBeautyWorldCupResultJson.do"
              , param
              , this._callback_myBeautyWorldCupResult
        );        
    },
    _callback_myBeautyWorldCupResult : function(json) {
        if(json.ret == "0"){
            alert("이벤트 참여 이력이 없습니다.");
        }else{
            var cpnNo = "";
            
            //상품번호 1, 5, 6, 7번은 20% 쿠폰
            if(json.myLastPickRndmVal == "1" || json.myLastPickRndmVal == "5" || json.myLastPickRndmVal == "6" || json.myLastPickRndmVal == "7"){
                if(json.profile == "dev"){
                    cpnNo = "g0CzCBI3VCaWxvG86zmeIQ==";
                }else if(json.profile == "qa"){
                    cpnNo = "g0CzCBI3VCZulZ78Xz3nsA==";
                }else if(json.profile == "prod"){
                    cpnNo = "g0CzCBI3VCa2EU8gJfmrJQ==";
                }                
            }else{      //상품번호 2, 3, 4, 8번은 25% 쿠폰
                if(json.profile == "dev"){
                    cpnNo = "g0CzCBI3VCbilVB9DGpc9Q==";
                }else if(json.profile == "qa"){
                    cpnNo = "g0CzCBI3VCZ5G6Pj7GpbcA==";
                }else if(json.profile == "prod"){
                    cpnNo = "g0CzCBI3VCbKJPPqLb9LYQ==";
                }
            }
            
            if(json.codeVal == "myBeautyWorldCupWin"){      //(1위상품 응모 시 만 쿠폰 받을 구분값)
                monthEvent.detail.beautyWorldCupDownCouponJson(cpnNo);        //쿠폰 다운로드
            }
            
            var myLastPickHtml = "";
            
            if(json.myLastPickRndmVal == "1"){
                myLastPickHtml = "<img src='"+_cdnImgUrl+"contents/201806/18worldcup/worldcup_mc_pop01.png' alt='이브로쉐 리프레쉬 헤어식초(모링가)'>";
                $("#winnerDesc").html(myLastPickHtml);
            }else if(json.myLastPickRndmVal == "2"){                
                myLastPickHtml = "<img src='"+_cdnImgUrl+"contents/201806/18worldcup/worldcup_mc_pop02.png' alt='라로슈포제 안뗄리오스 썬플루이드'>";
                $("#winnerDesc").html(myLastPickHtml);
            }else if(json.myLastPickRndmVal == "3"){
                myLastPickHtml = "<img src='"+_cdnImgUrl+"contents/201806/18worldcup/worldcup_mc_pop03.png' alt='글램디 이너라이트 CL'>";
                $("#winnerDesc").html(myLastPickHtml);
            }else if(json.myLastPickRndmVal == "4"){
                myLastPickHtml = "<img src='"+_cdnImgUrl+"contents/201806/18worldcup/worldcup_mc_pop04.png' alt='메이크프렘 세이프 미 크림'>";
                $("#winnerDesc").html(myLastPickHtml);
            }else if(json.myLastPickRndmVal == "5"){
                myLastPickHtml = "<img src='"+_cdnImgUrl+"contents/201806/18worldcup/worldcup_mc_pop05.png' alt='16브랜드 발광펜'>";
                $("#winnerDesc").html(myLastPickHtml);
            }else if(json.myLastPickRndmVal == "6"){
                myLastPickHtml = "<img src='"+_cdnImgUrl+"contents/201806/18worldcup/worldcup_mc_pop06.png' alt='경남 칼로아웃 30포'>";
                $("#winnerDesc").html(myLastPickHtml);
            }else if(json.myLastPickRndmVal == "7"){
                myLastPickHtml = "<img src='"+_cdnImgUrl+"contents/201806/18worldcup/worldcup_mc_pop07.png' alt='아토팜 톡톡 페이셜 선팩트'>";
                $("#winnerDesc").html(myLastPickHtml);
            }else if(json.myLastPickRndmVal == "8"){
                myLastPickHtml = "<img src='"+_cdnImgUrl+"contents/201806/18worldcup/worldcup_mc_pop08.png' alt='키스미 볼륨컨트롤 마스카라'>";
                $("#winnerDesc").html(myLastPickHtml);
            }
            mevent.detail.eventShowLayer('winner');
        }
    },
    
    //뷰티 이상형 월드컵 랭킹 결과보기
    beautyWorldCupRank : function() {        
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180618/getBeautyWorldCupRankJson.do"
              , param
              , this._callback_beautyWorldCupRank
        );        
    },
    _callback_beautyWorldCupRank : function(json) {
        if(json.ret == "0"){
            alert("이벤트 참여 후 확인 가능합니다.");
        }else{
            var worldcupRnkList = json.evtWorldcupRnkList;
            var totCnt = 0;
            if(worldcupRnkList != undefined && worldcupRnkList != null && worldcupRnkList.length > 0){
                // 소원랭킹 설정
                for(var i=0; i<8; i++){
                    totCnt += parseInt(worldcupRnkList[i].rnkCnt);
                    $("#rnk0"+(i+1)).text("("+worldcupRnkList[i].rnkCnt+"명)");
                    $("#rnk0"+(i+1)+"GoodsImg").attr("src",_cdnImgUrl+"contents/201806/18worldcup/mc_goods0"+worldcupRnkList[i].fvrSeq+".png");
                    $("#rnk0"+(i+1)+"GoodsNm").text(worldcupRnkList[i].rnkGoodsNm);
                }
                $("#totCnt").text(totCnt);
                for(var i=0; i<8; i++){
                    $("#rnk0"+(i+1)+"Per").text(Math.round(worldcupRnkList[i].rnkCnt / totCnt * 100)+"%");                //%계산(소수점 반올림)
                    $("#rnk0"+(i+1)+"Per").css("width", Math.round(worldcupRnkList[i].rnkCnt / totCnt * 100)+"%");      //%계산(소수점 반올림)
                }
            }
            mevent.detail.eventShowLayer('lanking');
        }
    },
    
    /* 
     * 뷰티 월드컵 응모 후 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    beautyWorldCupDownCouponJson : function(cpnNo) {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능합니다.")){
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
                        , this._callback_beautyWorldCupDownCouponJson
                 );
            }
        }
    },
    _callback_beautyWorldCupDownCouponJson : function(json) {
        //별도의 알럿이 노출 될 필요 없음
//        if(json.ret == '0'){
//            alert(json.message);
//        }
    },
    
    /* 
     * 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    downCouponJson : function(cpnNo) {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능합니다.")){
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
                        , this._callback_downCouponJson
                 );
            }
        }
    },
    _callback_downCouponJson : function(json) {
        if(json.ret == '0'){
            alert(json.message);
        }
    },
    
    //구매도장찍기 
    addBuyStampOrderCategory : function() {
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
              , _baseUrl + "event/20180618/addBuyStampOrderCategory.do"
              , param
              , monthEvent.detail._callback_checkBuyStampJson
        ); 
    },
    
    _callback_checkBuyStampJson : function(json) {
        if(json.ret == "0"){
            if(json.categoryList.length > 0){
                for(i=0 ; i<json.categoryList.length ; i++){
                   if( json.categoryList[i] == 1 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on01.png' alt='미용소품 구매완료'>";
                       $("div#stamp1").find("span").html(htmlStr);
                   }else  if( json.categoryList[i] == 2 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on02.png' alt='기초 구매완료'>";
                       $("div#stamp2").find("span").html(htmlStr);
                   }else  if( json.categoryList[i] == 3 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on03.png' alt='헤어/바디 구매완료'>";
                       $("div#stamp3").find("span").html(htmlStr);
                   }else  if( json.categoryList[i] == 4 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on04.png' alt='메이크업 구매완료'>";
                       $("div#stamp4").find("span").html(htmlStr);
                   }else  if( json.categoryList[i] == 5 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on05.png' alt='푸드 구매완료'>";
                       $("div#stamp5").find("span").html(htmlStr);
                   }
                }
            }

            monthEvent.detail.checkStampYn = "Y";
        }else{
            alert(json.message);
        }
    },
    
    applyJson : function(fvrSeq){

        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
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
            
            if(monthEvent.detail.checkStampYn != "Y"){
                alert("구매도장을 찍고 응모해주세요.");
                monthEvent.detail.checkStampYn = "N";
                return;
            }
            
          common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180618/checkApplyJson.do" //  fvrSeq에 따라 카데고리 구매 했는지 체크 
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val() , 
                          fvrSeq : fvrSeq
                    }
                  , function(json){ 
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                        if(json.ret == "0"){   // 카테고리 구매건수가 맞으면 위수탁 레이어팝업 노출  확인 클릭 하면 응모하기  
                            if(json.categorySize >= 3){
                                   if( json.myTotalCnt  == "0" ) {  //  세개중 한번도 신청하지 않은경우 위수탁 받기 
                                       $("div#Confirmlayer2").attr("onClick", "monthEvent.detail.addApplyJson(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); "         );
                                       monthEvent.detail.eventCloseLayer();
                                       monthEvent.detail.eventShowLayer2('eventLayerPolice1');
                                       $(".agreeCont").scrollTop(0);  // 상단이동 
                                   }else {
                                       monthEvent.detail.addApplyJson(fvrSeq, json.myTotalCnt);
                                   }
                            }
                        }else{
                            alert(json.message);
                        } 
                      
                    }
            ); 
        }
    },
    
    addApplyJson : function(fvrSeq,myTotalCnt){
        //실제로 응모처리 수행해야함 
         if(!mevent.detail.checkLogin()){
             return;
         }
         if(!mevent.detail.checkRegAvailable()){
             return;
         }

        var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
        var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

        if(myTotalCnt == 0 ){ 
            if("Y" != mbrInfoUseAgrYn){
                monthEvent.detail.eventCloseLayer2();
                return;
            }
            if("Y" != mbrInfoThprSupAgrYn){
                monthEvent.detail.eventCloseLayer2();
                return;
            }
        }else {
            mbrInfoUseAgrYn = "Y";
            mbrInfoThprSupAgrYn = "Y";
        }

        monthEvent.detail.eventCloseLayer();
        
       var param = {
                 evtNo : $("input[id='evtNo']:hidden").val()
               , fvrSeq : fvrSeq  
               , mbrInfoUseAgrYn : mbrInfoUseAgrYn
               , mbrInfoThprSupAgrYn : mbrInfoThprSupAgrYn
         };
         common.Ajax.sendJSONRequest(
                 "GET"
               , _baseUrl + "event/20180618/addApplyJson.do"  
               , param
               , monthEvent.detail._callback_addApplyJson
         );   
     },
     
     _callback_addApplyJson : function(json){
          if(json.ret == "0"){
             $(':radio[name="argee1"]:checked').attr("checked", false);
             $(':radio[name="argee2"]:checked').attr("checked", false);
             alert("응모되었습니다");
         }else{
             alert(json.message);
         }
     },
    
    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer2").hide();
    },
    
    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        alert("신청되지 않았습니다.");
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer2").hide();
        location.reload();      //위수탁 동의 x일 때 스크롤 맨위로 가게하기 위해 페이지 새로고침
    },
    
    // 위수탁 레이어 숨김 (스탬프) 
    eventCloseLayer2 : function(){
        alert("신청되지 않았습니다.");
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer2").hide();
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
    
    // 레이어 노출 (스탬프) 
    eventShowLayer2 : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer2');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
};
  