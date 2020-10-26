$.namespace("mmain.main");
mmain.main = {
    mainTabIdx : 0,
    homeIdx : 0,
    windowWidth : 0,
    isInit : true,
    isiOSdevice : /(iPad|iPhone|iPod)/g.test( navigator.userAgent ),

    viewMode : "",
    viewStdDate : "",

    previewParam : "",    
    
    stonUseYn : 'Y', /* web cache(ston) 사용여부 */
    
    mainGnbSwiper : null,

    init : function(gnbIdx){
    	console.log("[mmain.main.init]");
    	
        if (gnbIdx != undefined && gnbIdx != "") {
            try {
                location.href = _baseUrl + "main/main.do#" + parseInt(gnbIdx);
                return;
            } catch(e) {
                console.log(e);
            }
        }

        mmain.main.viewMode = $("#mContainer").attr("data-ref-viewMode");
        mmain.main.viewStdDate = $("#mContainer").attr("data-ref-viewStdDate");

        if (mmain.main.viewMode.trim() != "" && mmain.main.viewStdDate.trim() != "") {
            mmain.main.previewParam = "viewMode=" + mmain.main.viewMode + "&viewStdDate=" + mmain.main.viewStdDate;
        }

        mmain.main.bindEvent();

        $('html, body').attr("style", "{'overflow': 'hidden', 'height': '100%'}");

        windowWidth = $(window).width();

        //10분 세션 저장 timeout 시작
        var connectedTime = "";
        try{
            connectedTime = sessionStorage.getItem("connectedTime");
        }catch(e){}

        if (!common.isEmpty(connectedTime)) {
            var currentTime = (new Date()).getTime();
            var connectMin = Math.floor((currentTime - connectedTime) / (60 * 1000));

            if (connectMin > 5) {
                try {
//                    sessionStorage.clear();
                    common.resetSessionStorage();
                }catch(e){}

                //시간 업뎃
                //사파리 private mode 예외처리용
                try {
                    sessionStorage.setItem("connectedTime", (new Date()).getTime());
                } catch (e) {}
                //5분 세션 저장 timeout 끝
            }
        } else {
            //시간 업뎃
            //사파리 private mode 예외처리용
            try {
                sessionStorage.setItem("connectedTime", (new Date()).getTime());
            } catch (e) {}
            //5분 세션 저장 timeout 끝
        }


        //메인 링크에 대한 스크립트 바인드
        $("#mGnb").find("li").each(function(idx) {
            $("#mGnb").find("li").eq(idx).find("a").bind("click", function() {
                common.app.callTrackEvent('gnb',{ 'af_content_nm' : $("#mGnb").find("li").eq(idx).find("a > span").html()});
                
                sessionStorage.setItem("entrMenu", $("#mGnb").find("li").eq(idx).find("a > span").html());
                
                setTimeout(function() {
                    if (!mmain.main.isInit) {
                        try {
                            sessionStorage.removeItem("scrollY");
                        } catch(e) {}
                    }

            // 2017-11-23 : 펫샵 추가로 인한 임시 링크 이동처리
                    if( ($("#mGnb").find("li").eq(idx).attr("data-ref-url").indexOf("planshop/getPlanShopDetail.do") >= 0)
                            || ($("#mGnb").find("li").eq(idx).attr("data-ref-url").indexOf("planshop/getSpcShopDetail.do") >= 0) ){
                        common.link.commonMoveUrl($("#mGnb").find("li").eq(idx).attr("data-ref-url"));
                    } else {
                    	mmain.main.setGnbSwipe(idx);
//                        mmain.menu.moveSubMenu(idx,  $("#mGnb").find("li").eq(idx).attr("data-ref-url"));
                    }
                }, 500);
            });
        });

        //셋팅된 메뉴로 해쉬값 초기화 처리
        mmain.menu.mainHashChangeListener(false);

        //화면 로테이션에 따른 이벤트 처리
        mmain.menu.refreshByRotateScreen();

        //선택한 tab의 history back 처리에 대해 hashchange 등록.
        $(window).bind("hashchange", function() {
            mmain.menu.mainHashChangeListener(true);
        });

        var hash = location.hash;

        if (hash.length < 1) {
            //팝업 오픈 처리
            if ($(".fulsizePop").length > 0 && mmain.main.isOpenCommNoticePop()) {
                //video play
                var videoPlayer = $("#player");
                if(videoPlayer.length > 0){
                    var optionPlayer = {
                            element: '#promotion-video-player',
                            provider: videoPlayer[0].dataset.plyrProvider,
                            embedId: videoPlayer[0].dataset.plyrEmbedId,
                        };
                    mmain.main.handleVideoPlayer(optionPlayer);
                }
                
                setTimeout(function() {
                    $("body").css("overflow", "hidden");
                }, 100);
                $(".fulsizePop").show();

                //웹접근성 tabindex 추가 ( 2017-05-11 )
                $(".fulsizePop").attr("tabindex","0");
                $(".fulsizePop").focus();
            }

            // smallPopup 오픈 처리
            var eventDimLayer = false;
            $(".mainSmallLayer").each(function(){
                var smallPopupId = $(this).attr("id");
                if($(".mainSmallLayer").length > 0 && mmain.main.isOpenSmallPop(smallPopupId)) {
                    eventDimLayer = true;

                    $("#"+smallPopupId).show();
                    $("#"+smallPopupId).attr("tabindex","0");
                    $("#"+smallPopupId).focus();
                }
            });

            if(eventDimLayer){
                // dim 처리
                setTimeout(function() {
                    $("body").css("overflow", "hidden");
                }, 100);
                $("#eventDimLayer").show();
            }

            setTimeout(function() {
                $('#visualTmplImg').hide();
            }, 1000);

            mmain.main.setGnbSwipe(0);
//            mmain.menu.moveSubMenu(0,  $("#mGnb").find("li").eq(0).attr("data-ref-url"), true);
//            $("#mGnb").find("li").eq(0).children("a").click();
        } else {

            var checkHashArr = hash.split("_");
            var gnbTabIdx = "0";

            hash = hash.substring(1);

            if (checkHashArr.length < 2) {
                gnbTabIdx = hash;
            } else {
                gnbTabIdx = checkHashArr[0];
                gnbSubCatNo = checkHashArr[1];
            }

            if (gnbTabIdx != "0") {
                $('#visualTmplImg').hide();
            } else {
                setTimeout(function() {
                    $('#visualTmplImg').hide();
                }, 1000);
            }

            try {
                sessionStorage.setItem("gnb_sub_cat_no", gnbSubCatNo);
            } catch (e) {}

            if (sessionStorage.getItem("gnb_tab_idx") != undefined && sessionStorage.getItem("gnb_tab_idx") != "") {
//                $("#mGnb").find("li").eq(sessionStorage.getItem("gnb_tab_idx")).children("a").click();
            	mmain.main.setGnbSwipe(sessionStorage.getItem("gnb_tab_idx"));
//                mmain.menu.moveSubMenu(sessionStorage.getItem("gnb_tab_idx"),  $("#mGnb").find("li").eq(sessionStorage.getItem("gnb_tab_idx")).attr("data-ref-url"), true);
            } else {
//                $("#mGnb").find("li").eq((gnbTabIdx)).children("a").click();
            	mmain.main.setGnbSwipe(gnbTabIdx);
//                mmain.menu.moveSubMenu(gnbTabIdx,  $("#mGnb").find("li").eq((gnbTabIdx)).attr("data-ref-url"));
            }

        }
        
        // 큐레이션 : 로그인 후 팝업 reload를 위해 스크립트 추가
        curation.reloadEvent();
        
        mmain.main.isInit = false;
    },
    
    //todo
    makeSwipeHtml : function(gnbTabIdx, swiper, isInit) {
        
        gnbTabIdx = Number(gnbTabIdx);
        
        var slideHtml = [];
        let pos = gnbTabIdx;
        
//        console.log("realIndex::" + swiper.realIndex + "gnbTabIdx::" + pos);
//        $("#mGnb").find("li").eq(prev).attr("data-ref-name")
        
        // 화면 기본 구성
        // 중앙화면
        var isMain = false;
        if(swiper.realIndex == 2 && swiper.slides[2] && !isInit){
            slideHtml[1] = swiper.slides[2];
        }else if(swiper.realIndex == 0 && swiper.slides[0] && !isInit){
            slideHtml[1] = swiper.slides[0];
        }else{
            isMain = true;
            slideHtml[1] = '<div class="mtab swiper-slide main-swiper-tab'+pos+'" data-menu-index='+pos+' id="main-swiper-tab'+pos+'">'+'</div>';
        }
        // 왼쪽화면
        var isPrev = false;
        let prev = gnbTabIdx <= 0 ? 5 : gnbTabIdx - 1;
        if(swiper.realIndex == 2 && swiper.slides[1] && !isInit){ //오른쪽으로 이동될때
            slideHtml[0] = swiper.slides[1];
        }else{
            slideHtml[0] = '<div class="mtab swiper-slide main-swiper-tab'+prev+'" data-menu-index='+prev+' id="main-swiper-tab'+prev+'">'+'</div>';
            isPrev = true;
        }
        // 오른쪽화면
        var isNext = false;
        let next = gnbTabIdx >= 5 ? 0 : gnbTabIdx + 1;
        if(swiper.realIndex == 0 && swiper.slides[1] && !isInit){ //왼쪽으로 이동될때
            slideHtml[2] = swiper.slides[1];
        }else{
            slideHtml[2] = '<div class="mtab swiper-slide main-swiper-tab'+next+'" data-menu-index='+next+' id="main-swiper-tab'+next+'">'+'</div>';
            isNext = true;
        }
        
        // 화면 초기화
        swiper.removeAllSlides();
        swiper.appendSlide(slideHtml);
        swiper.activeIndex = 1;
        
        if(isPrev){
            mmain.menu.previewSubMenu(prev,  $("#mGnb").find("li").eq(prev).attr("data-ref-url"));
        }
        if(isNext){
            mmain.menu.previewSubMenu(next,  $("#mGnb").find("li").eq(next).attr("data-ref-url"));
        }
        if(isMain){
            mmain.menu.moveSubMenu(pos,  $("#mGnb").find("li").eq(pos).attr("data-ref-url"));
        }else{
        	
        	mmain.menu.setGnbTabIdx(pos,  $("#mGnb").find("li").eq(pos).attr("data-ref-url"));
        	
            setTimeout(function() {
                try {
                    //eval(sessionStorage.getItem("slide_script_" + pos));
                    
                    /* 2020-07-23 [2-3] 오늘의 도움 리뷰 하단 오류 수정*/
                    // PagingCaller init 처리
                    let tabClass = "#main-swiper-tab" + pos + " ";
                    
                    //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                    var startIdx = 1;
                    if ($(tabClass+"#mContents").attr("data-ref-pageIdx") != undefined && $(tabClass+"#mContents").attr("data-ref-pageIdx") != "") {
                        startIdx = parseInt($(tabClass+"#mContents").attr("data-ref-pageIdx"));
                    }
                    switch (pos) {
                        case 0: //홈
                            break;
                        case 1: //오특
                            mmain.hotdeal.getHotdealPagingAjax(startIdx);
                            break;
                        case 2: //신상
                            mmain.news.getNewsPagingAjax(startIdx);
                            break;
                        case 3: // 베스트
                            mmain.best.getBestPagingAjax(startIdx);
                            break;
                        case 4: //기획전
                            mmain.planshop.getPlanShopPagingAjax(startIdx);
                            break;
                        case 5: //이벤트
                            break;
                        default:
                            break;
                    }
                    /* 여기까지 */
                    
                } catch (e) {
                    console.log("[error-01]", e);
                }
                try {
                    $("#mainSwiper")[0].swiper.update();
                } catch (e) {
                	console.log("[error-02]", e);
                }
             }, 100);
        }
    },
    
    setGnbSwipe : function(init_gnb_tab_idx) {
        
    	if(init_gnb_tab_idx != '0'){
    		mmain.main.closeMansPop('man_sticky');
    		mmain.main.closeAppPushPop('appPush_sticky');
    	}

        if (mmain.main.mainGnbSwiper != null) {
            mmain.main.mainGnbSwiper.destroy();
        }
        
        mmain.main.mainGnbSwiper = new Swiper('#mainSwiper', {
            initialSlide: 0,
            loop: false,
            autoHeight: true,
            observer: true,
            observerParents: true,
            touchAngle: 30,
            onInit : function(swiper){
                mmain.main.makeSwipeHtml(init_gnb_tab_idx, swiper, true);
            },
            onSlideChangeStart : function(swiper){
                $(document).scrollTop(0); // 2020-07-23 GNB Flick 최상단 포커싱 
            },
            onSlideChangeEnd : function(swiper){
            	
                var gnb_tab_idx =  $(".mtab").eq(1).attr('data-menu-index');
                var idx = swiper.activeIndex;
                var gnbTabIdx = Number(gnb_tab_idx);
                let pos = gnbTabIdx;
                if(idx == 0){
                    pos = gnbTabIdx <= 0 ? 5 : gnbTabIdx - 1;
                    mmain.main.makeSwipeHtml(pos,swiper);
                }else if(idx == 2){
                    pos = gnbTabIdx >= 5 ? 0 : gnbTabIdx + 1;
                    mmain.main.makeSwipeHtml(pos,swiper);
                }
            },
            onTransitionStart : function(swiper){
                swiper.detachEvents();
            },
            onTransitionEnd : function(swiper){
                swiper.attachEvents();
            }
        });
    },
   
    getCurrentSlideHtml : function() {
        var gnbTabIdx =  $(".mtab").eq(1).attr('data-menu-index');
        return $("#mContainer #main-swiper-tab"+gnbTabIdx).html();
    },

    bindEvent : function() {

        var mGnb_init_no = $('#mGnb').find('li.on').index();
        if(mGnb_init_no < 0) mGnb_init_no = 0;
        var closeOneWeek = false;
        var closeThreeDays = false;
        //슬라이더 GNB 설정
        /* BI Renewal. 20190918. nobbyjin.
        var mGnb_swiper = new Swiper('#mGnb', {
            initialSlide: mGnb_init_no,
            slidesPerView: 'auto',
            spaceBetween: 0,
            loop: false

        });*/

        $("#oneweek_close").click(function() {
        	closeOneWeek = $("input:checkbox[id='oneweek_close']").is(":checked");
        });
        
        $("#threedays_close").click(function() {
        	closeThreeDays = $("input:checkbox[id='threedays_close']").is(":checked");
        });
        
        //일주일간 보지않기 클릭
        $("#btnMansClose").click(function() {
        	common.wlog("mans_ban_close");
        	if(closeOneWeek){
        		mmain.main.closeWeekPop('man_sticky');
        	}else{
        		mmain.main.closeMansPop('man_sticky');
        	}
        });
        
        $("#btnAppPushClose").click(function() {
        	if(closeThreeDays){
        		mmain.main.closeThreeDaysPop('appPush_sticky');
        	}else{
        		mmain.main.closeAppPushPop('appPush_sticky');
        	}
        });
        
        //하루동안보지않기 클릭
        $(".common_pop_close_oneday").click(function() {
        	//공지사항 회원 정책 개편으로 한번만 보기 일시적으로 추가 됨 -by jp1020 | 2020-05-22 
        	if($(".fulsizePop").attr("data-ref-isPod") == "N" && $(".fulsizePop").attr("data-ref-compareKey") == "90000040003/42/7183621008017205265.png" ){
        		localStorage.setItem('showNoticeStatus', "Y");
        	}else if ($(".fulsizePop").attr("data-ref-isPod") == "Y" && $(".fulsizePop").attr("data-ref-compareKey") == "90000040003/42/3398685216440254984.png" ){
        		localStorage.setItem('showNoticeStatus', "Y");
        	}else{
        		common.bann.setPopInfo("commonMoNoticePop", $(".fulsizePop").attr("data-ref-compareKey"));
        	}
        	
            setTimeout(function() {
                $("body").css("overflow", "visible");
            }, 100);

            $(document).scrollTop(0);
            $(".fulsizePop").hide();
            
            //팝업 비디오 영역 Clear
            if ($(".fulsizePop").length > 0 && $("#promotion-video-player").length > 0) {
                $("#promotion-video-player").remove();
            }

            mmain.main.toggleDimLayer();
        });

        //닫기 클릭
        $(".common_pop_close").click(function() {

            setTimeout(function() {
                $("body").css("overflow", "visible");
            }, 100);

            $(document).scrollTop(0);
           $(".fulsizePop").hide();
           
           //팝업 비디오 영역 Clear
           if ($(".fulsizePop").length > 0 && $("#promotion-video-player").length > 0) {
               $("#promotion-video-player").remove();
           }

           mmain.main.toggleDimLayer();
        });

        mmain.main.bindWebLog();
        mmain.menu.bindWebLog();
    },

    isOpenCommNoticePop : function() {
        
    	//공지사항 회원 정책 개편으로 한번만 보기 일시적으로 추가 됨 -by jp1020 | 2020-05-22
    	if( localStorage.getItem("showNoticeStatus") != undefined && localStorage.getItem("showNoticeStatus") == "Y") {
    		return false;
    	}
    	
    	var bannInfo = common.bann.getPopInfo("commonMoNoticePop");
        if (bannInfo == null) {
            return true;
        }

        //이미지 정보가 다를 경우
        if (bannInfo.compareKey != $(".fulsizePop").attr("data-ref-compareKey")) {
            return true;
        }
        //1일 경과 후 - PC는 24시간인데 모바일은 24시 기준으로 리셋한다네;; 다시 바꿨다네~ 24시간기준으로..
//        if ((new Date() - new Date(bannInfo.regDtime)) >= (1000 * 30)) {
        if ((new Date() - new Date(bannInfo.regDtime)) >= (1000 * 60 * 60 * 24)) {
//        if ((new Date()).getDate() != (new Date(bannInfo.regDtime)).getDate() || (new Date() - bannInfo.regDtime >= (1000 * 60 * 60 * 24))) {
            return true;
        }

        return false;
    },

    //긴급공지
    openUrgentNoticePop : function(compareKey) {
        //긴급공지는 세션스토리지를 사용한다. 공통 배너 팝업 함수는 사용하지 않는다.
        //브라우저 세션당 한번씩만 띄우도록 하기 위함.
        var popInfo = sessionStorage.getItem("urgentNoticePop");

        //이미지 정보가 다를 경우
        if (popInfo != undefined && popInfo != "undefined" && popInfo == compareKey) {
            return ;
        }

        sessionStorage.setItem("urgentNoticePop", compareKey);

//        alert($(".urgentNtcPopInfo").text().trim());
    },

    // 긴급공지 갱신문제로 인한 신규
    newOpenUrgentNoticePop : function(compareKey, strtDtime, endDtime) {
        //긴급공지는 세션스토리지를 사용한다. 공통 배너 팝업 함수는 사용하지 않는다.
        //브라우저 세션당 한번씩만 띄우도록 하기 위함.
        var popInfo = sessionStorage.getItem("urgentNoticePop");

        //이미지 정보가 다를 경우
        if (popInfo != undefined && popInfo != "undefined" && popInfo == compareKey) {
            return ;
        }

        sessionStorage.setItem("urgentNoticePop", compareKey);

        if(strtDtime != undefined && strtDtime != null
            && endDtime != undefined && endDtime != null){

            var strtDate = (new Date(strtDtime)).getTime();
            var endDate = (new Date(endDtime)).getTime();
            var currentDate = (new Date()).getTime();

            if(currentDate >= strtDate && currentDate <= endDate){
                alert($(".urgentNtcPopInfo").text().trim());
            }
        }
    },

    setLazyLoad : function(type) {
        common.setLazyLoad(type);

        setTimeout(function() {
            $(document).resize();

            $('#mContainer').find("a").unbind("click", mmain.menu.setPagePos);
            $('#mContainer').find("a").bind("click", mmain.menu.setPagePos);
            $('#mContainer').find("button").unbind("click", mmain.menu.setPagePos);
            $('#mContainer').find("button").bind("click", mmain.menu.setPagePos);
            
            try{
                $("#mainSwiper")[0].swiper.update()
            }catch (e) {
                console.log("$mainSwiper update fail", e);
            }
            
        }, 200);
    },

    //웹로그 바인딩
    bindWebLog : function() {
        //홈 팝업배너
        $(".fulsizePop img").bind("click", function() {
            common.wlog("home_popup_1");
        });
    },

    // smallPopup 오픈 여부 체크
    isOpenSmallPop : function(popupId) {
        // 쿠키에서 팝업 조회
        var smallPopupInfo = common.bann.getPopInfo(popupId);
        if(smallPopupInfo == null) {
            // 팝업이 쿠키에 존재하지 않을 경우
            return true;
        }
        if(smallPopupInfo.compareKey != $("#"+popupId).attr("data-ref-compareKey")) {
            // 백그라운드 이미지가 변경될 경우
            return true;
        }

        // 00시에 재노출
        var currentDate = new Date();
        var popupDate = new Date(smallPopupInfo.regDtime);
        if((currentDate.getYear() != popupDate.getYear())
            || (currentDate.getMonth()+1 != popupDate.getMonth()+1)
            || (currentDate.getDate() != popupDate.getDate())){
            return true;
        }

//      if((new Date() - new Date(smallPopupInfo.regDtime)) >= (1000 * 60 * 60 * 24)) {
//      if((new Date() - new Date(smallPopupInfo.regDtime)) >= (1000 * 60)) {
            // 24시간이 지난 경우
//          return true;
//      }

        return false;
    },

    // 남성전문관 팝업 일주일안보기 (SR 3345802 남성전문관)
    closeWeekPop : function(popupId){
        // 쿠키에 팝업 저장 ID = mansWeekCookie에 대해 7일간 안보기
    	mmain.main.setCookieMobile( "mansWeekCookie", "done" , 7);
        $(document).scrollTop(0);
        var mManban = $('#man_sticky'),
    		mAppban = $('#appPush_sticky'),
    		mFooterTab = $('#footerTab'),
    		mBanHeight = mManban.height(),
    		mAppBanHeight = mAppban.height();
        
        $("#"+popupId).remove();

        if($("#footerTab #appPush_sticky").length < 1){
        	$("#footerTab").removeClass("btmBan");
        	$('#fixBtn').removeClass('manban');
        	$('#footerTab').removeAttr("style");
        	mFooterTab.css({
        		height:50,
        	});
        	mmain.main.toggleDimLayer();
        }else{
        	mFooterTab.css({
                height:mBanHeight+50,
            });
        }
    },
    
    closeThreeDaysPop : function(popupId){
    	mmain.main.setCookieMobile( "appPushCookie", "done" , 3);
        $(document).scrollTop(0);
        var mManban = $('#appPush_sticky'),
		mFooterTab = $('#footerTab'),
		mBanHeight = (mManban.height())+50;
        $("#"+popupId).remove();
        $("#footerTab").removeClass("btmBan");
        $('#fixBtn').removeClass('manban');
        $('#footerTab').removeAttr("style");
        mFooterTab.css({
        	height:50,
        });
        mmain.main.toggleDimLayer();
    },

    // 남성전문관 팝업 일반 닫기  (SR 3345802 남성전문관)
    closeMansPop : function(popupId){
        $(document).scrollTop(0);
        
        var mManban = $('#man_sticky'),
		mFooterTab = $('#footerTab'),
		mBanHeight = mManban.height();
        $("#"+popupId).remove();
        
        if($("#footerTab #appPush_sticky").length < 1){
        	$("#footerTab").removeClass("btmBan");
        	$('#fixBtn').removeClass('manban');
        	$('#footerTab').removeAttr("style");
        	mFooterTab.css({
        		height:50,
        	});
        	mmain.main.toggleDimLayer();
        }else{
        	mFooterTab.css({
                height:mBanHeight+50,
            });
        }
        
    },
    
    closeAppPushPop : function(popupId){
        $(document).scrollTop(0);
        
        var mAppban = $('#appPush_sticky'),
		mFooterTab = $('#footerTab'),
		mBanHeight = (mAppban.height())+50;
        $("#"+popupId).remove();
        $("#footerTab").removeClass("btmBan");
        $('#fixBtn').removeClass('manban');
        $('#footerTab').removeAttr("style");
        mFooterTab.css({
        	height:50,
        });
        
        mmain.main.toggleDimLayer();
    },

    // 남성전문관 팝업 DS
    setMansBanDs : function(){
    	common.wlog("mans_ban_img");
    },
    
    // small 팝업 오늘하루안보기
    closeSmallDayPop : function(popupId){
        // 쿠키에 팝업 저장
        common.bann.setPopInfo(popupId, $("#"+popupId).attr("data-ref-compareKey"));
        $(document).scrollTop(0);
        $("#"+popupId).hide();
        mmain.main.toggleDimLayer();
    },

    // small 팝업 닫기
    closeSmallPop : function(popupId){
        $(document).scrollTop(0);
        $("#"+popupId).hide();
        mmain.main.toggleDimLayer();
    },
    
    // 지정한 날 동안 해당 ID에 대한 팝업 안보기 SET
    setCookieMobile : function( name, value, expireDays ) {
        var today = new Date();
        var expire_date = new Date(today.getTime() + expireDays*60*60*24*1000);
        document.cookie = name + "=done; path=/; expires=" + expire_date.toGMTString() + "; sameSite=None; Secure";
        common.app.syncCookie();
    },
    
    // 지정한 날 동안 해당 ID에 대한 팝업 안보기 GET
    getCookieMobile : function(cookieId, popupId) {
        var manBanInfo = sessionStorage.getItem("manBanInfo");
        var appBanInfo = sessionStorage.getItem("appBanInfo");
        var cookiedata = document.cookie.match('(^|;) ?' + cookieId + '=([^;]*)(;|$)') == null ? "" : document.cookie.match('(^|;) ?' + cookieId + '=([^;]*)(;|$)')[2];
        var cookiedata2 = document.cookie.match('(^|;) ?' + "appPushCookie" + '=([^;]*)(;|$)') == null ? "" : document.cookie.match('(^|;) ?' + "appPushCookie" + '=([^;]*)(;|$)')[2];
        
        if ( "done" == cookiedata ){
        	manBanInfo = "done";
        }

        if ( "done" == cookiedata2 ){
        	appBanInfo = "done";
        }

        var mManban = $('#man_sticky'),
    		mAppban = $('#appPush_sticky'),
    		mFooterTab = $('#footerTab'),
    		mBanHeight = mManban.height(),
    		mAppBanHeight = mAppban.height();
        
        if (manBanInfo != undefined && manBanInfo != "undefined" && manBanInfo == "done" && appBanInfo == "done") {
        	$("#"+popupId).remove();
        	$("#appPush_sticky").remove();
            $("#footerTab").removeClass("btmBan");
            $('#footerTab').removeAttr("style");
            if($("#footerTab .btmBan_area").length < 1){
            	mFooterTab.css({
                    height:50,
                });
            }
            return ;
        }else if(manBanInfo == "done" && appBanInfo != "done") {
        	$("#man_sticky").remove();
        	mFooterTab.css({
                height:mAppBanHeight+50,
            });
        }else if(manBanInfo != "done" && appBanInfo == "done") {
        	$("#appPush_sticky").remove();
        	mFooterTab.css({
                height:mBanHeight+50,
            });
        }else{
        	var checkHeight = 0;
            if($('#footerTab .btmBan_area img').length > 0){
            	checkHeight = $('#footerTab .btmBan_area img')[0].naturalHeight;
            }
            if(($("#footerTab #man_sticky").length > 0 || $("#footerTab #appPush_sticky").length > 0) && checkHeight != 208){
            	console.log("[LOG] Banner Height : " + checkHeight);
            
        	    $("#"+popupId).remove();
        	    $("#appPush_sticky").remove();
                $("#footerTab").removeClass("btmBan");
                $('#footerTab').removeAttr("style");
                if($("#footerTab .btmBan_area").length < 1){
            	    mFooterTab.css({
                        height:50,
                    });
                }
            }
        	setTimeout(function() {
        		common.gnb.callFooterBann();
        	}, 600);
        }

        
        if(_isLogin){
        	sessionStorage.setItem("manBanInfo", "done");
            sessionStorage.setItem("appBanInfo", "done");
        }
		
    },

    // 팝업 갯수에 따라 dim 처리
    toggleDimLayer : function(){
        // 팝업이 존재할 경우만
        if($(".mainSmallLayer").length > 0){
            var visiblePopupCnt = 0;
            $(".mainSmallLayer").each(function(){
                if($(this).is(":visible") == true){
                    visiblePopupCnt++;
                }
            });

            if(visiblePopupCnt > 0){
                // 팝업이 하나라도 있으면, dim 처리
                setTimeout(function() {
                    $("body").css("overflow", "hidden");
                }, 100);
                $("#eventDimLayer").show();
            } else {
                // dim 처리 해제
                setTimeout(function() {
                    $("body").css("overflow", "visible");
                }, 100);
                $("#eventDimLayer").hide();
            }
        } else {
            // dim 처리 해제
            setTimeout(function() {
                $("body").css("overflow", "visible");
            }, 100);
            $("#eventDimLayer").hide();
        }
    },

    // video play
    handleVideoPlayer : function(option){
        var prefix = 'https://';
        var element = document.querySelector(option.element);

        if (!element || !option || $.isEmptyObject(option)) {
            return;
        }

        var embedId = option.embedId;
        var provider = option.provider;
        var url =
            provider === 'youtube'
                ? prefix + 'www.youtube.com/watch?v=' + embedId
                : prefix + 'vimeo.com/' + embedId;

        var videoObject = new VideoWorker(url, {
                                                    autoplay: true,
                                                    //loop: true,
                                                    showControls : true,
                                                    mute : true,
                                                    startTime: 0,
                                                });
        if (videoObject.isValid()) {
            // retrieve iframe/video dom element.
            videoObject.getVideo(function(video) {
                var $parent = video.parentNode;

                // insert video in the body.
                element.appendChild(video);

                // remove temporary parent video element (created by VideoWorker).
                $parent.parentNode.removeChild($parent);
            });
        }
    },
};

$.namespace("mmain.menu");
mmain.menu = {
    //메뉴 초기 로딩 후 콜백 함수 처리, #~~로 접근시에만 사용.
    callback : null,

    bindWebLog : function() {
        //gnb 메뉴
        $("#mGnb").find("li[data-ref-url='main/getHotdealAjax.do']").bind("click", function() {
            common.wlog("home_gnb_hotdeal");
        });
        $("#mGnb").find("li[data-ref-url='main/getThemeAjax.do']").bind("click", function() {
            common.wlog("home_gnb_theme");
        });
        $("#mGnb").find("li[data-ref-url='main/getCouponAjax.do']").bind("click", function() {
            common.wlog("home_gnb_coupon");
        });
        $("#mGnb").find("li[data-ref-url='main/getEventAjax.do']").bind("click", function() {
            common.wlog("home_gnb_event");
        });
        $("#mGnb").find("li[data-ref-url='main/getPlanShopAjax.do']").bind("click", function() {
            common.wlog("home_gnb_planshop");
        });
        $("#mGnb").find('span:contains("펫#")').bind("click", function() {
            common.wlog("home_gnb_petshop");
        });
        $("#mGnb").find("li[data-ref-url='main/getOnlyOneAjax.do']").bind("click", function() {
            common.wlog("home_gnb_onlyone");
        });
        $("#mGnb").find("li[data-ref-url='main/getNewAjax.do']").bind("click", function() {
            common.wlog("home_gnb_new");
        });
        $("#mGnb").find("li[data-ref-url='main/getSaleAjax.do']").bind("click", function() {
            common.wlog("home_gnb_sale");
        });
        $("#mGnb").find("li[data-ref-url='main/getQuickAjax.do']").bind("click", function() {
            common.wlog("home_gnb_quick");
        });
        $("#mGnb").find("li[data-ref-url='main/getQuickMainAjax.do']").bind("click", function() {
            common.wlog("home_gnb_quick");
        });
        $("#mGnb").find("li[data-ref-url='main/getBestAjax.do']").bind("click", function() {
            common.wlog("home_gnb_best");
        });
    },

    getPreviewParam : function(connStr) {
        if (mmain.main.previewParam.trim() != "") {
            return connStr + mmain.main.previewParam;
        }
        return "";
    },

    setPreviewParam : function(orgObj) {

        if (orgObj != undefined && orgObj != null) {
            if (mmain.main.previewParam.trim() != "") {
                var viewParam = {
                        viewMode : mmain.main.viewMode,
                        viewStdDate : mmain.main.viewStdDate
                };

                orgObj = $.extend(orgObj, viewParam);
            }
        }
    },
    /**
     * 메뉴 클릭에 대한 컨텐츠 조회
     *
     * @param gnbTabIdx
     * @param linkUrl
     */
    moveSubMenu : function(gnbTabIdx, linkUrl, isHistoryReplace) {
        
        //페이지 최초 로딩시에는 로딩바 처리안함.
        if (!mmain.main.isInit) {
            //loadingLayer
            common.showLoadingLayer(false);
            if (gnbTabIdx < 1) {
                $('#visualTmplImg').show();

                setTimeout(function() {
                    $('#visualTmplImg').hide();
                }, 1000);
            }
        }

        $(document).unbind("scroll touchmove");


//        var gnbTabIdx;
//        try{
//            gnbTabIdx = sessionStorage.getItem("gnb_tab_idx");
//        }catch(e){}

        var gnbSubCatNo = "";
        var psbGdasChkStatus = sessionStorage.getItem("psbGdasChkStatus");
        
        if(psbGdasChkStatus == null){
        	try {
        		sessionStorage.setItem("psbGdasChkStatus", true); //중복 호출을 제거하기 위해 추가 
        	} catch (e) {}
        }
        
        if (common.isEmpty(gnbTabIdx)) {
            var hash = location.hash;

            //hash가 들어올 경우
            if (hash.length > 0) {

                hash = hash.substring(1);

                var checkHashArr = hash.split("_");

                if (checkHashArr.length < 2) {
                    gnbTabIdx = hash;
                } else {
                    gnbTabIdx = checkHashArr[0];
                    gnbSubCatNo = checkHashArr[1];
                }

                try {
                    sessionStorage.setItem("gnb_tab_idx", gnbTabIdx);
                    sessionStorage.setItem("gnb_sub_cat_no", gnbSubCatNo);
                } catch (e) {}
            }

        } else {
            try {
                sessionStorage.setItem("gnb_tab_idx", gnbTabIdx);
            } catch (e) {}
        }

        $("#mGnb").find("li").removeClass("on");
        $("#mGnb").find("li").eq(gnbTabIdx).addClass("on");

        //TODO 메뉴 위치값 보정
//        setTimeout(function() {
            mmain.menu.scrollToMenu(gnbTabIdx);
//        }, 500);

        //history에 현재 상태 넣음...
        if (isHistoryReplace != undefined && isHistoryReplace != null && isHistoryReplace) {
            history.replaceState(null, null, '#' + gnbTabIdx);
        } else {
            history.pushState(null,null,'#' + gnbTabIdx);
        }

        if (gnbTabIdx == mmain.main.homeIdx) {
            $("#mHeader").addClass("mHome");
        } else {
            $("#mHeader").removeClass("mHome");
        }

        var loginCheck = $("#mGnb .swiper-slide").eq(gnbTabIdx).attr("data-ref-login");

        //슬라이드 html 조회
        var html;
        var script;
        try{
            //setPagePos로 저장된 html 정보가 있는지 확인한다.v
            var savedStatus = (sessionStorage.getItem("saved_status") == "true");
            var savedTabIdx = sessionStorage.getItem("saved_tab_idx");
            var savedSlideHtml = sessionStorage.getItem("saved_slide_html");

            //인덱스 번호가 같은 경우 history.back으로 간주하고 저장된html을 출력시킨다.
            if (gnbTabIdx == savedTabIdx) {
                html = savedSlideHtml;

                //로그인 체크가 필요한 탭에서 데이터 저장시점의 로그인 상태와 현재 상태가 다를 경우엔 해당 html을 제거함.
                //제거 후 재 조회 처리 ..
                if (loginCheck == "Y" && !savedStatus && _isLogin) {
                    html = "";
                }
            } else {
                if (loginCheck == "Y" && _isLogin) {
                    html = sessionStorage.getItem("slide_html_log_" + gnbTabIdx);
                } else {
                    html = sessionStorage.getItem("slide_html_" + gnbTabIdx);
                }
            }
            script = sessionStorage.getItem("slide_script_" + gnbTabIdx);

            //저장된 setPagePos 삭제
            sessionStorage.removeItem("saved_status");
            sessionStorage.removeItem("saved_tab_idx");
            sessionStorage.removeItem("saved_slide_html");
        }catch(e){
            console.log(e);
        }

        $(document).scrollTop(0);

        if (gnbTabIdx != 0) {
//            $("#mContainer").attr("class", "mMain");
            $("#mContainer").attr("style", "min-height:300px")
        } else {
            //BI Renewal. 20190918. nobbyjin. - 퍼블적용
            //$("#mContainer").removeAttr("class", "mMain");
            //$("#mContainer").attr("style", "min-height:700px")
//            $("#mContainer").attr("class", "mMain");
            $("#mContainer").attr("style", "min-height:520px");
        }


        //메뉴 선택시 저장된 html 이 있고, 매번 서버로부터 리로드하는것이 아니라면...session storage에 있는 정보로 쓴다.
        //UI 처리를 원활하게 하기 위해 화면 처리하는 부분을 비동기로 처리한다. 동기 처리 시 상단 메뉴 UI 처리가 원활하지 않을 수 있다.
        setTimeout(function() {

            //화면 HTML 조회 처리
            if (!common.isEmpty(html)) {

//                $("#mContainer").html(html);
                $("#mContainer #main-swiper-tab"+gnbTabIdx).html(html);
                
                //lazyload가 실행된 html이 저장될 경우 클래스명 복원시켜 다시 lazyload 처리되도록 함.
                $(".completed-seq-lazyload").each(function() {
                   if ($(this).attr("data-original") != $(this).attr("src")) {
                       $(this).addClass("seq-lazyload").removeClass("completed-seq-lazyload");
                   }
                });


                $(".completed-scroll-lazyload").each(function() {
                    $(this).css("opacity", "");

                    if ($(this).attr("data-original") != $(this).attr("src")) {
                        $(this).addClass("scroll-lazyload").removeClass("completed-scroll-lazyload");
                    }
                 });

                //저장된 화면이 있으면 초기화 스크립트 실행
                try {
                    eval(script);
                } catch (e) {
//                  alert(e);
                }

                // BI Renewal. 20190918. nobbyjin. - 유틸바 최근 본 상품
                common.recentGoods.getLast();

            } else {
                //저장된 화면이 없을 경우 html 조회
                var param = {};
                //미리보기 파라미터 추가
                mmain.menu.setPreviewParam(param);
                
                var isCache = false;
                var isSton = false;
                
                if(mmain.main.stonUseYn == 'Y' &&
                        (  
                              // linkUrl == 'main/getHomeAjax.do' // 홈
                              // linkUrl == 'main/getBestAjax.do' // 베스트
                              // linkUrl == 'main/getHotdealAjax.do' // 오특
                             linkUrl == 'main/getNewAjax.do' // 신상
                            || linkUrl == 'main/getPlanShopAjax.do' // 기획전
                            || linkUrl == 'main/getEventAjax.do' // 이벤트
                        )        
                     ){
                    isCache = true;
                    isSton = true;
                }
                
                $.ajax({
                    type: "GET",
                    url: _baseUrl + linkUrl,
                    data: param,
                    beforeSend : function(xhr){
                        if(isSton){
                             xhr.setRequestHeader("stonUseYn", mmain.main.stonUseYn);
                         }
                    },
                    dataType : 'text',
                    async: false,
                    cache: isCache,
                    success: function(data) {

//                        $("#mContainer").html(data);
                    	$("#mContainer #main-swiper-tab"+gnbTabIdx).html(data);

                        var tmpScript = "";
//                        var scriptObj = $("#mContainer").find("#initScript");
                        var scriptObj = $("#mContainer #main-swiper-tab"+gnbTabIdx).find("#initScript");

                        if (scriptObj != undefined && scriptObj != null) {
                            tmpScript = scriptObj.text();
                            scriptObj.remove();
                        }

                        //세션에 저장
                        //사파리 private mode 예외처리용
                        try {
                            //미리보기용인 경우 세션스토리지에 저장하지 않음.
                            if (mmain.main.previewParam.trim() == "") {
                                if (loginCheck == "Y" && _isLogin) {
//                                    sessionStorage.setItem("slide_html_log_" + gnbTabIdx, $("#mContainer").html());
                                	sessionStorage.setItem("slide_html_log_" + gnbTabIdx, $("#mContainer #main-swiper-tab"+gnbTabIdx).html());
                                } else {
//                                    sessionStorage.setItem("slide_html_" + gnbTabIdx, $("#mContainer").html());
                                	sessionStorage.setItem("slide_html_" + gnbTabIdx, $("#mContainer #main-swiper-tab"+gnbTabIdx).html());
                                }
                                sessionStorage.setItem("slide_script_" + gnbTabIdx, tmpScript);
                            }
                        } catch (e) {}

                        eval(tmpScript);
//                        $("#mContainer").append("<script>" + tmpScript + "</script>")

                    },
                    error: function() {

                    }
                });
            }

            sessionStorage.setItem("saved_status", _isLogin);
            sessionStorage.setItem("saved_tab_idx", gnbTabIdx);
            sessionStorage.setItem("saved_slide_html", $("#mContainer #main-swiper-tab"+gnbTabIdx).html());

            $("#initBgLayer").hide();

            mmain.menu.moveScrollY();
            
            try{
            	$("#mainSwiper")[0].swiper.update();
            }catch(e){
            	
            }
            
        }, 20);

        // link에 # > javascript:; 변경
        $("#mContainer").find("a[href='#']").attr("href", "javascript:;");

        //lazyload 추가
        setTimeout(function() {
            mmain.main.setLazyLoad();
        }, 100);

//        setTimeout(function() {
//            mmain.menu.moveScrollY();
            //최초 로딩이 아닐 경우, 페이지 내에서 ajax 호출 시에는 위치값
//            if (!mmain.main.isInit) {
//                try{
//                    //화면 높이 값
//                    sessionStorage.removeItem("scrollY");
//                }catch(e){}
//
//            }
//        }, 1000);


        //스크롤 방지 제거
        $('html, body').attr("style", "");

        //로딩바 숨김.
        setTimeout(function() {

            $(window).resize();
            mmain.main.isInit = false;

            if (mmain.menu.callback != null) {
                mmain.menu.callback();
                mmain.menu.callback = null;
            }

            //loadingLayer
            common.hideLoadingLayer();

        }, 500);

        if(gnbTabIdx < 1) {
            common.header.appDownBannerMainInit();
        }else {
            $('#webBanner_main').css('display','none');
            $('#webBanner_main').parent().css('height', '87px'); // header 개편 142 -> 94 -> 87
            //BI Renewal. 20190918. nobbyjin. - 퍼블적용
            //$('#mHome-visual').css({'padding-top':'0'});
            $('#mContents').css({'padding-top':'0'});
        }

    },
    
    setGnbTabIdx: function(gnbTabIdx, linkUrl ,isHistoryReplace) {
    	
    	sessionStorage.setItem("gnb_tab_idx", gnbTabIdx);
    	
    	$("#mGnb").find("li").removeClass("on");
        $("#mGnb").find("li").eq(gnbTabIdx).addClass("on");
        
        mmain.menu.scrollToMenu(gnbTabIdx);
        
        //history에 현재 상태 넣음...
        if (isHistoryReplace != undefined && isHistoryReplace != null && isHistoryReplace) {
            history.replaceState(null, null, '#' + gnbTabIdx);
        } else {
            history.pushState(null,null,'#' + gnbTabIdx);
        }
        
        // 2020-07-15 11:53 setPagePos에서 저장시키도록 세션값 삭제처리
        sessionStorage.removeItem("saved_status");
        sessionStorage.removeItem("saved_tab_idx");
        sessionStorage.removeItem("saved_slide_html");
    },
    // 양날개 로딩용 함수
    previewSubMenu : function(gnbTabIdx, linkUrl) {
        //슬라이드 html 조회
        var html;
        var script;
        
        try{
            var loginCheck = $("#mGnb .swiper-slide").eq(gnbTabIdx).attr("data-ref-login");
            
           	if (loginCheck == "Y" && _isLogin) {
                html = sessionStorage.getItem("slide_html_log_" + gnbTabIdx);
            } else {
                html = sessionStorage.getItem("slide_html_" + gnbTabIdx);
            }
            script = sessionStorage.getItem("slide_script_" + gnbTabIdx);
            
        }catch(e){
            console.log(e);
            html = "";
        }
        
        setTimeout(function() {
            //화면 HTML 조회 처리
            if (!common.isEmpty(html)) {
            
                $("#mContainer .main-swiper-tab"+gnbTabIdx).html(html);
                
                //lazyload가 실행된 html이 저장될 경우 클래스명 복원시켜 다시 lazyload 처리되도록 함.
                $(".completed-seq-lazyload").each(function() {
                    if ($(this).attr("data-original") != $(this).attr("src")) {
                        $(this).addClass("seq-lazyload").removeClass("completed-seq-lazyload");
                    }
                });
                
                $(".completed-scroll-lazyload").each(function() {
                    $(this).css("opacity", "");
                    
                    if ($(this).attr("data-original") != $(this).attr("src")) {
                        $(this).addClass("scroll-lazyload").removeClass("completed-scroll-lazyload");
                        
                        // 2020-07-15 11:53 갱신 시 에러 이미지 엑박으로 재바인딩해줌.
                        $(this).off('error').on('error', function() {
                            common.errorImg(this);
                        });
                        
                    }
                });
                
                //저장된 화면이 있으면 초기화 스크립트 실행
                try {
                    eval(script);
                } catch (e) {
//                  alert(e);
                }
            } else {
                //저장된 화면이 없을 경우 html 조회
                var param = {};
                //미리보기 파라미터 추가
                mmain.menu.setPreviewParam(param);
                
                var isCache = false;
                var isSton = false;
                
                if(mmain.main.stonUseYn == 'Y' &&
                       (  
                                linkUrl == 'main/getNewAjax.do' // 신상
                               || linkUrl == 'main/getPlanShopAjax.do' // 기획전
                               || linkUrl == 'main/getEventAjax.do' // 이벤트
                           )        
                        ){
                       isCache = true;
                       isSton = true;
                }
                   
                   $.ajax({
                       type: "GET",
                       url: _baseUrl + linkUrl,
                       data: param,
                       beforeSend : function(xhr){
                           if(isSton){
                                xhr.setRequestHeader("stonUseYn", mmain.main.stonUseYn);
                            }
                       },
                       dataType : 'text',
                       async: false,
                       cache: isCache,
                       success: function(data) {
                           $("#mContainer .main-swiper-tab"+gnbTabIdx).html(data);

                           var tmpScript = "";
                           var scriptObj = $("#mContainer .main-swiper-tab"+gnbTabIdx).find("#initScript");

                           if (scriptObj != undefined && scriptObj != null) {
                               tmpScript = scriptObj.text();
                               scriptObj.remove();
                           }

                           //세션에 저장
                           //사파리 private mode 예외처리용
                           try {
                               //미리보기용인 경우 세션스토리지에 저장하지 않음.
                               if (mmain.main.previewParam.trim() == "") {
                                   if (loginCheck == "Y" && _isLogin) {
                                       sessionStorage.setItem("slide_html_log_" + gnbTabIdx, $("#mContainer .main-swiper-tab"+gnbTabIdx).html());
                                   } else {
                                       sessionStorage.setItem("slide_html_" + gnbTabIdx, $("#mContainer .main-swiper-tab"+gnbTabIdx).html());
                                   }
                                   sessionStorage.setItem("slide_script_" + gnbTabIdx, tmpScript);
                               }
                           } catch (e) {}

                           eval(tmpScript);

                       },
                       error: function() {

                       }
                   });
               }

             
           }, 20);
        
       // link에 # > javascript:; 변경
       $("#mContainer").find("a[href='#']").attr("href", "javascript:;");
       
       //lazyload 추가
       setTimeout(function() {
           mmain.main.setLazyLoad();
       }, 100);
    },

    /**
     * history back 시 hash로 이전 탭 경로 조회
     */
    mainHashChangeListener : function(isListener) {

        //초기 init 시를 제외하고 링크에 #있을 경우 무시
//        if (isListener && window.location.hash == "") {
//            return ;
//        }

        $(".allmenuClose").click();

        var hash = window.location.hash;

        if (!mmain.main.isInit) {
            sessionStorage.removeItem("scrollY");
        }

        common.popFullClose();
        common.popLayerClose();

        if (common.isEmpty(hash)) {

            var gnbTabIdx = 0;

            //초기 로딩시 메인으로 로딩될 경우에만 세션스토리지 리셋하도록함.
            //메인이 아닌 다른 탭으로 로딩될 경우 유지함.
            try{
//                sessionStorage.clear();
                common.resetSessionStorage();
            }catch(e){}

            //사파리 private mode 예외처리용
            try {
                sessionStorage.setItem("gnb_tab_idx", gnbTabIdx);
            } catch (e) {}

        } else {

            hash = hash.substring(1);

            var checkHashArr = hash.split("_");
            var gnbTabIdx = "0";

            if (checkHashArr.length < 2) {
                gnbTabIdx = hash;
            } else {
                gnbTabIdx = checkHashArr[0];
                gnbSubCatNo = checkHashArr[1];
            }

            try {
                sessionStorage.setItem("gnb_sub_cat_no", gnbSubCatNo);
            } catch (e) {}

            //기존 단축번호로 hash가 들어올 경우
            mmain.menu.goToDirectNum(gnbTabIdx);
        }

        if (isListener) {
            $(document).scrollTop(0);

            //스크롤이 상단으로 이동한 후 바로 클릭 처리
            setTimeout(function() {
                mmain.main.isInit = true;
                var data;
                try{
                    data = sessionStorage.getItem("gnb_tab_idx");
                }catch(e){}

                mmain.main.setGnbSwipe(data);
//                mmain.menu.moveSubMenu(data,  $("#mGnb").find("li").eq(data).attr("data-ref-url"), true);

//                $("#mGnb").find("li").eq(data).children("a").click();
                mmain.main.isInit = false;
            }, 100);
//        } else {
//            //스크롤이 상단으로 이동한 후 바로 클릭 처리
//            setTimeout(function() {
//                var data;
//                try{
//                    data = sessionStorage.getItem("gnb_tab_idx");
//                }catch(e){}
//
//                $("#mGnb").find("li").eq(data).children("a").click();
//            }, 100);
        }

    },

    /**
     * 기존 direct 처리
     * @param hash
     */
    goToDirectNum : function(hash) {

        var varGnbTabIdx;
        try{
            varGnbTabIdx = sessionStorage.getItem("gnb_tab_idx");
        }catch(e){}

        switch(hash - 0){
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
            //초기로딩시
            sessionStorage.setItem("gnb_tab_idx", hash);
            break;
        case 41:
            //핫딜
            mmain.menu.setDirectGnbTabIdx("getHotdealAjax");
            break;
        case 42:
            //테마샵
            mmain.menu.setDirectGnbTabIdx("getThemeAjax");
            break;
        case 43:
            //쿠폰혜택
            mmain.menu.setDirectGnbTabIdx("getCouponAjax");
            break;
        case 44:
            //이벤트
            mmain.menu.setDirectGnbTabIdx("getEventAjax");
            break;
        case 45:
            //기획전
            mmain.menu.setDirectGnbTabIdx("getPlanShopAjax");
            break;
        case 46:
            //온리원
            mmain.menu.setDirectGnbTabIdx("getOnlyOneAjax");
            break;
        case 47:
            //신상
            mmain.menu.setDirectGnbTabIdx("getNewAjax");
            break;
        case 48:
            //세일
            mmain.menu.setDirectGnbTabIdx("getSaleAjax");
            break;
        case 49:
            //베스트
            mmain.menu.setDirectGnbTabIdx("getBestAjax");
            break;
        case 51:
            //당일
            mmain.menu.setDirectGnbTabIdx("getQuickAjax");
            break;
        case 52:
            //오늘드림 전문관
            mmain.menu.setDirectGnbTabIdx("main/getQuickMainAjax");
            break;
        default :
            //사파리 private mode 예외처리용
            try {
                sessionStorage.setItem("gnb_tab_idx", 0);
            } catch (e) {}

            break;
        }

//        history.pushState(null,null,'#' + varGnbTabIdx);
    },

    setDirectGnbTabIdx : function(pathName) {
        var idx = 0;

        var list = $("#mGnb .swiper-slide");
        for (var i = 0; i < list.length; i++) {
            if ($("#mGnb .swiper-slide").eq(i).attr("data-ref-url").indexOf(pathName) >= 0) {
                idx = i;
                break;
            }
        }

        sessionStorage.removeItem("scrollY");
        sessionStorage.removeItem("slide_html_log_" + idx);
        sessionStorage.removeItem("slide_html_" + idx);
        sessionStorage.removeItem("slide_script_" + idx);
        sessionStorage.removeItem("saved_slide_html");
        sessionStorage.removeItem("saved_status");
        sessionStorage.removeItem("saved_tab_idx");

        sessionStorage.setItem("gnb_tab_idx", idx);
    },

    /**
     * 페이지 링크 시 현재 페이지 정보 저장 (history back 관련)
     * 모든 메인페이지 내의 링크에 대해 onclick event 를 bind함.
     */
    setPagePos : function () {
        var gnbTagIdx;

        try{
            gnbTagIdx = sessionStorage.getItem("gnb_tab_idx");
        }catch(e){}

        //사파리 private mode 예외처리용
        try {
            sessionStorage.setItem("saved_status", _isLogin);
            sessionStorage.setItem("saved_tab_idx", gnbTagIdx);
//            sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
            sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());
        } catch (e) {}

        //사파리 private mode 예외처리용
        try {
            //현재 페이지의 scroll 처리를 위한 높이 정보 저장
            sessionStorage.setItem("scrollY", common.getNowScroll().Y);
            //화면 rotate 를 판단하기 위해 클릭 시점의 width를 저장함.
            sessionStorage.setItem("pageWidth", $(window).width());
        } catch (e) {
            console.log("fail saved info");
        }
    },

    /**
     * 위치 보정
     */
    moveScrollY : function() {
        setTimeout(function() {
            try{
                var varNowScrollY = parseInt(sessionStorage.getItem("scrollY"));

                if((varNowScrollY > 0)){
                    $(window).scrollTop(varNowScrollY);
                    sessionStorage.removeItem("scrollY");
                }
            }catch(e){}
        }, 50);
    },

    refreshByRotateScreen : function() {
        //화면 회전에 대한 처리
        $(window).resize(function(){
            if (windowWidth != $(window).width()) {
                var gnbTabIdx;

                try{
                    gnbTabIdx = sessionStorage.getItem("gnb_tab_idx");
                }catch(e){}

                if (common.isEmpty(gnbTabIdx)) {
                    var hash = location.hash;

                    if (hash.length > 0) {

                        hash = hash.substring(1);

                        var checkHashArr = hash.split("_");
                        gnbTabIdx = "0";

                        if (checkHashArr.length < 2) {
                            gnbTabIdx = hash;
                        } else {
                            gnbTabIdx = checkHashArr[0];
                            gnbSubCatNo = checkHashArr[1];
                        }

                        try {
                            sessionStorage.setItem("gnb_sub_cat_no", gnbSubCatNo);
                        } catch (e) {}
                    }

                    //사파리 private mode 예외처리용
                    try {
                        sessionStorage.setItem("gnb_tab_idx", gnbTabIdx);
                    } catch (e) {}
                }

                setTimeout(function() {
                    //메뉴가 있을 경우 리프레쉬
                    mmain.menu.scrollToMenu(gnbTabIdx);

                    $(document).resize();
                    $(document).trigger("scroll");
                    
                    try {
                        $("#mainSwiper")[0].swiper.update();
                    } catch (e) {
                    	console.log("[error-02]", e);
                    }
                }, 500);
                windowWidth = $(window).width();
            }

        });
    },

    /**
     * 메뉴 idx에 따른 위치값 보정
     * @param gnbTabIdx
     */
    scrollToMenu : function(gnbTabIdx) {
        var width = $(document).width();
        var menuBarWidth = 0;

        var gnbMenuTag = $('#mGnb').find('ul');
        var gnbMenu = $(".gnb_cate.swiper-wrapper");
        //cell width
        var gnbCellWidth = gnbMenuTag.find("li").eq(gnbTabIdx).outerWidth();
        var gnbCellCnt = gnbMenuTag.find("li").length;

        //화면 - 가운데 offset left 조회
        var documentOffsetLeft = Math.round(width / 2) - Math.round(gnbCellWidth / 2);
        var documentOffsetRight = Math.round(width / 2) + Math.round(gnbCellWidth / 2);

        var documentHalfWidth = Math.round(width / 2);

        var fixedLeftPositionIdx = 0;
        var fixedRightPositionIdx = 0;

        gnbMenuTag.find("li").each(function() {
           menuBarWidth += $(this).outerWidth();
        });

        var checkSum = 0;

        //위치 fix가 필요없는 index 조회(양쪽 끝에 위치하는 cell 중 몇개까지 양끝으로 무조건 이동시키면 되는지..)
        for (var i = 0; i < gnbCellCnt; i++) {
            checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;

            if (checkSum > documentHalfWidth) {
                fixedLeftPositionIdx = i - 1;
                break;
            } else {
                checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
            }
        }

        checkSum = 0;
        for (var i = gnbCellCnt - 1; i >= 0; i--) {
            checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
            if (checkSum > documentHalfWidth) {
                fixedRightPositionIdx = i + 1;
                break;
            } else {
                checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
            }
        }

//      console.log(fixedLefCtPositionIdx + " : " + fixedRightPositionIdx + " : " + menuBarWidth + " : " + width);

//      var fixedPositionIdx = Math.ceil(documentOffsetLeft / gnbCellWidth) - 1;

//        .css('transition-duration','500ms');

        //왼쪽끝에 위치시킬 메뉴 idx일 경우
        if (gnbTabIdx <= fixedLeftPositionIdx) {
            setTimeout(function(){gnbMenu.css({
                "transform": "translate3d(0px, 0, 0)",
                "transition-duration": "500ms"
            })}, 200);

        //오른쪽 끝에 위치시킬 메뉴 idx일 경우
        } else if (gnbTabIdx >= fixedRightPositionIdx) {
            setTimeout(function(){gnbMenu.css({
                "transform": "translate3d(" + (-1 * (parseInt(menuBarWidth) - width)) + "px, 0, 0)",
                "transition-duration": "500ms"
            })}, 200);

        //그 외 가운데 위치시킬 메뉴일 경우
        } else {
            checkSum = 0;
            for (var i = 0; i < gnbTabIdx; i++) {
                checkSum += gnbMenuTag.find("li").eq(i).outerWidth();
            }
            setTimeout(function(){gnbMenu.css({
                "transform": "translate3d(" + (-1 * (checkSum - documentOffsetLeft)) + "px, 0, 0)",
                "transition-duration": "500ms"
            })}, 200);
        }

    },
};

var checkVal = 0;
$.namespace("mmain.subGnb");
mmain.subGnb = {
    mSubGnb_swiper : null,

    init : function(gnbTabIdx) {
    	
    	console.log("[mmain.subGnb.init]");
    	
    	var tabClass = "";
    	
    	if(gnbTabIdx){
    		tabClass = "#main-swiper-tab" + gnbTabIdx + " ";
    	}

    	sessionStorage.setItem("viewCatNo", "");
        $(tabClass + "#bestCate > li").click(function() {
            if(checkVal == 0) {
                var count =  $( "#bestCate > li" ).index(this) + 1;
                common.wlog("best_category_tab_p" + count);
                checkVal ++;
            }
            
            sessionStorage.setItem("viewCatNo", $(this).find("a").attr("data-ref-dispcatno"));
        });
        checkVal = 0;
        
        var viewCatNo = $(tabClass + "#bestCate > li.on").find("a").attr("data-ref-dispcatno");

        $(tabClass + "#mSubGnb ul li:last-child").css("padding-right", "5px");
        var initSlide = 0;

        if ($(tabClass + "#mSubGnb ul li.on").length > 0 ) {
            initSlide = $(tabClass + "#mSubGnb ul li.on").index();
            sessionStorage.setItem("viewCatNo", viewCatNo);
        }

        try{
            let tabSwiper = $(tabClass + '#mSubGnb')[0];
            if(tabSwiper != undefined || tabSwiper != null) {
                if (tabSwiper.swiper != null) {
                    tabSwiper.swiper.destroy();
                }
            }
            tabSwiper = new Swiper(tabClass + '#mSubGnb', {
                initialSlide: initSlide,
                slidesPerView: 'auto',
                paginationClickable: true,
                spaceBetween: 0,
                loop: false
            });
        }catch(e){
            console.log("[error-03]",e);
        
//        if (mmain.subGnb.mSubGnb_swiper != null) {
//            mmain.subGnb.mSubGnb_swiper.destroy();
//        }

//        mmain.subGnb.mSubGnb_swiper =
            new Swiper(tabClass + '#mSubGnb', {
                initialSlide: initSlide,
                slidesPerView: 'auto',
                paginationClickable: true,
                spaceBetween: 0,
                loop: false
            });
        }

        mmain.subGnb.scrollToMenu(initSlide, gnbTabIdx);

        $(tabClass + "#mSubGnb").find("li").each(function(idx) {
            $(this).find("a").click(function() {
                $(document).scrollTop(0);
                $(tabClass + "#mSubGnb").find("li").removeClass("on");
                $(this).parent().addClass("on");

                mmain.subGnb.scrollToMenu(idx, gnbTabIdx);
            });
        });

    },

    /**
     * 메뉴 idx에 따른 위치값 보정
     * @param gnbTabIdx
     */
    scrollToMenu : function(gnbTabIdx, parentGnbTabIdx) {
        
    	
        var tabClass = "";
        if(parentGnbTabIdx){
        	tabClass = "#main-swiper-tab" + parentGnbTabIdx + " ";
        }
        
        var width = $(document).width();
        var menuBarWidth = 0;

        var gnbMenuTag = $(tabClass+'#mSubGnb').find('ul');
        var gnbMenu = $(tabClass+".sub_gnb_cate.swiper-wrapper");
        //cell width
        var gnbCellWidth = gnbMenuTag.find("li").eq(gnbTabIdx).outerWidth();
        var gnbCellCnt = gnbMenuTag.find("li").length;

        //화면 - 가운데 offset left 조회
        var documentOffsetLeft = Math.round(width / 2) - Math.round(gnbCellWidth / 2);
        var documentOffsetRight = Math.round(width / 2) + Math.round(gnbCellWidth / 2);

        var documentHalfWidth = Math.round(width / 2);

        var fixedLeftPositionIdx = 0;
        var fixedRightPositionIdx = 0;

        gnbMenuTag.find("li").each(function() {
           menuBarWidth += $(this).outerWidth();
        });

        if (menuBarWidth <= width) {
            return;
        }

        var checkSum = 0;

        //위치 fix가 필요없는 index 조회(양쪽 끝에 위치하는 cell 중 몇개까지 양끝으로 무조건 이동시키면 되는지..)
        for (var i = 0; i < gnbCellCnt; i++) {
            checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
//            console.log(gnbMenuTag.find("li").eq(i).outerWidth() + " : " + checkSum + " : " + documentHalfWidth);
            if (checkSum > documentHalfWidth) {
                fixedLeftPositionIdx = i - 1;
                break;
            } else {
                checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
            }
//            console.log("f : " + checkSum);
        }

        checkSum = 0;
        for (var i = gnbCellCnt - 1; i >= 0; i--) {
            checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
            if (checkSum > documentHalfWidth) {
                fixedRightPositionIdx = i + 1;
                break;
            } else {
                checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
            }
        }

//          console.log(fixedLeftPositionIdx + " : " + fixedRightPositionIdx + " : " + menuBarWidth + " : " + width + " : " + gnbTabIdx + " :" + checkSum + " : " + documentOffsetLeft + " : " + (checkSum - documentOffsetLeft));
//
//          var fixedPositionIdx = Math.ceil(documentOffsetLeft / gnbCellWidth) - 1;

//            .css('transition-duration','500ms');

        //왼쪽끝에 위치시킬 메뉴 idx일 경우
        if (gnbTabIdx <= fixedLeftPositionIdx) {
            setTimeout(function(){gnbMenu.css({
                "transform": "translate3d(0px, 0, 0)",
                "transition-duration": "500ms"
            })}, 200);

        //오른쪽 끝에 위치시킬 메뉴 idx일 경우
        } else if (gnbTabIdx >= fixedRightPositionIdx) {
            setTimeout(function(){gnbMenu.css({
                "transform": "translate3d(" + (-1 * (parseInt(menuBarWidth) - width)) + "px, 0, 0)",
                "transition-duration": "500ms"
            })}, 200);

        //그 외 가운데 위치시킬 메뉴일 경우
        } else {
            checkSum = 0;
            for (var i = 0; i < gnbTabIdx; i++) {
                checkSum += gnbMenuTag.find("li").eq(i).outerWidth();
            }
            setTimeout(function(){gnbMenu.css({
                "transform": "translate3d(" + (-1 * (checkSum - documentOffsetLeft)) + "px, 0, 0)",
                "transition-duration": "500ms"
            })}, 200);
        }

    },
};

$.namespace("mmain.home");
mmain.home = {
    recoBellUseYn : 'N', /* 레코벨 사용 여부 */
    recoBellViewYn : 'N', /* 레코벨 show 여부 */
    recoCallYn : "N",
    AB_RB_PCID : "1", // [3407293] A/B RB_PCID 변수 전역 지정
    
    init : function() {
    	
    	let tabClass = "#main-swiper-tab0" + " ";
    	
    	console.log("[mmain.home.init]");
    	
        mmain.home.setSwipe();
        mmain.home.bindEvent();

        $(tabClass+"#swiper-autoplay").addClass("pause");

        setTimeout(function() {
            $(tabClass+".brnd-slide").eq(Date.now() % $(tabClass+".brnd-slide").length).click();
        }, 400);

        var goodsList = common.recentGoods.getGoodsList();

        //2020.08.19 레코벨 중복호출 제거용 변수
        var rbCallYn = sessionStorage.getItem("saved_slide_html"); //SessionStorage에 있을 경우 pass
        var gnb_tab_idx = sessionStorage.getItem("gnb_tab_idx"); //홈일 경우에만 레코벨 호출 (오특/이벤트 제외)

        // 레코벨 사용 여부에 따라 레코벨 관련 스크립트 활성화
        //if(mmain.home.recoBellUseYn == 'Y' && mmain.home.recoBellViewYn == 'Y' && gnb_tab_idx == "0"){
        if(mmain.home.recoBellUseYn == 'Y' && mmain.home.recoBellViewYn == 'Y'){
        	
        	mmain.home.recoCallYn = "N"; // 2020-07-15 11:53 N이어야 스와이프 시 재호출됨
        	
            if(rbCallYn == null) {
                mmain.home.getRecoBellContsInfoAjax();
            }
            
            if(goodsList == null || goodsList == "") {
                mmain.home.getRecoBellClickBestInfoAjax();
            } else {
                mmain.home.getRecoBellRecentInfoAjax();
            }
            //mmain.home.getRecoBellMktAgrYnInfoAjax();
        }
        
        setTimeout(function() {
            var randomIdx = Date.now() % $(tabClass+".best-slide").length;

            //$(".best-slide").eq(Date.now() % $(".best-slide").length).click();
            $(tabClass+".best-slide").removeClass(mmain.home.getMSub1sMenuActiveClass());
            $(tabClass+".best-slide").eq(randomIdx).addClass(mmain.home.getMSub1sMenuActiveClass());
            $(tabClass+mmain.home.getMSub1sListClass()).empty();
             

            mmain.home.getBestTop3List($(tabClass+".best-slide").eq(randomIdx).attr("data-ref-dispCatNo"));

            mmain.home.scrollToTabMenu($(tabClass+".best-slide").eq(randomIdx).attr("data-ref-idx"), mmain.home.getMSub1sMenuId(), ".sub_gnb_cate.swiper-wrapper.best");
        }, 1000);

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
//            $(".goodsList").bind("click", function(e) {
//                e.preventDefault();
//                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//            });

//            $(".goodsList").removeClass("goodsList");
        }, 100);

        //로그아웃시 웹로그 추가
        if($("#cuLoingPlg").val()=="Y") {
            setTimeout(function() {
                common.wlog("home_curation_logout1");
            }, 1000);
        }

        common.wish.init();
        common.header.appDownBannerMainInit();

        //SR 3345802 남성전문관
        if(_isLogin){
        	mmain.main.getCookieMobile("mansWeekCookie", "man_sticky");
        }else{
        	setTimeout(function() {
        		common.gnb.callFooterBann();
        	}, 600);
        }
        
        // [3383750] (메인 페이지 개편) OY추천상품 개선 건(CSH)
        // 이상품어때요(추천상품) row count가 홀수인 경우 마지막 로우 제거
        try{
            if($(tabClass+ ".oy-recomm-prod .prod-list .prod").length > 1 && $(tabClass+ ".oy-recomm-prod .prod-list .prod").length % 2 == 1){
                $(tabClass+".oy-recomm-prod .prod-list .prod").last().remove();
            }
        }catch(e){
            console.log("error", e);
        }
        
        mmain.home.onYouTubeIframeAPIReady(); // [3383769] (메인 페이지 개편) 올알랭 신규 건 (CSH) -mr
        
        // [3393110] (메인 페이지 개편) 메인 배너/상단 띠배너 개선 건 (CSH)
        $("body").off("click touch", "button.show-all-banner");
        $("body").on("click touch", "button.show-all-banner", function(){
        	// 메인홈 전체보기 복사
        	$("#show-all-banner .ix-list-items").empty();
        	$("#show-all-banner .ix-list-items").append($('#main-swiper-tab0 .mVisual-slide').find('.ix-list-items').html())
        	$("#show-all-banner .ix-list-items li").removeAttr("style");
        	$("#show-all-banner-length").text("("+$('#main-swiper-tab0 .mVisual-slide').find('.ix-list-item').length+")");
        	// 복사 후 정렬
        	$("#show-all-banner .ix-list-items").html(
        		$("#show-all-banner .ix-list-items li").sort(function(a, b){
        			return $(a).data("didx") - $(b).data("didx");
        		})
        	);
        	// DS 코드 bind
            $("#show-all-banner .ix-list-items li").each(function(index, element) {
                $(element).find("a").bind("click", function() {
                    if(isNaN(parseInt($(element).attr("data-idx")))){
                        common.wlog("home_mainbanner_banner1");
                    }else{
                        common.wlog("home_mainbanner_banner" + (parseInt($(element).attr("data-idx")) + 1));
                    }
                });
            });
        	// 팝업 오픈
        	$("#show-all-banner").show().find(".sab-body").scrollTop(0);
			$("body").addClass("visible-allmenu");
		});
		//배너 전체보기 감추기
        $("body").off("click touch", "button.hide-all-banner");
		$("body").on("click touch", "button.hide-all-banner", function(){
			$("#show-all-banner").hide();
			$("body").removeClass("visible-allmenu");
		});
		// [3393110] End
		
		$("div.brndList").hide(); // [3407293] 브랜드 리스트 초기값 숨김처리
    },
    
    
    
    
    // [3383769] (메인 페이지 개편) 올알랭 신규 건 (CSH)
    youtube_player : null,
    
    // [3407066] 올알랭 동영상 재생 WEBLOG TIME 체커 추가
    youtube_play_counter  : 0,
    youtube_play_interval : null,
    youtube_play_wlog_is_send : true,
    
    onYouTubePlayTimeChecker : function(){
    	if(mmain.home.youtube_play_interval != null){
    		clearInterval(mmain.home.youtube_play_interval);
    		//console.log("onYouTubePlayTimeChecker", "[RESTART]");
    	}
    	if(!mmain.home.youtube_play_wlog_is_send){
    		//console.log("onYouTubePlayTimeChecker", "[WEBLOG END]");
    		return;
    	}
    	//console.log("onYouTubePlayTimeChecker", "start : " + mmain.home.youtube_play_counter);
    	mmain.home.youtube_play_interval = setInterval(function(){
    		try{
    			if(mmain.home.youtube_player.getPlayerState() == YT.PlayerState.PLAYING){
    	    		//console.log("onYouTubePlayTimeChecker", "count : " + mmain.home.youtube_play_counter);
    	    		mmain.home.youtube_play_counter++;
    	    	    if(mmain.home.youtube_play_counter >= 10) {
    	    	        clearInterval(mmain.home.youtube_play_interval);
    	    	        mmain.home.youtube_play_wlog_is_send = false;
    	    	        common.wlog("home_allalain_vod_play");
    	    	        //console.log("onYouTubePlayTimeChecker", "[WEBLOG SEND]");
    	    	    }
        		}else{
        			clearInterval(mmain.home.youtube_play_interval);
        			//console.log("onYouTubePlayTimeChecker", "[NO PLAY STATE STOP]");
        		}
    		}catch(e){
    			clearInterval(mmain.home.youtube_play_interval);
    			//console.log("onYouTubePlayTimeChecker", "[exception STOP]", e);
    		}
    	}, 1000);
    },
    // [3383769] End
    
    /// 올알랭 콜백 함수
    onYouTubeIframeAPIReady : function(){
    	
    	try{
    		
    		let vodId = $("#yt-player").attr("data-ref-vodId");
    		
    		mmain.home.youtube_player = new YT.Player('yt-player', {
    			height: '480',
    			width: '640',
    			videoId: vodId, //'X68lVgY3MQI'
    			playerVars: {
    				  'playsinline': 1		//인라인으로 재생 (전체화면 아닌)
    				, 'version':1
    				, 'loop' : 0
    				, 'autoplay': 0
    				, 'controls': 1
    				, 'modestbranding': 1
    				, 'fs': 0
    				, 'rel': 0
    			},
    			events: {
    				'onReady': function(event){
    					mmain.home.bindYoutubeEvent();
    					mmain.home.onPlayerReady(event);
    				},
    				'onStateChange': function(event){
    					mmain.home.onPlayerStateChange(event);
    				}
    			}
    		});
    	}catch(e){
    		// 2. This code loads the IFrame Player API code asynchronously.
    		var tag = document.createElement('script');
    		tag.src = "https://www.youtube.com/iframe_api";
    		var firstScriptTag = document.getElementsByTagName('script')[0];
    		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    	}
    	
    },

    
    // 4. The API will call this function when the video player is ready.
	onPlayerReady : function (event) {
		let isScroll = true;
		let networkcondition = "wifi";
		let intViewportHeight = $(window).innerHeight();
		let YTArea = $("#yt-player");
		let some1 = YTArea.offset().top;							// 아래에 걸린 경우
		let some2 = some1 + YTArea.height() - intViewportHeight;	// 위에 걸린 경우
		
		if ( $(window).scrollTop() <= some1 && $(window).scrollTop() >= some2 ) {
			//로드 될 때 화면에 보이니?
			// event.target.playVideo();
			mmain.home.playVideoEvent(event);
			isScroll = false;
		} else {
			//로드 될 때 안보이니?
			if ( networkcondition === "wifi" ) {
				//와이파이니?
				$(window).on("scroll", function(){
					scrollTop = $(window).scrollTop();
					if ( isScroll && scrollTop <= some1 && scrollTop >= some2 ) {
						//스크롤 할 때 화면에 보이니?
						// event.target.playVideo();
						mmain.home.playVideoEvent(event);
						isScroll = false;
					};
				});
			};
		};
	},

	onPlayerStateChange : function(event) {
		let intViewportHeight = $(window).innerHeight();
		let YTArea = $("#yt-player");
		let some1, some2;
		let isPlaying = false;
		let isPaused = false;
		if (event.data == YT.PlayerState.PLAYING) {
			
			// 유튜브 플레이어 재생시, DS 내용을 기록한다.
			mmain.home.onYouTubePlayTimeChecker();
//    		common.wlog("home_allalain_vod_play");
//    		 console.log("home_allalain_vod_play");
    		
			//재생 중일 때 스크롤 시 일시중지 (탭은 이미 잘 되고 있어서)
			some1 = YTArea.offset().top + YTArea.height() - 37;			// 스크롤 내릴 때
			some2 = some1 - intViewportHeight - YTArea.height() + 87;	// 스크롤 올릴 때
			isPlaying = true;
			$(window).on("scroll", function(){
				scrollTop = $(window).scrollTop();
					
				if (( isPlaying && scrollTop >= some1 || scrollTop <= some2 )) {
					// console.log("PLAYING") -- 로그속도저하로 주석
					event.target.pauseVideo();
					isPlaying = false;
				} else {
					return;
				}
			});
		} else if (event.data == YT.PlayerState.PAUSED) {
			//일시중지 중일 때 스크롤 시 다시 재생
			some1 = YTArea.offset().top;							// 아래에 걸린 경우
			some2 = some1 + YTArea.height() - intViewportHeight;	// 위에 걸린 경우
			isPaused = true;
			// console.log("PAUSED", isPaused) -- 로그속도저하로 주석
    		
			$(window).on("scroll", function(){
				scrollTop = $(window).scrollTop();
				if ( isPaused && scrollTop <= some1 && scrollTop >= some2) {
					event.target.playVideo();
					isPaused = false;
				} else {
					return;
				};
			});
		} else if (event.data == YT.PlayerState.ENDED) {
			mmain.home.youtube_player.setLoop(false);
//			mmain.home.youtube_player.stopVideo();
			mmain.home.youtube_player.seekTo(0, true);
		}
	},
    
    bindYoutubeEvent : function(){
    	
    	let tabClass = "#main-swiper-tab0" + " ";
    	
    	//타임스탬프
		let btnTimeStamp = $(tabClass + ".allalain .time-stamp");
		btnTimeStamp.on("click touch", function(){
			let seekto = $(this).attr("data-timeline");
			if ( seekto ) {
				mmain.home.youtube_player.seekTo(seekto, true);
			} else {
				if ( !YT.PlayerState.PLAYING) {
					mmain.home.playVideoEvent();
				};
			};
		});
		
    },
    
    
    playVideoEvent : function(event){
    	
    	try{
	    	if(event){
	    		event.target.mute(); 
	    		event.target.playVideo();
	    	}else{
	    		mmain.home.youtube_player.mute();
	    		mmain.home.youtube_player.playVideo();
	    	}
    	} catch (e) {
        	console.log("[error-04]", e);
        }
    	
    },
    // [3383769] END
    
    
    getRecoBellContsInfoAjax : function() {

    	//3310503 (Action Item) 중복호출 제거 - 로그인체크 중복호출 추가 확인
//        var isLogin = common.isLogin(); //중복호출 제거
	     if(mmain.home.recoCallYn == "N"){
	       	mmain.home.recoCallYn = "Y";
	       	var url = _baseUrl + "main/getRecoBellContsInfoAjax.do";
	       	var data = {};
	       	common.Ajax.sendRequest("POST",url,data,mmain.home._callBackGetRecoBellContsInfo);
	            mmain.home.recoCallYn = "N";
	     }
    },

    _callBackGetRecoBellContsInfo : function(data) {    	
        $("#recobell_area1").html("");
        $("#recobell_area1").html(data);
        
        //유사한 성향 고객 추천 없는 경우.
        if($("#recobell_area1").find("#curation1 .curation_list li").length == 0) {
        	mmain.home.getEigeneTimeBestInfoAjax();
        }
    },
    getEigeneTimeBestInfoAjax : function() {
    	mmain.home.recoCallYn = "Y";
    	
    	var url = _baseUrl + "main/getEigeneTimeBestInfoAjax.do";
       	var data = {};
       	common.Ajax.sendRequest("POST",url,data,mmain.home._callBackGetEigeneTimeBestInfo);
        mmain.home.recoCallYn = "N";
    },
    _callBackGetEigeneTimeBestInfo : function(data) {
    	$("#recobell_area1").html("");
        $("#recobell_area1").html(data);
    },
    getRecoBellClickBestInfoAjax : function() {
        var url = _baseUrl + "main/getRecoBellClickBestInfoAjax.do";
        var data = {};
        common.Ajax.sendRequest("POST",url,data,mmain.home._callBackgetRecoBellClickBestInfo);
    },

    _callBackgetRecoBellClickBestInfo : function(data) {
        $("#recobell_area2").html("");
        $("#recobell_area2").html(data);
        
        if($("#recobell_area2").find(".curation_list li").length == 0) {
        	$("#recobell_area2").hide();
        }
    },

    getRecoBellRecentInfoAjax : function() {
        var url = _baseUrl + "main/getRecoBellRecentInfoAjax.do";
        var data = {};
        common.Ajax.sendRequest("POST",url,data,mmain.home._callBackgetRecoBellRecentInfo);
    },

    _callBackgetRecoBellRecentInfo : function(data) {
        $("#recobell_area2").html("");
        $("#recobell_area2").html(data);
    },

    getRecoBellMktAgrYnInfoAjax : function() {
        var url = _baseUrl + "main/getMktAgrYnInfoAjax.do";
        var data = {};
        common.Ajax.sendRequest("POST",url,data,mmain.home._callBackGetRecoBellMktAgrYnInfo);
    },

    _callBackGetRecoBellMktAgrYnInfo : function(data) {
        $("#recobell_area4").html("");
        $("#recobell_area4").html(data);
    },
    
    // [3407293] 인기브랜드 콜백 추가
    _callBackMainBrandBest : function(setObj, html) {
    	$("div.brndList").hide();
      	if(html && html.trim() != ""){
      	    $(setObj.viewArea).find(".prod-list").html("");
          	$(setObj.viewArea).find(".prod-list").html(html);
          	
          	// EVENT 바인드
          	$(setObj.viewArea).find(".prod-inner").each(function(idx) {
          	
				var rccode = common.isLogin() ? 'mc_main_03_a' : 'mc_main_03_c';
            	var brndIdx = parseInt($(".brnd-slide.active").attr("data-ref-idx")) + 1;
            	
                $(this).find("a.goodsList").each(function(i){
                	
                	var web_log_id = "home_brand_tab" + brndIdx + "_goods" + (idx + 1);
                	
                    var _item = $(this);
    	            var _data_goodsno = _item.attr('data-ref-goodsno');
    	    		var _data_dispCatNo = _item.attr('data-ref-dispCatNo');
    				var egcode = _item.attr("data-egcode");
    	    	    var egrank = _item.attr("data-egrank");
    	            _item.attr('href','javascript:common.wlog("'+web_log_id+'");common.link.moveGoodsDetailCuration("'+_data_goodsno+'", "'+_data_dispCatNo+'","'+web_log_id+'","'+rccode+'", "'+egcode+'", "'+egrank+'","","display","","goods_image");');
                    
                });
            });
            
            // 응답 결과가 있는 경우 append 처리 후 lazyload 처리
            // mmain.main.setLazyLoad();
            common.setLazyLoad();
            
      	}
    	$(setObj.viewArea).show();
        setTimeout(function() {
            $(document).resize();
            try {
                $("#mainSwiper")[0].swiper.update();
            } catch (e) {
            	console.log("[error-02]", e);
            }
        }, 100);
    },
   
    bindEvent : function() {
        //링크 처리
        $("img[data-ref-link-url]").bind("click", function() {
            mmain.menu.setPagePos();
            location.href = $(this).attr("data-ref-link-url");
        });

        $("li[data-ref-link-url]").bind("click", function() {
            mmain.menu.setPagePos();
            location.href = $(this).attr("data-ref-link-url");
        });
        
        // 추천 기획전 링크 처리
        // UI 개선으로 기획전 분리 - [3336021] (메인 페이지 개편) 기획전 개선 건(CHY)
        // trackingCd 변수 추가 - [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY)
        $(".jdm-recomm-exhbn > a").bind("click", function() {
        	mmain.menu.setPagePos();
        	var dispCatNo = $(this).attr("data-ref-dispCatNo");
        	var trackingCd = $(this).attr("data-tracking-cd");
        	common.link.movePlanShop(dispCatNo, trackingCd);
        });
        
        // 인기 기획전 링크 처리
        // UI 개선으로 기획전 분리 - [3336021] (메인 페이지 개편) 기획전 개선 건(CHY)
        // trackingCd 변수 추가 - [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY)
        $(".swiper-wrapper > li > .exhbn-copy").bind("click", function() {
        	mmain.menu.setPagePos();
        	var dispCatNo = $(this).attr("data-ref-dispCatNo");
        	var trackingCd = $(this).attr("data-tracking-cd");
        	common.link.movePlanShop(dispCatNo, trackingCd);
        });

        //기획전 링크 처리
        $(".mlist2v-goods.plan > li > .imgBig").bind("click", function() {
            mmain.menu.setPagePos();
            var dispCatNo = $(this).attr("data-ref-dispCatNo");
            common.link.movePlanShop(dispCatNo);
        });

        //전문관 링크 처리
        // [3336018] (메인 페이지 개편) 전문관 개선 건 - UI 개선으로 클릭이벤트 select 변수 수정(CHY)
        $("#mlist-Jeonmungwan > li").bind("click", function() {
            mmain.menu.setPagePos();
            var dispCatNo = $(this).attr("data-ref-dispCatNo");
            
            // 2020.07.02 카테고리관 링크연결 내용으로 변경
            //common.link.moveSpcShop(dispCatNo);
            common.link.moveCategoryShop(dispCatNo);
        });

        //베스트 선택시
        var idx = 0;
        $(".best-slide").each(function() {
            $(this).attr("data-ref-idx", idx);
            idx++;
        });

        $(".best-slide").click(function() {
            $(".best-slide").removeClass(mmain.home.getMSub1sMenuActiveClass());
            $(this).addClass(mmain.home.getMSub1sMenuActiveClass());
            $(mmain.home.getMSub1sListClass()).empty();
            
            

            mmain.home.getBestTop3List($(this).attr("data-ref-dispCatNo"));

            mmain.home.scrollToTabMenu($(this).attr("data-ref-idx"), mmain.home.getMSub1sMenuId(), ".sub_gnb_cate.swiper-wrapper.best");
        });

        //브랜드 선택 시
        var idx = 0;
        $(".brnd-slide").each(function() {
            $(this).attr("data-ref-idx", idx);
            idx++;
        });

		// [3407293] todo - 브랜드 AS-IS 스크립트 수정
        $(".brnd-slide").click(function() {
        	
			$(".brnd-slide").removeClass("active");
            $(this).addClass("active");
            
            // mmain.home.AB_RB_PCID = 0; // AB 테스트. 0: 옵니 1: BO   //무조건 옵니 타도록 TEST 
            var viewArea = "div.brndList[data-ref-brndNo='" + $(this).attr("data-ref-brndNo") + "'][data-ref-setNo='" + $(this).attr("data-ref-setNo") + "']";
            if(mmain.home.recoBellUseYn == 'Y' && mmain.home.recoBellViewYn == 'Y' && mmain.home.AB_RB_PCID == 0){
                try{
                    // [3407293] 옵니 브랜드 베스트 추천상품 호출
                    var param = {
                        size : 4,  // 노출개수의 2배수
                        bids : $(this).attr("data-ref-brndNo")
                    };
                    curation.callCuration("b004", param, function(data) {
                    	
                    	// 1) 큐레이션 결과 없을경우 BO 데이터 노출
                    	if(data.results == null || data.results == undefined) {
                    		console.log("[GROUP A] mainBestBrand NO RESULT");
                    		var obj = { viewArea : viewArea };
                    		mmain.home._callBackMainBrandBest(obj);
                    		return false;
                    	}
                    	
                    	if(data.results.length == 0) {
                    		console.log("[GROUP A] mainBestBrand NO RESULT LENGTH");
                    		var obj = { viewArea : viewArea };
                    		mmain.home._callBackMainBrandBest(obj);
                    		return false;
                		}
                    	
                        var url = _secureUrl + "curation/getCurationCallBackAjax.do";
                        var obj = {
                            viewType : "MainBest", 	// 메인 브랜드 베스트
                            styleNo : 45, 			// 템플릿 번호
                            viewSize : 2, 			// 슬라이드 노출갯수
                            viewArea : viewArea,
                            dispCatNo : '90000010001', 
                            callBackFunc :  mmain.home._callBackMainBrandBest,
                        };
                        console.log("[GROUP A] mainBestBrand DONE");
                        
                        // 2) 큐레이션 데이터 있을경우 goods array로 상품조회
                        var setObj = jQuery.extend(data, obj);
                        curation.getCurationCallBack(setObj, url);
                    }, function(){
                        console.log("[GROUP A] mainBestBrand FAIL");
                    	var obj = { viewArea : viewArea };
                    	mmain.home._callBackMainBrandBest(obj);
                    	return false;
                    });
                }catch(e){
                    console.log("[GROUP A] mainBestBrand EXCEPTION", e);
                    var obj = { viewArea : viewArea };
                    mmain.home._callBackMainBrandBest(obj);
                }
            }else{
                console.log("[GROUP B] mainBestBrand DONE");
                var obj = { viewArea : viewArea };
                mmain.home._callBackMainBrandBest(obj);
            }
            
            // 브랜드 좋아요 조회
            var param = { onlBrndCd : $(this).attr("data-ref-brndNo") };
            common.Ajax.sendRequest(
                    "POST"
                  , _baseUrl + "mypage/getWishListBrndsCnt.do"
                  , param
                  , function(res) {                    	
                      if(res > 0){
                    	  $(viewArea).find(".zzim").html(res);
                      }else{
                    	  $(viewArea).find(".zzim").empty();
                      }
                  }, false
            );
            
        });

//        $(document).bind("resize", function() {
//            setTimeout(function() {
//                var mSubGnb_swiper = new Swiper('#mSub1s-menu', {
//                    initialSlide: 0,
//                    slidesPerView: 'auto',
//                    paginationClickable: true,
//                    spaceBetween: 0,
//                    loop: false
//                });
//                var mSubGnb_swiper = new Swiper('#mSub2s-menu', {
//                    initialSlide: 0,
//                    slidesPerView: 'auto',
//                    paginationClickable: true,
//                    spaceBetween: 0,
//                    loop: false
//                });
//
//                //메뉴가 있을 경우 리프레쉬
//                mmain.home.scrollToTabMenu($(".best-slide.on").attr("data-ref-idx"), "#mSub1s-menu", ".sub_gnb_cate.swiper-wrapper.best");
//                mmain.home.scrollToTabMenu($(".brnd-slide.on").attr("data-ref-idx"), "#mSub2s-menu", ".sub_gnb_cate.swiper-wrapper.brnd");
//
//            }, 500);
//        });

        $(".mlist2v-goods.plan").find("li").each(function() {
            if ($(this).find("div.goods a .icon span").length < 1) {
                $(this).find("div.goods a .icon").remove();
            }
        });

        setTimeout(function() {
            mmain.home.bindWebLog(false);
        }, 700);

    },

    setSwipe : function() {
        
    	//메인 슬라이드 S
    	$("#main-swiper-tab0 .mVisual-slide .ix-list-items").html(
			$("#main-swiper-tab0 .mVisual-slide .ix-list-items li").sort(function(a, b){
	            return $(a).data("didx") - $(b).data("didx");
			})
		);
    	
//    	$('#main-swiper-tab0 .ix-controller .ix-thumb').not(':eq(0)').remove(); // [3393110]
    	
		var mVisual = $('#main-swiper-tab0 .mVisual-slide'),
			ixItems = mVisual.find('.ix-list-items'),
			ixItem = mVisual.find('.ix-list-item'),
			ixItemLen = ixItem.length-1,
			pagination = mVisual.find('.ix-controller .idx');			//2020-08-26 추가 - [3393110]
		
		ixItem.eq(0).addClass('st');
	    mVisual.ixOverlayList();
	    mVisual.find('li[data-idx='+ixItemLen+']').addClass('prev');
	    pagination.text("1");											//2020-08-26 추가 - [3393110]
	    mVisual.find('.ix-controller .length').text(ixItem.length);		//2020-08-26 추가 - [3393110]
	    mVisual.on('ixOverlayList:slideStart', function(e){
	        var index = e.currentIndex,
	        	direction = e.direction;		
	        if(direction == 'next'){
	            var index = index<ixItemLen ? index = index + 1 : index = 0;
	        }else{		            
	            var index = index<=0 ? index = ixItemLen : index = index - 1;
	        }
	        ixItems.find('li[data-idx='+index+']').addClass('on');
	    });
	    mVisual.on('ixOverlayList:slideEnd', function(e){
	        var index = e.currentIndex,
	        	direction = e.direction;
	        if(direction == 'next'){
	            var index = index<=0 ? index = ixItemLen : index = index - 1;
	        }else{
	            var index = index>=ixItemLen ? index = 0 : index = index + 1;
	        }
	        ixItems.find('li[data-idx='+index+']').removeClass('on');
	        
	        var addprev = e.currentIndex;
	        var addprev = addprev<=0 ? addprev = ixItemLen : addprev = addprev - 1;
	        ixItems.find('li[data-idx='+addprev+']').addClass('prev');
	        
	        var remprev = e.currentIndex;
	        var remprev = remprev>=ixItemLen ? remprev = 0 : remprev = remprev + 1;		        
	        ixItems.find('li[data-idx='+remprev+']').removeClass('prev');		        
	        pagination.text(e.currentIndex + 1);						//2020-08-26 추가 - [3393110]
	        //초기 st 삭제
	        ixItem.removeClass('st');        
	    })
	    // 2020-08-26 재생/일시중지 버튼 삭제 - [3393110] (메인 페이지 개편) 메인 배너/상단 띠배너 개선 건 (CSH)
//	    mVisual.find('.btnPlay').on('click', function(){
//	        if(!$(this).hasClass('pause')){
//		   			$(this).addClass('pause');
//		   			mVisual.ixOverlayList('startTimer');
//		       	}else{
//	   			$(this).removeClass('pause');
//	   			mVisual.ixOverlayList('stopTimer'); 
//		    	}
//	    });
	    $(window).on( 'resize', function(e) {
	        mVisual.ixOverlayList('resize');
	    });
        
        $(".mVisualArea .ix-list-items .ix-list-item").bind("click", function() {
            sessionStorage.setItem("visualBannerIdx",(parseInt($(this).attr("data-index")) + 1));
        });
        //메인 슬라이드 E
        
        // [3393110] - 2020-08-03 상단 띠배너 개편
        var mBand = $('#mBand'),
			mBitem = mBand.find('.swiper-slide'),
			mBitemLen = mBitem.length;
		
		if(mBitemLen>1){
			// AS-IS
//			var mBand = new Swiper('#mBand', {
//				slidesPerView:'auto',
//				nextButton: '.next',
//				prevButton: '.prev',
//			});
			// TO-BE : 조동호님 작업코드 복사영역
			// --------------------------------------------
			let mainHBanner = $(".main-h-banner");
			let d1 = mainHBanner.find(".dummy.d1");
			let d2 = mainHBanner.find(".dummy.d2");
			let hbanner = new Swiper(mainHBanner, {
				initialSlide: 0,
				slidesPerView: 1,
				spaceBetween: 0,
				speed: 200,
				longSwipesMs: 0,
				longSwipesRatio: 0.3,
				touchReleaseOnEdges: true,	//시작, 끝 지점에서 더 이상 당길 수 없다. 
				nextButton: mainHBanner.find('.btn-next'),
				prevButton: mainHBanner.find('.btn-prev'),
				onInit(swiper) {
					mainHBanner.addClass("ready init").find(".swiper-wrapper").css({transform: ""});
					let bg1 = $(swiper.slides[0]).find("img").attr("src");
					let bg2 = $(swiper.slides[1]).find("img").attr("src");
					d1.css("background-image", "url("+bg1+")").children("div").css("background-image", "url("+bg2+")");
					d2.css("background-image", "url("+bg2+")").children("div").css("background-image", "url("+bg1+")");
					d2.addClass("active");
				},
				onSetTranslate(swiper, translate) {
					let ww = $(window).width();
					let blur, brightness;
					if ( swiper.activeIndex == 0 ) {
						blur = 0.5 - (-translate * 0.005);
						if (blur < 0) blur = 0;
						d2.css({filter: "blur("+ blur +"px)"})
					} else {
						blur = 0.5 - ((translate + ww) * 0.005);
						if (blur < 0) blur = 0;
						d1.css({filter: "blur("+ blur +"px)"})
					};
				},
				onTouchStart(swiper, event)	{
					mainHBanner.removeClass("init ready");
					swiper.wrapper.removeClass("transition");
				},
				onTouchEnd(swiper, event)	{
					mainHBanner.addClass("ready");
					swiper.wrapper.addClass("transition");
				},
				onSlideChangeStart(swiper) {
					mainHBanner.addClass("ready");
					if ( swiper.activeIndex == 0 ) {
						d2.addClass("active");
						d1.removeClass("active");
					} else {
						d1.addClass("active");
						d2.removeClass("active");
					}
				}
			});
			// --------------------------------------------
		}else{
			mBand.addClass('one');
		}

        var bnrIdx = sessionStorage.getItem("visualBannerIdx");
        if(bnrIdx!=null && bnrIdx !=""){
            sessionStorage.removeItem("visualBannerIdx");
            //visual_swiper.slideTo(bnrIdx,1);
        }
        
        //BI Renewal. 20190918. nobbyjin. - 퍼블적용
        /*$("#swiper-autoplay").addClass("pause");
        $('#swiper-autoplay').on({'click' : function(){
                if(!$(this).hasClass('pause')){
                    $(this).addClass('pause');
                    visual_swiper.startAutoplay();
                }else{
                    $(this).removeClass('pause');
                    visual_swiper.stopAutoplay();
                }
            }
        });*/
        //}
        if ($("#mHome-onlyone").find(".swiper-slide").length > 1) {
            $("#mHome-onlyone").css({'width': $('.onlyOneBrand').width()+'px'});
            var banner_swiper = new Swiper('#mHome-onlyone', {
                slidesPerView: 1,
                paginationClickable: true,
                spaceBetween: 30,
                nextButton: '.next',
                prevButton: '.prev',
                freeMode: false,
                loop: true
            });
            $(window).resize(function(){
                var width = $("#mHome-onlyone").width();
                $("#mHome-onlyone").css({'width': $('.mHome-onlyone-wrap').width()+'px'});
            });

        } else {
            $("#mHome-onlyone").find(".swiper-button-next").hide();
            $("#mHome-onlyone").find(".swiper-button-prev").hide();
        }

        /// 카테고리 AS-IS
        var mSubGnb_swiper = new Swiper(mmain.home.getMSub1sMenuId(), {
            initialSlide: 0,
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 0,
            loop: false
        });
       
//        var mSubGnb_swiper = new Swiper('#mSub2s-menu', {
//            initialSlide: 0,
//            slidesPerView: 'auto',
//            paginationClickable: true,
//            spaceBetween: 0,
//            loop: false
//        });
        
      //Quick-Menu Swiper
        var qmSwiper = {
            initialSlide: 0,
            slidesPerView: "auto",
            observer: true,
            observerParents: true,
            freeMode: true,
            touchAngle: 30,     //default 45deg
            spaceBetween: 14,   // when window width is > 410px 
            breakpoints: {
                // when window width is <= 410px (320px ~ 410px -> 8px, 411px ~ 14px)
                410: {
                    spaceBetween: 8
                }
            },

            onInit(swiper) {
            },
            onSetTranslate(swiper, translate) {
            }
        };
        //quick-menu 항목이 5개보다 많을 때
        var quickmenuOrigin = $(".quick-menu:eq(0)"),
            quickmenu = $(".quick-menu");
        if ( quickmenuOrigin.find(".swiper-slide").length > 5) {
            quickmenu.removeClass("flex-quick-menu");
            quickmenu.find(".show-drawer").show();
            quickmenuswiper = Swiper('.quick-menu', qmSwiper);
        };
        //당겨서 드로어 메뉴 보여주기
        function showDrawer(){
            common.gnb.clickSlideMenu("quickmenu");
        };
        //더 보기 버튼 눌렀을 때
        $(".show-drawer button").on("click touch", function(){
            //$("#footerTabCategoy").trigger("click");
            common.gnb.clickSlideMenu("quickmenu");
        });
    },
    
    // 카테고리 베스트 AB 테스트 ID 가져옴.
    // chkNo(RB_PCID) 0인경우 renewal, 1인경우 as-is layout이 getHomeAjax에 그려짐.
/////////// TEST 코드 todo 정리 필요
    getMSub1sMenuId : function() {
    	
    	 var menuId = "#mSub1s-menu-new";
    	 try{
    		 if($("#mSub1s-menu")[0]){
    			 menuId = "#mSub1s-menu";
    	     }
    		 
    		 if($("#mSub1s-menu-new")[0]){
    			 menuId = "#mSub1s-menu-new";
    	     }
    		 
    	 }catch(e){}
         
         return menuId;
    	
    },
    getMSub1sIsRenewal : function() {
    	var isRenewal = "A";
    	
       	 try{
       		 if($("#mSub1s-menu")[0]){
       			isRenewal = "B";
       	     }
       		 
       		 if($("#mSub1s-menu-new")[0]){
       			isRenewal = "A";
       	     }	 
       	 }catch(e){}
       	 return isRenewal;
    },
    getMSub1sListClass : function() {
    	
   	 var menuId = ".mlist5v-goods-new.bestList";
   	 try{
   		 if($("#mSub1s-menu")[0]){
   			 menuId = ".mlist5v-goods.bestList";
   	     }
   		 
   		 if($("#mSub1s-menu-new")[0]){
   			 menuId = ".mlist5v-goods-new.bestList";
   	     }
   		 
   	 }catch(e){}
        
        return menuId;
   	
   },
   getMSub1sMenuActiveClass : function() {
   	
  	 var menuId = "active";
  	 try{
  		 if($("#mSub1s-menu")[0]){
  			 menuId = "on";
  	     }
  		 
  		 if($("#mSub1s-menu-new")[0]){
  			 menuId = "active";
  	     }
  		 
  	 }catch(e){}
       
       return menuId;
  	
  },
  getMSub1sMenuReffer : function() {
  	
 	 var menuId = "home_new";
 	 try{
 		 if($("#mSub1s-menu")[0]){
 			 menuId = "home";
 	     }
 		 
 		 if($("#mSub1s-menu-new")[0]){
 			 menuId = "home_new";
 	     }
 		 
 	 }catch(e){}
      
      return menuId;
 	
 },
 ///////////

    getBestTop3List : function(dispCatNo) {
        
        //코드 완료 후 스토어 정보 조회
        var param = {
            pageIdx : 1,
            rowsPerPage : 5,
            dispCatNo : $(mmain.home.getMSub1sMenuId()).attr("data-ref-bestDispCatNo"),
            fltDispCatNo : (dispCatNo == undefined || dispCatNo == null) ? "" : dispCatNo,
            refer : mmain.home.getMSub1sMenuReffer,
            // abType : mmain.home.getMSub1sIsRenewal   // 무조건 검색엔진 데이터 타게..
        };
        
        //미리보기 파라미터 추가
        mmain.menu.setPreviewParam(param);
        
        /* 3032836 MC, 앱 최초 접속 시, 카테고리 BEST 상품 미노출 발생 
         * CORS(Cross Origin Resource Sharing) 문제 발생.
         * Mobile App 일부 Mobile 기기에서 MA(Mobile App) Domain이 아닌 MAMobile Web) Domain를 호출하는 문제 발생.
         * 정보전략팀과 논의 후, 임시조치로 중복 App검증(common.app.appInfo.isapp)후, URL 보정 작업을 처리함.
         * 정확한 원인은 Interceptor - UserAgent - Header 등 관련 BaseURL에 관련된 부분에 대한 상세 분석 필요 
         * */
        if(common.app.appInfo.isapp){
            common.Ajax.sendRequestSton( // best
                    "GET"
                    , _appBaseUrl + "main/getBestPagingAjax.do"
                    , param
                    , mmain.home.getBestAjaxCallback
                    , null
                    //, mmain.main.stonUseYn
                    , "N"
            );
        }else{
            common.Ajax.sendRequestSton( // best
                    "GET"
                    , _baseUrl + "main/getBestPagingAjax.do"
                    , param
                    , mmain.home.getBestAjaxCallback
                    , null
                    //, mmain.main.stonUseYn
                    , "N"
            );     
        }     
    },


    rankInterval : null, // 중복 호출 오류로 전역으로 처리
    
    getBestAjaxCallback : function(res) {
    	
    	let tabClass = "#main-swiper-tab0" + " ";

        //응답 결과가 있는 경우 append 처리 후 lazyload 처리
        $(tabClass+mmain.home.getMSub1sListClass()).append(res);
        //
        
        // renewal
        if(mmain.home.getMSub1sIsRenewal() == "A"){
        	
	        $(tabClass + ".link-best").each(function(i){
	        	var fltDispCatNo = $(tabClass+".best-slide.active").attr("data-ref-dispCatNo");
	        	var _item = $(this);
	            _item.attr('href','javascript:common.link.moveBestCtg('+fltDispCatNo+');');
	        });
	        
	        const ranks = $(tabClass+mmain.home.getMSub1sListClass());
			const rank = ranks.find("li");
	
			let isInterval = false;
//			let rankInterval;
			// 전역으로 처리 후 초기화.
			if(mmain.home.rankInterval != null){
				clearInterval(mmain.home.rankInterval);
				mmain.home.rankInterval = null;
			}
			
			function startInterval(){
				isInterval = false;
				mmain.home.rankInterval = setInterval(function(){
					autoNextRank();
				}, 4000);
			};
			function stopInterval(){
				clearInterval(mmain.home.rankInterval);
				isInterval = true;
			};
			function showNextRank(num){
				let active = rank.filter(".active");
				active.removeClass("active");
				rank.eq(num).addClass("active");
			};
			function autoNextRank(){
				let actNum = rank.filter(".active").index();
				let nextNum = ( actNum + 1 < rank.length ) ? actNum + 1 : 0;
				// [OYONMALL-926] 결함처리: 상품 5위까지 자동롤링 완료 후 다음 카테고리로 이동
				try {
					if(nextNum == 0 && actNum >= 0){
					    if($(".best-slide")[Number($(".best-slide.active").attr("data-ref-idx"))+1]){
	                        $(".best-slide")[Number($(".best-slide.active").attr("data-ref-idx"))+1].click();
	                    }else{
	                        $(".best-slide")[0].click();
	                    }
					}else{
					    showNextRank(nextNum);
					}
                } catch(e) {
                	showNextRank(nextNum);
                }
				
			};
			ranks.find("li:first-child").addClass("active");
			startInterval();
	        // 랭킹 텍스트 링크 클릭시
			ranks.find(".title").on("click touch", function(e){
				e.preventDefault();
				if ( $(this).parent(rank).hasClass("active") ) {
					return;
				} else {
					stopInterval();
					showNextRank($(this).parent(rank).index());
					startInterval();
				};
			});
        }
		////////////////
		
        setTimeout(function() {

//            sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        	sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

            //링크 처리
            common.bindGoodsListLink(tabClass+mmain.home.getMSub1sListClass());
//            $(".goodsList").bind("click", function(e) {
//                e.preventDefault();
//                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//            });

//            $(".goodsList").removeClass("goodsList");

            //찜 처리 초기화
            common.wish.init();
            //베스트 상품 웹로그 처리
            mmain.home.bindWebLog(true);

        }, 100);

        setTimeout(function() {
            mmain.main.setLazyLoad();
        }, 100);


    },

    /**
     * 메뉴 idx에 따른 위치값 보정
     * @param gnbTabIdx
     */
    scrollToTabMenu : function(gnbTabIdx, menuTag, menu) {
        var width = $(document).width();
        var menuBarWidth = 0;

        var gnbMenuTag = $(menuTag).find('ul');
        var gnbMenu = $(menu);
        //cell width
        var gnbCellWidth = gnbMenuTag.find("li").eq(gnbTabIdx).outerWidth();
        var gnbCellCnt = gnbMenuTag.find("li").length;

        //화면 - 가운데 offset left 조회
        var documentOffsetLeft = Math.round(width / 2) - Math.round(gnbCellWidth / 2);
        var documentOffsetRight = Math.round(width / 2) + Math.round(gnbCellWidth / 2);

        var documentHalfWidth = Math.round(width / 2);

        var fixedLeftPositionIdx = 0;
        var fixedRightPositionIdx = 0;

        gnbMenuTag.find("li").each(function() {
           menuBarWidth += $(this).outerWidth();
        });

        if (menuBarWidth <= width) {
            return;
        }

        var checkSum = 0;

        //위치 fix가 필요없는 index 조회(양쪽 끝에 위치하는 cell 중 몇개까지 양끝으로 무조건 이동시키면 되는지..)
        for (var i = 0; i < gnbCellCnt; i++) {
            checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
//            console.log(gnbMenuTag.find("li").eq(i).outerWidth() + " : " + checkSum + " : " + documentHalfWidth);
            if (checkSum > documentHalfWidth) {
                fixedLeftPositionIdx = i - 1;
                break;
            } else {
                checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
            }
//            console.log("f : " + checkSum);
        }

        checkSum = 0;
        for (var i = gnbCellCnt - 1; i >= 0; i--) {
            checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
            if (checkSum > documentHalfWidth) {
                fixedRightPositionIdx = i + 1;
                break;
            } else {
                checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
            }
        }

//          console.log(fixedLeftPositionIdx + " : " + fixedRightPositionIdx + " : " + menuBarWidth + " : " + width + " : " + gnbTabIdx + " :" + checkSum + " : " + documentOffsetLeft + " : " + (checkSum - documentOffsetLeft));
//
//          var fixedPositionIdx = Math.ceil(documentOffsetLeft / gnbCellWidth) - 1;

//            .css('transition-duration','500ms');

        //왼쪽끝에 위치시킬 메뉴 idx일 경우
        if (gnbTabIdx <= fixedLeftPositionIdx) {
            setTimeout(function(){gnbMenu.css({
                "transform": "translate3d(0px, 0, 0)",
                "transition-duration": "500ms"
            })}, 200);

        //오른쪽 끝에 위치시킬 메뉴 idx일 경우
        } else if (gnbTabIdx >= fixedRightPositionIdx) {
            setTimeout(function(){gnbMenu.css({
                "transform": "translate3d(" + (-1 * (parseInt(menuBarWidth) - width)) + "px, 0, 0)",
                "transition-duration": "500ms"
            })}, 200);

        //그 외 가운데 위치시킬 메뉴일 경우
        } else {
            checkSum = 0;
            for (var i = 0; i < gnbTabIdx; i++) {
                checkSum += gnbMenuTag.find("li").eq(i).outerWidth();
            }
            setTimeout(function(){gnbMenu.css({
                "transform": "translate3d(" + (-1 * (checkSum - documentOffsetLeft)) + "px, 0, 0)",
                "transition-duration": "500ms"
            })}, 200);
        }

    },

    bindWebLog : function(isBest) {

        if (isBest) {
            
        	// 메인 카테고리 베스트 상품임..
        	try{
        		// TO-BE
        		if($("#mSub1s-menu-new")[0]){
        			 var bestIdx = parseInt($("#mSub1s-menu-new ul li.active").attr("data-ref-idx")) + 1;
        			//베스트 상품
                     $(".mlist5v-goods-new.bestList > li > .prod-wrap").each(function(goodsIdx) {
                        $(this).find(".goodsList").each(function() {
                        	$(this).bind("click", function() {
                                common.wlog("home_catebest_new_tab" + bestIdx + "_goods" + (goodsIdx + 1));
                                
                            });
                         });
                     });
        		}
        		// AS-IS
        		if($("#mSub1s-menu")[0]){
        			//베스트 상품
                    var bestIdx = parseInt($("#mSub1s-menu ul li.on").attr("data-ref-idx")) + 1;

                    //베스트 상품
                    $(".mlist5v-goods.bestList > li > a").each(function(goodsIdx) {
                       $(this).bind("click", function() {
                           common.wlog("home_catebest_tab" + bestIdx + "_goods" + (goodsIdx + 1));
                       });
                    });
        		}
        	}catch(e){}
        } else {
            //비주얼배너 AS IS
        	/*
            $(".mHome-visual .mSlider-home .swiper-slide").bind("click", function() {
                common.wlog("home_mainbanner_banner" + (parseInt($(this).attr("data-swiper-slide-index")) + 1));
            });
            */
        	//비주얼배너 TO BE
            $(".mVisual-slide .ix-list-viewport .ix-list-items").bind("click", function() {
            	if(isNaN(parseInt($(".mVisual-slide .ix-list-viewport .ix-list-items .ix-list-item.on").attr("data-idx")))){
            		common.wlog("home_mainbanner_banner1");
            	}else{
            		common.wlog("home_mainbanner_banner" + (parseInt($(".mVisual-slide .ix-list-viewport .ix-list-items .ix-list-item.on").attr("data-idx")) + 1));
            	}
            });
            //상단띠배너
            $(".band-Banner.top_banner").bind("click", function() {
                common.wlog("home_topbanner_banner1");
            });
            //오늘드림 배너
            $(".band-Banner > img.quickBanner").bind("click", function() {
                common.wlog("home_mid_quickbanner");
            });
            //쇼핑키워드
            $(".keyword-area li").each(function(idx) {
                $(this).bind("click", function() {
                    common.wlog("home_keyword_keyword" + (idx + 1));
                });
            });
            
            // 추천 기획전 - UI 개선으로 기획전 분리 [3336021] (메인 페이지 개편) 기획전 개선 건(CHY)
            $(".jdm-recomm-exhbn a").each(function(idx) {
            	$(this).bind("click", function() {
            		common.wlog("home_recommplan_banner" + (idx + 1));
            	});
            });
            
            // 인기 기획전 네이게이션 태그 - UI 개선으로 기획전 분리 [3336021] (메인 페이지 개편) 기획전 개선 건(CHY)
            $(".pagination button").each(function(idx) {
            	$(this).bind("click", function() {
            		common.wlog("home_planshop_navigation" + (parseInt($(this).attr("data-ref-idx")) - 2));
            	});
            });
            
            // 인기 기획전 - UI 개선으로 기획전 분리 [3336021] (메인 페이지 개편) 기획전 개선 건(CHY)
            $("#jdpe .swiper-wrapper").children("li").each(function(idx) {
            	var dataIdx = parseInt($(this).attr("data-ref-idx")) - 2;
            	
            	$(this).find("p").bind("click", function() {
            		common.wlog("home_planshop_banner" + dataIdx);
                });
            	
            	$(this).find("ul.goods li").children("a").each(function(goodsIdx) {
                   $(this).bind("click", function() {
                	   common.wlog("home_planshop_banner" + dataIdx + "_" + (goodsIdx + 1));
                   });
                });
            });
            
            //중단띠배너
            $(".band-Banner.bottom_banner").bind("click", function() {
                common.wlog("home_middlebanner");
            });

            //온리원
            $("#mHome-onlyone li").each(function(idx) {
            	$(this).bind("click", function() {
	                common.wlog("home_onlyone_banner" + (idx + 1));
            	});
            });
            //추천상품
            $(".mlist1v-goods.recommend_goods li").each(function(idx) {
                $(this).find("a.goodsList").bind("click", function() {
                    common.wlog("home_recommend_goods" + (idx + 1));
                });
            });
            
            // 추천상품 DS 리뉴얼 - [3383750] (메인 페이지 개편) OY추천상품 개선 건(CSH)
            $(".oy-recomm-prod .prod-inner").each(function(idx) {
                $(this).find("a.goodsList").bind("click", function() {
                    common.wlog("home_recommend_goods" + (idx + 1));
                });
            });
            
            
            //전문관
            // [3336018] (메인 페이지 개편) 전문관 개선 건 - UI 개선으로 클릭이벤트 select 변수 수정(CHY)
            $("#mlist-Jeonmungwan li").each(function(idx) {
                $(this).bind("click", function() {
                    common.wlog("home_special_banner" + (idx + 1));
                });
            });
            //카테고리베스트3
            //카테고리베스트목록은 베스트 목록 조회에서 처리함.
            try{
            	// isRenewal = "A";
            	if($("#mSub1s-menu-new")[0]){
            		 // TO-BE
            		$("#mSub1s-menu-new ul li").bind("click", function() {
                        common.wlog("home_catebest_new_tab" + (parseInt($(this).attr("data-ref-idx")) + 1));
                    });
            		//더보기
                    $(".main-cate-rank .link-best").bind("click", function() {
                        common.wlog("home_catebest_new_tab" + (parseInt($("#mSub1s-menu-new ul li.active").attr("data-ref-idx")) + 1) + "_more");
                    });
          	     }
            	
            	// isRenewal = "B";
          		 if($("#mSub1s-menu")[0]){
                     // AS-IS
                     $("#mSub1s-menu ul li").bind("click", function() {
                         common.wlog("home_catebest_tab" + (parseInt($(this).attr("data-ref-idx")) + 1));
                     });
                     //더보기
                     $(".mlist5v-goods.bestList .btnLinkMore2").bind("click", function() {
                         common.wlog("home_catebest_tab" + (parseInt($(mmain.home.getMSub1sMenuId() + " ul li.on").attr("data-ref-idx")) + 1) + "_more");
                     });
          	     }
          		 
          	 }catch(e){}
            //
            
            // 2020-09-24 인기브랜드 ds 코드 수정  
            //인기브랜드
            $("#mSub2s-menu-new ul li").bind("click", function() {
                common.wlog("home_brand_tab" + (parseInt($(this).attr("data-ref-idx")) + 1));
            });
            //인기브랜드 상품
            $(".prod-wrap.brndList").each(function(idx) {
                var brndIdx = parseInt($("#mSub2s-menu-new ul li[data-ref-brndNo='" + $(this).attr("data-ref-brndNo") + "']").attr("data-ref-idx")) + 1;
                //브랜드 상품
                $(this).find(".prod-inner").each(function(goodsIdx) {
                   $(this).bind("click", function() {
                       common.wlog("home_brand_tab" + brndIdx + "_goods" + (goodsIdx + 1));
                   });
                });
                //브랜드 더보기
                $(this).find(".banner").find('a').bind("click", function() {
                    common.wlog("home_brand_tab" + brndIdx + "_more");
                });
            });
            ///////

            //추천상품
            $(".mlist1v-goods.mlist-home li").each(function(idx) {
                $(this).find("a.goodsList").bind("click", function() {
                    common.wlog("home_rapid_goods" + (idx + 1));
                });
            });

            //BI Renewal. 20190918. nobbyjin. - 퀵메뉴 DataStory 추가
            $(".quick-menu ul li a").bind("click", function() {
                common.wlog($(this).attr("data-ref-menuId"));
            });
            
            /* [3335996] (메인 페이지 개편) 상단 띠배너 개선 건(CHY) */
            //홈 띠배너(MC) - 전시순서1 배너
            $("#mBand-banner1").bind("click", function() {
                common.wlog("home_newbanner_banner1");
            });
            
            //홈 띠배너(MC) - 전시순서2 배너
            $("#mBand-banner2").bind("click", function() {
                common.wlog("home_newbanner_banner2");
            });
            
            //홈 띠배너(MC) - 전시순서3 배너
            $("#mBand-banner3").bind("click", function() {
                common.wlog("home_newbanner_banner3");
            });
            // [3383769] (메인 페이지 개편) 올알랭 신규 건 (CSH)
            $(".allalain .prd-cont").each(function(index) {
                // 메인상품 매핑
            	$(this).find(".main-item .prd-detail").bind("click", function() {
                    common.wlog("home_allalain_goods" + (index + 1));
                });
                //조합상품 매핑	
                $(this).find(".sub-item").each(function(sub_index){
                    $(this).find(".allalainGoodsList").bind("click", function() {
                        common.wlog("home_allalain_goods" + (index + 1) + "_sub" +(sub_index + 1));
                    });
                });
            });
        }

    },

    //메인 비쥬얼 인디게이터
    pagingLoad : function(){
        var _bulStop = $('.mHome-visual .control_box');
        var _bulDot = $('.mHome-visual .control_box .paging span');
        var _bulDotWt = (100/(_bulDot.length))+'%';
        _bulDot.css('width', _bulDotWt);
    }
};

$.namespace("mmain.planshop");
mmain.planshop = {
    nextPageIdx : 1,
    wlogBannerCnt :  0 ,

    init : function() {
    	
    	console.log("[mmain.planshop.init]");
    	
    	let tabClass = "#main-swiper-tab4" + " ";
    	
        var that = this;
        //상단 서브 gnb 스와이프 init
        mmain.subGnb.init(4);

        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        var startIdx = 1;
        if ($(tabClass+"#mContents").attr("data-ref-pageIdx") != undefined && $(tabClass+"#mContents").attr("data-ref-pageIdx") != "") {
            startIdx = parseInt($(tabClass+"#mContents").attr("data-ref-pageIdx"));
        }

        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        mmain.planshop.getPlanShopPagingAjax(startIdx);

        //서브 메뉴바 바인드 처리
        mmain.planshop.subCtgBindEvent();

        mmain.planshop.goDetailPage();

        //웹로그 바인딩
        setTimeout(function() {
            mmain.planshop.bindWebLog();
        }, 700);
    },

    getPlanShopPagingAjax : function(startIdx) {
        //연속키 방식
        PagingCaller.init({
            callback : function(){
            	
            	let tabClass = "#main-swiper-tab4" + " ";

                var fltDispCatNo = $(tabClass+"#mSubGnb ul li.on a").attr("data-ref-dispCatNo");

                mmain.planshop.nextPageIdx = PagingCaller.getNextPageIdx();

                var param = {
                    pageIdx : mmain.planshop.nextPageIdx,
                    fltCondition : "01",
                    fltDispCatNo : (fltDispCatNo == undefined || fltDispCatNo == null) ? "" : fltDispCatNo
                };

                //미리보기 파라미터 추가
                mmain.menu.setPreviewParam(param);

                common.Ajax.sendRequestSton( // planshop
                        "GET"
                        , _baseUrl + "main/getPlanShopPagingAjax.do"
                        , param
                        , mmain.planshop.getPlanShopPagingAjaxCallback
                        , null
                        , mmain.main.stonUseYn        
                );

                $(tabClass+"#mContents").attr("data-ref-pageIdx", param.pageIdx);
            }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
        });
    },

    /**
     * 서브카테고리 클릭 시 처리
     */
    subCtgBindEvent : function() {
    	
    	let tabClass = "#main-swiper-tab4" + " ";
    	
        $(tabClass+"#mSubGnb").find("li").each(function() {
            $(this).find("a").click(function() {
                $(document).scrollTop(0);

                $(tabClass+".mlist2v-goods").empty();
                //페이징 콜러 제거
                PagingCaller.destroy();

                //  loadingLayer
                common.showLoadingLayer(false);

                mmain.planshop.getPlanShopPagingAjax(0);

            });
        });

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
        }, 100);
    },

    getPlanShopPagingAjaxCallback : function(res) {
    	
    	let tabClass = "#main-swiper-tab4" + " ";

        if (res.trim() == '' || mmain.planshop.nextPageIdx > 7) {
            //스크롤 이벤트 제거
            PagingCaller.destroy();

        } else {
            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $(tabClass+".mlist2v-goods").append(res);

            //아이콘 정리
            $(tabClass+".mlist2v-goods.plan").find("li").each(function() {
                if ($(this).find("div.goods a .icon span").length < 1) {
                    $(this).find("div.goods a .icon").remove();
                }
            });

            mmain.main.setLazyLoad();

            //기획전 상세이동 바인드
            mmain.planshop.goDetailPage();

            setTimeout(function() {
                //링크 처리
                common.bindGoodsListLink();
            }, 100);

            //웹로그 바인딩
            setTimeout(function() {
                mmain.planshop.bindWebLog();
            }, 700);
        }

//        sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

        //loadingLayer
        common.hideLoadingLayer();
    },


    goDetailPage : function(){
        $(".plan").find("li").each(function() {
            $(this).find("a").bind("click", function() {
                common.link.movePlanShop($(this).attr("data-ref-dispCatNo"));
            });
        });
    },

    getPlanShopDetailAjax : function(dispCatNo) {
        common.Ajax.sendRequestSton( // planshop
                "GET"
                , _baseUrl + "main/getPlanShopAjax.do"
                , "dispCatNo="+ dispCatNo + mmain.menu.getPreviewParam("&")
                , mmain.planshop.getPlanShopAjaxCallback
                , null
                , mmain.main.stonUseYn        
        );
    },

    getPlanShopAjaxCallback : function(strData) {
    	
    	let tabClass = "#main-swiper-tab4" + " ";
    	
        var arrData = strData;
        var count = arrData.length;
        $(tabClass+"#planshop").empty().append(arrData);
    },

    removePlanShopAttr : function() {
    	let tabClass = "#main-swiper-tab4" + " ";
    	
        $(tabClass+"#planshop").empty();
    },

    /**
     * 웹로그 바인딩
     */
    bindWebLog : function() {
    	
    	let tabClass = "#main-swiper-tab4" + " ";
    	
        $(tabClass+".main_contents .plan li").each(function(planshopIdx){
            //기획전 배너 로그ID생성
            if($(this).find("#planShopBanner").attr("data-wlog-id") == undefined || $(this).find("#planShopBanner").attr("data-wlog-id") == null){
                mmain.planshop.wlogBannerCnt = planshopIdx + 1;
                $(this).find("#planShopBanner").attr("data-wlog-id" , "planshop_banner_" + mmain.planshop.wlogBannerCnt);
            }

            //기획전 배너 바인드
            $(this).find("#planShopBanner").bind('click', function(){
                common.wlog($(this).attr("data-wlog-id"));
            });

            //기획전 상품
            $(this).find(".goods a").each(function(goodsIdx){
                //기획전 상품 로그ID생성
                $(this).attr("data-wlog-id" , $(this).closest("li").find("#planShopBanner").attr("data-wlog-id") + "_" + ++goodsIdx);
                //기획전 상품 바인드
                $(this).bind('click', function() {
                    common.wlog($(this).attr("data-wlog-id"));
                });
            });
        });
    }
};

$.namespace("mmain.onlyone");
mmain.onlyone = {
    nextPageIdx : 1,
    autoFlag : true,
    pagerFlag : true,
    wlogGoodsCnt :  0,

    init : function(){
    	
    	console.log("[mmain.onlyone.init]");

        if($(".mSlider-area > li").size() == 1){
            mmain.onlyone.autoFlag = false;
            mmain.onlyone.pagerFlag = false;
        }

        //Swipe
        mmain.onlyone.setSwipe();
        //클릭이벤트 바인드
        mmain.onlyone.bindEvent();

        //찜 처리 초기화
        common.wish.init();

        var startIdx = 1;
        if ($("#mContents").attr("data-ref-pageIdx") != undefined && $("#mContents").attr("data-ref-pageIdx") != "") {
            startIdx = parseInt($("#mContents").attr("data-ref-pageIdx"));
        }

        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        mmain.onlyone.getOnlyOnePagingAjax(startIdx);

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
        }, 100);

        //웹로그 바인딩
        setTimeout(function() {
            mmain.onlyone.bindWebLog();
        }, 700);
    },

    bindEvent : function() {
        //슬라이드 기획전배너 클릭이벤트
        $(".mlist-promotion > .mSlider-area > li").bind('click', function(){
            var dispCatNo = $(this).attr("data-ref-dispCatNo");
            common.link.movePlanShop(dispCatNo);
        });

        //브랜드배너 클릭이벤트
        $(".mlist-brand > li > a:not(:eq(7))").bind('click', function(){
            var onlBrndCd = $(this).attr("data-ref-dispContsNo");
            common.link.moveBrandShop(onlBrndCd);
        });

        //브랜드 더보기 클릭
        $(".mlist-brand li a:eq(7)").bind('click',function(){
            //팝업 세팅
            mmain.onlyone.setBrandPopup();

            common.popLayerOpen("LAYERPOP01");
        });
    },

    setBrandPopup : function(){
        var brandCnt = $(".mlist-brand li a[data-ref-dispContsNo]").size();
        var innerLiSet = "";
        var liCnt = 1;

        for(var i = 0; i < brandCnt; i++){
            if(liCnt == 1){
                innerLiSet += "<li>";
            }

            innerLiSet += $(".mlist-brand li a[data-ref-dispContsNo]").eq(i).clone().wrapAll('<div/>').parent().html();

            if(liCnt == 3){
                innerLiSet +="</li>";
                liCnt = 0;
            }
            liCnt++;
        }

        var innerHtml = "<ul class='listBrandLink'>" + innerLiSet + "</ul>";

        $(".popLayerWrap .popLayerArea .popInner .popContainer .popCont").html(innerHtml);
        $(".popLayerWrap .popLayerArea .popInner .popHeader .popTitle").text("브랜드를 선택해주세요.");

        //브랜드 더보기 > 브랜드배너 클릭이벤트
        $(".listBrandLink li a").bind('click', function(){
            var onlBrndCd = $(this).attr("data-ref-dispContsNo");
            common.link.moveBrandShop(onlBrndCd);
        });
    },

    //온리원 하단 1단형 상품영역 페이징
    getOnlyOnePagingAjax : function(startIdx, dispCatNo) {
        //연속키 방식
        PagingCaller.init({
            callback : function(){
                mmain.onlyone.nextPageIdx = PagingCaller.getNextPageIdx();

                var param = {
                    pageIdx : mmain.onlyone.nextPageIdx,
                    fltCondition : "01",
                    fltDispCatNo : (dispCatNo == undefined || dispCatNo == null) ? "" : dispCatNo
                };

                //미리보기 파라미터 추가
                mmain.menu.setPreviewParam(param);

                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "main/getOnlyOnePagingAjax.do"
                        , param
                        , mmain.onlyone.getOnlyOnePagingAjaxCallback);

                $("#mContents").attr("data-ref-pageIdx", param.pageIdx);
            }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
        });
    },

    getOnlyOnePagingAjaxCallback : function(res) {

        //최대 100개 온리원 상품 페이징 조회
        if (res.trim() == "" || mmain.onlyone.nextPageIdx > 10) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();

        } else {
            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $(".onlyone-hit").next().append(res);

            mmain.main.setLazyLoad();

            //찜 체크 처리.
            common.wish.checkWishList();

            setTimeout(function() {
                //링크 처리
                common.bindGoodsListLink();
            }, 100);

            setTimeout(function() {
                //인기급상승 상품
                $(".onlyone-hit").next().find("li").each(function(goodsIdx){
                    if($(this).find("a").attr("data-wlog-id") == undefined || $(this).find("a").attr("data-wlog-id") == null){
                        mmain.onlyone.wlogGoodsCnt = goodsIdx + 1;
                        $(this).find("a").attr("data-wlog-id", "onlyone_goods_" + mmain.onlyone.wlogGoodsCnt);
                    }

                    $(this).find("a").bind('click', function(){
                        common.wlog($(this).attr("data-wlog-id"));
                    });
                });
            }, 100);
        }

//        sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

        //loadingLayer
        common.hideLoadingLayer();
    },

    setSwipe : function(){
        if (mmain.onlyone.autoFlag) {
            var only_set = {
                    slidesPerView: 1,
                    slidesPerView: 1,
                    autoplay: 2500,
                    pagination: '.paging',
                    paginationClickable: true,
                    freeMode: false,
                    spaceBetween: 0,
                    loop: true
                }, only_swiper = Swiper('.mlist-promotion', only_set );
        }
    },

    /**
     * 웹로그 바인딩
     */
    bindWebLog : function() {
        //기획전 배너
        $(".mlist-promotion .mSlider-area").find(".swiper-slide:not(.swiper-slide-duplicate)").each(function(planshopIdx){
            $(this).bind('click', function(){
                common.wlog("onlyone_planshop_" + (planshopIdx + 1));
            });
        });

        //브랜드
        $(".mlist-brand").find("a:not(.more)").each(function(brandIdx){
            $(this).bind('click', function(){
                common.wlog("onlyone_brand_" + (brandIdx + 1));
            });
        });

        //브랜드 더보기
        $(".mlist-brand").find("a.more").bind('click', function(){
            common.wlog("onlyone_brand_more");
        });

        //섹션
        $(".link-tit").closest("ul").find("li").each(function(sectIdx){
            var tmpSectIdx = sectIdx + 1;

            //섹션 타이틀
            $(this).find(".link-tit span a").bind('click', function(){
                common.wlog("onlyone_section_" + tmpSectIdx);
            });

            //섹션 상품
            $(this).find("a").each(function(goodsIdx){
                $(this).bind('click', function(){
                    common.wlog("onlyone_section_" + tmpSectIdx + "_" + (goodsIdx + 1));
                });
            })
        });

        //띠배너
        $(".md-banner").find("a").bind('click', function(){
            common.wlog("onlyone_banner");
        });

        //인기급상승 상품
        $(".onlyone-hit").next().find("li").each(function(goodsIdx){
            if($(this).find("a").attr("data-wlog-id") == undefined || $(this).find("a").attr("data-wlog-id") == null){
                mmain.onlyone.wlogGoodsCnt = goodsIdx + 1;
                $(this).find("a").attr("data-wlog-id", "onlyone_goods_" + mmain.onlyone.wlogGoodsCnt);
            }

            $(this).find("a").bind('click', function(){
                common.wlog($(this).attr("data-wlog-id"));
            });
        });
    }
};

$.namespace("mmain.sale");
mmain.sale = {

    init : function() {
    	
    	console.log("[mmain.sale.init]");

        //2depth 서브 gnb 메뉴로 인해 클래스 변경
        $("#mSubGnb").removeClass("fixed_gnb");

        if ($("#mSubGnb ul").length < 1) {
            mmain.sale.getSaleSubCategoryBarAjax();
        } else {
            mmain.sale.getSaleSubCategoryBarBindEvent();
        }


        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        var startIdx = 1;
        if ($("#mContents").attr("data-ref-pageIdx") != undefined && $("#mContents").attr("data-ref-pageIdx") != "") {
            startIdx = parseInt($("#mContents").attr("data-ref-pageIdx"));
        }
        mmain.sale.getSalePagingAjax(startIdx);
        common.setLazyLoad();

        mmain.sale.bindEvent();
        mmain.sale.bindWebLog();

        common.wish.init();
    },

    bindWebLog : function() {
        $("#mTab li[data-ref-dispcatno='900000100090001']").click(function() {
            common.wlog("sale_popular_tab");
        });
        $("#mTab li[data-ref-dispcatno='900000100090002']").click(function() {
            common.wlog("sale_more_tab");
        });
    },

    bindEvent : function() {
        //탭 컨텐츠 show/hide
        $('#mTab').find('a').bind("click", function(e){
            $(document).scrollTop(0);

            e.preventDefault();
            $("#mTab li").removeAttr("class");
            $(this).parent().attr("class", "on");

            mmain.sale.getSaleSubCategoryBarAjax();

            mmain.sale.selDefaultCat();
        });

        $(".sub_gnb_cate li a").bind("click", function() {
            $("#mFixTab").removeClass();

            //페이징 콜러 제거
            PagingCaller.destroy();

            $(".mlist1v-goods").empty();

            mmain.sale.getSalePagingAjax(0);

            //loadingLayer
            common.showLoadingLayer(false);
        });

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
//            $(".goodsList").bind("click", function(e) {
//                e.preventDefault();
//                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//            });

//            $(".goodsList").removeClass("goodsList");
        }, 100);

    },

    /**
     * 기본 카테고리 선택 처리
     */
    selDefaultCat : function() {
        $(".sub_gnb_cate li").removeClass("on");
        $(".sub_gnb_cate li a[data-ref-dispCatNo='']").click();
    },

    getSaleSubCategoryBarAjax : function() {
        var dispCatNo = $("#mTab li.on").attr("data-ref-dispCatNo");

      //코드 완료 후 스토어 정보 조회
        var param = {
            dispCatNo : dispCatNo
        }
        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "main/getSaleSubCategoryBarAjax.do"
                , param
                , mmain.sale.getSaleSubCategoryBarAjaxCallback);

    },

    getSaleSubCategoryBarAjaxCallback : function(res) {
        $("#mSubGnb").html(res);

        mmain.sale.getSaleSubCategoryBarBindEvent();
    },

    getSaleSubCategoryBarBindEvent : function() {
        //상단 서브 gnb 스와이프 init
        mmain.subGnb.init();

        $(".sub_gnb_cate li a").bind("click", function() {
            $("#mFixTab").removeClass();

            //페이징 콜러 제거
            PagingCaller.destroy();

            $(".mlist1v-goods").empty();

            mmain.sale.getSalePagingAjax(0);

            //loadingLayer
            common.showLoadingLayer(false);
        });
    },

    getSalePagingAjax : function(startIdx) {

        var fltDispCatNo = $("#mSubGnb ul li.on a").attr("data-ref-dispCatNo");
        var dispCatNo = $("#mTab li.on").attr("data-ref-dispCatNo");

        //연속키 방식
        PagingCaller.init({
            callback : function(){
                //코드 완료 후 스토어 정보 조회
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx(),
                    dispCatNo : dispCatNo,
                    fltDispCatNo : (fltDispCatNo == undefined || fltDispCatNo == null) ? "" : fltDispCatNo
                }
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "main/getSalePagingAjax.do"
                        , param
                        , mmain.sale.getSalePagingAjaxCallback);

                $("#mContents").attr("data-ref-pageIdx", param.pageIdx);
            }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
        });
    },

    getSalePagingAjaxCallback : function(res) {
        //페이지당 20개, 5페이지 이상 조회 시 destroy
        if (res.trim() == '') {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();

        } else {
            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $(".mlist1v-goods").append(res);

            //BI Renewal. 20190918. nobbyjin. lazyLoad 분리
            //mmain.main.setLazyLoad();
            common.setLazyLoad();

            if (PagingCaller.getCurPageIdx() >= 5) {
                //마지막 목록임- 스크롤 이벤트 제거
                PagingCaller.destroy();
            }
        }
        //loadingLayer
        common.hideLoadingLayer();

        setTimeout(function() {

            //BI Renewal. 20190918. nobbyjin. sessionStorage 제외
            //sessionStorage.setItem("saved_slide_html", $('#mContainer').html());

            //링크 처리
            common.bindGoodsListLink();
//            $(".goodsList").bind("click", function(e) {
//                e.preventDefault();
//                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//            });

            common.wish.checkWishList();
//            $(".goodsList").removeClass("goodsList");
        }, 100);


    },


};

$.namespace("mmain.quick");
mmain.quick = {

    init : function() {
    	
    	console.log("[mmain.quick.init]");

        //2depth 서브 gnb 메뉴로 인해 클래스 변경
        $("#mSubGnb").removeClass("fixed_gnb");

        if ($("#mSubGnb ul").length < 1) {
            mmain.quick.getQuickSubCategoryBarAjax();
        } else {
            mmain.quick.getQuickSubCategoryBarBindEvent();
        }


        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        var startIdx = 1;
        if ($("#mContents").attr("data-ref-pageIdx") != undefined && $("#mContents").attr("data-ref-pageIdx") != "") {
            startIdx = parseInt($("#mContents").attr("data-ref-pageIdx"));
        }
        mmain.quick.getQuickPagingAjax(startIdx);

        mmain.quick.bindEvent();
        mmain.quick.bindWebLog();

        common.wish.init();
    },

    bindWebLog : function() {
        $("#mTab li[data-ref-dispcatno='900000100090001']").click(function() {
            common.wlog("sale_popular_tab");
        });
        $("#mTab li[data-ref-dispcatno='900000100090002']").click(function() {
            common.wlog("sale_more_tab");
        });
    },

    bindEvent : function() {
        //탭 컨텐츠 show/hide
        $('#mTab').find('a').bind("click", function(e){
            $(document).scrollTop(0);

            e.preventDefault();
            $("#mTab li").removeAttr("class");
            $(this).parent().attr("class", "on");

            mmain.quick.getQuickSubCategoryBarAjax();

            mmain.quick.selDefaultCat();
        });

        $(".sub_gnb_cate li a").bind("click", function() {
            $("#mFixTab").removeClass();

            //페이징 콜러 제거
            PagingCaller.destroy();

            $(".mlist2v-goods").empty();

            mmain.quick.getQuickPagingAjax(0);

            //loadingLayer
            common.showLoadingLayer(false);
        });

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
//            $(".goodsList").bind("click", function(e) {
//                e.preventDefault();
//                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//            });

//            $(".goodsList").removeClass("goodsList");
        }, 100);

    },

    /**
     * 기본 카테고리 선택 처리
     */
    selDefaultCat : function() {
        $(".sub_gnb_cate li").removeClass("on");
        $(".sub_gnb_cate li a[data-ref-dispCatNo='']").click();
    },

    getQuickSubCategoryBarAjax : function() {
        var dispCatNo = $("#mTab li.on").attr("data-ref-dispCatNo");

      //코드 완료 후 스토어 정보 조회
        var param = {
            dispCatNo : dispCatNo
        }
        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "main/getQuickSubCategoryBarAjax.do"
                , param
                , mmain.quick.getQuickSubCategoryBarAjaxCallback);

    },

    getQuickSubCategoryBarAjaxCallback : function(res) {
        $("#mSubGnb").html(res);

        mmain.quick.getQuickSubCategoryBarBindEvent();
    },

    getQuickSubCategoryBarBindEvent : function() {
        //상단 서브 gnb 스와이프 init
        mmain.subGnb.init();

        $(".sub_gnb_cate li a").bind("click", function() {
            $("#mFixTab").removeClass();

            //페이징 콜러 제거
            PagingCaller.destroy();

            $(".mlist2v-goods").empty();

            mmain.quick.getQuickPagingAjax(0);

            //loadingLayer
            common.showLoadingLayer(false);
        });
    },

    getQuickPagingAjax : function(startIdx) {

        var fltDispCatNo = $("#mSubGnb ul li.on a").attr("data-ref-dispCatNo");
        var dispCatNo = $("#mTab li.on").attr("data-ref-dispCatNo");

        //연속키 방식
        PagingCaller.init({
            callback : function(){
                //코드 완료 후 스토어 정보 조회
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx(),
                    dispCatNo : dispCatNo,
                    fltDispCatNo : (fltDispCatNo == undefined || fltDispCatNo == null) ? "" : fltDispCatNo
                }
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "main/getQuickPagingAjax.do"
                        , param
                        , mmain.quick.getQuickPagingAjaxCallback);

                $("#mContents").attr("data-ref-pageIdx", param.pageIdx);
            }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
        });
    },

    getQuickPagingAjaxCallback : function(res) {
        //페이지당 20개, 5페이지 이상 조회 시 destroy
        if (res.trim() == '') {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();

        } else {
            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $(".mlist2v-goods").append(res);

            mmain.main.setLazyLoad();

            if (PagingCaller.getCurPageIdx() >= 5) {
                //마지막 목록임- 스크롤 이벤트 제거
                PagingCaller.destroy();
            }
        }
        //loadingLayer
        common.hideLoadingLayer();

        setTimeout(function() {

            //BI Renewal. 20190918. nobbyjin. sessionStorage 제외
            //sessionStorage.setItem("saved_slide_html", $('#mContainer').html());

            //링크 처리
            common.bindGoodsListLink();
//            $(".goodsList").bind("click", function(e) {
//                e.preventDefault();
//                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//            });

            common.wish.checkWishList();
//            $(".goodsList").removeClass("goodsList");
        }, 100);


    }


};

$.namespace("mmain.newquick");
mmain.newquick = {

    init : function() {
    	
    	console.log("[mmain.newquick.init]");

        mmain.newquick.setSwipe();
        mmain.newquick.bindEvent();
        mmain.newquick.bindWebLog();

        common.wish.init();

        //BI Renewal. 20190918. nobbyjin. - LazyLoad 적용
        common.setLazyLoad();
    },

    setSwipe : function() {
      //오늘드림 전문관
        var only_set = {
            slidesPerView: 1,
            autoplay: 5000,
            pagination: '.paging',
            autoplayDisableOnInteraction: false,
            paginationClickable: true,
            freeMode: false,
            spaceBetween: 0,
            loop: true,
            onImagesReady:function(swiper){
                var _slideItem = $('.today_promotion .swiper-slide'),
                _slideH = _slideItem.find('img').height();
                _slideItem.css('height', _slideH);
            }
        }, only_swiper = Swiper('.today_promotion', only_set );
    },

    bindWebLog : function() {
        $("#mTab li[data-ref-dispcatno='900000100090001']").click(function() {
            common.wlog("sale_popular_tab");
        });
        $("#mTab li[data-ref-dispcatno='900000100090002']").click(function() {
            common.wlog("sale_more_tab");
        });
    },

    bindEvent : function() {

        //링크 처리
        $("img[data-ref-link-url]").bind("click", function() {
            mmain.menu.setPagePos();
            location.href = $(this).attr("data-ref-link-url");
        });

        $("li[data-ref-link-url]").bind("click", function() {
            mmain.menu.setPagePos();
            location.href = $(this).attr("data-ref-link-url");
        });

        //슬라이드 배너 클릭이벤트
        $(".today_promotion > .mSlider-area > li").bind('click', function(){
            //var dispCatNo = $(this).attr("data-ref-dispCatNo");
            //common.link.movePlanShop(dispCatNo);
        });

        $(".theme_list li").bind('click',function(){

            var liWrap = $(this);
            var moreFlag = "";

            var dispContCd = "";
            var themeIdx = 0;
            var themeNm = "";

            moreFlag = $(this).attr("class");

            // 더보기 클릭인경우
            if(moreFlag == "more"){
                mmain.newquick.setThemePopup();

                common.popLayerOpen("QUICKLAYERPOP");
            } else {

                dispContCd =  $("a", liWrap).attr("data-ref-dispContsNo");
                themeIdx = $(".theme_list > ul> li").index(this);
                themeNm = $("a > em", liWrap).text();

                themeType = $("a", liWrap).closest("li").attr("class");

                if(themeType == "all"){
                    mmain.newquick.goQuickListMove(dispContCd, themeNm, "ALL");
                } else {
                    mmain.newquick.goQuickListMove(dispContCd, themeNm, "ONE");
                }
            }

        });

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
//            $(".goodsList").bind("click", function(e) {
//                e.preventDefault();
//                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//            });

//            $(".goodsList").removeClass("goodsList");
        }, 100);

    },

    setThemePopup : function(){
        var themeCnt = $(".submain-today .theme_list li").size();
        var innerLiSet = "";
        var liCnt = 1;


        var moreFlag = "";


        for(var i = 0; i < themeCnt; i++){

            moreFlag = $(".submain-today .theme_list li").eq(i).attr("class");

            // more인경우는 더보기이기 때문에 레이어팝업시에 사용하지 않음
            if(moreFlag != "more"){
                // 전체인 경우에는 클래스에 all이 추가되어야함
                if(moreFlag == "all"){
                    innerLiSet += "<li class='all'>";
                } else {
                    innerLiSet += "<li>";
                }

                innerLiSet += $(".submain-today .theme_list li").eq(i).html();

                innerLiSet +="</li>";
            }
        }

        var innerHtml = "<div class='theme_list popup'><ul class='inner clrfix'>" + innerLiSet + "</ul></div>";

        $(".popLayerWrap .popLayerArea .popInner .popContainer .popCont").html(innerHtml);
        $(".popLayerWrap .popLayerArea .popInner .popHeader .popTitle").text("테마를 선택해주세요.");

        //테마 더보기 > 테마배너 클릭이벤트
        $("#QUICKLAYERPOP .theme_list ul > li").bind('click', function(){
            var liWrap = $(this);

            var dispContCd = $("a", liWrap).attr("data-ref-dispContsNo");

            var themeIdx = $("#QUICKLAYERPOP .theme_list > ul> li").index(this);

            var themeNm = $("a > em", liWrap).text();

            // 0번 테마는 무조건 전체보기임...
            // 아이폰에서 뒤로가기시 레이어가 계속 떠있기 때문에 페이지 이동시 레이어 팝업 닫음
            if(themeIdx == 0){
                mmain.newquick.goQuickListMove(dispContCd, themeNm, "ALL");
            } else {
                mmain.newquick.goQuickListMove(dispContCd, themeNm, "ONE");
            }
        });
    }
    , goQuickListMove : function(themeNo, themeNm, themeType){

        common.link.moveQuickListUrl(themeNo, themeNm, themeType);

        return false;

    }
    , introImg : function(obj){
        obj.src = _imgUrl + "product/ban_today_notice.jpg";
        obj.onerror = '';
    }
};

$.namespace("mmain.best");
mmain.best = {
        init : function() {
        	
        	console.log("[mmain.best.init]");
        	
        	let tabClass = "#main-swiper-tab3" + " ";
        	
            var count = 0;
            //판매베스트 상품 1~100
            $(document).on("click",".goodsList",function(e){
                count = $(this).attr("data-ref-rnk");
                common.wlog("best_category_tab_goods" + count);
            });
            
            //리뷰베스트 상품 1~100
            $(document).on("click",".review_best_thumb",function(e){
                count = $(this).attr("data-ref-rnk");
                common.wlog("best_goods_tab_r" + count);
            });
            
            //오늘의 도움 리뷰 5
            $('#mReviewTop > li').click(function(){
                var count =  $( "#mReviewTop > li" ).index(this) + 1;
                common.wlog("best_goods_tab_review" + count);
            });

            //2depth 서브 gnb 메뉴로 인해 클래스 변경
            $(tabClass+"#mSubGnb").removeClass("fixed_gnb");
            //상단 서브 gnb 스와이프 init
            var dispCatNo = $(tabClass+"#mTab li.on").attr("data-ref-dispCatNo");
            if(dispCatNo == '900000100100002'){
                // 리뷰 베스트
                $(tabClass+"#mContents").addClass("subTop");
                $(tabClass+"#mSubGnb").hide();
                // selectbox의 경우 session에 저장된 html에는 selected 여부가 저장이 안되기 때문에 클래스로 selected 처리
                var initSubGnbSelected = $(".sub_gnb_cate_select option.on").attr("data-ref-dispCatNo");
                $(".sub_gnb_cate_select option[data-ref-dispCatNo='" + initSubGnbSelected + "']").prop("selected","selected");
                // 리뷰 베스트 스와이프 처리
                mmain.best.reviewBestSwipe();
            }else{
                // 판매 베스트
                $(tabClass+"#mContents").removeClass("subTop");
                $(tabClass+"#mSubGnb").show();
                mmain.subGnb.init(3);
            }

            mmain.best.bindEvent();
            mmain.best.bindWebLog();

            var gnbSubCatNo = sessionStorage.getItem("gnb_sub_cat_no");


            var startIdx = 1;
            if ($(tabClass+"#mContents").attr("data-ref-pageIdx") != undefined && $(tabClass+"#mContents").attr("data-ref-pageIdx") != "") {
                startIdx = parseInt($(tabClass+"#mContents").attr("data-ref-pageIdx"));
            }

            if (!common.isEmpty(gnbSubCatNo)) {
                if(gnbSubCatNo == "0" || gnbSubCatNo == "1"){
                    // tabIdx 로 들어올 경우
                    $(tabClass+"#mFixTab ul li").removeClass("on");
                    $(tabClass+"#mFixTab ul li").eq(gnbSubCatNo).addClass("on");

                    
                    // 2020-07-16  #3_1등. asis 오류 수정 START
                    dispCatNo = $(tabClass+"#mTab li.on").attr("data-ref-dispCatNo"); 
                    // END
                    
                    if(dispCatNo == '900000100100002'){
                        // 리뷰 베스트
                        $(tabClass+".sub_gnb_cate_select option").eq(0).prop("selected","selected").trigger("change");
                        
                        // 2020-07-16  asis 오류 수정 START
                        mmain.best.reviewBestSwipe();
                        sessionStorage.removeItem("gnb_sub_cat_no");
                        setTimeout(function() {
                        	$(document).scrollTop(0);
                        }, 100);
                        // END
                        
                    }else{
                        // 판매 베스트
                        $(tabClass+".sub_gnb_cate li a").eq(0).click();
                    }
                } else {
                    // 카테고리 베스트 더보기로 들어올 경우
                    $(tabClass+"#mSubGnb ul li a[data-ref-dispCatNo='" + gnbSubCatNo + "']").click();
                    sessionStorage.removeItem("gnb_sub_cat_no");
                }
            } else {
                //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                mmain.best.getBestPagingAjax(startIdx);
            }

            /* 리뷰 베스트 상품 클릭 */
            $(document).on("click",".review_best_thumb",function(e){

                e.preventDefault();
                var goodsNo = $(this).attr("data-ref-goodsNo");
                var dispCatNo = $(this).attr("data-ref-dispCatNo");
                // trackingCd 변수 추가 - [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY)
                var trackingCd = $(this).attr("name");
                common.link.moveGoodsDetailTab(goodsNo, dispCatNo, 2, trackingCd);
            });
        },


        bindWebLog : function() {
        	
        	let tabClass = "#main-swiper-tab3" + " ";
        	
            $(tabClass+"#mTab li[data-ref-dispcatno='900000100100001']").click(function() {
                common.wlog("best_category_tab");
            });
            $(tabClass+"#mTab li[data-ref-dispcatno='900000100100002']").click(function() {
                common.wlog("best_goods_tab");
            });
        },

        bindEvent : function() {
        	
        	let tabClass = "#main-swiper-tab3" + " ";
        	
            //탭 컨텐츠 show/hide
            $(tabClass+'#mTab').find('a').bind("click", function(e){
                $(document).scrollTop(0);

                e.preventDefault();
                $(tabClass+"#mTab li").removeAttr("class");
                $(this).parent().attr("class", "on");
                mmain.best.selDefaultCat();
            });

            $(tabClass+".sub_gnb_cate li a").bind("click", function() {
                $(tabClass+"#mFixTab").removeClass();
                //페이징 콜러 제거
                PagingCaller.destroy();
                $(tabClass+".mlist2v-best").empty();
                $(tabClass+".mlist2v-best").attr("class", "mlist2v-best");

                /*  2017-03-17 상품평 베스트 탭 주석처리   */
                $(tabClass+".mlist2v-best").addClass($("#mTab li.on").attr("data-ref-class"));
                /*  //2017-03-17 상품평 베스트 탭 주석처리   */

                // 2017-03-17 카테고리베스트만 연결되도록 함 (추후 주석처리 해제시 삭제 요망)
                //$(".mlist2v-best").addClass($("#catBestSell").attr("data-ref-class"));

                //loadingLayer
                common.showLoadingLayer(false);

                mmain.best.getBestPagingAjax(0);

                // 상품평베스트 일 경우 반려동물 hidden 처리
                var dispCatNo = $("#mTab li.on").attr("data-ref-dispCatNo");
                if(dispCatNo == '900000100100002'){
                    $(tabClass+".swiper-slide").each(function() {
                        var subCategoryDispCatNo = $(this).children("a").attr("data-ref-dispcatno");
                        if(subCategoryDispCatNo == "10000030003"){
                            $(this).hide();
                        }
                    });

                } else {
                    $(tabClass+".swiper-slide").show();
                }

                mmain.subGnb.init(3);
            });

            $(tabClass+".sub_gnb_cate_select").bind("change", function() {
                $(tabClass+"#mFixTab").removeClass();

                // selectbox의 경우 session에 저장된 html에는 selected 여부가 저장이 안되기 때문에 클래스로 selected 처리
                $(tabClass+".sub_gnb_cate_select option").removeClass("on");
                $(tabClass+".sub_gnb_cate_select option:selected").addClass("on");
                //페이징 콜러 제거
                PagingCaller.destroy();
                $(tabClass+"#reviewBestUl").empty();

                //loadingLayer
                common.showLoadingLayer(false);

                mmain.best.getBestPagingAjax(0);
            });

            setTimeout(function() {
                //링크 처리
                var dispCatNo = $("#mTab li.on").attr("data-ref-dispCatNo");
                if(dispCatNo == '900000100100002'){
                    // 리뷰 베스트인 경우

                }else{
                    // 판매 베스트인 경우
                    common.bindGoodsListLink();
                }

//              $(".goodsList").bind("click", function(e) {
//                  e.preventDefault();
//                  common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//              });

//              $(".goodsList").removeClass("goodsList");
            }, 100);

        },

        /**
         * 기본 카테고리 선택 처리
         */
        selDefaultCat : function() {
        	
        	let tabClass = "#main-swiper-tab3" + " ";
        	
            var dispCatNo = $(tabClass+"#mTab li.on").attr("data-ref-dispCatNo");
            if(dispCatNo == '900000100100002'){
                // 리뷰 베스트
                $(tabClass+".sub_gnb_cate_select option").eq(0).prop("selected","selected").trigger("change");
                $(tabClass+".sub_gnb_cate li").removeClass("on");
                $(tabClass+".sub_gnb_cate li").eq(0).addClass("on");
                mmain.subGnb.init(3);

                // 리뷰 베스트 스와이프 처리
                mmain.best.reviewBestSwipe();
            }else{
                // 판매 베스트
                $(tabClass+".sub_gnb_cate li").removeClass("on");
                $(tabClass+".sub_gnb_cate li").eq(0).addClass("on");
                $(tabClass+".sub_gnb_cate li a[data-ref-dispCatNo='']").click();
            }
        },

        getBestPagingAjax : function(startIdx) {
            
        	let tabClass = "#main-swiper-tab3" + " ";
        	
            /*  2017-03-17 상품평 베스트 탭 주석처리   */
            var dispCatNo = $(tabClass+"#mTab li.on").attr("data-ref-dispCatNo");
            var fltDispCatNo = $(tabClass+"#mSubGnb ul li.on a").attr("data-ref-dispCatNo");
            if(dispCatNo == '900000100100002'){
                // 리뷰 베스트
                fltDispCatNo = $(tabClass+".sub_gnb_cate_select option:selected").attr("data-ref-dispCatNo");
            }

            // 2017-03-17 카테고리베스트만 연결되도록 함 (추후 주석처리 해제시 삭제 요망)
            //var dispCatNo = $("#catBestSell").attr("data-ref-dispCatNo");
            /*  //2017-03-17 상품평 베스트 탭 주석처리   */


            if (startIdx < 2) {
                //연속키 방식
                PagingCaller.init({
                    callback : function(){
                        //코드 완료 후 스토어 정보 조회
                        var param = {
                            pageIdx : PagingCaller.getNextPageIdx(),
                            dispCatNo : dispCatNo,
                            rowsPerPage : 50,
                            fltDispCatNo : (fltDispCatNo == undefined || fltDispCatNo == null) ? "" : fltDispCatNo
                        }
                        
                        common.Ajax.sendRequestSton( // best
                                "GET"
                                , _baseUrl + "main/getBestPagingAjax.do"
                                , param
                                , mmain.best.getBestPagingAjaxCallback
                                , null
                                , mmain.main.stonUseYn
                        );

                        $(tabClass+"#mContents").attr("data-ref-pageIdx", param.pageIdx);
                    }
                    ,startPageIdx : startIdx
                    ,subBottomScroll : 700
                    //초기화 시 최초 목록 call 여부
                    ,initCall : (startIdx > 0) ? false : true
                });
            }
        },

        getBestPagingAjaxCallback : function(res) {
        	
        	let tabClass = "#main-swiper-tab3" + " ";

            var dispCatNo = $(tabClass+"#mTab li.on").attr("data-ref-dispCatNo");
            if(dispCatNo == '900000100100002'){
                // 리뷰 베스트인 경우
                $(tabClass+"#sellBestDiv").hide();
                $(tabClass+"#mContents").addClass("subTop");
                $(tabClass+"#mSubGnb").hide();
                $(tabClass+"#reviewBestDiv").show();
            }else{
                // 판매 베스트인 경우
                $(tabClass+"#sellBestDiv").show();
                $(tabClass+"#mContents").removeClass("subTop");
                $(tabClass+"#mSubGnb").show();
                $(tabClass+"#reviewBestDiv").hide();
            }

            //페이지당 50개, 2페이지 이상 조회 시 destroy
            if (res.trim() == '' || PagingCaller.getCurPageIdx() > 2) {
                //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
                PagingCaller.destroy();

            } else {
                //응답 결과가 있는 경우 append 처리 후 lazyload 처리
                if(dispCatNo == '900000100100002'){
                    // 리뷰 베스트인 경우
                    $(tabClass+"#reviewBestUl").append(res);
                }else{
                    // 판매 베스트인 경우
                    $(tabClass+".mlist2v-best").append(res);
                }

                mmain.main.setLazyLoad();

                if (PagingCaller.getCurPageIdx() >= 2) {
                    //마지막 목록임- 스크롤 이벤트 제거
                    PagingCaller.destroy();
                }
            }

            setTimeout(function() {

//                sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
            	sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

                //링크 처리
                var dispCatNo = $(tabClass+"#mTab li.on").attr("data-ref-dispCatNo");
                if(dispCatNo == '900000100100002'){
                    // 리뷰 베스트인 경우

                }else{
                    // 판매 베스트인 경우
                    common.bindGoodsListLink();
                }

//              $(".goodsList").bind("click", function(e) {
//                  e.preventDefault();
//                  common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//              });

//              $(".goodsList").removeClass("goodsList");

                common.wish.checkWishList();
            }, 100);

            //loadingLayer
            common.hideLoadingLayer();

        },

        // 리뷰 베스트 툴팁 열고 닫기
        layTooltip : function(tar){
            var tar = '#'+tar,
                _target = $(tar);
                _this = _target.siblings('button'),
                _thisPos = _this.position();
            _target.css({
                top:(_thisPos.top)+22,
                left:(_thisPos.left)-7
            });
            _target.show();
            _target.focus();
        },

        layTooltipClose : function(tar){
            var tar = '#'+tar,
                _target = $(tar);
            _target.hide();
            _target.siblings('button').focus();
        },

        // 리뷰 베스트 오늘의 도움 리뷰 스와이프 처리
        reviewBestSwipe : function(){
            $('#reviewBestDiv').show(); // swiper 작동하려면 width 값이 필요한데 display:none 상태면 width값이 0이라 오류발생. 스와이퍼 호출 전 show 처리.
            var review_best = {
                    autoplay: false,
                    pagination: '.paging',
                    paginationClickable: true,
                    freeMode: false,
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                }, visual_swiper = Swiper('.review_best_slide', review_best );
        }

};

$.namespace("mmain.news");
mmain.news = {

    _ajax : common.Ajax,

    init : function() {
    	
    	console.log("[mmain.news.init]");

    	let tabClass = "#main-swiper-tab2" + " ";
    	
        var that = this;

        //찜 처리 초기화
        common.wish.init();


        var startIdx = 1;
        if ($(tabClass+"#mContents").attr("data-ref-pageIdx") != undefined && $(tabClass+"#mContents").attr("data-ref-pageIdx") != "") {
            startIdx = parseInt($(tabClass+"#mContents").attr("data-ref-pageIdx"));
        }

        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        mmain.news.getNewsPagingAjax(startIdx);

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
//            $(".goodsList").bind("click", function(e) {
//                e.preventDefault();
//                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//            });
            //링크 처리
            $("img[data-ref-link-url]").bind("click", function() {
                common.wlog( $(this).parent().attr("data-wlog-id") );
                location.href = $(this).attr("data-ref-link-url");
            });

//            $(".goodsList").removeClass("goodsList");

            //웹로그
            mmain.news.bindWebLog();

        }, 100);

    },

    bindWebLog : function (){

        var wlogID = "";

        //웹로그ID 생성
        $(".submain-new .image").each(function(i) {

            //배너 로그ID생성
            if( common.isEmpty($(this).attr("data-wlog-id") ) ){
                wlogID = "new_banner_" + (i+1);
                $(this).attr("data-wlog-id" ,  wlogID);
            }

            //상품 로그ID생성
            $(this).siblings().children().each(function(idx){
                if( common.isEmpty($(this).attr("data-wlog-id") ) ) {
                    $(this).attr("data-wlog-id" , wlogID + "_" + (idx+1) );
                    $(this).children().click(function(){
                        common.wlog( $(this).parent().attr("data-wlog-id") );
                    });
                }
            });
        });

    },

    getNewsPagingAjax : function(startIdx) {
    	
    	let tabClass = "#main-swiper-tab2" + " ";
    	
        //연속키 방식
        PagingCaller.init({
            callback : function(){
                //코드 완료 후 스토어 정보 조회
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx(),
                };

                //미리보기 파라미터 추가
                mmain.menu.setPreviewParam(param);

                common.Ajax.sendRequestSton( // new
                        "GET"
                        , _baseUrl + "main/getNewPagingAjax.do"
                        , param
                        , mmain.news.getNewPagingAjaxCallback
                        , null
                        , mmain.main.stonUseYn        
                );

                $(tabClass+"#mContents").attr("data-ref-pageIdx", param.pageIdx);
            }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
        });
    },

    getNewPagingAjaxCallback : function(res) {
    	
    	let tabClass = "#main-swiper-tab2" + " ";

      //페이지당 20개, 5페이지 이상 조회 시 destroy
        if (res.trim() == '' || PagingCaller.getCurPageIdx() > 6) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();

        } else {
            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $(tabClass+"#mmainNews").append(res);

            mmain.main.setLazyLoad();

            setTimeout(function() {
                //링크 처리
                common.bindGoodsListLink();
//                $(".goodsList").bind("click", function(e) {
//                    e.preventDefault();
//                    common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//                });

                //찜 체크 처리.
                common.wish.checkWishList();
//                $(".goodsList").removeClass("goodsList");

              //링크 처리
                $("img[data-ref-link-url]").bind("click", function() {
                    common.wlog( $(this).parent().attr("data-wlog-id") );
                    location.href = $(this).attr("data-ref-link-url");
                });

                //웹로그
                mmain.news.bindWebLog();
            }, 100);
        }

//        sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

        //loadingLayer
        common.hideLoadingLayer();

        if (PagingCaller.getCurPageIdx() >= 6) {
            PagingCaller.destroy();
        }
    }
};

$.namespace("mmain.hotdeal");
mmain.hotdeal = {

    _ajax : common.Ajax,

    init : function() {
    	
    	console.log("[mmain.hotdeal.init]");
    	
    	let tabClass = "#main-swiper-tab1" + " ";
    	
        var that = this;

        //상단 서브 gnb 스와이프 init
        mmain.subGnb.init(1);

        var startIdx = 1;
        if ($(tabClass+"#mContents").attr("data-ref-pageIdx") != undefined && $(tabClass+"#mContents").attr("data-ref-pageIdx") != "") {
            startIdx = parseInt($(tabClass+"#mContents").attr("data-ref-pageIdx"));
        }

        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        mmain.hotdeal.getHotdealPagingAjax(startIdx);

        //서브 메뉴바 바인드 처리
        mmain.hotdeal.subCtgBindEvent();

        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
//            $(".goodsList").bind("click", function(e) {
//                e.preventDefault();
//                common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//            });

            //상품이미지 클릭 이벤트
            $("#mmainHotdeal li .imgSmall").click(function(){
                eval($(this).parent().find(".area").attr("onclick"));
             });

//            $(".goodsList").removeClass("goodsList");

            //웹로그
            mmain.hotdeal.bindWebLog();
        }, 100);

        //출석체크 스탬프 찍기
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var ym = year +""+month;

        //2019년10월 11월에만 보이도록 설정
        if($("#profile").val() == "prod" && !(ym == "201910" || ym == "201911")){
            $("#evtFloatingBanner").hide();
        }else{
            $("#evtFloatingBanner").show();
            $("#evtFloatingBanner").removeClass("close");
        }

        //2019년10월 11월에만 적용되도록 설정
        if(($("#profile").val() == "prod" && (ym == "201910" || ym == "201911")) || $("#profile").val() != "prod"){
            //오늘의 특가 출석체크 배너
            $(window).scroll(function(event) {
                var scroll = $(window).scrollTop();
                if(scroll>=1500){
                    if(!$("#evtFloatingBanner").hasClass("close")){
                        $("#evtFloatingBanner").fadeOut("slow").removeClass("show");
                    }
                } else{
                    if(!$("#evtFloatingBanner").hasClass("close")){
                        $("#evtFloatingBanner").fadeIn("slow").addClass("show");
                    }
                }
            });

            //출석체크 스탬프 닫기 클릭
            $(".eventHideLayer").click(function(){
                $("#evtFloatingBanner").addClass("close");
                $("#evtFloatingBanner").hide();
            });
        }
    },

    bindWebLog : function (){
    	
    	let tabClass = "#main-swiper-tab1" + " ";
    	
        var wlogID = "";
        //웹로그ID 생성
        $(tabClass+".mlist1v-hot li").each(function(i) {
            if( common.isEmpty($(this).attr("data-wlog-id") ) ) {

                wlogID = "hotdeal_goods_" + (i+1);

                $(this).attr("data-wlog-id" , wlogID);
                $(this).click(function(){
                    common.wlog( $(this).attr("data-wlog-id") );
                });
            }
        });

    },

    getHotdealPagingAjax : function(startIdx, dispCatNo) {
    	
    	let tabClass = "#main-swiper-tab1" + " ";
    	
        //연속키 방식
        PagingCaller.init({
            callback : function(){
                //코드 완료 후 스토어 정보 조회
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx(),
                    fltCondition : "02",
                    fltDispCatNo : (dispCatNo == undefined || dispCatNo == null) ? "" : dispCatNo
                };

                //미리보기 파라미터 추가
                mmain.menu.setPreviewParam(param);

                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "main/getHotdealPagingAjax.do"
                        , param
                        , mmain.hotdeal.getHotdealPagingAjaxCallback);

                $(tabClass+"#mContents").attr("data-ref-pageIdx", param.pageIdx);
            }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
        });
    },

    /**
     * 서브카테고리 클릭 시 처리
     */
    subCtgBindEvent : function() {
    	
    	let tabClass = "#main-swiper-tab1" + " ";
    	
    	
        $(tabClass+"#mSubGnb").find("li").each(function() {
            $(this).find("a").click(function() {
                $(document).scrollTop(0);

                var dispCatNo = $(this).attr("data-ref-dispCatNo");
                $(tabClass+"#mmainHotdeal").empty();
                //페이징 콜러 제거
                PagingCaller.destroy();

                //loadingLayer
                common.showLoadingLayer(false);

                mmain.hotdeal.getHotdealPagingAjax(0, dispCatNo);

            });
        });
    },

    getHotdealPagingAjaxCallback : function(res) {
    	
    	let tabClass = "#main-swiper-tab1" + " ";

        if (res.trim() == '' || PagingCaller.getCurPageIdx() > 7) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
            $(tabClass+"#mContents").attr("data-ref-pageIdx", PagingCaller.getCurPageIdx()-1);

        } else {
            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $(tabClass+"#mmainHotdeal").append(res);

            mmain.main.setLazyLoad();

            setTimeout(function() {
                //링크 처리
                common.bindGoodsListLink();
//                $(".goodsList").bind("click", function(e) {
//                    e.preventDefault();
//                    common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
//                });

                //상품이미지 클릭 이벤트
                $(tabClass+"#mmainHotdeal li .imgSmall").click(function(){
                    eval($(this).parent().find(".area").attr("onclick"));
                 });

//                $(".goodsList").removeClass("goodsList");
                //웹로그
                mmain.hotdeal.bindWebLog();
            }, 100);

        }


//        sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

        //loadingLayer
        common.hideLoadingLayer();

        if (PagingCaller.getCurPageIdx() >= 7) {
            PagingCaller.destroy();
            $(tabClass+"#mContents").attr("data-ref-pageIdx", PagingCaller.getCurPageIdx()-1);
        }

    },

    /* 10월,11월 출석체크 오특 출석 등록 */
    attendStamp : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            alert("APP에서 이벤트 참여가 가능합니다.");
        }else{
            if(common.isLogin() == false){
                if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
                    return false;
                }else{
                    common.link.moveLoginPage("N", location.href);
                    return false;
                }
            }else{
                //출석체크 스탬프 찍기
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var ym = year +""+month;
                var fvrSeq = "";
                var url = "";

                if($("#profile").val() == "prod" && ym == "201910"){
                    fvrSeq = "35";
                    url = "event/20191001/addHotdealStmp.do";
                    
                }else{  //QA거나 운영11월인경우
                    //10월 출석체크
                    fvrSeq = "34";
                    url = "event/20191101/addHotdealStmp.do";
                }

                var param = {
                        fvrSeq : fvrSeq
                }
                common.Ajax.sendJSONRequest(
                        "GET"
                      , _baseUrl + url
                      , param
                      , mmain.hotdeal._callback_addHotdealStmp
                );
            }
        }
    },

    _callback_addHotdealStmp : function(json){
        /*
         * 앱푸시 수신 미동의시 : APP PUSH 수신 동의 후 이벤트 참여 가능합니다. APP PUSH 수신동의 설정하시겠습니까? confirm
         *   ㄴ 확인 - APP PUSH 설정 페이지 이동
         *   ㄴ 취소 - 얼럿 닫기
         */
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var ym = year +""+month;

        if(json.ret != "042"){  //앱푸시 수신동의 외에 오류 얼럿 후 출석체크 화면으로 이동
            if(json.ret != "0"){
                alert(json.message);
            }

            if($("#profile").val() == "prod"){  //운영이면
                if(ym == "201910"){  //10월 운영번호
                    common.link.commonMoveUrl("event/20191001/getEventDetail.do?evtNo=00000000006599#evtCon03"); //10월 출석체크
                }else{  //11월 운영번호
                    common.link.commonMoveUrl("event/20191101/getEventDetail.do?evtNo=00000000006639#evtCon03"); //11월 출석체크
                }
            }else{ // QA
                common.link.commonMoveUrl("event/20191101/getEventDetail.do?evtNo=00000000005928#evtCon03"); //11월 출석체크
            }
        }else{
            if(confirm(json.message)){
                common.app.callSettings();
            }
        }
    }
};

$.namespace("mmain.theme");
mmain.theme = {

    _ajax : common.Ajax,

    init : function() {
    	
    	console.log("[mmain.theme.init]");

        var that = this;
        //웹로그생성
        mmain.theme.bindWebLog();
        mmain.theme.BindEvent();

        //BI Renewal. 20190918. nobbyjin. - LazyLoad 적용
        common.setLazyLoad();

    },

    bindWebLog : function (){

        var wlogID = "";

        //웹로그ID 생성
        $(".mThemaBanner").each(function(i) {
            if( common.isEmpty($(this).attr("data-wlog-id") ) ) {
                wlogID = "theme_banner_" + (i+1);

                $(this).attr("data-wlog-id" , wlogID);
            }
        });

    },
    /**
     * 로드시 이벤트 처리
     */
    BindEvent : function() {
      //링크 처리
        $(".mThemaBanner a").bind("click", function() {
            common.wlog( $(this).parent().attr("data-wlog-id") );
            location.href = $(this).children(".img").children().attr("data-ref-link-url");
        });
    }
};

$.namespace("mmain.event");
mmain.event = {

    _ajax : common.Ajax,
    ollyoungIndex : "",

    init : function() {
    	
    	console.log("[mmain.event.init]");
    	
    	let tabClass = "#main-swiper-tab5" + " ";
    	
        $(tabClass+'#mFixTab').removeClass('scroll_down');
        //탭 컨텐츠 show/hide
        $(tabClass+'#mTab').find('a').on({
            'click' : function(e){
                e.preventDefault();

                $(this).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on').removeAttr('title');
                $(tabClass+'.tab_contents:eq('+ $(this).parent().index() +')').removeClass('hide').siblings().addClass('hide');

                var idx = $(this).parent().index();
                if(idx != 2){
                    if(idx == 0){
                        common.wlog("event_alluser_tab");

                    }else if(idx == 1){
                        common.wlog("event_buyuser_tab");
                    }

                    mmain.event.getEventListAjax($(this).parent().index());
                }else{
//                    common.wlog("event_beautyuser_tab");
//                    mmain.event.getBeautyListAjax();
                    ///올영초기
                    $(tabClass+'#mFixTab').removeClass('scroll_down');
                    sessionStorage.removeItem("scrollY");
                    sessionStorage.setItem("scrollY", 0);
                    common.wlog("event_ollyoung_tab");
                    mmain.event.getOllyoungListAjax(null);
                }

            }
        });


        $('.main_event_list').next($('.tit-area > .more')).click(function(){
            common.link.moveNtcList('03');
        });

        $('.main_event_list >li').click(function(){

            var evtClssCd = $(this).find("input[name=evtClssCd]").val();
            var index = $(".main_event_list > li").index(this) ;
            if(index <15){
                index  = index +1;
                if($("#mTab li.on").index() == 1){
                    common.wlog("event_buyuser_banner_" + index);
                }else{
                    common.wlog("event_alluser_banner_" + index);
                }
            }

            var urlInfo = $(this).find("input[name=urlInfo]").val();
            if(!common.isEmpty(urlInfo)){
                common.link.commonMoveUrl(urlInfo);
            }else{
                var evtNo = $(this).find("input[name*='evtNo']").val();
                common.link.moveEventDetailPage(evtNo);
            }

        });

        $('.main_event_list2 >li').click(function(){

            var index = $(".main_event_list2 > li").index(this) ;
            if(index <10){
                common.wlog("event_beautyuser_banner_" + Number(index + 1));
            }

            var urlInfo = $(this).find("input[name=urlInfo]").val();
            if(!common.isEmpty(urlInfo)){
                common.link.commonMoveUrl(urlInfo);
            }else{
                var evtNo = $(this).find("input[name*='evtNo']").val();
                common.link.moveBeautyDetailPage(evtNo);
            }

        });

        $(".noticeList >li").click(function(){
            var ntcSeq = $(this).find("input[name*='ntcSeq']").val();
            common.link.moveNtcDetail('',ntcSeq);
        });

        var subCatNo = sessionStorage.getItem("gnb_sub_cat_no");

        if(!common.isEmpty(subCatNo)){
            $(tabClass+"#mTab").find("a").eq(subCatNo).click();
            sessionStorage.removeItem("gnb_sub_cat_no");
        }

    },
    //올영체험단 init
    ollyoungInit : function() {
        $("#mGnb").find("li").each(function(idx) {
             $("#mGnb").find("li").removeClass("on");
             $("#mGnb").find('span:contains("이벤트")').parents('li').addClass("on");

            $("#mGnb").find("li").eq(idx).find("a").bind("click", function() {
                common.app.callTrackEvent('gnb',{ 'af_content_nm' : $("#mGnb").find("li").eq(idx).find("a > span").html()});
                setTimeout(function() {
                    if (!mmain.main.isInit) {
                        try {
                            sessionStorage.removeItem("scrollY");
                        } catch(e) {}
                    }

            // 2017-11-23 : 펫샵 추가로 인한 임시 링크 이동처리
                    if( ($("#mGnb").find("li").eq(idx).attr("data-ref-url").indexOf("planshop/getPlanShopDetail.do") >= 0)
                            || ($("#mGnb").find("li").eq(idx).attr("data-ref-url").indexOf("planshop/getSpcShopDetail.do") >= 0) ){
                        common.link.commonMoveUrl($("#mGnb").find("li").eq(idx).attr("data-ref-url"));
                    } else {
                    	mmain.main.setGnbSwipe(idx);
//                        mmain.menu.moveSubMenu(idx,  $("#mGnb").find("li").eq(idx).attr("data-ref-url"));
                    }
                }, 500);
            });
        });
          sessionStorage.removeItem("scrollY");
          $('html').scrollTop(0.0);
          common.wlog("event_ollyoung");
          ScrollPager.init({
              bottomScroll : 700,
              callback : mmain.event.getOllyoungListAjax(null)
          });


    },

    getEventListAjax : function(idx){

        var param={};

        common.showLoadingLayer(false);
        $(document).scrollTop(0);

        if(idx == 0){
            param = {
                evtType : '20',
                ntcClssCd : '03'
            };

            mmain.event.callEventListAjax(param);

        }else if(idx == 1){
            param = {
                evtType : '10',
                ntcClssCd : '03'
            };

            mmain.event.callEventListAjax(param);

        }

        common.hideLoadingLayer();

    },

    callEventListAjax :  function(param){
        this._ajax.sendJSONRequest(
                "GET"
                , _baseUrl + "main/getEventListJson.do"
                , param
                , this._callback_getEventListAjax);
    },

    _callback_getEventListAjax : function(strData) {

        var dispObj = $("#buy");
        if(strData.evtType == "20"){
            dispObj = $("#all");
        }

        dispObj.empty();
        mmain.event.makeEventList(dispObj,strData.eventList);
        mmain.event.makeNoticeList(dispObj,strData.noticeList);
        mmain.main.setLazyLoad();

//        sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

    },

    getBeautyListAjax : function(){

        common.showLoadingLayer(false);
        $(document).scrollTop(0);

        PagingCaller.destroy();

        PagingCaller.init({
              callback : function(){
                  var param = {
                          pageIdx    : PagingCaller.getNextPageIdx()
                  }
                  common.Ajax.sendRequest(
                          "GET"
              , _baseUrl + "main/getBeautyListJson.do"
                          , param
                          , mmain.event._callback_getBeautyListAjax);
              }
          ,startPageIdx : 0
          ,subBottomScroll : 700
          ,initCall : true
        });

        common.hideLoadingLayer();
    },

    _callback_getBeautyListAjax : function(strData) {

        var dispObj = $("#beauty");
        var pageIdx = strData.pageIdx;
        var beautyList = strData.beautyList

        if(pageIdx == 1){
            dispObj.empty();
            mmain.event.makeBeautyIntro(dispObj);
        }

        if((pageIdx > 1 && beautyList.length > 0) || pageIdx == 1){
            mmain.event.makeBeautyList(dispObj,beautyList);
        }else{
            PagingCaller.destroy();
        }

        mmain.main.setLazyLoad();

//        sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

    },

    makeEventList :  function(dispObj,eventList){ 

        if(eventList.length <= 0){
            var $divNo = $("<div>").addClass("sch_no_data pdzero");
            var $p = $("<p>");
            $p.text("진행중인 이벤트가 없습니다");
            $divNo.append($p);
            dispObj.append($divNo);
        }else{
            var $ulEvent = $("<ul>").addClass("main_event_list");
            dispObj.append($ulEvent);

            $.each(eventList, function(index, element){
                var $li = $("<li>");
                $ulEvent.append($li);

                var $aTag = $("<a>").attr("href","javascript:;");
                var $span = $("<span>");

                if(!common.isEmpty(element.evtSupvPctCdNm)){

                    if(element.evtSupvPctCdNm == '온라인몰'){
                        $span.addClass("evt_flag flag3");
                    }else if(element.evtSupvPctCdNm == '오프라인'){
                        $span.addClass("evt_flag flag2");
                    }else if(element.evtSupvPctCdNm == '온&오프라인'){
                        $span.addClass("evt_flag flag1");
                    }

                    var nm = element.evtSupvPctCdNm;
                    var result = nm;
                    if(!common.isEmpty(nm) && nm.indexOf('+') >0){
                        result = nm.replaceAll('\\+','&');
                    }
                    $span.text(result);
                    $aTag.append($span);
                }


                var url = [];
                url.push($("#_fileUploadUrl").val());
                url.push(element.bnrImgUrlAddr);

                var className = "scroll-lazyload";
                if(index <3 ){
                    className = "seq-lazyload";
                }

                var $img = $("<img>").attr("data-original",url.join(""))
                                 .attr("alt","이벤트 이미지")
                                 .addClass(className);
                $aTag.append($img);

                var $spanTit = $("<span>").addClass("evt_tit").text(element.bnrMainTxt);
                $aTag.append($spanTit);

                var $spanDesc = $("<span>").addClass("evt_desc").text(element.bnrAasTxt);
                $aTag.append($spanDesc);

                var dateString  = [];
                dateString.push(element.eDtime);
                dateString.push(element.sDtime);
                var $spanDate = $("<span>").addClass("evt_date").text(dateString.join(""));

                $aTag.append($spanDate);
                $li.append($aTag);

                var $inputEvtNo = $("<input>").attr("type","hidden")
                                          .attr("name","evtNo")
                                          .attr("value",element.evtNo);
                $li.append($inputEvtNo);

                var $inputEvtClssCd = $("<input>").attr("type","hidden")
                                          .attr("name","evtClssCd")
                                          .attr("value",element.evtClssCd);

                $li.append($inputEvtClssCd);

                var $inputUrl = $("<input>").attr("type","hidden")
                                          .attr("name","urlInfo")
                                          .attr("value",element.frdmCmpsUrlAddr);

                $li.append($inputUrl);

                $li.click(function(){
                    if(index <15){
                        index  = index +1;
                        if($("#mTab li.on").index() == 1){
                            common.wlog("event_buyuser_banner_" + index);
                        }else{
                            common.wlog("event_alluser_banner_" + index);
                        }
                    }

                    if(!common.isEmpty(element.frdmCmpsUrlAddr)){
                        common.link.commonMoveUrl(element.frdmCmpsUrlAddr);
                    }else{
                        common.link.moveEventDetailPage(element.evtNo);
                    }
                });
            });
        }
    },


    makeBeautyIntro : function(dispObj){
        var $divIntro = $("<div>").addClass("beautyIntro");
        $divIntro.click(function(){
            common.wlog("event_beautyuser_banner");
            mmain.event.dispPopup();
            common.setScrollPos();
            common.popFullOpen("뷰티테스터 소개", "");
        });
        dispObj.append($divIntro);

        var $aLink = $("<a>").attr("href","javascript:;")
                              .attr("title","뷰티테스터 소개페이지 이동");
        $divIntro.append($aLink);

        var imgUrl = [];
        imgUrl.push(_imgUrl);
        imgUrl.push("comm/beauty_intro.png");
        $img = $("<img>").attr("src",imgUrl.join(""))
                         .attr("alt","beauty tester 뷰티 트렌드를 직접 경험 할 수 있는 기회!");
        $aLink.append($img);
    },


    makeBeautyList :  function(dispObj,beautyList){

        if(beautyList.length <= 0){
            var $divNo = $("<div>").addClass("sch_no_data pdzero");
            var $p = $("<p>");
            $p.text("진행중인 뷰티테스터가 없습니다");
            $divNo.append($p);
            dispObj.append($divNo);
        }else{
            var $ulEvent = $("<ul>").addClass("main_event_list2");
            dispObj.append($ulEvent);

            $.each(beautyList, function(index, element){
                var $li = $("<li>");
                $ulEvent.append($li);

                var $aTag = $("<a>").attr("href","javascript:;");
                $li.append($aTag);

                if(element.evtPrgsStatName == 'ING'){
                    var $spanEvt1 = $("<span>").addClass('evt_flag status10');
                    $aTag.append($spanEvt1);

                    var $spanText1 = $("<span>").append('모집');
                    $spanEvt1.append($spanText1);

                    var $spanCount = $("<span>");
                    $spanEvt1.append($spanCount);

                    var payCount = element.payPrct;
                    var $strongCount = $("<strong>").text(payCount.numberFormat());
                    $spanCount.append($strongCount);
                    $spanCount.append('명');

                } else if(element.evtPrgsStatName == 'ENTRYEND'){
                    var $spanEvt3 = $("<span>").addClass('evt_flag status20');
                    $aTag.append($spanEvt3);

                    var $spanText3 = $("<span>").append('응모<br>마감');
                    $spanEvt3.append($spanText3);
                } else if(element.evtPrgsStatName == 'ANNOUNCE'){
                    var $spanEvt2 = $("<span>").addClass('evt_flag status30');
                    $aTag.append($spanEvt2);

                    var $spanText2 = $("<span>").append('당첨자<br>발표');
                    $spanEvt2.append($spanText2);
                } else if(element.evtPrgsStatName == 'REVIEW'){
                    var $spanEvt3 = $("<span>").addClass('evt_flag status40');
                    $aTag.append($spanEvt3);

                    var $spanText3 = $("<span>").append('후기<br>작성');
                    $spanEvt3.append($spanText3);
                }

                var url = [];
                url.push($("#_fileUploadUrl").val());
                url.push(element.bnrImgUrlAddr);

                var className = "scroll-lazyload";
                if(index <3 ){
                    className = "seq-lazyload";
                }

                var $img = $("<img>").attr("data-original",url.join(""))
                                 .attr("alt","이벤트 이미지")
                                 .addClass(className);
                $aTag.append($img);

                var $spanDesc = $("<span>").addClass("evt_desc").text(element.bnrMainTxt);
                $aTag.append($spanDesc);

                var $spanTit = $("<span>").addClass("evt_tit").text(element.bnrAasTxt);
                $aTag.append($spanTit);

                var $spanInfo = $("<span>").addClass("evt_info");
                $aTag.append($spanInfo);


                var $strongRegCount = $("<strong>");
                $strongRegCount.append("신청인원");
                $spanInfo.append($strongRegCount);

                var $spanRegCount = $("<span>");
                $strongRegCount.append($spanRegCount);

                if(common.isEmpty(element.regNum)){
                    $spanRegCount.append('0');
                }else{
                    var regNum = element.regNum;
                    $spanRegCount.append(regNum.numberFormat());
                }
                var $spanRegP = $("<span>").text("명");
                $spanRegCount.append($spanRegP);


                var $strongTerm = $("<strong>");
                $strongTerm.append("모집기간");
                $spanInfo.append($strongTerm);

                var $spanTerm = $("<span>");
                $spanTerm.append(element.eDtime);
                $spanTerm.append(element.sDtime);
                $strongTerm.append($spanTerm);


                var $inputEvtNo = $("<input>").attr("type","hidden")
                                          .attr("name","evtNo")
                                          .attr("value",element.evtNo);
                $li.append($inputEvtNo);

                var $inputUrl = $("<input>").attr("type","hidden")
                                            .attr("name","urlInfo")
                                            .attr("value",element.frdmCmpsUrlAddr);

                $li.append($inputUrl);

                $li.click(function(){
                    if(index <10){
                        common.wlog("event_beautyuser_banner_" + Number(index+1));
                    }

                    if(!common.isEmpty(element.frdmCmpsUrlAddr)){
                        location.href = _baseUrl + element.frdmCmpsUrlAddr;
                    }else{
                        common.link.moveBeautyDetailPage(element.evtNo);
                    }

                });
            });
        }
    },

    makeNoticeList : function(dispObj,list){

        var listLeng = list.length;

        var $divTit = $("<div>").addClass("tit-area type2 mgT7");
        dispObj.append($divTit);
        var $hTit = $("<h3>").addClass("tit").text("당첨자 발표");
        $divTit.append($hTit);

        var $buttonMore = $("<button>").addClass("more")
                                   .attr("type","button")
                                   .text("더보기");

        $buttonMore.click(function(){
            common.link.moveNtcList('03');
        });
        $divTit.append($buttonMore);

        var $ulList = $("<ul>").addClass("noticeList noticeList2");
        dispObj.append($ulList);

        if(listLeng <= 0){
            var $liNo = $("<li>").addClass("no_txt_data").text("당첨자 발표 공지가 없습니다.");
            $ulList.append($liNo)
        }else{

            var formObj = $("#formNoticeDetail");
            $.each(list, function(index, element){

                var $li = $("<li>");
                $li.click(function(){
                    common.link.moveNtcDetail('',element.ntcSeq);
                });
                $ulList.append($li);

                var $aTag = $("<a>").attr("href","javascript:;")
                                .attr("title","당첨자 발표 바로가기");
                $li.append($aTag);

                var $strong = $("<strong>").text(element.ntcTitNm);
                $aTag.append($strong);

                if(!common.isEmpty(element.winAncmDt)){
                    var $spanDateText = $("<span>").text("당첨자 발표일");
                    $aTag.append($spanDateText);


//                    var $spanDate = $("<span>").text(element.winAncmDt);
                    var $spanDate = $("<span>").text(element.ntcStrtDtimeTxt);
                    $aTag.append($spanDate);
                }

                var $inputSeq = $("<input>").attr("name","ntcSeq")
                                            .attr("type","hidden")
                                             .val(element.ntcSeq);
                $li.append($inputSeq);

            });
        }

    },

    dispPopup : function(){

        $("#pop-full-title").text("뷰티테스터 소개");

        var $popCont = $("<div>").addClass("event_beauty_info");

        $("#pop-full-contents").empty().append($popCont);

        var src = [];
        src.push(_imgUrl);
        src.push("event/img_beauty_info.png");

        var $img = $("<img>").attr("src",src.join(""))
                         .attr("alt","뷰티테스터 진행 안내");
        $popCont.append($img);

        var $blind = $("<div>").addClass("blind");
        $popCont.append($blind);

        var $h2 = $("<h2>").text("Beauty Tester");
        $blind.append($h2);

        var $p = $("<p>").text("직접 제품을 써보고 최신 뷰티 트렌드를 경험할 수 있는 기회");
        $blind.append($p);

        var $h3 = $("<h3>").text("뷰티테스터는 이렇게 진행됩니다.");
        $blind.append($h3);

        var $ul = $("<ul>");
        $blind.append($ul);

        var $li1 = $("<li>").text("테스터모집 - 모집기간동안 응모하신 분들 중 추첨을 통해 선정합니다.");
        $ul.append($li1);

        var $li2 = $("<li>").text("상품수령 - 당첨된 고객님의 기본 배송지로 상품이 배송됩니다. (꼭 개인정보를 확인해주세요!)");
        $ul.append($li2);

        var $li3 = $("<li>").text("후기작성 - 정성껏 작성해 주신 후기가 상품평에 등록이 됩니다.");
        $ul.append($li3);

    },
//올영리스트
    getOllyoungListAjax : function(keyword){

        common.showLoadingLayer(false);
        $(document).scrollTop(0);
        $('html').scrollTop(0.0);
        PagingCaller.destroy();
        $('#oyExperienceInfoPop').hide();
        PagingCaller.init({
              callback : function(){
                  var param = {
                          pageIdx    : PagingCaller.getNextPageIdx(),
                          sEvtKeyWord    : keyword
                  }
                  common.Ajax.sendRequest(
                          "GET"
              , _baseUrl + "main/getOllyoungListJson.do"
                          , param
                          , mmain.event._callback_getOllyoungListAjax);
              }
          ,startPageIdx : 0
          ,subBottomScroll : 700
          ,initCall : true
        });

        common.hideLoadingLayer();
    },
    //올영신청하기
    getOllyoungApplyDetailAjax : function(custFvrAplyTgtNo,evtNo){
        var param = {
                  custFvrAplyTgtNo : custFvrAplyTgtNo,
                  evtNo : evtNo
          }

          this._ajax.sendRequest(
                  "GET"
                  , _baseUrl + "main/getOyGrpEventDetailJson.do"
                  , param
                  , mmain.event._callback_getOllyoungApplyDetailAjax);
          common.hideLoadingLayer();
    },
    //올영신청등록
    getOllyoungApplyRegAjax : function(custFvrAplyTgtNo,evtNo){
        var param = {
              custFvrAplyTgtNo : custFvrAplyTgtNo,
                evtNo : evtNo
        }
        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "main/regOllyoungJson.do"
                , param
                , mmain.event._callback_getOllyoungApplyRegAjax);
        common.hideLoadingLayer();
    },
    //올영중복체크
    getOllyoungApplyValiAjax : function(custFvrAplyTgtNo,evtNo){
        var param = {
              custFvrAplyTgtNo : custFvrAplyTgtNo,
                evtNo : evtNo,
        }
        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "main/valiOllyoungJson.do"
                , param
                , mmain.event._callback_getOllyoungApplyValiAjax);
        common.hideLoadingLayer();
    },
    //콜백 올영리스트
    _callback_getOllyoungListAjax : function(strData) {
        if(typeof(strData) === 'object'){
            var dispObj = $("#oyBoxInner");
            var pageIdx = strData.pageIdx;
            var ollyoungList = strData.ollyoungList;
            var totalCount = strData.totalCount;
            var sEvtKeywordt = strData.sEvtKeyWord;
            var ollyoungMbrYn = strData.ollyoungMbrYn;
            var ollyoungEventGoodsNo = strData.ollyoungEventGoodsNo;
            if(pageIdx == 1){
                dispObj.empty();
                mmain.event.makeOllyoungIntro(dispObj);
            }

            if((pageIdx > 1 && ollyoungList.length > 0) || pageIdx == 1){

                mmain.event.makeOllyoungList(dispObj,ollyoungList,totalCount,sEvtKeywordt,ollyoungMbrYn,ollyoungEventGoodsNo,pageIdx);
            }else{
                PagingCaller.destroy();
            }
        }
        mmain.main.setLazyLoad();
//        sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

    },
    //콜백 올영신청하기 팝업
    _callback_getOllyoungApplyDetailAjax : function(strData) {
        if(typeof(strData) === 'object'){
            var detail = strData.detail;
            var ret = strData.ret;
            if(ret == '0'){
                if( detail.evtNo != null || detail.evtNo != ''){
                    mmain.event.oyApplyLayerPopup(detail);
                    return false;
                }else{
                    PagingCaller.destroy();
                }
            }else{
                alert('이미 다른 상품의 올영체험단을 신청하셨습니다.\n동일기간 내에는 1개의 상품만 신청 가능합니다.');
            }
            
        }
        mmain.main.setLazyLoad();
    },

  //콜백 올영중복체크
    _callback_getOllyoungApplyValiAjax : function(strData) {
        if(typeof(strData) === 'object'){
            var cnt = strData.cnt;
            return cnt;
        }
        mmain.main.setLazyLoad();
//        sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
    },


    //콜백 올영신청하기 등록완료
    _callback_getOllyoungApplyRegAjax : function(strData) {
        if(typeof(strData) === 'object'){
            var ret = strData.ret;
            var ollyoungList = strData.ollyoungList;
            if(ollyoungList != null){
            	var eDtime =ollyoungList[0].endDate;
                var eArr = eDtime.split('/');
                if( ret == 0){
                    alert('축하합니다!\n신청이 완료 되었습니다.\n리뷰 작성 마감 기한은\n'+eArr[1]+'월 '+eArr[2]+'일 까지 입니다.\n리뷰 작성은 마이페이지>올영체험단 리뷰 메뉴를 이용해 주세요.');
                    common.popFullClose();
//                    mmain.event.getOllyoungListAjax(null);
                    $('#aplyConfirm').removeAttr("disabled");
                    common.link.commonMoveUrl("main/main.do#5_2");
                }else if( ret == '-2'){
                	alert('기본 배송지가 입력되어있지 않습니다.\n체험단 상품을 받으실 기본배송지 입력 후 신청해주세요.');
//                	common.link.commonMoveUrl("main/main.do#5_2");
                }else if(ret == '-3'){
                	alert('죄송합니다.\n해당 상품의 올영체험단 신청이 마감되었습니다.\n다른 상품으로 신청해 주세요.');
                }else if(ret == '-4'){
                	alert('신청자가 많아 신청이 완료되지 않았습니다.\n다시 시도해주세요');
                }else{
                	alert('이미 다른 상품의 올영체험단을 신청하셨습니다.\n동일기간 내에는 1개의 상품만 신청 가능합니다.');
                }	
            }else{
            	if( ret == '-2'){
                	alert('기본 배송지가 입력되어있지 않습니다.\n체험단 상품을 받으실 기본배송지 입력 후 신청해주세요.');
//                	common.link.commonMoveUrl("main/main.do#5_2");
                }else if(ret == '-3'){
                	alert('죄송합니다.\n해당 상품의 올영체험단 신청이 마감되었습니다.\n다른 상품으로 신청해 주세요.');
                }else if(ret == '-4'){
                	alert('신청자가 많아 신청이 완료되지 않았습니다.\n다시 시도해주세요');
                }else{
                	alert('이미 다른 상품의 올영체험단을 신청하셨습니다.\n동일기간 내에는 1개의 상품만 신청 가능합니다.');
                }	
            }
        }
//        mmain.main.setLazyLoad();
//        sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
    },

    makeOllyoungIntro : function(dispObj){
        var $divIntro = $("<div>").addClass("banner_ex pdTz").attr('onclick','mmain.event.divIntroClick();');
        dispObj.append($divIntro);

        var $aLink = $("<a>").attr("href","javascript:;").attr("title","올영체험단 소개페이지 이동");
        $divIntro.append($aLink);

        //올영체험단 배너 세팅
        var dispImgUrl = $('#dispImgUrl').val();
        var bnrImgUrl = $('#bnrImgUrl').val();
        var bnrImgTxtCont = $('#bnrImgTxtCont').val();

        var imgUrl = dispImgUrl + bnrImgUrl;
        $img = $("<img>").attr("src",imgUrl).attr('onerror',"common.errorImg(this);")
                         .attr("alt", bnrImgTxtCont);
        $aLink.append($img);
    },
    bannerOpen : function(){
         $(window).scrollTop(0.0); //추가부분
         $('#pop-full-title').html("올영체험단 소개");
         $('body').css({'background-color' : '#fff'}); /* 2016-12-12 퍼블리싱 수정 반영 */
         $('#oyExperienceInfoPop').hide();
         $('#pop-full-wrap').empty().html($('#oyExperienceInfoPop').html());
         $('#footerTab').addClass('off');	// [3320682] 온라인몰 마이페이지 UX 개선
         $('.popFullWrap').show();
         $('#mWrapper').hide();

         $(document).scrollTop(0);
         closeBtnAction = function(){
             $('#mWrapper').css('display','block');
             $('#footerTab').removeClass('off');	// [3320682] 온라인몰 마이페이지 UX 개선
             $('#pop-full-wrap').empty();
             $('#oyExperienceInfoPop').hide();
         }


         $('button[name=appPushBtn]').click(function(){
             if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
                 if(confirm('모바일앱 설치 후 APP PUSH 수신동의 해주세요!')){
                     common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=main/getOllyoungList.do");
                 }else{
                     return;
                 }
             } else {
                 location.href = "oliveyoungapp://settings";
             }
         });

         $('button[name=smsBtn]').click(function(){
            var loginCheck = common.loginChk();
            if(loginCheck){
               common.link.moveMemberInfoChangePage();
            }else{
               common.link.moveLoginPage("N", location.href);
            }
         });

    },

    topBannerOpen : function(){
        $("#layerPop").html($('#topReveiwerInfoPop').html());
        common.popLayerOpen2("LAYERPOP01");
         closeBtnAction = function(layerNm){
             common.popLayerClose(layerNm);
         }


    },

    makeOllyoungList :  function(dispObj,ollyoungList,totalCount,sEvtKeyword,ollyoungMbrYn,ollyoungEventGoodsNo,pageIdx){
    if(totalCount <= 0){
        var $divNo = $("<div>").addClass("sch_no_data pdzero");
        var $p = $("<p>");
        $p.text("진행 중인 올영체험단 이벤트가 없습니다.");
        $divNo.append($p);
        dispObj.append($divNo);
    }else{
        //페이징처리
    	var evtNo = ollyoungList[0].evtNo;
        if(pageIdx == 1){
            //box_tit start
            var $box_tit1 = $("<div>").addClass("box_tit");
            dispObj.append($box_tit1);
            var $tit1 = $("<h3>").addClass("tit").text(ollyoungList[0].evtNm);
            $box_tit1.append($tit1);
            var $lineSelset = $("<select>").addClass("lineSelset").attr("title","보기 방식 선택").attr("id","sEvtKeyWord").attr("onchange","mmain.event.lineSelset();");
            $box_tit1.append($lineSelset);
            var $lsOption1 =  $("<option>").attr("value","A");
            $lsOption1.text("전체보기");
            $lineSelset.append($lsOption1);
            var $lsOption2 =  $("<option>").attr("value","S");
            $lsOption2.text("신청 가능 상품만 보기");
            $lineSelset.append($lsOption2);
            if(sEvtKeyword == 'A'){
                $lsOption1.attr('selected','selected');
            }else{
                $lsOption2.attr('selected','selected');
            }
            //box_tit end
            
            var $box_option = $("<div>").addClass("box_option");
            dispObj.append($box_option);
            var $term = $("<ul>").addClass("dot_list");
            var $term1 = $("<li>").text('올영체험단 신청기간은 ');
            $term.append($term1);
            var $em1 = $("<em>").text(ollyoungList[0].eDtime +" "+ ollyoungList[0].sDtime);
            $term1.append($em1);
            $term1.append(' 입니다.');
            $term.append($term1); 
            //SR3170251|올영체험단 리뷰 이동 추가|2019/11/13|jp1020
            var $term2 = $("<li>").text('올영체험단 신청내역 확인 및 리뷰 작성은 ');
            // [3332904] 마이페이지 개편에 따른 올영체험단 내용 변경 요청 건(CHY)
            var $term2Link = $("<a>").attr('href', _baseUrl + "mypage/getMyOllyoungList.do").text("마이페이지 > 리뷰 > 올영체험단 탭 ");
            $term2.append($term2Link);
            $term2.append(' 에서 가능합니다.');
            $term.append($term2);
            
            $box_option.append($term); 
        }
        //box_option end
        //box_itemlist start
        var $box_itemlist = $("<div>").addClass("box_itemlist");
        dispObj.append($box_itemlist);
        var $ulEvent = $("<ul>");
        $box_itemlist.append($ulEvent);
        var aplyDdl = 0;
        var maxCnt = ollyoungList.length;
        $.each(ollyoungList, function(index, element){
            var tmpStrtDate = element.startDate;
            var tmpEndDate =  element.endDate;
            var strtArr = tmpStrtDate.split("/");
            var endArr = tmpEndDate.split("/");
            var strtDate = new Date(strtArr[0], strtArr[1], strtArr[2]);
            var endDate = new Date(endArr[0], endArr[1], endArr[2]);
            var tmpNowDate =  element.nowDate;
            var nowArr = tmpNowDate.split("/");
            var nowDate = new Date(nowArr[0], nowArr[1], nowArr[2]);
            if(sEvtKeyword == "S"){
                if(parseInt(element.rcrtCnt) <= parseInt(element.regNum) || endDate.getTime() < nowDate.getTime() ){
                    aplyDdl++;
                }
            }
        });
        if(aplyDdl >= maxCnt){
        	if(pageIdx == 1){
	            var $li = $("<li>");
	            $ulEvent.append($li);
	            var $item_none = $("<p>").addClass("item_none").html("모든 상품의 신청이 마감되었습니다.<br>다음 올영체험단 신청을 기다려주세요.");
	            $li.append($item_none);
	            $ulEvent.append($li);
	            var $banner = mmain.event.topRnkBanner();
	            $li.append($banner);
        	}
        	
        	PagingCaller.destroy();
        }else{
            var itemCnt = 0;
            
            $.each(ollyoungList, function(index, element){
                if(sEvtKeyword == 'A'){
                    var tmpStrtDate = element.startDate;
                    var tmpEndDate =  element.endDate;
                    var strtArr = tmpStrtDate.split("/");
                    var endArr = tmpEndDate.split("/");
                    var strtDate = new Date(strtArr[0], strtArr[1], strtArr[2]);
                    var endDate = new Date(endArr[0], endArr[1], endArr[2]);
                    var tmpNowDate =  element.nowDate;
                    var nowArr = tmpNowDate.split("/");
                    var nowDate = new Date(nowArr[0], nowArr[1], nowArr[2]);                    
                        var $li = $("<li>");
                        $ulEvent.append($li);
                        var $thum = $("<p>").addClass("thum").attr("onclick","mmain.event.ollyoungGoodsDetail('"+element.custFvrAplyTgtNo+"','"+index+"');");
                        $li.append($thum);
                        var url = [];
                        url.push($("#_goodsImgUploadUrl").val()+"550/");
                        url.push(element.imgPathNm);
                        var $img = $("<img>").attr("src",url.join("")).attr('onerror',"common.errorImg(this);").attr("alt","이벤트 이미지");
                        $thum.append($img);
                        var $info = $("<div>").addClass("info");
                        $li.append($info);
                        var $dl = $("<dl>").addClass("txt");
                        $info.append($dl);
                        var $dt = $("<dt>").text(element.custFvrAplyTgtVal);
                        $dl.append($dt);
//                      var $dd = $("<dd>").text(element.custFvrAplyTgtTxt);
                        var $dd = $("<dd>").html(element.custFvrAplyTgtTxt.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                        $dl.append($dd);
                        var $state = $("<div>").addClass("state");
                        $info.append($state);
                        var $p1 = $("<p>").addClass("state_01");
                        $state.append($p1);
                        var $em1 = $("<em>").text("모집인원");
                        $p1.append($em1);
                        var strRcrtCnt = element.rcrtCnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        var $spanFr = $('<span>').addClass('fr');
                        $spanFr.text(strRcrtCnt);
                        $p1.append($spanFr);
                        $p1.append("명");
                        var $p2 = $("<p>").addClass("state_01 colog");
                        $state.append($p2);
                        var $em2 = $("<em>").text("신청인원");
                        var strRegNum = element.regNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        //2020.07.20 신청인원 초과 수정
                        var $span1 = '';
                        if(parseInt(element.regNum) >= parseInt(element.rcrtCnt)){
                        	$span1 = $("<span>").addClass("colog fr").text(element.rcrtCnt); 
                        }else{
                        	$span1 = $("<span>").addClass("colog fr").text(element.regNum);
                        }
                        //20200720 원본
//                        var $span1 = $("<span>").addClass("colog fr").text(element.regNum);
                        $p2.append($em2);
                        $p2.append($span1);
                        $p2.append("명");
                        var $p3 = $("<p>").addClass("btnApply");
                        $state.append($p3);
                        var $dis = $("<button>");
                        var aplyBtnChk2 = 'Y';
                        if(parseInt(element.regNum) >= parseInt(element.rcrtCnt) || endDate.getTime() < nowDate.getTime()){
                            $dis.addClass("dis").text("신청마감");
                            aplyBtnChk2 = 'N';
                        }else{
                            $dis.addClass("btnApplyLayer").attr('onclick','mmain.event.btnApplyClick("'+evtNo+'","'+ollyoungMbrYn+'","'+ ollyoungEventGoodsNo +'","'+element.custFvrAplyTgtNo+'","'+index+'" );').text("신청하기");
                        }
                        var inputId = "custFvrAplyTgtNo"+index;
                        var $input = $('<input>').attr("type","hidden").attr("id",inputId).attr("name","custFvrAplyTgtNo").attr("value",element.custFvrAplyTgtNo);
                        $p3.append($input);
                        $p3.append($dis);
                        if(ollyoungList.length >= 4){
                            if(index == 3){
                                $ulEvent.append($li);
                                var $banner = mmain.event.topRnkBanner();
                                $li.append($banner);
                            }
                        }else{
                            if(parseInt(ollyoungList.length)-1 == index && pageIdx == 1){
                                $ulEvent.append($li);
                                var $banner = mmain.event.topRnkBanner();
                                $li.append($banner);
                            }
                        }
                        $thum.click(function(){
                            location.href = _baseUrl+"goods/getGoodsDetail.do?goodsNo="+element.custFvrAplyTgtNo;
                        });
                        if(aplyBtnChk2 == 'Y'){
                            $dis.on('touchend',function(){
                                 mmain.event.btnApplyClick(evtNo,ollyoungMbrYn,ollyoungEventGoodsNo,element.custFvrAplyTgtNo,index);
                            });
                         }
                }else{
                    var tmpStrtDate = element.startDate;
                    var tmpEndDate =  element.endDate;
                    var strtArr = tmpStrtDate.split("/");
                    var endArr = tmpEndDate.split("/");
                    var strtDate = new Date(strtArr[0], strtArr[1], strtArr[2]);
                    var endDate = new Date(endArr[0], endArr[1], endArr[2]);
                    var tmpNowDate =  element.nowDate;
                    var nowArr = tmpNowDate.split("/");
                    var nowDate = new Date(nowArr[0], nowArr[1], nowArr[2]);
                    if(parseInt(element.rcrtCnt) > parseInt(element.regNum) && endDate.getTime() >= nowDate.getTime()){
                        var totalCnt2 = 0;
                            totalCnt2 = parseInt(ollyoungList.length) - aplyDdl;
                            var $li = $("<li>");
                            $ulEvent.append($li);
                            var $thum = $("<p>").addClass("thum").attr("onclick","mmain.event.ollyoungGoodsDetail('"+element.custFvrAplyTgtNo+"','"+index+"');");
                            $li.append($thum);
                            var url = [];
                            url.push($("#_goodsImgUploadUrl").val()+"550/");
                            url.push(element.imgPathNm);
                            var $img = $("<img>").attr("src",url.join("")).attr('onerror',"common.errorImg(this);").attr("alt","이벤트 이미지");
                            $thum.append($img);
                            var $info = $("<div>").addClass("info");
                            $li.append($info);
                            var $dl = $("<dl>").addClass("txt");
                            $info.append($dl);
                            var $dt = $("<dt>").text(element.custFvrAplyTgtVal);
                            $dl.append($dt);
                            var $dd = $("<dd>").html(element.custFvrAplyTgtTxt.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
                            $dl.append($dd);
                            var $state = $("<div>").addClass("state");
                            $info.append($state);
                            var $p1 = $("<p>").addClass("state_01");
                            $state.append($p1);
                            var $em1 = $("<em>").text("모집인원");
                            $p1.append($em1);
                            var strRcrtCnt = element.rcrtCnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            var $spanFr = $('<span>').addClass('fr');
                            $spanFr.text(strRcrtCnt);
                            $p1.append($spanFr);
                            $p1.append("명");
//                            $p1.append(strRcrtCnt+"명");
                            var $p2 = $("<p>").addClass("state_01 colog");
                            $state.append($p2);
                            var $em2 = $("<em>").text("신청인원");
//                            var strRegNum = element.regNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            var $span1 = '';
                            //2020.07.20 신청인원 초과 수정
                            if(parseInt(element.regNum) >= parseInt(element.rcrtCnt)){
                            	$span1 = $("<span>").addClass("colog fr").text(element.rcrtCnt); 
                            }else{
                            	$span1 = $("<span>").addClass("colog fr").text(element.regNum);
                            }
                            //20200720 원본
//                            var $span1 = $("<span>").addClass("colog fr").text(element.regNum);
                            $p2.append($em2);
                            $p2.append($span1);
                            $p2.append("명");
                            var $p3 = $("<p>").addClass("btnApply");
                            $state.append($p3);
                            var $dis = $("<button>");
                            var aplyBtnChk2 = 'Y';
                            if(parseInt(element.regNum) >= parseInt(element.rcrtCnt) || endDate.getTime() < nowDate.getTime()){
                                $dis.addClass("dis").text("신청마감");
                                aplyBtnChk2 = 'N';
                            }else{
//                                $dis.addClass("btnApplyLayer").text("신청하기");
                                $dis.addClass("btnApplyLayer").attr('onclick','mmain.event.btnApplyClick("'+evtNo+'","'+ollyoungMbrYn+'","'+ ollyoungEventGoodsNo +'","'+element.custFvrAplyTgtNo+'","'+index+'" );').text("신청하기");
                            }
                            var inputId = "custFvrAplyTgtNo"+index;
                            var $input = $('<input>').attr("type","hidden").attr("id",inputId).attr("name","custFvrAplyTgtNo").attr("value",element.custFvrAplyTgtNo);
                            $p3.append($input);
                            $p3.append($dis);
                            if(totalCnt2 >= 4){
                                if(itemCnt == 3){
                                    $ulEvent.append($li);
                                    var $banner = mmain.event.topRnkBanner();
                                    $li.append($banner);
                                }
                            }else{
                                if(parseInt(totalCnt2)-1 == index && pageIdx == 1 ){
                                    $ulEvent.append($li);
                                    var $banner = mmain.event.topRnkBanner();
                                    $li.append($banner);
                                }
                            }
                            $thum.click(function(){
                                location.href = _baseUrl+"goods/getGoodsDetail.do?goodsNo="+element.custFvrAplyTgtNo;
                            });
                            if(aplyBtnChk2 == 'Y'){
                                $dis.on('touchend',function(){
                                     mmain.event.btnApplyClick(evtNo,ollyoungMbrYn,ollyoungEventGoodsNo,element.custFvrAplyTgtNo,index);
                                });
                             }
                            itemCnt++;
                    }
                }
            });
        }

//        $("#sEvtKeyWord").change(function() {
//            mmain.event.getOllyoungListAjax($("#sEvtKeyWord").val());
//        });

        }//else end
    }, //end


    lineSelset : function(){
        if($("#sEvtKeyWord").val() == null || $("#sEvtKeyWord").val() == ''){
            common.wlog("event_ollyoungSelect_List");
        }else if($("#sEvtKeyWord").val() == 'A'){
            common.wlog("event_ollyoungSelect_All");
        }else if($("#sEvtKeyWord").val() == 'S'){
            common.wlog("event_ollyoungSelect_Select");
        }else{
            common.wlog("event_ollyoungSelect_List");
        }
        mmain.event.getOllyoungListAjax($("#sEvtKeyWord").val());
    },
    ollyoungGoodsDetail : function(custFvrAplyTgtNo,index){
        var indexVal = parseInt(index)+1;
        common.wlog("event_ollyoung_banner_"+indexVal);
        location.href = _baseUrl+"goods/getGoodsDetail.do?goodsNo="+custFvrAplyTgtNo;
    },
    divIntroClick : function(){
        //띠배너1
        common.wlog("event_ollyoungInfo_banner");
        mmain.event.bannerOpen();
    },
    bannerExClick : function(){
        //띠배너2
        common.wlog("event_topReviewer_banner");
        mmain.event.topBannerOpen();
    },
    //올체 리스트//신청하기버튼 클릭이벤트
    btnApplyClick : function(evtNo,ollyoungMbrYn,ollyoungEventGoodsNo,custFvrAplyTgtNo,index){
    event.preventDefault();
    mmain.event.ollyoungIndex = parseInt(index)+1;
    var custFvrAplyTgtNo = event.target.previousSibling.value;
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm('올영체험단은 모바일 APP에서 신청 가능해요.\n바로 APP 설치해보세요!')){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=main/getOllyoungList.do");
            }else{
                return;
            }
        } else {
            if(common.isLogin() == false){
                common.link.moveLoginPage("N", _plainUrl +"main/getOllyoungList.do");
                return ;
            }else{
                if(ollyoungMbrYn == '0'){
                    alert('올영체험단에 초대된 회원만 신청 가능해요.\n탑리뷰어가 되면 초대 확률이 올라가요!');
                    return false;
                }else{             
                    var valiCnt = mmain.event.ollyoungValiCheck(evtNo);
                    if(parseInt(valiCnt) == 0){
                        mmain.event.getOllyoungApplyDetailAjax(custFvrAplyTgtNo, evtNo);
                        common.setScrollPos();
                        common.popFullOpen("올영체험단 신청", "");
                    }else{
                        var goodsNo = mmain.event.ollyoungAplyCheck(evtNo,custFvrAplyTgtNo);
                        if(goodsNo == custFvrAplyTgtNo ){
                            if(!confirm('이미 신청 완료 되었습니다. 올영체험단 신청 내역으로 이동하시겠어요?')){
                                return ;
                            }else{
                                common.link.moveMyPageOllyoungList();
                            }
                        }else{
                            alert('이미 다른 상품의 올영체험단을 신청하셨습니다.\n동일기간 내에는 1개의 상품만 신청 가능합니다.');
                        }
                    }
                }
            }  
        }
    },


    dispOyPopup : function(){
           $("#pop-full-title").text("올영체험단 소개");

           var $popCont = $("<div>").addClass("boxbgw");

           $("#pop-full-contents").empty().append($popCont);

           //ex_info_box start!!
           var $ex_info_box = $("<div>").addClass("ex_info_box");
           $popCont.append($ex_info_box);

           var $tit = $("<h3>").addClass("tit").text("올영체험단은 이렇게 진행됩니다.");
           $ex_info_box.append($tit);

           var $list1 = $("<ul>").addClass("list");
           $ex_info_box.append($list1);

           var $li1 = $("<li>");
           $list1.append($li1);
           var $thum_img01 = $("<em>").addClass("thum img01").text("초대");
           $li1.append($thum_img01);
           var $txt_box1 = $("<div>").addClass("txt_box");
           $li1.append($txt_box1);
           var $inner1 = $("<dl>").addClass("inner");
           $txt_box1.append($inner1);
           var $dt1 = $("<dt>").text("초대알림 수신");
           $inner1.append($dt1);
           var $dd1 = $("<dd>").text("APP PUSH SMS 수신 동의 필수");
           $inner1.append($dd1);

           var $li2 = $("<li>");
           $list1.append($li2);
           var $thum_img02 = $("<em>").addClass("thum img02").text("신청");
           $li2.append($thum_img02);
           var $txt_box2 = $("<div>").addClass("txt_box");
           $li2.append($txt_box2);
           var $inner2 = $("<dl>").addClass("inner");
           $txt_box2.append($inner2);
           var $dt2 = $("<dt>").text("상품 신청");
           $inner2.append($dt2);
           var $dd2 = $("<dd>").text("ID당 상품 1개 신청 가능");
           $inner2.append($dd2);

           var $li3 = $("<li>");
           $list1.append($li3);
           var $thum_img03 = $("<em>").addClass("thum img03").text("작성");
           $li3.append($thum_img03);
           var $txt_box3 = $("<div>").addClass("txt_box");
           $li3.append($txt_box3);
           var $inner3 = $("<dl>").addClass("inner");
           $txt_box3.append($inner3);
           var $dt3 = $("<dt>").text("리뷰 작성");
           $inner3.append($dt3);
           var $dd3 = $("<dd>").text("초대 후 3주 내 미작성 시 재초대 대상자에서 제외");
           $inner3.append($dd3);

           //ex_info_box end

           //lineBox2 start
           var $lineBox2_1 = $("<div>").addClass("lineBox2");
           $popCont.append($lineBox2_1);
           var $inner4 = $("<div>").addClass("inner");
           $lineBox2_1.append($inner4);
           var $txt_info1 = $("<dl>").addClass("txt_info");
           $inner4.append($txt_info1);
           var $dt4 = $("<dt>").text("어떻게 초대받나요?");
           $txt_info1.append($dt4);
           var $dd4 = $("<dd>").text("초대 대상자는 리뷰 작성 활동을 활발히 하는 리뷰어 ");
           $txt_info1.append($dd4);
           var $colb1 = $("<em>").addClass("colb").text("랭킹 순위 1,000위 이내의 탑리뷰어");
           $dd4.append($colb1);
           $dd4.append("입니다.");

           var $lineBox2_2 = $("<div>").addClass("lineBox2");
           $popCont.append($lineBox2_2);
           var $inner5 = $("<div>").addClass("inner");
           $lineBox2_1.append($inner5);
           var $txt_info2 = $("<dl>").addClass("txt_info");
           $inner5.append($txt_info2);
           var $dt5 = $("<dt>").text("탑리뷰어가 되는 방법은?");
           $txt_info2.append($dt5);
           var $dd5 = $("<dd>").text("아래 활동 점수가 높으면 리뷰어 랭킹이 올라갑니다.");
           $txt_info2.append($dd5);
           var $gbox = $("<dd>").addClass("gbox");
           $txt_info2.append($gbox);
           var $list2 = $("<ul>").addClass("list");
           $gbox.append($list2);
           var $li4 = $("<li>").text("1. 리뷰 작성 수");
           $list2.append($li4);
           var $li5 = $("<li>").text("2. 도움이 돼요 평가한 수");
           $list2.append($li5);
           var $li6 = $("<li>").text("3. 도움이 돼요 받은 수");
           $list2.append($li6);
           var $li7 = $("<li>").text("4. 최근 활동 지수");
           $list2.append($li7);
           var $dd6 = $("<dd>").html("리뷰가 없는 상품에 작성하면 보너스!<br />" +
                "포토 리뷰가 더 도움이 돼요!");
           $txt_info2.append($dd6)
           //linebox2 end

           var $btnArea_btm = $("<div>").addClass("btnArea btm");
           $("#pop-full-contents").append($btnArea_btm);

           var $btnSet_pd1 = $("<div>").addClass("btnSet pd1 two clrfix");
           $btnArea_btm.append($btnSet_pd1);

           var $btnL = $("<div>").addClass("btn btnL");
           $btnSet_pd1.append($btnL);
           var $btnBlackLineH50_1 = $("<button>").addClass("btnBlackLineH50 half").text("APP PUSH 수신 동의");
           $btnBlackLineH50_1.attr("id","agreePushMove");
           $btnL.append($btnBlackLineH50_1);
           var $btnR = $("<div>").addClass("btn btnR");
           $btnSet_pd1.append($btnR);
           var $btnBlackLineH50_2 = $("<button>").addClass("btnBlackLineH50 half").text("SMS 수신 동의");
           $btnBlackLineH50_2.attr("id","agreeSmsMove");
           $btnR.append($btnBlackLineH50_2);

           $('#agreePushMove').click(function(){
               if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
                   if(confirm('올영체험단은 모바일 APP에서 신청 가능해요.\n바로 APP 설치해보세요!')){
                       common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=main/getOllyoungList.do");
                   }else{
                       return;
                   }
               }else{
                   location.href = "oliveyoungapp://settings";
               }
           });
           //올영로그인
           $('#agreeSmsMove').click(function(){
               if(common.isLogin() == true){
                   common.link.moveMyPageSetting();
               }else{
                   common.link.moveLoginPage("N", location.href);
               }
           });
       },

       dispTopRvrPopup : function(){
//         $("#pop-full-title").text("탑 리뷰어 소개");
           var $popLayerArea = $('<div>').addClass('popLayerArea');
           $('#lay_top_reviewer').empty().append($popLayerArea);
           var $popInner = $('<div>').addClass('popInner');
           $popLayerArea.append($popInner);
           var $popHeader = $('<div>').addClass('popHeader');
           $popInner.append($popHeader);
           var $poptitle = $('<h1>').addClass('popTitle').text('탑리뷰어 소개');
           $popHeader.append($poptitle);
           var $aBtn = $('<a>').addClass('btnClose').attr('href','#none').attr("onclick","common.popLayerClose('lay_top_reviewer');return false;").text('닫기');
           $popHeader.append($aBtn);
           var $popContainer = $('<div>').addClass('popContainer');
           var $popCont= $('<div>').addClass('popCont');
           $popInner.append($popContainer);
           $popContainer.append($popCont);
           //ex_info_box start!!
           var $layerInner = $("<div>").addClass("layerInner pdLR15");
           $popCont.append($layerInner);

           $p1 = $("<p>").addClass("txt_01").text('매주 월요일 리뷰 작성과 평가 활동을 활발하게 한 리뷰어 ');
           $span1 = $("<span>").addClass("colr str").text('TOP 1,000');
           $layerInner.append($p1);
           $p1.append($span1);
           $p1.append(" 위를 공개합니다.");
           $box_tline01 = $('<div>').addClass('box_tline01 mgT15');

           $layerInner.append($box_tline01);

           $dl1 = $('<dl>').addClass('txt_info');
           $dt1 = $('<dt>').text('리뷰어 랭킹 올리는 TIP!');
           $dd1 = $('<dd>').html('아래 활동을 많이 하실수록 리뷰어 랭킹이 UP! UP!<br>게다가 보너스 점수까지!');
           $dd2 = $('<dd>').addClass('gbox');

           $box_tline01.append($dl1);
           $dl1.append($dt1);
           $dl1.append($dd1);
           $dl1.append($dd2);

           $ul1 = $('<ul>').addClass('list clrfix');
           $li1 = $('<li>').text('1. 리뷰 작성 수');
           $li2 = $('<li>').text('2. 리뷰에 포토 추가 등록');
           $li3 = $('<li>').text('3. 도움이 돼요 받은 수');
           $li4 = $('<li>').text('4. 도움이 돼요 평가한 수');

           $dd2.append($ul1);
           $ul1.append($li1);
           $ul1.append($li2);
           $ul1.append($li3);
           $ul1.append($li4);


           $dl2 = $('<dl>').addClass('txt_info');
           $dt2 = $('<dt>').text('추가 보너스!');
           $dd3 = $('<dd>').html('리뷰없는 상품의 첫 리뷰를 작성 시 추가 보너스<br/>매일 활동할수록 추가 보너스');
           $box_tline01.append($dl2);
           $dl2.append($dt2);
           $dl2.append($dd3);


           $dl3 = $('<dl>').addClass('txt_info');
           $dt3 = $('<dt>').text('올영체험단 기회');
           $dd4 = $('<dd>').text('탑리뷰어 선정 시, 올영체험단 초대 확률이 올라갑니다.');
           $box_tline01.append($dl3);
           $dl2.append($dt3);
           $dl2.append($dd4);

       },
       //탑리뷰어 배너
       topRnkBanner : function(){
           var $banner_ex = $("<div>").addClass("banner_ex in").attr('onclick','mmain.event.bannerExClick();');
//           $banner_ex.click(function(){
//             mmain.event.topBannerOpen();
//            });
           var $aTag = $("<a>").attr("href","javascript:;");
           $banner_ex.append($aTag);
           
           //탑리뷰어 배너 세팅
           var dispImgUrl = $('#dispImgUrl').val();
           var topBnrImgUrl = $('#topBnrImgUrl').val();
           var topBnrImgTxtCont = $('#topBnrImgTxtCont').val();
           var imgUrl = dispImgUrl + topBnrImgUrl;
           var $img = $("<img>").attr("src",imgUrl).attr('onerror',"common.errorImg(this);")
                             .attr("alt",topBnrImgTxtCont);
           $aTag.append($img);
           return $banner_ex;
       },

       ollyoungValiCheck : function(evtNo){
           var valiCnt = "";
           var param = {
                     evtNo : evtNo
             }

           common.Ajax.sendRequest(
                   "GET"
                   , _baseUrl + "main/valiOllyoungJson.do"
                 , param
                 , function(res) {
                     valiCnt = res.cnt;
                 }
                 , false
           );
           return valiCnt;


       },
       
       ollyoungAplyCheck : function(evtNo,custFvrAplyTgtNo){
           var goodsNo = "";
           var param = {
                     evtNo : evtNo,
                     goodsNo : custFvrAplyTgtNo
             }
           common.Ajax.sendRequest(
                   "GET"
                   , _baseUrl + "main/getValiOllyoungAplyCheckJson.do"
                 , param
                 , function(res) {
                       goodsNo = res.goodsNo;
                 }
                 , false
           );
           return goodsNo;
       },
       
       oyApplyLayerPopup : function(detail){
               var custFvrAplyTgtNo = detail.custFvrAplyTgtNo;
               var evtNo = detail.evtNo;
               $("#pop-full-title").text("올영체험단 신청");

               var $reviews_wrap = $("<div>").addClass("reviews_wrap");
               $("#pop-full-contents").empty().append($reviews_wrap);

               var $item_info_clrfix = $("<div>").addClass("item_info clrfix");
               $reviews_wrap.append($item_info_clrfix);
               var $span1 = $("<span>").addClass("thum");
               $item_info_clrfix.append($span1);
               var imgUrl = [];
               imgUrl.push($("#_goodsImgUploadUrl").val()+"320/");
               imgUrl.push(detail.imgPathNm);
               var $img = $("<img>").attr("src",imgUrl.join("")).attr('onerror',"common.errorImg(this);")
                                 .attr("alt","");
               $span1.append($img);
               var $dl1 = $("<dl>").addClass("txt_info");
               $item_info_clrfix.append($dl1);
               var $dt1 = $("<dt>").text(detail.onlBrndNm);
               $dl1.append($dt1);
               var $dd1 = $("<dd>").text(detail.custFvrAplyTgtVal)
               $dl1.append($dd1);
               var $dd2 = $("<dd>").addClass("option clrfix");
               $dl1.append($dd2);
//             var $em1 = $("<em>").addClass("line").text("옵션");
//             var $span2 = $("<span>").addClass("txt_op").text("으아아아ㅏㄱ!!!");
//             $dl1.append($em1);
//             $dl1.append($span2);

               var $innerBoxType = $("<div>").addClass("innerBoxType");
               $("#pop-full-contents").append($innerBoxType);
               var $accBox = $("<div>").addClass("accBox");
               $innerBoxType.append($accBox);

               var $head_box_on1 = $("<div>").addClass("head_box on");
               $accBox.append($head_box_on1);
               var $checkin1 = $("<div>").addClass("checkin");
               $head_box_on1.append($checkin1);
               var $privacy1 = $("<input>").addClass("chkSmall").attr("type","checkbox").attr("id","privacy1");
               $checkin1.append($privacy1);
               var $label1 = $("<label>").attr("for","privacy1").text("(필수) 개인정보 수집 이용 동의");
               $checkin1.append($label1);
               var $btn1 = $("<button>").addClass("btnacc").attr("type","button").text("열기");
               $head_box_on1.append($btn1);

               var $cons1 = $("<div>").addClass("conts");
               $accBox.append($cons1);
               var $ul1 = $("<ul>").addClass("dash_list_type");
               $cons1.append($ul1);
               var $li2 = $("<li>").text("수집항목 : "+detail.mbrInfoCllctItm);
               $ul1.append($li2);
               var $li3 = $("<li>").text("수집 이용 및 목적 : "+detail.mbrInfoCllctPrps);
               $ul1.append($li3);
               var $li1 = $("<li>").addClass("str").text("보유 및 이용기간 : "+detail.mbrInfoCllctRtnPrd);
               $ul1.append($li1);
               var $li4 = $("<li>").text("개인정보 수집 이용에 동의하지 않을 수 있으나, 미동의 시 이벤트 참여가 불가합니다.");
               $ul1.append($li4);

               var $head_box_on2 = $("<div>").addClass("head_box on");
               $accBox.append($head_box_on2);
               var $checkin2 = $("<div>").addClass("checkin");
               $head_box_on2.append($checkin2);
               var $privacy2 = $("<input>").addClass("chkSmall").attr("type","checkbox").attr("id","privacy2");
               $checkin2.append($privacy2);
               var $label2 = $("<label>").attr("for","privacy2").text("(필수) 개인정보 취급 위탁 동의");
               $checkin2.append($label2);
               var $btn2 = $("<button>").addClass("btnacc").attr("type","button").text("열기");
               $head_box_on2.append($btn2);

               var $cons2 = $("<div>").addClass("conts");
               $accBox.append($cons2);
               var $ul2 = $("<ul>").addClass("dash_list_type");
               $cons2.append($ul2);
               var entrNm = null;
               if(detail.custFvrAplyTgtCetp == null || detail.custFvrAplyTgtCetp == '') {
                   entrNm = detail.entrNm;
               }else{
                   entrNm = detail.custFvrAplyTgtCetp;
               }
               var $li5 = $("<li>").text("개인정보처리 위탁사 : "+entrNm);
               $ul2.append($li5);
               var $li6 = $("<li>").text("개인정보 위탁 항목 : "+detail.mbrInfoHndlCtgr);
               $ul2.append($li6);
               var $li7 = $("<li>").text("개인정보 처리 위탁 내용 : "+detail.mbrInfoHndlCont);
               $ul2.append($li7);
               var $li8 = $("<li>").text("개인정보 처리 위탁 기간 : "+detail.mbrInfoHndlRtnPrd);
               $ul2.append($li8);
               var $li9 = $("<li>").text("개인정보 수집 이용에 동의하지 않을 수 있으나, 미동의 시 이벤트 참여가 불가합니다.");
               $ul2.append($li9);


               var $siblingBox = $("<div>").addClass("siblingBox");
               $("#pop-full-contents").append($siblingBox);
               var $tit_line1 = $("<h3>").addClass("tit_line").text("유의사항");
               $siblingBox.append($tit_line1);
               var $line_inner1 = $("<div>").addClass("line_inner");
               $siblingBox.append($line_inner1);
               var $ul3 = $("<ul>").addClass("dash_list_type fc");
               $line_inner1.append($ul3);
//               var $li10 = $("<li>").text(detail.atndConts) ;
//             var $li11 = $("<li>").text("유의사항!!!!!!!!!!!내용!!!!!!!") ;
//               $($ul3).append($li10);
//             $($ul3).append($li11);
               var atndContsRep = detail.atndConts.replace(/(?:\r\n|\r|\n)/g, '<br />');
               var atndContsArr = atndContsRep.split('<br />');
               for(var i=0; i< atndContsArr.length; i++){
                   var $li10 = $("<li>").html(atndContsArr[i]) ;
                   $($ul3).append($li10);
               }
               var $p1 = $("<p>").addClass("btnType");
               $siblingBox.append($p1);
               var $btn3 = $("<button>").attr('id','dlrBtn').text("배송지 정보 수정");
               $p1.append($btn3);

               var $btnArea_btm = $("<div>").addClass("btnArea btm");
               $("#pop-full-contents").append($btnArea_btm);
               var $btnSet_two_clrfix = $("<div>").addClass("btnSet two clrfix");
               $btnArea_btm.append($btnSet_two_clrfix);
               var $btn3 = $("<button>").addClass("btnGrayH28 btnDel").attr('id','aplyCancel').text("취소");
               $btnSet_two_clrfix.append($btn3);
               var $btnR = $("<div>").addClass("btnR");
               $btnSet_two_clrfix.append($btnR);
               var $btnGreen_types = $("<button>").addClass("btnGreen types").attr('id','aplyConfirm').text("신청하기");
               $btnR.append($btnGreen_types);

               $('.btnacc').on('click', function(){
                    var _this= $(this);
                    var _thisHead = _this.closest('.head_box');
                    if(_thisHead.hasClass('on') == true){
                        _this.html('닫기');
                        _thisHead.removeClass('on');
                    }else{
                        _this.html('열기');
                        _thisHead.addClass('on');
                    }
               });

               $('#dlrBtn').on('click', function(){
                    common.link.moveMyPageDeliveryInfo();
               });

               $('#aplyCancel').on('click', function(){
                    common.popFullClose();
               });

               $('#aplyConfirm').on('click', function(){
                   $('#aplyConfirm').attr("disabled","disabled");
                   var privacy1 =  $("input:checkbox[id='privacy1']").is(":checked");
                   var privacy2 =  $("input:checkbox[id='privacy2']").is(":checked");
                   if(privacy1 == true && privacy2 == true){
                       var tmpStrtDate = detail.startDate;
                       var tmpEndDate =  detail.endDate;
                       var strtArr = tmpStrtDate.split("/");
                       var endArr = tmpEndDate.split("/");
                       var strtDate = new Date(strtArr[0], strtArr[1], strtArr[2]);
                       var endDate = new Date(endArr[0], endArr[1], endArr[2]);
                       var tmpNowDate =  detail.nowDate;
                       var nowArr = tmpNowDate.split("/");
                       var nowDate = new Date(nowArr[0], nowArr[1], nowArr[2]);
                       var valiCnt = mmain.event.ollyoungValiCheck(evtNo);

                       if(strtDate.getTime() <= nowDate && endDate >= nowDate){
                           if(parseInt(valiCnt) == 0 ){
                               common.wlog("event_ollyoung_apply_"+mmain.event.ollyoungIndex);
                             mmain.event.getOllyoungApplyRegAjax(custFvrAplyTgtNo, evtNo);
                           }else{
                               alert('이미 다른 상품의 올영체험단을 신청하셨습니다.\n동일기간 내에는 1개의 상품만 신청 가능합니다.');
                               $('#aplyConfirm').removeAttr("disabled");
                           }
                       }else{
                           alert('죄송합니다.\n해당 상품의 올영체험단 신청이 마감되었습니다.\n다른 상품으로 신청해 주세요.');
                           $('#aplyConfirm').removeAttr("disabled");
                       }
                   }else {
                       alert('개인정보 수집 이용 동의와 개인정보 취급 위탁 동의를 모두 체크하셔야 신청 가능합니다.');
                       $('#aplyConfirm').removeAttr("disabled");
                   }
               });

           }
};


$.namespace("mmain.coupon");
mmain.coupon = {
    _ajax : common.Ajax,

    nextPageIdx : 1,
    mbrGradeCd : "",
    comtSaveChk : true,

    init : function() {
    	
    	console.log("[mmain.coupon.init]");
    	
        // 탭 동작
        $('#mTab').find('a').on({'click' : function(e){
            e.preventDefault();
            $(this).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on').removeAttr('title');

            PagingCaller.destroy();

            var tabIdx = $(this).parent().index();

            if(tabIdx == 0){

                setTimeout(function() {
                    common.wlog("membership_lounge_tap");
                    mmain.coupon.getMembershipAjax();
                }, 300);
            } else {
                setTimeout(function() {
                    common.wlog("coupon_coupon_tab");
                    mmain.coupon.getCouponAjax();
                }, 300);
            }
        }});

        //쿠폰받기버튼
        $(".couponBox .inner a span.down").bind("click", function() {
            common.wlog("coupon_coupon_receive");
        });
        //앱다운로드 받기버튼
        $("#btnRroundAH30").bind("click", function() {
            common.wlog("coupon_coupon_appdown");
        });

        $("#sendSMS").click(function(){
            var phoneNum = $(this).parent("input[name*=phoneNum]").val();
        });

        mmain.coupon.commonEventSet();
        mmain.coupon.commonBenefitSet();
        common.app.init();

        if($("#membership").hasClass("on")){
            $("#mTab").find("a").eq(0).click();
        } else {
            $("#mTab").find("a").eq(1).click();
        }

        var startIdx = 1;

        if ($(".evtEplgList").attr("data-ref-pageIdx") != undefined && $(".evtEplgList").attr("data-ref-pageIdx") != "") {
            startIdx = parseInt($(".evtEplgList").attr("data-ref-pageIdx"));
        }

        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        mmain.coupon.getEpilogueListPagingAjax(startIdx);

        // 댓글영역 이벤트
        $('.textarea_wrap textarea').on('focus', function(){
            $('.txtArea_box .tit').hide();

            $('.pageFullWrap').addClass('on');
            $('html, body').scrollTop(1);

        });

        $('.textarea_wrap textarea').on('blur',function(){
            //$('.pageFullWrap').removeClass('on ios');
            $('.pageFullWrap').removeClass('on');
        });
    },

    commonEventSet : function(){

        $("#dscntList ul li").click(function(){
            var index = $("#dscntList li").index(this) ;
            if(index< 10){
                common.wlog("coupon_benefit_card_1_" + Number(index + 1));
            }

            // 링크 변경
            var urlInfo = $(this).find("input[name*=urlInfo]").val();
            if(!common.isEmpty(urlInfo)){
                common.link.commonMoveUrl(urlInfo);
            }
        });

        $("#nintInstList ul li").click(function(){

            var index = $("#nintInstList li").index(this) ;
            if(index< 10){
                common.wlog("coupon_benefit_card_3_" + Number(index + 1));
            }
            // 링크 변경
            var urlInfo = $(this).find("input[name*=urlInfo]").val();
            if(!common.isEmpty(urlInfo)){
                common.link.commonMoveUrl(urlInfo);
            }
        });

        $(".couponBandBanner > a").click(function(){
            if(common.isLogin() == false){

                if(!confirm("로그인 후 신청하실 수 있습니다.로그인 페이지로 이동하시겠습니까?")){
                    return ;
                }else{
                    common.loginChk();
                    return ;
                }
            }
            common.wlog("coupon_coupon_register");
            common.coupon.getRegCouponForm();
        });


        $(".couponPop").click(function(){
            mmain.coupon.setPopup($(this));
        });

        $(".btnRroundH30.memLogin").click(function(){
            common.loginChk();
        });

        $(".couponBox").click(function(){
            if(common.isLogin() == false){

                if(!confirm("로그인 후 다운로드 가능합니다. 로그인 페이지로 이동하시겠습니까?")){
                    return ;
                }else{
                    common.loginChk();
                    return ;
                }
            }
            common.wlog("coupon_coupon_receive");
            mmain.coupon.downCouponJson($(this));
        });
        
        //쿠폰받기버튼 추가 2020.02.13
        $(".btn_cpdw").unbind('click');
        
        $(".btn_cpdw").bind("click", function() {
            if(common.isLogin() == false){
                if(!confirm("로그인 후 다운로드 가능합니다. 로그인 페이지로 이동하시겠습니까?")){
                    return ;
                }else{
                    common.loginChk();
                    return ;
                }
            }
            common.wlog("coupon_coupon_receive");
            mmain.coupon.downCouponJson($(this));
        });
        
        $("#btnRroundAH30").click(function(){
            var iphoneAppDownUrl = $("#iphoneAppDownUrl").val();
            var androidAppDownUrl = $("#androidAppDownUrl").val();

            var osType = common.app.parser.getOS().name;
            if(osType == "android" || common.isEmpty(osType)){
                $(location).attr('href', androidAppDownUrl);
            }else {
                $(location).attr('href', iphoneAppDownUrl);
            }

        });

        $(".membershipRoungeBanner > a").click(function(){
            common.link.getMembershipBenefitInfoMoveUrl();
        });

        //멤버십 등급 별 혜택 >> 선정기준 팝업 닫기 추가
        /*$(".btnGreen").on("click", function(e){
            popLayerClose('LAYERPOP01');
            return false;
        });*/
    },

    commonBenefitSet : function(){
        $('.gradeBenefit').find('a').on({
            'click' : function(e){
                e.preventDefault();
                $(this).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on').removeAttr('title');
                $('.boxBenefit:eq('+ $(this).parent().index() +')').removeClass('hide').siblings().addClass('hide');
            }
        });

        var onCnt = 0;
        $('.grade > li').each(function(){
            if(!$(this).hasClass('on')){
                $('.boxBenefit:eq('+ $(this).index() +')').addClass('hide');
            } else {
                onCnt++;
            }
        });
        if(onCnt <= 0){
            // VVIP/VIP 고객일 경우, 온라인몰 등급이 없으므로 GOLD 등급 혜택 설명을 노출함
            $('.boxBenefit:eq(0)').removeClass('hide').siblings().addClass('show');
        }

        //띠배너
        $(".couponBandBanner a").bind("click", function() {
            common.wlog("coupon_benefit_banner");
        });

        //띠배너
        $(".membershipRoungeBanner a").bind("click", function() {
            //common.link.commonMoveUrl();
        });
    },

    // 쿠폰탭 클릭
    getCouponTab : function(){
        $('#mTab > li').eq(2).find('a').click();
    },

    // 올리브영 멤버십탭 클릭
    getMembershipTab : function(){
        $('#mTab > li').eq(0).find('a').click();
    },

    getCouponAjax : function() {

        common.showLoadingLayer(false);
        $(document).scrollTop(0);

        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "main/getCouponAjax.do"
                , "couponMode=reOpen"
                , this._callback_getCouponAjax);
        common.hideLoadingLayer();

    },

    _callback_getCouponAjax : function(strData) {

        $("#couponMainHtml").empty();
        $("#couponMainHtml").append(strData);

        setTimeout(function() {

            //BI Renewal. 20190918. nobbyjin. sessionStorage 제외
            //sessionStorage.setItem("saved_slide_html", $('#mContainer').html());

            mmain.coupon.commonEventSet();

        }, 300);

    },

    downCouponJson : function(obj) {

        var cpnNo = obj.find("input[name*=cpnNo]").val();

        common.showLoadingLayer(false);
        var param = {cpnNo : cpnNo};
        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "main/downCouponEncJson.do"
                , param
                , this._callback_downCouponJson);

        common.hideLoadingLayer();
    },

    _callback_downCouponJson : function(strData) {

        if(strData.ret == '-1'){
            common.loginChk();
        }else{
            alert(strData.message);
            if(strData.ret == '0'){
            	mmain.coupon.getCouponAjax();
            }
        }
    },


    getBenefitsAjax : function() {

        common.showLoadingLayer(false);
        $(document).scrollTop(0);

        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "main/getBenefitsAjax.do"
                , ''
                , this._callback_getBenefitsAjax);
        common.hideLoadingLayer();
    },

    _callback_getBenefitsAjax : function(strData) {

        $("#couponMainHtml").empty();
        $("#couponMainHtml").append(strData);

        setTimeout(function() {

//            sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        	sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

            mmain.coupon.commonBenefitSet();

        }, 300);

    },

    /**
     * 2018-02-22 멤버십/쿠폰 개편
     * - 올리브영 멤버십
     */
    getMembershipAjax : function() {

        common.showLoadingLayer(false);
        $(document).scrollTop(0);

        var data = new Object();

        // bo에서 미리보기 일때 eplgPreview  값이 존재
        if($("#viewMode").val() != null){
            data.eplgNo = $("#prvEplgNo").val();
            data.viewMode = $("#viewMode").val();
        }

        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "main/getMembershipRoungeAjax.do"
                , data
                , this._callback_getMembershipAjax);
        common.hideLoadingLayer();
    },
    _callback_getMembershipAjax : function(strData) {

        $("#couponMainHtml").empty();
        $("#couponMainHtml").append(strData);

        setTimeout(function() {

            //BI Renewal. 20190918. nobbyjin. sessionStorage 제외
            //sessionStorage.setItem("saved_slide_html", $('#mContainer').html());

            mmain.coupon.commonBenefitSet();
            mmain.coupon.commonEventSet();

        }, 300);

    },

    /**
     * 2018-02-22 멤버십/쿠폰 개편
     * - 온라인몰 멤버십
     */
    getOnmembershipAjax : function() {

        common.showLoadingLayer(false);
        $(document).scrollTop(0);

        this._ajax.sendRequest(
                "GET"
                , _baseUrl + "main/getOnmembershipAjax.do"
                , ''
                , this._callback_getOnmembershipAjax);
        common.hideLoadingLayer();
    },
    _callback_getOnmembershipAjax : function(strData) {

        $("#couponMainHtml").empty();
        $("#couponMainHtml").append(strData);

        setTimeout(function() {

//            sessionStorage.setItem("saved_slide_html", $('#mContainer').html());
        	sessionStorage.setItem("saved_slide_html", mmain.main.getCurrentSlideHtml());

            mmain.coupon.commonBenefitSet();

        }, 300);

    },


    setPopup : function(obj){

        var $dispArea = $("#couponDescInfoLPop").find(".listHyphen");
        $dispArea.empty();

        var html = obj.parent().parent().find("div[name=cardHtmlCont]").html();
        $dispArea.append(html);


        $("#pop-full-contents").html($("#couponDescInfoLPop").html());
        common.popFullOpen("쿠폰 안내");
    },

    popLayerOpen : function() {
        common.popLayerOpen("LAYERPOP01");
    },

    popLayerClose : function() {

        common.popLayerClose('LAYERPOP01');

        var popLayer = $(".popLayerWrap");
        var mHeader = $('#mHeader');
        $(popLayer).hide().parents('body').removeAttr('style');
        $('.dim').hide();

    },

    eventListClick : function(evtNo, urlInfo){

        if(!common.isEmpty(urlInfo)){
            common.link.commonMoveUrl(urlInfo);
        }else{
            common.link.moveEventDetailPage(evtNo);
        }
    },
    getEpilogueListPagingAjax : function(startIdx){

        // view 모드일때 페이징 하지 않음
        if($("#viewMode").val() != ""){
            return false;
        }

        PagingCaller.init({
            callback : function(){

                mmain.coupon.nextPageIdx = PagingCaller.getNextPageIdx();

                var param = {
                    pageIdx : mmain.coupon.nextPageIdx
                    , mbrGradeCd : mmain.coupon.mbrGradeCd
                };

                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "main/getEpilogueListPagingAjax.do"
                        , param
                        , mmain.coupon.getEpilogueListPagingAjaxCallback
                );

            }
            , startPageIdx : startIdx
            , subBottomScroll : 1200
            , initCall : (startIdx > 0) ? false : true
        });

    },
    getEpilogueListPagingAjaxCallback : function(res){
        if (res.trim() == "") {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
        } else {
            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $(".evtEplgList").append(res);

            $(".evtEplgList").attr("data-ref-pageIdx", mmain.coupon.nextPageIdx);

            setTimeout(function() {
                var _ep_slide = $('.eplgList_slide_'+mmain.coupon.nextPageIdx);
                _ep_slide.each(function(){
                    var _this = $(this),
                        _thisItemLth = _this.find('.swiper-slide').length;

                    if(_thisItemLth>1){
                        var epilogue_set = new Swiper(_this, {
                            slidesPerView: 1,
                            autoplay: false,
                            pagination: '.paging',
                            paginationClickable: true,
                            freeMode: false,
                            spaceBetween: 0,
                        });
                    }else{
                        _this.addClass('pdBzero')
                    }
                });
            }, 500);

            /*setTimeout(function() {
                var epilogue_set = {
                    slidesPerView: 1,
                    autoplay: false,
                    freeMode: false,
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                    //loop: true,
                }, epilogue_swiper = Swiper('.eplg_slide', epilogue_set );

                var eplgList_set = {
                    slidesPerView: 1,
                    autoplay: false,
                    freeMode: false,
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                    //loop: true,
                }, epilogueList_swiper = Swiper('.eplgList_slide', eplgList_set );
            }, 500);*/

            /*var _epslide = $('.eplgList_slide_'+mmain.coupon.nextPageIdx);

            $('.epilogue_slide').each(function(index, item){
                var _this = $(this),
                _thislen = _this.find('.swiper-slide').length;

                var epilogue_set = new Swiper('.epilogue_slide', {
                    slidesPerView: 1,
                    autoplay: false,
                    pagination:'.paging',
                    paginationClickable: true,
                    freeMode: false,
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                });
                if(_thislen<=1){
                    _this.find('.paging').hide();
                    _this.addClass('pdBzero')
                }
            });*/

            /*var _epslide = $('.eplgList_slide_'+mmain.coupon.nextPageIdx);

            _epslide.each(function(index, item){
                var _this = $(this),
                _thislen = _this.find('.swiper-slide').length;

                var epilogue_set = new Swiper(_epslide, {
                    slidesPerView: 1,
                    autoplay: false,
                    pagination:'.paging',
                    paginationClickable: true,
                    freeMode: false,
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                });
                if(_thislen<=1){
                    _this.find('.paging').hide();
                    _this.addClass('pdBzero')
                }
            });*/
        }

    },
    comtWritePop : function(obj, eplgNo) {
        $(obj).attr("data-focus", "on");
        /*var _btnTop = $(obj).offset().top;
        console.log(_btnTop);
        $('#pop-full-close').on('click', function(){
            settimeout(function(){$('html, body').scrollTop(_btnTop);}, 100);
        });*/

        common.wlog("membership_epilogue_comtwrite");

        common.Ajax.sendRequest("POST"
            , _baseUrl + "main/getMembershipEplgComtWrite.do?eplgNo="+eplgNo
            , null
            , function(res) {
                $("#pop-full-contents").html(res);
                //common.popFullOpen("댓글 쓰기");

                $('#pop-full-title').html("댓글 쓰기");
                $('body').css({'background-color' : '#fff'}); /* 2016-12-12 퍼블리싱 수정 반영 */
                $('.popFullWrap').show();
                
                // jwkim 191001ios13.대 버전에서 포커스 관련 문제가 있어서 추가함
                if(!$('.popFullWrap').hasClass("h100p")){
                    $('.popFullWrap').addClass("h100p");
                }
                
                $('#mWrapper').hide();

            }
        );
    },
    doubleClickCheck : function(){
        if(mmain.coupon.comtSaveChk){
            return mmain.coupon.comtSaveChk;
        }else{
            mmain.coupon.comtSaveChk = false;
            return false;
        }
    },
    comtWriteSave : function(eplgNo, comtCont){

        if(mmain.coupon.doubleClickCheck()){
            mmain.coupon.comtSaveChk = false;

            var url = _baseUrl+"main/saveEplgComtWriteAjax.do"
            var data = {
                    eplgNo : eplgNo
                    ,comtCont : comtCont
            };

            common.Ajax.sendRequest("POST", url, data, mmain.coupon.comtWriteSaveCallback);
        }

    },
    comtWriteSaveCallback : function(res){
       // 금칙어에 걸리는경우
       if(res.result == "bw"){
           //alert("[" + res.resultMsg + "] (은)는 금칙어로 입력이 제한됩니다.");
           alert("작성하신 댓글에 욕설 및 비속어가\n포함되어 있습니다. 확인 후 다시\n작성 부탁드립니다.");
           mmain.coupon.comtSaveChk = true;
       } else if(res.result == "disp"){
           alert("전시기간이 종료된 에필로그 입니다. 다음 기회에 댓글을 작성 해주세요.");
           mmain.coupon.comtSaveChk = true;
           document.location.reload();
       } else if(res.result == "success"){
            alert(res.message);

            mmain.coupon.comtSaveChk = true;
            mmain.coupon.eplgComtInit(res.eplgNo);

            $("#pop-full-close").click();

        } else if(res.result == "login"){
            mmain.coupon.comtSaveChk = true;
            common.loginChk();
        }else {
            // 에러
            alert(res.result.message);
            mmain.coupon.comtSaveChk = true;
        }

       common.hideLoadingLayer();

    },
    eplgComtInit : function(eplgNo){

        var data = {eplgNo : eplgNo
                 , comtListType : "ALL"
                };

        common.Ajax.sendRequest("POST"
                , _baseUrl + "main/getEplgDetailComtListAjax.do"
                , data
                , function(res) {
                    var comtHtml = "";
                    var result = res.eplgComtList;

                    if(result != null){

                        var resultLength = result.length;
                        
                        $("."+eplgNo).empty();

                        if(resultLength == 1){
                            comtHtml += "<li>";
                            if( (result[0].profileImg != null && result[0].profileImg != "") && result[0].profileOpenYn == "Y"){
                                comtHtml += "    <div class='thum'>";
                                comtHtml += "        <span class='bg'></span>";
                                comtHtml += "        <img src='"+_profileImgUploadUrl+result[0].profileImg+"' alt=''>";
                                comtHtml += "    </div>";
                                
                            }else{
                                comtHtml += "    <div class='thum'>";
                                comtHtml += "        <span class='bg'></span>";
                                comtHtml += "        <img src='"+_imgUrl+"comm/my_picture_base.jpg' alt=''>";
                                comtHtml += "    </div>";
                            }
                            
                            if( result[0].mbrNickNm != null && result[0].mbrNickNm != "" ){
                                comtHtml += "    <dl class='txt'>";
                                comtHtml += "        <dt>"+result[0].mbrNickNm+"</dt>";
                                comtHtml += "        <dd>"+result[0].comtCont+"</dd>";
                                comtHtml += "    </dl>";
                                comtHtml += "</li>";
                                
                            }else{
                                comtHtml += "    <dl class='txt'>";
                                comtHtml += "        <dt>"+result[0].userId+"</dt>";
                                comtHtml += "        <dd>"+result[0].comtCont+"</dd>";
                                comtHtml += "    </dl>";
                                comtHtml += "</li>";
                            }
                            
                        } else if(resultLength > 0){
                            for (var i = 0; i < 2; i++) {
                                comtHtml += "<li>";
                                if( (result[i].profileImg != null && result[i].profileImg != "") && result[i].profileOpenYn == "Y"){
                                    comtHtml += "    <div class='thum'>";
                                    comtHtml += "        <span class='bg'></span>";
                                    comtHtml += "        <img src='"+_profileImgUploadUrl+result[i].profileImg+"' alt=''>";
                                    comtHtml += "    </div>";
                                    
                                }else{
                                    comtHtml += "    <div class='thum'>";
                                    comtHtml += "        <span class='bg'></span>";
                                    comtHtml += "        <img src='"+_imgUrl+"comm/my_picture_base.jpg' alt=''>";
                                    comtHtml += "    </div>";
                                }
                                
                                if( result[i].mbrNickNm != null && result[i].mbrNickNm != "" ){
                                    comtHtml += "    <dl class='txt'>";
                                    comtHtml += "        <dt>"+result[i].mbrNickNm+"</dt>";
                                    comtHtml += "        <dd>"+result[i].comtCont+"</dd>";
                                    comtHtml += "    </dl>";
                                    comtHtml += "</li>";
                                    
                                }else{
                                    comtHtml += "    <dl class='txt'>";
                                    comtHtml += "        <dt>"+result[i].userId+"</dt>";
                                    comtHtml += "        <dd>"+result[i].comtCont+"</dd>";
                                    comtHtml += "    </dl>";
                                    comtHtml += "</li>";
                                }
                            }
                        }
                        
                        $("."+eplgNo).append(comtHtml);
                    }

                }
            );
    },
    comtViewPop : function(obj, eplgNo) {

        common.wlog("membership_epilogue_comtview");

        $(obj).attr("data-focus", "on");

        var loopWrap = $(obj).closest(".boxLoop");
        var eplgCont = $(".subject", loopWrap).html();

        common.Ajax.sendRequest("POST"
            , _baseUrl + "main/getMembershipEplgComtView.do?ver=20190826&eplgNo="+eplgNo
            , null
            , function(res) {
                $("#pop-full-contents").html(res);

                $('#pop-full-title').html("댓글 모두 보기");
                $('#comtViewForm .subject').append(eplgCont);

                $('body').css({'background-color' : '#fff'}); /* 2016-12-12 퍼블리싱 수정 반영 */
                $('.popFullWrap').show();
                $('#mWrapper').hide();

            }
        );
    }
};

$.namespace("mmain.recobell");
mmain.recobell = {

        popLayerOpen : function() {
            //mmain.recobell.mktRcvSend();  [3331722] OY자사몰 큐레이션) 큐레이션 영역 마케팅 활용 동의 수집 내용 변경 으로 주석 -by jp1020 | 2020.06.24

            common.wlog("home_curation_agrbtn");

            common.setScrollPos();
            $("#layerPop").html($("#layAgree01").html());
            common.popLayerOpen2("LAYERPOP01");
        },

        popLayerClose : function() {

            $("#recobell_area4").html("");
            $('#recobell_area1').css("display","block");

            common.popLayerClose('LAYERPOP01');
            //common.link.moveMainHome();
            mmain.home.getRecoBellContsInfoAjax();

            var popLayer = $(".popLayerWrap");
            var mHeader = $('#mHeader');
            //$(popLayer).hide().parents('body').css({'overflow-y' : 'auto'});
            $(popLayer).hide().parents('body').removeAttr('style');
            $('.dim').hide();


            //common.popLayerClose('LAYERPOP01');
            //common.link.moveMainHome();

        },

        mktRcvSend : function(){

            var url = _baseUrl+"mypage/setMktReceiptInfoJson.do"
            var data = {agrYn : "Y" };

            common.Ajax.sendRequest("POST", url, data, mmain.recobell._callBack_mktRcvSend);

        },

        _callBack_mktRcvSend : function (data){
            mmain.recobell.popLayerClose('LAYERPOP01');
            mmain.home.getRecoBellContsInfoAjax();

//            if(data.result){
//                if(data.CODE == "S0000000A"){ //정상
//                    alert("[올리브영]"+data.today +" 요청하신 SMS 및 이메일 수신정보가 변경되었습니다.\nSMS :"
//                            +data.smsYn +"\n이메일 :" +data.emailYn);
//                } else {
//                    alert("실패하였습니다. \nMESSAGE:" + data.MESSAGE +"\nCODE:"+data.CODE);
//                    return false;
//                }
//            }else{
//                alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");
//                return false;
//            }
        }

};

$.namespace("mmain.membershipCpn");
mmain.membershipCpn = {
    _ajax : common.Ajax,
    /* cjOne, olive 마지막 리스트 여부 */
    lastYn : "N",
    cjLastYn : "N",

    /*  쿠폰 카운트  */
    failCount : 0,
    succeseCount : 0,
    otherCount : 0,
    msgStr : "",
    //임직원 여부
    staffYn : "",

    init : function() {
    	
    	console.log("[mmain.membershipCpn.init]");

        // 쿠폰 안내 레이어 팝업
        $(".cp_info").on("click", function(e){
            e.preventDefault();

            common.setScrollPos();
            $("#pop-full-contents").html($("#couponDescInfoLPop").html());
            common.popFullOpen("쿠폰 안내");
        });

        $(".cp_list .bg").on('click', function(e){
            e.preventDefault();
            if(common.isLogin() == false){

               if(!confirm("로그인 후 나의 등급과 다운로드 가능한 쿠폰을 확인하세요. 로그인 페이지로 이동하시겠습니까?")){
                   return ;
               }else{
                   common.loginChk();
                   return ;
               }
           }
             mmain.membershipCpn.downCouponJson($(this));
        });

         $(".conts .cpnAllDown").on('click', function(e){
            e.preventDefault();
            if(common.isLogin() == false){

                 if(!confirm("로그인 후 나의 등급과 다운로드 가능한 쿠폰을 확인하세요. 로그인 페이지로 이동하시겠습니까?")){
                     return ;
                 }else{
                     common.loginChk();
                     return ;
                 }
             }
            common.wlog("membership_coupon_alldown");
            mmain.membershipCpn.allDownCouponEncJson();
         });

         if(sessionStorage.getItem("cpnDownloaded") == "Y"){
             mmain.membershipCpn.setFixedArea();
         }


         $(".btnGray2.cpnZone").on('click', function(e){
             e.preventDefault();

             setTimeout(function() {
                 common.wlog("membership_coupon_list");
                 $("#membership").removeClass("on");
                 $("#coupon").addClass("on");

                 mmain.coupon.getCouponAjax();
             }, 300);

          });
    },

    downCouponJson : function(obj) {
        /*멤버십라운지 단일 쿠폰 다운로드*/
        var cpnCd = obj.parents('li').data("cpnCd");
        var cjCpnNo = obj.parents('li').data("cjCpnNo");
        var expireSDate = obj.parents('li').data("expireSDate");
        var expireEDate = obj.parents('li').data("expireEDate");
        
        var cpnNo = obj.find("input[name*=cpnNo]").val();
        
        common.showLoadingLayer(false);
        
        var param = {    cpnNo        : cpnNo
                        ,certCpnNo    : cpnCd
                        ,cjOneCpnNo   : cjCpnNo
                        ,useStrtDtime : expireSDate
                        ,useEndDtime  : expireEDate};
        
       this._ajax.sendRequest(
                "GET"
                , _baseUrl + "main/downCouponEncJson.do"
                , param
                , this._callback_downCouponJson);

        common.hideLoadingLayer();
    },

    _callback_downCouponJson : function(strData) {

        if(strData.ret == '-1'){
            common.loginChk();
        }else{
            alert(strData.message);
            
            sessionStorage.setItem('cpnDownloaded', 'Y');
            common.link.moveMembership();
        }
    },
    
    setFixedArea : function(){
        setTimeout(function(){
              var tabPos = $("#cpnAnchor").position();
              window.scroll(0, tabPos.top);
         }, 500);
      
      sessionStorage.removeItem("cpnDownloaded");
    },
    
    allDownCouponEncJson : function() {
        /*멤버십라운지 전체 쿠폰 다운로드*/
        common.showLoadingLayer(false);
        //gVariable 초기화
        mmain.membershipCpn.failCount = 0;
        mmain.membershipCpn.succeseCount = 0;
        mmain.membershipCpn.otherCount = 0;
        mmain.membershipCpn.msgStr = "";
        
        //올리브영쿠폰리스트 사이즈
        var oliveCpnLength = $("input[name*=cpnNoArr]").length;
        //cjOne쿠폰리스트 사이즈
        var cpnCdLength = $("input[name*=cpnCd]").length;
        
        $("input[name*=cpnCd]").each(function(index, item){
            var cpnCdArr = { 
                             certCpnNo    : $(item).val() 
                            ,cjOneCpnNo   : $("#cjCpnNo_"+index).val()
                            ,useStrtDtime : $("#dataExpireSdate_"+index).val()
                            ,useEndDtime  : $("#dataExpireEdate_"+index).val()
                            };
             $.ajax({
                 type: "GET",
                 url: _baseUrl + "main/downCouponEncJson.do",
                 data: cpnCdArr,
                 dataType : 'json',
                 async: false,
                 cache: false,
                 success: function(data) {
                   if (index === cpnCdLength-1) {
                      if(oliveCpnLength == null || oliveCpnLength == 0){
                          mmain.membershipCpn.cjLastYn = "Y";
                      }else {
                          mmain.membershipCpn.cjLastYn = "N";
                      }
                   }else{
                      mmain.membershipCpn.cjLastYn = "N";
                   }
                     mmain.membershipCpn._callback_allDownCouponEncJson(data);
                 },
                 complete: function(data){
                     if( mmain.membershipCpn.cjLastYn == "Y"){
                         sessionStorage.setItem('cpnDownloaded', 'Y');
                         common.link.moveMembership();
                     }
                 },
                 error: function() {
                     mmain.membershipCpn._callback_allDownCouponEncJson(data);
                     if(mmain.membershipCpn.lastYn == "Y"){
                         sessionStorage.setItem('cpnDownloaded', 'Y');
                         common.link.moveMembership();
                     }
                 }
             });
        });
        
       /* var cpnNoArr  = $('input[name*=cpnNoArr]').val();*/
        
        $("input[name=cpnNoArr]").each(function(index, item){
            var param = {cpnNo : $(item).val() };
            $.ajax({
                type: "GET",
                url: _baseUrl + "main/downCouponEncJson.do",
                data: param,
                dataType : 'json',
                async: false,
                cache: false,
                success: function(data) {
                    if (index === oliveCpnLength-1) {
                        mmain.membershipCpn.lastYn = "Y";
                      }else{
                        mmain.membershipCpn.lastYn = "N";
                      }
                    mmain.membershipCpn._callback_allDownCouponEncJson(data);
                },
                complete: function(data){
                    if(mmain.membershipCpn.lastYn == "Y"){
                        sessionStorage.setItem('cpnDownloaded', 'Y');
                        common.link.moveMembership();
                    }
                },
                error: function() {
                    mmain.membershipCpn._callback_allDownCouponEncJson(data);
                    if(mmain.membershipCpn.lastYn == "Y"){
                        sessionStorage.setItem('cpnDownloaded', 'Y');
                        common.link.moveMembership();
                    }
                }
            });
        });
    },

    _callback_allDownCouponEncJson : function(strData) {
        //throw exception으로 나오는 메시지에서 임직원을 고름. 
        if(strData.succeeded  ==  false){
            mmain.membershipCpn.failCount++;
            //mmain.membershipCpn.msgStr += "\n>>>"+strData.message;
        }else if(strData.ret == 0){
            mmain.membershipCpn.succeseCount++;
        }else{
            mmain.membershipCpn.otherCount++;
        }
        
        if(mmain.membershipCpn.lastYn == "Y" || mmain.membershipCpn.cjLastYn == "Y"){
            
            common.hideLoadingLayer();
            if(mmain.membershipCpn.succeseCount == 0){
                if( mmain.membershipCpn.staffYn == "Y" ){
                    //임직원이면서 staffDscntSctCd 코드가 20    
                    /*alert("현재 임직원이 다운로드 가능한 쿠폰이 없습니다.");*/
                    /*alert("현재 임직원이 받을 수 있는 쿠폰이 없습니다.");*/
                    alert("고객님, 현재 받을 수 있는 쿠폰이 없어요. \n쿠폰/혜택 에서 더 많은 혜택을 확인해 보세요.");
                    return false;
                }else{
                    //임직원이 아니면서 staffDscntSctCd 코드가 30
                    /*alert("현재 받을 수 있는 쿠폰이 없습니다.");*/
                    alert("고객님, 현재 받을 수 있는 쿠폰이 없어요. \n쿠폰/혜택 에서 더 많은 혜택을 확인해 보세요.");
                    return false;
                }
            }
            alert(mmain.membershipCpn.failCount + mmain.membershipCpn.succeseCount + mmain.membershipCpn.otherCount
                    + "개의 쿠폰 중" + mmain.membershipCpn.succeseCount + "개의 쿠폰이 발급되었습니다. \n등록된 쿠폰은 '마이페이지 > 쿠폰'에서 확인 가능합니다.");
        }
    }

};

