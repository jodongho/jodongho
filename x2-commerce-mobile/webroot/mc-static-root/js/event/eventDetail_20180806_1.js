$.namespace("monthEvent.detail"); 
monthEvent.detail = {
        
    totalHotCnt : "0",
    possibleHotCnt : "0",
    totalOrdCnt : "0",
    firstYn : "Y",
    sbscDayCnt : "0",
    isExecute : false,
        
    init : function(){
        
        if(common.isLogin()){
            // HOT 경품 응모권(구매횟수), 경품 사용 건수 확인
            monthEvent.detail.myHotCntChkJson();
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
        
    },
    
    /* 장바구니 쿠폰 : 구매건수(20180101~20180812) */
    myOrdCntChkJson : function(){
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
            if(common.isLogin()){
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180806_1/myOrdCntChkJson.do"
                      , {
                              evtNo : $("input[id='evtNo']:hidden").val()
                        }
                      , monthEvent.detail._callback_myOrdCntChkJson
                );
            }else{
                //구매건수
                monthEvent.detail.totalHotCnt = "0";
            }
        }
    },
    _callback_myOrdCntChkJson : function(json){
        if(json.ret == "0"){
            //나의 총 응모권
            monthEvent.detail.totalOrdCnt = json.totalOrdCnt;
            if(monthEvent.detail.totalOrdCnt == "0"){
                alert("온라인몰 구매내역이 없습니다. 구매 후 발급 받아주세요.");
            } else {
                //장바구니 중복 할인쿠폰 다운
                //qa
                //monthEvent.detail.downOrdCouponJson('g0CzCBI3VCaf9zy9JOUIAw==');
                monthEvent.detail.downOrdCouponJson('g0CzCBI3VCb6D9U4Tk2sug==');
            }
        }else{
            alert(json.message);
        }
    },
    
    /* HOT경품뽑기 : 총응모가능수, 응모한 횟수, 일일응모횟수 */
    myHotCntChkJson : function(){
        if(common.isLogin()){
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180806_1/myHotCntChkJson.do"
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
            if(json.totHotCnt.numberFormat() > 21){
                monthEvent.detail.totalHotCnt = 21;
            } 
            $("#totHotCnt").text(monthEvent.detail.totalHotCnt);
            
            //응모 가능 횟수
            var possibleHotCnt = monthEvent.detail.totalHotCnt.numberFormat() - json.entryHotCnt.numberFormat();
            monthEvent.detail.possibleHotCnt = possibleHotCnt.toString();
            $("#possibleHotCnt").text(possibleHotCnt);
            
            //응모한 횟수
            $("#entryHotCnt").text(json.entryHotCnt);
        }else{
            alert(json.message);
        }
    },
    
    /* 누적구매금액확인*/
    checkMyEventBuyAmt:function(){
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
                  , _baseUrl + "event/20180806_1/checkMyEventBuyAmtJson.do"
                  , param
                  , monthEvent.detail._callback_checkMyEventBuyAmtJson
            );
        }
    },
    _callback_checkMyEventBuyAmtJson : function(json) {
        if(json.ret == "0"){
            var myTotalAmt = json.myTotalAmt.numberFormat();
            monthEvent.detail.totalAmt =  json.myTotalAmt;
            $("#rndmVal").text(myTotalAmt + "원");
        }else{
            alert(json.message);
        }
    },
    //////////////////////////////////////////////////////////////////////
    
    
    /* 쿠폰 자동 발급 팝업 */
    popLayerCouponRate:function(fvrSeq){
        
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
            if(!mevent.detail.checkRegAvailable()){
                return;
            }
            
           
            
            //참여여부 체크
            monthEvent.detail.getRateFirstChk();
        }
    },

    /* 나의 쿠폰 할인율 쿠폰 응모여부 확인 */
    getRateFirstChk : function(){
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
                      , _baseUrl + "event/20180806_1/getFirstChkJson.do"
                      , param
                      , this._callback_getFirstChkJson
                );
            }
            
        }
    },    
    _callback_getFirstChkJson : function(json) {
        if(json.ret == "0"){
            // 중복 클릭 방지
            if (monthEvent.detail.isExecute == false) {
                monthEvent.detail.downCouponRate();
            }else if (monthEvent.detail.isExecute == true) {
                return;
            }
        }else{
            //이미 참여하셨습니다.
            mevent.detail.eventShowLayer('evtCoupon_fail');
        }
    },
    
    /* 쿠폰 자동 발급 팝업 */
    downCouponRate:function(fvrSeq){
        /* 누적금액확인*/
        var totalPayAmt = $("#rndmVal").text().replace("원","").trim();
         if(totalPayAmt == null || totalPayAmt == "" ){
             alert("‘나의 누적주문금액’을 클릭하여 먼저 확인해주세요!");
             return;
         }
        if(monthEvent.detail.totalAmt == 0 ){
             alert("주문금액이 0원인 사람은 첫만남 NEW 탭에서 첫구매 쿠폰을 확인해주세요!");
             return;
        }
        // 중복 클릭 방지
        monthEvent.detail.isExecute  =  true;
        //쿠폰 발급
        var tmpTotalPayAmt = monthEvent.detail.totalAmt;
        if(tmpTotalPayAmt > 0 && tmpTotalPayAmt < 100000 ){
            //25%
            //qa
            //monthEvent.detail.downCouponJson('g0CzCBI3VCaAHgSrUtleqQ==');
            monthEvent.detail.downCouponJson('g0CzCBI3VCbfxj4tHCvf4Q==');
        } else if(tmpTotalPayAmt >= 100000 && tmpTotalPayAmt < 200000 ){
            //30%
            //qa
            //monthEvent.detail.downCouponJson('g0CzCBI3VCZeuJVb6dir6g==');
            monthEvent.detail.downCouponJson('g0CzCBI3VCYM+X2u5gf5BQ==');
        } else if(tmpTotalPayAmt >= 200000){
            //35%
            //qa
            //monthEvent.detail.downCouponJson('g0CzCBI3VCa+znVE3ABL1A==');
            monthEvent.detail.downCouponJson('g0CzCBI3VCbBuXgR/ecXxg==');
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
                        , this._callback_downCouponJson
                 );
            }
        }
    },
    _callback_downCouponJson : function(json) {
        if(json.ret == '0'){
            var tmpTotalPayAmt = monthEvent.detail.totalAmt;
            //쿠폰 발급 팝업
            if(tmpTotalPayAmt > 0 && tmpTotalPayAmt < 100000 ){
                //25% 
                mevent.detail.eventShowLayer('evtCoupon1');
            } else if(tmpTotalPayAmt >= 100000 && tmpTotalPayAmt < 200000 ){
                //30%
                mevent.detail.eventShowLayer('evtCoupon2');
            } else if(tmpTotalPayAmt >= 200000){
                //35%
                mevent.detail.eventShowLayer('evtCoupon3');
            }
        }
    },
    
    /* 
     * 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    downOrdCouponJson : function(cpnNo) {
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
    
    goMyPage : function(){        
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }else{
            common.link.commonMoveUrl('mypage/getCouponList.do');
        }
    },
    
    /* HOT 경품 뽑기 */
    chkHotEvent : function(){
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
            if(parseInt($("#possibleHotCnt").text()) <= 0){
                alert("응모 가능 기회가 없습니다.");
            }else{                
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                }
                
                $(':radio[name="argee1"]:checked').attr("checked", false);
                $(':radio[name="argee2"]:checked').attr("checked", false);
                
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180806_1/getHotFirstChkJson.do"
                      , param
                      , this._callback_geHotFirstChkJson
                );                
            }
        }
    },    
    _callback_geHotFirstChkJson : function(json) {        
        if(json.ret == "0"){
            monthEvent.detail.applyJson();
        }else{
            monthEvent.detail.firstYn = "N";        //최초 참여 여부 변수값
            if(json.sbscDayCnt.numberFormat() < 3){
                monthEvent.detail.sbscDayCnt = json.sbscDayCnt;
                monthEvent.detail.goodsEntry();        //즉석당첨 경품 응모
            }else{
                alert("하루 최대 3번만 응모가능합니다.");
            }
        }
    },
    
    
    
    
    // 룰렛 전 위수탁 확인 
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
            if(parseInt($("#possibleHotCnt").text()) <= 0){
                alert("응모 가능 기회가 없습니다.");
            }else{
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180806_1/setApplyJson.do" //  최초 1회 위수탁 팝업 호출  and 당일 룰렛 참여 했는지 조회 
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
    
    /* 룰렛 돌리기 */
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
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180806_1/setRotateJson.do"
                  , param
                  , monthEvent.detail._callback_setRotateJosn
            );
        }
    },
    _callback_setRotateJosn : function(json){
        if(json.ret == "0"){
            var resultItem = json.fvrSeq;

            if(resultItem == "5") { // 
                $(".mem_id").html(json.custId);
                mevent.detail.eventShowLayer('evtGift1')
            }else if(resultItem == "6") { //
                $(".mem_id").html(json.custId);
                mevent.detail.eventShowLayer('evtGift2');
            }else if(resultItem == "7") { //
                $(".mem_id").html(json.custId);
                mevent.detail.eventShowLayer('evtGift3');
            }else if(resultItem == "8") { //
                $(".mem_id").html(json.custId);
                mevent.detail.eventShowLayer('evtGift4');
            }else  if(resultItem == "9") { //
                $(".mem_id").html(json.custId);
                mevent.detail.eventShowLayer('evtGift5');
            }else  if(resultItem == "10") { //
                $(".mem_id").html(json.custId);
                mevent.detail.eventShowLayer('evtGift6');
            }else  if(resultItem == "11") { //
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
                //mevent.detail.eventShowLayer('evtFail2');
                alert(json.message);
            }else{
                alert(json.message);
            }
        }
    },
    
    
    
    
    
    
    /* 위수탁 동의 팝업 */    
//    popLayerConfirm : function(){
//        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
//            if(confirm("모바일 앱에서만 응모 가능합니다.")){
//                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
//            }else{
//                return;
//            }
//        }else{
//            if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
//                monthEvent.detail.eventCloseLayer1();
//                return;
//            }
//            if("Y" != $(':radio[name="argee1"]:checked').val()){
//                alert("'개인정보 수집동의'에 동의 해주셔야 응모 가능합니다.");
//                //monthEvent.detail.eventCloseLayer1();
//                return;
//            }
//            if("Y" != $(':radio[name="argee2"]:checked').val()){
//                alert("'개인정보 처리 위탁'에 동의해주셔야 응모 가능합니다.");
//                //monthEvent.detail.eventCloseLayer1();
//                return;
//            }
//            
//            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
//                mevent.detail.eventCloseLayer();
//                monthEvent.detail.goodsEntry();        //즉석당첨 경품 응모
//            }
//        }
//    },
    
    /* 즉석당첨 경품 응모 */    
//    goodsEntry : function(){
//        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
//            if(confirm("올리브영 앱에서 참여해주세요.")){
//                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
//            }else{
//                return;
//            }
//        }else{     
//            if(!mevent.detail.checkLogin()){
//                return;
//            }
//            if(!mevent.detail.checkRegAvailable()){
//                return;
//            }
//            
//            
//            /* 수신동의 값 설정 */
//            var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
//            var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();
//            
//            if(monthEvent.detail.sbscDayCnt.numberFormat() < 3){
//                mbrInfoUseAgrYn =  "Y";
//                mbrInfoThprSupAgrYn =  "Y";
//            }
//            
//            var param = {
//                        evtNo : $("input[id='evtNo']:hidden").val()
//                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
//                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
//            };
//            common.Ajax.sendJSONRequest(
//                    "GET"
//                  , _baseUrl + "event/20180806_1/setRotateJson.do"
//                  , param
//                  , monthEvent.detail._callback_setRotateJosn
//            );
//        }
//    },
//    _callback_setRotateJosn : function(json){
//        if(json.ret == "0"){
//            var resultItem = json.fvrSeq;
//
//            if(resultItem == "5") { // 
//                $(".mem_id").html(json.custId);
//                mevent.detail.eventShowLayer('evtGift1')
//            }else if(resultItem == "6") { //
//                $(".mem_id").html(json.custId);
//                mevent.detail.eventShowLayer('evtGift2');
//            }else if(resultItem == "7") { //
//                $(".mem_id").html(json.custId);
//                mevent.detail.eventShowLayer('evtGift3');
//            }else if(resultItem == "8") { //
//                $(".mem_id").html(json.custId);
//                mevent.detail.eventShowLayer('evtGift4');
//            }else  if(resultItem == "9") { //
//                $(".mem_id").html(json.custId);
//                mevent.detail.eventShowLayer('evtGift5');
//            }else  if(resultItem == "10") { //
//                $(".mem_id").html(json.custId);
//                mevent.detail.eventShowLayer('evtGift6');
//            }else  if(resultItem == "11") { //
//                mevent.detail.eventShowLayer('evtGift_fail');
//            }else { // 다음기회에
//                mevent.detail.eventShowLayer('evtGift_fail');
//            }
//            
//            //남은 응모 횟수
//            $("#possibleHotCnt").text(parseInt($("#possibleHotCnt").text()) - 1);
//            //사용한 횟수
//            $("#entryHotCnt").text(parseInt($("#entryHotCnt").text()) + 1);
//        }else{
//            if(json.ret == "013"){ // 이미응모한사람 
//                //mevent.detail.eventShowLayer('evtFail2');
//                alert(json.message);
//            }else{
//                alert(json.message);
//            }
//        }
//    },
    
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
                  , _baseUrl + "event/20180806_1/getMyWinListJson.do"
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
        alert("개인정보 위수탁 약관 동의 후 응모 가능합니다.");
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
        location.reload();      //위수탁 동의 x일 때 스크롤 맨위로 가게하기 위해 페이지 새로고침
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