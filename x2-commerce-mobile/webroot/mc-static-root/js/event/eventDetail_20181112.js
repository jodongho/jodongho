/** 
 * 배포일자 : 2018.11.08
 * 오픈일자 : 2018.11.12
 * 이벤트명 : 수험생이벤트
     * 전고객 텐션업! 25% 쿠폰발급
     * 수험생 대박기원! 30% 쿠폰 발급
     * 기획전으로 처리한다.
 * */ 

$.namespace("monthEvent.detail"); 
monthEvent.detail = {
    
    sYear : "1998",
    eYear : "2000",
    
init : function(){
    
        // scroll class 변경
        var tabH = $(".treeTab img").height();
        $("#eventTabFixed2").css("height",tabH + "px");
    
        var tabHeight =$("#eventTabImg").height() + 203;
        var eTab01 = tabHeight + $("#evtConT01").height() - 5;
        var eTab02 = eTab01 + $("#evtConT02").height() - 5;
        var eTab03 = eTab02 + $("#evtConT03").height() - 5;
        var eTab04 = eTab03 + $("#evtConT04").height();
    
        var scrollTab  = $(document).scrollTop();
    
        if (scrollTab > tabHeight) {
            $("#eventTabFixed2")
            .css("position","fixed")
            .css("top","0px");
        }
       if (scrollTab < eTab01) {
            $("#eventTabFixed2").attr('class','tab01');
        } else if (scrollTab < eTab02) {
            $("#eventTabFixed2").attr('class','tab02');
        } else if (scrollTab < eTab03) {
            $("#eventTabFixed2").attr('class','tab03');
        };
        
        $(window).scroll(function(){
            var scrollTab  = $(document).scrollTop();
             if (scrollTab < eTab01) {
                $("#eventTabFixed2").attr('class','tab01');
            } else if (scrollTab < eTab02) {
                $("#eventTabFixed2").attr('class','tab02');
            } else if (scrollTab < eTab03) {
                $("#eventTabFixed2").attr('class','tab03');
            } 
    
            if (scrollTab > tabHeight) {
                $("#eventTabFixed2")
                .css("position","fixed")
                .css("top","0px");
            } else {
                $("#eventTabFixed2")
                .css("position","absolute")
                .css("top","");
            }
        });
        
        // 2. base layer close
        $(".eventHideLayer1").click(function(){
            $('.eventLayer').hide();
            $('#eventDimLayer').hide();
        });
        
    },
    
    /**
     * 기능 : 전고객 텐션업! 25% 쿠폰발급
     */
    chkDownCoupon25 : function(){
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
            
            /**전고객
             * DEV  : C000000000332    g0CzCBI3VCYhKQaYGQUxXQ==
             * QA :   C000000004934   g0CzCBI3VCZ+gneXMX/EYg==
             * PRD : C000000006552   g0CzCBI3VCZulsYXQSGHuA==
             * */
            
            var cpnNo25 = "";
            if($("#profile").val() == "dev"){
                cpnNo25 = "g0CzCBI3VCYhKQaYGQUxXQ==";
            }else if($("#profile").val() == "qa"){
                cpnNo25 = "g0CzCBI3VCZ+gneXMX/EYg==";
            }else if($("#profile").val() == "prod"){
                cpnNo25 = "g0CzCBI3VCZulsYXQSGHuA==";
            }
            
            // coupon download
            monthEvent.detail.downCouponJson25(cpnNo25);
        }
    },
    
    
    /* 
     * 기능 : 쿠폰  다운로드 
     * 쿠폰 : 전고객 텐션업! 25% 쿠폰발급
     * “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
     */
    downCouponJson25 : function(cpnNo25) {
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
                if(typeof cpnNo25 == "undefined" || cpnNo25 == ""){
                    alert("쿠폰 번호가 없습니다.");
                    return;
                }
                var param = {cpnNo : cpnNo25};
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
    
    

    /**
     * 기능 : 수험생 대박기원! 30% 쿠폰 발급
     */
    chkDownCoupon30 : function(){
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
            // coupon download
            monthEvent.detail.downCouponAgeCheckJson();
        }
    },
    
    downCouponAgeCheckJson : function(){
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
                
                /**수험생
                 * DEV : C000000000333    g0CzCBI3VCZCxSHONYoyQA==
                 * QA : C000000004935   g0CzCBI3VCYrekPX/CKdAw==
                 * PRD : C000000006553   g0CzCBI3VCaV45tZgfYxbA==
                 * */
                
                var cpnNo30 = "";
                if($("#profile").val() == "dev"){
                    cpnNo30 = "g0CzCBI3VCZCxSHONYoyQA==";
                }else if($("#profile").val() == "qa"){
                    cpnNo30 = "g0CzCBI3VCYrekPX/CKdAw==";
                }else if($("#profile").val() == "prod"){
                    cpnNo30 = "!!!!!!!!!!!!!!!!!!! 전 고객 운영 쿠폰 번호 넣어야 함 !!!!!!!!!!!!!!!!!!!";
                }
                
                //ageCheck : 1998 ~ 2000 년생 true
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , sYear : monthEvent.detail.sYear
                        , eYear : monthEvent.detail.eYear
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20181112/downCouponAgeCheckJson.do"
                        , param
//                        , this._callback_downOrdCouponJson
                        , function(json){
                            if(json.ret == "0"){
                                if(json.isAgeChk=="0"){
                                    // 여기는 ...한번 더 체크함.
                                    if(eval(monthEvent.detail.sYear) <=eval(json.birthYear) && eval(monthEvent.detail.eYear) >=eval(json.birthYear)){
                                        //1998년 ~ 2000년 생 맞는 경우
                                        monthEvent.detail.downCouponJson30(cpnNo30);
                                    }else{
                                        //1998년 ~ 2000년 생 아닌 경우
                                        alert("해당 쿠폰은 회원정보 기준 1998년 ~ 2000년 고객 대상 발급 쿠폰입니다.");
                                    }
                                }else{
                                    //1998년 ~ 2000년 생 아닌 경우
//                                    alert("해당 쿠폰은 회원정보 기준 1998년 ~ 2000년 고객 대상 발급 쿠폰입니다.");
                                    alert(json.message); 
                                }
                            }else{
                                alert(json.message); //회원정보 내 생년월일 미입력 회원입니다.
                            }
                        }
                 );
            }
        }
    },
    
    /* 
     * 기능 : 쿠폰  다운로드 
     * 쿠폰 : 수험생 대박기원! 30% 쿠폰 발급
     * “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
     */
    downCouponJson30 : function(cpnNo30) {
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
                if(typeof cpnNo30 == "undefined" || cpnNo30 == ""){
                    alert("쿠폰 번호가 없습니다.");
                    return;
                }
                var param = {cpnNo : cpnNo30};
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
    
    // #### common js START ####
    
    // 레이어 숨김
    eventCloseLayer : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
    
    // #### common js END ####
};