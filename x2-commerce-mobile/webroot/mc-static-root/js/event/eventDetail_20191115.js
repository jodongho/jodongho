/**
 * 배포일자 : 2019-11-14
 * 오픈일자 : 2019-11-15
 * 이벤트명 : 11월 마케팅 수신 동의
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    currEmailRcvYn : '',
    possibleApply : false,
    applyIng : false,
    pushIng : false,
    layerPolice : false,
    init : function(){

        /* 수신동의 현황 조회 */
        monthEvent.detail.getMyMarketingStatus();
        common.app.getTmsPushConfig();

        // app push 체크
        $('#Check2').on('click', function(){
            if(monthEvent.detail.appPushVer()){
                if(common.isLogin() && !monthEvent.detail.pushIng){
                    monthEvent.detail.pushIng = true;
                    monthEvent.detail.setTmsPushConfig($('#Check2').is(':checked') ? 'Y' : 'N');
                    var appCheckTimer = setInterval(function(){
                        if('N' == common.app.pushConfigResult){
                            //수신동의 처리 실패
                            $('#Check2').attr('checked', !$('#Check2').is(':checked'));
                            clearInterval(appCheckTimer);
                            monthEvent.detail.pushIng = false;
                        }else if(!common.isEmpty(common.app.pushConfigResult) || !monthEvent.detail.pushIng){
                            clearInterval(appCheckTimer);
                            monthEvent.detail.pushIng = false;
                        }
                    }, 200);
                }
            }

        });

        //직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });
    },

    //TMS 푸시 동의값 설정
    setTmsPushConfig : function(mktFlag) {
        common.app.pushConfigResult = "";
        if (common.app.appInfo.isapp && common.isLogin()) {
            if(mktFlag==="N") {
                if(confirm("알림을 해제하시겠습니까?")) {
                    location.href = "oliveyoungapp://setTmsPushConfig?mktFlag="+mktFlag;
                }else{
                    $('#Check2').attr('checked', true);
                    monthEvent.detail.pushIng = false;
                }
            } else {
                location.href = "oliveyoungapp://setTmsPushConfig?mktFlag="+mktFlag;
            }
        }
    },

    /* 앱 최신버전 체크 */
    appPushVer : function(){
        var tempCompareVersion = "";
        if (common.app.appInfo.ostype == "10") { // ios
            tempCompareVersion = '2.2.1';
        }else if(common.app.appInfo.ostype == "20"){ // android
            tempCompareVersion = '2.1.8';
        }
        if($('#Check2').is(':checked')
                && common.app.appInfo.isapp && common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion) ==  "<"){
            if(confirm("APP PUSH설정을 위해 APP 최신버전 업데이트가 필요합니다. 업데이트를 하시겠습니까?")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20191115/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val()+"&chkYn=Y");
                return false;
            }else{
                $('#Check2').attr('checked', false);
                return false;
            }
        }
        return true;
    },

    /* 수신동의 현황 조회 */
    getMyMarketingStatus : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191115/getMyMarketingStatus.do"
              , param
              , monthEvent.detail._callback_getMyMarketingStatus
        );
    },

    _callback_getMyMarketingStatus : function(json){
        if(json.ret == "0"){
            monthEvent.detail.currEmailRcvYn = json.currEmailRcvYn;
            monthEvent.detail.possibleApply = json.possibleApply;

            //소진
            $('.gift01').addClass(json.gift01);
            $('.gift02').addClass(json.gift02);
            $('.gift03').addClass(json.gift03);
            $('.gift04').addClass(json.gift04);

            if('Y' == json.apply){
                $('.btnEvtApply').addClass('on').removeAttr('onclick');
            }
            if('Y' == json.currAgrYn){
                $('#radioCheck1').attr('checked', true);
            }
            if('N' == json.currAgrYn){
                $('#radioCheck2').attr('checked', true);
            }
            if('Y' == json.currSmsRcvAgrYn){
                $('#Check1').attr('checked', true);
            }
            if(common.isLogin()){
                var appCheckTimer = setInterval(function(){
                    if('Y' == common.app.appMktFlag){
                        $('#Check2').attr('checked', true);
                        clearInterval(appCheckTimer);
                    }else if('N' == common.app.appMktFlag){
                        $('#Check2').attr('checked', false);
                        clearInterval(appCheckTimer);
                    }
                }, 200);
            }
        }
    },

    /* 참여 */
    marketingApplyCheck : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("APP에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else if(monthEvent.detail.possibleApply == 'N'){
                alert('기간 내 수신동의 고객만 참여 가능합니다.');
            }else if(monthEvent.detail.applyIng){
                return;
            }else if(!$('#radioCheck1').is(':checked') || !$('#Check1').is(':checked') || !$('#Check2').is(':checked')){
                alert('마케팅 활용 동의, SMS/APP PUSH 수신 설정을 확인해주세요.');
            }else if(monthEvent.detail.appPushVer()){
                monthEvent.detail.applyIng = true;

                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                       ,agrYn : $('[name=userAgree]:checked').val()
                       ,smsRcvAgrYn : $('#Check1').is(':checked') ? 'Y' : 'N'
                       ,appPushAgrYn : $('#Check2').is(':checked') ? 'Y' : 'N'
                       ,MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                       ,MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20191115/marketingApplyCheck.do"
                      , param
                      , monthEvent.detail._callback_marketingApplyCheck
                );
            }
        }
    },

    _callback_marketingApplyCheck : function(json){
        if(json.ret == '016' || json.ret == '017'){
            //위수탁동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
            monthEvent.detail.layerPolice = true;
            monthEvent.detail.applyIng = false;
        }else if(json.ret == '0'){
            //마케팅, sms
            monthEvent.detail.mktRcvSend();
        }else{
            monthEvent.detail.applyIng = false;
            alert(json.message);
        }
    },

    mktRcvSend : function(){
        var url = _baseUrl+"mypage/setMktReceiptInfoJson.do"
        var data = {
                  agrYn : $('[name=userAgree]:checked').val()
                , smsRcvAgrYn : $('#Check1').is(':checked') ? 'Y' : 'N'
                , emailRcvYn : monthEvent.detail.currEmailRcvYn };

        common.Ajax.sendRequest("POST", url, data, monthEvent.detail._callBack_mktRcvSend);
    },

    _callBack_mktRcvSend : function (data){
        if(data.result){
            if(data.CODE == "S0000000A"){ //정상
                monthEvent.detail.marketingApply();
            } else {
                monthEvent.detail.applyIng = false;
                alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");
                return false;
            }
        }else{
            monthEvent.detail.applyIng = false;
            alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");
            return false;
        }
    },

    /* 참여 */
    marketingApply : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("APP에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else if(monthEvent.detail.possibleApply == 'N'){
                alert('기간 내 수신동의 고객만 참여 가능합니다.');
            }else if(!$('#radioCheck1').is(':checked') || !$('#Check1').is(':checked') || !$('#Check2').is(':checked')){
                alert('마케팅 활용 동의, SMS/APP PUSH 수신 설정을 확인해주세요.');
            }else if(monthEvent.detail.appPushVer()){
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                       ,agrYn : $('[name=userAgree]:checked').val()
                       ,smsRcvAgrYn : $('#Check1').is(':checked') ? 'Y' : 'N'
                       ,appPushAgrYn : $('#Check2').is(':checked') ? 'Y' : 'N'
                       ,MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                       ,MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20191115/marketingApply.do"
                      , param
                      , monthEvent.detail._callback_marketingApply
                );
            }
        }
    },

    _callback_marketingApply : function(json){
        monthEvent.detail.applyIng = false;
        if(json.ret == '016' || json.ret == '017'){
            //위수탁동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
            monthEvent.detail.layerPolice = true;
        }else if(json.ret == '0'){
            $('#evtGift'+json.fvrSeq+' .win_number').text(json.tgtrSeq);
            mevent.detail.eventShowLayer('evtGift'+json.fvrSeq);
            $('.btnEvtApply').addClass('on').removeAttr('onclick');
        }else{
            alert(json.message);
        }
    },

    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
                alert("2가지 모두 동의 후 참여 가능합니다.");
                return;
            }

            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                monthEvent.detail.marketingApplyCheck();
            }
        }
    }

}