$.namespace("monthEvent.detail");
monthEvent.detail = {

    snsInitYn : "N",
    rndmVal : "",
    mbrNm : "",
        
    init : function(){
        $(".mnet_ticket").html("<input type='text' id='rndmVal' readonly>");
        if(common.isLogin()){
           //  엠넷 발급여부 확인 (내 난수 쿠폰 생성여부 조회 확인)
            monthEvent.detail.getMyMnetCpnChkJson();
        };

        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });
        
        /* 유의사항 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
        // 나의 당첨내역
        $("div#eMylist").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
            /* 당첨이력조회 */
            monthEvent.detail.getBigGiftMyWinList();
            mevent.detail.eventShowLayer("evtPopWinDetail");
        });
    },

    /* 당첨내역 확인 */
    getBigGiftMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getStmpMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },
    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2'>당첨이력이 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("tbody#myWinListHtml").html(myWinListHtml);
        }else{
            alert(json.message);
        }
    },
   
    /* 룰렛 돌리기 */
    setRotate : function(){
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
                  , _baseUrl + "event/20180514/setRotateJson.do"
                  , param
                  , monthEvent.detail._callback_setRotateJosn
            );
        }
    },
    _callback_setRotateJosn : function(json){
        if(json.ret == "0"){
            var resultItem = json.fvrSeq;
            var resultItemCount = json.itemCount;
            var revision = 360/resultItemCount;
            
            var duration = 2500; // 3500;
            var pieAngle = 360*3;
            var angle = 0;
            
            angle = (pieAngle - ((resultItem*revision)-(revision/2)));

            
            console.log(angle);
            
            
            $("img#roulette_base").rotate({
                duration: duration,
                animateTo: angle,
                callback: function(){
                    if(resultItem == "1") { // 20%
                        mevent.detail.eventShowLayer('evtGiftT1_3');
                    }else if(resultItem == "2") { // 25%
                        mevent.detail.eventShowLayer('evtGiftT1_2');
                    }else if(resultItem == "3") { // 다음기회에
                        mevent.detail.eventShowLayer('evtFail1');
                    }else if(resultItem == "4") { // 30%
                        mevent.detail.eventShowLayer('evtGiftT1_1');
                    }else  if(resultItem == "5") { // 15%
                        mevent.detail.eventShowLayer('evtGiftT1_4');
                    }else { // 다음기회에
                        mevent.detail.eventShowLayer('evtFail1');
                    }
                }
            });
        }else{
            if(json.ret == "013"){ // 이미응모한사람 
                mevent.detail.eventShowLayer('evtFail2');
            }else{
                alert(json.message);
            }
        }
    },
    
    /* 
     * 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    downBeautyCouponJson : function(cpnNo) {
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
    
    
   /* 회전목마 */
    applyGetBigGiftJson:function(){
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
            
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180514/applyGetBigGiftJson.do" // ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                    }
                  , function(json){ 
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                        if(json.ret == "0"){
                            if( json.myTotalCnt  == "0" ) {  // 매일1회 참여가능하며 처음 클릭 시  위수탁 받기 
                                $("div#Confirmlayer1").attr("onClick", "monthEvent.detail.applyGetBigGiftInfo(' " + json.myTotalCnt + "');");
                                monthEvent.detail.eventShowLayer1('eventLayerPolice2');
                            }else {
                                monthEvent.detail.applyGetBigGiftInfo(json.myTotalCnt);
                            }
                        }else{
                            alert(json.message);
                        }
                    }
            );
            
        }
    },
    
    applyGetBigGiftInfo : function(myTotalCnt){
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
           
           /* 수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
           var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
           var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();
           
           if(myTotalCnt == 0 ){ 
               if("Y" != mbrInfoUseAgrYn){
                   monthEvent.detail.eventCloseLayer1();
                   return;
               }
               if("Y" != mbrInfoThprSupAgrYn){
                   monthEvent.detail.eventCloseLayer1();
                   return;
               }
           }else {
               mbrInfoUseAgrYn = "Y";
               mbrInfoThprSupAgrYn = "Y";
           }

           monthEvent.detail.eventCloseLayer2();
           
          var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180514/applyGetBigGiftInfo.do"  
                  , param
                  , monthEvent.detail._callback_applyGetBigGiftInfoJson
            ); 
        }
    },
    
    _callback_applyGetBigGiftInfoJson : function(json){
         if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            // 1234 성공 5 꽝
            if(json.fvrSeq == "1"){ // 여행상품권 20만원상당
               mevent.detail.eventShowLayer('evtGiftT2_1'); 
            }else  if(json.fvrSeq == "2"){ // CGV 2만원권
                mevent.detail.eventShowLayer('evtGiftT2_2'); 
            }else  if(json.fvrSeq == "3"){ // 포인트 5000
                mevent.detail.eventShowLayer('evtGiftT2_3'); 
            }else  if(json.fvrSeq == "4"){ //  투썸 아메리카노
                mevent.detail.eventShowLayer('evtGiftT2_4'); 
            }else  if(json.fvrSeq == "5"){ // 꽝
                mevent.detail.eventShowLayer('evtFail1'); 
            }   
        }else{
            alert(json.message);
        }
    },
    
    
    
    /**
     * 내 엠넷이용권 난수쿠폰 정보 확인
     */
    getMyMnetCpnChkJson : function(){
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        var param = {
                fvrSeq : "6"
                , evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180514/getMyMnetCpnChkJson.do"
              , param
              , this._callback_getMyMnetCpnChkJson
        );
    },
    _callback_getMyMnetCpnChkJson : function(json) {
        if(json.ret == "0"){
            $("#mnet01").css("display", "none");
            $("#rndmVal").css("display", "block");
            //$("#rndmValtxt").val(json.rndmVal);
            $(".mnet_ticket").html("<input type='text' id='rndmVal' readonly value=" + json.rndmVal  + ">");
            monthEvent.detail.rndmVal = json.rndmVal;
        }
    },
    
    /**
     * 엠넷이용권 난수쿠폰 발급 이벤트 참여여부 확인 
     */
    getMnetCpnChkJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180514/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여 가능합니다.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                if(typeof fvrSeq == "undefined" || fvrSeq == ""){
                    alert("쿠폰 정보가 없습니다.");
                    return;
                }
                var param = {
                        fvrSeq : "6"
                      , evtNo : $("input[id='evtNo']:hidden").val()
                };
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180514/getMnetCpnChkJson.do"
                      , param
                      , this._callback_getMnetCpnChkJson
                );
            }            
        }        
    },
    _callback_getMnetCpnChkJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.getMnetCpnDownJson(); // 엠넷이용권 난수쿠폰 발급
        }else{
            alert(json.message);
        }
    },
    
    /**
     * 엠넷이용권 난수쿠폰 발급
     */
    getMnetCpnDownJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180514/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여 가능합니다.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                if(typeof fvrSeq == "undefined" || fvrSeq == ""){
                    alert("쿠폰 정보가 없습니다.");
                    return;
                }
                var param = {
                        fvrSeq : "6"
                      , evtNo : $("input[id='evtNo']:hidden").val()
                };
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180514/getMnetCpnDownJson.do"
                      , param
                      , this._callback_getMnetCpnDownJson
                );
            }            
        }        
    },
    _callback_getMnetCpnDownJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.getMyMnetCpnChkJson(); // 발급된쿠폰조회 
        }else{
            if(json.ret == "051"){
                mevent.detail.eventShowLayer('evtSoldout');
            }else{
                alert(json.message);
            }
        }
    },
    
    /* 카카오톡으로 이용권 번호 보내기 */
    pushKakaotalk : function(){

        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }else{
            if(monthEvent.detail.rndmVal == ""){
                alert("구매고객만 가능합니다.");
            }else{
                if(monthEvent.detail.mbrNm == ""){
                    monthEvent.detail.getMbrNmJson(); // 사용자명확인  
                    return;
                }else{
                    var title = "[Oliveyoung]\n("+monthEvent.detail.mbrNm+")님 M.NET 이용권번호가 도착했습니다!\n\n★ M.NET 이용권번호\n    ("+monthEvent.detail.rndmVal+")\n\n★ 자세한 등록방법은 이벤트 페이지에서 확인해주세요.";
                    var img = "https:"+_cdnImgUrl+"contents/201805/14big5/big5_mnet_img.jpg";
                    var snsShareUrl = _baseUrl + "E.do?evtNo="+$("#evtNo").val();
                  
                    //  https-> http로 변경
                   // var imgUrl = img.replaceAll("https:", "http:");

                    if(monthEvent.detail.snsInitYn == "N"){
                        common.sns.init(img, title, snsShareUrl);
                        monthEvent.detail.snsInitYn = "Y";
                    }
                    
                    Kakao.Link.sendTalkLink({
                        label: title,
                        image : {
                            src : img,
                            width : 550,
                            height : 550
                        },
                        webButton : {
                            text : '올리브영에서 보기',
                            url : snsShareUrl
                        }
                    });
                }
            }
        }
    },
    
    getMbrNmJson : function(){
        var param = "";
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180514/getMbrNmJson.do"
              , param
              , this._callback_getMbrNmJson
        );
    },    
    _callback_getMbrNmJson : function(json) {
        monthEvent.detail.mbrNm = json.mbrNm;
        monthEvent.detail.pushKakaotalk();
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

    // 레이어 숨김
    eventCloseLayer : function(){ 
       // alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){ 
        alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer").hide(); 
        location.reload();      //위수탁 동의 x일 때 스크롤 맨위로 가게하기 위해 페이지 새로고침
    },
    
    // 레이어 숨김
    eventCloseLayer2 : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer").hide();  
    },
    
    
}