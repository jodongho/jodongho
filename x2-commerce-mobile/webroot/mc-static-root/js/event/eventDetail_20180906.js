$.namespace("monthEvent.detail"); 
monthEvent.detail = {
        
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
    },
    /* 구매건수 */
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
                
                var tmpEvtStrtDt = "";
                if($("#profile").val() == "dev"){
                    tmpEvtStrtDt = "20180903";
                }else if($("#profile").val() == "qa"){
                    tmpEvtStrtDt = "20180903";
                }else if($("#profile").val() == "prod"){
                    tmpEvtStrtDt = "20180914";
                }
                
                var tmpEvtEndDt = "";
                if($("#profile").val() == "dev"){
                    tmpEvtEndDt = "20180920";
                }else if($("#profile").val() == "qa"){
                    tmpEvtEndDt = "20180920";
                }else if($("#profile").val() == "prod"){
                    tmpEvtEndDt = "20180920";
                }
                
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180906/myOrdCntChkJson.do"
                      , {
                              evtNo : $("input[id='evtNo']:hidden").val(),
                              evtStrtDt : tmpEvtStrtDt,
                              evtEndDt : tmpEvtEndDt
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
            //구매 확인
            monthEvent.detail.totalOrdCnt = json.totalOrdCnt;
            if(monthEvent.detail.totalOrdCnt == "0"){
                alert("쿠폰 발급 대상자가 아닙니다. 9월 14일~9월 20일 온라인몰 구매고객만 발급가능합니다.");
            } else {
                //할인쿠폰 다운
                var cpnNo = "";
                if($("#profile").val() == "dev"){
                    cpnNo = "g0CzCBI3VCbkZuMV2Yw62g==";
                }else if($("#profile").val() == "qa"){
                    cpnNo = "g0CzCBI3VCZx7VzG5pXmPg==";
                }else if($("#profile").val() == "prod"){
                    cpnNo = "g0CzCBI3VCbvfPh7bpRHug==";
                }
                monthEvent.detail.downCouponJson(cpnNo);
            }
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