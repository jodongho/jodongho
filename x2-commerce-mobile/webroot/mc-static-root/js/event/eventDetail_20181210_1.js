/** 
 * 배포일자 : 2018.12.06
 * 오픈일자 : 2018.12.10
 * 이벤트명 : 오늘드림
 * */ 

$.namespace("monthEvent.detail"); 
monthEvent.detail = {

        init : function(){
            
            if($("#eventTabFixed").length == 1) {
                $(window).scroll(function(){
                    var scrollTop = $(document).scrollTop();
                    var tabHeight =$("#eventTabImg").height() + 203;
                    if (scrollTop > tabHeight) {
                        $("#eventTabFixed")
                        .css("position","fixed")
                        .css("top","0px");
                    } else {
                        $("#eventTabFixed")
                        .css("position","absolute")
                        .css("top","");
                    }
                });
            }
            
            // 2. base layer close
            $(".eventHideLayer1").click(function(){
                $('.eventLayer').hide();
                $('#eventDimLayer').hide();
            });
            
            //랜덤 숫자 가져오는 함수
            var fnRandomNum = function(max){            //랜덤 숫자 가져오는 함수(0~max사이의 값)
                return Math.floor(Math.random() * max);
            }

            var eventFull_len = $('.swiper-wrapper').children('li').length;       //FULL 배너 slide 갯수
            var eventFull_init_no = fnRandomNum(eventFull_len);                  //FULL 배너 slide  초기번호 

            //이벤트 FULL 배너 slide
            var eventSlide_set = {
                slidesPerView: 1,
                initialSlide : 0,
                autoplay: 4000,
                pagination:'.paging',
                paginationBulletRender: function (index, className) {
                return '<span class="swiper-pagination-bullet">' + (className + 1) + '</span>';
                },
                autoplayDisableOnInteraction: true,
                paginationClickable: true,
                freeMode: false,
                spaceBetween: 0,
                loop: true,
                nextButton: '.next',
                prevButton: '.prev'
            }, visual_swiper = Swiper('.slideType1', eventSlide_set );      
            
        },

        /**
         * 회원등급체크(VIP ID당 2매)
         * 회원등급체크(VVIP ID당 4매)
         */
        
        downCouponGradeCheckJson : function(obj){
//            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
//                if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
//                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
//                }else{
//                    return;
//                }
//            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    
                    var memberGrade = obj;

                    //grade chk
                    var param = {
                            reqMemGrade : memberGrade
                    };
                    common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20181210_1/downCouponGradeCheckJson.do"
                        , param
                        , function(json){
                            if(json.ret == "0"){
                                var grade = json.message;
                                var setCpnDownCnt="0";
                                
                                if("VVIP" == grade){
                                    
                                    /**오늘드림 VVIP
                                     * DEV : VVIP C000000000346 g0CzCBI3VCZFa36Z6Z2CkQ==
                                     * QA : VVIP C000000005494 g0CzCBI3VCbbSNzbh7W7tw==
                                     * PRD : VVIP : C000000007351 g0CzCBI3VCa3DGb5mnT3MA==
                                     * */
                                    
                                    var cpnNoVvip = "";
                                    
                                    if($("#profile").val() == "dev"){
                                        cpnNoVvip = "g0CzCBI3VCZFa36Z6Z2CkQ==";
                                    }else if($("#profile").val() == "qa"){
                                        cpnNoVvip = "g0CzCBI3VCbbSNzbh7W7tw==";
                                    }else if($("#profile").val() == "prod"){
                                        cpnNoVvip = "g0CzCBI3VCa3DGb5mnT3MA==";
                                    }
                                    
                                    //1. VVIP 쿠폰 4번 발급
                                    setCpnDownCnt = "4";
                                    
                                    monthEvent.detail.downCouponJson(cpnNoVvip, setCpnDownCnt, grade);
                                    
                                }else if("VIP" == grade){
                                    
                                    //2. VIP 쿠폰 2번 발급
                                    
                                    /**오늘드림 VVIP
                                     * DEV : VIP C000000000345 g0CzCBI3VCZKOdyIj88xWg==
                                     * QA : VIP C000000005493 g0CzCBI3VCaw9g6bDYmN+g==
                                     * PRD : VIP  : C000000007350 g0CzCBI3VCaGCNVbn8ATqw==
                                     * */
                                    
                                    var cpnNoVip = "";
                                    
                                    if($("#profile").val() == "dev"){
                                        cpnNoVip = "g0CzCBI3VCZKOdyIj88xWg==";
                                    }else if($("#profile").val() == "qa"){
                                        cpnNoVip = "g0CzCBI3VCaw9g6bDYmN+g==";
                                    }else if($("#profile").val() == "prod"){
                                        cpnNoVip = "g0CzCBI3VCaGCNVbn8ATqw==";
                                    }
                                    
                                    //1. VIP 쿠폰 2번 발급
                                    setCpnDownCnt = "2";
                                    
                                    monthEvent.detail.downCouponJson(cpnNoVip, setCpnDownCnt, grade);
                                }
                                
                            }else{
                                alert(json.message); //등급 조건이 맞지 않거나 잘못된 등급
                            }
                        }
                    );
                }
//            }
        },
        
        
        /* 
         * 기능 : 원하는 횟수만큼 쿠폰 다운로드 
         * “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
         */
        downCouponJson : function(cpnNo, cpnDownCnt, cpnGrade) {
//            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
//                if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
//                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
//                }else{
//                    return;
//                }
//            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    if(!mevent.detail.checkRegAvailable()){
                        return;
                    }
                    if(typeof cpnNo == "undefined" || cpnNo == ""){
                        alert("쿠폰 번호가 없습니다.");
                        return;
                    }
                    var param = {cpnNo : cpnNo, cpnDownCnt : cpnDownCnt, cpnType : cpnGrade};
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "event/20181210_1/downCouponCustomJson.do"
                            , param
                            , this._callback_downOrdCouponJson
                     );
                }
//            }
        },
        _callback_downOrdCouponJson : function(json) {

            if(json.ret == '0'){
                if("VVIP"==json.cpnType){
                    mevent.detail.eventShowLayer('coupon_vv');
                }else if("VIP"==json.cpnType){
                    mevent.detail.eventShowLayer('coupon_v');
                }else{
                    alert(json.message);
                }
            }
        },
};