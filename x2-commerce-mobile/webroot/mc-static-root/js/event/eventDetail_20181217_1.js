$.namespace("monthEvent.detail");
monthEvent.detail = {

    currentDay : null,
    list : null,
    myTotalCnt : 0,
    ordCheckCnt : 0,
    cpnNo : "",
    init : function(){

        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);

        // 나의 당첨내역
        $("div#eMylist").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }
            /* 당첨이력조회 */
            monthEvent.detail.getMyWinList();
        });

        //나의 응모기회 확인하기
        $("#ordCheck").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val()+"#evtTab02");
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    monthEvent.detail.getEvtOrdListJson();
                }
            }
        });

        $("[id^=point]").click(function(){
            var num = Number($(this).attr("id").replace("point",""))-1;
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val()+"#evtTab02");
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    if(monthEvent.detail.ordCheckCnt == 0){
                        alert("나의 응모기회 확인 후 응모가능합니다.");
                        return;
                    }
                    if(monthEvent.detail.list == null){
                        alert("이벤트 기간 내 구매 시 응모 가능합니다.");
                        return;
                    }else if(monthEvent.detail.list == 0){
                        alert("이벤트 기간 내 구매 시 응모 가능합니다.");
                        return;
                    }else{
                        if(num >= monthEvent.detail.list.length){
                            alert("이벤트 기간 내 구매 시 응모 가능합니다.");
                            return;
                        }else if(monthEvent.detail.list[num].fvrSeq != "0"){
                            alert("버튼 당 1회만 응모 가능합니다.");
                            return;
                        }else{
                            if(monthEvent.detail.myTotalCnt == 0 ){
                                $("#Confirmlayer1").attr("onclick", "monthEvent.detail.pointEntry('"+num+"')");
                                mevent.detail.eventShowLayer('eventLayerPolice');
                            }else{
                                monthEvent.detail.pointEntry(num);
                            }
                        }
                    }
                }
            }

        });

        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통
            monthEvent.detail.eventCloseLayer();
        });

        /* 유의사항 닫기 */
        $(".eventHideLayer2").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });

     // scroll class 변경
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

        //찰떡카테고리 확인하기
        $("#checkCategory").click(function(){
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                monthEvent.detail.getEventOrdCategoryInfoJson();
            }
        });

        $("#downCpn").click(function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val()+"#evtTab01");
                }else{
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else{
                    if(monthEvent.detail.cpnNo == ""){
                        alert("2018 찰떡 카테고리 조회 후 다운 가능합니다.");
                        return;
                    }else{
                        var param = {
                                evtNo : $("input[id='evtNo']:hidden").val()
                         };
                         common.Ajax.sendJSONRequest(
                                 "GET"
                               , _baseUrl + "event/20181217_1/getCategoryCpnCnt.do"
                               , param
                               , monthEvent.detail._callback_getCategoryCpnCntJson
                         );
                    }
                }
            }
        });

        monthEvent.detail.categoryCheckJson();
    },

    getEvtOrdListJson : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , startDate : $("input[id='targetNum']:hidden").val()
         };
         common.Ajax.sendJSONRequest(
                 "GET"
               , _baseUrl + "event/20181217_1/getEvtOrdList.do"
               , param
               , monthEvent.detail._callback_getEvtOrdListJson
         );
    },

    //나의 응모기회 확인하기 callback
    _callback_getEvtOrdListJson : function(json){
        if(json.ret != "0"){
            alert(json.message);
            return;
        }

        monthEvent.detail.list = json.eventOrdList;

        $.each(json.eventOrdList, function(index, element){
            if(element.fvrSeq == "0"){
                if(element.ordPayAmt != 0){
                    $("#point"+Number(index+1)).removeClass("type1");
                    $("#point"+Number(index+1)).removeClass("type3");
                    $("#point"+Number(index+1)).removeClass("type4");
                    $("#point"+Number(index+1)).addClass("type2");
                    $("#point"+Number(index+1)).html('<span><p class="txt_pt"><span>'+element.ordPayAmt+'</span>포인트 도전</p></span>');
                }
            }else{
                if(element.evtTgtrSctCd == "30"){
                    $("#point"+Number(index+1)).removeClass("type1");
                    $("#point"+Number(index+1)).removeClass("type2");
                    $("#point"+Number(index+1)).removeClass("type4");
                    $("#point"+Number(index+1)).addClass("type3");
                    $("#point"+Number(index+1)).html('<p class="txt_pt"><span>'+element.tgtrAmt+'</span>포인트 당첨</p>');
                }else{
                    $("#point"+Number(index+1)).removeClass("type1");
                    $("#point"+Number(index+1)).removeClass("type2");
                    $("#point"+Number(index+1)).removeClass("type3");
                    $("#point"+Number(index+1)).addClass("type4");
                    $("#point"+Number(index+1)).html('<span class="hidden">응모완료</span>');
                }
                monthEvent.detail.myTotalCnt++;
            }
        });

        for(var i=json.eventOrdList.length+1;i<=5;i++){
            $("#point"+i).removeClass("type2");
            $("#point"+i).removeClass("type3");
            $("#point"+i).removeClass("type4");
            $("#point"+i).addClass("type1");
            $("#point"+i).html('<span class="hidden">페이백 도전</span>');
        }

        monthEvent.detail.ordCheckCnt++;
    },

    getEventOrdCategoryInfoJson : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,strtDtime : $("input[id='strtDtime']:hidden").val()
                ,endDtime : $("input[id='endDtime']:hidden").val()
         };
         common.Ajax.sendJSONRequest(
                 "GET"
               , _baseUrl + "event/20181217_1/getEventOrdCategoryInfo.do"
               , param
               , monthEvent.detail._callback_getEventOrdCategoryInfoJson
         );
    },

    _callback_getEventOrdCategoryInfoJson : function(json){
        var categoryInfo = json.categoryInfo;
        if(categoryInfo == null){
            $("#cpn1").removeClass("on");
            $("#cpn2").removeClass("on");
            $("#cpn3").addClass("on");

            monthEvent.detail.cpnNo = $("#cpnNo").val();
        }else{
            monthEvent.detail.cpnNo = categoryInfo.cpnNo;
            $(".buy_cateitem").html("<em>"+categoryInfo.catNm+"</em><span>"+categoryInfo.ordQty+"</span>개 구매(<span>"+categoryInfo.ordPct+"%</span>)</p>");
            $("#cpn1").removeClass("on");
            $("#cpn3").removeClass("on");
            $("#cpn2").addClass("on");
        }
    },

    _callback_getCategoryCpnCntJson : function(json){

        if(json.cpnCnt > 0){
            alert("이미 발급 받으셨습니다.");
            return;
        }else{
            monthEvent.detail.downCouponJson();
        }
    },

    downCouponJson : function() {
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
                if(typeof monthEvent.detail.cpnNo == "undefined" || monthEvent.detail.cpnNo == ""){
                    alert("쿠폰 번호가 없습니다.");
                    return;
                }
                var param = {cpnNo : monthEvent.detail.cpnNo};
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

    /* 당첨내역 확인 */
    getMyWinList : function(){
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

    pointEntry : function(num){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 신청 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val()+"#evtTab02");
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }

            if(monthEvent.detail.myTotalCnt == 0 ){
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
                  , ordNo : monthEvent.detail.list[num].ordNo
                  , ordPayAmt : monthEvent.detail.list[num].ordPayAmt
                  , winRnk : monthEvent.detail.list[num].winRnk
                  , startDate : $("input[id='targetNum']:hidden").val()
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
            };

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181217_1/pointEntry.do"
                  , param
                  , monthEvent.detail._callback_pointEntryJson
            );
        }
    },

    _callback_pointEntryJson : function(json){
        if(json.ret == "0"){
            if(json.winYn=="Y"){
                mevent.detail.eventShowLayer('evtGift');
            }else{
                mevent.detail.eventShowLayer('evtGiftFail');
            }
            monthEvent.detail.getEvtOrdListJson();
        }else{
            alert(json.message);
            monthEvent.detail.getEvtOrdListJson();
        }
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

    /* 앱 푸시 설정 바로가기 */
    goSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 설정해 주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    },

    categoryCheckJson : function(){
        if(!common.isLogin()){
            return;
        }else{
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
             };
             common.Ajax.sendJSONRequest(
                     "GET"
                   , _baseUrl + "event/20181217_1/getCategoryCheckYn.do"
                   , param
                   , monthEvent.detail._callback_categoryCheckJson
             );
        }
    },

    _callback_categoryCheckJson : function(json){
        if(json.checkYn == "Y"){
            $("#checkCategory").click();
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