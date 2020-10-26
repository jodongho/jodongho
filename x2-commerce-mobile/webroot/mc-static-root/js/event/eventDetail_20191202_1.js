/**
 * 12월 브랜드세일 인덱스 페이지
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    baseImgPath : _cdnImgUrl + "contents/201912/02brandSale/",
    doubleCpnIdx : '',
    firstCpnIdx : '',
    appIng : false,
    toDt : '',
    init : function(){
        monthEvent.detail.toDt = $('#imgUrlConnectDay').val();

        //마지막날 상단 타이틀
        if($("input[id='reCommend']:hidden").val().substring(0,8) == monthEvent.detail.toDt.substring(0,8)){
            $('.evtConTop .imgBox img').attr("src", monthEvent.detail.baseImgPath + 'img_mc_tit_last.gif');
        }

        monthEvent.detail.setting();

        //중복쿠폰 선택 초기화
        $('[name=dubbleCoupon]').attr('checked',false);

        //매일 새로운 특가
        if('191202' <= monthEvent.detail.toDt.substring(2,8)){
            $(".evtCon05 img").attr("src", monthEvent.detail.baseImgPath + 'img_mc_cnt05_' + monthEvent.detail.toDt.substring(2,8) + '.jpg');
        }

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

    //랜덤 쿠폰 소진 체크
    setting : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,toDt : monthEvent.detail.toDt
                ,reCommend : $("input[id='reCommend']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20191202_1/getLimitDownPsbCpn.do"
              , param
              , function(json){
                  if(json.ret == "0"){
                      $('.time0'+json.cTab).addClass('on');
                      $('.randomTitle').addClass(json.cOpenDt);
                      //소진 완료
                      if(json.psbCpn == 'Y'){
                          $('.couponArea').addClass('soldOut ' + json.psbCpnSoldOutTm);
                          $('.randomCoupon').removeAttr('onclick');
                      }
                      $('#randomLastDt').text('('+json.cEndDt+')');
                  }
              }
        );
    },

    downRndmCoupon : function(){
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
            if(monthEvent.detail.appIng){
                return;
            }
            monthEvent.detail.appIng = true;

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,toDt : monthEvent.detail.toDt
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191202_1/downRndmCoupon.do"
                  , param
                  , monthEvent.detail._callback_downRndmCoupon
            );
        }
    },

    _callback_downRndmCoupon : function(json){
        if(json.ret == '0' || json.ret == '009' || json.ret == '010' || json.ret == '011' || json.ret == '012'){
            $('.randomDiscount').addClass('random'+json.myCpnRate);
            $('.randomTxt').addClass('random'+json.myCpnRate+'_txt');

            //쿠폰함으로 이동
            $('.randomCoupon').attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');').addClass('on');

            setTimeout(function(){
                if(json.ret == '0'){
                    alert('쿠폰이 발급되었습니다.');
                }else{
                    //기발급
                    alert('이미 발급되었습니다.');
                }
            }, 1000);
        }else{
            alert(json.message);
        }
        monthEvent.detail.appIng = false;
    },

    /* 중복쿠폰 발급 */
    getDownPsbDoubleCpn : function(){
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
            if(monthEvent.detail.appIng){
                return;
            }
            if($('[name=dubbleCoupon]:checked').length != 1){
                alert('원하는 쿠폰 선택 후 쿠폰을 받아주세요.');
                return;
            }
            monthEvent.detail.appIng = true;
            monthEvent.detail.doubleCpnIdx = $('[name=dubbleCoupon]:checked').attr('id').replace('radioCheck','');

            var inCpnNoArr = new Array;
            inCpnNoArr.push($('#dbCpnNo1').val());
            inCpnNoArr.push($('#dbCpnNo2').val());
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , noteCont : $('#dbCpnNo'+monthEvent.detail.doubleCpnIdx).val()
                    , inCpnNoArr : inCpnNoArr.toString()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191202_1/getDownPsbDoubleCpn.do"
                  , param
                  , monthEvent.detail._callback_getDownPsbDoubleCpn
            );
        }
    },

    _callback_getDownPsbDoubleCpn : function(json){
        if(json.ret == '0' || json.ret == '009' || json.ret == '010' || json.ret == '011' || json.ret == '012'){
            if(json.myCpnRate == '2000'){
                $('.dCouponCnt:eq(1)').addClass('couponDisable');
                $('.dCouponCnt:eq(1) input:radio').attr('disabled', true);
                $('.dCouponCnt:eq(0) input:radio').attr('checked', true);
            }else if(json.myCpnRate == '4000'){
                $('.dCouponCnt:eq(0)').addClass('couponDisable');
                $('.dCouponCnt:eq(0) input:radio').attr('disabled', true);
                $('.dCouponCnt:eq(1) input:radio').attr('checked', true);
            }
            //쿠폰함으로 이동
            $('.btnArea').addClass('on');
            $('.dubbleArea .couponDown1').attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');');
        }
        if(!json.ret == '0'){
            alert(json.message);
        }
        monthEvent.detail.appIng = false;
    },

    downAppCoupon : function(idx){
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
                monthEvent.detail.firstCpnIdx = idx;
                var param = {
                        cpnNo : $('#dbCpnNo'+monthEvent.detail.firstCpnIdx).val()
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/downCouponOfEvtJson.do"
                        , param
                        , monthEvent.detail._callback_downAppCoupon
                );
            }
        }
    },

    _callback_downAppCoupon : function(json) {
        if(json.ret == '0' || json.ret == '009' || json.ret == '010' || json.ret == '011' || json.ret == '012'){
            //쿠폰함으로 이동
            $('.couponDown'+(monthEvent.detail.firstCpnIdx*1-1)).attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');').addClass('on');
        }
        if(!json.ret == '0'){
            alert(json.message);
        }
    },

    /* 나의 구매알리미 확인하기 */
    getOrdAmtList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(monthEvent.detail.appIng){
            return;
        }
        monthEvent.detail.appIng = true;

        var dispCatNoArr = new Array;
        for(var i = 0; i < $('[name=ordDispCatNo]').length; i++){
            dispCatNoArr.push($('[name=ordDispCatNo]:eq(' + i + ')').val());
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , dispCatNoArr : dispCatNoArr.toString()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20191202_1/getOrdAmtList.do"
              , param
              , monthEvent.detail._callback_getOrdAmtList
        );
    },

    _callback_getOrdAmtList : function(json){
        if(json.ret == "0"){
            $('.specialArea .btnArea').removeClass('on');
            $('.specialList li:eq(0)').addClass(json.dispTab1);
            $('.specialList li:eq(1)').addClass(json.dispTab2);
            $('.specialList li:eq(2)').addClass(json.dispTab3);
            $('.specialList li:eq(3)').addClass(json.dispTab4);
        }else{
            alert(json.message);
        }
        monthEvent.detail.appIng = false;
    },

    /* 기프트카드 응모 */
    applyGiftCard : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }
            if(monthEvent.detail.appIng){
                return;
            }

            if($('.specialArea .btnArea').hasClass('on')){
                alert('나의 구매이력 확인 후 응모해주세요.');
                return;
            }

            if(!$('.specialList li').hasClass('on')){
                alert('“20주년 Special 기획전＂상품 구매 고객만 응모 가능합니다.');
                return;
            }
            monthEvent.detail.appIng = true;

            var dispCatNoArr = new Array;
            for(var i = 0; i < $('[name=ordDispCatNo]').length; i++){
                dispCatNoArr.push($('[name=ordDispCatNo]:eq(' + i + ')').val());
            }
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : '12'
                    , dispCatNoArr : dispCatNoArr.toString()
                    , MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                    , MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191202_1/applyGiftCard.do"
                  , param
                  , monthEvent.detail._callback_applyGiftCard
            );
        }
    },

    _callback_applyGiftCard : function(json){
        if(json.ret == '016' || json.ret == '017'){
            //위수탁동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
            monthEvent.detail.layerPolice = true;
        }else if(json.ret == "013"){
            alert('이미 응모하셨습니다.');
        }else if(json.ret == "0"){
            alert('응모되었습니다.');
        }else{
            alert(json.message);
        }
        monthEvent.detail.appIng = false;
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

                monthEvent.detail.applyGiftCard();
            }
        }
    }

}