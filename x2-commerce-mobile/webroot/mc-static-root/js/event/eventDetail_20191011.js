/**
 * 배포일자 : 2019.10.10
 * 오픈일자 : 2019.10.11
 * 이벤트명 : 10월 온오프통합이벤트 - NEW BI 날아라 올리브
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    merchant : '',
    init : function(){

        monthEvent.detail.getMyStmpApplyCnt();

        $('#popWingStamp .close').click(function(){
            //스탬프 레이어랑 올영 레이어 함께 닫기.
            if($('#echossStampLayer').length == 0){
                return;
            }else{
                closeLayer();
                mevent.detail.eventCloseLayer();
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

    showStmpLayer : function(){

        mevent.detail.eventShowLayer('popWingStamp');
        $("#popWingStamp img.sbox:eq(0)").addClass('on');
        $("#popWingStamp img.sbox:eq(1)").removeClass('on');

        esp.setBackgroundColor("#000000");
        esp.setBackgroundOpacity("0.0");
        esp.setDescription(" ");
        esp.setLoadingYn("N");
        esp.setIconYn("Y");
        esp.setAnimateYn("N");
        esp.setCloseYn("N");

        esp.showEchossCertificationPage({
            regionCode      : esp.REGION_CODE_TYPE.KOREA,
            languageCode    : esp.LANGUAGE_CODE_TYPE.ENGLISH,
            merchantCode : ($("#profile").val() == "prod") ? "V00A019B004" : "V00A071B011",
            licenseId       : ($("#profile").val() == "prod") ? "p7a3669ddf02f473f85a78070bba24ae1" : "d0ad5e74da0864f128fe200e7925bd5fd",
            userCode        : "",
            authKey : "",
            extData         : {}
        }, function(errorCode, errorMessage) {
            alert("날개 스탬프 인식에 오류가 있습니다. 다시 시도해주세요! ["+errorCode+"] ");
            if($('#echossStampLayer').length == 1){
                closeLayer();
            }
            if($('#popWingStamp .close:visible').length > 0){
                mevent.detail.eventCloseLayer();
            }
        });
    },

    onBeforeStamp : function(){
        if($('#popWingStamp:visible').length == 0){
            if($('#echossStampLayer').length == 1){
                closeLayer();
            }
        }
        monthEvent.detail.merchant = '';
    },

    certSuccess : function(result){
        if($('#popWingStamp:visible').length > 0){
            //날개 이미지 노출
            $("#popWingStamp img.sbox:eq(0)").removeClass('on');
            $("#popWingStamp img.sbox:eq(1)").addClass('on');

            setTimeout(function(){
                monthEvent.detail.merchant = result.merchant;
                monthEvent.detail.stmpApply();
            }, 1300);
        }
    },

    certError : function(errorCode, errorMessage){
        if(errorCode != "ES22"){
            alert("날개 스탬프 인식에 오류가 있습니다. 다시 시도해주세요! ["+errorCode+"] ");
        }
        monthEvent.detail.merchant = '';
    },

    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
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

                monthEvent.detail.showStmpLayer();
            }
        }
    },

    /* 기참여 체크 */
    checkStmpApply : function(){
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
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191011/checkStmpApplyJson.do"
                  , param
                  , monthEvent.detail._callback_checkStmpApplyJson
            );
        }
    },

    _callback_checkStmpApplyJson : function(json){
        if(json.ret == '0'){
            monthEvent.detail.showStmpLayer();
        }else if(json.ret == '016'){
            //위수탁 동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
            monthEvent.detail.layerPolice = true;
        }else{
            alert(json.message);
        }
    },

    /* 스탬프 찍기 */
    stmpApply : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , startDate : $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8)
                    , MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                    , MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
                    , noteCont : monthEvent.detail.merchant
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20191011/stmpApplyJson.do"
                  , param
                  , monthEvent.detail._callback_stmpApplyJson
            );
        }
    },

    _callback_stmpApplyJson : function(json){
        mevent.detail.eventCloseLayer();

        if(json.ret == '0'){
            if(json.fvrSeq == '1'){
                //매장 쿠폰 팝업 노출하기
                mevent.detail.eventShowLayer('popStore1');
            }else{
                if(json.fvrSeq =='3' || json.winYn == 'N'){
                    mevent.detail.eventShowLayer('evtGiftFail');
                }else if(json.fvrSeq =='4'){
                    $('#evtGift7 .win_number').text('('+json.tgtrSeq+')');
                    mevent.detail.eventShowLayer('evtGift7');
                }else if(json.fvrSeq =='5'){
                    $('#evtGift6 .win_number').text('('+json.tgtrSeq+')');
                    mevent.detail.eventShowLayer('evtGift6');
                }else if(json.fvrSeq =='6'){
                    $('#evtGift5 .win_number').text('('+json.tgtrSeq+')');
                    mevent.detail.eventShowLayer('evtGift5');
                }else if(json.fvrSeq =='7'){
                    $('#evtGift4 .win_number').text('('+json.tgtrSeq+')');
                    mevent.detail.eventShowLayer('evtGift4');
                }else if(json.fvrSeq =='8'){
                    $('#evtGift3 .win_number').text('('+json.tgtrSeq+')');
                    mevent.detail.eventShowLayer('evtGift3');
                }else if(json.fvrSeq =='9'){
                    $('#evtGift1 .win_number').text('('+json.tgtrSeq+')');
                    mevent.detail.eventShowLayer('evtGift1');
                }else if(json.fvrSeq =='10'){
                    $('#evtGift2 .win_number').text('('+json.tgtrSeq+')');
                    mevent.detail.eventShowLayer('evtGift2');
                }
            }
            monthEvent.detail.getMyStmpApplyCnt();
        }else{
            alert(json.message);

            //레이어 닫기
            if($('#echossStampLayer').length == 1){
                closeLayer();
            }
            if($('#popWingStamp .close:visible').length > 0){
                mevent.detail.eventCloseLayer();
            }
        }
    },

    /* 나의 스탬프 개수 조회 */
    getMyStmpApplyCnt : function(){
        if(common.isLogin() == true){
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20191011/getMyStmpApplyCntJson.do"
                  , param
                  , monthEvent.detail._callback_getMyStmpApplyCntJson
            );
        }
    },

    _callback_getMyStmpApplyCntJson : function(json){
        if(json.ret == '0'){
            //스탬프 현황
            $('.totalStamp em').text(json.stmpCnt);
            for(var wingIdx=0; wingIdx<json.stmpCnt; wingIdx++){
                $('.wingStamp li.wing'+(wingIdx*1+1)).addClass('on');
            }
        }
    },

    /* 나의 쿠폰함 */
    getMyCoupon : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20191011/getMyCouponJson.do"
              , param
              , monthEvent.detail._callback_getMyCouponJson
        );
    },

    _callback_getMyCouponJson : function(json){
        if(json.ret == '0'){
            if(json.confirmStaffYn == 'Y'){
                mevent.detail.eventShowLayer('popStore2');
                $('#popStore1').remove();
            }else{
                mevent.detail.eventShowLayer('popStore1');
            }
        }else{
            alert(json.message);
        }
    },

    /* 직원확인 */
    confirmStaff : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        if(confirm("직원 확인 이후 쿠폰 사용 처리되며, 재사용 불가합니다. 사용하시겠습니까?")){
            mevent.detail.eventCloseLayer();
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                    , _baseUrl + "event/20191011/confirmStaff.do"
                    , param
                    , monthEvent.detail._callback_getStaffConfirmJson
            );
        }
    },

    _callback_getStaffConfirmJson : function(json){
        if(json.ret == "0"){
            //직원확인 완료
            mevent.detail.eventShowLayer('popStore2');
            $('#popStore1').remove();
        }else{
            alert(json.message);
        }
    },

    /* 당첨내역 확인 */
    getStmpMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getStmpMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },

    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>당첨 내역이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("tbody#myWinListHtml").html(myWinListHtml);

            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else{
            alert(json.message);
        }
    }

}