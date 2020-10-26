/**
 * 배포일자 : 2019.03.28
 * 오픈일자 : 2019.04.01
 * 이벤트명 : 아이소이 다이아몬드
 */
$.namespace("monthEvent.detail");
monthEvent.detail = {
        
    init : function(){

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
     *  응모번호 체크
     */
    rndmValChk : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(!mevent.detail.checkRegAvailable()){
            return;
        }

       if(common.isEmpty($('#rndmVal').val())){
            alert("응모번호를 입력 후 응모해주세요.");
            return;
       }
       
       common.Ajax.sendJSONRequest(
               "GET"
               , _baseUrl + "event/20190401_1/rndmValChk.do"
               , {
                       evtNo : $("input[id='evtNo']:hidden").val()
                       , cpnNo : $("input[id='cpnNo']:hidden").val()
                       , rndmVal :  $('#rndmVal').val()
               }
               , function(json){
                   if(json.ret == "0"){                           
                       //console.log('cCnt: '+ json.cCnt);
                       if(json.cCnt == 0){     //최초 참여 시 위수탁 동의 팝업 노출
                           $(':radio[name="argee1"]:checked').attr("checked", false);
                           $(':radio[name="argee2"]:checked').attr("checked", false);
                           mevent.detail.eventShowLayer('eventLayerPolice');        //위수탁 동의 팝업
                       }else{
                           $(':radio[name="argee1"][value=Y]').attr("checked", true);
                           $(':radio[name="argee2"][value=Y]').attr("checked", true);
                           monthEvent.detail.giftEntry();        //즉석당첨 경품응모
                       }
                   }else{
                       alert(json.message);
                   }
               }
        );
    },

    /* 위수탁 동의 팝업 */    
    popLayerConfirm : function(){
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
    },

    /* 즉석당첨 경품응모 */
    giftEntry : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }else{
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , cpnNo : $("input[id='cpnNo']:hidden").val()
                  , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
                  , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
                  , rndmVal :  $('#rndmVal').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190401_1/giftEntryJson.do"
                  , param
                  , monthEvent.detail._callback_giftEntryJson
            );
        }
    },
    _callback_giftEntryJson : function(json){
        if(json.ret == "0"){
            $("#pk"+json.fvrSeq).text("("+json.itemPk+")");
            mevent.detail.eventShowLayer("winPop"+json.fvrSeq);
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
              , _baseUrl + "event/20190401_1/getMyWinListJson.do"
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