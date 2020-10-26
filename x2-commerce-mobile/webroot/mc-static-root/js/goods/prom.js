$.namespace("mgoods.prom");
/** 재입고 알림 팝업 * */
mgoods.prom = {

    init : function() {
        
    },
    
    optionRegCart : function(obj){
        
    	var quickYn = $(":input:radio[name=qDelive]:checked").val();
        if (typeof (quickYn) == "undefined") {
            quickYn = $("#quickYn").val();
        }
        
        var param = $(obj).parent().parent().find('.optipon select option:selected').val();
        var params = param.split(",");
        
        var goodsNo = params[0];
        var itemNo = params[1];
        var rsvSaleYn = params[2];
        
        mgoods.prom.regCart(goodsNo, itemNo, rsvSaleYn, quickYn);
    },
    
    regCart : function(goodsNo, itemNo, rsvSaleYn, quickYn){
        
        var url = _baseUrl + 'goods/getGoodsDispCatNoJson.do';
        var data = { goodsNo : goodsNo };
        var dispCatNo="";
        
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType : 'json',
            async: false,
            cache: false,
            success: function(data) {
                dispCatNo = data.dispCatNo;
                mgoods.prom.regCartProcess(goodsNo, itemNo, rsvSaleYn, dispCatNo, quickYn);
            },
            error: function() {

            }
        });
    },
    
    regCartProcess : function(goodsNo, itemNo, rsvSaleYn, dispCatNo, quickYn){
        
        var loginCheck = common.loginChk();
        
        if ( loginCheck ) {

            //  장바구니를 등록하기 위한 필수값 세팅  
            var ordQty = "1";
            var drtPurYn = "N";
            var prsntYn = "N"; // 고정값
            
            var resultData = new Array();
            
            var data = {
                    goodsNo : goodsNo,
                    itemNo : itemNo,
                    ordQty : ordQty,
                    rsvGoodsYn : rsvSaleYn,
                    dispCatNo : dispCatNo,
                    drtPurYn : drtPurYn,
                    prsntYn : prsntYn,
                    quickYn : quickYn
            };
            
            resultData.push(data);
                
            
            // 장바구니 등록
            var rData = common.cart.regCart(resultData);
            
            //바로구매로 유입시
            if(location.href.indexOf("cart/getCart.do?cartNo=") > 0){
                if(rData.result){
                    if(typeof cartNosForDirectCart != "undefined"){
                        
                        var linkCartNo = location.href.substring(location.href.indexOf("cartNo=")+7);
                        
                        if(linkCartNo != rData.rCartNo){
                            if(cartNosForDirectCart == ""){
                                cartNosForDirectCart = rData.rCartNo;
                            }else{
                                if(cartNosForDirectCart.indexOf(rData.rCartNo) < 0){
                                    cartNosForDirectCart += ","+rData.rCartNo;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}