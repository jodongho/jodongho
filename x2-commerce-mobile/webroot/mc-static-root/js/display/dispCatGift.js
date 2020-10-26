$.namespace("display.gift");
display.gift = {
        
    giftMidDispCatNoArr : [] // 기프트관2차 중카테고리 번호
    , sessionMidCatNoArr : []//뒤로가기시에 사용하는값
    , sessionEvtChk : true
    , settimeCheck : ""
    , viewMode : ""     // 미리보기 모드값
    , viewStdDate : ""  // 미리보기 날짜값
    , previewParam : "" // 미리보기 파라미터담는곳
    , themeDbClickChk : true // 중분류테마 연속클릭 제어
    ,init : function(){
        display.gift.viewMode = $("#mContainer").attr("data-ref-viewMode");
        display.gift.viewStdDate = $("#mContainer").attr("data-ref-viewStdDate");

        if (display.gift.viewMode.trim() != "" && display.gift.viewStdDate.trim() != "") {
            display.gift.previewParam = "viewMode=" + display.gift.viewMode + "&viewStdDate=" + display.gift.viewStdDate;
        }
        
        //페이지 로딩 처리 초기화
        common.loadPage.init("#oneTwo-list", "giftList");
        
        var startIdx = common.loadPage.getPageIdx();
        /*
        if (history.state == null) {
            //history state 추가
            history.replaceState({status:"entry"}, null, null);
            history.pushState({status:"MCategoryMain"},null,null);
        }
        */
        //20200902 새로고침 시 무조건 1페이지로 수정 CBLIM
        display.gift.getCategoeryBestGoodsListPagingAjax(1);
        //20200902 새로고침 시 무조건 1페이지로 수정 CBLIM
        
        // 저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.
        //if (!common.loadPage.setSavedHtml()) {
            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함. >> 삭제 20200810 CBLIM
           // display.gift.getCategoeryBestGoodsListPagingAjax(1);
        //}else{
            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함. >> 삭제 20200810 CBLIM
           // display.gift.getCategoeryBestGoodsListPagingAjax(startIdx);
        //}
        
        //lazyload 처리
        common.setLazyLoad();

        //찜 처리 초기화
        common.wish.init();
        
        // 투표 관련 정보 가져오기
        
        // 투표 닫기여부 확인
        var sessionVoteClose = sessionStorage.getItem("sessionVoteClose");
        
        // 메인은 투표 유지
        //if(sessionVoteClose != "true"){
            display.gift.getVoteInfo("Y");
        //} else {
            // 투표영역삭제
            //$("#giftSticky").remove();
        //}
        
        display.gift.bindEvent();
        display.gift.bindWebLog();
        
        //기프트관 2차 이벤트 이벤트 기간에만 스탬프 표시
        var currentDtime = $("#currentDtime").val();
        var startDtime = "";
        var endDtime = "";
        if($("#profile").val() == "prod"){  //운영기간 설정
            startDtime = $("#evtStartDate").val();
            evtEndDate = $("#evtEndDate").val();
        }else{  //그외 기간
            startDtime = $("#evtStartDateQa").val();
            evtEndDate = $("#evtEndDateQa").val();
        }
        //이벤트 기간에만 스탬프 표시
        if(currentDtime >= startDtime && currentDtime <= evtEndDate){
            $(".fix_flow").show();
        }
        
        
        //202008 투표미니바 제거 CBLIM
        $('#giftSticky').removeAttr('class').addClass('fhide');
        $('#fixBtn').removeAttr('class');
        //202008 투표미니바 제거 CBLIM
        
        $(".btnCont").click(function(){
            if(common.isLogin()){
                display.gift.addStamp('1');
            }else{
                display.gift.popLayerOpen('lay_giftEvt01');
            }
        });
        
        $(".btn_gclose").click(function(){
            $(".fix_flow").hide();
        });
    }

    , bindWebLog : function() {
        // [START] getGiftMainList.jsp 에서 테마 웹로그
        $("#giftThemaList li:eq(0)").bind("click", function() {
            // 기프트카드 이동으로 변경되면서 삭제해야함
            //common.wlog("gift_main_theme_1");
        });
        $("#giftThemaList li:eq(1)").bind("click", function() {
            common.wlog("gift_main_theme_2");
        });
        $("#giftThemaList li:eq(2)").bind("click", function() {
            common.wlog("gift_main_theme_3");
        });
        $("#giftThemaList li:eq(3)").bind("click", function() {
            common.wlog("gift_main_theme_4");
        });
        $("#giftThemaList li:eq(4)").bind("click", function() {
            common.wlog("gift_main_theme_5");
        });
        $("#giftThemaList li:eq(5)").bind("click", function() {
            common.wlog("gift_main_theme_6");
        });
        $("#giftThemaList li:eq(6)").bind("click", function() {
            common.wlog("gift_main_theme_7");
        });
        $("#giftThemaList li:eq(7)").bind("click", function() {
            common.wlog("gift_main_theme_8");
        });
        $("#giftThemaList li:eq(8)").bind("click", function() {
            common.wlog("gift_main_theme_9");
        });
        $("#giftThemaList li:eq(9)").bind("click", function() {
            common.wlog("gift_main_theme_10");
        });
        $("#giftThemaList li:eq(10)").bind("click", function() {
            common.wlog("gift_main_theme_11");
        });
        $("#giftThemaList li:eq(11)").bind("click", function() {
            common.wlog("gift_main_theme_12");
        });
        // [END] getGiftMainList.jsp 에서 테마 웹로그
        
        $("#bannerSwiper .swiper-wrapper .swiper-slide img:eq(0)").bind("click", function() {
            common.wlog("gift_main_banner_3");
        });
        $("#bannerSwiper .swiper-wrapper .swiper-slide img:eq(1)").bind("click", function() {
            common.wlog("gift_main_banner_1");
        });
        $("#bannerSwiper .swiper-wrapper .swiper-slide img:eq(2)").bind("click", function() {
            common.wlog("gift_main_banner_2");
        });
        
        // 상품 데이터스토리의 경우 기프트 메인화면과 기프트 상세리스트화면을 구분지어서 수집하기 때문에 pageName 값으로 구분함
        // 상품상세의경우 상품이 먼저뿌려지고 이벤트를 줘야 하기 때문에 타임아웃을 줌 
        setTimeout(function() {
        	// 로딩 시간차 때문에 상품관련 기존코드 ajaxcallback 으로 이동...
        }, 1000);
        
        // 기프트관 베스트 브랜드 wlog
        $("li[id^='bestBrand_']").bind("click", function(){
            var idx = parseInt($(this).attr("data-ref-brandIdx"));
            var wlogStr = "gift_best_brand_" + idx;
            
            common.wlog(wlogStr);
        });
        
        // 기프트관 세트 장바구니 wlog
        $("div[id^='giftMainSet_'] button").bind("click", function() {
            var idx = parseInt($(this).parent().parent().parent().parent().attr("data-ref-setIdx"));
            var wlogStr = "gift_set_cart_" + idx;
            
            common.wlog(wlogStr);
        });
        
        $(".goVoteList").bind("click", function() {
            common.wlog("home_vote_main");
        });
        
        $(".reFind").bind("click", function() {
            if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_reset");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_reset");
            }
        });
        
        // [START] getGiftMainSearch.jsp 에서 테마 웹로그
        /*$(".gthema_list ul li:eq(0)").bind("click", function() {
            common.wlog("gift_search_theme_1");
        });*/
        $(".gthema_list ul li:eq(1)").bind("click", function() {
            common.wlog("gift_search_theme_2");
        });
        $(".gthema_list ul li:eq(2)").bind("click", function() {
            common.wlog("gift_search_theme_3");
        });
        $(".gthema_list ul li:eq(3)").bind("click", function() {
            common.wlog("gift_search_theme_4");
        });
        $(".gthema_list ul li:eq(4)").bind("click", function() {
            common.wlog("gift_search_theme_5");
        });
        $(".gthema_list ul li:eq(5)").bind("click", function() {
            common.wlog("gift_search_theme_6");
        });
        $(".gthema_list ul li:eq(6)").bind("click", function() {
            common.wlog("gift_search_theme_7");
        });
        $(".gthema_list ul li:eq(7)").bind("click", function() {
            common.wlog("gift_search_theme_8");
        });
        $(".gthema_list ul li:eq(8)").bind("click", function() {
            common.wlog("gift_search_theme_9");
        });
        $(".gthema_list ul li:eq(9)").bind("click", function() {
            common.wlog("gift_search_theme_10");
        });
        $(".gthema_list ul li:eq(10)").bind("click", function() {
            common.wlog("gift_search_theme_11");
        });
        $(".gthema_list ul li:eq(11)").bind("click", function() {
            common.wlog("gift_search_theme_12");
        });
        $(".link_gift_product").bind("click", function() {
            // 전체테마 선택
            common.wlog("gift_search_theme_1");
        });
        // [END] getGiftMainSearch.jsp 에서 테마 웹로그
        
        // 기프트관2차 추가 DS
        /*$("#oneTwo-list .gift_banner").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_mid_info_banner");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mid_info_banner");
            }
        });*/
        
        // 투표미니바 오픈
        $('.btn_sticky').bind('click', function(){
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_mini_vote_open");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_open");
            }
        });
        
        // 투표미니바 투표하기
        $('.giftVoteClick').bind('click', function(){
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_vote_click");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_click");
            }
        });
        
        // 투표미니바 다른투표보기
        $('.goGiftToVote').bind('click', function(){
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_vote_hist_click");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_hist_click");
            }
        });
        
        // 투표미니바 상품클릭
        $('.vote_list ul li:eq(0) .giftVoteGoods > a').bind('click', function(){
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_vote_goods1");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_goods1");
            }
        });
        $('.vote_list ul li:eq(1) .giftVoteGoods > a').bind('click', function(){
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_vote_goods2");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_goods2");
            }
        });
        $('.vote_list ul li:eq(2) .giftVoteGoods > a').bind('click', function(){
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_vote_goods3");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_goods3");
            }
        });
        $('.vote_list ul li:eq(3) .giftVoteGoods > a').bind('click', function(){
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_vote_goods4");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_goods4");
            }
        });
        $('.vote_list ul li:eq(4) .giftVoteGoods > a').bind('click', function(){
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_vote_goods5");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_goods5");
            }
        });
        $('#main_vote_list li a').bind('click', function(){
            var li = $(this).parent();
            var idx = li.index() + 1;
            var wlKey = "gift_main_vote_goods_" + idx;
            common.wlog(wlKey);
        });
        
        // 중분류 클릭
        $('.midCatNo0').bind('click', function(){
            common.wlog("gift_serch_midcat1");
        });
        $('.midCatNo1').bind('click', function(){
            common.wlog("gift_serch_midcat2");
        });
        $('.midCatNo2').bind('click', function(){
            common.wlog("gift_serch_midcat3");
        });
        $('.midCatNo3').bind('click', function(){
            common.wlog("gift_serch_midcat4");
        });
        $('.midCatNo4').bind('click', function(){
            common.wlog("gift_serch_midcat5");
        });
        $('.midCatNo5').bind('click', function(){
            common.wlog("gift_serch_midcat6");
        });
        
        // 기프트관에서 투표로 이동
        $('.btnPageMv a.goVoteList').bind('click', function(){
            common.wlog("gift_go_vote");
        });
        
    }
    , bindGoodsWebLog : function() {
        $(".getGiftGood0 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_1");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_1");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_1");
            }
        });
        $(".getGiftGood1 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_2");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_2");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_2");
            }
        });
        $(".getGiftGood2 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_3");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_3");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_3");
            }
        });
        $(".getGiftGood3 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_4");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_4");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_4");
            }
        });
        $(".getGiftGood4 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_5");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_5");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_5");
            }
        });
        $(".getGiftGood5 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_6");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_6");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_6");
            }
        });
        $(".getGiftGood6 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_7");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_7");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_7");
            }
        });
        $(".getGiftGood7 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_8");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_8");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_8");
            }
        });
        $(".getGiftGood8 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_9");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_9");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_9");
            }
        });
        $(".getGiftGood9 > a").bind("click", function() {
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_main_goods_10");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_goods_10");
            } else if($("#giftPageName").val() == "Brand"){
                common.wlog("gift_brand_goods_10");
            }
        });
        
        // 기프트관 베스트 상품 wlog
        $("div[id^='giftBestGoods_'] > a").bind("click", function() {
            var idx = parseInt($(this).parent().attr("data-ref-goodsIdx"));
            var wlogStr = "gift_best_goods_" + idx;
            
            common.wlog(wlogStr);
        });
        
        // 기프트관 세트 상품 wlog
        $("div[id^='giftMainSet_'] a").bind("click", function() {
            var idx = parseInt($(this).parent().parent().attr("data-ref-setIdx"));
            var wlogStr = "gift_set_goods_" + idx;
            
            common.wlog(wlogStr);
        });
    }
    , bindEvent : function() {
        
        // 1X1 or 1X2에 대한 화면 처리
    	$('.area-goods').find('.btnOne').on('click',function(){
    		$(this).addClass("on")
    		$('.area-goods').find('.btnTwo').removeClass('on');
    		$('.area-goods').find('#oneTwo-list').removeClass('mlist2v-goods');
    		$('.area-goods').find('#oneTwo-list').addClass('mlist1v-goods');
    	});
    	$('.area-goods').find('.btnTwo').on('click',function(){
    		$(this).addClass("on")
    		$('.area-goods').find('.btnOne').removeClass('on');
    		$('.area-goods').find('#oneTwo-list').removeClass('mlist1v-goods');
    		$('.area-goods').find('#oneTwo-list').addClass('mlist2v-goods');
    	});
        
        // 정렬 디폴트는 인기순
        $("#prdSort").bind("change", function() {

            //페이징 콜러 제거
            PagingCaller.destroy();

            $("#oneTwo-list").empty();

            //loadingLayer
            common.showLoadingLayer(false);

            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
            display.gift.getCategoeryGoodsListPagingAjax(0);
        });
        
        //찜 체크 처리.
        common.wish.checkWishList();
        
        setTimeout(function() {
            //링크 처리
            common.bindGoodsListLink();
            //페이지 로딩 처리 클릭 이벤트처리
            common.loadPage.bindEvent();
        }, 100);
        
         //링크 처리
        $("img[data-ref-link-url]").bind("click", function() {
            mmain.menu.setPagePos();
            location.href = $(this).attr("data-ref-link-url");
        });
    }
    , goGiftListMove : function(dispCatNo, dispContType, index){ // dispContType 타입은 전체를 선택했는지 하나를 선택했는지 판단할 예정
    	if(index != null && index.length > 0 ){
    		var param = "?dispCatNo=" + dispCatNo + "&trackingCd=Gift_Search_Theme"+ index + "_PROD";
    	}else{
    		var param = "?dispCatNo=" + dispCatNo;
    	}
        
        location.href = _plainUrl + "main/getGiftMainSearchList.do" + param;
        
    }
    // 상품조회
    , getCategoeryGoodsListPagingAjax : function(startIdx){
        PagingCaller.init({
            callback : function(){
                var param = {
                    dispCatNo  : $("#themeNo").val()
                    , fltDispCatNo : $("#dispCatNo").val()
                    , catDpthVal : $("#catDpthVal").val()
                    , pageIdx   : PagingCaller.getNextPageIdx()
                    , prdSort   : $("#prdSort").val()
                    , themeType : $("#themeType").val()
                };
                
                //미리보기 파라미터 추가
                display.gift.setPreviewParam(param);
                
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "main/getGiftMainListPagingAjax.do"
                        , param
                        , display.gift.getCategoeryGoodsListPagingAjaxCallback
                );
                common.loadPage.setPageIdx(param.pageIdx);
            }
            , startPageIdx : startIdx
            , subBottomScroll : 700
            , initCall : (startIdx > 0) ? false : true
        });

    }
    // 상품조회 - 기프트관 2차 BEST상품  CBLIM 20200810
    , getCategoeryBestGoodsListPagingAjax : function(startIdx){
			var param = {
					dispCatNo  : $("#themeNo").val()
					, fltDispCatNo : $("#dispCatNo").val()
					, catDpthVal : $("#catDpthVal").val()
					, pageIdx   : startIdx
					, prdSort   : $("#prdSort").val()
					, themeType : $("#themeType").val()
			};
			
			//미리보기 파라미터 추가
			display.gift.setPreviewParam(param);
			
			common.Ajax.sendRequest(
					"GET"
					, _baseUrl + "main/getGiftMainListPagingAjax.do"
					, param
					, display.gift.getCategoeryGoodsListPagingAjaxCallback
			);
			common.loadPage.setPageIdx(param.pageIdx);

    }
    
    , getCategoeryGoodsListPagingAjaxCallback : function(res){
        //페이지당 20개, 5페이지 이상 조회 시 destroy
        if (res.trim() == '') {
            if (PagingCaller.getCurPageIdx() < 1) {
                 $("#ctgNoData").show();
                 $("#oneTwo-list").hide();
            }
                
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
        } else {
            $("#ctgNoData").hide();
            $("#oneTwo-list").show();

            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $("#oneTwo-list").html(res);

            common.setLazyLoad();

            //찜 체크 처리.
            common.wish.checkWishList();
            
            setTimeout(function() {
                 //링크 처리
                 //common.bindGoodsListLink();
            	 display.gift.bindGoodsListLink();
                 // 상품weblog
                 display.gift.bindGoodsWebLog();
                 
                 //페이지 로딩 처리 클릭 이벤트처리
                 common.loadPage.bindEvent();
            }, 100);
        }
        
        // 상품에 베스트딱지 제거 : 기프트관 화면기획서 페이지6번 description5 요구사항
        $(".goods span").removeClass("best");

        //loadingLayer
        common.hideLoadingLayer();
    }
    
    /**
     * 메뉴 idx에 따른 위치값 보정
     * @param gnbTabIdx
     */
    , scrollToMenu : function(gnbTabIdx) {}
    /**
     * 기프트관 메인 서치 init()
     * @param gnbTabIdx
     */
    , giftMainSearchInit: function(priceType){
        display.gift.viewMode = $("#mContainer").attr("data-ref-viewMode");
        display.gift.viewStdDate = $("#mContainer").attr("data-ref-viewStdDate");

        if (display.gift.viewMode.trim() != "" && display.gift.viewStdDate.trim() != "") {
            display.gift.previewParam = "viewMode=" + display.gift.viewMode + "&viewStdDate=" + display.gift.viewStdDate;
        }
        
        //var sessionData = sessionStorage.getItem("voteFormInit");
        
        if(priceType != "histBack"){
            display.gift.ionRangeSliderFunc();
            display.gift.tagwidth();//이 함수는 태그 변경될 때 마다 실행시켜 주세요.
            
            // common.loadPage.init("#oneTwo-list", "giftList");
            
            var startIdx = 0;
            
            display.gift.getSearchCategoeryGoodsListPagingAjax(startIdx);
            
            // 중테마 가져오기
            // 중테마 영역 숨김
            $(".midThemeList").hide();
            
            var dispCatNo = $("#dispCatNo").val();
            
            if(dispCatNo != ""){
                display.gift.getMidThemeListAjax(dispCatNo);
            }
            
            sessionStorage.setItem("voteFormInit", JSON.stringify($("#giftSearchForm").serializeObject()));
        }
        
        //lazyload 처리
        common.setLazyLoad();
        //찜 처리 초기화
        common.wish.init();
                
        var sessionVoteClose = sessionStorage.getItem("sessionVoteClose");
        
        if(sessionVoteClose != "true"){
            // 투표 관련 정보 가져오기
            display.gift.getVoteInfo("N");
        } else {
            // 투표영역삭제
            $("#giftSticky").remove();
        }
        
        //기프트관 2차 이벤트 이벤트 기간에만 스탬프 표시
        var currentDtime = $("#currentDtime").val();
        var startDtime = "";
        var endDtime = "";
        var dispCatNo = ""; //카테고리 번호
        if($("#profile").val() == "prod"){  //운영기간 설정
            startDtime = $("#evtStartDate").val();
            evtEndDate = $("#evtEndDate").val();
            dispCatNo = "900000800010012";
        }else{  //그외 기간
            startDtime = $("#evtStartDateQa").val();
            evtEndDate = $("#evtEndDateQa").val();
            dispCatNo = "900000800010002";
        }
        
        //이벤트 기간에만 스탬프 표시 베스트 카테고리
        if(currentDtime >= startDtime && currentDtime <= evtEndDate && $("#dispCatNo").val() == dispCatNo){
            $(".fix_flow").show();
        }else{
            $(".fix_flow").hide();
        }
        
        display.gift.searchBindEvent();
        display.gift.bindWebLog();
        
        $(".btnCont").click(function(){
            if(common.isLogin()){
                display.gift.addStamp('3');
            }else{
                display.gift.popLayerOpen('lay_giftEvt01');
            }
        });
        
        $(".btn_gclose").click(function(){
            $(".fix_flow").hide();
        });
    }
    ,ionRangeSliderFunc : function(priceType){
        
        if(priceType != "histBack"){
            $('#salePrcMin').val('0');
            //$('#salePrcMax').val('70000');
            $('#salePrcMax').val('50000');
            $('#salePrcMinCd').val('0');
            //$('#salePrcMaxCd').val('8');
            $('#salePrcMaxCd').val('6');
            
            $('#tprice_not').hide();
            $('.tmin').html("전체 가격대");
            $('.tmax').html("");
            $('#selThemeTagPrc').html('전체 가격대');
            $('#tprice_eqal').show();
        } else {
            if($('#salePrcMinCd').val() == 0 && $('#salePrcMaxCd').val() == 6){
                $('#tprice_not').hide();
                $('.tmin').html("전체 가격대");
                $('.tmax').html("");
                $('#selThemeTagPrc').html('전체 가격대');
                $('#tprice_eqal').show();
            }
        }
        
        $(window).on('scroll', function(){
        	$(window).on('scroll', function(){
        		var _areaGoods = $('.submain-gift .area-goods').offset().top,
        			_midCateArea = $('.submain-gift .midCateArea'),
        			_wScroll = $(window).scrollTop(),
        			_sub_fixBox = $('.sub_fixBox');
        			_fixedH = $('.fixedH');

    			if(_wScroll>_areaGoods){
                    if($('#selThemeTagNm').text() == '전체보기' && $('#selThemeTagPrc').text() =='전체 가격대'){
                        if($('#btnTagNm').css('display')  =='none' && $('#btnTagPrc').css('display')  =='none'){
                            $('#btnTagNm').show();
                            $('#btnTagPrc').show();
                            display.gift.tagwidth();
                        }
                    }
                }

        		if(_wScroll>=_areaGoods){
        		    display.gift.tagwidth();
        		    _midCateArea.addClass('fix');
        		    _sub_fixBox.addClass('on');
        		    _fixedH.addClass('on');
        		    
        		}else{
        		    _midCateArea.removeClass('fix');
        		    _sub_fixBox.removeClass('on');
        		    _fixedH.removeClass('on');
        		}		
           });
        });
        //금액 바
        //var custom_values = ["1", "1", "2", "3", "4", "5", "6", "7", "7"];
        var custom_values = ["1", "1", "2", "3", "4", "5", "5"];
        var my_from = custom_values.indexOf(0);
        var my_to = custom_values.indexOf(6);
        var tmin = $('.tmin');
        var tmax = $('.tmax');
        var _rangeSlider = $(".js-range-slider");
        _rangeSlider.ionRangeSlider({
            type: "double",
            hide_from_to:true,
            from: $('#salePrcMinCd').val(),
            to: $('#salePrcMaxCd').val(),
            min_interval: 1,
            values: custom_values,
            onChange: function (data) {
                if(data.from_pretty == data.to_pretty){
                    display.gift.tagwidth();
                    $('#tprice_not').hide();
                    $('#tprice_eqal').show();
                    tmin.html(data.from_value+" 만원");
                    tmax.html("");
                    if(data.from_pretty == '0'){
                        $('#tprice_not').hide();
                        $('#tprice_eqal').show();
                        tmin.html(data.from_value+" 만원 미만");
                    }
                    if(data.from_pretty == '6'){
                        $('#tprice_not').hide();
                        $('#tprice_eqal').show();
                        tmin.html(data.from_value+" 만원 이상");
                    }
                }else{
                    if(data.from_pretty =='0' && data.to_pretty =='6'){
                        display.gift.tagwidth();
                        $('#tprice_not').hide();
                        $('#tprice_eqal').show();
                        tmin.html("전체 가격대");
                        tmax.html("");
                    }else if(data.from_pretty == '0'){
                        display.gift.tagwidth();
                        $('#tprice_not').hide();
                        $('#tprice_eqal').show();
                        tmin.html("");
                        tmax.html(data.to_value+"만원 미만");
                    }else if(data.to_pretty =='6'){
                        display.gift.tagwidth();
                        $('#tprice_not').hide();
                        $('#tprice_eqal').show();
                        tmin.html(data.from_value+"만원 이상");
                        tmax.html("");
                    }else{
                        display.gift.tagwidth();
                        $('#tprice_not').show();
                        $('#tprice_eqal').hide();
                        tmin.html(data.from_value+" 만원");
                        tmax.html(data.to_value+" 만원");
                    }
                }
            },
            onFinish: function (data) {
                var minStr = null;
                var maxStr = null;
                $('#salePrcMinCd').val(data.from_pretty);
                $('#salePrcMaxCd').val(data.to_pretty);
                //var fromPretty = ['0','10000','20000','30000','40000','50000','60000','70000','70000'];
                //var toPretty =  ['9999','10000','20000','30000','40000','50000','60000','70000','70000' ];
                var fromPretty = ['0','10000','20000','30000','40000','50000','50000'];
                var toPretty =  ['9999','10000','20000','30000','40000','50000','50000' ];
                if(data.from_pretty == '0'){
                    $('#salePrcMin').val(fromPretty[data.from_pretty]);
                    minStr = '0';
                }else if(data.from_pretty == '6'){
                    $('#salePrcMin').val(fromPretty[data.from_pretty]);
                    minStr = '5';
                }else{
                    minStr = data.from_pretty;
                    $('#salePrcMin').val(fromPretty[data.from_pretty]);
                }
                if(data.to_pretty == '0'){
                    $('#salePrcMax').val(toPretty[data.to_pretty]);
                    minStr = '1';
                }else if(data.to_pretty == '6'){
                    $('#salePrcMax').val(toPretty[data.to_pretty]);
                    maxStr = '5';
                }else{
                    maxStr = data.to_pretty;
                    $('#salePrcMax').val(toPretty[data.to_pretty]);
                }
                if(data.to_pretty == data.from_pretty){
                    if(data.to_pretty =='0'){
                        $('#selThemeTagPrc').html(minStr+"만원 미만");
                    }else if(data.to_pretty =='6'){
                        $('#selThemeTagPrc').html(minStr+"만원 이상");
                    }else{
                        $('#selThemeTagPrc').html(minStr+'~'+maxStr+'만원');
                    }
                    
                    
                }else if(data.from_pretty == '0' && data.to_pretty == '6'){
                    $('#selThemeTagPrc').html('전체 가격대');
                }else if(data.from_pretty == '0'){
                    $('#selThemeTagPrc').html(maxStr+"만원 미만");
                }else if(data.to_pretty == '6'){
                    $('#selThemeTagPrc').html(minStr+"만원 이상");
                }else{
                    $('#selThemeTagPrc').html(minStr+'~'+maxStr+'만원');
                }
                display.gift.tagwidth();
                PagingCaller.destroy();
                $("#oneTwo-list").empty();
                $('#btnTagPrc').show();
                
                if ($("#giftPageName").val() == "Search") {
                    common.wlog("gift_search_prc_"+data.from_pretty+"_"+data.to_pretty);
                } else if ($("#giftPageName").val() == "Brand") {
                    common.wlog("gift_brand_prc_"+data.from_pretty+"_"+data.to_pretty);
                }
                
                // 안드로이드 뒤로가기 이슈로 테마, 중테마, 가격대, 검색조건을 세션스토리지에 저장
                sessionStorage.setItem("voteFormInit", JSON.stringify($("#giftSearchForm").serializeObject()));
                
                display.gift.getSearchCategoeryGoodsListPagingAjax(0);
            }
        });
        //중간 라인 클릭 시 값 업데이트
        var _rangeSliderData = _rangeSlider.data("ionRangeSlider");
        var _itemLine = $('.grid>.inner>li');
        _itemLine.on('click', function(){
            var _thisIn = $(this).index(),
                _from = _rangeSliderData.old_from,
                _to = _rangeSliderData.old_to,
                _cal = _thisIn-_from,
                _avr = (_from+_to)/2;
            if(_cal>=0){
                if(_thisIn<=_avr){
                    _from = _thisIn;    
                }else{
                    _to = _thisIn;
                }           
            }else{
                _from = _thisIn;
            }
            _rangeSliderData.update({
                from: _from,
                to: _to
            });
        });
        //버튼 토글
        $('.grBox .btnTab .btnt').on('click', function(){
            $(this).siblings().removeClass('on');
            $(this).toggleClass('on');
        });
    }
    , tagwidth : function() {
    	setTimeout(function(){
    		var _inner = $('.sub_fixBox .tag_list .inner'),
        	_inner_item = _inner.find('button');
        	_totalWidth = 0;    	
    		_inner_item.each(function(index){
    	        _totalWidth += parseInt($(this).outerWidth()+8, 10);
    	    });
    		_inner.css('width', _totalWidth);
    	}, 200);
    }
    ,searchPopLayerOpen : function(IdName) {
        
        common.wlog("gift_search_layer_popup");
        
        var popLayer = ('#'+IdName);
        var _this = $(this);
        var _thisPos = ($('div.sel_theme').offset().top)-16;
        
        $('html,body').scrollTop(_thisPos);
        $(popLayer).show().stop(0).animate({
            opacity:1,
            bottom:0
        },250);    
        $('.dim').show();
        $('.dim').bind('click', function(){
            display.gift.searchPopLayerClose(IdName);
        });
    }
    ,searchPopLayerClose : function() {
        
        common.wlog("gift_search_theme_close");
        
        var popLayer = $(".popLayerWrap");
        $(popLayer).css({
            opacity:0,
            bottom:-300+'px',
            display:'none'
        });
        
        $('.footerTab').show();//추가 인큐베이팅
        $('.dim').hide();
    }
    /*,searchPopLayerOpen : function(IdName) {
        
        common.wlog("gift_search_layer_popup");
        
        var winH = $(window).height()/2;
        var popLayer = ('#'+IdName);
        $(popLayer).find('.popCont').css({'max-height': winH});

        var popPos = $(popLayer).height()/2;
        var popWid = $(popLayer).width()/2;
        $('.footerTab').hide();//추가 인큐베이팅
        $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)}).show().parents('body').css({'overflow' : 'hidden'});
        $('.dim').show();
        $('.dim').bind('click', function(){
            display.gift.searchPopLayerClose(IdName);
        });

        $(window).resize(function(){
            winH = $(window).height()/2;
            $(popLayer).find('.popCont').css({'max-height': winH});
            popPos =$(popLayer).height()/2;
            popWid = $(popLayer).width()/2;
            $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)})
        });
        //sns 별도처리
        if(IdName =='SNSLAYER'){
            $(popLayer).css({'left':'0' , 'margin-left': '0'})
        };   
    }
    ,searchPopLayerClose : function() {
        var popLayer = $(".popLayerWrap");
        $(popLayer).hide().parents('body').css({'overflow' : 'visible'});
        $('.footerTab').show();//추가 인큐베이팅
        $('.dim').hide();
    }*/
    ,popLayerOpen : function(IdName){    
    	var winH = $(window).height()/2;
    	var popLayer = ('#'+IdName);
    	$(popLayer).find('.popCont').css({'max-height': winH});

    	var popPos = $(popLayer).height()/2;
    	var popWid = $(popLayer).width()/2;
    	$('.footerTab').hide();//추가 인큐베이팅
    	$(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)}).show().parents('body').css({'overflow' : 'hidden'});
    	$('.dim').show();
    	$('.dim').bind('click', function(){
    		display.gift.popLayerClose(IdName);
    	});

    	$(window).resize(function(){
    		winH = $(window).height()/2;
    		$(popLayer).find('.popCont').css({'max-height': winH});
    		popPos =$(popLayer).height()/2;
    		popWid = $(popLayer).width()/2;
    		$(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)})
    	});
    	//sns 별도처리
    	if(IdName =='SNSLAYER'){
    		$(popLayer).css({'left':'0' , 'margin-left': '0'})
    	};
        
        if($("#giftPageName").val() == "Main"){
            common.wlog("gift_mid_info_banner");
        } else if($("#giftPageName").val() == "Search"){
            common.wlog("gift_search_mid_info_banner");
        }
        
    }
    , popLayerClose : function(){
    	var popLayer = $(".popLayerWrap");
    	$(popLayer).hide().parents('body').css({'overflow' : 'visible'});
    	$('.footerTab').show();//추가 인큐베이팅
    	$('.dim').hide();
        
        if($("#giftPageName").val() == "Main"){
            common.wlog("gift_mid_info_banner_close");
        } else if($("#giftPageName").val() == "Search"){
            common.wlog("gift_search_mid_info_banner_close");
        }
        
    }
    ,catNoChoice : function(dispCatNo,rsv1Attr,catImg3Addr,catMrkNm,contsNm) {
        
        //기프트관 2차 이벤트 이벤트 기간에만 스탬프 표시
        // [START]
        var currentDtime = $("#currentDtime").val();
        var startDtime = "";
        var endDtime = "";
        var evtDistCatNo = "";
        
        if($("#profile").val() == "prod"){  //운영기간 설정
            startDtime = $("#evtStartDate").val();
            evtEndDate = $("#evtEndDate").val();
            evtDistCatNo = "900000800010012";
        }else{  //그외 기간
            startDtime = $("#evtStartDateQa").val();
            evtEndDate = $("#evtEndDateQa").val();
            evtDistCatNo = "900000800010002";
        }
        
        //이벤트 기간에만 스탬프 표시
        if(currentDtime >= startDtime && currentDtime <= evtEndDate && dispCatNo == evtDistCatNo){
            $(".fix_flow").show();
        }else{
            $(".fix_flow").hide();
        }
        // [END]
        
        display.gift.midThemeInit();
        
        // 뒤로가기로 작동하지 않았을경우 데이터 초기화
        if(display.gift.sessionEvtChk){
            $("#midDispCatNoArr").val(null);
        } else {
            display.gift.sessionEvtChk = true;
        }
        
        if(display.gift.sessionMidCatNoArr.length > 0){
            display.gift.giftMidDispCatNoArr = display.gift.sessionMidCatNoArr;
        }
        
        if(dispCatNo != null){
            //$('#sel_theme_id').css('background','#'+rsv1Attr+" url("+catImg3Addr+') no-repeat 5px');
            //$('#sel_theme_id').css('background-size','46px 46px');            
            //$('#sel_theme_id').attr('style','background:#'+rsv1Attr+" url("+catImg3Addr+') no-repeat 5px; background-size:46px 46px;');
            $('#sel_theme_id').attr('style','background-image:url('+catImg3Addr+')');
        	$('#sel_theme_id').css({
        		'background-color':'#'+rsv1Attr
        	});
        	
        	if(contsNm != ""){
        		$('#contsNmHidden').html(contsNm);
        	} else {
        		$('#contsNmHidden').html("전하고 싶은 마음은?");
        	}
        	
            $('#sj_theme_id').text(catMrkNm);
            var popLayer = $(".popLayerWrap");
            $(popLayer).hide().parents('body').css({'overflow' : 'visible'});
            $('.footerTab').show();
            $('.dim').hide();   
            $('#dispCatNo').val(dispCatNo);
            $('#selThemeTagNm').text(catMrkNm);
            $('#btnTagNm').show();
            display.gift.tagwidth();
            PagingCaller.destroy();
            $("#oneTwo-list").empty();
            
            display.gift.getSearchCategoeryGoodsListPagingAjax(0);
            // 기프트관 2차 최초 테마 선택후 진입시 중테마 분류가 있는지 확인
            display.gift.getMidThemeListAjax(dispCatNo);
            
        }else{
            $('#dispCatNo').val('');
            /*$('#sel_theme_id').css('background','#'+rsv1Attr+" url("+catImg3Addr+') no-repeat 5px');
            $('#sel_theme_id').css('background-size','46px 46px');*/
            if ($("#onlBrndCd").val() == "") {
                $('#sel_theme_id').attr('style','background-image:url('+catImg3Addr+')');
            }
            
            if ($("#giftPageName").val() != 'Brand') {
                $('#sel_theme_id').css({
                    'background-color':'#'+rsv1Attr
                });
            }
        	
        	if(contsNm != ""){
        		$('#contsNmHidden').html(contsNm);
        	} else {
        		$('#contsNmHidden').html("올리브영이 선물 골라드릴게요!");
        	}
        	
            $('#sj_theme_id').text(catMrkNm);
            $('#selThemeTagNm').text(catMrkNm);
            var popLayer = $(".popLayerWrap");
            $(popLayer).hide().parents('body').css({'overflow' : 'visible'});
            $('.footerTab').show();
            $('.dim').hide();
            $('#btnTagNm').show();
            display.gift.tagwidth();
            PagingCaller.destroy();
            $("#oneTwo-list").empty();
            
            display.gift.getSearchCategoeryGoodsListPagingAjax(0);
        }
        
        var _thisPos = ($('div.sel_theme').offset().top)-16;
        
        $('html,body').scrollTop(_thisPos);
        
        sessionStorage.setItem("voteFormInit", JSON.stringify($("#giftSearchForm").serializeObject()));
        
    }
    // 상품조회
    , getSearchCategoeryGoodsListPagingAjax : function(startIdx){
        
        PagingCaller.init({
            callback : function(){
//              if(startIdx ==0 && statusCd ==0){
//                  statusCd == 1;
//                  PagingCaller.curPageIdx = 0;
//              }

                var param = {};
                var dispCatNo = $("#dispCatNo").val();
                var onlBrndCd = $("#onlBrndCd").val();
                if (onlBrndCd == null || onlBrndCd == '') {
                    if(dispCatNo == null || dispCatNo == ''){
                        param.themeType = 'searchAll';
                    }else{
                        param.themeType = 'GIFTONE';
                    }
                } else {
                    param.themeType = 'GIFTBRAND';
                }
                
                param.pageIdx = PagingCaller.getNextPageIdx();
                param.dispCatNo = dispCatNo;
                param.onlBrndCd = onlBrndCd;
                param.prdSort = $("#prdSort").val();
                param.salePrcMin = $("#salePrcMin").val();
                param.salePrcMax = $("#salePrcMax").val();
                param.salePrcMinCd = $("#salePrcMinCd").val();
                param.salePrcMaxCd = $("#salePrcMaxCd").val();
                
                if(display.gift.giftMidDispCatNoArr.length > 0){
                    param.giftMidDispCatNoArr = display.gift.giftMidDispCatNoArr.toString();
                }
                
                //미리보기 파라미터 추가
                display.gift.setPreviewParam(param);
                
                // 상품수를 먼저 조회
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "main/getGiftMainListCountAjax.do"
                        , param
                        , function(res){
                            $('#tmpTotCnt').val(res.prDispGoodsCnt);
                            $('.data').html(res.prDispGoodsCnt);
                            
                            // 상품수가 없는경우 초기화화면
                            if(res.prDispGoodsCnt == 0){
                                 $('#ctgNoData').empty();
                                 $("#ctgNoData").show();
                                 $p = $("<p>").addClass("txt").html("선택하신 선물 상품이 없어요.<br>다른 조건으로 찾아주세요!<br>");
                                 $btn = $("<button>").addClass("btnGray btnReset").attr('onclick','javascript:display.gift.reset();').attr('type','button').html("선택 초기화");
                                 $p.append($btn);
                                 $('#ctgNoData').append($p);
                                 $("#oneTwo-list").hide();
                                 
                                 // 응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
                                 PagingCaller.destroy();
                                 
                                 common.hideLoadingLayer();
                                 display.gift.themeDbClickChk = true; // 테마 연속클릭 제어
                                 
                            } else{
                                // 상품이 존재하는경우 리스트조회
                                common.Ajax.sendRequest(
                                        "GET"
                                        , _baseUrl + "main/getGiftMainListPagingAjax.do"
                                        , param
                                        , display.gift.getSearchCategoeryGoodsListPagingAjaxCallback
                                );
                                common.loadPage.setPageIdx(param.pageIdx);
                            }
                        }
                        , false
                );
            }
            , startPageIdx : startIdx
            , subBottomScroll : 700
            , initCall : (startIdx > 0) ? false : true
        });
    }
    
    , getSearchCategoeryGoodsListPagingAjaxCallback : function(res){
        //페이지당 20개, 5페이지 이상 조회 시 destroy
        if (res.trim() == '') {
            
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
        } else {
            $("#ctgNoData").hide();
            $("#oneTwo-list").show();

            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $("#oneTwo-list").append(res);

            common.setLazyLoad();

            //찜 체크 처리.
            common.wish.checkWishList();
            
            setTimeout(function() {
                 //링크 처리
//               common.bindGoodsListLink();
                 display.gift.bindGoodsListLink();
                 
                 // 상품weblog
                 display.gift.bindGoodsWebLog();
                 
                 //페이지 로딩 처리 클릭 이벤트처리
                 common.loadPage.bindEvent();
            }, 100);
            //태그 삭제 위치 이동
//          var _btn_tag = $('.tag_list').find('button');
//          _btn_tag.on('click', function(){
//              var _pos = $('.fixedH').offset().top;
//              $('html, body').scrollTop(_pos);
//          });
            
            
        }
        
        // 상품에 베스트딱지 제거 : 기프트관 화면기획서 페이지6번 description5 요구사항
        $(".goods span").removeClass("best");

        //loadingLayer
        common.hideLoadingLayer();
        // 테마 연속클릭제어
        display.gift.themeDbClickChk = true;
    }
    , bindGoodsListLink : function(filterSelectorStr) {
        var classNm = filterSelectorStr == undefined ? "" : filterSelectorStr + " ";
        
        $(classNm + ".goodsList").unbind("click");
                
        $(classNm + ".goodsList").bind("click", function(e) {
            e.preventDefault();
            var trackingCd = $("#trackingCd").val();

            // 아이겐코리아 상품BEST rccode 추가
            var bestItemKoreaCheck = $("#koreaCheck").val();
            var rcCode = "";
            // 아이겐코리아 상품BEST rccode 추가
            // 아이겐코리아 brand best rccode 추가
            var rccd = $("#rccode").val();

            //판매종료 여부체크
            var allSoldOutChk = $(this).find(".img").children("span").hasClass("allsoldOut");
            
            if(allSoldOutChk == false){
            	if(trackingCd != null && trackingCd.length > 0 ){
            	    if (common.isEmpty(rccd)) {
            	        common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"), trackingCd);
            	    } else {
            	        common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"), trackingCd, rccd);
            	    }
            		
            	}else{
            	    trackingCd = $(this).attr("name");
            	    
            	    if (common.isEmpty(trackingCd)) {
            	        
            	        common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
            	    } else {
            	    	if(bestItemKoreaCheck == "Y" && trackingCd == "Gift_Main_Best"){
            	    		rcCode = "mc_gift1";
            	    		common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"), trackingCd, rcCode);
            	    	}else{
            	    		common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"), trackingCd);
            	    	}
            	        
            	    }
            		
            	}
            }
        });

        $('.item').each(function(){
            if($(this).parent('div').hasClass('sel_theme') != true){
                $(classNm + ".item").unbind("click");
                $(classNm + ".item").bind("click", function(e) {
                     e.preventDefault();
                     //판매종료 여부체크
                     var allSoldOutChk = $(this).find(".img").children("span").hasClass("allsoldOut");
                     
                     if(allSoldOutChk == false){
                         common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
                     }
                 });
            }
        });

        $(classNm + ".goodsListLogin").bind("click", function(e) {
            e.preventDefault();
            //로그인 성인체크 로그인성인
            common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
        });

        $(classNm + ".goodsListAuth").bind("click", function(e) {
            e.preventDefault();
            //로그인 성인체크
            common.link.moveGoodsDetail($(this).attr("data-ref-goodsNo"), $(this).attr("data-ref-dispCatNo"));
        });
    }
    , searchBindEvent : function() {
        
        // 1X1 or 1X2에 대한 화면 처리
        $('.area-goods').find('.btnOne').on('click',function(){
            $(this).addClass("on");
            $('.area-goods').find('.btnTwo').removeClass('on');
            $('.area-goods').find('#oneTwo-list').removeClass('mlist2v-goods');
            $('.area-goods').find('#oneTwo-list').addClass('mlist1v-goods');
        });
        $('.area-goods').find('.btnTwo').on('click',function(){
            $(this).addClass("on");
            $('.area-goods').find('.btnOne').removeClass('on');
            $('.area-goods').find('#oneTwo-list').removeClass('mlist1v-goods');
            $('.area-goods').find('#oneTwo-list').addClass('mlist2v-goods');
        });
        
        // 정렬 디폴트는 인기순
        $("#prdSort").bind("change", function() {

            //페이징 콜러 제거
            PagingCaller.destroy();

            $("#oneTwo-list").empty();

            //loadingLayer
            common.showLoadingLayer(false);

            // 안드로이드 뒤로가기 이슈로 테마, 중테마, 가격대, 검색조건을 세션스토리지에 저장
            sessionStorage.setItem("voteFormInit", JSON.stringify($("#giftSearchForm").serializeObject()));
            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
            display.gift.getSearchCategoeryGoodsListPagingAjax(0);
        });
        //찜 체크 처리.
        common.wish.checkWishList();
        
        setTimeout(function() {
            //링크 처리
            display.gift.bindGoodsListLink();
            //페이지 로딩 처리 클릭 이벤트처리
            common.loadPage.bindEvent();
        }, 100);
        
    }
    , goTop : function(){
        $(window).scrollTop(0);
    }
    , deleteTag : function(tagId, obj){
        

        if(display.gift.themeDbClickChk){
            common.showLoadingLayer(false);
            
            // 삭제후 스크롤 테마선택 영역까지 이동시킴
            var _thisPos = ($('div.sel_theme').offset().top)-16;
            $('html,body').scrollTop(_thisPos);
            
            //$('#'+tagId).hide();
            if(tagId == 'btnTagNm'){

                // 기프트관2차에 스템프 이벤트 숨김처리 
                // [START]
                $(".fix_flow").hide();
                // [END]
                
                display.gift.midThemeInit();
                
                var dispCatNoUrl = $('#dispAllImgPath').val();
                $("#dispCatNo").val('');
                //$('#sel_theme_id').css('background','#abda41 url('+dispCatNoUrl+') no-repeat 5px');
                //$('#sel_theme_id').css('background-size','46px 46px');
                $('#sel_theme_id').attr('style','background-image:url('+dispCatNoUrl+')');
                $('#sj_theme_id').text('전체보기');
                $('#selThemeTagNm').text('전체보기');
                PagingCaller.destroy();
                $("#oneTwo-list").empty();
                display.gift.getResetCategoeryGoodsListPagingAjax(0);
                
            } else if(tagId == "btnTagPrc"){
                $("#salePrcMin").val('0');
                $("#salePrcMax").val('50000');
                $("#salePrcMinCd").val('0');
                $("#salePrcMaxCd").val('6');
                let ionSetting = $(".js-range-slider").data("ionRangeSlider");
                ionSetting.update({
                    from: 0,
                    to: 6
                });
                $('#tprice_not').hide();
                $('#tprice_eqal').show();
                $('.tmin').html('전체 가격대');
                $('.tmax').html('');
                $('#selThemeTagPrc').text('전체 가격대');
                PagingCaller.destroy();
                $("#oneTwo-list").empty();
                display.gift.getResetCategoeryGoodsListPagingAjax(0);
            } else {
                
                $("#tag_"+$(obj).attr("data-ref-dispContsNo")).remove();
                $("#midTheme_"+$(obj).attr("data-ref-dispContsNo")).removeClass("on");
                $("#midTheme_"+$(obj).attr("data-ref-dispContsNo")).removeAttr('style');
                
                // 선택되어 있던 중분류 테마를 초기화하고 다시 셋팅
                display.gift.giftMidDispCatNoArr = [];
                
                var midthemeList =  $('.midThemeList').find('a');
                for (var i = 0; i < midthemeList.length; i++) {
                    if(midthemeList.eq(i).hasClass("on")){
                        display.gift.giftMidDispCatNoArr.push(midthemeList.eq(i).attr("data-ref-dispContsNo"));
                    }
                }
                
                $("#midDispCatNoArr").val(display.gift.giftMidDispCatNoArr);
                PagingCaller.destroy();
                $("#oneTwo-list").empty();
                display.gift.getResetCategoeryGoodsListPagingAjax(0);
            }
            
            display.gift.tagwidth();
            
            // 안드로이드 뒤로가기 이슈로 테마, 중테마, 가격대, 검색조건을 세션스토리지에 저장
            sessionStorage.setItem("voteFormInit", JSON.stringify($("#giftSearchForm").serializeObject()));
        }
        
        
    }
    , goVoteList : function(){
         var dispCatNo = $('#dispCatNo').val();
         if(dispCatNo != null && dispCatNo.length > 0){
             location.href = _plainUrl + "vote/getVoteMainList.do?dispCatNo="+dispCatNo+"&themeType=GIFTONE";    
         }else{
             location.href = _plainUrl + "vote/getVoteMainList.do?themeType=searchAll";
         }
         
    }
    , goGiftToVoteList : function(check){
    	//20200903 선물 투표하러 가볼까요? 에서 접근 시 로직 추가 CBLIM
    	if(check == "true"){
    		sessionStorage.setItem("goGiftVoteCheck", "goGiftVoteCheck");
    	}
    	//20200903 선물 투표하러 가볼까요? 에서 접근 시 로직 추가 CBLIM
        sessionStorage.setItem("goGiftVote", "goGiftVote");
        
        location.href = _plainUrl + "vote/getVoteMainList.do";
    }
    , getResetCategoeryGoodsListPagingAjax : function(startIdx){
        PagingCaller.init({
            callback : function(){
                display.gift.themeDbClickChk = false;
//              if(startIdx ==0 && statusCd ==0){
//                  statusCd == 1;
//                  PagingCaller.curPageIdx = 0;
//              }
                var param = {};
                var dispCatNo = $("#dispCatNo").val();
                var onlBrndCd = $("#onlBrndCd").val();
                if (onlBrndCd == null || onlBrndCd == '') {
                    if(dispCatNo == null || dispCatNo == ''){
                        param.themeType = 'searchAll';
                    }else{
                        param.themeType = 'GIFTONE';
                    }
                } else {
                    param.themeType = 'GIFTBRAND';
                }
                param.pageIdx = PagingCaller.getNextPageIdx();
                param.dispCatNo = dispCatNo;
                param.onlBrndCd = onlBrndCd;
                param.prdSort = $("#prdSort").val();
                param.salePrcMin = $("#salePrcMin").val();
                param.salePrcMax = $("#salePrcMax").val();
                param.salePrcMinCd = $("#salePrcMinCd").val();
                param.salePrcMaxCd = $("#salePrcMaxCd").val();
                
                if(display.gift.giftMidDispCatNoArr.length > 0){
                    param.giftMidDispCatNoArr = display.gift.giftMidDispCatNoArr.toString();
                }
                
                
                // 상품수를 먼저 조회
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "main/getGiftMainListCountAjax.do"
                        , param
                        , function(res){
                            $('#tmpTotCnt').val(res.prDispGoodsCnt);
                            $('.data').html(res.prDispGoodsCnt);
                            
                            // 상품수가 없는경우 초기화화면
                            if(res.prDispGoodsCnt == 0){
                                 $('#ctgNoData').empty();
                                 $("#ctgNoData").show();
                                 $p = $("<p>").addClass("txt").html("선택하신 선물 상품이 없어요.<br>다른 조건으로 찾아주세요!<br>");
                                 $btn = $("<button>").addClass("btnGray btnReset").attr('onclick','javascript:display.gift.reset();').attr('type','button').html("선택 초기화");
                                 $p.append($btn);
                                 $('#ctgNoData').append($p);
                                 $("#oneTwo-list").hide();
                                 common.hideLoadingLayer();
                                 // 응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
                                 PagingCaller.destroy();
                            } else{
                                // 상품이 존재하는경우 리스트조회
                                common.Ajax.sendRequest(
                                        "GET"
                                        , _baseUrl + "main/getGiftMainListPagingAjax.do"
                                        , param
                                        , display.gift.getSearchCategoeryGoodsListPagingAjaxCallback
                                );
                                common.loadPage.setPageIdx(param.pageIdx);
                            }
                        }
                );
                //common.loadPage.setPageIdx(param.pageIdx);
            }
            , startPageIdx : startIdx
            , subBottomScroll : 700
            , initCall : false
        });
    }
    
    , getResetCategoeryGoodsListPagingAjaxCallback : function(res){
        //페이지당 20개, 5페이지 이상 조회 시 destroy
        if (res.trim() == '') {
            if (PagingCaller.getCurPageIdx() < 1) {
                 $("#ctgNoData").show();
                 $("#oneTwo-list").hide();
            }
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();
        } else {
            $("#ctgNoData").hide();
            $("#oneTwo-list").show();

            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $("#oneTwo-list").append(res);

            common.setLazyLoad();

            //찜 체크 처리.
            common.wish.checkWishList();
            $('.data').html($('#tmpTotCnt').val());
            setTimeout(function() {
                 //링크 처리
//               common.bindGoodsListLink();
                 display.gift.bindGoodsListLink();
                 //페이지 로딩 처리 클릭 이벤트처리
                 common.loadPage.bindEvent();
            }, 100);
            //태그 삭제 위치 이동
//          var _btn_tag = $('.tag_list').find('button');
//          _btn_tag.on('click', function(){
                var _pos = $('.fixedH').offset().top;
                $('html, body').scrollTop(_pos);
//          });
            
        }
        
        // 상품에 베스트딱지 제거 : 기프트관 화면기획서 페이지6번 description5 요구사항
        $(".goods span").removeClass("best");

        //loadingLayer
        common.hideLoadingLayer();
    }
    , reset : function(){
        
            // 기프트관2차 검색조건 초기화시에 중분류 테마 초기화
            display.gift.midThemeInit();
            
            // 뒤로가기 작동하지 않았을경우
            if(display.gift.sessionEvtChk){
                $("#midDispCatNoArr").val(null);
            }  else {
                display.gift.sessionEvtChk = true;
            }
        
            // 서치 미드카트 삭제
            $(".tag_midTheme").remove();
            display.gift.giftMidDispCatNoArr = [];
            
            var dispCatNoUrl = $('#dispAllImgPath').val();
            $("#dispCatNo").val('');
            //$('#sel_theme_id').css('background','#abda41 url('+dispCatNoUrl+') no-repeat 5px');
            //$('#sel_theme_id').css('background-size','46px 46px');
            if ($("#giftPageName").val() == "Search") {
                $('#sel_theme_id').attr('style','background-image:url('+dispCatNoUrl+')');
            }
            $('#sj_theme_id').text('전체보기');
            $('#selThemeTagNm').text('전체보기');
            $('#selThemeTagPrc').text('전체 가격대');
            $("#salePrcMin").val('0');
            $("#salePrcMax").val('50000');
            $("#salePrcMinCd").val('0');
            $("#salePrcMaxCd").val('6');
            let ionSetting = $(".js-range-slider").data("ionRangeSlider");
            ionSetting.update({
                    from: 0,
                    to: 6
            });
            display.gift.tagwidth();
            $('#tprice_not').hide();
            $('#tprice_eqal').show();
            $('.tmin').html("전체 가격대");
            $('.tmax').html("");
            PagingCaller.destroy();
            $("#oneTwo-list").empty();
            $('#btnTagNm').show();
            $('#btnTagPrc').show();
            
            // 안드로이드 뒤로가기 이슈로 테마, 중테마, 가격대, 검색조건을 세션스토리지에 저장
            sessionStorage.setItem("voteFormInit", JSON.stringify($("#giftSearchForm").serializeObject()));
            
            display.gift.goTop();
            display.gift.getSearchCategoeryGoodsListPagingAjax(0);
        
    }
    , goHistoryBack : function(){
         history.go(-1);
    }
    , midThemeInit : function(){
        // 기프트관 2차 중카테고리 선택한값 초기화(테마를 선택할때마다 초기화 해야함)
        display.gift.giftMidDispCatNoArr = [];        
        // 검색쪽 중분류가 존재할수 잇기 때문에 조기화함
        $(".tag_midTheme").remove();
        // 중분류 테마가 존재할 수 있기 때문에 비워줌 
        $(".midThemeList  ul").empty();
        
        // 세션저장으로 사용하는 값도 초기화해줌
        //$("#midDispCatNoArr").val(null);
        
    }
    , getMidThemeListAjax : function(dispCatNo){

        var param = {};
        
        param.themeType = 'GIFTONE';
        param.dispCatNo = dispCatNo;
        
        //미리보기 파라미터 추가
        display.gift.setPreviewParam(param);
        
        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "main/getMidThemeListAjax.do"
                , param
                , display.gift.getMidThemeListAjaxCallback
                , false
        );

    }
    , getMidThemeListAjaxCallback : function(res){
        var result = res.dispThemeList;
        var resLength = 0;
        
        if(result != null){
            resLength = result.length;
            for (var i = 0; i < resLength; i++) {
                $li = $("<li>");
                $a = $("<a>").attr('onclick','display.gift.getMidThemeGoodsList(this);').attr('data-ref-dispContsNo', result[i].dispCatNo).text(result[i].catNm).attr("id", "midTheme_"+result[i].dispCatNo).addClass("midCatNo"+i);
                
                // 세션에 값이 존재하는 경우 세션에 있는 중분류값 선택한채로 뿌려짐 리스트는 이미 선택한 값으로 뿌려줌
                if(display.gift.sessionMidCatNoArr.length > 0){
                    var chkMidCatNo = []; 
                    for (var k = 0; k < display.gift.sessionMidCatNoArr.length; k++) {
                        if(result[i].dispCatNo == display.gift.sessionMidCatNoArr[k]){
                            $a.addClass("on");
                            var themeNm = result[i].catNm;
                            var themeSize = 0;
                            
                            if(themeNm.length > 10) {
                                themeNm = themeNm.substring(0, 10);
                                themeNm+= "....";
                            }
                            
                            $(".tag_list  div").append('<button type="button" onclick = "javascript:display.gift.deleteTag(\'btnTagMidTheme\', this);" data-ref-dispContsNo="'+display.gift.sessionMidCatNoArr[k]+'" id="tag_'+display.gift.sessionMidCatNoArr[k]+'" class="tag tag_midTheme"><span>'+themeNm+'</span></button>');
                            display.gift.tagwidth();
                        }
                    }
                }
                
                $li.append($a);
                $(".midThemeList  ul").append($li);
                
            }
            
            // 초기화전에 데이터를 담음
            //$("#midDispCatNoArr").val(display.gift.sessionMidCatNoArr);
            // 세션 사용후 초기화
            display.gift.sessionMidCatNoArr = [];
            
            $(".midThemeList").show();
            /*
            var _tagToggle = $('.tagToggle').find('a');
            _tagToggle.on('click', function(){$(this).toggleClass('on')});
            */
            /*
            var _colorToggle = $('.colorToggle').find('a');
            _colorToggle.on('click', function(){
                var _this = $(this),
                    _thisStyle = _this.attr('style'),
                    _themeColr = $('#sel_theme_id').attr('style').split('url')[0],
                    _themeColr = _themeColr.split(':')[1];      
                
                if(!_thisStyle){
                    _this.css({
                       'color':_themeColr,
                       'border-color':_themeColr
                    });
                }else{
                    _this.removeAttr('style');
                }
            });
            */
        }
    }
    // 기프트관 2차 중분류 테마를 클릭할때마다 호출되는함수 
    , getMidThemeGoodsList : function(obj){
        
        if(display.gift.themeDbClickChk){
            
            $(obj).toggleClass('on');
            var _this = $(obj),
                _thisStyle = _this.attr('style'),
                _themeColr = $('#sel_theme_id').attr('style').split('url')[0],
                _themeColr = _themeColr.split(':')[1];      
            
            if(!_thisStyle){
                _this.css({
                   'color':_themeColr,
                   'border-color':_themeColr
                });
            }else{
                _this.removeAttr('style');
            }
            
            // 테마 연속클릭을 제어함
            display.gift.themeDbClickChk = false;
            
            //common.showLoadingLayer(false);
            
            //페이징 콜러 제거
            PagingCaller.destroy();
            $("#oneTwo-list").empty();
            
            $(".tag_midTheme").remove();
            display.gift.giftMidDispCatNoArr = [];
            
            var midthemeList =  $('.midThemeList').find('a');
            
            // 한글 3바이트기준 30바이트(10자리)로 계산해서 말줄임 방식
            /*for (var i = 0; i < midthemeList.length; i++) {
                if(midthemeList.eq(i).hasClass("on")){
                    var themeNm = midthemeList.eq(i).text();
                    var themeSize = 0;
                    
                    for ( var j = 0; j < themeNm.length; j++) {
                        themeSize += display.gift.charByteSize(themeNm.charAt(j));
                    }
                    
                    if(themeSize > 30){
                        themeNm = display.gift.cutByteLength(midthemeList.eq(i).text(), 30);
                        themeNm+= "....";
                    }
                   
                    $(".tag_list  div").append('<button type="button" onclick = "javascript:display.gift.deleteTag(\'btnTagMidTheme\', this);" data-ref-dispContsNo="'+midthemeList.eq(i).attr("data-ref-dispContsNo")+'" id="tag_'+midthemeList.eq(i).attr("data-ref-dispContsNo")+'" class="tag tag_midTheme"><span>'+themeNm+'</span></button>');
                    
                   display.gift.giftMidDispCatNoArr.push(midthemeList.eq(i).attr("data-ref-dispContsNo"));
                   
                }
            }*/
            
            for (var i = 0; i < midthemeList.length; i++) {
                if(midthemeList.eq(i).hasClass("on")){
                    var themeNm = midthemeList.eq(i).text();
                    var themeSize = 0;
                    
                    if(themeNm.length > 10) {
                        themeNm = themeNm.substring(0, 10);
                        themeNm+= "....";
                    }
                    
                    $(".tag_list  div").append('<button type="button" onclick = "javascript:display.gift.deleteTag(\'btnTagMidTheme\', this);" data-ref-dispContsNo="'+midthemeList.eq(i).attr("data-ref-dispContsNo")+'" id="tag_'+midthemeList.eq(i).attr("data-ref-dispContsNo")+'" class="tag tag_midTheme"><span>'+themeNm+'</span></button>');
                    
                    display.gift.giftMidDispCatNoArr.push(midthemeList.eq(i).attr("data-ref-dispContsNo"));
                    
                }
            }
            
            // 
            $("#midDispCatNoArr").val(display.gift.giftMidDispCatNoArr);
            
            sessionStorage.setItem("voteFormInit", JSON.stringify($("#giftSearchForm").serializeObject()));
            
            display.gift.getSearchCategoeryGoodsListPagingAjax(0);
            display.gift.tagwidth();
        }
        
        
    }
    , cutByteLength : function(s, len) {

        if (s == null || s.length == 0) {
            return 0;
        }
        var size = 0;
        var rIndex = s.length;

        for ( var i = 0; i < s.length; i++) {
            size += display.gift.charByteSize(s.charAt(i));
            if( size == len ) {
                rIndex = i + 1;
                break;
            } else if( size > len ) {
                rIndex = i;
                break;
            }
        }

        return s.substring(0, rIndex);
    }
    , charByteSize : function(ch) {

        if (ch == null || ch.length == 0) {
            return 0;
        }

        var charCode = ch.charCodeAt(0);

        if (charCode <= 0x00007F) {
            return 1;
        } else if (charCode <= 0x0007FF) {
            return 2;
        } else if (charCode <= 0x00FFFF) {
            return 3;
        } else {
            return 4;
        }
    }
    ,  stickClose : function(ths){
        var _giftSticky = $('#giftSticky'),
            _contInner = _giftSticky.find('.contInner'),
            _this = $(ths),
            _thisId = _this.attr('id');    
        //$('#fixBtn').removeAttr('style').show(); 20200302 아이폰6에서 스크롤 문제로 아래 내용으로 대체함
        $('#fixBtn').css('z-index', 10).show();
        if(_giftSticky.hasClass('open') == true){
            $('#giftSticky').removeClass('open');
            _contInner.css('display', 'none');
        }else{
            // 투표 미니바가 닫혀있는 상태에서 닫기를 눌렀을때
            _giftSticky.removeAttr('class').addClass('fhide');
            $('#fixBtn').removeAttr('class');
            sessionStorage.setItem("sessionVoteClose", true);
            
            // 기프트관 DS 추가
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_mini_vote_close1");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_close1");
            }
            
            $("#giftSticky").remove();
            
        }       
        // 투표미니바가 오픈되어 있어서 닫기 버큰을 눌렀을때
        if(_thisId == 'btnHide'){
            _giftSticky.removeAttr('class').addClass('fhide');
            $('#fixBtn').removeAttr('class');
            sessionStorage.setItem("sessionVoteClose", true);
            
            // 기프트관 DS 추가
            if($("#giftPageName").val() == "Main"){
                common.wlog("gift_mini_vote_close2");
            } else if($("#giftPageName").val() == "Search"){
                common.wlog("gift_search_mini_vote_close2");
            }
            
            $("#giftSticky").remove();
        }
        
    }
    , getVoteInfo : function(mainCheckYn){
        var param = {
        		mainCheckYn : mainCheckYn
        };
        
        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "main/getGiftVoteListAjax.do"
                , param
                , function(res){
                    
                    if (res.trim() == '') {
                        // 투표가 존재하지 않으면 해당영역삭제
                        $("#giftSticky").remove();
                    } else {
                        
                        $("#giftSticky").append(res);
                        
                        var cookie = new Cookie();
                        
                        //console.log(cookie.get('voteClose'));
                        //20200904 기프트관 메인에서 발생하는게 아닐 시 조건 추가 CBLIM
                        if(mainCheckYn == 'N')
                        {
                        	if (cookie.get('voteClose') != undefined && cookie.get('voteClose') != "") {
                                var voteNo = $("#voteNo").val();
                                var cookieVoteNo = cookie.get('voteClose');
                                
                                // 현재 진행중인 투표와 쿠키로 저장되어 있는 투표코드값이 같은경우 
                                if(voteNo == cookieVoteNo){
                                    // 이번투표 그만보기 클릭했을경우 voteClose값이 존재하므로 더이상 
                                    $("#giftSticky").remove();
                                    return false;
                                } else {
                                    cookie.remove('voteClose');
                                }
                                
                            } 	
                        }
                        
                        
                        // 쿠키에 voteClose값이 존재하지 않는경우 해당 버튼 이벤트 진행 
                        var _giftSticky = $('#giftSticky');
                        _contInner = _giftSticky.find('.contInner');
                        $('.btn_sticky').on('click', function(){
                            var _sTop = $(window).scrollTop;
                            $('#fixBtn').css('z-index', '-1');
                            _giftSticky.addClass('open');
                            _contInner.slideDown(150);
                        });
                        
                        var sessionVoteLoginChk = sessionStorage.getItem("sessionVoteLoginChk");
                        
                        // 투표하기후 로그인을 누른경우
                        if(_voteLoginChk){ //  && sessionVoteLoginChk == "true" 아래 else if를 사용하고 싶은경우 조건 추가 필요
                            _voteLoginChk = false;
                            //setCloseSticky();
                            
                            setTimeout(function() {
                                var _sTop = $(window).scrollTop;
                                $('#fixBtn').css('z-index', '-1');
                                _giftSticky.addClass('on open');
                                _contInner.css('display', 'block');
                                
                                $("#fixBtn").addClass("giftOn");
                                $("#footerTab").removeClass("on");
                            }, 1000);
                            
                            
                            sessionStorage.setItem("sessionVoteLoginChk", false);
                            
                        }/* 투표하기 클릭후 로그인한 이후에 새로고침 혹은 페이지 이동해서 히스토리백이후에 
                            계속 투표가 오픈된상태로 노출되는데 그걸 결함이라고 하는 경우 해당 주석 풀면됨  
                        else if(_voteLoginChk && sessionVoteLoginChk == "false"){
                            _giftSticky.removeClass('open');
                            _contInner.css('display', 'none');
                            $('#fixBtn').removeAttr('style').show();
                            $('#fixBtn').addClass("on");
                        }*/
                        
                        $(window).on('scroll', function(){
                            var scrollH = 100;
                            if(scrollH < $(window).scrollTop()){
                                //$('#fixBtn').removeAttr('style').show(); 20200302 아이폰6에서 스크롤 문제로 아래 내용으로 대체함
                                $('#fixBtn').css('z-index', 10).show();
                            }else{
                                $('#fixBtn').hide();
                            }
                            if(_giftSticky.hasClass('on') && _giftSticky.hasClass('open')){
                                $('#fixBtn').css('z-index', '-1');
                            }
                        });
                        
                        vote.display.giftVoteInit();
                        
                    }
                   
                }
                , false
        );
    }
    , voteClose : function(obj){
        var cookie = new Cookie(365);

        // 이번투표 그만보기
        cookie.set('voteClose', $(obj).attr("vote-no")+"; sameSite=None; Secure");
        //sessionStorage.setItem("sessionVoteClose", true);
        
        // 기프트관 이번투표그만보기 DS
        if($("#giftPageName").val() == "Main"){
            common.wlog("gift_mini_vote_close3");
        } else if($("#giftPageName").val() == "Search"){
            common.wlog("gift_search_mini_vote_close3");
        }
        
        // app에 쿠키값 셋팅
        common.app.syncCookie();
        
        $("#giftSticky").remove();
        
        // 투표 닫기 클릭
        //$("#btnHide").click();
        
        /*var expdate = new Date();

        expdate.setTime(expdate.getTime() + 1 * 24 * 60 * 60 * 1000);
        

        document.cookie = "voteAAAA=" + $(obj).attr("vote-no") + "; path=/; domain=" + document.domain + "; expires="
                + expdate.toGMTString();*/
        
    }
    , getPreviewParam : function(connStr) {
        if (display.gift.previewParam.trim() != "") {
            return connStr + display.gift.previewParam;
        }
        return "";
    }
    // BO에서 모바일 미리보기 할경우 미리보기 데이터 값셋팅
    , setPreviewParam : function(orgObj) {

        if (orgObj != undefined && orgObj != null) {
            if (display.gift.previewParam.trim() != "") {
                var viewParam = {
                        viewMode : display.gift.viewMode,
                        viewStdDate : display.gift.viewStdDate
                };

                orgObj = $.extend(orgObj, viewParam);
            }
        }
    }
    //기프트관 2차 이벤트 이벤트
    , addStamp : function(fvrSeq){
        $(".fix_flow").hide();
        var param = {
            evtNo : $("input[id='evtNo']:hidden").val()
            ,fvrSeq : fvrSeq
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20200311/addStamp.do"
              , param
              , display.gift._callback_addStamp
        );
    }
    
    , _callback_addStamp : function(json){
        if(json.ret == "0"){
            display.gift.popLayerOpen('lay_giftEvt02');
        }else{
            alert(json.message);
        }
    }
    , goGiftCard : function(moveType){

        // 데이터 스토리 기프트관 메인일경우와 검색일경우 분기
    	var url = "giftCardGuide/getGiftCardGuide.do";
    	var param = "?trackingCd=Gift_Main_Giftcard";
        if(moveType == "main"){
            common.wlog("gift_main_move_giftcard");
            url = url + param;
        } else if($("#giftPageName").val() == "Search"){
            common.wlog("gift_search_move_giftcard");
        }
        n_click_logging( _baseUrl + "?clickarea=giftcard_mobile_gift_param2");
        // 기프트카드 링크 공통함수
        location.href = _plainUrl + url;
        
    }
};