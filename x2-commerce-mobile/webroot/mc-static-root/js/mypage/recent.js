$.namespace("mrecent.list");
mrecent.list = {
        init : function(){            
            common.wish.init();                

            common.recentGoods.getList('recent', function() {
                
                //이벤트 바인드
                mrecent.list.bindEvent();

                setTimeout(function() {
                    //찜 체크 처리.
                    common.wish.checkWishList();
                    
                    //링크 처리
                    common.bindGoodsListLink();
                }, 100);
            });
        },
        
        bindEvent : function() {
          
            $(".mlist5v-goods > li > .delete").on('click', function(){
                mrecent.list.delRecentGoods(this);    
            });
            
            $(".totalBox > .btnTxtgray").on('click', function(){
                mrecent.list.delAllRecentGoods();
            });
        },
        
        
        //최근본상품 삭제 클릭 이벤트
        delRecentGoods : function(obj) {
            //쿠키 삭제
            var jsonStr =  JSON.parse(cookie.get('productHistory'));
            
            for( var j=0; j<jsonStr.length; j++){

                if ($(obj).closest("li").find("a").attr("data-ref-goodsNo") == jsonStr[j].goodsNo ){
                    delete jsonStr.splice(j, 1);

                    $(obj).closest("li").remove();
                    $(".totalBox > .cnt > strong").text(parseInt($(".totalBox > .cnt > strong").text() - 1));
                    break;
                }
            }
            
            cookie.set('productHistory', JSON.stringify(jsonStr));
            
            if(jsonStr == ''){
                $("#mContents div.totalBox").hide();
                $(".sch_no_data2").show();
            }
            
            mrecent.list.setFooterTabRecentGoods(); // BI Renewal. 20190918. nobbyjin. - 유틸바용 최근 본 상품 정보
            
            $(".late-conts .mlist3v-goods").empty();
            common.recentGoods.getList('slide');
        },
        
        //최근본상품 삭제 클릭 이벤트
        delAllRecentGoods : function() {
            if(confirm("전체 상품을 삭제하시겠습니까?")){
                today = new Date();
                today.setDate(today.getDate() - 1);
                cookie.set('productHistory', '');
                
                $(".mlist5v-goods").empty();
                $("#mContents div.totalBox").hide();
                $(".sch_no_data2").show();
                
                mrecent.list.setFooterTabRecentGoods(); // BI Renewal. 20190918. nobbyjin. - 유틸바용 최근 본 상품 정보
                
                $(".late-conts .mlist3v-goods").empty();
                common.recentGoods.getList('slide');
            }
        }

        // BI Renewal. 20190918. nobbyjin. - 유틸바용 최근 본 상품 정보. Start.
       ,setFooterTabRecentGoods : function() {
            if($("#footerTabRecentGoods").length > 0){
                if ($(".mlist5v-goods > li").length > 0){
                    var oLast = $(".mlist5v-goods > li:first");
                    var goodsNo = oLast.find("a").attr("data-ref-goodsNo");
                    var goodsImg = oLast.find("input[name='imgPath140']").val(); 
                    var oResultL  = {
                        goodsNo  : goodsNo,
                        goodsImg : goodsImg
                    };
                    cookie.set('productHistoryL', JSON.stringify(oResultL));

                    var obj = $("#footerTabRecentGoods .thum img");
                    if(obj.attr("src") != goodsImg){
                        $("#footerTabRecentGoods .thum").show();
                        $(obj).fadeOut(100,function(){$(obj).attr("src", goodsImg).fadeIn(200);});
                    }
                } else {
                    cookie.set('productHistoryL', '');
                    $("#footerTabRecentGoods .thum").empty();
                    $("#footerTabRecentGoods .thum").hide();
                }
            }
        }
        // BI Renewal. 20190918. nobbyjin. - 유틸바용 최근 본 상품 정보. End.
}