$.namespace("monthEvent.detail");
monthEvent.detail = {
	
    /* 누적금액 */
    totalAmt : 0,
    snsInitYn : "N",
    //snsTitle : "온라인몰 헬로, 스프링 웰컴, 올리브영♡ 소원을 말해봐!",
    snsTitle : "5/30~6/5 단 일주일! 올리브영 온라인몰 오늘세일#첫구매#하고싶다★",
   // snsTitle : "[Oliveyoung]\n(테스트)님 M.NET 이용권번호가 도착했습니다!\n\n★ M.NET 이용권번호\n (OYZVOLJ048ATT)\n\n★ 자세한 등록방법은 이벤트 페이지에서 확인해주세요.",
    snsImgUrl : "https://image.oliveyoung.co.kr/uploads/contents/201803/29birthcard/birthcard_thum1.jpg",     //카톡 공유하기
        
    init : function(){
        $("#wishText").attr("maxlength", 5);
        
        monthEvent.detail.showWishRank();
        
	    if(common.isLogin()){
        };
        
        /* 위수탁 동의 닫기 */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();
        });

        /* 유의사항 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });        
        
        if(window.location.href.match("evtTab")){
            location.href = _baseUrl + "event/20180416/getEventDetail.do?evtNo="+$("#evtNo").val()+"&sslYn=Y&#evtTab04"
        }
	},
    /* 
     * 쿠폰받고 혜택봄! - 헬로, 스프링쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    downHelloCouponJson : function(cpnNo) {
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
    
    /* 
     * 쿠폰받고 혜택봄! -  웰컴,올리브영쿠폰
     * 조건 : 2018년 1월 1일~4월 15일까지 온라인몰 로그인 이력 없는 고객만 발급 가능 (fvrSeq:1)
     * “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
     * */
    getWelcomDownCoupon : function(fvrSeq){
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
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : fvrSeq
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20180416/getWelcomDownCoupon.do"
                        , param
                        , this._callback_getWelcomDownCoupon
                );
            }
        }
    }, 
    _callback_getWelcomDownCoupon : function(json){
        alert(json.message);
    },
	    
    /* 쿠폰받고 혜택봄! - 월컴쿠폰 사용한 주문이력이 있는경우 CJ ONE포인트 페이백 신청하기(fvrSeq:2)*/
    checkUseCouponOnePayAmtJson:function(fvrSeq){
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
                    , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180416/checkUseCouponOnePayAmtJson.do"
                  , param
                  , monthEvent.detail._callback_checkUseCouponOnePayAmtJson
            );
        }
    },
   
    _callback_checkUseCouponOnePayAmtJson : function(json) {
        if(json.ret == "0"){
            alert("신청되었습니다.");
        }else{
            alert(json.message);
        }
    },
    
    /*  5천 POint 줘봄 - 누적구매금액확인하고 가실게요 - 나의 누적구매금액 확인하기 4월달  (fvrSeq:3)*/
    checkMyAprilCuePurAmt:function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }

        var param = {
                  evtNo : $("input[id='evtNo']:hidden").val()
                , fvrSeq : fvrSeq
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180416/checkMyAprilCuePurAmtJson.do"
              , param
              , monthEvent.detail._callback_checkMyAprilCuePurAmtJson
        );
    },
    
    _callback_checkMyAprilCuePurAmtJson : function(json) {
        if(json.ret == "0"){
            var myTotalAmt = json.myTotalAmt.numberFormat();
            monthEvent.detail.totalAmt =  json.myTotalAmt;
            $("#rndmVal").text(myTotalAmt);
 
            if(json.myTotalAmt >= 100000){
                $(".fiesta").css("display", "block");
            }else {
                $(".fiesta").css("display", "none");
            }
        }else{
            alert(json.message);
        }
    },
    
    /*  5천 POint 줘봄 -  누적구매금액확인하고 가실게요 - CJONE 포인트 오천점 신청하기  (fvrSeq:4) */
    checkFiveOnePayAmtJson:function(fvrSeq){
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
            
            /* 누적금액확인*/
           var totalPayAmt = $("#rndmVal").text().trim();

            if(totalPayAmt == null || totalPayAmt == "" ){
                alert("누적 구매금액 확인 후 신청해주세요.");
                return;
            }
            if(monthEvent.detail.totalAmt < 100000 ){
                alert("10만원 이상 구매 고객만 신청 가능합니다.");
                return;
            }
            
    
           var param = {
                      evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180416/checkFiveOnePayAmtJson.do"
                  , param
                  , monthEvent.detail._callback_checkFiveOnePayAmtJson
            ); 
        }
    },
    
    _callback_checkFiveOnePayAmtJson : function(json) {
        if(json.ret == "0"){
            alert("신청되었습니다. CJ ONE포인트는 4월 30일 이후 순차 지급됩니다.");
        }else{
            alert(json.message);
        }
    },
     
    /* 페스티벌 가봄 - CJ ONE 포인트 2천점 100% 증정   (fvrSeq:5)  */
    checkSecondOnePayAmtJson:function(fvrSeq){
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
                    , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180416/checkSecondOnePayAmtJson.do"
                  , param
                  , monthEvent.detail._callback_checkSecondOnePayAmtJson
            ); 
        }
    },
    
    _callback_checkSecondOnePayAmtJson : function(json) {
        if(json.ret == "0"){
            alert("신청되었습니다. CJ ONE포인트는 4월 30일 이후 순차 지급됩니다.");
        }else{
            alert(json.message);
        }
    },
    
    
    /* 페스티벌 가봄 - 응모하기 (추첨을 통해서 2인초대권)   (fvrSeq:6)  */
    applyTheater : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
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

             common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180416/checkApplyTheaterJson.do" // checkApplyTheaterJson.do ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
                  , {
                           evtNo : $("input[id='evtNo']:hidden").val()
                         , fvrSeq : fvrSeq
                    }
                  , function(json){  
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                        if(json.ret == "0"){ 
                            //$("div#Confirmlayer1").attr("onClick", "monthEvent.detail.applyTheaterInfo('" + fvrSeq + "');");
                           // monthEvent.detail.eventShowLayer1('eventLayerPolice');
                            common.link.commonMoveUrl("event/getEventDetail.do?evtNo="+$("input[id='evtNoNo']:hidden").val());
                       }else{
                            $('#rndmVal').val(''); // 초기화 
                            alert(json.message);
                        }
                    }
            ); 
        }
    },
    
    /**
     *  호출안하기로 요청 2018.04.10
     */
    applyTheaterInfo : function(fvrSeq){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        
        if($(':radio[name="argee1"]:checked').val() == undefined
                 &&  $(':radio[name="argee2"]:checked').val() == undefined ){
            monthEvent.detail.eventCloseLayer1();
            return;
        }
        
        
        if("Y" != $(':radio[name="argee1"]:checked').val()){
            monthEvent.detail.eventCloseLayer1();
            return ;
        }
        if("Y" != $(':radio[name="argee2"]:checked').val()){
            monthEvent.detail.eventCloseLayer1();
            return;
        }

        monthEvent.detail.eventCloseLayer2();
        
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : fvrSeq
              , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
              , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180416/applyTheaterInfo.do"
              , param
              , monthEvent.detail._callback_applyTheaterInfo
        );
      
    },
    
    _callback_applyTheaterInfo : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            alert("신청되었습니다.");
        }else{
            alert(json.message);
        }
    },

    // 레이어 숨김
    eventCloseLayer : function(){ 
        //alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){ 
        alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer").hide();  
    },
    // 레이어 숨김
    eventCloseLayer2 : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
        $("#eventDimLayer").hide();  
    },
    
    // 레이어 노출
    eventShowLayer1 : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer1');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
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
            
            if(type == "kakaotalk"){
                //카톡 공유 시 지정 썸네일 이미지로 교체
                imgUrl = monthEvent.detail.snsImgUrl;
            }

            var snsShareUrl = _baseUrl + "E.do?evtNo="+$("#evtNo").val();
            var title = monthEvent.detail.snsTitle;
            
            if(monthEvent.detail.snsInitYn == "N"){
                common.sns.init(imgUrl, title, snsShareUrl);
                monthEvent.detail.snsInitYn = "Y";
            }
            
            
            common.sns.doShare(type);
           /* Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                  title: monthEvent.detail.snsTitle,
                  imageUrl:  monthEvent.detail.snsImgUrl,
                  link: {
                    mobileWebUrl: common.sns.shareUrl,
                    webUrl:common.sns.shareUrl
                  }
                },
                buttons: [
                  {
                    title: '앱으로 보기',
                    link: {
                      mobileWebUrl: common.sns.shareUrl,
                      webUrl:common.sns.shareUrl
                    }
                  }
                ]
              }); */
            
         /*   Kakao.Link.sendDefault({
                objectType: 'text',
                text : '[Oliveyoung]\n(테스트)님 M.NET 이용권번호가 도착했습니다!\n\n★ M.NET 이용권번호\n (OYZVOLJ048ATT)\n\n★ 자세한 등록방법은 이벤트 페이지에서 확인해주세요.',
                link: {
                    mobileWebUrl: common.sns.shareUrl,
                    webUrl:common.sns.shareUrl
                },
                buttons : [
                    {
                      title: '앱으로 보기',
                      link: {
                        mobileWebUrl: common.sns.shareUrl,
                        webUrl:common.sns.shareUrl
                       }
                    }
                  ]
              });*/
      

            
            
            
        }
    },

    /* 실시간 소원랭킹 */
    showWishRank : function(){
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        var param = {
//                fvrSeq : "7",
//                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180416/showWishRankJson.do"
              , param
              , this._callback_showWishRankJson
        );
    },
    
    _callback_showWishRankJson : function(json) {
        if(json != undefined && json != null){
            var wishRnkList = json.wishRnkList;
            if(wishRnkList != undefined && wishRnkList != null && wishRnkList.length > 0){
                // 소원랭킹 설정
                for(var i=0; i<wishRnkList.length; i++){
                    $(".flip"+(i+1)).text(wishRnkList[i].noteCont);
                }
            }
        }
        
    },
    
    /* 최초 참여여부 확인 */
    getFirstChkJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여해 주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180416/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
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

                if($("#wishText").val() == "" || $("#wishText").val() == null){
                    alert("소원을 입력해 주세요.");
                    return;
                }
                if($("#wishText").val().length > 5){
                    alert("소원은 5글자 이내로 입력 가능합니다.");
                    return;
                }
                
                var param = {
                        fvrSeq : "7",
                        evtNo : $("input[id='evtNo']:hidden").val(),
                        noteCont : $("#wishText").val()  
                }
                
                $(':radio[name="argee1"]:checked').attr("checked", false);
                $(':radio[name="argee2"]:checked').attr("checked", false);
                
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180416/getFirstChkJson.do"
                      , param
                      , this._callback_getFirstChkJson
                );
            }
        }
    },
    
    _callback_getFirstChkJson : function(json) {
        
        if(json.ret == "0"){            
            //최초 참여는 개인정보 위수탁 동의팝업 생성
            //mevent.detail.eventShowLayer('eventLayerPolice2');
            monthEvent.detail.eventShowLayer1('eventLayerPolice2');
        }else{
            if(json.ret == "1"){
                //ID당 1일 1회 참여 가능
                alert("ID당 1일 1회 참여 가능합니다.");
            }else if(json.ret == "088"){
                alert(json.message);
                $("#wishText").val("");
            }else{
                monthEvent.detail.wishInsert();
            }
        }
    },
    
    /* 개인정보 위/수탁 동의 */
    popLayerConfirm : function(){        
        //로그인여부 체크
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }else{
            
            if($(':radio[name="argee1"]:checked').val() == undefined
                    &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                monthEvent.detail.eventCloseLayer1();
                return;
           }

           if("Y" != $(':radio[name="argee1"]:checked').val()){
               monthEvent.detail.eventCloseLayer1();
               return;
           }
           if("Y" != $(':radio[name="argee2"]:checked').val()){
               monthEvent.detail.eventCloseLayer1();
               return;
           }
           monthEvent.detail.eventCloseLayer2();
           monthEvent.detail.wishInsert();
            
        }
    },
    
    /* 소원입력 */
    wishInsert : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여해 주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180416/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
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
                if($("#wishText").val() == "" || $("#wishText").val() == null){
                    alert("소원을 입력해 주세요.");
                    return;
                }
                var param = {
                        fvrSeq : "7",
                        evtNo : $("input[id='evtNo']:hidden").val(),
                        noteCont : $("#wishText").val()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180416/wishInsertJson.do"
                      , param
                      , this._callback_wishInsertJson
                );
            }
        }
    },
    
    _callback_wishInsertJson : function(json) {
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            alert("신청되었습니다.");
            $("#wishText").val("");
        }else{
            alert(json.message);
            $("#wishText").val("");
        }
    },
    
};

$(document).ready(function(){

    // scroll class 변경
    var tabH = $(".treeTab img").height();
    $("#eventTabFixed2").css("height",tabH + "px");

    var tabHeight =$("#eventTabImg").height() + 108 ;
    var eTab01 = tabHeight + $("#evtConT01").height();
    var eTab02 = eTab01 + $("#evtConT02").height();
    var eTab03 = eTab02 + $("#evtConT03").height();
    var eTab04 = eTab03 + $("#evtConT04").height();
    var eTab05 = eTab04 + $("#evtConT05").height();

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
    } else if (scrollTab < eTab04) {
        $("#eventTabFixed2").attr('class','tab04');
    };
    
    $(window).scroll(function(){
        var scrollTab  = $(document).scrollTop();
         if (scrollTab < eTab01) {
            $("#eventTabFixed2").attr('class','tab01');
        } else if (scrollTab < eTab02) {
            $("#eventTabFixed2").attr('class','tab02');
        } else if (scrollTab < eTab03) {
            $("#eventTabFixed2").attr('class','tab03');
        } else if (scrollTab < eTab04) {
            $("#eventTabFixed2").attr('class','tab04');
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
    
    var timer = setInterval(function () {
        $('.hope_lanking li').fadeOut('slow');
        var timer = setInterval(function () {
            $('.hope_lanking li').fadeIn('slow');
        },100);
    }, 5000);

});
