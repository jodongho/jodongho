var ScrollPager = (function($) {
    
    /* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
       bottomScroll : 스크롤 이벤트 발생위치
       pageIndex    : paging 번호
       initCall     : 페이지로딩시 호출 여부
       callback     : 콜백함수
       ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
    var lastScroll  = 0
       ,isExecuting = false
       ,options     = {bottomScroll : 0
                      ,pageIndex    : 1
                      ,initCall     : false};

    var init = function(params) {
        
        options.pageIndex = 1;
        
        options = $.extend(options, params);
        
        $(document).bind('scroll touchmove', getData);
        /*
        document.addEventListener('scroll', function(e) {
            getData();
        }, true);
        */        
        if(!options.initCall) return;
            
        options.callback();
        
        options.initCall = false;
    };
    
    var currPageIndex = function(){
        
        return options.pageIndex;
    };
    
    var nextPageIndex = function(){
        
        return options.pageIndex + 1;
    };
    
    var getData = function(){
        
        if(!validator()) return;
        
        isExecuting = true;
            
        setTimeout(function(){
            isExecuting = false;
        },1000);
        
        lastScroll = scroll;
        
        options.callback();
        
        options.pageIndex += 1;
        
        $(window).resize();
    };
    
    var validator = function(){
        
        if(isExecuting) return false;
        
        var scroll = $(document).scrollTop()
           ,height = $(document).height();

        if(scroll == 0 || lastScroll >= scroll) return false;
        
        if(height - screen.height - scroll >= options.bottomScroll) return false;
            
        if(typeof options.callback == undefined || typeof options.callback != 'function') return false;
        
        return true;
    };
    
    var unbindScrollEvent = function() {
        
        $(document).unbind('scroll touchmove', getData);
    };
    
    return {
        init : init,
        currPageIndex : currPageIndex,
        nextPageIndex : nextPageIndex,
        unbindEvent : unbindScrollEvent
    };
}(jQuery));