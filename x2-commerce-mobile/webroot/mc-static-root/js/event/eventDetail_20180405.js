$.namespace("monthEvent.detail");
monthEvent.detail = {
    snsInitYn : "N",
    snsTitle : "올리브영 온라인몰X몽블리몬스터 이모티콘 100%증정! 드루와♥",

    init : function(){
        if(common.isLogin()){
            // 발급여부 확인
            monthEvent.detail.getMyMongvelyCpnChkJson();
        };
        
        /* 닫기 */
        $(".eventHideLayer").click(function(){
            mevent.detail.eventCloseLayer();
        });
        
        var fnRandomNum = function(max){            //랜덤 숫자 가져오는 함수(0~max사이의 값)
            return Math.floor(Math.random() * max);
        }

        /* ===앱푸시 수신동의 안내 이미지 슬라이드용=== */
        var eventFull_len = $('.swiper-wrapper').children('li').length;       //FULL 배너 slide 갯수
        var eventFull_init_no = fnRandomNum(eventFull_len);                //FULL 배너 slide  초기번호 

        //이벤트 FULL 배너 slide
        var eventSlide_set = {
            slidesPerView: 1,
            initialSlide : 0,
            /*autoplay: 4000,*/
            autoplay: false,
            pagination: '.paging',
            autoplayDisableOnInteraction: true,
            paginationClickable: true,
            freeMode: false,
            spaceBetween: 0,
            loop: false,
            nextButton: '.next',
            prevButton: '.prev'
        }, visual_swiper = Swiper('.slideType1', eventSlide_set );
        /* ===//앱푸시 수신동의 안내 이미지 슬라이드용=== */
    },
    
    /* 앱 푸시 설정 바로가기 */
    goSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 설정해 주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180405/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    },
    
    /**
     * 내 몽블리 이모티콘 난수쿠폰 정보 확인
     */
    getMyMongvelyCpnChkJson : function(){
        //앱 일 경우만
        if(common.app.appInfo != undefined && common.app.appInfo.isapp){
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여 가능합니다.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180405/getMyMongvelyCpnChkJson.do"
                      , param
                      , this._callback_getMyMongvelyCpnChkJson
                );
            }
        }
    },
    _callback_getMyMongvelyCpnChkJson : function(json) {
        if(json.ret == "0"){
            $(".coupon_area").css("display", "block");
            $("#rndmVal").text(json.rndmVal);
            $("#layerRndmVal").html("<textarea class='coupon_num2' readonly=''>" + json.rndmVal + "</textarea>");
        }
    },
    
    /**
     * 몽블리 이모티콘 난수쿠폰 발급 이벤트 참여여부 확인
     */
    getMongvelyCpnChkJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180405/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여 가능합니다.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                if(typeof fvrSeq == "undefined" || fvrSeq == ""){
                    alert("쿠폰 정보가 없습니다.");
                    return;
                }
                var param = {
                        fvrSeq : "1"
                      , evtNo : $("input[id='evtNo']:hidden").val()
                };
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180405/getMongvelyCpnChkJson.do"
                      , param
                      , this._callback_getMongvelyCpnChkJson
                );
            }            
        }        
    },
    _callback_getMongvelyCpnChkJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.getMongvelyCpnDownJson();
        }else{
            alert(json.message);
        }
    },
    
    /**
     * 몽블리 이모티콘 난수쿠폰 발급
     */
    getMongvelyCpnDownJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180405/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(common.isLogin() == false){
                if(!confirm("로그인 후 참여 가능합니다.")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                if(!mevent.detail.checkRegAvailable()){
                    return;
                }
                if(typeof fvrSeq == "undefined" || fvrSeq == ""){
                    alert("쿠폰 정보가 없습니다.");
                    return;
                }
                var param = {
                        fvrSeq : "1"
                      , evtNo : $("input[id='evtNo']:hidden").val()
                };
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180405/getMongvelyCpnDownJson.do"
                      , param
                      , this._callback_getMongvelyCpnDownJson
                );
            }            
        }        
    },
    _callback_getMongvelyCpnDownJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.getMyMongvelyCpnChkJson();
        }else{
            if(json.ret == "051"){
                mevent.detail.eventShowLayer('evtSoldout');
            }else{
                alert(json.message);
            }
        }
    },
    
    /* sns 공유 */
    shareSns : function(type){
        if(type == "url"){
            $("#linkUrlStr").html("<textarea style='width:100%;' readonly=''>" + _baseUrl + "E.do?evtNo=" + $("#evtNo").val() + "</textarea>");
            mevent.detail.eventShowLayer('eventLayerURL');
        }else{
         // 배너 이미지 체크
            var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
            if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
                bnrImgUrlAddr = "";
            } else {
                bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
            }

            var imgUrl = "";
            // 이미지가 없을 경우 배너로 교체
            if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
                imgUrl = bnrImgUrlAddr;
            }

            var snsShareUrl = _baseUrl + "E.do?evtNo="+$("#evtNo").val();
            var title = monthEvent.detail.snsTitle;
            
            if(monthEvent.detail.snsInitYn == "N"){
                common.sns.init(imgUrl, title, snsShareUrl);
                monthEvent.detail.snsInitYn = "Y";
            }
            
            common.sns.doShare(type);
        }
    },
}
