/**
 * 배포일자 : 2019.05.23
 * 오픈일자 : 2019.06.07
 * 이벤트명 : 쿠폰북이벤트
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {

    init : function(){
        //소진완료여부 가져오기
        monthEvent.detail.getApplyStatus();

        $('#evtStrNo').prop('placeholder', '매장코드입력');

        $('#evtStrNo').bind("keyup", function(){
            $(this).val($(this).val().toUpperCase());
        });
    },

    // 쿠폰북 소진완료여부
    getApplyStatus : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : "2"
                ,evtStrtDt : $("input[id='evtStrtDt']:hidden").val()
                ,evtEndDt : $("input[id='evtEndDt']:hidden").val()
                ,startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20190607/getApplyStatus.do"
              , param
              , monthEvent.detail._callback_getApplyStatus
        );
    },

    _callback_getApplyStatus : function(json){
        if(json.ret == "0"){
            if(json.appCnt > 0){
                if(common.isLogin()){
                    monthEvent.detail.getApplyYn("1");
                }else{
                    $(".couponBook1_1 > img:eq(0)").addClass("on");
                }
            }else{
                $(".couponBook1_1 > img:eq(0)").removeClass("on");
                $(".couponBook1_1 > img:eq(1)").removeClass("on");
                $(".couponBook1_1 > img:eq(2)").addClass("on");
                $(".couponBook1_1").removeAttr('onclick');
            }
        }else{
            alert(json.message);
        }
    },

    // 쿠폰북 신청여부
    getApplyYn : function(fvrSeq){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : fvrSeq
                ,startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20190607/getApplyYn.do"
              , param
              , monthEvent.detail._callback_getApplyYn
        );
    },

    _callback_getApplyYn : function(json){
        if(json.ret == "0"){
            if(json.fvrSeq == "1"){
                if(json.appCnt > 0){
                    $(".couponBook1_1 > img:eq(1)").addClass("on");
                }else{
                    $(".couponBook1_1 > img:eq(0)").addClass("on");
                }
            }else if(json.fvrSeq == "2"){
                if(json.appCnt > 0){    //이미수령
                    mevent.detail.eventShowLayer('CouponBookSuccess');
                }else{  //미수령
                    mevent.detail.eventShowLayer('CouponBookApply');
                }
            }

        }else{
            alert(json.message);
        }
    },

    // 쿠폰북 신청
    applyCouponBook : function(){
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

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,evtStrtDt : $("input[id='evtStrtDt']:hidden").val()
                    ,evtEndDt : $("input[id='evtEndDt']:hidden").val()
                    ,startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
                    ,fvrSeq : "1"
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20190607/applyCouponBook.do"
                  , param
                  , monthEvent.detail._callback_applyCouponBook
            );
        }
    },

    _callback_applyCouponBook : function(json){
        if(json.ret == "0"){
            $(".couponBook1_1 > img:eq(0)").removeClass("on");
            $(".couponBook1_1 > img:eq(1)").addClass("on");
            mevent.detail.eventShowLayer('CouponBookApply');
        }else{
            if(json.ret == "056_1"){
                $(".couponBook1_1 > img:eq(0)").removeClass("on");
                $(".couponBook1_1 > img:eq(1)").removeClass("on");
                $(".couponBook1_1 > img:eq(2)").addClass("on");
                $(".couponBook1_1").removeAttr('onclick');
            }else{
                //소진완료여부 가져오기
                monthEvent.detail.getApplyStatus();
            }
            alert(json.message);
        }
    },

    btnClick  : function(json){
        if($(".couponBook1_1 > img:eq(0)").hasClass("on")){
            monthEvent.detail.applyCouponBook();
        }else{
            monthEvent.detail.getApplyYn('2');
        }
    },

    // 쿠폰북 수령
    receiveCouponBook : function(){
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
            if($.trim($("#evtStrNo").val()) == ""){
                alert("매장코드를 입력하세요.");
                return;
            }

            //매장코드 길이 체크
            if($.trim($("#evtStrNo").val()).isNumber() && $.trim($("#evtStrNo").val()).length < 4){
                alert("매장코드를 다시 확인해주세요.");
                return;
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,fvrSeq : "2"
                    ,noteCont : $.trim($("#evtStrNo").val().toUpperCase())
                    ,evtStrtDt : $("input[id='evtStrtDt']:hidden").val()
                    ,evtEndDt : $("input[id='evtEndDt']:hidden").val()
                    ,startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20190607/receiveCouponBook.do"
                  , param
                  , monthEvent.detail._callback_receiveCouponBook
            );
        }
    },

    _callback_receiveCouponBook : function(json){
        if(json.ret == "0"){
            mevent.detail.eventShowLayer('CouponBookSuccess');
        }else{
            alert(json.message);
            if(json.ret != "056_2"){
                mevent.detail.eventCloseLayer();
                //소진완료여부 가져오기
                monthEvent.detail.getApplyStatus();
            }
        }
    },

    //랜덤쿠폰 발급
    randomCouponDown : function(){
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
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20190607/randomCouponDown.do"
                  , param
                  , monthEvent.detail._callback_randomCouponDown
            );
        }
    },

    _callback_randomCouponDown : function(json){
        if(json.ret == "0"){
            mevent.detail.eventShowLayer('randomCoupon'+json.fvrSeq);
        }else{
            alert(json.message);
        }
    }
};