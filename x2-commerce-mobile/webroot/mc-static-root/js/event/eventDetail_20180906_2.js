$.namespace("monthEvent.detail"); 
monthEvent.detail = {
        
    // 현재 날짜 시간을 자바에서 가져와야함 
    currentDay : null, 
    changeDate1 : "201809140000", 
    changeDate2 : "201809150000",      
    changeDate3 : "201809160000",  
    changeDate4 : "201809170000",
    changeDate5 : "201809180000",
    changeDate6 : "201809190000",
    changeDate7 : "201809200000",
    changeDate8 : "201809210000",
    fvrSeq : "0",
    dispCatNo1 : "0",
    dispCatNo2 : "0",
    evtStrtDt : "20180101",
    evtEndDt : "20180101",

    init : function(){
        
        // 이벤트 start
        monthEvent.detail.initEvent();
        // 오특 스탬프
        monthEvent.detail.getEventCnt1();
        // 더블팩 스탬프
        monthEvent.detail.getEventCnt2();
        // 이벤트 end
        
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
    // 이벤트 init
    initEvent : function(){ 
        //스탬프 리셋
        $(".otk.sbox.stamp li").removeClass("on");
        $(".doub.sbox.stamp li").removeClass("on");
        
        if($("#profile").val() == "dev"){
            monthEvent.detail.dispCatNo2 = "5000001000100010001";
        }else if($("#profile").val() == "qa"){
            monthEvent.detail.dispCatNo2 = "5000001001400660001";
        }else if($("#profile").val() == "prod"){
            monthEvent.detail.dispCatNo2 = "5000001004900020001";
        }
        
        if($("#profile").val() == "dev"){
            monthEvent.detail.evtStrtDt = "20180101";
            monthEvent.detail.evtEndDt = "20180920";
        }else if($("#profile").val() == "qa"){
            monthEvent.detail.evtStrtDt = "20180101";
            monthEvent.detail.evtEndDt = "20180920";
        }else if($("#profile").val() == "prod"){
            monthEvent.detail.evtStrtDt = "20180914";
            monthEvent.detail.evtEndDt = "20180920";
        }
        
        //날짜별 사은품 및 카테고리 설정 설정
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate2)  ) {
            monthEvent.detail.fvrSeq = "1";
            if($("#profile").val() == "dev"){
                monthEvent.detail.dispCatNo1 = "5000001000100010001";
            }else if($("#profile").val() == "qa"){
                monthEvent.detail.dispCatNo1 = "5000001001400670001";
            }else if($("#profile").val() == "prod"){
                monthEvent.detail.dispCatNo1 = "5000001001400780001";
            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate2) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate3)  ) {
            monthEvent.detail.fvrSeq = "2";
            if($("#profile").val() == "dev"){
                monthEvent.detail.dispCatNo1 = "5000001000100010001";
            }else if($("#profile").val() == "qa"){
                monthEvent.detail.dispCatNo1 = "5000001001400670002";
            }else if($("#profile").val() == "prod"){
                monthEvent.detail.dispCatNo1 = "5000001001400780002";
            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)  ) {
            monthEvent.detail.fvrSeq = "3";
            if($("#profile").val() == "dev"){
                monthEvent.detail.dispCatNo1 = "5000001000100010001";
            }else if($("#profile").val() == "qa"){
                monthEvent.detail.dispCatNo1 = "5000001001400670003";
            }else if($("#profile").val() == "prod"){
                monthEvent.detail.dispCatNo1 = "5000001001400780003";
            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate4) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate5)  ) {
            monthEvent.detail.fvrSeq = "4";
            if($("#profile").val() == "dev"){
                monthEvent.detail.dispCatNo1 = "5000001000100010001";
            }else if($("#profile").val() == "qa"){
                monthEvent.detail.dispCatNo1 = "5000001001400670004";
            }else if($("#profile").val() == "prod"){
                monthEvent.detail.dispCatNo1 = "5000001001400780004";
            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate5) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate6)  ) {
            monthEvent.detail.fvrSeq = "5";
            if($("#profile").val() == "dev"){
                monthEvent.detail.dispCatNo1 = "5000001000100010001";
            }else if($("#profile").val() == "qa"){
                monthEvent.detail.dispCatNo1 = "5000001001400670005";
            }else if($("#profile").val() == "prod"){
                monthEvent.detail.dispCatNo1 = "5000001001400780005";
            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate6) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate7)  ) {
            monthEvent.detail.fvrSeq = "6";
            if($("#profile").val() == "dev"){
                monthEvent.detail.dispCatNo1 = "5000001000100010001";
            }else if($("#profile").val() == "qa"){
                monthEvent.detail.dispCatNo1 = "5000001001400670006";
            }else if($("#profile").val() == "prod"){
                monthEvent.detail.dispCatNo1 = "5000001001400780006";
            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate7) && eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate8)  ) {
            monthEvent.detail.fvrSeq = "7";
            if($("#profile").val() == "dev"){
                monthEvent.detail.dispCatNo1 = "5000001000100010001";
            }else if($("#profile").val() == "qa"){
                monthEvent.detail.dispCatNo1 = "5000001001400670007";
            }else if($("#profile").val() == "prod"){
                monthEvent.detail.dispCatNo1 = "5000001001400780007";
            }
        }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate8)) {
            monthEvent.detail.fvrSeq = "0";
            monthEvent.detail.dispCatNo1 = "0";
            monthEvent.detail.dispCatNo2 = "0";
        }else{
            monthEvent.detail.fvrSeq = "0";
            monthEvent.detail.dispCatNo1 = "0";
            monthEvent.detail.dispCatNo2 = "0";
        }
    },
    getEventCnt1 : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , dispCatNo : monthEvent.detail.dispCatNo1
              , fvrSeq : monthEvent.detail.fvrSeq
              , evtStrtDt : monthEvent.detail.evtStrtDt
              , evtEndDt : monthEvent.detail.evtEndDt
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180906_2/getEventCnt.do"
              , param
              , monthEvent.detail._callback_getEventCntJson1
        );
    },
    _callback_getEventCntJson1 : function(json){
        if(json.ret == "0"){
            // 스탬프 설정
            if(json.ordCnt == "1"){
                $($(".otk.sbox.stamp li")[0]).addClass("on");
            }else if(json.ordCnt > "1"){
                $(".otk.sbox.stamp li").addClass("on");
            }else{
                $(".otk.sbox.stamp li").removeClass("on");
            }
            
            $(".count1 dd").html(parseInt($(".sbox.stamp li.on").length)-parseInt(json.useCnt));
            $(".count2 dd").html(json.useCnt);
        }else{
            $(".count1 dd").html("0");
            $(".count2 dd").html("0");
        }
    },
    getEventCnt2 : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , dispCatNo : monthEvent.detail.dispCatNo2
              , fvrSeq : monthEvent.detail.fvrSeq
              , evtStrtDt : monthEvent.detail.evtStrtDt
              , evtEndDt : monthEvent.detail.evtEndDt
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180906_2/getEventCnt.do"
              , param
              , monthEvent.detail._callback_getEventCntJson2
        );
    },
    _callback_getEventCntJson2 : function(json){
        if(json.ret == "0"){
            // 스탬프 설정
            if(json.ordCnt == "1"){
                $($(".doub.sbox.stamp li")[0]).addClass("on");
            }else if(json.ordCnt > "1"){
                $(".doub.sbox.stamp li").addClass("on");
            }else{
                $(".doub.sbox.stamp li").removeClass("on");
            }
            $(".count1 dd").html(parseInt($(".sbox.stamp li.on").length)-parseInt(json.useCnt));
            $(".count2 dd").html(json.useCnt);
        }else{
            $(".count1 dd").html("0");
            $(".count2 dd").html("0");
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
            if(parseInt($(".count1 dd").text()) < 1){
                alert("응모가능 기회가 없습니다.");
            }else{
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180906_2/setApplyJson.do" //  최초 1회 위수탁 팝업 호출  and 당일 응모 참여 했는지 조회 
                      , {
                              evtNo : $("input[id='evtNo']:hidden").val() 
                              , fvrSeq : monthEvent.detail.fvrSeq
                              , cnt : $(".sbox.stamp li.on").length
                        }
                      , function(json){ 
                          $(':radio[name="argee1"]:checked').attr("checked", false);
                          $(':radio[name="argee2"]:checked').attr("checked", false);
                          
                            if(json.ret == "0"){   
                                if( json.myTotalCnt  == "0" ) {  //  한번도 응모를 하지 않은경우 
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
                      , fvrSeq : monthEvent.detail.fvrSeq
                      , cnt : $(".sbox.stamp li.on").length
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180906_2/setRotateJson.do"
                  , param
                  , monthEvent.detail._callback_setRotateJosn
            );
        }
    },
    //응모 step3. 응모결과 보여주기
    _callback_setRotateJosn : function(json){
        if(json.ret == "0"){
            $(".mem_id").html(json.custId);
            if(json.winYn=="Y"){
                mevent.detail.eventShowLayer('evtGift');
            }else{
                mevent.detail.eventShowLayer('evtGift_fail');//아쉽지만 : 꽝
            }
            if(parseInt($(".count1 dd").html()) > 0){
                $(".count1 dd").html(parseInt($(".count1 dd").html()) - 1);
                $(".count2 dd").html(parseInt($(".count2 dd").html()) + 1);
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
                  , _baseUrl + "event/20180906_2/getMyWinListJson.do"
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
        var layDim = document.getElementById('eventDimLayer');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
};