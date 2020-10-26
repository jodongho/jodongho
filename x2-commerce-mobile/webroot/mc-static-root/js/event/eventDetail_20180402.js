$.namespace("monthEvent.detail");
monthEvent.detail = {
	init : function(){
	    $(".input_num").html("<input type='text' id='rndmVal' placeholder='응모번호를 입력해주세요.'>");
	    if(common.isLogin()){
	       // 촛불 활성화 필요 (로드할때도 촛불활성화필요)
	        monthEvent.detail.getMyLigthCnt();
        };
	    
	    /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });

	},
	
	/* 첫번째탭-첫번째생일턱 참여 이력 */
	// 조명 갯수
    getMyLigthCnt : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180402/getMyEventPartListJson.do"
              , param
              , monthEvent.detail._callback_getMyLigthCntJson
        );
    },
    _callback_getMyLigthCntJson : function(json){
        if(json.ligthCnt > 0){
            var varStr = json.ligthCnt.toString();
            if(varStr == "1"){
                var htmlStr = "";
                htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire01.gif' alt='켜진초'>";
                $("div.cake_fire").find("span").html(htmlStr);
            }else if(varStr == "2"){
                var htmlStr = "";
                htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire02.gif' alt='켜진초'>";
                $("div.cake_fire").find("span").html(htmlStr);
            }else if(varStr == "3"){
                var htmlStr = "";
                htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire03.gif' alt='켜진초'>";
                $("div.cake_fire").find("span").html(htmlStr);
            }else if(varStr == "4"){
                var htmlStr = "";
                htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire04.gif' alt='켜진초'>";
                $("div.cake_fire").find("span").html(htmlStr);
            }
        }else {
            var htmlStr = "";
            htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire00.gif' alt='켜진초'>";
            $("div.cake_fire").find("span").html(htmlStr);
        }
    },

	
	/* 두번째탭 - 최고의고객감사Award 응모  */
    applyAwardslClick : function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180402/checkapplyAwards.do" // ID당 각각1회신청가능 , 임직원제외 체크 
              , {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : fvrSeq
                }
              , function(json){ 
                  $(':radio[name="argee1"]:checked').attr("checked", false);
                  $(':radio[name="argee2"]:checked').attr("checked", false);
                  
                    if(json.ret == "0"){
                        $("div#Confirmlayer1").attr("onClick", "monthEvent.detail.addApplyAwardsInfo('" + fvrSeq + "');");
                        //mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
                        mevent.detail.eventShowLayer('eventLayerPolice');
                    }else{
                        alert(json.message);
                    }
                }
        );
    }, 

    
    /**
     *  두번째탭 - 최고의고객감사Award 응모 처리 
     */
    addApplyAwardsInfo : function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        
        if("Y" != $(':radio[name="argee1"]:checked').val()){
            alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
            return;
        }
        if("Y" != $(':radio[name="argee2"]:checked').val()){
            alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
            return;
        }
        
        mevent.detail.eventCloseLayer();
        
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : fvrSeq
              , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
              , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180402/addApplyAwardsInfo.do"
              , param
              , monthEvent.detail._callback_addApplyAwardsInfoJson
        );
      
    },
    
    _callback_addApplyAwardsInfoJson : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            alert("신청되셨습니다. 4월 18일 당첨자 발표 게시판에서 당첨내역을 확인하세요!");
        }else{
            alert(json.message);
        }
    },
    
    // 레이어 숨김
    eventCloseLayer : function(){ 
       // alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },

    /*
     * 첫번째 탭 시작 .............. 
     * 첫번째 생일턱 - 생일촛불켜면 선물 100% 뿜뿜! - 생일촛불켜기 버튼 
     */
    turnCandleClick : function(){
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
            
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180402/checkOneDayTurnCandle.do" // ID 당 1일 1회 참여가능 
                  , {
                        evtNo : $("input[id='evtNo']:hidden").val()
                    }
                  , function(json){ 
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                      
                        if(json.ret == "0"){
                            if( json.myTotalApplyCnt  == "0" ) { 
                                //$("div#Confirmlayer1").attr("onClick", "monthEvent.detail.oneDayTurnCandleInfo('" + fvrSeq + "');");
                                $("div#Confirmlayer1").attr("onClick", "monthEvent.detail.oneDayTurnCandleInfo('" + json.myTotalApplyCnt + "');");
                                //mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
                                mevent.detail.eventShowLayer('eventLayerPolice');
                            }else {
                                monthEvent.detail.oneDayTurnCandleInfo(json.myTotalApplyCnt);
                            }
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    }, 
    
    /**
     *  첫번째탭 - 생일촛불켜면 선물 100% 뿜뿜! - 생일촛불켜기 즉성당첨확인 
     */
    oneDayTurnCandleInfo : function(myTotalApplyCnt){

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
           
            /* 수신동의  myTotalApplyCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
            var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
            var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();
            
            if(myTotalApplyCnt == 0 ){ 
                if("Y" != mbrInfoUseAgrYn){
                    alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                    return;
                }
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }

            mevent.detail.eventCloseLayer();
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn : mbrInfoThprSupAgrYn
            };
            
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180402/addOneDayTurnCandleInfo.do"  // 아이템별 랜덤당첨처리 
                  , param
                  , monthEvent.detail._callback_addOneDayTurnCandleInfoJson
            );
        }
    },
    
    _callback_addOneDayTurnCandleInfoJson : function(json){
         if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            if(json.winYn=="Y"){
                switch (json.fvrSeq) {
                case "1":
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire01.gif' alt='켜진초'>";
                    $("div.cake_fire").find("span").html(htmlStr);
                    mevent.detail.eventShowLayer('evtGift4');
                    break;
                case "2":
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire02.gif' alt='켜진초'>";
                    $("div.cake_fire").find("span").html(htmlStr);
                    mevent.detail.eventShowLayer('evtGift1');
                    break;
                case "3":
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire03.gif' alt='켜진초'>";
                    $("div.cake_fire").find("span").html(htmlStr);
                    mevent.detail.eventShowLayer('evtGift2');
                    break;
                case "4":
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire04.gif' alt='켜진초'>";
                    $("div.cake_fire").find("span").html(htmlStr);
                    mevent.detail.eventShowLayer('evtGift3');
                    break;
                default:
                    break;
                }
            }else {
                switch (json.fvrSeq) {
                case "1":
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire01.gif' alt='켜진초'>";
                    $("div.cake_fire").find("span").html(htmlStr);
                    mevent.detail.eventShowLayer('evtGiftFail');
                    break;
                case "2":
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire02.gif' alt='켜진초'>";
                    $("div.cake_fire").find("span").html(htmlStr);
                    mevent.detail.eventShowLayer('evtGiftFail');
                    break;
                case "3":
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire03.gif' alt='켜진초'>";
                    $("div.cake_fire").find("span").html(htmlStr);
                    mevent.detail.eventShowLayer('evtGiftFail');
                    break;
                case "4":
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201804/02birth1st/birth1st_mc_fire04.gif' alt='켜진초'>";
                    $("div.cake_fire").find("span").html(htmlStr);
                    mevent.detail.eventShowLayer('evtGiftFail');
                    break;
                default:
                    break;
                }
            }
           // $("#resultImg").attr("src",srcBaseUrl+imgFileNm);
           // mevent.detail.eventShowLayer('eventLayerWinner');
        }else{
            alert(json.message);
        }
    },
    
    /* 첫번째탭 - 첫번째 생일턱 - 나의당첨내역*/
    /* 당첨이력 팝업 */
    getMyWinPopup : function(num){
        if(!mevent.detail.checkLogin()){
            return;
        }
        
        /* 당첨내역 확인 */
        if(num == '01'){
            monthEvent.detail.getMyWinList();
            mevent.detail.eventShowLayer('evtPopWinDetail1');
        }else { 
            monthEvent.detail.get2MyWinList();   
            mevent.detail.eventShowLayer('evtPopWinDetail2');
        }

    },
    
    /* 당첨내역 확인 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180402/getMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );
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
        }else{
            alert(json.message);
        }
    },
    
    /* 당첨내역 확인 */
    get2MyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180402/get2MyWinListJson.do"
              , param
              , monthEvent.detail._callback_get2MyWinListJson
        );
    },
    
    _callback_get2MyWinListJson : function(json){
        if(json.ret == "0"){
            if(json.myEvtWinList.length > 0){
                var myWinListHtmlPlus = "";

                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtmlPlus += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
                
                if(myWinListHtmlPlus != ""){
                    $("tbody#myWinListHtmlPlus").html(myWinListHtmlPlus);
                }
            }
        }else{
            alert(json.message);
        }
    },
    
    /**
     *  첫번째탭 - 생일촛불켜면 선물 100% 뿜뿜! - 세번째 생일턱 응모번호로 경품받을 수 있는지 체크 
     *  CC_CPN_RNDM_INFO 테이블에서 난수번호 있는지 체크 
     *  전체 아이템 확률 돌려서 경품 당첨 체크 
     *  이벤트 응모 테이블(두개) 인서트 
     *  //// 
     *  응모 입력시 난수번호 맞는지 체크 
     *  ID당 1개의 응모번호만 응모했는지 체크 
     *  위수탁 팝업노출
     *  동의하면 
     *  전체아이템 확률 돌려서 경품 당첨 확인 (4개중 무조건 당첨)
     *  이벤트 응모테이블두개에 인서트 
     *  그게 맞는 경품 당첨 팝업 노출 
     */
    entryNumGetPrizesClick : function(){
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

           if(common.isEmpty($('#rndmVal').val())){
                alert("응모번호를 입력해주세요.");
                return;
           } 

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180402/checkEntryNumGetPrizes.do" // ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , cpnNo : $("input[id='rncpnNo']:hidden").val()
                        , rndmVal :  $('#rndmVal').val()
                    }
                  , function(json){ 
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                        if(json.ret == "0"){
                            //$("div#Confirmlayer1").attr("onClick", "monthEvent.detail.oneDayTurnCandleInfo('" + fvrSeq + "');");
                            $("div#Confirmlayer1").attr("onClick", "monthEvent.detail.entryNumGetPrizes('" + rndmVal + "');");
                            //mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
                            mevent.detail.eventShowLayer('eventLayerPolice');
                        }else{
                            $('#rndmVal').val(''); // 초기화 
                            alert(json.message);
                        }
                    }
            );
        }
    },
    
    /**
     *  첫번째탭 - 생일촛불켜면 선물 100% 뿜뿜!- 세번째 생일턱 응모번호로 경품받기 
     */
    entryNumGetPrizes : function(rndmVal){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 신청 가능합니다.")){
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

            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }
            
            mevent.detail.eventCloseLayer();
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , cpnNo : $("input[id='rncpnNo']:hidden").val()
                  , rndmVal :  $('#rndmVal').val()
                  , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180402/entryNumGetPrizes.do"  
                  , param
                  , monthEvent.detail._callback_entryNumGetPrizesInfoJson
            );
        }
    },
    
    _callback_entryNumGetPrizesInfoJson : function(json){
         if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
           
            switch (json.fvrSeq) {
            case "5":
                mevent.detail.eventShowLayer('evtGift6');
                break;
            case "6":
                mevent.detail.eventShowLayer('evtGift5');
                break;
            case "7":
                mevent.detail.eventShowLayer('evtGift7');
                break;
            case "8":
                mevent.detail.eventShowLayer('evtGift8');
                break;
            default:
                break;
            }
            $('#rndmVal').val(''); // 초기화 
        }else{
            alert(json.message);
        }
    },
    
}