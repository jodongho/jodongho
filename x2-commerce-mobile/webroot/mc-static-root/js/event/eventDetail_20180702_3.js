$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    
    // 현재 날짜 시간을 자바에서 가져와야함 
    //7/2 8:00 ~ 7/9 07:59
    // 1차 증정 소진 완료 시 ~ 7/9 07:59
    //7/9 8:00 ~ 7/15 23:59
    //2차 증정 소진 완료 시 ~ 7/15 07:59

    currentDay : null, 
    changeDate1 : "201807020800", 
    changeDate2 : "201807080759",  
    changeDate3 : "201807080800",  
    changeDate4 : "201807150759",  
    changeDate5 : "201807090800", // 메인이미지  & 띠배너 
    show1Cnt : 0,
    show2Cnt : 0,
    
    init : function(){

            monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();  
            monthEvent.detail.show1Cnt = $("input[id='show1Cnt']:hidden").val(); 
            monthEvent.detail.show2Cnt = $("input[id='show2Cnt']:hidden").val(); 
        
        //1 
            if ( eval(monthEvent.detail.currentDay) < eval(monthEvent.detail.changeDate5)  ) {
                     
                      var htmlStr = "";   
                      htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_tit.jpg' alt='팡팡! 터지는 시원한 여름! 핫해? 우리는 매일 더 쿨해질거야!'>";
                      $("div#imgBoxAB").find("span").html(htmlStr);
                      
                      //js href 링크 하기
                      $("#bannerA").attr("href","https://m.oliveyoung.co.kr/m/planshop/getPlanShopDetail.do?dispCatNo=500000100060110");
                      $("#bannerB").attr("src"," "+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_banner1.png");
                      
              }else if ( eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate5) ) {   // 201807090800 크거나 같으면 
                     
                      var htmlStr = "";
                      htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_tit2.jpg' alt='팡팡! 터지는 시원한 여름! 핫해? 우리는 매일 더 쿨해질거야!'>";
                      $("div#imgBoxAB").find("span").html(htmlStr);
                      
                      
                    //js href 링크 하기
                      $("#bannerA").attr("href","https://m.oliveyoung.co.kr/m/main/main.do#1");
                      $("#bannerB").attr("src"," "+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_banner2.png");
                      
              }  
        
        //2 
            if ((eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate1)) &&  (eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate2)) ) {
              if(monthEvent.detail.show1Cnt <= 0 ) { // 재고 없음 
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_t3_img01_sdo.jpg' alt='소진완료'>";
                    $("div#imgBoxAA").find("span").html(htmlStr);
              }else {
                  var htmlStr = "";
                  htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_t3_img01.jpg' alt='선착순 5천명! 7만원 이상 구매 시, 선물이 팡팡!'>";
                  $("div#imgBoxAA").find("span").html(htmlStr);
              }
            }else if ((eval(monthEvent.detail.currentDay) >= eval(monthEvent.detail.changeDate3)) &&  (eval(monthEvent.detail.currentDay) <= eval(monthEvent.detail.changeDate4)) ) {
                if(monthEvent.detail.show2Cnt <= 0 ) { // 재고 없음 
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_t3_img02_sdo.jpg' alt='소진완료'>";
                    $("div#imgBoxAA").find("span").html(htmlStr);
                }else {
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/02pangpang/pangpang_mc_t3_img02.jpg' alt='선착순 5천명! 7만원 이상 구매 시, 선물이 팡팡!'>";
                    $("div#imgBoxAA").find("span").html(htmlStr);
                }
            }

         
            
        if(common.isLogin()){

        };

        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });

    }, 
    
    /* 세번째탭 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/ 
    /* 누적구매금액확인하고 가실게요*/
    checkMyEventBuyAmt:function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }

        var param = {
                  evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180702_3/checkMyEventBuyAmtJson.do"
              , param
              , monthEvent.detail._callback_checkMyEventBuyAmtJson
        );
    },
    
    _callback_checkMyEventBuyAmtJson : function(json) {
        if(json.ret == "0"){
            var myTotalAmt = json.myTotalAmt.numberFormat();
            monthEvent.detail.totalAmt =  json.myTotalAmt;
            $("#rndmVal").text(myTotalAmt + "원");
        }else{
            alert(json.message);
        }
    },
    //////////////////////////////////////////////////////////////////////
    
    /* 적립 신청하기 */
    checkPayAmtJson:function(fvrSeq){
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
           var totalPayAmt = $("#rndmVal").text().replace("원","").trim();

            if(totalPayAmt == null || totalPayAmt == "" ){
                alert("나의 누적 주문금액 확인 후 신청해주세요.");
                return;
            }
            
           /*if(monthEvent.detail.totalAmt < 100000 ){
                alert("대상자가 아닙니다. 실 결제가 기준 누적 10만원 이상 구매 시 신청 가능합니다.");
                return;
            }*/
            
    
           var param = {
                      evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180702_3/checkPayAmtJson.do"
                  , param
                  , monthEvent.detail._callback_checkPayAmtJson
            ); 
        }
    },
    
    _callback_checkPayAmtJson : function(json) {
        if(json.ret == "0"){
            alert("적립 신청되었습니다. 적립시점에 취/반품건이 있을 경우 적립 대상에서 제외됩니다.");
        }else{
            alert(json.message);
        }
    },
    

    // 레이어 숨김
    eventCloseLayer : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
    
};



