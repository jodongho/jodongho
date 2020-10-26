// 개발/QA용 CSS File insert
if(location.origin.indexOf('//www.oliveyoung.co.kr') == -1 && location.origin.indexOf('//m.oliveyoung.co.kr') == -1){
    document.querySelector('html').classList.add('ui-qa');
    document.querySelector('head').innerHTML += '<link rel="stylesheet" href="'+location.origin+'/mc-static-root/css/dev.css" type="text/css">';
}

$(document).ready(function(){

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

        init : function(){
           oyoHeader.wrap = $('#mWrapper');
           oyoHeader.mHeader = $('#mHeader');                                         //헤더
           oyoHeader.mHeader_h = oyoHeader.mHeader.height();                                        //헤더 높이
           oyoHeader.init_h = 5;          //스크롤 최소 값
           oyoHeader.mfixBtn = $('#fixBtn');
           oyoHeader.mFooterTab = $('#footerTab');
           oyoHeader.mGiftSticky = $('#giftSticky');

           oyoHeader.pg_type = oyoHeader.mHeader.hasClass('ixHead') ? 'main' : 'sub';        //페이지타입(메인/서브)

           oyoHeader.cur_pos = $(window).scrollTop();                             //현재 스크롤 위치
           oyoHeader.pre_pos = oyoHeader.cur_pos;                                           //이전 스크롤 위치(초기값은 현재와 동일)

           //메인 탭 고정
           oyoHeader.mainTab = $('#mFixTab');

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

                //BI Renewal. 20190918. nobbyjin. - 유틸바추가
                if($('#footerTab').length > 0){
                    if(oyoHeader.cur_pos > oyoHeader.pre_pos && oyoHeader.cur_pos > oyoHeader.mHeader_h){//스크롤을 ↓
                        oyoHeader.mFooterTab.removeClass('on');//유틸바추가                        
                        if(oyoHeader.mGiftSticky.length>0){
                            if(!oyoHeader.mGiftSticky.hasClass('fhide')){
                                oyoHeader.mGiftSticky.addClass('on');
                                //setCloseSticky();
                            }
                            if($('#giftSticky').hasClass('on') === true) {
                                oyoHeader.mfixBtn.removeAttr('class').addClass('giftOn');
                            }
                        }//기프트관 추가                        
                        if(!oyoHeader.mFooterTab.hasClass('fhide')){
                            oyoHeader.mfixBtn.removeClass('on');
                            // 201912
                            if($(location).attr('pathname') == '/m/store/getStoreMain.do'){
                                /*$(".fvPop_search").show();*/
                                $(".fvPop_search").removeClass("on");
                            }
                        }
                    }else if(oyoHeader.cur_pos + $(window).height() < $(document).height()){
                        console.log('document.clientHeight :' +document.clientHeight)
                        console.log('document.scrollHeight :' +document.scrollHeight)
                        console.log('document.scrollTop :' +document.scrollTop)
                        if(!document.clientHeight>document.scrollHeight-document.scrollTop){
                            console.log(0)
                        }else{
                            console.log(1)
                        }
                        oyoHeader.mFooterTab.addClass('on');//유틸바추가
                        oyoHeader.mGiftSticky.removeClass('on');//기프트관 추가
                        if(!oyoHeader.mFooterTab.hasClass('fhide')){
                            oyoHeader.mfixBtn.addClass('on');
                            oyoHeader.mfixBtn.removeClass('giftOn');
                            //201912
                            if($(location).attr('pathname') == '/m/store/getStoreMain.do'){
                                /*$(".fvPop_search").hide();*/
                                $(".fvPop_search").addClass("on");
                            }
                        }
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
                        oyoHeader.mainTab.addClass('scroll_down');
//                      $('#fixBtn').show();

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
                            oyoHeader.mainTab.removeClass('scroll_down');
//                          $('#fixBtn').hide();
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

                oyoHeader.pre_pos = oyoHeader.cur_pos;
            });
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
            
            // is-scroll-up 존재할 시 해당 영역으로 scroll 위치 변경
            window.onload = function(){
                if($('.is-scroll-up').length > 0 && window.scrollY == 0){
                    var anchor_pos = $('.is-scroll-up').offset().top;
                    $('html, body').animate({'scrollTop' : anchor_pos +'px'}, 300);
                }
            }
            
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
    if($('.line_tab_list').length > 0){
        var tab_pos = $('.line_tab_list').offset().top;         //상세정보 탭 위치
        fnsetTab(tab_pos);

        $(window).scroll(function(){
            fnsetTab(tab_pos);
        });
    }
    function fnsetTab(tab_pos){

        var scr_pos = $(document).scrollTop();      //현재 스크롤 위치
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
            // console.log(0);
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
