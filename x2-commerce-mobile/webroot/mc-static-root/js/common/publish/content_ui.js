if (!Array.prototype.indexOf){
    Array.prototype.indexOf = function(elt /*, from*/)
    {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
// 개발/QA용 CSS File insert
if(location.href.indexOf('//www.oliveyoung.co.kr') == -1 && location.href.indexOf('//m.oliveyoung.co.kr') == -1 && location.href.indexOf('//ma.oliveyoung.co.kr') == -1){
    document.querySelector('html').className += ' ui-qa';
    var header = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    header.appendChild(link);
    link.href = '/mc-static-root/css/dev.css';
    link.rel = 'stylesheet';
}
//stg checked
if(location.href.indexOf('//mstg.oliveyoung.co.kr') == 6){
    $('body').append('<div class="stg_flag"><span>STG</span></div>')
}
$(document).ready(function(){
    // mobile os 체크
    function checkMobile(){
        var varUA = navigator.userAgent.toLowerCase();

        if ( varUA.indexOf('android') > -1) {
            return "android";
        } else if ( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
            return "ios";
        } else {
            return "other";
        }
    }
    
    // is-scroll-up 존재할 시 해당 영역으로 scroll 위치 변경
    /*var $mHeaderHeight = $('#mHeader').outerHeight();
    
    if($('.is-scroll-up').length > 0 && window.pageYOffset < $mHeaderHeight){
        setTimeout(function() {
            if(window.pageYOffset < $mHeaderHeight){
                var anchor_pos = $('.is-scroll-up').offset().top - window.pageYOffset;
                var start = null;
                
                var appScrollReInit = function(){
                   var setScrollView = setInterval(function() {
                       if($('#mWrapper').hasClass('is-motion') && window.pageYOffset < $mHeaderHeight){
                            if($(document).scrollTop() == 0){
                                $(document).scrollTop(2);
                            } else {
                                clearInterval(setScrollView);
                            }
                       }
                   }, 100);
                }
                
                $('#mWrapper').addClass('is-motion').css({'transition': 'margin-top .5s', 'margin-top': -(anchor_pos) + 'px'});
                
                if(common.app.appInfo.isapp && checkMobile() == "android"){
                    
                    $('#mWrapper').one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                        setTimeout(function(){
                            appScrollReInit();
                        }, 100);
                    });
                    
                    $(window).load(function(){
                        setTimeout(function(){
                            appScrollReInit();
                        }, 100);
                    });
                    
                    
                    $('#mFixTab a, #mSubGnb a').on("click", function(e){
                       setTimeout(function(){
                           appScrollReInit();
                       }, 300);
                    });
                    
                    $('.popLayerWrap').on('click', 'button, a', function(){
                       setTimeout(function(){
                           appScrollReInit();
                       }, 300);
                    })
                }

                window.addEventListener('touchstart', function(e) {
                    start = e.changedTouches[0];
                });
                
                window.addEventListener('touchmove', function(e) {
                  var end = e.changedTouches[0];
                  if(end.screenY - start.screenY > 0) {
                      $('#mWrapper').removeClass('is-motion').css({'transition' : 'margin-top .3s', 'margin-top': 0});
                  } else if(end.screenY - start.screenY < 0) {
                      
                  }
                });
                
                $('#fixBtn .btnTop').on('click', function(e){
                    $('#mWrapper').removeClass('is-motion').css({'transition' : 'margin-top .3s', 'margin-top': 0});
                });
            }
            
        }, 500);
    } jsp 는 클래스 적용 */

    if($("#gcReceiptPopup").length && checkMobile() == "android") {
        $("#gcReceiptPopup").addClass('is-android');
        $('#gcReceiptPopup .btn-wrap').prepend('<div id="title_container"><h1 style="display: none">CJ올리브네트웍스 전자결제 서비스</h1></div>')
    }
    
    //TOP 버튼 추가
    $('#fixBtn .btnTop').click(function(e){
        e.preventDefault();
         $('html,body').stop().animate({scrollTop:0},200);
    });

       //TOP 버튼 추가
    $('#fixBtn .btnBack').click(function(e){
        e.preventDefault();
        history.back();
    });
    
    //상품상세 상단 개선
    var headfix = $('#headfix');
    if(headfix.length > 0){
        var nowScroll = $(window).scrollTop();
        var headfix_h = headfix.height();
        if(nowScroll>headfix_h){
            headfix.addClass('on');
        }
        $(window).scroll(function(){
            var scroll = $(window).scrollTop();
            if(scroll>0){
                headfix.addClass('on');
            }else{
                headfix.removeClass('on');
            }
        });
    }
    
    var oyoHeader = {

        wrap : null,
        mHeader : null,
        mHeader_h : null,
        init_h : null,
        pg_type : null,
        cur_pos : null,
        pre_pos : null,
        mainTab : null,
        mSubGnb : null,
        mSubGnb_h : null,
        mSubGnb_pos : null,
        mSorting : null,
        mSorting_h : null,
        mSorting_pos : null,
        mContent : null,
        mfixBtn : null,
        mFooterTab : null,
        mGiftSticky : null,
        mManban : null,

        init : function(){
           oyoHeader.wrap = $('#mWrapper');
           oyoHeader.mHeader = $('#mHeader');                                         //헤더
           oyoHeader.mHeader_h = oyoHeader.mHeader.height();                                        //헤더 높이
           oyoHeader.init_h = 5;          //스크롤 최소 값
           oyoHeader.mfixBtn = $('#fixBtn');
           oyoHeader.mFooterTab = $('#footerTab');
           oyoHeader.mGiftSticky = $('#giftSticky');
           oyoHeader.mManban = $('#man_sticky');
           oyoHeader.mAppPushban = $('#appPush_sticky');
           oyoHeader.ua = navigator.userAgent.toLowerCase();
           oyoHeader.isSafari = false;

           oyoHeader.pg_type = oyoHeader.mHeader.hasClass('ixHead') ? 'main' : 'sub';        //페이지타입(메인/서브)

           oyoHeader.cur_pos = $(window).scrollTop();                             //현재 스크롤 위치
           oyoHeader.pre_pos = oyoHeader.cur_pos;                                           //이전 스크롤 위치(초기값은 현재와 동일)

           //메인 탭 고정
           oyoHeader.mainTab = $('#mFixTab');
           
           try{
               oyoHeader.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
           }
           catch(err) {}
           oyoHeader.isSafari = (oyoHeader.isSafari || ((oyoHeader.ua.indexOf('safari') != -1)&& (!(oyoHeader.ua.indexOf('chrome')!= -1) && (oyoHeader.ua.indexOf('version/')!= -1))));

           //서브 GNB 고정
           if($('#mSubGnb').length > 0){
               oyoHeader.mSubGnb = $('#mSubGnb');

               if(oyoHeader.mSubGnb.parent().hasClass('swiper-area')){
                   oyoHeader.mSubGnb = $('.swiper-area');
               }
               oyoHeader.mSubGnb_h = oyoHeader.mSubGnb.height();
               oyoHeader.mSubGnb_pos = oyoHeader.mSubGnb.offset().top;                        //GNB위치
           }

           //기획전 Sorting 고정
           if($('.temaSoting').length > 0){
               oyoHeader.mSorting = $('.temaSoting');
               oyoHeader.mSorting_h = oyoHeader.mSorting.height();
               oyoHeader.mSorting_pos = oyoHeader.mSorting.offset().top;
           }

           oyoHeader.mContent = $('#mContents');

           this.addEvent();

           this.searchEvent();

           setTimeout(function() {
               oyoHeader.initEvent();
           }, 10);
        },

        addEvent : function(){

            $(window).resize(function(){                    //페이지 리사이징할 경우(가로/세로모드 변경할 경우)
                //메인 탭 고정
                oyoHeader.mainTab = $('#mFixTab');

                oyoHeader.mHeader_h = oyoHeader.mHeader.height();

                oyoHeader.cur_pos = $(window).scrollTop();
                oyoHeader.pre_pos = oyoHeader.cur_pos;

                if($('#mSubGnb').length > 0){
                    oyoHeader.mSubGnb = $('#mSubGnb');

                    if(oyoHeader.mSubGnb.parent().hasClass('swiper-area')){
                        oyoHeader.mSubGnb = $('.swiper-area');
                    }

                    if(!oyoHeader.mSubGnb.hasClass('fixArea')){
                        oyoHeader.mSubGnb_h = oyoHeader.mSubGnb.height();
                        oyoHeader.mSubGnb_pos = oyoHeader.mSubGnb.offset().top;
                    }else{
                        oyoHeader.mSubGnb_h = oyoHeader.mSubGnb.height();
                        oyoHeader.mSubGnb_pos = oyoHeader.mContent.offset().top - oyoHeader.mSubGnb_h;
                    }
                }

                if($('.temaSoting').length > 0){
                    oyoHeader.mSorting = $('.temaSoting');
                    if(!oyoHeader.mSorting.hasClass('fixArea')){
                        oyoHeader.mSorting_h = oyoHeader.mSorting.height();
                        oyoHeader.mSorting_pos = oyoHeader.mSorting.offset().top;
                    }else{
                        oyoHeader.mSorting_h = oyoHeader.mSorting.height();
                        oyoHeader.mSorting_pos = oyoHeader.mSorting.nextAll('.temaBox').eq(0).offset().top - oyoHeader.mSorting_h;

                    }

                }
            });

            $(window).scroll(function(){
                //메인 탭 고정

//                var scrollH = $('#mContents').offset().top;
                var scrollH = 100;
                //alert(scrollH)
                if(scrollH < $(window).scrollTop()){
                    $('#fixBtn').show();
                }else{
                    $('#fixBtn').hide();
                }
                oyoHeader.mainTab = $('#mFixTab');

                oyoHeader.cur_pos = $(window).scrollTop();                            //스크롤하면 현재 스크롤 위치를 저장

                //BI Renewal. 20190918. nobbyjin. - 유틸바추가:기프트관 추가 202002
                //if($('#footerTab').length > 0 && oyoHeader.mGiftSticky.length<=0){
                if($('#footerTab').length > 0){
                    if(oyoHeader.cur_pos > oyoHeader.pre_pos && oyoHeader.cur_pos > oyoHeader.mHeader_h){//스크롤을 ↓
                        oyoHeader.mFooterTab.removeClass('on');//유틸바추가                        
                        if(oyoHeader.mGiftSticky.length>0){
                            if(!oyoHeader.mGiftSticky.hasClass('fhide')){
                                oyoHeader.mGiftSticky.addClass('on');
                            }
                            if($('#giftSticky').hasClass('on') === true) {
                                oyoHeader.mfixBtn.removeAttr('class').addClass('giftOn');
                            }
                        }                        
                        if(!oyoHeader.mFooterTab.hasClass('fhide')){
                            oyoHeader.mfixBtn.removeClass('on');
                            // 201912
                            if($(location).attr('pathname') == '/m/store/getStoreMain.do'){
                                /*$(".fvPop_search").show();*/
                                $(".fvPop_search").removeClass("on");
                            }
                        }
                        if($('#man_sticky').length>0 || $('#appPush_sticky').length>0){
                            oyoHeader.mfixBtn.removeClass('manban');
                        }//남성관 추가
                    }else if(oyoHeader.cur_pos + $(window).height() < $(document).height()){                        
                        if(oyoHeader.mGiftSticky.length>0){
                            var _gap = 10;
                            var _possc = oyoHeader.pre_pos - oyoHeader.cur_pos;
                            if(oyoHeader.isSafari){
                                if(Math.abs(_possc>=_gap)){
                                    oyoHeader.mGiftSticky.removeClass('on');
                                    oyoHeader.hideFooterTab();
                                    //console.log('safari');
                                }
                            }else{
                                //console.log('!safari');
                                oyoHeader.mGiftSticky.removeClass('on');
                                oyoHeader.hideFooterTab();
                            }                           
                        }else{
                            oyoHeader.hideFooterTab();
                        }
                        if($('#man_sticky').length>0 || $('#appPush_sticky').length>0){
                            oyoHeader.mfixBtn.addClass('manban');
                        }//남성관 추가                        
                    }
                }

                if(oyoHeader.pg_type == 'main'){                                //현재 접근한 페이지가 메인이라면

                    if(Math.abs(oyoHeader.pre_pos - oyoHeader.cur_pos) <= oyoHeader.init_h) return;

                    if(oyoHeader.cur_pos < oyoHeader.init_h){
                        oyoHeader.mHeader.removeClass('change_top');
                    }else{
                        oyoHeader.mHeader.addClass('change_top');
                    }

                    if(oyoHeader.cur_pos > oyoHeader.pre_pos && oyoHeader.cur_pos > oyoHeader.mHeader_h){               //스크롤을 ↓
                        oyoHeader.mHeader.addClass('scroll_down');
                        // oyoHeader.mainTab.addClass('scroll_down');
                        // $('#fixBtn').show();

                        //앱다운로드 배너 추가건
                        if($('#webBanner_main').css("display") == 'block'){
                            oyoHeader.mHeader.addClass('scroll_down2');
                        }else{
                            if($('#webBanner_main').css("display") == 'none'){
                                oyoHeader.mHeader.addClass('scroll_down');
                            }
                        }

                    }else{                                                      //스크롤을 ↑
                        if(oyoHeader.cur_pos + $(window).height() < $(document).height()){
                            oyoHeader.mHeader.removeClass('scroll_down');
                            oyoHeader.mHeader.removeClass('scroll_down2'); //앱다운로드 배너 추가건
                            // oyoHeader.mainTab.removeClass('scroll_down');
                            // $('#fixBtn').hide();
                        }
                    }
                }else{                                                     //현재 접근한 페이지가 서브라면
                    if($('#mSubGnb').length > 0){
                        oyoHeader.mSubGnb = $('#mSubGnb');

                        if(oyoHeader.mSubGnb.parent().hasClass('swiper-area')){
                            oyoHeader.mSubGnb = $('.swiper-area');
                        }

                        if(oyoHeader.cur_pos > oyoHeader.pre_pos && oyoHeader.cur_pos >= oyoHeader.mSubGnb_pos){
                            oyoHeader.mSubGnb.addClass('fixArea');
                            //oyoHeader.mContent.css({'margin-top':oyoHeader.mSubGnb_h +'px'});
//                          $('#fixBtn').show();
                        }else if(oyoHeader.cur_pos <= oyoHeader.mSubGnb_pos){
                            oyoHeader.mSubGnb.removeClass('fixArea');
                            //oyoHeader.mContent.css({'margin-top':'0'});
//                          $('#fixBtn').hide();
                        }
                    }else if($('.temaSoting').length > 0){
                        oyoHeader.mSorting = $('.temaSoting');
                        if(oyoHeader.cur_pos > oyoHeader.pre_pos && oyoHeader.cur_pos >= oyoHeader.mSorting_pos){
                            oyoHeader.mSorting.addClass('fixArea');
//                          $('#fixBtn').show();

                            //기획전 상단 공백 제거
                            oyoHeader.mSorting.nextAll('.temaBox').eq(0).css({'margin-top':oyoHeader.mSorting_h +'px'});
                        }else if(oyoHeader.cur_pos <= oyoHeader.mSorting_pos){
                            oyoHeader.mSorting.removeClass('fixArea');                            
                            oyoHeader.mSorting.nextAll('.temaBox').css({'margin-top':'0'});
//                          $('#fixBtn').hide();
                        }

                    }
                    if($('#fixedSearch').length > 0){
                        if(oyoHeader.cur_pos > oyoHeader.pre_pos && oyoHeader.cur_pos >= oyoHeader.mSubGnb_pos){
                            oyoHeader.mSubGnb.addClass('fixArea');
                        }else if(oyoHeader.cur_pos <= oyoHeader.mSubGnb_pos){
                            oyoHeader.mSubGnb.removeClass('fixArea');
                        }
                    }
                }

                //2020-07-24 아래로 당길때 
                if ( oyoHeader.cur_pos < 0 ) {
                    oyoHeader.mHeader.addClass("minus");
                } else {
                    oyoHeader.mHeader.removeClass("minus");
                };

                oyoHeader.pre_pos = oyoHeader.cur_pos;
            });
        },
        //기프트관 추가 202002
        hideFooterTab : function(){
            oyoHeader.mFooterTab.addClass('on');//유틸바추가                        
            if(!oyoHeader.mFooterTab.hasClass('fhide')){
                oyoHeader.mfixBtn.addClass('on');
                oyoHeader.mfixBtn.removeClass('giftOn');
                if($(location).attr('pathname') == '/m/store/getStoreMain.do'){
                    $(".fvPop_search").addClass("on");
                }
            }
        },
        initEvent : function(){
            /* BI Renewal. 20190918. - 타이틀 위치 자동 스크롤 기능 제거 처리
            if(!window.location.href.match("evtTab")){  //2018.04.16 이벤트 페이지 접근 시 탭 이동이 필요한 경우는 타이틀 위치로 스크롤 되는 부분을 타면 안됨
                if($('#titConts').length > 0){          //타이틀이 있는 페이지는 타이틀 위치로 스크롤
                    if($('#webBanner_detail').css("display") == 'none'){ //배너가 없을경우만 스크롤조정
                        var anchor_pos = $('#titConts').offset().top;
                        $('body').delay(100).animate({'scrollTop' : anchor_pos +'px'}, 300);
                    }
                }
            }
            */
            //BI + 타이틀 페이지(2depth) 타이틀로 스크롤 - 20191219
            
            if(oyoHeader.pg_type == 'main'){
                if(oyoHeader.cur_pos > oyoHeader.init_h){
                    oyoHeader.mHeader.addClass('change_top');
                }
            }
        },
// 2017-02-17 여기서 부터 ~
        searchEvent : function(){

            if($('#fixedSearch').length > 0){                                  //검색 상단 스크롤 고정
                var anchor_pos = $('#fixedSearch').offset().top;
                $('html, body').delay(100).animate({'scrollTop' : anchor_pos +'px'}, 300);
            }
            if(oyoHeader.pg_type == 'main'){
                if(oyoHeader.cur_pos > oyoHeader.init_h){
                    oyoHeader.mHeader.addClass('change_top');
                }
            }
        }
// 2017-02-17 ~ 여기까지 추가
    }

    $('#mHeader').length && oyoHeader.init();



    var fn_load = function(){

        //로딩이미지 배열
        var img_arr = ['../../image/comm/loading_1.png', '../../image/comm/loading_2.png', '../../image/comm/loading_3.png', '../../image/comm/loading_4.png', '../../image/comm/loading_5.png', '../../image/comm/loading_6.png'];
        var load_val = true;
        var arr_no = 1;

        $('.loading_ico').css({'background-image':'url('+ img_arr[0] +')'});
        var show = $('.loading_ico').show()
        setInterval(function(){

            if(load_val){
                $('.loading_ico').css({'transform':'rotateY(90deg)'});
                load_val = false;
            }else{
                if(arr_no >= 6) arr_no = 0;
                $('.loading_ico').css({'background-image':'url('+ img_arr[arr_no] +')', 'transform':'rotateY(0)'});
                arr_no ++;
                load_val = true;
            }


        }, 400);


        if(show){
            $('.dim').show();
        }else {
            $('.dim').hide();
        }
    };
//  fn_load();


    //상세보기 탭 고정
    if($('#tabContsWrap').length>0){
        //var tab_pos = $('.line_tab_list').offset().top;//상세정보 탭 위치
        var tab_pos = $('.prd_more_info').offset().top;
        fnsetTab(tab_pos);

        $(window).scroll(function(){
            fnsetTab(tab_pos);
        });
    }
    function fnsetTab(tab_pos){
        var scr_pos = $(document).scrollTop();//현재 스크롤 위치
        if(tab_pos <= scr_pos){
            $('.line_tab_list').addClass('fixed');
            $('.line_tab_cont').addClass('fixed');
            if($('.on_delivery').length > 0){
                $('#fixBtn').show().css({'bottom':'170px'});//당일 배송 추가
                $('#related_items').css('bottom', '175px');
            }else{
                $('#fixBtn').show().css({'bottom':'130px'});
                $('#related_items').css('bottom', '135px');
            }
        }else{
            $('.line_tab_list').removeClass('fixed');
            $('.line_tab_cont').removeClass('fixed');
            $('#fixBtn').hide();
            if($('.on_delivery').length > 0){
                $('#related_items').css('bottom', '120px');
            }else{
                $('#related_items').css('bottom', '80px');
            }
                        
        }
        
    }

});