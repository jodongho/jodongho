_ajax = common.Ajax;

$.namespace('mmypage.orderList');
mmypage.orderList = {
        isExcute : false,
        isPageSubmit : "000000",

        init : function(){
            ScrollPager.init({bottomScroll : 700, callback : mmypage.orderList.getOrderListJSON});
           /* 2019.10.25 오프라인리뷰관련 수정*/
            
           /* $('#search-month, #ord-prgs-stat-cd').change(function(){
                $(location).attr('href', _baseUrl + 'mypage/getOrderList.do?' + $('#order-list-form').serialize());
            });*/
            
            if($("#search-order-type option[selected='selected']") == null || $("#search-order-type option[selected='selected']").length == 0 ) {
                $("#search-order-type").val("");
            }else{
                $("#search-order-type").val($("#search-order-type option[selected='selected']").val());             
            }
            
            $('#search-order-type, #ord-prgs-stat-cd').change(function(){
                $("#stOrdNo").val("");
                $("#startRowNum").val("");
                
                // 구매타입변경시 구매상태 초기화
                if($(this).attr("id") == "search-order-type") $("#ord-prgs-stat-cd").val("");
                
                $("#dealSp").val($("#ord-prgs-stat-cd").val());
                
                // 주문/배송조회 UI 개선으로 DS 지표 추가 = [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
                if($("#search-order-type").val() == "10"){
                	common.wlog("mypage_orderlist_online");
                }else if($("#search-order-type").val() == "20"){
                	common.wlog("mypage_orderlist_offline");
                }
                
                if($("#ord-prgs-stat-cd").val() == "1"){
                	common.wlog("mypage_offline_purchase");
                }else if($("#ord-prgs-stat-cd").val() == "2"){
                	common.wlog("mypage_offline_cancel");
                }else if($("#ord-prgs-stat-cd").val() == "10"){
                	common.wlog("mypage_online_accept");
                }else if($("#ord-prgs-stat-cd").val() == "20"){
                	common.wlog("mypage_online_payment");
                }else if($("#ord-prgs-stat-cd").val() == "30"){
                	common.wlog("mypage_online_product");
                }else if($("#ord-prgs-stat-cd").val() == "40"){
                	common.wlog("mypage_online_shipping");
                }else if($("#ord-prgs-stat-cd").val() == "50"){
                	common.wlog("mypage_online_shipped");
                }
                
                $(location).attr('href', _baseUrl + 'mypage/getOrderList.do?' + $('#order-list-form').serialize());
            });
            
            
            
        },

        goDetail : function(ordNo, offlineOrderYn, obj){
            if(!ordNo){
                alert(MESSAGE.INVALID_ORDNO);
            }
            
            // 주문/배송조회 UI 개선으로 DS 지표 추가 = [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            common.wlog("mypage_order_detail");
            
            // 2019.10.24 오프라인 리뷰관련 requestUrl 분기 및 파라미터 추가
            var params = $(obj).data(); 
            if(offlineOrderYn == "Y") {
                ordNo = params.dealSp+ordNo;
                $(location).attr('href', _baseUrl + 'mypage/getOfflineOrderDetail.do?ordNo=' + ordNo+"|"+params.originBizplCd+"|"+params.frstReceiptNo);
            } else {
                $(location).attr('href', _baseUrl + 'mypage/getOrderDetail.do?ordNo=' + ordNo);
            }
            
        },
        
        goGoodsAssessmentList : function(obj, offlineOrderYn){
            // [상품평개편] 상품평쓰기 클릭 지표 추가 - 2019.4.11
            // 주문배송 > 상품평 쓰기
            try{    
                common.wlog("orderlist_gdas_write");
            }catch(e){}
            //$(location).attr('href', _baseUrl + 'mypage/getGdasList.do');
            
            var params = $(obj).data();
            /* 문구 추가 */
            if(params.ordConYn == "Y") {
                alert("해당 상품은 부분 교환된 상품입니다. 교환전 또는 교환후 상품 중 1개의 상품평만 작성 가능합니다.");
            }
            
            /* 2019.10.25 오프라인리뷰관련 수정*/
            var gdasSctCd = "Y" == offlineOrderYn ? "60" : "10";
            var param = '?goodsNo=' + params.goodsNo + '&itemNo=' + params.itemNo + '&ordNo=' + params.ordNo + '&ordGoodsSeq=' + params.ordGoodsSeq+"&gdasSctCd="+gdasSctCd;
            if("Y" == offlineOrderYn) {
                param += "&strNo="+params.strNo+"&operDt="+params.operDt+"&originBizplCd="+params.originBizplCd+"&receiptNo="+params.receiptNo+"&posNo="+params.posNo+"&lgcGoodsNo="+params.lgcGoodsNo;
            }
            param += '&retUrl=' + $(location).attr('href');
            console.log( '  param = ' + param);
            
            $(location).attr('href', _baseUrl + 'mypage/getGdasList.do' + param);
        },
        
        searchTrackingPop : function(obj){
            
            common.setScrollPos2();//클릭 시, 스크롤 위치값 localstorage 저장
            
            var params = $(obj).data();
            
            if(params.tradeShpCd == '1'){
                $('#pop-full-contents').html('');
                
                $('#pop-full-contents').load(_baseUrl + 'mypage/popup/getDeliveryDetail.do', params, function(){
                    
                    common.popFullOpen('배송조회');
                });
                
            }else{
                
                if(!params.hdcCd || !params.invNo){
                    alert('시스템 오류로 운송장번호가 조회되지 않고 있으니\r\n1:1상담 또는 고객센터(1522-0882)로 문의주세요.');
                    return;
                }
                
                window.open(HDC_PATH[params.hdcCd] + params.invNo.toString(), '_blank');
            }
        },
        
        getPresentAcceptStatCdJSON: function(ordNo){
            var fncOutFlag = false;
            
            _ajax.sendRequest('POST'
                , _baseUrl + 'mypage/getPresentAcceptStatCdJSON.do'
                , { ordNo   :   ordNo }
                , function(res){
                    // Y: 취소가능 ,    N : 취소불가 
                    if( res.status == "N"){
                        alert(res.statusMsg);
                        fncOutFlag = false;
                    }else if(res.status =="Y"){
                        //Y일때 
                        if(confirm(res.statusMsg)){
                            //계속 취소하면 절차지향으로 밑으로 내려보냄
                            fncOutFlag = true; 
                        }else{
                            //취소하지 않는다면 종료
                            fncOutFlag = false;
                        }
                    }else {
                        //noPresent일때(일반상품)
                        fncOutFlag = true;
                    }
                }
               ,false       //비동기 제어 
            );
            return fncOutFlag;
        },
        
        goOrderCancelForm : function(ordNo, chgAccpSctCd, tradeShpCd, ordDtlSctCd, ordPrgsStatCd, promNo, adtnCostNos){
            var today = new Date();
//            console.log('org='+(today.getHours() + "" + today.getMinutes() + "" + today.getSeconds()));
//            console.log("submit=["+mmypage.orderList.isPageSubmit+"]");
            if((today.getHours() + "" + today.getMinutes() + "" + today.getSeconds()) - mmypage.orderList.isPageSubmit <= 3){
                alert('처리중입니다 잠시만 기다려주세요.');
            }
            mmypage.orderList.isPageSubmit = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
            
            // 주문/배송조회 UI 개선으로 DS 지표 추가 = [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            if(chgAccpSctCd == '20'){
            	common.wlog("mypage_orderlist_cancel");
            }else if(chgAccpSctCd == '30'){
            	common.wlog("mypage_return_apply");
            }else if(chgAccpSctCd == '40'){
            	common.wlog("mypage_exchange_apply");
            }

            var clmUrl = {
                    20 : 'mypage/getCancelForm.do'
                   ,30 : 'mypage/getReturnForm.do'
                   ,40 : 'mypage/getChangeForm.do'    
            };
            
            if(chgAccpSctCd == '20'){
                if(!mmypage.orderList.getPresentAcceptStatCdJSON(ordNo)){
                    return false;
                }
            }
            
            if(!promNo || !adtnCostNos){
                $(location).attr('href', _baseUrl + clmUrl[chgAccpSctCd] + '?ordNo='+ordNo+'&chgAccpSctCd='+chgAccpSctCd);
                return false;
            }
            
            var params = {
                    ordNo         : ordNo,
                    tradeShpCd    : tradeShpCd,
                    ordDtlSctCd   : ordDtlSctCd,
                    ordPrgsStatCd : ordPrgsStatCd,
                    promNo        : promNo,
                    adtnCostNos   : adtnCostNos,
                    chgAccpSctCd  : chgAccpSctCd
                },
                
                message = {
                    20 : '행사 상품은 구매하신 모든 상품이 상품발송전에만 취소 신청 가능합니다.',
                    30 : '행사 상품은 구매하신 모든 상품이 배송완료 된 후 반품 신청 가능합니다.',
                    40 : '행사 상품은 구매하신 모든 상품이 배송완료 된 후 교환 신청 가능합니다.'
                };

            _ajax.sendRequest('POST'
                    , _baseUrl + 'mypage/getPromGoodsCancelPossibleJSON.do'
                    , params
                    , function(res){
                        if(!res.succeeded){
                            
                            alert(res.message);
                            return;
                        }
                        
                        var data = (typeof res.data !== 'object') ? $.parseJSON(res.data) : res.data;
                        
                        if(data.reqPsblYn != 'Y'){
                            alert(data.buyCondStrtQtyAmt + '+1 ' + message[params.chgAccpSctCd]);
                            return;
                        }
                        
                        $(location).attr('href', _baseUrl + clmUrl[chgAccpSctCd] + '?ordNo='+ordNo+'&chgAccpSctCd='+chgAccpSctCd);

                        return false;
                    }
                    , false
            );
        },
        
        storeRequestCancel : function(obj){
            if(mmypage.orderList.isExcute){
                alert('처리중입니다 잠시만 기다려주세요.');
                return;
            }
            
            // 주문/배송조회 UI 개선으로 DS 지표 추가 = [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            common.wlog("mypage_apply_cancel");
            
            var params = $(obj).data()
               ,message = '신청을 취소하시겠습니까?';
            
            if(!confirm(message)){
                
                mmypage.orderList.isExcute = false;
              
                return;
            } 
            
            mmypage.orderList.isExcute = true;
            
            _ajax.sendJSONRequest('POST'
                    , _baseUrl + 'mypage/registeredStoreRequestCancelJSON.do'
                    , params
                    , mmypage.orderList.requestCancelCallback
                    , false
            );
        },
        
        requestCancel : function(obj){
            if(mmypage.orderList.isExcute){
                alert('처리중입니다 잠시만 기다려주세요.');
                return;
            }
            
            // 주문/배송조회 UI 개선으로 DS 지표 추가 = [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            common.wlog("mypage_apply_cancel");
            
            var params = $(obj).data()
               ,message = {
                    20 : '신청을 취소하시겠습니까?',
                    30 : '신청을 취소하시겠습니까?',
                    40 : '신청을 취소하시겠습니까?'
                };
            
            if(!confirm(message[params.chgAccpSctCd])){
                
                mmypage.orderList.isExcute = false;
              
                return;
            } 
            
            mmypage.orderList.isExcute = true;
            
            _ajax.sendJSONRequest('POST'
                    , _baseUrl + 'mypage/registeredRequestCancelJSON.do'
                    , params
                    , mmypage.orderList.requestCancelCallback
                    , false
            );
        },
        
        requestCancelCallback : function(res){
            
            var data = (typeof res.data !== 'object') ? $.parseJSON(res.data) : res.data;
            
            if(res.message == '0000'){
                
                if(data.reqPsblYn == 'Y'){
                    location.reload();
                }else{
                    alert('이미 처리중인 건이므로 취소하실 수 없습니다.');
                    
                    mmypage.orderList.isExcute = false;
                    
                    return;
                }
            }else{
                alert('처리중 오류가 발생했습니다.\r\n잠시후 다시 시도해주세요.');
                
                mmypage.orderList.isExcute = false;
                
                location.reload();
            }
        },
        
        getOrderListJSON : function(){
            ScrollPager.unbindEvent();
            var values = $('#order-list-form').serializeObject();
            
            values.pageIdx = ScrollPager.nextPageIndex();
            
            _ajax.sendJSONRequest('GET'
                    , _baseUrl + 'mypage/getOrderListJSON.do'
                    , values
                    , mmypage.orderList.getOrderListJSONCallback
                );  
        },
        
        getOrderListJSONCallback : function(res){
            var data  = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
            if(data.length < 1){
                ScrollPager.unbindEvent();
                return;
            }
               
            $('.grayBox6').remove();
         // 2019.10.25 오프라인리뷰관련추가
            mmypage.orderList.getOnOffLastOrder(data);
            
            mmypage.orderList.addOrderList(data);
            
            $('#order-comment-tmpl').tmpl().appendTo('#mContents');
            ScrollPager.init({bottomScroll : 700, pageIndex: ScrollPager.currPageIndex(), callback : mmypage.orderList.getOrderListJSON});
        },
        
        // 2019.10.25 오프라인리뷰관련추가
        // 오프라인구매 마지막 rownum와 온라인마지막 ordNo를 구한다.
        getOnOffLastOrder : function(orderList) {
            var offRowCnt = 0;      // 오프라인구매주문기준 row건수
            var endOnlinOrderNo = ""; // 온라인주문 마지막 주문번호
            var beforOrderNo = "";
            
            for(var idx = orderList.length-1; idx >= 0; idx--) {
                var orderInfo = orderList[idx];
                
                 // 오프라인구매
                if("Y" == orderInfo.offlineOrderYn) {
                    if( common.isEmpty(beforOrderNo) || beforOrderNo != orderInfo.ordNo) {
                        beforOrderNo = orderInfo.ordNo;
                        offRowCnt++;                // 주문기준으로 rownum 가져오기 
                    } 
                // 온라인 구매
                } else {
                    if(common.isEmpty(endOnlinOrderNo)) endOnlinOrderNo = orderInfo.ordNo;
                }  
            }
            
            if(!common.isEmpty(endOnlinOrderNo)) $("#stOrdNo").val(endOnlinOrderNo);
            $("#startRowNum").val(parseInt($("#startRowNum").val())+parseInt(offRowCnt));
            
        },
        
        addOrderList : function(data){
        	// 주문/배송조회 UI 개선으로 Jquery tmpl 구성 변경 - [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            var prevOrdNo = '';
            var prevDlvNo = '';
            var prevPrgsStat = '';
            
            for(var i=0; i<data.length; i++){
                var groupOrdNo = $('#mContents').children('#linebox').last().data('group-ord-no')
                   ,ordNo      = data[i].ordNo
                   ,groupDlvNo = $('#mContents').children('#linebox').find('#stepbox').last().data('group-dlv-no')
                   ,dlvNo      = data[i].dlvNo
                   ,groupPrgsStat = $('#mContents').children('#linebox').find('#stepbox').last().data('group-prgs-stat')
                   ,prgsStat = data[i].ordPrgsStatCdViewNm2;
                
                data[i].prevOrdNo = prevOrdNo;
                data[i].prevDlvNo = prevDlvNo;
                data[i].prevPrgsStat = prevPrgsStat;
                data[i].totRealQty = data[i].totRealQty.numberFormat();
                
                if(groupOrdNo == ordNo){
                    $('#order-line-list-tmpl').tmpl(data[i]).appendTo($('#mContents').children('#linebox').last());
                }else{
                    $('#order-list-tmpl').tmpl(data[i]).appendTo('#mContents');
                }
                prevOrdNo = ordNo;
                prevDlvNo = dlvNo;
                prevPrgsStat = prgsStat;
            };
        },
        
        // 마이페이지 자주 구매 상품 더보기 링크 추가 - [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
        goOftenOrderList : function(){
        	common.wlog("mypage_often_ordlist");
        	
        	$(location).attr('href', _baseUrl + 'mypage/getOftenOrderList.do');
        }
};

$.namespace('mmypage.orderCancelList');
mmypage.orderCancelList = {
        init : function(){
            ScrollPager.init({bottomScroll : 700, callback : mmypage.orderCancelList.getOrderCancelListJSON});
            
            // 2019.11.13일 오프라인리뷰관련추가
            if($("#search-order-type option[selected='selected']") == null || $("#search-order-type option[selected='selected']").length == 0 ) {
                $("#search-order-type").val("");
            }else{
                $("#search-order-type").val($("#search-order-type option[selected='selected']").val());             
            }
            
            $('#search-order-type').change(function(){
                $("#stOrdNo").val("");
                $("#startRowNum").val("");
                
                 $(location).attr('href', _baseUrl + 'mypage/getOrderCancelList.do?' + $('#order-cancel-form').serialize());
            });
            
           /* $('#search-month').change(function(){
                $(location).attr('href', _baseUrl + 'mypage/getOrderCancelList.do?' + $('#order-cancel-form').serialize());
            });*/
        },
        
        goDetail : function(ordNo, offlineOrderYn, obj){
            
            if(!ordNo){
                alert(MESSAGE.INVALID_ORDNO);
            }
            
            // 2019.11.13 오프라인 리뷰관련 requestUrl 분기 및 파라미터 추가
            var params = $(obj).data(); 
            if(offlineOrderYn == "Y") {
                ordNo = params.dealSp+ordNo;
                $(location).attr('href', _baseUrl + 'mypage/getOfflineOrderDetail.do?ordNo=' + ordNo+"|"+params.originBizplCd);
            } else {
                $(location).attr('href', _baseUrl + 'mypage/getOrderDetail.do?ordNo=' + ordNo);
            }
            
        },
        
        getOrderCancelListJSON : function(){
            ScrollPager.unbindEvent();
            var values = $('#order-cancel-form').serializeObject();
            
            values.pageIdx = ScrollPager.nextPageIndex();
            
            _ajax.sendJSONRequest('GET'
                    , _baseUrl + 'mypage/getOrderCancelListJSON.do'
                    , values
                    , mmypage.orderCancelList.getOrderCancelListJSONCallback
            );  
        },
        
        getOrderCancelListJSONCallback : function(res){
            var data  = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
            if(data.length < 1){
                ScrollPager.unbindEvent();
                return;
            }
            
            $('.grayBox6').remove();
         // 2019.10.25 오프라인리뷰관련추가
            mmypage.orderList.getOnOffLastOrder(data);
            
            mmypage.orderCancelList.addOrderCancelList(data);
            
            $('#order-comment-tmpl').tmpl().appendTo('#mContents');

            ScrollPager.init({bottomScroll : 700, pageIndex: ScrollPager.currPageIndex(), callback : mmypage.orderCancelList.getOrderCancelListJSON});
        },
        
        addOrderCancelList : function(data){
        	// 취소/교환/반품 UI 개선으로 Jquery tmpl 구성 변경 - [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            var prevOrdNo = '';
            var prevDlvNo = '';
            var prevPrgsStat = '';
            
            for(var i=0; i<data.length; i++){
            	var groupOrdNo = $('#mContents').children('#linebox').last().data('group-ord-no')
                   ,ordNo      = data[i].ordNo
                   ,totSalePrc = Number(data[i].totSalePrc)
                   ,promPrc    = Number(data[i].totSalePrc)
                   ,groupDlvNo = $('#mContents').children('#linebox').find('#stepbox').last().data('group-dlv-no')
                   ,dlvNo      = data[i].dlvNo
                   ,groupPrgsStat = $('#mContents').children('#linebox').find('#stepbox').last().data('group-prgs-stat')
                   ,prgsStat = data[i].ordPrgsStatCdViewNm;
                
                data[i].prevOrdNo  = prevOrdNo;
                data[i].totRealQty = data[i].totRealQty.numberFormat();
                data[i].totSalePrc = data[i].totSalePrc.numberFormat();
                data[i].promPrc    = promPrc.numberFormat();
                data[i].prevDlvNo = prevDlvNo;
                data[i].prevPrgsStat = prevPrgsStat;
                
                if(Number(data[i].aplyAdtnCostAmt) > 0){
                    data[i].promPrc = (totSalePrc - data[i].aplyAdtnCostAmt).numberFormat();
                }
                
                if(groupOrdNo == ordNo){
                	$('#order-line-list-tmpl').tmpl(data[i]).appendTo($('#mContents').children('#linebox').last());
                }else{
                    $('#order-list-tmpl').tmpl(data[i]).appendTo('#mContents');
                }
                prevOrdNo = ordNo;
                prevDlvNo = dlvNo;
                prevPrgsStat = prgsStat;
            };
        }
};

$.namespace('mmypage.orderDetail');
mmypage.orderDetail = {
        textAreaMaxLength : 30,
        
        excute : false,

        init : function(){
            
            this.bindDeliveryMessageEvent();
            
            this.bindDeliveryListEvent();
            
            this.deliveryMessageInit();
            
        },
        
        getTabId : function(){
            return $('.areaButton').find('button').filter(function(){
                return $(this).hasClass('on')
            }).attr('id');    
        },
        
        tabRevitalizer : function(obj){
            if(obj.id == 'new'){
                $('#new').addClass('on');
                $('#exist').removeClass('on');
            }else{
                $('#new').removeClass('on');
                $('#exist').addClass('on');
            }
        },
        
        contentsAreaInit : function(obj){
            if(obj.id == 'new'){
                $('#new-delivery-form').addClass('on');
                $('#new-delivery-form').removeAttr('disabled');
                $('#delivery-form').removeClass('on');
                $('#delivery-form').attr('disabled','disabled');
            }else{
                $('#delivery-form').addClass('on');
                $('#delivery-form').removeAttr('disabled');
                $('#new-delivery-form').removeClass('on');
                $('#new-delivery-form').attr('disabled','disabled');
            }
        },
        
        contentsAreaDisabler : function(obj){
            if(obj.id == 'new'){
                $('#new-delivery-form').find('input, select, textarea').removeAttr('disabled');
                $('#delivery-form').find('input, select, textarea').attr('disabled','disabled');
            }else{
                $('#delivery-form').find('input, select, textarea').removeAttr('disabled');
                $('#new-delivery-form').find('input, select, textarea').attr('disabled','disabled');
            }
        },
        
        tabToggler : function(obj){
            if(obj.id == this.getTabId()) return;
            
            if(obj.id == 'new'){
                common.zipcode.pop.init(mmypage.orderDetail.newSelectedZipcodeCallback, 'new-search-zipcode-pop');
            }else{
                common.zipcode.pop.init(mmypage.orderDetail.selectedZipcodeCallback, 'search-zipcode-pop');
            }
            
            this.tabRevitalizer(obj);
            
            this.contentsAreaInit(obj);
            
            this.contentsAreaDisabler(obj);
            
//            this.setTabParams(obj);
        },
        
        bindDeliveryListEvent : function(){
            $('#delivery-list-select').change(function(){
                var $selected = $('option:selected', this)
                   ,params    = $selected.data() || {};
                
                $('#rmit-nm').val(params.rmitNm);
                $('#post-no').val(params.postNo);
                $('#rmit-post-no').val(params.postNo);
                $('#rmit-post-addr').val(params.rmitPostAddr);
                $('#rmit-base-addr').val(params.rmitPostAddr);
                $('#stnm-rmit-post-addr').val(params.stnmRmitPostAddr);
                $('#rmit-dtl-addr').val(params.rmitDtlAddr);
                $('#stnm-rmit-dtl-addr').val(params.stnmRmitDtlAddr);
                $('#stnm-rmit-post-addr-text').html('도로명 : <span id="rmit-post-road-text-value">' + params.stnmRmitPostAddr + ' ' + params.stnmRmitDtlAddr + '</span>');
                $('#rmit-post-addr-text').html('지번 : <span id="rmit-post-addr-text-value">' + params.rmitPostAddr + ' ' + params.rmitDtlAddr + '</span>');
                $('#rmit-cell-sct-no').val(params.rmitCellSctNo);
                $('#rmit-cell-txno-no').val(params.rmitCellTxnoNo);
                $('#rmit-cell-end-no').val(params.rmitCellEndNo);
                $('#rmit-tel-rgn-no').val(params.rmitTelRgnNo);
                $('#rmit-tel-txno-no').val(params.rmitTelTxnoNo);
                $('#rmit-tel-end-no').val(params.rmitTelEndNo);
                
                $("#temp-rmit-dtl-addr").attr("maxlength", 0);
                $("#temp-rmit-dtl-addr").val("");
                $("#temp-rmit-dtl-addr").hide();
            });
        },
        
        deliveryMessageInit : function(){
            var memo = $('#mbr-memo-cont-text').val();
            
            if(memo == '') return;
            
            $('#mbr-memo-cont-select option').filter(function(){
                return $(this).text() == memo
            }).attr('selected','selected');
            
            if($('#mbr-memo-cont-select').val() != '') return;
            
            $('#mbr-memo-cont-select').val('99');
            $('#mbr-memo-cont-area').removeClass('hide');
            $('#mbr-memo-cont-length').text(memo.length);
        },
        
        bindDeliveryMessageEvent : function(){
            $('#mbr-memo-cont-select, #new-mbr-memo-cont-select').change(function(){
                var $selected = $('option:selected', this)
                   ,$textarea = $("textarea[name='mbrMemoCont']")
                   ,section   = mmypage.orderDetail.getTabId() == 'new' ? mmypage.orderDetail.getTabId() + '-' : '' ;
                
               if($selected.val() == ''){
                   $textarea.val('');
                   $('#'+section+'mbr-memo-cont-area').addClass('hide');
               } else {
                   if($selected.val() == '99'){
                       $textarea.val('');
                       $('#'+section+'mbr-memo-cont-length').text('0');
                       $('#'+section+'mbr-memo-cont-area').removeClass('hide');
                   }else{
                       $textarea.val($selected.text());
                       $('#'+section+'mbr-memo-cont-area').addClass('hide');
                   }
               }
            });
            
            $("textarea[name='mbrMemoCont']").on("input keyup paste change", function(){
                var section = mmypage.orderDetail.getTabId() == 'new' ? mmypage.orderDetail.getTabId() + '-' : '' ;
                
                $(this).val(mmypage.orderDetail.checkTextAreaLength($(this).val()));
                
                $('#'+section+'mbr-memo-cont-length').text($(this).val().length);
            });
        },
        
        changeDelivery : function(ordNo){
            if(!$('#delivery-btn').hasClass('hide')) $('#delivery-btn').addClass('hide');
            if(!$('#delivery-info').hasClass('hide')) $('#delivery-info').addClass('hide');
            $('#delivery-regist-area').show();
            
            if(this.getTabId() == 'new'){
                common.zipcode.pop.init(mmypage.orderDetail.newSelectedZipcodeCallback, 'new-search-zipcode-pop');
            }else{
                common.zipcode.pop.init(mmypage.orderDetail.selectedZipcodeCallback, 'search-zipcode-pop');
            }
        },
        
        changeDeliveryCancel : function(ordNo){
            if($('#delivery-btn').hasClass('hide')) $('#delivery-btn').removeClass('hide');
            if($('#delivery-info').hasClass('hide')) $('#delivery-info').removeClass('hide');
            $('#delivery-regist-area').hide();
            $('#delivery-form').attr('disabled','disabled');
            $('#new-delivery-form').attr('disabled','disabled');
            $('#exist').click();
        },
        
        selectedZipcodeCallback : function(param){
            $('#post-no').val(param.postNo);
            $('#stnm-rmit-post-addr-text').html('도로명 : <span class="rmit-post-road-text-value">' + param.roadAddr1 + ' ' + param.roadAddr2 + '</span>');
            $('#rmit-post-addr-text').html('지번 : <span id="rmit-post-addr-text-value">' + param.lotAddr1 + ' ' + param.lotAddr2 + '</span>');
            
            $('#rmit-post-no').val(param.postNo);
            $('#rmit-post-addr').val(param.lotAddr1);
            $('#rmit-base-addr').val(param.lotAddr1);
            $('#rmit-dtl-addr').val(param.lotAddr2);
            $('#emd-nm').val(param.emdNm);
            $('#admr-nm').val(param.admrNm);
            $('#lat').val('');
            $('#lng').val('');
            $('#stnm-rmit-post-no').val(param.postNo1.toString() + param.postNo2.toString());
            $('#stnm-rmit-post-addr').val(param.roadAddr1);
            $('#stnm-rmit-dtl-addr').val(param.roadAddr2);
            $('#temp-rmit-dtl-addr').val('');
            $('#temp-rmit-dtl-addr').attr('maxlength', (param.roadAddr2.toString().length > param.lotAddr2.toString().length) ? 50 - param.roadAddr2.toString().length -1 : 50 - param.lotAddr2.toString().length -1);
            $('#temp-rmit-dtl-addr').show();
        },
        
        newSelectedZipcodeCallback : function(param){
            $('#new-post-no').val(param.postNo);
            $('#new-stnm-rmit-post-addr-text').html('도로명 : <span id="new-rmit-post-road-text-value">' + param.roadAddr1 + ' ' + param.roadAddr2 + '</span>');
            $('#new-rmit-post-addr-text').html('지번 : <span id="new-rmit-post-addr-text-value">' + param.lotAddr1 + ' ' + param.lotAddr2 + '</span>');
            $('#new-emd-nm').val(param.emdNm);
            $('#new-admr-nm').val(param.admrNm);
            $('#new-lat').val('');
            $('#new-lng').val('');
            $('#new-rmit-post-no').val(param.postNo);
            $('#new-rmit-post-addr').val(param.lotAddr1);
            $('#new-rmit-base-addr').val(param.lotAddr1);
            $('#new-rmit-dtl-addr').val(param.lotAddr2);
            $('#new-stnm-rmit-post-no').val(param.postNo1.toString() + param.postNo2.toString());
            $('#new-stnm-rmit-post-addr').val(param.roadAddr1);
            $('#new-stnm-rmit-dtl-addr').val(param.roadAddr2);
            $('#new-temp-rmit-dtl-addr').val('');
            $('#new-temp-rmit-dtl-addr').attr('maxlength', (param.roadAddr2.toString().length > param.lotAddr2.toString().length) ? 50 - param.roadAddr2.toString().length -1 : 50 - param.lotAddr2.toString().length -1);
            $('#new-temp-rmit-dtl-addr').show();
            
        },
        
        validator : function(){
            var section = '';
            
            if(mmypage.orderDetail.getTabId() == 'new'){
                section = mmypage.orderDetail.getTabId() + '-';
                
                if($('#add-dlvp-check').is(':checked')){
                    var $dlvpNm = $('#dlvp-nm');
                    
                    if(existsXssString($dlvpNm.val())){
                        alert(MESSAGE.VALID_DLVP_XSS_STR);
                        $dlvpNm.val(replaceStrXssAll($dlvpNm.val()));
                        $dlvpNm.focus();
                        return false;
                    }else{
                        if($dlvpNm.val().trim().length < 1){
                            alert(MESSAGE.VALID_DLVP_NM);
                            $dlvpNm.focus();
                            return false;
                        }
                    }
                }
            } 
                
            var $rmitNm          = $('#'+section+'rmit-nm')
            ,$rmitCellSctNo   = $('#'+section+'rmit-cell-sct-no')
            ,$rmitCellTxnoNo  = $('#'+section+'rmit-cell-txno-no')
            ,$rmitCellEndNo   = $('#'+section+'rmit-cell-end-no')
            ,$rmitTelRgnNo    = $('#'+section+'rmit-tel-rgn-no')
            ,$rmitTelTxnoNo   = $('#'+section+'rmit-tel-txno-no')
            ,$rmitTelEndNo    = $('#'+section+'rmit-tel-end-no')
            ,$rmitPostNo      = $('#'+section+'post-no')
            ,$rmitPostAddr    = $('#'+section+'rmit-post-addr')
            ,$stnmRmitPostAddr= $('#'+section+'stnm-rmit-post-addr')
            ,$rmitDtlAddr     = $('#'+section+'rmit-dtl-addr')
            ,$stnmRmitDtlAddr = $('#'+section+'stnm-rmit-dtl-addr')
            ,$tempRmitDtlAddr = $('#'+section+'temp-rmit-dtl-addr');

            $rmitNm.val(replaceStrXssAll($rmitNm.val()));
            if($rmitNm.val().trim().length < 1){
                alert(MESSAGE.VALID_MBR_NM);
                $rmitNm.focus();
                return false;
            }
            
            if($rmitCellSctNo.val().isEmpty()){
                alert(MESSAGE.VALID_CELL_SELECT);
                $rmitCellSctNo.focus();
                return false;
            }
            
            if($rmitCellTxnoNo.val().trim().length < 1){
                alert(MESSAGE.VALID_CELL_EMPTY);
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if($rmitCellTxnoNo.val().trim().length < 3){
                alert(MESSAGE.VALID_CELL_NUMBER);
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if(!$.isNumeric($rmitCellTxnoNo.val())){
                alert(MESSAGE.VALID_NOT_NUMBER);
                $rmitCellTxnoNo.val('');
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if($rmitCellEndNo.val().trim().length < 1){
                alert(MESSAGE.VALID_CELL_EMPTY);
                $rmitCellEndNo.focus();
                return false;
            }
            
            if($rmitCellEndNo.val().trim().length < 4){
                alert(MESSAGE.VALID_CELL_NUMBER);
                $rmitCellEndNo.focus();
                return false;
            }
            
            if(!$.isNumeric($rmitCellEndNo.val())){
                alert(MESSAGE.VALID_NOT_NUMBER);
                $rmitCellEndNo.val('');
                $rmitCellEndNo.focus();
                return false;
            }
            
            if(!$rmitTelRgnNo.val().isEmpty() || $rmitTelTxnoNo.val().trim().length > 0 || $rmitTelEndNo.val().trim().length > 0){
                if($rmitTelRgnNo.val().isEmpty()){
                    alert(MESSAGE.VALID_CELL_SELECT);
                    $rmitTelRgnNo.focus();
                    return false;
                }
                
                if($rmitTelTxnoNo.val().trim().length < 3){
                    alert(MESSAGE.VALID_CELL_NUMBER);
                    $rmitTelTxnoNo.focus();
                    return false;
                }
                
                if(!$.isNumeric($rmitTelTxnoNo.val())){
                    alert(MESSAGE.VALID_NOT_NUMBER);
                    $rmitTelTxnoNo.val('');
                    $rmitTelTxnoNo.focus();
                    return false;
                }
                
                if($rmitTelEndNo.val().trim().length < 4){
                    alert(MESSAGE.VALID_CELL_NUMBER);
                    $rmitTelEndNo.focus();
                    return false;
                }
                
                if(!$.isNumeric($rmitTelEndNo.val())){
                    alert(MESSAGE.VALID_NOT_NUMBER);
                    $rmitTelEndNo.val('');
                    $rmitTelEndNo.focus();
                    return false;
                }
                
            }else{
                $rmitTelRgnNo.val('');
                $rmitTelTxnoNo.val('');
                $rmitTelEndNo.val('');
            }
            
            if($rmitPostNo.val().trim().length < 1 || $rmitPostAddr.val().trim().length < 1 || $stnmRmitPostAddr.val().trim().length < 1){
                alert(MESSAGE.VALID_ADDR);
                return false;
            }
            
            $tempRmitDtlAddr.val(replaceStrAddress($tempRmitDtlAddr.val()));
            
            if($tempRmitDtlAddr.css('display') != 'none' && $tempRmitDtlAddr.val().length < 1){
                alert('배송지 상세주소를 입력하세요');
                $rmitDtlAddr.focus();
                return false; 
            }
            
            if(!!$tempRmitDtlAddr.val()) {
                var rmitDtlAddr = $rmitDtlAddr.val();
                var stnmRmitDtlAddr = $stnmRmitDtlAddr.val();
                if(!!rmitDtlAddr) {
                    rmitDtlAddr += ' ';
                }
                if(!!stnmRmitDtlAddr) {
                    stnmRmitDtlAddr += ' ';
                }
                $rmitDtlAddr.val(rmitDtlAddr + $tempRmitDtlAddr.val());
                $stnmRmitDtlAddr.val(stnmRmitDtlAddr + $tempRmitDtlAddr.val());
            }
            
            return true;
        },
        
        checkTextAreaLength : function(str) {
            if(str.length <= mmypage.orderDetail.textAreaMaxLength) return str;
            
            alert('배송메시지는 '+mmypage.orderDetail.textAreaMaxLength+'자까지만\r\n입력가능합니다.');
            
            str = str.substr(0, mmypage.orderDetail.textAreaMaxLength);
            
            return str;
        },
        
        setAddDlvpYn : function(){
            var addYn = $('#add-dlvp-check').is(':checked') ? 'Y' : 'N';
            
            $('#add-dlvp-yn').val(addYn);
        },
        
        checkDlvpTotalCount : function(){
            _ajax.sendJSONRequest('GET'
                    ,_baseUrl + 'mypage/getDlvpTotalCountJSON.do'
                    ,{}
                    ,mmypage.orderDetail.getDlvpTotalCountJSONCallback
                    ,false
            );  
        },
        
        getDlvpTotalCountJSONCallback : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
            
            if(Number(data) >= 20){
                alert('내 배송지는 20개 이상 등록될 수 없으므로\r\n내 배송지 목록 저장을 해제해주세요');
                mmypage.orderDetail.excute = false;
                return;
            }
                
            $('#detail-form').attr('method', 'POST')
                             .attr('action', _baseUrl + 'mypage/changeDelivery.do')
                             .submit();
        },
        
        doChangeDelivery : function(){
            var that = mmypage.orderDetail;
            
            var section = '';
            
            if(that.getTabId() == 'new'){
                section = that.getTabId() + '-';
            }
            
            if(!common.loginChk()){
                return;
            }
            
            if(that.excute){
                alert('처리중입니다 잠시만 기다려주세요.');
                return;
            }
            
            that.excute = true;
            
            if(!that.validator()){
                that.excute = false;
                return;
            } 
            
            that.setAddDlvpYn();
            
            _ajax.sendRequest('POST'
                ,_baseUrl + 'mypage/checkChangeDeliveryJSON.do'
                ,{ 
                    rmitPostNo    : $('#'+section+'post-no').val(),
                    orgRmitPostNo : $('#org-rmit-post-no').val(),
                    ordNo         : $('#ord-no').val()
                 }
                , function(res){
                    var possible = (typeof res !== 'object') ? $.parseJSON(res) : res;
                    
                    if(possible && possible == 'Y'){
                        if($('#add-dlvp-check').is(':checked')){
                            that.checkDlvpTotalCount();
                        }else{
                            $('#detail-form').attr('method', 'POST').attr('action', _baseUrl + 'mypage/changeDelivery.do').submit();
                        }
                    }else{
                        alert('배송비가 변경되는 경우 배송지를 변경할 수 없습니다.');
                        
                        that.excute = false;
                        
                        return;
                    }
                    
                }
                , false
            );
        },
        /*
        setTabParams : function(obj){
            var $rmitPostNo       = $('#rmit-post-no')
               ,$rmitBaseAddr     = $('#rmit-base-addr')
               ,$rmitPostAddr     = $('#rmit-post-addr')
               ,$stnmRmitPostAddr = $('#stnm-rmit-post-addr');
            
            var section = '';
            
            if(obj.id == 'new'){
                section = 'new-';
            }
            
            $rmitPostNo.val($('#'+section+'post-no').val());
            $rmitBaseAddr.val($('#'+section+'rmit-post-addr-text-value').text());
            $rmitPostAddr.val($('#'+section+'rmit-post-addr-text-value').text());
            $stnmRmitPostAddr.val($('#'+section+'rmit-post-road-text-value').text());
        },
        */
        /*
        goGoodsAssessmentList : function(){
            // [상품평개편] 클릭 지표 추가 - 2019.4.11
            // 주문/배송조회(List) > [Popup] 주문상세정보 > 상품평쓰기
            try{    
                common.wlog("orderpop_gdas_write");
            }catch(e){}
            
            $(location).attr('href', _baseUrl + 'mypage/getGdasList.do');
        },
        */
        goGoodsAssessmentList : function(obj){
            // [상품평개편] 상품평쓰기 클릭 지표 추가 - 2019.4.11
            // 주문/배송조회(List) > [Popup] 주문상세정보 > 상품평쓰기
            try{
                common.wlog("orderpop_gdas_write");
            }catch(e){}
            //$(location).attr('href', _baseUrl + 'mypage/getGdasList.do');
            var params = $(obj).data();
            /* 문구 추가 */
            if(params.ordConYn == "Y") {
                alert("해당 상품은 부분 교환된 상품입니다. 교환전 또는 교환후 상품 중 1개의 상품평만 작성 가능합니다.");
            }
            var param = '?goodsNo=' + params.goodsNo + '&itemNo=' + params.itemNo + '&ordNo=' + params.ordNo + '&ordGoodsSeq=' + params.ordGoodsSeq +  '&gdasSctCd=10'+
            '&retUrl=' + $(location).attr('href');
            console.log( '  param = ' + param);
            
            $(location).attr('href', _baseUrl + 'mypage/getGdasList.do' + param);
        },
        
        goList : function(){
            $(location).attr('href', _baseUrl + 'mypage/getOrderList.do');
        },
        
        searchTrackingPop : function(obj){
            common.setScrollPos2();//클릭 시, 스크롤 위치값 localstorage 저장
            var params = $(obj).data();
            
            if(params.tradeShpCd == '1'){
                $('#pop-full-contents').html('');
                
                $('#pop-full-contents').load(_baseUrl + 'mypage/popup/getDeliveryDetail.do', params, function(){
                    
                    common.popFullOpen('배송조회');
                });
                
            }else{
                
                if(!params.hdcCd || !params.invNo){
                    alert('시스템 오류로 운송장번호가 조회되지 않고 있으니\r\n1:1상담 또는 고객센터(1522-0882)로 문의주세요.');
                    return;
                }
                
                window.open(HDC_PATH[params.hdcCd] + params.invNo.toString(), '_blank');
            }
        },
        
        storeRequestCancel : function(obj){
            if(mmypage.orderDetail.excute){
                alert('처리중입니다 잠시만 기다려주세요.');
                return;
            }
            
            var params = $(obj).data()
               ,message = '신청을 취소하시겠습니까?';
            
            if(!confirm(message)){
                
                mmypage.orderDetail.excute = false;
              
                return;
            } 
            
            mmypage.orderDetail.excute = true;
            
            _ajax.sendJSONRequest('POST'
                    , _baseUrl + 'mypage/registeredStoreRequestCancelJSON.do'
                    , params
                    , mmypage.orderDetail.requestCancelCallback
                    , false
            );
        },
        
        requestCancel : function(obj){
            if(mmypage.orderDetail.excute){
                alert('처리중입니다 잠시만 기다려주세요.');
                return;
            }
            
            var params = $(obj).data()
               ,message = {
                    20 : '신청을 취소하시겠습니까?',
                    30 : '신청을 취소하시겠습니까?',
                    40 : '신청을 취소하시겠습니까?'
                };
            
            if(!confirm(message[params.chgAccpSctCd])){
                
                mmypage.orderDetail.excute = false;
              
                return;
            } 
            
            mmypage.orderDetail.excute = true;
            
            _ajax.sendJSONRequest('POST'
                    , _baseUrl + 'mypage/registeredRequestCancelJSON.do'
                    , params
                    , mmypage.orderDetail.requestCancelCallback
                    , false
            );
        },
        
        requestCancelCallback : function(res){
            
            var data = (typeof res.data !== 'object') ? $.parseJSON(res.data) : res.data;
            
            if(res.message == '0000'){
                
                if(data.reqPsblYn == 'Y'){
                    location.reload();
                }else{
                    alert('이미 처리중인 건이므로 취소하실 수 없습니다.');
                    
                    mmypage.orderDetail.excute = false;
                    
                    return;
                }
            }else{
                alert('처리중 오류가 발생했습니다.\r\n잠시후 다시 시도해주세요.');
                
                mmypage.orderDetail.excute = false;
                
                location.reload();
            }
        },
        
        goOrderCancelForm : function(chgAccpSctCd, tradeShpCd, ordDtlSctCd, ordPrgsStatCd, promNo, adtnCostNos){
            var clmUrl = {
                    20 : 'mypage/getCancelForm.do'
                   ,30 : 'mypage/getReturnForm.do'
                   ,40 : 'mypage/getChangeForm.do'    
            };
            
            var ordNo = $('#ord-no').val();
           
            if(chgAccpSctCd == '20'){
                if(!mmypage.orderList.getPresentAcceptStatCdJSON(ordNo)){
                    return false;
                }
            }
            
            if(!promNo || !adtnCostNos){
                $(location).attr('href', _baseUrl + clmUrl[chgAccpSctCd] + '?ordNo='+ $('#ord-no').val()+'&chgAccpSctCd='+chgAccpSctCd);
                return false;
            }
            
            var params = {
                    ordNo         : $('#ord-no').val(),
                    tradeShpCd    : tradeShpCd,
                    ordDtlSctCd   : ordDtlSctCd,
                    ordPrgsStatCd : ordPrgsStatCd,
                    promNo        : promNo,
                    adtnCostNos   : adtnCostNos,
                    chgAccpSctCd  : chgAccpSctCd
                },
                
                message = {
                    20 : '행사 상품은 구매하신 모든 상품이 상품발송전에만 취소 신청 가능합니다.',
                    30 : '행사 상품은 구매하신 모든 상품이 배송완료 된 후 반품 신청 가능합니다.',
                    40 : '행사 상품은 구매하신 모든 상품이 배송완료 된 후 교환 신청 가능합니다.'
                };
            
            _ajax.sendRequest('POST'
                    , _baseUrl + 'mypage/getPromGoodsCancelPossibleJSON.do'
                    , params
                    , function(res){
                        if(!res.succeeded){
                            
                            alert(res.message);
                            
                            return;
                        }
                        
                        var data = (typeof res.data !== 'object') ? $.parseJSON(res.data) : res.data;
                        
                        if(data.reqPsblYn != 'Y'){
                            alert(data.buyCondStrtQtyAmt + '+1 ' + message[params.chgAccpSctCd]);
                            return;
                        }
                        
                        $(location).attr('href', _baseUrl + clmUrl[chgAccpSctCd] + '?ordNo='+ $('#ord-no').val()+'&chgAccpSctCd='+chgAccpSctCd);
                        
                        return false;
                    }
                    , false
            );
            
        },
        
        showCancelCausInfo : function(obj){
            var params = $(obj).data()
               ,popTitle = {
                20 : '주문취소 상세정보',
                30 : '반품 상세정보',
                40 : '교환 상세정보'
            };
            
            // 주문/배송조회 UI 개선으로 DS 지표 추가 = [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
            common.wlog("mypage_return_barcode");

            common.setScrollPos2();//클릭 시, 스크롤 위치값 localstorage 저장
            $('#pop-full-contents').html('');
            
            $('#pop-full-contents').load(_baseUrl + 'mypage/popup/getCancelCausPop.do', params, function(){
                
                common.popFullOpen(popTitle[params.chgAccpSctCd == '' ? params.ordDtlSctCd : params.chgAccpSctCd]);
                
                //자세히보기 버튼 클릭시 매장반품주문에 대한 바코드 처리
                var rtnBarcode = $("#rtnBarcode").text();
        		if(rtnBarcode != ""){
        			if(rtnBarcode != "N"){
        				$(".barcode").barcode(rtnBarcode, "code128",{barWidth:2, barHeight:75, fontSize:14});
        			}else{
        				alert("비정상적인 접근입니다.");
        				fnLayerSet('layer_pop_wrap', 'close');
        			}
        		}
            });
        },
        
        showRefundInfoPop : function(ordNo){
            $('#LAYERPOP01-contents').html('');
            
            $('#LAYERPOP01-title').text('주문 취소/반품 신청이력');
            
            $('#LAYERPOP01-contents').load(_baseUrl + 'mypage/popup/getRefundInfoPop.do', {ordNo : ordNo}, function(){
                
                common.popLayerOpen('LAYERPOP01');
            });
        },
        
        showOptionChangePop : function(obj){
            
            if(!common.loginChk()) return;

            $('#LAYERPOP01-contents').html('');
            
            $('#LAYERPOP01-title').text('옵션 선택');
            
            $('#LAYERPOP01-contents').load(_baseUrl + 'mypage/popup/getOptionChangePop.do?' + $.param($(obj).data()), {}, function(){
                
                common.popLayerOpen('LAYERPOP01');
                
            });
        },
        
        /* 선물 수령인에게 메시지 재발송 카카오 알림톡 보내기 */
        pushKakaotalkPresent : function(ordNo){
            var _pushKakaotalkPresent = mmypage.orderDetail.pushKakaotalkPresent;
            mmypage.orderDetail.pushKakaotalkPresent = function(){
                //console.log('중복 클릭 방지 함수 바꾸기');
                return false;
            };
            
            if(common.isLogin() == false){
                if(!confirm("해당 서비스는 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")){
                    return false;
                }else{
                    common.link.moveLoginPage();
                    return false;
                }
            }else{
                _ajax.sendRequest('POST'
                        , _baseUrl + 'mypage/getPresentAcceptStatCdJSON.do'
                        , { ordNo   :   ordNo }
                        , function(res){
                            /*선물하기가 아닐시 재발송 버튼이 노출 되지 않기떄문에 Status로 분기 */
                            if(res.presentAcceptStatCD == '10'){
                                $.ajax({
                                    type: "GET",
                                    url: _baseUrl + "mypage/pushKakaotalkPresent.do",
                                    data: { ordNo : ordNo },
                                    dataType : 'json',
                                    async: false,
                                    cache: false,
                                    success: function(res) {
                                        //콜백을 만들던지 해야함 필요하면
                                        alert(res.result);
                                    },
                                    complete: function(res){
                                        //console.log("complete!");
                                    },
                                    error: function(res) {
                                        alert("알림톡 발송중 오류가 발생하였습니다.");
                                    }
                                });
                            }else{
                                if(res.presentAcceptStatCD == '20'){
                                    alert("선물 수락이 완료되어 메세지를 보낼 수 없습니다.");
                                }else if(res.presentAcceptStatCD == '30' || res.presentAcceptStatCD == '60'){
                                    alert("선물이 거절되어 메세지를 보낼 수 없습니다.");
                                }else if(res.presentAcceptStatCD == '40'){
                                    alert("주문자에 의해 선물이 취소되어 메세지를 보낼 수 없습니다.");
                                }else if(res.presentAcceptStatCD == '50'){
                                    alert("수락 기한이 만료되어 메세지를 보낼 수 없습니다.");
                                }else{
                                	alert("정상적으로 메세지를 보낼 수 없습니다.");
                                }
                            }
                        }
                        ,false       //비동기 제어 
                     );
            }
            
            // 함수 원복
            setTimeout(function(){
                mmypage.orderDetail.pushKakaotalkPresent = _pushKakaotalkPresent;
            }, 300);
        }
};

$.namespace('mmypage.orderCancel');
mmypage.orderCancel = {
        isExcute : false,
        
        validationExcute : false,
        
        rfdBnkCdForBypass : "",

        textAreaMaxLength : 50,
        
        getGoodsList : $('#goods-area').children(),
        
        getGoodsListSize : 0,
        
        isSuperCharge : false,

        dlvpAmtYn : false,
        
        getGoodsInfo : function(index){
            return mmypage.orderCancel.getGoodsList.filter(function(){
                return Number(this.id.replace(/(goods|-)/gi, '')) == index 
            });
        },
        
        getSamePromGoodsList : function(goods){
            return $('#goods-area').children().filter(function(){
                return (($(this).data().promNo && $(this).data().promNo == goods.data().promNo) && ($(this).data().adtnCostNos && $(this).data().adtnCostNos == goods.data().adtnCostNos)) 
                || $(this).data().goodsIdx == goods.data().goodsIdx
            });
        },
        
        init : function(){
            /* LHS 오픈제외
            if(ALL_CANCEL_PROCESS_YN == 'Y') this.allCancelInfoPop();
            */
            this.bindSelectboxEvent();
            
            this.bindDeliveryListEvent();
            
            this.bindClmCausEvent();
            
            this.bindClmCausContEvent();
            
            this.bindRefundListEvent();
            
            this.bindZipcodePopEvent();
            
            this.getGoodsListSize = this.getGoodsList.last().data("goods-idx") + 1;
            
            mmypage.orderCancelStore.init();
            
            this.bindStoreRefundEvent();
        },
        
        //매장반품 관련 event 처리
        bindStoreRefundEvent : function(){
        	$('input:radio[name="returnSp"]').change(function(e){
        		e.preventDefault();
        		var returnSp = $(this).val();
        		if(returnSp == "1"){
        			
        			//위수탁제품 반품 불가 처리 해제
            		var goodsCnt = $("#goods-area > li").length;
            		for(var i=0; i < goodsCnt; i++){
            			var $li = $("#goods-area > li").eq(i);
            			var tradeShpCd = $li.attr("data-trade-shp-cd");
            			
            			if(tradeShpCd == "3"){
            				var obj = $("#check-"+i); 
            				$("#check-"+i).prop("checked", true);
            				$("#check-"+i).prop("disabled", false);
            				
            				var idx           = i
            					,checked      = true
            					,chgAccpSctCd = $('#chg-accp-sct-cd').val()
            					,that         = mmypage.orderCancel;
            				
            				var $goods      = that.getGoodsInfo(idx)
            					,nPromExist = $goods.data().promCnt > 1 && $goods.data().promNo ? true : false;
            					
            				mmypage.orderCancel.fn_ckDistinctNode(obj);
            				that.clmCausChecker($('#clm-caus-cd option:selected'));
            				mmypage.orderCancel.fn_CalcGoodsList(idx);
            			}
            		}
            		
            		$ul = $("#cnclNotice > ul");
            		$ul.empty();
            		$li1 = $("<li>").html("단순변심, 주문오류, 상품불만족 등 고객 귀책 사유로 반품 신청하실 경우, 반품비용이 환불금액에서 차감됩니다.");
            		$li2 = $("<li>").text("고객 귀책 사유로인한 반품으로 주문시 적용되었던 무료배송 조건이 해제되는 경우, 초도 배송비도 함께 차감됩니다.");
            		$ul.append($li1).append($li2);
            		
            		//매장방문안내 숨김
            		$(".info_return_box").hide();
            		$("#cnclNotice").removeClass();
            		$("#cnclNotice").addClass("grayBox6 bg");
            		
            		//회수지정보 숨김처리 해제 
            		$(".orderGroup").fadeIn();
            		$(".returnPop").hide();
            		
        		}else{
        			//고객등급 및 오늘드림 주문여부 체크
            		var targetChk = false;
            		var mbrGradeCd = $("#mbr-grade-cd").val();
            		var quickYn = $("#quickYn").val();
            		var _allCancelTextYn = "N";
            		
            		if(quickYn == "Y" || (mbrGradeCd == '50' || mbrGradeCd == '55' || mbrGradeCd == '60')){
            			targetChk = true;
            		}else{
           				targetChk = false;
            		}
            		//결제수단 체크 
            		var paymentChk = false;
            		var paymentCnt = $("#paymentCnt").val();
            		for(var i=0;i < paymentCnt; i++){
            			var pmtCd = $("#paymentCd_"+i).val();
            			
            			if(pmtCd == "23" || pmtCd == "24"){
            				_allCancelTextYn = "Y";
            			}
            			
            			if(pmtCd == "11" || pmtCd == "25" || pmtCd == "26" || pmtCd == "12" || pmtCd == "31"){
            				paymentChk = true;
            			}else{
            				paymentChk = false;
            				break;
            			}
            		}
            		
            		//부분반품 불가건 이며 위수탁 주문이 포함된 주문 체크 
            		var multiChk1 = false;
            		var multiChk2 = false;
            		var _cjMemberDscntAmt = $("#cjMemberDscntAmt").val();
            		var _cjDscntAmt = $("#cjDscntAmt").val();
            		
            		if(_cjMemberDscntAmt > 0 || _cjDscntAmt > 0 || _allCancelTextYn == 'Y'){
            			multiChk1 = true;
            		}
            		
            		var goodsCnt = $("#goods-area > li").length;
            		for(var i=0; i < goodsCnt; i++){
            			var $li = $("#goods-area > li").eq(i);
            			var tradeShpCd = $li.attr("data-trade-shp-cd");
            			
            			if(tradeShpCd == "3"){
            				multiChk2 = true;
            			}
            		}
            		
            		if(!targetChk || !paymentChk || (multiChk1 && multiChk2)){
            			var msg = "";
            			if(!paymentChk){msg = "신용카드, 페이코, 카카오페이 결제 주문만 선택 가능합니다.";}
            			else if(!targetChk){msg = "Green Olive 이상 등급만 선택 가능합니다.";}
            			else if(multiChk1 && multiChk2) {msg = "업체배송 상품이 포함된 제휴카드 주문은 매장 반품으로 접수할 수 없습니다.";}
            			
            			alert(msg);
            			$(this).prop("checked", false);
            			$("#returnSp1").prop("checked", true);
            			return;
            		}
            		
            		//위수탁 제품 반품 불가 처리  
            		for(var i=0; i < goodsCnt; i++){
            			var $li = $("#goods-area > li").eq(i);
            			var tradeShpCd = $li.attr("data-trade-shp-cd");
            			
            			if(tradeShpCd == "3"){
            				var obj = $("#check-"+i); 
            				$("#check-"+i).prop("checked", false);
            				$("#check-"+i).prop("disabled", true);
            				
            				var idx           = i
            					,checked      = false
            					,chgAccpSctCd = $('#chg-accp-sct-cd').val()
            					,that         = mmypage.orderCancel;
            				
            				var $goods      = that.getGoodsInfo(idx)
            					,nPromExist = $goods.data().promCnt > 1 && $goods.data().promNo ? true : false;
            					
            				mmypage.orderCancel.fn_ckDistinctNode(obj);
            				that.clmCausChecker($('#clm-caus-cd option:selected'));
            				mmypage.orderCancel.fn_CalcGoodsList(idx);
            			}
            		}
            		
            		$ul = $("#cnclNotice > ul");
            		$ul.empty();
//            		$span1 = $("<span>").addClass("imp").text("알림톡을 받으신 후 매장에 방문해주시면 됩니다.");
//            		$span2 = $("<span>").addClass("impB").text("반품 바코드는 올리브영 모바일 App에서 확인하실 수 있습니다.");
//            		$li1 = $("<li>").html("반품 신청 후 접수가 완료되면 알림톡이 발송되며, ").append($span1);
//            		$li2 = $("<li>").html("알림톡을 받으신 후 5일 이내에 매장 방문해주셔야 합니다.");
//            		$li3 = $("<li>").html("매장 방문 시 반품 바코드를 제시해주시면 됩니다.<br>").append($span2);
//            		$li4 = $("<li>").html("반품으로 인해 무료배송 조건이 해제된 경우, 초도 배송비가 환불금액에서 차감됩니다.");
//            		$ul.append($li1).append($li2).append($li3).append($li4);
            		$li1 = $("<li>").html("반품으로 인해 무료배송 조건이 해제된 경우, 초도 배송비가 환불금액에서 차감됩니다.");
            		$ul.append($li1);
            		
            		//회수지정보 숨김처리 
            		$(".orderGroup").fadeOut();
            		$(".returnPop").show();
            		//매장방문안내 숨김처리 해제
            		$(".info_return_box").show();
            		$("#cnclNotice").removeClass();
            		$("#cnclNotice").addClass("grayBox6 bgw");
        		}
        	});
        },
        
        checkTextAreaLength : function(str) {
            var that = mmypage.orderCancel;
            
            if(str.length <= that.textAreaMaxLength) return str;
            
            alert('사유는 '+that.textAreaMaxLength+'자까지만\r\n입력가능합니다.');
            
            str = str.substr(0, that.textAreaMaxLength);
            
            return str;
        },
        
        bindZipcodePopEvent : function(){
            $('#search-zipcode-pop, #rtn-search-zipcode-pop').click(function(){

                common.setScrollPos2();//클릭 시, 스크롤 위치값 localstorage 저장
                var fnCallback = (this.id == 'rtn-search-zipcode-pop')
                               ? 'selectedRtnZipcodeCallback' : 'selectedZipcodeCallback';
                
                $('#pop-full-contents').html('');
                
                $('#pop-full-contents').load(_baseUrl + 'common/popup/searchZipcodePop.do', function(){
                    
                    common.popFullOpen('우편번호 찾기', mcommon.popup.zipcode.popupClear);
                    
                    mcommon.popup.zipcode.init(eval('mmypage.orderCancel.' + fnCallback));
                });
            });
        },
        
        bindRefundListEvent : function(){
            
            var chgAccpSctCd = $('#chg-accp-sct-cd').val();
            
            if(chgAccpSctCd != '20') return;
            
            $('select[name="arrOrdQty"]').change(function(selectbox){
                mmypage.orderCancel.refundListDisplayer();
            });
        },
        
        bindClmCausContEvent : function(){
            
            $('textarea[name="clmCausCont"]').on('input keyup paste change', function(){
                $(this).val(mmypage.orderCancel.checkTextAreaLength($(this).val()));
                
                $('#clm-caus-cont').val($(this).val());
                
                $('#clm-caus-cont-length').text($(this).val().length);
            });
        },
        
        bindClmCausEvent : function(){
            $('#clm-caus-cd').change(function(selectbox){
                mmypage.orderCancel.clmCausChecker($('option:selected', this))
            });
        },

        clmCausChecker : function(selected){
            var that    = mmypage.orderCancel
               ,message = {
                    elapsed : {
                        30 : '반품기간이 경과하여 반품신청이 불가합니다.',
                        40 : '교환기간이 경과하여 교환신청이 불가합니다.'
                    },
                    goods : {
                        20 : '취소하실 상품을 선택해주세요.',
                        30 : '반품하실 상품을 선택해주세요.',  
                        40 : '교환하실 상품을 선택해주세요.'  
                    }
            };
            
            if(that.validationExcute) return;
            
            that.validationExcute = true;
            
            var chgAccpSctCd = $('#chg-accp-sct-cd').val()
               ,limitDay     = $(selected).data().limitDay
               ,openYn       = $(selected).data().showOpenYn
               ,causContYn   = $(selected).data().showCausCont
               ,elapsedDay   = 0
               ,isElapsed    = false;
            
            if(selected.val() == ''){
                $('#clm-caus-cont-area').addClass('hide');
                $('div .open_data').addClass('hide');
                $(".filebox").attr("style","display:none");
                $(".area_file").attr("style","display:none");
                that.validationExcute = false;
                
                return;
            }
            
            for(var i=0; i<this.getGoodsListSize; i++) {
//            $.each(this.getGoodsListSize, function(i, li){
                var $objGoods = $("#goods-"+i);
                if(!isElapsed && Number(that.getCheckedCount()) < 1){
                	
                	if($('input:radio[name="returnSp"]:checked').val() != "2"){
                		alert(message.goods[chgAccpSctCd]);
                	}
                    
                    $('#clm-caus-cd').val('');
                    
                    causContYn = 'N';
                    
                    that.validationExcute = false;
                    break;
//                    return false;
                }
                /*
                 * 교환반품 접수 자동화 개봉여부 삭제 2019.09.03 choi.j.h
                 * 
                 */ 
                if(!$('#check-' + i).is(':checked')){
                    //$('#open-yn-area-' + $objGoods.data().goodsIdx).addClass('hide');
                    continue;
//                    return true;
                }
                
                elapsedDay = that.getGoodsInfo($objGoods.data().goodsIdx).data().elapsedDay;

                /* ■■■■■ 제한날짜를 경과하지 않은 경우 ■■■■■ */
                if(chgAccpSctCd == '20' || Number(limitDay) >= Number(elapsedDay)){
                    
                    /* ■■■■■ 개봉여부 ■■■■■
                     * 교환반품 접수 자동화 개봉여부 삭제  2019.09.03 choi.j.h 
                    if(openYn == 'Y'){
                        $('#open-yn-area-' + $objGoods.data().goodsIdx).removeClass('hide');
                    }else{
                        $('#open-yn-area-' + $objGoods.data().goodsIdx).addClass('hide');
                    }
                    */
                }else{
                    
                    isElapsed = true;
                    
                    /* ■■■■■ 체크박스 해제 ■■■■■ */
                    $('#check-' + i).click();
                    
                    /* ■■■■■ 개봉여부 숨김 ■■■■■ 
                     *  2019.09.03 choi.j.h
                     *
                    if(!$('#open-yn-area-' + $objGoods.data().goodsIdx).hasClass('hide'))
                        $('#open-yn-area-' + $objGoods.data().goodsIdx).addClass('hide');
                    */
                }
            }//);
            
            if(isElapsed){
                alert(message.elapsed[chgAccpSctCd]);
                
                $('#clm-caus-cd').val('');
            }else{
                if(causContYn == 'Y'){
                    $('#clm-caus-cont-area').removeClass('hide');
                    $(".filebox").attr("style","display:");
                    if ($(".ql-image").val().isEmpty()) {
                        $(".area_file").attr("style","display:none");
                    } else {
                        $(".area_file").attr("style","display:");
                    }   
                        
                }else{
                    $('#clm-caus-cont-area').addClass('hide');
                    $(".filebox").attr("style","display:none");
                    $(".area_file").attr("style","display:none");
                }
            };
            
            that.validationExcute = false;
        },
        
        refundListDisplayer : function(){
            /*
            var isCancelAll = mmypage.orderCancel.isCancelAll()
               ,$refundList = $('#refund-list');
         
            if(ALREADY_CANCEL_CNT == 0 && GOODS_ALL == 'Y' && isCancelAll){
                $refundList.find('li').not('.noData').removeClass('hide');
                $refundList.find('li.noData').addClass('hide');
            }else{
                $refundList.find('li').not('.noData').addClass('hide');
                $refundList.find('li.noData').removeClass('hide');
            }
             */
        },
        
        revitalizer : function(obj){
            var idx          = $(obj).data('idx')
               ,checked      = $(obj).is(':checked')
               ,chgAccpSctCd = $('#chg-accp-sct-cd').val()
               ,that         = mmypage.orderCancel;
            
            var $goods     = that.getGoodsInfo(idx)
               ,nPromExist = $goods.data().promCnt > 1 && $goods.data().promNo ? true : false;
               
//             nPromExist && that.nPromtionChecker(checked, $goods.data());
               
//             that.goodsDisabler();
             this.fn_ckDistinctNode(obj);

//             if(chgAccpSctCd == '20') that.refundListDisplayer();
                 
             that.clmCausChecker($('#clm-caus-cd option:selected'));

//             this.fn_setGoods($(obj).parent().parent());
             this.fn_CalcGoodsList(idx);
        }
        , fn_ctrlQty : function(idx, nPromYn) {
//          console.log('# fn_ctrlQty # 함수 호출');

            var $obj    = $("#ord-tot-"+idx);
            var salePrc = $("#sale-prc-"+idx).val();// 판매가
            var qty     = $("#ord-qty-"+idx).val(); // 수량
            // 수량 설정
            this.getGoodsInfo(idx).find("input[name=arrOrdQty]").eq(0).val(qty);
            var buyCondStrtQtyAmt = Number($("#buy-cond-strt-qty-amt-"+idx).val());
            var totBuyQty = this.fn_getGoodsQty(true, idx, true);
            var buyQty = this.fn_getGoodsQty(true, idx);
            if(totBuyQty % buyCondStrtQtyAmt == 0 && buyQty % buyCondStrtQtyAmt != 0) {
                alert(this.fn_alertSelectProm(buyCondStrtQtyAmt));
            }
            var preQty  = $("#org-qty-"+idx).val();
            var immedCpnAmt = $("#immed-cpn-amt-"+idx).val();
            var dsnAmt = salePrc * qty - (immedCpnAmt / preQty) * qty
            $obj.parent().find(".through").html(this.fn_addCommaWon(salePrc * qty),false,true);
            $obj.html(this.fn_addComma(dsnAmt));

            if('Y' == nPromYn) {
                var idxS = this.fn_getPromGoodsIndexS(idx);
                var idxE = this.fn_getPromGoodsIndexE(idx);
                var $objGet = $("#goods-"+idxE);
                var isOneGetGoods = 1 == $objGet.find(".getGoods").size();//idxE - idxS;
                if(isOneGetGoods) {
                    var changeGetQty = Math.floor(buyQty / buyCondStrtQtyAmt);
                    $objGet.find("select[name=arrPromQty]").val(changeGetQty);
                    $objGet.find("select[name=arrPromQty]").siblings("[name=arrOrdQty]").val(changeGetQty);
                }
            }
            this.fn_CalcGoodsList(idx);
        }
        , fn_alertSelectProm : function(buyCondStrtQtyAmt) {
//            console.log('# fn_alertSelectProm # 함수 호출');

            var chgAccpSctCd = {
                    20 : '취소'
                  , 30 : '반품'
                  , 40 : '교환'
            };
            var stateNm = chgAccpSctCd[$("#chg-accp-sct-cd").val()];
            return stateNm + '신청 건에 ' + buyCondStrtQtyAmt + '+1상품이 있습니다. 본품과 추가상품을 함께 ' + stateNm + '해주세요.';
        }
        , fn_CalcGoodsList : function(index, clmCausCd) {
//            console.log('# fn_CalcGoodsList # 함수 호출');
//            console.log(arguments);

            if('undefined' == typeof clmCausCd) {
                $("#clm-caus-cd").val("");
            }
            
            //기존 페이지가 완전히 그려지기 전에 선택한 값은 다시 초기화가 되기 때문에 기존페이지가 다 그려진 후 셀렉트 박스 선택 가능하게 만듬  
            $("#clm-caus-cd").prop("disabled", false);
            
            this.fn_changeClmCausCd(clmCausCd);
            // 금액 초기화
            this.fn_clearAmt();
            var cntCalc = 0;
            for(var i=0; i < this.getGoodsListSize; i++) {

//                if(index) {
//                    if('A' !== index) {
//                        if(0===cntCalc) {
//                            i=index;
//                        } else {
//                            continue;
//                        }
//                        cntCalc++;
//                    }
//                } else {
//                    if(0 != index) {
//                        continue;
//                    }
//                }
                var goodsIndex = this.fn_getPromGoodsIndexE(i);
                var $obj = $("#goods-"+goodsIndex);
//                var isNotNProm = 'N' == $("input[name=arrNPromYn]").eq(goodsIndex).val();
                var isProm = '' != $("#goods-"+goodsIndex).data("prom-no");

                var $check = $("#check-" + i);
                var isCheck = $check.is(":checked");
                
                if(!isProm || (isProm && goodsIndex != i)) {
                    if(isCheck) {
                        this.fn_changeQty(i, $("#goods-"+i).find("input[name=arrOrdQty]").val());
                        this.fn_ckDistinctNode($check, true);
                    } else {
//                        if(isNotNProm) {
//                        $obj.find("input[name=arrRowCheck]").siblings("[type=checkbox]").prop("checked", isCheck);
//                        }
                        if('0' == goodsIndex || goodsIndex) {
                            this.getGoodsInfo(i).find("input[name=arrUpdateYn]").val(!isCheck ? 'Y' : 'N');
                        }
                        this.fn_calcOrderCost();
                        this.fn_calcOrderDtl();
                    }
                } 
            }
        }
        ,getCheckedCount : function(){
            var checkedCount = 0;
            
            for(var i=0; i<this.getGoodsListSize; i++) {
//            $.each(mmypage.orderCancel.getGoodsList, function(i, li){
                var checked = $('#check-' + i).is(':checked');
                
                if(!checked) continue;
                
                checkedCount += 1;
            }//)
            
            return checkedCount;
        }
        ,openSelectedCheck : function(){
            var isChecked     = false
               ,chgAccpSctCd  = $('#chg-accp-sct-cd').val();
            
            /* ■■■■■ 취소 신청은 체크 제외 ■■■■■ */
            if(chgAccpSctCd == '20') return isChecked;
            
            $.each(mypage.orderCancel.getGoodsList, function(i, tr){
                var checked      = $('#check-' + i).is(':checked')
                   ,isPromGoods  = $(tr).hasClass('event') ? true : false;
                   /*        
                    * 교환반품 접수 자동화 개봉여부 삭제 2019.09.03 choi.j.h
                   ,isDisabled   = $(':radio[name="openYn-'+i+'"]').prop('disabled')
                   ,valueChecked = $(':radio[name="openYn-'+i+'"]:checked').length > 0 ? true : false;
                   
                   
                if(!checked || isPromGoods || isDisabled || valueChecked) return true;
                */ 
                if(!checked || isPromGoods ) return true;
                
                isChecked = true
                
                return false;
            })
            
            return isChecked;
        }
        ,openStatusCheck : function(){
            var isOpened     = false
               ,chgAccpSctCd = $('#chg-accp-sct-cd').val();
            
            /* ■■■■■ 취소 신청은 체크 제외 ■■■■■ */
            if(chgAccpSctCd == '20') return isOpened;
            
            for(var i=0; i<this.getGoodsListSize; i++) {
//            $.each(mmypage.orderCancel.getGoodsList, function(i, li){
                var checked = $('#check-' + i).is(':checked');
                /*
                 * 교환반품 접수 자동화 개봉여부 삭제 2019.09.03 choi.j.h
                 *
                   ,isHide  = $('#open-yn-area-'+i).hasClass('hide')
                   ,openYn  = $(':radio[name="openYn-'+i+'"]:checked').val(); 
                */   
                //if(!checked || isHide || openYn != 'Y') continue;//return true;
                if (!checked) continue;
                
                isOpened = true;
                
//                return false;
            }//)
            
            return isOpened;
        },
        
        isReasonSelected : function(){
            var selectedValue = $('#clm-caus-cd').val()
               ,option        = $('#clm-caus-cd option:selected'); 
         
            if(selectedValue == '') return false;
             
            if(option.data('showCausCont') != 'Y' || !$('textarea[name="clmCausCont"]').val().isEmpty()){
                return true;  
            }else{
                return false;  
            } 
        },
        
        isFileAttached : function(){
            var selectedValue = $('#clm-caus-cd').val()
               ,option        = $('#clm-caus-cd option:selected'); 
         
            if(selectedValue == '') return false;
             
            if(   option.data('showCausCont') == 'Y' && option.data('fileAttachYn') == 'Y'  && 
                 ( 
                     (common.app.appInfo.isapp && $("#fileName span").html().isEmpty())        
                  || (!common.app.appInfo.isapp && $(".ql-image").val().isEmpty())
                  )
            )     
            {
                return false;  
            }else{
                return true;  
            } 
        },
        
        isGoodsChecked : function(){
            var isChecked = false;
            
            for(var i=0; i<this.getGoodsListSize; i++) {
//            $.each(mmypage.orderCancel.getGoodsList, function(i, li){
                var checked = $('#check-' + i).is(':checked');
                
                if(!checked) continue;
                
                isChecked = true;
                
//                return false;
            }//)
            
            return isChecked;
        },

        isGoodsChgPsbChecked : function(){
            var isChecked     = true
            ,chgAccpSctCd = $('#chg-accp-sct-cd').val();
         
             /* ■■■■■ 교환신청만 체크 ■■■■■ */
             if(chgAccpSctCd != '40') return isChecked;

             for(var i=0; i<this.getGoodsListSize; i++) {
                 var checked = $('#check-' + i).is(':checked')
                    ,prgsStatCd  = $("#goods-" + i).data().prgsStatCd; // $(li).data().prgsStatCd; 
                    
                 if(!checked || prgsStatCd == '20') return true;
                 
                 isChecked = false
                 
                 return false;
             }
             
             return isChecked;
        },
        
        goodsDisabler : function(){
            $.each(mmypage.orderCancel.getGoodsList, function(i, li){
                var checked = $('#check-' + i).is(':checked');
                    
                if(checked){
                    $(li).find(':input').not(':checkbox').removeAttr('disabled');
                }else{
                    $(li).find(':input').not(':checkbox').attr('disabled','disabled');
                }
            })
        },
        
        nPromtionChecker : function(checked, goods){
            mmypage.orderCancel.getGoodsList.filter(function(){
                return ($(this).data().promNo == goods.promNo) && ($(this).data().adtnCostNos == goods.adtnCostNos) 
            }).children('.order_chk').find(':checkbox').attr('checked', checked);
        },
        
        isCancelAll : function(){
            var isAll = 'Y';
            
            $.each(mmypage.orderCancel.getGoodsList, function(i, li){
                var checked = $('#check-' + i).is(':checked')
                   ,isPromGoods = $(li).hasClass('event') ? true : false
                   ,totQty  = Number($(li).data().totRealQty)
                   ,reqQty  = Number($('#ord-qty-' + i).val());
                
                if(isPromGoods) return true;
                
                if(!checked){
                    isAll = 'N';
                    return false;
                }
                
                if(totQty != reqQty || totQty > reqQty){
                    isAll = 'N';
                    return false;
                }
            })
            
            return isAll == 'Y' ? true : false;
        },
        
        goBack : function(){
            history.back();
        },
        
        doExpireState : function(){
            var state = {
                    isExpire : true, 
                    redirectUrl : _baseUrl + "mypage/getOrderCancelList.do"
            };
            
            try{
                
                $("#isExpire").val("Y");
                
                window.history.replaceState(state, null);
            } catch(e) {}
            
            $(window).bind("pageshow", function(event){
                // history.back 으로 왔을 때만
                if(event.originalEvent.persisted) {
                    if($("#isExpire").val() == "Y"){
                        setTimeout(function(){
                            alert("이용이 만료된 페이지입니다.");
                        }, 200);
                        setTimeout(function(){
                            document.location.replace(state.redirectUrl);
                        }, 500);
                        return false;
                    }
                }
            });
        },
        
        doCancel : function(){
            if(mmypage.orderCancel.isExcute){
                alert('처리중입니다 잠시만 기다려주세요.');
                
                return;
            }
            
            mmypage.orderCancel.isExcute = true;
            
            var chgAccpSctCd = $('#chg-accp-sct-cd').val()
               ,checkedCount = mmypage.orderCancel.getCheckedCount();
            
            /* ■■■■■■■■■■ 재결제 체크 ■■■■■■■■■■ */
            var txtAaca = $("#ctrl_totAplyAdtnCostAmt").html();
            if(chgAccpSctCd == '20' && (this.fn_removeComma($("#ctrl_cnclTotAmt").val()) + (txtAaca ? this.fn_removeComma(txtAaca) : 0) < 0)) {
                alert('재결제가 필요한 주문입니다.\n문의 사항은 올리브영 고객센터(1522-0882)를 이용해 주세요.');
                this.isExcute = false;
                return;
            }

            var message = {
                    confirm : {
                        20 : {
                            Y : '주문취소를 하시겠습니까?',
                            N : '선택된 ' + checkedCount + '건 상품에 대해 부분취소를 하시겠습니까?'
                        },
                        30 : {
                            Y : '반품신청을 하시겠습니까?',
                            N : '선택된 일부 상품에 대해 반품신청을  하시겠습니까?'
                        },
                        40 : {
                            Y : '교환신청을 하시겠습니까?',
                            //N : '교환이 불가능한 상품이 포함되어 있습니다.\n불가상품을 제외하고 진행하시겠습니까?'
                            N : '선택된 일부 상품에 대해 교환신청을  하시겠습니까?' //교환접수 자동화 choi.j.h 2019.09.19
                        }
                    },
                    goods : {
                        20 : '취소하실 상품을 선택해주세요.',  
                        30 : '반품하실 상품을 선택해주세요.',  
                        40 : '교환하실 상품을 선택해주세요.'  
                    },
                    goodsStatus : {
                        40 : {
                            /*
                             * 교환접수 자동화 2019.09.17 choi.j.h
                            Y : '판매종료 상품이 있어 전체교환이 불가능합니다.\n고객센터(1522-0882)로 문의해주세요.',
                            N : '판매종료 상품은 교환이 불가능합니다.\n고객센터(1522-0882)로 문의해주세요.'
                            */
                            Y : '선택하신 상품은 현재 교환 접수가 불가능한 상태 입니다.\n(판매종료 및 재고부족 등)\n\n 추가로 안내가 필요하신 경우 \n 올리브영 온라인몰 고객센터(1522-0882)\n 또는 1:1 문의로 남겨주시면 신속하게\n 도움 드리겠습니다.',
                            N : '선택하신 상품은 현재 교환 접수가 불가능한 상태 입니다.\n(판매종료 및 재고부족 등)\n\n 추가로 안내가 필요하신 경우 \n 올리브영 온라인몰 고객센터(1522-0882)\n 또는 1:1 문의로 남겨주시면 신속하게\n 도움 드리겠습니다.',
                            
                        }
                    },
                    reason : {
                        20 : '취소사유를 선택(입력)해주세요.',  
                        30 : '반품사유를 선택(입력)해주세요.',  
                        40 : '교환사유를 선택(입력)해주세요.'  
                    },
                    openStatus : {
                        30 : '상품 개봉시 반품신청이 불가합니다.',  
                        40 : '상품 개봉시 교환신청이 불가합니다.'  
                    },
                    allCancel : {
                        20 : '주문상태가 변경되어 주문취소가 불가능합니다.',
                        30 : '주문상태가 변경되어 반품이 불가능합니다.',
                        40 : '주문상태가 변경되어 교환이 불가능합니다.'
                    }
            };
            
            /* ■■■■■■■■■■ 상품 선택 체크     ■■■■■■■■■■ */
            if(!this.isGoodsChecked()){
            	if($('input:radio[name="returnSp"]:checked').val() == "2"){
            		alert("제휴업체 배송상품은 매장방문 반품을 신청할 수 없습니다.");
            	}else{
            		alert(message.goods[chgAccpSctCd]);
            	}
                mmypage.orderCancel.isExcute = false;
                return;
            }
            
            /* ■■■■■■■■■■ 세트상품 체크 ■■■■■■■■■■ */
            if(this.fn_checkSetGoods()) {
                mmypage.orderCancel.isExcute = false;
                return;
            }

            /* ■■■■■■■■■■ I/F SYSTEM 체크       ■■■■■■■■■■ */
            if(chgAccpSctCd == '20' && ALL_CANCEL_PROCESS_YN == 'Y'){
                var msg = this.checkIFSystemJson();
                if(!!msg) {
                    alert(msg);
                    mmypage.orderCancel.isExcute = false;
                    return;
                }
            }

            /* ■■■■■■■■■■ 환불금액 0 체크 ■■■■■■■■■■ */
            if(chgAccpSctCd == '20' && (this.fn_removeComma($("#ctrl_cnclTotAmt").val()) + (txtAaca ? this.fn_removeComma(txtAaca) : 0) == 0) && this.fn_removeComma($("#ctrl_totPayAmt").html()) == 0) {
                alert('취소 할 수 없는 주문입니다.\n문의 사항은 올리브영 고객센터(1522-0882)를 이용해 주세요.');
                this.isExcute = false;
                return;
            }
            
            /* ■■■■■■■■■■ 상품 상태 체크        ■■■■■■■■■■ */
            if(!this.isGoodsChgPsbChecked()){
                alert(message.goodsStatus[chgAccpSctCd][ALL_CANCEL_PROCESS_YN]);
                mmypage.orderCancel.isExcute = false;
                return;
            }
            
            /* ■■■■■■■■■■ 사유 선택 체크     ■■■■■■■■■■ */ 
            if(!this.isReasonSelected()){
                alert(message.reason[chgAccpSctCd]);
                mmypage.orderCancel.isExcute = false;
                return;
            }
            /* ■■■■■■■■■■ 첨부파일 업로드 체크     ■■■■■■■■■■ */ 
            if (!this.isFileAttached()) {
                alert("사진을 첨부해 주세요.");
                //common.popLayerOpen('layPhotoFile');
                mmypage.orderCancel.isExcute = false;
                return;
            }
            
            /* ■■■■■■■■■■ 상품 개봉여부 체크 ■■■■■■■■■■ 
             * 교환반품 자동 접수 2019.09.03 choi.j.h
            if(this.openStatusCheck()){
                alert(message.openStatus[chgAccpSctCd]);
                mmypage.orderCancel.isExcute = false;
                return;
            }
            */
            /* ■■■■■■■■■■ 회수지 체크        ■■■■■■■■■■ */
            if(chgAccpSctCd != '20' && !this.validateForRtnZipcode()){
                mmypage.orderCancel.isExcute = false;
                return;
            }
            
            /* ■■■■■■■■■■ 교환 배송지 체크        ■■■■■■■■■■ */
            if(chgAccpSctCd == '40' && !this.validateForZipcode()){
                mmypage.orderCancel.isExcute = false;
                return;
            }
            
//            if(!confirm(message.confirm[chgAccpSctCd][(this.isCancelAll() && ALREADY_CANCEL_CNT == 0 && GOODS_ALL == 'Y'? 'Y':'N')])){
            if(!confirm(message.confirm[chgAccpSctCd][CHG_ACCP_SCT_CD_YN])) {
                mmypage.orderCancel.isExcute = false;
                return;
            }
            
            var url = chgAccpSctCd == '20' // && this.isCancelAll() && ALREADY_CANCEL_CNT == 0 && GOODS_ALL == 'Y')
                    ? _baseUrl + 'mypage/cancelOrder.do' 
                    : _baseUrl + 'mypage/cancelRequest.do';
            
            /* ■■■■■■■■■■ WMS 주문 검수상태 체크 ■■■■■■■■■■ */
            if(!this.fn_callWmsStatus()) {
                mmypage.orderCancel.isExcute = false;
                return;
            }
            this.olonStatusCheckCnt = 0;
            
            if ($("#fileName span").text() != "") {
                //canvas에 선택한 이미지 draw
                var canvas = document.getElementById('canvas');                
                var ctx = canvas.getContext('2d');
                var uploadImg = canvas.toDataURL();
                
                
                var param = {
                    orgFileNm : $("#fileName span").text(),
                    imgFile : uploadImg
                };
                common.Ajax.sendRequest("POST"
                    , _baseUrl + "mypage/claimImgUploadJson.do"
                    , param
                    , function(res) {
                        if (res.trim() != "") {
                            if (res == "N") {
                                alert('파일 첨부 중 오류가 발생하였습니다.\n파일을 다시 첨부해 주십시오.');
                                $("#cnslFileErr").val("Y");
                                return;
                            }
                            
                            $("#cnslFileName").val($("#fileName span").text());
                            $("#cnslFileUrl").val(res.trim());
                        }
                    }
                    , false
                );
            }
            
            
            if(ALL_CANCEL_PROCESS_YN == 'Y' && GOODS_ALL == 'Y'){
                
                var params = {
                        ordNo        : $('#ord-no').val(),
                        chgAccpSctCd : chgAccpSctCd
                };
                
                _ajax.sendRequest('POST'
                        , _baseUrl + 'mypage/checkAllCancelPossibleJSON.do'
                        , params
                        , function(res){
                            var data = (typeof res.data !== 'object') ? $.parseJSON(res.data) : res.data;
                            
                            if(data.reqPsblYn != 'Y' || res.message != '0000'){
                                
                                alert(message.allCancel[params.chgAccpSctCd]);
                                
                                common.link.moveOrderList();
                                
                                mmypage.orderCancel.isExcute = false;
                                
                                return false;
                                
                            }else{
                                
                                if(typeof REFUND_ACCOUNT_YN != 'undefined' && REFUND_ACCOUNT_YN == 'Y'){
                                    
                                    if(!mmypage.orderCancel.validateForRfdAccount()){
                                        mmypage.orderCancel.isExcute = false;
                                        return;
                                    }
                                    
                                    mmypage.orderCancel.updateRfdAccountJSON();
                                    
                                }else{
                                    
                                    mmypage.orderCancel.doExpireState();
                                    
                                    $('#cancel-form').attr('method', 'POST').attr('action', url).submit();
                                }
                            }                            
                        }
                        , false
                );
                
            }else{
                if(typeof REFUND_ACCOUNT_YN != 'undefined' && REFUND_ACCOUNT_YN == 'Y'){
                    
                    if(!this.validateForRfdAccount()){
                        mmypage.orderCancel.isExcute = false;
                        return;
                    }
                    
                    this.updateRfdAccountJSON();
                    
                }else{
                    
                    mmypage.orderCancel.doExpireState();
                    
                    $('#cancel-form').attr('method', 'POST').attr('action', url).submit();
                    
                }
            }
            
            
            
            
        },
        
        validateForRfdAccount : function(){
            var $rfdAcctOwnMainNm = $('#rfd-acct-own-main-nm')
               ,$rfdBnkCd         = $('#rfd-bnk-cd-select')
               ,$rfdActn          = $('#rfd-actn');
            
            if($rfdAcctOwnMainNm.val().trim().length < 1){
                alert('예금주명을 입력하세요');
                $rfdAcctOwnMainNm.focus();
                return false;
            }
            
            if($rfdBnkCd.val().isEmpty()){
                alert('은행을 선택하세요');
                $rfdBnkCd.focus();
                return false;
            }
            
            if($rfdActn.val().trim().length < 1){
                alert('계좌번호를 입력하세요');
                $rfdActn.focus();
                return false;
            }
            
            if(!$.isNumeric($rfdActn.val())){
                alert('계좌번호는 숫자로 입력하세요');
                $rfdActn.val('');
                $rfdActn.focus();
                return false;
            }
            
            return true;
        },
        
        validateForZipcode : function(){
            var $rmitNm          = $('#rmit-nm')
               ,$rmitCellSctNo   = $('#rmit-cell-sct-no')
               ,$rmitCellTxnoNo  = $('#rmit-cell-txno-no')
               ,$rmitCellEndNo   = $('#rmit-cell-end-no')
               ,$rmitTelRgnNo    = $('#rmit-tel-rgn-no')
               ,$rmitTelTxnoNo   = $('#rmit-tel-txno-no')
               ,$rmitTelEndNo    = $('#rmit-tel-end-no')
               ,$rmitPostNo      = $('#rmit-post-no')
               ,$rmitPostAddr    = $('#rmit-post-addr')
               ,$stnmRmitPostAddr= $('#stnm-rmit-post-addr')
               ,$rmitDtlAddr     = $('#rmit-dtl-addr')
               ,$stnmRmitDtlAddr = $('#stnm-rmit-dtl-addr')
               ,$tempRmitDtlAddr = $('#temp-rmit-dtl-addr');
            
            $rmitNm.val(replaceStrXssAll($rmitNm.val()));
            if($rmitNm.val().trim().length < 1){
                alert(MESSAGE.VALID_MBR_NM);
                $rmitNm.focus();
                return false;
            }
            
            if($rmitCellSctNo.val().isEmpty()){
                alert(MESSAGE.VALID_CELL_SELECT);
                $rmitCellSctNo.focus();
                return false;
            }
            
            if($rmitCellTxnoNo.val().trim().length < 1){
                alert(MESSAGE.VALID_CELL_EMPTY);
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if($rmitCellTxnoNo.val().trim().length < 3){
                alert(MESSAGE.VALID_CELL_NUMBER);
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if(!$.isNumeric($rmitCellTxnoNo.val())){
                alert(MESSAGE.VALID_NOT_NUMBER);
                $rmitCellTxnoNo.val('');
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if($rmitCellEndNo.val().trim().length < 1){
                alert(MESSAGE.VALID_CELL_EMPTY);
                $rmitCellEndNo.focus();
                return false;
            }
            
            if($rmitCellEndNo.val().trim().length < 4){
                alert(MESSAGE.VALID_CELL_NUMBER);
                $rmitCellEndNo.focus();
                return false;
            }
            
            if(!$.isNumeric($rmitCellEndNo.val())){
                alert(MESSAGE.VALID_NOT_NUMBER);
                $rmitCellEndNo.val('');
                $rmitCellEndNo.focus();
                return false;
            }
            
            if($rmitTelRgnNo.val().isEmpty() || $rmitTelTxnoNo.val().trim().length < 3 || $rmitTelEndNo.val().trim().length < 4){
                $rmitTelRgnNo.val('');
                $rmitTelTxnoNo.val('');
                $rmitTelEndNo.val('');
            }else{
                if(!$.isNumeric($rmitTelTxnoNo.val())){
                    alert(MESSAGE.VALID_NOT_NUMBER);
                    $rmitTelTxnoNo.val('');
                    $rmitTelTxnoNo.focus();
                    return false;
                }
                
                if(!$.isNumeric($rmitTelEndNo.val())){
                    alert(MESSAGE.VALID_NOT_NUMBER);
                    $rmitTelEndNo.val('');
                    $rmitTelEndNo.focus();
                    return false;
                }
                
                if($rmitTelTxnoNo.val().trim().length < 3){
                    alert(MESSAGE.VALID_CELL_NUMBER);
                    $rmitTelTxnoNo.focus();
                    return false;
                }
                
                if($rmitTelEndNo.val().trim().length < 3){
                    alert(MESSAGE.VALID_CELL_NUMBER);
                    $rmitTelEndNo.focus();
                    return false;
                }
            }
            
            if($rmitPostNo.val().trim().length < 1 || $rmitPostAddr.val().trim().length < 1 || $stnmRmitPostAddr.val().trim().length < 1){
                alert(MESSAGE.VALID_ADDR);
                $rmitPostNo.focus();
                return false;
            }
            /*
            $rmitDtlAddr.val(replaceStrAddress($rmitDtlAddr.val()));
            if($rmitDtlAddr.val().trim().length < 1){
                alert('상세주소를 입력하세요');
                $rmitDtlAddr.focus();
                return false;
            }
            */

            $tempRmitDtlAddr.val(replaceStrAddress($tempRmitDtlAddr.val()));
            
            if($tempRmitDtlAddr.css('display') != 'none' && $.trim($tempRmitDtlAddr.val()).length < 1){
                    alert('배송지 상세주소를 입력하세요');
                    $rmitDtlAddr.focus();
                    return false;
            }
            
            if(!!$tempRmitDtlAddr.val()) {
                var rmitDtlAddr = $rmitDtlAddr.attr("orgvalue");
                var stnmRmitDtlAddr = $stnmRmitDtlAddr.attr("orgvalue");
                if(!!rmitDtlAddr) {
                    rmitDtlAddr += ' ';
                }
                if(!!stnmRmitDtlAddr) {
                    stnmRmitDtlAddr += ' ';
                }
                $rmitDtlAddr.val(rmitDtlAddr + $tempRmitDtlAddr.val());
                $stnmRmitDtlAddr.val(stnmRmitDtlAddr + $tempRmitDtlAddr.val());
            }
            
            return true;
        },
        
        validateForRtnZipcode : function(){
            var $rmitNm          = $('#rtn-rmit-nm')
               ,$rmitCellSctNo   = $('#rtn-rmit-cell-sct-no')
               ,$rmitCellTxnoNo  = $('#rtn-rmit-cell-txno-no')
               ,$rmitCellEndNo   = $('#rtn-rmit-cell-end-no')
               ,$rmitTelRgnNo    = $('#rtn-rmit-tel-rgn-no')
               ,$rmitTelTxnoNo   = $('#rtn-rmit-tel-txno-no')
               ,$rmitTelEndNo    = $('#rtn-rmit-tel-end-no')
               ,$rmitPostNo      = $('#rtn-rmit-post-no')
               ,$rmitPostAddr    = $('#rtn-rmit-post-addr')
               ,$stnmRmitPostAddr= $('#rtn-stnm-rmit-post-addr')
               ,$rmitDtlAddr     = $('#rtn-rmit-dtl-addr')
               ,$stnmRmitDtlAddr = $('#rtn-stnm-rmit-dtl-addr')
               ,$tempRmitDtlAddr = $('#rtn-temp-rmit-dtl-addr');

            $rmitNm.val(replaceStrXssAll($rmitNm.val()));
            if($rmitNm.val().trim().length < 1){
                alert(MESSAGE.VALID_MBR_NM);
                $rmitNm.focus();
                return false;
            }
            
            if($rmitCellSctNo.val().isEmpty()){
                alert(MESSAGE.VALID_CELL_SELECT);
                $rmitCellSctNo.focus();
                return false;
            }
            
            if($rmitCellTxnoNo.val().trim().length < 1){
                alert(MESSAGE.VALID_CELL_EMPTY);
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if($rmitCellTxnoNo.val().trim().length < 3){
                alert(MESSAGE.VALID_CELL_NUMBER);
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if(!$.isNumeric($rmitCellTxnoNo.val())){
                alert(MESSAGE.VALID_NOT_NUMBER);
                $rmitCellTxnoNo.val('');
                $rmitCellTxnoNo.focus();
                return false;
            }
            
            if($rmitCellEndNo.val().trim().length < 1){
                alert(MESSAGE.VALID_CELL_EMPTY);
                $rmitCellEndNo.focus();
                return false;
            }
            
            if($rmitCellEndNo.val().trim().length < 4){
                alert(MESSAGE.VALID_CELL_NUMBER);
                $rmitCellEndNo.focus();
                return false;
            }
            
            if(!$.isNumeric($rmitCellEndNo.val())){
                alert(MESSAGE.VALID_NOT_NUMBER);
                $rmitCellEndNo.val('');
                $rmitCellEndNo.focus();
                return false;
            }
            
            if($rmitTelRgnNo.val().isEmpty() || $rmitTelTxnoNo.val().trim().length < 3 || $rmitTelEndNo.val().trim().length < 4){
                $rmitTelRgnNo.val('');
                $rmitTelTxnoNo.val('');
                $rmitTelEndNo.val('');
            }else{
                if(!$.isNumeric($rmitTelTxnoNo.val())){
                    alert(MESSAGE.VALID_NOT_NUMBER);
                    $rmitTelTxnoNo.val('');
                    $rmitTelTxnoNo.focus();
                    return false;
                }
                
                if(!$.isNumeric($rmitTelEndNo.val())){
                    alert(MESSAGE.VALID_NOT_NUMBER);
                    $rmitTelEndNo.val('');
                    $rmitTelEndNo.focus();
                    return false;
                }
                
                if($rmitTelTxnoNo.val().trim().length < 3){
                    alert(MESSAGE.VALID_CELL_NUMBER);
                    $rmitTelTxnoNo.focus();
                    return false;
                }
                
                if($rmitTelEndNo.val().trim().length < 3){
                    alert(MESSAGE.VALID_CELL_NUMBER);
                    $rmitTelEndNo.focus();
                    return false;
                }
            }
            
            if($rmitPostNo.val().trim().length < 1 || $rmitPostAddr.val().trim().length < 1 || $stnmRmitPostAddr.val().trim().length < 1){
                alert(MESSAGE.VALID_ADDR);
                return false;
            }
            

            $tempRmitDtlAddr.val(replaceStrAddress($tempRmitDtlAddr.val()));

            
            if($tempRmitDtlAddr.css('display') != 'none' && $.trim($tempRmitDtlAddr.val()).length < 1){
                alert('회수지 상세주소를 입력하세요');
                $rmitDtlAddr.focus();
                return false;
            }
            
            if(!!$tempRmitDtlAddr.val()) {
                var rmitDtlAddr = $rmitDtlAddr.attr("orgvalue");
                var stnmRmitDtlAddr = $stnmRmitDtlAddr.attr("orgvalue");
                if(!!rmitDtlAddr) {
                    rmitDtlAddr += ' ';
                }
                if(!!stnmRmitDtlAddr) {
                    stnmRmitDtlAddr += ' ';
                }
                $rmitDtlAddr.val(rmitDtlAddr + $tempRmitDtlAddr.val());
                $stnmRmitDtlAddr.val(stnmRmitDtlAddr + $tempRmitDtlAddr.val());
            }
            
            return true;
        },
        
        selectedZipcodeCallback : function(param){
            $('#rmit-post-no').val(param.postNo);
            $('#rmit-post-addr').val(param.lotAddr1);
            $('#rmit-dtl-addr').attr("orgvalue", param.lotAddr2);
            $('#rmit-dtl-addr').val(param.lotAddr2);
            $('#stnm-rmit-post-no').val(param.postNo);
            $('#stnm-rmit-post-addr').val(param.roadAddr1);
            $('#stnm-rmit-dtl-addr').attr("orgvalue", param.roadAddr2);
            $('#stnm-rmit-dtl-addr').val(param.roadAddr2);
            
            $('#temp-rmit-dtl-addr').val('');
            $('#temp-rmit-dtl-addr').attr('maxlength', (param.roadAddr2.toString().length > param.lotAddr2.toString().length) ? 50 - param.roadAddr2.toString().length -1 : 50 - param.lotAddr2.toString().length -1);
            $('#temp-rmit-dtl-addr').show();
            
            $('#stnm-rmit-post-addr-text').html('도로명 : ' + param.roadAddr1+' '+param.roadAddr2);
            $('#rmit-post-addr-text').html('지번 : ' + param.lotAddr1+' '+ param.lotAddr2);
        },
        
        selectedRtnZipcodeCallback : function(param){
            $('#rtn-post-no').val(param.postNo);
            $('#rtn-stnm-rmit-post-addr-text').html('도로명 : ' + param.roadAddr1+' '+param.roadAddr2);
            $('#rtn-rmit-post-addr-text').html('지번 : ' + param.lotAddr1+' '+ param.lotAddr2);
            
            $('#rtn-rmit-post-no').val(param.postNo);
            $('#rtn-rmit-post-addr').val(param.lotAddr1);
            $('#rtn-rmit-dtl-addr').attr("orgvalue", param.lotAddr2);
            $('#rtn-rmit-dtl-addr').val(param.lotAddr2);
            $('#rtn-stnm-rmit-post-no').val(param.postNo);
            $('#rtn-stnm-rmit-post-addr').val(param.roadAddr1);
            $('#rtn-stnm-rmit-dtl-addr').attr("orgvalue", param.roadAddr2);
            $('#rtn-stnm-rmit-dtl-addr').val(param.roadAddr2);
            $('#rtn-temp-rmit-dtl-addr').val('');
            $('#rtn-temp-rmit-dtl-addr').attr('maxlength', (param.roadAddr2.toString().length > param.lotAddr2.toString().length) ? 50 - param.roadAddr2.toString().length -1 : 50 - param.lotAddr2.toString().length -1);
            $('#rtn-temp-rmit-dtl-addr').show();
        },
        
        bindSelectboxEvent : function(){
            $('#rfd-bnk-cd-select').change(function(){
                var $selected = $('option:selected', this);
                
                $('#rfd-cj-bnk-cd').val($selected.data('rfdCjBnkCd'));
                $('#rfd-bnk-cd').val($selected.data('rfdBnkCd'));

                mmypage.orderCancel.checkRfdActnSystemJson($(this).val());
            });
        },
        
        bindDeliveryListEvent : function(){
            $('#rtn-delivery-list-select').change(function(){
                var $selected = $('option:selected', this)
                   ,params    = $selected.data() || {};
                
                $('#rtn-rmit-nm').val(params.rmitNm);
                $('#rtn-post-no').val(params.postNo);
                $('#rtn-rmit-post-no').val(params.postNo);
                $('#rtn-rmit-post-addr').val(params.rmitPostAddr);
                $('#rtn-stnm-rmit-post-addr').val(params.stnmRmitPostAddr);
                $('#rtn-rmit-dtl-addr').attr("orgvalue", params.rmitDtlAddr);
                $('#rtn-rmit-dtl-addr').val(params.rmitDtlAddr);
                $('#rtn-stnm-rmit-dtl-addr').attr("orgvalue", params.stnmRmitDtlAddr);
                $('#rtn-stnm-rmit-dtl-addr').val(params.stnmRmitDtlAddr);
                $('#rtn-stnm-rmit-post-addr-text').text('도로명 : ' + params.stnmRmitPostAddr + ' ' + params.stnmRmitDtlAddr);
                $('#rtn-rmit-post-addr-text').text('지번 : ' + params.rmitPostAddr + ' ' + params.rmitDtlAddr);
                $('#rtn-rmit-cell-sct-no').val(params.rmitCellSctNo);
                $('#rtn-rmit-cell-txno-no').val(params.rmitCellTxnoNo);
                $('#rtn-rmit-cell-end-no').val(params.rmitCellEndNo);
                $('#rtn-rmit-tel-rgn-no').val(params.rmitTelRgnNo);
                $('#rtn-rmit-tel-txno-no').val(params.rmitTelTxnoNo);
                $('#rtn-rmit-tel-end-no').val(params.rmitTelEndNo);

                $("#rtn-temp-rmit-dtl-addr").attr("maxlength", 0);
                $("#rtn-temp-rmit-dtl-addr").val("");
                $("#rtn-temp-rmit-dtl-addr").hide();
            });
            
            $('#delivery-list-select').change(function(){
                var $selected = $('option:selected', this)
                   ,params    = $selected.data() || {};
                
                $('#rmit-nm').val(params.rmitNm);
                $('#post-no').val(params.postNo);
                $('#rmit-post-no').val(params.postNo);
                $('#rmit-post-addr').val(params.rmitPostAddr);
                $('#rmit-base-addr').val(params.rmitPostAddr);
                $('#stnm-rmit-post-addr').val(params.stnmRmitPostAddr);
                $('#rmit-dtl-addr').val(params.rmitDtlAddr);
                $('#stnm-rmit-dtl-addr').val(params.stnmRmitDtlAddr);
                $('#stnm-rmit-post-addr-text').html('도로명 : ' + params.stnmRmitPostAddr + ' ' + params.stnmRmitDtlAddr);
                $('#rmit-post-addr-text').html('지번 : ' + params.rmitPostAddr + ' ' + params.rmitDtlAddr);
                $('#rmit-cell-sct-no').val(params.rmitCellSctNo);
                $('#rmit-cell-txno-no').val(params.rmitCellTxnoNo);
                $('#rmit-cell-end-no').val(params.rmitCellEndNo);
                $('#rmit-tel-rgn-no').val(params.rmitTelRgnNo);
                $('#rmit-tel-txno-no').val(params.rmitTelTxnoNo);
                $('#rmit-tel-end-no').val(params.rmitTelEndNo);
                
                $("#temp-rmit-dtl-addr").attr("maxlength", 0);
                $("#temp-rmit-dtl-addr").val("");
                $("#temp-rmit-dtl-addr").hide();
            });
        },
        
        updateRfdAccountJSON : function(){
            _ajax.sendRequest('POST'
                    , _baseUrl + 'mypage/updateRfdActnInfoJson.do'
                    ,{
                      rfdAcctOwnMainNm : $('#rfd-acct-own-main-nm').val()
                     ,rfdBnkCd         : $('#rfd-bnk-cd-select').val()
                     ,rfdActn          : $('#rfd-actn').val()
                     }
                    , mmypage.orderCancel.updateRfdAccountJSONCallback
                    , false
            );
        },
        
        updateRfdAccountJSONCallback : function(res){
            var data = (typeof res !== 'object') ? $.parseJSON(res) : res
                    ,chgAccpSctCd = $('#chg-accp-sct-cd').val();
                 
                 var result = false;
                 
                 // 성공
                 if(data.returnCd == '0000') {
                     mmypage.orderCancel.rfdBnkCdForBypass = "";
                     result = true;
                     
                 // 로그인
                 } else if(data.returnCd == '100') {
                     alert("로그인이 필요합니다.");
                     location.href = _secureUrl + "login/loginForm.do";
                     
                 // 은행서비스 운영시간이 아닌경우 
                 } else if(data.returnCd == 'CA07') {
                     if (mmypage.orderCancel.rfdBnkCdForBypass == $("#rfd-bnk-cd-select").val()) {
                         var result = confirm(data.errorMsg+"\r\n입력하신 계좌가 올바르지 않으면 환불이 지연될 수 있습니다.\r\n신청하신 계좌로 접수하시겠습니까?");
                     } else {
                         mmypage.orderCancel.rfdBnkCdForBypass = $("#rfd-bnk-cd-select").val();
                         alert(data.errorMsg);
                     }
                 } else {
                     mmypage.orderCancel.rfdBnkCdForBypass = "";
                     alert(data.errorMsg);
                 }
                 
            if(result) {
                var $selected = $('#rfd-bnk-cd-select option:selected');
                     
                var url = /*(*/chgAccpSctCd == '20' //&& mypage.orderCancel.isCancelAll() && ALREADY_CANCEL_CNT == 0 && GOODS_ALL == 'Y')
                        ? _baseUrl + 'mypage/cancelOrder.do' 
                        : _baseUrl + 'mypage/cancelRequest.do';
                     
                $('#rfd-cj-bnk-cd').val($selected.data('rfdCjBnkCd'));
                $('#rfd-bnk-cd').val($selected.data('rfdBnkCd'));
                
                mmypage.orderCancel.doExpireState();
                     
                $('#cancel-form').attr('method', 'POST').attr('action', url).submit();
            } else {
                mmypage.orderCancel.isExcute = false;
            }
        },
        
        allCancelInfoPop : function(){
            var title = {
                    20 : '취소',
                    30 : '반품',
                    40 : '교환'
            };
            
            $('#LAYERPOP01-contents').html('');
            
            $('#LAYERPOP01-title').text('부분 '+title[$('#chg-accp-sct-cd').val()]+' 불가 안내');
            
            $('#LAYERPOP01-contents').load(_baseUrl + 'mypage/popup/getAllCancelInfoPop.do?chgAccpSctCd='+$('#chg-accp-sct-cd').val()+'&goodsAll='+GOODS_ALL, {}, function(){
                
                if(GOODS_ALL == 'N'){
                    
                    var button = $('.popLayerArea .btnClose');
                    
                    button.attr('onclick','mmyorder.cancelInfo.popClose(\''+GOODS_ALL+'\');');
                    
                }
                
                common.popLayerOpen('LAYERPOP01');
                
                $('.dim').unbind('click');
                
                $('.dim').bind('click', function(){
                    mmyorder.cancelInfo.popClose(GOODS_ALL);
                });
            });
        },
        
        checkIFSystemJson : function() {
            var message = "";
            var url = _baseUrl + 'mypage/checkIFSystemJson.do';
            var callback_checkIFSystemJson = function(res) {
                if(res.succeeded && !!res.data) {
                    var systemIFMgmtList = res.data;
                    if(systemIFMgmtList.length > 0) {
                        for(var i = 0 ; !message && i < systemIFMgmtList.length ; i++) {
                            for(var j = 0 ; j < CHECK_IF_SYSTEM_LIST.length ; j++) {
                                if(!!CHECK_IF_SYSTEM_LIST[j][systemIFMgmtList[i].cd]) {
                                    var systemNm = CHECK_IF_SYSTEM_LIST[j][systemIFMgmtList[i].cd];
                                    var startDtime = new Date(systemIFMgmtList[i].systemIFExpStartDtime).format("MM/dd HH:mm");
                                    var endDtime = new Date(systemIFMgmtList[i].systemIFExpEndDtime).format("MM/dd HH:mm");

                                    message += systemNm + " 시스템 점검기간(" + startDtime + " ~ " + endDtime + ")에 취소가 불가능합니다.\n";
                                    message += endDtime + " 이후에 취소해주세요.\n";
                                    message += "기타 문의사항은 고객센터로 문의해주세요.";
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    
                }
            };
            common.Ajax.sendJSONRequest("POST", url, null, callback_checkIFSystemJson, false);
            
            return message;
        }
        , fn_clearAmt : function() {
//          console.log('# fn_clearAmt # 함수 호출');

          for(var idx=0; idx<this.getGoodsListSize; idx++) {

              var isCheck = $("#check-" + idx).is(":checked");
              if(!isCheck) {
                  $("#cncl-amt-"+idx).val(0);
                  $("#pay-amt-"+idx).val(0);
                  $("#rfd-amt-"+idx).val(0);
                  $("#sale-amt-"+idx).val(0);
              }
          }
      }
      // 부분취소 관련 추가 함수들 <START>
      , fn_changeQty : function(idx, qty) {
//          console.log('# fn_changeQty # 함수 호출');

          var real_sale_amt   = $("#sale-prc-"+idx).val();    // 실제 판매 금액(개당)
          var real_payment_amt= $("#pur-sale-prc-"+idx).val();// 실제 결제 금액(할인금액*수량)
          var real_qty        = $("#real-qty-"+idx).val();    // 실제 주문 수량(주문-반품)

          // 값 변경 여부에 따른 변경
          var isChange = real_qty == qty ? 'N' : 'Y';
          this.getGoodsInfo(idx).find("[name=arrUpdateYn]").val(isChange);

          var sale_one_price  = Number(real_sale_amt);
          var one_price       = Number(real_payment_amt)  / Number(real_qty);
          var saleRemainAmt   = Number(sale_one_price)    * Number(qty);
          var remainAmt       = Number(one_price)         * Number(qty);
/*
          var goodsCpnAmt     = $("#goods-cpn-amt-"+idx).val();
          var goodsCpnAplyQty = $("#goods-cpn-aply-qty-"+idx).val();

          // 상품 쿠폰 할인가 별도 적용 
          real_payment_amt = real_payment_amt - goodsCpnAmt;
          if(Number(real_qty) - Number(qty) < goodsCpnAplyQty) {
              remainAmt = remainAmt - goodsCpnAmt;
          }
*/
          // 출하지시까지 취소가능
          if ("45" > $("#ord-prgs-stat-cd-"+idx).val()) {
              $("#cncl-amt-"+idx).val(remainAmt);
              $("#pay-amt-"+idx).val(real_payment_amt - remainAmt);
          } else {
              $("#rfd-amt-"+idx).val(remainAmt);
          }
          $("#sale-amt-"+idx).val(saleRemainAmt);

          this.fn_calcOrderCost();
          this.fn_calcOrderDtl();
      }
      /////////////////////////////////////////////////////////////////////
      // 취소/반품 접수 수량에 따른 비용 금액 설정
      //  1. 비용 데이터 셋(datasetOrdercost) 초기화
      //  2. 주문 비용 순번, 비용 구분 코드에 따라 비용 금액 setting
      /////////////////////////////////////////////////////////////////////
      , fn_calcOrderCost : function() {
//          console.log('# fn_calcOrderCost # 함수 호출');

          var $gridOrdercost = $("div[title=gridOrdercost]");
          var sumReturnAmt = 0;

          var modifyAmt = 0;
          var modifyQty = 0;

          $.each($gridOrdercost, function(idx) {

              var cost_gubun_code = $("#c-adtn-cost-aply-shp-cd-"+idx).val();           // 부가비용적용형태코드
              var add_dprice_amt = $("#c-add-dprice-amt-"+idx).val();                   // 추가 배송비
              var org_aply_adtn_cost_amt = $("#c-org-aply-adtn-cost-amt-"+idx).val();   // 기존 적용 부가비용 금액

              if(CODE_COST_GUBUN_CODE_DELI == cost_gubun_code) { // 배송비

                  $("#c-remain-target-amt-"+idx).val($("#c-org-remain-target-amt-"+idx).val());   // 반품제외 금액
                  $("#c-remain-target-qty-"+idx).val($("#c-org-remain-target-qty-"+idx).val());   // 반품제외 수량
                  $("#c-grnt-sub-cd-"+idx).val($("#c-org-grnt-sub-cd-"+idx).val());               // 부여차감코드  

                  $("#c-aply-adtn-cost-amt-"+idx).val(Number(org_aply_adtn_cost_amt));
                  $("#c-add-dprice-amt-"+idx).val(0);

                  $("#c-cost-amt-"+idx).val($("#c-org-cost-amt-"+idx).val());
                  $("#c-dprice-amt-"+idx).val($("#c-org-dprice-amt-"+idx).val());
              }
              //오늘드림 고도화 선물포장비 2020-01-17
              if("70" == cost_gubun_code) { // 배송비
                  
                  $("#c-remain-target-amt-"+idx).val($("#c-org-remain-target-amt-"+idx).val());   // 반품제외 금액
                  $("#c-remain-target-qty-"+idx).val($("#c-org-remain-target-qty-"+idx).val());   // 반품제외 수량
                  $("#c-grnt-sub-cd-"+idx).val($("#c-org-grnt-sub-cd-"+idx).val());               // 부여차감코드  
                  
                  $("#c-aply-adtn-cost-amt-"+idx).val(Number(org_aply_adtn_cost_amt));
                  $("#c-add-dprice-amt-"+idx).val(0);
                  
                  $("#c-cost-amt-"+idx).val($("#c-org-cost-amt-"+idx).val());
                  $("#c-dprice-amt-"+idx).val($("#c-org-dprice-amt-"+idx).val());
              }
          });

          var sum_real_deli_cost = this.fn_getSumValue($gridOrdercost, "DEFAULT", "#c-aply-adtn-cost-amt-", CODE_COST_GUBUN_CODE_DELI);

          for(var i = 0; i < $gridOrdercost.size(); i++) {

              var $aplyAdtnCostAmt    = $("#c-aply-adtn-cost-amt-"+i);
              var $addDpriceAmt       = $("#c-add-dprice-amt-"+i);
              var $orgDlexAmt         = $("#c-org-dlex-amt-"+i);
              var $grntSubCd          = $("#c-grnt-sub-cd-"+i);
              var $dlvNo              = $("#c-dlv-no-"+i);

              var order_cost_seq        = $dlvNo.val();                           //부가비용의 배송번호
              var cost_gubun_code       = $("#c-adtn-cost-aply-shp-cd-"+i).val(); //부가비용적용형태코드
              var dlex_occur_sct_cd     = $("#c-dlex-occur-sct-cd-"+i).val();     //배송비발생구분코드
              var dlexDtlSctCd          = $("#c-dlex-dtl-sct-cd-"+i).val();       //배송비상세구분코드
              var org_remain_target_amt = $("#c-org-remain-target-amt-"+i).val();
              var org_remain_target_Qty = $("#c-org-remain-target-qty-"+i).val();
              var ord_prgs_stat_cd      = "";
              var wthd_cost_chrg_sub_cd = $("#wthd-cost-chrg-sub-cd").val();      // 배송비부담(10:고객, 20:자사)

              modifyAmt = 0;
              modifyQty = 0;

              $("#c-remain-target-amt-"+i).val(org_remain_target_amt);
              $("#c-remain-target-qty-"+i).val(org_remain_target_Qty);

              // 주문처리상태 가져오기
              var maxOrdDtlSctCd = "0";
//            for(var n=0; n<this.getGoodsListSize; n++) {
            $.each(this.getGoodsList, function(N) {
                var ordPrgsStatCd = $("#goods-"+n).data("ord-prgs-stat-cd");
                maxOrdDtlSctCd = maxOrdDtlSctCd < ordPrgsStatCd ? ordPrgsStatCd : maxOrdDtlSctCd;
            });
            
              var arrPromCheckSize = $("input[name=arrPromCheck]").length;
              
              var preIdxE = 0;
              for(var n=0; n < this.getGoodsListSize; n++) {

//                  var isCheck         = $("#check-" + n).is(":checked");
                  var $objGoods = $("#goods-"+n);
//                  var isCheck         = 'Y' == $("input[name=arrRowCheck]").eq(n).val();
                  var isCheck         = 'Y' == $objGoods.find("input[name=arrRowCheck]").val();
                  

//                  var order_qty       = isCheck ? $("#ord-qty-"+n).val() : 0; // 접수 수량(=취소수량,clmQty)
//                  var order_qty       = isCheck ? $("input[name=arrOrdQty]").eq(n).val() : 0; // 접수 수량(=취소수량,clmQty)
                  var order_qty       = isCheck ? $objGoods.find("input[name=arrOrdQty]").val() : 0;   // 접수 수량(=취소수량,clmQty)
                  
//                  var real_qty        = $("#real-qty-"+n).val();              // 실 주문 수량
//                  var real_sale_amt   = $("#pur-sale-prc-"+n).val();          // 실 판매 금액
                  var real_qty        = $objGoods.data("tot-real-qty");                          // 실 주문 수량
                  var real_sale_amt   = $objGoods.data("pur-sale-prc");                          // 실 판매 금액

//                  var oneAmt = real_sale_amt / real_qty;                      // 상품의 단가금액
                  var oneAmt = $objGoods.data("sale-prc");     // 상품의 단가금액

//                  var deli_cost_seq = $("#dlv-no-"+n).val();
                  var deli_cost_seq = $objGoods.data("dlv-no");

                  if(deli_cost_seq == order_cost_seq) {
                      var isProm = '' != $objGoods.data("prom-no");
                      var idxS = this.fn_getPromGoodsIndexS(n); 
                      var idxE = this.fn_getPromGoodsIndexE(n); 
                      if(isProm) {
                          if(preIdxE != idxE) {
                              modifyQty += this.fn_getGoodsQty(true, idxS);
                              modifyQty += this.fn_getGoodsQty(false, idxE);
                              order_qty = isCheck ? this.fn_getGoodsQty(true, idxS) : 0;
                              modifyAmt += oneAmt * order_qty;
                              
                              if(isCheck) {
                                  for(var t=idxS; t<idxE; t++) {
                                      
                                      // 즉시할인 계산
                                      modifyAmt -= this.fn_getImmedCpnAmt(t);
                                      // 쿠폰할인 계산
                                      modifyAmt -= this.fn_getGoodsCpnAmt(t);
                                  }
                                  // 부가비용 계산
                                  var ordGoodsSeq = $objGoods.data("ord-goods-seq");
                                  var ordProcSeq  = $objGoods.data("ord-proc-seq");
                                  var ordQty      = $objGoods.data("org-qty");
                                  var payCpnAmt   = $objGoods.data("pay-cpn-amt");
                                  
                                  if(!this.fn_checkPayCpnCncl(n)) {
                                      // 자사 귀책 처리 or 반품/교환
                                      
                                      var costAmt = Number(this.fn_getSumValue($("div[title=gridPromotion]"), "ADTN", "#pr-cost-amt-", ordGoodsSeq));
                                      
                                      if(order_qty == real_qty && costAmt > 0) {
                                          
                                          payCpnAmt = Number(this.fn_getSumValue($("div[title=gridPromotion]"), "ADTN", "#pr-sum-cost-amt-", ordGoodsSeq));
                                      } else if(order_qty > 0) {
                                          
                                          payCpnAmt = Math.round(costAmt/ordQty) * order_qty;
                                      }
                                  }
                                  modifyAmt -= payCpnAmt;
                                  
                                  // 상품
                                  ord_prgs_stat_cd = $objGoods.data("ord-prgs-stat-cd");
                                  
                                  preIdxE = idxE;
                              }
                          }
                      } else {
                          modifyQty += isCheck ? Number($objGoods.find("input[name=arrOrdQty]").val()) : 0;
                          order_qty = isCheck ? Number($objGoods.find("input[name=arrOrdQty]").val()) : 0;
                          modifyAmt += oneAmt * order_qty;
                          
                          if(isCheck) {
                              // 즉시할인 계산
                              modifyAmt -= this.fn_getImmedCpnAmt(n);
                              // 쿠폰할인 계산
                              modifyAmt -= this.fn_getGoodsCpnAmt(n);
                              // 부가비용 계산
                              var ordGoodsSeq = $objGoods.data("ord-goods-seq");
                              var ordProcSeq  = $objGoods.data("ord-proc-seq");
                              var ordQty      = $objGoods.data("org-qty");
                              var payCpnAmt   = $objGoods.data("pay-cpn-amt");
                              
                              if(!this.fn_checkPayCpnCncl(n)) {
                                  // 자사 귀책 처리 or 반품/교환
                                  
                                  var costAmt = Number(this.fn_getSumValue($("div[title=gridPromotion]"), "ADTN", "#pr-cost-amt-", ordGoodsSeq));
                                  
                                  if(order_qty == real_qty && costAmt > 0) {
                                      
                                      payCpnAmt = Number(this.fn_getSumValue($("div[title=gridPromotion]"), "ADTN", "#pr-sum-cost-amt-", ordGoodsSeq));
                                  } else if(order_qty > 0) {
                                      
                                      payCpnAmt = Math.round(costAmt/ordQty) * order_qty;
                                  }
                              }
                              modifyAmt -= payCpnAmt;
                              // 상품
                              ord_prgs_stat_cd = $objGoods.data("ord-prgs-stat-cd");
                          }
                      }
                  }
              }

              var dpric_not_apply_chk = $("#c-dprice-not-apply-chk-"+i).val();// 무료 배송 적용 여부
              var remain_target_amt   = $("#c-remain-target-amt-"+i).val();   // 배송비를 갖고 있는 실 주문 금액 (sum(nat_selling_amt* (real_qty - return)))
              var remain_target_qty   = $("#c-remain-target-qty-"+i).val();   // 배송비를 갖고 있는 실 주문 수량 (su(real_qty))
              var dprice_free_std_amt = $("#c-std-adtn-cost-amt-"+i).val();   // 배송비 무료 하한금액
              var coupon_issue_no     = $("#c-cpn-issu-no-"+i).val();         // 쿠폰 이슈 번호
              var dprice_amt          = $("#c-dprice-amt-"+i).val();          // 배송비 금액
              var cost_amt            = $aplyAdtnCostAmt.val();               // 비용 금액
              var grnt_sub_cd         = $grntSubCd.val();                     // 부여차감코드
              var add_dprice_amt      = $addDpriceAmt.val();                  // 추가배송비

              // 배송비 부여
              if(CODE_COST_GUBUN_CODE_DELI == cost_gubun_code) {

                  var wthd_dlex_amt       = $("#c-wthd-dlex-amt-"+i).val();     //회수배송비
                  var wthdDlexIndvChgYn   = $("#c-wthd-dlex-indv-chg-yn-"+i);   //회수배송비 여부
                  if('Y' == wthdDlexIndvChgYn) {
                      wthd_dlex_amt = Number(wthd_dlex_amt) * order_qty;
                  }

                  // ord_prgs_stat_cd         주문처리상태         40:출하지시   ,45:출하확정   ,50:출하완료   ,60:배송완료     :  50보다 작으면 취소임.
                  // wthd_cost_chrg_sub_cd    배송비부담           10:고객       ,20:자사
                  // dlex_occur_sct_cd        배송비발생구분코드   00:일반       ,01:배송비쿠폰 ,02:무료배송권 ,04:직권삭제 ,05:추가
                  if(ord_prgs_stat_cd < "45" || wthd_cost_chrg_sub_cd == "20" || dlex_occur_sct_cd == '05' || dlexDtlSctCd == "20" || dlexDtlSctCd == "30" || dlexDtlSctCd == "40") {

                      // [취소,업체,추가배송비]일 경우, 0원 처리.
                      wthd_dlex_amt = 0;
                  }
                  if(ord_prgs_stat_cd >= "45" && dlex_occur_sct_cd != '05' && (dlexDtlSctCd != "20" && dlexDtlSctCd != "30" && dlexDtlSctCd != "40") && wthd_cost_chrg_sub_cd != "20") {

                      if(this.fn_getGoodsWhtdFree(order_cost_seq)) {
                          wthd_dlex_amt = 0;
                      }
                  }

                  $("#c-add-wthd-dlex-amt-"+i).val(wthd_dlex_amt);
                  
                  remain_target_amt = remain_target_amt - Number($("#c-tot-dscnt-amt-"+i).val());

                  //배송비 적용 안할 경우, 원래 상태로 원상복구함, 또는 기존 배송비를 취소 시, 포함할 경우, 취소금액으로 설정함
                  remain_target_amt = remain_target_amt - modifyAmt;
                  remain_target_qty = remain_target_qty - modifyQty;

                  $("#c-remain-target-amt-"+i).val(remain_target_amt);
                  $("#c-remain-target-qty-"+i).val(remain_target_qty);
                  $grntSubCd.val(grnt_sub_cd);

                  if(org_remain_target_amt != (-1 && 0)) {
                      // 부분 취소로 인해 배송비가 발생할 경우
                      // dprice_free_std_amt 배송비 무료 하한금액
                      // 10.22 조건 추가 (dprice_free_std_amt ==0 && remain_target_amt==0)
                      // dprice_free_std_amt ==0 이면 무조건 배송료 부과조건이어서 전체 취소일 경우 배송료 없앰
                      if ((remain_target_amt < dprice_free_std_amt 
                              || dlex_occur_sct_cd == '05' 
                              || ( cost_amt != 0 && dprice_free_std_amt == 0)
                           )  && !this.fn_getGoodsDlexFree(order_cost_seq) //상품무료배송
                          ) {

                          // 부분취소로 인해 배송비가 발생할 경우
                          // dlex_occur_sct_cd 배송비발생구분코드 00:일반 , 01:배송비쿠폰 , 02:무료배송권 , 04:직권삭제 , 05:추가
                          if(remain_target_qty > 0 && dlex_occur_sct_cd != '05') {
                              // 배송비가 설정되어 있지 않을 경우(쿠폰을 사용시 제외)
                              // 취소 시, 귀책 처리
                              if(this.isSuperCharge) { //|| ord_prgs_stat_cd >= '45'){
                                  // 무료배송?
                                  if(cost_amt == 0 && (coupon_issue_no == null || coupon_issue_no == '') ) {

                                      sum_real_deli_cost = this.fn_getSumRealCost($gridOrdercost, "#c-aply-adtn-cost-amt-", CODE_COST_GUBUN_CODE_DELI, order_cost_seq, dlexDtlSctCd); //비용구분 - 배송비
                                      $aplyAdtnCostAmt.val(Number(dprice_amt) - Number(sum_real_deli_cost));
                                      $grntSubCd.val("30");
                                      $("#c-adtn-cost-occur-sct-cd"+i).val("10");
                                  // 추가배송비
                                  } else if(add_dprice_amt >0 && cost_amt == add_dprice_amt) {

                                      sum_real_deli_cost = this.fn_getSumRealCost($gridOrdercost, "#c-aply-adtn-cost-amt-", CODE_COST_GUBUN_CODE_DELI, order_cost_seq, dlexDtlSctCd); //비용구분 - 배송비
                                      $aplyAdtnCostAmt.val(Number(add_dprice_amt) + Number(sum_real_deli_cost));
                                      $grntSubCd.val("30");
                                      $("#c-adtn-cost-occur-sct-cd"+i).val("10");
                                  } else{
                                      // ord_prgs_stat_cd  50:출하완료 , 60:배송완료.  45보다 작으면 취소임.
                                      //if(ord_prgs_stat_cd >= "45"){
                                          if(coupon_issue_no == null || coupon_issue_no == '') {
                                              //alert("dprice_amt : " + dprice_amt + " : dlex_amt : " + dlex_amt + " : wthd_dlex_amt : " + wthd_dlex_amt + " : " + wthd_cost_chrg_sub_cd);
                                              $aplyAdtnCostAmt.val(Number(dprice_amt));
                                          }
                                      //}
                                  }
                              }
                          } else {
                              // "전체취소"일 경우,
                              if($("#c-remain-target-amt-"+i).val() == 0) {
                                  // 반품이면서 자사부담 wthd_cost_chrg_sub_cd 배송비부담   10:고객 , 20:자사
                                  if(ord_prgs_stat_cd >= "45" && wthd_cost_chrg_sub_cd == "20"){
                                      dprice_amt = 0;
                                  }

                                  if(coupon_issue_no != null && coupon_issue_no != '') dprice_amt = 0;

                                  $aplyAdtnCostAmt.val(Number(dprice_amt));
                                  $grntSubCd.val("10");

                                  // 출하지시 포함([주문처리상태] < 출하확정)
                                  if(ord_prgs_stat_cd < "45") {
                                      if(org_remain_target_amt > 0) {
                                          $aplyAdtnCostAmt.val(0);
                                      }
                                  }else if(dlex_occur_sct_cd != '02' //무료배송이 아니고
                                      && wthd_cost_chrg_sub_cd != "20"){ // 자사부담이 아닌경우
                                      //반품
                                      $grntSubCd.val("");
                                  }else if(dlex_occur_sct_cd == '02' //무료배송이고
                                      && wthd_cost_chrg_sub_cd == "20"){ // 자사부담인 경우
                                      //반품
                                      $grntSubCd.val("90");
                                  }
                                  $addDpriceAmt.val(0);
                                  $("#c-adtn-cost-occur-sct-cd-"+i).val("20")
                              }
                          }
                      } else {
                          
                          if($("#c-remain-target-amt-"+i).val() == 0 && ord_prgs_stat_cd >= '45' && wthd_cost_chrg_sub_cd == '20') {
                              //전체반품 자사과실
                              $grntSubCd.val("90");
                          }
                          $addDpriceAmt.val(0); // 추가 배송비
                      }
                      
                      $("#c-org-dlex-amt-"+i).val($aplyAdtnCostAmt.val());
                      $addDpriceAmt.val(wthd_dlex_amt);                                               // 회수배송비
                      $aplyAdtnCostAmt.val(Number($aplyAdtnCostAmt.val()) + Number(wthd_dlex_amt));   // 회수배송비 더하기
                  }
                  
                  for(var n = 0; n < this.getGoodsListSize; n++) {

                      if($("#check-" + i).is(":checked")) {

                          if($("#orgAmtRefYn").is(":checked")
                                  && $("#c-rfd-org-dlex-amt-yn-"+i).val() === "Y"
                                  && $("#c-al-rfd-org-dlex-amt-yn-"+i).val() === "Y"
                                  && $dlvNo.val() === $("#org-dlv-no-"+n).val()) {

                              $aplyAdtnCostAmt.val($aplyAdtnCostAmt.val() + $orgDlexAmt.val());
                              $orgDlexAmt.val(0);
                              $grntSubCd.val("80");
                          }
                      }
                  }
              }
          }

          var sum_real_deli_cost_amt = this.fn_getSumValue($gridOrdercost, "DEFAULT", "#c-aply-adtn-cost-amt-", CODE_COST_GUBUN_CODE_DELI); //비용구분 - 배송비
          if(sum_real_deli_cost_amt > 0) {
              this.dlvpAmtYn = true;
          }

//          $("#dprice-payment-amt").val(this.toCurrency(sum_real_deli_cost_amt));
          $("#dprice-payment-amt").val(sum_real_deli_cost_amt);
      }
      /* 
       * 금액 합계
       * @ $obj   - LIST
       * @ mode   - DEFAULT   : ADTN_COST_APLY_SHP_CD
       *          , ADTN      : ORD_GOODS_SEQ
       * @ colid  - OBJECT ID
       * @ value1 - 비교값1
       * @ value2 - 비교값2
       */
      , fn_getSumValue : function($obj, mode, colid, value1, value2) {
//          console.log('# fn_getSumValue # 함수 호출 : ' + mode + ' #');

          var result = 0;
          if ($obj.size() < 0) return result;
          $.each($obj, function(idx) {
              
              if( ( 'DEFAULT' == mode && value1 == $("#c-adtn-cost-aply-shp-cd-"+idx).val() ) || ( 'ADTN' == mode && value1 == $("#pr-ord-goods-seq-"+idx).val() ) ) {
                  
                  result += Number($(colid + idx).val());
              }
          });
          return result;
      }
      // 쿠폰결제 취소 체크
      , fn_checkPayCpnCncl : function(idx) {
//          console.log('# fn_checkPayCpnCncl # 함수 호출');

          var payCpnAdtnCostIssuNo = "";
          var payCpnAdtnCostStdAmt = 0;
          var payCpnAplyTgtTotAmt = 0;

          // 자사 귀책 처리
          if(!this.isSuperCharge) {
              return false;
          }

          var maxOrdDtlSctCd = "0";
          for(var i=0; i<this.getGoodsListSize; i++) {
//          $.each(this.getGoodsList, function(i) {
              var ordPrgsStatCd = $("#ord-prgs-stat-cd-"+i).val();
              maxOrdDtlSctCd = maxOrdDtlSctCd < ordPrgsStatCd ? ordPrgsStatCd : maxOrdDtlSctCd;
          }//);
          // 반품,교환 제외
          if(maxOrdDtlSctCd >= CODE_ORDER_DTL_CODE_RETURN) {
              return false;
          }

          // 프로모션
          var $gridPromotion = $("div[title=gridPromotion]");
          for(var i=0; i < $gridPromotion.size(); i++) {

              // C105: 장바구니쿠폰(결제쿠폰)
              if('C105' == $("#pr-adtn-cost-dtl-sct-cd-"+i).val()) {

                  payCpnAdtnCostIssuNo = $("#pr-cpn-issu-no-"+i).val();
                  payCpnAdtnCostStdAmt = $("#pr-std-adtn-cost-amt-"+i).val(); // 기준부가비용금액
              }
          }

          if(payCpnAdtnCostIssuNo != "") {
              payCpnAplyTgtTotAmt = this.fn_getPayCpnAplyTgtTotAmt(payCpnAdtnCostIssuNo);
          }

          if(payCpnAdtnCostStdAmt > payCpnAplyTgtTotAmt) {
              return true;
          }
          return false;
      }
      // 프로모션 재계산
      , fn_getPayCpnAplyTgtTotAmt : function(cpnIssuNo) {
//          console.log('# fn_getPayCpnAplyTgtTotAmt # 함수 호출');

          var $gridPromotion = $("div[title=gridPromotion]");
          var payCpnAdtnCostStdAmt = 0;
          var payCpnAplyGoodsTotAmt = 0;
          var payCpnAplyTotAmt = 0;

          for(var i=0; i < $("div[title=gridPromotion]").size(); i++) {

              var payCpnAdtnCostIssuNo = $("#pr-cpn-issu-no-"+i).val();
              if( 'C105' == $("#pr-adtn-cost-dtl-sct-cd-"+i).val() && cpnIssuNo == payCpnAdtnCostIssuNo ) {

                  payCpnAdtnCostStdAmt = $("#pr-std-adtn-cost-amt-"+i).val();  // 기준부가비용금액

                  var promOrdGoodsSeq = $("#pr-ord-goods-seq-"+i).val();
                  var promOrdProcSeq  = $("#pr-ord-proc-seq-"+i).val();
                  var promSumCostAmt  = $("#pr-sum-cost-amt-"+i).val();
                  var promCostAmt     = $("#pr-cost-amt-"+i).val();

                  for(var n=0; n < this.getGoodsListSize; n++) {

                      var ordGoodsSeq = $("#ord-goods-seq-"+n).val();
                      var ordProcSeq  = $("#ord-proc-seq-"+n).val();

                      var rowCheck = $("#check-"+n).is(":checked");
                      var clmQty      = rowCheck ? $("#ord-qty-"+n).val() : 0;
                      var realQty     = $("#real-qty-"+n).val();
                      var realSaleAmt   = $("#sale-prc-"+n).val() * realQty;

                      var immedCpnAmt = this.fn_getImmedCpnAmt(n);
                      var goodsCpnAmt = this.fn_getGoodsCpnAmt(n);

                      var oneAmt = realSaleAmt / realQty; // 상품의 단가금액

                      if(ordGoodsSeq == promOrdGoodsSeq && ordProcSeq == promOrdProcSeq) {

                          payCpnAplyGoodsTotAmt += (oneAmt * (realQty - clmQty));

                          payCpnAplyGoodsTotAmt -= immedCpnAmt + goodsCpnAmt;

//                          var costAmt = Number(this.fn_getSumValue($gridPromotion, "ADTN", "#pr-cost-amt-", ordGoodsSeq, ordProcSeq));
//                          if(clmQty == realQty && costAmt > 0) {
//                              payCpnAplyTotAmt += promSumCostAmt;
//                          } else if(clmQty > 0) {
//                              payCpnAplyTotAmt += Math.round(promCostAmt / ordQty) * clmQty;
//                          }
                      }
                  }
              }
          }
          return payCpnAplyGoodsTotAmt - payCpnAplyTotAmt;
      }
      , fn_getImmedCpnAmt : function(idx) {
//          console.log('# fn_getImmedCpnAmt # 함수 호출');

          var $obj        = $("#goods-"+idx);
          var orderQty    = $obj.find("[name=arrOrdQty]").val();
          var realQty     = $obj.data("tot-real-qty");
          var immedCpnAmt = $obj.data("immed-cpn-amt");

          return Number((immedCpnAmt / realQty) * orderQty);
      }
      , fn_getGoodsCpnAmt : function(idx) {
//          console.log('# fn_getGoodsCpnAmt # 함수 호출');

          var $obj        = $("#goods-"+idx);
          var orderQty    = $obj.find("[name=arrOrdQty]").val();
          var realQty     = $obj.data("tot-real-qty");
          var goodsCpnAmt = $obj.data("goods-cpn-amt");

          return Number(realQty == orderQty ? goodsCpnAmt : 0);
      }
      , fn_getGoodsWhtdFree : function(dlvNo) {
//          console.log('# fn_getGoodsWhtdFree # 함수 호출');

          for(var i=0; i<this.getGoodsListSize; i++) {
//          $.each(this.getGoodsList, function(i) {
              var rowCheck = $("#check-"+i).is(":checked");
              var whtdFreeYn = $("#whtd-free-yn-"+i).val();
              var targetDlvNo = $("#dlv-no-"+i).val();
              if(rowCheck && whtdFreeYn == "Y" && dlvNo == targetDlvNo){
                  return true;
              }
          }//);
          return false;
      }
      , fn_getGoodsDlexFree : function(dlvNo) {
//          console.log('# fn_getGoodsDlexFree # 함수 호출');

          for(var i=0; i<this.getGoodsListSize; i++) {
//          $.each(this.getGoodsList, function(idx) {
              var clmQty      = $("#ord-qty-"+i).val();
              var realQty     = $("#real-qty-"+i).val();
              var dlexFreeYn  = $("#dlex-free-yn-"+i).val();

              if(realQty - clmQty > 0 && dlexFreeYn == 'Y' && dlvNo == $("#dlv-no-"+i).val()) {
                  return true;
              }
          }//);
          return false;
      }
      , fn_getSumRealCost : function($obj, colid, costgubun, dlv_no, dlexDtlSctCd) {
//          console.log('# fn_getSumRealCost # 함수 호출');

          var result = 0;
          for(var i=0; i < $obj.size(); i++) {

              if($("#c-adtn-cost-aply-shp-cd-"+i).val() == costgubun
                      && $("#c-dlv-no-"+i).val() == dlv_no
                      && $("#c-dlex-occur-sct-cd-"+i).val() != "05"
                      && $("#c-dlex-dtl-sct-cd-"+i).val() == dlexDtlSctCd) {

                  result += Number($(colid+i).val());
              }
          }
          return result;
      }
      , toCurrency : function(amount) {
//          console.log('# toCurrency # 함수 호출');

          amount = String(amount);

          var data = amount.split('.');

          var sign = "";

          var firstChar = data[0].substr(0,1);
          if(firstChar == "-"){
              sign = firstChar;
              data[0] = data[0].substring(1, data[0].length);
          }

          data[0] = data[0].replace(/\D/g,"");
          if(data.length > 1){
              data[1] = data[1].replace(/\D/g,"");
          }

          firstChar = data[0].substr(0,1);

          //0으로 시작하는 숫자들 처리
          if(firstChar == "0"){
              if(data.length == 1){
                  return sign + parseFloat(data[0]);
              }
          }

          var comma = new RegExp('([0-9])([0-9][0-9][0-9][,.])');

          data[0] += '.';
          do {
              data[0] = data[0].replace(comma, '$1,$2');
          } while (comma.test(data[0]));

          if (data.length > 1) {
              return sign + data.join('');
          } else {
              return sign + data[0].split('.')[0];
          }
      }
      //////////////////////////////////////////////////////////////////////
      // 취소/ 반품 선택에 따라 금액 setting
      //  1. 취소 금액의 합계 (cancel_amt의 합계)
      //  2. 취소금액 text box에 금액 setting
      //         1) 취소 금액 합계 + 배송비용 합계 - 실제 배송비용 합계 + 포장비용 합계 - 실제 포장비용 합계
      //  3. 남은 결제 금액 text box에 금액 setting
      //         1) 주문금액(반품수량이 반영된 금액 =>nat_selling_amt * (real_qty - return_qty)) - 취소금액의 합게 + 배송비용 + 포장비용
      //  4. 반품 금액 text box에 금액 setting
      //         1) 환불 예정 금액 (return_amt) 합계
      //////////////////////////////////////////////////////////////////////
      , fn_calcOrderDtl : function() {
//          console.log('# fn_calcOrderDtl # 함수 호출');

          //n+1  적용 상품일 경우
          var add_real_amt = 0;//실추가금액
          var arr_goods_no = new Array();
          for(var i=0; i<this.getGoodsListSize; i++) {
//          $.each(this.getGoodsList, function(i) {
              if ($("#add-real-amt-"+i).val() > 0) {
                  arr_goods_no[i] = $("#goods-no-"+i).val();
              }
          }//);
          arr_goods_no = this.fn_uni(arr_goods_no);
          for(i=0; i < this.getGoodsListSize; i++) {
              if (arr_goods_no[i] != "undefined")
                  // N+1 상품 계산
                  add_real_amt += Number(this.fn_getSumAddQty(this.getGoodsList, "#add-real-amt-", arr_goods_no[i]));
          }

          // 상품할인이 아닌 결제쿠폰
          var sumAdtnCost = 0; // 부분취소를 위한 개당 할인금액
          var sumItemAdtnCost = 0; // 부분취소를 위한 개당 상품가격 할인금액
          var checkPayCpnCncl = this.fn_checkPayCpnCncl();
          $("#checkPayCpnCncl").val(checkPayCpnCncl ? "Y" : "N");
          var maxOrdDtlSctCd = "0";
          for(var i=0; i<this.getGoodsListSize; i++) {
//          $.each(this.getGoodsList, function(n) {

              var ordPrgsStatCd = $("#ord-prgs-stat-cd-"+i).val();
              maxOrdDtlSctCd = maxOrdDtlSctCd < ordPrgsStatCd ? ordPrgsStatCd : maxOrdDtlSctCd;
          }//);
          var ordDtlSctCd = maxOrdDtlSctCd;
          for(var i=0; i < this.getGoodsListSize; i++) {

              var ordGoodsSeq = $("#ord-goods-seq-"+i).val();
              var ordProcSeq  = $("#ord-proc-seq-"+i).val();
              
//              var clmQty  = $("#ord-qty-"+i).val();   // 기존로직 2020-01-18
              //오늘드림 고도화 오늘드림전용쿠폰취소시 ord-qty- disabled처리 되어 수량 셋팅 못하는 문제로 변경 2020-01-18
              var clmQty  = $("#check-"+i).is(":checked") && $("#ord-qty-"+i).is(":disabled") ? $("input[name='arrOrdQty']")[i].value : $("#ord-qty-"+i).val();
              var realQty = $("#real-qty-"+i).val();
              var ordQty  = Number($("#org-qty-"+i).val());

              var rowCheck = $("#check-"+i).is(":checked");
              if(rowCheck) {

                  if(checkPayCpnCncl && ordDtlSctCd != CODE_ORDER_DTL_CODE_RETURN) {

                      var costAmtPayCpn = Number(this.fn_getSumAdtnCostPayCpn($("div[title=gridPromotion]"), "#pr-aply-adtn-cost-amt-", ordGoodsSeq, ordProcSeq, 'Y'));
                      var costAmtGoodsCpn = Number(this.fn_getSumAdtnCostPayCpn($("div[title=gridPromotion]"), "#pr-cost-amt-", ordGoodsSeq, ordProcSeq, 'N'));
                      if(clmQty == realQty && costAmtGoodsCpn > 0) {
                          
                          sumAdtnCost += Number(this.fn_getSumAdtnCostPayCpn($("div[title=gridPromotion]"), "#pr-sum-cost-amt-", ordGoodsSeq, ordProcSeq, 'N'));
                          var goodsCpnAmt = Number($("#goods-cpn-amt-"+i).val());
                          sumItemAdtnCost += goodsCpnAmt;
                      } else if(clmQty > 0) {
                          if(clmQty == realQty){
                              var goodsCpnAmt = Number($("#goods-cpn-amt-"+i).val());
                              sumItemAdtnCost += goodsCpnAmt;
                          }
                          sumAdtnCost += Math.round(costAmtGoodsCpn / ordQty) * clmQty;
                      }
                      sumAdtnCost += costAmtPayCpn;
                  } else {
                      var costAmt = Number(this.fn_getSumValue($("div[title=gridPromotion]"), "ADTN", "#pr-cost-amt-", ordGoodsSeq, ordProcSeq));
                      if(clmQty == realQty && costAmt > 0) {
                        var goodsCpnAmt = Number($("#goods-cpn-amt-"+i).val());
                          sumAdtnCost += Number(this.fn_getSumValue($("div[title=gridPromotion]"), "ADTN", "#pr-sum-cost-amt-", ordGoodsSeq, ordProcSeq));
                        sumItemAdtnCost += goodsCpnAmt;
                      } else if(clmQty > 0) {
                          if(clmQty == realQty){
                              var goodsCpnAmt = Number($("#goods-cpn-amt-"+i).val());
                              sumItemAdtnCost += goodsCpnAmt;
                          }
                          sumAdtnCost += Math.round(costAmt / ordQty) * clmQty;
                      }
                  }
              } else {
                  if(checkPayCpnCncl && ordDtlSctCd != CODE_ORDER_DTL_CODE_RETURN) {
                      var costAmtPayCpn = Number(this.fn_getSumAdtnCostPayCpn($("div[title=gridPromotion]"), "#pr-aply-adtn-cost-amt-", ordGoodsSeq, ordProcSeq, 'Y'));
                      sumAdtnCost += costAmtPayCpn;
                  }
              }

          }
          
          //취소 금액  text box setting
//          var sumSalePrc = Number(this.fn_getSumColid(this.getGoodsList     , "#sale-prc-"));     //판매금액(개당)
//          var sumSaleAmt = Number(this.fn_getSumColid(this.getGoodsList     , "#pur-sale-prc-")); //주문금액(할인가*수량)
          var sumCancelAmt = Number(this.fn_getSumColid(this.getGoodsList   , "#cncl-amt-"));
          var sumReturnAmt = Number(this.fn_getSumColid(this.getGoodsList   , "#rfd-amt-"));
          var sumRealSaleAmt = Number(this.fn_getSumColid(this.getGoodsList , "#sale-prc-"));
          var sum_deli_cost = Number(this.fn_getSumCost($("div[title=gridOrdercost]"), "#c-cost-amt-", CODE_COST_GUBUN_CODE_DELI));               //비용구분 - 배송비

          var sum_real_deli_cost = Number(this.fn_getSumCost($("div[title=gridOrdercost]"), "#c-aply-adtn-cost-amt-", CODE_COST_GUBUN_CODE_DELI));//비용구분 - 배송비
          var sum_wthd_dlex_amt = Number(this.fn_getSumCost($("div[title=gridOrdercost]"), "#c-add-wthd-dlex-amt-", CODE_COST_GUBUN_CODE_DELI));  //비용구분 - 배송비 (회수배송비)
          //오늘드림 고도화 포장비 추가 2020-01-17
          var sum_gift_box_cost = Number(this.fn_getSumCost($("div[title=gridOrdercost]"), "#c-cost-amt-", "70"));               //비용구분 - 선물포장비
          
          // 덤이 있을 때, 실주문금액
//          if (add_real_amt > 0) {
//              sumSaleAmt = sumSaleAmt - add_real_amt;
//          }
//          var dlvp_amt_y = (sumCancelAmt + sumReturnAmt) + sum_deli_cost - sum_real_deli_cost ;
//          var dlvp_amt_n = (sumCancelAmt + sumReturnAmt) + sum_deli_cost + sum_real_deli_cost ;

          // 취소금액 계산
          if (this.dlvpAmtYn) {
//              $("#sum-cancel-amt").val(this.toCurrency((sumCancelAmt + sumReturnAmt) + sum_deli_cost - sum_real_deli_cost - sumAdtnCost));
//              $("#sum-cancel-amt").val(sumCancelAmt + sumReturnAmt + sum_deli_cost - sum_real_deli_cost - sumAdtnCost);   //기존 로직 2020-01-17
              //오늘드림 고도화 포장비 추가 2020-01-14
              $("#sum-cancel-amt").val(sumCancelAmt + sumReturnAmt + sum_deli_cost - sum_real_deli_cost + sum_gift_box_cost - sumAdtnCost);
          } else {
              if(!this.isSuperCharge) {
//                  $("#sum-cancel-amt").val(this.toCurrency((sumCancelAmt + sumReturnAmt) + sum_deli_cost - sum_real_deli_cost - sumAdtnCost));
//                  $("#sum-cancel-amt").val(sumCancelAmt + sumReturnAmt + sum_deli_cost - sum_real_deli_cost - sumAdtnCost);   //기존 로직 2020-01-17
                  //오늘드림 고도화 포장비 추가 2020-01-17
                  $("#sum-cancel-amt").val(sumCancelAmt + sumReturnAmt + sum_deli_cost - sum_real_deli_cost + sum_gift_box_cost - sumAdtnCost);
              } else {
//                  $("#sum-cancel-amt").val(this.toCurrency((sumCancelAmt + sumReturnAmt) + sum_deli_cost + sum_real_deli_cost - sumAdtnCost));
//                  $("#sum-cancel-amt").val((sumCancelAmt + sumReturnAmt) + sum_deli_cost + sum_real_deli_cost - sumAdtnCost); //기존 로직 2020-01-17
                  //오늘드림 고도화 포장비 추가 2020-01-17
                  $("#sum-cancel-amt").val((sumCancelAmt + sumReturnAmt) + sum_deli_cost + sum_real_deli_cost + sum_gift_box_cost - sumAdtnCost);
              }
          }

          // 남은 결제 금액 text box setting
          var order_remain_amt = this.fn_removeComma($("#order-remain-amt").val()) + sumAdtnCost; //dataset_order.NameValue(1, "ORDER_REMAIN_AMT");

          // 반품 금액 text box setting
          var sumReturnAmt = Number(this.fn_getSumColid(this.getGoodsList, "#rfd-amt-"));
//          $("#sum-return-amt").val(this.toCurrency(sumReturnAmt));
          $("#sum-return-amt").val(sumReturnAmt);

          // 반품일 경우, 환불예정/회수지정보탭 노출함
          if(sumReturnAmt > 0) {
//              $("#order-remain-amt").val(this.toCurrency(order_remain_amt - sumReturnAmt - sum_deli_cost ));
              $("#order-remain-amt").val(order_remain_amt - sumReturnAmt - sum_deli_cost );
          } else {
              if (this.dlvpAmtYn) {
//                  $("#sum-remain-amt").val(this.toCurrency(order_remain_amt - (sumCancelAmt + sumReturnAmt) + sumReturnAmt - sum_deli_cost + sum_real_deli_cost));
                  $("#sum-remain-amt").val(order_remain_amt - (sumCancelAmt + sumReturnAmt) + sumReturnAmt - sum_deli_cost + sum_real_deli_cost);
              } else {
//                  $("#sum-remain-amt").val(this.toCurrency(order_remain_amt - (sumCancelAmt + sumReturnAmt) + sumReturnAmt - sum_deli_cost));
                  $("#sum-remain-amt").val(order_remain_amt - (sumCancelAmt + sumReturnAmt) + sumReturnAmt - sum_deli_cost);
              }
          }

          // 취소/반품일 때, 결제정보 노출
          if(this.fn_removeComma( $("#sum-cancel-amt").val()) < 0) {

//              $("#ord-pay-amt").val(this.toCurrency(Number(this.fn_removeComma( $("#sum-cancel-amt").val())*-1)));
              $("#ord-pay-amt").val(Number(this.fn_removeComma( $("#sum-cancel-amt").val())*-1));
              $("#sum-cancel-amt").val(0);
          } else {
              $("#ord-pay-amt").val(0);
          }

          // 화면 제어
//          this.fn_ctrlView(sumCancelAmt, sumReturnAmt, sum_deli_cost, sum_real_deli_cost, sumAdtnCost, sumItemAdtnCost);  //기존로직 2020-01-14
          //오늘드림 고도화 선물포장비 추가 2020-01-17
          this.fn_ctrlView(sumCancelAmt, sumReturnAmt, sum_deli_cost, sum_real_deli_cost, sumAdtnCost, sumItemAdtnCost, sum_gift_box_cost);
//          this.fn_ctrlView(sumCancelAmt, sumReturnAmt, sum_deli_cost, sum_real_deli_cost, sumAdtnCost);
      }
      , fn_uni : function(arr) {
//          console.log('# fn_uni # 함수 호출');

          var a = {};
          for(var i=0;i<arr.length;i++){
              if(typeof a[arr[i]] == 'undefined')
                  a[arr[i]] = 1;
          }

          arr.length = 0;
          for(var i in a)
              arr[arr.length] = i;

          return arr;
      }
      //덤 실추가수량, 기준추가수량 계산
      , fn_getSumAddQty : function($dataset, colid, goodsNo) {
//          console.log('# fn_getSumAddQty # 함수 호출');

          var result = 0;
          if ($dataset.size() < 0) return result;
          for (var idx = 0; idx < this.getGoodsListSize; idx++) {
              if(goodsNo == $(colid+idx).val()) {
                  result += Number($(colid+idx).val());
              }
          }
          return result;
      }
      , fn_getSumCost : function($dataset, colid, costgubun) {
//        console.log('# fn_getSumCost # 함수 호출');

          var result = 0;
          if ($dataset.size() < 0) return result;
          for(i=0; i< $dataset.size(); i++) {
              if($("#c-adtn-cost-aply-shp-cd-"+i).val() == costgubun) {
                  result += Number($(colid+i).val());
              }
          }
          return result;
      }
      , fn_getSumAdtnCostPayCpn : function($dataset, colid, ordGoodsSeq, ordProcSeq, payCpnYn) {
//          console.log('# fn_getSumAdtnCostPayCpn # 함수 호출');

          var goodsCpn = 0;
          var payCpn = 0;

          for(var i=0; i < $dataset.size(); i++) {

              if ( ordGoodsSeq == $("#pr-ord-goods-seq-"+i).val() ) {
                  if($("#pr-adtn-cost-dtl-sct-cd-"+i).val() == "C105") {
                      payCpn += Number($(colid+i).val());
                  } else {
                      goodsCpn += Number($(colid+i).val());
                  }
              }
          }
          return payCpnYn == 'Y'? payCpn : goodsCpn;
      }
      , fn_getSumColid : function($dataset, colid) {
//          console.log('# fn_getSumColid # 함수 호출');

          var result = 0;
          if ($dataset.size() < 0) return result;
          for(i=0; i< this.getGoodsListSize; i++) {

              result += Number($(colid+i).val());
          }
          return result;
      }
      , fn_changeClmCausCd : function(clm_caus_cd) {
//          console.log('# fn_changeClmCausCd # 함수 호출');

          var $gridOrdercost = $("div[title=gridOrdercost]");
          var maxOrdDtlSctCd = "0";
          for(var i=0; i<this.getGoodsListSize; i++) {
//          $.each(this.getGoodsList, function(n) {
              var ordPrgsStatCd = $("#ord-prgs-stat-cd-"+i).val();
              maxOrdDtlSctCd = maxOrdDtlSctCd < ordPrgsStatCd ? ordPrgsStatCd : maxOrdDtlSctCd;
          }//);
          var order_proc_stat_code = maxOrdDtlSctCd;

          for (var i = 0; i < this.getGoodsListSize; i++) {

              var rowCheck = $("#check-"+i).is(":checked");
              if (rowCheck) {

                  if (order_proc_stat_code > CODE_ORDER_PROC_STAT_CODE_ORDER_SHIP_INDICATE) { //주문진행상태(주문) : 출하지시

                      // 회수비 강제 셋팅
                      if (clm_caus_cd == "301" || clm_caus_cd == "306" || clm_caus_cd == "309" || clm_caus_cd == "324" ) {

                          $("#wthd-cost-chrg-sub-cd").val("10"); //고객
                          this.isSuperCharge = true;
                      } else {
                          $("#wthd-cost-chrg-sub-cd").val("20"); //자사
                          this.isSuperCharge = false;
                      }
                  } else {
                      if (clm_caus_cd == "212" || clm_caus_cd == "219" || clm_caus_cd == "221" ) {

                          $("#wthd-cost-chrg-sub-cd").val("10"); //고객
                          this.isSuperCharge = true;
                      } else {
                          $("#wthd-cost-chrg-sub-cd").val("20"); //자사
                          this.isSuperCharge = false;
                      }
                      
                      var isChange = false;
                      $.each($("input[name=arrUpdateYn]"), function() {
                          if(!isChange) {
                              isChange = 'Y' == $(this).val();
                          } else {
                              return false;
                          }
                      });
                      if(!isChange) {
                          this.isSuperCharge = false;
                      }
                  }
              }
          }

          for (var i = 0; i < this.getGoodsListSize; i++) {

              // 점포직배는 추가배송비 발생안함 //주문진행상태(주문) : 출하지시
              if ($("#dlv-shp-cd-"+i).val() != "10" && order_proc_stat_code > CODE_ORDER_PROC_STAT_CODE_ORDER_SHIP_INDICATE) {
                  
                  for(var n = 0; n < $gridOrdercost.size; n++) {
                      
                      var dlex_occur_sct_cd = $("#c-dlex-occur-sct-cd-"+n).val();
                      var aply_adtn_cost_amt = Number($("#c-aply-adtn-cost-amt-"+n).val());
                      var org_dprice_amt = 0;
                      
                      // 배송번호가 같고, 추가배송이 아닌 것
                      if ($("#c-dlv-no-"+n).val() == $("#dlv-no-"+i).val() && dlex_occur_sct_cd != '05') {
                          
                          if(this.isSuperCharge) { //추가배송비 발생
                              
                              org_dprice_amt = Number($("#c-dprice-amt-"+n).val());
                              $("#c-add-dprice-amt-"+n).val(org_dprice_amt);
                              $("#c-aply-adtn-cost-amt-"+n).val(aply_adtn_cost_amt + org_dprice_amt);
                          } else {
                              org_dprice_amt = Number($("#c-org-dprice-amt-"+n).val());
                              $("#c-add-dprice-amt-"+n).val(0);
                              $("#c-aply-adtn-cost-amt-"+n).val(aply_adtn_cost_amt - org_dprice_amt);
                          }
                      }
                  }
              }
          }
      }
      , fn_ctrlView : function(ordTotSalePrc, sumReturnAmt, sum_deli_cost, sum_real_deli_cost, sumAdtnCost, sumItemAdtnCost, sum_gift_box_cost) {
//      , fn_ctrlView : function(ordTotSalePrc, sumReturnAmt, sum_deli_cost, sum_real_deli_cost, sumAdtnCost, sumItemAdtnCost) {    //기존로직 2020-01-17
//      , fn_ctrlView : function(ordTotSalePrc, sumReturnAmt, sum_deli_cost, sum_real_deli_cost, sumAdtnCost) {
//          console.log('# fn_ctrlView # 함수 호출');
//          console.log(arguments);

//          var totalDelxAmt = sum_deli_cost > 0 ? sum_deli_cost : (-sum_real_deli_cost);
//          var totalDelxAmt = this.isCancelAll() ? sum_deli_cost : (sum_deli_cost > 0 ? 0 : (-sum_real_deli_cost));
          var totalDelxAmt = sum_deli_cost - sum_real_deli_cost;
          // #1. 취소금액 설정
//          var cnclTotAmt = ordTotSalePrc + totalDelxAmt;  //기존로직 2020-01-17
          var cnclTotAmt = ordTotSalePrc + totalDelxAmt + sum_gift_box_cost;
          $("#ctrl_cnclTotAmt").val(this.fn_addCommaWon(cnclTotAmt));
          $("#ctrl_cnclGoodsTotAmt").html(this.fn_addCommaWon(ordTotSalePrc));
          $("#ctrl_cnclDelxAmt").html(this.fn_addCommaWon(totalDelxAmt));
          //오늘드림 고도호 선물포장비 추가 2020-01-17
          $("#ctrl_cnclGiftBoxAmt").html(this.fn_addCommaWon(sum_gift_box_cost));

          // #2. 쿠폰할인금액 차감 설정
//          var totGoodsCpnAmt = 0;
//          for (var i = 0; i < this.getGoodsList.size(); i++) {
//              totGoodsCpnAmt += this.fn_getGoodsCpnAmt(i);
//          }
//          var totAplyAdtnCostAmt = totGoodsCpnAmt + sumAdtnCost;
          var totAplyAdtnCostAmt = sumItemAdtnCost + sumAdtnCost;
          $("#ctrl_totAplyAdtnCostAmt").html(this.fn_addCommaWon(totAplyAdtnCostAmt, totAplyAdtnCostAmt != 0 ? true : false));
          $("#ctrl_aplyAdtnCostAmt-C103").html(this.fn_addCommaWon(sumItemAdtnCost, sumItemAdtnCost != 0 ? true : false));
//          $("#ctrl_aplyAdtnCostAmt-C103").html(this.fn_addCommaWon(totGoodsCpnAmt, totGoodsCpnAmt != 0 ? true : false));
          $("#ctrl_aplyAdtnCostAmt-C105").html(this.fn_addCommaWon(sumAdtnCost, sumAdtnCost != 0 ? true : false));

          var mainPaymeanCd = $("#mainPaymeanCd").val();
          mainPaymeanCd = 'undefined' == typeof mainPaymeanCd ? '' : mainPaymeanCd;
          var payPrgsStatCd = $("#payPrgsStatCd").val();
          payPrgsStatCd = 'undefined' == typeof payPrgsStatCd ? '' : payPrgsStatCd;
          
          var remainAmt = cnclTotAmt - totAplyAdtnCostAmt;
          
          if(mainPaymeanCd == '61' && payPrgsStatCd != '20'){
              $("#mainAmt").val($("#bankPayAmt").val());
          }
          
          var mainAmt = Number($("#mainAmt").val());
          var tempMainAmt = mainAmt;
          var subPayAmt = 0;
          if(mainAmt > 0) {
              mainAmt = mainAmt - remainAmt;
              if(mainAmt < 0) {
                  subPayAmt = Math.abs(mainAmt);
              }
          }

          if(tempMainAmt < 0 || tempMainAmt == 0) {
              subPayAmt = remainAmt;
          }
          // #3. 환불예정금액 설정
          // ordTotSalePrc + totalDelxAmt - totAplyAdtnCostAmt - subPayAmt - cjMemberDscntAmt - cjDscntAmt
          var totPayAmt = remainAmt - subPayAmt;
          
          $("#ctrl_totPayAmt").html(this.fn_addCommaWon(totPayAmt, false));
          
          var $objPayment = $("input[name=arrPayMeanCd]");
          
          var isChange = false;
          $.each($("input[name=arrUpdateYn]"), function() {
              if(!isChange) {
                  isChange = 'Y' == $(this).val();
              } else {
                  return false;
              }
          });
          
          for(var n=0; n < $objPayment.size(); n ++) {
              var arrPayMeanCd = $("input[name=arrPayMeanCd]").eq(n).val();
              
              if(arrPayMeanCd == mainPaymeanCd){
                  if(!isChange) {
                      $("input[name=arrPayAmt]").eq(n).val($("#mainAmt").val());
                  }else{
                      $("input[name=arrPayAmt]").eq(n).val(totPayAmt);
                  }
              }
          }
          
          this.fn_calcReturn(subPayAmt);
      }
      , fn_calcReturn : function(etcAmt) {
//          console.log('# fn_calcReturn # 함수 호출');

          var $objPayGroup = $("input[name=arrPayMeanCd]");
          // 31:예치금 → 12:CJ ONE POINT → 28:브랜드 기프트카드(올리브영) → 27:그룹 기프트카드(CJ) → 13:카페테리아
          var arrReturnSeqMap = ['31','12','28','27','13'];
//          var arrReturnSeqMap = ['13','27','28','12','31']; // 역으로

          var isChange = false;
          $.each($("input[name=arrUpdateYn]"), function() {
              if(!isChange) {
                  isChange = 'Y' == $(this).val();
              } else {
                  return false;
              }
          });
          if(!isChange) {
              CHG_ACCP_SCT_CD_YN = 'Y';
              if(etcAmt != $("#subPayAmt").val()){
                  var subPayAmt = Number($("#subPayAmt").val());
                  
                  var gapAmt = Math.abs(subPayAmt - etcAmt);
                  var tempEtcAmt = etcAmt;
                  for(var i=0; i < arrReturnSeqMap.length; i++) {
                      
                      for(var n=0; n < $objPayGroup.size(); n ++) {
                          
                          var paymeancd = $objPayGroup.eq(n).val();
                          if(arrReturnSeqMap[i] == paymeancd) {
                              
                              var rfdPsblmoAmt = Number($objPayGroup.eq(n).data("rfdpsblmoamt"));
                              etcAmt -= rfdPsblmoAmt;
                              var result = etcAmt > 0 ? rfdPsblmoAmt : tempEtcAmt;
                              if(i > 0 && tempEtcAmt <= 0) {
                                  result = 0;
                              }
                              $("#ctrl_payAmt_"+paymeancd).html(this.fn_addCommaWon(result, result != 0 ? true : false));
                              $("input[name=arrPayAmt]").eq(n).val(Math.abs(result));
                              tempEtcAmt = tempEtcAmt > 0 ? etcAmt : tempEtcAmt;
                              etcAmt = Math.abs(etcAmt);
                          }
                      }
                  }
              }else{
                  for(var i=0; i < arrReturnSeqMap.length; i++) {
                      
                      for(var n=0; n < $objPayGroup.size(); n ++) {
                          
                          var paymeancd = $objPayGroup.eq(n).val();
                          if(arrReturnSeqMap[i] == paymeancd) {
                              
                              var rfdPsblmoAmt = Number($objPayGroup.eq(n).data("rfdpsblmoamt"));
                              $("#ctrl_payAmt_"+paymeancd).html(this.fn_addCommaWon(rfdPsblmoAmt, rfdPsblmoAmt != 0 ? true : false));
                              $("input[name=arrPayAmt]").eq(n).val(rfdPsblmoAmt);
                          }
                      }
                  }
              }
          } else {
              CHG_ACCP_SCT_CD_YN = 'N';
              var subPayAmt = Number($("#subPayAmt").val());
              
              var gapAmt = Math.abs(subPayAmt - etcAmt);
              var tempEtcAmt = etcAmt;
              if(etcAmt > 0 && gapAmt > 0) {
                  for(var i=0; i < arrReturnSeqMap.length; i++) {
                      
                      for(var n=0; n < $objPayGroup.size(); n ++) {
                          
                          var paymeancd = $objPayGroup.eq(n).val();
                          if(arrReturnSeqMap[i] == paymeancd) {
                              
                              var rfdPsblmoAmt = Number($objPayGroup.eq(n).data("rfdpsblmoamt"));
                              etcAmt -= rfdPsblmoAmt;
                              var result = etcAmt > 0 ? rfdPsblmoAmt : tempEtcAmt;
                              if(i > 0 && tempEtcAmt <= 0) {
                                  result = 0;
                              }
                              $("#ctrl_payAmt_"+paymeancd).html(this.fn_addCommaWon(result, result != 0 ? true : false));
                              $("input[name=arrPayAmt]").eq(n).val(Math.abs(result));
                              tempEtcAmt = tempEtcAmt > 0 ? etcAmt : tempEtcAmt;
                              etcAmt = Math.abs(etcAmt);
                          }
                      }
                  }
              }else{
                  for(var i=0; i < arrReturnSeqMap.length; i++) {
                      
                      for(var n=0; n < $objPayGroup.size(); n ++) {
                          var paymeancd = $objPayGroup.eq(n).val();
                          if(arrReturnSeqMap[i] == paymeancd) {
                              var result = 0;
                              $("#ctrl_payAmt_"+paymeancd).html(this.fn_addCommaWon(result, result != 0 ? true : false));
                              $("input[name=arrPayAmt]").eq(n).val(Math.abs(result));
                          }
                      }
                  }
              }
          }
          
          var totalCtrl_subPayAmt = 0;
          
          for(var i=0; i < arrReturnSeqMap.length; i++) {
              
              for(var n=0; n < $objPayGroup.size(); n ++) {
                  var paymeancd = $objPayGroup.eq(n).val();
                  if(arrReturnSeqMap[i] == paymeancd) {
                      totalCtrl_subPayAmt += Number($("input[name=arrPayAmt]").eq(n).val());
                  }
              }
          }
          
           // #4. 포인트 및 기타결제 반환 설정
          $("#ctrl_subPayAmt").html(this.fn_addCommaWon(totalCtrl_subPayAmt, totalCtrl_subPayAmt != 0 ? true : false));
      }
      , fn_addComma :function (num) {
//        console.log('# addComma # 함수 호출');

          var len, point, str;
          num = num + "";
          point = num.length % 3 ;
          len = num.length;
          str = num.substring(0, point);
          while (point < len) {
              if (str != "") str += ",";
              str += num.substring(point, point + 3);
              point += 3;
          }
          return str;
      }
      , fn_addCommaWon : function(num, isNegative, isNotEm) {
//        console.log('# fn_addCommaWon # 함수 호출');

          var sign = "";
          var firstChar = String(num).substring(0,1);
          if(firstChar == "-") {
              sign = firstChar;
              num = Math.abs(num);
          }

          var len, point, str;
          num = num + "";
          point = num.length % 3 ;
          len = num.length;
          str = num.substring(0, point);
          while (point < len) {
              if (str != "") str += ",";
              str += num.substring(point, point + 3);
              point += 3;
          }
          return (isNegative || "" != sign ? '-' : '') + str + (isNotEm ? '원' : '<em>원</em>');
      }
      , fn_removeComma : function (strNum) {
//        console.log('# fn_removeComma # 함수 호출');

          strNum = strNum.substr(0, strNum.indexOf("<")).replace(/,/g, '');
          var num = Number(strNum);
          return num;
      }
      , fn_ckNumDfZero : function (value) {
          return 'undefined' == typeof value ? 0 : value;
      }
      , fn_setGoods : function($trGoods) {
//        console.log('# fn_setGoods # 함수 호출');

          var promNo = $trGoods.data("prom-no");
          if('' != promNo) {
              var goodsIdx = null;
              var index = 0;
              for(var i=0; i<this.getGoodsListSize; i++) {
                  var isPack = promNo == this.getGoodsInfo(i).data("prom-no");
                  
                  // 선택된 세트상품 index
                  if(index == 0 && isPack) {
                      goodsIdx = i;
                      index++;
                  }
              }
              if(null != goodsIdx) {
                  goodsIdx = this.fn_sumNumber(goodsIdx, $trGoods.data("prom-cnt"));
//                  var $objProm = $("#goods-" + this.fn_sumNumber(goodsIdx, promCnt));
//                  $objProm.find("input[name=arrRowCheck]").prop("checked", false);
                  $("#tot-buy-qty-" + goodsIdx).val();
              }
          }
      }
      /**
       * N+1상품 전체 체크 확인
       */
      , fn_getIsAllProm : function(idx, isAllDisable) {
        console.log('# fn_getIsAllProm # 함수 호출');

          var idxS = this.fn_getPromGoodsIndexS(idx);
          var idxE = this.fn_getPromGoodsIndexE(idx);
          var isCheck = false;
          var n = 0;
          for(var i=idxS; i<idxE; i++) {

              var isThisCheck = $("#check-" + i).is(":checked");
              if(isAllDisable) {
                  isCheck = isCheck || isThisCheck
              } else {
                  isCheck = (0 == n++ ? true : isCheck) && isThisCheck;
              }
          }
          return isAllDisable ? !isCheck : isCheck;
      }
      /**
       * N+1상품 시작 Index 조회
       */
      , fn_getPromGoodsIndexS : function(idx) {
//          console.log('# fn_getPromGoodsIndexS # 함수 호출');

          var $obj = this.getGoodsInfo(idx);
          var goodsIdx = idx;
          var promNo = $obj.data("prom-no");
          if('' != promNo) {
              var index = null;
              for(var i=idx; i>=0; i--) {
                  var $objGoods = $("#goods-"+i);
                  var forPromNo = $objGoods.data("prom-no");
                  var isPromFirst = $objGoods.hasClass("first");
                  if(promNo == forPromNo && isPromFirst) {
                      index = i;
                      break;
                  }
              }
              if(null != index) {
                  goodsIdx = index;
              }
          }
          return goodsIdx;
      }
      /**
       * N+1상품 종료 Index 조회
       */
      , fn_getPromGoodsIndexE : function(idx) {
//          console.log('# fn_getPromGoodsIndexE # 함수 호출');

          var $obj = this.getGoodsInfo(idx);
          var goodsIdx = idx;
          var promNo = $obj.data("prom-no");
          if('' != promNo) {
              var index = null;
              for(var i=idx; i<this.getGoodsListSize; i++) {
                  var $objGoods = $("#goods-"+i);
                  var forPromNo = $objGoods.data("prom-no");
                  var isPromLast = $objGoods.hasClass("last");
                  if(promNo == forPromNo && isPromLast) {
                      index = i+1;
                      break;
                  }
              }
              if(null != index) {
                  goodsIdx = index;
              }
          }
          return goodsIdx;
      }
      /**
       * type - i: input  , s:select
       * obj  - type object's obj
       */
      , fn_ckSetGoods : function(type, obj) {
        console.log('# fn_ckSetGoods # 함수 호출');
          
          if('i' == type) {
              $(obj).siblings("input[name=arrRowCheck]").val($(obj).is(":checked") ? 'Y' : 'N');
              $(obj).parent().find("select").prop("disabled", !$(obj).is(":checked"));

              if('20' == $("#chg-accp-sct-cd").val()) {
                  var idx = $(obj).parent().parent().data("goods-idx")-1;
                  var buyQty = this.fn_getGoodsQty(true, idx);
                  var getQty = this.fn_getGoodsQty(false, idx);
                  var buyCondStrtQtyAmt = Number($("#buy-cond-strt-qty-amt-" + idx).val());
                  $("#clm-caus-cd").val(""); // 클레임 사유 초기화
                  if(buyQty < buyCondStrtQtyAmt) {
                      this.fn_CalcGoodsList('A');
                  }
              }
          } else {
              // if('s' == type)
              $(obj).parent().find("input[name=arrOrdQty]").val($(obj).val());
          }
      }
      , fn_checkAllProm : function(idx) {
//        console.log('# fn_checkAllProm # 함수 호출');

          var idxE = this.fn_getPromGoodsIndexE(idx);
          var $objGetGoods = $("#goods-"+idxE);
          for(var n=this.fn_getPromGoodsIndexS(idx); n<idxE; n++) {
              $("#check-" + n).prop("checked", true);
              this.getGoodsInfo(n).find("select").prop("disabled", false);
          }
          this.fn_setCheckBox($objGetGoods.find("[name=arrRowCheck]"), true);
          $objGetGoods.find("input[type=checkbox], select").prop("disabled", false);
          $("#disabled_"+idxE).val("false");
      
          this.fn_CalcGoodsList('A');
      }
      , fn_sumNumber : function() {
//        console.log('# fn_sumNumber # 함수 호출');

          var total = 0;
          for(var i=0; i<arguments.length; i++) {
              total += Number(arguments[i]);
          }
          return total;
      }
      , fn_ckDistinctNode : function(obj, isJqObj) {
//          console.log('# fn_ckDistinctNode # 함수 호출');

          var $obj = isJqObj ? obj : $(obj);
          var idx = $obj.data("idx");
          // 프로모션 여부
          var isProm = '' != this.getGoodsInfo(idx).data("prom-no");
          // 프로모션(N+1) 여부
//          var isNProm = 'Y' == $("input[name=arrNPromYn]").eq(idx).val();
          // [공통] INPUT CHECK 설정
          var isCheck = $obj.is(":checked");
          $obj.siblings("[name=arrRowCheck]").val(isCheck ? 'Y' : 'N');

          var isAC = false;
          if($("#goods-"+idx).data("trade-shp-cd") == '1' && 'Y' == ALL_CANCEL_PROCESS1_YN) {
              isAC = true;
          }
          if($("#goods-"+idx).data("trade-shp-cd") == '3' && 'Y' == ALL_CANCEL_PROCESS3_YN) {
              isAC = true;
          }

          var mainPaymeanCd = $("#mainPaymeanCd").val();
          mainPaymeanCd = 'undefined' == typeof mainPaymeanCd ? '' : mainPaymeanCd;
          var payPrgsStatCd = $("#payPrgsStatCd").val();
          payPrgsStatCd = 'undefined' == typeof payPrgsStatCd ? '' : payPrgsStatCd;
          var isNotNoPayBank = !(mainPaymeanCd == '61' && payPrgsStatCd == '10');
          if(isNotNoPayBank && 'Y' != ALL_CANCEL_PROCESS_YN) {
//              this.getGoodsInfo(idx).find("select").prop("disabled", !isCheck);
              if(!isAC) {
                  $("#ord-qty-"+idx).attr("disabled", !isCheck);
              }
          }
/*
          if(!isCheck) {
              $(':radio[name="openYn-'+idx+'"]').prop('disabled', true);
          } else {
              if(!isAC) {
                  $(':radio[name="openYn-'+idx+'"]').prop('disabled', false);
              }
          }
*/
          // 프로모션
          if(isProm) {
              // GET군 CHECK 설정
              var idxS = this.fn_getPromGoodsIndexS(idx);
              var idxE = this.fn_getPromGoodsIndexE(idx);
              var $objGetGoods = $("#goods-"+idxE);
              var isDisabled = this.fn_getIsAllProm(idx, true);
              var isOneGetGoods = 1 == $objGetGoods.find(".getGoods").size();
              
              var buyQty = this.fn_getGoodsQty(true, idx);
              var buyCondStrtQtyAmt = Number($("#buy-cond-strt-qty-amt-" + idx).val());

              var chgAccpSctCd = $("#chg-accp-sct-cd").val();

              if(chgAccpSctCd != '20') {
                  if(!isJqObj || isOneGetGoods) {
                  //if(!isJqObj && typeof(isJqObj) != undefined && typeof(isJqObj) != 'undefined' && isOneGetGoods) {
                      var tempAdtnCostNos = "";
                      for(var i=0; i<this.getGoodsListSize; i++) {
                          var buyGoodsChk = $("#check-" + i).is(":checked");

                          if(buyGoodsChk) {
                              var $trobj = this.getGoodsInfo(i);
                              var buyAdtnCostNos = String($trobj.data("adtn-cost-nos")).split(",");

                              for(var j=0; j<buyAdtnCostNos.length; j++) {
                                  for(var a=0; a<$objGetGoods.find("div.getGoods").size(); a++) {
                                      if(buyAdtnCostNos[j] == $objGetGoods.find("div.getGoods").eq(a).data("prom-adtn-cost-nos")) {
                                          if(tempAdtnCostNos == '') {
                                              tempAdtnCostNos = buyAdtnCostNos[j];
                                          } else {
                                              tempAdtnCostNos = tempAdtnCostNos + "," + buyAdtnCostNos[j];
                                          }
                                      }
                                  }
                              }
                          }
                      }
                      var getChkAdtnCostNos = tempAdtnCostNos.split(",");
                      if(!isJqObj) {
                          this.fn_setCheckBox($objGetGoods.find("[name=arrRowCheck]"), false);
                      }

                      $objGetGoods.find("input[type=checkbox], select").prop("disabled", true);
                      
                      for(var j=0; j<getChkAdtnCostNos.length; j++) {
                          for(var a=0; a<$objGetGoods.find("div.getGoods").size(); a++) {
                              if(!isJqObj && getChkAdtnCostNos[j] == $objGetGoods.find("div.getGoods").eq(a).data("prom-adtn-cost-nos")){
                                  if ($objGetGoods.find("div.getGoods").eq(a).data("prom-exc-psb-yn") == "Y" || $objGetGoods.find("div.getGoods").eq(a).data("prom-exc-psb-yn") == "T") {
                                      this.fn_setCheckBox($objGetGoods.find("[name=arrRowCheck]"), true);
                                      $objGetGoods.find("input[type=checkbox]").eq(a).prop("disabled", false);
                                      $objGetGoods.find("select").eq(a).prop("disabled", false);
                                  }
                                  
                                  $.each($objGetGoods.find("[name=arrRowCheck]").parent().find("input[name=promExchPsb]"), function(n) {
                                      
                                      if ($objGetGoods.find("[name=arrRowCheck]").parent().find("input[name=promExchPsb]").eq(n).prop("value") == "S"){
                                          
                                          $objGetGoods.find("input[name=arrPromCheck]").eq(n).prop("checked",true);
                                          $objGetGoods.find("input[name=arrRowCheck]").eq(n).prop("value","Y");
                                          
                                      } else {
                                          $objGetGoods.find("input[name=arrPromCheck]").eq(n).prop("checked",false);
                                          $objGetGoods.find("input[name=arrRowCheck]").eq(n).prop("value","N");
                                      }
                                      

                                      
                                  });
                                  
                              }
                          }
                      }
                      
                      if(isOneGetGoods) {
                          this.fn_setCheckBox($objGetGoods.find("[name=arrRowCheck]"), buyQty < buyCondStrtQtyAmt ? false : !isDisabled);
                          $objGetGoods.find("input[type=checkbox], select").prop("disabled", isOneGetGoods ? true : isDisabled);
                      }
                  }
              } else {
                  var $objPromDisabled = $("#disabled_"+this.fn_getPromGoodsIndexE(idx));
                  if('true' == $objPromDisabled.val() && buyQty >= buyCondStrtQtyAmt) {
                      this.fn_checkAllProm(idx);
                  } else {
                      var totRealQty = this.fn_getGoodsQty(true, idx, true);
                      var remainQty = buyQty % buyCondStrtQtyAmt;
                      
                      if(totRealQty == buyCondStrtQtyAmt && remainQty !=0 && idxE - idxS == 2 && !isJqObj){
                          var chk = $("#check-" + idx).is(":checked");
                          
                          this.fn_setCheckNDisableGroup(idx, chk);
                      }else{
                          var getQty = this.fn_getGoodsQty(false, idx);
                          if(getQty > buyQty / buyCondStrtQtyAmt) {
                              this.fn_setCheckBox($objGetGoods.find("[name=arrRowCheck]"), false);
                              $objGetGoods.find("select").prop("disabled", true);
                              
                          }
                      }
                      
//                      $objGetGoods.find("select").prop("disabled", true);
                  }
                  var isAllCheck = this.fn_isAllCheck(idxS, idxE);
                  if((isDisabled) || isOneGetGoods || (isAllCheck && !isJqObj)) {
                      this.fn_setCheckBox($objGetGoods.find("[name=arrRowCheck]"), buyQty < buyCondStrtQtyAmt ? false : !isDisabled);
                      $objGetGoods.find("input[type=checkbox], select").prop("disabled", isOneGetGoods ? true : isDisabled);
                      if(isDisabled) {
                          $objPromDisabled.val(isDisabled);
                      }
                  }
                  
                  if(!isDisabled && !isOneGetGoods && isNotNoPayBank && 'Y' != ALL_CANCEL_PROCESS_YN) {
//                  this.fn_setCheckBox($objGetGoods.find("[name=arrRowCheck]"), !isDisabled);
                      if(!isAC) {
                          $objGetGoods.find("input[type=checkbox]").prop("disabled", false);
                      }
                  }
              }
              
              var $objGet = $("#goods-"+idxE);
              if(isOneGetGoods) {
                  var buyCondStrtQtyAmt = Number($("#buy-cond-strt-qty-amt-"+idx).val());
                  var changeGetQty = Math.floor(buyQty / buyCondStrtQtyAmt);
                  
                  if(changeGetQty != 0){
                      $objGet.find("select[name=arrPromQty]").val(changeGetQty);
                      $objGet.find("select[name=arrPromQty]").siblings("[name=arrOrdQty]").val(changeGetQty);
                  }
              }
          }
      }
      /**
       * @desc : 프로모션 체크박스 설정
       */
      , fn_setCheckNDisableGroup : function(idx, isCheck) {
//          console.log('# fn_setCheckNDisableGroup # 함수 호출');
          
          var idxS = this.fn_getPromGoodsIndexS(idx);
          var idxE = this.fn_getPromGoodsIndexE(idx);
          for(var i=idxS; i<=idxE; i++) {
              this.fn_setCheckBox(this.getGoodsInfo(i).find("[name=arrRowCheck]"), isCheck);
              this.getGoodsInfo(i).find("select").prop("disabled", !isCheck);
          }
      }
      /**
       * @desc : 체크박스 설정
       */
      , fn_setCheckBox : function($obj, isCheck) {
//        console.log('# fn_setCheckBox # 함수 호출');
          
          if (!isCheck) {
              $obj.siblings("[type=checkbox]").prop("checked", false);
              $obj.val( 'N');
              
          }
          
          if ($obj.siblings("[name=promExchPsb]").prop("value") == "S" || typeof($obj.siblings("[name=promExchPsb]").prop("value")) == 'undefined') {
              
          $obj.siblings("[type=checkbox]").prop("checked", isCheck);
          $obj.val(isCheck ? 'Y' : 'N');
        } 
      }
      , fn_getPromClmQty : function() {
//        console.log('# fn_getPromClmQty # 함수 호출');

          var $obj = this.getGoodsInfo(idx);
          var goodsIdx = null;
          var promNo = $obj.data("prom-no");
          if('' != promNo) {
              var adtnCostNos = $obj.data("adtn-cost-nos");
              var index = 0;
              for(var i=0; i<this.getGoodsListSize; i++) {
                  var isPack = adtnCostNos == this.getGoodsInfo(i).data("adtn-cost-nos");
                  
                  // 선택된 세트상품 index
                  if(index == 0 && isPack) {
                      goodsIdx = i;
                      index++;
                  }
              }
              if(null != goodsIdx) {
                  goodsIdx = this.fn_sumNumber(goodsIdx, $obj.data("prom-cnt"));
              }
          }
          return goodsIdx;
      }
      /**
       * @desc    : 프로모션(N+1) 체크
       */
      , fn_checkSetGoods : function() {
//          console.log('# fn_checkSetGoods # 함수 호출');
          
          var returnCode = '';
          var indexProcess = 0;
          while(indexProcess < this.getGoodsListSize) {

              if(!$("#check-" + indexProcess).is(":checked")) {

                  var isProm = '' != this.getGoodsInfo(indexProcess).data("prom-no");
//                  getPromGoodsYn = $("#getPromGoodsYn-"+indexProcess).val();
//                  indexProcess = isProm && 'Y' == getPromGoodsYn ? this.fn_getPromGoodsIndexE(indexProcess) : indexProcess;
                  if(indexProcess != this.getGoodsListSize) {
                      indexProcess++;
                      continue;
                  }
              }
              var isProm = '' != this.getGoodsInfo(indexProcess).data("prom-no");

//              var isProm = 'Y' == $("[name=arrNPromYn]").eq(indexProcess).val();
              var n = $("#buy-cond-strt-qty-amt-" + indexProcess).val();
              if(isProm) {
                  returnCode = this.fn_checkEachSetGoods(indexProcess);
              } else {
                  returnCode = 'Y';
              }
              if('Y' != returnCode) {
                  /*
                   * [0] : 성공여부
                   * [1] : 취소코드(
                   *          1: BUY군이 세트단위가 아니어서
                   *          2: BUY군 수량에 따른 GET군 수량 계산과 일치하지 않아서
                   *      )
                   * @TODO: (추후 필요시) 코드별 메시지가 다를 경우 코드별 메시지 설정
                   */
                  var arrReturnCode = returnCode.split(':');
                  var msg = '';
                  if('3' == arrReturnCode[1]) {
                      msg = '주문취소가 불가능한 상품입니다.\n문의 사항은 올리브영 고객센터(1522-0882)를 이용해 주세요.';
                  } else if ('T' == returnCode) {
                      msg = '선택하신 상품은 현재 교환 접수가 불가능한 상태 입니다. \n( 판매종료 및 재고부족 등)\n\n'+n + '+1 상품의 경우 교환 접수된 모든 상품의 \n재고 및 판매종료 상태에 따라 교환이 불가할 수 있습니다.\n\n추가로 안내가 필요하신 경우\n'
                      msg += '올리브영 온라인몰 고객센터(1522-0882) 또는 \n1:1 문의로 남겨주시면 신속하게  도움 드리겠습니다.';
                  } else {
                      msg = this.fn_alertSelectProm(n);
                  }
                  alert(msg);
                  break;
              }

              if(isProm) {
                  indexProcess = this.fn_getPromGoodsIndexE(indexProcess);
              }
              
              indexProcess++;
          }
          return 'Y' != returnCode;
      }
      /**
       * @desc    : 세트상품별 체크
       * @param   : {
       *      idxBuy : BUY군 시작 INDEX
       * }
       */
      , fn_checkEachSetGoods : function(idxBuy) {
//          console.log('# fn_checkEachSetGoods # 함수 호출');

          var buyCondStrtQtyAmt = $("#buy-cond-strt-qty-amt-" + idxBuy).val();
          
          // #1. BUY군 수량 설정
          var totRealQty = 0;
          var idxS = this.fn_getPromGoodsIndexS(idxBuy);
          var idxE = this.fn_getPromGoodsIndexE(idxBuy);
          for(var i=idxS; i < idxE; i++) {
              totRealQty += Number($("#real-qty-"+i).val());
          }
          var buyQty = this.fn_getGoodsQty(true, idxBuy);
          
          //남은수량
          var remainQty = buyQty % buyCondStrtQtyAmt;
          var totRemainder = totRealQty % buyCondStrtQtyAmt;
          
          var returnCode = '';
          if('' == returnCode) {
              // #2. BUY군 세트단위 취소 체크
              var n = 1;
              var countAmt = 0;
              do {
                  countAmt = n * buyCondStrtQtyAmt;
                  if(buyQty+remainQty == countAmt || totRealQty == buyQty) {
                      returnCode = 'Y';
                      break;
                  }
                  n++;
              } while(countAmt < totRealQty);
              if(!returnCode) {
                  return 'N:1';
              }
              if(totRealQty == buyCondStrtQtyAmt && remainQty !=0){
                  return 'N:1';
              }
              
              if(totRemainder == 0 && remainQty != 0){
                  return 'N:1';
              }
              // #3. GET군 수량 설정
              var getQty = this.fn_getGoodsQty(false, idxBuy);
              var getGoodsCnt = 0;
              if ($("#chg-accp-sct-cd").val() =="40"){
                  
                  for(var i=idxS; i<=idxE; i++) {
//                      console.log("idxS=["+idxS+"/idxE="+idxE);
                      //console.log("this_val=["+this.getGoodsInfo(i).parent().find("input[name=promExchPsb]").eq(i).val()+"/"+this.getGoodsInfo(i).data("adtn-cost-nos"));
                      if (this.getGoodsInfo(i).parent().find("input[name=promExchPsb]").eq(i).val() == "F") {
                          getGoodsCnt++;
                      }
                  }
                  
              }
              
              
//              console.log("getGoodsCnt="+getGoodsCnt);
              // #4. "BUY군 수량 / N개"가 GET군 수량 일치 여부 확인
              //returnCode = (buyQty < buyCondStrtQtyAmt && !(getQty > 0)) ? 'Y' : (getGoodsCnt >0 ? 'T' :  (getQty == Math.floor(buyQty / buyCondStrtQtyAmt) ? returnCode : 'N:2'));
              returnCode = (buyQty < buyCondStrtQtyAmt && !(getQty > 0)) ? 'Y' : (getQty == Math.floor(buyQty / buyCondStrtQtyAmt) ? returnCode : ( (getQty < Math.floor(buyQty / buyCondStrtQtyAmt)  && getGoodsCnt >0) ?'T':'N:2'));
          }
          return returnCode;
      }
      /**
       * @desc    : WMS 주문 검수 상태 체크
       */
      , olonStatusCheckCnt : 0
      , fn_callWmsStatus : function() {
//          console.log('# fn_callWmsStatus # 함수 호출');

          var preInvNo = '';
          this.olonStatusCheckCnt = 0;
          
          for(var i = 0; i < this.getGoodsListSize; i++) {
              
              if(this.olonStatusCheckCnt > 0) {
                  return false;
              }

              // ORD_PRGS_STAT_CD(40:출하지시), DLV_SHP_CD(20:센터,30:업체)
              if($("#ord-prgs-stat-cd-" + i).val() === "40"
                  && $("#check-" + i).is(":checked")
                  && $("#dlv-shp-cd-" + i).val() === "20") {
                  
                  var invNo = $("#inv-no-"+i).val();
                  
                  if(!invNo.isEmpty() && preInvNo != invNo ) {

                      var isCancelAllGoods    = false;
                      var realQty             = $("#real-qty-"+i).val();
                      var clmQty              = $("#ord-qty-"+i).val();
                      if(realQty == clmQty) {
                          isCancelAllGoods    = true;
                      }
                      var parameter           = {};
                      parameter.ordNo         = $("#ord-no").val();
                      parameter.cancelQtyYn   = isCancelAllGoods ? "N" : "Y";
                      parameter.invNo         = $("#inv-no-"+i).val();
                      parameter.updateYn      = this.getGoodsInfo(i).find("input[name=arrUpdateYn]").val();
    
                      _ajax.sendJSONRequest(
                              "POST"
                              , _baseUrl + "mypage/checkWmsStatusChkOlon.do"
                              , parameter
                              , this.fn_requestCallbackWms
                              , false
                      );
                      
                      preInvNo = invNo;
                  }
              }
          }
          return this.olonStatusCheckCnt > 0 ? false : true;
      }
      , fn_requestCallbackWms : function(res) {
//          console.log('# fn_requestCallbackWms # 함수 호출');

          var that          = mmypage.orderCancel;
          var obj           = res;
          var olonStatus    = obj.olonStatus;
          var wmsErrMsg     = obj.wmsErrMsg;
          var updateYn      = obj.updateYn;

          if(wmsErrMsg !== null && wmsErrMsg !== "") {
              alert(wmsErrMsg);
              that.olonStatusCheckCnt++;

              return false;
          }

          if('Y' == updateYn) {     // 부분할당
              if(olonStatus > 0) {  // 부분할당 + 수량변경
                  if(olonStatus < 4) {
                      alert("상품준비가 시작되어 수량 단위 부분취소가 불가능합니다.");
                  } else {
                      alert("상품준비가 시작되어 취소가 불가능합니다.");
                  }
                  that.olonStatusCheckCnt++;
                  return false;
              }
          } else {
              if(olonStatus > 1) {
                  alert("상품준비가 시작되어 취소가 불가능합니다.");
                  that.olonStatusCheckCnt++;
                  
                  return false;
              }
          }
      }
      , fn_isAllCheck : function(idx1, idx2) {
//          console.log('# fn_isAllCheck # 함수 호출');

          var idxE = typeof idx2 == "undefined" ? idx1+1 : idx2;
          var isAllCheck = true;
          for(var idx=idx1; idx<idxE; idx++) {
              isAllCheck = isAllCheck && $("#check-" + idx).is(":checked");
          }
          return isAllCheck;
      }
      /**
       * @desc    : BUY, GET 수량 체크
       * @param   : {
       *      isBuyGoods  : BUY상품 여부
       *      idx         : 현재 INDEX
       *      isTotal     : TOTAL COUNT 여부
       * }
       */
      , fn_getGoodsQty : function(isBuyGoods, idx, isTotal) {
//        console.log('# fn_getGoodsQty # 함수 호출');

          var idxS = this.fn_getPromGoodsIndexS(idx);
          var idxE = this.fn_getPromGoodsIndexE(idx);
          var isCheck = false;
          var totBuyQty = 0;
          var buyQty = 0;
          var getQty = 0;
          
          if(isBuyGoods) {
              for(var i=idxS; i<idxE; i++) {
                  totBuyQty += Number(this.getGoodsInfo(i).find("input[name=arrRealQty]").val());
                  if($("#check-" + i).is(":checked")) {
                      buyQty += Number(this.getGoodsInfo(i).find("input[name=arrOrdQty]").val());
                  }
              }
          } else {
              var $obj = $("#goods-"+idxE);
              $.each($obj.find("input[name=arrOrdQty]"), function(n) {
                  if($obj.find("input[name=arrPromCheck]").eq(n).is(":checked")) {
                      getQty += Number($(this).val());
                  }
              });
          }
          
          return isBuyGoods ? (isTotal ? totBuyQty : buyQty) : getQty;
      },
      // 부분취소 관련 추가 함수들 <//END>
      
      /**
       *  결제수단 점검 확인
       */
      checkRfdActnSystemJson : function (rfdBnkCd) {
          if(!!rfdBnkCd) {
              var param = {
                      rfdBnkCd : rfdBnkCd
              };
              
              _ajax.sendRequest("POST"
                      , _baseUrl + "mypage/checkRfdActnSystemJson.do"
                      , param
                      , mmypage.orderCancel.checkRfdActnSystemJsonCallback
              );
          }
      },
      

      /**
       *  결제수단 점검 확인
       */
      checkRfdActnSystemJsonCallback : function (res) {
          var data = (typeof res !== 'object') ? $.parseJSON(res) : res;
              
          // 로그인
          if(data.returnCd == '100') {
              alert("로그인이 필요합니다.");
              location.href = _secureUrl + "login/loginForm.do";
              
          // 실패
          } else if(data.returnCd != '000' && !!data.errorMsg) {
              alert(data.errorMsg);
          }
      }
};

$.namespace('mmypage.orderCancelComplete');
mmypage.orderCancelComplete = {
        goOrderList : function(){
            $(location).attr('href', _baseUrl + 'mypage/getOrderList.do');
        },
        
        goCancelList : function(){
            $(location).attr('href', _baseUrl + 'mypage/getOrderCancelList.do');
        },
        
        goMypageMain : function(){
            $(location).attr('href', _baseUrl + 'mypage/myPageMain.do');
        }
};

$.namespace('mmypage.orderCancelStore');
mmypage.orderCancelStore = {
	usrLat : "",
	usrLng : "",
	geoFlag : "Y",
	searchType : "",
	isNearAvail : true,
	isFirstPopup : true,
	isGeoLocationCall : false,
	isGeoLocation : true,
	favorObj : null,
	isProcessing: false,
	dimClickCnt : 0,
	favorCount : 0,
	buttonStarClickCnt : 0, //관심매장 등록 클릭 수
    buttonStarClickPreStoreNo : "", //관심매장 등록 이전 클릭 매장번호
	init : function (){
		mmypage.orderCancelStore.addButtonEvent();
	},
	addButtonEvent : function (){
		$(".returnPop").click(function() {
			if(mmypage.orderCancelStore.isFirstPopup){
				mmypage.orderCancelStore.isFirstPopup = false;
				// 앱여부 확인 및 위치 정보 허용여부 확인[s]
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
						
						mmypage.orderCancelStore.isNearAvail = false;
						
					}
				}
				if(common.app.appInfo.isapp){
					location.href = "oliveyoungapp://getLocationSettings";
					localStorage.setItem("useLoc", "Y");
				}else{
					localStorage.setItem("useLoc", "Y");
				}
				// 앱여부 확인 및 위치 정보 허용여부 확인[e]
				
				if(localStorage.getItem("searchType") != null){
					$("#searchType").val(localStorage.getItem("searchType"));
				}
				
				if(localStorage.getItem("tab") != null){
					$("#tabType").val(localStorage.getItem("tab"));
				}
				if(localStorage.getItem("searchWord") != null){
					$("#searchWord").val(localStorage.getItem("searchWord"));
				}
				localStorage.removeItem("tab");
				localStorage.removeItem("searchType");
				
			}
			common.setScrollPos();
			mmypage.orderCancelStore.searchReturnStore();
		});
	},
	//반품 가능 매장 찾기 팝업 오픈
	searchReturnStore : function(obj, prevPopup){
		var params = {};
		
		if(obj != undefined){
			params = $(obj).data();
		}
		if(prevPopup != undefined){
			params.prevPopup = prevPopup;
		}
		
		$(".no_stores_div").hide();
		$(".showNearDiv").hide();
		
		_ajax.sendRequest(
				"POST"
				,_baseUrl + "mypage/getReturnStorePop.do"
				,params
				, function(data){
					$("#pop-full-wrap-retstr").html(data);
					mmypage.orderCancelStore.popFullOpen();
					
					mmypage.orderCancelStore.bindButtonInit();
					$("#searchAreaButton").click();
				}
				,false
		);
	},
	
	closePopup : function(obj, prevPopup, id) {
		if(id != undefined && id != ''){
			mmypage.orderCancelStore.popFullClose(id);
		}else{
			mmypage.orderCancelStore.popFullClose();
		}
    	if(obj != undefined && prevPopup != undefined){
    		if(prevPopup == 'cancelCausPop'){
    			mmypage.common.showCancelCausInfo(obj,'N');
    		}else if(prevPopup == 'searchTrackingPop'){
    			mmypage.common.searchTrackingPop(obj,'N');
    		}
    	}
	},
	
    popFullOpen : function(id, title) {
        $(window).scrollTop(0.0); // 추가부분

        $('body').css({
            'background-color' : '#fff'
        }); /* 2016-12-12 퍼블리싱 수정 반영 */
        if(id != undefined && title != undefined){
        	$('#pop-full-title', $("#pop-full-wrap")).html(title);
        	$('#'+id+'').show();
        }else{
        	$('#pop-full-wrap-retstr').show();
        }
        $('#mWrapper').hide();
    },

    popFullClose : function(id) {
        $('body').css({
            'background-color' : '#eee'
        }); /* 2016-12-12 퍼블리싱 수정 반영 */
        if(id != undefined && id != ''){
        	$('#'+id+'').hide();
        }else{
        	$('#pop-full-wrap-retstr').hide();
        }
        $('#mWrapper').show();
    },
	
	//팝업 관련 버튼 이벤트
	bindButtonInit : function (){
		//탭 이동
		$("#mTab > li > a").unbind("click").click(function(e){
			e.preventDefault();
			
			var id = $(this).attr("id");
			$("#flagSearch").val(id);
			
			$("#mTab > li > a").removeClass("on");
			$(this).addClass('on');
			
			$('.reShop_search:eq('+ $(this).parent().index() +')').show().siblings('.reShop_search').hide();
			$('.reShop_con:eq('+ $(this).parent().index() +')').show().siblings('.reShop_con').hide();
			
			// 지역검색, 직접검색 구분한다 
			if(id == "areaSearch"){
				mmypage.orderCancelStore.searchStoreMain('area');
			}else if(id == "wordSearch"){
				mmypage.orderCancelStore.searchStoreMain('word');
			}
		});
		
		// 지역검색 - 지역 선택시 이벤트
		$("#mainAreaList").change(function(e){
			e.preventDefault();
			mmypage.orderCancelStore.getSubAreaListAjax();
		});
		// 지역검색 - 시/군/구 선택시 이벤트
		$("#subAreaList").change(function(e){
			if ($(this).val() != 'none'){
				$("#subAreaList").addClass("act");
			}
			else {
				$("#subAreaList").removeClass("act");
			}
		});
		// 직접검색 검색버튼 클릭
		$("#searchWordDiv .btn_sch").click(function(e){
			e.preventDefault();
			mmypage.orderCancelStore.searchStoreMain('word');
		});
		// 지역검색 검색버튼 클릭
		$("#searchAreaButton").click(function(e){
			e.preventDefault();
			mmypage.orderCancelStore.searchStoreMain('area');
		});
		//검색어 삭제 버튼 이벤트
        $('.sch_field4').find('.btn_sch_del').on({
            'click' : function(e){
                e.preventDefault();
                $(this).removeClass('on').parent().find('input[type="text"]').val('').focus();
                var _input = $(this).parent().find('input[type="text"]');
                mmypage.orderCancelStore.fnSearchSet(_input);
            }
        });
        
        // 직접검색, 판매매장 찾기 검색바 이벤트
        $('.sch_field4').find('input[type="text"]').on({
            'keyup' : function(){
            	mmypage.orderCancelStore.fnSearchSet($(this));
            },
            'focusin' : function(){
            	mmypage.orderCancelStore.fnSearchSet($(this));
            }
        });
	},
	// 검색 이벤트 발생 시 type에 따라 분기하여 매장 리스트 불러오기
	searchStoreMain : function(type){
		
		PagingCaller.destroy();
		mmypage.orderCancelStore.searchType = type;
		
		var searchWord = $("#searchWord").val();
		var rgn1 = $("#mainAreaList option:selected").val();
		var rgn2 = $("#subAreaList option:selected").val();
		var useLoc = localStorage.getItem("useLoc") == 'Y' ? true : false;
		
		var valitation = false; 
		if(type == "word" && common.isEmpty(searchWord)){
			valitation = true;
		}else if(type == "area" && rgn1 == 'none'){
			valitation = true;
		}
		
		if(valitation && useLoc){
			/*검색어 없을 시 전체 매장 조회*/
			if (navigator.geolocation) {
				mmypage.orderCancelStore.isGeoLocationCall = true;
				navigator.geolocation.getCurrentPosition(mmypage.orderCancelStore.onSuccessGeolocation, mmypage.orderCancelStore.onErrorGeolocation, {timeout: 10000});
			} else {
				document.getElementById("map").innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
			}
		}else{
			PagingCaller.init({
				callback : function(){
					var param = {
							pageIdx    : PagingCaller.getNextPageIdx(),
							searchType : type,
							searchWord : searchWord,
							rgn1 : rgn1,
							rgn2 : rgn2,
							usrLat : $("#usrLat").val(),
							usrLng : $("#usrLng").val(),
							strRetYn : "Y"
					}
					common.Ajax.sendJSONRequest(
							"GET"
							, _baseUrl + "store/getStoreListJson.do"
							, param
							, mmypage.orderCancelStore._callbackSearchStoreListAjax);
				}
			,startPageIdx : 0
			,subBottomScroll : 700
			,initCall : true
			});
		}
		$('html, body').scrollTop(0);
	},
	//응답받은 데이터를 노출시킨다
	_callbackSearchStoreListAjax : function (strData){
		var type = mmypage.orderCancelStore.searchType;
		
		if(strData.pageIdx == 1){
			if(type == 'word'){
				$("#searchWordDiv .reShop_result").remove();
			}else if(type == 'area'){
				$("#searchAreaDiv .reShop_result").remove();
			}
			
			var $dlResult = $("<dl>").addClass("reShop_result");
			$ddCount = $("<dd class='no_ico'>").text(strData.totalCount+_messageCount2);
			
			$dlResult.append($ddCount);
			
			if(type == 'word'){
				$("#searchWordDiv").append($dlResult);
				$("#storeListByWord").find(".mlist-reShop").empty();
			}else if(type == 'area'){
				$("#searchAreaDiv").append($dlResult);
				$("#storeListByArea").find(".mlist-reShop").empty();
			}
		}
		
		$("#noStoreList").hide();
		
		var length = 0; 
		if(!common.isEmpty(strData.storeList)){
			length = strData.storeList.length;
		}
		
		if(length > 0){
			if(type == 'word'){
				mmypage.orderCancelStore.makeStoreList($("#storeListByWord").find(".mlist-reShop"),strData.storeList,type);
			}else if(type == 'area'){
				mmypage.orderCancelStore.makeStoreList($("#storeListByArea").find(".mlist-reShop"),strData.storeList,type);
			}
		}else{ //조회된 리스트가 없는 경우 
			if(strData.pageIdx == 1){
				if(type == 'word'){
					$("#searchWordDiv").find(".reShop_result > dd").remove();
				}else if(type == 'area'){
					$("#searchAreaDiv").find(".reShop_result > dd").remove();
				}
				
				$("#noStoreList").css("display","block");
			}
			PagingCaller.destroy();
		}
	},
	// Ajax로 가져온 매장목록을 그려줌. (직접검색, 지역검색)
	makeStoreList :  function(area, list, type){
		var dispArea = area;
		var dispList = list;
		var dispType = type;
		
		$.each(dispList, function(index, element){
			
			var tmpDist;
			
			tmpDist = Number(element.dist) + "km";
			
			if(!mmypage.orderCancelStore.isGeoLocation) {
				tmpDist = "";
			}
			
			var $li = $("<li>");
			var idNmTxt = [element.strNo]
			if(dispType == 'word'){
				idNmTxt.push("li_word");
			}else{
				idNmTxt.push("li_area");
			}
			$li.attr("id",idNmTxt.join(""));
			var $divReInner = $("<div>").addClass("li_reInner");
			
			var $h4Tit = $("<h4>").addClass("tit");
			var $a = $("<a>").attr("href","javascript:;").text(element.strNm);
			
			var $buttonMap = $("<button>").addClass("mapOp");
			$buttonMap.click(function(){mmypage.orderCancelStore.storeMapInit(element.lat, element.lng, element.strNo, $(this), dispType)});
			$a.click(function(){mmypage.orderCancelStore.storeMapInit(element.lat, element.lng, element.strNo, $buttonMap, dispType);});
			
			$h4Tit.append($a);
			$h4Tit.append($buttonMap);
			
			var $spanDist = $("<span>").addClass("reShop_way").text(tmpDist);
			$h4Tit.append($spanDist);
			$divReInner.append($h4Tit);
			
			var $pAddr = $("<p>").addClass("addr");
			if(!common.isEmpty(element.addr)){
				$pAddr.text(element.addr);
			}
			$divReInner.append($pAddr);
			
			var $divArea = $("<div>").addClass("area");
			$divReInner.append($divArea);
			
			var $divStoreTime = $("<div>").addClass("storeTime").text("영업시간 "+element.strBizInfo);
			$divArea.append($divStoreTime);
			
			if(!common.isEmpty(element.phon)){
				var $buttonCall = $("<button>").addClass("call").text(element.phon);
//				$buttonCall.click(function(){mmypage.orderCancelStore.setCallEvent($(this));});
				$divArea.append($buttonCall);
			}
			
			if(!common.isEmpty(element.openYn)){
				var $divOpenYn;
				if(element.openYn == 'Y'){
					$divOpenYn = $("<div class='time on'>").text("영업중");
				}else{
					$divOpenYn = $("<div class='time'>").text("영업준비중");
				}
				$divArea.append($divOpenYn);
			}
			
			var $divMapArea = $("<div class='api_mapArea'>");
			$divMapArea.css('display', 'none');
			var $divStoreWay = $("<div class='store_wayP'>");
			if(dispType == 'word'){
				$divStoreWay.attr('id',element.strNo+'map_word');
			}else{
				$divStoreWay.attr('id',element.strNo+'map_area');
			}
			
			$divMapArea.append($divStoreWay);
			$divReInner.append($divMapArea);
			
			var $inputStrNo = $("<input>").attr("type","hidden").attr("name","storeNo").val(element.strNo);
			var $inputStrLat = $("<input>").attr("type","hidden").attr("name","strLat").val(element.lat);
			var $inputStrLng = $("<input>").attr("type","hidden").attr("name","strLng").val(element.lng);
			var $inputDist = $("<input>").attr("type","hidden").attr("name","strDist").val(tmpDist);
			
			$li.append($divReInner);
			$li.append($inputStrNo);
			$li.append($inputStrLat);
			$li.append($inputStrLng);
			$li.append($inputDist);
			
			dispArea.append($li);
		});
	},
	// 매장상세 페이지 이동
	setMapEvent : function(strNo, dist, openYn){
		var $tabList = $("#TabsOpenArea li");
		
		var mainAreaIdx = $("#mainAreaList option").index($("#mainAreaList option:selected"));
		var subAreaIdx = $("#subAreaList option").index($("#subAreaList option:selected"));
		
		if(mainAreaIdx != 0){
			sessionStorage.setItem("mainAreaIdx", mainAreaIdx);
		}
		if(subAreaIdx != 0){
			sessionStorage.setItem("subAreaIdx", subAreaIdx);
		}
		
		if($tabList.eq(0).find("a").hasClass("on")){
			localStorage.setItem("tab", "wordTab");
			localStorage.setItem("searchWord", $("#searchWord").val());
		}else if($tabList.eq(1).find("a").hasClass("on")){
			localStorage.setItem("tab", "areaTab");
		}else if($tabList.eq(2).find("a").hasClass("on")){
			localStorage.setItem("tab", "favorTab");
		}else{
			localStorage.setItem("tab", "itemTab");
		}
		
		localStorage.setItem("searchType", $("#searchType").val());
		
		localStorage.setItem("openYn", $("#openYn").val());
		localStorage.setItem("tcCd", $("#tcCd").val());
		localStorage.setItem("psCd", $("#psCd").val());
		
		common.link.moveStoreDetailPage(strNo, dist, openYn);
	},
	
	// 매장 위치 지도에서 확인하기 
	storeMapInit : function(lat, lng, strNo, obj, type) {
		var $listUl;
		var $divMap;
		if(type == 'word'){
			$listUl = $("#storeListByWord").find(".mlist-reShop");
			$divMap = $("#"+strNo + "map_word");
		}else{
			$listUl = $("#storeListByArea").find(".mlist-reShop");
			$divMap = $("#"+strNo + "map_area");
		}
		
        try {
            if (obj.hasClass("on")) {
            	$divMap.parent().slideToggle();
            }
            else {
                if($divMap.hasClass("load")) {
                    $(".mapOp", $listUl).removeClass("on");
                    $(".store_wayP", $listUl).parent().hide();
                    $divMap.parent().slideToggle();
                }
                else {
                    if(!common.isEmpty(lat) && !common.isEmpty(lng)) {
                        $(".mapOp", $listUl).removeClass("on");
                        $(".store_wayP", $listUl).parent().hide();
                        $divMap.parent().slideToggle();
                        var mapContainer = document.getElementById(strNo+'map_'+type) // 지도 영역
                        var mapOption = {
                            center: new daum.maps.LatLng(lat, lng), // 지도 중심좌표(위도,경도)
                            level: 2 // 지도 확대 레벨
                        };
                        var map = new daum.maps.Map(mapContainer, mapOption); // 지도 생성
                        var markerImage = new daum.maps.MarkerImage(_imgUrl + 'comm/point_way.png' , new daum.maps.Size(21, 31)); // 마커 이미지 생성
                        
                        var markerPosition = new daum.maps.LatLng(lat, lng); // 마커 위치
                        var marker = new daum.maps.Marker({
                            map: map, // 마커를 표시할 지도
                            position: markerPosition,
                            image : markerImage // 마커 이미지
                        }); // 마커 생성
                        marker.setMap(map); // 마커 표시
                        $divMap.addClass("load");
                    }
                }
            }
            obj.toggleClass("on");
        }
        catch(e) {
            console.log(e);
            $(".mapOp", $listUl).removeClass("on");
            $(".store_wayP", $listUl).parent().hide();
        }
    },
	
	// 매장 관심 등록/해제 이벤트
	setStarEvent : function(obj){
		var activeFlag = obj.hasClass('on');
		var strNo = obj.parent().nextAll("input[name*='storeNo']").val();
		if (activeFlag == true){
			mmypage.orderCancelStore.delFavorStoreAjax(strNo , obj);
		}else{
			mmypage.orderCancelStore.regFavorStoreAjax(strNo , obj);
		}
	},
	// 매장 관심 해제 Ajax
	delFavorStoreAjax : function(strNo , obj) {
		if(!mmypage.orderCancelStore.logincheck(strNo)){
			return;
		}
		
		if(mmypage.orderCancelStore.isProcessing) {
			mmypage.orderCancelStore.isProcessing = true;
			return false;
		}
		
		mmypage.orderCancelStore.favorObj = $(obj);
		
		common.Ajax.sendJSONRequest(
				"POST"
				, _baseUrl + "store/delFavorStoreJson.do"
				, "strNo="+ strNo
				, mmypage.orderCancelStore._callback_delFavorStoreAjax
				, false);
	},
	
	//매장 관심 해제 Callback
	_callback_delFavorStoreAjax : function(strData) {
		if(strData.ret == "0"){
			common.gnb.callSlideMenuAjax();
			var onFlag = mmypage.orderCancelStore.favorObj.hasClass("on");
			var favorCountObj = (mmypage.orderCancelStore.favorObj.parent(".li_reInner").length > 0) ?
					mmypage.orderCancelStore.favorObj.parent(".li_reInner").find(".fv_reShop_in").find("span") :
						mmypage.orderCancelStore.favorObj.parents().find(".fv_reShop_in").find("span");
					if(onFlag) {
						var cnt = parseInt(replaceAll(favorCountObj.text(), ',', ''))-1;
						favorCountObj.text(cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
						mmypage.orderCancelStore.favorObj.removeClass("on");
						mmypage.orderCancelStore.favorObj.addClass("active");
					}
					
					mmypage.orderCancelStore.favorCount --;
					
					if($(".reShop_favInner").length > 0 ) {
						var cnt = parseInt($(".reShop_favInner").find("span").find("b").text())-1;
						$(".reShop_favInner").find("span").find("b").text(cnt);
					}
		}else{
			common.loginChk();
		}
		mmypage.orderCancelStore.isProcessing = false;
	},
	// 매장 관심 등록 Ajax
    regFavorStoreAjax : function(strNo, obj) {
        mmypage.orderCancelStore.buttonStarClickPreStoreNo = strNo;
        
        if(mmypage.orderCancelStore.isProcessing){
            mmypage.orderCancelStore.isProcessing = true;
            return false;
        }
        
        if(!mmypage.orderCancelStore.logincheck(strNo)){
            mmypage.orderCancelStore.buttonStarClickCnt = 0;
            mmypage.orderCancelStore.buttonStarClickPreStoreNo = "";
            return;
        }

        if(mmypage.orderCancelStore.favorCount  >= 3){
            alert(_messageLimit);
            mmypage.orderCancelStore.buttonStarClickCnt = 0;
            mmypage.orderCancelStore.buttonStarClickPreStoreNo = "";
            return;
        }
        
        mmypage.orderCancelStore.favorObj = $(obj);
        
        common.Ajax.sendJSONRequest(
                "POST"
                , _baseUrl + "store/regFavorStoreJson.do"
                , "strNo="+ strNo
                , mmypage.orderCancelStore._callback_regFavorStoreAjax
                , false);
    },
    
    // 매장 관심 등록 Callback
    _callback_regFavorStoreAjax : function(strData) {
        if(strData.ret == "0" || strData.ret == "20" || strData.ret == "30"){
            common.gnb.callSlideMenuAjax();
        }else if(strData.ret == "40"){
            // 관심매장 쿠폰 첫 1회 발급
            mmypage.orderCancelStore.dimClickCnt++;
            
            $("#linkUrl").prop('href', "javascript:common.link.commonMoveUrl('"+strData.linkUrl+"');");
            $("#layerPop").html($("#storeEvtLayer").html());
            $("#layerPop").removeClass('popInner');
            
            common.popLayerOpen("LAYERPOP01");
        }else if(strData.ret == "10") {
            var onFlag = mmypage.orderCancelStore.favorObj.hasClass("active");
            var favorCountObj = (mmypage.orderCancelStore.favorObj.parent(".li_reInner").length > 0) ?
                    mmypage.orderCancelStore.favorObj.parent(".li_reInner").find(".fv_reShop_in").find("span") :
                    mmypage.orderCancelStore.favorObj.parents().find(".fv_reShop_in").find("span");
            if(onFlag) {
                var cnt = parseInt(replaceAll(favorCountObj.text(), ',', ''))+1;
                favorCountObj.text(cnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                mmypage.orderCancelStore.favorObj.removeClass("active");
                mmypage.orderCancelStore.favorObj.addClass("on");
            }
            
            mmypage.orderCancelStore.favorCount ++;
            if($(".reShop_favInner").length > 0 ) {
                var cnt = parseInt($(".reShop_favInner").find("span").find("b").text())+1;
                $(".reShop_favInner").find("span").find("b").text(cnt);
            }
        } else{
            common.loginChk();
        }
        mmypage.orderCancelStore.isProcessing = false;
    },
	// 전화 아이콘 클릭 이벤트
	setCallEvent :  function(obj){
		var phoneNum = obj.text();
		$(location).attr('href', "tel:"+ phoneNum);
	},
	// GPS 수신유무에 따른 매장목록 불러오기 Ajax
	storeListAjax : function(geoFlag , position){
		
		if(mmypage.orderCancelStore.isGeoLocationCall){
			mmypage.orderCancelStore.isGeoLocationCall = false;
		}else{
			return;
		}
		var lat = null;
		var lon = null;
		
		if(geoFlag) {
			lon=  position.coords.longitude;//경도
			lat = position.coords.latitude;//위도
			$("#usrLat").val(lat);
			$("#usrLng").val(lon);
		} else {
			localStorage.setItem("useLoc", "N");
			mmypage.orderCancelStore.isGeoLocation = false;
			$(".useLocRecom").hide(); 
		}
		
		PagingCaller.destroy();
		
		PagingCaller.init({
			callback : function(){
				var param = {
						pageIdx    : PagingCaller.getNextPageIdx(),
						searchType : mmypage.orderCancelStore.searchType,
						usrLat : $("#usrLat").val(),
						usrLng : $("#usrLng").val(),
						strRetYn : "Y"
				}
				_ajax.sendJSONRequest(
						"GET"
						, _baseUrl + "store/getStoreListJson.do"
						, param
						, mmypage.orderCancelStore._callbackSearchStoreListAjax);
			}
		,startPageIdx : 0
		,subBottomScroll : 700
		,initCall : true
		});
	},
	// 직접검색 검색바 엔터 이벤트
	searchStoreList :  function(e){
		if (e.keyCode != 13) {
			return;
		}
		e.preventDefault();
		$("#searchWord").blur();
		$("#searchType").val("word");
		mmypage.orderCancelStore.searchStoreMain('word');
	},
	// 지역검색 지역 선택시 Ajax
	getSubAreaListAjax : function() {
		var rgn1 = $("#mainAreaList option:selected").val();
		if (rgn1 != 'none'){
			$("#mainAreaList").addClass("act");
			common.Ajax.sendJSONRequest(
					"POST"
					, _baseUrl + "store/getStoreSubAreaListJson.do"
					, "rgn1="+ rgn1
					, mmypage.orderCancelStore._callback_getSubAreaListAjax
					, false);
		}
		else {
			$("#mainAreaList").removeClass("act");
			$("#subAreaList").find("option:eq(0)").prop("selected", true);
			$("#subAreaList").find("option:eq(0)").siblings().remove();
		}
		$("#subAreaList").removeClass("act");
	},
	// 지역검색 지역 선택시 Callback
	_callback_getSubAreaListAjax : function(retData) {
		$('#subAreaList').attr('disabled', false);
		if(retData == ''){
			$('#subAreaList').attr('disabled', true);
		}
		mmypage.orderCancelStore.makeSelectboxList($("#subAreaList"),_optionRgn2,retData);
	},
	// 서브지역 동적생성
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
	// 로그인 체크
	logincheck : function(strNo){
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
	// 지오로케이션 사용O Calback
	onSuccessGeolocation : function(position) { //Geolocation succ
		setTimeout(function() { 
			mmypage.orderCancelStore.storeListAjax(true,position);
		}, 500);
	},
	//지오로케이션 사용X Calback
	onErrorGeolocation : function(error) { //Geolocation error
		setTimeout(function() {
			mmypage.orderCancelStore.storeListAjax(false,null);
		}, 500);
	},
	// 검색바 이벤트
    fnSearchSet : function (obj){
        if(obj.val() != '' && obj.val() != null){
            obj.parent().find('.btn_sch_del').addClass('on');
        }
        else{
            obj.parent().find('.btn_sch_del').removeClass('on');
        }
    },
    // 매장반품 서비스 안내 열기
    openQuickPop : function(){
    	$(window).scrollTop(0.0); //추가부분
        $('#pop-full-title').html("오늘드림 서비스 안내");
        $('body').css({'background-color' : '#fff'}); /* 2016-12-12 퍼블리싱 수정 반영 */
        $('#infoStoreReturnQuestion').hide();
        $('#pop-full-wrap').empty().html($('#infoStoreReturnQuestion').html());
        $('#pop-full-wrap').show();
        $('#mWrapper').hide();
        $(document).scrollTop(0);
        closeBtnAction = function(){
            $('#mWrapper').css('display','block');
            $('#pop-full-wrap').empty();
            $('#infoStoreReturnQuestion').hide();
        }
    }
};
var imgCallSize = 0;

$.namespace('mmypage.claimFileAttached');
mmypage.claimFileAttached = {
        init : function(){
            //파일첨부 웹에서 테스트시 필요. 추후 앱 변경시 삭제예정
            $(".addFile").click(function(){
                if(common.app.appInfo.ostype=="20"){
                    if (!$("#fileName span").html().isEmpty()) {
                        alert("파일은 1개만 등록 가능합니다!");
                        return false;
                    }
                } else {
                    if(!common.isEmpty($(".ql-image").val())){
                        alert("파일은 1개만 등록 가능합니다!!");
                        return false;
                    }
                }   
                
                    
                
                    
                if (common.app.appInfo.isapp) {
                    if(common.app.appInfo.ostype=="20"){
                        //alert("ostype=["+common.app.appInfo.ostype+"]appVer=["+common.app.appInfo.osver.substring(0,1)+"]");
                        if (common.app.appInfo.osver.substring(0,1) < 5) {
                            common.app.callImgSelector();
                        } else {
                            common.app.callImgSelector();
                            //$('#evalfile').click(); // 멀티 선택
                        }
                        
                        
                        
                    }else{
                        common.app.callImgSelector();
                    }
                } else {
                  
                    $('#evalfile').click();
                }
                 
            });
            
            
             // 파일첨부시 파일명 노출
             $(".ql-image").change(function() {
                 try{
                     var fileNm = "";
                     var fileSize = "";
                     var agent = navigator.userAgent.toLowerCase();
                     if (common.app.appInfo.ostype=="20") {
                         var fileInput    = document.querySelector('input#evalfile[type=file]');
                     } else {
                         var fileInput    = document.querySelector('input.ql-image[type=file]');
                     }
                     var file = fileInput.files[0];
                     var fileExt = /.(bmp|jpg|jpeg|gif|png)$/i;
                     
                     fileNm = file.name;
                     fileSize = file.size;
                          //5 * 1024 * 1024
//                     console.log('fileSize=['+fileSize+']');
                     if (fileSize > 5242880) {
                         $("#fileName span").html("");
                         $(".ql-image").val("");
                         alert("5MB미만의 이미지 파일만 첨부할 수 있습니다.");
                         return;
                     }
                     
                     
                     
                     if ( !common.isEmpty(fileNm) && !fileExt.test(fileNm)) {
                         $(".ql-image").val("");
                         alert("첨부하신 파일을 다시 한번 확인해 주세요.\n\n5MB이하의 이미지 파일(JPG,PNG,GIF)\n1개 첨부하실 수 있습니다.");
                         return;
                     }
                
                     if (!common.isEmpty($(".ql-image").val())) {
                         if (fileNm.length > 10) {
                             $("#fileName span").attr("title",fileNm);
                             fileNm = fileNm.substr(0,10)+"...";
                         }
                         $("#fileName").show();
                         $(".area_file").attr("style","display:");
                         $("#fileName span").html(fileNm);
                         $("#btnFileDelete").show();
                         
                     } else {
                         $("#btnFileDelete").hide();
                         $("#fileName").hide();
                     }
                     
                     
                     var canvasImg = new Image();
                     
                     canvasImg.onload = function(e) {
                         //canvas에 선택한 이미지 draw
                         var canvas = document.getElementById('canvas');                
                         var ctx = canvas.getContext('2d');
            
                         //배율
                         var magnification = 1;
            
                         //500픽셀에 맞도록 배율 조정
                         var imageResizeWidth = 700;
                         if (this.width > imageResizeWidth) {
                             magnification = imageResizeWidth / this.width;
                         }
            
                         canvas.width = this.width * magnification;
                         canvas.height = this.height * magnification;
            
                         ctx.imageSmoothingEnabled = true;
                         ctx.mozImageSmoothingEnabled = true;
                          
                         ctx.drawImage(canvasImg, 0, 0, canvas.width, canvas.height);
                         //업로드 이미지 처리
                     }
                      
                     var reader = new FileReader();
            
                     reader.onload = function(e) {
                         try {
                             
                             canvasImg.src = e.target.result;
                             
                         } catch (e) {
                            
                             imgCheck = true;
                         }
                     }
            
                     try {
                         reader.readAsDataURL(file);
                     } catch (e) {
                         imgCheck = true;
                         
                     }
            
                 } catch(e){
                     
                     //alert('이미지 업로드 중 오류가 발생 했습니다.\n이미지 파일을 다시 업로드 해주세요.');
                     $("#cnslFileErr").val("Y");
                 }
                 
             });
            
             // 파일삭제
             $("#btnFileDelete").click(function() {
                 if (confirm("첨부파일을 삭제하시겠습니까?")) {
                     if(common.app.appInfo.ostype != "20"){
                         $(".ql-image").val("");
                     } 
                     
                     $("#fileName").hide();
                     $("#fileName span").html("");
                   //canvas에 선택한 이미지 draw
                     var canvas = document.getElementById('canvas');                
                     var ctx = canvas.getContext('2d');

                     // 픽셀 정리
                     ctx.clearRect(0, 0, canvas.width, canvas.height);
                     // 컨텍스트 리셋
                     ctx.beginPath();
                 }
             });
        } 
        
        
};

$.namespace('mmypage.common');
mmypage.common = {
	// firstFlag : 해당 팝업이 켜지는 시점이 주문리스트인지, 반품가능매장팝업이 꺼진 후 실행되는 지, 구분하는 값
	// 	- Y : 초기진입 (주문목록에서 진입)에 실행
	// 	- N : 반품가능매장팝업 닫기 후 실행
    searchTrackingPop : function(obj, firstFlag){
    	if(firstFlag != undefined && firstFlag == 'Y'){
    		common.setScrollPos2();//클릭 시, 스크롤 위치값 localstorage 저장
    	}
        var params = $(obj).data();
        var trackingUrl = "";
        
        if (params.ordDtlSctCd == "10") {
            trackingUrl = _baseUrl + "mypage/popup/getDeliveryDetail.do";
        } else if (params.ordDtlSctCd == "30" || params.ordDtlSctCd == "40") {
            trackingUrl = _baseUrl + "mypage/popup/getClaimDeliveryDetail.do";
        }
        
        // 주문/배송조회 UI 개선으로 DS 지표 추가 = [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
        if(params.ordDtlSctCd == "10"){
        	common.wlog("mypage_orderlist_delivery");
        }else if(params.ordDtlSctCd == "30"){
        	common.wlog("mypage_orderlist_return");
        }else if(params.ordDtlSctCd == "40"){
        	common.wlog("mypage_orderlist_exchange");
        }
        
        if (trackingUrl != "") {
            $('#pop-full-contents', $("#pop-full-wrap")).html("");
            $('#pop-full-contents', $("#pop-full-wrap")).load(trackingUrl, params, function() {
                if (params.ordDtlSctCd == "30") {
                	if(params.rtnProcSctCd != "" && params.rtnProcSctCd != null){
                		mmypage.orderCancelStore.popFullOpen('pop-full-wrap','반품정보 조회');
                	}else{
                		mmypage.orderCancelStore.popFullOpen('pop-full-wrap','회수조회');
                	}
                } else if (params.ordDtlSctCd == "40") {
                	mmypage.orderCancelStore.popFullOpen('pop-full-wrap','교환 회수/배송 조회');
                } else {
                	mmypage.orderCancelStore.popFullOpen('pop-full-wrap','배송조회');
                }
            });
        }
    },
    
    // firstFlag : 해당 팝업이 켜지는 시점이 주문리스트인지, 반품가능매장팝업이 꺼진 후 실행되는 지, 구분하는 값
    // 	- Y : 초기진입 (주문목록에서 진입)에 실행
    // 	- N : 반품가능매장팝업 닫기 후 실행
    showCancelCausInfo : function(obj, firstFlag){
        var params = $(obj).data();
        var popTitle = {
            20 : '주문취소 상세정보',
            30 : '반품 상세정보',
            40 : '교환 상세정보'
        };

        if(firstFlag != undefined && firstFlag == 'Y'){
        	common.setScrollPos2();//클릭 시, 스크롤 위치값 localstorage 저장
        }
        $('#pop-full-contents', $("#pop-full-wrap")).html('');
        $('#pop-full-contents', $("#pop-full-wrap")).load(_baseUrl + 'mypage/popup/getCancelCausPop.do', params, function(){
        	mmypage.orderCancelStore.popFullOpen('pop-full-wrap',popTitle[params.chgAccpSctCd == '' ? params.ordDtlSctCd : params.chgAccpSctCd]);
        	
        	//자세히보기 버튼 클릭시 매장반품주문에 대한 바코드 처리
            var rtnBarcode = $("#rtnBarcode").text();
    		if(rtnBarcode != ""){
    			if(rtnBarcode != "N"){
    				$(".barcode").barcode(rtnBarcode, "code128",{barWidth:2, barHeight:75, fontSize:14});
    			}else{
    				alert("비정상적인 접근입니다.");
    				mmypage.orderCancelStore.popFullClose('pop-full-wrap');
    			}
    		}
        });
    },

    hdcOpen : function(p1, p2) {
        try {
            var path = HDC_PATH[p1] + p2;
            window.open(path);
        } catch(e) {
            console.log(e);
        }
    },
    
    dlvInfoShow : function(obj, ordDtlSctNm) {
        var _this = $(obj);
        var _devInner = _this.siblings('.inner');
        if (_this.hasClass('on')) {
            _this.removeClass('on');
            _this.html(ordDtlSctNm + ' 상세 현황 보기<span>열기</span>');
            _devInner.removeClass('on').scrollTop(0);
        } else {
            _this.addClass('on');
            _this.html(ordDtlSctNm + ' 상세 현황 접기<span>닫기</span>');
            _devInner.addClass('on');
        }
    }
};

//마이페이지 자주 구매 상품 페이지의 페이징 기능 추가 - [3330196] 올리브영 모바일 주문목록 개선 요청(CHY)
$.namespace('mmypage.oftenOrderList');
mmypage.oftenOrderList = {
	init : function(){
		ScrollPager.init({bottomScroll : 700, callback : mmypage.oftenOrderList.getOftenOrderListJSON});
		
		$('#oftenOrdSort').change(function(){
			$("#sort").val($("#oftenOrdSort").val());
			$("#oftenPage").val("1");
			$(location).attr('href', _baseUrl + 'mypage/getOftenOrderList.do?' + $('#oftenOrdListForm').serialize());
		});
	},
	
	getOftenOrderListJSON : function(){
		ScrollPager.unbindEvent();
		var values = $('#oftenOrdListForm').serializeObject();
		
		_ajax.sendJSONRequest('GET'
			, _baseUrl + 'mypage/getOftenOrderListJSON.do'
			, values
			, mmypage.oftenOrderList.getOftenOrderListJSONCallback
		);
	},
	
	getOftenOrderListJSONCallback : function(res){
		var data = (typeof res.oftenOrderList !== 'object') ? $.parseJSON(res.oftenOrderList) : res.oftenOrderList;
		
		if(data.length < 1){
			ScrollPager.unbindEvent();
			return;
		}
		
		var html = '';
		for(var i=0; i < data.length; i++){
			var item = data[i];
			
			if(item.goodsNo == null || item.goodsNo.isEmpty()){
				html += '<li class="sold">';
				html += '	<div class="inner">';
				html += '		<div class="thum">';
				html += '			<img src="'+_imgUrl+'comm/offline_store.png" alt="' + item.goodsNm + '" onerror="common.errorImg(this);"/>';
				html += '			<span class="offline">매장전용상품</span>';
				html += '		</div>';
				html += '		<div class="info">';
				html += '			<p class="toolrbox">' + item.totRealQty + '회 구매상품</p>';
				html += '			<p class="name">' + item.goodsNm + '</p>';
				html += '			<p class="price">';
				html += '				<em>' + item.normPrc.numberFormat() + '원</em>';
				html += '			</p>';
				html += '		</div>';
				html += '	</div>';
				html += '</li>';
			}else if(item.stockQty < 1){
				html += '<li class="sold">';
				html += '	<div class="inner">';
				html += '		<div class="thum">';
				html += '			<a href="javascript:void(0);" class="prd_img" onclick="common.link.moveGoodsDetail(\'' + item.goodsNo + '\');">';
				html += '				<img src="'+ _goodsImgUploadUrl + item.thnlPathNm + '" alt="' + item.goodsNm + '" onerror="common.errorImg(this);" />';
				html += '			</a>';
				html += '			<span class="soldout">일시품절</span>';
				html += '		</div>';
				html += '		<div class="info">';
				html += '			<p class="toolrbox">' + item.totRealQty + '회 구매상품</p>';
				html += '			<p class="name">';
				html += '				<a href="javascript:void(0);" class="prd_img" onclick="common.link.moveGoodsDetail(\''+ item.goodsNo +'\');">' + item.goodsNm + '</a>';
				html += '			</p>';
				html += '			<p class="price">';
				
				if(item.supPrc != item.salePrc){
					html += '				<del>' + item.supPrc.numberFormat() + '원</del>';
					html += '				<em>' + item.salePrc.numberFormat() + '원</em>';
				}else{
					html += '				<em>' + item.supPrc.numberFormat() + '원</em>';
				}
				
				html += '			</p>';
				html += '		</div>';
				html += '	</div>';
				html += '	<div class="recom">';
				html += '		<p class="txt"><em>대신 이 상품</em> 어떠세요?</p>';
				html += '		<button type="button" class="btn_view" onClick="javascript:mcart.base.openRecoBellGoodsSoldOutPop(\'' + item.lgcGoodsNo + '\',\'' + item.goodsNo + '\', \'N\');return false;">상품보기</button>';
				html += '	</div>';
				html += '</li>';
			}else{
				html += '<li>';
				html += '	<div class="inner">';
				html += '		<div class="thum">';
				html += '			<a href="javascript:void(0);" class="prd_img" onclick="common.link.moveGoodsDetail(\'' + item.goodsNo + '\');">';
				html += '				<img src="'+ _goodsImgUploadUrl + item.thnlPathNm + '" alt="' + item.goodsNm + '" onerror="common.errorImg(this);" />';
				html += '			</a>';
				html += '		</div>';
				html += '		<div class="info">';
				html += '			<p class="toolrbox">' + item.totRealQty + '회 구매상품</p>';
				html += '			<p class="name">';
				html += '				<a href="javascript:void(0);" class="prd_img" onclick="common.link.moveGoodsDetail(\''+ item.goodsNo +'\');">' + item.goodsNm + '</a>';
				html += '			</p>';
				html += '			<p class="price">';
				
				if(item.supPrc != item.salePrc){
					html += '				<del>' + item.supPrc.numberFormat() + '원</del>';
					html += '				<em>' + item.salePrc.numberFormat() + '원</em>';
				}else{
					html += '				<em>' + item.supPrc.numberFormat() + '원</em>';
				}
				
				html += '				<button type="button" class="btn_add" onclick="common.gf_regCart(this); return false;" data-goods-no="' + item.goodsNo + '" data-item-no="' + item.itemNo + '" data-quick-yn="N" data-load-page="order" data-total-qty="1">장바구니 담기</button>';
				html += '			</p>';
				html += '		</div>';
				html += '	</div>';
				html += '</li>';
			}
		}
		
		$('#oftenList').append(html);
		$("#oftenPage").val(res.nextPage);
		$("#sort").val(res.sort);
		
		ScrollPager.init({bottomScroll : 700, callback : mmypage.oftenOrderList.getOftenOrderListJSON});
	}
}