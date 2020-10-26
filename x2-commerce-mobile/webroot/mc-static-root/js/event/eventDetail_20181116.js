$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    firstYn : "",
        
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
                
        /* 닫기  */
        $(".eventHideLayer").click(function(){
           // mevent.detail.eventCloseLayer(); 공통 
            monthEvent.detail.eventCloseLayer();
        });
        
        /* 위수탁 레이어 닫기 */
        $(".eventHideLayer2").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
        $("#rndmVal").attr("maxlength", 8);

    },
    
    /**
     *  CC_CPN_RNDM_INFO 테이블에서 난수번호 있는지 체크 
     *  전체 아이템 확률 돌려서 경품 당첨 체크 
     *  이벤트 응모 테이블(두개) 인서트 
     *  //// 
     *  응모 입력시 난수번호 맞는지 체크 
     *  ID당 2개의 응모번호만 응모했는지 체크 
     *  위수탁 팝업노출
     *  동의하면 
     *  전체아이템 확률 돌려서 경품 당첨 확인 (9개중 무조건 당첨, 최초1회는 랜덤 2회는 무조건 one포인트)
     *  이벤트 응모테이블두개에 인서트 
     *  그게 맞는 경품 당첨 팝업 노출 
     */
    rndmValChk : function(){
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

           if(common.isEmpty($('#rndmVal').val())){
                alert("응모번호를 입력해주세요.");
                return;
           }
           
           var cpnNo1 = "";
           var cpnNo2 = "";
           var cpnNo3 = "";
           var cpnNo4 = "";
           var cpnNo5 = "";
           var cpnNo6 = "";
           
           if($("#profile").val() == "dev"){
               cpnNo1 = "g0CzCBI3VCbajQfxp3NIPQ==";
           }else if($("#profile").val() == "qa"){
               cpnNo1 = "g0CzCBI3VCY2xaa/MWFKQA=="; //C000000005026
           }else if($("#profile").val() == "prod"){
               cpnNo1 = "g0CzCBI3VCasiQvAmevoAw==";   //C000000006355
               cpnNo2 = "g0CzCBI3VCbCFl13sITkVw==";   //C000000006356
               cpnNo3 = "g0CzCBI3VCZAHb8pWcNpIQ==";   //C000000006357
               cpnNo4 = "g0CzCBI3VCbF0xk5+etA0A==";   //C000000006358
               cpnNo5 = "g0CzCBI3VCYLOxXPtXjC0A==";   //C000000006359
               cpnNo6 = "g0CzCBI3VCZZVNeJ995qRQ==";   //C000000006360
           }
           
           common.Ajax.sendJSONRequest(
                   "GET"
                   , _baseUrl + "event/20181116/rndmValChk.do" // ID 당 2개의 응모번호만 응모가능 (1. 난수번호체크 , 2.ID당2번만응모했는지체크)
                   , {
                           evtNo : $("input[id='evtNo']:hidden").val()
                           , cpnNo1 : cpnNo1
                           , cpnNo2 : cpnNo2
                           , cpnNo3 : cpnNo3
                           , cpnNo4 : cpnNo4
                           , cpnNo5 : cpnNo5
                           , cpnNo6 : cpnNo6
                           , rndmVal :  $('#rndmVal').val()
                   }
                   , function(json){
                       if(json.ret == "0"){                           
                           if(json.firstYn == "Y"){     //최초 참여 시 위수탁 동의 팝업 노출
                               $(':radio[name="argee1"]:checked').attr("checked", false);
                               $(':radio[name="argee2"]:checked').attr("checked", false);
                               mevent.detail.eventShowLayer('eventLayerPolice');        //위수탁 동의 팝업
                           }else{
                               monthEvent.detail.giftEntry();        //즉석당첨 경품응모
                           }
                       }else{
                           alert(json.message);
                       }
//                       $(':radio[name="argee1"]:checked').attr("checked", false);
//                       $(':radio[name="argee2"]:checked').attr("checked", false);
//                       
//                       if(json.ret == "0"){
//                           //$("div#Confirmlayer1").attr("onClick", "monthEvent.detail.oneDayTurnCandleInfo('" + fvrSeq + "');");
//                           $("div#Confirmlayer1").attr("onClick", "monthEvent.detail.entryNumGetPrizes('" + rndmVal + "');");
//                           mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
//                           mevent.detail.eventShowLayer('eventLayerPolice');
//                       }else{
//                           $('#rndmVal').val(''); // 초기화
//                           alert(json.message);
//                       }
                   }
            );
        }
    },
    
    /* 위수탁 동의 팝업 */    
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                return;
            }
            if("N" == $(':radio[name="argee1"]:checked').val() && "N" == $(':radio[name="argee2"]:checked').val() ){
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
            
            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.eventCloseLayer();
                monthEvent.detail.giftEntry();        //즉석당첨 경품응모
            }
        }
    },
    
    /* 즉석당첨 경품응모 */
    giftEntry : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mevent.detail.checkLogin()){
                return;
            }else{
                
                var cpnNo1 = "";
                var cpnNo2 = "";
                var cpnNo3 = "";
                var cpnNo4 = "";
                var cpnNo5 = "";
                var cpnNo6 = "";
                
                if($("#profile").val() == "dev"){
                    cpnNo1 = "g0CzCBI3VCbajQfxp3NIPQ==";
                }else if($("#profile").val() == "qa"){
                    cpnNo1 = "g0CzCBI3VCY2xaa/MWFKQA=="; //C000000005026
                }else if($("#profile").val() == "prod"){
                    cpnNo1 = "g0CzCBI3VCasiQvAmevoAw==";   //C000000006355
                    cpnNo2 = "g0CzCBI3VCbCFl13sITkVw==";    //C000000006356
                    cpnNo3 = "g0CzCBI3VCZAHb8pWcNpIQ==";  //C000000006357
                    cpnNo4 = "g0CzCBI3VCbF0xk5+etA0A==";    //C000000006358
                    cpnNo5 = "g0CzCBI3VCYLOxXPtXjC0A==";    //C000000006359
                    cpnNo6 = "g0CzCBI3VCZZVNeJ995qRQ==";   //C000000006360
                }
                
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , cpnNo1 : cpnNo1
                      , cpnNo2 : cpnNo2
                      , cpnNo3 : cpnNo3
                      , cpnNo4 : cpnNo4
                      , cpnNo5 : cpnNo5
                      , cpnNo6 : cpnNo6
                      , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
                      , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
                      , firstYn : monthEvent.detail.firstYn     //최초참여여부
                      , rndmVal :  $('#rndmVal').val()
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20181116/giftEntryJson.do"
                      , param
                      , monthEvent.detail._callback_giftEntryJson
                );
            }
        }
    },
    _callback_giftEntryJson : function(json){
        if(json.ret == "0"){
            $("#pk"+json.fvrSeq).text("("+json.itemPk+")");
            mevent.detail.eventShowLayer("evtGcG"+json.fvrSeq);
            $('#rndmVal').val("");
        }else{
            alert(json.message);
        }
        
    },
    
    /* 나의 당첨내역 */
    getMyWinList : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181116/getMyWinListJson.do"
              , param
              , monthEvent.detail._callback_getMyWinListJson
        );
    },
    _callback_getMyWinListJson : function(json){
        if(json.ret == "0"){
            if(json.myEvtWinList.length > 0){
                var myWinListHtmlGift = "";

                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                     myWinListHtmlGift += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }

                if(myWinListHtmlGift != ""){
                    $("tbody#myWinListHtmlGift").html(myWinListHtmlGift);
                }                
            }
            mevent.detail.eventShowLayer('evtPopWinDetail');
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