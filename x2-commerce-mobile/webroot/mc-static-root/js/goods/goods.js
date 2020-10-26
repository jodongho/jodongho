$.namespace("mgoods.detail");
/** 상품 상세 페이지 */
mgoods.detail = {
        
        
        // 오늘드림 고도화 2019-11-18 추가
        // 오늘드림 로직 테스트 위한 테스트 사용자 멤버번호 변수
        mbrNo : $("#mbrNo").val(),
        
        //오늘드림 고도화 2019-11-18 추가
        //-- 기본 배송지 매장정보, 배송지 순번 기억하기 위한 변수
        baseStrNo : '999',
        baseMbrDlvpSeq : '999',
        ModifySeq : '', /* 배송지 수정 시 사용*/
        beforeSeq : '', /* 이전 배송지 */
        
        // 오늘드림 고도화 2019-11-18 추가
        //-- getGoodsDetail.jsp 페이지에서 배송 리스트 항목을 클릭한 유무를 알기 위한 변수
        dlvrListSelectedYn : 'N',

        // 오늘드림 고도화 2019-11-18 추가
        //-- 구매하기, 장바구니 버튼 클릭시 가능여부 체크
        validation : 'Y',

        goodsNo : $("#goodsNo").val(),
        dispCatNo : $("#dispCatNo").val(), 
        finalPrc : $("#finalPrc").val(),
        tabPosY : 0,
        optChangeErr : "",
        isNearAvail : true, // 주변매장 가능 여부
        recoBellUseYn : 'N', // 레코벨 사용 여부
        recoBellViewYn : 'N', /* 레코벨 노출 여부 */
        recoBellclickYn : 'N',
        isProcessing : false,
        favorObj : null,
        interval : null,
        snsinit : true,
        swiperinit : true,

        init : function(){
//        	console.log("상품상세 시작");
//            mgoods.detail.setLoGoodsDetailHtml();
//        	console.log("iPrdViewimg",$("#prdViewimg").find(".iPrdViewimg").length);
        	if($("#prdViewimg").find(".iPrdViewimg").length < 1){

        		mgoods.detail.setGoodsDetailHtml();
        		
        		window['isCurationArea002Called'] = 'N';
        		window['isCurationArea003Called'] = 'N';
        		window['isCurationRelatedPlanCalled'] = 'N';

        	}
            
            // 하단 레코벨 추천 상품 조회(일시품절 상품 없는 경우)
            if(mgoods.detail.recoBellUseYn == 'Y' && mgoods.detail.recoBellViewYn == 'Y'){            
                
                $(".dispCatBest").css("display","none");
                
                if($("#crt_more_last_n002").length > 0) {
                	var param = {
                		size : 40, //큐레이션 api 호출용
                		cps : true, //큐레이션 api 호출용
                		cpt : "c001",
                		cpcids : $("#recoBellDispCatNo").val(),
                		viewType : 'HorzPop', // 가로형
                		styleNo : 26, // 템플릿 번호
                		popupYn : "Y",
                		titlRp : $("#eigeneSmlDispName").val(), // 타이틀 replace 텍스트
                		viewArea : 'goodeDetail_soldOutPop',
                		recType : "n002", // 큐레이션 url 정보
                		rccode : "mc_detail_soldout_ac"
                	};
                	
                	// 기존 영역이기 때문에 이벤트 추가만 한다.
                	curation.btnMoreEvent(param);
                }

                // 연관상품 이동
                $('#btnRel').on('click', function(){
                    var _curation_pos = $('#curation_wrap').offset().top - 66;
                    $(document).scrollTop(_curation_pos);
                });
                    
                // 하단 레코벨 추천 상품 조회
                // 스크롤 내려서 하단 레코벨 추천상품 영역에 닿았을때 호출
                // 이때 해당 영역이 display:none 상태이면 안됨..
                $(window).scroll(function() {
                    var wH = $(window).height(),
                        wS = $(this).scrollTop();
                    
                    if(window['isCurationArea002Called'] != 'Y' && $('.curation_area_a002_lead').is(":visible")){                        
                        var offsetTop = $('.curation_area_a002_lead').offset().top;
                        if(wS >  ( offsetTop-wH )){                        
                            // 하단 레코벨 추천상품 호출한적 없는 경우에만 호출한다.
                            mgoods.detail.callRecobell("a002"); // 상단
                            window['isCurationArea002Called'] = 'Y';
                        }                        
                    }
                    
                    if(window['isCurationArea003Called'] != 'Y' && $('.curation_area_a003_lead').is(":visible")){
                        var offsetBtm = $('.curation_area_a003_lead').offset().top;                    
                        if(wS > ( offsetBtm-wH )) {                            
                            // 하단 레코벨 추천상품 호출한적 없는 경우에만 호출한다.
                            mgoods.detail.callRecobell("a003"); // 하단
                            window['isCurationArea003Called'] = 'Y';
                        }                        
                    }
                    
                    if(window['isCurationRelatedPlanCalled'] != 'Y' && $('.related_plan').is(":visible")){
                        var offsetPln = $('.related_plan').offset().top;
                        if(wS > ( offsetPln-wH )) {                            
                            // 하단 레코벨 추천상품 호출한적 없는 경우에만 호출한다.
                            mgoods.detail.relPlanShopAjax(); // 연관된 기획전
                            window['isCurationRelatedPlanCalled'] = 'Y';
                        }                            
                    }
                 });
            } else if(mgoods.detail.recoBellUseYn == 'N'){ // 카테고리 베스트 조회
                mgoods.detail.recommGoodsList();
            }
            
            // 버튼 Bind
            setTimeout(function(){
                mgoods.detail.bindButtonInit();    
            }, 500)
            
            // 상품 정보 LocalStorage 저장
            mgoods.detail.initGoodsHistory();
            
            // SNS init
            
            if(mgoods.detail.snsinit == true){
//            	console.log("aaaaaaa");
            	mgoods.detail.sns.init();
//            	console.log("bbbbb");
            	mgoods.detail.snsinit = false;
            }
            
            // 주변매장 가능 여부 set
            // 앱여부
// alert("common.app.appInfo.isapp = " + common.app.appInfo.isapp);
            if(common.app.appInfo.isapp){
                
                var tempCompareVersion = "";
                
                if (common.app.appInfo.ostype == "10") {
                    tempCompareVersion = '2.1.1'; // ios
                }else if(common.app.appInfo.ostype == "20"){
                    tempCompareVersion = '2.0.9'; // android
                }
                
                // 앱버전 비교
                var varCompareVersion = common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion);
// alert("varCompareVersion = " + varCompareVersion);
                if(varCompareVersion  ==  "<" || varCompareVersion == "="){
                    
                    mgoods.detail.isNearAvail = false;
                    
                }
                
            } // end, if(common.app.appInfo.isapp)
            
            // for test
            // mgoods.detail.isNearAvail = false;
            
            // 201912 fixed
            // 주변매장 기능 사용안할때
            if(!mgoods.detail.isNearAvail){
                /*$("#mTab").removeClass("threeSet").addClass("twoSet");*/
                
                $("#liNearSearch").remove(); // 주변매장 탭li 제거
                /*$("#liStrSearch").addClass("on");*/ // 관심매장 탭 on
                $("#locSearch").addClass("on"); // 가까운 매장 검색 탭 on
                $("#nearStoreStockList").remove(); // 주변매장 div 제거
                
            }

           // 클릭 이벤트시 조회로 변경
           /*
             * var gdasPrhbCatCnt = $("#gdasPrhbCatCnt").val();
             * 
             * if ( gdasPrhbCatCnt != undefined && Number(gdasPrhbCatCnt) < 1 ){ //
             * 상품평 탭 비동기 처리 mgoods.detail.gdasTabInit("N"); }else{ // 제한된 상품평 탭
             * 비동기 처리 $(".prd_review_notice").show();
             * mgoods.detail.gdasTabInit("Y"); }
             */
            // 초기 총 가격과 총 개수 Init
            mgoods.detail.cart.init();
            
            // 클릭 이벤트시 조회로 변경
            // 상품QNA 탭 비동기 처리
            // mgoods.detail.qnaTabInit();
            
            // 추천 상품 조회
            // mgoods.detail.recommGoodsList();
            
            /*var dt = new Date();
            var hour = dt.getHours();
            
            // 오늘드림 기간 제한 ( json data가 잘못입력될수도있으니 try 처리 ) : 오늘드림 고도화로 제외 처리.
            var _o2oBlockInfo = "";
            try{
                _o2oBlockInfo = $.parseJSON($("#o2oBlockInfo").val());
                if(_o2oBlockInfo.o2oBlockYn == "Y"){
                    $("#deliveDay").prop("checked",false);
                    $("#deliveNm").prop("checked",true);
                }
            }catch(e){console.log(e);}
            
            if(hour < $("#quickOrdTimeFrom").val() || hour >=$("#quickOrdTimeTo").val() ){
                $("#deliveDay").prop("checked",false);
                $("#deliveNm").prop("checked",true);
            }*/
            
            // 클릭 이벤트시 조회로 변경
            // 고시항목, KC안전인증검사 비동기 조회
            // mgoods.detail.artcKcListAjax($("#artcGoodsNo").val(),
            // $("#artcItemNo").val(), $("#pkgGoodsYn").val(),
            // $("#previewInfo").val());
            
            // 상품기술서 사이즈 맞추기
            $(".prdViewimg img").removeAttr("style");
            $(".prdViewimg img").css("width","100%");
            
            $(".prdViewimg").show();
            
            // 기술서 HTML init
            $(".controlHolder").empty();
//            $("#markerTest").pinchzoomer();
            
            mgoods.detail.tabPosY = $(".tab_prod_deail").position().top;
            

            // 옵션이 없을 경우 구매하는 수량(INPUT BOX)체크 바인드
            if ( dupItemYn != 'Y'){
                var optionKey = $("#goodsNo").val() + $("#itemNo").val();
                var qtyAddUnit = $("#qtyAddUnit").val();
                var invQty = $("#avalInvQty").val();
                mgoods.detail.cart.cartCntBind(optionKey, qtyAddUnit, invQty, salePrc);
            }
            
            // 상품번호/referrer/ idx 3 탭 저장
            var savedGoodsTabInfo = sessionStorage.getItem("saved_goodsTab"); // ,
                                                                                // mgoods.detail.goodsNo
                                                                                // +
                                                                                // "|"
                                                                                // +
                                                                                // matchKey
                                                                                // +
                                                                                // "|3");
            
            sessionStorage.removeItem("saved_goodsTab"); 
            
            if (savedGoodsTabInfo != undefined && savedGoodsTabInfo != null && savedGoodsTabInfo != "") {
                var tmpSavedInfos = savedGoodsTabInfo.split("|");
                if (tmpSavedInfos.length >= 3 
                        && mgoods.detail.goodsNo == tmpSavedInfos[0]
                        && mKey == tmpSavedInfos[1]) {
                    
                    
                    common.showLoadingLayer(false);
                    setTimeout(function() {
                        window.scroll(0, mgoods.detail.tabPosY);
                        setTimeout(function() {
                            $(".tab_prod_deail li").eq(tmpSavedInfos[2]).find("a").click();
                            common.hideLoadingLayer();
                        }, 1000);
                    }, 1500);
                }
            }
            
          //상품평 
            var savedGdasSession = sessionStorage.getItem("gdasSession");
                sessionStorage.removeItem("gdasSession");
                if(savedGdasSession != undefined && typeof savedGdasSession != 'null' && savedGdasSession != ""){
                if(savedGdasSession){
                    setTimeout(function() {
                        $('.goods_reputation').click();
                    }, 2000);
                }
            }
            
// $(document.body).addClass("userSelectnone");
            // 드래그 방지
// common.preventDrag();
            
            // 클릭 방지
            $(window).load(function(){
                $.fn.disableSelection();
            });
            
            // footer 하단 늘리기 ( 품절일 경우 버튼 차이로 인한 분기 처리 )
            if ( $("#soldOutYn").val() != 'Y'){
                $("#mFooter").css("padding-bottom", "70px");    
            }else{
                $("#mFooter").css("padding-bottom", "60px");
            }
            
            
            // EP 쿠폰 여부
            if ( $("#epCpnYn").val() == 'Y' ){
                var cookieName = "goodsDetailEpCoupon_" + $("input[name='goodsNo']:hidden").val() + "_" + $("input[name='chlNo']:hidden").val();
                var bannInfo = common.bann.getPopInfo(cookieName);
                // 오늘그만 보기 없는경우 && 24시 경과 후
                if (bannInfo == null || (new Date() - bannInfo.regDtime >= (1000 * 60 * 60 * 24))){
                    common.epCouponOpen();
                }
            }
            
            setTimeout(function() {
                // 웹로그 바인딩
                mgoods.detail.bindWebLog();
            },700);
            /* EP쿠폰 오늘그만 보기 */
            $("button[id='goodsDetailEpCoupon']").click(function() {
                common.bann.setPopInfo("goodsDetailEpCoupon_" + $(this).attr("goodsNo"), $(".fulsizePop").attr("data-ref-compareKey"));
                setTimeout(function() {
                    $("body").css("overflow", "visible");
                }, 100);

                $(document).scrollTop(0);
                common.popLayerClose('LAYERPOP01');
            });
            
            var isQuickYn = $("input[name=isQuickYn]").val();
            
            // 새로고침시에 배송지가 선택된 라디오버튼에 따라 다시 셋팅 jwkim
            /*if($("#deliveDay").prop("checked") == true && isQuickYn == "N"){
                
                $("#normDispAmt").addClass("off");
                $("#quickDispAmt").removeClass("off");
                $("#normDlvInfo").addClass("off");
                $("#quickDlvInfo").removeClass("off");
            }else if($("#deliveNm").prop("checked") == true && isQuickYn == "Y"){
                
                $("#normDispAmt").removeClass("off");
                $("#quickDispAmt").addClass("off");
                $("#normDlvInfo").removeClass("off");
                $("#quickDlvInfo").addClass("off");
            }*/
            
            /* 20190919 오늘드림 긴급배포로 인해 주석 처리 시작 */
            // 리뷰 베스트에서 상품 클릭시 상품상세로 왔을 경우 앵커 처리
            //mgoods.detail.paramMoveTab(sessionStorage.getItem("moveTab"));
            /* 20190919 오늘드림 긴급배포로 인해 주석 처리 끝 */
            
            //오늘드림 고도화 오늘드림 체크박스 쿠키
            if(getCookie_search("O2O_CHK") == "Y" && $("#quickYn").val() == "Y"){                
                var qk_today = new Date();
                var qk_stday = new Date(2020, 8, 16, 23, 59);
                var qk_etday = new Date(2020, 8, 23, 23, 59);
                if(qk_today > qk_stday && qk_today < qk_etday) {
                    // 오늘드림 체크박스 차단
                } else {                
                    if(common.isLogin() == true) {
    
                        //  장바구니 개수 체크
                        if($("#dupItemYn").val() != "Y") { // 옵션 상품일 경우 주소지 먼저 체크.
                            if ( mgoods.detail.cart.checkCartCnt() ){
                                // get상품 선택 여부 체크
                                if(!mgoods.detail.cart.checkGetItemSelect()){
                                    return false;
                                }
                            }else{
                                return false;
                            }
                        }
                        
                        $("#deliveDay").attr("checked", true);
                        $(".btn_present").hide(); // 선물하기 버튼 미노출
                        
                        var _o2oBlockInfo = "";
                        try{
                            _o2oBlockInfo = $.parseJSON($("#o2oBlockInfo").val());
                            if(_o2oBlockInfo.o2oBlockYn == "Y"){
                                $("#deliveDay").prop("checked",false);
                                $(".btn_present").show(); // 선물하기 버튼 미노출
                                return;
                            }
                        }catch(e){console.log(e);}
                        
                        $(".today_delive").css("border-bottom","1px solid #e5e5e5");
                        
                        $(".addr_newBox").show();
                        
                        $(".ico_deli_normal").hide();
                        $(".ico_deli_quick").show(); // 배송비 안내 팝업 일반배송, 오늘드림 구분
                        
                        //증정품 안내 MJH
                        //mjh추가
                        $("#giftInfo").hide();
                        $("#quickGiftInfo").show();
                        
                        mgoods.detail.todayDelivery.deliveryCharge();
                        mgoods.detail.todayDelivery.todayDeliveryListOnPage();
                    }
                }
            }else{
                $("#giftInfo").show();//20200612 일반증정 추가   
                $("#quickGiftInfo").hide();
            }
            
            if($("#deliveDay").is(":checked") && isQuickYn == "N") {
                $("#normDispAmt").addClass("off");
                $("#quickDispAmt").removeClass("off");
                $("#normDlvInfo").addClass("off");
                $("#quickDlvInfo").removeClass("off");
            } else if(!$("#deliveDay").is(":checked") && isQuickYn == "Y") {
                $("#normDispAmt").removeClass("off");
                $("#quickDispAmt").addClass("off");
                $("#normDlvInfo").removeClass("off");
                $("#quickDlvInfo").addClass("off");
            }
            
            // deliveDay enabled... 스크립트 로딩 전 미리 클릭 방지
            setTimeout(function(){
                $("#deliveDay").prop("disabled", false);
            }, 800);
            
            $(".dvTime_btn").click(function(event) {
            	event.preventDefault();
            	$(".dvTime_area").toggleClass('on');
            });
            
            // 오늘드림 빠름 평균 배송시간
            mgoods.detail.todayDelivery.quickBaseAddrInfo();
            
        	// 오늘드림 넛지
        	if(!$("#deliveDay").is(":checked")) {
        		mgoods.detail.todayDelivery.quickNudge();
        	}
            
            mgoods.detail.giftBannerChk();
            
            mgoods.detail.viewCopyUrl();
            
          //스와이프 정지, CSS 스크롤 사용
			$('.prd_colorchip_list').on('touchstart, touchmove', function(){
			    tabContsWrap.disableTouchControl();
			});
			$('.prd_colorchip_list').on('touchend', function(){
			    tabContsWrap.enableTouchControl();
			});
			
			// 큐레이션 : 로그인 후 팝업 reload를 위해 스크립트 추가
			var curationReload = localStorage.getItem("curationReload");
	   		curation.reloadEvent();
			
			setTimeout(function() {
		   		if(curationReload != "Y") {
		   			if($("#soldOutYn").val() == "Y" && !$("#deliveDay").is(":checked") && mgoods.detail.recoBellUseYn == 'Y' && mgoods.detail.recoBellViewYn == 'Y') {
		   				mgoods.detail.callEigeneSoldOut("n002", "init");
	                }
		   		}
		   	}, 500);
            
            setTimeout(function() {
    			tabContsWrap.update();
            	zoomSet_h_goodjs();
    		}, 3000);
        },
        viewCopyUrl : function(){
        	
        	if( common.app.appInfo.isapp ){
            	
            	var tempCompareVersion = ""; 
            	
            	if (common.app.appInfo.ostype == "10") { // ios
                    tempCompareVersion = '2.2.8';
                }else if(common.app.appInfo.ostype == "20"){ // android
                    tempCompareVersion = '2.2.3';
                }
                
                var varCompareVersion = common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion);
                
                if(common.app.appInfo.isapp && varCompareVersion == ">"){
                	$("#snsPopUp li a[snsType='url']").after('<p class="txt-url-comp" style="display:none;">URL이 복사되었습니다.</p>');
                	
                }else{
                	$("#snsPopUp li a[snsType='url']").after('<div class="urlCopy" id="urlInfo">'
    									    					+'<p>아래의 URL을 복사해주세요.</p>'
    									    					+'<div class="input-url"><textarea id="CopyUrl" readonly></textarea></div>'
    									    				+'</div>'
                	);
                	$("#CopyUrl").html(common.sns.shareUrl);
                }
        	} else {
            	$("#snsPopUp li a[snsType='url']").after('<div class="urlCopy" id="urlInfo">'
    					+'<p>아래의 URL을 복사해주세요.</p>'
    					+'<div class="input-url"><textarea id="CopyUrl" readonly></textarea></div>'
    				+'</div>'
				);
				$("#CopyUrl").html(common.sns.shareUrl);
        	}
        },
        giftBannerChk : function() {
        	if($("#deliveDay").is(":checked")) {
        		$(".onlineGift").hide();
        		$(".onlineGiftCont").hide();
        		$(".todayGift").show();
        		$(".todayGiftCont").show();
        		
        		$(".onlineGiftCont").parents(".giveawayInfo").css("height", "0px");
        	} else {
        		$(".onlineGift").show();
        		$(".onlineGiftCont").show();
        		$(".todayGift").hide();
        		$(".todayGiftCont").hide();
        		
        		$(".onlineGiftCont").parents(".giveawayInfo").css("height", "initial");
        	}
        },
        barcodeInit : function(){
            
          //상품평
            var savedGdasSession = sessionStorage.getItem("gdasSession");
                sessionStorage.removeItem("gdasSession");
                if(savedGdasSession != undefined && savedGdasSession != null && savedGdasSession != ""){
                if(savedGdasSession){
                    setTimeout(function() {
                        $('.goods_reputation').click();
                    }, 1000);
                }
            }
                
            // 추천 상품 조회(바코드)
            // mgoods.detail.recommGoodsListBarcode();

            // 하단 레코벨 추천 상품 조회(일시품절 상품 없는 경우)
            if(mgoods.detail.recoBellUseYn == 'Y'){
                
                $(".dispCatBest").css("display","none");
                $(".curation_wrap").css("display","block");
                
                // 연관상품 이동
                $('#btnRel').on('click', function(){
                    var _curation_pos = $('#curation_wrap').offset().top - 66;
                    $(document).scrollTop(_curation_pos);
                });
                if($('.go_barcode').length > 0){
                    $('#related_items').css('bottom', '130px');
                }
                $(".btnRel").addClass("btnRel_barcode");
                    
                // 하단 레코벨 추천 상품 조회
                // 스크롤 내려서 하단 레코벨 추천상품 영역에 닿았을때 호출
                // 이때 해당 영역이 display:none 상태이면 안됨..
                $(window).scroll(function() {
                    var offsetTop = $('.curation_area_a002_lead').offset().top,
                        wH = $(window).height(),
                        wS = $(this).scrollTop();
                    
                    if(wS >  ( offsetTop-wH )){
                        if(window['isCurationArea002Called'] != 'Y'){
                            // 하단 레코벨 추천상품 호출한적 없는 경우에만 호출한다.
                            mgoods.detail.callRecobellBarcode("a002"); // 상단
                        }
                        window['isCurationArea002Called'] = 'Y';
                    }
                    
                    var offsetBtm = $('.curation_area_a003_lead').offset().top;                    
                    if(wS > ( offsetBtm-wH )) {
                        if(window['isCurationArea003Called'] != 'Y'){
                            // 하단 레코벨 추천상품 호출한적 없는 경우에만 호출한다.
                            mgoods.detail.callRecobellBarcode("a003"); // 하단
                        }
                        window['isCurationArea003Called'] = 'Y';
                    }
                    
                    var offsetPln = $('.related_plan').offset().top;
                    if(wS > ( offsetPln-wH )) {
                        if(window['isCurationRelatedPlanCalled'] != 'Y'){
                            // 하단 레코벨 추천상품 호출한적 없는 경우에만 호출한다.
                            mgoods.detail.relPlanShopBarcodeAjax(); // 연관된 기획전
                        }
                        window['isCurationRelatedPlanCalled'] = 'Y';
                    }
                });
            } else if(mgoods.detail.recoBellUseYn == 'N'){ // 카테고리 베스트 조회
                mgoods.detail.recommGoodsListBarcode();
            }
            
            // 버튼 Bind
            setTimeout(function(){
                /** 상품설명, 구매정보, 상품평, Q&A 탭 Bind * */
                $('.line_tab_list2').find('a').click(function(e){
                    e.preventDefault();
                    var tab_idx = $(this).parent().index() + 1;
                    $(this).parent().addClass('on').siblings().removeClass('on');
                    $('.line_tab_cont2.tab'+ tab_idx).addClass('show').siblings().removeClass('show');
                    
                    // $(document).scrollTop($(".line_tab_cont2").offset().top);
                    var linkTop = $('.barcode_prd_info').offset().top + 190;
                    $(document).scrollTop(linkTop);
                });
                
                
                /** 한줄상품평, 프리미엄상품평 탭 Bind * */
                $('.sub_tab_list').find('a').click(function(e){
                    e.preventDefault();
                    var tab_idx = $(this).parent().index();
                    $(this).parent().addClass('on').siblings().removeClass('on');
                    $('.sub_tab_cont:eq('+ tab_idx +')').addClass('show').siblings().removeClass('show');
                });
                

                /** 상품고시정보, 반품/교환정보, 배송정보 탭 Bind * */
                $('.listBuyInfo .tit a').click(function(e){
                    e.preventDefault();
                    if($(this).parents('li').hasClass('open')){
                        $(this).parents('li').removeClass('open');
                    }else{
                        
                        $(this).parents('li').siblings().removeClass('open');
                            
                        var tab_h = $('.tab_prod_deail').height();                   
                        var target_pos = $(this).offset().top;
                        
                        target_pos = target_pos - tab_h;
                                            
                        $(this).parents('li').addClass('open');
                        $(window).scrollTop(target_pos);
                    }
                });
                
                /** 바코드스캔 이동 Bind */
                $(".go_barcode").click(function(){
                    window.location.href = "oliveyoungapp://scanBarcode";
                });
                /** 홈 이동 Bind */
                $(".go_home").click(function(){
                    window.location.href = _baseUrl + "main/main.do";
                });
                
            }, 500)
            
            
            // 고시항목, KC안전인증검사 비동기 조회
            mgoods.detail.artcKcListAjax($("#artcGoodsNo").val(), $("#artcItemNo").val(), $("#pkgGoodsYn").val(), $("#previewInfo").val());
            
            
            // 상품기술서 사이즈 맞추기
            $(".prdViewimg img").removeAttr("style");
            $(".prdViewimg img").css("width","100%");
            
            $(".prdViewimg").show();
            
            // 기술서 HTML init
            $(".controlHolder").empty();
//            $("#markerTest").pinchzoomer();
            
            
            mgoods.detail.tabPosY = $(".line_tab_list2").position().top;
            
            // 클릭 방지
            $(window).load(function(){
                $.fn.disableSelection();
            });
            
            $("#mFooter").css("padding-bottom", "60px");

            setTimeout(function() {
                // 웹로그 바인딩
                mgoods.detail.barcodeBindWebLog();
            },700);
            
            
        },
        
        /** 상품 상세 진입 시 최근 본 상품을 위한 LocalStorage에 저장 */
        initGoodsHistory : function(){
            
            var cookie = new Cookie(30);
            var info = {};
            
            var sHistory = cookie.get('productHistory') || '',
                oHistory = sHistory == '' ? [] : $.parseJSON(sHistory),
                oResult  = [{
                    goodsNo  : mgoods.detail.goodsNo, 
                    viewCount: 1
                }];
            if (oHistory instanceof Array) {
                var maxLen = oHistory.length;
                if(maxLen>30) {
                    // MC는 최대 30개 까지만 저장 함.
                    maxLen = 30;
                }
                for (var i=0; i<maxLen; i++) {
                    var item = oHistory[i];
                    // 어디서 새는지.. sHistory에 null 데이터가 들어갈 때가 있음.
                    if(item != null) {
                        if (item.goodsNo == mgoods.detail.goodsNo) {
                            oResult[0].viewCount += item.viewCount;
                        } else {
                            oResult[oResult.length] = item;
                        }    
                    }
                }
            }
            cookie.set('productHistory', JSON.stringify(oResult));
            
            // BI Renewal. 20190918. nobbyjin. - 유틸바용 최근 본 상품 정보
            var oResultL = null;
            try{
                oResultL  = {
                        goodsNo  : mgoods.detail.goodsNo,
                        goodsImg : $("#imgPath140").val()
                };
                cookie.set('productHistoryL', JSON.stringify(oResultL));
            }catch(e){console.log(e);}
        },
        
        bindButtonInit : function(){
            
            var frstClickIdx4 = "N";
            var frstClickIdx3 = "N";
            var frstClickIdx2 = "N";
            
            /** 브랜드관 이동 Bind */
            $("#moveBrandShop").click(function(){
                var onlBrndCd = $("#onlBrndCd").val();
                window.location.href = _baseUrl + 'display/getBrandShopDetail.do?onlBrndCd=' + onlBrndCd;
            });
            
          //브랜드 좋아요 클릭
        	$('.brand_like .icon').unbind("click");

            //브랜드 좋아요 클릭 이벤트
        	$('.brand_like .icon').bind('click', function(){
                    var param = {
                    		onlBrndCd : $(this).attr("data-ref-onlBrndCd")
                    		,layerYn : "N"
                    };
                    
                    var resultData = "";
                    var result = "";
                    	
                    if($(this).hasClass("on")){
                    	resultData = common.wish.delBrndWishLst(param, $(this));
                    }else{
                    	resultData = common.wish.regBrndWishLst(param, $(this));
                    }
                    result = resultData.resultCd;
                    if ( result == '000' ){
                    	mgoods.detail.brndwish.popLayerOpen('wishBrndPopup');    
                    }
            });
            
            /** 상품설명, 구매정보, 상품평, Q&A 탭 Bind * */
//            $('.line_tab_list').find('a').click(function(e){
//                e.preventDefault();
//                var tab_idx = $(this).parent().index() + 1;
//                
//                $(this).parent().addClass('on').siblings().removeClass('on');
//                $('.line_tab_cont.tab'+ tab_idx).addClass('show').siblings().removeClass('show');
//                
//                $(document).scrollTop($(".line_tab_cont").offset().top);
//                // 20200606 CBLIM 상품상세 탭 이동 수정
//                var linkTop = $('.brand_like').offset().top + 55;
//                $(document).scrollTop(linkTop); 
//            });
            
            /** 한줄상품평, 프리미엄상품평 탭 Bind * */
            $('.sub_tab_list').find('a').click(function(e){
                e.preventDefault();
                var tab_idx = $(this).parent().index();
                $(this).parent().addClass('on').siblings().removeClass('on');
                $('.sub_tab_cont:eq('+ tab_idx +')').addClass('show').siblings().removeClass('show');
            });

            /** 상품고시정보, 반품/교환정보, 배송정보 탭 Bind * */
//            $('.listBuyInfo .tit a').click(function(e){
//            	
//            	console.log("여기도");
//                e.preventDefault();
//                if($(this).parents('li').hasClass('open')){
//                    $(this).parents('li').removeClass('open');
//                }else{
//                    
//                    $(this).parents('li').siblings().removeClass('open');
//                        
//                    var tab_h = $('.tab_prod_deail').height();                   
//                    var target_pos = $(this).offset().top;
//                    
//                    target_pos = target_pos - tab_h;
//                                        
//                    $(this).parents('li').addClass('open');
//                    $(window).scrollTop(target_pos);
//                }
//                
//                zoomSet_h_goodjs();
//            });
            
            /** 구매하기 옵션 레이어 열기 Bind * */
            $(".btn_oepn_layer").click(function() {
            	// 오늘드림 상품이 아니고 일시품절이 아닐 경우. 기존 레이어 오픈 로직 적용
            	if($("#quickYn").val() != "Y" && $("#soldOutYn").val() != "Y") {
            		if($('.prd_option_layer').show()){
                		$('.opt_choice_area').css({'overflow-y':'scroll'});
                		$('.btn_layer').hide();
                	}
            	} else {
            		// 일시품절이고 오늘드림 선택 해제 시 상품 수량 조절 선택 영역 hide, 큐레이션 영역 load
            		// 일반상품일 경우 btn_oepn_layer 버튼이 기존에 나오지 않는데, 큐레이션 개편으로 버튼 나오도록 처리하여 아래 로직과 동일하게 처리
            		if(!$("#deliveDay").is(":checked") && $("#soldOutYn").val() == "Y" && mgoods.detail.recoBellUseYn == 'Y' && mgoods.detail.recoBellViewYn == 'Y') {
            			mgoods.detail.callEigeneSoldOut("n002");
            		} else {
            		// 오늘드림 선택하거나 큐레이션 미노출 처리, 또는 품절이 아닐 때 기존 수량 조절 선택 영역 show
            			$('.prd_option_layer').show();
                		$("#prd_recoBox_n002").hide();
                        $(".div_option_area").show();
                        $(".curation_soldOut").hide(); //일시품절 큐레이션 타이틀 노출
            		}
            		
            		if($("#quickYn").val() == "Y") { // 오늘드림 상품일 때 별도 처리.
            			$(".btn_newLayer .btn_oepn_layer").stop().hide();
                        if(quickAddrYn == "Y" && $(".today_nudge").hasClass("nudge_show")) {
                        	$(".today_nudge").addClass("nudge_hide").hide();
                        }
            		}
            		
            		// 수량 조절 영역이 노출되었을 경우, 기존 레이어 오픈 로직 반영
            		if($(".div_option_area").is(":visible")) { 
            			/* 선물하기 옵션관련 문구 추가 */
                    	mgoods.detail.showPresentOptionText();
                    	
                    	// 선택된 아이템이 있으면 wrap show, 없으면 wrap hide
                    	if ( $('.prd_item_box_wrap').find('.prd_cnt_box').length == 0 ){
                    		$('.prd_item_box_wrap').hide();
                    	}else{
                    		$('.prd_item_box_wrap').show();
                    		$('.event_info').show();
                    	}
            		}
            	}
            });
            
            // AS-IS 일시품절 큐레이션 개선으로 겹치는 event 하나로 변경
            /*$('.btn_oepn_layer').click(function(){
                $('.prd_option_layer').show();
                if($('.prd_option_layer').show()){
                    $('.opt_choice_area').css({'overflow-y':'scroll'});
                    $('.btn_layer').hide();
                }
                 	선물하기 옵션관련 문구 추가 
                mgoods.detail.showPresentOptionText();
                
                // 선택된 아이템이 있으면 wrap show, 없으면 wrap hide
                if ( $('.prd_item_box_wrap').find('.prd_cnt_box').length == 0 ){
                    $('.prd_item_box_wrap').hide();
                }else{
                    $('.prd_item_box_wrap').show();
                    $('.event_info').show();
                }
            });
            
            $(".btn_newLayer .btn_oepn_layer").on('click' , function(){
                $(".btn_newLayer .btn_oepn_layer").stop().hide();
                $(".prd_option_layer").stop().show();
                
                if(quickAddrYn == "Y" && $(".today_nudge").hasClass("nudge_show")) {
                	$(".today_nudge").addClass("nudge_hide").hide();
                }
            });*/
            
             $(".btn_close_layer").on('click' , function(){
            	 if($("#quickYn").val() == "Y") {
            		 $(".btn_newLayer .btn_oepn_layer").stop().show();
            	 } else {
            		 $(".btn_oepn_layer").stop().show();
            	 }
            	 
            	 $(".btn_oepn_layer").stop().show();
                 
                 if(quickAddrYn == "Y" && $(".today_nudge").hasClass("nudge_show")) {
                 	$(".today_nudge").removeClass("nudge_hide").fadeIn();
                 }
             });
            
            // 기존 구매하기 버튼 이벤트
            /** 구매하기 클릭 Bind * */
            $(".btn_buy").click(function(){
                // 선물하기 여부(소스 수정을 최소화하려고 전역변수로 처리함)
                window['presentYn'] = 'N';
                
                var loginCheck = common.loginChk();
                
                if ( loginCheck ) {
                    //  수량 입력, 옵션 창이 열려 있다면
                    var goodsOptInfo = "";
                    
                    //  옵션이 있는 상품이라면 
                    if ( $("#dupItemYn").val() == 'Y' ){
                        goodsOptInfo = "multi";
                    }else{
                        goodsOptInfo = "single";
                    }
                    
                    // 오늘드림 여부 선택된 경우 check, 옵션상품인 경우에만 체크해야함
                    // [START 오늘드림 옵션상품 개선:jwkim]
                    if(mgoods.detail.checkQuick() && $("#dupItemYn").val() == 'Y'){
                        alert("선택하신 옵션 중 오늘드림 서비스가 제공되지 않는 상품이 있습니다.");
                        return false;
                    }
                    // [END 오늘드림 옵션상품 개선:jwkim]
                    
                    // 당일배송인 경우 시간 체크 및 배송지 선택 레이어 오픈
                    // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
                    if($("input[name='qDelive']").is(":checked")){
                        if(mgoods.detail.validation == 'N') {
                        	if($(".a_adrNew").length > 0) {
                                alert("상품을 받을 수 있는 주소를 추가해주세요!");
                            } else {
                                alert("선택하신 배송지로는 주문이 어렵습니다.\n배송지를 변경해 주세요.");
                            }
                           
                            return false;
                        }
                        
                        var dt = new Date();
                        var hour = dt.getHours();
                        
                        // 오늘드림 기간 제한 ( json data가 잘못입력될수도있으니 try 처리 ) 
                        var _o2oBlockInfo = "";
                        try{
                            _o2oBlockInfo = $.parseJSON($("#o2oBlockInfo").val());
                            if(_o2oBlockInfo.o2oBlockYn == "Y"){
                                alert(_o2oBlockInfo.o2oBlockMsg);
                                return;
                            }
                        }catch(e){console.log(e);}
                        
                        // 2019 추석 연휴 9/12 20:00 ~ 9/14 20:00 오늘드림 제한
                        var fromQuickDiableDate = new Date("2019", "09"-1, "11", "20", "00", "00");
                        var toQuickDiableDate =   new Date("2019", "09"-1, "14", "20", "00", "00");
                        
                        if(dt > fromQuickDiableDate && dt < toQuickDiableDate){
                            alert("[추석 연휴 오늘드림 서비스 운영 중지 안내]\n추석 연휴 기간 오늘드림 서비스 이용이 제한되며,\n9월 14일(토) 오후 8시부터 오늘드림 주문이 가능합니다.");
                            return;
                        }
                        
                        /*if(hour < $("#quickOrdTimeFrom").val() || hour >=$("#quickOrdTimeTo").val() ){
                            alert("오늘드림 주문 가능시간은\n오전 10시 ~ 오후 8시 입니다.");
                            return;
                        }*/
                        
                        var goodsNo = $("#goodsNo").val();
                        var itemNo = $("#itemNo").val();
                        var optionKey = goodsNo + itemNo;
                        var cartCnt = Number($("#cartCnt_" + optionKey).val());
                        var quickMax = parseInt( $("#quickOrdMaxQty").val() );
                        
                        var dupItemYn = $("#dupItemYn").val();      // 옵션 여부
                        var getGoods = "";

                        if(dupItemYn == "Y"){
                            // 오늘드림 옵션상품 개선 jwkim
                            cartCnt = parseInt( $("input#cartCnt_" + optionKey).val() );
                            getGoods = $("div.event_info");
                        } else {
                            cartCnt = parseInt( $("input#cartCnt_" + optionKey).val() );
                            getGoods = $("div.event_info");
                        }
                        var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
                        var promKndCd = getGoods.attr("promKndCd");
                        var canGetItemCnt = parseInt( cartCnt / buyCondStrtQtyAmt );
                        if(canGetItemCnt==undefined || isNaN(canGetItemCnt)){
                            canGetItemCnt = 0;
                        }
                     
                        if((cartCnt + canGetItemCnt) > quickMax){
                            alert("오늘드림 서비스의 1회 최대 구매 수량은 총 "+quickMax+"개 입니다.");
                            $("#cartCnt_" + optionKey).val(quickMax);
                            
                            // 가능 주문 수량 계산
                            var tempQuickMax = cartCnt + canGetItemCnt;
                            var tempCartCnt = cartCnt;
                            var tempCanGetItemCnt = parseInt(tempCartCnt / buyCondStrtQtyAmt);
                            
                            if(canGetItemCnt != 0){
                                while (tempQuickMax > quickMax) {
                                    tempCartCnt = tempCartCnt - 1;
                                    tempCanGetItemCnt = parseInt(tempCartCnt / buyCondStrtQtyAmt);
                                    tempQuickMax = tempCartCnt + tempCanGetItemCnt;
                                }
                                quickMax = tempCartCnt;
                            }
                            
                            // 전체 가격 = 전체 가격 - 이전값의 가격 + ( 바뀐 개수 * 가격 )
                            var totalPrc = (Number(quickMax) * Number(salePrc));
                            
                            // 전체 개수, 금액 세팅
                            $("#cartCnt_"+optionKey).val(quickMax);
                            $("#totalCnt").text(quickMax);
                            $("#totalPrc").val(totalPrc);
                            $("#totalPrcTxt").text($.number(totalPrc));
                            mgoods.detail.cart.changeMsg(optionKey);
                            
                            return;
                        }
                        
                        var checkRegCartQuickResult = false;
                        // 장바구니는 옵션이 있으면 열리지만 옵션이 없으면 기본 1개로 장바구니 등록
                        if ( $(".btn_basket").hasClass("dupItem") ){
                            // 수량 입력, 옵션 창이 열려 있다면
                            if($(".prd_option_layer").css("display") == 'block'){
                                checkRegCartQuickResult = mgoods.detail.cart.checkRegCartQuick("Y","NEW");
                            }else{
                                $('.prd_option_layer').show();
                                /* 선물하기 옵션관련 문구 추가 */
                                mgoods.detail.showPresentOptionText();
                                $('.opt_choice_area').css({'overflow-y':'scroll'});
                                $('.btn_layer').hide();
                                
                                checkRegCartQuickResult = false;
                            }
                            
                        }else{
                            // 프로모션이 있다면 옵션창 show/hide 체크
                            if( $("div.event_info[promno]").length > 0 ){
                                if ( $(".prd_option_layer").css("display") == 'block' ){
                                    checkRegCartQuickResult = mgoods.detail.cart.checkRegCartQuick("Y","NEW");
                                } else {
                                    $('.prd_option_layer').show();
                                    /* 선물하기 옵션관련 문구 추가 */
                                    mgoods.detail.showPresentOptionText();
                                    $('.opt_choice_area').css({'overflow-y':'scroll'});
                                    $('.btn_layer').hide();
                                    
                                    checkRegCartQuickResult = false;
                                }
                            } else {
                                checkRegCartQuickResult = mgoods.detail.cart.checkRegCartQuick("Y","NEW");
                            }
                        }
                        
                        if(!checkRegCartQuickResult) {
                            return;
                        }
                        
                        //기존 배송지 목록 호출 2019-12-21 주석
//                        if(checkRegCartQuickResult){
//                            mgoods.detail.todayDelivery.todayDeliveryList();
//                        } 
//                        return;   
                    }
                    
                    // 장바구니는 옵션이 있으면 열리지만 옵션이 없으면 기본 1개로 장바구니 등록
                    if ( $(".btn_basket").hasClass("dupItem") ){
                        
                        // 수량 입력, 옵션 창이 열려 있다면
                        if($(".prd_option_layer").css("display") == 'block'){
                            mgoods.detail.cart.checkRegCart("Y","NEW");
                        }else{
                            $('.prd_option_layer').show();
                            /* 선물하기 옵션관련 문구 추가 */
                            mgoods.detail.showPresentOptionText();
                            $('.opt_choice_area').css({'overflow-y':'scroll'});
                            $('.btn_layer').hide();
                        }
                        
                    }else{
                        
                        // 프로모션이 있다면 옵션창 show/hide 체크
                        if( $("div.event_info[promno]").length > 0 ){
                            if ( $(".prd_option_layer").css("display") == 'block' ){
                                mgoods.detail.cart.checkRegCart("Y","NEW");
                            } else {
                                $('.prd_option_layer').show();
                                /* 선물하기 옵션관련 문구 추가 */
                                mgoods.detail.showPresentOptionText();
                                $('.opt_choice_area').css({'overflow-y':'scroll'});
                                $('.btn_layer').hide();
                            }
                        } else {
                            mgoods.detail.cart.checkRegCart("Y","NEW");
                        }
                    }
                }
                
            });
            
            /* 선물하기 옵션관련 문구 닫기 버튼 클릭 Bind */
            $('.prd_buy_wrap.type_gift').find('.btn_txt_close').on("click", function(){
                // 계속 안나오게 처리해야 할 경우 txt_info_gift에  class="is-close" 추가 
                $('.prd_buy_wrap.type_gift').find('.txt_info_gift').addClass('is-hide is-close');
                $('.prd_buy_wrap.type_gift').find('.txt_info_gift').hide();
                
                // 세션스토리지에 닫기 여부 저장
                sessionStorage.setItem("presentOptionTextCloseYn","Y");
            })
            
            /** 장바구니 클릭 Bind * */
            $(".btn_basket").click(function(){
                // 선물하기 여부(소스 수정을 최소화하려고 전역변수로 처리함)
                window['presentYn'] = 'N';
                
                var loginCheck = common.loginChk();
                
                if ( loginCheck ) {
                    // 오늘드림 여부 선택된 경우 check, 옵션상품인 경우에만 체크해야함
                    // [START 오늘드림 옵션상품 개선:jwkim]
                    if(mgoods.detail.checkQuick() && $("#dupItemYn").val() == 'Y'){
                        alert("선택하신 옵션 중 오늘드림 서비스가 제공되지 않는 상품이 있습니다.");
                        return false;
                    }
                    if($("input[name='qDelive']").is(":checked")){
                        if(mgoods.detail.validation == 'N') {
                        	if($(".a_adrNew").length > 0) {
                                alert("상품을 받을 수 있는 주소를 추가해주세요!");
                            } else {
                                alert("선택하신 배송지로는 주문이 어렵습니다.\n배송지를 변경해 주세요.");
                            }
                        	
                        	return false;
                        }
                    }
                    
                    // [END 오늘드림 옵션상품 개선:jwkim]
                    // 장바구니는 옵션이 있으면 열리지만 옵션이 없으면 기본 1개로 장바구니 등록
                    if ( $(".btn_basket").hasClass("dupItem") ){
                        if ( $(".prd_option_layer").css("display") == 'block' ){
                            mgoods.detail.cart.checkRegCart("N");
                        }else{
                            $('.prd_option_layer').show();
                            /* 선물하기 옵션관련 문구 추가 */
                            mgoods.detail.showPresentOptionText();
                            $('.opt_choice_area').css({'overflow-y':'scroll'});
                            $('.btn_layer').hide();
                        }
                    }else{
                        // 프로모션이 있다면 옵션창 show/hide 체크
                        if( $("div.event_info[promno]").length > 0 ){
                            if ( $(".prd_option_layer").css("display") == 'block' ){
                                mgoods.detail.cart.checkRegCart("N");
                            } else {
                                $('.prd_option_layer').show();
                                /* 선물하기 옵션관련 문구 추가 */
                                mgoods.detail.showPresentOptionText();
                                $('.opt_choice_area').css({'overflow-y':'scroll'});
                                $('.btn_layer').hide();
                            }
                        } else {
                            mgoods.detail.cart.checkRegCart("N");
                        }
                    }
                }
            });
            
            /** 선물하기 클릭 Bind * */
            $(".btn_present").click(function(){
                // 오늘드림 여부 선택된 경우 check
                if($("#deliveDay").prop("checked")==true){
                    alert("오늘드림 선택시 선물하기는 불가능합니다.");
                    return false;
                }
                
                var loginCheck = common.loginChk();
                
                if ( loginCheck ) {
                    // 예약상품 여부 check
                    var rsvGoodsYn = $("#rsvSaleYn").val();
                    var rsvLmtSctCd = $("#rsvLmtSctCd").val();
                    if(rsvGoodsYn == "Y" && rsvLmtSctCd == "20"){
                        alert("예약상품은 선물하실 수 없습니다. 일반 주문을 이용해주시거나 다른 상품을 선택해주세요.");
                        return false;
                    }
                    
                    // 선물하기 여부(소스 수정을 최소화하려고 전역변수로 처리함)
                    window['presentYn'] = 'Y';
                    common.wlog("goods_detail_present_btn"); // 영역분석용
                    n_click_logging( _baseUrl + "?clickarea=goodsDetailPresentOrder"); // DS 시나리오 분석용 로그 남기기
                    
                    // 장바구니는 옵션이 있으면 열리지만 옵션이 없으면 기본 1개로 장바구니 등록
                    if ( $(".btn_basket").hasClass("dupItem") ){
                        
                        // 수량 입력, 옵션 창이 열려 있다면
                        if($(".prd_option_layer").css("display") == 'block'){
                            mgoods.detail.cart.checkRegCart("Y","NEW");
                        }else{
                            $('.prd_option_layer').show();
                            /* 선물하기 옵션관련 문구 추가 */
                            mgoods.detail.showPresentOptionText();
                            
                            $('.opt_choice_area').css({'overflow-y':'scroll'});
                            $('.btn_layer').hide();
                        }
                        
                    }else{
                        
                        // 프로모션이 있다면 옵션창 show/hide 체크
                        if( $("div.event_info[promno]").length > 0 ){
                            if ( $(".prd_option_layer").css("display") == 'block' ){
                                mgoods.detail.cart.checkRegCart("Y","NEW");
                            } else {
                                $('.prd_option_layer').show();
                                /* 선물하기 옵션관련 문구 추가 */
                                mgoods.detail.showPresentOptionText();
                                
                                $('.opt_choice_area').css({'overflow-y':'scroll'});
                                $('.btn_layer').hide();
                            }
                        } else {
                            mgoods.detail.cart.checkRegCart("Y","NEW");
                        }
                    }
                }
                
            });
            
            /** 구매하기 옵션 레이어 닫기 Bind * */
            $('.btn_close_layer').click(function(e){
                e.preventDefault();
                
                if(!$("#deliveDay").is(":checked") && $("#soldOutYn").val() == "Y"
            		&& mgoods.detail.recoBellUseYn == 'Y' && mgoods.detail.recoBellViewYn == 'Y') { 
                	$(".prd_option_layer").animate({"bottom": "-335px"}, 500, function() {
                		$('.prd_option_layer').hide().css("bottom","0");
                		$(".prd_option_layer").parents(".prd_buy_wrap:eq(0)").removeClass("bgNon");
                		$(".curation_soldOut").show(); //일시품절 큐레이션 타이틀 노출
                	});
                } else {
                	$('.prd_option_layer').hide();
                	
                	$('.select_box').removeClass('open').find('ul').hide(); // 2017-02-16
                    // 추가
                    // goods.js
                    // 272줄
                	$('.total_price').show();// 2017-02-16 추가 goods.js
                }

                $('.buy_button_area').show();
                if($('.prd_option_layer').css("display") == "none"){// 2016-12-22 옵션레이어 close 시
                                                    // 레이어 열기 버튼 show;
                    $('.btn_layer').show();
                }
                
                // 선택된 아이템이 있으면 wrap show, 없으면 wrap hide
                if ( $('.prd_item_box_wrap').find('.prd_cnt_box').length == 0 ){
                    $('.prd_item_box_wrap').hide();
                }else{
                    $('.prd_item_box_wrap').show();    
                }
                

                /* 옵션 레이어 닫은 경우 선물하기 옵션관련 문구도 hide 처리 */
                $('.prd_buy_wrap.type_gift').find('.txt_info_gift').hide().addClass('is-hide');
                setTimeout(function(){
                    $('.prd_buy_wrap.type_gift').find('.txt_info_gift').removeAttr('style');
                }, 500)
            });
            
            /** 고객만족도 클릭시 상품평 탭 이동 Bind * */
            $("#gdasMoveBtn").click(function(){
                var tabPos = $(".tab_prod_deail").position();
                window.scroll(0, tabPos.top);
                $("#gdasInfo > a").click();
                
            });
            
            if(mgoods.detail.swiperinit == true){
            	
            	 if ( Number(mainImageCnt) > 1 ){
                     /** 메인 이미지 스와이프 영역 * */
                     var swiper = new Swiper('.sliderPrdwrap', {
                         pagination: '.pageing',
                         autoplayDisableOnInteraction:true,
                         paginationClickable: true,
                         freeMode: false,
                         loop :true
                     });    
                 }else{
                     /** 메인 이미지 스와이프 영역 * */
                     var swiper = new Swiper('.sliderPrdwrap', {
                         pagination: '.pageing',
                         autoplayDisableOnInteraction:true,
                         paginationClickable: true,
                         freeMode: false,
                         loop : false
                     });                 
                 }
            	 
            	 mgoods.detail.swiperinit = false;
            }
            
           
            
            
//            $("#productInfo").click(function(){
//               $(".controlHolder").empty();
//               $("div#timpHtml").find("div#TEMP_HTML").attr("style", "");
//               $("div#test00").html($("div#timpHtml").html().replace("TEMP_HTML", "markerTest"));
//               // console.log($("div#test00").html());
////               $("#markerTest").pinchzoomer();
//               
//               mgoods.detail.setGoodsDetailLoad();
               
               /*
               resizeYoutube();
               $(window).resize(function(){resizeYoutube();});
               $(function(){resizeYoutube();});
               function resizeYoutube(){ $("iframe").each(function(){ if( /^https?:\/\/www.youtube.com\/embed\//g.test($(this).attr("src")) ){ $(this).css("width","100%"); $(this).css("height",Math.ceil( parseInt($(this).css("width")) * 480 / 854 ) + "px");} }); }
               */
               
               /*if(mgoods.detail.recoBellclickYn=="N"){
                   if(window['isCurationArea002Called'] != 'Y'){
                       mgoods.detail.callRecobell("a002");
                       window['isCurationArea002Called'] = 'Y';
                   }
                   if(window['isCurationArea003Called'] != 'Y'){
                       mgoods.detail.callRecobell("a003");
                       window['isCurationArea003Called'] = 'Y';
                   }
                   mgoods.detail.recoBellclickYn="Y";
               }*/
//            });
            
            /** 상단 탭 클릭 Bind PagingCaller Destory * */
//            $("#productInfo, #buyInfo").click(function(){
//                PagingCaller.destroy();
//            });
            
//            $("#buyInfo").click(function(){
//                if(frstClickIdx2=="N"){
//                    mgoods.detail.artcKcListAjax($("#artcGoodsNo").val(), $("#artcItemNo").val(), $("#pkgGoodsYn").val(), $("#previewInfo").val());
//                    frstClickIdx2="Y"; 
//                }
//                
//            });
            
            /** Q&A 탭 클릭 Bind , Q&A PagingCaller Init * */
//            $("#qnaInfo").click(function(){
//                PagingCaller.destroy();
//                if(frstClickIdx4=="N"){
//                    // alert();
//                    mgoods.detail.qnaTabInit();
//                    frstClickIdx4="Y";
//                }else{
//                    mgoods.detail.qna.getQnaListPaging(mgoods.detail.qna.qnaPageIdx);
//                }
//                
//            });
                
            /** 전체품절 재입고 알림 버튼 Bind * */
            $(".tx_alim").click(function(){
                //오늘드림 고도화 2019-12-22 변경 
                if($("#deliveDay").prop("checked") == true){
                    var strNo ="";
                    strNo = $(".dt_dlvp").attr("id");
                    var isAvailbleStore = true;	//매장취급여부
                    var lgcGoodsNo = $("#lgcGoodsNo").val();
                    
                    if(strNo == undefined || strNo == "" || strNo == null || strNo == "NM") {
                        alert("매장 재입고 신청이 불가능한 배송지입니다. 다른 배송지를 선택해 주세요.");
                        return;
                    }
                    
                    //[3354738] 상품 상세 재입고 알람 신청시  매장취급여부 판단 |2020.09.15 | by jp1020
                    if(lgcGoodsNo != undefined || lgcGoodsNo != "" || lgcGoodsNo != null) {
                    	isAvailbleStore = mgoods.detail.offstore.getAvailableStore(strNo, lgcGoodsNo);
                    	console.log("isAvailbleStore Result : " + isAvailbleStore);
                    }
                    
                    if(!isAvailbleStore){
                    	alert("해당 상품 미운영 매장입니다.");
                    	return;
                    }
                    
                    //오프라인 매장 재고 입고 알림
                    common.openStockOffStoreAlimPop(mgoods.detail.goodsNo,'', strNo); 
                }else{
                    common.openStockAlimPop(mgoods.detail.goodsNo,'');        
                }
            });
            
            /** 찜 클릭 Bind * */
            $('.goodsJeem').bind('click', function(){
                // 로그인 체크
                if(common.loginChk()){
                    var param = {
                            goodsNo : $(this).attr("data-ref-goodsNo")
                    };

                    if($(this).hasClass("zzim_on")){
                        // off
                    	if($(this)[0].tagName == "BUTTON"){
                    		$(this).text("찜하기전");
                    	}
                        var resultData = common.wish.delWishLst(param);
                        var result = resultData.trim();
                        if ( result == '000' ){
                            $(this).removeClass("zzim_on");    
                        } 
                        
                    }else{
                        // on
                    	if($(this)[0].tagName == "BUTTON"){
                    		$(this).text("찜하기후");
                    	}
                        var resultData = common.wish.regWishLst(param);
                        var result = resultData.trim();
                        if ( result == '000' ){
                            $(this).addClass("zzim_on");
                        }
                    }
                }
            });
            
            /** 옵션 선택 Bind * */
            $('.select_box .select_opt').click(function(e){
                e.preventDefault();
                if($("#quickYn").val() == "Y" && $("#deliveDay").is(":checked") && mgoods.detail.validation == "N") {
                    if($(".a_adrNew").length > 0) {
                        alert("상품을 받을 수 있는 주소를 추가해주세요!");
                    } else {
                        alert("선택하신 배송지로는 주문이 어렵습니다.\n배송지를 변경해 주세요.");
                    }
                    return false;
                }

                if($('.select_box').hasClass('open')){
                    e.preventDefault();
                    $(this).parent('.select_box').removeClass('open').find('ul').hide();
                    $('.opt_choice_area').css({'overflow-y':'scroll'})
                    $('.event_info').show();
                    $('.case_cnt_box').show(); // 2017-02-20 추가
                    $('.total_price').show();
                    $('.buy_button_area').show();
                    $('.prd_item_box_wrap').show();
                    mgoods.detail.showPresentOptionText(); // 선물하기 옵션 문구 show
                }else{
                    if($("#opt_other").find("li").length <= 0 ){
                        mgoods.detail.optInfoList($("#previewInfo").val());
                    } else {
                        $(this).parent('.select_box').addClass('open').find('ul').show();
                        $('.opt_choice_area').css({'overflow-y':'visible'})
                        $('.event_info').hide();
                        $('.case_cnt_box').hide(); // 2017-02-20 추가
                        $('.total_price').hide();
                        $('.buy_button_area').hide();
                        $('.prd_item_box_wrap').hide();
                        
                    }
                    
                    $('.prd_buy_wrap.type_gift').find('.txt_info_gift').hide(); // 선물하기 옵션 문구 hide
                }
            });

            /** 고시항목 옵션 변경 Bind * */
            $("#artcGoodsOpt").change(function(){
                var itemInfo = $('#artcGoodsOpt option:selected').val();
                
                if ( itemInfo != '00' ){
                    // goodsNo, itemNo 분리
                    var goodsArr = itemInfo.split("|");
                    var goodsNo = goodsArr[0];
                    var itemNo = goodsArr[1];
                    
                    var url = _baseUrl + "goods/getGoodsArtcAjax.do";
                    var data = {goodsNo : goodsNo, itemNo : itemNo}
                    common.Ajax.sendRequest("POST",url,data,mgoods.detail._callBackArtcList);
                }
                
            });
            
            // 2019-11-18
            // 오늘드림 버튼 클릭 이벤트 분기
            $("#deliveDay").click(function(){
                /*mgoods.detail.todayDelivery.openQuickPop();*/
                mgoods.detail.todayDelivery.btnQuickYn();
                
                //오늘드림 체크시 버튼위 선 추가CSS 
                $(".today_delive").css("border-bottom","1px solid #e5e5e5");
                
                // 2019-11-18
                if(common.isLogin() == false) {
                    if(!confirm("회원 전용 서비스입니다. 로그인하시겠습니까?")) {
                        $(".btn_present").show(); // 로그인 안한 경우 선물하기 아이콘 재노출
                        return false;
                    }else {
                        common.link.moveLoginPage();
                        return false;
                    }
                }else {
                    
                	if($("input[name=qDelive]:checked").val() == 'Y'){
                        $("#qDeliveCheck").val('Y');
                        
                      //mjh추가
                      $("#quickGiftInfo").show();
                      $("#giftInfo").hide();
                    }
                	else{
                		$("#qDeliveCheck").val('N');
                		
                		//mjh추가
                        $("#quickGiftInfo").hide();
                        $("#giftInfo").show();
                	}                	
                    
                    $(".btn_basket").show();
                    $(".btn_buy").show();
                    $(".btn_soldout").hide();
                    $(".buy_button_area").removeClass("soldout"); // 품절 클래스 삭제

                    if($(this).is(":checked")) {
                        if($("#soldOutYn").val() == "Y") {
                        	$("#prd_recoBox_n002").hide();
                        	$(".div_option_area").show();
                        	$(".curation_soldOut").hide(); //일시품절 큐레이션 타이틀 노출
                        }
                        //오늘드림 체크박스
                        document.cookie = "O2O_CHK=Y";
                        localStorage.setItem('O2O_CHK', 'Y');
                        
                        //  장바구니 개수 체크
                        if($("#dupItemYn").val() != "Y") { //옵션상품일 경우 제외 처리.
                            if ( mgoods.detail.cart.checkCartCnt() ){
                                // get상품 선택 여부 체크
                                /*if(!mgoods.detail.cart.checkGetItemSelect()){
                                    alert("추가상품을 선택해주세요.");
                                    return false;
                                }*/
                            }else{
                                alert("상품을 선택해주세요.");
                                $(".btn_newLayer .btn_oepn_layer").stop().hide();
                                $(".prd_option_layer").stop().show();
                                
                                return false;
                            }
                            
                            $(".prd_cnt_box").find("input").val("1");
                            mgoods.detail.cart.init();
                        } else {
                            $(".list_opt_other").html("");  //옵션상품의 경우 주소지 변경 시 선택 옵션 초기화
                            $(".prd_item_box").remove();
                            $(".event_info").remove();
                            
                            // 전체 개수, 전체 총합 계산 초기
                            $("#totalCnt").text("0");
                            $("#totalPrcTxt").text("0");
                            $("#totalPrc").val("0");
                        }
                        
                        // 오늘드림 여부 선택된 경우 check, 옵션상품인 경우에만 체크해야함
                        // [START 오늘드림 옵션상품 개선:jwkim]
                        if(mgoods.detail.checkQuick() && $("#dupItemYn").val() == 'Y'){
                            alert("선택하신 옵션 중 오늘드림 서비스가 제공되지 않는 상품이 있습니다.");
                            return false;
                        }
                        
                        $(".ico_deli_normal").hide();
                        $(".ico_deli_quick").show(); // 배송비 안내 팝업 일반배송, 오늘드림 구분
                        
                        mgoods.detail.todayDelivery.todayDeliveryListOnPage();
                        
                        if($(".today_nudge").length > 0) {
                        	$(".today_nudge").remove();
                        	clearInterval(mgoods.detail.interval);
                        }
//                        $(".addr_newBox").stop().show();
                        
                        // 선물하기 버튼 숨김
                        $(".btn_present").hide();
                        
                    }else {
                        if($("#soldOutYn").val() == "Y" && $(".btn_close_layer").is(":visible")) {
                        	$("#prd_recoBox_n002").show();
                        	$(".div_option_area").hide();
                        	$(".curation_soldOut").hide(); //일시품절 큐레이션 타이틀 숨김
                        	
                        	mgoods.detail.callEigeneSoldOut("n002");
                        } else if($("#soldOutYn").val() == "Y" && !$(".btn_close_layer").is(":visible")) {
                        	$(".curation_soldOut").show(); //일시품절 큐레이션 타이틀 숨김
                        }
                        //오늘드림 체크박스
                        document.cookie = "O2O_CHK=N";
                        localStorage.setItem('O2O_CHK', 'N');
                        
                        $(".addr_newBox").stop().hide();
                        
                        //온라인 재고가 없을경우
                        if($("#deliveDay").hasClass("soldout") === true ) {
                            $(".btn_soldout").show();    //재입고 알림신청 버튼
                            $(".buy_button_area").addClass("soldout"); // 품절 클래스 추가
                            $(".btn_basket").hide();    //장바구니 버튼
                            $(".btn_buy").hide();    //구매하기 버튼
                        }
                        
//                        $("#delivery_list").hide();
//                        $("#delivery_list").empty();
//                        $("#dlvr_list").hide();
//                        $("#dlvr_list").empty();
                        
                        mgoods.detail.validation = 'Y';
                        mgoods.detail.dlvrListSelectedYn = 'N';
                        mgoods.detail.todayDelivery.init();
                        //퀵배송지를 초기화 및 선택된 배송지 업데이트 quickYn = 'Y', strNo(매장번호)
                        mgoods.detail.todayDelivery.registQuickMbrDlvpInfo(mgoods.detail.baseStrNo, mgoods.detail.baseMbrDlvpSeq);
                    
                        if($("#dupItemYn").val() == 'Y') {
                            $(".list_opt_other").html("");  //옵션상품의 경우 주소지 변경 시 선택 옵션 초기화
                            $(".prd_item_box").remove();
                            
                            // 전체 개수, 전체 총합 계산 초기
                            $("#totalCnt").text("0");
                            $("#totalPrcTxt").text("0");
                            $("#totalPrc").val("0");
                        } else {
                            $(".prd_cnt_box").find("input").val("1");
                            mgoods.detail.cart.init();
                        }
                        
                        $(".ico_deli_normal").show();
                        $(".ico_deli_quick").hide(); // 배송비 안내 팝업 일반배송, 오늘드림 구분
                        
                        $(".today_delive").css("border-bottom","");
                        
                        // 선물하기 버튼 노출
                        $(".btn_present").show();
                        
                        
                        //컬러칩 품절표시
                        var colrSoldoutCnt = $("#colrSoldoutCnt").val();
                        
                        for(var i=0;i<colrSoldoutCnt;i++){
                        	
                        		$("#colrChipItem_"+i).attr('class',"");
                        		$("#colrParet_"+i).attr('class',"");
                        	
                    		if($("input[name=colrSoldOut_"+i+"]").val() == 'Y'){
      
                    			$("#colrChipItem_"+i).attr('class','sold_out');
                    			$("#colrParet_"+i).attr('class','soldout');
                        		
                        	}
                        	
                        
                        }
                        
                        
                        
                        
                        //여기
                        	}
                        	
                    mgoods.detail.todayDelivery.quickBaseAddrInfo();
                }
                
                mgoods.detail.giftBannerChk();
            });
            
            $("#deliveNm").click(function(){
                mgoods.detail.todayDelivery.btnQuickYn();
            });
            
            //할인내역 정보 디폴트 열림
            //$('.prd_detail_info .sale_list .btn_more').click();
            
            zoomSet_h_goodjs();
            
        },
        
        /** 배송비 자세히 보기 레이어 팝업 열기 * */
        openDlexLayerPop : function(){
            
            // 페이징 콜러 Destory;
            PagingCaller.destroy();
            
            common.setScrollPos();
            $("#layerPop").html($("#dlexLayerPop").html());
            // 0001063: MO_상품 상세 페이지 > 레이어창 팝업시 화면 밀림 현상
            common.popLayerOpen2("LAYERPOP01");
        },
        
        /** 쿠폰 자세히 보기 레이어 팝업 열기 * */
        openCouponLayerPop : function(){
            
            // 페이징 콜러 Destory;
            PagingCaller.destroy();
            
            common.setScrollPos();
            $("#layerPop").html($("#couponLayerPop").html());
            common.popLayerOpen("LAYERPOP01");
        },
        
        /** 카드혜택가 자세히 보기 레이어 팝업 열기 * */
        openCardFullPop : function(){

            common.setScrollPos();
            $("#layerPop").html($("#cardFullPop").html());
            // 0001063: MO_상품 상세 페이지 > 레이어창 팝업시 화면 밀림 현상
            common.popLayerOpen2("LAYERPOP01");
        },
        
         /** CJ ONE 포인트 예상 적립 레이어 팝업 열기 **/
        openCjonepntPop : function(){
        	common.setScrollPos();
        	$("#layerPop").html($("#cjonePntInfo").html());
        	common.popLayerOpen2("LAYERPOP01");            
        },
        
        /** 증정품 자세히 보기 레이어 팝업 열기 * */
        openGiftFullPop : function(){
            
            // 페이징 콜러 Destory;
            PagingCaller.destroy();
            
            common.setScrollPos();
            $("#pop-full-wrap").html($("#giftFullPop").html());
            common.popFullOpen("증정품 안내사항", "");
            $("#pop-full-wrap .popHeader .popTitle").attr("id", "pop-full-title");
            $("#pop-full-wrap .popContainer .popCont").attr("id", "pop-full-contents");
        },
        
        /** 재고보유 현황 페이지 Ajax * */
        offlineBurialLink : function(){
            
            // 페이징 콜러 Destory;
            PagingCaller.destroy();
            
            var url = _baseUrl + "goods/getStockStoreListAjax.do";

            var data = {};
// $('#pop-full-wrap').find('#mTab').find('a').eq(1).click();
            
            // 주변매장 기능 사용 가능
            if(mgoods.detail.isNearAvail){
                data = {nearStoreYn : 'Y', usrLat : $("#usrLat").val(), usrLng: $("#usrLng").val() };
                common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackNearStoreList);
                
            }else{ // 주변매장 기능 사용 불가
                data = {myStoreYn : 'Y'};
                common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackMyStoreList);
                
            }
        },
        
        /** 재고보유 현황 페이지 Ajax * */
        offlineBurialLink2 : function(){
            
            // 페이징 콜러 Destory;
            PagingCaller.destroy();
            
            var url = _baseUrl + "goods/getStockStoreListAjax.do";

            var data = {};
            
            var id = $("#flagSearch").val();
            if(!common.isEmpty(id)){
                $('#pop-full-wrap').find('#'+id).addClass("on");
                
                if(id == 'nearSearch'){
                    $('#pop-full-wrap').find('.reShop_search').show();
                }else {
                    $('#pop-full-wrap').find('.reShop_search').hide();
                }
            }
            
            if($('#pop-full-wrap').find('#mTab').find('a').eq(0).hasClass("on")){
                
                data = {nearStoreYn : 'Y', usrLat : $("#usrLat").val(), usrLng: $("#usrLng").val() };
                common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackNearStoreList2);
                
                
            }else {
                
                data = {mbrNm : $("#mbrNm").val(), myStoreYn : 'Y', nearStoreYn : 'Y', usrLat : $("#usrLat").val(), usrLng: $("#usrLng").val() };
                common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackMyStoreList2);
            }
        },
        
        /** 오프라인 매장 재고현황 자세히 보기 레이어 팝업 열기 * */
        openOffstoreFullPop : function(){
// mgoods.detail.offstore.askLoc = localStorage.getItem("askLoc");
            // 페이징 콜러 Destory;
            PagingCaller.destroy();

            if( $("#pkgGoodsYn").val() == 'N' && $("#goodsSctCd").val() == '20' ){
                alert("세트로 구성된 상품은 매장 재고 조회를 하실 수 없습니다.");
            }else{
                common.Ajax.sendRequest("GET",_baseUrl + "goods/getCjoneAvailableJson.do","",function(data){
                    var res =(typeof data !== 'object') ? $.parseJSON(data) : data;
                    if(res != null && res.result){
                        // 위치값 저장
                        common.setScrollPos();
                        
                        mgoods.detail.optInfoListStore();
                        
                        
                    }else{
                        alert("죄송합니다. 시스템 점검으로 이용이 불가합니다.");
                    }
                });
            }
            
        },
        
        // 201912
        /** 오프라인 매장 재고현황 자세히 보기 레이어 팝업 열기 * */
        openOffstoreFullPop2 : function(){
// mgoods.detail.offstore.askLoc = localStorage.getItem("askLoc");
            // 페이징 콜러 Destory;
            PagingCaller.destroy();

            if( $("#pkgGoodsYn").val() == 'N' && $("#goodsSctCd").val() == '20' ){
                alert("세트로 구성된 상품은 매장 재고 조회를 하실 수 없습니다.");
            }else{
                common.Ajax.sendRequest("GET",_baseUrl + "goods/getCjoneAvailableJson.do","",function(data){
                    var res =(typeof data !== 'object') ? $.parseJSON(data) : data;
                    if(res != null && res.result){
                        // 위치값 저장
                        common.setScrollPos();
                        
                        mgoods.detail.optInfoListStore2();
                        
                        
                    }else{
                        alert("죄송합니다. 시스템 점검으로 이용이 불가합니다.");
                    }
                });
            }
            
        },
        
        /** 상품문의 탭 Bind */
        qnaTabInit : function(){
            var url = _baseUrl + "goods/getQnaListAjax.do";
            var data ={goodsNo:mgoods.detail.goodsNo};
            common.Ajax.sendRequest("POST",url,data,mgoods.detail.qna._callBackQnaListAjax);
        },
        
        /** 상품문의 탭 Bind */
        qnaSlideTabInit : function(){
            var url = _baseUrl + "goods/getQnaListAjax.do";
            var data ={goodsNo:mgoods.detail.goodsNo};
            common.Ajax.sendRequest("POST",url,data,mgoods.detail.qna._callBackSlideQnaListAjax);
        },
        
        moveLoginPage : function(){
            common.link.moveLoginPage();
        },
        
        /** 추천상품 조회 */
        recommGoodsList : function(){
            var url = _baseUrl + "goods/getRecommGoodsListAjax.do";
            var data ={goodsNo:mgoods.detail.goodsNo, fltDispCatNo:$("#assocDispCatNo").val()};
            common.Ajax.sendRequest("POST",url, data, mgoods.detail._callBackRecommGoodsList);
        },
        
        /** 콜백 추천상품 조회 * */
        _callBackRecommGoodsList : function(res) {
            
            if(res.trim() == "") {
                $(".mlist2v-goods.mgT10").hide();
                
                return;
            }
            
            $("#recommGoodsList").html(res);
            $(".dispCatBest").css("display","block");
            $(".curation_wrap").css("display","none");
            
            setTimeout(function() {
                // 링크 처리
                common.bindGoodsListLink();
                
                $(".goodsList").addClass("goods_catebest");
                
                common.setLazyLoad();

                setTimeout(function() {
                    $(document).resize();
    
                }, 100);
            }, 100);
        },
        
        /** 추천상품 조회(바코드) */
        recommGoodsListBarcode : function(){
            var url = _baseUrl + "goods/getRecommGoodsListBarcodeAjax.do";
            var data ={goodsNo:mgoods.detail.goodsNo, fltDispCatNo:$("#assocDispCatNo").val()};
            common.Ajax.sendRequest("POST",url, data, mgoods.detail._callBackRecommGoodsListBarcode);
        },
        
        /** 콜백 추천상품 조회(바코드) * */
        _callBackRecommGoodsListBarcode : function(res) {
            if(res.trim() == "") {
                $(".mlist2v-goods.mgT10").hide();
                
                return;
            }
            
            $("#recommGoodsListBarcode").html(res);
            $(".dispCatBest").css("display","block");
            $(".dispCatBest").show(); 
            $(".dispCatBest p").show();
            $("#recommGoodsListBarcode").show();
            $(".curation_wrap").css("display","none");
            
            setTimeout(function() {
                // 링크 처리
                common.bindGoodsListBarcodeLink();
                
                $(".goodsList").addClass("goods_catebest_barcode");
                
                common.setLazyLoad();

                setTimeout(function() {
                    $(document).resize();
    
                }, 100);
            }, 100);
            
            $('#recommGoodsListBarcode .sale').hide();
            $('#recommGoodsListBarcode .won').hide();
            $('#recommGoodsListBarcode .icon').hide();     
        },
        callEigeneCart : function(recType) {
        	var param = {
        			iids : $("#lgcGoodsNo").val(),
                    cpcids : $("#recoBellDispCatNo").val(),
                    size : 20
            };
        	
        	curation.callCuration(recType, param, function(data) {
        		var url = _baseUrl + "curation/getCurationCallBackAjax.do";
        		
        		var obj = {
        			viewType : "Vert",
        			styleNo : 28,
        			goodsNo : $("#goodsNo").val(),
        			popLayerYn : "Y",
        			popLayerNm : "prdSdLayer",
        			viewSize : 8,
        			titlRp : "<strong>함께 구매하면 좋은</strong> 상품이에요;고객님과 비슷한 성향의<br/>다른 고객님이 함께 많이 구매한 상품이에요",
        			viewArea : 'goods_cart',
        			offset : 15,
        			rccode : "mc_detail_cart_a"
        		};
        		
        		var setObj = jQuery.extend(data, obj);
        		
        		curation.getCurationCallBack(setObj, url);
        	});
        },
        callEigeneSoldOut : function(recType, flag) {
        	if(flag == undefined || flag == "") {
        		flag = "click";
        	}
        	
        	var result = false;
        	var winH = $(window).height() / 2;
        	if(window['isCurationAren002Called'] != 'Y'){
	        	var param = {
	        			iids : $("#lgcGoodsNo").val(),
	                    cpcids : $("#recoBellDispCatNo").val(),
	                    size : 20,
	                    cps : true,
	                    cpt : "c001"
	            };
	        	
	        	var mbrNm = $("#mbrNm").val() == "" ? "고객" : $("#mbrNm").val();
	        	var dispNm = $("#eigeneSmlDispName").val();

	        	var title = curation_title[recType];
	        	if(title != undefined) {
	        		title = title.replace("{0}", dispNm);
	        		$(".span_tempTitle").html(title);
	        	}
	        	
	        	curation.callCuration(recType, param, function(data) {
	        		var url = _baseUrl + "curation/getCurationCallBackAjax.do";
	        		
	        		var obj = {
	        			viewType : "Vert",
	        			styleNo : 28,
	        			goodsNo : $("#goodsNo").val(),
	        			viewSize : 8,
	        			titlRp : dispNm  + ";" + mbrNm,
	        			viewArea : 'goods_soldout',
	        			offset : 15,
	        			rccode : "mc_detail_soldout_ac"
	        		};
	        		
	        		var setObj = jQuery.extend(data, obj);
	        		
	        		var result = curation.getCurationCallBack(setObj, url);
	        		
	        		if(result) {
            			$(".prd_option_layer").hide().css("bottom", -(winH));
                		$(".prd_option_layer").show().animate({'bottom' : '0'}, 500);
                		$(".prd_option_layer").parents(".prd_buy_wrap:eq(0)").addClass("bgNon");
                		$(".div_option_area").hide();
                		$("#prd_recoBox_n002").show(); // 일반상품(오늘드림 아닌 상품) 큐레이션 영역 노출
                		$(".curation_soldOut").find("#crt_title_area").show();
                		$(".btn_oepn_layer").hide();
                		
                		if(flag == "init") {
                			setTimeout(function() {
		                		$(".btn_close_layer").click();
		                	}, 5000);
                		}
            		}
	        	});
	        	
	        	window['isCurationAren002Called'] = 'Y';
        	} else {
        		if($("#curation_ul_n002").find("li").length > 0) {
            		$(".prd_option_layer").hide().css("bottom", -(winH));
            		$(".prd_option_layer").show().animate({'bottom' : '0'}, 500);
            		$(".prd_option_layer").parents(".prd_buy_wrap:eq(0)").addClass("bgNon");
            		$(".div_option_area").hide();
            		$("#prd_recoBox_n002").show(); // 일반상품(오늘드림 아닌 상품) 큐레이션 영역 노출
            		$(".curation_soldOut").find("#crt_title_area").show();
            		$(".curation_soldOut").hide();
            	} else {
            		$('.prd_option_layer').show();
            		$("#prd_recoBox_n002").hide();
                    $(".div_option_area").show();
                    $(".curation_soldOut").show();
            	}
        	}
        },
        callRecobell : function(recType) {
            var url = _baseUrl + "goods/getRecoBellGoodsDetailAjax.do";
            
            var param = {
                    recType : recType,
                    repLgcGoodsNo : $("#lgcGoodsNo").val(),
                    goodsNo : $("#goodsNo").val(),
                    recoBellDispCatNo : $("#recoBellDispCatNo").val(),
                    smlDispName : $("#eigeneSmlDispName").val()
            };
            
            var _callBackGetRecoBellContsInfo = function(data) {
                $("#recobell_area_"+recType).html("");
                $("#recobell_area_"+recType).html(data);
                
                zoomSet_h_goodjs();
                
                /*if(recType == "a002"){
                    $("#goods_curation_a002").addClass("goods_curation_a002");
                    setTimeout(function() {
                        if( $("#goodsCnt_" + recType).val() < 1){
                            $(".txt_user").hide();
                        }
                    }, 1000);
                } else if(recType == "a003") {
                    $("#goods_curation_a003").addClass("goods_curation_a003");
                    setTimeout(function() {
                        if( $("#goodsCnt_" + recType).val() < 1){
                            $(".txt_user").hide();
                        }
                    }, 1000);
                }*/
            };
            
            common.Ajax.sendRequest("POST",url,param,_callBackGetRecoBellContsInfo);
        },
        
        // 레코벨 - 바코드 화면
        callRecobellBarcode : function(recType) {
            var url = _baseUrl + "goods/getRecoBellGoodsDetailBarcodeAjax.do";
            
            var param = {
                    recType : recType,
                    repLgcGoodsNo : $("#lgcGoodsNo").val(),
                    goodsNo : $("#goodsNo").val(),
                    recoBellDispCatNo : $("#recoBellDispCatNo").val()
            };
            
            var _callBackGetRecoBellContsInfo = function(data) {
                $("#recobell_area_"+recType).html("");
                $("#recobell_area_"+recType).html(data);
                
                
                zoomSet_h_goodjs();
                
                
                
                /*if(recType == "a002"){
                    $("#goods_curation_a002").addClass("goods_curation_a002_barcode");
                    setTimeout(function() {
                        if( $("#goodsCnt_" + recType).val() < 1){
                            $(".txt_user").hide();
                        }
                    }, 1000);
                } else if(recType == "a003") {
                    $("#goods_curation_a003").addClass("goods_curation_a003_barcode");
                    setTimeout(function() {
                        if( $("#goodsCnt_" + recType).val() < 1){
                            $(".txt_user").hide();
                        }
                    }, 1000);
                }*/
            };
            
            common.Ajax.sendRequest("POST",url,param,_callBackGetRecoBellContsInfo);
        },
        
        /** 연관된 기획전 조회 **/
        relPlanShopAjax : function(){
            var url = _baseUrl + "goods/getRelPlanShopAjax.do";
            var data = { goodsNo : mgoods.detail.goodsNo};
            common.Ajax.sendRequest("POST", url, data, mgoods.detail._callBackRelPlanShopAjax)
        },
        
        /** 연관된 기획전 조회 콜백 * */
        _callBackRelPlanShopAjax : function(res){
            var cDiv = $(res.trim());
            $("#relPlanShop_area").html(cDiv);
            $("#relPlanShop_area").css("display","block"); // 연관된 기획전
            $(".dispCatBest").css("display","none");
            $("#relPlanShop_area").addClass("rel_planshop");
            
            zoomSet_h_goodjs();
        }, 
        
        /** 연관된 기획전 조회 - 바코드 화면 **/
        relPlanShopBarcodeAjax : function(){
            var url = _baseUrl + "goods/getRelPlanShopBarcodeAjax.do";
            var data = { goodsNo : mgoods.detail.goodsNo};
            common.Ajax.sendRequest("POST", url, data, mgoods.detail._callBackRelPlanShopBarcodeAjax)
        },
        
        /** 연관된 기획전 조회 콜백 - 바코드 화면  * */
        _callBackRelPlanShopBarcodeAjax : function(res){
            var cDiv = $(res.trim());
            $("#relPlanShop_area").html(cDiv);
            $("#relPlanShop_area").css("display","block"); // 연관된 기획전
            $(".dispCatBest").css("display","none");
            $("#relPlanShop_area").addClass("rel_planshop_barcode");
            
            zoomSet_h_goodjs();
        },  
        
        /** 고시항목 옵션 변경 콜백 * */
        _callBackArtcList : function(res){
            var cDiv = $(res.trim());
            $("#artcKcInfo").html(cDiv.find("#artcKcCertInfo").html());
            
           
            
//            상품상세 사이즈 MJH
            $('.listBuyInfo .tit a').click(function(e){
                   e.preventDefault();
                   if($(this).parents('li').hasClass('open')){
                       $(this).parents('li').removeClass('open');
                   }else{
                       
                       $(this).parents('li').siblings().removeClass('open');
                           
                       var tab_h = $('.tab_prod_deail').height();                   
                       var target_pos = $(this).offset().top;
                       
                       target_pos = target_pos - tab_h;
                                           
                       $(this).parents('li').addClass('open');
                       $(window).scrollTop(target_pos);
                   }
                   tabContsWrap.update();
            });
            tabContsWrap.update();
        },
        
        /** 화면 초기 진입 고시항목, KC안전인증검사 Ajax * */
        artcKcListAjax : function(artcGoodsNo, artcItemNo, pkgGoodsYn, previewInfo){
            
            var url = _baseUrl + "goods/getGoodsArtcAjax.do";
            
            if ( previewInfo != undefined && previewInfo != ""){
                var data = {goodsNo : artcGoodsNo, itemNo : artcItemNo, pkgGoodsYn : pkgGoodsYn, viewMode : previewInfo} 
            }else{
                var data = {goodsNo : artcGoodsNo, itemNo : artcItemNo, pkgGoodsYn : pkgGoodsYn}
            }
            
            common.Ajax.sendRequest("POST",url,data,mgoods.detail._callBackArtcList);
        },
        
        /** 배너이동 URL * */
        moveLinkUrl :function(url){
            location.href = url;
        },

        /** 옵션 리스트 조회 */
        optInfoList : function(previewInfo){
            var url = _baseUrl + "goods/getOptInfoListAjax.do";
            if ( previewInfo != undefined && previewInfo != ""){
                var data ={goodsNo:mgoods.detail.goodsNo, viewMode : previewInfo};
            } else {
                // 상품 상세에서 오늘드림이 체크되어 있는 경우 오늘드림 옵션 리스트조회
                // [START 오늘드림 옵션상품 개선:jwkim]
                var quickYn = "N"; 
                var mbrDlvpSeq = "";
                var quickGiftYn = "";
                var quickAeEvtNo = "";
                // qDelive checked 값이 Y이면 오늘드림 라디오 선택, N이면 일반배송 라디오 선택이다...
                // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
                if($("input[name=qDelive]:checked").val() == 'Y'){
                    quickYn = "Y";
                    mbrDlvpSeq = $("input[name=mbrDlvpSeq]", $("#outItem")).val();
                    quickGiftYn = "Y";
                    quickAeEvtNo = $(".todayGift").data("evtno");
                }
                
                var data ={goodsNo:mgoods.detail.goodsNo
                		, quickYn:quickYn
                		, mbrDlvpSeq:mbrDlvpSeq
                		, quickGiftYn : quickGiftYn
            			, quickAeEvtNo : quickAeEvtNo};
                //var data ={goodsNo:mgoods.detail.goodsNo}; // as-is 로직
                // [END 오늘드림 옵션상품 개선:jwkim]
            }
            
            common.Ajax.sendRequest("POST",url, data, mgoods.detail._callBackOptInfoList);
        },
        restockMorePop : function(lgcGoodsNo) {
        	
        	var rccode = common.isLogin() ? "mc_detail_opt_a" : "mc_detail_opt_c";
        	
        	var param = {
        		size : 20,
        		viewType : 'HorzPop',
        		loginArea : 'N',
        		styleNo : 26,
        		popupYn : 'Y',
        		viewArea : 'goods_curation_pop_a014',
        		recType : 'a014',
        		iids : lgcGoodsNo,
        		cpcids : $("#recoBellDispCatNo").val(),
        		cps : true, //큐레이션 api 호출용
        		cpt : "c001",
        		rccode : rccode
        	};
        	
        	curation.popLoadEvent(param);
        },
        
        /** 컬러칩 옵션 리스트 조회 */
        optInfoListColrChip : function(previewInfo){
            var url = _baseUrl + "goods/getQuickStockQty.do";
            if ( previewInfo != undefined && previewInfo != ""){
                var data ={goodsNo:mgoods.detail.goodsNo, viewMode : previewInfo};
            } else {
                // 상품 상세에서 오늘드림이 체크되어 있는 경우 오늘드림 옵션 리스트조회
                var quickYn = "N"; 
                var mbrDlvpSeq = "";
                var quickGiftYn = "";
                var quickAeEvtNo = "";
                // qDelive checked 값이 Y이면 오늘드림 라디오 선택, N이면 일반배송 라디오 선택이다...
                // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
                if($("input[name=qDelive]:checked").val() == 'Y'){
                    quickYn = "Y";
                    mbrDlvpSeq = $("input[name=mbrDlvpSeqColrChip]").val();
                    quickGiftYn = "Y";
                    quickAeEvtNo = $(".todayGift").data("evtno");
                }
                
                var data ={goodsNo:mgoods.detail.goodsNo
                		, quickYn:quickYn
                		, mbrDlvpSeq:mbrDlvpSeq
                		, quickGiftYn : quickGiftYn
            			, quickAeEvtNo : quickAeEvtNo};
                //var data ={goodsNo:mgoods.detail.goodsNo}; // as-is 로직
            }
            
            common.Ajax.sendRequest("POST",url, data, mgoods.detail._callBackOptInfoListColrChip);
        },
        
        /** 옵션 리스트 조회 * */
        _callBackOptInfoList : function(res) {
            // 옵션 리스트 조회
            $("#opt_other").html(res);
            
            var isShow = true;
            
            if($("#quickYn").val() == "Y" && $("#deliveDay").is(":checked")) {
	            var optOrderStrNo = $("#optOrderStrNo").val();
	            $("#orderStrNo").val(optOrderStrNo);
	            
	        	if(o2oDeliveryYn != undefined && o2oDeliveryYn != null && o2oDeliveryYn == "N") {
	        		$(".addr_newBox").addClass("error").append('<p class="error_info">선택하신 배송지는 일반 배송지역이에요.</p>');
	        		mgoods.detail.validation = 'N';
	
	        		$(".a_adrChange").show();
	                
	                alert("선택하신 배송지로는 주문이 어렵습니다.\n배송지를 변경해 주세요.");
	                isShow = false;
	                return;
	        	}  else if((o2oMeshYn != undefined && o2oMeshYn != null && o2oMeshYn == "N") || 
            			(o2oHldyYn != undefined && o2oHldyYn != null && o2oHldyYn == "Y")) {
	        		$(".addr_newBox").addClass("error").append('<p class="error_info">오늘은 서비스가 불가능한 지역입니다.</p>');
	        		mgoods.detail.validation = 'N';
	
	        		$(".a_adrChange").show();
	                
	                alert("선택하신 배송지로는 주문이 어렵습니다.\n배송지를 변경해 주세요.");
	                isShow = false;
	        	}
            }

            // 처음 호출 시 옵션 리스트 조회 후 레이어 visible
            if(isShow) {
            	$('.select_box .select_opt').parent('.select_box').addClass('open').find('ul').show();
            	$('.opt_choice_area').css({'overflow-y':'visible'})
            	$('.event_info').hide();
            	$('.case_cnt_box').hide(); // 2017-02-20 추가
            	$('.total_price').hide();
            	$('.buy_button_area').hide();
            	$('.prd_item_box_wrap').hide();
            	
            	mgoods.detail.todayDelivery.quickGiftStockInfo(optGiftStockList);
            }
        },
        
        /** 컬러칩 옵션 리스트 조회 * */
        _callBackOptInfoListColrChip : function(data) {
        	
        	var cnt = $("#colrSoldoutCnt").val();
        	
        	for(var i=0; i <cnt;i++){
            	
        		$("#colrChipItem_"+i).attr('class','sold_out');
    			$("#colrParet_"+i).attr('class','soldout');
        	
        		for(var j=0; j < data.todayStockList.length; j++){
            		
            		var itemNo = mgoods.detail.itemNoFormatter(data.todayStockList[j].itemNo,3);
            		
        			
            		if($("input[name=itemNo_"+i+"]").val() == itemNo){
        				$("input[name=colrQuiekInvQtyView_"+i+"]").val(data.todayStockList[j].stkQty);
        				
        				if(data.todayStockList[j].stkQty == 0){
        					$("#colrChipItem_"+i).attr('class','sold_out');
                			$("#colrParet_"+i).attr('class','soldout');
        				}else{
        					$("#colrChipItem_"+i).attr('class','');
        	    			$("#colrParet_"+i).attr('class','');
        				}
        				
        			}
        		
        		}
        		
        		
//        		$("input[name=colrQuiekInvQtyView_"+i+"]").val(data.todayStockList[i].stkQty);
//        		$("#colrChipItem_"+i).attr('class','');
//    			$("#colrParet_"+i).attr('class','');
//        		
//    			if(data.todayStockList[i].stkQty == 0){
//        			$("#colrChipItem_"+i).attr('class','soldout');
//        			$("#colrParet_"+i).attr('class','soldout');
//        		}
        	}

        },
        
        itemNoFormatter : function(n, width) {
      	  n = n + '';
      	  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
      	},
        
        /** 매장 취급 현황 옵션 리스트 조회 */
        optInfoListStore : function(){
            var url = _baseUrl + "goods/getOptInfoListAjax.do";
            var data ={goodsNo:mgoods.detail.goodsNo, store:'Y'};
            common.Ajax.sendRequest("POST",url, data, mgoods.detail._callBackOptInfoListStore);
        },
        
        // 201912
        /** 매장 취급 현황 옵션 리스트 조회 */
        optInfoListStore2 : function(){
            var url = _baseUrl + "goods/getOptInfoListAjax.do";
            var data ={goodsNo:mgoods.detail.goodsNo, store:'Y'};
            common.Ajax.sendRequest("POST",url, data, mgoods.detail._callBackOptInfoListStore2);
        },
        
        /** 매장 취급 현황 옵션 리스트 조회 * */
        _callBackOptInfoListStore : function(res) {
            $(".no_stores_div").hide();
            $(".showNearDiv").hide();
            $('.map_finding').show();// 주변 매장을 찾고 있습니다.
            
            mgoods.detail.offstore.page1Already = "N";
            // alert("=jjj=매장 취급 현황 옵션 리스트
            // 조회=mgoods.detail.offstore.page1Already="+mgoods.detail.offstore.page1Already);
            // 옵션 리스트 조회
            $("#storeOpt").html(res);
            
            $("#pop-full-wrap").html($("#offStoreFullPop").html());
            common.popFullOpen("구매 가능 매장 확인", "mgoods.detail.offlineBurialLink()");   
            $("#pop-full-wrap .popHeader .popTitle").attr("id", "pop-full-title");
            $("#pop-full-wrap .popContainer .popCont").attr("id", "pop-full-contents");
            
            mgoods.detail.offlineBurialLink();
            mgoods.detail.offstore.bindButtonInit();
            
            $(".prd_view_more").click(function(){
                if($("#pop-full-wrap").find("#mTab li.on").index() == 0){ // 주변매장
                    mgoods.detail.offstore.getNearStoreListPaging();
                }else if($("#pop-full-wrap").find("#mTab li.on").index() == 2){ // 매장
                                                                                // 검색
                    mgoods.detail.offstore.getStoreListPaging(mgoods.detail.offstore.offstorePageIdx, 'Y');
                }
            });
        },
        
        // 201912
        /** 매장 취급 현황 옵션 리스트 조회 * */
        _callBackOptInfoListStore2 : function(res) {
            $(".no_stores_div").hide();
            $(".showNearDiv").hide();
            /*$('.map_finding').show();// 주변 매장을 찾고 있습니다.*/   
            
//            mgoods.detail.offstore.page1Already = "N";
            // alert("=jjj=매장 취급 현황 옵션 리스트
            // 조회=mgoods.detail.offstore.page1Already="+mgoods.detail.offstore.page1Already);
            // 옵션 리스트 조회
            $("#storeOpt").html(res);
            
            // footer.jsp 에 있는 팝업 div에 getGoodsDetail.jsp에 있는 div 내용을 갖다 붙인다.
            $("#pop-full-wrap").html($("#offStoreFullPop").html());
            // 팝업 켜지는 부분
            common.popFullOpen("매장 취급 현황", "mgoods.detail.offlineBurialLink2()");   
            $("#pop-full-wrap .popHeader .popTitle").attr("id", "pop-full-title");
            $("#pop-full-wrap .popContainer .popCont").attr("id", "pop-full-contents");
            
            mgoods.detail.offlineBurialLink2();
            mgoods.detail.offstore.bindButtonInit2();
            
            /*$(".prd_view_more").click(function(){
                if($("#pop-full-wrap").find("#mTab li.on").index() == 0){ // 주변매장
                    mgoods.detail.offstore.getNearStoreListPaging(mgoods.detail.offstore.offNearStorePageIdx, 'Y');
                }else if($("#pop-full-wrap").find("#mTab li.on").index() == 2){ // 매장
                                                                                // 검색
                    mgoods.detail.offstore.getStoreListPaging(mgoods.detail.offstore.offstorePageIdx, 'Y');
                }
            });*/
        },
        
        // -----------------------------------------------------------------
        /**
         * 2017-02-18 txs 추가
         * 
         * 상품상세 HTML 재가공 단말에서 일부 이미지 등의 Object가 Layout을 벗어나는 문제 수정을 위해 추가 함
         * 
         * 상품상세 페이지 로드 후에 호출 할것.
         * 
         * 
         */
        // start mgoods.detail.tagHandler //
        tagHandler : {
            removeAttrs : function(jqObj, attrs) {
                var strArray = attrs.split(",");
                var strLen = strArray.length;
                
                for(var i=0; i<strLen; i++){
                    jqObj.removeAttr(strArray[i]);
                }
            },
            inittGoodsDetailObjects : function() {
                // 상품상세 Layout Containner
                // TODO TXS 상품 상세에서 Layout 깨지는 현상을 확인한 후 해당 영역으로 다시 수정 할것!
                mgoods.detail.tagHandler.convertMobileHtml($("#tempHtml"));
                
// $("div.buy_button_area").resize();
            },
            /**
             * 
             * 모바일 html 재가공 단말에서 일부 이미지 등의 Object가 Layout을 벗어나는 문제 수정을 위해 추가 함
             * 
             * @param jqContainner
             *            검사 할 영역의 최 상위 JQuery Object
             * 
             */
            convertMobileHtml: function (jqContainer) {

                // html이 깨져있을 수 있어 html을 조회한 후 해당 값을 대입시켜주는 방식
                var tmpHtml = jqContainer.html();
                jqContainer.html(tmpHtml);

// var checkNum = 0;
// var removeAttrList = "style,width,height";
//                
// jqContainer.children().each(function (n) {
// checkNum++;
// if (checkNum < 2) {
// return;
// }
// mgoods.detail.tagHandler.removeAttrs($(this), removeAttrList);
// });
// jqContainer.find("tr, col, td, th").each(function (n) {
// mgoods.detail.tagHandler.removeAttrs($(this), removeAttrList);
// });
// jqContainer.find("ul, li").each(function (n) {
// mgoods.detail.tagHandler.removeAttrs($(this), removeAttrList);
// });
// jqContainer.find("table, iframe").each(function (n) {
// mgoods.detail.tagHandler.removeAttrs($(this), removeAttrList);
// $(this).attr("width", "100%");
// });
//                
// var imgCnt = jqContainer.find("img").length;
// var loadedImgCnt = 0;
// jqContainer.find("img").each(function (n) {
// var _this = $(this);
// mgoods.detail.tagHandler.removeAttrs(_this, removeAttrList);
//
// var img = new Image();
// img.onload = function () {
// loadedImgCnt++;
// //해당 이미지가 300픽셀보다 작으면 패스~
// if (this.width > 300) {
// _this.attr("width", "100%");
// }
// }
// img.onerror = function() {
// loadedImgCnt++;
// }
//                    
// img.src = _this.attr("src").replace(/http:\/\//g, "https://");
// });
//                
// var intervalCnt = 0;
// tmpIntervalVal = setInterval(function() {
// intervalCnt++;
// if (imgCnt == loadedImgCnt) {
// $(".prdViewimg").append(jqContainer.html());
// clearInterval(tmpIntervalVal);
// }
// if ( intervalCnt == 100 ){
// clearInterval(tmpIntervalVal);
// }
// }, 100);
                
                $(".prdViewimg").append(jqContainer.html());
                
            }
            
        }, // eof mgoods.detail.tagHandler //
        // -----------------------------------------------------------------
        
        
        /** 세트 상품 오프라인 매장재고 문구 Alert * */
        alertOffline : function(){
            alert("세트로 구성된 상품은 매장 재고 조회를 하실 수 없습니다.");
            return false;
        },
        
        /* 20190919 오늘드림 긴급배포로 인해 주석 처리 시작 */
//        /** 초기 진입시 탭 이동 **/
//        paramMoveTab : function(tab){
//            if ( tab != undefined && tab != "" && tab == "2" ){
//                setTimeout(function(){
//                    var tabPos = $(".line_tab_list").position();
//                    window.scroll(0, tabPos.top);
//                    $("#gdasInfo > a").click();    
//                }, 500);
//            }
//            
//            sessionStorage.removeItem("moveTab");
//        },
        /* 20190919 오늘드림 긴급배포로 인해 주석 처리 끝 */
        
        // 웹로그 바인딩
        bindWebLog : function(){
            // 브랜드상품 전체보기
            $(".goods_brandall").bind("click", function(){
                common.wlog("goods_brandall");
            });
            // 브랜드관
            $(".goods_brand").bind("click", function(){
                common.wlog("goods_brand");
            });
            // 장바구니
            $(".goods_cart").bind("click", function(){
                common.wlog("goods_cart");
            });
            // 구매하기
            $(".goods_buy").bind("click", function(){
                common.wlog("goods_buy");
            });
            // 찜
            $(".goods_wish").bind("click", function(){
                common.wlog("goods_wish");
            });
            // 오프라인 매장재고 확인
            $(".goods_offline").bind("click", function(){
                common.wlog("goods_offline");
            });
            // 증정품 안내 배너
            $(".goods_giftinfo").bind("click", function(){
                common.wlog("goods_giftinfo");
            });
            // N+1 행사 안내 배너
            $(".goods_nplus1").bind("click", function(){
                common.wlog("goods_nplus1");
            });
            // 상세정보탭
            $(".goods_detailinfo").bind("click", function(){
                common.wlog("goods_detailinfo");
            });
            // 구매정보탭
            $(".goods_buyinfo").bind("click", function(){
                common.wlog("goods_buyinfo");
            });
            // 상품평탭
            $(".goods_reputation").bind("click", function(){
                common.wlog("goods_reputation");
            });
            //  상품편개편 시 주석 처리 - line 1095 ~ 1102 (2019.04.11)
            /*
            // 상품평 - 프리미엄탭
            $(".goods_reputation_premium").bind("click", function(){
                common.wlog("goods_reputation_premium");
            });
            // 상품평 - 한줄탭
            $(".goods_reputation_oneline").bind("click", function(){
                common.wlog("goods_reputation_oneline");
            });
            */
            // Q&A탭
            $(".goods_qna").bind("click", function(){
                common.wlog("goods_qna");
            });
            // 카테고리베스트상품
            $(".goods_catebest").bind("click", function(){
                common.wlog("goods_catebest");
            });
            // 연관된 기획전
            $(".rel_planshop").bind("click", function(){
                common.wlog("rel_planshop");
            });
            // 연관상품 버튼 
            $(".btnRel").bind("click", function(){
                common.wlog("btnRel");
            });
            //하단 체크
            var scrollFlag="N";
            $(window).on('scroll', function(){
               var _docuHeight = $(document).height(),
                    _scrollHeight = $(window).height() + $(window).scrollTop();
               
               //console.log('_docuHeight : ' + _docuHeight);
               //console.log('_scrollHeight : ' + _scrollHeight);
               
               if((_docuHeight - _scrollHeight)/_docuHeight === 0){
                   if(scrollFlag=="N"){
                       common.wlog("goods_scroll_end");
                       scrollFlag="Y";
                   }
               }           
            });
        },
        
        // 웹로그 바인딩
        barcodeBindWebLog : function(){

            // 상세정보탭
            $(".goods_detailinfo").bind("click", function(){
                common.wlog("barcode_detailinfo");
            });
            // 구매정보탭
            $(".goods_buyinfo").bind("click", function(){
                common.wlog("barcode_buyinfo");
            });
            // 상품평탭
            $(".goods_reputation").bind("click", function(){
                common.wlog("barcode_reputation");
            });
            //  상품편개편 시 주석 처리 - line 1095 ~ 1102 (2019.04.11)
            /*
            // 상품평 - 프리미엄탭
            $(".goods_reputation_premium").bind("click", function(){
                common.wlog("barcode_reputation_premium");
            });
            // 상품평 - 한줄탭
            $(".goods_reputation_oneline").bind("click", function(){
                common.wlog("barcode_reputation_oneline");
            });
            */
            // 바코드스캔
            $(".go_barcode").bind("click", function(){
                common.wlog("barcode_go_barcode");
            });
            // 홈이동
            $(".go_home").bind("click", function(){
                common.wlog("barcode_go_home");
            });
            // 카테고리베스트상품(바코드)
            $(".goods_catebest_barcode").bind("click", function(){
                common.wlog("goods_catebest_barcode");
            });
            // 찜(바코드)
            $(".goods_wish_barcode").bind("click", function(){
                common.wlog("goods_wish_barcode");
            });
            //  연관된 기획전(바코드)
            $(".rel_planshop_barcode").bind("click", function(){
                common.wlog("rel_planshop_barcode");
            });
            // 연관상품 버튼(바코드)
            $(".btnRel_barcode").bind("click", function(){
                common.wlog("btnRel_barcode");
            });
        },
        
        // 배송이 오늘드림인경우 일반상품과 오늘드림 옵션상품이 같이 있는지 여부를 판단 jwkim
        checkQuick : function(){
            
            var chkQuick = false;
            var optionKey = "";
            var goodsNo = $("input[name=sGoodsNo]").val()
            var quickYn = "";
            
            if($("#deliveDay").prop("checked")==true){
                $(".prd_item_box input[name=itemNo]").each(function(){
                    
                    optionKey = goodsNo+$(this).val();
                    quickYn = $("#quickYn_"+optionKey).val();
                    
                    if(quickYn == "N"){
                        chkQuick = true;
                    }
                    
                });
            } else {
                chkQuick = false;
            }
            
            return chkQuick;
        },
        
        /** 상품기술상세서 콜백 **/
        _callBackSetLoGoodsDetailHtml : function(data){
            if( data.trim() == ''){
            }else{
                //var goodsHtml = $(data).find('.iPrdViewimg');
                $('.prdViewimg').append(data);
                
                mgoods.detail.setGoodsDetailLoad();
                
                /*
                resizeYoutube();                
                $(window).resize(function(){resizeYoutube();});
                $(function(){resizeYoutube();});
                function resizeYoutube(){ $("iframe").each(function(){ if( /^https?:\/\/www.youtube.com\/embed\//g.test($(this).attr("src")) ){ $(this).css("width","100%"); $(this).css("height",Math.ceil( parseInt($(this).css("width")) * 480 / 854 ) + "px");} }); }
                */
            }

        },
        /** 상품기술상세서 콜백 **/
        _callBackSetGoodsDetailHtml : function(data){
            //if( data.trim() == '' || $(data).find('.speedycat-container').html() == undefined){
        	if( data.trim() == ''){
                var url = _baseUrl + "goods/getGoodsDesc.do";
                var goodsNo = $("#goodsNo").val();
                var dispCatNo = $("#dispCatNo").val();
                var data = {goodsNo : goodsNo, dispCatNo : dispCatNo};
                common.Ajax.sendRequest("POST",url,data,mgoods.detail._callBackSetLoGoodsDetailHtml); 
            }else{
                $('.prdViewimg').append(data);
                
                //유튜브 너비 조정
//                var _tempHtml2 = $('#tempHtml2').find('iframe');
//                _tempHtml2.wrap('<div class=video_size></div>');
                
                mgoods.detail.setGoodsDetailLoad();
                
                /*
                resizeYoutube();                
                $(window).resize(function(){resizeYoutube();});
                $(function(){resizeYoutube();});
                function resizeYoutube(){ $("iframe").each(function(){ if( /^https?:\/\/www.youtube.com\/embed\//g.test($(this).attr("src")) ){ $(this).css("width","100%"); $(this).css("height",Math.ceil( parseInt($(this).css("width")) * 480 / 854 ) + "px");} }); }
                */
            }
            
        },
        
        /** 로컬 상품기술상세서 셋팅 **/
        setLoGoodsDetailHtml : function(){
            var url = _baseUrl + "goods/getGoodsDesc.do";
            var goodsNo = $("#goodsNo").val();
            var dispCatNo = $("#dispCatNo").val();
            var data = {goodsNo : goodsNo, dispCatNo : dispCatNo};
            common.Ajax.sendRequest("POST",url,data,mgoods.detail._callBackSetLoGoodsDetailHtml); 
        },

        /** CDN 상품기술상세서 셋팅 **/
        setGoodsDetailHtml : function(){
            var url = _baseUrl + "goods/getCdnGoodsDesc.do";
            var requestUrl = "http://ca.oliveyoung.co.kr/Acceleration/Cached";
//            var requestUrl = "http://ca.speedycat.co.kr/Acceleration/Cached";  테스트 용도 url
            var cVer = $("#sysModDtime").val().replace(/(-|:| )/g, "").substr(0,12);   // 기존 일자까지 전송 - > 시,분까지 전송하여 TTL 만료 이전 빠른 갱신을 위해 변경 -by jp1020 | 2020.05.21
            var tu = _baseUrl + "goods/getGoodsDesc.do?goodsNo="+mgoods.detail.goodsNo+"&dispCatNo="+mgoods.detail.dispCatNo;
//            var tu = "http://mqa.oliveyoung.co.kr/m/goods/getGoodsDesc.do?goodsNo="+mgoods.detail.goodsNo+"&dispCatNo="+mgoods.detail.dispCatNo; // for test
            var data = {
                              pid  : mgoods.detail.goodsNo
                            , cVer : cVer
                            , dv   : "MO"    
                            , charset : "utf-8"
                            , eVer : "2.0.0"
                            , inc_css : "N"
                            , inc_js : "N"                                
                            , tu   : tu
                            , requestUrl   : requestUrl
                            , v : "190524" // css, js version 정보
                            , cssUrl : "http://ca.oliveyoung.co.kr/Cont/Css/s-style_v2.min.css"
                            , jsUrl  : "http://ca.oliveyoung.co.kr/Cont/Js/slazy_v2.min.js"
                            , reqTime : "N" // reqTime = Y 면 was시간 같이 넘김
                            , https : "Y"	
                        };
            
            $.ajax({
                type   : "GET"
               ,url    : url
               ,data   : data
               ,async  : true
               ,cache  : true
               ,success: function(response){
                   common.Ajax.proceed(response, mgoods.detail._callBackSetGoodsDetailHtml);
                }
               ,error  : function (jqXHR,error, errorThrown){
                   // error 발생시 로컬 상품기술상세서 셋팅
                   mgoods.detail.setLoGoodsDetailHtml();
                }
               ,beforeSend : function (xhr){
                   xhr.setRequestHeader("stonUseYn", "Y");
                }
              });
            
        } // end, setGoodsDetailHtml

      , setGoodsDetailLoad : function(){
//            if ($("#markerTest").parents().find(".tab1").hasClass("show")) {
	    	  var _tab1 = $('.tab_prod_deail>ul>li:first-child'); 
	          if (_tab1.hasClass("on")) {
                if(typeof(sLazy)!='undefined'){
                    SlazyReSet();
                };
                
                var prdViewDetailPinch =  null;
                if($("#markerTest").length>0){
                    prdViewDetailPinch =new IScrollZoom("#markerTest",{
                        zoom:true,
                        scrollX:true,
                        scrollY:true,
                        eventPassthrough:false,
                        preventDefault:false,
                        lockDirection:false,
                        bounce:false,
                        momentum:false,
                        zoomMax:4
                    });
                }
                
                $(window).on("scroll", function() {
                    var notLoadedImg = $("#markerTest .prdViewimg").find(".s-lazy:not(.s-loaded)");
                    if (notLoadedImg.length > 0 && notLoadedImg.offset().top <= ( $("#markerTest .prdViewimg").parent().height() * 3 ) ) {
                        if(typeof(sLazy)!="undefined"){
                            sLazy.revalidate(); 
                            tabContsWrap.update();
                        }; 
                    }else if (notLoadedImg.length === 0) {
                    		tabContsWrap.update();
	               }
	               
                });
                
                
                
                mgoods.detail.resizeIframe();
                $(window).resize(function(){mgoods.detail.resizeIframe();});
            }
        }
      
      , resizeIframe : function(){
          $("#tempHtml2 iframe").each(function(){
              var ih =  parseInt($(this).height());
              var iw =  parseInt($(this).width());
              $(this).css("width","100%");
              $(this).css("height",Math.ceil( parseInt($(this).css("width")) * (ih / iw) ) + "px");
          });
      }
      
      // 선물하기 옵션 관련 문구 show
      , showPresentOptionText : function(){
          // 옵션이 있고, 옵션 레이어가 열려 있고, 오늘드림 체크 안된 경우에만 show
          if ( $(".prd_option_layer").css("display") == 'block' && $("#dupItemYn").val() == 'Y' && $(":input[name=qDelive]:checked").val() != 'Y'){
            // 닫기 여부 체크 후 안닫은 경우에만 show
            var presentOptionTextCloseYn = sessionStorage.getItem("presentOptionTextCloseYn");
            if(presentOptionTextCloseYn == "Y"){
                // 계속 안나오게 처리해야 할 경우 txt_info_gift에  class="is-close" 추가 
                $('.prd_buy_wrap.type_gift').find('.txt_info_gift').addClass('is-hide is-close');
            }else{
                // 닫은 적 없는 경우 show
                $('.prd_buy_wrap.type_gift').find('.txt_info_gift').show().removeClass('is-hide');
            }
          }
      }
};


/** 상품 Q&A */
$.namespace("mgoods.detail.qna");
mgoods.detail.qna = {
        
        qnaPageIdx : 1,
        
        /** 상품 Q&A 초기화 * */
        init : function(){
            mgoods.detail.qna.bindButtonInit();
// mgoods.detail.qna.getQnaListPaging(mgoods.detail.qna.qnaPageIdx);
            mgoods.detail.qna.initQnaCall();
// PagingCaller.destroy();
        },
        
        /** 결과 값 HTML */
        _callBackQnaListAjax : function(data){
            $("#qnaWrap").append(data);
            mgoods.detail.qna.getQnaListPaging(mgoods.detail.qna.qnaPageIdx);
        },
        
        /** 결과 값 HTML */
        _callBackSlideQnaListAjax : function(data){
            $("#qnaWrap").append(data);
            mgoods.detail.qna.getQnaSlideListPaging(mgoods.detail.qna.qnaPageIdx);
        },
        
        initQnaCall : function(){
            // 코드 완료 후 스토어 정보 조회
            var param = {
                    goodsNo    : mgoods.detail.goodsNo ,
                    pageIdx : mgoods.detail.qna.qnaPageIdx, // 페이징 인덱스
                    gdasSctCd : '20'
            }
            common.Ajax.sendRequest(
                    "GET"
                    , _baseUrl + "goods/getQnaListJson.do"
                    , param
                    , mgoods.detail.qna._callBackGetQnaListListPaging);
        },
        
        /** 상품평 목록 버튼 초기화 * */  
        bindButtonInit : function(){
            
            $("#qnaList").find(".readyBind").unbind("click");
            $("#qnaList").find(".readyBind").click(function(e){
            	e.preventDefault();
                if($(this).parent().hasClass('on')){
                    $(this).parent().removeClass('on');
                }else{
                    $(this).parent().addClass('on').siblings().removeClass('on');
                }
              //상품상세 화면 사이즈 MJH
                zoomSet_h_goodjs();
            });
            
            // Ajax 조회해 온 값만 Bind
            $("#qnaList").find(".readyBind").addClass("completeBind");
            $("#qnaList").find(".completeBind").removeClass("readyBind");
        },
        
        /** Q&A 목록 조회 JSON * */
        getQnaListPaging : function(pageIdx){
            
            // 연속키 방식
            PagingCaller.init({
                callback : function(){
                    // 코드 완료 후 스토어 정보 조회
                    var param = {
                            goodsNo    : mgoods.detail.goodsNo ,
                            pageIdx : mgoods.detail.qna.qnaPageIdx, // 페이징 인덱스
                            gdasSctCd : '20'
                    }
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "goods/getQnaListJson.do"
                            , param
                            , mgoods.detail.qna._callBackGetQnaListListPaging
                            , false);
                }
            ,startPageIdx : pageIdx
            ,subBottomScroll : 700
            ,initCall : false
            });
            
        },
        
        /** Q&A 목록 조회 JSON * */
        getQnaSlideListPaging : function(pageIdx){
            
            // 연속키 방식
            PagingCaller.init({
                callback : function(){
                    // 코드 완료 후 스토어 정보 조회
                    var param = {
                            goodsNo    : mgoods.detail.goodsNo ,
                            pageIdx : mgoods.detail.qna.qnaPageIdx, // 페이징 인덱스
                            gdasSctCd : '20'
                    }
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "goods/getQnaListJson.do"
                            , param
                            , mgoods.detail.qna._callBackGetQnaListListPaging
                            , false);
                }
            ,startPageIdx : pageIdx
            ,subBottomScroll : 700
            ,initCall : false
            });
            
        },
        
        /** Q&A 목록 조회 JSON 콜백 * */
        _callBackGetQnaListListPaging : function(res){
            
            // 조회된 데이터 유무에 따른 분기
            if ($.trim(res).length == 0) {
                // Q&A 데이터가 존재하지 않을 때
                if($("#qnaList").find("li").length < 1){
                    var noHtml = "<li class='no_txt_data' id='qnaSchNoData'>등록된 상품문의가 없습니다.</li>";
                    $("#qnaList").html(noHtml);
                }
                // 응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
                
                zoomSet_h_goodjs();
                PagingCaller.destroy();
                return;
            }else{
                
                // 템플릿 APPEND
                $("#qnaListTemplate").tmpl(res).appendTo("#qnaList");
                
                $(".question_box .question .cont").each(function() { 
                    $(this).html($(this).text().replace(/\n/g, "<br/>")); 
                });
                
                $(".question_box .answer .cont").each(function() { 
                    $(this).html($(this).text().replace(/\n/g, "<br/>")); 
                });

                // jqueryTemplate 마스킹안되서 스크립트 처리
                $(".mbrId").each(function(){
                    var mbrId = $(this).text();
                    var replaceStr = mbrId.substring(mbrId.length-4, mbrId.length);
                    $(this).text(mbrId.replace(replaceStr, "****"));                
                });
                
                mgoods.detail.qna.bindButtonInit();
                
                // 페이지 증가
                mgoods.detail.qna.qnaPageIdx = mgoods.detail.qna.qnaPageIdx + 1;
                
                var qnaCnt = Number($("#realQnaCnt").val());
                var curQnaListCnt = $(".prd_qna_list").find("li").length;
                
                //상품상세 화면 사이즈 MJH
                zoomSet_h_goodjs();
                
                return;
            }
            
        },
        
        /** 상품 Q&A 등록 페이지로 이동 * */
        moveGoodsQnaRegPage : function(goodsNo){
            var matchKey = (new Date()).getTime();
            
            // 상품번호/referrer/ idx 3 탭 저장
            sessionStorage.setItem("saved_goodsTab", mgoods.detail.goodsNo + "|" + matchKey + "|3");

            var retUrl = _baseUrl + "goods/getGoodsDetail.do?mKey=" + matchKey + "&goodsNo="+mgoods.detail.goodsNo;
            document.location.href = _baseUrl + "mypage/getGoodsQnaForm.do?goodsNo="+mgoods.detail.goodsNo + "&retUrl=" + encodeURIComponent(retUrl);
        },
        
        /** 상품 Q&A 수정 페이지로 이동 * */
        moveGoodsQnaModPage : function(gdasSeq, goodsNo){
            var matchKey = (new Date()).getTime();
            
            // 상품번호/referrer/ idx 3 탭 저장
            sessionStorage.setItem("saved_goodsTab", mgoods.detail.goodsNo + "|" + matchKey + "|3");

            var retUrl = _baseUrl + "goods/getGoodsDetail.do?mKey=" + matchKey + "&goodsNo="+mgoods.detail.goodsNo;
            var formDetail = $("#qnaForm");

            formDetail.find("input[name*='gdasSeq']").val(gdasSeq);
            formDetail.find("input[name*='retUrl']").val(retUrl);
            formDetail.attr('action', _baseUrl + "mypage/getGoodsQnaForm.do");
            formDetail.attr('method', "POST");
            formDetail.submit();
        },
        
        /** 상품 Q&A 삭제 * */
        moveGoodsQnaDel : function(gdasSeq){
            
            if ( confirm("상품 Q&A를 삭제하시겠습니까?") ){
                var loginCheck = common.loginChk();
                
                if ( loginCheck ){
                    var data = {gdasSeq : gdasSeq};
                    _ajax.sendRequest("POST"
                        , _baseUrl + "mypage/delQnaJson.do?gdasSeq="+gdasSeq
                        , data
                        , mgoods.detail.qna.delGoodsQnaSuccess
                    );
                }    
                
            }else{
                return;
            }
            
        },
        
        /** 상품 Q&A 삭제 콜백 * */
        delGoodsQnaSuccess : function(data){
            
            if(data == "000"){
                 
                var matchKey = (new Date()).getTime();
                
                // 상품번호/referrer/ idx 3 탭 저장
                sessionStorage.setItem("saved_goodsTab", mgoods.detail.goodsNo + "|" + matchKey + "|3");

                alert("성공적으로 삭제하였습니다.");
                $("#qnaList").html("");
                location.href = _baseUrl + "goods/getGoodsDetail.do?mKey=" + matchKey + "&goodsNo=" + $("#goodsNo").val();
            }else{
                alert("삭제가 실패하였습니다.");
            }
        }
        
}

/** 쿠폰 * */
$.namespace("mgoods.detail.coupon");
mgoods.detail.coupon = {
        
        /** 쿠폰 다운로드 콜백 * */
        _callBackCouponDownload : function(data){
            if( data.ret == '-1'){
                common.link.moveLoginPage();                
            }else{
                alert(data.message);
                common.popLayerClose('LAYERPOP01');
            }

        },

        /** 쿠폰 다운로드 클릭 * */
        couponDownload : function(cpnNo){
            var url = _baseUrl + "main/downCouponJson.do";
            var data = {cpnNo : cpnNo};
            common.Ajax.sendRequest("POST",url,data,mgoods.detail.coupon._callBackCouponDownload); 
        }
        
        ,
        /** 쿠폰 다운로드 콜백 클릭 상품상세용 YCH 20200610 * */
        couponDownloadForDetail : function(cpnNo,decpnNo){
            var url = _baseUrl + "main/downCouponJson.do";
            var data = {cpnNo : cpnNo};
            
            //20200609 YCH 상품상세 쿠폰다운로드시 확인용 추가
            try {
            	$('#hidden_cpno').val(decpnNo);
            }catch(e){}
            
            common.Ajax.sendRequest("POST",url,data,mgoods.detail.coupon._callBackCouponDownloadForDetail); 
        }   
        ,

        _callBackCouponDownloadForDetail : function(data){

            if( data.ret == '-1'){
                common.link.moveLoginPage();                
            }else{
            	 //20200609 YCH 상품상세 쿠폰다운로드시 확인용 추가
            	 if(data.ret=="0"){

            		 var vCpnNo=$('#hidden'+'_cpno').val();

	            	 try {
	            		
	            		 var vCpnNo=$('#hidden'+'_cpno').val();
	            		
	            		 $('#spn_cpno_'+vCpnNo).html("발급완료");
	            		 $('#btn_cpno_'+vCpnNo).parent().attr('class','prd_coupon disabled');
	            		 $('#btn_cpno_'+vCpnNo).attr("disabled", true);
	            	      alert(data.message);
	            		 if(vCpnNo !="") return;
	            	 }catch(e){}
            	 }
            	//20200609 YCH 상품상세 쿠폰다운로드시 확인용 추가
                 alert(data.message);
                 common.popLayerClose('LAYERPOP01');
            }

           
        }
        , isCouponDowloadCheck : function(frm){
        	var self = $(frm);
//      	if(self.parent().parent().children('.btn_coupon').is(":disabled")){
//      		
//      		return false;
//      		
//      	}else{
      		mgoods.detail.openCouponLayerPop();
//      	}
      	
      	
      		
      }
        /** 쿠폰 다운로드 클릭 상품상세용 YCH 20200610 * */
      
        
},


/** 재입고 알림 페이지 */
$.namespace("mgoods.detail.alertstock");
mgoods.detail.alertstock = {
        
        /** 재입고 알림 페이지 초기화 * */
        init : function(){
        },
        
        /** 재입고 알림 페이지 콜백 * */
        _callBackAleartStockForm : function(data){
            $("#stockAlimLayer").html("");
            $("#stockAlimLayer").html(data);
        },
        
        /** 재입고 알림 버튼 초기화 * */
        bindButtonInit : function(){
            /** 재입고 알림 레이어 닫기 Bind */
            $("#stockAlimClose").click(function(){
                $("#stockAlimLayer").hide();
            });
        }
};

/** 재고보유 현황 * */
$.namespace("mgoods.detail.offstore");
mgoods.detail.offstore = {
        
        offstorePageIdx : 1,
        offNearStorePageIdx : 1,
        myStoreYn : 'N',
        nearStoreYn : 'N',
        lgcGoodsNo : $("#lgcGoodsNo").val(),
        searchWords : "",
        btnYn : "",
        loginYn : "",
        stockCnt : "",
        searchYn : 'N',
        page1Already : 'N',
// askLoc : "", //매장 취급 현황의 탭을 클릭한건지, 상품상세의 버튼을 클릭한 건지
        searchNear : false,
        isNearAvail : true, // 주변매장 가능 여부
        
        // 201912
        usrLat : "",
        usrLng : "",
        
        buttonStarClickCnt : 0, //관심매장 등록 클릭 수
        buttonStarClickPreStoreNo : "", //관심매장 등록 이전 클릭 매장번호
        favorCount : 0,
        
        geoFlag : 'Y',
        
        
        // 재입고신청 버튼 이벤트 (추후 사용 예정)
        regAlimStock : function(strNo) {
            var itemNo = $('#pop-full-wrap').find('#selectItemNo').val();
        	if(itemNo == null || itemNo == ""){
        		alert("죄송합니다. 시스템 오류로 재입고 알림이 등록되지 않았습니다.");
        		return;
        	}else{
        		common.openStockOffStoreAlimPop(__goodsNo,itemNo, strNo);
        	}
        },
        
        /*getFavorCountAjax : function() {
            console.log("getFavorCountAjax");
            
            var param = {}
            common.Ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "store/getFavorStoreListJson2.do"
                    , param
                    , mgoods.detail.offstore._callback_getFavorStoreListAjax);
        },
        
        _callback_getFavorStoreListAjax : function(strData) {
            mgoods.detail.offstore.dispFavorStoreArea(strData);
        },
        
     // 201912 fixed
        dispFavorStoreArea : function(favorObj){
            mgoods.detail.offstore.favorCount = favorObj.totalCount;

        },*/
        
     // 201912 fixed
        /** 재고보유현황 초기화 * */
        init : function(_nearStoreYn, _myStoreYn, _searchWords, _btnYn, _stockCnt, _loginYn, _usrLat, _usrLng){
            
            mgoods.detail.offstore.searchWords = _searchWords;
            mgoods.detail.offstore.btnYn = _btnYn;
            mgoods.detail.offstore.loginYn = _loginYn;
            mgoods.detail.offstore.stockCnt = _stockCnt;
            
            mgoods.detail.offstore.myStoreYn = _myStoreYn;
            
            // 앱여부
            if(common.app.appInfo.isapp){
                
                var tempCompareVersion = "";
                
                if (common.app.appInfo.ostype == "10") {
                    tempCompareVersion = '2.1.1'; // ios
                }else if(common.app.appInfo.ostype == "20"){
                    tempCompareVersion = '2.0.9'; // android
                }
                
                // 앱버전 비교
                var varCompareVersion = common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion);
                if(varCompareVersion  ==  "<" || varCompareVersion == "="){
                    
                    mgoods.detail.offstore.isNearAvail = false;
                    
                }
            }
            
            if(common.app.appInfo.isapp){
                location.href = "oliveyoungapp://getLocationSettings";
                localStorage.setItem("useLoc", "Y");
            }else{
                localStorage.setItem("useLoc", "Y");
            }
            
            startGeoLcation();
            // 가까운 매장 검색인 경우
            // 주변기능 사용 가능할 때,
//            if ( !mgoods.detail.offstore.isNearAvail ){
//                
//                localStorage.setItem("askLoc", "Y");
//                localStorage.setItem("useLoc", "Y");
//                
//                
//            }else {
//                if(_myStoreYn == 'N') {
//                    mgoods.detail.offstore.getNearStoreListPaging(); 
//                    $(".showNearDiv").show();
//                    
//                }else {
//                    mgoods.detail.offstore.getMyStoreList();
//                    
//                }
//            }
            // 셀렉트 박스에 선택된 값으로 각 탭의 값 수정
            if ( $("#pop-full-wrap").find("#mTab").find("li>a#nearSearch").hasClass("on") ){
                $("#pop-full-wrap").find("#mTab").find("li").eq(0).attr("data-ref-lgcGoodsNo", $("#pop-full-wrap").find('#stockLayerGoodsOpt option:selected').val());
            }else if( $("#pop-full-wrap").find("#mTab").find("li>a#strSearch").hasClass("on") ){
                $("#pop-full-wrap").find("#mTab").find("li").eq(1).attr("data-ref-lgcGoodsNo", $("#pop-full-wrap").find('#stockLayerGoodsOpt option:selected').val());
            }
        },
        
        setMapEvent : function(strNo, dist, openYn){
            common.link.moveStoreDetailPage(strNo, dist, openYn);
        },     
        
        // 201912 fixed
        setStarEvent : function(obj){
            
            var activeFlag = obj.hasClass('on');
            /*var activeFlag = thisEle.hasClass('on');*/
            /*var activeFlag = thisEle.classList.contains("on");*/ 
            
            /*var strNo = obj.parent().find("input[name*='storeNo']" ).val();*/
            /*var strNo = obj.parent().next().val();*/
            var strNo = obj.parent().nextAll("input[name*='storeNo']").val();
            /*var strNo = thisEle.parent().nextAll("input[name*='storeNo']").val();*/
            
            if (activeFlag == true){
                this.delFavorStoreAjax(strNo , obj);
            }else{
                /*mstore.common.regFavorStoreAjax(strNo);*/
                this.regFavorStoreAjax(strNo , obj);
            }
        },
        
        delFavorStoreAjax : function(strNo , obj) {

            if(!mgoods.detail.offstore.logincheck(strNo)){
                return;
            }
            
            if(mgoods.detail.isProcessing) {
                mstore.common.isProcessing = true;
                return false;
            }
            
            mgoods.detail.favorObj = $(obj);

            common.Ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "store/delFavorStoreJson.do"
                    , "strNo="+ strNo
                    , this._callback_delFavorStoreAjax);

        },
        
        _callback_delFavorStoreAjax : function(strData) {

            if(strData.ret == "0"){
                /*alert(strData.message);*/
                /*common.gnb.callSlideMenuAjax();*/
                
                // TODO 페이지를 리로딩하면 안되고, 에이젝스로 리스트를 다시 가져와야 함.
                /*location.reload();*/
                /*mgoods.detail.offstore.bindButtonInit2();*/
                
                var onFlag = mgoods.detail.favorObj.hasClass("on");
                if(onFlag) {
                    mgoods.detail.favorObj.removeClass("on");
                    mgoods.detail.favorObj.addClass("active");
                }
                
                mgoods.detail.isProcessing = false;
            }else{
                common.loginChk();
            }

        },
        
        /*regFavorStoreAjax : function(strNo,viewMode) {*/
        regFavorStoreAjax : function(strNo , obj) {
            
            mgoods.detail.offstore.buttonStarClickPreStoreNo = strNo;
            // 클릭한 매장번호가 이전 매장번호하고 같은면 연속클릭 판단
            /*if(mgoods.detail.offstore.buttonStarClickPreStoreNo == strNo){
                mgoods.detail.offstore.buttonStarClickCnt++;
            }*/
            // 더블클릭 방지
            /*if(mgoods.detail.offstore.buttonStarClickCnt > 1){
                console.log("ddd");
                return false;
            }*/
            
            if(mgoods.detail.isProcessing){
                mgoods.detail.isProcessing = true;
                return false;
            }
            
            if(!mgoods.detail.offstore.logincheck(strNo)){
                mgoods.detail.offstore.buttonStarClickCnt = 0;
                mgoods.detail.offstore.buttonStarClickPreStoreNo = "";
                return;
            }

            if(mgoods.detail.offstore.favorCount  >= 3){
                alert(_messageLimit);
                mgoods.detail.offstore.buttonStarClickCnt = 0;
                mgoods.detail.offstore.buttonStarClickPreStoreNo = "";
                return;
            }
            /*mgoods.detail.offstore.buttonStarClickPreStoreNo = strNo;
            // 클릭한 매장번호가 이전 매장번호하고 같은면 연속클릭 판단
            if(mgoods.detail.offstore.buttonStarClickPreStoreNo == strNo){
                mgoods.detail.offstore.buttonStarClickCnt++;
            }*/
            
            mgoods.detail.favorObj = $(obj);
            
            common.Ajax.sendJSONRequest(
                    "POST"
                    , _baseUrl + "store/regFavorStoreJson.do"
                    , "strNo="+ strNo
                    , this._callback_regFavorStoreAjax);
        },
        
        _callback_regFavorStoreAjax : function(strData) {

            if(strData.ret == "0" || strData.ret == "20" || strData.ret == "30"){
                alert(strData.message);
                /*common.gnb.callSlideMenuAjax();*/
                
                // TODO 페이지를 리로딩하면 안되고, 에이젝스로 리스트를 다시 가져와야 함.
                /*location.reload();*/
                /*mgoods.detail.offstore.bindButtonInit2();*/
            } else if (strData.ret == "10") {/*else if(strData.ret == "40"){
                // 관심매장 쿠폰 첫 1회 발급 */
                
                var onFlag = mgoods.detail.favorObj.hasClass("active");
                if(onFlag) {
                    mgoods.detail.favorObj.removeClass("active");
                    mgoods.detail.favorObj.addClass("on");
                }
                
                mgoods.detail.isProcessing = false;
            }else{
                common.loginChk();
            }


        },
        
        logincheck : function(strNo){

            /*var viewMode = mstore.common.viewMode;*/
            if(common.isLogin() == false){

                if(!confirm(_messageLoginCheck)){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }

            return true;

        },
        
        /** 재고보유 현황 버튼 Bind 초기화 * */
        bindButtonInit : function(){
            
            $("#pop-full-wrap").find(".tabList01").addClass("popTabList01");
            $("#pop-full-wrap").find(".tab_contents").addClass("popTabContents");
            
            // 퍼블리싱
            $('#pop-full-wrap').find('#mTab').find('a').on({
                'click' : function(e){

                    e.preventDefault();
                    $(this).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on').removeAttr('title');
                    $('.popTabContents:eq('+ $(this).parent().index() +')').removeClass('hide').siblings('.popTabContents').addClass('hide');
                    $("#offlineMoreNear").hide();
                    $("#offlineMore").hide();
                    
                    // 관심매장 클릭시만 다시 조회
// if ($(this).parent().attr("data-ref-lgcGoodsNo") !=
// $("#pop-full-wrap").find('#stockLayerGoodsOpt option:selected').val()){
                        var url = _baseUrl + "goods/getStockStoreListAjax.do";
                        
                        // 관심매장인지 전체 매장인지 확인
                        if ( $("#pop-full-wrap").find("#mTab li.on").index() == 0 ){
                            mgoods.detail.offstore.page1Already = "N";
                            $(".showNearDiv").hide();
                            $(".no_stores_div").hide();
                            if(localStorage.getItem("useLoc") != "Y"){
                                $(".no_stores_div, .useLocRecom").show();
                                $(".noStoreInfo").hide();
                                $('.map_finding').hide();// 주변 매장을 찾고 있습니다.
                                return;
                            }else{
                                $('.map_finding').show();// 주변 매장을 찾고 있습니다.
                            }
                            
                            mgoods.detail.offstore.nearStoreYn = "Y";
                            var data = {nearStoreYn : mgoods.detail.offstore.nearStoreYn, usrLat : $("#usrLat").val(), usrLng: $("#usrLng").val(), btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                            $('#pop-full-wrap').find("#nearStockList").html("");
                            common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackNearStoreList);
                            
                        }else if ( $("#pop-full-wrap").find("#mTab li.on").index() == 1 ){
                            mgoods.detail.offstore.myStoreYn = "Y";
                            var data = {myStoreYn : mgoods.detail.offstore.myStoreYn, btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                            $('#pop-full-wrap').find("#myStoreStockList").html("");
                            common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackMyStoreList);
                                
                        }else{
                            
                            // 최초 시에는 조회하지 않도록 수정
                            if ( $(this).parent().attr("data-ref-lgcGoodsNo") != undefined && $(this).parent().attr("data-ref-lgcGoodsNo") != ""){
                                mgoods.detail.offstore.nearStoreYn = "N";
                                mgoods.detail.offstore.myStoreYn = "N";
                                var sWords =  $("#pop-full-wrap").find("#searchWords").val();

                                sWords = sWords.trim();
                                
                                if( 0 < sWords.length ){
                                    // 검색어 2글자 이상으로 입력하라는 alert 팝업
                                    if ( sWords.trim().length < 2 ){
                                        
                                        alert("검색어는 2글자 이상 입력해주세요.");
                                        return;
                                    }
                                    
// var data = {myStoreYn : mgoods.detail.offstore.myStoreYn, searchWords :
// sWords, btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                                    var data = {searchWords : sWords, btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                                    $('#pop-full-wrap').find("#searchStockList").html("");
                                    common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackSearchStoreList);        
                                }
                            }
                        }
// }
                    
                    // 탭 클릭 시 안내문구 노출 여부
                    if ( $("#pop-full-wrap").find("#mTab li.on").index() == 0 ){
// if ( mgoods.detail.offstore.loginYn == 'Y'){
// $('#pop-full-wrap').find("#stockInfoTxt").show();
// }else{
// $('#pop-full-wrap').find("#stockInfoTxt").hide();
// }
                    }else if ( $("#pop-full-wrap").find("#mTab li.on").index() == 1 ){
                            if ( mgoods.detail.offstore.loginYn == 'Y'){
                                $('#pop-full-wrap').find("#stockInfoTxt").show();        
                            }else{
                                $('#pop-full-wrap').find("#stockInfoTxt").hide();
                            }
                    }else{
                        $('#pop-full-wrap').find("#stockInfoTxt").show();
                    }
                    
                }
            });

            $('.popTabList0 > li').each(function(){
                if(!$(this).hasClass('on')){
                    $('.popTabContents:eq('+ $(this).index() +')').addClass('hide');
                }
            });
            
            /** 오프라인 재고보유 현황 레이어 옵션 변경시 데이터 조회 * */
            $('#pop-full-wrap').find('#stockLayerGoodsOpt').change(function(){
                // 아이템 번호 세팅
                var optionKey = $(this).val();
                mgoods.detail.offstore.lgcGoodsNo = optionKey;
                
                var url = _baseUrl + "goods/getStockStoreListAjax.do";
                
                if ( $("#pop-full-wrap").find("#mTab").find("li").eq(0).hasClass("on") ){
                    $(".no_stores_div").hide();
                    $(".showNearDiv").hide();
                    $('.map_finding').show();// 주변 매장을 찾고 있습니다.
                    mgoods.detail.offstore.nearStoreYn = "Y";
                    mgoods.detail.offstore.myStoreYn = "N";
                    mgoods.detail.offstore.page1Already = "N";
                }else if ( $("#pop-full-wrap").find("#mTab").find("li").eq(1).hasClass("on") ){
                    mgoods.detail.offstore.nearStoreYn = "N";
                    mgoods.detail.offstore.myStoreYn = "Y";
                }else{
                    mgoods.detail.offstore.nearStoreYn = "N";
                    mgoods.detail.offstore.myStoreYn = "N";
                }
                // alert("=jjj=옵션 변경
                // 호출되었습니다=mgoods.detail.offstore.page1Already="+mgoods.detail.offstore.page1Already);
                
                // 주변매장으로 이동
                if ( $("#pop-full-wrap").find("#mTab").find("li").eq(0).hasClass("on") ){
                    
                    var data = {nearStoreYn : mgoods.detail.offstore.nearStoreYn, usrLat : $("#usrLat").val(), usrLng: $("#usrLng").val(), btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                    $('#pop-full-wrap').find("#nearStockList").html("");
                    common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackNearStoreList);    
                }else if ( $("#pop-full-wrap").find("#mTab").find("li").eq(1).hasClass("on") ){
                    var data = {myStoreYn : mgoods.detail.offstore.myStoreYn, btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                    $('#pop-full-wrap').find("#myStoreStockList").html("");
                    common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackMyStoreList);    
                    $('#pop-full-wrap').find("#strSearch").click();
                }else{
                    var sWords =  $("#pop-full-wrap").find("#searchWords").val();
                    
                    if( 0 < sWords.length ){
                        // 검색어 2글자 이상으로 입력하라는 alert 팝업
                        if ( sWords.trim().length < 2 ){
                            alert("검색어는 2글자 이상 입력해주세요.");
                            return;
                        }
                        
                        var data = {searchWords : sWords, btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
// var data = {myStoreYn : mgoods.detail.offstore.myStoreYn, searchWords :
// sWords, btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                        $('#pop-full-wrap').find("#searchStockList").html("");
                        if ( mgoods.detail.offstore.searchYn == 'N' ){
                            mgoods.detail.offstore.searchYn == 'N'
                            common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackSearchStoreList);    
                        }else{
                            alert("현재 매장 검색 중입니다. 잠시만 기다려주시기 바랍니다.");
                        }
                        
                    }
                    
                }
                
            });
            
            /** 매장 검색 * */
            /*$('#pop-full-wrap').find(".btn_sch").click(function(){
                var sWords =  $("#pop-full-wrap").find("#searchWords").val();
                sWords = sWords.trim();
                sWords = sWords.replace(/\s+/g, '');
                $("#searchWords").val(sWords);
                if( 0 < sWords.length ){
                    // 검색어 2글자 이상으로 입력하라는 alert 팝업
                    if ( sWords.trim().length < 2 ){
                        alert("검색어는 2글자 이상 입력해주세요.");
                        return;
                    }
                    
                    // 매장 검색
                    var url = _baseUrl + "goods/getStockStoreListAjax.do";
                    var data = {searchWords : sWords, btnYn : 'Y', lgcGoodsNo : mgoods.detail.offstore.lgcGoodsNo}
                    
                    if ( mgoods.detail.offstore.searchYn == 'N' ){
                        mgoods.detail.offstore.searchYn == 'Y'
                        common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackSearchStoreList);    
                    }else{
                        alert("현재 매장 검색 중입니다. 잠시만 기다려주시기 바랍니다.");
                    }
                    
                    $("#searchWords").focusout();                  
                }else{
                    alert("검색어는 2글자 이상 입력해주세요.");
                }
            });*/
            
            $('#pop-full-wrap').find("#searchWords").on("keypress", function(e) {
               if (e.keyCode == 13) {
                   $(this).focusout();
                   $(this).blur();  
                   $('#pop-full-wrap').find(".btn_sch").click();
               } 
               return;
            });
        },
        
        // 201912
        /** 재고보유 현황 버튼 Bind 초기화 * */
        bindButtonInit2 : function(){
            // tabList01 클래스 있으면 퍼블이 깨짐.
            /*$("#pop-full-wrap").find(".tabList01").addClass("popTabList01");*/
            $("#pop-full-wrap #mTab").addClass("popTabList01");
            $("#pop-full-wrap").find(".tab_contents").addClass("popTabContents");
            
            // 퍼블리싱
            $('#pop-full-wrap').find('#mTab').find('a').on({
                'click' : function(e){

                    e.preventDefault();
                    
                    $(".reShop_msg").remove();
                    
                    var id = $(this).attr('id');
                    $("#flagSearch").val(id);
                    
                    $("#liNearSearch>a").removeClass("on");
                    $("#liStrSearch>a").removeClass("on");
                    
                    $(this).addClass('on');
                    
                    // tab_contents 클래스 있는 div에 popTabContents 클래스를 넣어줬기 때문에, 영역이라 생각하면 됨.
                    $('.popTabContents:eq('+ $(this).parent().index() +')').removeClass('hide').siblings('.popTabContents').addClass('hide');
                    
                    var url = _baseUrl + "goods/getStockStoreListAjax.do";
                    
                    
                    // 관심매장인지 전체 매장인지 확인
                    if ( $("#pop-full-wrap").find("#mTab").find("li").eq(0).find("a").hasClass("on") ){
                        $("#pop-full-wrap").find(".reShop_search").show();
                        
                        mgoods.detail.offstore.nearStoreYn = "Y";
                        var data = {nearStoreYn : mgoods.detail.offstore.nearStoreYn, usrLat : $("#usrLat").val(), usrLng: $("#usrLng").val(), btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                        $('#pop-full-wrap').find("#nearStockList").html("");
                        common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackNearStoreList2);
                    }else if ( $("#pop-full-wrap").find("#mTab").find("li").eq(1).find("a").hasClass("on") ){
                        $("#pop-full-wrap").find(".reShop_search").hide();
                        
                        mgoods.detail.offstore.myStoreYn = "Y";
                        mgoods.detail.offstore.nearStoreYn = "Y";
                        var data = {nearStoreYn : mgoods.detail.offstore.nearStoreYn, myStoreYn : mgoods.detail.offstore.myStoreYn, usrLat : $("#usrLat").val(), usrLng: $("#usrLng").val(), btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                        $('#pop-full-wrap').find("#myStoreStockList").html("");
                        common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackMyStoreList2);
                            
                    }
                }
            });

            $('.popTabList0 > li').each(function(){
                if(!$(this).hasClass('on')){
                    $('.popTabContents:eq('+ $(this).index() +')').addClass('hide');
                }
            });
            
            /** 오프라인 재고보유 현황 레이어 옵션 변경시 데이터 조회 * */
            $('#pop-full-wrap').find('#stockLayerGoodsOpt').change(function(){
                // 아이템 번호 세팅
                var optionKey = $(this).val();
                mgoods.detail.offstore.lgcGoodsNo = optionKey;
                
                $('#pop-full-wrap').find("#selectLgcGoodsNo").val(optionKey);
                $('#pop-full-wrap').find("#selectItemNo").val($('#pop-full-wrap').find('#stockLayerGoodsOpt option:selected').attr('data-ref-itemno'));
                
                var url = _baseUrl + "goods/getStockStoreListAjax.do";
                
                /*if ( $("#pop-full-wrap").find("#mTab").find("li").eq(0).hasClass("on") ){*/
                if ( $("#pop-full-wrap").find("#mTab").find("a").eq(0).hasClass("on") ){
                    /*$(".no_stores_div").hide();*/
                    /*$(".showNearDiv").hide();*/
                    /*$('.map_finding').show();// 주변 매장을 찾고 있습니다.*/                    
                    mgoods.detail.offstore.nearStoreYn = "Y";
                    mgoods.detail.offstore.myStoreYn = "N";
                    /*mgoods.detail.offstore.page1Already = "N";*/
                /*}else if ( $("#pop-full-wrap").find("#mTab").find("li").eq(1).hasClass("on") ){*/
                }else if ( $("#pop-full-wrap").find("#mTab").find("a").eq(1).hasClass("on") ){
                    /*mgoods.detail.offstore.nearStoreYn = "N";*/
                    mgoods.detail.offstore.nearStoreYn = "Y";
                    mgoods.detail.offstore.myStoreYn = "Y";
                }/*else{
                    mgoods.detail.offstore.nearStoreYn = "N";
                    mgoods.detail.offstore.myStoreYn = "N";
                }*/
                // alert("=jjj=옵션 변경
                // 호출되었습니다=mgoods.detail.offstore.page1Already="+mgoods.detail.offstore.page1Already);
                
                // 주변매장으로 이동
                /*if ( $("#pop-full-wrap").find("#mTab").find("li").eq(0).hasClass("on") ){*/
                if ( $("#pop-full-wrap").find("#mTab").find("a").eq(0).hasClass("on") ){
                    
                    var data = {nearStoreYn : mgoods.detail.offstore.nearStoreYn, usrLat : $("#usrLat").val(), usrLng: $("#usrLng").val(), btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                    $('#pop-full-wrap').find("#nearStockList").html("");
                    common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackNearStoreList);    
                /*}else if ( $("#pop-full-wrap").find("#mTab").find("li").eq(1).hasClass("on") ){*/
                }else if ( $("#pop-full-wrap").find("#mTab").find("a").eq(1).hasClass("on") ){
                    var data = {myStoreYn : mgoods.detail.offstore.myStoreYn, btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                    $('#pop-full-wrap').find("#myStoreStockList").html("");
                    common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackMyStoreList);    
                    $('#pop-full-wrap').find("#strSearch").click();
                }/*else{
                    var sWords =  $("#pop-full-wrap").find("#searchWords").val();
                    
                    if( 0 < sWords.length ){
                        // 검색어 2글자 이상으로 입력하라는 alert 팝업
                        if ( sWords.trim().length < 2 ){
                            alert("검색어는 2글자 이상 입력해주세요.");
                            return;
                        }
                        
                        var data = {searchWords : sWords, btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
// var data = {myStoreYn : mgoods.detail.offstore.myStoreYn, searchWords :
// sWords, btnYn : 'Y', lgcGoodsNo :mgoods.detail.offstore.lgcGoodsNo };
                        $('#pop-full-wrap').find("#searchStockList").html("");
                        if ( mgoods.detail.offstore.searchYn == 'N' ){
                            mgoods.detail.offstore.searchYn == 'N'
                            common.Ajax.sendRequest("POST",url,data,mgoods.detail.offstore._callBackSearchStoreList);    
                        }else{
                            alert("현재 매장 검색 중입니다. 잠시만 기다려주시기 바랍니다.");
                        }
                        
                    }
                    
                }*/
                
            });
            
            /** 매장 검색 >> 가까운 매장 지역 검색할때 써야 함. * */
            $('#pop-full-wrap').find(".btn_sch").click(function(){
                // 가까운 매장 검색 > 지역으로 필터링해야 함.
                mgoods.detail.offlineBurialLink2();
            });
            
            var $mainAreaList = $("#mainAreaList");
            if( common.isEmpty($mainAreaList.attr("data-rgn1")) ){
                $mainAreaList.find("option:eq(0)").prop("selected",true);
            }
            var $subAreaList = $("#subAreaList");
            if( common.isEmpty($subAreaList.attr("data-rgn2")) ){
                $subAreaList.find("option:eq(0)").prop("selected",true);
            }
            
            $('#pop-full-wrap').find("#mainAreaList").change(function() {
                mgoods.detail.offstore.getSubAreaListAjax();
               /* console.log("mainAreaList changed");
                var tempMainAreaList = $("#mainAreaList").val();
                if(tempMainAreaList != "none"){
                    mstore.main.getSearchAreaStoreListAjax();
                }*/
            });
            
            
            $('#pop-full-wrap').find("#subAreaList").change(function(e){
                if ($(this).val() != 'none'){
                    $('#pop-full-wrap').find("#subAreaList").addClass("act");
                }
                else {
                    $('#pop-full-wrap').find("#subAreaList").removeClass("act");
                }
            });
            
        },
        
     // 201912
        getSubAreaListAjax : function() {
            
            var rgn1 = $("#pop-full-wrap #mainAreaList option:selected").val();
            if (rgn1 != 'none'){
                $("#pop-full-wrap").find("#mainAreaList").addClass("act");
                common.Ajax.sendJSONRequest(
                        "POST"
                        , _baseUrl + "store/getStoreSubAreaListJson.do"
                        , "rgn1="+ rgn1
                        , mgoods.detail.offstore._callback_getSubAreaListAjax);
            }else {
                $("#pop-full-wrap").find("#mainAreaList").addClass("act");
                $("#pop-full-wrap #subAreaList").find("option:eq(0)").prop("selected",true);
                $("#pop-full-wrap #subAreaList").find("option:eq(0)").siblings().remove();
            }
            $("#pop-full-wrap").find("#subAreaList").removeClass("act");
            
        },
        
        _callback_getSubAreaListAjax : function(retData) {

            var $subAreaList = $("#pop-full-wrap").find('#subAreaList');
            
            $subAreaList.attr('disabled', false);
            if(retData == ''){
                $subAreaList.attr('disabled', true);
            }
            /*mstore.common.makeSelectboxList($("#subAreaList"),_optionRgn2,retData);*/
            mgoods.detail.offstore.makeSelectboxList($subAreaList,_optionRgn2,retData);
        },
        
        makeSelectboxList :  function(area, title, list){
            var dispArea = area;
            var dispList = list;
            var rgn2Selected = area.attr("data-rgn2");

            var $option = $("<option>");
            $option.val("none").text(title).prop("selected",true);

            dispArea.empty().append($option);

            $.each(dispList, function(index, element){
                $option = $("<option>");
                $option.val(element).text(element);
                $option.val(element).text(element);
                if(!common.isEmpty(rgn2Selected)){
                    if(rgn2Selected == element){
                        $option.prop("selected",true);
                    }
                }

                dispArea.append($option);
            });
        },
        
        /** 재고 보유 전체 검색 조회 JSON * */
        getStoreListPaging : function(pageIdx, moreYn){
            if ( moreYn != undefined && moreYn == 'Y' ){
                mgoods.detail.offstore.btnYn = "N";
            }
            
            if ( $("#dupItemYn").val() == 'Y' ){
                mgoods.detail.offstore.lgcGoodsNo = $("#pop-full-wrap").find('#stockLayerGoodsOpt option:selected').val();
            }
            
            // 코드 완료 후 스토어 정보 조회
            var param = {
// nearStoreYn : "N" ,
// myStoreYn : "N" ,
                    searchWords : $("#pop-full-wrap").find("#searchWords").val(), 
                    pageIdx : mgoods.detail.offstore.offstorePageIdx, // 페이징
                                                                        // 인덱스
                    lgcGoodsNo : mgoods.detail.offstore.lgcGoodsNo
            }
            
            if ( mgoods.detail.offstore.searchYn == 'N' ){
                mgoods.detail.offstore.searchYn = 'Y';
                
                // cjone 점검 체크
                common.Ajax.sendRequest("GET",_baseUrl + "goods/getCjoneAvailableJson.do","",function(data){
                    var res =(typeof data !== 'object') ? $.parseJSON(data) : data;
                    if(res != null && res.result){
                        common.Ajax.sendRequest(
                                "GET"
                                , _baseUrl + "goods/getStockStoreListJsonAjax.do"
                                , param
                                , mgoods.detail.offstore._callBackGetSearchStoreList);
                    }else{
                        mgoods.detail.offstore.searchYn = 'N';
                        alert("죄송합니다. 시스템 점검으로 이용이 불가합니다.");
                    }
                });
            }else{
                alert("현재 매장 검색 중입니다. 잠시만 기다려주시기 바랍니다.");
            }
            
        },
        
        /** 주변매장 조회 JSON * */
        getNearStoreListPaging : function() {
            
            mgoods.detail.offstore.nearStoreYn = 'Y';
            
            if ( $("#dupItemYn").val() == 'Y' ){
                mgoods.detail.offstore.lgcGoodsNo = $("#pop-full-wrap").find('#stockLayerGoodsOpt option:selected').val();
            }
            
            PagingCaller.curPageIdx = 0;
            PagingCaller.destroy();
            
            PagingCaller.init({
                callback : function(){
	                var param = {
	                		pageIdx : PagingCaller.getNextPageIdx(), // 페이징
	                		// 인덱스
	                		nearStoreYn : mgoods.detail.offstore.nearStoreYn,
	                		usrLat : $("#usrLat").val(),
	                		usrLng: $("#usrLng").val(),
	                		lgcGoodsNo : mgoods.detail.offstore.lgcGoodsNo,
	                		rgn1 : $("#pop-full-wrap").find('#mainAreaList option:selected').val(),
	                		rgn2 : $("#pop-full-wrap").find("#subAreaList option:selected").val()
	                		
	                		
	                };
	                
	                _ajax.sendRequest("POST"
	                		, _ajaxUrl + "goods/getStockStoreListJsonAjax.do"
	                		, param
	                		, mgoods.detail.offstore._callBackGetNearStoreList
	                );
                }
            ,startPageIdx : 0
            ,subBottomScroll : 700
            ,initCall : PagingCaller.curPageIdx == 0 ? true : false
            });
            
            mgoods.detail.offstore.page1Already = "Y";
            
        },
        
        /** 주변매장 조회 JSON 콜백 * */
        _callBackGetNearStoreList : function(res){
            
            mgoods.detail.offstore.searchYn = 'N';
            
            $("#temp_nearStoreList").html(res);
            var length = $("#temp_nearStoreList").find("li").length;
            
            $("#nearStockNoEmpty").hide();
            $(".reShop_msg").remove();
            
            if(length > 0){
                $(".showNearDiv").show();
                if(PagingCaller.getCurPageIdx() == 1){
                	$("#nearStoreList").html(res);
                } else {
                	$("#nearStoreList").append(res);
                }
                $(".tab_reShop").append($("<p class='reShop_msg'>").text("실제 수량과 다를 수 있어 정확한 재고는 매장으로 확인해 주세요."));
                
                if(mgoods.detail.offstore.geoFlag == 'N'){
                    $(".reShop_way").remove();
                }
            }else{
                if(PagingCaller.getCurPageIdx() == 1){
                    $("#nearStockNoEmpty").show(); 
                }
                
                PagingCaller.destroy();
            }
            
            $("#temp_nearStoreList").html("");
        },
        
        /** 관심매장 조회 JSON * */
        getMyStoreList : function() {
            
            mgoods.detail.offstore.myStoreYn = 'Y';
            
            if ( $("#dupItemYn").val() == 'Y' ){
                mgoods.detail.offstore.lgcGoodsNo = $("#pop-full-wrap").find('#stockLayerGoodsOpt option:selected').val();
            }
            
            var param = {
                    pageIdx : 1,
                    nearStoreYn : mgoods.detail.offstore.nearStoreYn,
                    myStoreYn : mgoods.detail.offstore.myStoreYn,
                    lgcGoodsNo : mgoods.detail.offstore.lgcGoodsNo,
                    usrLat : $("#usrLat").val(),
                    usrLng: $("#usrLng").val(),
                    /*memberYn : 'Y'*/
            };
            
            _ajax.sendRequest("POST"
                    /*, _ajaxUrl + "goods/getStockStoreListJsonAjax.do"*/
                    , _ajaxUrl + "goods/getStockFavorStoreListJsonAjax.do"
                    , param
                    , mgoods.detail.offstore._callBackGetMyStoreList
            );
        },
        
        /** 관심매장 조회 JSON 콜백 * */
        _callBackGetMyStoreList : function(res){
            
            if ($.trim(res).length == 0) {
                if($("#myStoreList").find("li").length==0){
                    $("#myStoreList").hide();
                }
                return;
            }else{
                if ( mgoods.detail.offstore.btnYn == 'Y'){
                    $("#pop-full-wrap").find("#myStoreList").html("");
                }
                
                $(".reShop_msg").remove();
                $("#myStoreList").show();
                $("#myStoreList").append(res);
                
                if($(".no_list", $("#myStoreList")).length == 0 && $(".no_login", $("#myStoreList")).length == 0) {
                	$(".tab_reShop").append($("<p class='reShop_msg'>").text("실제 수량과 다를 수 있어 정확한 재고는 매장으로 확인해 주세요."));
                }
                
                if(mgoods.detail.offstore.geoFlag == 'N'){
                    $(".reShop_way").remove();
                }
                
                return;
            }
        },
        
        /** 매장 검색 JSON 콜백 * */
        _callBackGetSearchStoreList : function(res){
            
            mgoods.detail.offstore.searchYn = 'N';
            
            if ($.trim(res).length == 0) {
                if($("#pop-full-wrap").find("#searchStoreList").find("li").length==0){
                    $("#searchStockNoEmpty").show();
                    $("#searchStoreList").hide();
                }
                $("#pop-full-wrap").find("#offlineMore").hide();
                return;
            }else{
                if ( mgoods.detail.offstore.btnYn == 'Y'){
                    $("#pop-full-wrap").find("#searchStoreList").html("");
                }
                $("#searchStockNoEmpty").hide();
                $("#searchStoreList").append(res);
                $("#searchStoreList").show();
                $("#pop-full-wrap").find("#offlineMore").show();
                
                mgoods.detail.offstore.offstorePageIdx = mgoods.detail.offstore.offstorePageIdx + 1;
                
                if (mgoods.detail.offstore.stockCnt==$("#pop-full-wrap").find("#searchStoreList").find("li").length) {
                    $("#pop-full-wrap").find("#offlineMore").hide();
                }
                return;
            }
        },
        
        /** 주변매장 조회 콜백 * */
        _callBackNearStoreList : function(data){
            $("#pop-full-wrap").find("#nearStockList").html("");
            $("#pop-full-wrap").find("#nearStockList").html(data);
        },
        
        // 201912
        /** 주변매장 조회 콜백 * */
        _callBackNearStoreList2 : function(data){
            $("#pop-full-wrap").find("#nearStockList").html("");
            $("#pop-full-wrap").find("#nearStockList").html(data);
        },
        
        /** 매장검색 콜백 * */
        _callBackSearchStoreList : function(data){
            $("#pop-full-wrap").find("#searchStockList").html("");
            $("#pop-full-wrap").find("#searchStockList").html(data);
        },
        
        // 201912
        /** 매장검색 콜백 * */
        _callBackSearchStoreList2 : function(data){
            $("#pop-full-wrap").find("#searchStockList").html("");
            $("#pop-full-wrap").find("#searchStockList").html(data);
        },
        
        /** 관심매장 조회 콜백 * */
        _callBackMyStoreList : function(data){
            $("#pop-full-wrap").find("#myStoreStockList").html("");
            $("#pop-full-wrap").find("#myStoreStockList").html(data);
        },
        
        // 201912
        /** 관심매장 조회 콜백 * */
        _callBackMyStoreList2 : function(data){
            $("#pop-full-wrap").find("#myStoreStockList").html("");
            $("#pop-full-wrap").find("#myStoreStockList").html(data);
        },
        
     // 20.01.22 :: 구매 가능 매장 확인에서 매장 위치 지도에서 확인하기 
        storeMapInit : function(lat, lng, strNo, obj) {
            try {
                if (obj.hasClass("on")) {
                    $("#"+strNo + "map").parent().hide();
                }
                else {
                    if($("#"+strNo + "map").hasClass("load")) {
                        $(".mapOp").removeClass("on");
                        $(".store_wayP").parent().hide();
                        $("#"+strNo + "map").parent().show();
                    }
                    else {
                        if(!common.isEmpty(lat) && !common.isEmpty(lng)) {
                            $(".mapOp").removeClass("on");
                            $(".store_wayP").parent().hide();
                            $("#"+strNo + "map").parent().show();
                            var mapContainer = document.getElementById(strNo+'map') // 지도 영역
                            var mapOption = {
                                center: new daum.maps.LatLng(lat, lng), // 지도 중심좌표(위도,경도)
                                level: 2 // 지도 확대 레벨
                            };
                            var map = new daum.maps.Map(mapContainer, mapOption); // 지도 생성
                            var markerImage = new daum.maps.MarkerImage(_imgUrl + 'comm/point_way.png' , new daum.maps.Size(28, 42)); // 마커 이미지 생성
                            
                            var markerPosition = new daum.maps.LatLng(lat, lng); // 마커 위치
                            var marker = new daum.maps.Marker({
                                map: map, // 마커를 표시할 지도
                                position: markerPosition,
                                image : markerImage // 마커 이미지
                            }); // 마커 생성
                            marker.setMap(map); // 마커 표시
                            $("#"+strNo + "map").addClass("load");
                        }
                    }
                }
                obj.toggleClass("on");
            }
            catch(e) {
                console.log(e);
                $(".mapOp").removeClass("on");
                $(".store_wayP").parent().hide();
            }
        },
        
        favoriteStoreMapInit : function(lat, lng, strNo, obj) {
            try {
                if (obj.hasClass("on")) {
                    $("#"+strNo + "map_fav").parent().hide();
                }
                else {
                    if($("#"+strNo + "map_fav").hasClass("load")) {
                        $(".mapOp").removeClass("on");
                        $(".store_wayP").parent().hide();
                        $("#"+strNo + "map_fav").parent().show();
                    }
                    else {
                        $(".mapOp").removeClass("on");
                        $(".store_wayP").parent().hide();
                        $("#"+strNo + "map_fav").parent().show();
                        if(!common.isEmpty(lat) && !common.isEmpty(lng)){
                            var mapContainer = document.getElementById(strNo+'map_fav') // 지도 영역
                            var mapOption = {
                                center: new daum.maps.LatLng(lat, lng), // 지도 중심좌표(위도,경도)
                                level: 2 // 지도 확대 레벨
                            };
                            var map = new daum.maps.Map(mapContainer, mapOption); // 지도 생성
                            var markerImage = new daum.maps.MarkerImage(_imgUrl + 'comm/point_way.png' , new daum.maps.Size(28, 42)); // 마커 이미지 생성
                            
                            var markerPosition = new daum.maps.LatLng(lat, lng); // 마커 위치
                            var marker = new daum.maps.Marker({
                                map: map, // 마커를 표시할 지도
                                position: markerPosition,
                                image : markerImage // 마커 이미지
                            }); // 마커 생성
                            marker.setMap(map); // 마커 표시
                            $("#"+strNo + "map_fav").addClass("load");
                        }
                    }
                }
                obj.toggleClass("on");
            }
            catch(e) {
                console.log(e);
                $(".mapOp").removeClass("on");
                $(".store_wayP").parent().hide();
            }
        },
        
        //[3354738] 오늘드림 매장 취급여부 조회 | 2020.09.16 | by jp1020
        getAvailableStore : function(strNo, lgcGoodsNo) {
        	var rst = true;
        	var params = {
        			strNo       : strNo
                  , lgcGoodsNo	: lgcGoodsNo
            }
        	
        	_ajax.sendRequest('POST'
        			, _baseUrl + 'goods/getAvailableStoreJsonAjax.do'
                    , params
                    , function(res){
        				
        				if(!res.succeeded){
        					rst = false; // I/F 실패일 경우 미취급으로  판단
                        } else {
                        	var data = (typeof res.data !== 'object') ? $.parseJSON(res.data) : res.data;
                        	console.log("isAvailableStore Ajax Response : " + JSON.stringify(data)); 
                        	//console.log("isAvailableStore Ajax Response invCd : " + data[0].invCd); 
                        	
                        	//미취급
                        	$.each(data, function(i, e){
                        		if(data[i].invCd == '03'){
                        			rst = false;
                            		return false;	
                        		}
                        	});
                        }
                        
                    }
                    , false
        	);
        	return rst;
        }

}

/** 장바구니 * */
$.namespace("mgoods.detail.cart");
mgoods.detail.cart = {
        
        /** 장바구니 페이지 초기화 * */
        init : function(){
            
            var ordPsbMinQty =$("#ordPsbMinQty").val();
            var qtyAddUnit = $("#qtyAddUnit").val();
            
            // 기본적으로 구매단위로 세팅
// var initCartCnt = qtyAddUnit;
            
            // 기본적으로 최소구매단위로 세팅
            var initCartCnt = ordPsbMinQty;
            
            $("#totalCnt").val("");
            
            // 옵션 상품일 경우
            if ( $("#dupItemYn").val() == 'Y' ){
                // 최초 다른 옵션 선택 시 ( 옵션 상품일 경우에는 0으로 세팅)
                initCartCnt = 0;    
            }else{
                // 단일 상품일 경우 초기화 최소주문수량 개수 세팅
                // 최소주문 수량이 구매증가단위보다 클 경우 최소주문 수량으로 세팅
// if ( Number(ordPsbMinQty) > Number(qtyAddUnit) ){
// initCartCnt = ordPsbMinQty;
// }
                cartCnt = initCartCnt;
                var goodsNo = $("#goodsNo").val();
                var itemNo = $("#itemNo").val();
                $("#cartCnt_"+goodsNo+itemNo).val(cartCnt);
            }
            
            // 전체 개수, 전체 총합 계산
            $("#totalCnt").text(initCartCnt);
            var totalPrc = salePrc * Number(initCartCnt);
            $("#totalPrcTxt").text($.number(totalPrc));
            $("#totalPrc").val(totalPrc);
        },
        
        /** 옵션 선택 함수 * */
        selectItem : function(itemNo, itemNm, selectGoodsNo, promCond, promKndCd, buyCnt, itemPrsntYn, promNo, invQty, itemSoldOutYn, itemSalePrc, qtyAddUnit, ordPsbMinQty, ordPsbMaxQty, getItemAutoAddYn, getItemGoodsNo, getItemItemNo, getItemGoodsNm, getItemItemNm, getItemStockQty, lgcGoodsNo, getQuickYn, dispStrtDtime, dispEndDtime){
            
            // 화면에 노출되어 있는 옵션 하위상품 개수
            var goodsSize = $(".prd_cnt_box").length;
            // 선택된 옵션 하위상품 아이템 번호
            var selectVal = itemNo;
            // 선택된 옵션 하위상품의 상품번호
            var sGoodsNo = selectGoodsNo;
            // 키값
            var optionKey = sGoodsNo + itemNo;
            // 선택된 옵션 하위상품명
            var selectText = itemNm;
            // 현재 화면에 옵션 하위상품이 존재하는지에 대한 여부
            var existOptYn = 'N';
            // 현재 화면에 같은 프로모션이 존재하는지에 대한 여부
            var existPromYn = 'N';
            // 현재 화면에 같은 프로모션이 존재할 경우 해당 키값
            var promOptionKey;
            // 현재 화면에 같은 프로모션이 존재할 경우 기 선택된 옵션상품들의 수량
            var promItemCnt = 0;
            // 옵션상품 HTML
            var optGoodsHtml = '';
            // 옵션상품의 행사안내 HTML
            var promotionHtml = '';
            // 상품구매단위 안내 HTML
            var caseCntBoxHtml = '';
            var pkgGoodsYn = $("#pkgGoodsYn").val();    // 패키지 여부
            var giftItemNm = (getItemGoodsNm + " " + getItemItemNm).trim();
            
            // 선택한 상품이 품절이면 선택 금지
            if ( itemSoldOutYn == 'Y' ){
                return;
            }
            
            // 화면에 노출되어 있는 옵션 하위상품이 존재할 경우
            if ( goodsSize > 0 ){
                // 화면에 노출되어 있는 하위상품들과 현재 선택한 상품이 있는지 체크하는 로직
                // 존재하면 existOptYn 값 Y로 세팅
                var classNm = "item_" + optionKey;
                
                if ( $(".prd_cnt_box").hasClass(classNm) )
                    existOptYn = "Y";
                
                $(".event_info").each(function(){
                    var curPromCheck = $(this).attr("promNo");
                    
                    if(curPromCheck == promNo){
                        existPromYn = "Y";
                        promOptionKey = $(this).attr("goodsNo") + $(this).attr("itemNo");
                    }
                });
                
                if(promOptionKey != ""){
                    //  선택한 옵션상품의 get상품 정보를 상품을 선택할때마다 초기화시킴
                    // [START 오늘드림 옵션상품 개선:jwkim]
                    $(".event_info.item_"+promOptionKey).attr("getitemautoaddyn", getItemAutoAddYn);
                    $(".event_info.item_"+promOptionKey).attr("getitemgoodsno", getItemGoodsNo);
                    $(".event_info.item_"+promOptionKey).attr("getitemitemno", getItemItemNo);
                    $(".event_info.item_"+promOptionKey).attr("getitemgoodsnm", getItemGoodsNm);
                    $(".event_info.item_"+promOptionKey).attr("getitemitemnm", getItemItemNm);
                    $(".event_info.item_"+promOptionKey).attr("getitemstockqty", getItemStockQty);
                    // [END 오늘드림 옵션상품 개선:jwkim]
                    
                    $(".prd_cnt_box.item_" + promOptionKey + " input#cartCnt_" + promOptionKey).each(function(){
                        promItemCnt += parseInt( $(this).val() );
                    });
                }
            }
            
            // 옵션 하위상품이 화면에 노출되었을 경우
            if ( existOptYn == 'Y' ){
                // 클릭 시 개수 증가
                var cartCnt = $("#cartCnt_" + optionKey).val();
                $("#cartCnt_" + optionKey).val(Number(cartCnt) + Number(qtyAddUnit));
                
                // buyCnt 증가, 프로모션 혜택 문구 변경
                mgoods.detail.cart.changeMsg(promOptionKey, promNo);
            }else{
                // 옵션 하위상품이 화면에 노출되지 않았을 경우
                
                // 최소 구매수량으로 초기값 세팅으로 바뀜
                var initCartCnt = parseInt( ordPsbMinQty );
                
                // 옵션 하위상품 구매수량 제한 케이스 추가( 'div.cont_area 전에 위치')
                if ( qtyAddUnit > 1 || ordPsbMinQty > 1 ) {
                    caseCntBoxHtml = '         <div class="case_cnt_box">';
                    if ( qtyAddUnit > 1 ) {
                        caseCntBoxHtml += '             <p class="case"><span>해당 상품은 <strong>' + qtyAddUnit + '</strong>개 단위로 구매가 가능한 상품입니다.</span></p>';
                    }
                    
                    if ( ordPsbMinQty > 1 ) {
                        caseCntBoxHtml += '             <p class="case"><span>해당 상품은 <strong>' + ordPsbMinQty + '</strong>개 이상 부터 구매가 가능한 상품입니다.</span></p>';
                    }
                    caseCntBoxHtml += '         </div>';
                }
                
                // 옵션상품 HTML
                optGoodsHtml = '<div class="prd_item_box item_' + optionKey + ' ' + (promNo == "" ? "no_prom" : "") + '" promNo="' + promNo + '">' +
                        '<p class="item"><span class="optItemNm">' + selectText+"</span>";
                        // [START 오늘드림 옵션상품 개선:jwkim 오늘드림 옵션상품인 경우 딱지추가]
                        if(getQuickYn == "Y"){
                            optGoodsHtml += '         <span class="icon"><span class="icon_flag delivery">오늘드림</span></span>';
                        }
                        // [END 오늘드림 옵션상품 개선:jwkim]
                        optGoodsHtml += '<a href="javascript:mgoods.detail.cart.deleteItem(\'' + optionKey + '\',\'' + itemSalePrc + '\');" class="btn_del">삭제</a></p>' +
                        '<div class="prd_cnt_box item_' + optionKey + '" promNo="' + promNo + '" promKndCd="' + promKndCd + '" goodsNo="' + sGoodsNo + '" itemNo="' + selectVal + '" buyCondStrtQtyAmt="' + buyCnt + '">' +
                        '       <input type="hidden" id="itemInv_' + optionKey + '" value="' + invQty + '" />' +
                        '       <input type="hidden" id="itemQty_' + optionKey + '" value="' + qtyAddUnit + '" />' +
                        '       <input type="hidden" id="itemMinQty_' + optionKey + '" value="' + ordPsbMinQty + '" />' +
                        '       <input type="hidden" id="itemMaxQty_' + optionKey + '" value="' + ordPsbMaxQty + '" />' +
                        '       <input type="hidden" name="itemNo" value="' + selectVal + '" />' +
                        '       <input type="hidden" name="sGoodsNo" value="' + sGoodsNo + '" />' +
                        '       <input type="hidden" name="itemPrsntYn" value="' + itemPrsntYn + '" />' +
                        '       <input type="hidden" id="itemLgcGoodsNo_' + lgcGoodsNo + '" name="itemLgcGoodsNo" value="' + lgcGoodsNo + '" />'+
                        '       <input type="hidden" id="quickYn_' + optionKey + '" value="' + getQuickYn + '" />'+
                        '       <input type="hidden" id="itemSalePrc_' + optionKey + '" value="' + itemSalePrc + '" />'+ // 오늘드림 제어를위해 사용
                        '<p class="item_number">' +
                        '<a href="javascript:mgoods.detail.cart.prevVal(\'' + optionKey + '\',\'' + itemSalePrc + '\',\'' + qtyAddUnit + '\');" class="minus">수량감소</a>' +
                        '<input type="tel" id="cartCnt_' + optionKey + '" class="num" title="상품수량" value="' + initCartCnt + '">' +
                        '<a href="javascript:mgoods.detail.cart.nextVal(\'' + optionKey + '\',\'' + itemSalePrc + '\',\'' + qtyAddUnit + '\');" class="plus">수량증가</a>' +
                        '</p>'+
                        '<p class="price">'+ $.number(itemSalePrc) + '<span>원</span></p>'+
                        '</div></div>';
                
                // 행사안내 팝업 HTML
                if ( existPromYn != 'Y' ){
                    if ( promKndCd =='P201' ){      // 동일

                        promotionHtml = '<div class="event_info event_info2 item_' + optionKey + '" promNo="' + promNo + '" promKndCd="' + promKndCd + '" goodsNo="' + sGoodsNo + '" itemNo="' + selectVal + '" buyCondStrtQtyAmt="' + buyCnt + '" getItemAutoAddYn="' + getItemAutoAddYn + '" getItemGoodsNo="' + getItemGoodsNo + '" getItemItemNo="' + getItemItemNo + '" getItemGoodsNm="' + getItemGoodsNm + '" getItemItemNm="' + getItemItemNm + '" getItemStockQty="' + getItemStockQty + '" getOriItemAutoAddYn="' + getItemAutoAddYn + '">';
                        if(buyCnt <= ordPsbMinQty){
                            promotionHtml += '       <div class="txt"><strong><span>' + promCond + '적용</span>되어 구매됩니다.<h5 name="period" style="display:inline; font-weight:100">('+ dispStrtDtime + '~' + dispEndDtime +')</h5></strong>';
                            promotionHtml += '       <p>' + itemNm + '</span> <span class="break">총 <em class="bold">' + (initCartCnt + parseInt(initCartCnt / buyCnt) ) + '개</em>가 배송됩니다.</p>';
                            promotionHtml += '       </div>';
                        } else {
                            promotionHtml += '       <div class="txt"><strong><span>' + promCond + ' 행사</span> 상품입니다.<h5 name="period" style="display:inline; font-weight:100">('+ dispStrtDtime + '~' + dispEndDtime +')</h5></strong>';
                            promotionHtml += '       <p><span class="name">' + (buyCnt - ordPsbMinQty) + '개</span> 더 구매하시면<span class="name"> ' + buyCnt + '+1 혜택</span>을 받으실 수 있어요</p>';
                            promotionHtml += '       </div>';
                            promotionHtml += '       <button type="button" class="btnGrayW28" onClick=javascript:common.openEvtInfoPop("' + promNo  + '","' + promKndCd + '","' + promCond + '","' + sGoodsNo + '","' + selectVal + '");>자세히 보기</button>';       
                        }
                        
                        promotionHtml += '   </div>';

                    }else if ( promKndCd =='P202' ) {       // 교차

                        promotionHtml = '<div class="event_info event_info2 item_' + optionKey + ' goods_nplus1" promNo="' + promNo + '" promKndCd="' + promKndCd + '" goodsNo="' + sGoodsNo + '" itemNo="' + selectVal + '" buyCondStrtQtyAmt="' + buyCnt + '" getItemAutoAddYn="' + getItemAutoAddYn + '" getItemGoodsNo="' + getItemGoodsNo + '" getItemItemNo="' + getItemItemNo + '" getItemGoodsNm="' + getItemGoodsNm + '" getItemItemNm="' + getItemItemNm + '" getItemStockQty="' + getItemStockQty + '" getOriItemAutoAddYn="' + getItemAutoAddYn + '">';
                        if(buyCnt <= ordPsbMinQty){
                            promotionHtml += '       <div class="txt"><strong><span>' + promCond + '적용</span>되어 구매됩니다.<h5 name="period" style="display:inline; font-weight:100">('+ dispStrtDtime + '~' + dispEndDtime +')</h5></strong>';
                            promotionHtml += '       <p><span class="name">' + buyCnt + '+1 상품</span>을 선택해주세요.</p></div>';
                            promotionHtml += '       <button type="button" class="btnOrangeH28" onClick=javascript:common.popLayer.promGift.openPromGiftPop("' + sGoodsNo  + '","' + selectVal + '","' + promNo + '");>선택</button>';
                        } else {
                            promotionHtml += '       <div class="txt"><strong><span>' + promCond + ' 행사</span> 상품입니다.<h5 name="period" style="display:inline; font-weight:100">('+ dispStrtDtime + '~' + dispEndDtime +')</h5></strong>';
                            promotionHtml += '       <p><span class="name">' + (buyCnt - initCartCnt) + '개</span> 더 구매하시면 <span class="name">' + buyCnt + '+1 혜택</span>을 받으실 수 있어요.</p></div>';
                            promotionHtml += '       <button type="button" class="btnGrayW28" onClick=javascript:common.openEvtInfoPop("' + promNo  + '","' + promKndCd + '","' + promCond + '","' + sGoodsNo + '","' + selectVal + '");>자세히 보기</button>';
                        }
                        promotionHtml += '   </div>';
                        
                    }else if ( promKndCd =='P203' ) {       // A+B

                        promotionHtml       = '<div class="event_info event_info2 item_' + optionKey + '" promNo="' + promNo + '" promKndCd="' + promKndCd + '" goodsNo="' + sGoodsNo + '" itemNo="' + selectVal + '" buyCondStrtQtyAmt="' + buyCnt + '" getItemAutoAddYn="' + getItemAutoAddYn + '" getItemGoodsNo="' + getItemGoodsNo + '" getItemItemNo="' + getItemItemNo +'" getItemGoodsNm="' + getItemGoodsNm + '" getItemItemNm="' + getItemItemNm + '" getItemStockQty="' + getItemStockQty+ '" getOriItemAutoAddYn="' + getItemAutoAddYn + '">';
                        if(getItemAutoAddYn == "Y"){
                            promotionHtml += '       <div class="txt"><strong><span>GIFT 행사적용</span>되어 구매됩니다.<h5 name="period" style="display:inline; font-weight:100">('+ dispStrtDtime + '~' + dispEndDtime +')</h5></strong>';
                            promotionHtml += '       <p><span class="name">' + giftItemNm + '</span> <span class="break">' + initCartCnt + '개</span>가 함께 배송됩니다.</span></p></div>';
                            promotionHtml += '       <button type="button" class="btnGrayW28" onClick=javascript:common.openEvtInfoPop("' + promNo  + '","' + promKndCd + '","' + promCond + '","' + sGoodsNo + '","' + selectVal + '");>자세히 보기</button>';
                        } else {
                            promotionHtml += '       <div class="txt"><strong><span>GIFT 행사</span> 상품입니다.<h5 name="period" style="display:inline; font-weight:100">('+ dispStrtDtime + '~' + dispEndDtime +')</h5></strong>';
                            promotionHtml += '       <p><span class="name">GIFT 상품</span>을 선택해주세요.</p></div>';
                            promotionHtml += '       <button type="button" class="btnOrangeH28" onClick=javascript:common.popLayer.promGift.openPromGiftPop("' + sGoodsNo  + '","' + selectVal + '","' + promNo + '");>선택</button>';
                        }
                        promotionHtml += '   </div>';
                        
                    }
                }
                
                // HTML APPEND
                if($(".prd_item_box_wrap .prd_item_box").length > 0){       // 선택된 옵션이 있으면
                    if(promNo != ""){                                               // 프로모션이 있으면
                        if($(".prd_item_box_wrap .prd_item_box[promNo=" + promNo + "]").length > 0){       // 해당 프로모션이 이미 존재하면
                            $(".prd_item_box_wrap .prd_item_box[promNo=" + promNo + "]:first").before(optGoodsHtml + promotionHtml);
                        } else {                                                    // 해당 프로모션이 없으면
                            if($(".prd_item_box_wrap .prd_item_box.no_prom").length > 0){           // 프로모션 없는 옵션이 이미 있으면
                                $(".prd_item_box_wrap .prd_item_box.no_prom:last").after(optGoodsHtml + caseCntBoxHtml + promotionHtml);
                            } else {                                                                // 프로모션 없는 옵션이 없으면
                                $(".prd_item_box_wrap").prepend(optGoodsHtml + caseCntBoxHtml + promotionHtml);
                            }
                        }
                    } else {                                                        // 프로모션이 없으면
                        $(".prd_item_box_wrap").prepend(optGoodsHtml + caseCntBoxHtml + promotionHtml);
                    }
                } else {                                                            // 선택된 옵션이 없으면
                    $(".prd_item_box_wrap").prepend(optGoodsHtml + caseCntBoxHtml + promotionHtml);
                }
                
                // prd_item_box를 싸고 있는 wrap이 display:none일 경우에만 show
                if ( $(".prd_item_box_wrap").css("display") == 'none'){
                    $(".prd_item_box_wrap").show();    
                }                
                
                // 수량 조정 바인드
                mgoods.detail.cart.cartCntBind(optionKey, qtyAddUnit, invQty, itemSalePrc);
                
                if ( existPromYn == 'Y' ){
                    // buyCnt 증가, 프로모션 혜택 문구 변경
                    mgoods.detail.cart.changeMsg(promOptionKey);
                }
                
                setTimeout(function() {
                    // 웹로그 바인딩
                    mgoods.detail.cart.bindWebLog();
                },100);
            }
            
            // 옵션 닫기
            $(".select_opt").click();
            
            // 총합, 총개수 계산
            var cartCnt = $("#cartCnt_" + optionKey).val();
            var totalCnt = $("#totalCnt").text();
            
            // 초기 옵션 선택시 ( 총합이 0이었을 경우 ) 총합 계산
            if ( totalCnt == "0" || totalCnt == "" ){
                $("#totalCnt").text(cartCnt);
                var totalPrc = Number(itemSalePrc) * Number(cartCnt);
                $("#totalPrcTxt").text($.number(totalPrc));
                $("#totalPrc").val(totalPrc);
            }else{
                if( existOptYn == 'Y' ){
                    // 장바구니 구매수량(수량 1개 증가된)
                    var curCartCnt = Number($("#cartCnt_" + optionKey).val());
                    
                    // 장바구니 구매수량 관련 Validation
                    var check = mgoods.detail.cart.cartCheck(curCartCnt, optionKey);
                    
                    // 정상적으로 체크가 되었을 경우
                    if ( check == 'Y'){
                        // 초기 옵션 선택 후 다른 옵션 선택 시 ( ex) A옵션 선택후 바로 B옵션 선택 ) 총합 계산
                        totalCnt = Number(totalCnt) + Number(qtyAddUnit);
                        $("#totalCnt").text(totalCnt);
                    
                        var totalPrc = Number($("#totalPrc").val()) + (Number(itemSalePrc) * Number(qtyAddUnit));
                        $("#totalPrcTxt").text($.number(totalPrc));    
                        $("#totalPrc").val(totalPrc);
                    } else {
                        // 추가된 수량 만큼 차감 처리
                        $("#cartCnt_" + optionKey).val(Number(curCartCnt) - Number(qtyAddUnit));
                        mgoods.detail.cart.changeMsg(promOptionKey);
                        return;
                    } 
                }else{
                    // 초기 옵션 선택 후 다른 옵션 선택 시 ( ex) A옵션 선택후 바로 B옵션 선택 ) 총합 계산
                    totalCnt = Number(totalCnt) + Number(cartCnt);
                    $("#totalCnt").text(totalCnt);
                
                    var totalPrc = Number($("#totalPrc").val()) + (Number(itemSalePrc) * Number(cartCnt));
                    $("#totalPrcTxt").text($.number(totalPrc));    
                    $("#totalPrc").val(totalPrc);
                }
            }
            
            mgoods.detail.todayDelivery.deliveryCharge();
            
        },
        
        /** 선택 옵션 삭제 * */
        deleteItem : function(optionKey, itemSalePrc){
            var totalPrc = Number($("#totalPrc").val());
            var totalCnt = Number($("#totalCnt").text());
            
            var deleteItemCnt = $("#cartCnt_"+optionKey).val();
            totalCnt = Number(totalCnt) - Number(deleteItemCnt);
            
            // 뺀 가격 계산
            var deletePrc = Number(itemSalePrc) * Number(deleteItemCnt);
            totalPrc = Number(totalPrc) - Number(deletePrc);
            
            $("#totalCnt").text(totalCnt);
            $("#totalPrcTxt").text($.number(totalPrc));
            $("#totalPrc").val(Number(totalPrc));
            
            mgoods.detail.todayDelivery.deliveryCharge();
            
            var selObj = $("div.prd_item_box.item_" + optionKey);
            var promNo = selObj.attr("promNo");
            
            if($("div.prd_item_box[promNo="+promNo + "]").length == 1)
                $("div.event_info[promNo="+promNo + "]").remove();

            // 옵션 삭제 시 기프트 행사 item 재매핑 처리
            // $("div.event_info").removeClass("item_"+optionKey);
            $("div.event_info").addClass($("div.prd_item_box").attr('class').substring($("div.prd_item_box").attr('class').indexOf(' item_')+22,$("div.prd_item_box").attr('class').indexOf(' item_')));
            
            selObj.remove();
            
            if ( $(".prd_item_box_wrap").find(".prd_cnt_box").length == 0 ){
                $(".prd_item_box_wrap").hide();
            } else {
                mgoods.detail.cart.changeMsg(optionKey, promNo);
            }
        },
        
        /** 수량 증가 함수 * */
        nextVal : function(optionKey, itemSalePrc, qtyAddUnit){
            
            // [START 오늘드림 옵션상품 개선:jwkim]
            var promKnCd = $(".event_info.item_"+optionKey).attr("promkndcd"); 
            var getItemAutoAddYn = $(".event_info.item_"+optionKey).attr("getitemautoaddyn"); 
            
            // 증정 상품의 경우 레이어에서 상품 선택시 오토를 N으로 하기 때문에 수량변경시 Y로 바꿔줘야 
            // 기존로직그대로 탄다
            if(promKnCd == "P203" && getItemAutoAddYn == "N"){
                var oriItemAutoAddYn = $(".event_info.item_"+optionKey).attr("getoriitemautoaddyn");
                
                $(".event_info.item_"+optionKey).attr("getitemautoaddyn", oriItemAutoAddYn);
            }
            // [END 오늘드림 옵션상품 개선:jwkim]
            
            // 장바구니 구매수량
            var cartCnt = Number($("#cartCnt_" + optionKey).val());
            
            // 구매 개수 적용
            cartCnt = cartCnt + Number(qtyAddUnit);
            
            // 장바구니 구매수량 관련 Validation
            var check = mgoods.detail.cart.cartCheck(cartCnt, optionKey);
            
            // 정상적으로 체크가 되었을 경우
            if ( check == 'Y'){
                
                // 증가된 값 세팅
                $("#cartCnt_" + optionKey).val(cartCnt);
                
                // 화면에 노출된 옵션 하위상품의 개수가 1개 이상일 경우
                // 여러개중에 선택한 값만 증가되고, 총 개수만 증가됨
                var totalCnt = Number($("#totalCnt").text()) + Number(qtyAddUnit);
                
                var totalPrc = Number($("#totalPrc").val()) + (Number(itemSalePrc) * Number(qtyAddUnit));

                $("#totalPrc").val(totalPrc);
                
                $("#totalCnt").text(totalCnt);
                $("#totalPrcTxt").text($.number(totalPrc));
                
                mgoods.detail.todayDelivery.deliveryCharge();
                
                // 선택된 프로모션 상품이 없는경우특정 프로모션 상품 개수 증가X
                // [START 오늘드림 옵션상품 개선:jwkim]
                if($("div.event_info.item_" + optionKey).hasClass("giftInit")){
                
                } else {
                    
                    // N+1 프로모션 안내 멘트 추가
                    mgoods.detail.cart.changeMsg(optionKey);
                }
                // mgoods.detail.cart.changeMsg(optionKey); // as-is 로직
                // [END 오늘드림 옵션상품 개선:jwkim]
                
            }else{
                // 비정상적으로 체크되었을 경우 아무동작하지 않도록 return
                return;
            }
            
        },
        
        /** 수량 감소 함수 * */
        prevVal : function(optionKey, itemSalePrc, qtyAddUnit){
            
            // [START 오늘드림 옵션상품 개선:jwkim]
            var promKnCd = $(".event_info.item_"+optionKey).attr("promkndcd"); 
            var getItemAutoAddYn = $(".event_info.item_"+optionKey).attr("getitemautoaddyn"); 
            
            // 증정 상품의 경우 레이어에서 상품 선택시 오토를 N으로 하기 때문에 수량변경시 Y로 바꿔줘야 
            // 기존로직그대로 탄다
            if(promKnCd == "P203" && getItemAutoAddYn == "N"){
                var oriItemAutoAddYn = $(".event_info.item_"+optionKey).attr("getoriitemautoaddyn");
                
                $(".event_info.item_"+optionKey).attr("getitemautoaddyn", oriItemAutoAddYn);
            }
            // [END 오늘드림 옵션상품 개선:jwkim]
            
            // 장바구니 구매수량
            var cartCnt = Number($("#cartCnt_" + optionKey).val());
            
            // 구매 개수 적용
            cartCnt = cartCnt - Number(qtyAddUnit);
            
            // 장바구니 구매수량 관련 Validation
            var check = mgoods.detail.cart.cartCheck(cartCnt, optionKey);
            
            // 정상적으로 체크가 되었을 경우
            if ( check == 'Y'){
                
                // 감소된 값 세팅
                $("#cartCnt_" + optionKey).val(cartCnt);
                
                // 화면에 노출된 옵션 하위상품의 개수가 1개 이상일 경우
                // 여러개중에 선택한 값만 증가되고, 총 개수만 증가됨
                var totalCnt = Number($("#totalCnt").text()) - Number(qtyAddUnit);
                
                var totalPrc = Number($("#totalPrc").val()) - (Number(itemSalePrc) * Number(qtyAddUnit));
                $("#totalPrc").val(totalPrc);

                $("#totalCnt").text(totalCnt);
                $("#totalPrcTxt").text($.number(totalPrc));
                
                mgoods.detail.todayDelivery.deliveryCharge();
                
                // 선택된 프로모션 상품이 없는경우특정 프로모션 상품 개수 증가X
                // [START 오늘드림 옵션상품 개선:jwkim]
                if($("div.event_info.item_" + optionKey).hasClass("giftInit")){
                
                } else {
                    
                    // N+1 프로모션 안내 멘트 추가
                    mgoods.detail.cart.changeMsg(optionKey);
                }
                // mgoods.detail.cart.changeMsg(optionKey); // as-is 로직
                // [END 오늘드림 옵션상품 개선:jwkim]
                
            }else{
                // 비정상적으로 체크되었을 경우 아무동작하지 않도록 return
                return;
            }
        }, 
        
        /** N+1 프로모션 안내 멘트 추가 * */
        changeMsg : function(optionKey, promNo, init){
            var dupItemYn = $("#dupItemYn").val();      // 옵션 여부
            var pkgGoodsYn = $("#pkgGoodsYn").val();    // 패키지 여부
            var getGoods = "";
            var goodsNm = "";
            var cartCnt = 0;
            var prom = $("div.prd_cnt_box.item_" + optionKey).attr("promNo");
            var period = $("div.event_info[promno="+prom+"] h5[name=period]").text();
        	if(period==undefined || period==""){
        		prom = promNo;
        		period = $("div.event_info[promno="+prom+"] h5[name=period]").text();
        	}
            if(dupItemYn == "Y"){
                var selObj = $("div.prd_item_box.item_" + optionKey);
                var promNo = (promNo != undefined) ? promNo : selObj.attr("promNo");
                var promObj = $("div.prd_cnt_box[promNo=" + promNo + "]");
                
                $(promObj).each(function(){
                    cartCnt += parseInt( $(this).find("p.item_number input").val() ); 
                });
                
                getGoods = $("div.event_info[promNo=" + promNo + "]");
                goodsNm = selObj.find("p.item").text();
                goodsNm = goodsNm.replace(selObj.find("p.item a").text(), "");
            } else {
                cartCnt = parseInt( $("input#cartCnt_" + optionKey).val() );
                getGoods = $("div.event_info");
                goodsNm = $("div.titBox h3").text();
            }
            
            var getItemAutoAddYn = getGoods.attr("getItemAutoAddYn");      // Get상품 자동증가 여부
            var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
            var getOrdQty = parseInt( cartCnt / buyCondStrtQtyAmt );
            var promNo = (promNo == undefined) ? getGoods.attr("promNo") : promNo;
            var promKndCd = getGoods.attr("promKndCd");
            var promCond = (promKndCd == "P203" ? "GIFT" : buyCondStrtQtyAmt + "+1");
            var giftItemNm = (getGoods.attr("getItemGoodsNm") + " " + getGoods.attr("getItemItemNm")).trim();
            var goodsMsg = "";
            
            if(promKndCd == "P201"){        // 동일
                if(init == 'Y') { // 초기화 처리
                    goodsMsg += "<div class='txt'><strong><span>" + promCond + " 행사</span> 상품입니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                    goodsMsg += "<p><span class='name'>";
                    goodsMsg += buyCondStrtQtyAmt - (cartCnt % buyCondStrtQtyAmt) + "개</span> 더 구매하시면 <span class='name'>" + buyCondStrtQtyAmt + "+1 혜택</span>을 받으실 수 있어요.</p>";
                    goodsMsg += "</div>";
                    goodsMsg += "<button type='button' class='btnGrayW28' onClick=javascript:common.openEvtInfoPop('" + promNo  + "','" + promKndCd + "','" + promCond + "','" + getGoods.attr("goodsNo") + "','" + getGoods.attr("itemNo") + "');>자세히 보기</button>";
                } else if(buyCondStrtQtyAmt <= cartCnt){
                    goodsMsg += "<div class='txt'><strong><span>" + promCond + "적용</span>되어 구매됩니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                    goodsMsg += "<p>";
                    goodsMsg += goodsNm + "</span> <span class='break'>총 <em class='bold'>" + (cartCnt + getOrdQty) + "개</em>가 배송됩니다.</p>";
                    goodsMsg += "</div>";
                } else {
                    goodsMsg += "<div class='txt'><strong><span>" + promCond + " 행사</span> 상품입니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                    goodsMsg += "<p><span class='name'>";
                    goodsMsg += buyCondStrtQtyAmt - (cartCnt % buyCondStrtQtyAmt) + "개</span> 더 구매하시면 <span class='name'>" + buyCondStrtQtyAmt + "+1 혜택</span>을 받으실 수 있어요.</p>";
                    goodsMsg += "</div>";
                    goodsMsg += "<button type='button' class='btnGrayW28' onClick=javascript:common.openEvtInfoPop('" + promNo  + "','" + promKndCd + "','" + promCond + "','" + getGoods.attr("goodsNo") + "','" + getGoods.attr("itemNo") + "');>자세히 보기</button>";
                }
            } else if(promKndCd == "P202") {        // 교차
                if(init == 'Y') { // 초기화 처리
                    goodsMsg += "<div class='txt'><strong><span>" + promCond + " 행사</span> 상품입니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                    goodsMsg += '<p>' + buyCondStrtQtyAmt + "+1 상품을 선택해주세요.</p></div>";
                    goodsMsg += '<button type="button" class="btnOrangeH28" onClick=javascript:common.popLayer.promGift.openPromGiftPop("' + getGoods.attr("goodsNo")  + '","' + getGoods.attr("itemNo") + '","' + promNo + '");>선택</button>';
                } else if(buyCondStrtQtyAmt <= cartCnt){
                    var selectGetCnt = getGoods.find("div.txt p span.cnt").length;
                    
                    if(selectGetCnt == 0){
                        goodsMsg += "<div class='txt'><strong><span>" + promCond + " 행사</span> 상품입니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                        goodsMsg += '<p>' + buyCondStrtQtyAmt + "+1 상품을 선택해주세요.</p></div>";
                        goodsMsg += '<button type="button" class="btnOrangeH28" onClick=javascript:common.popLayer.promGift.openPromGiftPop("' + getGoods.attr("goodsNo")  + '","' + getGoods.attr("itemNo") + '","' + promNo + '");>선택</button>';
                    } else {
                        goodsMsg += "<div class='txt'><strong><span>" + promCond + "적용</span>되어 구매됩니다.</strong>";
                        
                        // 기 선택된 수량과 선택가능 수량을 비교하여 버튼 변경
                        var selGetItemCnt = 0;
                        var canGetItemCnt = parseInt(cartCnt / buyCondStrtQtyAmt);
                        
                        getGoods.find("span.cnt").each(function(){
                            selGetItemCnt += parseInt( $(this).attr("ordQty") );
                        });
                        
                        if(selGetItemCnt < canGetItemCnt)
                            getGoods.find("button").text("선택").removeClass("btnGrayW28").addClass("btnOrangeH28");
                        else if(selGetItemCnt > canGetItemCnt)
                            getGoods.find("button").text("선택").removeClass("btnGrayW28").addClass("btnOrangeH28");
                        else
                            getGoods.find("button").text("다시선택").removeClass("btnOrangeH28").addClass("btnGrayW28");
                        
                        return false;
                    }
                } else {
                    goodsMsg += "<div class='txt'><strong><span>" + promCond + " 행사</span> 상품입니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                    goodsMsg += "<p><span class='name'>" + (buyCondStrtQtyAmt - (cartCnt % buyCondStrtQtyAmt)) + "개</span> 더 구매하시면 <span class='name'>" + buyCondStrtQtyAmt + "+1 혜택</span>을 받으실 수 있어요.</p></div>";
                    goodsMsg += '<button type="button" class="btnGrayW28" onClick=javascript:common.openEvtInfoPop("' + promNo  + '","' + promKndCd + '","' + promCond + '","' + getGoods.attr("goodsNo") + '","' + getGoods.attr("itemNo") + '");>자세히 보기</button>';
                }
            } else if(promKndCd == "P203") {        // A+B
                if(init == 'Y') { // 초기화 처리
                    // 일반배송, 오늘드림 라디오 이동시마다 선택상품 초기화처리를 위해서 사용 jwkim
                    $("div.event_info.item_" + optionKey).addClass("giftInit");
                    
                    goodsMsg += "<div class='txt'><strong><span>" + promCond + " 행사</span> 상품입니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                    goodsMsg += "<p><span class='name'>GIFT 상품</span>을 선택해주세요.</p>";
                    goodsMsg += '<button type="button" class="btnOrangeH28 goods_nplus1" onClick=javascript:common.popLayer.promGift.openPromGiftPop("' + getGoods.attr("goodsNo") + '","' + getGoods.attr("itemNo") + '","' + promNo + '");>선택</button>';
                    goodsMsg += "</div>";
                } else if(getItemAutoAddYn == "Y"){    // 자동증가 Y
                    // 일반배송, 오늘드림 라디오 이동시마다 선택상품 초기화처리를 위해서 사용 jwkim
                    $("div.event_info.item_" + optionKey).removeClass("giftInit");
                    
                    goodsMsg += "<div class='txt'><strong><span>" + promCond + " 행사적용</span>되어 구매됩니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                    goodsMsg += "<p><span class='name'>" + giftItemNm + "</span> <span class='break'>" + cartCnt + "개가 함께 배송됩니다.</span></p>";
                    goodsMsg += '<button type="button" class="btnGrayW28" onClick=javascript:common.openEvtInfoPop("' + promNo  + '","' + promKndCd + '","' + promCond + '","' + getGoods.attr("goodsNo") + '","' + getGoods.attr("itemNo") + '");>자세히 보기</button>';
                    goodsMsg += "</div>";
                } else if(buyCondStrtQtyAmt <= cartCnt){
                    // 일반배송, 오늘드림 라디오 이동시마다 선택상품 초기화처리를 위해서 사용 jwkim
                    $("div.event_info.item_" + optionKey).removeClass("giftInit");
                    
                    var selectGetCnt = getGoods.find("div.txt p span.cnt").length;
                    
                    if(selectGetCnt == 0){
                        goodsMsg += "<div class='txt'><strong><span>" + promCond + " 행사</span> 상품입니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                        goodsMsg += "<p><span class='name'>GIFT 상품</span>을 선택해주세요.</p>";
                        goodsMsg += '<button type="button" class="btnOrangeH28 goods_nplus1" onClick=javascript:common.popLayer.promGift.openPromGiftPop("' + getGoods.attr("goodsNo") + '","' + getGoods.attr("itemNo") + '","' + promNo + '");>선택</button>';
                        goodsMsg += "</div>";
                    } else {
                        // 기 선택된 수량과 선택가능 수량을 비교하여 버튼 변경
                        var selGetItemCnt = 0;
                        var canGetItemCnt = parseInt(cartCnt / buyCondStrtQtyAmt);
                        
                        getGoods.find("span.cnt").each(function(){
                            selGetItemCnt += parseInt( $(this).attr("ordQty") );
                        });
                        
                        if(selGetItemCnt < canGetItemCnt)
                            getGoods.find("button").text("선택").removeClass("btnGrayW28").addClass("btnOrangeH28");
                        else if(selGetItemCnt > canGetItemCnt)
                            getGoods.find("button").text("선택").removeClass("btnGrayW28").addClass("btnOrangeH28");
                        else
                            getGoods.find("button").text("다시선택").removeClass("btnOrangeH28").addClass("btnGrayW28");
                        
                        return false;
                    }
                } else {
                    goodsMsg += "<div class='txt'><strong><span>" + promCond + " 행사</span> 상품입니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                    goodsMsg += "<p>GIFT 상품을 선택해주세요.</p>";
                    goodsMsg += '<button type="button" class="btnOrangeH28 goods_nplus1" onClick=javascript:common.popLayer.promGift.openPromGiftPop("' + getGoods.attr("goodsNo") + '","' + getGoods.attr("itemNo") + '","' + promNo + '");>선택</button>';
                    goodsMsg += "</div>";
                    
                }
            }
            
            getGoods.html(goodsMsg);
        },
        
        /** 카트 Validation 체크 * */
        cartCheck : function(cartCnt, optionKey, cartYn, colorchipYn, qty){
            cartCnt = parseInt(cartCnt);
            
            // 프로모션 정보
            var getGoods = $("div.event_info");
            var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
            var getOrdQty = isNaN(buyCondStrtQtyAmt) ? 0 : parseInt(cartCnt / buyCondStrtQtyAmt);
            var promKndCd = getGoods.attr("promKndCd");
            var getItemStockQty = parseInt( getGoods.attr("getItemStockQty") );
            
            var invQty = 0; 
            // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
            if($(":input:radio[name=qDelive]:checked").val() == 'Y' || $(":input:checkbox[name=qDelive]").prop("checked") == true){ // 당일배송 상품인 경우 재고변경
            	//MJH
              if(colorchipYn != undefined){
            	invQty = parseInt(qty);
              }
              else{
                invQty = $("#quickAvalInvQty").val();
                if(!isNaN(getItemStockQty)){
                    getItemStockQty = 999; // 당일배송일경우 get상품 qty 재고 999
                }
              }      
            } else {
                invQty = $("#avalInvQty").val();
            }
            
            var qtyAddUnit = parseInt( $("#qtyAddUnit").val() );
            var ordPsbMinQty = parseInt( $("#ordPsbMinQty").val() );
            
            var ordPsbMaxQty = 0;
            // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
            if($(":input:radio[name=qDelive]:checked").val() == 'Y' || $(":input:checkbox[name=qDelive]").prop("checked") == true){ // 당일배송 상품인 경우 최대구매수량 변경
                ordPsbMaxQty = parseInt( $("#quickOrdMaxQtyTemp").val() );
            } else {
                ordPsbMaxQty = parseInt( $("#ordPsbMaxQty").val() );
            }

            var dupItemYn = $("#dupItemYn").val();
            
            // 옵션이 있는 상품과 없는 상품의 재고 및 수량조건 세팅
            // 오늘드림이면서 옵션상품인 경우에는 웹재고로 재고를 계산하지 않게 하기위해서 조건문 추가..옵션상품이면서 일반배송인 경우에만 아래 조건을 탄다 jwkim
            // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
            if ( dupItemYn == 'Y' && ($(":input:radio[name=qDelive]:checked").val() != 'Y' || $(":input:checkbox[name=qDelive]").prop("checked") != true)){
                // 옵션이 있는 상품(패키지상품, 일반옵션상품)일 경우에 값 추출하기 위한 ID 세팅
                var itemInvClass = "#itemInv_" + optionKey;
                var minQtyClass = "#itemMinQty_" + optionKey;
                var maxQtyClass = "#itemMaxQty_" + optionKey;
                var itemQtyClass= "#itemQty_" + optionKey;
                
                invQty = parseInt( $(itemInvClass).val() );
                qtyAddUnit = parseInt( $(itemQtyClass).val() );
                ordPsbMinQty = parseInt( $(minQtyClass).val() );
                ordPsbMaxQty = parseInt( $(maxQtyClass).val() );
                
                var itemNm = $(".prd_item_box.item_"+optionKey).find('p.item > .optItemNm').text();
            }
            
            if ( cartCnt < ordPsbMinQty ) {
                alert( ordPsbMinQty + "개 이상부터 구매할 수 있는 상품입니다.");
                return "N";
            }
            
            // 주문 단위수량 및 1+1동일 증정 상품 고려한 주문 가능 수량
            var ordPsbQty = 0;
            if(promKndCd == "P201"){
                ordPsbQty = parseInt( invQty - (invQty / (buyCondStrtQtyAmt + 1)) );
                
                if(buyCondStrtQtyAmt > 1){
                    var modQty = parseInt( invQty % (buyCondStrtQtyAmt + 1) );
                    
                    if(modQty < buyCondStrtQtyAmt)
                        ordPsbQty += modQty;
                }
            } else if(promKndCd == "P203"){
                if(!isNaN(getItemStockQty) && getItemStockQty > 0){
                    if(invQty >getItemStockQty)
                        ordPsbQty = getItemStockQty;
                    else
                        ordPsbQty = invQty;
                } else {
                    ordPsbQty = invQty;
                }
            } else {
                ordPsbQty = parseInt( invQty - (invQty % qtyAddUnit) );
            }
            
            // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
            if ( ($(":input:radio[name=qDelive]:checked").val() == 'Y' || $(":input:checkbox[name=qDelive]").prop("checked") == true) && cartCnt > 999 ){
                // 최대주문가능수량 제한 Alert 노출
                if($(":input:radio[name=qDelive]:checked").val() == 'Y' || $(":input:checkbox[name=qDelive]").prop("checked") == true){   
                    alert("999개 이상은 선택하실 수 없습니다.");
                }
                return "N";
            }
            
            // 구매입력이 최대주문가능수량을 넘어 섰을 때
            if ( cartCnt > ordPsbMaxQty ){
                // 상품재고가 최대주문수량보다 클 경우
                if ( invQty > ordPsbMaxQty ){
                    // 최대주문가능수량 제한 Alert 노출
                    // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
                    if($(":input:radio[name=qDelive]:checked").val() == 'Y' || $(":input:checkbox[name=qDelive]").prop("checked") == true){   
                        alert("오늘드림 서비스의 1회 최대 구매 수량은 총 "+ordPsbMaxQty+"개 입니다.");
                    } else {
                        alert("총 " + ordPsbMaxQty + "개까지만 구매할 수 있습니다.");
                    }
                    return "N"; 
                }else{
                    // 장바구니 클릭 시 regCart 자체 얼럿으로 얼럿 노출 안함.
                    if ( cartYn == 'Y' ){
                        return "Y";
                     // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
                    }else if($(":input:radio[name=qDelive]:checked").val() == 'Y' || $(":input:checkbox[name=qDelive]").prop("checked") == true){   
                        if(ordPsbQty == 0){
                            if ( dupItemYn == 'Y' ){
                                alert('['+itemNm+'] 옵션 재고가 부족합니다. 재선택 바랍니다.');
                                return "N"; 
                            } else {
                                common.setScrollPos();
                                $("#layerPop").html($("#outItem").html());
                                common.popLayerOpen2("LAYERPOP01");
                                return "N"; 
                            }
                        } else {
                            if ( dupItemYn == 'Y' ){
                                // 재고부족 제한 Alert 노출
                                alert("["+itemNm+"] 옵션 재고가 " + ordPsbQty + " 개 남았습니다. 구매를 서둘러 주세요!");
                                return "N"; 
                            } else {
                                if(mgoods.detail.todayDelivery.buyClickYn == 'Y'){
                                    mgoods.detail.todayDelivery.openOrderQty(ordPsbQty);
                                } else {
                                    alert("재고가 " + ordPsbQty + " 개 남았습니다. 구매를 서둘러 주세요!");
                                }
                                return "N";
                            }
                        }
                        
                    }else{
                        // 재고부족 제한 Alert 노출
                        alert("재고가 " + ordPsbQty + " 개 남았습니다. 구매를 서둘러 주세요!");
                        return "N";    
                    }
                } 
            }else{
                // 상품 재고가 구매수량보다 작을 경우
                if ( ordPsbQty < cartCnt ){
                    // 장바구니 클릭 시 regCart 자체 얼럿으로 얼럿 노출 안함.
                    if ( cartYn == 'Y'){
                        return "Y";
                    }else{
                        // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
                        if($(":input:radio[name=qDelive]:checked").val() == 'Y' || $(":input:checkbox[name=qDelive]").prop("checked") == true){   
                            if(ordPsbQty == 0){
                                if ( dupItemYn == 'Y' ){
                                    alert('['+itemNm+'] 옵션 재고가 부족합니다. 재선택 바랍니다.');
                                    return "N"; 
                                } else {
                                    common.setScrollPos();
                                    $("#layerPop").html($("#outItem").html());
                                    common.popLayerOpen2("LAYERPOP01");
                                    return "N"; 
                                }
                            } else {
                                if ( dupItemYn == 'Y' ){
                                    // 재고부족 제한 Alert 노출
                                    alert("["+itemNm+"] 옵션 재고가 " + ordPsbQty + " 개 남았습니다. 구매를 서둘러 주세요!");
                                    return "N"; 
                                } else {
                                    if(mgoods.detail.todayDelivery.buyClickYn == 'Y'){
                                        mgoods.detail.todayDelivery.openOrderQty(ordPsbQty);
                                    } else {
                                        alert("재고가 " + ordPsbQty + " 개 남았습니다. 구매를 서둘러 주세요!");
                                    }
                                    return "N";
                                }
                            }
                            
                        } else {
                            // 재고부족 제한 Alert 노출
                            alert("재고가 " + ordPsbQty + " 개 남았습니다. 구매를 서둘러 주세요!");
                            return "N";    
                        }
                    }
                }
            } 
            
            // 정상시 Return
            return "Y";
        },
        
        /** 옵션 수량 텍스트에서 바꿀 시 * */
        cartCntBind : function(optionKey, qtyAddUnit, invQty, salePrc){
            
            // [START] jwkim 
            var promKnCd = $(".event_info.item_"+optionKey).attr("promkndcd"); 
            var getItemAutoAddYn = $(".event_info.item_"+optionKey).attr("getitemautoaddyn"); 
            
            // 증정 상품의 경우 레이어에서 상품 선택시 오토를 N으로 하기 때문에 수량변경시 Y로 바꿔줘야 
            // 기존로직그대로 탄다
            if(promKnCd == "P203" && getItemAutoAddYn == "N"){
                var oriItemAutoAddYn = $(".event_info.item_"+optionKey).attr("getoriitemautoaddyn");
                
                $(".event_info.item_"+optionKey).attr("getitemautoaddyn", oriItemAutoAddYn);
            }
            // [END] jwkim
            
            // 텍스트 바뀌는 onChange 이벤트
            $("#cartCnt_"+optionKey).bind("focusout", function(e){
                e.preventDefault();
                
                // 이전 값
                var prev = $(this).data('old');
                
                $(this).val($(this).val().replace(/[^0-9]/gi,""));

                // 구매수량을 제대로 입력하지 않을 경우
                if ( Number($(this).val()) > 0 && $(this).val() != '' ){
                    
                    // 구매수량 단위가 적절하지 않을때
                    if ( $("#dupItemYn").val() == 'Y' || $("#pkgGoodsYn").val() == 'Y'){
                        var minQtyClass = "#itemMinQty_" + optionKey;
                        var minQty = $(minQtyClass).val();
                    }else{
                        var minQty  = $("#ordPsbMinQty").val();
                    }
                    
                    // 구매단위가 1개 이상일 경우에만 체크, 1개일 경우에는 의미가 없음.
                    if ( Number(qtyAddUnit) > 1){
                        if ( Number(minQty) == Number(qtyAddUnit)){
                            var modInv = Number($(this).val()) % Number(qtyAddUnit);
                        }else{
                            var modInv = (Number($(this).val()) % Number(qtyAddUnit)) - Number(minQty);
                        }
                    }else{
                        var modInv = 0;
                    }
                    
                    if ( Number(modInv) != 0){
                        var psbInv = parseInt(invQty/qtyAddUnit) * Number(qtyAddUnit);
                        alert(qtyAddUnit + "개 단위로 구매 가능한 상품입니다. 수량을 다시 선택해주세요.");
                        mgoods.detail.optChangeErr = "Y";
                        $(this).val(prev);
                        // 수량 오류여부 초기화
                        setTimeout(function() {mgoods.detail.optChangeErr = "";}, 100);
                        return false;
                    }else{
                        // 구매수량이 적절하다고 판단되면 재고수량 체크등으로 이동
                        if ( mgoods.detail.cart.cartCheck($(this).val(), optionKey) == 'Y' ){
                            // 재고수량까지 완벽하다면 바뀐 구매수량으로 전체가격 수정
                            // 이전 값의 가격
                            var deletePrc = Number(prev) * Number(salePrc);
                            // 이전 값의 개수
                            var deleteCnt = Number(prev);
                            // 전체 가격
                            var totalPrc = Number($("#totalPrc").val());
                            // 전체 개수
                            var totalCnt = Number($("#totalCnt").text());
                            
                            // 전체 개수 = 전체 개수 - 이전값의 개수 + 바뀐 개수
                            var totalCnt = totalCnt - deleteCnt + Number($(this).val());
                            // 전체 가격 = 전체 가격 - 이전값의 가격 + ( 바뀐 개수 * 가격 )
                            var totalPrc = totalPrc - deletePrc + (Number($(this).val()) * Number(salePrc));
                            
                            // 전체 개수, 금액 세팅
                            $("#totalCnt").text(totalCnt);
                            $("#totalPrc").val(totalPrc);
                            $("#totalPrcTxt").text($.number(totalPrc));
                            
                            mgoods.detail.todayDelivery.deliveryCharge();
                        }else{
                            $(this).val(prev);
                            mgoods.detail.optChangeErr = "Y";
                            // 수량 오류여부 초기화
                            setTimeout(function() {mgoods.detail.optChangeErr = "";}, 100);
                            return false;
                        }
                    }
                }else{
                    alert(qtyAddUnit + "개 단위로 구매 가능한 상품입니다. 수량을 다시 선택해주세요.");
                    $(this).val(prev);
                    mgoods.detail.optChangeErr = "Y";
                    // 수량 오류여부 초기화
                    setTimeout(function() {mgoods.detail.optChangeErr = "";}, 100);
                    return false;
                }
                
                
                // [START 오늘드림 옵션상품 개선:jwkim]
                // N+1 프로모션 안내 멘트 추가 아래 로직으로 변경
                //mgoods.detail.cart.changeMsg(optionKey);
                if($("div.event_info.item_" + optionKey).hasClass("giftInit")){
                    // 일반배송, 오늘드림 선택이 변경되어 gift상품이 초기화된 경우 수량을 변경해도 아무런 액션을 하지 않게 하기 위함
                    
                } else {
                    // N+1 프로모션 안내 멘트 추가
                    mgoods.detail.cart.changeMsg(optionKey);
                }
                // mgoods.detail.cart.changeMsg(optionKey); // as-is 로직
                // [END 오늘드림 옵션상품 개선:jwkim]
            });
            
            // 이전값을 저장해주는 focusin 이벤트
            $("#cartCnt_"+optionKey).on('focusin', function(){
                $(this).data('old', $(this).val());
            });

        },
        
        /** 장바구니 등록 전 유효성 체크 * */
        checkRegCart : function(directYn, saveTp){
            // 수량 입력, 옵션 창이 열려 있다면
            var goodsOptInfo = "";
            
            // 옵션이 있는 상품이라면
            if ( $("#dupItemYn").val() == 'Y' ){
                goodsOptInfo = "multi";
            }else{
                goodsOptInfo = "single";
            }
            
            // 장바구니 개수 체크
            if ( mgoods.detail.cart.checkCartCnt() ){
                // get상품 선택 여부 체크
                if(mgoods.detail.cart.checkGetItemSelect()){
                    mgoods.detail.cart.regCart(goodsOptInfo, directYn, saveTp);
                } else {
                    alert("추가상품을 선택해주세요.");
                    $('div.event_info button').click();
                }
            }else{
                if ( $(".btn_basket").hasClass("dupItem") ){
                    var pleaseSelectMsg = "상품을 선택해주세요.";
                    if(window["presentYn"] == "Y"){
                        pleaseSelectMsg = "어떤 옵션을 맘에 들어 할지 고민되나요?\r선물 받는 사람이 직접 변경할 수 있으니,\r부담없이 선택해보세요.";
                    }
                    alert(pleaseSelectMsg);
                    $('.select_box .select_opt').click();
                } else {
                    alert("구매 개수를 확인해 주세요.");
                }
            }
        },
        
        // 오늘드림 고도화 2019-11-18 추가
        /** 장바구니 등록 전 유효성 체크 * */
        checkRegCart2 : function(directYn, saveTp){
            // 수량 입력, 옵션 창이 열려 있다면
            var goodsOptInfo = "";
            
            // 옵션이 있는 상품이라면
            if ( $("#dupItemYn").val() == 'Y' ){
                goodsOptInfo = "multi";
            }else{
                goodsOptInfo = "single";
            }
            
            // 장바구니 개수 체크
            if ( mgoods.detail.cart.checkCartCnt() ){
                // get상품 선택 여부 체크
                if(mgoods.detail.cart.checkGetItemSelect()){
                    
                    /*mgoods.detail.cart.regCart(goodsOptInfo, directYn, saveTp);*/
                    $("#delivery_list > div#message").append('<span>정상적으로 이용 가능하십니다.</span>');
                    mgoods.detail.validation = 'Y';
                    
                } else {
                    alert("추가상품을 선택해주세요.");
                    $('div.event_info button').click();
                }
            }else{
                if ( $(".btn_basket").hasClass("dupItem") ){
                    alert("상품을 선택해주세요.");
                    $('.select_box .select_opt').click();
                } else {
                    alert("구매 개수를 확인해 주세요.");
                }
            }
        },
        
        /** 장바구니 등록 전 유효성 체크 - 퀵배송 * */
        checkRegCartQuick : function(directYn, saveTp){
            // 수량 입력, 옵션 창이 열려 있다면
            var goodsOptInfo = "";
            
            // 옵션이 있는 상품이라면
            if ( $("#dupItemYn").val() == 'Y' ){
                goodsOptInfo = "multi";
            }else{
                goodsOptInfo = "single";
            }
            
            // 장바구니 개수 체크
            if ( mgoods.detail.cart.checkCartCnt() ){
                // get상품 선택 여부 체크
                if(mgoods.detail.cart.checkGetItemSelect()){
                    // 퀵배송에선 regCart 호출안하고 체크만
                    // mgoods.detail.cart.regCart(goodsOptInfo, directYn,
                    // saveTp);
                } else {
                    alert("추가상품을 선택해주세요.");
                    $('div.event_info button').click();
                    return false;
                }
            }else{
                if ( $(".btn_basket").hasClass("dupItem") ){
                    alert("상품을 선택해주세요.");
                    $('.select_box .select_opt').click();
                    return false;
                } else {
                    alert("구매 개수를 확인해 주세요.");
                    return false;
                }
            }
            
            return true;
        },
        
        /** 장바구니 등록 전 유효성 체크 컬러칩 MJH* */
        checkRegCartColorchip : function(directYn, saveTp, itemNo, qty){
            // 수량 입력, 옵션 창이 열려 있다면
            var goodsOptInfo = "single";
            var colorchipYn = itemNo;
                 
            if ( common.isLogin() ){
            	common.wlog("goods_cmpr_wish")//wlogMJH
                // get상품 선택 여부 체크
	            if(mgoods.detail.cart.checkGetItemSelect()){
	                mgoods.detail.cart.colorChipRegCart(goodsOptInfo, directYn, saveTp, colorchipYn, qty);
	            } else {
	                alert("추가상품을 선택해주세요.");
	                $('div.event_info button').click();
	            }
            }else{
            	common.link.moveLoginPage();
            }
        },
        
        /** 장바구니 등록 * */
        regCart : function(goodsOption, directYn, saveTp){
            
            var resultData = new Array();
         // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
//           var quickYn = $(":input:radio[name=qDelive]:checked").val();
           var quickYn = "N";
           if($(":input:radio[name=qDelive]:checked").length > 0){
               quickYn = $(":input:radio[name=qDelive]:checked").val();
           }else{
               quickYn = $(":input:checkbox[name=qDelive]").prop("checked") == true ? "Y" : "N";
           }
               
            // //KIOSK용 값 추가 2019-04-03
            // 서비스유형
            var servieType = $("#servieType").val();
            // 장비 유형
            var deviceType = $("#deviceType").val();
            // 장비 ID
            var deviceId = $("#deviceId").val();
            // 원매장코드 ID
            var frstStrCd = $("#frstStrCd").val();
            // 현매장코드 ID
            var strCd = $("#strCd").val();
            
            // 옵션이 없는 상품을 구매했을 때
            if ( goodsOption == 'single'){
                var goodsNo = $("#goodsNo").val();
                var itemNo = $("#itemNo").val();
                var optionKey = goodsNo + itemNo;
                var ordQty = parseInt( $("#cartCnt_"+optionKey).val() );
                var rsvGoodsYn = $("#rsvSaleYn").val();
                var dispCatNo = $("#dispCatNo").val();
                var drtPurYn = directYn;
                var prsntYn = "N"; // 고정값
                
                // 재고 여부 체크 ( 실제 장바구니버튼 클릭 시 재고 체크 안함 )
                if ( saveTp == "NEW"){
                    var cartCheck = mgoods.detail.cart.cartCheck(ordQty, optionKey);    
                }else{
                    var cartCheck = mgoods.detail.cart.cartCheck(ordQty, optionKey,'Y');
                }
                
                var getGoods = $("div.event_info");
                var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
                var promKndCd = getGoods.attr("promKndCd");
                
                if ( cartCheck == 'Y' ){
                    var data = {
                            goodsNo : goodsNo,
                            itemNo : itemNo,
                            ordQty : ordQty,
                            rsvGoodsYn : rsvGoodsYn,
                            dispCatNo : dispCatNo,
                            drtPurYn : drtPurYn,
                            prsntYn : prsntYn,
                            promKndCd : promKndCd,
                            buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                            quickYn : quickYn,
                            
                            servieType : servieType,
                            deviceType : deviceType,
                            deviceId : deviceId,
                            frstStrCd : frstStrCd,
                            strCd : strCd
                    };
                }else{
                    return;
                }
                
                resultData.push(data);
                
                // N+1 동일(P201), A+B(P203) 일 경우 장바구니에 자동 추가
                var buyGoodsNo = goodsNo;
                var buyItemNo = itemNo;
                var buyOrdQty = ordQty;
                
                var getGoods = $("div.event_info");
                var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
                var promNo = getGoods.attr("promNo");
                var promKndCd = getGoods.attr("promKndCd");
                var getItemAutoAddYn = getGoods.attr("getItemAutoAddYn");
                
                var getGoodsNo = (promKndCd == "P201") ? getGoods.attr("goodsNo") : getGoods.attr("getItemGoodsNo");
                var getItemNo = (promKndCd == "P201") ? getGoods.attr("itemNo") : getGoods.attr("getItemItemNo");
                var getOrdQty = parseInt( buyOrdQty / buyCondStrtQtyAmt );
                if(promKndCd == "P203")
                    getOrdQty = ordQty;
                
                var samePrdSumOrdQty = 0;
                if(buyGoodsNo == getGoodsNo && buyItemNo == getItemNo)
                    samePrdSumOrdQty = buyOrdQty;
                
                var getItemAutoAddYn = getGoods.attr("getItemAutoAddYn");
                
                if(getOrdQty > 0){
                    if(promNo != undefined && promNo != ""){
                        if(promKndCd == "P201" || 
                          (promKndCd == "P203" && getItemAutoAddYn == "Y" && 
                          getGoodsNo != undefined && getGoodsNo != '' && 
                          getItemNo != undefined && getItemNo != '')){
                            //KIOSK용 값 추가 2019-04-03
                            var getGoodsData = {
                                    goodsNo : getGoodsNo,
                                    itemNo : getItemNo,
                                    ordQty : getOrdQty,
                                    rsvGoodsYn : "N", // 예약상품여부
                                    dispCatNo : "",  // 전시카테고리 번호
                                    drtPurYn : directYn,            // 바로구매여부
                                    promKndCd : promKndCd,     // 프로모션구분
                                    crssPrstNo : promNo,        // 프로모션번호
                                    prstGoodsNo : buyGoodsNo,  // 타겟buy군의 상품번호
                                    prstItemNo : buyItemNo,    // 타겟buy군의 아이템번호
                                    buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                                    samePrdSumOrdQty : samePrdSumOrdQty,     // 상품번호 아이템번호가 같은상품의 수량을 합한값
                                    getItemAutoAddYn : getItemAutoAddYn,     // get상품 자동증가 여부
                                    quickYn : quickYn,
                                    
                                    servieType : servieType,    //서비스구분 : 1바로드림,2보내드림
                                    deviceType : deviceType,    //디바이스구분 : 10 KIOSK
                                    deviceId : deviceId,        //디바이스 아이디 
                                    frstStrCd : frstStrCd,      //원매장코드
                                    strCd : strCd               //현매장코드
                            };
                                                           
                            resultData.push(getGoodsData);
                        }
                    }
                }
            }else{
                // 패키지 상품 정보
                var pkgGoodsYn = $("#pkgGoodsYn").val();       // 패키지 상품 여부
                var pkgGoodsNo = (pkgGoodsYn == "Y") ? $("#goodsNo").val() : "";        // 패키지 상품 번호
                
                // 선택된 단품 개수마다 세팅
                //  선택된 단품 개수
                var itemLen = $(".prd_cnt_box").length;
                
                //  선택된 단품 개수마다 세팅
                for(var i=0; i<itemLen; i++){
                    var goodsNo = $(".prd_cnt_box").eq(i).attr("goodsNo");
                    var itemNo = $(".prd_cnt_box").eq(i).attr("itemNo");
                    var optionKey = goodsNo + itemNo;
                    var ordQty = parseInt( $(".prd_cnt_box").eq(i).find('.num').val() );
                    var rsvGoodsYn = $("#rsvSaleYn").val();
                    var dispCatNo = $("#dispCatNo").val();
                    var drtPurYn = directYn;

                    // 재고 여부 체크 ( 실제 장바구니버튼 클릭 시 재고 체크 안함 )
                    if ( saveTp == "NEW"){
                        var cartCheck = mgoods.detail.cart.cartCheck(ordQty, optionKey);    
                    }else{
                        var cartCheck = mgoods.detail.cart.cartCheck(ordQty, optionKey,'Y');
                    }
                    
                    var getGoods = $("div.event_info.item_" + goodsNo + itemNo);
                    var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
                    var promKndCd = getGoods.attr("promKndCd");
                    
                    if ( cartCheck == 'Y' ){
                        //KIOSK용 값 추가 2019-04-03
                        var itemData = {
                                goodsNo : goodsNo,
                                itemNo : itemNo,
                                ordQty : ordQty,
                                rsvGoodsYn : rsvGoodsYn,
                                dispCatNo : dispCatNo,
                                drtPurYn : drtPurYn,
                                prsntYn : prsntYn,
                                pkgGoodsNo : pkgGoodsNo,
                                promKndCd : promKndCd,
                                buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                                quickYn : quickYn,
                                
                                servieType : servieType,    //서비스구분 : 1바로드림,2보내드림
                                deviceType : deviceType,    //디바이스구분 : 10 KIOSK
                                deviceId : deviceId,        //디바이스 아이디 
                                frstStrCd : frstStrCd,      //원매장코드
                                strCd : strCd               //현매장코드
                        };
                        
                        resultData.push(itemData);
                    }else{
                        // jwkim 일반배송으로 주문시 문제 발상하게 되면 초기화 시켜야함
                        var selectDlvYn = $("input[name=selectDlvYn]", $("#outItem")).val();
                        
                        // jwkim 일반배송으로 주문시 문제 발상하게 되면 초기화 시켜야함
                        if(selectDlvYn == "Y"){
                            $("input[name=selectDlvYn]", $("#outItem")).val("N");
                        }
                        
                        return false;
                    }
                    
                    // N+1 동일(P201), A+B(P203) 일 경우 장바구니에 자동 추가 <시작>
                    var getGoods = $("div.event_info.item_" + goodsNo + itemNo);
                    var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
                    
                    var promNo = getGoods.attr("promNo");
                    var promKndCd = getGoods.attr("promKndCd");
                    var getItemAutoAddYn = getGoods.attr("getItemAutoAddYn");
                    
                    var getGoodsNo = (promKndCd == "P201") ? getGoods.attr("goodsNo") : getGoods.attr("getItemGoodsNo");
                    var getItemNo = (promKndCd == "P201") ? getGoods.attr("itemNo") : getGoods.attr("getItemItemNo");
                    var samePrdSumOrdQty = 0;
                    
                    if(goodsNo == getGoodsNo && itemNo == getItemNo)
                        samePrdSumOrdQty = ordQty;
                    
                    // 같은 프로모션의 buy군 상품 총 갯수
                    ordQty = 0;
                    $("div.prd_cnt_box[promNo=" + promNo + "]").each(function(){
                        ordQty += parseInt( $(this).find("input.num").val() );
                    });
                    
                    var getOrdQty = parseInt( ordQty / buyCondStrtQtyAmt );
                    
                    if(promKndCd == "P203")
                        getOrdQty = ordQty;
                    
                    if(getOrdQty == 0)
                        continue;
                    
                    var getItemAutoAddYn = getGoods.attr("getItemAutoAddYn");
                    
                    if(promNo != undefined && promNo != ""){
                        if(promKndCd == "P201" || 
                          (promKndCd == "P203" && getItemAutoAddYn == "Y" && 
                          getGoodsNo != undefined && getGoodsNo != '' && 
                          getItemNo != undefined && getItemNo != '')){
                          //KIOSK용 값 추가 2019-04-03
                            var getGoodsData = {
                                    goodsNo : getGoodsNo,
                                    itemNo : getItemNo,
                                    ordQty : getOrdQty,
                                    rsvGoodsYn : "N", // 예약상품여부
                                    dispCatNo : "",  // 전시카테고리 번호
                                    drtPurYn : drtPurYn,            // 바로구매여부
                                    promKndCd : promKndCd,     // 프로모션구분
                                    crssPrstNo : promNo,        // 프로모션번호
                                    prstGoodsNo : goodsNo,  // 타겟buy군의 상품번호
                                    prstItemNo : itemNo,    // 타겟buy군의 아이템번호
                                    buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                                    samePrdSumOrdQty : samePrdSumOrdQty,     // 상품번호 아이템번호가 같은상품의 수량을 합한값
                                    getItemAutoAddYn : getItemAutoAddYn,     // get상품 자동증가 여부
                                    quickYn : quickYn,
                                    
                                    servieType : servieType,    //서비스구분 : 1바로드림,2보내드림
                                    deviceType : deviceType,    //디바이스구분 : 10 KIOSK
                                    deviceId : deviceId,        //디바이스 아이디 
                                    frstStrCd : frstStrCd,      //원매장코드
                                    strCd : strCd               //현매장코드
                            };
                                                           
                            resultData.push(getGoodsData);
                        }
                    }
                    // N+1 동일(P201), A+B(P203) 일 경우 장바구니에 자동 추가 <끝>
                }
            }
            
            // 선택된 get상품 추가 <시작>
            $("div.event_info").each(function(){
                var promNo = $(this).attr("promNo");
                var buyCondStrtQtyAmt = parseInt( $(this).attr("buyCondStrtQtyAmt") );
                var promKndCd = $(this).attr("promKndCd");
                
                $(this).find("span.cnt").each(function(){
                    var getGoods = $(this);
                    var getGoodsNo = getGoods.attr("goodsNo");
                    var getItemNo = getGoods.attr("itemNo");
                    var getOrdQty = parseInt( getGoods.attr("ordQty") );
                    var samePrdSumOrdQty = 0;
                    
                    // 옵션이 없을 경우
                    if ( goodsOption == 'single'){
                        var buyGoodsNo = $("#goodsNo").val();
                        var buyItemNo = $("#itemNo").val();
                        var optionKey = goodsNo + itemNo;
                        var ordQty = parseInt( $("#cartCnt_"+optionKey).val() );
                        
                        if(getGoodsNo == buyGoodsNo && getItemNo == buyItemNo)
                            samePrdSumOrdQty += ordQty;
                    } else {
                        // 옵션이 있을 경우
                        $("div.prd_item_box").each(function(){
                            var buyGoodsNo = $(this).find("input[name=sGoodsNo]").val();
                            var buyItemNo = $(this).find("input[name=itemNo]").val();
                            var ordQty = parseInt( $(this).find("input.tx_num").val() );
                            
                            if(getGoodsNo == buyGoodsNo && getItemNo == buyItemNo)
                                samePrdSumOrdQty += ordQty;
                        });
                    }
                    //KIOSK용 값 추가 2019-04-03
                    var getGoodsData = {
                            goodsNo : getGoodsNo,
                            itemNo : getItemNo,
                            ordQty : getOrdQty,
                            rsvGoodsYn : "N", // 예약상품여부
                            dispCatNo : "",  // 전시카테고리 번호
                            drtPurYn : drtPurYn,            // 바로구매여부
                            promKndCd : promKndCd,     // 프로모션구분
                            crssPrstNo : promNo,        // 프로모션번호
                            prstGoodsNo : goodsNo,  // 타겟buy군의 상품번호
                            prstItemNo : itemNo,    // 타겟buy군의 아이템번호
                            buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                            samePrdSumOrdQty : samePrdSumOrdQty,     // 상품번호 아이템번호가 같은상품의 수량을 합한값
                            quickYn : quickYn,
                            
                            servieType : servieType,    //서비스구분 : 1바로드림,2보내드림
                            deviceType : deviceType,    //디바이스구분 : 10 KIOSK
                            deviceId : deviceId,        //디바이스 아이디 
                            frstStrCd : frstStrCd,      //원매장코드
                            strCd : strCd               //현매장코드
                    };
                    
                    resultData.push(getGoodsData);
                });
            });
            // 선택된 get상품 추가 <끝>
            
            // 장바구니 등록 ( 옵션 변경 focusout 적용 시 클릭 이벤트 방지를 위한 분기 처리 )
            if ( mgoods.detail.optChangeErr == 'Y'){
                mgoods.detail.optChangeErr = "";
                return false;
            }else{
                
                // 장바구니 등록 시에만 앱트래커 호출
                if(directYn != "Y"){
                    var appTrack_salePrc = $("#appTrack_salePrc").val();
                    var appTrack_goodsNo = $("#appTrack_goodsNo").val();
                    var appTrack_categoryNm = $("#appTrack_categoryNm").val();
                    var appTrack_goodsNm = $("#appTrack_goodsNm").val();
                    var appTrack_qty = 0;
                    
                    // 장바구니 담는 총갯수 구하기
                    for (var i=0; i<resultData.length; i++){
                        appTrack_qty += resultData[i].ordQty;
                    }
                    
                    var eventValue = {
                            "af_price" : $("#appTrack_salePrc").val()
                          , "af_content_id" : $("#appTrack_goodsNo").val()
                          , "af_content_nm" : $("#appTrack_goodsNm").val()
                          , "af_category_nm" : $("#appTrack_categoryNm").val()
                          , "af_quantity" : appTrack_qty+""
                    };
                    common.app.callTrackEvent('cart', eventValue);
                }
                
                // jwkim 일반으로배송 로직
                var mbrDlvpSeq ="";
                mbrDlvpSeq = $("input[name=mbrDlvpSeq]", $("#outItem")).val();
                
                if($("#quickYn").val() == "Y") {
                	var orderStrNo = $("#orderStrNo").val();
                	resultData.strNo = orderStrNo;
                }
                
                resultData.prodView = "Y";
                //  장바구니 등록
                // common.cart.regCart(resultData, directYn, saveTp, "", "", "N", mbrDlvpSeq);  // 최종 장바구니 등록
                var regCartCheck = common.cart.regCart(resultData, directYn, saveTp, "", "", "N", mbrDlvpSeq);  // 최종 장바구니 등록
                
                // 오늘드림 구매하기시에 장바구니 에러 발생시 매장재고가 아닌 999개로 초기화시킴
                if(regCartCheck.result == false && quickYn == "Y"){
                    $("#goodsForm #quickAvalInvQty").val("999");
                } else if(regCartCheck.result == false && quickYn == "N"){
                    $("input[name=selectDlvYn]", $("#outItem")).val("N");
                }
                
                if(directYn != "Y" && mgoods.detail.recoBellUseYn == 'Y' && mgoods.detail.recoBellViewYn == 'Y' && regCartCheck.result == true) {
                	mgoods.detail.callEigeneCart("a008"); // 장바구니 담기 후 큐레이션 레이어
                }
                
                var isQuickYn = $("input[name=isQuickYn]").val();
                if(isQuickYn == "Y"){
                    common.wlog("kiosk_quick_cart");
                }else{
                    common.wlog("kiosk_nomal_cart");
                }
                //키오스크 정보 초기화
                if($("#servieType")){
                    $("#servieType").val("");
                    $("#deviceType").val("");
                    $("#deviceId").val("");
                    $("#frstStrCd").val("");
                    $("#strCd").val("");
                }
                // common.cart.regCart(resultData, directYn, saveTp); // as-is
            }
        },
        
        /** 장바구니 등록 * */
        colorChipRegCart : function(goodsOption, directYn, saveTp, colorchipYn, qty){/** 컬러칩 colorchipYn 추가 MJH* */
            
            var resultData = new Array();
         // 오늘드림 고도화 2019-12-20 변경 $(":input:checkbox[name=qDelive]").prop("checked") == true
//           var quickYn = $(":input:radio[name=qDelive]:checked").val();
           var quickYn = "N";
           if($(":input:radio[name=qDelive]:checked").length > 0){
               quickYn = $(":input:radio[name=qDelive]:checked").val();
           }else{
               quickYn = $(":input:checkbox[name=qDelive]").prop("checked") == true ? "Y" : "N";
           }
               
            // //KIOSK용 값 추가 2019-04-03
            // 서비스유형
            var servieType = $("#servieType").val();
            // 장비 유형
            var deviceType = $("#deviceType").val();
            // 장비 ID
            var deviceId = $("#deviceId").val();
            // 원매장코드 ID
            var frstStrCd = $("#frstStrCd").val();
            // 현매장코드 ID
            var strCd = $("#strCd").val();
            
//            console.log("colorchipYn",colorchipYn);
            
            // 옵션이 없는 상품을 구매했을 때
            if ( goodsOption == 'single'){
                var goodsNo = $("#goodsNo").val();
                /** 컬러칩 colorchipYn 추가 MJH* */
                if(colorchipYn == undefined || colorchipYn == ""){
                	//console.log("컬러칩 아님");
                	var itemNo = $("#itemNo").val();
                }else{
                	//console.log("컬러칩");
                	var itemNo = colorchipYn;
                }
                //console.log("itemNo",itemNo);
                
                var optionKey = goodsNo + itemNo;
                /** 컬러칩 colorchipYn 추가 MJH* */
                if(colorchipYn == undefined || colorchipYn == ""){
                	var ordQty = parseInt( $("#cartCnt_"+optionKey).val() );
                }else{
//                	console.log(parseInt( $("#ordPsbMinQty").val()));
                	
                	var ordQty = parseInt( $("#ordPsbMinQty").val());
                	if($("#ordPsbMinQty").val() == undefined ){
                		ordQty = 1;
                	}
                }
                /** 컬러칩 colorchipYn 추가 MJH* */
                var rsvGoodsYn = $("#rsvSaleYn").val();
                var dispCatNo = $("#dispCatNo").val();
                var drtPurYn = directYn;
                var prsntYn = "N"; // 고정값
                
                // 재고 여부 체크 ( 실제 장바구니버튼 클릭 시 재고 체크 안함 )
                if ( saveTp == "NEW"){
//                	console.log("뉴");
                    var cartCheck = mgoods.detail.cart.cartCheck(ordQty, optionKey,'Y',colorchipYn, qty);    
                }else{
//                	console.log("아님");
//                	console.log("optionKey",optionKey);
                    var cartCheck = mgoods.detail.cart.cartCheck(ordQty, optionKey,'Y',colorchipYn, qty);
                }
                
//                console.log("itemNo",itemNo);
                
                var getGoods = $("div.event_info");
                var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
                var promKndCd = getGoods.attr("promKndCd");
                
                if ( cartCheck == 'Y' ){
                	//컬러칩에서 장바구니 클릭시 일반배송으로 MJH 20200402
//                	if(colorchipYn != undefined && colorchipYn != ""){
//                		quickYn = "N";
//                	}
                    var data = {
                            goodsNo : goodsNo,
                            itemNo : itemNo,
                            ordQty : ordQty,
                            rsvGoodsYn : rsvGoodsYn,
                            dispCatNo : dispCatNo,
                            drtPurYn : drtPurYn,
                            prsntYn : prsntYn,
                            promKndCd : promKndCd,
                            buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                            quickYn : quickYn,
                            
                            servieType : servieType,
                            deviceType : deviceType,
                            deviceId : deviceId,
                            frstStrCd : frstStrCd,
                            strCd : strCd
                    };
                }else{
                    return;
                }
                
                resultData.push(data);
                
                // N+1 동일(P201), A+B(P203) 일 경우 장바구니에 자동 추가
                var buyGoodsNo = goodsNo;
                var buyItemNo = itemNo;
                var buyOrdQty = ordQty;
                
                var getGoods = $("div.event_info");
                var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
                var promNo = getGoods.attr("promNo");
                var promKndCd = getGoods.attr("promKndCd");
                var getItemAutoAddYn = getGoods.attr("getItemAutoAddYn");
                
                var getGoodsNo = (promKndCd == "P201") ? getGoods.attr("goodsNo") : getGoods.attr("getItemGoodsNo");
                var getItemNo = (promKndCd == "P201") ? getGoods.attr("itemNo") : getGoods.attr("getItemItemNo");
                var getOrdQty = parseInt( buyOrdQty / buyCondStrtQtyAmt );
                if(promKndCd == "P203")
                    getOrdQty = ordQty;
                
                var samePrdSumOrdQty = 0;
                if(buyGoodsNo == getGoodsNo && buyItemNo == getItemNo)
                    samePrdSumOrdQty = buyOrdQty;
                
                var getItemAutoAddYn = getGoods.attr("getItemAutoAddYn");
                
                if(getOrdQty > 0){
                    if(promNo != undefined && promNo != ""){
                        if(promKndCd == "P201" || 
                          (promKndCd == "P203" && getItemAutoAddYn == "Y" && 
                          getGoodsNo != undefined && getGoodsNo != '' && 
                          getItemNo != undefined && getItemNo != '')){
                        	//컬러칩에서 장바구니 클릭시 일반배송으로 MJH 20200402
//                        	if(colorchipYn != undefined && colorchipYn != ""){
//                        		quickYn = "N";
//                        	}
                            //KIOSK용 값 추가 2019-04-03
                            var getGoodsData = {
                                    goodsNo : getGoodsNo,
                                    itemNo : getItemNo,
                                    ordQty : getOrdQty,
                                    rsvGoodsYn : "N", // 예약상품여부
                                    dispCatNo : "",  // 전시카테고리 번호
                                    drtPurYn : directYn,            // 바로구매여부
                                    promKndCd : promKndCd,     // 프로모션구분
                                    crssPrstNo : promNo,        // 프로모션번호
                                    prstGoodsNo : buyGoodsNo,  // 타겟buy군의 상품번호
                                    prstItemNo : buyItemNo,    // 타겟buy군의 아이템번호
                                    buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                                    samePrdSumOrdQty : samePrdSumOrdQty,     // 상품번호 아이템번호가 같은상품의 수량을 합한값
                                    getItemAutoAddYn : getItemAutoAddYn,     // get상품 자동증가 여부
                                    quickYn : quickYn,
                                    
                                    servieType : servieType,    //서비스구분 : 1바로드림,2보내드림
                                    deviceType : deviceType,    //디바이스구분 : 10 KIOSK
                                    deviceId : deviceId,        //디바이스 아이디 
                                    frstStrCd : frstStrCd,      //원매장코드
                                    strCd : strCd               //현매장코드
                            };
                                                           
                            resultData.push(getGoodsData);
                        }
                    }
                }
            }else{
                // 패키지 상품 정보
                var pkgGoodsYn = $("#pkgGoodsYn").val();       // 패키지 상품 여부
                var pkgGoodsNo = (pkgGoodsYn == "Y") ? $("#goodsNo").val() : "";        // 패키지 상품 번호
                
                // 선택된 단품 개수마다 세팅
                //  선택된 단품 개수
                var itemLen = $(".prd_cnt_box").length;
                
                //  선택된 단품 개수마다 세팅
                for(var i=0; i<itemLen; i++){
                    var goodsNo = $(".prd_cnt_box").eq(i).attr("goodsNo");
                    var itemNo = $(".prd_cnt_box").eq(i).attr("itemNo");
//                    console.log("goodsNo",goodsNo);
//                    console.log("itemNo",itemNo);
                    var optionKey = goodsNo + itemNo;
                    var ordQty = parseInt( $(".prd_cnt_box").eq(i).find('.num').val() );
                    var rsvGoodsYn = $("#rsvSaleYn").val();
                    var dispCatNo = $("#dispCatNo").val();
                    var drtPurYn = directYn;

                    // 재고 여부 체크 ( 실제 장바구니버튼 클릭 시 재고 체크 안함 )
                    if ( saveTp == "NEW"){
                        var cartCheck = mgoods.detail.cart.cartCheck(ordQty, optionKey);    
                    }else{
                        var cartCheck = mgoods.detail.cart.cartCheck(ordQty, optionKey,'Y');
                    }
                    
                    var getGoods = $("div.event_info.item_" + goodsNo + itemNo);
                    var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
                    var promKndCd = getGoods.attr("promKndCd");
                    
                    if ( cartCheck == 'Y' ){
                        //KIOSK용 값 추가 2019-04-03
                        var itemData = {
                                goodsNo : goodsNo,
                                itemNo : itemNo,
                                ordQty : ordQty,
                                rsvGoodsYn : rsvGoodsYn,
                                dispCatNo : dispCatNo,
                                drtPurYn : drtPurYn,
                                prsntYn : prsntYn,
                                pkgGoodsNo : pkgGoodsNo,
                                promKndCd : promKndCd,
                                buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                                quickYn : quickYn,
                                
                                servieType : servieType,    //서비스구분 : 1바로드림,2보내드림
                                deviceType : deviceType,    //디바이스구분 : 10 KIOSK
                                deviceId : deviceId,        //디바이스 아이디 
                                frstStrCd : frstStrCd,      //원매장코드
                                strCd : strCd               //현매장코드
                        };
                        
                        resultData.push(itemData);
                    }else{
                        // jwkim 일반배송으로 주문시 문제 발상하게 되면 초기화 시켜야함
                        var selectDlvYn = $("input[name=selectDlvYn]", $("#outItem")).val();
                        
                        // jwkim 일반배송으로 주문시 문제 발상하게 되면 초기화 시켜야함
                        if(selectDlvYn == "Y"){
                            $("input[name=selectDlvYn]", $("#outItem")).val("N");
                        }
                        
                        return false;
                    }
                    
                    // N+1 동일(P201), A+B(P203) 일 경우 장바구니에 자동 추가 <시작>
                    var getGoods = $("div.event_info.item_" + goodsNo + itemNo);
                    var buyCondStrtQtyAmt = parseInt( getGoods.attr("buyCondStrtQtyAmt") );
                    
                    var promNo = getGoods.attr("promNo");
                    var promKndCd = getGoods.attr("promKndCd");
                    var getItemAutoAddYn = getGoods.attr("getItemAutoAddYn");
                    
                    var getGoodsNo = (promKndCd == "P201") ? getGoods.attr("goodsNo") : getGoods.attr("getItemGoodsNo");
                    var getItemNo = (promKndCd == "P201") ? getGoods.attr("itemNo") : getGoods.attr("getItemItemNo");
                    var samePrdSumOrdQty = 0;
                    
                    if(goodsNo == getGoodsNo && itemNo == getItemNo)
                        samePrdSumOrdQty = ordQty;
                    
                    // 같은 프로모션의 buy군 상품 총 갯수
                    ordQty = 0;
                    $("div.prd_cnt_box[promNo=" + promNo + "]").each(function(){
                        ordQty += parseInt( $(this).find("input.num").val() );
                    });
                    
                    var getOrdQty = parseInt( ordQty / buyCondStrtQtyAmt );
                    
                    if(promKndCd == "P203")
                        getOrdQty = ordQty;
                    
                    if(getOrdQty == 0)
                        continue;
                    
                    var getItemAutoAddYn = getGoods.attr("getItemAutoAddYn");
                    
                    if(promNo != undefined && promNo != ""){
                        if(promKndCd == "P201" || 
                          (promKndCd == "P203" && getItemAutoAddYn == "Y" && 
                          getGoodsNo != undefined && getGoodsNo != '' && 
                          getItemNo != undefined && getItemNo != '')){
                          //KIOSK용 값 추가 2019-04-03
                            var getGoodsData = {
                                    goodsNo : getGoodsNo,
                                    itemNo : getItemNo,
                                    ordQty : getOrdQty,
                                    rsvGoodsYn : "N", // 예약상품여부
                                    dispCatNo : "",  // 전시카테고리 번호
                                    drtPurYn : drtPurYn,            // 바로구매여부
                                    promKndCd : promKndCd,     // 프로모션구분
                                    crssPrstNo : promNo,        // 프로모션번호
                                    prstGoodsNo : goodsNo,  // 타겟buy군의 상품번호
                                    prstItemNo : itemNo,    // 타겟buy군의 아이템번호
                                    buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                                    samePrdSumOrdQty : samePrdSumOrdQty,     // 상품번호 아이템번호가 같은상품의 수량을 합한값
                                    getItemAutoAddYn : getItemAutoAddYn,     // get상품 자동증가 여부
                                    quickYn : quickYn,
                                    
                                    servieType : servieType,    //서비스구분 : 1바로드림,2보내드림
                                    deviceType : deviceType,    //디바이스구분 : 10 KIOSK
                                    deviceId : deviceId,        //디바이스 아이디 
                                    frstStrCd : frstStrCd,      //원매장코드
                                    strCd : strCd               //현매장코드
                            };
                                                           
                            resultData.push(getGoodsData);
                        }
                    }
                    // N+1 동일(P201), A+B(P203) 일 경우 장바구니에 자동 추가 <끝>
                }
            }
            
            // 선택된 get상품 추가 <시작>
            $("div.event_info").each(function(){
                var promNo = $(this).attr("promNo");
                var buyCondStrtQtyAmt = parseInt( $(this).attr("buyCondStrtQtyAmt") );
                var promKndCd = $(this).attr("promKndCd");
                
                $(this).find("span.cnt").each(function(){
                    var getGoods = $(this);
                    var getGoodsNo = getGoods.attr("goodsNo");
                    var getItemNo = getGoods.attr("itemNo");
                    var getOrdQty = parseInt( getGoods.attr("ordQty") );
                    var samePrdSumOrdQty = 0;
                    
                    // 옵션이 없을 경우
                    if ( goodsOption == 'single'){
                        var buyGoodsNo = $("#goodsNo").val();
                        var buyItemNo = $("#itemNo").val();
                        var optionKey = goodsNo + itemNo;
                        var ordQty = parseInt( $("#cartCnt_"+optionKey).val() );
                        
                        if(getGoodsNo == buyGoodsNo && getItemNo == buyItemNo)
                            samePrdSumOrdQty += ordQty;
                    } else {
                        // 옵션이 있을 경우
                        $("div.prd_item_box").each(function(){
                            var buyGoodsNo = $(this).find("input[name=sGoodsNo]").val();
                            var buyItemNo = $(this).find("input[name=itemNo]").val();
                            var ordQty = parseInt( $(this).find("input.tx_num").val() );
                            
                            if(getGoodsNo == buyGoodsNo && getItemNo == buyItemNo)
                                samePrdSumOrdQty += ordQty;
                        });
                    }
                    //KIOSK용 값 추가 2019-04-03
                    var getGoodsData = {
                            goodsNo : getGoodsNo,
                            itemNo : getItemNo,
                            ordQty : getOrdQty,
                            rsvGoodsYn : "N", // 예약상품여부
                            dispCatNo : "",  // 전시카테고리 번호
                            drtPurYn : drtPurYn,            // 바로구매여부
                            promKndCd : promKndCd,     // 프로모션구분
                            crssPrstNo : promNo,        // 프로모션번호
                            prstGoodsNo : goodsNo,  // 타겟buy군의 상품번호
                            prstItemNo : itemNo,    // 타겟buy군의 아이템번호
                            buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                            samePrdSumOrdQty : samePrdSumOrdQty,     // 상품번호 아이템번호가 같은상품의 수량을 합한값
                            quickYn : quickYn,
                            
                            servieType : servieType,    //서비스구분 : 1바로드림,2보내드림
                            deviceType : deviceType,    //디바이스구분 : 10 KIOSK
                            deviceId : deviceId,        //디바이스 아이디 
                            frstStrCd : frstStrCd,      //원매장코드
                            strCd : strCd               //현매장코드
                    };
                    
                    resultData.push(getGoodsData);
                });
            });
            // 선택된 get상품 추가 <끝>
            
            // 장바구니 등록 ( 옵션 변경 focusout 적용 시 클릭 이벤트 방지를 위한 분기 처리 )
            if ( mgoods.detail.optChangeErr == 'Y'){
                mgoods.detail.optChangeErr = "";
                return false;
            }else{
                
                // 장바구니 등록 시에만 앱트래커 호출
                if(directYn != "Y"){
                    var appTrack_salePrc = $("#appTrack_salePrc").val();
                    var appTrack_goodsNo = $("#appTrack_goodsNo").val();
                    var appTrack_categoryNm = $("#appTrack_categoryNm").val();
                    var appTrack_goodsNm = $("#appTrack_goodsNm").val();
                    var appTrack_qty = 0;
                    
                    // 장바구니 담는 총갯수 구하기
                    for (var i=0; i<resultData.length; i++){
                        appTrack_qty += resultData[i].ordQty;
                    }
                    
                    var eventValue = {
                            "af_price" : $("#appTrack_salePrc").val()
                          , "af_content_id" : $("#appTrack_goodsNo").val()
                          , "af_content_nm" : $("#appTrack_goodsNm").val()
                          , "af_category_nm" : $("#appTrack_categoryNm").val()
                          , "af_quantity" : appTrack_qty+""
                    };
                    common.app.callTrackEvent('cart', eventValue);
                }
                
                // jwkim 일반으로배송 로직
                var mbrDlvpSeq ="";
                mbrDlvpSeq = $("input[name=mbrDlvpSeq]", $("#outItem")).val();
                
                if($("#quickYn").val() == "Y") {
                	var orderStrNo = $("#orderStrNo").val();
                	resultData.strNo = orderStrNo;
                }
                
                resultData.prodView = "Y";
                //  장바구니 등록
                // common.cart.regCart(resultData, directYn, saveTp, "", "", "N", mbrDlvpSeq);  // 최종 장바구니 등록
                var regCartCheck = common.cart.regCart(resultData, directYn, saveTp, "", "", "N", mbrDlvpSeq);  // 최종 장바구니 등록
                // 오늘드림 구매하기시에 장바구니 에러 발생시 매장재고가 아닌 999개로 초기화시킴
                if(regCartCheck.result == false && quickYn == "Y"){
                    $("#goodsForm #quickAvalInvQty").val("999");
                } else if(regCartCheck.result == false && quickYn == "N"){
                    $("input[name=selectDlvYn]", $("#outItem")).val("N");
                }
                var isQuickYn = $("input[name=isQuickYn]").val();
                if(isQuickYn == "Y"){
                    common.wlog("kiosk_quick_cart");
                }else{
                    common.wlog("kiosk_nomal_cart");
                }
                //키오스크 정보 초기화
                if($("#servieType")){
                    $("#servieType").val("");
                    $("#deviceType").val("");
                    $("#deviceId").val("");
                    $("#frstStrCd").val("");
                    $("#strCd").val("");
                }
                
                // common.cart.regCart(resultData, directYn, saveTp); // as-is
            }
        },
        // 장바구니 개수 조회
        checkCartCnt : function(){
            var totalCnt = Number($("#totalCnt").text());
            if( totalCnt != undefined && totalCnt != 0 && totalCnt != ""){
                if ( common.isLogin() ){
                    return true;
                }else{
                    common.link.moveLoginPage();
                }
            }else{
                return false;
            }
        },
        
        // get상품 선택 여부 체크
        checkGetItemSelect : function(){
            var checkFlag = true;
            $("div.event_info button").each(function(){
                if( $(this).text() == "선택" || $(this).hasClass("btnOrangeH28") )
                    checkFlag = false;
            });
            
            return checkFlag;
        },
        
        // 웹로그 바인딩
        bindWebLog : function(){
            // N+1 행사 안내 배너 - 옵션 선택 후
            $(".prd_item_box_wrap").find(".goods_nplus1").bind("click", function(){
                common.wlog("goods_nplus1");
            });
        }
};


$.namespace("mgoods.detail.brndwish");
mgoods.detail.brndwish = {
		
		moveBrandShop : function(onlBrndCd){
			var popLayer = ('#' + 'wishBrndPopup');
	        common.unlockBody();
	        $(popLayer).hide();
	        $('.dim').hide();
	        window.location.href = _baseUrl + 'display/getBrandShopDetail.do?onlBrndCd=' + onlBrndCd;
		},
	       /** 팝업 레이어 오픈 * */
        popLayerOpen : function(IdName){   
        	   var winH = $(window).height()-100; //수정함
        	   var popLayer = ('#'+IdName);
        		$(popLayer).find('.popCont').css({'max-height': winH});

        		var popPos = $(popLayer).height()/2;
        		var popWid = $(popLayer).width()/2;
        		$(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)}).show();
        		$('.dim').show();
        		
        		$('.dim').bind('click', function(){
        			common.popLayerClose(IdName);
        		});
        		common.wlog("goods_brandlike");//wlogMjh
        		if($("#brnd_wish").hasClass("on")){
        			$("#wishBrndPopup .brndSaveOk").show();
        			$("#wishBrndPopup .brndSaveNot").hide();
        			$("#wishBrndPopup #twobtn").show();
        			$("#wishBrndPopup #onebtn").hide();
        		}else{
        			$("#wishBrndPopup .brndSaveOk").hide();
        			$("#wishBrndPopup .brndSaveNot").show();
        			$("#wishBrndPopup #twobtn").hide();
        			$("#wishBrndPopup #onebtn").show();
        		}
        		
            
        }
};

/** SNS 공유 * */
$.namespace("mgoods.detail.sns");
mgoods.detail.sns = {
        
        title : $("#goodsNm").val(),
        snsUrl : _baseUrl + 'G.do?goodsNo=' + mgoods.detail.goodsNo,
        snsImg : $("#snsImg").val(),
        
        /** SNS 공유 초기화 * */
        init : function(){
            
            if ( mgoods.detail.sns.snsImg != undefined && mgoods.detail.sns.snsImg != "" ){
                // https -> http로 변경
                common.sns.init( mgoods.detail.sns.snsImg, mgoods.detail.sns.title, mgoods.detail.sns.snsUrl );                
            }else{
                common.sns.init( '', mgoods.detail.sns.title, mgoods.detail.sns.snsUrl);                
            }
        },
        
        /** 팝업 레이어 오픈 * */
        popLayerOpen : function(){   
            $("#SNSLAYER").html($("#snsPopUp").html());
            common.popLayerOpen("SNSLAYER");
            
            $("body").css("overflow", "hidden");
            
            $("#SNSLAYER").find(".snsShareDo").click(function(){
                var type = $(this).attr("snsType");
                common.sns.doShare(type);
            });
            
            // 드래그 방지 허용
            $.fn.enableSelection();

// $('.urlCopy input').focusin(function($timeout){
// $('html').css('overflow', 'hidden');
// $('.popLayerWrap').css({'position':'absolute', 'top':'70px',
// 'margin-top':'0'});
// $('.dimLayer .btnClose').addClass('iosDim');
                // $('.popLayerWrap').css({'position':'absolute',
                // 'top':'initial', 'bottom':'250px', 'margin-top':'0'});
                // $('.btnClose').css({'position':'absolute', 'top':'-40px'});//
// })
// $('.urlCopy input').focusout(function($timeout){
// $('html').css('overflow-y', 'auto');
// $('.popLayerWrap').css({'position':'fixed', 'top':'50%',
// 'margin-top':'-25px'});
                // $('.popLayerWrap').css({'position':'fixed', 'top':'50%',
                // 'bottom':'initial', 'margin-top':'-25px'});
// $('.btnClose').css({'position':'fixed', 'top':'30px'});
// $('.dimLayer .btnClose').removeClass('iosDim');
// })

            setTimeout(function() {
                // 웹로그 바인딩
                mgoods.detail.sns.bindWebLog();
            },100);
        },
        
        /* 0001063: MO_상품 상세 페이지 > 레이어창 팝업시 화면 밀림 현상 */
        popLayerOpen2 : function(){   
            $("#SNSLAYER").html($("#snsPopUp").html());
            common.popLayerOpen2("SNSLAYER");
            
            // $("body").css("overflow", "hidden");
            
            $("#SNSLAYER").find(".snsShareDo").click(function(){
                var type = $(this).attr("snsType");
                common.sns.doShare(type);
            });
            
            // 드래그 방지 허용
            $.fn.enableSelection();

            setTimeout(function() {
                // 웹로그 바인딩
                mgoods.detail.sns.bindWebLog();
            },100);
        },
        
        // 웹로그 바인딩
        bindWebLog : function(){
            // 공유하기 - 카카오톡
            $(".goods_share_kakaotalk").bind("click", function(){
                common.wlog("goods_share_kakaotalk");
            });
            // 공유하기 - 카카오스토리
            $(".goods_share_kakaostory").bind("click", function(){
                common.wlog("goods_share_kakaostory");
            });
            // 공유하기 - 페이스북
            $(".goods_share_facebook").bind("click", function(){
                common.wlog("goods_share_facebook");
            });
            // 공유하기 - URL
            $(".goods_share_url").bind("click", function(){
                common.wlog("goods_share_url");
            });
        }
};

// 행사사은품선택팝업띄우기
$.namespace('mcart.popLayer.promGift');
mcart.popLayer.promGift = {
    focusOutFlag : false,    
    /**
     * 초기화 함수 화면 로드가 끝나면 자동으로 실행 된다.
     */
    init : function() {
        var selTargetPromNo = goodsNo + itemNo;
        var totalCnt = 0;
        
        // 기 선택한 get 상품 표시
        $("div.event_info.item_" + selTargetPromNo + " div.txt span.cnt").each(function(){
            var goodsNo = $(this).attr("goodsNo");
            var itemNo = $(this).attr("itemNo");
            var promNo = $(this).attr("promNo");
            var ordQty = parseInt( $(this).attr("ordQty") );
            
            if(goodsNo != undefined && itemNo != undefined && promNo != undefined && ordQty != NaN){
                $("li[name=selPopInfo][goodsNo=" + goodsNo + "][itemNo=" + itemNo + "]").addClass("on").find("input[name=promGiftAmount]").val(ordQty);
                totalCnt += ordQty;
            }
        });
        
        $("p.choiceTxt span i").text(totalCnt);      // 기 선택한 추가상품 수량
        
        // 수량 수정(0 -> 1 개로 선택시 상품리스트에 하이라이트 효과적용)
        $('p.item_number input[name=promGiftAmount]').focusin(function(){
            $(this).val($(this).val().replace(/[^0-9]/gi,""));
            $(this).data('old', $(this).val());
        }).focusout(function() {
            mcart.popLayer.promGift.focusOutFlag = true;
            
            var prev = $(this).data('old') == undefined ? 0 : $(this).data('old');
            $(this).val($(this).val().replace(/[^0-9]/gi,""));
            var curVal = $(this).val();
            var totSelAmount = 0;
            
            // 구매수량을 제대로 입력하지 않을 경우
            if ( !(Number(curVal) >= 0 && curVal != '') || isNaN(curVal) ){
                alert('수량이 올바르지 않습니다.');
                $(this).val(prev);
                return false;
            }
            
            $('p.item_number input[name=promGiftAmount]').each(function(){
                totSelAmount += parseInt($(this).val());
            });
            
            prev = parseInt(prev);
            curVal = parseInt(curVal);
            
            // 최대 선택 가능 수량
            if(totSelAmount > getItemCnt && prev < curVal){
                alert('선택하실 수 있는 추가 상품은 최대 '+getItemCnt+'개 입니다.');
                $(this).val(prev);
                return false;
                
                totSelAmount = 0;
                $('p.item_number input[name=promGiftAmount]').each(function(){
                    totSelAmount += parseInt($(this).val());
                });
            }
            
            // 재고 체크
            var getItemStockQty = parseInt( $(this).parents("li[name=selPopInfo]").attr("stockQty") );
            if(getItemStockQty < curVal){
                alert("재고가 " + getItemStockQty + "개 남았습니다. 구매를 서둘러 주세요!");
                $(this).val(prev);
                return false;
            }
            
            if(this.value >= 1){
                $(this).parents("li").addClass("on");
            } else {
                $(this).parents("li").removeClass("on");
            }
            
            $("p.choiceTxt span i").text(totSelAmount);      // 기 선택한 추가상품 수량
            mcart.popLayer.promGift.focusOutFlag = false;
        });
        
        // 취소 버튼 클릭 이벤트
        $("button[name=btnCancel], a.btnClose").click(function() {
            if(mcart.popLayer.promGift.focusOutFlag){
                mcart.popLayer.promGift.focusOutFlag = false;
                return false;
            }
            common.popLayerClose('LAYERPOP01');
        });
        
        // GET상품 레이어 선택완료 버튼 클릭 이벤트
        $("button[name=btnComplete]").click(function() {
            if(mcart.popLayer.promGift.focusOutFlag){
                mcart.popLayer.promGift.focusOutFlag = false;
                return false;
            }
            
            var cartSelGetInfoList = new Array();
            var sumSelGift = 0; // GET상품 선택 레이어 내에서의 선택한 상품의 총수량
           
           if(getItemCnt > 0){
               $('p.item_number input[name=promGiftAmount]').each(function(){
                   sumSelGift += parseInt(this.value);
               });
               
               if(sumSelGift > getItemCnt){
                   alert('선택하실 수 있는 추가 상품은 최대 '+getItemCnt+'개 입니다.');
                   return false;
               } else if(sumSelGift < getItemCnt) {
                   alert('추가 상품을 '+(getItemCnt - sumSelGift)+'개 더 선택해주시거나, 본 상품의 수량을 변경해주세요.');
                   return false;
               } else {
                   var thisObj = $("div.event_info.item_" + selTargetPromNo);
                   var promKndCd = thisObj.attr("promKndCd");                           // 프로모션
                                                                                        // 종류(P201,P202,P203)
                   var buyCondStrtQtyAmt = parseInt( thisObj.attr("buyCondStrtQtyAmt") ); // n+1의
                                                                                            // n
                   var newSelGetHtml = "";           // 각각의 GET군 상품군 html변수
                   
                   var validSuc = false;            // 화면이 정상적으로 만들어 졌는지 체크
                   var itemCnt = 0;                  // GET상품 레이어의 선택된 상품의 수량
                   
                   var prom = $("div.prd_cnt_box.item_" + selTargetPromNo).attr("promNo");
                   var period = $("div.event_info[promno="+prom+"] h5[name=period]").text();
                   
                   // ----------- #####################3 화면 html make 시작
                    // ###############################
                   newSelGetHtml += "<div class='txt'>";
                   
                   // 프로모션 안내 문구
                   if(promKndCd == "P201" || promKndCd == "P202") 
                       newSelGetHtml += "<strong><span>" + buyCondStrtQtyAmt + "+1적용</span>되어 구매됩니다.<h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                   else if(promKndCd == "P203")
                       newSelGetHtml += "<strong><span>GIFT 행사적용</span>되어 구매됩니다.<br><h5 name='period' style='display:inline; font-weight:100'>"+ period + "</h5></strong>";
                   
                   // GET군 레이어의 상품 영역
                   $('li[name="selPopInfo"]').each(function(){
                       var getObj = $(this);
                       // 선택된 상품
                       if($(this).attr('class') == "on"){
                           // 프로모션상품인지 체크
                           if(promKndCd == "P201" || promKndCd == "P202" || promKndCd == "P203"){
                               itemCnt = parseInt( $(this).find('p.item_number input[name=promGiftAmount]').val() );
                               
                               // 장바구니 화면내의 GET군 영역의 상품정보 셋팅
                               newSelGetHtml += "<p>" + $(this).attr('goodsNm') + " " + $(this).attr('itemNm');
// newSelGetHtml += "<p>" + $(this).attr('itemNm');
                               newSelGetHtml += "<span class='cnt' id='" + ($(this).attr('goodsNo') + $(this).attr('itemNo')) + "' dispcatno='" + $(this).attr('itemNo') + "' goodsno='" + $(this).attr('goodsNo') + "' itemno='" + $(this).attr('itemNo') + "' promno='" + $(this).attr('oriPromNo') + "' ordqty='" + itemCnt + "' rsvsaleyn='' stockqty='" + $(this).attr('stockQty') + "'>";
                               newSelGetHtml +=  itemCnt + "개";
                               newSelGetHtml += "</span>";
                               newSelGetHtml += "</p>";
                               
                               validSuc = true;
                               
                               // 상품상세에서 일반배송,오늘드림 라디오 선택시 gift상품 제어를위해서 사용 jwkim
                               if(promKndCd == "P203"){
                                   $(".event_info.item_"+selTargetPromNo).attr("getItemAutoAddYn", "N");
                                   $(".event_info.item_"+selTargetPromNo).attr("getitemgoodsno", $(this).attr('goodsNo'));
                                   $(".event_info.item_"+selTargetPromNo).attr("getitemitemno", $(this).attr('itemNo'));
                                   $(".event_info.item_"+selTargetPromNo).attr("getitemgoodsnm", $(this).attr('goodsNm'));
                                   $(".event_info.item_"+selTargetPromNo).attr("getitemitemnm", $(this).attr('itemNm'));
                                   $(".event_info.item_"+selTargetPromNo).attr("getitemstockqty", $(this).attr('stockQty'));
                               }
                               
                           }
                       }
                   });
                   
                   newSelGetHtml += "</div>";
                   newSelGetHtml += "<button type='button' class='btnGrayW28' onClick=javascript:common.popLayer.promGift.openPromGiftPop('" + goodsNo + "','" + itemNo + "','" + promNo + "');>다시선택</button>";
                   // ----------- #####################3 화면 html make 끝
                    // ###############################
                   
                   if(validSuc){
                       // 성공하면 아래처리
                       $("div.event_info.item_" + selTargetPromNo).html(newSelGetHtml);
                       
                       // 옵션상품 선택시 초기화 제어를 위한 클래스명 제거 jwkim
                       $("div.event_info.item_" + selTargetPromNo).removeClass("giftInit");
                       
                   } else {
                      // 정상적으로 화면 html make 되지 않았을때 처리.
                       alert("죄송합니다.\n처리중 오류가 발생하였습니다.\n고객센터(1522-0882)로 문의 바랍니다.");
                       return false;
                   }
                   
                   // 닫기
                   common.popLayerClose('LAYERPOP01');
               }
           }
        });
    },
    
    /** 행사상품 팝업 레이어 오픈 * */
    popLayerOpen : function(goodsNo,itemNo,promNo){
        mcart.popLayer.promGift.http.openPromGiftPop.submit(goodsNo,itemNo,promNo);
    }
};

/** 당일배송 */
$.namespace("mgoods.detail.todayDelivery");
mgoods.detail.todayDelivery = {
        
        excute : false,
        
        jsonParam : undefined,
        
        buyClickYn : 'N',
 
        /** 당일배송 INIT * */
        init : function(){
            // 버튼 Bind
            setTimeout(function(){
                mgoods.detail.todayDelivery.bindButtonInit();
            }, 500)
        },
        
        bindButtonInit : function(){

        },
        /** 오늘드림 주소지 수정 호출**/
        adrModfyEvnt : function() {
            $(".a_adrModify").click(function(event) {
                if ( !mgoods.detail.cart.checkCartCnt() && $("#dupItemYn").val() != "Y"){
                    alert("상품을 선택해 주세요.");
                    return;
                }
                
                mgoods.detail.beforeSeq = '';
                
                if($("#dupItemYn").val() == "Y") { //옵션 가림 처리
                    $(".btn_newLayer .btn_oepn_layer").stop().show();
                    $(".select_box").removeClass("open");
                    $(".prd_option_layer").stop().hide();
                }
                
                $("#todayDelivery").find(".popTitle").text("배송지를 수정해주세요");
                $(".btn_add_fix").hide();
                mgoods.detail.todayDelivery.todayDeliveryList("Y");
            });
            
            $(".a_adrChange").click(function(event) {
               if ( !mgoods.detail.cart.checkCartCnt() && $("#dupItemYn").val() != "Y"){
                   alert("상품을 선택해 주세요.");
                   return;
               }
               
               if($("#dupItemYn").val() == "Y") { //옵션 가림 처리
                   $(".btn_newLayer .btn_oepn_layer").stop().show();
                   $(".select_box").removeClass("open");
                   $(".prd_option_layer").stop().hide();
               }
               
               $("#todayDelivery").find(".popTitle").text("배송지를 선택해주세요");
               $(".btn_add_fix").show();
               mgoods.detail.todayDelivery.todayDeliveryList();
            });
        },
        deliveryModifyForm : function(dlvpSeq) {
            mgoods.detail.modifySeq = dlvpSeq;
            var url = _baseUrl + "goods/getDeliveryRegistFormAjax.do";
            var data = {mbrDlvpSeq : dlvpSeq};
            common.Ajax.sendRequest("POST", url, data, common.zipcodequick.pop._callBackDeliveryRegistForm);
        },
        /** 당일배송 서비스 안내 * */
        openQuickPop : function(str){
            if(str == 'question'){
                $(window).scrollTop(0.0); //추가부분
                $('#pop-full-title').html("오늘드림 서비스 안내");
                $('body').css({'background-color' : '#fff'}); /* 2016-12-12 퍼블리싱 수정 반영 */
                $('#quickDeliveryInfoPop').hide();
                $('#pop-full-wrap').empty().html($('#quickDeliveryInfoPop').html());
                $('#pop-full-wrap').show();
                $('#mWrapper').hide();
                $(document).scrollTop(0);
                closeBtnAction = function(){
                    $('#mWrapper').css('display','block');
                    $('#pop-full-wrap').empty();
                    $('#quickDeliveryInfoPop').hide();
                }
                /*
                common.setScrollPos();

                $("#layerPop").html($("#infoTodayDeliveryQuestion").html());
                common.popLayerOpen2("LAYERPOP01");
                */
            }else if(str == 'order'){
                
                // 주문서 안내팝업
                var bannInfo = common.bann.getPopInfo("infoTodayDeliveryOrder");
                if (bannInfo != null) {
                    if (new Date() - bannInfo.regDtime >= (1000 * 60 * 60 * 24)) {;
                        common.setScrollPos();
                        $("#layerPop2").html($("#infoTodayDeliveryOrder").html());
                        common.popLayerOpen2("LAYERPOP02");
                    }else{
                        $("#quickInfoYn").val("Y");
                        $("button[name=btnPay]").click();
                    }
                } else {
                    common.setScrollPos();
                    $("#layerPop2").html($("#infoTodayDeliveryOrder").html());
                    common.popLayerOpen2("LAYERPOP02");
                } 
                
            }else {
                /*var dt = new Date();
                var hour = dt.getHours();*/
                
                // 오늘드림 기간 제한 ( json data가 잘못입력될수도있으니 try 처리 ) 
                var _o2oBlockInfo = "";
                try{
                    _o2oBlockInfo = $.parseJSON($("#o2oBlockInfo").val());
                    if(_o2oBlockInfo.o2oBlockYn == "Y"){
                        //alert(_o2oBlockInfo.o2oBlockMsg);
                        $("#deliveDay").prop("checked",false);
                        $("#deliveNm").prop("checked",true);
                        //return;
                    }
                }catch(e){console.log(e);}
                
                /*if(hour < $("#quickOrdTimeFrom").val() || hour >= $("#quickOrdTimeTo").val() ){
                    alert("오늘드림 주문 가능시간은\n오전 10시 ~ 오후 8시 입니다.");
                    $("#deliveDay").prop("checked",false);
                    $("#deliveNm").prop("checked",true);
                    return;
                }*/
                
                var bannInfo = common.bann.getPopInfo("infoTodayDelivery");
                if (bannInfo != null) {
                    if (new Date() - bannInfo.regDtime >= (1000 * 60 * 60 * 24)) {;
                        common.setScrollPos();
                        $("#layerPop").html($("#infoTodayDelivery").html());
                        common.popLayerOpen2("LAYERPOP01");
                    }
                } else {
                    common.setScrollPos();
                    $("#layerPop").html($("#infoTodayDelivery").html());
                    common.popLayerOpen2("LAYERPOP01");
                }          
            }
            
        },
        
        btnQuickYn : function(){
            /*
            // as-is 로직
            if($("#deliveDay").prop("checked")==true){
                $("#normDispAmt").addClass("off");
                $("#quickDispAmt").removeClass("off");
                $("#normDlvInfo").addClass("off");
                $("#quickDlvInfo").removeClass("off");
            }else{
                $("#normDispAmt").removeClass("off");
                $("#quickDispAmt").addClass("off");
                $("#normDlvInfo").removeClass("off");
                $("#quickDlvInfo").addClass("off");
            }
            */
            // 오늘 드림 옵션상품 개편 신규 로직 jwkim
            var checkFlag = true;
            
            if($("#deliveDay").prop("checked")==true){
                if($("#normDispAmt").hasClass("off")){
                    checkFlag = false;
                }
                
                $("#normDispAmt").addClass("off");
                $("#quickDispAmt").removeClass("off");
                $("#normDlvInfo").addClass("off");
                $("#quickDlvInfo").removeClass("off");
                $(".btn_present").hide();
                

                
                $('.prd_buy_wrap.type_gift').find('.txt_info_gift').hide(); // 선물하기 옵션 문구 hide
                
                mgoods.detail.todayDelivery.deliveryCharge();
            }else{
                if(!$("#normDispAmt").hasClass("off")){
                    checkFlag = false;
                }
                
                $("#normDispAmt").removeClass("off");
                $("#quickDispAmt").addClass("off");
                $("#normDlvInfo").removeClass("off");
                $("#quickDlvInfo").addClass("off");
                $(".btn_present").show();
                
                
                mgoods.detail.showPresentOptionText(); // 선물하기 옵션 문구 show
                
            }
            
            // jwkim 일반배송으로 주문시 필요
            var selectDlvYn = $("input[name=selectDlvYn]", $("#outItem")).val();
            
            // jwkim selectDlvYn 이 값은 오늘드림 배송에서 배송지 선택 레이어 팝업에서 특정 주소지를 선택후 재고가0인경우
            // 일반으로배송 주문 레이어 팝업에서 일반으로배송 선택시 Y값으로 바꿈
            // Y인 경우 옵션을 초기화 시키지 않게 하기 위함 
            if(checkFlag && selectDlvYn != "Y"){
                // 일반배송, 오늘드림 라디오 선택시 행사 상품이 있는경우 n+1 상품 초기화
                // [START 오늘드림 옵션상품 개선:jwkim]
                
                // 오늘드림에서 사용자가 특정 배송지 선택후 라디오버튼을 일반배송으로 변경한경우에 주문하는경우 선택한 배송지코드 초기화
                // 초기화 시켜주지 않으면 구매하기시에 오늘드림에서 선택한 배송지로 자동셋팅됨
                $("input[name=mbrDlvpSeq]", $("#outItem")).val("");
                
                var promNo = "";
                var optionKey = "";
                var goodsNo = $("#goodsNo").val();
                
                $(".prd_item_box_wrap  input[name=itemNo]").each(function(){
                    
                    optionKey = goodsNo+$(this).val();
                    promNo = $("div.event_info.item_"+optionKey).attr("promno");
                    
                    mgoods.detail.cart.changeMsg(optionKey, promNo, "Y");
                    
                });
                
                
                $("div.event_info").each(function(){
                    // 옵션 교차 n+1 / gift 상품인경우 일반배송 및 오늘드림 여부가 변경될때마다 프로모션상품 초기화
                    if($(this).attr("promkndcd") == "P202"){ // n+1인경우
                        
                        var cartCnt = 0;
                        var nCnt = 0;
                        
                        optionKey = $(this).attr("goodsno") +$(this).attr("itemno");
                        promNo = $(this).attr("promno");
                        
                        // 상품수량
                        cartCnt = $("#cartCnt_"+optionKey).val();
                        // buy의 N개의 상품 수량
                        nCnt = Number($(this).attr("buyCondStrtQtyAmt"));
                        
                        // N개 선택보다 선택한 상품수가 적은경우 초기화하지 않음
                        /*if(cartCnt >= nCnt){
                            mgoods.detail.cart.changeMsg(optionKey, promNo, "Y");
                        }*/
                        mgoods.detail.cart.changeMsg(optionKey, promNo, "Y");
                        
                        mgoods.detail.cart.changeMsg(optionKey, promNo);
                        
                    } else if($(this).attr("promkndcd") == "P203"){ // gift인경우
                        optionKey = $(this).attr("goodsno") +$(this).attr("itemno");
                        promNo = $(this).attr("promno");
                        
                        mgoods.detail.cart.changeMsg(optionKey, promNo, "Y");
                        
                        //mgoods.detail.cart.changeMsg(optionKey, promNo);
                    }
                });
                
                // 일반배송, 오늘드림 라디오 선택시 행사 상품이 있는경우 OptionList 초기화
                if($('.select_box').parent().hasClass('open')){
                    
                    $('.select_box').parent().removeClass('open');
                    
                }
                
                // 라디오 선택시 옵션이 존재하는경우 초기화...새로 옵션을 선택하면 옵션list새로 불러옴
                if($("#opt_other > li").size() > 0){
                    $("#opt_other").html("");
                    // 옵션 닫기
                    // $(".select_opt").click();
                    
                    $(".select_opt").parent('.select_box').removeClass('open').find('ul').hide();
                    $('.opt_choice_area').css({'overflow-y':'scroll'})
                    $('.event_info').show();
                    $('.case_cnt_box').show(); // 2017-02-20 추가
                    $('.total_price').show();
                    $('.buy_button_area').show();
                    $('.prd_item_box_wrap').show();
                }
                // [END 오늘드림 옵션상품 개선:jwkim]
            }
            
            $("input[name=selectDlvYn]", $("#outItem")).val("N");
            
        },
        
        /** 당일배송 오늘 하루 안보기 * */
        openQuickPopToday : function(){  
            common.bann.setPopInfo("infoTodayDelivery", $("#infoTodayDelivery").attr("data-ref-compareKey"));
            setTimeout(function() {
                $("body").css("overflow", "visible");
            }, 100);

            $(document).scrollTop(0);
            common.popLayerClose('LAYERPOP01');
        },
        /** 당일 배송지 목록 * */
        todayDeliveryList : function(modifyLstYn){
            if(modifyLstYn == "" || modifyLstYn == undefined) {
                modifyLstYn = "N";
            }
            
            var url = _baseUrl + "goods/getTodayDeliveryListAjax.do";
            var data ={modifyLstYn : modifyLstYn};
            //var data ={};

            common.Ajax.sendRequest("GET",url,data,mgoods.detail.todayDelivery._callBackTodayDeliveryList);
        },        
        // 오늘드림 고도화 2019.11.18 추가
        /** 당일 배송지 목록(페이지 상에 불러오기) **/
        todayDeliveryListOnPage : function(){

            var url = _baseUrl + "goods/getTodayDeliveryListAjaxOnlyData.do";
            var data = {};
            common.Ajax.sendRequest("POST",url,data,mgoods.detail.todayDelivery._callBackTodayDeliveryListOnPage);
        },
        
        /** 배송지 등록 후 당일 배송지 선택 * */
        registTodayDeliverySelect : function(){
            //오늘드림 고도화 2019-12-21 배송지 선택 시 
            var url = _baseUrl + "goods/getTodayO2ODeliveryAjax.do";
            var dlvpSeq = mgoods.detail.modifySeq;
            
            var maxDlvpSeq = dlvpSeq == "" || dlvpSeq == undefined  ? "Y" : "";
            
            var data = {};
            if(maxDlvpSeq == "Y") {
                data = {maxDlvpSeq : maxDlvpSeq};
            } else {
                data = {dlvpSeq : dlvpSeq};
            }
            
            mgoods.detail.modifySeq = "";
            
            common.Ajax.sendRequest("POST",url,data,mgoods.detail.todayDelivery._callBackRegistTodayDeliverySelect2);
            
        },
        
        // 오늘드림 고도화 2019-11-19 추가
        /** 배송지 등록 후 당일 배송지 선택(기존 로직과 다름) * */
        registTodayDeliverySelect2 : function(){
            var url = _baseUrl + "goods/getTodayO2ODeliveryAjax.do";
            var data ={maxDlvpSeq : 'Y'};
            common.Ajax.sendRequest("POST",url,data,mgoods.detail.todayDelivery._callBackRegistTodayDeliverySelect2);
        },
        
        /** 당일 배송지 닫기 * */
        todayDeliveryClose : function(){
            $("#todayDelivery").find(".popTitle").text("배송지를 선택해주세요");
            common.popFullClose();
            common.zipcodequick.pop.deliveryRegistForm();
        },
        
        /** 주문서 당일 배송지 닫기 * */
        todayDeliveryOrderClose : function(str){
            common.popFullClose();
            $("#quickInfoYn").val("Y");
            $("button[name=btnPay]").click();
        },
        /** 주문서 당일배송 오늘 하루 안보기 * */
        openQuickPopTodayOrder : function(){  
            common.bann.setPopInfo("infoTodayDeliveryOrder", $("#infoTodayDeliveryOrder").attr("data-ref-compareKey"));
            setTimeout(function() {
                $("body").css("overflow", "visible");
            }, 100);
            $("#quickInfoYn").val("Y");
            $(document).scrollTop(0);
            common.popLayerClose('LAYERPOP02');
            $("button[name=btnPay]").click();
        },
        
        /** 당일 배송지 선택 * */
        registTodayDelivery : function(strNo, mbrDlvpSeq){
            common.popFullClose();
            
            //오늘드림 고도화 2019-12-21 배송지 선택 시 
            $(".btn_basket").show();
            $(".btn_buy").show();
            $(".btn_soldout").hide();
            $(".buy_button_area").removeClass("soldout"); // 품절 클래스 삭제
            
            // 신규 퀵배송지 초기화 및 등록 
            mgoods.detail.todayDelivery.registQuickMbrDlvpInfoOnPage(mbrDlvpSeq, strNo);
            
            //오늘드림 고도화 이전 소스
            // 퀵배송지를 초기화 및 선택된 배송지 업데이트 quickYn = 'Y', strNo(매장번호)
            /*mgoods.detail.todayDelivery.registQuickMbrDlvpInfo(strNo, mbrDlvpSeq);
            
            var resultData = new Array();
            
            // 옵션이 있는 상품이라면
            if ( $("#dupItemYn").val() == 'Y' ){
                
                // 선택된 단품 개수
                var itemLen = $(".prd_cnt_box").length;
                
                // 선택된 단품 개수마다 세팅
                for(var i=0; i<itemLen; i++){   
                    var goodsNo = $(".prd_cnt_box").eq(i).find('input[name=sGoodsNo]').val();
                    var itemNo = $(".prd_cnt_box").eq(i).find('input[name=itemNo]').val();
                    
                    var itemData = {
                            goodsNo : goodsNo,
                            itemNo : itemNo,
                            strNo : strNo,
                            buyGetSctCd : 'B' // buy, get군 구분코드 jwkim
                    };
                    
                    resultData.push(itemData);
                }
            }else{
                var goodsNo = $("#goodsNo").val();
                var itemNo = $("#itemNo").val();
                
                var data = {
                        goodsNo : goodsNo,
                        itemNo : itemNo,
                        strNo : strNo,
                        buyGetSctCd : 'B' // buy, get군 구분코드 jwkim
                };
                
                resultData.push(data);
            }
            
            // 선택된 get상품 추가 <시작>
            $("div.event_info").each(function(){
                var promNo = $(this).attr("promNo");
                var promKndCd = $(this).attr("promKndCd");
                
                $(this).find("span.cnt").each(function(){
                    var getGoods = $(this);
                    var getGoodsNo = getGoods.attr("goodsNo");
                    var getItemNo = getGoods.attr("itemNo");
                    
                    var getGoodsData = {
                            goodsNo : getGoodsNo,
                            itemNo : getItemNo,
                            strNo : strNo,
                            crssPrstNo : promNo,
                            buyGetSctCd : 'G'
                    };
                    
                    resultData.push(getGoodsData);
                });
            })
            // 선택된 get상품 추가 <끝>

            if(resultData == null) {
                alert("죄송합니다. 고객센터에 문의해 주세요.");
            } else {
                this.jsonParam =   {
                        opCartBaseList : resultData
                    };
                
            }
            
            // jwkim 일반배송으로 주문시에 선택한 주소지 정보로 주문서에 셋팅하게끔 하기위해서 해당값사용 
            $("input[name=mbrDlvpSeq]", $("#outItem")).val(mbrDlvpSeq);
            
            data,mgoods.detail.todayDelivery.deliveryStrStock(); */               
        },
        
        // 오늘드림 고도화 2019-11-18 추가
        // 오늘드림 체크박스 체크시 배송유무 메세지 뿌리기 메소드
        displayTodayDeliveryYnMessage : function(strNo, mbrDlvpSeq){
            /*fnLayerSet("todayDelivery", "close");*/
            
            //퀵배송지를 초기화 및 선택된 배송지 업데이트 quickYn = 'Y', strNo(매장번호)
            mgoods.detail.todayDelivery.registQuickMbrDlvpInfo(strNo, mbrDlvpSeq);
            
            var resultData = new Array();
            
            //  옵션이 있는 상품이라면 
            if ( $("#dupItemYn").val() == 'Y' ){
                
                //  선택된 단품 개수
                var itemLen = $(".prd_cnt_box").length;
                
                //  선택된 단품 개수마다 세팅
                for(var i=0; i<itemLen; i++){   
                    var goodsNo = $(".prd_cnt_box").eq(i).find('input[name=sGoodsNo]').val();
                    var itemNo = $(".prd_cnt_box").eq(i).find('input[name=itemNo]').val();
                    
                    var itemData = {
                            goodsNo : goodsNo,
                            itemNo : itemNo,
                            buyGetSctCd : 'B' // buy, get군 구분코드 jwkim
                    };
                    
                    resultData.push(itemData);
                }
            }else{
                var goodsNo = $("#goodsNo").val();
                var itemNo = $("#itemNo").val();
                
                var data = {
                        goodsNo : goodsNo,
                        itemNo : itemNo,
                        buyGetSctCd : 'B' // buy, get군 구분코드 jwkim
                };
                
                resultData.push(data);
            }

            // 선택된 get상품 추가 <시작>
            $("div.prd_gift_box").each(function(){
                var promNo = $(this).attr("promNo");

                var promKndCd = $(this).attr("promKndCd");
                
                $(this).find("span.opt").each(function(){
                    var getGoods = $(this);
                    var getGoodsNo = $(this).attr("goodsNo");
                    var getItemNo = $(this).attr("itemNo");
                    
                    var giftData = {
                            goodsNo : getGoodsNo,
                            itemNo : getItemNo,
                            crssPrstNo : promNo,
                            buyGetSctCd : 'G'  // buy, get군 구분코드 jwkim
                    };
                    
                    resultData.push(giftData);
                });
            })

            if(resultData == null) {
                if($("#dupItemYn").val() == "Y" && $("#quickYn").val() == "Y") { // 옵션 상품이고 오늘드림일 경우 주소 선택 시 재고 체크 X : LJS
                    return;
                } else {
                    alert("죄송합니다. 고객센터에 문의해 주세요.");
                }
            } else {
                this.jsonParam =   {
                        opCartBaseList : resultData
                    };
                
            }
            
            // jwkim 일반배송으로 주문시에 선택한 주소지 정보로 주문서에 셋팅하게끔 하기위해서 해당값사용 
            $("input[name=mbrDlvpSeq]", $("#outItem")).val(mbrDlvpSeq);
            
            if($(".todayGift").length > 0) {
            	this.jsonParam.quickGiftYn = "Y";
            	this.jsonParam.quickAeEvtNo = $(".todayGift").data("evtno");
            }
            
            if($("#dupItemYn").val() != "Y") {
            	this.jsonParam.mbrDlvpSeq = mbrDlvpSeq;
                mgoods.detail.todayDelivery.deliveryStrStockOnPage();
            } else {
                mgoods.detail.beforeSeq = mbrDlvpSeq;
            }
        },
        
        /** 퀵배송지 초기화 및 등록 * */
        registQuickMbrDlvpInfo : function(strNo, mbrDlvpSeq){
            var url = _baseUrl + "goods/registQuickMbrDlvpInfoAjax.do";
            var data ={strNo : strNo, mbrDlvpSeq : mbrDlvpSeq};
            common.Ajax.sendRequest("POST",url,data,mgoods.detail.todayDelivery._callBackRegistQuickMbrDlvpInfo);
        },
        
        // 오늘드림 고도화 2019-11-18 추가
        /** 퀵배송지 초기화 및 등록 (팝업 아닌 현재 페이지에서 진행)**/
        registQuickMbrDlvpInfoOnPage : function(mbrDlvpSeq, strNo){
            common.popFullClose();
            
            mgoods.detail.dlvrListSelectedYn = 'Y';
            
            if($("#dupItemYn").val() == "Y") {
                $(".btn_newLayer .btn_oepn_layer").hide();
                $('.prd_option_layer').show();
                $('.opt_choice_area').css({'overflow-y':'scroll'});
                
                // 선택된 아이템이 있으면 wrap show, 없으면 wrap hide
                if ( $('.prd_item_box_wrap').find('.prd_item_box').length == 0 ){
                    $('.prd_item_box_wrap').hide();
                }else{
                    $('.prd_item_box_wrap').show();
                    $('.event_info').show();
                }
                
                if(mgoods.detail.beforeSeq != mbrDlvpSeq) {
                    $(".list_opt_other").html("");  //옵션상품의 경우 주소지 변경 시 선택 옵션 초기화
                    $(".prd_item_box").remove();
                    $(".event_info").remove();
                    
                    // 전체 개수, 전체 총합 계산 초기
                    $("#totalCnt").text("0");
                    $("#totalPrcTxt").text("0");
                    $("#totalPrc").val("0");
                }
                
                mgoods.detail.beforeSeq = mbrDlvpSeq; // 이전 선택 배송지 적재.
            }
            
            
            $(".btn_soldout").hide();    //일시품절 버튼
            $(".buy_button_area").removeClass("soldout"); // 품절 클래스 삭제
            $(".btn_basket").show();    //장바구니 버튼
            $(".btn_buy").show();    //구매하기 버튼
            
            var url = _baseUrl + "goods/registQuickMbrDlvpInfoAjax.do";
            var data ={strNo : strNo, mbrDlvpSeq : mbrDlvpSeq};
            common.Ajax.sendRequest("POST",url,data,mgoods.detail.todayDelivery._callBackRegistQuickMbrDlvpInfoOnPage);
        },
        
        /** 당일배송 매장 재고 확인 * */
        deliveryStrStock : function(){
            var url = _baseUrl + "goods/getTodayDeliveryStrStockAjax.do";
            
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(this.jsonParam),
                contentType: "application/json;charset=UTF-8",
                dataType : 'json',
                async: false,
                cache: false,
                success: mgoods.detail.todayDelivery._callBackDeliveryStrStock,
                error : function(e) {
                    console.log(e);
                    alert("죄송합니다. 고객센터에 문의해 주세요.");
                }
            });
        },
        
        // 오늘드림 고도화 2019-11-18 추가
        /** 당일배송 매장 재고 확인 **/
        // [START 재고 확인 후 팝업X, 현 페이지에서 메시지 노출 : utwon]
        deliveryStrStockOnPage : function(){
            var url = _baseUrl + "goods/getTodayDeliveryStrStockAjax.do";
            
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(this.jsonParam),
                contentType: "application/json;charset=UTF-8",
                dataType : 'json',
                async: false,
                cache: false,
                success: mgoods.detail.todayDelivery._callBackDeliveryStrStockOnPage,
                error : function(e) {
                    console.log(e);
                    alert("죄송합니다. 고객센터에 문의해 주세요.");
                }
            });
        },
        // [END 재고 확인 후 팝업X, 현 페이지에서 메시지 노출 : utwon]
        
        /** 재고부족 안내 닫기 * */
        outItemClose : function(){
            common.popLayerClose('LAYERPOP01');
            mgoods.detail.todayDelivery.todayDeliveryList();
        },
        
        /** 재고부족 안내 닫기 * */
        layerClose : function(){
            $('#quickAvalInvQty').val(0); // 오늘드림 재고 초기화
            mgoods.detail.todayDelivery.buyClickYn = 'N';
            common.popLayerClose('LAYERPOP01');
        },
        
        /** 배송지목록 닫기 * */
        todayDeliveryLayerClose : function(){
            //$('#quickAvalInvQty').val(999); // 오늘드림 재고 초기화
            common.popFullClose();
        },
        
        /** 주문 가능 수량 안내 * */
        openOrderQty : function(ordPsbQty){
            common.setScrollPos();
            $("#orderQty").find('.appInfo span').html(ordPsbQty);
            $("#layerPop").html($("#orderQty").html());
            common.popLayerOpen2("LAYERPOP01");
        },
        
        /** 주문 가능 수량 변경 * */
        updatrOrderQty : function(){
            // 단품인 경우에면 가능수량 변경 가능..(옵션은 대상 제외..)
            if ( $("#dupItemYn").val() != 'Y' ){
                
                common.popLayerClose('LAYERPOP01');

                var goodsNo = $("#goodsNo").val();
                var itemNo = $("#itemNo").val();
                var optionKey = goodsNo + itemNo;
                var selObj = $("div.prd_cnt_box.item_" + optionKey);
                var promNo = selObj.attr("promNo");
                mgoods.detail.cart.changeMsg(optionKey,promNo,'Y'); // 프로모션은 재선택이 필요함..초기화 처리

                // 전체 가격 = 전체 가격 - 이전값의 가격 + ( 바뀐 개수 * 가격 )
                /**
                 * ************************************** 수량변경 로직 변경
                 * ***************************************************
                 */
                
                // 장바구니 구매수량
                var cartCnt = Number($("#orderQty").find('.appInfo span').html());
                var quickMax = cartCnt;
                
                // 장바구니 구매수량 관련 Validation
                var check = mgoods.detail.cart.cartCheck(cartCnt, optionKey);
                
                // 정상적으로 체크가 되었을 경우
                if ( check == 'Y'){
                    
                    // 증가된 값 세팅
                    $("#cartCnt_" + optionKey).val(cartCnt);
                    
                    // 화면에 노출된 옵션 하위상품의 개수가 1개 이상일 경우
                    // 여러개중에 선택한 값만 증가되고, 총 개수만 증가됨
                    var totalCnt = Number(cartCnt);
                    
                    var totalPrc = Number(salePrc) * Number(totalCnt);

                    $("#totalPrc").val(totalPrc);
                    
                    $("#totalCnt").text(totalCnt);
                    $("#totalPrcTxt").text($.number(totalPrc));       
                    
                    // N+1 프로모션 안내 멘트 추가
                    mgoods.detail.cart.changeMsg(optionKey);
                }
                /**
                 * ************************************** 수량변경 로직 변경 끝
                 * ***************************************************
                 */
                
                
                // 전체 개수, 금액 세팅
                $("#cartCnt_"+optionKey).val(quickMax);
                $("#totalCnt").text(quickMax);
                $("#totalPrc").val(totalPrc);
                $("#totalPrcTxt").text($.number(totalPrc));
                
                // 장바구니는 옵션이 있으면 열리지만 옵션이 없으면 기본 1개로 장바구니 등록
                if ( $(".btn_basket").hasClass("dupItem") ){
                    
                    // 수량 입력, 옵션 창이 열려 있다면
                    if($(".prd_option_layer").css("display") == 'block'){
                        mgoods.detail.cart.checkRegCart("Y","NEW");
                    }else{
                        $('.prd_option_layer').show();
                        /* 선물하기 옵션관련 문구 추가 */
                        mgoods.detail.showPresentOptionText();
                        $('.opt_choice_area').css({'overflow-y':'scroll'});
                        $('.btn_layer').hide();
                    }
                    
                }else{
                    
                    // 프로모션이 있다면 옵션창 show/hide 체크
                    if( $("div.event_info[promno]").length > 0 ){
                        if ( $(".prd_option_layer").css("display") == 'block' ){
                            mgoods.detail.cart.checkRegCart("Y","NEW");
                        } else {
                            $('.prd_option_layer').show();
                            /* 선물하기 옵션관련 문구 추가 */
                            mgoods.detail.showPresentOptionText();
                            $('.opt_choice_area').css({'overflow-y':'scroll'});
                            $('.btn_layer').hide();
                        }
                    } else {
                        mgoods.detail.cart.checkRegCart("Y","NEW");
                    }
                }
            } 
        },
        
        /* 일반배송으로 주문 함수 jwkim */
        deliveryOrderReg : function(){
            // alert("준비중..!!");
            
            $("#deliveDay").attr("checked", false);
            $("#deliveNm").attr("checked", true);
            
            $("#normDispAmt").removeClass("off");
            $("#quickDispAmt").addClass("off");
            $("#normDlvInfo").removeClass("off");
            $("#quickDlvInfo").addClass("off");
            
            $("input[name=selectDlvYn]", $("#outItem")).val("Y");
            
            // 일반배송, 오늘드림 여부에 따른 화면제어
            mgoods.detail.todayDelivery.btnQuickYn();
            
            // 재고부족 레이어팝업 닫음
            mgoods.detail.todayDelivery.layerClose();
            
            // 일반주문으로 배송함
            setTimeout(function(){
                $(".btn_buy").click();
            }, 500);
        },
        
        // 오늘드림 고도화 2019-11-18 추가
        openDeliveryList : function() {
            $("#dlvr_list").show();
            return false;
        },
        
        // 오늘드림 고도화 2019-11-18 추가
        closeDeliveryList : function() {
            $("#dlvr_list").hide();
            mgoods.detail.dlvrListSelectedYn = 'N';
            return false;
        },
        
        /** 배송지 초기화 및 등록 * */
        _callBackRegistQuickMbrDlvpInfo : function(res){
            if(res != 'Y'){
                alert("죄송합니다. 고객센터에 문의해 주세요.");
            }
        },
        
        // 오늘드림 고도화 2019-11-18 추가
        /** 배송지 초기화 및 등록 (팝업 아닌 현재 페이지에서 진행, 배송지 등록 성공시 리스트 동기화) **/
        _callBackRegistQuickMbrDlvpInfoOnPage : function(res){
            if(res != 'Y'){
                alert("죄송합니다. 고객센터에 문의해 주세요.");
                return false;
            }else {
                mgoods.detail.todayDelivery.todayDeliveryListOnPage();
                
                return false;
            }
        },
        
        /** 당일 배송지 목록 콜백 * */
        _callBackTodayDeliveryList : function(res){
            var cDiv = $(res.trim());
            $("#todayDeliveryList").html(cDiv);
            mgoods.detail.todayDelivery.init();
            common.setScrollPos();
            
            $("#pop-full-wrap").html($("#todayDelivery").html());
            common.popFullOpen("배송지 추가");   
            
        },
        
        // 오늘드림 고도화 2019-11-18 추가
        /** 2019.11.18 배송지 목록 불러오기 콜백(페이지 상에 불러오기) **/
        _callBackTodayDeliveryListOnPage : function(res) {
            
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
            mgoods.detail.todayDelivery.init();
            
            $(".error_info").remove();
            $(".a_adrNew").remove();
            var addrHtml = '';
            
            $("#quickAvalInvQty").val("0");
            
            var todayDeliveryList = data.todayDeliveryList;
            var todayDeliveryLen = todayDeliveryList != undefined && todayDeliveryList != null ? todayDeliveryList.length : 0;
            if(todayDeliveryLen > 0) {
                $(".addr_newBox > dl").show();
                
                for(var index = 0; index < todayDeliveryLen; index++) {
                	var item = todayDeliveryList[index];
                	
                    if(item.baseDlvpYn != null && item.baseDlvpYn.indexOf('Y') > -1) {
                        mgoods.detail.baseStrNo = item.strNo;
                        mgoods.detail.baseMbrDlvpSeq = item.mbrDlvpSeq;
                    }
                    
                    var rmitPostNo = item.rmitPostNo != undefined && item.rmitPostNo != null ? item.rmitPostNo : "";
                    var emdNm = item.emdNm != undefined && item.emdNm != null ? item.emdNm : "";
                    var admrNm = item.admrNm != undefined && item.admrNm != null ? item.admrNm : "";
                    var postLen = rmitPostNo != undefined && rmitPostNo != null ? rmitPostNo.length : 0;
                    var todayDeliFlag = emdNm != "" && admrNm != "" && (postLen == 5) ? "Y" : "N";
                    
                    if(item.quickYn != null && item.quickYn.indexOf('Y') > -1) {
                        $(".addr_newBox").removeClass("error");
                        $(".addr_newBox > dl > dt").addClass("dt_dlvp").text(item.dlvpNm);
                        $(".dt_dlvp").attr("id", item.strNo);
                        $(".addr_newBox > dl > dd").remove();
                        
                        if(item.baseDlvpYn ==  'Y'){
                            $(".addr_newBox > dl").append("<dd>기본배송지</dd>");
                        }else{
                            $(".addr_newBox > dl > dd").remove();   
                        }
                        
                        $(".addr_newBox > p:not(.error_info)").text("도로명 : " + item.stnmRmitPostAddr + " " + item.stnmRmitDtlAddr);
                        
                        $(".a_adrChange").show();
                        $(".a_adrModify").hide();

                        if(item.strNo == null || item.strNo == 'NM' || todayDeliFlag == "N") {
                            $(".addr_newBox").addClass("error").append('<p class="error_info">선택하신 배송지는 일반 배송지역이에요</p>');
                            
                            mgoods.detail.validation = 'N';
                        }else {
                            if(item.ktmDestYn.indexOf('N') > -1){
                                $(".a_adrChange").hide();

                                $(".a_adrModify").show();
                                $(".addr_newBox").addClass("error").append('<p class="error_info">정확한 위치 정보를 찾을 수 없어요. 주소를 수정해주세요.</p>');
                                
                                mgoods.detail.validation = 'N';
                            }else{
                                mgoods.detail.validation = 'Y';
                                //mjhmmm
                                //MJH
                                $("input[name=mbrDlvpSeqColrChip]").val(item.mbrDlvpSeq);
//                                console.log($("input[name=mbrDlvpSeqColrChip]").val());
                                
                                mgoods.detail.optInfoListColrChip($("#previewInfo").val());
                                
                                mgoods.detail.todayDelivery.displayTodayDeliveryYnMessage(item.strNo, item.mbrDlvpSeq);
                                
                                // 빠름 평균배송시간
                                var dlvtmList = data.dlvtmList;
                                var dlvtmLen = dlvtmList == undefined ? 0 : dlvtmList.length;
                                
                                if(dlvtmLen > 0) {
                                	for(var i=0; i<dlvtmLen; i++) {
                                		var dlvtmObj = dlvtmList[i];
                                		var idx = i+1;
                                		
                                		if(dlvtmObj.rateRank == 1) {
                                			$(".quickUsrAddr").text(item.stnmRmitPostAddr);
                                        	$(".span_maxDeliPer").text(dlvtmObj.avgOrdRate + "%");
                                        	$(".span_dlvTitlNm").text(dlvtmObj.dlvTitlNm + " 내 ");
                                		
                                			$(".divPer").removeClass("imp");
                                			$("#divPer" + idx).addClass("imp");
                                		}
                                		
                            			$("#dtlNm" + idx).text(dlvtmObj.dlvDtlNm);
                            			$("#divPer" + idx).html(dlvtmObj.avgOrdRate + "%");
                                	}
                                	
                                	$(".liQuickAI").show();
                                }
                            }
                        }
                    }
                } 
            }else {
                $(".addr_newBox > dl").hide();
                $(".addr_newBox > p").text('상품을 받을 수 있는 주소를 추가해주세요!');
                $(".addr_newBox").append('<a href="javascript:common.zipcodequick.pop.deliveryRegistForm();" class="addr_btnGreen a_adrNew">배송지 추가</a>');
                
                mgoods.detail.validation = 'N';
            }
            
            $(".addr_newBox").show();
            mgoods.detail.todayDelivery.adrModfyEvnt();
        },
        getDlvpSeq : function(obj){
            return $(obj).parent().data();  
        },
        /** 기본배송지 선택 **/
        registBaseDelivery : function(obj){
            if (!common.loginChk()) {
                return ;
            }
            
            var obj = mgoods.detail.todayDelivery.getDlvpSeq(obj);
            mgoods.detail.modifySeq = obj.mbrDlvpSeq;
            _ajax.sendJSONRequest('GET'
                    ,_baseUrl + 'mypage/registBaseDeliveryJSON.do'
                    ,obj
                    ,mgoods.detail.todayDelivery.registBaseDeliveryCallback
                    ,false
            );  
        },
        /** 기본배송지 선택 후 닫기 **/
        registBaseDeliveryCallback : function(res) {
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
                    
            data.succeeded && alert(data.message); 
            
            mgoods.detail.todayDelivery.registTodayDeliverySelect();
        },
        /** 배송지 등록 후 당일 배송지 선택 콜백 * */
        _callBackRegistTodayDeliverySelect : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            if(data.todayDelivery.strNo == null || data.todayDelivery.strNo == ''){
                setTimeout(function() {
                    alert('오늘드림 서비스 지역이 아닙니다.');
                    return;
                }, 500);
            } else if(data.todayDelivery.hldyYn != null && data.todayDelivery.hldyYn == 'Y'){
                setTimeout(function() {
                    alert('오늘은 서비스가 불가능한 지역입니다.');
                    return;
                }, 500);
            } else {
                mgoods.detail.todayDelivery.registTodayDelivery(data.todayDelivery.strNo,data.todayDelivery.mbrDlvpSeq);
            }
        },
        
        // 오늘드림 고도화 2019-11-19 추가
        /** 배송지 등록 후 당일 배송지 선택 콜백 * */
        _callBackRegistTodayDeliverySelect2 : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            if(data.todayDelivery.strNo == null || data.todayDelivery.strNo == ''){
                setTimeout(function() {
                    alert('오늘드림 서비스 지역이 아닙니다.');
                    return;
                }, 500);
            } else if(data.todayDelivery.hldyYn != null && data.todayDelivery.hldyYn == 'Y'){
                setTimeout(function() {
                    alert('오늘은 서비스가 불가능한 지역입니다.');
                    return;
                }, 500);
            } else {
                mgoods.detail.todayDelivery.registQuickMbrDlvpInfoOnPage(data.todayDelivery.mbrDlvpSeq, data.todayDelivery.strNo);
            }
        },
        
        /** 당일배송 매장 재고 확인 * */
        _callBackDeliveryStrStock : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            var totalStkQty = 0;
            
            var tdsReturn = false; 
            var stockReturn = false;
            
            // [START 오늘드림 옵션상품 개선:jwkim]
            // 선택한 옵션상품 카운트 jwkim
            var goodsCnt = data.todayDeliveryStrStock.length;
            // 재고가 0인 모든 상품을  체크하기위한 카운트 jwkim
            var chkGoodsAllCnt = 0;
            // 본품 재고 채크 카운트 jwkim
            var chkGoodsCnt = 0;
            // 선택한 본품 수
            var goodsLng = 0;
            goodsLng = $(".prd_cnt_box").length;
            
            $.each(data.todayDeliveryStrStock, function (index, value) {
                
                // 본품이 재고가 0이면 사은품 재고가 존재하더라도 일반배송 로직 타게하려고 buy군만 카운트함
                if(value.stkQty == 0 && value.buyGetSctCd == "B"){
                    chkGoodsCnt++;
                }
                
                if(value.stkQty == 0){
                    chkGoodsAllCnt++;
                }
            });
            
            var orderStrNo = data.orderStrNo != undefined ? data.orderStrNo.strNo : "";
            $("#orderStrNo").val(orderStrNo);
            
            if(orderStrNo != "") {
            	var giftStockList = data.giftStockList;
            	mgoods.detail.todayDelivery.quickGiftStockInfo(giftStockList);
            }
            
        	var o2oDeliveryYn = data.o2oDeliveryYn;
        	var o2oMeshYn = "";
        	var o2oHldyYn = "";
        	
        	var deliveryInfoMap = data.o2oQuickValidationMap;
        	
        	if(deliveryInfoMap != undefined && deliveryInfoMap != null) {
        		o2oMeshYn = deliveryInfoMap.O2O_MESH_YN;
        		o2oHldyYn = deliveryInfoMap.HLDY_YN;
        	}
        	
        	if(o2oDeliveryYn != undefined && o2oDeliveryYn != null && o2oDeliveryYn == "N") {
        		$(".addr_newBox").addClass("error").append('<p class="error_info">선택하신 배송지는 일반 배송지역이에요.</p>');
        		$("#quickAvalInvQty").val("999");
        		
        		$(".a_adrChange").show();
        		mgoods.detail.validation = 'N';
        		return;
        	} else if((o2oMeshYn != undefined && o2oMeshYn != null && o2oMeshYn == "N") || 
        			(o2oHldyYn != undefined && o2oHldyYn != null && o2oHldyYn == "Y")) {
        		$(".addr_newBox").addClass("error").append('<p class="error_info">오늘은 서비스가 불가능한 지역입니다.</p>');
        		$("#quickAvalInvQty").val("999");
        		
        		$(".a_adrChange").show();
        		mgoods.detail.validation = 'N';
        	}
            
            // 선택한 Get상품은 재고가 있으나 본품이 재고가 없는경우 일반배송 로직 jwkim 
            if(goodsLng == chkGoodsCnt){
                common.setScrollPos();
                $("#layerPop").html($("#outItem").html());
                common.popLayerOpen2("LAYERPOP01");
                
                return false;
            // 본품 및 선택한  모든 Get상품의 재고가 없는경우 일반배송 로직
            } else if(goodsCnt == chkGoodsAllCnt){
                // TODO : 일반배송으로 주문 로직 추가 필요 영역
                
                common.setScrollPos();
                $("#layerPop").html($("#outItem").html());
                common.popLayerOpen2("LAYERPOP01");
                
                return false;
                
            } else {
                $.each(data.todayDeliveryStrStock, function (index, value) {
                    var cartCnt = $("#cartCnt_"+value.goodsNo+value.itemNo).val();
                    
                    if(value.crssPrstNo != null && value.crssPrstNo != '' && chkGoodsCnt < 1){
                        var ordqty = $("div.event_info").find("#"+value.goodsNo+value.itemNo).attr('ordqty');
                        
                        if(ordqty > value.stkQty){
                            var goodsNmArr = $("div.event_info").find("#"+value.goodsNo+value.itemNo).parent().html().split('<span');
                            
                            if(!tdsReturn){
                                alert('['+goodsNmArr[0]+'] 상품 재고가 '+value.stkQty+'개 남았습니다. 재선택 바랍니다.');
                                stockReturn = true; 
                            }
                            return false;
                            
                        }
                        
                        $("#quickAvalInvQty").val(value.stkQty);
                    } else {
                        //  옵션이 있는 상품이라면
                        if ( $("#dupItemYn").val() == 'Y' && value.buyGetSctCd == "B"){
                            $('#itemLgcGoodsNo_'+value.lgcGoodsNo).parent().find("input[id^='quickItemInv_']").val(value.stkQty);
                            
                            // 선택한 상품 영역
                            
                            // 20190312 추가 요건 오늘드림 옵션 상품이 존재하는 경우 
                            // ####### 부분주문이 가능한경우 상품 수량 셋팅 #######
                            // 매장 재고가 선택한 재고보다 작은경우 매장재고를 선택제고에 셋팅하는 로직 추가
                            // [START 오늘드림 옵션상품 개선:jwkim]
                            var optionKey = value.goodsNo+value.itemNo;
                            var prdWrap = $(".prd_cnt_box.item_"+optionKey);
                            var price = Number($("#itemSalePrc_"+optionKey).val().replace(/\,/g,''));
                            var totalCnt = $("#totalCnt").val();
                            
                            // 매장재고 0인경우
                            if(value.stkQty == 0){
                                
                                mgoods.detail.cart.deleteItem(optionKey, price);
                                
                                tdsReturn = true; 
                            // 선택한 수량보다 매장재고가 적은경우
                            } else if(cartCnt > value.stkQty){
                                
                                var minuCnt = cartCnt - value.stkQty
                                mgoods.detail.cart.prevVal(optionKey, price , minuCnt);
                                
                                tdsReturn = true; 
                            }
                            // [END 오늘드림 옵션상품 개선:jwkim]
                        } else if(value.buyGetSctCd != "G") {
                            $("#quickAvalInvQty").val(value.stkQty);
                        }
                        totalStkQty = totalStkQty+value.stkQty;
                    }
                    
                });
            }
            
            // 부분주문이 가능한경우 상품 수량 셋팅
            if(tdsReturn && !stockReturn){
                alert("선택한 상품의 재고가 충분하지 않아\n일부 수량만 주문이 가능합니다.\n주문 가능 수량으로 자동 설정됩니다.");
                
                $("div.event_info").each(function(){
                    var optionKey = $(this).attr("goodsNo") + $(this).attr("itemNo");
                    var promNo = $(this).attr("promNo");
                    var promKndCd = $(this).attr("promKndCd");
                    // 프로모션정보 GET상품을 초기화
                    mgoods.detail.cart.changeMsg(optionKey, promNo, "Y");
                    
                    if(promKndCd != "P203"){
                        mgoods.detail.cart.changeMsg(optionKey, promNo);
                    }
                });
                
                return;
            } else if(stockReturn){
                return;
            }            
            
            if(totalStkQty == 0 && (!tdsReturn && !stockReturn)){
                common.setScrollPos();
                $("#layerPop").html($("#outItem").html());
                common.popLayerOpen2("LAYERPOP01");
                return;
            }
            // [END 오늘드림 옵션상품 개선:jwkim]
            
            mgoods.detail.todayDelivery.buyClickYn = 'Y';
            
            // 장바구니는 옵션이 있으면 열리지만 옵션이 없으면 기본 1개로 장바구니 등록
            if ( $(".btn_basket").hasClass("dupItem") ){
                
                // 수량 입력, 옵션 창이 열려 있다면
                if($(".prd_option_layer").css("display") == 'block'){
                    mgoods.detail.cart.checkRegCart("Y","NEW");
                }else{
                    $('.prd_option_layer').show();
                    $('.opt_choice_area').css({'overflow-y':'scroll'});
                    $('.btn_layer').hide();
                }
                
            }else{
                
                // 프로모션이 있다면 옵션창 show/hide 체크
                if( $("div.event_info[promno]").length > 0 ){
                    if ( $(".prd_option_layer").css("display") == 'block' ){
                        mgoods.detail.cart.checkRegCart("Y","NEW");
                    } else {
                        $('.prd_option_layer').show();
                        $('.opt_choice_area').css({'overflow-y':'scroll'});
                        $('.btn_layer').hide();
                    }
                } else {
                    mgoods.detail.cart.checkRegCart("Y","NEW");
                }
            }
            
        },
        
        // 오늘드림 고도화 2019-11-18 추가
        /** 당일배송 매장 재고 확인 **/
        // [START 재고 확인 후 팝업X, 현 페이지에서 메시지 노출 : utwon]
        _callBackDeliveryStrStockOnPage : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            var totalStkQty = 0;
            
            var tdsReturn = false; 
            
            var stockReturn = false;
            
            // 선택한 옵션상품 카운트 jwkim
            var goodsCnt = data.todayDeliveryStrStock.length;
            // 재고가 0인 모든 상품을  체크하기위한 카운트 jwkim
            var chkGoodsAllCnt = 0;
            // 본품 재고 채크 카운트 jwkim
            var chkGoodsCnt = 0;
            // 선택한 본품 수
            var goodsLng = 0;
            goodsLng = $(".prd_cnt_box").length;
            
            // [START 오늘드림 옵션상품 개선:jwkim]
            $.each(data.todayDeliveryStrStock, function (index, value) {
                var opKey = value.goodsNo + value.itemNo;
                
                if(value.stkQty == 0 && value.buyGetSctCd == "B"){
                    chkGoodsCnt++;
                }
                
                if(value.stkQty == 0){
                    chkGoodsAllCnt++;
                }
            });
            
            var orderStrNo = data.orderStrNo != undefined ? data.orderStrNo.strNo : "";
            $("#orderStrNo").val(orderStrNo);
            
            if(orderStrNo != "") {
            	var giftStockList = data.giftStockList;
            	mgoods.detail.todayDelivery.quickGiftStockInfo(giftStockList);
            }
            
            var o2oDeliveryYn = data.o2oDeliveryYn;
        	var o2oMeshYn = "";
        	var o2oHldyYn = "";
        	
        	var deliveryInfoMap = data.o2oQuickValidationMap;
        	
        	if(deliveryInfoMap != undefined && deliveryInfoMap != null) {
        		o2oMeshYn = deliveryInfoMap.O2O_MESH_YN;
        		o2oHldyYn = deliveryInfoMap.HLDY_YN;
        	}
        	
        	if(o2oDeliveryYn != undefined && o2oDeliveryYn != null && o2oDeliveryYn == "N") {
        		$(".addr_newBox").addClass("error").append('<p class="error_info">선택하신 배송지는 일반 배송지역이에요.</p>');
        		$("#quickAvalInvQty").val("999");
        		
        		$(".a_adrChange").show();
        		mgoods.detail.validation = 'N';
        		return;
        	} else if((o2oMeshYn != undefined && o2oMeshYn != null && o2oMeshYn == "N") || 
        			(o2oHldyYn != undefined && o2oHldyYn != null && o2oHldyYn == "Y")) {
        		$(".addr_newBox").addClass("error").append('<p class="error_info">오늘은 서비스가 불가능한 지역입니다.</p>');
        		$("#quickAvalInvQty").val("999");
        		
        		$(".a_adrChange").show();
        		mgoods.detail.validation = 'N';
        	}
            
            // 선택한 Get상품은 재고가 있으나 본품이 재고가 없는경우 일반배송 로직 jwkim 
            if(goodsLng == chkGoodsCnt){
                
                common.setScrollPos();
                $(".addr_newBox").addClass("error").append('<p class="error_info">현재 매장에 오늘드림 상품 재고가 부족해요</p>');
                
                $(".btn_basket").hide();
                $(".btn_buy").hide();
                $(".btn_soldout").show();
                $(".buy_button_area").addClass("soldout"); // 품절 클래스 추가
                
                mgoods.detail.validation = 'N';
                
                return false;
            // 본품 및 선택한  모든 Get상품의 재고가 없는경우 일반배송 로직
            } else if(goodsCnt == chkGoodsAllCnt){
                
                common.setScrollPos();
                $(".addr_newBox").addClass("error").append('<p class="error_info">현재 매장에 오늘드림 상품 재고가 부족해요</p>'); 
                
                $(".btn_basket").hide();
                $(".btn_buy").hide();
                $(".btn_soldout").show();
                $(".buy_button_area").addClass("soldout"); // 품절 클래스 추가
                
                mgoods.detail.validation = 'N';
                
                return false;
            } else {
                
                $.each(data.todayDeliveryStrStock, function (index, value) {
                    
                    var cartCnt = $("#cartCnt_"+value.goodsNo+value.itemNo).val();
                    
                    if(value.crssPrstNo != null && value.crssPrstNo != '' && chkGoodsCnt < 1){
                        var ordqty = $("div.event_info").find("#"+value.goodsNo+value.itemNo).attr('ordqty');
                        
                        if(ordqty > value.stkQty){
                            var goodsNmArr = $("div.event_info").find("#"+value.goodsNo+value.itemNo).parent().html().split('<span');
                            
                            if(!tdsReturn){
                                alert('['+goodsNmArr[0]+'] 상품 재고가 '+value.stkQty+'개 남았습니다. 재선택 바랍니다.');
                                stockReturn = true;
                            }
                            
                            // 2019-11-12
                            $(".addr_newBox").addClass("error").append('<p class="error_info">현재 매장에 오늘드림 상품 재고가 부족해요</p>'); 
                            
                            $(".btn_basket").hide();
                            $(".btn_buy").hide();
                            $(".btn_soldout").show();
                            $(".buy_button_area").addClass("soldout"); // 품절 클래스 추가
                            
                            mgoods.detail.validation = 'N';
                             
                            return false;
                            
                        }
                        
                        $("#quickAvalInvQty").val(value.stkQty);
                    } else {
                        //  옵션이 있는 상품이라면
                        
                        if ( $("#dupItemYn").val() == 'Y' && value.buyGetSctCd == "B"){
                            $('#itemLgcGoodsNo_'+value.lgcGoodsNo).parent().find("input[id^='quickItemInv_']").val(value.stkQty);
                                                        
                            // 20190312 추가 요건 오늘드림 옵션 상품이 존재하는 경우 
                            // ####### 부분주문이 가능한경우 상품 수량 셋팅 #######
                            // 매장 재고가 선택한 재고보다 작은경우 매장재고를 선택제고에 셋팅하는 로직 추가
                            // [START 오늘드림 옵션상품 개선:jwkim]
                            var optionKey = value.goodsNo+value.itemNo;
                            var prdWrap = $(".prd_cnt_box.item_"+optionKey);
                            var price = Number($("#itemSalePrc_"+optionKey).val().replace(/\,/g,''));
                            var totalCnt = $("#totalCnt").val();
                            
                            // 매장재고 0인경우
                            if(value.stkQty == 0){
                                
                                mgoods.detail.cart.deleteItem(optionKey, price);
                                
                                tdsReturn = true; 
                                
                            // 선택한 수량보다 매장재고가 적은경우
                            } else if(cartCnt > value.stkQty){
                                var minuCnt = cartCnt - value.stkQty
                                
                                mgoods.detail.cart.prevVal(optionKey, price , minuCnt);
                                
                                tdsReturn = true; 
                                
                            }
                            // [END 오늘드림 옵션상품 개선:jwkim]
                        } else if(value.buyGetSctCd != "G") {
                            $("#quickAvalInvQty").val(value.stkQty);
                        }
                        totalStkQty = totalStkQty+value.stkQty;
                    }
                    
                });
            }
            
            // 부분주문이 가능한경우 상품 수량 셋팅
            if(tdsReturn && !stockReturn){
                //alert("선택된 옵션의 재고가 충분하지 않아\n부분적으로 주문이 가능합니다.\n주문 가능한 수량을 자동 세팅하여\n이전 단계로 이동합니다");
                alert("선택한 상품의 재고가 충분하지 않아\n일부 수량만 주문이 가능합니다.\n주문 가능 수량으로 자동 설정됩니다.");
                
                // 옵션 경우 초기화할 옵션 정보 세로 셋팅
                $("div.prd_gift_box").each(function(){
                    var optionKey = $(this).attr("goodsNo") + $(this).attr("itemNo");
                    var promNo = $(this).attr("promNo");
                    var promKndCd = $(this).attr("promKndCd");
                    
                    mgoods.detail.cart.changeMsg(optionKey, promNo, "Y");
                    
                    if(promKndCd != "P203"){
                        mgoods.detail.cart.changeMsg(optionKey, promNo);
                    }
                    
                });
                
                // 2019-11-12
                mgoods.detail.validation = 'Y';
                
                return;
            } else if(stockReturn){
                // 2019-11-12
                $(".addr_newBox").addClass("error").append('<p class="error_info">현재 매장에 오늘드림 상품 재고가 부족해요</p>'); 
                
                $(".btn_basket").hide();
                $(".btn_buy").hide();
                $(".btn_soldout").show();
                $(".buy_button_area").addClass("soldout"); // 품절 클래스 추가
                
                mgoods.detail.validation = 'N';
                
                return;
            } else {
                if($("#soldOutYn").val() == 'Y') {
                    $(".btn_basket").show();
                    $(".btn_buy").show();
                    $(".btn_soldout").hide();
                    $(".buy_button_area").removeClass("soldout"); // 품절 클래스 삭제
                }
            }
            
            if(totalStkQty == 0 && (!tdsReturn && !stockReturn)){
                common.setScrollPos();
                
                $(".addr_newBox").addClass("error").append('<p class="error_info">현재 매장에 오늘드림 상품 재고가 부족해요</p>'); 
                
                $(".btn_basket").hide();
                $(".btn_buy").hide();
                $(".btn_soldout").show();
                $(".buy_button_area").addClass("soldout"); // 품절 클래스 추가
                
                mgoods.detail.validation = 'N';
                return;
            }
            // [END 오늘드림 옵션상품 개선:jwkim]
            
            // 장바구니는 옵션이 있으면 열리지만 옵션이 없으면 기본 1개로 장바구니 등록
            if ( $(".btn_basket").hasClass("dupItem") ){
                
                // 수량 입력, 옵션 창이 열려 있다면
                if($(".prd_option_layer").css("display") == 'block'){
                    mgoods.detail.cart.checkRegCart2("Y","NEW");
                }else{
                    $('.prd_option_layer').show();
                    $('.opt_choice_area').css({'overflow-y':'scroll'});
                    $('.btn_layer').hide();
                }
                
            }else{
                
                // 프로모션이 있다면 옵션창 show/hide 체크
                if( $("div.event_info[promno]").length > 0 ){
                    if ( $(".prd_option_layer").css("display") == 'block' ){
                        mgoods.detail.cart.checkRegCart2("Y","NEW");
                    } else {
                        $('.prd_option_layer').show();
                        $('.opt_choice_area').css({'overflow-y':'scroll'});
                        $('.btn_layer').hide();
                    }
                } else {
                    mgoods.detail.cart.checkRegCart2("Y","NEW");
                }
            }
        },
        // [END 재고 확인 후 팝업X, 현 페이지에서 메시지 노출 : utwon]
        openTodayDeliveryStockAlarmPop : function(goodsNo, itemNo, lgcGoodsNo) {
            var strNo = $(".dt_dlvp").attr("id");
            var isAvailbleStore = true;	//매장취급여부
            
            if(strNo == undefined || strNo == "" || strNo == null || strNo == "NM") {
                alert("매장 재입고 신청이 불가능한 배송지입니다. 다른 배송지를 선택해 주세요.");
                return;
            }
            
            //[3354738] 상품 상세 재입고 알람 신청시  매장취급여부 판단 |2020.09.15 | by jp1020
            if(lgcGoodsNo != undefined || lgcGoodsNo != "" || lgcGoodsNo != null) {
            	isAvailbleStore = mgoods.detail.offstore.getAvailableStore(strNo, lgcGoodsNo);
            	console.log("isAvailbleStore Result : " + isAvailbleStore);
            }
            
            if(!isAvailbleStore){
            	alert("해당 상품 미운영 매장입니다.");
            	return;
            }
            
            common.openStockOffStoreAlimPop(goodsNo, itemNo, strNo);
        },
        deliveryCharge : function() {
           var totalPrcTxt = Number($("#totalPrcTxt").text().replace(/,/g, ""));
           if(totalPrcTxt >= Number(dlexFvrStdAmt)) {
               $("#quickDispAmt").find("strong").text("무료배송");
           } else {
               $("#quickDispAmt").find("strong").text(quickDlexTxt);
           }
        },
        /** 오늘드림 빠름 평균 배송시간 **/
        quickBaseAddrInfo : function() {
        	var baseAddrInfo = $(".span_baseAddrInfo");
        	
        	if(baseAddrInfo.length > 0) {
        		var titlAvgOrdRate = baseAddrInfo.eq(0).find(".span_baseAvgOrdRate").text();
        		
        		if(titlAvgOrdRate != undefined && titlAvgOrdRate != null && titlAvgOrdRate != "") {
            		for(var i=0; i<baseAddrInfo.length; i++) {
            			var dlvtmObj = baseAddrInfo.eq(i);
            			var stnmRmitPostAddr = dlvtmObj.find(".span_baseStnmRmitPostAddr").text();
            			var avgOrdRate = dlvtmObj.find(".span_baseAvgOrdRate").text();
            			var dlvTitlNm = dlvtmObj.find(".span_baseDlvTitlNm").text();
            			var dlvDtlNm = dlvtmObj.find(".span_baseDlvDtlNm").text();
            			var rateRank = dlvtmObj.find(".span_baseRateRank").text();
            			var idx = i+1;
            			
            			if(rateRank == "1") {
            				$(".quickUsrAddr").text(stnmRmitPostAddr);
            				$(".span_maxDeliPer").text(avgOrdRate + "%");
            				$(".span_dlvTitlNm").text(dlvTitlNm + " 내 ");
            				
            				$(".divPer").removeClass("imp");
                			$("#divPer" + idx).addClass("imp");
            			}
            			
            			$("#dtlNm" + idx).text(dlvDtlNm);
            			$("#divPer" + idx).html(avgOrdRate + "%");
            		}
            		
            		$(".liQuickAI").show();
            	} else {
            		$(".liQuickAI").hide();
            	}
        	} else {
        		$(".liQuickAI").hide();
        	}
        },
        /** 오늘드림 넛지 **/
        quickNudge : function() {
        	if(quickAddrYn == "Y") {
        		mgoods.detail.interval = setInterval(function() {
        			var cookie = new Cookie();
        			var hideCookie = cookie.get("todayNudgeHideMO");
        			
        			if(hideCookie == "Y") {
        				clearInterval(mgoods.detail.interval);
        				return;
        			}
        			
        			var sysDate = new Date();
	        		var to_hours = sysDate.getHours() + "";
	        		var to_minutes = sysDate.getMinutes() + "";
	        		var to_seconds = sysDate.getSeconds() + "";
	        		
	        		if(to_minutes < 10) {
	        			to_minutes = "0" + to_minutes;
	        		}
	        		
	        		if(to_seconds < 10) {
	        			to_seconds = "0" + to_seconds;
	        		}
	        		
	        		var to_time = Number(to_hours + to_minutes + to_seconds);
	        		var sectLen = timeSectList == null || timeSectList == undefined ? 0 : timeSectList.length;
	        		
	        		if(sectLen > 0) {
	        			var showFlag = false;
	        			for(var i=0; i<sectLen; i++) {
	        				var obj = timeSectList[i];
	        				var timeSect = obj.mrkNm;
	        				var fromTime = Number(timeSect.split("/")[0]);
	        				var toTime = Number(timeSect.split("/")[1]);
	        				var timeMsg = obj.timeMsg;
	        				var countHour = obj.countHour;
	        				
	        				if(to_time >= fromTime && to_time <= toTime) {
	        					showFlag = true;
	        					if(countHour != "") {
	        						mgoods.detail.todayDelivery.setTime(sysDate, countHour, timeMsg);
	        					} else {
	        						if(timeMsg != "") {
	        							$(".nudge_txt").html(timeMsg);
	        							$(".today_nudge").css("min-width", "114px");
	        						} else {
	        							showFlag = false;
	        						}
	        					}
	        				}
	        			}
	        			
	        			if(showFlag) {
        					setTimeout(function() {
        						if(!$(".prd_option_layer").is(":visible")) {
        							$(".today_nudge:not(.nudge_hide)").animate({top:"-47px"}, "fast").addClass("nudge_show").show();
        						}
        					}, 2000);
        					
        					setTimeout(function() {
        						$(".today_nudge").fadeOut(400, function() {
        							$(".today_nudge").remove();
        							clearInterval(mgoods.detail.interval);
        						});
        					}, 5000);
        				} else {
        					$(".today_nudge").removeClass("nudge_show").fadeOut();
        				}
	        		}
        		}, 1000);
        		
        		$("#btn_nudgeHide").click(function() {
        			var nudgeCookie = new Cookie(1);
        			nudgeCookie.set("todayNudgeHideMO", "Y");
        			
        			$(".today_nudge").fadeOut(400, function() {
						$(".today_nudge").remove();
						clearInterval(mgoods.detail.interval);
					});
        		});
        	}
        },
        setTime : function(sysDate, countHour, timeMsg) {
        	var year = sysDate.getFullYear();
    		var month = sysDate.getMonth() + 1;
    		
    		if(month < 10) {
    			month = "0" + month;
    		}
    		
    		var day = sysDate.getDate();
    		
    		var _second = 1000;
    		var _minute = _second * 60;
    		var _hour = _minute * 60;
    		var _day = _hour * 24;
    		
        	var countDate = new Date(year + "/" + month + "/" +day + " " + countHour +":00:00");
    		var distance = countDate - sysDate;
    		
    		var minutes = Math.floor((distance % _hour) / _minute);
    		var seconds = Math.floor((distance % _minute) / _second);
    		
    		var hourmsg = "<strong class=\"impY\">";
    		if(minutes > 0) {
				hourmsg += "<span>" + minutes + "</span>" + "분 ";
				$(".today_nudge").css("min-width", "142px");
			} else {
				$(".today_nudge").css("min-width", "initial");
			}
    		
    		hourmsg += "<span>" + seconds + "</span>" + "초</strong>";
    		
    		timeMsg = timeMsg.replace("*", hourmsg);
    		
    		$(".nudge_txt").html(timeMsg);
        },
        quickGiftStockInfo : function(giftStockList) {
           	var vQuickMoreCnt = Number($("#h_quickGift_count").val()); //오늗드림 더보기 카운트
        	var vH_first_quickGift= $("#h_first_quickGift").val();        	
        	var giftStockLen = giftStockList != undefined && giftStockList != null ? giftStockList.length : 0;
        	if(giftStockLen > 0) {
	        	for(var i=0; i<giftStockLen; i++) {
	        		var obj = giftStockList[i];
        			if(Number(obj.stockQty) <= 0) {
        				$("#quickgift_1_" + obj.gftCd).addClass("soldout");
        				$("#quickgift_2_" + obj.gftCd).text("[오늘드림/소진완료]");
        				$("#quickgift_3_" + obj.gftCd).addClass("soldout");
        				$("#quickgift_4_" + obj.gftCd).text("[오늘드림/소진완료]");
        				$("#quickgift_5_" + obj.gftCd).addClass("soldout");
        				$("#quickgift_6_" + obj.gftCd).addClass("soldout");
        				vQuickMoreCnt = vQuickMoreCnt -1;
        			} else {
        				$("#quickgift_1_" + obj.gftCd).removeClass("soldout");
        				$("#quickgift_2_" + obj.gftCd).text("[오늘드림]");
        				$("#quickgift_3_" + obj.gftCd).removeClass("soldout");
        				$("#quickgift_4_" + obj.gftCd).text("[오늘드림]");
        				$("#quickgift_5_" + obj.gftCd).removeClass("soldout") ;
        				$("#quickgift_6_" + obj.gftCd).removeClass("soldout") ;
        				
	        		}
	        	}

        	}
        	if(vQuickMoreCnt -1 >= 1){ 
        		$("#quickGift_more").text("+"+(vQuickMoreCnt-1)+"개 더보기");
        	}else{
        		$("#quickGift_more").text("더보기");
        	}        	
        }
};

// 설정하기
function setMyLoc() { 
    if(common.app.appInfo.isapp){
        location.href = "oliveyoungapp://getLocationSettings";
    }else{
        loadYn = "N";
        loadYn2 = "N";
        localStorage.setItem("useLoc", "Y");
        $('#pop-full-wrap').find('#mTab').find('a').eq(0).click();
    }
}
/* 주변 매장 없을 때 */
function stores_nofind(){
    var w_height = $(window).height(),
        popHeader = $('.popHeader').outerHeight(),
        inBox8 = $('.popCont > .inBox8').outerHeight(),
        mTab = $('#mTab').outerHeight(),
        cont_height = w_height - (popHeader+inBox8+mTab),
        no_stores = $('.no_stores_div'),
        no_stores_td = $('.no_stores_div > .no_stores').find('.txt'),
        notice_list = $('.inBox2.notice_list'),
        stores_list = $('.stores_list');
        
    notice_list.hide();
    stores_list.hide();
    no_stores_td.css('height', cont_height);
    no_stores.addClass('on');           
}

/* 주변 매장 있을 때 */
function stores_find(){
    var no_stores = $('.no_stores_div'),
    notice_list = $('.inBox2.notice_list'),
    stores_list = $('.stores_list');
    
    notice_list.show();
    stores_list.show();
}

function onSuccessGeolocation(position) {
   
   mgoods.detail.offstore.geoFlag = 'Y';
   
    localStorage.setItem("useLoc", "Y");
    
    lat = "37.4900806";
    lon = "127.0193972";    
    
    if (position != '' && position.coords.latitude > 0 && position.coords.longitude > 0) {
        lat = position.coords.latitude;// 위도
        lon = position.coords.longitude;// 경도
    }
   
    $("#usrLat").val(lat);
    $("#usrLng").val(lon);
    PagingCaller.destroy();
    
    if ( $("#pop-full-wrap").find("#mTab").find("li").eq(0).find("a").hasClass("on") ){
        mgoods.detail.offstore.getNearStoreListPaging(); 
        $(".showNearDiv").show();
    }else {
        mgoods.detail.offstore.getMyStoreList();
    }
    
}
 

  function onErrorGeolocation(error) {
      
      mgoods.detail.offstore.geoFlag = 'N';
        localStorage.setItem("useLoc", "N"); 
        
        if ( $("#pop-full-wrap").find("#mTab").find("li").eq(0).find("a").hasClass("on") ){
            mgoods.detail.offstore.getNearStoreListPaging(); 
        }else {
            mgoods.detail.offstore.getMyStoreList();
        }
  }

  function onSuccessGeolocationApp() {
      localStorage.setItem("useLoc", "Y");
      startGeoLcation(); 
}
  
  function onErrorGeolocationApp(error) {
     if(loadYn == "N"){// 매장 호출 안했을 경우에만 호출하도록 설정. geo가 뭐때문인지 error 상황이면 자꾸
                        // 재귀호출함 ㅠㅠ..
          loadYn = "Y";
            // 무조건 나는 에러임. 무시가능 error.code:'+error.code);
          if(common.app.appInfo.isapp){
              location.href = "oliveyoungapp://getLocationSettings";
          }else{
              if(error.code == 1){// 권한없음
                  if(confirm("올리브영이(가) 이 기기의 위치정보에 접근(를) 할 수 있도록 허용하시겠습니까?")){
                      localStorage.setItem("useLoc", "Y");
                  }else{
                      localStorage.setItem("useLoc", "N");
                  }
              }else if(error.code == 3){// timeout
                  localStorage.setItem("useLoc", "Y");
              }else{
              }
              startGeoLcation(); 
          }
      }
  }
  
// ‘퍼미션 허용여부’(Y/N), ‘GPS 허용여부'(Y/N)
  function setLocationSettings(permissionYn, gpsYn) {
      if(permissionYn == "Y" && gpsYn == "Y"){
          localStorage.setItem("useLoc", "Y");
      }
      startGeoLcation();          
  }  
  
// ‘퍼미션 허용여부’(Y/N), ‘GPS 허용여부'(Y/N)
  function startGeoLcation() {
      var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;
      if(useLoc){// 위치정보 허용
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation, {timeout: 10000});
          } else {
              alert("사용자의 브라우저는 지오로케이션을 지원하지 않습니다");
              
              mgoods.detail.offstore.geoFlag = 'N';
              
              if ( $("#pop-full-wrap").find("#mTab").find("li").eq(0).find("a").hasClass("on") ){
                  mgoods.detail.offstore.getNearStoreListPaging(); 
                  $(".showNearDiv").show();
              }else {
                  mgoods.detail.offstore.getMyStoreList();
              }
              
          } 
      }else{
          
          mgoods.detail.offstore.geoFlag = 'N';
          
          if ( $("#pop-full-wrap").find("#mTab").find("li").eq(0).find("a").hasClass("on") ){
              mgoods.detail.offstore.getNearStoreListPaging(); 
              $(".showNearDiv").show();
          }else {
              mgoods.detail.offstore.getMyStoreList();
          }
      }
  }
  $(".btn_coupon_down").click(function(){
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
  
  
//상품 상세 높이 수정
	function zoomSet_h_goodjs(){
	    var _tContsWrap = $('#tabContsWrap'),
	    	_tContWrapper = _tContsWrap.children('.tab-wrapper'),
	    	_tContInxs = _tContWrapper.children('.swiper-slide-active').attr('data-menu-index');
	    	_tContActive_h = _tContWrapper.children('.swiper-slide-active').height();
	    	_tContWrapper_h = _tContWrapper.height(),
	    	_zoomHolder = $('.zoomHolder'),
	    	_zoomHolder_h = _zoomHolder.height(),
	    	_th = _tContWrapper_h+_zoomHolder_h;
	    	
	    /* console.log(_tContWrapper_h);
	    console.log(_zoomHolder_h);
	    console.log(_th);
	    console.log(_tContInxs); */
	    if(_tContInxs == 1){
	        _tContWrapper.css('height', _th);    
	    }else{
	        _tContWrapper.css('height', _tContActive_h);
	    }
	    					    
	}
