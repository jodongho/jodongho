$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    snsInitYn : "N",
    snsTitle : "5/30~6/5 단 일주일! 올리브영 온라인몰 오늘세일 단독 구매혜택을 놓치지마세요!",
    currentDay : null, 
    changeDate1 : "20180530",  // 20180530
    changeDate2 : "20180531",  //20180531
    changeDate3 : "20180601",  //20180601
    changeDate4 : "20180605",  //20180605
    
    init : function(){
        
        
        monthEvent.detail.currentDay = $("input[id='cardUrlConnectDay']:hidden").val(); 
        
        if ((eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1)) &&  (eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate2)) ) {
            var htmlStr = "";
            htmlStr =  "<img src='"+_cdnImgUrl + "contents/201805/30today/today_tab1_img03.png' alt='단독 혜택3- 세일 기간 구매고객 단독! 6월 6일 단 하루, 최대 6천원 더 할인!'>";
            $("div.imgBox").find("span").html(htmlStr);
        }else if ((eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3)) &&  (eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)) ) {
            var htmlStr = "";
            htmlStr =  "<img src='"+_cdnImgUrl + "contents/201805/30today/today_tab1_img04.png' alt='단독 혜택3- 세일 기간 구매고객 단독! 6월 6일 단 하루, 최대 6천원 더 할인!'>";
            $("div.imgBox").find("span").html(htmlStr);
        } 
       
        if(common.isLogin()){
          
        };

        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });

        // 카드 url 일자별 연결 
        $("div#cardUrlConnect").click(function(){
            if ((eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3)) &&  (eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)) ) {
                // 카카오페이 결제시 5%즉시할인 
                common.link.commonMoveUrl('event/getEventDetail.do?evtNo=00000000005882');
            } else {
                // 삼성카드 결제시 3천원 청구할인 
                common.link.commonMoveUrl('event/getEventDetail.do?evtNo=00000000005881');
            }
           
        });
        
    },
    
    /* 
     * 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
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
                        , this._callback_downCouponJson
                 );
            }
        }
    },
    _callback_downCouponJson : function(json) {
        if(json.ret == '0'){
            alert(json.message);
        }
    },
    
    
    /* 10만원 이상 구매시 적립 신청가능  */
    checkApplyOnePayAmtJson:function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 신청 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{     
            if(!mevent.detail.checkLogin()){
                return;
            }
            if(!mevent.detail.checkRegAvailable()){
                return;
            }
    
           var param = {
                      evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : "1"
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180530/checkApplyOnePayAmtJson.do"
                  , param
                  , monthEvent.detail._callback_checkApplyOnePayAmtJson
            ); 
        }
    },
    
    _callback_checkApplyOnePayAmtJson : function(json) {
        if(json.ret == "0"){
            alert("적립 신청되었습니다. 적립시점에 취/반품건이 있을 경우 적립 대상에서 제외됩니다.");
        }else{
            alert(json.message);
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
            if(imgUrl == undefined || imgUrl == null || imgUrl == "" || type == "facebook"){
                imgUrl = bnrImgUrlAddr;
            }
            
            if(type == "kakaotalk"){
                //카톡 공유 시 지정 썸네일 이미지로 교체
                imgUrl = "http:" + _cdnImgUrl + "contents/201805/30today/thumb_tab1.jpg";
            }

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

    // 레이어 숨김
    eventCloseLayer : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },

    
    /**
     * 6월 6일 쿠폰 다운로드
     */
    checkSixThanksCoupon : function(fvrSeq) {

        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능합니다.")){
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
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val() , 
                        fvrSeq : fvrSeq, 
                        evtNo2 : $("input[id='evtNoNo']:hidden").val()
                  };
                  common.Ajax.sendRequest(
                          "GET"
                        , _baseUrl + "event/20180530/checkSixThanksCoupon.do"
                        , param
                        , this._callback_checkSixThanksCoupon
                  );
            }
        }
        
    },
    _callback_checkSixThanksCoupon : function(json) {
        alert(json.message);
    },
    
}