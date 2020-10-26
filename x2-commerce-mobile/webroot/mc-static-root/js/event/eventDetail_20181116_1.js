/** 
 * 배포일자 : 2018.11.15
 * 오픈일자 : 2018.11.16 ~ 23
 * 이벤트명 : 블랙프라이데이
     * 블랙절대쿠폰20% 조건없이 쿠폰발급
     * 블랙 중복 7만원이상 1만원할인 쿠폰 발급
     * 임직원 제외
     * 앱 푸쉬 수신동의 고객만
 * */ 

$.namespace("monthEvent.detail"); 
monthEvent.detail = {
    
    selectGiftNum : null, //선택한 상품 번호
        
    init : function(){
        
        // BASE SET
        
        // 1. scroll class 변경 START
        var tabH = $(".treeTab img").height();
        $("#eventTabFixed2").css("height",tabH + "px");

        //var tabHeight =$("#eventTabImg").height() + 203;
        var tabHeight = 203;
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
        // scroll class 변경 END
        
        // 2. base layer close
        $(".eventHideLayer1").click(function(){
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();
        });
        
        $("input[name='gift']").click(function(){
            monthEvent.detail.appPushJsonRadioChk();
        });
    },
    
    /**
     * #####################################################
     * #################### 쿠폰 기능 개발 시작 ######################
     * ##################################################### 
     */
    
    /**
     * 블랙절대쿠폰20% 조건없이 쿠폰발급 (1)
     * 블랙 중복 7만원이상 1만원할인 쿠폰 발급 (2)
     */
    chkDownCoupon : function(obj){
        var couponType = obj; //1 : 블랙절대, 2 : 블랙 중복
        console.log(couponType);
        var cpnNo = "";
        
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
            
            if(couponType == '1'){
                /**블랙절대쿠폰20%
                 * DEV  : C000000000335    g0CzCBI3VCZsApxavdbYQA==
                 * QA :  C000000005172   g0CzCBI3VCbFPg7zNESBtg==
                 * PRD :  C000000006556   g0CzCBI3VCas0vzDYVz9pQ==
                 * */
                
                if($("#profile").val() == "dev"){
                    cpnNo = "g0CzCBI3VCZsApxavdbYQA==";
                }else if($("#profile").val() == "qa"){
                    cpnNo = "g0CzCBI3VCbFPg7zNESBtg==";
                }else if($("#profile").val() == "prod"){
                    cpnNo = "g0CzCBI3VCas0vzDYVz9pQ==";
                }
                
            }else if(couponType == '2'){
                /**블랙중복쿠폰1만원
                 * DEV  : C000000000336    g0CzCBI3VCa6/f5ly82/KA==
                 * QA :   C000000005173     g0CzCBI3VCZkQAlewcQYOA==
                 * PRD :  C000000006557   g0CzCBI3VCZX2GRup8lsLw==
                 * */
                
                if($("#profile").val() == "dev"){
                    cpnNo = "g0CzCBI3VCa6/f5ly82/KA==";
                }else if($("#profile").val() == "qa"){
                    cpnNo = "g0CzCBI3VCZkQAlewcQYOA==";
                }else if($("#profile").val() == "prod"){
                    cpnNo = "g0CzCBI3VCZX2GRup8lsLw==";
                }
                
            }else{
                alert("쿠폰 번호가 없습니다.");
                return;
            }
            
            // coupon download
            monthEvent.detail.downCouponJson(cpnNo);
        }
    },
    
    
    /* 
     * 기능 : 쿠폰  다운로드 
     * 블랙절대쿠폰20% 조건없이 쿠폰발급
     * 블랙 중복 7만원이상 1만원할인 쿠폰 발급
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
    /**
     * #####################################################
     * #################### 응모하기 기능 개발  ######################
     * ##################################################### 
     */
    
    
    
    //1. 앱 푸시 수신 여부 체크 라디오 버튼 체크시
    /**
     * APP PUSH AGREE CHKECK RADIO BTN CHK
     */
    appPushJsonRadioChk : function(){
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
                  , _baseUrl + "event/20181116_1/getAppPushYnCntJson.do"
                  , param
                  , monthEvent.detail._callback_getAppPushYnCntJsonRadioChk
            );
        }
    },
    _callback_getAppPushYnCntJsonRadioChk : function(json){
        if(json.ret == "040"){
            alert(json.message);
        }else{
            if(json.appPushYnCnt == "0"){
                alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
            }else{
                return;
            }
        }
    }, 
    
    /** 응모하기 버튼 누를 때. */
    applyBtn : function(){
        var selectGiftNum = $("input[name=gift]:checked").val();
        
        //1. 선택한 상품 정보 없는 경우
        if(null == selectGiftNum || "" == selectGiftNum){
            alert("경품을 선택해주세요.");
            return;
        }
        //1. 선택한 상품 저장
        monthEvent.detail.selectGiftNum =$("input[name=gift]:checked").val();
        
        //2. 앱 푸시 체크로 넘어감
        monthEvent.detail.appPushJsonApplyChk();
    },
    
    /**
     * APP PUSH AGREE CHKECK apply (응모하기 클릭)
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
                  , _baseUrl + "event/20181116_1/getAppPushYnCntJson.do"
                  , param
                  , monthEvent.detail._callback_getAppPushYnCntJson
            );
        }
    },
    _callback_getAppPushYnCntJson : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
        }else{
            //응모하기로 넘어감.
            monthEvent.detail.getFirstChk();
        }
    },
    
    //2. 참여여부 확인
    
    /**
     * 기능 : 참여여부 확인 1일 1회 참여 가능 체크
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
                var inFvrSeqArr = ["3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27"];
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , inFvrSeqArr : inFvrSeqArr.toString()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20181116_1/setConfirmJson.do"
                      , param
                      , monthEvent.detail._callback_getFirstChkJson
                );
            }
        }
    },
    _callback_getFirstChkJson : function(json){
        
        //variable 
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
    
    
    //2. 위수탁 동의.
    
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
                if("1" == monthEvent.detail.selectGiftNum){ //골드바 선택 - 이벤트 기간동안 즉석당첨
                    monthEvent.detail.instantWin();
                }else{
                    monthEvent.detail.instantWin(); // 원하는 기능으로 입력해야함 : 매일 즉석당첨
                }
            }
        }
    },
    
    //3. 경품 선택 SEQ 확인.
    
    /** 응모 step2. 매일 X명 즉석당첨 */
    instantWin : function(){
        //클릭한 ITEM 셋팅
        var selectGiftNum = monthEvent.detail.selectGiftNum;
        
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
            
            var tempDate = $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8);
            var inFvrSeqArr = ["3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27"]; //참여여부 재확인
            
            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , startDate : tempDate
                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                      , inFvrSeqArr : inFvrSeqArr.toString()
                      , selectGiftNum : selectGiftNum
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181116_1/setApplyJson.do"
                  , param
                  , monthEvent.detail._callback_setApplyJson
            );
        }
    },
    
    //4. 응모완료.
    /** 응모 step3. 응모결과 보여주기 */
    _callback_setApplyJson : function(json){
            
            if(json.ret == "0"){
                if(json.winYn=="Y"){
                    $(".mem_id").text(json.tgtrSeq);
                    mevent.detail.eventShowLayer('evtGcG'+monthEvent.detail.selectGiftNum);
                }else{
                    mevent.detail.eventShowLayer('evtGcF');//아쉽지만 : 꽝
                }
            }else{
                if(json.ret == "013"){ // 이미응모한사람 
                    alert(json.message);
                }else{
                    alert(json.message);
                }
            }
    },
    

    
    
    
    
    
    
    
    
    // #### common js START ####
    
    
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
            
            var inFvrSeqArr = ["3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27"]; //참여여부 재확인
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
    
    // 레이어 숨김
    eventCloseLayer : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
//    
//    // 위수탁 레이어 숨김
//    eventCloseLayer1 : function(){
//        $(".eventLayer").hide();
//        $("#eventDimLayer").hide();
//        location.reload();//새로고침
//    },
//    
//    // 레이어 숨김
//    eventCloseLayer3 : function(){ 
//        location.reload();//새로고침
//    },
    
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
    
    // showLayer basse
    eventShowLayer :function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
    
    // #### common js END ####

};
