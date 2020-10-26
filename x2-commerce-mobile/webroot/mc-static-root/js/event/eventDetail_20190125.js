/**
 * 배포일자 : 2019.01.24
 * 오픈일자 : 2019.01.25
 * 이벤트명 : 1월_신규앱설치 이벤트
 * */

$.namespace("monthEvent.detail");
monthEvent.detail = {
    firstYn : "N",
    baseImgPath : _cdnImgUrl + "contents/201901/25allssu/",
    init : function(){
        // 채워라 카테고리의 별! 클릭
        $("#eGift").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    monthEvent.detail.checkNewApp();
                }
            }

        });

        $("#eMyGift").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                monthEvent.detail.getMyGift();
            }
        });

        /* 위수탁동의 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });

        $("#eApply").click(function(){
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
                    //앱 푸시 수신동의 여부 확인
                    var param = {
                            evtNo : $("input[id='evtNo']:hidden").val()
                    };
                    common.Ajax.sendJSONRequest(
                            "GET"
                          , _baseUrl + "event/20190101/getAppPushYnCntJson.do"
                          , param
                          , monthEvent.detail._callback_getAppPushYnCntJson
                    );
                }
            }
        });

        //직원확인
        $("#eConfirm").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                if(confirm("직원 확인 후 쿠폰 재사용 불가합니다.")){
                    if(!mevent.detail.checkLogin()){
                        return;

                    }else{
                        var fvrSeq = "12";
                        var param = {
                                evtNo : $("input[id='evtNo']:hidden").val()
                                , fvrSeq : fvrSeq
                        };
                        common.Ajax.sendJSONRequest(
                                "GET"
                                , _baseUrl + "event/20190125/confirmStaff.do"
                                , param
                                , monthEvent.detail._callback_getStaffConfirmJson
                        );
                    }
                }
            }
        });
    },

    // 3.2 직원확인하기
    _callback_getStaffConfirmJson : function(json){
        if(json.ret == "0"){
            mevent.detail.eventShowLayer('pop5'); //사용완료
        }else{
            alert(message);
        }
    },

    _callback_getAppPushYnCntJson : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
        }else{
            monthEvent.detail.checkApply();
        }
    },

    checkNewApp : function(){
        mevent.detail.eventShowLayer('pop6');
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190125/checkNewAppDown.do"
              , param
              , monthEvent.detail._callback_checkNewAppDown
        );
    },

    _callback_checkNewAppDown : function(json){
        mevent.detail.eventCloseLayer();
        if(json.ret == "0"){
            if(json.newYn != "Y"){
                alert("기간 내 신규 앱 설치 고객만 참여 가능합니다.(설치 기기 기준)");
            }else{
                monthEvent.detail.checkGift();
            }
        }else{
            alert(json.message);
        }
    },

    checkGift : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190125/checkAllSsu2.do"
              , param
              , monthEvent.detail._callback_checkGift
        );
    },

    _callback_checkGift : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            if( json.myTotalCnt  == "0" ) {  //한번도 신청하지 않은경우 위수탁 받기
                $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.giftEntry('"+json.myTotalCnt+"');");
                mevent.detail.eventShowLayer('eventLayerPolice');
                monthEvent.detail.firstYn = "Y";
            }else {
                monthEvent.detail.firstYn = "N";
                monthEvent.detail.giftEntry(json.myTotalCnt);
            }
        }else{
            alert(json.message);
        }
    },

    giftEntry : function(myTotalCnt){
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

            if(myTotalCnt == 0){
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
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190125/giftEntry.do"
                  , param
                  , monthEvent.detail._callback_giftEntry
            );
        }
    },

    _callback_giftEntry : function(json){
        if(json.ret == "0"){
           $(':radio[name="argee1"]:checked').attr("checked", false);
           $(':radio[name="argee2"]:checked').attr("checked", false);
           $(".win_number").text("("+json.tgtrSeq+")");

           if(json.fvrSeq == "1"){
               if($("#profile").val() == "prod"){
                   monthEvent.detail.downCouponJson("g0CzCBI3VCb4HdfhI0+xew==");
               }else{
                   monthEvent.detail.downCouponJson("g0CzCBI3VCZ9uWDEOJVJVg==");
               }
           }else if(json.fvrSeq == "2"){
               mevent.detail.eventShowLayer('pop3');
           }else{
               mevent.detail.eventShowLayer('gift'+json.fvrSeq);
           }
       }else{
           alert(json.message);
       }
   },

   downCouponJson : function(cpnNo) {
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
                   , this._callback_downCouponJson);
       }
   },

   _callback_downCouponJson : function(strData) {
       if(strData.ret == '0'){
           mevent.detail.eventShowLayer('pop4');
       }else{
           alert(strData.message);
       }
   },

   getMyGift : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190125/getMyGift.do"
              , param
              , monthEvent.detail._callback_getMyGift
        );
    },

    _callback_getMyGift : function(json){
        if(json.ret == "0"){
            if(json.fvrSeq != null && json.tgtrSeq != null){
                $(".win_number").text("("+json.tgtrSeq+")");
                if(json.fvrSeq == "1"){
                    mevent.detail.eventShowLayer('pop4');
                }else if(json.fvrSeq == "2"){
                    if(json.cpnCheck == 0){
                        mevent.detail.eventShowLayer('pop3');
                    }else{
                        mevent.detail.eventShowLayer('pop5');
                    }
                }else{
                    mevent.detail.eventShowLayer('gift'+json.fvrSeq);
                }
            }else{
                alert("응모이력이 없습니다.");
            }
        }else{
            alert(json.message);
        }
    },

    checkApply : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190125/checkAllSsu2Apply.do"
              , param
              , monthEvent.detail._callback_checkApply
        );
    },

    _callback_checkApply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            if( json.myTotalCnt  == "0" ) {  //한번도 신청하지 않은경우 위수탁 받기
                $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.giftApply('"+json.myTotalCnt+"');");
                mevent.detail.eventShowLayer('eventLayerPolice');
                monthEvent.detail.firstYn = "Y";
            }else {
                monthEvent.detail.firstYn = "N";
                monthEvent.detail.giftApply(json.myTotalCnt);
            }
        }else{
            alert(json.message);
        }
    },

    giftApply : function(myTotalCnt){
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

            if(myTotalCnt == 0){
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
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190125/giftApply.do"
                  , param
                  , monthEvent.detail._callback_giftApply
            );
        }
    },

    _callback_giftApply : function(json){
        if(json.ret == "0"){
           mevent.detail.eventShowLayer('pop2');
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

    /**
    * 공지사항 레이어 길 경우 사용
    */
    eventShowLayScroll : function(obj) {
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
       }
       _layDim.show();
       _layObj.css({'margin-top': -_layObjTop}).show();
    }
};