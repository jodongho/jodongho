$.namespace("monthEvent.detail");
monthEvent.detail = {
    snsInitYn : "N",
    snsImgUrl : "https://image.oliveyoung.co.kr/uploads/contents/201803/29birthcard/birthcard_thum1.jpg",     //카톡 공유하기
    snsImgUrl2 : "https://image.oliveyoung.co.kr/uploads/contents/201803/29birthcard/birthcard_thum2.jpg",    //카톡 응모번호 보내기
    
    snsTitle : "올리브영 온라인몰 생일 초대장 도착! 응모권 받고, 100% 혜택 기대해♥",
    snsType : "",
    rndmVal : "",
    mbrNm : "",
    init : function(){
        monthEvent.detail.setTimer();
        
        if(common.isLogin()){
            // 발급여부 확인
            monthEvent.detail.getMyRndmValCpnChkJson();
        };
        
        /* 닫기 */
        $(".eventHideLayer").click(function(){
            mevent.detail.eventCloseLayer();
        });
    },
    
    /**
     * 타이머 시간 설정
     */
    setTimer : function(){
        var getYear = "2018";
        var getMonth = "04";
        var getDay = "02";
        
        var dat1 = new Date(); //현재날짜  
        var dat2 = new Date(getYear, getMonth-1, getDay);
        var diff = dat2 - dat1; //날짜 빼기

        var currSec = 1000; // 밀리세컨
        var currMin = 60 * 1000; // 초 * 밀리세컨
        var currHour = 60 * 60 * 1000; // 분 * 초 * 밀리세컨
        var currDay = 24 * 60 * 60 * 1000; // 시 * 분 * 초 * 밀리세컨
         
        var day = parseInt(diff/currDay); //d-day 일
        var hour = parseInt(diff/currHour); //d-day 시
        var min = parseInt(diff/currMin); //d-day 분
        var sec = parseInt(diff/currSec); //d-day 초
         
        var viewHour = hour-(day*24);
        var viewMin = min-(hour*60);
        var viewSec = sec-(min*60);
        
        for(var i=0; i<10; i++){
            $(".party_time .count .box").removeClass("n"+i);
            $(".party_time .count .box2").removeClass("n"+i);
        }

        // 일 설정
        day = parseInt(diff/currDay);
        if(day < 10){
            $(".party_time .count .box").eq(1).addClass("n"+day);
        } else {
            $(".party_time .count .box").eq(0).addClass("n"+parseInt(day/10));
            $(".party_time .count .box").eq(1).addClass("n"+(day%10));
            $(".party_time .count .box").eq(0).show();
        }
        
        // 시간 설정
        var hour = viewHour;
        if(hour < 10){
            $(".party_time .count .box2").eq(0).addClass("n0");
            $(".party_time .count .box2").eq(1).addClass("n"+hour);
        } else {
            $(".party_time .count .box2").eq(0).addClass("n"+parseInt(hour/10));
            $(".party_time .count .box2").eq(1).addClass("n"+(hour%10));
        }
        
        // 분 설정
        var min = viewMin;
        if(min < 10){
            $(".party_time .count .box2").eq(2).addClass("n0");
            $(".party_time .count .box2").eq(3).addClass("n"+min);
        } else {
            $(".party_time .count .box2").eq(2).addClass("n"+parseInt(min/10));
            $(".party_time .count .box2").eq(3).addClass("n"+(min%10));
        }
        
        // 초 설정
        var sec = viewSec;
        if(sec < 10){
            $(".party_time .count .box2").eq(4).addClass("n0");
            $(".party_time .count .box2").eq(5).addClass("n"+sec);
        } else {
            $(".party_time .count .box2").eq(4).addClass("n"+parseInt(sec/10));
            $(".party_time .count .box2").eq(5).addClass("n"+(sec%10));
        }
        
        setTimeout(function(){monthEvent.detail.setTimer()}, 1000);
    },
    
    /* sns 공유 */
    shareSnsChk : function(type){        
        //로그인여부 체크
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }else{
            if(type == "facebook"){
                monthEvent.detail.snsImgUrl = "";
                monthEvent.detail.snsType = "facebook";
            }else if(type == "url"){
//                monthEvent.detail.snsImgUrl = "";
                monthEvent.detail.snsType = "url";
            }else if(type == "kakaotalk"){
//                monthEvent.detail.snsImgUrl = "";
                monthEvent.detail.snsType = "kakaotalk";
            }
            //최초 공유여부 확인
            monthEvent.detail.getFirstShareChkJson(monthEvent.detail.snsImgUrl, monthEvent.detail.snsTitle, monthEvent.detail.snsType);
        }
    },
    
    /* 최초 공유여부 확인 */
    getFirstShareChkJson : function(snsImgUrl, snsTitle, snsType){
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        var param = {
                fvrSeq : "1",
                evtNo : $("input[id='evtNo']:hidden").val(),
                snsImgUrl : snsImgUrl,
                snsTitle : snsTitle,
                snsType : snsType
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180329/getFirstShareChkJson.do"
              , param
              , this._callback_getFirstShareChkJson
        );
    },
    
    _callback_getFirstShareChkJson : function(json) {
        if(json.ret == "0"){            
            //최초 공유는 개인정보 위수탁 동의팝업 생성
            mevent.detail.eventShowLayer('eventLayerPolice');
        }else{
            if(json.ret == "10"){
                //ID당 1일 최대 10회만 공유 가능
                alert("ID당 1일 최대 10회만 공유 가능합니다.");
            }else{
                //두번째 공유부터는 공유 이력만              
                monthEvent.detail.shareSnsInfoInsertJson(json.snsType);
//                monthEvent.detail.shareSns(json.snsImgUrl, json.snsTitle, json.snsType);
//                if(json.snsType == "url"){
//                    $("#linkUrlStr").html("<textarea style='width:100%;' readonly=''>" + _baseUrl + "E.do?evtNo=" + $("#evtNo").val() + "</textarea>");
//                    mevent.detail.eventShowLayer('eventLayerURL');
//                }
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
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }
            mevent.detail.eventCloseLayer();
            
            monthEvent.detail.shareSnsInfoInsertJson(monthEvent.detail.snsType);
            
        }
    },
    
    /* sns 공유정보 insert */
    shareSnsInfoInsertJson : function(type){        
        //공유정보 insert
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        var param = {
                fvrSeq : "1",
                evtNo : $("input[id='evtNo']:hidden").val(),
                noteCont : "shareSNS_"+type
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180329/shareSnsInfoInsertJson.do"
              , param
              , this._callback_shareSnsInfoInsertJson
        );
    },
    
    _callback_shareSnsInfoInsertJson : function(json) {
        if(json.ret != "0"){
            alert(json.message);
        }else{
            monthEvent.detail.shareSns(monthEvent.detail.snsImgUrl, monthEvent.detail.snsTitle, monthEvent.detail.snsType);
            if(monthEvent.detail.snsType == "url"){
                $("#linkUrlStr").html("<textarea style='width:100%;' readonly=''>" + _baseUrl + "E.do?evtNo=" + $("#evtNo").val() + "</textarea>");
                mevent.detail.eventShowLayer('eventLayerURL');
            }
        }
    },
    
    /* sns 공유 */
    shareSns : function(imgUrl, title, type){
        // 배너 이미지 체크
        var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
        if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
            bnrImgUrlAddr = "";
        } else {
            bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
        }

        // 이미지가 없을 경우 혹은 페이스북 공유 시 배너로 교체
        if(imgUrl == undefined || imgUrl == null || imgUrl == "" || type == "facebook"){
            imgUrl = bnrImgUrlAddr;
        }
        
        if(type == "kakaotalk"){
            //카톡 공유 시 지정 썸네일 이미지로 교체
            imgUrl = monthEvent.detail.snsImgUrl;
        }

        var snsShareUrl = _baseUrl + "E.do?evtNo="+$("#evtNo").val();
        
        if(monthEvent.detail.snsInitYn == "N"){
            common.sns.init(imgUrl, title, snsShareUrl);
            monthEvent.detail.snsInitYn = "Y";
        }
        
        common.sns.doShare(type);
    },
    
    /**
     * 내 응모번호(난수번호) 정보 확인
     */
    getMyRndmValCpnChkJson : function(){
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }else{
            if(!mevent.detail.checkRegAvailable()){
                return;
            }
            var param = {
                    fvrSeq : "2",
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20180329/getMyRndmValCpnChkJson.do"
                  , param
                  , this._callback_getMyRndmValCpnChkJson
            );
        }
    },
    _callback_getMyRndmValCpnChkJson : function(json) {
        if(json.ret == "0"){
            $(".numBox").css("display", "block");
            $(".numBox").html("<span>" + json.rndmVal + "</span>");
            $(".cd_link2_1").attr("onclick", "");
            monthEvent.detail.rndmVal = json.rndmVal;
        }
    },
    
    /**
     * 응모번호(난수번호) 발급 이벤트 참여여부 확인
     */
    getRndmValCpnChkJson : function(){
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }else{
            if(!mevent.detail.checkRegAvailable()){
                return;
            }
            if(typeof fvrSeq == "undefined" || fvrSeq == ""){
                alert("쿠폰 정보가 없습니다.");
                return;
            }
            var param = {
                    fvrSeq : "2"
                  , evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20180329/getRndmValCpnChkJson.do"
                  , param
                  , this._callback_getRndmValCpnChkJson
            );
        }
    },
    _callback_getRndmValCpnChkJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.getRndmValCpnDownJson();
        }else{
            alert(json.message);
        }
    },
    
    /**
     * 응모번호(난수번호) 발급
     */
    getRndmValCpnDownJson : function(){
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        if(typeof fvrSeq == "undefined" || fvrSeq == ""){
            alert("쿠폰 정보가 없습니다.");
            return;
        }
        var param = {
                fvrSeq : "2"
              , evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180329/getRndmValCpnDownJson.do"
              , param
              , this._callback_getRndmValCpnDownJson
        );
    },    
    _callback_getRndmValCpnDownJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.getMyRndmValCpnChkJson();
        }else{
            if(json.ret == "051"){
                alert("응모번호 이벤트가 조기 마감되었습니다.");
            }else{
                alert(json.message);
            }
        }
    },
    
    /* 카카오 알림톡 응모번호 보내기 */
    pushKakaotalk : function(){
        
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }else{
            if(monthEvent.detail.rndmVal == ""){
                alert("먼저 응모번호를 확인해 주세요.");
            }else{
                if(monthEvent.detail.mbrNm == ""){
                    monthEvent.detail.getMbrNmJson();
                    return;
                }else{
                    var title = "[Oliveyoung]\n("+monthEvent.detail.mbrNm+")님의 응모번호가 도착했습니다!\n\n★ 나의 응모번호\n    ("+monthEvent.detail.rndmVal+")\n\n★ 4월 2일 ~ 8일 온라인몰 생일행사에 오셔서 응모해주세요!";
                    var img = monthEvent.detail.snsImgUrl2;
                    var snsShareUrl = _baseUrl + "E.do?evtNo="+$("#evtNo").val();

                    if(monthEvent.detail.snsInitYn == "N"){
                        common.sns.init(img, title, snsShareUrl);
                        monthEvent.detail.snsInitYn = "Y";
                    }
                    
                    Kakao.Link.sendTalkLink({
                        label: title,
                        image : {
                            src : img,
                            width : 550,
                            height : 550
                        },
                        webButton : {
                            text : '올리브영에서 보기',
                            url : snsShareUrl
                        }
                    });
                }
            }
        }
    },
    
    /* 앱 푸시 설정 바로가기 */
    goPushSetting : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 설정해 주세요.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/20180329/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }
        }else{
            common.app.callSettings();
        }
    },
    
    /* 최초 공유여부 확인 */
    getMbrNmJson : function(){
        var param = "";
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180329/getMbrNmJson.do"
              , param
              , this._callback_getMbrNmJson
        );
    },
    
    _callback_getMbrNmJson : function(json) {
        monthEvent.detail.mbrNm = json.mbrNm;
        monthEvent.detail.pushKakaotalk();
    },
    
}
