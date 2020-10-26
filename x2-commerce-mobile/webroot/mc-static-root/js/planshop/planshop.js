$.namespace("mplanshop.detail");
mplanshop.detail = {
    url : "",
    initSns : function(){
        mplanshop.detail.url = _baseUrl + 'PLAN.do?dispCatNo=' + $("#dispCatNo").val();
        common.sns.init( $("#snsImg").val(),$("#catMrkNm").val(), mplanshop.detail.url);

        //오늘드림 공유하기 (카카오톡 버튼 2개 용)
        if(!common.isEmpty($('#kakaoAddButtonUse').val())){
            common.sns.initKakaoEvt( "http:" + _cdnImgUrl + $("#kakaoShareImg").val(), $('#kakaoShareTitle').val(), mplanshop.detail.url);
        }
    },
    init : function(){
        // 상단 html영역 style 변경 - width 100% 고정
        $(".main_contents").find("img").removeAttr('style').attr("style","width:100%;")

        //페이지 로딩 처리 초기화
        common.loadPage.init("#mContents", "PlanShop");

        //저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.
        common.loadPage.setSavedHtml();

        common.setLazyLoad();

        mplanshop.detail.addCssClass();

        //찜 처리 초기화
        common.wish.init();

        mplanshop.detail.bindEvent();

        setTimeout(function() {
            $(document).resize();
        }, 500);

        mplanshop.detail.initSns();

        $('.btnShare').click(function(){
            mplanshop.detail.dispSnsPopup();
            common.popLayerOpen("SNSLAYER");
            $.fn.enableSelection();
        });

        $("#planTitle").html(mplanshop.detail.cutByLen($("#catMrkNm").val(),51));

        var loopCnt = $("#themeLoopCnt").val();

        for(var i=1;i<=loopCnt;i++){
            $("#themeSpan"+i).text(mplanshop.detail.cutByLen($("#themeSpan"+i).text(),51));
        }
    },

    dispSnsPopup : function(){

        var $popLayer = $("<div>").addClass("popLayerArea");
        $("#SNSLAYER").html($popLayer);

        var $dimLayer = $("<div>").addClass("dimLayer");
        $popLayer.append($dimLayer);

        var $ul = $("<ul>").addClass("shareSNS");
        $dimLayer.append($ul);

        var $liKaka = $("<li>").addClass("kaka");
        $ul.append($liKaka);

        var $aKaka = $("<a>").addClass("snsShareDo").text("카카오톡");
        $aKaka.click(function(){
        	//오늘드림 공유하기 (카카오톡 버튼 2개 용)
        	if(!common.isEmpty($('#kakaoAddButtonUse').val())){
        		mplanshop.eventDetail.kakaoShareSnsBtn2();
        	}else{
            	common.sns.doShare("kakaotalk");
        	}
        });
        $liKaka.append($aKaka);


        var $liKakaS = $("<li>").addClass("kakaoS");
        $ul.append($liKakaS);

        var $aKakaS = $("<a>").addClass("snsShareDo").text("카카오스토리");
        $aKakaS.click(function(){common.sns.doShare("kakaostory");});
        $liKakaS.append($aKakaS);


        var $liFb = $("<li>").addClass("fb");
        $ul.append($liFb);

        var $aFb = $("<a>").addClass("snsShareDo").text("페이스북");
        $aFb.click(function(){common.sns.doShare("facebook");});
        $liFb.append($aFb);


        var $liUrl = $("<li>").addClass("url");
        $ul.append($liUrl);
        var $aUrl = $("<a>").addClass("snsShareDo").text("URL");
        $aUrl.click(function(){common.sns.doShare("url");});
        $liUrl.append($aUrl);
        var $divUrl = $("<div>").addClass("urlCopy").attr("id","urlInfo");
        $liUrl.append($divUrl);
        var $pUrl = $("<p>").text("아래의 URL을 복사해주세요.");
        $divUrl.append($pUrl);
//        var $inputUrl = $("<input>").attr("type","text")
//                                     .attr("title","url")
//                                     .attr("id","shareUrlTxt")
//                                     .attr("name","shareUrlTxt")
//                                     .attr("style","width:100%")
//                                     .attr("value",location.href)
//                                     .attr("readonly",true);
//
        var $inputUrl = $("<div>").attr("class","input-url")
                                    .attr("id","shareUrlTxt")
                                    .attr("style","word-break:break-all;word-wrap:break-word;min-height:26px;max-height:51px;height:auto;");
        $inputUrl.html(mplanshop.detail.url);
        $divUrl.append($inputUrl);


        var $aClose = $("<a>").addClass("btnClose").text("닫기");
        $aClose.click(function(){
            //  드래그 방지 막기
            $.fn.disableSelection();
            common.popLayerClose("SNSLAYER");
        });
        $dimLayer.append($aClose);

    },


    bindEvent : function() {
        //셀렉트박스 선택이벤트
        $(".temaSoting").change(function(){

            $(".temaBox").show();
            var index = $(".temaSoting option").index($(".temaSoting option:selected"))-1;

            $(".temaSoting option").each(function() {
                if ($(this).is(":selected")) {
                    $(this).attr("selected", "true");
                } else {
                    $(this).removeAttr("selected");
                }
            });

            setTimeout(function() {
                $(document).resize();
            }, 500);

            $('.temaBox').css('margin-top', 0);
            $('.temaSoting').removeClass('fixArea');
            var offset = $('.temaSoting').offset().top;
            $('html, body').scrollTop(offset);

            //전체보기가 아닌 경우
            if(index > -1){
                $(".temaBox :not(:eq(" + index + "))").hide();
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

    addCssClass : function(){
        if($(".link-tit .Img a").height() > 20){
            $(".Img").addClass("double");
        }
    },

    cutByLen : function (str, maxByte) {
        for(b=i=0;c=str.charCodeAt(i);) {
            b+=c>>7?3:1;
            if (b > maxByte)
            break;
            i++;
        }
        return str.substring(0,i);
    }
};

//전문관
$.namespace("mplanshop.spcShop");
mplanshop.spcShop = {
    nextPageIdx : 1,
    viewMode : "",
    viewStdDate : "",

    previewParam : "",

    init : function(){
        //페이지 로딩 처리 초기화
        common.loadPage.init("#mContents", "SpcShop");

        //저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.
        common.loadPage.setSavedHtml();

        //LazyLoad
        common.setLazyLoad();
        //Swipe
        mplanshop.spcShop.setSwipe();
        //찜 처리 초기화
        common.wish.init();
        //클릭이벤트 바인드
        mplanshop.spcShop.bindEvent();

        var startIdx = 1;
        if ($("#mContents").attr("data-ref-pageIdx") != undefined && $("#mContents").attr("data-ref-pageIdx") != "") {
            startIdx = parseInt($("#mContents").attr("data-ref-pageIdx"));
        }

        //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
        mplanshop.spcShop.getSpcPplrPagingAjax(startIdx);

        setTimeout(function() {
            $(document).resize();
        }, 100);
    },

    getPreviewParam : function(connStr) {
        if (mplanshop.spcShop.previewParam.trim() != "") {
            return connStr + mplanshop.spcShop.previewParam;
        }
        return "";
    },

    setPreviewParam : function(orgObj) {

        if (orgObj != undefined && orgObj != null) {
            if (mplanshop.spcShop.previewParam.trim() != "") {
                var viewParam = {
                        viewMode : mplanshop.spcShop.viewMode,
                        viewStdDate : mplanshop.spcShop.viewStdDate
                };

                orgObj = $.extend(orgObj, viewParam);
            }
        }
    },

    setSwipe : function(){
        if($('.mSlider-area li').length > 1){
            //온리원 & 전문관 배너 2017-01-18 수정
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

    bindEvent : function() {
        //브랜드배너 클릭이벤트
        $(".mlist-brand > li > a:not(:eq(7))").bind('click', function(){
            var onlBrndCd = $(this).attr("data-ref-dispContsNo");
            common.link.moveBrandShop(onlBrndCd);
        });

        //브랜드 더보기 클릭
        $(".mlist-brand li a:eq(7)").bind('click',function(){
            //팝업 세팅
            mplanshop.spcShop.setBrandPopup();

            common.popLayerOpen("LAYERPOP01");

            //앱 호출 - 앱 내 레이어팝업 스크롤 시 새로고침처리되는 기능 disable 처리
            setTimeout(function() {
                common.app.callMenu("Y");
            },100);
        });

        //기획전 배너 클릭이벤트
        $(".submain-onlyone .mlist-promotion").find("li").bind('click', function(){
            var planshopCatNo = $(this).attr("data-ref-dispCatNo");
            common.link.movePlanShop(planshopCatNo);
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

    //전문관 하단 1단형 상품영역 페이징
    getSpcPplrPagingAjax : function(startIdx, dispCatNo) {
        //연속키 방식
        PagingCaller.init({
            callback : function(){
                mplanshop.spcShop.nextPageIdx = PagingCaller.getNextPageIdx();

                var param = {
                    pageIdx : mplanshop.spcShop.nextPageIdx,
                    dispCatNo : $("#titConts .tit").attr("data-ref-dispCatNo")
                };

                //미리보기 파라미터 추가
                mplanshop.spcShop.setPreviewParam(param);

                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "planshop/getSpcGoodsPagingAjax.do"
                        , param
                        , mplanshop.spcShop.getSpcGoodsPagingAjaxCallback);

                $("#mContents").attr("data-ref-pageIdx", param.pageIdx);
            }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
        });
    },

    getSpcGoodsPagingAjaxCallback : function(res) {

        //최대 100개 온리원 상품 페이징 조회
        if (res.trim() == "" || mplanshop.spcShop.nextPageIdx > 10) {
            //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
            PagingCaller.destroy();

        } else {
            //응답 결과가 있는 경우 append 처리 후 lazyload 처리
            $(".onlyone-hit").next().append(res);

            common.setLazyLoad();

            //찜 체크 처리.
            common.wish.checkWishList();

            setTimeout(function() {
                //링크 처리
                common.bindGoodsListLink();
            }, 100);

        }
    },

    setBrandPopup : function(){
        var brandCnt = $(".mlist-brand li a[data-ref-dispcontsno]").size();
        var innerLiSet = "";
        var liCnt = 1;

        for(var i = 0; i < brandCnt; i++){
            if(liCnt == 1){
                innerLiSet += "<li>";
            }

            innerLiSet += $(".mlist-brand li a[data-ref-dispcontsno]").eq(i).clone().wrapAll('<div/>').parent().html();

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

    trimPolyfill: function() {
        /**
         * String.prototype.trim() polyfill
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
         */
        if (!String.prototype.trim) {
            String.prototype.trim = function() {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            };
        }
    },

    truncate: function(elem, limit, after) {
        // Make sure an element and number of items to truncate is provided
        if (!elem || !limit) return;

        // Get the inner content of the element
        var content = elem.textContent || elem.innerText;
        content = content.trim();

        // Convert the content into an array of words
        // Remove any words above the limit
        content = content.split('').slice(0, limit);


        // Convert the array of words back into a string
        // If there's content to add after it, add it
        content = content.join('') + (after || '');

        // Inject the content back into the DOM
        if (elem.textContent) {
            elem.textContent = content;
        } else {
            elem.innerText = content;
        }
    }, handleStyleSheet: function(style) {
        if (
                typeof style !== 'object' &&
                !Object.keys(style['@global']).length
            ) {
                return;
            }

            var _jss = jss.create();
            var _presetDefault = jssPresetDefault.default;
            var _global = jssPluginGlobal.default;
            var _vendorPrefixer = jssPluginVendorPrefixer.default;

            _jss.setup(_presetDefault());
            _jss.setup({ insertionPoint: 'custom-insertion-point' });
            _jss.use(_global(), _vendorPrefixer());

            var sheet = _jss.createStyleSheet(style);
            sheet.attach();
        },

        handleParallax: function() {
            $('.parallax-image').each(function() {
                var img = $(this);
                var imgParent = $(this).parent();

                function parallaxImg() {
                    var speed = img.data('speed');
                    var imgY = imgParent.offset().top;
                    var winY = $(this).scrollTop();
                    var winH = $(this).height();
                    var parentH = imgParent.innerHeight();

                    // The next pixel to show on screen
                    var winBottom = winY + winH;
                    var imgPercent;

                    // If block is shown on screen
                    if (winBottom > imgY && winY < imgY + parentH) {
                        // Number of pixels shown after block appear
                        var imgBottom = (winBottom - imgY) * speed;
                        // Max number of pixels until block disappear
                        var imgTop = winH + parentH;
                        // Porcentage between start showing until disappearing
                        imgPercent = (imgBottom / imgTop) * 100 + (50 - speed * 50);
                    }

                    img.css({
                        top: imgPercent + '%',
                        transform: 'translate(-50%, -' + imgPercent + '%)',
                    });
                }

                $(document).on({
                    ready: function() {
                        parallaxImg();
                    },
                    scroll: function() {
                        parallaxImg();
                    },
                });
            });
        },
};

//전문관
$.namespace('mplanshop.luxurySpcShop');
mplanshop.luxurySpcShop = {
    nextPageIdx: 1,
    viewMode: '',
    viewStdDate: '',
    previewParam: '',
    init: function(heroHeadings) {
        mplanshop.luxurySpcShop.heroHeadings = heroHeadings;


        // LazyLoad
        common.setLazyLoad();
        // Swipe
        mplanshop.luxurySpcShop.setSwipe();
        // 찜 처리 초기화
        common.wish.init();
        // 클릭이벤트 바인드
        mplanshop.luxurySpcShop.bindEvent();

        $('#tabList li').click(function() {
            $(this)
                .addClass('active')
                .parents('ul#tabList')
                .find('li')
                .not($(this))
                .removeClass('active');

            var currentTabIndex = $(this).index();

            $('.product-list:eq(' + currentTabIndex + ')')
                .addClass('active')
                .parents('.product-list-container')
                .find('.product-list')
                .not($('.product-list:eq(' + currentTabIndex + ')'))
                .removeClass('active');
        });

        //전문관 상품 리스트 클릭 이벤트
        $(".luxury-brands-categories ul li").bind('click',function(e){

          var dispContsNo = $(this).find('a').attr("data-ref-dispContsNo");
          var setNo = $(this).find('a').attr("data-ref-setNo");
          common.link.moveLuxurySpcShopGoodsList(dispContsNo,setNo);

        });

        setTimeout(function() {
            $(document).resize();
        }, 100);
    },
    /*
    getPreviewParam: function(connStr) {
        if (mplanshop.luxurySpcShop.previewParam.trim() != '') {
            return connStr + mplanshop.luxurySpcShop.previewParam;
        }
        return '';
    },
     */
    setPreviewParam: function(orgObj) {
        if (orgObj != undefined && orgObj != null) {
            if (mplanshop.luxurySpcShop.previewParam.trim() != '') {
                var viewParam = {
                    viewMode: mplanshop.luxurySpcShop.viewMode,
                    viewStdDate: mplanshop.luxurySpcShop.viewStdDate,
                };

                orgObj = $.extend(orgObj, viewParam);
            }
        }
    },

    setSwipe: function() {
        var brandsCategoriesSwiper = new Swiper(
            '.luxury-brands-categories .swiper-container',
            {
                loop: false,
                slidesPerView: 'auto',
                spaceBetween: 0,
                initialSlide: 0,
            }
        );

        var heroSwiper = new Swiper('#mainFullSlider', {
            preloadImages: true,
            lazyLoading: false,
            autoplay: 3000,
            loop: true,
            slidesPerView: 'auto',
            spaceBetween: 0,
            initialSlide: 0,
            watchSlidesVisibility: true,
            centeredSlides: true,
            pagination: '.luxury-brands-hero .swiper-pagination',
            nextButton: '.luxury-brands-hero .swiper-button-next',
            prevButton: '.luxury-brands-hero .swiper-button-prev',
            runCallbacks: true,
            onInit: function() {
                var el = document.querySelector(
                    '.luxury-brands-hero .swiper-container'
                );
                el.className += ' initialized';
            },
            onAutoplayStart: function(e) {
                $('.luxury-brands-hero .swiper-slide-autoplay').addClass(
                    'hide'
                );
                $('.swiper-slide-pause').removeClass('hide');
            },
            onAutoplayStop: function(e) {
                $('.luxury-brands-hero .swiper-slide-autoplay').removeClass(
                    'hide'
                );
                $('.luxury-brands-hero .swiper-slide-pause').addClass('hide');
            },
            onSlideChangeStart: function(e) {
                var el = document.querySelector('.hero-heading');
                el.innerHTML = mplanshop.luxurySpcShop.heroHeadings[e.realIndex];
            },
        });

        $('.luxury-brands-hero .swiper-slide-autoplay').on('click', function() {
            heroSwiper.startAutoplay();
        });

        $('.luxury-brands-hero .swiper-slide-pause').on('click', function() {
            heroSwiper.stopAutoplay();
        });

        var premiumSwiper = new Swiper('#premium_brand_list', {
            slidesPerView: 'auto',
            spaceBetween: 10,
            scrollbar: '.luxury-brands-premium .swiper-scrollbar',
            scrollbarHide: false,
        });

        var mdRecommendation = new Swiper('#md-recommendation-list', {
            slidesPerView: 2.45,
            spaceBetween: 25,
            scrollbar: '#md-recommendation-list .swiper-scrollbar',
            scrollbarHide: false,
        });

        var brandIntroduction = new Swiper('#brand-introduction-list', {
            slidesPerView: 'auto',
            spaceBetween: 10,
            scrollbar: '#brand-introduction-list .swiper-scrollbar',
            scrollbarHide: false,
        });


        if ($('.mSlider-area li').length > 1) {
            // 온리원 & 전문관 배너 2017-01-18 수정
            var only_set = {
                slidesPerView: 1,
                autoplay: 2500,
                pagination: '.paging',
                paginationClickable: true,
                freeMode: false,
                spaceBetween: 0,
                loop: true,
            };
            var only_swiper = Swiper('.mlist-promotion', only_set);
        }
    },

    bindEvent: function() {
        $('a[href="#"]').on('click', function(e) {
            e.preventDefault();
        });

        // 찜 체크 처리.
        common.wish.checkWishList();

        setTimeout(function() {
            // 링크 처리
            common.bindGoodsListLink();
            // 페이지 로딩 처리 클릭 이벤트처리
            common.loadPage.bindEvent();
        }, 100);


        // 웹로그 바인딩
        setTimeout(function() {
            mplanshop.luxurySpcShop.bindWebLog();
        }, 700);

    },
    bindWebLog: function() {
        $('.luxury-brands-categories li a').each(function(index) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'pre_m_cat' + idx;
                common.wlog(key);
            });
        });

        $('.luxury-brands-hero .swiper-slide').each(function() {
            $(this).bind('click', function() {
                var idx = $(this).data('item-index') + 1;
                var key = 'pre_m_main' + idx;
                common.wlog(key);
            });
        });

        $('.luxury-brands-plan-banner .plan_banner').each(function(index) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'pre_m_event' + idx;
                common.wlog(key);
            });
        });

        $('.luxury-brands-premium #premium_brand_list > ul > li').each(function(
            index
        ) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'pre_m_brand' + idx;
                common.wlog(key);
            });
        });

        $(
            '.luxury-brands-md-recommendation #md-recommendation-list li > .prd_info'
        )
            .parent()
            .each(function() {
                $(this).bind('click', function() {
                    var idx = $(this).data('item-index') + 1;
                    var key = 'pre_m_recgoods' + idx;
                    common.wlog(key);
                });
            });

        $('.luxury-brands-introduction .plan_banner').each(function() {
            $(this).bind('click', function() {
                var idx = $(this).data('item-index') + 1;
                var key = 'pre_m_brdstory' + idx;
                common.wlog(key);
            });
        });

        $('#new-arrival-products .goodsList').each(function(index) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'pre_m_newgoods' + idx;
                common.wlog(key);
            });
        });

        $('#best-products .goodsList').each(function(index) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'pre_m_popgoods' + idx;
                common.wlog(key);
            });
        });
    },
    handleStyleSheet: function(style) {
        if (
            typeof style !== 'object' &&
            !Object.keys(style['@global']).length
        ) {
            return;
        }

        var _jss = jss.create();
        var _presetDefault = jssPresetDefault.default;
        var _global = jssPluginGlobal.default;
        var _vendorPrefixer = jssPluginVendorPrefixer.default;

        _jss.setup(_presetDefault());
        _jss.setup({ insertionPoint: 'custom-insertion-point' });
        _jss.use(_global(), _vendorPrefixer());

        var sheet = _jss.createStyleSheet(style);
        sheet.attach();
    },

    handleParallax: function(option) {
        if (!option.element || !option || $.isEmptyObject(option)) {
            return;
        }

        if (option.speed <= 0) {
            $(option.element).append($('<div>').addClass('parallax-image'));
        } else {
            $(option.element).append(
                $('<img>')
                    .attr({ src: option.image, alt:option.image_alt })
                    .addClass('parallax-image')
            );

            $('.parallax-image').each(function() {
                var img = $(this);
                var imgParent = $(this).parent();

                function parallaxImg() {
                    var speed = option.speed / 100;
                    var imgY = imgParent.offset().top;
                    var winY = $(this).scrollTop();
                    var winH = $(this).height();
                    var parentH = imgParent.innerHeight();

                    // The next pixel to show on screen
                    var winBottom = winY + winH;
                    var imgPercent;

                    // If block is shown on screen
                    if (winBottom > imgY && winY < imgY + parentH) {
                        // Number of pixels shown after block appear
                        var imgBottom = (winBottom - imgY) * speed;
                        // Max number of pixels until block disappear
                        var imgTop = winH + parentH;
                        // Porcentage between start showing until disappearing
                        imgPercent =
                            (imgBottom / imgTop) * 100 + (50 - speed * 100);
                    }

                    img.css({
                        top: imgPercent + '%',
                        transform: 'translate(-50%, -' + imgPercent + '%)',
                    });
                }

                $(document).on({
                    ready: function() {
                        parallaxImg();
                    },
                    scroll: function() {
                        parallaxImg();
                    },
                });
            });
        }
    },
    handleVideoPlayer: function(option) {
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

        var videoObject = new VideoWorker(url);

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

    trimPolyfill: function() {
        /**
         * String.prototype.trim() polyfill
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
         */
        if (!String.prototype.trim) {
            String.prototype.trim = function() {
                return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            };
        }
    },

    truncate: function(elem, limit, after) {
        // Make sure an element and number of items to truncate is provided
        if (!elem || !limit) return;

        // Get the inner content of the element
        var content = elem.textContent || elem.innerText;
        content = content.trim();

        // Convert the content into an array of words
        // Remove any words above the limit
        content = content.split('').slice(0, limit);

        // Convert the array of words back into a string
        // If there's content to add after it, add it
        content = content.join('') + (after || '');

        // Inject the content back into the DOM
        if (elem.textContent) {
            elem.textContent = content;
        } else {
            elem.innerText = content;
        }
    },
};




$.namespace("mplanshop.luxurySpcShopGoodsList")
mplanshop.luxurySpcShopGoodsList = {
    init : function(){

        common.loadPage.init("#oneTwo-list", "luxurySpcShopGoodsList");

        var startIdx = common.loadPage.getPageIdx();
        var savedHtml = common.loadPage.setSavedHtml();
        var subDispCatNo = "";
        var $mSubGnb = $("#mSubGnb"); // 서브카테고리

        if (!savedHtml) {
            subDispCatNo = $mSubGnb.data("ref-select-setno");
        }else{
            subDispCatNo = sessionStorage.getItem("setNo");
        }

        // 저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.
        var subIdx = 0;

        if(subDispCatNo != undefined
            && subDispCatNo != null
            && subDispCatNo !=""){

            $("#mSubGnb ul li").each(function(){

                if($(this).find("a").hasClass(subDispCatNo)){
                    subIdx = $(this).index();

                }
            });
            if(subIdx == undefined || subIdx == null || subIdx < 0){
                subIdx = 0;
            }
        }

        $("#mSubGnb ul li").removeClass("on");
        $("#mSubGnb ul li").eq(subIdx).addClass("on");


        $mSubGnb.find("ul li").each(function(){
            if($(this).hasClass("on")){
                $mSubGnb.data("ref-select-setno",$(this).find("a").attr("class"));
            }
        });

        common.showLoadingLayer(false);
        if (!savedHtml) {
            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
            mplanshop.luxurySpcShopGoodsList.getSpcPplrPagingAjax(0);
        }else{
            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
            mplanshop.luxurySpcShopGoodsList.getSpcPplrPagingAjax(startIdx);
        }

        //lazyload 처리
        common.setLazyLoad();

        //찜 처리 초기화
        common.wish.init();
        mplanshop.luxurySpcShopGoodsList.setSwipe(); /* [3272560]MC 프리미엄관 가로 스크롤 기능 확인 요청 */

        mplanshop.luxurySpcShopGoodsList.bindEvent(); // 이벤트
    },
    setSwipe : function() { /* [3272560]MC 프리미엄관 가로 스크롤 기능 확인 요청 */

        var initSlide = 0;

        if ($("#mSubGnb ul li.on").length > 0 ) {
            initSlide = $("#mSubGnb ul li.on").index();
        }

        var mSubGnb_swiper = new Swiper('#mSubGnb', {
            initialSlide: initSlide,
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
            });
        });
    },
    bindEvent : function() {

        var $mSubGnb = $("#mSubGnb"); // 서브카테고리

        $mSubGnb.find("ul li").click(function() { // 서브카테고리 클릭시 - 소카리스트
            // 서브카테고리 저장
            var setNo = $(this).find("a").attr("class");
            sessionStorage.setItem("setNo", setNo);

            /* 퍼블리싱 이벤트*/
            $(this).closest("li").addClass("on")
            .siblings().removeClass("on");

            /* 퍼블리싱 이벤트*/

            $mSubGnb.data("ref-select-setno",$(this).find("a").attr("class"));


            if( $(this).find("a").text() == "전체" ){ // 검색 카테고리가 전체면
                $("#ctgNoData").html("<p>" + $("#titConts h2.tit").text() + " 카테고리에 0 개의 상품이 등록되어 있습니다.</p>");
            }else{
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
            mplanshop.luxurySpcShopGoodsList.getSpcPplrPagingAjax(0);
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
            mplanshop.luxurySpcShopGoodsList.getSpcPplrPagingAjax(0);
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
    //전문관 하단 1단형 상품영역 페이징
    getSpcPplrPagingAjax : function(startIdx) {
        //연속키 방식
        PagingCaller.init({
            callback : function(){
                var param = {
                    dispCatNo : $("#dispCatNo").val(),
                    pageIdx    : PagingCaller.getNextPageIdx(),
                    setNo : $("#mSubGnb").data("ref-select-setno"),
                    prdSort      : $("#prdSort").val()
                };


                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "planshop/getLuxurySpcGoodsPagingAjax.do"
                        , param
                        , mplanshop.luxurySpcShopGoodsList.getSpcGoodsPagingAjaxCallback);

                common.loadPage.setPageIdx(param.pageIdx);
            }
            ,startPageIdx : startIdx
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : (startIdx > 0) ? false : true
        });
    },

    getSpcGoodsPagingAjaxCallback : function(res) {

        //최대 100개 온리원 상품 페이징 조회
        if (res.trim() == "" ) {
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
                //
                common.loadPage.bindEvent();
            }, 100);

        }
        //loadingLayer
        common.hideLoadingLayer();
    },
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

    }
};


$.namespace('mplanshop.specialBrands');
mplanshop.specialBrands = {
        _ajax : common.Ajax ,

    init: function() {
        common.loadPage.init("#oneTwo-list", "BrndLst");

        var startIdx = common.loadPage.getPageIdx();

        // 저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.
        if (!common.loadPage.setSavedHtml()) {
            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
            mplanshop.specialBrands.getBrandShopDetailGoodsPagingAjax(0);
        }else{
            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
            mplanshop.specialBrands.getBrandShopDetailGoodsPagingAjax(startIdx);
        }

        //찜 처리 초기화
        common.wish.init();

        common.setLazyLoad();

        mplanshop.specialBrands.bindEvent();

        mplanshop.specialBrands.setSwipe();

        $('.special-brands__product--header').stickUp();
    },
    setSwipe: function() {
        var heroSwiper = new Swiper('#hero-carousel', {
            preloadImages: true,
            lazyLoading: false,
            autoplay: 3000,
            loop: true,
            slidesPerView: 1,
            spaceBetween: 50,
            initialSlide: 0,
            watchSlidesVisibility: true,
            centeredSlides: true,
            pagination: '.special-brands__hero .swiper-pagination',
            paginationType: 'fraction',
            runCallbacks: true,
            nextButton: '.special-brands__hero .swiper-button-next',
            prevButton: '.special-brands__hero .swiper-button-prev',
            onInit: function() {
                var el = document.querySelector(
                    '.special-brands__hero .swiper-container'
                );
                el.className += ' initialized';
            },
            onAutoplayStart: function() {
                $('.special-brands__hero .swiper-slide-autoplay').addClass(
                    'hide'
                );
                $('.special-brands__hero .swiper-slide-pause').removeClass(
                    'hide'
                );
            },
            onAutoplayStop: function() {
                $('.special-brands__hero .swiper-slide-autoplay').removeClass(
                    'hide'
                );
                $('.special-brands__hero .swiper-slide-pause').addClass('hide');
            },
        });

        $('.special-brands__hero .swiper-slide-autoplay').on(
            'click',
            function() {
                heroSwiper.startAutoplay();
            }
        );

        $('.special-brands__hero .swiper-slide-pause').on('click', function() {
            heroSwiper.stopAutoplay();
        });

        var specialBrandsMDPickList = new Swiper(
            '#special-brands__md-pick--list',
            {
                slidesPerView: 2.25,
                spaceBetween: 30,
                scrollbar: '#special-brands__md-pick--list .swiper-scrollbar',
                scrollbarHide: false,
            }
        );

        var specialBrandProductListCategories = new Swiper(
            '.special-brands__product--categories .swiper-container',
            {
                loop: false,
                slidesPerView: 'auto',
                spaceBetween: 0,
                initialSlide: 0,
            }
        );
    },
    bindEvent: function() {
        $('a[href="#"]').on('click', function(e) {
            e.preventDefault();
        });

        function handleProductViewMode() {
            var sortButtons = $(
                '.special-brands__product--toolbar .listSel button'
            );

            sortButtons.bind('click', function(evt) {
                var currentButton = $(evt.currentTarget);
                var anotherButton = sortButtons.not(currentButton);
                var hasActive = currentButton.hasClass('active');
                var viewMode =
                    currentButton.attr('class').indexOf('btnOne') >= 0
                        ? 'single'
                        : 'grid';
                var productList = $('.special-brands__product--list > ul');

                if (!hasActive) {
                    currentButton.addClass('on');
                    anotherButton.removeClass('on');
                }

                if (viewMode === 'single') {
                    productList.attr('class', 'mlist1v-goods');
                } else {
                    productList.attr('class', 'mlist2v-goods');
                }
            });
        }

        handleProductViewMode();

        // 웹로그 바인딩
        setTimeout(function() {
            mplanshop.specialBrands.bindWebLog();
        }, 700);

        $(".sub_gnb_cate li a").bind("click", function() {

            $("#fltDispCatNo").val( $(this).attr("data-ref-dispCatNo") ) ;

            if( common.isEmpty( $(this).attr("data-ref-dispCatNo") )){ //전체 검색일때
                $("#fltDispCatNo").val( "" );
            }
            $(this).parent().addClass("active").siblings().removeClass("active");

            //페이징 콜러 제거
            PagingCaller.destroy();

            $("#oneTwo-list").empty();

            //loadingLayer
            common.showLoadingLayer(false);
            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
            mplanshop.specialBrands.getBrandShopDetailGoodsPagingAjax(0);

        });

        $("#prdSort").bind("change", function() {
            //페이징 콜러 제거
            PagingCaller.destroy();

            $("#oneTwo-list").empty();

            //loadingLayer
            common.showLoadingLayer(false);

            //최초에는 1페이지를 로딩한 상태이므로 2페이지부터 호출하도록함.
            mplanshop.specialBrands.getBrandShopDetailGoodsPagingAjax(0);
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

    bindWebLog: function() {
        $('.special-brands__hero .product > a').each(function() {
            $(this).bind('click', function() {
                var idx = $(this).data('item-index') + 1;
                var key = 'brd_m_main' + idx;
                common.wlog(key);
            });
        });

        $('.special-brands__md-pick .swiper-slide').each(function(index) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'brd_m_recgoods' + idx;
                common.wlog(key);
            });
        });
    },

    getBrandShopDetailGoodsPagingAjax : function (startIdx){ // 상품 검색

        //연속키 방식
        PagingCaller.init({
            callback : function(){
                //코드 완료 후 스토어 정보 조회
                var param = {
                        onlBrndCd    : $("#onlBrndCd").val() ,         // 브랜드 코드
                        pageIdx      : PagingCaller.getNextPageIdx() , // 페이징 인덱스
                        fltDispCatNo : $("#fltDispCatNo").val() ,      // 서브 카테고리
                        prdSort      : $("#prdSort").val()             // 정렬검색
                }
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "planshop/getBrandShopDetailGoodsPagingAjax.do"
                        , param
                        , mplanshop.specialBrands.getBrandShopDetailGoodsPagingAjaxCallback);

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

        var stickybitsInstancetoBeUpdated = stickybits('.special-brands__product--header');
        stickybitsInstancetoBeUpdated.update();

    },
};

$.namespace('mplanshop.petShop');
mplanshop.petShop = {
        loadPage : function (p_selector , p_pageNm , p_pass){

            return {
             selector : "",
             keySavedHtml : "",
             keySavedPagePos : "",
             keySavedPageIdx : "",
             keySavedClass : "",
             keySavedMoreBtnHidden : false,
             hashNm : "",
             pageNm : p_pageNm ,
             hasSaved : false,

             init : function() {

                 var hash = location.hash;

                 this.keySavedHtml = "saved_html_" +p_selector+"_"+p_pageNm ;
                 this.keySavedPagePos = "saved_page_pos_" +p_selector+"_"+p_pageNm;
                 this.keySavedPageIdx = "saved_page_idx_" +p_selector+"_"+p_pageNm;
                 this.keySavedClass = "saved_page_class_" +p_selector+"_"+p_pageNm;
                 this.keySavedMoreBtnHidden = "saved_page_more_btn_hidden_" +p_selector+"_"+p_pageNm;
                 this.hashNm = "#load_" + p_pageNm;

                 //해시 여부로 최초 진입여부 판단
                 if (hash == "") {
                     //페이지 최초 진입으로 판단되면 세션에 저장된 정보 제거함.
                     sessionStorage.removeItem(this.keySavedHtml);
                     sessionStorage.removeItem(this.keySavedPagePos);
                     sessionStorage.removeItem(this.keySavedPageIdx);
                     sessionStorage.removeItem(this.keySavedClass);
                     sessionStorage.removeItem(this.keySavedMoreBtnHidden);
                     if(!p_pass){
                       //해시 추가처리.
                         history.replaceState(null, null, this.hashNm);
                     }


                 }

                 this.selector = p_selector;
             },

             bindEvent : function() {
                 //링크에 페이지 정보 저장 바인드 처리
                 $(this.selector).find("a").unbind("click", this.setPagePos);
                 $(this.selector).find("a").bind("click",{orgObj: this} , this.setPagePos);
                 $(this.selector).find("button").unbind("click",this.setPagePos);
                 $(this.selector).find("button").bind("click",{orgObj: this} ,this.setPagePos);
             },

             setSavedHtml : function() {
                 var hash = location.hash;

                 if (hash == this.hashNm) {

                     //해시가 있을 경우 세션스토리지에서 페이지 정보 유무 조회
                     var savedHtml = sessionStorage.getItem(this.keySavedHtml);
                     var savedPagePos = sessionStorage.getItem(this.keySavedPagePos);
                     var savedClass = sessionStorage.getItem(this.keySavedClass);

                     if (!common.isEmpty(savedHtml) && !common.isEmpty(savedPagePos)) {
                         this.hasSaved = true;

                         $(this.selector).html(savedHtml);

                         if (!common.isEmpty(savedClass)) {
                             $(this.selector).attr("class", savedClass);
                         }

                         $(this.selector).find("img.completed-scroll-lazyload").addClass("scroll-lazyload").removeClass("completed-scroll-lazyload");
                         $(this.selector).find("img.completed-seq-lazyload").addClass("seq-lazyload").removeClass("completed-seq-lazyload");

                         //sessionStorage.removeItem(this.keySavedHtml);
                         //sessionStorage.removeItem(this.keySavedClass);
                         //sessionStorage.removeItem(this.keySavedPageIdx);
                         //this.moveScrollY();

                         return true;
                     } else {
                         //정상적인 정보가 아니므로 제거함.
                         sessionStorage.removeItem(this.keySavedHtml);
                         sessionStorage.removeItem(this.keySavedPagePos);
                         sessionStorage.removeItem(this.keySavedPageIdx);
                         sessionStorage.removeItem(this.keySavedClass);
                         sessionStorage.removeItem(this.keySavedMoreBtnHidden);

                     }
                 }

                 return false;
             },

             /**
              * 페이지 링크 시 현재 페이지 정보 저장 (history back 관련)
              * 모든 메인페이지 내의 링크에 대해 onclick event 를 bind함.
              */
             setPagePos : function (event) {

                 if(event === undefined){
                     orgObj = this;
                 }else{
                     orgObj = event.data.orgObj;
                 }



                 //사파리 private mode 예외처리용
                 try {
                     sessionStorage.setItem(orgObj.keySavedHtml, $(orgObj.selector).html());
                 } catch (e) {
                     console.log("fail saved info");
                 }

                 //사파리 private mode 예외처리용
                 try {
                     //현재 페이지의 scroll 처리를 위한 높이 정보 저장
                     sessionStorage.setItem(orgObj.keySavedPagePos, common.getNowScroll().Y);
                 } catch (e) {
                     console.log("fail saved info");
                 }

                 try {
                     sessionStorage.setItem(orgObj.keySavedClass, $(orgObj.selector).attr("class"));
                 } catch (e) {
                     console.log("fail saved info");
                 }

             },
             setMoreBtnHidden : function (isHidden){
                 try {
                     sessionStorage.setItem(this.keySavedMoreBtnHidden, isHidden);
                 } catch (e) {}
             },
             getMoreBtnHidden : function (){
                 try {
                     var isHidden = sessionStorage.getItem(this.keySavedMoreBtnHidden);

                     if (isHidden != undefined && isHidden != null && isHidden != "") {
                         return isHidden;
                     } else {
                         return false;
                     }
                     return
                 } catch (e) {
                     return false;
                 }
             },
             setPageIdx : function (pageIdx) {

                 //사파리 private mode 예외처리용
                 try {
                     sessionStorage.setItem(this.keySavedPageIdx, pageIdx);
                 } catch (e) {}
             },
             getPageIdx : function (pageIdx) {

                 //사파리 private mode 예외처리용
                 try {
                     var pageIdx = sessionStorage.getItem(this.keySavedPageIdx);

                     if (pageIdx != undefined && pageIdx != null && pageIdx != "") {
                         return parseInt(pageIdx);
                     } else {
                         return 1;
                     }
                     return
                 } catch (e) {
                     return 1;
                 }
             },
            /* moveScrollY : function() {
                 setTimeout(function() {
                     try{
                         var varNowScrollY = parseInt(sessionStorage.getItem(this.keySavedPagePos));

                         if((varNowScrollY > 0)){
                             $(window).scrollTop(varNowScrollY);
                             sessionStorage.removeItem(this.keySavedPagePos);
                         }
                     }catch(e){}
                 }, 900);
             },*/

        };
     },
     viewMode: '',
     viewStdDate: '',
     previewParam: '',
     loadPager : null,
     loadPager2 : null,
     goodsCntPage : 0,
     crtCntPage : 0,
     setPreviewParam: function(orgObj) {
        if (orgObj != undefined && orgObj != null) {
            if (mplanshop.petShop.viewMode.trim() != ''
                && mplanshop.petShop.viewStdDate.trim() != '') {
                var viewParam = {
                    viewMode: mplanshop.petShop.viewMode,
                    viewStdDate: mplanshop.petShop.viewStdDate,
                };

                orgObj = $.extend(orgObj, viewParam);
            }
        }
     },

    init: function(heroHeadings) {

        mplanshop.petShop.heroHeadings = heroHeadings;

        mplanshop.petShop.viewMode = $("#mContainer").attr("data-ref-viewMode");
        mplanshop.petShop.viewStdDate = $("#mContainer").attr("data-ref-viewStdDate");

        //페이지 로딩 처리 초기화
        //common.loadPage.init("#pet-shop__best-deals--list-data", "test");
        //common.loadPage.setSavedHtml();

        //common.loadPage.bindEvent();
        //저장된 html 이 있는 경우 저장된 html을 로딩, 아닌 경우 서버에서 신규 호출 처리함.



        mplanshop.petShop.loadPager =  mplanshop.petShop.loadPage("#pet-shop__best-deals--list-data","petShop",true);
        mplanshop.petShop.loadPager.init();
        mplanshop.petShop.loadPager2 =  mplanshop.petShop.loadPage("#pet-shop-past-contents-list","petShop",false);
        mplanshop.petShop.loadPager2.init();


        mplanshop.petShop.loadPager.setSavedHtml();
        mplanshop.petShop.goodsCntPage = mplanshop.petShop.loadPager.getPageIdx();

        if(mplanshop.petShop.goodsCntPage >=$(".pet-shop__best-deals .more-button").data("max-page")){
            $(".pet-shop__best-deals .more-button").hide();
        }

        mplanshop.petShop.loadPager2.setSavedHtml();

        mplanshop.petShop.crtCntPage = mplanshop.petShop.loadPager2.getPageIdx();

        if(mplanshop.petShop.loadPager2.getMoreBtnHidden()){
            $(".pet-shop-past-contents .more-button").hide();
        }

        common.setLazyLoad();

        common.bindGoodsListLink();

        mplanshop.petShop.setSwipe();

        $('.pet-shop__category-tabs li').click(function(evt) {

            evt.preventDefault();

            if ($(this).hasClass('active')) {
                return;
            }

            $(this)
                .addClass('active')
                .parents('.pet-shop__category-tabs')
                .find('li')
                .not($(this))
                .removeClass('active');

            $('.pet-shop__category-tabs').toggleClass('dog cat');

            var currentTabIndex = $(this).index();

            $('.category-list:eq(' + currentTabIndex + ')')
                .addClass('active')
                .parents('.category-list-container')
                .find('.category-list')
                .not($('.category-list:eq(' + currentTabIndex + ')'))
                .removeClass('active');
        });


       // $('.pet-shop__special-events-container .banner').click(function(e){
       //     event.preventDefault();
        //    common.link.movePlanShop($(this).attr("data-ref-dispCatNo"));
        //});

        $(".pet-shop__best-deals .more-button").click(function(){
            mplanshop.petShop.getPetSpcGoodsPagingAjax(mplanshop.petShop.goodsCntPage,$("#mContainer .tit").data("ref-dispcatno"));

        });


        $(".pet-shop-past-contents .more-button").click(function(){

            mplanshop.petShop.getCrtCntPagingAjax(mplanshop.petShop.crtCntPage,$("#mContainer .tit").data("ref-dispcatno"));

        });

        mplanshop.petShop.bindEvent();

    },
    setSwipe: function() {
        var heroSwiper = new Swiper('#mainFullSlider', {
            preloadImages: true,
            lazyLoading: false,
            autoplay: 3000,
            loop: true,
            slidesPerView: 'auto',
            spaceBetween: 0,
            initialSlide: 0,
            watchSlidesVisibility: true,
            centeredSlides: true,
            pagination: '.pet-shop-hero .swiper-pagination',
            nextButton: '.pet-shop-hero .swiper-button-next',
            prevButton: '.pet-shop-hero .swiper-button-prev',
            runCallbacks: true,
            coverflow: {
                rotate: 0,
                stretch: -100,
                depth: 300,
                modifier: 1,
                slideShadows: false,
            },
            onInit: function() {
                var el = document.querySelector(
                    '.pet-shop-hero .swiper-container'
                );
                el.className += ' initialized';
            },
            onAutoplayStart: function(e) {
                $('.pet-shop-hero .swiper-slide-autoplay').addClass('hide');
                $('.pet-shop-hero .swiper-slide-pause').removeClass('hide');
            },
            onAutoplayStop: function(e) {
                $('.pet-shop-hero .swiper-slide-autoplay').removeClass('hide');
                $('.pet-shop-hero .swiper-slide-pause').addClass('hide');
            },
            onSlideChangeStart: function(e) {
                var el = document.querySelector('.pet-shop-hero .hero-heading');
                el.innerHTML = mplanshop.petShop.heroHeadings[e.realIndex];
            },
        });

        $('.pet-shop-hero .swiper-slide-autoplay').on('click', function() {
            heroSwiper.startAutoplay();
        });

        $('.pet-shop-hero .swiper-slide-pause').on('click', function() {
            heroSwiper.stopAutoplay();
        });

        var petShopNewDealsList = new Swiper('#pet-shop__new-deals--list', {
            slidesPerView: 2.3,
            spaceBetween: 10,
            scrollbar: '#pet-shop__new-deals--list .swiper-scrollbar',
            scrollbarHide: false,
            slidesPerColumn: 2,
        });
    },
    getCrtCntPagingAjax : function (startIdx,dispCatNo) {

        mplanshop.petShop.crtCntPage  += 1;
        var param = {
                pageIdx : mplanshop.petShop.crtCntPage,
                dispCatNo : dispCatNo
        };

        common.Ajax.sendRequest(
                "GET"
                , _baseUrl + "planshop/getCrtCntPagingAjax.do"
                , param
                , mplanshop.petShop.getCrtCntPagingAjaxCallBack);

    },
    getCrtCntPagingAjaxCallBack : function (res) {
        if(res.trim() != ""){
            $(".pet-shop-past-contents #pet-shop-past-contents-list").append(res);

           if($(".pet-shop-past-contents #pet-shop-past-contents-list").find("div").length % 4 != 0){
               $(".pet-shop-past-contents .more-button").hide();
               mplanshop.petShop.loadPager2.setMoreBtnHidden(true);
           }

           mplanshop.petShop.loadPager2.setPagePos();
           mplanshop.petShop.loadPager2.bindEvent();
           mplanshop.petShop.loadPager2.setPageIdx(mplanshop.petShop.crtCntPage);
           mplanshop.petShop.hanldePetEpisodes();

        }else{
            $(".pet-shop-past-contents .more-button").hide();
            mplanshop.petShop.loadPager2.setMoreBtnHidden(true);
        }
    },
    getPetSpcGoodsPagingAjax : function(startIdx,dispCatNo) {

       mplanshop.petShop.goodsCntPage  += 1;

       var param = {
           pageIdx :  mplanshop.petShop.goodsCntPage,
           dispCatNo : dispCatNo
       };

       mplanshop.petShop.setPreviewParam(param);

       common.Ajax.sendRequest(
               "GET"
               , _baseUrl + "planshop/getPetSpcGoodsPagingAjax.do"
               , param
               , mplanshop.petShop.getPetSpcGoodsPagingAjaxCallBack);

    },
    getPetSpcGoodsPagingAjaxCallBack : function(res) {

        if(res.trim() != ""){

            $(".pet-shop__best-deals .mlist2v-goods").append(res);

            if(mplanshop.petShop.goodsCntPage >= $(".pet-shop__best-deals .more-button").data("max-page") ){
                $(".pet-shop__best-deals .more-button").hide();
            }

            common.setLazyLoad();

            common.bindGoodsListLink();

            mplanshop.petShop.hanldePetShopBestDeals();

            mplanshop.petShop.loadPager.setPageIdx(mplanshop.petShop.goodsCntPage);
            mplanshop.petShop.loadPager.bindEvent();

         }else{
             $(".pet-shop__best-deals .more-button").hide();
             try {
                 sessionStorage.setItem(orgObj.keySavedHtml, $(orgObj.selector).html());
             } catch (e) {

             }
         }
    } ,

    bindEvent: function() {
        $('a[href="#"]').on('click', function(e) {
            e.preventDefault();
        });

        // 웹로그 바인딩
        setTimeout(function() {
            mplanshop.petShop.bindWebLog();
        }, 700);
    },

    bindWebLog: function() {
        $('.pet-shop-hero .swiper-slide').each(function() {
            $(this).bind('click', function() {
                var idx = $(this).data('item-index') + 1;
                var key = 'pet_m_main' + idx;
                common.wlog(key);
            });
        });

        $('.pet-shop__category #dogs-category > li').each(function(index) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'pet_m_dog' + idx;
                common.wlog(key);
            });
        });

        $('.pet-shop__category #cats-category > li').each(function(index) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'pet_m_dog' + idx;
                common.wlog(key);
            });
        });

        $('.pet-shop__promotion-banners .banner > a').bind('click', function() {
            var key = 'pet_m_midbanner';
            common.wlog(key);
        });

        $('.pet-shop__new-deals .product-list > li').each(function() {
            $(this).bind('click', function() {
                var idx = $(this).data('item-index') + 1;
                var key = 'pet_m_newgoods' + idx;
                common.wlog(key);
            });
        });

        $('.pet-shop__special-events .banner').each(function(index) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'pet_m_event' + idx;
                common.wlog(key);
            });
        });

        mplanshop.petShop.hanldePetShopBestDeals();

        $('.pet-shop__hot-products .grid-col').each(function(setIndex) {
            var setPrefix = 'pet_m_set' + (setIndex + 1) + '_';
            $(this)
                .find('.banners a')
                .bind('click', function() {
                    var key = setPrefix + 'popevnt';
                    common.wlog(key);
                });

            $(this)
                .find('.hot-products .mlist2v-goods > li a')
                .each(function(prodIndex) {
                    $(this).bind('click', function() {
                        var key = setPrefix + 'evntgoods' + (prodIndex + 1);
                        common.wlog(key);
                    });
                });
        });

        mplanshop.petShop.hanldePetEpisodes();
    },

    hanldePetShopBestDeals: function() {
        $('.pet-shop__best-deals .goods > div > a').each(function(index) {
            $(this).bind('click', function(e) {
                e.preventDefault();
                var idx = index + 1;
                var key = 'pet_m_popgoods' + idx;
                common.wlog(key);
            });
        });
    },
    hanldePetEpisodes : function(){
        var latestEpisodes = $('.pet-shop__contents .episodes a');
        var pastEpisodes = $('.pet-shop-past-contents .grid-col a');

        latestEpisodes.each(function(index) {
            $(this).bind('click', function() {
                var idx = index + 1;
                var key = 'pet_m_content' + idx;
                common.wlog(key);
            });
        });

        pastEpisodes.each(function(index) {
            var latestEpLength = latestEpisodes.length;
            $(this).bind('click', function() {
                var idx = index + latestEpLength + 1;
                var key = 'pet_m_content' + idx;
                common.wlog(key);
            });
        });
    }
};

$(document).ready(function(){
    //2018.02.01 설맞이 행복가득 할인혜택
    // scroll class 변경
    var tabH = $(".treeTab").height();
    $("#eventTabFixed2").css("height",tabH + "px");

    var tabHeight =$("#eventTabImg").height() + 108 ;
    var eTab01 = tabHeight + $("#evtConT01").height();
    var eTab02 = eTab01 + $("#evtConT02").height();
    var eTab03 = eTab02 + $("#evtConT03").height();
    var eTab04 = eTab03 + $("#evtConT04").height();

    var scrollTab  = $(document).scrollTop();

    if (scrollTab > tabHeight) {
        $("#eventTabFixed2").css("position","fixed").css("top","0px");
    }
    if (scrollTab < eTab01) {
        $("#eventTabFixed2").attr('class','tab01');
    } else if (scrollTab < eTab02) {
        $("#eventTabFixed2").attr('class','tab02');
    } else if (scrollTab < eTab04) {
        $("#eventTabFixed2").attr('class','tab03');
    } else if (scrollTab > eTab04) {
        $("#eventTabFixed2").attr('class','tab04');
    };

    $(window).scroll(function(){
        var scrollTab  = $(document).scrollTop();
        if (scrollTab < eTab01) {
            $("#eventTabFixed2").attr('class','tab01');
        } else if (scrollTab < eTab02) {
            $("#eventTabFixed2").attr('class','tab02');
        } else if (scrollTab < eTab04) {
            $("#eventTabFixed2").attr('class','tab03');
        } else if (scrollTab > eTab04) {
            $("#eventTabFixed2").attr('class','tab04');
        }

        if (scrollTab > tabHeight) {
            $("#eventTabFixed2").css("position","fixed").css("top","0px");
        } else {
            $("#eventTabFixed2").css("position","absolute").css("top","");
        }
    });
});

// 기획전 이벤트
$.namespace("mplanshop.eventDetail")
mplanshop.eventDetail = {
    petImgSrc : _cdnImgUrl+"contents/201801/10lucky/",
    initSnsYn : false,
    snsConts : "",
    snsImg : "",
    sbscStampCnt : 0,
    sbscAbleStampCnt :0,
    sYear : "1998", // 수험생 이벤트 연령제한
    eYear : "2000", // 수험생 이벤트 연령제한
    appIng : false,
    layerPolice : false,
    firstYn : "N",
    zipcode : '',
    road_address : '',
    jibun_address : '',
    extra_address : '',
    selected_type : '',
    addrPop : '',
    themeObj : '',
    init : function(){
        /* //2017-09-11 추석이벤트 관련 초기화 (09.12 ~ 09.17) */
        // 레이어 닫기 (공통)
        $(".eventHideLayer").click(function(){
            mplanshop.eventDetail.eventHideLayer();
        });

        /* 위수탁  닫기 */
        $(".eventHideLayer1").click(function(){
            mplanshop.eventDetail.eventCloseLayer1();
        });

        /*********************************************
         * 개인정보 위수탁 닫기시 알럿 표시용
         *********************************************/
        $(".eventHideLayerX").click(function(){
            mplanshop.eventDetail.eventHideLayerX();
        });

        /*************************************************************************
         * 생일파티 탭3 쿠폰 등록 이후에도 이벤트 쿠폰등록 공통으로 사용 하기 위함
         *************************************************************************/
        $('#evtCpnRndmVal').prop('placeholder', '쿠폰번호를 입력해주세요.');

        /*********************************************
         * 새로고침시 레이어 팝업 닫기
         *********************************************/
        if( $('#reloadHideLayer').val() == 'Y' ){
            mplanshop.eventDetail.eventHideLayer();
        }

        if($('#evtToggleYn').val() == 'Y' ){
            //유의사항 토글
            $('.caution_btn').click(function() {
                $(this).toggleClass('on').next('.caution_con').slideToggle();
            });

            //로그인시 올영픽 응모여부 조회
            if(common.isLogin()){
                if(!common.isEmpty($('#evtToggleYn').val()) && !common.isEmpty($('#evtNo').val())){
                    mplanshop.eventDetail.getApplyGiftYn();
                }
            }

            $('.btn_gift').click(function() {
                if($(this).hasClass('on')){
                    mplanshop.eventDetail.applyGiftCard();
                }
            });
        }

        //직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
        $('#eventDimLayer, #eventLayerPolice .eventHideLayer1, #eventLayerPolice .eventHideLayer').click(function(){
        	if($("input[id='evtHlCgYn']:hidden").val() != 'Y'){
                if(mplanshop.eventDetail.layerPolice){
                    alert('동의 후 참여 가능합니다.');

                    mplanshop.eventDetail.layerPolice = false;
                    mplanshop.eventDetail.eventHideLayer();

                    //초기화
                    $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                    $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
                }
        	}
        });

        //핫하쥐
        if($("input[id='evtHotYn']:hidden").val() == 'Y'){
            var dt = new Date();
            var m_dt = (dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');

            var param = "viewStdDate=";
            var url = "" + self.document.location.search;
            var turl = "";
            eval("try{ turl=top.document.location.search; }catch(_e){}");
            url = url + "&" + turl;
            if ( url.indexOf(param) != -1) {
                var x = url.indexOf(param) + param.length;
                var y = url.substr(x).indexOf("&");
                m_dt = url.substring(x, x+y).substring(4);
            }

            var baseImgPath = _cdnImgUrl + "contents/202001/06hotG/";
            if(m_dt >= '0106' && m_dt <= '0112'){
                $('#evtTrendG .imgBox img').attr("src", baseImgPath + 'mc_cnt02_' + m_dt + '.jpg');
                $(".moveSection1").attr("href","#"+$("#evtSection_"+m_dt).val());
                $('.moveLink4').click(function(){
                    common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo='+ $('#evtGoodsNo1_'+m_dt).val() );
                });

                $('.moveLink5').click(function(){
                    common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo='+ $('#evtGoodsNo2_'+m_dt).val() );
                });
            }
        }

        //열광대전
        if($("input[id='evtTenYn']:hidden").val() == 'Y'){
            var dt = new Date();
            var m_dt = (dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');

            var param = "viewStdDate=";
            var url = "" + self.document.location.search;
            var turl = "";
            eval("try{ turl=top.document.location.search; }catch(_e){}");
            url = url + "&" + turl;
            if ( url.indexOf(param) != -1) {
                var x = url.indexOf(param) + param.length;
                var y = url.substr(x).indexOf("&");
                m_dt = url.substring(x, x+y).substring(4);
            }

            var baseImgPath = _cdnImgUrl + "contents/202002/10tenday/";
            if(m_dt == "0210" || m_dt == "0211" || m_dt == "0216"){
                $('.evtCon03 .imgBox img').attr("src", baseImgPath + 'mc_cnt03_' + m_dt + '.jpg');
            }

            if(m_dt >= "0210"  && m_dt <= "0216"){
                $('.evtCon04 .imgBox img').attr("src", baseImgPath + 'mc_cnt04_deal' + m_dt + '.jpg');
            }

            //오늘 남은시간 보여주기
            mplanshop.eventDetail.setTimer();

            //로그인시 응모여부 조회
            if(common.isLogin()){
                mplanshop.eventDetail.getBrandApplyYn();
            }

            //응모하기
            $('.btnGift').click(function() {
                if($(this).hasClass("on")){
                    mplanshop.eventDetail.getBrandAmt();
                }
            });

            $('.moveLink11').click(function(){
                common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo='+ $('#evtGoodsNo1_'+m_dt).val() );
            });

            $('.moveLink12').click(function(){
                common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo='+ $('#evtGoodsNo2_'+m_dt).val() );
            });
        }

        if($("input[id='evtTodayFirst_lastBanner']:hidden").val() == 'Y'){
            var dt = new Date();
            var m_dt = (dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');
            //오늘드림 4월 첫만남 하단 배너 노출
            if(m_dt >= '0416' && m_dt <= '0430'){
                $('.usemapDiv .evtBan:eq(1)').show();
            }
        }

        //오늘드림 가능 지역 조회
        if($('#evtSearchTodayArea').length == 1){
        	$('.contEditor').append($('<script/>', {'src':'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'}));
            $('.contEditor').append(
                $('<div/>', {'id':'postLayer', 'style':'display:none; -webkit-overflow-scrolling:touch; overflow:hidden; position:fixed; z-index:99999;'}).append(
                    $('<div/>', {'class':'btnCloseWrap'}).append($('<img/>', {'id':'btnCloseLayer', 'alt':'닫기버튼', 'src':'//t1.daumcdn.net/postcode/resource/images/close.png', 'style':'width:100%;'}))
                )
            );

            mplanshop.eventDetail.addrPop = document.getElementById('postLayer');
            mplanshop.eventDetail.themeObj = { // 다음 API 색상 설정
                    bgColor: "#FFFFFF", //바탕 배경색
                    postcodeTextColor: "#9BCE26", //우편번호 글자색
                    emphTextColor: "#333333" //강조 글자색
            };
            var eventSlide_set = {
                            slidesPerView: 1,
                            initialSlide : 0,
                            autoplay: 4000,
                            pagination: '.paging',
                            nextButton: '.next',
                            prevButton: '.prev',
                            autoplayDisableOnInteraction: true,
                            paginationClickable: true,
                            freeMode: false,
                            spaceBetween: 0,
                            loop: true
                    }, visual_swiper = Swiper('.slideType1', eventSlide_set );
            $(".btnSearch_area").unbind("click").click(function(event){
            	//주소검색 이벤트인경우
            	if($('#todayAdressSeachYn').val() == "Y"){
            		if(!mplanshop.eventDetail.checkLoginEvt()){
                        return;
                    }
            	}
            	event.preventDefault();
            	if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
            		mplanshop.eventDetail.initDaumMapApp();
            	}else{
            		mplanshop.eventDetail.initDaumMap();
            	}
            });
            $(".btn_adressAdd1").unbind("click").click(function(event){// 오늘드림 주문 가능지역 - 배송지 등록버튼
            	event.preventDefault();
            	$(".eventLayer").hide();
            	$("#eventDimLayer").hide();

            	if(!mplanshop.eventDetail.checkLoginEvt()){
            		return;
            	}

            	var url = _baseUrl + "event/getDeliveryRegistFormAjax.do";
            	// 조회한 주소정보를 저장한다
            	var data = {
            			zipcode : mplanshop.eventDetail.zipcode
            			, road_address : mplanshop.eventDetail.road_address
            			, jibun_address : mplanshop.eventDetail.jibun_address
            			, extra_address : mplanshop.eventDetail.extra_address
            			, selected_type : mplanshop.eventDetail.selected_type
            			};
            	common.Ajax.sendRequest("POST", url, data, common.zipcodequick.pop._callBackDeliveryRegistForm);
            });
            $(".btn_adressAdd2").unbind("click").click(function(event){// 오늘드림 주문 불가지역 - 다시검색버튼
            	event.preventDefault();
            	$(".eventLayer").hide();
            	$("#eventDimLayer").hide();
            	if (common.app.appInfo != undefined && common.app.appInfo.isapp) {
            		mplanshop.eventDetail.initDaumMapApp();
            	}else{
            		mplanshop.eventDetail.initDaumMap();
            	}
            });
            $("#postLayer #btnCloseLayer").unbind("click").click(function(event){// 검색창 닫기
            	event.preventDefault();
            	// iframe을 넣은 element를 안보이게 한다.
            	mplanshop.eventDetail.addrPop.style.display = 'none';
            	$('#eventDimLayer').hide();
            });
        }

        //앱뿐특가라인업
        if($("input[id='evtAppFe3Yn']:hidden").val() == 'Y'){
        	var dt = new Date();
        	var m_dt = (dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');

        	var param = "viewStdDate=";
        	var url = "" + self.document.location.search;
        	var turl = "";
        	eval("try{ turl=top.document.location.search; }catch(_e){}");
        	url = url + "&" + turl;
        	if ( url.indexOf(param) != -1) {
        	  var x = url.indexOf(param) + param.length;
        	  var y = url.substr(x).indexOf("&");
        	  m_dt = url.substring(x, x+y);
        	}

        	//이벤트 2차
    		if(m_dt >= $("input[id='strtDtime2']:hidden").val() && m_dt <= $("input[id='endDtime2']:hidden").val()){
    			//상단비주얼
    			$(".mc_visual1").addClass("off");
    			$(".mc_visual2").removeClass("off");

    			//탭영역
    			$(".mc_menu1").addClass("off");
    			$(".mc_menu2").removeClass("off");

    			//쿠폰영역
    			$(".cpn_area1").addClass("off");
    			$(".cpn_area2").removeClass("off");

    			//쿠폰다운
    			$(".cpn_area2 .btn_coupon3").attr("onclick", "mplanshop.eventDetail.downAppCouponEventJson('"+$("#cpnNo2").val()+"');");

    			$(".tabContainer1").addClass("off");
    			$(".tabContainer2").removeClass("off");

    			$(".imgBox1").addClass("off");
    			$(".imgBox2").removeClass("off");
    		}else{
    			//이벤트 1차
            	//쿠폰다운
    			$(".cpn_area1 .btn_coupon3").attr("onclick", "mplanshop.eventDetail.downAppCouponEventJson('"+$("#cpnNo1").val()+"');");
    		}

    		//탭영역
        	$(function() {
        		$('.tab_list>ul>li').click(function() {
        			var activeTab = $(this).attr('data-tab'),
        				tab_index = 'tab'+$(this).index(),
        				tab_list = $(".tab_list"),
        				tabCont = $('.tabCont');
        			tab_list.removeClass('tab0 tab1 tab2').addClass(tab_index);
        			tabCont.removeClass('on');
        			$('.tabCont.' + activeTab).addClass('on');
        		})
        	});
        }

        //파운데이션
        if($("input[id='foundaytionYn']:hidden").val() == 'Y'){
        	var dt = new Date();
        	var m_dt = dt.getFullYear()+(dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');

        	var param = "viewStdDate=";
        	var url = "" + self.document.location.search;
        	var turl = "";
        	eval("try{ turl=top.document.location.search; }catch(_e){}");
        	url = url + "&" + turl;
        	if ( url.indexOf(param) != -1) {
        		var x = url.indexOf(param) + param.length;
        		var y = url.substr(x).indexOf("&");
        		m_dt = url.substring(x, x+y);
        	}

        	$(document).ready(function(e) {
        		//파운데이션 큐레이팅 슬라이드 3/30
        		var swiper = new Swiper('.leaflet-swiper-container', {
	      			slidesPerView: 1,
	      			initialSlide: 0,
	      			autoplay: 2500,
	      			pagination: '.paging',
	      			nextButton: '.next',
	      			prevButton: '.prev',
	      			autoplayDisableOnInteraction: true,
	      			paginationClickable: true,
	      			freeMode: false,
	      			spaceBetween: 0,
	      			loop: true,
	      			pagination: '.swiper-pagination',
	      			navigation: {
	      			  nextEl: '.swiper-button.next',
	      			  prevEl: '.swiper-button.prev',
	      			}
      		  	});
      		});

        	$('#evtStoreCd').prop('placeholder', '매장명/매장코드 입력');
        	var baseImgPath = _cdnImgUrl + "contents/202004/16foundaytion/";
        	//이벤트 2차
    		if(m_dt >= $("input[id='strtDtime2']:hidden").val() && m_dt <= $("input[id='endDtime2']:hidden").val()){
    			$(".oyEvent_wrap").addClass("evt0425");
    			$(".btn_choiceItem").removeClass().addClass("btn_choiceItem2");
    			$(".btn_applyKit").removeClass("on");
    			$(".evtCon05 .imgBox img").attr("src", baseImgPath + 'mc_cnt05_0425.jpg');
    			$(".evtCon03").addClass("itemKitEnd");
    		}

    		//키트 신청 기간 선착순 응모 마감 표시
 	       	if(m_dt >= $("input[id='strtDtime1']:hidden").val() && m_dt <= $("input[id='endDtime1']:hidden").val()){
 	       		mplanshop.eventDetail.getKitInfo();
 	       	}

 	       	//키트 응모종료 후 수령 기간 04/25~05/03
 	       	if(m_dt > $("input[id='endDtime1']:hidden").val() && m_dt < $("input[id='strtDtime4']:hidden").val()){
 	       		$(".itemKit1").addClass("on");
 	       	}

    		//체험키트 수령 행사 ~완료까지 05/04~05/31
    		if(m_dt >= $("input[id='strtDtime4']:hidden").val() && m_dt <= $("input[id='endDtime2']:hidden").val()){
    			//로그인시 키트수령여부 조회
    			if(common.isLogin()){
    				if(m_dt <= $("input[id='endDtime4']:hidden").val()){	//수령기간
    					mplanshop.eventDetail.getKitApplyYn("on");
    				}

    				if(m_dt > $("input[id='endDtime4']:hidden").val()){	//수령기간 이후
    					mplanshop.eventDetail.getKitApplyYn("end");
    				}
    			}else{	//미로그인시에는 응모행사종료
    				if(m_dt >= $("input[id='strtDtime4']:hidden").val() && m_dt <= $("input[id='endDtime4']:hidden").val()){	//수령기간
    					$(".itemKit1").addClass("on");
    				}else{
    					$(".itemKit1").addClass("end");
    				}
    			}
    		}

    		//인스타그램 행사기간전 랜딩 없음
    		if(m_dt < $("input[id='strtDtime3']:hidden").val()){
    			$(".moveInsta1").removeClass("on");
    			$(".moveInsta1").attr("href","#n");
    		}

    		//인스타그램 행사종료표시
    		if(m_dt > $("input[id='endDtime3']:hidden").val()){
    			$(".evtCon04").addClass("instaEvtEnd");
    		}

    		//오늘의 파데 추천받기
    		$('.btn_todayItem').click(function() {
    			var step = $(':radio[name="radioStep"]:checked').val();
    			var step1 = $(':radio[name="radioStep1"]:checked').val();
    			var step2 =  $(':radio[name="radioStep2"]:checked').val();
    	        var step3 =  $(':radio[name="radioStep3"]:checked').val();

    	        if(step == undefined || step1 == undefined || step2 == undefined || step3 == undefined){
    	        	alert("질문별로 1개씩 필수 선택해야합니다.");
    	        	return;
    	        }

    	        var resultVal = "";
    	        //결과 노출
    	        if((step2 == "1" && step3 == "5") || (step2 == "3" && step3 == "6")){
    	        	resultVal = "01";
    	        }else if((step2 == "1" && step3 == "7") || (step2 == "2" && step3 == "6")){
    	        	resultVal = "02";
    	        }else if((step2 == "1" && step3 == "8") || (step2 == "4" && step3 == "6")){
    	        	resultVal = "03";
    	        }else if((step2 == "3" && step3 == "7") || (step2 == "2" && step3 == "5")){
    	        	resultVal = "04";
    	        }else if((step2 == "2" && step3 == "8") || (step2 == "4" && step3 == "7")){
    	        	resultVal = "05";
    	        }else if((step2 == "3" && step3 == "8") || (step2 == "4" && step3 == "5")){
    	        	resultVal = "06";
    	        }else if((step2 == "1" && step3 == "6")){
    	        	resultVal = "07";
    	        }else if((step2 == "2" && step3 == "7")){
    	        	resultVal = "08";
    	        }else if((step2 == "3" && step3 == "5")){
    	        	resultVal = "09";
    	        }else if((step2 == "4" && step3 == "8")){
    	        	resultVal = "10";
    	        }

    	        $("#popMyBrand .conts_inner img").attr("src", baseImgPath + 'pop_Brand'+resultVal+'.png');
    	        $("input[id='noteCont']:hidden").val(resultVal);
    	        mplanshop.eventDetail.eventHideLayer();
    			mplanshop.eventDetail.eventShowLayScroll('popMyBrand');
    		});

    		//키트 신청하기
    		$('.btn_applyKit').click(function() {
    			if($(this).hasClass("on")){
    				/*if($("input[id='noteCont']:hidden").val() == ""){
    					alert($("input[id='kitMessage2']:hidden").val());
    				}else{
    					mplanshop.eventDetail.applyKit();
    				}*/
    				mplanshop.eventDetail.applyKit();
    			}
    		});

    		//키트 신청 or 수령하기
    		$('.itemKit1').click(function() {
    			if($(this).hasClass("on")){	//수령하기
    				if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
						if(confirm("모바일 앱에서만 신청 가능합니다.")){
							common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
						}else{
							return;
						}
					}else{
						if(!mplanshop.eventDetail.checkLogin()){
							return;
						}else{
							if(common.isLogin()){
		    					//키트 응모종료 후 수령 기간  전
		        				if(m_dt > $("input[id='endDtime1']:hidden").val() && m_dt < $("input[id='strtDtime4']:hidden").val()){
		        					mplanshop.eventDetail.kitApplyCheck();
		        				}else if(m_dt >= $("input[id='strtDtime4']:hidden").val() && m_dt <= $("input[id='endDtime4']:hidden").val()){	//수령기간
		        					mplanshop.eventDetail.eventShowLayScroll('storePop1');
		        				}
		    				}else{
		    					alert($("input[id='kitMessage3']:hidden").val());
		    				}
						}
					}
    			}else{
    				//체험키트 응모 기간
    				if(m_dt >= $("input[id='strtDtime1']:hidden").val() && m_dt <= $("input[id='endDtime1']:hidden").val()){
    					if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
							if(confirm("모바일 앱에서만 신청 가능합니다.")){
								common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
							}else{
								return;
							}
						}else{
							if(!mplanshop.eventDetail.checkLogin()){
								return;
							}else{
								if($(this).hasClass("kitSoldOut")){	//선착순 응모마감이면 이미 신청한 경우 알려주기
									mplanshop.eventDetail.endApplyCheck();
		        				}else{	//선착순응모마감이 아니면 신청하기
		        					mplanshop.eventDetail.applyKit();
		        				}
							}
						}
    				}
    			}
    		});

    		//직원확인
    		$('.btn_confirm').click(function() {
    			if($.trim($("#evtStoreCd").val()) == ""){
    				alert("정확한 매장코드 또는 매장명을 띄어쓰기 없이 입력해주세요.");
    			}else{
    				if(confirm("직원 확인 후에는 이전으로 돌아갈 수 없습니다.")){
    					mplanshop.eventDetail.receiveKit();
    				}
    			}
    		});

    		//오늘파데 추천받기
    		$('.popCheck1').click(function() {
    			$("input[id='noteCont']:hidden").val("");
    			$(':radio[name^="radioStep"]:checked').prop("checked",false);
    			mplanshop.eventDetail.eventShowLayScroll('popCheckList');
    			$("#popCheckList .conts_inner")[0].scrollTop = 0;
    		});

    		//오늘파데 추천받기
    		$('.moveScroll2').click(function() {
    			$("input[id='noteCont']:hidden").val("");
    			$(':radio[name^="radioStep"]:checked').prop("checked",false);
    			mplanshop.eventDetail.eventShowLayScroll('popCheckList');
    			$("#popCheckList .conts_inner")[0].scrollTop = 0;
    		});

    		//다시선택하기
    		$('.btn_choiceItem').click(function() {
    			mplanshop.eventDetail.eventHideLayer();
    			$("input[id='noteCont']:hidden").val("");
    			$(':radio[name^="radioStep"]:checked').prop("checked",false);
    			mplanshop.eventDetail.eventShowLayScroll('popCheckList');
    			$("#popCheckList .conts_inner")[0].scrollTop = 0;
    		});

    		//다시선택하기(응모종료후)
    		$('.btn_choiceItem2').click(function() {
    			mplanshop.eventDetail.eventHideLayer();
    			$("input[id='noteCont']:hidden").val("");
    			$(':radio[name^="radioStep"]:checked').prop("checked",false);
    			mplanshop.eventDetail.eventShowLayScroll('popCheckList');
    			$("#popCheckList .conts_inner")[0].scrollTop = 0;
    		});

    		//포토리뷰 응모하기
    		$('.eventGift1').click(function() {
    			mplanshop.eventDetail.getReviewApplyYn();
    		});

    		//포토리뷰 응모하기
    		$('.btn_choiceItem3').click(function() {
    			var radioValue = $(':radio[name="radioValue"]:checked').val();
    			if(radioValue == undefined){
    				alert("경품으로 받고 싶은 파운데이션의 색상을 선택해주세요!");
    				return;
    			}

    			mplanshop.eventDetail.eventHideLayer();
    			$("div#Confirmlayer1").attr("onclick", "mplanshop.eventDetail.reviewApply();");
                mplanshop.eventDetail.layerPolice = true;
                $(".agreeCont")[0].scrollTop = 0;
    			mplanshop.eventDetail.eventShowLayScroll('eventLayerPolice');
    		});

    		//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
            $('#eventDimLayer, #eventLayerPolice .eventHideLayer1, #eventLayerPolice .eventHideLayer').click(function(){
                if(mplanshop.eventDetail.layerPolice){
                    alert('동의 후 참여 가능합니다.');

                    mplanshop.eventDetail.layerPolice = false;
                    mplanshop.eventDetail.eventHideLayer();

                    //초기화
                    $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                    $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
                }
            });
        }

        //4월 프리미엄 1차
        if($("input[id='newPremiumYn_20']:hidden").val() == 'Y'){
            $('#mContents .contEditor').append($('<script/>', {'src': _cdnImgUrl + 'contents/slide/swiper.min.js'}));

            setTimeout(function(){
                var galleryTop = new Swiper('.gallery-top', {
                    autoplay: {
                      delay: 3000,
                      disableOnInteraction: true,
                    },
                    pagination: {
                      el: '.swiper-pagination',
                      clickable: true,
                    },
                    loop: true,
                  });
            }, 300);
        }

        //썬케어
        if($("input[id='suncareEvtYn']:hidden").val() == 'Y'){
        	var baseImgPath = _cdnImgUrl + "contents/202005/01sunCare/";
        	$("[id^='radioStep']").click(function() {
    			common.wlog("event_tryget_click_"+$(this).val());
    		});

        	//1단계에서 다음단계
        	$('.nextStep1').click(function() {
        		common.wlog("event_tryget_click_17");
        		var checkVal =  $(':radio[name="radioStep1"]:checked').val();
    	        if(checkVal == undefined){
    	        	alert("위 선택지 중 한가지를 선택해 주세요!");
    	        	return;
    	        }

    	        $(".step1").removeClass("on");
    	        $(".step"+(Number(checkVal)+1)).addClass("on");
        	});

        	//안전한성분 >  순한 선크림
        	$(".step2 .nextStep2").click(function() {
        		var checkVal =  $(':radio[name="radioStep2_1"]:checked').val();
    	        if(checkVal == undefined){
    	        	alert("위 선택지 중 한가지를 선택해 주세요!");
    	        	return;
    	        }
        		common.wlog("event_tryget_click_18");
        		$(".step2").removeClass("on");
        		$(".resultArea").addClass("on");
        		$(".resultProduct img").attr("src", baseImgPath + 'mc_result01_'+Number(checkVal-4)+'.png');
        		$(".viewProd1").attr("onClick", "mplanshop.eventDetail.suncareMoveGoodsLog('"+checkVal+"')");
        	});

        	//좋은발림성 > 내가원하는 발림성
        	$(".step3 .nextStep2").click(function() {
        		var checkVal =  $(':radio[name="radioStep2_2"]:checked').val();
    	        if(checkVal == undefined){
    	        	alert("위 선택지 중 한가지를 선택해 주세요!");
    	        	return;
    	        }
    	        common.wlog("event_tryget_click_20");
    	        $(".step3").removeClass("on");
        		$(".resultArea").addClass("on");
    	        $(".resultProduct img").attr("src", baseImgPath + 'mc_result02_'+Number(checkVal-10)+'.png');
    	        $(".viewProd1").attr("onClick", "mplanshop.eventDetail.suncareMoveGoodsLog('"+checkVal+"')");
        	});

        	//하나로 OK > 톤업
        	$(".step4 .nextStep2").click(function() {
        		var checkVal =  $(':radio[name="radioStep2_3"]:checked').val();
    	        if(checkVal == undefined){
    	        	alert("위 선택지 중 한가지를 선택해 주세요!");
    	        	return;
    	        }
    	        common.wlog("event_tryget_click_19");
    	        $(".step4").removeClass("on");
        		$(".resultArea").addClass("on");
    	        $(".resultProduct img").attr("src", baseImgPath + 'mc_result03_'+Number(checkVal-7)+'.png');
    	        $(".viewProd1").attr("onClick", "mplanshop.eventDetail.suncareMoveGoodsLog('"+checkVal+"')");
        	});

        	//온가족사용템 > 원하는체형
        	$(".step5 .nextStep2").click(function() {
        		var checkVal =  $(':radio[name="radioStep2_4"]:checked').val();
    	        if(checkVal == undefined){
    	        	alert("위 선택지 중 한가지를 선택해 주세요!");
    	        	return;
    	        }
    	        common.wlog("event_tryget_click_21");
    	        $(".step5").removeClass("on");
        		$(".resultArea").addClass("on");
    	        $(".resultProduct img").attr("src", baseImgPath + 'mc_result04_'+Number(checkVal-13)+'.png');
    	        $(".viewProd1").attr("onClick", "mplanshop.eventDetail.suncareMoveGoodsLog('"+checkVal+"')");
        	});

        	//처음으로돌아가기
        	$(".returnStep1").click(function() {
        		$(".step3").removeClass("on");
        		$(".step4").removeClass("on");
        		$(".step5").removeClass("on");
        		$(".resultArea").removeClass("on");
        		$(".viewProd1").attr("onClick","");
        		$(':radio[name^="radioStep"]:checked').prop("checked",false);
        		$(".step1").addClass("on");
        	});

        	setTimeout(function () {
        		$(".returnStep1").trigger('click');
        	}, 300);
        }

        //5월 올라잇 위크
        if($("input[id='allRightYn']:hidden").val() == 'Y'){
        	var baseImgPath = _cdnImgUrl + "contents/202005/11allRight/";

        	var dt = new Date();
        	var m_dt = (dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');

        	var param = "viewStdDate=";
        	var url = "" + self.document.location.search;
        	var turl = "";
        	eval("try{ turl=top.document.location.search; }catch(_e){}");
        	url = url + "&" + turl;
        	if ( url.indexOf(param) != -1) {
        		var x = url.indexOf(param) + param.length;
        		var y = url.substr(x).indexOf("&");
        		m_dt = url.substring(x, x+y).substring(4);
        	}

        	//탭1 오특
        	if($('.tHour').length == 1 && m_dt >= '0511' && m_dt <= '0517'){
                if(m_dt == '0517'){
                	$('.oyEvent_wrap').addClass('evtLastDay');
                }
                $('#evtSpecial .imgBox img').attr('src', baseImgPath + 'mc_cnt02_' + m_dt + '.jpg');
            	//오늘 남은시간 보여주기
                mplanshop.eventDetail.setTimer();

                $('.todayLink1').on('click', function(){
                	var todayGoodsNo = $('#todayGoodsNo1_'+m_dt).val();
                	common.link.commonMoveUrl("goods/getGoodsDetail.do?goodsNo="+todayGoodsNo);
                });
                $('.todayLink2').on('click', function(){
                	var todayGoodsNo = $('#todayGoodsNo2_'+m_dt).val();
                	common.link.commonMoveUrl("goods/getGoodsDetail.do?goodsNo="+todayGoodsNo);
                });
        	}

        	//탭3 뷰티HOT 키워드
        	if($('#ranTab').length == 1){
        	    var _rNum = Math.floor(Math.random() * 3),
        	        _rNum2 = Math.floor(Math.random() * 3),
        	        _ranTab = $('#ranTab'),
        	        _num_ck = $('.num_ck');
        	    $('.evtab_list>li>a').on('click', function(e){
        	        e.preventDefault();
        	        var _this = $(this),
        	            _thisHref = _this.attr('href'),
        	            _thisIndex = _this.parent('li').index(),
        	            _thisParId = _this.parents('.evtab_list').attr('id'),
        	            _tab_contents = _this.parents('.evtab_list').siblings('.tab_contents'),
        	            _tab_con = _tab_contents.find('.tab_con');

        	        _this.parents('.evtab_list').find('li').each(function(index){
        	            $(this).find('img').attr('src', $(this).find('img').attr('src').replace('_on','_off'));
        	        });
        	        _this.find('img').attr('src', _this.find('img').attr('src').replace('_off','_on'));

        	        _tab_con.removeClass('on');
        	        $(_thisHref).addClass('on');
        	        if(_thisParId == 'ranTab'){_num_ck.html(_thisIndex+1);}
        	    });
        	    $('.btn_refresh>.button').on('click', function(){
        	        var _num_ck = $('.num_ck').html();
        	        if(_num_ck>=3){_num_ck=0}
        	        $('#ranTab.list2>li>a').eq(_num_ck).trigger('click');
        	    });
        	    setTimeout(function(){
        	        $('.bgSlide>.evtab_list>li>a').eq(_rNum).trigger('click');
        	        $('#ranTab.list2>li>a').eq(_rNum2).trigger('click');
        	        _num_ck.html(_rNum2+1);
        	    }, 200);
        	    var itemSlide1 = new Swiper('.itemSlide1', {
        	        slidesPerView: 1.5,
        	        observer: true,
        	        observeParents: true,
        	       // scrollbar: '.swiper-scrollbar',
        	      // scrollbarHide: false,
        	        scrollbarHide: true,
        	        freeMode:true,
        	        freeModeMomentumRatio: 0.5,
        	        freeModeMomentumVelocityRatio: 0.5
        	    });
        	}
        }

        //5월 프리미엄의 품격  스크립트
        if($("input[id='premiumSrcYn']:hidden").val() == 'Y'){
        	var galleryTop = new Swiper('.gallery-top', {
    	          autoplay: 3000,
    	          autoplayDisableOnInteraction: true,
    	          pagination: '.swiper-pagination',
    	          nextButton: '.next',
    	    	  prevButton: '.prev',
    	          paginationClickable: true,
    	          loop: true,
    	          onInit: function(swiper){

    	          },
    	          onSlideChangeStart: function(swiper){
    	              var activeIdx = swiper.activeIndex;
    	              if(activeIdx == 10) activeIdx = 1;
    	              if(activeIdx == 0) activeIdx = 9;
    	              $(".slide-bar").animate({
    	      	        "width": (100 / 9) * activeIdx + "%"
    	      	     },300);
    	          }
        	});
        }

        //5월 프리미엄의 품격
        if($("input[id='premiumYn']:hidden").val() == 'Y'){
            $('.tab_nav a').on('click',function(){
    			$('.tab_nav a').removeClass('on');
    			$(this).addClass('on');
    		});

        	//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
            $('#eventDimLayer, #eventLayerPolice .eventHideLayer1, #eventLayerPolice .eventHideLayer').click(function(){
                if(mplanshop.eventDetail.layerPolice){
                    alert('동의 후 참여 가능합니다.');

                    mplanshop.eventDetail.layerPolice = false;
                    mplanshop.eventDetail.eventHideLayer();

                    //초기화
                    $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                    $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
                }
            });

            //응모하기
            $(".apply01").click(function() {
            	mplanshop.eventDetail.checkPremiumApply();
            });
        }

        //5월 오늘드림 올영세일
        if($("input[id='todayCoupon200529']:hidden").val() == 'Y'){
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                   ,cpnNo1 : $("input[id='cpnNo1']:hidden").val()
                   ,cpnNo2 : $("input[id='cpnNo2']:hidden").val()
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20200529_3/getLimitDd1DownPsbCpn.do"
                  , param
                  , mplanshop.eventDetail._callback_getLimitDd1DownPsbCpn
            );

            var dt = new Date();
            var m_dt = (dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');

            var param = "viewStdDate=";
            var url = "" + self.document.location.search;
            var turl = "";
            eval("try{ turl=top.document.location.search; }catch(_e){}");
            url = url + "&" + turl;
            if ( url.indexOf(param) != -1) {
                var x = url.indexOf(param) + param.length;
                var y = url.substr(x).indexOf("&");
                m_dt = url.substring(x, x+y).substring(4);
            }

            //증정품
            if(m_dt == '0529'){
                $('.oyEvent_wrap').addClass('evtOySale0529');
            }else if(m_dt == '0530' || m_dt == '0531'){
                $('.oyEvent_wrap').addClass('tGiftComing');
            }else if(m_dt == '0601'){
                $('.oyEvent_wrap').addClass('evtOySale0601');
            }

            $('.couponDown1').on('click', function(){
                if(!$('.evtCon02').hasClass('tCouponComing') && !$('.evtCon02').hasClass('tCouponComplete')){
                    $('#todayCpnNo').val($('#cpnNo1').val());
                    mplanshop.eventDetail.checkTodayOrder();
                }
            });
            $('.couponDown2').on('click', function(){
                if(!$('.evtCon03').hasClass('tCouponComing') && !$('.evtCon03').hasClass('tCouponComplete')){
                    $('#todayCpnNo').val($('#cpnNo2').val());
                    mplanshop.eventDetail.checkTodayOrder();
                }
            });
        }

        //7월 핫썸머 쿨특가
        if($("input[id='evtHotCoolYn']:hidden").val() == 'Y'){
    		//일반 탭 메뉴 스크롤 상단 고정  
    		var navOffset = $('.evtNav').offset();
    		var SectionOffset = $('#move1').offset();
    		$(window).scroll(function() {
    			if ($(document).scrollTop() > navOffset.top) {
    				$('.evtNav').addClass('navFixed');
    			} 
    			else {
    				$('.evtNav').removeClass('navFixed');
    			}  
    		});
    		$(window).scroll(function(event) { 
	            var scroll = $(window).scrollTop(); 
	            if(scroll>2300){  
	                $('.evtNav').removeClass('navFixed');
	                
	            } else{
	                //$('.evtNav').addClass('navFixed');
	            } 
	        }); 

    		// //건강한 생활
    		var swiper = new Swiper('.leafletListSlide', {
    			slidesPerView: 1.5,
    			observer: true,
    			observeParents: true,
    			// scrollbar: '.swiper-scrollbar',
    			// scrollbarHide: false,
    			scrollbarHide: true,
    			loop: false,
    			freeMode:true,
    			freeModeMomentumRatio: 0.5,
    			freeModeMomentumVelocityRatio: 0.5
    		}); 

    		$('.btnAgree1').click(function(){
    			if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
        			if(confirm("모바일 APP 에서만 참여 가능합니다.")){
    					common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
    					return;
    				}else{
    					return;
    				}
    	        }
    			if(!mplanshop.eventDetail.checkLoginEvt()){
                    return;
                }
    	        var param = {
    	                evtNo : $("input[id='evtNo']:hidden").val()
    	              , strtDtime : $("input[id='strtDtime']:hidden").val()
    			      , endDtime : $("input[id='endDtime']:hidden").val()
    	        };
    	        common.Ajax.sendJSONRequest(
    	                "GET"
    	              , _baseUrl + "event/20200706/applyReview.do"
    	              , param
    	              , function(json){
    	            	  if(json.ret == '0' || json.ret == '013'){
    	            		  alert('참여완료! 8월 6일 당첨자 게시판을 확인해주세요');
    	            	  }else if(json.ret == '015'){
    	            		  alert('아직 작성하신 포토리뷰가 없네요. 작성 후 다시 참여해주세요.');
    	            	  }else{
    	            		  alert(json.message);
    	            	  }
    	              }
    	        );
    		});

    		var baseImgPath = _cdnImgUrl + "contents/202007/06hotCool/";

        	var dt = new Date();
        	var m_dt = (dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');

        	var param = "viewStdDate=";
        	var url = "" + self.document.location.search;
        	var turl = "";
        	eval("try{ turl=top.document.location.search; }catch(_e){}");
        	url = url + "&" + turl;
        	if ( url.indexOf(param) != -1) {
        		var x = url.indexOf(param) + param.length;
        		var y = url.substr(x).indexOf("&");
        		m_dt = url.substring(x, x+y).substring(4);
        	}
        	if(m_dt >= '0709' && m_dt <= '0710'){
        		$('.evtCon02 .imgBox img').attr('src', baseImgPath + 'mc_tab01_cnt02_0709.jpg');
    		}else if(m_dt >= '0711' && m_dt <= '0712'){
    			$('.evtCon02 .imgBox img').attr('src', baseImgPath + 'mc_tab01_cnt02_0711.jpg');
    		}
        }
        
        if($("input[id='healthLife']:hidden").val() == 'Y'){
        	
        	var return_index = function(dlv_elmt){
        	    var r_index=Math.floor(Math.random()*($('.swiper-slide:not(.swiper-slide-duplicate)').length));
        		return parseInt(r_index); 
        	};
        	
        	var swiper = new Swiper('.leafletListSlide', {
        		slidesPerView: 1,
        		//	initialSlide: 0,
        		//	effect: 'fade',
        		//	effect: 'fade',
        		autoplay:3200,
        		speed:300,
        		pagination: false,
        		//	nextButton: '.next',
        		//	prevButton: '.prev',
        		autoplayDisableOnInteraction: true,
        		paginationClickable: true,
        		freeMode: false,
        		spaceBetween: 0,
        		loop: true,
        		initialSlide : return_index(".leafletListSlide"),
        		//pagination: '.swiper-pagination',
        		navigation: {
        			nextEl: '.swiper-button.next',
        			prevEl: '.swiper-button.prev',
        		}
        	});
        }
        if($("input[id='flex_aug']:hidden").val() == 'Y'){//8월 flex
          //상단 고정 scrollFixTab
        	var _scrollFixTab = $('.scrollFixTab'),
        		_innerPos = _scrollFixTab.find('.innerPos'),
        		_list = _scrollFixTab.find('.list'),
        		_img = _scrollFixTab.find('.tab_img>img'),
        		_img_h = _img.height();
        		
        	_scrollFixTab.css('height', _img_h);
        	_innerPos.css('height', _img_h);
        	_list.css('height', _img_h);
        	_img.load(function(){
        		var _img_h = _img.height();
        		_scrollFixTab.css('height', _img_h);
        		_innerPos.css('height', _img_h);
        		_list.css('height', _img_h);
        	});
        	
        	var _li = _scrollFixTab.find('li');
        	_li.on('click', function(){
        		var _this = $(this);		
        		_this.siblings('li').removeClass('on');
        		_this.addClass('on');	
        	});
        	
        	$(window).on('scroll', function(){ 
        		var _scrollFixTab = $('.scrollFixTab'),
        			_li = _scrollFixTab.find('li'),
        			_tabTop = Math.floor(_scrollFixTab.offset().top);
        			_innerPos = _scrollFixTab.children('.innerPos'),
        			_scrollTop = $(document).scrollTop(),
        			_tc02 = ($('#tabCont02').offset().top)-1,
        			_tc03 = ($('#tabCont03').offset().top)-1,
        			
        			//기획전 하단 sort 영역 관련 추가
        			ConH=$(document).scrollTop()-window.innerHeight,
        			ConOffset = ($('.evtCon07').offset().top)-250; 

        		if(_scrollTop>_tabTop){
        			_innerPos.addClass('on');
        		}
        		if(_scrollTop<_tabTop){
        			_innerPos.removeClass('on');
        		}
        		if(_scrollTop>=_tc02 && _scrollTop<_tc03){
        			_li.siblings('li').removeClass('on bgChange');
        			_li.eq(1).addClass('on');
        			_li.eq(0).addClass('bgChange'); //1번탭 이미지 변경
        		
        		}else if(_scrollTop>=_tc03){
        			_li.siblings('li').removeClass('on bgChange');
        			_li.eq(2).addClass('on');
        			_li.eq(1).addClass('bgChange'); //2번탭 이미지 변경
        		}else{
        			_li.siblings('li').removeClass('on bgChange');
        			_li.eq(0).addClass('on');
        		}

        		if (ConH >= ConOffset) {//기획전일떄 맨 마지막 컨텐츠 스크롤시 네비 삭제
        			$('.scrollFixTab').css( {'display': 'none'});
        		} 
        		else {
        			$('.scrollFixTab').css( {'display': 'block'});
        		}  
        	});  

        	//특가 Flex Slide
        	var return_index = function(div_elmt) {
        		var r_index=Math.floor(Math.random()*($('.swiper-slide:not(.swiper-slide-duplicate)').length));
        		return parseInt(r_index); 
        	}  
        	
        	// 오류 남
        	
        	var swiper1 = new Swiper('.flexSlide1', { 
        		slidesPerView: 1, 
        		autoplay:false,
        		initialSlide:0,
        		// autoplay: {
        		// 	delay:2500,
        		// },
        	//	speed:300,
        	//	effect: 'slide',
        		pagination: false, 
        		paginationClickable: true, 
        		spaceBetween: 0,
        		loop: true,
        		//loopedSlides:1,
        		initialSlide : return_index(".flexSlide1"),
        		//pagination: '.swiper-pagination',
        		navigation: {
        			nextEl: '.swiper-button.BtnSlide1_2',
        			prevEl: '.swiper-button.BtnSlide1_1',
        		},
        		scrollbar: {
        			el: '.swiper-scrollbar.scrollbar1',
        		hide: false,
        	  }
        	}); 

        	var swiper2 = new Swiper('.flexSlide2', {
        		slidesPerView: 1, 
        		autoplay:false,
        		speed:300,
        		pagination: false, 
        		paginationClickable: true, 
        		spaceBetween: 0,
        		loop: true,
        		initialSlide : return_index(".flexSlide2"),
        		//pagination: '.swiper-pagination',
        		navigation: {
        			nextEl: '.swiper-button.BtnSlide2_2',
        			prevEl: '.swiper-button.BtnSlide2_1',
        		},
        		scrollbar: {
        		el: '.swiper-scrollbar.scrollbar2',
        		hide: false,
        	  }
        	}); 
        	
        	var swiper3 = new Swiper('.flexSlide3', {
        		slidesPerView: 1, 
        		autoplay:false,
        		// autoplay: {
        		// 	delay:2500,
        		// },
        		speed:300,
        		pagination: false, 
        		paginationClickable: true, 
        		spaceBetween: 0,
        		loop: true,
        		initialSlide : return_index(".flexSlide3"),
        		//pagination: '.swiper-pagination',
        		navigation: {
        			nextEl: '.swiper-button.BtnSlide3_2',
        			prevEl: '.swiper-button.BtnSlide3_1',
        		},
        		scrollbar: {
        			el: '.swiper-scrollbar.scrollbar3',
        		hide: false,
        	  }
        	});  
			
        	////qa.oliveyoung.co.kr/uploads/contents/202008/10flex/flexDeal_0811.png
        	
        	var baseImgPath =  _cdnImgUrl + "contents/202008/10flex/"; 
        	
        	var dateFlexFunc = function(type){
        		//현재 시간 혹은 input에 숨겨놓는 시간 참조  
        		var result = "";
        		var now = new Date(); // 현재 날짜 세팅        	
                var month = now.getMonth() + 1;
                var date = now.getDate();
                var hours = now.getHours();
                
                if ((month + "").length < 2) {
                    month = "0" + month;
                }
                if ((date + "").length < 2) {
                        date = "0" + date;
                }
                
        		if(type == 'D'){ // 현재 날짜
        			result = $("#curDate").val() == undefined ? month + date : $("#curDate").val();
        		}else if(type == 'T'){        			
        			result = $("#curTime").val() == undefined ? hours : $("#curTime").val();
        		}
        		return result;
        	}
        	
        	var flexObj = {
        			layerPolice : false,
        			"0810" : {quizPrdNo : "A000000140631", quizAnswer : "코메도클라스틴" , cpnNo : $("#cpnNo_0810").val(), fvrSeq : 2},
        			"0811" : {quizPrdNo : "A000000139462", quizAnswer : "나인위시스" , cpnNo : $("#cpnNo_0811").val(), fvrSeq : 3},
            	    "0812" : {quizPrdNo : "B000000140152", quizAnswer : "송월타올" , cpnNo : $("#cpnNo_0812").val(), fvrSeq : 4},
        			"0813" : {quizPrdNo : "", quizAnswer : ""},
        			"0814" : {quizPrdNo : "A000000140604", quizAnswer : "웨이크메이크" , cpnNo : $("#cpnNo_0814").val(), fvrSeq : 5},
        			"0815" : {quizPrdNo : "A000000141377", quizAnswer : "핑거브러시" , cpnNo : $("#cpnNo_0815").val(), fvrSeq : 6},
        			"0816" : {quizPrdNo : "A000000138698", quizAnswer : "포어케어" , cpnNo : $("#cpnNo_0816").val(), fvrSeq : 7},
        			"0817" : {quizPrdNo : "A000000140943", quizAnswer : "유기농" , cpnNo : $("#cpnNo_0817").val(), fvrSeq : 8},
        			prsKitAplyYn : "N" //응모여부 체크 용
        	}
        	
        	//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
            $('#eventDimLayer, #eventLayerPolice .eventHideLayer').click(function(){
                if(flexObj.layerPolice){
                    alert('동의 후 참여 가능합니다.');

                    flexObj.layerPolice = false;
                    $('.close.eventHideLayer').click();

                    //초기화
                    $(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
                    $(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
                }
            });
        	
        	// 퀴즈 없는 날은 HTML 따로 세팅해야 이슈가 없다
        	$(".flexCon img").attr('src', baseImgPath + "flexDeal_"+dateFlexFunc('D')+".png"); //날짜별로 퀴즈 태그 변경
        	// 필요 구현 내역 
        	
        	$(".sbox.moveProd1 a").click(function(){
        		var quizDate = dateFlexFunc("D"); // 당일 날짜 조회
        		common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo='+flexObj[quizDate].quizPrdNo);
        	});
        	
        	if(dateFlexFunc("T") >= 12 && $("#flex_soldout_yn").val() == 'N'){
        		$('div.btnFlex').addClass("on");
        		$('div.btnFlex').click(function(){
        			common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=A000000139899');
        		});
        	}
        	//팝업 
		
    		$('.agreeBtn').click(function(){
    			if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
        			if(confirm("APP 에서만 참여 가능합니다.")){
        				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
        			}
        			return;
				}
	    		
	    		if(!mplanshop.eventDetail.checkLoginEvt()){
	                return;
	            }
	    			    		
	    		var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
	            var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

	            
	    		if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
	    			flexObj.layerPolice = false;
                    alert("2가지 모두 동의 후 참여 가능합니다.");
                    $('.close.eventHideLayer').click();
                    return;
                }

	    		flexObj.layerPolice = false;
	    		$('.close.eventHideLayer').click();
                
				var param = {
		                evtNo : $("input[id='evtNo']:hidden").val()
		        };
		        common.Ajax.sendJSONRequest(
		                "GET"
		        		, _baseUrl + "event/applyFlex.do"
		              , param	        	              
		              , function(json){
		            	  if(json.ret == '0'){	        	            
		            		  $(".sbox.btnApply").removeClass("on");
		            		  alert("정상 응모 되었습니다.");
		            		  flexObj.prsKitAplyYn = "Y";
		            	  }else if(json.ret == '001'){
		            		  alert("이벤트 정보를 확인해 주세요.");
		            	  }else if(json.ret == '013'){
		            		  $(".sbox.btnApply").removeClass("on");
		            		  flexObj.prsKitAplyYn = "Y";
		            		  alert("이미 응모되었습니다.");
		            	  }else if(json.ret == 'fakeUser'){
		            		  alert("주문 금액 조건이 맞지 않습니다.");
		            	  }else{
		            		  alert("응모중 오류가 발생했습니다.");
		            	  }
		              }
		        );
    		});
    		
        	var applyFlex = function() {// 응모하기 버튼 클릭 시
        		$(".sbox.btnApply").unbind("click").click(function(){        				
	        			if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
		            			if(confirm("APP 에서만 참여 가능합니다.")){
		            				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
		            			}
	            			return;
	        			}
	            		
	            		if(!mplanshop.eventDetail.checkLoginEvt()){
	                        return;
	                    }	            		
	            		
	            		if(flexObj.prsKitAplyYn == 'Y'){
	    	    			alert("이미 응모되었습니다.");
	    	    			return;
	    	    		}
	            		
	                    $(':radio[name="argee1"]:checked').attr("checked", false);
	                    $(':radio[name="argee2"]:checked').attr("checked", false);
	            		flexObj.layerPolice = true;
	            		mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
	            		$(".agreeCont")[0].scrollTop = 0;
	            });
        	}
        	
        	var checkFlexApply = function(fvrSeq){
        		var param = {
    	                evtNo : $("input[id='evtNo']:hidden").val()
    	                ,fvrSeq : fvrSeq
    	        };
    	        common.Ajax.sendJSONRequest(
    	                "GET"
    	        		, _baseUrl + "event/checkFlex.do"
    	              , param	        	              
    	              , function(json){
    	        			if(json.possibleYn == "N"){
    	        				$(".flexDealArea .flexCon").addClass("soldOutDeal");
    	        				$('.input_answer').attr('placeholder', '선착순 마감되었습니다.');
    	        			}
    	        			
    	              }
    	        	  
    	        );
        	}
        	
        	setTimeout(function(){
        		   var quizDate = dateFlexFunc("D"); // 당일 날짜 조회
        		   
        		   if(flexObj[quizDate].fvrSeq != undefined && flexObj[quizDate].fvrSeq != "")
        			   checkFlexApply(flexObj[quizDate].fvrSeq); //퀴즈 응모 가능 여부 조회
            }, 300);
        	
        	$(".userAnswer .btn_answer").on('click', function(){
        		var quizDate = dateFlexFunc("D"); 
        		downCouponFlexJsonCheck(flexObj[quizDate].cpnNo);
        	});
        	
            var downCouponFlexJsonCheck = function(cpnNo){ //쿠폰 발급 유효 로직 (정답 체크)
            	
            	if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            		if(confirm("모바일 앱에서만 참여가 가능합니다.")){
            			common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            		}
            		return;
            	}
            	
            	if(!mplanshop.eventDetail.checkLogin()){
    	            return;
    	        }
            	
            	if(dateFlexFunc("T") >= 12){
            			
            		var quizDate = dateFlexFunc("D"); // 당일 날짜 조회
            	
            	    	if(flexObj[quizDate].quizAnswer == $(".input_answer").val()){//정답이 맞으면
            	    		//기참여 여부 체크
            	    		 common.Ajax.sendJSONRequest(
            	    	                "GET"
            	    	        		, _baseUrl + "event/applyQuiz.do"
            	    	              , {	
            	    	        			fvrSeq : flexObj[quizDate].fvrSeq, 
            	    	        			evtNo : $("input[id='evtNo']:hidden").val(),
            	    	        			cpnNo : cpnNo
            	    	        			}	        	              
            	    	              , function(json){
            	    	            	  if(json.ret == 'dupl'){// 이미 참여 
            	            	    			 alert("이미 참여하였습니다.\n마이페이지에서 쿠폰을 확인해주세요.");
            	            	    			 return;
            	            	    		}else if(json.ret == 'staff'){
            	            	    			alert("임직원은 참여가 불가합니다.");
            	            	    			return;
            	            	    		}else if(json.ret == 'finish'){
            	            	    			alert("선착순 행사가 마감되었습니다.");
            	            	    			return;
            	            	    		}else if(json.ret == 'cpnError'){
            	            	    			alert(json.message);
            	            	    			return;
            	            	    		}else if(json.ret == '0'){
            	            	    			alert("정답입니다! 당일까지 사용 가능한 쿠폰이 발급되었습니다.\n쿠폰은 마이페이지에서 확인 가능합니다.");
            	            	    			return;
            	            	    		}
            	    	              }
            	    	        );
            	    	}else{
            	    		alert("정답이 아닙니다.\n상품 상세페이지에서 정답을 찾아보세요.")
            	    		return;            	    	
            	    	}            	
            	}else{
            		alert("12시 부터 이벤트 참여가 가능합니다.");
            		return;
            	}               
            }
        	
        	$(".progressbar").not( 'progressbar.on' ).on('click', function(){
        		if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
        			if(confirm("APP 에서만 참여 가능합니다.")){
        				common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
        			}
        			return;
        		}
        		
        		if(!mplanshop.eventDetail.checkLoginEvt()){
                    return;
                }
        		
        		var param = {
    	                evtNo : $("input[id='evtNo']:hidden").val()
    	                ,fvrSeq : 1
    	        };
    	        common.Ajax.sendJSONRequest(
    	                "GET"
    	              , _baseUrl + "event/getOnlPayAmt.do"
    	              , param
    	              , function(json){
    	            	  if(json.ret == '0'){
    	            		  $(".progressbar").addClass("on");
    	            		  var ordAmt = json.ordAmt >= 50000 ? 50000 : (json.ordAmt <= 0 ? 0 : parseInt(json.ordAmt));
    	            		  var gageOrdAmt = json.ordAmt >= 55000 ? 55000 : (json.ordAmt <= 0 ? 0 : parseInt(json.ordAmt));
    	            		  
    	            		  var gagePercent = (gageOrdAmt / 55000) * 100;
    	            		  gagePercent = gagePercent <=  10 ? 10 : gagePercent; //금액이 10% 미만이면 무조건 10% 까지 채우고
    	            		  gagePercent = gageOrdAmt == 0 ? 0 : gagePercent;   //0원 이면 0%로
    	            		  
    	            		  var percent = (ordAmt / 50000) * 100;
    	            		  
    	            		  $(".progressbar span").attr("style","width:"+gagePercent+"%");
    	            		  if(percent == 100){
    	            			  $(".sbox.btnApply").addClass("on");
    	            			  applyFlex();
    	            		  }
    	            	  }else{
    	            		  alert(json.message);
    	            	  }
    	              }
    	        );
        	});

        }
        //7월 건강식품 카테고리
        if($("input[id='evtHlCgYn']:hidden").val() == 'Y'){
        	// 탭
        	$('.tab01').click(function() {
        		$(".evtab_list").removeClass('tab02_on tab03_on');
        		$('.evtab_list').addClass('tab01_on');
        		$(".tab_con").removeClass('on');
        		$(".tab_con01").addClass('on');
        	});
        	$('.tab02').click(function() {
        		$(".evtab_list").removeClass('tab01_on tab03_on');
        		$('.evtab_list').addClass('tab02_on');
        		$(".tab_con").removeClass('on');
        		$(".tab_con02").addClass('on');
        	});
        	$('.tab03').click(function() {
        		$(".evtab_list").removeClass('tab01_on tab02_on');
        		$('.evtab_list').addClass('tab03_on');
        		$(".tab_con").removeClass('on');
        		$(".tab_con03").addClass('on');
        	});

			$(".eventLayer .close").click(function(){
				if($('#eventLayerPolice').is(':visible')){
					//위수탁동의 새로고침
					location.reload();
				}else{
					mplanshop.eventDetail.eventHideLayerYoutube('playMovie');
				}
			});
        	
        	$("#popForm1 input:text").attr('placeholder', '직접입력');
    		$("input").bind("click", function(){
    			if('q1_txt' == $(this).attr('name')){
    				$('[name=q1]:last').attr("checked", true);
    			}else if('q2_txt' == $(this).attr('name')){
    				$('[name=q2]:last').attr("checked", true);
    			}else if('q3_txt' == $(this).attr('name')){
    				$('[name=q3]:last').attr("checked", true);
    			}
    		});

			//참여하기
			$(".evtCon03 .popEvent1").click(function(){
    			if(!mplanshop.eventDetail.checkLoginEvt()){
                    return;
                }
    	        var param = {
    	                evtNo : $("input[id='evtNo']:hidden").val()
    	        };
    	        common.Ajax.sendJSONRequest(
    	                "GET"
    	              , _baseUrl + "event/20200717/checkHealthApply.do"
    	              , param
    	              , function(json){
    	            	  if(json.ret == '0'){
    	            		  mplanshop.eventDetail.eventShowLayScrollYoutube('playMovie', 'popForm1');
    	            	  }else{
    	            		  alert(json.message);
    	            	  }
    	              }
    	        );
			});

			//제출하기
			$("#popForm1 .userSubmit").click(function(){
				var question1 = '';
				var question2 = '';
				var question3 = '';

				$('#popForm1 [name="q1"]:checked').each(function(){
					if(common.isEmpty(question1)){
						question1 = $(this).val();
					}else{	
						question1 += ',' + $(this).val();
					}
				});
				var question1_txt = $.trim($("[name=q1_txt]").val()).replace(/\|/gi, "");
				$('#popForm1 [name="q2"]:checked').each(function(){
					if(common.isEmpty(question2)){
						question2 = $(this).val();
					}else{	
						question2 += ',' + $(this).val();
					}
				});
				var question2_txt = $.trim($("[name=q2_txt]").val()).replace(/\|/gi, "");
				$('#popForm1 [name="q3"]:checked').each(function(){
					if(common.isEmpty(question3)){
						question3 = $(this).val();
					}else{	
						question3 += ',' + $(this).val();
					}
				});
				var question3_txt = $.trim($("[name=q3_txt]").val()).replace(/\|/gi, "");

				if(common.isEmpty(question1) || common.isEmpty(question2) || common.isEmpty(question3)){
					alert("질문별 답변 선택은 필수입니다.");
					return;
				}

				if((question1.indexOf('E') != -1 && common.isEmpty(question1_txt))
					|| (question2.indexOf('E') != -1 && common.isEmpty(question2_txt))
					|| (question3.indexOf('E') != -1 && common.isEmpty(question3_txt))){
					alert("질문별 답변 선택은 필수입니다.");
					return;
				}
				if(question1.indexOf('E') == -1){
					question1_txt = "선택";
				}
				if(question2.indexOf('E') == -1){
					question2_txt = "선택";
				}
				if(question3.indexOf('E') == -1){
					question3_txt = "선택";
				}

				$("input[id='noteCont']:hidden").val(question1 + "|" + question1_txt + "|" + question2 + "|" + question2_txt + "|" + question3 + "|" + question3_txt);

				mplanshop.eventDetail.eventHideLayer();
				mplanshop.eventDetail.eventShowLayScroll('popForm2');
			});

			//경품 선택완료
			$("#popForm2 .userSubmit2").click(function(){
				if(common.isEmpty($(':radio[name="gift"]:checked').val())){
					alert("답변 선택은 필수입니다.");
					return;
				}
				$("input[id='fvrSeq']:hidden").val($(':radio[name="gift"]:checked').val());

				mplanshop.eventDetail.eventHideLayer();

    			//위수탁동의 팝업
    			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
    			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
    			mplanshop.eventDetail.eventShowLayScroll('eventLayerPolice');
    			$(".agreeCont")[0].scrollTop = 0;
    			mplanshop.eventDetail.layerPolice = true;
				mplanshop.eventDetail.eventShowLayScroll('eventLayerPolice');
			});

			//위수탁 동의
			$("#eventLayerPolice .agreeBtn div").click(function(){
    			if(!mplanshop.eventDetail.checkLoginEvt()){
                    return;
                }
    			if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
    				alert("2가지 모두 동의 후 참여 가능합니다.");
    				return;
    			}
    			if(common.isEmpty($("input[id='noteCont']:hidden").val())){
					alert("질문별 답변 선택은 필수입니다.");
					return;
    			}
    			if(common.isEmpty($("input[id='fvrSeq']:hidden").val())){
					alert("답변 선택은 필수입니다.");
					return;
    			}

        		mplanshop.eventDetail.layerPolice = false;
        		mplanshop.eventDetail.eventHideLayer();

    	        var param = {
    	                evtNo : $("input[id='evtNo']:hidden").val()
    	                ,noteCont : $("input[id='noteCont']:hidden").val()
    	                ,fvrSeq : $("input[id='fvrSeq']:hidden").val()
    	                ,mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
    	                ,mbrInfoThprSupAgrYn :$(':radio[name="argee2"]:checked').val()
    	        };
    	        common.Ajax.sendJSONRequest(
    	                "GET"
    	              , _baseUrl + "event/20200717/healthApply.do"
    	              , param
    	              , function(json){
	    	        		if(json.ret == '016' || json.ret == '017'){
	    	        			//위수탁동의 팝업
	    	        			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
	    	        			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
	    	        			mplanshop.eventDetail.eventShowLayScroll('eventLayerPolice');
	    	        			$(".agreeCont")[0].scrollTop = 0;
	    	        			mplanshop.eventDetail.layerPolice = true;
	    	        		}else if(json.ret == '0'){
	    	        			alert('응모가 완료되었습니다.');
	    	        			mplanshop.eventDetail.eventHideLayerYoutube('playMovie');
	    	        		}else{
	    	        			alert(json.message);
	    	        		}
    	              }
    	        );
			});

			//직접 X(닫기) 클릭 or 레이어팝업 이외 영역 클릭 시, 알럿
			$('#eventLayerPolice .close').click(function(){
				if(mplanshop.eventDetail.layerPolice){
					alert('동의 후 참여 가능합니다.');

					//위수탁동의 새로고침
					location.reload();
				}
			});
        }

        //8월 건강 새로 고침
        if($("input[id='evtHlCgYn_2']:hidden").val() == 'Y'){

        	//건강새로고침 탭
        	$('.tabBoxArea ul li').click(function(){ 
        	 	var tab_parents = 'tabBox'+$(this).index()
        		$(".tabBoxArea ul li").removeClass('on');
        		$(".tabBoxArea .conBox").removeClass('on');
        		$(this).addClass('on');
        		$('.tabBoxArea ul').removeClass('tabBox0 tabBox1 tabBox2 tabBox3').addClass(tab_parents);
        		//$(this).parent().addClass('tab'+$(this).index());
        		$('#'+$(this).data('id')).addClass('on');
        	}); 

        	$('.couponDown1').click(function(){
    	        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
    	            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
    	                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
    	            }else{
    	                return;
    	            }
    	        }else if(!mplanshop.eventDetail.checkLoginEvt()){
    				return;
    			}else{
        	        var param = {
        	                evtNo : $("input[id='evtNo']:hidden").val()
        	                ,cpnNo : $("input[id='evtCpnNo']:hidden").val()
        	                ,strtDtime : $("input[id='strtDtime']:hidden").val()
        	                ,endDtime : $("input[id='endDtime']:hidden").val()
        	                ,dispCatNo : $("input[id='dispCatNo']:hidden").val()
        	        };
        	        common.Ajax.sendJSONRequest(
        	                "GET"
        	              , _baseUrl + "event/20200801_1/downCouponJson.do"
        	              , param
        	              , function(json){
    	    	        		alert(json.message);
        	              }
        	        );
    	        }
        	});

        	$('.popEvent1').click(function(){
    	        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
    	            if(confirm("모바일 앱에서만 응모 가능합니다.")){
    	                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
    	            }else{
    	                return;
    	            }
    	        }else if(!mplanshop.eventDetail.checkLoginEvt()){
    				return;
    			}else{
        	        var param = {
        	                evtNo : $("input[id='evtNo']:hidden").val()
        	                ,dispCatNo : $("input[id='dispCatNo']:hidden").val()
        	        };
        	        common.Ajax.sendJSONRequest(
        	                "GET"
        	              , _baseUrl + "event/20200801_1/healthApply.do"
        	              , param
        	              , function(json){
    	    	        		if(json.ret == '016' || json.ret == '017'){
    	    	        			//위수탁동의 팝업
    	    	        			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
    	    	        			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
    	    	        			mplanshop.eventDetail.eventShowLayScrollYoutube('playMovie', 'eventLayerPolice');
    	    	        			$(".agreeCont")[0].scrollTop = 0;
    	    	        			mplanshop.eventDetail.layerPolice = true;
    	    	        		}else if(json.ret == '0'){
    	    	        			alert('응모 완료되었습니다!');
    	    	        			mplanshop.eventDetail.eventHideLayerYoutube('playMovie');
    	    	        		}else{
    	    	        			alert(json.message);
    	    	        		}
        	              }
        	        );
    	        }
        	});

			$("#eventDimLayer, .eventLayer .close").click(function(){
				if($(this).attr('id') == 'eventDimLayer'){
					if(!$('#eventNotice1').is(':visible') && !$('#eventNotice2').is(':visible')){
						//위수탁에서는 딤클릭시 팝업 닫음. 유투브 셋팅하기
						mplanshop.eventDetail.eventHideLayerYoutube('playMovie');
					}
				}else {
					mplanshop.eventDetail.eventHideLayerYoutube('playMovie');
				}
			});

			//위수탁 동의
			$("#eventLayerPolice .agreeBtn div").click(function(){
    			if(!mplanshop.eventDetail.checkLoginEvt()){
                    return;
                }
    			if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
    				alert("2가지 모두 동의 후 참여 가능합니다.");
    				return;
    			}

        		mplanshop.eventDetail.layerPolice = false;
        		mplanshop.eventDetail.eventHideLayerYoutube('playMovie');

    	        var param = {
    	                evtNo : $("input[id='evtNo']:hidden").val()
    	                ,dispCatNo : $("input[id='dispCatNo']:hidden").val()
    	                ,mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
    	                ,mbrInfoThprSupAgrYn :$(':radio[name="argee2"]:checked').val()
    	        };
    	        common.Ajax.sendJSONRequest(
    	                "GET"
    	              , _baseUrl + "event/20200801_1/healthApply.do"
    	              , param
    	              , function(json){
	    	        		if(json.ret == '016' || json.ret == '017'){
	    	        			//위수탁동의 팝업
	    	        			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
	    	        			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
	    	        			mplanshop.eventDetail.eventShowLayScroll('eventLayerPolice');
	    	        			$(".agreeCont")[0].scrollTop = 0;
	    	        			mplanshop.eventDetail.layerPolice = true;
	    	        		}else if(json.ret == '0'){
	    	        			alert('응모가 완료되었습니다.');
	    	        			mplanshop.eventDetail.eventHideLayerYoutube('playMovie');
	    	        		}else{
	    	        			alert(json.message);
	    	        		}
    	              }
    	        );
			});
        }
        
        if($("input[id='olyoungPick2008']:hidden").val() == 'Y'){
        	
        	//유의사항 토글
            $('.caution_btn').click(function() {
                $(this).toggleClass('on').next('.caution_con').slideToggle();
            });

            //로그인시 올영픽 응모여부 조회
            if(common.isLogin()){
                if(!common.isEmpty($('#evtNo').val())){
                    mplanshop.eventDetail.getApplyGiftYn();
                }
            }
            
            $('.btn_gift').click(function() {            	
                if($(this).hasClass('on')){
                    mplanshop.eventDetail.applyGiftCardReview();
                }
            });     	
        }
        
        if($("input[id='anti_age0910']:hidden").val() == 'Y' || $("input[id='anti_age1001']:hidden").val() == 'Y'){
        	if($("input[id='anti_age0910']:hidden").val() == 'Y'){
        		var return_index = function(dlv_elmt){
        			var r_index=Math.floor(Math.random()*($('.swiper-slide:not(.swiper-slide-duplicate)').length));
        			return parseInt(r_index); 
        		};
        		
        		var galleryThumbs = new Swiper('.gallery-thumbs', {
        			spaceBetween: 12,
        			slidesPerView: 3,
        			freeMode: true,
        			watchSlidesVisibility: true,
        			watchSlidesProgress: true,
        		});
        		var galleryTop = new Swiper('.gallery-top', {
        			spaceBetween: 0,
        			loop: true,
        			autoplay:true,
        			speed:300,
        			initialSlide : return_index(".leafletListSlide"),
        			navigation: {
        				nextEl:'.swiper-button-next',
        				prevEl:'.swiper-button-prev',
        			},
        			thumbs: {
        				swiper: galleryThumbs
        			}
        		});
        		
        		$('.tabBoxArea ul li').click(function(){ 
        			var tab_parents = 'tab'+$(this).index()
        			$(".tabBoxArea ul li").removeClass('on');
        			$(".tabBoxArea .conBox").removeClass('on');
        			$(this).addClass('on');
        			$('.tabBoxArea ul').removeClass('tab0 tab1 tab2 tab3').addClass(tab_parents);
        			//$(this).parent().addClass('tab'+$(this).index());
        			$('#'+$(this).data('id')).addClass('on'); 
        		});
        		
        	}
        	
        	if($("input[id='anti_age1001']:hidden").val() == 'Y'){
        		var return_index = function(div_elmt) {
        			var r_index=Math.floor(Math.random()*($('.swiper-slide:not(.swiper-slide-duplicate)').length));
        			return parseInt(r_index); 
        		};
        		
        		var galleryThumbs = new Swiper('.gallery-thumbs', {
        			slidesPerView: 3,
        			freeMode: true,
        			watchSlidesVisibility: true,
        			watchSlidesProgress: true,
        			touchRatio: 0,
        		});
        		
        		var galleryTop = new Swiper('.gallery-top', {
        			autoplay: true,
        			spaceBetween: 0,
        			loop: true,
        			initialSlide : return_index(".leafletListSlide"),        		
        			thumbs: {
        				swiper: galleryThumbs
        			}
        		});
        		
        		$('.tabBtnWrap [class^=tabBtn]').click(function(){
        			$(this).siblings().removeClass('on');
        			$(this).addClass('on');
        			var tabCon = $(this).data('id');
        			$('.conBox').removeClass('on');
        			$('#' + tabCon).addClass('on');
        		});
        	}
        	
        	$('.popNotice1').click(function() { 
				$("#video").attr('src',''); 
			});
	
			$('.eventHideLayer').click(function() { 
				$("#video").attr('src', $('#youtubeURL').val()); 
			});
						
    
        	var applyCheckFunc =  function(json){
        	      if(json.ret == "0"){
        	          if(json.applyYn == "Y"){
        	              $(".btnGiftApply").removeClass('on');
        	          }else{
        	       	   $(".btnGiftApply").addClass('on');
        	          }
        	      }
        	};
        	   
        	 if(common.isLogin()){
                 if(!common.isEmpty($('#evtNo').val())){
                  var chkParam = {
                		  			evtNo : $("input[id='evtNo']:hidden").val()
                		  			,fvrSeq : $("input[id='fvrSeq1']:hidden").val()
                  			   };
                     mplanshop.eventDetail.checkOrderReviewYn(applyCheckFunc, chkParam);
                 }
             }        	
        
        	var applyValidFunc = function(json){	
        		if(json.ret == "0"){
        			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
        			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
        			mplanshop.eventDetail.eventShowLayScroll('eventLayerPolice');
        			$(".agreeCont")[0].scrollTop = 0;
        			mplanshop.eventDetail.layerPolice = true;
        		}else if(json.ret == "089"){// 미구매 or 리뷰 미작성
        			if(json.payYn == 'Y'){
        				if(confirm("하단 진열 상품의 포토 리뷰를 작성하고 응모해주세요")){
        					common.link.commonMoveUrl('mypage/getGdasList.do');
        				}
        			}else{
        				alert("하단 진열 상품 구매 후 참여해주세요");        				
        			}
        		}else{
        			alert(json.message);        			
        		}
        	}   
        	        	
        	$(".btnGiftApply").click(function(){
        		if($(".btnGiftApply").hasClass('on')){
                    		
        			mplanshop.eventDetail.applyOrderReview(applyValidFunc,
        					{
                        		evtNo : $("input[id='evtNo']:hidden").val()
                        		,dispCatNo : $("input[id='dispCatNo']:hidden").val()
                        		,fvrSeq : $("input[id='fvrSeq1']:hidden").val()
                        		,noteCont : $("input[id='noteCont']:hidden").val()
                        		,photoGdasYn : $("input[id='photoGdasYn']:hidden").val()
                        		,mbrInfoUse : "Y"
                        		,noAplyYn : "Y"
                        		,appChkYn : "N"
        					}
        			);
        					
        			
        		}
        	});
        	
        	var applyFunc = function(json){	
        		if(json.ret == "0"){
        			$(".btnGiftApply").removeClass('on');
        			mplanshop.eventDetail.eventShowLayer('popGift1');
        		}else if(json.ret == "089"){// 미구매 or 리뷰 미작성
        			if(json.payYn == 'Y'){
        				alert("하단 진열 상품의 포토 리뷰를 작성하고 응모해주세요");
        				return;
        			}else{
        				alert("하단 진열 상품 구매 후 참여해주세요");
        				return;
        			}
        		}else{
        			alert(json.message);
        			return;
        		}
        	}   
        	
        	$(".agreeBtn").click(function() {//위수탁 내 확인 버튼
        		if($(".btnGiftApply").hasClass('on')){//응모하기 버튼 on시
        			
        			if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
        				alert("2가지 모두 동의 후 참여 가능합니다.");
        				return;
        			}
        			
              		mplanshop.eventDetail.layerPolice = false;
            		mplanshop.eventDetail.eventHideLayer();
            		
        			mplanshop.eventDetail.applyOrderReview(applyFunc, 
        					{
                				evtNo : $("input[id='evtNo']:hidden").val()
                				,dispCatNo : $("input[id='dispCatNo']:hidden").val()
                				,fvrSeq : $("input[id='fvrSeq1']:hidden").val()
                				,noteCont : $("input[id='noteCont']:hidden").val()
                				,photoGdasYn : $("input[id='photoGdasYn']:hidden").val()
                				,mbrInfoUse : "Y"
        					}		
        			);
        		}
            });
        }
        
        if($("input[id='olyoungPick2020']:hidden").val() == 'Y'){
        	
        	//유의사항 토글
            $('.caution_btn').click(function() {
                $(this).toggleClass('on').next('.caution_con').slideToggle();
            });

            //로그인시 올영픽 응모여부 조회
            if(common.isLogin()){
                if(!common.isEmpty($('#evtNo').val())){
                    mplanshop.eventDetail.getApplyGiftYn();
                }
            }
      
	      	var applyValidFunc = function(json){	
	      		if(json.ret == "0"){
	      			$(':radio[name="argee1"]:input[value="N"]').attr("checked", true);
	      			$(':radio[name="argee2"]:input[value="N"]').attr("checked", true);
	      			mplanshop.eventDetail.eventShowLayScroll('eventLayerPolice');
	      			$(".agreeCont")[0].scrollTop = 0;
	      			mplanshop.eventDetail.layerPolice = true;
	      		}else{
	      			alert(json.message);        			
	      		}
	      	}   
	      	        	
	      	$(".btn_gift").click(function(){
	      		if($(".btn_gift").hasClass('on')){	                  		
	      			mplanshop.eventDetail.applyOrderReview(applyValidFunc,
	      					{
	                      		evtNo : $("input[id='evtNo']:hidden").val()
	                      		,dispCatNo : $("input[id='dispCatNo']:hidden").val()
	                      		,fvrSeq : $("input[id='fvrSeq1']:hidden").val()
	                      		,noteCont : $("input[id='noteCont']:hidden").val()
	                      		,mbrInfoUse : "Y"
	                      		,noAplyYn : "Y"
	                      		,appChkYn : "Y"
	      					}
	      			);
	      		}
	      	});
      	
      	var applyFunc = function(json){	
      	     if(json.ret == "0"){
                 mplanshop.eventDetail.getApplyGiftYn();
             }
             alert(json.message);
      	}   
      	
      	$(".agreeBtn").click(function() {//위수탁 내 확인 버튼
      		if($(".btn_gift").hasClass('on')){//응모하기 버튼 on시
      			
      			if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
      				alert("2가지 모두 동의 후 참여 가능합니다.");
      				return;
      			}
      			
            	mplanshop.eventDetail.layerPolice = false;
          		mplanshop.eventDetail.eventHideLayer();
          		
      			mplanshop.eventDetail.applyOrderReview(applyFunc, 
      					{
              				evtNo : $("input[id='evtNo']:hidden").val()
              				,dispCatNo : $("input[id='dispCatNo']:hidden").val()
              				,fvrSeq : $("input[id='fvrSeq1']:hidden").val()
              				,noteCont : $("input[id='noteCont']:hidden").val()              	
              				,mbrInfoUse : "Y"
              				,appChkYn : "Y"
      					}		
      			);
      		}
          });
        }
        //추석 프로모션
        if($("input[id='tkgivingYn']:hidden").val() == 'Y'){
        	$('#mContents .contEditor').append($('<script/>', {'src': 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.6/js/swiper.min.js'}));

            setTimeout(function(){
            	var return_index = function(slide) {
            		var r_index = Math.floor(Math.random()*($('.swiper-slide:not(.swiper-slide-duplicate)').length));
            		return parseInt(r_index);
            	}
            	var swiper1 = new Swiper('#randomSlide1', { 
            		slidesPerView: 'auto',
            		initialSlide : return_index("#randomSlide1"),
            		loop: true,
            		pagination: true, 
            		pagination: {
            			el: '.swiper-pagination1',
            			clickable: true,
            		}
            	});
            	var swiper2 = new Swiper('#randomSlide2', { 
            		slidesPerView: 'auto',
            		initialSlide : return_index("#randomSlide2"),
            		loop: true,
            		pagination: true, 
            		pagination: {
            			el: '.swiper-pagination2',
            			clickable: true,
            		}
            	});
            	var swiper3 = new Swiper('#randomSlide3', { 
            		slidesPerView: 'auto',
            		initialSlide : return_index("#randomSlide3"),
            		loop: true,
            		pagination: true, 
            		pagination: {
            			el: '.swiper-pagination3',
            			clickable: true,
            		}
            	});
            }, 500);
        }
        
        if($("input[id='men_2020']:hidden").val() == 'Y'){
        	var currentHour = $("#currentTime").val().substring(8,10); 
        	if($("#limitStHr").val() <= currentHour && $("#limitEndHr").val() >= currentHour){ //발급 시간 체크
        		$(".evtCon01").removeClass("evtCouponPre");
        		$('.couponDown1').attr('onclick', "mplanshop.eventDetail.downGenderCouponJson('M','"+$("#encCpn").val()+"');");
        	}
        }
        
        //전사 올영세일
        if($("input[id='evtBSaleAllYn']:hidden").val() == 'Y'){
        	$('#mContents .contEditor').append($('<script/>', {'src': '//image.oliveyoung.co.kr/uploads/contents/202006/29cleanBeauty/swiper.min.js'}));

    		var baseImgPath = _cdnImgUrl + "contents/202009/03brandSaleAll/";

        	var dt = new Date();
        	var m_dt = (dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');

        	var param = "viewStdDate=";
        	var url = "" + self.document.location.search;
        	var turl = "";
        	eval("try{ turl=top.document.location.search; }catch(_e){}");
        	url = url + "&" + turl;
        	if ( url.indexOf(param) != -1) {
        		var x = url.indexOf(param) + param.length;
        		var y = url.substr(x).indexOf("&");
        		m_dt = url.substring(x, x+y).substring(4);
        	}
        	if(m_dt == '0923'){
        		$('.evtContop .imgBox img').attr('src', baseImgPath + 'mc_visualLastDay.jpg');
        	}
        	if(m_dt >= '0920'){
        		$('.evtCon01 .imgBox img').attr('src', baseImgPath + 'mc_cnt01_1.jpg');
        		$('.evtCon02 .imgBox img').attr('src', baseImgPath + 'mc_cnt02_2.jpg');
        		$('.popNotice1').attr('onclick', $('.popNotice1').attr('onclick').replace('eventNotice1', 'eventNotice2'));
        	}
        	if(m_dt == '0917'){
        		$('.banner01').show();
        	}
        	$('.evtCon03 .imgBox img').attr('src', baseImgPath + 'mc_cnt03_' + (m_dt*1-0916) + '.jpg');

			$('.popNotice1, .popNotice2').click(function() { 
				$("#video").attr('src',''); 
			});
	
			$('.eventHideLayer').click(function() { 
				$("#video").attr('src', $('#youtubeURL').val()); 
			});
			
			setTimeout(function(){
				var galleryThumbs = new Swiper('.gallery-thumbs', {
					spaceBetween:0,
					slidesPerView:8,
					initialSlide : 0,
					freeMode: false,
					watchSlidesVisibility: true,
					watchSlidesProgress: true,
				});
				var galleryTop = new Swiper('.gallery-top', {
					spaceBetween:10,
					loop: true,
					initialSlide : 0,
					// initialSlide : return_index(".leafletListSlide"),
					//pagination: '.paging',
					nextButton: '.next',
					prevButton: '.prev',
					freeMode: false,
					loop: true,
					//pagination: '.swiper-pagination', 
					navigation: {
						nextEl:'.swiper-button-next',
						prevEl:'.swiper-button-prev',
					},
					thumbs: {
						swiper: galleryThumbs
					}
				}); 
			}, 500);
		}
        
        // 2020.09.25 메인 차별화 이벤트 (득템하시월) (crt.허민)
        if($("input[id='evtGetItem']:hidden").val() == 'Y') {
        	$('#mContents .contEditor').append($('<script/>', {'src': 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.6/js/swiper.min.js'}));
        	
        	var baseImgPath = _cdnImgUrl + "contents/202010/12item/";

        	var dt = new Date();
        	var m_dt = (dt.getMonth()+1).lpad(2,'0') +''+ dt.getDate().lpad(2,'0');

        	var param = "viewStdDate=";
        	var url = "" + self.document.location.search;
        	var turl = "";
        	eval("try{ turl=top.document.location.search; }catch(_e){}");
        	url = url + "&" + turl;
        	
        	if ( url.indexOf(param) != -1) {
        		var x = url.indexOf(param) + param.length;
        		var y = url.substr(x).indexOf("&");
        		m_dt = url.substring(x, x+y).substring(4);
        	}
        	
        	setTimeout(function() {
        		var return_index = function(div_elmt) {
        			var r_index = Math.floor(Math.random() * ($('.swiper-slide:not(.swiper-slide-duplicate)').length));
        			return parseInt(r_index);
        		}
            	
            	var swiper1 = new Swiper('.leafletListSlide1', { 
        			slidesPerView: 1, 
        			// autoplay:false,
        			initialSlide:0,
        			autoplay: {
        				delay:2500,
        			},
        			speed:500,
        			// effect: 'slide',
        			paginationClickable: true, 
        			spaceBetween: 0,
        			loop: true,
        			// loopedSlides:1,
        			initialSlide : return_index(".leafletListSlide1"),
        			pagination: {
        				el: '.swiper-pagination',
        			}
        		});
            	
            	var swiper2 = new Swiper('.leafletListSlide2', {
        			slidesPerView: 1, 
        			autoplay:true,
        			speed:500,
        			pagination: false, 
        			paginationClickable: true, 
        			spaceBetween: 0,
        			loop: true,
        			initialSlide : return_index(".leafletListSlide2"),
        			scrollbar: {
        				el: '.swiper-scrollbar.scrollbar2',
        				hide: false,
        			}
        		});
            	
            	var todaySpecItem01 = $("#tdaySpecItem01").val().split(",");
            	var todaySpecItem02 = $("#tdaySpecItem02").val().split(",");
            	var todaySpecItem03 = $("#tdaySpecItem03").val().split(",");
            	var todaySpecItem04 = $("#tdaySpecItem04").val().split(",");
            	var todaySpecItem05 = $("#tdaySpecItem05").val().split(",");
            	var todaySpecItem06 = $("#tdaySpecItem06").val().split(",");
            	var todaySpecItem07 = $("#tdaySpecItem07").val().split(",");
            	
            	// 찐트렌드 날짜별 상품 정보 내용을 초기화 한다. (18일 이후, 18일 상품 내용을 출력)
            	if (m_dt <= '1012') {
            		$(".moveDeal1").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem01[0] + "');"); 
            		$(".moveDeal2").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem01[1] + "');");
        		} else if (m_dt == '1013'){
        			$(".oyEvent_wrap").removeClass("evtDay1");
            		$(".oyEvent_wrap").addClass("evtDay2");
            		
        			$(".moveDeal1").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem02[0] + "');"); 
            		$(".moveDeal2").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem02[1] + "');");
        		} else if (m_dt == '1014') {
        			$(".oyEvent_wrap").removeClass("evtDay1");
            		$(".oyEvent_wrap").addClass("evtDay3");
            		
        			$(".moveDeal1").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem03[0] + "');"); 
            		$(".moveDeal2").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem03[1] + "');");
        		} else if (m_dt == '1015') {
        			$(".oyEvent_wrap").removeClass("evtDay1");
            		$(".oyEvent_wrap").addClass("evtDay4");
            		
        			$(".moveDeal1").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem04[0] + "');"); 
            		$(".moveDeal2").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem04[1] + "');");
        		} else if (m_dt == '1016') {
        			$(".oyEvent_wrap").removeClass("evtDay1");
            		$(".oyEvent_wrap").addClass("evtDay5");
            		
        			$(".moveDeal1").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem05[0] + "');"); 
            		$(".moveDeal2").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem05[1] + "');");
        		} else if (m_dt == '1017') {
        			$(".oyEvent_wrap").removeClass("evtDay1");
            		$(".oyEvent_wrap").addClass("evtDay6");
            		
        			$(".moveDeal1").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem06[0] + "');"); 
            		$(".moveDeal2").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem06[1] + "');");
        		} else if (m_dt == '1018') {
        			$(".oyEvent_wrap").removeClass("evtDay1");
            		$(".oyEvent_wrap").addClass("evtDay7");
            		
        			$(".moveDeal1").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem07[0] + "');"); 
            		$(".moveDeal2").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem07[1] + "');");
        		} else {
        			$(".oyEvent_wrap").removeClass("evtDay1");
            		$(".oyEvent_wrap").addClass("evtDay7");
            		
        			$(".moveDeal1").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem08[0] + "');"); 
            		$(".moveDeal2").attr("href", "javascript:common.link.commonMoveUrl('goods/getGoodsDetail.do?goodsNo=" + todaySpecItem08[1] + "');");
        		}
        		
    	        if(common.isLoginForEvt()) {
    	        	/* 로그인 회원 응모여부 조회 */
    	        	mplanshop.eventDetail.getApplyItemYn();
    	        }
            }, 500);
        	
        	// [종복 할인 상품 더보기] 버튼 클릭 시, 카테고리 전체 내용을 보여준다.
        	$('.moveScroll1').on('click', function() {
        		//$('select option:eq(0)').prop('selected', true);
        		$("select").val("").prop("selected", true);
		        	$('.temaBox').css('display','block');
		     }); 
        	
        	// 로그인 버튼 클릭 화면으로 이동
        	$(".userCon").click(function() {
        		if (!mplanshop.eventDetail.checkLogin()) {
        			return;
        		} else {
        			return;
        		}
        	});
        	
        	$(".btnEvtGift").click(function() {
        		if (!$(this).hasClass('on')) {
        			return;
        		} else if(!mplanshop.eventDetail.checkLogin()) {
	                return;
	            } else {
	            	if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
	    	            if (confirm("모바일 앱에서만 참여 가능합니다.")) {
	    	                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo=" + $("input[id='evtNo']:hidden").val());
	    	            } else {
	    	                return;
	    	            }
	            	} else {
	            		mplanshop.eventDetail.eventShowLayScroll('eventLayerPolice');
	            	}
	            }
        	});
        	
        	// 더찐트렌트 이벤트 응모 클릭 이벤트
        	$("#apply").click(function() {
    			if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
    	            if (confirm("모바일 앱에서만 참여 가능합니다.")) {
    	                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo=" + $("input[id='evtNo']:hidden").val());
    	            } else {
    	                return;
    	            }
    			} else {
    				if(!mplanshop.eventDetail.checkLogin()) {
    	                return;
    	            }
    				
    				if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
                        alert("2가지 모두 동의 후 참여 가능합니다.");
                        return;
                    }
    				
    				mplanshop.eventDetail.applyItem();
    			}
    		});
        }
    },
    
    /**
    * 구매 후 리뷰 응모 여부 체크(공통)
    */
   checkOrderReviewYn : function(callbackFunc, param){
	   if(typeof callbackFunc !== 'function'){ //콜백이 지정되어 있지 않으면 기본 콜백 사용 
       	  callbackFunc = mplanshop.eventDetail._callback_getApplyGiftYn;
       }        
       common.Ajax.sendJSONRequest(
               "GET"
             , _baseUrl + "event/getApplyGiftYn.do"
             , param
             , callbackFunc
       );
   },
    /**
     * applyOrderReview(구매 및 리뷰 작성 여부 체크)
     * 기존걸 공통화 하려다 자꾸 쪼금씩 바뀌여서 포기함
     * 콜백은 각각의 이벤트에서 정의해서 쓸것 
     */
    applyOrderReview : function(callbackFunc, param){
        if(param.appChkYn == "Y" && (common.app.appInfo == undefined || !common.app.appInfo.isapp)){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/applyGiftCardReview.do"
                  , param
                  , callbackFunc
            );
        }
    },
    /**
     * 로그인 체크 (공통)
     */
    checkLogin : function(){
        if(common.isLogin() == false){
            if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                return false;
            }else{
                common.link.moveLoginPage();
                return false;
            }
        }
        return true;
    },

    /**
     * APP 쿠폰 다운로드 전용(공통)
     */
    downAppCouponJson : function(cpnNo){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            alert("올리브영 앱에서만 발급가능합니다.");
            return;
        }
        mplanshop.eventDetail.downCouponJson(cpnNo);
    },

    /**
     * APP 쿠폰 다운로드 전용(공통)
     */
    downAppCouponEventJson : function(cpnNo){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            mplanshop.eventDetail.downCouponJson(cpnNo);
        }
    },
    
    /**
     * 특정 성별 전용 쿠폰 다운로드 전용(공통)
     */
    downGenderCouponJson : function(gender, cpnNo){
    	if(!mplanshop.eventDetail.checkLogin())
             return;
    	
    	if($("#planShopSexCd").val() != gender){
    		if(gender == 'M'){
    			alert("해당 쿠폰은 남성 회원 전용 쿠폰입니다.");
    		}else{
    			alert("해당 쿠폰은 여성 회원 전용 쿠폰입니다.")
    		}
        }else{
        	mplanshop.eventDetail.downCouponGenderJson(cpnNo);
        }
    },
    
    downCouponGenderJson : function(cpnNo) {
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }else{
            if(typeof cpnNo == "undefined" || cpnNo == ""){
                alert("쿠폰 번호가 없습니다.");
                return;
            }
            var param = {cpnNo : cpnNo};
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/downCouponJson.do"
                    , param
                    , this._callback_downCouponGenderJson);
        }
    },
    
    /**
     * 쿠폰 다운로드 callback (공통)
     */
    _callback_downCouponGenderJson : function(strData) {
        if(strData && strData.message){
        	if(strData.ret == '013' || strData.ret == '011' || strData.ret == '012'){
        		if($("#evt_endDate").val() == $("#currentTime").val().substring(0,8)){
        			alert("쿠폰이 소진되었습니다.");
        		}else{
        			alert("쿠폰이 소진되었습니다. 내일 오후 12시에 다시 만나요!");
        		}
        		
        	}else{
        		alert(strData.message);
        	}
            
        }
    },
    
    /**
     * 쿠폰 다운로드 (공통)
     */
    downCouponJson : function(cpnNo) {
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }else{
            if(typeof cpnNo == "undefined" || cpnNo == ""){
                alert("쿠폰 번호가 없습니다.");
                return;
            }
            var param = {cpnNo : cpnNo};
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/downCouponJson.do"
                    , param
                    , this._callback_downCouponJson);
        }
    },

    /**
     * 쿠폰 다운로드 callback (공통)
     */
    _callback_downCouponJson : function(strData) {
        if(strData && strData.message){
            alert(strData.message);
        }
    },

    /**
     * 이벤트 팝업 레이어 열기 (공통)
     */
    eventShowLayer : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight  / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },

    /**
     * 이벤트 팝업 레이어 닫기 (공통)
     */
    eventHideLayer : function() {
        $('.eventLayer').hide();
        $('#eventDimLayer').hide();
    },

    /**
     * SNS 공유하기 (공통)
     *
     * EVT105
     *
     * 코드 ID : 중복되지않게 설정
     * 코드명 : 기획전 순번
     * 참조1:연결링크
     * 참조2:공유제목
     * 참조3:공유이미지
     */
    shareSns : function(type, snsTitle, targetImg){
        /*
         * type 값
         * kakaotalk
         * kakaostory
         * facebook
         */
        var snsImg = $("#snsImg").val();
        var snsShareUrl = _baseUrl + "PLAN.do?dispCatNo="+$("#dispCatNo").val();

        if(targetImg == undefined || targetImg == null || targetImg == ""){
            targetImg = _fileUploadUrl+snsImg.replace(/\/\//g, '/');
        }

        if(type == "kakaostory" || type == "kakaotalk" || type == "facebook"){
            if(!mplanshop.eventDetail.initSnsYn){
                common.sns.init(targetImg, snsTitle, snsShareUrl);
                mplanshop.eventDetail.initSnsYn = true;
            }

            common.sns.doShare(type);
        }
    },

    /**
     * 2017-09-11 추석 쿠폰 선물 카카오톡 (09.12 ~ 09.17)
     */
    sendKakaotalkCouponJson : function(snsConts, targetImg, cpnNo){
        if(!mplanshop.eventDetail.checkLogin()){
            return false;
        }else{
            // SNS 공유 내용 및 이미지 설정
            mplanshop.eventDetail.snsConts = snsConts;
            mplanshop.eventDetail.snsImg = targetImg;

            var param = {cpnNo : cpnNo};
            common.Ajax.sendRequest(
                "POST"
                , _baseUrl + "event/201709/getCretCpnRndmInfo.do"
                , param
                , this._callback_sendKakaotalkCouponJson
            );
        }
    },

    /**
     * 2017-09-11 추석 쿠폰 선물 카카오톡 (09.12 ~ 09.17)
     */
    _callback_sendKakaotalkCouponJson : function(strData) {
        if(strData.ret == '0'){
            // 난수 쿠폰 발생
            var mbrNm = strData.mbrNm;
            var rndmVal = strData.rndmVal;

            // snsConts : "\n\n($1)님의 쿠폰선물 도착\n쿠폰번호 : ($2)\n올리브영 온라인 25% 할인쿠폰\n(1만원이상 최대 3,000원 / ~9/26까지)"

            var snsConts = mplanshop.eventDetail.snsConts;
            snsConts = snsConts.replace("$1", mbrNm);
            snsConts = snsConts.replace("$2", rndmVal);

            mplanshop.eventDetail.shareSns('kakaotalk', snsConts, mplanshop.eventDetail.snsImg);
        } else {
            alert(strData.message);
        }
    },

    /**
     * 2017-09-11 추석 페이백 신청 (09.12 ~ 09.17)
     */
    regPayBackEventJson : function(evtNo, dispCatNo){
        if(!mplanshop.eventDetail.checkLogin()){
            return false;
        }else{
            var param = {evtNo:evtNo,dispCatNo:dispCatNo};
            common.Ajax.sendRequest(
                "POST"
                , _baseUrl + "event/201709/regPayBackEvent.do"
                , param
                , this._callback_regPayBackEventJson
            );
        }
    },

    /**
     * 2017-09-11 추석 페이백 신청 ajax 결과 (09.12 ~ 09.17)
     */
    _callback_regPayBackEventJson : function(strData) {
        if(strData.ret == '-1'){
            mplanshop.eventDetail.checkLogin();
        } else {
            alert(strData.message);
        }
    },

    /**
     * 2017-09-11 오구오구 랜덤 쿠폰 발급 처리(09-18~09-24)
     */
    getRandomCouponJson : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            alert("모바일 APP 에서만 참여 가능합니다.");
            return;
        }
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getRandomCouponJson.do"
              , param
              , mplanshop.eventDetail._callback_getRandomCouponJson
        );
    },
    _callback_getRandomCouponJson : function(json){
        if(json.ret == "0"){
            mplanshop.eventDetail.eventShowLayer("eventLayerWinner" + json.couponInfo);
        }else if(json.ret == "013"){
            mplanshop.eventDetail.eventShowLayer("eventLayerWinner4");
        }else{
            alert(json.message);
        }
    },

    /* 2017 12월 브랜드 세일 페이백 신청(12/15~12/20) */
    addPayBack : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20171204/addPayBackJson.do"
              , param
              , mplanshop.eventDetail._callback_addPayBackJson
        );
    },

    _callback_addPayBackJson : function(json){
        if(json.ret == "0"){
            alert("적립신청되었습니다. 적립시점에 취/반품건이 있을경우 대상에서 제외됩니다.");
        }else{
            alert(json.message);
        }
    },
    /* 2017 12월 브랜드 세일 구매 고객 쿠폰(12/21~12/21) */
    getPlusDayCoupon : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            alert("모바일 앱 에서만 다운 가능합니다.");
            return;
        }
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20171204/plusOneDayCouponJson.do"
              , param
              , mplanshop.eventDetail._callback_plusOneDayCouponJson
        );
    },
    _callback_plusOneDayCouponJson : function(json){
        if(json.ret == "0"){
            alert("쿠폰이 발급되었습니다. 오늘 당일 내 사용가능합니다.");
        }else{
            alert(json.message);
        }
    },

    checkAgrmTwoInfo : function(){
        var agreeVal1 = $(':radio[name="argee1"]:checked').val();
        var agreeVal2 = $(':radio[name="argee2"]:checked').val();

        if("Y" != agreeVal1){
            alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
            return false;
        } else {
            $("#mbrInfoUseAgrYn").val("Y");
        }

        if("Y" != agreeVal2){
            alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
            return false;
        } else {
            $("#mbrInfoThprSupAgrYn").val("Y");
        }

        return true;
    },

    setDengDengStamp : function(){
        var param = {
              evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180110/setDengDengStamp.do"
              , param
              , this._callback_setDengDengStamp
        );
    },
    _callback_setDengDengStamp : function(json){
        if(json.ret=="0"){
            var sbscStampList = json.sbscStampList;
            for(var i=0; i<sbscStampList.length; i++){
                $("#lucky_pet0"+sbscStampList[i]).attr("src",mplanshop.eventDetail.petImgSrc+"lucky_pet0"+sbscStampList[i]+"_on.png");
            }
        }
    },
    setLuckyNewYearCardImg : function(){
        var changeDate = "20180117";

        var now = new Date();
        year = now.getFullYear();
        month = now.getMonth() + 1;
        date = now.getDate();
        if ((month + "").length < 2) {
            month = "0" + month;
        }
        if ((date + "").length < 2) {
                date = "0" + date;
        }

        today = year + "" + month + "" + date; //오늘날짜

        if ((eval(today) >= eval(changeDate)) ) {
            $("#luckyAfter").show();
            $("#luckyBefore").hide();
        }else{
            $("#luckyBefore").show();
            $("#luckyAfter").hide();
        }
    },

    /***********************************************************************
     *  쿠폰영역
     ***********************************************************************/
    getLuckyNewYearEveryCoupon : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        var param = {
              evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180110/getLuckyNewYearEveryCoupon.do"
              , param
              , this._callback_getLuckyNewYearCoupon
        );
    },
    getLuckyNewYearFirstBuyCoupon : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        var param = {
              evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180110/getLuckyNewYearFirstBuyCoupon.do"
              , param
              , this._callback_getLuckyNewYearCoupon
        );
    },
    getLuckyNewYearReturnMemberCoupon : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        var param = {
              evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180110/getLuckyNewYearReturnMemberCoupon.do"
              , param
              , this._callback_getLuckyNewYearCoupon
        );
    },
    _callback_getLuckyNewYearCoupon : function(json){
        alert(json.message);
    },

    /***********************************************************************
     *  응모영역
     ***********************************************************************/

    sbscLuckyEvent : function(fvrSeq,sbscType){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        if("" == $("input[id='evtNo']:hidden").val()){
            alert("이벤트 번호가 존재하지 않습니다.");
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , fvrSeq : fvrSeq
              , sbscType : sbscType
        };

        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180110/checkSbscLuckyEventYn.do"
              , param
              , this._callback_sbscLuckyEvent
        );
    },
    _callback_sbscLuckyEvent : function(json){
        if(json.ret=="0"){
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , isTermsPopupYn : "N"
                  , isType : "273"
                  , agrPopupFunction : "mplanshop.eventDetail.eventShowLayer('eventLayerPolice');"
                  , closeFunction : "mplanshop.eventDetail.eventSbscCancel();"
                  , confirmFunction : "mplanshop.eventDetail."+json.sbscType+"();"
            };
            mplanshop.eventDetail.getLayerPopAgrInfoAjax(param);
        }else{
            alert(json.message);
        }
    },
    eventSbscCancel : function(){
        var agreeVal1 = $(':radio[name="argee1"]:checked').val();
        if(agreeVal1!="Y"){
            alert("응모되지 않았습니다.");
        }
        mplanshop.eventDetail.eventHideLayer();
    },

    /* 개인정보 수신동의 레이어 */
    getLayerPopAgrInfoAjax : function(param){
        if(param.evtNo == ""){
            alert("이벤트 번호를 확인해주세요.");           return;
        }
        if(param.agrPopupFunction == ""){
            alert("약관 오픈 평션명을 확인해주세요.");        return;
        }
        if(param.closeFunction == ""){
            alert("닫기 평션명을 확인해주세요.");           return;
        }
        if(param.confirmFunction == ""){
            alert("확인 평션명을 확인해주세요.");           return;
        }

        $.ajax({
                type : "POST"
              , dataType : "html"
              , url : _baseUrl + "event/openLayerPopAgrInfoAjax.do"
              , data : param
              , success : this._callback_openLayerPopAgrInfoAjax
        });
    },
    _callback_openLayerPopAgrInfoAjax : function(html){
        $("#eventLayerPolice").html(html);
    },

    checkSbscLuckyBox : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        if(mplanshop.eventDetail.checkAgrmTwoInfo()){
            $(".eventHideLayer").click();
            var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
                      , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
            };
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20180110/checkSbscLuckyBox.do"
                  , param
                  , this._callback_checkSbscLuckyNewYear
            );
        }

    },

    setSbscLuckyNewYearStamp : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        if(mplanshop.eventDetail.checkAgrmTwoInfo()){
            $(".eventHideLayer").click();
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
                  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
            };
            common.Ajax.sendRequest(
                    "GET"
                  , _baseUrl + "event/20180110/setSbscLuckyNewYearStamp.do"
                  , param
                  , this._callback_checkSbscLuckyNewYear
            );
        }

    },

    checkSbscLuckyGift : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        if(mplanshop.eventDetail.checkAgrmTwoInfo()){
            $(".eventHideLayer").click();
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , mbrInfoUseAgrYn : $("input[id='mbrInfoUseAgrYn']:hidden").val()
                  , mbrInfoThprSupAgrYn : $("input[id='mbrInfoThprSupAgrYn']:hidden").val()
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180110/checkSbscLuckyGift.do"
              , param
              , this._callback_checkSbscLuckyNewYear
        );
        }

    },
    _callback_checkSbscLuckyNewYear : function(json){
        if(json.ret=="0"){
            alert("응모가 완료되었습니다.");
        }else{
            alert(json.message);
        }
    },

    /***********************************************************************
     *  美슐랭가이드
     *  응모하기 (이벤트 경품정보)
     *  1 : 기간내1회이상쇼핑고객
     *  2:  기간내5만원이상쇼핑고객
     *  3:  기간내10만원이상쇼핑고객
     ************************************************************************/
    checkPrizes : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 신청 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180312/checkAmtPrizes.do" // 금액 체크
                  , {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , fvrSeq : fvrSeq
                    }
                  , function(json){

                      $(':radio[name="argee1"]:checked').attr("checked", false);
                      $(':radio[name="argee2"]:checked').attr("checked", false);

                        if(json.ret == "0"){
                            $("div#Confirmlayer1").attr("onClick", "mplanshop.eventDetail.confirmPrizes('" + fvrSeq + "');");
                            //mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
                            mplanshop.eventDetail.eventShowLayerX('eventLayerPolice');
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    },
    /* 美슐랭가이드 응모처리*/
    confirmPrizes : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }

            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("신청되지 않았습니다.");
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("신청되지 않았습니다.");
                return;
            }

            mplanshop.eventDetail.eventHideLayerXEnd();

           var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : fvrSeq
                  , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180312/saveAmtPrizes.do" // 저장
                  , param
                  , mplanshop.eventDetail._callback_checkPrizesJson
            );
        }
    },
    _callback_checkPrizesJson : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            alert("신청되었습니다.");
        }else{
            alert(json.message);
        }
    },



    /***********************************************************************
     *  댕댕이 스탬프 영역
     ***********************************************************************/
    getLuckyNewYearFirstStamp : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        var param = {
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180110/getLuckyNewYearFirstStamp.do"
              , param
              , this._callback_getLuckyNewYearStamp
        );
    },

    getLuckyNewYearSecondStamp : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        var param = {
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180110/getLuckyNewYearSecondStamp.do"
              , param
              , this._callback_getLuckyNewYearStamp
        );
    },

    getLuckyNewYearThirdStamp : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        var param = {
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180110/getLuckyNewYearThirdStamp.do"
              , param
              , this._callback_getLuckyNewYearStamp
        );
    },

    _callback_getLuckyNewYearStamp :function(json){
        if(json.ret=="0"){
            //댕댕이 스탬프를 득템하셨습니다. 레이어팝업
            $('#LuckyPetDim').show();
            $('#LuckyPetLayer').show();
            $('#LuckyPet').hide();
        }else{
            alert(json.message);
        }
    },

    /*
     * 2018-01-25 설맞이 혜택 대 잔치(01-25~01-31)
     */
    setFirstYut : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180103/setFirstYutJson.do"
                  , param
                  , mplanshop.eventDetail._callback_setFirstYutJson
            );
        }
    },
    /*
     * 2018-01-25 설맞이 혜택 대 잔치(01-25~01-31)
     */
    setSecondYut : function(fvrSeq){
        mplanshop.eventDetail.eventHideLayer();

        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if(fvrSeq == ""){
                alert("잘못된 접근 입니다.");
                return;
            }
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180103/setSecondYutJson.do"
                  , param
                  , mplanshop.eventDetail._callback_setFirstYutJson
            );
        }
    },
    _callback_setFirstYutJson : function(json){
        if(json.ret == "0"){
            if(json.result == "N"){
                $("div#u_yukImg").find("img").attr("src", _cdnImgUrl + "contents/201801/25yuk/seol_mc_yuk_0" + json.fvrSeq + ".gif");
            }else{
                if(json.fvrSeq == "4"){
                    $("div#u_yukImg").find("img").attr("src", _cdnImgUrl + "contents/201801/25yuk/seol_mc_yuk_05.gif");
                }else{
                    $("div#u_yukImg").find("img").attr("src", _cdnImgUrl + "contents/201801/25yuk/seol_mc_yuk_04.gif");
                }
            }

            setTimeout("mplanshop.eventDetail.resultView('" + json.fvrName + "', '" + json.fvrSeq + "', '" + json.result + "');", 1000);
        }else if(json.ret == "054"){
            mplanshop.eventDetail.eventShowLayer('u_eventFail');
        }else{
            alert(json.message);
        }
    },
    resultView : function(fvrName, fvrSeq, result){
        if(result == "N"){
            $("span#result_Name").text("'" + fvrName + "'");

            $("img#result_Img").attr("src", _cdnImgUrl  + "contents/201801/25yuk/seol_imgyuk_" + fvrSeq + ".gif");
            $("img#result_Coupon").attr("src", _cdnImgUrl  + "contents/201801/25yuk/seol_imgcoupon_" + fvrSeq + ".gif");

            mplanshop.eventDetail.eventShowLayer('u_eventWinner');
        }else{
            if(fvrSeq == "4"){
                $("span#result_Name").text("'모'");
                $("img#result_Img").attr("src", _cdnImgUrl  + "contents/201801/25yuk/seol_imgyuk_5.gif");
            }else{
                $("span#result_Name").text("'윷'");
                $("img#result_Img").attr("src", _cdnImgUrl  + "contents/201801/25yuk/seol_imgyuk_4.gif");
            }
            $("a#result_Link").attr("href", "javaScript:mplanshop.eventDetail.setSecondYut(" + fvrSeq + ");");

            mplanshop.eventDetail.eventShowLayer('u_eventAgain');
        }
    },

    /***********************************************************************
     *  2018.02.01 설 선물 판촉 2차 프로모션
     ***********************************************************************/
    //20%/18% 복주머니 할인쿠폰
    setFortuneRotateJson : function(){
        if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
            if(!confirm("모바일 APP 에서만 참여 가능합니다. 모바일 APP으로 실행하시겠습니까?")){
                return false;
            }else{

                var dispCatNo = $("#dispCatNo").val();
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=planshop/getPlanShopDetail.do?dispCatNo="+dispCatNo);
            }

            return;
        }
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        var param = {
                dispCatNo : $("#dispCatNo").val()
                , evtNo : $("#evtNo").val()
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180201/setFortuneRotateJson.do"
              , param
              , this._callback_setFortuneRotateJson
        );
    },
    _callback_setFortuneRotateJson :function(json){
        if(json.ret=="0"){
            $("#eventTouchImg").attr("src",_cdnImgUrl+"contents/201802/01happy/happy_win_0"+json.fvrSeq+".png");
            mplanshop.eventDetail.eventShowLayer('u_eventTouch');
        }else if(json.ret=="004"){
            mplanshop.eventDetail.eventShowLayer('u_eventFail');
        }else{
            alert(json.message);
        }
    },
    //설날 선물세트 누적금액 확인
    checkDispCateOrdPayAmtJson : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        var param = {
                dispCatNo : $("#dispCatNo").val()
                , evtNo : $("#evtNo").val()
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180201/checkDispCateOrdPayAmtJson.do"
              , param
              , this._callback_checkDispCateOrdPayAmtJson
        );
    },
    _callback_checkDispCateOrdPayAmtJson :function(json){
        if(json.ret=="0"){
            mplanshop.eventDetail.setSbscGiftBuyPointJson();
        }else{
            alert(json.message);
        }
    },
    //설날 선물세트 응모
    setSbscGiftBuyPointJson : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        var param = {
                dispCatNo : $("#dispCatNo").val()
                , evtNo : $("#evtNo").val()
        };
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20180201/setSbscGiftBuyPointJson.do"
              , param
              , this._callback_setSbscGiftBuyPointJson
        );
    },
    _callback_setSbscGiftBuyPointJson :function(json){
        alert(json.message);
    },



    /********************
     * 2018-02-08 2월 온라인mkt 2월엔 더블 혜택 프로모션
     *****************/
    /* 더블혜택 개인정보 수신 동의 팝업 */
    addDoublePopLayerAgrInfo : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if($("input[name='ChckName']:radio:checked").val() == "" || $("input[name='ChckName']:radio:checked").val() == undefined){
                alert("아이템 선택 후 응모 가능합니다.");
                return;
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180202/checkDoubleJson.do"
                  , {
                        evtNo : $("input[id='evtNo']:hidden").val()
                    }
                  , function(json){
                        if(json.ret == "0"){
                            mplanshop.eventDetail.eventShowLayerX('eventLayerPolice');
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    },
    /* 더블혜택 이벤트 응모 */
    addDouble : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if($("input[name='ChckName']:radio:checked").val() == "" || $("input[name='ChckName']:radio:checked").val() == undefined){
                alert("아이템 선택 후 응모 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }

            mplanshop.eventDetail.eventHideLayerXEnd();

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : $("input[name='ChckName']:radio:checked").val()
                  , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180202/addDoubleJson.do"
                  , param
                  , mplanshop.eventDetail._callback_addDoubleJson
            );
        }
    },
    _callback_addDoubleJson : function(json){
        if(json.ret == "0"){
            if(json.winYn == "Y"){
                $("img#resultImg").attr("src", _cdnImgUrl + "contents/201802/19double/double_win_" + json.fvrSeq + ".png");
            }else{
                $("img#resultImg").attr("src", _cdnImgUrl + "contents/201802/19double/double_fail.png");
            }
            mplanshop.eventDetail.eventShowLayer("eventLayerWinner");
        }else{
            alert(json.message);
        }
    },
    /* 드블혜택 이밴트 당첨 내역 */
    getDoubleMyResultList : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180202/getDoubleMyResultListJson.do"
              , param
              , mplanshop.eventDetail._callback_getDoubleMyResultListJson
        );
    },
    _callback_getDoubleMyResultListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length > 0){
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }

                $("tbody#myWinListHtml").html(myWinListHtml);
            }

            mplanshop.eventDetail.eventShowLayer('eventLayerWinDetail');
        }else{
            alert(json.message);
        }
    },
    /* 첫구매 응모 체크 */
    checkNewOrder : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("올리브영 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180202/checkNewOrderJson.do"
                  , {
                        evtNo : $("input[id='evtNo']:hidden").val()
                    }
                  , function(json){
                        if(json.ret == "0"){
                            mplanshop.eventDetail.eventShowLayerX('eventLayerPolice2');
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    },
    /* 첫구매 응모 */
    addNewOrder : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if("Y" != $(':radio[name="argee3"]:checked').val()){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee4"]:checked').val()){
                alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }

            mplanshop.eventDetail.eventHideLayerXEnd();

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , mbrInfoUseAgrYn : $(':radio[name="argee3"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee4"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180202/addNewOrderJson.do"
                  , param
                  , mplanshop.eventDetail._callback_addNewOrderJson
            );
        }
    },
    _callback_addNewOrderJson : function(json){
        if(json.ret == "0"){
            alert("신청되었습니다.");
        }else{
            alert(json.message);
        }
    },
    /*********************************************
     * 개인정보 위수탁 닫기시 알럿 표시용
     *********************************************/
    eventShowLayerX : function(obj) {
        var layObj = document.getElementById(obj);
        var layDim = document.getElementById('eventDimLayer2');
        layDim.style.display = 'block';
        layObj.style.display = 'block';
        var layObjHeight = layObj.clientHeight / 2;
        layObj.style.marginTop = "-" + layObjHeight +"px";
    },
    eventHideLayerX : function() {
        alert($("input[name='closeMsgTxt']:hidden").val());

        $('.eventLayer').hide();
        $('#eventDimLayer2').hide();
    },
    eventHideLayerXEnd : function() {
        $('.eventLayer').hide();
        $('#eventDimLayer2').hide();
    },

    /********************************************************
     * 3월 올롸잇 위크 프로모션-화장대 채우고 뷰티박스 GET!
     ********************************************************/
    //뷰티템 힌트보기
    getStampHintJson : function(){
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180301/getStampHintJson.do"
              , {}
              , this._callback_getStampHintJson
        );
    },
    _callback_getStampHintJson : function(json){
        $("#beautyHintImg").attr("src",_cdnImgUrl+"contents/201803/01allright/hint_0"+json.ref3val+".png");
    },
    //내가 찾은 뷰티템 노출
    getConrStampListJson : function(){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180301/getConrStampListJson.do"
              , param
              , this._callback_getConrStampListJson
        );
    },
    _callback_getConrStampListJson : function(json){
        if(json.ret=="0"){
            var searchStampList = json.searchStampList;
            if(searchStampList != null && searchStampList !=""){
                for(var i=0; i<searchStampList.length; i++){
                    $("#stamp_"+searchStampList[i]).addClass("on");
                }
            }

            $("#searchStampCnt").removeClass();
            $("#searchStampCnt").addClass("no_"+json.searchStampCnt);
            $("#sbscAbleStampCnt").removeClass();
            $("#sbscAbleStampCnt").addClass("no_"+json.sbscAbleStampCnt);
            $("#sbscStampCnt").removeClass();
            $("#sbscStampCnt").addClass("no_"+json.sbscStampCnt);

            mplanshop.eventDetail.sbscStampCnt = json.sbscStampCnt;
            mplanshop.eventDetail.sbscAbleStampCnt = json.sbscAbleStampCnt;

        }else{
            alert(json.message);
        }
    },

    beautyBoxPopLayerAgrInfo :function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }

            if(mplanshop.eventDetail.sbscAbleStampCnt <= 0){
                var winnerUrl = _cdnImgUrl+"contents/201803/01allright/";
                $("#resultImg").attr("src",winnerUrl+"result_fail2.png");
                mplanshop.eventDetail.eventShowLayer("eventLayerWinner");
                return;
            }
            var date = new Date();

            var month = date.getMonth()+1;
            var day = date.getDate();

            var today = ""
            if(month <10) {
                today = today+"0"+month;
            }else{
                today = today+month;
            }
            if(day <10){
                today = today+"0"+day;
            }else{
                today = today+day;
            }
            if($("input[name='fvrSeq']:checked").val() == undefined
                    || $("input[name='fvrSeq']:checked").val() == null
                    || $("input[name='fvrSeq']:checked").val() == ""){
                alert("뷰티템을 선택해주세요.")
                return;
            }
            if($("#beaytyBoxSbscDay").val()!=today){
                alert("3월 8일에 응모 가능합니다.");
                return;
            }
            //응모한 횟수가 0 이상이면 약관동의 pass
            if(mplanshop.eventDetail.sbscStampCnt > 0){
                mplanshop.eventDetail.setSbscBeautyBoxJson();
            }else{
                mplanshop.eventDetail.eventShowLayerX('eventLayerPolice');
            }
        }
    },

    setSbscBeautyBoxJson : function(){

        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        if($("input[name='fvrSeq']:checked").val() == undefined
                || $("input[name='fvrSeq']:checked").val() == null
                || $("input[name='fvrSeq']:checked").val() == ""){
            alert("뷰티템을 선택해주세요.")
            return;
        }

        var mbrInfoUseAgrYn = "N";
        var mbrInfoThprSupAgrYn = "N";

        if(mplanshop.eventDetail.sbscStampCnt > 0){
            mbrInfoUseAgrYn = "Y";
            mbrInfoThprSupAgrYn = "Y";
        }else{
            var agreeVal1 = $(':radio[name="argee1"]:checked').val();
            var agreeVal2 = $(':radio[name="argee2"]:checked').val();

            if("Y" != agreeVal1){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            } else {
                mbrInfoUseAgrYn = "Y";
            }

            if("Y" != agreeVal2){
                alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return false;
            } else {
                mbrInfoThprSupAgrYn = "Y";
            }
        }

        mplanshop.eventDetail.eventHideLayerXEnd();

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                , fvrSeq : $("input[name='fvrSeq']:checked").val()
                , sbscSgtEndDt : $("#beaytyBoxSbscDay").val()
                , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                , mbrInfoThprSupAgrYn :  mbrInfoThprSupAgrYn
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180301/setSbscBeautyBoxJson.do"
              , param
              , this._callback_setSbscBeautyBoxJson
        );

    },
    _callback_setSbscBeautyBoxJson : function(json){
        var winnerUrl = _cdnImgUrl+"contents/201803/01allright/";
        var winnerImg = "result_space.png";
        if(json.ret=="0"){
            if(json.winYn=="Y"){
                if(json.fvrSeq=="9"){
                    winnerImg = "result_win02.png";
                }else if(json.fvrSeq=="10"){
                    winnerImg = "result_win03.png";
                }else if(json.fvrSeq=="11"){
                    winnerImg = "result_win04.png";
                }else if(json.fvrSeq=="12"){
                    winnerImg = "result_win01.png";
                }
                $("#resultImg").attr("src",winnerUrl+winnerImg);
            }else{
                $("#resultImg").attr("src",winnerUrl+"result_fail.png");
            }

            $("#searchStampCnt").removeClass();
            $("#searchStampCnt").addClass("no_"+json.searchStampCnt);
            $("#sbscAbleStampCnt").removeClass();
            $("#sbscAbleStampCnt").addClass("no_"+json.sbscAbleStampCnt);
            $("#sbscStampCnt").removeClass();
            $("#sbscStampCnt").addClass("no_"+json.sbscStampCnt);

            mplanshop.eventDetail.sbscStampCnt = json.sbscStampCnt;
            mplanshop.eventDetail.sbscAbleStampCnt = json.sbscAbleStampCnt;

            mplanshop.eventDetail.eventShowLayer("eventLayerWinner");

        }else if(json.ret=="004"){
            $("#resultImg").attr("src",winnerUrl+"result_fail2.png");
            mplanshop.eventDetail.eventShowLayer("eventLayerWinner");
        }else{
            alert(json.message);
        }
    },

    /* 당첨내역 확인 */
    getStmpMyWinList : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
        }
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/getStmpMyWinListJson.do"
              , param
              , this._callback_getStmpMyWinListJson
        );
    },
    _callback_getStmpMyWinListJson : function(json){
        if(json.ret == "0"){
            var myWinListHtml = "";
            if(json.myEvtWinList.length <= 0){
                myWinListHtml = "<tr><td colspan='2'>당첨이력이 없습니다.</td></tr>";
            }else{
                for(var i=0 ; i<json.myEvtWinList.length ; i++){
                    myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
                }

            }

            $("tbody#myWinListHtml").html(myWinListHtml);
            mplanshop.eventDetail.eventShowLayer('eventLayerWinDetail');
        }else{
            alert(json.message);
        }
    },





    /***********************************************
     * 2018.03 구매금액별 사은품
     ***********************************************/
    /* 구매 금액별 응모가능 여부 체크 */
    checkAmtEvt : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if(fvrSeq == "" || fvrSeq == undefined){
                alert("아이템 정보를 확인하세요.");
                return;
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180301/checkAmtEvtJson.do"
                  , {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , fvrSeq : fvrSeq
                    }
                  , function(json){
                        if(json.ret == "0"){
                            $("div#Confirmlayer").attr("onClick", "mplanshop.eventDetail.addAmtEvt('" + fvrSeq + "');");
                            mplanshop.eventDetail.eventShowLayerX('eventLayerPolice');
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    },
    /* 구매 금액별 응모 처리 */
    addAmtEvt : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if(fvrSeq == "" || fvrSeq == undefined){
                alert("아이템 정보를 확인하세요.");
                return;
            }
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }

            mplanshop.eventDetail.eventHideLayerXEnd();

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : fvrSeq
                  , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180301/addAmtEvtJson.do"
                  , param
                  , mplanshop.eventDetail._callback_addAmtEvtJson
            );
        }
    },
    _callback_addAmtEvtJson : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            alert("혜택 신청 완료 되었습니다.");
        }else{
            alert(json.message);
        }
    },
    /* 기간내 구매 고객 체크 */
    checkAllOrderEvt : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180301/checkAllOrderEvtJson.do"
                  , {
                        evtNo : $("input[id='evtNo']:hidden").val()
                    }
                  , function(json){
                        if(json.ret == "0"){
                            $("div#Confirmlayer").attr("onClick", "mplanshop.eventDetail.addAllOrderEvt();");
                            mplanshop.eventDetail.eventShowLayerX('eventLayerPolice');
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    },
    /* 기간내 구매 고객 참여 처리 */
    addAllOrderEvt : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }

            mplanshop.eventDetail.eventHideLayerXEnd();

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180301/addAllOrderEvtJson.do"
                  , param
                  , mplanshop.eventDetail._callback_addAllOrderEvtJson
            );
        }
    },
    _callback_addAllOrderEvtJson : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);

            alert("신청되었습니다.");
        }else{
            alert(json.message);
        }
    },
    /***********************************************
     * 2018.03 구매금액별 사은품
     ***********************************************/

    /***********************************************
     * 2018.03 첫 구매 100% 혜택
     ***********************************************/
    /* 첫 구매 응모 조건 체크 */
    checkNewOrderMar : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if($("input[name='ChckName']:radio:checked").val() == "" || $("input[name='ChckName']:radio:checked").val() == undefined){
                alert("아이템 선택 후 응모 가능합니다.");
                return;
            }
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180301/checkNewOrderMarJson.do"
                  , {
                        evtNo : $("input[id='evtNo']:hidden").val()
                      , fvrSeq : $("input[name='ChckName']:radio:checked").val()
                    }
                  , function(json){
                        if(json.ret == "0"){
                            mplanshop.eventDetail.eventShowLayerX('eventLayerPolice');
                        }else{
                            alert(json.message);
                        }
                    }
            );
        }
    },
    /* 첫 구매 응모 처리 */
    addNewOrderMar : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if($("input[name='ChckName']:radio:checked").val() == "" || $("input[name='ChckName']:radio:checked").val() == undefined){
                alert("아이템 선택 후 응모 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee1"]:checked').val()){
                alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }
            if("Y" != $(':radio[name="argee2"]:checked').val()){
                alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
                return;
            }

            mplanshop.eventDetail.eventHideLayerXEnd();

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : $("input[name='ChckName']:radio:checked").val()
                  , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180301/addNewOrderMarJson.do"
                  , param
                  , mplanshop.eventDetail._callback_addNewOrderMarJson
            );
        }
    },
    _callback_addNewOrderMarJson : function(json){
        if(json.ret == "0"){
            alert("첫 구매 혜택 신청 완료되셨습니다.");
        }else{
            alert(json.message);
        }
    },
    /***********************************************
     * 2018.03 첫 구매 100% 혜택
     ***********************************************/

    /***********************************************
     * 2018.03 올롸잇 구매 쿠폰
     ***********************************************/
    getAllrightOrdCoupon : function(fvrSeq){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            if(fvrSeq == "" || fvrSeq == undefined){
                alert("잘못된 쿠폰 선택 입니다.");
                return;
            }
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , fvrSeq : fvrSeq
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180301/getAllrightOrdCouponJson.do"
                  , param
                  , mplanshop.eventDetail._callback_getAllrightOrdCouponJson
            );
        }
    },
    _callback_getAllrightOrdCouponJson : function(json){
        if(json.ret == "0"){
            alert("쿠폰이 발급되었습니다. 오늘 당일 내 사용가능합니다.");
        }else{
            alert(json.message);
        }
    },
    /***********************************************
     * 2018.03 올롸잇 구매 쿠폰
     ***********************************************/

    /***********************************************
     * 2018.07 우천이벤트
     ***********************************************/

    checkMove : function(num){
        var index = num;  // -2
        var _temaSoting_h = $('.temaSoting').height();
        $(".temaBox").show();
        $(".temaSoting option:eq(" + num +")").prop("selected",true);

        //전체보기가 아닌 경우
        if(index > -1){
            var row1 = index-1 ;
            $(".temaBox :not(:eq(" + row1 + "))").hide();
        }

      //기획전 상단 스크롤 공백 제거
        var offset = $("#move1").offset().top;

        $('html, body').scrollTop(offset);
        //$('html, body').animate({scrollTop : offset.top});
        //document.getElementById('move1').scrollIntoView();
        $('.temaBox').eq(num-1).css('margin-top', _temaSoting_h);
    },


    addBuyStampCouponOrderEvent : function() {
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val(),
                cpnNo : $("input[id='cpnNo']:hidden").val()
        };
        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180701/addBuyStampCouponOrder.do"
              , param
              , mplanshop.eventDetail._callback_addBuyStampCouponOrder
        );
    },

    _callback_addBuyStampCouponOrder : function(json){
        if(json.ret == "0"){
            if(json.couponCnt >= 1 ) {
                for(var  i=0; i<json.couponCnt; i++){
                    //alert(json.couponCnt);
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/01rainy/rainy_stamp_on.png' alt='쿠폰사용'>";
                    $("li#eDay2").find("span#stamp"+i+"").html(htmlStr);
                }
            }else{
                for(var  i=0; i<3; i++){
                    var htmlStr = "";
                    htmlStr =  "<img src='"+_cdnImgUrl + "contents/201807/01rainy/rainy_stamp_off.png' alt='쿠폰미사용'>";
                    $("li#eDay2").find("span#stamp"+i+"").html(htmlStr);
                }
            }
        }else{
            alert(json.message);
        }
    },

    //온라인몰 구매고객 응모하기
    applyOnlineJson : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180701/applyOnlineJson.do"
              , {
                    evtNo : $("input[id='evtNo']:hidden").val(),
                    cpnNo : $("input[id='cpnNo']:hidden").val()
                }
              , function(json){
                  $(':radio[name="argee1"]:checked').attr("checked", false);
                  $(':radio[name="argee2"]:checked').attr("checked", false);
                    if(json.ret == "0"){
                        var type = "A";
                        $("div#Confirmlayer1").attr("onClick", "mplanshop.eventDetail.confirmAddline('" + type + "');");
                        mplanshop.eventDetail.eventShowLayerX('eventLayerPolice');
                        $(".agreeCont").scrollTop(0);  // 상단이동
                    }else{
                        alert(json.message);
                    }
                }
        );
    },

    confirmAddline : function(type) {

        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        if("Y" != $(':radio[name="argee1"]:checked').val()){
            mplanshop.eventDetail.eventHideLayerX();
            return;
        }
        if("Y" != $(':radio[name="argee2"]:checked').val()){
            mplanshop.eventDetail.eventHideLayerX();
            return;
        }

        mplanshop.eventDetail.eventHideLayerXEnd();

        if(type == "A" ) {
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , cpnNo : $("input[id='cpnNo']:hidden").val()
                  , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180701/addOnlineJson.do"
                  , param
                  , mplanshop.eventDetail._callback_addOnlineJson
            );
        }else {
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                  , mbrInfoUseAgrYn : $(':radio[name="argee1"]:checked').val()
                  , mbrInfoThprSupAgrYn : $(':radio[name="argee2"]:checked').val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20180701/addOfflineJson.do"
                  , param
                  , mplanshop.eventDetail._callback_addOfflineJson
            );
        }

    },

    _callback_addOnlineJson : function(json){
        if(json.ret == "0"){
            alert("응모되었습니다.");
        }else{
            alert(json.message);
        }
    },

    _callback_addOfflineJson : function(json){
        if(json.ret == "0"){
            alert("응모되었습니다. 9/7일 당첨자게시판에서 확인해주세요!");
        }else{
            alert(json.message);
        }
    },

    //오프라인 구매고객 응모하기
    applyOfflineJson : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20180701/applyOfflineJson.do"
              , {
                    evtNo : $("input[id='evtNo']:hidden").val(),
                }
              , function(json){
                  $(':radio[name="argee1"]:checked').attr("checked", false);
                  $(':radio[name="argee2"]:checked').attr("checked", false);
                    if(json.ret == "0"){
                        var type = "B";
                        $("div#Confirmlayer1").attr("onClick", "mplanshop.eventDetail.confirmAddline('" + type + "');");
                        mplanshop.eventDetail.eventShowLayerX('eventLayerPolice');
                        $(".agreeCont").scrollTop(0);  // 상단이동
                    }else{
                        alert(json.message);
                    }
                }
        );
    },

    /**
     * 기능 : 수험생 대박기원! 30% 쿠폰 발급
     */
    chkDownCoupon30 : function(obj){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            // coupon download
            mplanshop.eventDetail.downCouponAgeCheckJson(obj);
        }
    },

    downCouponAgeCheckJson : function(obj){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{

                /**수험생
                 * DEV : C000000000333    g0CzCBI3VCZCxSHONYoyQA==
                 * QA : C000000004935   g0CzCBI3VCYrekPX/CKdAw==
                 * PRD : C000000006553   g0CzCBI3VCaV45tZgfYxbA==
                 * */

                var cpnNo30 = obj;

                //ageCheck : 1998 ~ 2000 년생 true
                var param = {
//                        evtNo : $("input[id='evtNo']:hidden").val()
                        sYear : mplanshop.eventDetail.sYear
                        , eYear : mplanshop.eventDetail.eYear
                        , dispCatNo : $("input[id='dispCatNo']:hidden").val()
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20181112/downCouponAgeCheckJson.do"
                        , param
                        , function(json){
                            if(json.ret == "0"){
                                if(json.isAgeChk=="0"){
                                    // 여기는 ...한번 더 체크함.
                                    if(eval(mplanshop.eventDetail.sYear) <=eval(json.birthYear) && eval(mplanshop.eventDetail.eYear) >=eval(json.birthYear)){
                                        //1998년 ~ 2000년 생 맞는 경우
                                        mplanshop.eventDetail.downCouponJson30(cpnNo30);
                                    }else{
                                        //1998년 ~ 2000년 생 아닌 경우
                                        alert("해당 쿠폰은 회원정보 기준 1998년 ~ 2000년 고객 대상 발급 쿠폰입니다.");
                                    }
                                }else{
                                    //1998년 ~ 2000년 생 아닌 경우
//                                    alert("해당 쿠폰은 회원정보 기준 1998년 ~ 2000년 고객 대상 발급 쿠폰입니다.");
                                    alert(json.message);
                                }
                            }else{
                                alert(json.message); //회원정보 내 생년월일 미입력 회원입니다.
                            }
                        }
                );
            }
        }
    },

    /*
     * 기능 : 쿠폰  다운로드
     * 쿠폰 : 수험생 대박기원! 30% 쿠폰 발급
     * “모바일 앱에서만 다운 가능한 쿠폰입니다.”알럿>확인>앱분기>취소>알럿 닫고 페이지 유지
     */
    downCouponJson30 : function(cpnNo30) {
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                if(typeof "undefined" == cpnNo30 || "" == cpnNo30){
                    alert("쿠폰 번호가 없습니다.");
                    return;
                }
                var param = {cpnNo : cpnNo30};
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
        if(strData && strData.message){
            alert(strData.message);
        }
    },

    /**
     * 배포일자 : 2018.12.27
     * 오픈일자 : 2019.01.01
     * 이벤트명 : 꿈 꾸는 대로 다 돼지
     * 기능 : 쿠폰 다운로드 기능 시작
     */
    downCouponAbleCheckJson : function(obj){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{

                var cpnStep = obj; //쿠폰 단계

                if("1" == cpnStep){

                    //step 1 인 경우 바로 다운로드 처리
                    var cpnNoTemp1 = $("input[id='cpnNo1']:hidden").val();
                    mplanshop.eventDetail.downAppCouponEventJson(cpnNoTemp1);

                }else if("2" == cpnStep){

                    //step 2 인 경우 1 쿠폰 사용 여부 체크
                    var cpnNoTemp1 = $("input[id='cpnNo1']:hidden").val();
                    mplanshop.eventDetail.planshopCpnUseYnChk2(cpnNoTemp1, 2);

                }else if("3" == cpnStep){

                    //step 3 인 경우 1, 2 쿠폰 사용 여부 체크
                    mplanshop.eventDetail.planshopCpnUseYnChk3(cpnStep);
                }
            }
        }
    },


    /**
     * 배포일자 : 2018.12.27
     * 오픈일자 : 2019.01.01
     * 이벤트명 : 꿈 꾸는 대로 다 돼지
     * 기능 : 쿠폰 다운로드 기능 2
     */
    //0. 기획전 일 때 쿠폰 사용 여부 확인 function
    planshopCpnUseYnChk2 : function(obj, cpnStep){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{

                var couponNo=obj;
                var cpnNoTemp2=$("input[id='cpnNo2']:hidden").val();
                var cpnNoTemp3=$("input[id='cpnNo3']:hidden").val();

                var param = {
                        dispCatNo : $("input[id='dispCatNo']:hidden").val()
                        ,evtNo : $("input[id='evtNo']:hidden").val()
                        ,cpnNo : couponNo
                        ,cpnStep : cpnStep
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20190101_1/planshopCpnUseYnChk.do"
                        , param
                        , function(json){

                            var cpnUseYn = json.cpnUseYn; //1 사용안함(N), 0 사용함(Y) or 쿠폰없음

                            if(json.ret == "0"){
                                if("Y" == cpnUseYn && "2" == cpnStep){
                                    //2번 쿠폰 받으려고 할 때 1번 쿠폰 사용 유무가 Y인 경우
                                    mplanshop.eventDetail.downAppCouponEventJson(cpnNoTemp2);

                                }else if("Y" == cpnUseYn && "3" == cpnStep){
                                    //3번 쿠폰 받으려고 할 때 2번 쿠폰 사용 유무가 Y인 경우
                                    mplanshop.eventDetail.downAppCouponEventJson(cpnNoTemp3);

                                }else if("N" == cpnUseYn && "2" == cpnStep){
                                    //2번 쿠폰 받으려고 할 때 1번 쿠폰 사용 유무가 N인 경우
                                    alert("1단계 쿠폰 사용 고객만 발급 가능합니다.");
                                    return;

                                }else if("N" == cpnUseYn && "3" == cpnStep){

                                    //3번이 발급이 되어버린 경우가 있음
                                    mplanshop.eventDetail.cpnIssuedChk(cpnNoTemp3);
                                    //3번 쿠폰 받으려고 할 때 2번 쿠폰 사용 유무가 N인 경우
//                                    alert("1단계, 2단계 쿠폰 사용 고객만 발급 가능합니다.");
//                                    return;
                                }

                            }else{
                                alert(json.message);
                            }
                        }
                );
            }
        }
    },

    /**
     * 배포일자 : 2018.12.27
     * 오픈일자 : 2019.01.01
     * 이벤트명 : 꿈 꾸는 대로 다 돼지
     * 기능 : 쿠폰 다운로드 기능 3
     */
    //0. 기획전 일 때 쿠폰 사용 여부 확인 function
    planshopCpnUseYnChk3 : function(cpnStep){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{

                var cpnNoTemp1=$("input[id='cpnNo1']:hidden").val(); //1번 쿠폰 사용 유무
                var cpnNoTemp2=$("input[id='cpnNo2']:hidden").val(); //2번 쿠폰 사용 유무
                var cpnNoTemp3=$("input[id='cpnNo3']:hidden").val(); //2번 쿠폰 사용 유무

                var param = {
                        dispCatNo : $("input[id='dispCatNo']:hidden").val()
                        ,evtNo : $("input[id='evtNo']:hidden").val()
                        ,cpnNo : cpnNoTemp1
                        ,cpnStep : cpnStep //3
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20190101_1/planshopCpnUseYnChk.do"
                        , param
                        , function(json){

                            var cpnUseYn = json.cpnUseYn; //1 사용안함(N), 0 사용함(Y) or 쿠폰없음

                            if(json.ret == "0"){
                                if("Y" == cpnUseYn){
                                    //1번 쿠폰 사용 유무 확인 후 사용 했다면 2번 쿠폰 사용 유무로 넘어감.
                                    mplanshop.eventDetail.planshopCpnUseYnChk2(cpnNoTemp2, 3);

                                }else if("N" == cpnUseYn){ //1번 쿠폰 사용 하지 않은 경우.

                                    //3번 쿠폰 발급 유무를 확인
                                    mplanshop.eventDetail.cpnIssuedChk(cpnNoTemp3);
                                    //발급된 경우 : 이미 발급되었습니다.
                                    //발급되지 않은 경우 : 1,2 단계 사용 고객만 발급 가능합니다.

//                                    alert("1단계, 2단계 쿠폰 사용 고객만 발급 가능합니다.");
//                                    return;
                                }

                            }else{
                                alert(json.message);
                            }
                        }
                );
            }
        }
    },

    /**
     * 배포일자 : 2018.12.27
     * 오픈일자 : 2019.01.01
     * 이벤트명 : 꿈 꾸는 대로 다 돼지
     * 기능 : 쿠폰 발급 여부 확인
     */
    cpnIssuedChk : function(cpnNo){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                var param = {
                        dispCatNo : $("input[id='dispCatNo']:hidden").val()
                        ,evtNo : $("input[id='evtNo']:hidden").val()
                        ,cpnNo : cpnNo
                };
                common.Ajax.sendRequest(
                        "GET"
                        , _baseUrl + "event/20190101_1/cpnIssuedChk.do"
                        , param
                        , function(json){

                            var cpnUseYn = json.cpnUseYn;

                            if(json.ret == "0"){
                                if("Y" == cpnUseYn){

                                    alert("이미 지급된 쿠폰입니다.");
                                    return;

                                }else{
                                    alert("1단계, 2단계 쿠폰 사용 고객만 발급 가능합니다.");
                                    return;
                                }
                            }else{
                                alert(json.message);
                            }
                        }
                );
            }
        }
    },

    pointEntry : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,dispCatNo : $("input[id='dispCatNo']:hidden").val()
        };

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190101_1/pointEntry.do"
              , param
              , mplanshop.eventDetail._callback_pointEntryJson
        );
    },
    _callback_pointEntryJson : function(json){
        if(json.ret == "0"){
            alert("신청되었습니다.");
        }else{
            alert(json.message);
        }
    },

    eventShowLayScroll: function(obj) {
        var _winHeight = $(window).height(),
            _layObj = $('#'+obj),
            _layObjHeight = _layObj.height(),
            _layObjTop = _layObj.height()/2,
            _layDim = $('#eventDimLayer');
        if(_layObjHeight >= _winHeight){
            var _layObjInner = _layObj.find('.conts_inner');
            var _layObjInHeight = _winHeight-112;
            _layObjInner.css({'max-height': _layObjInHeight});
            _layObjTop = $('#'+obj).height()/2;
        }
        _layDim.show();
        _layObj.css({'margin-top': -_layObjTop}).show();
    },

    /**
     * 배포일자 : 2018.12.27
     * 오픈일자 : 2019.01.01
     * 이벤트명 : 첫구매재구매 단골 고객님 스페셜 혜택존
     * 기능 : 전월 1회 구매시 3000원 할인
     */
    downCpnRepurchaseMonthBuy1 : function(obj){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                //전월 1회 구매 확인
                var param = {
                        dispCatNo : $("input[id='dispCatNo']:hidden").val()
                        ,evtNo : $("input[id='evtNo']:hidden").val()
                        ,evtStrtDt : "20181201"
                        ,evtEndDt : "20181231"
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "event/20190101_3/downCpnRepurchaseCnt.do"
                        , param
                        , mplanshop.eventDetail._callback_downCpnRepurchaseMonthBuy1
                );
            }
        }
    },

    _callback_downCpnRepurchaseMonthBuy1 : function(json){
        if(json.ret == "0"){
            var purchaseCount = parseInt(json.totalOrdCnt);
            var cpnNoMonth_1 = $("#cpnNo1").val(); //쿠폰번호

            if(purchaseCount == 1){
                //전월 1회 구매 쿠폰 발급 가능
                mplanshop.eventDetail.downAppCouponEventJson(cpnNoMonth_1);
            }else{
                alert("혜택 대상이 아닙니다. 온라인몰에서 전월 1회 구매 고객만 발급 가능합니다.");
            }
        }else{
            alert(json.message);
        }
    },

    /**
     * 배포일자 : 2018.12.27
     * 오픈일자 : 2019.01.01
     * 이벤트명 : 첫구매재구매 단골 고객님 스페셜 혜택존
     * 기능 : 전월 2회 이상 구매시 4000원 할인
     */
    downCpnRepurchaseMonthBuy2 : function(obj){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                //전월 2회이상 구매 확인
                var param = {
                        dispCatNo : $("input[id='dispCatNo']:hidden").val()
                        ,evtNo : $("input[id='evtNo']:hidden").val()
                        ,evtStrtDt : "20181201"
                        ,evtEndDt : "20181231"
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "event/20190101_3/downCpnRepurchaseCnt.do"
                        , param
                        , mplanshop.eventDetail._callback_downCpnRepurchaseMonthBuy2
                );
            }
        }
    },

    _callback_downCpnRepurchaseMonthBuy2 : function(json){
        if(json.ret == "0"){
            var purchaseCount = parseInt(json.totalOrdCnt);
            var cpnNoMonth_2 = $("#cpnNo2").val(); //1, 2

            if(purchaseCount > 1){
                //전월 2회 구매 쿠폰 발급 가능
                mplanshop.eventDetail.downCouponJson(cpnNoMonth_2);
            }else{
               // "혜택 대상이 아닙니다. 온라인몰에서 전월 2회이상 구매 고객만 발급 가능합니다."
                alert("혜택 대상이 아닙니다. 온라인몰에서 전월 2회이상 구매 고객만 발급 가능합니다.");
            }
        }else{
            alert(json.message);
        }
    },

    /**
     * 기능 : 특정기간동안 구매횟수, 구매금액 조회
     */
    getPayAmtInEvtDay : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                //기간내 구매금액 구매횟수 확인
                var param = {
                        dispCatNo : $("input[id='dispCatNo']:hidden").val()
                        ,evtNo : $("input[id='evtNo']:hidden").val()
                        ,evtStrtDt : $("input[id='evtStrtDt']:hidden").val()
                        ,evtEndDt : $("input[id='evtEndDt']:hidden").val()
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "event/getPayAmtInEvtDay.do"
                        , param
                        , mplanshop.eventDetail._callback_getPayAmtInEvtDay
                );
            }
        }
    },

    _callback_getPayAmtInEvtDay : function(json){
        if(json.ret == "0"){
            var totalOrdCnt = parseInt(json.totalOrdCnt);
            var cpnNo = $("input[id='cpnNo']:hidden").val(); //쿠폰번호

            if(totalOrdCnt > 0){
                //전월 1회 구매 쿠폰 발급 가능
                mplanshop.eventDetail.downAppCouponEventJson(cpnNo);
            }else{
                alert($("input[id='evtMsg']:hidden").val());
            }
        }else{
            alert(json.message);
        }
    },

    /**
     * 배포일자 : 2019.03.14
     * 오픈일자 : 2019.03.18
     * 이벤트명 : 착한 성분 프로젝트
     * 기능 : 포인트 신청
     */
    pointEntry1903 : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,dispCatNo : $("input[id='dispCatNo']:hidden").val()
            };

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/20190318/pointEntry.do"
                  , param
                  , mplanshop.eventDetail._callback_pointEntry1903Json
            );
        }
    },
    _callback_pointEntry1903Json : function(json){
        if(json.ret == "0"){
            alert("신청되었습니다.");
        }else{
            alert(json.message);
        }
    },

    /**
     * 기능 : 특정기간동안 구매횟수, 구매금액 조회 (쿠폰 여러개)
     */
    getPayAmtInEvtDayOfCpn : function(cNo){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                if(common.isEmpty( $("input[id='evtStrtDt"+cNo+"']:hidden").val())
                       || common.isEmpty( $("input[id='evtEndDt"+cNo+"']:hidden").val())
                       || common.isEmpty( $("input[id='cpnNo"+cNo+"']:hidden").val())
                       || common.isEmpty( $("input[id='evtMsg"+cNo+"']:hidden").val()) ){
                    return;
                }
                $("input[id='cpnNo']:hidden").val( $("input[id='cpnNo"+cNo+"']:hidden").val() );
                $("input[id='evtStrtDt']:hidden").val( $("input[id='evtStrtDt"+cNo+"']:hidden").val() );
                $("input[id='evtEndDt']:hidden").val( $("input[id='evtEndDt"+cNo+"']:hidden").val() );
                $("input[id='evtMsg']:hidden").val( $("input[id='evtMsg"+cNo+"']:hidden").val() );

                //기간내 구매금액 구매횟수 확인
                var param = {
                        dispCatNo : $("input[id='dispCatNo']:hidden").val()
                        ,evtNo : $("input[id='evtNo']:hidden").val()
                        ,evtStrtDt : $("input[id='evtStrtDt']:hidden").val()
                        ,evtEndDt : $("input[id='evtEndDt']:hidden").val()
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "event/getPayAmtInEvtDay.do"
                        , param
                        , mplanshop.eventDetail._callback_getPayAmtInEvtDay
                );
            }
        }
    },

    /**
     * 페이백 신청
     */
    pointPayback : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서 응모 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,dispCatNo : $("input[id='dispCatNo']:hidden").val()
                    ,fvrSeq : $("input[id='fvrSeq']:hidden").val()
            };

            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/pointPayback.do"
                  , param
                  , mplanshop.eventDetail._callback_pointPaybackJson
            );
        }
    },
    _callback_pointPaybackJson : function(json){
        if(json.ret == "0"){
            alert("신청되었습니다.");
        }else{
            alert(json.message);
        }
    },

    eventShowLayScroll2: function(obj) {
        var _winHeight = $(window).height(),
            _layObj = $('#'+obj),
            _layObjHeight = (_layObj.height())+50,
            _layObjTop = _layObj.height()/2,
            _layDim = $('#eventDimLayer');
        if(_layObjHeight >= _winHeight){
            var _layObjInner = _layObj.find('.conts_inner');
            var _layObjInHeight = _winHeight-180;
            _layObjInner.css({'max-height': _layObjInHeight});
            _layObjTop = $('#'+obj).height()/2;
        }
        _layDim.show();
        _layObj.css({'margin-top': -_layObjTop}).show();
    },

    /**
     * 이벤트 팝업 레이어 닫기 (reload)
     */
    eventHideLayerRe : function() {
        $('.eventLayer').hide();
        $('#eventDimLayer').hide();

        location.reload(true); //캐쉬삭제
    },

    /**
     * 배포일자 : 2019.04.04
     * 오픈일자 : 2019.04.08
     * 이벤트명 : 생일파티
     * 기능 : 선택 상품 항목 저장
     */
    saveHotPrd : function(hotPrdTxt){
        if( $(hotPrdTxt).length < 1 ) {
            return;
        }

        var selectTxt = $(hotPrdTxt).children('option:selected').text();
        var selectIdx = $(hotPrdTxt).children('option:selected').index();

        $('div#2018HotProductList div').removeClass('on').eq(selectIdx).addClass('on');

        if( undefined != selectTxt && '' != selectTxt ){

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,seOption : selectTxt
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                    ,_baseUrl + "event/20190408/saveHotPrd.do"
                    ,param
                    ,mplanshop.eventDetail._callback_saveHotPrdJson
            )
        }
    },
    _callback_saveHotPrdJson : function(json){
        if(json.ret != "0"){
            alert(json.message);
        }
    },

    /**
     * 배포일자 : 2019.04.04
     * 오픈일자 : 2019.04.08
     * 이벤트명 : 생일파티
     * 기능 : 경품 응모 여부 확인
     */
    getFirstChk : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                }
                common.Ajax.sendRequest(
                        "GET"
                      , _baseUrl + "event/20190408/setConfirmJson.do"
                      , param
                      , mplanshop.eventDetail._callback_getFirstChk
                );
            }
        }
    },

    _callback_getFirstChk : function(json){

        var result = json.ret; // 응답 성공유무
        if(result == 0){
          //위수탁처리
            $("div#Confirmlayer").attr("onClick", "javascript:mplanshop.eventDetail.popLayerConfirm()");
            mplanshop.eventDetail.eventShowLayer('eventLayerPolice'); //위수탁 팝업 호출
        }else{
            alert(json.message);
        }
    },

    /**
     * 배포일자 : 2019.04.04
     * 오픈일자 : 2019.04.08
     * 이벤트명 : 생일파티
     * 기능 : 경품 응모
     */
    giftEntryJson : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                var param = {
                        evtNo : $("input[id='evtNo']:hidden").val()
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "event/20190408/giftEntryJson.do"
                        , param
                        , mplanshop.eventDetail._callback_giftEntryJsonJson
                );
            }
        }
    },
    _callback_giftEntryJsonJson : function(json){
        alert(json.message);
    },

    /**
     * 배포일자 : 2019.04.04
     * 오픈일자 : 2019.04.08
     * 이벤트명 : 생일파티
     * 기능 : 위수탁 동의 처리
     */
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
                mplanshop.eventDetail.eventHideLayer();
                mplanshop.eventDetail.giftEntryJson(); // 원하는 기능으로 입력해야함 : 추가 경품 응모
            }
        }
    },

    regCouponAppAjax : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 발급 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                var rndmVal = $("#evtCpnRndmVal").val();

                if(rndmVal.length <= 0){
                    alert("쿠폰번호를 입력해주세요.");
                    return false;
                }
                common.Ajax.sendRequest("POST"
                    , _baseUrl + "common/regCouponJson.do"
                    , {rndmVal : rndmVal}
                    , mplanshop.eventDetail.regCouponAppAjaxCallback
                );
            }
        }
    },

    regCouponAppAjaxCallback : function(res){
        if(typeof res != "undefined"){
            if(res == '000'){
                alert("쿠폰이 등록되었습니다. 등록된 쿠폰은 'MY>쿠폰'에서 확인 가능합니다.");
            }else{
                alert(res);
            }
        }
    },

    /**
     * 기능 : 특정기간동안 구매횟수 조회 (쿠폰 여러개)
     */
    getPayAmtInEvtDayOfFistOrderCpn : function(cNo){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }else{
                if(common.isEmpty( $("input[id='evtStrtDt"+cNo+"']:hidden").val())
                       || common.isEmpty( $("input[id='evtEndDt"+cNo+"']:hidden").val())
                       || common.isEmpty( $("input[id='cpnNo"+cNo+"']:hidden").val())
                       || common.isEmpty( $("input[id='evtMsg"+cNo+"']:hidden").val()) ){
                    return;
                }
                $("input[id='cpnNo']:hidden").val( $("input[id='cpnNo"+cNo+"']:hidden").val() );
                $("input[id='evtStrtDt']:hidden").val( $("input[id='evtStrtDt"+cNo+"']:hidden").val() );
                $("input[id='evtEndDt']:hidden").val( $("input[id='evtEndDt"+cNo+"']:hidden").val() );
                $("input[id='evtMsg']:hidden").val( $("input[id='evtMsg"+cNo+"']:hidden").val() );

                //기간내 구매금액 구매횟수 확인
                var param = {
                        dispCatNo : $("input[id='dispCatNo']:hidden").val()
                        ,evtNo : $("input[id='evtNo']:hidden").val()
                        ,evtStrtDt : $("input[id='evtStrtDt']:hidden").val()
                        ,evtEndDt : $("input[id='evtEndDt']:hidden").val()
                };
                common.Ajax.sendJSONRequest(
                        "GET"
                        , _baseUrl + "event/getPayAmtInEvtDay.do"
                        , param
                        , mplanshop.eventDetail._callback_getPayAmtInEvtDayOfFistOrderCpn
                );
            }
        }
    },

    _callback_getPayAmtInEvtDayOfFistOrderCpn : function(json){
        if(json.ret == "0"){
            var totalOrdCnt = parseInt(json.totalOrdCnt);
            var cpnNo = $("input[id='cpnNo']:hidden").val(); //쿠폰번호

            if(totalOrdCnt == 0){
                mplanshop.eventDetail.downAppCouponEventJson(cpnNo);
            }else{
                alert($("input[id='evtMsg']:hidden").val());
            }
        }else{
            alert(json.message);
        }
    },

    /**
     * 기능 : 링크 클릭 정보 저장후 랜딩
     */
    saveLinkInfo : function(fvrSeq,noteCont,link){
        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : fvrSeq
                ,noteCont : noteCont
        };
        common.Ajax.sendJSONRequest(
            "GET"
            ,_baseUrl + "event/saveLinkInfo.do"
            ,param
            ,function(json){
                if(json.ret == "0"){
                    common.link.commonMoveUrl(link);
                }else{
                    alert(json.message);
                }
            }
        )
    },

    /**
     * 6월 올영세일 쿠폰 다운로드
     */
    limitCpnDownOfTenJson : function(idx){
        if(mplanshop.eventDetail.appIng){
            return;
        }else if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else if(!mplanshop.eventDetail.checkLogin()){
            return;
        }else{
            var cpnNo = $('#limitCpnNoOfTen'+idx).val();
            if(typeof cpnNo == "undefined" || cpnNo == "" || cpnNo.split('|').length != 2){
                alert("쿠폰 번호가 없습니다.");
                return;
            }
            mplanshop.eventDetail.appIng = true;
            var param = {cpnNo : cpnNo.split('|')[1]};
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/20190530/downCouponJson.do"
                    , param
                    , this._callback_limitCpnDownOfTenJson
            );
        }
    },
    /**
     * 6월 올영세일 쿠폰 다운로드 callback
     */
    _callback_limitCpnDownOfTenJson : function(json) {
        mplanshop.eventDetail.appIng = false;
        if($('.evt_cnt_end').length == 1 &&
                (json.ret == '014' || json.ret == '015' || json.ret == '016' || json.ret == '017') ){
            alert('준비한 쿠폰이 소진되었습니다.');
        }else{
            alert(json.message);
        }
    },

    /**
     * 6월 휴면,이탈회원 쿠폰페이지 다운로드
     */
    restingOrderDownCouponJson : function(){
        if(mplanshop.eventDetail.appIng){
            return;
        }else if(!mplanshop.eventDetail.checkLogin()){
            return;
        }else{

            if($.trim($("#evtNo").val()) == ""
                || $.trim($("#evtStrtDt").val()) == "" || $.trim($("#evtEndDt").val()) == ""
                || $.trim($("#strtDtime").val()) == "" || $.trim($("#endDtime").val()) == ""){
                return;
            }
            mplanshop.eventDetail.appIng = true;
            var param = {
                      evtNo : $("input[id='evtNo']:hidden").val()
                    , evtStrtDt : $("input[id='evtStrtDt']:hidden").val()
                    , evtEndDt : $("input[id='evtEndDt']:hidden").val()
                    , strtDtime : $("input[id='strtDtime']:hidden").val()
                    , endDtime : $("input[id='endDtime']:hidden").val()
            }
            $.ajax({
                 type    : "GET"
               , dataType : "json"
               , url      : _baseUrl + "event/20190530/restingOrderDownCouponJson.do"
               , data   : param
               , success: this._callback_restingOrderDownCouponJson
           });
        }
    },
    /**
     * 6월 휴면,이탈회원 쿠폰페이지 다운로드 callback
     */
    _callback_restingOrderDownCouponJson : function(json) {
        mplanshop.eventDetail.appIng = false;
        if(json.ret == '077'){
            if(json.n_orderDt == 'n_order'){
                $('div.buyData p').text('온라인몰 구매내역이 없습니다.').addClass('no_data');
            }else{
                $('div.buyData p')
                    .children('em:eq(0)').text( json.n_orderDt.substring(0,4) ).end()
                    .children('em:eq(1)').text( json.n_orderDt.substring(4,6) ).end()
                    .children('em:eq(2)').text( json.n_orderDt.substring(6,8) );
            }
            mplanshop.eventDetail.eventShowLayScroll('buyHistory');
        }else{
            alert(json.message);
        }
    },

    /**
     * 올영픽 기프트카드응모(기획전상품 구매대상만)
     */
    applyGiftCard : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }

            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,dispCatNo : $("input[id='dispCatNo']:hidden").val()
                    ,fvrSeq : $("input[id='fvrSeq1']:hidden").val()
                    ,noteCont : $("input[id='noteCont']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/applyGiftCard.do"
                  , param
                  , mplanshop.eventDetail._callback_applyGiftCard
            );
        }
    },
    
    /**
     * 올영픽 기프트카드응모(기획전상품 리뷰 작성 대상만)
     */
    applyGiftCardReview : function(){
        if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
            if(confirm("모바일 앱에서만 참여 가능합니다.")){
                common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
            }else{
                return;
            }
        }else{
            if(!mplanshop.eventDetail.checkLogin()){
                return;
            }
            
            var param = {
                    evtNo : $("input[id='evtNo']:hidden").val()
                    ,dispCatNo : $("input[id='dispCatNo']:hidden").val()
                    ,fvrSeq : $("input[id='fvrSeq1']:hidden").val()
                    ,noteCont : $("input[id='noteCont']:hidden").val()
            };
            common.Ajax.sendJSONRequest(
                    "GET"
                  , _baseUrl + "event/applyGiftCardReview.do"
                  , param
                  , mplanshop.eventDetail._callback_applyGiftCard
            );
        }
    },

    _callback_applyGiftCard : function(json){
        if(json.ret == "0"){
            mplanshop.eventDetail.getApplyGiftYn();
        }
        alert(json.message);
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

    regCouponAjax : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }else{
            var rndmVal = $.trim($("#evtCpnRndmVal").val());

            if(rndmVal.length <= 0){
                alert("쿠폰번호를 입력해주세요.");
                return false;
            }
            common.Ajax.sendRequest("POST"
                , _baseUrl + "common/regCouponJson.do"
                , {rndmVal : rndmVal}
                , mplanshop.eventDetail.regCouponAjaxCallback
            );
        }
    },

    regCouponAjaxCallback : function(res){
        if(typeof res != "undefined"){
            if(res == '000'){
                alert("쿠폰이 등록되었습니다. 등록된 쿠폰은 'MY>쿠폰'에서 확인 가능합니다.");
            }else{
                alert(res);
            }
        }
    },

    // 선착순종료여부 가져오기
    getCloseYn : function(){
        $(".moveLink02_2 > img").removeClass("on");

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : "1"
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20190708/getCloseYn.do"
              , param
              , mplanshop.eventDetail._callback_getCloseYn
        );
    },

    _callback_getCloseYn : function(json){
        if(json.ret == "0"){
            if(json.closeYn == "Y"){
                $(".moveLink02_2 > img:eq(0)").removeClass("on");
                $(".moveLink02_2 > img:eq(1)").addClass("on");
            }else{
                $(".moveLink02_2 > img:eq(1)").removeClass("on");
                $(".moveLink02_2 > img:eq(0)").addClass("on");
            }
        }
    },

    // 선착순신청 체크
    checkApply : function(){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
                ,fvrSeq : "1"
                ,onlBrndCd : $("input[id='onlBrndCd']:hidden").val()
        }
        common.Ajax.sendRequest(
                "GET"
              , _baseUrl + "event/20190708/checkApply.do"
              , param
              , mplanshop.eventDetail._callback_checkApply
        );
    },

    _callback_checkApply : function(json){
        if(json.ret == "0"){
            $(':radio[name="argee1"]:checked').attr("checked", false);
            $(':radio[name="argee2"]:checked').attr("checked", false);
            if( json.myTotalCnt  == "0" ) {  //한번도 신청하지 않은경우 위수탁 받기
                $("div#Confirmlayer1").attr("onclick", "mplanshop.eventDetail.giftEntry('"+json.myTotalCnt+"');");
                mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
                mplanshop.eventDetail.layerPolice = true;
                mplanshop.eventDetail.firstYn = "Y";
            }else {
                mplanshop.eventDetail.firstYn = "N";
                mplanshop.eventDetail.giftEntry(json.myTotalCnt);
            }
        }else{
           alert(json.message);
        }
    },

    giftEntry : function(myTotalCnt){
        if(!mplanshop.eventDetail.checkLogin()){
            return;
        }

        if(myTotalCnt == 0){
            /* 수신동의  myTotalCnt =0 일때만 수신동의 받고 그이후에는 계속Y */
            var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
            var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

            if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
                alert("2가지 모두 동의 후 참여 가능합니다.");
                return;
            }

            if("Y" != mbrInfoUseAgrYn){
                mplanshop.eventDetail.eventHideLayer();
                return;
            }
            if("Y" != mbrInfoThprSupAgrYn){
                mplanshop.eventDetail.eventHideLayer();
                return;
            }
        }else {
            mbrInfoUseAgrYn = "Y";
            mbrInfoThprSupAgrYn = "Y";
        }

        mplanshop.eventDetail.layerPolice = false;
        mplanshop.eventDetail.eventHideLayer();

        var param = {
                evtNo : $("input[id='evtNo']:hidden").val()
              , onlBrndCd : $("input[id='onlBrndCd']:hidden").val()
              , mbrInfoUseAgrYn : mbrInfoUseAgrYn
              , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
              , fvrSeq : "1"
        };

        common.Ajax.sendJSONRequest(
                "GET"
              , _baseUrl + "event/20190708/giftEntry.do"
              , param
              , mplanshop.eventDetail._callback_giftEntry
        );
    },

    _callback_giftEntry : function(json){
        if(json.ret == "0"){
            $(".win_number").text("("+json.tgtrSeq+")");
            mplanshop.eventDetail.eventShowLayer('eventLayerWinner');
            mplanshop.eventDetail.getCloseYn();
       }else{
           alert(json.message);
       }
   },
   
   // 팝업 레이어 숨김
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

   /* 당첨내역 확인 */
   getMyWinList : function(){
       if(!mplanshop.eventDetail.checkLogin()){
           return;
       }
       var param = {
               evtNo : $("input[id='evtNo']:hidden").val()
       }
       common.Ajax.sendJSONRequest(
               "GET"
             , _baseUrl + "event/20190708/getMyWinListJson.do"
             , param
             , mplanshop.eventDetail._callback_getMyWinListJson
       );
   },

   _callback_getMyWinListJson : function(json){
       if(json.ret == "0"){
           var myWinListHtml = "";

           if(json.myEvtWinList.length <= 0){
               myWinListHtml = "<tr><td colspan='2' class='no'>참여이력이<br/> 없습니다.</td></tr>";
           }else{
               for(var i=0 ; i<json.myEvtWinList.length ; i++){
                   myWinListHtml += "<tr><td>" + json.myEvtWinList[i].strSbscSgtDtime + "</td><td>" + json.myEvtWinList[i].evtGoodsNm + "</td></tr>";
               }
           }
           $("tbody#myWinListHtml").html(myWinListHtml);
           mplanshop.eventDetail.eventShowLayer('winCheck');
       }else{
           alert(json.message);
       }
   },

   /* 8월 홈케어의 모든 것. 카카오톡 이모티콘 받기. */
   getKakaoCpnNoOfHomeCare : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 다운 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
           if(!mplanshop.eventDetail.checkLogin()){
               return;
           }

           var onlBrndCdArr = new Array;
           $.each($("input[name='inOnlBrndCdArr']:hidden"), function(idx, obj){
               onlBrndCdArr.push(obj.value);
           });
           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
                   , cpnNo : $("input[id='homeCareKaKaoCpnNo']:hidden").val()
                   , inOnlBrndCdArr : onlBrndCdArr.toString()
           };
           common.Ajax.sendJSONRequest(
               "GET"
               ,_baseUrl + "event/20190809/getKakaoCpnNo.do"
               ,param
               ,function(json){
                   if(json.ret == "0"){
                       $('.kakaoIcon:eq(0)').removeAttr('onclick');
                       $('.kakaoIcon').removeClass('on');
                       $('.kakaoIcon:eq(1)').find('.kcoupon_num em').text(json.rndmVal).end().addClass('on');
                       $('.knum_copy em').text(json.rndmVal);
                   }else if(json.ret == "051"){
                       mplanshop.eventDetail.eventShowLayScroll('pop_soldout');
                   }else{
                       alert(json.message);
                   }
               }
           )
       }
   },

   /* 8월 홈케어의 모든 것. 카카오톡 이모티콘 쿠폰 발급 여부 조회. */
   getKakaoCpnPsbCntOfHomeCare : function(){
       if(!mplanshop.eventDetail.checkLogin()){
           return;
       }

       if($('.kakaoIcon:eq(0)').hasClass('on') || common.isEmpty($('.knum_copy em').text().trim())){
           alert('카카오 이모티콘을 먼저 받아주세요.');
           return;
       }

       mplanshop.eventDetail.eventShowLayScroll('pop_copyNum');
   },

   /* 10월 프리미엄 뷰티페어 위크 - 나의 페이백 당첨률 가져오기 */
   getMyPayBackRate : function(){
       if(!common.isLogin()){
           return;
       }

       var onlBrndCdArr = new Array;
       $.each($("input[name='inOnlBrndCdArr']:hidden"), function(idx, obj){
           onlBrndCdArr.push(obj.value);
       });
       var param = {
               evtNo : $("input[id='evtNo']:hidden").val()
               , inOnlBrndCdArr : onlBrndCdArr.toString()
       }
       common.Ajax.sendRequest(
               "GET"
             , _baseUrl + "event/20191014/getMyPayBackRateJson.do"
             , param
             , function(json){
                 if(json.ret == '0'){

                     if(!common.isEmpty(json.sEvtGoodsNm)){
                         if(!$('.btn_payBack').hasClass('on')){
                             //로딩시 페이백 버튼 셋팅
                             $('.btn_payBack').addClass('on');
                         }else if($('.btn_payBack').hasClass('on')){
                             //적립율 확인하기 팝업 셋팅
                             if(json.sEvtGoodsNm == '5'){
                                 mplanshop.eventDetail.eventShowLayer('popPayBack1');
                             }else if(json.sEvtGoodsNm == '10'){
                                 mplanshop.eventDetail.eventShowLayer('popPayBack2');
                             }else if(json.sEvtGoodsNm == '20'){
                                 mplanshop.eventDetail.eventShowLayer('popPayBack3');
                             }else if(json.sEvtGoodsNm == '30'){
                                 mplanshop.eventDetail.eventShowLayer('popPayBack4');
                             }else if(json.sEvtGoodsNm == '40'){
                                 mplanshop.eventDetail.eventShowLayer('popPayBack5');
                             }else if(json.sEvtGoodsNm == '50'){
                                 mplanshop.eventDetail.eventShowLayer('popPayBack6');
                             }
                         }
                     }

                 }else if(json.ret != '040' && json.ret != '089'){
                     //임직원 제외
                     alert(json.message);
                 }
             }
       );
   },

   /* 10월 프리미엄 뷰티페어 위크 - 페이백 응모 */
   payBackApply : function(){
       if(!mplanshop.eventDetail.checkLogin()){
           return;
       }else{
           var onlBrndCdArr = new Array;
           $.each($("input[name='inOnlBrndCdArr']:hidden"), function(idx, obj){
               onlBrndCdArr.push(obj.value);
           });
           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
                   , inOnlBrndCdArr : onlBrndCdArr.toString()
           };
           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/20191014/payBackApplyJson.do"
                 , param
                 , function(json){
                     if(json.ret == '0'){
                         $('.btn_payBack').addClass('on');
                         if(json.sEvtGoodsNm == '5'){
                             mplanshop.eventDetail.eventShowLayer('popPayBack1');
                         }else if(json.sEvtGoodsNm == '10'){
                             mplanshop.eventDetail.eventShowLayer('popPayBack2');
                         }else if(json.sEvtGoodsNm == '20'){
                             mplanshop.eventDetail.eventShowLayer('popPayBack3');
                         }else if(json.sEvtGoodsNm == '30'){
                             mplanshop.eventDetail.eventShowLayer('popPayBack4');
                         }else if(json.sEvtGoodsNm == '40'){
                             mplanshop.eventDetail.eventShowLayer('popPayBack5');
                         }else if(json.sEvtGoodsNm == '50'){
                             mplanshop.eventDetail.eventShowLayer('popPayBack6');
                         }
                     }else{
                         alert(json.message);
                     }
                 }
           );
       }
   },

   //빅스비 랜덤쿠폰 받기
   downBixbyCouponJson : function(){
       if(!mplanshop.eventDetail.checkLogin()){
           return;
       }
       var param = {
               evtNo : $("input[id='evtNo']:hidden").val()
               ,chlNo : $("input[id='chlNo']:hidden").val()
               ,chlDtlNo : $("input[id='chlDtlNo']:hidden").val()
       }
       common.Ajax.sendJSONRequest(
               "GET"
             , _baseUrl + "event/20191021/downBixbyCouponJson.do"
             , param
             , mplanshop.eventDetail._callback_downBixbyCouponJson
       );
   },

   _callback_downBixbyCouponJson : function(json){
       if(json.ret == "0"){
           $(".btn_coupon").find("img").attr("src","//image.oliveyoung.co.kr/uploads/contents/201910/17bixby/mc_coupon_"+json.fvrSeq+".gif");

           setTimeout(function(){
               alert(json.message);
           }, 200);
       }else{
           alert(json.message);
       }
   },

   //빅스비 다운받은 쿠폰 조회
   getDownCpn : function(){
       var param = {
               evtNo : $("input[id='evtNo']:hidden").val()
               ,chlNo : $("input[id='chlNo']:hidden").val()
               ,chlDtlNo : $("input[id='chlDtlNo']:hidden").val()
       }
       common.Ajax.sendJSONRequest(
               "GET"
             , _baseUrl + "event/20191021/getDownCpn.do"
             , param
             , mplanshop.eventDetail._callback_getDownCpn
       );
   },

   _callback_getDownCpn : function(json){
       if(json.ret == "0"){
           if(json.fvrSeq != "0"){
               $(".btn_coupon").find("img").attr("src","//image.oliveyoung.co.kr/uploads/contents/201910/17bixby/mc_coupon_"+json.fvrSeq+".gif");
           }
       }else{
           alert(json.message);
       }
   },

   /* 11월 블랙 프라이데이 랜덤 쿠폰
    *  - 쿠폰 상태 조회 */
   getRndmCouponStatus : function(){
       var param = {
               evtNo : $("input[id='evtNo']:hidden").val()
       }
       common.Ajax.sendJSONRequest(
               "GET"
             , _baseUrl + "event/20191101_2/getRndmCouponStatus.do"
             , param
             , function(json){
                 if(json.ret == '0'){
                     var baseImgPath = _cdnImgUrl + "contents/201911/01BFDay/";

                     //매장 쿠폰
                     if(!common.isEmpty(json.myCpnDiscount)){
                         if('Y' == json.myCpnUseYn){
                             $('#evtCon1 .storeCoupon_con').addClass('end');
                             $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_' + (json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3)) + '_off.jpg');
                             $('#evtCon1 .couponDown1').removeAttr('onclick');
                         }else{
                             if('Y' == json.offlineSoldOut){
                                 //매장 쿠폰 소진 완료
                                 $('#evtCon1 .storeCoupon_con').addClass('couponSoldOut');
                                 $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_' + (json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3)) + '_off.jpg');
                                 $('#evtCon1 .couponDown1').removeAttr('onclick');
                             }else{
                                 $('#evtCon1 .storeCoupon_con').addClass('on');
                                 $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_' + (json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3)) + '.jpg');
                                 $('#evtCon1 .couponDown1').attr('onclick','mplanshop.eventDetail.confirmStaffLayerShow()');
                             }
                         }
                     }else if('Y' == json.offlineSoldOut){
                         //매장 쿠폰 소진 완료
                         $('#evtCon1 .storeCoupon_con').addClass('couponSoldOut');
                         $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_num_off.gif');
                         $('#evtCon1 .couponDown1').removeAttr('onclick');
                     }

                     //APP 전용 쿠폰
                     if(!common.isEmpty(json.myCpnRate)){
                         $('#evtCon2 .appCoupon_con').addClass('on');
                         $('#evtCon2 .coupon_num img').attr("src", baseImgPath + 'appRandom_' + json.myCpnRate + '.jpg');
                         $('#evtCon2 .couponDown2').attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');');
                     }

                 }
             }
       );
   },

   /* 11월 블랙 프라이데이 랜덤 쿠폰
    *  - 쿠폰 사용. 직원 확인 레이어 노출 */
   confirmStaffLayerShow : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 참여 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else  if(!mplanshop.eventDetail.checkLogin()){
           return;
       }else{
           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
           }
           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/20191101_2/getRndmCouponStatus.do"
                 , param
                 , function(json){
                     if(json.ret == '0'){
                         var baseImgPath = _cdnImgUrl + "contents/201911/01BFDay/";

                         //매장 쿠폰
                         if(!common.isEmpty(json.myCpnDiscount)){
                             if('Y' == json.myCpnUseYn){
                                 $('#evtCon1 .storeCoupon_con').addClass('end');
                                 $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_' + (json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3)) + '_off.jpg');
                                 $('#evtCon1 .couponDown1').removeAttr('onclick');
                             }else if('Y' == json.offlineSoldOut){
                                 //매장 쿠폰 소진 완료
                                 $('#evtCon1 .storeCoupon_con').addClass('couponSoldOut');
                                 $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_' + (json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3)) + '_off.jpg');
                                 $('#evtCon1 .couponDown1').removeAttr('onclick');
                             }else{
                                 //직원 확인 레이어 노출
                                 $('#popStoreCoupon .input_num').find('input').val('').end().show();
                                 $('#popStoreCoupon .conts_inner img:eq(1)').attr("src", baseImgPath + 'pop_store_cnt03_1.png');
                                 $('#popStoreCoupon .conts_inner .randomWinNum img').attr("src", baseImgPath + 'random_' + (json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3)) + '.jpg');
                                 $('#popStoreCoupon .btn_confirm').attr('onclick','mplanshop.eventDetail.barcodeLayerShow(\'' +(json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3))+ '\')');
                                 mplanshop.eventDetail.eventHideLayer();
                                 mplanshop.eventDetail.eventShowLayer('popStoreCoupon');
                             }
                         }

                     }
                 }
           );
       }
   },

   /* 11월 블랙 프라이데이 랜덤 쿠폰
    *  - 매장 쿠폰 직원 확인 클릭 */
   barcodeLayerShow : function(myCpnDiscount){
       if($('#popStoreCoupon .input_num input').val().trim() == $('#confirmOfBF').val()){
           var baseImgPath = _cdnImgUrl + "contents/201911/01BFDay/";
           mplanshop.eventDetail.eventHideLayer();

           $('#popStoreCoupon .input_num').hide();
           $('#popStoreCoupon .conts_inner .randomWinNum img').attr("src", baseImgPath + 'random_' + myCpnDiscount + '.jpg');
           $('#popStoreCoupon .conts_inner img:eq(1)').attr("src", baseImgPath + 'pop_store_cnt03_' + myCpnDiscount + '.png');
           $('#popStoreCoupon .btn_confirm').attr('onclick','mplanshop.eventDetail.useRndmCouponOfOffline()');

           mplanshop.eventDetail.eventShowLayer('popStoreCoupon');
       }else{
           alert('직원 확인 코드가 틀렸습니다. 확인 후 다시 입력해주세요(4자리)');
       }
   },

   /* 11월 블랙 프라이데이 랜덤 쿠폰
    *  - 매장 쿠폰 사용 완료 */
   useRndmCouponOfOffline : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 참여 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else if(!mplanshop.eventDetail.checkLogin()){
           return;
       }else{
           if(!confirm("사용 완료 이후 재사용 불가합니다. 사용하시겠습니까?")){
               return;
           }
           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
           };
           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/20191101_2/useRndmCouponOfOffline.do"
                 , param
                 , function(json){
                     if(json.ret == '0' || json.ret == '017'){
                         var baseImgPath = _cdnImgUrl + "contents/201911/01BFDay/";

                         //사용 완료, 기사용완료
                         if(!common.isEmpty(json.myCpnDiscount)){
                             mplanshop.eventDetail.eventHideLayer();

                             $('#evtCon1 .storeCoupon_con').addClass('end');
                             $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_' + (json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3)) + '_off.jpg');
                             $('#evtCon1 .couponDown1').removeAttr('onclick');
                         }
                     }else{
                         alert(json.message);
                     }
                 }
           );
       }
   },

   /* 11월 블랙 프라이데이 랜덤 쿠폰
    *  - 매장 쿠폰 발급 */
   getRndmCouponOfOffline : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 참여 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else if(!mplanshop.eventDetail.checkLogin()){
           return;
       }else{
           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
           };
           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/20191101_2/getRndmCouponOfOffline.do"
                 , param
                 , function(json){
                     var baseImgPath = _cdnImgUrl + "contents/201911/01BFDay/";

                     if(json.ret == '0'){
                         //발급 완료
                         if(!common.isEmpty(json.myCpnDiscount)){
                             $('#evtCon1 .storeCoupon_con').addClass('on');
                             $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_' + (json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3)) + '.jpg');
                             $('#evtCon1 .couponDown1').attr('onclick','mplanshop.eventDetail.confirmStaffLayerShow()');


                             setTimeout(function(){
                                 alert('쿠폰 발급 완료!\n매장 사용 수 기준 선착순 종료되니\n빠르게 사용해주세요.');
                             }, 500);
                         }
                     }else if(json.ret == '012'){
                         //기발급
                         if(!common.isEmpty(json.myCpnDiscount)){
                             $('#evtCon1 .storeCoupon_con').addClass('on');
                             $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_' + (json.myCpnDiscount.substring(0,json.myCpnDiscount.length-3)) + '.jpg');
                             $('#evtCon1 .couponDown1').attr('onclick','mplanshop.eventDetail.confirmStaffLayerShow()');
                         }

                         alert(json.message);
                     }else if(json.ret == '051'){
                         //소진 완료
                         $('#evtCon1 .storeCoupon_con').addClass('couponSoldOut');
                         $('#evtCon1 .coupon_num img').attr("src", baseImgPath + 'random_num_off.gif');
                         $('#evtCon1 .couponDown1').removeAttr('onclick');

                         alert(json.message);
                     }else{
                         alert(json.message);
                     }
                 }
           );
       }
   },

   /* 11월 블랙 프라이데이 랜덤 쿠폰
    *  - APP 쿠폰 발급 */
   getRndmCouponOfOnline : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 참여 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else if(!mplanshop.eventDetail.checkLogin()){
           return;
       }else{
           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
           };
           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/20191101_2/getRndmCouponOfOnline.do"
                 , param
                 , function(json){
                     var baseImgPath = _cdnImgUrl + "contents/201911/01BFDay/";

                     if(json.ret == '0' || json.ret == '012'){
                         //발급 완료, 기발급
                         if(!common.isEmpty(json.myCpnRate)){
                             $('#evtCon2 .appCoupon_con').addClass('on');
                             $('#evtCon2 .coupon_num img').attr("src", baseImgPath + 'appRandom_' + json.myCpnRate + '.jpg');
                             $('#evtCon2 .couponDown2').attr('onclick', 'common.link.commonMoveUrl(\'mypage/getCouponList.do\');');

                             setTimeout(function(){
                                 alert(json.message);
                             }, 500);
                         }
                     }else{
                         alert(json.message);
                     }
                 }
           );
       }
   },

   /**
    * APP 쿠폰 다운로드 전용(공통)
    */
   downAppCouponArrJson : function(cpnNo){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 다운 가능한 쿠폰입니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
           mplanshop.eventDetail.downCouponArrJson();
       }
   },

   /**
    * 쿠폰 일괄 다운로드 (공통)
    */
   downCouponArrJson : function() {
       if(!mplanshop.eventDetail.checkLogin()){
           return;
       }else{
           var arrayCpnNo = [];
           $("[id^='cpnNo']").each(function(){
               arrayCpnNo.push($(this).val());
           });

           if(arrayCpnNo.length <= 0){
               alert("쿠폰 번호가 없습니다.");
               return;
           }

           var param = {inCpnNoArr : arrayCpnNo.toString()};
           common.Ajax.sendRequest(
                   "GET"
                   , _baseUrl + "event/downCouponArrJson.do"
                   , param
                   , this._callback_downCouponArrJson);
       }
   },

   /**
    * 쿠폰 일괄 다운로드 callback (공통)
    */
   _callback_downCouponArrJson : function(strData) {
       if(strData && strData.message){
           alert(strData.message);
       }
   },

   /**
    * 올영픽 기프트카드응모(기획전상품 구매대상만)
    */
   checkStoreOrder : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 참여 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
           if(!mplanshop.eventDetail.checkLogin()){
               return;
           }

           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
                   ,fvrSeq : $("input[id='fvrSeq2']:hidden").val()
           };

           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/checkStoreOrder.do"
                 , param
                 , mplanshop.eventDetail._callback_checkStoreOrder
           );
       }
   },

   _callback_checkStoreOrder : function(json){
       if(!common.isEmpty(json.ret)){
           alert(json.message);
       }
   },

   /**
    * 올영픽 기프트카드응모 여부 조회
    */
   getApplyGiftYn : function(){
       var param = {
               evtNo : $("input[id='evtNo']:hidden").val()
               ,fvrSeq : $("input[id='fvrSeq1']:hidden").val()
       };
       common.Ajax.sendJSONRequest(
               "GET"
             , _baseUrl + "event/getApplyGiftYn.do"
             , param
             , mplanshop.eventDetail._callback_getApplyGiftYn
       );
   },

   _callback_getApplyGiftYn : function(json){
       if(json.ret == "0"){
           if(json.applyYn == "Y"){
               $(".btn_gift").removeClass("on");
           }else{
               $(".btn_gift").addClass("on");
           }
       }
   },

   setTimer : function(){
       var dat1 = new Date(); //현재날짜
       var getYear = dat1.getFullYear();
       var getMonth = dat1.getMonth()+1;
       var getDay = dat1.getDate();
       var dat2 = new Date(getYear, getMonth, getDay);
       dat2.setDate(1); //내일 하루 더하기
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

       // 시간 설정
       var hour = viewHour;
       if(hour < 10){
           $(".tHour > span").eq(0).html("0");
           $(".tHour > span").eq(1).html(hour);
       } else {
           $(".tHour > span").eq(0).html(parseInt(hour/10));
           $(".tHour > span").eq(1).html((hour%10));
       }

       // 분 설정
       var min = viewMin;
       if(min < 10){
           $(".tMin > span").eq(0).html("0");
           $(".tMin > span").eq(1).html(min);
       } else {
           $(".tMin > span").eq(0).html(parseInt(min/10));
           $(".tMin > span").eq(1).html(min%10);
       }

       // 초 설정
       var sec = viewSec;
       if(sec < 10){
           $(".tSec > span").eq(0).html("0");
           $(".tSec > span").eq(1).html(sec);
       } else {
           $(".tSec > span").eq(0).html(parseInt(sec/10));
           $(".tSec > span").eq(1).html(sec%10);
       }
       setTimeout(function(){mplanshop.eventDetail.setTimer()}, 1000);
   },

   /**
    * 열광대전 응모 여부 조회
    */
   getBrandApplyYn : function(){
       var param = {
               evtNo : $("input[id='evtNo']:hidden").val()
               ,fvrSeq : $("input[id='fvrSeq']:hidden").val()
       };
       common.Ajax.sendJSONRequest(
               "GET"
             , _baseUrl + "event/getApplyGiftYn.do"
             , param
             , mplanshop.eventDetail._callback_getBrandApplyYn
       );
   },

   _callback_getBrandApplyYn : function(json){
       if(json.ret == "0"){
           if(json.applyYn == "Y"){
               $(".btnGift").removeClass("on");
           }else{
               $(".btnGift").addClass("on");
           }
       }else{
           alert(json.message);
       }
   },

   getBrandAmt : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 참여 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
           if(!mplanshop.eventDetail.checkLogin()){
               return;
           }
           var param = {
               evtNo : $("input[id='evtNo']:hidden").val()
               ,fvrSeq : $("input[id='fvrSeq']:hidden").val()
               ,inOnlBrndCdArr : $("input[id='inOnlBrndCdArr']:hidden").val().split(",").toString()
           }

           common.Ajax.sendRequest(
                   "GET"
                 , _baseUrl + "event/getBrandAmt.do"
                 , param
                 , function(json){
                     $(':radio[name="argee1"]:checked').attr("checked", false);
                     $(':radio[name="argee2"]:checked').attr("checked", false);

                       if(json.ret == "0"){
                           $("div#Confirmlayer1").attr("onclick", "mplanshop.eventDetail.brandAmtApply();");
                           mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
                           mplanshop.eventDetail.layerPolice = true;
                           $(".agreeCont")[0].scrollTop = 0;
                       }else{
                           alert(json.message);
                       }
                   }
           );
       }
   },

   /**
    * 열광대전 응모
    */
   brandAmtApply : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 참여 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
           if(!mplanshop.eventDetail.checkLogin()){
               return;
           }

           var agreeVal1 = $(':radio[name="argee1"]:checked').val();
           var agreeVal2 = $(':radio[name="argee2"]:checked').val();

           if("Y" != agreeVal1){
               alert("개인정보 수집 이용 동의를 하셔야 이벤트 참여가 가능합니다.");
               return false;
           } else {
               mbrInfoUseAgrYn = "Y";
           }

           if("Y" != agreeVal2){
               alert("개인정보 처리 위탁 동의를 하셔야 이벤트 참여가 가능합니다.");
               return false;
           } else {
               mbrInfoThprSupAgrYn = "Y";
           }
           mplanshop.eventDetail.layerPolice = false;
           mplanshop.eventDetail.eventHideLayer();

           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
                   ,fvrSeq : $("input[id='fvrSeq']:hidden").val()
                   ,inOnlBrndCdArr : $("input[id='inOnlBrndCdArr']:hidden").val().split(",").toString()
                   ,mbrInfoUseAgrYn : mbrInfoUseAgrYn
                   ,mbrInfoThprSupAgrYn :  mbrInfoThprSupAgrYn
           };
           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/brandAmtApply.do"
                 , param
                 , mplanshop.eventDetail._callback_brandAmtApply
           );
       }
   },

   _callback_brandAmtApply : function(json){
       if(json.ret == "0"){
           alert("응모 완료되었습니다! 2월 26일 당첨자 게시판을 확인해주세요.");
           mplanshop.eventDetail.getBrandApplyYn();
       }else{
           alert(json.message);
       }
   },

   /* 오늘드림 가능지역 조회  */
   initDaumMap : function(){
	   	new daum.Postcode({
	   		theme: mplanshop.eventDetail.themeObj,
	   		showMoreHName : true,
	   		oncomplete: function(data) {
	   			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
	   			//검색결과 데이터 초기화
	   			mplanshop.eventDetail.zipcode = "";
	   			mplanshop.eventDetail.road_address = "";
	   			mplanshop.eventDetail.jibun_address = "";
	   			mplanshop.eventDetail.extra_address = "";
	   			mplanshop.eventDetail.selected_type = "";
				var emdNm = "";
				var admrNm = "";
	   			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
	   			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
	   			var addr = ''; // 주소 변수
	   			var extraAddr = ''; // 참고항목 변수

	   			//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
	   			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
	   				addr = data.roadAddress;
	   			} else { // 사용자가 지번 주소를 선택했을 경우(J)
	   				addr = data.jibunAddress;
	   			}
	   			
	   			//법정동, 행정동 동/리 구분
                if(data.bname1 == ''){ //동 지역
                	emdNm = data.bname;
                	if(data.hname == ''){
                		admrNm = data.bname;
                	} else {
                		admrNm = data.hname;
                	}
                } else {
                	emdNm = data.bname1 + ' ' + data.bname2;
                	if(data.hname == ''){
                		admrNm = data.bname1;
                	} else {
                		admrNm = data.hname;
                	}
                }
                
	   			// 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
	   			if(data.userSelectedType === 'R'){
	   				// 법정동명이 있을 경우 추가한다. (법정리는 제외)
	   				// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
	   				if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
	   					extraAddr += data.bname;
	   				}
	   				// 건물명이 있고, 공동주택일 경우 추가한다.
	   				if(data.buildingName !== '' && data.apartment === 'Y'){
	   					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
	   				}
	   				// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
	   				if(extraAddr !== ''){
	   					extraAddr = ' (' + extraAddr + ')';
	   				}
	   				// 조합된 참고항목을 해당 필드에 넣는다.
	   				mplanshop.eventDetail.extra_address = extraAddr;

	   			} else {
	   				mplanshop.eventDetail.extra_address = '';
	   			}

	   			// 우편번호와 주소 정보를 해당 필드에 넣는다.
	   			if(data.jibunAddress == '' || data.jibunAddress == null){
	   				data.jibunAddress = data.autoJibunAddress;
	   			}
	   			mplanshop.eventDetail.zipcode = data.zonecode;
	   			mplanshop.eventDetail.road_address = data.roadAddress;
	   			mplanshop.eventDetail.jibun_address = data.jibunAddress;
	   			mplanshop.eventDetail.selected_type = data.userSelectedType;
	   			var param = 
					{
						zipcode : mplanshop.eventDetail.zipcode
						,admrNm : admrNm
   						,emdNm : emdNm
						,evtNo : $("input[id='evtNo']:hidden").val()
						,searchYn : $("input[id='todayAdressSeachYn']:hidden").val()
					};
	   			var url = _baseUrl + "event/getZipcodeCheckJson.do";
	   			common.Ajax.sendRequest(
	   					"POST"
	   					,url
	   					,param
	   					,function(data){
			   				var res = (typeof data !== 'object') ? $.parseJSON(data) : data;
			   				if(res.message == "succ"){
			   					if($("input[id='todayAdressSeachYn']:hidden").val() == "Y"){
			   						if(res.applyStatus == "-1"){
			   							if(!mplanshop.eventDetail.checkLoginEvt()){
			   			                    return;
			   			                }
			   						}else if(res.applyStatus == "1"){ //응모완료
			   							$("#popTodaySearch1").removeClass("userNpoint");
			   							$("#popTodaySearch1").addClass("userTpoint");
			   							$("#popTodaySearch2").removeClass("userTpoint");
			   							$("#popTodaySearch2").addClass("userTpoint");
			   						}else{
			   							$("#popTodaySearch1").removeClass("userTpoint");
			   							$("#popTodaySearch1").addClass("userNpoint");
			   							$("#popTodaySearch2").removeClass("userTpoint");
			   							$("#popTodaySearch2").addClass("userNpoint");
			   						}
			   					}
			   					
			   					if(res.result > 0){ //오늘드림 주문 가능지역
			   						mplanshop.eventDetail.eventShowLayer('popTodaySearch1');
			   					}else{// 오늘드림 주문 불가지역
			   						mplanshop.eventDetail.eventShowLayer('popTodaySearch2');
			   					}
	   				}else{//error
	   					alert("오늘드림 이용 가능지역 조회중 오류가발생했습니다.");
	   					mplanshop.eventDetail.eventHideLayer();
	   				}
	   			});
	   		}
	   	}).open({
	   		popupName : "postcodePopup"
	   	});
   },

   initDaumMapApp : function() {
	   	$('#eventDimLayer').show();
	   	new daum.Postcode({
	   		theme: mplanshop.eventDetail.themeObj,
	   		showMoreHName : true,
	   		oncomplete: function(data) {
	   			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
	   			//검색결과 데이터 초기화
	   			mplanshop.eventDetail.zipcode = "";
	   			mplanshop.eventDetail.road_address = "";
	   			mplanshop.eventDetail.jibun_address = "";
	   			mplanshop.eventDetail.extra_address = "";
	   			mplanshop.eventDetail.selected_type = "";
				var emdNm = "";
				var admrNm = "";
	   		 // 각 주소의 노출 규칙에 따라 주소를 조합한다.
	   			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
	   			var addr = ''; // 주소 변수
	   			var extraAddr = ''; // 참고항목 변수

	   			//사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
	   			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
	   				addr = data.roadAddress;
	   			} else { // 사용자가 지번 주소를 선택했을 경우(J)
	   				addr = data.jibunAddress;
	   			}
	   			
	   			//법정동, 행정동 동/리 구분
                if(data.bname1 == ''){ //동 지역
                	emdNm = data.bname;
                	if(data.hname == ''){
                		admrNm = data.bname;
                	} else {
                		admrNm = data.hname;
                	}
                } else {
                	emdNm = data.bname1 + ' ' + data.bname2;
                	if(data.hname == ''){
                		admrNm = data.bname1;
                	} else {
                		admrNm = data.hname;
                	}
                }
                
	   			// 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
	   			if(data.userSelectedType === 'R'){
	   				// 법정동명이 있을 경우 추가한다. (법정리는 제외)
	   				// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
	   				if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
	   					extraAddr += data.bname;
	   				}
	   				// 건물명이 있고, 공동주택일 경우 추가한다.
	   				if(data.buildingName !== '' && data.apartment === 'Y'){
	   					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
	   				}
	   				// 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
	   				if(extraAddr !== ''){
	   					extraAddr = ' (' + extraAddr + ')';
	   				}
	   				// 조합된 참고항목을 해당 필드에 넣는다.
	   				mplanshop.eventDetail.extra_address = extraAddr;

	   			} else {
	   				mplanshop.eventDetail.extra_address = '';
	   			}

	   			// 우편번호와 주소 정보를 해당 필드에 넣는다.
	   			if(data.jibunAddress == '' || data.jibunAddress == null){
	   				data.jibunAddress = data.autoJibunAddress;
	   			}
	   			mplanshop.eventDetail.zipcode = data.zonecode;
	   			mplanshop.eventDetail.road_address = data.roadAddress;
	   			mplanshop.eventDetail.jibun_address = data.jibunAddress;
	   			mplanshop.eventDetail.selected_type = data.userSelectedType;
	   			var param = 
	   					{
	   						zipcode : mplanshop.eventDetail.zipcode
	   						,admrNm : admrNm
	   						,emdNm : emdNm
	   						,evtNo : $("input[id='evtNo']:hidden").val()
	   						,searchYn : $("input[id='todayAdressSeachYn']:hidden").val()
	   					};
	   			var url = _baseUrl + "event/getZipcodeCheckJson.do";
	   			common.Ajax.sendRequest(
	   					"POST"
	   					,url
	   					,param
	   					,function(data){
			   				var res = (typeof data !== 'object') ? $.parseJSON(data) : data;
			   				if(res.message == "succ"){
			   					if($("input[id='todayAdressSeachYn']:hidden").val() == "Y"){
			   						if(res.applyStatus == "-1"){
			   							if(!mplanshop.eventDetail.checkLoginEvt()){
			   			                    return;
			   			                }	   
			   						}else if(res.applyStatus == "1"){ //응모완료
			   							$("#popTodaySearch1").removeClass("userNpoint");
			   							$("#popTodaySearch1").addClass("userTpoint");
			   							$("#popTodaySearch2").removeClass("userTpoint");
			   							$("#popTodaySearch2").addClass("userTpoint");
			   						}else{
			   							$("#popTodaySearch1").removeClass("userTpoint");
			   							$("#popTodaySearch1").addClass("userNpoint");
			   							$("#popTodaySearch2").removeClass("userTpoint");
			   							$("#popTodaySearch2").addClass("userNpoint");
			   						}
			   					}
			   					
			   					if(res.result > 0){ //오늘드림 주문 가능지역
			   						mplanshop.eventDetail.eventShowLayer('popTodaySearch1');
			   					}else{// 오늘드림 주문 불가지역
			   						mplanshop.eventDetail.eventShowLayer('popTodaySearch2');
			   					}
			   				}else{//error
			   					alert("오늘드림 이용 가능지역 조회중 오류가발생했습니다.");
			   					mplanshop.eventDetail.eventHideLayer();
			   				}
	   			});

	   			// iframe을 넣은 element를 안보이게 한다.
	   			// (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
	   			mplanshop.eventDetail.addrPop.style.display = 'none';
	   		},
	   		width : '100%',
	   		height : '100%',
	   		maxSuggestItems : 5
	   	}).embed(mplanshop.eventDetail.addrPop);

	   	// iframe을 넣은 element를 보이게 한다.
	   	mplanshop.eventDetail.addrPop.style.display = 'block';

	   	// iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
	   	mplanshop.eventDetail.initLayerPosition();
   },

   initLayerPosition : function(){
	   // 브라우저의 크기 변경에 따라 레이어를 가운데로 이동시키고자 하실때에는
	   // resize이벤트나, orientationchange이벤트를 이용하여 값이 변경될때마다 아래 함수를 실행 시켜 주시거나,
	   // 직접 element_layer의 top,left값을 수정해 주시면 됩니다.
	   	mplanshop.eventDetail.addrPop.style.width = '100%';
	   	mplanshop.eventDetail.addrPop.style.height = '100%';
	   	mplanshop.eventDetail.addrPop.style.border = '3px solid #000';
	   	mplanshop.eventDetail.addrPop.style.top = "0px";
   },

   /* 공유하기 (버튼2개용) */
   kakaoShareSnsBtn2 : function(){
       var moveUrl = $('#kakaoShareSubUrl').val() == null ? "" : $('#kakaoShareSubUrl').val();
       if(moveUrl.indexOf("inmybag") < 0){
		moveUrl = _baseUrl + moveUrl;
		moveUrl = _baseUrl + "common/runApp.do?redirectLinkUrl="+ snsShareSubUrl;
      }
       var snsShareSubUrl = moveUrl;
       //버튼명1, 버튼명2, 랜딩주소2
       common.sns.doShareKakaoEvt2($('#kakaoShareMainBtnNm').val(), $('#kakaoShareSubBtnNm').val(), snsShareSubUrl);
   },

	checkTodayOrder : function(){
		if(!mplanshop.eventDetail.checkLogin()){
			return;
		}else{
			var param = {
					evtNo : $("input[id='evtNo']:hidden").val()
					, startDate : $("input[id='startDate']:hidden").val()
			};
			common.Ajax.sendJSONRequest(
				"GET"
				, _baseUrl + "event/checkTodayOrder.do"
				, param
				, function(json){
					if(json.ret == '-1'){
			        	if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
			        		common.link.moveLoginPage();
			        		return false;
			            }
					}else if(json.fistYn == 'N'){
						mplanshop.eventDetail.todayOrderDownCouponJson($('#todayCpnNo').val());
					}else{
						mplanshop.eventDetail.eventAlertLayer("", "오늘드림 첫 구매 고객만 발급 가능합니다. <br> 친구에게도 공유해볼까요?");
					}
				}
			);
		}
	},

	todayOrderDownCouponJson : function(cpnNo){
		if(!mplanshop.eventDetail.checkLogin()){
			return;
		}else if(!common.isEmpty(cpnNo)){
            var param = {cpnNo : cpnNo};
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "event/downCouponOfEvtJson.do"
                    , param
                    , function(json) {
                    	if(json.ret == '-1'){
    			        	if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
    			        		common.link.moveLoginPage();
    			        		return false;
    			            }
    					}else if(json.ret == '022'){
							mplanshop.eventDetail.eventAlertLayer("", "임직원은 다운 받을 수 없는 쿠폰입니다. <br> 친구에게도 공유해볼까요?");
						}else if(json.ret == '010'){
							mplanshop.eventDetail.eventAlertLayer("", "이미 발급된 쿠폰입니다. <br> 친구에게도 공유해볼까요?");
						}else if(json.ret == "0"){
							mplanshop.eventDetail.eventAlertLayer("", "쿠폰이 발급되었습니다. <br> 친구에게도 공유해볼까요?");
						}else{
							alert(json.message);
						}
					}
			);
		}
	},

	//이벤트 alert 레이어 팝업
   eventAlertLayer : function(title, text){
	   if(title != ""){
		   $("#today_base_layer .popTitle").html(title);
	   }
	   $("#today_base_layer .layer_text").html(text);
	   mplanshop.eventDetail.eventShowLayer('today_base_layer');
   },

   //파운데이션 키트  선착순 마감 정보 조회
   getKitInfo : function() {
	   var param = {
			   evtNo : $("input[id='evtNo']:hidden").val()
	   };
	   common.Ajax.sendJSONRequest(
			   "GET"
			   , _baseUrl + "event/20200420/getKitInfo.do"
			   , param
			   , mplanshop.eventDetail._callback_getKitInfo
	   );
   },

   _callback_getKitInfo : function(json) {
       if(json.ret == "0"){
    	   if(json.kitEndYn == "Y"){	//소진완료
    		   $(".btn_applyKit").removeClass("on");
    		   $(".btn_choiceItem").removeClass().addClass("btn_choiceItem2");
    		   $(".evtCon03").addClass("itemKitEnd");
    		   $(".itemKit1").addClass("kitSoldOut");
    	   }
       }
   },


   applyKit : function() {
	   if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 신청 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
    	   if(!mplanshop.eventDetail.checkLogin()){
    		   return;
    	   }else{
    		   var param = {
    				   evtNo : $("input[id='evtNo']:hidden").val()
    				   ,fvrSeq : "1"
    				   ,noteCont :  $("input[id='noteCont']:hidden").val()
    		   };
    		   common.Ajax.sendJSONRequest(
    				   "GET"
    				   , _baseUrl + "event/20200420/applyKit.do"
    				   , param
    				   , mplanshop.eventDetail._callback_applyKit
    		   );
    	   }
       }
   },

   _callback_applyKit : function(json) {
       if(json.ret == "0"){
    	   alert($("input[id='kitMessage1']:hidden").val());
       }else if(json.ret == "98"){	//추천한 파데 없을경우
    	   alert($("input[id='kitMessage2']:hidden").val());
       }else if(json.ret == "-1"){
    	   if(confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
	       		common.link.moveLoginPage();
	       		return false;
           }
       }else{
    	   alert(json.message);
       }
   },

   //키트 신청여부 조회(수령기간)
   getKitApplyYn : function(cls) {
	   var param = {
			   evtNo : $("input[id='evtNo']:hidden").val()
	   };
	   common.Ajax.sendJSONRequest(
			   "GET"
			   , _baseUrl + "event/20200420/getKitApplyYn.do"
			   , param
			   , function(json) {
			       if(json.ret == "0"){
			    	   if(json.apply1Yn == "Y"){
			    		   if(json.apply2Yn == "Y"){
			    			   $(".itemKit1").addClass("complete");
			    		   }else{
			    			   $(".itemKit1").addClass(cls);
			    		   }
			    	   }else{
			    		   //응모행사종료
			    		   $(".itemKit1").addClass("end");
			    	   }
			       }else{
			    	   //응모행사종료
			    	   $(".itemKit1").addClass("end");
			       }
			   }
	   );
   },

   //신청완료 후 수령기간전 얼럿
   kitApplyCheck : function() {
	   if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 신청 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
    	   if(!mplanshop.eventDetail.checkLogin()){
    		   return;
    	   }else{
			   var param = {
					   evtNo : $("input[id='evtNo']:hidden").val()
					   ,fvrSeq : "1"
			   };
			   common.Ajax.sendJSONRequest(
					   "GET"
					   , _baseUrl + "event/20200420/getApplyYn.do"
					   , param
					   , function(json) {
						   if(json.ret == "0"){
							   if(json.applyYn == "Y"){
								   alert($("input[id='kitMessage4']:hidden").val());
							   }else{
								   alert($("input[id='kitMessage3']:hidden").val());
							   }
						   }else{
							   alert($("input[id='kitMessage3']:hidden").val());
						   }
					   }
			   );
    	   }
       }
   },

   receiveKit : function() {
	   if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 신청 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
    	   if(!mplanshop.eventDetail.checkLogin()){
    		   return;
    	   }else{
    		   var param = {
    				   evtNo : $("input[id='evtNo']:hidden").val()
    				   ,fvrSeq : "2"
    				   ,noteCont :  $("#evtStoreCd").val()
    		   };
    		   common.Ajax.sendJSONRequest(
    				   "GET"
    				   , _baseUrl + "event/20200420/receiveKit.do"
    				   , param
    				   , mplanshop.eventDetail._callback_receiveKit
    		   );
    	   }
       }
   },

   _callback_receiveKit : function(json) {
       if(json.ret == "0"){
    	   $(".itemKit1").removeClass("on").addClass("complete");
    	   mplanshop.eventDetail.eventHideLayer();
       }else{
    	   alert(json.message);
       }
   },

   //신청완료 후 수령기간전 얼럿
   getReviewApplyYn : function() {
	   if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 신청 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
    	   if(!mplanshop.eventDetail.checkLogin()){
    		   return;
    	   }else{
			   var param = {
					   evtNo : $("input[id='evtNo']:hidden").val()
					   ,fvrSeq : "3"
			   };
			   common.Ajax.sendJSONRequest(
					   "GET"
					   , _baseUrl + "event/20200420/getApplyYn.do"
					   , param
					   , function(json) {
						   if(json.ret == "0"){
							   if(json.applyYn == "Y"){
								   alert("이미 응모 되었습니다.");
							   }else{
								   //경품선택 팝업
								   $(':radio[name^="radioValue"]:checked').prop("checked",false);
								   mplanshop.eventDetail.eventShowLayScroll('itemKitPop1');
							   }
						   }else{
							   alert(json.message);
						   }
					   }
			   );
    	   }
       }
   },

   reviewApply : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("APP 에서만 참여 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
           if(!mplanshop.eventDetail.checkLogin()){
               return;
           }

           var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
           var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

           if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
               alert("2가지 모두 동의 후 참여 가능합니다.");
               return;
           }

           if("Y" != mbrInfoUseAgrYn){
        	   mplanshop.eventDetail.layerPolice = false;
        	   mplanshop.eventDetail.eventCloseLayer();
               return;
           }
           if("Y" != mbrInfoThprSupAgrYn){
        	   mplanshop.eventDetail.layerPolice = false;
        	   mplanshop.eventDetail.eventCloseLayer();
               return;
           }

           mplanshop.eventDetail.layerPolice = false;
           mplanshop.eventDetail.eventHideLayer();

           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
                 , fvrSeq : "3"
                 , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                 , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                 , noteCont : $(':radio[name="radioValue"]:checked').val()
           };
           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/20200420/reviewApply.do"
                 , param
                 , mplanshop.eventDetail._callback_reviewApply
           );
       }
   },

   _callback_reviewApply : function(json){
       if(json.ret == "0"){
           alert("응모가 완료되었습니다.");
       }else{
    	   alert(json.message);
       }
   },

   //신청기간 후에 소진완료시 신청여부 얼럿
   endApplyCheck : function() {
	   if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 신청 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
    	   if(!mplanshop.eventDetail.checkLogin()){
    		   return;
    	   }else{
			   var param = {
					   evtNo : $("input[id='evtNo']:hidden").val()
					   ,fvrSeq : "1"
			   };
			   common.Ajax.sendJSONRequest(
					   "GET"
					   , _baseUrl + "event/20200420/getApplyYn.do"
					   , param
					   , function(json) {
						   if(json.ret == "0"){
							   if(json.applyYn == "Y"){
								   alert("이미 신청하셨습니다.");
							   }
						   }
					   }
			   );
    	   }
       }
   },

   suncareMoveGoodsLog : function(val) {
	   var valArray = $("#suncareGoodsNo"+val).val().split("|");
	   common.wlog("event_tryget_click_"+valArray[1]);
	   common.link.commonMoveUrl("goods/getGoodsDetail.do?goodsNo="+valArray[0]);
   },

   checkPremiumApply : function() {
	   if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("모바일 앱에서만 신청 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
    	   if(!mplanshop.eventDetail.checkLogin()){
    		   return;
    	   }else{
			   var param = {
					   evtNo : $("input[id='evtNo']:hidden").val()
		               , fvrSeq : "1"
		               , inOnlBrndCdArr : $("input[id='inOnlBrndCdArr']:hidden").val().toString()
		               , strtDtime : $("input[id='strtDtime']:hidden").val()
		               , endDtime : $("input[id='endDtime']:hidden").val()
			   };
			   common.Ajax.sendJSONRequest(
					   "GET"
					   , _baseUrl + "event/20200511/checkPremiumApply.do"
					   , param
					   , function(json) {
						   if(json.ret == "0"){
							   $(':radio[name="argee1"]:checked').attr("checked", false);
			                   $(':radio[name="argee2"]:checked').attr("checked", false);
			                   $("div#Confirmlayer1").attr("onclick", "mplanshop.eventDetail.premiumApply();");
			                   mplanshop.eventDetail.eventShowLayer('eventLayerPolice');
			                   mplanshop.eventDetail.layerPolice = true;
                               $(".agreeCont")[0].scrollTop = 0;
						   }else{
							   alert(json.message);
						   }
					   }
			   );
    	   }
       }
   },

   premiumApply : function(){
       if(common.app.appInfo == undefined || !common.app.appInfo.isapp){
           if(confirm("APP 에서만 참여 가능합니다.")){
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           }else{
               return;
           }
       }else{
           if(!mplanshop.eventDetail.checkLogin()){
               return;
           }

           var mbrInfoUseAgrYn =  $(':radio[name="argee1"]:checked').val();
           var mbrInfoThprSupAgrYn =  $(':radio[name="argee2"]:checked').val();

           if("Y" != $(':radio[name="argee1"]:checked').val() || "Y" != $(':radio[name="argee2"]:checked').val()){
               alert("2가지 모두 동의 후 참여 가능합니다.");
               return;
           }

           if("Y" != mbrInfoUseAgrYn){
        	   mplanshop.eventDetail.layerPolice = false;
        	   mplanshop.eventDetail.eventCloseLayer();
               return;
           }
           if("Y" != mbrInfoThprSupAgrYn){
        	   mplanshop.eventDetail.layerPolice = false;
        	   mplanshop.eventDetail.eventCloseLayer();
               return;
           }

           mplanshop.eventDetail.layerPolice = false;
           mplanshop.eventDetail.eventHideLayer();

           var param = {
                   evtNo : $("input[id='evtNo']:hidden").val()
                 , fvrSeq : "1"
                 , mbrInfoUseAgrYn : mbrInfoUseAgrYn
                 , mbrInfoThprSupAgrYn :mbrInfoThprSupAgrYn
                 , inOnlBrndCdArr : $("input[id='inOnlBrndCdArr']:hidden").val().toString()
                 , strtDtime : $("input[id='strtDtime']:hidden").val()
		         , endDtime : $("input[id='endDtime']:hidden").val()
           };
           common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "event/20200511/premiumApply.do"
                 , param
                 , mplanshop.eventDetail._callback_premiumApply
           );
       }
   },

   _callback_premiumApply : function(json){
       if(json.ret == "0"){
           alert($("input[id='premiumMessage']:hidden").val());
       }else{
    	   alert(json.message);
       }
   },

   _callback_getLimitDd1DownPsbCpn : function(json){
       if(json.cpnStatus == 'comingsoon_all'){
           $('.evtCon02, .evtCon03').addClass('tCouponComing');
       }else{
           if(json.cpnStatus_1 == 'soldout'){
               $('.evtCon02').addClass('tCouponComplete');
           }
           if(json.cpnStatus_2 == 'soldout'){
               $('.evtCon03').addClass('tCouponComplete');
           }
           if(json.cpnStatus_2 == 'comingsoon'){
               $('.evtCon03').addClass('tCouponComing');
           }
       }
   },
   
   checkLoginEvt : function(){
       if(!common.isLoginForEvt()){
           if(!confirm("해당 서비스는 로그인이 필요합니다.로그인 페이지로 이동하시겠습니까?")){
               return false;
           }else{
               common.link.moveLoginPage();
               return false;
           }
       }

       return true;
   },
   
   dsAgeMoveUrl : function(key, val, url){
	   common.wlog(key+val);//anti_age_click_
	   common.link.commonMoveUrl(url);
   },
   
   dsLogCheckMove : function(key, val, num){
	   common.wlog(key+val);
	   mplanshop.eventDetail.checkMove(num);
   },
   
   flexLogMoveUrl : function(val,url){
	   common.wlog("event_flex_click_"+val);
	   common.link.commonMoveUrl(url);
   },
   
   flexLogCheckMove : function(val,num){
	   common.wlog("event_flex_click_"+val);
	   mplanshop.eventDetail.checkMove(num);
   },
   
   oypickLogMoveUrl : function(val,url){
	   common.wlog("event_oypick_click_"+val);
	   common.link.commonMoveUrl(url);
   },
   
   oypickLogCheckMove : function(val,num){
	   common.wlog("event_oypick_click_"+val);
	   mplanshop.eventDetail.checkMove(num);
   },

   //이벤트 팝업 닫고 유튜브 셋팅
   eventHideLayerYoutube : function(tgClass) {
	   if($('.'+tgClass).length == 1){
			$('.eventLayer').hide();
			$('#eventDimLayer').hide();
			$('body').removeClass('evtYtPop');

			$('.'+tgClass).show();
			$("#video").attr('src',$('#youtubeURL').val());
	   }
   },

   //이벤트 팝업 열고 유튜브 삭제
   eventShowLayScrollYoutube : function(tgClass, obj) {
	   if($('.'+tgClass).length == 1){
	        var _winHeight = $(window).height(),
	            _layObj = $('#'+obj),
	            _layObjHeight = _layObj.height(),
	            _layObjTop = _layObj.height()/2,
	            _layDim = $('#eventDimLayer');
	        if(_layObjHeight >= _winHeight){
	            var _layObjInner = _layObj.find('.conts_inner');
	            var _layObjInHeight = _winHeight-112;
	            _layObjInner.css({'max-height': _layObjInHeight});
	            _layObjTop = $('#'+obj).height()/2;
	        }
	        _layDim.show();
	        _layObj.css({'margin-top': -_layObjTop}).show();
	        $('body').addClass('evtYtPop');

			$('.'+tgClass).hide();
			$("#video").attr('src','');
	   }
   },
   
   // 찐트렌트 응모여부 조회 (2020.09.25 특템하시월 이벤트)
   getApplyItemYn : function () {
	   var param = {
			   evtNo : $("input[id='evtNo']:hidden").val()
			 , fvrSeq : $("input[id='fvrSeq1']:hidden").val() 
	   };
	   
	   common.Ajax.sendJSONRequest(
			   "GET"
			   , _baseUrl + "event/20201012/getApplyItemYn.do"
			   , param
			   , mplanshop.eventDetail._callback_getApplyItemYn
	   );
   },
   
   // 찐트렌트 응모여부 조회 결과 콜백 (2020.09.25 특템하시월 이벤트)
   _callback_getApplyItemYn : function(json) {
	   if (json.ret == "0") {
		   // 회원명 초기화
		   $(".userCon").text("");
		   $(".userCon").append("<span>" + json.customer.mbrNm + "</span>님을 위한<br>필수 득템 가이드");
		   
		   // 이벤트 응모 완료 시, 응모버튼 내용을 변경한다.
		   if (json.evtApplyYn == "Y") {
			   $(".btnEvtGift").removeClass("on");
			   $(".btnEvtGift").addClass("end");
		   } else {
			   return;
		   }
	   } else {	   
		   if (json.ret == "-1") {
			   // 로그인시 참여 가능합니다. 로그인 페이지로 이동하시겠습니까?
			   mplanshop.eventDetail.checkLoginEvt();
		   } else {
			   alert(json.message);
			   return false;
		   }
	   }
   },
   
   // 찐트렌드 이벤트 응모 (2020.09.25 특템하시월 이벤트)
   applyItem : function () {
	   if (common.app.appInfo == undefined || !common.app.appInfo.isapp) {
           if (confirm("모바일 앱에서만 참여 가능합니다.")) {
               common.link.commonMoveUrl("common/getAppDownload.do?redirectUrl=event/getEventDetail.do?evtNo="+$("input[id='evtNo']:hidden").val());
           } else {
               return;
           }
       } else {
    	   // 로그인 체크
    	   if (!mplanshop.eventDetail.checkLogin()) {
               return;
           }
    	   
    	   var param = {
                   evtNo 	 : $("input[id='evtNo']:hidden").val()
                 , dispCatNo : $("input[id='dispCatNo']:hidden").val()
                 , fvrSeq 	 : $("input[id='fvrSeq1']:hidden").val()
                 , noteCont  : $("input[id='noteCont']:hidden").val()
           };
    	   
    	   common.Ajax.sendJSONRequest(
                   "GET"
                 , _baseUrl + "/event/20201012/applyItem.do"
                 , param
                 , mplanshop.eventDetail._callback_applyItem
           );
       }
   },
   
   // 찐트렌드 이벤트 응모 결과 콜백 (2020.09.25 특템하시월 이벤트)
   _callback_applyItem : function(json) {
	   // 동의서 체크 내용을 초기화한다.
	   $(':radio[name="argee1"]:checked').attr("checked", false);
       $(':radio[name="argee2"]:checked').attr("checked", false);
	   
	   if (json.ret == "0") {
		   // 이벤트 응모정보를 조회한다.
		   mplanshop.eventDetail.getApplyItemYn();
       }
	   
	   if (json.ret == "089") {
		   alert("기간 내(10/12~18) 찐트렌드 상품 1개 이상 구매 시 응모 가능합니다.");
	   } else {
		   alert(json.message);		   
	   }
	   
       //팝업 화면을 종료한다.
       mplanshop.eventDetail.eventCloseLayer();
   }
}