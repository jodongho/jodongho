$.namespace("monthEvent.detail"); 
monthEvent.detail = {
    
    isExecute : false,
    tmpVal : "",
    
    init : function(){
               
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
                var tmpCpnNo = "";
                // 해당 쿠폰 번호 입력
                if($("#profile").val() == "dev"){
                    tmpCpnNo = "g0CzCBI3VCb7qoHay70Mcg==,g0CzCBI3VCb38artYTVn1Q==";
                }else if($("#profile").val() == "qa"){
                    tmpCpnNo = "g0CzCBI3VCZKRMyj4YyC+A==,g0CzCBI3VCZtxCUiJZYX8g==";
                }else if($("#profile").val() == "prod"){
                    tmpCpnNo = "g0CzCBI3VCYUkpRYxEya9A==,g0CzCBI3VCaNt6+2xP1O/g==";
                }
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val(),
                        cpnNo : tmpCpnNo
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180927_1/getFirstChkJson.do"
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
                monthEvent.detail.chkDownCoupon();
            }else if (monthEvent.detail.isExecute == true) {
                return;
            }
        }else{
            alert("이미 발급 받으셨습니다.");
        }
    },
    /* 쿠폰 다운로드 클릭 */
    chkDownCoupon : function(){
        // 중복 클릭 방지
        monthEvent.detail.isExecute  =  true;
        var cpnNo = "";
        // 50%확률
        monthEvent.detail.tmpVal = $("input[id='imgUrlConnectDay']:hidden").val().substr(-1)%2;
        if($("#profile").val() == "dev"){
            if(monthEvent.detail.tmpVal=="1"){
                //30%
                cpnNo = "g0CzCBI3VCb7qoHay70Mcg==";
            }else{
                //25%
                cpnNo = "g0CzCBI3VCb38artYTVn1Q==";
            }
        }else if($("#profile").val() == "qa"){
            if(monthEvent.detail.tmpVal=="1"){
                //30%
                cpnNo = "g0CzCBI3VCZtxCUiJZYX8g==";
            }else{
                //25%
                cpnNo = "g0CzCBI3VCZKRMyj4YyC+A==";
            }
        }else if($("#profile").val() == "prod"){
            if(monthEvent.detail.tmpVal=="1"){
                //30%
                cpnNo = "g0CzCBI3VCYUkpRYxEya9A==";
            }else{
                //25%
                cpnNo = "g0CzCBI3VCaNt6+2xP1O/g==";
            }
        }
        monthEvent.detail.downCouponJson(cpnNo);
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
            if(monthEvent.detail.tmpVal=="1"){
                //30%
                mevent.detail.eventShowLayer('evtCoupon30');
            }else{
                //25%
                mevent.detail.eventShowLayer('evtCoupon25');
            }
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