$.namespace("monthEvent.detail");
monthEvent.detail = {
    _ajax : common.Ajax,
    snsInitYn : "N",    
    entryTotCnt : "",
    sbscAbleStampCnt : "",
    sbscStampCnt : "",
    firstYn : "",
    appPushStampCnt : "",

    init : function(){
        
        $('.try').one("click", function () {        //응모하기 광클을 막고 한번만 실행되어야 하기에 .one 사용
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    location.reload();      //스크래치 원상복구를 위해 페이지 새로고침(응모 가능 횟수 알럿 이후 클릭 자체가 막히기 때문에)
                    return;
                }
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }
                
                if(monthEvent.detail.sbscAbleStampCnt.numberFormat() <= 0){
                    alert("나의 응모 가능 횟수를 확인해 주세요.");
                    location.reload();      //스크래치 원상복구를 위해 페이지 새로고침(응모 가능 횟수 알럿 이후 클릭 자체가 막히기 때문에)
                    return;
                }
                
                $(':radio[name="argee1"]:checked').attr("checked", false);
                $(':radio[name="argee2"]:checked').attr("checked", false);
                
                monthEvent.detail.getFirstChk();                
            }
        });
        
        if(common.isLogin()){
            // 내가 찾은 스탬프 노출 및 응모권 확인
            monthEvent.detail.getConrStampListJson();
        };
        
        /* 레이어 닫기 */
        $(".eventHideLayer").click(function(){
            monthEvent.detail.eventCloseLayer();
        });
        /* 위수탁 레이어 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        /* 경품 레이어 닫기 */
        $(".eventHideLayer2").click(function(){
            monthEvent.detail.eventCloseLayer2();
        });
    },
    
    /* 위수탁동의 팝업 노출을 위한 최초응모여부 확인 */
    getFirstChk : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180530_2/getFirstChkJson.do"
              , param
              , this._callback_getFirstChkJson
        );
    },    
    _callback_getFirstChkJson : function(json) {        
        if(json.ret == "0"){
            monthEvent.detail.firstYn = "Y";        //최초 참여 여부 변수값
            monthEvent.detail.eventShowLayer1('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
        }else{
            monthEvent.detail.firstYn = "N";        //최초 참여 여부 변수값
            monthEvent.detail.giftEntryPopup();        //즉석당첨 경품 응모
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
            
            if("Y" == $(':radio[name="argee1"]:checked').val() && "Y" == $(':radio[name="argee2"]:checked').val()){
                mevent.detail.eventCloseLayer();
                monthEvent.detail.giftEntryPopup();        //즉석당첨 경품 응모
            }
        }
    },
    
    /* 즉석당첨 경품 응모 */    
    giftEntry : function(){
        /*일자별 스탬프 seq값에 따라 경품 seq값 매칭
         * ex) $("#ref3val").val() : 1은 0530 스탬프의 seq값이며 이는 0530 경품(캐논 EOS 200D 화이트) seq값인 10으로 매칭 
         */
        
        if(monthEvent.detail.sbscAbleStampCnt.numberFormat() <= 0){
            alert("나의 응모 가능 횟수를 확인해 주세요.");
            return;
        }
        
        var todayFvrSeq = "";
        if($("#ref3val").val() == "1"){
            todayFvrSeq = "10";
        }else if($("#ref3val").val() == "2"){
            todayFvrSeq = "11";
        }else if($("#ref3val").val() == "3"){
            todayFvrSeq = "12";
        }else if($("#ref3val").val() == "4"){
            todayFvrSeq = "13";
        }else if($("#ref3val").val() == "5"){
            todayFvrSeq = "14";
        }else if($("#ref3val").val() == "6"){
            todayFvrSeq = "15";
        }else if($("#ref3val").val() == "7"){
            todayFvrSeq = "16";
        }
        
        var noteCont = "";
        if(monthEvent.detail.appPushStampCnt == "0"){
            noteCont = "appPushStamp";
        }
//        alert("noteCont==>"+noteCont);
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : todayFvrSeq
              , mbrInfoUseAgrYn : $("input[name='argee1']:radio:checked").val()       //개인정보 이용 동의 여부
              , mbrInfoThprSupAgrYn : $("input[name='argee2']:radio:checked").val()    //개인정보 위탁동의 여부
              , firstYn : monthEvent.detail.firstYn     //최초참여여부
              , noteCont : noteCont     //스탬프 사용한 응모
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180530_2/giftEntryJson.do"
              , param
              , monthEvent.detail._callback_giftEntryJson
        );
    },
    _callback_giftEntryJson : function(json){
        if(json.ret == "0"){
            // 스크래치 팝업 z-index 조정
//            var myArticle = $('#today_scratch');
//            if(myArticle.hasClass('rize')){
//                myArticle.removeClass('rize');
//            } else {
//                myArticle.addClass('rize');
//                myArticle.css('z-index', '999');
//            }            
//            mevent.detail.eventShowLayer('today_scratch');
//            $("#todayGift").attr("src",_cdnImgUrl+"contents/201805/30today/today_pop_gift0"+$("#ref3val").val()+".jpg");
            
            if(json.winYn=="Y"){
                $("#scratch").addClass("success");
            }else{
                $("#scratch").addClass("fail");
            }            
        }else{
            alert(json.message);
        }
//        // 응모 후 응모권 갱신을 위한 응모권 확인 ※경품 스크래치 레이어 닫을때 새로고침 하니까 필요 없음
//        monthEvent.detail.getConrStampListJson();
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
              , _baseUrl + "event/20180530_2/getMyWinListJson.do"
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
            mevent.detail.eventShowLayer('eventLayerWinDetail');
        }else{
            alert(json.message);
        }
    },
    
    //스탬프 힌트보기
    getStampHintJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180530_2/getStampHintJson.do"
                  , {}
                  , this._callback_getStampHintJson
            );
        }
        
    },
    _callback_getStampHintJson : function(json){
        $("#todayStampHint").attr("src",_cdnImgUrl+"contents/201805/30today/today_hint0"+json.ref3val+".png");
        if(json.ref3val == "1"){
            $("#todayStampHint").attr("alt", "5월30일 힌트");
        }else if(json.ref3val == "2"){
            $("#todayStampHint").attr("alt", "5월31일 힌트");
        }else if(json.ref3val == "3"){
            $("#todayStampHint").attr("alt", "6월01일 힌트");
        }else if(json.ref3val == "4"){
            $("#todayStampHint").attr("alt", "6월02일 힌트");
        }else if(json.ref3val == "5"){
            $("#todayStampHint").attr("alt", "6월03일 힌트");
        }else if(json.ref3val == "6"){
            $("#todayStampHint").attr("alt", "6월04일 힌트");
        }else if(json.ref3val == "7"){
            $("#todayStampHint").attr("alt", "6월05일 힌트");
        }
        mevent.detail.eventShowLayer('eventHint');
    },
    
    //내가 찾은 스탬프 노출
    getConrStampListJson : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180530_2/getConrStampListJson.do"
              , param
              , this._callback_getConrStampListJson
        );
    },
    _callback_getConrStampListJson : function(json){
        if(json.ret=="0"){
            var searchStampList = json.searchStampList;
            if(searchStampList != null && searchStampList !=""){                
                for(var i=0; i<searchStampList.length; i++){        //스탬프 리스트만큼 돌면서 스탬프 이미지 노출
                    $("#stampOn"+searchStampList[i]).html("<img src='"+_cdnImgUrl+"contents/201805/30today/today_stamp_on"+searchStampList[i]+".png' alt='' >");
                }
            }
            monthEvent.detail.entryTotCnt = json.entryTotCnt.toString();         //총 응모권 수

            if(json.sbscAbleStampCnt.numberFormat() <= 0){
                monthEvent.detail.sbscAbleStampCnt = 0;      //응모 가능 횟수
            }else {
                monthEvent.detail.sbscAbleStampCnt = json.sbscAbleStampCnt;      //응모 가능 횟수
            }
            monthEvent.detail.sbscStampCnt = json.sbscStampCnt;                 //응모 횟수
            if(json.appPushStampCnt == "0"){        //앱푸시 스탬프로 경품 응모한 적 없으면
                monthEvent.detail.appPushStampCnt = "0";
            }else{
                monthEvent.detail.appPushStampCnt = json.appPushStampCnt;
            }
            
            //총 응모권 수            
            $("#entryTotCnt").text(json.entryTotCnt);
            
            //응모 가능 횟수
            $("#sbscAbleStampCnt").text(monthEvent.detail.sbscAbleStampCnt);
            
            //응모한 횟수
            $("#sbscStampCnt").text(json.sbscStampCnt);
            
            //이벤트 기간 내 신규 회원가입 스탬프
            if(json.newMbrYnCnt == "1"){
                $("#todayMission1").attr("src", _cdnImgUrl+"contents/201805/30today/today_mission_on1.png");
            }          
            
            //앱푸시 수신동의 여부 스탬프
            if(json.appPushYnCnt == "1"){
                $("#todayMission2").attr("src", _cdnImgUrl+"contents/201805/30today/today_mission_on2.png");
            }
            
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
                imgUrl = "http:" + _cdnImgUrl + "contents/201805/30today/thumb_tab2.jpg";
            }

            var snsShareUrl = _baseUrl + "E.do?evtNo="+$("#evtNo").val();
            var title = "5/30~6/5 단 일주일! 올리브영 온라인몰 오늘세일 방문하고 경품 응모하세요★";
            
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
        $("#eventDimLayer1").hide();
    },
    
    // 위수탁 레이어 숨김
    eventCloseLayer1 : function(){
        alert("신청되지 않았습니다.");
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
        location.reload();      //위수탁 동의 x일 때 스크롤 맨위로 가게하기 위해 페이지 새로고침
    },
    
    // 경품 레이어 숨김
    eventCloseLayer2 : function(){
        $(".eventLayer").hide();
        $("#eventDimLayer").hide();
        $("#eventDimLayer1").hide();
        location.reload();      //스크래치 원상복구를 위해 페이지 새로고침
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
    
    giftEntryPopup : function(){
     // 스크래치 팝업 z-index 조정
        var myArticle = $('#today_scratch');
        if(myArticle.hasClass('rize')){
            myArticle.removeClass('rize');
        } else {
            myArticle.addClass('rize');
            myArticle.css('z-index', '999');
        }            
        mevent.detail.eventShowLayer('today_scratch');
        $("#todayGift").attr("src",_cdnImgUrl+"contents/201805/30today/today_pop_gift0"+$("#ref3val").val()+".jpg");
        
    },
    
};
  