$.namespace("monthEvent.detail"); 
monthEvent.detail = {
        
    // 현재 날짜 시간을 자바에서 가져와야함 
    currentDay : null, 
    changeDate1 : "201809180000", 
    changeDate2 : "201809210000",
            
    init : function(){
        
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        if(eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate1)){
            $("#eventCoffee").css("display", "none");
        }else if (eval(monthEvent.detail.currentDay) > eval(monthEvent.detail.changeDate2)){
            $("#eventCoffee").css("display", "none");
        }
            
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
    /*  쿠폰다운로드 */
    chkDownCoupon1 : function(){
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
                cpnNo = "g0CzCBI3VCZRw6cMdsNa7A==";
            }else if($("#profile").val() == "qa"){
                cpnNo = "g0CzCBI3VCZbK8OSeXsKrg==";
            }else if($("#profile").val() == "prod"){
                cpnNo = "g0CzCBI3VCYO/ps9Rq5Q0w==";
            }
            monthEvent.detail.downCouponJson(cpnNo);
        }
    },
    chkDownCoupon2 : function(){
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
                cpnNo = "g0CzCBI3VCa6ThFH8Ti8RQ==";
            }else if($("#profile").val() == "qa"){
                cpnNo = "g0CzCBI3VCYOCtyYpCoibA==";
            }else if($("#profile").val() == "prod"){
                cpnNo = "g0CzCBI3VCYsTrrey469Qg==";
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
        var layDim = document.getElementById('eventDimLayer1');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
};