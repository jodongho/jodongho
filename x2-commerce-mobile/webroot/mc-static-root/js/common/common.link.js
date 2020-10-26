$.namespace("common.link");
common.link = {
    /**
     * 메인 이동
     */
    moveMainHome : function() {
        location.href = _plainUrl + "main/main.do";
    },

    /**
     * 오늘드림 이동
     */
    moveQuick : function() {
        location.href = _plainUrl + "main/getQuickMainList.do";
    },
    /**
     * 기프트관이동
     */
    moveGift : function() {
        location.href = _plainUrl + "main/getGiftMainList.do";
    },
    /**
     * 기프트카드 안내페이지 이동
     */
    moveGiftCardGuide : function() {
        common.wlog("giftcard_mobile_drawer_param");
        n_click_logging( _baseUrl + "?clickarea=giftcard_mobile_drawer_param2");
        location.href = _plainUrl + "giftCardGuide/getGiftCardGuide.do";
    },
    /**
     * 세일 이동
     */
    moveSale : function() {
        location.href = _plainUrl + "main/getSaleList.do";
    },

    /**
     *  멤버십/쿠폰 이동
     */
    moveMembership : function() {
        location.href = _plainUrl + "main/getMembership.do";
    },
    
    /**
     *  쿠폰/멤버십 이동
     */
    moveCoupon : function() {
        location.href = _plainUrl + "main/getCouponList.do";
    },
    
    /**
     *  쿠폰존 이동
     */
    moveCouponZone : function() {
        //location.href = _plainUrl + "mypage/getCouponList.do";
        location.href = _plainUrl + "main/getCouponList.do";
    },
    
    /**
     *  멤버십 등급별 혜택 이동
     */
    getMembershipBenefitInfoMoveUrl : function() {
        location.href = _plainUrl + "main/getMembershipBenefitInfo.do";
    },
    
    /**
     *  탑리뷰어 이동
     */
    moveTopReviewer : function() {
        location.href = _plainUrl +"mypage/getReviewerLounge.do";
    },

    /**
     *  올영체험단 이동
     */
    moveOllyoung : function() {
        location.href = _plainUrl +"main/getOllyoungList.do";
    },
    
    /**
     *  마이페이지 정보수정 이동
     */
    moveMyPageSetting : function() {
        location.href = _plainUrl + "mypage/getMemberInfoChangeForm.do";
    },
    
    /**
     *  올영체험단 리뷰페이지 이동
     */
    moveMyPageOllyoungList : function() {
        location.href = _plainUrl + "mypage/getMyOllyoungList.do";
//      location.href = _plainUrl + "mypage/getMyBeautyList.do";
        
    },
    
    /**
     * 올영체험단 리뷰 작성 이동
     */
    moveMyOllyoungWritePage : function(evtNo,goodsNo,gdasSeq,retUrl) {
        location.href = _plainUrl + "mypage/getGdasEvalForm.do?evtNo="+evtNo+"&goodsNo="+goodsNo+"&gdasSeq="+gdasSeq+"&gdasTpCd=30&gdasSctCd=50&gdasStep=1&retUrl="+retUrl; 
    },
    

    /**
     *  배송지/환불계좌 관리 이동
     */
    moveMyPageDeliveryInfo : function() {
        location.href = _plainUrl + "mypage/getDeliveryInfo.do";
    },

    /**
     *  트렌드 이동
     */
    moveTrend : function() {
        location.href = _plainUrl + "main/getThemeList.do";
    },

    /**
     * 마이페이지 메인 이동
     */
    moveMyPageMain : function() {
        location.href = _plainUrl + "mypage/myPageMain.do";
    },
    
    /**
     * 상품상세 이동
     */
    moveGoodsDetail : function(goodsNo, dispCatNo, trackingCd, rcCode) {
        var param = "?goodsNo=" + goodsNo;
        var giftSearchThemeFlag = trackingCd == null || trackingCd.indexOf("Gift_Search_Theme") < 0 ? false : true;
        if (!common.isEmpty(dispCatNo) && dispCatNo != "orderImg" && dispCatNo != "orderName" && dispCatNo != "oftenGoods") {
            param = param + "&dispCatNo=" + dispCatNo;
            if('90000080001' == dispCatNo){
            	/*if('Gift_Vote_PROD1' == trackingCd){
            		param = param + "&trackingCd=Gift_Vote_PROD1";
            	}else if('Gift_Vote_PROD2' == trackingCd){
            		param = param + "&trackingCd=Gift_Vote_PROD2";
            	}else if('Gift_Search_Vote_PROD' == trackingCd){
            		param = param + "&trackingCd=Gift_Search_Vote_PROD";
            	}else if('Gift_Vote_Result_PROD' == trackingCd){
            		param = param + "&trackingCd=Gift_Vote_Result_PROD";
            	}else if(giftSearchThemeFlag == true || giftSearchThemeFlag == 'true'){
            		param = param + "&trackingCd="+trackingCd;
            	}else{
            		param = param + "&trackingCd=Gift_Main_PROD";
            	}*/
                if (!common.isEmpty(trackingCd)) {
                    param = param + "&trackingCd="+trackingCd;
                }
                if (!common.isEmpty(rcCode)) {
                	param = param + "&rccode="+rcCode;
                }
                
                
            }else{
            	if(trackingCd!=null && trackingCd!=undefined){
            		param = param + "&trackingCd="+trackingCd;
            	}
            }
        }else{
        	if(trackingCd!=null && trackingCd!=undefined){
        		param = param + "&trackingCd="+trackingCd;
        	}
        	
        	// 마이페이지 장바구기 담기 DS 추가로 분기 처리 - [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
        	if(dispCatNo == "orderImg"){
        		common.wlog("mypage_orderlist_themimg");
        	}else if(dispCatNo == "orderName"){
        		common.wlog("mypage_orderlist_goodsNm");
        	}else if(dispCatNo == "oftenGoods"){
        		$(".swiper-slide > div > a").each(function(idx) {
        			$(this).bind("click", function() {
        				common.wlog("mypage_oftenlist_goods" + (idx + 1));
        			});
        		});
        		
        		$(".swiper-slide > p > a").each(function(idx) {
        			$(this).bind("click", function() {
        				common.wlog("mypage_oftenlist_goods" + (idx + 1));
        			});
        		});
        	}
        }
        location.href = _plainUrl + "goods/getGoodsDetail.do" + param;
    },
    
    /**
     * curation 상품상세 이동
     * trackingCd 변수 추가 - [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY)
     */
    moveGoodsDetailCuration : function(goodsNo , dispCatNo, curation, rccode,egcode, egrank, utmSource, utmMedium, utmCampaign, utmContent, trackingCd) {
        var param = "?goodsNo=" + goodsNo;
        if (!common.isEmpty(dispCatNo)) {
            param = param + "&dispCatNo=" + dispCatNo;
        }
        if (!common.isEmpty(curation)) {
            param = param + "&curation=" + curation;
        }
        if (!common.isEmpty(rccode)) {
            param = param + "&rccode=" + rccode;
        }
        if (!common.isEmpty(utmSource)) {
            param = param + "&utm_source=" + utmSource;
        }
        if (!common.isEmpty(utmMedium)) {
            param = param + "&utm_medium=" + utmMedium;
        }
        if (!common.isEmpty(utmCampaign)) {
            param = param + "&utm_campaign=" + utmCampaign;
        }
        if (!common.isEmpty(utmContent)) {
            param = param + "&utm_content=" + utmContent;
        }
        if (!common.isEmpty(egcode)) {
            param = param + "&egcode=" + egcode;
        }
        if (!common.isEmpty(egrank)) {
            param = param + "&egrankcode=" + egrank;
        }
        if (!common.isEmpty(trackingCd)) {
            param = param + "&trackingCd=" + trackingCd;
        }
        location.href = _plainUrl + "goods/getGoodsDetail.do" + param;
    },
    
    /**
     * curation 상품상세 바코드 이동
     */
    moveGoodsDetailBarcodeCuration : function(goodsNo, itemNo, dispCatNo, curation, rccode) {
        var param = "?goodsNo=" + goodsNo;
        if (!common.isEmpty(dispCatNo)) {
            param = param + "&itemNo=" + itemNo;
            param = param + "&dispCatNo=" + dispCatNo;
            param = param + "&curation=" + curation;
            param = param + "&rccode=" + rccode;
        }
        location.href = _plainUrl + "goods/getGoodsDetailBarcode.do" + param;
    },
    
    /**
     * 상품상세(바코드) 이동
     */
    moveGoodsDetailBarcode : function(mastLgcGoodsNo) {
        var param = "?itemNo=" + mastLgcGoodsNo;
        location.href = _plainUrl + "goods/getGoodsDetailBarcode.do" + param;
    },

    /**
     * 기획전/전문관 카테고리로 이동
     * trackingCd 변수 추가 - [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY)
     */
    movePlanShop : function(dispCatNo, trackingCd) {
    	var param = "?dispCatNo=" + dispCatNo;
    	
    	if (!common.isEmpty(trackingCd)) {
            param = param + "&trackingCd=" + trackingCd;
        }
    	
    	location.href = _plainUrl + "planshop/getPlanShopDetail.do"+param;
    },
    /**
     * 연관된 기획전 상세 카테고리로 이동
     */
    moveRelPlanShop : function(dispCatNo, curation) {
        location.href = _plainUrl + "planshop/getPlanShopDetail.do?dispCatNo="+dispCatNo+"&curation="+curation;
    },
    /**
     * 전문관 카테고리
     */
    moveSpcShop : function(dispCatNo) {
        location.href = _plainUrl + "planshop/getSpcShopDetail.do?dispCatNo="+dispCatNo;
    },
    /**
     * 럭셔리 전문관 상품 리스트로 이동 
	 * SR 3344578 프리미엄관 매출 트래킹 추가
     */
    moveLuxurySpcShopGoodsList : function(dispCatNo,setNo){
        location.href = _plainUrl + "planshop/getLuxurySpcShopGoodsList.do?dispCatNo="+dispCatNo+"&setNo="+setNo+"&trackingCd=Premium_Cat_PROD";
    },

    /**
     * 브랜드관카테고리로 이동
     */
    moveBrandShop : function(onlBrndCd) {
        location.href = _plainUrl + "display/getBrandShopDetail.do?onlBrndCd="+onlBrndCd;
    },
    
    /**
     * 브랜드관카테고리로 이동 - [3343897] DS영역분석 집계 누락 확인 요청(CHY)
     */
    moveBrandShopDS : function(onlBrndCd) {
    	common.wlog("search_branddirect");
        location.href = _plainUrl + "display/getBrandShopDetail.do?onlBrndCd="+onlBrndCd;
    },

    /**
     * 베스트 하위 카테고리로 이동
     */
    moveBestCtg : function(dispCatNo) {
        location.href = _plainUrl + "main/main.do#49_" + dispCatNo;
    },
    
    /**
     * 이벤트 탭으로 이동
     */
    moveEventTab : function(tabNo) {
        location.href = _plainUrl + "main/main.do#43_" + tabNo;
    },

    /**
     * 전시카테고리로 이동
     */
    moveCategory : function(dispCatNo) {
        location.href = _plainUrl + "display/getCategoryList.do?dispCatNo="+dispCatNo;
    },

    /**
     * 최근본상품 목록으로 이동
     */
    moveRecentList : function(){
        location.href = _plainUrl + "mypage/getRecentList.do";
    },

    /**
     * 로그인 페이지로 이동
     */
    moveLoginPage : function(authYn, redirectUrl, callPushAgrYn){
        var param = "";
        if (authYn != undefined && authYn != null && authYn != "") {
            param = "?authYn=" + authYn;
        }
        if (redirectUrl != undefined && redirectUrl != null && redirectUrl != "") {
            if (param != "") {
                param = param + "&redirectUrl=" + encodeURIComponent(redirectUrl);
            } else {
                param = "?redirectUrl=" + encodeURIComponent(redirectUrl);
            }
        }
        if(callPushAgrYn != undefined && callPushAgrYn != null && callPushAgrYn != ""){
            param = "?callPushAgrYn="+callPushAgrYn;
        }
        location.href = _secureUrl + "login/loginForm.do" + param;
    },
    
    
    /**
     * 로그인 페이지로 이동
     */
    moveLoginCurationPage : function(authYn, redirectUrl, callPushAgrYn){
        var param = "";
        if (authYn != undefined && authYn != null && authYn != "") {
            param = "?authYn=" + authYn;
        }
        if (redirectUrl != undefined && redirectUrl != null && redirectUrl != "") {
            if (param != "") {
                param = param + "&redirectUrl=" + encodeURIComponent(redirectUrl);
            } else {
                param = "?redirectUrl=" + encodeURIComponent(redirectUrl);
            }
        }
        if(callPushAgrYn != undefined && callPushAgrYn != null && callPushAgrYn != ""){
            param = "?callPushAgrYn="+callPushAgrYn;
        }
        common.wlog("home_curation_login1");
        location.href = _secureUrl + "login/loginForm.do" + param;
    },
    
    /**
     * 성인인증/본인인증 페이지로 이동
     */
    moveRegCertPage : function(authYn,redirectUrl){
        var param = "";
        if (authYn != undefined) {
            param = "?authYn=" + authYn;
            if (redirectUrl != undefined && redirectUrl != null && redirectUrl != "") {
                if (param != "") {
                    param = param + "&redirectUrl=" + encodeURIComponent(redirectUrl);
                } else {
                    param = "?redirectUrl=" + encodeURIComponent(redirectUrl);
                }
            }
            if(common.app.appInfo.isapp){
                var url = _secureUrl + "customer/regCertification.do"+param;
                setTimeout(function() {
                    common.app.callOpenPage("성인인증", url, "N", "Y", "Y");
                }, 200);
                return false;
            }
        }
        location.href = _secureUrl + "customer/regCertification.do" + param;
    },

    /**
     * 로그아웃 페이지로 이동
     */
    moveLogoutPage : function(){
        localStorage.removeItem("setTrackEvent");
        //로그아웃
        /* 3200210  큐레이션 개선 관련 건-레코벨 데이터 송부
         * 로그인 유저에 한해서 피부정보 조회(동의여부 기반 조회)
         * 중복 호출을 막기 위해, localStorage 사용.
         * updateSkinYn은 '프로필-나의 피부 컨디션 정보 변경 시, N으로 변경되며, 'N'에 해당 경우에만 DB를 호출하도록 변경
         * 로그아웃 시에는 localStorage에서 제거
        */ 
        if (localStorage)
            localStorage.removeItem("updateSkinYn");
        
        /* 3212592 12월올영세일_온라인몰 특이현상 점검 및 개선 요청의 件 
         * "login/loginCheckJson.do" 중복 호출을 막기 위한 SessionStorage내, checkLoginStatus등록
         * 만약 checkLoginStatus내에 값이 존재할 경우, 값을 반환한다.
         * 로그 아웃일 경우,  SessionStorage내, checkLoginStatus를 제거한다.
         */     
        sessionStorage.removeItem("checkLoginStatus");      
        window.location.replace(_secureUrl + "login/logout.do");
    },

    /**
     * 장바구니 페이지 이동
     */
    moveCartPage : function(){
    	var quickYn = localStorage.getItem('O2O_CHK');
    	if(!common.isEmpty(quickYn) && quickYn=='Y'){
    		location.href = _secureUrl + "cart/getCart.do?quickYn=Y";
    	}else if(!common.isEmpty(quickYn) && quickYn=='N'){
    		location.href = _secureUrl + "cart/getCart.do?quickYn=N";
    	}else{
    		location.href = _secureUrl + "cart/getCart.do";
    	}     	
    },

    /**
     * 주문배송목록 페이지 이동
     */
    moveOrderList : function(){
        location.href = _secureUrl + "mypage/getOrderList.do";
    },

    /**
     * 고객센터 메인 페이지 이동
     */
    moveCounselMain : function(){
        location.href = _plainUrl + "counsel/main.do";
    },

    /**
     * 매장안내 메인 페이지 이동
     */
    moveStoreMain : function(){
        location.href = _plainUrl + "store/getStoreMain.do";
    },

    /**
     * 공지 이동
     * 관심매장  : 02
     */
    moveNtcList : function(ntcClssCd) {
        if (ntcClssCd == undefined) {
            ntcClssCd = "";
        }
        location.href = _plainUrl + "counsel/getNoticeList.do?ntcClssCd=" + ntcClssCd;
    },

    /**
     * 공지 상세
     */
    moveNtcDetail : function(ntcClssCd, ntcSeq) {
        if (ntcClssCd == undefined) {
            ntcClssCd = "";
        }
        if (ntcSeq == undefined) {
            ntcSeq = "";
        }
        location.href = _plainUrl + "counsel/getNoticeDetail.do?ntcSeq=" + ntcSeq + "&ntcClssCd=" + ntcClssCd;
    },

    /**
     * 검색 메인 이동
     */
    moveSearchMain : function() {

        alert("검색메인 작업 후 redirect 처리예정.");
        return;
    },

    /**
     * 앱 푸시 알림 목록 이동
     */
    moveAppPushHistList : function() {
        
        // 반복적 클릭 방지
        var _link = $(".intro").find("a.notice");
        
        _link.attr("href", "javascript:;");
        
        setTimeout(function() {
            _link.attr("href", "javascript:common.link.moveAppPushHistList();");
        }, 3000);
        
        // 앱 버전 체크 위해 파라미터 추가
        var param = "";
        if (common.app.appInfo.isapp) {
            var osType  = common.app.appInfo.ostype;
            var appVer = common.app.appInfo.appver.replace(/\./gi, "");
            param = "?osType="+osType+"&appVer="+appVer;
        }
        
        location.href = _plainUrl + "push/getAppPushHistList.do"+param;
    },

    /**
     * 개인정보 처리방침 팝업
     */
    callPrivacyPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/privacyAjax.do"
                , null
                , common.link.callBackPrivacyPage
        );
    },

    /**
     * 개인정보 처리방침 팝업 컨텐츠 생성
     */
    callBackPrivacyPage : function (strData){
        $("#pop-full-title").text("개인정보 처리방침");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("개인정보 처리방침", "");
    },

    /**
     * 이용약관 팝업
     */
    callTermsPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/termsAjax.do"
                , null
                , common.link.callBackTermsPage
        );
    },

    /**
     * 이용약관 팝업 컨텐츠 생성
     */
    callBackTermsPage : function (strData){
        $("#pop-full-title").text("이용약관");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("이용약관", "");
    },

    /**
     * 법적고지 팝업
     */
    callLegalPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/legalAjax.do"
                , null
                , common.link.callBackLegalPage
        );
    },

    /**
     * 법적고지 팝업 컨텐츠 생성
     */
    callBackLegalPage : function (strData){
        $("#pop-full-title").text("법적고지");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("법적고지", "");
    },

    /**
     * 청소년 보호 방침 팝업
     */
    callYouthProtectionPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/youthProtectionAjax.do"
                , null
                , common.link.callBackYouthProtectionPage
        );
    },

    /**
     * 청소년 보호 방침 팝업 컨텐츠 생성
     */
    callBackYouthProtectionPage : function (strData){
        $("#pop-full-title").text("청소년 보호 방침");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("청소년 보호 방침", "");
    },

    /**
     * 이메일 무단 수집 거부 팝업
     */
    callDenyEmailPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/denyEmailAjax.do"
                , null
                , common.link.callBackDenyEmailPage
        );
    },

    /**
     * 이메일 무단 수집 거부 컨텐츠 생성
     */
    callBackDenyEmailPage : function (strData){
        $("#pop-full-title").text("이메일 무단 수집 거부");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("이메일 무단 수집 거부", "");
    },

    /**
     * 영상정보처리기기 운영/관리 방침 팝업
     */
    callMultimediaPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/multimediaAjax.do"
                , null
                , common.link.callBackMultimediaPage
        );
    },

    /**
     * 영상정보처리기기 운영/관리 방침 생성
     */
    callBackMultimediaPage : function (strData){
        $("#pop-full-title").text("영상정보처리기기 운영/관리 방침");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("영상정보처리기기 운영/관리 방침", "");
    },

    /**
     * 법적고지 팝업
     */
    callLegalFooterPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/legalFooterAjax.do"
                , null
                , common.link.callBackLegalFooterPage
        );
    },
    /**
     * 법적고지 팝업 컨텐츠 생성
     */
    callBackLegalFooterPage : function (strData){
        $("#pop-full-title").text("법적고지");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("법적고지", "");
    },

    /**
     * 개인정보 수집 및 활용 동의(필수)
     */
    callPrivacyTermPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/privacyTermAjax.do"
                , null
                , common.link.callBackPrivacyTermPage
        );
    },

    /**
     * 개인정보 수집 및 활용 동의(필수)
     */
    callBackPrivacyTermPage : function (strData){
        $("#pop-full-title").text("개인정보 수집 및 활용 동의(필수)");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("개인정보 수집 및 활용 동의(필수)", "");
    },

    /**
     * 20191101. 올리브영 3자동의(필수) 추가
     */
    callOyThirdTermPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/oyThirdTermAjax.do"
                , null
                , common.link.callBackOyThirdTermPage
        );
    },

    /**
     * 20191101. 올리브영 3자동의(필수) 콜백 추가
     */
    callBackOyThirdTermPage : function (strData){
        $("#pop-full-title").text("올리브영 제3자제공 동의");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("올리브영 제3자제공 동의", "");
    },

    /**
     * 20191101. CJ ONE 3자동의(필수) 추가
     */
    callCjoneThirdTermPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/cjoneThirdTermAjax.do"
                , null
                , common.link.callBackOyThirdTermPage
        );
    },

    /**
     * 20191101. CJ ONE 3자동의(필수) 콜백 추가
     */
    callBackCjoneThirdTermPage : function (strData){
        $("#pop-full-title").text("CJ ONE 제3자제공 동의");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("CJ ONE 제3자제공 동의", "");
    },
    
    /**
     * 개인정보 수집 및 활용 동의(선택)
     */
    callPrivacyTermOptPage : function (){
        common.Ajax.sendRequest("POST"
                , _baseUrl + "company/privacyTermOptAjax.do"
                , null
                , common.link.callBackPrivacyTermOptPage
        );
    },

    /**
     * 개인정보 수집 및 활용 동의(필수)
     */
    callBackPrivacyTermOptPage : function (strData){
        $("#pop-full-title").text("개인정보 수집 및 활용 동의(선택)");
        $("#pop-full-contents").empty().append(strData);
        common.setScrollPos();
        common.popFullOpen("개인정보 수집 및 활용 동의(선택)", "");
    },

    /**
     * 이벤트 상세 페이지 이동
     */
    moveEventDetailPage : function (evtNo){
        location.href = _plainUrl + "event/getEventDetail.do?evtNo="+evtNo;
    },

    /**
     * 뷰티테스터 상세 페이지 이동
     */
    moveBeautyDetailPage : function(evtNo) {
        location.href = _plainUrl + "beauty/getBeautyDetail.do?evtNo="+evtNo;
    },

    /**
     * 매장안내 상세 페이지 이동
     */
    moveStoreDetailPage : function(strNo, dist, openYn) {
        location.href = _plainUrl + "store/getStoreDetail.do?strNo="+strNo+"&dist="+dist+"&openYn="+openYn;
    },

    /**
     * 마이 뷰티리스트 페이지 이동
     */
    moveMyBeautyListPage : function(searchMonth,startDate,endDate) {
        location.href = _plainUrl + "mypage/getMyBeautyList.do?searchMonth="+searchMonth+"&startDate="+startDate + "&endDate="+endDate;
    },

    /**
     * 마이 이벤트리트스 페이지 이동
     */
    moveMyEventListPage : function(searchMonth,startDate,endDate) {
        location.href = _plainUrl + "mypage/getMyEventList.do?searchMonth="+searchMonth+"&startDate="+startDate + "&endDate="+endDate;
    },


    /**
     * 마이 페이지 배송지 수정
     */
    moveMyDeliveryInfoPage : function() {
        // 배송지 등록시 생기는 환경변수 제거
        sessionStorage.removeItem("regDeliveryYn");
        
        location.href = _plainUrl + "mypage/getDeliveryInfo.do";
    },

    /**
     * 올리브영 멤버쉽 페이지로 이동
     */
    moveMyMembershipInfoPage : function() {
        location.href = _plainUrl + "customer/getMembershipInfo.do";
    },

    /**
     * 공정거래위원회>정보공개>사업자등록현황>통신판매사업자>상세조회화면 으로 이동
     */
    openFtcBizInfo : function() {
        common.app.callOpenPage("사업자정보확인","http://www.ftc.go.kr/bizCommPop.do?wrkr_no=8098101574","N","N","N");
    },

    /**
     * LGU+ 에스크로
     */
    openLGUPEscrow : function() {
        common.app.callOpenPage("LG U+ 구매안전서비스","https://pgweb.uplus.co.kr/ms/escrow/s_escrowYn.do?mertid=CJS31","N","N","N");
    },
    
    /**
     * 사이버감사실
     */
    openCyberAudit : function() {
        common.app.callOpenPage("사이버 감사실","https://ethics.cj.net/whistles/information","N","Y","N");
        //location.href = _plainUrl + "prvsuser/getCjaudit.do";
    },

    /**
     * 마이 뷰티리스트 페이지 후기작성이동
     */
    moveMyBeautyWritePage : function(evtNo,goodsNo,retUrl) {
        location.href = _plainUrl + "mypage/getGdasEvalForm.do?evtNo="+evtNo+"&goodsNo="+goodsNo+"&gdasTpCd=30&gdasSctCd=30&gdasSeq=&gdasStep=1&retUrl="+retUrl;
    },
    
    /**
     * 마이 회원정보수정 이동
     */
    moveMemberInfoChangePage : function() {
        location.href = _plainUrl + "mypage/getMemberInfoChangeForm.do";
    },
    
    /**
     * 1:1문의 리스트 이동
     */
    moveCounselListPage : function(selectedForm) {
        var param = "";
        if (selectedForm != undefined && selectedForm) {
            param = "?idx=qnaForm";
        }
        location.href = _plainUrl + "counsel/getQnaForm.do" + param;
    },
    
    /**
     * 상품상세 탭으로 이동(리뷰베스트에서 상품 상세 이동시 앵커 처리를 위해 프론트에서 가져옴)
     * trackingCd 변수 추가 - [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY)
     */
    moveGoodsDetailTab : function(goodsNo , dispCatNo, moveTab, trackingCd) {
        var param = "?goodsNo=" + goodsNo;
        if (!common.isEmpty(dispCatNo)) {
            param = param + "&dispCatNo=" + dispCatNo;
        }
        
        if (!common.isEmpty(trackingCd)) {
            param = param + "&trackingCd=" + trackingCd;
        }

        sessionStorage.setItem("moveTab", moveTab);
        location.href = _plainUrl + "goods/getGoodsDetail.do" + param;
    },
    
    /**
     * 공통 URL 이동 ( CONTEXT 이후의 URL로 이동하기 )
     */
    commonMoveUrl : function(url){
    	// trackingCd 변수 추가 - [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY)
    	var trackingCd = $(".planBanner").attr("name");
    	
    	if(!common.isEmpty(trackingCd) && url.indexOf("?") != -1){
    		url = url + "&trackingCd=" + trackingCd;
    	}else if(!common.isEmpty(trackingCd) && url.indexOf("?") == -1){
    		url = url + "?trackingCd=" + trackingCd;
    	}
    	
        location.href = _plainUrl + url;
    },
    
    /**
     * 오늘드림 테마리스트 URL
     */
    moveQuickListUrl : function(themeNo, themeNm, themeType) {
        location.href = _plainUrl + "quick/getMOQuickList.do?themeNo="+themeNo+"&themeNm="+themeNm+"&dispCatNo="+themeNo+"&themeType="+themeType;
    },
    
    /**
     * 카테고리관으로 이동 - 카테고리관 추가 ( 2020.07.01 )
     */
    moveCategoryShop : function(dispCatNo) {
        location.href = _plainUrl + "display/getCategoryShop.do?dispCatNo=" + dispCatNo;
    }
};
