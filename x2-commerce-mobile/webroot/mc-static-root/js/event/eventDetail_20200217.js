/**
 * 배포일자 : 2020.02.13
 * 오픈일자 : 2020.02.17
 * 이벤트명 : 오늘드림 3주차 2020원 딜 쿠폰
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    applyIng : false,
    currentDay : '',
    soldOut2020 : false,
    cpnIng : '',
    baseImgPath : _cdnImgUrl + "contents/202002/17todayDeal/",
    init : function(){
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

        if(monthEvent.detail.currentDay >= '20200217' && monthEvent.detail.currentDay <= '20200223'){
            $('.evtCon01 .imgBox img').attr('src', monthEvent.detail.baseImgPath + '/mc_cnt01_' + monthEvent.detail.currentDay.substring(4) + '.jpg');
            $('.prodName').html($('<span/>').text($('#pNm_'+monthEvent.detail.currentDay).val()));

            //상품 이동
            $('a.moveLink1').attr('href', 'javascript:common.link.commonMoveUrl("goods/getGoodsDetail.do?goodsNo=' + $('#pCd_'+monthEvent.detail.currentDay).val() + '")');
            $(".btnDeal").click(function(){
                common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=' + $('#pCd_'+monthEvent.detail.currentDay).val());
            });

            monthEvent.detail.getLimitDd1DownPsbCpn();
        }

        //쿠폰 받기
        $(".todayCoupon_area").click(function(){
            if(!$('.todayCoupon_area').hasClass('TcouponSoldout')){
                monthEvent.detail.getMyCpnInfo();
            }
        });

    },

    /* 쿠폰 소진 체크 */
    getLimitDd1DownPsbCpn : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , cpnNo1 : $("input[id='cpnNo1_"+monthEvent.detail.currentDay+"']:hidden").val()
                , cpnNo2 : $("input[id='cpnNo2']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "event/20200217/getLimitDd1DownPsbCpn.do"
                , param
                , monthEvent.detail._callback_getLimitDd1DownPsbCpn
        );
    },

    _callback_getLimitDd1DownPsbCpn : function(json){
        if(json.ret == "0"){
            $('.evtCon02 .txtDes p').text('선착순 '+ json.dd1DnldPsbCnt +'명');
            if(json.cpnSoldOut_2 == 'Y'){
                $('.TcouponDown').removeClass().addClass('TcouponDown coupon3000');
                $('.todayCoupon_area').addClass('TcouponSoldout');
            }else if(json.cpnSoldOut_1 == 'Y'){
                $('.TcouponDown').removeClass().addClass('TcouponDown coupon3000');
                monthEvent.detail.soldOut2020 = true;
            }
        }
    },

    /* 쿠폰 체크 */
    getMyCpnInfo : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else if(monthEvent.detail.applyIng){
            return;
        }else{
            var cpnNo1 = $("input[id='cpnNo1_"+monthEvent.detail.currentDay+"']:hidden").val();
            var cpnNo2 = $("input[id='cpnNo2']:hidden").val();
            if(common.isEmpty(cpnNo1) || common.isEmpty(cpnNo2)){
                return;
            }
            monthEvent.detail.applyIng = true;

            var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , cpnNo1 : cpnNo1
                , cpnNo2 : cpnNo2
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200217/getMyCpnInfo.do"
                  , param
                  , monthEvent.detail._callback_getMyCpnInfo
            );
        }
    },

    _callback_getMyCpnInfo : function(json){
        if(!common.isEmpty(json.myCpnRate)){
            monthEvent.detail.applyIng = false;
            if(confirm('#오늘드림 쿠폰을 이미 받으셨습니다! 쿠폰을 사용하러 가시겠습니까?')){
                common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=' + $('#pCd_'+monthEvent.detail.currentDay).val());
            }
        }else if(json.ret == '022'){
            monthEvent.detail.applyIng = false;
            alert('올리브영 임직원은 사용할 수 없는 쿠폰입니다');
        }else{
            if(!monthEvent.detail.soldOut2020){
                monthEvent.detail.downCpn($("input[id='cpnNo1_"+monthEvent.detail.currentDay+"']:hidden").val());
            }else{
                monthEvent.detail.cpnIng = '3000';
                monthEvent.detail.downCpn($("input[id='cpnNo2']:hidden").val());
            }
        }
    },

    /* 쿠폰 다운로드 */
    downCpn : function(inCpnNo){
        if(!mevent.detail.checkLogin()){
            return;
        }else{

            var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , cpnNo :  inCpnNo
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/downCouponOfEvtJson.do"
                  , param
                  , monthEvent.detail._callback_downCpn
            );
        }
    },

    _callback_downCpn : function(json){
        if(json.ret == '0'){
            var prNm = $('#pNm_'+monthEvent.detail.currentDay).val();
            if(common.isEmpty(prNm)){
                return;
            }
            var popTxt = $('#Tcoupon p'); 
            $(popTxt).html($(popTxt).html().replace('prdNm', prNm.substring(0, prNm.length-1)));
            
            if(json.myCpnRate == '3000'){
                $('.TcouponDown').removeClass().addClass('TcouponDown coupon3000');
                $('.TcouponImg').removeClass().addClass('TcouponImg coupon3000');
                $(popTxt).html($(popTxt).html().replace('cpnNm', '3,000원 할인 쿠폰'));
                $(popTxt).find('span').addClass('c_blue');
            }else{
                $('.TcouponDown').removeClass().addClass('TcouponDown coupon2020');
                $('.TcouponImg').removeClass().addClass('TcouponImg coupon2020');
                $(popTxt).html($(popTxt).html().replace('cpnNm', '2,020원 상품 딜 쿠폰'));
                $(popTxt).find('span').addClass('c_pink');
            }
            mevent.detail.eventShowLayerMov('Tcoupon');
        }else if(json.ret >= 13 && json.ret <= 17){
            //소진
            if(monthEvent.detail.cpnIng == '3000'){
                $('.TcouponDown').removeClass().addClass('TcouponDown coupon3000');
                $('.todayCoupon_area').addClass('TcouponSoldout');
                alert(json.message);
            }else{
                monthEvent.detail.cpnIng = '3000';
                monthEvent.detail.downCpn($("input[id='cpnNo2']:hidden").val());
            }
        }else{
            alert(json.message);
        }
        monthEvent.detail.applyIng = false;
    }
}