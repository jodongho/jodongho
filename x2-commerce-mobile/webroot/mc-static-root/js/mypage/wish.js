$.namespace("mwish.list");
mwish.list = {
        nextPageIdx : 1,
        
        init : function(){
            if(common.isLogin){
            	//페이징
                mwish.list.getWishLstPagingAjax(1);
                //LazyLoad
                common.setLazyLoad();
                //찜상품 삭제 이벤트 바인드
                mwish.list.delWishGoods();
                //찜상품 전체 삭제 이벤트 바인드
                mwish.list.delTotWishGoods();
                
                if($('.mlist5v-goods > li').length < 1){
                    $(".sch_no_data").show();
                }else{
                    $(".sch_no_data").hide();
                }
                
                setTimeout(function() {
                    //링크 처리
                    common.bindGoodsListLink();
                    //웹로그 바인딩
                    mwish.list.bindWebLog();
                }, 100);
                
                $(".moveBrndWish").click(function(){
                    window.location.href = _secureUrl + 'mypage/getBrndWishList.do';
                });
            }
        },
        
        //찜상품 삭제 클릭 이벤트
        delWishGoods : function(){
            $(".mlist5v-goods").find(".delete").bind('click', function(){
                var param = {
                        goodsNo : $(this).closest("li").find("a").attr("data-ref-goodsNo")
                };

                // 찜상품 삭제
                common.wish.delWishLst(param);
                
                $(this).closest("li").remove();
                $(".totalBox > .cnt > strong").text(parseInt($(".totalBox > .cnt > strong").text()) - 1);
            });
        },
        
        delTotWishGoods : function(){
            $(".totalBox > .btnTxtgray").on('click', function(){
                if(confirm("전체 상품을 삭제하시겠습니까?")){

                    // 찜상품 삭제
                    common.wish.delAllWishLst(param);

                    $(".mlist5v-goods").empty();
                    $(".totalBox > .cnt > strong").text(0);

                    $(".sch_no_data").show();
                }
            });
        },
        
        //쇼핑찜 상품영역 페이징
        getWishLstPagingAjax : function(startIdx, dispCatNo) {
            //연속키 방식
            PagingCaller.init({
                callback : function(){
                    //최대 100개 온리원 상품 페이징 조회
                    if(mwish.list.nextPageIdx < 10){
                        mwish.list.nextPageIdx = PagingCaller.getNextPageIdx();
                    }
                    var param = {
                        pageIdx : mwish.list.nextPageIdx,
                        fltCondition : "01",
                        fltDispCatNo : (dispCatNo == undefined || dispCatNo == null) ? "" : dispCatNo
                    }
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "mypage/getWishListPagingAjax.do"
                            , param
                            , mwish.list.getWishLstPagingAjaxCallback);
                }
                ,startPageIdx : startIdx
                ,subBottomScroll : 700
                //초기화 시 최초 목록 call 여부
                ,initCall : (startIdx > 0) ? false : true
            });
        },

        getWishLstPagingAjaxCallback : function(res) {

            if (res.trim() == '') {
                //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
                PagingCaller.destroy();

            } else {
                //응답 결과가 있는 경우 append 처리 후 lazyload 처리
                $(".mlist5v-goods").append(res);

                common.setLazyLoad();
                
                //찜상품 삭제 이벤트 바인드
                mwish.list.delWishGoods();

                setTimeout(function() {
                    //링크 처리
                    common.bindGoodsListLink();
                }, 100);

            }

            //loadingLayer
            common.hideLoadingLayer();
        },
        
        bindWebLog : function() {
          //정보수정
            $(".mlist5v-goods li .goodsList").each(function(){
                $(this).bind('click', function(){
                    common.wlog("mywish_goods");
                });
            });            
        }
}

$.namespace("mwish.brndList");

mwish.brndList = {
        nextPageIdx : 1,
        
        init : function(){
            if(common.isLogin){
            	//페이징
                mwish.brndList.getBrndWishLstPagingAjax(1);
                //LazyLoad
                common.setLazyLoad();
                //찜상품 삭제 이벤트 바인드
                mwish.brndList.delWishBrnds();
                //찜상품 전체 삭제 이벤트 바인드
                mwish.brndList.delTotWishBrnds();
                
                $(".moveBrandShop").click(function(){
                    var onlBrndCd = $(this).attr("data-ref-onlBrndCd");
                    window.location.href = _baseUrl + 'display/getBrandShopDetail.do?onlBrndCd=' + onlBrndCd;
                });
                
                $(".movePrdWish").click(function(){
                    var onlBrndCd = $(this).attr("data-ref-onlBrndCd");
                    window.location.href = _secureUrl + 'mypage/getWishList.do';
                });
                
                if($('.brand_like_list li').length < 1){
                    $(".sch_no_data2").show();
                    $(".totalBox").remove();
                }else{
                    $(".sch_no_data2").hide();
                }
            }
        },
        
        //찜상품 삭제 클릭 이벤트
        delWishBrnds : function(){
            $(".brand_like_list .btnlike").bind('click', function(){
            	if(confirm("좋아요 브랜드를 삭제하시겠습니까?")){
            		var param = {
                            onlBrndCd : $(this).closest("li").find(".ban_brand a").attr("data-ref-onlBrndCd")
                    };

                    common.wish.delBrndWishLst(param);
                    
                    $(this).closest("li").remove();
                    $("#brndTotCnt").text(parseInt($("#brndTotCnt").text()) - 1);
                    
                    if($('.brand_like_list li').length < 1){
                    	$(".brand_like_list").remove();
                        $(".sch_no_data2").show();
                        $(".totalBox").remove();
                    }
            	}                
            });
        },
        
        delTotWishBrnds : function(){
            $(".totalBox > .btnTxtgray").on('click', function(){
                if(confirm("좋아요 브랜드을 모두 삭제하시겠습니까?")){
                    // 찜상품 삭제
                    common.wish.delAllBrndWishLst(null);
                    $(".brand_like_list").remove();
                    $(".sch_no_data2").show();
                    $(".totalBox").remove();
                }
            });
        },
        
        //쇼핑찜 상품영역 페이징
        getBrndWishLstPagingAjax : function(startIdx) {
            //연속키 방식
            PagingCaller.init({
                callback : function(){
                    if(mwish.brndList.nextPageIdx < 99){
                        mwish.brndList.nextPageIdx = PagingCaller.getNextPageIdx();
                    }
                    var param = {
                        pageIdx : mwish.brndList.nextPageIdx
                    }
                    common.Ajax.sendRequest(
                            "GET"
                            , _baseUrl + "mypage/getBrndWishListPagingAjax.do"
                            , param
                            , mwish.brndList.getBrndWishLstPagingAjaxCallback);
                }
                ,startPageIdx : startIdx
                ,subBottomScroll : 700
                //초기화 시 최초 목록 call 여부
                ,initCall : (startIdx > 0) ? false : true
            });
        },

        getBrndWishLstPagingAjaxCallback : function(res) {

            if (res.trim() == '') {
                //응답 결과가 없을 경우 마지막 목록임- 스크롤 이벤트 제거
                PagingCaller.destroy();

            } else {
                //응답 결과가 있는 경우 append 처리 후 lazyload 처리
                $(".brand_like_list ul").append(res);

                common.setLazyLoad();
                
                //찜상품 삭제 이벤트 바인드
                mwish.brndList.delWishBrnds();
                
                $(".moveBrandShop").click(function(){
                    var onlBrndCd = $(this).attr("data-ref-onlBrndCd");
                    window.location.href = _baseUrl + 'display/getBrandShopDetail.do?onlBrndCd=' + onlBrndCd;
                });

            }

            //loadingLayer
            common.hideLoadingLayer();
        }
  
}