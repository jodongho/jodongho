/** 
 * 배포일자 : 2018.11.01
 * 오픈일자 : 2018.11.06
 * 이벤트명 : 1111 EVENT
     * 사다리 타기 1,2,3,4 그림 클릭 시작
     * 0. 모바일 앱 체크
     * 1. 앱 푸시 수신 동의 체크 -> 동의 후 참여 가능합니다 alert. (무조건 확인)
     * 2. 최초 클릭 시 개인정보 위수탁 레이어 팝업 동의 후 사다리 영역 활성화.
     * 3. 네 가지 캐릭터 중 하나 클릭.
     * 4. 매일 1회 참여 가능
 * */ 

$.namespace("monthEvent.detail"); 
monthEvent.detail = {
        //탭 2번 관련 start
        _ajax : common.Ajax,
        snsInitYn : "N",
        firstYn : "",
        matchYn : "N",     //카카오톡 친구 매칭 여부
        amtChkYn : "N",    //누적 구매금액 확인 여부
        matchMbrId : "",        //매칭된 상대방 ID
        totalPayAmt : "",      //누적 구매금액 (매칭된 친구와 합산)
        //탭 2번 관련 end
        
        selectNum : null,
        tempFvrSeq : null,
        currentDay : null,
        selectNum : null,
        tempFvrSeq : null,
        currentDay : null,
        
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
        
        //카톡 공유를 받아서 접속한 경우
        if($("input[id='reCommend']:hidden").val() != "" && $("input[id='reCommend']:hidden").val() != undefined){
            if(!mevent.detail.checkLogin()){
                return;
            }
            //내 매칭여부 확인(매칭 안된 상태면 초대한 사람이 다른 친구와 이미 매칭되었는지 확인)
            monthEvent.detail.myMatchChkReCommendJson();
        };
        
        /* 레이어 닫기 */
        $(".eventHideLayer1").click(function(){
            monthEvent.detail.eventCloseLayer();
        });
        
        /* 위수탁 레이어 닫기 */
        $(".eventHideLayer2").click(function(){
            monthEvent.detail.eventCloseLayer1();
        });
        
        /* 카카오 친구 매칭된 id */
        monthEvent.detail.myMatchChkJson();
        
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();
        monthEvent.detail.currentDay = monthEvent.detail.currentDay.substring(0, 8);
        
        /* 당첨내용 닫기 */
        $(".eventHideLayer3").click(function(){
            monthEvent.detail.eventCloseLayer3();
        });
        
        //start
        $('.game_start').click(function(){
            //APP PUSH AGREE CHECK
            monthEvent.detail.appPushJson1();

        });
    },
    
    /* 초대한 사람의 ID가 다른 친구와 이미 매칭되었는지 확인 */
    reCommendMatchChk : function(){
        var param = {
                reCommend : decodeURIComponent($("input[id='reCommend']:hidden").val())
              , evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "1"
        };

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181111/reCommendMatchChkJosn.do"
              , param
              , monthEvent.detail._callback_reCommendMatchChkJosn
        );
    },
    _callback_reCommendMatchChkJosn : function(json){
        if(json.reCommendMatchYn == "Y"){       //이미 매칭된 초대자
            alert("이미 다른 친구와 매칭되었습니다. 직접 친구를 초대해 보세요!");
        }else{      //아직 매칭안된 초대자일 경우에 매칭 등록
            if(confirm("친구로 등록 하시겠습니까? 한번 등록된 친구는 삭제/변경이 불가능 합니다.")){
                monthEvent.detail.addKaKaoTalkFriend();
            }
        }
//      console.log(json);
    },
    
    /* 카카오친구 접속 */
    addKaKaoTalkFriend : function(){
        var param = {
                reCommend : decodeURIComponent($("input[id='reCommend']:hidden").val())
              , evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : "1"
        };

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20181111/addKaKaoFriendJosn.do"
              , param
              , monthEvent.detail._callback_addKaKaoFriendJosn
        );
    },
    _callback_addKaKaoFriendJosn : function(json){
        if(json.ret == "0"){
            /* 카카오 친구 매칭된 id */
            monthEvent.detail.myMatchChkJson();
        }else{
            alert(json.message);
        }
//      console.log(json);
    },
    
    /* 공유하기 전 매칭 친구 있는지 확인(매칭이력 존재하면 공유하기 불가) */
    shareSnsBeforeChk : function(){
        if(monthEvent.detail.matchYn == "Y"){       //매칭된 친구가 있으면 안내 알럿
            alert("이미 등록된 친구가 있습니다.");
            return;
        }else{      //매칭된 친구가 없으면
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp){       //앱에서만 초대 가능하도록 앱여부 체크
                if(confirm("모바일 앱에서만 참여 가능합니다.")){
                    common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
                }else{
                    return;
                }
            }else{      //매칭된 친구도 없고, 앱일 때 카톡 공유 실행
                monthEvent.detail.shareSns();
            }
        }
        
    },
    
    /* 공유하기 */
    shareSns : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }

        var evtNo = $("input[id='evtNo']:hidden").val();
        var reCommend = encodeURIComponent($("input[id='targetNum']:hidden").val());
      var imgUrl = "http:" + _cdnImgUrl + "contents/201811/06ladder/ladder_katalk_thum.jpg";
//        var imgUrl = "http://qa.oliveyoung.co.kr/uploads/contents/201811/06ladder/ladder_katalk_thum.jpg";
        var title = "올리브영 온라인몰에서 친구와 함께 기프트카드 받자!";

        // 배너 이미지 체크
        var bnrImgUrlAddr = $("#bnrImgUrlAddr").val();
        if(bnrImgUrlAddr == undefined || bnrImgUrlAddr == null || bnrImgUrlAddr == ""){
            bnrImgUrlAddr = "";
        } else {
            bnrImgUrlAddr = _fileUploadUrl + bnrImgUrlAddr;
        }

        // 이미지가 없을 경우만 배너로 교체
        if(imgUrl == undefined || imgUrl == null || imgUrl == ""){
            imgUrl = bnrImgUrlAddr;
        }

        var snsShareUrl = _baseUrl + "KE.do?evtNo=" + evtNo + "&reCommend=" + reCommend;
        
        /* sns common init 시키기 위해서 한번만 실행 */
        if(monthEvent.detail.snsInitYn == "N"){
            common.sns.initKakaoEvt(imgUrl, title, snsShareUrl);
            monthEvent.detail.snsInitYn = "Y";
        }

        common.sns.doShareKakaoEvt("kakaotalk");
    },
    
    /* 카카오 친구 매칭여부 확인 */
    myMatchChkReCommendJson : function(){
        if(common.isLogin()){
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181111/myMatchChkJson.do"
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : "1"
                    }
                  , monthEvent.detail._callback_myMatchChkReCommendJson
            );
        }
    },
    _callback_myMatchChkReCommendJson : function(json){
        if(json.ret == "0"){
            if(json.matchYn == "Y"){        //이미 매칭된 친구가 존재하면
                alert("이미 등록된 친구가 있습니다. 한번 등록된 친구는 삭제/변경이 불가합니다.");
            }else{
                //reCommend(초대한 사람의 ID)가 다른 친구와 이미 매칭되었는지 확인
                monthEvent.detail.reCommendMatchChk();
            }
        }else{
            alert(json.message);
        }
    },
    
    /* 카카오 친구 매칭된 id */
    myMatchChkJson : function(){
        if(common.isLogin()){
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181111/myMatchChkJson.do"
                  , {
                          evtNo : $("input[id='evtNo']:hidden").val()
                        , fvrSeq : "1"
                    }
                  , monthEvent.detail._callback_myMatchChkJson
            );
        }
    },
    _callback_myMatchChkJson : function(json){
        if(json.ret == "0"){
            if(json.matchYn == "Y"){
                $("#mbrId").text(json.mbrId.replace(/.{2}$/, "**"));    //뒤 2글자 마스킹 처리
                $(".ka_fr_wrap").addClass("on");
                monthEvent.detail.matchYn = "Y";
                monthEvent.detail.matchMbrId = json.mbrId;     //매칭된 친구 ID
            }else{
                monthEvent.detail.matchYn = "N";
            }
        }else{
            alert(json.message);
        }
    },
    
    /* 누적 구매금액 확인 */
    ordAmtChk : function(){
        if(!mevent.detail.checkLogin()){
            return;
        }
        if(monthEvent.detail.matchYn == "N"){
            alert("친구 등록 후 확인해 주세요.");
            return;
        }else{
            monthEvent.detail.amtChkYn = "Y";
            
            var param = {
                  evtNo : $("input[id='evtNo']:hidden").val()
                  , matchMbrId : monthEvent.detail.matchMbrId
            };
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20181111/getOrdAmtChkJson.do"
                  , param
                  , this._callback_getOrdAmtChkJson
            );
        }
    },
    _callback_getOrdAmtChkJson : function(json){
        monthEvent.detail.totalPayAmt = json.totalPayAmt;        
        $(".money_text").html($.number(json.totalPayAmt)+"<span>원</span>");
    },
    
    /* 기프트카드 신청하기 */
    giftcardApply : function(){
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
            if(monthEvent.detail.amtChkYn == "N"){
                alert("나와 친구의 누적 구매금액을 확인 후 신청해 주세요.");
                return;
            }
            if(monthEvent.detail.totalPayAmt.numberFormat() < 110000){       //누적구매금액이 11만원보다 작으면
                alert("친구와 함께 11만원 이상 구매 시 신청 가능합니다.");
                return;
            }
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    , fvrSeq : "3"
            }
            
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20181111/getFirstChkJson.do"
                  , param
                  , this._callback_getGiftFirstChkJson
            );
            
        }
    },    
    _callback_getGiftFirstChkJson : function(json) {
        if(json.ret == "0"){
            monthEvent.detail.firstYn = "Y";        //최초 참여 여부 변수값
            mevent.detail.eventShowLayer('eventLayerPolice');  //최초 참여는 개인정보 위수탁 동의팝업 생성
        }else{
            monthEvent.detail.firstYn = "N";        //최초 참여 여부 변수값
            alert("이미 신청 하셨습니다.");
            return;
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
                monthEvent.detail.eventApply();        //기프트카드 신청
            }
        }
    },
    
    //기프트카드 신청
    eventApply : function(){
        if(!mevent.detail.checkRegAvailable()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , fvrSeq : "3"
        }
        
        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "event/20181111/eventApplyJson.do"
                , param
                , this._callback_eventApplyJson
         );
    },
    _callback_eventApplyJson : function(json) {
        if(json.ret == "0"){
            alert("신청 되었습니다. 친구도 직접 신청해야 기프트카드를 받을 수 있으니, 친구에게 꼭! 알려주세요!");
        }        
    },
    
    /**
     * 기능 : 11% 장바구니 쿠폰  제한
     */
    chkDownCoupon : function(){
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
            
            var cpnNo = "";
            if($("#profile").val() == "dev"){
                cpnNo = "g0CzCBI3VCbYQ7UKpgtWYw==";
            }else if($("#profile").val() == "qa"){
                cpnNo = "g0CzCBI3VCbCihaQfOxnYQ==";
            }else if($("#profile").val() == "prod"){
                cpnNo = "g0CzCBI3VCaF85SsSB454Q==";
            }
            
            // coupon download
            monthEvent.detail.downCouponJson(cpnNo);
        }
    },
    
    /* 
     * 기능 : 쿠폰  다운로드 
     * “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
     */
    downCouponJson : function(cpnNo) {
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
                        , this._callback_downOrdCouponJson
                 );
            }
        }
    },
    _callback_downOrdCouponJson : function(json) {
        if(json.ret == '0'){
            alert(json.message);
        }
    },
    
    //hjh 개발 start
    
    /**
     * APP PUSH AGREE CHKECK
     */
    appPushJson1 : function(){
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
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181111/getAppPushYnCntJson.do"
                  , param
                  , monthEvent.detail._callback_getAppPushYnCntJson1
            );
        }
    },
    _callback_getAppPushYnCntJson1 : function(json){
        if(json.appPushYnCnt == "0"){
            alert("APP PUSH 수신 동의 고객만 참여 가능합니다. 하단 <설정 바로가기> 버튼을 클릭해주세요.");
        }else{
            // 참여 여부 한번 더 확인 해야함.
            monthEvent.detail.getFirstChk();
        }
    },
    
    
    /**
     * 기능 : 참여여부 확인
     */
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
                var inFvrSeqArr = ["4","5","6","7","8","9"];
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                        ,  inFvrSeqArr : inFvrSeqArr.toString()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20181111/setConfirmJson.do"
                      , param
                      , monthEvent.detail._callback_getFirstChkJson
                );
            }
        }
    },
    _callback_getFirstChkJson : function(json){
        
        //variable 
        var result = json.ret; // 응답 성공유무
        var totalCount = json.myTotalCnt; // 위수탁 - 이벤트참여여부 확인 

        if(result == 0){
            if(totalCount > 0){
                //위수탁 동의했던 사람으로 체크
                $(':radio[name="argee3"]:input[value="Y"]').attr("checked", true);
                $(':radio[name="argee4"]:input[value="Y"]').attr("checked", true);
                
                //참여가능
                $('.game_start').hide();
                
            }else{
                //위수탁처리
                $("div#Confirmlayer1").attr("onClick", "javascript:monthEvent.detail.popLayerConfirm1()");
                mevent.detail.eventShowLayer('eventLayerPolice2'); //위수탁 팝업 호출
            }
            
        }else{
            alert(json.message);
        }
    },
    
    
    /* 위수탁 동의 팝업 */    
    popLayerConfirm1 : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if($(':radio[name="argee3"]:checked').val() == undefined &&  $(':radio[name="argee4"]:checked').val() == undefined ){
                alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                return;
            }
            if("N" == $(':radio[name="argee3"]:checked').val() && "N" == $(':radio[name="argee4"]:checked').val() ){
                alert("개인정보 위/수탁 동의 후 참여 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee3"]:checked').val()){
                alert("개인정보 수집 이용 동의 후 참여 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee4"]:checked').val()){
                alert("개인정보 처리 위탁 동의 후 참여 가능합니다.");
                return;
            }
            
            if("Y" == $(':radio[name="argee3"]:checked').val() && "Y" == $(':radio[name="argee4"]:checked').val()){
                monthEvent.detail.eventCloseLayer();
                $('.game_start').hide(); // START 버튼 숨기기!
            }
        }
    },
    
    
    /** 
     * obj 번호에 따라 사다리 이미지 로딩
     */
    
    ladder_play : function(obj){
        $('.ladder_ing').html('<img src="//qa.oliveyoung.co.kr/uploads/contents/201811/06ladder/ladder_game'+obj+'.gif" alt="'+obj+'">');
    },
    
    /** 응모 step2. 응모하기 */
    confirmJson : function(obj){
        //클릭한 캐릭터 번호 셋팅
        monthEvent.detail.selectNum = obj;
        
        var mbrInfoUseAgrYn =  $(':radio[name="argee3"]:checked').val();
        var mbrInfoThprSupAgrYn =  $(':radio[name="argee4"]:checked').val();
        
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
            
            /** 사다리타기 시작 */
            monthEvent.detail.ladder_play(monthEvent.detail.selectNum);
            
            var tempDate = $("input[id='imgUrlConnectDay']:hidden").val().substring(0,8);
            var inFvrSeqArr = ["4","5","6","7","8","9"];
            
            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , startDate : tempDate
                      , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                      , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                      ,  inFvrSeqArr : inFvrSeqArr.toString()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181111/setApplyJson.do"
                  , param
                  , monthEvent.detail._callback_setApplyJson
            );
        }
    },
    /** 응모 step3. 응모결과 보여주기 */
    _callback_setApplyJson : function(json){
        
        /**
         * 사다리 내려오는 시간과 서버 결과가 너무 빨리 나오거나 늦는 경우를 맞추기 위해 setTimeout 사용함
         * 15개 / 3 ~5초 걸리는 듯함.
         */
        setTimeout(function(){
            
            if(json.ret == "0"){
                if(json.winYn=="Y"){
                    $(".mem_id").text(json.tgtrSeq);
                    mevent.detail.eventShowLayer('evtGcG');
                    $('.result'+monthEvent.detail.selectNum).html('<img alt="당첨" src="//qa.oliveyoung.co.kr/uploads/contents/201811/06ladder/ladder_game_result1.png" />');
//                }
                }else{
                    mevent.detail.eventShowLayer('evtGcF');//아쉽지만 : 꽝
                    $('.result'+monthEvent.detail.selectNum).html('<img alt="꽝" src="//qa.oliveyoung.co.kr/uploads/contents/201811/06ladder/ladder_game_result2.png" />');
                }
            }else{
                if(json.ret == "013"){ // 이미응모한사람 
                    alert(json.message);
                }else{
                    alert(json.message);
                }
            }
        }, 2600);
    },
    
    
    /** 나의 당첨내역 */
    getMyWinList : function(){
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
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20181111/getMyWinListJson.do"
                  , param
                  , monthEvent.detail._callback_getMyWinListJson
            );
        }
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
    
    // hjh 개발 완료
    
    // #### common js start ####
    
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
    
    // 레이어 숨김
    eventCloseLayer3 : function(){ 
        location.reload();//새로고침
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
    
};