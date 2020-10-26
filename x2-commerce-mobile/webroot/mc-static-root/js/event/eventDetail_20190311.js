/**
 * 배포일자 : 2019.02.26
 * 오픈일자 : 2019.03.11
 * 이벤트명 : OLIVE YOUNG BRAND SALE 감사쿠폰
 * */

$.namespace("monthEvent.detail");
monthEvent.detail = {

    init : function(){

    },


    /**
     * 03월 브랜드세일 감사쿠폰 40%
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
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/getPayAmtInEvtDay.do"
                      , {
                              evtNo : $("input[id='evtNo']:hidden").val(),
                              evtStrtDt : $("input[id='evtStrtDt']:hidden").val(),
                              evtEndDt : $("input[id='evtEndDt']:hidden").val()
                        }
                      , monthEvent.detail._callback_myOrdCntChkJson
                );
            }
        }
    },
    _callback_myOrdCntChkJson : function(json){
        if(json.ret == "0"){
            //구매 확인
            var totalOrderCount = parseInt(json.totalOrdCnt);

            if(0 == totalOrderCount){
                alert("3월 4일~3월 10일 온라인몰 구매고객만 다운 가능합니다.");
            } else {
                monthEvent.detail.downCouponJson($("input[id='cpnNo']:hidden").val());
            }
        }else{
            alert(json.message);
        }
    },

    /*
     * 쿠폰  다운로드 03월 브랜드세일 감사쿠폰 40% 03.04 ~ 03.10 구매건
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