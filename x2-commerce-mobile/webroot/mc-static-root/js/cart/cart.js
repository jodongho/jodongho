_ajax = common.Ajax;
var selTargetPromNo = "";
var cartNoArray = [];
var rmitPostNo = "";
var nonCheck = true;
var addAlertTxt ="";
var getLayerThisObj = "";
var thumbImgPath = "220/";

$.namespace('mcart.base');
mcart.base = {

    goodsList : [],
    recoBellUseYn : 'N', /* 레코벨 사용 여부 */
    recoBellViewYn : 'N', /* 장바구니 부하를 줄이기 위한 레코벨 show 여부 */
    
    /**
     * 초기화 함수 화면 로드가 끝나면 자동으로 실행 된다.
     */
    init : function() {
        
        // 관심상품할인알림 플로팅 아이콘 표시여부
        if( common.isEmpty(sessionStorage.getItem("mGoodsEventEnable")) ){
        	sessionStorage.setItem("mGoodsEventEnable","Y");
        }
        
        // 관심상품할인 시나리오 분석용
        if( $("#pageCallDv").val() == "goodsEventPush" ){
            var url = _baseUrl + "cart/getCart.do?pageCallDv=goodsEventPush";
            
            setTimeout(function() {
                n_click_logging(url); // DS 시나리오 분석용 로그 남기기
            }, 700);
            
        }
        
        // 하단 레코벨 추천 상품 조회(일시품절 상품 없는 경우)
        if(mcart.base.recoBellUseYn == 'Y' && mcart.base.recoBellViewYn == 'Y'){
            //mcart.base.callRecoBellGoodsInCart();
            
            // 하단 레코벨 추천 상품 조회
            // 스크롤 내려서 하단 레코벨 추천상품 영역에 닿았을때 호출
            // 이때 해당 영역이 display:none 상태이면 안됨..
            $(window).scroll(function() {
                var offsetTop = $('#curation_area_a015').offset().top,
                    wH = $(window).height(),
                    wS = $(this).scrollTop();
                
                if(wS >  ( offsetTop-wH )){
                    if(window['isCurationArea015Called'] != 'Y'){
                        // 하단 레코벨 추천상품 호출한적 없는 경우에만 호출한다.
                        //console.log("curationArea001 Call...!");
                        mcart.base.callRecoBellGoodsInCart();
                    }
                }
             });
        }
        
        $(document).keypress(function(e) { if (e.keyCode == 13) e.preventDefault(); });
        
        //프로모션 2+1인경우 그룹핑 하이라이트 효과주기
        ($(document).find("li[oriPno]")).each(function(){
            //2+1만 해당함. 1+1은 제외
            var promNo = this.attributes.getNamedItem('oriPno').value;
            if(promNo != ''){
                var promNotargetObj = $(document).find("li[oriPno="+promNo+"]");
                var sumCnoTotQty = 0;
                var calcCnoTotQty = 0;
                
                //2+1인경우 - 같은프로모션의 상품갯수가 1개이상이면
                if(promNotargetObj.length > 1){
                    //프로모션 상품 n+1 n에해당하는 값이 2보다 크거나 같으면 하이라이트 처리
                        //상품단위로 찾기
                        promNotargetObj.each(function(idx){
                            //첫번째 상품class에 first 추가하기
                            if(idx==0){
                                if(typeof promNotargetObj.eq(0).attr('class') != "undefined"){
                                    if(promNotargetObj.eq(0).attr('class').indexOf('soldout') >= 0 ){
                                        promNotargetObj.eq(0).attr('class','chain_box first soldout');
                                    }else{
                                        promNotargetObj.eq(0).attr('class','chain_box first');
                                    }
                                }else{
                                    promNotargetObj.eq(0).attr('class','chain_box first');
                                }
                            //마지막번째 상품class에 last 추가하기     
                            }else if(idx == promNotargetObj.length-1){
                                if(typeof promNotargetObj.eq(promNotargetObj.length-1).attr('class') != "undefined"){
                                    if(promNotargetObj.eq(promNotargetObj.length-1).attr('class').indexOf('soldout') >= 0){
                                        promNotargetObj.eq(promNotargetObj.length-1).attr('class','chain_box last soldout');
                                    }else{
                                        promNotargetObj.eq(promNotargetObj.length-1).attr('class','chain_box last');
                                    }
                                }else{
                                    promNotargetObj.eq(promNotargetObj.length-1).attr('class','chain_box last');
                                }
                            //첫번째,마지막번째 사이에 상품들 class 선언.
                            }else{
                                if(typeof $(this).attr('class') != "undefined"){
                                    if($(this).attr('class').indexOf('soldout') >= 0){
                                        $(this).attr('class','chain_box soldout');
                                    }else{
                                        $(this).attr('class','chain_box');
                                    }
                                }else{
                                    $(this).attr('class','chain_box');
                                }
                            }
                        });
                }
            }
        });
        
        // 수량 수정 (콤보박스)
        $('select[name=s_amount]').change(function() {
            if($(this).val() != '10+'){
                $(this).parents('div.price_info').find('button[name=btnQtyMod]').click();
            }
        });
        
        // 수량 수정 onChange 이벤트
        $('input[name=s_amount]').change(function(e){
        	$(this).parents('div.prd_cnt').find('button[name=btnQtyMod]').click();
        });
        
        // 수량 수정(minus)
        $('button[name=minus]').click(function() {
        	var _amount = $(this).parents('div.prd_cnt').find('input[name=s_amount]');
        	var cartCnt = Number(_amount.val());
        	cartCnt = cartCnt-1;
        	_amount.val(cartCnt);
        	$(this).parents('div.prd_cnt').find('button[name=btnQtyMod]').click();
        });
        
        // 수량 수정(plus)
        $('button[name=plus]').click(function() {
        	var _amount = $(this).parents('div.prd_cnt').find('input[name=s_amount]');
        	var cartCnt = Number(_amount.val());
        	cartCnt = cartCnt+1;
        	_amount.val(cartCnt);
        	$(this).parents('div.prd_cnt').find('button[name=btnQtyMod]').click();
        });
        	
        // 수량 수정(수량변경버튼)
        $('button[name=btnQtyMod]').click(function() {
            var _selfTarget = $(this).parents('div.price_info').find('[name=s_amount]');
            var cartNo = $(_selfTarget).parents("li").attr("cno");
            var goodsNo = $(_selfTarget).parents("li").attr("goodsNo");
            var itemNo = $(_selfTarget).parents("li").attr("itemNo");
            var rsvSaleYn = $(_selfTarget).parents("li").attr("rsvSaleYn");
            var orderQty = parseInt( $(_selfTarget).val() );
            _selfTarget.val(orderQty);
            var promNo = $(_selfTarget).parents("li").attr("pno");
            var oriPromNo = $(_selfTarget).parents("li").attr("oriPno");
            var drtPurYn = $(_selfTarget).parents("li").attr("drtPurYn");
            var cnoTotQty = 0;
            var promKndCd = $("#selGet_"+promNo).attr("promKndCd");
            var buyCondStrtQtyAmt = parseInt( $("#selGet_"+promNo).attr("buyCondStrtQtyAmt") );
            var promNotargetObj = $(document).find("li[pno="+promNo+"]");
            var sumCnoTotQty = 0;
            var calcCnoTotQty = 0;
            var orgOrdQty = parseInt(_selfTarget.attr('ordQty')); //수정전 수량
            
            var lgcGoodsNo = $(_selfTarget).parents("li").attr("lgcGoodsNo");
            
            try{
                
                var minVal = parseInt(_selfTarget.attr('ordPsbMinQty'));  //최소구매값
                var maxVal = parseInt(_selfTarget.attr('ordPsbMaxQty'));  //최대구매값
                var unitVal = parseInt(_selfTarget.attr('qtyAddUnit'));   //증가단위수
                
                if(orderQty == undefined || isNaN(orderQty)) {      //수량 숫자 체크
                    // 숫자가 아닐경우
                    if(typeof _selfTarget.attr('ordQty') != "undefined"){
                        _selfTarget.val(orgOrdQty);
                    }
                    
                    alert("수량을 확인해 주세요.");
                    return false;
                }
                
                //최소구매수량보다 커야함.
                if(orderQty < minVal){
                    _selfTarget.val(_selfTarget.attr('ordPsbMinQty'));
                    alert(minVal+"개 이상부터 구매할 수 있는 상품입니다.");
                    return false;
                }
                
                //최대구매수량보다 작아야함.
                if(orderQty > maxVal){
                    _selfTarget.val(orgOrdQty);
                    alert("총 "+maxVal+"개 까지만 구매할 수 있습니다.");
                    return false;
                }
                
                //배수증가상품인 경우 배수증가율로 값셋팅해야함.
                if(unitVal > 1){
                    var isOk = false;
                    //var initVal = minVal > unitVal ? minVal : unitVal;
                    var initVal = minVal;
                    for(var i=initVal; i<=maxVal; i+=unitVal){
                        if(i <= orderQty){
                            if(i == orderQty){
                                isOk = true;
                                break;
                            }
                        }else{
                            break;
                        }
                    }
                    
                    if(!isOk){
                        _selfTarget.val(orgOrdQty);
                        alert(unitVal+"개 단위로 구매 가능한 상품입니다.\n수량을 다시 선택해주세요.");
                        return false;
                    }
                }
                
                //같은 lgcGoodsNo 상품의 수량을 SUM체크
                var buySumQty = orderQty;
                var stockQty = 0;
                var realStockQty = 0; 
                var goodsItemNo = goodsNo+itemNo;
                $('li[pno]').each(function(){
                    if($(this).attr('soldOutYn') == "N"){
                        if($(this).attr('lgcGoodsNo') == lgcGoodsNo){
                            stockQty = parseInt($(this).find('input[type=checkbox]').attr('stockQty'));
                            realStockQty = parseInt($(this).find('input[type=checkbox]').attr('stockQty'));
                            if(($(this).attr('goodsNo')+$(this).attr('itemNo')) != goodsItemNo){
                                buySumQty += parseInt($(this).find('[name=s_amount]').val());
                            }
                        }
                    }
                });
                
                // get 상품 중 같은 상품의 합
                var getSameOrdQty = 0;
                var getPromKndCd;
                $("div.evenPrdBox_ty02 div.bottom div.tit[lgcGoodsNo=" + lgcGoodsNo + "]").each(function(){
                    var ordQty = parseInt( $(this).attr("ordQty") );
                    getPromKndCd = $(this).attr("promkndcd");                    
                    getSameOrdQty += ordQty;
                });
                    
                if(promKndCd == "P203"){
                    stockQty -= getSameOrdQty;
                } else if(promKndCd == undefined) {
                    buySumQty += getSameOrdQty;
                }
                
                // 구매가능 수량 계산 <시작>
                var ordPsbQty = stockQty;
                var getItemObj = $("div.evenPrdBox_ty02[promNo=" + promNo + "]");
                var getItemGoodsNo = getItemObj.attr("getItemGoodsNo");
                var getItemItemNo = getItemObj.attr("getItemItemNo");
                var getItemStockQty = parseInt( getItemObj.attr("getItemStockQty") );
                var getItemAutoAddYn = getItemObj.attr("getItemAutoAddYn");
                var samePrdSumOrdQty = 0;
                
                // buy 상품 중 같은 상품의 합
                if(promKndCd == "P203"){
                    $("ul.basket_list li[goodsNo=" + getItemGoodsNo + "][itemNo=" + getItemItemNo + "]").each(function(){
                        var ordQty = parseInt( $(this).find("input[type=checkbox]").attr("ordQty") );
                        samePrdSumOrdQty += ordQty;
                    });
                    getItemStockQty -= samePrdSumOrdQty;
                }
                
                if(getItemAutoAddYn == "Y" && promKndCd == "P201"){
                    ordPsbQty = parseInt( stockQty - (stockQty / (buyCondStrtQtyAmt + 1)) );
                    
                    if(buyCondStrtQtyAmt > 1){
                        var modQty = parseInt( stockQty % (buyCondStrtQtyAmt + 1) );
                        
                        if(modQty < buyCondStrtQtyAmt)
                            ordPsbQty += modQty;
                    }
                } else if(getItemAutoAddYn == "Y" && promKndCd == "P203"){
                    if( !isNaN(getItemStockQty) && ordPsbQty > getItemStockQty)
                        ordPsbQty = getItemStockQty;
                } else {
                    ordPsbQty = parseInt( stockQty - (stockQty % unitVal) );
                }
                
                // 가능한 재고가 마이너스일 경우 0으로 보정
                if(ordPsbQty < 0){
                    ordPsbQty = 0;
                }
                
                var maxOrdQty = 999;
                
                if(realStockQty >= maxOrdQty){
                    realStockQty = maxOrdQty;
                }
                
                if(ordPsbQty >= maxOrdQty){
                    ordPsbQty = maxOrdQty;
                }
                
                
                if(buySumQty > ordPsbQty){
                    if(getPromKndCd == "P203"  && getSameOrdQty > 0){
                        var pobqty = realStockQty-getSameOrdQty;
                        alert("재고가 "+realStockQty+"개 남았습니다. 이미 장바구니에 담으신 "+getSameOrdQty+"개를 제외하고 "+pobqty+"개까지만 구매할 수 있습니다.");
                        _selfTarget.val(orgOrdQty);
                        return false;
                    }
                    alert("재고가 " + ordPsbQty + "개 남았습니다. 구매를 서둘러주세요!");
                    _selfTarget.val(orgOrdQty);
                    return false;
                }
                // 구매가능 수량 계산 <끝>
                
                $(cartInfoList).each(function(){
                    var cartInfo = this;
                    if(cartInfo.cartNo == cartNo) {
                        
                        var samePromCartNos = [];
                        var samePromCartNosCnt = 0;
                        $('li[cno]').each(function(a,b){
                            if($(this).attr("oriPno") == oriPromNo){
                                //if($(this).find('input[type=checkbox]').prop('checked') == true){
                                    if($(this).attr('soldOutYn') == 'N'){
                                        samePromCartNos.push($(this).attr('cno')); 
                                        samePromCartNosCnt++;
                                    }
                                //}
                            }
                        });
                        
                        if(samePromCartNos.length == 0){
                            alert("죄송합니다.\n처리중 오류가 발생하였습니다.\n고객센터(1522-0882)로 문의 바랍니다.");
                            return;
                        }
                        
                        //수량수정시 프로모션 번호가 있고 N+1(P202)타입이면 자동으로 차이나는 수량만큼 마지막로우부터 선택한 수량 삭제 해주는 로직 실행.
                        var result = mcart.base.http.modQty.submit(cartNo, samePromCartNos, orderQty, promNo, oriPromNo, promKndCd,buyCondStrtQtyAmt,goodsNo,itemNo, rsvSaleYn, drtPurYn);
                        
                        if(result) {
                            alert("수량 변경이 완료되었습니다."+addAlertTxt);
                            cartInfo.ordQty = orderQty;
 
                            _selfTarget.attr('ordQty',orderQty);
                            mcart.base.computAmt(); //결제 금액 정보 다시 계산
                            
                            //promNotargetObj = $(document).find("li[pno="+promNo+"]"); --BUY상품군 단위 li
                            promNotargetObj.each(function(idx){
                                //프로모션상품인지 체크
                                if($(this).attr('promKndCd') == 'P201' || $(this).attr('promKndCd') == 'P202' || $(this).attr('promKndCd') == 'P203'){
                                    //판매여부 판매중인것 체크하여 판매중인 수량정보를 SUM
                                    if($(this).attr('soldOutYn') == "N"){
                                        sumCnoTotQty += parseInt($(this).find('[name=s_amount]').val());
                                    }
                                    
                                    var promCond = $('#selGet_'+promNo).attr('buyCondStrtQtyAmt') + "+" + $('#selGet_'+promNo).attr('getCondStrtQtyAmt');
                                    if($('#selGet_'+promNo).attr('promKndCd') == 'P203')
                                        promCond = "GIFT";
                                    
                                    //---- 마지막 순번일때 처리 시작
                                    if($(this).attr('class') == 'chain_box last' || typeof $(this).attr('class') == 'undefined'){
                                        //GET상품 받을수 있는 갯수 계산
                                        calcCnoTotQty = Math.floor(sumCnoTotQty/($("#selGet_"+promNo).attr("buyCondStrtQtyAmt")));
                                        
                                        //받을수 있는 갯수가 없으면 프로모션 구성품 안내정보 HTML 노출
                                        if(calcCnoTotQty <= 0){
                                            var recommInfoHtml = "";
                                            recommInfoHtml += "   <div class='top'>";
                                            recommInfoHtml += "     <div class='tit'>";
                                            recommInfoHtml += "         <strong><span>2+1행사</span> 대상 상품과 같이 구매시</strong>";
                                            recommInfoHtml += "         <p>추가 상품을 받으실 수 있습니다.</p>";
                                            recommInfoHtml += "     </div>";
                                            recommInfoHtml += "     <button type='button' class='btn' onclick=javascript:common.openEvtInfoPop('" + promNo + "','" + promKndCd + "','" + promCond + "','" + goodsNo + "','" + itemNo + "');>자세히 보기</button>";
                                            recommInfoHtml += "   </div>";
                                            recommInfoHtml += "   <div id='p202InnerHtml_" + promNo + "' promkndcd='" + promKndCd + "' buycondstrtqtyamt='" + buyCondStrtQtyAmt + "'></div>";
                                            
                                            $("div.evenPrdBox_ty02[promNo=" + promNo + "]").html(recommInfoHtml);
                                            
                                        //받을수 있는 갯수가 있으면        
                                        }else{
                                            //수량수정으로 인한 재계산된 받을수 있는 갯수정보(getCondStrtTotQty) 재셋팅
                                            $("#selGet_"+promNo).attr("getCondStrtTotQty",calcCnoTotQty);
                                            
                                            //선택된 GET상품의 총수량갯수
                                            var selItemCnt = 0;
                                            //선택된 GET상품의 총수량갯수를 구한다.
                                            $('#selGet_'+promNo+' div.bottom div.tit').each(function(){
                                                selItemCnt += parseInt($(this).attr("ordQty"));
                                            });
                                            
                                            //예외처리
                                            if(selItemCnt == ''){
                                                selItemCnt = 0; 
                                            }else{
                                                selItemCnt = parseInt(selItemCnt);
                                            }
                                            
                                            //선택된 GET상품의 총수량이 없으면.
                                            if(selItemCnt <= 0){
                                                //GET상품 VIEW영역 초기화
                                                var initHtml = "";
                                                
                                                initHtml += "     <div class='top'>";
                                                initHtml += "         <div class='tit'>";
                                                initHtml += "             <strong><span>" + promCond + " 행사</span> 상품입니다.</strong>";                                                
                                                initHtml += "         </div>";
                                                initHtml += "         <button type='button' onclick='javascript:fn_selBtnAfterOnRoadGetSel(\""+promNo+"\")' name='btnGetPromItem' class='btnOrangeH30' id='btnSelGetItem_"+promNo+"' promNo='"+promNo+"' cartNo='"+cartNo+"' goodsNo='"+goodsNo+"' itemNo='"+itemNo+"'>선택</button>";
                                                initHtml += "     </div>";
                                                initHtml += "     <div id='p202InnerHtml_" + promNo + "' promkndcd='" + promKndCd + "' buycondstrtqtyamt='" + buyCondStrtQtyAmt + "'></div>";
                                                
                                                //GET상품 VIEW영역 셋팅.
                                                $("div.evenPrdBox_ty02[promNo=" + promNo + "]").html(initHtml);
                                                
                                            //선택된 GET상품의 총수량이 있으면.    
                                            }else{
                                                //라스트 마지막 클래스 순번에서 추가하거나 수정시 프로세스구현
                                                if(calcCnoTotQty > selItemCnt){
                                                    //추가선택할수 있도록 화면바뀜   
                                                    //버튼 바꾸기
                                                    $("#btnSelGetItem_"+promNo).text("선택");
                                                    $("#btnSelGetItem_"+promNo).attr("class","btnOrangeH30");
                                                    
                                                }else if(calcCnoTotQty <= selItemCnt){
                                                    //차이나는 수량만큼 마지막로우부터 선택한 수량 삭제
                                                    //기존수량수정프로세스(mcart.base.http.modQty.submit)에서 buy군수량합과선택한GET군과의 수치를 비교하여 삭제함.
                                                    
                                                    //화면제어
                                                    var delGetItemCnt =  selItemCnt - calcCnoTotQty;
                                                    var addGetItemCnt = 0;
                                                    var selItemQty = 0;
                                                    var updateQty = 0;
                                                    var reverseCnt = $('#p202InnerHtml_'+promNo).find('div.tit').length;
                                                    
                                                    //java의 수량수정 프로세스와 동일한 프로세스임. AJAX방식이므로 다시화면에 그려주기위한 프로세스임. 
                                                    //GET상품 단위 영역
                                                    $('#p202InnerHtml_'+promNo).find('div.tit').each(function(x,y){
                                                        reverseCnt--;
                                                        //마지막 GET상품부터 역순 처리한다.
                                                        var thisObj = $('#p202InnerHtml_'+promNo).find('div.bottom div.tit').eq(reverseCnt);
                                                        
                                                        if(reverseCnt >= 0){
                                                            //해당 GET상품의 수량을 가져온다.
                                                            selItemQty = parseInt(thisObj.attr("ordQty"));
                                                            
                                                            if(selItemQty > 0){
                                                                //예외처리 받을총수량, 선택된 GET상품의 총수량이 모두 0이면 해당 GET상품영역 삭제
                                                                if(calcCnoTotQty <= 0 || selItemCnt <= 0){
                                                                    //삭제
                                                                    $('div.bottom').remove('#'+thisObj.attr('goodsNo')+thisObj.attr('itemNo'));
                                                                    
                                                                //정상적인 CASE이면.        
                                                                }else{
                                                                    
                                                                    //총 GET상품 받을수있는 갯수 < 화면내에 선택된 GET상품의 총수량
                                                                    if(calcCnoTotQty < selItemCnt){
                                                                        //delete
                                                                        if(calcCnoTotQty <= (selItemCnt-selItemQty)){
                                                                            $('div.bottom').remove('#'+thisObj.attr('goodsNo')+thisObj.attr('itemNo'));
                                                                            selItemCnt = selItemCnt-selItemQty;
                                                                        //update    
                                                                        }else{
                                                                            if(selItemCnt-selItemQty == 0){
                                                                                updateQty = calcCnoTotQty;
                                                                            }else{
                                                                                updateQty = calcCnoTotQty - (selItemCnt - selItemQty);
                                                                            }
                                                                            
                                                                            if(updateQty > 0){
                                                                                //update
                                                                                thisObj.attr("ordQty", updateQty);
                                                                                thisObj.parents("div.box").find("p.prd_cnt").html("수량<span class='num'>" + updateQty + "</span>개");                                                                             
                                                                                //end 
                                                                                //selItemCnt = selItemCnt-updateQty;
                                                                                selItemCnt = selItemCnt-(selItemQty-updateQty);
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    });
                                                    
                                                    //같으면 선택완료상태로 화면 스크립트 제어
                                                    if(calcCnoTotQty == selItemCnt){
                                                        //버튼 바꾸기
                                                        $("#btnSelGetItem_"+promNo).text("다시선택");
                                                        $("#btnSelGetItem_"+promNo).attr("class","btnGrayH30");
                                                    }
                                                    
                                                }
                                            }
                                        }
                                    }
                                    //------------------------------------------ 마지막 순번일때 처리 끝
                                }
                            
                            });
                            //변수 초기화
                            sumCnoTotQty  = 0;
                            calcCnoTotQty = 0;
                            return false;
                            
                        } else {
                            // 오류 발생 시 값을 초기화 시킴
                            $(_selfTarget).val(orgOrdQty);
                            return false;
                        }
                    }
                });
                
            }catch(e){
             // 오류 발생 시 값을 초기화 시킴
                $(_selfTarget).val(orgOrdQty);
                return false;
            }
        });
        
        // 뒤로 가기 클릭 이벤트
        $('#go-back').click(function() {
            history.back();
            return false;
        });
        
        // 삭제 버튼 클릭 이벤트
        $("button[name=btnDelete]").click(function() {
            mcart.base.http.delItem.submit();
            return false;
        });
        
        /** 장바구니 구매하기 레이어 열기 Bind * */
    	$('.btn_toggole_layer').click(function() {
    		var quickYn = $("#quickYn").val();
    		if(quickYn == 'Y'){
    			common.wlog("cart_o2o_pay_more"); // 영역분석용
    		} else {
    			common.wlog("cart_pay_more"); // 영역분석용
    		}
    		
    		var $container = $(this).parents('.basket_btn_area_ty02.fixed');
    		var $target = $container.find('.toggle_area');
    		$container.toggleClass('on');

    	});
        
        //장바구니 이동 등록
        $("button[name=cartMoveRegBtn]").click(function() {
        	var jsonParam = null;
        	var resultData = new Array();
        	var url = _baseUrl + "cart/cartMoveRegJson.do";
        	var quickYn = $("#quickYn").val();
        	var cartRegQuickYn = 'Y';
        	if(quickYn == 'Y'){
        		cartRegQuickYn = 'N';
        	} else {
        		cartRegQuickYn = 'Y';
        	}
        	
        	var vCartNo = [];               //카트번호
            var vPromNo = [];               //프로모션번호
            var vPromKndCd = [];            //프로모션종류
            var vDrtPurYn = [];             //바로구매여부
            var vBuyCondStrtQtyAmt = [];    //n+1의 n에 해당
            var vGoodsNo = [];              //상품번호
            var vItemNo = [];               //아이템번호
        	
        	$('input[name=s_checkbox1]').each(function(){
                if($(this).prop('checked') == true){
                	var thisObj = $(this);
                	if(thisObj.parents('li').hasClass('soldout type2') === true){
                		soldOutCnt++;
                	}
                	var goodsNo = thisObj.parents('li').find('input[name=s_goods_no]').val();
                	var itemNo = thisObj.parents('li').find('input[name=s_item_no]').val();
                	var cartNo = thisObj.parents('li').find('input[name=s_cart_no]').val();
                	var ordQty = thisObj.attr('ordqty');
                	
                	var data = {
                            goodsNo : goodsNo,
                            itemNo : itemNo,
                            cartNo : cartNo,
                            quickYn : cartRegQuickYn,
                            ordQty : ordQty
                    };
                	resultData.push(data);  
                	
                	vCartNo.push(thisObj.parents("li").attr('cno'));
                    vPromNo.push(thisObj.parents("li").attr('oriPno'));
                    vPromKndCd.push(thisObj.parents("li").attr('promKndCd'));
                    vDrtPurYn.push(thisObj.parents("li").attr('drtPurYn'));
                    vBuyCondStrtQtyAmt.push(thisObj.parents("li").attr('buyCondStrtQtyAmt'));
                    vGoodsNo.push(thisObj.parents("li").attr('goodsNo'));
                    vItemNo.push(thisObj.parents("li").attr('itemNo'));

                }
            });
        	
        	if(resultData.length > 0){
        		
        		var cartMoveStayYn = 'Y';
        		
        		if($("#cartMoveStayYn").prop('checked') != true){
        			cartMoveStayYn = 'N';
        		}
        		
        		jsonParam = {
                    opCartBaseList        : resultData
                    , quickYn             : quickYn
                    , cartMoveStayYn      : cartMoveStayYn
                    , cartNoArray              : vCartNo
                    , buyPromNoArray           : vPromNo
                    , promKndCdArray           : vPromKndCd
                    , drtPurYnArray            : vDrtPurYn
                    , buyCondStrtQtyAmtArray   : vBuyCondStrtQtyAmt
                    , goodsNoArray             : vGoodsNo
                    , itemNoArray              : vItemNo
                };

        		$.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(jsonParam),
                    contentType: "application/json;charset=UTF-8",
                    dataType : 'json',
                    async: false,
                    cache: false,
                    success: function(res){
                       var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
                       if(data.result != true) {
                    	   alert(data.message);
                    	   return false;
                       } else {
                    	   mcart.base.layerBasketMoveDown('lay_moveBasket');
                    	   if(quickYn == 'Y'){
                    		   $(".layerAlim_ty02 > P").html('일반배송 장바구니로<br />이동했어요');
                    	   } else {
                    		   $(".layerAlim_ty02 > P").html('오늘드림 장바구니로<br />이동했어요');
                    	   }
                    	   $(".layerAlim_ty02").fadeIn(500);
                           setTimeout(function() {
                               $(".layerAlim_ty02").fadeOut(800);
                               setTimeout(function() {
                                   location.href = _secureUrl + "cart/getCart.do?quickYn="+cartRegQuickYn;
                               }, 1000);
                           }, 1000);
                       }
                    },
                    error : function(e) {
                        console.log(e);  
                        alert("죄송합니다. 고객센터에 문의해 주세요.");
                        return false;
                    }
                });
        	}

        	return false;
        });
        
        //장바구니 이동 
        $("button[name=cartMoveBtn]").click(function() {
        	var jsonParam = null;
        	var resultData = new Array();
        	var goodsList = new Array();
        	var url = _baseUrl + "cart/cartMoveCheckJson.do";
        	var soldOutCnt = 0;
        	
        	$('input[name=s_checkbox1]').each(function(){
                if($(this).prop('checked') == true){
                	var thisObj = $(this);
                	if(thisObj.parents('li').hasClass('soldout type2') === true){
                		soldOutCnt++;
                	}
                	var goodsNo = thisObj.parents('li').find('input[name=s_goods_no]').val();
                	var itemNo = thisObj.parents('li').find('input[name=s_item_no]').val();
                	
                	var data = {
                            goodsNo : goodsNo,
                            itemNo : itemNo,
                    };
                	resultData.push(data);
                	
                	var goodsImg = thisObj.parents('li').find('.prd_info .prd_thumb').html();
                	var goodsTitle = thisObj.parents('li').find('.prd_info .prd_name').html();
                	
                	var data2 = {
                			goodsImg : goodsImg,
                			goodsTitle : goodsTitle,
                    };
                	goodsList.push(data2);
                	
                }
            });
        	
        	if(soldOutCnt > 0){
        		alert('판매종료된 상품은 이동 불가합니다. 이동할 상품을 다시 선택해 주세요');
        		return false;
        	}
        	
        	if(resultData.length > 0){
        		var quickYn = $("#quickYn").val();
        		jsonParam = {
                    opCartBaseList : resultData
                    , quickYn : quickYn
                };
        		
        		$.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(jsonParam),
                    contentType: "application/json;charset=UTF-8",
                    dataType : 'json',
                    async: false,
                    cache: false,
                    success: function(res){
                       var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
                       if(data.result != true) {
                    	   alert(data.message);
                    	   return false;
                       } else {
                    	   //장바구니 이동 레이어
                    	   mcart.base.layerBasketMoveUp('lay_moveBasket');
                    	   $('#lay_moveBasket .move_barsket_info > p:eq(0) > span').html(resultData.length);
                    	   $('#lay_moveBasket .stay_list > li:not(:eq(0))').remove();
                    	   $.each(goodsList, function(index, item){
                    		   if(index > 0){
                    			   $('#lay_moveBasket .stay_list').append($('#lay_moveBasket .stay_list > li:eq(0)').clone());
                    		   }                    		   
                    		   $('#lay_moveBasket .stay_list > li:eq('+index+') .prd_info .prd_thumb').html(item.goodsImg);
                    		   $('#lay_moveBasket .stay_list > li:eq('+index+') .prd_info .prd_thumb > span').remove();
                    		   $('#lay_moveBasket .stay_list > li:eq('+index+') .prd_info .prd_name').html(item.goodsTitle);     
                     	   });
                       }
                    },
                    error : function(e) {
                        console.log(e);  
                        alert("죄송합니다. 고객센터에 문의해 주세요.");
                        return false;
                    }
                });
        	} else {
        		alert("상품을 선택해주세요.");
                return false;
        	}

        	return false;
        });	
        
        // 선택상품 삭제 버튼 클릭 이벤트
        $("button[name=partDelBtn]").click(function() {
        	var quickYn = $("#quickYn").val();
    		if(quickYn == 'Y'){
    			common.wlog("cart_o2o_part_del_btn");
    		} else {
    			common.wlog("cart_part_del_btn"); 
    		}
            
            //validation
            var checkCnt = 0;
            //올리브영 배송상품내의 체크박스
            $('input[name=s_checkbox1]').each(function(){
                if($(this).prop('checked') == true){
                    checkCnt++;
                }
            });
            
            //제휴업체 배송상품내의 체크박스
            $('input[name=s_checkbox2]').each(function(){
                if($(this).prop('checked') == true){
                    checkCnt++;
                }
            });
            
            if(checkCnt > 0){
                //선택삭제구분으로 삭제 function submit.
                mcart.base.http.delItem.submit('part');
                return false;
                
            }else{
                alert("상품을 선택해주세요.");
                return false;
            }
            
        });
        
        // 올리브영상품 체크박스 단일체크
        $("input[name=s_checkbox1]").click(function() {
            var changeObj = this;
            var promNo = $(this).parents('li').attr('pno');
            var checkedTotAmount = 0;
            var totCbxEa = 0;
            
            $('li[pno='+promNo+']').each(function(a,b){
                if($(this).find('input[name=s_checkbox1]').prop('checked') == true){
                    checkedTotAmount += parseInt($(this).find('[name=s_amount]').val());
                }
            });
            
            $('input[name=s_checkbox1]').each(function(a,b){
                if(promNo != ''){
                    if($(this).parents('li').attr('oriPno') == promNo){
                        //품절여부가 N인것만
                        //if($('input[name=s_checkbox1]').eq(a).parents("li").attr('soldOutYn') == "N"){
                            totCbxEa++;
                            //GET군 상품이 선택되어있거나 같은프로모션상품의 수량이 1보다 크면
                            if($('#p202InnerHtml_'+promNo).find('div.tit').length > 0 || checkedTotAmount > 1){
                                if(changeObj.checked == true)
                                    $("input[name=s_checkbox1]").eq(a).prop('checked',changeObj.checked);
                            }
                        //}
                    }
                }
            });
            
            // 체크박스 상태 저장
            var cartNo = $(changeObj).parents("li").attr("cno");
            var cartChkYn = $(changeObj).prop('checked') ? "Y" : "N";
            mcart.base.cartChk(cartNo, cartChkYn);
            
            // 모든 항목으로 선택 되면 전체가 선택 되게 수정 함. 
            var totCbxEa = $('input[name=s_checkbox1]').parents('li').length
            var chkCbxEa = $('input[name=s_checkbox1]:checked').length;
            $('#inp_allRe1').prop('checked', totCbxEa == chkCbxEa);
            
            mcart.base.computAmt();
        });
        
        // 업체상품 체크박스 단일체크
        $("input[name=s_checkbox2]").click(function() {
            
            var changeObj = this;
            var promNo = $(this).parents('li').attr('pno');
            var checkedTotAmount = 0;
            
            $('li[pno='+promNo+']').each(function(a,b){
                if($(this).find('input[name=s_checkbox2]').prop('checked') == true){
                    checkedTotAmount += parseInt($(this).find('[name=s_amount]').val());
                }
            });
            
            $('input[name=s_checkbox2]').each(function(a,b){
                if(promNo != ''){
                    if($(this).parents('li').attr('oriPno') == promNo){
                        if($('input[name=s_checkbox2]').eq(a).parents("li").attr('soldOutYn') == "N"){
                            //GET군 상품이 선택되어있거나 같은프로모션상품의 수량이 1보다 크면
                            if($('#p202InnerHtml_'+promNo).find('div.tit').length > 0 || checkedTotAmount > 1){
                                if(changeObj.checked == true)
                                    $("input[name=s_checkbox2]").eq(a).prop('checked',changeObj.checked);
                            }
                        }
                    }
                }
            });
            
            // 체크박스 상태 저장
            var cartNo = $(changeObj).parents("li").attr("cno");
            var cartChkYn = $(changeObj).prop('checked') ? "Y" : "N";
            mcart.base.cartChk(cartNo, cartChkYn);
            
            // 모든 항목으로 선택 되면 전체가 선택 되게 수정 함. 
            var totCbxEa = $('input[name=s_checkbox2]').parents('li').find('input[soldOutYn=N]').length
            var chkCbxEa = $('input[name=s_checkbox2]:checked').length;
            $('#inp_allRe2').prop('checked', totCbxEa == chkCbxEa);
            
            mcart.base.computAmt();
        });
        
        //전체체크박스 ReDefine 올리브영상품
        $('#inp_allRe1').change(function(e){
            var changeObj = this;
            $('input[name=s_checkbox1]').each(function(a,b){
                //if($('input[name=s_checkbox1]').eq(a).parents("li").attr('soldOutYn') == "N"){
                    $("input[name=s_checkbox1]").eq(a).prop('checked',changeObj.checked);
                //}
            });
            
            // 체크박스 상태 저장
            var cartNoList = [];
            $("input[name=s_checkbox1]:not(:disabled)").each(function() {
                var cartNo = $(this).parents("li").attr('cno');
                cartNoList.push(cartNo);
            });
            var cartChkYn = $('#inp_allRe1').prop('checked') ? "Y" : "N";
            mcart.base.cartChk(cartNoList.join('|'), cartChkYn);
            
            //
            mcart.base.computAmt();
        });
        
        //전체체크박스 ReDefine 업체상품
        $('#inp_allRe2').change(function(e){
            var changeObj = this;
            $('input[name=s_checkbox2]').each(function(a,b){
                //if($('input[name=s_checkbox2]').eq(a).parents("li").attr('soldOutYn') == "N"){
                    $("input[name=s_checkbox2]").eq(a).prop('checked',changeObj.checked);
                //}
            });
            
            // 체크박스 상태 저장
            var cartNoList = [];
            $("input[name=s_checkbox2]:not(:disabled)").each(function() {
                var cartNo = $(this).parents("li").attr('cno');
                cartNoList.push(cartNo);
            });
            var cartChkYn = $('#inp_allRe2').prop('checked') ? "Y" : "N";
            mcart.base.cartChk(cartNoList.join('|'), cartChkYn);
            
            //
            mcart.base.computAmt();
        });
        
        // 전체주문 버튼 클릭 이벤트
        $("button[name=allOrderBtn]").click(function() {
            window['presentYn'] = 'N';
            
            var checkCnt = 0;
            var checkCnt2 = 0;
            
            // 퀵배송 배송지 선택 체크
            if($("#quickYn").val()=="Y"){
                
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
                    
                /*if(hour < $("#quickOrdTimeFrom").val() || hour >=$("#quickOrdTimeTo").val() ){
                    alert("오늘드림 주문 가능시간은 오전 " + $("#quickOrdTimeFrom").val() + "시 ~ 오후 " + $("#quickOrdTimeTo").val() + "시 입니다");
                    return;
                }*/
                
                if($("#dlvpSeqSelect").val()=="" || $("#dlvpSeqSelect").val()==null){
                    alert("선택된 오늘드림 배송지가 없습니다.");
                    return;
                }
                
                //오늘드림 고도화 2020-01-06 추가

                var hldyYn = $("#hldyYn").val();
                var o2oOnlYn = $("#o2oOnlYn").val();
                var o2oMeshYn = $("#o2oMeshYn").val();
                
             // [오늘드림] 장바구니 배송지 오류 문구 관련 반영 시  $("#o2oDeliveryYn").val() == "N" 조건 추가 필요
                if($("#strNoSelect").val() == ""  || $("#strNoSelect").val()==null || $("#todayDeliFlag").val() == "N") {
                    alert("오늘드림 서비스 지역이 아닙니다. 다른 주소지를 선택해주세요.");
                    return;
                }
                
                if($("#ktmDestYn").val() == "N"){
                    alert("현재 선택된 주소는 유효하지 않습니다. 배송지 정보 수정 또는 다른 주소지를 선택해주세요.");
                    return;
                }
                
                if(hldyYn == "Y" || o2oOnlYn == "N" || o2oMeshYn == "N") {
                    alert("오늘은 서비스가 불가능한 지역입니다. 다른 주소지를 선택해주세요.");
                    return;
                }
            }
            
            $('li[pno]').each(function(){
                if($(this).attr('soldOutYn') == "Y"){
                    checkCnt++;
                }else{
                    checkCnt2++;
                }
            });
            
            if(checkCnt2 <= 0){
                alert("주문가능한 상품이 없습니다.");
                return false;
            }
            
            //validation
            if($('button.btnOrangeH30').length > 0){
                alert("추가 증정 행사 상품이 있습니다.\n추가 상품을 선택해 주세요.");
                return false;
            }
            
            if(checkCnt > 0){
                var isConfirm = confirm("일시품절 및 판매종료 상품은 주문이 불가합니다.\n주문불가 상품을 제외하고 주문하시겠습니까?");
                if(isConfirm){
                    $("#btnOrderTp").val("all");
                    mcart.base.http.onClickSubmit("all");
                    return false;
                }
                return false;
            }else{
                $("#btnOrderTp").val("all");
                mcart.base.http.onClickSubmit("all");
                return false;
            }
        });
        
        // 선택주문 버튼 클릭 이벤트
        $("button[name=partOrderBtn]").click(function() {
            window['presentYn'] = 'N';
            // 유효성 검사. 선물하기와 함께 사용하기 위해 공통 함수로 빼놓음.
            mcart.base.partOrderValidationCheck();
        });
        
        // 선물하기 버튼 클릭 이벤트
        $("button[name=presentOrderBtn]").click(function() {
            window['presentYn'] = 'Y';
            common.wlog("cart_present_order_btn"); // 영역분석용
            n_click_logging( _baseUrl + "?clickarea=cartPresentOrder"); // DS 시나리오 분석용 로그 남기기
            
            // 오늘드림 체크
            if($('#quickYn').val()=='Y'){
                alert("오늘드림 상품은 선물하기가 불가능합니다.");
                return false;
            }
            
            // 예약상품 체크
            var isRsvGoods = false;
            $('input[name=s_checkbox1]:checked,input[name=s_checkbox2]:checked').each(function(){
                if($(this).attr('rsvSaleYn') == 'Y' && $(this).attr('rsvLmtSctCd') == "20"){
                    isRsvGoods = true;
                    return false;
                }
            });
            
            if(isRsvGoods){
                alert('예약상품은 선물하실 수 없습니다. 일반 주문을 이용해주시거나 다른 상품을 선택해주세요.');
                return false;
            }
            
            mcart.base.partOrderValidationCheck();
        });
        
        // GET군 선택 버튼 클릭 이벤트
        $("button[name=btnGetPromItem]").click(function() {
            mcart.base.btnGetPromItemClick( $(this) );
        });
        
        //수량 10+ 선택시 select combo -> input text 로 변경 프로세스
        $('.prd_cnt').find('select').on({
            'change' : function(){
                if($(this).find('option:selected').text() == '10+'){
                    var prdTp = $(this).attr('prdTp');
                    var prdCnt = $(this).attr('prdCnt');
                    var ordPsbMinQty = $(this).attr('ordPsbMinQty');
                    var ordPsbMaxQty = $(this).attr('ordPsbMaxQty');
                    var orgOrdQty = $(this).attr('ordQty');
                    var qtyAddUnit = $(this).attr('qtyAddUnit');
                    
                    $(this).parents('div.price_info').find('div').addClass('none');
                    $(this).parents('div.price_info').find('button[name=btnQtyMod]').css('display','');
                    $(this).parent().prepend('<input type="tel" name="s_amount" prdTp="'+prdTp+'" prdCnt="'+prdCnt+'" ordPsbMinQty="'+ordPsbMinQty+'" ordPsbMaxQty="'+ordPsbMaxQty+'" qtyAddUnit="'+qtyAddUnit+'" ordQty="'+orgOrdQty+'" title="수량입력"  onkeyup="this.value=this.value.replace(/[^0-9]/g,\'\'); if(this.value>'+ordPsbMaxQty+')this.value='+ordPsbMaxQty+';""   />');
                    $(this).parent().find('input[type="tel"]').focusout(function(){
                        var ordQty = $(this).val();
                        if(ordQty == undefined || ordQty == "" || isNaN(ordQty)){
                            ordQty = orgOrdQty; 
                            $(this).val(ordQty);
                        }
                    });
                    $(this).parent().find('input[type="tel"]').focus();
                    $(this).remove();
                }
            }
        });
        
        mcart.base.computAmt();
        
        mcart.popLayer.deliveryAmt.init();
        
        //화면 로드 완료전까지 전체체크 disabled처리 재계산처리(computAmt) 오동작 방지.
        $('#inp_allRe1').removeAttr("disabled");
        $('#inp_allRe2').removeAttr("disabled");
        
        //
        if ($("input[name=s_checkbox1]").length == $("input[name=s_checkbox1]:disabled").length) {
            $('#inp_allRe1').prop("checked", false);
            $('#inp_allRe1').prop("disabled", true);
        } else {
            if ($("input[name=s_checkbox1]:not(:disabled)").length == $("input[name=s_checkbox1]:not(:disabled):checked").length) {
                $('#inp_allRe1').prop("checked", true);
            } else {
                $('#inp_allRe1').prop("checked", false);
            }
        }
        if ($("input[name=s_checkbox2]").length == $("input[name=s_checkbox2]:disabled").length) {
            $('#inp_allRe2').prop("checked", false);
            $('#inp_allRe2').prop("disabled", true);
        } else {
            if ($("input[name=s_checkbox2]:not(:disabled)").length == $("input[name=s_checkbox2]:not(:disabled):checked").length) {
                $('#inp_allRe2').prop("checked", true);
            } else {
                $('#inp_allRe2').prop("checked", false);
            }
        }
        
        //이미지 LazyLoad 셋팅 scr : 스크롤 이벤트로 이미지 로드 
        this.setLazyLoad('scr');
        
        var sumCnoTotQty = 0;   //화면내의 BUY상품군의 수량SUM
        var calcCnoTotQty = 0;  //GET상품 받을수 있는 갯수
        $('div[name=selGetGrp]').each(function(){
            var promNo = this.attributes.getNamedItem('promno').value;      //프로모션번호
            var promNotargetObj = $(document).find("li[pno="+promNo+"]");   //상품영역 buy군+get군
            
            promNotargetObj.each(function(idx){

                //프로모션이 걸린 상품
                if($(this).attr('promKndCd') == 'P201' || $(this).attr('promKndCd') == 'P202' || $(this).attr('promKndCd') == 'P203'){
                
                    //판매중인상품들만 sumCnoTotQty에 BUY상품군 수량SUM
                    if($(this).attr('soldOutYn') == "N"){
                        sumCnoTotQty += parseInt($(this).find('[name=s_amount]').val());
                    }
                    
                    //프로모션상품 마지막 BUY군의 경우
                    //if($(this).hasClass('chain_box last') || typeof $(this).attr('class') == 'undefined'){
                    if(idx == promNotargetObj.length-1){
                        //받을수있는 상품갯수 계산  
                        calcCnoTotQty = Math.floor(sumCnoTotQty/($("#selGet_"+promNo).attr("buyCondStrtQtyAmt")));
                        //받을수있는 상품갯수 셋팅
                        $("#selGet_"+promNo).attr("getCondStrtTotQty",calcCnoTotQty);
                        
                        //GET상품군의 선택한 총갯수
                        var selItemCnt = 0;
                        $('#p202InnerHtml_'+promNo).find('div.bottom div.tit').each(function(){
                            selItemCnt += parseInt( $(this).attr("ordQty") );
                        });
                        
                        if(selItemCnt == '' || isNaN(selItemCnt) ){
                            selItemCnt = 0; 
                        }
                        
                        //GET상품 영역의 안내TEXT및 버튼스타일 변경.
                        //기본 GET상품리스트는 jsp내의 for문에서 그려줌.
                        if(selItemCnt > 0){
                            //GET상품 받을수 있는 갯수 > GET상품군의 선택한 총갯수
                            if(calcCnoTotQty > selItemCnt){
                                //추가선택할수 있도록 화면바뀜   
                                //버튼 바꾸기
                                $("#btnSelGetItem_"+promNo).text("선택");
                                $("#btnSelGetItem_"+promNo).attr("class","btnOrangeH30");
                                
                            //GET상품 받을수 있는 갯수 < GET상품군의 선택한 총갯수    
                            }else if(calcCnoTotQty < selItemCnt){
                                
                                //##########  blank process
                            
                            //GET상품 받을수 있는 갯수 == GET상품군의 선택한 총갯수 - 같으면 선택완료상태로 화면 스크립트 제어    
                            }else{
                                //버튼 바꾸기
                                $("#btnSelGetItem_"+promNo).text("다시선택");
                                $("#btnSelGetItem_"+promNo).attr("class","btnGrayH30");
                                
                            }
                        }
                    }
                }
            
            });
            //변수 초기화
            sumCnoTotQty  = 0;
            calcCnoTotQty = 0;
        });
        
        //GET상품군의 버튼을 활성화 해준다.
        $('button[name=btnGetPromItem]').css("display","");
        
        setTimeout(function() {
            //웹로그 바인딩
            mcart.base.bindWebLog();
        }, 700);
        
        //모바일 하단에 히스트로백(<-), top버튼 기존 페이지 노출보다 위로옮김.(플로팅주문과 겹침현상 발생)
        $("#fixBtn").css("bottom", "130px");
        
        //플로팅 주문버튼 보임/안보임 처리
        /*var _wheight = $(window).height(),
            _btn_basket = $('.basket_btn_area.bottom').offset().top;
        if(_wheight>_btn_basket){
            $('.fixed').hide();
        }else{
            $(window).scroll(function() {
                if($(window).scrollTop()>(_btn_basket+10)-_wheight){
                    $('.fixed').fadeOut();
                }else{
                    $('.fixed').fadeIn();
                }
            });    
        }*/   
        
        // 옵션변경 div 셀렉트 박스 이벤트
        attachEvtOptChangeSelDiv();
        
        // buy상품 수량 focusout 이벤트 설정
        $("div.prd_cnt [name=s_amount]").each(function(){
            var orgOrdQty = $(this).attr('ordQty');
            
            $(this).focusout(function(){
                var ordQty = $(this).val();
                if(ordQty == undefined || ordQty == "" || isNaN(ordQty)){
                    ordQty = orgOrdQty; 
                    $(this).val(ordQty);
                }
            });
        });
        
     // 관심상품행사 안내
        /*$(window).scroll(function(){
            var scrollH = 100;
            if(scrollH < $(window).scrollTop()){
                $('#boxarea_noti').css('bottom', '138px');
            }else{
                $('#boxarea_noti').css('bottom', '73px');
            }               
        });*/
        
        // 관심상품행사 알림문구 2초후에 사라짐
        setTimeout(function(){
            $('#boxarea_noti .txt').addClass('on');
        }, 500);
        setTimeout(function(){
            $('#boxarea_noti .txt').removeClass('on');
        }, 5000);
        $('#boxarea_noti .txt').on('click', function(){
            $('#boxarea_noti .txt').removeClass('on');
        });

        //혜택알림설정 전문보기
      $('.more_box>.btn_more').on('click', function(){
          var thisid =  $(this).parents('.popLayerWrap').attr('id');
         $(this).toggleClass('on');
         newPopHeight(thisid);
         
         if($(this).hasClass('on')){
      	   $('#svcEvtTermEntire').text("전문 접기");   
         }else{
      	   $('#svcEvtTermEntire').text("전문 보기");   
         }
      });
        
        // 관심상품행사 종 플로팅 클릭 이벤트
        $(document).on("click","#btnGoodsEventNotice",function(e){
            common.wlog("cart_goods_event_noti"); // 클릭지표
            popLayerOpen();
            return false;
        });
        
        // 관심상품행사 플로팅은 앱에서만 보여준다. (다시보지않기를 선택한적이 없는 고객만 대상임)
        if( common.app.appInfo.isapp && sessionStorage.getItem("mGoodsEventEnable") == "Y" ){
            
            var tempCompareVersion = "";
            
            if (common.app.appInfo.ostype == "10") { // ios
                tempCompareVersion = '2.1.3';
            }else if(common.app.appInfo.ostype == "20"){ // android
                tempCompareVersion = '2.1.1';
            }
            
            // 앱버전 비교
            var varCompareVersion = common.app.compareVersion(common.app.appInfo.appver, tempCompareVersion);
            
            if(varCompareVersion  ==  ">") { // tempCompareVersion 이후 버전이면 종모양 플로팅을 보여준다.
                $("#boxarea_noti").show();
                
            } else {  // tempCompareVersion 이후 버전이 아니면 관심상품알림에 대한 안내문구를 보여준다.
                $("#goodsEventNotiTxt").show();
            }
        }
        
        // 선택상품 개수 표시 이벤트 등록
        $(document).on("change","#inp_allRe1, #inp_allRe2, .prdChk", function(e){
        	
            mcart.base.showSelectedGoodsCnt();
        });
        
        // 페이지 최초 진입시 선택상품 개수 표시
        mcart.base.showSelectedGoodsCnt();
    },
    
    layerBasketMoveUp : function(IdName) {
    	var popLayer = ('#' + IdName);
		var _this = $(this);

		$(popLayer).show().stop(0).animate({
			opacity: 1,
			bottom: 0,
		}, 250);
		$('.dim').show();
		$('.dim').bind('click', function() {
			mcart.base.layerBasketMoveDown(IdName);
		});
	},

	layerBasketMoveDown : function() {
		var popLayer = $("#lay_moveBasket");
		$(popLayer).css({
			opacity: 0,
			bottom: -300 + 'px',
			display: 'none',
		})
		$('.dim').hide();
	},
    
    fnchandleProgress : function(el) {
    	var $container = el;
		var $target = $container.find('.progress_wrap');
		var $bg = $target.find('.progress_bar');
		var $bar = $target.find('.progress_bar');
		var per = $bar.attr('data-value');
		var pre = $bar.attr('data-pre');
		var i = 0;
		if(pre != undefined){
		    i = pre;  
		}

		var intervalId = setInterval(function(){
			
            if(i < per){
		       i++;
				$bar.css('width',i+'%');     
		    } else if(i > per){
                i--;
				$bar.css('width',i+'%');
		    } else {
		       clearInterval(intervalId);     
		       if(i == 100){
                    setTimeout(function() {
                        $container.addClass('goal');
                    },150);  
		       } else if(i < 100){
		              setTimeout(function() {
                        $container.removeClass('goal');
                    },150);  
		       }   
		    }        
		},10);

		$bar.attr('data-pre',per);
	},
    
    curationDlexPop : function(price) {
    	if(price == undefined || price <= 0 || price == "") {
    		return;
    	}
    	
    	price = Math.ceil(price / 1000) * 1000;
    	$("#delxInfo").find(".fee").unbind("click").click(function(event) {
        	event.preventDefault();
        	if(curation.popLoad) {
        		curation.popLoad = false;
        		if($("#quickYn").val() == 'Y'){
        			common.wlog('cart_o2o_dlvr_info');
        		} else {
        			common.wlog('cart_dlvr_info');
        		}
        		
        		var goodsNos = [];
        		$(cartInfoList).each(function(idx, item){
        			goodsNos.push(item.goodsNo);
        		});
        		
        		var param = {
        				size : 20,
        				viewType : 'HorzPop',
        				loginArea : 'N',
        				styleNo : 26,
        				popupYn : 'Y',
        				viewArea : 'goods_curation_pop',
        				recType : 'a024',
        				quickYn : $("#quickYn").val() != "Y" ? "N" : "Y",
        						cps : true,
        						cpt : "m002",
        						price : price,
        						rccode : "mc_cart_01_a"
        		};
        		
        		if(goodsNos.toString() != undefined && goodsNos.toString() != "") {
        			var requestUrl = _baseUrl + "curation/getLgcGoodsNoListAjax.do"
        			common.Ajax.sendRequest("POST", requestUrl, {goodsNos : goodsNos.toString()}, function(res) {
        				param.iids = res.data;
        				curation.popLoadEvent(param);
        			});
        		} else {
        			curation.popLoadEvent(param);
        		}
        	}
        });
    },
    
    
    // TODO 선택 구매 유효성 검사
    partOrderValidationCheck : function() {
        var checkCnt = 0;   //체크박스에 선택된 갯수
        var checkCnt2 = 0;  //판매중이 아닌 체크박스의 총 갯수
        var checkCnt3 = 0;  //판매중인 체크박스의 총 갯수
        var checkCnt4 = 0;  //모든 상품중 판매중인 상품갯수
        
        //validation
        var sucessBool = true; //화면내의 초록색 [선택]버튼의 노출유무
        
        //2+1프로모션중 GET군이 선택되어있지 않고 수량이 1개인 BUY군 상품 1개만 선택하여 주문가능하도록 하기위한 체크변수
        var checkedTotAmount = 0;
        $('input[name=s_checkbox1]').each(function(){
            
            if($(this).prop('checked') == true){
                var promNo = $(this).parents("li").attr('pno');
                //get상품군이 선택되어있지 않고 
                if($(document).find('#selGet_'+promNo).find('button.btnOrangeH30').length > 0){
                    var buyCondStrtQtyAmt = $(this).parents('li').attr('buyCondStrtQtyAmt');
                    
                    //n+1의 프로모션에 n이 1인것 1+1과A+B
                    if(buyCondStrtQtyAmt == '1'){
                        sucessBool = false;
                    // 2+1인경우    
                    }else{
                        //같은 프로모션의 BUY상품군
                        checkedTotAmount = 0;
                        $('li[pno='+promNo+']').each(function(a,b){
                            //체크된것
                            if($(this).find('input[type=checkbox]').prop('checked') == true){
                                checkedTotAmount += parseInt($(this).find('[name=s_amount]').val());
                            }
                        });
                        
                        //GET상품이 선택되어 있지 않고 
                        //2+1프로모션의 같은프로모션상품들중 선택된 수량의 SUM이 1보다 크면
                        if(checkedTotAmount > 1){
                            sucessBool = false;
                        }
                    }
                    
                }
                if($(this).parents("li").attr("soldOutYn") == "Y"){
                    checkCnt2++;
                }else{
                    checkCnt3++;
                }
                checkCnt++;
            }
            if($(this).parents("li").attr("soldOutYn") == "N"){
                checkCnt4++;
            }
            
            
        });
        
        // 퀵배송 배송지 선택 체크
        if($("#quickYn").val()=="Y"){
            
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
            
            /*if(hour < $("#quickOrdTimeFrom").val() || hour >=$("#quickOrdTimeTo").val() ){
                alert("오늘드림 주문 가능시간은 오전 " + $("#quickOrdTimeFrom").val() + "시 ~ 오후 " + $("#quickOrdTimeTo").val() + "시 입니다");
                return;
            }*/
            
            if($("#dlvpSeqSelect").val()=="" || $("#dlvpSeqSelect").val()==null){
                alert("선택된 오늘드림 배송지가 없습니다.");
                return;
            }
            
            //오늘드림 고도화 2020-01-06 추가
            var hldyYn = $("#hldyYn").val();
            var o2oOnlYn = $("#o2oOnlYn").val();
            var o2oMeshYn = $("#o2oMeshYn").val();
            
            // [오늘드림] 장바구니 배송지 오류 문구 관련 반영 시  $("#o2oDeliveryYn").val() == "N" 조건 추가 필요
            if($("#strNoSelect").val() == ""  || $("#strNoSelect").val()==null || $("#todayDeliFlag").val() == "N") {
                alert("오늘드림 서비스 지역이 아닙니다. 다른 주소지를 선택해주세요.");
                return;
            }
            
            if($("#ktmDestYn").val() == "N"){
                alert("현재 선택된 주소는 유효하지 않습니다. 배송지 정보 수정 또는 다른 주소지를 선택해주세요.");
                return;
            }
            
            if(hldyYn == "Y" || o2oOnlYn == "N" || o2oMeshYn == "N") {
                alert("오늘은 서비스가 불가능한 지역입니다. 다른 주소지를 선택해주세요.");
                return;
            }
        }
        
        /*$('input[name=s_checkbox2]').each(function(){
            if($(this).prop('checked') == true){
                //get상품군이 선택되어있지 않고 
                if($(this).parents("li").find('button.btnOrangeH30').length > 0){
                    sucessBool = false;
                }
                if($(this).parents("li").attr("soldOutYn") == "Y"){
                    checkCnt2++;
                }else{
                    checkCnt3++;
                }
                checkCnt++;
            }
            if($(this).parents("li").attr("soldOutYn") == "N"){
                checkCnt4++;
            }
        });*/
        
        $('input[name=s_checkbox2]').each(function(){
            if($(this).prop('checked') == true){
                var promNo = $(this).parents('li').attr('pno');
                //get상품군이 선택되어있지 않고
                if($(document).find('#selGet_'+promNo).find('button.btnOrangeH30').length > 0){
                    var buyCondStrtQtyAmt = $(this).parents('li').attr('buyCondStrtQtyAmt');
                    
                    //n+1의 프로모션에 n이 1인것 1+1과A+B
                    if(buyCondStrtQtyAmt == '1'){
                        sucessBool = false;
                    // 2+1인경우    
                    }else{
                        //같은 프로모션의 BUY상품군
                        checkedTotAmount = 0;
                        $('li[pno='+promNo+']').each(function(a,b){
                            //체크된것
                            if($(this).find('input[type=checkbox]').prop('checked') == true){
                                checkedTotAmount += parseInt($(this).find('[name=s_amount]').val());
                            }
                        });
                        
                        //GET상품이 선택되어 있지 않고 
                        //2+1프로모션의 같은프로모션상품들중 선택된 수량의 SUM이 1보다 크면
                        if(checkedTotAmount > 1){
                            sucessBool = false;
                        }
                    }
                    
                }
                if($(this).parents("li").attr("soldOutYn") == "Y"){
                    checkCnt2++;
                }else{
                    checkCnt3++;
                }
                checkCnt++;
            }
            if($(this).parents("li").attr("soldOutYn") == "N"){
                checkCnt4++;
            }
            
            
        });
        
        //모든 상품중 판매중인 상품갯수
        if(checkCnt4 <= 0){
            alert("주문가능한 상품이 없습니다.");
            return false;
        }
        
        //화면내의 초록색 [선택]버튼의 노출유무
        if(sucessBool){
            //체크박스에 선택된 갯수
            if(checkCnt > 0){
                //판매중이 아닌 체크박스의 총 갯수
                if(checkCnt2 > 0){
                    var isConfirm = confirm("일시품절 및 판매종료 상품은 주문이 불가합니다.\n주문 불가 상품 제외 "+checkCnt3+"개의 상품을 주문하시겠어요?");
                }else{
                    var isConfirm = confirm("선택하신 "+checkCnt3+"개의 상품을 주문하시겠어요?");
                }
                
                if(isConfirm){
                    //주문유형 : 선택주문 셋팅
                    $("#btnOrderTp").val("part");
                    mcart.base.http.onClickSubmit("part");
                }
                return false;
                
            }else{
                alert("상품을 선택해주세요.");
                return false;
            }
        }else{
            alert("추가 증정 행사 상품이 있습니다.\n추가 상품을 선택해 주세요.");
            return false;
        }
    },
    
    //주문금액 계산
    computAmt : function() {
        //올리브영 상품
        var normPrc1 = 0.0;      // 상품 금액
        var salePrc1 = 0.0;      // 최종 금액
        var discPrc1 = 0.0;      // 할인 금액(금액 차이)
        var orderQty1 = 0;       // 총 주문 수량
        var deliPrc1 = 0;        // 배송비
        var cpnDcAmt1 = 0;        // 할인금액
        
        //제휴업체 상품
        var normPrc2 = 0.0;      // 상품 금액
        var salePrc2 = 0.0;      // 최종 금액
        var discPrc2 = 0.0;      // 할인 금액(금액 차이)
        var orderQty2 = 0;       // 총 주문 수량
        var deliPrc2 = 0;        // 배송비
        var cpnDcAmt2 = 0;        // 할인금액
        
        //전체 올리브영 + 제휴업체
        var normPrc3 = 0.0;      // 상품 금액
        var salePrc3 = 0.0;      // 최종 금액
        var discPrc3 = 0.0;      // 할인 금액(금액 차이)
        var orderQty3 = 0;       // 총 주문 수량
        var deliPrc3 = 0;        // 배송비
        var cpnDcAmt3 = 0;        // 할인금액
        
        var entrNoDlex = new Array(); //업체별 배송비, 무료하한금액, 주문금액
        
        
        cartNoArray = [];
        rmitPostNo = "";
        nonCheck = true;
        
        //올리브영 배송상품의 총수량,총판매가,총할인금액, 카트번호셋팅
        $('input[name=s_checkbox1]').each(function(a,b){
            if($('input[name=s_checkbox1]').eq(a).prop('checked') == true){
            	if($('input[name=s_checkbox1]').eq(a).parents("li").attr('soldOutYn') != "Y"){
	                orderQty1 += parseInt($(this).attr('ordQty'));
	//                salePrc1  += parseInt($(this).attr('salePrc')) * parseInt($(this).attr('ordQty'));
	                salePrc1  += parseInt($(this).attr('orgSalePrc')) * parseInt($(this).attr('ordQty'));
	                discPrc1 += parseInt($(this).attr('cpnDcAmt')) * parseInt($(this).attr('ordQty'));
	                discPrc1 += (parseInt($(this).attr('orgSalePrc')) - parseInt($(this).attr('salePrc'))) * parseInt($(this).attr('ordQty'));
	                
	                cartNoArray.push($('input[name=s_checkbox1]').eq(a).parents("li").attr('cno')); 
	                nonCheck = false;
            	}
            }
        });
        
        //제휴업체 배송상품의 총수량,총판매가,총할인금액, 카트번호셋팅
        $('input[name=s_checkbox2]').each(function(a,b){
        	if($('input[name=s_checkbox2]').eq(a).parents("li").attr('soldOutYn') == "Y"){
        		return false;
        	}
            if($('input[name=s_checkbox2]').eq(a).prop('checked') == true){
                orderQty2 += parseInt($(this).attr('ordQty'));
//                salePrc2  += parseInt($(this).attr('salePrc')) * parseInt($(this).attr('ordQty'));
                salePrc2  += parseInt($(this).attr('orgSalePrc')) * parseInt($(this).attr('ordQty'));
                discPrc2 += parseInt($(this).attr('cpnDcAmt')) * parseInt($(this).attr('ordQty'));
                discPrc2 += (parseInt($(this).attr('orgSalePrc')) - parseInt($(this).attr('salePrc'))) * parseInt($(this).attr('ordQty'));
                
                cartNoArray.push($('input[name=s_checkbox2]').eq(a).parents("li").attr('cno')); 
                nonCheck = false;
            }
        });
        
        //선택 상품 정보
        var cartbaseExList = new Array();
        $('li[pno]').each(function(){
            
            var soldOutYn   = $(this).attr('soldOutYn');
            var cartNo      = $(this).find('input[name=s_cart_no]').val();
            var promNo      = $(this).find('input[name=s_prom_no]').val();
            var salePrc     = parseInt($(this).find('input[name=s_sale_prc]').val());
            var cpnDcAmt    = parseInt($(this).find('input[name=s_cpn_dc_amt]').val());
            var dlexPolcNo  = $(this).find('input[name=s_dlex_polc_no]').val();
            var tradeShpCd  = $(this).find('input[name=s_trade_shp_cd]').val();
            var entrNo      = $(this).find('input[name=s_entr_no]').val();
            var sumPkgYn    = $(this).find('input[name=s_sum_pkg_yn]').val();
            var whsgExpcDt  = $(this).find('input[name=s_whsg_expc_dt]').val();
            var qty         = parseInt($(this).find('[name=s_amount]').val());
            var dlexFreeYn  =  $(this).find('input[name=s_dlex_free_yn]').val();
            var goodsNo  =  $(this).find('input[name=s_goods_no]').val();
            var itemNo  =  $(this).find('input[name=s_item_no]').val();
            
            var saleCpnDcPrc = salePrc-cpnDcAmt
            
            if(($(this).find('input[name=s_checkbox1]').prop('checked') ||$(this).find('input[name=s_checkbox2]').prop('checked'))
                    && soldOutYn=='N') {
                
                //자사배송일경우 업체코드 0으로 셋팅
                if(tradeShpCd == '1') {
                    entrNo = "0"; 
                }
                
                var key = "";
                    
                key = entrNo;    
                key += "_" + whsgExpcDt.replace( "-", "").replace( "-", "");
                key += "_" + sumPkgYn;
                key += "_" + dlexPolcNo;
                key += "_" + dlexFreeYn;
                //console.log("key : "+key);
                
                if(sumPkgYn == 'Y') {
                    key += "_" + "";
                    key += "_" + "";
                    key += "_" + "";
                    key += "_" + "";
                    
                    //합배송인경우 수량을 곱한다.
                    saleCpnDcPrc = saleCpnDcPrc*qty;
                } else {
                    key += "_" + cartNo;
                    key += "_" + qty;
                    key += "_" + goodsNo;
                    key += "_" + itemNo;
                    saleCpnDcPrc = saleCpnDcPrc*qty;
                }
                
                //배송별로 가격을 합친다.
                if(cartbaseExList[key] == undefined || cartbaseExList[key] == 'undefined') {
                    cartbaseExList[key] = saleCpnDcPrc;
                } else {
                    cartbaseExList[key] = cartbaseExList[key] + saleCpnDcPrc;
                }
            
            }
        });
        
        //배송비 정보
        var etEntrDlexInfoExKeys = Object.getOwnPropertyNames(etEntrDlexInfoExList);
        
        //배송비 계산 시작시 배송비 0 처리
        etEntrDlexInfoExKeys.map( function(key, i){
            
            if(key != "length") {

                //배송정보
                var etEntrDlexInfoEx = etEntrDlexInfoExList[key];
                
                //배송비 계산 금액
                etEntrDlexInfoEx.dlexAmt = 0;
                etEntrDlexInfoEx.dlexFreeYn = 'N';

            }
        });
        
        //상품 정보
        var cartBaseExKeys = Object.getOwnPropertyNames(cartbaseExList);
        
        
        
        //배송비별 배송비 계산
        cartBaseExKeys.map( function(key, i){
            if(key != "length") {
//                console.log("key : "+key);
                
                var keyArray = key.split("_");
                
                var entrNo = keyArray[0];//업체 번호
                var whsgExpcDt = keyArray[1];//예약 일자
                var sumPkgYn = keyArray[2];//합배송 여부
                var dlexPolcNo = keyArray[3];//상품 배송비 정책 번호
                var dlexFreeYn = keyArray[4];//상품 배송비
                var cartNo = keyArray[5];
                var qty = keyArray[6];
                var goodsNo = keyArray[7];
                var itemNo = keyArray[8];
                
                var dlexKey = dlexPolcNo 
                            + "_" + whsgExpcDt 
                            + "_" + sumPkgYn
                            + "_" + goodsNo
                            + "_" + itemNo;
                
//                console.log("dlexKey : "+dlexKey);
                //배송비별 결재금액 합계
                var totalSalePrc = cartbaseExList[key];//판매금액 * 수량

                
                //배송정보
                var etEntrDlexInfoEx = etEntrDlexInfoExList[dlexKey];

                //배송비부과구분코드
                var dlexCostTpCd = etEntrDlexInfoEx.dlexCostTpCd;
                
                //배송금액
                var aplyAdtnCostAmt = etEntrDlexInfoEx.aplyAdtnCostAmt;
                
                //기준금액
                var stdAdtnCostAmt = etEntrDlexInfoEx.stdAdtnCostAmt;
                
                // 오늘드림 혜택 기준 금액
                var dlexFvrStdAmt = etEntrDlexInfoEx.dlexFvrStdAmt;
                
                // 오늘드림 혜택 금액
                var dlexFvrAmt = etEntrDlexInfoEx.dlexFvrAmt;                
                
                //예약배송, 합배송 아닌경우 업체별 배송비관련 셋팅
                if(whsgExpcDt == '' && sumPkgYn == 'Y'){
                	if(dlexFreeYn != 'Y'){
                		entrNoDlex[entrNo+"_totalSalePrc"] = totalSalePrc;
                        entrNoDlex[entrNo+"_aplyAdtnCostAmt"] = aplyAdtnCostAmt;
                        entrNoDlex[entrNo+"_stdAdtnCostAmt"] = stdAdtnCostAmt;
                	} 
                } else {
                	entrNoDlex[entrNo+"_sumPkgYn"] = 'N';
                }
                entrNoDlex[entrNo+"_dlexCostTpCd"] = dlexCostTpCd;
                
                //전체 배송비
                if(dlexFreeYn != undefined && dlexFreeYn == 'Y') {
                    
                    //배송비가 무료인경우 배송 정책의 배송비 무료여부를 Y로 설정
                    etEntrDlexInfoEx.dlexFreeYn = dlexFreeYn;
                    
                }else if(dlexCostTpCd == '10') {
                    //합배송 불가 상품일경우 배송비 * 수량
/*                    if(sumPkgYn == 'N' ) {
                        aplyAdtnCostAmt = aplyAdtnCostAmt*qty
                    }*/
                    //배송 정책의 배송비 배송비 변경
                    if($("#quickYn").val()=="Y"){
                        if (dlexFvrStdAmt == stdAdtnCostAmt) {  // 무료하한금액
                            //stdAdtnCostAmt  =  dlexFvrStdAmt;
                            //aplyAdtnCostAmt = dlexFvrAmt;
                            etEntrDlexInfoEx.dlexAmt = (stdAdtnCostAmt > totalSalePrc) ? aplyAdtnCostAmt : 0;
                        }  else {                                               // 오늘드림혜택 기준금액
                            etEntrDlexInfoEx.dlexAmt = (dlexFvrStdAmt > totalSalePrc) ? aplyAdtnCostAmt : dlexFvrAmt;
                        }
                        //console.log("stdAdtnCostAmt=["+stdAdtnCostAmt+"]");
                    } else {
                        etEntrDlexInfoEx.dlexAmt = (stdAdtnCostAmt > totalSalePrc) ? aplyAdtnCostAmt : 0;
                    }
                }else if(dlexCostTpCd == '20') {
                    etEntrDlexInfoEx.dlexAmt = 0;
                }else if(dlexCostTpCd == '30') {
                    //합배송 불가 상품일경우 배송비 * 수량
/*                    if(sumPkgYn == 'N' ) {
                        aplyAdtnCostAmt = aplyAdtnCostAmt*qty
                    }*/
                    //배송 정책의 배송비 배송비 변경
                    etEntrDlexInfoEx.dlexAmt = aplyAdtnCostAmt;
                }else{
                    //배송 정책의 배송비 배송비 변경
                    etEntrDlexInfoEx.dlexAmt = aplyAdtnCostAmt;
                }
            }
        });
        
        var price = 0;
        //배송비안내
        //올리브영 배송 안내 (일반배송, 오늘드림)
        if($('input[name=s_checkbox1]:checked').length == 0) {
        	var s_dlex_polc_no = $('input[name=s_checkbox1]').parent('li').find('input[name=s_dlex_polc_no]').val();
            var etEntrDlexInfoEx = etEntrDlexInfoExList[s_dlex_polc_no+'__Y__'];
            if(etEntrDlexInfoEx != undefined && etEntrDlexInfoEx.entrNo == 0){
            	$('#delxInfo > dt > a').attr('class','fee');
            	$("#delxInfo > dd > p").hide();
                $('#delxInfo > dt > a').html('<strong>'+(etEntrDlexInfoEx.stdAdtnCostAmt).numberFormat()+'</strong>원 이상 무료 배송');
                $('#delxInfo .progress_bar').attr('data-value','0');
    			$('#delxInfo .progress_bar').html('0%');
    			
    			mcart.base.fnchandleProgress($('#delxInfo'));
    			
    	        price = (etEntrDlexInfoEx.stdAdtnCostAmt);
            }	
        } else if($('input[name=s_checkbox1]:checked').length > 0){
        	var s_dlex_polc_no = $('input[name=s_checkbox1]').parent('li').find('input[name=s_dlex_polc_no]').val();
            var etEntrDlexInfoEx = etEntrDlexInfoExList[s_dlex_polc_no+'__Y__'];
            if(etEntrDlexInfoEx.entrNo == 0){
            	$("#delxInfo > dd > p").hide();
            	var entrNo = 0; //올리브영
            	var stdAdtnCostAmt = entrNoDlex[entrNo+'_stdAdtnCostAmt']; //기준금액
            	var totalSalePrc = entrNoDlex[entrNo+'_totalSalePrc']; //총 금액
            	if(entrNoDlex[entrNo+'_sumPkgYn'] == 'Y' || entrNoDlex[entrNo+'_sumPkgYn'] == undefined) { //합배송 불가 OR 예약배송상품 (미포함:Y)
            		if(stdAdtnCostAmt > totalSalePrc){ //기준금액 미만
            			var percent = Math.floor(totalSalePrc / stdAdtnCostAmt * 100);
            			$('#delxInfo > dt > a').attr('class','fee');
            			$('#delxInfo > dt > a').html('<strong>'+(stdAdtnCostAmt-totalSalePrc).numberFormat()+'</strong>원 추가시 무료 배송 ');
            			$('#delxInfo .progress_bar').attr('data-value',percent);
            			$('#delxInfo .progress_bar').html(percent+'%');
            			
            			mcart.base.fnchandleProgress($('#delxInfo'));
            			
            			price = (stdAdtnCostAmt-totalSalePrc);
            		} else if(stdAdtnCostAmt <= totalSalePrc){ //기준금액 이상
            			$('#delxInfo > dt > a').attr('class','free');
            			$('#delxInfo > dt > a').html('무료 배송 ');
            			$('#delxInfo .progress_bar').attr('data-value','100');
            			$('#delxInfo .progress_bar').html('100%');
            			$('#delxInfo > dt > a').attr("href", "javascript:;");
            			$("#delxInfo > dt > a").attr("onclick","javascript:;");
            			mcart.base.fnchandleProgress($('#delxInfo'));
            		} else if(totalSalePrc == undefined){
            			$('#delxInfo > dt > a').attr('class','fee');
                    	$("#delxInfo > dd > p").hide();
                        $('#delxInfo > dt > a').html('<strong>'+(etEntrDlexInfoEx.stdAdtnCostAmt).numberFormat()+'</strong>원 이상 무료 배송');
                        $('#delxInfo .progress_bar').attr('data-value','0');
            			$('#delxInfo .progress_bar').html('0%');
            			
            			mcart.base.fnchandleProgress($('#delxInfo'));
            			
            			price = (etEntrDlexInfoEx.stdAdtnCostAmt);
            		}
            	} else { //합배송 불가 OR 예약배송상품 (포함:N)
            		$("#delxInfo > dd > p").show();
            		if(stdAdtnCostAmt > totalSalePrc){ //기준금액 미만
            			var percent = Math.floor(totalSalePrc / stdAdtnCostAmt * 100);
            			$('#delxInfo > dt > a').attr('class','fee');
            			$('#delxInfo > dt > a').html('<strong>'+(stdAdtnCostAmt-totalSalePrc).numberFormat()+'</strong>원 추가시 무료 배송 ');
            			$('#delxInfo .progress_bar').attr('data-value',percent);
            			$('#delxInfo .progress_bar').html(percent+'%');
            			
            			mcart.base.fnchandleProgress($('#delxInfo'));
            			
            			price = (stdAdtnCostAmt-totalSalePrc);
            		} else if(stdAdtnCostAmt <= totalSalePrc){ //기준금액 이상
            			$('#delxInfo > dt > a').attr('class','free');
            			$('#delxInfo > dt > a').html('무료 배송 ');
            			$('#delxInfo .progress_bar').attr('data-value','100');
            			$('#delxInfo .progress_bar').html('100%');
            			$('#delxInfo > dt > a').attr("href", "javascript:;");
            			$("#delxInfo > dt > a").attr("onclick","javascript:;");
            			mcart.base.fnchandleProgress($('#delxInfo'));
            		} else if(stdAdtnCostAmt == undefined){
            			var s_dlex_polc_no = $('input[name=s_checkbox1]').parent('li').find('input[name=s_dlex_polc_no]').val();
                        var etEntrDlexInfoEx = etEntrDlexInfoExList[s_dlex_polc_no+'__Y__'];
                        $('#delxInfo > dt > a').attr('class','fee');
                        $('#delxInfo > dt > a').html('<strong>'+(etEntrDlexInfoEx.stdAdtnCostAmt).numberFormat()+'</strong>원 추가시 무료 배송');
            			$('#delxInfo .progress_bar').attr('data-value','0');
            			$('#delxInfo .progress_bar').html('0%');  
            			
            			mcart.base.fnchandleProgress($('#delxInfo'));
            			
            			price = (etEntrDlexInfoEx.stdAdtnCostAmt);
            		}
            	}
            	
            	mcart.base.curationDlexPop(price);
            }
        }
        
        //업체 배송비 안내
        etEntrDlexInfoExKeys.map( function(key, i){
            if(key != "length") {
                //배송정보
                var etEntrDlexInfoEx = etEntrDlexInfoExList[key];
                if(etEntrDlexInfoEx.entrNo != 0){
                	if($('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').length > 1){
                    	$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]:not(:last)').remove();
                    } 
                    if($('input[name=s_checkbox2]:checked').parent('li').find('input[name=s_entr_no]:input[value="'+etEntrDlexInfoEx.entrNo+'"]').length == 0){
                    	$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('a').attr("href", "/m/search/getSearchMain.do?query="+etEntrDlexInfoEx.entrNo);
                    	$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('a').attr("onclick","javascript:common.wlog('cart_dlvr_info2')");
                    	$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('a').show();
                    	$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('.desc').hide();
                    	if(etEntrDlexInfoEx.dlexCostTpCd == '10'){
                    		$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"] .txt').html('동일 업체 상품<span>'+(etEntrDlexInfoEx.stdAdtnCostAmt).numberFormat()+'</span>원 이상 무료 배송');
                    	} else {
                    		$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"] .txt').html('배송비<span>'+(etEntrDlexInfoEx.aplyAdtnCostAmt).numberFormat()+'</span>원');
                    	}
                    } else {
                    	$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('a').attr("href", "/m/search/getSearchMain.do?query="+etEntrDlexInfoEx.entrNo);
                    	$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('a').attr("onclick","javascript:common.wlog('cart_dlvr_info2')");
                    	$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('a').show();
                    	if(etEntrDlexInfoEx.dlexCostTpCd == '10'){ //배송비 부과 구분(금액)
                    		var stdAdtnCostAmt = entrNoDlex[etEntrDlexInfoEx.entrNo+'_stdAdtnCostAmt']; //기준금액
                        	var totalSalePrc = entrNoDlex[etEntrDlexInfoEx.entrNo+'_totalSalePrc']; //총 금액
                    		if(entrNoDlex[etEntrDlexInfoEx.entrNo+'_sumPkgYn'] == 'Y' || entrNoDlex[etEntrDlexInfoEx.entrNo+'_sumPkgYn'] == undefined) { //합배송 불가 OR 예약배송상품 (미포함:Y)
                    			$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('.desc').hide();
                    			if(stdAdtnCostAmt > totalSalePrc){ //기준금액 미만
                        			$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"] .txt').html('동일 업체 상품<span>'+(stdAdtnCostAmt-totalSalePrc).numberFormat()+'</span>원 추가시 무료배송');
                            	} else if(stdAdtnCostAmt <= totalSalePrc){ //기준금액 이상
                            		$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('a').hide();
                            		$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"] .txt').html('무료배송');
                            	}
                        	} else { //합배송 불가 OR 예약배송상품 (포함:N)
                        		$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('.desc').show();
                        		if(stdAdtnCostAmt <= totalSalePrc){ //기준금액 이상
                        			$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('a').hide();
                            		$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"] .txt').html('무료배송');
                            	} else if(stdAdtnCostAmt == undefined){
                        			$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"] .txt').html('동일 업체 상품<span>'+(etEntrDlexInfoEx.stdAdtnCostAmt).numberFormat()+'</span>원 추가시 무료배송');
                        		} else {
                        			$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"] .txt').html('동일 업체 상품<span>'+(stdAdtnCostAmt-totalSalePrc).numberFormat()+'</span>원 추가시 무료배송');
                        		}
                        	}
                    	} else { //배송비 부과 구분(유료)
                    		if(entrNoDlex[etEntrDlexInfoEx.entrNo+'_sumPkgYn'] == 'Y' || entrNoDlex[etEntrDlexInfoEx.entrNo+'_sumPkgYn'] == undefined) { //합배송 불가 OR 예약배송상품 (미포함:Y)
                    			$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('.desc').hide();
                    			$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"] .txt').html('배송비<span>'+(etEntrDlexInfoEx.aplyAdtnCostAmt).numberFormat()+'</span>원');
                        	} else { //합배송 불가 OR 예약배송상품 (포함:N)
                        		$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"]').find('.desc').show();
                        		$('.partner_fee[data-value|="'+etEntrDlexInfoEx.entrNo+'"] .txt').html('배송비<span>'+(etEntrDlexInfoEx.aplyAdtnCostAmt).numberFormat()+'</span>원');
                        	}
                    	}
                    }
                }
            }
        });
        
        
        //화면에 보여줄 금액 계산
        etEntrDlexInfoExKeys.map( function(key, i){
            
            if(key != "length") {
                
                //배송정보
                var etEntrDlexInfoEx = etEntrDlexInfoExList[key];
                
                
                //업체 번호
                var entrNo = etEntrDlexInfoEx.entrNo;
                
                //배송비 계산 금액
                var dlexAmt = etEntrDlexInfoEx.dlexAmt;
                
                if($("#quickYn").val() == "Y" && dlexAmt > 0) { // 오늘드림 최소 배송비 2500원으로 고정
                	dlexAmt = dlexRsvAmt;
                }
                
                //배송금액
                var aplyAdtnCostAmt = etEntrDlexInfoEx.aplyAdtnCostAmt;
                
                //기준금액
                var stdAdtnCostAmt = etEntrDlexInfoEx.stdAdtnCostAmt;
                
                //무료여부
                var dlexFreeYn = etEntrDlexInfoEx.dlexFreeYn;
                
                //console.log(key + " : " + entrNo + " : "+  dlexAmt + " : " + dlexFreeYn);
                
                //전체 배송비
                if(dlexFreeYn != undefined && dlexFreeYn == 'Y') {
                    
                    
                } else {
                    
                    if(entrNo == '0') {
                        //자사 배송일 경우
                        deliPrc1 += dlexAmt;
                    } else {
                        //업체 배송일 경우
                        deliPrc2 += dlexAmt;
                        
                    }
                    
                    

                }
            }
        });

        normPrc3 = normPrc1 + normPrc2;
        salePrc3 = salePrc1 + salePrc2;
        discPrc3 = discPrc1 + discPrc2;
        orderQty3 = orderQty1 + orderQty2;
        deliPrc3 = deliPrc1 + deliPrc2;

        var targetId = 0;
        if(cartTenInfoList.length > 0 && cartFourtyInfoList.length > 0){
            var index = 0;
            if($(".basket_info_ty02:eq("+index+")").length > 0){
                $(".basket_info_ty02:eq("+index+") .tx_price:eq(0)").html((salePrc1).numberFormat());           // 상품금액(즉시할인가를 제외한 판매가)
                if((discPrc1).numberFormat() > 0 ){
                    $(".basket_info_ty02:eq("+index+") .tx_price:eq(1)").html("- "+(discPrc1).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }else{
                    $(".basket_info_ty02:eq("+index+") .tx_price:eq(1)").html((discPrc1).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }
                
                $(".basket_info_ty02:eq("+index+") .tx_price:eq(2)").html((deliPrc1).numberFormat());           // 배송비(총판매가-총할인금액기준으로 배송비정책에 맞게출력)
                $(".basket_info_ty02:eq("+index+") .tx_price:eq(3)").html((salePrc1 - discPrc1 + deliPrc1).numberFormat()); // 주문금액(배송비를 포함한 최종결제금액)
                
                index++;
            }
            
            if($(".basket_info_ty02:eq("+index+")").length > 0){
                $(".basket_info_ty02:eq("+index+") .tx_price:eq(0)").html((salePrc2).numberFormat());           // 상품금액(즉시할인가를 제외한 판매가)
                if((discPrc2).numberFormat() > 0 ){
                    $(".basket_info_ty02:eq("+index+") .tx_price:eq(1)").html("- "+(discPrc2).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }else{
                    $(".basket_info_ty02:eq("+index+") .tx_price:eq(1)").html((discPrc2).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }
                
                $(".basket_info_ty02:eq("+index+") .tx_price:eq(2)").html((deliPrc2).numberFormat());           // 배송비(총판매가-총할인금액기준으로 배송비정책에 맞게출력)
                $(".basket_info_ty02:eq("+index+") .tx_price:eq(3)").html((salePrc2 - discPrc2 + deliPrc2).numberFormat()); // 주문금액(배송비를 포함한 최종결제금액)
            }
            
                $(".total_basket_info_ty02 .tx_price:eq(0)").html((salePrc3).numberFormat());           // 상품금액(즉시할인가를 제외한 판매가)
                if((discPrc3).numberFormat() > 0 ){
                    $(".total_basket_info_ty02 .tx_price:eq(1)").html("- "+(discPrc3).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }else{
                    $(".total_basket_info_ty02 .tx_price:eq(1)").html((discPrc3).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }
                
                $(".total_basket_info_ty02 .tx_price:eq(2)").html((deliPrc3).numberFormat());           // 배송비(총판매가-총할인금액기준으로 배송비정책에 맞게출력)
                $(".total_basket_info_ty02 .tx_price:eq(3)").html((salePrc3 - discPrc3 + deliPrc3).numberFormat()); // 주문금액(배송비를 포함한 최종결제금액)
                
                $(".total_basket_layer .tx_price:eq(0)").html((salePrc3).numberFormat());           // 상품금액(즉시할인가를 제외한 판매가)
                if((discPrc3).numberFormat() > 0 ){
                    $(".total_basket_layer .tx_price:eq(1)").html("- "+(discPrc3).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }else{
                    $(".total_basket_layer .tx_price:eq(1)").html((discPrc3).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }
                
                $(".total_basket_layer .tx_price:eq(2)").html((deliPrc3).numberFormat());           // 배송비(총판매가-총할인금액기준으로 배송비정책에 맞게출력)
                $(".total_basket_layer .tx_price:eq(3)").html((salePrc3 - discPrc3 + deliPrc3).numberFormat()); // 주문금액(배송비를 포함한 최종결제금액)
                
        }else{
            if(cartTenInfoList.length > 0){
                $(".total_basket_info_ty02 .tx_price:eq(0)").html((salePrc1).numberFormat());           // 상품금액(즉시할인가를 제외한 판매가)
                if((discPrc1).numberFormat() > 0 ){
                    $(".total_basket_info_ty02 .tx_price:eq(1)").html("- "+(discPrc1).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }else{
                    $(".total_basket_info_ty02 .tx_price:eq(1)").html((discPrc1).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }
                
                $(".total_basket_info_ty02 .tx_price:eq(2)").html((deliPrc1).numberFormat());           // 배송비(총판매가-총할인금액기준으로 배송비정책에 맞게출력)
                $(".total_basket_info_ty02 .tx_price:eq(3)").html((salePrc1 - discPrc1 + deliPrc1).numberFormat()); // 주문금액(배송비를 포함한 최종결제금액)               
                
                $(".total_basket_layer .tx_price:eq(0)").html((salePrc1).numberFormat());           // 상품금액(즉시할인가를 제외한 판매가)
                if((discPrc1).numberFormat() > 0 ){
                    $(".total_basket_layer .tx_price:eq(1)").html("- "+(discPrc1).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }else{
                    $(".total_basket_layer .tx_price:eq(1)").html((discPrc1).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }
                
                $(".total_basket_layer .tx_price:eq(2)").html((deliPrc1).numberFormat());           // 배송비(총판매가-총할인금액기준으로 배송비정책에 맞게출력)
                $(".total_basket_layer .tx_price:eq(3)").html((salePrc1 - discPrc1 + deliPrc1).numberFormat()); // 주문금액(배송비를 포함한 최종결제금액)
            }else if(cartFourtyInfoList.length > 0){
                $(".total_basket_info_ty02 .tx_price:eq(0)").html((salePrc2).numberFormat());           // 상품금액(즉시할인가를 제외한 판매가)
                if((discPrc2).numberFormat() > 0 ){
                    $(".total_basket_info_ty02 .tx_price:eq(1)").html("- "+(discPrc2).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }else{
                    $(".total_basket_info_ty02 .tx_price:eq(1)").html((discPrc2).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }
                $(".total_basket_info_ty02 .tx_price:eq(2)").html((deliPrc2).numberFormat());           // 배송비(총판매가-총할인금액기준으로 배송비정책에 맞게출력)
                $(".total_basket_info_ty02 .tx_price:eq(3)").html((salePrc2 - discPrc2 + deliPrc2).numberFormat()); // 주문금액(배송비를 포함한 최종결제금액)
                
                $(".total_basket_layer .tx_price:eq(0)").html((salePrc2).numberFormat());           // 상품금액(즉시할인가를 제외한 판매가)
                if((discPrc2).numberFormat() > 0 ){
                    $(".total_basket_layer .tx_price:eq(1)").html("- "+(discPrc2).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }else{
                    $(".total_basket_layer .tx_price:eq(1)").html((discPrc2).numberFormat());      // 할인금액(즉시할인금액이 있을경우 반영하여출력)
                }
                $(".total_basket_layer .tx_price:eq(2)").html((deliPrc2).numberFormat());           // 배송비(총판매가-총할인금액기준으로 배송비정책에 맞게출력)
                $(".total_basket_layer .tx_price:eq(3)").html((salePrc2 - discPrc2 + deliPrc2).numberFormat()); // 주문금액(배송비를 포함한 최종결제금액)
            }
            
        }
        
        //총배송비가 0인경우 배송비상세보기 버튼 안보이게 처리
        if((deliPrc3).numberFormat() <= 0 || $("#quickYn").val() == "Y"){
            $('button[name=btnDlexAmtPopLayer]').css('display','none');
        }else{
            $('button[name=btnDlexAmtPopLayer]').css('display','');
        }
        
        if($("#quickYn").val() == "Y" && deliPrc3 > 0) {
            $(".span_quickDeliCharge").show();
        } else {
            $(".span_quickDeliCharge").hide();
        }
        
    },
    
    cartChk : function(cartNos, cartChkYn) {
        
        if (!cartNos) {
            return;
        }
        
        
        //console.log(cartNos + " / " + cartChkYn);
        var result = mcart.base.http.chkYn.submit(cartNos, cartChkYn);
        
        if(result) {
            //console.log("상태 변경이 완료되었습니다.");
        }
    },
    
    /** setLazyLoad 셋팅 **/
    setLazyLoad : function(type) {
        common.setLazyLoad(type);
        
        setTimeout(function() {
            $(document).resize();

        }, 100);
    },
    
    //  행사안내 팝업 오픈
    openEvtInfoPop : function( promNo, promKndCd, promCond, goodsNo, itemNo ){
        
        var quickYn = $("#quickYn").val();
        
        var url = _baseUrl + "goods/getGoodsPromEvtInfoAjax.do";
        var data = {promNo : promNo, promKndCd : promKndCd, promCond : promCond, goodsNo : goodsNo, itemNo : itemNo, quickYn : quickYn};
        common.Ajax.sendRequest("POST",url,data,mcart.base._callBackGoodsEvtInfo);
    },

    //  행사안내 콜백
    _callBackGoodsEvtInfo : function(res){
        
        $("#cart_layer_pop_wrap").html(res);
        //닫기버튼 펑션 교체
        $('button.layer_close.type2').attr('onclick',"mcart.base.closePromEvtPop();");
        //레이어 팝업 띄우는 함수
        fnLayerSet("cart_layer_pop_wrap", "open");
        
    },
    
    //  행사안내 팝업 닫기
    closePromEvtPop : function(){
        
        fnLayerSet('cart_layer_pop_wrap', 'close');
        
        if ( location.href.indexOf("getCart.do") > 0 && common.cart.regCartCnt > 0 ){
            var linkCartNo = location.href.substring(location.href.indexOf("cartNo=")+7);
            var sumCartNo = "";
            
            if(linkCartNo != ""){
                if(cartNosForDirectCart != ""){
                    sumCartNo = linkCartNo + "," + cartNosForDirectCart;
                }else{
                    sumCartNo = linkCartNo;
                }
            }
            //행사안내레이어에서 장바구니 버튼 클릭시 리턴받은 카트번호를 저장하는 변수 초기화.
            cartNosForDirectCart = "";
            common.cart.regCartCnt = 0;
            
            if(location.href.indexOf("cartNo=") > 0){
                location.href = _secureUrl + "cart/getCart.do?cartNo=" + sumCartNo;
            }else{
                window.location.reload();
            }
        }
    },
    
    //  레코벨 추천 상품 팝업 오픈
    openRecoBellGoodsSoldOutPop : function( lgcGoodsNo, goodsNo, quickYn, midCatNo){
        var url = _baseUrl + "cart/getEigeneGoodsSoldOutCartAjax.do";
        n_click_logging(url); // DS 시나리오 분석용 로그 남기기
        var data = {lgcGoodsNo : lgcGoodsNo, goodsNo : goodsNo, quickYn : quickYn, midCatNo : midCatNo};
        
        if (common.app != undefined  && common.app.appInfo != undefined && common.app.appInfo.isapp) {
        	var title = "대신 이 상품 어떠세요?";
        	url = _baseUrl + "cart/getEigeneGoodsSoldOutCartPop.do?" + $.param(data);
            location.href = "oliveyoungapp://openPage?" 
                + "title=" + common.app.fixedEncodeURIComponent(title)
                + "&url=" + common.app.fixedEncodeURIComponent(url) 
                + "&closeYn=Y"
                + "&isSlideUp=Y";
        } else {
        	common.Ajax.sendRequest("POST",url,data,mcart.base._callBackRecoBellGoodsSoldOutInfo);
        }
    },
    
    //  레코벨 추천 상품 콜백
    _callBackRecoBellGoodsSoldOutInfo : function(res){
    	$(".crtPopFullWrap").find(".popTitle").text("대신 이 상품 어떠세요?");
        $(".crtPopFullWrap").find(".popCont").html(res);
        curation.popFullOpen();
    },
    
    // 레코벨 추천 상품 장바구니 담기(장바구니에서 일시품절인 경우 레코벨 추천상품 대신 담기 추가)
    recobellGoodsSoldOutRegCart : function(goodsNo){
        var url = _baseUrl + "cart/recobellGoodsSoldOutRegCart.log";
        n_click_logging(url); // DS 시나리오 분석용 로그 남기기
        
        // 프로모션 정보 가져오기
        common.cart.promKndCd = $("#promKndCd_"+goodsNo).val();
        common.cart.promNo = $("#promNo_"+goodsNo).val();
        common.cart.buyCnt = $("#buyCnt_"+goodsNo).val();
        common.cart.getItemAutoAddYn = $("#getItemAutoAddYn_"+goodsNo).val();
        common.cart.getItemGoodsNo = '';
        common.cart.getItemItemNo = '';
        
        // 옵션상품도 아니고 세트상품도 아닌 경우(단품)
        // 자바단에서 옵션 or 세트인 경우 dupYn을 Y로 셋팅중.
        if ($("#dupYn_"+goodsNo).val() != 'Y') {
            //옵션이 없는 상품일 경우 바로 장바구니 등록 
            var cartGoodsNo = $("#paramGoodsNo_"+goodsNo).val();
            var cartItemNo = $("#paramItemNo_"+goodsNo).val();
            
            // 오늘드림 전문관에서 장바구니 클릭시 val값은 Y이다
            var cartQuickYn = $("#quickYn_"+goodsNo).val();
            // Y가 아닌경우는 오늘드림 관련 제어가 필요 없기 때문에 N으로 초기화
            if(cartQuickYn != "Y"){
                cartQuickYn = "N";
            } 
            // 오늘드림 장바구니에서 클릭시 셋팅
            var quickYn = $("#quickYn").val();
            if(quickYn == "Y"){ 
                cartQuickYn = "Y";
            }

            //  옵션선택이 없다면, 파라미터 받은 값으로 바로 RegCart 실행
            if(cartGoodsNo != undefined && cartGoodsNo != "" && cartItemNo != undefined && cartItemNo != "" ){
                var resultData = new Array();
                
                var param = { 
                      goodsNo : cartGoodsNo,
                      itemNo : cartItemNo,
                      ordQty : 1,
                      quickYn : cartQuickYn
                }
                resultData.push(param);
                
                // 프로모션이 동일(P201), A+B(P203) 이고, N+1 중 N이 1인 경우, FreeGift 가 1종류인 경우 Get상품 추가
                var promNo = common.cart.promNo;
                var promKndCd = common.cart.promKndCd;
                
                var buyGoodsNo = cartGoodsNo;
                var buyItemNo = cartItemNo;
                var buyOrdQty = 1;
                var samePrdSumOrdQty = buyOrdQty;
                var buyCondStrtQtyAmt = common.cart.buyCnt;
                
                var getItemAutoAddYn = common.cart.getItemAutoAddYn;
                var getGoodsNo = (promKndCd == "P201") ? cartGoodsNo : $("#getItemGoodsNo_"+goodsNo).val();
                var getItemNo = (promKndCd == "P201") ? cartItemNo : $("#getItemItemNo_"+goodsNo).val();
                var getOrdQty = 1;
                
                if(promNo != undefined && promNo != '' && buyCondStrtQtyAmt == 1){
                    if(promKndCd == "P201" || 
                      (promKndCd == "P203" && getItemAutoAddYn == "Y" && 
                       getGoodsNo != undefined && getGoodsNo != '' && 
                       getItemNo != undefined && getItemNo != '')){
                    
                        var getGoodsData = {
                                goodsNo : getGoodsNo,
                                itemNo : getItemNo,
                                ordQty : buyOrdQty,
                                rsvGoodsYn : "N", // 예약상품여부
                                dispCatNo : "",  // 전시카테고리 번호
                                drtPurYn : "N",            //바로구매여부
                                promKndCd : promKndCd,     //프로모션구분
                                crssPrstNo : promNo,        //프로모션번호
                                prstGoodsNo : buyGoodsNo,  //타겟buy군의 상품번호
                                prstItemNo : buyItemNo,    //타겟buy군의 아이템번호
                                buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                                samePrdSumOrdQty : samePrdSumOrdQty,     //상품번호 아이템번호가 같은상품의 수량을 합한값
                                getItemAutoAddYn : getItemAutoAddYn
                        };
                                                       
                        resultData.push(getGoodsData);
                    }
                }
                // N+1 동일 일 경우 장바구니에 자동 추가 (끝)
                common.cart.regCart(resultData);
            } else {
                alert("상품정보가 올바르지 않습니다.");
            }
        } else {
            //옵션 OR 세트상품인 경우
            common.cart.getItemGoodsNo = $("#getItemGoodsNo_"+goodsNo).val();
            common.cart.getItemItemNo = $("#getItemItemNo_"+goodsNo).val();
            
            //대표 상품 번호를 셋팅
            var selGoodsNo = $("#paramGoodsNo_"+goodsNo).val();
            
            var resultData = new Array();
            
            var goodsSctCd = $("#goodsSctCd_"+goodsNo).val();
            
            // 선택된 goodsNo, itemNo로 셋팅
            var cartGoodsNo = $("#cartGoodsNo_"+goodsNo).val();
            var cartItemNo = $("#cartItemNo_"+goodsNo).val();
            
            var pkgGoodsYn = $("#pkgGoodsYn_"+goodsNo).val();
            var pkgGoodsNo = (pkgGoodsYn == "Y") ? $("#paramGoodsNo_"+goodsNo).val() : ""; // 세트 상품인 경우 대표 상품번호가 필요
            
            var promKndCd = $("#promKndCd_"+goodsNo).val();
            var buyCondStrtQtyAmt = parseInt( $("#buyCnt_"+goodsNo).val() );
            var ordQty = 1;
            
            // 오늘드림 전문관에서 상품 옵션 선택시 
            // 오늘드림 장바구니에 가게끔 처리
            // 옵션상품이 아닌경우와 같은 로직탐
            var cartQuickYn = $("#quickYn_"+goodsNo).val();
            if(cartQuickYn != "Y"){
                cartQuickYn = "N";
            } 
            // 오늘드림 장바구니에서 클릭시 셋팅
            var quickYn = $("#quickYn").val();
            if(quickYn == "Y"){ 
                cartQuickYn = "Y";
            }
            
            if( common.cart.cartSelValid(cartGoodsNo, cartItemNo, goodsSctCd) ){
                var param = { 
                        goodsNo : cartGoodsNo,
                        itemNo : cartItemNo,
                        pkgGoodsNo : pkgGoodsNo,
                        ordQty : 1,
                        cartNo : common.cart.cartNo,
                        promKndCd : promKndCd,
                        buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                        quickYn : cartQuickYn
                  }
                
                  resultData.push(param);
                
                    // 프로모션이 동일(P201), A+B(P203) 이고, FreeGift 가 1종류인 경우 Get상품 추가
                    var promKndCd = $("#promKndCd_"+goodsNo).val();
                    var promNo = $("#promNo_"+goodsNo).val();
                    var buyCondStrtQtyAmt = parseInt( $("#buyCnt_"+goodsNo).val() );
                    var getItemAutoAddYn = $("#getItemAutoAddYn_"+goodsNo).val();
                    var getGoodsNo = (promKndCd == "P201") ? cartGoodsNo : $("#getItemGoodsNo_"+goodsNo).val();
                    var getItemNo = (promKndCd == "P201") ? cartItemNo : $("#getItemItemNo_"+goodsNo).val();
                
                    if(promNo != undefined && promNo != '' && buyCondStrtQtyAmt == 1){
                        if(promKndCd == "P201" || 
                          (promKndCd == "P203" && getItemAutoAddYn == "Y" && 
                           getGoodsNo != undefined && getGoodsNo != '' && 
                           getItemNo != undefined && getItemNo != '')){
                            var getGoodsData = {
                                    goodsNo : getGoodsNo,
                                    itemNo : getItemNo,
                                    ordQty : 1,
                                    rsvGoodsYn : "N", // 예약상품여부
                                    dispCatNo : "",  // 전시카테고리 번호
                                    drtPurYn : "N",            //바로구매여부
                                    promKndCd : promKndCd,     //프로모션구분
                                    crssPrstNo : promNo,        //프로모션번호
                                    prstGoodsNo : cartGoodsNo,  //타겟buy군의 상품번호
                                    prstItemNo : cartItemNo,    //타겟buy군의 아이템번호
                                    buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                                    samePrdSumOrdQty : 0,     //상품번호 아이템번호가 같은상품의 수량을 합한값
                                    getItemAutoAddYn : getItemAutoAddYn
                            };
                                                           
                            resultData.push(getGoodsData);
                        }
                    }
                    // 옵션있는 N+1 동일인 경우 Get상품 추가 (끝)
      
                  common.cart.regCart(resultData);
            }
        }
    },
    
    callRecoBellGoodsInCart : function() {
        var goodsNos = [];
        $(cartInfoList).each(function(idx, item){
            goodsNos.push(item.goodsNo);
        });
        
        var url = _baseUrl + "cart/getRecoBellGoodsInCartAjax.do";
        var param = {
                goodsNos : goodsNos.toString(),
                quickYn : $("#quickYn").val() || null,
        };
        
        var _callBackRecoBellGoodsInCartInfo = function(data) {
            $("#curation_area_a015").html("");
            $("#curation_area_a015").html(data);
            window['isCurationArea015Called'] = 'Y';
        };
        
        common.Ajax.sendRequest("POST",url,param,_callBackRecoBellGoodsInCartInfo);
    },
    
    
    //웹로그 바인딩
    bindWebLog : function() {
        
        //N+1행사 자세히보기
        $("#evtPopup").bind("click", function() {
            common.wlog("cart_n1_detail");
        });
        
        //N+1행사 추가상품 선택
        $("button[name=btnGetPromItem]").bind("click", function() {
            common.wlog("cart_n1_more");
        });
        
        //선택주문
        $("button[name=partOrderBtn]").bind("click", function() {
            common.wlog("cart_order_select");
        });
        
        //전체주문
        $("button[name=allOrderBtn]").bind("click", function() {
            common.wlog("cart_order_all");
        });
        
        //배송 체크박스
        $("#inp_allRe1").bind("click", function() {
        	var quickYn = $("#quickYn").val();
    		if(quickYn == 'Y'){
    			common.wlog("cart_o2o_dlvr_all_check");
    		} else {
    			common.wlog("cart_dlvr_all_check");
    		}
        });
        
        //장바구니 이동 버튼
        $("button[name=cartMoveBtn]").bind("click", function() {
        	var quickYn = $("#quickYn").val();
    		if(quickYn == 'Y'){
    			common.wlog("cart_o2o_move_btn");
    		} else {
    			common.wlog("cart_move_btn");
    		}
        });
        
        //제휴업체 배송 체크박스
        $("#inp_allRe2").bind("click", function() {
            common.wlog("cart_dlvr_all_check2");
        });
        
        //제휴업체 배송 체크박스
        $("#inp_allRe2").bind("click", function() {
            common.wlog("cart_dlvr_all_check2");
        });
        
    },
    
    // GET군 선택 버튼 클릭 이벤트
    btnGetPromItemClick : function(obj) {
        //프로모션내의 마지막 BUY상품군의 상품정보를 셋팅
        var goodsNo = obj.attr('goodsNo');
        var itemNo = obj.attr('itemNo');
        var cartNo = obj.attr('cartNo');
        var promNo = obj.attr('promNo');
//        var oriPromNo = $(this).parents('li').attr('oriPno');
        
        //--- #########  전역변수 프로모션번호(selTargetPromNo) 셋팅  #########
        selTargetPromNo = promNo;
        //--- #################################################################
        
        //GET상품 선택 LAYER 호출
        mcart.popLayer.promGift.popLayerOpen(goodsNo,itemNo,promNo);
    },
    
    // PUSH 동의 선택
    goodsEventNotiAgr : function(){
        
        var url = _baseUrl + "cart/udtMbrMktRcvAgrAjax.do";
        var data = {
            pushYn : "Y"
        };
        common.Ajax.sendRequest("GET",url,data,mcart.base._callbackGoodsEventAgrAfter);
    },
    
    // PUSH 동의 콜백
    _callbackGoodsEventAgrAfter : function(data){
        popLayerClose();
        
        if (data.result) {
        	mcart.base.sendTmsPush(data.pushYn); // TMS 푸시동의정보 송신
            alert(data.rcvInfoChgMsg);
            
            $("#boxarea_noti").hide(); // 동의 성공 시 장바구니행사알림 플로팅 가림
        } else {
        	alert("서비스가 원활하지 않아 수신정보 변경에 실패하였습니다.");
        }
        return false;
    },
    
    // [3343779] TMS 앱푸시수신동의값 변경 송신
    sendTmsPush : function(push){
		var url = _secureUrl + 'customer/getUserSsoMbrNo.do';
		var data = {"push" : push};
		
		common.Ajax.sendRequest("POST",url,data,mcart.base._callbackSendTmsPush);
    },
    
    _callbackSendTmsPush : function(res){
    	
		$.ajax({
			type: "POST" ,
			url: _tmsPushUrl,
			dataType : "json",
			data: res,
			contentType: "application/json",
			error: function (request, status, error) {
//				console.log(error);
			}, success: function (res) {
//				console.log(res);
			}
		});
		
		return false;
    },
    
    // 관심상품행사 알림 플로팅 아이콘 다시 보이지 않기
    goodsEventDisable : function(){
        popLayerClose();
        $('#boxarea_noti').fadeOut();
        sessionStorage.setItem("mGoodsEventEnable","N");
    },
    
    // 구매하기 버튼에 선택상품 개수 표시
    showSelectedGoodsCnt : function(){
        $(".selectedGoodsCntSpan").html($(".prdChk:checked").length);
    }
};


$.namespace('mcart.popLayer.promGift');
mcart.popLayer.promGift = {
    focusOutFlag : false,
     /**
     * 초기화 함수 화면 로드가 끝나면 자동으로 실행 된다.
     */
    init : function() {
        // 수량 수정(0 -> 1 개로 선택시 상품리스트에 하이라이트 효과적용)
        $('input[name=promGiftAmount]').focusin(function(){
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
                $(this).val(prev);
                alert('수량이 올바르지 않습니다.');
                return false;
            }
            
            $('input[name=promGiftAmount]').each(function(){
                totSelAmount += parseInt($(this).val());
            });
            
            prev = parseInt(prev);
            curVal = parseInt(curVal);
            
            // 최대 선택 가능 수량
            if(totSelAmount > getItemCnt && prev < curVal){
                $(this).val(prev);
                alert('선택하실 수 있는 추가 상품은 최대 '+getItemCnt+'개 입니다.');
                return false;
                
                totSelAmount = 0;
                $('input[name=promGiftAmount]').each(function(){
                    totSelAmount += parseInt($(this).val());
                });
            }

            // 재고 체크
            var ordPsbQty = parseInt( $(this).parents("li[name=selPopInfo]").attr("stockqty") );
            var getitemautoaddyn = $("#selGet_"+promNo).children("div").attr("getitemautoaddyn");
            var promKnd  = $(this).parents().parents("li").attr("promkndcd");
            var promKndNm  = $(this).parents().parents("li").attr("promKndNm");
            var goodsNm  = $(this).parents().parents("li").attr("goodsnm").replace(' ','').substr(0,5)+"~";
            var goodsNo  = $(this).parents().parents("li").attr("goodsno");
            var itemNo  = $(this).parents().parents("li").attr("itemno");
            var realStockQty = $(this).parents().parents("li").attr("realstockqty");
            var cartOrdQty =  prev;
            var parentsCnt = 0;
            if($("tr[goodsno='"+goodsNo+"'][itemno='"+itemNo+"']").find("input[name='s_amount']").attr("ordqty") != undefined){
                parentsCnt = $("tr[goodsno='"+goodsNo+"'][itemno='"+itemNo+"']").find("input[name='s_amount']").attr("ordqty");
            }

            if(parentsCnt> 0){
                cartOrdQty = parseInt(cartOrdQty) + parseInt(parentsCnt);
            }
            var maxOrdQty = 999;
            
            if(realStockQty < maxOrdQty){
                maxOrdQty = realStockQty;
            }
            if(ordPsbQty >= 1000){
                ordPsbQty = 999;
            }
            
            var promNm = promKnd == 'P203' ? 'GIFT' : promKndNm;
            
            if(ordPsbQty < curVal){
                if(getitemautoaddyn == "N"){
                    if(promKnd == 'P203'){
                        alert("["+promNm+"]"+" 추가상품 '"+goodsNm+"'이 장바구니에 담긴 수량 포함하여 "+maxOrdQty+"개 남았습니다. 장바구니에 담으신 수량을 제외하고 "+ordPsbQty+"개 선택 가능합니다.");
                        $(this).val(prev);
                        return false;
                    }else if(promKnd == 'P202'){
                        if(promNm == '1+1'){
                            if(cartOrdQty == ordPsbQty){
                                alert("["+promNm+"]"+" 추가상품 '"+goodsNm+"'이 장바구니에 담긴 수량 포함하여 총 "+ordPsbQty+"개 구매가 가능합니다. 이미 장바구니에 100개가 담겨있으니 장바구니를 확인해주세요.");
                                $(this).val(prev);
                                return false;
                            }else if(parentsCnt != 0){
                                alert("재고가 "+realStockQty+"개 남았습니다. 이미 장바구니에 담으신 "+parentsCnt+"개를 제외하고 "+ordPsbQty+"개까지만 구매할 수 있습니다.");
                                $(this).val(prev);
                                return false;
                            }
                        }else if(promNm == '2+1'){
                            alert("["+promNm+"]"+" 추가상품 '"+goodsNm+"'이 장바구니에 담긴 수량 포함하여 "+realStockQty+"개 남았습니다. 장바구니에 담으신 수량을 제외하고 "+ordPsbQty+"개 선택 가능합니다.");
                            $(this).val(prev);
                            return false;
                        }
                    }
                }
                alert("재고가 " + ordPsbQty + "개 남았습니다. 구매를 서둘러 주세요!");
                $(this).val(prev);
                return false;
            }
            
            if(this.value >= 1)
                $(this).parents("li").addClass("on");
            else
                $(this).parents("li").removeClass("on");
            
            $("p.choiceTxt span i").text(totSelAmount);      // 기 선택한 추가상품 수량
            mcart.popLayer.promGift.focusOutFlag = false;
        });
        
        // 취소 버튼 클릭 이벤트
        $("button[name=btnCancel], a.btnClose").click(function() {
            if(mcart.popLayer.promGift.focusOutFlag){
                mcart.popLayer.promGift.focusOutFlag = false;
                return false;
            }
            common.popLayerClose('CARTLAYER');
        });
        
        // GET상품 레이어 선택완료 버튼 클릭 이벤트
        $("button[name=btnComplete]").click(function() {
            if(mcart.popLayer.promGift.focusOutFlag){
                mcart.popLayer.promGift.focusOutFlag = false;
                return false;
            }
            
           var cartSelGetInfoList = new Array();
           var sumSelGift = 0;  //GET상품 선택 레이어 내에서의 선택한 상품의 총수량
           if(getItemCnt > 0){
               $('input[name="promGiftAmount"]').each(function(){
                   sumSelGift += parseInt(this.value);
               });
               if(sumSelGift > getItemCnt){
                   alert('선택하실 수 있는 추가 상품은 최대 '+getItemCnt+'개 입니다.');
                   return false;
               }else if(sumSelGift < getItemCnt){
                   alert('추가 상품을 '+(getItemCnt - sumSelGift)+'개 더 선택해주시거나, 본 상품의 수량을 변경해주세요.');
                   return false;
               }else{
                   var thisObj = $("#selGet_"+selTargetPromNo);
                   var promNo = thisObj.attr("promNo");
                   var promKndCd = thisObj.attr("promKndCd");                               // 프로모션 종류(P201,P202,P203)   
                   var buyCondStrtQtyAmt = parseInt(thisObj.attr("buyCondStrtQtyAmt"));     // n+1의 n
                   var drtPurYn = $("#selGet_"+selTargetPromNo).attr("drtPurYn");           // 바로구매 여부
                   var newSelGetHtml = "";          //각각의 GET군 상품군 html변수
                   var sumSelGetHtml = "";          //newSelGetHtml의 누적HTML SUM
                   
                   var validSuc = false;           //화면이 정상적으로 만들어 졌는지 체크
                   var itemCnt = 0;                 //GET상품 레이어의 선택된 상품의 수량
                   var samePrdSumOrdQty = 0;        //goodsNo,itemNo가 같은 BUY군GET군 모든상품들의 수량 sum
                   
                   //GET군 저장시 프로모션에 해당하는 BUY군 상품정보를 리스트의 마지막상품군으로 저장.
                   var prstGoodsNo = thisObj.parents('li').eq(thisObj.parents('li').length-1).attr('goodsNo'); 
                   var prstItemNo = thisObj.parents('li').eq(thisObj.parents('li').length-1).attr('itemNo'); 
                   var quickYn = thisObj.parents('li').eq(thisObj.parents('li').length-1).attr('quickYn');
                   var strNo = thisObj.parents('li').eq(thisObj.parents('li').length-1).attr('strNo');
                   
                   var promCondNm = buyCondStrtQtyAmt + "+1";
                   if(promKndCd == "P203"){
                       promCondNm = "GIFT";
                   }
                   
                   //----------- #####################3  화면 html make 시작 ###############################
                   
                   //GET군 레이어의 상품 영역
                   $('li[name="selPopInfo"]').each(function(){
                       var getObj = $(this);
                       samePrdSumOrdQty = 0;
                       
                       //선택된 상품
                       if($(this).attr('class') == "on"){
                           //프로모션상품인지 체크
                           if(promKndCd == "P201" || promKndCd == "P202" || promKndCd == "P203"){    
                               //수량보고 for문돌려야됨.
                               itemCnt = parseInt( $(this).find('[name=promGiftAmount]').val() ); //수량
                               
                               //BUY군 상품 리스트중 같은 상품인것의 선택수량을 가져와 buy상품군의 합만 samePrdSumOrdQty변수에 담아준다. regCartJson 재고체크시사용됨.
                               $('li[cno]').each(function(){
                                   var buyObj = $(this);
                                   if((buyObj.attr('goodsNo') == getObj.attr('goodsNo')) && (buyObj.attr('itemNo') == getObj.attr('itemNo'))){
                                       samePrdSumOrdQty += parseInt(buyObj.find('[name=s_amount]').val());
                                   }
                               });
                          
                               //장바구니 화면내의 GET군 영역의 상품정보 셋팅
                               newSelGetHtml = "";
                               newSelGetHtml +=   "  <div class='bottom' id='"+$(this).attr('goodsNo')+$(this).attr('itemNo')+"'>";
                               newSelGetHtml +=   "     <div class='thumb'>";
                               newSelGetHtml +=   "          <img data-original='" + $(this).find("img").attr("data-original") + "' class='seq-lazyload' alt='상품이미지' onerror='common.errorImg(this);' src='" + $(this).find("img").attr("src") + "'>";
                               newSelGetHtml +=   "     </div>";
                               newSelGetHtml += "       <div class='box'>";
                               newSelGetHtml += "           <div class='tit' dispCatNo='"+$(this).attr('itemNo')+"' goodsNo='"+$(this).attr('goodsNo')+"' itemNo='"+$(this).attr('itemNo')+"' promNo='"+$(this).attr('oriPromNo')+"' ordQty='"+itemCnt+"' lgcGoodsNo='" + $(this).attr('lgcGoodsNo') + "' stockQty='"+$(this).attr('realStockQty')+"'>";
                               newSelGetHtml += "               "+$(this).attr('goodsNm');
                               newSelGetHtml += "           </div>";

                               var itemNm = $(this).attr('itemNm');
                               if(itemNm != null && itemNm != "")
                                   newSelGetHtml += "      <p class='option'>옵션<span class='num'>"+itemNm+"</span></p>";
                               
                               newSelGetHtml += "           <p class='prd_cnt'>수량<span class='num'>"+itemCnt+"</span>개</p>";
                               newSelGetHtml += "       </div>";
                               newSelGetHtml += "   </div>";
                               
                               sumSelGetHtml += newSelGetHtml;
                           
                               //DB저장용 변수 셋팅 
                               var cartGetItem = {};
                               cartGetItem.goodsNo   = $(this).attr('goodsNo');
                               cartGetItem.itemNo     = $(this).attr('itemNo');
                               cartGetItem.ordQty     = parseInt( $(this).find('input[name=promGiftAmount]').val() );
                               cartGetItem.rsvGoodsYn = "N"; // 예약상품여부
                               cartGetItem.dispCatNo  = "";  // 전시카테고리 번호
                               cartGetItem.promKndCd  = promKndCd;
                               
                               cartGetItem.crssPrstNo = $(this).attr('oriPromNo');  //프로모션번호
                               
                               cartGetItem.drtPurYn = drtPurYn; //바로구매여부
                               cartGetItem.prstGoodsNo = prstGoodsNo; //타켓buy군의 상품번호
                               cartGetItem.prstItemNo = prstItemNo; //타켓buy군의 아이템번호
                               cartGetItem.buyCondStrtQtyAmt = buyCondStrtQtyAmt;
                               cartGetItem.quickYn = quickYn;
                               cartGetItem.strNo = strNo;
                               
                               if(samePrdSumOrdQty > 0){
                                   cartGetItem.samePrdSumOrdQty = samePrdSumOrdQty; //상품번호 아이템번호가 같은상품의 수량을 합한값.
                               }
                               
                               // get상품 자동증가 여부
                               var promNo = getObj.attr("oriPromNo");
                               var getItemAutoAddYn = $("div.evenPrdBox[promNo=" + promNo + "]").attr("getItemAutoAddYn");
                               if(getItemAutoAddYn != undefined){
                                   cartGetItem.getItemAutoAddYn = getItemAutoAddYn;     
                               }
                                 
                               cartSelGetInfoList.push(cartGetItem);
                               
                               validSuc = true;
                           }
                       }
                   });
                   //----------- #####################3  화면 html make 끝 ###############################
                   
                   if(validSuc){
                       //성공하면 아래처리
                       var drtPurYn = "N";
                       var saveTp = "";
                       var listYn = "";
                       var cartYn = "Y"
                       var partYn = $("#partYn").val();

                       if(partYn == "Y"){
                           drtPurYn = "Y";
                           saveTp = "";
                           listYn = "S";
                       }
                       
                       //수량 수정function 호출
                       var resultData = common.cart.regCart(cartSelGetInfoList, drtPurYn, saveTp, listYn, '', cartYn);
                       
                       //닫기
                       if(resultData.result)
                           common.popLayerClose('CARTLAYER');
                       
                       //성공시에만 html 그려줌.
                       if(resultData != ""){
                           if(resultData.result){
                               //실재고수량 장바구니화면에서 갱신
                               if(resultData.rStockQtyInfo != ''){

                                   var rCartNo = "";
                                   var rGoodsNo  = "";
                                   var rItemNo   = "";
                                   var rStockQty = "";
                                   
                                   resultData.rStockQtyInfo.forEach(function(v,i){
                                       rGoodsNo  = v.split('@=@')[0];
                                       rItemNo   = v.split('@=@')[1];
                                       rStockQty = v.split('@=@')[2];
                                       
                                       //BUY상품군 찾기
                                       $('li[pno='+selTargetPromNo+']').each(function(){
                                           var buyObj2 = $(this);
                                           if((buyObj2.attr('goodsNo') == rGoodsNo) && (buyObj2.attr('itemNo') == rItemNo)){
                                               buyObj2.find('input[type=checkbox]').attr('stockqty',rStockQty);
                                           }
                                       });
                                       
                                       //GET상품군찾기
                                       $("#p202InnerHtml_"+selTargetPromNo).find('div.tit').each(function(){
                                           var getObj2 = $(this);
                                           if((getObj2.attr('goodsNo') == rGoodsNo) && (getObj2.attr('itemNo') == rItemNo)){
                                               getObj2.attr('stockqty',rStockQty);
                                           }
                                       });
                                       
                                   });
                                   
                                   $("#p202InnerHtml_"+selTargetPromNo).html(sumSelGetHtml);

                                   //GET상품군에 장바구니번호 추가
                                   resultData.rStockQtyInfo.forEach(function(v,i){
                                       rCartNo   = resultData.rCartNo.split(',')[i];
                                       rGoodsNo  = v.split('@=@')[0];
                                       rItemNo   = v.split('@=@')[1];
                                       
                                       //GET상품군찾기
                                       $("#p202InnerHtml_"+selTargetPromNo).find('div.tit').each(function(){
                                           var getObj2 = $(this);
                                           if((getObj2.attr('goodsNo') == rGoodsNo) && (getObj2.attr('itemNo') == rItemNo)){
                                               getObj2.attr('cartNo',rCartNo);
                                           }
                                       });
                                   });
                                   
                                   //버튼 바꾸기
                                   $("#btnSelGetItem_"+selTargetPromNo).text("다시선택");
                                   $("#btnSelGetItem_"+selTargetPromNo).attr("class","btnGrayH30");
                                   
                                   //프로모션 GET상품 선택한 경우  BUY군 프로모션의 체크박스를 선택해준다.
                                   //프로모션상품의 경우 한개의 BUY상품군만 구매가능하도록 로직 수정으로 인한 소스
                                   //프로모션상품 GET상품 선택전이고 BUY2개이상의 경우 BUY군 한개만 사기위해 체크하고 GET상품을 선택하는경우에 해당하는 CASE
                                   $("#btnSelGetItem_"+selTargetPromNo).parents('li').parents('ul').find('input[type=checkbox]').each(function(a,b){
                                       if($(this).parents('li').attr('oriPno') == selTargetPromNo){
                                           if($('input[name=s_checkbox1]').eq(a).parents("li").attr('soldOutYn') == "N"){
                                               if($('#p202InnerHtml_'+selTargetPromNo).find('div.tit').length > 0){
                                                   $("input[name=s_checkbox1]").eq(a).prop('checked',true);
                                               }
                                           }
                                       }
                                   });
                               }
                           }
                       }
                       sumSelGetHtml = "";
                   }else{
                       //정상적으로 화면 html make 되지 않았을때 처리.
                       alert("죄송합니다.\n처리중 오류가 발생하였습니다.\n고객센터(1522-0882)로 문의 바랍니다.");
                       return false;
                   }
               }
           }
        });
    },
    /** 행사상품 팝업 레이어 오픈 **/
    popLayerOpen : function(goodsNo,itemNo,promNo){
        mcart.popLayer.promGift.http.openPromGiftPop.submit(goodsNo,itemNo,promNo);
    }
};

$.namespace('mcart.base.http');
mcart.base.http = {
 
    /*
     * 수량 수정 요청
     */
    modQty : {
        jsonParam : false,
        /**
         *   파라메터의 validation 처리
         */
        validation : function(vCartNo, vSamePromCartNos, vQty, vPromNo, vOriPromNo, vPromKndCd,vBuyCondStrtQtyAmt,vGoodsNo,vItemNo, vRsvSaleYn, vDrtPurYn) {
            var isValid = true;
            if($("li[cno="+vCartNo+"]").legnth==0) {
                var msg = "장바구니 정보가 잘못 되었습니다.";
                alert(msg);
                this.jsonParam = false;
                isValid = false;
            }
            
            if(isValid) {
                this.jsonParam =   {
                        cartNo : vCartNo
                    ,   cartNoList : vSamePromCartNos
                    ,   ordQty : vQty
                    ,   buyPromNo : vOriPromNo
                    ,   promKndCd : vPromKndCd
                    ,   buyCondStrtQtyAmt : vBuyCondStrtQtyAmt
                    ,   goodsNo   : vGoodsNo
                    ,   itemNo    : vItemNo
                    ,   rsvSaleYn : vRsvSaleYn
                    ,   drtPurYn : vDrtPurYn
                    };
            }
            return isValid;
        },
        submit : function(vCartNo, vSamePromCartNos, vQty, vPromNo, vOriPromNo, vPromKndCd,vBuyCondStrtQtyAmt, vGoodsNo, vItemNo, vRsvSaleYn, vDrtPurYn) {
            var url = _baseUrl + "cart/modOptionJson.do";
            var retval = false;
            var callback = function(jsonObj) {
                retval = jsonObj.result;
                
                if(!jsonObj.result) {
                    if(jsonObj.jsMessage !== undefined) {
                        alert(jsonObj.jsMessage);
                    } 
                }else{
                    if(vPromKndCd != null){
                        addAlertTxt = "\n구매수량 변경에 따른 추가 상품을 다시 확인해주세요.";
                    }else{
                        addAlertTxt = "";
                    }
                    
                    //--------------- 실재고수량 장바구니화면에서 갱신 시작
                    if(jsonObj.rStockQtyInfo != ''){
                        var rGoodsNo  = "";
                        var rItemNo   = "";
                        var rStockQty = "";
                        
                        jsonObj.rStockQtyInfo.forEach(function(v,i){
                            rGoodsNo  = v.split('@=@')[0];
                            rItemNo   = v.split('@=@')[1];
                            rStockQty = parseInt( v.split('@=@')[2] );
                            
                            //BUY상품군 찾기
                            $('li[pno='+vPromNo+']').each(function(){
                                var buyObj2 = $(this);
                                if((buyObj2.attr('goodsNo') == rGoodsNo) && (buyObj2.attr('itemNo') == rItemNo)){
                                    buyObj2.find('input[type=checkbox]').attr('stockqty',rStockQty);
                                    
                                    var saleCpnDcPrc = parseInt(buyObj2.find('input[name=saleCpnDcPrc]').val());
                                    var spanOrgPrice = (parseInt(buyObj2.find('input[name=s_org_sale_prc]').val()) * parseInt(buyObj2.find('[name=s_amount]').val())).toMoney();
                                    buyObj2.find('span.org_price').find('span').text(spanOrgPrice);
                                    if(saleCpnDcPrc > 0){
                                        buyObj2.find('span.cur_price').find('span').text((saleCpnDcPrc * parseInt(buyObj2.find('[name=s_amount]').val())).toMoney());
                                    }else{
                                        var spanCurPrice = (parseInt(buyObj2.find('input[name=s_sale_prc]').val()) * parseInt(buyObj2.find('[name=s_amount]').val())).toMoney();
                                        buyObj2.find('span.cur_price').find('span').text(spanCurPrice);
                                    }
                                    
                                }
                            });
                            
                            //GET상품군찾기
                            $("#p202InnerHtml_"+vPromNo).find('div.tit').each(function(){
                                var getObj2 = $(this);
                                if((getObj2.attr('goodsNo') == rGoodsNo) && (getObj2.attr('itemNo') == rItemNo)){
                                    getObj2.attr('stockqty',rStockQty);
                                }
                            });
                            
                        });
                    }
                    //--------------- 실재고수량 장바구니화면에서 갱신 끝
                    
                    //수량수정 성공시 수량에 맞게
                    //1이면 올리브영배송상품, 2이면 업체배송상품
                    var prdTp = $('li[cno='+vCartNo+']').find('[name=s_amount]').attr('prdTp');
                    //상품그룹내에 순번 
                    var prdCnt = $('li[cno='+vCartNo+']').find('[name=s_amount]').attr('prdCnt');
                    
                    //프로모션상품이 아닌경우 -1나옴 에러발생.
                    if(prdCnt < 0){
                        prdCnt = 0;
                    }
                    
                    if(prdTp == '1'){
                        cartTenInfoList[prdCnt].ordQty = $('li[cno='+vCartNo+']').find('[name=s_amount]').val();
                        $('input[name=s_checkbox1]').eq(prdCnt).attr('ordQty',$('li[cno='+vCartNo+']').find('[name=s_amount]').val());
                    }else if(prdTp == '2'){
                        cartFourtyInfoList[prdCnt].ordQty = $('li[cno='+vCartNo+']').find('[name=s_amount]').val();
                        $('input[name=s_checkbox2]').eq(prdCnt).attr('ordQty',$('li[cno='+vCartNo+']').find('[name=s_amount]').val());
                    }
                    mcart.base.computAmt();
                    
                    //10이하이면 셀렉트 콤보로 바꿈.
                    var selObj = $('li[cno='+vCartNo+']');
                    var selQty =  parseInt(selObj.find('[name=s_amount]').val());           //수량
                    if(parseInt(selObj.find('[name=s_amount]').val()) <= 10){
                        
                        var prdTp = selObj.find('[name=s_amount]').attr('prdTp');               //상품종류 1:올리브영, 2:제휴업체
                        var prdCnt = selObj.find('[name=s_amount]').attr('prdCnt');             //화면내의 상품 순번 1,2,3,4,5,...
                        var ordPsbMinQty = selObj.find('[name=s_amount]').attr('ordPsbMinQty'); //상품의 최소구매수량
                        var ordPsbMaxQty = selObj.find('[name=s_amount]').attr('ordPsbMaxQty'); //상품의 최대구매수량
                        var qtyAddUnit = selObj.find('[name=s_amount]').attr('qtyAddUnit');     //상품의 단위증가수량
                        
                        var comboHtml = "";
                        comboHtml = '<select class="amount" name="s_amount" prdTp="'+prdTp+'" prdCnt="'+prdCnt+'" ordPsbMinQty="'+ordPsbMinQty+'" ordPsbMaxQty="'+ordPsbMaxQty+'" qtyAddUnit="'+qtyAddUnit+'" ordQty="'+selQty+'" title="상품 수량 선택" onchange="fn_comboChange(this)">';
                        
                        var forEndCnt = 0;
                        if(parseInt(ordPsbMaxQty) > 10){
                            forEndCnt = 10;
                        }else{
                            forEndCnt = parseInt(ordPsbMaxQty);
                        }
                        
                        for(i=parseInt(ordPsbMinQty); i <= parseInt(forEndCnt); i += parseInt(qtyAddUnit)){
                            
                            if(i == selQty){
                                comboHtml += '<option value="'+i+'" selected>'+i+'</option>';
                            }else{
                                comboHtml += '<option value="'+i+'">'+i+'</option>';
                            }
                        }
                        comboHtml += '<option value="10+">10+</option>';
                        comboHtml += '</select>';
                        setTimeout(function(){
                            // 일부 iphone 단말기에서 오류가 발생하는 현상이 있음
                            // 0.1초 delay로 처리 함.
//                            selObj.find('div .prd_cnt').find('#comboArea').html('');
                            selObj.find('div .prd_cnt').find('#comboArea').html(comboHtml);
                            selObj.find('button[name=btnQtyMod]').css('display','none');
                            selObj.find('div.price_info').find('div').removeClass('none');
                        },100);
                        
                    }else{
                        selObj.find('[name=s_amount]').attr('ordQty',selQty);
                    }
                    
                    // buy/get상품 동일인 경우 추가되는 get상품 자동선택 <시작> 
                    var promObj = $("div.evenPrdBox_ty02[promNo=" + vOriPromNo + "]");
                    var getItemAutoAddYn = promObj.attr("getItemAutoAddYn");
                    
                    if(getItemAutoAddYn != "Y")
                        return false;
                    
                    var getGoodsNo = promObj.attr("getItemGoodsNo");
                    var getItemNo = promObj.attr("getItemItemNo");
                    
                    // 같은 프로모션의 다른 buy상품 수량 더하기
                    var samePromBuyOrdQty = 0;
                    $("li[cno][pno=" + vOriPromNo + "] input[type=checkbox]:checked").each(function(){
                        samePromBuyOrdQty += parseInt( $(this).attr("ordQty") );
                    });
                    
                    var getItemOrdQty = parseInt( (samePromBuyOrdQty) / vBuyCondStrtQtyAmt );
                    
                    if(isNaN(getItemOrdQty) || getItemOrdQty <= 0)
                        return false;
                    
                    if(vPromKndCd == "P201" && rStockQty < vQty + getItemOrdQty)
                        return false;
                    
                    var samePrdSumOrdQty = null;
                    
                    // buy 상품 중 같은 상품의 합
                    $("ul.basket_list li[goodsNo=" + getGoodsNo + "][itemNo=" + getItemNo + "]").each(function(){
                        var ordQty = parseInt( $(this).find("input[type=checkbox]").attr("ordQty") );
                        samePrdSumOrdQty += ordQty;
                    });
                    
                    var cartGetItem = {
                        goodsNo : getGoodsNo,
                        itemNo : getItemNo,
                        ordQty : getItemOrdQty,
                        rsvGoodsYn : vRsvSaleYn, // 예약상품여부
                        dispCatNo : "",  // 전시카테고리 번호
                        promKndCd : vPromKndCd,
                        crssPrstNo : vOriPromNo,  //프로모션번호
                        drtPurYn : vDrtPurYn, //바로구매여부
                        prstGoodsNo : vGoodsNo, //타켓buy군의 상품번호
                        prstItemNo : vItemNo, //타켓buy군의 아이템번호
                        buyCondStrtQtyAmt : vBuyCondStrtQtyAmt,
                        samePrdSumOrdQty : samePrdSumOrdQty,  //상품번호 아이템 번호가 같은 상품의 수량을 합한 값
                        getItemAutoAddYn : getItemAutoAddYn     // get상품 자동증가 여부
                    }
                    
                    var cartSelGetInfoList = [];
                    cartSelGetInfoList.push(cartGetItem);
                    
                    var resultData = common.cart.regCart(cartSelGetInfoList, "N", "", "A");
                    
                    // 선택한 get상품 수량 변경
                    if(resultData != "" && resultData.result){
                        if(resultData.rStockQtyInfo != ''){
                            var stockqty = resultData.rStockQtyInfo[0].split("@=@")[2];
                            var imgSrc = _goodsImgUploadUrl + thumbImgPath + resultData.rStockQtyInfo[0].split("@=@")[3];
                            var lgcGoodsNo = resultData.rStockQtyInfo[0].split("@=@")[4];
                            var getGoodsNm = promObj.attr("getItemGoodsNm");
                            var getItemNm = promObj.attr("getItemItemNm");
                            var promCond = (vPromKndCd == "P203") ? "GIFT" : (vBuyCondStrtQtyAmt + "+1");
                            
                            var selGetItemHtml = "";
                            selGetItemHtml += " <div class='top'>";
                            selGetItemHtml += "     <div class='tit' id='" + getGoodsNo + getItemNo + "' cartno='" + resultData.rCartNo + "' dispcatno='' goodsno='" + getGoodsNo + "' itemno='" + getItemNo + "' promno='" + vOriPromNo + "' ordqty='" + getItemOrdQty + "' rsvsaleyn='" + vRsvSaleYn + "' stockqty='" + stockqty + "'>";
                            selGetItemHtml += "         <strong><span>" + promCond + " 행사</span> 상품입니다.</strong>";
                            selGetItemHtml += "     </div>";
                            selGetItemHtml += "     <button type='button' name='btnGetPromItem' class='btn' id='btnSelGetItem_" + vOriPromNo + "' promno='" + vOriPromNo + "' cartno='" + resultData.rCartNo + "' goodsno='" + vGoodsNo + "' itemno='" + vItemNo + "'>다시선택</button>";
                            selGetItemHtml += " </div>";
                            selGetItemHtml += " <div id='p202InnerHtml_" + vOriPromNo + "' promkndcd='" + vPromKndCd + "' buycondstrtqtyamt='" + vBuyCondStrtQtyAmt + "'>";
                            selGetItemHtml += "     <div class='bottom' id='" + getGoodsNo + getItemNo + "'>";
                            selGetItemHtml += "         <div class='thumb'>";
                            selGetItemHtml += "             <img data-original='" + imgSrc + "' class='seq-lazyload' alt='상품이미지' onerror='common.errorImg(this);'>";
                            selGetItemHtml += "         </div>";
                            selGetItemHtml += "         <div class='box'>";
                            selGetItemHtml += "             <div class='tit' cartno='" + resultData.rCartNo + "' dispcatno='' goodsno='" + getGoodsNo + "' itemno='" + getItemNo + "' promno='" + vOriPromNo + "' ordqty='" + getItemOrdQty + "' rsvsaleyn='" + vRsvSaleYn + "' lgcGoodsNo='" + lgcGoodsNo + "' stockqty='" + stockqty + "'>";
                            selGetItemHtml += "                 " + getGoodsNm; 
                            selGetItemHtml += "             </div>";
                            
                            if(getItemNm != undefined && getItemNm.trim() != "")
                                selGetItemHtml += "             <p class='option'>옵션<span class='num'>" + getItemNm + "}</span></p>";
                            
                            selGetItemHtml += "             <p class='prd_cnt'>수량<span class='num'>" + getItemOrdQty + "}</span>개</p>";
                            selGetItemHtml += "         </div>";
                            selGetItemHtml += "     </div>";
                            selGetItemHtml += " </div>";
                            
                            promObj.html(selGetItemHtml);
                            
                            // 이미지 로드
                            mcart.base.setLazyLoad('seq');
                            
                            // GET군 선택 버튼 클릭 이벤트
                            promObj.find("button[name=btnGetPromItem]").click(function() {
                                mcart.base.btnGetPromItemClick( $(this) );
                            });
                        }
                    } else {
                        //버튼 바꾸기
                        $("#btnSelGetItem_" + vOriPromNo).text("선택");
                        $("#btnSelGetItem_" + vOriPromNo).attr("class","btnSmall fullOrange");
                    }
                    // buy/get상품 동일인 경우 추가되는 get상품 자동선택 <끝>
                }
            };
            var isValid = this.validation(vCartNo, vSamePromCartNos, vQty, vPromNo, vOriPromNo, vPromKndCd,vBuyCondStrtQtyAmt, vGoodsNo, vItemNo, vRsvSaleYn, vDrtPurYn);
            
            if (isValid) {
                //ajax 배열값 던지기 위해 수정 traditional : true, 옵션 추가 배열 직렬화 옵션
                $.ajax({
                    type: "POST",
                    url: url,
                    data: this.jsonParam,
                    dataType : 'json',
                    async: false,
                    cache: false,
                    traditional : true,
                    success: function(data) {
                        callback(data);
                    },
                    error: function(data) {
                        callback(data);
                    }
                });
            }
            
            return retval;
        }
    },
    // === mod ===
    
    /*
     * 장바구니 체크박스 상태 변경
     */
    chkYn : {
        jsonParam : false,
        /**
         *   파라메터의 validation 처리
         */
        validation : function(vCartNos, vChkYn) {
            var isValid = true;
            
            if(isValid) {
                this.jsonParam =   {
                        cartNo : vCartNos
                    ,   cartChkYn : vChkYn
                    };
            }
            return isValid;
        },
        submit : function(vCartNos, vChkYn) {
            var url = _baseUrl + "cart/modCheckBoxJson.do";
            var retval = false;
            var callback = function(jsonObj) {
                retval = jsonObj.result;
                
                if(!jsonObj.result) {
                    if(jsonObj.jsMessage !== undefined) {
                        alert(jsonObj.jsMessage);
                    } 
                }else{
                }
            };
            var isValid = this.validation(vCartNos, vChkYn);
            
            if (isValid) {
                //ajax 배열값 던지기 위해 수정 traditional : true, 옵션 추가 배열 직렬화 옵션
                $.ajax({
                    type: "POST",
                    url: url,
                    data: this.jsonParam,
                    dataType : 'json',
                    async: false,
                    cache: false,
                    traditional : true,
                    success: function(data) {
                        callback(data);
                    },
                    error: function(data) {
                        callback(data);
                    }
                });
            }
            
            return retval;
        }
    },
    // === mod ===
    
    /*
     *  삭제 요청
     */
    delItem : {
        jsonParam : undefined,
        /**
         * 파라메터의 Validation Check
         */
        validation : function(delTp) {
            
            var isValid = true;
            
            var vCartNo = [];               //카트번호
            var vPromNo = [];               //프로모션번호
            var vPromKndCd = [];            //프로모션종류
            var vDrtPurYn = [];             //바로구매여부
            var vBuyCondStrtQtyAmt = [];    //n+1의 n에 해당
            var vGoodsNo = [];              //상품번호
            var vItemNo = [];               //아이템번호
            
            //선택삭제인경우
            if(delTp == 'part'){
                //올리브영
                $('input[name=s_checkbox1]').each(function(x,y){
                    if($('input[name=s_checkbox1]').eq(x).prop('checked') == true){
                        vCartNo.push($('input[name=s_checkbox1]').eq(x).parents("li").attr('cno'));
                        vPromNo.push($('input[name=s_checkbox1]').eq(x).parents("li").attr('oriPno'));
                        vPromKndCd.push($('input[name=s_checkbox1]').eq(x).parents("li").attr('promKndCd'));
                        vDrtPurYn.push($('input[name=s_checkbox1]').eq(x).parents("li").attr('drtPurYn'));
                        vBuyCondStrtQtyAmt.push($('input[name=s_checkbox1]').eq(x).parents("li").attr('buyCondStrtQtyAmt'));
                        vGoodsNo.push($('input[name=s_checkbox1]').eq(x).parents("li").attr('goodsNo'));
                        vItemNo.push($('input[name=s_checkbox1]').eq(x).parents("li").attr('itemNo'));
                    }
                });
                       
                //제휴업체
                $('input[name=s_checkbox2]').each(function(x,y){
                    if($('input[name=s_checkbox2]').eq(x).prop('checked') == true){
                        vCartNo.push($('input[name=s_checkbox2]').eq(x).parents("li").attr('cno'));
                        vPromNo.push($('input[name=s_checkbox2]').eq(x).parents("li").attr('oriPno'));
                        vPromKndCd.push($('input[name=s_checkbox2]').eq(x).parents("li").attr('promKndCd'));
                        vDrtPurYn.push($('input[name=s_checkbox2]').eq(x).parents("li").attr('drtPurYn'));
                        vBuyCondStrtQtyAmt.push($('input[name=s_checkbox2]').eq(x).parents("li").attr('buyCondStrtQtyAmt'));
                        vGoodsNo.push($('input[name=s_checkbox2]').eq(x).parents("li").attr('goodsNo'));
                        vItemNo.push($('input[name=s_checkbox2]').eq(x).parents("li").attr('itemNo'));
                    }
                });
                
            //각각의 상품에 걸려있는 삭제버튼    
            }else{
                var evtTarget = event.target ? event.target : window.event.srcElement;
                vCartNo.push($(evtTarget).parents("li").attr("cno"));
                vPromNo.push($(evtTarget).parents("li").attr("oriPno"));
                vPromKndCd.push($(evtTarget).parents("li").attr("promKndCd"));
                vDrtPurYn.push($(evtTarget).parents("li").attr("drtPurYn"));
                vBuyCondStrtQtyAmt.push($(evtTarget).parents("li").attr("buyCondStrtQtyAmt"));
                vGoodsNo.push($(evtTarget).parents("li").attr("goodsNo"));
                vItemNo.push($(evtTarget).parents("li").attr("itemNo"));
            }

            
            if(vCartNo.length == 0) {
                
                var msg = "선택하신 상품 정보를 찾을 수 없습니다.";
                
                if(delTp == 'soldOut'){
                    msg = "일시품절 및 판매종료 된 상품이 없습니다.";
                }
                
                alert(msg);

                this.jsonParam = false;
                isValid = false;
                
            } 

            
            if(isValid) {
                this.jsonParam =   {
                        cartNo              : vCartNo.toString(),
                        buyPromNo           : vPromNo.toString(),
                        promKndCd           : vPromKndCd.toString(),
                        drtPurYn            : vDrtPurYn.toString(),
                        buyCondStrtQtyAmt   : vBuyCondStrtQtyAmt.toString(),
                        goodsNo             : vGoodsNo.toString(),
                        itemNo              : vItemNo.toString()
                    };
            }

            return isValid; 
        },
        
        /*
         * 요청을 보냄
         * cartNo : 삭제할 장바구니 번호
         */
        submit : function(delTp) {
            
            var url = _baseUrl + "cart/delCartJson.do";
            
            var callback = function() {
                location.reload();
            };
            
            if(delTp == 'part'){
                var isConfirm = confirm("선택된 상품을 삭제하시겠습니까?");
                
            }else if(delTp == 'soldOut'){
                var isConfirm = confirm("품절 및 판매종료된 상품을 삭제하시겠습니까?");
            }else{
                var isConfirm = confirm("해당 상품을 삭제 하시겠습니까?");
            }
            
            if(isConfirm){
                var isValid = this.validation(delTp);
                
                if (isValid) {
                    _ajax.sendJSONRequest("POST", url, this.jsonParam, callback, false);
                }
            }
            
            // end if
            
        }
        // submit
        
        
    },
    /*
     * 선택주문,전체주문버튼 마지막 프로세스 (사은품선택 요청을 보냄)
     */
    onClickSubmit : function(btnTp) {
        
        // [START 오늘드림 옵션상품 개선:jwkim]
        // 장바구니에서 일반배송 탭인지 오늘드림 탭인지 구분
        var formQuickYn = $("#quickYn").val();
        var tdsReturn = false;
        
        // 주문서 생성시 오늘드림 장바구니인 경우 해상 선택혹은 모든상품의 매장재고를 실시간으로 조회
        if(formQuickYn == "Y"){
            // 매장번호
        	var strNo = $("#orderStrNo").val();
            // 매장seq
            var mbrDlvpSeq = $("#dlvpSeqSelect").val();
            var url = _baseUrl + "goods/getTodayDeliveryStrStockAjax.do";
            
            var afGoodsNo = "";
            var bfGoodsNo = "";
            
            $('input[name=s_checkbox1]').each(function(a,b){
                
                var buyThisObj = null;
                var promNo = null;
                var quickYn = null;
                var orderQtyBuy1 = 0;
                var promNo = null;
                
                buyThisObj = $(this);
                
                afGoodsNo = buyThisObj.parents('li').find('input[name=s_goods_no]').val();
                
                if(btnTp == "all"){
                    bfGoodsNo = afGoodsNo;
                    passCheck = true;
                }else{
                    if($('input[name=s_checkbox1]').eq(a).prop('checked') == true){
                        bfGoodsNo = afGoodsNo;
                        passCheck = true;
                    }else{
                        passCheck = false;
                    }
                }
                
                //일시품절,판매종료인경우 주문불가 안내레이어의 체크리스트에서 제외함.
                if($(this).attr('soldOutYn') == 'Y'){
                    passCheck = false;
                }
                
                // 같은 상품인데 옵션이 다른경우가 장바구니에 담긴경우..
                // A상품은 재고 존재 B 상품은 품절이면 B밑에 프로모션 상품이 붙게되는데 주문시에 A상품 클릭시 B상품이 품절이라 선택되어 있지 않아도
                // B상품 하위에 있는 프로모션 상품의 재고를 확인하기 위한 조건
                if(afGoodsNo == bfGoodsNo){
                    passCheck = true;
                }
                
                if(passCheck == true){
                    
                    orderQtyBuy1 = parseInt(buyThisObj.attr('ordQty'));
                    
                    goodsNo = buyThisObj.parents('li').find('input[name=s_goods_no]').val();
                    itemNo  = buyThisObj.parents('li').find('input[name=s_item_no]').val();
                    promNo  = buyThisObj.parents('li').find('input[name=s_prom_no]').val();
                        
                    
                    var goodsData = {
                            goodsNo : goodsNo,
                            itemNo : itemNo,
                            strNo : strNo,
                            buyGetSctCd : 'B'
                    };
                    
                    
                    // 체크가된 상품의 프로모션 상품이 있는경우 프로모션 정보를 가져오기 위한 객체
                    var tdWrapObj = buyThisObj.parents('li').find(".evenPrdBox_ty02 .bottom");
                    //  선택된 단품 개수
                    var itemLen = tdWrapObj.length;
                    
                    //  선택된 단품 개수마다 세팅
                    for(var i=0; i<itemLen; i++){
                        
                        var resultData = new Array();
                        
                        
                        var goodsNo = $(".box > .tit", tdWrapObj).eq(i).attr('goodsno');
                        var itemNo = $(".box > .tit", tdWrapObj).eq(i).attr('itemno');
                        var itemCnt = $(".box > .tit", tdWrapObj).eq(i).attr('ordqty');
                        
                        var goodsNm = $(".box > .tit", tdWrapObj).eq(i).attr('goodsnm');
                        
                        var giftData = {
                                goodsNo : goodsNo,
                                itemNo : itemNo,
                                strNo : strNo,
                                crssPrstNo : promNo,
                                buyGetSctCd : 'G'
                        };
                        
                        resultData.push(giftData);
                        
                        if(resultData == null) {
                            alert("죄송합니다. 고객센터에 문의해 주세요.");
                        } else {
                            this.jsonParam =   {
                                    opCartBaseList : resultData
                                    , mbrDlvpSeq : mbrDlvpSeq
                                };
                        }
                        
                        $.ajax({
                            type: "POST",
                            url: url,
                            data: JSON.stringify(this.jsonParam),
                            contentType: "application/json;charset=UTF-8",
                            dataType : 'json',
                            async: false,
                            cache: false,
                            success: function(res){
                                var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
                                var result = data.todayDeliveryStrStock[0];
                                
                                var totalStkQty = 0;
                                
                                if(itemCnt > result.stkQty){
                                    alert('['+goodsNm+'] 상품 재고가 '+result.stkQty+'개 남았습니다.\n다른 상품을 선택해 주세요.');
                                    tdsReturn = true; 
                                    return false;
                                }
                                
                                
                            },
                            error : function(e) {
                                console.log(e);
                                tdsReturn = true;
                                alert("죄송합니다. 고객센터에 문의해 주세요.");
                                return false;
                            }
                        });
                        
                        if(tdsReturn){
                            //break;
                        }
                        
                    }
                    if(tdsReturn){
                       // break;
                    }
                }
                
            });
        }
        
        if(tdsReturn){
            return false;
        }
        // [END 오늘드림 옵션상품 개선:jwkim]
        
        
        // validation 
        var isValid =  true;
        var validMsg = "";
        var orderQtyBuy1 = 0;
        var stockQtyBuy1 = 0;
        var orderQtyGet1 = 0;
        var stockQtyGet1 = 0;
        var orderQtyBuy2 = 0;
        var stockQtyBuy2 = 0;
        var orderQtyGet2 = 0;
        var stockQtyGet2 = 0;
        var goodsNo = "";
        var cartArr = [];
        var promArr = [];
        var selGetItemFlag = true;
        
        //주문 999개 이상 주문 막는 프로세스로 인한 체크 스크립트 추가. (BUY+GET)
        var totOrdQtyForOrdBlock = 0;
        
        //주문전체크안내 HTML
        var blockLayerContentHtml = "";
        
        //안내HTML조건 변수
        var passCheck = false;
        
        $("#LAYERPOP01-title").text("주문상품 확인");
        blockLayerContentHtml = "<ul class='listPlusPrd'>";
        
        //현재 화면의 재고수량과 화면진입(초기화)시의 실재고수량을 체크
        //올리브영 체크박스
        $('input[name=s_checkbox1]').each(function(a,b){
           
           if(btnTp == "all"){
               passCheck = true;
           }else{
               if($('input[name=s_checkbox1]').eq(a).prop('checked') == true){
                   passCheck = true;
               }else{
                   passCheck = false;
               }
           }
           
           //일시품절,판매종료인경우 주문불가 안내레이어의 체크리스트에서 제외함.
           if($(this).attr('soldOutYn') == 'Y'){
               passCheck = false;
           }
           
           var buyThisObj = null;
           var promNo = null;
           
           if(passCheck == true){
               
                buyThisObj = $(this);
                orderQtyBuy1 = parseInt(buyThisObj.attr('ordQty'));
                stockQtyBuy1 = parseInt(buyThisObj.attr('stockQty'));
                goodsNo = buyThisObj.parents('li').find('input[name=s_goods_no]').val();
                itemNo  = buyThisObj.parents('li').find('input[name=s_item_no]').val();
                promNo = buyThisObj.parents('li').find('input[name=s_prom_no]').val();
                
                var checkHtml = false;
                
                //BUY군 체크
                if(orderQtyBuy1 > stockQtyBuy1){
                    isValid = false;
                    
                    blockLayerContentHtml += "<li>";
                    blockLayerContentHtml += "  <div class='img'><img src='"+buyThisObj.parents('li').find('img').attr('src')+"' alt='상품썸네일'></div>";
                    blockLayerContentHtml += "  <div class='box'>";
                    blockLayerContentHtml += "      <div class='tit'>";
                    blockLayerContentHtml += "          <span>"+buyThisObj.parents('li').find('p.prd_brand').text()+"</span>";
                    blockLayerContentHtml += "          <strong>"+buyThisObj.parents('li').find('p.prd_name.tx_short2').text()+"</strong>";
                    blockLayerContentHtml += "      </div>";
                    blockLayerContentHtml += "      <p class='option'>"+buyThisObj.parents('li').find('p.prd_option').text()+"</p>";
                    blockLayerContentHtml += "      <p class='cnt'><em class='tit'>현재 장바구니 수량</em>"+orderQtyBuy1+"개</p>";
                    blockLayerContentHtml += "      <p class='buy'><em class='tit'>구매가능 수량</em>"+stockQtyBuy1+"개</p>";
                    blockLayerContentHtml += "  </div>";
                    blockLayerContentHtml += "</li>";
                    
                    checkHtml = true;
                    
                } 
                
                totOrdQtyForOrdBlock += orderQtyBuy1;

                cartArr.push(buyThisObj.parents('li').find('input[name=s_cart_no]').val());
           }
                
            //GET군 체크
            if(!checkHtml){
                var idx = promArr.indexOf( promNo );
                
                if(idx > -1)
                    return true;
                
                // 해당 프로모션 get상품이 모두 선택되었는지 체크
                var samePromTrCnt = $('li[pno=' + promNo + '] input[name=s_checkbox1]:not(:disabled)').length;
                var checkedPromTrCnt = $('li[pno=' + promNo + '] input[name=s_checkbox1]:checked').length;
                
                if(samePromTrCnt != checkedPromTrCnt){
                    selGetItemFlag = false;
                    return true;
                }
                
                $('div.evenPrdBox_ty02[promNo=' + promNo + '] div.bottom div.tit').each(function(){
                      getThisObj = $(this);
                      var ordQty = parseInt( getThisObj.attr("ordQty") );
                    
                    totOrdQtyForOrdBlock += ordQty;

                    cartArr.push(getThisObj.attr('cartNo'));
                    
                    //같은 goodsNo를 찾는다.
                    if((getThisObj.attr('goodsNo') == goodsNo) && (getThisObj.attr('itemNo') == itemNo)){
                        orderQtyGet1 =  ordQty;
                        stockQtyGet1 = parseInt(getThisObj.attr('stockQty'));
                        
                        if((orderQtyBuy1 + orderQtyGet1) > stockQtyGet1){
                            isValid = false;
                            
                            blockLayerContentHtml += "<li>";
                            blockLayerContentHtml += "  <div class='img'><img src='"+buyThisObj.parents('li').find('img').attr('src')+"' alt='상품썸네일'></div>";
                            blockLayerContentHtml += "  <div class='box'>";
                            blockLayerContentHtml += "      <div class='tit'>";
                            blockLayerContentHtml += "          <span>"+buyThisObj.parents('li').find('p.prd_brand').text()+"</span>";
                            blockLayerContentHtml += "          <strong>"+buyThisObj.parents('li').find('p.prd_name.tx_short2').text()+"</strong>";
                            blockLayerContentHtml += "      </div>";
                            blockLayerContentHtml += "      <p class='option'>"+buyThisObj.parents('li').find('p.prd_option').text()+"</p>";
                            blockLayerContentHtml += "      <p class='cnt'><em class='tit'>현재 장바구니 수량</em>"+(orderQtyBuy1+orderQtyGet1)+"개</p>";
                            blockLayerContentHtml += "      <p class='buy'><em class='tit'>구매가능 수량</em>"+stockQtyGet1+"개</p>";
                            blockLayerContentHtml += "  </div>";
                            blockLayerContentHtml += "</li>";
                            
                        }
                    }
                });
                
                // 처리한 프로모션 추가
                promArr.push( promNo );
            }
        });
       
       //제휴업체 체크박스
        $('input[name=s_checkbox2]').each(function(a,b){
            
            if(btnTp == "all"){
                passCheck = true;
            }else{
                if($('input[name=s_checkbox2]').eq(a).prop('checked') == true){
                    passCheck = true;
                }else{
                    passCheck = false;
                }
            }
            
            //일시품절,판매종료인경우 주문불가 안내레이어의 체크리스트에서 제외함.
            if($(this).attr('soldOutYn') == 'Y'){
                passCheck = false;
            }
            
            var buyThisObj = null;
            var promNo = null;
            
            if(passCheck == true){
                
                buyThisObj = $(this);
                orderQtyBuy2 = parseInt(buyThisObj.attr('ordQty'));
                stockQtyBuy2 = parseInt(buyThisObj.attr('stockQty'));
                goodsNo = buyThisObj.parents('li').find('input[name=s_goods_no]').val();
                itemNo  = buyThisObj.parents('li').find('input[name=s_item_no]').val();
                promNo = buyThisObj.parents('li').find('input[name=s_prom_no]').val();
                
                var checkHtml2 = false;
                
                //BUY군 체크
                if(orderQtyBuy2 > stockQtyBuy2){
                    isValid = false;
                    
                    blockLayerContentHtml += "<li>";
                    blockLayerContentHtml += "  <div class='img'><img src='"+buyThisObj.parents('li').find('img').attr('src')+"' alt='상품썸네일'></div>";
                    blockLayerContentHtml += "  <div class='box'>";
                    blockLayerContentHtml += "      <div class='tit'>";
                    blockLayerContentHtml += "          <span>"+buyThisObj.parents('li').find('p.prd_brand').text()+"</span>";
                    blockLayerContentHtml += "          <strong>"+buyThisObj.parents('li').find('p.prd_name.tx_short2').text()+"</strong>";
                    blockLayerContentHtml += "      </div>";
                    blockLayerContentHtml += "      <p class='option'>"+buyThisObj.parents('li').find('p.prd_option').text()+"</p>";
                    blockLayerContentHtml += "      <p class='cnt'><em class='tit'>현재 장바구니 수량</em>"+orderQtyBuy2+"개</p>";
                    blockLayerContentHtml += "      <p class='buy'><em class='tit'>구매가능 수량</em>"+stockQtyBuy2+"개</p>";
                    blockLayerContentHtml += "  </div>";
                    blockLayerContentHtml += "</li>";
                    
                    checkHtml2 = true;
                    
                } 
                
                totOrdQtyForOrdBlock += orderQtyBuy2;

                cartArr.push(buyThisObj.parents('li').find('input[name=s_cart_no]').val());
                
                //GET군 체크
                if(!checkHtml2){
                    var idx = promArr.indexOf( promNo );
                    
                    if(idx > -1)
                        return true;
                    
                    // 해당 프로모션 get상품이 모두 선택되었는지 체크
                    var samePromTrCnt = $('li[pno=' + promNo + '] input[name=s_checkbox2]:not(:disabled)').length;
                    var checkedPromTrCnt = $('li[pno=' + promNo + '] input[name=s_checkbox2]:checked').length;
                    
                    if(samePromTrCnt != checkedPromTrCnt){
                        selGetItemFlag = false;
                        return true;
                    }
                    
                    $('div.evenPrdBox_ty02[promNo=' + promNo + '] div.bottom div.tit').each(function(){
                          getThisObj = $(this);
                          var ordQty = parseInt( getThisObj.attr("ordQty") );
                        
                        totOrdQtyForOrdBlock += ordQty;

                        cartArr.push(getThisObj.attr('cartNo'));
                        
                        //같은 goodsNo를 찾는다.
                        if((getThisObj.attr('goodsNo') == goodsNo) && (getThisObj.attr('itemNo') == itemNo)){
                            orderQtyGet2 =  ordQty;
                            stockQtyGet2 = parseInt(getThisObj.attr('stockQty'));
                            
                            if((orderQtyBuy2 + orderQtyGet2) > stockQtyGet2){
                                isValid = false;
                                
                                blockLayerContentHtml += "<li>";
                                blockLayerContentHtml += "  <div class='img'><img src='"+buyThisObj.parents('li').find('img').attr('src')+"' alt='상품썸네일'></div>";
                                blockLayerContentHtml += "  <div class='box'>";
                                blockLayerContentHtml += "      <div class='tit'>";
                                blockLayerContentHtml += "          <span>"+buyThisObj.parents('li').find('p.prd_brand').text()+"</span>";
                                blockLayerContentHtml += "          <strong>"+buyThisObj.parents('li').find('p.prd_name.tx_short2').text()+"</strong>";
                                blockLayerContentHtml += "      </div>";
                                blockLayerContentHtml += "      <p class='option'>"+buyThisObj.parents('li').find('p.prd_option').text()+"</p>";
                                blockLayerContentHtml += "      <p class='cnt'><em class='tit'>현재 장바구니 수량</em>"+(orderQtyBuy2+orderQtyGet2)+"개</p>";
                                blockLayerContentHtml += "      <p class='buy'><em class='tit'>구매가능 수량</em>"+stockQtyGet2+"개</p>";
                                blockLayerContentHtml += "  </div>";
                                blockLayerContentHtml += "</li>";
                                
                            }
                        }
                    });
                    
                    // 처리한 프로모션 추가
                    promArr.push( promNo );
                }   
            }
        });
        
        // 퀵배송 주문 수량제한
        if($("#quickYn").val()=="Y"){
            var quickOrdPsbMaxQty = parseInt($("#quickOrdPsbMaxQty").val());
            if(totOrdQtyForOrdBlock > quickOrdPsbMaxQty){
                alert("오늘드림 주문은 최대 " + quickOrdPsbMaxQty + "개 까지만 구매할수있습니다.");
                return false;
            }
        }
        
        //한주문당 999개의 상품을 담을수 없음. 체크추가[BUY+GET]
        if(totOrdQtyForOrdBlock > 999){
            alert("1회주문에 999개까지만 가능합니다.");
            return false;
        }
        
        blockLayerContentHtml += "</ul>";
        
        blockLayerContentHtml += "<div class='btnBigArea pdzero'>";
        blockLayerContentHtml += "  <button type='button' class='btnGreen' onclick='common.popLayerClose(\"LAYERPOP01\");return false;'>장바구니로 돌아가기</button>";
        blockLayerContentHtml += "</div>";
    
        $("#LAYERPOP01-contents").html(blockLayerContentHtml);
        
        if (!isValid) {
            common.popLayerOpen('LAYERPOP01');
        } else {
            //선물하기 여부 추가
            $("#presentYn").val(window["presentYn"] == "Y" ? "Y" : "N");
            
            //수량 amount disabled 풀기
            $("[name=s_amount]").removeAttr("disabled");
            
            // form submit!!
            var url = _secureUrl + "order/getOrderForm.do";
            
            if(!selGetItemFlag){
                url = _secureUrl + "cart/getCart.do";
                $("#partYn").val("Y");
            }

            //넷퍼넬 장바구니 구매하기 act_07
            NetFunnel_Action({action_id:"act_07"},function(ev,ret){
            	
				$("#cartNo").val(cartArr);
	            $('#cartForm').attr('method','post');
	            $('#cartForm').attr('action',url);
	            $('#cartForm').submit();
	            
            }); // 넷퍼넬 End act_07
        }
        
        return false;
        
    }
    // submit
};

$.namespace('mcart.popLayer.promGift.http');
mcart.popLayer.promGift.http = {

    /*
     * 행사사은품선택팝업띄우기
     */
    openPromGiftPop : {
        jsonParam : false,
        /**
         *   파라메터의 validation 처리
         */
        validation : function(vGoodsNo,vItemNo,vPromNo) {
            
            var isValid = true;
            if(vGoodsNo == null || vGoodsNo == '' || vItemNo == null || vItemNo == '' || vPromNo == null || vPromNo == '') {
                var msg = "죄송합니다. 고객센터에 문의해 주세요.";

                this.jsonParam = false;
                isValid = false;
            }
            
            var thisObj = $("#selGet_"+selTargetPromNo);
            var getItemCnt = parseInt(thisObj.attr("getCondStrtTotQty"));
            var buyItemCnt = $('li[pno='+selTargetPromNo+']').length;
            
            var quickYn = $(":input:radio[name=qDelive]:checked").val();
            if(typeof(quickYn) == "undefined"){
                quickYn = $("#quickYn").val();
            }
            
            if(isValid) {
                this.jsonParam =   {
                        goodsNo : vGoodsNo,
                        itemNo : vItemNo,
                        promNo : vPromNo,
                        getItemCnt : getItemCnt,
                        buyItemCnt : buyItemCnt,
                        quickYn : quickYn,
                        cartYn : 'Y' // 오늘드림 장바구니인경우에만 옵션상품 선택 layer팝업 오픈시 매장재고 체크 jwkim
                    };
            }
            return isValid;
        },
        submit : function(vGoodsNo,vItemNo,vPromNo) {
            var url = _baseUrl + "cart/promGiftPopAjax.do";
            var callback = function(res) {
                common.popLayerOpen("CARTLAYER");
                $("#CARTLAYER").html(res);
                //mcart.base.setLazyLoad('seq');
                var popPos = $('#CARTLAYER').height()/2;
                $('#CARTLAYER').css('margin-top',-(popPos));
                
                //부모창에 선택된 GET상품이 있으면 셋팅
                var selGetObj = $("div#selGet_"+selTargetPromNo);
                var promNo = selGetObj.attr("promNo");
                var promKndCd = selGetObj.attr("promKndCd");
                var buyCondStrtQtyAmt = parseInt( selGetObj.attr("buyCondStrtQtyAmt") );
                var getItemAutoAddYn = selGetObj.find("div.evenPrdBox_ty02").attr("getItemAutoAddYn");
                var getItemGoodsNo = selGetObj.find("div.evenPrdBox_ty02").attr("getItemGoodsNo");
                var getItemItemNo = selGetObj.find("div.evenPrdBox_ty02").attr("getItemItemNo");
                
                var pGoodsNo = "";
                var pItemNo = "";
                var itemQty = 1;
                
                // 프로모션 자동증가 케이스이나 lgcGoodsNo 가 같은 상품이 복수개일 경우
                if(getItemAutoAddYn == "Y" && $('li[name=selPopInfo]').length > 1){
                    $('li[name=selPopInfo]').each(function(){
                        var sameLgcGoodsNo = $(this).attr("goodsNo");
                        var sameLgcGoodsItemNo = $(this).attr("itemNo");
                        
                        if(getItemGoodsNo != sameLgcGoodsNo || getItemItemNo != sameLgcGoodsItemNo)
                            $(this).remove();
                    });
                }
                
                //buy상품군의 수량정보를 가져와 품절체크추가
                //레이어창의 상품군
                var totalCnt = 0;
                $('li[name=selPopInfo]').each(function(x,y){
                    var layerPopObj = $(this);
                    var getGoodsCnt = parseInt(layerPopObj.attr('stockQty'));
                    layerPopObj.attr('realStockQty', getGoodsCnt);
                    
                    var getGoodsNo = layerPopObj.attr("goodsNo");
                    var getItemNo = layerPopObj.attr("itemNo");
                    
                    // 장바구니에 선택된 buy상품만큼 재고수량 빼기 
                    $('li[pno]').each(function(){
                        var buyObj = $(this);
                        var buyGoodsCnt = parseInt(buyObj.find('[name=s_amount]').val());
                        
                        var buyGoodsNo = buyObj.attr("goodsNo");
                        var buyItemNo = buyObj.attr("itemNo");
                        
                        //buy상품군의 상품정보와 레이어창의 상품정보가 같으면
                        if((getGoodsNo == buyGoodsNo) && (getItemNo == buyItemNo)){
                            //buy상품군의 수량이 실재고 수량보다 크거나 같으면 jwkim
                            if(buyGoodsCnt >= getGoodsCnt){
                                //조건만족시 수량0으로 셋팅하고 품절처리
                                getGoodsCnt -= buyGoodsCnt;
                                layerPopObj.attr('stockQty', 0);
                                layerPopObj.attr('class','soldout');
                                layerPopObj.find('div.img').append("<span>일시품절</span>");
                                layerPopObj.find('input[name=promGiftAmount]').attr('disabled','disabled');
                                layerPopObj.find('input[name=promGiftAmount]').siblings().attr('disabled','disabled');
                            } else {
                                getGoodsCnt -= buyGoodsCnt;
                                
                                layerPopObj.attr('stockQty', getGoodsCnt);
                            }
                        }
                    });
                    
                    // 장바구니에 선택된 get상품만큼 재고수량 빼기 
                    $("div.evenPrdBox_ty02:not([promNo=" + promNo + "]) div.bottom div.tit").each(function(){
                        var buyObj = $(this);
                        var buyGoodsCnt = parseInt(buyObj.attr("ordQty"));
                        
                        var buyGoodsNo = buyObj.attr("goodsNo");
                        var buyItemNo = buyObj.attr("itemNo");
                        
                        //buy상품군의 상품정보와 레이어창의 상품정보가 같으면
                        if((getGoodsNo == buyGoodsNo) && (getItemNo == buyItemNo)){
                            //buy상품군의 수량이 실재고 수량보다 크거나 같으면
                            if(buyGoodsCnt >= getGoodsCnt){
                                //조건만족시 수량0으로 셋팅하고 품절처리
                                getGoodsCnt -= buyGoodsCnt;
                                layerPopObj.attr('stockQty', 0);
                                layerPopObj.attr('class','soldout');
                                layerPopObj.find('div.img').append("<span>일시품절</span>");
                                layerPopObj.find('input[name=promGiftAmount]').attr('disabled','disabled');
                                layerPopObj.find('input[name=promGiftAmount]').siblings().attr('disabled','disabled');
                            } else {
                                getGoodsCnt -= buyGoodsCnt;
                                
                                layerPopObj.attr('stockQty', getGoodsCnt);
                            }
                        }
                    });
                    
                    // 장바구니에 기 선택된 get상품 적용
                    $("div.evenPrdBox_ty02[promNo=" + promNo + "] div.bottom div.tit").each(function(){
                        var buyObj = $(this);
                        var buyGoodsCnt = parseInt(buyObj.attr("ordQty"));
                        
                        var buyGoodsNo = buyObj.attr("goodsNo");
                        var buyItemNo = buyObj.attr("itemNo");
                        
                        if(getGoodsCnt < 0)
                            getGoodsCnt = 0;
                        
                        //buy상품군의 상품정보와 레이어창의 상품정보가 같으면
                        if((getGoodsNo == buyGoodsNo) && (getItemNo == buyItemNo)){
                            //buy상품군의 수량이 실재고 수량보다 크면
                            var ordPsbQty = 0;
                            if(buyGoodsCnt > getGoodsCnt){
                                ordPsbQty = getGoodsCnt;
                            } else {
                                ordPsbQty = buyGoodsCnt;
                            }
                            
                            layerPopObj.find('input[name=promGiftAmount]').val(ordPsbQty);
                            
                            if(ordPsbQty > 0)
                                layerPopObj.addClass("on");
                        }
                    });
                
                    //GET레이어의 상품 수가  1인경우 자동실행
                    if($('li[name=selPopInfo]').length == 1){
                        var ordPsbQty = getGoodsCnt;
                        
                        ordPsbQty = (getItemCnt > ordPsbQty) ? ordPsbQty : getItemCnt;
                        
                        if(ordPsbQty > 0){
                            $(this).find('input[name=promGiftAmount]').val(ordPsbQty);
                            $(this).attr("class","on");
                        }
                    }
                    
                    totalCnt += parseInt( $(this).find("input[name=promGiftAmount]").val() );
                });
                
                // 현재 선택된 수량 갱신
                $("p.choiceTxt span i").text(totalCnt);      // 기 선택한 추가상품 수량
                
                // 일시품절 상품 하단 정렬 시작
                var getItemList = [];
                var getItemSoldOutList = [];

                $("div#CARTLAYER ul.listPlusPrd li[name=selPopInfo]").each(function(){
                    if($(this).hasClass("soldout")){
                        getItemSoldOutList.push($(this));
                    } else {
                        getItemList.push($(this));
                    }
                });

                $("div#CARTLAYER ul.listPlusPrd").html();

                $(getItemList).each(function(){
                    $("div#CARTLAYER ul.listPlusPrd").append($(this));
                });

                $(getItemSoldOutList).each(function(){
                    $("div#CARTLAYER ul.listPlusPrd").append($(this));
                });
                // 일시품절 상품 하단 정렬 끝
            };
            var isValid = this.validation(vGoodsNo,vItemNo,vPromNo);
            
            if (isValid) {
                _ajax.sendRequest("GET", url, this.jsonParam, callback);
            }
        }
    }
};


/**
 * 배송비금액 Interface
 * 
 */
$.namespace('mcart.popLayer.deliveryAmt');
mcart.popLayer.deliveryAmt = {
        
    layerPopTitle : '배송비 상세정보',
    layerPopTitleId : 'LAYERPOP01-title',
    layerPopContId : 'LAYERPOP01-contents',
    
    init : function() {
        
        //배송비 상세 보기 버튼
        $("#btnDlexAmtPopLayer").click(function(){
            
            var nonCheck = true;
            $('input[name=s_checkbox1]').each(function(a,b){
                if($('input[name=s_checkbox1]').eq(a).prop('checked') == true){
                    nonCheck = false;
                }
            });
            
            $('input[name=s_checkbox2]').each(function(a,b){
                if($('input[name=s_checkbox2]').eq(a).prop('checked') == true){
                    nonCheck = false;
                }
            });
            
            //배송비 상세 초기화
            mcart.popLayer.deliveryAmt.getDlexDtlPopAjax(nonCheck);
            
            $("div[name=getPrdPopButton]").css('display','none');
            $("#"+mcart.popLayer.deliveryAmt.layerPopTitleId).text(mcart.popLayer.deliveryAmt.layerPopTitle);
            common.popLayerOpen('LAYERPOP01');
            return false;
        });
    },

    getDlexDtlPopAjax : function(nonCheck) {
        if(nonCheck){
            $("#dlexAmt_hd_base").text('0');
            $("#dlexAmt_hd_whsg").text('0');
            $("#dlexAmt_hd_sumPkg").text('0');
            $("#dlexAmt_entr_base").text('0');
            $("#dlexAmt_entr_whsg").text('0');
            $("#dlexAmt_entr_sumPkg").text('0');
            
            $("#totDlexAmt_hd_span").text('0');
            $("#totDlexAmt_entr_span").text('0');
            $("#totDlexAmt_span").text('0');
            
            $("#totDlexAmt_hd").val('0');
            $("#totDlexAmt_entr").val('0');
            $("#totDlexAmt").val('0');
            
            return false;
        }
        
        $.ajax({
            type: "POST",
            url: _baseUrl + "order/getDlexDtlPopAjax.do",
            data: {
                rmitPostNo : rmitPostNo,
                cartNo : cartNoArray.toString(),
            },
            dataType : 'html',
            async: false,
            success: mcart.popLayer.deliveryAmt._callback_getDlexDtlPopAjax,
            error: function() {
                alert("배송비 조회 실패");
            }
        });
    },
    
    _callback_getDlexDtlPopAjax : function(data) {
        $("#"+mcart.popLayer.deliveryAmt.layerPopContId).html(data);
        
        var dlexAmt_hd_base = 0;
        var dlexAmt_hd_whsg = 0;
        var dlexAmt_hd_sumPkg = 0;
        var dlexAmt_entr_base = 0;
        var dlexAmt_entr_whsg = 0;
        var dlexAmt_entr_sumPkg = 0;
        
        var totDlexAmt_hd = 0;
        var totDlexAmt_entr = 0;
        
        var totDlexAmt = 0;
        
        $("#hdDlexList li[type='base'] input[name='dlexAmt']").each(function(i) {
            dlexAmt_hd_base += Number($(this).val());
        });
        $("#hdDlexList li[type='whsg'] input[name='dlexAmt']").each(function(i) {
            dlexAmt_hd_whsg += Number($(this).val());
        });
        $("#hdDlexList li[type='sumPkg'] input[name='dlexAmt']").each(function(i) {
            dlexAmt_hd_sumPkg += Number($(this).val());
        });
        $("#entrDlexList li[type='base'] input[name='dlexAmt']").each(function(i) {
            dlexAmt_entr_base += Number($(this).val());
        });
        $("#entrDlexList li[type='whsg'] input[name='dlexAmt']").each(function(i) {
            dlexAmt_entr_whsg += Number($(this).val());
        });
        $("#entrDlexList li[type='sumPkg'] input[name='dlexAmt']").each(function(i) {
            dlexAmt_entr_sumPkg += Number($(this).val());
        });
        
        totDlexAmt_hd = dlexAmt_hd_base + dlexAmt_hd_whsg + dlexAmt_hd_sumPkg;
        totDlexAmt_entr = dlexAmt_entr_base + dlexAmt_entr_whsg + dlexAmt_entr_sumPkg;
        
        totDlexAmt = totDlexAmt_hd + totDlexAmt_entr;
        
        $("#totDlexAmt_hd").val(totDlexAmt_hd);
        $("#totDlexAmt_entr").val(totDlexAmt_entr);
        $("#totDlexAmt").val(totDlexAmt);
        
        $("#dlexAmt_hd_whsg").text(dlexAmt_hd_whsg.toMoney());
        $("#dlexAmt_hd_sumPkg").text(dlexAmt_hd_sumPkg.toMoney());
        $("#dlexAmt_entr_base").text(dlexAmt_entr_base.toMoney());
        $("#dlexAmt_entr_whsg").text(dlexAmt_entr_whsg.toMoney());
        $("#dlexAmt_entr_sumPkg").text(dlexAmt_entr_sumPkg.toMoney());
        
        $("#totDlexAmt_hd_span").text(totDlexAmt_hd.toMoney());
        $("#totDlexAmt_entr_span").text(totDlexAmt_entr.toMoney());
        
        $("#totDlexAmt_span").text(totDlexAmt.toMoney());
    }
};


$.namespace('mcart.base.quick');
mcart.base.quick = {
    
    quickCnt : 0,    
        
    init : function() {

            
        $("#ulDelivGb li").bind("click", function(){
            
            $("#ulDelivGb li").removeClass("on");
            $(this).addClass("on");
            
            var quickYn = $(this).attr("quickYn");
            $("#quickYn").val(quickYn);
            // form submit!!
            var url = _secureUrl + "cart/getCart.do?quickYn="+quickYn;
            
            // 선택구매, 전체구매 비활성화
            $("button[name=partOrderBtn], button[name=allOrderBtn]").attr('disabled','disabled');
            window.location.href=url;

            //$('#cartForm').attr('method','get');
            //$('#cartForm').attr('action',url);
            //$('#cartForm').submit();
            
        });
        
        $('.sel_option').click(function(e){
           e.preventDefault();
           if($(this).parent().hasClass('open')){
               $(this).parent().removeClass('open');
           }else{
               $(this).parent().addClass('open');
           }
        });     
        
//        $(".dlvList").click(function(){
//            
//            if($(this).hasClass("dis")){
//                alert("오늘드림 서비스 지역이 아닙니다.");
//            }else{
//                //변경되었으면
//                if($("#dlvpSeqSelect").val()!=$(this).find('input[name=dlvpSeqInput]').val()){
//                    
//                    var checkMsg = "배송지를 변경하시면 주문 가능 상품이 변경될 수 있습니다.";
//                    
//                    if(mcart.base.quick.quickCnt <= 0 || confirm(checkMsg)){
//                        
//                        $("#dlvpSeqSelect").val($(this).find('input[name=dlvpSeqInput]').val());
//                        $("#strNoSelect").val($(this).find('input[name=strNoInput]').val());
//                        $(".sel_option").addClass("choice");
//                        $(".sel_option").html('<span class="em">'+$(this).find('input[name=dlvpNmInput]').val()+'</span>'+$(this).find('input[name=dlvpAddrInput]').val());
//                        
//                        var url = _baseUrl + "cart/regDlvpQuickList.do";
//                        var data = {
//                                mbrDlvpSeq :$("#dlvpSeqSelect").val()
//                        };
//                        
//                        common.Ajax.sendRequest("POST",url,data,window.location.reload());    
//                    }
//                    
//                }
//                $(".sel_option").parent().removeClass('open');
//            }
//            
//        });
        
        $(".btn_addadr").click(function(){
            common.zipcodequick.pop.deliveryRegistCartForm();
        });
        //배송지수정(오늘드림 고도화 2019.12.17 추가) 
        $("#btn_editadr").click(function(){
            common.zipcodequick.pop.cartYn = 'Y';
            var url = _baseUrl + "cart/getDeliveryRegistFormCartAjax.do";
            var data = {mbrDlvpSeq : $("#dlvpSeqSelect").val()};
            common.Ajax.sendRequest("POST", url, data, common.zipcodequick.pop._callBackDeliveryRegistForm);
        });
    }    
};

function fn_reload(){
    setTimeout(function(){
        window.location.reload();
    },500);
}

// 주소변경 function 처리
function fn_dlvListClick(obj){
    
    if($(obj).hasClass("hldy")){
        alert("오늘은 서비스가 불가능한 지역입니다.");
    }else if($(obj).hasClass("dis")){
        alert("오늘드림 서비스 지역이 아닙니다.");
    }else{
        //변경되었으면
        if($("#dlvpSeqSelect").val()!=$(obj).find('input[name=dlvpSeqInput]').val()){
            
            var checkMsg = "배송지를 변경하시면 주문 가능 상품이 변경될 수 있습니다.";
            
            if(mcart.base.quick.quickCnt <= 0 || confirm(checkMsg)){
                
                $("#dlvpSeqSelect").val($(obj).find('input[name=dlvpSeqInput]').val());
                $("#strNoSelect").val($(obj).find('input[name=strNoInput]').val());
                $(".sel_option").addClass("choice");
                $(".sel_option").html('<span class="em">'+$(obj).find('input[name=dlvpNmInput]').val()+'</span>'+$(obj).find('input[name=dlvpAddrInput]').val());
                
                var url = _baseUrl + "cart/regDlvpQuickList.do";
                var data = {
                        mbrDlvpSeq :$("#dlvpSeqSelect").val()
                };
               
                common.Ajax.sendRequest("POST",url,data,fn_reload(), false); 
                   
            }
            
        }
        $(".sel_option").parent().removeClass('open');
    }
    
}



//다시선택 버튼(innerHtml 추가용 스크립트선언)
function fn_selBtnAfterOnRoadGetSel(promNo){
    var btnObj = $('#btnSelGetItem_'+promNo);
    var goodsNo = btnObj.attr('goodsNo');
    var itemNo = btnObj.attr('itemNo');
    var cartNo = btnObj.attr('cartNo');
    var oriPromNo = btnObj.parents('li').attr('oriPno');
    
    selTargetPromNo = promNo;

    mcart.popLayer.promGift.popLayerOpen(goodsNo,itemNo,oriPromNo);
    return false;
}

//행사안내레이어팝업(innerHtml 추가용 스크립트선언)
function fn_selBtnAfterOnRoadPromView(promNo){
    var btnObj = $('li[pno='+promNo+']');
    var goodsNo = btnObj.attr('goodsNo');
    var itemNo = btnObj.attr('itemNo');
    var promKndCd = btnObj.attr("promKndCd");
    var promCondCd = btnObj.attr("buyCondStrtQtyAmt") + "+" + btnObj.attr("getCondStrtQtyAmt");
    
    common.openEvtInfoPop(promNo,promKndCd,promCondCd,goodsNo,itemNo);
    
    return false;
}

//상품 수량변경(innerHtml 추가용 스크립트선언) 
function fn_comboChange(obj){
    if($(obj).val() != '10+'){
        $(obj).parents('div.price_info').find('button[name=btnQtyMod]').click();
        $(obj).parents('div.price_info').find('div').removeClass('none');
    }else{
        var prdTp = $(obj).attr('prdTp');
        var prdCnt = $(obj).attr('prdCnt');
        var ordPsbMinQty = $(obj).attr('ordPsbMinQty');
        var ordPsbMaxQty = $(obj).attr('ordPsbMaxQty');
        var orgOrdQty = $(obj).attr('ordQty');
        var qtyAddUnit = $(obj).attr('qtyAddUnit');
        $(obj).parents('div.price_info').find('div').addClass('none');
        $(obj).parents('div.price_info').find('button[name=btnQtyMod]').css('display','');
        $(obj).parent().prepend('<input type="tel" name="s_amount" prdTp="'+prdTp+'" prdCnt="'+prdCnt+'" ordPsbMinQty="'+ordPsbMinQty+'" ordPsbMaxQty="'+ordPsbMaxQty+'" qtyAddUnit="'+qtyAddUnit+'" ordQty="'+orgOrdQty+'" title="수량입력"  onkeyup="this.value=this.value.replace(/[^0-9]/g,\'\'); if(this.value>'+ordPsbMaxQty+')this.value='+ordPsbMaxQty+';""   />');
        $(obj).parent().find('input[type="tel"]').focusout(function(){
            var ordQty = $(this).val();
            if(ordQty == undefined || ordQty == "" || isNaN(ordQty) ){
                ordQty = orgOrdQty; 
                $(this).val(ordQty);
            }
        });
        $(obj).parent().find('input[type="tel"]').focus();
        $(obj).remove();
    }
} 

// 옵션변경 div 셀렉트 박스 이벤트
var clickedSelectOpt = false;
function attachEvtOptChangeSelDiv(){
    $('div.select_box a.select_opt').click(function(e){
        if( clickedSelectOpt ){
            alert('처리중입니다.');
        }
        clickedSelectOpt = true;
        
        e.preventDefault();
        
        // 오늘드림 전문관에서 장바구니 클릭시 val값은 Y이다 jwkim
        var cartQuickYn = $("#quickYn", $("#cartForm")).val();
        
        if($('div.select_box').hasClass('open')){
            e.preventDefault();
            
            $(this).parent('div.select_box').removeClass('open').find('ul').hide();
            $('div.opt_choice_area').css({'overflow-y':'scroll'});
            clickedSelectOpt = false;
        }else{
            var url = _baseUrl + "common/getCartOptionSelectAjax.do";
            var data = {
                goodsNo : $(this).attr("data-ref-goodsNo"),
                itemNo : $(this).attr("data-ref-itemNo"), 
                quickYn : cartQuickYn // 오늘드림 장바구니에 담아야 하는것을 구분하기 위해서 사용 jwkim
            };
            
            if(cartQuickYn == "Y") {
                data.strNo = $("#strNoSelect").val();
            }
            common.Ajax.sendRequest("POST",url,data,callbackCartOptionSelect);
            
            // 옵션변경 시 기존 카트 삭제
            common.cart.cartNo = $(this).parents("li").attr("cno");
        }
    });
    
    var callbackCartOptionSelect = function(data){
        var obj = $("li[cno=" + common.cart.cartNo + "]");
        
        obj.find("ul.list_opt_other").html(data);
        obj.find("div.select_box").addClass('open').find('ul').show();
        obj.find("div.opt_choice_area").css({'overflow-y':'visible'});
        
        // 오늘드림 전문관에서 장바구니 클릭시 val값은 Y이다 jwkim
        var cartQuickYn = $("#quickYn", $("#cartForm")).val();
        
        obj.find("ul.list_opt_other li").click(function(){
            if($(this).hasClass("soldout"))
                return false;
            
            var goodsNo = $(this).find("div a").attr("data-ref-goodsNo");
            var itemNo = $(this).find("div a").attr("data-ref-itemno");
            var itemNm = $(this).find("div a span.name > .optItemName").text();
            
            var obj = $("li[cno=" + common.cart.cartNo + "]");
            var pkgGoodsNo = obj.attr("pkgGoodsNo");
            var ordQty = parseInt( obj.find("[name=s_amount]").val() );
            var cartNo = common.cart.cartNo;
            
            var promNo = $(this).find("div a").attr("promNo");
            var promKndCd = $(this).find("div a").attr("promKndCd");
            var buyCondStrtQtyAmt = parseInt( $(this).find("div a").attr("buycnt") );
            var getItemAutoAddYn = $(this).find("div a").attr("getItemAutoAddYn");
            var getItemGoodsNo = $(this).find("div a").attr("getItemGoodsNo");
            var getItemItemNo = $(this).find("div a").attr("getItemItemNo");
            
            // Y가 아닌경우는 오늘드림 관련 제어가 필요 없기 때문에 N으로 초기화 jwkim
            if(cartQuickYn != "Y"){
                cartQuickYn = "N";
            }
            
            var cartInfo = {};
            cartInfo.goodsNo = goodsNo;
            cartInfo.itemNo = itemNo;
            cartInfo.pkgGoodsNo = pkgGoodsNo; 
            cartInfo.ordQty = ordQty;
            cartInfo.cartNo = cartNo;
            
            cartInfo.promNo = promNo;
            cartInfo.promKndCd = promKndCd;
            cartInfo.buyCondStrtQtyAmt = buyCondStrtQtyAmt;
            cartInfo.getItemAutoAddYn = getItemAutoAddYn;
            cartInfo.getItemGoodsNo = getItemGoodsNo;
            cartInfo.getItemItemNo = getItemItemNo;
            
            // 오늘드림 탭인경우 옵션변경시 오늘드림 장바구니에 담김 jwkim
            cartInfo.quickYn = cartQuickYn;
            
            // 옵션변경 카트 등록
            //obj.find("a.select_opt").unbind("click"); // 옵션변경뒤 화면 로딩전에 또 변경하는 케이스를 막기위해 추가
            var returnData = regCart(cartInfo);
            
            if(returnData != null && returnData.result){
                obj.find("a.select_opt").attr("data-ref-itemNo", itemNo);
                obj.find("a.select_opt").text(itemNm);
            }
            
            obj.find('div.select_box').removeClass('open').find('ul').hide();
            obj.find('div.opt_choice_area').css({'overflow-y':'scroll'});
        });
        
        // 옵션이 있는 상품 제어(오늘드림 장비구니 탭인 경우 오늘드림이 아닌상품은 soldout(선택불가)처리 jwkim
        $("ul.list_opt_other > li").each(function(){
            // 오늘드림 딱지가 없고 오늘드림장바구니 인경우 : 오늘드림이 아닌 옵션상품 soldout처리
            if(!$(this).find("span").hasClass("delivery") && cartQuickYn == "Y"){
                $(this).addClass("soldout");
            }
        });
        clickedSelectOpt = false;
    };
    
    var regCart = function(cartInfo){
        var buyGoodsNo = cartInfo.goodsNo;
        var buyItemNo = cartInfo.itemNo;
        var pkgGoodsNo = cartInfo.pkgGoodsNo;
        var buyOrdQty = cartInfo.ordQty;
        var cartNo = cartInfo.cartNo;
        
        var promNo = cartInfo.promNo;
        var promKndCd = cartInfo.promKndCd;
        var samePrdSumOrdQty = 0;
        var buyCondStrtQtyAmt = cartInfo.buyCondStrtQtyAmt;
        
        var getItemAutoAddYn = cartInfo.getItemAutoAddYn;
        var getItemGoodsNo = cartInfo.getItemGoodsNo;
        var getItemItemNo = cartInfo.getItemItemNo;
        var getOrdQty = 0;
        // 오늘드림 장바구니에서 옵션변경한 경우 오늘드림 장바구니 담기게 하기 위한 변수
        var quickYn = cartInfo.quickYn;
        
        if(promKndCd == "P201"){
            samePrdSumOrdQty = buyOrdQty;
            getOrdQty = parseInt( buyOrdQty / buyCondStrtQtyAmt );
        } else if(promKndCd == "P203"){
            samePrdSumOrdQty = 0;
            getOrdQty = buyOrdQty;
        }
        
        var param = { 
                goodsNo : buyGoodsNo,
                itemNo : buyItemNo,
                pkgGoodsNo : pkgGoodsNo,
                ordQty : buyOrdQty,
                cartNo : cartNo,
                promKndCd : promKndCd,
                quickYn : quickYn,
                buyCondStrtQtyAmt : buyCondStrtQtyAmt
          }
        
        var resultData = [];
        resultData.push(param);
        
        // 프로모션이 동일(P201), A+B(P203) 이고, N+1 중 N이 1인 경우, FreeGift 가 1종류인 경우 Get상품 추가
        if(promNo != undefined && promNo != '' && buyCondStrtQtyAmt == 1){
            if(promKndCd == "P201" || 
              (promKndCd == "P203" && getItemAutoAddYn == "Y" && 
               getItemGoodsNo != undefined && getItemGoodsNo != '' && 
               getItemItemNo != undefined && getItemItemNo != '')){
            
                var getGoodsData = {
                        goodsNo : getItemGoodsNo,
                        itemNo : getItemItemNo,
                        ordQty : getOrdQty,
                        rsvGoodsYn : "N", // 예약상품여부
                        dispCatNo : "",  // 전시카테고리 번호
                        drtPurYn : "N",            //바로구매여부
                        promKndCd : promKndCd,     //프로모션구분
                        crssPrstNo : promNo,        //프로모션번호
                        prstGoodsNo : buyGoodsNo,  //타겟buy군의 상품번호
                        prstItemNo : buyItemNo,    //타겟buy군의 아이템번호
                        buyCondStrtQtyAmt : buyCondStrtQtyAmt,
                        samePrdSumOrdQty : samePrdSumOrdQty,     //상품번호 아이템번호가 같은상품의 수량을 합한값
                        quickYn : quickYn, // 오늘드림여부 jwkim
                        getItemAutoAddYn : getItemAutoAddYn
                };
                                               
                resultData.push(getGoodsData);
            }
        }
        // N+1 동일 일 경우 장바구니에 자동 추가 (끝)
        
           var optChgYn = "Y";
           var returnData = common.cart.regCart(resultData, 'N', '', 'Y', optChgYn);
           return returnData;
    };
}

// 1. 관심상품행사 팝업 open
function popLayerOpen(){
    $("#goodsEventNotis").show();
    var popLayer = $("#goodsEventNotis");
    var popPos = $(popLayer).height()/2;
    var popWid = $(popLayer).width()/2;
    $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)}).show();
    $('.dim').show();
}

// 관심상품행사 팝업 close
function popLayerCloseNotis(){
    var popLayer = $("#goodsEventNotis");
    $('.more_box>.btn_more').removeClass('on');
    $(popLayer).hide().parents('body').removeAttr('style').css('overflow','visible');
    $('.dim').hide();
}

//관심상품행사 수신동의완료 팝업 open
//function goodsEventNotiAgrOpen(){
//    $("#goodsEventNotisAgr").show();
//    var popLayer = $("#goodsEventNotisAgr");
//    var popPos = $(popLayer).height()/2;
//    var popWid = $(popLayer).width()/2;
//    $(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)}).show();
//    $('.dim').show();
//}

//관심상품행사 수신동의완료 팝업 close
function goodsEventNotiAgrClose(){
    var popLayer = $("#goodsEventNotisAgr");
    $(popLayer).hide().parents('body').removeAttr('style').css('overflow','visible');
    $('.dim').hide();
}

//팝업 높이 변경
function newPopHeight(IdName){	
    var winH = $(window).height()-30; //수정함
	var popLayer = ('#'+IdName);
	$(popLayer).find('.popCont').css({'max-height': winH});

	var popPos = $(popLayer).height()/2;
	var popWid = $(popLayer).width()/2;
	$(popLayer).css({'left':'50%' , 'margin-left':-(popWid) , 'top':'50%' , 'margin-top':-(popPos)})
};

