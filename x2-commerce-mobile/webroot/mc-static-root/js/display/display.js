$.namespace("mdisplay.mcategory");
mdisplay.mcategory = {
        _ajax : common.Ajax ,
        
        stonUseYn : 'Y', /* web cache(ston) 사용여부 */

        init : function() { // 로드시
            //페이지 로딩 처리 초기화
            common.loadPage.init("#oneTwo-list", "MCatLst");

            var startIdx = common.loadPage.getPageIdx();
            
            /* 2020.07.05 히스토리 세션 추가 내용 주석처리 (카테고리관)
            if (history.state == null) {
                //history state 추가
                history.replaceState({status:"entry"}, null, null);
                history.pushState({status:"SCategoryMain"},null,null);
            }
            */

            var $mSubGnb = $("#mSubGnb"); // 서브카테고리

            $mSubGnb.find("ul li").each(function(){
                if($(this).hasClass("on")){

                    if( $(this).find("a").text() == "전체" ){
                        $("#dispCatNo").val($(this).find("a").attr("class"));
                        $("#fltDispCatNo").val("");
                    }else{
                        $("#dispCatNo").val("");
                        $("#fltDispCatNo").val($(this).find("a").attr("class"));
                    }
                }
            });

            //2depth 서브 gnb 메뉴로 인해 클래스 변경
            $("#mSubGnb").removeClass("fixed_gnb");

            //상단 서브 gnb 스와이프 init
            mdisplay.mcategory.setSwipe();

            // 저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.
            if (!common.loadPage.setSavedHtml()) {
                //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                mdisplay.mcategory.getCategoeryGoodsListPagingAjax(0);
            }else{
                //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                mdisplay.mcategory.getCategoeryGoodsListPagingAjax(startIdx);
            }

            //lazyload 처리
            common.setLazyLoad();

            //찜 처리 초기화
            common.wish.init();

            mdisplay.mcategory.bindEvent(); // 이벤트

        },

        setSwipe : function() {
            var mSubGnb_swiper = new Swiper('#mSubGnb', {
                initialSlide: 0,
                slidesPerView: 'auto',
                paginationClickable: true,
                spaceBetween: 0,
                loop: false
            });

            $("#mSubGnb").find("li").each(function(idx) {
                $(this).find("a").click(function() {
                    $(document).scrollTop(0);
                    $("#mSubGnb").find("li").removeClass("on");
                    $(this).parent().addClass("on");

                    mdisplay.mcategory.scrollToMenu(idx);
                });
            });
        },

        bindEvent : function() {

            var $mSubGnb = $("#mSubGnb"); // 서브카테고리

            $mSubGnb.find("ul li").click(function() { // 서브카테고리 클릭시 - 소카리스트
                /* 퍼블리싱 이벤트*/
                $(this).closest("li").addClass("on")
                .siblings().removeClass("on");

                // 더보기 기능이 클릭되어 있는 상태이면 닫기 이벤트 실행
                // [더보기] 버튼
                var $btnAddShow = $('.swiper-area').find('.button-view button');

                if($btnAddShow.hasClass('mClick')){
                    $btnAddShow.click();
                }
                /* 퍼블리싱 이벤트*/

                $("#dispCatNo").val($(this).find("a").attr("class"));

                if( $(this).find("a").text() == "전체" ){ // 검색 카테고리가 전체면
                    $("#fltDispCatNo").val("");
                    $("#catDpthVal").val($("#catDpthValDefault").val());
                    $("#ctgNoData").html("<p>" + $("#titConts h2.tit").text() + " 카테고리에 0 개의 상품이 등록되어 있습니다.</p>");
                }else{
                    $("#fltDispCatNo").val("");
                    $("#catDpthVal").val(parseInt($("#catDpthValDefault").val()) + 1);
                    $("#ctgNoData").html("<p>" + $(this).text() + " 카테고리에 0 개의 상품이 등록되어 있습니다.</p>");
                }
                
                //정렬 조건 초기화
                $("#prdSort").val("01");

                //페이징 콜러 제거
                PagingCaller.destroy();

                $("#oneTwo-list").empty();

                //loadingLayer
                common.showLoadingLayer(false);

                //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                mdisplay.mcategory.getCategoeryGoodsListPagingAjax(0);
            });

            var $sCatListUl = $("#sCatList");

            if( $sCatListUl.find("li").length < 6){ // 소카리스트가 6개 이하이면 더보기 버튼 숨김처리
                $(".button-view").hide();
            }

            $sCatListUl.find("li").click(function() { //더보기 메뉴
                $("#dispCatNo").val($(this).children().attr("class"));

                $(".swiper-area .button-view").find("button").click(); //소 카테고리 dim처리 해지 이벤트 발생

                $mSubGnb.find("ul li a").each(function(){
                    if( $(this).attr("class") ==  $("#dispCatNo").val()){
                        //$mSubGnb.find("ul li").click(function() -> 서브카테고리 클릭시 - 소카리스트
                        $(this).click();
                    }
                });
            });

            //2017-01-31 수정 (display.js line 134~152)
            $('.swiper-area').find('.button-view button').on('click',function(){
                $('#mContainer').find('.swiper-area').toggleClass('open');
                $(this).toggleClass('mClick');
                $('#mHeader').toggleClass('dimOn');
                

                if($(this).hasClass('mClick')){
                    if( $('.swiper-area').find('.mlist-menu ul li').length == 0 ){
                        $('.swiper-area').find('.button-view button').click();
                    }
                    $(document).on('click', '.mDim', function() {
                        $('#mContainer').find('.swiper-area').removeClass('open');
                        $('.swiper-area').find('.button-view button').removeClass('mClick');
                    });
                }
            });
            //2017-05-17 수정 (display js line 142~157부분 대체)
            var viewBtnFunction = function(){
                if($('.swiper-area').hasClass('focused')){
                    if($('.swiper-area').find('.button-view button').hasClass('mClick')){
                        $('.swiper-area').find('.button-view button').removeClass('mClick');
                        $('.swiper-area').removeClass('open');
                    }else{
                        $('.swiper-area').find('.button-view button').addClass('mClick');
                        $('.swiper-area').addClass('open');
                    }
                }
            };
/*
            $('.swiper-area').find('.button-view button').focusin(function(){
                $('#mContainer').find('.swiper-area').addClass('open focused');

                setTimeout(function(){
                    $('.swiper-area .button-view button').unbind('click',viewBtnFunction);
                    $('.swiper-area .button-view button').bind('click',viewBtnFunction);
                },0);

                $(this).addClass('mClick');

                if($(this).hasClass('mClick')){
                    if( $('.swiper-area').find('.mlist-menu ul li').length == 0 ){
                        $('.swiper-area').find('.button-view button').click();
                    }
                    $(document).on('click', '.mDim', function() {
                        $('#mContainer').find('.swiper-area').removeClass('open');
                        $('.swiper-area').find('.button-view button').removeClass('mClick');
                    });
                }
            });
            $(document).on({
                'focusin' : function(e){
                    if($('.swiper-area.open').has(e.target).length === 0 || $('.swiper-area.open #mSubGnb').has(e.target).length === 1){
                        $('.swiper-area').find('.button-view button').removeClass('mClick');
                        $('.swiper-area').removeClass('open focused');
                        $('.swiper-area .button-view button').unbind('click',viewBtnFunction);
                    }
                }
            });
            */
            //2017-05-17 수정 (display js line 142~157부분 대체) - end
            
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

            $("#prdSort").bind("change", function() {

                //페이징 콜러 제거
                PagingCaller.destroy();

                $("#oneTwo-list").empty();

                //loadingLayer
                common.showLoadingLayer(false);

                //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                mdisplay.mcategory.getCategoeryGoodsListPagingAjax(0);
            });

            $('.dim').on('click' , function() {
                if ($(".allmenu").hasClass("show")) {
                    if ( history.state.status == "entry" ){
                        history.forward();
                    }
                }
            });

            $(".allmenuClose").click(function(){
                if ( history.state.status == "entry" ){
                    history.forward();
                }
            });

            $(window).bind("popstate", function() {

                //페이지 진입 시점인 경우
                if (history.state.status == "entry") {
                    $(".allmenuOpen").click();
                }

            });

            //찜 체크 처리.
            common.wish.checkWishList();

            setTimeout(function() {
                //링크 처리
                common.bindGoodsListLink();
                //페이지 로딩 처리 클릭 이벤트처리
                common.loadPage.bindEvent();
            }, 100);

        },

        getCategoeryGoodsListPagingAjax : function ( startIdx ){ // 상품 검색

            //연속키 방식
            PagingCaller.init({
                callback : function(){
                    //코드 완료 후 스토어 정보 조회
                    var param = {
                            dispCatNo  : $("#dispCatNo").val() ,
                            catDpthVal : $("#catDpthVal").val() ,
                            pageIdx    : PagingCaller.getNextPageIdx(),
                            prdSort    : $("#prdSort").val()
                    }
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "display/getCategoeryGoodsListPagingAjax.do"
                            , param
                            , mdisplay.mcategory.getCategoeryGoodsListPagingAjaxCallback);

                    common.loadPage.setPageIdx(param.pageIdx);
                }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
            });

        },

        getCategoeryGoodsListPagingAjaxCallback : function(res){
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

                setTimeout(function() {
                    //링크 처리
                    common.bindGoodsListLink();
                    //페이지 로딩 처리 클릭 이벤트처리
                    common.loadPage.bindEvent();

                }, 100);
            }

            //loadingLayer
            common.hideLoadingLayer();
        },

        /**
         * 메뉴 idx에 따른 위치값 보정
         * @param gnbTabIdx
         */
        scrollToMenu : function(gnbTabIdx) {
            var width = $(document).width();
            var menuBarWidth = 0;

            var gnbMenuTag = $('#mSubGnb').find('ul');
            var gnbMenu = $(".sub_gnb_cate.swiper-wrapper");
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
//                console.log(gnbMenuTag.find("li").eq(i).outerWidth() + " : " + checkSum + " : " + documentHalfWidth);
                if (checkSum > documentHalfWidth) {
                    fixedLeftPositionIdx = i - 1;
                    break;
                } else {
                    checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
                }
//                console.log("f : " + checkSum);
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

//              console.log(fixedLeftPositionIdx + " : " + fixedRightPositionIdx + " : " + menuBarWidth + " : " + width + " : " + gnbTabIdx + " :" + checkSum + " : " + documentOffsetLeft + " : " + (checkSum - documentOffsetLeft));
    //
//              var fixedPositionIdx = Math.ceil(documentOffsetLeft / gnbCellWidth) - 1;

//                .css('transition-duration','500ms');

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

$.namespace("mdisplay.brandShopDetail");
mdisplay.brandShopDetail = {
        _ajax   : common.Ajax ,

        init : function(sparam) { // 로드시
            //페이지 로딩 처리 초기화
            common.loadPage.init("#oneTwo-list", "BrndLst");

            var startIdx = common.loadPage.getPageIdx();

            var $mSubGnb = $("#mSubGnb"); // 서브카테고리

            //2depth 서브 gnb 메뉴로 인해 클래스 변경
            $("#mSubGnb").removeClass("fixed_gnb");

            //상단 서브 gnb 스와이프 init
            mdisplay.brandShopDetail.setSwipe();

            // 저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.
            if (!common.loadPage.setSavedHtml()) {
                //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                mdisplay.brandShopDetail.getBrandShopDetailGoodsPagingAjax(0);
            }else{
                //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                mdisplay.brandShopDetail.getBrandShopDetailGoodsPagingAjax(startIdx);
            }

            mdisplay.brandShopDetail.bindEvent();

            //찜 처리 초기화
            common.wish.init();

            common.setLazyLoad();

        },

        setSwipe : function() {
            var mSubGnb_swiper = new Swiper('#mSubGnb', {
                initialSlide: 0,
                slidesPerView: 'auto',
                paginationClickable: true,
                spaceBetween: 0,
                loop: false
            });

            $("#mSubGnb").find("li").each(function(idx) {
                $(this).find("a").click(function() {
                    $(document).scrollTop(0);
                    $("#mSubGnb").find("li").removeClass("on");
                    $(this).parent().addClass("on");

                    mdisplay.brandShopDetail.scrollToMenu(idx);
                });
            });
        },

        bindEvent : function() {
            $(".sub_gnb_cate li a").bind("click", function() {
                $("#mFixTab").removeClass();

                $("#fltDispCatNo").val( $(this).attr("data-ref-dispCatNo") ) ;

                if( common.isEmpty( $(this).attr("data-ref-dispCatNo") )){ //전체 검색일때
                    $("#fltDispCatNo").val( "" );
                }

                //페이징 콜러 제거
                PagingCaller.destroy();

                $("#oneTwo-list").empty();

                //loadingLayer
                common.showLoadingLayer(false);
                //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                mdisplay.brandShopDetail.getBrandShopDetailGoodsPagingAjax(0);

            });

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

            $("#prdSort").bind("change", function() {

                //페이징 콜러 제거
                PagingCaller.destroy();

                $("#oneTwo-list").empty();

                //loadingLayer
                common.showLoadingLayer(false);

                //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
                mdisplay.brandShopDetail.getBrandShopDetailGoodsPagingAjax(0);
            });

            $('.dim').on('click' , function() {
                if ($(".allmenu").hasClass("show")) {
                    history.forward();    
                }
            });

            $(".allmenuClose").click(function(){
                history.forward();
            });

            //찜 체크 처리.
            common.wish.checkWishList();

            setTimeout(function() {
                //링크 처리
                common.bindGoodsListLink();
                //페이지 로딩 처리 클릭 이벤트처리
                common.loadPage.bindEvent();
            }, 100);

        },

        getBrandShopDetailGoodsPagingAjax : function (startIdx){ // 상품 검색

            //연속키 방식
            PagingCaller.init({
                callback : function(){
                    //코드 완료 후 스토어 정보 조회
                    var param = {
                            onlBrndCd    : $("#onlBrndCd").val() ,         // 브랜드 코드
                            pageIdx      : PagingCaller.getNextPageIdx() , // 페이징 인덱스
                            dispCatNo    : $("#dispCatNo").val() ,         // 서브 카테고리
                            fltDispCatNo : $("#fltDispCatNo").val() ,      // 서브 카테고리
                            prdSort      : $("#prdSort").val()             // 정렬검색
                    }
                    common.Ajax.sendRequestSton( 
                            "GET"
                            , _baseUrl + "display/getBrandShopDetailGoodsPagingAjax.do"
                            , param
                            , mdisplay.brandShopDetail.getBrandShopDetailGoodsPagingAjaxCallback
                            , false
                            , mdisplay.mcategory.stonUseYn // stonUseYn
                    );

                    common.loadPage.setPageIdx(param.pageIdx);
                }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
            });

        },

        getBrandShopDetailGoodsPagingAjaxCallback : function (res){  // 상품 리스트 html 생성

          //페이지당 20개, 5페이지 이상 조회 시 destroy
            if (res.trim() == '') {
                //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
                PagingCaller.destroy();

            } else {
                //응답 결과가 있는 경우 append 처리 후 lazyload 처리
                $("#oneTwo-list").append(res);

                common.setLazyLoad();

                //찜 체크 처리.
                common.wish.checkWishList();

                setTimeout(function() {
                    //링크 처리
                    common.bindGoodsListLink();
                    //페이지 로딩 처리 클릭 이벤트처리
                    common.loadPage.bindEvent();

                }, 100);

            }

            //loadingLayer
            common.hideLoadingLayer();

        },


        /**
         * 메뉴 idx에 따른 위치값 보정
         * @param gnbTabIdx
         */
        scrollToMenu : function(gnbTabIdx) {
            var width = $(document).width();
            var menuBarWidth = 0;

            var gnbMenuTag = $('#mSubGnb').find('ul');
            var gnbMenu = $(".sub_gnb_cate.swiper-wrapper");
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
//                console.log(gnbMenuTag.find("li").eq(i).outerWidth() + " : " + checkSum + " : " + documentHalfWidth);
                if (checkSum > documentHalfWidth) {
                    fixedLeftPositionIdx = i - 1;
                    break;
                } else {
                    checkSum += gnbMenuTag.find("li").eq(i).outerWidth() / 2;
                }
//                console.log("f : " + checkSum);
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

//              console.log(fixedLeftPositionIdx + " : " + fixedRightPositionIdx + " : " + menuBarWidth + " : " + width + " : " + gnbTabIdx + " :" + checkSum + " : " + documentOffsetLeft + " : " + (checkSum - documentOffsetLeft));
    //
//              var fixedPositionIdx = Math.ceil(documentOffsetLeft / gnbCellWidth) - 1;

//                .css('transition-duration','500ms');

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
