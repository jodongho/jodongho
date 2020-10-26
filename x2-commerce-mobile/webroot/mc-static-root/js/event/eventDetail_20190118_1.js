/**
 * 배포일자 : 2019.01.17
 * 오픈일자 : 2019.01.18
 * 이벤트명 : 올리브영 H&B 어워즈
 * */

$.namespace("monthEvent.detail");
monthEvent.detail = {
    firstYn : "N",
    checkYn : "N",
    availCnt : 0,
    listSize : 0,
    cpnNo : "",
    baseImgPath : _cdnImgUrl + "contents/201901/18oyawards/",
    init : function(){

        $("#ePoint").click(function(){
            monthEvent.detail.awardsPointEntry();
        });

        // 나의 당첨내역
        $("#eMylist").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
            /* 당첨이력조회 */
            monthEvent.detail.getStmpMyWinList('1');
        });

        // 나의 당첨내역
        $("#eMylist1").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
            /* 당첨이력조회 */
            monthEvent.detail.getStmpMyWinList('2');
        });

        // 채워라 카테고리의 별! 클릭
        $("#eCheck").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }

            monthEvent.detail.getAwardCatList();
        });

        // 채워라 카테고리의 별! 클릭
        $("#eGift").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }

            monthEvent.detail.checkAwards();
        });

        $("#cpnImg").click(function(){
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

                if(monthEvent.detail.cpnNo == ""){
                    alert("구매금액 확인 후 다운 가능합니다.");
                }else{
                    monthEvent.detail.getCpnDownCheck();
                }
            }
        });

        $(".my_total_purchase").click(function(){
            monthEvent.detail.getMyTotalPurchase();
        });

        /* 위수탁동의 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
    },

    /* 채워라 카테고리 가져오기 */
    getAwardCatList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        $("[class^=ctg]").removeClass("on");

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190118_1/getAwardCatList.do"
              , param
              , monthEvent.detail._callback_getAwardCatListJson
        );
    },

    _callback_getAwardCatListJson : function(json){
        if(json.ret == "0"){
            var catList = json.catList;
            if(json.listSize == 0){
                alert("구매 후 카테고리를 채워주세요!");
            }else{
                $(".c1 > span").html(json.listSize);
                $(".c2 > span").html(json.availCnt);
                $(".c3 > span").html(json.applyCnt);
                for(var i=0;i<catList.length;i++){
                    $(".ctg"+catList[i].dispCatNo).addClass("on");
                }
                if(json.tgtrSeq != null){
                    mevent.detail.eventShowLayer("pop3");
                }
            }
            monthEvent.detail.checkYn = "Y";
            monthEvent.detail.availCnt = json.availCnt;
            monthEvent.detail.listSize = json.listSize;
        }else{
            alert(message);
        }
    },

    /* 포인트 응모하기 */
    awardsPointEntry : function(){
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

            if(monthEvent.detail.checkYn == "N"){
                alert("내가 채운 카테고리를 먼저 확인해주세요!");
                return;
            }

            if(monthEvent.detail.availCnt <= 0){
                alert("응모 가능 횟수를 확인해주세요.");
                return;
            }

            var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190118_1/awardsPointEntry.do"
                  , param
                  , monthEvent.detail._callback_awardsPointEntry
            );
        }
    },

    _callback_awardsPointEntry : function(json){
        if(json.ret == "0"){
            if(json.winYn == "Y"){
                $(".win_number").text("("+json.tgtrSeq+")");
                mevent.detail.eventShowLayer("pop1");
            }else{
                mevent.detail.eventShowLayer("pop4");
            }
            monthEvent.detail.getAwardCatList();
        }else{
            alert(json.message);
        }
    },


    checkAwards : function(){
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

            if(monthEvent.detail.checkYn == "N"){
                alert("내가 채운 카테고리를 먼저 확인해주세요!");
                return;
            }

            if(monthEvent.detail.listSize != 10){
                alert("10개 카테고리 전부 채운 경우에만 응모 가능합니다.");
                return;
            }

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190118_1/checkAwards.do" // ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                    }
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                      if(json.ret == "0"){
                          if( json.myTotalCnt  == "0" ) {  //한번도 신청하지 않은경우 위수탁 받기
                              $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.giftEntry('"+json.myTotalCnt+"');");
                              mevent.detail.eventShowLayer('eventLayerPolice');
                              monthEvent.detail.firstYn = "Y";
                          }else {
                              monthEvent.detail.firstYn = "N";
                              monthEvent.detail.giftEntry(monthEvent.detail.fvrSeq, json.myTotalCnt);
                          }
                      }else{
                            alert(json.message);
                      }
                  }
            );

        }
    },

    giftEntry : function(myTotalCnt){
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

            if(myTotalCnt == 0){
                /* 수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
                var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
                var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

                if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("N"==$(':radio[name="argee1"]:checked').val() &&  "N"==$(':radio[name="argee2"]:checked').val()){
                    alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee1"]:checked').val()){
                    alert("개인정보 수집 이용 동의 후 참여 가능합니다.");
                    return;
                }
                if("Y" != $(':radio[name="argee2"]:checked').val()){
                    alert("개인정보 처리 위탁 동의 후 참여 가능합니다.");
                    return;
                }

                if("Y" != mbrInfoUseAgrYn){
                    mevent.detail.eventCloseLayer();
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    mevent.detail.eventCloseLayer();
                    return;
                }
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }

            mevent.detail.eventCloseLayer();

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190118_1/awardsGiftEntry.do"
                  , param
                  , monthEvent.detail._callback_giftEntry
            );
        }
    },

    _callback_giftEntry : function(json){
        if(json.ret == "0"){
           $(':radio[name="argee1"]:checked').attr("checked", false);
           $(':radio[name="argee2"]:checked').attr("checked", false);
               if(json.winYn == "Y"){
                   $(".win_number").text("("+json.tgtrSeq+")");
                   mevent.detail.eventShowLayer('pop2');
               }else {
                   // 실패
                   mevent.detail.eventShowLayer('pop4');
               }
       }else{
           alert(json.message);
       }
   },

   getMyTotalPurchase : function(){
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

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190118_1/getMyTotalPurchase.do"
                  , param
                  , monthEvent.detail._callback_getMyTotalPurchase
            );
        }
    },

    _callback_getMyTotalPurchase : function(json){
        if(json.ret == "0"){
            $(".my_total_purchase").addClass("on");
            $(".my_total_purchase > span").html(json.ordAmt);

            $("#cpnImg").attr("src",monthEvent.detail.baseImgPath + "mc_coupon_on_0"+json.imgNum+".png");

            if(json.imgNum == "3"){
                if($("#profile").val() == "prod"){
                    monthEvent.detail.cpnNo = "g0CzCBI3VCaElegDZpE5HQ==";
                }else{
                    monthEvent.detail.cpnNo = "g0CzCBI3VCZNoMva7QP0BA==";
                }
            }else if(json.imgNum == "2"){
                if($("#profile").val() == "prod"){
                    monthEvent.detail.cpnNo = "g0CzCBI3VCZBbnpoa8xoqw==";
                }else{
                    monthEvent.detail.cpnNo = "g0CzCBI3VCY1S3xvIEZlZg==";
                }
            }else if(json.imgNum == "1"){
                if($("#profile").val() == "prod"){
                    monthEvent.detail.cpnNo = "g0CzCBI3VCYakiQAoYObVw==";
                }else{
                    monthEvent.detail.cpnNo = "g0CzCBI3VCZrT61YjvmaEQ==";
                }
            }
        }else{
            alert(json.message);
        }
    },

    getCpnDownCheck : function() {
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
                var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                }
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20190118_1/getCpnDownCheck.do"
                        , param
                        , this._callback_getCpnDownCheck
                );
            }
        }
    },

    _callback_getCpnDownCheck : function(json) {
        if(json.ret == '0'){
            if(json.downCnt > 0){
                alert("이미 발급 받으셨습니다.");
            }else{
                mevent.detail.downCouponJson(monthEvent.detail.cpnNo);
            }
        }else{
            alert(json.message);
        }
    },

    /* 당첨내역 확인 */
    getStmpMyWinList : function(fvrSeq){
         if(!mevent.detail.checkLogin()){
             return;
         }
         var param = {
                 evtNo : $("input[id='evtNo']:hidden").val()
                 ,fvrSeq : fvrSeq
         }
         common.Ajax.sendJSONRequest(
                 "GET"
               , _baseUrl + "event/getStmpMyWinListJson.do"
               , param
               , monthEvent.detail._callback_getStmpMyWinListJson
         );
     },

     _callback_getStmpMyWinListJson : function(json){
         if(json.ret == "0"){
             var myWinListHtml = "";
             if(json.myEvtWinList.length <= 0){
                 myWinListHtml = "<tr><td colspan='2' class='no'>당첨이력이<br/> 없습니다.</td></tr>";
             }else{
                 for(var i=0 ; i<json.myEvtWinList.length ; i++){
                     myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                 }
             }
             $("tbody#myWinListHtml").html(myWinListHtml);

             mevent.detail.eventShowLayer('evtPopWinDetail');
         }else{
             alert(json.message);
         }
    },

    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        location.reload();//새로고침
    },
};

$(window).on('load', function(){
    var tabH = $(".scrollTab img").height();
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
    }   else if (scrollTab > eTab04) {
        $("#eventTabFixed2").attr('class','tab04');
    }

    $(window).scroll(function(){
        var scrollTab  = $(document).scrollTop();
        
        if (scrollTab < eTab01) {
            $("#eventTabFixed2").attr('class','tab01');
        } else if (scrollTab < eTab02) {
            $("#eventTabFixed2").attr('class','tab02');
        } else if (scrollTab < eTab03) {
            $("#eventTabFixed2").attr('class','tab03');
        } else if (scrollTab > eTab04) {
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
});
