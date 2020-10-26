$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    checkStampYn : "N",
    checkSelectYn : "N",

    init : function(){
        
        if(common.isLogin()){
                    
        };

        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });

        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
    },
    
    /* 
     * 쿠폰  다운로드 
       “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
      */
    downCouponJson : function(cpnNo) {
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
    
    //구매도장찍기 
    addBuyStampOrderCategory : function() {
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
              , _baseUrl + "event/20180618_2/addBuyStampOrderCategory.do"
              , param
              , monthEvent.detail._callback_checkBuyStampJson
        ); 
    },
    
    _callback_checkBuyStampJson : function(json) {
        if(json.ret == "0"){
            if(json.categoryList.length > 0){
                for(i=0 ; i<json.categoryList.length ; i++){
                   if( json.categoryList[i] == 1 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on01.png' alt='미용소품 구매완료'>";
                       $("div#stamp1").find("span").html(htmlStr);
                   }else  if( json.categoryList[i] == 2 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on02.png' alt='기초 구매완료'>";
                       $("div#stamp2").find("span").html(htmlStr);
                   }else  if( json.categoryList[i] == 3 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on03.png' alt='헤어/바디 구매완료'>";
                       $("div#stamp3").find("span").html(htmlStr);
                   }else  if( json.categoryList[i] == 4 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on04.png' alt='메이크업 구매완료'>";
                       $("div#stamp4").find("span").html(htmlStr);
                   }else  if( json.categoryList[i] == 5 ){
                       //$(this).addClass("on");
                       var htmlStr = "";
                       htmlStr =  "<img src='"+_cdnImgUrl + "contents/201806/18worldcup/mc_stamp_on05.png' alt='푸드 구매완료'>";
                       $("div#stamp5").find("span").html(htmlStr);
                   }
                }
            }

            monthEvent.detail.checkStampYn = "Y";
        }else{
            alert(json.message);
        }
    },
    
    applyJson : function(fvrSeq){

        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
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
            
            if(monthEvent.detail.checkStampYn != "Y"){
                alert("구매도장을 찍고 응모해주세요.");
                monthEvent.detail.checkStampYn = "N";
                return;
            }
            
          common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180618_2/checkApplyJson.do" //  fvrSeq에 따라 카데고리 구매 했는지 체크 
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val() , 
                          fvrSeq : fvrSeq
                    }
                  , function(json){ 
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);
                      
                        if(json.ret == "0"){   // 카테고리 구매건수가 맞으면 위수탁 레이어팝업 노출  확인 클릭 하면 응모하기  
                            if(json.categorySize >= 3){
                                   if( json.myTotalCnt  == "0" ) {  // 7일연속, 14일연속, 21일연속  세개중 한번도 신청하지 않은경우 위수탁 받기 
                                       $("div#Confirmlayer2").attr("onClick", "monthEvent.detail.addApplyJson(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); "         );
                                       monthEvent.detail.eventCloseLayer();
                                       monthEvent.detail.eventShowLayer1('eventLayerPolice1');
                                       $(".agreeCont").scrollTop(0);  // 상단이동 
                                   }else {
                                       monthEvent.detail.addApplyJson(fvrSeq, json.myTotalCnt);
                                   }
                            }
                        }else{
                            alert(json.message);
                        } 
                      
                    }
            ); 
        }
    },
    
    addApplyJson : function(fvrSeq,myTotalCnt){
        //실제로 응모처리 수행해야함 
         if(!mevent.detail.checkLogin()){
             return;
         }
         if(!mevent.detail.checkRegAvailable()){
             return;
         }

        var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
        var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

        if(myTotalCnt == 0 ){ 
            if("Y" != mbrInfoUseAgrYn){
                monthEvent.detail.eventCloseLayer1();
                return;
            }
            if("Y" != mbrInfoThprSupAgrYn){
                monthEvent.detail.eventCloseLayer1();
                return;
            }
        }else {
            mbrInfoUseAgrYn = "Y";
            mbrInfoThprSupAgrYn = "Y";
        }

        monthEvent.detail.eventCloseLayer2();
        
       var param = {
                 evtNo : $("input[id='evtNo']:hidden").val()
               , fvrSeq : fvrSeq  
               , mbrInfoUseAgrYn : mbrInfoUseAgrYn
               , mbrInfoThprSupAgrYn : mbrInfoThprSupAgrYn
         };
         common.Ajax.sendJSONRequest(
                 "GET"
               , _baseUrl + "event/20180618_2/addApplyJson.do"  
               , param
               , monthEvent.detail._callback_addApplyJson
         );   
     },
     
     _callback_addApplyJson : function(json){
          if(json.ret == "0"){
             $(':radio[name="argee1"]:checked').attr("checked", false);
             $(':radio[name="argee2"]:checked').attr("checked", false);
             alert("응모되었습니다");
         }else{
             alert(json.message);
         }
     },
    

    // 레이어 숨김
    eventCloseLayer : function(){ 
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){ 
        alert($("input[name='closeMsgTxt']:hidden").val());
        $(".eventLayer").hide();
        $("#eventDimLayer1").hide();
      //  location.reload();      //위수탁 동의 x일 때 스크롤 맨위로 가게하기 위해 페이지 새로고침
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

