/**
 * 온오프쿠폰행사
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    init : function(){
        //쿠폰 상태 조회
        monthEvent.detail.getCouponStatusJson();
        $('#inputNum').prop('placeholder', '직원 확인 코드 입력');

        //오프라인쿠폰사용하기 클릭
        $(".couponDown1").click(function(){
            if(!$(".storeCoupon_con").hasClass("end") && !$(".storeCoupon_con").hasClass("couponSoldOut")){
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
                        monthEvent.detail.getStaffYn();
                    }
                }
            }
        });

        //온라인쿠폰 소진완료여부조회
        $(".couponDown2").click(function(){
            if(!$(".appCoupon_area").hasClass("couponSoldOut")){
                if(common.app.appInfo != undefined && common.app.appInfo.isapp){
                    setTimeout(function() {
                        monthEvent.detail.getCouponStatusJson();
                    }, 200);
                }
            }
        });

        //직원확인
        $(".btn_confirm").click(function(){
            if($(".sCoupon").hasClass("store1")){
                if($("#inputNum").val().trim() == ""){
                    alert("직원 확인 코드를 입력해주세요.");
                    return;
                }
                if($("#inputNum").val() == "5290"){
                    monthEvent.detail.couponUseConfirm("1");
                }else{
                    alert("잘못된 코드입니다. 다시 입력해주세요.");
                    return;
                }
            }else{
                if(confirm("사용 완료 이후 재사용 불가합니다. 사용하시겠습니까?")){
                    monthEvent.detail.couponUseConfirm("2");
                }
            }
        });

        $('.eventHideLayer').click(function(){
            $("#inputNum").val("");
        });
    },

    getCouponStatusJson : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
            ,inCpnNoArr : [$("input[id='cpnNo1']:hidden").val(),$("input[id='cpnNo2']:hidden").val()].toString()
            ,fvrSeq : "1"
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200102/getCouponStatusJson.do"
              , param
              , monthEvent.detail._callback_getCouponStatusJson
        );
    },

    _callback_getCouponStatusJson : function(json){
        if(json.ret == "0"){
            if(json.useEndRate >= 90){
                $(".storeCouponProgress").html("<p><span>쿠폰 소진 임박!!</span></p>");
            }else{
                $(".storeCouponProgress").html("<p>쿠폰 소진율:<span>"+json.useEndRate+"%</span></p>");
            }

            //오프라인 소진완료
            if(json.offSoldOut == "Y"){
                $(".storeCoupon_con").addClass("couponSoldOut");
                $(".storeCouponProgress").html("<p>쿠폰 소진율:<span>100%</span></p>");
            }else{
                //오프라인쿠폰 사용완료
                if(json.offUseYn == "Y"){
                    $(".storeCoupon_con").addClass("end");
                }
            }

            //온라인 소진완료
            if(json.onSoldOut == "Y"){
                $(".appCoupon_con").addClass("couponSoldOut");
            }
        }else{
            alert(json.message);
        }
    },

    couponUseConfirm : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP 에서만 참여 가능합니다.")){
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
                        ,inCpnNoArr : [$("input[id='cpnNo1']:hidden").val(),$("input[id='cpnNo2']:hidden").val()].toString()
                        ,fvrSeq : fvrSeq
                    }

                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/20200102/couponUseConfirm.do"
                          , param
                          , monthEvent.detail._callback_couponUseConfirm
                    );
            }
        }
    },

    _callback_couponUseConfirm : function(json){
        if(json.ret == "0"){
            if(json.fvrSeq == "1"){
                $(".sCoupon").addClass("store2");
                $(".sCoupon").removeClass("store1");
                $(".storePinNum").barcode(json.rndmVal, "code128",{barWidth:2, barHeight:40});
                $("#inputNum").val("");
            }else{
                mevent.detail.eventCloseLayer();
            }
            monthEvent.detail.getCouponStatusJson();
        }else{
            mevent.detail.eventCloseLayer();
            setTimeout(function() {
                alert(json.message);
            }, 200);
            monthEvent.detail.getCouponStatusJson();
        }
    },

    getStaffYn : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200102/getStaffYn.do"
              , param
              , monthEvent.detail._callback_getStaffYn
        );
    },

    _callback_getStaffYn : function(json){
        if(json.ret == "0"){
            $(".sCoupon").addClass("store1");
            $(".sCoupon").removeClass("store2");
            mevent.detail.eventShowLayer("popStoreCoupon");
        }else{
            alert(json.message);
        }
    }
}