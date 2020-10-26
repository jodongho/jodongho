/**
 * 배포일자 : 2020.02.06
 * 오픈일자 : 2020.02.10
 * 이벤트명 : 리뷰를 깨워라
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    applyIng : false,
    init : function(){
        //리뷰 현황 조회
        monthEvent.detail.getMyReview();

        //응모하기
        $(".evtCon02 .btn_review").click(function(){
            if($(this).hasClass('rv_on')){
                monthEvent.detail.applyReview();
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

        var swiper = new Swiper('.review-swiper-container', {
          slidesPerView: 1,
          initialSlide: 0,
          autoplay: 4000,
          pagination: '.paging',
          nextButton: '.next',
          prevButton: '.prev',
          autoplayDisableOnInteraction: true,
          paginationClickable: true,
          freeMode: false,
          spaceBetween: 0,
          loop: true,
          pagination: '.swiper-pagination',
          navigation: {
            nextEl: '.swiper-button.next',
            prevEl: '.swiper-button.prev',
          },
        });
    },

    /* 리뷰 상태 셋팅 */
    getMyReview : function(){
        if(common.isLogin()){
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , startDate : $("input[id='startDate']:hidden").val()
                    , endDate : $("input[id='endDate']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                    , _baseUrl + "event/20200210/getMyReview.do"
                    , param
                    , monthEvent.detail._callback_getMyReview
            );
        }
    },

    _callback_getMyReview : function(json){
        if(json.ret == "0"){
            $('.stamp1').addClass(common.isEmpty(json.contOn) ? '' : json.contOn);
            $('.stamp2').addClass(common.isEmpty(json.photoOn) ? '' : json.photoOn);

            if(json.reviewPsb == 'Y'){
                if(!common.isEmpty(json.contOn) && !common.isEmpty(json.photoOn)){
                    //응모 가능
                    $(".evtCon02 .btn_review").removeClass().addClass('sbox btn_review rv_on');
                }else{
                    $(".evtCon02 .btn_review").removeClass().addClass('sbox btn_review');
                }
                if(json.addYn == 'Y'){
                    //응모 완료
                    $(".evtCon02 .btn_review").removeClass().addClass('sbox btn_review rv_complete');
                }
            }else{
                //비대상자
                $(".evtCon02 .btn_review").removeClass().addClass('sbox btn_review rv_off');
            }
        }
    },

    /* 경품 응모 */
    applyReview : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP에서만 참여가능합니다.")){
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
                    , mbrInfoUseAgrYn :  $(':radio[name="argee1"]:checked').val()
                    , mbrInfoThprSupAgrYn :  $(':radio[name="argee2"]:checked').val()
                    , startDate : $("input[id='startDate']:hidden").val()
                    , endDate : $("input[id='endDate']:hidden").val()
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20200210/applyReview.do"
                      , param
                      , monthEvent.detail._callback_applyReview
                );
            }
        }
    },

    _callback_applyReview : function(json){
        if(json.ret == '016' || json.ret == '017'){
            //위수탁동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
            monthEvent.detail.layerPolice = true;
        }else if(json.ret == '0'){
            $('#evtGift1 .win_number').text('(' + json.tgtrSeq + ')');
            $(".evtCon02 .btn_review").removeClass().addClass('sbox btn_review rv_complete');
            mevent.detail.eventShowLayer('evtGift1');
        }else{
            alert(json.message);
        }
        monthEvent.detail.applyIng = false;
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

                monthEvent.detail.applyReview();
            }
        }
    },

    /* 앱 푸시 설정 바로가기 */
    goSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("APP에서 설정 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    }
}