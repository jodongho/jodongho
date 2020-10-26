$.namespace("monthEvent.detail");
monthEvent.detail = {

    currentDay : null,
    baseImgPath : _cdnImgUrl + "contents/201812/10giving/",
    fvrSeq : "1",

    init : function(){

        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);

        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통
            monthEvent.detail.eventCloseLayer();
        });

        /* 유의사항 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });

        // 나의 당첨내역
        $("div#eMylist").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
            /* 당첨이력조회 */
            monthEvent.detail.getStmpMyWinList();
            mevent.detail.eventShowLayer("evtPopWinDetail");

        });

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

        monthEvent.detail.imgSet();
    },

    imgSet : function(){

        var imgNum = "1";   //메인 큰 이미지 명
        var imgArt = "12/10"; //메인 큰 이미지 alt
        var classNum = "1";

        switch (monthEvent.detail.currentDay) {
            case '20181210' :
                imgNum = '1';
                monthEvent.detail.fvrSeq = '1';
                imgArt = "12/10";
                $("#day1").addClass("on");
                break;
            case '20181211' :
                imgNum = '2';
                monthEvent.detail.fvrSeq = '2';
                imgArt = "12/11";
                $("#day1").addClass("end");
                $("#day2").addClass("on");
                break;
            case '20181212' :
                imgNum = '3';
                monthEvent.detail.fvrSeq = '3';
                imgArt = "12/12";
                $("#day1").addClass("end");
                $("#day2").addClass("end");
                $("#day3").addClass("on");
                break;
            case '20181213' :
                imgNum = '4';
                monthEvent.detail.fvrSeq = '4';
                imgArt = "12/13";
                $("#day1").addClass("end");
                $("#day2").addClass("end");
                $("#day3").addClass("end");
                $("#day4").addClass("on");
                break;
            case '20181214' :
                imgNum = '5';
                monthEvent.detail.fvrSeq = '5';
                imgArt = "12/14";
                $("#day1").addClass("end");
                $("#day2").addClass("end");
                $("#day3").addClass("end");
                $("#day4").addClass("end");
                $("#day5").addClass("on");

                break;
            case '20181215' :
                imgNum = '6';
                monthEvent.detail.fvrSeq = '6';
                imgArt = "12/15";
                $("#day1").addClass("end");
                $("#day2").addClass("end");
                $("#day3").addClass("end");
                $("#day4").addClass("end");
                $("#day5").addClass("end");
                $("#day6").addClass("on");
                break;
            case '20181216' :
                imgNum = '7';
                monthEvent.detail.fvrSeq = '7';
                imgArt = "12/16";
                $("#day1").addClass("end");
                $("#day2").addClass("end");
                $("#day3").addClass("end");
                $("#day4").addClass("end");
                $("#day5").addClass("end");
                $("#day6").addClass("end");
                $("#day7").addClass("on");
                break;
            default :
                imgNum = '1';
                imgArt = "12/11";
                break;
        }

        /*$("#mainImg").attr("src", monthEvent.detail.baseImgPath + "giving_mc_jub"+imgNum+".jpg");
        $("#mainImg").attr("alt", imgArt);*/

        $("#imgDiv").html('<img id="mainImg" src="'+monthEvent.detail.baseImgPath + "giving_mc_jub"+imgNum+".jpg"+'" alt="'+imgArt+'">');
    },

    /* 당첨내역 확인 */
    getStmpMyWinList : function(){
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
              , monthEvent.detail._callback_getStmpMyWinListJson
        );
    },
    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2' class='no'>당첨이력이<br/>없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }
            }
            $("tbody#myWinListHtml").html(myWinListHtml);
        }else{
            alert(json.message);
        }
    },

    appPushJson : function(){
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
            //앱 푸시 수신동의 여부 확인
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181210/getAppPushYnCntJson.do"
                  , param
                  , monthEvent.detail._callback_getAppPushYnCntJson
            );
        }
    },

    _callback_getAppPushYnCntJson : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다.");
            return;
        }else{
            monthEvent.detail.checkGivingTree();
        }

    },

    checkGivingTree:function(){
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

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181210/checkGivingTreeJson.do" // ID 당 1개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당1번만응모했는지체크)
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : monthEvent.detail.fvrSeq
                        , startDate : $("input[id='targetNum']:hidden").val()
                    }
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                      if(json.ret == "0"){
                          if( json.myTotalCnt  == "0" ) {  //한번도 신청하지 않은경우 위수탁 받기
                              $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.giftEntry(' " + fvrSeq + "' ,  ' " + json.myTotalCnt + "'  ); "         );
                              mevent.detail.eventShowLayer('eventLayerPolice');
                          }else {
                              monthEvent.detail.giftEntry(monthEvent.detail.fvrSeq, json.myTotalCnt);
                          }
                      }else{
                            alert(json.message);
                      }
                  }
            );

        }
    },
    giftEntry : function(fvrSeq,myTotalCnt){
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
                    monthEvent.detail.eventCloseLayer();
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    monthEvent.detail.eventCloseLayer();
                    return;
                }
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }

            monthEvent.detail.eventCloseLayer();

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : monthEvent.detail.fvrSeq
                  , startDate : $("input[id='targetNum']:hidden").val()
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181210/giftEntry.do"
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
                   $(".mem_id").text(json.tgtrSeq);
                   mevent.detail.eventShowLayer('evtGF'+monthEvent.detail.fvrSeq);
               }else {
                   // 실패
                   mevent.detail.eventShowLayer('evtGF_fail');
               }
       }else{
           alert(json.message);
       }
   },

   // 레이어 숨김
   eventCloseLayer : function(){
       $(".eventLayer").hide();
       $("#eventDimLayer").hide();
   },

   // 위수탁 레이어 숨김
   eventCloseLayer1 : function(){
       $(".eventLayer").hide();
       $("#eventDimLayer").hide();
       location.reload();//새로고침
   },
}