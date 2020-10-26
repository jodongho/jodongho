/**
 * 9월 브랜드세일 인덱스
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    baseImgPath : _cdnImgUrl + "contents/201908/30brandSale/",
    appIng : false,
    toDt : '',
    init : function(){
        monthEvent.detail.setting();

        if('190830' <= $('#imgUrlConnectDay').val().substring(2,8)){
            $(".evtCon03 img").attr("src", monthEvent.detail.baseImgPath + 'img_mc_cnt03_' + $('#imgUrlConnectDay').val().substring(2,8) + '.jpg');
        }
        if('190902' <= $('#imgUrlConnectDay').val().substring(2,8)){
            $(".evtCon02 img").attr("src", monthEvent.detail.baseImgPath + 'img_mc_cnt02_2.jpg');
        }

        var eventSlide_set = {
            slidesPerView: 2.5, //3.5
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: false, 
            centeredSlides: false,    
            initialSlide : 0,
            autoplay: false, //4000,
            //pagination: '.paging',
            //nextButton: '.next',
            // prevButton: '.prev',
            autoplayDisableOnInteraction: true,
            paginationClickable: true,
            freeMode: false,
            spaceBetween: 0,
            loop: false 
        }, visual_swiper = Swiper('.dragType', eventSlide_set );

    },

    //시간 체크, 소진 체크
    setting : function(){
        var today = new Date();
        monthEvent.detail.toDt = today.getHours().lpad(2,'0');

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,toDt : monthEvent.detail.toDt
                ,reCommend : $("input[id='reCommend']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20190830/checkCouponJson.do"
              , param
              , function(json){
                  if(json.ret == "0"){
                      $('div.timeArea .time0'+ json.cTab).addClass('on');
                      $('.randomTitle').text(json.cTitle+' 랜덤 쿠폰');
                      $('.couponDes').html('(' +json.cEndDt+ ')')

                      if(json.psbCpn != 'Y'){
                          //soldOut
                          $('.randomCoupon').removeAttr('onclick');
                          $('.couponArea').addClass('soldOut '+ (json.psbCpnSoldOutTm == '' ? 'lastAll' : json.psbCpnSoldOutTm));
                          alert(soldOut);
                      }
                  }
              }
        );
    },

    downCouponJson : function(){
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
                  , _baseUrl + "event/20190830/downCouponJson.do"
                  , param
                  , monthEvent.detail._callback_downCouponJson
            );
        }
    },

    _callback_downCouponJson : function(json){
        if(json.ret == "0"){
            //$('.randomDiscount').text(json.cpnRate+'%');
            $('.randomDiscount').html('<span>'+json.cpnRate+'%</span>' );
            var cDes = $('.couponDes').html();
            if(json.cpnRate == '10'){
                $('.couponDes').html('최대 1,000원 할인<br>'+$('.couponDes').text())
            }else if(json.cpnRate == '20'){
                $('.couponDes').html('최대 2,000원 할인<br>'+$('.couponDes').text())
            }else if(json.cpnRate == '30'){
                $('.couponDes').html('최대 3,000원 할인<br>'+$('.couponDes').text())
            }else if(json.cpnRate == '40'){
                $('.couponDes').html('최대 4,000원 할인<br>'+$('.couponDes').text())
            }

            setTimeout(function(){
                alert(json.message);
            }, 200);
        }else{
            alert(json.message);
        }
        monthEvent.detail.appIng = false;
    }

}