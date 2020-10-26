/**
 * 12월 탑리뷰어
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    applyIng : false,
    init : function(){

        //리뷰 점수, 응모 완료/가능 횟수 조회
        monthEvent.detail.getReviewStatus();

        $('.btnGift').on('click', function(){
            if($(this).hasClass('on')){
                monthEvent.detail.topReviewApply();
            }
        });

        //위수탁동의 닫기
        $('#eventLayerPolice div.agreeBtn').on('click', function(){
            monthEvent.detail.popLayerConfirm();
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

        var galleryThumbs = new Swiper('.tabThumbs', {
            spaceBetween:0,
            slidesPerView: 4, 
            freeMode: true,
            loop: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
        });
        var galleryTop = new Swiper('.tabSlideArea', {
            spaceBetween: 0,
            initialSlide : 0, 
            navigation: false, 
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            thumbs: {
                swiper: galleryThumbs
            }
        });
    },

    //리뷰 점수, 응모 완료/가능 횟수 조회
    getReviewStatus : function(){
        if(common.isLogin()){
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191216/getReviewStatus.do"
                  , param
                  , monthEvent.detail._callback_getReviewStatus
            );
        }
    },

    _callback_getReviewStatus : function(json){
        if(json.ret == '0'){
            $('.gameMarker').removeClass().addClass('gameMarker').addClass('markerStep'+json.moveCnt);
            $('.count1').html($('<span/>').append('회')).prepend((json.applyCnt*1)<0 ? 0 : json.applyCnt);
            $('.count2').html($('<span/>').append('회')).prepend((json.possibleCnt*1)<0 ? 0 : json.possibleCnt);

            if(json.possibleCnt*1 > 0){
                $('.btnGift').addClass('on');
            }else{
                $('.btnGift').removeClass('on');
            }
        }
    },

    /* 나의 리뷰 활동 현황 */
    getMyReviewList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20191216/getReviewStatus.do"
                  , param
                  , monthEvent.detail._callback_getMyReviewList
            );
        }
    },

    _callback_getMyReviewList : function(json){
        if(json.ret == '0'){
            $("#evtPopReviewDetail tbody tr:eq(0) td:eq(1)").text((json.profileYn == '1' ? '완료' : '미완료'));    //프로필
            $("#evtPopReviewDetail tbody tr:eq(1) td:eq(1)").text(json.giveCnt+'건');    //도움이 돼요 클릭
            $("#evtPopReviewDetail tbody tr:eq(2) td:eq(1)").text(json.receiveCnt+'건');    //도움이 돼요 받기
            $("#evtPopReviewDetail tbody tr:eq(3) td:eq(1)").text(json.shrtCnt+'건');    //한줄
            $("#evtPopReviewDetail tbody tr:eq(4) td:eq(1)").text(json.contCnt+'건');    //상세
            $("#evtPopReviewDetail tbody tr:eq(5) td:eq(1)").text(json.photoCnt+'건');    //포토
            mevent.detail.eventShowLayScroll('evtPopReviewDetail');

            $('.gameMarker').removeClass().addClass('gameMarker').addClass('markerStep'+json.moveCnt);
            $('.count1').html($('<span/>').append('회')).prepend((json.applyCnt*1)<0 ? 0 : json.applyCnt);
            $('.count2').html($('<span/>').append('회')).prepend((json.possibleCnt*1)<0 ? 0 : json.possibleCnt);

            if(json.possibleCnt*1 > 0){
                $('.btnGift').addClass('on');
            }else{
                $('.btnGift').removeClass('on');
            }
        }else{
            alert(json.message);
        }
    },

    /* 응모하기 */
    topReviewApply : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else if(!monthEvent.detail.applyIng){
            monthEvent.detail.applyIng = true;
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,MbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                    ,MbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/20191216/topReviewApply.do"
                    , param
                    , monthEvent.detail._callback_topReviewApply
            );
        }
    },

    _callback_topReviewApply : function(json) {
        mevent.detail.eventCloseLayer();
        monthEvent.detail.applyIng = false;
        if(json.ret == '016' || json.ret == '017'){
            //위수탁동의 팝업
            $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
            $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            mevent.detail.eventShowLayer('eventLayerPolice');
            $(".agreeCont")[0].scrollTop = 0;
            monthEvent.detail.layerPolice = true;

            return;
        }
        monthEvent.detail.getReviewStatus();
        if(json.ret == '0'){
            if(!common.isEmpty(json.tgtrSeq)){
                $(".win_number").text("("+json.tgtrSeq+")");
                if(json.fvrSeq == '1'){
                    mevent.detail.eventShowLayer('evtGift7');
                }else if(json.fvrSeq == '3'){
                    mevent.detail.eventShowLayer('evtGift5');
                }else if(json.fvrSeq == '4'){
                    mevent.detail.eventShowLayer('evtGift6');
                }else if(json.fvrSeq == '5'){
                    mevent.detail.eventShowLayer('evtGift4');
                }else if(json.fvrSeq == '6'){
                    mevent.detail.eventShowLayer('evtGift3');
                }else if(json.fvrSeq == '7'){
                    mevent.detail.eventShowLayer('evtGift2');
                }else if(json.fvrSeq == '8'){
                    mevent.detail.eventShowLayer('evtGift1');
                }
            }else{
                mevent.detail.eventShowLayer('evtGiftFail');
            }
        }else{
            alert(json.message);
        }
    },

    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
            alert("2가지 모두 동의 후 참여 가능합니다.");
            return;
        }

        if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
            monthEvent.detail.layerPolice = false;
            mevent.detail.eventCloseLayer();

            monthEvent.detail.topReviewApply();
        }
    },

    /* 당첨내역 확인 */
    getMyWinList : function(){
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
              , monthEvent.detail._callback_getMyWinList
        );
    },
    _callback_getMyWinList : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>당첨이력이<br/> 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("#evtPopWinDetail tbody").html(myWinListHtml);

            mevent.detail.eventShowLayer('evtPopWinDetail');
        }else{
            alert(json.message);
        }
    },

    /* 리뷰 작성하기 이동 */
    getGdasList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        common.link.commonMoveUrl('mypage/getGdasList.do');
    }
}