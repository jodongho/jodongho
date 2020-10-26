/**
 * 배포일자 : 2019.05.02
 * 오픈일자 : 2019.05.07
 * 이벤트명 : 5락대장
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {

    init : function(){
    },

    // 5락 대장 쿠폰팩 신청
    appCouponPack : function(){
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
                //신청
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20190507/appCouponPack.do"
                      , param
                      , monthEvent.detail._callback_appCouponPack
                );
            }
        }
    },

    _callback_appCouponPack : function(json){
        alert(json.message);
    }

};