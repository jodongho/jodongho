/**
 * 배포일자 : 2020.01.30
 * 오픈일자 : 2020.02.01
 * 이벤트명 : 기빙스탬프
 * */
$.namespace("monthEvent.detail");
monthEvent.detail = {
    layerPolice : false,
    appPushIng : false,
    currentDay : null,
    initYn : true,
    init : function(){
        monthEvent.detail.currentDay = $("input[id='imgUrlConnectDay']:hidden").val();

        $('.cpnPop').click(function(){
            if(!$(this).hasClass("complete")){
                monthEvent.detail.getCouponUseYn();
            }
        });

        $('.btn_confirm').click(function(){
            if(!$(".cpnPop").hasClass("complete")){
                if(confirm("직원 확인 이후 쿠폰사용 처리되며, 재사용 불가합니다. 사용하시겠습니까?")){
                    monthEvent.detail.couponUseConfirm();
                }
            }
        });

        $('.popReward').click(function(){
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
                mevent.detail.eventShowLayer('popMyReward');
            }
        });

        $(function(){
            var eventSlide_set = {
                slidesPerView: 1,
                initialSlide : 0,
                autoplay: false,
                pagination: '.paging',
                nextButton: '.next',
                prevButton: '.prev',
                autoplayDisableOnInteraction: true,
                paginationClickable: true,
                freeMode: false,
                spaceBetween: 0,
                loop: true, //true
                //watchActiveIndex: true //인덱스
            }, visual_swiper = Swiper('.stampSlide', eventSlide_set);
        });

        //직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
            if(monthEvent.detail.layerPolice){
                alert('동의 후 참여 가능합니다.');

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();

                //초기화
                $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
            }
        });

        /* app push 수신동의 현황 조회 */
        common.app.getTmsPushConfig();
        // app push 체크
        $('.btnAppPush').on('click', function(){
            if(common.app.appInfo == undefined || !common.app.appInfo.isapp) {
                alert('모바일앱 설치 후 APP PUSH 수신동의 해주세요!');
            }else{
                if(!mevent.detail.checkLogin()){
                    return;
                }else if(monthEvent.detail.appPushVer()){
                    /*if('Y' == common.app.appMktFlag){
                        alert('이미 수신 동의하셨어요.');
                        return;
                    }*/
                    if(!monthEvent.detail.appPushIng){
                        monthEvent.detail.appPushIng = true;
                        common.app.setTmsPushConfig('Y');
                        var appCheckTimer = setInterval(function(){
                            if('N' == common.app.pushConfigResult){
                                //수신동의 처리 실패
                                clearInterval(appCheckTimer);
                                monthEvent.detail.appPushIng = false;
                            }else if(!common.isEmpty(common.app.pushConfigResult) || !monthEvent.detail.appPushIng){
                                //처리 성공
                                clearInterval(appCheckTimer);
                                monthEvent.detail.appPushIng = false;
                            }
                        }, 300);
                    }
                }else{
                    common.app.callSettings();
                }
            }
        });

        setTimeout(function(){
        	if(common.isLogin()){
                monthEvent.detail.getStamp();
            }

        	//인입시 기프트카드 지급방식 개선 레이어 팝업
            if($("input[id='popYn']:hidden").val() == "Y"){
            	if(monthEvent.detail.currentDay >= $("input[id='popStrtDtime']:hidden").val() && monthEvent.detail.currentDay <= $("input[id='popEndDtime']:hidden").val()){
            		mevent.detail.eventShowLayScroll('popNewGuide');
            	}
            }
		}, 300);
    },

    getStamp : function(){
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
            ,startDate : monthEvent.detail.currentDay
            ,strtDtime : $("input[id='strtDtime']:hidden").val()
            ,endDtime : $("input[id='endDtime']:hidden").val()
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200201_1/getStamp.do"
              , param
              , monthEvent.detail._callback_getStamp
        );
    },

    _callback_getStamp : function(json){
        if(json.ret == "0"){
            $(".totalSum > span").html(mevent.detail.toCurrency(json.nextAmt));
            $(".totalStamp > span").html(json.givingCnt);
            $(".totalReward > span").html(json.rewardCnt);
            $(".swiper-wrapper").find("li").each(function(index){
                $(this).addClass("li_"+$(this).find("span").text());
            });

            var myWinListHtml = "";
            var onNum = 0;
            var pageIdx = 0;
            $.each(json.stampList, function(index, element){
                $(".li_"+element.idx).removeClass("on s_reward complete s_lucky g_green g_black g_gold");
                $(".li_"+element.idx).removeAttr("onclick");
                $(".li_"+element.idx).html("<span>"+element.idx+"</span>");
                if(element.idx % 3 == 0){       //리워드
                    $(".li_"+element.idx).addClass("s_reward");
                    if(element.name == "cpnEnd"){   //매장쿠폰 응모완료
                        $(".li_"+element.idx).addClass("complete");
                        $(".li_"+element.idx).html("<span class='txt_info'>매장<br/> <em>2,000원</em><br/>할인쿠폰<br/><strong>click!</strong></span>");
                        $(".li_"+element.idx).attr("onclick","monthEvent.detail.getCouponUseYn()");

                        onNum++;
                    }else if(element.name == "rewardEnd"){  //리워드 응모완료
                        $(".li_"+element.idx).addClass("complete");
                        $(".li_"+element.idx).html("<span class='txt_info'>기프트카드<br/><em>"+mevent.detail.toCurrency(element.payCondCont)+"원</em></span>");
                        onNum++;
                    }else if(element.name == "on"){
                        $(".li_"+element.idx).addClass("on");
                        $(".li_"+element.idx).attr("onclick","monthEvent.detail.checkApply("+element.idx+")");
                        onNum++;
                    }
                }else if(element.idx == 20){    //그린
                    //$(".li_"+element.idx).removeClass("on");
                    $(".li_"+element.idx).addClass("s_lucky g_green");
                    if(element.name == "greenEnd"){
                        $(".li_"+element.idx).addClass("complete");
                        onNum++;
                    }else if(element.name == "on"){
                        $(".li_"+element.idx).addClass("on");
                        $(".li_"+element.idx).attr("onclick","monthEvent.detail.checkApply("+element.idx+")");
                        onNum++;
                    }
                }else if(element.idx == 35){    //블랙
                    $(".li_"+element.idx).addClass("s_lucky g_black");
                    if(element.name == "blackEnd"){
                        $(".li_"+element.idx).addClass("complete");
                        onNum++;
                    }else if(element.name == "on"){
                        $(".li_"+element.idx).addClass("on");
                        $(".li_"+element.idx).attr("onclick","monthEvent.detail.checkApply("+element.idx+")");
                        onNum++;
                    }
                }else if(element.idx == 50){    //골드
                    $(".li_"+element.idx).addClass("s_lucky g_gold");
                    if(element.name == "goldEnd"){
                        $(".li_"+element.idx).addClass("complete");
                        onNum++;
                    }else if(element.name == "on"){
                        $(".li_"+element.idx).addClass("on");
                        $(".li_"+element.idx).attr("onclick","monthEvent.detail.checkApply("+element.idx+")");
                        onNum++;
                    }
                }else{
                    if(element.name == "on"){
                        if(element.idx > 21 && element.idx < 35){
                            $(".li_"+element.idx).addClass("on g_green");
                        }else if(element.idx > 35 && element.idx < 50){
                            $(".li_"+element.idx).addClass("on g_black");
                        }else{
                            $(".li_"+element.idx).addClass("on");
                        }
                        onNum++;
                    }
                }
            });

            var sortingField = "sysRegDtime";
            json.rewardList.sort(function(a, b) { // 오름차순 정렬
                return a[sortingField] - b[sortingField];
            });

            $.each(json.rewardList, function(index, element){
                if(element.fvrSeq == "7"){
                    myWinListHtml += "<tr><td>" +element.sysRegDtime + "</td><td>" +element.evtGoodsNm + "</td><td onclick='javascript:monthEvent.detail.getCouponUseYn();'><span>click</span></td></tr>";
                }else{
                    myWinListHtml += "<tr><td>" +element.sysRegDtime + "</td><td>" +element.evtGoodsNm + "</td><td>" +  mevent.detail.toCurrency(element.payCondCont) + "원</td></tr>";
                }
            });

            if(myWinListHtml == ""){
                myWinListHtml = "<tr><td colspan='3' class='no'>응모 내역이<br/> 없습니다.</td></tr>";
            }
            $("tbody#myWinListHtml").html(myWinListHtml);

            if(monthEvent.detail.initYn){   //진입시에만 활성화된 마지막페이지로
                //슬라이드 인덱스 선택
                if(onNum < 10){
                    pageIdx = 0;
                }else if(onNum >= 10 && onNum < 19){
                    pageIdx = 1;
                }else if(onNum >= 19 && onNum < 28){
                    pageIdx = 2;
                }else if(onNum >= 28 && onNum < 37){
                    pageIdx = 3;
                }else if(onNum >= 37 && onNum < 46){
                    pageIdx = 4;
                }else if(onNum >= 46){
                    pageIdx = 5;
                }
                $('.swiper-pagination-bullet').eq(pageIdx).click();
                monthEvent.detail.initYn = false;
            }
        }/*else{
            alert(json.message);
        }*/
    },

    checkApply : function(noteCont){
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
                ,noteCont : noteCont
                ,strtDtime : $("input[id='strtDtime']:hidden").val()
                ,endDtime : $("input[id='endDtime']:hidden").val()
                ,startDate : monthEvent.detail.currentDay
            }

            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20200201_1/checkApply.do"
                  , param
                  , function(json){
                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                        if(json.ret == "0"){
                            if( json.myTotalCnt  == "0" ) {
                                $("div#Confirmlayer1").attr("onclick", "monthEvent.detail.apply(' " + noteCont + "' ,  ' " + json.myTotalCnt + "'  ); "  );
                                mevent.detail.eventShowLayer('eventLayerPolice');
                                monthEvent.detail.layerPolice = true;
                                $(".agreeCont")[0].scrollTop = 0;
                            }else {
                                monthEvent.detail.apply(noteCont, json.myTotalCnt);
                            }
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    },

    apply : function(noteCont,myTotalCnt){
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

            var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
            var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

            if(myTotalCnt == 0 ){
                if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
                    alert("2가지 모두 동의 후 참여 가능합니다.");
                    return;
                }

                if("Y" != mbrInfoUseAgrYn){
                    monthEvent.detail.layerPolice = false;
                    mevent.detail.eventCloseLayer();
                    return;
                }
                if("Y" != mbrInfoThprSupAgrYn){
                    monthEvent.detail.layerPolice = false;
                    mevent.detail.eventCloseLayer();
                    return;
                }

                monthEvent.detail.layerPolice = false;
                mevent.detail.eventCloseLayer();
            }else {
                mbrInfoUseAgrYn = "Y";
                mbrInfoThprSupAgrYn = "Y";
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , noteCont : noteCont
                  , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                  , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                  , strtDtime : $("input[id='strtDtime']:hidden").val()
                  , endDtime : $("input[id='endDtime']:hidden").val()
                  ,startDate : monthEvent.detail.currentDay
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200201_1/apply.do"
                  , param
                  , monthEvent.detail._callback_apply
            );
        }
    },

    _callback_apply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            if(json.fvrSeq == "7"){ //쿠폰팝업
                monthEvent.detail.getCouponUseYn();
            }else if(json.fvrSeq == "8" || json.fvrSeq == "9" || json.fvrSeq == "10"){   //그린
                mevent.detail.eventShowLayer('popLuckyGift');
            }else{
                $(".randomTxt > span").html(mevent.detail.toCurrency(json.payCondCont));
                mevent.detail.eventShowLayer('popStampReward');
            }
        }else{
            alert(json.message);
        }
        monthEvent.detail.getStamp();
    },

    getCouponUseYn : function(){
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
                  , fvrSeq : "11"
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200201_1/getCouponUseCnt.do"
                  , param
                  , monthEvent.detail._callback_getCouponUseCnt
            );
        }
    },

    _callback_getCouponUseCnt : function(json){
        if(json.ret == "0"){
            $(".win_number").html(json.tgtrSeq);
            if(json.useYn == "Y"){
                $(".cpnPop").addClass("complete");
            }
            mevent.detail.eventCloseLayer();
            mevent.detail.eventShowLayer("popStoreCoupon");
        }else{
            alert(json.message);
        }
    },

    couponUseConfirm : function(){
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
                  , fvrSeq : "11"
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200201_1/couponUseConfirm.do"
                  , param
                  , monthEvent.detail._callback_couponUseConfirm
            );
        }
    },

    _callback_couponUseConfirm : function(json){
        if(json.ret == "0"){
            $(".win_number").html(json.tgtrSeq);
            $(".cpnPop").addClass("complete");
            mevent.detail.eventShowLayer("popStoreCoupon");
        }else{
            alert(json.message);
        }
    },

    /* 앱 최신버전 체크 */
    appPushVer : function(){
        if(common.isLogin()){
            var tempCompareVersion = "";
            if (common.app.appInfo.ostype == "10") { // ios
                tempCompareVersion = '2.2.1';
            }else if(common.app.appInfo.ostype == "20"){ // android
                tempCompareVersion = '2.1.8';
            }
            if(common.app.appInfo.isapp && common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion) !=  "<"){
                return true;
            }
        }
        return false;
    }
}