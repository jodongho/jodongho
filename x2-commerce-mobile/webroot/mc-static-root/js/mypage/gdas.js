$.namespace('mmypage.gdasList');
mmypage.gdasList = {
    serializeData : '',

    init : function() {
    	// 2019.11.25 오프라인리뷰관련추가
    	localStorage.setItem("lastCheckDtime", new Date().format('yyyy-MM-dd HH:mm:ss'));
    	
//        this.completeAreaShow();

        $('#go-back').click(function() {
            history.back();
        });
        //as-is 탑리뷰어_lsy_Start
//        $('#search-month')
//                .change(
//                        function() {
//                            $(location).attr(
//                                    'href',
//                                    _baseUrl + 'mypage/getGdasList.do?searchMonth='
//                                            + $('#search-month option:selected').val());
//                        });
//
        //탑리뷰어_lsy_End
        ScrollPager.init({
            bottomScroll : 700,
            callback : mmypage.gdasList.callbackReturn(mmypage.gdasList.getTabId())
        });
    },

    setSerializeData : function(obj) {
        this.serializeData = '';

        if (arguments.length < 1 || typeof obj == 'undefined')
            return;

        this.serializeData = $.param($(obj).data());
    },

    getTabId : function() {
        return $('#mTab').find('li').filter(function() {
            return $(this).hasClass('on')
        }).find('a').attr('id');
    },

    getHideAreaId : function(clickedId) {
        return $('#' + clickedId).parent().siblings().find('a').attr('id');
    },
/****탑리뷰어_lsy_Start***/
   /* completeAreaShow : function() {
        if (!SEARCH_MONTH)
            return;

       $('#search-month').val(SEARCH_MONTH); 

        $('#complete').click();
    },*/
/***탑리뷰어_lsy_End***/
    tabToggler : function(obj) {
        
        if (obj.id == this.getTabId())
            return;

        
        this.tabRevitalizer(obj);

        this.pagerInit();

        this.contentsAreaInit(obj);
        
        // [3363877] 온라인몰 모바일 마이페이지 DS 수정 요청(CHY)
        if(obj.id == 'possible') {
        	common.wlog("mypage_gdas_writelist");
            sessionStorage.setItem('gdasTabId', 0);
        } else {
        	common.wlog("mypage_gdaslist");
            sessionStorage.setItem('gdasTabId', 1);
        }
        
        // [3320682] 온라인몰 마이페이지 UX 개선 - 올영체험단에서 리뷰로 넘어 올 때 GET 방식의 파라메터가 유지되지 않게 하기 위함(CHY)
        history.replaceState({}, null, location.pathname);
    },

    tabRevitalizer : function(obj) {
        $(obj).parent().addClass('on').attr('title', '현재 선택된 메뉴').siblings().removeClass('on').removeAttr('title');
        $('#' + obj.id + '-area').removeClass('hide');
        $('#' + this.getHideAreaId(obj.id) + '-area').addClass('hide');
    },

    callbackReturn : function(param) {
        var callback = {
            possible : mmypage.gdasList.getGdasListJSON,
            complete : mmypage.gdasList.getGdasCompleteListJSON
        }
        return callback[param];
    },

    pagerInit : function() {
        ScrollPager.init({
            callback : mmypage.gdasList.callbackReturn(mmypage.gdasList.getTabId())
        });
    },

    contentsAreaInit : function(obj) {
        $('#' + this.getHideAreaId(obj.id) + '-list').find('li').filter(function() {
            return $(this).data('default') != 'Y'
        }).remove();
    },

    getGdasListJSON : function() {
    	
    	//SR 3358020 shlee S
    	if(sessionStorage.getItem('getGdasListJSON_E')=='Y'){
    		return;
    	}
    	
    	var idx = ScrollPager.nextPageIndex();
    	if(sessionStorage.getItem('getGdasListJSON_idx') != null && ScrollPager.nextPageIndex() != sessionStorage.getItem('getGdasListJSON_idx')){
        	idx = parseInt(sessionStorage.getItem('getGdasListJSON_idx')) + 1;
    	}else if(idx == 2 && sessionStorage.getItem('getGdasListJSON_idx') == 2){
    		idx = parseInt(sessionStorage.getItem('getGdasListJSON_idx')) + 1;
    	}
    	//SR 3358020 shlee E
        common.Ajax.sendJSONRequest('GET', _baseUrl + 'mypage/getGdasListJSON.do', {
            pageIdx : idx
        }, mmypage.gdasList.getGdasListJSONCallback);
        //SR 3358020 shlee S
        sessionStorage.setItem('getGdasListJSON_idx', idx);
        //SR 3358020 shlee E
    },

    getGdasListJSONCallback : function(res) {
        var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
        //SR 3358020 shlee S
        if (data.length < 1) {
            ScrollPager.unbindEvent();
            sessionStorage.setItem('getGdasListJSON_E', 'Y');
            return;
        }else{
        	sessionStorage.setItem('getGdasListJSON_E', 'N');
        }
        //SR 3358020 shlee E
        var goodsNo = $('#goodsNo').val();
        var html = '';
        if(goodsNo == '' || goodsNo.length == 0) {
        	/*탑리뷰어_lsy_Start*/
        	for(var i in data){
        		var item = data[i];
        		if(item.goodsNo != undefined || item.offlineOrderYn == 'Y') {
        			/* 2019.11.04 오프라인리뷰관련 추가 */
        			var ordTitle = item.offlineOrderYn == 'Y' ? '구매일자' : '주문일자'; 

        			/* 2019.11.04 오프라인리뷰관련 추가 */
        			if('Y' ==  item.offlineOrderYn && (item.goodsNo == null || item.goodsNo.isEmpty() || item.prgsStatCd =='10') ) {
        				html += '<li data-default="Y" >';
        				html += '<div class="prd_info">';
        				
        				html += '<p class="prd_img"><img src="'+_imgUrl+'comm/offline_store.png" alt="'+item.goodsNm+'" onerror="common.errorImg(this);"/>';
    					html += '<span class="only_offline">매장전용상품</span> ';        				
        				html += '</p>';
        				html += '<span class="prd_date">'+ordTitle+'</span> ';
        				if('Y' ==  item.offlineOrderYn){//## 리뷰 고도화 1.8차 ## 매장구매 인경우 operDt 로 변경
        					;
        					html += item.operDt.substring(0,4)+"."+item.operDt.substring(4,6)+"."+item.operDt.substring(6,8) ;
        				}else{
        					html += item.ordDate;
        				}
        				html += '<span class="offlineStore">매장</span>';
        				html += '<div class="prd_name">';
        				html += '<p class="tit">'+item.brndNm+'</p>';
        				html += '<p class="tx_short">'+item.goodsNm+'</p>';
        				html += '</div>';
        				html += '</div>';
        				
        			} else if (item.prgsStatCd == '20' && item.itemPrgsStatYn == 'Y') {
        				html += '<li data-default="Y" >';
        				html += '<div class="prd_info" onclick="common.link.moveGoodsDetail(\''+item.goodsNo+'\',\'\');">';
        				html += '<p class="prd_img"><img src="'+_goodsImgUploadUrl+item.thnlPathNm+'" alt="'+item.goodsNm+'" onerror="common.errorImg(this);" />';
        				html += '</p>';
        				html += '<span class="prd_date">'+ordTitle+'</span> ';
        				if('Y' ==  item.offlineOrderYn){//## 리뷰 고도화 1.8차 ## 매장구매 인경우 operDt 로 변경
        					html +=  item.operDt.substring(0,4)+"."+item.operDt.substring(4,6)+"."+item.operDt.substring(6,8) ;
        				}else{
        					html +=  item.ordDate;
        				}
        				if('Y' ==  item.offlineOrderYn) {
        					html += '<span class="offlineStore">매장</span>';
        				}
        				html += '<div class="prd_name">';
        				html += '<p class="tit">'+item.brndNm+'</p>';
        				html += '<p class="tx_short">'+item.goodsNm+'</p>';
        				if( !common.isEmpty(item.itemNm) && item.itemNm.trim() != '' ){
        					html += '<p class="txt_option"><em class="line">옵션</em><span class="txt_op">'+item.itemNm+'</span></p>';
        				}
        				html += '</div>';
        				html += '</div>';
        				
        			} else {
        				html += '<li data-default="Y" class="soldout">';
        				html += '<div class="prd_info" onclick="javascript:alert(\'판매종료된 상품입니다.\');">';
        				html += '<p class="prd_img">';
        				html += '<img src="'+_goodsImgUploadUrl+item.thnlPathNm+'" alt="'+item.goodsNm+'" onerror="common.errorImg(this);" />';
        				html += '<span class="soldend">판매종료</span>';
        				html += '</p>';
        				html += '<span class="prd_date">'+ordTitle+'</span> ';
        				if('Y' ==  item.offlineOrderYn){//## 리뷰 고도화 1.8차 ## 매장구매 인경우 operDt 로 변경
        					html +=  item.operDt.substring(0,4)+"."+item.operDt.substring(4,6)+"."+item.operDt.substring(6,8) ;
        				}else{
        					html += item.ordDate;
        				}
        			if('Y' ==  item.offlineOrderYn) {
            				html += '<span class="offlineStore">매장</span>';
        			}
        				html += '<div class="prd_name">';
        				html += '<p class="tit">'+item.brndNm+'</p>';
        				html += '<p class="tx_short">'+item.goodsNm+'</p>';
        				if(!common.isEmpty(item.itemNm) && item.itemNm.trim() != '' ){
        					html += '<p class="txt_option"><em class="line">옵션</em><span class="txt_op">'+item.itemNm+'</span></p>';
        				}
        				html += '</div>';							
        				html += '</div>';
        			}
        			html += '<div class="review_info">';
        			html += '<span class="review_date">작성 기간</span> ~ '+item.apslPsblDate;
        			html += '<p class="btn_area">';
        			/* 2019.11.04 오프라인리뷰관련 추가 */
        			var gdasSctCd = item.offlineOrderYn == 'Y' ? '60' : '10';
        			html += '<button class="btnMintH28" data-gdas-seq="" data-ord-no="'+item.ordNo+'" data-goods-no="'+item.goodsNo+'" data-gdas-tp-cd="00" data-gdas-sct-cd="'+gdasSctCd+'" data-item-no="'+item.itemNo+'" data-ord-goods-seq="'+item.ordGoodsSeq+'" data-ord-con-yn="'+item.ordConYn+'" data-item-nm="'+item.itemNm+'" data-lgc-goods-no="'+item.lgcGoodsNo+'" data-thnl-path-nm="'+item.thnlPathNm+'" data-oper-dt="'+item.operDt+'" data-origin-bizpl-cd="'+item.originBizplCd+'" data-receipt-no="'+item.receiptNo+'" data-pos-no="'+item.posNo+'" data-str-no="'+item.strNo+'" data-brnd-nm="'+item.brndNm+'" data-prgs-stat-cd="'+item.prgsStatCd+'" data-used1mm-gdas-yn="'+item.used1mmGdasYn+'" onclick="mmypage.gdasList.appraisalRegist(this);">리뷰 작성</button>';
        			html += '</p>';
        			html += '</div>';
        			html += '</li>';
        		}
        	}
			$('#possible-list').append(html);
			/*탑리뷰어_lsy_End*/
//            $('#possible-list-tmpl').tmpl(data).appendTo('#possible-list'); //탑리뷰어_lsy
        }
    },

    getGdasCompleteListJSON : function() {
//        var searchMonth = $('#search-month option:selected').val(); //탑리뷰어_lsy
    	//SR 3358020 shlee S
    	if(sessionStorage.getItem('getGdasCompleteListJSON_E') == 'Y'){
    		return;
    	}
    	
    	var idx = ScrollPager.nextPageIndex();
    	if(sessionStorage.getItem('getGdasCompleteListJSON_idx') != null && ScrollPager.nextPageIndex() != sessionStorage.getItem('getGdasCompleteListJSON_idx')){
        	idx = parseInt(sessionStorage.getItem('getGdasCompleteListJSON_idx')) + 1;
    	}else if(idx == 2 && sessionStorage.getItem('getGdasCompleteListJSON_idx') == 2){
    		idx = parseInt(sessionStorage.getItem('getGdasCompleteListJSON_idx')) + 1;
    	}
    	//SR 3358020 shlee E
        common.Ajax.sendJSONRequest('GET', _baseUrl + 'mypage/getGdasCompleteListJSON.do', {
            pageIdx : idx,
//            searchMonth : $('#search-month option:selected').val() //탑리뷰어_lsy
        }, mmypage.gdasList.getGdasCompleteListJSONCallback);
        //SR 3358020 shlee S
        sessionStorage.setItem('getGdasCompleteListJSON_idx', idx);
        //SR 3358020 shlee E
    },

    getGdasCompleteListJSONCallback : function(res) {
        var data = (typeof res.getList !== 'object') ? $.parseJSON(res.getList) : res.getList;
        
        for(var i  in data){
            if(data[i].gdasCont != '' && data[i].gdasCont != null){
                var tmpCont = $.trim(unescape(data[i].gdasCont).replace(/(<([^>]+)>)/ig,""));
                data[i].gdasCont = tmpCont;
            }
        }
        //SR 3358020 shlee S
        if (data.length < 1) {
            ScrollPager.unbindEvent();
            sessionStorage.setItem('getGdasCompleteListJSON_E', 'Y');
            return;
        }else {
        	sessionStorage.setItem('getGdasCompleteListJSON_E', 'N');
        }
        //SR 3358020 shlee E
        var html = '';
        /*탑리뷰어_lsy_Start*/
        for(var i in data){
        	var item = data[i];
        	if(item.goodsNo != undefined){
        		/* 2019.11.13 오프라인리뷰관련 추가 */
    			var ordTitle = item.gdasSctCd == '60' ? '구매일자' : '주문일자';
    			
    			html += '<li data-default="Y" class="soldout">';

        		if(item.prgsStatCd == '20' && item.itemPrgsStatYn == 'Y'){
        			html += '<div class="prd_info" onclick="common.link.moveGoodsDetail(\''+item.goodsNo+'\',\'\');">';
        			
        			/* 2019.11.04 오프라인리뷰관련 추가 */
    				if( item.gdasSctCd == '60' && (item.goodsNo == 'A000000000000' || item.prgsStatCd =='10') ) {
    					html += '<p class="prd_img"><img src="'+_goodsImgUploadUrl+'comm/offline_store.png" alt="'+item.goodsNm+'" onerror="common.errorImg(this);"/>';
    					html += '<span class="only_offline">매장전용상품</span> ';
    				} else {
    					html += '<p class="prd_img"><img src="'+_goodsImgUploadUrl+item.thnlPathNm+'" alt="'+item.goodsNm+'"  onerror="common.errorImg(this);" />';
    				}
        			
        			/*if(item.prgsStatCd == '30'){
        				html += '<span class="soldend">판매종료</span>';
        			}*/
        			html += '</p>';
        			if(item.gdasSctCd == '10' || item.gdasSctCd == '60'){
        				html += '<span class="prd_date">'+ordTitle+'</span> '+item.ordDate;
        				if('60' ==  item.gdasSctCd) {
            				html += '<span class="offlineStore">매장</span>';
        				}
        			}
        			html += '<div class="prd_name">';
        			html += '<p class="tit">'+item.brndNm+'</p>';
        			html += '<p class="tx_short">'+item.goodsNm+'</p>';
        			if(item.itemNm != '' && item.itemNm != null){
        				html += '<p class="txt_option"><em class="line">옵션</em><span class="txt_op">'+item.itemNm+'</span></p>';
        			}
        			html += '</div>';
        			html += '</div>';
        		}else{
        			html += '<div class="prd_info" onclick="javascript:alert(\'판매종료된 상품입니다.\');">';
        			html += '<span class="prd_img"><img src="'+_goodsImgUploadUrl+item.thnlPathNm+'" alt="'+item.goodsNm+'"  onerror="common.errorImg(this);" />';
        			// if(item.prgsStatCd == '30'){
        				html += '<span class="soldend">판매종료</span>';
        			//}
        			html += '</span>';
        			if(item.gdasSctCd == '10' || item.gdasSctCd == '60' ){
        				html += '<span class="prd_date">'+ordTitle+'</span>'+item.ordDate;
        				if('60' ==  item.gdasSctCd) {
            				html += '<span class="offlineStore">매장</span>';
        				}
        			}
        			html += '<div class="prd_name">';
        			html += '<p class="tit">'+item.brndNm+'</p>';
        			html += '<p class="tx_short">'+item.goodsNm+'</p>';
        			if(item.itemNm != '' && item.itemNm != null){
        				html += '<p class="txt_option"><em class="line">옵션</em><span class="txt_op">'+item.itemNm+'</span></p>';
        			}
        			html += '</div>';
        			html += '</div>';
        		}
        		html += '<div class="review_info_new">';
        		html += '<div class="line_dash clrfix">';
        		html += '<div class="review_stat type2">';
        		if(item.gdasScrVal != '0' && item.gdasScrVal != ''){
        			html += '<span class="point pt'+item.gdasScrVal / 2+'">만족도 '+item.gdasScrVal+'점</span>';
        		}
        		html += '</div>';
        		// [3272911] 리뷰 제한 카테고리> 리뷰 리스트 노출관련 추가 작업(CHY)
        		if(item.gdasPrhbCatCnt == 0){
	        		if(item.dispStatCd == '20'){
	        			html += '<p class="txt del">'+item.shrtGdasCont+'</p>';
	        			var dclCauseNm = common.isEmpty(item.dclCauseNm) ? "" : '('+item.dclCauseNm+')';
	        			html += '<p class="decla">리뷰 미노출 '+dclCauseNm+'</p>';
	        		}else{
	        			html += '<p class="txt">';
	        			if(item.shrtGdasCont != '' && item.shrtGdasCont != null){
	        				html += item.shrtGdasCont;
	        			}else{
	        				var tmpCont = $.trim(unescape(data[i].gdasCont).replace(/(<([^>]+)>)/ig,""));
	        				tmpCont = common.isEmpty(tmpCont) ? "" : tmpCont;
	        				html += 	tmpCont;
	        			}
	        		}
        		}
        		html += '</p>';
        		html += '</div>';
        		html += '<div class="review_info">';
        		html += '<span class="review_date">작성 일자</span> '+item.sysRegDate;
        		html += '<p class="btn_area">';
        		if(item.modYn == 'Y'){
        			html += '<button class="btnMintH28" data-gdas-seq="'+item.gdasSeq+'" data-ord-no="'+item.ordNo+'" data-goods-no="'+item.goodsNo+'" data-gdas-tp-cd="00" data-gdas-sct-cd="10" data-item-no="'+item.itemNo+'" data-ord-goods-seq="'+item.ordGoodsSeq+'" data-item-nm="'+item.itemNm+'" data-lgc-goods-no="'+item.lgcGoodsNo+'" data-thnl-path-nm="'+item.thnlPathNm+'" data-brnd-nm="'+item.brndNm+'" data-prgs-stat-cd="'+item.prgsStatCd+'" onclick="mmypage.gdasList.goModify(this);">리뷰수정</button>';
        		}else{
        			html += '<button class="btnGray2H28" data-gdas-seq="'+item.gdasSeq+'" data-ord-no="'+item.ordNo+'" data-goods-no="'+item.goodsNo+'" data-gdas-tp-cd="00" data-gdas-sct-cd="10" data-item-no="'+item.itemNo+'" data-ord-goods-seq="'+item.ordGoodsSeq+'" data-item-nm="'+item.itemNm+'" data-lgc-goods-no="'+item.lgcGoodsNo+'" data-thnl-path-nm="'+item.thnlPathNm+'" data-brnd-nm="'+item.brndNm+'" data-prgs-stat-cd="'+item.prgsStatCd+'" onclick="mmypage.gdasList.goModify(this);">리뷰보기</button>';
        		}
        		html += '</p>';
        		html += '</div>';
        		html += '</div>';
        		html += '</li>';
        	}
        }
        $('#complete-list').append(html);
        /*탑리뷰어_lsy_End*/
        
//        $('#complete-list-tmpl').tmpl(data).appendTo('#complete-list'); // 탑리뷰어_lsy
    },
    
    //SR 3358020 shlee
    removeGdasListSession : function() {
        sessionStorage.removeItem('getGdasListJSON_idx');
        sessionStorage.removeItem('getGdasListJSON_E');
        sessionStorage.removeItem('getGdasCompleteListJSON_idx');
        sessionStorage.removeItem('getGdasCompleteListJSON_E');
    },
    
    appraisalRegist : function(obj) {
        // [상품평개편] 상품평쓰기 클릭 지표 추가 - 2019.4.11
        // 마이페이지 > 상품평 > 상품평쓰기
        common.wlog("mypage_gdas_write");
        
        if (!common.loginChk()) {
            return;
        }
        
        var params = $(obj).data();
        
        /* 문구 추가 */
        if(params.ordConYn == "Y") {
            alert("해당 상품은 부분 교환된 상품입니다. 교환전 또는 교환후 상품 중 1개의 리뷰만 작성 가능합니다.");
        }
        
        this.setSerializeData(obj);

        /*
         * ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 2016-12-30 기획변경(신여진님 요청)
         * ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ this.checkTodayRegCount();
         */
        sessionStorage.setItem('gdasTabId', $('#mTab').find('.on').index() );
        
        $(location).attr(
                'href',
                _baseUrl + 'mypage/getGdasEvalForm.do?' + mmypage.gdasList.serializeData + '&retUrl='
                    + _baseUrl + 'mypage/getGdasList.do' + '&gdasStep=' + 1);
    },

    appraisalModify : function(obj) {
        this.setSerializeData(obj);

        $(location).attr('href', _baseUrl + 'mypage/getGdasForm.do?' + mmypage.gdasList.serializeData);
    },

    appraisalDelete : function(obj) {
        this.setSerializeData(obj);
    },

    checkTodayRegCount : function() {
        common.Ajax.sendJSONRequest('GET', _baseUrl + 'mypage/getTodayAppraisalCountJSON.do', {},
                mmypage.gdasList.checkTodayRegCountCallback, false);
    },

    checkTodayRegCountCallback : function(res) {
        var data = (typeof res !== 'object') ? $.parseJSON(res) : res;

        if (Number(data) > 10) {
            alert('리뷰는 하루에 10개까지만 등록할 수 있습니다.');
            return;
        }

        $(location).attr('href', _baseUrl + 'mypage/getGdasForm.do?' + mmypage.gdasList.serializeData);
    },

    goDetail : function(seq) {
    	$('#mFooter').hide();
        $('#mHeader').hide();
        $(location).attr('href', _baseUrl + 'mypage/getGdasDetail.do?gdasSeq=' + seq);
    },

    goModify : function(obj) {
        
        if (!common.loginChk()) {
            return;
        }

        this.setSerializeData(obj);

        /*
         * ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 2016-12-30 기획변경(신여진님 요청)
         * ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ this.checkTodayRegCount();
         */

        // 분기 처리 필요
        // $(location).attr('href', _baseUrl + 'mypage/getGdasForm.do?' +
        // mmypage.gdasList.serializeData); //as -is
        sessionStorage.setItem('gdasTabId', $('#mTab').find('.on').index() );
        $(location).attr(
                'href',
                _baseUrl + 'mypage/getGdasEvalForm.do?' + mmypage.gdasList.serializeData + '&retUrl='
                        + _baseUrl + 'mypage/getGdasList.do' + '&gdasStep=' + 6);
    }
};

$.namespace('mmypage.gdasDetail');
mmypage.gdasDetail = {
    init : function() {
    	$("#footerTab").hide();
        $('#go-back').click(function() {
            history.back();
        });

        $(".editorImg").removeAttr("style");
        $(".editorImg").css("width", "100%");

    },

    appraisalModify : function(seq) {
        alert('수정 [seq : ' + seq + ']');
    },

    appraisalDelete : function(seq) {
        if (!confirm(MESSAGE.CONFIRM_DELETE))
            return;

        alert('삭제 처리 [seq : ' + seq + ']');
    }
};

var imgCallSize = 0;

/* [추가 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 버튼 제어 관련 */
var imgAddBtn = "";
var imgIdx = 0;
var regBtnClickCnt = 0;
/* [추가 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 버튼 제어 관련 */

$.namespace("mmypage.gdasForm");
/** 상품 상세 페이지 */
mmypage.gdasForm = {

    goodsNo : $("#goodsNo").val(),
    photoRegYn : "N",

    // 조회값 초기 셋팅
    init : function() {
        mmypage.gdasForm.gdasFormBindButton();
        
        /* [추가 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 글자수 제어 */
        mmypage.gdasForm.textFunction();
        /* [추가 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 글자수 제어 */

        /*if (_gdasTpCd == "20") {
            mmypage.gdasForm.editorInit();
        }

        if (_gdasTpCd == "10") {
            mmypage.gdasForm.textareaInit();
        }*/

        if ($("#gdasSeq").val() == "0") {
            $("#gdasSeq").val("");
        }

        if ($("#gdasSeq").val() != "") {
            setTimeout(function() {
                if ($("#gdasTpCd").val() == "20") {
                    // var orgHtml = "<p>" + unescape($("#gdasCont").val()) +
                    // "</p>";
                    var orgHtml = unescape($("#gdasCont").val());
                    // 마지막 처리
                    // orgHtml = orgHtml.replace(/<br><\/p>/g, "</p>");
                    // 그 외 br은 p close and open처리
                    // orgHtml = orgHtml.replace(/<br>/g, "</p><p>");

                    $("#editor .ql-editor").html(orgHtml);

                    $("#editor").keyup();

                } else {
                    $("#gdasContInput").val(unescape($("#gdasCont").val()));

                    $("#gdasContInput").keyup();
                }

                var cnt = ($("#gdasScrVal").val() == "" ? 0 : $("#gdasScrVal").val()) / 2;

                // 클릭 이벤트로 대체
                $('.review_star button').eq(cnt - 1).trigger('click');

                /*
                 * for (var i = 0; i < $(".btn_point").length; i++) { if (i <
                 * cnt) { $(".btn_point").eq(i).addClass("sel"); } else { break; } }
                 */

            }, 1000);

        }
        
        /* [추가 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 수정 가능 여부 세팅 */
        $("#writeYn").val($("#modYn").val());

        if($("#gdasSctCd").val() == "50"){
        	if($("#gdasSeq").val().length > 0 && $("#modYn").val() == "Y"){
        		$("#useGuide").show();
            	$(".btn-remove").show();
        	}else if($("#gdasSeq").val().length < 1 && $("#modYn").val() == "Y"){
        		$("#useGuide").hide();
        		$(".btn-remove").show();
        	}else{
        		$("#useGuide").hide();
            	$(".btn-remove").hide();
        	}
        }else{
        	if($("#modYn").val() == "Y"){
        		$("#useGuide").show();
        		$(".btn-remove").show();
        	}else{
        		$("#useGuide").hide();
        		$(".btn-remove").hide();
        	}
        }
        /* [추가 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 수정 가능 여부 세팅 */

    },

    isProgressive : false,

    gdasFormBindButton : function() {

        // 평점 UI 처리 바인드
        $('.review_point').find('button').click(function() {
            var point_val = $(this).parent().index();
            $('.review_point').find('button').removeClass('sel');
            for (var i = 0; i <= point_val; i++) {
                $('.review_point li:eq(' + i + ')').find('button').addClass('sel');
            }
        });
        // 취소
        $("button.btnGray").click(function() {
            var msg = "리뷰 작성을 취소하시겠습니까?";
            if ($("#gdasSctCd").val() != "10" && $("#gdasSctCd").val() != "60") {
                msg = "올영체험단 리뷰 작성을 취소하시겠습니까?";
            }

            if (!confirm(msg)) {
                return;
            }
            // 이전화면으로 이동
            history.back();
        });

        // 등록
        /*$("button.btnGreen").click(
                function() {
                    var orgTxt = "";
                    var gdasName = "";
                    if ($("#gdasSctCd").val() == "10") {
                        gdasName = "한줄 리뷰는";
                    } else if ($("#gdasSctCd").val() == "20") {
                        gdasName = "프리미엄 리뷰는";
                    } else if($("#gdasSctCd").val() == "50"){
                    	gdasName = "올영체험단 리뷰는";
                    } else {
//                        gdasName = "뷰티테스터 후기는";
                    }

                    if ($(".btn_point.sel").length < 1) {
//                        alert("별점이 입력되지 않았습니다. 별점을 입력해주세요.");
                    	alert("별점을 선택해주세요");
                        return;
                    }

                    if ($("#gdasPrhbCatCnt").val() == "0") {

                        // validation
                        if ($("#gdasTpCd").val() == "10") {
                            // 한줄
                            orgTxt = $("#gdasContInput").val().trim();
                            if (orgTxt.length < 5) {
                                alert(gdasName + " 최소 5자 이상 등록해주셔야 합니다.");
                                return;
                            }
                            if (orgTxt.length > 49) {
                                alert(gdasName + " 49자까지만 작성 가능합니다.\n50자 이상인 경우 프리미엄 리뷰로 작성하시고 최대 150P 받으세요.");
                                return;
                            }
                            $("#gdasCont").val(escape(orgTxt));
                            $("#photoGdasYn").val("N");

                        } else {
                            // 프리미엄
                            var orgHtml = $("#editor .ql-editor").html();
                            orgTxt = unescape(escape(
                                    $("#editor .ql-editor").text().trim().replace(/\t/g, "").replace(/\n/g, "")
                                            .replace(/\r/g, "")).replace(/%u200B/g, ""));

                            var msg = "프리미엄 상품평은";
                            if ($("#gdasSctCd").val() != "10" && $("#gdasSctCd").val() != "60") {
//                                msg = "뷰티테스터 후기는";
                                msg = "올영체험단 리뷰는";
                            }

                            if (orgTxt.length < 50) {
                                alert(msg + " 최소 50자 이상 등록해주셔야 합니다.");
                                return;
                            }
                            if (orgTxt.length > 1000) {
                                alert(msg + " 1,000자까지 작성 가능합니다.");
                                return;
                            }

                            // p태그 제거, cheditor와 동일 형식으로 리턴받기 위해
                            // orgHtml = orgHtml.replace(/(<p><br>)|(<p>)/g,
                            // "").replace(/<\/p>/g, "<br>");
                            var orgObj = $("<div id=\"editor\">" + orgHtml + "</div>");
                            // quill에서는 이미지 업로드 후 width로 이미지 사이즈를 제어하므로 DB에 저장하기
                            // 전에 해당 attribute 삭제 처리함.
                            orgObj.find("img").removeAttr("width").addClass("editorImg");
                            var html = orgObj.html();
                            console.log(html);

                            $("#gdasCont").val(escape(html));

                            var photoGdasYn = ($("#editor .ql-editor img").length > 0) ? "Y" : "N";

                            // if ($("#photoGdasYn").val() != "Y" && photoGdasYn
                            // == "Y") {
                            if (photoGdasYn == "Y") {

                                $("#photoGdasYn").val(photoGdasYn);

                                var imgSrc = $($("#editor .ql-editor img")[0]).attr("src");
                                var pathTmp = imgSrc.replace(_gdasImgUploadUrl, "");
                                var lastPathPos = pathTmp.lastIndexOf("/");
                                var pathNm = pathTmp;
                                var fileNm = pathTmp.substring(lastPathPos + 1, pathTmp.length);

                                $("#appxFilePathNm").val(pathNm);
                                $("#appxFileNm").val(fileNm);
                            } else {
                                $("#appxFilePathNm").val("");
                                $("#appxFileNm").val("");

                                $("#photoGdasYn").val(photoGdasYn);
                            }
                        }
                    } else {
                        // 상품평제한인 경우 무조건 한줄로 셋팅
                        $("#gdasTpCd").val("10");
                        $("#photoGdasYn").val("N");
                    }
                    $("#shrtGdasCont").val(orgTxt.substring(0, 100));
                    $("#gdasContTxt").val(orgTxt);
                    $("#gdasLen").val(orgTxt.length);
                    $("#gdasScrVal").val($(".btn_point.sel").length * 2);
                    // validation
                    // if ($("#gdasScrVal").val() == "0") {
                    // alert("만족도를 선택해주셔야 합니다.");
                    // return;
                    // }

                    if (!mmypage.gdasForm.isProgressive) {
                        mmypage.gdasForm.isProgressive = true;

                        var param = $("#gdasForm").serialize();

                        common.Ajax.sendRequest("POST", _baseUrl + "mypage/regGdasJson.do", param,
                                mmypage.gdasForm.regGdasCallback);
                    }

                });*/
        
        // 사진 등록 버튼 클릭
        $('#btn_photo').on('click', function(){
            // 첫번째 사진선택 클릭
            $('.swiper-slide').children('button').eq(0).trigger('click');
        });
        
        // 상품평 개편 관련 START ************ 2019. 01************************ //

        // 안드로이 5 미만 앱이 파일 선택 후 파일명 전달시
        common.app.callbackUploadImgBase64 = function(fileName, imgData) {
            
            common.app.callShowLoadingBar("N");

            if (imgData != undefined && imgData != null && imgData != "") {
                
                $('.dim').css('display','block');
                common.showLoadingLayer(false);
                
                var tmpImg = document.getElementById('tmpImg');
                var canvasImg = document.getElementById('tmpEvalCanvas');
                var imageResizeWidth = 505;
                var uploadImg = "";
                
                tmpImg.onload = function(e) {
                    
                    var ctx = canvasImg.getContext('2d');
                    
                    //배율
                    var magnification = 1;
                    
                    if (tmpImg.width > imageResizeWidth) {
                        magnification =imageResizeWidth / tmpImg.width;
                    }

                    canvasImg.width = tmpImg.width * magnification;
                    canvasImg.height = tmpImg.height * magnification;

                    ctx.imageSmoothingEnabled = true;
                    ctx.mozImageSmoothingEnabled = true;
                    
                    ctx.drawImage(tmpImg, 0, 0, canvasImg.width, canvasImg.height);    
                    uploadImg = canvasImg.toDataURL();
                    
                   // 상품평 이미지 업로드
                   imgUploadAjax(uploadImg);
                }
                
                try {
                    tmpImg.src =  "data:image/png;base64," + imgData;
                } catch (e) {
                    alert(e);
                }
            }
        };

        // 별체크
        $('.review_star button')
                .on(
                        'click',
                        function() {
                            var _this = $(this), _thisli = $(this).parent('li'), _thisindex = $(this).parent('li')
                                    .index(), _starOn = _thisindex + 1, _review_star = $('.review_star'), _intxt = $('.review_star .intxt'), _num = $('.review_star .num');

                            $(".review_star li").removeClass("on");
                            
                            $("#gdasScrVal").val(parseInt(_thisindex+1) * 2); 
                            
                            for (var i = 0; i <= _thisindex; i++) {
                                $(".review_star li").eq(i).addClass("on");
                            }
                            _num.html(_starOn);
                            _review_star.attr('class', 'review_star');
                            _review_star.addClass('star' + _starOn);

                            if (_review_star.hasClass('star0')) {
                                _intxt.html('별점을 입력해주세요');
                            } else if (_review_star.hasClass('star1')) {
                                _intxt.html('나쁨');
                            } else if (_review_star.hasClass('star2')) {
                                _intxt.html('별로');
                            } else if (_review_star.hasClass('star3')) {
                                _intxt.html('보통');
                            } else if (_review_star.hasClass('star4')) {
                                _intxt.html('좋음');
                            } else if (_review_star.hasClass('star5')) {
                                _intxt.html('최고');
                            }
                        });
        
        // 사진을 등록해주세요 클릭
        $("#div_photo_output").on('click', function() {
            $('#div_photo_reg').css('display','block');
            $('#div_photo_output').css('display','none');
        });

        // 상품평 만족도 등록 상품평 1
        $("#btn_gdas_write").on('click', function() {

            if ($(".on > .star").length < 1) {
//                alert("별점이 입력되지 않았습니다. 별점을 입력해주세요.");
            	alert('별점을 선택해주세요');
                return;
            }
            
            regGdasEvalRst();
            
            //stepCont();
            stepContChk('A');
        });

        // 상품평 상품평 TEXT 입력
        $("#btn_reg_write").on('click', function() {
            
            mmypage.gdasForm.textFunction();

            $("#gdasContTxt").val($('#txtGdasCont').val());
            
                var param = $("#gdasForm").serialize();
                common.Ajax.sendRequest("POST" , _baseUrl +
              "mypage/chkGdasJson.do" , param ,
               mmypage.gdasForm.chkGdasCallback ); 
        });


        // 상품평 TextArea 입력 체크
        $('#txtGdasCont').on('keyup', function() {
            mmypage.gdasForm.textFunction();

        });
        
        //상품평 이미지파일 업로드.. 안드로이드 앱 / 웹
        $("#evalfile").on('change', function() {
            
            var uploadImg = "";
            var fileInput    = document.querySelector('input.ql-image[type=file]');
            var canvasImg = document.getElementById('tmpEvalCanvas');
            var imageResizeWidth = 505;
            var imgExtChk = true; // 이미지 확장자 체크용
            var tmpImg = document.getElementById('tmpImg');
            
            if (fileInput.files != null && fileInput.files[0] != null) {
                
                var imgCur = 0;
                var imgSize = fileInput.files.length;
                imgCallSize = imgSize; 
                
                for(var i=0; imgSize > i; i++ ){
                    
                    var fileNm = fileInput.files[i].name;
                    fileNm = fileNm.toLowerCase();
                    var fileSize = fileInput.files[i].size;
                    
                    var chkImgSize =Number($('#imgSize').val()); 
                    var arrImgType = $('#imgChk').val().split('|');
                    imgExtChk = true;
                    
                    for(var r=0; arrImgType.length > r; r++ ){
                        
                        if( fileNm.indexOf(arrImgType[r]) > -1 ){
                            imgExtChk = false;
                            break;
                        }
                    }
                    
                    // 이미지 체크 걸릴시
                    if( imgExtChk ){
                        alert('사진 용량은 10MB이하 \n파일형식은 PNG,GIF,\nJPG만 등록 가능합니다 ');
                        $('#evalfile').val('');
                        return false;
                    }

                    if(  fileSize >   chkImgSize ||  fileSize == 0){
                        alert('사진 용량은 10MB이하 \n파일형식은 PNG,GIF,\nJPG만 등록 가능합니다');
                        $('#evalfile').val('');
                        return false;
                    }
                }
                
                $('.dim').css('display','block');
                common.showLoadingLayer(false);
                
                var reader = new FileReader();
                    
                    reader.onload = function(e) {
                        try {
                                // 파일리더가 파일객체를 다읽을때까지 대기
                                if( e.target.readyState == FileReader.DONE) {
                                    tmpImg.src = e.target.result;
                                }    
                            
                        } catch (e) {
                           imgCheck = true;
                           $('.dim').css('display','none');
                           common.hideLoadingLayer();
                        }
                    }
                
                try {
                    if( 0 == imgCur ){
                        reader.readAsDataURL(fileInput.files[imgCur]);
                        
                        if( imgSize > 1){
                            imgCur++;    
                        }else{
                            $('#evalfile').val('');
                        }
                    }
                 } catch (e) {
                    imgCheck = true;
                    $('.dim').css('display','none');
                    common.hideLoadingLayer();
                }
             
                 // 이미지 객체를 읽고 다음 프로세를 처리하도록 변경이 필요
                tmpImg.onload = function(e) {
                     
                    // 캔버스 2D 객체를 반환
                     var ctx = canvasImg.getContext('2d');
                     
                     //배율
                     var magnification = 1;
                    
                     // 현재선택된 이미지의 크기 비율 구하기
                     if (tmpImg.width > imageResizeWidth) {
                         magnification =imageResizeWidth / tmpImg.width;
                     }
                     
                     // 캔버스에 비율값을 대입
                     canvasImg.width = tmpImg.width * magnification;
                     canvasImg.height = tmpImg.height * magnification;
    
                     ctx.imageSmoothingEnabled = true;
                     ctx.mozImageSmoothingEnabled = true;
                     
                     // 캔버스에 그리기 및 압축
                     ctx.drawImage(tmpImg, 0, 0, canvasImg.width, canvasImg.height);
                     
                     // 캔버스에서 압축된 데이터 리턴 
                     uploadImg = canvasImg.toDataURL();
                     
                    // 상품평 이미지 업로드
                    imgUploadAjax(uploadImg);
                     
                     if( imgSize > imgCur  && fileInput.files[imgCur] != null ){
                         reader.readAsDataURL(fileInput.files[imgCur]);
                         imgCur++;
                     }else{
                         $('#evalfile').val('');
                     }
                     
                     tmpImg.src = '';
                     
                }
                 
            }
        });
        
        /* [추가 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 별점 제어 */
        // 별체크
        $('.starClick')
                .on(
                        'click',
                        function() {
                            var _this = $(this), _thisli = $(this).parent('li'), _thisindex = $(this).parent('li')
                                    .index(), _starOn = _thisindex + 1, _review_star = $('.review-rating2'), _intxt = $('.review-rating2 .intxt'), _num = $('.review-rating2 .num');

                            $(".review-rating2 li").removeClass("on");

                            $("#gdasScrVal").val(parseInt(_thisindex+1) * 2);

                            for (var i = 0; i <= _thisindex; i++) {
                                $(".review-rating2 li").eq(i).addClass("on");
                            }
                            _num.html(_starOn);
                            _review_star.addClass('class', 'review-rating');
                            _review_star.addClass('class', 'review-rating2');
                            _review_star.addClass('star' + _starOn);

                            mmypage.gdasForm.fnValidCheck();

                        });

    },
    /* [추가 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 별점 제어 */
    
    // 화면 등록이미지 삭제
    fn_btnDel : function(){
        $('#' + addId + ' > button').removeClass('btnDel');
        $('#' + addId + ' > button').addClass('btnAdd');
        $('#' + addId).data('imgPath', '');
        $('.txtArea_box #' + addId+'s').attr('src','' );
        makeImgPath();
        $('#evalfile').val('');
    },
    // 상품평 만족도 완료
    regGdasEvalDone : function() {
        
    	//별점 set
    	//var gdasScrVal = $(".on > .star").length * 2;
    	var gdasScrVal = $(".review-rating2").find(".on > .star").length * 2;
        
        /*if($("#gdasSeq").val().length < 1 || $("#gdasSeq").val() == ""){
			gdasScrVal = gdasScrVal / 2;
		}*/ 
    	
        $("#gdasScrVal").val(gdasScrVal);
    	
        // 만족도 평가 셋팅 Start
        regGdasEvalRst();
        
        if ($(".on > .star").length < 1) {
            alert("별점을 입력해주세요");
            return;
        }
        
        // 뷰티 테스트 필수값 체크
        /*if( '30' == $('#gdasSctCd').val() ){
            
            var gdasTotVal = $("#gdasTotVal").val();
            var arrGdasTotVal = gdasTotVal.split(',');
            var gdasSize = arrGdasTotVal.length;
            
            for(var i=0; gdasSize >i; i++ ){
                if('0' == arrGdasTotVal[i] ){
//                    alert('별점이 입력되지 않았습니다. 별점을 입력해주세요.');
                	 alert('별점을 선택해주세요');
                    return false;
                }
            }
            
            // 상품평
            if( $("#gdasPrhbCatCnt").val() == "0" ){
                if( '' == $("#gdasCont").val()){
                    alert('리뷰를 입력해주세요');
                    return false;
                }
                
                if( '0' == $('#emPhoCnt').text() ){
                    alert('사진을 등록해주세요');
                    return false;
                }
                
                // 한줄평
                if( '' == $("#shrtGdasCont").val()){
                    alert('한줄리뷰를 입력해주세요');
                    return false;
                }
            }
        } else if('50' == $('#gdasSctCd').val()){   // 올영체험단인경우 필수값 체크로직 추가 : jwkim
            
            var gdasTotVal = $('#gdasTotVal').val();
            var arrGdasTotVal = gdasTotVal.split(',');
            
            for(var i=0;  arrGdasTotVal.length > i; i++ ){
                if( arrGdasTotVal[i] =='0' ){
                    alert("만족도는 필수 입력값입니다\n확인 후 입력 바랍니다");
                    return;
                }
            }
            
            // 상품평 등록 제한이 아닐경우만 가능
            if( $("#gdasPrhbCatCnt").val() == "0" ){
                
                if( '' == $("#gdasCont").val()){
                    alert('리뷰를 입력해주세요');
                    return false;
                }
                
                if( '' == $("#shrtGdasCont").val()){
                    alert('한줄리뷰를 입력해주세요');
                    
                    stepCont();
                    
                    return false;
                }
            }
            
        }*/
        /* [수정 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 등록 */
        var conText = "";
        
        if(typeof $('#txtGdasCont').val() != "undefined"){
        	conText = $('#txtGdasCont').val().trim();
        }
        
        var conLeng = conText == undefined ? 0 : conText.length;
        $("#gdasCont").val(conText);
        $('#gdasLen').val(conLeng);
        $('#writeYn').val('Y');

        if(Number($("#prGdasEvalListSize").val()) > 0){
        	
	        var gdasTotVal = $('#gdasTotVal').val();
	        var arrGdasTotVal = gdasTotVal.split(',');
	
	        for(var i=0;  arrGdasTotVal.length > i; i++ ){
	            if( arrGdasTotVal[i] == '0' ){
	                alert("만족도는 필수 입력값입니다\n확인 후 입력 바랍니다");
	                return;
	            }
	        }
	        
        }

        // 상품평 등록 제한이 아닐경우만 가능
        if( $("#gdasPrhbCatCnt").val() == "0" ){

        	if('50' == $('#gdasSctCd').val()){   // 올영체험단인경우 필수값 체크로직 추가 : jwkim

        		if( '' == $("#gdasCont").val() || $("#gdasCont").val().length < 50){
                    alert('리뷰는 최소 50자 이상 입력 부탁드립니다.');
                    return false;
                }

        	}else{

        		if( '' == $("#gdasCont").val() || $("#gdasCont").val().length < 25){
                    alert('리뷰는 최소 25자 이상 입력 부탁드립니다.');
                    return false;
                }

        	}

        }
        /* [수정 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 등록 */
        
        // 상품평 구분코드 추가
        /*if ($('#gdasCont').val() == '' && $('#shrtGdasCont').val() != '') {
            $('#gdasTpCd').val('10');
        } else if ($('#gdasCont').val() != '' && $('#shrtGdasCont').val() == '') {
            $('#gdasTpCd').val('20');
        } else if ($('#gdasCont').val() != '' && $('#shrtGdasCont').val() != '') {
            $('#gdasTpCd').val('30');
        } else if ($('#gdasCont').val() == '' && $('#shrtGdasCont').val() == '') {
            $('#gdasTpCd').val('00');
        }*/
        $('#gdasTpCd').val('20');
        
        $('#photoGdasYn').val('N');
        
        if( 0 < $('#emPhoCnt').text() ){
            $('#photoGdasYn').val('Y');    
        }
        
        //해시태그 입력값 set
        var arrHashTagVal = new Array();
        $.each($(".rw-review-tag .inner").find(".tagValue"), function(idx, item){

        	arrHashTagVal.push($(this).text());

        });

        $("#hashTagCont").val(arrHashTagVal);
        $("#gdasContTxt").val($('#txtGdasCont').val());
        
        if (!mmypage.gdasForm.isProgressive) {
        	
            mmypage.gdasForm.isProgressive = true;

            var param = $("#gdasForm").serialize();
            //console.log("param :: " + param);

            common.showLoadingLayer(false);
            common.Ajax.sendRequest("POST", _baseUrl + "mypage/regGdasEvalJson.do", param,
                    mmypage.gdasForm.regGdasEvalCallback);
        }

    },

    regGdasCallback : function(res) {

        if (res.resultCd == '000') {

            /*
             * var regStr = "등록"; if ($("#gdasSeq").val() != "" &&
             * $("#gdasSeq").val() != "0") { regStr = "수정"; }
             * 
             * if ($("#gdasSctCd").val() == "10") { alert("상품평이 " + regStr +
             * "되었습니다."); } else { alert("뷰티테스터 후기가 " + regStr + "되었습니다."); }
             */

            if ($("#retUrl").val() != "") {
                document.location.href = $("#retUrl").val();
            } else {
                if ($("#gdasSctCd").val() == "10") {
                    document.location.href = _baseUrl + 'mypage/getGdasList.do';
                } else {
                    document.location.href = _baseUrl + 'mypage/getGdasList.do';
                }
            }
           
        } else if (res.resultCd == '510') {
            // 이미 등록된 상품평 입니다.
            alert(res.resultMsg);

        } else {
            var msg = "상품평";
            if ($("#gdasSctCd").val() != "10") {
                msg = "올영체험단 리뷰";
//                msg = "뷰티테스터 후기";
            }
            alert("리뷰 페이지를 불러오지 못했습니다. 다시 시도해주세요");
        }

        mmypage.gdasForm.isProgressive = false;
    },
    
    // 상품평 만족도 등록 콜백 상품평 1
    regGdasEvalCallback : function(res) {

        //loadingLayer
        common.hideLoadingLayer();
        
        //console.log('>>>>>> gdasSeq : ' + res.gdasSeq );
        console.log('>>>>>> resCd : ' + res.resultCd );
        console.log('>>>>>> resultMsg : ' + res.resultMsg );
        
        if (res.resultCd == '000') {
            
            //$('#search-month').trigger('change');
            
        	/* [수정 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 등록 후 레이어 오픈 관련 */
            console.log("[callBack] photoGdasYn :: " + $("#photoGdasYn").val());
            var gdasSeq = $("#gdasSeq").val();
            var imgCnt = $(".swiper-wrapper").find("img").length;

            if(gdasSeq == ""){

            	if($("#photoGdasYn").val() == "N" && $("#gdasPrhbCatCnt").val() != "0"){
        			// 신규등록인 경우 등록 레이어 팝업
        			popLayerOpen("reviewCompleted");
        		} else {
        			// 사진영역 존재하며 사진이 하나이상인경우 그냥 등록완료 화면으로보여짐
        			if(Number(imgCnt) > 0){
        				popLayerOpen("photoCompleted");
        			} else {
        				// 사진은 존재하나 등록하지 않은경우
        				popLayerOpen("rwCompleted");
        				regBtnClickCnt++;
        			}

        		}

            }else{

            	if(mmypage.gdasForm.photoRegYn == "N"){
        			// 수정인경우 등록레이어 팝업
        			popLayerOpen("rwModifyCompleted");
        		} else {

        			// 사진영역 존재하며 사진이 하나이상인경우 그냥 등록완료 화면으로보여짐
        			if(Number(imgCnt) > 0){
        				popLayerOpen("photoCompleted");
        			} else {
        				// 사진은 존재하나 등록하지 않은경우
        				popLayerOpen("reviewCompleted");
        				regBtnClickCnt++;
        			}
        		}

            }

            $("#gdasSeq").val(res.gdasSeq);
            /* [수정 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 등록 후 레이어 오픈 관련 */
            
            //SR 3358020 shlee
            mmypage.gdasList.removeGdasListSession();

        /* [수정 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 금칙어/어뷰징 체크 */
        } else if (res.resultCd == '510') {

            //alert(res.resultMsg);
        	alert("등록이 불가능한 단어가 있습니다. 아름다운 우리말을 사용해주세요.");
        }else if(res.resultCd == '5101') { // 상품명
        	alert("상품명 입력 대신에 고객님의 사용후기를 남겨주시면 더욱 좋을 것 같아요.");
        } else if(res.resultCd == '5102') { // 25자금칙어
        	alert("리뷰 내용에 25 자와 관련 문장입력 대신에 정성이 담긴 리뷰 작성을 부탁드려요.");
        } else if(res.resultCd == '5103') { // 반복 / 패턴 추출 연속 반복 체크
        	alert("동일한 단어(문자) 및 구문을  여러 번 반복하여 입력하셨어요.\n정성이 담긴 리뷰 작성을 부탁드려요!");
        } else if(res.resultCd == '5104') { // 특수문자
        	alert("특수문자를 너무 많이 입력하셨어요.\n정성이 담긴 리뷰 작성을 부탁드려요!");
        } else if(res.resultCd == '5105') { // 스페이스
        	alert("띄어쓰기를 많이 하셨습니다.");
        } else if(res.resultCd == '5106') { // 저음/모음
        	alert("연속되는 자음 또는 모음이 많아요.\n작성하신 리뷰를 다시 확인해주세요!");
        } else if(res.resultCd == '520') { // 해시태그 금칙어 제어
            //alert("[" + res.resultMsg + "] (은)는 금칙어로 입력이 제한됩니다.");
            alert("등록이 불가능한 해시태그 단어가 있습니다 . 아름다운 우리말을 사용해주세요.");
            $("#hashTagCont").val("");
        /* [수정 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 금칙어/어뷰징 체크 */

        } else {
            var msg = "리뷰";
            if ($("#gdasSctCd").val() != "10") {
            	msg = "올영체험단 리뷰";
//                msg = "뷰티테스터 후기";
            }
            alert("리뷰 페이지를 불러오지 못했습니다 다시 시도해주세요");
        }

        mmypage.gdasForm.isProgressive = false;
    },

    // 상품평 만족도 콜백
    chkGdasCallback : function(res) {
        
        var conText = "";
        var conLeng = 0;
        var conLengLimit = 0;
        var conLengMax = 0;
        var gdasTpCdCre = $('#gdasTpCdCre').val();
        var msg = "상품평 작성시 ";

        if (res.resultCd == '000') {

            $('#gdasTpCd').val(gdasTpCdCre);

            var gdasTpCd = $('#gdasTpCd').val();

            conText = $('#txtGdasCont').val().trim();
            conLeng = conText.length;

            // 한줄평 일시
            if (gdasTpCd == '10') {
                msg = "";
                conLengLimt = 5;
            }

            // 일반상품평 일시
            if (gdasTpCd == '20') {
                msg = "리뷰는 최소 ";
                
                if($("#gdasSctCd").val() == "50"){
                    conLengLimt = 50;
                } else {
                    conLengLimt = 25;
                }
                
            }

            // 지울수 있게 추가
            if (conLeng != 0 && conLeng < conLengLimt) {
                alert(msg  +conLengLimt + '자 이상 입력 부탁드립니다');
                return false;
            }

            // 한줄평 일시
            if (gdasTpCd == '10') {
                conText = conText.trim();
                $('#shrtGdasCont').val(conText);
                $('#div_write_short_output').children('a').children('span').text(conText);
                
                if( '' == conText ){
                    $('#div_write_short_output').children('a').children('span').text('한줄 리뷰를 입력해주세요');
                }
            }

            // 일반상품평 일시
            if (gdasTpCd == '20') {
                $('#gdasCont').val(conText);
                $('#gdasLen').val(conLeng);
                $('#div_gdas_reg_output').children('a').children('span').text(conText);
                
                if( '' == conText ){
                    $('#div_gdas_reg_output').children('a').children('span').text('리뷰를 입력해주세요');
                }
                
            }

            // 상품평 구분코드 추가
            if ($('#gdasCont').val() == '' && $('#shrtGdasCont').val() != '') {
                $('#gdasTpCd').val('10');
            } else if ($('#gdasCont').val() != '' && $('#shrtGdasCont').val() == '') {
                $('#gdasTpCd').val('20');
            } else if ($('#gdasCont').val() != '' && $('#shrtGdasCont').val() != '') {
                $('#gdasTpCd').val('30');
            } else if ($('#gdasCont').val() == '' && $('#shrtGdasCont').val() == '') {
                $('#gdasTpCd').val('00');
            }

            // 일반상품평 등록시
            //$('#divEvalGdas').css('display','block');
            //$('#divContReg').css('display','none');
            $('.popContainer').css('display','block');
            $('.pageFullWrap').removeClass('textPage on');
            photo_result_list.update();
            var gdasStep = Number($('#gdasStep').val());

            if ("6" != gdasStep) {
                stepContChk('B');
            }
            
            if( $(location).attr('href').indexOf('#Dummy')  > -1 ){
                history.back();    
            }
            
        } else if (res.resultCd == '510') {
            //alert("[" + res.resultMsg + "] (은)는 금칙어로 입력이 제한됩니다.");
            alert("작성하신 리뷰에 욕설 및 비속어가 포함되어 있습니다. 확인 후 다시 작성 부탁드립니다");
        } else {
            var msg = "리뷰";
            if ($("#gdasSctCd").val() != "10" && $("#gdasSctCd").val() != "60") {
//                msg = "뷰티테스터 후기";
                msg = "올영체험단 리뷰";
            }
            alert("리뷰 페이지를 불러오지 못했습니다. 다시 시도해주세요");
        }

        //mmypage.gdasForm.isProgressive = false;
    },
    
    // 웹 / 아이폰, 안드로이드 앱 이미지 업로드 콜백 (공통) 
    regImgBase64Callback : function(res) {

        console.log('regImgBase64Callback resultMsg : ' + res.resultMsg );
        
        imgCallSize--;
        if (res.resultCode == '00') {
            
            if( $('#btn_photo').css('display') == 'block' ){
                $('#btn_photo').css('display', 'none');
                $('#div_photo_slide').css('display', 'block');
            }
            
            // 첫번째 파일인경우
            if ($("#appxFilePathNm").val() == "") {
                $("#appxFilePathNm").val(res.imgPathNm);
                $("#appxFileNm").val(res.imgNm);
            }
            
            curId = Number($('#emPhoCnt').text()) +1;
            
            var child = document.getElementById('ulImg');
            
            /* [수정 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 업로드 후 버튼 제어 관련 */
            //document.getElementById('imgPlus').remove();
            $("#" + imgAddBtn).children().hide();

            var liId = imgAddBtn.substring(imgAddBtn.indexOf("_") + 1, imgAddBtn.length);

            $("#" + imgAddBtn).append('<span style="display:none">' + res.imgPath + '</span><button id="' + liId + '" class="btn-del">삭제</button><img id="img' + liId + '" src="' + res.imgUrl + '" alt="" />');
            
            
			if($("#" + imgAddBtn).children("span").length > 1){
				
				$.each($("#" + imgAddBtn).children("span"), function(idx, item){
					
					if(idx != 0){
						$(this).remove();
					}
					
				});
				
				$.each($("#" + imgAddBtn).children(".btn-del"), function(idx, item){
					
					if(idx != 0){
						$(this).remove();
					}
					$(this).show();
				});
				
				$.each($("#" + imgAddBtn).children("img"), function(idx, item){
					
					if(idx != 0){
						$(this).remove();
					}
					$(this).show();
				});
				
			}
			
			var imgCnt = $(".swiper-wrapper").find("img").length;
			
            var img0Style = $(".swiper-wrapper").find("#imgPlus_0").children().css("display");
            var img1Style = $(".swiper-wrapper").find("#imgPlus_1").children().css("display");
            var img2Style = $(".swiper-wrapper").find("#imgPlus_2").children().css("display");
            var img3Style = $(".swiper-wrapper").find("#imgPlus_3").children().css("display");
            
            if((imgCnt >= 4 && imgCnt < 10) && img0Style == "none" && img1Style == "none" && img2Style == "none" && img3Style == "none"){
            	
            	var addBtnCnt = 0;
            	$.each($('#ulImg').find(".btnAdd"), function(idx, item){
            		if($(this).css("display") == "inline-block"){
            			addBtnCnt++;
            		}
            	});
            	
            	if(addBtnCnt == 0){
            		$('#ulImg').append('<li id="imgPlus_' + imgIdx + '" class="swiper-slide"><button class="btnAdd btn-add">추가</button></li>');
                	imgIdx++;
            	}
            	
            }
            /* [수정 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 업로드 후 버튼 제어 관련 */

            
            makeImgPath();
            //return json.imgUrl;
            
            if( imgCallSize == 0){
                $('.dim').css('display','none');
                common.hideLoadingLayer();    
            }
        } else if (res.resultCd == '510') {
            //
            $('.dim').css('display','none');
            common.hideLoadingLayer();    
            alert(res.resultMsg);
        } else {
            $('.dim').css('display','none');
            common.hideLoadingLayer();    
            alert('사진 용량은 10MB이하 \n파일형식은 PNG,GIF,\nJPG만 등록 가능합니다');
        }

        //mmypage.gdasForm.isProgressive = false;
    },
    
    // 텍스트 체크 펑션 
    textFunction : function() {
        
        var conText = "";
        var conLeng = 0;
        var conLengLimit = 0;
        var conLengMax = 0;
        var gdasTpCdCre = $('#gdasTpCdCre').val();

        /* [삭제 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 한줄리뷰 삭제 */
        // 한줄상품평
        /*if ("10" == gdasTpCdCre) {

            conLengLimit = 5;
            conLengMax = 30;

            // 일반상품평
        } else if ("20" == gdasTpCdCre) {

            if($("#gdasSctCd").val() == "50"){
                conLengLimit = 50;
                
            } else {
                conLengLimit = 25;
            }
            
            conLengMax = 1000;
        }*/
        /* [삭제 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 한줄리뷰 삭제 */

        if($("#gdasSctCd").val() == "50"){
            conLengLimit = 50;

        } else {
            conLengLimit = 25;
        }

        conLengMax = 1000;

        conText = $('#txtGdasCont').val();
        if(typeof conText != 'undefined'){
        	conLeng = conText.length;
        }

        if (conLengLimit > conLeng) {
            //$('.fix_txtNum').attr('style', 'color:red');
            //$(".count").attr("class", "count error");
            $(".count").addClass("error");
        } else {
            //$('.fix_txtNum').attr('style', 'color:black');
        	//$(".count").attr("class", "count");
        	$(".count").removeClass("error");
        }

        // 최대글자수 이상이면 자르기
        if (conLeng > conLengMax) {
            alert('최대 글자수는 ' + conLengMax + '자입니다. \n' + '(초과된 글자는 자동삭제 후 입력됩니다)');

            $('#txtGdasCont').val(conText.substring(0, conLengMax));
        }

        conText = $('#txtGdasCont').val();
        
        if(typeof conText != 'undefined'){
        	conLeng = conText.length;
        }

        $('.txt_en').text(conLeng);
        
        mmypage.gdasForm.fnValidCheck();
        
    },
    
    quill : null,
    quillTmpImgObj : new Image(),

    editorInit : function() {
        mmypage.gdasForm.quill = new Quill('#editor', {
            modules : {
                // Equivalent to { toolbar: { container: '#toolbar' }}
                toolbar : '#toolbar'
            },
            placeholder : '내용을 입력하세요.(50~1,000자)',
            imageResizeWidth : $("#imgResizeSize").val(),
            tmpImageObj : mmypage.gdasForm.quillTmpImgObj,
            callback : {
                uploadUrl : function(uploadImg) {
                    /*
                     * if ($("#editor img").length >= 5) { alert("이미지는 최대 5개까지
                     * 등록할 수 있습니다."); return; }
                     */
                    
                    //console.log('>>>>>> uploadUrl uploadImg : ' + uploadImg);
                    
                    var curId = 0;

                    var param = {
                        imgFile : uploadImg,
                        imgSize : $('#imgSize').val(),
                        fileNm : $('#appxFileNm').val(),
                    };

                    setJsonCallback = function(jsonObj) {
                        //loadingLayer
                        common.hideLoadingLayer();
                        json = jsonObj;
                    };

                    common.Ajax.sendJSONRequest("POST", _servletUrl + "mypage/gdasImgUploadJson.do", param,
                            setJsonCallback );

                    if (json.resultCode == "00") {
                        
                        if( $('#btn_photo').css('display') == 'block' ){
                            $('#btn_photo').css('display', 'none');
                            $('#div_photo_slide').css('display', 'block');
                        }
                        
                        // 첫번째 파일인경우
                        if ($("#appxFilePathNm").val() == "") {
                            $("#appxFilePathNm").val(json.imgPathNm);
                            $("#appxFileNm").val(json.imgNm);
                        }
                        
                        //console.log('addId = ' + addId + ' | ' + addId.substring(3, 4) );
                        curId = Number(addId.substring(3, 4)) -1;
                        
                        // 빈로우 찾아서 그림 넣기
                        for(var r=0; 10 >= r; r++){
                        
                            if( 'btnAdd' == $('.swiper-slide').children('button').eq(curId).attr('class')  ){
                                $('.swiper-slide').children('button').eq(curId).removeClass('btnAdd');
                                $('.swiper-slide').children('button').eq(curId).addClass('btnDel');
                                $('.swiper-slide').eq(curId).data('imgPath', json.imgPath);
                                $('.swiper-slide').children('img').eq(curId).attr('src', json.imgUrl);
                                break;
                            }else{
                                if( curId > 9){
                                    curId = 0;
                                }else{
                                    curId++;
                                }
                            }
                            
                            if( r == 9  ){
                                console.log('!!!!!!!!!!! chkchkc : ' + curId  );
                            }
                            
                        }

                        /*$('#' + addId + ' > button').removeClass('btnAdd');
                        $('#' + addId + ' > button').addClass('btnDel');
                        $('#' + addId).data('imgPath', json.imgPath);
                        $('.txtArea_box #' + addId + 's').attr('src', json.imgUrl);*/
                        
                        makeImgPath();

                        return json.imgUrl;
                    } else {
                        console.log(json.resultMsg);
                        
                        alert('사진 용량은 10MB이하 \n파일형식은 PNG,GIF,\nJPG만 등록 가능합니다');
                        return "";
                    }
                }
            }
        });

        $(".review_editor").find("#toolbar").find("button").bind("click", function() {
            mmypage.gdasForm.quill.blur();
        });

        $("#editor").bind("keydown", function(e) {
            if ($("#editorStrCnt").text() >= 1000) {
                if (e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 116) {

                } else {
                    return false;
                }
            }
        });

        $("#editor").bind(
                "keyup focusout",
                function() {
                    var txt = unescape(escape(
                            $("#editor .ql-editor").text().trim().replace(/\t/g, "").replace(/\n/g, "").replace(/\r/g,
                                    "")).replace(/%u200B/g, ""));
                    $("#editorStrCnt").text(txt.length.numberFormat());

                    if (txt.length > 1000) {
                        alert("프리미엄 상품평은 1,000자까지 작성 가능합니다");

                        mmypage.gdasForm.quill.history.undo();
                        txt = unescape(escape(
                                $("#editor .ql-editor").text().trim().replace(/\t/g, "").replace(/\n/g, "").replace(
                                        /\r/g, "")).replace(/%u200B/g, ""));
                        $("#editorStrCnt").text(txt.length.numberFormat());
                        console.log(txt.length.numberFormat());
                    }

                });

        $("#editor").on("paste", function(e) {

            var html = e.originalEvent.clipboardData.getData('text/html');

            if (html.match(/<img[^>]*>/gi) != null) {
                alert("이미지는 붙여넣을 수 없습니다. 상단 이미지 업로드 버튼을 이용하시기 바랍니다");
                return false;
            }

            $("#editor").keyup();
        });

    },

    textareaInit : function() {
        $("#gdasContInput").bind("keyup focusout paste", function() {
            $("#editorStrCnt").text($("#gdasContInput").val().trim().length);
            if ($("#editorStrCnt").text() >= 50) {
                alert("한줄 상품평은 49자까지만 작성 가능합니다.\n50자 이상인 경우 프리미엄 상품평으로 작성하시고 최대 150P 받으세요");
                $("#gdasContInput").val($("#gdasContInput").val().trim().substring(0, 49)); // Mantis
                                                                                            // 0000829
                                                                                            // (2018/03/20)
            }
        });

    },
    
    /* [추가 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 유효성 체크 */
    //리뷰 필수값(별점, 만족도, 글자수25자) 유효성 체크
    fnValidCheck : function(){

    	//별점 유효성 체크
    	var gdasStarValid = false;

    	if(Number($(".on > .star").length) > 0){
    		gdasStarValid = true;
    	}

    	//만족도 조사 유효성 체크
    	var $satiUlTag = $(".satisfaction_area").find("ul");
    	var arrSatiValid = new Array($(".satisfaction_area").find("ul").length);
    	for(var i=0; i<arrSatiValid.length; i++){
    		arrSatiValid[i] = false;
    	}

    	$.each($satiUlTag, function(i, ulItem){

    		$.each($satiUlTag.find("input[name=sati_type" + (i+1) +"]"), function(j, liItem){

    			if($(this).prop("checked")){
    				arrSatiValid[i] = $(this).prop("checked");
    			}

    		});

    	});

    	var cnt = 0;
    	for(var i=0; i<arrSatiValid.length; i++){

    		var tmp = arrSatiValid[i];
    		if(!tmp){
    			cnt++;
    		}

    	}


    	//글자수 25자 유효성 체크
    	var chrLengthValid = false;
    	var conText = "";
    	var conLeng = 0;
    	
    	if(typeof $('#txtGdasCont').val() != 'undefined'){
    		conText = $('#txtGdasCont').val().trim();
    		conLeng = conText.length;
    	}
    	
    	if($("#gdasSctCd").val() == "50"){	//올영체험단 리뷰인 경우
    		
    		if(Number(conLeng) >= 50){
        		chrLengthValid = true;
        	}

    	}else{	//일반리뷰인 경우

    		if(Number(conLeng) >= 25){
        		chrLengthValid = true;
        	}

    	}

    	//리뷰 제한 카테고리인 경우
    	if($("#gdasPrhbCatCnt").val() != "0"){
    		chrLengthValid = true;
    	}

    	//console.log("별 :: " + gdasStarValid + " / 25자 :: " + chrLengthValid + " / 만족도 :: " + cnt);
    	if(gdasStarValid && chrLengthValid && cnt == 0){
    		
			//작성하기
    		if($("#gdasSeq").val() == null || $("#gdasSeq").val() == "" || $("#gdasSeq").val().length < 1){

    			$('.rw-floating-bottom').find('.btn-add').prop('disabled', false);

    		//작성하기(등록 완료 후 사진등록 선택 했을 경우)
    		}if(($("#gdasSeq").val() != null || $("#gdasSeq").val() != "" || $("#gdasSeq").val().length > 0) && regBtnClickCnt > 0){

    			$('.rw-floating-bottom').find('.btn-add').prop('disabled', false);

    		//수정하기
    		}else if(($("#gdasSeq").val() != null && $("#gdasSeq").val().length > 0) && $("#modYn").val() == "Y"){

    			$('.rw-floating-bottom').find('.btn-modify').prop('disabled', false);

    		//수정불가
    		}else{

    		}
    			
    		//console.log("good");
    		return true;

    	}
    	
		//작성하기
		if($("#gdasSeq").val() == null || $("#gdasSeq").val() == "" || $("#gdasSeq").val().length < 1){

			$('.rw-floating-bottom').find('.btn-add').prop('disabled', true);

		//작성하기(등록 완료 후 사진등록 선택 했을 경우)
		}if(($("#gdasSeq").val() != null || $("#gdasSeq").val() != "" || $("#gdasSeq").val().length < 1) && regBtnClickCnt > 0){

			$('.rw-floating-bottom').find('.btn-add').prop('disabled', true);

		//수정하기
		}else if(($("#gdasSeq").val() != null && $("#gdasSeq").val().length > 0) && $("#modYn").val() == "Y"){

			$('.rw-floating-bottom').find('.btn-modify').prop('disabled', true);

		}
    		
    	//console.log("bad");
    	return false;
    }
    /* [추가 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 유효성 체크 */


};

// 상품평 만족도 선택답변값 변환처리
regGdasEvalRst = function() {

    var gdasCnt = 0;
    var gdasVal = "";
    var gdasQstCd = "";
    var gdasQstCont = "";
    var gdasTotVal = "";
    var gdasCont = "";

    gdasCnt = $('.satisfaction_area .inner').children('ul').length;

    for (var qi = 1; gdasCnt + 1 > qi; qi++) {
        gdasVal = $('input[name="sati_type' + (qi) + '" ]:checked').val();
        gdasQstCd += $('.satisfaction_area .inner').children('ul').eq(qi - 1).attr('value') + ",";

        // var gdasCont = "";

        if (undefined == gdasVal) {
            gdasTotVal += "0,";
        } else {
            gdasTotVal += gdasVal + ",";
            gdasQstCont += $('.satisfaction_area .inner').children('ul').eq(qi - 1).children('span').attr('value')
                    + "-";
            gdasQstCont += $('input[name="sati_type' + (qi) + '" ]:checked').parent().children('label').html() + ". ";
        }
    }

    $('#gdasQstCont').val(gdasQstCont);

    gdasTotVal = gdasTotVal.substring(0, gdasTotVal.length - 1);
    gdasQstCd = gdasQstCd.substring(0, gdasQstCd.length - 1);

    // $("#gdasCnt").val(gdasCnt);
    $("#gdasTotVal").val(gdasTotVal);
    $("#gdasQstCd").val(gdasQstCd);
}

//layer 팝업
function donePopLayerOpen(str) {

    var winH = $(window).height() / 2;
    var popLayer = $("#rwCompleted");

    if("reviewCompleted" == str){
    	popLayer = $("#reviewCompleted");
    }
    
    $(popLayer).find('.popCont').css({
        'max-height' : winH
    });

    var popPos = $(popLayer).height() / 2;
    var popWid = $(popLayer).width() / 2;
    $(popLayer).css({
        'left' : '50%',
        'margin-left' : -(popWid),
        'top' : '50%',
        'margin-top' : -(popPos)
    }).show().parents('body').css({
        'overflow' : 'hidden'
    });
    $('.dim').css('display','block');

    $(window).resize(function() {
        winH = $(window).height() / 2;
        $(popLayer).find('.popCont').css({
            'max-height' : winH
        });
        popPos = $(popLayer).height() / 2;
        popWid = $(popLayer).width() / 2;
        $(popLayer).css({
            'left' : '50%',
            'margin-left' : -(popWid),
            'top' : '50%',
            'margin-top' : -(popPos)
        })
    });
};

// layer 팝업
function reviewPopLayerOpen() {

    var winH = $(window).height() / 2;
    var popLayer = $("#review_notice");
    $(popLayer).find('.popCont').css({
        'max-height' : winH
    });

    var popPos = $(popLayer).height() / 2;
    var popWid = $(popLayer).width() / 2;
    $(popLayer).css({
        'left' : '50%',
        'margin-left' : -(popWid),
        'top' : '50%',
        'margin-top' : -(popPos)
    }).show().parents('body').css({
        'overflow' : 'hidden'
    });
    $('.dim').show();

    $(window).resize(function() {
        winH = $(window).height() / 2;
        $(popLayer).find('.popCont').css({
            'max-height' : winH
        });
        popPos = $(popLayer).height() / 2;
        popWid = $(popLayer).width() / 2;
        $(popLayer).css({
            'left' : '50%',
            'margin-left' : -(popWid),
            'top' : '50%',
            'margin-top' : -(popPos)
        })
    });
};

function reviewPopLayerClose() {
    var popLayer = $("#review_notice");
    $(popLayer).hide().parents('body').css({
        'overflow-y' : 'auto'
    });
    $('.dim').hide();
};

function reviewCompPopLayerClose() {
    var popLayer = $("#reviewCompleted");
    $(popLayer).hide().parents('body').css({
        'overflow-y' : 'auto'
    });
    $('.dim').hide();
};

/* [추가 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 등록/수정 시 레이어 팝업 제어 */
//layer 팝업
function popLayerOpen (target){
  var winH = $(window).height()/2;
  var popLayer = $("#" + target);
  $(popLayer).find('.popCont').css({'max-height': winH});

  var popPos = $(popLayer).height()/2;
  var popWid = $(popLayer).width()/2;
  $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)}).show().parents('body').css({'overflow' : 'hidden'});
  $('.dim').show();
  /*$('.dim').bind('click', function(){
      common.popLayerClose(popLayer);
  });*/
  
  $(window).resize(function(){
      winH = $(window).height()/2;
      $(popLayer).find('.popCont').css({'max-height': winH});
      popPos =$(popLayer).height()/2;
      popWid = $(popLayer).width()/2;
      $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)})
  });
  //sns 별도처리
  /*if(IdName =='SNSLAYER'){
      $(popLayer).css({'left':'0' , 'margin-left': '0'})
  }*/
};

function popLayerClose (target){
  var popLayer = $("#" + target);
  $(popLayer).hide().parents('body').css({'overflow-y' : 'auto'});
  $('.dim').hide();
};

//리뷰 등록 완료 시 팝업에서 사진등록 버튼 클릭 시
$(".btnPhotoReg").on("click", function(){

	//$("#rwCompleted").hide();
	//$('.dim').hide();
	var popLayer = $("#rwCompleted");
	$(popLayer).hide().parents('body').css({'overflow-y' : 'auto'});
	$(".dim").hide();

	mmypage.gdasForm.photoRegYn = "Y";

	movingScroll("#rwReviewStep4");

});

//사진파일첨부하기로 스크롤 이동
function movingScroll(id){
	var plus = 50;
	var $targetOffset = $(id)[0].offsetTop - plus;
	var $rwReviewForm = $('.rw-form-wrap');

	$rwReviewForm.animate({'scrollTop': $targetOffset}, 500);
}
/* [추가 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 등록/수정 시 레이어 팝업 제어 */

imgDraw = function() {

    var uploadUrl = $('#gdasImgUploadUrl').val();
    var FilePahtNm = $('#appxFilePathNm').val();
    var arrFilePathNm = FilePahtNm.split(',');
//    console.log('>>>>>FilePahtNm : ' + FilePahtNm);
    var setimgCnt = arrFilePathNm.length;
//    console.log('>>>>>setimgCnt : ' + setimgCnt);

    var imgObj = $('.swiper-wrapper').children('li');
    var imgCnt = imgObj.length;
    var arrImg = imgObj.childNodes;
    var imgId = 0;
    
    /* [추가 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 파일 디스플레이 수정 */
    var imgUploadUrl = $("#imgUploadUrl").val();

    if(setimgCnt >= 0 && setimgCnt < 5){
    	
    	for(var i=0; i<4; i++){	//기본적으로 이미지 li 생성

    		$('.swiper-wrapper').append('<li id="imgPlus_' + i + '" class="swiper-slide"><button class="btnAdd btn-add">추가</button></li>');

    	}
    	
    	imgIdx = 5;
    	
    }else{
    	
    	for(var i=0; i<setimgCnt; i++){	//기본적으로 이미지 li 생성

    		$('.swiper-wrapper').append('<li id="imgPlus_' + i + '" class="swiper-slide"><button class="btnAdd btn-add">추가</button></li>');

    	}
    	
    	imgIdx = setimgCnt + 1;
    	
    }
	/* [추가 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 파일 디스플레이 수정 */
    
    if (FilePahtNm != '') {
        /*document.getElementById('imgPlus').remove();

        for (var row = 0; setimgCnt > row; row++) {
            imgId = row+1;
            $('#ulImg').append('<li class="swiper-slide" id="img'+imgId+'" ><span style="display:none">'+arrFilePahtNm[row]+'</span><button id="'+imgId+'" class="btnDel">삭제</button><img id="img'+imgId+'s" class="imgGdasWrite" src="'+uploadUrl + arrFilePahtNm[row]+ '"></li>');
        }
        
        if(10 > setimgCnt  ){
            $('#ulImg').append('<li class="swiper-slide" id="imgPlus" ><button class="btnAdd">추가</button></li>');    
        }*/
    	/* [수정 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 파일 디스플레이 수정 */
        for(var row=0; row<setimgCnt; row++){

        	var $fileLiTag = $(".swiper-wrapper").find("#imgPlus_" + row);

        	$fileLiTag.children().hide();

        	
        	if($("#gdasSeq").val() == null || $("#gdasSeq").val() == "" || $("#gdasSeq").val().length < 1){

        		$fileLiTag.append('<span style="display:none">' + arrFilePathNm[row] + '</span><button id="' + row + '" class="btn-del">삭제</button><img id="img' + row + '" src="' + imgUploadUrl + arrFilePathNm[row] + '" alt="" />');

    		}else if(($("#gdasSeq").val() != null && $("#gdasSeq").val().length > 0) && $("#modYn").val() == "Y"){

    			$fileLiTag.append('<span style="display:none">' + arrFilePathNm[row] + '</span><button id="' + row + '" class="btn-del">삭제</button><img id="img' + row + '" src="' + imgUploadUrl + arrFilePathNm[row] + '" alt="" />');

    		//수정불가
    		}else{
    			
    			$fileLiTag.append('<span style="display:none">' + arrFilePathNm[row] + '</span><img id="img' + row + '" src="' + imgUploadUrl + arrFilePathNm[row] + '" alt="" />');

    		}
        	
        }

        if(4 <= setimgCnt && 10 > setimgCnt){
        	$('#ulImg').append('<li id="imgPlus_' + setimgCnt + '" class="swiper-slide"><button class="btnAdd btn-add">추가</button></li>');
        }
        /* [수정 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 파일 디스플레이 수정 */
        
        $('#emPhoCnt').text(setimgCnt);
    }

};

// 화면 보이기 관리
stepCont = function(vStep) {
    
    // 전 스텝을 기억
    $('#pgdasStep').val( $('#gdasStep').val() );

    if (undefined != vStep) {
        $('#gdasStep').val(vStep);
    }

    var gdasStep = Number($('#gdasStep').val());
    var FilePahtNm = $('#appxFilePathNm').val();
    var conText = $('#gdasCont').val();
    
    // 초기 모두 display:none
    $('#div_satisfaction_input').css('display','none');
    $('#div_satisfaction_output').css('display','none');
    $('#div_gdas_reg').css('display','none');
    $('#div_gdas_reg_output').css('display','none');
    $('#div_photo_reg').css('display','none');
    $('#div_photo_output').css('display','none');
    $('#div_write_short').css('display','none');
    $('#div_write_short_output').css('display','none');

    var con = document.getElementById("btnType1");
    con.style.display = 'none';
    
    $('#btnType2').css('display','none');
    $('#btnType3').css('display','none');
console.log('=========>>> ' + gdasStep);
    // 첫번재 단계일시 만족도 등록
    if (gdasStep == 1) {
        $('#div_satisfaction_input').css('display', 'block');
        
        // 상품평 등록 제한이 아닐경우만 가능
        console.log('step 1 : ' + $("#gdasPrhbCatCnt").val() );
        if( $("#gdasPrhbCatCnt").val() == "0" ){
            
            $('#btnType2').css('display','block');
        }else{
            
            $('#btnType3').css('display','block');
        }
    }

    // 두번재 단계일시 일반상품평 등록
    if (gdasStep > 1   ) {
        
        $('#div_satisfaction_output').css('display', 'block');
        
        if( "" != $('#gdasQstCont').val() ){
            
            $('#div_satisfaction_output').children('a').children('span').css('display','none');

            $('#ulSati li').remove();
            
            var arrSati = $('#gdasQstCont').val().split('. ');
            for (var row = 0; arrSati.length > row; row++) {
                $('#ulSati').append('<li>'+ arrSati[row] +'</li>');
            }
        }
        
        // 만족도 질문이 없을경우 감추기
        if( 0 == $('#div_satisfaction_input').children('div').children('ul').length){
            $('#div_satisfaction_output').css('display','none');
        }
        
        // 상품평 등록 제한이 아닐경우만 가능
        if( $("#gdasPrhbCatCnt").val() == "0" ){
            
            if ("" != conText) {
                $('#div_gdas_reg_output').css('display', 'block');
            } else {
                $('#div_gdas_reg').css('display', 'block');
            }
            
            $('#btnType1').css('display', 'block');

        }
        
    }

    // 세번재 단계일시 사진 등록
    if (gdasStep > 2) {
        
        console.log('step 3 conText : ' + conText);
        
        // 상품평 등록 제한이 아닐경우만 가능
        if( $("#gdasPrhbCatCnt").val() == "0" ){
            $('#div_gdas_reg').css('display','none');
            $('#div_gdas_reg_output').css('display', 'block');
            $('#div_photo_reg').css('display', 'block');
            
            // 앱일경우 버튼 보이기
            if( common.app.appInfo.isapp ){
                $('#btn_photo').css('display', 'block');
            }else{
                $('#div_photo_slide').css('display', 'block');
            }
            
            if ('' != FilePahtNm) {
                $('#div_photo_reg').find('P').css('display','none');
            }
        }

        $('#btnType1').css('display', 'block');
    }

    // 네번재 단계일시 한줄요약 등록
    if (gdasStep > 3) {

        var conText = $('#shrtGdasCont').val();

        if ('' == FilePahtNm) {
            $('#div_photo_reg').css('display','none');
            $('#div_photo_output').css('display', 'block');
            
        } else {
            $('#div_photo_reg').css('display', 'block');
            $('#div_photo_output').css('display','none');
            $('#div_photo_reg').addClass('line');
            $('#div_photo_slide').css('display', 'block');
        }
        
        // 상품평 등록 제한이 아닐경우만 가능
        if( $("#gdasPrhbCatCnt").val() == "0" ){
            $('#div_write_short').css('display', 'block');
            $('#btnType1').css('display', 'block');
        }else{
            $('#div_photo_reg').css('display','none');
            $('#div_photo_output').css('display','none');
        }
        
    }

    // 다섯번재 단계일시 상품평 완료
    if (gdasStep > 4) {
        
        // 상품평 등록 제한이 아닐경우만 가능
        if( $("#gdasPrhbCatCnt").val() == "0" ){
            $('#div_write_short').css('display','none');
            $('#div_write_short_output').css('display', 'block');  
        }

        $('#btnType1').css('display','none');
        $('#btnType2').css('display','none');
        $('#btnType3').css('display', 'block');
    }

    var cnt = ($("#gdasScrVal").val() == "" ? 0 : $("#gdasScrVal").val()) / 2;
    console.log('>>>>>>> cnt : ' + cnt);
    gdasStep += 1;
    
    $('#gdasStep').val(gdasStep);
    
    if (undefined == vStep) {
        $('#pgdasStep').val(gdasStep);    
    }

    if (cnt > 0) {
        // 클릭 이벤트로 대체
        $('.review_star button').eq(cnt - 1).trigger('click');
    }
    
    console.log('>>>>>>> last  gdasStep : ' + gdasStep);
    
    // 상품평 등록 제한일겨우 강제로 다음단계로
    if( $("#gdasPrhbCatCnt").val() != "0" &&( gdasStep == 3 || gdasStep == 4 || gdasStep == 5 )  ){
        stepCont();
        // 첫번째 단계이고 만족도 질문 없을시 
    }else if( $("#gdasPrhbCatCnt").val() == "0" && gdasStep == 2 && $('#prGdasEvalListSize').val() == '0' ){
        stepCont();
    }
    
}

// 상품평(TEXT) 등록일시 스텝 넘기기
stepContChk = function(cStep) {
    
    var gdasStep = Number($('#pgdasStep').val());
    
    /* 일반 상품평or한줄상품평일시 상품평 작성 완료후 쓴글이 나타나지 않는현상 대처방안 */
    var gdas = Number($('#gdasStep').val());
    if(cStep == 'B' && (gdas == 3 || gdas == 5)) {
        gdasStep = $('#gdasStep').val();
    }

    // 만족도 점검일시 현재스텝이 1이 아니면 나가리
    if( 'A' == cStep && '2' != gdasStep ){
        stepCont(gdasStep-1);
        return false;
    }
    
    // 일반상품평 등록일시 현재스텝이 3이 아니면 나가리 한줄상품평 등록일시 현재스텝이 5 아니면 나가리
    if( 'B' == cStep &&  (  '3' != gdasStep && '5' != gdasStep ) ){
        return false;
    }
    
    stepCont();
    
}

// 쓰기영역 관리
txtContMng = function(gdasTpCre) {
    
    $("#gdasTpCdCre").val(gdasTpCre);

    var gdsCont = "";
    var initTxt = "";

    console.log('chk >>>>>>> gdasTpCre : ' + gdasTpCre);

    // 일반상품평 등록시
    if ("20" == gdasTpCre) {
        gdsCont = $('#gdasCont').val();
        initTxt = '고객님의 소중한 리뷰를 남겨주세요.';
        $('#maxText').text('/ 1000자');
        

        // 한줄상품평 등록시
    } else if ("10" == gdasTpCre) {
        gdsCont = $('#shrtGdasCont').val();
        initTxt = '고객님의 소중한 한줄 리뷰를 남겨주세요.';
        $('#maxText').text('/ 30자');
    }

    if ("" == gdsCont) {

        // 가려진 상태면 보이기
        if ($('#pContTit').css('display') == 'none') {
            $('#pContTit').show();
        }

        $('#pContTit').text(initTxt);
        $('.fix_txtNum').attr('style', 'color:red');
        $('.txt_en').text(0);

    } else {
        $('.fix_txtNum').attr('style', 'color:black');
        $('.txt_en').text(gdsCont.length);
    }
    
    

    $('.txtArea_box #txtGdasCont').val(gdsCont);

    $('#divEvalGdas').css('display','none');
    $('#divEvalGdasBtn').css('display','none');
    
    if( 0 > $(location).attr('href').indexOf('#Dummy') ){
        history.pushState(null, null, window.location.href + '#Dummy');    
    }
    
    $('#writeYn').val('Y');
       
    $('#divContReg').css('display','block');
    $('.pageFullWrap').addClass('textPage on');
    $('body').addClass('scrollFix');
    
    if ("" == gdsCont) {
        $('#txtGdasCont').focus();
    }
    
    $('html, body').scrollTop(1);
    $(window).scroll(function() {
        if ($(document).scrollTop() <= 0) {
            $('html, body').scrollTop(1);
           $("html").css({"touch-action": "pan-down"});
        }
     });
    //$('.popContainer').css('display','none');
    
}

makeImgPath = function() {

    var imgObj = $('.swiper-wrapper').children('li');
    var imgCnt = 0;
    
    /* [수정 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 제어 관련 */
    //var liCnt = imgObj.length;
    var liCnt = $('.swiper-wrapper').find("img").length;
    if(liCnt < 4){
    	liCnt = 4;
    }
    /* [수정 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 제어 관련 */

    var arrImg = imgObj.childNodes;

    var pathNm = "";
    var fileNm = "";
    var imgNm = "";

    $("#photoGdasYn").val("N");
    // 등록이미지가 있다면 저장 처리 하고 분기
    console.log('liCnt : ' + liCnt );
    

    for (var row = 0; liCnt > row; row++) {
        
        imgNm = $(imgObj[row]).children('span').html();
        
        if(row < 4 && undefined == imgNm){
			liCnt++;
		}

        if (undefined != imgNm && '' != imgNm) {
            imgCnt += 1;
            pathNm += $(imgObj[row]).children('span').html() + ",";
        }

    }
    
    console.log('imgCnt : ' + imgCnt );
    
    $('#emPhoCnt').text(imgCnt);

    if (imgCnt > 0) {
        $("#photoGdasYn").val("Y");

        if (pathNm.length > 1) {
            pathNm = pathNm.substring(0, pathNm.length - 1);
        }
    }

    $("#appxFilePathNm").val(pathNm);
}


$('#btnDoneConfirm').click(function() {
    
    var retUrl = $("#retUrl").val();
    
    if (retUrl != "" && 0 > retUrl.indexOf('getGoodsDetail') ) {
        document.location.href = retUrl;
    } else {
        if ($("#gdasSctCd").val() == "10") {
            document.location.href = _baseUrl + 'mypage/getGdasList.do';
        } else {
            document.location.href = _baseUrl + 'mypage/getGdasList.do';
        }
    }
    
});

// 아이폰 앱 10 이상 이미지 콜백
callbackImagePath = function(jsonString) {
    
    if (jsonString  == null || undefined == jsonString ) {
        $('.dim').css('display','none');
        common.hideLoadingLayer();
         return false;
    }
    
    if ($("#mLoading").length == 0) {
        common.showLoadingLayer(false);
    }
    
    //var arrImg64 = JSON.parse(jsonString);
    var arrImg64 = jsonString;
    
    var imgCur = 0;
    var imgSize = arrImg64.length;
    var tImg64 = '';
    var uploadImg = "";
    var fileInput    = document.querySelector('input.ql-image[type=file]');
    var canvasImg = document.getElementById('tmpEvalCanvas');
    var imageResizeWidth = 505;
    //var tmpImg = new Image();
    var tmpImg = document.getElementById('tmpImg');
    imgCallSize = imgSize;
    
    tmpImg.src = '';
    
    tmpImg.onload = function(e) {
        
        var ctx = canvasImg.getContext('2d');
        
        //배율
        var magnification = 1;
        
        if (tmpImg.width > imageResizeWidth) {
            magnification =imageResizeWidth / tmpImg.width;
        }
        
        canvasImg.width = tmpImg.width * magnification;
        canvasImg.height = tmpImg.height * magnification;

        ctx.imageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        
        ctx.drawImage(tmpImg, 0, 0, canvasImg.width, canvasImg.height);    
        uploadImg = canvasImg.toDataURL();
        
       // 상품평 이미지 업로드
       imgUploadAjax(uploadImg);
       
       if(imgSize > imgCur){
           
           tImg64 = arrImg64[imgCur];
           
           if( 'J' == tImg64.substring(0, 1) ){
               tmpImg.src = 'data:image/jpeg;base64,' +tImg64.substring(1, tImg64.length);    
           }else if( 'P' == tImg64.substring(0, 1) ){
               tmpImg.src = 'data:image/png;base64,' +tImg64.substring(1, tImg64.length);    
           }else if( 'G' == tImg64.substring(0, 1) ){
               tmpImg.src = 'data:image/gif;base64,' +tImg64.substring(1, tImg64.length);    
           }else{
               $('.dim').css('display','none');
               common.hideLoadingLayer();
               
               alert('사진 용량은 10MB이하 \n파일형식은 PNG,GIF,\nJPG만 등록 가능합니다.');
               return false;
           }
           imgCur++;    
       }
    }
    
    if(imgCur==0){
        tImg64 = arrImg64[imgCur];
        if( 'J' == tImg64.substring(0, 1) ){
            tmpImg.src = 'data:image/jpeg;base64,' +tImg64.substring(1, tImg64.length);    
        }else if( 'P' == tImg64.substring(0, 1) ){
            tmpImg.src = 'data:image/png;base64,' +tImg64.substring(1, tImg64.length);    
        }else if( 'G' == tImg64.substring(0, 1) ){
            tmpImg.src = 'data:image/gif;base64,' +tImg64.substring(1, tImg64.length);    
        }else{
            $('.dim').css('display','none');
            common.hideLoadingLayer();
            
            alert('사진 용량은 10MB이하 \n파일형식은 PNG,GIF,\nJPG만 등록 가능합니다.');
            return false;
        }
        
        imgCur++;
    }
};

$('#back_Hist').click(function() {     
     // [상품평개편] 클릭 지표 추가 - 2019.4.11
     // 상품평쓰기 > back버튼     
     var gdasStepChk = $("#gdasStep").val();
     
     try{ 
        if(gdasStepChk != null){
             // 별점/만족도 입력
             if(gdasStepChk == '2'){
                 n_click_logging(_baseUrl + "?clickspace=gdas_write_1st");
             // 삼풍평 텍스트 입력
             }else if(gdasStepChk == '3'){
                 if( $(location).attr('href').indexOf('#Dummy')  <= -1 ){
                     n_click_logging(_baseUrl + "?clickspace=gdas_write_2nd");
                 }
             // 포토 등록
             }else if(gdasStepChk == '4'){
                 n_click_logging(_baseUrl + "?clickspace=gdas_write_3rd");
             // 한줄상품평 입력
             }else if(gdasStepChk == '5'){
                 if( $(location).attr('href').indexOf('#Dummy')  <= -1 ){
                     n_click_logging(_baseUrl + "?clickspace=gdas_write_4th");
                 }
             }             
         }    
     }catch(e){}    

    // 상품평 입력 페이지라면 
    if(  $('#divContReg').css('display') == 'block' ){        
        $('#divEvalGdas').css('display','block');
        $('#divEvalGdasBtn').css('display','block');
        $('#divContReg').css('display','none');
        $('.popContainer').css('display','block');
        $('.pageFullWrap').removeClass('textPage on');
        $('body').removeClass('scrollFix');
        $('html').removeAttr('style');
        photo_result_list.update();
        
        if( $(location).attr('href').indexOf('#Dummy')  > -1 ){
            $('#writeYn').val('N');
            history.back();    
        }
        
    }else{
        history.back();
    }
});

var photo_result_list = new Swiper('.photo_result_list', {
    observer: true, 
    observeParents: true,
    slidesPerView: 'auto',
    scrollbar: '.swiper-scrollbar',
    scrollbarHide: false,
});

//상품평 이미지 업로드
imgUploadAjax = function(uploadImg) {
	console.log(uploadImg)
    
    var param = {
            imgFile : uploadImg,
            imgSize : $('#imgSize').val(),
            fileNm : $('#appxFileNm').val(),
        };
        
    common.Ajax.sendRequest("POST", _baseUrl + "mypage/gdasImgUploadJson.do", param,
                mmypage.gdasForm.regImgBase64Callback, false);

};

// 이미지 추가하기
$(document).on("click",".btnAdd",function(e){
    
	imgAddBtn = $(this).closest("li").attr("id");
	
     // 파일 첨부 버튼 클릭 이벤트 >> 앱인 경우 스킴 호출하도록 
    if (common.app != undefined  && common.app.appInfo != undefined && common.app.appInfo.isapp) {
          // 안드로이드 인 경우에만 스킴적용 XXX
        
        var tempCompareVersion = "";
        
         // IOS 일시
         if (common.app.appInfo.ostype == "10") {
             tempCompareVersion = '2.1.3'; // ios
             // 앱버전 비교
             var varCompareVersion = common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion);
             
             if(varCompareVersion  ==  "<" || varCompareVersion == "="){
                 $('#evalfile').click();
             }else{
                 $('.dim').css('display','block');
                 common.showLoadingLayer(false);
                 location.href = "oliveyoungapp://openMultiPhotoLib ";    
             }
             
         // 안드로이드 일시
         }else if (common.app.appInfo.ostype == "20") {
             //tempCompareVersion = '2.0.9'; // android
             //alert('and compareRst : ' + common.app.appInfo.osver.substring(0,1)  );
             
              // 안드로이드 5.0 미만에서만 스킴적용
             if(common.app.appInfo.osver.indexOf(".") > -1){
                 var aosAppVersion = common.app.appInfo.osver.split(".")[0];
                 if(aosAppVersion < 5){
                     common.app.callImgSelector();
                 }else{
                     $('#evalfile').click();
                 }
             }else{
                 $('#evalfile').click();
             }
//              if (common.app.appInfo.osver.substring(0,1) < 5) {
//                  common.app.callImgSelector();
//              } else {
//                  $('#evalfile').click();
//              }
              
          // 이외의 경우    
          } else {
              $('#evalfile').click();
          }
      } else {
          $('#evalfile').click();
      }
});

// 확대사진 닫기
$(document).on("click",".btnClose2",function(e){
    history.back();
});

// 이미지 키우기
//imgZoom = function(e){
$(document).on("click",".imgGdasWrite",function(e){
    
    console.log('chk ::: ' );
    console.log(this.src);
    
    // 추가 이미지 버튼일시 넘기기
    if( '' == this.src ){
        return false;
    }
    
    history.pushState(null, null, window.location.href + '#Dummy');
    $('#writeYn').val('P');
    $('#divFull').css('display','none');
    $('#divPhotoDetail').css('display','block');
    $('#imgReviewPhoto').attr('src',this.src );
    
    /*
    $("#appxFilePathNm").val();
    
    e.preventDefault();
    sessionStorage.setItem("gdasSession", true);
    //var data_value = $(this).find('img.thum').attr('data-value').split('_');
    var target_url = _baseUrl + "mypage/getGdasEvalPhotoDetailPop.do";
    target_url += "?viewType=personal&goodsNo="+$("#goodsNo").val()+"&gdasSeq="+$("#gdasSeq").val()+"&fileSeq="+this.id.substring(3, 4) + "&fileNm=" +$("#appxFilePathNm").val();
    window.location.href = target_url;*/
});

//사진 지우기
$(document).on("click",".btn-del",function(e){
    e.stopImmediatePropagation();
    var imgId ='img' +  this.id;
    var imgObj = document.getElementById(imgId);
    
    if( null == imgObj ){
        return false;
    }
    
    //$('#spImgCnt').text($('#ulImg li').length-1);
    
    /* [수정 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 삭제 */
    //imgObj.parentNode.removeChild(imgObj);

    var delBtnNum = $(this).attr("id");
    
    $("#imgPlus_" + delBtnNum).children("#" + delBtnNum).remove();	//삭제버튼 삭제
    $("#imgPlus_" + delBtnNum).children("span").remove();	//이미지경로명 삭제
    $("#imgPlus_" + delBtnNum).children("img").remove();	//이미지 삭제


    var imgObj = $('.swiper-wrapper').children('li');
    //var imgCnt = imgObj.length;
    var imgCnt = $(".swiper-wrapper").find("img").length;


    var setimgCnt = Number($('#emPhoCnt').text());
    //console.log("img cnt :: " + setimgCnt);

    if(delBtnNum < 4){

        $("#imgPlus_" + delBtnNum).children().show();	//추가버튼 노출
        
        if($("#ulImg").children("li").last().index() >= 4 && $("#ulImg").children("li").last().index() <= 9){
        	
    		if($("#ulImg").children("li").find(".btnAdd").last().css("display") == "inline-block"){
    			$("#ulImg").children("li").last().remove();	//마지막(li) 추가 버튼 제거
    		}
        	
        }

    }else{
    	
    	var img0Style = $(".swiper-wrapper").find("#imgPlus_0").children().css("display");
        var img1Style = $(".swiper-wrapper").find("#imgPlus_1").children().css("display");
        var img2Style = $(".swiper-wrapper").find("#imgPlus_2").children().css("display");
        var img3Style = $(".swiper-wrapper").find("#imgPlus_3").children().css("display");
        var imgLastStyle = $(".swiper-wrapper").children().last().children().css("display");
        
   		$("#imgPlus_" + delBtnNum).remove();	//li 태그  삭제

   		//추가 버튼 생성
   		if(img0Style == "none" && img1Style == "none" && img2Style == "none" && img3Style == "none" && imgLastStyle == "none"){
   			$('#ulImg').append('<li id="imgPlus_' + imgIdx + '" class="swiper-slide"><button class="btnAdd btn-add">추가</button></li>');
   	   		imgIdx++;
   		}

    }
    
    makeImgPath();
    /* [수정 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 이미지 삭제 */
    
    $('#evalfile').val('');
    
});

// 작성금지에서 이미지확대
$(document).on("click",".ImgGdasRead",function(e){
    e.preventDefault();
    sessionStorage.setItem("gdasSession", true);
    var target_url = _baseUrl + "goods/getGdasPhotoDetailPop.do";
    target_url += "?viewType=mypage&goodsNo="+$("#goodsNo").val()+"&gdasSeq="+$("#gdasSeq").val()+"&fileSeq="+this.id;
    window.location.href = target_url;
});

/* [수정 시작] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 목록화면 이동 */
//리뷰 등록 완료 후 나의 리뷰 목록 화면으로 이동
function reviewCompleted(type){
	$("#" + type).hide();

	if($("#gdasSctCd").val() == "50"){
		$(location).attr("href", _baseUrl + "mypage/getMyOllyoungList.do");
	}else{
		$(location).attr("href", _baseUrl + "mypage/getGdasList.do?callId=complete");
	}
}
/* [수정 종료] / [리뷰고도화] / [2020.06.01] / [junydad] / 상품평 목록화면 이동 */