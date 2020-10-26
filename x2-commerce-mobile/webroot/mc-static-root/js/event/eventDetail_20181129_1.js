/** 
 * 배포일자 : 2018.11.22
 * 오픈일자 : 2018.11.29
 * 이벤트명 : OLIVE YOUNG BRAND SALE TAB1
 * */ 

$.namespace("monthEvent.detail"); 
monthEvent.detail = {

        init : function(){
            
            if($("#eventTabFixed").length == 1) {
                $(window).scroll(function(){
                    var scrollTop = $(document).scrollTop();
                    //var tabHeight =$("#eventTabImg").height() + 203;
                    var tabHeight = 202;
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
            
        },
        
        /**
         * 12월 브랜드세일 20% 쿠폰 (1)
         * 12월 브랜드세일 첫구매 30% (2)
         * 12월 브랜드세일 4천원 장바구니 (3)
         */
        chkDownCoupon : function(obj){
            var couponType = obj; //1 : 12월 브랜드세일 20% 쿠폰, 2 : 12월 브랜드세일 첫구매 30%, 3: 6만원이상 4천원 장바구니
            console.log(couponType);
            var cpnNo = "";
            
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
                
                if(couponType == '1'){
                    /*    
                    DEV :   C000000000337   12월 브랜드세일 20% 쿠폰        g0CzCBI3VCavPHcF2tqp8w==
                    QA  :   C000000005165   12월 브랜드세일 20% 쿠폰        g0CzCBI3VCYvdK9Qwgto7Q==
                    PRD :   C000000006836   세일 20%쿠폰    g0CzCBI3VCYUGhPDouTXUg==
                    
                    */
                    if($("#profile").val() == "dev"){
                        cpnNo = "g0CzCBI3VCavPHcF2tqp8w==";
                    }else if($("#profile").val() == "qa"){
                        cpnNo = "g0CzCBI3VCYvdK9Qwgto7Q==";
                    }else if($("#profile").val() == "prod"){
                        cpnNo = "g0CzCBI3VCYUGhPDouTXUg==";
                    }
                    
                }else if(couponType == '2'){
                    /*
                    DEV :   C000000000338 12월 브랜드세일 첫구매 30%       g0CzCBI3VCZthDZIBTZ80g==
                    QA  :   C000000005168   12월 브랜드세일 첫구매 30%       g0CzCBI3VCaAP7F852PaTA==
                    PRD :   C000000006837   세일 첫구매 30%쿠폰        g0CzCBI3VCYgtw9lKDghZA==
                    */
                    if($("#profile").val() == "dev"){
                        cpnNo = "g0CzCBI3VCZthDZIBTZ80g==";
                    }else if($("#profile").val() == "qa"){
                        cpnNo = "g0CzCBI3VCaAP7F852PaTA==";
                    }else if($("#profile").val() == "prod"){
                        cpnNo = "g0CzCBI3VCYgtw9lKDghZA==";
                    }
                    
                }else if(couponType == '3'){
                    /*
                    DEV :   C000000000339   12월 브랜드세일 4천원 장바구니      g0CzCBI3VCapZfFz+RQCSQ==
                    QA  :   C000000005166   12월 브랜드세일 4천원 장바구니      g0CzCBI3VCbqbVSjQsN2iA==
                    PRD :   C000000006838  6만원이상 4천원 장바구니 g0CzCBI3VCZmEs/HzmpWig==
                    */
                    if($("#profile").val() == "dev"){
                        cpnNo = "g0CzCBI3VCapZfFz+RQCSQ==";
                    }else if($("#profile").val() == "qa"){
                        cpnNo = "g0CzCBI3VCbqbVSjQsN2iA==";
                    }else if($("#profile").val() == "prod"){
                        cpnNo = "g0CzCBI3VCZmEs/HzmpWig==";
                    }
                }else{
                    alert("쿠폰 번호가 없습니다.");
                    return;
                }
                
                // coupon download
                monthEvent.detail.downCouponJson(cpnNo);
            }
        },
        
        
        /**
         * 12월 브랜드세일 20% 쿠폰 (1)
         * 12월 브랜드세일 첫구매 30% (2)
         * 12월 브랜드세일 4천원 장바구니 (3)
         */
        downCouponJson : function(cpnNo) {
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
                    if(!mevent.detail.checkRegAvailable()){
                        return;
                    }
                    if(typeof cpnNo == "undefined" || cpnNo == ""){
                        alert("쿠폰 번호가 없습니다.");
                        return;
                    }
                    var param = {cpnNo : cpnNo};
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "event/downCouponJson.do"
                            , param
                            , this._callback_downOrdCouponJson
                     );
                }
            }
        },
        _callback_downOrdCouponJson : function(json) {
            if(json.ret == '0'){
                alert(json.message);
            }
        },
};