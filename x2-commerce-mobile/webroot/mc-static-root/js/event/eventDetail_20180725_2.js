$.namespace("monthEvent.detail");
monthEvent.detail = {
    firstYn : "",

    init : function(){
        
        if(common.isLogin()){
                    
        };

        /* 닫기  */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();            
        });

        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            alert("동의 후 참여 가능합니다.");
            monthEvent.detail.eventCloseLayer1();
            $('.btn_start').css('display','block');
        });
        
        /* 경품 레이어 닫기  */
        $(".eventHideLayer2").click(function(){
            $('.btn_start').css('display','block');
            $(".m1 .rider").removeClass("die");
            $(".m2 .rider").removeClass("die");
            $(".m3 .rider").removeClass("die");
            $(".m1 .rider").removeClass("live");
            $(".m2 .rider").removeClass("live");
            $(".m3 .rider").removeClass("live");
            monthEvent.detail.eventCloseLayer();            
        });
        
    },
    
    /* 위수탁동의 팝업 노출을 위한 응모여부 확인 */
    getFirstChk : function(){
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
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : "1"
                }
                
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20180725_2/getFirstChkJson.do"
                      , param
                      , this._callback_getFirstChkJson
                );
            }
            
        }
        
    },    
    _callback_getFirstChkJson : function(json) {
        if(json.ret == "0"){
            if(json.myTotalCnt == "0") {
                monthEvent.detail.firstYn = "Y";        //최초 참여 여부 변수값
                $('.btn_start').css('display','none');
                monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
            }else{
                $('.btn_start').css('display','none');
            }
        }else{
            if(json.ret == "025"){      //앱 푸시 수신동의 체크 고객만 참여 가능
                alert(json.message);
            }else{
                monthEvent.detail.firstYn = "N";        //최초 참여 여부 변수값
                alert("오늘은 이미 참여하셨습니다.");
            }
            
        }
    },
    
    /* 위수탁 동의 팝업 */
    popLayerConfirm : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if($(':radio[name="argee1"]:checked').val() == undefined &&  $(':radio[name="argee2"]:checked').val() == undefined ){
                alert("2가지 모두 동의 후 참여 가능합니다.");
                $('.btn_start').css('display','block');
                return;
            }
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("2가지 모두 동의 후 참여 가능합니다.");
                $('.btn_start').css('display','block');
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("2가지 모두 동의 후 참여 가능합니다.");
                $('.btn_start').css('display','block');
                return;
            }
            
            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                monthEvent.detail.eventCloseLayer();
            }
        }
    },
    
    /* 라인선택(캐릭터 선택) */
    selectLine : function(lineVal){
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
                $(".choice1").removeAttr("onclick");
                $(".choice2").removeAttr("onclick");
                $(".choice3").removeAttr("onclick");
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , fvrSeq : "1"
                      , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
                      , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
                      , firstYn : monthEvent.detail.firstYn     //최초참여여부
                      , lineVal : lineVal       //선택한 라인(캐릭터) 번호
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + "event/20180725_2/giftEntryJson.do"
                      , param
                      , monthEvent.detail._callback_giftEntryJson
                );
            }
        }
    },
    _callback_giftEntryJson : function(json){
        if(json.ret == "0"){
            if(json.winYn=="Y"){
                if(json.lineVal=="1"){
                    $(".m1 .rider").addClass("live");
                }else if(json.lineVal=="2"){
                    $(".m2 .rider").addClass("live");
                }else if(json.lineVal=="3"){
                    $(".m3 .rider").addClass("live");
                }
                $('.move').addClass('on');
                
                setTimeout(function() {     //2초 후 레이어팝업
                    mevent.detail.eventShowLayer("evtGift1");
                    $(".mem_id").text("("+json.mbrId+")");
                }, 2000);
                
            }else{
                if(json.lineVal=="1"){
                    $(".m1 .rider").addClass("die");
                }else if(json.lineVal=="2"){
                    $(".m2 .rider").addClass("die");
                }else if(json.lineVal=="3"){
                    $(".m3 .rider").addClass("die");
                }
                $('.move').addClass('on');
                
                setTimeout(function() {     //2초 후 레이어팝업
                    mevent.detail.eventShowLayer("evtGift_fail");
                }, 2000);
            }
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
              , _baseUrl + "event/20180725_2/getMyWinListJson.do"
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
    
    // 레이어 숨김
    eventCloseLayer : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
    },
    
    // 레이어 숨김
    eventCloseLayer1 : function(){
        $(':radio[name="argee1"]:checked').attr("checked", false);
        $(':radio[name="argee2"]:checked').attr("checked", false);
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();        
        $("#eventDimLayer1").hide();
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
