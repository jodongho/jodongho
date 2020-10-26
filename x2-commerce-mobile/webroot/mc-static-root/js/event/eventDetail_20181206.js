/** 
 * 배포일자 : 2018.11.22
 * 오픈일자 : 2018.12.06
 * 이벤트명 : OLIVE YOUNG BRAND SALE 감사쿠폰
 * */ 

$.namespace("monthEvent.detail"); 
monthEvent.detail = {

        init : function(){
        
            // 2. base layer close
            $(".eventHideLayer").click(function(){
                $('.eventLayer').hide();
                $('#eventDimLayer').hide();
            });
        },
        

        /**
         * 12월 브랜드세일 감사쿠폰 40%
         * 구매건수 체크
         */
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
                        tmpEvtStrtDt = "20181001";
                    }else if($("#profile").val() == "qa"){
                        tmpEvtStrtDt = "20181001";
                    }else if($("#profile").val() == "prod"){
                        tmpEvtStrtDt = "20181129";
                    }
                    
                    var tmpEvtEndDt = "";
                    if($("#profile").val() == "dev"){
                        tmpEvtEndDt = "20181121";
                    }else if($("#profile").val() == "qa"){
                        tmpEvtEndDt = "20181121";
                    }else if($("#profile").val() == "prod"){
                        tmpEvtEndDt = "20181205";
                    }
                    
                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/20181206/myOrdCntChkJson.do"
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
                var totalOrderCount = parseInt(json.totalOrdCnt);
                
                if(0 == totalOrderCount){
                    alert("쿠폰 발급 대상자가 아닙니다. 11월 29일~12월 05일 온라인몰 구매고객만 발급가능합니다.");
                } else {
                    //할인쿠폰 다운
                    var cpnNo = "";
                    if($("#profile").val() == "dev"){
                        cpnNo = "g0CzCBI3VCZgOGxTsTzb6w=="; //C000000000342
                    }else if($("#profile").val() == "qa"){              
                        cpnNo = "g0CzCBI3VCZaodjoxljCNA==";  //C000000005175
                    }else if($("#profile").val() == "prod"){
                        cpnNo = "g0CzCBI3VCZfCEqUphy/Sw==";  //C000000006839
                    }
                    monthEvent.detail.downCouponJson(cpnNo);
                }
            }else{
                alert(json.message);
            }
        },
        
        /* 
         * 쿠폰  다운로드 12월 브랜드세일 감사쿠폰 40% 11.29 ~ 12.05 구매건
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
        
        
};