$.namespace("monthEvent.detail");
monthEvent.detail = { 

    totalAmt : "0",
    firstYn : "",
    firstChk : "",
    divChk : "",
    couponChk : "",
    cpnNo : "", 
    mbrInfoUseAgrYnChk : "N",
    mbrInfoThprSupAgrYnChk : "N",
    doubleSubmitFlag : false,

    init : function(){
        /* 닫기  */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();            
        });
        
        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            alert("동의 후 참여 가능합니다.");
            monthEvent.detail.eventCloseLayer1();
        });
    },
    
    /* 올롸잇 상품 쿠폰 받기 */
    allRightCoupon : function(chk){
        
        monthEvent.detail.couponChk = chk;
        
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
                cpnNo = "g0CzCBI3VCY1k1qDkO/LcA==";
            }else if($("#profile").val() == "qa"){
                cpnNo = "g0CzCBI3VCbfrtnZ6XTPMA==";
            }else if($("#profile").val() == "prod"){
                cpnNo = "g0CzCBI3VCagZSXskgtMiQ==";
            }
            
            monthEvent.detail.downCouponJson(cpnNo);
        }
    },
    
    /**
     * 중복서브밋 방지
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
    
    /* 올롸잇 중복할인 쿠폰 받기 */
    allRightOverlapCoupon : function(chk){
        
        monthEvent.detail.couponChk = chk;
        
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
                cpnNo = "g0CzCBI3VCYNm52/AyErTQ==";
            }else if($("#profile").val() == "qa"){
                cpnNo = "g0CzCBI3VCZiV7CLAbRHvw==";
            }else if($("#profile").val() == "prod"){
                cpnNo = "g0CzCBI3VCaY/xRSL1r+NA==";
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
    
    /* 코타키나발루 여행 응모하기 : 누적구매금액확인
     * 이력 체크 : 기간 내의 실 결제금액 합산(배송비, 쿠폰할인금액 제외)
     * */
    checkMyEventBuyAmt:function(chk){
        
        monthEvent.detail.divChk = chk; // 1이면 여행응모, 2이면 기프티콘
        
        // 웹인지 앱인지 체크
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
            if(!mevent.detail.checkRegAvailable()){ // 이벤트 응모 기간 체크
                return;
            }

            var param = {
                      evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180830_1/checkMyEventBuyAmtJson.do"
                  , param
                  , monthEvent.detail._callback_checkMyEventBuyAmtJson
            );
        }
    },
    _callback_checkMyEventBuyAmtJson : function(json) {
        if(json.ret == "0"){
            var chkTotalAmt = parseInt(json.myTotalAmt); 
            monthEvent.detail.totalAmt =  chkTotalAmt;
            
            if(monthEvent.detail.divChk == '1'){
                if(monthEvent.detail.totalAmt > 0){
                    monthEvent.detail.getFirstChk();
                }else{
                    monthEvent.detail.divChk = ''; // 구분값 초기화
                    alert("기간 내 구매 후 응모 가능합니다.");
                }
            }else if(monthEvent.detail.divChk == '2'){
                if(monthEvent.detail.totalAmt > 69999){
                    monthEvent.detail.getFirstChk();
                }else{
                    monthEvent.detail.divChk = ''; // 구분값 초기화
                    alert("기간 내 구매 후 응모 가능합니다.");
                }
            }
        }else{
            alert(json.message);
        }
    },
    
    /* 위수탁동의 팝업 노출을 위한 응모여부 확인 */
    getFirstChk : function(){
        var fvrSeq;
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
                if(monthEvent.detail.divChk == '1'){
                    fvrSeq = '3';
                }else if(monthEvent.detail.divChk == '2'){
                    fvrSeq = '4';
                }
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : fvrSeq
                }
                
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180830_1/getFirstChkJson.do"
                      , param
                      , this._callback_getFirstChkJson
                );
            }            
        }        
    },
    _callback_getFirstChkJson : function(json) {
        
        if(monthEvent.detail.doubleSubmitCheck()) return; // 중복체크
        
        if(json.ret == "0"){
            monthEvent.detail.firstYn = "Y";        //최초 참여 여부 변수값
            monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
        }else{
            monthEvent.detail.firstYn = "N";        //최초 참여 여부 변수값
            monthEvent.detail.doubleSubmitFlag = false; // 중복 클릭 방지
            alert("이미 응모 하셨습니다.");
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
                monthEvent.detail.travelApply();
            }
        }
    },
    
    /* 코타키나발루 여행 응모 */    
    travelApply : function(){
        var fvrSeq;
        
        if(monthEvent.detail.divChk == '1'){
            fvrSeq = '3';
        }else if(monthEvent.detail.divChk == '2'){
            fvrSeq = '4';
        }
        
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : fvrSeq
              , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
              , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
              , firstYn : monthEvent.detail.firstYn     //최초참여여부
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180830_1/travelApplyJson.do"
              , param
              , monthEvent.detail._callback_travelApplyJson
        );
    },
    _callback_travelApplyJson : function(json){
        if(json.ret == "0"){
            // 중복 클릭 방지
            monthEvent.detail.doubleSubmitFlag = false;
            
            if(monthEvent.detail.divChk == '1'){
                monthEvent.detail.divChk = ''; // 구분값 초기화
                alert("응모되었습니다. 9월 14일 당첨자 발표 게시판을 확인해주세요.");
            }else if(monthEvent.detail.divChk == '2'){
                monthEvent.detail.divChk = ''; // 구분값 초기화
                alert("신청되었습니다.");
            }
            
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
  