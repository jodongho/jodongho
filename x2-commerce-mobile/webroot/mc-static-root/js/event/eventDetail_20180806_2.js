$.namespace("monthEvent.detail");
monthEvent.detail = {
    firstYn : "",
    cpnSeq : "",
    appPushYn : "N",
    cpnUseYn : "N",
    payAmtYn : "N",
    
    init : function(){
        
        if(common.isLogin()){
            monthEvent.detail.getStampChk();        //스탬프 확인
//            alert();
        };

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
    
    /* 
     * 쿠폰  다운로드 조건 확인
      */
    chkDownCoupon : function(cpnSeq) {
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
                
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , cpnSeq : cpnSeq
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20180806_2/getMyPayAmtInfoJson.do"
                        , param
                        , this._callback_getMyPayAmtInfoJson
                 );
            }
        }
    },
    _callback_getMyPayAmtInfoJson : function(json) {
        if(json.ret == '0'){
            var cpnNo = "";
            monthEvent.detail.cpnSeq = json.cpnSeq;
            
            if($("#profile").val() == "dev"){
                if(monthEvent.detail.cpnSeq == "0"){
                    cpnNo = "g0CzCBI3VCbBp7Y+js/XZQ==";
                }else if(monthEvent.detail.cpnSeq == "1"){
                    cpnNo = "g0CzCBI3VCZwlmm66SAJtg==";
                }else if(monthEvent.detail.cpnSeq == "2"){
                    cpnNo = "g0CzCBI3VCaL1O/jVAzssQ==";
                }else if(monthEvent.detail.cpnSeq == "3"){
                    cpnNo = "g0CzCBI3VCb8bXcuGLWL9g==";
                }
            }else if($("#profile").val() == "qa"){
                if(monthEvent.detail.cpnSeq == "0"){
                    cpnNo = "g0CzCBI3VCY3+1xJoe9E7w==";
                }else if(monthEvent.detail.cpnSeq == "1"){
                    cpnNo = "g0CzCBI3VCb5gPYvOy1W6g==";
                }else if(monthEvent.detail.cpnSeq == "2"){
                    cpnNo = "g0CzCBI3VCYHX/mQK1lMGg==";
                }else if(monthEvent.detail.cpnSeq == "3"){
                    cpnNo = "g0CzCBI3VCb3LmqaekooZA==";
                }
            }else if($("#profile").val() == "prod"){
                if(monthEvent.detail.cpnSeq == "0"){
                    cpnNo = "g0CzCBI3VCalogy1CtCFgA==";
                }else if(monthEvent.detail.cpnSeq == "1"){
                    cpnNo = "g0CzCBI3VCbBBE/bGciw+g==";
                }else if(monthEvent.detail.cpnSeq == "2"){
                    cpnNo = "g0CzCBI3VCYLhOOvJe1NIQ==";
                }else if(monthEvent.detail.cpnSeq == "3"){
                    cpnNo = "g0CzCBI3VCbpWOslP9IdWQ==";
                }
            }
            monthEvent.detail.downCouponJson(cpnNo);
        }else{
            alert(json.message);
        }
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
            
            if(monthEvent.detail.cpnSeq != "0"){
              //쿠폰 발급 받았으면 이벤트 응모 테이블에 쿠폰 발급 이력 저장
                monthEvent.detail.regCpnDownHistJson();
            }
        }
    },
    
    /* 
     * 1000원 득템쿠폰  다운로드 이력 저장 
     */
    regCpnDownHistJson : function() {
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            if(!mevent.detail.checkRegAvailable()){
                return;
            }
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : monthEvent.detail.cpnSeq
            };
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/20180806_2/regCpnDownHist.do"
                    , param
                    , this._callback_regCpnDownHistJson
            );
        }
    },
    _callback_regCpnDownHistJson : function(json) {
        if(json.ret == '0'){
//            alert(json.message);
        }
    },
    
    /* 스탬프 확인 */
    getStampChk : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
//                    , fvrSeq : "4"
            }
            
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20180806_2/getStampChkJson.do"
                  , param
                  , this._callback_getStampChkJson
            );
        }
    },
    _callback_getStampChkJson : function(json) {
        if(json.appPushYnCnt == "1"){       //appPushYnCnt(0:수신동의 안함, 1:수신동의 함)
            $(".stamp1").addClass("on");
            monthEvent.detail.appPushYn = "Y";
        }
        if(json.cpnUseYnCnt == "0"){        //cpnUseYnCnt(0:사용이력 있음, 1:사용이력 없음)
            $(".stamp2").addClass("on");
            monthEvent.detail.cpnUseYn = "Y";
        }
        if(json.payAmtYnCnt == "1"){        //payAmtYnCnt(0:구매이력 없음[5만원이상], 1:구매이력 있음[5만원이상])
            $(".stamp3").addClass("on");
            monthEvent.detail.payAmtYn = "Y";
        }
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
                //스탬프3개 다 찍혔을때만
                if(monthEvent.detail.appPushYn == "Y" && monthEvent.detail.cpnUseYn == "Y" && monthEvent.detail.payAmtYn == "Y"){
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                            , fvrSeq : "8"
                    }
                    
                    common.Ajax.sendRequest(
                            "GET"
                          , _baseUrl + "event/20180806_2/getFirstChkJson.do"
                          , param
                          , this._callback_getFirstChkJson
                    );
                }else{
                    alert("대상자가 아닙니다. 스탬프 3종 모두 찍으셔야 응모 가능 합니다.");
                }
            }            
        }        
    },
    _callback_getFirstChkJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.firstYn = "Y";        //최초 참여 여부 변수값
            monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
        }else{
            monthEvent.detail.firstYn = "N";        //최초 참여 여부 변수값
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
                monthEvent.detail.americanoApply();
            }
        }
    },
    
    /* 아메리카노 응모 */    
    americanoApply : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "8"
              , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
              , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
              , firstYn : monthEvent.detail.firstYn     //최초참여여부
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180806_2/americanoApplyJson.do"
              , param
              , monthEvent.detail._callback_americanoApplyJson
        );
    },
    _callback_americanoApplyJson : function(json){
        if(json.ret == "0"){
            alert("응모 되었습니다.");
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
        var layDim = document.getElementById('eventDimLayer');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
    
};
