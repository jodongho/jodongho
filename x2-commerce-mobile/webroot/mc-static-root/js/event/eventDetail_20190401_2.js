/**
 * 배포일자 : 2019.03.28
 * 오픈일자 : 2019.04.01
 * 이벤트명 : 올리브영 빙고팡
 */

$.namespace("monthEvent.detail");
monthEvent.detail = {
    firstYn : "N",
    init : function() {
        if(common.isLogin()){
            monthEvent.detail.getBingo();
        }

        //3천원 할인쿠폰 받기
        $(".gift1").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }

                if($(this).hasClass("on")){
                    monthEvent.detail.checkBingo("1");
                }else if($(this).hasClass("apply")){
                    monthEvent.detail.getCpnConfirm('10');
                }else{
                    monthEvent.detail.getStaffYn();
                }
            }
        });

        //기프트카드 3천원 신청하기
        $(".gift2").click(function(){
            monthEvent.detail.checkBingo("2");
        });

        //기프트카드 5천원 신청하기
        $(".gift3").click(function(){
            monthEvent.detail.checkBingo("3");
        });

        //대박경품 응모하기
        $(".gift4").click(function(){
            monthEvent.detail.checkBingo("4");
        });

        //4월혜택응모
        $(".benefit1").click(function(){
            monthEvent.detail.checkBingo("5");
        });

        //5월혜택응모
        $(".benefit2").click(function(){
            monthEvent.detail.checkBingo("6");
        });

        //6월혜택응모
        $(".benefit3").click(function(){
            monthEvent.detail.checkBingo("7");
        });

        /* 위수탁동의 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
    },

    getBingo : function(){
        if(common.isLogin()){
            $(".bingo_list li").removeClass("on end");
            $("[class^=gift]").removeClass("on end");
            $("[class^=benefit]").removeClass("on end");
            $(".attend_area li").removeClass("on end apply");
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190401_2/getBingo.do"
                  , param
                  , monthEvent.detail._callback_getBingo
            );
        }
    },

    _callback_getBingo : function(json){
        if(json.ret == "0"){
            $(".bingo_list li").each(function(index){
                $(this).addClass(eval("json.bingo"+Number(index+1)));
            });

            $(".gift1").addClass(json.gift1);
            $(".gift2").addClass(json.gift2);
            $(".gift3").addClass(json.gift3);
            $(".gift4").addClass(json.gift4);

            $(".benefit1").addClass(json.benefit1);
            $(".benefit2").addClass(json.benefit2);
            $(".benefit3").addClass(json.benefit3);

            $(".attend_area li").each(function(index){
                $(this).addClass(eval("json.attend"+Number(index+1)));
            });
        }else{
            alert(json.message);
        }
    },

    checkBingo : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
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
                    , startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
                    ,fvrSeq : fvrSeq
            }

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190401_2/checkBingo.do"
                  , param
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                      if(json.ret == "0"){
                          if( json.myTotalCnt  == "0" ) {
                                $("div#Confirmlayer1").attr("onclick", "   monthEvent.detail.bingoApply(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); " );
                                mevent.detail.eventShowLayer('eventLayerPolice');
                                monthEvent.detail.firstYn = "Y";
                            }else {
                                monthEvent.detail.bingoApply(fvrSeq, json.myTotalCnt);
                                monthEvent.detail.firstYn = "N";
                            }
                      }else{
                          alert(json.message);
                      }
                  }
            );
        }
    },

    bingoApply : function(fvrSeq,myTotalCnt){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }

            if(myTotalCnt == 0 ){
                /* 수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
                var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
                var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

                if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("N"==$(':radio[name="argee1"]:checked').val() &&  "N"==$(':radio[name="argee2"]:checked').val()){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee1"]:checked').val()){
                    alert("개인정보 수집 이용 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee2"]:checked').val()){
                    alert("개인정보 처리 위탁 동의 후 참여 가능합니다.");
                    return;
                }

                if("Y" != mbrInfoUseAgrYn){
                    mevent.detail.eventCloseLayer();
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    mevent.detail.eventCloseLayer();
                    return;
                }
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }

            mevent.detail.eventCloseLayer();
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : fvrSeq
                  , firstYn : monthEvent.detail.firstYn
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                  , startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190401_2/bingoApply.do"
                  , param
                  , monthEvent.detail._callback_bingoApply
            );
        }
    },

    _callback_bingoApply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            if(json.fvrSeq == "1"){
                mevent.detail.eventShowLayer('bingGoCoupon1');
            }else if(json.fvrSeq == "2" || json.fvrSeq == "3"){
                if(json.month == "7"){
                    mevent.detail.eventShowLayer('pop'+json.fvrSeq+"_1");
                }else{
                    mevent.detail.eventShowLayer('pop'+json.fvrSeq);
                }
            }else if(json.fvrSeq == "4"){
                mevent.detail.eventShowLayer('pop'+json.fvrSeq);
            }else{
                alert("신청되었습니다. 다음달 17일 당첨자발표 게시판을 확인하세요.");
            }
            monthEvent.detail.getBingo();
        }else{
            alert(json.message);
        }
    },

    confirmStaff : function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }

        if(confirm("직원 확인 이후 쿠폰사용 처리되며, 재사용 불가합니다. 사용하시겠습니까?")){
            mevent.detail.eventCloseLayer();
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                    , _baseUrl + "event/20190401_2/confirmStaff.do"
                    , param
                    , monthEvent.detail._callback_getStaffConfirmJson
            );
        }
    },

    // 3.2 직원확인하기
    _callback_getStaffConfirmJson : function(json){
        if(json.ret == "0"){
            if(json.fvrSeq == "9"){
                mevent.detail.eventShowLayer('appCoupon2');
            }else if(json.fvrSeq == "10"){
                mevent.detail.eventShowLayer('bingGoCoupon2');
            }
        }else{
            alert(json.message);
        }
    },

    getCpnConfirm : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }

            mevent.detail.eventCloseLayer();
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
                    , fvrSeq : fvrSeq
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190401_2/getCpnConfirm.do"
                  , param
                  , monthEvent.detail._callback_getCpnConfirm
            );
        }
    },

    _callback_getCpnConfirm : function(json){
        if(json.ret == "0"){
            if(json.fvrSeq == "9"){
                if(json.cpnCheck == 0){
                    mevent.detail.eventShowLayer('appCoupon1');
                }else{
                    mevent.detail.eventShowLayer('appCoupon2');
                }
            }else if(json.fvrSeq == "10"){
                if(json.cpnCheck == 0){
                    mevent.detail.eventShowLayer('bingGoCoupon1');
                }else{
                    mevent.detail.eventShowLayer('bingGoCoupon2');
                }
            }
        }else{
            alert(json.message);
        }
    },

    attend : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
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
                    , startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                    , _baseUrl + "event/20190401_2/attend.do"
                    , param
                    , monthEvent.detail._callback_attend
            );
        }
    },

    _callback_attend : function(json){
        if(json.ret == "0"){
            alert("출석체크 완료!");
            monthEvent.detail.getBingo();
        }else{
            alert(json.message);
        }
    },

    /* 앱 푸시 설정 바로가기 */
    goSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 설정 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    },

    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        location.reload();//새로고침
    },

    /*
     * 쿠폰  다운로드
     * “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
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

    getStaffYn : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/20190401_2/getStaffYn.do"
                , param
                , monthEvent.detail._callback_getStaffYn
        );
    },

    _callback_getStaffYn : function(json){
        if(json.ret == "0"){
            if(json.staffYn =="Y"){
                alert("임직원 발급 불가합니다.");
            }else{
                alert("+플러스빙고를 완성하셔야 발급가능합니다.");
            }
        }else{
            alert(json.message);
        }
    },

    eventShowLayScroll : function(obj){
        var _winHeight = $(window).height(),
        _layObj = $('#'+obj),
        _layObjHeight = _layObj.height(),
        _layObjTop = _layObj.height()/2,
        _layDim = $('#eventDimLayer');
        if(_layObjHeight >= _winHeight){
            var _layObjInner = _layObj.find('.conts_inner');
            var _layObjInHeight = _winHeight-200;
            _layObjInner.css({'max-height': _layObjInHeight});
            _layObjTop = $('#'+obj).height()/2;
            //console.log(_layObjInHeight);
        }
        _layDim.show();
        _layObj.css({'margin-top': -_layObjTop}).show();
    },
};