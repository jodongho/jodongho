$.namespace("common.loadPage");
common.loadPage = {

        selector : "",
        keySavedHtml : "",
        keySavedPagePos : "",
        keySavedPageIdx : "",
        keySavedClass : "",
        hashNm : "",
        
        hasSaved : false,
        
        init : function(selector, pageNm) {
            var hash = location.hash;
            
            common.loadPage.keySavedHtml = "saved_html_" + pageNm;
            common.loadPage.keySavedPagePos = "saved_page_pos_" + pageNm;
            common.loadPage.keySavedPageIdx = "saved_page_idx_" + pageNm;
            common.loadPage.keySavedClass = "saved_page_class_" + pageNm;
            common.loadPage.hashNm = "#load_" + pageNm;

            //해시 여부로 최초 진입여부 판단
            if (hash == "") {
                //페이지 최초 진입으로 판단되면 세션에 저장된 정보 제거함.
                sessionStorage.removeItem(common.loadPage.keySavedHtml);
                sessionStorage.removeItem(common.loadPage.keySavedPagePos);
                sessionStorage.removeItem(common.loadPage.keySavedPageIdx);
                sessionStorage.removeItem(common.loadPage.keySavedClass);
                
                //해시 추가처리.
                history.replaceState(null, null, common.loadPage.hashNm);

            }
            
            common.loadPage.selector = selector;
            
        },
        
        bindEvent : function() {
            //링크에 페이지 정보 저장 바인드 처리
            $(common.loadPage.selector).find("a").unbind("click", common.loadPage.setPagePos);
            $(common.loadPage.selector).find("a").bind("click", common.loadPage.setPagePos);
            $(common.loadPage.selector).find("button").unbind("click", common.loadPage.setPagePos);
            $(common.loadPage.selector).find("button").bind("click", common.loadPage.setPagePos);
        },
        
        setSavedHtml : function() {
            var hash = location.hash;
            
            if (hash == common.loadPage.hashNm) {
                //해시가 있을 경우 세션스토리지에서 페이지 정보 유무 조회
                var savedHtml = sessionStorage.getItem(common.loadPage.keySavedHtml);
                var savedPagePos = sessionStorage.getItem(common.loadPage.keySavedPagePos);
                var savedClass = sessionStorage.getItem(common.loadPage.keySavedClass);
                
                if (!common.isEmpty(savedHtml) && !common.isEmpty(savedPagePos)) {
                    common.loadPage.hasSaved = true;
                    
                    $(common.loadPage.selector).html(savedHtml);
                    
                    if (!common.isEmpty(savedClass)) {
                        $(common.loadPage.selector).attr("class", savedClass);
                    }
                    
                    $(common.loadPage.selector).find("img.completed-scroll-lazyload").addClass("scroll-lazyload").removeClass("completed-scroll-lazyload");
                    $(common.loadPage.selector).find("img.completed-seq-lazyload").addClass("seq-lazyload").removeClass("completed-seq-lazyload");
                    
                    sessionStorage.removeItem(common.loadPage.keySavedHtml);
                    sessionStorage.removeItem(common.loadPage.keySavedClass);
                    
                    common.loadPage.moveScrollY();
                    
                    return true;
                } else {
                    //정상적인 정보가 아니므로 제거함.
                    sessionStorage.removeItem(common.loadPage.keySavedHtml);
                    sessionStorage.removeItem(common.loadPage.keySavedPagePos);
                    sessionStorage.removeItem(common.loadPage.keySavedPageIdx);
                    sessionStorage.removeItem(common.loadPage.keySavedClass);

                }
            }
            
            return false;
        },
        
        /**
         * 페이지 링크 시 현재 페이지 정보 저장 (history back 관련)
         * 모든 메인페이지 내의 링크에 대해 onclick event 를 bind함.
         */
        setPagePos : function () {

            //사파리 private mode 예외처리용
            try {
                sessionStorage.setItem(common.loadPage.keySavedHtml, $(common.loadPage.selector).html());
            } catch (e) {}

            //사파리 private mode 예외처리용
            try {
                //현재 페이지의 scroll 처리를 위한 높이 정보 저장
                sessionStorage.setItem(common.loadPage.keySavedPagePos, common.getNowScroll().Y);
            } catch (e) {
                console.log("fail saved info");
            }
            
            try {
                sessionStorage.setItem(common.loadPage.keySavedClass, $(common.loadPage.selector).attr("class"));
            } catch (e) {}

        },

        /**
         * 페이지 Idx 수정
         */
        setPageIdx : function (pageIdx) {

            //사파리 private mode 예외처리용
            try {
                sessionStorage.setItem(common.loadPage.keySavedPageIdx, pageIdx);
            } catch (e) {}
        },
        
        /**
         * 페이지 Idx 수정
         */
        getPageIdx : function (pageIdx) {

            //사파리 private mode 예외처리용
            try {
                var pageIdx = sessionStorage.getItem(common.loadPage.keySavedPageIdx);
                
                if (pageIdx != undefined && pageIdx != null && pageIdx != "") {
                    return parseInt(pageIdx);
                } else {
                    return 0;
                }
                return 
            } catch (e) {
                return 0;
            }
        },
        

        /**
         * 위치 보정
         */
        moveScrollY : function() {
            setTimeout(function() {
                try{
                    var varNowScrollY = parseInt(sessionStorage.getItem(common.loadPage.keySavedPagePos));

                    if((varNowScrollY > 0)){
                        $(window).scrollTop(varNowScrollY);
                        sessionStorage.removeItem(common.loadPage.keySavedPagePos);
                    }
                }catch(e){}
            }, 900);
        },
        
};
