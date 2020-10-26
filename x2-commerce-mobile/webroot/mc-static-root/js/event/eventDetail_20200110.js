/**
 * 배포일자 : 2020.01.02
 * 오픈일자 : 2020.01.10
 * 이벤트명 : 1월 매장 첫 리뷰
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    applyIng : false,
    gift1UseYn : false,
    gift2UseYn : false,
    confirmStaffYn : false,
    otpNo : '',
    myGiftIdx : '',
    btn_review : '',
    appPushIng : false,
    init : function(){
        var currDt = $("input[id='imgUrlConnectDay']:hidden").val();

        $('#evtGift1 .input_num input:text').prop('placeholder', '직원 확인 코드 입력');
        //app push 상태 조회
        common.app.getTmsPushConfig();

        //리뷰 현황 조회
        monthEvent.detail.getFirstReviewStatus();

        //작성가능 리뷰 조회
        monthEvent.detail.getPrGdasInfo();

        // 첫 리뷰 작성 여부 확인
        $(".btn_review").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                if($('.evtCon01 div.sbox').hasClass('rv_on')){
                    common.link.commonMoveUrl('mypage/getGdasList.do');
                }else if(monthEvent.detail.btn_review == 'pre'){
                    $('.evtCon01 div.sbox').addClass('rv_pre');
                }else if(monthEvent.detail.btn_review == 'first'){
                    $('.evtCon01 div.sbox').addClass('rv_complete');
                }else{
                    $('.evtCon01 div.sbox').addClass('rv_on');
                }
            }
        });

        $(".evtCon02 div.step1 .stepBtn").click(function(){
            if($(this).hasClass('on')){
                monthEvent.detail.applyGiftCard('1');
            }else if($(this).hasClass('evtComplete')){
                monthEvent.detail.getMyGiftCard('1');
            }
        });
        $(".evtCon02 div.step2 .stepBtn").click(function(){
            if($(this).hasClass('on')){
                monthEvent.detail.applyGiftCard('2');
            }else if($(this).hasClass('evtComplete')){
                monthEvent.detail.getMyGiftCard('2');
            }
        });
        $(".evtCon02 div.step3 .stepBtn").click(function(){
                monthEvent.detail.applyFirstReview();
        });

        //직원확인
        $("#evtGift1 .btn_confirm").click(function(){
            if(!common.isEmpty(monthEvent.detail.otpNo)
                    && ((monthEvent.detail.myGiftIdx == '1' && monthEvent.detail.gift1UseYn)
                            || (monthEvent.detail.myGiftIdx == '2' && monthEvent.detail.gift2UseYn))){
                if($('#evtGift1 .input_num input:text').val().trim() != '5290'){
                    alert('비밀번호가 틀렸습니다. 다시 시도해주세요');
                    return;
                }
                $('#evtGift1 .input_num input:text').val(monthEvent.detail.otpNo).attr('readonly', true);
                monthEvent.detail.otpNo = '';
            }else if(!monthEvent.detail.confirmStaffYn
                    && ((monthEvent.detail.myGiftIdx == '1' && !monthEvent.detail.gift1UseYn)
                    || (monthEvent.detail.myGiftIdx == '2' && !monthEvent.detail.gift2UseYn))){
                monthEvent.detail.confirmStaff();
            }
        });

        //직원확인 후 닫기 X
        $("#evtGift1 .close").click(function(){
            if(monthEvent.detail.confirmStaffYn
                    || (monthEvent.detail.myGiftIdx == '1' && monthEvent.detail.gift1UseYn)
                    || (monthEvent.detail.myGiftIdx == '2' && monthEvent.detail.gift2UseYn)){
                if(confirm("해당 기프트카드 번호는 사용완료 되었습니다.")){
                    mevent.detail.eventCloseLayer();
                }
            }else{
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

        /* app push 수신동의 현황 조회 */
        common.app.getTmsPushConfig();

        // app push 체크
        $('.evtCon03 .btnApp').on('click', function(){
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                if(common.app.appInfo == undefined || !common.app.appInfo.isapp) {
                    alert('모바일앱 설치 후 APP PUSH 수신동의 해주세요!');
                }else if(monthEvent.detail.appPushVer()){
                    if('Y' == common.app.appMktFlag){
                        alert('이미 수신 동의하셨어요.');
                        return;
                    }
                    if(!monthEvent.detail.appPushIng){
                        monthEvent.detail.appPushIng = true;
                        common.app.setTmsPushConfig('Y');
                        var appCheckTimer = setInterval(function(){
                            if('N' == common.app.pushConfigResult){
                                //수신동의 처리 실패
                                clearInterval(appCheckTimer);
                                monthEvent.detail.appPushIng = false;
                            }else if(!common.isEmpty(common.app.pushConfigResult) || !monthEvent.detail.appPushIng){
                                //처리 성공
                                clearInterval(appCheckTimer);
                                monthEvent.detail.appPushIng = false;
                            }
                        }, 300);
                    }
                }else{
                    common.app.callSettings();
                }
            }
        });
    },

    /* 작성가능 리뷰 조회 */
    getPrGdasInfo : function(){
        if(common.isLogin()){
            var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200110/getPrGdasInfo.do"
                  , param
                  , monthEvent.detail._callback_getPrGdasInfo
            );
        }
    },

    _callback_getPrGdasInfo : function(json){
        if(json.ret == "0"){
            if(!common.isEmpty(json.offMbrNm)){
                $('.evtCon04 .txt_userName span').text(json.offMbrNm);
            }

            if(json.gdasossibleList.length != 0){
                var list = json.gdasossibleList;

                $('.evtCon04 .txt_rv1 span').text( mevent.detail.toCurrency(list[0].offlinePossibeTotCnt) );
                $('.evtCon04 .txt_rv2 span:last').text( mevent.detail.toCurrency(list[0].offlinePossibeTotCnt*150) );
                $('.recentProduct_area .productList').children().remove();

                for(var i = 0; i < 4; i++ ){
                    if(i*1 >= json.gdasossibleList.length){
                        break;
                    }
                    var thnlPathNm = '';
                    var only_offline = '';
                    if(!common.isEmpty(list[i].goodsNo) && !common.isEmpty(list[i].thnlPathNm)){
                        thnlPathNm = _cdnImgUrl+'images/goods/'+ list[i].thnlPathNm;
                    }else{
                        thnlPathNm = _imgUrl+'/comm/offline_store.png';
                        only_offline = $('<span/>', {'class':'only_offline'}).text('매장전용');
                    }

                    $('.recentProduct_area .productList').append( $('<div/>', {'class':'productItem'}) );
                    $('.recentProduct_area .productList .productItem:last').append($('<div/>', {'class':'itemImage'})
                            .append($('<img/>', {'src':thnlPathNm, 'alt':'제품이미지'}))
                            .append(only_offline));
                    $('.recentProduct_area .productList .productItem:last').append(
                            $('<div/>', {'class':'itemDes'})
                                .append($('<div/>', {'class':'txt_orderDate'}).text('구매일자 : ').append($('<span/>').text( list[i].ordDate )))
                                .append($('<div/>', {'class':'txt_orderBrand'}).text( list[i].brndNm ))
                                .append($('<div/>', {'class':'txt_orderDetail'}).text( list[i].goodsNm ))
                    );

                    $('.recentProduct_area .productList .productItem:last').append(
                        $('<div/>', {'class':'itemPointImg'}).append($('<img/>', {'src':_cdnImgUrl+'contents/202001/10topReviewer/img_point.png', 'alt':'최대 적립 포인트'}))
                    );
                }
                $('.recentProduct_area').removeClass('no_product');
            }
        }
    },

    /* 리뷰 상태 셋팅 */
    getFirstReviewStatus : function(){
        if(common.isLogin()){
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                    , _baseUrl + "event/20200110/getFirstReviewStatus.do"
                    , param
                    , monthEvent.detail._callback_getFirstReviewStatus
            );
        }
    },

    _callback_getFirstReviewStatus : function(json){
        if(json.ret == "0"){
            
            $('.stamp1, .evtCon02 .step1 .stepBtn').addClass( json.firstOn != 0 ? 'on' : '' );
            $('.stamp2, .evtCon02 .step2 .stepBtn').addClass( json.contOn != 0 ? 'on' : '' );
            $('.stamp3, .evtCon02 .step3 .stepBtn').addClass( json.photoOn != 0 ? 'on' : '' );
            
            //이전 리뷰 작성
            if(json.preOn == 'on'){
                monthEvent.detail.btn_review = 'pre';
            }
            //첫 리뷰 작성
            if(json.firstOn == 'on'){
                monthEvent.detail.btn_review = 'first';
                if(!common.isEmpty(json.gift1On)){
                    $('.evtCon02 .step1 .stepBtn').removeClass().addClass('stepBtn '+ json.gift1On);
                }
                if(!common.isEmpty(json.gift2On)){
                    $('.evtCon02 .step2 .stepBtn').removeClass().addClass('stepBtn '+ json.gift2On);
                }
                if(!common.isEmpty(json.gift3On)){
                    $('.evtCon02 .step3 .stepBtn').removeClass().addClass('stepBtn '+ json.gift3On);
                }
            }
            
            //사용 완료
            if(json.gift1UseO == 'Y' || json.gift1UseX == 'Y'){
                monthEvent.detail.gift1UseYn = true;
            }
            if(json.gift2UseO == 'Y' || json.gift2UseX == 'Y'){
                monthEvent.detail.gift2UseYn = true;
            }
            
            //응모 마감
            if(json.sbscSgtYn == 'N'){
                if(!$('.evtCon02 .step1 .stepBtn').hasClass('evtComplete')){
                    $('.evtCon02 .step1 .stepBtn').removeClass().addClass('stepBtn evtEnd');
                }
                if(!$('.evtCon02 .step2 .stepBtn').hasClass('evtComplete')){
                    $('.evtCon02 .step2 .stepBtn').removeClass().addClass('stepBtn evtEnd');
                }
                $('.evtCon02 .step3 .stepBtn').removeClass().addClass('stepBtn evtEnd');
            }
        }
    },

    /* 기프트카드 조회 */
    getMyGiftCard : function(idx){
        if(!$(".evtCon02 div.step"+idx+" .stepBtn").hasClass('evtComplete')){
            return;
        }
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("앱에서만 교환가능 해요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                monthEvent.detail.myGiftIdx = idx;
    
                var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,fvrSeq : monthEvent.detail.myGiftIdx
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20200110/getMyGiftCard.do"
                      , param
                      , monthEvent.detail._callback_getMyGiftCard
                );
            }
        }
    },

    _callback_getMyGiftCard : function(json){
        if(json.ret == "0"){
            monthEvent.detail.confirmStaffYn = false;

            $('#evtGift1 .input_num input:text').val('').attr('readonly', false);
            $('#evtGift1 .win_number').text(json.tgtrSeq);
            $('#evtGift1 .storeCardNum span:eq(0)').text(json.cardNo.substring(0,4));
            $('#evtGift1 .storeCardNum span:eq(1)').text(json.cardNo.substring(4,8));
            $('#evtGift1 .storeCardNum span:eq(2)').text(json.cardNo.substring(8,12));
            $('#evtGift1 .storeCardNum span:eq(3)').text(json.cardNo.substring(12));
            
            monthEvent.detail.otpNo = json.otpNo;

            //사용완료 딱지
            $('#evtGift1 h6').removeClass();
            if((monthEvent.detail.myGiftIdx == '1' && monthEvent.detail.gift1UseYn)
                    || (monthEvent.detail.myGiftIdx == '2' && monthEvent.detail.gift2UseYn)){
                $('#evtGift1 h6').addClass('cardUse');
            }

            mevent.detail.eventShowLayer('evtGift1');
            $(".evtCon02 div.step"+json.fvrSeq+" .stepBtn").removeClass('on').addClass('evtComplete');
        }
        if(json.ret != "0"){
            alert(json.message);
        }
    },

    /* 기프트카드 응모 */
    applyGiftCard : function(idx){
        if(!$(".evtCon02 div.step"+idx+" .stepBtn").hasClass('on')){
            return;
        }
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("앱에서만 교환가능 해요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                monthEvent.detail.myGiftIdx = idx;

                var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,fvrSeq : idx
                    ,cpnNo : $("input[id='evtCpnNo"+idx+"']:hidden").val()
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20200110/applyGiftCard.do"
                      , param
                      , monthEvent.detail._callback_getMyGiftCard
                );
            }
        }
    },

    /* 경품 응모 */
    applyFirstReview : function(){
        if(!$(".evtCon02 div.step3 .stepBtn").hasClass('on')){
            return;
        }
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("앱에서만 응모가능 해요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else if(monthEvent.detail.applyIng){
                return;
            }else{
                monthEvent.detail.applyIng = true;

                var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,mbrInfoUseAgrYn :  $(':radio[name="argee1"]:checked').val()
                    ,mbrInfoThprSupAgrYn :  $(':radio[name="argee2"]:checked').val()
                    ,fvrSeq : "3"
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20200110/applyFirstReview.do"
                      , param
                      , monthEvent.detail._callback_applyFirstReview
                );
            }
        }
    },

    _callback_applyFirstReview : function(json){
        if(json.ret == '016' || json.ret == '017'){
            //위수탁동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
            monthEvent.detail.layerPolice = true;
        }else if(json.ret == '0'){
            $(".evtCon02 div.step3 .stepBtn").removeClass('on').addClass('evtComplete');
            mevent.detail.eventShowLayer('popEvt');
        }else{
            alert(json.message);
        }
        monthEvent.detail.applyIng = false;
    },

    /* 직원 확인 */
    confirmStaff : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if($('#evtGift1 .input_num input:text').val().trim() != '5290'){
            alert('비밀번호가 틀렸습니다. 다시 시도해주세요');
            return;
        }
        if(confirm("직원 확인 완료 시, 기프트카드 재발급 및 재확인 불가합니다. 사용하시겠습니까?")){
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,fvrSeq : monthEvent.detail.myGiftIdx
                    ,noteCont : monthEvent.detail.myGiftIdx == '1' ? '4' : '5'
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                    , _baseUrl + "event/20200110/confirmStaff.do"
                    , param
                    , monthEvent.detail._callback_confirmStaff
            );
        }
    },

    _callback_confirmStaff : function(json){
        if(json.ret == '0'){
            //직원 확인 클릭 직후
            if(monthEvent.detail.myGiftIdx == '1'){
                monthEvent.detail.gift1UseYn = true;
            }else if(monthEvent.detail.myGiftIdx == '2'){
                monthEvent.detail.gift2UseYn = true;
            }
            monthEvent.detail.confirmStaffYn = true;
            $('#evtGift1 .input_num input:text').val(json.otpNo);
        }else{
            alert(json.message);
        }
    },

    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP에서만 응모 가능합니다.")){
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

                monthEvent.detail.applyFirstReview();
            }
        }
    },

    /* 앱 최신버전 체크 */
    appPushVer : function(){
        if(common.isLogin()){
            var tempCompareVersion = "";
            if (common.app.appInfo.ostype == "10") { // ios
                tempCompareVersion = '2.2.1';
            }else if(common.app.appInfo.ostype == "20"){ // android
                tempCompareVersion = '2.1.8';
            }
            if(common.app.appInfo.isapp && common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion) !=  "<"){
                return true;
            }
        }
        return false;
    },

    /* sms 수신동의 현황 조회 */
    getMyMarketingStatus : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200110/getMyMarketingStatus.do"
                  , param
                  , monthEvent.detail._callback_getMyMarketingStatus
            );
        }
    },

    _callback_getMyMarketingStatus : function(json){
        if(json.ret == "0"){
            if(json.currSmsRcvAgrYn == 'Y'){
                alert('이미 수신 동의하셨어요.');
            }else{
                //마이페이지 이동
                common.link.commonMoveUrl('mypage/getMemberInfoChangeForm.do');
            }
        }
    }
}
$(document).ready(function(){  //유투브 플레이어 
	$('.popGuide1').click(function() {
		$('.playMov').show();
		$("#video").attr('src','//www.youtube.com/embed/zOsooapGf-I?rel=0&playsinline=1');
	});

	$('.eventHideLayer').click(function() {
		$('.playMov').hide();
		$("#video").attr('src','');   
	});
}); 