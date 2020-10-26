/**
 * 기프트카드 안내페이지
 * 
 */

var myGiftCardList = null;


/**
 * 기프트카드 안내 검색
 */
$.namespace("display.dispGiftCardGuide.search");
display.dispGiftCardGuide.search = {
    _ajax : common.Ajax,
   
    init : function(option){
//        display.dispGiftCardGuide.search.guideSearchList();
    },
    initGoodsList : function(option){
        display.dispGiftCardGuide.search.goodsSearchList();
    }
    
    /**
     * 페이징 세팅
     */
    ,setPagingCaller : function () {
        
        PagingCaller.curPageIdx = 1;
        PagingCaller.init({
            callback : function(){
                
                var param = {
                    pageIdx : PagingCaller.getNextPageIdx(),
                    faqLrclCd : $("#larCd").val(),
                    faqMdclCd : $("#midCd").val() != null ? $("#midCd").val() : null,
                    appendTo : true
                }
                if($("#larCd").val() != "99"){
                    //코드 완료 후 스토어 정보 조회
                    mcounsel.faq.list.getFaqListAjax(param);
                }
            }
            ,startPageIdx : 1
            ,subBottomScroll : 700
            //초기화 시 최초 목록 call 여부
            ,initCall : false
        });
    }
    
//    ,guideSearchList : function(param){
//       
//        
//        this._ajax.sendRequest("GET"
//                , _baseUrl + "giftCardGuide/getGiftCardGuideListJson.do"
//                , param
//                , display.dispGiftCardGuide.search.getGiftCardGuideListJsonCallback
//            );
//        
//    }
//
//    , getGiftCardGuideListJsonCallback : function (res){
//
//        if(res.length ==0){
//            return false;
//        }
//        
//        var imgStr = '';
//        var NmStr = '';
        
//        for(var i=0; i<res.length; i++){
//            imgStr += '<div class="swiper-slide">';
//            
//            //imgStr +='<span class="img"><img src="https://m.lomo.com/mc-static-root/uploads/images/goods/10/0000/0010/G00000010000301ko.jpg?l=ko"></span>';
//            //imgStr +='<span class="img"><img src="/mc-static-root/image/giftCard/img_gift_card_dummy1.png"></span>';
//            imgStr += '<span class="img" onclick="javascript:display.dispGiftCardGuide.search.moveGiftCardGuideDtlPage(\''+res[i].goodsNo+'\');"><img src="'+_goodsImgUploadUrl+res[i].imgPathNm+'"></span>';
//            imgStr += '</div>';
//            
//            
//            
//            if(i ==0){
//                NmStr += '<div class="gc-card-info is-active">';
//            }else{
//                NmStr += '<div class="gc-card-info">';
//            }
//            NmStr += '<p class="card-name" onclick="javascript:display.dispGiftCardGuide.search.moveGiftCardGuideDtlPage(\''+res[i].goodsNo+'\');">'+res[i].cardGbnNm+'</p>';
//            NmStr += '<p class="card-dic" onclick="javascript:display.dispGiftCardGuide.search.moveGiftCardGuideDtlPage(\''+res[i].goodsNo+'\');">'+res[i].goodsNm+'</p>';
//
//            NmStr += '<div class="card-btn">';
//            NmStr += '<button class="card-buy" type="button" onclick="javascript:display.dispGiftCardGuide.search.moveGiftCardBuyPage2(\''+res[i].goodsNo+'\',\'N\');">';
//            NmStr += '         <span>바로구매</span>';
//            NmStr += '</button>';
//            NmStr += '<button class="card-gift" type="button" onclick="javascript:display.dispGiftCardGuide.search.moveGiftCardBuyPage2(\''+res[i].goodsNo+'\',\'Y\');">';
//            NmStr += '        <span>선물하기</span>';
//            NmStr += '</button>';
//            NmStr += '</div>';
//            NmStr += '</div>';
//            
//        }
//        $('#Card_Guide_Img').html(imgStr);
//        $('#gcLandingCardInfo').html(NmStr);
//        
        
//        /*swiper 컨트롤*/
//        var gcLandingSwiper = new Swiper('.gc-landing-swiper', {
//            slidesPerView: 1.3,
//            spaceBetween: 10,
//            centeredSlides: true,
//            slideToClickedSlide: true,
//            pagination: '.gc-swiper-pagination',
//            paginationClickable: true,
//            onSlideClick: function(s, e) {
//                gcLandingSwiper.slideTo(s.clickedIndex);
//            }
//        });
//
//        // 카드가 하나일 경우 페이징 숨김 및 터치 슬라이드 disabled
//        if($('.gc-landing-swiper .swiper-slide').length == 1){
//            $('.gc-landing-swiper .gc-swiper-pagination').hide();
//            gcLandingSwiper.params.touchRatio = 0;
//        }
//
//        gcLandingSwiper.on('slideChangeStart', function(e, t){
//            $('#gcLandingCardInfo .gc-card-info').removeClass('is-active');
//            $('#gcLandingCardInfo .gc-card-info').eq(e.activeIndex).addClass('is-active');
//        })
//        /*스와이퍼 컨트롤 끝*/
//     
//    }
    
    /**
     * 기프트카드 tset 페이지 URL
     */
    ,moveGiftCardGuidePage : function(themeNo, themeNm, themeType) {
        location.href = _plainUrl + "giftCardGuide/getGiftCardGuide.do";
    }
    /*상세페이지 이동*/
    ,moveGiftCardGuideDtlPage : function(goodsNo) {
    	var giftMainGiftCardFlag = $('#trackingCd').val() == null || $('#trackingCd').val() != "Gift_Main_Giftcard" ? false : true;
        var preView = '0';
        if(!giftMainGiftCardFlag){
        	location.href = _plainUrl + "giftCardGuide/getGiftCardGuideDtl.do?goodsNo="+goodsNo+"&preView="+preView;
        }else{
        	location.href = _plainUrl + "giftCardGuide/getGiftCardGuideDtl.do?goodsNo="+goodsNo+"&preView="+preView+"&trackingCd="+$('#trackingCd').val();
        }
     }
    
    
    ,
    guideSearchDtl : function(param){
       this._ajax.sendRequest("GET"
                , _baseUrl + "giftCardGuide/getGiftCardGuideDtlJson.do"
                , param
                , display.dispGiftCardGuide.search.getGiftCardGuideDtlJsonCallback
            );
    }
    , getGiftCardGuideDtlJsonCallback : function (res){
        /*이미지*/
        var dtlImg = '<img src="'+_goodsImgUploadUrl+res[0].imgPathNm+'" alt="" />';
        $('#dtl_Img').html(dtlImg);
        
        /*상품명*/
        var dtlTit = '<h3>'+res[0].cardGbnNm+'<br>'+res[0].goodsNm+'</h3>'
        $('#dtl_tit').html(dtlTit);
        
        /*가격*/
        var prc = res[0].salePrc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        var dtlPrc = '<span class="eng">'+prc+'</span>원~'; 
        $('#dtl_prc').html(dtlPrc);
        
        /*상품상세*/
        //var itemContents = '<p class="tx_info">'+res[0].goodsDtlConts+'</p>'; 
        //$('#item_contents').html(itemContents);
        
        /*안내사항*/
        var itemContents = ''; 
        for(var i=0; i<res.length;i++){
        	if(res[i].goodsPbldItemCd == '209'){
        		itemContents = '<p class="tx_info">'+res[i].itemCont+'</p>'; 
        	}
        }
        $('#item_contents').html(itemContents);        
        
        /*구매정보*/
        var buyInfo = '';
        for(var i=0; i<res.length;i++){
        
            if(i==0){
                buyInfo +=   '<caption>상품정보 제공고시</caption>';
                buyInfo +=   '<colgroup>';
                buyInfo +=   '    <col style="width:40%;">';
                buyInfo +=   '    <col style="width:60%;">';
                buyInfo +=   '</colgroup>';
            }
            // 안내사항제외
            if(res[i].goodsPbldItemCd != '209'){
            	buyInfo +=   '<tr>';
            	buyInfo +=   '<th scope="row">'+res[i].mrkNm+'</th>';
            	buyInfo +=   '<td>'+res[i].itemCont+'</td>';
            	buyInfo +=   '</tr>';
            }
            
         /*   buyInfo += res[i].mrkNm;
            buyInfo += '<br>';
            buyInfo += res[i].itemCont;
            buyInfo += '<br>';
            buyInfo += '<br>';*/
        }
        
        /*구매정보
         '<p class="tx_info">'+res[0].mrkNm+'</p>'
                      +'<br>'
                      +'<p class="tx_info">'+res[0].itemCont+'</p>'; */
        $('#buy_Info_cont').html(buyInfo);
       // $('#buy_info').html(buyInfo);
               
    }
    
    /*검색(기프트카드리스트 페이지) 이동*/
    ,moveGiftCardGoodsListPage : function(goodsNo) {
         location.href = _plainUrl + "giftCardGuide/getGiftCardGoodsList.do";
     }
    
    ,goodsSearchList : function(param){
        console.log("여기!!");
        
        this._ajax.sendRequest("GET"
                , _baseUrl + "giftCardGuide/getGiftCardGuideListJson.do"
                , param
                , display.dispGiftCardGuide.search.getGiftCardGoodsListJsonCallback
            );
        
    }

    , getGiftCardGoodsListJsonCallback : function (res){

   
        
        
        var Str = '';
        if(res.length<1){return false};    
        
        for(var i=0; i<res.length; i++){
         
            Str +=   '   <li>';
            Str +=   '<div class="goods">';
            Str +=   '<div class="box">';
            Str +=   '<a href="#none" onclick="javascript:display.dispGiftCardGuide.search.moveGiftCardGuideDtlPage(\''+res[i].goodsNo+'\');">';
            Str +=   '  <span class="imgSmall">';
            Str +=   '      <span class="img" onclick="javascript:display.dispGiftCardGuide.search.moveGiftCardGuideDtlPage(\''+res[i].goodsNo+'\');">';
            Str +=   '          <img src="'+_goodsImgUploadUrl+res[i].imgPathNm+ '"alt="">';
            Str +=   '      </span>';
            Str +=   '  </span>';
            Str +=   '  <span class="area" onclick="javascript:display.dispGiftCardGuide.search.moveGiftCardGuideDtlPage(\''+res[i].goodsNo+'\');">';
            Str +=   '      <span class="name">'+res[i].cardGbnNm+'</span>';
            Str +=   '      <span class="text">'+res[i].goodsNm+'</span>';
            var prc = res[i].salePrc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            Str +=   '      <span class="won">'+prc+'<em>원~</em></span>';
            Str +=   '  </span>';
            Str +=   '</a>';
                    
            Str +=   '</div>';
            Str +=   '</div>';
            Str +=   '</li>';
            
        }
        $('#oneTwo-list').html(Str);
        
        $('#goods_List_Cnt').text(res.length);
        
       
    }

    /*구매페이지 이동*/
    ,moveGiftCardBuyPage : function(giftYn) {
        
    	var loginCheck = common.loginChk();
    	var giftMainGiftCardFlag = $('#trackingCd').val() == null || $('#trackingCd').val() != "Gift_Main_Giftcard" ? false : true;

        if(giftYn =="Y"){
            common.wlog("giftcard_detail_present_param");
            n_click_logging( _baseUrl + "?clickarea=giftcard_detail_present_param2");
        }else{
            common.wlog("giftcard_detail_purchase_param");
            n_click_logging( _baseUrl + "?clickarea=giftcard_detail_purchase_param2");
        }
    	
        if ( loginCheck ) {
	        $('#giftYn').val(giftYn);
	        
//	        $("#goodsForm").attr('action', _baseUrl + "orderGiftCard/getOrderGiftCardForm.do");
//	        $("#goodsForm").attr('method', "POST");
//	        $("#goodsForm").attr('onsubmit', true);
//	        $("#goodsForm").submit();
	        if(!giftMainGiftCardFlag){
	        	location.href = _secureUrl + "orderGiftCard/getOrderGiftCard.do?goodsNo=" + $('#goodsNo').val() + "&giftYn=" + $('#giftYn').val();
	        }else{
	        	location.href = _secureUrl + "orderGiftCard/getOrderGiftCard.do?goodsNo=" + $('#goodsNo').val() + "&giftYn=" + $('#giftYn').val() + "&trackingCd=" + $('#trackingCd').val();;
	        }
        }
    }
    /*구매페이지 이동*/
    ,moveGiftCardBuyPage2 : function(goodsNo,giftYn) {
        
    	var loginCheck = common.loginChk();
    	var giftMainGiftCardFlag = $('#trackingCd').val() == null || $('#trackingCd').val() != "Gift_Main_Giftcard" ? false : true;
    	
        if(giftYn =="Y"){
            common.wlog("giftcard_present_param");
            n_click_logging( _baseUrl + "?clickarea=giftcard_present_param2");
        }else{
            common.wlog("giftcard_purchase_param");
            n_click_logging( _baseUrl + "?clickarea=giftcard_purchase_param2");
        }
        
    	
    	if ( loginCheck ) {
	        $('#goodsNo').val(goodsNo);
	        $('#giftYn').val(giftYn);
	        
//	        $("#goodsForm").attr('action', _baseUrl + "orderGiftCard/getOrderGiftCardForm.do");
//	        $("#goodsForm").attr('method', "POST");
//	        $("#goodsForm").attr('onsubmit', true);
//	        $("#goodsForm").submit();
	        if(!giftMainGiftCardFlag){
	        	location.href = _secureUrl + "orderGiftCard/getOrderGiftCard.do?goodsNo=" + $('#goodsNo').val() + "&giftYn=" + $('#giftYn').val();
	        }else{
	        	location.href = _secureUrl + "orderGiftCard/getOrderGiftCard.do?goodsNo=" + $('#goodsNo').val() + "&giftYn=" + $('#giftYn').val() + "&trackingCd=" + $('#trackingCd').val();
	        }
    	}    
    },
    
    //이용약관 팝업
    openPopup : function(url, title) {
        if(common.app.appInfo.isapp) {
            common.app.callOpenPage(title, url, 'N', 'Y', 'N');
        } else {
            window.open(url, title);
        }
    }    
};